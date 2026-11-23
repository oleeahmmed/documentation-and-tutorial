---
title: সারসংক্ষেপ
description: Django বনাম FastAPI এক নজরে, পুরো শেখার ম্যাপ আর পরের ধাপের চেকলিস্ট।
icon: ListChecks
---

## Django বনাম FastAPI

| ধারণা | Django/DRF | FastAPI |
| --- | --- | --- |
| ডেটা-কাঠামো/ভ্যালিডেশন | Serializer | Pydantic Model |
| ডেটাবেস | ORM (বিল্ট-ইন) | SQLAlchemy (আলাদা ইনস্টল) |
| URL রাউটিং | `urls.py` | `APIRouter` |
| Admin Panel | বিল্ট-ইন, রেডিমেড | নেই, নিজে বানাতে হয় |
| API ডকুমেন্টেশন | drf-spectacular লাগে | এমনিতেই `/docs`-এ থাকে |
| নির্ভরশীলতা ইনজেকশন | তেমন নেই | `Depends()` — কোর ফিচার |
| Async সাপোর্ট | সীমিত | নেটিভ, পূর্ণ সাপোর্ট |
| শেখার গতি | একটু বেশি সময় লাগে (বেশি ফাইল) | দ্রুত শেখা যায় (কম বয়লারপ্লেট) |

## পুরো যাত্রার ম্যাপ

```text
প্রথম অ্যাপ বানানো (@app.get, @app.post)
    ↓
Path/Query Parameters দিয়ে ডেটা নেওয়া
    ↓
Pydantic Model দিয়ে Request Body ভ্যালিডেট করা
    ↓
response_model দিয়ে আউটপুট নিয়ন্ত্রণ করা
    ↓
HTTPException দিয়ে error handling
    ↓
APIRouter দিয়ে কোড গুছানো
    ↓
Depends() দিয়ে reusable logic (DB session, auth)
    ↓
JWT দিয়ে authentication
    ↓
lifespan দিয়ে startup/shutdown ম্যানেজ করা
    ↓
SQLAlchemy দিয়ে আসল ডেটাবেস যুক্ত করা
    ↓
Background Tasks, File Upload, Async, Testing
```

## নিজের প্রজেক্টে যাচাই-চেকলিস্ট

- [ ] `fastapi[standard]` আলাদা venv-এ ইনস্টল
- [ ] `/docs` খুলে সব endpoint দেখা যাচ্ছে
- [ ] Model-এ `Field` দিয়ে প্রয়োজনীয় সীমা বসানো
- [ ] `response_model` দিয়ে গোপন ফিল্ড (ক্রয়মূল্য ইত্যাদি) ব্লক করা
- [ ] ভুল ID-তে 404, ভুল ইনপুটে 422 আসছে
- [ ] `APIRouter` দিয়ে ফিচার-ভিত্তিক ফাইল ভাগ
- [ ] ডেটাবেস session `get_db` dependency দিয়ে খোলা/বন্ধ
- [ ] protected endpoint-এ টোকেন ছাড়া 401 আসছে
- [ ] `SECRET_KEY` কোডে কমিট করা নেই
- [ ] CORS-এ প্রোডাকশন ডোমেইন যোগ করা
- [ ] মূল endpoint-গুলোর জন্য pytest টেস্ট আছে

## এরপর কোথায় যাবে

- **Migration:** স্কিমা বদলাতে **Alembic** — `alembic init`, revision, upgrade
- **Async ডেটাবেস:** `asyncpg` + `AsyncSession` দিয়ে পুরো API async করা
- **রোল-ভিত্তিক অনুমতি:** JWT-তে `role` রেখে `Depends`-এ চেক
- **ডিপ্লয়:** `fastapi run main.py --host 0.0.0.0` + Nginx/Caddy reverse proxy, বা Docker
- **টাস্ক কিউ:** ভারী কাজের জন্য Celery/RQ + Redis

শুরু থেকে আবার দেখতে চাইলে [FastAPI Tutorial](/fastapi) — আর Django-র সাথে তুলনা করতে চাইলে [Django Tutorial](/django)।
