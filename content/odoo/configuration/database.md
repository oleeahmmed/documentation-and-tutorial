---
title: Database
description: ডাটাবেস তৈরি, Master Password আর Database Manager — একদম সহজ ভাষায়।
icon: Database
---

## কোথায় পাবে

Odoo চালু করার পর ব্রাউজারে:

```text
http://your-server-ip:8069/web/database/manager
```

এই পেজে সব ডাটাবেসের তালিকা আর তৈরি/ব্যাকআপ/রিস্টোরের অপশন থাকে।

## Master Password

Database Manager-এ ঢুকতে যে পাসওয়ার্ড চায়, সেটাই `odoo.conf`-এর `admin_passwd`:

```ini
admin_passwd = change_this_admin_master_password
```

এটা শুধু ডাটাবেস বানানো/মুছার জন্য — Odoo-তে লগইনের পাসওয়ার্ড না। শক্ত পাসওয়ার্ড দাও।

## নতুন ডাটাবেস বানানো

1. **Create Database** চাপো
2. **Database Name** — যেমন `odoo_db2`
3. **Email** আর **Password** — নতুন অ্যাডমিন অ্যাকাউন্ট
4. **Demo data** — শেখার সময় টিক দাও, আসল কাজে খালি রাখো
5. **Create database** চাপো — মডিউল লোড হতে কয়েক মিনিট লাগবে

## ব্যাকআপ নেওয়া

1. তালিকা থেকে ডাটাবেসের পাশে **Backup** চাপো
2. **Zip** ফরম্যাট বাছো (ফাইল/ছবিসহ পুরো ব্যাকআপ)
3. ডাউনলোড হওয়া ফাইলটা নিরাপদ জায়গায় রাখো

## রিস্টোর বা কপি করা

- **Restore Database** — ব্যাকআপ zip আপলোড করে ফিরিয়ে আনো
- **Duplicate** — একই ডাটাবেসের কপি; টেস্ট করার সময় আসল ডেটা নষ্ট না করার জন্য দারুণ

## টিপস

| কাজ | খেয়াল রাখো |
| --- | --- |
| Public সার্ভার | Master password শক্ত না হলে যে কেউ ডাটাবেস মুছে দিতে পারে |
| ম্যানেজার বন্ধ রাখতে | `odoo.conf`-এ `list_db = False` দিলে ডাটাবেস তালিকা/ম্যানেজার দেখা যাবে না |
| ব্যাকআপ | নিয়মিত zip ব্যাকআপ নাও — ডেটাবেস আর ছবি দুটোই এতে থাকে |

➡️ পরের টপিক: [Company](/odoo/configuration/company)
