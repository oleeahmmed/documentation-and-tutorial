---
title: সারসংক্ষেপ — করিম ভাইয়ের সমস্যা সমাধান
description: কোন প্রশ্নের উত্তর কোথায় — পুরো যাত্রার ম্যাপ, চেকলিস্ট আর পরের গন্তব্য।
icon: CheckCircle2
---

## গল্পের সমাপ্তি

শুরুতে করিম ভাইয়ের হাতে ছিল শুধু একটা Excel ফাইল আর কিছু প্রশ্ন। এখন তাঁর হাতে আছে এমন একটা রিপোর্ট, যেটা এক নজরে ব্যবসার অবস্থা দেখায়, ফোনে খোলা যায়, আর প্রতি মাসে নতুন ডেটা দিলে নিজে থেকেই আপডেট হয়।

## কোন প্রশ্নের উত্তর কোথায়

| করিম ভাইয়ের প্রশ্ন | Power BI-র সমাধান | কোন পর্বে |
| --- | --- | --- |
| "কোন মাসে বিক্রি কমছে?" | Line Chart + DateTable | [৭](/power-bi/visualizations) |
| "কোন অঞ্চল খারাপ করছে?" | Bar Chart + Map | [৭](/power-bi/visualizations) |
| "কোন বিক্রয়কর্মী সেরা?" | Matrix (Salesperson × Month) | [৭](/power-bi/visualizations) |
| "লাভের পরিমাণ কত?" | DAX Measure — `Total Profit` | [৬](/power-bi/dax) |
| "গত বছরের সাথে তুলনা?" | Time Intelligence — `SAMEPERIODLASTYEAR` | [৬](/power-bi/dax) |
| "প্রতি মাসে নতুন ডেটা দিলে আপডেট হোক" | Scheduled Refresh | [১১](/power-bi/publish-refresh) |
| "ম্যানেজাররা শুধু নিজের অঞ্চল দেখুক" | Row-Level Security | [১২](/power-bi/row-level-security) |
| "কম বিক্রি যেন চোখে পড়ে" | Conditional Formatting | [৮](/power-bi/conditional-formatting) |
| "এক বাটনে শীতকালীন, আরেক বাটনে সব" | Bookmarks | [১০](/power-bi/interactivity) |

## পুরো শেখার পথ

```text
Get Data → Excel থেকে ডেটা আনা
    ↓
Power Query Editor → পরিষ্কার করা (টাইপ, ডুপ্লিকেট, নতুন কলাম)
    ↓
Data Modeling → Star Schema, Date Table, Relationship
    ↓
DAX → Measure, CALCULATE, Time Intelligence
    ↓
Visualizations → Card, Line, Bar, Map, Matrix, Slicer
    ↓
Conditional Formatting → সমস্যা চোখে পড়ার মতো করা
    ↓
Dashboard → এক পেজে গুছিয়ে সাজানো
    ↓
Drill-down ও Bookmarks → ইন্টারঅ্যাকটিভিটি
    ↓
Publish → Power BI Service-এ আপলোড
    ↓
Scheduled Refresh → স্বয়ংক্রিয় আপডেট
    ↓
Row-Level Security → কে কী দেখবে নিয়ন্ত্রণ
```

## চেকলিস্ট

সব ঠিকঠাক হলে এগুলো তোমার কাছে থাকবে:

- [ ] `sales_data.xlsx` — `Sales` আর `Products` শিটসহ
- [ ] Power Query-তে পরিষ্কার ডেটা: টাইপ ঠিক, ডুপ্লিকেট বাদ, `Revenue` কলাম
- [ ] মডেলে `Sales`, `Products`, `DateTable` — Star Schema ও Relationship
- [ ] মেজার: `Total Revenue`, `Total Cost`, `Total Profit`, `Profit Margin %`, `YoY Growth %`
- [ ] ড্যাশবোর্ডে Card, Line, Bar, Map, Matrix আর দুটো Slicer
- [ ] Matrix-এ Conditional Formatting
- [ ] Drill-down আর দুটো Bookmark বাটন
- [ ] `rupashi_dashboard.pbix` সেভ করা ফাইল
- [ ] Service-এ পাবলিশ করা রিপোর্ট, Refresh চালু
- [ ] `Dhaka Manager` Role আর Member অ্যাসাইনমেন্ট

## এখান থেকে কোথায় যাবে

- **Power Automate** — বিক্রি নির্দিষ্ট সীমার নিচে নামলে অটো ইমেইল/Teams অ্যালার্ট
- **আরও DAX** — `CALCULATE` + `FILTER`, Ranking (`RANKX`), Running Total
- **Dataverse/SQL কানেক্টর** — Excel-এর বদলে সরাসরি ডেটাবেস থেকে ডেটা
- **Pagination রিপোর্ট** — প্রিন্টের জন্য একাধিক পেজের রিপোর্ট
- **Deployment Pipeline** — ডেভেলপমেন্ট → টেস্ট → প্রোডাকশন Workspace

## এক নজরে দুই জগত

| | Python/CrewAI/Django/FastAPI | Power BI |
| --- | --- | --- |
| মূল কাজ | অ্যাপ আর API বানানো | ডেটা বিশ্লেষণ ও রিপোর্ট |
| ইনপুট | কোড | Excel/ডেটাবেস + ক্লিক |
| আউটপুট | চলমান সার্ভিস | ইন্টারঅ্যাকটিভ ড্যাশবোর্ড |
| ব্যবহারকারী | ডেভেলপার ও কাস্টমার | ব্যবসার মালিক ও ম্যানেজার |

দুটো একসাথে ভালো কাজ করে — ডেটা জোগাড়/পরিষ্কার করতে Python, আর সেটা দেখাতে Power BI। রূপসী ফ্যাশনের গল্প এখানেই শেষ নয় — করিম ভাইয়ের জন্য CrewAI এজেন্ট বানানোর গল্পটা [Project Based](/docs/project-based) সেকশনে আছে।

➡️ শুরু থেকে আবার: [ইনস্টলেশন](/power-bi/installation)
