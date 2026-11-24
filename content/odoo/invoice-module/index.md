---
title: Invoice Module
description: করিম ভাইয়ের খাতা-হিসাব থেকে Odoo Invoicing — খালি ইনস্ট্যান্সে কোম্পানি সেটআপ থেকে পেমেন্ট পর্যন্ত পুরো চক্র।
icon: ReceiptText
---

করিম ভাই এতদিন হাতে খাতায় হিসাব রাখতেন — কে কত টাকা পাওনা, কাকে কত দিতে হবে। এবার ঠিক করলেন Odoo দিয়ে রূপসী ফ্যাশনের পুরো হিসাব ডিজিটাল করবেন। আমরা শুরু করছি একটা **একদম খালি Odoo ইনস্ট্যান্স** থেকে — যেটা [Installation সেকশন](/odoo/installation)-এ `my-odoo` নামে সেটআপ করা হয়েছিল। কোনো কোম্পানি নেই, কোনো ডেটা নেই, ডেমো ডেটাও নেই।

এই সেকশনে শুধু ইনভয়েসিংয়ের কাজ — বিক্রয়ের ইনভয়েস, কাস্টমার পেমেন্ট, ভেন্ডর বিল আর রিফান্ড। স্টক, ম্যানুফ্যাকচারিং বা পূর্ণ ব্যাংক রিকনসিলিয়েশন আলাদা বিষয়।

> **কে কার জন্য:** আগে Odoo ইনস্টল ও সার্ভার চালু করা থাকতে হবে ([Installation](/odoo/installation)), আর অ্যাডমিন হিসেবে লগইন করতে পারতে হবে। Invoicing অ্যাপ এখনো ইনস্টল করা লাগবে না — পর্ব ২-এ করব।

## এই সেকশনে যা বানাবো

| ধাপ | পেজ | রূপসী ফ্যাশনে কী হবে |
| --- | --- | --- |
| ১ | [কোম্পানি সেটআপ ও প্রথম লগইন](/odoo/invoice-module/company-setup) | নতুন ডাটাবেস, কোম্পানির তথ্য, BDT, Asia/Dhaka |
| ২ | [Invoicing অ্যাপ ইনস্টল](/odoo/invoice-module/app-install) | Invoicing বনাম Accounting, মেনু চেনা |
| ৩ | [Configuration — ভিত্তি তৈরি](/odoo/invoice-module/configuration) | ভ্যাট ১৫%, Journal, USD, Fiscal Position, Payment Terms |
| ৪.১–৪.২ | [কাস্টমার ও বিক্রয়ের পণ্য](/odoo/invoice-module/customers) | অনিকা ফ্যাশন হাউজ, উলের ওভারকোট |
| ৪.৩ | [ইনভয়েস তৈরি ও পাঠানো](/odoo/invoice-module/invoices) | ১২,৫০০ + ভ্যাট = ১৪,৩৭৫ টাকা |
| ৪.৪ | [Credit Note — পণ্য ফেরত](/odoo/invoice-module/credit-notes) | ২টা মাফলার ফেরত = ৮০৫ টাকা |
| ৪.৫ | [কাস্টমার পেমেন্ট গ্রহণ](/odoo/invoice-module/customer-payments) | ১৩,৫৭০ টাকা পরিশোধ |
| ৫.১–৫.২ | [ভেন্ডর ও ক্রয়ের পণ্য](/odoo/invoice-module/vendors) | ঢাকা উল হাউস, কাঁচা উল |
| ৫.৩ | [Vendor Bill এন্ট্রি](/odoo/invoice-module/vendor-bills) | ৬৯,০০০ টাকার বিল |
| ৫.৪ | [ভেন্ডর রিফান্ড](/odoo/invoice-module/vendor-refunds) | ৬,৯০০ টাকা ক্রেডিট |
| ৫.৫ | [ভেন্ডরকে পেমেন্ট](/odoo/invoice-module/vendor-payments) | ৬২,১০০ টাকা পরিশোধ |
| ৬ | [সারসংক্ষেপ ও ড্যাশবোর্ড](/odoo/invoice-module/summary) | পুরো চক্র এক নজরে |

## পুরো চক্রটা এক নজরে

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
Customers: কাস্টমার → পণ্য → Invoice → Credit Note → Payment গ্রহণ
    ↓
Vendors: ভেন্ডর → পণ্য → Bill → Refund → Payment প্রদান
```

## শেষে করিম ভাইয়ের ড্যাশবোর্ড

| | পরিমাণ |
| --- | --- |
| মোট বিক্রি (Invoices) | ১৪,৩৭৫ টাকা |
| গ্রাহক-ফেরত (Credit Notes) | ৮০৫ টাকা |
| প্রাপ্ত পেমেন্ট | ১৩,৫৭০ টাকা |
| মোট ক্রয় (Bills) | ৬৯,০০০ টাকা |
| ভেন্ডর-ক্রেডিট (Refunds) | ৬,৯০০ টাকা |
| পরিশোধিত পেমেন্ট | ৬২,১০০ টাকা |

প্রতিটা লেনদেনের ট্রেইল থাকবে, ভ্যাট স্বয়ংক্রিয়ভাবে হিসাব হবে, আর কাগজের খাতার দরকার নেই।

শুরু করতে [কোম্পানি সেটআপ](/odoo/invoice-module/company-setup) পেজে যাও। Odoo-র অন্যান্য সেটিংস দেখতে [General Settings](/odoo/general-settings/invoicing-tax) সেকশনও পাশে রাখো।
