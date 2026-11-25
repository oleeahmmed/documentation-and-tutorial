---
title: "ধাপ ৯: LLM গেটম্যান"
description: শব্দ খোঁজার বদলে সত্যিকারের AI — OpenRouter-এর key দিয়ে সবচেয়ে সহজ llm.py, তারপর একটাই node বদলানো। বাকি দোকান অপরিবর্তিত।
icon: Sparkles
---

## গল্প

এতক্ষণ গেটম্যান শুধু কিছু নির্দিষ্ট শব্দ খুঁজছিল। গ্রাহক লিখলেন "আমি একটা লাল পাঞ্জাবি নিয়ে যাব" — "নিয়ে যাব" শব্দটা তালিকায় নেই, তাই বট বুঝল না, fallback-এ চলে গেল।

এখন গেটম্যানের জায়গায় বসাব একজন সত্যিকারের AI। সে যেভাবেই লেখা হোক, উদ্দেশ্য বুঝে নেবে।

> এই ধাপটুকুতে API key লাগে। আগের আটটা ধাপ key ছাড়াই চলত।

## ধাপ ১ — প্যাকেজ আর key

```bash
pip install langgraph langchain-openai python-dotenv
```

[openrouter.ai/settings/keys](https://openrouter.ai/settings/keys) থেকে key নিয়ে প্রজেক্টের গোড়ায় `.env` বানাও:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=anthropic/claude-sonnet-4.6
```

এখানে তোমার আসল key বসাও। `.env` ফাইলটা `.gitignore`-এ রাখো — key কখনো কোডে লিখবে না।

## ধাপ ২ — সবচেয়ে সহজ `llm.py`

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

model = ChatOpenAI(
    model=os.getenv("OPENROUTER_MODEL"),
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)
```

এই ফাইলটা মাত্র তিনটা কাজ করে:

1. `.env` থেকে key আর model name পড়ে
2. `base_url` বলে দেয় কথা যাবে OpenRouter-এ
3. তৈরি করে দেয় `model` — এটাই তোমার LLM

`llm.py`-তে State, Node, Edge বা Graph বানানোর কাজ নেই। ওটা শুধু মডেল তৈরি করে, বাকিরা সেটা ব্যবহার করবে।

## ধাপ ৩ — একবার চালিয়ে দেখো

আরেকটা ছোট ফাইল বানাও (`test_llm.py`):

```python
from llm import model

response = model.invoke("Hello, how are you?")
print(response.content)
```

`python test_llm.py` চালাও। মডেলের উত্তর আসবে — মানে key আর `llm.py` ঠিক আছে। এখন দোকানে বসানোর পালা।

## ধাপ ৪ — গেটম্যান বদলাও

`ruposhi.py`-তে পুরোনো `classify_intent` ফাংশনটা মুছে এটা বসাও (বাকি সব যেমন আছে তেমনই থাকবে):

```python
from llm import model

PROMPT = """তুমি রূপসী ফ্যাশন দোকানের গেটম্যান।
গ্রাহকের কথা পড়ে বুঝে নাও সে কী চায়।
উত্তরে শুধু একটা শব্দ লিখো: price, order, complaint বা other।
গ্রাহক: """


def classify_intent(state: ShopState) -> dict:
    # LLM-কে গ্রাহকের কথাটা পাঠিয়ে উত্তর নিলাম
    answer = model.invoke(PROMPT + state["message"]).content.lower()

    # উত্তরে price/order/complaint-এর কোনটা আছে সেটা খুঁজি; কিছু না থাকলে other
    intent = next((i for i in ("price", "order", "complaint") if i in answer), "other")

    # পণ্যের নাম আগের মতোই তালিকা থেকে খুঁজে নিই
    product = next((p for p in CATALOG if p in state["message"]), None)

    return {"intent": intent, "product": product}
```

খেয়াল করো — State, রাউটার, ম্যাপিং, বাকি node — কিছুই বদলায়নি। শুধু এক node-এর ভেতরটা বদলেছে।

## বাস্তবে কী ঘটে

`ruposhi.py`-এর টেস্ট তালিকায় নতুন গ্রাহক যোগ করো:

```python
"লাল পাঞ্জাবিটা নিয়ে যাব",
```

চালাও:

```bash
python ruposhi.py
```

```text
গ্রাহক: লাল পাঞ্জাবিটা নিয়ে যাব
বট   : আপনার পাঞ্জাবি অর্ডার নিশ্চিত! দাম 1800 টাকা।
```

আগের শব্দ-খোঁজা গেটম্যান "নিয়ে যাব" বুঝত না — এখন AI বুঝল, `intent="order"`, `product="পাঞ্জাবি"`। রাস্তা বাছা, স্টক দেখা, ক্যাশিয়ার — সব আগের মতোই চলল।

## কী বদলাল, কী বদলাল না

| জিনিস | বদলেছে? |
| --- | --- |
| `classify_intent`-এর ভেতর | হ্যাঁ — শব্দ খোঁজার বদলে LLM |
| State, রাউটার, ম্যাপিং | না |
| বাকি সব node আর edge | না |

## মডেল বদলাতে চাইলে

OpenRouter-এ এক key-তেই সব মডেল। শুধু `.env`-এর `OPENROUTER_MODEL` বদলাও, কোড নয়:

| মডেল | `OPENROUTER_MODEL`-এ লেখো |
| --- | --- |
| Claude | `anthropic/claude-sonnet-4.6` |
| GPT | `openai/gpt-4.1-mini` |
| Gemini | `google/gemini-2.5-flash` |

নিজের OpenAI key দিয়ে চালাতে চাইলে `base_url` লাইনটা মুছে `api_key=os.getenv("OPENAI_API_KEY")` করো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `401 Unauthorized` | key ভুল বা `.env` লোড হচ্ছে না — `llm.py`-তে `load_dotenv()` আছে তো? |
| `402 ... requires more credits` | OpenRouter ব্যালেন্স কম — `ChatOpenAI(...)`-এ `max_tokens=500` যোগ করো বা সস্তা মডেল নাও |
| `404 ... model not found` | `OPENROUTER_MODEL`-এর নাম হুবহু OpenRouter-এর তালিকা থেকে নাও |
| `ModuleNotFoundError: langchain_openai` | `pip install langchain-openai` |
| সব উত্তর fallback-এ যাচ্ছে | PROMPT-এ `price`, `order`, `complaint` শব্দগুলো আরও জোর দিয়ে লিখো |

পরের ধাপে [সারসংক্ষেপ ও অভ্যাস](/langgraph/summary) — পুরো গল্পটা এক নজরে।
