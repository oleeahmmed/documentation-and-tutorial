---
title: "HR Manager-এর অ্যাকাউন্ট"
description: "ভাগ ১ — করিম হোসেনের জন্য আলাদা User, প্রতিটা HR অ্যাপে Administrator, কিন্তু Settings-এ ঢোকার অধিকার নেই।"
icon: UserPlus
---

## গল্প

মালিক নিজে সব করলে HR-এর কাজ আটকে থাকবে। তাই ফ্যাক্টরির HR Manager **করিম হোসেন** (Karim Sir)-এর জন্য আলাদা অ্যাকাউন্ট বানাতে হবে — যিনি কাজ চালাবেন, কিন্তু কোম্পানির Settings বা অন্য অ্যাপের গোপন সেটিংস বদলাতে পারবেন না।

## ১.৫ — HR Manager-এর User বানাও

**Settings → Users & Companies → Users → New**

| ফিল্ড | মান |
| --- | --- |
| Name | `Karim Hossain` |
| Email | `karim@rahimapparels.com` |

### Access Rights

Access Rights ট্যাবে প্রতিটা HR অ্যাপের পাশে **Administrator** বসাও:

| অ্যাপ | অ্যাক্সেস |
| --- | --- |
| Employees | Administrator |
| Recruitment | Administrator |
| Time Off | Administrator |
| Attendances | Administrator |
| Appraisals | Administrator |
| Expenses | Administrator |
| Fleet | Administrator |
| Maintenance | Administrator |
| Lunch | Administrator |
| Administration / Settings | কোনো অ্যাক্সেস নয় |

তারপর **Save** → **Send Invitation Email**।

> **কেন Settings বন্ধ?** Settings-এ ডাটাবেসের গুরুত্বপূর্ণ জিনিস থাকে — সিকোয়েন্স, ট্যাক্স, কারেন্সি, ইন্টিগ্রেশন। HR কাজের জন্য ওগুলোর দরকার নেই; ভুল করে কিছু বদলালে পুরো ফ্যাক্টরির হিসাব এলোমেলো হতে পারে। মালিকের অ্যাকাউন্টই Settings-এর একমাত্র অধিকারী থাকুক।

> এখন থেকে চাইলে Karim Sir-এর লগইন দিয়েই ভাগ ২, ৩ আর ৪-এর কাজ করা যায় — অ্যাক্সেস ঠিক আছে কিনা বাস্তবে যাচাই হয়ে যাবে।

## Invitation-এর পর কী হয়

1. করিম স্যারের ইমেইলে লিংক যায়
2. তিনি লিংকে ক্লিক করে নিজের পাসওয়ার্ড সেট করেন
3. লগইন করলে তিনি শুধু নয়টা HR অ্যাপ আর সাধারণ মেনু দেখেন — Settings নেই

> ইমেইল সেটআপ না থাকলে Invitation যাবে না। তখন **Users** → করিমের রেকর্ড → **Action → Change Password** দিয়ে সরাসরি পাসওয়ার্ড বসিয়ে তাকে জানিয়ে দাও।

## যাচাই করো (হাতে-কলমে)

1. একটা ইনকগনিটো/প্রাইভেট উইন্ডো খোলো
2. `karim@rahimapparels.com` দিয়ে লগইন করো
3. নিশ্চিত করো:
   - বাঁ দিকের অ্যাপ মেনুতে Employees, Recruitment, Time Off, Attendances, Appraisals, Expenses, Fleet, Maintenance, Lunch দেখা যায়
   - **Settings** অ্যাপ দেখা যায় না
4. যাচাই শেষ — লগআউট করে মালিকের অ্যাকাউন্টে ফিরে যাও

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Invitation ইমেইল আসেনি | Spam দেখো; না পেলে Change Password দিয়ে পাসওয়ার্ড বসাও |
| লগইনে "Access Denied" | Access Rights-এ অ্যাপের Administrator সেভ হয়েছে কিনা দেখো |
| করিম Sir Settings দেখতে পাচ্ছেন | Users → করিম → Access Rights → Administration-এর সব খালি করো |
| HR অ্যাপের কিছু মেনু নেই | সেই অ্যাপ ইনস্টল হয়েছে কিনা Apps-এ দেখো |
| দুইজন একসাথে ঢুকতে পারছে না | Odoo-তে একাধিক ইউজার একসাথে কাজ করতে পারে; সেশন আলাদা ব্রাউজার/ইনকগনিটোতে রাখো |

## চেকলিস্ট

- [ ] `Karim Hossain` / `karim@rahimapparels.com` User
- [ ] ৯টা HR অ্যাপে Administrator
- [ ] Administration/Settings-এ কোনো অ্যাক্সেস নেই
- [ ] Invitation পাঠানো (বা পাসওয়ার্ড সরাসরি বসানো)
- [ ] ইনকগনিটোতে লগইন করে যাচাই

পরের ধাপে [Employees সেটিংস](/odoo/hrm/people) — Work Location, Department, পদবি আর শিফট।
