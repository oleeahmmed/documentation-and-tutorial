---
title: "ধাপ ৭ — তাদের কাজ (tasks.yaml)"
description: parse → find → confirm — context দিয়ে রাজিয়া, ইমন, তিশার কাজ জোড়া।
icon: ClipboardList
---

## লক্ষ্য

প্রতিটা এজেন্টের একটা কাজ আর কাজগুলোর ক্রম ঠিক করা।

## ফাইল খোলো

`src/scheduling_agent/config/tasks.yaml` ফাইলের সব মুছে এটা বসাও:

```yaml
parse_request_task:
  description: >
    নিচের ক্লায়েন্ট ইমেইলটি বিশ্লেষণ করো:

    {client_email}

    বের করো: মিটিংয়ের উদ্দেশ্য, ক্লায়েন্টের পছন্দের তারিখ/সময় (উল্লেখ থাকলে),
    এবং সম্ভাব্য দৈর্ঘ্য (মিনিটে)।
  expected_output: >
    JSON আকারে: purpose, preferred_datetime, duration_minutes, client_name
  agent: request_parser_agent

find_availability_task:
  description: >
    parse_request_task-এর তথ্য নিয়ে, knowledge base-এর ক্যালেন্ডার-নিয়ম দেখে
    ক্লায়েন্টের পছন্দের সময়ের কাছাকাছি ২-৩টা বৈধ ফাঁকা স্লট প্রস্তাব করো।
  expected_output: >
    তারিখ ও সময়সহ ২-৩টা প্রস্তাবিত স্লটের তালিকা
  agent: availability_agent
  context: [parse_request_task]

confirm_and_invite_task:
  description: >
    parse_request_task ও find_availability_task-এর তথ্য দেখে, প্রস্তাবিত
    স্লটগুলোর প্রথমটা ফাইনাল হিসেবে বেছে নাও। send_calendar_invite টুল কল করে
    ইনভাইট পাঠাও, এবং ক্লায়েন্টকে একটা সংক্ষিপ্ত কনফার্মেশন ইমেইল লেখো।
  expected_output: >
    ফাইনাল হওয়া তারিখ/সময়, মিটিং লিংক, এবং ক্লায়েন্টের জন্য কনফার্মেশন ইমেইল
  agent: confirmation_agent
  context: [parse_request_task, find_availability_task]
```

খেয়াল করো — **`parse_request_task`-এর কোনো context নেই** (রাজিয়া শূন্য থেকে শুরু করে), **`find_availability_task`-এর `context: [parse_request_task]`** (ইমন রাজিয়ার কাজ দেখে), আর **`confirm_and_invite_task`-এর `context: [parse_request_task, find_availability_task]`** (তিশা দুজনেরই কাজ দেখে)।

## context-এর চেইন

| Task | context | মানে |
| --- | --- | --- |
| `parse_request_task` | নেই | রাজিয়া শূন্য থেকে ইমেইল পড়ে |
| `find_availability_task` | `[parse_request_task]` | ইমন রাজিয়ার তথ্য + ক্যালেন্ডার-নিয়ম মিলিয়ে স্লট দেয় |
| `confirm_and_invite_task` | `[parse_request_task, find_availability_task]` | তিশা দুজনের ফলাফল দেখে ফাইনাল স্লট + ইনভাইট |

> **Input placeholder:** `{client_email}` — `main.py`-এর `inputs` dict থেকে আসে (ধাপ ১২)। আসল Gmail/Outlook থেকে মেইল আনলে সেখানকার টেক্সট এখানেই বসবে।

> **কোন টাস্কে কোন জ্ঞান?** শুধু `find_availability_task`-এ ক্যালেন্ডার-নিয়ম লাগে, তাই knowledge শুধু ইমনের এজেন্টে দেওয়া হবে (ধাপ ১১)। বাকিরা নিজের কাজে অপ্রয়োজনীয় তথ্য দেখবে না।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError: 'client_email'` | inputs-এ ঠিক এই key আছে কিনা দেখো |
| context ignore হচ্ছে | context-এ টাস্কের **key** লিখতে হয়, ফাংশনের নাম নয় |
| স্লট নিয়মের বাইরে আসছে | ধাপ ৮-এর ক্যালেন্ডার-নিয়মে সময়-সীমা আরও স্পষ্ট করো |

## চেকলিস্ট

- [ ] ৩টা Task, ক্রম ঠিক
- [ ] context চেইন: parse → find → confirm
- [ ] `{client_email}` placeholder

➡️ পরের ধাপ: [ধাপ ৮ — ক্যালেন্ডার-নিয়ম](/docs/project-based/project-6/step-8)
