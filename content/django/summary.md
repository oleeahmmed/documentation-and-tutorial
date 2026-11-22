---
title: সারসংক্ষেপ
description: সম্পূর্ণ ফোল্ডার কাঠামো, কোন ফিচার কোথায়, আর পুরো গল্প এক নজরে।
icon: BookOpen
---

## সম্পূর্ণ ফোল্ডার কাঠামো

```text
school_system/
├── manage.py
├── media/
│   └── student_photos/
├── templates/
│   └── website/
│       ├── base.html
│       ├── home.html
│       └── contact.html
├── school_system/
│   ├── settings.py
│   └── urls.py
├── website/
│   ├── models.py
│   ├── forms.py
│   ├── views.py
│   └── urls.py
└── students/
    ├── models.py
    ├── serializers.py
    ├── views.py
    ├── admin.py
    ├── signals.py
    ├── apps.py
    └── urls.py
```

## কোন ফিচার কোথায়

| ফিচার | লাইব্রেরি | কোথায় কনফিগার |
| --- | --- | --- |
| Classic Views/HTML/Forms | Django নিজেই | `website/` app |
| REST API | `djangorestframework` | `students/views.py`, `serializers.py` |
| CORS | `django-cors-headers` | `settings.py`-এ `CORS_ALLOWED_ORIGINS` |
| JWT Auth | `djangorestframework-simplejwt` | `urls.py`-এ `TokenObtainPairView` |
| Swagger/Redoc | `drf-spectacular` | `urls.py`-এ `SpectacularSwaggerView`/`RedocView` |
| ছবি আপলোড | `Pillow` | `models.py`-এ `ImageField` |
| রিচ-টেক্সট এডিটর | `django-ckeditor` | `models.py`-এ `RichTextUploadingField` |
| ইমেইল (SMTP) | Django বিল্ট-ইন | `settings.py`-এ `EMAIL_BACKEND` + `signals.py` |

## সম্পূর্ণ গল্পের সারসংক্ষেপ

```text
প্রজেক্ট শুরু হলো (startproject + দুটো app: website, students)
    ↓
Classic Django দিয়ে ওয়েবসাইট বানানো হলো (Model → Form → View → Template)
    ↓
DRF দিয়ে Student API বানানো হলো (Model with Pillow+CKEditor → Serializer → ViewSet)
    ↓
CORS যোগ করে ফ্রন্টএন্ডের অনুমতি দেওয়া হলো
    ↓
JWT দিয়ে নিরাপদ লগইন ব্যবস্থা বানানো হলো
    ↓
drf-spectacular দিয়ে Swagger ও Redoc ডকুমেন্টেশন স্বয়ংক্রিয় হলো
    ↓
Signal দিয়ে SMTP ইমেইল স্বয়ংক্রিয় করা হলো (নতুন ছাত্র ভর্তি হলে)
```

## এরপর কী

এটাই একটা সম্পূর্ণ, বাস্তব প্রোডাকশন-রেডি Django প্রজেক্টের কাঠামো — একই কোডবেসে Classic ওয়েবসাইট আর আধুনিক REST API দুটোই একসাথে চলছে।

- পুরো টিউটোরিয়াল আবার দেখতে: [Django Tutorial](/django)
- ফর্ম/টেমপ্লেটে আটকে গেলে: [Classic Forms](/django/classic-forms) · [Templates](/django/classic-templates)
- API/ডকুমেন্টেশন নিয়ে সমস্যা হলে: [API Views ও URLs](/django/api-views-urls) · [চালিয়ে টেস্ট](/django/run-and-test)
- Python ভিত্তি দুর্বল মনে হলে: [Python Basic](/python-basic)

> প্রোডাকশনে যাওয়ার আগে `DEBUG=False` করো, `SECRET_KEY` আর `EMAIL_HOST_PASSWORD` `.env`-এ রাখো (গিটে কমিট না), আর আপলোড করা `media/` ফোল্ডার যেন ডিপ্লয়ের সময় মুছে না যায় সেটা নিশ্চিত করো। ডিপ্লয়ের জন্য [Deploy Master Prompt](/prompt-master/deploy-master-prompt) ব্যবহার করতে পারো।
