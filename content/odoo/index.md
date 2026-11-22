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
| ১ | RAM/ডিস্ক/CPU চেক, দরকারে swap | [সার্ভার চেক](/odoo/server-check) |
| ২ | Python, PostgreSQL, wkhtmltopdf, Node.js ইনস্টল | [সিস্টেম সেটআপ](/odoo/system-setup) |
| ৩ | PostgreSQL ইউজার বানানো | [PostgreSQL ইউজার](/odoo/postgres-setup) |
| ৪ | git config আর Odoo সোর্স clone | [সোর্স কোড আনা](/odoo/source-clone) |
| ৫ | venv বানিয়ে requirements ইনস্টল | [venv ও ডিপেন্ডেন্সি](/odoo/venv-setup) |
| ৬ | ডাটাবেস আর `odoo.conf` | [ডাটাবেস ও কনফিগ](/odoo/config-database) |
| ৭ | Odoo চালু করা | [Odoo চালানো](/odoo/run-odoo) |
| ৮ | ফায়ারওয়াল আর systemd সার্ভিস | [ফায়ারওয়াল ও systemd](/odoo/firewall-systemd) |
| ৯ | পুরো প্রক্রিয়া এক নজরে | [সারসংক্ষেপ](/odoo/summary) |

> **টিপস:** `master` ব্রাঞ্চ মানে Odoo-র একদম নতুন ডেভেলপমেন্ট ভার্সন — শেখার জন্য ঠিক আছে, কিন্তু প্রোডাকশনে `18.0`-এর মতো স্ট্যাবল ব্রাঞ্চ ব্যবহার করা ভালো (ধাপ ৪-এ দেখানো আছে)।
