---
title: Path Parameters
description: URL-এর ভেতরে পণ্যের ID নেওয়া আর type hint দিয়ে অটো ভ্যালিডেশন।
icon: Route
---

## গল্প

রফিক দোকানের স্টকে হাজারো পণ্য দেখে বিভ্রান্ত। তিনি চান — শুধু একটা নির্দিষ্ট পণ্যের তথ্য, তার ID জানা থাকলে। অর্থাৎ ID-টা আসবে URL-এর ভেতরেই: `/products/5`।

## কোড

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/products/{product_id}")
def get_product(product_id: int):
    return {"product_id": product_id, "name": "উলের ওভারকোট"}
```

খেয়াল করো ফাংশনের প্যারামিটারের নাম `product_id` আর URL-এ `{product_id}` — দুটো একই। আর `: int` লেখা হয়েছে বলেই FastAPI জানে এটা সংখ্যা হবে।

## বাস্তবে কী ঘটে

```text
GET /products/5   → {"product_id": 5, "name": "উলের ওভারকোট"}
GET /products/abc → 422 Validation Error (কারণ "abc" ইন্টিজার না)
```

`abc` পাঠালে FastAPI নিজে থেকেই ভ্যালিডেশন এরর দেয় — এক লাইন ভ্যালিডেশন কোডও লিখতে হয়নি:

```json
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": ["path", "product_id"],
      "msg": "Input should be a valid integer, unable to parse string as an integer"
    }
  ]
}
```

## টিপস

- টাইপ-হিন্টই এখানে ভ্যালিডেশন — `int`-এর জায়গায় `str`, `float`, এমনকি `datetime`-ও দেওয়া যায়।
- **রুটের ক্রম গুরুত্বপূর্ণ।** নির্দিষ্ট ঠিকানা আগে রাখতে হবে:

```python
@app.get("/products/latest")        # ← আগে
def latest_product():
    return {"name": "নতুন ওভারকোট"}

@app.get("/products/{product_id}")  # ← পরে
def get_product(product_id: int):
    return {"product_id": product_id}
```

উল্টো করলে `/products/latest` রিকোয়েস্টটা `{product_id}`-তে ঢুকে যাবে আর 422 এরর দেবে।

- `id`-টাকে সীমার ভেতরে রাখতে `product_id: int = Path(ge=1)` লিখতে পারো — `Path` দিয়ে path প্যারামিটারে বাড়তি নিয়ম বসানো যায়।

পরের ধাপে [Query Parameters](/fastapi/query-parameters) — তালিকা ফিল্টার করা।
