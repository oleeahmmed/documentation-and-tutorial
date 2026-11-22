---
title: সিস্টেম সেটআপ
description: Python, বিল্ড-টুলস, PostgreSQL 16+, wkhtmltopdf আর Node.js ইনস্টল।
icon: Package
---

## ধাপ ২: সিস্টেম আপডেট

```bash
sudo apt update && sudo apt upgrade -y
```

## ২.১ — Git, Python, বিল্ড-টুলস

**বর্তমান Odoo (master/সর্বশেষ ভার্সন) চালাতে Python 3.12+ লাগে।** Ubuntu 24.04-এ ডিফল্টভাবেই Python 3.12 থাকে। Ubuntu 22.04 ব্যবহার করলে আলাদা করে নিশ্চিত হতে হবে।

```bash
python3 --version   # চেক করো, 3.12+ হওয়া উচিত

sudo apt install -y git python3-pip python3-venv python3-dev \
    build-essential libxml2-dev libxslt1-dev zlib1g-dev \
    libsasl2-dev libldap2-dev libssl-dev libffi-dev \
    libjpeg-dev libpq-dev libfreetype6-dev pkg-config
```

এই লাইব্রেরিগুলো কেন লাগে:

| প্যাকেজ | কেন দরকার |
| --- | --- |
| `python3-dev` + `build-essential` | Odoo-র কিছু Python প্যাকেজ কম্পাইল করতে হয় |
| `libxml2-dev`, `libxslt1-dev` | XML/HTML প্রসেসিং (রিপোর্ট) |
| `libsasl2-dev`, `libldap2-dev` | LDAP/অথেনটিকেশন সাপোর্ট |
| `libssl-dev`, `libffi-dev` | SSL আর নেটিভ এক্সটেনশন |
| `libjpeg-dev`, `libfreetype6-dev` | ছবি প্রসেসিং (Pillow) |
| `libpq-dev` | PostgreSQL-এর সাথে Python সংযোগ |
| `zlib1g-dev`, `pkg-config` | কম্পাইলে দরকারি সাধারণ বিল্ড টুল |

## ২.২ — PostgreSQL ইনস্টল

**বর্তমান Odoo-এ PostgreSQL 16+ লাগে।**

```bash
sudo apt install -y postgresql postgresql-client postgresql-contrib

# ভার্সন যাচাই
psql --version
sudo systemctl status postgresql
```

`psql --version`-এ 16 বা তার বেশি দেখলে ঠিক। `systemctl status`-এ `active (running)` থাকা উচিত।

## ২.৩ — wkhtmltopdf ইনস্টল (PDF রিপোর্টের জন্য)

Odoo-র PDF রিপোর্ট (ইনভয়েস, রসিদ) wkhtmltopdf দিয়ে তৈরি হয়, আর এটা pip দিয়ে ইনস্টল হয় না — OS প্যাকেজ হিসেবে লাগে।

```bash
# Ubuntu ভার্সন অনুযায়ী সঠিক .deb বাছো (noble = 24.04, jammy = 22.04)
wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.jammy_amd64.deb
sudo apt install -y ./wkhtmltox_0.12.6-1.jammy_amd64.deb
wkhtmltopdf --version   # যাচাই করো
```

> 24.04 (noble) হলে উপরের লিংকে `jammy`-র জায়গায় `noble` বসিয়ে নামাও। ভুল ভার্সনের deb ইনস্টল করতে গেলে ডিপেন্ডেন্সি এরর দেবে।

## ২.৪ — Node.js (CSS/LESS কম্পাইল করার জন্য)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g rtlcss less less-plugin-clean-css
```

Odoo-র asset pipeline LESS/CSS কম্পাইল করতে Node.js ব্যবহার করে। `rtlcss` আরবি/হিব্রু-র মতো RTL ভাষার জন্য দরকার।

➡️ পরের ধাপ: [PostgreSQL ইউজার](/odoo/postgres-setup) — Odoo ডাটাবেসে ঢোকার একটা ইউজার বানাই।
