---
title: "ধাপ ১২ — একগুচ্ছ টেস্ট ইমেইল (main.py)"
description: পাঁচটা নমুনা ইমেইল — VIP ক্লায়েন্ট, স্প্যাম, বিল, নিউজলেটার আর লটারি দিয়ে টিম চালাও।
icon: Send
---

## লক্ষ্য

`main.py`-এর `run()`-এ কয়েকটা নমুনা ইমেইল বসিয়ে Crew চালু করা।

## ফাইল খোলো

`src/inbox_agent/main.py`-তে `run()` ফাংশন খুঁজে নিয়ে ভেতরের অংশ এভাবে বদলাও:

```python
def run():
    sample_inbox = """
১. From: bigclient@acme-corp.com | Subject: প্রজেক্ট ডেডলাইন নিয়ে জরুরি কথা | আজকের মধ্যে রিপ্লাই দরকার।
২. From: deals@randomshop.com | Subject: 90% OFF শুধু আজকের জন্য!! | ক্লিক করুন এখনই
৩. From: billing@awscloud.com | Subject: Your invoice is due | Payment due by Dec 5
৪. From: newsletter@techcrunch.com | Subject: This Week in Tech | Weekly digest
৫. From: unknown123@mail.ru | Subject: You won a lottery! | Click here to claim
"""
    inputs = {'inbox_emails': sample_inbox}
    try:
        InboxAgent().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
```

## কী হচ্ছে এখানে

| অংশ | কাজ |
| --- | --- |
| `sample_inbox` | পাঁচটা ইমেইল এক লাইনে — sender, subject, এক লাইনের মূল কথা |
| `inputs` | `{inbox_emails}` placeholder-এ এই টেক্সট বসছে |
| `InboxAgent().crew()` | `crew.py`-র ক্লাস আর মেথড |
| `.kickoff(inputs=...)` | টিমকে কাজ শুরু করার নির্দেশ |

> **নমুনাগুলো ইচ্ছে করেই মিশিয়ে দেওয়া** — একটাই VIP (acme), একটাই বিল, একটাই নিউজলেটার, দুটো স্প্যাম। এতে দেখা যাবে সাব্বির ঠিকভাবে ভাগ করছে কিনা, লুবনা শুধু urgent-এ ঢুকছে কিনা, আর ডাইজেস্টের সংখ্যা মিলছে কিনা।

> **আসল ইনবক্স দিয়ে টেস্ট:** ইমেইলের sender/subject/বিষয় কপি করে একই ফরম্যাটে বসাও। আবার শুধু subject দিলে সারাংশ দুর্বল হবে — অন্তত এক লাইনের মূল কথা দাও।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError` | inputs-এর key আর `tasks.yaml`-এর `{inbox_emails}` হুবহু মিলাও |
| `NameError: InboxAgent` | `from .crew import InboxAgent` import আছে কিনা দেখো |
| সব ইমেইল একই ক্যাটাগরি | প্রতিটা লাইনে sender/subject স্পষ্ট করে লেখো |
| সারাংশ আসছে না | ক্যাটাগরি "urgent" হচ্ছে কিনা দেখো; নিয়ম/সুর স্পষ্ট করো |

## চেকলিস্ট

- [ ] `sample_inbox` বসানো
- [ ] `inputs = {'inbox_emails': ...}`
- [ ] `InboxAgent().crew().kickoff(...)`

➡️ পরের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-7/step-13)
