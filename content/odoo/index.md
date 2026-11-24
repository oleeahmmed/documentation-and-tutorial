---
title: Odoo Tutorial
description: শূন্য থেকে Ubuntu সার্ভারে Odoo — venv, odoo.conf, PostgreSQL আর systemd পর্যন্ত ধাপে ধাপে।
icon: Blocks
---

Odoo হলো একটা ওপেন সোর্স ERP সিস্টেম — বিক্রি, স্টক, হিসাব, CRM, HR সব একসাথে এক অ্যাপে। এই টিউটোরিয়ালে একদম শূন্য থেকে Ubuntu সার্ভারে Odoo ইনস্টল করে `my-odoo` ফোল্ডারে চালানো পর্যন্ত দেখানো হয়েছে।

**শেষে তোমার ফোল্ডারটা এরকম হবে:**

```text
my-odoo/
├── venv/          ← Python virtual environment
├── odoo.conf      ← কনফিগ ফাইল
└── odoo/          ← Odoo সোর্স কোড
```

## শুরু করার আগে

- Ubuntu 22.04 LTS বা তার উপরে (24.04 হলে ভালো) — সার্ভার বা VM
- `sudo` অ্যাক্সেস আছে এমন একটা ইউজার
- টার্মিনালে বেসিক কাজের অভিজ্ঞতা — না থাকলে আগে [Python Basic](/python-basic) দেখে নাও

## ধাপগুলো

| ধাপ | কী করবে | পেজ |
| --- | --- | --- |
| ১ | RAM/ডিস্ক/CPU চেক, দরকারে swap | [সার্ভার চেক](/odoo/installation/server-check) |
| ২ | Python, PostgreSQL, wkhtmltopdf, Node.js ইনস্টল | [সিস্টেম সেটআপ](/odoo/installation/system-setup) |
| ৩ | PostgreSQL ইউজার বানানো | [PostgreSQL ইউজার](/odoo/installation/postgres-setup) |
| ৪ | git config আর Odoo সোর্স clone | [সোর্স কোড আনা](/odoo/installation/source-clone) |
| ৫ | venv বানিয়ে requirements ইনস্টল | [venv ও ডিপেন্ডেন্সি](/odoo/installation/venv-setup) |
| ৬ | ডাটাবেস আর `odoo.conf` | [ডাটাবেস ও কনফিগ](/odoo/installation/config-database) |
| ৭ | Odoo চালু করা | [Odoo চালানো](/odoo/installation/run-odoo) |
| ৮ | ফায়ারওয়াল আর systemd সার্ভিস | [ফায়ারওয়াল ও systemd](/odoo/installation/firewall-systemd) |
| ৯ | পুরো প্রক্রিয়া এক নজরে | [সারসংক্ষেপ](/odoo/summary) |

## Basic Configuration (Odoo চালু হওয়ার পর)

সার্ভারে Odoo চালু হয়ে গেলে ব্রাউজার থেকে এই সেটিংসগুলো একবার ঠিক করে নাও — প্রতিটা টপিক আলাদা সহজ পেজে:

| টপিক | কী শিখবে |
| --- | --- |
| [Database](/odoo/configuration/database) | ডাটাবেস তৈরি, Master Password, Backup/Restore |
| [Company](/odoo/configuration/company) | নাম, ঠিকানা, লোগো, Tax ID |
| [General Settings](/odoo/general-settings) | ডিফল্ট বনাম অ্যাপ-নির্ভর সেটিংস — গার্মেন্টসের গল্পে ধাপে ধাপে |
| [Users & Access Rights](/odoo/users-access) | অ্যাকাউন্ট, ইউজার টাইপ, গ্রুপ, অ্যাক্সেস ও রেকর্ড রুল |
| [Languages](/odoo/configuration/languages) | বাংলা/ইংরেজি চালু, ইউজারের ভাষা |
| [Localization](/odoo/configuration/localization) | দেশ, Accounting Localization, Fiscal |
| [Currency](/odoo/configuration/currency) | BDT/USD, এক্সচেঞ্জ রেট, মাল্টি-কারেন্সি |
| [Date & Time](/odoo/configuration/date-time) | টাইমজোন, তারিখ ও ভাষার ফরম্যাট |
| [Contacts](/odoo/configuration/contacts) | কোম্পানি ও ব্যক্তির কন্টাক্ট |
| [Apps](/odoo/configuration/apps) | ইনস্টল, আনইনস্টল, আপডেট |
| [Developer Mode](/odoo/configuration/developer-mode) | Technical Menu আর ডেভেলপার টুলস |

## Invoice Module (হাতে-কলমে ইনভয়েসিং)

খালি Odoo থেকে করিম ভাইয়ের পুরো হিসাব — কাস্টমার ইনভয়েস, ক্রেডিট নোট, পেমেন্ট, ভেন্ডর বিল আর রিফান্ড। প্রতিটা ধাপ আলাদা পেজে:

| ধাপ | পেজ | কী শিখবে |
| --- | --- | --- |
| ১ | [কোম্পানি সেটআপ](/odoo/invoice-module/company-setup) | নতুন ডাটাবেস, কোম্পানি, BDT, টাইমজোন |
| ২ | [Invoicing অ্যাপ ইনস্টল](/odoo/invoice-module/app-install) | Invoicing বনাম Accounting |
| ৩ | [Configuration](/odoo/invoice-module/configuration) | ভ্যাট, Journal, USD, Fiscal Position, Terms |
| ৪ | [কাস্টমার ও পণ্য](/odoo/invoice-module/customers) | অনিকা ফ্যাশন হাউজ, উলের ওভারকোট |
| ৫ | [ইনভয়েস তৈরি](/odoo/invoice-module/invoices) | ১২,৫০০ + ভ্যাট = ১৪,৩৭৫ |
| ৬ | [Credit Note](/odoo/invoice-module/credit-notes) | পণ্য ফেরত, ৮০৫ টাকা সমন্বয় |
| ৭ | [কাস্টমার পেমেন্ট](/odoo/invoice-module/customer-payments) | Register Payment, Paid স্ট্যাটাস |
| ৮ | [ভেন্ডর ও পণ্য](/odoo/invoice-module/vendors) | ঢাকা উল হাউস, কাঁচা উল |
| ৯ | [Vendor Bill](/odoo/invoice-module/vendor-bills) | ৬৯,০০০ টাকার বিল |
| ১০ | [ভেন্ডর রিফান্ড](/odoo/invoice-module/vendor-refunds) | ৬,৯০০ টাকা ক্রেডিট |
| ১১ | [ভেন্ডর পেমেন্ট](/odoo/invoice-module/vendor-payments) | ৬২,১০০ টাকা পরিশোধ |
| ১২ | [সারসংক্ষেপ](/odoo/invoice-module/summary) | ড্যাশবোর্ড ও পুরো ম্যাপ |

সেকশনের মূল পাতা: [Invoice Module](/odoo/invoice-module)।

## Development (অ্যাডঅন ইনস্টল)

ডিফল্ট Odoo-তে নেই এমন মডিউল দরকার হলে — UI, `custom_addons` ফোল্ডার বা CLI — তিন পদ্ধতির গাইড:

| পদ্ধতি | কখন | পেজ |
| --- | --- | --- |
| UI / Apps মেনু | Odoo-র নিজস্ব অ্যাপ | [UI থেকে ইনস্টল](/odoo/development/ui-install) |
| custom_addons ফোল্ডার | Apps Store/GitHub থেকে ZIP | [custom_addons](/odoo/development/custom-addon) |
| CLI / টার্মিনাল | ডেভেলপার, স্ক্রিপ্ট, রিস্টার্টসহ | [কমান্ড লাইন](/odoo/development/cli-install) |

সেকশনের মূল পাতা: [Development](/odoo/development) — ভার্সন-সামঞ্জস্য আর ব্যাকআপ চেকলিস্টসহ।

> **টিপস:** `master` ব্রাঞ্চ মানে Odoo-র একদম নতুন ডেভেলপমেন্ট ভার্সন — শেখার জন্য ঠিক আছে, কিন্তু প্রোডাকশনে `18.0`-এর মতো স্ট্যাবল ব্রাঞ্চ ব্যবহার করা ভালো (ধাপ ৪-এ দেখানো আছে)।
