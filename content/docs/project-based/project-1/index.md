---
title: Project 1 — Fraud Detection
description: তানভীরের WooCommerce স্টোরের ফেক অর্ডার ধরার সিস্টেম — আসল ক্লায়েন্ট পোস্ট আর গল্পসহ।
icon: Target
---

**গল্প:** রাত ১১টায় Olee-এর ফোনে তানভীর। ঢাকার একটা ক্লথিং ব্র্যান্ড চালান — WooCommerce সাইট, প্রতিদিন ৩০০+ অর্ডার। সমস্যা: প্রায় **৩০% অর্ডার ফেক বা রিটার্ন** আসে। কুরিয়ার চার্জ, প্যাকিং, রিটার্ন প্রসেস — সব মিলিয়ে মাসে লাখ টাকার ক্ষতি। এখন ২ জন কর্মী সারাদিন ফোন করে সন্দেহভাজন অর্ডার যাচাই করে — তাও ধরা পড়ে না।

তানভীর চান, সিস্টেমটা **অর্ডার আসার সাথে সাথেই** কাস্টমারের নম্বর দেখে কুরিয়ার (Steadfast/Pathao) হিস্ট্রিতে রিটার্ন আছে কিনা চেক করবে। ঝুঁকি বেশি হলে ডেলিভারির আগেই হোয়াটসঅ্যাপে অটো মেসেজ দিয়ে **অ্যাডভান্স ডেলিভারি চার্জ** চাইবে। আর মালিকের জন্য একটা ড্যাশবোর্ড — কোন অর্ডার কেন ঝুঁকিপূর্ণ, কী অ্যাকশন নেওয়া হলো।

এই পোস্টটাই **Option A-র #১** — বাংলাদেশের বাজারে চাহিদা সবচেয়ে বেশি, আর Upwork-এ একই সমস্যা নিয়ে বিদেশি ক্লায়েন্টও আছে।

## আসল ক্লায়েন্ট পোস্ট (Upwork)

| ফিল্ড | তথ্য |
| --- | --- |
| **Job title** | AI Order Verification & Courier Fraud Detection for WooCommerce Store |
| **Category** | Web, Mobile & Software Dev → AI Apps & Integration |
| **Budget** | $800 fixed-price (≈ ৳80,000) |
| **Timeline** | 4–5 weeks |
| **Client** | Tanvir H. — Dhaka, Bangladesh — Clothing brand · 4.8★ (23 reviews) · $12k spent |
| **Proposals** | 12 · Interviewing: 2 |

### Project description

We run a clothing store on WordPress/WooCommerce in Dhaka, Bangladesh. We receive around **300 orders per day**, and nearly **30% of them are fake, cancelled at delivery, or returned**. Right now our team manually checks every suspicious order, which takes 2–3 people all day.

We need an AI-assisted order verification system that:

- Receives each new WooCommerce order in real time (webhook) and reads customer phone, address, order value and product category.
- Checks the phone number against delivery/return history from our courier partners (**Steadfast** and **Pathao**). We can share CSV exports and API docs — start with the exports, then move to the API.
- Produces a **0–100 risk score with clear reasons** (e.g. "3 of last 5 parcels returned", "high-value order from a new number", "incomplete address").
- For high-risk orders, pauses dispatch and automatically sends a **WhatsApp message** asking the customer for an advance delivery charge before we ship. Messages must support **Bangla + English/Banglish** templates.
- Shows everything on a simple **admin dashboard**: order list, risk score, reasons, WhatsApp status, approve/hold actions and a daily summary.

**Must-haves:**

- Must not slow down checkout — webhook processing should be async and retry-safe.
- WooCommerce webhook + REST API experience.
- WhatsApp Business API / Cloud API integration (template messages).
- Clean, documented code. We will host on our own VPS.

**Nice to have:** CrewAI / LangChain or a similar agent workflow, React dashboard.

**Deliverables & milestones:**

| # | Deliverable | Payment |
| --- | --- | --- |
| ১ | Requirements + data audit of last 30 days of orders/returns | 20% |
| ২ | Risk engine + courier import/API integration | 30% |
| ৩ | WhatsApp flow + admin dashboard | 30% |
| ৪ | UAT, VPS deployment, docs + handover | 20% |

We can provide test data and staging access after a short call. Please share 1–2 similar projects you have built.

## পোস্টের ভেতরের লুকানো চাহিদা

| ক্লায়েন্ট যা লিখেছে | আসলে যা দরকার |
| --- | --- |
| "must not slow down checkout" | Webhook আলাদা করে queue-তে (Celery), signature verify, idempotent |
| "start with exports, then API" | Courier adapter — CSV আর API দুটোই একই ইন্টারফেসে |
| "risk score with clear reasons" | Rule + LLM ব্যাখ্যা — শুধু স্কোর নয়, কারণ দেখাতে হবে |
| "WhatsApp templates, Bangla + Banglish" | Template ম্যানেজমেন্ট, শুধু টেক্সট নয় |
| "we host on our own VPS" | ডিপ্লয়মেন্ট ডকুমেন্ট + `.env`-এ গোপন কী |
| "advance delivery charge" | Hold → WhatsApp → কাস্টমার রাজি হলে release, নাহলে cancel |

## এই প্রজেক্টে যা বানাবো

```text
WooCommerce (নতুন অর্ডার)
   ↓ webhook
Django API (verify + queue)
   ↓
CrewAI Crew
   ├─ Order Intake Agent   → ডেটা পরিষ্কার, ডুপ্লিকেট ফোন
   ├─ Risk Analyst Agent   → কুরিয়ার হিস্ট্রি + নিয়ম + ব্যাখ্যা
   ├─ Customer Comms Agent → Bangla/Banglish WhatsApp
   └─ Ops Reporter Agent   → দৈনিক সামারি
   ↓
React Dashboard + PostgreSQL
```

বিস্তারিত এজেন্ট ডিজাইন, রিস্ক রুল আর মাইলস্টোন: **[System Design](/docs/project-based/project-1/solution)**।

| যা শিখবে | কোথায় কাজে লাগবে |
| --- | --- |
| WooCommerce webhook + Django API | যেকোনো e-commerce ইন্টিগ্রেশন |
| CrewAI multi-agent workflow | #২, #৩, #১৫-এর মতো প্রজেক্ট |
| WhatsApp Business API | HR (#৮), সাপোর্ট (#১৩) |
| Risk scoring + dashboard | SaaS প্রোডাক্ট হিসেবে বিক্রি |

➡️ পরের পেজ: [System Design](/docs/project-based/project-1/solution) — কে কী করবে, স্কোর কীভাবে হবে।
