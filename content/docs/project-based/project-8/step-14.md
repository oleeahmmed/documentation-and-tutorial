---
title: "ধাপ ১৪ — রান করো!"
description: crewai install + crewai run — জেরিন, মাহিন, তানিয়া একে একে কাজ করছে, ইনভাইট/ডাটাবেজ ফাইল তৈরি হচ্ছে।
icon: Play
---

## লক্ষ্য

পুরো HR টিম একবার চালিয়ে আউটপুট আর `interview_invites.json` / `candidate_database.json` দেখা।

## কমান্ড

```bash
crewai install
crewai run
```

টার্মিনালে দেখবে:

1. **জেরিন** সিভি পড়ে নাম/অভিজ্ঞতা/স্কিল/শিক্ষা বের করছে
2. **মাহিন** জেরিনের তথ্য দেখে, জব ডেসক্রিপশন মিলিয়ে fit_score ও শর্টলিস্ট সিদ্ধান্ত দিচ্ছে
3. **তানিয়া** দুজনের কাজ দেখে `process_candidate` কল করছে — শর্টলিস্ট হলে `interview_invites.json`-এ, না হলে `candidate_database.json`-এ এন্ট্রি হচ্ছে

রান শেষে দুটো ফাইলের একটায় (কোন ফলাফল অনুযায়ী) প্রার্থীর তথ্য পাবে।

```json
[
  {
    "candidate_name": "Tanvir Islam",
    "shortlisted": true,
    "fit_score": 85,
    "reason": "৩ বছর Django + DRF + PostgreSQL অভিজ্ঞতা (সব must-have পূরণ); Celery, Redis ও CS ডিগ্রি প্লাস পয়েন্ট",
    "processed_at": "2026-11-28T16:20:05.731442"
  }
]
```

## তুমি এখন কী বানালে?

**জেরিন, মাহিন, তানিয়া** — ৩ জনের একটা ভার্চুয়াল রিক্রুটমেন্ট টিম, যার:

- **পার্মানেন্ট নির্দেশনা** (`agents.yaml`, `tasks.yaml`)
- **নলেজ বেস** (`knowledge/job_description.txt`) — জব ডেসক্রিপশন ও স্কোরিং নিয়ম
- **স্কিল/টুল** (`process_candidate`) — শর্টলিস্ট/ডাটাবেজ এন্ট্রি লগ করে
- **স্কিল রেজিস্টার** (`skills.md`)
- **মেমোরি** (`memory=True`)

**একটা বাস্তব কথা:** এখানে সিভি একটা প্লেইন টেক্সট হিসেবে দেওয়া হয়েছে — আসল কাজে এই জায়গাগুলো বদলাতে হবে:

- **সিভি পড়া** — PDF/Word থেকে টেক্সট বের করতে `pdfplumber` / `python-docx`; Gmail থেকে অ্যাটাচমেন্ট আনতে Gmail API/IMAP বা CrewAI-এর Gmail MCP কানেক্টর
- **ইনভাইট পাঠানো** — `process_candidate`-এর ভেতরে SMTP/Gmail API কল
- **ডাটাবেজ** — "সংরক্ষণ" মানে বাস্তবে Django ব্যাকএন্ডের একটা মডেলে এন্ট্রি, বা একটা API এন্ডপয়েন্টে POST
- **বাল্ক রান** — ২০০ সিভি হলে `main.py`-তে লিস্ট থেকে লুপ করে প্রতিটার জন্য `kickoff()` ডাকো; প্রতি প্রার্থীর ফলাফল আলাদা ফাইলে/ডাটাবেজে জমবে

> **মানুষের সিদ্ধান্ত থাকুক:** স্কোরিং মডেল পক্ষপাতদুষ্ট হতে পারে। এজেন্টের আউটপুট শুধু সহায়ক — চূড়ান্ত শর্টলিস্ট HR মানুষ যাচাই করবে, আর `reason` ফিল্ড রাখা হয়েছে যাতে প্রতিটা সিদ্ধান্তের কারণ পরে অডিট করা যায়।

## চালানোর আগে চেক

| জিনিস | ঠিক আছে কিনা |
| --- | --- |
| `agents.yaml` | ৩ Agent |
| `tasks.yaml` | parse → score → process |
| `knowledge/job_description.txt` | must-have + প্লাস পয়েন্ট + স্কোরিং নিয়ম |
| `tools/custom_tool.py` | `ProcessCandidateTool` |
| `crew.py` | মাহিনের knowledge, তানিয়ার tool |
| `main.py` | `resume_text` input |
| `.env` | `OPENAI_API_KEY` |

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `uv` নেই | `pip install uv`, তারপর আবার `crewai install` |
| knowledge embedding এরর | OpenAI key দাও; বা `memory=False` করে টেস্ট |
| দুটো JSON-ই তৈরি হয়নি | তানিয়ার টুল কল হয়নি — `process_outcome_task`-এর description আরও স্পষ্ট করো |
| স্কোর সবসময় একই | সিভিতে অভিজ্ঞতা/স্কিলে বৈচিত্র্য আনো; স্কোরিং নির্দেশিকা স্পষ্ট করো |
| must-have না থাকা সত্ত্বেও শর্টলিস্ট | ধাপ ৮-এর স্কোরিং নিয়ম আর মাহিনের backstory আরও জোরালো করো |
| ডুপ্লিকেট এন্ট্রি | JSON নিজে append করে — পুরোনো ফাইল পরিষ্কার করে আবার চালাও |

## চেকলিস্ট

- [ ] `crewai install` সফল
- [ ] `crewai run` শেষে তিনজনের কাজ দেখা যায়
- [ ] `interview_invites.json` বা `candidate_database.json`-এ নতুন এন্ট্রি
- [ ] `skills.md` হালনাগাদ

⬅️ আগের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-8/step-13)

➡️ প্রজেক্ট ওভারভিউ: [Blastify HR Crew — ১৪ ধাপ](/docs/project-based/project-8)
