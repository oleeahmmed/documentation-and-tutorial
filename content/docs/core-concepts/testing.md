---
title: Testing
description: Test agents, tasks, and crews with confidence.
icon: FlaskConical
---

> এই পেজটা [Training](/docs/core-concepts/training) পেজের ধারাবাহিকতা — ট্রেনিং শেষ, এখন পুরো টিমের মান মাপার পালা।

## ধাপ ১৪: Testing

### বাস্তব গল্প (রূপসী ফ্যাশন)

কয়েক মাস পর, করিম ভাই জানতে চাইলেন — পুরো টিম (রফিক + সুমন + নাদিয়া) মিলে কেমন কাজ করছে? তিনি একটা পরীক্ষা নিতে চাইলেন — একই কাজ কয়েকবার করিয়ে দেখবেন, আর প্রতিবারের মান বিচার করবেন, যাতে বোঝা যায় টিমটা নির্ভরযোগ্য কিনা।

### CrewAI-তে এই একই জিনিস

এই “টিমের মান পরীক্ষা” ফিচারটাকেই বলা হয় **Testing**।

### কোড (CLI দিয়ে)

```bash
crewai test -n 2 -m gpt-4o
```

এখানে `-n 2` মানে পুরো Crew দুইবার চালিয়ে দেখবে, `-m gpt-4o` মানে এই পরীক্ষা-মূল্যায়ন করার জন্য কোন মডেল ব্যবহার হবে।

### বাস্তবে কী ঘটে

```text
Tasks/Crew/Agents                  Run 1   Run 2   Avg. Total
research_task (বাজার গবেষক)         9.0     9.5       9.2
design_task (ফ্যাশন ডিজাইনার)        9.0    10.0       9.5
marketing_task (মার্কেটিং লেখক)       9.0     9.0       9.0
Crew                                9.0     9.5       9.2
Execution Time (সেকেন্ড)             126     145       135
```

প্রতিটা Task এবং পুরো Crew-কে ১-১০ স্কেলে স্কোর দেওয়া হয়, যাতে করিম ভাই বুঝতে পারেন — টিম গড়ে কতটা ভালো কাজ করছে, কোথাও দুর্বলতা আছে কিনা (যেমন দেখা যাচ্ছে `marketing_task`-এর স্কোর তুলনামূলক কম, তাই নাদিয়ার কাজে আরও মনোযোগ দেওয়া দরকার হতে পারে)।

## এই পর্যন্ত কভার হওয়া টপিকগুলোর সারসংক্ষেপ

```text
করিম ভাই রফিক-সুমন-নাদিয়াকে আলাদা মস্তিষ্ক (LLM) দিলেন
    ↓
টিমের কাজের অভিজ্ঞতা মাসের পর মাস মনে থেকে যাচ্ছে (Memory)
    ↓
সুমন এখন আগে পরিকল্পনা করে কাজ করে (Reasoning/Planning)
    ↓
করিম ভাই সুমনকে বিশেষভাবে প্রশিক্ষণ দিলেন (Training)
    ↓
পুরো টিমের মান নিয়মিত পরীক্ষা করা হচ্ছে (Testing)
```

এই অংশে আমরা **LLMs, Memory, Reasoning/Planning, Training, Testing** — এই পাঁচটা টপিক দেখলাম।

### পরের ধাপ

গল্পের পরের অংশ এখান থেকেই শুরু:

- [Flows](/docs/core-concepts/flows) — Crew-এর কাজ + নিজের কোড-সিদ্ধান্ত একসাথে
- [Streaming](/docs/core-concepts/streaming) — লাইভ আউটপুট দেখা
- [Event Listeners](/docs/core-concepts/event-listeners) — নিজে থেকে নোটিফিকেশন
- [Checkpointing](/docs/core-concepts/checkpointing) — বিদ্যুৎ গেলেও কাজ না হারানো
- [Files](/docs/core-concepts/files) ও [Artifacts](/docs/core-concepts/artifacts) — ফাইল ইনপুট আর স্থায়ী ফলাফল
- [CLI](/docs/core-concepts/cli) — গোছানো প্রজেক্ট কাঠামো
- [Production Architecture](/docs/core-concepts/production-architecture) — সব মিলিয়ে টেকসই সিস্টেম
