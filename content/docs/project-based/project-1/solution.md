---
title: System Design
description: চারটা CrewAI এজেন্ট, রিস্ক স্কোরের নিয়ম, WhatsApp ফ্লো আর পুরো স্ট্যাক।
icon: Network
---

**গল্প:** তানভীর বুঝতে চান — "অর্ডার এলেই কি সব অটো হবে, নাকি আমার টিম কিছু দেখবে?" উত্তর: ঝুঁকি কম হলে অটো অ্যাপ্রুভ, বেশি হলে হোল্ড + WhatsApp, মাঝামাঝি হলে ম্যানুয়াল রিভিউ। সিদ্ধান্তটা নেবে এজেন্ট, কিন্তু নিয়ন্ত্রণ থাকবে ড্যাশবোর্ডে।

## আর্কিটেকচার

```text
WooCommerce (order created)
      │  webhook (async, signed)
      ▼
Django REST API ──► Redis queue (Celery)
      │
      ▼
CrewAI Crew
├─ ১. Order Intake Agent
│     order normalize, phone duplicate, address quality
├─ ২. Risk Analyst Agent
│     courier history + rule score + LLM reasoning
├─ ৩. Customer Comms Agent
│     Bangla/Banglish WhatsApp template (advance charge)
└─ ৪. Ops Reporter Agent
      daily summary, top fraud patterns
      │
      ▼
PostgreSQL + React Dashboard
```

## এজেন্টদের কাজ

| এজেন্ট | ইনপুট | আউটপুট | টুল |
| --- | --- | --- | --- |
| Order Intake | Webhook payload | পরিষ্কার অর্ডার রেকর্ড | WooCommerce API, DB |
| Risk Analyst | অর্ডার + কুরিয়ার হিস্ট্রি | ০–১০০ স্কোর + কারণ | Courier adapter (CSV/API), DB |
| Customer Comms | স্কোর + কাস্টমার ভাষা | WhatsApp মেসেজ | WhatsApp Cloud API |
| Ops Reporter | দিনের সব সিদ্ধান্ত | সামারি + ট্রেন্ড | DB, email |

## রিস্ক স্কোর কীভাবে

| সিগন্যাল | ওজন | উদাহরণ |
| --- | --- | --- |
| কুরিয়ার রিটার্ন অনুপাত | সবচেয়ে বেশি | শেষ ৫ পার্সেলের ৩টা রিটার্ন |
| অর্ডার ভ্যালু | মাঝারি | ক্যাটাগরি গড়ের ৩ গুণ |
| ঠিকানা অসম্পূর্ণ | মাঝারি | থানা/এলাকা নেই |
| নতুন/ডুপ্লিকেট ফোন | কম–মাঝারি | ৭ দিনে ৫টা অর্ডার |
| পেমেন্ট ধরন | কম | COD বনাম প্রিপেইড |

> ডোমেইন-নিয়মই স্কোরের মূল ভিত্তি; LLM কাজ করবে **ব্যাখ্যা** লিখতে আর অস্পষ্ট কেসে যুক্তি দিতে — যাতে ম্যানেজার "কেন" বুঝতে পারে।

## সিদ্ধান্তের নিয়ম

```text
score ≥ 70   → HOLD + WhatsApp অ্যাডভান্স চার্জ
40–69        → ম্যানুয়াল রিভিউ (ড্যাশবোর্ডে)
< 40         → অটো অ্যাপ্রুভ (dispatch)
```

## WhatsApp টেমপ্লেট (উদাহরণ)

```text
প্রিয় {name}, আপনার অর্ডার #{order_id} নিশ্চিত করতে
অনুগ্রহ করে ১৩০ টাকা অ্যাডভান্স ডেলিভারি চার্জ পাঠান।
পেমেন্টের পর পার্সেল ডেলিভারিতে দেওয়া হবে।
কোনো প্রশ্ন থাকলে এই নম্বরেই মেসেজ দিন।
```

```text
Hi {name}, to confirm order #{order_id}, please pay
BDT 130 advance delivery charge. We will dispatch
your parcel right after the payment is received.
```

## স্ট্যাক

| লেয়ার | টুল | কেন |
| --- | --- | --- |
| Backend | Django + DRF | Webhook, API, auth |
| Queue | Celery + Redis | Checkout ধীর না হওয়া |
| Agents | CrewAI | মাল্টি-এজেন্ট ওয়ার্কফ্লো |
| DB | PostgreSQL | অর্ডার, স্কোর, ইতিহাস |
| Frontend | React/Next | ড্যাশবোর্ড |
| Messaging | WhatsApp Cloud API | টেমপ্লেট মেসেজ |

## ফোল্ডার স্ট্রাকচার (প্রস্তাবিত)

```text
fraud-shield/
├── backend/
│   ├── orders/          # webhook, models
│   ├── risk/            # rules, courier adapters
│   ├── agents/          # CrewAI crew + tasks
│   └── notify/          # WhatsApp templates
├── frontend/            # dashboard
└── docs/                # setup + API docs
```

## মাইলস্টোন (ক্লায়েন্ট পোস্ট অনুযায়ী)

| ধাপ | কাজ | ডেলিভারেবল |
| --- | --- | --- |
| ১ | Discovery + ৩০ দিনের ডেটা অডিট | কীভাবে ৩০% ফেক ধরা পড়ছে তার বিশ্লেষণ |
| ২ | Risk engine + কুরিয়ার ইন্টিগ্রেশন | স্কোর + কারণ API |
| ৩ | WhatsApp + ড্যাশবোর্ড | HOLD/approve ফ্লো |
| ৪ | UAT + VPS ডিপ্লয় + ডকুমেন্টেশন | হ্যান্ডওভার |

## পরের ধাপ

এই পেজগুলোতে আমরা সিস্টেমটা **ধাপে ধাপে বানাবো** — অর্ডার মডেল, webhook, courier adapter, CrewAI crew, WhatsApp, dashboard। কোড শুরু হলে প্রতিটা ধাপের আলাদা পেজ যোগ হবে।

➡️ পোস্টটা আরেকবার দেখতে: [Project 1 — ক্লায়েন্ট পোস্ট](/docs/project-based/project-1)
