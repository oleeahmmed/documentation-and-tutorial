---
title: "ধাপ ১১ — ম্যানেজার (crew.py)"
description: Agent আর Task জোড়া লাগিয়ে Crew — sequential process, knowledge, memory আর সাকিবের টুল।
icon: Network
---

## লক্ষ্য

তিন এজেন্ট আর তিন টাস্ককে একটা টিমে (Crew) জোড়া লাগানো — কে আগে, কে পরে, কে কোন টুল পাবে।

## ফাইল খোলো

`src/support_agent/crew.py` ফাইলের সব মুছে এটা বসাও:

```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource

from support_agent.tools.custom_tool import EscalationTool


@CrewBase
class SupportAgent():

    def __init__(self):
        self.knowledge_source = TextFileKnowledgeSource(file_paths=["faq_policy.txt"])

    @agent
    def classifier_agent(self) -> Agent:
        return Agent(config=self.agents_config['classifier_agent'], verbose=True)

    @agent
    def researcher_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['researcher_agent'],
            verbose=True,
            knowledge_sources=[self.knowledge_source],
        )

    @agent
    def writer_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['writer_agent'],
            verbose=True,
            tools=[EscalationTool()],
        )

    @task
    def classify_task(self) -> Task:
        return Task(config=self.tasks_config['classify_task'])

    @task
    def research_task(self) -> Task:
        return Task(config=self.tasks_config['research_task'])

    @task
    def draft_reply_task(self) -> Task:
        return Task(config=self.tasks_config['draft_reply_task'])

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,   # একজনের কাজ শেষ হলে পরেরজন শুরু করে
            memory=True,                  # আগের কাজগুলো মনে রাখবে
            knowledge_sources=[self.knowledge_source],
            verbose=True,
        )
```

## কোন অংশ কী করে

| অংশ | কাজ |
| --- | --- |
| `@CrewBase` | ক্লাসটাকে CrewAI প্রজেক্ট হিসেবে চেনায় — YAML কনফিগ নিজে থেকে পড়ে |
| `TextFileKnowledgeSource(...)` | `faq_policy.txt`-কে নাদিয়ার "নিয়মের খাতা" বানায় |
| `@agent` / `@task` | ফাংশনের নাম YAML-এর key-এর সাথে মিলতে হয় |
| `tools=[EscalationTool()]` | শুধু সাকিব এই টুল পায়; রাফি-নাদিয়ার কাছে নেই |
| `Process.sequential` | রাফি → নাদিয়া → সাকিব, একের পর এক |
| `memory=True` | আগের রানের কথা মনে রাখে |

> **শুধু নাদিয়ার knowledge কেন?** নিয়মের খাতা তার কাজ; রাফি বা সাকিবের দরকার নেই। এভাবে দিলে প্রতিটা এজেন্টের "ডেস্কে" শুধু তার দরকারি জিনিস থাকে।

> **`memory=True` আর knowledge — দুটোতেই embedding লাগে** (ডিফল্টে OpenAI)। key না থাকলে বা অন্য provider ব্যবহার করলে এখানেই এরর আসতে পারে — প্রথমে `memory=False` করে flow টেস্ট করতে পারো, পরে memory চালু করো।

> **`from support_agent.tools...`** — এই import কাজ করে কারণ প্রজেক্টটা `src/support_agent/` প্যাকেজ হিসেবে বসানো। `crewai run` ব্যবহার করলে প্যাকেজ ঠিকভাবে ইনস্টল থাকে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: support_agent` | `support_agent` ফোল্ডারে আছো কিনা; `crewai install` চালাও |
| `agents_config` KeyError | YAML-এ key-এর নাম মিলাও (`classifier_agent` ইত্যাদি) |
| `FileNotFoundError: faq_policy.txt` | ফাইল `knowledge/`-এ আছে কিনা, নাম হুবহু কিনা দেখো |
| TUI/CLI-তে `crew` খুঁজে পাচ্ছে না | `@crew` ডেকোরেটর আর মেথডের নাম `crew` আছে কিনা দেখো |

## চেকলিস্ট

- [ ] `@CrewBase` ক্লাস `SupportAgent`
- [ ] ৩টা agent, ৩টা task
- [ ] নাদিয়ার `knowledge_sources`, সাকিবের `tools`
- [ ] `Process.sequential`, `memory=True`

➡️ পরের ধাপ: [ধাপ ১২ — টেস্ট ইমেইল (main.py)](/docs/project-based/project-3/step-12)
