---
title: "ধাপ ১ — Python চেক করো"
description: Order-Notify এজেন্ট বানানোর আগে টার্মিনালে Python আছে কিনা দেখে নাও।
icon: Terminal
---

## লক্ষ্য

Python ইনস্টল আছে কিনা আর ভার্সন 3.10+ কিনা নিশ্চিত করা।

## কমান্ড

```bash
python3 --version
```

`Python 3.11.5`-এর মতো একটা আউটপুট দেখলে ঠিক আছে। Windows-এ `python3` না চললে `python --version` বা `py --version` ব্যবহার করো।

> Python নেই বা পুরোনো? [Python Installation](/python-basic/installation) দেখে 3.10+ ইনস্টল করো, তারপর ফিরে আসো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `command not found` | `python --version` ট্রাই করো; না হলে Python ইনস্টল করো |
| ভার্সন 3.9 বা নিচে | নতুন Python ইনস্টল করে টার্মিনাল আবার খোলো |
| Windows Store খুলছে | App execution aliases থেকে `python.exe` alias বন্ধ করো |

## চেকলিস্ট

- [ ] `python3 --version` চলে, ভার্সন **3.10+**

➡️ পরের ধাপ: [ধাপ ২ — ফোল্ডার](/docs/project-based/project-9/step-2)
