---
title: Installation
description: venv বানিয়ে pip বা uv দিয়ে CrewAI ইনস্টল করো, আর API key সেট করো।
icon: Download
---

CrewAI ইনস্টল করার আগে একটা Virtual Environment (venv) বানিয়ে নাও — এতে প্রজেক্টের প্যাকেজগুলো আলাদা থাকে, সিস্টেমের Python নষ্ট হয় না। Python ভার্সন **3.10 থেকে 3.13**-এর মধ্যে হতে হবে।

## ধাপ ০: Virtual Environment (venv) বানাও

প্রজেক্ট ফোল্ডার বানাও, তার ভেতরে ঢুকে venv তৈরি করো, তারপর অ্যাক্টিভেট করো।

**Windows (CMD / PowerShell):**

```powershell
mkdir my_crew_project
cd my_crew_project
python -m venv .venv
.venv\Scripts\activate
```

**macOS / Linux:**

```bash
mkdir my_crew_project
cd my_crew_project
python3 -m venv .venv
source .venv/bin/activate
```

অ্যাক্টিভেট হলে টার্মিনালের শুরুতে `(.venv)` দেখতে পাবে:

```text
(.venv) C:\Users\you\my_crew_project>
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

> প্রতিবার নতুন টার্মিনাল খুললে আবার venv অ্যাক্টিভেট করতে হবে। VS Code-এ Python interpreter হিসেবে `.venv` সিলেক্ট করে নাও। `.venv` ফোল্ডার কখনো Git-এ commit করো না।

> Windows PowerShell-এ "running scripts is disabled" এলে একবার `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` চালিয়ে আবার অ্যাক্টিভেট করো।

## উপায় ১: সহজ পদ্ধতি (`pip` দিয়ে)

venv অ্যাক্টিভেট করা অবস্থায় প্রথমে pip আপডেট করে নাও:

```bash
python -m pip install --upgrade pip
pip install crewai
```

অতিরিক্ত Tool-গুলো (যেমন সার্চ, স্ক্র্যাপিং) ব্যবহার করতে চাইলে:

```bash
pip install 'crewai[tools]'
```

এই পদ্ধতিতে তুমি নিজে সরাসরি Python ফাইল লিখে কোড চালাতে পারবে — আমরা আগের সব টিউটোরিয়ালে এই পদ্ধতিই ব্যবহার করেছি।

## উপায় ২: অফিসিয়াল রেকমেন্ডেড পদ্ধতি (`uv` দিয়ে)

CrewAI নিজে `uv` নামের একটা প্যাকেজ-ম্যানেজার ব্যবহারের পরামর্শ দেয়, কারণ এটা দ্রুত আর প্রজেক্ট-ম্যানেজমেন্ট সহজ করে। `uv` নিজেই আলাদা environment বানিয়ে রাখে — তাই এই পদ্ধতিতে হাতে venv বানাতে হয় না।

**ধাপ ১ — `uv` ইনস্টল করো:**

macOS/Linux-এ:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Windows-এ (PowerShell):

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**ধাপ ২ — CrewAI CLI ইনস্টল করো:**

```bash
uv tool install crewai
```

যাচাই করো ঠিকমতো ইনস্টল হয়েছে কিনা:

```bash
uv tool list
```

দেখতে পাবে এরকম কিছু:

```text
crewai v0.x.x
- crewai
```

**ভবিষ্যতে আপডেট করতে চাইলে:**

```bash
uv tool install crewai --upgrade
```

## `.env` ফাইল বানাও

যেকোনো পদ্ধতিতেই, তোমার প্রজেক্ট ফোল্ডারে একটা `.env` ফাইল বানাও, যেখানে তোমার API key থাকবে:

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
```

**গুরুত্বপূর্ণ:** API key কখনো সরাসরি কোডে লিখো না — সবসময় `.env` ফাইলে রাখো, যাতে ভুলেও কারো সাথে শেয়ার না হয়ে যায়। `.env` ফাইলও Git-এ commit করো না।
