---
title: "ধাপ ৫ — CrewAI দিয়ে টিমের কাঠামো"
description: crewai create crew --classic দিয়ে Python + YAML স্ট্রাকচার — রাফি-নাদিয়া-সাকিবের ডেস্ক রেডি।
icon: FolderTree
---

## লক্ষ্য

CrewAI-র নিজের কমান্ড দিয়ে প্রজেক্টের কাঠামো (YAML কনফিগ, `crew.py`, `main.py`) তৈরি করা।

## কমান্ড

```bash
crewai create crew support_agent --classic
```

`--classic` ফ্ল্যাগটা দিলে CrewAI পুরোনো, পরিচিত **Python + YAML** স্ট্রাকচার বানায় (নতুন JSON ফরম্যাট না)। এটা চালালে ধাপে ধাপে এরকম জিজ্ঞেস করবে — আমি নিজে সার্ভারে চালিয়ে এই প্রম্পটগুলোই পেয়েছি:

```text
Select a provider to set up:
1. openai
2. anthropic
3. gemini
4. nvidia_nim
5. groq
...
Enter the number of your choice or 'q' to quit:
```

→ একটা সংখ্যা টাইপ করো, যেমন **`1`** (OpenAI)

```text
Select a model to use for Openai:
1. gpt-6-luna
2. gpt-6.1-sol
3. gpt-6-astra
Enter the number of your choice or 'q' to quit:
```

→ **`1`** দাও (ডিফল্ট মডেল)

```text
Enter your OPENAI API key (press Enter to skip):
```

→ আসল key থাকলে পেস্ট করো, না থাকলে শুধু **Enter** চেপে skip করো (পরে `.env`-এ বসাতে পারবে — ধাপ ১৩)

এরপর স্বয়ংক্রিয়ভাবে ফাইল তৈরি হবে, এরকম আউটপুট দেখবে:

```text
Creating folder support_agent...
  - Created support_agent/.gitignore
  - Created support_agent/pyproject.toml
  - Created support_agent/README.md
  - Created support_agent/knowledge/user_preference.txt
  - Created support_agent/src/support_agent/__init__.py
  - Created support_agent/src/support_agent/main.py
  - Created support_agent/src/support_agent/crew.py
  - Created support_agent/src/support_agent/tools/custom_tool.py
  - Created support_agent/src/support_agent/tools/__init__.py
  - Created support_agent/src/support_agent/config/agents.yaml
  - Created support_agent/src/support_agent/config/tasks.yaml
Crew support_agent created successfully!
```

শেষে জিজ্ঞেস করবে `Run it now? [Y/n]:` — এখনই আসল key না থাকলে **`n`** দাও।

অভিনন্দন — CrewAI নিজে থেকেই তোমার জন্য একটা "অফিস স্ট্রাকচার" বানিয়ে দিয়েছে, রাফি-নাদিয়া-সাকিবকে বসানোর জন্য ডেস্ক রেডি! এবার ভেতরে ঢোকো:

```bash
cd support_agent
```

## এই স্ট্রাকচারটা একটা আসল অফিসের মতো

| ফাইল | অফিসের ভাষায় |
| --- | --- |
| `config/agents.yaml` | প্রতিটা কর্মচারীর **জব ডেসক্রিপশন** (সে কী করে, কেমন স্বভাবের, আগে কোথায় কাজ করেছে) |
| `config/tasks.yaml` | প্রতিটা কাজের **টু-ডু লিস্ট** |
| `knowledge/` | অফিসের **ফাইল ক্যাবিনেট** — নাদিয়ার হাতে থাকা নিয়মের খাতা এখানে থাকবে |
| `tools/custom_tool.py` | কর্মচারীর **বিশেষ ক্ষমতা** (সাকিবের "বস-কে ফোন করার বাটন") |
| `skills.md` | অফিসের **স্কিল রেজিস্টার** — কার কাছে কোন বিশেষ ক্ষমতা আছে তার তালিকা |
| `crew.py` | **ম্যানেজার** — কে কোন কাজ করবে, কীভাবে সবাইকে জোড়া লাগাবে |
| `main.py` | **অফিসের দরজা** — এখান দিয়েই কাজ শুরু হয় |

> `skills.md` আর `faq_policy.txt` CLI বানায় না — দুটোই আমরা নিজে বানাবো (ধাপ ৮ আর ১০)। শুরুতে থাকা `knowledge/user_preference.txt` ব্যবহার করব না, রাখা থাক।

> **পুরো প্রজেক্ট এখানেই:** আগের ফোল্ডার (`blastify_support_agent`) ছিল "বিল্ডিং", আর `support_agent` হলো "অফিসের রুম" — এখন থেকে সব কমান্ড এই `support_agent` ফোল্ডারের ভেতরে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `No such option: --classic` | পুরোনো CrewAI — ধাপ ৪-এর ইনস্টল আবার চালাও |
| `Folder support_agent already exists` | অন্য নাম দাও, বা পুরোনোটা মুছে আবার চালাও |
| প্রম্পটে provider-এর নাম নেই | `q` দিয়ে বেরিয়ে `crewai update` বা নতুন করে `create` চালাও |
| `Run it now?`-তে ভুলে Y দিয়েছি | API key না থাকলে এরর আসবে — কিছু নষ্ট হয় না, ধাপ ১৩-তে key বসিয়ে আবার চালাবে |
| `cd support_agent` কাজ করছে না | `ls` দিয়ে দেখো ফোল্ডার তৈরি হয়েছে কিনা; নামের বানান মিলাও |

## চেকলিস্ট

- [ ] `support_agent` ফোল্ডার তৈরি, `Created ... successfully!`
- [ ] `cd support_agent` করা হয়েছে
- [ ] `src/support_agent/config/agents.yaml` আর `tasks.yaml` আছে

➡️ পরের ধাপ: [ধাপ ৬ — ৩ জন Agent](/docs/project-based/project-3/step-6)
