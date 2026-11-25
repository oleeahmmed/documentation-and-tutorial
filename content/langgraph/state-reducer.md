---
title: State ও Reducer
description: ধাপ ৩ — একাধিক ধাপ যখন একই খাতায় লিখবে, তখন reducer ঠিক করে নতুন লেখা যোগ হবে না পুরোনোটা মুছে যাবে।
icon: Database
---

> এখান থেকে শুরু গল্পের সিরিজ — প্রতিটা টপিকে আগে **রূপসী ফ্যাশনের বাস্তব গল্প**, তারপর ঠিক একই জিনিস **LangGraph-এ**।

## গল্প

রফিক বাজার থেকে ফিরে এসে করিম ভাইকে বললেন, "ঈদে মাটি-রঙা উলের কাপড় চলছে।" করিম ভাই বললেন, "লেখো।" রফিক খাতায় লিখলেন।

তারপর সুমন এলেন, বললেন, "মাটি-রঙা কাপড় দিয়ে লম্বা ওভারকোট ভালো হবে।" করিম ভাই বললেন, "এটাও লেখো।"

লক্ষ্য করো — খাতায় রফিকের লেখাটা মুছে যায়নি, সুমনের লেখাটা **নিচে যোগ** হয়েছে। দুইজনের কথা একসাথে থাকল, কারণ খাতা ভাগ করা আর **যোগ করার নিয়ম** আগেই ঠিক ছিল।

## LangGraph-এ এই একই জিনিস

State হলো সেই খাতা। প্রতিটা node শুধু তার নিজের **update** ফেরত দেয়। কিন্তু সেটা কীভাবে বসবে — পুরোনো মান **মুছে বসবে** (overwrite) না **যোগ হবে** (append) — সেটা ঠিক করে **reducer**।

- ডিফল্ট: update পুরোনো মানকে replace করে
- `Annotated[list[str], operator.add]`: নতুন লিস্ট পুরোনো লিস্টের শেষে **যোগ** হয়

## কোড (`state_project.py`)

```python
import operator
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


class FashionState(TypedDict):
    topic: str
    notes: Annotated[list[str], operator.add]   # 👈 যোগ হবে
    status: str                                  # 👈 replace হবে


def research(state: FashionState):
    return {
        "notes": ["রফিক: মাটি-রঙা উলের কাপড় চলছে।"],
        "status": "research_done",
    }


def design(state: FashionState):
    return {
        "notes": ["সুমন: মাটি-রঙা কাপড়ে লম্বা ওভারকোট ভালো হবে।"],
        "status": "design_done",
    }


builder = StateGraph(FashionState)
builder.add_node("research", research)
builder.add_node("design", design)
builder.add_edge(START, "research")
builder.add_edge("research", "design")
builder.add_edge("design", END)

graph = builder.compile()

result = graph.invoke({"topic": "ঈদ ফ্যাশন কালেকশন ২০২৭", "notes": [], "status": "new"})
print(result["notes"])
print(result["status"])
```

## বাস্তবে কী ঘটে

```text
['রফিক: মাটি-রঙা উলের কাপড় চলছে।', 'সুমন: মাটি-রঙা কাপড়ে লম্বা ওভারকোট ভালো হবে।']
design_done
```

খেয়াল করো:

- `notes`-এ দুজনের লেখাই আছে — কারণ `operator.add` দুটো লিস্ট জোড়া লাগিয়েছে
- `status`-এ শুধু শেষ মান — কারণ এখানে reducer নেই, দ্বিতীয় node প্রথম মানটা replace করেছে

## reducer বাদ দিলে কী হতো

```python
notes: list[str]   # reducer ছাড়া
```

তাহলে সুমনের node `["সুমন: ..."]` ফেরত দেওয়ামাত্র রফিকের নোটটা **হারিয়ে যেত** — খাতায় থাকত শুধু শেষ লেখা।

## নতুন কী শিখলে

- state-এর প্রতিটা key-এর নিজস্ব নিয়ম থাকতে পারে — একটাতে append, আরেকটায় replace
- `Annotated[list[str], operator.add]` মানে: "এই key-তে নতুন লিস্ট এলে পুরোনোটার সাথে জোড়া দাও"
- মেসেজের জন্য সবচেয়ে প্রচলিত reducer হলো `add_messages` — পরের page-গুলোতে সেটাই ব্যবহার হবে

> `add_messages` শুধু যোগ করে না — একই `id`-র পুরোনো মেসেজ থাকলে সেটা **আপডেট**ও করে। মানুষ এসে মেসেজ এডিট করলে এটাই দরকার হয়।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| পুরোনো নোট হারিয়ে যাচ্ছে | list key-তে `Annotated[..., operator.add]` দাও |
| `TypeError: can only concatenate list` | `invoke`-এ list key-এর প্রাথমিক মান `[]` দাও |
| দুবার একই নোট | node একই ধাপ দুইবার চলছে — edge দেখো |

পরের ধাপে [Nodes](/langgraph/nodes) — একাধিক কর্মীর ধাপ কীভাবে সাজায়।
