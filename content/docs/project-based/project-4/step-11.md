---
title: "ধাপ ১১ — ম্যানেজার (crew.py)"
description: ৩ Agent আর ৩ Task জোড়া লাগিয়ে Crew — sequential, knowledge, memory, আরিফের টুল।
icon: Network
---

## লক্ষ্য

পুরো টিম একসাথে চালানোর ম্যানেজার ক্লাস লেখা।

## ফাইল খোলো

`src/lead_gen_agent/crew.py` ফাইলের সব মুছে এটা বসাও:

```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource

from lead_gen_agent.tools.custom_tool import ScheduleFollowupTool


@CrewBase
class LeadGenAgent():

    def __init__(self):
        self.knowledge_source = TextFileKnowledgeSource(file_paths=["blastify_pitch.txt"])

    @agent
    def research_agent(self) -> Agent:
        return Agent(config=self.agents_config['research_agent'], verbose=True)

    @agent
    def email_writer_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['email_writer_agent'],
            verbose=True,
            knowledge_sources=[self.knowledge_source],
        )

    @agent
    def followup_coordinator_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['followup_coordinator_agent'],
            verbose=True,
            tools=[ScheduleFollowupTool()],
        )

    @task
    def research_task(self) -> Task:
        return Task(config=self.tasks_config['research_task'])

    @task
    def personalize_email_task(self) -> Task:
        return Task(config=self.tasks_config['personalize_email_task'])

    @task
    def followup_plan_task(self) -> Task:
        return Task(config=self.tasks_config['followup_plan_task'])

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
| `TextFileKnowledgeSource(...)` | `blastify_pitch.txt` = মিতুর রেফারেন্স |
| `knowledge_sources=[...]` শুধু মিতুর কাছে | অন্য এজেন্টের ডেস্কে ফাইল নেই |
| `tools=[ScheduleFollowupTool()]` | শুধু আরিফ পায় |
| `Process.sequential` | তানভীর → মিতু → আরিফ |
| `memory=True` | আগের রানের কথা মনে রাখে |

> **শুধু মিতুর knowledge কেন?** পিচ নিয়ে লেখে সে; তানভীরের কাজ রিসার্চ, আরিফের কাজ লগ করা। এভাবে প্রত্যেকের হাতে শুধু তার দরকারি জিনিস থাকে।

> **`memory=True` আর knowledge — দুটোতেই embedding লাগে** (ডিফল্ট OpenAI)। key না থাকলে প্রথম রানে এরর আসতে পারে — তখন `memory=False` করে flow দেখো, পরে চালু করো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: lead_gen_agent` | `lead_gen_agent` ফোল্ডারে আছো কিনা; `crewai install` চালাও |
| `agents_config` KeyError | YAML key-এর নাম মিলাও |
| `FileNotFoundError: blastify_pitch.txt` | `knowledge/`-এ ফাইল আছে কিনা, নাম হুবহু কিনা |
| `crew` খুঁজে পাচ্ছে না | `@crew` ডেকোরেটর আর মেথড নাম `crew` |

## চেকলিস্ট

- [ ] `LeadGenAgent` + `@CrewBase`
- [ ] ৩ agent, ৩ task
- [ ] মিতুর knowledge, আরিফের tool
- [ ] `sequential`, `memory=True`

➡️ পরের ধাপ: [ধাপ ১২ — টেস্ট লিড (main.py)](/docs/project-based/project-4/step-12)
