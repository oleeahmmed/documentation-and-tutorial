---
title: "ধাপ ১১ — ম্যানেজার (crew.py)"
description: ৩ Agent আর ৩ Task জোড়া লাগিয়ে Crew — sequential, knowledge, memory, তানিয়ার টুল।
icon: Network
---

## লক্ষ্য

পুরো টিম একসাথে চালানোর ম্যানেজার ক্লাস লেখা।

## ফাইল খোলো

`src/hr_agent/crew.py` ফাইলের সব মুছে এটা বসাও:

```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource

from hr_agent.tools.custom_tool import ProcessCandidateTool


@CrewBase
class HrAgent():

    def __init__(self):
        self.knowledge_source = TextFileKnowledgeSource(file_paths=["job_description.txt"])

    @agent
    def resume_parser_agent(self) -> Agent:
        return Agent(config=self.agents_config['resume_parser_agent'], verbose=True)

    @agent
    def screening_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['screening_agent'],
            verbose=True,
            knowledge_sources=[self.knowledge_source],
        )

    @agent
    def outreach_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['outreach_agent'],
            verbose=True,
            tools=[ProcessCandidateTool()],
        )

    @task
    def parse_resume_task(self) -> Task:
        return Task(config=self.tasks_config['parse_resume_task'])

    @task
    def score_candidate_task(self) -> Task:
        return Task(config=self.tasks_config['score_candidate_task'])

    @task
    def process_outcome_task(self) -> Task:
        return Task(config=self.tasks_config['process_outcome_task'])

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
| `TextFileKnowledgeSource(...)` | `job_description.txt` = মাহিনের রেফারেন্স |
| `knowledge_sources=[...]` শুধু মাহিনের কাছে | জেরিন/তানিয়ার ডেস্কে জব ডেসক্রিপশন নেই |
| `tools=[ProcessCandidateTool()]` | শুধু তানিয়া পায় |
| `Process.sequential` | জেরিন → মাহিন → তানিয়া |
| `memory=True` | আগের রানের কথা মনে রাখে |

> **শুধু মাহিনের knowledge কেন?** স্কোর করে সে; জেরিনের কাজ তথ্য তোলা, তানিয়ার কাজ প্রসেস করা। এভাবে প্রত্যেকের হাতে শুধু তার দরকারি জিনিস থাকে।

> **`memory=True` আর knowledge — দুটোতেই embedding লাগে** (ডিফল্ট OpenAI)। key না থাকলে প্রথম রানে এরর আসতে পারে — তখন `memory=False` করে flow দেখো, পরে চালু করো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: hr_agent` | `hr_agent` ফোল্ডারে আছো কিনা; `crewai install` চালাও |
| `agents_config` KeyError | YAML key-এর নাম মিলাও |
| `FileNotFoundError: job_description.txt` | `knowledge/`-এ ফাইল আছে কিনা, নাম হুবহু কিনা |
| `crew` খুঁজে পাচ্ছে না | `@crew` ডেকোরেটর আর মেথড নাম `crew` |

## চেকলিস্ট

- [ ] `HrAgent` + `@CrewBase`
- [ ] ৩ agent, ৩ task
- [ ] মাহিনের knowledge, তানিয়ার tool
- [ ] `sequential`, `memory=True`

➡️ পরের ধাপ: [ধাপ ১২ — টেস্ট সিভি (main.py)](/docs/project-based/project-8/step-12)
