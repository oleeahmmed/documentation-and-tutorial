---
title: "ধাপ ৫ — --classic দিয়ে YAML স্ট্রাকচার"
description: crewai create crew order_notify_agent --classic — নওশিন, রাহাত, পিয়ার ডেস্ক তৈরি।
icon: FolderTree
---

## লক্ষ্য

CrewAI CLI দিয়ে প্রজেক্টের YAML + Python কাঠামো তৈরি।

## কমান্ড

```bash
crewai create crew order_notify_agent --classic
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
Creating folder order_notify_agent...
  - Created order_notify_agent/.gitignore
  - Created order_notify_agent/pyproject.toml
  - Created order_notify_agent/README.md
  - Created order_notify_agent/knowledge/user_preference.txt
  - Created order_notify_agent/src/order_notify_agent/main.py
  - Created order_notify_agent/src/order_notify_agent/crew.py
  - Created order_notify_agent/src/order_notify_agent/tools/custom_tool.py
  - Created order_notify_agent/src/order_notify_agent/config/agents.yaml
  - Created order_notify_agent/src/order_notify_agent/config/tasks.yaml
Crew order_notify_agent created successfully!
```

ভেতরে ঢোকো:

```bash
cd order_notify_agent
```

## অফিসের ম্যাপ

| ফাইল | অফিসের ভাষায় |
| --- | --- |
| `config/agents.yaml` | নওশিন/রাহাত/পিয়ার জব ডেসক্রিপশন |
| `config/tasks.yaml` | তাদের টু-ডু লিস্ট |
| `knowledge/` | ইমেইল-টেমপ্লেট ও ব্র্যান্ড টোন-গাইডলাইনের খাতার ফাইল ক্যাবিনেট (রাহাতের রেফারেন্স) |
| `tools/custom_tool.py` | পিয়ার বিশেষ ক্ষমতা (ইমেইল পাঠানো) |
| `skills.md` | কার কাছে কোন ক্ষমতা তার তালিকা |
| `crew.py` | ম্যানেজার |
| `main.py` | অফিসের দরজা |

> `--classic` মানে পুরোনো Python + YAML ফরম্যাট। `skills.md` আর `email_templates.txt` CLI বানায় না — ধাপ ১০ আর ৮-এ নিজে বানাবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `No such option: --classic` | পুরোনো CrewAI — ধাপ ৪ আবার চালাও |
| `Folder order_notify_agent already exists` | অন্য নাম বা পুরোনো ফোল্ডার সরিয়ে চেষ্টা করো |
| `Run it now?`-এ ভুলে Y চেপেছি | key ছাড়া এরর আসবে, ক্ষতি নেই; ধাপ ১৩-তে key বসিয়ে আবার চালাও |

## চেকলিস্ট

- [ ] `order_notify_agent` ফোল্ডার + `Created ... successfully!`
- [ ] `cd order_notify_agent`
- [ ] `agents.yaml`, `tasks.yaml` আছে

➡️ পরের ধাপ: [ধাপ ৬ — ৩ Agent](/docs/project-based/project-9/step-6)
