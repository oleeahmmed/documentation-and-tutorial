---
title: ইনস্টলেশন
description: LangGraph ১.x ইনস্টল করার ধাপ — venv, প্রয়োজনীয় প্যাকেজ, .env আর একটা ছোট টেস্ট।
icon: Download
---

## কী লাগবে

| জিনিস | কী |
| --- | --- |
| Python | **৩.১০ বা তার উপরে** (৩.১২ হলে ভালো) |
| প্যাকেজ | `langgraph`, `langchain`, `langchain-openai`, `python-dotenv` |
| API key | OpenAI (বা Anthropic/Gemini — মডেল বদলালে প্যাকেজও বদলাবে) |

## ধাপ ১ — ফোল্ডার আর venv

```bash
mkdir rupashi_langgraph
cd rupashi_langgraph
python -m venv .venv
```

চালু করো:

```bash
# Git Bash / macOS / Linux
source .venv/Scripts/activate

# PowerShell
.venv\Scripts\Activate.ps1
```

> macOS/Linux-এ venv-এর পথ `.venv/bin/activate`। প্রম্পটের শুরুতে `(.venv)` দেখলেই বোঝবে চালু হয়েছে।

## ধাপ ২ — প্যাকেজ ইনস্টল

```bash
pip install -U langgraph langchain langchain-openai python-dotenv
```

| প্যাকেজ | কাজ |
| --- | --- |
| `langgraph` | graph, checkpointer, interrupt — মূল ফ্রেমওয়ার্ক |
| `langchain` | `init_chat_model`, `@tool`, মেসেজ ক্লাস |
| `langchain-openai` | OpenAI মডেলের সংযোগ |
| `python-dotenv` | `.env` থেকে API key পড়া |

> Anthropic ব্যবহার করতে চাইলে `langchain-openai`-এর বদলে `langchain-anthropic` দাও — বাকি কোডে শুধু মডেলের নাম বদলাবে।

## ধাপ ৩ — `.env`

প্রজেক্টের গোড়ায় `.env` ফাইল বানাও:

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
```

`.gitignore`-এ `.env` আর `.venv/` লিখে রাখো — key কোথাও পুশ হবে না।

> OpenRouter ব্যবহার করলে `OPENAI_API_KEY`-তে OpenRouter-এর key দাও, আর মডেল বাছার সময় `init_chat_model("openai:মডেল", base_url="https://openrouter.ai/api/v1")` দাও।

## ধাপ ৪ — টেস্ট

```python
# test_import.py
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import interrupt, Command
from langchain.agents import create_agent

print("LangGraph ঠিকঠাক ইনস্টল হয়েছে")
```

```bash
python test_import.py
```

```text
LangGraph ঠিকঠাক ইনস্টল হয়েছে
```

কিছু না ছাপিয়ে error এলে — প্যাকেজগুলোর ভার্সন মিলছে না। `pip install -U langgraph langchain langchain-openai` আবার চালাও।

## শেষ চেকলিস্ট

- [ ] Python ৩.১০+
- [ ] venv চালু, `(.venv)` দেখা যাচ্ছে
- [ ] চারটা প্যাকেজ ইনস্টল
- [ ] `.env`-এ `OPENAI_API_KEY`
- [ ] `test_import.py` ঠিকঠাক চলছে

পরের ধাপে [প্রথম Graph](/langgraph/first-graph) — একদম হাতেকলমে শুরু।
