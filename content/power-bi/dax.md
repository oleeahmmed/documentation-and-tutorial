---
title: "পর্ব ৬ — DAX: Measure, CALCULATE, Time Intelligence"
description: Power BI-এর নিজস্ব ফর্মুলা-ভাষা — Measure বনাম Calculated Column, লাভের হিসাব, আর গত বছরের তুলনা।
icon: Sigma
---

## গল্প

চার্ট বানানোর আগে দরকার আসল সংখ্যাগুলো: মোট বিক্রি কত, লাভ কত, এই মাসে গত বছরের চেয়ে বেশি না কম। এগুলোর হিসাব লিখতে হয় **DAX**-এ (Data Analysis Expressions) — Power BI-র নিজস্ব ফর্মুলা-ভাষা। Excel-এর ফর্মুলার মতোই দেখতে, কিন্তু অনেক বেশি শক্তিশালী।

## ৬.১ — Calculated Column বনাম Measure

শুরু করার আগে সবচেয়ে গুরুত্বপূর্ণ পার্থক্যটা পরিষ্কার করে নাও:

| | Calculated Column | Measure |
| --- | --- | --- |
| কখন হিসাব হয় | ডেটা লোড/রিফ্রেশের সময়, **প্রতিটা সারিতে** | রিপোর্টে দেখানোর সময়, **প্রয়োজন অনুযায়ী** |
| মেমোরিতে জায়গা নেয় | হ্যাঁ — প্রতিটা সারির আলাদা মান সেভ হয় | না — শুধু ফলাফল হিসাব করে দেখায় |
| কখন ব্যবহার করবে | Slicer/ফিল্টারে ব্যবহার করতে হলে, সারি-ভিত্তিক মান | সব টোটাল, গড়, শতাংশ, তুলনা |
| উদাহরণ | `Revenue = Sales[Quantity] * Sales[UnitPrice]` | `Total Revenue = SUM(Sales[Revenue])` |

**নিয়ম: যেখানে সম্ভব Measure ব্যবহার করো।** এটা বেশি দক্ষ — বিশেষ করে লক্ষ লক্ষ সারির ফাইলে পার্থক্য স্পষ্ট।

> আমাদের `Revenue` কলামটা Power Query-তে (পর্ব ৪) বানানো — সেটাও কার্যত calculated column। দরকার ছিল প্রতিটা সারির মান, তাই ঠিকই আছে।

## ৬.২ — প্রথম Measure

1. **Report view**-এ যাও
2. ডান পাশের Data প্যানেলে `Sales` টেবিলে ডান ক্লিক → **New measure**
3. ফর্মুলা বার-এ লেখো:

```dax
Total Revenue = SUM(Sales[Revenue])
```

Enter চাপলে Data প্যানেলে `Sales`-এর নিচে একটা ক্যালকুলেটর আইকনের সাথে `Total Revenue` বসবে।

টাকা হিসেবে দেখাতে: মেজার সিলেক্ট করে উপরের **Measure tools** → **Format** → **Currency** (দশমিক ০ বা ২)।

### বাকি মূল Measure-গুলো

একইভাবে একটার পর একটা বানাও:

```dax
Total Quantity Sold = SUM(Sales[Quantity])
```

```dax
Total Cost = SUMX(Sales, Sales[Quantity] * RELATED(Products[CostPrice]))
```

```dax
Total Profit = [Total Revenue] - [Total Cost]
```

```dax
Profit Margin % = DIVIDE([Total Profit], [Total Revenue], 0)
```

```dax
Total Orders = DISTINCTCOUNT(Sales[OrderID])
```

```dax
Average Order Value = DIVIDE([Total Revenue], [Total Orders], 0)
```

`Profit Margin %`-এর ফরম্যাট **Percentage** করে নাও।

### কোড ব্যাখ্যা

| অংশ | কাজ |
| --- | --- |
| `SUM()` | একটা কলামের সাধারণ যোগফল |
| `SUMX(টেবিল, হিসাব)` | প্রতিটা সারিতে হিসাব করে, তারপর যোগ করে — দুই টেবিলের মান গুণ করতে এটাই লাগে |
| `RELATED()` | সম্পর্কিত টেবিল থেকে মান আনে — এখানে `Products`-এর `CostPrice`। কাজ করে কারণ পর্ব ৫-এ Relationship বানিয়েছি |
| `[Total Revenue]` | আগে বানানো Measure-কে রেফার করে (ব্র্যাকেটে, টেবিলের নাম ছাড়া) |
| `DIVIDE(a, b, 0)` | ভাগ, কিন্তু `b` শূন্য হলে এরর না দিয়ে ০ দেয় — তিন নম্বর প্যারামিটারটাই ফলব্যাক |
| `DISTINCTCOUNT()` | ইউনিক মানের সংখ্যা — কতগুলো আলাদা অর্ডার |

আরেকটা কথা: `Total Cost`-এ `SUMX` কেন? কারণ `Quantity` আছে `Sales`-এ, আর `CostPrice` আছে `Products`-এ। দুইটা আলাদা টেবিলের মান গুণ করতে হলে সারি ধরে ধরে (`X` ফাংশন) হিসাব করতে হয়। একই টেবিলে হলে `SUM(Sales[Quantity] * Sales[UnitPrice])`-ও চলত।

## ৬.৩ — CALCULATE: DAX-এর সবচেয়ে শক্তিশালী ফাংশন

করিম ভাই জানতে চান — শুধু **শীতকালীন** ক্যাটাগরির বিক্রি কত, বাকি সব বাদ দিয়ে:

```dax
Winter Revenue = CALCULATE([Total Revenue], Products[Category] = "শীতকালীন")
```

`CALCULATE` একটা Measure-কে নতুন শর্ত (filter) দিয়ে আবার হিসাব করায়। বাকি সব ফিল্টার যা রিপোর্টে সক্রিয় আছে (স্লাইসার, চার্টের অক্ষ) তা-ও সম্মান করে, শুধু এই শর্তটা তার সাথে যোগ হয়।

আরেকটা উদাহরণ — ঢাকার বিক্রি:

```dax
Dhaka Revenue = CALCULATE([Total Revenue], Sales[Region] = "ঢাকা")
```

## ৬.৪ — Time Intelligence

করিম ভাই এবার চান — এই বছরের বিক্রি গত বছরের সাথে তুলনা:

```dax
YTD Revenue = TOTALYTD([Total Revenue], DateTable[Date])
```

```dax
Last Year Revenue = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR(DateTable[Date]))
```

```dax
YoY Growth % = DIVIDE([Total Revenue] - [Last Year Revenue], [Last Year Revenue], 0)
```

`YoY Growth %`-এর ফরম্যাট **Percentage** দাও।

**এগুলো কাজ করার শর্ত:**

1. একটা সম্পূর্ণ, টানা **Date Table** থাকতে হবে — তাই পর্ব ৫-এ বানিয়েছি
2. `DateTable` **Mark as date table** করা থাকতে হবে
3. `Sales[Date]` আর `DateTable[Date]`-এর মধ্যে Relationship থাকতে হবে
4. মেজারগুলোতে তারিখের কলাম হিসেবে **সবসময় `DateTable[Date]`** ব্যবহার করো, `Sales[Date]` নয়

শর্তগুলোর একটা বাদ পড়লে ফলাফল ফাঁকা বা ভুল আসবে — এটাই নতুনদের সবচেয়ে সাধারণ ভুল।

## বাস্তবে কী ঘটে

- Measure ডেটা প্যানেলে দেখতে ছোট, কিন্তু চার্ট/কার্ডে বসালেই মান দেখায় — কারণ মান নির্ভর করে চারপাশের ফিল্টারের ওপর
- একই `Total Revenue` মেজার বছর-চার্টে বসালে বছরের হিসাব, মাস-চার্টে বসালে মাসের হিসাব দেয় — মেজার নিজে বদলায় না, **ফিল্টার কনটেক্সট** বদলায়
- `Winter Revenue` মেজারটা স্লাইসারে "উৎসব" সিলেক্ট করলেও শীতকালীনই দেখাবে — কারণ `CALCULATE`-এর ভেতরের শর্ত স্লাইসারকে ওভাররাইড করে
- মেজার ফর্মুলা বদলালে সব ভিজ্যুয়াল একসাথে আপডেট হয় — এক জায়গায় ঠিক করলেই সব জায়গায় ঠিক

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| মেজার ফাঁকা দেখাচ্ছে | Relationship আছে কিনা; `DateTable[Date]` ব্যবহার করছ কিনা দেখো |
| `RELATED` কাজ করছে না | `Products`-এর সাথে Relationship নেই বা inactive |
| বড় সংখ্যা ৳ ছাড়া দেখাচ্ছে | Measure tools → Format → Currency |
| ভাগফলে Error | `DIVIDE()` ব্যবহার করো, `/` নয় |
| `Winter Revenue` সব সময় শূন্য | ক্যাটাগরির বানান মিলছে না (স্পেস/অক্ষর) — টেবিল থেকে হুবহু কপি করো |
| Time Intelligence খালি | Date Table mark করা নেই, বা তারিখের সম্পর্ক text টাইপের |

পরের ধাপে [Visualizations](/power-bi/visualizations) — এই সংখ্যাগুলোকে চার্টে বসাব।
