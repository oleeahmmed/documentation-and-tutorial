---
title: Async — কেন FastAPI এত দ্রুত
description: async def আর await দিয়ে একসাথে অনেক রিকোয়েস্ট সামলানো — আর কখন সাধারণ def-ই ভালো।
icon: Zap
---

## গল্প

দোকানে একজন কাস্টমার এসে জিজ্ঞেস করল একটা পণ্য, সেলসম্যান গুদামে গেল খুঁজতে — এই ফাঁকে অন্য কাস্টমার এলে তাকেও তো সামলানো যায়। Django সাধারণত সিনক্রোনাস: একটা কাজ শেষ না হলে পরেরটা শুরু হয় না। FastAPI **async** সাপোর্ট করে — একটা রিকোয়েস্ট ডেটাবেসের উত্তরের জন্য অপেক্ষা করার সময়, একই সার্ভার অন্য রিকোয়েস্ট প্রসেস করতে পারে।

## কোড

```python
import asyncio

@app.get("/slow-task")
async def slow_task():
    await asyncio.sleep(2)   # ধরো এটা একটা ধীর API কল বা ডেটাবেস কোয়েরি
    return {"message": "কাজ শেষ হয়েছে"}
```

`async def` ফাংশনের ভেতরে যেখানে অপেক্ষা করতে হয়, সেখানে `await` লিখতে হবে। এই "অপেক্ষার ফাঁকে" সার্ভার অন্য কাজ করে।

## বাস্তবে কী ঘটে

একই সময়ে দুটো টার্মিনাল থেকে `/slow-task` হিট করো:

```bash
curl http://127.0.0.1:8000/slow-task   # টার্মিনাল ১
curl http://127.0.0.1:8000/slow-task   # টার্মিনাল ২ (একই সাথে)
```

দুটোই প্রায় ২ সেকেন্ডেই উত্তর পাবে — ৪ সেকেন্ড নয়। কারণ দুটো রিকোয়েস্ট একসাথে "অপেক্ষা" করছে।

## নিয়ম

- `async def` ব্যবহার করলে ভেতরে async-compatible লাইব্রেরি লাগবে — `httpx` (HTTP কল), `asyncpg` (PostgreSQL), `aiofiles` (ফাইল)।
- সাধারণ `def` (sync) ফাংশনও ঠিকই কাজ করে — FastAPI সেটাকে আলাদা thread-এ চালায়। তাই ডেটাবেসের সাধারণ sync কল (SQLAlchemy, Django ORM) `def` ফাংশনেই রাখো।
- **সবচেয়ে বড় ভুল:** `async def` ফাংশনের ভেতরে সময়সাপেক্ষ **sync** কল করা (`requests.get(...)`, `time.sleep(...)`)। তখন পুরো সার্ভার আটকে যায় — async-এর সুবিধা শূন্য।

```python
# ❌ ভুল — async ফাংশনে sync requests
@app.get("/weather")
async def weather():
    r = requests.get("https://api.example.com/weather")   # সার্ভার ব্লক!
    return r.json()

# ✅ ঠিক — httpx দিয়ে async কল
import httpx

@app.get("/weather")
async def weather():
    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.example.com/weather")
    return r.json()
```

## টিপস

- নিশ্চিত না হলে সহজ নিয়ম: **sync ডেটাবেস/লাইব্রেরি = `def`**, async লাইব্রেরি = `async def`।
- CPU-ভারী কাজ (বড় PDF, ইমেজ প্রসেসিং) async দিয়ে লাভ নেই — সেগুলো আলাদা worker/queue-তে পাঠাও।
- `async def` আর `def` একই প্রজেক্টে মিশিয়ে ব্যবহার করা যায় — FastAPI দুটোই সামলায়।

এবার কোড ঠিক আছে কিনা প্রমাণ করার পালা — [Testing](/fastapi/testing)।
