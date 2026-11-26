---
title: "Employees সেটিংস"
description: "ভাগ ১ — Work Location, Department, Job Position, শিফট, Skill Type, Departure Reason আর Tag — কর্মী ঢোকানোর আগে সব ভিত্তি।"
icon: UsersRound
---

## গল্প

কর্মী ঢোকানোর আগে ফ্যাক্টরির "খাপ" বানাতে হবে — কোন কোন Department, কার কী পদ, কে কখন কাজ করে, কোন মেশিনে কার দক্ষতা। আগে না বানালে Employee ফর্মের ড্রপডাউন খালি থাকবে, Import-ও আটকে যাবে।

## (ক) Settings চেক

**Employees → Configuration → Settings** — **Skills Management** চালু রাখো (Sewing-এর দক্ষতা ট্র্যাক করার জন্য)। **Save**।

> Skills Management বন্ধ থাকলে Employee ফর্মে Resume/Skills ট্যাব আসবে না, `Single Needle - Expert`-এর মতো তথ্য রাখা যাবে না।

## (খ) Work Locations

**Employees → Configuration → Work Locations → New** — একটা একটা করে:

| Work Location |
| --- |
| Factory Floor 1 |
| Factory Floor 2 |
| Cutting Section |
| Head Office |
| Store |

## (গ) Departments (Manager এখন ফাঁকা)

**Employees → Configuration → Departments → New**

| Department | Parent |
| --- | --- |
| Production | none |
| Cutting | Production |
| Sewing | Production |
| Finishing | Production |
| Quality Control | none |
| Packing | Production |
| Store & Logistics | none |
| Merchandising | none |
| Accounts | none |
| HR & Admin | none |

> **Manager ঘরটা এখন ফাঁকা রাখো।** কর্মী তৈরি হওয়ার পর ফিরে এসে বসাবে ([কর্মী Entry](/odoo/hrm/employee-entry) পেজে)। Parent দিলে Departments-এর hierarchy view গাছের মতো দেখাবে।

## (ঘ) Job Positions

**Employees → Configuration → Job Positions → New** — প্রতিটাতে Department বসাও:

| Job Position | Department |
| --- | --- |
| Sewing Operator | Sewing |
| Senior Sewing Operator | Sewing |
| Line Chief | Sewing |
| Supervisor | Production |
| Cutting Master | Cutting |
| Cutter | Cutting |
| QC Inspector | Quality Control |
| Iron Man | Finishing |
| Packing Man | Packing |
| Store Keeper | Store & Logistics |
| Merchandiser | Merchandising |
| Accountant | Accounts |
| HR Executive | HR & Admin |
| Mechanic | Maintenance-সংশ্লিষ্ট (না থাকলে Production) |
| Driver | Store & Logistics |

> বানান হুবহু এক রাখো — `Sewing Operator` আর `Sewing operator` আলাদা পদ হয়ে যাবে, পরে রিপোর্টে দুইটা লাইন দেখাবে।

## (ঙ) Working Schedule

**Employees → Configuration → Working Schedules** (পুরোনো পথ: Settings → Technical)

নতুন: `General Shift 8am-5pm`

| ফিল্ড | মান |
| --- | --- |
| Timezone | **Asia/Dhaka** |
| সোম–শনি | ৮:০০–১২:০০ এবং ১:০০–৫:০০ |
| শুক্রবার | কোনো লাইন নেই |
| মোট | দিনে ৮ ঘণ্টা (১ ঘণ্টা বিরতি) |

Night Shift থাকলে `Night Shift` নামে আলাদা Schedule বানাও।

> Attendances এই Schedule দেখে হিসাব করে কে দেরি করেছে, কে আগে গেছে, কত ঘণ্টা Overtime হলো। Schedule ভুল থাকলে হাজিরার হিসাবও ভুল হবে।

## (চ) Skill Types

Skills চালু থাকলে **Employees → Configuration → Skill Types → New**:

| Skill Type | Skills | Levels |
| --- | --- | --- |
| Machine Skills | Single Needle, Overlock, Flatlock, Button Hole | Beginner, Intermediate, Expert |

## (ছ) Departure Reasons

**Employees → Configuration → Departure Reasons** — `Resigned`, `Terminated`, `Retired`, `Absconded`, `End of Contract`।

## (জ) Employee Tags (ঐচ্ছিক)

**Employees → Configuration → Employee Tags** — `Permanent`, `Casual`, `Probation`, `Female`, `Night Shift`।

> Tag দিয়ে পরে ফিল্টার/Group By করা যায় — যেমন শুধু Probation কর্মীদের তালিকা, বা Night Shift-এ কতজন।

## বাস্তবে কী ঘটে

- Department-এর Parent সেট করলে Org Chart আর hierarchy view নিজে থেকেই গাছ বানায়
- Job Position-এ Department বসানো থাকলে Employee-তে পদ বাছলেই Department বসে যেতে পারে
- Working Schedule না দিলে কোম্পানির ডিফল্ট Schedule বসে — ভুল শিফটে থেকে দেরি/ওভারটাইমের হিসাব নষ্ট হতে পারে
- Skill Type একবার বানালে সব কর্মীর Resume ট্যাবে সেই দক্ষতাগুলোই বাছা যাবে

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Configuration মেনুতে Departments নেই | Employees অ্যাপ ইনস্টল/আপগ্রেড করো; Odoo 19-এ Departments সরাসরি Employees মেনুতে |
| Working Schedules দেখা যাচ্ছে না | Developer Mode চালু করো; পুরোনো ভার্সনে Settings → Technical |
| Skills ট্যাব নেই | Configuration → Settings → Skills Management চালু করো |
| Department ডুপ্লিকেট হয়ে গেছে | Employees-এ Group By Department করে একই নাম খুঁজে একটা Archive করো |

## চেকলিস্ট

- [ ] Skills Management চালু
- [ ] ৫টা Work Location
- [ ] ১০টা Department (Parent সহ, Manager ফাঁকা)
- [ ] ১৫টা Job Position + Department
- [ ] `General Shift 8am-5pm`, Asia/Dhaka, শুক্রবার বন্ধ
- [ ] Skill Type: Machine Skills (৪টা Skill, ৩ Level)
- [ ] ৫টা Departure Reason
- [ ] Tags (ঐচ্ছিক)

পরের ধাপে [Time Off সেটিংস](/odoo/hrm/time-off) — ছুটির ধরন, সরকারি ছুটি আর বছরে জমার নিয়ম।
