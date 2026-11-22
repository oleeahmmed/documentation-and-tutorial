---
title: AI & Machine Learning
description: ছবি তৈরি, ভিশন প্রসেসিং ও RAG সিস্টেমের টুল।
icon: Brain
---

ছবি তৈরি, ভিশন প্রসেসিং, RAG সিস্টেম।

| Tool | কাজ |
| --- | --- |
| `DallETool` | OpenAI DALL-E দিয়ে ছবি তৈরি করা |
| `VisionTool` | ছবি বিশ্লেষণ করা (computer vision) |
| `AIMindTool` | অ্যাডভান্সড AI রিজনিং ও সিদ্ধান্ত-গ্রহণ |
| `LlamaIndexTool` | LlamaIndex দিয়ে knowledge base বানানো |
| `RagTool` | কাস্টম knowledge-এ Retrieval-Augmented Generation |

**উদাহরণ:**

```python
from crewai_tools import DallETool, VisionTool

image_generator = DallETool()
vision_processor = VisionTool()

agent = Agent(
    role="AI স্পেশালিস্ট",
    goal="ছবি তৈরি ও বিশ্লেষণ করা",
    backstory="তুমি AI-ভিত্তিক কাজে দক্ষ।",
    tools=[image_generator, vision_processor],
)
```

> **`CodeInterpreterTool` সরিয়ে দেওয়া হয়েছে।** সহজ হিসাব Agent নিজেই করতে পারে; সত্যিকারের কোড চালাতে হলে sandbox টুল ব্যবহার করো — `E2BPythonTool`/`E2BExecTool` (E2B) বা `DaytonaPythonTool` (Daytona)।
>
> `DallETool`, `VisionTool` ও `RagTool`-এর জন্য `.env`-এ `OPENAI_API_KEY` লাগে।
