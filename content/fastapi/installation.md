---
title: FastAPI কী ও ইনস্টলেশন
description: Django-র তুলনায় FastAPI-র সুবিধা আর venv বানিয়ে fastapi[standard] ইনস্টল করা।
icon: Terminal
---

## গল্প

Django-তে একটা endpoint বানাতে হলে অন্তত চারটা ফাইলে হাত দিতে হয় — `models.py`, `serializers.py`, `views.py`, `urls.py`। FastAPI-তে একই কাজ একটাই ফাইলে, কয়েক লাইনেই হয়ে যায়। করিম ভাই শুনে অবাক — "তাহলে তো আমাদের অর্ডার API-টা একদিনেই হয়ে যাবে!"

তাই ঠিক হলো: একই রূপসী ফ্যাশনের পণ্য-ব্যবস্থাপনা, এবার FastAPI-তে। Django-র সাথে পার্থক্যটা বুঝতে সুবিধা হবে।

## Django বনাম FastAPI — এক নজরে

| ধারণা | Django/DRF | FastAPI |
| --- | --- | --- |
| ডেটা-কাঠামো ও ভ্যালিডেশন | Serializer | Pydantic Model |
| ডেটাবেস | ORM (বিল্ট-ইন) | SQLAlchemy (আলাদা ইনস্টল) |
| URL রাউটিং | `urls.py` | `APIRouter` |
| Admin Panel | বিল্ট-ইন, রেডিমেড | নেই, নিজে বানাতে হয় |
| API ডকুমেন্টেশন | drf-spectacular লাগে | এমনিতেই `/docs`-এ থাকে |
| Dependency Injection | তেমন নেই | `Depends()` — কোর ফিচার |
| Async সাপোর্ট | সীমিত | নেটিভ, পূর্ণ সাপোর্ট |

FastAPI সব জায়গায় Django-র চেয়ে ভালো — তা নয়। বড় CMS, admin-heavy অ্যাপে Django-ই বেশি সুবিধাজনক। কিন্তু **API-only** প্রজেক্টে FastAPI কম কোডে, দ্রুত, আর অটো-ডকুমেন্টেশনসহ কাজ দেয়।

## ইনস্টলেশন

প্রথমে একটা আলাদা প্রজেক্ট ফোল্ডার বানাও, তারপর virtual environment:

```bash
mkdir rupashi_api
cd rupashi_api

python3 -m venv venv
source venv/bin/activate
```

Windows-এ অ্যাক্টিভেট করার কমান্ড একটু আলাদা:

```bash
venv\Scripts\activate
```

এখন FastAPI ইনস্টল করো:

```bash
pip install "fastapi[standard]"
```

`[standard]` অংশটা জরুরি — এতে Uvicorn (সার্ভার), `httpx`, form-data সাপোর্টসহ দরকারি সব প্যাকেজ একসাথে চলে আসে। শুধু `pip install fastapi` করলে পরে `fastapi dev` কমান্ড পাওয়া যাবে না।

ইনস্টল ঠিক হয়েছে কিনা দেখো:

```bash
fastapi --version
```

## টিপস

- `python3 -m venv venv` — এখানে দ্বিতীয় `venv` হলো ফোল্ডারের নাম। নাম যা-ই দাও, অ্যাক্টিভেট করার সময় সেটাই ব্যবহার করবে।
- প্রতিবার নতুন টার্মিনাল খুললে আবার `source venv/bin/activate` চালাতে হবে। প্রম্পটের শুরুতে `(venv)` দেখলেই বুঝবে অ্যাক্টিভ আছে।
- `pip freeze > requirements.txt` দিয়ে ইনস্টল করা প্যাকেজের তালিকা সেভ করে রাখো — পরে সার্ভারে ডিপ্লয় করার সময় কাজে লাগবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `fastapi: command not found` | venv অ্যাক্টিভেট করেছ কিনা দেখো, তারপর `pip install "fastapi[standard]"` আবার চালাও |
| `python3: command not found` (Windows) | `python -m venv venv` লিখো |
| `pip` পুরোনো | `python -m pip install --upgrade pip` |

পরের ধাপে [প্রথম FastAPI অ্যাপ](/fastapi/first-app) বানানো হবে।
