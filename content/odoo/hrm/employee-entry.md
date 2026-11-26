---
title: "কর্মী Entry ও Import"
description: "ভাগ ২ — Rina Akter-কে হাতে Entry, Excel দিয়ে বাকি কর্মীদের Import, তারপর একবারের জোড়া লাগানোর কাজ।"
icon: UserPlus
---

## গল্প

সেটিংস শেষ — এখন ফ্যাক্টরির আসল কর্মীরা Odoo-তে ঢুকবে। আগে একজনকে হাতে দিয়ে দেখব ফর্মটা ঠিকঠাক কাজ করছে; তারপর Excel দিয়ে বাকি সবাই। ভাগ ২ একবারের কাজ — একবার শেষ হলে আর ফিরতে হবে না।

## ২.১ — একজনকে হাতে Entry দিয়ে টেস্ট

**Employees → New** — Sewing Operator **Rina Akter**।

| সেকশন | তথ্য |
| --- | --- |
| **উপরে** | Name `Rina Akter`, Job Position `Sewing Operator`, Mobile |
| **Work Information** | Department `Sewing`, Working Hours `General Shift 8am-5pm`, Work Location `Factory Floor 2`, Timezone `Asia/Dhaka` |
| **Private Information** | NID, ঠিকানা, ব্যাংক/bKash, জরুরি যোগাযোগ |
| **HR Settings** | Badge ID/PIN (যেমন `1001`) |
| **Resume/Skills** | `Single Needle - Expert` |

**Save**। সব ঠিক থাকলে এবার সবাইকে Import।

> **কেন আগে একজন?** Import করার আগে ফর্মের প্রতিটা ফিল্ড, Department-এর নাম, Shift, PIN ঠিক আছে কিনা যাচাই হয়ে যায়। ভুল ধরা পড়লে একজনের রেকর্ড ঠিক করা সহজ — ৩০০ জনের নয়।

## ২.২ — Excel দিয়ে Import

Excel বানাও, কলামগুলো:

| Employee Name | Department | Job Position | Work Mobile | Working Hours | Work Location | Badge ID | Identification No | Private Phone |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

> **লক্ষ্য রাখো:** Department ও Job Position-এর নাম **হুবহু** Odoo-র নামের সাথে মিলতে হবে — বানান, বড়-ছোট হাতের অক্ষর। এক অক্ষর আলাদা হলেও Odoo সেটাকে নতুন হিসেবে ধরবে বা এরর দেবে।

Import করার ধাপ:

1. **Employees** লিস্ট ভিউ খোলো
2. **Favorites** বাটনের পাশে গিয়ার আইকন → **Import records**
3. Excel/CSV আপলোড করো
4. ডানে কলাম ম্যাপিং ঠিক আছে কিনা দেখো — Excel-এর কোন কলাম Odoo-র কোন ফিল্ডে যাবে
5. **Test** → ত্রুটি না থাকলে **Import**
6. প্রথমে **২০ জন** দিয়ে টেস্ট, ঠিক থাকলে বাকিরা

> Import-এ ভুল থাকলে Odoo একটা ডাউনলোডযোগ্য ফাইল দেয় — কোন সারিতে কী সমস্যা লেখা থাকে। ওটা ঠিক করে আবার Test করো; সরাসরি Import করে ভুল ডেটা ঢুকিয়ে দিও না।

## ২.৩ — Import-এর পরে একবারের "জোড়া লাগানো" কাজ

এগুলো Settings নয় — কর্মী তৈরি হওয়ার পরে যা করা সম্ভব:

### (ক) Department Manager বসানো

**Employees → Departments** → প্রতিটা খুলে **Manager** ঘরে নাম বসাও। এরপর **Employees → Org Chart** দেখো।

### (খ) প্রতি কর্মীর Manager/Coach

Employees লিস্টে **Group by Department** → Manager কলামে লাইন চিফ বসাও।

### (গ) ছুটির বরাদ্দ (Allocation), একবারেই সবার জন্য

**Time Off → Management → Allocations → New**

| Type | Allocation | মান |
| --- | --- | --- |
| Casual Leave | By Company | ১০ দিন → Confirm → Validate |
| Sick Leave | By Company | ১৪ দিন → Confirm → Validate |
| Annual Leave | Accrual, Plan `Annual Leave Plan` | By Company → Validate |

### (ঘ) Fleet-এ Driver

**Fleet** → প্রতিটা গাড়ি → **Driver** ঘরে কর্মী বসাও; ইনসুরেন্স/ট্যাক্স টোকেনের মেয়াদ সহ **Contract** যোগ করো।

### (ঙ) Maintenance-এ Equipment

**Maintenance → Equipment → New** — `Juki Single Needle #101` ... সব মেশিন, Category/Department/Owner সহ। চাইলে Excel Import করো। **Maintenance Team**-এ মেকানিকদের যোগ করো।

### (চ) User (শুধু অফিস স্টাফদের)

Accountant/Merchandiser যারা Odoo-তে ঢুকবে (Expense, Leave নিজে আবেদন করবে) — তাদের Employee-তে **Related User** জুড়ো।

> **এই ধাপের পর আর কোনো Settings-এ ফিরবে না** — বছরে একবার নতুন Public Holiday ও Allocation বাদে। এরপর থেকে শুধু ভাগ ৩-এর দৈনিক কাজ।

## বাস্তবে কী ঘটে

- Employee তৈরি হলে Attendance, Time Off, Expense — সব অ্যাপে সে নিজে থেকেই দেখা যায়
- Department-এ Manager বসালে সে ওই Department-এর ছুটি/খরচ অনুমোদন করতে পারে (অ্যাপের সেটিং অনুযায়ী)
- Import-এ Department ভুল বানানে দিলে Odoo নতুন Department বানিয়ে ফেলতে পারে — Import-এর পর Departments-এ ডুপ্লিকেট খুঁজে দেখো
- Related User না দিলে কর্মী নিজে Odoo-তে ঢুকতে পারবে না; ফ্লোরের অপারেটরদের User লাগবে না

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Import-এ "Invalid field" | কলাম ম্যাপিং-এ সেই কলাম ফাঁকা করো বা সঠিক ফিল্ড বাছো |
| Department খুঁজে পাচ্ছে না | Employees → Departments-এ নাম হুবহু মিলিয়ে দেখো |
| Attendance Kiosk-এ PIN কাজ করছে না | HR Settings ট্যাবে PIN Code সেভ হয়েছে কিনা দেখো |
| Allocation দেওয়ার পরও আবেদন হচ্ছে না | Time Off Type-এ Allow Employee Requests চালু কিনা দেখো |
| ছুটির ব্যালেন্স দেখাচ্ছে না | Allocation-এ Confirm/Validate করেছ কিনা দেখো |

## চেকলিস্ট

- [ ] Rina Akter হাতে Entry (PIN 1001, Single Needle - Expert)
- [ ] Excel তৈরি — ৯টা কলাম, নাম হুবহু
- [ ] ২০ জনে Test → Import → বাকিরা
- [ ] Departments-এ Manager + Org Chart
- [ ] Casual ১০, Sick ১৪, Annual Accrual Allocation
- [ ] গাড়িতে Driver + Contract, Equipment + Team
- [ ] অফিস স্টাফদের Related User

পরের ধাপে [প্রতিদিনের Entry](/odoo/hrm/daily-entry) — ভাগ ৩, এখন থেকে শুধু ডেটা ঢোকানো।
