---
title: Views ও URLs
description: কে অনুরোধ পাঠাবে, আর কোন ঠিকানায় কোন কোড চলবে — View আর URL-এর কাজ।
icon: GitBranch
---

## গল্প

কেউ রূপসী ফ্যাশনের ওয়েবসাইটে একটা নির্দিষ্ট পেজ দেখতে চাইলে (যেমন `/products/`), কাউকে তো সেই অনুরোধের **উত্তর দিতে হবে** — এটাই View-র কাজ। আর URL হলো "কোন ঠিকানায় গেলে কোন View চলবে" তার তালিকা।

- **View** = রাঁধুনি (অর্ডার পেলে খাবার বানায়)
- **URL** = মেনু (কোন খাবার অর্ডার করলে কোন রাঁধুনির কাছে যাবে)

## Function-Based View — `products/views.py`

```python
from django.http import JsonResponse
from .models import Product

def product_list(request):
    products = Product.objects.all()
    data = [{"name": p.name, "price": str(p.price)} for p in products]
    return JsonResponse(data, safe=False)
```

`Product.objects.all()` ডেটাবেস থেকে সব পণ্য আনে, তারপর প্রতিটার নাম আর দাম নিয়ে লিস্ট বানিয়ে JSON হিসেবে ফেরত দেয়। `str(p.price)` করা হয়েছে কারণ `Decimal` সরাসরি JSON-এ বসানো যায় না।

## URL কনফিগার করা

প্রথমে App-এর নিজের URL ফাইল — `products/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.product_list, name='product-list'),
]
```

এবার মূল `rupashi_fashion/urls.py`-তে যোগ করো:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('products/', include('products.urls')),   # 👈 নতুন
]
```

এখানে দুই স্তরের URL — মূল ফাইল বলে "`products/` দিয়ে শুরু হওয়া সব ঠিকানা `products` App-এর কাছে পাঠাও", আর App-এর ফাইল বলে "বাকি খালি পথ হলে `product_list` View চালাও"।

## বাস্তবে কী ঘটে

`http://127.0.0.1:8000/products/` গেলে এখন JSON দেখবে:

```json
[
    {"name": "উলের ওভারকোট", "price": "1800.00"},
    {"name": "চাদর", "price": "650.00"}
]
```

এটা একটা কাজ করা API — কিন্তু এতে এখনো ভ্যালিডেশন নেই, নতুন পণ্য যোগ করা যায় না, পেজিনেশন নেই। DRF ব্যবহার করলে এই সব সুবিধা প্রায় ফ্রি-তে পাওয়া যায়।

➡️ পরের পর্ব: [DRF](/django/drf) — একই API-কে প্রফেশনাল বানাই।
