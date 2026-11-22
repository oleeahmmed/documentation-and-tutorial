---
title: Search & Research
description: ওয়েব সার্চ, কোড-রিপোজিটরি ও YouTube কন্টেন্ট রিসার্চের টুল।
icon: Search
---

ওয়েব সার্চ, কোড-রিপোজিটরি খোঁজা, YouTube কন্টেন্ট রিসার্চ করা।

| Tool | কাজ |
| --- | --- |
| `SerperDevTool` | Google সার্চ API |
| `GithubSearchTool` | GitHub রিপোজিটরিতে সার্চ |
| `YoutubeVideoSearchTool` | একটা নির্দিষ্ট YouTube ভিডিওর ভেতরে সার্চ |
| `YoutubeChannelSearchTool` | একটা YouTube চ্যানেলের ভেতরে সার্চ |
| `CodeDocsSearchTool` | কোড-ডকুমেন্টেশনে সার্চ |

**উদাহরণ:**

```python
from crewai_tools import SerperDevTool

google_search = SerperDevTool(n_results=5)

agent = Agent(
    role="গবেষক",
    goal="ইন্টারনেট থেকে সাম্প্রতিক তথ্য খুঁজে বের করা",
    backstory="তুমি ইন্টারনেট সার্চে দক্ষ।",
    tools=[google_search],
)
```

`.env`-এ `SERPER_API_KEY` লাগবে ([serper.dev](https://serper.dev) থেকে ফ্রি পাওয়া যায়)।
