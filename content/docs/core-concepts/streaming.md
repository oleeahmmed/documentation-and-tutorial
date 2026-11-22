---
title: Streaming
description: Stream agent output and events in real time.
icon: Radio
---

> এই পেজটা [Flows](/docs/core-concepts/flows) পেজের ধারাবাহিকতা — পুরো প্রক্রিয়া এখন একটা Flow-এ সাজানো হয়েছে ধরে নেওয়া হয়েছে।

## ধাপ ১৬: Streaming

### বাস্তব গল্প (রূপসী ফ্যাশন)

করিম ভাই একদিন নাদিয়ার পাশে বসে কাজ দেখছিলেন। নাদিয়া পোস্ট লিখছে, আর করিম ভাই পুরো লেখা শেষ না হওয়া পর্যন্ত অপেক্ষা না করে, **নাদিয়া লিখতে লিখতেই** একেকটা শব্দ দেখতে পাচ্ছেন স্ক্রিনে বা কাগজে — ঠিক যেমন কেউ সামনে বসে টাইপ করলে তুমি প্রতিটা অক্ষর ভেসে উঠতে দেখো।

### CrewAI-তে এই একই জিনিস

এই “লেখা শেষ হওয়ার আগেই ধাপে ধাপে দেখতে পাওয়া” সুবিধাটাকেই বলা হয় **Streaming**।

### কোড (`Crew`-তে পরিবর্তন)

```python
fashion_crew = Crew(
    agents=[researcher, designer, marketer],
    tasks=[research_task, design_task, marketing_task],
    process=Process.sequential,
    memory=True,
    stream=True   # 👈 নতুন যোগ হলো
)

streaming = fashion_crew.kickoff(inputs={"topic": "ঈদ ফ্যাশন কালেকশন ২০২৭"})

for chunk in streaming:
    print(chunk.content, end="", flush=True)

result = streaming.result
print("\n\nফাইনাল আউটপুট:", result.raw)
```

### বাস্তবে কী ঘটে

`stream=True` ছাড়া, তুমি শুধু পুরো কাজ শেষ হওয়ার পরই ফলাফল দেখতে পেতে। এখন টার্মিনালে এরকম কিছু দেখা যাবে — একটা একটা করে শব্দ ভেসে উঠবে, যেন নাদিয়া সরাসরি সামনে বসে টাইপ করছে:

```text
🎉... ঈদের... রঙিন... আনন্দে... রূপসী... ফ্যাশনের... নতুন...
কালেকশন... নিয়ে... হাজির... হলাম...
```

আর পুরো কাজ শেষে, `streaming.result.raw`-এ সম্পূর্ণ ফাইনাল আউটপুট পাওয়া যায়:

```text
ফাইনাল আউটপুট: 🎉 ঈদের রঙিন আনন্দে রূপসী ফ্যাশনের নতুন কালেকশন নিয়ে হাজির হলাম...
```

**লক্ষ্য রাখবে:** `streaming.result` পড়ার আগে পুরো `for chunk in streaming:` লুপটা শেষ করতে হয় — মাঝপথে ফলাফল পড়তে চাইলে error আসবে, কারণ তখনো লেখা তৈরি হতে থাকতে পারে।

### পরের ধাপ

- [Event Listeners](/docs/core-concepts/event-listeners) — প্রতিটা গুরুত্বপূর্ণ মুহূর্তে নিজে থেকে নোটিফিকেশন পাওয়া
- [Flows](/docs/core-concepts/flows) — আগের ধাপে ফিরে যেতে চাইলে
