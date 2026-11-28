---
title: "ধাপ ১১ — ম্যানেজার (crew.py)"
description: ৩ Agent আর ৩ Task জোড়া লাগিয়ে Crew — sequential, knowledge, memory, সুমাইয়ার টুল।
icon: Network
---

## লক্ষ্য

পুরো টিম একসাথে চালানোর ম্যানেজার ক্লাস লেখা।

## ফাইল খোলো

`src/invoice_agent/crew.py` ফাইলের সব মুছে এটা বসাও:

```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource

from invoice_agent.tools.custom_tool import SaveToLedgerTool


@CrewBase
class InvoiceAgent():

    def __init__(self):
        self.knowledge_source = TextFileKnowledgeSource(file_paths=["chart_of_accounts.txt"])

    @agent
    def extractor_agent(self) -> Agent:
        return Agent(config=self.agents_config['extractor_agent'], verbose=True)

    @agent
    def classifier_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['classifier_agent'],
            verbose=True,
            knowledge_sources=[self.knowledge_source],
        )

    @agent
    def bookkeeper_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['bookkeeper_agent'],
            verbose=True,
            tools=[SaveToLedgerTool()],
        )

    @task
    def extract_task(self) -> Task:
        return Task(config=self.tasks_config['extract_task'])

    @task
    def classify_task(self) -> Task:
        return Task(config=self.tasks_config['classify_task'])

    @task
    def record_task(self) -> Task:
        return Task(config=self.tasks_config['record_task'])

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            memory=True,
            knowledge_sources=[self.knowledge_source],
            verbose=True,
        )
```

## কোন অংশ কী করে

| অংশ | কাজ |
| --- | --- |
| `@CrewBase` | YAML কনফিগ নিজে থেকে পড়ে, প্রজেক্ট হিসেবে চেনায় |
| `TextFileKnowledgeSource(...)` | `chart_of_accounts.txt` = ফাহিমের রেফারেন্স |
| `knowledge_sources=[...]` শুধু ফাহিমের কাছে | অন্য এজেন্টের ডেস্কে ফাইল নেই |
| `tools=[SaveToLedgerTool()]` | শুধু সুমাইয়া পায় |
| `Process.sequential` | রিনা → ফাহিম → সুমাইয়া |
| `memory=True` | আগের রানের কথা মনে রাখে |

> **শুধু ফাহিমের knowledge কেন?** খাত ঠিক করে সে; রিনার কাজ তোলা, সুমাইয়ার কাজ লেখা। এভাবে প্রত্যেকের হাতে শুধু তার দরকারি জিনিস থাকে।

> **`memory=True` আর knowledge — দুটোতেই embedding লাগে** (ডিফল্ট OpenAI)। key না থাকলে প্রথম রানে এরর আসতে পারে — তখন `memory=False` করে flow দেখো, পরে চালু করো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: invoice_agent` | `invoice_agent` ফোল্ডারে আছো কিনা; `crewai install` চালাও |
| `agents_config` KeyError | YAML key-এর নাম মিলাও |
| `FileNotFoundError: chart_of_accounts.txt` | `knowledge/`-এ ফাইল আছে কিনা, নাম হুবহু কিনা |
| `crew` খুঁজে পাচ্ছে না | `@crew` ডেকোরেটর আর মেথড নাম `crew` |

## চেকলিস্ট

- [ ] `InvoiceAgent` + `@CrewBase`
- [ ] ৩ agent, ৩ task
- [ ] ফাহিমের knowledge, সুমাইয়ার tool
- [ ] `sequential`, `memory=True`

➡️ পরের ধাপ: [ধাপ ১২ — টেস্ট ইনভয়েস (main.py)](/docs/project-based/project-5/step-12)
