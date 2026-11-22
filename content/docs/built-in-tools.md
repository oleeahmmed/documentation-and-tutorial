---
title: Built In Tools
description: Ready-made tools from the crewai_tools catalog.
icon: Package
---

> এই পেজটা [Tools](/docs/core-concepts/tools) পেজের ধারাবাহিকতা — নিজের বানানো যন্ত্রের পর এবার রেডিমেড যন্ত্রের ভাণ্ডার। এটা গল্পের ২১ ধাপের বাইরে আলাদা সেকশন।

## Built In Tools

### বাস্তব গল্প (রূপসী ফ্যাশন)

করিম ভাই রফিককে একটা পূর্ণাঙ্গ “গবেষণা-কেন্দ্র” গড়ে দিলেন, যেখানে রফিক একসাথে অনেকগুলো উৎস থেকে তথ্য নিতে পারবে — পুরোনো ফাইল, CSV-তে রাখা বিক্রির তালিকা, ইন্টারনেট সার্চ, ওয়েবসাইট, এমনকি হিসাব-নিকাশও করতে পারবে।

### প্রজেক্ট স্ট্রাকচার

```text
rupashi_research_center/
├── .env
├── data/
│   └── sales_data.csv       ← তৈরি হবে কোডের মাধ্যমে
├── output/                   ← এখানে ফলাফল সেভ হবে
└── crew_project.py
```

### ইনস্টলেশন

```bash
pip install 'crewai[tools]' python-dotenv
```

`.env` ফাইলে দুইটা key রাখো:

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
SERPER_API_KEY=xxxxxxxxxxxxxxxxxxxxx
```

`SERPER_API_KEY` নেওয়া যায় [serper.dev](https://serper.dev) থেকে (ফ্রি টিয়ার আছে)।

### সবচেয়ে বেশি ব্যবহৃত বিল্ট-ইন টুল

| বিভাগ | Tool-এর নাম | কাজ |
| --- | --- | --- |
| **ফাইল ও ডকুমেন্ট** | `FileReadTool` | যেকোনো টেক্সট-ফাইল পড়া |
| | `FileWriterTool` | ফাইলে লেখা |
| | `DirectoryReadTool` | ফোল্ডারের তালিকা দেখা |
| | `CSVSearchTool` | CSV ফাইলে সিমান্টিক সার্চ |
| | `PDFSearchTool` | PDF-এর ভেতরে সিমান্টিক সার্চ |
| | `DOCXSearchTool` | Word ফাইলে সিমান্টিক সার্চ |
| | `TXTSearchTool` | `.txt` ফাইলে সিমান্টিক সার্চ |
| | `JSONSearchTool` | JSON ফাইলে সিমান্টিক সার্চ |
| | `MDXSearchTool` | Markdown ফাইলে সিমান্টিক সার্চ |
| | `XMLSearchTool` | XML ফাইলে সিমান্টিক সার্চ |
| **ওয়েব স্ক্র্যাপিং** | `ScrapeWebsiteTool` | একটা ওয়েবপেজের পুরো কন্টেন্ট বের করা |
| | `WebsiteSearchTool` | একটা ওয়েবসাইটের ভেতরে সিমান্টিক সার্চ |
| **সার্চ ও গবেষণা** | `SerperDevTool` | গুগল সার্চ |
| | `GithubSearchTool` | GitHub রিপোজিটরিতে সার্চ |
| | `YoutubeVideoSearchTool` | একটা নির্দিষ্ট YouTube ভিডিওর ভেতরে সার্চ |
| | `YoutubeChannelSearchTool` | একটা YouTube চ্যানেলের ভেতরে সার্চ |
| | `CodeDocsSearchTool` | কোড-ডকুমেন্টেশনে সার্চ |
| **AI/ML** | `RagTool` | কাস্টম knowledge-এ Retrieval-Augmented Generation |
| **ক্লাউড** | `S3ReaderTool` | AWS S3 থেকে ফাইল পড়া |

এই তালিকার **RAG-ভিত্তিক Tools** (যেগুলোর নামে "Search" আছে) একটা কমন প্যাটার্ন মেনে চলে — এগুলো OpenAI embedding ব্যবহার করে ফাইলের ভেতরে “অর্থ বুঝে” সার্চ করে, শুধু শব্দ মিলিয়ে না। তাই এগুলোতেও `OPENAI_API_KEY` লাগে।

**সতর্কতা:** `CodeInterpreterTool` নতুন ভার্সনে `crewai-tools` থেকে সরিয়ে দেওয়া হয়েছে। সহজ হিসাব Agent নিজেই করতে পারে; সত্যিকারের কোড চালাতে দরকার হলে E2B বা Daytona-র sandbox টুল ব্যবহার করো।

### হাতে-কলমে ১: CSV বানানো ও তাতে সার্চ (`CSVSearchTool`)

প্রথমে একটা নমুনা বিক্রির-তথ্য CSV বানাই:

```python
import os
import csv

os.makedirs("data", exist_ok=True)

with open("data/sales_data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["পণ্য", "সিজন", "বিক্রি_পরিমাণ"])
    writer.writerow(["উলের ওভারকোট", "শীতকাল ২০২৬", "৮০০ পিস"])
    writer.writerow(["দেশি তাঁতের চাদর", "শীতকাল ২০২৬", "৫৫০ পিস"])
    writer.writerow(["পেস্টেল মাফলার", "শীতকাল ২০২৬", "৩০০ পিস"])
```

এবার এই CSV-তে সিমান্টিক সার্চ করার Tool:

```python
from crewai_tools import CSVSearchTool

sales_search = CSVSearchTool(csv="data/sales_data.csv")

# সরাসরি টেস্ট করে দেখো
result = sales_search.run(search_query="গত শীতে কোন পণ্য সবচেয়ে বেশি বিক্রি হয়েছিল?")
print(result)
```

**বাস্তব আউটপুট (অনুরূপ):**

```text
Relevant Content:
পণ্য: উলের ওভারকোট, সিজন: শীতকাল ২০২৬, বিক্রি_পরিমাণ: ৮০০ পিস
```

### হাতে-কলমে ২: ওয়েবসাইটে সিমান্টিক সার্চ (`WebsiteSearchTool`)

```python
from crewai_tools import WebsiteSearchTool

site_search = WebsiteSearchTool(website="https://docs.crewai.com")

result = site_search.run(search_query="what is a crew")
print(result)
```

`WebsiteSearchTool` এখনো experimental — মাঝে মাঝে আচরণ বদলাতে পারে।

### সব Tool একত্র করে Agent-কে দেওয়া

```python
import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from crewai_tools import (
    CSVSearchTool,
    SerperDevTool,
    ScrapeWebsiteTool,
    FileWriterTool,
)

load_dotenv()

# ---- সব Tool প্রস্তুত ----
sales_search = CSVSearchTool(csv="data/sales_data.csv")
google_search = SerperDevTool(n_results=3)
page_scraper = ScrapeWebsiteTool()
file_writer = FileWriterTool(base_dir="./output")

# ---- Agent ----
researcher = Agent(
    role="বাজার গবেষক",
    goal="পুরোনো বিক্রির তথ্য, ইন্টারনেট সার্চ ও হিসাব মিলিয়ে একটা পূর্ণাঙ্গ রিপোর্ট বানানো",
    backstory="তুমি রফিক, একাধিক উৎস থেকে তথ্য একত্র করে সিদ্ধান্ত নিতে পারদর্শী।",
    tools=[sales_search, google_search, page_scraper, file_writer],
    verbose=True
)

# ---- Task ----
research_task = Task(
    description=(
        "ধাপ ১: sales_data.csv থেকে জানো গত শীতে কোন পণ্য সবচেয়ে বেশি বিক্রি হয়েছিল। "
        "ধাপ ২: গুগলে '২০২৬ শীতকালীন ফ্যাশন ট্রেন্ড' সার্চ করো, আর একটা ফলাফল-পেজ স্ক্র্যাপ করো। "
        "ধাপ ৩: গত বছরের বিক্রি ৮০০ পিস, এবার ১৫% বাড়ার সম্ভাবনা — এবার কত পিস হতে পারে নিজে হিসাব করো। "
        "ধাপ ৪: সবকিছু মিলিয়ে একটা রিপোর্ট লেখো এবং 'final_report.txt' নামে ফাইলে সেভ করো।"
    ),
    expected_output="একটা পূর্ণাঙ্গ রিপোর্ট, যা ফাইলেও সেভ হয়েছে।",
    agent=researcher
)

crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    process=Process.sequential,
    verbose=True
)

result = crew.kickoff()
print("\n\n===== ফাইনাল আউটপুট =====")
print(result.raw)
```

চালাও:

```bash
python crew_project.py
```

### বাস্তবে কী ঘটে — ধাপে ধাপে

```text
Thought: আগে CSV থেকে গত বছরের বিক্রির তথ্য জানা দরকার।
Action: Search a CSV's content
Action Input: {"search_query": "গত শীতে কোন পণ্য সবচেয়ে বেশি বিক্রি হয়েছিল"}
Observation: উলের ওভারকোট, বিক্রি ৮০০ পিস।

Thought: এবার নতুন ট্রেন্ড সার্চ করা দরকার।
Action: Search the internet
Action Input: {"search_query": "২০২৬ শীতকালীন ফ্যাশন ট্রেন্ড"}
Observation: [সার্চ রেজাল্ট — আর্থ-টোন রঙ, লেয়ারিং জনপ্রিয়তার তথ্য]

Thought: ৮০০ × ১.১৫ = ৯২০ — নিজেই হিসাব করে নিই।

Thought: এবার সব মিলিয়ে ফাইলে লিখে ফেলা দরকার।
Action: Write File
Action Input: {"filename": "final_report.txt", "content": "..."}
Observation: Content successfully written to output/final_report.txt

===== ফাইনাল আউটপুট =====
গত শীতে উলের ওভারকোট সবচেয়ে বেশি বিক্রি হয়েছিল (৮০০ পিস)। এবারের
সার্চ অনুযায়ী আর্থ-টোন রঙ ও লেয়ারিং স্টাইল জনপ্রিয় হবে। ১৫% বৃদ্ধির
হিসাবে এবার প্রায় ৯২০ পিস বিক্রি হতে পারে বলে অনুমান করা যায়।
(রিপোর্টটি output/final_report.txt ফাইলেও সেভ করা হয়েছে।)
```

লক্ষ্য করো — রফিক আলাদা আলাদা Tool একের পর এক কল করেছে, প্রতিটা থেকে সত্যিকারের তথ্য নিয়েছে, আর শেষে সব মিলিয়ে একটা ফাইলে সেভ করেছে।

### আরও কিছু RAG-Search Tool — একই প্যাটার্নে ব্যবহার

নিচের Tool-গুলো ঠিক `CSVSearchTool`-এর মতোই কাজ করে — শুধু ফাইল-টাইপ আলাদা:

```python
from crewai_tools import PDFSearchTool, DOCXSearchTool, TXTSearchTool, JSONSearchTool

pdf_search = PDFSearchTool(pdf="data/catalog.pdf")
docx_search = DOCXSearchTool(docx="data/brand_guide.docx")
txt_search = TXTSearchTool(txt="data/notes.txt")
json_search = JSONSearchTool(json_path="data/inventory.json")

print(pdf_search.run(search_query="এবারের ক্যাটালগে উলের কী কী ডিজাইন আছে?"))
```

প্রতিটাই `.run(search_query="...")` দিয়ে কল করা যায়, আর Agent-এর `tools=[...]` লিস্টে বসানো যায় — উপরের মতো একই নিয়মে।

### সারসংক্ষেপ — রূপসী ফ্যাশনের গবেষণা-কেন্দ্র

```text
রফিকের গবেষণা-কেন্দ্রে এখন আছে:

ফাইল পড়া/লেখা          → FileReadTool, FileWriterTool, DirectoryReadTool
ফাইলের ভেতরে সার্চ      → CSVSearchTool, PDFSearchTool, DOCXSearchTool, TXTSearchTool, JSONSearchTool
ইন্টারনেট থেকে তথ্য      → SerperDevTool, ScrapeWebsiteTool, WebsiteSearchTool
ক্লাউড থেকে তথ্য         → S3ReaderTool
```

প্রতিটা Tool একই তিনটা ধাপে ব্যবহার হয় — **import করো → instance বানাও → Agent-এর `tools=[...]`-এ বসাও।**

### ছোট্ট সতর্কতা

- **পাথ-ভ্যালিডেশন:** ফাইল-ভিত্তিক RAG টুল (CSV/PDF/JSON) current working directory-র বাইরের পাথ নেয় না। `FileWriterTool`-এর লেখাও `base_dir`-এর ভেতরে সীমাবদ্ধ।
- **ডিরেক্টরি নিজেই তৈরি হয়:** `FileWriterTool` প্রয়োজন হলে `output/` ফোল্ডার নিজে বানিয়ে নেয়।
- **`CodeInterpreterTool` সরানো হয়েছে:** এর বদলে সহজ হিসাব Agent-ই করুক, আর সত্যিকারের কোড রান দরকার হলে E2B/Daytona ব্যবহার করো।

### পরের ধাপ

- [MCP Integration](/docs/mcp-integration) — নিজের বানানো তথ্য-সার্ভারের সাথে সংযোগ
- [Tools](/docs/core-concepts/tools) — আগের ধাপে ফিরে যেতে চাইলে
- [Agent Capabilities](/docs/core-concepts/agent-capabilities) — পাঁচটা সক্ষমতার তালিকা
