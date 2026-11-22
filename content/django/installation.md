---
title: Installation
description: venv বানিয়ে Django ইনস্টল, project ও app তৈরি, তারপর সার্ভার চালু।
icon: Download
---

## ইনস্টলেশন

আগে Python Basic-এর [Installation](/python-basic/installation) পেজ দেখে Python আর venv ঠিকঠাক আছে কিনা নিশ্চিত করো। তারপর:

```bash
python3 -m venv venv
source venv/bin/activate      # Windows-এ: venv\Scripts\activate
pip install django
```

ইনস্টল ঠিক হয়েছে কিনা:

```bash
python -m django --version
```

## প্রজেক্ট ও App বানানো

```bash
django-admin startproject rupashi_fashion
cd rupashi_fashion
python manage.py startapp products
```

### গল্প দিয়ে বোঝা

- **Project** (`rupashi_fashion`) = করিম ভাইয়ের পুরো কোম্পানি
- **App** (`products`) = কোম্পানির একটা বিভাগ (যেমন "পণ্য বিভাগ") — একটা প্রজেক্টে একাধিক App থাকতে পারে (products, orders, users)

এখন ফোল্ডার-কাঠামোটা এরকম:

```text
rupashi_fashion/
├── manage.py
├── rupashi_fashion/        # প্রজেক্টের সেটিংস
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── products/               # আমাদের App
    ├── models.py
    ├── views.py
    └── admin.py
```

### App-কে প্রজেক্টে যুক্ত করা

`rupashi_fashion/settings.py`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'products',   # 👈 নতুন যোগ হলো
]
```

Django-কে বলতে হচ্ছে — "এই `products` App-টা আমার প্রজেক্টের অংশ, একে চিনে রাখো।" যোগ না করলে এই App-এর Model বা Admin কিছুই কাজ করবে না।

### সার্ভার চালানো

```bash
python manage.py runserver
```

আউটপুট:

```text
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
November 23, 2026 - 10:00:00
Django version 5.x, using settings 'rupashi_fashion.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

ব্রাউজারে `http://127.0.0.1:8000` গেলে Django-র ডিফল্ট ওয়েলকাম পেজ দেখবে — রকেট উড়ছে, মানে সব ঠিক।

➡️ পরের পর্ব: [Models](/django/models) — এখন আসল ডেটার কাঠামো বানাবো।
