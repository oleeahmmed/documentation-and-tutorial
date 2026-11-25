---
title: Human-in-the-Loop
description: ধাপ ১১ — করিম ভাইয়ের স্বাক্ষর ছাড়া পোস্ট পাবলিশ হবে না; interrupt দিয়ে কাজ থামানো আর Command(resume=...) দিয়ে চালু করা।
icon: UserCheck
---

## গল্প

নাদিয়ার পোস্ট লেখা হয়ে গেল। করিম ভাইয়ের কড়া নিয়ম: "আমার চোখে না পড়ে ফেসবুকে কিছু যাবে না।"

তাই কাজটা ঠিক এইখানে থামে — নাদিয়া খাতা আর কলম রেখে করিম ভাইয়ের টেবিলে পোস্টটা রেখে আসেন। করিম ভাই পড়ে বলেন "পাবলিশ" বা "বাতিল"। তারপর কাজ সেখান থেকেই এগোয়।

এটা কোনো error নয় — ইচ্ছাকৃত থামা। LangGraph-এ এর নাম **`interrupt`**।

## LangGraph-এ এই একই জিনিস

```python
from langgraph.types import interrupt, Command

def approval(state):
    decision = interrupt({"draft": state["draft"]})   # 👈 এখানে graph থেমে যায়
    return {"approved": decision == "পাবলিশ"}
```

- `interrupt(payload)` graph-কে থামায়, আর payload-টা বাইরের দুনিয়াকে দেখায়
- বাইরের কোড `Command(resume=মান)` দিয়ে চালু করলে **সেই মানটাই** `interrupt(...)`-এর return হয়
- এজন্য **checkpointer বাধ্যতামূলক** — থামার মুহূর্তটা কোথায় রাখবে?

## কোড (`hitl_project.py`)

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import interrupt, Command


class PostState(TypedDict):
    draft: str
    approved: bool
    published: str


def write_post(state: PostState):
    return {"draft": "ঈদের নতুন রং — মাটি। রূপসী ফ্যাশনের মাটি-রঙা ওভারকোট এখন পাওয়া যাচ্ছে।"}


def approval(state: PostState):
    decision = interrupt({"draft": state["draft"], "প্রশ্ন": "পোস্টটা পাবলিশ করব?"})
    return {"approved": decision == "পাবলিশ"}


def publish(state: PostState):
    if not state["approved"]:
        return {"published": "পাবলিশ হয়নি — করিম ভাই বাতিল করেছেন।"}
    return {"published": f"ফেসবুকে গেল: {state['draft']}"}


builder = StateGraph(PostState)
builder.add_node("write_post", write_post)
builder.add_node("approval", approval)
builder.add_node("publish", publish)
builder.add_edge(START, "write_post")
builder.add_edge("write_post", "approval")
builder.add_edge("approval", "publish")
builder.add_edge("publish", END)

graph = builder.compile(checkpointer=InMemorySaver())
config = {"configurable": {"thread_id": "post-1024"}}

paused = graph.invoke({"draft": "", "approved": False, "published": ""}, config)
print(paused["__interrupt__"])

resumed = graph.invoke(Command(resume="পাবলিশ"), config)
print(resumed["published"])
```

## বাস্তবে কী ঘটে

প্রথম invoke-এ:

```text
(Interrupt(value={'draft': 'ঈদের নতুন রং — মাটি। রূপসী ফ্যাশনের মাটি-রঙা ওভারকোট এখন পাওয়া যাচ্ছে।', 'প্রশ্ন': 'পোস্টটা পাবলিশ করব?'}, id='...'),)
```

`published` নেই — কারণ graph `approval`-এ দাঁড়িয়ে আছে। এখানেই UI-তে করিম ভাইকে পোস্টটা দেখানো হয়।

`Command(resume="পাবলিশ")` দেওয়ার পর:

```text
ফেসবুকে গেল: ঈদের নতুন রং — মাটি। রূপসী ফ্যাশনের মাটি-রঙা ওভারকোট এখন পাওয়া যাচ্ছে।
```

`"বাতিল"` দিলে:

```text
পাবলিশ হয়নি — করিম ভাই বাতিল করেছেন।
```

## একটা সূক্ষ্ম কথা

Resume করার সময় `approval` node **শুরু থেকে আবার চলে**। তখন `interrupt(...)` আর থামে না — সেটা সঙ্গে সঙ্গে resume-এ পাঠানো মানটা ফেরত দেয়।

তাই `interrupt`-এর **আগে** যা আছে, সেটা যেন দুইবার চালালেও সমস্যা না করে — ডেটাবেসে লিখছে বা টাকা কাটছে, এমন কাজ ওখানে রেখো না। ওগুলো `interrupt`-এর **পরে** রাখো।

## নতুন কী শিখলে

- `interrupt` = graph-এর ইচ্ছাকৃত বিরতি, state সংরক্ষিত থাকে
- `Command(resume=...)` = সেই বিরতি থেকে চালু
- একই `thread_id` না হলে resume কাজ করবে না

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `No checkpointer set` | `compile(checkpointer=...)` দাও — interrupt-এর শর্ত |
| resume-এ graph চলছে না | প্রতি invoke-এ একই `thread_id` দিচ্ছ তো? |
| `__interrupt__` নেই | `approval` node আসলে চলেছে কি না print করে দেখো |
| একই কাজ দুইবার | `interrupt`-এর আগের কোড idempotent করো |

পরের ধাপে [Streaming](/langgraph/streaming) — কাজ চলার সময় একটা একটা ধাপ পর্দায় দেখা।
