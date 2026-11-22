---
title: Event Listeners
description: React to lifecycle events across crews and flows.
icon: BellRing
---

> এই পেজটা [Streaming](/docs/core-concepts/streaming) পেজের ধারাবাহিকতা — লাইভ আউটপুট দেখা হয়ে গেছে, এবার লাইভ নোটিফিকেশনের পালা।

## ধাপ ১৭: Event Listeners

### বাস্তব গল্প (রূপসী ফ্যাশন)

করিম ভাই চাইলেন, প্রতিবার টিম কাজ শুরু বা শেষ করলে তিনি একটা **ছোট্ট নোটিফিকেশন** পান — যেমন ধরো অফিসের দরজায় একটা ঘণ্টা বাঁধা আছে, যেটা কেউ কাজ শুরু করলেই “টিং” বেজে ওঠে, আর কাজ শেষ হলে আরেকবার বাজে।

> “আমি চাই, যখনই টিম কাজ শুরু করবে, আমার মোবাইলে একটা মেসেজ আসুক — ‘টিম কাজ শুরু করেছে’। আর কাজ শেষ হলে — ‘টিম কাজ শেষ করেছে, ফলাফল এই’।”

### CrewAI-তে এই একই জিনিস

এই “স্বয়ংক্রিয় নোটিফিকেশন পাওয়ার ব্যবস্থা”-কেই CrewAI-তে বলা হয় **Event Listeners**। পুরো কাজের প্রতিটা গুরুত্বপূর্ণ মুহূর্তে (Task শুরু, Task শেষ, Crew শুরু, Crew শেষ ইত্যাদি) একটা “ইভেন্ট” তৈরি হয়, আর তুমি সেই ইভেন্টগুলো “শুনে” নিজের কোড চালাতে পারো।

### কোড (নতুন ফাইল `my_listener.py`)

```python
from crewai.events import (
    BaseEventListener,
    CrewKickoffStartedEvent,
    CrewKickoffCompletedEvent,
)

class KorimBhaiNotifier(BaseEventListener):
    def __init__(self):
        super().__init__()

    def setup_listeners(self, crewai_event_bus):

        @crewai_event_bus.on(CrewKickoffStartedEvent)
        def on_start(source, event):
            print(f"🔔 করিম ভাইয়ের মোবাইলে মেসেজ: '{event.crew_name}' টিম কাজ শুরু করেছে!")

        @crewai_event_bus.on(CrewKickoffCompletedEvent)
        def on_done(source, event):
            print(f"✅ করিম ভাইয়ের মোবাইলে মেসেজ: কাজ শেষ! ফলাফল হাতে পেয়েছেন।")

korim_bhai_notifier = KorimBhaiNotifier()
```

এবার মূল ফাইলে এই লিসেনারটা একবার ইম্পোর্ট করে নিতে হয়:

```python
# crew_project.py-তে, শুরুর দিকে
import my_listener   # 👈 এই লাইনটাই লিসেনার অ্যাক্টিভ করে
```

### বাস্তবে কী ঘটে

যখনই `fashion_crew.kickoff(...)` চালানো হবে, টার্মিনালে স্বয়ংক্রিয়ভাবে ভেসে উঠবে:

```text
🔔 করিম ভাইয়ের মোবাইলে মেসেজ: 'fashion_crew' টিম কাজ শুরু করেছে!

[... রফিক, সুমন, নাদিয়ার কাজ চলতে থাকে ...]

✅ করিম ভাইয়ের মোবাইলে মেসেজ: কাজ শেষ! ফলাফল হাতে পেয়েছেন।
```

**লক্ষ্য করো:** তুমি কোথাও `on_start` বা `on_done` ফাংশন সরাসরি কল করোনি — শুধু `@crewai_event_bus.on(...)` দিয়ে “রেজিস্টার” করে দিয়েছো, আর CrewAI নিজে থেকেই সঠিক মুহূর্তে এটা কল করে। এরকম আরও অনেক ইভেন্ট আছে — যেমন `AgentExecutionCompletedEvent` (একজন নির্দিষ্ট Agent কাজ শেষ করলে), `TaskCompletedEvent`, `ToolUsageStartedEvent`, `LLMStreamChunkEvent` ইত্যাদি।

### এখন কী অবস্থা

করিম ভাইয়ের আর টিমের দিকে তাকিয়ে থাকতে হয় না — কাজ শুরু বা শেষ হলেই তিনি নিজে থেকে খবর পান। নোটিফিকেশনটা এখানে শুধু `print`, চাইলে সেটা Slack, ইমেইল বা SMS-এও পাঠানো যায়।

### পরের ধাপ

- [Checkpointing](/docs/core-concepts/checkpointing) — বিদ্যুৎ চলে গেলেও যেন কাজ না হারায়
- [Streaming](/docs/core-concepts/streaming) — আগের ধাপে ফিরে যেতে চাইলে
