---
title: "ধাপ ৭ — তাদের কাজ (tasks.yaml)"
description: extract → compose → send — context দিয়ে নওশিন, রাহাত, পিয়ার কাজ জোড়া।
icon: ClipboardList
---

## লক্ষ্য

প্রতিটা এজেন্টের একটা কাজ আর কাজগুলোর ক্রম ঠিক করা।

## ফাইল খোলো

`src/order_notify_agent/config/tasks.yaml` ফাইলের সব মুছে এটা বসাও:

```yaml
extract_event_task:
  description: >
    নিচের ইভেন্টটি বিশ্লেষণ করো:

    {order_event}

    বের করো: event_type (order_confirmation/payment_receipt/tracking_update/
    abandoned_cart), customer_name, order_id, এবং প্রাসঙ্গিক বিস্তারিত
    (পণ্যের নাম, টাকার পরিমাণ, বা ট্র্যাকিং লিংক — যা প্রযোজ্য)।
  expected_output: >
    JSON আকারে: event_type, customer_name, order_id, details
  agent: event_extractor_agent

compose_email_task:
  description: >
    extract_event_task-এর তথ্য নিয়ে, knowledge base-এর টেমপ্লেট ও টোন
    গাইডলাইন দেখে event_type অনুযায়ী সঠিক ইমেইল লেখো।
  expected_output: >
    Subject + Body সম্বলিত সম্পূর্ণ ইমেইল কনটেন্ট
  agent: email_composer_agent
  context: [extract_event_task]

send_notification_task:
  description: >
    extract_event_task ও compose_email_task-এর তথ্য একসাথে করে
    send_notification টুল কল করে ইমেইলটা পাঠাও।
  expected_output: >
    পাঠানো ইমেইলের সারমর্ম এবং পাঠানোর কনফার্মেশন
  agent: notification_sender_agent
  context: [extract_event_task, compose_email_task]
```

খেয়াল করো — **`extract_event_task`-এর কোনো context নেই** (নওশিন শূন্য থেকে শুরু করে), **`compose_email_task`-এর `context: [extract_event_task]`** (রাহাত নওশিনের কাজ দেখে), আর **`send_notification_task`-এর `context: [extract_event_task, compose_email_task]`** (পিয়া দুজনেরই কাজ দেখে)।

## context-এর চেইন

| Task | context | মানে |
| --- | --- | --- |
| `extract_event_task` | নেই | নওশিন শূন্য থেকে ইভেন্ট পড়ে |
| `compose_email_task` | `[extract_event_task]` | রাহাত ইভেন্ট-টাইপ + বিস্তারিত + টেমপ্লেট মিলিয়ে লেখে |
| `send_notification_task` | `[extract_event_task, compose_email_task]` | পিয়া নাম-ইভেন্ট-সাবজেক্ট-বডি নিয়ে টুল কল করে |

## চার ধরনের ইভেন্ট

| event_type | কখন আসে | রাহাত কোন টেমপ্লেট নেবে |
| --- | --- | --- |
| `order_confirmation` | অর্ডার প্লেস হলো | পণ্যের তালিকা + মোট মূল্য + আনুমানিক ডেলিভারি |
| `payment_receipt` | পেমেন্ট সফল | পরিমাণ + মেথড + তারিখ |
| `tracking_update` | কুরিয়ারে দেওয়া হলো | কুরিয়ার নাম + ট্র্যাকিং লিংক |
| `abandoned_cart` | কার্টে পণ্য পড়ে আছে | পণ্যের নাম + হালকা CTA |

> **Input placeholder:** `{order_event}` — `main.py`-এর `inputs` dict থেকে আসে (ধাপ ১২)। Shopify/WooCommerce webhook-এর payload এখানেই বসানো যাবে।

> **এক ইভেন্ট, এক রান:** এই ফ্লো একটা ইভেন্টের জন্য। দিনে ১০০ ইভেন্ট হলে `main.py`-তে লুপ চালিয়ে প্রতিটার জন্য `kickoff()` ডাকবে — প্রতিটা `sent_notifications.json`-এ আলাদা এন্ট্রি হবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError: 'order_event'` | inputs-এ ঠিক এই key আছে কিনা দেখো |
| context ignore হচ্ছে | context-এ টাস্কের **key** লিখতে হবে, ফাংশনের নাম নয় |
| রাহাত ভুল টেমপ্লেট নিচ্ছে | ধাপ ৮-এর টেমপ্লেটে "কোন event_type-এর জন্য" আরও স্পষ্ট লেখো |

## চেকলিস্ট

- [ ] ৩টা Task, ক্রম ঠিক
- [ ] context চেইন: extract → compose → send
- [ ] `{order_event}` placeholder

➡️ পরের ধাপ: [ধাপ ৮ — ইমেইল টেমপ্লেট](/docs/project-based/project-9/step-8)
