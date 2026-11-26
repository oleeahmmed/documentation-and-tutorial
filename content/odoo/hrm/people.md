---
title: "ধাপ ৫ — Department থেকে Employee"
description: করিম স্যারের প্রথম কাজ — ৯টা Department, ১১টা Job Position, ৮টা–৫টার শিফট, তারপর ৩০০ কর্মীর ডেটা।
icon: UsersRound
---

## গল্প

ফ্যাক্টরির কাঠামোটা আগে দাঁড় করাতে হবে — কোন কোন Department, কার কী পদ, কে কখন কাজ করে। তারপর কর্মী ঢোকাব। এই ক্রমটা উল্টালে সমস্যা: কর্মী বানানোর সময় Department আর Job Position ড্রপডাউনে না পেলে আটকে যাবে।

## ৫.১ — Department বানানো

**Employees → Departments → New** (অথবা Departments পেজে কানবান ভিউয়ের নিচে **New**)

একটা একটা করে বানাও:

| Department | Manager (পরে বসাবে) |
| --- | --- |
| Cutting | Cutting Manager |
| Sewing | Production Manager |
| Finishing | |
| Quality Control | |
| Packing | |
| Store & Logistics | |
| Merchandising | |
| Accounts | |
| HR & Admin | Karim Hossain |

> **Manager ঘরটা এখন ফাঁকা রাখো।** কর্মী তৈরি হওয়ার পর ফিরে এসে বসাবে।
>
> চাইলে **Parent Department** দিয়ে hierarchy বানাতে পারো (যেমন "Production"-এর নিচে Cutting, Sewing, Finishing)। Departments ড্যাশবোর্ডে **hierarchy view** বেছে নিলে গাছের মতো দেখা যাবে; পূর্ণ Org Chart Enterprise/Online-এ পাওয়া যায়।

## ৫.২ — Job Position (পদবি) বানানো

**Employees → Configuration → Recruitment → Job Positions → New** (Recruitment অ্যাপ ইনস্টল থাকলে **Recruitment → Configuration → Job Positions**-ও একই জায়গা)

যেমন: `Sewing Operator`, `Senior Sewing Operator`, `Line Chief`, `Supervisor`, `Cutting Master`, `QC Inspector`, `Packing Man`, `Store Keeper`, `Merchandiser`, `Accountant`, `HR Executive`।

প্রতিটাতে লেখো:

- **Job Position** নাম
- **Department**
- **Expected New Employees** (কতজন লাগবে)

> **টিপস:** নামের বানান একদম একই রাখো — `Sewing Operator` আর `Sewing operator` আলাদা পদ হয়ে যাবে, পরে রিপোর্টে দুইটা লাইন দেখাবে।

## ৫.৩ — Work Schedule (কাজের সময়সূচি)

**Employees → Configuration → Employee → Working Schedules**

> Odoo 19-এ Developer Mode লাগে না। পুরোনো সংস্করণে `Settings → Technical → Working Schedules` পথেও পাওয়া যেত।

এখানে `Standard 40 Hours/Week` বদলে নিজের নিয়ম বসাও:

- নাম: `General Shift 8am-5pm`
- সোম–শনি সকাল ৮:০০–১২:০০ এবং দুপুর ১:০০–৫:০০ (মোট ৮ ঘণ্টা, ১ ঘণ্টা বিরতি)
- **শুক্রবার: কোনো লাইন নেই** (সাপ্তাহিক ছুটি)
- Timezone: **Asia/Dhaka**

যদি Night Shift থাকে, আলাদা Schedule বানাও (`Night Shift 8pm-5am`)। Guards বা Security-দের জন্য আলাদা Schedule লাগবে — এক শিফটে সবাইকে ঢুকিয়ে দিও না।

> **কেন সময়সূচি আগে?** Attendances এই Schedule দেখে হিসাব করে কে দেরি করেছে, কে আগে গেছে, কত ঘণ্টা ওভারটাইম হলো। Schedule ভুল থাকলে হাজিরার হিসাবও ভুল হবে।

## ৫.৪ — Employee যোগ করা

**Employees → Employees → New** — প্রথমে এক জনকে দিয়ে প্র্যাকটিস করি: Sewing Operator **Rina Akter**।

**উপরের অংশ:**

- Employee's Name: `Rina Akter`
- Job Position: `Sewing Operator`
- Work Mobile / Work Email / Work Phone

**Work Information ট্যাব:**

- Department: `Sewing`
- Manager: তার লাইন চিফ (তৈরি হলে)
- Work Location: `Factory Floor 2` (না থাকলে `Employees → Configuration → Employee → Work Locations`-এ নতুন বানাও)
- Working Hours: `General Shift 8am-5pm`
- Timezone: `Asia/Dhaka`

**Private Information ট্যাব:**

- ঠিকানা, জন্মতারিখ, NID নম্বর (Identification No.), বৈবাহিক অবস্থা
- ব্যাংক/bKash অ্যাকাউন্ট (বেতন দেওয়ার জন্য)
- জরুরি যোগাযোগ

**HR Settings ট্যাব:**

- **PIN Code** — কিয়স্কে হাজিরার জন্য (৪–৬ ডিজিট, অনুমান করা কঠিন এমন)
- **RFID/Badge Number** — কার্ড থাকলে **Generate** চেপে নম্বর বানাও, চাইলে ব্যাজ প্রিন্টও করা যায়
- **User** — অফিসের কর্মী হলে login দিতে চাইলে এখানে User জুড়ো; ফ্লোরের অপারেটরের User লাগবে না

**Resume ট্যাব:** আগের কাজের অভিজ্ঞতা, দক্ষতা (Skills: `Single Needle`, `Overlock`, `Flatlock` ইত্যাদি)। Resume ট্যাব না দেখলে `Employees → Configuration → Settings`-এ **Skills Management** চালু করো।

**Save**।

## ৩০০ জনকে এক একজন করে নয় — Excel Import

1. Excel বানাও (Name, Identification No, Department, Job Position, Work Mobile ইত্যাদি কলাম)
2. **Employees → Employees** লিস্টে গিয়ে **Favorites → Import records**
3. ফাইল আপলোড → **Test** → কোনো এরর নেই দেখলে **Import**

> **প্রথমে ২০–৩০ জন দিয়ে টেস্ট করো।** ঠিকঠাক আসলে বাকিদের ঢোকাও। Department আর Job Position-এর নাম Excel-এ হুবহু Odoo-র নামের মতো লিখো — নাহলে Import নতুন Department বানিয়ে ফেলবে বা এরর দেবে।

এরপর ফিরে গিয়ে Department-এর Manager ঘরগুলো পূরণ করো, Departments-এর hierarchy view চেক করো।

## বাস্তবে কী ঘটে

- Employee তৈরি হলে Attendance, Time Off, Expense — সব অ্যাপে সে নিজে থেকেই দেখা যায়
- Department-এ Manager বসালে সে ওই Department-এর ছুটি/খরচ অনুমোদন করতে পারবে (অ্যাপের সেটিং অনুযায়ী)
- Parent Department সেট করলে Departments-এর hierarchy view স্বয়ংক্রিয়ভাবে গাছ বানায়
- Working Hours না দিলে কোম্পানির ডিফল্ট Schedule বসে — ভুল শিফটে থেকে হিসাব নষ্ট হতে পারে
- Import-এ ভুল হলে ফাইল ডাউনলোড করে এরর কলাম দেখে ঠিক করে আবার Test করো — সরাসরি Import করলে ভুল ডেটা ঢুকে যাবে

## চেকলিস্ট

- [ ] ৯টা Department (Manager পরে)
- [ ] ১১টা Job Position + Expected New Employees
- [ ] `General Shift 8am-5pm` + শুক্রবার বন্ধ + Asia/Dhaka
- [ ] Rina Akter-এর প্রোফাইল (PIN/Badge, Resume)
- [ ] Excel Import দিয়ে বাকি কর্মী
- [ ] Department-এর Manager পূরণ
- [ ] Departments-এর hierarchy view চেক

এবার ছুটির ব্যবস্থা — [Time Off](/odoo/hrm/time-off)।
