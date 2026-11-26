---
title: HRM
description: গার্মেন্টস ফ্যাক্টরির হিউম্যান রিসোর্স — ৯টা HR অ্যাপ ইনস্টল, সব Settings, কর্মী Entry, দৈনিক কাজ আর মাসিক রিপোর্ট পর্যন্ত ধাপে ধাপে।
icon: Users
---

**রহিম অ্যাপারেলস লিমিটেড** — বগুড়ার একটা গার্মেন্টস ফ্যাক্টরি। ৩০০ জন কর্মী: Cutting, Sewing, Finishing, QC, Packing, Store, Merchandising, Accounts, Admin। মালিক নিজে Odoo-তে HR বসাবেন, তারপর একটা **HR Manager** অ্যাকাউন্ট বানাবেন — করিম হোসেন (Karim Sir)। এরপর HR-এর সব কাজ করিম স্যার করবেন, মালিক শুধু সময়ে সময়ে রিপোর্ট দেখবেন।

এই সেকশনে পুরো যাত্রাটা চার ভাগে সাজানো — প্রতিটা ভাগ আলাদা পেজে, প্রতিটা কাজ হাতে-কলমে।

## চার ভাগের নিয়ম

| ভাগ | কখন করবে | কী থাকছে |
| --- | --- | --- |
| **ভাগ ১ — Settings** | একবারই | লগইন, অ্যাপ ইনস্টল, ডেভেলপার মোড, কোম্পানি, HR Manager, সব অ্যাপের সেটিংস |
| **ভাগ ২ — Employee Entry** | একবারই | কর্মীর তালিকা হাতে ও Excel দিয়ে ঢোকানো, তারপর একবারের "জোড়া লাগানো" কাজ |
| **ভাগ ৩ — দৈনিক Entry** | প্রতিদিন | নতুন কর্মী, হাজিরা, ছুটি, নিয়োগ, Expense, মেশিন, গাড়ি, Lunch |
| **ভাগ ৪ — Report** | যখন দরকার | হাজিরা, ছুটি, ওভারটাইম, খরচ, নিয়োগ, মূল্যায়নের রিপোর্ট |

> **কেন এভাবে ভাগ?** সেটিংস আর এন্ট্রি একসাথে করলে প্রতিদিন ভুল করে সেটিংসে হাত পড়ে। একবার সেটিংস শেষ — তারপর শুধু ডেটা ঢোকানো।

> **সংস্করণ:** এই সেকশনের মেনুপথ Odoo 17/18 ধরে লেখা। Odoo 19-এ কয়েকটা মেনু ও লেবেল আলাদা — নিচের টেবিলে বড় পার্থক্যগুলো দেখে নাও। কোনো মেনু না মিললে Odoo-র সার্চ বক্সে নাম লিখে খুঁজে নাও।
>
> **Appraisals** অ্যাপ শুধু Odoo Enterprise/Online-এ আছে, Community-তে নেই। বাকি অ্যাপগুলোর বেশিরভাগ Community-তেও পাবে। বেতন (Payroll) আলাদা মডিউল — এই সেকশনের বাইরে।

## Odoo 19-এ যা আলাদা

| Odoo 17/18-এ | Odoo 19-এ |
| --- | --- |
| Departments ছিল Configuration-এর ভেতরে | `Employees → Departments` |
| Job Positions | `Employees → Configuration → Recruitment → Job Positions` |
| Working Schedules-এ Developer Mode লাগত | `Employees → Configuration → Employee → Working Schedules` |
| Kind of Time Off = Day | **Duration Type** = Day |
| Allow employees to request | **Requires allocation** + **Allow Employee Requests** |
| Management → All Time Off | `Time Off → Management → Time Off` (ফিল্টার **To Approve**) |
| Badge ID / PIN | **PIN Code** + **RFID/Badge Number** |
| Allocation-এ Mode | Group Allocation-এ **Grant** (By Company / By Department) |

## HR-এর অ্যাপগুলো

| অ্যাপ | কী করে | কে ব্যবহার করবে |
| --- | --- | --- |
| **Employees** | কর্মীর প্রোফাইল, Department, Job Position, hierarchy | সবাই (HR পুরোটা) |
| **Recruitment** | পদ, আবেদনকারী, ইন্টারভিউ | Karim |
| **Time Off** | ছুটির আবেদন, অনুমোদন, ব্যালেন্স | Karim + কর্মী |
| **Attendances** | হাজিরা, Kiosk, ওভারটাইম | Karim + গেটের ট্যাবলেট |
| **Appraisals** | মূল্যায়ন (Enterprise) | Karim + ম্যানেজার |
| **Expenses** | ভ্রমণ/খাবারের খরচের দাবি | Merchandiser, Karim |
| **Fleet** | কোম্পানির গাড়ি, সার্ভিস, ইনসুরেন্স | Karim |
| **Maintenance** | মেশিন নষ্ট, সার্ভিসিং | অপারেটর → মেকানিক |
| **Lunch** | ক্যান্টিনের অর্ডার (ঐচ্ছিক) | কর্মী + Karim |

## এই সেকশনে যা বানাবো

| ভাগ | পেজ | কী শিখবে |
| --- | --- | --- |
| ১ | [লগইন, অ্যাপ ও কোম্পানি](/odoo/hrm/apps-company) | Login, ৯টা অ্যাপ, Developer Mode, Rahim Apparels + BDT |
| ১ | [HR Manager-এর অ্যাকাউন্ট](/odoo/hrm/hr-manager) | Users, অ্যাক্সেস রাইট, Invitation |
| ১ | [Employees সেটিংস](/odoo/hrm/people) | Work Locations, Department, Job Position, Shift, Skills |
| ১ | [Time Off সেটিংস](/odoo/hrm/time-off) | Public Holidays, ছুটির ধরন, Accrual Plan |
| ১ | [Attendance সেটিংস](/odoo/hrm/attendance) | Kiosk, Barcode/PIN, Overtime, Tolerance |
| ১ | [নিয়োগ ও মূল্যায়ন সেটিংস](/odoo/hrm/recruitment) | Stages, Refuse Reasons, Appraisal চক্র |
| ১ | [Expense ও Fleet সেটিংস](/odoo/hrm/expenses) | খরচের Category, গাড়ির Model, Service Type |
| ১ | [Maintenance, Lunch ও চেকলিস্ট](/odoo/hrm/maintenance) | Equipment, Team, ক্যান্টিন + সেটিংস চেকলিস্ট |
| ২ | [কর্মী Entry ও Import](/odoo/hrm/employee-entry) | Rina Akter, Excel Import, Allocation, Org Chart |
| ৩ | [প্রতিদিনের Entry](/odoo/hrm/daily-entry) | হাজিরা, ছুটি, নিয়োগ, Expense, মেশিন, Lunch |
| ৪ | [রিপোর্ট দেখা](/odoo/hrm/reports) | হাজিরা, ওভারটাইম, ছুটি, খরচ, গাড়ি |
| — | [সারসংক্ষেপ ও চূড়ান্ত চেকলিস্ট](/odoo/hrm/summary) | পুরো ম্যাপ, রুটিন, পরের ধাপ |

## পুরো যাত্রাটা এক নজরে

```text
ভাগ ১ (একবার):
  Login → ৯টা অ্যাপ ইনস্টল → Developer Mode → কোম্পানি + BDT
    ↓
  Karim Sir-এর User (Settings ছাড়া বাকি সব অ্যাপে Administrator)
    ↓
  Employees সেটিংস: Work Location → Department → Job Position → Shift → Skills
    ↓
  Time Off: Public Holidays → ছুটির ধরন → Accrual Plan → Allocation
    ↓
  Attendance (Kiosk) → Recruitment Stages → Appraisal → Expense → Fleet → Maintenance → Lunch

ভাগ ২ (একবার):
  Rina Akter হাতে Entry → Excel Import (২০ জন টেস্ট, পরে বাকিরা)
    ↓
  Department Manager → Org Chart → ছুটির Allocation → Fleet/Maintenance জোড়া

ভাগ ৩ (প্রতিদিন):
  হাজিরা → ছুটি → নিয়োগ → Expense → মেশিন → গাড়ি → Lunch

ভাগ ৪ (মাসে/যখন দরকার):
  Attendance + Overtime Export → Accounts-কে বেতনের জন্য
```

## শুরু করার আগে

- Odoo চলছে এমন একটা ডাটাবেস — ডেমো ডেটা থাকলে সমস্যা নেই, তবে নিজের কোম্পানি বানিয়ে নাও ([Installation](/odoo/installation))
- **Admin** হিসেবে লগইন করার অ্যাক্সেস
- ফ্যাক্টরির তথ্য: Department-এর তালিকা, পদবি, শিফট, কর্মীর তালিকা (Excel হলে ভালো)

শুরু করতে [লগইন, অ্যাপ ও কোম্পানি](/odoo/hrm/apps-company) পেজে যাও। অ্যাকাউন্ট ও পারমিশন নিয়ে আরও দেখতে [Users & Access Rights](/odoo/users-access) সেকশন পাশে রাখো।
