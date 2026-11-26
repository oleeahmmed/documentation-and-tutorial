---
title: "প্রতিদিনের Entry"
description: "ভাগ ৩ — নতুন কর্মী, হাজিরা, ছুটি, নিয়োগ, Expense, মেশিন, গাড়ি, Appraisal আর Lunch — শুধু ডেটা ঢোকানোর কাজ।"
icon: ClipboardCheck
---

## গল্প

সেটিংস আর কর্মীর তালিকা শেষ। এখন থেকে প্রতিদিনের কাজ শুধু Entry — কোনো Settings নয়। সকালে হাজিরা, ছুটির আবেদন, মেশিনের রিকোয়েস্ট, Expense — সব একই Odoo-তে, নিজের নিজের জায়গায়।

## ৩.১ — নতুন কর্মী যোগদান

**Employees → New** → একই ফর্ম। Recruitment থেকে এলে Applicant কার্ডে **Create Employee** চাপো — নাম-পদবি নিজে থেকেই বসে যাবে।

> নতুন কর্মীর ক্ষেত্রেও Working Hours আর Work Location বসাতে ভুলো না — না হলে হাজিরার হিসাব ডিফল্ট শিফটে হবে।

## ৩.২ — হাজিরা

- গেটে **Kiosk** খোলা রাখো — কর্মী Badge স্ক্যান/PIN দিয়ে **Check In / Check Out**
- কেউ ভুলে গেলে: **Attendances → New** → Employee, Check In, Check Out সময় বসাও

> হাতে Entry দেওয়ার সময় কারণ লিখে রাখো (ফোনের নোটে হলেও) — মাসের শেষে "কে কতবার ভুলেছে" দেখে বোঝা যায় কার্ড রিডারে সমস্যা না মানুষে।

## ৩.৩ — ছুটি

- **Time Off → New Time Off** → Type, From–To, কারণ → **Save**
- Approve/Refuse: **Time Off → Management → All Time Off** (To Approve ফিল্টার) → ক্লিক → **Approve**

> Approve করার আগে ব্যালেন্স দেখো — Casual-এ ১০ দিনের বেশি গেলে Odoo আটকাবে, কিন্তু Unpaid Leave-এ ব্যালেন্স নেই; ভুল করে Unpaid দিলে বেতন কাটা যাবে। Type ঠিক আছে কিনা দেখে Approve করো।

## ৩.৪ — নিয়োগ

- আবেদনকারী: **Recruitment → Applications → New**, CV সংযুক্ত
- কার্ড ড্র্যাগ করে পরের Stage-এ নাও, ইন্টারভিউর মন্তব্য লেখো

> Stage বদলানোর সময় তারিখ-সময় মন্তব্যে লিখো — পরে বোঝা যায় কোথায় কত দিন আটকে ছিল।

## ৩.৫ — Expense

- কর্মী: **Expenses → New Expense** → Category, Amount, রসিদের ছবি → **Create Report → Submit**
- Karim: **Expense Reports → Approve**

> রসিদের ছবি ছাড়া Approve করলে পরে Accounts মেলাতে পারবে না। ছবি তোলা থাকলে APPROVE, না থাকলে Refuse — নিয়মটা সবার আগে জানিয়ে দাও।

## ৩.৬ — মেশিন নষ্ট হলে

**Maintenance → New Request** → Equipment, সমস্যা, Priority → Mechanic Assign → কাজ শেষে Stage **Repaired**।

> Priority ঠিক দাও — লাইন বন্ধ করা মেশিন Critical, অফিসের ফ্যান Low। সবাই Critical দিলে কেউ কিছু পাবে না।

## ৩.৭ — গাড়ির লগ

**Fleet → Vehicle → Log Services / Fuel** — তারিখ, কিলোমিটার, খরচ।

## ৩.৮ — Appraisal (সময় এলে)

**Appraisals → New** → Employee, Goals, Feedback → **Confirm → Done**।

## ৩.৯ — Lunch

কর্মী **Lunch → Order** করে; ক্যান্টিন অর্ডার গুনে খাবার পাঠায়।

## দৈনিক রুটিন

| সময় | কাজ |
| --- | --- |
| সকালে | **Attendances** দেখো — কে আসেনি, কে দেরি করেছে |
| সকালে | **Time Off**-এর নতুন আবেদন Approve/Refuse |
| দুপুরে | **Maintenance Request** ধরো — মেকানিক Assign |
| বিকেলে | **Expense Report** Approve, **Recruitment** Applicant আপডেট |

## কোথায় কী করবে

| কাজ | মেনু |
| --- | --- |
| নতুন কর্মী | Employees → New |
| হাজিরা | Attendances → Kiosk / New |
| ছুটি | Time Off → New Time Off |
| ছুটি Approve | Time Off → Management → All Time Off |
| আবেদনকারী | Recruitment → Applications |
| খরচের দাবি | Expenses → New Expense |
| খরচ Approve | Expense Reports |
| মেশিন | Maintenance → New Request |
| গাড়ি | Fleet → Vehicle → Log Services / Fuel |
| মূল্যায়ন | Appraisals → New |
| দুপুরের খাবার | Lunch → Order |

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| ছুটির আবেদন Approve-এ দেখা যাচ্ছে না | All Time Off-এ **To Approve** ফিল্টার; Approver Karim কিনা দেখো |
| Expense Approve বাটন নেই | Expense Report-এ Submit করেছ কিনা; Approver হিসেবে Karim কিনা |
| Maintenance-এ Mechanic বাছা যাচ্ছে না | Maintenance Team-এ মেকানিক যোগ করা আছে কিনা দেখো |
| Kiosk-এ দিনের শেষে Check Out হয়নি | Attendances → New দিয়ে হাতে সময় বসাও |

পরের ধাপে [রিপোর্ট দেখা](/odoo/hrm/reports) — ভাগ ৪, মাসের হিসাব আর Accounts-কে ওভারটাইম রিপোর্ট।
