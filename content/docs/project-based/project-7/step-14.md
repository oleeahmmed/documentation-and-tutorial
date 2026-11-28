---
title: "ধাপ ১৪ — রান করো!"
description: crewai install + crewai run — সাব্বির, লুবনা, নাঈম একে একে কাজ করছে, sent_digests.json ভরে যাচ্ছে।
icon: Play
---

## লক্ষ্য

পুরো ইনবক্স টিম একবার চালিয়ে আউটপুট আর `sent_digests.json` দেখা।

## কমান্ড

```bash
crewai install
crewai run
```

টার্মিনালে দেখবে:

1. **সাব্বির** প্রতিটা ইমেইল পড়ে ক্যাটাগরি দিচ্ছে (urgent/spam/billing/newsletter)
2. **লুবনা** শুধু urgent ইমেইলগুলো বেছে, VIP লিস্ট মিলিয়ে সারাংশ লিখছে
3. **নাঈম** দুজনের কাজ দেখে ডাইজেস্ট বানিয়ে `send_digest` কল করছে, `sent_digests.json`-এ লগ হচ্ছে

রান শেষে `sent_digests.json` খুলে দেখলে পুরো ডাইজেস্ট টেক্সট পাবে।

```json
[
  {
    "sent_at": "2026-11-28T08:02:47.512034",
    "channel": "whatsapp",
    "digest_text": "সুপ্রভাত! আজকের ইনবক্স: urgent ১টি, spam ২টি, billing ১টি, newsletter ১টি।\n\nURGENT (VIP):\n• bigclient@acme-corp.com — প্রজেক্ট ডেডলাইন নিয়ে জরুরি কথা। আজকের মধ্যে রিপ্লাই দরকার।"
  }
]
```

## তুমি এখন কী বানালে?

**সাব্বির, লুবনা, নাঈম** — ৩ জনের একটা ভার্চুয়াল ইনবক্স-ম্যানেজমেন্ট টিম, যার:

- **পার্মানেন্ট নির্দেশনা** (`agents.yaml`, `tasks.yaml`)
- **নলেজ বেস** (`knowledge/priority_rules.txt`) — VIP লিস্ট ও ক্যাটাগরি-নিয়ম
- **স্কিল/টুল** (`send_digest`) — ডাইজেস্ট লগ করে
- **স্কিল রেজিস্টার** (`skills.md`)
- **মেমোরি** (`memory=True`)

**একটা বাস্তব কথা:** এখানে ইনবক্স একটা স্ট্যাটিক টেক্সট (কপি-পেস্ট করা ইমেইলের তালিকা), আর ডাইজেস্ট JSON ফাইলে লগ হচ্ছে। আসল কাজে এই দুইটা জায়গা বদলাতে হবে:

- **ইনপুট দিক** — Gmail/Outlook API বা IMAP দিয়ে সকালে স্বয়ংক্রিয়ভাবে নতুন ইমেইল টেনে আনা (CrewAI-এর Gmail MCP কানেক্টর দিয়েও করা যায়)
- **আউটপুট দিক** — `send_digest` টুলের ভেতরে WhatsApp Business API, Slack Webhook, বা Telegram Bot API কল বসানো
- **শিডিউল** — প্রতিদিন সকাল ৭টায় নিজে থেকেই চলার জন্য Celery Beat দিয়ে একটা শিডিউলড টাস্ক

> **গোপনীয়তা:** CEO-র পুরো ইনবক্স LLM-এ পাঠানো মানে মেইলের বিষয়বস্তু third-party API-তে যাচ্ছে। কোম্পানির নীতিতে সংবেদনশীল মেইল বাদ দেওয়ার নিয়ম থাকলে সেটা `priority_rules.txt`-এ লিখে রাখো (যেমন: "bank", "password" থাকলে ডাইজেস্টে রাখো না)।

## চালানোর আগে চেক

| জিনিস | ঠিক আছে কিনা |
| --- | --- |
| `agents.yaml` | ৩ Agent |
| `tasks.yaml` | triage → summarize → deliver |
| `knowledge/priority_rules.txt` | VIP লিস্ট + ক্যাটাগরি-নিয়ম |
| `tools/custom_tool.py` | `SendDigestTool` |
| `crew.py` | লুবনার knowledge, নাঈমের tool |
| `main.py` | `inbox_emails` input |
| `.env` | `OPENAI_API_KEY` |

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `uv` নেই | `pip install uv`, তারপর আবার `crewai install` |
| knowledge embedding এরর | OpenAI key দাও; বা `memory=False` করে টেস্ট |
| `sent_digests.json` তৈরি হয়নি | নাঈমের টুল কল হয়নি — `send_digest_task`-এর description আরও স্পষ্ট করো |
| সব ইমেইল urgent | `priority_rules.txt`-এর নিয়ম আরও স্পষ্ট লেখো |
| ডাইজেস্টে সারাংশ নেই | urgent ইমেইলের টেক্সটে মূল কথা লেখো; ২ লাইনের নির্দেশ আরও জোরালো করো |
| একই ডাইজেস্ট বারবার লগ হচ্ছে | JSON নিজে append করে — পুরোনো ফাইল পরিষ্কার করে আবার চালাও |

## চেকলিস্ট

- [ ] `crewai install` সফল
- [ ] `crewai run` শেষে তিনজনের কাজ দেখা যায়
- [ ] `sent_digests.json`-এ নতুন এন্ট্রি
- [ ] `skills.md` হালনাগাদ

⬅️ আগের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-7/step-13)

➡️ প্রজেক্ট ওভারভিউ: [Blastify Inbox Crew — ১৪ ধাপ](/docs/project-based/project-7)
