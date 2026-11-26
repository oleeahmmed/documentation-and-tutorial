---
title: "ধাপ ১৪ — HR-এর রুটিন ও চেকলিস্ট"
description: সেটআপ শেষ — এবার প্রতিদিন, প্রতি সপ্তাহে, মাসে আর বছরে করিম স্যার কী করবেন, আর পুরো সেকশনের চূড়ান্ত চেকলিস্ট।
icon: CalendarCheck
---

## গল্প

Odoo বসানো মানে কাজ শেষ নয় — আসল কাজ শুরু। প্রতিদিন সকালে হাজিরা দেখে নেওয়া, ছুটির আবেদন অনুমোদন, মাসের শেষে Accounts-কে ওভারটাইম রিপোর্ট দেওয়া — এই রুটিনটাই ফ্যাক্টরির HR-কে সচল রাখে। নিচের তালিকা প্রিন্ট করে করিম স্যারের টেবিলে টাঙিয়ে দাও।

## প্রতিদিন (সকালে)

- **Attendances**: কে আসেনি, কে দেরি করেছে — কারণ ফোনে জেনে নাও; রিপোর্টে মিসিং চেক-আউট ঠিক করাও
- **Time Off**: নতুন আবেদন **Approve/Refuse**; Overview-তে আজ কতজন বাইরে
- **Maintenance**: নষ্ট মেশিনের রিকোয়েস্টগুলো কোন স্টেজে, মেকানিক কাজ শুরু করেছে কি না

## প্রতি সপ্তাহে

- **Recruitment**: Applicant পাইপলাইন আপডেট, ইন্টারভিউ শিডিউল
- **Expenses**: জমা পড়া Expense Report অনুমোদন
- **Fleet**: কোনো গাড়ির সার্ভিস/কন্ট্রাক্ট মেয়াদ কাছে কি না

## প্রতি মাসের শেষে

- **Attendance ও Extra Hours রিপোর্ট** বের করে Accounts-কে দাও (বেতনের জন্য)
- **Time Off Balance** রিভিউ — কে অনেক ছুটি জমিয়েছে, কে ঋণাত্মক
- **Fleet ও Maintenance**-এর মেয়াদ-উত্তীর্ণ আইটেম চেক
- **Lunch**: মাসের মোট অর্ডার ও ভর্তুকির হিসাব

## বছরে একবার

- নতুন বছরের **Public Holidays** বসাও (সরকারি ঘোষণার পর)
- সবার **Allocation** রিনিউ (Casual ১০, Sick ১৪)
- **Appraisal** চক্র শুরু (Enterprise হলে)
- পুরোনো Applicant/আর্কাইভ করা Employee রেকর্ড একবার দেখে নাও

## মাসিক রিপোর্ট কোথায় পাবে

| রিপোর্ট | মেনু |
| --- | --- |
| হাজিরা ও অনুপস্থিতি | Attendances → Reporting |
| ছুটির সারসংক্ষেপ | Time Off → Reporting → by Employee / by Type |
| ছুটির ব্যালেন্স | Time Off → Reporting → Balance |
| ওভারটাইম | Attendances → Reporting (Extra Hours) |
| খরচ | Expenses → Reporting → Expenses Analysis |
| গাড়ির খরচ | Fleet → Reporting → Costs |
| মেশিনের ইতিহাস | Maintenance → Reporting |

## চূড়ান্ত চেকলিস্ট (এক নজরে)

- [ ] Odoo ইনস্টল ও Database তৈরি (মালিক)
- [ ] HR অ্যাপগুলো ইনস্টল (মালিক)
- [ ] কোম্পানির তথ্য ও BDT সেট (মালিক)
- [ ] Karim Sir-এর User ও অ্যাক্সেস রাইট (মালিক)
- [ ] Department → Job Position → Work Schedule (Karim)
- [ ] Employees (প্রথমে ১ জন, পরে Excel দিয়ে Import)
- [ ] Public Holidays → Time Off Types → Allocations → Accrual (Karim)
- [ ] Attendance Kiosk ও ওভারটাইম সেটিং
- [ ] Recruitment, Expenses, Appraisals সেটআপ
- [ ] Fleet, Maintenance, Lunch (দরকার অনুযায়ী)
- [ ] দৈনিক/সাপ্তাহিক/মাসিক রুটিন চালু
- [ ] মাসিক রিপোর্ট Accounts-কে দেওয়া

## শেষ পরামর্শ

- **প্রথম ১ সপ্তাহ শুধু ২০–৩০ জন কর্মী দিয়ে টেস্ট চালাও** — হাজিরা, ছুটি, Expense একবার ঘুরিয়ে দেখো; সব ঠিকঠাক চললে বাকিদের ঢোকাও
- **বেতন (Payroll) আলাদা মডিউল** — Payslip, বেতনের স্লিপ, ট্যাক্স এখানে নেই; পরে Payroll ইনস্টল করে Attendance/Time Off-এর ডেটার সাথে জুড়ে দিতে হবে
- **ছুটির নিয়ম আইনজীবী/কমপ্লায়েন্সের সাথে মিলিয়ে নাও** — এই সেকশনের সংখ্যাগুলো সাধারণ নিয়ম, আপনার কোম্পানির নীতি ভিন্ন হতে পারে
- **ব্যাকআপ** — নিয়মিত ডাটাবেস ব্যাকআপ নাও ([Database](/odoo/configuration/database) পেজে পদ্ধতি আছে)

সেকশনের শুরুতে ফিরে যেতে [HRM](/odoo/hrm) পেজে যাও। কোম্পানির ইনভয়েসিং চালাতে চাইলে [Invoice Module](/odoo/invoice-module) সেকশনটা পাশে রাখো।
