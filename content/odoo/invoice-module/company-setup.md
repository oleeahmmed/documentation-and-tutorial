---
title: কোম্পানি সেটআপ ও প্রথম লগইন
description: পর্ব ১ — নতুন ডাটাবেস rupashi_fashion, কোম্পানির তথ্য, BDT কারেন্সি আর Asia/Dhaka টাইমজোন।
icon: Building2
---

## গল্প

Odoo ইনস্টল হয়ে গেছে, কিন্তু ভেতরে ঢুকলে শুধু ডাটাবেস-ম্যানেজার। করিম ভাইয়ের জন্য একটা পরিষ্কার, খালি ডাটাবেস বানাতে হবে — যেখানে কোনো ডেমো ডেটা নেই, শুধু রূপসী ফ্যাশনের নিজস্ব তথ্য থাকবে।

## ১.১ — প্রথম ডাটাবেস তৈরি

ব্রাউজারে `http://your-server:8069` খুললে Odoo-র ডাটাবেস-ম্যানেজার পেজ আসবে।

1. **Master Password** বসাও — `odoo.conf`-এর `admin_passwd`-এ যেটা দিয়েছিলে
2. **Database Name**: `rupashi_fashion`
3. **Email**: `korim@rupashifashion.com`
4. **Password**: তোমার লগইন পাসওয়ার্ড (নিরাপদ একটা দাও)
5. **Language**: English (পরে বাংলাও চালু করা যাবে)
6. **Country**: Bangladesh
7. **Demo data** চেকবক্স — **আনচেক রাখো**
8. **Create database** ক্লিক করো

Odoo কিছুক্ষণ সময় নেবে, তারপর সরাসরি একটা খালি ড্যাশবোর্ডে নিয়ে যাবে।

> **ডেমো ডেটা কেন বন্ধ?** ডেমো ডেটা থাকলে ভুয়া কাস্টমার, পণ্য আর ইনভয়েস ঢুকে যায় — আসল হিসাবের সাথে মিশে যায়। আমরা একদম পরিষ্কার সিস্টেমে কাজ করব।

> **পেজ না এলে:** কখনো `http://your-server:8069/web/database/manager` সরাসরি খুলে দেখো। না হলেও `odoo.conf`-এ `list_db = True` আছে কিনা দেখো, তারপর সার্ভিস রিস্টার্ট করো।

## ১.২ — কোম্পানির তথ্য পূরণ

1. উপরের-ডান কোণে **Settings (⚙️)** → **General Settings**
2. **Companies** সেকশনে কোম্পানির নামে ক্লিক করো (অথবা Settings → Users & Companies → Companies)
3. ফর্মে পূরণ করো:

| ফিল্ড | মান |
| --- | --- |
| Company Name | রূপসী ফ্যাশন |
| Address | নারায়ণগঞ্জ, ঢাকা, বাংলাদেশ (পুরো ঠিকানা) |
| Tax ID | BIN/TIN নম্বর (থাকলে) |
| Phone / Email | কোম্পানির যোগাযোগ তথ্য |
| Logo | করিম ভাইয়ের ব্র্যান্ড-লোগো |

4. **Save** ক্লিক করো

এই লোগো আর ঠিকানাই পরে প্রতিটা ইনভয়েসের হেডারে ছাপা হবে।

## ১.৩ — Currency (মুদ্রা): BDT

করিম ভাই চান সব হিসাব **টাকায় (BDT)**, ডলারে না।

1. Settings → **General Settings** → Currencies সেকশন খোঁজো (Invoicing/Accounting অ্যাপের পর সহজে দেখা যায়)
2. অথবা Developer Mode চালু থাকলে Settings → **Technical → Currencies**
3. **BDT (Bangladeshi Taka)** খুঁজে **Active** করো
4. Settings → Companies → কোম্পানি ফর্মে **Currency** ফিল্ডে **BDT** বসিয়ে Save

> Odoo-তে অনেক সময় BDT আগে থেকেই active থাকে। না থাকলে উপরের ধাপে চালু করতেই হবে, নইলে ইনভয়েসে অন্য মুদ্রা বসে যাবে।

## ১.৪ — Timezone ও Language

1. উপরের ডান কোণে প্রোফাইল আইকন → **My Profile**
2. **Preferences** ট্যাবে:
   - **Language**: English (বাংলা চাইলে পরে [ভাষা সেটিংস](/odoo/general-settings/languages-translations))
   - **Timezone**: Asia/Dhaka
3. **Save**

টাইমজোন ঠিক না থাকলে ইনভয়েসের তারিখ, পেমেন্টের সময় আর রিপোর্টের দিন একদিন সরে যেতে পারে — তাই এটা বাদ দিও না।

## বাস্তবে কী ঘটে

- কোম্পানির নাম, ঠিকানা আর লোগো স্বয়ংক্রিয়ভাবে ইনভয়েস, বিল আর PDF-এর হেডারে বসে যায়
- Currency BDT হলে সব নতুন ডকুমেন্টে ৳ চিহ্নে হিসাব হয়; পরে USD-ও চালু করা যাবে (মাল্টি-কারেন্সি)
- টাইমজোন Asia/Dhaka হলে "আজকের তারিখ" ঢাকার সময় অনুযায়ী বসে
- ডেমো ডেটা বন্ধ রাখায় Customers, Products, Invoices — সব তালিকা খালি থাকবে; এটাই স্বাভাবিক

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Create Database পেজ আসছে না | `/web/database/manager` খুলো; `list_db = True` কিনা দেখো |
| Master Password ভুল | `odoo.conf`-এর `admin_passwd` দেখো, বদলালে সার্ভিস রিস্টার্ট |
| Company ফর্ম সেভ হচ্ছে না | ফোন/ইমেইল ফরম্যাট, অথবা বাধ্যতামূলক ফিল্ড খালি কিনা দেখো |
| BDT তালিকায় নেই | Developer Mode চালু করে Currencies থেকে খোঁজো |
| তারিখ একদিন সরে যাচ্ছে | My Profile → Preferences → Timezone = Asia/Dhaka |

পরের ধাপে [Invoicing অ্যাপ ইনস্টল](/odoo/invoice-module/app-install) করব।
