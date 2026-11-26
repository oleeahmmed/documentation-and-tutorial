---
title: "ধাপ ৪ — HR Manager-এর অ্যাকাউন্ট"
description: করিম স্যারের ইউজার বানানো, শুধু HR অ্যাপগুলোর Administrator অ্যাক্সেস দেওয়া — আর যা কখনোই দেওয়া যাবে না।
icon: UserCog
---

## গল্প

Odoo-তে একটা নিয়ম আছে: **যে যতটুকু দরকার, ততটুকুই অ্যাক্সেস**। করিম স্যার HR-এর সব কাজ করবেন, কিন্তু সিস্টেমের সেটিংস, ডাটাবেস, ট্যাক্স — এসব তার হাতে দেওয়ার দরকার নেই। তাই তাকে শুধু HR অ্যাপগুলোর Administrator দেব, Settings-এর Administration দেব না। এটা মালিকের শেষ বড় কাজ।

## ৪.১ — নতুন ইউজার

1. **Settings → Users & Companies → Users** (কিছু সংস্করণে **Settings → Users**) → **New**
2. Name: `Karim Hossain`
3. Email: `karim@rahimapparels.com` — এটাই তার login
4. ফোন থাকলে দিন

## ৪.২ — অ্যাক্সেস রাইট

**Access Rights** ট্যাবে (বা পেজের মধ্যে) প্রতিটা অ্যাপের লেভেল সেট করো:

| অ্যাপ | লেভেল |
| --- | --- |
| Employees | **Administrator** |
| Recruitment | **Administrator** |
| Time Off | **Administrator** |
| Attendances | **Administrator** |
| Appraisals | **Administrator** |
| Expenses | **Administrator** |
| Fleet | **Administrator** |
| Maintenance | **Administrator** |
| Lunch | **Administrator** |

> **সতর্কতা:** Settings-এর "Administration" অ্যাক্সেস করিমকে দিও না। এটা শুধু মালিক/IT-এর কাছে থাকবে। তাতে করিম শুধু HR-এর কাজ করতে পারবে, সিস্টেম ভাঙতে পারবে না — ট্যাক্স, জার্নাল, ডাটাবেসের মতো জিনিসে হাত পড়বে না।

## ৪.৩ — পাসওয়ার্ড সেট

**Save** → পাসওয়ার্ড সেট করতে:

- **Send Invitation Email** চাপো — করিম নিজেই পাসওয়ার্ড সেট করবেন, অথবা
- **Action → Change Password** দিয়ে তুমি নিজে সেট করে দাও

> ইমেইল সেটআপ না থাকলে Invitation যাবে না — তখন Change Password পথে যাও, আর প্রথম লগইনে পাসওয়ার্ড বদলানোর কথা বলে দাও।

## ৪.৪ — যাচাই করা (খুব জরুরি)

শুধু "Save হয়ে গেছে" দেখে থামবে না। একটা **incognito/private উইন্ডো** খুলে করিমের ইমেইল-পাসওয়ার্ড দিয়ে লগইন করো, তারপর দেখো:

| চেক | কী দেখতে চাও |
| --- | --- |
| হোম স্ক্রিনে অ্যাপ | Employees, Recruitment, Time Off, Attendances, Expenses, Fleet, Maintenance, Lunch দেখা যাচ্ছে |
| Settings মেনু | নেই (বা শুধু নিজের প্রোফাইল) |
| Employees → New | খোলা যাচ্ছে |
| Settings → Technical | নেই |

তারপর **মালিকের অ্যাকাউন্টে ফিরে Logout করো।** এখান থেকে বাকি সব কাজ **Karim Sir** করবেন।

## বাস্তবে কী ঘটে

- Administrator লেভেল পেলে করিম তার অ্যাপের সব রেকর্ড (সব Department, সব কর্মী) দেখতে ও বদলাতে পারবেন
- Settings-এর Administration না থাকলে তিনি ট্যাক্স, জার্নাল, ডাটাবেস ব্যাকআপ — এসব ধরতে পারবেন না
- একজন ইউজার একাধিক কোম্পানিতে থাকতে পারে; এখন একটাই কোম্পানি
- ভুলে যদি বেশি অ্যাক্সেস দিয়ে ফেলো — Users-এ গিয়ে অ্যাপের লেভেল কমিয়ে দাও, সাথে সাথে কার্যকর হয়

## চেকলিস্ট

- [ ] Karim Hossain-এর ইউজার তৈরি
- [ ] ৯টা HR অ্যাপে Administrator
- [ ] Administration অ্যাক্সেস **নেই**
- [ ] পাসওয়ার্ড সেট (Invitation বা Change Password)
- [ ] incognito-তে লগইন করে যাচাই
- [ ] মালিক Logout

এখন করিম স্যার কাজ শুরু করবেন — প্রথমে [Department ও Employee](/odoo/hrm/people)।
