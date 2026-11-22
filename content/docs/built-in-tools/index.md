---
title: Built In Tools
description: CrewAI-এর রেডিমেড টুলগুলো ক্যাটাগরি ধরে সহজে ব্যবহার করার গাইড।
icon: Package
---

CrewAI-এর `crewai_tools` প্যাকেজে ৪০+ রেডিমেড টুল আছে। নিজে কোড না লিখেই Agent-কে ফাইল পড়া, ওয়েব সার্চ, ডাটাবেজ কোয়েরি — নানা ক্ষমতা দিয়ে দেওয়া যায়।

```bash
pip install 'crewai[tools]'
```

MCP সার্ভার দিয়ে হাজারো বাইরের টুলও যুক্ত করা যায় — [MCP Integration](/docs/mcp-integration)।

## Tools Overview

যেকোনো টুল ব্যবহারের নিয়ম একই — **import করো → instance বানাও → Agent-এর `tools=[...]`-এ বসাও**।

```python
from crewai import Agent
from crewai_tools import FileReadTool, SerperDevTool

researcher = Agent(
    role="গবেষক",
    goal="তথ্য খুঁজে এনে রিপোর্ট লেখা",
    backstory="তুমি তথ্য-গবেষক।",
    tools=[FileReadTool(), SerperDevTool()],
)
```

Agent ছাড়াও সরাসরি টেস্ট করা যায়:

```python
from crewai_tools import SerperDevTool

result = SerperDevTool(n_results=3).run(search_query="২০২৬ ফ্যাশন ট্রেন্ড")
print(result)
```

কোনো টুল বেশি বার ব্যবহার আটকাতে চাইলে:

```python
from crewai_tools import FileReadTool

reader = FileReadTool(max_usage_count=5)
```

ক্যাটাগরি এক নজরে:

| ক্যাটাগরি | কাজ |
| --- | --- |
| File & Document | ফাইল পড়া/লেখা, CSV-PDF-DOCX-তে সার্চ |
| Web Scraping & Browsing | ওয়েবপেজ স্ক্র্যাপ, ব্রাউজার অটোমেশন |
| Search & Research | গুগল, GitHub, YouTube, arXiv সার্চ |
| Database & Data | SQL, vector DB, data warehouse |
| AI & Machine Learning | ছবি তৈরি, ভিশন, RAG |
| Cloud & Storage | S3, Bedrock |
| Integrations | Bedrock Agent, CrewAI Automation |
| Automation | Apify, Composio, Zapier, MultiOn |

## File & Document

| Tool | কাজ |
| --- | --- |
| `FileReadTool` | যেকোনো টেক্সট ফাইল পড়া |
| `FileWriterTool` | ফাইলে লেখা ও সেভ করা |
| `DirectoryReadTool` | ফোল্ডারের ভেতরের তালিকা দেখা |
| `DirectorySearchTool` | ফোল্ডারের ভেতরে ফাইল খোঁজা |
| `CSVSearchTool` | CSV ফাইলে সিমান্টিক সার্চ |
| `PDFSearchTool` | PDF-এর ভেতরে সার্চ |
| `DOCXSearchTool` | Word ফাইলে সার্চ |
| `TXTSearchTool` | `.txt` ফাইলে সার্চ |
| `JSONSearchTool` | JSON ফাইলে সার্চ |
| `MDXSearchTool` | Markdown/MDX ফাইলে সার্চ |
| `XMLSearchTool` | XML ফাইলে সার্চ |
| `OCRTool` | ছবি থেকে টেক্সট বের করা |
| `PDFTextWritingTool` | PDF-এর নির্দিষ্ট জায়গায় লেখা |

> নামের মধ্যে "Search" থাকা টুলগুলো (RAG-ভিত্তিক) ফাইলের ভেতরে অর্থ বুঝে সার্চ করে — এগুলোর জন্য `OPENAI_API_KEY` লাগে।

```python
from crewai_tools import CSVSearchTool, FileWriterTool

sales = CSVSearchTool(csv="data/sales.csv")
print(sales.run(search_query="গত শীতে কোন পণ্য সবচেয়ে বেশি বিক্রি হয়েছিল?"))

writer = FileWriterTool(base_dir="./output")
writer.run(filename="report.txt", content="রিপোর্টের লেখা...")
```

- `FileWriterTool` `base_dir`-এর বাইরে লেখে না; ফোল্ডার না থাকলে নিজেই বানিয়ে নেয়।
- ফাইল-ভিত্তিক RAG টুলগুলো current working directory-র বাইরের পাথ নেয় না।

## Web Scraping & Browsing

| Tool | কাজ |
| --- | --- |
| `ScrapeWebsiteTool` | সাধারণ ওয়েবপেজের পুরো কন্টেন্ট |
| `ScrapeElementFromWebsiteTool` | পেজের নির্দিষ্ট element |
| `SeleniumScrapingTool` | JavaScript-ভারী সাইট |
| `FirecrawlScrapeWebsiteTool` | Firecrawl দিয়ে স্ক্র্যাপ |
| `FirecrawlCrawlWebsiteTool` | পুরো সাইট ক্রল |
| `FirecrawlSearchTool` | Firecrawl দিয়ে সার্চ |
| `SpiderTool` | সাইট ক্রল ও ডেটা তোলা |
| `ScrapflyScrapeWebsiteTool` | ScrapFly সার্ভিস দিয়ে স্ক্র্যাপ |
| `ScrapegraphScrapeTool` | AI-ভিত্তিক স্ট্রাকচার্ড স্ক্র্যাপিং |
| `BrowserbaseLoadTool` / `HyperbrowserLoadTool` | ক্লাউড ব্রাউজার |
| `StagehandTool` | প্রাকৃতিক ভাষায় ব্রাউজার অটোমেশন |
| `JinaScrapeWebsiteTool` | Jina দিয়ে পেজ পড়া |

এছাড়াও `Oxylabs...` ও `BrightData...` সিরিজের স্ক্র্যাপার আছে।

```python
from crewai_tools import ScrapeWebsiteTool

scraper = ScrapeWebsiteTool(website_url="https://docs.crewai.com")
print(scraper.run())
```

> সাইট স্ক্র্যাপ করার আগে ওয়েবসাইটের নিয়ম (robots.txt / terms) মেনে চলো।

## Search & Research

| Tool | কাজ |
| --- | --- |
| `SerperDevTool` | গুগল সার্চ |
| `BraveSearchTool` | Brave সার্চ |
| `EXASearchTool` | AI-ভিত্তিক সার্চ |
| `TavilySearchTool` | Tavily সার্চ |
| `TavilyExtractorTool` | পেজ থেকে স্ট্রাকচার্ড কন্টেন্ট |
| `GithubSearchTool` | রিপো, কোড, issue সার্চ |
| `WebsiteSearchTool` | নির্দিষ্ট ওয়েবসাইটের ভেতরে সার্চ |
| `CodeDocsSearchTool` | কোড-ডকুমেন্টেশনে সার্চ |
| `YoutubeVideoSearchTool` | ভিডিওর ভেতরে সার্চ |
| `YoutubeChannelSearchTool` | চ্যানেলের ভেতরে সার্চ |
| `ArxivPaperTool` | arXiv পেপার খোঁজা |
| `SerpApiGoogleSearchTool` | SerpApi দিয়ে গুগল সার্চ |
| `LinkupSearchTool` | Linkup সার্চ |

```python
from crewai_tools import WebsiteSearchTool

site_search = WebsiteSearchTool(website="https://docs.crewai.com")
print(site_search.run(search_query="what is a crew"))
```

> প্রতিটা সার্চ টুলের নিজস্ব API key লাগে — `.env`-এ রাখো, কোডে কখনো হার্ডকোড নয়।

## Database & Data

| Tool | কাজ |
| --- | --- |
| `MySQLSearchTool` | MySQL ডাটাবেজে কোয়েরি |
| `SnowflakeSearchTool` | Snowflake data warehouse |
| `SingleStoreSearchTool` | SingleStore-এ SELECT/SHOW |
| `NL2SQLTool` | প্রাকৃতিক ভাষা → SQL |
| `MongoDBVectorSearchTool` | MongoDB vector search |
| `QdrantVectorSearchTool` | Qdrant vector search |
| `WeaviateVectorSearchTool` | Weaviate semantic search |
| `DatabricksQueryTool` | Databricks কোয়েরি |
| `AzureDocumentDBVectorSearchTool` | Azure DocumentDB vector search |
| `OracleVectorSearchTool` | Oracle vector search |
| `DB2VectorSearchTool` | IBM Db2 vector search |
| `CouchbaseFTSVectorSearchTool` | Couchbase FTS search |

MongoDB-এর উদাহরণ (অফিসিয়াল ডক থেকে):

```python
from crewai_tools import MongoDBVectorSearchTool

mongo = MongoDBVectorSearchTool(
    connection_string="<MONGODB_URI>",
    database_name="<database>",
    collection_name="<collection>",
)
```

> প্রতিটা টুলে ডাটাবেজের connection string / host / user / password কনফিগ করতে হয় — সেগুলো `.env`-এ রাখো।

## AI & Machine Learning

| Tool | কাজ |
| --- | --- |
| `DallETool` | DALL-E দিয়ে ছবি তৈরি |
| `VisionTool` | ছবি বিশ্লেষণ (vision) |
| `AIMindTool` | AI reasoning ও সিদ্ধান্ত |
| `RagTool` | নিজের ডেটার ওপর RAG সিস্টেম |
| `LlamaIndexTool` | LlamaIndex knowledge base |

```python
from crewai_tools import DallETool, VisionTool

agent = Agent(
    role="AI Specialist",
    goal="ছবি বানানো ও বিশ্লেষণ করা",
    backstory="তুমি ছবি তৈরি ও বুঝতে পারদর্শী।",
    tools=[DallETool(), VisionTool()],
)
```

> **`CodeInterpreterTool` সরিয়ে দেওয়া হয়েছে।** সহজ হিসাব Agent নিজেই করতে পারে; সত্যিকারের কোড চালাতে হলে sandbox টুল ব্যবহার করো — `E2BPythonTool`/`E2BExecTool` (E2B) বা `DaytonaPythonTool` (Daytona)।

## Cloud & Storage

| Tool | কাজ |
| --- | --- |
| `S3ReaderTool` | S3 থেকে ফাইল পড়া |
| `S3WriterTool` | S3-তে ফাইল আপলোড |
| `BedrockInvokeAgentTool` | Amazon Bedrock Agent চালানো |
| `BedrockKBRetrieverTool` | Bedrock knowledge base থেকে তথ্য |

> AWS-এর টুলগুলোর জন্য `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` আর রিজিয়ন লাগে — `.env`-এ দাও।

## Integrations

| Tool | কাজ |
| --- | --- |
| `BedrockInvokeAgentTool` | Bedrock Agent-কে দিয়ে AWS-এ কাজ করানো |
| `GenerateCrewaiAutomationTool` | CrewAI Automation workflow তৈরি |
| `InvokeCrewAIAutomationTool` | Automation workflow চালানো |

## Automation

| Tool | কাজ |
| --- | --- |
| `ApifyActorsTool` | Apify actor চালিয়ে স্ক্র্যাপিং/অটোমেশন |
| `ComposioTool` | Composio দিয়ে শত শত অ্যাপে সংযোগ |
| `MultiOnTool` | ব্রাউজার-ভিত্তিক কাজ অটোমেট করা |
| `WaitTool` | লম্বা কাজের পরে অপেক্ষা/পুনরায় চেক |
| `ZapierActionTools` | Zapier Action-গুলো টুল হিসেবে ব্যবহার |

> এই টুলগুলোর প্রতিটির নিজস্ব API token বা অ্যাকাউন্ট সংযোগ লাগে।

## সাধারণ টিপস

- সব API key `.env`-এ রাখো, কোডে নয়।
- RAG সার্চ টুল এবং `DallETool`/`VisionTool`-এ `OPENAI_API_KEY` লাগে।
- ফাইল ও ফোল্ডার টুলের পাথ working directory-র ভেতরে রাখো।
- একটার বেশি বার ব্যবহার করতে না চাইলে `max_usage_count=5` দাও।

নিজের বানানো টুল দেখতে [Tools](/docs/core-concepts/tools), আর বাইরের সার্ভারের টুল দেখতে [MCP Integration](/docs/mcp-integration)।
