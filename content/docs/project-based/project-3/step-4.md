---
title: "ধাপ ৪ — CrewAI ইনস্টল"
description: venv-এর ভেতরে crewai আর crewai-tools ইনস্টল করে ভার্সন যাচাই।
icon: Package
---

## লক্ষ্য

তোমার "টিম-বিল্ডিং টুলকিট" — CrewAI আর তার টুল প্যাকেজ — এই প্রজেক্টের venv-তে বসানো।

## কমান্ড

```bash
pip install --upgrade pip
pip install crewai crewai-tools
```

`pip` হলো পাইথনের লাইব্রেরি ইনস্টলার। এই কমান্ড চালালে তোমার `(venv)` ঘরের ভেতরে CrewAI লাইব্রেরি ঢুকে যাবে। শেষে চেক করো:

```bash
crewai version
```

আমি নিজে এটা সার্ভারে চালিয়ে দেখেছি — আউটপুট আসে এরকম: `crewai version: 1.15.45`

> **ভার্সন আলাদা দেখা স্বাভাবিক** — তোমার আউটপুটে অন্য নাম্বার আসতে পারে। জরুরি শুধু এটা যে কমান্ডটা চলে।

## কী ইনস্টল হলো

| প্যাকেজ | কাজ |
| --- | --- |
| `crewai` | Agent, Task, Crew, Process আর CLI (`crewai create`, `crewai run`) |
| `crewai-tools` | রেডিমেড টুল (সার্চ, ফাইল, স্ক্র্যাপিং ইত্যাদি) — এই প্রজেক্টে নিজের টুলও বানাবো |

> `pip install` চলার সময় অনেক লাইন স্ক্রল হবে — এটা স্বাভাবিক। শেষে `Successfully installed ...` দেখলে ঠিক আছে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `pip: command not found` | `python -m pip install ...` ব্যবহার করো |
| Permission / access denied | venv activate করা আছে কিনা দেখো (`(venv)` প্রম্পটে) |
| ইনস্টল আটকে যাচ্ছে | ইন্টারনেট/proxy চেক করো; আবার চালাও |
| `crewai` কমান্ড পাওয়া যাচ্ছে না | venv activate করে টার্মিনাল নতুন করে খোলো, পুনরায় ইনস্টল করো |
| Python 3.13-এ এরর | Python 3.11/3.12 দিয়ে venv বানিয়ে চেষ্টা করো |

## চেকলিস্ট

- [ ] `pip install crewai crewai-tools` সফল
- [ ] `crewai version` চলে

➡️ পরের ধাপ: [ধাপ ৫ — `crewai create crew`](/docs/project-based/project-3/step-5)
