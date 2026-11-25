---
title: Nodes
description: ধাপ ৪ — প্রতিটা node হলো একজন কর্মীর এক ধাপ — খাতা পড়ে, শুধু নিজের অংশটা লিখে রাখে।
icon: SquareFunction
---

## গল্প

রূপসী ফ্যাশনে সকালে করিম ভাই সবাইকে একটাই নিয়ম দিলেন: "খাতা এক, কিন্তু কেউ পুরো খাতা নতুন করে লিখবে না। যে যার কাজের অংশটুকু পড়ে, শুধু সেই অংশটুকু লিখবে।"

রফিক খাতায় দেখলেন টপিক — "ঈদ ফ্যাশন কালেকশন ২০২৭"। তিনি বাজার-রিপোর্টের অংশটা লিখলেন, বাকি খাতা যেমন ছিল তেমনই রইল।

এই নিয়মটাই LangGraph-এর node: একটা **ফাংশন** — state পড়ে, আর **আংশিক update** (dict) ফেরত দেয়।

## LangGraph-এ এই একই জিনিস

```python
def research(state: FashionState) -> dict:
    # state পড়লেন
    topic = state["topic"]
    # শুধু নিজের অংশটা ফেরত দিলেন
    return {"research": f"{topic} নিয়ে বাজারে চাহিদা পাওয়া গেছে।"}
```

যা ফেরত দাও, LangGraph সেটা state-এ merge করে দেয়। বাকি key-গুলো অক্ষত থাকে।

## কোড (`nodes_project.py`)

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


class FashionState(TypedDict):
    topic: str
    research: str
    brief: str


def research(state: FashionState):
    print(f"রফিক খাতা খুললেন, টপিক: {state['topic']}")
    return {"research": f"{state['topic']} নিয়ে বাজারে মাটি-রঙা উলের চাহিদা সবচেয়ে বেশি।"}


def make_brief(state: FashionState):
    print(f"সুমন রফিকের রিপোর্ট পড়লেন: {state['research']}")
    return {"brief": "লম্বা ওভারকোট + মাটি-রঙা স্কার্ফ — ডিজাইন ব্রিফ তৈরি।"}


builder = StateGraph(FashionState)
builder.add_node("research", research)
builder.add_node("make_brief", make_brief)
builder.add_edge(START, "research")
builder.add_edge("research", "make_brief")
builder.add_edge("make_brief", END)

graph = builder.compile()

result = graph.invoke({"topic": "ঈদ ফ্যাশন কালেকশন ২০২৭"})
print(result)
```

## বাস্তবে কী ঘটে

```text
রফিক খাতা খুললেন, টপিক: ঈদ ফ্যাশন কালেকশন ২০২৭
সুমন রফিকের রিপোর্ট পড়লেন: ঈদ ফ্যাশন কালেকশন ২০২৭ নিয়ে বাজারে মাটি-রঙা উলের চাহিদা সবচেয়ে বেশি।
{'topic': 'ঈদ ফ্যাশন কালেকশন ২০২৭', 'research': 'ঈদ ফ্যাশন কালেকশন ২০২৭ নিয়ে বাজারে মাটি-রঙা উলের চাহিদা সবচেয়ে বেশি।', 'brief': 'লম্বা ওভারকোট + মাটি-রঙা স্কার্ফ — ডিজাইন ব্রিফ তৈরি।'}
```

এখানে একটা গুরুত্বপূর্ণ ব্যাপার — `invoke`-এ শুধু `topic` দিয়েছি, `research` আর `brief` দিইনি। LangGraph-এ state-এর সব key আগে থেকে না দিলেও চলে।

## node-তে যা করা যাবে

- সাধারণ Python লেখা — হিসাব, ফাইল পড়া, ডেটাবেস কল
- LLM কল করা (পরের ধাপগুলোতে দেখব)
- অন্য কোনো LangGraph graph-কে node হিসেবে বসিয়ে দেয়া

## নতুন কী শিখলে

- node = একটা ফাংশন, ইনপুট state, আউটপুট **আংশিক** dict
- পুরো state ফেরত দিতে হয় না — যা বদলাবে শুধু তা-ই
- node-এর নাম (`add_node`-এর প্রথম argument) পরে edge আর পরিদর্শনে কাজে লাগে

> টিপ: node-এর ভেতরে state-টা **পরিবর্তন করো না** (`state["x"] = ...` লিখো না)। ফেরত দেয়া dict-ই একমাত্র বৈধ update পথ — নাহলে checkpoint আর streaming ভুল দেখাবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError` | আগের node সেটা ফেরত দিয়েছে কি না দেখো, বা `state.get(...)` ব্যবহার করো |
| node চলছে না | `START` থেকে edge আছে কি না দেখো |
| update হারিয়ে যাচ্ছে | ফাংশন কিছু return করছে না — `return {...}` দাও |

পরের ধাপে [Edges](/langgraph/edges) — কোন কর্মীর পরে কে, সেই ক্রম।
