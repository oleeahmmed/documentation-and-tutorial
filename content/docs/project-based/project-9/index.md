---
title: Project 9 — Blastify Order-Notify Crew
description: ১৪ ধাপে CrewAI দিয়ে অর্ডার/পেমেন্ট/কুরিয়ার ইভেন্ট আর abandoned cart থেকে ইমেইল লেখা ও পাঠানো — নওশিন, রাহাত, পিয়ার টিম।
icon: ShoppingCart
---

## গল্প

তুমি এখন Blastify-র একটা ই-কমার্স ক্লায়েন্টের **অর্ডার অপারেশন্স টিমে**। প্রতিদিন শত শত অর্ডার আসে — কাউকে কনফার্মেশন পাঠাতে হয়, কাউকে পেমেন্ট রসিদ, কাউকে কুরিয়ার ট্র্যাকিং লিংক। আর যারা কার্টে পণ্য রেখে কিনতে ভুলে যায়, তাদেরও রিমাইন্ডার পাঠাতে হয়। অপারেশন্স ম্যানেজার বললেন:

> "প্রতিটা অর্ডার ইভেন্ট (কনফার্ম হলো, পেমেন্ট এলো, কুরিয়ারে দেওয়া হলো) আর কার্ট-অ্যাবান্ডনমেন্ট — এগুলোর জন্য ঠিকঠাক ইমেইল নিজে থেকেই লেখা আর পাঠানো হোক।"

তুমি আবার ৩ জন অভিজ্ঞ লোক নিয়োগ দিলে:

| নাম | আগের অভিজ্ঞতা | Blastify-তে কাজ |
| --- | --- | --- |
| **নওশিন** | অর্ডার-ম্যানেজমেন্ট সিস্টেম কোম্পানিতে অর্ডার/পেমেন্ট/শিপমেন্ট রেকর্ড হ্যান্ডলিং | ইভেন্ট থেকে ধরন, কাস্টমারের নাম, অর্ডার নম্বর ও বিস্তারিত বের করা |
| **রাহাত** | ইমেইল-মার্কেটিং এজেন্সিতে কপিরাইটার, ব্র্যান্ড টোন মেনে লেখা | ইভেন্ট-টাইপ অনুযায়ী টেমপ্লেট মিলিয়ে ইমেইলের কনটেন্ট লেখা |
| **পিয়া** | কাস্টমার-সাকসেস টিমে সঠিক সময়ে নোটিফিকেশন পাঠানো | রেডি ইমেইল `send_notification` দিয়ে "পাঠানো" ও রেকর্ড রাখা |

একই শর্ত: **আগের কোম্পানির অভ্যাস ভুলে যাও, নির্দিষ্ট কাজটাই করবে।** নওশিন প্রথমে অর্ডার/কার্ট ইভেন্ট থেকে তথ্য বের করবে (শূন্য থেকে শুরু)। রাহাত **নওশিনের বের করা তথ্য দেখে নিয়ে**, কোম্পানির ইমেইল-টেমপ্লেট ও টোন-গাইডলাইন মিলিয়ে ইমেইলের কনটেন্ট লিখবে। পিয়া **নওশিন ও রাহাতের কাজ দেখে নিয়ে**, একটা বিশেষ ক্ষমতা দিয়ে — ইমেইলটা "পাঠিয়ে" (এই টিউটোরিয়ালে ফাইলে লগ করে) দেবে।

চলো বানাই।

> **এটা Project 3, 4, 5, 6, 7 আর 8-এর সহোদর** — একই কোম্পানি Blastify, একই ১৪ ধাপের কাঠামো, কিন্তু এবার **অর্ডার নোটিফিকেশন**। পাশাপাশি করলে **extract → compose → send** প্যাটার্ন আয়ত্ত হয়ে যায়।

## এই প্রজেক্টে কী বানাচ্ছি

- ৩ জন Agent: Event Extractor (নওশিন), Email Composer (রাহাত), Notification Dispatcher (পিয়া)
- ৩টা Task একের পর এক, `context` দিয়ে জোড়া
- ব্র্যান্ড টোন + ৪ ধরনের ইমেইল-টেমপ্লেট (`knowledge/email_templates.txt`)
- `send_notification` টুল — `sent_notifications.json`-এ পাঠানোর লগ
- `skills.md` — কার কাছে কোন ক্ষমতা

## টেকনোলজি

| স্তর | টেকনোলজি |
| --- | --- |
| ভাষা | Python 3.10+ |
| ফ্রেমওয়ার্ক | CrewAI (`crewai`, `crewai-tools`) |
| কনফিগ | YAML (`agents.yaml`, `tasks.yaml`) |
| নলেজ | টেক্সট ফাইল (ইমেইল টেমপ্লেট ও টোন-গাইডলাইন) |
| আউটপুট | JSON লগ (`sent_notifications.json`) |
| LLM | OpenAI (অথবা Groq/Gemini-র ফ্রি কী) |

## ১৪ ধাপ এক নজরে

| ধাপ | কাজ | পেজ |
| --- | --- | --- |
| ১ | Python চেক | [ধাপ ১](/docs/project-based/project-9/step-1) |
| ২ | প্রজেক্ট ফোল্ডার | [ধাপ ২](/docs/project-based/project-9/step-2) |
| ৩ | venv | [ধাপ ৩](/docs/project-based/project-9/step-3) |
| ৪ | CrewAI ইনস্টল | [ধাপ ৪](/docs/project-based/project-9/step-4) |
| ৫ | `--classic` স্ট্রাকচার | [ধাপ ৫](/docs/project-based/project-9/step-5) |
| ৬ | ৩ Agent (`agents.yaml`) | [ধাপ ৬](/docs/project-based/project-9/step-6) |
| ৭ | ৩ Task (`tasks.yaml`) | [ধাপ ৭](/docs/project-based/project-9/step-7) |
| ৮ | ইমেইল টেমপ্লেট ও টোন | [ধাপ ৮](/docs/project-based/project-9/step-8) |
| ৯ | `send_notification` টুল | [ধাপ ৯](/docs/project-based/project-9/step-9) |
| ১০ | `skills.md` | [ধাপ ১০](/docs/project-based/project-9/step-10) |
| ১১ | `crew.py` | [ধাপ ১১](/docs/project-based/project-9/step-11) |
| ১২ | টেস্ট ইভেন্ট (`main.py`) | [ধাপ ১২](/docs/project-based/project-9/step-12) |
| ১৩ | API key (`.env`) | [ধাপ ১৩](/docs/project-based/project-9/step-13) |
| ১৪ | `crewai install` + `run` | [ধাপ ১৪](/docs/project-based/project-9/step-14) |

## শুরু করার আগে

- Python 3.10+ ইনস্টল (না থাকলে [Python Installation](/python-basic/installation))
- একটা টার্মিনাল — Mac/Linux: Terminal, Windows: Git Bash, Command Prompt বা PowerShell
- একটা LLM API key — OpenAI, অথবা Groq/Gemini-র ফ্রি key

## এগোনোর নিয়ম

1. ধাপগুলো **ক্রম অনুযায়ী** করো।
2. একটা ধাপ শেষ হলে `DONE` বলো — তখনই পরের ধাপ।
3. এরর পেলে পেজের "সমস্যা হলে" টেবিল আগে দেখো।

➡️ শুরু: [ধাপ ১ — Python চেক](/docs/project-based/project-9/step-1)

পাশের প্রজেক্টগুলো: [Project 8 — HR](/docs/project-based/project-8) / [Project 7 — Inbox](/docs/project-based/project-7) / [Project 6 — Scheduling](/docs/project-based/project-6) / [Project 5 — Invoice](/docs/project-based/project-5)
