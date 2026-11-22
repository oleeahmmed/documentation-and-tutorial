---
title: User Types
description: Internal, Portal আর Public — কে backend-এ ঢুকবে, কে শুধু নিজের ডকুমেন্ট দেখবে।
icon: Globe
---

**গল্প:** নাদিয়া, রফিক, সুমন — এরা **Internal** (কর্মী, backend-এ কাজ করে)। UK-র বায়ার Styles & Threads — **Portal** (শুধু নিজের কোটেশন/ইনভয়েস দেখবে)। আর ওয়েবসাইটে ঢোকা যে কেউ — **Public**।

## তিন ধরনের তুলনা

| Type | কে | কোথায় ঢোকে | উদাহরণ |
| --- | --- | --- | --- |
| **Internal User** | কর্মী | পুরো backend | নাদিয়া, রফিক, সুমন, তানভীর |
| **Portal** | বাইরের কাস্টমার/ভেন্ডর | শুধু `/my` পোর্টাল | Styles & Threads |
| **Public** | ওয়েবসাইট ভিজিটর | পাবলিক পেজ (লগইন ছাড়া) | যে কেউ সাইটে ঢুকলে |

> **খরচ:** Odoo Online-এ Internal ইউজারই পেইড সিট নেয়। Portal ইউজার সাধারণত সিট নেয় না — তাই বায়ারকে Portal করাই ভালো।

## Internal ইউজার বানানো

Users → ইউজার → **Access Rights** ট্যাব → **User Type: Internal User** → অ্যাপে লেভেল দাও → Save।

## Portal ইউজার বানানো (বায়ারের জন্য)

1. **Contacts** → `Styles & Threads` কন্টাক্ট খোলো (না থাকলে New)
2. ঠিকানা/ইমেইল পূরণ করো
3. **Action → Grant Portal Access**
4. বায়ারের ইমেইল নিশ্চিত করো → Send
5. বায়ার ইমেইলে লিংক পেয়ে পাসওয়ার্ড সেট করবে

এরপর বায়ার `your-odoo.com/my`-তে ঢুকে শুধু **নিজের** কোটেশন, সেলস অর্ডার, ইনভয়েস দেখবে — অন্য কাস্টমারের কিছু নয়।

> ⚠️ Portal গেটে টিক দিলেই সব দেখা যায় না — কোটেশন/ইনভয়েস **Send** করা থাকতে হবে।

## Public ইউজার

ওয়েবসাইট/eCommerce চালু থাকলে Odoo নিজেই anonymous ভিজিটরকে Public হিসেবে ধরে। ম্যানুয়ালি ইউজার বানানোর দরকার নেই। ওয়েবসাইট থেকে অর্ডার করলে কাস্টমার চাইলে Portal অ্যাকাউন্ট পায়।

## Type বদলানো

Users → ইউজার → Access Rights → **User Type** বদলে Save। Portal → Internal করলে সে backend-এ ঢুকতে পারবে (তখন Groups-ও ঠিক করতে হবে)। Internal → Portal করলে অ্যাপের এক্সেস সব চলে যাবে।

➡️ পরের টপিক: [Access Rights](/odoo/users-access/access-rights)
