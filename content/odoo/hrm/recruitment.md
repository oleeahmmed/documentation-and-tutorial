---
title: "নিয়োগ ও মূল্যায়ন সেটিংস"
description: "ভাগ ১ — Recruitment-এর Stage ও Refuse Reason, পদের বিজ্ঞাপন, আর Appraisals-এর বার্ষিক চক্র (Enterprise)।"
icon: Briefcase
---

## গল্প

সেলাই লাইনে নতুন অপারেটর দরকার। আবেদনকারী থেকে চাকরি নিশ্চিত হওয়া পর্যন্ত একটা পথ — Stage-এ Stage এগোবে। আর বছর শেষে কার কাজ কেমন, সেটা মাপার জন্য মূল্যায়নের নিয়ম আগেই ঠিক করে রাখতে হবে।

## ১.৯ — Recruitment সেটিংস

### (ক) Stages

**Recruitment → Configuration → Stages** — ধাপগুলো এই ক্রমে:

| Stage |
| --- |
| New |
| Initial Qualification |
| First Interview |
| Second Interview |
| Contract Proposal |
| Contract Signed |

> Stage-এর ক্রমই Applicant কার্ডের পাইপলাইন। এখানে নতুন Stage যোগ করলে নিয়োগ প্রক্রিয়া আরও ভাগ করা যায় (যেমন "Practical Test") — কিন্তু বেশি Stage মানে বেশি সময়; ছোট ফ্যাক্টরিতে ৫–৬টাই যথেষ্ট।

### (খ) Refuse Reasons

**Recruitment → Configuration → Refuse Reasons**

| কারণ |
| --- |
| Not Skilled |
| Salary Expectation |
| No Show |
| Other |

> Refuse করার সময় কারণ বাছা বাধ্যতামূলক করলে পরে বোঝা যায় কেন লোক পাওয়া যাচ্ছে না — বেতন কম না স্কিল কম। মাসে একবার এই তালিকা দেখো।

### (গ) Job Position (পদ খোলা)

যে পদে নিয়োগ চলছে সেটা **Recruitment → New** দিয়ে চালু করো। **Recruiter: Karim**।

| ফিল্ড | মান |
| --- | --- |
| Job Position | `Sewing Operator` |
| Department | `Sewing` |
| Recruiter | `Karim Hossain` |
| Expected Employees | কতজন লাগবে |

## ১.১০ — Appraisals সেটিংস (Enterprise)

**Appraisals → Configuration → Settings**

| সেটিংস | মান |
| --- | --- |
| Frequency | প্রতি ৬ বা ১২ মাস |
| Employee Feedback | চালু |
| Manager Feedback | চালু |

Goals-এর Template/Tags: `Production Target`, `Quality`, `Discipline`।

> **Community-তে নেই:** Appraisals শুধু Enterprise/Online-এ। Community ব্যবহার করলে মূল্যায়নের রেকর্ড Excel-এ রাখো — পরে Enterprise-এ গেলে Appraisal-এ তুলে নেওয়া যাবে।

> **Employee Feedback মানে** কর্মী নিজেও নিজের কাজের মূল্যায়ন লিখবে। প্রথম বছর চালু রাখলে ম্যানেজারের সাথে আলোচনা সহজ হয় — কর্মীর মনে হয় সে শুনছে।

## বাস্তবে কী ঘটে

- Applicant কার্ড Stage বদলালে ইতিহাসে কে কখন সরাল তা জমা থাকে
- Contract Signed-এ গেলে Applicant কার্ড থেকে **Create Employee** চাপলে সব তথ্য Employee-তে চলে যায় ([কর্মী Entry](/odoo/hrm/employee-entry))
- Appraisal চক্র চালু হলে নির্দিষ্ট সময়ে কর্মীর জন্য মূল্যায়ন তৈরি হয়; Goal ট্যাগ দিয়ে ফিল্টার করা যায়
- Recruiter সেট না থাকলে কে দায়িত্বে, বোঝা যায় না — Karim বসাও

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Stages মেনু নেই | Recruitment অ্যাপ ইনস্টল করো |
| Job Position খুঁজে পাচ্ছি না | Employees সেটিংসে Job Position বানানো আছে কিনা দেখো ([Employees সেটিংস](/odoo/hrm/people)) |
| Appraisals অ্যাপ নেই | Community ভার্সন — Enterprise/Online লাগবে |
| Goal-এর ট্যাগ দেখাচ্ছে না | Appraisals → Configuration → Tags-এ তিনটা ট্যাগ বানাও |

## চেকলিস্ট

- [ ] ৬টা Recruitment Stage
- [ ] ৪টা Refuse Reason
- [ ] চলমান পদের Job Position + Recruiter Karim
- [ ] Appraisal Frequency, Employee + Manager Feedback
- [ ] Goals: Production Target, Quality, Discipline

পরের ধাপে [Expense ও Fleet সেটিংস](/odoo/hrm/expenses) — খরচের ধরন আর গাড়ির হিসাব।
