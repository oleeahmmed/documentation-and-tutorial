---
title: Automation
description: Apify, Composio, Zapier দিয়ে রিপিটিটিভ কাজ স্বয়ংক্রিয় করা।
icon: Zap
---

রিপিটিটিভ কাজ স্বয়ংক্রিয় করা, বাইরের প্ল্যাটফর্মের সাথে সংযোগ।

| Tool | কাজ |
| --- | --- |
| `ApifyActorsTool` | Apify actor চালিয়ে স্ক্র্যাপিং/অটোমেশন করা |
| `ComposioTool` | শত শত অ্যাপ/সার্ভিসের সাথে সংযোগ করা |
| `MultiOnTool` | ব্রাউজার-ইন্টারঅ্যাকশন অটোমেট করা |
| `WaitTool` | দীর্ঘ-চলমান কাজ (যেমন build/deployment) চেক করার আগে অপেক্ষা করা |
| `ZapierActionTools` | Zapier-এর Action-গুলো CrewAI Tool হিসেবে ব্যবহার করা |

**উদাহরণ:**

```python
from crewai_tools import ApifyActorsTool, ComposioTool, MultiOnTool

apify_automation = ApifyActorsTool()
platform_integration = ComposioTool()
browser_automation = MultiOnTool()

agent = Agent(
    role="অটোমেশন স্পেশালিস্ট",
    goal="ওয়ার্কফ্লো স্বয়ংক্রিয় করা ও সিস্টেম ইন্টিগ্রেট করা",
    backstory="তুমি অটোমেশনে দক্ষ।",
    tools=[apify_automation, platform_integration, browser_automation],
)
```

> প্রতিটা Tool-এর নিজস্ব API token বা অ্যাকাউন্ট সংযোগ লাগে — `.env`-এ রাখো।
