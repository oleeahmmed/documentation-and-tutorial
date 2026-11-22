---
title: Units ও Product Variants
description: কাপড় মিটার/কেজি, শার্ট ডজন, আর সাইজ-কালারের ভ্যারিয়েন্ট।
icon: Ruler
---

**অ্যাপ-নির্ভর সেটিংস** — **Inventory** ইনস্টলের পর Units, আর **Sales** ইনস্টলের পর Variants/Attributes দেখা যায়।

**গল্প:** রফিক স্টোরে কাপড় রাখে **মিটার/কেজি**-তে, বাটন **পিস**-এ, আর রেডি শার্ট **ডজন**-এ। নাদিয়া বায়ারকে পাঠায় `পোলো শার্ট` — কিন্তু সাইজ **S/M/L/XL** আর কালার **Navy/White/Black** আলাদা করে।

## Units of Measure (UoM)

1. **Inventory → Configuration → Units of Measure** (কিছু ভার্সনে **Units**)
2. দরকারি ইউনিট **Active** করো:

| ইউনিট | কোথায় লাগবে |
| --- | --- |
| Meter (m) | কাপড়ের রোল |
| Kilogram (kg) | সুতা/কাঁচামাল |
| Units (pcs) | বাটন, লেবেল |
| Dozen | রেডি গার্মেন্টস |

3. প্রয়োজনে **New** দিয়ে নিজের ইউনিট বানাও (category ঠিক রেখে)

## Product Variants চালু করা

1. **Settings → Sales** (বা Sales → Configuration → Settings)
2. **Product Catalog → Variants** টিক দাও
3. **Save**

এরপর প্রোডাক্টে একাধিক বৈশিষ্ট্য (attribute) দিয়ে ভ্যারিয়েন্ট বানানো যাবে।

## Attributes বানানো

1. **Sales → Products → Attributes → New**
2. দুইটা attribute বানাও:

| Attribute | Values | Display Type |
| --- | --- | --- |
| Size | S, M, L, XL | Radio / Dropdown |
| Color | Navy, White, Black | Color |

3. **Save**

## হাতে-কলমে: ১২টা ভ্যারিয়েন্টের পোলো শার্ট

1. **Sales → Products → New**
2. নাম: `Polo Shirt`, UoM: `Dozen`
3. **Attributes & Variants** ট্যাব → Size আর Color লাইন যোগ করো
4. মান বাছো — ৪ সাইজ × ৩ কালার = **১২ ভ্যারিয়েন্ট**
5. **Save** — তালিকায় প্রতিটা ভ্যারিয়েন্ট আলাদা প্রোডাক্ট কোড/দাম পাবে

## টিপস

| কাজ | খেয়াল রাখো |
| --- | --- |
| ভ্যারিয়েন্ট | লেনদেন শুরুর আগেই চালু করো — পরে বদলানো ঝামেলার |
| UoM | একই জিনিস দুই ইউনিটে (কেজি/মিটার) মিশিয়ে ফেলো না |
| দাম | ভ্যারিয়েন্টভেদে দাম আলাদা হতে পারে — প্রোডাক্ট ফর্মে সেট করো |

➡️ পরের টপিক: [Warehouse ও Shipping](/odoo/general-settings/warehouse-shipping)
