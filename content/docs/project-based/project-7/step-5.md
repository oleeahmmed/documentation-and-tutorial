---
title: "ধাপ ৫ — --classic দিয়ে YAML স্ট্রাকচার"
description: crewai create crew inbox_agent --classic — সাব্বির, লুবনা, নাঈমের ডেস্ক তৈরি।
icon: FolderTree
---

## লক্ষ্য

CrewAI CLI দিয়ে প্রজেক্টের YAML + Python কাঠামো তৈরি।

## কমান্ড

```bash
crewai create crew inbox_agent --classic
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
Creating folder inbox_agent...
  - Created inbox_agent/.gitignore
  - Created inbox_agent/pyproject.toml
  - Created inbox_agent/README.md
  - Created inbox_agent/knowledge/user_preference.txt
  - Created inbox_agent/src/inbox_agent/main.py
  - Created inbox_agent/src/inbox_agent/crew.py
  - Created inbox_agent/src/inbox_agent/tools/custom_tool.py
  - Created inbox_agent/src/inbox_agent/config/agents.yaml
  - Created inbox_agent/src/inbox_agent/config/tasks.yaml
Crew inbox_agent created successfully!
```

ভেতরে ঢোকো:

```bash
cd inbox_agent
```

## অফিসের ম্যাপ

| ফাইল | অফিসের ভাষায় |
| --- | --- |
| `config/agents.yaml` | সাব্বির/লুবনা/নাঈমের জব ডেসক্রিপশন |
| `config/tasks.yaml` | তাদের টু-ডু লিস্ট |
| `knowledge/` | প্রায়োরিটি-নিয়ম আর VIP সেন্ডার লিস্টের ফাইল ক্যাবিনেট (লুবনার রেফারেন্স) |
| `tools/custom_tool.py` | নাঈমের বিশেষ ক্ষমতা (ডাইজেস্ট পাঠানো) |
| `skills.md` | কার কাছে কোন ক্ষমতা তার তালিকা |
| `crew.py` | ম্যানেজার |
| `main.py` | অফিসের দরজা |

> `--classic` মানে পুরোনো Python + YAML ফরম্যাট। `skills.md` আর `priority_rules.txt` CLI বানায় না — ধাপ ৮ আর ১০-এ নিজে বানাবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `No such option: --classic` | পুরোনো CrewAI — ধাপ ৪ আবার চালাও |
| `Folder inbox_agent already exists` | অন্য নাম বা পুরোনো ফোল্ডার সরিয়ে চেষ্টা করো |
| `Run it now?`-এ ভুলে Y চেপেছি | key ছাড়া এরর আসবে, ক্ষতি নেই; ধাপ ১৩-তে key বসিয়ে আবার চালাও |

## চেকলিস্ট

- [ ] `inbox_agent` ফোল্ডার + `Created ... successfully!`
- [ ] `cd inbox_agent`
- [ ] `agents.yaml`, `tasks.yaml` আছে

➡️ পরের ধাপ: [ধাপ ৬ — ৩ Agent](/docs/project-based/project-7/step-6)
