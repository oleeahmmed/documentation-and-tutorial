---
title: "ধাপ ৩ — venv (আলাদা ঘর)"
description: প্রজেক্টের জন্য আলাদা Python পরিবেশ — অন্য প্রজেক্টের লাইব্রেরির সাথে গোলমাল হবে না।
icon: Box
---

## লক্ষ্য

এই প্রজেক্টের নিজস্ব virtual environment বানানো আর সেটা চালু করা।

## venv বানাও

```bash
python3 -m venv venv
```

**কেন লাগে এটা?** তোমার কম্পিউটারে হয়তো অন্য প্রজেক্টও থাকবে, যেগুলোর অন্য লাইব্রেরি লাগবে। `venv` একটা আলাদা, বন্ধ ঘরের মতো — এই ঘরের ভেতরে যা ইনস্টল করবে, সেটা শুধু এই প্রজেক্টের জন্যই থাকবে, বাকি কম্পিউটারে প্রভাব ফেলবে না।

এবার এই "ঘরে" ঢুকতে হবে (activate করতে হবে):

```bash
source venv/bin/activate        # Windows হলে: venv\Scripts\activate
```

এটা চালানোর পর টার্মিনালের শুরুতে `(venv)` লেখা দেখবে — মানে তুমি এখন সেই আলাদা ঘরের ভেতরে।

## কোন শেলে কোন কমান্ড

| শেল | venv বানানো | চালু করা |
| --- | --- | --- |
| macOS / Linux / Git Bash | `python3 -m venv venv` | `source venv/bin/activate` |
| Windows — Git Bash | `python -m venv venv` | `source venv/Scripts/activate` |
| Windows — PowerShell | `python -m venv venv` | `venv\Scripts\Activate.ps1` |
| Windows — CMD | `python -m venv venv` | `venv\Scripts\activate` |

> বের হওয়ার দরকার হলে `deactivate` লেখো। টার্মিনাল নতুন করে খুললে প্রতিবার আবার activate করতে হবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| PowerShell-এ Activate.ps1 ব্লক | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` চালিয়ে আবার চেষ্টা করো |
| `(venv)` দেখা যাচ্ছে না | activate কমান্ডটা সঠিক শেলে দিয়েছ কিনা দেখো; প্রম্পটের আগে লেখাটা খেয়াল করো |
| `No module named venv` | Python ইনস্টলটা ভাঙা — নতুন করে ইনস্টল করো (Linux-এ `python3-venv` প্যাকেজ লাগতে পারে) |
| `command not found: source` | CMD-তে আছো — `venv\Scripts\activate` ব্যবহার করো |

## চেকলিস্ট

- [ ] `venv` ফোল্ডার তৈরি
- [ ] activate করা হয়েছে, প্রম্পটে `(venv)`

➡️ পরের ধাপ: [ধাপ ৪ — CrewAI ইনস্টল](/docs/project-based/project-3/step-4)
