---
title: Full Project
description: ধাপ ১৫ — গবেষণা, করিম ভাইয়ের অনুমোদন, লেখা, পাবলিশ — ১৫ ধাপের সবকিছু এক ফাইলে।
icon: Rocket
---

## গল্প

ঈদ আসছে। রূপসী ফ্যাশনের এবারের কাজ:

1. রফিক বাজার আর স্টক দেখে রিপোর্ট দেবেন
2. করিম ভাই রিপোর্ট দেখে অনুমোদন দেবেন
3. নাদিয়া পোস্ট লিখবেন
4. করিম ভাই লেখাটা দেখে "পাবলিশ" বললে তবেই পোস্ট যাবে

আগের ১৪ ধাপে এগুলোর প্রতিটা টুকরো শিখেছি। এবার জোড়া লাগানোর পালা।

## পাইপলাইন

```text
START → research ─┬─(টুল চাইলে)→ tools ─┐
                  │                     │
                  └←────────────────────┘
                  │
                  └─(রিপোর্ট তৈরি)→ draft → approval ⏸ → publish → END
                                                    (করিম ভাইয়ের ইনপুট)
```

তিনটা শিক্ষা এখানে একসাথে: **tool loop**, **interrupt**, **checkpointer**।

## কোড (`full_project.py`)

```python
from typing import Literal
from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage, SystemMessage
from langchain.tools import tool
from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import interrupt, Command

model = init_chat_model("openai:gpt-4.1-mini")


@tool
def stock_lookup(fabric: str) -> str:
    """গুদামে কোনো কাপড়ের স্টক কত মিটার আছে তা দেখে।"""
    stock = {"মাটি-রঙা উল": 42, "নীল তুলা": 8, "সাদা লিনেন": 120}
    return f"{fabric}: {stock.get(fabric, 0)} মিটার"


class CampaignState(MessagesState):
    approved: str
    final_post: str


research_model = model.bind_tools([stock_lookup])


def research(state: CampaignState):
    system = SystemMessage(
        "তুমি রফিক, রূপসী ফ্যাশনের বাজার গবেষক। স্টক জানতে stock_lookup ব্যবহার করো। "
        "তিন লাইনের রিপোর্ট দাও।"
    )
    return {"messages": [research_model.invoke([system, *state["messages"]])]}


def should_continue(state: CampaignState) -> Literal["tools", "draft"]:
    last = state["messages"][-1]
    return "tools" if last.tool_calls else "draft"


def draft(state: CampaignState):
    system = SystemMessage(
        "তুমি নাদিয়া, মার্কেটিং লেখক। গবেষণার রিপোর্ট দেখে একটা ছোট ফেসবুক পোস্ট লেখো।"
    )
    return {"messages": [model.invoke([system, *state["messages"]])]}


def approval(state: CampaignState):
    decision = interrupt({"draft": state["messages"][-1].content})
    return {"approved": decision}


def publish(state: CampaignState):
    if state["approved"] != "পাবলিশ":
        return {"final_post": "ক্যাম্পেইন বাতিল — করিম ভাই অনুমোদন দেননি।"}
    return {"final_post": f"ফেসবুকে গেল: {state['messages'][-1].content}"}


builder = StateGraph(CampaignState)
builder.add_node("research", research)
builder.add_node("tools", ToolNode([stock_lookup]))
builder.add_node("draft", draft)
builder.add_node("approval", approval)
builder.add_node("publish", publish)

builder.add_edge(START, "research")
builder.add_conditional_edges("research", should_continue, {"tools": "tools", "draft": "draft"})
builder.add_edge("tools", "research")
builder.add_edge("draft", "approval")
builder.add_edge("approval", "publish")
builder.add_edge("publish", END)

graph = builder.compile(checkpointer=InMemorySaver())
config = {"configurable": {"thread_id": "eid-2027"}}

for chunk in graph.stream(
    {"messages": [HumanMessage("ঈদ ২০২৭-এর জন্য মাটি-রঙা উলের ওভারকোটের ক্যাম্পেইন শুরু করো।")]},
    config,
    stream_mode="updates",
):
    for node_name, update in chunk.items():
        print(f"[{node_name}] শেষ")

state = graph.get_state(config)
print("অনুমোদনের অপেক্ষায়:", state.next)

graph.invoke(Command(resume="পাবলিশ"), config)
print(graph.get_state(config).values["final_post"])
```

## বাস্তবে কী ঘটে

```text
[research] শেষ
[tools] শেষ
[research] শেষ
[draft] শেষ
[approval] শেষ
অনুমোদনের অপেক্ষায়: ('publish',)
ফেসবুকে গেল: ঈদের নতুন রং — মাটি। রূপসী ফ্যাশনের মাটি-রঙা উলের ওভারকোট এখন পাচ্ছেন — স্টক সীমিত।
```

ভেতরে ঘটল:

1. `research` টুল চাইল → `tools` চালাল → `research` আবার চলল, এবার রিপোর্ট লেখা হয়ে গেল
2. `draft` রিপোর্ট দেখে পোস্ট লিখল
3. `approval`-এ graph থামল — `state.next` বলছে পরের node `publish`
4. করিম ভাই "পাবলিশ" বললেন → `Command(resume=...)` → `publish` চলে শেষ

## এই ফাইলে কোন কোন শিক্ষা

| শিক্ষা | কোথায় |
| --- | --- |
| Tool loop | `research` + `tools` + `should_continue` |
| MessagesState | চ্যাটের ইতিহাস রেডিমেড |
| Interrupt | `approval` |
| Persistence | `InMemorySaver` + `thread_id` |
| Streaming | `stream(..., stream_mode="updates")` |
| Conditional edge | `should_continue` |

## প্রোডাকশনে যাওয়ার আগে

- `InMemorySaver`-এর বদলে `SqliteSaver` বা `PostgresSaver` নাও
- টুলের ভেতরে try/except দিয়ে বন্ধুত্বপূর্ণ error বার্তা দাও
- খরচ ট্র্যাক করতে LangSmith বা টোকেন কাউন্ট রাখো
- `OPENAI_API_KEY` কখনো কোডে নয় — `.env`, আর `.env` `gitignore`-এ

## শেষ কথা

LangGraph-এ বুদ্ধিটা সহজ: **কাজগুলো ছোট ছোট node-এ ভাগ করো, state-এ খাতা রাখো, edge দিয়ে ক্রম ঠিক করো**। লম্বা চেইন, শর্ত, সমান্তরাল কাজ, মানুষের অনুমোদন — সব এই কয়েকটা জিনিসেরই জোড়া।

রূপসী ফ্যাশনের করিম ভাইয়ের মতো: আগে ছোট ছোট ধাপ ঠিক করো, তারপর গ্রাফ টানো। বড় প্রজেক্টও ছোট graph-এর সমষ্টি।

---

ডকুমেন্টেশন আবার প্রথম থেকে: [LangGraph Tutorial](/langgraph)
