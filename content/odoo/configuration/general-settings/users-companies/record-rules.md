---
title: Record Rules
description: সেলসম্যান শুধু নিজের অর্ডার, ম্যানেজার সবার — সারি-ধরে ডেটা লুকানোর নিয়ম।
icon: Network
---

**গল্প:** নাদিয়া আর তানভীর — দুইজনই Sales ব্যবহার করে। কিন্তু নাদিয়া শুধু নিজের কোটেশন দেখবে, তানভীর পুরো টিমের। মডেলের অনুমতি (ACL) একই, পার্থক্য **কোন রেকর্ড (সারি)** দেখা যাবে সেটায়।

## Record Rule কী

একটা নিয়ম = **মডেল + গ্রুপ + ডোমেইন + কোন কোন কাজের অনুমতি**।

```text
মডেল: sale.order
গ্রুপ: Sales / User: Own Documents Only
ডোমেইন: [('user_id', '=', user.id)]
     মানে: শুধু যে অর্ডারের Salesperson আমি
```

## কোথায় দেখবে

**Developer Mode → Settings → Technical → Security → Record Rules**

`sale.order` খুঁজে দেখো — দুটো বিখ্যাত নিয়ম পাবে:

| Rule | Group | Domain |
| --- | --- | --- |
| Personal Orders | Sales / User: Own Documents Only | `[('user_id','=',user.id)]` |
| All Orders | Sales / User: All Documents | `[(1,'=',1)]` (সব) |

## হাতে-কলমে যাচাই

1. **নাদিয়া** দিয়ে ইনকগনিটো লগইন → Sales → Orders → শুধু নিজের অর্ডার
2. **তানভীর** দিয়ে আলাদা ব্রাউজারে লগইন → একই মেনুতে সবার অর্ডার
3. তানভীরের অর্ডার খুলে URL কপি করে নাদিয়ার ব্রাউজারে খোলার চেষ্টা → **Access Error** ✅

এটাই আসল প্রমাণ — শুধু মেনু লুকিয়ে থাকলে নয়।

## নিজের নিয়ম বানানো (উদাহরণ)

ঢাকা আউটলেটের ইউজার শুধু আউটলেটের অর্ডার দেখবে:

1. Record Rules → **New**
2. Name: `Outlet Orders Only`
3. Model: `Sales Order` (`sale.order`)
4. Groups: `Outlet Cashier` (আগের পেজে বানানো)
5. Domain:

```python
[('warehouse_id.code', '=', 'RO')]
```

6. Permissions: Read ✅ (Write/Create/Delete দরকার হলে)
7. Save → শিপনকে দিয়ে যাচাই করো

> ফিল্ডের নাম ভার্সনভেদে বদলাতে পারে — Domain ভুল হলে রেকর্ড দেখা যাবে না (বা বেশি দেখা যাবে), তাই এক ইউজার দিয়ে টেস্ট করেই রাখো।

## নিয়ম মেলানোর গণিত

```text
ACL (মডেলের অনুমতি)  AND  Record Rules (সারির ফিল্টার)  →  চূড়ান্ত ফল
```

| পরিস্থিতি | ফল |
| --- | --- |
| একই গ্রুপে একাধিক rule | সাধারণত **OR** — যেকোনোটা মিললেই দেখা যাবে |
| গ্রুপ ছাড়া (global) rule | সবার জন্য **AND** — কঠোর সীমা |
| ACL নেই | rule থাকলেও কিছু দেখা যাবে না |

## টিপস

| ভুল | ঠিক |
| --- | --- |
| সব rule-এ `[(1,'=',1)]` | যার যতটুকু দরকার ততটুকু |
| global rule দিয়ে access দেওয়া | global rule শুধু **বন্ধ** করতে পারে |
| নতুন rule টেস্ট না করা | দুইটা আলাদা ইউজার দিয়ে যাচাই করো |

➡️ পরের টপিক: [Multi-Company](/odoo/configuration/general-settings/users-companies/multi-company)
