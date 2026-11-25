---
title: LangGraph Tutorial
description: রূপসী ফ্যাশনের কাজের ধাপগুলো গ্রাফে সাজিয়ে শেখা — StateGraph, Tool, Memory, অনুমোদন আর Streaming, LangGraph ১.x-এর চলতি API দিয়ে।
icon: GitBranch
---

CrewAI-তে আমরা একটা **টিম** বানিয়েছিলাম — কে কোন কাজ করবে, তা Agent আর Task দিয়ে বলে দিলেই বাকিটা ফ্রেমওয়ার্ক সামলাত। LangGraph-এ দৃষ্টিভঙ্গিটা আলাদা: এখানে তুমি **কাজের ধাপগুলো নিজে সাজাও** — কোন ধাপের পর কোনটা, কোথায় সাধারণ Python কোড আর কোথায় LLM — সব একটা গ্রাফ আকারে। প্রতিটা ধাপের হাতে দেয়া হয় একই **shared state**, আর শেষে সেই state-ই তোমার ফলাফল।

রূপসী ফ্যাশনের গল্পটা এখানেও চলবে — করিম ভাই, রফিক (বাজার গবেষক), সুমন (ডিজাইনার) আর নাদিয়ার (মার্কেটিং লেখক) কাজগুলো LangGraph-এর node আর edge হয়ে ফিরে আসবে। পার্থক্য একটাই: এবার করিম ভাই নিজেই ঠিক করবেন কোন কাজের পরে কোনটা চলবে, কোথায় তাঁর সিদ্ধান্ত (if/else) বসবে, আর কোথায় মানুষ এসে অনুমোদন দেবে।

> **সংস্করণ:** সব পেজ **LangGraph ১.x + LangChain ১.x**-এর বর্তমান API অনুযায়ী — `StateGraph`, `START`/`END`, `MessagesState`, `ToolNode`, `InMemorySaver`, `interrupt`, `create_agent`। পুরোনো টিউটোরিয়ালের `create_react_agent`-জাতীয় উদাহরণ এখন পুরোনো পথ।

## শুরুর আগে

- [Python Basic](/python-basic) — ফাংশন, ক্লাস আর type hint জানা থাকলে `TypedDict` বোঝা সহজ হবে
- [CrewAI](/docs) সেকশনটা পড়া থাকলে Agent, Tool আর LLM-এর ধারণা আগেই তৈরি
- একটা LLM প্রোভাইডারের API key (উদাহরণে OpenAI: `OPENAI_API_KEY`)

## অধ্যায়গুলো

প্রতিটা পেজে আগের সেকশনগুলোর মতোই — রূপসী ফ্যাশনের গল্প, তারপর LangGraph-এ ঠিক একই জিনিস, কোড, আর হুবহু আউটপুট।

| পর্ব | পেজ | কী শিখবে |
| --- | --- | --- |
| ১ | [ইনস্টলেশন](/langgraph/installation) | venv, `pip install -U langgraph langchain langchain-openai` |
| ২ | [প্রথম Graph](/langgraph/first-graph) | `StateGraph`, node, edge, `compile()`, `invoke()` |
| ৩ | [State ও Reducer](/langgraph/state-reducer) | `TypedDict`, `Annotated`, `operator.add` |
| ৪ | [Nodes](/langgraph/nodes) | state পড়ে আংশিক update লেখা |
| ৫ | [Edges](/langgraph/edges) | ধাপের ক্রম, fan-out |
| ৬ | [Conditional Edges](/langgraph/conditional-edges) | করিম ভাইয়ের সিদ্ধান্তে পথ বদল |
| ৭ | [LLM Node](/langgraph/llm-node) | `MessagesState`, `init_chat_model` |
| ৮ | [Tools](/langgraph/tools) | `@tool`, `bind_tools`, `ToolNode` |
| ৯ | [Parallel](/langgraph/parallel) | `Send` দিয়ে একসাথে অনেক কাজ |
| ১০ | [Persistence](/langgraph/persistence) | `InMemorySaver`, `thread_id` |
| ১১ | [Human-in-the-Loop](/langgraph/human-in-the-loop) | `interrupt`, `Command(resume=...)` |
| ১২ | [Streaming](/langgraph/streaming) | `updates`, `messages` স্ট্রিম |
| ১৩ | [Agent](/langgraph/agents) | `create_agent` দিয়ে রেডিমেড loop |
| ১৪ | [MCP](/langgraph/mcp) | `MCPAdapter` দিয়ে বাইরের টুল |
| ১৫ | [Full Project](/langgraph/full-project) | পুরো পাইপলাইন এক ফাইলে |

## ধারণাগত ম্যাপ

| রূপসী ফ্যাশন | LangGraph |
| --- | --- |
| কাজের খাতা | State |
| একজন কর্মীর এক ধাপ | Node |
| "এরপর কে" | Edge |
| করিম ভাইয়ের if/else সিদ্ধান্ত | Conditional Edge |
| কাজের অগ্রগতি সংরক্ষণ | Checkpointer |
| করিম ভাইয়ের অনুমোদন | `interrupt` |

শুরু করতে [ইনস্টলেশন](/langgraph/installation) পেজে যাও।
