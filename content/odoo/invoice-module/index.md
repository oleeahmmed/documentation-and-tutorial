---
title: Invoice Module
description: করিম ভাইয়ের খাতা-হিসাব থেকে Odoo 19 Invoicing — খালি ইনস্ট্যান্সে কোম্পানি সেটআপ থেকে পেমেন্ট পর্যন্ত পুরো চক্র।
icon: ReceiptText
---

করিম ভাই এতদিন হাতে খাতায় হিসাব রাখতেন — কে কত টাকা পাওনা, কাকে কত দিতে হবে। এবার ঠিক করলেন Odoo দিয়ে রূপসী ফ্যাশনের পুরো হিসাব ডিজিটাল করবেন। আমরা শুরু করছি একটা **একদম খালি Odoo ইনস্ট্যান্স** থেকে — যেটা [Installation সেকশন](/odoo/installation)-এ `my-odoo` নামে সেটআপ করা হয়েছিল। কোনো কোম্পানি নেই, কোনো ডেটা নেই, ডেমো ডেটাও নেই।

এই সেকশনে শুধু ইনভয়েসিংয়ের কাজ — বিক্রয়ের ইনভয়েস, কাস্টমার পেমেন্ট, ভেন্ডর বিল আর রিফান্ড। স্টক, ম্যানুফ্যাকচারিং বা পূর্ণ ব্যাংক রিকনসিলিয়েশন আলাদা বিষয়।

> **সংস্করণ:** পুরো সিরিজটা **Odoo 19**-এর মেনু, বাটন আর ফ্লো অনুসারে লেখা। Installation সেকশনে উদাহরণ হিসেবে ১৮.০ দেখানো হয়েছে — একই ধাপে `--branch 19.0` দিয়ে ক্লোন করলেই Odoo 19 পাবে।
>
> **অ্যাপের নাম:** নিচের সব মেনুপাথে **Invoicing** বলতে তোমার ইনস্টল করা অ্যাপটাকে বোঝানো হয়েছে। পূর্ণ **Accounting** ইনস্টল থাকলে মেনুর নাম "Accounting" হবে, কিন্তু ভেতরের Customers, Vendors, Configuration — সব একই।

> **কে কার জন্য:** আগে Odoo ইনস্টল ও সার্ভার চালু করা থাকতে হবে ([Installation](/odoo/installation)), আর অ্যাডমিন হিসেবে লগইন করতে পারতে হবে। Invoicing অ্যাপ এখনো ইনস্টল করা লাগবে না — পর্ব ২-এ করব।

## Odoo 19-এ আগের চেয়ে যা বদলেছে

কোনো পুরোনো টিউটোরিয়াল দেখে বিভ্রান্ত হওয়ার আগে এই পাঁচটা জেনে নাও:

| পুরোনো Odoo | Odoo 19 |
| --- | --- |
| বাটন **Post** | ইনভয়েস/বিলে বাটন **Confirm**, তারপর স্ট্যাটাস **Posted** |
| **Register Payment** | বাটন **Pay** → উইন্ডোতে **Create Payment** |
| Fiscal Position-এ **Tax Mapping** ট্যাব | ট্যাক্স ফর্মে **Fiscal Positions** + **Replaces** |
| Settings-এ **Multi-Currencies** চেকবক্স | **Currencies** তালিকায় প্রতিটা কারেন্সির **Active** টগল |
| ট্যাক্স হাতে বানানো | বাংলাদেশ লোকালাইজেশন (`l10n_bd`) 15% সেলস/পারচেজ ট্যাক্স আগেই বসিয়ে দেয় |

## এই সেকশনে যা বানাবো

| ধাপ | পেজ | রূপসী ফ্যাশনে কী হবে |
| --- | --- | --- |
| ১ | [কোম্পানি সেটআপ ও প্রথম লগইন](/odoo/invoice-module/company-setup) | নতুন ডাটাবেস, কোম্পানির তথ্য, BDT, Asia/Dhaka |
| ২ | [Invoicing অ্যাপ ইনস্টল](/odoo/invoice-module/app-install) | Invoicing বনাম Accounting, লোকালাইজেশন, মেনু চেনা |
| ৩ | [Configuration — ভিত্তি তৈরি](/odoo/invoice-module/configuration) | লোকালাইজেশন ট্যাক্স, Journal, USD, Fiscal Position, Payment Terms |
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
Invoicing App ইনস্টল → বাংলাদেশ লোকালাইজেশন (চার্ট + 15% ট্যাক্স)
    ↓
Configuration:
  Taxes (15% Sale/Purchase, 0%) → Journals (Bank, Cash) → Currencies (USD)
  → Fiscal Positions (Export Customer) → Payment Terms (৩০ দিন)
  → Product Categories → Online Payments
    ↓
Customers: কাস্টমার → পণ্য → Invoice → Confirm → Send → Credit Note → Pay
    ↓
Vendors: ভেন্ডর → পণ্য → Bill → Confirm → Refund → Pay
```

## শেষে করিম ভাইয়ের হিসাব

| | পরিমাণ |
| --- | --- |
| মোট বিক্রি (Invoices) | ১৪,৩৭৫ টাকা |
| গ্রাহক-ফেরত (Credit Notes) | ৮০৫ টাকা |
| প্রাপ্ত পেমেন্ট | ১৩,৫৭০ টাকা |
| মোট ক্রয় (Bills) | ৬৯,০০০ টাকা |
| ভেন্ডর-ক্রেডিট (Refunds) | ৬,৯০০ টাকা |
| পরিশোধিত পেমেন্ট | ৬২,১০০ টাকা |

এই সংখ্যাগুলো দেখা যাবে **Customers → Invoices** আর **Vendors → Bills**-এর ফিল্টারে, অথবা (Accounting ইনস্টল থাকলে) **Reporting → Management → Invoice Analysis**-এ। Invoicing অ্যাপের ড্যাশবোর্ডে জার্নালভিত্তিক কার্ড থাকে — সেখানেও Customer Invoices আর Vendor Bills-এর সারসংক্ষেপ দেখা যায়।

প্রতিটা লেনদেনের ট্রেইল থাকবে, ভ্যাট স্বয়ংক্রিয়ভাবে হিসাব হবে, আর কাগজের খাতার দরকার নেই।

শুরু করতে [কোম্পানি সেটআপ](/odoo/invoice-module/company-setup) পেজে যাও। Odoo-র অন্যান্য সেটিংস দেখতে [General Settings](/odoo/general-settings/invoicing-tax) সেকশনও পাশে রাখো।
