---
title: Built In Tools
description: CrewAI-এর ৪০+ পূর্ব-নির্মিত Tool — ৮টা বিভাগে সাজানো সহজ গাইড।
icon: Package
---

CrewAI-তে ৪০+ পূর্ব-নির্মিত Tool আছে, যা ৮টা বিভাগে ভাগ করা — ফাইল প্রসেসিং থেকে শুরু করে ওয়েব স্ক্র্যাপিং, ডাটাবেস কোয়েরি, AI সার্ভিস পর্যন্ত সব ঢাকা।

## Tools Overview

**যেকোনো Tool ব্যবহারের নিয়ম সবসময় একই, মাত্র ৩ ধাপ:**

```python
# ধাপ ১: Import করো
from crewai_tools import FileReadTool

# ধাপ ২: Agent-এর tools লিস্টে যোগ করো
agent = Agent(
    role="...",
    goal="...",
    backstory="...",
    tools=[FileReadTool()],
)

# ধাপ ৩: দরকার হলে .env-এ API key বসাও
```

**ইনস্টলেশন:**

```bash
pip install 'crewai[tools]'
```

**একটা ছোট্ট কিন্তু দরকারি ফিচার — Max Usage Count:**

```python
tool = FileReadTool(max_usage_count=5)  # একটা Task-এ সর্বোচ্চ ৫ বার ব্যবহার হবে
```

ডিফল্টভাবে কোনো সীমা থাকে না (unlimited)।

## বিভাগগুলো

| বিভাগ | কী আছে |
| --- | --- |
| [File & Document](/docs/built-in-tools/file-document) | PDF, DOCX, JSON, CSV সহ ফাইল পড়া, লেখা, সার্চ |
| [Web Scraping & Browsing](/docs/built-in-tools/web-scraping) | ওয়েবসাইট থেকে তথ্য তোলা ও ব্রাউজার অটোমেশন |
| [Search & Research](/docs/built-in-tools/search-research) | ওয়েব সার্চ, GitHub ও YouTube রিসার্চ |
| [Database & Data](/docs/built-in-tools/database-data) | SQL, vector store, data warehouse |
| [AI & Machine Learning](/docs/built-in-tools/ai-ml) | ছবি তৈরি, ভিশন, RAG |
| [Cloud & Storage](/docs/built-in-tools/cloud-storage) | S3, Bedrock |
| [Integrations](/docs/built-in-tools/integrations) | Bedrock ও CrewAI Automation সংযোগ |
| [Automation](/docs/built-in-tools/automation) | Apify, Composio, Zapier, MultiOn |
| [Quick Access](/docs/built-in-tools/quick-access) | সবচেয়ে বেশি ব্যবহৃত টুলের রেফারেন্স |

> নিজের বানানো Tool দেখতে [Tools](/docs/core-concepts/tools), আর বাইরের সার্ভারের টুল দেখতে [MCP Integration](/docs/mcp-integration)।
