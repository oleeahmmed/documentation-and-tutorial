---
title: "ধাপ ৯: LLM গেটম্যান"
description: শব্দ খোঁজার বদলে সত্যিকারের AI — OpenRouter বসিয়ে structured output দিয়ে intent চেনা। শুধু একটা node বদলায়, বাকি দোকান অপরিবর্তিত।
icon: Sparkles
---

## গল্প

এতক্ষণ গেটম্যান শুধু কিছু নির্দিষ্ট শব্দ খুঁজছিল। গ্রাহক লিখলেন "আমি একটা লাল পাঞ্জাবি নিতে চাই" — "নিতে" শব্দটা তালিকায় নেই, তাই বট বুঝল না, fallback-এ চলে গেল।

এখন গেটম্যানের জায়গায় বসাব একজন সত্যিকারের AI। সে যেভাবেই লেখা হোক, উদ্দেশ্য বুঝে নেবে — আর উত্তর দেবে নির্দিষ্ট ছাঁচে।

> এই ধাপটুকুতে API key লাগে। আগের আটটা ধাপ key ছাড়াই চলত।

## ধাপ ১ — প্যাকেজ আর key

```bash
pip install langchain-openrouter python-dotenv
```

[openrouter.ai/settings/keys](https://openrouter.ai/settings/keys) থেকে key নিয়ে প্রজেক্টের গোড়ায় `.env` বানাও:

```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=openrouter/openai/gpt-4.1-mini
```

> মডেলের নাম [openrouter.ai/models](https://openrouter.ai/models)-এ দেখানো নামের মতো। OpenRouter এক key-তেই GPT, Claude, Gemini — যেকোনোটা চলবে।

## ধাপ ২ — `llm.py`

```python
# llm.py
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

load_dotenv()

model_id = os.getenv("OPENROUTER_MODEL", "openrouter/openai/gpt-4.1-mini")
if "/" in model_id:
    # openrouter/anthropic/...  →  openrouter:anthropic/...  (LangChain-এর নিয়ম)
    provider, name = model_id.split("/", 1)
    model_id = f"{provider}:{name}"

model = init_chat_model(model_id)
```

মডেল এক জায়গায় থাকায় পরে প্রোভাইডার বদলাতে শুধু `.env` বদলাবে — কোড নয়।

## ধাপ ৩ — গেটম্যান বদলাও

`ruposhi.py`-তে পুরোনো `classify_intent` ফাংশনটা মুছে এটা বসাও (বাকি সব যেমন আছে তেমনই থাকবে):

```python
from typing import Literal, Optional
from pydantic import BaseModel

from llm import model


# ---- LLM-কে বলে দিচ্ছি উত্তর ঠিক কোন ছাঁচে দিতে হবে ----
class Intent(BaseModel):
    # Literal মানে এই চারটার বাইরে অন্য কিছু দিতে পারবে না
    intent: Literal["price", "order", "complaint", "other"]
    product: Optional[str] = None      # পাঞ্জাবি / শাড়ি / শার্ট, না বুঝলে None


# ---- LLM তৈরি। with_structured_output মানে উত্তর ওপরের ছাঁচেই আসবে ----
llm = model.with_structured_output(Intent)


# ---- আগের classify_intent-এর জায়গায় নতুন গেটম্যান ----
def classify_intent(state: ShopState) -> dict:
    # LLM-কে প্রশ্ন পাঠালাম
    r = llm.invoke(
        f"রূপসী ফ্যাশনে গ্রাহক লিখলেন: {state['message']}\n"
        "পণ্যের তালিকা: পাঞ্জাবি, শাড়ি, শার্ট। উদ্দেশ্য আর পণ্য বলো।"
    )
    # ফেরত আসা উত্তর স্লিপে লিখলাম। আগের মতোই intent আর product
    return {"intent": r.intent, "product": r.product}
```

## বাস্তবে কী ঘটে

```python
print(graph.invoke({"message": "লাল পাঞ্জাবিটা নিয়ে যাব"})["reply"])
```

```text
আপনার পাঞ্জাবি অর্ডার নিশ্চিত! দাম 1800 টাকা।
```

আগের শব্দ-খোঁজা গেটম্যান "নিয়ে যাব" বুঝত না — এখন AI বুঝল, `intent="order"`, `product="পাঞ্জাবি"`। রাস্তা বাছা, স্টক দেখা, ক্যাশিয়ার — সব আগের মতোই চলল।

## কী বদলাল, কী বদলাল না

| জিনিস | বদলেছে? |
| --- | --- |
| `classify_intent`-এর ভেতর | হ্যাঁ — শব্দ খোঁজার বদলে LLM |
| State, রাউটার, ম্যাপিং | না |
| বাকি সব node আর edge | না |

একটা node-এর ভেতরটা বদলে দিলে বাকি দোকান আগের মতোই চলে। এটাই LangGraph-এর সৌন্দর্য।

## যেকোনো প্রোভাইডারে

শুধু `.env` আর প্যাকেজ বদলাও; `llm.py` আর বাকি কোড একই:

| প্রোভাইডার | `OPENROUTER_MODEL`-এ লেখো | প্যাকেজ | key |
| --- | --- | --- | --- |
| OpenRouter | `openrouter/openai/gpt-4.1-mini` | `langchain-openrouter` | `OPENROUTER_API_KEY` |
| OpenAI | `openai:gpt-4.1-mini` | `langchain-openai` | `OPENAI_API_KEY` |
| Anthropic | `anthropic:claude-sonnet-4-5` | `langchain-anthropic` | `ANTHROPIC_API_KEY` |
| Google | `google_genai:gemini-2.5-flash` | `langchain-google-genai` | `GOOGLE_API_KEY` |

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `401 Unauthorized` | key ভুল বা `.env` লোড হচ্ছে না — `llm.py`-তে `load_dotenv()` আছে তো? |
| `402 ... requires more credits` | OpenRouter ব্যালেন্স শেষ — টাকা যোগ করো বা সস্তা মডেল নাও |
| `404 ... model not found` | `OPENROUTER_MODEL`-এর নাম হুবহু OpenRouter-এর তালিকা থেকে নাও |
| `ModuleNotFoundError: langchain_openrouter` | `pip install -U langchain-openrouter` |
| answer এলোমেলো আসছে | `with_structured_output(Intent)` দিয়ে উত্তর ছাঁচে বাঁধা আছে তো? |

পরের ধাপে [সারসংক্ষেপ ও অভ্যাস](/langgraph/summary) — পুরো গল্পটা এক নজরে।
