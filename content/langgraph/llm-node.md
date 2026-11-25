---
title: LLM Node
description: ধাপ ৭ — খাতায় এবার সত্যিকারের AI লেখে; MessagesState আর llm.py-এর মডেল দিয়ে নাদিয়ার লেখার ধাপ।
icon: Sparkles
---

## গল্প

এতদিন খাতায় যা লেখা হয়েছে, সব হাতে লেখা — রফিক, সুমন, নাদিয়া, সবাই মানুষ।

কিন্তু নাদিয়া একা প্রতিদিন দশটা ক্যাপশন লেখেন না। করিম ভাই ঠিক করলেন, "ডিজাইন ব্রিফটা তো প্রস্তুত, এই ব্রিফ থেকে তিনটা ক্যাপশনের খসড়া AI লিখে দিক। নাদিয়া শুধু বেছে নেবেন।"

এখন খাতায় একটা নতুন ধরনের পাতা যোগ হলো — **কথোপকথন**: মানুষ যা বলল, AI যা উত্তর দিল, সব ক্রমানুসারে।

## LangGraph-এ এই একই জিনিস

কথোপকথনের জন্য রেডিমেড state আছে: **`MessagesState`**।

```python
class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
```

`add_messages` reducer দুটো কাজ করে — নতুন মেসেজ যোগ করে, আর একই `id`-র পুরোনো মেসেজ থাকলে সেটা আপডেট করে। তোমার নিজের key দরকার হলে `MessagesState`-কে subclass করো:

```python
class FashionState(MessagesState):
    topic: str
```

## কোড (`llm_project.py`)

```python
from langchain.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END, MessagesState

from llm import model


def marketing(state: MessagesState):
    system = SystemMessage(
        "তুমি রূপসী ফ্যাশনের মার্কেটিং লেখক নাদিয়া। "
        "ছোট, উষ্ণ, বাংলাদেশি পাঠকের জন্য বাংলা ক্যাপশন লেখো। ইমোজি দিও না।"
    )
    response = model.invoke([system, *state["messages"]])
    return {"messages": [response]}


builder = StateGraph(MessagesState)
builder.add_node("marketing", marketing)
builder.add_edge(START, "marketing")
builder.add_edge("marketing", END)

graph = builder.compile()

result = graph.invoke(
    {
        "messages": [
            HumanMessage(
                "ডিজাইন ব্রিফ: মাটি-রঙা উলের লম্বা ওভারকোট, শীতে পরার জন্য। "
                "তিনটা ক্যাপশন লেখো।"
            )
        ]
    }
)

print(result["messages"][-1].content)
```

## বাস্তবে কী ঘটে

```text
১. শীতে ঘরের উষ্ণতা গায়ে জড়াতে চাইলে — মাটি-রঙা উলের ওভারকোট এখন রূপসী ফ্যাশনে।
২. শহরের ব্যস্ত দিনে একটু আরাম, একটু উষ্ণতা — নতুন মাটি-রঙা কালেকশন এসেছে।
৩. শীতের সকালে গরম চায়ে চুমুক, আর কাঁধে মাটি-রঙা ওভারকোট — এই তো পূর্ণতা।
```

(মডেলের উত্তর একেকবার একেকরকম আসে — লেখাটা হুবহু নাও মিলতে পারে।)

`result["messages"][-1]` একটা `AIMessage` — তার ভেতরে `content`-এ লেখা, আর `usage_metadata`-তে টোকেনের হিসাব।

## কাঠামোটা খেয়াল করো

```text
START → marketing (LLM) → END
```

এই এক node-ই এখন "AI-এর ধাপ"। পরের page-এ এর হাতে **tool** ধরিয়ে দেব — তখন AI নিজেই ভাববে কখন কোন টুল দরকার।

## নতুন কী শিখলে

- `MessagesState` = মেসেজের জন্য প্রস্তুত state, reducer ছাড়া হাতে লেখার দরকার নেই
- `model` আসে `llm.py` থেকে — এখানে OpenRouter, কিন্তু `.env` বদলালে OpenAI/Claude/Gemini-ও একই কোডে চলবে
- system message দিয়ে চরিত্র ঠিক হয় — এখানে নাদিয়ার ব্যক্তিত্ব

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `AuthenticationError` / `401` | `.env`-এ `OPENROUTER_API_KEY` ঠিক আছে, আর `llm.py`-তে `load_dotenv()` চলছে কি না দেখো |
| `402 ... requires more credits` | OpenRouter-এ ব্যালেন্স নেই — টাকা যোগ করো বা সস্তা মডেল নাও |
| `NotFoundError` | `OPENROUTER_MODEL`-এর নাম ভুল; OpenRouter-এর মডেল-তালিকা থেকে হুবহু নাও |
| উত্তর ইংরেজিতে আসছে | system message-এ স্পষ্ট করে "বাংলায় লেখো" দাও |

> শেখার সময় সস্তা মডেল (যেমন `openai/gpt-4.1-mini`) ব্যবহার করো — `.env`-এ `OPENROUTER_MODEL=openrouter/openai/gpt-4.1-mini` লিখলেই হবে, কোডে হাত দিতে হবে না।

পরের ধাপে [Tools](/langgraph/tools) — AI নিজে হাতে কাজ করবে।
