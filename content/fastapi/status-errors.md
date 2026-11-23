---
title: Status Code ও Error Handling
description: HTTPException আর status কোড দিয়ে সঠিক HTTP উত্তর পাঠানো — 200, 201, 404।
icon: CircleAlert
---

## গল্প

নাদিয়া যে পণ্যটা খুঁজছে সেটা স্টকে নেই। সার্ভার যদি "সব ঠিক আছে" বলে খালি ডেটা পাঠায়, ফ্রন্টএন্ড বিভ্রান্ত হবে। সঠিক উত্তর হওয়া উচিত **404 Not Found**। FastAPI-তে এটা `HTTPException` দিয়ে করা হয়।

## কোড

```python
from fastapi import HTTPException, status

fake_db = {
    1: {"name": "উলের ওভারকোট", "price": 1800}
}

@app.get("/products/{product_id}")
def get_product(product_id: int):
    if product_id not in fake_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="পণ্য পাওয়া যায়নি"
        )
    return fake_db[product_id]

@app.post("/products", status_code=status.HTTP_201_CREATED)
def create_product(product: ProductIn):
    return {"message": "তৈরি হয়েছে"}
```

- `raise HTTPException(...)` — FastAPI ধরেই JSON উত্তর বানিয়ে পাঠায়: `{"detail": "..."}`
- ডেকোরেটরে `status_code=201` — নতুন কিছু তৈরি হলে 200 নয়, 201 ফেরত দেওয়া উচিত

## বাস্তবে কী ঘটে

```text
GET /products/99  → 404 Not Found: {"detail": "পণ্য পাওয়া যায়নি"}
GET /products/1   → 200 OK: {"name": "উলের ওভারকোট", "price": 1800}
POST /products    → 201 Created
```

StatusCode নিজে মনে রাখার দরকার নেই — `status.HTTP_404_NOT_FOUND`-এর মতো নামগুলো ব্যবহার করলে ভুল সংখ্যা লেখার ভয় থাকে না।

## টিপস

- 400 (খারাপ রিকোয়েস্ট), 401 (লগইন দরকার), 403 (অনুমতি নেই), 404 (নেই), 409 (দ্বন্দ্ব/ডুপ্লিকেট) — এই কোডগুলোই বেশিরভাগ সময় লাগবে।
- একই রকম এরর বারবার লিখতে হলে একবার exception বানিয়ে reuse করো, যেমন [JWT পেজে](/fastapi/authentication) `credentials_error`।
- সফল রেসপন্সের ডিফল্ট 200; তৈরি/আপলোডের জন্য 201 দেওয়াটা ভালো অভ্যাস।

## কাস্টম এরর ফরম্যাট (ঐচ্ছিক)

ডিফল্ট `{"detail": ...}` বদলাতে চাইলে `@app.exception_handler(HTTPException)` দিয়ে নিজের হ্যান্ডলার লেখা যায়। শুরুতে দরকার নেই — ফ্রন্টএন্ড সাধারণত `detail` পড়েই কাজ চালায়।

এখন ভ্যালিডেশনের নিয়ম কঠিন করব — [Pydantic Validation](/fastapi/validation)।
