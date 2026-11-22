---
title: সারসংক্ষেপ
description: পুরো ইনস্টলেশন এক নজরে — কমান্ড চিটশিট আর ফাইনাল কাঠামো।
icon: BookOpen
---

## পুরো প্রক্রিয়া এক নজরে

```text
ধাপ ১: RAM/ডিস্ক/CPU চেক (free -h, df -h, nproc)
    ↓
ধাপ ২: git, python3, build-tools, PostgreSQL, wkhtmltopdf, Node.js ইনস্টল
    ↓
ধাপ ৩: PostgreSQL ইউজার বানানো
    ↓
ধাপ ৪: git config (user.name, user.email)
    ↓
ধাপ ৫: my-odoo/odoo/  ← GitHub থেকে single-branch clone
    ↓
ধাপ ৬: my-odoo/venv/  ← virtualenv বানিয়ে requirements.txt ইনস্টল
    ↓
ধাপ ৭: createdb দিয়ে ডাটাবেস বানানো
    ↓
ধাপ ৮: my-odoo/odoo.conf  ← কনফিগ ফাইল লেখা
    ↓
ধাপ ৯: python3 odoo/odoo-bin -c odoo.conf দিয়ে চালানো
    ↓
ধাপ ১০-১১: ফায়ারওয়াল ও systemd সার্ভিস (স্থায়ীভাবে চালু রাখতে)
```

## কমান্ড চিটশিট

| ধাপ | মূল কমান্ড |
| --- | --- |
| রিসোর্স চেক | `free -h` · `df -h` · `nproc` · `lsb_release -a` |
| সিস্টেম প্যাকেজ | `sudo apt update && sudo apt upgrade -y` + প্যাকেজ লিস্ট |
| PostgreSQL ইউজার | `sudo -u postgres createuser -s $USER` |
| সোর্স | `git clone --single-branch --branch 18.0 --depth 1 https://github.com/odoo/odoo.git` |
| venv | `python3 -m venv venv && source venv/bin/activate` |
| ডিপেন্ডেন্সি | `pip install -r odoo/requirements.txt` |
| ডাটাবেস | `createdb odoo_db` |
| চালানো | `python3 odoo/odoo-bin -c odoo.conf` |
| systemd | `sudo systemctl enable --now my-odoo` |

## ফাইনাল কাঠামো

```text
my-odoo/
├── venv/
├── odoo.conf
└── odoo/
```

ব্রাউজারে `http://your-server-ip:8069` খুললেই Odoo ড্যাশবোর্ড।

## ভালো অভ্যাস

- `master`-এর বদলে স্ট্যাবল ব্রাঞ্চ (`18.0`) দিয়ে প্রোডাকশন চালাও
- `odoo.conf`-এর `admin_passwd` শক্ত রাখো, ফাইল `chmod 600`
- `odoo.conf`/`.env`-এ পাসওয়ার্ড থাকলে গিটে কমিট করো না
- আপডেটের পর `pip install -r requirements.txt` চালিয়ে `systemctl restart my-odoo` দাও
- ব্যাকআপ: ডাটাবেস (`pg_dump odoo_db`) আর `~/.local/share/Odoo` ফোল্ডার নিয়মিত নাও

> ইনস্টলের সময় কোনো error পেলে পুরো error message নিয়ে [Django টিউটোরিয়ালের](/django) মতো ধাপে ধাপে যাচাই করো, বা [Deploy Master Prompt](/prompt-master/deploy-master-prompt)-এর DIAGNOSE অংশ ব্যবহার করো।
