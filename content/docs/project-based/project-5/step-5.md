---
title: "ধাপ ৫ — --classic দিয়ে YAML স্ট্রাকচার"
description: crewai create crew invoice_agent --classic — রিনা, ফাহিম, সুমাইয়ার ডেস্ক তৈরি।
icon: FolderTree
---

## লক্ষ্য

CrewAI CLI দিয়ে প্রজেক্টের YAML + Python কাঠামো তৈরি।

## কমান্ড

```bash
crewai create crew invoice_agent --classic
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
Creating folder invoice_agent...
  - Created invoice_agent/.gitignore
  - Created invoice_agent/pyproject.toml
  - Created invoice_agent/README.md
  - Created invoice_agent/knowledge/user_preference.txt
  - Created invoice_agent/src/invoice_agent/main.py
  - Created invoice_agent/src/invoice_agent/crew.py
  - Created invoice_agent/src/invoice_agent/tools/custom_tool.py
  - Created invoice_agent/src/invoice_agent/config/agents.yaml
  - Created invoice_agent/src/invoice_agent/config/tasks.yaml
Crew invoice_agent created successfully!
```

ভেতরে ঢোকো:

```bash
cd invoice_agent
```

## অফিসের ম্যাপ

| ফাইল | অফিসের ভাষায় |
| --- | --- |
| `config/agents.yaml` | রিনা/ফাহিম/সুমাইয়ার জব ডেসক্রিপশন |
| `config/tasks.yaml` | তাদের টু-ডু লিস্ট |
| `knowledge/` | কোম্পানির চার্ট-অফ-অ্যাকাউন্টসের ফাইল ক্যাবিনেট (ফাহিমের রেফারেন্স) |
| `tools/custom_tool.py` | সুমাইয়ার বিশেষ ক্ষমতা (লেজারে এন্ট্রি সেভ করা) |
| `skills.md` | কার কাছে কোন ক্ষমতা তার তালিকা |
| `crew.py` | ম্যানেজার |
| `main.py` | অফিসের দরজা |

> `--classic` মানে পুরোনো Python + YAML ফরম্যাট। `skills.md` আর `chart_of_accounts.txt` CLI বানায় না — ধাপ ৮ আর ১০-এ নিজে বানাবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `No such option: --classic` | পুরোনো CrewAI — ধাপ ৪ আবার চালাও |
| `Folder invoice_agent already exists` | অন্য নাম বা পুরোনো ফোল্ডার সরিয়ে চেষ্টা করো |
| `Run it now?`-এ ভুলে Y চেপেছি | key ছাড়া এরর আসবে, ক্ষতি নেই; ধাপ ১৩-তে key বসিয়ে আবার চালাও |

## চেকলিস্ট

- [ ] `invoice_agent` ফোল্ডার + `Created ... successfully!`
- [ ] `cd invoice_agent`
- [ ] `agents.yaml`, `tasks.yaml` আছে

➡️ পরের ধাপ: [ধাপ ৬ — ৩ Agent](/docs/project-based/project-5/step-6)
