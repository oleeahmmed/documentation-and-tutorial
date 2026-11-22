---
title: Odoo চালানো
description: odoo-bin চালু করা, টার্মিনালের আউটপুট, আর ব্রাউজারে প্রথম সেটআপ।
icon: Rocket
---

## ধাপ ৯: Odoo চালানো

```bash
cd ~/my-odoo
source venv/bin/activate   # যদি আগে থেকে activate করা না থাকে
python3 odoo/odoo-bin -c odoo.conf
```

`-c odoo.conf` বলছে — কনফিগারেশন সব ওই ফাইল থেকে নাও। ফলে প্রতিবার লম্বা কমান্ড লিখতে হচ্ছে না।

## বাস্তবে কী ঘটে (টার্মিনালে)

```text
2026-11-23 10:00:00,000 INFO ? odoo: Odoo version 18.0
2026-11-23 10:00:00,100 INFO ? odoo: addons paths: ['/home/user/my-odoo/odoo/addons', ...]
2026-11-23 10:00:00,200 INFO ? odoo: database: odoo_db@localhost:5432
2026-11-23 10:00:01,000 INFO odoo_db odoo.modules.loading: loading 1 modules...
2026-11-23 10:00:05,000 INFO odoo_db odoo.modules.loading: 1 modules loaded in 4.00s
2026-11-23 10:00:05,100 INFO ? odoo.service.server: HTTP service (werkzeug) running on 0.0.0.0:8069
```

শেষ লাইনে `running on 0.0.0.0:8069` দেখলেই বোঝা যাবে সার্ভার চালু — মানে সব নেটওয়ার্ক ইন্টারফেসে ৮০৬৯ পোর্টে শুনছে।

## ব্রাউজারে যাও

```text
http://your-server-ip:8069
```

`your-server-ip`-র জায়গায় তোমার সার্ভারের আসল IP বসাও (লোকাল VM হলে `http://localhost:8069`)।

প্রথমবার Odoo-র **ডাটাবেস-ম্যানেজার পেজ** দেখাবে, যেখানে নতুন Odoo ইনস্টল্যান্স সেটআপ করার ফর্ম থাকবে:

- **Master Password** — `odoo.conf`-এর `admin_passwd`
- **Database Name** — `odoo_db` (আগে থেকে আছে, চাইলে নতুন নামেও বানানো যায়)
- **Email / Password** — নতুন অ্যাডমিন অ্যাকাউন্ট
- **Demo data** — শেখার সময় টিক দেওয়া ভালো, আসল ব্যবহারে খালি রাখো

সব দিয়ে **Create database** চাপলে Odoo মডিউলগুলো লোড করবে — কয়েক মিনিট লাগতে পারে। শেষে ড্যাশবোর্ড দেখবে।

## আটকে গেলে

| সমস্যা | যাচাই |
| --- | --- |
| পোর্ট ব্যস্ত (`Address already in use`) | `sudo lsof -i :8069` দিয়ে প্রসেস দেখে বন্ধ করো |
| ডাটাবেস কানেকশন এরর | `psql -l` কাজ করছে কিনা, `odoo.conf`-এর `db_user`/`db_name` মিলছে কিনা |
| পেজ খুলছে না কিন্তু লগ ঠিক | ফায়ারওয়াল পোর্ট আটকে আছে কিনা — [পরের পেজ](/odoo/installation/firewall-systemd) |
| `addons_path` এরর | `odoo.conf`-এ absolute path ঠিক আছে কিনা (`pwd` দিয়ে মিলাও) |

➡️ পরের ধাপ: [ফায়ারওয়াল ও systemd](/odoo/installation/firewall-systemd) — টার্মিনাল বন্ধ করলেও যেন Odoo চালু থাকে।
