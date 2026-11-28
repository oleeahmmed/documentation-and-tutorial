---
title: "ধাপ ১৩ — API Key বসাও"
description: .env-এ OPENAI_API_KEY — কোডে নয়, git-এ নয়।
icon: KeyRound
---

## লক্ষ্য

LLM-এর key নিরাপদে `.env`-এ রাখা।

## ফাইল

`.env` ফাইলে (CLI যেটা বানিয়েছে) লেখো:

```text
OPENAI_API_KEY=তোমার_আসল_কী_এখানে_বসাও
```

OpenAI key না থাকলে [platform.openai.com](https://platform.openai.com) থেকে বানাও, অথবা Groq/Gemini-র ফ্রি key ব্যবহার করো।

## কেন `.env`

| কোডে সোজা | `.env`-এ |
| --- | --- |
| git-এ গেলে ফাঁস | `.gitignore`-এ থাকে |
| বদলাতে কোড এডিট | এক লাইন বদল |
| টিমে শেয়ার কঠিন | সবাই নিজের key রাখে |

> `.gitignore`-এ `.env` আছে কিনা একবার দেখো। ভুলে key commit হয়ে গেলে সেই key রিভোক করে নতুন বানাও।

> **অন্য provider** ব্যবহার করলে `.env`-এ সেই key (`GROQ_API_KEY`, `GEMINI_API_KEY`) বসিয়ে model-ও বদলাতে হবে। সবচেয়ে সহজ — ধাপ ৫-এ OpenAI বেছে key বসানো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `AuthenticationError` | key-তে বাড়তি স্পেস/কোট; `.env` প্রজেক্ট রুটে কিনা |
| Quota শেষ | নতুন key বা অন্য provider |
| key কাজ করছে না | সেভ করেছ কিনা; টার্মিনাল নতুন করে খোলো |

## চেকলিস্ট

- [ ] `invoice_agent/.env`-এ key
- [ ] `.env` gitignore-এ
- [ ] বাড়তি স্পেস নেই

➡️ পরের ধাপ: [ধাপ ১৪ — রান করো](/docs/project-based/project-5/step-14)
