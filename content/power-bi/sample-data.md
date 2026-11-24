---
title: পর্ব ২ — নমুনা ডেটা (করিম ভাইয়ের Excel)
description: sales_data.xlsx-এর কাঠামো — Sales ও Products শিট, প্রতিটা কলামের অর্থ, আর নিজে ২,০০০ সারির ডেটা বানানোর উপায়।
icon: FileSpreadsheet
---

## গল্প

করিম ভাইয়ের ফাইলটার নাম `sales_data.xlsx`। দুই বছর ধরে প্রতিটা বিক্রি একটা করে সারি হয়ে জমেছে — হাজার হাজার সারি। আমরা এটাই ব্যবহার করব। ফাইলটা না থাকলে নিচের ধাপে নিজে বানিয়ে নিতে পারো।

## ফাইলের ভেতরে কী আছে

দুটো শিট থাকবে:

### শিট ১ — `Sales`

| OrderID | Date | Product | Category | Region | Salesperson | Quantity | UnitPrice |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ORD-0001 | 2026-01-05 | উলের ওভারকোট | শীতকালীন | ঢাকা | রফিক | 3 | 1800 |
| ORD-0002 | 2026-01-07 | চাদর | শীতকালীন | রাজশাহী | সুমন | 5 | 900 |
| ORD-0003 | 2026-02-12 | মাফলার | শীতকালীন | ঢাকা | নাদিয়া | 10 | 350 |
| ORD-0004 | 2026-02-20 | পাঞ্জাবি | উৎসব | চট্টগ্রাম | তানভীর | 2 | 2200 |
| ORD-0005 | 2026-03-03 | শাড়ি | উৎসব | ঢাকা | মিম | 1 | 4200 |

| কলাম | অর্থ | ডেটা-টাইপ |
| --- | --- | --- |
| `OrderID` | প্রতিটা অর্ডারের ইউনিক নম্বর | Text |
| `Date` | বিক্রির তারিখ | Date |
| `Product` | পণ্যের নাম | Text |
| `Category` | শীতকালীন / উৎসব / নিয়মিত | Text |
| `Region` | বিক্রির অঞ্চল | Text |
| `Salesperson` | কে বিক্রি করেছে | Text |
| `Quantity` | কত পিস | Whole Number |
| `UnitPrice` | প্রতি পিসের দাম (৳) | Decimal |

### শিট ২ — `Products`

পণ্যের ক্যাটালগ, যেখানে **খরচের দাম** আছে — এটা পরে লাভ বের করতে লাগবে:

| Product | Category | CostPrice |
| --- | --- | --- |
| উলের ওভারকোট | শীতকালীন | 1200 |
| চাদর | শীতকালীন | 600 |
| মাফলার | শীতকালীন | 220 |
| পাঞ্জাবি | উৎসব | 1400 |
| শাড়ি | উৎসব | 2500 |

`Sales` শিটে খরচ নেই — শুধু বিক্রয়মূল্য। লাভ বের করতে হবে `Products`-এর `CostPrice`-এর সাথে জোড়া লাগিয়ে। এই কারণেই পর্ব ৫-এ Data Modeling লাগবে।

## ফাইল নিজে বানানো — দুটো উপায়

### উপায় ১: হাতে (২০-৩০ সারি)

Excel খুলে দুটো শিট বানাও — `Sales` আর `Products`। উপরের টেবিলের মতো হেডার লিখে ২০–৩০টা সারি বসাও। শেখার জন্য এতই যথেষ্ট, তবে চার্টে ট্রেন্ড বোঝা একটু কঠিন হবে।

### উপায় ২: Python দিয়ে ২,০০০ সারি

পাইথন থাকলে দুটো প্যাকেজ ইনস্টল করে এই স্ক্রিপ্টটা চালাও:

```bash
pip install pandas openpyxl
```

```python
# make_sample_data.py
import random
from datetime import date, timedelta

import pandas as pd

products = [
    ("উলের ওভারকোট", "শীতকালীন", 1200),
    ("চাদর", "শীতকালীন", 600),
    ("মাফলার", "শীতকালীন", 220),
    ("পাঞ্জাবি", "উৎসব", 1400),
    ("শাড়ি", "উৎসব", 2500),
    ("কুর্তি", "নিয়মিত", 750),
    ("শার্ট", "নিয়মিত", 650),
]
regions = ["ঢাকা", "রাজশাহী", "চট্টগ্রাম", "খুলনা", "সিলেট"]
people = ["রফিক", "সুমন", "নাদিয়া", "তানভীর", "মিম"]

start = date(2024, 1, 1)
rows = []
for i in range(2000):
    product, category, cost = random.choice(products)
    rows.append({
        "OrderID": f"ORD-{i + 1:04d}",
        "Date": start + timedelta(days=random.randint(0, 1000)),
        "Product": product,
        "Category": category,
        "Region": random.choice(regions),
        "Salesperson": random.choice(people),
        "Quantity": random.randint(1, 12),
        "UnitPrice": cost + random.randint(150, 900),
    })

sales = pd.DataFrame(rows).sort_values("Date")
product_catalog = pd.DataFrame(products, columns=["Product", "Category", "CostPrice"])

with pd.ExcelWriter("sales_data.xlsx", engine="openpyxl") as writer:
    sales.to_excel(writer, sheet_name="Sales", index=False)
    product_catalog.to_excel(writer, sheet_name="Products", index=False)

print(f"sales_data.xlsx তৈরি — {len(sales)} সারি")
```

চালাও:

```bash
python make_sample_data.py
```

আউটপুট:

```text
sales_data.xlsx তৈরি — 2000 সারি
```

এখন ফোল্ডারে `sales_data.xlsx` আছে — পরের পর্বে এটাই Power BI-তে আনব।

> **উপায় ২-এ সমস্যা হলে:** `ModuleNotFoundError: pandas` এলে `pip install pandas openpyxl` আবার চালাও। Excel ফাইল খোলা থাকা অবস্থায় স্ক্রিপ্ট চালালে `PermissionError` আসতে পারে — Excel বন্ধ করে চালাও।

## ইচ্ছে করে ডেটা "নোংরা" করে নাও

পরের পর্বে Power Query-র দরকারটা বোঝার জন্য Excel-এ গিয়ে ইচ্ছে করে তিনটা সমস্যা বানিয়ে ফেলো:

1. একই সারি কপি-পেস্ট করে **২-৩টা ডুপ্লিকেট** বানাও
2. একটা সারির `Quantity` ঘর **খালি** রাখো
3. এক বা দুইটা `Date` ঘরে তারিখের জায়গায় **টেক্সট** লেখো (যেমন `৫ জানুয়ারি`)

বাস্তব ফাইলেও এ ধরনের ভুল থাকে — পর্ব ৪-এ এগুলোই ঠিক করব।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Python নেই | উপায় ১-এ হাতে বানাও, টিউটোরিয়াল চলবে |
| `pandas` ইনস্টল হচ্ছে না | `python -m pip install --upgrade pip` তারপর আবার |
| বাংলা অক্ষর এলোমেলো দেখাচ্ছে | Excel-এ ফাইল খোলো (CSV নয়), PowerShell-এ প্রিন্ট করলে Bengali ভাঙা দেখাতে পারে |
| ফাইল সেভ হচ্ছে না | `sales_data.xlsx` কোনো Excel-এ খোলা আছে কিনা দেখো |

পরের ধাপে [Get Data](/power-bi/get-data) — ফাইলটা Power BI-তে আনব।
