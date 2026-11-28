---
title: "ধাপ ১৪ — রান করো!"
description: crewai install + crewai run — নওশিন, রাহাত, পিয়া একে একে কাজ করছে, sent_notifications.json তৈরি হচ্ছে।
icon: Play
---

## লক্ষ্য

পুরো অর্ডার-নোটিফিকেশন টিম একবার চালিয়ে আউটপুট আর `sent_notifications.json` দেখা।

## কমান্ড

```bash
crewai install
crewai run
```

টার্মিনালে দেখবে:

1. **নওশিন** ইভেন্ট পড়ে event_type/customer_name/order_id/ডিটেইলস বের করছে
2. **রাহাত** নওশিনের তথ্য দেখে, সঠিক টেমপ্লেট বেছে ইমেইল লিখছে
3. **পিয়া** দুজনের কাজ দেখে `send_notification` কল করছে, `sent_notifications.json`-এ লগ হচ্ছে

রান শেষে `sent_notifications.json`-এ এরকম এন্ট্রি পাবে:

```json
[
  {
    "customer_name": "Nusrat Jahan",
    "event_type": "tracking_update",
    "subject": "আপনার পার্সেল পথে আছে! 🚚",
    "body": "প্রিয় Nusrat Jahan, আপনার অর্ডার BLZ-10234 এখন Pathao Courier-এর মাধ্যমে পথে আছে। এখান থেকে ট্র্যাক করুন: https://track.pathao.com/BLZ-10234",
    "sent_at": "2026-11-28T17:05:42.318207"
  }
]
```

## তুমি এখন কী বানালে?

**নওশিন, রাহাত, পিয়া** — ৩ জনের একটা ভার্চুয়াল অর্ডার-নোটিফিকেশন টিম, যার:

- **পার্মানেন্ট নির্দেশনা** (`agents.yaml`, `tasks.yaml`)
- **নলেজ বেস** (`knowledge/email_templates.txt`) — ৪ ধরনের টেমপ্লেট ও ব্র্যান্ড টোন
- **স্কিল/টুল** (`send_notification`) — ইমেইল লগ করে পাঠায়
- **স্কিল রেজিস্টার** (`skills.md`)
- **মেমোরি** (`memory=True`)

**একটা বাস্তব কথা:** এখানে প্রতিটা ইভেন্ট হাতে `main.py`-তে বসিয়ে টেস্ট করা হচ্ছে। আসল দোকানে এটা স্বয়ংক্রিয়ভাবে চলার জন্য:

- **অর্ডার/পেমেন্ট ইভেন্ট** — Shopify/WooCommerce-এর webhook থেকে ইভেন্ট এলে সরাসরি `kickoff()` কল করো (Django-তে একটা webhook এন্ডপয়েন্ট বানিয়ে, চাইলে Celery দিয়ে ব্যাকগ্রাউন্ডে)
- **Abandoned cart** — একটা scheduled Celery টাস্ক প্রতি ঘণ্টায় চেক করবে কোন কার্ট ১-২ ঘণ্টা ধরে অসম্পূর্ণ, তারপর সেই কার্টের জন্য crew চালাবে
- **আসল পাঠানো** — `send_notification`-এর ভেতরে SMTP/SendGrid/AWS SES কল; SMS নোটিফিকেশন চাইলে Blastify-র নিজের Esendex SMS API-ও জুড়ে দেওয়া যায়
- **ডুপ্লিকেট ঠেকাও** — webhook অনেক সময় একই ইভেন্ট দুইবার পাঠায় (retry); `order_id` + `event_type` মিলিয়ে চেক করো, নইলে কাস্টমার একই মেইল দুবার পাবে

> **কাস্টমারের তথ্য সাবধানে:** `sent_notifications.json`-এ নাম, অর্ডার নম্বর আর ইমেইলের বডি জমে — এটা অভ্যন্তরীণ রেকর্ড, পাবলিক নয়। কার্ড নম্বর, পাসওয়ার্ড বা পুরো ঠিকানা কখনো এই লগে রাখো না।

## চালানোর আগে চেক

| জিনিস | ঠিক আছে কিনা |
| --- | --- |
| `agents.yaml` | ৩ Agent |
| `tasks.yaml` | extract → compose → send |
| `knowledge/email_templates.txt` | ব্র্যান্ড টোন + ৪টা টেমপ্লেট |
| `tools/custom_tool.py` | `SendNotificationTool` |
| `crew.py` | রাহাতের knowledge, পিয়ার tool |
| `main.py` | `order_event` input |
| `.env` | `OPENAI_API_KEY` |

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `uv` নেই | `pip install uv`, তারপর আবার `crewai install` |
| knowledge embedding এরর | OpenAI key দাও; বা `memory=False` করে টেস্ট |
| `sent_notifications.json` তৈরি হয়নি | পিয়ার টুল কল হয়নি — `send_notification_task`-এর description আর `crew.py`-র tools দেখো |
| ভুল টেমপ্লেটে ইমেইল গেছে | ইভেন্টের `event_type` আর ধাপ ৮-এর টেমপ্লেট-সেকশন মিলিয়ে দেখো |
| পিয়া "পাঠানো" বলছে কিন্তু ফাইল নেই | backstory-র "টুল কল না করে বলো না" নিয়মটা আছে কিনা দেখো |
| ডুপ্লিকেট এন্ট্রি | JSON নিজে append করে — পুরোনো ফাইল পরিষ্কার করে আবার চালাও |
| একই বিষয় সব ইভেন্টে | নওশিনের expected_output-এ `event_type` বাধ্যতামূলক আছে কিনা দেখো |

## চেকলিস্ট

- [ ] `crewai install` সফল
- [ ] `crewai run` শেষে তিনজনের কাজ দেখা যায়
- [ ] `sent_notifications.json`-এ নতুন এন্ট্রি (subject + body সহ)
- [ ] `skills.md` হালনাগাদ

⬅️ আগের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-9/step-13)

➡️ প্রজেক্ট ওভারভিউ: [Blastify Order-Notify Crew — ১৪ ধাপ](/docs/project-based/project-9)
