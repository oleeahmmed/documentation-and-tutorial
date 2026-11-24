---
title: Invoicing অ্যাপ ইনস্টল
description: পর্ব ২ — Odoo 19-এ Apps থেকে Invoicing ইনস্টল, লোকালাইজেশন, Invoicing বনাম Accounting, আর ইনস্টলের পর কোন মেনু আসে।
icon: Download
---

## গল্প

ডাটাবেস তৈরি, কোম্পানির তথ্যও বসানো। কিন্তু এখনো Odoo-তে ইনভয়েস বানানোর কোনো অ্যাপ নেই — মেনুতে শুধু Settings আর Apps। করিম ভাইয়ের হিসাবের জন্য **Invoicing** অ্যাপটা ইনস্টল করতে হবে।

## হাতে-কলমে

1. মূল ড্যাশবোর্ডে যাও (উপরে বাঁ কোণে Odoo আইকন, অথবা **Apps** মেনু)
2. সার্চ বক্সে **Invoicing** লেখো
3. **Invoicing** অ্যাপে **Install** ক্লিক করো
4. ইনস্টল শেষ হওয়া পর্যন্ত অপেক্ষা করো — কিছুক্ষণ লাগতে পারে

ইনস্টল হলে বাম পাশের অ্যাপ মেনুতে **Invoicing** দেখা যাবে। প্রথমবার ঢুকলে Odoo 19 কোম্পানির দেশ অনুযায়ী **Fiscal Localization** বেছে নিতে বলতে পারে — **Bangladesh** সিলেক্ট করে এগিয়ে যাও।

> **কী ঘটল ভেতরে:** বাংলাদেশ লোকালাইজেশন (Package: `Bangladesh`) ইনস্টল হলে Odoo 19 নিজেই চার্ট অফ অ্যাকাউন্টস, ১৫% সেলস ও পারচেজ ট্যাক্স, ০% ট্যাক্স আর "National/International" ফিসকাল পজিশন বানিয়ে দেয়। পরের পর্বে তাই ট্যাক্স শূন্য থেকে বানাতে হবে না — আগে খুঁজে দেখতে হবে।

## Invoicing নাকি Accounting?

দুটো দেখতে কাছাকাছি, কাজে পার্থক্য আছে:

| | Invoicing | Accounting |
| --- | --- | --- |
| মূল কাজ | ইনভয়েস, বিল, পেমেন্ট | সবকিছু + ব্যাংক রিকনসিলিয়েশন, চার্ট অফ অ্যাকাউন্টস, পূর্ণ রিপোর্ট |
| কাদের জন্য | ছোট ব্যবসা, সহজ হিসাব | পূর্ণ হিসাব বিভাগ |
| ভারী কিনা | হালকা | ভারী, অনেক মেনু |
| অ্যাপ মেনুর নাম | **Invoicing** | **Accounting** |
| আমাদের জন্য | **এটাই যথেষ্ট** | পরে দরকার হলে ইনস্টল |

পূর্ণ ফিচার লাগলে **Accounting** ইনস্টল করো — Invoicing-এর সব কাজ তার ভেতরেই আছে। শুরুতে Invoicing দিয়েই শেখা সহজ।

> Accounting ইনস্টল করলে এই সিরিজের সব "Invoicing → ..." মেনু "Accounting → ..."-এ একই জায়গায় পাবে। অন্য কোনো পার্থক্য নেই।

## ইনস্টলের পর কী কী আসে

| মেনু | কী কাজে |
| --- | --- |
| **Dashboard** | জার্নালভিত্তিক কার্ড — Customer Invoices, Vendor Bills, Bank |
| **Customers** | Invoices, Credit Notes, Payments, Products, Customers |
| **Vendors** | Bills, Refunds, Payments, Products, Vendors |
| **Accounting** | Transactions, Closing (অনুমতি থাকলে) |
| **Reporting** | Invoice Analysis, Partner Reports, ট্যাক্স রিপোর্ট |
| **Configuration** | Settings, Accounting, Invoicing, Online Payments |

শুরুর ড্যাশবোর্ডে সব শূন্য দেখাবে — কারণ ডেমো ডেটা নেই। এটাই কাঙ্ক্ষিত।

## বাস্তবে কী ঘটে

- Invoicing ইনস্টল করলে দরকারি ডিপেন্ডেন্সি (যেমন Contacts) নিজে থেকেই ইনস্টল হয়ে যায়
- কোম্পানির দেশ Bangladesh বলে লোকালাইজেশনের ১৫% ট্যাক্স Active অবস্থায় পাওয়া যেতে পারে; নতুন করে একই নামে ট্যাক্স বানালে ডুপ্লিকেট হবে — তাই আগে তালিকা দেখো
- লোকালাইজেশনের ট্যাক্স/অ্যাকাউন্টশুধু Invoicing অ্যাপের Configuration → Accounting থেকে দেখা যায়
- একবার ইনস্টল করা অ্যাপ পরে **Upgrade** করা যায়, কিন্তু আনইনস্টল করলে ওই অ্যাপের ডেটা মুছে যেতে পারে — সাবধানে
- Accounting ইনস্টলের সময় ব্যাংক রিকনসিলিয়েশন, পূর্ণ রিপোর্ট — এসব বাড়তি মেনু আসে

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Apps-এ Invoicing খুঁজে পাচ্ছি না | Apps → **Update Apps List** (Developer Mode লাগতে পারে) |
| Install বাটন ধূসর | অ্যাডমিন হিসেবে লগইন করেছ কিনা দেখো |
| ইনস্টল শেষ হচ্ছে না | ইন্টারনেট/সার্ভার লোড দেখো; Odoo লগে error আছে কিনা চেক করো |
| Fiscal Localization পপ-আপে Bangladesh নেই | Company-র Country Bangladesh কিনা দেখো; দরকার হলে Settings → Fiscal Localization → Package থেকে Bangladesh বেছে নাও |
| ইনস্টলের পর মেনু নেই | পেজ রিফ্রেশ করো, অ্যাপ মেনু থেকে Invoicing খোলো |
| ভুলে Accounting ইনস্টল করেছি | সমস্যা নেই — Invoicing-এর সব কাজ Accounting-তেও আছে |

পরের ধাপে [Configuration](/odoo/invoice-module/configuration) — লোকালাইজেশনট্যাক্স, Journal আর অন্যান্য নিয়ম মিলিয়ে নেব।
