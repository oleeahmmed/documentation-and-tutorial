---
title: "Expense ও Fleet সেটিংস"
description: "ভাগ ১ — খরচের Category, গাড়ির Model, Service Type আর Contract Type — কে কী খরচ করবে, গাড়ির হিসাব কোথায় থাকবে।"
icon: ReceiptText
---

## গল্প

Merchandiser মাসে কয়েকবার বায়ার অফিসে যান, গাড়ি চলে ঢাকা-বগুড়া। এই খরচগুলো আর গাড়ির সার্ভিসের হিসাব আলাদা খাতায় না রেখে Odoo-তে এক জায়গায় রাখা হবে।

## ১.১১ — Expenses Settings

**Expenses → Configuration → Expense Categories → New** — প্রতিটাতে Cost/Unit ও Taxes ঠিক করো:

| Category |
| --- |
| Transport |
| Food |
| Mobile Bill |
| Courier |
| Buyer Visit Travel |
| Hotel |
| Misc |

> **Taxes:** খরচের রসিদে VAT থাকলে সংশ্লিষ্ট ট্যাক্স বসাও — পরে ইনপুট ট্যাক্সের হিসাব মিলবে। না জানা থাকলে খালি রাখো; Accounts পরে ঠিক করবে।

## ১.১২ — Fleet Settings

### (ক) Vehicle Models

**Fleet → Configuration → Vehicle Models → New** — `Toyota Hiace`, `Hero Bike` ইত্যাদি।

### (খ) Service Types

**Fleet → Configuration → Service Types** — `Oil Change`, `Tyre`, `Repair`, `Fitness`, `Tax Token`।

### (গ) Contract Types

**Fleet → Configuration → Contract Types** — `Insurance`, `Leasing`, `Registration`।

> **Fitness আর Tax Token** আলাদা Service Type রাখলে মেয়াদ শেষ হওয়ার আগেই রিপোর্টে ধরা পড়বে — গাড়ি রাস্তায় না আটকে যায়।

## বাস্তবে কী ঘটে

- Expense Category ঠিক না থাকলে কর্মী "Misc"-এ সব ঢুকিয়ে দেবে — রিপোর্টে খরচের ধরন বোঝা যাবে না
- গাড়ির Model আগে বানালে Vehicle যোগ করার সময় ড্রপডাউনে পাবে; Service Type বাছলে সার্ভিসের ইতিহাস আলাদা করে দেখা যায়
- Contract Type দিয়ে ইনসুরেন্স/ট্যাক্স টোকেনের মেয়াদ ট্র্যাক হবে ([কর্মী Entry](/odoo/hrm/employee-entry) পেজে গাড়ির সাথে Contract জোড়া লাগবে)

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Expense Categories মেনু নেই | Expenses অ্যাপ ইনস্টল করো |
| Vehicle Model খুঁজে পাচ্ছি না | Fleet → Configuration → Vehicle Models-এ আগে বানাও |
| Service Type ডুপ্লিকেট | ব্যবহৃত রেকর্ড থাকলে Delete না, Archive করো |

## চেকলিস্ট

- [ ] ৭টা Expense Category (Cost/Unit, Taxes সহ)
- [ ] Vehicle Model: Toyota Hiace, Hero Bike
- [ ] ৫টা Service Type
- [ ] ৩টা Contract Type

পরের ধাপে [Maintenance, Lunch ও সেটিংস চেকলিস্ট](/odoo/hrm/maintenance) — মেশিন, টিম আর ক্যান্টিন।
