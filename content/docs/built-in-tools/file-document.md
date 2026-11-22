---
title: File & Document
description: PDF, DOCX, JSON, CSV সহ যেকোনো ফরম্যাটের ফাইল পড়া, লেখা ও খোঁজা।
icon: FileText
---

PDF, DOCX, JSON, CSV সহ যেকোনো ফরম্যাটের ফাইল পড়া, লেখা, খোঁজা।

| Tool | কাজ |
| --- | --- |
| `FileReadTool` | যেকোনো টেক্সট-ফাইল পড়া |
| `FileWriterTool` | ফাইলে লেখা/সেভ করা |
| `DirectoryReadTool` | একটা ফোল্ডারের তালিকা দেখা |
| `PDFSearchTool` | PDF-এর ভেতরে সিমান্টিক সার্চ |
| `DOCXSearchTool` | Word ফাইলে সিমান্টিক সার্চ |
| `CSVSearchTool` | CSV ফাইলে সিমান্টিক সার্চ |
| `JSONSearchTool` | JSON ফাইলে সিমান্টিক সার্চ |
| `TXTSearchTool` | `.txt` ফাইলে সিমান্টিক সার্চ |
| `MDXSearchTool` | Markdown ফাইলে সিমান্টিক সার্চ |
| `XMLSearchTool` | XML ফাইলে সিমান্টিক সার্চ |

> নামের মধ্যে "Search" থাকা টুলগুলো OpenAI embedding ব্যবহার করে — এগুলোর জন্য `.env`-এ `OPENAI_API_KEY` লাগে।

**উদাহরণ:**

```python
from crewai_tools import FileReadTool, FileWriterTool, DirectoryReadTool

file_reader = FileReadTool()
file_writer = FileWriterTool()
folder_scanner = DirectoryReadTool(directory="./reports")

agent = Agent(
    role="ডকুমেন্ট প্রসেসর",
    goal="ফাইল পড়ে প্রসেস করে ফলাফল সেভ করা",
    backstory="তুমি ফাইল নিয়ে কাজ করতে দক্ষ।",
    tools=[file_reader, file_writer, folder_scanner],
)
```
