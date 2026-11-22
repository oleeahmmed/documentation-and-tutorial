---
title: Web Scraping & Browsing
description: ওয়েবসাইট থেকে তথ্য বের করা ও ব্রাউজার অটোমেট করা।
icon: Globe
---

ওয়েবসাইট থেকে তথ্য বের করা, ব্রাউজার অটোমেট করা।

| Tool | কাজ |
| --- | --- |
| `ScrapeWebsiteTool` | একটা ওয়েবপেজের পুরো কন্টেন্ট বের করা |
| `WebsiteSearchTool` | একটা ওয়েবসাইটের ভেতরে সিমান্টিক সার্চ |

Firecrawl, Selenium-এর মতো আরও স্ক্র্যাপিং-ইঞ্জিন ভিত্তিক Tool-ও এই বিভাগে আছে।

**উদাহরণ:**

```python
from crewai_tools import ScrapeWebsiteTool, WebsiteSearchTool

page_scraper = ScrapeWebsiteTool(website_url="https://example.com")
site_search = WebsiteSearchTool(website="https://docs.crewai.com")

agent = Agent(
    role="ওয়েব গবেষক",
    goal="ওয়েবসাইট থেকে তথ্য সংগ্রহ করা",
    backstory="তুমি ওয়েব থেকে তথ্য তুলে আনতে দক্ষ।",
    tools=[page_scraper, site_search],
)
```
