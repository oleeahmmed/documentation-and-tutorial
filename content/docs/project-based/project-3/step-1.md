---
title: "ধাপ ১ — Python আছে কিনা চেক"
description: Blastify সাপোর্ট টিম বানানোর আগে টার্মিনালে Python ইনস্টল আছে কিনা নিশ্চিত করো।
icon: Terminal
---

## লক্ষ্য

টার্মিনাল খুলে দেখো তোমার কম্পিউটারে Python আছে কিনা, আর ভার্সনটা CrewAI-র জন্য যথেষ্ট নতুন কিনা।

## টার্মিনাল খোলো

- **Windows:** Command Prompt, PowerShell বা Git Bash
- **Mac/Linux:** Terminal

তারপর লেখো:

```bash
python3 --version
```

একটা ভার্সন নাম্বার দেখাবে, যেমন `Python 3.11.5`। এটা দেখলেই বুঝবে Python রেডি আছে।

> **Windows-এ `python3` না চললে** `python --version` অথবা `py --version` লেখো — তিনটার যেকোনোটা কাজ করলেই হবে। পরের ধাপগুলোতে `python3`-এর জায়গায় সেই কমান্ডটাই ব্যবহার করো।

## কত ভার্সন লাগবে

| ভার্সন | কী হবে |
| --- | --- |
| 3.10 বা তার উপরে | ঠিক আছে |
| 3.9 বা নিচে | CrewAI চলবে না — Python আপডেট করো |
| কিছুই আসছে না | Python ইনস্টল করা নেই |

Python না থাকলে [Python Installation](/python-basic/installation) পেজ দেখে ইনস্টল করে নাও, তারপর এই ধাপে ফিরে আসো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `command not found: python3` | `python --version` ট্রাই করো; না হলে Python ইনস্টল করো |
| Windows Store খুলে যাচ্ছে | Settings → Apps → App execution aliases → `python.exe` alias বন্ধ করো |
| ভার্সন 3.9 দেখাচ্ছে | নতুন Python ইনস্টল করে টার্মিনাল আবার খোলো |
| একাধিক Python আছে | `which python3` (Mac/Linux) বা `where python` (Windows) দিয়ে পথ দেখো |

## চেকলিস্ট

- [ ] টার্মিনালে `python3 --version` (বা `python --version`) চলে
- [ ] ভার্সন **3.10+**

➡️ পরের ধাপ: [ধাপ ২ — প্রজেক্ট ফোল্ডার](/docs/project-based/project-3/step-2)
