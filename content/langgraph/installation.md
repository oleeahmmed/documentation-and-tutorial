---
title: "ধাপ ১: ইনস্টল করো"
description: venv বানিয়ে LangGraph ইনস্টল — প্রথম ধাপ, কোনো API key লাগবে না।
icon: Download
---

## গল্প

দোকান খোলার আগে যা লাগে: একটা ঘর (ফোল্ডার), আলাদা হিসাবের খাতা (venv), আর দোকানের যন্ত্র (LangGraph)। এই ধাপ শেষ হলে তুমি তৈরি।

## কোড

টার্মিনালে এক এক করে চালাও:

```bash
# ১) প্রজেক্টের জন্য একটা ফোল্ডার বানাও
mkdir ruposhi

# ২) ফোল্ডারের ভেতরে ঢোকো
cd ruposhi

# ৩) আলাদা পাইথন পরিবেশ (venv) বানাও, যাতে অন্য প্রজেক্টের সাথে গোলমাল না হয়
python -m venv venv
```

তারপর venv চালু করো — নিজের অপারেটিং সিস্টেম অনুযায়ী একটা লাইন:

```bash
# Git Bash / macOS / Linux
source venv/bin/activate

# Windows PowerShell
venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate
```

শেষে LangGraph ইনস্টল করো:

```bash
pip install langgraph
```

## বাস্তবে কী ঘটে

ঠিকমতো হলো কি না দেখতে চালাও:

```bash
python -c "import langgraph; print('ঠিক আছে')"
```

```text
ঠিক আছে
```

`ঠিক আছে` লেখা এলেই বুঝবে ইনস্টল ঠিকঠাক। প্রম্পটের শুরুতে `(venv)` দেখলে বোঝবে venv চালু আছে।

## মনে রাখো

- venv মানে এই প্রজেক্টের জন্য আলাদা প্যাকেজের ঝুড়ি — অন্য প্রজেক্টের ভার্সন এখানে গোলমাল করবে না
- প্রতিবার নতুন টার্মিনাল খুললে venv আবার চালু করতে হবে
- ধাপ ৯-এ LLM যোগ করার সময় আলাদা প্যাকেজ লাগবে — সেটা ওই পেজেই বলা আছে

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `python` পাওয়া যাচ্ছে না | Python ইনস্টল করে PATH-এ যোগ করো, বা `py` কমান্ড দিয়ে চেষ্টা করো |
| PowerShell-এ activation বন্ধ | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` চালিয়ে আবার চেষ্টা করো |
| `pip` পাওয়া যাচ্ছে না | `python -m pip install langgraph` দিয়ে চালাও |

পরের ধাপে [একদম ছোট গ্রাফ](/langgraph/first-graph) — একজন কর্মচারী দিয়ে দোকান খুলি।
