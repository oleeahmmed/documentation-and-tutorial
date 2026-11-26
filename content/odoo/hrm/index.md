---
title: HRM
description: গার্মেন্টস ফ্যাক্টরির ৩০০ কর্মীর হিউম্যান রিসোর্স — Employees, Time Off, Attendance, Recruitment থেকে মাসিক রিপোর্ট পর্যন্ত, ধাপে ধাপে।
icon: Users
---

**রহিম অ্যাপারেলস লিমিটেড** — বগুড়ার একটা গার্মেন্টস ফ্যাক্টরি। ৩০০ জন কর্মী: Cutting, Sewing, Finishing, QC, Packing, Store, Merchandising, Accounts, Admin। মালিক নিজে Odoo বসাবেন, তারপর এক **HR Manager** বানাবেন — করিম হোসেন (Karim Sir)। এরপর HR-এর সব কাজ করিম স্যার করবেন, মালিক শুধু সময়ে সময়ে দেখবেন।

এই সেকশনে সেই পুরো যাত্রা — শূন্য থেকে Odoo-তে একটি ফ্যাক্টরির HR চালু করা, প্রতিটি মেনু ও ফিল্ড হাতে-কলমে।

> **সংস্করণ:** পুরো সিরিজটা **Odoo 19**-এর মেনু ও লেবেল অনুসারে লেখা। Odoo 17/18-এও ধাপগুলো একই, শুধু কয়েকটা মেনু বা নাম আলাদা — নিচের টেবিলে বড় পার্থক্যগুলো দেখে নাও। কোনো মেনু না মিললে Odoo-র সার্চ বক্সে নাম লিখে খুঁজে নাও।
>
> **Appraisals** অ্যাপ শুধু Odoo Enterprise/Online-এ আছে, Community-তে নেই। বাকি অ্যাপগুলোর বেশিরভাগ Community-তেও পাবে। বেতন (Payroll) আলাদা মডিউল — এই সেকশনের বাইরে।

## Odoo 19-এ যা আলাদা

| Odoo 17/18-এ | Odoo 19-এ |
| --- | --- |
| Departments ছিল Configuration-এর ভেতরে | `Employees → Departments` (সরাসরি মেনু) |
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
| **Recruitment** | চাকরির বিজ্ঞাপন, আবেদনকারী, ইন্টারভিউ | Karim |
| **Time Off** | ছুটির আবেদন, অনুমোদন, ব্যালেন্স | Karim + কর্মী |
| **Attendances** | হাজিরা, Kiosk, ওভারটাইম | Karim + গেটের ট্যাবলেট |
| **Appraisals** | বার্ষিক মূল্যায়ন (Enterprise) | Karim + ম্যানেজার |
| **Expenses** | ভ্রমণ/খাবারের খরচের দাবি | Merchandiser, Karim |
| **Fleet** | কোম্পানির গাড়ি, সার্ভিস, ইনসুরেন্স | Karim |
| **Maintenance** | মেশিন নষ্ট, সার্ভিসিং | অপারেটর → মেকানিক |
| **Lunch** | ক্যান্টিনের অর্ডার (ঐচ্ছিক) | কর্মী + Karim |

## পুরো যাত্রাটা এক নজরে

```text
তথ্য গোছানো (ধাপ ০)
    ↓
Odoo ইনস্টল + ডাটাবেস (ধাপ ১)  →  HR অ্যাপ ইনস্টল (ধাপ ২)
    ↓
কোম্পানি + BDT (ধাপ ৩)  →  HR Manager-এর ইউজার (ধাপ ৪)
    ↓  ← এখান থেকে করিম স্যার
Department → Job Position → Work Schedule → Employee (ধাপ ৫)
    ↓
Public Holidays → Time Off Types → Allocations → Accrual (ধাপ ৬)
    ↓
Attendance Kiosk + Overtime (ধাপ ৭)
    ↓
Recruitment (ধাপ ৮) → Appraisals (ধাপ ৯)
    ↓
Expenses (১০) → Fleet (১১) → Maintenance (১২) → Lunch (১৩)
    ↓
দৈনিক/সাপ্তাহিক/মাসিক রুটিন আর রিপোর্ট (ধাপ ১৪)
```

## কে কী করবে

| ধাপ | কাজ | কে |
| --- | --- | --- |
| ০ | কাগজে তথ্য রেডি | মালিক |
| ১ | Odoo ইনস্টল ও ডাটাবেস | মালিক / IT |
| ২–৩ | HR অ্যাপ, কোম্পানি, BDT | মালিক |
| ৪ | HR Manager-এর অ্যাকাউন্ট ও অ্যাক্সেস | মালিক (শেষ কাজ) |
| ৫–১৩ | Department থেকে Lunch পর্যন্ত | Karim Sir |
| ১৪ | রিপোর্ট, রুটিন, চেকলিস্ট | Karim + মালিক |

## এই সেকশনে যা বানাবো

| ধাপ | পেজ | কী শিখবে |
| --- | --- | --- |
| ০ | [শুরুর তথ্য প্রস্তুত](/odoo/hrm/preparation) | কর্মী তালিকা, পদবি, ছুটির নিয়ম |
| ১ | [Odoo ইনস্টল ও ডাটাবেস](/odoo/hrm/install) | Online বা Docker, ডেমো ডেটা ছাড়া ডাটাবেস |
| ২–৩ | [HR অ্যাপ ও কোম্পানি](/odoo/hrm/apps-company) | ৯টা অ্যাপ, কোম্পানির তথ্য, BDT |
| ৪ | [HR Manager-এর অ্যাকাউন্ট](/odoo/hrm/hr-manager) | Users, অ্যাক্সেস রাইট, নিরাপত্তা |
| ৫ | [Department থেকে Employee](/odoo/hrm/people) | Department, Job Position, Shift, ৩০০ কর্মী |
| ৬ | [Time Off — ছুটির ব্যবস্থা](/odoo/hrm/time-off) | ছুটির ধরন, বরাদ্দ, Accrual, অনুমোদন |
| ৭ | [Attendance — হাজিরা](/odoo/hrm/attendance) | Kiosk, Badge/PIN, ওভারটাইম |
| ৮ | [Recruitment — নিয়োগ](/odoo/hrm/recruitment) | Job Position, Applicant পাইপলাইন |
| ৯ | [Appraisals — মূল্যায়ন](/odoo/hrm/appraisals) | Goals, ফিডব্যাক, বার্ষিক চক্র |
| ১০ | [Expenses — খরচের দাবি](/odoo/hrm/expenses) | Category, রিপোর্ট, অনুমোদন |
| ১১ | [Fleet — গাড়ি](/odoo/hrm/fleet) | সার্ভিস, ইনসুরেন্স, জ্বালানি ও খরচ |
| ১২ | [Maintenance — মেশিন](/odoo/hrm/maintenance) | Equipment, রিকোয়েস্ট, Kanban |
| ১৩ | [Lunch — ক্যান্টিন](/odoo/hrm/lunch) | Vendor, Product, অর্ডার |
| ১৪ | [HR-এর রুটিন ও চেকলিস্ট](/odoo/hrm/routine) | দৈনিক/সাপ্তাহিক/মাসিক কাজ |

## চূড়ান্ত চেকলিস্ট (এক নজরে)

- [ ] Odoo ইনস্টল ও ডাটাবেস তৈরি (মালিক)
- [ ] HR অ্যাপগুলো ইনস্টল (মালিক)
- [ ] কোম্পানির তথ্য ও BDT সেট (মালিক)
- [ ] Karim Sir-এর User ও অ্যাক্সেস রাইট (মালিক)
- [ ] Department → Job Position → Work Schedule (Karim)
- [ ] Employees (প্রথমে ১ জন, পরে Excel দিয়ে Import)
- [ ] Public Holidays → Time Off Types → Allocations → Accrual
- [ ] Attendance Kiosk ও ওভারটাইম সেটিং
- [ ] Recruitment, Expenses, Appraisals সেটআপ
- [ ] Fleet, Maintenance, Lunch (দরকার অনুযায়ী)

শুরু করতে [শুরুর তথ্য প্রস্তুত](/odoo/hrm/preparation) পেজে যাও। Odoo-র অ্যাকাউন্ট ও পারমিশন নিয়ে আরও দেখতে [Users & Access Rights](/odoo/users-access) সেকশন পাশে রাখো।
