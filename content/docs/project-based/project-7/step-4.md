---
title: "ধাপ ৪ — CrewAI ইনস্টল করো"
description: venv-এর ভেতরে crewai আর crewai-tools, তারপর ভার্সন যাচাই।
icon: Package
---

## লক্ষ্য

CrewAI CLI আর টুল প্যাকেজ এই প্রজেক্টের venv-তে বসানো।

## কমান্ড

```bash
pip install --upgrade pip
pip install crewai crewai-tools
crewai version
```

শেষ কমান্ডে `crewai version: 1.x.x`-এর মতো আউটপুট আসবে। নাম্বারটা তোমার জন্য আলাদা হতে পারে — কমান্ডটা চললেই হবে।

> প্রতিটা প্রজেক্টের আলাদা venv রাখাই ভালো অভ্যাস — আগের প্রজেক্টের venv ব্যবহার করলে ভার্সন গুলিয়ে যেতে পারে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `pip: command not found` | `python -m pip install ...` ব্যবহার করো |
| Permission denied | venv activate করা আছে কিনা দেখো |
| `crewai` কমান্ড নেই | venv activate করে টার্মিনাল নতুন করে খোলো |
| Python 3.13-এ এরর | Python 3.11/3.12 দিয়ে venv বানাও |

## চেকলিস্ট

- [ ] `crewai crewai-tools` ইনস্টল
- [ ] `crewai version` চলে

➡️ পরের ধাপ: [ধাপ ৫ — `--classic` স্ট্রাকচার](/docs/project-based/project-7/step-5)
