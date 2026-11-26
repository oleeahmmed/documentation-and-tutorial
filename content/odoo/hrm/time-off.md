---
title: "Time Off সেটিংস"
description: "ভাগ ১ — সরকারি ছুটি, ছুটির ধরন (Casual, Sick, Annual, Maternity, Unpaid) আর Annual Leave-এর Accrual Plan।"
icon: CalendarDays
---

## গল্প

শ্রম আইন মেনে ছুটির হিসাব রাখা HR-এর সবচেয়ে সংবেদনশীল কাজ। আগে ছুটির ধরন আর সরকারি ছুটির দিনগুলো Odoo-তে বসাতে হবে — তারপর কর্মী আবেদন করলে Odoo নিজেই ব্যালেন্স মিলিয়ে দেখবে।

## (ক) Public Holidays

**Time Off → Configuration → Public Holidays → New** — প্রতিটা ছুটি আলাদা করে, তারিখ সহ:

| ছুটি | তারিখ |
| --- | --- |
| Shaheed Day | ২১ ফেব্রুয়ারি |
| Independence Day | ২৬ মার্চ |
| Pohela Boishakh | ১৪ এপ্রিল |
| May Day | ১ মে |
| Eid-ul-Fitr | সরকারি ঘোষণা অনুযায়ী |
| Eid-ul-Adha | সরকারি ঘোষণা অনুযায়ী |
| Buddha Purnima | সরকারি ঘোষণা অনুযায়ী |
| Durga Puja | সরকারি ঘোষণা অনুযায়ী |
| Victory Day | ১৬ ডিসেম্বর |

> ঈদের তারিখ আগে থেকে নিশ্চিত নয় — সরকারি ঘোষণার পরে বসাও। ভুল তারিখে ছুটি থাকলে ওই দিনের হাজিরা/অনুপস্থিতির হিসাব ভুল দেখাবে।

## (খ) Time Off Types

**Time Off → Configuration → Time Off Types → New**

| Name | Approval | Allocation | নোট |
| --- | --- | --- | --- |
| Casual Leave | Time Off Officer | Set by Time Off Officer | ১০ দিন |
| Sick Leave | Time Off Officer | Set by Time Off Officer | Supporting Document চালু |
| Annual Leave | Time Off Officer | Set by Time Off Officer | Accrual-এ জমবে |
| Maternity Leave | Time Off Officer | Set by Time Off Officer | ১১২ দিন |
| Unpaid Leave | Time Off Officer | No Allocation | বেতন কাটা যাবে |

**Responsible** বা **Approver** ঘরে Karim Sir-কে বসাও।

> **Supporting Document** (Sick Leave-এ): কর্মী মেডিকেল সার্টিফিকেট আপলোড করতে হবে। ছবি তোলা কাগজও চলবে — কিন্তু ছাড়া আবেদন Approval-এ আটকে যাবে।

> **No Allocation** (Unpaid Leave): ব্যালেন্সের হিসাব নেই — যত দিন লাগে নেওয়া যায়, কিন্তু বেতন কাটা যাবে। তাই আলাদা ধরন, Casual-এর সাথে মেশাও না।

## (গ) Accrual Plan (Annual Leave-এর জন্য)

**Time Off → Configuration → Accrual Plans → New**

| ফিল্ড | মান |
| --- | --- |
| Name | `Annual Leave Plan` |
| Level | নির্দিষ্ট সময় পরপর দিন যোগ |
| নিয়ম | ১৮ দিনে ১ দিন (≈ মাসে ১.৬ দিন) |

**Save**।

> Accrual মানে "কাজ করার সাথে সাথে জমছে"। কর্মী এক বছর কাজ করলে ১৮ দিনের সমান জমবে — তাই বছরের শুরুতে হাতে হাতে ১৮ দিন দেওয়ার দরকার নেই, এবং মাঝপথে যোগ দিলেও অনুপাতে জমবে।

> **শ্রম আইন:** বাংলাদেশ শ্রম আইন ২০০৬ অনুযায়ী Casual ১০, Sick ১৪, Annual ১৮ দিনে ১ দিন, উৎসব ১১ দিন, মাতৃত্ব ১৬ সপ্তাহ। চূড়ান্ত করার আগে কমপ্লায়েন্স অফিসারের সাথে মিলিয়ে নাও — কোম্পানির নিজস্ব নীতি ভিন্ন হতে পারে।

## বাস্তবে কী ঘটে

- Public Holiday-তে কেউ ছুটি নিলে সেটা ব্যালেন্স থেকে কাটে না
- Allocation না দিলে কর্মী Casual/Annual আবেদন করতে পারবে না ("No allocation") — [কর্মী Entry](/odoo/hrm/employee-entry) পেজে By Company দিয়ে সবার জন্য একবারে দেবে
- Sick Leave-এ Supporting Document লাগালে Approval-এর আগে ফাইল আপলোড বাধ্যতামূলক হয়
- Unpaid Leave-এর দিন বেতনের হিসাব থেকে কাটতে হবে — Accounts-কে মাসের শেষে জানাও

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Time Off Types মেনু নেই | Time Off অ্যাপ ইনস্টল করো |
| কর্মী আবেদন করতে পারছে না | Allocation আছে কিনা, Time Off Type-এ Allow Employee Requests চালু কিনা দেখো |
| Approver-এর নাম আসছে না | Type-এ Responsible/Approver ঘরে Karim Sir বসাও |
| Accrual জমছে না | Plan-এর Level আর ১৮ দিনে ১ দিনের নিয়ম দেখো; Allocation Type **Accrual** কিনা যাচাই করো |

## চেকলিস্ট

- [ ] সরকারি ছুটির তালিকা (ঈদের তারিখ ঘোষণার পর)
- [ ] ৫টা Time Off Type + Approver Karim
- [ ] Sick Leave-এ Supporting Document
- [ ] `Annual Leave Plan` (১৮ দিনে ১ দিন)

পরের ধাপে [Attendance সেটিংস](/odoo/hrm/attendance) — গেটের Kiosk, Badge/PIN আর Overtime।
