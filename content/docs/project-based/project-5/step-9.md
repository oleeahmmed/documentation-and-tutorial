---
title: "ধাপ ৯ — সুমাইয়ার বিশেষ ক্ষমতা (Tool)"
description: save_to_ledger — যাচাই করা এন্ট্রি ledger.csv-এ এক লাইন হিসেবে যোগ করে।
icon: Wrench
---

## লক্ষ্য

সুমাইয়ার হাতে লেজারে এন্ট্রি লেখার টুল।

## ফাইল খোলো

`src/invoice_agent/tools/custom_tool.py` ফাইলের সব মুছে এটা বসাও:

```python
import csv, os, datetime
from crewai.tools import BaseTool


class SaveToLedgerTool(BaseTool):
    name: str = "save_to_ledger"
    description: str = (
        "যাচাই করা ইনভয়েস ডেটা লেজারে (CSV ফাইলে) সেভ করতে এই টুল ব্যবহার করো। "
        "vendor_name, invoice_date, total_amount, category, invoice_number দাও।"
    )

    def _run(
        self,
        vendor_name: str,
        invoice_date: str,
        total_amount: str,
        category: str,
        invoice_number: str,
    ) -> str:
        path = "ledger.csv"
        is_new = not os.path.exists(path)
        with open(path, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            if is_new:
                writer.writerow(
                    ["recorded_at", "vendor_name", "invoice_date", "total_amount", "category", "invoice_number"]
                )
            writer.writerow(
                [datetime.datetime.now().isoformat(), vendor_name, invoice_date, total_amount, category, invoice_number]
            )
        return f"লেজারে সেভ হয়েছে: {vendor_name} — {total_amount} ({category})"
```

ভাবো, এটা যেন সুমাইয়াকে একটা **"খাতায় এন্ট্রি লেখার কলম"** দেওয়া হলো — সে যাচাই শেষ হলেই এটা দিয়ে `ledger.csv`-এ একটা লাইন যোগ করে দেয়।

## কোন অংশ কী করে

| অংশ | কাজ |
| --- | --- |
| `name` | টুলের নাম — LLM এই নামেই বাছে |
| `description` | কখন কল করবে + কোন পাঁচটা প্যারামিটার দেবে |
| `is_new` | ফাইল নতুন হলে একবার হেডার লেখে |
| `"a"` মোড | প্রতিবার append — পুরোনো এন্ট্রি মুছবে না |
| `recorded_at` | কখন এন্ট্রি হলো তার টাইমস্ট্যাম্প |
| return | agent-কে ছোট কনফার্মেশন |

> **নাম্বার টেক্সট হিসেবে সরাসরি যায়** — `total_amount` `str`-এ রাখা হয়েছে যাতে `BDT 18,500`-এর মতো লেখাও নষ্ট না হয়। অঙ্ক নিয়ে হিসাব করতে হলে ধাপ ১৪-এর "বাস্তব কথা" দেখো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| টুল কল হচ্ছে না | description-এ "দুজনের তথ্য মিলিয়ে সেভ করাই তোমার কাজ" লিখে আরও স্পষ্ট করো |
| `ledger.csv` নেই | টেস্ট ইনভয়েস দিয়ে চালাও, বা টুল ম্যানুয়ালি একবার কল করো |
| `ModuleNotFoundError` | `pip install crewai crewai-tools` আবার চালাও |

## চেকলিস্ট

- [ ] `SaveToLedgerTool` ক্লাস
- [ ] `name = "save_to_ledger"`
- [ ] `ledger.csv`-এ append লজিক + হেডার

➡️ পরের ধাপ: [ধাপ ১০ — skills.md](/docs/project-based/project-5/step-10)
