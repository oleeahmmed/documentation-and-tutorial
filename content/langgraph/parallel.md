---
title: Parallel
description: ধাপ ৯ — ঢাকা, চট্টগ্রাম, সিলেট একসাথে — Send দিয়ে একই node অনেকবার চালিয়ে রিপোর্ট এক খাতায় জমা।
icon: Split
---

## গল্প

নাদিয়ার নতুন কালেকশন তিন শহরে একসাথে বাজারে নামবে। করিম ভাই বললেন, "ঢাকা, চট্টগ্রাম, সিলেট — তিন জায়গায় একই দিনে রিপোর্ট চাই। একজনের জন্য অপেক্ষা করে অন্যজন শুরু করবে না।"

তিন প্রতিনিধি একসাথে কাজ করলেন, আর তিনজনের রিপোর্ট শেষে একই খাতায় একসাথে জমা হলো।

## LangGraph-এ এই একই জিনিস

একই node-কে **একাধিক ইনপুট দিয়ে একসাথে চালানো** যায় `Send` দিয়ে।

```python
from langgraph.types import Send

def dispatch(state: FashionState):
    return [Send("survey", {"city": city}) for city in state["cities"]]
```

প্রতিটা `Send("survey", {...})` মানে: "survey node-টা এই payload দিয়ে আরেকবার চালাও।" সবগুলো একই ধাপে (একই superstep-এ) চলে।

শেষে ফলাফল জমা করার জন্য reducer লাগবেই — নাহলে শেষ জনের রিপোর্ট বাকিদের মুছে দেবে:

```python
reports: Annotated[list[str], operator.add]
```

## কোড (`parallel_project.py`)

```python
import operator
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send


class FashionState(TypedDict):
    cities: list[str]
    reports: Annotated[list[str], operator.add]


def dispatch(state: FashionState):
    return [Send("survey", {"city": city}) for city in state["cities"]]


def survey(state: FashionState):
    city = state["city"]
    return {"reports": [f"{city}: মাটি-রঙা ওভারকোটের চাহিদা ভালো, দাম ২,২০০ টাকা হলে চলবে।"]}


builder = StateGraph(FashionState)
builder.add_node("survey", survey)
builder.add_conditional_edges(START, dispatch, ["survey"])
builder.add_edge("survey", END)

graph = builder.compile()

result = graph.invoke({"cities": ["ঢাকা", "চট্টগ্রাম", "সিলেট"], "reports": []})
for line in result["reports"]:
    print(line)
```

## বাস্তবে কী ঘটে

```text
ঢাকা: মাটি-রঙা ওভারকোটের চাহিদা ভালো, দাম ২,২০০ টাকা হলে চলবে।
চট্টগ্রাম: মাটি-রঙা ওভারকোটের চাহিদা ভালো, দাম ২,২০০ টাকা হলে চলবে।
সিলেট: মাটি-রঙা ওভারকোটের চাহিদা ভালো, দাম ২,২০০ টাকা হলে চলবে।
```

> `survey` একবার লেখা, কিন্তু তিনবার চলে — প্রতি `Send`-এ একবার। প্রতিবার `state["city"]` আলাদা।

## কাঠামো

```text
START ─┬─ Send(survey, ঢাকা)      ─┬─→ END
       ├─ Send(survey, চট্টগ্রাম) ─┤
       └─ Send(survey, সিলেট)     ─┘
                (একই ধাপে)
```

## আসল শক্তি — Map-Reduce

UI-তে সাধারণত এভাবেই কাজ হয়:

1. **Map** — প্রতিটা আইটেমের জন্য `Send` (প্রতিটা শহর, প্রতিটা ডকুমেন্ট, প্রতিটা প্রশ্ন)
2. **Reduce** — reducer সব ফল এক লিস্টে জমা করে, পরের node সেটা নিয়ে সারসংক্ষেপ লেখে

```python
builder.add_edge("survey", "summarize")   # summarize state["reports"] পড়ে
builder.add_edge("summarize", END)
```

## নতুন কী শিখলে

- `Send("node", payload)` = ওই node-এর একটা extra run
- সব Send একসাথে চলে — ক্রম ধরে নিও না
- share করা list-এ অবশ্যই reducer দাও

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| শুধু শেষ রিপোর্ট আছে | `reports`-এ `operator.add` reducer দাও |
| `city` KeyError | `Send`-এর payload-এ পাঠানো হয়েছে কি না দেখো |
| ক্রম এলোমেলো | স্বাভাবিক — parallel; দরকার হলে পরে `sorted(...)` করো |

পরের ধাপে [Persistence](/langgraph/persistence) — খাতা বন্ধ করলে যা হারাবে না।
