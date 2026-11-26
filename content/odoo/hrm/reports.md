---
title: "রিপোর্ট দেখা"
description: "ভাগ ৪ — হাজিরা, ওভারটাইম, ছুটি, নিয়োগ, খরচ, গাড়ি, মেশিন — কোন রিপোর্ট কোথায়, আর মাসের শেষে কী করবে।"
icon: BarChart3
---

## গল্প

মালিক মাসের শেষে জানতে চান — কতজন কর্মী, কে কত ছুটিতে, ওভারটাইমে কত ঘণ্টা, খরচ কত হলো। এই ভাগে শুধু রিপোর্ট দেখা — কোনো Entry বা Settings নয়।

## কোন রিপোর্ট কোথায়

| কী দেখতে চাও | কোথায় |
| --- | --- |
| মোট কর্মী, Department অনুযায়ী ভাগ | **Employees** → Group by Department; **Employees → Reporting** |
| Org Chart | **Employees → Org Chart** |
| কর্মীর Skill তালিকা | **Employees → Reporting → Skills** |
| কে ছুটিতে, কত ছুটি বাকি | **Time Off → Overview** (ক্যালেন্ডার), **Reporting → By Employee / By Type** |
| হাজিরা, দেরি, অনুপস্থিতি | **Attendances → Reporting** |
| ওভারটাইম ঘণ্টা | **Attendances → Reporting** → Extra Hours দিয়ে Group by Employee |
| নিয়োগ অগ্রগতি | **Recruitment → Reporting → Recruitment Analysis** |
| Appraisal ফলাফল | **Appraisals → Reporting** |
| খরচের রিপোর্ট | **Expenses → Reporting** (Category/Employee/মাস অনুযায়ী) |
| গাড়ির খরচ | **Fleet → Reporting → Costs Analysis** |
| মেশিন বন্ধ/মেরামত রিপোর্ট | **Maintenance → Reporting** |
| Lunch অর্ডার | **Lunch → Reporting** |

## যেকোনো রিপোর্টে এই চারটা বাটন

| বাটন | কী করে |
| --- | --- |
| **Filters** | মাস/বছর, Department, Employee দিয়ে রিপোর্ট ছোট করো |
| **Group By** | Department/Employee ধরে ভাগ করে দেখো |
| **Pivot / Graph** | টেবিলকে পিভট বা চার্টে বদলে দেখো |
| **Export** | Excel-এ নামিয়ে রাখো |

> রিপোর্টটা আগে Filter আর Group By দিয়ে ঠিক করো, তারপর Export — নাহলে Excel-এ বাড়তি সারি/কলাম নিয়ে ঝামেলা হবে।

## মাসের শেষে যা করবে

1. **Attendances → Reporting** → মাসের তারিখ ফিল্টার
2. ওভারটাইম দেখতে Extra Hours দিয়ে **Group by Employee**
3. **Export** করে Excel নামাও
4. Attendance + Overtime রিপোর্ট Accounts-কে দাও — বেতনের জন্য

> বেতন (Payroll) Odoo-র আলাদা মডিউল — এখানে শুধু হাজিরা আর ওভারটাইমের ডেটা তৈরি হচ্ছে, Payslip নয়। মাসের রিপোর্টটাই Accounts-এর হাতে যাবে।

## বাস্তবে কী ঘটে

- রিপোর্ট সবসময় লাইভ ডেটা দেখায় — Entry বদলালে রিপোর্টও বদলায়; তাই আগে ডেটা ঠিক করো, পরে Export
- Time Off → Reporting → Balance-এ কে কত দিন জমিয়েছে/ঋণে আছে দেখা যায়
- Recruitment Analysis-এ Stage অনুযায়ী কতজন আটকে আছে দেখা যায় — কোথায় নিয়োগ ধীর হচ্ছে বোঝা যায়
- Graph/Pivot ভিউ সেভ করা যায় না, কিন্তু Filter সেভ করে Favorites হিসেবে রাখা যায়

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| রিপোর্টে ডেটা শূন্য | ওই তারিখের Entry আছে কিনা; ফিল্টারের তারিখ দেখো |
| Reporting মেনু নেই | সংশ্লিষ্ট অ্যাপ ইনস্টল; কিছু রিপোর্ট Enterprise-এ |
| Export-এ বাংলা ভাঙে | Excel-এ CSV খুললে UTF-8 বাছো; XLSX Export করলে সমস্যা হয় না |
| Overtime রিপোর্টে ঘণ্টা নেই | Attendance Settings-এ Extra Hours চালু কিনা দেখো |

## চেকলিস্ট

- [ ] Employees-এ মোট কর্মী ও Department ভাগ
- [ ] Time Off → Balance রিভিউ
- [ ] Attendance + Extra Hours → Excel Export
- [ ] Expenses, Fleet, Maintenance রিপোর্ট একবার দেখা
- [ ] মাসিক রিপোর্ট Accounts-কে দেওয়া

পরের ধাপে [সারসংক্ষেপ ও চূড়ান্ত চেকলিস্ট](/odoo/hrm/summary) — পুরো HRM এক নজরে।
