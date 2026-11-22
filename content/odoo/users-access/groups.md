---
title: Groups
description: নাদিয়া Sales User, রফিক Inventory User, সুমন Accountant — ভূমিকা অনুযায়ী গ্রুপ।
icon: Layers
---

**গল্প:** কাজ এক নয়, তাই পাওয়ারও এক নয়। Odoo-তে প্রতিটা কাজের জন্য তৈরি গ্রুপ আছে — নতুন গ্রুপ বানানোর আগে বিল্ট-ইন গ্রুপগুলোই ব্যবহার করো।

## অ্যাপভিত্তিক গ্রুপ

| অ্যাপ | গ্রুপ | কী পারে |
| --- | --- | --- |
| Sales | User: Own Documents Only | নিজের কোটেশন/অর্ডার |
| Sales | User: All Documents | টিমের সব অর্ডার (ম্যানেজার) |
| Sales | Administrator | সেলস সেটিংস |
| Inventory | User | স্টক, ট্রান্সফার |
| Inventory | Administrator | ওয়্যারহাউস/সেটিংস |
| Invoicing | User (Billing) | ইনভয়েস বানানো/পাঠানো |
| Invoicing | Accountant (Full) | রিপোর্ট, রিকনসাইল, ট্যাক্স |
| Invoicing | Administrator | অ্যাকাউন্টিং সেটিংস |

> ইনভয়েসিং-এর লেভেলের নাম ভার্সনভেদে একটু আলাদা হতে পারে — বুঝবে "কত গভীর অ্যাক্সেস" দরকার, নাম নয়।

## গ্রুপ দেওয়া (একজনের জন্য)

**Settings → Users & Companies → Users → ইউজার খোলো → Access Rights ট্যাব**

| ইউজার | যা টিক দেবে |
| --- | --- |
| নাদিয়া | Sales → **User: Own Documents Only** |
| তানভীর | Sales → **User: All Documents** |
| রফিক | Inventory → **User** |
| সুমন | Invoicing → **Accountant** |

নিচে **Extra Rights / Other** অংশে বাড়তি গ্রুপ (যেমন Multi-Currency) টিক দেওয়া যায়।

## হাতে-কলমে: কাস্টম গ্রুপ "Outlet Cashier"

শিপন আউটলেটে বিক্রি করে, কিন্তু তার নিজের অর্ডারই দেখা দরকার।

1. **Developer Mode** চালু করো (Settings-এর নিচে)
2. **Settings → Users & Companies → Groups → New**
3. Name: `Outlet Cashier`
4. Category: `Rupashi` (না থাকলে বানাও)
5. **Inherited/Implied Groups**-এ `Sales / User: Own Documents Only` যোগ করো
6. Save → গ্রুপের **Users** স্মার্ট বাটনে ক্লিক করে শিপনকে যোগ করো

শিপন এতে Sales-এর সব বেসিক সুবিধা পাবে, কিন্তু ম্যানেজার-লেভেল কিছু নয়।

## গ্রুপে একসাথে অনেক ইউজার

Groups তালিকা → গ্রুপ খোলো → **Add a line** / **Users** — নাম দিয়ে খুঁজে যোগ করো। নতুন কর্মী একই কাজে ঢুকলে এই পথেই গ্রুপে বসাও।

## টিপস

| ভুল | ঠিক |
| --- | --- |
| প্রতিটার জন্য নতুন গ্রুপ | আগে বিল্ট-ইন গ্রুপে চালানো যায় কি না দেখো |
| একজনের কয়েকটা কাজ | এক গ্রুপে আরেক গ্রুপ inherit করাও |
| Administrator টিক | শুধু সত্যিই যার দরকার |
| গ্রুপ বদলানোর পর | ওই ইউজার দিয়ে লগইন করে যাচাই করো |

➡️ পরের টপিক: [Record Rules](/odoo/users-access/record-rules)
