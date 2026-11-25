---
title: "ধাপ ৪: পুরো দোকান"
description: গেটম্যান, স্টকম্যান, ক্যাশিয়ার — চার রকম গ্রাহক, চার রকম রাস্তা; conditional edge দিয়ে পুরো দোকান।
icon: Store
---

## গল্প

এবার আসল খেলা। গ্রাহক এসে চার রকম কথা বলতে পারেন — দাম জানতে চান, কিনতে চান, অভিযোগ করতে চান, বা শুধু সালাম দিতে চান। গেটম্যান স্লিপে বুঝে নেয় কোনটা, আর তারপর স্লিপ যায় আলাদা আলাদা কর্মচারীর কাছে।

কোডটা বড়, তাই পাঁচটা অংশে ভাঙা। সব অংশ একই ফাইলে (`ruposhi.py`) ওপর থেকে নিচে পরপর বসাও।

## অংশ ক: আমদানি, স্লিপ আর গোডাউন

```python
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, START, END


# ---- অর্ডার স্লিপ (State) ----
# এই স্লিপে সব তথ্য থাকবে। প্রতিটা কর্মচারী এখান থেকে পড়বে আর এখানেই লিখবে
class ShopState(TypedDict):
    message: str                 # গ্রাহক কী লিখলেন (শুরুতেই আমরা এটা দেব)
    intent: Optional[str]        # গ্রাহক কী চায়: price / order / complaint / other
    product: Optional[str]       # কোন পণ্য নিয়ে কথা বলছে
    in_stock: Optional[bool]     # মাল আছে কি না (True/False)
    reply: Optional[str]         # শেষে গ্রাহককে যা বলব


# ---- গোডাউনের তালিকা ----
CATALOG = {
    "পাঞ্জাবি": {"price": 1800, "stock": 12},
    "শাড়ি":    {"price": 3500, "stock": 0},
    "শার্ট":    {"price": 1200, "stock": 30},
}
```

## অংশ খ: কর্মচারীরা (Node)

```python
# ---- গেটম্যান: গ্রাহক কী চায় বুঝে স্লিপে লিখে রাখে ----
def classify_intent(state: ShopState) -> dict:
    msg = state["message"]    # স্লিপ থেকে বার্তা পড়ি

    # নিচের তিনটা শর্ত ওপর থেকে নিচে একটা একটা করে মেলানো হয়।
    # any(...) মানে: তালিকার যেকোনো একটা শব্দ বার্তায় থাকলেই True
    if any(w in msg for w in ["খারাপ", "ফেরত", "অভিযোগ"]):
        intent = "complaint"          # অভিযোগ আগে দেখছি, কারণ এটা সবচেয়ে জরুরি
    elif any(w in msg for w in ["কিনব", "অর্ডার", "নেব"]):
        intent = "order"
    elif any(w in msg for w in ["দাম", "কত"]):
        intent = "price"
    else:
        intent = "other"              # কোনোটাই না মিললে

    # বার্তায় কোন পণ্যের নাম আছে সেটাও খুঁজে নিই (না পেলে None)
    product = next((p for p in CATALOG if p in msg), None)

    # স্লিপে দুটো ঘর একসাথে লিখলাম: intent আর product
    return {"intent": intent, "product": product}


# ---- স্টকম্যান: গোডাউনে মাল আছে কি না দেখে ----
def check_stock(state: ShopState) -> dict:
    item = CATALOG.get(state["product"])      # তালিকা থেকে পণ্যটা বের করলাম
    # item আছে এবং স্টক ০-এর বেশি হলে True, নইলে False
    return {"in_stock": bool(item and item["stock"] > 0)}


# ---- দামের কর্মী: দাম বলে ----
def give_price(state: ShopState) -> dict:
    item = CATALOG.get(state["product"])
    if not item:                              # পণ্য চেনা না গেলে জিজ্ঞেস করি
        return {"reply": "কোন পণ্যের দাম জানতে চান? পাঞ্জাবি, শাড়ি না শার্ট?"}
    return {"reply": f"{state['product']}-র দাম {item['price']} টাকা।"}


# ---- ক্যাশিয়ার: অর্ডার নিশ্চিত করে ----
def confirm_order(state: ShopState) -> dict:
    p = state["product"]
    if state["in_stock"]:                     # স্টকম্যান যা লিখে গেছে সেটা পড়ছি
        CATALOG[p]["stock"] -= 1              # একটা মাল কমিয়ে দিলাম
        return {"reply": f"আপনার {p} অর্ডার নিশ্চিত! দাম {CATALOG[p]['price']} টাকা।"}
    return {"reply": f"দুঃখিত, {p} এখন স্টকে নেই।"}


# ---- রফিক সাহেব নিজে: অভিযোগ সামলান ----
def handle_complaint(state: ShopState) -> dict:
    return {"reply": "অসুবিধার জন্য দুঃখিত। রফিক সাহেব নিজে আপনার সাথে যোগাযোগ করবেন।"}


# ---- বাকি সব ক্ষেত্রে ----
def fallback(state: ShopState) -> dict:
    return {"reply": "রূপসী ফ্যাশনে স্বাগতম! দাম, অর্ডার বা সমস্যা, কী জানতে চান?"}
```

## অংশ গ: রাউটার

```python
# রাউটার শুধু একটা শব্দ (স্ট্রিং) ফেরত দেয়। কোনো কাজ করে না, শুধু দিক দেখায়।
# এখানে আমরা স্লিপে গেটম্যানের লেখা intent-টাই ফেরত দিচ্ছি
def route_by_intent(state: ShopState) -> str:
    return state["intent"]     # 👈 "price" / "order" / "complaint" / "other"-এর একটা
```

## অংশ ঘ: গ্রাফ সাজানো

```python
# ধাপ ১: খালি গ্রাফ বানাও, স্লিপের ছক বলে দাও
builder = StateGraph(ShopState)

# ধাপ ২: সব কর্মচারীকে দোকানে বসাও। add_node("নাম", ফাংশন)
builder.add_node("classify_intent", classify_intent)
builder.add_node("check_stock", check_stock)
builder.add_node("give_price", give_price)
builder.add_node("confirm_order", confirm_order)
builder.add_node("handle_complaint", handle_complaint)
builder.add_node("fallback", fallback)

# ধাপ ৩: গ্রাহক ঢুকে সবার আগে গেটম্যানের কাছে যাবে
builder.add_edge(START, "classify_intent")

# ধাপ ৪: 👇 রাস্তা ভাগ। এখানে তিনটা জিনিস দিতে হয়:
builder.add_conditional_edges(
    "classify_intent",       # (ক) কোন নোডের কাজ শেষ হলে রাস্তা ভাগ হবে
    route_by_intent,         # (খ) কোন ফাংশন রাস্তা বাছবে
    {                        # (গ) রাউটার কোন শব্দ ফেরত দিলে কোন নোডে যাবে
        "price": "give_price",
        "order": "check_stock",         # কিনতে চাইলে আগে স্টক দেখবে
        "complaint": "handle_complaint",
        "other": "fallback",
    },
)

# ধাপ ৫: স্টক দেখার পর ক্যাশিয়ারের কাছে যাবে
builder.add_edge("check_stock", "confirm_order")

# ধাপ ৬: যাদের কাজ এখানেই শেষ, তাদের সবাইকে END-এ পাঠাও (লুপ দিয়ে একসাথে)
for node in ["give_price", "confirm_order", "handle_complaint", "fallback"]:
    builder.add_edge(node, END)

# ধাপ ৭: দোকানের দরজা খোলো
graph = builder.compile()
```

## অংশ ঙ: পাঁচজন গ্রাহক পাঠিয়ে পরীক্ষা

```python
# এই if-টা বলছে: ফাইলটা সরাসরি চালালে তবেই নিচের কোড চলবে
if __name__ == "__main__":
    # পাঁচ রকম গ্রাহকের বার্তা
    tests = [
        "পাঞ্জাবির দাম কত?",
        "আমি একটা শার্ট কিনব",
        "শাড়ি অর্ডার করব",
        "পাঞ্জাবিটা খারাপ, ফেরত চাই",
        "আসসালামু আলাইকুম",
    ]
    for t in tests:
        # প্রতিবার একজন গ্রাহককে দোকানে ঢোকাই। শুরুতে শুধু message ঘর ভরা থাকে
        result = graph.invoke({"message": t})
        # শেষে স্লিপের reply ঘরে যা লেখা আছে সেটা ছাপাই
        print(f"গ্রাহক: {t}\nবট   : {result['reply']}\n")
```

চালাও:

```bash
python ruposhi.py
```

## বাস্তবে কী ঘটে

```text
গ্রাহক: পাঞ্জাবির দাম কত?
বট   : পাঞ্জাবি-র দাম 1800 টাকা।

গ্রাহক: আমি একটা শার্ট কিনব
বট   : আপনার শার্ট অর্ডার নিশ্চিত! দাম 1200 টাকা।

গ্রাহক: শাড়ি অর্ডার করব
বট   : দুঃখিত, শাড়ি এখন স্টকে নেই।

গ্রাহক: পাঞ্জাবিটা খারাপ, ফেরত চাই
বট   : অসুবিধার জন্য দুঃখিত। রফিক সাহেব নিজে আপনার সাথে যোগাযোগ করবেন।

গ্রাহক: আসসালামু আলাইকুম
বট   : রূপসী ফ্যাশনে স্বাগতম! দাম, অর্ডার বা সমস্যা, কী জানতে চান?
```

পাঁচজন গ্রাহক, পাঁচ রকম রাস্তা। অভিনন্দন, তোমার প্রথম LangGraph বট চলছে!

## রাস্তার ম্যাপ

| গ্রাহক চান | গেটম্যানের লেখা | এরপর কে |
| --- | --- | --- |
| দাম | `price` | `give_price` |
| কিনতে / অর্ডার | `order` | `check_stock` → `confirm_order` |
| অভিযোগ / ফেরত | `complaint` | `handle_complaint` |
| কিছু না মিললে | `other` | `fallback` |

> **মূল পয়েন্ট:** `add_conditional_edges`-এ তিনটা জিনিস দিতে হয় — কোন node-এর পরে ভাগ হবে, কোন ফাংশন রাস্তা বাছবে, আর কোন শব্দে কোন node-এ যাবে। রাউটার কোনো কাজ করে না, কাজ করে node।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `Expected node ... received ...` | রাউটার যে শব্দ ফেরত দিচ্ছে সেটার নাম ম্যাপিংয়ে লেখা নেই |
| reply সবসময় fallback | বার্তায় চাবি-শব্দ মিলছে না — শর্তগুলো চেক করো |
| `KeyError` কোনো পণ্যে | ওই পণ্যের নাম `CATALOG`-এ আছে কি না দেখো |

পরের ধাপে [গ্রাফের ছবি](/langgraph/graph-picture) — এই পুরো নকশাটা ছবিতে দেখো।
