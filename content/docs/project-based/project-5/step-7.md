---
title: "ধাপ ৭ — তাদের কাজ (tasks.yaml)"
description: extract → classify → record — context দিয়ে রিনা, ফাহিম, সুমাইয়ার কাজ জোড়া।
icon: ClipboardList
---

## লক্ষ্য

প্রতিটা এজেন্টের একটা কাজ আর কাজগুলোর ক্রম ঠিক করা।

## ফাইল খোলো

`src/invoice_agent/config/tasks.yaml` ফাইলের সব মুছে এটা বসাও:

```yaml
extract_task:
  description: >
    নিচের ইনভয়েস/রসিদের টেক্সট থেকে ডেটা বের করো:

    {invoice_text}

    বের করো: vendor_name, invoice_date, total_amount, invoice_number
  expected_output: >
    JSON আকারে: vendor_name, invoice_date, total_amount, invoice_number
  agent: extractor_agent

classify_task:
  description: >
    extract_task-এর ডেটা নিয়ে, knowledge base-এর চার্ট-অফ-অ্যাকাউন্টস দেখে
    এই খরচটা কোন খাতে পড়বে তা ঠিক করো। পরিমাণ ৫০,০০০ টাকার বেশি হলে
    "needs_review": true হিসেবে ফ্ল্যাগ করো।
  expected_output: >
    JSON আকারে: category, needs_review (true/false), reason
  agent: classifier_agent
  context: [extract_task]

record_task:
  description: >
    extract_task ও classify_task-এর তথ্য একসাথে করে save_to_ledger টুল কল করে
    এন্ট্রিটা লেজারে সেভ করো। সেভ করার পর একটা সংক্ষিপ্ত কনফার্মেশন দাও।
  expected_output: >
    সেভ হওয়া এন্ট্রির সারমর্ম (vendor, amount, category, date) এবং সেভ
    কনফার্মেশন মেসেজ
  agent: bookkeeper_agent
  context: [extract_task, classify_task]
```

খেয়াল করো — **`extract_task`-এর কোনো context নেই** (রিনা শূন্য থেকে শুরু করে), **`classify_task`-এর `context: [extract_task]`** (ফাহিম রিনার কাজ দেখে), আর **`record_task`-এর `context: [extract_task, classify_task]`** (সুমাইয়া দুজনেরই কাজ দেখে)।

## context-এর চেইন

| Task | context | মানে |
| --- | --- | --- |
| `extract_task` | নেই | রিনা শূন্য থেকে |
| `classify_task` | `[extract_task]` | ফাহিম রিনার ডেটা মিলিয়ে খাত ঠিক করে |
| `record_task` | `[extract_task, classify_task]` | সুমাইয়া দুজনের ফলাফল দেখে লেজারে লেখে |

> **Input placeholder:** `{invoice_text}` — `main.py`-এর `inputs` dict থেকে আসে (ধাপ ১২)। আসল PDF থেকে টেক্সট বের করলে সেটাও এখানেই বসবে।

> **৫০,০০০ টাকার নিয়ম দুই জায়গায়** — এখানে task-এ আর ধাপ ৮-এর নলেজ ফাইলে। দুটো একসাথে বদলাও, নাহলে এজেন্ট বিভ্রান্ত হবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError: 'invoice_text'` | inputs-এ ঠিক এই key আছে কিনা দেখো |
| context ignore হচ্ছে | context-এ টাস্কের **key** লিখতে হয়, ফাংশনের নাম নয় |
| খাত ভুল আসছে | ধাপ ৮-এর চার্ট-অফ-অ্যাকাউন্টসে খাতের নাম আরও স্পষ্ট করো |

## চেকলিস্ট

- [ ] ৩টা Task, ক্রম ঠিক
- [ ] context চেইন: extract → classify → record
- [ ] `{invoice_text}` placeholder

➡️ পরের ধাপ: [ধাপ ৮ — চার্ট-অফ-অ্যাকাউন্টস](/docs/project-based/project-5/step-8)
