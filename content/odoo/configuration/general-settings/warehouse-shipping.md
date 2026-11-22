---
title: Warehouse ও Shipping
description: ফ্যাক্টরি স্টোর, ঢাকার আউটলেট, আর কুরিয়ার — স্টক সরানো ও ডেলিভারি।
icon: Warehouse
---

**অ্যাপ-নির্ভর সেটিংস** — **Inventory** অ্যাপ ইনস্টলের পর Warehouses আর Shipping Methods আসে।

**গল্প:** রূপসী ফ্যাশনের রেডি গুডস থাকে নারায়ণগঞ্জের ফ্যাক্টরিতে, আর কিছু পিস যায় ঢাকার আউটলেটে। আউটলেট থেকে কাস্টমারকে ডেলিভারি হয় Pathao/নিজেদের ট্রাকে, আর বায়ারের এক্সপোর্ট শিপমেন্ট যায় সিএন্ডএফ এজেন্টের মাধ্যমে।

## Warehouse সেটআপ

1. **Settings → Inventory → Warehouses** (বা Inventory → Configuration → Warehouses)
2. **New** চাপো
3. দুইটা ওয়্যারহাউস বানাও:

| নাম | Short Name | ঠিকানা |
| --- | --- | --- |
| Rupashi Factory | RF | নারায়ণগঞ্জ |
| Rupashi Outlet | RO | ঢাকা |

4. প্রতিটার জন্য Operation Types নিজে থেকে তৈরি হয় (Receipts, Delivery Orders, Internal Transfers)

## ফ্যাক্টরি → আউটলেট স্টক সরানো

1. **Inventory → Operations → Transfers**
2. From: `RF`, To: `RO`
3. প্রোডাক্ট আর পরিমাণ দাও → **Validate**

স্টক এখন দুই জায়গায় আলাদা দেখাবে — একই Odoo-তে।

## Shipping Methods

1. **Inventory → Configuration → Shipping Methods → New**
2. উদাহরণ:

| নাম | Provider | মূল্য |
| --- | --- | --- |
| Pathao Dhaka | Fixed Price | ৮০ টাকা |
| Own Truck | Fixed Price | ০ (ফ্রি) |
| C&F Export | Based on Rules | ওজন/অঞ্চল অনুযায়ী |

3. **Save** — সেলস/ডেলিভারি অর্ডারে এই মেথড বাছা যাবে

## হাতে-কলমে একটা ডেলিভারি

1. **Sales → Orders** — ঢাকার কাস্টমার
2. ডেলিভারি মেথড: **Pathao Dhaka**
3. শার্ট `২ ডজন` → **Confirm**
4. **Delivery → Validate** — স্টক আউটলেট থেকে কমবে

## টিপস

| কাজ | খেয়াল রাখো |
| --- | --- |
| Multiple warehouse | শুরুতে দুইটা বানালেও চলবে, পরে যোগ করা যায় |
| Steps | ২-ধাপ রিসিপ্ট/ডেলিভারি শুধু দরকার হলে চালু করো |
| Shipping cost | ইনভয়েসে শিপিং খরচ যোগ করতে চাইলে ডেলিভারি প্রোডাক্ট হিসেবে বিল করো |

➡️ পরের টপিক: [Payment Providers](/odoo/configuration/general-settings/payments)
