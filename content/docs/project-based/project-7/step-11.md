---
title: "ধাপ ১১ — ম্যানেজার (crew.py)"
description: ৩ Agent আর ৩ Task জোড়া লাগিয়ে Crew — sequential, knowledge, memory, নাঈমের টুল।
icon: Network
---

## লক্ষ্য

পুরো টিম একসাথে চালানোর ম্যানেজার ক্লাস লেখা।

## ফাইল খোলো

`src/inbox_agent/crew.py` ফাইলের সব মুছে এটা বসাও:

```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource

from inbox_agent.tools.custom_tool import SendDigestTool


@CrewBase
class InboxAgent():

    def __init__(self):
        self.knowledge_source = TextFileKnowledgeSource(file_paths=["priority_rules.txt"])

    @agent
    def triage_agent(self) -> Agent:
        return Agent(config=self.agents_config['triage_agent'], verbose=True)

    @agent
    def summarizer_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['summarizer_agent'],
            verbose=True,
            knowledge_sources=[self.knowledge_source],
        )

    @agent
    def digest_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['digest_agent'],
            verbose=True,
            tools=[SendDigestTool()],
        )

    @task
    def triage_task(self) -> Task:
        return Task(config=self.tasks_config['triage_task'])

    @task
    def summarize_task(self) -> Task:
        return Task(config=self.tasks_config['summarize_task'])

    @task
    def send_digest_task(self) -> Task:
        return Task(config=self.tasks_config['send_digest_task'])

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
| `TextFileKnowledgeSource(...)` | `priority_rules.txt` = লুবনার রেফারেন্স |
| `knowledge_sources=[...]` শুধু লুবনার কাছে | সাব্বির/নাঈমের ডেস্কে নিয়মের ফাইল নেই |
| `tools=[SendDigestTool()]` | শুধু নাঈম পায় |
| `Process.sequential` | সাব্বির → লুবনা → নাঈম |
| `memory=True` | আগের রানের কথা মনে রাখে |

> **শুধু লুবনার knowledge কেন?** VIP মিলিয়ে সারাংশ লেখে সে; সাব্বিরের কাজ শুধু ট্যাগ, নাঈমের কাজ শুধু পাঠানো। এভাবে প্রত্যেকের হাতে শুধু তার দরকারি জিনিস থাকে।

> **`memory=True` আর knowledge — দুটোতেই embedding লাগে** (ডিফল্ট OpenAI)। key না থাকলে প্রথম রানে এরর আসতে পারে — তখন `memory=False` করে flow দেখো, পরে চালু করো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: inbox_agent` | `inbox_agent` ফোল্ডারে আছো কিনা; `crewai install` চালাও |
| `agents_config` KeyError | YAML key-এর নাম মিলাও |
| `FileNotFoundError: priority_rules.txt` | `knowledge/`-এ ফাইল আছে কিনা, নাম হুবহু কিনা |
| `crew` খুঁজে পাচ্ছে না | `@crew` ডেকোরেটর আর মেথড নাম `crew` |

## চেকলিস্ট

- [ ] `InboxAgent` + `@CrewBase`
- [ ] ৩ agent, ৩ task
- [ ] লুবনার knowledge, নাঈমের tool
- [ ] `sequential`, `memory=True`

➡️ পরের ধাপ: [ধাপ ১২ — টেস্ট ইনবক্স (main.py)](/docs/project-based/project-7/step-12)
