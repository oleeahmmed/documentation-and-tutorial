---
title: Cloud & Storage
description: AWS S3 ও Amazon Bedrock সহ ক্লাউড সার্ভিসের সাথে কাজ করা।
icon: Cloud
---

AWS S3, Amazon Bedrock সহ ক্লাউড সার্ভিসের সাথে কাজ করা।

| Tool | কাজ |
| --- | --- |
| `S3ReaderTool` | AWS S3 বাকেট থেকে ফাইল পড়া |
| `S3WriterTool` | AWS S3-তে ফাইল আপলোড করা |
| `BedrockInvokeAgentTool` | Amazon Bedrock এজেন্ট কল করা |
| `BedrockKBRetrieverTool` | Amazon Bedrock knowledge base থেকে তথ্য আনা |

**উদাহরণ:**

```python
from crewai_tools import S3ReaderTool, S3WriterTool

s3_reader = S3ReaderTool()
s3_writer = S3WriterTool()

agent = Agent(
    role="ক্লাউড অপারেশন স্পেশালিস্ট",
    goal="ক্লাউড রিসোর্স ও AI সার্ভিস ব্যবস্থাপনা করা",
    backstory="তুমি ক্লাউড সার্ভিস নিয়ে কাজ করতে দক্ষ।",
    tools=[s3_reader, s3_writer],
)
```

> AWS-এর টুলগুলোর জন্য `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` আর রিজিয়ন `.env`-এ দাও।
