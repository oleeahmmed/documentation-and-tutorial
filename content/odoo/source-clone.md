---
title: সোর্স কোড আনা
description: git config, my-odoo ফোল্ডার, আর Odoo সোর্সের single-branch clone।
icon: GitBranch
---

## ধাপ ৪: Git কনফিগার করা

```bash
git config --global user.name "তোমার নাম"
git config --global user.email "তোমার@ইমেইল.com"

# কনফিগার ঠিক আছে কিনা যাচাই
git config --global user.name
git config --global user.email
```

## ধাপ ৫: `my-odoo` ফোল্ডার বানানো

```bash
mkdir ~/my-odoo
cd ~/my-odoo
```

## ৫.১ — Odoo সোর্স কোড clone করা

```bash
git clone --single-branch --branch master --depth 1 https://github.com/odoo/odoo.git

# ক্লোন হওয়ার পর কাঠামো দেখো
ls
# আউটপুট: odoo/
```

**`--single-branch` আর `--depth 1` কেন:** শুধু একটা ব্রাঞ্চ, সেটারও সর্বশেষ কমিট আনে — পুরো ইতিহাস (কয়েকশো মেগাবাইট) নামায় না, তাই ডাউনলোড অনেক দ্রুত।

### স্ট্যাবল ভার্সন চাইলে

`master` ব্রাঞ্চ মানে Odoo-র ডেভেলপমেন্ট ভার্সন — সবচেয়ে নতুন ফিচার, কিন্তু অস্থিতিশীল হতে পারে। প্রোডাকশনের জন্য নির্দিষ্ট স্ট্যাবল ব্রাঞ্চ ব্যবহার করা ভালো:

```bash
# স্ট্যাবল ভার্সন চাইলে (রেকমেন্ড করা হয়, master-এর বদলে):
git clone --single-branch --branch 18.0 --depth 1 https://github.com/odoo/odoo.git
```

এখন `my-odoo/` ফোল্ডারে আছে:

```text
my-odoo/
└── odoo/           ← ক্লোন করা সোর্স কোড
    ├── odoo-bin
    ├── requirements.txt
    ├── addons/
    └── odoo/
```

| ফাইল/ফোল্ডার | কাজ |
| --- | --- |
| `odoo-bin` | Odoo চালানোর মূল এন্ট্রি স্ক্রিপ্ট |
| `requirements.txt` | Python প্যাকেজের তালিকা (পরের ধাপে ইনস্টল হবে) |
| `addons/` | বিল্ট-ইন মডিউল (বিক্রি, স্টক, হিসাব...) |
| `odoo/` | মূল সোর্স কোড |

➡️ পরের ধাপ: [venv ও ডিপেন্ডেন্সি](/odoo/venv-setup) — সোর্সের জন্য আলাদা Python পরিবেশ বানাই।
