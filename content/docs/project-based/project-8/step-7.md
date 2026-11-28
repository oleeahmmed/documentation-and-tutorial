---
title: "ধাপ ৭ — তাদের কাজ (tasks.yaml)"
description: parse → score → process — context দিয়ে জেরিন, মাহিন, তানিয়ার কাজ জোড়া।
icon: ClipboardList
---

## লক্ষ্য

প্রতিটা এজেন্টের একটা কাজ আর কাজগুলোর ক্রম ঠিক করা।

## ফাইল খোলো

`src/hr_agent/config/tasks.yaml` ফাইলের সব মুছে এটা বসাও:

```yaml
parse_resume_task:
  description: >
    নিচের সিভি/রেজ্যুমে থেকে তথ্য বের করো:

    {resume_text}

    বের করো: candidate_name, years_experience, key_skills, education
  expected_output: >
    JSON আকারে: candidate_name, years_experience, key_skills, education
  agent: resume_parser_agent

score_candidate_task:
  description: >
    parse_resume_task-এর তথ্য নিয়ে, knowledge base-এর জব ডেসক্রিপশন ও
    আবশ্যিক শর্তাবলী দেখে এই প্রার্থীর জন্য ০-১০০ এর মধ্যে একটা fit_score দাও
    এবং shortlisted (true/false) সিদ্ধান্ত নাও।
  expected_output: >
    JSON আকারে: fit_score, shortlisted, reason
  agent: screening_agent
  context: [parse_resume_task]

process_outcome_task:
  description: >
    parse_resume_task ও score_candidate_task-এর তথ্য একসাথে করে
    process_candidate টুল কল করো। shortlisted true হলে ইন্টারভিউ ইমেইলের
    খসড়া তৈরি করো, false হলে ডাটাবেজ-সংরক্ষণ নিশ্চিত করো।
  expected_output: >
    প্রার্থীর নাম, ফলাফল (shortlisted/saved), এবং পাঠানো/সেভ হওয়া কনফার্মেশন
  agent: outreach_agent
  context: [parse_resume_task, score_candidate_task]
```

খেয়াল করো — **`parse_resume_task`-এর কোনো context নেই** (জেরিন শূন্য থেকে শুরু করে), **`score_candidate_task`-এর `context: [parse_resume_task]`** (মাহিন জেরিনের কাজ দেখে), আর **`process_outcome_task`-এর `context: [parse_resume_task, score_candidate_task]`** (তানিয়া দুজনেরই কাজ দেখে)।

## context-এর চেইন

| Task | context | মানে |
| --- | --- | --- |
| `parse_resume_task` | নেই | জেরিন শূন্য থেকে সিভি পড়ে |
| `score_candidate_task` | `[parse_resume_task]` | মাহিন জেরিনের তথ্য + জব ডেসক্রিপশন মিলিয়ে স্কোর দেয় |
| `process_outcome_task` | `[parse_resume_task, score_candidate_task]` | তানিয়া দুজনের ফলাফল দেখে ইনভাইট/সেভ করে |

> **Input placeholder:** `{resume_text}` — `main.py`-এর `inputs` dict থেকে আসে (ধাপ ১২)। PDF সিভি থেকে টেক্সট বের করলে সেটাও এখানেই বসবে।

> **এক প্রার্থী, এক রান:** এই ফ্লো একটা সিভির জন্য। ২০০ সিভি হলে `main.py`-তে লুপ চালিয়ে প্রতিটার জন্য `kickoff()` ডাকবে — ধাপ ১৪-এর শেষে দেখো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError: 'resume_text'` | inputs-এ ঠিক এই key আছে কিনা দেখো |
| context ignore হচ্ছে | context-এ টাস্কের **key** লিখতে হবে, ফাংশনের নাম নয় |
| স্কোর এলোমেলো | ধাপ ৮-এর স্কোরিং নির্দেশিকা আরও স্পষ্ট করো |

## চেকলিস্ট

- [ ] ৩টা Task, ক্রম ঠিক
- [ ] context চেইন: parse → score → process
- [ ] `{resume_text}` placeholder

➡️ পরের ধাপ: [ধাপ ৮ — জব ডেসক্রিপশন](/docs/project-based/project-8/step-8)
