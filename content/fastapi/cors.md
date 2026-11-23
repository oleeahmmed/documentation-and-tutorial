---
title: CORS
description: React/Next.js ফ্রন্টএন্ডকে API-তে অনুমতি দেওয়া — django-cors-headers-এর FastAPI সংস্করণ।
icon: Globe
---

## গল্প

নাদিয়ার React ড্যাশবোর্ড `localhost:3000`-এ চলছে, আর API `localhost:8000`-এ। পোর্ট আলাদা হওয়ায় ব্রাউজার দুটোকে আলাদা origin ভাবে — তাই CORS অনুমতি না দিলে ড্যাশবোর্ড থেকে API কল করতে গেলে ব্রাউজার ব্লক করে দেবে। Django-তে যেভাবে `django-cors-headers` লাগে, FastAPI-তে ঠিক সেভাবেই `CORSMiddleware`।

## কোড

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- `allow_origins` — কোন কোন ঠিকানা থেকে কল করা যাবে
- `allow_methods` / `allow_headers` — `*` মানে সব অনুমোদিত
- `allow_credentials=True` — কুকি/Authorization হেডার পাঠানোর অনুমতি

## বাস্তবে কী ঘটে

ব্রাউজারের DevTools → Network ট্যাবে দেখো, রেসপন্সে এই হেডার আসবে:

```text
access-control-allow-origin: http://localhost:3000
```

এই হেডার না থাকলে কনসোলে লাল এরর:

```text
Access to fetch at 'http://127.0.0.1:8000/products' from origin
'http://localhost:3000' has been blocked by CORS policy
```

## টিপস

- `allow_origins=["*"]` আর `allow_credentials=True` একসাথে ব্যবহার করা যায় না — ব্রাউজার অনুমতি দেয় না। সেক্ষেত্রে origin-গুলো আলাদা করে লিখতে হবে:

```python
allow_origins=[
    "http://localhost:3000",
    "https://rupashi.example.com",
]
```

- প্রোডাকশনে ডিফল্ট `localhost` থাকবে না — Vercel/ডোমেইন যোগ করতে হবে, নইলে ডিপ্লয়ের পর হঠাৎ CORS এরর দেখবে।
- CORS হলো **ব্রাউজারের** নিয়ম — `curl` বা পোস্টম্যানে এরর আসবে না। তাই "পোস্টম্যানে কাজ করছে, ব্রাউজারে হচ্ছে না" হলে প্রায় সবসময়ই CORS।

এবার আসল ডেটাবেস — [SQLAlchemy](/fastapi/database)।
