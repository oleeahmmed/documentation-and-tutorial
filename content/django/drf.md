---
title: DRF
description: Django REST Framework — Serializer, ViewSet, Router দিয়ে পূর্ণ CRUD API।
icon: Terminal
---

## গল্প

নাদিয়া (ফ্রন্টএন্ড) আর রফিক (ব্যাকএন্ড)-এর মধ্যে কথা বলার একটা সুন্দর, গোছানো ভাষা দরকার — শুধু `JsonResponse` দিয়ে না, বরং ভ্যালিডেশন, পেজিনেশন, সার্চ সবকিছু-সহ একটা প্রফেশনাল API। এটাই DRF-এর কাজ।

## ইনস্টলেশন

```bash
pip install djangorestframework
```

`settings.py`-তে:

```python
INSTALLED_APPS = [
    # ... আগের সব
    'rest_framework',   # 👈 নতুন
    'products',
]
```

## ৫.১ — Serializer (Model ↔ JSON রূপান্তরকারী)

### গল্প

Serializer হলো একজন **অনুবাদক** — Python Model-অবজেক্টকে JSON-এ বদলায় (ফ্রন্টএন্ডে পাঠানোর জন্য), আর ফ্রন্টএন্ড থেকে আসা JSON-কে আবার Model-এ বদলায় (সেভ করার জন্য), সাথে ভ্যালিডেশনও করে।

### কোড — `products/serializers.py`

```python
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'description', 'created_at']
```

এই ছোট্ট ক্লাসটাই Model-এর প্রতিটা ফিল্ডের জন্য রূপান্তর আর ভ্যালিডেশনের কাজ নিজে থেকে করে নেয়।

## ৫.২ — ViewSet (সব CRUD অপারেশন একসাথে)

```python
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
```

**এই একটা ক্লাস দিয়েই** স্বয়ংক্রিয়ভাবে পাওয়া যায়:

| অনুরোধ | কাজ |
| --- | --- |
| `GET /products/` | সব পণ্যের তালিকা |
| `POST /products/` | নতুন পণ্য যোগ |
| `GET /products/1/` | একটা নির্দিষ্ট পণ্য |
| `PUT /products/1/` | পণ্য আপডেট |
| `DELETE /products/1/` | পণ্য ডিলিট |

`queryset` বলে দেয় কোন ডেটার উপর কাজ হবে, `serializer_class` বলে দেয় ডেটা রূপান্তর কীভাবে হবে — বাকিটা DRF নিজেই সামলায়।

## ৫.৩ — Router দিয়ে URL স্বয়ংক্রিয় বানানো

`products/urls.py`:

```python
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)

urlpatterns = router.urls
```

`rupashi_fashion/urls.py`:

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),   # এখন /api/products/
]
```

আগের পর্বে View-এর জন্য হাতে URL লিখেছিলাম। Router সেটাও করে দেয় — `router.register` করলেই পাঁচটা URL একসাথে তৈরি হয়ে যায়।

### বাস্তবে কী ঘটে

`http://127.0.0.1:8000/api/products/` গেলে DRF নিজে থেকেই একটা সুন্দর **ব্রাউজেবল API ইন্টারফেস** দেখায় — টেবিল, ফর্ম, সব কিছু — কোনো ফ্রন্টএন্ড ছাড়াই সরাসরি টেস্ট করা যায়।

নিচে JSON ফরম্যাটে ডেটা:

```json
[
    {"id": 1, "name": "উলের ওভারকোট", "price": "1800.00", "stock": 450, "description": "", "created_at": "2026-11-23T10:00:00Z"}
]
```

➡️ পরের পর্ব: [CORS](/django/cors) — নাদিয়ার ফ্রন্টএন্ড থেকে এই API-তে কল করার অনুমতি দিই।
