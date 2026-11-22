---
title: Database & Data
description: SQL ডাটাবেস, ভেক্টর স্টোর ও ডেটা ওয়্যারহাউজের সাথে সংযোগ।
icon: Database
---

SQL ডাটাবেস, ভেক্টর স্টোর, ডেটা ওয়্যারহাউজের সাথে সংযোগ।

| Tool | কাজ |
| --- | --- |
| `MySQLSearchTool` | MySQL ডাটাবেসে কোয়েরি করা |
| `SnowflakeSearchTool` | Snowflake ডেটা ওয়্যারহাউজ থেকে তথ্য আনা |
| `NL2SQLTool` | সাধারণ ভাষার প্রশ্নকে SQL-এ রূপান্তর করা |
| `QdrantVectorSearchTool` | Qdrant ভেক্টর ডাটাবেসে সার্চ |
| `WeaviateVectorSearchTool` | Weaviate ভেক্টর ডাটাবেসে সার্চ |
| `MongoDBVectorSearchTool` | MongoDB Atlas-এ ভেক্টর সার্চ |
| `SingleStoreSearchTool` | SingleStore-এ নিরাপদ SELECT/SHOW কোয়েরি |

**উদাহরণ:**

```python
from crewai_tools import MySQLSearchTool, NL2SQLTool

sales_db = MySQLSearchTool()
nl_to_sql = NL2SQLTool()

agent = Agent(
    role="ডেটা অ্যানালিস্ট",
    goal="ডাটাবেস থেকে বিজনেস-ইনসাইট বের করা",
    backstory="তুমি ডেটা বিশ্লেষণে দক্ষ।",
    tools=[sales_db, nl_to_sql],
)
```

> ডাটাবেসের host / user / password / connection string `.env`-এ রাখো।
