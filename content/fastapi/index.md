---
title: FastAPI Tutorial
description: রূপসী ফ্যাশনের পণ্য-ব্যবস্থাপনা API — Django-র মতোই কাজ, কিন্তু কম কোডে আর অটো Swagger ডকুমেন্টেশনসহ।
icon: Rocket
---

Django টিউটোরিয়ালে আমরা একটা স্কুল সিস্টেম বানিয়েছিলাম — সেখানে `models.py`, `serializers.py`, `views.py`, `urls.py` মিলিয়ে অনেক ফাইল লাগত। এবার করিম ভাই চাইছেন রূপসী ফ্যাশনের **পণ্য-ব্যবস্থাপনা API**-টা FastAPI দিয়ে বানাতে। কারণটা সহজ — একই কাজ **অনেক কম কোডে**, আর সাথে সাথে `http://127.0.0.1:8000/docs`-এ ইন্টারঅ্যাকটিভ Swagger ডকুমেন্টেশন তৈরি হয়ে যায়। আলাদা করে drf-spectacular বসাতে হয় না।

তাই এই টিউটোরিয়ালে শূন্য থেকে শুরু করে একটা প্রোডাকশন-রেডি পণ্য API বানানো দেখানো হয়েছে — প্রতিটা ধারণা আলাদা পেজে, হাতে-কলমে কোড আর হুবহু আউটপুটসহ।

> **কে কার জন্য:** FastAPI শেখার আগে [Python Basic](/python-basic) শেষ করে আসা ভালো — বিশেষ করে ফাংশন, ক্লাস আর type hint না জানলে Pydantic আর `Depends()` বোঝা কঠিন হবে।

## শুরুর আগে

- Python 3.10 বা তার উপরে (3.12 হলে ভালো)
- টার্মিনাল/কমান্ড লাইন চালানোর বেসিক ধারণা
- একটা কোড এডিটর — VS Code-ই যথেষ্ট

## অধ্যায়গুলো

প্রতিটা পেজে একটা করে ধারণা — গল্প, কোড, আর "বাস্তবে কী ঘটে"।

| পর্ব | পেজ | কী শিখবে |
| --- | --- | --- |
| ১ | [FastAPI কী ও ইনস্টলেশন](/fastapi/installation) | কেন FastAPI, venv আর `pip install "fastapi[standard]"` |
| ২ | [প্রথম FastAPI অ্যাপ](/fastapi/first-app) | `main.py`, `fastapi dev`, `/docs` আর `/redoc` |
| ৩ | [Path Parameters](/fastapi/path-parameters) | URL-এর ভেতরে ID, type hint দিয়ে ভ্যালিডেশন |
| ৪ | [Query Parameters](/fastapi/query-parameters) | filter, pagination, ডিফল্ট ভ্যালু |
| ৫ | [Request Body](/fastapi/request-body) | Pydantic Model দিয়ে ইনপুট ভ্যালিডেশন |
| ৬ | [Response Model](/fastapi/response-model) | কোন ফিল্ড কাস্টমার দেখবে, কোনটা লুকাবে |
| ৭ | [Status Code ও Error](/fastapi/status-errors) | `HTTPException`, 201/404 |
| ৮ | [Pydantic Validation](/fastapi/validation) | `Field`, `field_validator` দিয়ে নিয়ম বাঁধা |
| ৯ | [Router দিয়ে কোড গোছানো](/fastapi/routers) | `APIRouter`, prefix, tag |
| ১০ | [Dependency Injection](/fastapi/dependencies) | `Depends()` — DB session, pagination পুনর্ব্যবহার |
| ১১ | [Authentication — JWT](/fastapi/authentication) | OAuth2 password flow, টোকেন, Swagger Authorize |
| ১২ | [Lifespan](/fastapi/lifespan) | অ্যাপ চালু/বন্ধের সময় সেটআপ ও পরিষ্কার |
| ১৩ | [CORS](/fastapi/cors) | React/Next.js ফ্রন্টএন্ডকে অনুমতি দেওয়া |
| ১৪ | [Database — SQLAlchemy](/fastapi/database) | আসল ডেটাবেসে পণ্য সেভ করা |
| ১৫ | [Background Tasks](/fastapi/background-tasks) | ইউজারকে অপেক্ষা না করিয়ে ইমেইল/নোটিফিকেশন |
| ১৬ | [File Upload](/fastapi/file-upload) | পণ্যের ছবি আপলোড |
| ১৭ | [Async](/fastapi/async) | FastAPI কেন এত দ্রুত |
| ১৮ | [Testing](/fastapi/testing) | `TestClient` আর pytest |
| ১৯ | [সম্পূর্ণ প্রজেক্ট](/fastapi/full-project) | সবকিছু একসাথে চালু-অবস্থায় |
| — | [সারসংক্ষেপ](/fastapi/summary) | Django বনাম FastAPI, পুরো ম্যাপ |

## শেষে ফোল্ডারটা এরকম হবে

```text
rupashi_api/
├── main.py
├── auth.py
├── database.py
├── requirements.txt
└── routers/
    ├── __init__.py
    └── products.py
```

একদম শুরু করতে [ইনস্টলেশন পেজে](/fastapi/installation) যাও।
