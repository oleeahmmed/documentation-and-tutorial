---
title: "Maintenance, Lunch ও সেটিংস চেকলিস্ট"
description: "ভাগ ১ শেষ — মেশিনের Category ও টিম, ক্যান্টিনের Vendor-Product, আর পুরো ভাগ ১-এর চেকলিস্ট।"
icon: Wrench
---

## গল্প

ফ্যাক্টরির প্রাণ মেশিন — সেলাই মেশিন, কাটিং মেশিন, বয়লার। নষ্ট হলে কে ঠিক করবে, কত সময় লাগবে, সেটা ট্র্যাক না থাকলে লাইন বন্ধ। আর ক্যান্টিন থাকলে দুপুরের খাবারের অর্ডারও Odoo থেকে নেওয়া যায়।

## ১.১৩ — Maintenance Settings

### (ক) Equipment Categories

**Maintenance → Configuration → Equipment Categories**

| Category |
| --- |
| Sewing Machine |
| Cutting Machine |
| Iron/Press |
| Boiler |
| Generator |
| Compressor |

### (খ) Maintenance Teams

**Maintenance → Configuration → Maintenance Teams**

| Team |
| --- |
| Mechanical Team |
| Electrical Team |

Team Members পরে যোগ হবে — কর্মী তৈরি হলে মেকানিকদের টিমে বসাতে হবে।

## ১.১৪ — Lunch Settings (ক্যান্টিন থাকলে)

**Lunch → Configuration → Vendors** — ক্যান্টিন সরবরাহকারীর নাম, ফোন।

**Lunch → Products → New** — `ভাত-ডাল-মুরগি`, `খিচুড়ি`, `ডিম-ভাত` + দাম।

**Lunch → Configuration → Locations** — `Floor 1 Canteen`।

> ক্যান্টিন না থাকলে Lunch অ্যাপটা বাদ দাও — বাকি HR কাজে কোনো প্রভাব পড়বে না।

## Settings শেষের চেকলিস্ট

- [ ] সব App Install
- [ ] Company ও BDT
- [ ] Karim-এর User
- [ ] Work Locations, Departments, Job Positions
- [ ] Working Schedule (Asia/Dhaka)
- [ ] Skill Types, Departure Reasons
- [ ] Public Holidays, Time Off Types, Accrual Plan
- [ ] Attendance Kiosk ও Overtime
- [ ] Recruitment Stages
- [ ] Appraisal Settings
- [ ] Expense Categories
- [ ] Fleet Models/Service Types
- [ ] Maintenance Categories/Teams
- [ ] Lunch Vendor/Products

**সব টিক পড়লে ভাগ ২-এ যাও।**

> **ভাগ ১ শেষ মানে সেটিংসে আর ফিরবে না** — বছরে একবার নতুন Public Holiday আর ছুটির Allocation বাদে। এরপর শুধু ডেটা ঢোকানো, তাই ভুল করে Settings বদলানোর ভয় নেই।

## বাস্তবে কী ঘটে

- Equipment বানানোর সময় Category বাছলে একই ধরনের মেশিনের সমস্যা একসাথে দেখা যায়
- Maintenance Team-এ মেকানিক থাকলে Request তাকে Assign করা যায়; না থাকলে Team খালি দেখাবে
- Lunch Product-এ দাম থাকলে মাসের শেষে ক্যান্টিনের বিল মেলানো সহজ

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Maintenance মেনু নেই | Maintenance অ্যাপ ইনস্টল করো |
| Lunch মেনু নেই | Lunch অ্যাপ ইনস্টল করো (ঐচ্ছিক) |
| Team Members যোগ করা যাচ্ছে না | আগে Employees-এ মেকানিকদের Entry দাও, তারপর টিমে যোগ করো |

পরের ধাপে [কর্মী Entry ও Import](/odoo/hrm/employee-entry) — ভাগ ২ শুরু, Rina Akter-কে হাতে ঢুকিয়ে বাকিদের Excel দিয়ে।
