---
title: Tools
description: ধাপ ৮ — AI নিজেই ভাবে "গুদামে স্টক কত?" — @tool, bind_tools আর ToolNode দিয়ে প্রথম agentic loop।
icon: Wrench
---

## গল্প

করিম ভাই নাদিয়াকে বললেন, "ক্যাপশনে লিখো: সীমিত স্টক।" নাদিয়া বললেন, "কত মিটার আছে জানি না তো।"

মানুষ হলে নাদিয়া ফোন করে গুদামে জিজ্ঞেস করতেন। AI-এর হাতে তো ফোন নেই — তাকে দিতে হয় একটা **টুল**: "গুদামে স্টক দেখার যন্ত্র।"

এরপর করিম ভাইয়ের নতুন নিয়ম: "AI নিজেই বুঝবে কখন যন্ত্র লাগবে।" সেটাই tool calling।

## LangGraph-এ এই একই জিনিস

তিনটা জিনিস লাগে:

১. **`@tool`** দিয়ে সাজানো সাধারণ Python ফাংশন
২. **`model.bind_tools([...])`** — AI-কে টুলগুলোর তালিকা দেয়া
৩. **`ToolNode`** — AI যে টুল চাইবে, সেটা চালিয়ে ফলাফল ফেরত দেয়

তারপর একটা loop: **AI → tool → AI → ...** যতক্ষণ না AI আর টুল চায় না।

## কোড (`tools_project.py`)

```python
from typing import Literal
from langchain.messages import HumanMessage, SystemMessage
from langchain.tools import tool
from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import ToolNode

from llm import model


@tool
def stock_lookup(fabric: str) -> str:
    """গুদামে কোনো কাপড়ের স্টক কত মিটার আছে তা দেখে।"""
    stock = {"মাটি-রঙা উল": 42, "নীল তুলা": 8, "সাদা লিনেন": 120}
    return f"{fabric}: {stock.get(fabric, 0)} মিটার"


tools = [stock_lookup]
model_with_tools = model.bind_tools(tools)

SYSTEM = SystemMessage(
    "তুমি রূপসী ফ্যাশনের সহকারী। স্টক জানতে চাইলে stock_lookup টুল ব্যবহার করো। "
    "উত্তর সংক্ষেপে বাংলায় দাও।"
)


def llm_call(state: MessagesState):
    response = model_with_tools.invoke([SYSTEM, *state["messages"]])
    return {"messages": [response]}


def should_continue(state: MessagesState) -> Literal["tools", "end"]:
    last = state["messages"][-1]
    return "tools" if last.tool_calls else "end"


builder = StateGraph(MessagesState)
builder.add_node("llm_call", llm_call)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "llm_call")
builder.add_conditional_edges("llm_call", should_continue, {"tools": "tools", "end": END})
builder.add_edge("tools", "llm_call")   # 👈 টুলের ফল নিয়ে আবার AI-এর কাছে

graph = builder.compile()

result = graph.invoke(
    {"messages": [HumanMessage("মাটি-রঙা উলের স্টক কত? বেশি দেব, সীমিত স্টক কথাটা লিখব।")]}
)
print(result["messages"][-1].content)
```

## বাস্তবে কী ঘটে

```text
মাটি-রঙা উলের স্টক ৪২ মিটার — "সীমিত স্টক" লেখা ঠিক হবে।
```

পর্দার আড়ালে যা ঘটল:

```text
START → llm_call (AI: "stock_lookup ডাকো, fabric='মাটি-রঙা উল'")
      → tools  (৪২ মিটার)
      → llm_call (AI: উত্তর লিখল, আর টুল চাইছে না)
      → end
```

`graph.get_graph()` দিলে এই loop-টাই মermaid ছবিতে দেখবে।

## নতুন কী শিখলে

- `@tool` লাগালেই সাধারণ ফাংশন AI-versible টুল হয়ে যায়
- `should_continue`-ই সিদ্ধান্ত নেয় "আরও টুল লাগবে, না শেষ"
- `ToolNode(tools)` ফাংশনটা নিজেই চালায় — নাম, আর্গুমেন্ট সব মেশিনে মিলিয়ে

> docstring-টা AI পড়ে বুঝে টুল কখন ডাকবে। "কোনো কাপড়ের স্টক দেখে" লেখা থাকলে AI `নীল তুলা`-র কথা জিজ্ঞেস করলেও ঠিক টুলটাই ডাকবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| AI টুলই ডাকছে না | docstring স্পষ্ট করো, system message-এ টুল ব্যবহারের কথা লেখো |
| `ToolNode` চালাতে error | টুলের type hint আর docstring দুটোই আছে কি না দেখো |
| loop থামছে না | `should_continue`-এ `last.tool_calls` খালি কি না যাচাই করো |
| টুলে exception | টুলের ভেতরে try/except দিয়ে বন্ধুত্বপূর্ণ বার্তা ফেরত দাও |

পরের ধাপে [Parallel](/langgraph/parallel) — একসাথে অনেক কর্মী।
