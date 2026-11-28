---
title: "ধাপ ৯ — তানিয়ার বিশেষ ক্ষমতা (Tool)"
description: process_candidate — শর্টলিস্ট হলে interview_invites.json, না হলে candidate_database.json-এ লেখে।
icon: Wrench
---

## লক্ষ্য

তানিয়ার হাতে ফলাফল প্রসেস করার (ইনভাইট লিস্ট বা ডাটাবেজে সেভ) টুল।

## ফাইল খোলো

`src/hr_agent/tools/custom_tool.py` ফাইলের সব মুছে এটা বসাও:

```python
import json, os, datetime
from crewai.tools import BaseTool


class ProcessCandidateTool(BaseTool):
    name: str = "process_candidate"
    description: str = (
        "প্রার্থীর ফলাফল প্রসেস করতে এই টুল ব্যবহার করো। candidate_name, "
        "shortlisted (true/false), fit_score, reason দাও।"
    )

    def _run(
        self,
        candidate_name: str,
        shortlisted: bool,
        fit_score: int,
        reason: str,
    ) -> str:
        record = {
            "candidate_name": candidate_name,
            "shortlisted": shortlisted,
            "fit_score": fit_score,
            "reason": reason,
            "processed_at": datetime.datetime.now().isoformat(),
        }
        if shortlisted:
            path = "interview_invites.json"
            message = f"{candidate_name}-কে ইন্টারভিউ ইমেইল পাঠানো হয়েছে (স্কোর: {fit_score})"
        else:
            path = "candidate_database.json"
            message = f"{candidate_name}-এর তথ্য ডাটাবেজে সংরক্ষণ করা হয়েছে (স্কোর: {fit_score})"

        data = []
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
        data.append(record)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return message
```

ভাবো, এটা যেন তানিয়াকে একটা **"দুই-বাটনের প্যানেল"** দেওয়া হলো — শর্টলিস্ট হলে একটা বাটন চাপে (ইন্টারভিউ লিস্টে যোগ হয়), না হলে আরেকটা চাপে (ডাটাবেজে সেভ হয়)।

## কোন অংশ কী করে

| অংশ | কাজ |
| --- | --- |
| `name` | টুলের নাম — LLM এই নামেই বাছে |
| `description` | কখন কল করবে + কোন চারটা প্যারামিটার দেবে |
| `if shortlisted:` | ফলাফল অনুযায়ী ফাইল বাছাই — দুই-বাটনের প্যানেল |
| `os.path.exists(path)` | ফাইল নতুন হলে খালি লিস্ট থেকে শুরু |
| `json.dump(..., ensure_ascii=False)` | বাংলা ঠিক রেখে সুন্দর ফরম্যাটে সেভ |
| `reason` | কেন এমন সিদ্ধান্ত — পরে অডিটের জন্য জরুরি |

> **এখানে আসলে ইমেইল যাচ্ছে না** — শুধু লিস্ট ফাইলে এন্ট্রি হচ্ছে। আসল ইনভাইট পাঠাতে এই টুলের ভেতরে SMTP/Gmail API কল বসাবে (ধাপ ১৪-এর "বাস্তব কথা")।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| টুল কল হচ্ছে না | description-এ "শর্টলিস্ট সিদ্ধান্ত অনুযায়ী অবশ্যই প্রসেস করো" লিখে আরও স্পষ্ট করো |
| দুই ফাইলই তৈরি হচ্ছে | একই প্রার্থী দুইবার প্রসেস হচ্ছে — `main.py`-তে একবার করে চালাও |
| `ModuleNotFoundError` | `pip install crewai crewai-tools` আবার চালাও |
| JSON ভাঙছে | পুরোনো ফাইল মুছে আবার চালাও |

## চেকলিস্ট

- [ ] `ProcessCandidateTool` ক্লাস
- [ ] `name = "process_candidate"`
- [ ] শর্টলিস্ট/না-শর্টলিস্ট দুই শাখা

➡️ পরের ধাপ: [ধাপ ১০ — skills.md](/docs/project-based/project-8/step-10)
