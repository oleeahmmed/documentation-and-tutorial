---
title: venv ও ডিপেন্ডেন্সি
description: my-odoo/venv বানিয়ে Odoo-র Python requirements ইনস্টল।
icon: Terminal
---

## ধাপ ৬: Virtual Environment বানানো

```bash
cd ~/my-odoo
python3 -m venv venv
source venv/bin/activate
```

এখন টার্মিনালে `(venv)` দেখবে — মানে virtual environment সক্রিয়। Odoo-র প্যাকেজগুলো সিস্টেম Python-এ না ঢুকে এই আলাদা ফোল্ডারে থাকবে।

## ৬.১ — Python ডিপেন্ডেন্সি ইনস্টল

```bash
pip install --upgrade pip wheel setuptools
pip install -r odoo/requirements.txt
```

**এটা কিছুটা সময় নেবে (কয়েক মিনিট)** — অনেকগুলো প্যাকেজ কম্পাইল হয়। শেষে এরকম দেখাবে:

```text
Successfully installed ... (অনেক প্যাকেজের নাম)
```

### কম্পাইল-এরর হলে

ইনস্টল করার সময় কোনো প্যাকেজ এরর দিলে, সাধারণত কোনো সিস্টেম-লাইব্রেরি মিসিং। error মেসেজে লাইব্রেরির নাম দেখে সেটা ইনস্টল করে আবার চেষ্টা করো। যেমন:

| এররে যা দেখবে | সমাধান |
| --- | --- |
| `fatal error: libpq-fe.h: No such file` | `sudo apt install libpq-dev` |
| `freetype` / `jpeg` সংক্রান্ত এরর | `sudo apt install libjpeg-dev libfreetype6-dev` |
| `xml2` / `xslt` সংক্রান্ত এরর | `sudo apt install libxml2-dev libxslt1-dev` |
| `openssl` সংক্রান্ত এরর | `sudo apt install libssl-dev` |

এরপর আবার `pip install -r odoo/requirements.txt` চালাও।

এখন `my-odoo/` ফোল্ডারে আছে:

```text
my-odoo/
├── venv/           ← Python virtual environment
└── odoo/           ← Odoo সোর্স কোড
```

➡️ পরের ধাপ: [ডাটাবেস ও কনফিগ](/odoo/config-database) — ডাটাবেস বানিয়ে `odoo.conf` লিখি।
