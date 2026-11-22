---
title: Files
description: Read, write, and manage files from agents.
icon: FileText
---

> এই পেজটা [Checkpointing](/docs/core-concepts/checkpointing) পেজের ধারাবাহিকতা — এখন ফাইল নিয়ে গল্পের পালা।

## ধাপ ১৯: Files

### বাস্তব গল্প (রূপসী ফ্যাশন)

রফিক সবসময় শুধু লেখা তথ্য নিয়ে কাজ করতো — কিন্তু বাজার তো শুধু লেখায় থাকে না। গত বছরের ঈদ-রিপোর্ট একটা PDF-এ আছে, আর দোকানদাররা নতুন ডিজাইনের ছবি পাঠায়।

করিম ভাই এবার রফিককে দুটো জিনিস ধরিয়ে দিলেন — গত বছরের **রিপোর্ট PDF** আর একটা **রেফারেন্স ছবি** — আর বললেন:

> “এই রিপোর্ট আর ছবিটা দেখে এবারের ট্রেন্ড বের করো। শুধু লেখা পড়ে নয়, ছবিটা দেখেও বুঝো।”

সুমনের জন্যও তিনি বিদেশি ডিজাইনারদের কিছু ছবি রাখলেন, যাতে ডিজাইন করার সময় দেখে অনুপ্রেরণা নিতে পারে।

### CrewAI-তে এই একই জিনিস

এই “Agent-কে সরাসরি ছবি/PDF/অডিও/ভিডিও/টেক্সট ফাইল দেওয়া”-কে CrewAI-তে বলা হয় **Files**। ফাইলগুলো মডেলের কাছে নিজের ফরম্যাটে পাঠানো হয়, তোমাকে ম্যানুয়ালি base64 বা আপলোড সামলাতে হয় না।

ফিচারটা ব্যবহার করতে `file-processing` এক্সট্রা ইনস্টল করতে হয়:

```bash
pip install 'crewai[file-processing]'
```

### কোড (রফিকের Task-এ ফাইল যোগ হলো)

```python
from crewai import Task
from crewai_files import ImageFile, PDFFile

trend_task = Task(
    description=(
        "সংযুক্ত রিপোর্ট {last_year_report} আর ছবি {reference_photo} দেখে "
        "এই বছরের শীতকালীন ট্রেন্ড বের করো, গত বছরের সাথে তুলনা করে।"
    ),
    expected_output="৫-৬টা ট্রেন্ড, গত বছরের সাথে তুলনা করে।",
    agent=researcher,
    input_files={
        "last_year_report": PDFFile(source="./last_year_eid_trends.pdf"),
        "reference_photo": ImageFile(source="./references/woolen_coat.png"),
    }
)
```

সুমনের Task-এও একইভাবে মড-বোর্ডের ছবি দেওয়া যায়:

```python
design_task = Task(
    description="মড-বোর্ডের ছবি {moodboard} দেখে ৩টা ডিজাইন আইডিয়া বানাও।",
    expected_output="৩টা ডিজাইন আইডিয়া।",
    agent=designer,
    context=[research_task],
    input_files={
        "moodboard": ImageFile(source="./references/moodboard.png"),
    }
)
```

### কোন কোন ফাইল দেওয়া যায়

| ধরন | ক্লাস | রূপসী ফ্যাশনে |
| --- | --- | --- |
| ছবি | `ImageFile` | নতুন ডিজাইনের ছবি, মড-বোর্ড, স্ক্রিনশট |
| PDF | `PDFFile` | গত বছরের রিপোর্ট, সাপ্লায়ারের ক্যাটালগ |
| অডিও | `AudioFile` | দোকানদারের ভয়েস নোট, মিটিং রেকর্ডিং |
| ভিডিও | `VideoFile` | ফ্যাশন শো-এর ভিডিও |
| টেক্সট | `TextFile` | পুরোনো নোট, CSV ডেটা |

`File(source="...")` দিলে ধরনটা নিজে থেকেই ধরা হয়। আর ফাইল `Task`, `Crew` বা Flow — যেকোনো স্তরে দেওয়া যায়; একই নামে একাধিক জায়গায় দিলে Task-এর ফাইলটাই আগে চলবে।

**লক্ষ্য রাখবে:** সব মডেল সব ধরনের ফাইল পড়তে পারে না — যেমন ভিডিওর জন্য সবচেয়ে ভালো সাপোর্ট Gemini-তে। যে ধরন সাপোর্ট করে না, সেটা পাঠালে `UnsupportedFileTypeError` আসবে।

### Files বনাম Tools

- **Files** — মডেলকে সরাসরি ফাইল দেখানো/পড়ানো (ছবি, PDF ইত্যাদি)
- **Tools** — Agent নিজে যখন দরকার মনে করে ফাইল খোলে (`FileReadTool`, `DirectoryReadTool`) বা ফাইলে লেখে

দুটোই একসাথে ব্যবহার করা যায় — Files দিয়ে শুরুতে রেফারেন্স দেওয়া, আর Tools দিয়ে কাজের মাঝে পুরোনো ফাইল খোঁজা।

### পরের ধাপ

- [Artifacts](/docs/core-concepts/artifacts) — কাজের ফলাফল ভার্সন-সহ ফাইলে সেভ করা
- [Checkpointing](/docs/core-concepts/checkpointing) — আগের ধাপে ফিরে যেতে চাইলে
