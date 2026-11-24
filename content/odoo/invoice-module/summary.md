---
title: সারসংক্ষেপ ও ড্যাশবোর্ড
description: পর্ব ৬ — পুরো ইনভয়েসিং চক্র এক নজরে, করিম ভাইয়ের ড্যাশবোর্ড, চেকলিস্ট আর পরের গন্তব্য।
icon: CheckCircle2
---

## গল্পের সমাপ্তি

শুরুতে ছিল একটা খালি Odoo ডাটাবেস আর হাতে লেখা খাতা। এখন রূপসী ফ্যাশনের পুরো ইনভয়েসিং চক্র ডিজিটাল — ইনভয়েস, ক্রেডিট নোট, পেমেন্ট, ভেন্ডর বিল, রিফান্ড — প্রতিটার ট্রেইল আছে, ভ্যাট স্বয়ংক্রিয়ভাবে হিসাব হচ্ছে।

## পুরো প্রক্রিয়া এক নজরে

```text
Company Setup (নাম, লোগো, ঠিকানা) → Currency (BDT) → Timezone (Asia/Dhaka)
    ↓
Invoicing App ইনস্টল
    ↓
Configuration:
  Taxes (VAT 15%) → Journals (Bank, Cash) → Currencies (USD)
  → Fiscal Positions (export tax-exempt) → Payment Terms (৩০ দিন)
  → Product Categories → Payment Providers
    ↓
Customers সেকশন:
  কাস্টমার (অনিকা ফ্যাশন হাউজ) → পণ্য (উলের ওভারকোট)
  → Invoice তৈরি ও Confirm → Credit Note (আংশিক ফেরত)
  → Payment গ্রহণ (Register Payment)
    ↓
Vendors সেকশন:
  ভেন্ডর (ঢাকা উল হাউস) → পণ্য (কাঁচা উল)
  → Bill এন্ট্রি ও Confirm → Refund (আংশিক ক্রেডিট)
  → Payment প্রদান (Register Payment)
```

## করিম ভাইয়ের ড্যাশবোর্ড

Invoicing অ্যাপের মূল পেজে এখন এই ছবিটা:

| | পরিমাণ |
| --- | --- |
| মোট বিক্রি (Invoices) | ১৪,৩৭৫ টাকা |
| গ্রাহক-ফেরত (Credit Notes) | ৮০৫ টাকা |
| প্রাপ্ত পেমেন্ট | ১৩,৫৭০ টাকা |
| মোট ক্রয় (Bills) | ৬৯,০০০ টাকা |
| ভেন্ডর-ক্রেডিট (Refunds) | ৬,৯০০ টাকা |
| পরিশোধিত পেমেন্ট | ৬২,১০০ টাকা |

## ডকুমেন্টের জীবনচক্র

| ডকুমেন্ট | শুরু | Confirm-এর পর | পেমেন্টের পর |
| --- | --- | --- | --- |
| Customer Invoice | Draft | Posted, Not Paid | Paid / In Payment |
| Credit Note | Draft | Posted, বকেয়া কমায় | সমন্বিত |
| Vendor Bill | Draft | Posted, Payable | Paid / In Payment |
| Vendor Refund | Draft | Posted, Payable কমায় | সমন্বিত |

## কোন মেনু কোথায়

| কাজ | মেনু |
| --- | --- |
| কাস্টমার | Invoicing → Customers → Customers |
| বিক্রয়ের পণ্য | Invoicing → Customers → Products |
| ইনভয়েস | Invoicing → Customers → Invoices |
| কাস্টমার পেমেন্ট | Invoicing → Customers → Payments |
| ভেন্ডর | Invoicing → Vendors → Vendors |
| ভেন্ডর বিল | Invoicing → Vendors → Bills |
| ভেন্ডর পেমেন্ট | Invoicing → Vendors → Payments |
| ট্যাক্স/Journal/Terms | Invoicing → Configuration |

## চেকলিস্ট

- [ ] `rupashi_fashion` ডাটাবেস, ডেমো ডেটা ছাড়া
- [ ] কোম্পানির নাম/লোগো, BDT, Asia/Dhaka
- [ ] Invoicing অ্যাপ ইনস্টল
- [ ] VAT 15% (Sales + Purchase), Export 0%
- [ ] Bank Journal আর Payment Terms
- [ ] অনিকা ফ্যাশন হাউজ + ৩টা পণ্য
- [ ] INV/2026/00001 Confirm ও Send
- [ ] Credit Note ৮০৫ টাকা, পেমেন্ট ১৩,৫৭০ টাকা
- [ ] ঢাকা উল হাউস + কাঁচা উল
- [ ] BILL/2026/00001, Refund ৬,৯০০, পেমেন্ট ৬২,১০০

## এখান থেকে আরও গভীরে

| বিষয় | কী লাগবে |
| --- | --- |
| Bank Reconciliation | **Accounting** অ্যাপ (ব্যাংক স্টেটমেন্ট মিলানো) |
| Recurring Invoices | Accounting/Invoicing-এর Recurring Plans |
| Multi-Company | [Users & Access Rights → Multi-Company](/odoo/users-access/multi-company) |
| ইউজার ও অনুমতি | [Users & Access Rights](/odoo/users-access) |
| ট্যাক্স ও ইনভয়েস সেটিংসের বিস্তারিত | [Invoices ও Sales Tax](/odoo/general-settings/invoicing-tax) |
| অনলাইন পেমেন্ট | [Payment Providers](/odoo/general-settings/payments) |

➡️ শুরু থেকে আবার: [Invoice Module](/odoo/invoice-module)
➡️ Odoo-র বাকি সেটিংস: [General Settings](/odoo/general-settings)
