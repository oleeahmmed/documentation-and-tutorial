---
title: "ধাপ ৭ — তাদের কাজ (tasks.yaml)"
description: triage → summarize → deliver — context দিয়ে সাব্বির, লুবনা, নাঈমের কাজ জোড়া।
icon: ClipboardList
---

## লক্ষ্য

প্রতিটা এজেন্টের একটা কাজ আর কাজগুলোর ক্রম ঠিক করা।

## ফাইল খোলো

`src/inbox_agent/config/tasks.yaml` ফাইলের সব মুছে এটা বসাও:

```yaml
triage_task:
  description: >
    নিচের ইমেইলগুলো একটার পর একটা বিশ্লেষণ করো:

    {inbox_emails}

    প্রতিটার জন্য ক্যাটাগরি ঠিক করো: urgent, spam, newsletter, billing, general
  expected_output: >
    প্রতিটা ইমেইলের জন্য JSON: sender, subject, category
  agent: triage_agent

summarize_task:
  description: >
    triage_task-এর আউটপুট থেকে শুধু "urgent" ক্যাটাগরির ইমেইলগুলো বেছে নাও।
    knowledge base-এর VIP লিস্ট দেখে প্রতিটার জন্য ২ লাইনের সারাংশ লেখো এবং
    প্রেরক VIP কিনা উল্লেখ করো।
  expected_output: >
    প্রতিটা urgent ইমেইলের জন্য: sender, is_vip (true/false), summary (২ লাইন)
  agent: summarizer_agent
  context: [triage_task]

send_digest_task:
  description: >
    triage_task ও summarize_task-এর তথ্য একসাথে করে একটা সকালের ডাইজেস্ট
    বানাও — কতগুলো urgent/spam/newsletter/billing ইমেইল আছে তার সংখ্যা, এবং
    urgent ইমেইলগুলোর সারাংশ। send_digest টুল কল করে এটা পাঠাও।
  expected_output: >
    পাঠানো ডাইজেস্টের সম্পূর্ণ কনটেন্ট এবং পাঠানোর কনফার্মেশন
  agent: digest_agent
  context: [triage_task, summarize_task]
```

খেয়াল করো — **`triage_task`-এর কোনো context নেই** (সাব্বির শূন্য থেকে শুরু করে), **`summarize_task`-এর `context: [triage_task]`** (লুবনা সাব্বিরের কাজ দেখে), আর **`send_digest_task`-এর `context: [triage_task, summarize_task]`** (নাঈম দুজনেরই কাজ দেখে)।

## context-এর চেইন

| Task | context | মানে |
| --- | --- | --- |
| `triage_task` | নেই | সাব্বির শূন্য থেকে সব ইমেইল পড়ে |
| `summarize_task` | `[triage_task]` | লুবনা শুধু urgent বেছে VIP মিলিয়ে সারাংশ লেখে |
| `send_digest_task` | `[triage_task, summarize_task]` | নাঈম সংখ্যা + সারাংশ মিলিয়ে ডাইজেস্ট পাঠায় |

> **Input placeholder:** `{inbox_emails}` — `main.py`-এর `inputs` dict থেকে আসে (ধাপ ১২)। Gmail/Outlook থেকে ইমেইল আনলে সেই টেক্সট এখানেই বসবে।

> **কোন টাস্কে কোন জ্ঞান?** VIP লিস্ট আর ক্যাটাগরি-নিয়ম শুধু সারাংশের সময় লাগে, তাই knowledge শুধু লুবনার এজেন্টে দেওয়া হবে (ধাপ ১১)। সাব্বিরের ক্যাটাগরি-নিয়মও ওই ফাইলেই আছে — কিন্তু টাস্ক-ডেসক্রিপশন নিজেই ক্যাটাগরিগুলো বলে দিচ্ছে, তাই তার বেশি দরকার নেই।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError: 'inbox_emails'` | inputs-এ ঠিক এই key আছে কিনা দেখো |
| context ignore হচ্ছে | context-এ টাস্কের **key** লিখতে হবে, ফাংশনের নাম নয় |
| সব ইমেইল urgent হচ্ছে | ধাপ ৮-এর নিয়মে spam/newsletter-এর সংকেত আরও স্পষ্ট করো |

## চেকলিস্ট

- [ ] ৩টা Task, ক্রম ঠিক
- [ ] context চেইন: triage → summarize → deliver
- [ ] `{inbox_emails}` placeholder

➡️ পরের ধাপ: [ধাপ ৮ — VIP লিস্ট ও ক্যাটাগরি-নিয়ম](/docs/project-based/project-7/step-8)
