---
title: "ধাপ ৫ — --classic দিয়ে YAML স্ট্রাকচার"
description: crewai create crew hr_agent --classic — জেরিন, মাহিন, তানিয়ার ডেস্ক তৈরি।
icon: FolderTree
---

## লক্ষ্য

CrewAI CLI দিয়ে প্রজেক্টের YAML + Python কাঠামো তৈরি।

## কমান্ড

```bash
crewai create crew hr_agent --classic
```

এটা চালালে ধাপে ধাপে জিজ্ঞেস করবে:

```text
Select a provider to set up:
1. openai
2. anthropic
3. gemini
...
Enter the number of your choice or 'q' to quit:
```

→ **`1`** (OpenAI)

```text
Select a model to use for Openai:
1. gpt-6-luna
2. gpt-6.1-sol
3. gpt-6-astra
Enter the number of your choice or 'q' to quit:
```

→ **`1`**

```text
Enter your OPENAI API key (press Enter to skip):
```

→ আসল key থাকলে দাও, না থাকলে **Enter**

```text
Run it now? [Y/n]:
```

→ **`n`**

ফাইল তৈরি হয়ে যাবে:

```text
Creating folder hr_agent...
  - Created hr_agent/.gitignore
  - Created hr_agent/pyproject.toml
  - Created hr_agent/README.md
  - Created hr_agent/knowledge/user_preference.txt
  - Created hr_agent/src/hr_agent/main.py
  - Created hr_agent/src/hr_agent/crew.py
  - Created hr_agent/src/hr_agent/tools/custom_tool.py
  - Created hr_agent/src/hr_agent/config/agents.yaml
  - Created hr_agent/src/hr_agent/config/tasks.yaml
Crew hr_agent created successfully!
```

ভেতরে ঢোকো:

```bash
cd hr_agent
```

## অফিসের ম্যাপ

| ফাইল | অফিসের ভাষায় |
| --- | --- |
| `config/agents.yaml` | জেরিন/মাহিন/তানিয়ার জব ডেসক্রিপশন |
| `config/tasks.yaml` | তাদের টু-ডু লিস্ট |
| `knowledge/` | জব ডেসক্রিপশন ও প্রয়োজনীয়তার খাতার ফাইল ক্যাবিনেট (মাহিনের রেফারেন্স) |
| `tools/custom_tool.py` | তানিয়ার বিশেষ ক্ষমতা (ইন্টারভিউ ইমেইল / ডাটাবেজ সেভ) |
| `skills.md` | কার কাছে কোন ক্ষমতা তার তালিকা |
| `crew.py` | ম্যানেজার |
| `main.py` | অফিসের দরজা |

> `--classic` মানে পুরোনো Python + YAML ফরম্যাট। `skills.md` আর `job_description.txt` CLI বানায় না — ধাপ ৮ আর ১০-এ নিজে বানাবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `No such option: --classic` | পুরোনো CrewAI — ধাপ ৪ আবার চালাও |
| `Folder hr_agent already exists` | অন্য নাম বা পুরোনো ফোল্ডার সরিয়ে চেষ্টা করো |
| `Run it now?`-এ ভুলে Y চেপেছি | key ছাড়া এরর আসবে, ক্ষতি নেই; ধাপ ১৩-তে key বসিয়ে আবার চালাও |

## চেকলিস্ট

- [ ] `hr_agent` ফোল্ডার + `Created ... successfully!`
- [ ] `cd hr_agent`
- [ ] `agents.yaml`, `tasks.yaml` আছে

➡️ পরের ধাপ: [ধাপ ৬ — ৩ Agent](/docs/project-based/project-8/step-6)
