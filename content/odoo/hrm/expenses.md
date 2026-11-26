---
title: "ধাপ ১০ — Expenses (খরচের দাবি)"
description: ভ্রমণ, খাবার, মোবাইল বিলের খরচ — কর্মী দাবি করবে, মালিক/ম্যানেজার অনুমোদন করবে, Accounts পরিশোধ করবে।
icon: Receipt
---

## গল্প

Merchandiser জাহিদ বায়ারের সাথে দেখা করতে ঢাকা গেল। ট্রেন ভাড়া, হোটেল, খাবার — খরচগুলো কাগজের রসিদে ভরে অ্যাকাউন্টসে জমা দিত। Odoo-তে সে ফোন থেকে ছবি তুলে দাবি করবে, ম্যানেজার অনুমোদন দেবে, অ্যাকাউন্টস পেমেন্ট করবে — সব এক ট্রেইলে।

## ১০.১ — Expense Categories

**Expenses → Configuration → Expense Categories** → **New**

| ক্যাটাগরি | কেন |
| --- | --- |
| Transport | ট্রেন, বাস, সিএনজি |
| Food | বাইরের খাবার |
| Mobile Bill | ফোন বিল |
| Sample Courier | স্যাম্পল পাঠানোর কুরিয়ার |
| Travel/Hotel (Buyer visit) | হোটেল, বিমান |
| Misc | অন্যান্য |

প্রতিটা ক্যাটাগরিতে চাইলে Default Account বসাও — তখন অ্যাকাউন্টসে পোস্ট করলে সঠিক খরচের খাতায় যাবে।

> **টিপস:** ক্যাটাগরি কম রাখো, স্পষ্ট রাখো। "Misc" বেশি ব্যবহার হলে পরে খরচের রিপোর্ট দেখে কিছুই বোঝা যাবে না — কোন খাতে টাকা যাচ্ছে।

## ১০.২ — কর্মীর কাজ

1. **Expenses → My Expenses → New** (শুধু **New** লেখা থাকতে পারে)
2. ফিল্ড: Description (`Buyer visit – Dhaka, 12 Nov`), Category (`Travel/Hotel`), Amount, রসিদের ছবি আপলোড
3. **Create Report** — কয়েকটা খরচ একসাথে এক রিপোর্টে জমা দেওয়া যায়
4. **Submit to Manager**

> **রসিদ ছাড়া দাবি:** ক্যামেরা আইকনে ক্লিক করে ছবি তোলো। রসিদে তারিখ, অঙ্ক আর দোকানের নাম দেখা যেতে হবে — নাহলে অনুমোদন আটকে যাবে।

## ১০.৩ — অনুমোদন ও পরিশোধ

**ম্যানেজার/করিম স্যার:**

1. **Expenses → My Expenses → Expenses to Process** — যেসব রিপোর্টে তোমার হাতের দরকার আছে, সেই তালিকা
2. রিপোর্ট খুলে **Approve** (বা **Refuse**, কারণ লিখে)
3. সব খরচ একসাথে দেখতে: **Expenses → Reporting → Expenses Analysis**

**Accounts টিম:**

1. একই **Expenses to Process** তালিকা থেকে রিপোর্ট খুলে **Approve**
2. **Post Journal Entries** — রিপোর্ট পোস্ট হলে খরচ হিসাবে ঢোকে
3. **Register Payment** — কর্মীর কাছে টাকা পরিশোধ
4. Accounting ইনস্টল থাকলে **Accounting → Vendors → Employee Expenses** থেকেও একই রিপোর্ট পাওয়া যায়

> **কারা অনুমোদন করবে:** Employee-র Approver সেট থাকে (Work Information/HR Settings), সে-ই প্রথম ধাপে অনুমোদন করে। খরচের অঙ্ক বেশি হলে দ্বিতীয় ধাপে করিম/Accounts অনুমোদন — এটা Expense Settings-এ ঠিক করা যায়।

## বাস্তবে কী ঘটে

- Expense Report-এর স্টেটাস: Draft → Submitted → Approved → Posted → In Payment → Paid
- Approve না হলে Accounts পোস্ট করতে পারে না
- এক রিপোর্টে একাধিক খরচ থাকতে পারে — একসাথে Submit, একসাথে Approve
- Refuse করলে কর্মী কারণ দেখতে পায়, ঠিক করে আবার Submit করতে পারে
- Posted খরচ আর বদলানো যায় না — ভুল হলে Credit Note/Adjustment লাগবে, তাই Approve করার আগে রসিদ মিলিয়ে নাও

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Category ড্রপডাউনে খালি | আগে Expense Categories বানাও |
| Submit বাটন নেই | Approver সেট নেই বা রিপোর্টে খরচ নেই — Employee-র Approver দেখো |
| Approve-এ পারমিশন নেই | Expenses-এ Manager/Administrator লেভেল দাও |
| Posted খরচ বদলাতে পারছি না | Posted মানে হিসাবে ঢুকে গেছে — Accounts-এর সাথে কথা বলে Adjustment করো |

## চেকলিস্ট

- [ ] ৬টা Expense Category
- [ ] Employee-র Approver সেট
- [ ] টেস্ট খরচ + রসিদ আপলোড
- [ ] Submit → Approve → Post → Payment ফ্লো টেস্ট
- [ ] Accounting থাকলে জার্নালে দেখা

এরপর গাড়ি — [Fleet](/odoo/hrm/fleet)।
