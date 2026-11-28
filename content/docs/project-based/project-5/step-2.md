---
title: "ধাপ ২ — ফোল্ডার বানাও"
description: blastify_invoice_agent — অ্যাকাউন্টস এজেন্টের সব ফাইল থাকবে এই এক ফোল্ডারে।
icon: FolderPlus
---

## লক্ষ্য

নতুন প্রজেক্ট ফোল্ডার বানিয়ে তার ভেতরে ঢোকা।

## কমান্ড

```bash
mkdir blastify_invoice_agent
cd blastify_invoice_agent
```

এই ফোল্ডারই তোমার "অফিস" — venv, প্রজেক্ট স্ট্রাকচার আর লেজার ফাইল এখানেই থাকবে।

> ফোল্ডারের নামে স্পেস দিও না। আগের প্রজেক্টের সাথে গুলিয়ে না ফেলতে নামটা আলাদা রাখা হয়েছে (`blastify_leadgen_agent` নয়, `blastify_invoice_agent`)।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `File exists` | `cd blastify_invoice_agent` দিয়ে ঢুকে এগোও |
| `Permission denied` | Documents/home-এর মতো লেখার জায়গায় ফোল্ডার বানাও |

## চেকলিস্ট

- [ ] `blastify_invoice_agent` ফোল্ডার তৈরি
- [ ] ভেতরে ঢোকা হয়েছে

➡️ পরের ধাপ: [ধাপ ৩ — venv](/docs/project-based/project-5/step-3)
