---
title: JWT Authentication
description: টোকেন দিয়ে নিরাপদ লগইন — একবার লগইন করে প্রতিটা রিকোয়েস্টে টোকেন দেখালেই চলে।
icon: Lock
---

## গল্প

নাদিয়া চান শুধু লগইন করা ইউজাররাই (যেমন করিম ভাই নিজে) পণ্য যোগ/এডিট করতে পারবে, অন্য কেউ না। প্রতিবার ইউজারনেম-পাসওয়ার্ড পাঠানো অনিরাপদ আর অসুবিধাজনক — এর বদলে একবার লগইন করলে একটা **"টোকেন"** (ডিজিটাল পাস) দেওয়া হয়, যেটা পরের প্রতিটা রিকোয়েস্টে দেখালেই চলে। এটাই JWT (JSON Web Token)।

## ইনস্টলেশন

```bash
pip install djangorestframework-simplejwt
```

## `settings.py`-তে authentication চালু

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```

## টোকেন নেওয়ার URL যোগ করা

`rupashi_fashion/urls.py`:

```python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),   # লগইন
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # টোকেন রিফ্রেশ
]
```

## নির্দিষ্ট View-তে অথেনটিকেশন বাধ্যতামূলক করা

```python
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]   # 👈 নতুন — লগইন ছাড়া অ্যাক্সেস নেই
```

একই লাইনে `IsAuthenticatedOrReadOnly` দিলে যে কেউ দেখতে পারবে, কিন্তু এডিট করতে লগইন লাগবে — অ্যাপের ধরন অনুযায়ী বেছে নাও।

## বাস্তবে কী ঘটে — পুরো প্রসেস

### ধাপ ১ — লগইন করে টোকেন নেওয়া

```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -d "username=korim&password=mypassword123"
```

আউটপুট:

```json
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ধাপ ২ — এই `access` টোকেন দিয়ে API কল করা

```bash
curl http://127.0.0.1:8000/api/products/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

টোকেন ছাড়া কল করলে:

```json
{"detail": "Authentication credentials were not provided."}
```

### ধাপ ৩ — টোকেনের মেয়াদ শেষ হলে Refresh

```bash
curl -X POST http://127.0.0.1:8000/api/token/refresh/ \
  -d "refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

নতুন `access` টোকেন পাওয়া যাবে — পুরোনো লগইন ইনফো আবার দিতে হয় না।

| টোকেন | কাজ | মেয়াদ |
| --- | --- | --- |
| `access` | প্রতিটা রিকোয়েস্টের সাথে পাঠাতে হয় | কম (ডিফল্ট ৫ মিনিট) |
| `refresh` | মেয়াদ শেষ হলে নতুন `access` আনতে কাজে লাগে | বেশি (ডিফল্ট ১ দিন) |

> টোকেনও পাসওয়ার্ডের মতো গোপন তথ্য — কোডে হার্ডকোড করো না, গিটে কমিট করো না, লগে প্রিন্ট করো না।

➡️ পরের পর্ব: [সম্পূর্ণ প্রজেক্ট](/django/complete-project) — সব ফাইল এক জায়গায় দেখি।
