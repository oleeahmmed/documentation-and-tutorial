---
title: "ধাপ ৩: দুজন কর্মচারী, এক লাইনে"
description: প্রথম কর্মচারী পণ্য চিনে স্লিপে লেখে, দ্বিতীয়জন সেটা পড়ে দাম বলে — আর stream দিয়ে ভেতরের মিছিল দেখা।
icon: GitMerge
---

## গল্প

গ্রাহক জিজ্ঞেস করলেন, "পাঞ্জাবির দাম কত?" এখন দোকানে দুজন: প্রথমজন স্লিপ থেকে পণ্যের নাম চিনে লেখে, দ্বিতীয়জন সেই ঘর পড়ে দাম বলে। দুজনের মধ্যে কথা নয় — শুধু স্লিপ।

## কোড (`step3.py`)

```python
from typing import TypedDict, Optional    # Optional মানে ঘরটা খালিও (None) থাকতে পারে
from langgraph.graph import StateGraph, START, END

# ---- দোকানের গোডাউনের তালিকা (সাধারণ পাইথন ডিকশনারি) ----
# প্রতিটা পণ্যের দাম আর কয়টা স্টকে আছে লেখা আছে
CATALOG = {
    "পাঞ্জাবি": {"price": 1800, "stock": 12},
    "শাড়ি":    {"price": 3500, "stock": 0},    # শাড়ির স্টক নেই, পরে কাজে লাগবে
    "শার্ট":    {"price": 1200, "stock": 30},
}


# ---- স্লিপের ছক ----
class Slip(TypedDict):
    message: str
    product: Optional[str]   # শুরুতে খালি থাকবে, find_product নোড এটা ভরবে
    reply: str


# ---- কর্মচারী ১: পণ্য চেনে ----
def find_product(state: Slip) -> dict:
    msg = state["message"]                       # স্লিপ থেকে গ্রাহকের বার্তা পড়লাম

    # তালিকার প্রতিটা পণ্যের নাম বার্তার ভেতরে আছে কি না খুঁজছি।
    # প্রথমটা পেলে সেটা নেবে, কিছু না পেলে None
    product = next((p for p in CATALOG if p in msg), None)

    return {"product": product}                  # স্লিপের product ঘরে লিখে দিলাম


# ---- কর্মচারী ২: দাম বলে ----
def say_price(state: Slip) -> dict:
    p = state["product"]                         # আগের কর্মচারী যা লিখেছে সেটা পড়লাম
    if p is None:                                # পণ্য চেনা না গেলে
        return {"reply": "কোন পণ্যের দাম জানতে চান?"}
    return {"reply": f"{p}-র দাম {CATALOG[p]['price']} টাকা।"}


# ---- গ্রাফ সাজাই ----
builder = StateGraph(Slip)

# কর্মচারীদের বসাই (নাম, ফাংশন)
builder.add_node("find_product", find_product)
builder.add_node("say_price", say_price)

# রাস্তা বানাই: START -> find_product -> say_price -> END
builder.add_edge(START, "find_product")
builder.add_edge("find_product", "say_price")    # এই এজটাই বলছে "এর পরে ওর কাছে যাও"
builder.add_edge("say_price", END)

graph = builder.compile()

# চালাই এবং শুধু reply ঘরটা ছাপাই
print(graph.invoke({"message": "পাঞ্জাবির দাম কত?"})["reply"])
```

## বাস্তবে কী ঘটে

```text
পাঞ্জাবি-র দাম 1800 টাকা।
```

## ভেতরে কী হচ্ছে চোখে দেখো (stream)

শেষ লাইনটা মুছে এটা লেখো:

```python
# stream মানে ধাপে ধাপে চালানো। প্রতিটা নোড শেষ হলেই সে কী লিখল সেটা দেখায়
for step in graph.stream({"message": "পাঞ্জাবির দাম কত?"}):
    print(step)
```

```text
{'find_product': {'product': 'পাঞ্জাবি'}}
{'say_price': {'reply': 'পাঞ্জাবি-র দাম 1800 টাকা।'}}
```

প্রথমে `find_product` স্লিপে `product` লিখল, তারপর `say_price` সেটা পড়ে `reply` লিখল। **ভুল খুঁজতে গেলে এই `stream` সবচেয়ে কাজে লাগে** — কোন ধাপে স্লিপে কী জমল, সব চোখের সামনে।

> **সোনালি নিয়ম ২:** এক node-এর লেখা জিনিস পরের node `state` থেকে পায়। node-রা সরাসরি একে অপরের সাথে কথা বলে না, সবকিছু স্লিপের মাধ্যমে হয়।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| reply-তে `None-র দাম` লেখা | `product` ভরে না — বার্তায় পণ্যের নাম হুবহু আছে কি না দেখো |
| `KeyError: 'product'` | আগের node `product` ঘর ফেরত দিচ্ছে কি না দেখো |
| stream কিছু ছাপছে না | `invoke`-এর বদলে `stream` ব্যবহার করেছ তো? |

পরের ধাপে [পুরো দোকান](/langgraph/shop-graph) — গেটম্যান, স্টকম্যান, ক্যাশিয়ার আর রাস্তা ভাগ।
