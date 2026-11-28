---
title: "ধাপ ১১ — ম্যানেজার (crew.py)"
description: ৩ Agent আর ৩ Task জোড়া লাগিয়ে Crew — sequential, knowledge, memory, পিয়ার টুল।
icon: Network
---

## লক্ষ্য

পুরো টিম একসাথে চালানোর ম্যানেজার ক্লাস লেখা।

## ফাইল খোলো

`src/order_notify_agent/crew.py` ফাইলের সব মুছে এটা বসাও:

```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource

from order_notify_agent.tools.custom_tool import SendNotificationTool


@CrewBase
class OrderNotifyAgent():

    def __init__(self):
        self.knowledge_source = TextFileKnowledgeSource(file_paths=["email_templates.txt"])

    @agent
    def event_extractor_agent(self) -> Agent:
        return Agent(config=self.agents_config['event_extractor_agent'], verbose=True)

    @agent
    def email_composer_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['email_composer_agent'],
            verbose=True,
            knowledge_sources=[self.knowledge_source],
        )

    @agent
    def notification_sender_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['notification_sender_agent'],
            verbose=True,
            tools=[SendNotificationTool()],
        )

    @task
    def extract_event_task(self) -> Task:
        return Task(config=self.tasks_config['extract_event_task'])

    @task
    def compose_email_task(self) -> Task:
        return Task(config=self.tasks_config['compose_email_task'])

    @task
    def send_notification_task(self) -> Task:
        return Task(config=self.tasks_config['send_notification_task'])

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
| `TextFileKnowledgeSource(...)` | `email_templates.txt` = রাহাতের রেফারেন্স |
| `knowledge_sources=[...]` শুধু রাহাতের কাছে | নওশিন/পিয়ার ডেস্কে টেমপ্লেট-খাতা নেই |
| `tools=[SendNotificationTool()]` | শুধু পিয়া পায় |
| `Process.sequential` | নওশিন → রাহাত → পিয়া |
| `memory=True` | আগের রানের কথা মনে রাখে |

> **শুধু রাহাতের knowledge কেন?** ইমেইল লেখে সে; নওশিনের কাজ তথ্য তোলা, পিয়ার কাজ পাঠানো। এভাবে প্রত্যেকের হাতে শুধু তার দরকারি জিনিস থাকে।

> **`memory=True` আর knowledge — দুটোতেই embedding লাগে** (ডিফল্ট OpenAI)। key না থাকলে প্রথম রানে এরর আসতে পারে — তখন `memory=False` করে flow দেখো, পরে চালু করো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: order_notify_agent` | `order_notify_agent` ফোল্ডারে আছো কিনা; `crewai install` চালাও |
| `agents_config` KeyError | YAML key-এর নাম মিলাও |
| `FileNotFoundError: email_templates.txt` | `knowledge/`-এ ফাইল আছে কিনা, নাম হুবহু কিনা |
| `crew` খুঁজে পাচ্ছে না | `@crew` ডেকোরেটর আর মেথড নাম `crew` |

## চেকলিস্ট

- [ ] `OrderNotifyAgent` + `@CrewBase`
- [ ] ৩ agent, ৩ task
- [ ] রাহাতের knowledge, পিয়ার tool
- [ ] `sequential`, `memory=True`

➡️ পরের ধাপ: [ধাপ ১২ — টেস্ট ইভেন্ট (main.py)](/docs/project-based/project-9/step-12)
