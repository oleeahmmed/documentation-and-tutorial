---
title: Installation
description: Install CrewAI with pip or uv and set up your API key.
icon: Download
---

CrewAI ইনস্টল করার দুইটা উপায় আছে — একটা সহজ (`pip` দিয়ে, যারা নতুন তাদের জন্য ভালো), আরেকটা অফিসিয়াল রেকমেন্ডেড উপায় (`uv` দিয়ে)।

## উপায় ১: সহজ পদ্ধতি (`pip` দিয়ে)

```bash
pip install crewai
```

অতিরিক্ত Tool-গুলো (যেমন সার্চ, স্ক্র্যাপিং) ব্যবহার করতে চাইলে:

```bash
pip install 'crewai[tools]'
```

এই পদ্ধতিতে তুমি নিজে সরাসরি Python ফাইল লিখে কোড চালাতে পারবে — আমরা আগের সব টিউটোরিয়ালে এই পদ্ধতিই ব্যবহার করেছি।

## উপায় ২: অফিসিয়াল রেকমেন্ডেড পদ্ধতি (`uv` দিয়ে)

CrewAI নিজে `uv` নামের একটা প্যাকেজ-ম্যানেজার ব্যবহারের পরামর্শ দেয়, কারণ এটা দ্রুত আর প্রজেক্ট-ম্যানেজমেন্ট সহজ করে।

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

**গুরুত্বপূর্ণ:** API key কখনো সরাসরি কোডে লিখো না — সবসময় `.env` ফাইলে রাখো, যাতে ভুলেও কারো সাথে শেয়ার না হয়ে যায়।
