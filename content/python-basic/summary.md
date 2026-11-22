---
title: সারসংক্ষেপ
description: করিম ভাই কী কী শিখলেন — এক নজরে পুরো ম্যাপ, আর CrewAI-এর সাথে সংযোগ।
icon: ListChecks
---

## এক নজরে

| ধারণা | কাজ | অধ্যায় |
| --- | --- | --- |
| Variables / Data Types | তথ্য মনে রাখা | [Variables ও Data Types](/python-basic/variables-data-types) |
| Operators | হিসাব-নিকাশ ও তুলনা | [Operators](/python-basic/operators) |
| Strings | লেখা নিয়ে কাজ করা | [Strings](/python-basic/strings) |
| Conditionals | সিদ্ধান্ত নেওয়া (if/else) | [Conditionals](/python-basic/conditionals) |
| Lists | একাধিক জিনিসের তালিকা | [Lists](/python-basic/lists) |
| Loops | বারবার একই কাজ করা | [Loops](/python-basic/loops) |
| Tuples / Sets | অপরিবর্তনীয় বা ইউনিক তথ্য | [Tuples ও Sets](/python-basic/tuples-sets) |
| Dictionaries | নাম-মান জোড়া রাখা | [Dictionaries](/python-basic/dictionaries) |
| Functions | পুনঃব্যবহারযোগ্য নিয়ম লেখা | [Functions](/python-basic/functions) |
| Error Handling | ভুল হলেও প্রোগ্রাম না থামানো | [Error Handling](/python-basic/error-handling) |
| File Handling | স্থায়ী তথ্য সংরক্ষণ | [File Handling](/python-basic/file-handling) |
| Classes / Objects | বাস্তব জিনিসকে কোডে রূপ দেওয়া | [Classes ও Objects](/python-basic/classes-objects) |
| Modules / Imports | কোড আলাদা ফাইলে গুছিয়ে রাখা | [Modules ও Imports](/python-basic/modules-imports) |

## CrewAI-এর সাথে সংযোগ

এই ভিত্তিগুলো নিয়েই করিম ভাই পরে `Agent`, `Task`, `Crew` ক্লাসগুলো ব্যবহার করে CrewAI শিখেছিলেন। অর্থাৎ CrewAI টিউটোরিয়ালে যেসব `Agent(...)`, `Task(...)` দেখবে — সবই আসলে তোমার শেখা পাইথন ক্লাসের নিয়মেই কাজ করে।

| CrewAI | Python-এ কী |
| --- | --- |
| `Agent(role=..., goal=...)` | [Classes ও Objects](/python-basic/classes-objects) + [Variables](/python-basic/variables-data-types) |
| `Task(description=..., expected_output=...)` | Classes + [Strings](/python-basic/strings) |
| `Crew(agents=[...], tasks=[...])` | Classes + [Lists](/python-basic/lists) |
| টুল ফাংশন | [Functions](/python-basic/functions) |
| মেমরি / রিপোর্ট ফাইল | [File Handling](/python-basic/file-handling) |

এখন [CrewAI ডকুমেন্টেশন](/docs) থেকে Getting Started শুরু করো — ভিতটা তৈরি হয়ে গেছে।
