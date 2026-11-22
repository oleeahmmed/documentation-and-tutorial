---
title: Invoices ও Sales Tax
description: Customer Invoice আর ট্যাক্স — লোকাল ১৫% ভ্যাট, এক্সপোর্ট ০%।
icon: Receipt
---

**অ্যাপ-নির্ভর সেটিংস** — **Invoicing** (বা Accounting) অ্যাপ ইনস্টল করার পর **Settings → Invoicing** আর **Configuration → Taxes** আসে।

**গল্প:** রূপসী ফ্যাশনের আউটলেটে লোকাল কাস্টমারকে ইনভয়েসে **১৫% ভ্যাট** বসে। কিন্তু *Styles & Threads*-এর এক্সপোর্ট ইনভয়েস **০% (zero-rated)**। দুই ধরনের ইনভয়েস একই Odoo-তে।

## Invoicing অ্যাপ ইনস্টল

1. **Apps** → `Invoicing` খুঁজে **Install**
2. সম্পূর্ণ হিসাব চাইলে `Accounting` ইনস্টল করো (দেশভেদে সম্পূর্ণ ফিচার)

## Settings → Invoicing

| সেটিংস | রূপসী ফ্যাশনে |
| --- | --- |
| Default Taxes | লোকাল সেলসের জন্য **VAT 15%** |
| Invoice Format | কোম্পানির লোগো/ঠিকানাসহ PDF ফরম্যাট |
| Payment Terms | Advance 50%, Delivery-এর পর 50% |
| Fiscal Localization | দেশের চার্ট অফ অ্যাকাউন্টস ([Localization](/odoo/configuration/localization)) |

বদলে **Save** চাপো।

## ট্যাক্স বানানো

1. **Invoicing → Configuration → Taxes → New**
2. দুইটা ট্যাক্স বানাও:

| নাম | Rate | ধরন | কখন |
| --- | --- | --- | --- |
| VAT 15% | 15% | Sales | আউটলেটের লোকাল বিক্রি |
| Export 0% | 0% | Sales | বিদেশি বায়ার |

3. **Save** — এরপর প্রোডাক্ট/ইনভয়েস লাইনে ট্যাক্স বাছা যাবে

## হাতে-কলমে একটা ইনভয়েস

1. **Sales → Orders → New** — কাস্টমার *Local Customer*
2. প্রোডাক্ট: `পোলো শার্ট × ২ ডজন`
3. ট্যাক্স কলামে **VAT 15%** বাছো
4. **Confirm** → **Create Invoice**
5. ইনভয়েসে সাবটোটাল + ১৫% ভ্যাট আলাদা দেখাবে

এক্সপোর্ট অর্ডারে ট্যাক্স **Export 0%** — ইনভয়েসে ট্যাক্স ০ দেখাবে।

## টিপস

- **ইনভয়েস ইস্যু করার পর ডিফল্ট ট্যাক্স বদলাবে না** — পুরোনো ডকুমেন্টে ভুল দেখাবে
- বায়ারের দেশ অনুযায়ী ট্যাক্স নিয়ম আলাদা হলে প্রোডাক্ট/কাস্টমার লেভেলে সেট করো
- লোকালাইজেশন প্যাকেজ বদলালে চার্ট অফ অ্যাকাউন্টস বদলায় — লেনদেন শুরুর আগে ঠিক করো

➡️ পরের টপিক: [Units ও Product Variants](/odoo/general-settings/units-product)
