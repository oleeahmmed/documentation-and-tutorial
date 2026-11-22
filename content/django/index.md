---
title: Django Tutorial
description: একই প্রজেক্টে Classic Django ওয়েবসাইট আর DRF Student Management API — CORS, JWT, Swagger, ছবি আপলোড, রিচ-টেক্সট, SMTP সব সহ।
icon: Boxes
---

এবার একই প্রজেক্টে দুটো আলাদা জিনিস বানাবো — একটা **Classic Django ওয়েবসাইট** (Views + HTML + Forms), আর একটা পূর্ণাঙ্গ **DRF Student Management API**। দুইটাই `school_system` প্রজেক্টে পাশাপাশি চলবে, আর প্রতিটা কমন ফিচার — CORS, JWT, Swagger/Redoc, SMTP ইমেইল, ছবি আপলোড, রিচ-এডিটর — থাকবে।

**শুরু করার আগে:** [Python Basic](/python-basic) শেষ করে এসো — বিশেষ করে ক্লাস ও মডিউল অধ্যায়, কারণ Django Model আর View আসলে Python ক্লাস আর ফাংশনই।

## পর্ব A: Classic Django ওয়েবসাইট

স্কুলের জন্য একটা সাধারণ ওয়েবসাইট — হোম পেজ আর একটা যোগাযোগ ফর্ম, যেটা ভিজিটরের বার্তা ডেটাবেসে সেভ করে।

| অধ্যায় | কী শিখবে |
| --- | --- |
| [প্রজেক্ট সেটআপ](/django/project-setup) | venv, Django + Pillow, project ও `website` app |
| [Classic Model](/django/classic-model) | `ContactMessage` Model আর migration |
| [Classic Forms](/django/classic-forms) | ModelForm দিয়ে ভ্যালিডেটেড ফর্ম |
| [Views ও URLs](/django/classic-views-urls) | Function-Based View, POST-Redirect-GET |
| [Templates](/django/classic-templates) | base/home/contact HTML আর টেমপ্লেট ট্যাগ |

## পর্ব B: DRF Student Management API

প্রোডাকশন-গ্রেড API — ছবি আপলোড (Pillow), রিচ-টেক্সট বায়ো (CKEditor), CORS, JWT, Swagger/Redoc ডকুমেন্টেশন, আর নতুন ছাত্র ভর্তি হলে স্বয়ংক্রিয় SMTP ইমেইল।

| অধ্যায় | কী শিখবে |
| --- | --- |
| [API সেটআপ](/django/api-setup) | সব প্যাকেজ আর সম্পূর্ণ `settings.py` |
| [Student Model ও Admin](/django/student-model) | ImageField, RichTextUploadingField, ছবি প্রিভিউ |
| [Serializer ও Signal](/django/serializers-signals) | Model ↔ JSON, post_save ইমেইল |
| [API Views ও URLs](/django/api-views-urls) | ViewSet, Router, JWT, Swagger/Redoc URL |
| [চালিয়ে টেস্ট](/django/run-and-test) | Swagger-এ Try it out, JWT + multipart curl |
| [সারসংক্ষেপ](/django/summary) | ফোল্ডার কাঠামো, ফিচার-ম্যাপ, গল্পের সারসংক্ষেপ |

> একই কোডবেসে Classic ওয়েবসাইট আর আধুনিক REST API — এই দুটো একসাথে চালানোর অভ্যাসই পরে বড় প্রজেক্টে সবচেয়ে কাজে লাগে।
