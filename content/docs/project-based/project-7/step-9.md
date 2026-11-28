---
title: "ধাপ ৯ — নাঈমের বিশেষ ক্ষমতা (Tool)"
description: send_digest — সকালের ডাইজেস্ট চ্যানেলসহ sent_digests.json-এ লগ করে।
icon: Wrench
---

## লক্ষ্য

নাঈমের হাতে ডাইজেস্ট পাঠানোর (ও লগ করার) টুল।

## ফাইল খোলো

`src/inbox_agent/tools/custom_tool.py` ফাইলের সব মুছে এটা বসাও:

```python
import json, os, datetime
from crewai.tools import BaseTool


class SendDigestTool(BaseTool):
    name: str = "send_digest"
    description: str = (
        "সকালের ইমেইল ডাইজেস্ট পাঠাতে এই টুল ব্যবহার করো। "
        "digest_text এবং channel (whatsapp/slack/telegram) দাও।"
    )

    def _run(self, digest_text: str, channel: str = "whatsapp") -> str:
        record = {
            "sent_at": datetime.datetime.now().isoformat(),
            "channel": channel,
            "digest_text": digest_text,
        }
        data = []
        if os.path.exists("sent_digests.json"):
            with open("sent_digests.json", "r", encoding="utf-8") as f:
                data = json.load(f)
        data.append(record)
        with open("sent_digests.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return f"ডাইজেস্ট {channel}-এ পাঠানো হয়েছে।"
```

ভাবো, এটা যেন নাঈমকে একটা **"মেসেজ পাঠানোর বাটন"** দেওয়া হলো — ডাইজেস্ট রেডি হলেই সে চাপে, `sent_digests.json`-এ লগ হয়ে যায়।

## কোন অংশ কী করে

| অংশ | কাজ |
| --- | --- |
| `name` | টুলের নাম — LLM এই নামেই বাছে |
| `description` | কখন কল করবে + কোন প্যারামিটার দেবে |
| `channel: str = "whatsapp"` | চ্যানেল না বললে ডিফল্ট হোয়াটসঅ্যাপ |
| `os.path.exists(...)` | ফাইল নতুন হলে খালি লিস্ট থেকে শুরু |
| `json.dump(..., ensure_ascii=False)` | বাংলা ঠিক রেখে সুন্দর ফরম্যাটে সেভ |
| return | নাঈমকে ছোট কনফার্মেশন |

> **এখানে আসলে "পাঠানো" হচ্ছে না** — মেসেজ ফাইলে লগ হচ্ছে, যাতে flow টেস্ট করা যায়। আসল WhatsApp/Slack/Telegram-এ পাঠাতে এই টুলের ভেতরে তাদের API কল বসাতে হবে (ধাপ ১৪-এর "বাস্তব কথা")।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| টুল কল হচ্ছে না | description-এ "ডাইজেস্ট রেডি হলে অবশ্যই পাঠাও" লিখে আরও স্পষ্ট করো |
| `sent_digests.json` নেই | টেস্ট ইনবক্স দিয়ে চালাও, বা টুল ম্যানুয়ালি একবার কল করো |
| `ModuleNotFoundError` | `pip install crewai crewai-tools` আবার চালাও |
| JSON ভাঙছে | পুরোনো ফাইল মুছে আবার চালাও — কোডই নতুন করে লিস্ট বানাবে |

## চেকলিস্ট

- [ ] `SendDigestTool` ক্লাস
- [ ] `name = "send_digest"`
- [ ] `channel` প্যারামিটার + JSON-এ append

➡️ পরের ধাপ: [ধাপ ১০ — skills.md](/docs/project-based/project-7/step-10)
