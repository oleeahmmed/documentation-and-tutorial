---
title: "ধাপ ৮ — VIP লিস্ট ও ক্যাটাগরি-নিয়ম (Knowledge)"
description: কোন সেন্ডার সবসময় গুরুত্বপূর্ণ আর কোন শব্দ দেখলে কোন ক্যাটাগরি — লুবনার রেফারেন্স ফাইল।
icon: BookOpen
---

## লক্ষ্য

লুবনার হাতে প্রায়োরিটি-নিয়মের খাতা — VIP চেনা আর ক্যাটাগরি তাক করার রেফারেন্স।

## ফাইল বানাও

```bash
cat > knowledge/priority_rules.txt << 'EOF'
## VIP সেন্ডার লিস্ট (এই লোকদের ইমেইল সবসময় urgent হিসেবে গণ্য হবে)
- ceo@blastify.com
- bigclient@acme-corp.com
- legal@blastify.com

## ক্যাটাগরির নিয়ম
- "invoice", "payment due", "subscription renewal" শব্দ থাকলে → billing
- "unsubscribe", "newsletter", "weekly digest" থাকলে → newsletter
- অচেনা সেন্ডার থেকে লিংক/অফার/লটারি টাইপ মেসেজ → spam
- উপরের কোনোটায় না পড়লে এবং জরুরি সুর থাকলে → urgent
EOF
```

> **Windows-এ heredoc চলবে না** — এডিটরে `knowledge/priority_rules.txt` বানিয়ে একই লেখা বসাও।

## এই ফাইল কেন গুরুত্বপূর্ণ

| এখানে যা আছে | লুবনা কী করবে |
| --- | --- |
| VIP লিস্ট | প্রেরক তালিকায় থাকলে `is_vip: true` দেবে |
| billing শব্দ | ইনভয়েস/পেমেন্ট মেসেজ আলাদা করবে |
| newsletter শব্দ | নিউজলেটার/আনসাবস্ক্রাইব আলাদা করবে |
| spam সংকেত | অচেনা সেন্ডারের অফার/লটারি বাদ দেবে |
| শেষ নিয়ম | উপরের কোনোটায় না পড়লে তবেই urgent |

> **নিয়ম:** এখানে যা নেই, লুবনা সেটা ধরে নেবে না। VIP কেউ যোগ হলে বা ক্যাটাগরি-নিয়ম বদলালে এই ফাইল আপডেট করো — কোড বদলাতে হবে না।

> **স্ট্যাটিক ফাইল, লাইভ নয়:** আসল ইনবক্সে VIP লিস্ট সাধারণত পরিচিতি/CRM থেকে আসে। প্রথমে ফাইল দিয়ে flow বুঝে নাও, পরে Gmail contacts বা CRM API জোড়ো।

> **Embedding দরকার:** CrewAI knowledge ডিফল্টে OpenAI embedding ব্যবহার করে। OpenAI key ছাড়া শুধু Groq/Gemini দিয়ে চালালে এখানে এরর আসতে পারে — ধাপ ১৩-এ OpenAI key বসাও বা প্রথমে knowledge বাদ দিয়ে flow দেখো।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| ফাইল নেই | `ls knowledge` দিয়ে যাচাই করো |
| knowledge খুঁজছে না | `crew.py`-তে `file_paths=["priority_rules.txt"]` মিলাও |
| VIP চিনছে না | লিস্টে ইমেইলটা হুবহু (স্পেস ছাড়া) আছে কিনা দেখো |
| embedding এরর | OpenAI key দাও |

## চেকলিস্ট

- [ ] `knowledge/priority_rules.txt` তৈরি
- [ ] VIP লিস্ট + চারটা ক্যাটাগরি-নিয়ম

➡️ পরের ধাপ: [ধাপ ৯ — ডাইজেস্ট টুল](/docs/project-based/project-7/step-9)
