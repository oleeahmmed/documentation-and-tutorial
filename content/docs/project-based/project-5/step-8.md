---
title: "ধাপ ৮ — চার্ট-অফ-অ্যাকাউন্টস (Knowledge)"
description: কোন খরচ কোন খাতে পড়বে আর কত টাকার বেশি হলে রিভিউ লাগবে — ফাহিমের রেফারেন্স ফাইল।
icon: BookOpen
---

## লক্ষ্য

ফাহিমের হাতে কোম্পানির খাতের তালিকা — যেখান থেকে ক্যাটাগরি ঠিক করবে।

## ফাইল বানাও

```bash
cat > knowledge/chart_of_accounts.txt << 'EOF'
## Blastify Chart of Accounts

- AWS, Google Cloud, হোস্টিং, ডোমেইন → Cloud & Hosting
- Adobe, Figma, SaaS টুল সাবস্ক্রিপশন → Software Subscriptions
- অফিস স্টেশনারি, প্রিন্টার কালি, ফার্নিচার → Office Supplies
- বিদ্যুৎ, ইন্টারনেট, পানি বিল → Utilities
- ফ্রিল্যান্সার/কন্ট্র্যাক্টর পেমেন্ট → Contractor Payments
- উপরের কোনোটায় না মিললে → UNCATEGORIZED (মানুষ অ্যাকাউন্ট্যান্ট রিভিউ করবে)

## অনুমোদনের নিয়ম
- ৫০,০০০ টাকার বেশি যেকোনো খরচ ফাইন্যান্স ম্যানেজারের রিভিউ দরকার
EOF
```

> **Windows-এ heredoc চলবে না** — এডিটরে `knowledge/chart_of_accounts.txt` বানিয়ে একই লেখা বসাও।

## এই ফাইল কেন গুরুত্বপূর্ণ

| এখানে যা আছে | ফাহিম কী করবে |
| --- | --- |
| খাতের তালিকা | ভেন্ডর/বিবরণ মিলিয়ে সবচেয়ে কাছের খাত বাছবে |
| `UNCATEGORIZED` fallback | না মিললে জোর করে খাত বানাবে না |
| ৫০,০০০ টাকার নিয়ম | বড় অঙ্কে `needs_review: true` দেবে |

> **নিয়ম:** এখানে যা নেই, ফাহিম সেটা ঠিক করবে না। নতুন খাত/সীমা দরকার হলে এই ফাইল আপডেট করো — কোড বদলাতে হবে না।

> **Embedding দরকার:** CrewAI knowledge ডিফল্টে OpenAI embedding ব্যবহার করে। OpenAI key ছাড়া শুধু Groq/Gemini দিয়ে চালালে এখানে এরর আসতে পারে — ধাপ ১৩-এ OpenAI key বসাও বা প্রথমে knowledge বাদ দিয়ে flow দেখো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| ফাইল নেই | `ls knowledge` দিয়ে যাচাই করো |
| knowledge খুঁজছে না | `crew.py`-তে `file_paths=["chart_of_accounts.txt"]` মিলাও |
| embedding এরর | OpenAI key দাও |

## চেকলিস্ট

- [ ] `knowledge/chart_of_accounts.txt` তৈরি
- [ ] পাঁচটা খাত + `UNCATEGORIZED` + অনুমোদনের নিয়ম

➡️ পরের ধাপ: [ধাপ ৯ — লেজার টুল](/docs/project-based/project-5/step-9)
