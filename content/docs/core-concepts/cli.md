---
title: CLI
description: Run, create, and manage crews from the command line.
icon: Terminal
---

> এই পেজটা [Artifacts](/docs/core-concepts/artifacts) পেজের ধারাবাহিকতা — এখন পুরো প্রজেক্ট গোছানোর পালা।

## ধাপ ২০: CLI

### বাস্তব গল্প (রূপসী ফ্যাশন)

এতদিন করিম ভাই সবকিছু হাতে-কলমে, একটা একটা করে ফাইল বানিয়ে চালাচ্ছিলেন। কিন্তু এখন তার কোম্পানিতে আরও কয়েকজন ডেভেলপার যোগ দিয়েছে। তিনি চাইলেন একটা **গোছানো, পেশাদার কাঠামো**, যাতে সবাই একই নিয়মে কাজ করতে পারে।

### CrewAI-তে এই একই জিনিস

এই “গোছানো কাঠামো তৈরি করার” সহজ উপায়টাই হলো CrewAI-এর **CLI (Command Line Interface)**।

### কমান্ডগুলো

```bash
# নতুন প্রজেক্ট তৈরি
crewai create crew rupashi_fashion

cd rupashi_fashion

# Crew চালানো
crewai run

# প্রশিক্ষণ (আগে যেটা দেখিয়েছি)
crewai train -n 3

# পরীক্ষা (আগে যেটা দেখিয়েছি)
crewai test -n 2

# Crew-এর সাথে চ্যাট-ইন্টারফেসে সরাসরি কথা বলা
crewai chat

# নতুন স্কিল স্ক্যাফোল্ড তৈরি
crewai create skill silk-design
```

আরও কিছু দরকারি কমান্ড:

```bash
crewai version              # কোন ভার্সন চলছে
crewai replay -t task_123   # নির্দিষ্ট Task থেকে আবার চালানো
crewai reset-memories --all # সব memory পরিষ্কার করা
```

### `crewai create crew rupashi_fashion` কী বানায়

ডিফল্টভাবে CLI এখন JSON-ভিত্তিক কাঠামো বানায়:

```text
rupashi_fashion/
├── crew.jsonc
├── agents/
│   └── ...
├── skills/
└── .env
```

পুরোনো Python/YAML কাঠামো চাইলে `--classic` দিতে হয়:

```bash
crewai create crew rupashi_fashion --classic
```

```text
rupashi_fashion/
├── config/
│   ├── agents.yaml
│   └── tasks.yaml
├── src/
│   └── rupashi_fashion/
│       ├── crew.py
│       └── main.py
├── skills/
└── .env
```

### বাস্তবে কী ঘটে

আগে আমরা `crew_project.py`-তে সবকিছু একটা ফাইলে লিখেছিলাম — Agent, Task, Crew সব এক জায়গায়। CLI দিয়ে বানানো প্রজেক্টে এগুলো আলাদা আলাদা, সুসংগঠিত ফাইলে ভাগ হয়ে যায় (যেমন `agents.yaml`-এ শুধু Agent-দের সংজ্ঞা, `tasks.yaml`-এ শুধু Task-এর সংজ্ঞা), যাতে একাধিক ডেভেলপার একসাথে কাজ করলেও সহজে বুঝতে পারে কোথায় কী আছে। আর `crewai chat` চালাতে চাইলে Crew-এ `chat_llm` সেট করতে হয়।

### পরের ধাপ

- [Production Architecture](/docs/core-concepts/production-architecture) — সব ফিচার মিলিয়ে টেকসই সিস্টেম
- [Artifacts](/docs/core-concepts/artifacts) — আগের ধাপে ফিরে যেতে চাইলে
