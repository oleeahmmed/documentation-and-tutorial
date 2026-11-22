---
title: Checkpointing
description: Save and resume execution state.
icon: Save
---

> এই পেজটা [Event Listeners](/docs/core-concepts/event-listeners) পেজের ধারাবাহিকতা — নোটিফিকেশনের ব্যবস্থা হয়ে গেছে, এবার কাজ না হারানোর ব্যবস্থা।

## ধাপ ১৮: Checkpointing

### বাস্তব গল্প (রূপসী ফ্যাশন)

একদিন রফিক-সুমন-নাদিয়া কাজ করছিলো। রফিকের কাজ শেষ হলো, সুমন ডিজাইন বানানো শুরু করেছে — এমন সময় **হঠাৎ বিদ্যুৎ চলে গেলো**।

করিম ভাই চিন্তিত হলেন — “এখন কি রফিককে আবার প্রথম থেকে কাজ করতে হবে?”

কিন্তু করিম ভাই আগে থেকেই একটা ব্যবস্থা করে রেখেছিলেন — প্রতিটা কর্মীর কাজ শেষ হওয়ার সাথে সাথে তার ফলাফল একটা খাতায় **লিখে রাখা হতো**, যাতে বিদ্যুৎ চলে গেলেও যেটুকু কাজ হয়ে গেছে তা হারিয়ে না যায়।

> “বিদ্যুৎ ফিরে এলে, রফিকের কাজ আবার করার দরকার নেই — তার লেখা খাতায় তো আছেই। সুমন সরাসরি সেখান থেকে শুরু করবে।”

### CrewAI-তে এই একই জিনিস

এই “কাজের অগ্রগতি মাঝেমধ্যে খাতায় লিখে রাখা, যাতে বিপর্যয়ের পরেও আবার শুরু করা যায়” ব্যবস্থাটাকেই CrewAI-তে বলা হয় **Checkpointing**।

### কোড (`Crew`-তে পরিবর্তন)

```python
from crewai import Crew, CheckpointConfig

fashion_crew = Crew(
    agents=[researcher, designer, marketer],
    tasks=[research_task, design_task, marketing_task],
    process=Process.sequential,
    memory=True,
    checkpoint=CheckpointConfig(
        location="./my_checkpoints",   # 👈 কোথায় "খাতা" রাখা হবে
        on_events=["task_completed"]   # 👈 কখন লেখা হবে — প্রতিটা Task শেষ হলেই
    )
)
```

### বাস্তবে কী ঘটে

```text
research_task শেষ হলো
→ ./my_checkpoints/ ফোল্ডারে একটা checkpoint ফাইল তৈরি হলো
   (যেমন: 2026-11-22_abc123.json), যেখানে রফিকের পুরো output সেভ আছে

design_task শুরু হলো, কিন্তু মাঝপথে ক্র্যাশ করলো (বা তুমি Ctrl+C দিলে)

পরেরবার আবার চালালে (resume করলে):
→ research_task আবার করা হয় না — সেভ করা checkpoint থেকেই শুরু হয়
→ design_task আবার নতুন করে চলে
```

Resume করার কোডটা এরকম:

```python
result = fashion_crew.kickoff(
    from_checkpoint=CheckpointConfig(
        restore_from="./my_checkpoints/2026-11-22_abc123.json"
    )
)
```

চাইলে পুরো কনফিগারেশন না দিয়ে শুধু `checkpoint=True` দিলেও হয় — তখন ডিফল্টভাবে `./.checkpoints/`-এ প্রতিটা Task শেষে checkpoint লেখা হবে।

টার্মিনাল থেকেও checkpoint দেখা যায়:

```bash
crewai checkpoint --location ./my_checkpoints
```

### ছোট্ট নোট

Checkpointing নতুন ফিচার, তাই ভবিষ্যতে API-তে ছোটখাটো পরিবর্তন আসতে পারে। বেশি ঘন ঘন checkpoint দরকার হলে (যেমন প্রতিটা LLM কলে) `SqliteProvider` ব্যবহার করা ভালো — সাধারণ ক্ষেত্রে ডিফল্ট JSON ফাইলই যথেষ্ট।

### পরের ধাপ

- [Files](/docs/core-concepts/files) — রফিক-সুমনকে ছবি আর PDF সরাসরি দেওয়া
- [Event Listeners](/docs/core-concepts/event-listeners) — আগের ধাপে ফিরে যেতে চাইলে
