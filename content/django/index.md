---
title: Django Tutorial
description: করিম ভাইয়ের রূপসী ফ্যাশনের গল্পে Django — Models থেকে DRF, JWT, Admin Panel পর্যন্ত ৮টা পর্ব।
icon: Boxes
---

করিম ভাই ঠিক করলেন রূপসী ফ্যাশনের জন্য একটা ওয়েবসাইট/API বানাবেন। রফিক পণ্যের ডেটা সামলাবে, সুমন ডিজাইন দেখাবে, নাদিয়া API দিয়ে ফ্রন্টএন্ডে তথ্য পাঠাবে। এর জন্য লাগবে **Django**।

**শুরু করার আগে:** [Python Basic](/python-basic) শেষ করে এসো — বিশেষ করে ক্লাস ও অবজেক্ট অধ্যায়টা, কারণ Django Model আসলে একটা Python ক্লাসই, শুধু Django নিজে সেটাকে ডেটাবেস টেবিলে রূপান্তর করে দেয়।

## পর্বগুলো

প্রতিটা পর্ব আলাদা পেজ — গল্প, কোড, আর হুবহু আউটপুট সহ।

| পর্ব | কী শিখবে |
| --- | --- |
| [Installation](/django/installation) | venv, Django ইনস্টল, project ও app বানানো |
| [Models](/django/models) | ডেটাবেস টেবিলের নকশা আর migration |
| [Admin Panel](/django/admin) | কোড ছাড়া পণ্য ম্যানেজ করার ড্যাশবোর্ড |
| [Views ও URLs](/django/views-urls) | অনুরোধের উত্তর দেওয়া |
| [DRF](/django/drf) | Serializer, ViewSet, Router দিয়ে পেশাদার API |
| [CORS](/django/cors) | ফ্রন্টএন্ড থেকে API কল করার অনুমতি |
| [JWT Authentication](/django/jwt) | টোকেন দিয়ে নিরাপদ লগইন |
| [সম্পূর্ণ প্রজেক্ট](/django/complete-project) | সব ফাইল একসাথে |
| [সারসংক্ষেপ](/django/summary) | এক নজরে পুরো ম্যাপ |

## কী বানাবে

একটা ছোট কিন্তু প্রোডাকশন-রেডি **Rupashi Fashion API** — যেখানে থাকবে:

- `Product` মডেল ও ডেটাবেস টেবিল
- Admin প্যানেল থেকে পণ্য যোগ/এডিট/ডিলিট
- `/api/products/`-এ পূর্ণ CRUD API (DRF)
- ব্রাউজার থেকে সরাসরি টেস্ট করার সুবিধা
- CORS দিয়ে React/Next.js ফ্রন্টএন্ডের সাথে সংযোগ
- JWT টোকেন দিয়ে লগইন-সুরক্ষিত এডিট

> Django শেষ হলে [CrewAI ডকুমেন্টেশন](/docs)-এ গিয়ে AI Agent বানানো শুরু করো — এই API-ই পরে তোমার Agent-এর ডেটা সোর্স হতে পারে।
