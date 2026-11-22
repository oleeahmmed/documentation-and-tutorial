---
title: PostgreSQL ইউজার
description: Odoo ডাটাবেসে ঢোকার জন্য PostgreSQL ইউজার বানানো আর যাচাই।
icon: Database
---

## ধাপ ৩: PostgreSQL ইউজার সেটআপ

Odoo কোড PostgreSQL-এ ঢুকতে একটা ইউজার দিয়ে লগইন করে। সবচেয়ে সহজ উপায় — তোমার লিনাক্স ইউজারের নামেই একটা PostgreSQL superuser বানানো:

```bash
# তোমার লিনাক্স ইউজারের নামে একটা PostgreSQL ইউজার বানাও (পাসওয়ার্ড ছাড়া লগইন সহজ হয়)
sudo -u postgres createuser -s $USER
```

`-s` মানে superuser — ডাটাবেস বানানো/মুছে ফেলার অনুমতিসহ। ডেভেলপমেন্টে এটা সুবিধাজনক।

### অথবা আলাদা ইউজার

```bash
sudo -u postgres createuser -s odoo_user
sudo -u postgres psql -c "ALTER USER odoo_user WITH PASSWORD 'your_password';"
```

আলাদা ইউজার বানালে পরে `odoo.conf`-এ `db_user = odoo_user` আর `db_password` দিতে হবে।

## যাচাই করো

```bash
psql -l   # ডাটাবেসের তালিকা দেখাবে, এরর না এলেই বোঝা যাবে কানেকশন ঠিক আছে
```

আউটপুটে `postgres`, `template0`, `template1` ইত্যাদি ডাটাবেসের তালিকা দেখবে — মানে তোমার ইউজার দিয়ে PostgreSQL-এ ঢোকা যাচ্ছে।

> `psql -l` চালাতে গিয়ে `Peer authentication failed` এলে বুঝবে ইউজার নাম/macOS-টাইপ mismatch হয়েছে। সাধারণত লিনাক্স ইউজারনেম আর PostgreSQL ইউজারনেম এক রাখলেই সমস্যা হয় না।

➡️ পরের ধাপ: [সোর্স কোড আনা](/odoo/source-clone) — git কনফিগার করে Odoo-র কোড নামাই।
