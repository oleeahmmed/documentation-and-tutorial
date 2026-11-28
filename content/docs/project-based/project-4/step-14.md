---
title: "ধাপ ১৪ — রান করো!"
description: crewai install + crewai run — তানভীর, মিতু, আরিফ একে একে কাজ করছে।
icon: Play
---

## লক্ষ্য

পুরো লিড-জেন টিম একবার চালিয়ে আউটপুট আর `followups.json` দেখা।

## কমান্ড

```bash
crewai install
crewai run
```

টার্মিনালে দেখবে:

1. **তানভীর** লিডের তথ্য বিশ্লেষণ করছে, ইন্ডাস্ট্রি/পেইন পয়েন্ট বের করছে
2. **মিতু** তানভীরের রিসার্চ দেখে, Blastify-র পিচ মিলিয়ে পার্সোনালাইজড ইমেইল লিখছে
3. **আরিফ** দুজনের কাজ দেখে ফলো-আপ শিডিউল করছে, `followups.json`-এ লগ হচ্ছে

শেষে পুরো ইমেইল আর ফলো-আপ প্ল্যান টার্মিনালে প্রিন্ট হবে। পাশে `followups.json` খুলে দেখো — লিডের নাম, তারিখ, কারণ জমা হয়েছে।

## তুমি এখন কী বানালে?

**তানভীর, মিতু, আরিফ** — ৩ জনের একটা ভার্চুয়াল সেলস টিম, যার:

- **পার্মানেন্ট নির্দেশনা** (`agents.yaml`, `tasks.yaml`)
- **নলেজ বেস** (`knowledge/blastify_pitch.txt`) — Blastify-র সার্ভিস তথ্য
- **স্কিল/টুল** (`schedule_followup`) — ফলো-আপ শিডিউল লগ করে
- **স্কিল রেজিস্টার** (`skills.md`)
- **মেমোরি** (`memory=True`)

**একটা বাস্তব কথা:** CrewAI নিজে থেকে "৩ দিন পর স্বয়ংক্রিয়ভাবে" কিছু পাঠায় না — `followups.json`-এ শুধু তারিখ জমা হয়। সত্যিকারের অটোমেশনের জন্য তোমার পরিচিত **Celery Beat** (যেটা তুমি Blastify-তেই ব্যবহার করো) দিয়ে প্রতিদিন একবার `followups.json` চেক করে, তারিখ হয়ে গেলে `crewai run` আবার কল করার মতো একটা শিডিউলড টাস্ক বসালেই পুরো ফ্লো সম্পূর্ণ অটোমেটিক হয়ে যাবে — চাইলে এই অংশটা নিয়েও একসাথে বসতে পারি।

একাধিক লিডের জন্য চালাতে চাইলে `main.py`-তে একটা লিস্ট থেকে লুপ করে প্রতিটা লিডের জন্য `kickoff()` কল করলেই হবে — এটাও চাইলে দেখিয়ে দিতে পারি।

## চালানোর আগে চেক

| জিনিস | ঠিক আছে কিনা |
| --- | --- |
| `agents.yaml` | ৩ Agent |
| `tasks.yaml` | research → personalize → followup |
| `knowledge/blastify_pitch.txt` | সার্ভিস, দাম, CTA |
| `tools/custom_tool.py` | `ScheduleFollowupTool` |
| `crew.py` | মিতুর knowledge, আরিফের tool |
| `main.py` | তিনটা lead input |
| `.env` | `OPENAI_API_KEY` |

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `uv` নেই | `pip install uv`, তারপর আবার `crewai install` |
| knowledge embedding এরর | OpenAI key দাও; বা `memory=False` করে টেস্ট |
| `followups.json` তৈরি হয়নি | আরিফের টুল কল হয়নি — লিডের তথ্য/প্রম্পট আরও স্পষ্ট করো |
| ইমেইল জেনেরিক মনে হচ্ছে | `expected_output` আর পিচ ফাইলে লিড-নির্দিষ্ট তথ্য বাড়াও |
| একই রিপ্লাই বারবার | memory/cache; নতুন লিড দাও |

## চেকলিস্ট

- [ ] `crewai install` সফল
- [ ] `crewai run` শেষে ইমেইল + ফলো-আপ প্ল্যান
- [ ] `followups.json`-এ রেকর্ড
- [ ] `skills.md` হালনাগাদ

⬅️ আগের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-4/step-13)

➡️ প্রজেক্ট ওভারভিউ: [Blastify Lead-Gen Crew — ১৪ ধাপ](/docs/project-based/project-4)
