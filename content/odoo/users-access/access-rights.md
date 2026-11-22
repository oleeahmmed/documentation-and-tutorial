---
title: Access Rights
description: কোন মডেলে কার Read, Write, Create, Delete — চারটা চিঠির খেলা।
icon: Shield
---

**গল্প:** রফিক স্টকে কাজ করে, তাই `stock.quant` (স্টক) পড়তে আর বদলাতে পারবে। কিন্তু `account.move` (ইনভয়েস) সে দেখতেই পারবে না। নাদিয়া অর্ডার বানাতে পারবে, কিন্তু প্রোডাক্ট ডিলিট করতে পারবে না।

## তিনটা স্তর — গুলিয়ে ফেলো না

| স্তর | কী নিয়ন্ত্রণ করে | কোথায় |
| --- | --- | --- |
| Menus | মেনু দেখা যাবে কি না (শুধু UI) | অ্যাপ ইনস্টল + Group |
| **Access Rights (ACL)** | মডেলভিত্তিক **Read/Write/Create/Delete** | Settings → Technical → Security → Access Rights |
| **Record Rules** | কোন **সারি (record)** দেখা/বদলানো যাবে | Settings → Technical → Security → Record Rules |

মেনু লুকানো মানে নিরাপত্তা নয় — কেউ URL জানলে সরাসরি ঢোকার চেষ্টা করতে পারে। আসল দরজা **ACL + Record Rules**।

## ACL কোথায় দেখবে

**Developer Mode** চালু করে: **Settings → Technical → Security → Access Rights**

তালিকায় প্রতিটা সারি = এক মডেল + এক Group + চারটা টিক:

| কলাম | মানে |
| --- | --- |
| Model | কোন টেবিল (যেমন `sale.order`) |
| Group | কার জন্য |
| Read | দেখতে পারবে |
| Write | বদলাতে পারবে |
| Create | নতুন বানাতে পারবে |
| Delete | ডিলিট করতে পারবে |

## হাতে-কলমে: রফিকের সীমা যাচাই

1. নিশ্চিত করো রফিকের গ্রুপ = **Inventory / User**
2. ইনকগনিটোতে রফিক দিয়ে লগইন
3. Inventory মেনু → Products, Transfers — কাজ করে ✅
4. ব্রাউজারে সরাসরি `/odoo/invoicing` খোলার চেষ্টা করো → **Access Error** 🚫
5. Invoicing মেনুও দেখা যাবে না

Odoo-র বিল্ট-ইন ACL আগে থেকেই ঠিক করা — সাধারণত নতুন করে বানাতে হয় না, শুধু **সঠিক Group** দিতে হয়।

## Sales-এ Own vs All — বিল্ট-ইন উদাহরণ

| Group | কী পারে |
| --- | --- |
| Sales / User: Own Documents Only | নিজের কোটেশন/অর্ডার — customer, product পড়তে পারে |
| Sales / User: All Documents | পুরো টিমের অর্ডার, রিপোর্ট |

নাদিয়া = Own, তানভীর = All। এই পার্থক্যটা আসলে **Record Rules** দিয়ে হয় (পরের পেজ) — Group দুটোর ACL প্রায় একই।

## নতুন ACL কখন বানাবে

ডিফল্ট Odoo-তে প্রায় সব মডেলের ACL আগেই আছে। নিজের কাস্টম মডেল বানালে তখন Access Rights-এ নতুন সারি (বা কোডে `ir.model.access.csv`) লাগে। সাধারণ সেটিংস ঠিক করার সময় এটা হাতে করার দরকার নেই।

## টিপস

| ভুল | ঠিক |
| --- | --- |
| মেনু লুকিয়ে নিরাপত্তা ভাবা | ACL + Record Rule দিয়ে যাচাই করো |
| সবাইকে Administrator | কাজের Group-ই যথেষ্ট |
| Delete দিয়ে দাও | দরকার না হলে Delete বন্ধ রাখাই ভালো |

➡️ পরের টপিক: [Groups](/odoo/users-access/groups)
