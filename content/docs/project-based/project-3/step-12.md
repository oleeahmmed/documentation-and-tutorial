---
title: "ধাপ ১২ — টেস্ট ইমেইল (main.py)"
description: অফিসের দরজা — run() ফাংশনে একটা নমুনা কাস্টমার ইমেইল দিয়ে Crew চালু।
icon: Send
---

## লক্ষ্য

`main.py`-এর `run()` ফাংশনে নমুনা ইমেইল বসানো, যাতে পুরো টিম একবার চলে।

## ফাইল খোলো

`src/support_agent/main.py` ফাইলে `run()` ফাংশনটা খুঁজে বের করো, ভেতরের `inputs` অংশটুকু এভাবে বদলাও:

```python
def run():
    sample_email = """
বিষয়: আমার SMS ক্রেডিট কাটা হয়েছে কিন্তু মেসেজ যায়নি
আমি ৫০০ SMS পাঠিয়েছি, ক্রেডিট কাটার পরও ডেলিভার হয়নি। আজকের মধ্যে সমাধান দরকার।
- Rafiq
"""
    inputs = {'customer_email': sample_email}
    try:
        SupportAgent().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
```

## কী হচ্ছে এখানে

| অংশ | কাজ |
| --- | --- |
| `sample_email` | কাস্টমারের আসল ইমেইলের মতো টেস্ট ডেটা |
| `inputs` | `{customer_email}` placeholder-এ এই লেখাটা বসাবে |
| `SupportAgent().crew()` | `crew.py`-র `SupportAgent` ক্লাসের `crew()` মেথড |
| `.kickoff(inputs=...)` | টিমকে কাজ শুরু করার নির্দেশ |
| `try/except` | এরর হলে পরিষ্কার মেসেজ দেখায় |

> **নিজের ইমেইল দিয়ে টেস্ট:** `sample_email`-এর লেখা বদলে তোমার কোম্পানির আসল (বা বানানো) কাস্টমার ইমেইল বসাও। প্রশ্ন blunt হলে উত্তরও পরীক্ষা করা সহজ হয়।

> **তিনটা আলাদা টেস্ট বানাও:** (1) FAQ-তে উত্তর আছে এমন প্রশ্ন, (2) FAQ-তে নেই এমন প্রশ্ন (escalation দেখা যাবে), (3) রাগান্বিত কাস্টমার। তিনটার ফলাফল মিলিয়ে নিলে বোঝা যায় টিম ঠিক কাজ করছে কিনা।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError: 'customer_email'` | inputs-এর key আর `tasks.yaml`-এর `{customer_email}` হুবহু মিলাও |
| `NameError: SupportAgent` | `main.py`-তে `from .crew import SupportAgent` import আছে কিনা দেখো |
| একই ফলাফল বারবার | `memory=True` + cache; নতুন ইমেইল দাও বা memory বন্ধ করে দেখো |

## চেকলিস্ট

- [ ] `run()`-এ `inputs = {'customer_email': sample_email}`
- [ ] `SupportAgent().crew().kickoff(inputs=inputs)` আছে
- [ ] ইমেইল বাংলায়, বিষয়সহ

➡️ পরের ধাপ: [ধাপ ১৩ — API key (.env)](/docs/project-based/project-3/step-13)
