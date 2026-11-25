---
title: প্রথম Graph
description: একদম প্রথম LangGraph — একটা node, একটা edge, compile আর invoke। শুরুতে LLM ছাড়াই, শুধু ধাপটা বোঝার জন্য।
icon: Play
---

## গল্প

করিম ভাই CrewAI-তে পুরো টিম বানিয়ে ফেলেছেন। কিন্তু এবার তিনি একটা ছোট্ট জিনিস বুঝতে চান — "একটা কাজ ঠিক কোন ধাপে, তারপর কোন ধাপে চলবে" — সেটা নিজের হাতে সাজানো যায় কীভাবে। তাই শুরুতে একজনই: রফিক। একটাই কাজ: নতুন সিজনের ট্রেন্ড নিয়ে নোট লেখা।

## LangGraph-এ এই একই জিনিস

LangGraph-এ পুরো ব্যবস্থাটা তিনটা জিনিস দিয়ে হয়:

| জিনিস | মানে |
| --- | --- |
| **State** | কাজের খাতা — সব ধাপে একই খাতা ঘুরে বেড়ায় |
| **Node** | খাতা হাতে নিয়ে এক ধাপ কাজ করে, নতুন তথ্য লিখে রাখে |
| **Edge** | এরপর কোন ধাপ চলবে |

## কোড (`first_graph.py`)

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


# ১. State: কাজের খাতার কী কী কলাম থাকবে
class FashionState(TypedDict):
    topic: str
    note: str


# ২. Node: খাতা নিয়ে কাজ করে আংশিক update ফেরত দেয়
def write_note(state: FashionState):
    return {"note": f"'{state['topic']}' নিয়ে রফিক বাজারে খোঁজ নেবে।"}


# ৩. Graph বানাও, ধাপ আর ক্রম বসাও
builder = StateGraph(FashionState)
builder.add_node("write_note", write_note)
builder.add_edge(START, "write_note")
builder.add_edge("write_note", END)

graph = builder.compile()


# ৪. চালাও
result = graph.invoke({"topic": "ঈদ ফ্যাশন কালেকশন ২০২৭"})
print(result)
```

চালাও:

```bash
python first_graph.py
```

## বাস্তবে কী ঘটে

```text
{'topic': 'ঈদ ফ্যাশন কালেকশন ২০২৭', 'note': "'ঈদ ফ্যাশন কালেকশন ২০২৭' নিয়ে রফিক বাজারে খোঁজ নেবে।"}
```

ধাপগুলো ভেঙে দেখো:

```text
START → write_note → END

invoke({"topic": ...}) দিলে:
  state = {"topic": "ঈদ ফ্যাশন কালেকশন ২০২৭"}
  write_note(state) → return {"note": "..."}   ← শুধু note বদলাল
  শেষ state = {topic, note}                     ← দুটোই একসাথে
```

## নতুন কী শিখলে

- `TypedDict` দিয়ে state-এর আকৃতি ঠিক করেছ — ভুল কলাম লিখলে পরে ধরা পড়বে
- `add_node("নাম", ফাংশন)` — ধাপের নাম তুমিই দাও; edge-এ এই নামই ব্যবহার হয়
- `START`/`END` হলো বিশেষ দুই প্রান্তবিন্দু — কোথা থেকে শুরু, কোথায় থামা
- `compile()` না করলে graph চালানো যায় না
- node শুধু **যা বদলেছে** তা ফেরত দেয়; বাকি state যেমন ছিল তেমনই থাকে

> এখনো কোনো LLM কল হয়নি — এটা ইচ্ছাকৃত। ধাপ, খাতা আর ক্রম পরিষ্কার হলে পরের পেজগুলোতে মডেল আর টুল যোগ হবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError: 'note'` | invoke-এ যা পাঠাচ্ছ, state-এ সেই key আগে থেকে আছে কিনা দেখো |
| `Graph must be compiled` | `builder.compile()` করে `graph`-এ চালাও |
| node চলছে না | `add_edge(START, "নাম")`-এ নাম হুবহু `add_node`-এর নামের মতো কিনা দেখো |

পরের ধাপে [State ও Reducer](/langgraph/state-reducer) — একাধিক ধাপ একসাথে খাতায় লিখলে কী হয়।
