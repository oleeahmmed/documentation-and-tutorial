---
title: Conditional Edges
description: ধাপ ৬ — রিপোর্ট ভালো হলে ডিজাইন, খারাপ হলে অন্য পথ — করিম ভাইয়ের if/else সিদ্ধান্তই conditional edge।
icon: GitFork
---

## গল্প

রফিক বাজার থেকে ফিরে এসে খাতায় লিখলেন: "মাটি-রঙা উলের ওভারকোটের চাহিদা বেশি।"

করিম ভাই হাততালি দিয়ে বললেন, "তাহলে সুমন ডিজাইন শুরু করুক।"

কিন্তু করিম ভাইয়ের মাথায় আরেকটা নিয়মও আছে — যদি চাহিদা কম পাওয়া যেত, তাহলে সুমন ডিজাইন করতেন না; বরং খরচ কমাতে নাদিয়া কম-বাজেটের পোস্ট করতেন।

মানে কাজের ক্রমটা আগেই ঠিক করা যায় না — **রিপোর্ট পড়ে তারপর ঠিক হয়**। এটাই conditional edge।

## LangGraph-এ এই একই জিনিস

`add_conditional_edges` হলো এক ধরনের "রাউটার": একটা **ফাংশন** state দেখে বলে দেয় এরপর কোন node চলবে।

```python
builder.add_conditional_edges("research", route_after_research, ["design", "low_budget"])
```

- প্রথম argument: কোন node-এর পরে সিদ্ধান্ত নেবে
- দ্বিতীয়: সেই রাউটার ফাংশন — state নিয়ে node-এর **নাম** ফেরত দেয়
- তৃতীয়: যে node-গুলোতে যাওয়া সম্ভব, তাদের তালিকা (path map)

## কোড (`conditional_project.py`)

```python
from typing import Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


class FashionState(TypedDict):
    demand: str      # "বেশি" বা "কম"
    plan: str


def research(state: FashionState):
    return {"demand": "বেশি"}


def route_after_research(state: FashionState) -> Literal["design", "low_budget"]:
    if state["demand"] == "বেশি":
        return "design"
    return "low_budget"


def design(state: FashionState):
    return {"plan": "সুমন লম্বা ওভারকোটের পুরো ডিজাইন করলেন।"}


def low_budget(state: FashionState):
    return {"plan": "সুমন ছোট স্কার্ফের ডিজাইন করলেন, নাদিয়া কম-বাজেট পোস্ট লিখলেন।"}


builder = StateGraph(FashionState)
builder.add_node("research", research)
builder.add_node("design", design)
builder.add_node("low_budget", low_budget)

builder.add_edge(START, "research")
builder.add_conditional_edges(
    "research",
    route_after_research,
    ["design", "low_budget"],
)
builder.add_edge("design", END)
builder.add_edge("low_budget", END)

graph = builder.compile()

print(graph.invoke({"demand": "", "plan": ""}))
```

`research` node-এ `demand` হার্ডকোড করা আছে শুধু চালানোর জন্য। বাস্তবে এটা আসত LLM বা ডেটাবেস থেকে।

## বাস্তবে কী ঘটে

```text
{'demand': 'বেশি', 'plan': 'সুমন লম্বা ওভারকোটের পুরো ডিজাইন করলেন।'}
```

`demand` কে `"কম"` করে দিলে আউটপুট বদলে যাবে:

```text
{'demand': 'কম', 'plan': 'সুমন ছোট স্কার্ফের ডিজাইন করলেন, নাদিয়া কম-বাজেট পোস্ট লিখলেন।'}
```

## চিত্রে যেভাবে দেখবে

```text
START → research ──(demand == "বেশি")──→ design ──→ END
              └──(নাহলে)───────────────→ low_budget ──→ END
```

`graph.get_graph().draw_mermaid()` চালালে এই ছবিটাই mermaid কোড আকারে পাবে।

## রাউটার ফাংশনের নিয়ম

- ইনপুট: state
- আউটপুট: একটি node-এর নাম (অথবা এমন নামের list, যেগুলো সব একসাথে চলবে)
- নামটা graph-এ থাকা **অবশ্যই** দরকার — ভুল বানান দিলে invoke-এ error

`path_map` দিয়ে রাউটারের ছোট নামগুলো আসল node-এ মিলিয়ে দেয়া যায়:

```python
def is_hot(state: FashionState) -> Literal["yes", "no"]:
    return "yes" if state["demand"] == "বেশি" else "no"

builder.add_conditional_edges(
    "research",
    is_hot,
    {"yes": "design", "no": "low_budget"},
)
```

## নতুন কী শিখলে

- `add_conditional_edges` = state দেখে পথ বাছাই
- রাউটারে LLM-ও ডাকা যায় — যেমন "রিপোর্ট কি যথেষ্ট?" সিদ্ধান্তটা LLM-কে দিয়ে
- রাউটার নিজে কোনো কাজ করে না, শুধু পথ বলে দেয়

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ValueError: Expected node ...` | রাউটারের ফেরত নাম graph-এর node-এর সাথে হুবহু না মিললে |
| graph ধরে রাখছে | যেই পথেই যাও না কেন, শেষে `END`-এ পৌঁছাচ্ছে কি না দেখো |
| একই node বারবার চলছে | রাউটার শর্ত কখনো মিলছে না — শর্তটা print করে দেখো |

পরের ধাপে [LLM Node](/langgraph/llm-node) — খাতায় এবার সত্যিকারের AI লিখবে।
