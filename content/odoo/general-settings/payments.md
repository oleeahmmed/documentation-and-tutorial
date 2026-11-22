---
title: Payment Providers
description: আউটলেটের অনলাইন পেমেন্ট, কার্ড, আর ব্যাংক ট্রান্সফার — কীভাবে চালু করবে।
icon: CreditCard
---

**অ্যাপ-নির্ভর সেটিংস** — **Payment** (বা Website/Invoicing) ইনস্টলের পর **Settings → Payment Providers** আসে।

**গল্প:** ঢাকার আউটলেটে কেউ অনলাইনে অর্ডার করলে কার্ডে পেমেন্ট চায়। কিন্তু UK-র বায়ার *Styles & Threads* ব্যাংক ট্রান্সফার/এলসিতে টাকা দেয়। দুই ধরনের পেমেন্টই রূপসী ফ্যাশনে থাকবে।

## Payment অ্যাপ ইনস্টল

1. **Apps** → `Payment` খুঁজে **Install**
2. ইনস্টলের পর **Settings → Payment Providers** দেখা যাবে

## অনলাইন পেমেন্ট প্রোভাইডার

1. **Settings → Payment Providers** (বা Invoicing/Website → Configuration → Payment Providers)
2. প্রোভাইডার বাছো — যেমন **Stripe** / **PayPal**
3. **Enabled** করো
4. **Test Mode** চালু রেখে Publishable/Secret key দাও
5. **Save** → একটা টেস্ট পেমেন্ট করে দেখো

> **bKash/Nagad:** Odoo-তে সরাসরি বিল্ট-ইন নেই। চাইলে community/third-party মডিউল (নিজের দায়িত্বে) অথবা ম্যানুয়াল ব্যাংক ট্রান্সফার মেথড ব্যবহার করো।

## ব্যাংক ট্রান্সফার / এলসি (ম্যানুয়াল)

1. **Invoicing → Configuration → Payment Methods** (ভার্সনভেদে জায়গা একটু আলাদা)
2. **Bank Transfer** ধরনের একটা ম্যানুয়াল মেথড বানাও
3. ইনভয়েসে "Pay Now" দিলে কাস্টমার এটা দেখবে — টাকা পাঠিয়ে রেফারেন্স দেবে
4. সুমন ব্যাংক স্টেটমেন্ট মিলিয়ে পেমেন্ট **Reconcile** করবে

গার্মেন্টস এক্সপোর্টে সাধারণত LC/ব্যাংক ট্রান্সফারই ব্যবহার হয় — অনলাইন কার্ড নয়।

## টিপস

| কাজ | খেয়াল রাখো |
| --- | --- |
| Test mode | প্রথমে টেস্ট key দিয়ে পুরো ফ্লো একবার চালাও |
| Secret key | কোথাও কমিট করো না, শুধু Odoo সেটিংসে রাখো |
| bKash | বিল্ট-ইন না — ম্যানুয়াল/থার্ড-পার্টি, দুটোর খরচ-ঝুঁকি নিজে দেখে নাও |
| Webhook | লাইভ হওয়ার পর প্রোভাইডারের ড্যাশবোর্ডে webhook URL ঠিক করে দাও |

➡️ পরের টপিক: [Developer Tools](/odoo/general-settings/developer-tools)
