---
title: Edges
description: ধাপ ৫ — কোন কর্মীর পরে কে, সেটা ঠিক করে edge; ক্রম ভুল হলে করিম ভাইয়ের পুরো পরিকল্পনা এলোমেলো।
icon: GitMerge
---

## গল্প

করিম ভাই কাগজে একটা তীর এঁকে দেখালেন:

রফিক (বাজার) → সুমন (ডিজাইন) → নাদিয়া (মার্কেটিং লেখা) → শেষ

"এই ক্রমটা নড়বে না," তিনি বললেন। "রফিকের রিপোর্ট ছাড়া সুমন ডিজাইন বানাবে কী দেখে? আর সুমনের ডিজাইন ছাড়া নাদিয়া লিখবে কী নিয়ে?"

এটাই LangGraph-এর edge — **_কাজ শেষ হলে এরপর কোন node চলবে_**।

## LangGraph-এ এই একই জিনিস

- `add_edge("research", "design")` — research শেষ হলে design চলবে
- `add_edge(START, "research")` — শুরুর তীর
- `add_edge("marketing", END)` — শেষের তীর

শুধু এই দুটো দিয়ে যা বানানো যায় সেটাকে বলে **sequential graph** — ট্রেনের বগির মতো একের পর এক।

## কোড (`edges_project.py`)

```python
import operator
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


class FashionState(TypedDict):
    topic: str
    steps: Annotated[list[str], operator.add]


def research(state: FashionState):
    return {"steps": [f"রফিক: {state['topic']} নিয়ে বাজার রিপোর্ট দিলেন।"]}


def design(state: FashionState):
    return {"steps": ["সুমন: মাটি-রঙা উলের লম্বা ওভারকোটের স্কেচ হলো।"]}


def marketing(state: FashionState):
    return {"steps": ["নাদিয়া: 'ঈদের নতুন রং — মাটি' ক্যাপশন লিখলেন।"]}


builder = StateGraph(FashionState)
builder.add_node("research", research)
builder.add_node("design", design)
builder.add_node("marketing", marketing)

builder.add_edge(START, "research")
builder.add_edge("research", "design")
builder.add_edge("design", "marketing")
builder.add_edge("marketing", END)

graph = builder.compile()
result = graph.invoke({"topic": "ঈদ ফ্যাশন কালেকশন ২০২৭", "steps": []})

for line in result["steps"]:
    print(line)
```

## বাস্তবে কী ঘটে

```text
রফিক: ঈদ ফ্যাশন কালেকশন ২০২৭ নিয়ে বাজার রিপোর্ট দিলেন।
সুমন: মাটি-রঙা উলের লম্বা ওভারকোটের স্কেচ হলো।
নাদিয়া: 'ঈদের নতুন রং — মাটি' ক্যাপশন লিখলেন।
```

তিনটা লেখা **ঠিক এই ক্রমেই** জমা হলো — কারণ তীরগুলো এই ক্রমেই টানা।

## এক node থেকে দুই তীর

```python
builder.add_edge("research", "design")
builder.add_edge("research", "marketing")
```

এভাবে একই node থেকে দুই জায়গায় তীর টানলে করিম ভাইয়ের নির্দেশ: "দুটোই একসাথে শুরু করো।" দুই node একই ধাপে চলে, দুজনেই একই state পড়ে। কে আগে শেষ করল, তার উপর ভরসা করা যায় না — তাই দুজনের কাজ আলাদা key-তে লিখতে হয়। বিস্তারিত [Parallel](/langgraph/parallel) পেজে।

## নতুন কী শিখলে

- ধাপের ক্রম = `add_edge`
- `START` → প্রথম node, শেষ node → `END`
- এক node থেকে একাধিক তীর = একইসাথে একাধিক কাজ

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| invoke-এ error: node-এর কোনো outgoing edge নেই | শেষ node থেকে `END`-এ তীর টানো আছে কি না দেখো |
| একটা node দুইবার চলছে | ভুল করে দুই জায়গা থেকে একই node-এ তীর টানো হয়েছে কি না দেখো |
| order উল্টো | `add_edge(A, B)` মানে **A-এর পর B** — তীরের দিকটা খেয়াল করো |

পরের ধাপে [Conditional Edges](/langgraph/conditional-edges) — করিম ভাইয়ের মাঝপথের সিদ্ধান্ত।
