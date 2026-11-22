---
title: API সেটআপ
description: DRF, CORS, JWT, Swagger, CKEditor, SMTP — সব প্যাকেজ আর সম্পূর্ণ settings.py।
icon: Package
---

## গল্প

এবার সম্পূর্ণ আলাদা ধরনের কাজ — একটা প্রোডাকশন-গ্রেড **Student Management API**। ছাত্রের ছবি আপলোড হবে (Pillow), বায়ো লেখা হবে রিচ-টেক্সটে (CKEditor), ফ্রন্টএন্ড অন্য পোর্ট থেকে কল করবে (CORS), লগইন হবে টোকেনে (JWT), ডকুমেন্টেশন থাকবে Swagger/Redoc-এ, আর নতুন ছাত্র ভর্তি হলে ইমেইল যাবে (SMTP)।

## ইনস্টলেশন (সব একসাথে)

```bash
pip install djangorestframework django-cors-headers djangorestframework-simplejwt drf-spectacular django-ckeditor pillow
python manage.py startapp students
```

## `settings.py` — সম্পূর্ণ কনফিগারেশন

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',                # 👈 CORS
    'rest_framework',             # 👈 DRF
    'rest_framework_simplejwt',   # 👈 JWT
    'drf_spectacular',            # 👈 Swagger/Redoc
    'ckeditor',                   # 👈 রিচ-টেক্সট এডিটর
    'ckeditor_uploader',          # 👈 CKEditor-এর ভেতরে ছবি আপলোড সাপোর্ট

    'website',
    'students',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',   # 👈 সবার উপরের দিকে রাখো
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ---- CORS ----
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# ---- DRF ----
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',   # 👈 Swagger/Redoc-এর জন্য
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# ---- drf-spectacular (Swagger/Redoc) ----
SPECTACULAR_SETTINGS = {
    'TITLE': 'Student Management API',
    'DESCRIPTION': 'স্কুল ম্যানেজমেন্টের জন্য একটা সম্পূর্ণ API',
    'VERSION': '1.0.0',
}

# ---- Media (ছবি আপলোডের জন্য) ----
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ---- CKEditor ----
CKEDITOR_UPLOAD_PATH = "uploads/"   # ছবি কোথায় আপলোড হবে (MEDIA_ROOT-এর ভেতরে)
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 300,
    },
}

# ---- SMTP ইমেইল ----
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'   # Gmail হলে App Password লাগবে, সরাসরি পাসওয়ার্ড না
DEFAULT_FROM_EMAIL = 'School System <your-email@gmail.com>'
```

## কোন অংশ কী জন্য

| অংশ | কাজ |
| --- | --- |
| `corsheaders` + `CorsMiddleware` | React/Next.js ফ্রন্টএন্ডকে API কলের অনুমতি |
| `rest_framework` + `REST_FRAMEWORK` | DRF চালু, JWT ডিফল্ট, পেজিনেশন ১০ |
| `rest_framework_simplejwt` | টোকেন-ভিত্তিক লগইন |
| `drf_spectacular` + `SPECTACULAR_SETTINGS` | Swagger/Redoc ডকুমেন্টেশন |
| `ckeditor` + `ckeditor_uploader` | রিচ-টেক্সট বায়ো আর ভেতরে ছবি |
| `MEDIA_URL` / `MEDIA_ROOT` | আপলোড করা ছবি কোথায় থাকবে |
| `EMAIL_*` | নতুন ছাত্র ভর্তি হলে ইমেইল পাঠানো |

> **নিরাপত্তা নোট:** `EMAIL_HOST_PASSWORD` কখনো সরাসরি `settings.py`-তে না লিখে `python-decouple` বা `.env` দিয়ে লোড করো, আর `.env` ফাইল গিটে কমিট করো না (`.gitignore`-এ রাখো)। এখানে শেখার সুবিধার্থে সরাসরি লেখা হলো। Gmail-এ সাধারণ পাসওয়ার্ড কাজ করবে না — Google Account থেকে **App Password** বানাতে হবে।

➡️ পরের পর্ব: [Student Model ও Admin](/django/student-model) — ছবি আর রিচ-টেক্সট ফিল্ডসহ Model বানাই।
