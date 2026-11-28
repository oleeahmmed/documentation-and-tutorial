---
title: Project 4 — Blastify Lead-Gen Crew
description: ১৪ ধাপে CrewAI দিয়ে লিড রিসার্চ, পার্সোনালাইজড কোল্ড ইমেইল আর ফলো-আপ শিডিউলিং — তানভীর, মিতু, আরিফের টিম।
icon: Target
---

## গল্প

তুমি এখন Blastify-র **সেলস টিমে** আছো। কোম্পানি চায় নতুন নতুন ক্লায়েন্ট পেতে — ছোট-মাঝারি ব্যবসাগুলোকে Blastify-র SMS মার্কেটিং প্ল্যাটফর্ম বিক্রি করতে হবে। কিন্তু প্রতিদিন ৫০-১০০ জন সম্ভাব্য ক্লায়েন্টের (Lead) ওয়েবসাইট ঘেঁটে, তাদের ব্যবসা বুঝে, আলাদা আলাদা পার্সোনালাইজড ইমেইল লেখা — এটা একা করা অসম্ভব। টিম লিড বলল:

> "প্রতিটা লিডের জন্য একই রকম কপি-পেস্ট ইমেইল পাঠালে কেউ রিপ্লাই দেয় না। প্রত্যেকের ওয়েবসাইট দেখে, তাদের ব্যবসার সাথে মিলিয়ে, আলাদা করে ইমেইল লিখতে হবে। আর যদি ৩ দিনে রিপ্লাই না আসে, একটা ফলো-আপও পাঠাতে হবে।"

তুমি আবার ৩ জন অভিজ্ঞ লোক নিয়োগ দিলে:

| নাম | আগের অভিজ্ঞতা | Blastify-তে কাজ |
| --- | --- | --- |
| **তানভীর** | মার্কেট রিসার্চ ফার্মে শত শত কোম্পানির ওয়েবসাইট ঘেঁটে সেলস ব্রিফ | লিডের ব্যবসা, ইন্ডাস্ট্রি আর পেইন পয়েন্ট বের করা |
| **মিতু** | অ্যাড এজেন্সিতে কপিরাইটার | রিসার্চ মিলিয়ে পার্সোনালাইজড কোল্ড ইমেইল লেখা |
| **আরিফ** | সেলস-অপসে ফলো-আপ ট্র্যাকিং | ফলো-আপ দরকার কিনা ঠিক করা, তারিখ লগ করা |

আবারও শর্ত একই: **আগের কোম্পানির অভ্যাস ভুলে যাও, এখানে যে নির্দিষ্ট কাজ দেওয়া হবে সেটাই করবে।** তানভীর প্রথমে লিডের ওয়েবসাইট রিসার্চ করবে (কারো কাজের ওপর নির্ভর না করে, শূন্য থেকে শুরু)। মিতু লেখা শুরুর আগে **তানভীরের রিসার্চ চেক করে নেবে**, তারপর Blastify-র সার্ভিস তথ্যের সাথে মিলিয়ে পার্সোনালাইজড ইমেইল লিখবে। আরিফ **তানভীর ও মিতু দুজনের কাজ দেখে নিয়ে** ঠিক করবে ফলো-আপ দরকার কিনা, আর তার হাতে একটা বিশেষ ক্ষমতা থাকবে — ফলো-আপের তারিখ আর কারণ একটা ফাইলে টুকে রাখার।

চলো বানাই।

> **এটা Project 3-এর সহোদর** — একই কোম্পানি Blastify, একই ১৪ ধাপের কাঠামো, কিন্তু সাপোর্টের বদলে **সেলস**। দুটো পাশাপাশি করলে একই প্যাটার্ন দুই কাজে চেনা হয়ে যায়।

## এই প্রজেক্টে কী বানাচ্ছি

- ৩ জন Agent: Research (তানভীর), Email Writer (মিতু), Follow-up Coordinator (আরিফ)
- ৩টা Task একের পর এক, `context` দিয়ে জোড়া
- Blastify-র সার্ভিস তথ্য (`knowledge/blastify_pitch.txt`) থেকে পিচ
- `schedule_followup` টুল — ফলো-আপের তারিখ `followups.json`-এ লগ
- `skills.md` — কার কাছে কোন ক্ষমতা

## টেকনোলজি

| স্তর | টেকনোলজি |
| --- | --- |
| ভাষা | Python 3.10+ |
| ফ্রেমওয়ার্ক | CrewAI (`crewai`, `crewai-tools`) |
| কনফিগ | YAML (`agents.yaml`, `tasks.yaml`) |
| নলেজ | টেক্সট ফাইল (সার্ভিস/প্রাইসিং তথ্য) |
| LLM | OpenAI (অথবা Groq/Gemini-র ফ্রি কী) |

## ১৪ ধাপ এক নজরে

| ধাপ | কাজ | পেজ |
| --- | --- | --- |
| ১ | Python চেক | [ধাপ ১](/docs/project-based/project-4/step-1) |
| ২ | প্রজেক্ট ফোল্ডার | [ধাপ ২](/docs/project-based/project-4/step-2) |
| ৩ | venv | [ধাপ ৩](/docs/project-based/project-4/step-3) |
| ৪ | CrewAI ইনস্টল | [ধাপ ৪](/docs/project-based/project-4/step-4) |
| ৫ | `--classic` স্ট্রাকচার | [ধাপ ৫](/docs/project-based/project-4/step-5) |
| ৬ | ৩ Agent (`agents.yaml`) | [ধাপ ৬](/docs/project-based/project-4/step-6) |
| ৭ | ৩ Task (`tasks.yaml`) | [ধাপ ৭](/docs/project-based/project-4/step-7) |
| ৮ | Blastify-র সার্ভিস তথ্য | [ধাপ ৮](/docs/project-based/project-4/step-8) |
| ৯ | `schedule_followup` টুল | [ধাপ ৯](/docs/project-based/project-4/step-9) |
| ১০ | `skills.md` | [ধাপ ১০](/docs/project-based/project-4/step-10) |
| ১১ | `crew.py` | [ধাপ ১১](/docs/project-based/project-4/step-11) |
| ১২ | টেস্ট লিড (`main.py`) | [ধাপ ১২](/docs/project-based/project-4/step-12) |
| ১৩ | API key (`.env`) | [ধাপ ১৩](/docs/project-based/project-4/step-13) |
| ১৪ | `crewai install` + `run` | [ধাপ ১৪](/docs/project-based/project-4/step-14) |

## শুরু করার আগে

- Python 3.10+ ইনস্টল (না থাকলে [Python Installation](/python-basic/installation))
- একটা টার্মিনাল — Mac/Linux: Terminal, Windows: Git Bash, Command Prompt বা PowerShell
- একটা LLM API key — OpenAI, অথবা Groq/Gemini-র ফ্রি key

## এগোনোর নিয়ম

1. ধাপগুলো **ক্রম অনুযায়ী** করো।
2. একটা ধাপ শেষ হলে `DONE` বলো — তখনই পরের ধাপ।
3. এরর পেলে পেজের "সমস্যা হলে" টেবিল আগে দেখো।

➡️ শুরু: [ধাপ ১ — Python চেক](/docs/project-based/project-4/step-1)

সাপোর্ট টিমের ভ্যারিয়েন্ট: [Project 3 — Blastify Support Crew](/docs/project-based/project-3) / আগের প্রজেক্ট: [Project 1](/docs/project-based/project-1/overview) / [Project 2](/docs/project-based/project-2)
