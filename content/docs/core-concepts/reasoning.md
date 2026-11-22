---
title: Reasoning
description: Make agents plan and reflect before acting.
icon: BrainCircuit
---

> এই পেজটা [Memory](/docs/core-concepts/memory) পেজের ধারাবাহিকতা — ধাপ ১২-এর প্রথম পর্ব। দ্বিতীয় পর্ব (পরিকল্পনা আসলে কীভাবে চলে) আছে [Planning](/docs/core-concepts/planning) পেজে।

## ধাপ ১২: Reasoning / Planning

### বাস্তব গল্প (রূপসী ফ্যাশন)

সুমনের একটা স্বভাব ছিল — যেকোনো কাজ পেলেই সরাসরি আঁকতে বসে যেতো, কোনো পরিকল্পনা ছাড়াই। মাঝেমধ্যে দেখা যেতো, আধা ঘণ্টা এঁকে বুঝতে পারতো যে রঙের সিলেকশনটাই ভুল হয়ে গেছে, তখন আবার নতুন করে শুরু করতে হতো।

করিম ভাই একদিন বললেন:

> “সুমন, এখন থেকে কাজ শুরু করার আগে একটা ছোট্ট পরিকল্পনা লিখে ফেলো — যেমন ‘প্রথমে রঙ ঠিক করব, তারপর কাপড়ের ধরন বেছে নেব, তারপর কাট ডিজাইন করব।’ প্রতিটা ধাপ শেষ করে নিজে একবার যাচাই করে নেবে, তারপর পরের ধাপে যাবে। কোনো ধাপ ঠিকমতো না হলে, সেই ধাপটা আবার নতুন পরিকল্পনা করে করবে।”

এতে সুমনের কাজ অনেক গোছানো হয়ে গেলো — আগে থেকে পরিকল্পনা করার কারণে ভুল কম হতে লাগলো।

### CrewAI-তে এই একই জিনিস

এই “আগে পরিকল্পনা লেখা, ধাপে ধাপে যাচাই করে এগোনো” ক্ষমতাটাকে CrewAI-তে বলা হয় **Planning**। আগে এটার নাম ছিল **Reasoning** (`reasoning=True`), কিন্তু এখন Reasoning deprecated — নতুন ও সঠিক উপায় হলো `planning_config`।

### কোড (সুমনের Agent-এ পরিবর্তন)

```python
from crewai import PlanningConfig

designer = Agent(
    role="ফ্যাশন ডিজাইনার",
    goal="ট্রেন্ড দেখে আকর্ষণীয় নতুন ডিজাইন আইডিয়া তৈরি করা",
    backstory="তুমি সুমন, ছোটবেলা থেকেই আঁকাআঁকি করো।",
    allow_delegation=True,
    knowledge_sources=[brand_guide],
    skills=["./skills"],
    llm=creative_llm,
    planning_config=PlanningConfig(max_attempts=3)   # 👈 নতুন — করিম ভাইয়ের "আগে পরিকল্পনা করো" নির্দেশ
)
```

### পুরোনো Reasoning থেকে নতুন Planning-এ যাওয়া

আগের কোডে যদি `reasoning=True` থাকে, সেটা বদলে দিতে হয়:

| পুরোনো (deprecated) | নতুন |
| --- | --- |
| `Agent(reasoning=True)` | `Agent(planning_config=PlanningConfig())` |
| `max_reasoning_attempts=3` | `PlanningConfig(max_attempts=3)` |

### পরের ধাপ

- [Planning](/docs/core-concepts/planning) — পরিকল্পনাটা আসলে কীভাবে তৈরি হয়, ধাপে ধাপে কীভাবে চলে, আর কম খরচের বিকল্প
- [Memory](/docs/core-concepts/memory) — আগের ধাপে ফিরে যেতে চাইলে
