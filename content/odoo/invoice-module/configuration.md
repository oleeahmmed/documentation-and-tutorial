---
title: "Configuration — ভিত্তি তৈরি"
description: পর্ব ৩ — লোকালাইজেশনের ১৫% ভ্যাট, Journal, USD, Fiscal Position, Payment Terms, Product Category আর Payment Provider।
icon: Settings2
---

## গল্প

এই পর্বটাই সবচেয়ে গুরুত্বপূর্ণ। এখানে যে "নিয়ম"গুলো সেট হবে, পরে প্রতিটা ইনভয়েস, বিল আর পেমেন্টে স্বয়ংক্রিয়ভাবে সেগুলোই ব্যবহার হবে। একবার ঠিক করে নিলে করিম ভাইকে প্রতিবার হাতে ভ্যাট বা শর্ত বসাতে হবে না।

সব কাজ **Invoicing → Configuration** থেকে। পূর্ণ Accounting ইনস্টল থাকলে মেনুপাথ হবে **Accounting → Configuration** — ভেতরের সব অপশন একই।

## ৩.১ — Settings

1. Invoicing → **Configuration → Settings**
2. গুরুত্বপূর্ণ সেকশনগুলো:

| সেটিংস | রূপসী ফ্যাশনে |
| --- | --- |
| Fiscal Localization → Package | Bangladesh (ইনস্টলের সময়ই বসে যাওয়ার কথা) |
| Taxes → Default Taxes → Sales Tax | `15%` |
| Taxes → Default Taxes → Purchase Tax | `15%` |
| Prices | Tax Excluded (ট্যাক্স আলাদা লাইনে দেখাবে) |
| Fiscal Country | Bangladesh |
| Rounding Method | Round per Line |

3. **Save**

> **Fiscal Year কোথায়?** Odoo 19-এর Settings-এ আলাদা "Fiscal Year" ফিল্ড নেই। বাংলাদেশ লোকালাইজেশনের রিপোর্ট ও ট্যাক্স পিরিয়ড আগে থেকেই জুলাই–জুন ধরে নেয়; পূর্ণ অ্যাকাউন্টিং রিপোর্টের জন্য Accounting অ্যাপ লাগবে।

## ৩.২ — Taxes (ভ্যাট/কর)

ভালো খবর: ট্যাক্স শূন্য থেকে বানাতে হবে না। বাংলাদেশ লোকালাইজেশন (`l10n_bd`) আগেই ১৫%, ১০%, ০% — সব ট্যাক্স তৈরি করে রেখেছে।

1. Configuration → **Accounting → Taxes**
2. উপরে **Active** আর **Archived** ফিল্টার দিয়ে তালিকা দেখো — `15%` (Sales), `15%` (Purchase), `0%` (Sales) ইত্যাদি
3. কোনোটা Archived থাকলে ট্যাক্সটা খুলে **Active** টগল চালু করে **Save** করো
4. `15%` ট্যাক্সে ক্লিক করে দেখো:

| ফিল্ড | কি থাকা উচিত |
| --- | --- |
| Tax Name | `15%` |
| Tax Type | Sales (বিক্রির জন্য) / Purchase (ক্রয়ের জন্য) |
| Tax Scope | Goods |
| Tax Computation | Percentage |
| Amount | 15.00 |
| Tax Group | `VAT at 15%` |
| Label on Invoices | `15%` (চাইলে `VAT 15%` করে দিতে পারো) |

### কোন ট্যাক্স কোথায় বসবে

| কাজ | ট্যাক্স |
| --- | --- |
| দেশীয় বিক্রি | `15%` — Sales |
| ভেন্ডরের কাছ থেকে কেনা | `15%` — Purchase |
| রপ্তানি | `0%` — Sales |

> **ডুপ্লিকেট নয়:** একই নামে হাতে নতুন `VAT 15%` বানিয়ো না — তাহলে ইনভয়েসে কোনটা বসবে তা নিয়ে গোলমাল হবে, রিপোর্টও ভাগ হয়ে যাবে। লোকালাইজেশনের ট্যাক্সই ব্যবহার করো। ব্যবহৃত ট্যাক্স ডিলিট করা যায় না — দরকার হলে **Archive** করো।

## ৩.৩ — Journals (হিসাবের খাতা)

Journal হলো ডিজিটাল "খাতা" — Sales Journal-এ সব বিক্রি, Purchase Journal-এ কেনাকাটা, Bank Journal-এ ব্যাংক লেনদেন।

1. Configuration → **Accounting → Journals**
2. ডিফল্টভাবেই **Customer Invoices**, **Vendor Bills**, **Bank**, **Cash**, **Miscellaneous** থাকে
3. নতুন ব্যাংক অ্যাকাউন্ট যোগ করতে: **New** → নাম `Dutch-Bangla Bank` → Type: **Bank**
4. **Short Code** দাও (যেমন `DBBL`)
5. **Incoming Payments / Outgoing Payments** ট্যাবে পেমেন্ট মেথড (Manual) আর Outstanding অ্যাকাউন্ট দেখে নাও
6. **Save**

> ইনভয়েস নম্বর (`INV/2026/00001`) আসে Customer Invoices জার্নালের সিকোয়েন্স থেকে। Short Code বদলালে নম্বরের প্রিফিক্সও বদলাবে।

## ৩.৪ — Currencies (মাল্টি-কারেন্সি)

করিম ভাই মাঝেমধ্যে চীনা সাপ্লায়ারের কাছ থেকে USD-তে কাপড় কেনেন। Odoo 19-এ আর "Multi-Currencies" চেকবক্স নেই — প্রতিটা কারেন্সি আলাদা করে Active করতে হয়।

1. Configuration → **Accounting → Currencies** (অথবা Settings → Currencies → **Main Currency**-এর পাশের **Currencies** বাটন)
2. Main Currency **BDT** কিনা দেখো
3. তালিকায় **USD** খুঁজে ডান পাশের **Active** টগল চালু করো (তালিকায় না দেখলে ফিল্টার থেকে **Inactive** দেখাও)
4. USD-তে ক্লিক করে **Rates** ট্যাবে আজকের এক্সচেঞ্জ রেট বসাও, অথবা **Rate Provider** বেছে **Update now** চাপো

> রেট পুরোনো হয়ে গেলে ডলারের হিসাব ভুল হবে। বৈদেশিক লেনদেনের আগে Currencies-এ গিয়ে আজকের রেটটা একবার মিলিয়ে নিও।

## ৩.৫ — Fiscal Positions (ট্যাক্স-ম্যাপিং নিয়ম)

করিম ভাইয়ের কিছু কাস্টমার **রপ্তানিকারক** — তাদের ক্ষেত্রে VAT প্রযোজ্য না। Odoo 19-এ ম্যাপিং আর Fiscal Position-এর ভেতরে থাকে না; ট্যাক্সের ঘরেই "Replaces" দিয়ে বসাতে হয়।

1. Configuration → **Accounting → Fiscal Positions** → **New**
2. নাম: `Export Customer (Tax Exempt)`
3. **Detect Automatically** বন্ধ রাখো — কাস্টমারের প্রোফাইল থেকে হাতে বসাব
4. **Save**
5. এবার Configuration → Accounting → **Taxes** → `0%` (Sales) ট্যাক্স খোলো
6. **Fiscal Positions** ট্যাবে **Add a line**:
   - Fiscal Position: `Export Customer (Tax Exempt)`
   - **Replaces**: `15%` (Sales)
7. **Save**

এর মানে: এই ফিসকাল পজিশন যার প্রোফাইলে বসানো আছে, তার ইনভয়েসে `15%`-এর জায়গায় `0%` বসবে (পর্ব ৪.১-এ কাস্টমারে অ্যাসাইন করব)।

> **খেয়াল করো:** ইনভয়েসে ফিসকাল পজিশন বসালে ট্যাক্সের লাইনটাও তখনই বদলে যায় — Confirm করার আগেই। আর লোকালাইজেশনের `International` পজিশন বিদেশি ঠিকানার কাস্টমারে নিজে থেকেই 0% বসায়; তাই বাস্তবে আলাদা পজিশন না বানিয়েও চলে। শেখার জন্য আমরা নিজেরটা বানালাম।

## ৩.৬ — Payment Terms (পেমেন্টের শর্ত)

কিছু কাস্টমার সাথে সাথে টাকা দেন, কিছু বড় কাস্টমারকে ৩০ দিন সময় দেওয়া হয়।

1. Configuration → **Invoicing → Payment Terms**
2. ডিফল্টে "Immediate Payment", "15 Days", "30 Days" থাকতে পারে
3. নতুন বানাতে: **New** → নাম `৩০ দিনের মধ্যে পরিশোধ`
4. **Due Terms** সেকশনে লাইন যোগ করো:

| ফিল্ড | মান |
| --- | --- |
| Type | Percent |
| Value | 100 |
| Days after Invoice Date | 30 |

5. নিচের **Preview** গ্রুপে দুটা তারিখ দেখাবে: ইনভয়েসের দিন ০%, ৩০ দিন পরে ১০০%
6. **Save**

ইনভয়েসে এই শর্ত বাছলে Due Date নিজে থেকেই ৩০ দিন পরে বসবে।

## ৩.৭ — Product Categories (পণ্য-শ্রেণী)

1. Configuration → **Invoicing → Product Categories**
2. **New** → `শীতকালীন পোশাক`
3. আরেকটা → `কাঁচামাল`
4. চাইলে প্রতিটা ক্যাটাগরিতে income/expense account ম্যাপ করো — রিপোর্টে বিক্রি ও খরচ আলাদা করে দেখা যাবে

> Product Categories মেনু Invoicing-এ না দেখলে Sales/Inventory অ্যাপের Products → Product Categories থেকেও পাবে। অ্যাকাউন্ট ম্যাপিং তখনই বোঝা যায়, যখন লোকালাইজেশন ইনস্টল করা আছে।

## ৩.৮ — Online Payments ও Payment Methods

করিম ভাই চান ইনভয়েসের সাথে "Pay Now" বাটন থাকুক, যাতে কাস্টমার অনলাইনে টাকা দিতে পারেন।

1. Configuration → **Online Payments → Payment Providers**
2. তালিকায় PayPal, Stripe, Demo, Wire Transfer ইত্যাদি থাকে
3. **Wire Transfer** বেছে নিলে **State: Enabled** করে ব্যাংক অ্যাকাউন্টের তথ্য বসাও
4. Configuration → **Online Payments → Payment Methods**: Cash, Manual, Card ইত্যাদি পদ্ধতির তালিকা — কোনটা কোন Provider-এর সাথে যুক্ত তা এখানেই দেখা যায়

> এই টিউটোরিয়ালের পেমেন্টগুলো আমরা হাতে **Pay → Create Payment** দিয়ে করব — Payment Provider তখন দরকার হবে, যখন কাস্টমার নিজে অনলাইনে পে করবেন।

## বাস্তবে কী ঘটে

- এখানে Active করা ট্যাক্সই নতুন পণ্য ও লাইনে ডিফল্ট হিসেবে বসে; পুরোনো ডকুমেন্টে পরিবর্তন হয় না
- Fiscal Position শুধু সেই কাস্টমারের ক্ষেত্রে কাজ করে, যার প্রোফাইলে অ্যাসাইন করা আছে
- Payment Terms ইনভয়েসের Due Date স্বয়ংক্রিয়ভাবে হিসাব করে — হাতে তারিখ লিখতে হয় না
- Journal-এর Short Code আর সিকোয়েন্স মিলেই ইনভয়েস নম্বর তৈরি হয় (`INV/2026/00001`)
- USD Active না করলে ডলারে ইনভয়েস/বিল বানানোই যাবে না
- Archived ট্যাক্স পুরোনো ডকুমেন্টে থেকে যায়, কিন্তু নতুন লাইনে আর দেখায় না

## চেকলিস্ট

- [ ] `15%` Sales আর `15%` Purchase ট্যাক্স Active
- [ ] `0%` (Sales) ট্যাক্স Active
- [ ] Export Customer ফিসকাল পজিশন (0% → 15% Replaces)
- [ ] Dutch-Bangla Bank Journal (Short Code সহ)
- [ ] USD Active + এক্সচেঞ্জ রেট
- [ ] ৩০ দিনের Payment Terms
- [ ] শীতকালীন পোশাক ও কাঁচামাল ক্যাটাগরি
- [ ] Wire Transfer Payment Provider (ঐচ্ছিক)

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Configuration মেনু নেই | Invoicing অ্যাপ ইনস্টল হয়েছে কিনা, অ্যাডমিন কিনা দেখো |
| Currencies মেনু দেখা যাচ্ছে না | Settings → Currencies → Main Currency-এর পাশে **Currencies** বাটন; অথবা Developer Mode-এ Technical |
| Taxes তালিকায় কিছুই নেই | ফিল্টার **Active** থেকে **Archived**-এ নাও; লোকালাইজেশন ইনস্টল কিনা দেখো |
| Fiscal Position-এ Tax Mapping ট্যাব নেই | Odoo 19-এ ম্যাপিং নেই — ট্যাক্সের **Fiscal Positions** ট্যাবে গিয়ে **Replaces** দাও |
| Payment Terms Due Date আসছে না | Due Terms-এ লাইন যোগ করেছ কিনা, Value ১০০ কিনা দেখো |
| USD রেট বসাতে পারছি না | Currencies-এ USD Active, Company currency BDT কিনা দেখো |

পরের ধাপে [কাস্টমার ও বিক্রয়ের পণ্য](/odoo/invoice-module/customers) যোগ করব।
