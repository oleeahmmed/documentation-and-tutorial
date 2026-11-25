---
title: "ধাপ ৮: রফিক সাহেবের অনুমতি"
description: বড় অর্ডারে graph মাঝপথে থামবে, মালিকের সইয়ের পর আবার চলবে — interrupt আর Command(resume=...)।
icon: UserCheck
---

## গল্প

১০,০০০ টাকার বেশি অর্ডার হলে বট নিজে সিদ্ধান্ত নেবে না। রফিক সাহেবকে জিজ্ঞেস করবে, আর উত্তর না আসা পর্যন্ত কাজ থেমে থাকবে। সই পেলে কাজ শেষ, "না" বললে বাতিল।

এটা কোনো error নয় — ইচ্ছাকৃত থামা। LangGraph-এ এর নাম **`interrupt`**।

## কোড (`approval.py`)

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

# interrupt: গ্রাফকে মাঝপথে থামানোর কাজ করে
# Command: থামানো গ্রাফকে "এই নাও উত্তর, এবার চলো" বলে আবার চালু করে
from langgraph.types import interrupt, Command


class OrderState(TypedDict):
    amount: int      # অর্ডারের মোট টাকা
    reply: str


def approve(state: OrderState) -> dict:
    if state["amount"] > 10000:
        # 👇 এখানে গ্রাফ থেমে যাবে। ভেতরের dict-টা মালিককে দেখানোর প্রশ্ন।
        # মালিক উত্তর দিলে সেই উত্তরটা এসে decision ভেরিয়েবলে জমা হবে
        decision = interrupt({
            "question": "রফিক সাহেব, এই অর্ডার অনুমোদন করবেন?",
            "amount": state["amount"],
        })
        return {"reply": "অনুমোদিত" if decision == "হ্যাঁ" else "বাতিল"}

    # ১০,০০০-এর কম হলে মালিককে জিজ্ঞেস না করেই অনুমোদন
    return {"reply": "স্বয়ংক্রিয়ভাবে অনুমোদিত"}


b = StateGraph(OrderState)
b.add_node("approve", approve)
b.add_edge(START, "approve")
b.add_edge("approve", END)

# 👇 চেকপয়েন্টার না থাকলে interrupt চলে না, কারণ থেমে থাকা অবস্থাটা কোথাও রাখতে হয়
graph = b.compile(checkpointer=InMemorySaver())

# এই অর্ডারের একটা নাম (thread_id) দিলাম, যাতে থামার পর ঠিক এই অর্ডারেই ফিরে আসা যায়
cfg = {"configurable": {"thread_id": "order-101"}}

# ---- প্রথমবার চালাই: ৫০,০০০ টাকার বড় অর্ডার ----
# গ্রাফ approve নোডে এসে interrupt-এ থেমে যাবে
result = graph.invoke({"amount": 50000}, cfg)

# থেমে গেলে ফলাফলে "__interrupt__" নামে একটা চাবি থাকে। তাতে প্রশ্নটা পাওয়া যায়
print(result["__interrupt__"][0].value)

# ---- রফিক সাহেব উত্তর দিলেন "হ্যাঁ" ----
# একই cfg দিয়ে Command(resume="হ্যাঁ") পাঠালে গ্রাফ ঠিক থামার জায়গা থেকে চলবে
print(graph.invoke(Command(resume="হ্যাঁ"), cfg))
```

## বাস্তবে কী ঘটে

```text
{'question': 'রফিক সাহেব, এই অর্ডার অনুমোদন করবেন?', 'amount': 50000}
{'amount': 50000, 'reply': 'অনুমোদিত'}
```

প্রথম invoke-এ গ্রাফ থেমেই আছে — `reply` নেই, শুধু প্রশ্নটা হাতে এসেছে। রফিক সাহেব "হ্যাঁ" বলার পর দ্বিতীয় invoke চলল আর `reply` লেখা হলো। `"না"` পাঠালে হতো `বাতিল`।

## একটা সূক্ষ্ম কথা

Resume করার সময় `approve` node **শুরু থেকে আবার চলে**। তখন `interrupt(...)` আর থামে না — সঙ্গে সঙ্গে resume-এ পাঠানো মানটা ফেরত দেয়।

তাই `interrupt`-এর **আগে** টাকা কাটা, ডেটাবেসে লেখা — এমন কাজ রেখো না। ওগুলো `interrupt`-এর **পরে** রাখো।

## নতুন কী শিখলে

- `interrupt(payload)` = ইচ্ছাকৃত বিরতি; state checkpointer-এ সংরক্ষিত থাকে
- `Command(resume=মান)` = সেই বিরতি থেকে চালু; `interrupt(...)`-এর return হয় সেই মান
- একই `thread_id` না হলে resume কাজ করবে না

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `No checkpointer set` | `compile(checkpointer=...)` দাও — interrupt-এর শর্ত |
| `__interrupt__` KeyError | অর্ডার ১০,০০০-এর বেশি তো? ছোট হলে interrupt-ই হয় না |
| resume-এ graph চলছে না | প্রতি invoke-এ একই `cfg` দিচ্ছ তো? |
| একই কাজ দুইবার | `interrupt`-এর আগের কোড idempotent করো |

পরের ধাপে [LLM গেটম্যান](/langgraph/llm-node) — খোঁজা-শব্দের বদলে সত্যিকারের AI।
