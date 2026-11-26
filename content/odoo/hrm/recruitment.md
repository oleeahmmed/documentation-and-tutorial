---
title: "ধাপ ৮ — Recruitment (নিয়োগ)"
description: ৫০ জন Sewing Operator লাগবে — জব পোস্ট থেকে Applicant পাইপলাইন, ইন্টারভিউ, শেষে এক ক্লিকে Employee।
icon: UserSearch
---

## গল্প

Sewing লাইনে ৫০ জন Sewing Operator দরকার। করিম স্যার এক জায়গা থেকে জব পোস্ট করবেন, আবেদনকারীদের কার্ড ধরে ধরে এক স্টেজ থেকে আরেক স্টেজে নেবেন, আর যাকে নেবেন তাকে Employee-ও বানিয়ে ফেলবেন। কাগজের CV আর ফেসবুক ইনবক্সে আলাদা খাতা রাখতে হবে না।

## ৮.১ — Job Position পোস্ট করা

1. **Recruitment → Applications → By Job Positions → New**
2. ফিল্ডগুলো:

| ফিল্ড | মান |
| --- | --- |
| Job Position | `Sewing Operator` |
| Department | `Sewing` |
| Recruiter | `Karim Hossain` |
| Expected New Employees | 50 |
| Job Location | Factory (থাকলে) |
| Employment Type | Full-time |

3. **Save**

> **Website অ্যাপ থাকলে:** জব ফর্মের উপরে **Publish** চাপলে কোম্পানির সাইটের `/jobs` পেজে ভ্যাকেন্সি দেখাবে, আর আবেদনের ফর্মও তৈরি হবে। Website না থাকলে জবের শেয়ারযোগ্য লিংকটা ফেসবুক/ক্লাসিফায়েডে দাও।

## ৮.২ — Applicant পাইপলাইন

আবেদনকারী এলে **Recruitment → Applications → All Applications**-এ কার্ড আকারে দেখাবে। ডিফল্ট স্টেজ:

```text
New → Initial Qualification → First Interview → Second Interview → Contract Proposal → Contract Signed
```

কাজের ধরন:

1. কার্ড ধরে ড্র্যাগ করে এক ধাপ থেকে পরের ধাপে নাও
2. প্রতিটা কার্ডে CV সংযুক্ত করো, মন্তব্য লেখো
3. ইন্টারভিউয়ের দিন থাকলে **Schedule Interview** (Calendar-এর সাথে যুক্ত)
4. Stress/interview ফিডব্যাক রাখো Notes-এ

> **স্টেজ নিজের মতো সাজাতে:** Recruitment → Configuration → Job Positions → Stages-এ নতুন স্টেজ যোগ করো, ক্রম বদলাও, বা কোনো স্টেজে "Hired Stage" টিক দাও। স্টেজ বদলালে সব Job Position-এ প্রভাব পড়ে — নির্দিষ্ট পদের জন্য আলাদা স্টেজও করা যায়।

## ৮.৩ — নেওয়ার সিদ্ধান্ত

1. যাকে নেবে তার কার্ড **Contract Signed** (বা Hired হিসেবে চিহ্নিত) স্টেজে নাও
2. কার্ড/রেকর্ডে **Create Employee** বাটন আসবে — চাপলে Applicant-এর ডেটা দিয়েই Employee তৈরি হয়ে যাবে
3. Employee রেকর্ডে গিয়ে Department, Work Schedule, PIN/Badge — বাকিগুলো পূরণ করো

> **ডেটা দুইবার নয়:** Create Employee চাপলে নাম, ইমেইল, ফোন, CV — সব চলে যায়। নতুন করে টাইপ করার দরকার নেই; শুধু HR-এর বাকি তথ্য (কর্মীর তালিকা, NID, ব্যাংক) যোগ করো।

## বাস্তবে কী ঘটে

- একই Job Position-এ একাধিক আবেদনকারী এলে সবাই একই পাইপলাইনে জমা হয়, Department অনুযায়ী ফিল্টার করা যায়
- পাবলিশ করা চাকরি সাইটে দেখা যায়; Unpublish করলে লুকিয়ে যায়
- Applicant-এর সাথে সব চ্যাটার (ইমেইল/নোট) এক জায়গায় থাকে — কে কবে কী বলেছে
- Create Employee করার পর Applicant রেকর্ডও থেকে যায় — Employee আলাদা রেকর্ড
- বাতিল করা আবেদনকারীকে Refuse করলে কারণ লিখতে হয় — পরে রিপোর্টে কাজে লাগে

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| New বাটনে Job Position ফিল্ড খালি | Department/Job Position আগে বানানো আছে কি না দেখো (ধাপ ৫.২) |
| /jobs পেজে দেখা যাচ্ছে না | Website ইনস্টল, জব **Published**, সাইটের ডোমেইন ঠিক কি না |
| Create Employee বাটন নেই | Applicant স্টেজ Hired হিসেবে চিহ্নিত কি না, Recruitment-এ Administrator কি না |
| কার্ড ড্র্যাগ হচ্ছে না | স্টেজে বসিয়ে Save করো; মোবাইলে কার্ডের মেনু থেকে Stage বদলাও |

## চেকলিস্ট

- [ ] Job Position + Expected New Employees
- [ ] Website থাকলে Publish, লিংক শেয়ার
- [ ] Applicant পাইপলাইন স্টেজ ঠিক
- [ ] CV সংযুক্তি ও নোট
- [ ] Create Employee দিয়ে টেস্ট
- [ ] নতুন Employee-র Work Information পূরণ

এরপর মূল্যায়ন — [Appraisals](/odoo/hrm/appraisals)।
