---
title: "ধাপ ১১ — ম্যানেজার (crew.py)"
description: ৩ Agent আর ৩ Task জোড়া লাগিয়ে Crew — sequential, knowledge, memory, তিশার টুল।
icon: Network
---

## লক্ষ্য

পুরো টিম একসাথে চালানোর ম্যানেজার ক্লাস লেখা।

## ফাইল খোলো

`src/scheduling_agent/crew.py` ফাইলের সব মুছে এটা বসাও:

```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource

from scheduling_agent.tools.custom_tool import SendCalendarInviteTool


@CrewBase
class SchedulingAgent():

    def __init__(self):
        self.knowledge_source = TextFileKnowledgeSource(file_paths=["calendar_rules.txt"])

    @agent
    def request_parser_agent(self) -> Agent:
        return Agent(config=self.agents_config['request_parser_agent'], verbose=True)

    @agent
    def availability_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['availability_agent'],
            verbose=True,
            knowledge_sources=[self.knowledge_source],
        )

    @agent
    def confirmation_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['confirmation_agent'],
            verbose=True,
            tools=[SendCalendarInviteTool()],
        )

    @task
    def parse_request_task(self) -> Task:
        return Task(config=self.tasks_config['parse_request_task'])

    @task
    def find_availability_task(self) -> Task:
        return Task(config=self.tasks_config['find_availability_task'])

    @task
    def confirm_and_invite_task(self) -> Task:
        return Task(config=self.tasks_config['confirm_and_invite_task'])

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
| `TextFileKnowledgeSource(...)` | `calendar_rules.txt` = ইমনের রেফারেন্স |
| `knowledge_sources=[...]` শুধু ইমনের কাছে | রাজিয়া/তিশার ডেস্কে নিয়মের ফাইল নেই |
| `tools=[SendCalendarInviteTool()]` | শুধু তিশা পায় |
| `Process.sequential` | রাজিয়া → ইমন → তিশা |
| `memory=True` | আগের রানের কথা মনে রাখে |

> **শুধু ইমনের knowledge কেন?** নিয়ম মিলিয়ে স্লট দেয় সে; রাজিয়ার কাজ পড়া, তিশার কাজ ইনভাইট। এভাবে প্রত্যেকের হাতে শুধু তার দরকারি জিনিস থাকে।

> **`memory=True` আর knowledge — দুটোতেই embedding লাগে** (ডিফল্ট OpenAI)। key না থাকলে প্রথম রানে এরর আসতে পারে — তখন `memory=False` করে flow দেখো, পরে চালু করো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: scheduling_agent` | `scheduling_agent` ফোল্ডারে আছো কিনা; `crewai install` চালাও |
| `agents_config` KeyError | YAML key-এর নাম মিলাও |
| `FileNotFoundError: calendar_rules.txt` | `knowledge/`-এ ফাইল আছে কিনা, নাম হুবহু কিনা |
| `crew` খুঁজে পাচ্ছে না | `@crew` ডেকোরেটর আর মেথড নাম `crew` |

## চেকলিস্ট

- [ ] `SchedulingAgent` + `@CrewBase`
- [ ] ৩ agent, ৩ task
- [ ] ইমনের knowledge, তিশার tool
- [ ] `sequential`, `memory=True`

➡️ পরের ধাপ: [ধাপ ১২ — টেস্ট ইমেইল (main.py)](/docs/project-based/project-6/step-12)
