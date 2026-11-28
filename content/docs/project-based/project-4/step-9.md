---
title: "ধাপ ৯ — আরিফের বিশেষ ক্ষমতা (Tool)"
description: schedule_followup — ফলো-আপের তারিখ ও কারণ followups.json-এ লিখে রাখে।
icon: Wrench
---

## লক্ষ্য

আরিফের হাতে ফলো-আপ শিডিউল করার টুল।

## ফাইল খোলো

`src/lead_gen_agent/tools/custom_tool.py` ফাইলের সব মুছে এটা বসাও:

```python
import json, os, datetime
from crewai.tools import BaseTool


class ScheduleFollowupTool(BaseTool):
    name: str = "schedule_followup"
    description: str = (
        "একটা লিডের জন্য ফলো-আপ শিডিউল করতে এই টুল ব্যবহার করো। "
        "lead_name, days_from_now, reason — এই তিনটা প্যারামিটার দাও।"
    )

    def _run(self, lead_name: str, days_from_now: int, reason: str) -> str:
        followup_date = (
            datetime.date.today() + datetime.timedelta(days=days_from_now)
        ).isoformat()
        record = {
            "lead_name": lead_name,
            "followup_date": followup_date,
            "reason": reason,
            "created_at": datetime.datetime.now().isoformat(),
        }
        data = []
        if os.path.exists("followups.json"):
            with open("followups.json", "r", encoding="utf-8") as f:
                data = json.load(f)
        data.append(record)
        with open("followups.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return f"{lead_name}-এর জন্য ফলো-আপ শিডিউল হয়েছে {followup_date}-এ। কারণ: {reason}"
```

এটা যেন আরিফকে একটা **"ক্যালেন্ডারে রিমাইন্ডার বসানোর বাটন"** দেওয়া হলো। সে যখন ঠিক করবে ফলো-আপ দরকার, এই বাটন চাপবে, আর `followups.json` ফাইলে তারিখ-কারণ লেখা হয়ে যাবে।

## কোন অংশ কী করে

| অংশ | কাজ |
| --- | --- |
| `name` | টুলের নাম — LLM এই নামেই বাছে |
| `description` | কখন কল করবে + কোন তিনটা প্যারামিটার দেবে |
| `days_from_now` | আজ থেকে কত দিন পরে (যেমন ৩) |
| `followup_date` | হিসাব করে ISO তারিখ (`2026-12-01`) |
| `followups.json` | প্রতিবার append — পুরোনো ট্র্যাক মুছবে না |
| return | agent-কে ছোট কনফার্মেশন |

> **এটা নিজে থেকে ইমেইল পাঠায় না** — শুধু লগ করে। কে কখন পাঠাবে, সেটা ধাপ ১৪-এর "বাস্তব কথা" অংশে বলা আছে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| টুল কল হচ্ছে না | description-এ "ইমেইল লেখার পর প্রতিবার" লিখে আরও স্পষ্ট করো |
| `followups.json` নেই | টেস্ট লিড দিয়ে চালাও, বা `days_from_now` সহ টুল ম্যানুয়ালি টেস্ট করো |
| `ModuleNotFoundError` | `pip install crewai crewai-tools` আবার চালাও |

## চেকলিস্ট

- [ ] `ScheduleFollowupTool` ক্লাস
- [ ] `name = "schedule_followup"`
- [ ] `followups.json`-এ append লজিক

➡️ পরের ধাপ: [ধাপ ১০ — skills.md](/docs/project-based/project-4/step-10)
