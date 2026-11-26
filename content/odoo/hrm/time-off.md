---
title: "ধাপ ৬ — Time Off (ছুটি)"
description: সরকারি ছুটি, ছুটির ধরন, সবাইকে বরাদ্দ, অর্জিত ছুটির Accrual Plan — আর কর্মীর আবেদন থেকে অনুমোদন পর্যন্ত।
icon: CalendarOff
---

## গল্প

৩০০ জনের ছুটির হিসাব খাতায় রাখা অসম্ভব — কে কত দিন নিয়েছে, কার কত বাকি, কে একসাথে ছুটি নিচে প্রোডাকশন বন্ধ করার উপক্রম। Odoo-র **Time Off** অ্যাপ এই পুরোটা সামলায়: সরকারি ছুটি, ছুটির ধরন, বার্ষিক বরাদ্দ, আবেদন আর অনুমোদন।

সম্পূর্ণ কাজটাই **Time Off** অ্যাপ থেকে — করিম স্যার লগইন করা অবস্থায়।

## ৬.১ — সরকারি ছুটি (Public Holidays)

**Time Off → Configuration → Public Holidays → New**

লিস্ট ভিউয়ে **New** চাপলে নিচে নতুন লাইন আসবে — Name, Start Date, End Date বসাও:

| ছুটি | তারিখ |
| --- | --- |
| Eid-ul-Fitr | সরকারি ঘোষণা অনুযায়ী (২–৩ দিন) |
| Eid-ul-Adha | সরকারি ঘোষণা অনুযায়ী (২–৩ দিন) |
| Pohela Boishakh | ১৪ এপ্রিল |
| Shaheed Day | ২১ ফেব্রুয়ারি |
| Independence Day | ২৬ মার্চ |
| Victory Day | ১৬ ডিসেম্বর |
| Durga Puja | ঘোষণা অনুযায়ী |
| Buddha Purnima | ঘোষণা অনুযায়ী |

- Start Date-এ `12:00 AM`, End Date-এ `11:59 PM` রাখো — এতে সব শিফটের কর্মীই ছুটি পান
- **Working Hours** ফাঁকা রাখলে সবাই এ ছুটি পাবে; নির্দিষ্ট শিফটে সীমাবদ্ধ করতে চাইলে Schedule বাছো

> **ঈদের তারিখ:** বছরে বছরে সরকারি ঘোষণা অনুযায়ী বদলায়, তাই ঘোষণার পর আপডেট করো। ভুল তারিখে ছুটি বসলে Attendance ও বেতনের হিসাবে গরমিল হবে।

## ৬.২ — ছুটির ধরন (Time Off Types)

**Time Off → Configuration → Time Off Types → New**

| Name | Approval | Requires allocation | নোট |
| --- | --- | --- | --- |
| Casual Leave | By Time Off Officer | ✓ | ১০ দিন |
| Sick Leave | By Time Off Officer | ✓ | **Require Supporting Document** চালু (ডাক্তারের সার্টিফিকেট) |
| Annual (Earned) Leave | By Time Off Officer | ✓ | Accrual Plan দিয়ে বাড়বে |
| Maternity Leave | By Time Off Officer | ✓ | ১১২ দিন (১৬ সপ্তাহ) |
| Unpaid Leave | By Time Off Officer | ✗ | বরাদ্দের সীমা নেই, বেতন কাটা যাবে |

প্রতিটা টাইপে খেয়াল করো:

- **Duration Type = Day** (Odoo 17/18-এ এটার নাম ছিল "Kind of Time Off")
- **Count as = Absence** — ছুটির দিনকে কাজের সময় হিসেবে গোনা হবে না
- **Notify HR** — কে অনুমোদন করবেন (Time Off Officer = করিম স্যার)
- **Requires allocation** চালু থাকলে বরাদ্দ ছাড়া কেউ আবেদন করতে পারবে না

> **Odoo 19-এর নাম বদল:** আগের "Allow employees to request" চেকবক্সটা এখন **Allocation Requests** সেকশনের ভেতরে — আগে **Requires allocation** চালু করো, তারপর **Allow Employee Requests** (বরাদ্দের বেশি চাইতে দেবে কি না)। Unpaid-এর মতো টাইপে Requires allocation বন্ধ রাখলে কোনো সীমাই থাকবে না।

## ৬.৩ — Allocations (প্রত্যেকের ছুটির হিসাব)

### সবাইকে একসাথে

**Time Off → Management → Allocations** → **New Group Allocation**

- **Grant**: **By Company** বা **By Department** (সব Sewing কর্মীকে একসাথে দিতে চাইলে By Department → Sewing)
- Time Off Type: `Casual Leave`
- Allocation Type: **Regular Allocation** (একবারে দেওয়া)
- Validity Period: ১ জানুয়ারি – ৩১ ডিসেম্বর
- Allocation: `10 days`

সেভ করে **Allocate Time Off** → Generated Allocations পেজে সবাইকে দেওয়া হয়েছে কি না দেখো। Sick Leave-এর জন্যও একইভাবে ১৪ দিন।

> **একজনকে আলাদা দিতে:** Management → Allocations → **New** → Employee বাছো। মাঝপথে যোগ দেওয়া কর্মীর ক্ষেত্রে এটাই লাগবে — Group Allocation শুধু তখনকার কর্মীদের ওপর হয়।

### Annual Leave — Accrual Plan (১৮ দিনে ১ দিন)

**Time Off → Configuration → Accrual Plans → New**

| ফিল্ড | মান |
| --- | --- |
| Title | `Annual Leave Plan` |
| When the time is accrued | At the start of the accrual period |
| Based on worked time | Yes (ছুটির দিন বাদে কাজের দিনেই জমবে) |
| Carry over | Lost বা Up to (কোম্পানির নিয়ম) |

তারপর **Create a milestone**:

- **Set the employee accrual frequency**: `1.5 Day(s)` / `Monthly` (মোটামুটি বছরে ১৮ দিন)
- **This milestone will be reached**: At allocation creation

সেভ করে এখন Allocation-এ যাও → Allocation Type = **Accrual Allocation** → Accrual Plan = `Annual Leave Plan`।

> আইনে "১৮ দিন কাজে ১ দিন" — মাসে গড়ে প্রায় ১.৫ দিন। কেউ যদি দিন-ভিত্তিক হিসাব চায়, milestone-এ `Per Hour Worked`/`Daily` অপশনও আছে; তবে বাস্তবে মাসিক হিসাবই সবচেয়ে সহজ।

## ৬.৪ — আবেদন ও অনুমোদন (দৈনন্দিন কাজ)

**কর্মীর দিক থেকে:**

1. **Time Off → My Time → New Time Off**
2. Type, From–To তারিখ, কারণ লেখো
3. **Submit** (Sick হলে ডাক্তারের সার্টিফিকেট আপলোড)

**করিম স্যারের দিক থেকে:**

1. **Time Off → Management → Time Off** → ফিল্টার **To Approve**
2. রিকোয়েস্টে ক্লিক → **Approve** (বা **Refuse**, কারণ লিখে)
3. দুই ধাপের অনুমোদন থাকলে আগে **Approve**, পরে **Validate**

**Overview** মেনুতে ক্যালেন্ডারে দেখা যাবে কে কবে ছুটিতে, কোন Department-এ কতজন নেই — নিচের Total লাইনে প্রতিদিন কতজন বাইরে থাকবে তার গ্রাফ।

> **প্রোডাকশন প্ল্যানিং:** Sewing-এর ৫০ জন একসাথে Approved হয়ে গেলে মেশিন বসে থাকবে। Overview-তে দিনভিত্তিক মোট দেখে ঠিক করো — একই দিনে এক Department-এর নির্দিষ্ট সংখ্যার বেশি ছুটি অনুমোদন করবে না।

## বাস্তবে কী ঘটে

- Public Holiday থাকলে ছুটির আবেদনের দিনসংখ্যা নিজে থেকেই কমে (ছুটির টাইপে Ignore Public Holidays সেটিং অনুযায়ী)
- Requires allocation চালু থাকলে বরাদ্দ শেষে আর আবেদন করা যায় না (Allow Negative Cap চালু না থাকলে)
- Accrual Allocation ধীরে ধীরে বাড়ে — আগামী মাসের ছুটি এই মাসেই চাইলে ব্যালেন্স নেগেটিভ হতে পারে
- Approve হলে Attendance-এ ওই দিন "ছুটি" হিসেবে দেখাবে, কাজের ঘণ্টা হিসেবে গোনা হবে না
- Refuse করলে কর্মী নোটিফিকেশন পায় (Discuss/ইমেইল সেটআপ থাকলে)

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Time Off Types মেনু নেই | করিমের Time Off অ্যাপে Administrator আছে কি না দেখো |
| বরাদ্দ দেওয়ার পরও ব্যালেন্স ০ | Allocation **Validate/Approve** করেছ কি না দেখো; Validity Period চলছে কি না |
| Accrual বাড়ছে না | Milestone আছে কি না, Start Date অতীতে কি না, টাইপের Count as ঠিক কি না |
| আবেদনে "No allocation" এরর | Requires allocation চালু কিন্তু বরাদ্দ নেই — Allocation দাও, নয়তো Allow Employee Requests চালু করো |
| Overview-তে কেউ নেই | Overview-তে করিমের টিম ফিল্টার দেখো; Employee-র Manager সেট আছে কি না |

## চেকলিস্ট

- [ ] বছরের Public Holidays (ঈদ পরে আপডেট)
- [ ] ৫টা Time Off Type (Duration Type = Day)
- [ ] Sick-এ Supporting Document চালু
- [ ] Casual ১০, Sick ১৪ — Group Allocation + Validate
- [ ] Annual-এর Accrual Plan + Milestone
- [ ] Maternity ১১২ দিন, Unpaid বরাদ্দ-মুক্ত
- [ ] একটা টেস্ট আবেদন → Approve → Overview-তে দেখা

এরপর হাজিরা — [Attendance](/odoo/hrm/attendance)।
