---
title: "ধাপ ১২ — একটা টেস্ট ইনভয়েস (main.py)"
description: AWS-এর একটা নমুনা ইনভয়েস দিয়ে পুরো টিম একবার চালাও।
icon: Send
---

## লক্ষ্য

`main.py`-এর `run()`-এ একটা নমুনা ইনভয়েস বসিয়ে Crew চালু করা।

## ফাইল খোলো

`src/invoice_agent/main.py`-তে `run()` ফাংশন খুঁজে নিয়ে ভেতরের অংশ এভাবে বদলাও:

```python
def run():
    sample_invoice = """
Invoice #INV-2026-0881
Vendor: Amazon Web Services (AWS)
Date: 2026-11-15
Description: Monthly cloud hosting charges
Total Amount: BDT 18,500
"""
    inputs = {'invoice_text': sample_invoice}
    try:
        InvoiceAgent().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
```

## কী হচ্ছে এখানে

| অংশ | কাজ |
| --- | --- |
| `sample_invoice` | একটা ইনভয়েসের টেক্সট — ভেন্ডর, তারিখ, বিবরণ, অঙ্ক সব আছে |
| `inputs` | `{invoice_text}` placeholder-এ এই টেক্সট বসছে |
| `InvoiceAgent().crew()` | `crew.py`-র ক্লাস আর মেথড |
| `.kickoff(inputs=...)` | টিমকে কাজ শুরু করার নির্দেশ |

> **নমুনাটা ইচ্ছে করেই AWS-এর** — চার্ট-অফ-অ্যাকাউন্টসে `Cloud & Hosting` খাত আছে, তাই ফাহিমের সিদ্ধান্ত যাচাই করা সহজ।

> **আসল ইনভয়েস দিয়ে টেস্ট:** PDF থেকে টেক্সট কপি করে `sample_invoice`-এ বসাও। পদ্ধতি ধাপ ১৪-এর "বাস্তব কথা" অংশে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError` | inputs-এর key আর `tasks.yaml`-এর `{invoice_text}` হুবহু মিলাও |
| `NameError: InvoiceAgent` | `from .crew import InvoiceAgent` import আছে কিনা দেখো |
| রিনা ডেটা বের করছে না | টেক্সটে ভেন্ডর/তারিখ/অঙ্ক স্পষ্ট ভাষায় লেখো |

## চেকলিস্ট

- [ ] `sample_invoice` বসানো
- [ ] `inputs = {'invoice_text': ...}`
- [ ] `InvoiceAgent().crew().kickoff(...)`

➡️ পরের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-5/step-13)
