---
title: Project 6 — Blastify Scheduling Crew
description: ১৪ ধাপে CrewAI দিয়ে ক্লায়েন্টের ইমেইল থেকে মিটিং চাওয়া বুঝে ফাঁকা স্লট বের করা, কনফার্ম করা আর ইনভাইট পাঠানো — রাজিয়া, ইমন, তিশার টিম।
icon: Calendar
---

## গল্প

তুমি এখন Blastify-র **এক্সিকিউটিভ অ্যাসিস্ট্যান্ট টিমে**। কোম্পানির একজন সিনিয়র কনসালটেন্টের কাছে প্রতিদিন ক্লায়েন্টরা ইমেইল করে মিটিং চায় — "আগামী সপ্তাহে ৩০ মিনিটের একটা কল করা যাবে?" টাইপের মেসেজ। প্রতিটা ইমেইল পড়ে, ক্যালেন্ডার চেক করে, ফাঁকা সময় বের করে, কনফার্ম করে ইনভাইট পাঠানো — এটা একা করতে করতে অ্যাসিস্ট্যান্ট হাঁপিয়ে যাচ্ছে। কনসালটেন্ট বললেন:

> "ক্লায়েন্টের ইমেইল পড়ে নিজে থেকেই আমার ফাঁকা সময় বের করে, ক্লায়েন্টকে জানিয়ে, কনফার্ম হলে মিটিং লিংকসহ ইনভাইট পাঠিয়ে দিক — এমন একটা সিস্টেম দরকার।"

তুমি আবার ৩ জন অভিজ্ঞ লোক নিয়োগ দিলে:

| নাম | আগের অভিজ্ঞতা | Blastify-তে কাজ |
| --- | --- | --- |
| **রাজিয়া** | কল-সেন্টার শিডিউলিং সার্ভিসে ক্লায়েন্টের মেসেজ পড়ে চাহিদা বোঝা | ইমেইল থেকে মিটিংয়ের উদ্দেশ্য, পছন্দের তারিখ/সময়, দৈর্ঘ্য বের করা |
| **ইমন** | ব্যস্ত এক্সিকিউটিভের পার্সোনাল অ্যাসিস্ট্যান্ট, ক্যালেন্ডার সামলানো | অফিসের নিয়ম মিলিয়ে ২-৩টা বৈধ ফাঁকা স্লট প্রস্তাব করা |
| **তিশা** | ক্লিনিকের ফ্রন্ট ডেস্কে অ্যাপয়েন্টমেন্ট কনফার্ম করা | ফাইনাল স্লট ঠিক করে কনফার্মেশন লেখা আর ইনভাইট পাঠানো |

একই শর্ত: **আগের কোম্পানির অভ্যাস ভুলে যাও, নির্দিষ্ট কাজটাই করবে।** রাজিয়া প্রথমে ক্লায়েন্টের ইমেইল থেকে মিটিং-রিকোয়েস্টের তথ্য বের করবে (শূন্য থেকে শুরু)। ইমন **রাজিয়ার বের করা তথ্য দেখে নিয়ে**, অফিসের ক্যালেন্ডার-নিয়ম অনুযায়ী ফাঁকা স্লট খুঁজবে। তিশা **রাজিয়া ও ইমন দুজনের কাজ দেখে নিয়ে**, একটা বিশেষ ক্ষমতা দিয়ে — মিটিং লিংকসহ ইনভাইট "পাঠিয়ে" (এই টিউটোরিয়ালে ফাইলে লগ করে) দেবে।

চলো বানাই।

> **এটা Project 3, 4 আর 5-এর সহোদর** — একই কোম্পানি Blastify, একই ১৪ ধাপের কাঠামো, কিন্তু এবার **শিডিউলিং**। তিনটা প্রজেক্ট পাশাপাশি করলে **parse → find → confirm** প্যাটার্ন আয়ত্ত হয়ে যায়।

## এই প্রজেক্টে কী বানাচ্ছি

- ৩ জন Agent: Request Parser (রাজিয়া), Availability Finder (ইমন), Confirmation Coordinator (তিশা)
- ৩টা Task একের পর এক, `context` দিয়ে জোড়া
- অফিসের মিটিং-নিয়ম (`knowledge/calendar_rules.txt`) থেকে বৈধ স্লট
- `send_calendar_invite` টুল — মিটিং লিংক বানিয়ে `scheduled_meetings.json`-এ লগ
- `skills.md` — কার কাছে কোন ক্ষমতা

## টেকনোলজি

| স্তর | টেকনোলজি |
| --- | --- |
| ভাষা | Python 3.10+ |
| ফ্রেমওয়ার্ক | CrewAI (`crewai`, `crewai-tools`) |
| কনফিগ | YAML (`agents.yaml`, `tasks.yaml`) |
| নলেজ | টেক্সট ফাইল (অফিসের ক্যালেন্ডার-নিয়ম) |
| আউটপুট | JSON লগ (`scheduled_meetings.json`) |
| LLM | OpenAI (অথবা Groq/Gemini-র ফ্রি কী) |

## ১৪ ধাপ এক নজরে

| ধাপ | কাজ | পেজ |
| --- | --- | --- |
| ১ | Python চেক | [ধাপ ১](/docs/project-based/project-6/step-1) |
| ২ | প্রজেক্ট ফোল্ডার | [ধাপ ২](/docs/project-based/project-6/step-2) |
| ৩ | venv | [ধাপ ৩](/docs/project-based/project-6/step-3) |
| ৪ | CrewAI ইনস্টল | [ধাপ ৪](/docs/project-based/project-6/step-4) |
| ৫ | `--classic` স্ট্রাকচার | [ধাপ ৫](/docs/project-based/project-6/step-5) |
| ৬ | ৩ Agent (`agents.yaml`) | [ধাপ ৬](/docs/project-based/project-6/step-6) |
| ৭ | ৩ Task (`tasks.yaml`) | [ধাপ ৭](/docs/project-based/project-6/step-7) |
| ৮ | ক্যালেন্ডার-নিয়ম | [ধাপ ৮](/docs/project-based/project-6/step-8) |
| ৯ | `send_calendar_invite` টুল | [ধাপ ৯](/docs/project-based/project-6/step-9) |
| ১০ | `skills.md` | [ধাপ ১০](/docs/project-based/project-6/step-10) |
| ১১ | `crew.py` | [ধাপ ১১](/docs/project-based/project-6/step-11) |
| ১২ | টেস্ট ইমেইল (`main.py`) | [ধাপ ১২](/docs/project-based/project-6/step-12) |
| ১৩ | API key (`.env`) | [ধাপ ১৩](/docs/project-based/project-6/step-13) |
| ১৪ | `crewai install` + `run` | [ধাপ ১৪](/docs/project-based/project-6/step-14) |

## শুরু করার আগে

- Python 3.10+ ইনস্টল (না থাকলে [Python Installation](/python-basic/installation))
- একটা টার্মিনাল — Mac/Linux: Terminal, Windows: Git Bash, Command Prompt বা PowerShell
- একটা LLM API key — OpenAI, অথবা Groq/Gemini-র ফ্রি key

## এগোনোর নিয়ম

1. ধাপগুলো **ক্রম অনুযায়ী** করো।
2. একটা ধাপ শেষ হলে `DONE` বলো — তখনই পরের ধাপ।
3. এরর পেলে পেজের "সমস্যা হলে" টেবিল আগে দেখো।

➡️ শুরু: [ধাপ ১ — Python চেক](/docs/project-based/project-6/step-1)

পাশের প্রজেক্টগুলো: [Project 5 — Invoice](/docs/project-based/project-5) / [Project 4 — Lead-Gen](/docs/project-based/project-4) / [Project 3 — Support](/docs/project-based/project-3) / [Project 1](/docs/project-based/project-1/overview) / [Project 2](/docs/project-based/project-2)
