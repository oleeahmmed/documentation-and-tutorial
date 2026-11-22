---
title: ডাটাবেস ও কনফিগ
description: createdb দিয়ে odoo_db বানানো আর my-odoo/odoo.conf লেখা।
icon: FileText
---

## ধাপ ৭: ডাটাবেস বানানো

```bash
createdb odoo_db
```

কোনো আউটপুট এলেই কাজ হয়েছে — `createdb` সফল হলে চুপচাপ থাকে। মিলিয়ে দেখতে:

```bash
psql -l | grep odoo_db
```

## ধাপ ৮: `odoo.conf` ফাইল বানানো

```bash
cd ~/my-odoo
nano odoo.conf
```

### কন্টেন্ট

```ini
[options]
; --- ডাটাবেস সংযোগ ---
db_host = localhost
db_port = 5432
db_user = your_linux_username
db_password = False
db_name = odoo_db

; --- অ্যাডন ---
addons_path = /home/your_linux_username/my-odoo/odoo/addons

; --- লগ ---
logfile = /home/your_linux_username/my-odoo/odoo.log
log_level = info

; --- এডমিন পাসওয়ার্ড (নতুন ডাটাবেস বানানোর জন্য master password) ---
admin_passwd = change_this_admin_master_password

; --- সার্ভার ---
http_port = 8069
```

**গুরুত্বপূর্ণ:** `your_linux_username` আর পাথ তোমার আসল ইউজারনেম/পাথ দিয়ে বদলে নাও। পাথ বের করতে:

```bash
pwd   # my-odoo ফোল্ডারে থেকে চালাও, এটাই আসল absolute path দেখাবে
```

### প্রতিটা কী-র কাজ

| কী | মানে |
| --- | --- |
| `db_host`, `db_port` | PostgreSQL কোথায় চলছে |
| `db_user` | ধাপ ৩-এ বানানো PostgreSQL ইউজার |
| `db_password = False` | পাসওয়ার্ড ছাড়া (peer) লগইন — আলাদা ইউজার বানালে এখানে পাসওয়ার্ড দাও |
| `db_name` | ধাপ ৭-এ বানানো ডাটাবেস |
| `addons_path` | Odoo কোথায় মডিউল খুঁজবে — অবশ্যই absolute path |
| `logfile`, `log_level` | লগ কোথায়, কত ডিটেইলে লিখবে |
| `admin_passwd` | ডাটাবেস-ম্যানেজার পেজের master password — শক্ত পাসওয়ার্ড দাও |
| `http_port` | Odoo যে পোর্টে চলবে (ডিফল্ট 8069) |

`db_password = False` মানে Python driver পাসওয়ার্ড পাঠাবে না, PostgreSQL লোকাল কানেকশনে OS ইউজার ধরে নেবে — এটা তখনই কাজ করে যখন `db_user` তোমার লিনাক্স ইউজারনেমের সমান।

> **নিরাপত্তা নোট:** `admin_passwd` আর (যদি দাও) `db_password` — এগুলো গোপন তথ্য। `odoo.conf`-এ পাসওয়ার্ড থাকলে সেটা গিটে কমিট করো না। সার্ভারে ফাইলটা `chmod 600` করে শুধু owner-এর পড়ার অনুমতি রাখো:
> ```bash
> chmod 600 ~/my-odoo/odoo.conf
> ```

এখন `my-odoo/` ফোল্ডারে ঠিক তিনটা জিনিস:

```text
my-odoo/
├── venv/
├── odoo.conf
└── odoo/
```

➡️ পরের ধাপ: [Odoo চালানো](/odoo/run-odoo) — অবশেষে সার্ভার চালু করি।
