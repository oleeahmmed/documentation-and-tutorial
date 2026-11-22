---
title: MCP Integration
description: MCP সার্ভারের সাথে Agent সংযুক্ত করার সহজ বাংলা গাইড।
icon: Plug
---

MCP (Model Context Protocol) হলো CrewAI-এর Agent-কে **বাইরের, স্বাধীন সিস্টেমের সাথে সংযুক্ত করার** উপায় — এটা [Built In Tools](/docs/built-in-tools) থেকে আলাদা, কারণ এখানে Tool-টা CrewAI নিজে বানায়নি, বরং একটা সম্পূর্ণ আলাদা সার্ভার (তোমার নিজের বানানো বা বাইরের কোম্পানির) থেকে এসেছে।

## MCP Integration Overview

**ইনস্টলেশন:**

```bash
pip install mcp
pip install 'crewai-tools[mcp]'
```

**যেকোনো MCP সংযোগের নিয়ম সবসময় একই, ৩ ধাপ:**

```python
# ধাপ ১: কোন সার্ভারের সাথে সংযোগ, তা বলো (mcps বা MCPServerAdapter দিয়ে)
# ধাপ ২: Agent-কে সেই সংযোগ থেকে পাওয়া tools দাও
# ধাপ ৩: দরকার হলে authentication/headers কনফিগার করো
```

## পদ্ধতি ১: Simple DSL (সহজ, রেকমেন্ডেড)

সরাসরি Agent-এর `mcps` প্যারামিটারে সার্ভারের ঠিকানা বসিয়ে দাও।

| ব্যবহার | কোড |
| --- | --- |
| দূরবর্তী সার্ভার (URL দিয়ে) | `mcps=["https://example.com/mcp"]` |
| নির্দিষ্ট একটা টুল শুধু | `mcps=["https://example.com/mcp#check_stock"]` |
| লোকাল প্রোগ্রাম (stdio) | `mcps=[MCPServerStdio(command="python", args=["server.py"])]` |
| দূরবর্তী সার্ভার (অথেনটিকেশন সহ) | `mcps=[MCPServerHTTP(url="...", headers={...})]` |

**উদাহরণ:**

```python
from crewai import Agent
from crewai.mcp import MCPServerStdio

researcher = Agent(
    role="বাজার গবেষক",
    goal="পাইকারি বাজারের সঠিক তথ্য আনা",
    backstory="তুমি বাইরের ডেটা-সোর্সের সাথে সংযুক্ত।",
    mcps=[
        MCPServerStdio(command="python", args=["mcp_server.py"])
    ],
)
```

**বড় সুবিধা:** `with` ব্লক বা `try/finally` লাগে না — CrewAI নিজেই সংযোগ খোলা-বন্ধ করে।

## পদ্ধতি ২: MCPServerAdapter (অ্যাডভান্সড, বেশি নিয়ন্ত্রণ)

| ব্যবহার | কোড |
| --- | --- |
| লোকাল সার্ভার (stdio) | `StdioServerParameters(command="python", args=[...])` |
| দূরবর্তী সার্ভার (SSE) | `{"url": "http://localhost:8000/sse", "transport": "sse"}` |
| সংযোগ খোলা (with ব্লক) | `with MCPServerAdapter(params) as tools:` |
| নির্দিষ্ট টুল শুধু | `MCPServerAdapter(params, "check_stock", "check_price")` |
| সংযোগ ম্যানুয়াল বন্ধ | `adapter.stop()` |

**উদাহরণ:**

```python
import os

from crewai import Agent
from crewai_tools import MCPServerAdapter
from mcp import StdioServerParameters

server_params = StdioServerParameters(
    command="python",
    args=["mcp_server.py"],
    env={"UV_PYTHON": "3.12"},
)

with MCPServerAdapter(server_params) as mcp_tools:
    researcher = Agent(
        role="বাজার গবেষক",
        goal="...",
        backstory="...",
        tools=mcp_tools,  # সব MCP টুল একসাথে
    )
    # ... Task, Crew, kickoff এই ব্লকের ভেতরেই থাকবে
```

`with` ছাড়া ম্যানুয়ালি চালাতে চাইলে:

```python
adapter = MCPServerAdapter(server_params)
try:
    tools = adapter.tools
    # ... Agent / Task / Crew ...
finally:
    adapter.stop()
```

**কখন কোনটা ব্যবহার করবে:**

| | `mcps=[...]` (সহজ) | `MCPServerAdapter` (অ্যাডভান্সড) |
| --- | --- | --- |
| কোড পরিমাণ | কম | বেশি |
| নিয়ন্ত্রণ | সাধারণ কাজে যথেষ্ট | একাধিক Agent-এ connection শেয়ার, টাইমআউট কনফিগ |
| সংযোগ ব্যবস্থাপনা | স্বয়ংক্রিয় | ম্যানুয়াল (`with` বা `.stop()`) |

## নিজের MCP সার্ভার বানানো (FastMCP)

```python
# mcp_server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("আমার সার্ভার")

@mcp.tool()
def check_stock(item: str) -> str:
    """একটা পণ্যের স্টক জানায়।"""
    return f"{item}-এর স্টক: ৪৫০ পিস।"

if __name__ == "__main__":
    mcp.run()  # stdio ট্রান্সপোর্ট
```

**টেস্ট করো (CrewAI ছাড়াই):**

```bash
npx @modelcontextprotocol/inspector python mcp_server.py
```

## ট্রান্সপোর্ট টাইপ (সার্ভার কীভাবে সংযুক্ত)

| ট্রান্সপোর্ট | কখন ব্যবহার করবে | ক্লাস |
| --- | --- | --- |
| **Stdio** | লোকাল প্রোগ্রাম, একই কম্পিউটারে চলে | `MCPServerStdio` |
| **HTTP** | দূরবর্তী, ওয়েবে হোস্ট করা সার্ভার | `MCPServerHTTP` |
| **SSE** | দূরবর্তী, স্ট্রিমিং-ভিত্তিক সার্ভার | `MCPServerSSE` / `{"url": ".../sse", "transport": "sse"}` |

**HTTP সার্ভার + অথেনটিকেশন:**

```python
from crewai.mcp import MCPServerHTTP

MCPServerHTTP(
    url="https://example.com/mcp",
    headers={"Authorization": "Bearer my-token"},
)
```

## Tool Filtering — নির্দিষ্ট কিছু টুলই চাও

| পদ্ধতি | কোড |
| --- | --- |
| DSL-এ (`mcps`) | `tool_filter=create_static_tool_filter(allowed_tool_names=["check_stock"])` |
| `MCPServerAdapter`-এ | `MCPServerAdapter(params, "check_stock")` |

```python
from crewai.mcp import MCPServerStdio
from crewai.mcp.filters import create_static_tool_filter

MCPServerStdio(
    command="python",
    args=["mcp_server.py"],
    tool_filter=create_static_tool_filter(
        allowed_tool_names=["check_stock", "check_price"],
        blocked_tool_names=["delete_all"],
    ),
)
```

## একাধিক MCP সার্ভার একসাথে

```python
from crewai import Agent
from crewai.mcp import MCPServerStdio

researcher = Agent(
    role="...",
    goal="...",
    backstory="...",
    mcps=[
        MCPServerStdio(command="python", args=["mcp_server.py"]),  # লোকাল
        "https://weather-mcp.example.com/mcp",  # দূরবর্তী
    ],
)
```

CrewAI স্বয়ংক্রিয়ভাবে দুটো সার্ভার থেকেই সব টুল একত্র করে দেয়।

## নিরাপত্তা — মাথায় রাখতে হবে

| নিয়ম | কারণ |
| --- | --- |
| শুধু বিশ্বাসযোগ্য সার্ভারে সংযোগ দাও | অচেনা সার্ভার ক্ষতিকর কাজ করাতে পারে |
| DNS Rebinding থেকে সতর্ক থাকো | HTTP/SSE সার্ভারে এই আক্রমণের ঝুঁকি থাকে |
| `env`-এ শুধু দরকারি ভেরিয়েবল দাও | পুরো `os.environ` দিলে অনেক secret ফাঁস হতে পারে |
| মনে রাখো, শুধু "tools" সাপোর্ট করে | MCP-এর prompts/resources আলাদাভাবে আসে না |

## সারসংক্ষেপ — Built-in Tools বনাম MCP

| | Built-in Tools | MCP |
| --- | --- | --- |
| উৎস | CrewAI/crewai-tools প্যাকেজে আগে থেকেই আছে | বাইরের/নিজের বানানো স্বাধীন সার্ভার |
| ইনস্টল | `pip install 'crewai[tools]'` | `pip install mcp 'crewai-tools[mcp]'` |
| ব্যবহার | `from crewai_tools import X; tools=[X()]` | `mcps=[...]` অথবা `MCPServerAdapter` |
| উদাহরণ | `FileReadTool`, `SerperDevTool` | নিজের `mcp_server.py`, বা বাইরের MCP সার্ভার |

এই টেবিলগুলোই তোমার MCP ইন্টিগ্রেশনের দ্রুত রেফারেন্স — যেকোনো প্রজেক্টে এখান থেকে সরাসরি কপি করে বসিয়ে নিতে পারো।
