---
title: "ধাপ ৬: ঘুরে আসার লুপ"
description: শাড়ির স্টক নেই? অন্য পণ্য খুঁজে আবার চেষ্টা — একটা edge-ই লুপ বানায়, আর tries গোনে থামায়।
icon: RefreshCw
---

## গল্প

গ্রাহক শাড়ি চাইলেন, স্টক নেই। রফিক সাহেব বললেন, "অন্য কিছু দেখাও।" বট অন্য পণ্য খুঁজে আবার স্টক দেখবে। তবে অনন্তকাল ঘুরলে তো চলবে না — সর্বোচ্চ ৩ বার।

## কোড (`loop.py`)

এটা আলাদা ফাইল, তাই সব আবার লিখতে হবে:

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

CATALOG = {
    "পাঞ্জাবি": {"price": 1800, "stock": 12},
    "শাড়ি":    {"price": 3500, "stock": 0},
    "শার্ট":    {"price": 1200, "stock": 30},
}


# ---- স্লিপ ----
class S(TypedDict):
    product: str        # এখন কোন পণ্য নিয়ে কথা হচ্ছে (ঘুরতে ঘুরতে এটা বদলাবে)
    in_stock: bool      # মাল আছে কি না
    tries: int          # 👈 কতবার চেষ্টা করলাম। এটাই লুপ থামানোর চাবি
    reply: str


# ---- স্টকম্যান ----
def check_stock(s: S) -> dict:
    # বর্তমান পণ্যের স্টক ০-এর বেশি হলে True
    return {"in_stock": CATALOG[s["product"]]["stock"] > 0}


# ---- রাউটার: এখান থেকেই ঠিক হয় লুপ চলবে না থামবে ----
def route(s: S) -> str:
    if s["in_stock"]:
        return "confirm"        # মাল আছে, সোজা অর্ডার নিশ্চিত করো
    if s["tries"] < 3:          # 👈 থামার শর্ত: ৩ বারের কম চেষ্টা হয়ে থাকলে
        return "suggest"        # মাল নেই, অন্য পণ্য খুঁজে আবার চেষ্টা করো
    return "sorry"              # ৩ বার চেষ্টা হয়ে গেছে, ক্ষমা চেয়ে থামো


# ---- অন্য পণ্য খোঁজার কর্মী ----
def suggest(s: S) -> dict:
    for name, info in CATALOG.items():
        # বর্তমান পণ্য ছাড়া অন্য যেটার স্টক আছে সেটা নাও
        if name != s["product"] and info["stock"] > 0:
            # নতুন পণ্য আর চেষ্টার সংখ্যা ১ বাড়িয়ে স্লিপে লিখলাম
            return {"product": name, "tries": s["tries"] + 1}
    # কোনো পণ্যই না পেলেও চেষ্টা ১ বাড়াতে হবে, নইলে অনন্ত লুপ হবে
    return {"tries": s["tries"] + 1}


def confirm(s: S) -> dict:
    return {"reply": f"{s['product']} পাওয়া গেল!"}


def sorry(s: S) -> dict:
    return {"reply": "দুঃখিত, কিছু পাওয়া গেল না।"}


# ---- গ্রাফ সাজাই ----
b = StateGraph(S)
b.add_node("check_stock", check_stock)
b.add_node("suggest", suggest)
b.add_node("confirm", confirm)
b.add_node("sorry", sorry)

b.add_edge(START, "check_stock")

# check_stock-এর পর রাউটার তিন রাস্তার একটা বাছবে
b.add_conditional_edges(
    "check_stock", route,
    {"confirm": "confirm", "suggest": "suggest", "sorry": "sorry"},
)

# 👇 এই একটা এজই লুপ বানাচ্ছে: suggest শেষ হলে আবার check_stock-এ ফিরে যাও
b.add_edge("suggest", "check_stock")

b.add_edge("confirm", END)
b.add_edge("sorry", END)

graph = b.compile()

# শাড়ি দিয়ে শুরু করছি (স্টক নেই), চেষ্টা শুরুতে ০
print(graph.invoke({"product": "শাড়ি", "tries": 0}))
```

## বাস্তবে কী ঘটে

```text
{'product': 'পাঞ্জাবি', 'in_stock': True, 'tries': 1, 'reply': 'পাঞ্জাবি পাওয়া গেল!'}
```

লুপটা এভাবে চলল: শাড়ির স্টক নেই → `suggest` পাঞ্জাবি খুঁজে পেল → আবার `check_stock` → এবার স্টক আছে → `confirm`।

## লুপটা চোখে দেখো

`stream` দিলে প্রতিটা পাক স্পষ্ট দেখতে পাবে:

```python
for step in graph.stream({"product": "শাড়ি", "tries": 0}):
    print(step)
```

```text
{'check_stock': {'in_stock': False}}
{'suggest': {'product': 'পাঞ্জাবি', 'tries': 1}}
{'check_stock': {'in_stock': True}}
{'confirm': {'reply': 'পাঞ্জাবি পাওয়া গেল!'}}
```

> **মূল পয়েন্ট:** লুপ মানে শুধু একটা edge, যেটা আগের node-এ ফিরে যায়। থামার শর্ত (`tries < 3`) না দিলে LangGraph ২৫ ধাপ পরে `GraphRecursionError` দিয়ে নিজেই থামিয়ে দেয়।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `GraphRecursionError` | `tries` বাড়ছে না, বা থামার শর্ত নেই — রাউটার দেখো |
| লুপ থামছে প্রথম চেষ্টায় | `suggest`-এ `tries` বাড়ানো ভুলে গেছ কি না দেখো |
| `KeyError: 'tries'` | invoke-এ `tries` শুরুতে ০ দাও |

পরের ধাপে [গ্রাহককে মনে রাখো](/langgraph/memory) — একই গ্রাহক ফিরে এলে আগের কথা।
