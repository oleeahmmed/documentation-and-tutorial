---
title: "ধাপ ১৪ — রান করো!"
description: crewai install + crewai run — রাজিয়া, ইমন, তিশা একে একে কাজ করছে, scheduled_meetings.json ভরে যাচ্ছে।
icon: Play
---

## লক্ষ্য

পুরো শিডিউলিং টিম একবার চালিয়ে আউটপুট আর `scheduled_meetings.json` দেখা।

## কমান্ড

```bash
crewai install
crewai run
```

টার্মিনালে দেখবে:

1. **রাজিয়া** ইমেইল পড়ে মিটিংয়ের উদ্দেশ্য, পছন্দের সময় আর দৈর্ঘ্য বের করছে
2. **ইমন** রাজিয়ার তথ্য দেখে, ক্যালেন্ডার-নিয়ম মিলিয়ে ২-৩টা বৈধ স্লট প্রস্তাব করছে
3. **তিশা** দুজনের কাজ দেখে ফাইনাল স্লট বেছে `send_calendar_invite` কল করছে, `scheduled_meetings.json`-এ লগ হচ্ছে

রান শেষে ফোল্ডারে `scheduled_meetings.json` খুলে দেখলে মিটিংয়ের তারিখ, লিংক, ক্লায়েন্টের নাম — সব পাবে।

```json
[
  {
    "client_name": "Farhan Rahman",
    "meeting_datetime": "মঙ্গলবার, বিকাল ৪:১৫ (৩০ মিনিট)",
    "duration_minutes": 30,
    "purpose": "নতুন প্রজেক্ট নিয়ে আলোচনা",
    "meeting_link": "https://meet.google.com/3f9a1c7d20",
    "sent_at": "2026-11-28T15:42:11.358921"
  }
]
```

## তুমি এখন কী বানালে?

**রাজিয়া, ইমন, তিশা** — ৩ জনের একটা ভার্চুয়াল শিডিউলিং টিম, যার:

- **পার্মানেন্ট নির্দেশনা** (`agents.yaml`, `tasks.yaml`)
- **নলেজ বেস** (`knowledge/calendar_rules.txt`) — অফিসের মিটিং-নিয়ম
- **স্কিল/টুল** (`send_calendar_invite`) — মিটিং লিংক বানিয়ে লগ করে
- **স্কিল রেজিস্টার** (`skills.md`)
- **মেমোরি** (`memory=True`)

**একটা বাস্তব কথা:** এখানে ক্যালেন্ডার-নিয়ম একটা স্ট্যাটিক টেক্সট ফাইল, আর ইনভাইট একটা JSON ফাইলে লগ হচ্ছে — আসল কাজে এই দুইটাকেই **Google Calendar API**-এর সাথে জোড়া লাগাতে হবে:

- `availability_agent`-এর টুলে Google Calendar থেকে লাইভ বিজি/ফ্রি তথ্য আনতে হবে (OAuth2 সেটআপ করে)
- `send_calendar_invite` টুলে আসল ইভেন্ট তৈরি করে Google Meet লিংক আর ইমেইল ইনভাইট পাঠানোর কোড বসাতে হবে
- এজন্য CrewAI-এর Google MCP কানেক্টর বা `google-api-python-client` লাইব্রেরি ব্যবহার করা যায়

> **নিরাপত্তা:** Google Calendar-এ লেখার অনুমতি (`calendar.events`) দেওয়া মানে এই এজেন্ট তোমার ক্যালেন্ডারে ইভেন্ট বানাতে পারবে। প্রথমে একটা টেস্ট ক্যালেন্ডারে চালাও, তারপর আসল ক্যালেন্ডারে দাও।

## চালানোর আগে চেক

| জিনিস | ঠিক আছে কিনা |
| --- | --- |
| `agents.yaml` | ৩ Agent |
| `tasks.yaml` | parse → find → confirm |
| `knowledge/calendar_rules.txt` | কর্মদিবস + আওয়ার + গ্যাপ + লাঞ্চ + বুক করা স্লট |
| `tools/custom_tool.py` | `SendCalendarInviteTool` |
| `crew.py` | ইমনের knowledge, তিশার tool |
| `main.py` | `client_email` input |
| `.env` | `OPENAI_API_KEY` |

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `uv` নেই | `pip install uv`, তারপর আবার `crewai install` |
| knowledge embedding এরর | OpenAI key দাও; বা `memory=False` করে টেস্ট |
| `scheduled_meetings.json` তৈরি হয়নি | তিশার টুল কল হয়নি — `confirm_and_invite_task`-এর description আরও স্পষ্ট করো |
| স্লট নিয়মের বাইরে | `calendar_rules.txt`-এর শর্ত আরও স্পষ্ট লেখো; ইমনের backstory-তে নিষেধ বাড়াও |
| রাজিয়া সময় বানিয়ে বলছে | backstory-তে "স্পষ্ট না থাকলে not specified" আছে কিনা দেখো |
| একই মিটিং বারবার লগ হচ্ছে | JSON নিজে append করে — ডুপ্লিকেট আসলে ফাইল পরিষ্কার করে আবার চালাও |

## চেকলিস্ট

- [ ] `crewai install` সফল
- [ ] `crewai run` শেষে তিনজনের কাজ দেখা যায়
- [ ] `scheduled_meetings.json`-এ নতুন এন্ট্রি
- [ ] `skills.md` হালনাগাদ

⬅️ আগের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-6/step-13)

➡️ প্রজেক্ট ওভারভিউ: [Blastify Scheduling Crew — ১৪ ধাপ](/docs/project-based/project-6)
