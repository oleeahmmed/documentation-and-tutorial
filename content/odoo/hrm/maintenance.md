---
title: "ধাপ ১২ — Maintenance (মেশিন)"
description: গার্মেন্টসে মেশিন বন্ধ মানে প্রোডাকশন বন্ধ — Equipment, নষ্ট মেশিনের রিকোয়েস্ট, মেকানিক আর প্রতিরোধমূলক সার্ভিস।
icon: Wrench
---

## গল্প

Juki সেলাই মেশিনের সুই ভেঙেছে — অপারেটর সুপারভাইজারকে বলল, সুপারভাইজার মেকানিককে খুঁজল, মেকানিক অন্য লাইনে ছিল। দুই ঘণ্টা মেশিন বসে থাকল। Maintenance অ্যাপে অপারেটর নিজেই রিকোয়েস্ট খুলবে, মেকানিক অ্যাসাইন হবে, কানবানে অবস্থা দেখা যাবে — কে কখন ঠিক করল, তার রেকর্ডও থাকবে।

## ১২.১ — Equipment Categories

**Maintenance → Configuration → Equipment Categories → New**

| ক্যাটাগরি |
| --- |
| Sewing Machine |
| Cutting Machine |
| Boiler/Generator |
| Iron Table |

ক্যাটাগরি দিয়ে পরে রিপোর্টে বলা যাবে — "এই মাসে সেলাই মেশিনে কতবার সমস্যা হলো"।

## ১২.২ — Equipment যোগ করা

**Maintenance → Equipment → New**

| ফিল্ড | উদাহরণ |
| --- | --- |
| Equipment Name | `Juki Single Needle #101` |
| Equipment Category | Sewing Machine |
| Used By | Department → Sewing |
| Maintenance Team | (থাকলে) Sewing Maintenance |
| Technician | নির্দিষ্ট মেকানিক (থাকলে) |
| Work Location | Factory Floor 2 |

**Product Information ট্যাব:** Vendor, Model, Serial Number, Cost, **Warranty Expiration Date**।

**Maintenance Team** না থাকলে **Configuration → Maintenance Teams**-এ টিম বানাও, সদস্য (মেকানিক) যোগ করো।

> **সিরিয়াল নম্বর:** একই মডেলের ২০০টা মেশিনের মধ্যে কোনটা কোনটা — সিরিয়াল ছাড়া আলাদা করা যাবে না। নামের সাথে নম্বর দাও (`Juki #101`), সিরিয়ালও বসাও।

## ১২.৩ — Maintenance Request (নষ্ট মেশিন)

**Maintenance → Maintenance → Maintenance Requests → New**

1. **Request**: `সুই ভেঙেছে / মোটর ঘুরছে না`
2. **Equipment**: মেশিন বাছো
3. **Maintenance Type**: **Corrective** (নষ্ট হয়ে গেছে)
4. **Maintenance Team** / **Responsible** (মেকানিক) অ্যাসাইন করো
5. **Save** — কানবানে কার্ড আসবে

মেকানিক কাজ শুরু করলে কার্ড **In Progress**-এ, শেষ হলে **Repaired**-এ নেবে। নোটে কী বদলানো হলো লেখো (যেমন `Needle bar replaced`)।

> **কে রিকোয়েস্ট করতে পারবে:** সাধারণ কর্মী শুধু সেই মেশিনে রিকোয়েস্ট করতে পারবে যার Follower সে, অথবা যার Maintenance-এ Equipment Manager অ্যাক্সেস আছে। ফ্লোরের সুপারভাইজারকে Equipment Manager/Follower বানিয়ে দাও।

## ১২.৪ — প্রতিরোধমূলক সার্ভিস (Preventive)

**Maintenance Type: Preventive** দিয়ে রিকোয়েস্ট খোলো, তারপর **Recurrent** টগল চালু করো:

1. **Maintenance → Maintenance → Maintenance Requests → New**
2. Equipment: মেশিন বাছো
3. Maintenance Type: **Preventive**
4. **Recurrent** ✓ → **Repeat Every** `30` **Days**
5. **Until**: `Forever` (অথবা নির্দিষ্ট **End Date**)
6. **Save**

এরপর প্রতি ৩০ দিনে Odoo নিজেই এই রিকোয়েস্টটা নতুন করে খুলে দেবে — মেকানিক কাজ শেষ করে কার্ড বন্ধ করলেও পরের মাসে আবার আসবে।

> **কেন দরকার:** Corrective maintenance মানে মেশিন নষ্ট হওয়ার পরে ঠিক করা — ততক্ষণ প্রোডাকশন বন্ধ। Preventive মানে আগেই তেল/পরিষ্কার/চেক — downtime কমে। গার্মেন্টসে সেলাই মেশিনের জন্য এটা বাদ দিলে চলবে না।

## বাস্তবে কী ঘটে

- রিকোয়েস্ট তৈরি হলে Technician/Team-কে অ্যাসাইন করা যায়; কানবানে সবাই অবস্থা দেখতে পায়
- Repaired হলে মেশিনের "Latest Failure" আপডেট হয়, MTBF (Mean Time Between Failure) হিসাব হয়
- বারবার একই মেশিন নষ্ট হলে MTBF কমে — কোন মেশিন বদলানো দরকার, রিপোর্টে ধরা পড়ে
- Equipment-এ Cost/Warranty থাকলে ওয়ারেন্টির ভেতরে সার্ভিস হলে খরচ হিসাব করতে সুবিধা
- Scrap স্টেজে নিলে মেশিন আর ব্যবহারের তালিকায় থাকে না

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Equipment Categories মেনু নেই | Maintenance অ্যাপ ইনস্টল, Administrator কি না দেখো |
| রিকোয়েস্ট করতে পারছি না | Employee-কে Equipment-এর Follower বানাও, বা Maintenance-এ Equipment Manager দাও |
| কানবানে স্টেজ নেই | Stages কাস্টমাইজ করা আছে কি না দেখো (Configuration) |
| Preventive রিকোয়েস্ট আসছে না | **Recurrent** টগল, Repeat Every ও Until ঠিক আছে কি না দেখো |

## চেকলিস্ট

- [ ] ৪টা Equipment Category
- [ ] মূল মেশিনগুলো Equipment হিসেবে (নম্বর/সিরিয়ালসহ)
- [ ] Maintenance Team + মেকানিক
- [ ] একটা Corrective রিকোয়েস্ট → In Progress → Repaired
- [ ] Preventive রিকোয়েস্ট (Recurrent, প্রতি ৩০ দিন)
- [ ] Follower/অ্যাক্সেস ঠিক করা

এরপর ঐচ্ছিক ক্যান্টিন — [Lunch](/odoo/hrm/lunch)।
