---
title: Agent
description: ধাপ ১৩ — নিজে তীর না টেনে রেডিমেড loop; create_agent দিয়ে এক লাইনে AI + টুল।
icon: Bot
---

## গল্প

কয়েকদিন ধরে করিম ভাই কর্তা-কর্মীর কাজ নিজে ভাগ করছেন — রফিক, সুমন, নাদিয়া, তারপর আবার রফিক...

একদিন তিনি বললেন, "এর মধ্যে একটা প্যাটার্ন আছে তো। কারও কাছে প্রশ্ন আসলে তার হাতে যন্ত্র দাও, কাজ শেষ হলে আবার তাকেই জিজ্ঞেস করো। এই দায়িত্বটা আমি আর করব না — একজন ম্যানেজার রাখি।"

ম্যানেজারের কাজ: নিজেই ঠিক করবে কখন কোন কর্মীকে ডাকবে। মানুষ শুধু ফলাফল চাইবে।

## LangGraph-এ এই একই জিনিস

[Tools](/langgraph/tools) পেজে আমরা হাতে লিখেছিলাম:

```text
llm_call → (tool চাইলে) tools → llm_call → ... → END
```

এই loop-টাই এতবার দরকার হয় যে LangChain-এ রেডিমেড আছে: **`create_agent`**।

```python
from langchain.agents import create_agent

agent = create_agent(
    model="openai:gpt-4.1-mini",
    tools=[stock_lookup],
    system_prompt="তুমি রূপসী ফ্যাশনের সহকারী।",
)
```

একটা call-এই তুমি পেয়ে যাচ্ছ একটা পূর্ণ LangGraph — node, tool loop, state সব।

## কোড (`agent_project.py`)

```python
from langchain.agents import create_agent
from langchain.tools import tool


@tool
def stock_lookup(fabric: str) -> str:
    """গুদামে কোনো কাপড়ের স্টক কত মিটার আছে তা দেখে।"""
    stock = {"মাটি-রঙা উল": 42, "নীল তুলা": 8, "সাদা লিনেন": 120}
    return f"{fabric}: {stock.get(fabric, 0)} মিটার"


@tool
def sales_last_week() -> str:
    """গত সপ্তাহের বিক্রির সংখ্যা জানায়।"""
    return "ওভারকোট ২১০টি, স্কার্ফ ১৩০টি বিক্রি হয়েছে।"


agent = create_agent(
    model="openai:gpt-4.1-mini",
    tools=[stock_lookup, sales_last_week],
    system_prompt="তুমি রূপসী ফ্যাশনের সহকারী। উত্তর সংক্ষেপে বাংলায় দাও।",
)

result = agent.invoke(
    {
        "messages": [
            {"role": "user", "content": "গত সপ্তাহে কী কী বিক্রি হলো, আর মাটি-রঙা উলের স্টক কত?"}
        ]
    }
)

print(result["messages"][-1].content)
```

## বাস্তবে কী ঘটে

```text
গত সপ্তাহে ওভারকোট ২১০টি আর স্কার্ফ ১৩০টি বিক্রি হয়েছে। মাটি-রঙা উলের স্টক এখন ৪২ মিটার — বিক্রির গতি দেখে দ্রুত শেষ হয়ে যেতে পারে।
```

ভেতরে যা ঘটল — আবার সেই পরিচিত loop, তবে এবার ম্যানেজার সামলাল:

```text
llm_call (sales_last_week + stock_lookup দুটো টুলই চাইল)
  → tools (দুটোই চলে)
  → llm_call (উত্তর লিখল)
  → END
```

## কখন create_agent, কখন হাতে গ্রাফ

| দরকার | কী ব্যবহার করবে |
| --- | --- |
| শুধু "AI + টুল" চ্যাট | `create_agent` |
| করিম ভাইয়ের মাঝপথে অনুমোদন | হাতে `StateGraph` + `interrupt` |
| বিশেষ ক্রম, parallel কাজ, একাধিক LLM ধাপ | হাতে `StateGraph` |

`create_agent`-ও আসলে একটা `StateGraph` — তাই চাইলে `checkpointer` লিখেও দিতে পারো:

```python
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(..., checkpointer=InMemorySaver())
```

## নতুন কী শিখলে

- `create_agent(model=..., tools=..., system_prompt=...)` — এক লাইনে agent
- node, edge, tool loop — সব আগের ১২ ধাপেই শেখা জিনিস
- জটিল নিয়ন্ত্রণ লাগলে হাতে গ্রাফ বানানোই ভালো

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| টুলই ডাকছে না | docstring আর system_prompt-এ টুলের কথা স্পষ্ট করো |
| `TypeError: create_agent ...` | `langchain` (v1) ইনস্টল আছে কি না দেখো — `pip install -U langchain` |
| উত্তর খুব লম্বা | system_prompt-এ "সংক্ষেপে লেখো" দাও |

পরের ধাপে [MCP](/langgraph/mcp) — অন্য সার্ভারের টুলও নিজের করে নাও।
