---
title: "ধাপ ৯ — সাকিবের বিশেষ ক্ষমতা (Tool)"
description: escalate_to_human — উত্তর না পেলে বা কাস্টমার ক্ষুব্ধ হলে কারণটা escalations.json-এ লিখে রাখে।
icon: Wrench
---

## লক্ষ্য

সাকিবের হাতে একটা টুল দেওয়া — যেটা দিয়ে সে মানুষ ম্যানেজারের জন্য একটা নোট লিখে রাখতে পারবে।

## ফাইল খোলো

`src/support_agent/tools/custom_tool.py` ফাইলের সব মুছে এটা বসাও:

```python
import json, os, datetime
from crewai.tools import BaseTool


class EscalationTool(BaseTool):
    name: str = "escalate_to_human"
    description: str = (
        "তথ্য knowledge base-এ না পাওয়া গেলে বা কাস্টমার অত্যন্ত ক্ষুব্ধ হলে এটা কল করো। "
        "reason এবং customer_summary দাও।"
    )

    def _run(self, reason: str, customer_summary: str) -> str:
        record = {
            "timestamp": datetime.datetime.now().isoformat(),
            "reason": reason,
            "summary": customer_summary,
        }
        data = []
        if os.path.exists("escalations.json"):
            with open("escalations.json", "r", encoding="utf-8") as f:
                data = json.load(f)
        data.append(record)
        with open("escalations.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return f"এস্কেলেট করা হয়েছে। কারণ: {reason}"
```

ভাবো — এটা যেন সাকিবকে একটা **"বস-কে ফোন করার বাটন"** দেওয়া হলো। সে যখন বুঝবে নিজে সমাধান করতে পারছে না, বা কাস্টমার খুব বিরক্ত, তখন এই বাটন চাপবে, আর `escalations.json` ফাইলে কারণটা লেখা হয়ে যাবে।

## কোন অংশ কী করে

| অংশ | কাজ |
| --- | --- |
| `name` | টুলের নাম — LLM এই নাম দেখে টুল বাছে |
| `description` | কখন কল করবে — এই লেখাটাই LLM-এর একমাত্র নির্দেশনা |
| `_run(self, reason, customer_summary)` | আসল কাজ; LLM নিজে থেকে এই দুটো আর্গুমেন্ট ভরে দেয় |
| `escalations.json` | প্রতিবার একটা রেকর্ড যোগ হয়ে জমা থাকে (আগেরগুলো মুছবে না) |
| return | agent-কে ছোট্ট কনফার্মেশন — সে এটা দেখে বাকি রিপ্লাই লিখবে |

> **`escalations.json` কোথায় তৈরি হয়?** যে ফোল্ডার থেকে তুমি `crewai run` চালাবে, সেখানেই। চাইলে পরে এই ফাইলটা ম্যানেজারকে দেখানোর জন্য আলাদা জায়গায় রাখতে পারো।

> **নিরাপত্তা:** `reason`/`customer_summary` LLM থেকে আসা লেখা — ফাইলে লেখা হয় ঠিক আছে, কিন্তু ভবিষ্যতে এগুলো কোনো কমান্ড বা SQL-এ সরাসরি বসাবে না; তখন ভ্যালিডেট করো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: crewai.tools` | `pip install crewai crewai-tools` আবার চালাও |
| টুল কখনো কল হচ্ছে না | description-এ আরও স্পষ্ট করো: "যখন knowledge-এ উত্তর নেই তখনই কল করো" |
| `escalations.json` খালি/নেই | টেস্ট ইমেইলে এমন প্রশ্ন দাও যার উত্তর FAQ-তে নেই |
| ফাইল লিখতে পারছে না | প্রজেক্ট ফোল্ডারে লেখার অধিকার আছে কিনা দেখো |

## চেকলিস্ট

- [ ] `EscalationTool` ক্লাস লেখা হয়েছে
- [ ] `name = "escalate_to_human"`
- [ ] `escalations.json`-এ append করার লজিক আছে

➡️ পরের ধাপ: [ধাপ ১০ — skills.md](/docs/project-based/project-3/step-10)
