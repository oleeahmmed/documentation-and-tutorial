---
title: Integrations
description: Bedrock ও CrewAI Automation-এর এন্টারপ্রাইজ-লেভেল সংযোগ।
icon: Plug
---

CrewAI-কে বড় বহিরাগত সিস্টেমের সাথে প্রি-বিল্ট উপায়ে সংযুক্ত করা — যেমন **Amazon Bedrock** (উপরের `BedrockInvokeAgentTool`-এর মাধ্যমে) এবং CrewAI-এর নিজস্ব **Automation toolkit**।

| Tool | কাজ |
| --- | --- |
| `BedrockInvokeAgentTool` | Amazon Bedrock Agent-কে দিয়ে AWS-এ কাজ করানো |
| `GenerateCrewaiAutomationTool` | CrewAI Automation workflow তৈরি |
| `InvokeCrewAIAutomationTool` | তৈরি করা Automation workflow চালানো |

এই বিভাগটা মূলত [Cloud & Storage](/docs/built-in-tools/cloud-storage) আর [Automation](/docs/built-in-tools/automation) বিভাগের কিছু Tool-এর সাথে ওভারল্যাপ করে — আলাদা করে এর নিজস্ব কোনো নতুন Tool-সেট নেই, বরং এটা একটা "এন্টারপ্রাইজ-লেভেল সংযোগ" ধারণা।
