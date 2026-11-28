---
title: "ধাপ ১৩ — API Key বসাও (.env)"
description: LLM-এর চাবি — .env ফাইলে OPENAI_API_KEY, আর git-এ যেন না যায়।
icon: KeyRound
---

## লক্ষ্য

LLM-কে ডাকার জন্য API key ঠিক জায়গায় রাখা।

## ফাইল খোলো / বানাও

ফোল্ডারে `.env` নামের ফাইল বানাও (বা যেটা `crewai create` বানিয়ে দিয়েছে সেটা খোলো), ভেতরে লেখো:

```text
OPENAI_API_KEY=তোমার_আসল_কী_এখানে_বসাও
```

(OpenAI-এর কী না থাকলে https://platform.openai.com থেকে ফ্রিতে একাউন্ট খুলে বানিয়ে নিতে পারো, অথবা Groq/Gemini-এর মতো ফ্রি প্রোভাইডারও ব্যবহার করা যায়)

## কেন `.env`, কোডে নয়

| কোডে সোজা লেখা | `.env`-এ রাখা |
| --- | --- |
| git-এ push হলে key ফাঁস | `.gitignore`-এ থাকে, commit হয় না |
| বদলাতে কোড এডিট | শুধু ফাইল লাইন বদলাও |
| টিমে শেয়ার করা কঠিন | প্রত্যেকে নিজের key রাখে |

> **`--classic` স্ট্রাকচারে `.gitignore` আগেই তৈরি** — ভেতরে `.env` আছে কিনা একবার দেখে নাও (`cat .gitignore`)। না থাকলে যোগ করো, আর key কোথাও পেস্ট করে commit করো না।

> **অন্য provider হলে** `.env`-এ সেই key (`GROQ_API_KEY`, `GEMINI_API_KEY` ইত্যাদি) বসিয়ে `agents.yaml`/প্রজেক্ট কনফিগে model-ও বদলাতে হবে। সবচেয়ে সহজ পথ — ধাপ ৫-এ OpenAI বেছেই key বসাও।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `AuthenticationError` | key-তে বাড়তি স্পেস/কোট আছে কিনা দেখো; `.env` প্রজেক্ট রুটে আছে কিনা |
| `RateLimitError` / quota শেষ | নতুন key বা অন্য provider |
| key কাজ করছে না | ফাইল সেভ করেছ কিনা; টার্মিনাল নতুন করে খোলো |
| ভুলে key commit হয়েছে | key রিভোক করে নতুন বানাও, git ইতিহাস থেকে সরাও |

## চেকলিস্ট

- [ ] `support_agent/.env`-এ `OPENAI_API_KEY=...`
- [ ] `.env` `.gitignore`-এ আছে
- [ ] key-তে বাড়তি স্পেস নেই

➡️ পরের ধাপ: [ধাপ ১৪ — `crewai install` + `crewai run`](/docs/project-based/project-3/step-14)
