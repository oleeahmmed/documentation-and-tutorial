---
title: "সারসংক্ষেপ ও চূড়ান্ত চেকলিস্ট"
description: "পুরো HRM সেকশন এক নজরে — চার ভাগের ম্যাপ, দৈনিক/মাসিক রুটিন, চেকলিস্ট আর পরের ধাপ (Payroll)।"
icon: CheckCircle2
---

## গল্পের সমাপ্তি

শুরুতে ছিল একটা খালি Odoo আর খাতায় লেখা হাজিরা। এখন রহিম অ্যাপারেলসের পুরো HR ডিজিটাল — ৯টা অ্যাপ, ৩০০ কর্মীর প্রোফাইল, ছুটি-হাজিরা-ওভারটাইম, নিয়োগ, খরচ, গাড়ি আর মেশিনের হিসাব, আর মাসের শেষে এক ক্লিকে রিপোর্ট। মালিক সেটিংস করেছেন, করিম স্যার এখন প্রতিদিন চালাচ্ছেন।

## চার ভাগের পুরো ম্যাপ

```text
ভাগ ১ — Settings (একবার):
  Login → ৯টা অ্যাপ → Developer Mode → কোম্পানি + BDT
    ↓
  Karim Sir User (Settings ছাড়া বাকি সব Administrator)
    ↓
  Employees: Work Location → Department → Job Position → Shift → Skills
    ↓
  Time Off: Public Holidays → Type → Accrual Plan
    ↓
  Attendance Kiosk → Recruitment → Appraisal → Expense → Fleet → Maintenance → Lunch

ভাগ ২ — Employee Entry (একবার):
  Rina Akter হাতে → Excel Import (২০ জন Test) → Manager + Org Chart
    ↓
  Allocation (Casual ১০, Sick ১৪, Annual Accrual) → Fleet/Maintenance জোড়া

ভাগ ৩ — দৈনিক Entry:
  হাজিরা → ছুটি Approve → নিয়োগ → Expense → Maintenance → Fleet → Lunch

ভাগ ৪ — Report:
  Attendance + Overtime Export → Accounts-কে বেতনের জন্য
```

## কে কী করবে

| ভাগ | কাজ | কে |
| --- | --- | --- |
| ১ | লগইন, অ্যাপ, কোম্পানি, সব Settings | মালিক |
| ১ | HR Manager-এর User ও অ্যাক্সেস | মালিক (শেষ কাজ) |
| ২ | কর্মী Entry, Import, Allocation | Karim Sir |
| ৩ | দৈনিক Entry, Approve | Karim Sir |
| ৪ | রিপোর্ট, Export, Accounts-কে দেওয়া | Karim Sir + মালিক |

## দৈনিক রুটিন

- **Attendances** দেখো — কে আসেনি, কে দেরি করেছে
- ছুটির আবেদন **Approve/Refuse**; Overview-তে আজ কতজন বাইরে
- **Maintenance** রিকোয়েস্ট ধরো — Priority অনুযায়ী মেকানিক Assign
- **Expense Report** Approve

## প্রতি মাসের শেষে

- **Attendance + Extra Hours** রিপোর্ট Excel-এ Export করে Accounts-কে দাও
- **Time Off → Balance** রিভিউ — কে অনেক ছুটি জমিয়েছে
- **Fleet/Maintenance**-এর মেয়াদ-উত্তীর্ণ আইটেম চেক
- **Lunch**-এর মাসের মোট অর্ডার ও ভর্তুকি

## বছরে একবার

- নতুন বছরের **Public Holidays** বসাও (সরকারি ঘোষণার পর)
- সবার **Allocation** রিনিউ (Casual ১০, Sick ১৪)
- **Appraisal** চক্র শুরু (Enterprise হলে)
- পুরোনো Applicant/Archive করা Employee একবার রিভিউ

## চূড়ান্ত চেকলিস্ট

- [ ] ৯টা অ্যাপ ইনস্টল, Developer Mode চালু
- [ ] `Rahim Apparels Ltd.`, BDT, লোগো
- [ ] Karim Sir-এর User — সব HR অ্যাপে Administrator, Settings বন্ধ
- [ ] Work Location, Department (Parent সহ), Job Position, Shift (Asia/Dhaka)
- [ ] Skill Type, Departure Reason, Tags
- [ ] Public Holidays, ৫টা Time Off Type, Accrual Plan
- [ ] Attendance Kiosk + Overtime + Tolerance
- [ ] Recruitment Stage/Refuse Reason, Appraisal সেটিং
- [ ] Expense Category, Fleet Model/Service, Maintenance Category/Team, Lunch
- [ ] ১ জন হাতে Entry → Excel Import → Manager/Org Chart
- [ ] Casual ১০, Sick ১৪, Annual Accrual Allocation
- [ ] Related User, গাড়ির Driver/Contract, Equipment/Team
- [ ] দৈনিক রুটিন চালু, মাসিক রিপোর্ট Accounts-কে

## পরের ধাপ

- **বেতন (Payroll):** Payslip, বেতনের স্লিপ, ট্যাক্স এখানে নেই — Payroll মডিউল আলাদা। ইনস্টল করে Attendances/Time Off-এর ডেটার সাথে জুড়লে হাজিরা থেকেই বেতন হিসাব হবে।
- **ছুটির নিয়ম:** এই সেকশনের সংখ্যাগুলো সাধারণ নিয়ম — চূড়ান্ত করার আগে কম্প্লায়েন্স অফিসারের সাথে মিলিয়ে নাও।
- **ব্যাকআপ:** নিয়মিত ডাটাবেস ব্যাকআপ নাও — পদ্ধতি [Database](/odoo/configuration/database) পেজে।

সেকশনের শুরুতে ফিরে যেতে [HRM](/odoo/hrm) পেজে যাও। কোম্পানির হিসাব চালাতে [Invoice Module](/odoo/invoice-module), অ্যাকাউন্ট-পারমিশন নিয়ে [Users & Access Rights](/odoo/users-access) সেকশন পাশে রাখো।
