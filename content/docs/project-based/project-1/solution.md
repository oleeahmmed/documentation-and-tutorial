---
title: System Design
description: মাল্টি-টেন্যান্ট Django + দুই CrewAI এজেন্ট + সাবপ্রসেস সেতু — যা ডিজাইন করা হয়েছে আর যা আসলে বানানো হলো।
icon: Network
---

**গল্প:** তানভীর বুঝতে চান — "অর্ডার এলেই কি সব অটো হবে, নাকি আমার টিম কিছু দেখবে?" উত্তর: ঝুঁকি কম হলে `SAFE`, বেশি হলে `HIGH_RISK` আর কাস্টমারকে অ্যাডভান্স চার্জের WhatsApp। সিদ্ধান্ত নেয় এজেন্ট, কিন্তু নিয়ন্ত্রণ থাকে ড্যাশবোর্ডে। আর যেহেতু একই সিস্টেম একাধিক ব্যবসায়ী ব্যবহার করবে, তাই প্রত্যেকের স্টোর আর অর্ডার আলাদা করে চেনার ব্যবস্থাও ডিজাইনে আছে।

## আর্কিটেকচার (যা আসলে বানানো হলো)

```text
WooCommerce (স্টোর ১, স্টোর ২, ...)
      │  webhook — প্রতি স্টোরের আলাদা token
      ↓
Django REST API
├─ /api/auth/login/          → token লগইন
├─ /api/websites/            → নিজের স্টোর + webhook URL
├─ /api/orders/webhook/...   → অর্ডার সেভ, তারপর background thread
└─ /api/orders/list/         → শুধু নিজের অর্ডার
      │  subprocess (আলাদা venv)
      ↓
ai_agents/ (CrewAI)
├─ ১. Fraud Analyst Agent   → কুরিয়ার হিস্ট্রি + ঠিকানা যাচাই
└─ ২. Verification Agent    → HIGH_RISK হলে Bengali WhatsApp
      │  structured JSON (৪ ফিল্ড)
      ↓
Order আপডেট → React ড্যাশবোর্ডে Safe / High Risk
```

## এজেন্টদের কাজ

| এজেন্ট | ইনপুট | আউটপুট | টুল |
| --- | --- | --- | --- |
| Fraud Analyst | অর্ডারের ফোন, ঠিকানা, টাকা | রিস্ক রিপোর্ট (`risk_status`, সফলতার হার) | কুরিয়ার হিস্ট্রি চেক |
| Verification Agent | প্রথম এজেন্টের রিপোর্ট | WhatsApp পাঠানো/না পাঠানো + চার ফিল্ডের JSON | WhatsApp সেন্ডার |

> প্রথমে চার এজেন্টের (Intake, Risk, Comms, Reporter) পরিকল্পনা ছিল। বাস্তবে দেখা গেল দুই এজেন্টই কাজটা পরিষ্কারভাবে করে — ইনটেক Django-ই করে, আর দৈনিক রিপোর্ট পরে যোগ করা যায়। কম এজেন্ট = কম খরচ, কম ভুল।

## রিস্ক সিদ্ধান্তের নিয়ম (এখন কোডে যা আছে)

```text
কুরিয়ার সফলতার হার < ৫০%   → HIGH_RISK + WhatsApp
ঠিকানা অসম্পূর্ণ             → HIGH_RISK + WhatsApp
নাহলে                        → SAFE, WhatsApp নয়
এজেন্ট চলতে না পারলে         → PENDING + "এজেন্ট চলেনি: ..." নোট
```

`FraudAnalysisResult`-এ ঠিক চারটা ফিল্ড:

| ফিল্ড | ধরন | ড্যাশবোর্ডে কোথায় |
| --- | --- | --- |
| `risk_status` | `SAFE` / `HIGH_RISK` | স্ট্যাটাস ব্যাজ, summary কার্ড |
| `courier_success_rate` | `"20%"`, `"93.3%"` | DB-তে সংরক্ষিত (ভবিষ্যতে কলাম) |
| `ai_analysis_note` | Bengali ব্যাখ্যা | DB-তে সংরক্ষিত (ভবিষ্যতে tooltip/details) |
| `whatsapp_sent` | `true` / `false` | DB-তে সংরক্ষিত |

## মাল্টি-টেন্যান্ট ডিজাইন

| সিদ্ধান্ত | কেন |
| --- | --- |
| `Website.owner` → `User` | প্রতিটা স্টোর এক ইউজারের; ইউজার মুছলে স্টোরও যায় |
| `Website.webhook_token` (UUID) | URL-এর চাবি; অনুমান করা কঠিন, প্রতি স্টোরে আলাদা |
| webhook URL-এ token | WordPress থেকে আসা ডেটা কোন স্টোরের, সেটা token-ই বলে |
| `Order.website` | প্রতিটা অর্ডার নির্দিষ্ট স্টোরের |
| `UniqueConstraint(website, wc_order_id)` | দুই স্টোরে একই `#1099` চলবে, এক স্টোরে ডুপ্লিকেট নয় |
| `filter(website__owner=request.user)` | লিস্ট, analyze, delete — সব জায়গায় মালিকানা চেক |
| serializer-এ `webhook_path` | ফ্রন্টএন্ড আর curl একই ঠিকানা পায় |

## কেরিয়ার সেতু (Django ↔ CrewAI)

```text
Django thread
   └─ subprocess.run(ai_agents/venv/python run_order.py result.json)
         ├─ stdin  → অর্ডার JSON
         ├─ কাজ    → execute_fraud_check()
         └─ stdout → result.json (৪ ফিল্ড)
   └─ Order আপডেট → risk_status, note, whatsapp_sent
```

| কেন এভাবে | ব্যাখ্যা |
| --- | --- |
| আলাদা venv | CrewAI-র ডিপেন্ডেন্সি Django-র পাইথনের সাথে সংঘর্ষ করতে পারে |
| subprocess | দুই পাইথন আলাদা প্রসেসে; একটা ভাঙলে অন্যটা টেকে |
| background thread | webhook সাথে সাথে রেসপন্স পায়, checkout ধীর হয় না |
| temp JSON ফাইল | বাংলা টেক্সট আর structured আউটপুট পরিষ্কারভাবে আসে |
| `timeout=600` | ধীর ফ্রি মডেলেও আটকে না থাকে |
| exception → note | ড্যাশবোর্ডেই বোঝা যায় এজেন্ট কেন চলেনি |

> বড় ভলিউমে (দিনে হাজারো অর্ডার) এই thread-এর জায়গায় Celery + Redis বসানো হয়। তখন শুধু `start_agent`-এর ভেতরটা বদলাবে — বাকি কোড একই থাকবে।

## স্ট্যাক (এখন)

| লেয়ার | টুল | কেন |
| --- | --- | --- |
| Backend | Django 6 + DRF | Webhook, API, token auth |
| Queue | Django thread + subprocess | ডেমোতে সহজ, পরে Celery |
| Agents | CrewAI 1.x | Agent, Task, Crew, `@tool` |
| LLM | OpenRouter | এক key-তে অনেক মডেল |
| DB | SQLite | ডেভেলপমেন্টের জন্য |
| Frontend | React 19 + Vite + Tailwind 4 + Shadcn UI | দ্রুত ড্যাশবোর্ড |
| Messaging | WhatsApp (ডেমোতে প্রিন্ট) | পরে Cloud API |

## ফোল্ডার স্ট্রাকচার

```text
fraud_shield_pro/
├── backend/
│   ├── core/                 # settings, urls, auth_views
│   ├── orders/
│   │   ├── models.py         # Website, Order
│   │   ├── serializers.py
│   │   ├── views.py          # webhook, list, analyze, websites
│   │   ├── agent.py          # সেতু: subprocess + thread
│   │   └── urls.py
│   └── venv/
├── ai_agents/
│   ├── llm_config.py         # OpenRouter LLM
│   ├── tools.py              # কুরিয়ার + WhatsApp
│   ├── agents.py             # দুই এজেন্ট
│   ├── tasks.py              # দুই টাস্ক + Pydantic
│   ├── crew.py               # Crew + execute_fraud_check
│   ├── run_order.py          # stdin/stdout দরজা
│   ├── test_run.py
│   └── venv/
└── frontend/
    └── src/
        ├── lib/api.js
        ├── components/       # login, dashboard, websites, sidebar, header
        └── App.jsx
```

## প্রোডাকশনে যেতে যা বদলাবে

| এখন | প্রোডাকশনে |
| --- | --- |
| SQLite | PostgreSQL |
| Django thread | Celery + Redis (retry, dead-letter) |
| নকল কুরিয়ার হিস্ট্রি | Steadfast/Pathao/RedX merchant API |
| WhatsApp প্রিন্ট | WhatsApp Cloud API টেমপ্লেট |
| `CORS_ALLOW_ALL_ORIGINS` | নির্দিষ্ট origin |
| `DEBUG=True` | `DEBUG=False`, সিক্রেট `.env`-এ, HTTPS |
| token login | চাইলে JWT/refresh বা session + 2FA |

## পরের ধাপ

শুরু থেকে পড়তে: [Project 1 — Overview](/docs/project-based/project-1/overview)
আগের পর্ব: [পর্ব ৩ — CrewAI এজেন্ট ও Django সেতু](/docs/project-based/project-1/crewai-agent)
