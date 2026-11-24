---
title: "পর্ব ৫ — Data Modeling: Star Schema"
description: Products টেবিল, DAX দিয়ে Date Table, আর relationship — কোন টেবিল কার সাথে জোড়া লাগবে।
icon: Network
---

## গল্প

এখন পর্যন্ত আমাদের হাতে শুধু একটা বিক্রয়-টেবিল। কিন্তু করিম ভাই চান দুইটা জিনিস:

1. **লাভ** জানতে — কোন পণ্যে কত খরচ, কত বিক্রি। খরচের তথ্য আছে অন্যদের `Products` শিটে
2. **মাস/বছর অনুযায়ী তুলনা** — "এই মাসে বিক্রি কমেছে" কথাটা বলতে হলে একটা পুরো ক্যালেন্ডার দরকার

তিনটা টেবিল জোড়া লাগালেই এই দুটোই সম্ভব — আর জোড়া লাগানোর কাঠামোটার নাম **Star Schema**।

## ৫.১ — Products টেবিল আনা

1. Home ট্যাব → **Get Data → Excel workbook** → একই `sales_data.xlsx` বেছে নাও
2. Navigator-এ এবার **Products**-এ ✔ দাও
3. **Load** (এই টেবিলটা পরিষ্কার, তাই Transform দরকার নেই)

ডান পাশের Data প্যানেলে এখন `Sales` আর `Products` — দুটো টেবিল।

## ৫.২ — Date Table বানানো (DAX দিয়ে)

তারিখ-ভিত্তিক বিশ্লেষণের (মাস, কোয়ার্টার, বছর) জন্য একটা আলাদা, **সম্পূর্ণ ও টানা** ক্যালেন্ডার টেবিল লাগে — এটা Power BI-র অন্যতম গুরুত্বপূর্ণ বেস্ট-প্র্যাকটিস।

1. বাম পাশের **Model view** আইকনে যাও
2. Home ট্যাব → **New table**
3. ফর্মুলা বার-এ লেখো:

```dax
DateTable = CALENDAR(DATE(2024, 1, 1), DATE(2026, 12, 31))
```

Enter চাপলে `DateTable` নামে একটা টেবিল আসবে, যেখানে একটাই কলাম — `Date`।

এবার নতুন কলাম যোগ করতে Table view-তে গিয়ে `DateTable` সিলেক্ট করে **New column**:

```dax
Year = YEAR(DateTable[Date])
```

```dax
MonthNumber = MONTH(DateTable[Date])
```

```dax
Month = FORMAT(DateTable[Date], "MMMM")
```

```dax
Quarter = "Q" & QUARTER(DateTable[Date])
```

> **বাংলায় মাসের নাম চাইলে:** `FORMAT(DateTable[Date], "MMMM", "bn-BD")` চেষ্টা করো। Power BI Desktop-এর ভাষা-সেটিংসের ওপর নির্ভর করে নাম বাংলায় নাও আসতে পারে — না এলে ইংরেজি রাখাই নিরাপদ; রিপোর্টের লেবেল পরে বদলানো যায়।

### মাসের সাজানো ঠিক করা

`Month` কলাম টেক্সট, তাই চার্টে এপ্রিল, আগস্ট... বর্ণানুক্রমে সাজবে — জানুয়ারি থেকে না। ঠিক করতে:

1. `Month` কলাম সিলেক্ট করো
2. উপরের ট্যাবে **Sort by column** → `MonthNumber` বেছে নাও

লেবেল দেখাবে "January", কিন্তু সাজবে ১, ২, ৩... ক্রমে।

### Date Table-কে চিহ্নিত করা

`DateTable`-এর নামে ডান ক্লিক → **Mark as date table** → কলাম হিসেবে `Date` বেছে নাও। এতে Power BI বুঝে যায় এটাই সময়ের অফিসিয়াল ছক — Time Intelligence ফাংশন (পর্ব ৬) নিরাপদে কাজ করবে।

## ৫.৩ — Relationship বানানো

1. **Model view**-এ যাও
2. `Sales` টেবিলের `Date` কলাম ধরে `DateTable`-এর `Date`-এর উপর ছেড়ে দাও (drag & drop) — একটা লাইন তৈরি হবে
3. একইভাবে `Sales[Product]` টেনে `Products[Product]`-এর উপর ছাড়ো

লাইনে ডাবল-ক্লিক করে Relationship-এর সেটিংস দেখো — থাকা উচিত:

| সেটিং | মান |
| --- | --- |
| Cardinality | **Many to one** (Sales-এ many, DateTable/Products-এ one) |
| Cross filter direction | **Single** |
| Active | হ্যাঁ |

Power BI নিজেই বুঝে নিয়েছে — কারণ `Products`-এ প্রতিটা পণ্য একবার, কিন্তু `Sales`-এ একই পণ্য বহুবার। এটাই **One-to-Many** সম্পর্ক।

### পরিষ্কার রাখার টিপস

- সম্পর্ক হওয়ার পর `Sales[Date]` আর `Sales[Product]` কলাম **Hide** করে দাও (ডান ক্লিক → Hide in report view)। রিপোর্টে ব্যবহার হবে ডাইমেনশন টেবিলের কলাম, আর মডেল দেখতে পরিষ্কার থাকবে
- `Products[Product]`-এ ডুপ্লিকেট নাম থাকলে relation তৈরি হবে না — এক পণ্যের একটাই সারি থাকতে হবে

## Star Schema — Power BI-র মূল কাঠামো

```text
        Products              DateTable
      (Dimension)            (Dimension)
           \                    /
            \                  /
             \                /
              \              /
                Sales
                (Fact)
```

| ধরনের টেবিল | কী থাকে | উদাহরণ |
| --- | --- | --- |
| **Fact** | সংখ্যা, পরিমাণ, ঘটনা | `Sales` — Quantity, UnitPrice, Revenue |
| **Dimension** | বিবরণ, শ্রেণিবিভাগ | `Products`, `DateTable` — নাম, ক্যাটাগরি, মাস, বছর |

মাঝখানে Fact, চারপাশে Dimension — দেখতে তারার (star) মতো, তাই **Star Schema**।

কেন এভাবে? এক বিশাল ফ্ল্যাট টেবিলে পণ্যের নাম, ক্যাটাগরি, দাম সব একসাথে থাকলে একই তথ্য হাজারবার পুনরাবৃত্তি হয়, ফাইল ভারী হয়, আর ভুলের সুযোগ বাড়ে। Star Schema-তে প্রতিটা তথ্য এক জায়গায় থাকে, আর Power BI দ্রুত ফিল্টার করতে পারে।

> `Region` আর `Salesperson`-ও পরে আলাদা Dimension টেবিল বানানো যায় (RegionTable, SalespersonTable)। শুরুতে `Sales`-এ রাখাই ঠিক আছে — দরকার হলে পরে ভাঙা যায়।

## বাস্তবে কী ঘটে

- Relationship থাকলে `Products`-এর `CostPrice` `Sales`-এর প্রতিটা সারির সাথে স্বয়ংক্রিয়ভাবে মিলে যায় — ডুপ্লিকেট করে বসাতে হয় না
- `DateTable`-এর `Month` দিয়ে ফিল্টার করলে ব্যাকগ্রাউন্ডে `Sales[Date]`-এর সারিগুলো ফিল্টার হয় — এটাই Relationship-এর কাজ
- `Products`-এ নতুন পণ্য যোগ করে Refresh দিলে নতুন সম্পর্কও কাজ করবে; টেবিল দুটো আলাদা রাখায় কিছু ভাঙে না
- Date Table-এর তারিখগুলো টানা হতে হবে — কোনো দিন বাদ পড়লে YTD/Last Year হিসাব ভুল আসবে। `CALENDAR()` টানা তারিখই দেয়

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| লাইন টানতে পারছি না | কলাম দুটোর ডেটা-টাইপ মিলছে না (Date বনাম Text) — Power Query-তে টাইপ ঠিক করো |
| Relationship inactive দেখাচ্ছে | একই নামে দুই জায়গায় সম্পর্ক থাকলে একটাই active থাকে; অপ্রয়োজনে ডিলিট করো |
| "Can't create relationship" | `Products[Product]`-এ ডুপ্লিকেট বা খালি মান আছে |
| Month কলাম এলোমেলো সাজে | `Month`-এ **Sort by column → MonthNumber** |
| Time Intelligence ভুল দিচ্ছে | `DateTable` **Mark as date table** করেছ কিনা দেখো |

পরের ধাপে [DAX](/power-bi/dax) — Measure দিয়ে আসল হিসাব শুরু।
