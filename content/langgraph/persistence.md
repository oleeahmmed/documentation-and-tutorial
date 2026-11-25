---
title: Persistence
description: ধাপ ১০ — খাতা বন্ধ করলেও কথা মনে থাকে; InMemorySaver আর thread_id দিয়ে কথোপকথনের স্মৃতি।
icon: Archive
---

## গল্প

সন্ধ্যায় করিম ভাই নাদিয়াকে বললেন, "কালকে ঈদের পোস্টগুলো নিয়ে কথা হবে।"

পরদিন সকালে নাদিয়া খাতা খুলে বললেন, "গতকাল আপনি বলেছিলেন ঈদের পোস্ট — সেই লেখাগুলো নিয়েই শুরু করি।"

খাতা না থাকলে করিম ভাইকে সব আবার বলতে হতো। LangGraph-এ খাতার নাম **checkpointer**, আর প্রতিটা খাতার নাম **thread_id**।

## LangGraph-এ এই একই জিনিস

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "karim-nadia-1"}}
```

`thread_id` একই থাকলে প্রতিবার invoke-এ **আগের state আবার লোড হয়**। আলাদা `thread_id` মানে নতুন খাতা — আলাদা গ্রাহক, আলাদা কথোপকথন।

## কোড (`persistence_project.py`)

```python
from langchain.messages import HumanMessage
from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.checkpoint.memory import InMemorySaver

from llm import model


def chat(state: MessagesState):
    return {"messages": [model.invoke(state["messages"])]}


builder = StateGraph(MessagesState)
builder.add_node("chat", chat)
builder.add_edge(START, "chat")
builder.add_edge("chat", END)

checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "karim-nadia-1"}}

first = graph.invoke(
    {"messages": [HumanMessage("আমার নাম করিম, রূপসী ফ্যাশনের মালিক। আমি ঈদ কালেকশনে মাটি-রঙা থিম চাই।")]},
    config,
)
print("১:", first["messages"][-1].content)

second = graph.invoke(
    {"messages": [HumanMessage("আমার নাম কী, আর কোন থিম চাইছি?")]},
    config,
)
print("২:", second["messages"][-1].content)

print("মোট মেসেজ:", len(second["messages"]))
```

খেয়াল করো — দ্বিতীয় invoke-এ শুধু একটা নতুন প্রশ্ন পাঠানো হয়েছে। আগের কথোপকথন checkpointer নিজেই জোগাড় করেছে।

## বাস্তবে কী ঘটে

```text
১: বুঝেছি করিম ভাই। ঈদ কালেকশনে মাটি-রঙা থিম — উলের লম্বা ওভারকোট আর স্কার্ফ দিয়ে সাজানো যাবে।
২: আপনার নাম করিম, রূপসী ফ্যাশনের মালিক। আপনি চাইছেন ঈদ কালেকশনে মাটি-রঙা থিম।
মোট মেসেজ: ৪
```

চারটা মেসেজ — ২টা মানুষ, ২টা AI। দ্বিতীয় invoke-এও পুরো ইতিহাস ব্যবহৃত হয়েছে।

## thread_id না দিলে

```
ValueError: Checkpointer requires one or more of the following 'configurable' keys: thread_id, checkpoint_ns, checkpoint_id
```

checkpointer বসালে **প্রতিবার** `thread_id` দিতে হয়। এটাই সবচেয়ে সাধারণ ভুল।

## নতুন কী শিখলে

- `compile(checkpointer=...)` দিলেই graph-এর প্রতিটা ধাপ után state সংরক্ষিত হয়
- `thread_id` = কথোপকথনের পরিচয়, গ্রাহকপ্রতি একটা
- এই স্মৃতিটাই পরে human-in-the-loop আর streaming-এর ভিত্তি

## স্মৃতি কোথায় থাকে

| Checkpointer | কোথায় | কখন |
| --- | --- | --- |
| `InMemorySaver` | প্রোগ্রামের মেমোরি | শেখা, টেস্ট |
| `SqliteSaver` | একটা `.db` ফাইল | ছোট প্রোডাকশন |
| `PostgresSaver` | PostgreSQL | বাস্তব সার্ভার |

SQLite লাগলে:

```bash
pip install langgraph-checkpoint-sqlite
```

```python
from langgraph.checkpoint.sqlite import SqliteSaver

with SqliteSaver.from_conn_string("rupashi.db") as checkpointer:
    graph = builder.compile(checkpointer=checkpointer)
```

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| স্মৃতি নেই | `thread_id` প্রতি invoke-এ **একই** দিতে হবে |
| `ValueError ... thread_id` | `config` পাস করা হয়েছে কি না দেখো |
| রিস্টার্টের পর সব হারিয়ে গেল | `InMemorySaver` — মেমোরিতে থাকে; ফাইলে রাখতে `SqliteSaver` নাও |
| খাতায় পুরোনো কথা থেকে যাচ্ছে | নতুন গ্রাহকের জন্য নতুন `thread_id` |

পরের ধাপে [Human-in-the-Loop](/langgraph/human-in-the-loop) — করিম ভাইয়ের স্বাক্ষর ছাড়া কিছু পাবলিশ হবে না।
