---
title: "Configuration — ভিত্তি তৈরি"
description: পর্ব ৩ — ১৫% ভ্যাট, Purchase Tax, Journal, USD, Fiscal Position, Payment Terms, Product Category আর Payment Provider।
icon: Settings2
---

## গল্প

এই পর্বটাই সবচেয়ে গুরুত্বপূর্ণ। এখানে যে "নিয়ম"গুলো সেট হবে, পরে প্রতিটা ইনভয়েস, বিল আর পেমেন্টে স্বয়ংক্রিয়ভাবে সেগুলোই ব্যবহার হবে। একবার ঠিক করে নিলে করিম ভাইকে প্রতিবার হাতে ভ্যাট বা শর্ত বসাতে হবে না।

সব কাজ **Invoicing → Configuration** থেকে।

## ৩.১ — Settings

1. Invoicing → **Configuration → Settings**
2. গুরুত্বপূর্ণ অপশনগুলো:

| সেটিংস | রূপসী ফ্যাশনে |
| --- | --- |
| Fiscal Year | জুলাই–জুন (বাংলাদেশের অর্থবছর) |
| Default Payment Terms | পরে বানাব (৩.৬) |
| Multi-Currencies | চীনা সাপ্লায়ারের জন্য চালু করব (৩.৪) |

3. **Save**

## ৩.২ — Taxes (ভ্যাট/কর)

বাংলাদেশে পণ্যের ওপর ১৫% VAT প্রযোজ্য। করিম ভাই চান প্রতিটা ইনভয়েসে এই কর স্বয়ংক্রিয়ভাবে যোগ হোক।

### বিক্রয় কর (Sales)

1. Configuration → **Taxes** → **New**
2. পূরণ করো:

| ফিল্ড | মান |
| --- | --- |
| Tax Name | VAT 15% |
| Tax Type | Sales |
| Amount | 15 |
| Tax Computation | Percentage of Price (Advanced Options-এ) |
| Included in Price | না (ট্যাক্স আলাদা লাইনে দেখাবে) |

3. **Save**

### ক্রয় কর (Purchase)

একইভাবে আরেকটা ট্যাক্স বানাও — নাম `VAT 15% - Purchase`, **Tax Type: Purchase**, Amount 15%। ভেন্ডর বিলে এটাই বসবে।

### রপ্তানি কর (0%)

করিম ভাইয়ের রপ্তানিকারক কাস্টমারদের জন্য পরে Fiscal Position লাগবে। তার আগে একটা শূন্য-হারের ট্যাক্স বানিয়ে রাখো:

- নাম: `Export 0%`, Tax Type: Sales, Amount: 0

## ৩.৩ — Journals (হিসাবের খাতা)

Journal হলো ডিজিটাল "খাতা" — Sales Journal-এ সব বিক্রি, Purchase Journal-এ কেনাকাটা, Bank Journal-এ ব্যাংক লেনদেন।

1. Configuration → **Journals**
2. ডিফল্টভাবেই **Customer Invoices**, **Vendor Bills**, **Bank**, **Cash** থাকে
3. নতুন ব্যাংক অ্যাকাউন্ট যোগ করতে: **New** → নাম `Dutch-Bangla Bank` → Type: **Bank**
4. **Short Code** দাও (যেমন `DBBL`) — এই কোডই পরে ইনভয়েস নম্বরের প্রিফিক্স হিসেবে কাজ করে

## ৩.৪ — Currencies (মাল্টি-কারেন্সি)

করিম ভাই মাঝেমধ্যে চীনা সাপ্লায়ারের কাছ থেকে USD-তে কাপড় কেনেন।

1. Configuration → Settings → **Multi-Currencies** চালু করো → Save
2. Configuration → **Currencies** (বা Developer Mode-এ Technical → Currencies)
3. **USD** খুঁজে **Active** করো
4. এক্সচেঞ্জ রেট ম্যানুয়ালি বসাও, অথবা **Rate Provider** সিলেক্ট করে স্বয়ংক্রিয় আপডেট নাও

> রেট পুরোনো হয়ে গেলে ডলারের হিসাব ভুল হবে। বৈদেশিক লেনদেনের আগে Currencies-এ গিয়ে আজকের রেটটা একবার মিলিয়ে নিও।

## ৩.৫ — Fiscal Positions (ট্যাক্স-ম্যাপিং নিয়ম)

করিম ভাইয়ের কিছু কাস্টমার **রপ্তানিকারক** — তাদের ক্ষেত্রে VAT প্রযোজ্য না। প্রতিবার হাতে ট্যাক্স বদলানোর বদলে Fiscal Position দিয়ে স্বয়ংক্রিয় করা যায়।

1. Configuration → **Fiscal Positions** → **New**
2. নাম: `Export Customer (Tax Exempt)`
3. **Tax Mapping** ট্যাবে নতুন লাইন:
   - **Tax on Product**: `VAT 15%`
   - **Tax to Apply**: `Export 0%`
4. **Save**

এই Fiscal Position কোনো কাস্টমারের প্রোফাইলে অ্যাসাইন করলে তার সব ইনভয়েসে স্বয়ংক্রিয়ভাবে ০% কর বসবে (পর্ব ৪.১-এ দেখানো আছে)।

## ৩.৬ — Payment Terms (পেমেন্টের শর্ত)

কিছু কাস্টমার সাথে সাথে টাকা দেন, কিছু বড় কাস্টমারকে ৩০ দিন সময় দেওয়া হয়।

1. Configuration → **Payment Terms**
2. ডিফল্টে "Immediate Payment", "15 Days", "30 Days" থাকতে পারে
3. নতুন বানাতে: **New** → নাম `৩০ দিনের মধ্যে পরিশোধ`
4. **Terms** ট্যাবে:
   - Type: **Percentage**
   - Value: **100%**
   - Due: **After 30 Days**
5. **Save**

ইনভয়েসে এই শর্ত বাছলে Due Date নিজে থেকেই ৩০ দিন পরে বসবে।

## ৩.৭ — Product Categories (পণ্য-শ্রেণী)

1. Configuration → **Product Categories**
2. **New** → `শীতকালীন পোশাক`
3. আরেকটা → `কাঁচামাল`
4. চাইলে প্রতিটা ক্যাটাগরিতে income/expense account ম্যাপ করো — রিপোর্টে বিক্রি ও খরচ আলাদা করে দেখা যাবে

> Product Categories মেনু Invoicing-এ না দেখলে Sales/Inventory অ্যাপের Products → Product Categories থেকেও পাবে। অ্যাকাউন্ট ম্যাপিং তখনই meaningful, যখন দেশভিত্তিক localization ইনস্টল করা আছে।

## ৩.৮ — Online Payments ও Payment Methods

করিম ভাই চান ইনভয়েসের সাথে "Pay Now" বাটন থাকুক, যাতে কাস্টমার অনলাইনে টাকা দিতে পারেন।

1. Configuration → **Payment Providers**
2. তালিকায় PayPal, Stripe, Bank Transfer (Wire Transfer) ইত্যাদি থাকে
3. **Bank Transfer** বেছে নিলে:
   - State: **Enabled**
   - ব্যাংক অ্যাকাউন্টের তথ্য বসাও
4. Configuration → **Payment Methods**: Cash, Bank Transfer, Card ইত্যাদি পদ্ধতির তালিকা — কোনটা কোন Provider-এর সাথে যুক্ত তা এখানেই দেখা যায়

> এই টিউটোরিয়ালের পেমেন্টগুলো আমরা হাতে **Register Payment** দিয়ে করব — Payment Provider তখন দরকার হবে, যখন কাস্টমার নিজে অনলাইনে পে করবেন।

## বাস্তবে কী ঘটে

- এখানে বানানো ট্যাক্স নতুন প্রোডাক্টে ডিফল্ট হিসেবে বসে; পুরোনো ডকুমেন্টে পরিবর্তন হয় না
- Fiscal Position শুধু সেই কাস্টমারের ক্ষেত্রে কাজ করে, যার প্রোফাইলে অ্যাসাইন করা আছে
- Payment Terms ইনভয়েসের Due Date স্বয়ংক্রিয়ভাবে হিসাব করে — হাতে তারিখ লিখতে হয় না
- Journal-এর Short Code আর সিকোয়েন্স মিলেই ইনভয়েস নম্বর তৈরি হয় (`INV/2026/00001`)
- মাল্টি-কারেন্সি চালু না করলে USD প্রোডাক্ট/ইনভয়েস বানানো যাবে না

## চেকলিস্ট

- [ ] VAT 15% (Sales) আর VAT 15% - Purchase ট্যাক্স
- [ ] Export 0% ট্যাক্স
- [ ] Dutch-Bangla Bank Journal (Short Code সহ)
- [ ] USD active + এক্সচেঞ্জ রেট
- [ ] Export Customer (Tax Exempt) Fiscal Position
- [ ] ৩০ দিনের Payment Terms
- [ ] শীতকালীন পোশাক ও কাঁচামাল ক্যাটাগরি
- [ ] Bank Transfer Payment Provider (ঐচ্ছিক)

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Configuration মেনু নেই | Invoicing অ্যাপ ইনস্টল হয়েছে কিনা, অ্যাডমিন কিনা দেখো |
| Currencies মেনু দেখা যাচ্ছে না | Multi-Currencies চালু করো; Developer Mode-এ Technical থেকেও পাওয়া যায় |
| Tax Mapping-এ ট্যাক্স বাছা যাচ্ছে না | আগে VAT 15% আর Export 0% — দুটোই তৈরি করো |
| Payment Terms Due Date আসছে না | Terms ট্যাবে লাইন যোগ করেছ কিনা, Value 100% কিনা দেখো |
| USD রেট বসাতে পারছি না | Currencies-এ USD active, Company currency BDT কিনা দেখো |

পরের ধাপে [কাস্টমার ও বিক্রয়ের পণ্য](/odoo/invoice-module/customers) যোগ করব।
