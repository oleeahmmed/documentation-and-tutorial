---
title: কমান্ড লাইন (CLI)
description: সার্ভার রিস্টার্টের সাথেই এক কমান্ডে মডিউল ইনস্টল বা আপডেট।
icon: Terminal
---

**গল্প:** রফিকের জন্য কম-স্টক রিপোর্ট মডিউলটা সার্ভারে রাখা হলো। করিম ভাই চান, সার্ভিস রিস্টার্ট করার সময়েই এক কমান্ডে ইনস্টল হয়ে যাক — ব্রাউজারে ক্লিক না করে।

## কমান্ড

```bash
./odoo-bin -c /path/to/odoo.conf -d your_database_name -i module_technical_name --stop-after-init
```

- `your_database_name` → তোমার ডাটাবেসের নাম
- `module_technical_name` → মডিউল ফোল্ডারের আসল নাম (technical name)
- `--stop-after-init` → কাজ শেষে Odoo নিজে বন্ধ হয়ে যাবে

এরপর স্বাভাবিক নিয়মে Odoo সার্ভিস রিস্টার্ট করো।

## আমাদের সেটআপ অনুযায়ী

`my-odoo` ফোল্ডার আর venv ব্যবহার করলে:

```bash
cd ~/my-odoo
source venv/bin/activate
sudo systemctl stop my-odoo     # সার্ভিস চললে আগে থামাও
python3 odoo/odoo-bin -c odoo.conf -d your_database_name -i module_technical_name --stop-after-init
sudo systemctl start my-odoo
```

## ফ্ল্যাগগুলো

| ফ্ল্যাগ | কাজ |
| --- | --- |
| `-c` | `odoo.conf`-এর পাথ |
| `-d` | কোন ডাটাবেসে কাজ হবে |
| `-i` | ইনস্টল করবে (একাধিক হলে কমা দিয়ে) |
| `-u` | আপডেট করবে (কোড বদলালে) |
| `--stop-after-init` | কাজ শেষে নিজে বন্ধ |

## হাতে-কলমে

1. নতুন মডিউল রাখো `custom_addons/`-এ ([আগের পেজ](/odoo/development/custom-addon))
2. সার্ভিস বন্ধ করো
3. উপরের কমান্ডে `module_technical_name` বদলে চালাও
4. লগে `module loaded` / `modules loaded` দেখো
5. সার্ভিস চালু করে Apps-এ দেখো — ইনস্টলড

## টিপস

| ভুল | ঠিক |
| --- | --- |
| সার্ভিস চলা অবস্থায় CLI চালানো | আগে থামাও (`systemctl stop`) |
| ভুল ডাটাবেস নাম | `-d` ঠিক করে দাও |
| আপডেট করতে `-i` | কোড বদলালে `-u module_name` |
| ভুল বানান | technical name = ফোল্ডারের নাম, `__manifest__.py`-তে যা লেখা |

➡️ শেষ ধাপ: [ভার্সন ও নিরাপত্তা চেক](/odoo/development/version-check)
