---
title: Streaming
description: ধাপ ১২ — সব শেষ হওয়ার আগেই পর্দায় ধাপে ধাপে দেখানো; updates আর messages স্ট্রিম।
icon: Radio
---

## গল্প

রফিক, সুমন আর নাদিয়া একসাথে কাজ করছেন। করিম ভাই এক ঘণ্টা পরে এসে জিজ্ঞেস করলেন, "কী হলো?" — কিন্তু তিনজন একসাথে বলতে গিয়ে গোলমাল।

তিনি বললেন, "থামো। কে কী করল, একের পর এক জানাও।"

এটা করলে করিম ভাই প্রতিটা ধাপ **শেষ হওয়ামাত্র** জানতে পারেন — সবশেষে একবারে নয়। LangGraph-এ এটাই streaming।

## LangGraph-এ এই একই জিনিস

`invoke` দেয় শেষ ফলাফল। `stream` দেয় **ধাপে ধাপে** ফলাফল:

```python
for chunk in graph.stream(inputs, stream_mode="updates"):
    for node_name, update in chunk.items():
        print(node_name, update)
```

প্রতিটা chunk-এর চেহারা: `{node_name: node_that_returned}` — ঠিক সেই আংশিক update, যা node ফেরত দিয়েছে।

## কোড ১ — updates (`stream_updates.py`)

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


class FashionState(TypedDict):
    topic: str
    report: str
    caption: str


def research(state: FashionState):
    return {"report": f"{state['topic']} — বাজারে চাহিদা বেশি।"}


def write_caption(state: FashionState):
    return {"caption": f"{state['topic']} — এখনই দেখুন।"}


builder = StateGraph(FashionState)
builder.add_node("research", research)
builder.add_node("write_caption", write_caption)
builder.add_edge(START, "research")
builder.add_edge("research", "write_caption")
builder.add_edge("write_caption", END)

graph = builder.compile()

for chunk in graph.stream({"topic": "মাটি-রঙা থিম"}, stream_mode="updates"):
    for node_name, update in chunk.items():
        print(f"[{node_name}] {update}")
```

## বাস্তবে কী ঘটে

```text
[research] {'report': 'মাটি-রঙা থিম — বাজারে চাহিদা বেশি।'}
[write_caption] {'caption': 'মাটি-রঙা থিম — এখনই দেখুন।'}
```

প্রতিটা node শেষ হওয়ামাত্র একটা chunk আসে। UI-তে এটাই "ধাপ ১ শেষ", "ধাপ ২ চলছে" দেখানোর সবচেয়ে সহজ পথ।

## কোড ২ — messages (আক্ষরিক টাইপিং)

LLM-এর উত্তর শব্দে শব্দে দেখাতে:

```python
from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage
from langgraph.graph import StateGraph, START, END, MessagesState

model = init_chat_model("openai:gpt-4.1-mini")


def chat(state: MessagesState):
    return {"messages": [model.invoke(state["messages"])]}


builder = StateGraph(MessagesState)
builder.add_node("chat", chat)
builder.add_edge(START, "chat")
builder.add_edge("chat", END)
graph = builder.compile()

for token, metadata in graph.stream(
    {"messages": [HumanMessage("তিনটা ছোট ঈদ ক্যাপশন লেখো।")]},
    stream_mode="messages",
):
    if token.content:
        print(token.content, end="", flush=True)
```

## বাস্তবে কী ঘটে

```text
১. ঈদের নতুন রং — মাটি।
২. মাটি-রঙা ওভারকোটে শীতটা আরামের।
৩. এই ঈদে রূপসী ফ্যাশন, এই ঈদে মাটির ছোঁয়া।
```

হাতে লেখার মতো শব্দ ধরে ধরে আসে — কারণ `chat` node-এর ভেতরে মডেল streaming করছে, LangGraph সেটা বাইরে পৌঁছে দিচ্ছে।

## স্ট্রিম মোডগুলো

| `stream_mode` | কী দেয় |
| --- | --- |
| `"updates"` | প্রতিটা node-এর আংশিক update |
| `"values"` | প্রতিটা ধাপের **পুরো** state |
| `"messages"` | LLM-এর টোকেন + কোন node থেকে |
| `"custom"` | node-এর ভেতর থেকে নিজের পাঠানো ডেটা |

একসাথে একাধিকও চাওয়া যায়: `stream_mode=["updates", "messages"]`।

## নতুন কী শিখলে

- `stream` = `invoke`-এর লাইভ সংস্করণ
- `updates` = "কে কী লিখল", `messages` = "AI কী টাইপ করছে"
- ওয়েব অ্যাপে সাধারণত দুটোই লাগে — progress + টাইপিং

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| শুধু শেষ ফল দেখছি | `stream` ব্যবহার করছ তো, `invoke` নয়? |
| messages খালি আসছে | node-এর ভেতরে model.invoke — streaming মোডে চলে কি না দেখো |
| chunk-এর কাঠামো বুঝছি না | `print(chunk)` করে একবার দেখে নাও |

পরের ধাপে [Agent](/langgraph/agents) — এই পুরো loop-টা রেডিমেড।
