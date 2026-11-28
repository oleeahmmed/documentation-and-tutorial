---
title: Project 8 — Blastify HR Crew
description: ১৪ ধাপে CrewAI দিয়ে সিভি থেকে তথ্য তোলা, জব ডেসক্রিপশনের সাথে স্কোর করা আর যোগ্য প্রার্থীকে ইন্টারভিউ ইনভাইট পাঠানো — জেরিন, মাহিন, তানিয়ার টিম।
icon: UserCheck
---

## গল্প

তুমি এখন Blastify-র **HR টিমে**। একটা নতুন পদের জন্য বিজ্ঞাপন দেওয়ার পর ইনবক্সে ২০০+ সিভি জমা হয়ে গেছে। প্রতিটা সিভি খুলে জব ডেসক্রিপশনের সাথে মিলিয়ে দেখা, কারা যোগ্য বাছাই করা, তাদের ইন্টারভিউয়ের ইমেইল পাঠানো — এটা হাতে করতে করতে HR ম্যানেজার ক্লান্ত। তিনি বললেন:

> "প্রতিটা সিভি পড়ে জব ডেসক্রিপশনের সাথে মিলিয়ে একটা স্কোর দাও। যারা যোগ্য তাদের ইন্টারভিউ ইমেইল পাঠিয়ে দাও, বাকিদের তথ্য একটা তালিকায় রেখে দাও — পরে দরকার হলে দেখবো।"

তুমি আবার ৩ জন অভিজ্ঞ লোক নিয়োগ দিলে:

| নাম | আগের অভিজ্ঞতা | Blastify-তে কাজ |
| --- | --- | --- |
| **জেরিন** | রিক্রুটিং এজেন্সিতে শত শত সিভি পড়ে তথ্য তোলা | সিভি থেকে নাম, অভিজ্ঞতা, স্কিল, শিক্ষা বের করা |
| **মাহিন** | কর্পোরেট HR-এ স্কোরিং ও শর্টলিস্ট | জব ডেসক্রিপশন মিলিয়ে ০-১০০ স্কোর ও শর্টলিস্ট সিদ্ধান্ত |
| **তানিয়া** | ক্যাম্পাস প্লেসমেন্ট সেলে ইন্টারভিউ ইনভাইট ও রেকর্ড | শর্টলিস্ট হলে ইনভাইট, না হলে ডাটাবেজে সংরক্ষণ |

একই শর্ত: **আগের কোম্পানির অভ্যাস ভুলে যাও, নির্দিষ্ট কাজটাই করবে।** জেরিন প্রথমে সিভি থেকে তথ্য বের করবে (শূন্য থেকে শুরু)। মাহিন **জেরিনের বের করা তথ্য দেখে নিয়ে**, কোম্পানির জব ডেসক্রিপশন ও প্রয়োজনীয়তার খাতা মিলিয়ে স্কোর দেবে এবং শর্টলিস্ট ঠিক করবে। তানিয়া **জেরিন ও মাহিনের কাজ দেখে নিয়ে**, একটা বিশেষ ক্ষমতা দিয়ে — ফলাফল অনুযায়ী ইন্টারভিউ ইমেইল "পাঠাবে" অথবা প্রার্থীর তথ্য ডাটাবেজে "সেভ" করবে (এই টিউটোরিয়ালে ফাইলে লগ করে)।

চলো বানাই।

> **এটা Project 3, 4, 5, 6 আর 7-এর সহোদর** — একই কোম্পানি Blastify, একই ১৪ ধাপের কাঠামো, কিন্তু এবার **HR**। পাশাপাশি করলে **parse → score → process** প্যাটার্ন আয়ত্ত হয়ে যায়।

## এই প্রজেক্টে কী বানাচ্ছি

- ৩ জন Agent: Resume Parser (জেরিন), Fit Scorer (মাহিন), Outreach Coordinator (তানিয়া)
- ৩টা Task একের পর এক, `context` দিয়ে জোড়া
- জব ডেসক্রিপশন, must-have শর্ত আর স্কোরিং নিয়ম (`knowledge/job_description.txt`)
- `process_candidate` টুল — শর্টলিস্ট হলে `interview_invites.json`, না হলে `candidate_database.json`
- `skills.md` — কার কাছে কোন ক্ষমতা

## টেকনোলজি

| স্তর | টেকনোলজি |
| --- | --- |
| ভাষা | Python 3.10+ |
| ফ্রেমওয়ার্ক | CrewAI (`crewai`, `crewai-tools`) |
| কনফিগ | YAML (`agents.yaml`, `tasks.yaml`) |
| নলেজ | টেক্সট ফাইল (জব ডেসক্রিপশন ও স্কোরিং নিয়ম) |
| আউটপুট | JSON লগ (`interview_invites.json`, `candidate_database.json`) |
| LLM | OpenAI (অথবা Groq/Gemini-র ফ্রি কী) |

## ১৪ ধাপ এক নজরে

| ধাপ | কাজ | পেজ |
| --- | --- | --- |
| ১ | Python চেক | [ধাপ ১](/docs/project-based/project-8/step-1) |
| ২ | প্রজেক্ট ফোল্ডার | [ধাপ ২](/docs/project-based/project-8/step-2) |
| ৩ | venv | [ধাপ ৩](/docs/project-based/project-8/step-3) |
| ৪ | CrewAI ইনস্টল | [ধাপ ৪](/docs/project-based/project-8/step-4) |
| ৫ | `--classic` স্ট্রাকচার | [ধাপ ৫](/docs/project-based/project-8/step-5) |
| ৬ | ৩ Agent (`agents.yaml`) | [ধাপ ৬](/docs/project-based/project-8/step-6) |
| ৭ | ৩ Task (`tasks.yaml`) | [ধাপ ৭](/docs/project-based/project-8/step-7) |
| ৮ | জব ডেসক্রিপশন | [ধাপ ৮](/docs/project-based/project-8/step-8) |
| ৯ | `process_candidate` টুল | [ধাপ ৯](/docs/project-based/project-8/step-9) |
| ১০ | `skills.md` | [ধাপ ১০](/docs/project-based/project-8/step-10) |
| ১১ | `crew.py` | [ধাপ ১১](/docs/project-based/project-8/step-11) |
| ১২ | টেস্ট সিভি (`main.py`) | [ধাপ ১২](/docs/project-based/project-8/step-12) |
| ১৩ | API key (`.env`) | [ধাপ ১৩](/docs/project-based/project-8/step-13) |
| ১৪ | `crewai install` + `run` | [ধাপ ১৪](/docs/project-based/project-8/step-14) |

## শুরু করার আগে

- Python 3.10+ ইনস্টল (না থাকলে [Python Installation](/python-basic/installation))
- একটা টার্মিনাল — Mac/Linux: Terminal, Windows: Git Bash, Command Prompt বা PowerShell
- একটা LLM API key — OpenAI, অথবা Groq/Gemini-র ফ্রি key

## এগোনোর নিয়ম

1. ধাপগুলো **ক্রম অনুযায়ী** করো।
2. একটা ধাপ শেষ হলে `DONE` বলো — তখনই পরের ধাপ।
3. এরর পেলে পেজের "সমস্যা হলে" টেবিল আগে দেখো।

➡️ শুরু: [ধাপ ১ — Python চেক](/docs/project-based/project-8/step-1)

পাশের প্রজেক্টগুলো: [Project 7 — Inbox](/docs/project-based/project-7) / [Project 6 — Scheduling](/docs/project-based/project-6) / [Project 5 — Invoice](/docs/project-based/project-5) / [Project 4 — Lead-Gen](/docs/project-based/project-4)
