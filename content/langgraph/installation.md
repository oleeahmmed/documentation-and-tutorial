---
title: ইনস্টলেশন
description: LangGraph ১.x ইনস্টল — venv, প্রয়োজনীয় প্যাকেজ, OpenRouter-এর key, আর এক জায়গায় মডেল বাছার ছোট llm.py।
icon: Download
---

## কী লাগবে

| জিনিস | কী |
| --- | --- |
| Python | **৩.১০ বা তার উপরে** (৩.১২ হলে ভালো) |
| প্যাকেজ | `langgraph`, `langchain`, `langchain-openrouter`, `python-dotenv` |
| API key | OpenRouter (এক key-তেই GPT, Claude, Gemini, Llama — যেকোনো মডেল) |

OpenRouter কেন? একটাই API key আর একটাই endpoint দিয়ে দুনিয়ার প্রায় সব মডেল চলে। মডেল বদলাতে শুধু নাম বদলাবে — কোড নয়। পরে চাইলে সরাসরি OpenAI/Anthropic-েও যাওয়া যাবে, সেটাও দেখানো আছে।

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
pip install -U langgraph langchain langchain-openrouter python-dotenv
```

| প্যাকেজ | কাজ |
| --- | --- |
| `langgraph` | graph, checkpointer, interrupt — মূল ফ্রেমওয়ার্ক |
| `langchain` | `init_chat_model`, `@tool`, মেসেজ ক্লাস |
| `langchain-openrouter` | OpenRouter-এর সংযোগ (যেকোনো মডেল এক জায়গা থেকে) |
| `python-dotenv` | `.env` থেকে API key পড়া |

## ধাপ ৩ — `.env`

[openrouter.ai/settings/keys](https://openrouter.ai/settings/keys) থেকে key নাও, তারপর প্রজেক্টের গোড়ায় `.env` ফাইল বানাও:

```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=openrouter/anthropic/claude-sonnet-4.6
```

> মডেলের নাম হুবহু [openrouter.ai/models](https://openrouter.ai/models)-এ দেখানো নামের মতো — যেমন `anthropic/claude-sonnet-4.6`, `openai/gpt-4.1-mini`। সামনে `openrouter/` অংশটা আমরা লিখছি প্রোভাইডার বোঝানোর জন্য।

`.gitignore`-এ `.env` আর `.venv/` লিখে রাখো — key কোথাও পুশ হবে না।

## ধাপ ৪ — `llm.py`: মডেল এক জায়গায়

প্রজেক্ট শুরুতে এই ছোট ফাইলটা বানাও। সামনের সব পেজে মডেল আসবে এখান থেকেই — `from llm import model`।

```python
# llm.py
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

load_dotenv()

model_id = os.getenv("OPENROUTER_MODEL", "openrouter/anthropic/claude-sonnet-4.6")
if "/" in model_id:
    provider, name = model_id.split("/", 1)
    model_id = f"{provider}:{name}"

model = init_chat_model(model_id)
```

| লাইন | কাজ |
| --- | --- |
| `load_dotenv()` | `.env`-এর key-gulo মেমোরিতে তোলে |
| `os.getenv(...)` | মডেলের নাম পড়ে; না থাকলে ডিফল্ট Claude |
| `split("/", 1)` + `f"{provider}:{name}"` | `openrouter/anthropic/...` → `openrouter:anthropic/...` (LangChain-এর নিয়ম) |
| `init_chat_model(...)` | নাম দেখে ঠিক প্রোভাইডারের ক্লায়েন্ট বানায় |

## ধাপ ৫ — টেস্ট

```python
# test_model.py
from llm import model

print(model.invoke("বাংলায় এক লাইনে বলো তুমি কে।").content)
```

```bash
python test_model.py
```

```text
আমি একটা ভাষা-মডেল, তোমার প্রশ্নের উত্তর দিতে তৈরি।
```

(উত্তরটা মডেল অনুযায়ী একেকরকম আসবে।)

## যেকোনো প্রোভাইডার — শুধু `.env` বদলাও

`llm.py` আর বাকি সব কোড একই থাকবে। শুধু `.env`-এর নাম আর প্যাকেজ বদলাবে:

| প্রোভাইডার | `OPENROUTER_MODEL`-এ লেখো | প্যাকেজ | key |
| --- | --- | --- | --- |
| OpenRouter | `openrouter/anthropic/claude-sonnet-4.6` | `langchain-openrouter` | `OPENROUTER_API_KEY` |
| OpenAI | `openai:gpt-4.1-mini` | `langchain-openai` | `OPENAI_API_KEY` |
| Anthropic | `anthropic:claude-sonnet-4-5` | `langchain-anthropic` | `ANTHROPIC_API_KEY` |
| Google | `google_genai:gemini-2.5-flash` | `langchain-google-genai` | `GOOGLE_API_KEY` |
| Ollama (লোকাল) | `ollama:llama3.2` | `langchain-ollama` | নেই |

লক্ষ্য করো — OpenRouter-এর লাইনটাই একমাত্র `provider/model` আকারে লেখা; `llm.py` সেটাকে `provider:model` বানিয়ে দেয়। বাকিগুলো সরাসরি `provider:model`, তাই `llm.py` হাত না দিয়েই চলে।

## শেষ চেকলিস্ট

- [ ] Python ৩.১০+
- [ ] venv চালু, `(.venv)` দেখা যাচ্ছে
- [ ] চারটা প্যাকেজ ইনস্টল
- [ ] `.env`-এ `OPENROUTER_API_KEY` আর `OPENROUTER_MODEL`
- [ ] `llm.py` তৈরি
- [ ] `test_model.py` উত্তর দিচ্ছে

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `401 Unauthorized` | key ভুল বা `.env` লোড হচ্ছে না — `dotenv` ইনস্টল আছে কি না দেখো |
| `402 ... requires more credits` | OpenRouter ব্যালেন্স শেষ — ওয়ালেটে টাকা যোগ করো বা সস্তা মডেল নাও |
| `404 ... model not found` | মডেলের নাম হুবহু OpenRouter-এর তালিকা থেকে নাও |
| `ModuleNotFoundError: langchain_openrouter` | `pip install -U langchain-openrouter` |
| `Invalid port ':1]'` / httpx error | `NO_PROXY`-তে `[::1]` আছে — সাধারণ CMD/PowerShell থেকে চালাও |

পরের ধাপে [প্রথম Graph](/langgraph/first-graph) — একদম হাতেকলমে শুরু।
