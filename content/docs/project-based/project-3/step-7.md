---
title: "ধাপ ৭ — ৩টা Task (tasks.yaml)"
description: classify → research → draft — context দিয়ে কাজের শৃঙ্খল, একজনের ফলাফল পরের জন দেখে।
icon: ClipboardList
---

## লক্ষ্য

প্রতিটা এজেন্টের হাতে ঠিক একটা কাজ দেওয়া, আর কাজগুলোর ক্রম ঠিক করা।

## ফাইল খোলো

`src/support_agent/config/tasks.yaml` ফাইলের সব মুছে এটা বসাও:

```yaml
classify_task:
  description: >
    নিচের কাস্টমার ইমেইলটি বিশ্লেষণ করো:

    {customer_email}

    বের করো: (1) ক্যাটাগরি, (2) ভাষা, (3) জরুরিত্ব।
  expected_output: >
    JSON আকারে: category, language, urgency, summary
  agent: classifier_agent

research_task:
  description: >
    classify_task-এর আউটপুট অনুযায়ী knowledge base থেকে প্রাসঙ্গিক তথ্য খুঁজে বের করো।
  expected_output: >
    বুলেট পয়েন্টে প্রাসঙ্গিক তথ্য। না পেলে "INSUFFICIENT_INFO"।
  agent: researcher_agent
  context: [classify_task]

draft_reply_task:
  description: >
    research_task-এর তথ্য দিয়ে সম্পূর্ণ রিপ্লাই লেখো, কাস্টমারের ভাষাতেই।
    research_task "INSUFFICIENT_INFO" বললে escalate_to_human টুল কল করো এবং
    কাস্টমারকে বলো বিষয়টি মানুষ এজেন্টের কাছে পাঠানো হয়েছে।
  expected_output: >
    সম্পূর্ণ ইমেইল রিপ্লাই — Subject + Body + সাইন-অফ
  agent: writer_agent
  context: [classify_task, research_task]
```

খেয়াল করো — **`classify_task`-এর কোনো `context` নেই**, কারণ রাফিকে একদম শূন্য থেকে শুরু করতে হয়, কারো কাজের ওপর নির্ভর করে না। কিন্তু **`research_task`-এর `context: [classify_task]`** আছে — মানে নাদিয়া কাজ শুরুর আগে রাফির ফলাফল দেখে নেয়। আর **`draft_reply_task`-এর `context: [classify_task, research_task]`** — মানে সাকিব লেখার আগে রাফি আর নাদিয়া দুজনেরই কাজ চেক করে নেয়। ঠিক যেমন অফিসে একজনের কাজ শেষ হওয়ার পর পরেরজন সেটা হাতে নিয়ে কাজ করে।

## context-এর চেইন

| Task | context | মানে |
| --- | --- | --- |
| `classify_task` | নেই | রাফি শূন্য থেকে শুরু করে |
| `research_task` | `[classify_task]` | নাদিয়া রাফির ক্যাটাগরি/জরুরিত্ব দেখে খোঁজা শুরু করে |
| `draft_reply_task` | `[classify_task, research_task]` | সাকিব দুজনের ফলাফল মিলিয়ে লেখে |

> **`{customer_email}`** হলো input placeholder — `main.py`-তে `inputs={'customer_email': ...}` দিলে এখানে সেই ইমেইল বসে যায়। নাম একটা অক্ষরও আলাদা হলে KeyError আসবে।

> **`expected_output` কেন এত স্পষ্ট?** এজেন্ট এই বর্ণনাটাই তার "সফলতার মাপকাঠি" হিসেবে দেখে। "ভালো উত্তর" লিখলে অস্পষ্ট আসবে; "Subject + Body + সাইন-অফ" লিখলে ফরম্যাট মেনে আসে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError: 'customer_email'` | `main.py`-এর inputs-এ ঠিক এই key আছে কিনা দেখো |
| context কাজ করছে না | context-এ টাস্কের **key** (`classify_task`) লিখতে হবে, ফাংশনের নাম নয় |
| লেখা খুব ছোট আসছে | `expected_output`-এ ফরম্যাট আরও নির্দিষ্ট করো |

## চেকলিস্ট

- [ ] ৩টা Task: classify → research → draft
- [ ] `context` চেইন ঠিক
- [ ] `{customer_email}` placeholder আছে

➡️ পরের ধাপ: [ধাপ ৮ — নিয়মের খাতা](/docs/project-based/project-3/step-8)
