---
title: Router দিয়ে কোড গোছানো
description: APIRouter দিয়ে ফিচার-ভিত্তিক ফাইল ভাগ করা — Django-র app/urls.py-র মতো।
icon: FolderTree
---

## গল্প

শুরুতে সব endpoint এক `main.py`-তে থাকে — পণ্য, অর্ডার, লগইন সব মিশে যায়। ডজনের বেশি endpoint হলে ফাইলটা আর পড়া যায় না। সমাধান Django App-এর মতো: প্রতিটা বিষয়ের জন্য আলাদা ফাইল, আর সবগুলো `main.py`-তে জোড়া।

## ফোল্ডার স্ট্রাকচার

```text
rupashi_api/
├── main.py
└── routers/
    ├── __init__.py
    └── products.py
```

`routers` ফোল্ডারে `__init__.py` ফাইলটা ফাঁকা হলেও থাকতে হবে — তখনই Python এটাকে প্যাকেজ হিসেবে ধরে, আর `from routers import products` কাজ করে।

## `routers/products.py`

```python
from fastapi import APIRouter

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.get("/")
def list_products():
    return [{"name": "উলের ওভারকোট"}, {"name": "চাদর"}]

@router.get("/{product_id}")
def get_product(product_id: int):
    return {"product_id": product_id}
```

খেয়াল করো — `app`-এর বদলে `router`, আর `prefix="/products"` দেওয়া। তাই `@router.get("/")` মানে আসলে `/products/`, আর `@router.get("/{product_id}")` মানে `/products/{product_id}`।

## `main.py`

```python
from fastapi import FastAPI
from routers import products

app = FastAPI()
app.include_router(products.router)
```

`include_router` একবার লিখলেই ওই ফাইলের সব endpoint মূল অ্যাপে যুক্ত হয়ে যায়।

## বাস্তবে কী ঘটে

```text
GET /products/     → পণ্যের তালিকা
GET /products/5    → একটা নির্দিষ্ট পণ্য
```

Swagger UI-তে (`/docs`) এখন **Products** নামে একটা আলাদা গ্রুপ দেখবে — `tags` এটাই করে। পরে `orders.py`, `customers.py` যোগ করলে প্রতিটা আলাদা গ্রুপে দেখাবে।

## বাস্তব প্রজেক্টে

```python
from routers import orders, products, customers

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(customers.router)
```

একইভাবে টোকেন/লগইন সংক্রান্ত endpoint `auth.py`-তে রাখা যায় — [সম্পূর্ণ প্রজেক্ট পেজে](/fastapi/full-project) সেটাই করা হয়েছে।

## টিপস

- `prefix`-এ ট্রেইলিং স্ল্যাশ দিয়ো না — `/products` ঠিক, `/products/` বসালে পরের পাথে ডাবল স্ল্যাশ হতে পারে।
- `tags` একাধিকও দিতে পারো: `tags=["Products", "Public"]`।
- Router লেভেলে `dependencies=[Depends(get_current_user)]` বসালে ওই ফাইলের সব endpoint একসাথে সুরক্ষিত হয় — [সম্পূর্ণ প্রজেক্টে](/fastapi/full-project) এভাবে করা আছে।

পরের ধাপ — FastAPI-র সবচেয়ে শক্তিশালী ফিচার, [Dependency Injection](/fastapi/dependencies)।
