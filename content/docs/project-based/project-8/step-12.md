---
title: "ধাপ ১২ — একটা টেস্ট সিভি (main.py)"
description: তানভীর ইসলামের একটা নমুনা সিভি দিয়ে পুরো টিম একবার চালাও।
icon: Send
---

## লক্ষ্য

`main.py`-এর `run()`-এ একটা নমুনা সিভি বসিয়ে Crew চালু করা।

## ফাইল খোলো

`src/hr_agent/main.py`-তে `run()` ফাংশন খুঁজে নিয়ে ভেতরের অংশ এভাবে বদলাও:

```python
def run():
    sample_resume = """
নাম: Tanvir Islam
অভিজ্ঞতা: ৩ বছর, Python/Django ডেভেলপার হিসেবে একটা সফটওয়্যার কোম্পানিতে
স্কিল: Django, DRF, PostgreSQL, Celery, Redis, Git
শিক্ষা: BSc in Computer Science, SUST
"""
    inputs = {'resume_text': sample_resume}
    try:
        HrAgent().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
```

## কী হচ্ছে এখানে

| অংশ | কাজ |
| --- | --- |
| `sample_resume` | একটা সিভির টেক্সট — নাম, অভিজ্ঞতা, স্কিল, শিক্ষা |
| `inputs` | `{resume_text}` placeholder-এ এই টেক্সট বসছে |
| `HrAgent().crew()` | `crew.py`-র ক্লাস আর মেথড |
| `.kickoff(inputs=...)` | টিমকে কাজ শুরু করার নির্দেশ |

> **নমুনাটা ইচ্ছে করেই সব must-have পূরণ করে** — ৩ বছর Django, DRF, PostgreSQL; প্লাসে Celery/Redis আর CS ডিগ্রি। তাই মাহিনের ৭০+ স্কোর আর শর্টলিস্ট হওয়া উচিত — এতে তিনজনের ফ্লো যাচাই করা সহজ।

> **না-যোগ্য প্রার্থীও টেস্ট করো:** `sample_resume`-এ অভিজ্ঞতা ১ বছর করে দিয়ে আবার চালাও — এবার `candidate_database.json`-এ এন্ট্রি হওয়া উচিত।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError` | inputs-এর key আর `tasks.yaml`-এর `{resume_text}` হুবহু মিলাও |
| `NameError: HrAgent` | `from .crew import HrAgent` import আছে কিনা দেখো |
| জেরিন তথ্য তুলছে না | সিভিতে অভিজ্ঞতা/স্কিল স্পষ্ট ভাষায় লেখো |
| সবাই শর্টলিস্ট হচ্ছে | সিভিতে must-have শর্ত কমিয়ে টেস্ট করো — ফল বদলানো উচিত |

## চেকলিস্ট

- [ ] `sample_resume` বসানো
- [ ] `inputs = {'resume_text': ...}`
- [ ] `HrAgent().crew().kickoff(...)`

➡️ পরের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-8/step-13)
