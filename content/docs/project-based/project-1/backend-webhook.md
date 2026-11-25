---
title: পর্ব ১ — Django Backend ও Webhook
description: শূন্য থেকে Django REST API + একাধিক WooCommerce সাইটের webhook — প্রতি ইউজারের আলাদা token, আলাদা অর্ডার।
icon: Server
---

> **পরিকল্পনা:** আগে WordPress (WooCommerce) আর Django backend-এর ডেটা পাইপলাইন তৈরি করে টেস্ট করি। পরে এর সাথে CrewAI এজেন্ট যুক্ত করা পানির মতো সহজ হবে।
>
> এবার সিস্টেমটা এক ব্যবসায়ীর এক স্টোরের জন্য নয় — **একাধিক ব্যবসায়ী একই সার্ভারে** লগইন করবে, প্রত্যেকে নিজের **একাধিক WooCommerce সাইট** জুড়বে। তাই webhook URL-এ সাইটের একটা গোপন `token` থাকে; token না মিললে কোনো ডেটা ঢুকবে না, আর কোনো ব্যবসায়ী অন্যের অর্ডার দেখতে পাবে না।

## এই পর্বে যা বানাবো

| ধাপ | কাজ |
| --- | --- |
| ১ | `backend` ফোল্ডারে venv + Django প্রজেক্ট + `orders` অ্যাপ |
| ২ | `settings.py`-এ DRF, CORS আর token লগইন কনফিগার |
| ৩ | `Website` + `Order` Model — প্রতি ইউজারের সাইট, প্রতি সাইটের token |
| ৪ | Serializer — ওয়েবসাইটের webhook URL আর অর্ডারের স্টোরের নাম |
| ৫ | লগইন/লগআউট API আর ইউজার তৈরি |
| ৬ | Webhook API (token সহ), অর্ডার-লিস্ট (নিজের), ওয়েবসাইট API |
| ৭ | দুজন ইউজার, দুটো সাইট দিয়ে curl টেস্ট |
| ৮ | WooCommerce-এ webhook বসিয়ে ডামি অর্ডার টেস্ট |

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

`INSTALLED_APPS`-এ চারটা নতুন অ্যাপ যোগ করো। `rest_framework.authtoken` না থাকলে লগইন টোকেন তৈরি হবে না:

```python
INSTALLED_APPS = [
    # ... আগের অ্যাপগুলোর নিচে নিচের চারটি যোগ করো
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'orders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # এটি সবার উপরে রাখবে
    # ... বাকি মিডলওয়্যারগুলো যেমন আছে তেমনই থাকবে
]

# সব ডোমেইন থেকে API এক্সেস করার অনুমতি (ডেভেলপমেন্টের জন্য)
CORS_ALLOW_ALL_ORIGINS = True

# প্রতিটা API-তে টোকেন লাগবে — শুধু webhook আর login আলাদা করে ছাড় পাবে
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

> ⚠️ `CORS_ALLOW_ALL_ORIGINS = True` শুধু ডেভেলপমেন্টের জন্য। প্রোডাকশনে গেলে নির্দিষ্ট origin-এ সীমিত করো।

## ধাপ ৩: Website আর Order Model

এখানেই আসল পরিবর্তন। **`Website`** টেবিলটা বলে — কোন ইউজারের কোন সাইট, আর তার গোপন webhook token কী। **`Order`** টেবিলের প্রতিটা সারি একটা নির্দিষ্ট সাইটের।

`orders/models.py`:

```python
import uuid

from django.conf import settings
from django.db import models


class Website(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='websites',
    )
    name = models.CharField(max_length=100)
    url = models.URLField(blank=True)
    webhook_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.owner.username})"


class Order(models.Model):
    RISK_CHOICES = [
        ('PENDING', 'Pending AI Check'),
        ('SAFE', 'Safe Order'),
        ('HIGH_RISK', 'High Risk / Fraud Alert'),
    ]

    website = models.ForeignKey(
        Website,
        on_delete=models.CASCADE,
        related_name='orders',
        null=True,
    )
    wc_order_id = models.CharField(max_length=50)
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

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['website', 'wc_order_id'],
                name='unique_order_per_website',
            ),
        ]

    def __str__(self):
        return f"Order #{self.wc_order_id} - {self.customer_name} ({self.risk_status})"
```

তিনটা জিনিস খেয়াল করো:

| লাইন | কেন |
| --- | --- |
| `owner = ForeignKey(...)` | প্রতিটা সাইট এক ইউজারের — ইউজার মুছলে তার সাইটও যায় |
| `webhook_token = UUIDField(...)` | প্রতিবার নতুন র‍্যান্ডম token; এই token-ই URL-এর চাবি |
| `UniqueConstraint(website, wc_order_id)` | দুই সাইটে একই অর্ডার নম্বর (যেমন `#1099`) চলবে, কিন্তু একই সাইটে দুবার নয় |

`website` ফিল্ডটা `null=True` কারণ এই সিস্টেমের আগে সেভ হওয়া অর্ডারগুলো কোনো সাইটের অধীনে নেই। নতুন অর্ডার সবসময় কোনো `Website`-এর হয়।

মাইগ্রেশন চালাও:

```bash
python manage.py makemigrations
python manage.py migrate
```

## ধাপ ৪: Serializer

`orders/serializers.py` (নতুন ফাইল)। Website serializer নিজেই `webhook_path` বানিয়ে দেয়, যাতে ফ্রন্টএন্ড আর curl দুটোই একই ঠিকানা পায়:

```python
from rest_framework import serializers

from .models import Order, Website


class WebsiteSerializer(serializers.ModelSerializer):
    webhook_path = serializers.SerializerMethodField()

    class Meta:
        model = Website
        fields = ['id', 'name', 'url', 'webhook_token', 'webhook_path', 'created_at']
        read_only_fields = ['id', 'webhook_token', 'webhook_path', 'created_at']

    def get_webhook_path(self, obj):
        return f"/api/orders/webhook/woocommerce/{obj.webhook_token}/"


class OrderSerializer(serializers.ModelSerializer):
    website_name = serializers.CharField(source='website.name', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
```

## ধাপ ৫: লগইন API

`core/auth_views.py` (নতুন ফাইল):

```python
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response(
            {"detail": "ইউজারনেম বা পাসওয়ার্ড ভুল।"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "user": {
            "username": user.username,
            "name": user.get_full_name() or user.username,
            "email": user.email,
        },
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.auth.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
```

`core/urls.py`-এ অর্ডার অ্যাপ আর লগইন জুড়ে দাও:

```python
from django.contrib import admin
from django.urls import include, path

from . import auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('orders.urls')),
    path('api/auth/login/', auth_views.login_view, name='auth-login'),
    path('api/auth/logout/', auth_views.logout_view, name='auth-logout'),
]
```

একটা ইউজার বানাও:

```bash
python manage.py createsuperuser
```

## ধাপ ৬: Webhook আর ওয়েবসাইট API

`orders/views.py` — চারটা কাজ: token দিয়ে webhook নেওয়া, নিজের অর্ডার দেখানো, নিজের সাইট দেখা/যোগ করা/মুছা:

```python
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Order, Website
from .serializers import OrderSerializer, WebsiteSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def woocommerce_webhook(request, token):
    # URL-এর token দিয়ে বুঝে নিলাম কোন ইউজারের কোন সাইট
    website = get_object_or_404(Website, webhook_token=token)
    data = request.data

    # WooCommerce ping টেস্টে webhook_id পাঠায়, অর্ডারের বডি থাকে না
    if 'id' not in data:
        return Response({"message": "Webhook ping received successfully!"}, status=status.HTTP_200_OK)

    try:
        wc_order_id = str(data.get('id'))
        billing = data.get('billing', {})
        customer_name = f"{billing.get('first_name', '')} {billing.get('last_name', '')}".strip()
        phone = billing.get('phone', 'N/A')
        address = f"{billing.get('address_1', '')}, {billing.get('city', '')}".strip(', ')
        total_amount = data.get('total', 0)

        order, created = Order.objects.update_or_create(
            website=website,
            wc_order_id=wc_order_id,
            defaults={
                'customer_name': customer_name,
                'phone': phone,
                'address': address,
                'total_amount': total_amount,
            },
        )

        # [পর্ব ৩-এ এখানে CrewAI এজেন্ট কল করার কোড যুক্ত হবে]
        print(f"New Order Received: #{wc_order_id} | {customer_name} | {phone} | {website.name}")

        return Response(
            {"status": "success", "order_id": wc_order_id, "website": website.name, "created": created},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def order_list(request):
    # শুধু নিজের সাইটগুলোর অর্ডার — অন্যের অর্ডার কখনো আসবে না
    orders = Order.objects.filter(website__owner=request.user).select_related('website')
    website_id = request.query_params.get('website')
    if website_id:
        orders = orders.filter(website_id=website_id)
    serializer = OrderSerializer(orders.order_by('-created_at'), many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def website_list(request):
    if request.method == 'GET':
        websites = request.user.websites.order_by('created_at')
        return Response(WebsiteSerializer(websites, many=True).data)

    serializer = WebsiteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(owner=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def website_detail(request, pk):
    website = get_object_or_404(Website, pk=pk, owner=request.user)
    website.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
```

`orders/urls.py` (নতুন ফাইল):

```python
from django.urls import path

from . import views

urlpatterns = [
    path('orders/webhook/woocommerce/<uuid:token>/', views.woocommerce_webhook, name='wc-webhook'),
    path('orders/list/', views.order_list, name='order-list'),
    path('websites/', views.website_list, name='website-list'),
    path('websites/<int:pk>/', views.website_detail, name='website-detail'),
]
```

| API | URL | Auth | কাজ |
| --- | --- | --- | --- |
| Webhook | `/api/orders/webhook/woocommerce/<token>/` | token in URL | WordPress অর্ডার পাঠাবে |
| List | `/api/orders/list/` | Token | নিজের অর্ডার; `?website=1` দিয়ে ফিল্টার |
| Websites | `/api/websites/` | Token | নিজের সাইট দেখা / নতুন যোগ |
| Website delete | `/api/websites/<id>/` | Token | সাইট + তার অর্ডার মুছে ফেলা |
| Login | `/api/auth/login/` | নেই | টোকেন নেওয়া |

## ধাপ ৭: দুজন ইউজার, দুটো সাইট — curl টেস্ট

সার্ভার চালাও:

```bash
python manage.py runserver
```

**১) লগইন করে টোকেন নাও:**

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"tanvir","password":"FraudShield#2026"}'
```

```json
{"token":"a1b2c3...","user":{"username":"tanvir","name":"tanvir","email":""}}
```

**২) সাইট যোগ করো** — রেসপন্সের `webhook_path`-টাই WordPress-এ বসবে:

```bash
curl -X POST http://127.0.0.1:8000/api/websites/ \
  -H "Authorization: Token a1b2c3..." \
  -H "Content-Type: application/json" \
  -d '{"name":"Tanvir Clothing","url":"https://tanvirclothing.com"}'
```

```json
{
  "id": 1,
  "name": "Tanvir Clothing",
  "url": "https://tanvirclothing.com",
  "webhook_token": "f6f9b5a2-7889-43b5-ab27-899e58616a78",
  "webhook_path": "/api/orders/webhook/woocommerce/f6f9b5a2-7889-43b5-ab27-899e58616a78/"
}
```

**৩) ওই token দিয়েই ping আর অর্ডার পাঠাও:**

```bash
curl -X POST http://127.0.0.1:8000/api/orders/webhook/woocommerce/f6f9b5a2-7889-43b5-ab27-899e58616a78/ \
  -H "Content-Type: application/json" -d '{"webhook_id": 12}'

curl -X POST http://127.0.0.1:8000/api/orders/webhook/woocommerce/f6f9b5a2-7889-43b5-ab27-899e58616a78/ \
  -H "Content-Type: application/json" \
  -d '{"id":9001,"total":"2200.00","billing":{"first_name":"Tariqul","last_name":"Islam","phone":"01700998877","address_1":"Uttara","city":"Dhaka"}}'
```

```json
{"status":"success","order_id":"9001","website":"Tanvir Clothing","created":true}
```

**৪) ভুল token দিলে ঢুকবে না** — `404`:

```bash
curl -X POST http://127.0.0.1:8000/api/orders/webhook/woocommerce/00000000-0000-0000-0000-000000000000/ \
  -H "Content-Type: application/json" -d '{"id":1}'
```

**৫) লিস্টে শুধু নিজের অর্ডার:**

```bash
curl http://127.0.0.1:8000/api/orders/list/ -H "Authorization: Token a1b2c3..."
```

```json
[{"id": 4, "wc_order_id": "9001", "website_name": "Tanvir Clothing", "customer_name": "Tariqul Islam", "risk_status": "PENDING"}]
```

একটা দ্বিতীয় ইউজার (`rahim`) বানিয়ে অর্ডার পাঠালে তানভীরের লিস্টে সেটা দেখাবে না — ডেটা `Website.owner` অনুযায়ী আলাদা।

## ধাপ ৮: WooCommerce-এর সাথে কানেক্ট

লোকাল পিসিতে (XAMPP/Laragon/LocalWP) বা লাইভ সার্ভারে WordPress ড্যাশবোর্ডে লগইন করে:

1. বাম মেনু → **WooCommerce → Settings → Advanced → Webhooks**
2. **Add webhook** ক্লিক করে তথ্য দাও:

| ফিল্ড | মান |
| --- | --- |
| Name | Fraud Shield AI |
| Status | Active |
| Topic | Order created |
| Delivery URL | `http://127.0.0.1:8000/api/orders/webhook/woocommerce/<তোমার_site_token>/` |
| API Version | WP REST API Integration v3 |
| Secret | (ফাঁকা রাখা যায়) |

> **লোকাল WordPress `127.0.0.1` ব্লক করলে:** টার্মিনালে `ngrok http 8000` চালাও, পাওয়া HTTPS লিংকের সাথে `/api/orders/webhook/woocommerce/<token>/` জুড়ে Delivery URL-এ বসাও। তখন Django-তে `ALLOWED_HOSTS = ['*']` দরকার হবে (শুধু ডেভেলপমেন্টে)।

3. **Save webhook** — তারপর সাইটে গিয়ে একটা ডামি অর্ডার প্লেস করো।

Django টার্মিনালে দেখবে:

```text
New Order Received: #1234 | Tanvir Ahmed | 017XXXXXXXX | Tanvir Clothing
```

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `/api/orders/list/`-এ `401` | লগইন করেছ? `Authorization: Token <token>` হেডার পাঠাও |
| Webhook-এ `404` | URL-এর token ভুল বা সাইটটা মুছে গেছে — Websites রেসপন্স থেকে আবার কপি করো |
| Ping টেস্ট | "Webhook ping received successfully!" — এটাই সঠিক |
| একই অর্ডার নম্বর দুই সাইটে | সমস্যা নেই — unique constraint আছে `(website, wc_order_id)`-এ |
| একটা সাইটে একই অর্ডার দুইবার | `update_or_create` আপডেট করবে, ডুপ্লিকেট হবে না |
| React-এ CORS error | dev-এ `CORS_ALLOW_ALL_ORIGINS = True` |
| লিস্ট খালি, DB-তে অর্ডার আছে | পুরোনো অর্ডারে `website` নেই — নতুন করে অর্ডার পাঠাও |

## পরের পর্ব

ডেটা রিসিভ হচ্ছে নিশ্চিত হলে পরের ধাপে **React + Shadcn UI ড্যাশবোর্ড** বানাব — লগইন, ওয়েবসাইট যোগ করার পেজ, webhook URL কপি আর স্টোরভিত্তিক অর্ডার টেবিল। তারপর পর্ব ৩-এ **CrewAI এজেন্ট** যুক্ত হবে।

➡️ পরের পর্ব: [পর্ব ২ — React ড্যাশবোর্ড (Shadcn UI)](/docs/project-based/project-1/react-dashboard)
➡️ এর মধ্যে সিস্টেমের পুরো ছবি: [System Design](/docs/project-based/project-1/solution)
