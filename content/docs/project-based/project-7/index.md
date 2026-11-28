---
title: Project 7 — Blastify Inbox Crew
description: ১৪ ধাপে CrewAI দিয়ে ইনবক্সের ইমেইল ক্যাটাগরি করা, urgent-গুলোর ২ লাইনের সারাংশ লেখা আর সকালের ডাইজেস্ট পাঠানো — সাব্বির, লুবনা, নাঈমের টিম।
icon: Inbox
---

## গল্প

তুমি এখন Blastify-র **CEO-র অফিসে** কাজ করো। প্রতিদিন তার ইনবক্সে ২০০+ ইমেইল আসে — কিছু জরুরি ক্লায়েন্ট মেসেজ, কিছু স্প্যাম, কিছু নিউজলেটার, কিছু বিলিং রিমাইন্ডার। সব ইমেইল খুলে পড়তে পড়তে সকালের ২ ঘণ্টা শেষ হয়ে যায়। CEO বললেন:

> "আমার সব ইমেইল পড়ার সময় নেই। প্রতিদিন সকালে শুধু বলো কোনগুলো আসলেই জরুরি, আর সেগুলোর ২ লাইনের সারাংশ আমার হোয়াটসঅ্যাপে পাঠিয়ে দাও। বাকিগুলো আমি পরে দেখবো।"

তুমি আবার ৩ জন অভিজ্ঞ লোক নিয়োগ দিলে:

| নাম | আগের অভিজ্ঞতা | Blastify-তে কাজ |
| --- | --- | --- |
| **সাব্বির** | আইটি হেল্পডেস্কে টিকেট-ট্রায়াজ, শত শত মেসেজ এক নজরে বোঝা | প্রতিটা ইমেইলের ক্যাটাগরি ঠিক করা (urgent/spam/newsletter/billing/general) |
| **লুবনা** | নিউজ এজেন্সির সাব-এডিটর, লম্বা লেখার হেডলাইন বানানো | শুধু urgent ইমেইলের ২ লাইনের সারাংশ + VIP যাচাই |
| **নাঈম** | অপারেশন্স টিমে প্রতিদিন সকালে ডেইলি রিপোর্ট পাঠানো | সব সারাংশ মিলিয়ে ডাইজেস্ট বানিয়ে `send_digest` দিয়ে পাঠানো |

একই শর্ত: **আগের কোম্পানির অভ্যাস ভুলে যাও, নির্দিষ্ট কাজটাই করবে।** সাব্বির প্রথমে প্রতিটা ইমেইল পড়ে ক্যাটাগরি ঠিক করবে (শূন্য থেকে শুরু)। লুবনা **সাব্বিরের ক্যাটাগরি দেখে নিয়ে**, শুধু "urgent" ইমেইলগুলোর সারাংশ লিখবে, আর কে পাঠিয়েছে তা দেখে প্রায়োরিটি-নিয়মের খাতা (VIP লিস্ট) মিলিয়ে নেবে। নাঈম **সাব্বির ও লুবনার কাজ দেখে নিয়ে**, একটা বিশেষ ক্ষমতা দিয়ে — পুরো ডাইজেস্ট হোয়াটসঅ্যাপে "পাঠিয়ে" (এই টিউটোরিয়ালে ফাইলে লগ করে) দেবে।

চলো বানাই।

> **এটা Project 3, 4, 5 আর 6-এর সহোদর** — একই কোম্পানি Blastify, একই ১৪ ধাপের কাঠামো, কিন্তু এবার **ইনবক্স**। পাশাপাশি করলে **triage → summarize → deliver** প্যাটার্ন আয়ত্ত হয়ে যায়।

## এই প্রজেক্টে কী বানাচ্ছি

- ৩ জন Agent: Triage Categorizer (সাব্বির), Summarizer (লুবনা), Digest Notifier (নাঈম)
- ৩টা Task একের পর এক, `context` দিয়ে জোড়া
- VIP সেন্ডার + ক্যাটাগরি-নিয়ম (`knowledge/priority_rules.txt`)
- `send_digest` টুল — ডাইজেস্ট `sent_digests.json`-এ লগ
- `skills.md` — কার কাছে কোন ক্ষমতা

## টেকনোলজি

| স্তর | টেকনোলজি |
| --- | --- |
| ভাষা | Python 3.10+ |
| ফ্রেমওয়ার্ক | CrewAI (`crewai`, `crewai-tools`) |
| কনফিগ | YAML (`agents.yaml`, `tasks.yaml`) |
| নলেজ | টেক্সট ফাইল (VIP লিস্ট ও ক্যাটাগরি-নিয়ম) |
| আউটপুট | JSON লগ (`sent_digests.json`) |
| LLM | OpenAI (অথবা Groq/Gemini-র ফ্রি কী) |

## ১৪ ধাপ এক নজরে

| ধাপ | কাজ | পেজ |
| --- | --- | --- |
| ১ | Python চেক | [ধাপ ১](/docs/project-based/project-7/step-1) |
| ২ | প্রজেক্ট ফোল্ডার | [ধাপ ২](/docs/project-based/project-7/step-2) |
| ৩ | venv | [ধাপ ৩](/docs/project-based/project-7/step-3) |
| ৪ | CrewAI ইনস্টল | [ধাপ ৪](/docs/project-based/project-7/step-4) |
| ৫ | `--classic` স্ট্রাকচার | [ধাপ ৫](/docs/project-based/project-7/step-5) |
| ৬ | ৩ Agent (`agents.yaml`) | [ধাপ ৬](/docs/project-based/project-7/step-6) |
| ৭ | ৩ Task (`tasks.yaml`) | [ধাপ ৭](/docs/project-based/project-7/step-7) |
| ৮ | VIP লিস্ট ও ক্যাটাগরি-নিয়ম | [ধাপ ৮](/docs/project-based/project-7/step-8) |
| ৯ | `send_digest` টুল | [ধাপ ৯](/docs/project-based/project-7/step-9) |
| ১০ | `skills.md` | [ধাপ ১০](/docs/project-based/project-7/step-10) |
| ১১ | `crew.py` | [ধাপ ১১](/docs/project-based/project-7/step-11) |
| ১২ | টেস্ট ইনবক্স (`main.py`) | [ধাপ ১২](/docs/project-based/project-7/step-12) |
| ১৩ | API key (`.env`) | [ধাপ ১৩](/docs/project-based/project-7/step-13) |
| ১৪ | `crewai install` + `run` | [ধাপ ১৪](/docs/project-based/project-7/step-14) |

## শুরু করার আগে

- Python 3.10+ ইনস্টল (না থাকলে [Python Installation](/python-basic/installation))
- একটা টার্মিনাল — Mac/Linux: Terminal, Windows: Git Bash, Command Prompt বা PowerShell
- একটা LLM API key — OpenAI, অথবা Groq/Gemini-র ফ্রি key

## এগোনোর নিয়ম

1. ধাপগুলো **ক্রম অনুযায়ী** করো।
2. একটা ধাপ শেষ হলে `DONE` বলো — তখনই পরের ধাপ।
3. এরর পেলে পেজের "সমস্যা হলে" টেবিল আগে দেখো।

➡️ শুরু: [ধাপ ১ — Python চেক](/docs/project-based/project-7/step-1)

পাশের প্রজেক্টগুলো: [Project 6 — Scheduling](/docs/project-based/project-6) / [Project 5 — Invoice](/docs/project-based/project-5) / [Project 4 — Lead-Gen](/docs/project-based/project-4) / [Project 3 — Support](/docs/project-based/project-3)
