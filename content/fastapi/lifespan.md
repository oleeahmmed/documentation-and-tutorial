---
title: Lifespan — Startup ও Shutdown
description: অ্যাপ চালু হওয়ার সময় সেটআপ, বন্ধ হওয়ার সময় পরিষ্কার — asynccontextmanager দিয়ে।
icon: Power
---

## গল্প

Django-তে সরাসরি এমন জায়গা নেই, কিন্তু FastAPI অ্যাপ চালু হওয়ার সময় ডেটাবেস কানেকশন বানানো, ক্যাশ লোড করা; আর বন্ধ হওয়ার সময় সেগুলো পরিষ্কার করা দরকার। এই দুটো মুহূর্ত ধরার নামই **lifespan**।

## কোড — বর্তমান সঠিক পদ্ধতি

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 অ্যাপ চালু হচ্ছে...")
    app.state.db_connection = "fake-connection"
    yield   # এখানে অ্যাপ চলতে থাকে
    print("🛑 অ্যাপ বন্ধ হচ্ছে, পরিষ্কার করা হচ্ছে...")

app = FastAPI(lifespan=lifespan)
```

`yield`-এর আগের অংশ চলে **শুরুতে একবার**, পরের অংশ চলে **বন্ধ হওয়ার সময় একবার** — প্রতিটা রিকোয়েস্টে নয়।

## চালু করে দেখো

```bash
fastapi dev main.py
```

টার্মিনালে:

```text
🚀 অ্যাপ চালু হচ্ছে...
INFO:     Uvicorn running on http://127.0.0.1:8000
```

`Ctrl + C` চাপলে:

```text
🛑 অ্যাপ বন্ধ হচ্ছে, পরিষ্কার করা হচ্ছে...
```

চাইলে endpoint থেকেও `app.state` পড়া যায়:

```python
@app.get("/health")
def health():
    return {"db": app.state.db_connection}
```

## পুরোনো পদ্ধতি (ব্যবহার করো না)

```python
@app.on_event("startup")
async def startup():
    ...

@app.on_event("shutdown")
async def shutdown():
    ...
```

এটা এখন deprecated — নতুন কোডে উপরের `lifespan` প্যাটার্নটাই লেখো।

## টিপস

- ডেটাবেস কানেকশন পুল, Redis ক্লায়েন্ট, মডেল লোডিং — সব `yield`-এর আগে করা উচিত, যাতে প্রতিটা রিকোয়েস্টে আবার না করতে হয়।
- `app.state`-এ রাখা জিনিস যেকোনো endpoint বা dependency থেকে পাওয়া যায়।
- ডেভেলপমেন্টে `fastapi dev` ফাইল বদলালে রিলোড হয় — তখন lifespan আবার চলবে, এটা স্বাভাবিক।

পরের ধাপে React/Next.js ফ্রন্টএন্ডের সাথে কথা বলার অনুমতি — [CORS](/fastapi/cors)।
