---
title: "ধাপ ৯ — পিয়ার বিশেষ ক্ষমতা (Tool)"
description: send_notification — রেডি ইমেইল পাঠিয়ে sent_notifications.json-এ লগ করে।
icon: Wrench
---

## লক্ষ্য

পিয়ার হাতে ইমেইল পাঠানোর (এই টিউটোরিয়ালে ফাইলে লগ করার) টুল।

## ফাইল খোলো

`src/order_notify_agent/tools/custom_tool.py` ফাইলের সব মুছে এটা বসাও:

```python
import json, os, datetime
from crewai.tools import BaseTool


class SendNotificationTool(BaseTool):
    name: str = "send_notification"
    description: str = (
        "কাস্টমারকে ইমেইল নোটিফিকেশন পাঠাতে এই টুল ব্যবহার করো। "
        "customer_name, event_type, subject, body দাও।"
    )

    def _run(self, customer_name: str, event_type: str, subject: str, body: str) -> str:
        record = {
            "customer_name": customer_name,
            "event_type": event_type,
            "subject": subject,
            "body": body,
            "sent_at": datetime.datetime.now().isoformat(),
        }
        path = "sent_notifications.json"
        data = []
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
        data.append(record)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return f"{customer_name}-কে '{event_type}' ইমেইল পাঠানো হয়েছে।"
```

ভাবো, এটা যেন পিয়াকে একটা **"সেন্ড বাটন"** দেওয়া হলো — ইমেইল রেডি হলেই সে চাপে, `sent_notifications.json`-এ লগ হয়ে যায়।

## কোন অংশ কী করে

| অংশ | কাজ |
| --- | --- |
| `name` | টুলের নাম — LLM এই নামেই বাছে |
| `description` | কখন কল করবে + কোন চারটা প্যারামিটার দেবে |
| `record` | এক ইমেইলের পূর্ণ স্মৃতি — কে, কোন ইভেন্টে, কী বিষয়, কী বডি, কখন |
| `os.path.exists(path)` | ফাইল নতুন হলে খালি লিস্ট থেকে শুরু |
| `json.dump(..., ensure_ascii=False)` | বাংলা ও ইমোজি ঠিক রেখে সুন্দর ফরম্যাটে সেভ |

> **এখানে আসলে ইমেইল যাচ্ছে না** — শুধু JSON ফাইলে এন্ট্রি হচ্ছে। আসল ইমেইল পাঠাতে এই টুলের ভেতরে SMTP/SendGrid/AWS SES কল বসবে (ধাপ ১৪-এর "বাস্তব কথা")।

> **সব ইভেন্ট এক ফাইলে:** এখানে শর্টলিস্ট/নন-শর্টলিস্টের মতো দুই শাখা নেই — অর্ডার কনফার্মেশন, রসিদ, ট্র্যাকিং, কার্ট রিমাইন্ডার সব একই `sent_notifications.json`-এ যায়; `event_type` ফিল্ড দেখে আলাদা করা যায়। পরে ড্যাশবোর্ডে এই ফাইলটাই "কাকে কখন কী পাঠানো হলো"র সূত্র।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| টুল কল হচ্ছে না | description-এ "ইমেইল চূড়ান্ত হলে অবশ্যই পাঠাও" লিখে আরও স্পষ্ট করো |
| `sent_notifications.json` তৈরি হচ্ছে না | পিয়ার টাস্কের description আর `crew.py`-র `tools=[...]` মিলাও |
| `ModuleNotFoundError` | `pip install crewai crewai-tools` আবার চালাও |
| JSON ভাঙছে | পুরোনো ফাইল মুছে আবার চালাও |
| ইমোজি/বাংলা ভাঙছে | `ensure_ascii=False` আর `encoding="utf-8"` দুটোই আছে কিনা দেখো |

## চেকলিস্ট

- [ ] `SendNotificationTool` ক্লাস
- [ ] `name = "send_notification"`
- [ ] `sent_notifications.json`-এ লেখার লজিক

➡️ পরের ধাপ: [ধাপ ১০ — skills.md](/docs/project-based/project-9/step-10)
