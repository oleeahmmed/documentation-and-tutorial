---
title: সম্পূর্ণ প্রজেক্ট
description: সব ফাইল একসাথে — কপি করে বসালেই রূপসী ফ্যাশনের পূর্ণ API।
icon: FileText
---

আগের সব পর্ব মিলিয়ে পুরো প্রজেক্টটা এক জায়গায়। ফাইলগুলো নিজের প্রজেক্টের নাম অনুযায়ী বসাও, তারপর নিচের কমান্ডগুলো চালাও।

## `products/models.py`

```python
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

## `products/serializers.py`

```python
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
```

## `products/views.py`

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]   # যে কেউ দেখতে পারবে, শুধু লগইন করলে এডিট করতে পারবে
```

## `products/admin.py`

```python
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock", "created_at")
    search_fields = ("name",)
```

## `products/urls.py`

```python
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)
urlpatterns = router.urls
```

## `rupashi_fashion/settings.py` (গুরুত্বপূর্ণ অংশ)

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'products',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```

## `rupashi_fashion/urls.py`

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]
```

## চালানো

প্রথমবার (অথবা Model বদলালে):

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

তারপর:

- `http://127.0.0.1:8000/admin` — পণ্য ম্যানেজ করার প্যানেল
- `http://127.0.0.1:8000/api/products/` — ব্রাউজেবল API
- `http://127.0.0.1:8000/api/token/` — লগইন করে টোকেন নেওয়া

> **প্রোডাকশনে যাওয়ার আগে:** `settings.py`-এর `SECRET_KEY` আর `DEBUG=True` সরাসরি কোডে রেখে গিটে কমিট করো না। এগুলো `.env` ফাইলে রাখো, আর `.env` অবশ্যই `.gitignore`-এ দাও। `DEBUG=False` না করলে ভুল হলে পুরো কোড-বিবরণ বাইরে দেখিয়ে দেয় — নিরাপত্তার ঝুঁকি।

➡️ পরের পর্ব: [সারসংক্ষেপ](/django/summary) — এক নজরে পুরো ম্যাপ।
