---
title: MCP
description: ধাপ ১৪ — গুদামের সিস্টেম আলাদা কোম্পানির; MCPAdapter দিয়ে বাইরের সার্ভারের টুলও নিজের এজেন্টে জুড়ে নাও।
icon: Plug
---

## গল্প

রূপসী ফ্যাশনের গুদাম এখন বড় হয়েছে। স্টকের হিসাব রাখে অন্য একটা সিস্টেম — অন্য কোম্পানির সার্ভার, ভিন্ন কোডবেস।

করিম ভাই বললেন, "আমরা তাদের কোড কপি করব না, টুলও নিজেরা লিখব না। সিস্টেমটা তো আগেই একটা দরজা খুলে রেখেছে — **MCP**। আমরা সেই দরজা দিয়ে ঢুকব।"

## LangGraph-এ এই একই জিনিস

**MCP (Model Context Protocol)** হলো টুল শেয়ার করার একটা স্ট্যান্ডার্ড। কেউ টুল বানিয়ে সার্ভারে রাখে, তুমি ক্লায়েন্ট হিসেবে তার তালিকা নিয়ে নিজের এজেন্টে বসিয়ে দাও।

```python
from langchain.mcp import MCPAdapter

async with MCPAdapter(Path("mcp_server.py")) as adapter:
    tools = await adapter.list_tools()
```

যা পাওয়া যায়, সেটা `@tool` দিয়ে বানানো টুলের মতোই — `create_agent` বা `ToolNode`-এ সোজা বসে যায়।

## ধাপ ১ — নিজের টুল সার্ভার (`mcp_server.py`)

```python
from fastmcp import FastMCP

mcp = FastMCP("rupashi-warehouse")


@mcp.tool()
def stock_lookup(fabric: str) -> str:
    """গুদামে কোনো কাপড়ের স্টক কত মিটার আছে তা দেখে।"""
    stock = {"মাটি-রঙা উল": 42, "নীল তুলা": 8, "সাদা লিনেন": 120}
    return f"{fabric}: {stock.get(fabric, 0)} মিটার"


if __name__ == "__main__":
    mcp.run()
```

এটাই সেই "বাইরের সিস্টেম"। শেখার জন্য আমরা নিজের ফোল্ডারেই রাখছি, কিন্তু ভাবো এটা অন্য কোম্পানির সার্ভার।

## ধাপ ২ — প্যাকেজ ইনস্টল

```bash
pip install -U "langchain[mcp]" mcp fastmcp
```

## ধাপ ৩ — ক্লায়েন্ট (`mcp_project.py`)

```python
import asyncio
from pathlib import Path

from langchain.agents import create_agent
from langchain.mcp import MCPAdapter

from llm import model


async def main():
    async with MCPAdapter(Path("mcp_server.py")) as adapter:
        tools = await adapter.list_tools()
        print("পাওয়া টুল:", [t.name for t in tools])

        agent = create_agent(
            model=model,
            tools=tools,
            system_prompt="তুমি রূপসী ফ্যাশনের সহকারী। গুদামের তথ্য MCP টুল থেকে নাও।",
        )

        result = await agent.ainvoke(
            {"messages": [{"role": "user", "content": "মাটি-রঙা উলের স্টক কত?"}]}
        )
        print(result["messages"][-1].content)


asyncio.run(main())
```

## বাস্তবে কী ঘটে

```text
পাওয়া টুল: ['stock_lookup']
মাটি-রঙা উলের স্টক ৪২ মিটার।
```

নিজের কোডে `stock_lookup` লেখা হয়নি — শুধু দরজা দিয়ে তালিকা নেওয়া হয়েছে। সার্ভারের দিকে টুল বদলালে ক্লায়েন্ট কোড বদলাতে হবে না।

## দূরের সার্ভার হলে

```python
from fastmcp.client.transports import StreamableTransport

async with MCPAdapter(StreamableTransport("http://127.0.0.1:8000/mcp")) as adapter:
    tools = await adapter.list_tools()
```

শুধু ঠিকানা বদলায় — বাকি কোড একই।

## নতুন কী শিখলে

- MCP = টুল শেয়ার করার স্ট্যান্ডার্ড, দুই পাশে সার্ভার আর ক্লায়েন্ট
- `MCPAdapter` এক জায়গায় সব MCP টুল নিয়ে আসে, এজেন্টে সোজা বসে
- ক্লায়েন্ট কোড **async** — `await`, `asyncio.run`, `agent.ainvoke`

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: langchain.mcp` | `pip install "langchain[mcp]"` (extra-টা সহ) |
| সার্ভার পাওয়া যাচ্ছে না | `Path("mcp_server.py")` — সঠিক ফাইলের পথ? |
| `RuntimeError: no running event loop` | `await` শুধু `async def`-এর ভেতরে; বাইরে `asyncio.run(main())` |
| নতুন টুল দেখা যাচ্ছে না | সার্ভার রিস্টার্ট করে আবার `list_tools()` নাও |

পরের ধাপে [Full Project](/langgraph/full-project) — সবকিছু এক পাইপলাইনে।
