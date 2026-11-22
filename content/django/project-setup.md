---
title: প্রজেক্ট সেটআপ
description: venv, Django + Pillow ইনস্টল, school_system প্রজেক্ট আর website app তৈরি।
icon: Download
---

## ইনস্টলেশন

```bash
python3 -m venv venv
source venv/bin/activate      # Windows-এ: venv\Scripts\activate
pip install django pillow
django-admin startproject school_system
cd school_system
```

`pillow` এই পর্বেই লাগবে না, কিন্তু পরে Student API-তে ছবি আপলোডের জন্য লাগবে — একবারেই ইনস্টল করে নিচ্ছি।

## App বানানো

```bash
python manage.py startapp website
```

`settings.py`-তে:

```python
INSTALLED_APPS = [
    # ... ডিফল্ট apps
    'website',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],   # 👈 গ্লোবাল টেমপ্লেট ফোল্ডার
        'APP_DIRS': True,
        # ...
    },
]
```

### গল্প দিয়ে বোঝা

- **Project** (`school_system`) = পুরো স্কুল
- **App** (`website`) = স্কুলের একটা বিভাগ (ওয়েবসাইট বিভাগ)

`DIRS`-এ `BASE_DIR / 'templates'` দিলে Django প্রজেক্টের গোড়ায় একটা গ্লোবাল `templates/` ফোল্ডারে খুঁজবে। এতে একাধিক App একই টেমপ্লেট শেয়ার করতে পারে — নাহলে প্রতিটা App-এর ভেতরে আলাদা `templates/` ফোল্ডার রাখতে হতো।

এখন কাঠামো:

```text
school_system/
├── manage.py
├── templates/              # গ্লোবাল টেমপ্লেট (এখনো খালি)
├── school_system/
│   ├── settings.py
│   └── urls.py
└── website/
    ├── models.py
    ├── views.py
    └── ...
```

➡️ পরের পর্ব: [Classic Model](/django/classic-model) — ওয়েবসাইটের প্রথম ডেটা কাঠামো বানাই।
