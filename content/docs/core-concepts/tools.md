---
title: Tools
description: Extend agents with custom and built-in tools.
icon: Wrench
---

> এই পেজটা [Agent Capabilities](/docs/core-concepts/agent-capabilities) পেজের ধারাবাহিকতা — পাঁচটা সক্ষমতার প্রথমটা: Tools।

## ধাপ ৭: Tools

### বাস্তব গল্প (রূপসী ফ্যাশন)

রফিক বাজার থেকে ফিরে এসে প্রায়ই দামের ব্যাপারে আন্দাজে কথা বলতো — “একটা ওভারকোটের দাম মনে হয় ১৫০০-২০০০ টাকার মধ্যে হবে।” কিন্তু এটা সবসময় সঠিক হতো না, কারণ দাম সময়ে সময়ে বদলায়।

করিম ভাই এটা লক্ষ্য করে রফিককে একটা জিনিস দিলেন — কোম্পানির একটা ছোট্ট দাম-তালিকার যন্ত্র (ডাটাবেস), যেখান থেকে রফিক যেকোনো সময় নির্দিষ্ট পণ্যের দাম চেক করে নিতে পারবে।

> “রফিক, এখন থেকে দাম বলার আগে এই যন্ত্রে চেক করে নাও, আন্দাজ করার দরকার নেই।”

### CrewAI-তে এই একই জিনিস

এই “দাম-চেকার যন্ত্র”-টাকেই CrewAI-তে বলা হয় **Tool**। Tool হলো এমন একটা ফাংশন, যা Agent নিজে থেকে দরকার মনে করলে কল করতে পারে, আর তার থেকে একটা নির্ভরযোগ্য উত্তর পায় — অনুমান না করে।

### কোড (নতুন অংশ যোগ হলো)

```python
from crewai.tools import BaseTool
from pydantic import BaseModel, Field

class PriceCheckInput(BaseModel):
    item: str = Field(..., description="যে পণ্যের দাম জানতে হবে")

class PriceCheckerTool(BaseTool):
    name: str = "Price Checker"
    description: str = "একটা ফ্যাশন আইটেমের বর্তমান বাজার-দাম চেক করে।"
    args_schema: type[BaseModel] = PriceCheckInput

    def _run(self, item: str) -> str:
        # আসল জীবনে এটা একটা ডাটাবেস বা API-কে কল করতে পারতো,
        # এখানে সহজ রাখার জন্য একটা ফিক্সড তালিকা ব্যবহার করছি
        price_list = {
            "উলের ওভারকোট": "১৮০০-২৫০০ টাকা",
            "চাদর": "৮০০-১২০০ টাকা",
            "মাফলার": "৩০০-৫০০ টাকা"
        }
        return price_list.get(item, "এই পণ্যের দাম তালিকায় পাওয়া যায়নি")

price_checker = PriceCheckerTool()
```

এবার এই টুলটা রফিককে (`researcher`) দিয়ে দিই:

```python
researcher = Agent(
    role="বাজার গবেষক",
    goal="প্রতিটা সিজনে নতুন ফ্যাশন ট্রেন্ড খুঁজে বের করা",
    backstory="তুমি রফিক, অনেক বছর ধরে কাপড়ের বাজার ঘুরে বেড়াও। দাম বলার "
               "আগে সবসময় Price Checker টুল দিয়ে যাচাই করে নাও।",
    tools=[price_checker]   # 👈 নতুন যোগ হলো
)
```

### বাস্তবে কী ঘটে

`research_task` চলাকালীন রফিক নিজে থেকে চিন্তা করে:

```text
Thought: ট্রেন্ড লেখার সময় দামও উল্লেখ করা ভালো হবে, যাচাই করে নিই।

Action: Price Checker
Action Input: {"item": "উলের ওভারকোট"}

Observation: ১৮০০-২৫০০ টাকা
```

রফিক এবার এই যাচাই করা তথ্য দিয়ে তার আউটপুট লেখে:

```text
- মাটি-রঙা উলের ওভারকোট জনপ্রিয় হচ্ছে (দাম: ১৮০০-২৫০০ টাকা)
- হাতে আঁকা মোটিফ-সহ চাদর ফিরে আসছে (দাম: ৮০০-১২০০ টাকা)
...
```

লক্ষ্য করো — এবার দামটা আন্দাজ না, Tool থেকে যাচাই করে নেওয়া সঠিক তথ্য।

### পরের ধাপ

- [Knowledge](/docs/core-concepts/knowledge) — দ্বিতীয় সক্ষমতা: স্থায়ী রেফারেন্স-জ্ঞান
- [Built In Tools](/docs/built-in-tools) — আলাদা সেকশন: রেডিমেড টুলের ভাণ্ডার
- [Agent Capabilities](/docs/core-concepts/agent-capabilities) — পাঁচটা সক্ষমতার তালিকায় ফিরে যেতে
