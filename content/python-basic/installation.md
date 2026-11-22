---
title: Installation
description: Python ইনস্টল করে venv বানাও — প্র্যাকটিস শুরুর আগে দরকারি সেটআপ।
icon: Download
---

Python দিয়ে কাজ শুরু করার আগে দুটো জিনিস দরকার — Python নিজে, আর একটা Virtual Environment (venv)। venv হলে প্রজেক্টের প্যাকেজগুলো আলাদা একটা বাক্সে থাকে, সিস্টেমের Python নষ্ট হয় না।

## ধাপ ১: Python ইনস্টল করো

[python.org](https://python.org) থেকে Python **3.10 বা তার পরের ভার্সন** ইনস্টল করো। Windows-এ ইনস্টলার চালানোর সময় **"Add Python to PATH"** চেকবক্সে টিক দাও।

ভার্সন যাচাই করো:

```bash
python3 --version   # macOS / Linux
python --version    # Windows
```

দেখতে পাবে এরকম কিছু:

```text
Python 3.12.4
```

## ধাপ ২: venv বানাও

প্র্যাকটিসের জন্য একটা ফোল্ডার বানাও, তার ভেতরে ঢুকে venv তৈরি করো, তারপর অ্যাক্টিভেট করো।

**Windows (CMD / PowerShell):**

```powershell
mkdir python_practice
cd python_practice
python -m venv .venv
.venv\Scripts\activate
```

**macOS / Linux:**

```bash
mkdir python_practice
cd python_practice
python3 -m venv .venv
source .venv/bin/activate
```

অ্যাক্টিভেট হলে টার্মিনালের শুরুতে `(.venv)` দেখতে পাবে:

```text
(.venv) C:\Users\you\python_practice>
```

| কাজ | Windows | macOS / Linux |
| --- | --- | --- |
| venv বানানো | `python -m venv .venv` | `python3 -m venv .venv` |
| অ্যাক্টিভেট | `.venv\Scripts\activate` | `source .venv/bin/activate` |
| বন্ধ করা | `deactivate` | `deactivate` |

**যাচাই করো:**

```bash
python --version
pip --version
```

> প্রতিবার নতুন টার্মিনাল খুললে আবার venv অ্যাক্টিভেট করতে হবে। VS Code-এ Python interpreter হিসেবে `.venv` সিলেক্ট করে নাও, আর `.venv` ফোল্ডার কখনো Git-এ commit করো না।

> Windows PowerShell-এ "running scripts is disabled" এলে একবার `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` চালিয়ে আবার অ্যাক্টিভেট করো।

## ধাপ ৩: প্রথম ফাইল চালাও

ফোল্ডারে `hello.py` নামে একটা ফাইল বানাও:

```python
name = "করিম"
print(f"স্বাগতম, {name}!")
```

চালাও:

```bash
python hello.py
```

আউটপুট:

```text
স্বাগতম, করিম!
```

এখন কাজের পরিবেশ তৈরি — [Variables ও Data Types](/python-basic/variables-data-types) থেকে শুরু করো।
