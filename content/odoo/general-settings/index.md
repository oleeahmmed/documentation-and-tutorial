---
title: General Settings
description: রূপসী ফ্যাশনের গল্পে Odoo Settings — কোনটা ডিফল্ট, কোনটা অ্যাপ ইনস্টলের পর, আর কোন ক্রমে সাজাবে।
icon: Settings
---

**গল্প:** নারায়ণগঞ্জের **রূপসী ফ্যাশন লিমিটেড** — ৩০ জন কর্মীর একটা নিটওয়্যার গার্মেন্টস, ঢাকায় একটা আউটলেট। করিম ভাই মালিক। নাদিয়া বায়ারদের সাথে কোটেশন-ইনভয়েস দেখে, রফিক স্টোরে কাপড়-বাটন-রেডি গুডস সামলায়, সুমন অ্যাকাউন্টসে ভ্যাট আর ব্যাংক/এলসি দেখে।

Odoo ইনস্টল হয়ে গেছে। এখন করিম ভাই চান — সিস্টেমটা কোম্পানির মতো করে সাজানো। সেই সাজানোটাই এই **General Settings** সেকশন। (কর্মীদের অ্যাকাউন্ট আর অনুমতি আলাদা সেকশনে — [Users & Access Rights](/odoo/users-access)।)

## আগে বুঝে নাও: সব সেটিংস সবসময় থাকে না

Odoo-র সব সেটিংস সব ভার্সনে বা শুরু থেকেই দেখা যায় না। দুই ধরনের সেটিংস আছে:

| ধরন | মানে | উদাহরণ |
| --- | --- | --- |
| **ডিফল্ট** | Odoo ইনস্টলের পরই Settings-এ দেখা যায় | Companies, Users, Languages, Translations, Developer Tools |
| **অ্যাপ-নির্ভর** | সংশ্লিষ্ট অ্যাপ ইনস্টল করার পর আসে | ইনভয়েস (Invoicing), ওয়্যারহাউস (Inventory), ভ্যারিয়েন্ট (Sales), পেমেন্ট |

তাই সেটিংস খুঁজে না পেলে আগে দেখো — **অ্যাপটা ইনস্টল আছে তো?** কখনো আবার **Developer Mode** চালু করলেই লুকানো অপশন দেখা যায়।

## কোনটা কোথায় — এক নজরের ম্যাপ

| সেটিংস | কোথায় পাবে | কখন দেখা যায় |
| --- | --- | --- |
| [Users, Types, Groups ও Access Rights](/odoo/users-access) | Settings → Users & Companies | ডিফল্ট |
| [Multi-Company](/odoo/users-access/multi-company) | Settings → Users & Companies → Companies | ডিফল্ট |
| [Record Rules](/odoo/users-access/record-rules) | Settings → Technical → Security | ডিফল্ট (ডেভেলপার মোডে) |
| [Languages ও Translations](/odoo/general-settings/languages-translations) | Settings → Translations | ডিফল্ট |
| [Outgoing / Incoming Mail Server](/odoo/general-settings/email) | Settings → Technical → Mail Servers | ডিফল্ট (ডেভেলপার মোডে) |
| [Document Management](/odoo/general-settings/documents) | Settings → Documents | **Documents** অ্যাপের পর |
| [Customer Invoices](/odoo/general-settings/invoicing-tax) | Settings → Invoicing | **Invoicing/Accounting**-র পর |
| [Sales Tax Configuration](/odoo/general-settings/invoicing-tax) | Settings → Invoicing + Configuration → Taxes | **Invoicing/Sales**-এর পর |
| [Units of Measure](/odoo/general-settings/units-product) | Inventory → Configuration → Units | **Inventory** (বা Sales) ইনস্টলের পর |
| [Product Variants / Attributes](/odoo/general-settings/units-product) | Settings → Sales | **Sales** ইনস্টলের পর |
| [Warehouse Configuration](/odoo/general-settings/warehouse-shipping) | Settings → Inventory → Warehouses | **Inventory**-র পর |
| [Shipping Methods](/odoo/general-settings/warehouse-shipping) | Inventory → Configuration → Shipping Methods | **Inventory**-র পর |
| [Payment Providers](/odoo/general-settings/payments) | Settings → Payment Providers | **Payment/Website**-এর পর |
| [Developer Tools](/odoo/general-settings/developer-tools) | Settings → Developer Tools | ডিফল্ট (ডেভেলপার মোডে) |

> কিছু সেটিংস শুধু **Enterprise** এডিশনে থাকে। না দেখলে আগে নিশ্চিত হও — অ্যাপ ইনস্টল আছে, Developer Mode চালু আছে, আর তুমি ঠিক জায়গায় খুঁজছ।

## রূপসী ফ্যাশনের সেটিংস সাজানোর ক্রম

একটা গার্মেন্টস কোম্পানিতে সেটিংস ঠিক এই ক্রমে করলে পরে ঝামেলা কম হয়:

```text
১. Company তথ্য (নাম, ঠিকানা, লোগো, Tax ID)
    ↓
২. Users বানিয়ে অধিকার ঠিক করা (নাদিয়া = Sales, রফিক = Inventory, সুমন = Accounting)
    ↓
৩. ভাষা (কর্মীদের জন্য বাংলা, বায়ারের ইমেইলের জন্য ইংরেজি)
    ↓
৪. ইমেইল সার্ভার (কোটেশন পাঠানো, নতুন ইউজারকে ইনভাইট)
    ↓
৫. অ্যাপ ইনস্টল: Sales, Inventory, Invoicing, Purchase, Contacts, Documents
    ↓
৬. ইনভয়েস, ডিফল্ট ট্যাক্স (লোকাল ১৫% ভ্যাট, এক্সপোর্ট ০%)
    ↓
৭. Units of Measure আর Product Variants (মিটার, কেজি, ডজন; সাইজ-কালার)
    ↓
৮. Warehouse আর Shipping Methods (ফ্যাক্টরি ↔ আউটলেট, কুরিয়ার)
    ↓
৯. Payment Providers (রিটেইল অনলাইন পেমেন্ট, ব্যাংক ট্রান্সফার)
    ↓
১০. সবার শেষে Developer Tools (অ্যাপ আপডেট, টেকনিক্যাল চেক)
```

## এই সেকশনের পেজগুলো

| পেজ | রূপসী ফ্যাশনে কী কাজে লাগবে |
| --- | --- |
| [Languages ও Translations](/odoo/general-settings/languages-translations) | কর্মীদের বাংলা UI, বায়ারের ইংরেজি ইনভয়েস |
| [Email Configuration](/odoo/general-settings/email) | কোটেশন পাঠানো, উত্তর গ্রহণ |
| [Document Management](/odoo/general-settings/documents) | বায়ারের PO, LC কপি, ইন্সপেকশন রিপোর্ট |
| [Invoices ও Sales Tax](/odoo/general-settings/invoicing-tax) | লোকাল ১৫% ভ্যাট, এক্সপোর্ট ০% |
| [Units ও Product Variants](/odoo/general-settings/units-product) | কাপড় মিটার/কেজি, শার্টের সাইজ-কালার |
| [Warehouse ও Shipping](/odoo/general-settings/warehouse-shipping) | ফ্যাক্টরি স্টোর, আউটলেট, কুরিয়ার |
| [Payment Providers](/odoo/general-settings/payments) | আউটলেটের অনলাইন পেমেন্ট, ব্যাংক ট্রান্সফার |
| [Developer Tools](/odoo/general-settings/developer-tools) | অ্যাপ আপডেট, শিডিউলড কাজ, ডিবাগ |

➡️ শুরু করো: [Languages ও Translations](/odoo/general-settings/languages-translations) — কর্মীদের নিজের ভাষায় Odoo।

> কর্মীদের অ্যাকাউন্ট, গ্রুপ, রেকর্ড রুল আর মাল্টি-কোম্পানি — দেখো আলাদা [Users & Access Rights](/odoo/users-access) সেকশনে।
