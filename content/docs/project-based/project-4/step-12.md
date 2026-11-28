---
title: "ধাপ ১২ — একটা টেস্ট লিড (main.py)"
description: Karim Ahmed / Dhaka Fresh Grocers দিয়ে পুরো টিম একবার চালাও।
icon: Send
---

## লক্ষ্য

`main.py`-এর `run()`-এ একটা নমুনা লিড বসিয়ে Crew চালু করা।

## ফাইল খোলো

`src/lead_gen_agent/main.py`-তে `run()` ফাংশন খুঁজে নিয়ে ভেতরের অংশ এভাবে বদলাও:

```python
def run():
    inputs = {
        'lead_name': 'Karim Ahmed',
        'lead_company': 'Dhaka Fresh Grocers',
        'lead_website': 'https://example-dhakafreshgrocers.com',
    }
    try:
        LeadGenAgent().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
```

## কী হচ্ছে এখানে

| অংশ | কাজ |
| --- | --- |
| `inputs` | তিনটা placeholder একসাথে: নাম, কোম্পানি, ওয়েবসাইট |
| `LeadGenAgent().crew()` | `crew.py`-র ক্লাস আর মেথড |
| `.kickoff(inputs=...)` | টিমকে কাজ শুরু করার নির্দেশ |
| `try/except` | এরর হলে পরিষ্কার মেসেজ |

> **আসল লিড দিয়ে টেস্ট:** নিজের কোম্পানির (বা বানানো) একজন সম্ভাব্য ক্লায়েন্টের নাম-কোম্পানি-ওয়েবসাইট বসাও। ওয়েবসাইট না থাকলে ছেড়ে দিলেও চলে — তবে তানভীর কম তথ্য পাবে।

> **বেশি লিড?** একটা লিস্ট নিয়ে লুপ করে প্রতিটা লিডের জন্য `kickoff()` কল করলেই হয় — একই প্রজেক্ট, বাড়তি কোড সামান্য।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError` | inputs-এর key আর `tasks.yaml`-এর `{...}` হুবহু মিলাও |
| `NameError: LeadGenAgent` | `from .crew import LeadGenAgent` import আছে কিনা দেখো |
| একই আউটপুট | memory/cache; নতুন লিড দিয়ে চালাও |

## চেকলিস্ট

- [ ] `inputs`-এ তিনটা key
- [ ] `LeadGenAgent().crew().kickoff(...)`
- [ ] টেস্ট লিডের তথ্য বসানো

➡️ পরের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-4/step-13)
