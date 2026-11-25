---
title: "ধাপ ৭: গ্রাহককে মনে রাখো"
description: একই গ্রাহক ফিরে এলে আগের কথা মনে রাখা — checkpointer, thread_id আর add_messages।
icon: Archive
---

## গল্প

রহিম সাহেব আগে লিখলেন "পাঞ্জাবি আছে?", পরে লিখলেন "এর দাম কত?" বটকে মনে রাখতে হবে "এর" মানে কী। খাতা না থাকলে প্রতিবার সব কথা আবার বলতে হতো।

LangGraph-এ এই খাতার নাম **checkpointer**, আর প্রতিটা গ্রাহকের খাতার নাম **thread_id**।

## কোড (`memory.py`)

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END

# add_messages: মেসেজ জমা করার নিয়ম (রিডিউসার)
# সাধারণ ঘরে নতুন মান এলে পুরনোটা মুছে যায়।
# কিন্তু add_messages দিলে নতুন মেসেজ পুরনোগুলোর শেষে জুড়ে যায়।
from langgraph.graph.message import add_messages

# InMemorySaver: খাতা। স্লিপের অবস্থা এখানে সংরক্ষণ হয়
# (পুরোনো টিউটোরিয়ালে এর নাম ছিল MemorySaver — এখন InMemorySaver)
from langgraph.checkpoint.memory import InMemorySaver


# ---- স্লিপ ----
# Annotated[list, add_messages] মানে: এই ঘরটা একটা তালিকা,
# আর নতুন কিছু এলে add_messages-এর নিয়মে জমা হবে
class ChatState(TypedDict):
    messages: Annotated[list, add_messages]


# ---- বট ----
def bot(state: ChatState) -> dict:
    n = len(state["messages"])    # এখন পর্যন্ত স্লিপে কয়টা মেসেজ জমেছে গুনলাম
    # নতুন মেসেজ পাঠালাম। ("assistant", "লেখা") হলো বটের মেসেজের ধরন
    return {"messages": [("assistant", f"এখন পর্যন্ত {n}টা মেসেজ আছে")]}


# ---- গ্রাফ ----
b = StateGraph(ChatState)
b.add_node("bot", bot)
b.add_edge(START, "bot")
b.add_edge("bot", END)

# 👇 compile করার সময় খাতা (checkpointer) জুড়ে দিলাম। এটাই মেমোরি চালু করে
graph = b.compile(checkpointer=InMemorySaver())

# থ্রেড = গ্রাহকের নাম। একই নাম মানে একই খাতা
rahim = {"configurable": {"thread_id": "rahim"}}

# প্রথমবার: শুধু "হাই" পাঠালাম
graph.invoke({"messages": [("user", "হাই")]}, rahim)

# দ্বিতীয়বার: শুধু নতুন মেসেজ পাঠালাম, আগেরটা আর পাঠাইনি
# তবুও বট আগেরটা মনে রাখবে, কারণ thread_id একই
result = graph.invoke({"messages": [("user", "পাঞ্জাবি আছে?")]}, rahim)

# সব মেসেজ ছাপাই
for m in result["messages"]:
    print(m.content)
```

## বাস্তবে কী ঘটে

```text
হাই
এখন পর্যন্ত 1টা মেসেজ আছে
পাঞ্জাবি আছে?
এখন পর্যন্ত 3টা মেসেজ আছে
```

দ্বিতীয়বার বট **৩টা** মেসেজ গুনেছে (হাই, বটের উত্তর, পাঞ্জাবি আছে?) — মানে সে আগেরটা মনে রেখেছে। করিম সাহেবের জন্য `thread_id="karim"` দিলে একদম আলাদা খাতা হবে, আগের কথাগুলো ওখানে যাবে না।

## কীভাবে কাজ করছে

```text
invoke ১ → খাতা "rahim": [হাই, বটের উত্তর]
invoke ২ → খাতা আগে লোড → [হাই, উত্তর, পাঞ্জাবি আছে?] → bot চলে → নতুন উত্তর যোগ
```

- `add_messages` reducer ছাড়া নতুন মেসেজ পুরোনোগুলোকে মুছে দিত
- `thread_id` একই থাকলেই graph আগের state লোড করে
- checkpointer না দিলে invoke প্রতি ধাপে ভুলে যায়

> **খেয়াল রাখো:** `InMemorySaver` শুধু RAM-এ রাখে, প্রোগ্রাম বন্ধ হলে সব মুছে যায়। আসল দোকানে ডেটাবেসভিত্তিক checkpointer (SQLite বা Postgres) লাগবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| প্রতি বার ১টা মেসেজ | `compile(checkpointer=...)` দাও, আর দুবার invoke-এ **একই** `thread_id` |
| `ValueError ... thread_id` | config-টা invoke-এর দ্বিতীয় argument হিসেবে দাও |
| পুরোনো কথা নেই | `InMemorySaver` প্রোগ্রাম বন্ধ হলেই মুছে যায় — আলাদা object নয় তো? |

পরের ধাপে [রফিক সাহেবের অনুমতি](/langgraph/approval) — বড় অর্ডারে graph থামবে, সইয়ের জন্য।
