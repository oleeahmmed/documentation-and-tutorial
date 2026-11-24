---
title: "পর্ব ৪ — Power Query Editor: ডেটা পরিষ্কার"
description: ডেটা-টাইপ ঠিক করা, ডুপ্লিকেট ও খালি সারি বাদ, Revenue কলাম — আর Applied Steps ও M ভাষা।
icon: Filter
---

## গল্প

করিম ভাইয়ের ফাইলে তিনটা রোগ: একই অর্ডার দুইবার ঢুকেছে, কিছু ঘর খালি, আর তারিখগুলো কোথাও টেক্সট হয়ে গেছে। আরেকটা সমস্যা — ফাইলে **মোট বিক্রয়মূল্য** (Quantity × UnitPrice) কলামই নেই; করিম ভাই চান প্রতিটা সারির মোট দাম দেখতে।

Power Query Editor-এ এই চারটাই ঠিক করব। এটাই Power BI-র "রান্নাঘর" — ডেটা পরিষ্কার না করে চার্ট বানালে ভুল হিসাব আসবে।

## ৪.১ — ডেটা-টাইপ ঠিক করা

প্রতিটা কলামের হেডারের পাশে ছোট আইকন থাকে — `ABC` (টেক্সট), `123` (সংখ্যা), ক্যালেন্ডার (তারিখ)। এক নজরে দেখো:

| কলাম | হওয়া উচিত |
| --- | --- |
| `Date` | Date (ক্যালেন্ডার আইকন) |
| `Quantity` | Whole Number (`123`) |
| `UnitPrice` | Decimal Number (`1.2`) |
| বাকি সব | Text (`ABC`) |

**হাতে-কলমে:**

1. `Date` কলামের হেডারে ডান ক্লিক করো
2. **Change Type → Date** বেছে নাও
3. একইভাবে `Quantity` → **Whole Number**, `UnitPrice` → **Decimal Number**

কোনো ঘরে ভুল টেক্সট থাকলে (যেমন `৫ জানুয়ারি`) সেই ঘরে **Error** লেখা আসবে। `Date` হেডারের ড্রপডাউনে ক্লিক করে **Remove Errors** চালাও — ওই ভাঙা সারিগুলো বাদ যাবে।

> `UnitPrice`-এর জন্য **Fixed Decimal Number**-ও ব্যবহার করা যায় — টাকার হিসাবে এটি বেশি নিরাপদ, কারণ এটি রাউন্ডিংয়ে কম ভুল করে। শুরুতে `Decimal Number` ঠিক আছে।

## ৪.২ — ডুপ্লিকেট সারি বাদ

Home ট্যাব → **Remove Rows** → **Remove Duplicates**

Power Query পুরো সারিটা মিলিয়ে দেখে, হুবহু একই সারি থাকলে প্রথমটা রেখে বাকিগুলো বাদ দেয়। বাদ পড়া সারির সংখ্যা Status bar-এ দেখায়।

## ৪.৩ — খালি সারি বাদ

যে কলামে খালি ঘর আছে (যেমন `Quantity`), তার হেডারের ড্রপডাউনে ক্লিক করো → **Remove Empty**।

## ৪.৪ — নতুন কলাম: Revenue

1. উপরে **Add Column** ট্যাবে যাও
2. **Custom Column** ক্লিক করো
3. New column name: `Revenue`
4. Custom column formula:

```text
= [Quantity] * [UnitPrice]
```

5. **OK**

নতুন কলামটা আসবে — টাইপটা **Decimal Number** করে নাও (হেডারের আইকনে ক্লিক করে)।

## ৪.৫ — Applied Steps আর M ভাষা

ডান পাশের **Applied Steps** প্যানেলে দেখো — প্রতিটা কাজ একটা ধাপ হয়ে জমেছে:

```text
Source
Navigation
Changed Type
Removed Duplicates
Filtered Rows
Added Custom
```

এটাই Power Query-র সবচেয়ে বড় সুবিধা: **প্রতিটা ধাপ রেকর্ড থাকে**। ভুল হলে ধাপের পাশের ✕ ক্লিক করে বাদ দাও, আগের অবস্থায় ফিরে যাবে। ধাপের নাম বদলানো, উপরে-নিচে সরানোও যায়।

Home → **Advanced Editor** ক্লিক করলে পুরো কোডটা দেখা যায় — Power Query ভেতরে **M ভাষা** ব্যবহার করে, তুমি যা ক্লিক করছ সেটা স্বয়ংক্রিয়ভাবে M কোডে রূপান্তর হচ্ছে:

```text
let
    Source = Excel.Workbook(File.Contents("sales_data.xlsx"), null, true),
    Sales_Sheet = Source{[Item="Sales", Kind="Sheet"]}[Data],
    PromotedHeaders = Table.PromoteHeaders(Sales_Sheet, [PromoteAllScalars=true]),
    ChangedType = Table.TransformColumnTypes(
        PromotedHeaders,
        {{"Date", type date}, {"Quantity", Int64.Type}, {"UnitPrice", type number}}
    ),
    RemovedDuplicates = Table.Distinct(ChangedType),
    AddedRevenue = Table.AddColumn(
        RemovedDuplicates, "Revenue", each [Quantity] * [UnitPrice], type number
    )
in
    AddedRevenue
```

লক্ষ করো — `each [Quantity] * [UnitPrice]` ঠিক সেই ফর্মুলাটাই যা Custom Column-এ লিখেছিলে। M ভাষা আলাদা করে শেখা বাধ্যতামূলক নয়; ক্লিক করলে কোড নিজেই তৈরি হয়।

## ৪.৬ — লোড করা

সব ঠিক হলে Home ট্যাব → **Close & Apply** ক্লিক করো। Power Query বন্ধ হবে, ডেটা Power BI-র মডেলে লোড হবে। বাম দিকের **Table view**-এ গিয়ে `Sales` টেবিলটা দেখো — নতুন `Revenue` কলাম আর পরিষ্কার সারিগুলো থাকবে।

## বাস্তবে কী ঘটে

- Applied Steps-এর ধাপগুলো **ডেটা রাখে না**, শুধু রেসিপি রাখে। তুমি "Remove Duplicates" করলে অর্ডিনাল ফাইল থেকে ডেটা মুছে যায় না — শুধু Power BI-তে লোড হওয়া ভার্সন থেকে বাদ যায়
- প্রতি **Refresh**-এ পুরো রেসিপিটা আবার চলে — ফাইলে নতুন ডুপ্লিকেট এলে সেগুলোও স্বয়ংক্রিয়ভাবে বাদ যাবে
- ধাপের ক্রম গুরুত্বপূর্ণ। "Remove Duplicates" যদি "Added Custom"-এর পরে বসাও, তাহলে Revenue হিসাব হওয়ার পর ডুপ্লিকেট খোঁজা হবে — তখন মূল সারিগুলো আর হুবহু এক নাও থাকতে পারে
- ক্লিক করে বানানো ধাপগুলো Advanced Editor-এ হাতে লিখেও বদলানো যায় — দুটোই একই জিনিস

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `Date` কলামে সব Error | হেডারের ড্রপডাউন → **Remove Errors**, অথবা Excel-এ তারিখ ঠিক করে আবার Refresh |
| ডুপ্লিকেট এখনো আছে | Applied Steps-এ `Removed Duplicates` আছে কিনা দেখো; কিছু সারি ভিন্ন Date/Price হলে হুবহু মিলবে না |
| `Revenue` কলামে Error | `Quantity` বা `UnitPrice`-এ টেক্সট/খালি আছে — টাইপ ঠিক করে ধাপটা আবার চালাও |
| Close & Apply ধূসর | কোনো ধাপে এরর আছে; Applied Steps-এ লাল এরর আইকন দেখো |
| লোড হতে অনেক সময় লাগছে | কলাম বাদ দাও যেগুলো লাগবে না (Remove Columns), বা শুধু দরকারি সারি রাখো |

পরের ধাপে [Data Modeling](/power-bi/data-modeling) — `Products` টেবিল আর Date Table জোড়া লাগাব।
