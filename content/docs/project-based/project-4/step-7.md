---
title: "ধাপ ৭ — তাদের কাজ (tasks.yaml)"
description: research → personalize → followup — context দিয়ে তানভীর, মিতু, আরিফের কাজ জোড়া।
icon: ClipboardList
---

## লক্ষ্য

প্রতিটা এজেন্টের একটা কাজ আর কাজগুলোর ক্রম ঠিক করা।

## ফাইল খোলো

`src/lead_gen_agent/config/tasks.yaml` ফাইলের সব মুছে এটা বসাও:

```yaml
research_task:
  description: >
    নিচের লিডের তথ্য নিয়ে রিসার্চ করো:

    নাম: {lead_name}
    কোম্পানি: {lead_company}
    ওয়েবসাইট: {lead_website}

    তাদের ব্যবসা কী নিয়ে, কোন ইন্ডাস্ট্রিতে, এবং কাস্টমারের সাথে যোগাযোগে
    (SMS marketing) কী সমস্যা থাকতে পারে তা বের করো।
  expected_output: >
    বুলেট পয়েন্টে: ইন্ডাস্ট্রি, ব্যবসার সংক্ষিপ্ত বিবরণ, সম্ভাব্য পেইন পয়েন্ট
  agent: research_agent

personalize_email_task:
  description: >
    research_task-এর তথ্য ব্যবহার করে {lead_name}-এর জন্য একটা পার্সোনালাইজড
    কোল্ড ইমেইল লেখো, যেখানে Blastify-র SMS মার্কেটিং সার্ভিস তাদের নির্দিষ্ট
    সমস্যার সমাধান হিসেবে উপস্থাপন করা হবে। knowledge base থেকে Blastify-র
    সার্ভিস তথ্য ব্যবহার করো।
  expected_output: >
    সম্পূর্ণ ইমেইল — Subject + Body (৫-৬ লাইনের বেশি না, একটা স্পষ্ট CTA সহ)
  agent: email_writer_agent
  context: [research_task]

followup_plan_task:
  description: >
    research_task ও personalize_email_task-এর তথ্য দেখে ঠিক করো {lead_name}-এর
    জন্য কতদিন পর ফলো-আপ পাঠানো উচিত (সাধারণত ৩ দিন, জরুরি মনে হলে কম)।
    schedule_followup টুল কল করে এটা লগ করে রাখো, এবং একটা ছোট ফলো-আপ ইমেইলের
    খসড়াও লেখো।
  expected_output: >
    ফলো-আপের তারিখ, কারণ, এবং ২-৩ লাইনের ফলো-আপ ইমেইল খসড়া
  agent: followup_coordinator_agent
  context: [research_task, personalize_email_task]
```

খেয়াল করো — **`research_task`-এর কোনো context নেই** (তানভীর শূন্য থেকে শুরু করে), **`personalize_email_task`-এর `context: [research_task]`** (মিতু তানভীরের কাজ দেখে), আর **`followup_plan_task`-এর `context: [research_task, personalize_email_task]`** (আরিফ দুজনেরই কাজ দেখে)।

## context-এর চেইন

| Task | context | মানে |
| --- | --- | --- |
| `research_task` | নেই | তানভীর শূন্য থেকে |
| `personalize_email_task` | `[research_task]` | মিতু রিসার্চ মিলিয়ে লেখে |
| `followup_plan_task` | `[research_task, personalize_email_task]` | আরিফ দুজনের ফলাফল দেখে সিদ্ধান্ত নেয় |

> **Input placeholder:** `{lead_name}`, `{lead_company}`, `{lead_website}` — `main.py`-এর `inputs` dict থেকে আসে (ধাপ ১২)। নাম বদলালে দুই জায়গায় একসাথে বদলাও।

> **`expected_output`** এজেন্টের "সফলতার মাপকাঠি" — এখানে "৫-৬ লাইনের বেশি না" লেখা আছে, তাই মিতু সাধারণত ছোট ইমেইলই দেয়।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError: 'lead_name'` | inputs-এ ঠিক এই তিনটা key আছে কিনা দেখো |
| context ignore হচ্ছে | context-এ টাস্কের **key** লিখতে হয়, ফাংশনের নাম নয় |
| ইমেইল খুব লম্বা | expected_output-এ লাইনের সীমা আরও স্পষ্ট করো |

## চেকলিস্ট

- [ ] ৩টা Task, ক্রম ঠিক
- [ ] context চেইন: research → personalize → followup
- [ ] তিনটা input placeholder

➡️ পরের ধাপ: [ধাপ ৮ — Blastify-র সার্ভিস তথ্য](/docs/project-based/project-4/step-8)
