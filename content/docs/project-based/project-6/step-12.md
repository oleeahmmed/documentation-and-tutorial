---
title: "ধাপ ১২ — একটা টেস্ট ইমেইল (main.py)"
description: ফারহান রহমানের একটা নমুনা ইমেইল দিয়ে পুরো টিম একবার চালাও।
icon: Send
---

## লক্ষ্য

`main.py`-এর `run()`-এ একটা নমুনা ক্লায়েন্ট ইমেইল বসিয়ে Crew চালু করা।

## ফাইল খোলো

`src/scheduling_agent/main.py`-তে `run()` ফাংশন খুঁজে নিয়ে ভেতরের অংশ এভাবে বদলাও:

```python
def run():
    sample_email = """
বিষয়: একটা মিটিং চাই

হাই, আমি আগামী মঙ্গলবার বিকালের দিকে আপনার সাথে একটা ৩০ মিনিটের কল করতে চাই,
নতুন প্রজেক্ট নিয়ে কথা বলার জন্য।
- Client: Farhan Rahman
"""
    inputs = {'client_email': sample_email}
    try:
        SchedulingAgent().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
```

## কী হচ্ছে এখানে

| অংশ | কাজ |
| --- | --- |
| `sample_email` | একটা ক্লায়েন্ট ইমেইল — বিষয়, পছন্দের দিন/সময়, সময়কাল, নাম সব আছে |
| `inputs` | `{client_email}` placeholder-এ এই ইমেইল বসছে |
| `SchedulingAgent().crew()` | `crew.py`-র ক্লাস আর মেথড |
| `.kickoff(inputs=...)` | টিমকে কাজ শুরু করার নির্দেশ |

> **নমুনাটা ইচ্ছে করেই "মঙ্গলবার বিকাল"** — ধাপ ৮-এর নিয়মে মঙ্গলবার ৩টায় ভেন্ডর কল বুক করা, তাই ইমনের স্লট প্রস্তাব করতে গিয়ে ওটা এড়িয়ে ৩:১৫-এর পরের বৈধ সময় বাছা উচিত। এতে নিয়ম মানছে কিনা যাচাই করা সহজ।

> **আসল ইমেইল দিয়ে টেস্ট:** Gmail/Outlook থেকে ইমেইলের টেক্সট কপি করে `sample_email`-এ বসাও। live inbox থেকে আনতে চাইলে ধাপ ১৪-এর "বাস্তব কথা" দেখো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError` | inputs-এর key আর `tasks.yaml`-এর `{client_email}` হুবহু মিলাও |
| `NameError: SchedulingAgent` | `from .crew import SchedulingAgent` import আছে কিনা দেখো |
| রাজিয়া সময় বের করছে না | ইমেইলে দিন/সময় স্পষ্ট ভাষায় লেখো |
| ইমন স্লট দিচ্ছে না | knowledge ফাইল ঠিকভাবে লোড হচ্ছে কিনা দেখো |

## চেকলিস্ট

- [ ] `sample_email` বসানো
- [ ] `inputs = {'client_email': ...}`
- [ ] `SchedulingAgent().crew().kickoff(...)`

➡️ পরের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-6/step-13)
