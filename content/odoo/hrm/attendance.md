---
title: "ধাপ ৭ — Attendance (হাজিরা)"
description: কিয়স্ক মোড, Badge/PIN দিয়ে চেক-ইন, ওভারটাইমের হিসাব আর HR-এর জন্য রিপোর্ট।
icon: ClockCheck
---

## গল্প

গেটে একটা ট্যাবলেট বসিয়ে দিলে কর্মী কার্ড ট্যাপ করেই ঢুকবে-বের হবে। HR-কে আর খাতায় টিক দিতে হবে না — কে দেরি করল, কে আসেনি, কার কত ঘণ্টা ওভারটাইম — সব Odoo নিজেই হিসাব করবে। তবে এর আগে কয়েকটা সেটিং ঠিক করতে হবে।

## ৭.১ — সেটিংস

**Attendances → Configuration → Settings**

### Modes

| সেটিং | কী করবে |
| --- | --- |
| **Attendances from Backend** | কর্মী Odoo-র ভেতর থেকেই চেক-ইন/আউট করতে পারবে (অফিস স্টাফদের জন্য) |
| **Automatic Check-Out** | কাজ শেষে ভুলে গেলে নির্দিষ্ট সময় পরে নিজে থেকেই চেক-আউট; সাথে **Tolerance** (ঘণ্টায়) |
| **Absence Management** | ছুটি ছাড়া অনুপস্থিতি হাজিরা রিপোর্টে দেখাবে |

### Kiosk

| সেটিং | কী করবে |
| --- | --- |
| **Kiosk Mode** | `Barcode/RFID`, `Barcode/RFID and Manual Selection`, `Manual Selection` |
| **Barcode Source** | Scanner, Front Camera বা Back Camera |
| **Display Time** | কনফার্মেশন কত সেকেন্ড দেখাবে |
| **Employee PIN Identification** | PIN দিয়ে চেক-ইন বাধ্যতামূলক — কার্ড না থাকলে এটা চালু করো |
| **Attendance Kiosk Url** | গেটের ট্যাবলেটে এই URL খুললেই কিয়স্ক, Odoo লগইন ছাড়াই |

### Extra Hours (ওভারটাইম)

| সেটিং | মান (উদাহরণ) |
| --- | --- |
| **Tolerance Time In Favor Of Company** | ১০ মিনিট — এর কম বাড়তি সময় ওভারটাইমে গোনা হবে না |
| **Tolerance Time In Favor Of Employee** | ১০ মিনিট — এর কম দেরি হলে বেতন কাটবে না |
| **Extra Hours Validation** | **Automatically Approved** বা **Approved by Manager** |
| **Display Extra Hours** | চেক-আউটে কর্মীকে বাড়তি ঘণ্টা দেখাবে |

সব ঠিক করে **Save**।

> **নিরাপত্তা:** কিয়স্ক URL-এ কোনো পাসওয়ার্ড নেই — যার URL আছে সে কিয়স্ক খুলতে পারে। লিংক বাইরে ছড়ালে Settings-এ **Generate new URL** চেপে নতুনটা নাও, পুরোনোটা বাতিল হয়ে যাবে।

## ৭.২ — কীভাবে কাজ করে

1. ফ্যাক্টরির গেটে একটা ট্যাবলেট/কম্পিউটারে **Attendances → Kiosk Mode** (উপরের মেনু) খুলে রাখো — অথবা Settings-এর **Attendance Kiosk Url** ব্রাউজারে খোলো
2. কর্মী ঢুকে Badge (কার্ড/বারকোড) স্ক্যান করবে বা PIN দেবে → **Check In**
3. বের হওয়ার সময় আবার স্ক্যান/PIN → **Check Out**
4. HR-এর জন্য: **Attendances → Reporting** বা Attendances লিস্টে দিনের তালিকা — কে দেরিতে এল, কে আসেনি, কার কত ঘণ্টা

> **প্রথম দিনের টিপস:** কিয়স্কে ৫–১০ জনকে দিয়ে টেস্ট করো — কার্ড পড়ছে কি না, PIN কাজ করছে কি না, Check In/Out-এ নাম ঠিক দেখাচ্ছে কি না। সব ঠিক থাকলে বাকিদের মেসেজ দাও, নাহলে গেটে লাইন পড়ে যাবে।

## ৭.৩ — ওভারটাইম ও বেতন

আইন অনুযায়ী সাধারণত স্বাভাবিক মজুরির **দ্বিগুণ হারে** ওভারটাইম দিতে হয়। Odoo ঘণ্টাগুলো গণনা করে দেয় — Work Schedule-এর বাইরের সময়, Tolerance বাদ দিয়ে, Extra Hours হিসেবে জমা হয়।

- Manager-approval চালু থাকলে করিম স্যার অনুমোদন করবেন
- মাসের শেষে Attendances → Reporting থেকে ঘণ্টার রিপোর্ট বের করে Accounts-কে দাও
- বেতনে ঘণ্টা × রেট বসিয়ে Payslip বানানো **Payroll মডিউল** বা আলাদা শিটের কাজ — এই সেকশনের বাইরে

> **কেন Schedule ঠিক থাকা জরুরি:** Attendance ওভারটাইম হিসাব করে Employee-র Working Hours ধরে। Rina-র Work Information-এ `General Shift 8am-5pm` সেট না থাকলে ওভারটাইমের হিসাবই ভুল হবে।

## বাস্তবে কী ঘটে

- কিয়স্কে Check In হলে সাথে সাথে Attendance রেকর্ড তৈরি হয় — ইন্টারনেট থাকলেই
- Attendance from Backend বন্ধ থাকলে অফিস স্টাফও কিয়স্ক ছাড়া চেক-ইন করতে পারবে না
- Automatic Check-Out চালু থাকলে ভুলে যাওয়া চেক-আউট নিজে থেকে হয়ে যায়
- Absence Management চালু থাকলে ছুটি ছাড়া অনুপস্থিত দিনগুলো রিপোর্টে লাল দেখায়
- PIN/Badge ছাড়া কেউ চেক-ইন করতে পারবে না (Kiosk Mode অনুযায়ী Manual Selection থাকলে নাম খুঁজে বেছে নিতে পারবে — দুর্বল নিয়ন্ত্রণ)

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| কিয়স্কে কার্ড পড়ছে না | Barcode Source (Scanner/Camera) আর কার্ডের RFID নম্বর Employee-এ বসানো আছে কি না দেখো |
| PIN ঢুকছে না | Employee-র HR Settings-এ **PIN Code** আছে কি না, Kiosk Settings-এ **Employee PIN Identification** চালু কি না |
| কিয়স্কে কর্মীর নাম নেই | কর্মীর Department/Company ফিল্টার, আর Employee রেকর্ড Active কি না দেখো |
| ওভারটাইম আসছে না | Work Schedule সেট আছে কি না, Extra Hours Validation, Tolerance মান দেখো |
| ভুল দিনের হাজিরা | Attendances লিস্টে রেকর্ড খুলে হাতে ঠিক করো, তারপর Save — অডিটের জন্য কারণ লিখে রাখো |

## চেকলিস্ট

- [ ] Attendances Settings-এ Kiosk Mode + Barcode/PIN
- [ ] Employee PIN/Badge নম্বর বসানো
- [ ] Extra Hours + Tolerance
- [ ] কিয়স্ক ট্যাবলেটে URL/Mode চালু, টেস্ট করা
- [ ] Reporting-এ দিনের হাজিরা দেখা
- [ ] মাসিক ওভারটাইম রিপোর্ট বের করা

এরপর নিয়োগ — [Recruitment](/odoo/hrm/recruitment)।
