---
title: Dependency Injection
description: Depends() দিয়ে DB session, pagination বা লগইন-চেক একবার লিখে সব endpoint-এ পুনর্ব্যবহার।
icon: Link
---

## গল্প

প্রতিটা endpoint-এ ডেটাবেস সংযোগ লাগে, কোনো কোনোটায় আবার লগইন করা আছে কিনা চেক করতে হয়। একই কোড বারবার কপি না করে একটা "Dependency" বানিয়ে নিলে, পরিবর্তন লাগলে এক জায়গাতেই বদলাতে হবে। এটাই FastAPI-র কোর ফিচার।

## কোড — ডেটাবেস dependency

```python
from typing import Annotated
from fastapi import Depends

def get_db():
    db = {"connection": "fake-db-session"}
    try:
        yield db
    finally:
        print("ডেটাবেস কানেকশন বন্ধ হলো")

DBSession = Annotated[dict, Depends(get_db)]

@app.get("/products")
def list_products(db: DBSession):
    return {"db_used": db["connection"], "products": ["উলের ওভারকোট"]}
```

- `yield`-এর আগে সংযোগ খোলা হয়, পরে বন্ধ — রিকোয়েস্ট শেষ হলেই `finally` চলে।
- `Annotated[dict, Depends(get_db)]` — একটা পুনর্ব্যবহারযোগ্য টাইপ-অ্যালায়াস। এখন `db: DBSession` লেখলেই হবে।

## একাধিক জায়গায় পুনর্ব্যবহার

```python
def common_pagination(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

Pagination = Annotated[dict, Depends(common_pagination)]

@app.get("/products")
def list_products(pagination: Pagination):
    return pagination

@app.get("/orders")
def list_orders(pagination: Pagination):   # একই dependency আবার ব্যবহার হলো
    return pagination
```

`Pagination` বসালেই `?skip=10&limit=5` দিয়ে পেজিনেশন কাজ করবে — ফাংশনে আলাদা কিছু লিখতে হয়নি। হ্যাঁ, dependency-র প্যারামিটারও স্বয়ংক্রিয়ভাবে query parameter হয়ে যায়।

## বাস্তবে কী ঘটে

```text
GET /products?skip=0&limit=5
→ {"skip": 0, "limit": 5}

GET /orders?skip=10
→ {"skip": 10, "limit": 10}
```

আর `get_db`-এর `print` সার্ভারের লগে ব্রাউজার রিকোয়েস্টের পরে দেখবে — সংযোগ বন্ধ হয়েছে। **এই লাইনটা লগে না দেখলে** বুঝবে dependency ব্যবহারই হয়নি।

## টিপস

- Dependency-র ভেতরে থেকেও `Depends()` ব্যবহার করা যায় — যেমন `get_current_user` ভেতরে `Depends(oauth2_scheme)`। এই চেইনটা খুব কাজে লাগে।
- আসল প্রজেক্টে `get_db`-এর `try/finally`-তে SQLAlchemy session খোলা/বন্ধ হবে — [ডেটাবেস পেজে](/fastapi/database) দেখানো আছে।
- Dependency-র ফলাফল রিকোয়েস্টের ভেতরে ক্যাশ হয় — একই dependency একাধিক জায়গায় লিখলেও একবারই চলে।
- অ্যাপ-লেভেলে সাধারণ dependency দরকার হলে `FastAPI(dependencies=[Depends(...)])` ব্যবহার করা যায়।

এখন এই দর্শন কাজে লাগিয়ে লগইন সিস্টেম বানাব — [Authentication](/fastapi/authentication)।
