---
title: "ধাপ ৯ — তিশার বিশেষ ক্ষমতা (Tool)"
description: send_calendar_invite — মিটিং লিংক বানিয়ে scheduled_meetings.json-এ লগ করে।
icon: Wrench
---

## লক্ষ্য

তিশার হাতে ইনভাইট পাঠানোর (ও লগ করার) টুল।

## ফাইল খোলো

`src/scheduling_agent/tools/custom_tool.py` ফাইলের সব মুছে এটা বসাও:

```python
import json, os, datetime, uuid
from crewai.tools import BaseTool


class SendCalendarInviteTool(BaseTool):
    name: str = "send_calendar_invite"
    description: str = (
        "ফাইনাল হওয়া মিটিং স্লটের ইনভাইট পাঠাতে এই টুল ব্যবহার করো। "
        "client_name, meeting_datetime, duration_minutes, purpose দাও।"
    )

    def _run(
        self,
        client_name: str,
        meeting_datetime: str,
        duration_minutes: int,
        purpose: str,
    ) -> str:
        meeting_link = f"https://meet.google.com/{uuid.uuid4().hex[:10]}"
        record = {
            "client_name": client_name,
            "meeting_datetime": meeting_datetime,
            "duration_minutes": duration_minutes,
            "purpose": purpose,
            "meeting_link": meeting_link,
            "sent_at": datetime.datetime.now().isoformat(),
        }
        data = []
        if os.path.exists("scheduled_meetings.json"):
            with open("scheduled_meetings.json", "r", encoding="utf-8") as f:
                data = json.load(f)
        data.append(record)
        with open("scheduled_meetings.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return f"ইনভাইট পাঠানো হয়েছে {client_name}-কে, {meeting_datetime}-এ। লিংক: {meeting_link}"
```

ভাবো, এটা যেন তিশাকে একটা **"ইনভাইট বাটন"** দেওয়া হলো — ফাইনাল সময় ঠিক হলেই সে এটা চাপে, একটা মিটিং লিংক তৈরি হয়ে যায়, আর `scheduled_meetings.json`-এ লগ হয়ে থাকে।

## কোন অংশ কী করে

| অংশ | কাজ |
| --- | --- |
| `name` | টুলের নাম — LLM এই নামেই বাছে |
| `description` | কখন কল করবে + কোন চারটা প্যারামিটার দেবে |
| `uuid.uuid4().hex[:10]` | প্রতিবার ইউনিক মিটিং লিংক বানায় |
| `os.path.exists(...)` | ফাইল নতুন হলে খালি লিস্ট থেকে শুরু |
| `json.dump(..., ensure_ascii=False)` | বাংলা/নাম ঠিক রেখে সুন্দর ফরম্যাটে সেভ |
| return | তিশাকে ছোট কনফার্মেশন (লিংকসহ) |

> **লিংকটা এখানে ডেমো** — `meet.google.com/...` দেখতে আসল হলেও এটা Google তৈরি করে না। আসল ইনভাইট পাঠাতে হলে এই টুলের ভেতরে Google Calendar API-র ইভেন্ট তৈরি + ইনভাইট পাঠানোর কোড বসাতে হবে (ধাপ ১৪-এর "বাস্তব কথা")।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| টুল কল হচ্ছে না | description-এ "ফাইনাল স্লট ঠিক করে ইনভাইট পাঠানো তোমার কাজ" লিখে আরও স্পষ্ট করো |
| `scheduled_meetings.json` নেই | টেস্ট ইমেইল দিয়ে চালাও, বা টুল ম্যানুয়ালি একবার কল করো |
| `ModuleNotFoundError` | `pip install crewai crewai-tools` আবার চালাও |
| JSON ভাঙছে | পুরোনো ফাইল মুছে আবার চালাও — কোডই নতুন করে লিস্ট বানাবে |

## চেকলিস্ট

- [ ] `SendCalendarInviteTool` ক্লাস
- [ ] `name = "send_calendar_invite"`
- [ ] লিংক তৈরি + JSON-এ append

➡️ পরের ধাপ: [ধাপ ১০ — skills.md](/docs/project-based/project-6/step-10)
