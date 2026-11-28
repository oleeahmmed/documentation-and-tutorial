---
title: Project 5 — Blastify Invoice Crew
description: ১৪ ধাপে CrewAI দিয়ে ইনভয়েস থেকে ডেটা বের করা, খরচের খাত ঠিক করা আর CSV লেজারে এন্ট্রি — রিনা, ফাহিম, সুমাইয়ার টিম।
icon: FileSpreadsheet
---

## গল্প

তুমি এখন Blastify-র **অ্যাকাউন্টস টিমে**। মাসে শত শত ভেন্ডরের ইনভয়েস/রসিদ ইমেইলে আসে — AWS-এর বিল, অফিস সাপ্লাইয়ের রসিদ, ফ্রিল্যান্সারের ইনভয়েস। প্রতিটা থেকে হাতে তারিখ-পরিমাণ-ভেন্ডরের নাম বের করে এক্সেলে টুকতে টুকতে অ্যাকাউন্ট্যান্ট ক্লান্ত। ফাইন্যান্স লিড বলল:

> "প্রতিটা ইনভয়েস খুলে হাতে ডেটা এন্ট্রি করা বন্ধ করতে হবে। PDF থেকে তারিখ-পরিমাণ-ভেন্ডর বের করে সরাসরি একটা লেজারে/শিটে সেভ হয়ে যাক, আর কোন খাতে (ক্যাটাগরি) পড়বে সেটাও ঠিক হয়ে যাক।"

তুমি আবার ৩ জন অভিজ্ঞ লোক নিয়োগ দিলে:

| নাম | আগের অভিজ্ঞতা | Blastify-তে কাজ |
| --- | --- | --- |
| **রিনা** | ডকুমেন্ট-প্রসেসিং কোম্পানিতে হাজার হাজার ইনভয়েস থেকে ডেটা তোলা | ইনভয়েস টেক্সট থেকে ভেন্ডর, তারিখ, পরিমাণ, নম্বর বের করা |
| **ফাহিম** | অ্যাকাউন্টিং ফার্মে খরচের খাত ঠিক করা, সন্দেহজনক কিছু ফ্ল্যাগ করা | চার্ট-অফ-অ্যাকাউন্টস অনুযায়ী ক্যাটাগরি ঠিক করা |
| **সুমাইয়া** | বুককিপিং সার্ভিসে যাচাই করা ডেটা লেজারে এন্ট্রি | `save_to_ledger` দিয়ে CSV লেজারে এন্ট্রি সেভ করা |

একই শর্ত: **আগের কোম্পানির অভ্যাস ভুলে যাও, নির্দিষ্ট কাজটাই করবে।** রিনা প্রথমে ইনভয়েস টেক্সট থেকে ডেটা বের করবে (শূন্য থেকে শুরু)। ফাহিম **রিনার বের করা ডেটা চেক করে নিয়ে**, কোম্পানির চার্ট-অফ-অ্যাকাউন্টস (খাতের তালিকা) অনুযায়ী ক্যাটাগরি ঠিক করবে। সুমাইয়া **রিনা ও ফাহিম দুজনের কাজ দেখে নিয়ে** একটা বিশেষ ক্ষমতা দিয়ে — লেজার ফাইলে এন্ট্রি সেভ করবে।

চলো বানাই।

> **এটা Project 3 আর 4-এর সহোদর** — একই কোম্পানি Blastify, একই ১৪ ধাপের কাঠামো, কিন্তু এবার **অ্যাকাউন্টস**। তিনটা প্রজেক্ট পাশাপাশি করলে extract → classify → save প্যাটার্ন আয়ত্ত হয়ে যায়।

## এই প্রজেক্টে কী বানাচ্ছি

- ৩ জন Agent: Extractor (রিনা), Classifier (ফাহিম), Bookkeeper (সুমাইয়া)
- ৩টা Task একের পর এক, `context` দিয়ে জোড়া
- কোম্পানির চার্ট-অফ-অ্যাকাউন্টস (`knowledge/chart_of_accounts.txt`) থেকে খাত ঠিক
- `save_to_ledger` টুল — এন্ট্রি `ledger.csv`-এ সেভ
- `skills.md` — কার কাছে কোন ক্ষমতা

## টেকনোলজি

| স্তর | টেকনোলজি |
| --- | --- |
| ভাষা | Python 3.10+ |
| ফ্রেমওয়ার্ক | CrewAI (`crewai`, `crewai-tools`) |
| কনফিগ | YAML (`agents.yaml`, `tasks.yaml`) |
| নলেজ | টেক্সট ফাইল (চার্ট-অফ-অ্যাকাউন্টস) |
| আউটপুট | CSV লেজার (`ledger.csv`) |
| LLM | OpenAI (অথবা Groq/Gemini-র ফ্রি কী) |

## ১৪ ধাপ এক নজরে

| ধাপ | কাজ | পেজ |
| --- | --- | --- |
| ১ | Python চেক | [ধাপ ১](/docs/project-based/project-5/step-1) |
| ২ | প্রজেক্ট ফোল্ডার | [ধাপ ২](/docs/project-based/project-5/step-2) |
| ৩ | venv | [ধাপ ৩](/docs/project-based/project-5/step-3) |
| ৪ | CrewAI ইনস্টল | [ধাপ ৪](/docs/project-based/project-5/step-4) |
| ৫ | `--classic` স্ট্রাকচার | [ধাপ ৫](/docs/project-based/project-5/step-5) |
| ৬ | ৩ Agent (`agents.yaml`) | [ধাপ ৬](/docs/project-based/project-5/step-6) |
| ৭ | ৩ Task (`tasks.yaml`) | [ধাপ ৭](/docs/project-based/project-5/step-7) |
| ৮ | চার্ট-অফ-অ্যাকাউন্টস | [ধাপ ৮](/docs/project-based/project-5/step-8) |
| ৯ | `save_to_ledger` টুল | [ধাপ ৯](/docs/project-based/project-5/step-9) |
| ১০ | `skills.md` | [ধাপ ১০](/docs/project-based/project-5/step-10) |
| ১১ | `crew.py` | [ধাপ ১১](/docs/project-based/project-5/step-11) |
| ১২ | টেস্ট ইনভয়েস (`main.py`) | [ধাপ ১২](/docs/project-based/project-5/step-12) |
| ১৩ | API key (`.env`) | [ধাপ ১৩](/docs/project-based/project-5/step-13) |
| ১৪ | `crewai install` + `run` | [ধাপ ১৪](/docs/project-based/project-5/step-14) |

## শুরু করার আগে

- Python 3.10+ ইনস্টল (না থাকলে [Python Installation](/python-basic/installation))
- একটা টার্মিনাল — Mac/Linux: Terminal, Windows: Git Bash, Command Prompt বা PowerShell
- একটা LLM API key — OpenAI, অথবা Groq/Gemini-র ফ্রি key

## এগোনোর নিয়ম

1. ধাপগুলো **ক্রম অনুযায়ী** করো।
2. একটা ধাপ শেষ হলে `DONE` বলো — তখনই পরের ধাপ।
3. এরর পেলে পেজের "সমস্যা হলে" টেবিল আগে দেখো।

➡️ শুরু: [ধাপ ১ — Python চেক](/docs/project-based/project-5/step-1)

সেলস টিমের ভ্যারিয়েন্ট: [Project 4 — Blastify Lead-Gen Crew](/docs/project-based/project-4) / সাপোর্ট: [Project 3](/docs/project-based/project-3) / আগের প্রজেক্ট: [Project 1](/docs/project-based/project-1/overview) / [Project 2](/docs/project-based/project-2)
