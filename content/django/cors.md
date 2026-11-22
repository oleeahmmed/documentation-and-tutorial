---
title: CORS
description: ফ্রন্টএন্ড থেকে API কল করার অনুমতি — কেন লাগে আর কীভাবে দিতে হয়।
icon: Globe
---

## গল্প

নাদিয়ার ফ্রন্টএন্ড (React/Next.js, যেমন `localhost:3000`-এ চলছে) চাইলে রফিকের API (`localhost:8000`-এ চলছে) থেকে ডেটা আনতে — কিন্তু ব্রাউজার নিরাপত্তার কারণে **অন্য ডোমেইন/পোর্ট থেকে আসা রিকোয়েস্ট ডিফল্টভাবে ব্লক করে দেয়**। করিম ভাইকে সরাসরি অনুমতি দিতে হবে — "নাদিয়ার ফ্রন্টএন্ড থেকে প্রশ্ন এলে উত্তর দিও।"

এই অনুমতিটাই CORS (Cross-Origin Resource Sharing)।

## ইনস্টলেশন

```bash
pip install django-cors-headers
```

## `settings.py`-তে কনফিগার

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',   # 👈 নতুন
    'rest_framework',
    'products',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',   # 👈 নতুন, সবার উপরে বা উপরের দিকে রাখো
    'django.middleware.common.CommonMiddleware',
    # ... বাকি middleware
]

# ডেভেলপমেন্টের জন্য (নির্দিষ্ট ফ্রন্টএন্ড অনুমতি দাও)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

`CorsMiddleware`-টা অবশ্যই `CommonMiddleware`-এর **আগে** থাকতে হবে — নইলে অনুমতির হেডার সঠিকভাবে বসবে না।

> **সতর্কতা:** `CORS_ALLOW_ALL_ORIGINS = True` কখনো প্রোডাকশনে ব্যবহার করো না — এটা সব ওয়েবসাইট থেকে রিকোয়েস্ট গ্রহণ করে, নিরাপত্তার ঝুঁকি তৈরি করে। সবসময় নির্দিষ্ট ফ্রন্টএন্ডের ঠিকানা `CORS_ALLOWED_ORIGINS`-এ লিখে দাও।

## বাস্তবে কী ঘটে

CORS ছাড়া, নাদিয়ার ফ্রন্টএন্ড থেকে `fetch("http://localhost:8000/api/products/")` কল করলে ব্রাউজার কনসোলে এরকম এরর আসত:

```text
Access to fetch at 'http://localhost:8000/api/products/' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

CORS যোগ করার পর এই এরর চলে যাবে, ফ্রন্টএন্ড ঠিকমতো ডেটা পাবে।

➡️ পরের পর্ব: [JWT Authentication](/django/jwt) — এখন API-তে লগইন-সুরক্ষা যোগ করি।
