---
title: পর্ব ১ — Django Backend ও Webhook
description: শূন্য থেকে Django REST API + WooCommerce webhook — লাইভ অর্ডার ডেটা রিসিভ করা।
icon: Server
---

> **পরিকল্পনা:** আগে WordPress (WooCommerce) আর Django backend-এর ডেটা পাইপলাইন তৈরি করে টেস্ট করি। পরে এর সাথে CrewAI এজেন্ট যুক্ত করা পানির মতো সহজ হবে।
>
> আজকের পর্বে শূন্য (০) থেকে Django REST API বানিয়ে লোকাল WordPress (WooCommerce)-এর সাথে কানেক্ট করে **লাইভ অর্ডার ডেটা রিসিভ** করা শিখব।

## এই পর্বে যা বানাবো

| ধাপ | কাজ |
| --- | --- |
| ১ | `backend` ফোল্ডারে venv + Django প্রজেক্ট + `orders` অ্যাপ |
| ২ | `settings.py`-এ DRF, CORS কনফিগার |
| ৩ | `Order` Model — অর্ডার + AI রিস্ক ফিল্ড |
| ৪ | Serializer, webhook API, অর্ডার-লিস্ট API |
| ৫ | URL রাউটিং ও সার্ভার চালু |
| ৬ | WooCommerce-এ webhook বসিয়ে ডামি অর্ডার টেস্ট |

## ধাপ ১: Django ও DRF সেটআপ

মূল প্রজেক্ট ফোল্ডার (`fraud_shield_pro`)-এর ভেতরের `backend` ফোল্ডারে ঢুকে venv আর প্রজেক্ট বানাও:

```bash
cd fraud_shield_pro/backend
python -m venv venv
```

venv অ্যাক্টিভ করো:

```bash
# Windows
venv\Scripts\activate

# Mac / Linux / Git Bash
source venv/bin/activate
```

প্রয়োজনীয় প্যাকেজ ইনস্টল ও প্রজেক্ট তৈরি:

```bash
pip install django djangorestframework django-cors-headers requests
django-admin startproject core .
python manage.py startapp orders
```

এখন `backend/` ফোল্ডারের কাঠামো এমন হবে:

```text
fraud_shield_pro/
└── backend/
    ├── venv/
    ├── manage.py
    ├── core/
    │   ├── settings.py
    │   └── urls.py
    └── orders/
        ├── models.py
        ├── views.py
        └── ...
```

## ধাপ ২: core/settings.py কনফিগার

`settings.py` খুলে `INSTALLED_APPS` আর `MIDDLEWARE`-এ নিচের লাইনগুলো যোগ করো — যাতে React আর WordPress কোনো ব্লক ছাড়াই API-তে ডেটা পাঠাতে পারে:

```python
INSTALLED_APPS = [
    # ... আগের অ্যাপগুলোর নিচে নিচের তিনটি যোগ করো
    'rest_framework',
    'corsheaders',
    'orders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # এটি সবার উপরে রাখবে
    # ... বাকি মিডলওয়্যারগুলো যেমন আছে তেমনই থাকবে
]

# সব ডোমেইন থেকে API এক্সেস করার অনুমতি (ডেভেলপমেন্টের জন্য)
CORS_ALLOW_ALL_ORIGINS = True
```

> ⚠️ `CORS_ALLOW_ALL_ORIGINS = True` শুধু ডেভেলপমেন্টের জন্য। প্রোডাকশনে গেলে নির্দিষ্ট origin-এ সীমিত করো।

## ধাপ ৩: Order Model

WordPress থেকে আসা অর্ডার এবং পরবর্তীতে AI এজেন্টের দেওয়া রিস্ক রিপোর্ট সেভ রাখতে `orders/models.py`-এ লেখো:

```python
from django.db import models

class Order(models.Model):
    RISK_CHOICES = [
        ('PENDING', 'Pending AI Check'),
        ('SAFE', 'Safe Order'),
        ('HIGH_RISK', 'High Risk / Fraud Alert'),
    ]

    wc_order_id = models.CharField(max_length=50, unique=True)
    customer_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # AI Agent পরবর্তীতে নিচের ফিল্ডগুলো আপডেট করবে
    risk_status = models.CharField(max_length=20, choices=RISK_CHOICES, default='PENDING')
    courier_success_rate = models.CharField(max_length=50, blank=True, null=True)
    ai_analysis_note = models.TextField(blank=True, null=True)
    whatsapp_sent = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.wc_order_id} - {self.customer_name} ({self.risk_status})"
```

মাইগ্রেশন চালিয়ে ডেটাবেজ টেবিল তৈরি করো:

```bash
python manage.py makemigrations
python manage.py migrate
```

## ধাপ ৪: Serializer ও Webhook API

### orders/serializers.py (নতুন ফাইল)

```python
from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
```

### orders/views.py

দুটি API — WordPress থেকে webhook রিসিভ আর React ড্যাশবোর্ডের জন্য অর্ডার লিস্ট:

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from .serializers import OrderSerializer

# ১. WordPress WooCommerce থেকে অর্ডার রিসিভ করার Webhook API
@api_view(['POST'])
def woocommerce_webhook(request):
    data = request.data

    # WooCommerce সাধারণত ping টেস্ট করার সময় 'webhook_id' পাঠায়
    if 'id' not in data:
        return Response({"message": "Webhook ping received successfully!"}, status=status.HTTP_200_OK)

    try:
        wc_order_id = str(data.get('id'))
        billing = data.get('billing', {})
        customer_name = f"{billing.get('first_name', '')} {billing.get('last_name', '')}".strip()
        phone = billing.get('phone', 'N/A')
        address = f"{billing.get('address_1', '')}, {billing.get('city', '')}".strip(', ')
        total_amount = data.get('total', 0)

        # ডেটাবেজে অর্ডার সেভ বা আপডেট করা
        order, created = Order.objects.update_or_create(
            wc_order_id=wc_order_id,
            defaults={
                'customer_name': customer_name,
                'phone': phone,
                'address': address,
                'total_amount': total_amount,
            }
        )

        # [পরের পর্বে এখানে আমরা CrewAI এজেন্ট কল করার কোড যুক্ত করব]
        print(f"New Order Received: #{wc_order_id} | {customer_name} | {phone}")

        return Response({"status": "success", "order_id": wc_order_id}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ২. ড্যাশবোর্ডে সব অর্ডার দেখার API
@api_view(['GET'])
def order_list(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
```

## ধাপ ৫: URL রাউটিং

### orders/urls.py (নতুন ফাইল)

```python
from django.urls import path
from . import views

urlpatterns = [
    path('webhook/woocommerce/', views.woocommerce_webhook, name='wc-webhook'),
    path('list/', views.order_list, name='order-list'),
]
```

### core/urls.py

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/orders/', include('orders.urls')),
]
```

সার্ভার চালু করো:

```bash
python manage.py runserver
```

| API | URL | কাজ |
| --- | --- | --- |
| Webhook | `http://127.0.0.1:8000/api/orders/webhook/woocommerce/` | WordPress অর্ডার পাঠাবে |
| List | `http://127.0.0.1:8000/api/orders/list/` | সব অর্ডার JSON |

## ধাপ ৬: WooCommerce-এর সাথে কানেক্ট

লোকাল পিসিতে (XAMPP/Laragon/LocalWP) বা লাইভ সার্ভারে WordPress ড্যাশবোর্ডে লগইন করে:

1. বাম মেনু → **WooCommerce → Settings → Advanced → Webhooks**
2. **Add webhook** ক্লিক করে তথ্য দাও:

| ফিল্ড | মান |
| --- | --- |
| Name | Fraud Shield AI |
| Status | Active |
| Topic | Order created |
| Delivery URL | `http://127.0.0.1:8000/api/orders/webhook/woocommerce/` |
| API Version | WP REST API Integration v3 |
| Secret | (ফাঁকা রাখা যায়) |

> **লোকাল WordPress `127.0.0.1` ব্লক করলে:** টার্মিনালে `ngrok http 8000` চালাও, পাওয়া HTTPS লিংকের সাথে `/api/orders/webhook/woocommerce/` জুড়ে Delivery URL-এ বসাও। তখন Django-তে `ALLOWED_HOSTS = ['*']` দরকার হবে (শুধু ডেভেলপমেন্টে)।

3. **Save webhook**

## টেস্ট

1. Django সার্ভার চালু থাকা অবস্থায় WordPress সাইটে যাও
2. যেকোনো পণ্য cart-এ নিয়ে নাম, ফোন নম্বর, ঠিকানা দিয়ে **ডামি অর্ডার** প্লেস করো
3. সাথে সাথে Django টার্মিনালে দেখবে:

```text
New Order Received: #1234 | Tanvir Ahmed | 017XXXXXXXX
```

4. ব্রাউজারে `http://127.0.0.1:8000/api/orders/list/` খুললে JSON-এ অর্ডারটা দেখবে:

```json
[
  {
    "id": 1,
    "wc_order_id": "1234",
    "customer_name": "Tanvir Ahmed",
    "phone": "017XXXXXXXX",
    "risk_status": "PENDING",
    "whatsapp_sent": false
  }
]
```

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Localhost webhook fail | `ngrok http 8000` + HTTPS URL; dev-এ `ALLOWED_HOSTS = ['*']` |
| 400 Bad Request | payload-এ `id` নেই বা JSON ভাঙা — webhook log দেখো |
| ডুপ্লিকেট অর্ডার | `update_or_create` + unique `wc_order_id` কাজ করছে কি না দেখো |
| Ping টেস্ট | "Webhook ping received successfully!" — এটাই সঠিক |
| React-এ CORS error | dev-এ `CORS_ALLOW_ALL_ORIGINS = True` |

## পরের পর্ব

ডেটা রিসিভ হচ্ছে নিশ্চিত হলে পরের ধাপে **React + Shadcn UI ড্যাশবোর্ড** বানাব — Django API থেকে অর্ডার এনে টেবিলে দেখা যাবে। তারপর পর্ব ৩-এ **CrewAI এজেন্ট** যুক্ত হবে — রিস্ক স্কোর আর WhatsApp ফ্লো।

➡️ পরের পর্ব: [পর্ব ২ — React ড্যাশবোর্ড (Shadcn UI)](/docs/project-based/project-1/react-dashboard)
➡️ এর মধ্যে সিস্টেমের পুরো ছবি: [System Design](/docs/project-based/project-1/solution)
