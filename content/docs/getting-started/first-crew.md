---
title: First Crew
description: Build your first crew with one agent in plain Python.
icon: Play
---

এখন তোমার প্রথম Crew বানাবো — একদম সহজ, মাত্র একজন Agent দিয়ে। দুইটা উপায়ে দেখাচ্ছি — তুমি যেকোনো একটা বেছে নিতে পারো।

## উপায় ১: সরাসরি একটা Python ফাইলে লিখে (সবচেয়ে সহজ, শেখার জন্য ভালো)

ফোল্ডার বানাও:

```text
my_first_crew/
├── .env
└── main.py
```

`main.py`-তে:

```python
import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew

load_dotenv()

# ধাপ ১: একজন Agent বানাও
writer = Agent(
    role="লেখক",
    goal="যেকোনো বিষয়ে সহজ ভাষায় একটা ছোট অনুচ্ছেদ লেখা",
    backstory="তুমি একজন দক্ষ লেখক, জটিল বিষয়কে সহজ করে লিখতে পারদর্শী।"
)

# ধাপ ২: একটা Task বানাও
writing_task = Task(
    description="'{topic}' বিষয়ে ৩-৪ লাইনের একটা সহজ অনুচ্ছেদ লেখো।",
    expected_output="৩-৪ লাইনের একটা অনুচ্ছেদ।",
    agent=writer
)

# ধাপ ৩: একটা Crew বানাও
crew = Crew(
    agents=[writer],
    tasks=[writing_task]
)

# ধাপ ৪: চালাও
result = crew.kickoff(inputs={"topic": "বাংলাদেশের ফ্যাশন শিল্প"})
print(result.raw)
```

চালাও:

```bash
pip install python-dotenv
python main.py
```

### বাস্তবে কী ঘটে

```text
বাংলাদেশের ফ্যাশন শিল্প গত এক দশকে অনেক এগিয়েছে। দেশীয় তাঁত ও খাদি
কাপড়ের ব্যবহার বাড়ছে, আর তরুণ ডিজাইনাররা আধুনিক ও ঐতিহ্যবাহী ডিজাইনের
মিশেলে নতুন ট্রেন্ড তৈরি করছেন। এই শিল্প এখন দেশের অর্থনীতিতেও
গুরুত্বপূর্ণ ভূমিকা রাখছে।
```

## উপায় ২: CLI দিয়ে গোছানো প্রজেক্ট বানিয়ে (বড় প্রজেক্টের জন্য ভালো)

```bash
crewai create crew my_first_crew
cd my_first_crew
```

এতে স্বয়ংক্রিয়ভাবে একটা গোছানো প্রজেক্ট কাঠামো তৈরি হয়:

```text
my_first_crew/
├── .env
├── agents/
│   └── researcher.jsonc
├── crew.jsonc
├── knowledge/
├── skills/
├── tools/
└── pyproject.toml
```

| ফাইল/ফোল্ডার | কাজ |
| --- | --- |
| `crew.jsonc` | Task-এর ক্রম, process, ইনপুট-ডিফল্ট ঠিক করা হয় এখানে |
| `agents/*.jsonc` | প্রতিটা Agent-এর role, goal, backstory ইত্যাদি সংজ্ঞায়িত হয় এখানে |
| `.env` | API key রাখার জায়গা |
| `tools/`, `knowledge/`, `skills/` | ঐচ্ছিক — নিজের Tool, Knowledge ডকুমেন্ট, Skill রাখার জায়গা |

**প্রয়োজনীয় প্যাকেজ ইনস্টল করো:**

```bash
crewai install
```

**এবার চালাও:**

```bash
crewai run
```

### দুই পদ্ধতির মধ্যে কোনটা বেছে নেবে

| | উপায় ১ (Python ফাইল) | উপায় ২ (CLI প্রজেক্ট) |
| --- | --- | --- |
| শেখার জন্য | ✅ সহজ, এক ফাইলে সব দেখা যায় | একটু জটিল, ফাইল ছড়ানো |
| ছোট পরীক্ষা-নিরীক্ষার জন্য | ✅ উপযুক্ত | অপ্রয়োজনীয়ভাবে বড় |
| বড়, টিম-ভিত্তিক প্রজেক্টের জন্য | অগোছালো হয়ে যেতে পারে | ✅ গোছানো, সহজে বড় করা যায় |

**পরামর্শ:** শুরুতে শেখার সময় **উপায় ১** ব্যবহার করো (আমাদের আগের সব টিউটোরিয়ালে এটাই করেছি), ধারণা পরিষ্কার হয়ে গেলে প্রকৃত প্রজেক্টে **উপায় ২**-এ চলে যাও।
