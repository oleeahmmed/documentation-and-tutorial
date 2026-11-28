---
title: "ধাপ ৩ — venv বানাও"
description: এই প্রজেক্টের আলাদা Python পরিবেশ — বাকি কম্পিউটারে কোনো প্রভাব নেই।
icon: Box
---

## লক্ষ্য

প্রজেক্টের নিজস্ব virtual environment বানিয়ে activate করা।

## কমান্ড

```bash
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

`(venv)` দেখলে বুঝবে তুমি আলাদা ঘরের ভেতরে ঢুকেছো।

## কোন শেলে কোন কমান্ড

| শেল | চালু করা |
| --- | --- |
| macOS / Linux / Git Bash | `source venv/bin/activate` |
| Windows — Git Bash | `source venv/Scripts/activate` |
| Windows — PowerShell | `venv\Scripts\Activate.ps1` |
| Windows — CMD | `venv\Scripts\activate` |

> টার্মিনাল নতুন করে খুললে প্রতিবার আবার activate করতে হবে। বের হতে `deactivate`।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| PowerShell-এ স্ক্রিপ্ট ব্লক | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `(venv)` দেখা যাচ্ছে না | activate কমান্ডটা এই শেলের জন্য ঠিক কিনা দেখো |
| `No module named venv` | Python নতুন করে ইনস্টল করো |

## চেকলিস্ট

- [ ] `venv` ফোল্ডার তৈরি
- [ ] প্রম্পটে `(venv)`

➡️ পরের ধাপ: [ধাপ ৪ — CrewAI ইনস্টল](/docs/project-based/project-6/step-4)
