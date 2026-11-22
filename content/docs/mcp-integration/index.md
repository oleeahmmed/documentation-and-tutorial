---
title: MCP Integration
description: Connect agents to external systems through MCP servers.
icon: Plug
---

> এই পেজটা [Built In Tools](/docs/built-in-tools) পেজের ধারাবাহিকতা — রেডিমেড টুলের পর এবার বাইরের সিস্টেমের সাথে সত্যিকারের সংযোগ।

## MCP Integration

### বাস্তব গল্প (রূপসী ফ্যাশন)

রফিকের হাতে এখন নিজের বানানো দাম-চেকার, আর কিছু রেডিমেড টুল। কিন্তু করিম ভাই চান আরও বেশি — তিনি চান রফিক সরাসরি **পাইকারি বাজারের তথ্য-কেন্দ্রের** সাথে যুক্ত হোক, যেখানে লাইভ স্টক, পাইকারি দাম আর সাপ্লায়ারের তথ্য আছে।

সমস্যা হলো, ওই তথ্য-কেন্দ্র করিম ভাইয়ের নিজের বানানো একটা আলাদা সিস্টেম — CrewAI-র সাথে এর কোনো সম্পর্ক নেই। তাহলে রফিক কীভাবে এটা ব্যবহার করবে?

সমাধান — তথ্য-কেন্দ্রটাকে একটা **স্ট্যান্ডার্ড দরজা** দিয়ে বানানো হবে, যেটা যেকোনো AI এজেন্ট চিনে নিতে পারে। সেই স্ট্যান্ডার্ডের নাম **MCP (Model Context Protocol)**।

### CrewAI-তে এই একই জিনিস

MCP হলো একটা খোলা স্ট্যান্ডার্ড, যার মাধ্যমে যেকোনো বাইরের সার্ভিসকে (ডেটাবেস, স্টক-সিস্টেম, GitHub, Slack) “টুলের ভাণ্ডার” বানিয়ে Agent-এর হাতে দেওয়া যায়। CrewAI-তে এই সংযোগের দুইটা উপায়:

| উপায় | কখন ব্যবহার করবে |
| --- | --- |
| `mcps=[...]` (সহজ DSL, রেকমেন্ডেড) | সাধারণ ক্ষেত্রে — Agent-এর গায়েই সংযোগ বসিয়ে দাও |
| `MCPServerAdapter` (অ্যাডভান্সড) | একাধিক Agent একই সংযোগ শেয়ার করবে, বা নিজে খোলা-বন্ধ সামলাবে |

> ⚠️ শুধু **বিশ্বাসযোগ্য** MCP সার্ভারে সংযোগ দাও — অচেনা সার্ভার তোমার Agent-এর মাধ্যমে ক্ষতিকর কাজ করাতে পারে।

### ইনস্টলেশন

```bash
pip install "mcp[cli]"              # নিজের MCP সার্ভার বানানোর জন্য (FastMCP)
pip install 'crewai-tools[mcp]'     # MCPServerAdapter-এর জন্য
```

সহজ DSL (`mcps=[...]`) ব্যবহার করলে শুধু `mcp` প্যাকেজটাই যথেষ্ট।

### ধাপ ১: নিজের MCP সার্ভার বানাও (`mcp_server.py`)

এটাই রূপসী ফ্যাশনের “পাইকারি বাজারের তথ্য-কেন্দ্র”। খেয়াল করো — এই ফাইলটা CrewAI-র সাথে সম্পূর্ণ আলাদা, নিজে থেকেই চলতে পারে:

```python
# mcp_server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Wholesale Market Info Desk")

STOCK_DB = {
    "উলের ওভারকোট": {"stock": 450, "price": "১৭০০ টাকা", "supplier": "ঢাকা উল হাউস"},
    "চাদর": {"stock": 1200, "price": "৯০০ টাকা", "supplier": "রংপুর তাঁত ঘর"},
    "মাফলার": {"stock": 80, "price": "৩৫০ টাকা", "supplier": "বগুড়া নিট কারখানা"},
}

@mcp.tool()
def check_stock(item: str) -> str:
    """একটা নির্দিষ্ট ফ্যাশন আইটেমের বর্তমান স্টক পরিমাণ জানায়।"""
    data = STOCK_DB.get(item)
    if not data:
        return f"'{item}' নামে কোনো পণ্য পাওয়া যায়নি।"
    return f"{item}-এর বর্তমান স্টক: {data['stock']} পিস।"

@mcp.tool()
def check_price(item: str) -> str:
    """একটা নির্দিষ্ট ফ্যাশন আইটেমের পাইকারি দাম জানায়।"""
    data = STOCK_DB.get(item)
    if not data:
        return f"'{item}' নামে কোনো পণ্যের দাম তথ্য নেই।"
    return f"{item}-এর পাইকারি দাম: {data['price']}।"

@mcp.tool()
def get_supplier(item: str) -> str:
    """একটা নির্দিষ্ট ফ্যাশন আইটেমের সাপ্লায়ারের নাম জানায়।"""
    data = STOCK_DB.get(item)
    if not data:
        return f"'{item}'-এর কোনো সাপ্লায়ার তথ্য নেই।"
    return f"{item}-এর সাপ্লায়ার: {data['supplier']}।"

if __name__ == "__main__":
    mcp.run()   # ডিফল্টভাবে stdio দিয়ে চলে
```

- `@mcp.tool()` — যে ফাংশনে এই ডেকোরেটর আছে, সেটাই MCP-এর একটা “টুল”
- ফাংশনের **ডকস্ট্রিং** খুব জরুরি — Agent এটাই পড়ে বোঝে টুলটা কী কাজে লাগে
- `mcp.run()` — সার্ভার চালু হয়, stdin/stdout দিয়ে কথা বলার জন্য তৈরি থাকে

CrewAI-র সাথে জোড়ার আগে সার্ভারটা আলাদা করে টেস্ট করতে পারো:

```bash
npx @modelcontextprotocol/inspector python mcp_server.py
```

ব্রাউজারে খোলা Inspector-এ `check_stock`, `check_price`, `get_supplier` সরাসরি চালিয়ে দেখো।

### ধাপ ২: Agent-এর সাথে জোড়া — সহজ DSL (রেকমেন্ডেড)

```python
from crewai import Agent, Task, Crew, Process
from crewai.mcp import MCPServerStdio

researcher = Agent(
    role="বাজার গবেষক",
    goal="ফ্যাশন ট্রেন্ড ও পাইকারি বাজারের সঠিক তথ্য খুঁজে বের করা",
    backstory="তুমি রফিক। পাইকারি বাজারের তথ্য-কেন্দ্রের সাথে তোমার সরাসরি সংযোগ আছে।",
    mcps=[
        MCPServerStdio(
            command="python",
            args=["mcp_server.py"],
            env={"UV_PYTHON": "3.12"}   # শুধু দরকারি variable, পুরো os.environ নয়
        )
    ]
)

research_task = Task(
    description=(
        "'{item}'-এর জন্য বর্তমান স্টক, দাম এবং সাপ্লায়ারের তথ্য "
        "পাইকারি বাজারের তথ্য-কেন্দ্র থেকে যাচাই করে একটা সংক্ষিপ্ত রিপোর্ট বানাও।"
    ),
    expected_output="স্টক, দাম ও সাপ্লায়ারের তথ্যসহ একটা ছোট রিপোর্ট।",
    agent=researcher
)

crew = Crew(agents=[researcher], tasks=[research_task], process=Process.sequential)
result = crew.kickoff(inputs={"item": "উলের ওভারকোট"})
print(result.raw)
```

`with` ব্লক বা `try/finally`-এর দরকার নেই — CrewAI নিজেই Agent-এর জীবনচক্র অনুযায়ী সংযোগ খোলে আর বন্ধ করে।

### ধাপ ৩: `MCPServerAdapter` (অ্যাডভান্সড)

যখন একই সংযোগ একাধিক Agent-এর মধ্যে শেয়ার করতে হবে, বা নিজে খোলা-বন্ধ নিয়ন্ত্রণ করতে হবে:

```python
from mcp import StdioServerParameters
from crewai_tools import MCPServerAdapter
from crewai import Agent, Task, Crew, Process

server_params = StdioServerParameters(
    command="python",
    args=["mcp_server.py"]
)

with MCPServerAdapter(server_params) as mcp_tools:
    print("সংযুক্ত টুল:", [tool.name for tool in mcp_tools])

    researcher = Agent(
        role="বাজার গবেষক",
        goal="পাইকারি বাজারের সঠিক তথ্য খুঁজে বের করা",
        backstory="তুমি রফিক, পাইকারি বাজারের তথ্য-কেন্দ্রের সাথে যুক্ত।",
        tools=mcp_tools
    )

    research_task = Task(
        description="'{item}'-এর স্টক, দাম আর সাপ্লায়ার যাচাই করে রিপোর্ট বানাও।",
        expected_output="স্টক, দাম ও সাপ্লায়ারের তথ্যসহ রিপোর্ট।",
        agent=researcher
    )

    crew = Crew(agents=[researcher], tasks=[research_task], process=Process.sequential)
    result = crew.kickoff(inputs={"item": "উলের ওভারকোট"})
```

`with` ব্লক ব্যবহার না করলে নিজে বন্ধ করতে হবে, নাহলে সার্ভার ব্যাকগ্রাউন্ডে চালু থেকে যাবে:

```python
adapter = MCPServerAdapter(server_params)
try:
    tools = adapter.tools
    # ... Agent, Task, Crew, kickoff ...
finally:
    adapter.stop()   # 👈 বাধ্যতামূলক
```

### দূরবর্তী (Remote) সার্ভার — HTTP/SSE

সার্ভারটা যদি তোমার কম্পিউটারে না থেকে কোনো ওয়েব সার্ভারে থাকে:

```python
from crewai.mcp import MCPServerHTTP, MCPServerSSE

mcps=[
    MCPServerHTTP(
        url="https://wholesale-market-mcp.example.com/mcp",
        headers={"Authorization": "Bearer my-secret-token"}
    ),
    MCPServerSSE(url="https://stream.example.com/mcp/sse"),

    # সবচেয়ে সহজ — শুধু URL স্ট্রিং
    "https://weather-mcp.example.com/mcp"
]
```

`MCPServerAdapter` দিয়েও দূরবর্তী সার্ভার চলে:

```python
server_params = {"url": "http://localhost:8000/sse", "transport": "sse"}

with MCPServerAdapter(server_params) as mcp_tools:
    ...
```

### নির্দিষ্ট টুল-ই চাও — Tool Filtering

ধরো সাপ্লায়ারের তথ্য গোপনীয়, তাই রফিক শুধু `check_stock` আর `check_price` ব্যবহার করবে:

```python
from crewai.mcp import MCPServerStdio
from crewai.mcp.filters import create_static_tool_filter

MCPServerStdio(
    command="python",
    args=["mcp_server.py"],
    tool_filter=create_static_tool_filter(
        allowed_tool_names=["check_stock", "check_price"],
        blocked_tool_names=["get_supplier"]
    )
)
```

`MCPServerAdapter`-এ টুলের নাম পাস করে দিলেই হয়:

```python
with MCPServerAdapter(server_params, "check_stock", "check_price") as mcp_tools:
    ...
```

অথবা নাম ধরে একটা টুল বেছে নেওয়া যায়: `mcp_tools["check_stock"]`।

`blocked_tool_names` দিয়ে নিষিদ্ধও করা যায়, আর `create_dynamic_tool_filter` দিয়ে Agent-এর role অনুযায়ী কোন টুল দেখা যাবে তা ঠিক করা যায় — রফিক এখন `get_supplier`-এর কথা জানেই না।

### একাধিক MCP সার্ভার একসাথে

শীতকালীন পণ্যের চাহিদা আবহাওয়ার উপরও নির্ভর করে — তাই পাইকারি বাজার আর আবহাওয়ার তথ্য, দুটোই একসাথে:

```python
researcher = Agent(
    role="বাজার গবেষক",
    goal="...",
    backstory="...",
    mcps=[
        MCPServerStdio(command="python", args=["mcp_server.py"]),   # নিজের সার্ভার
        "https://weather-mcp.example.com/mcp"                        # বাইরের সার্ভার
    ]
)
```

CrewAI দুটো সার্ভার থেকেই সব টুল একত্র করে Agent-এর হাতে দেয়।

### বাস্তবে কী ঘটে — টার্মিনালে যা দেখবে

```text
সংযুক্ত MCP টুল: ['check_stock', 'check_price', 'get_supplier']

Thought: "উলের ওভারকোট"-এর স্টক, দাম আর সাপ্লায়ার জানতে হবে।

Action: check_stock
Action Input: {"item": "উলের ওভারকোট"}
Observation: উলের ওভারকোট-এর বর্তমান স্টক: ৪৫০ পিস।

Action: check_price
Action Input: {"item": "উলের ওভারকোট"}
Observation: উলের ওভারকোট-এর পাইকারি দাম: ১৭০০ টাকা।

Action: get_supplier
Action Input: {"item": "উলের ওভারকোট"}
Observation: উলের ওভারকোট-এর সাপ্লায়ার: ঢাকা উল হাউস।

===== চূড়ান্ত ফলাফল =====
- স্টক: ৪৫০ পিস
- পাইকারি দাম: ১৭০০ টাকা
- সাপ্লায়ার: ঢাকা উল হাউস
```

রফিক তিনটা আলাদা টুল আলাদা করে কল করেছে, সত্যিকারের ডেটা এনেছে, তারপর সব মিলিয়ে রিপোর্ট বানিয়েছে — কোনো আন্দাজ নয়।

### নিরাপত্তা — ভুলে গেলে চলবে না

1. **শুধু বিশ্বাসযোগ্য সার্ভারে সংযোগ দাও** — অচেনা URL-এর সার্ভার Agent-এর মাধ্যমে ক্ষতিকর কাজ করাতে পারে।
2. **DNS Rebinding থেকে সতর্ক থাকো** — SSE সার্ভার ব্যবহার করলে Origin হেডার যাচাই করো, আর সার্ভারকে `0.0.0.0`-তে খুলো না; শুধু `127.0.0.1`-এ বাঁধো।
3. **পুরো environment পাঠিও না** — `env={**os.environ}` দিলে তোমার API key-ও সার্ভারের কাছে চলে যাবে। শুধু দরকারি variable দাও।
4. **MCP-এর সবকিছু এখনো আসে না** — `MCPServerAdapter` মূলত MCP-এর `tools` সাপোর্ট করে; `prompts` আর `resources` সরাসরি CrewAI কম্পোনেন্ট হিসেবে পাওয়া যায় না।

### সাধারণ সমস্যা ও সমাধান

| সমস্যা | কারণ ও সমাধান |
| --- | --- |
| `tools` লিস্ট খালি | `mcp_server.py`-তে `@mcp.tool()` ঠিক আছে কিনা, `mcp.run()` কল হচ্ছে কিনা দেখো |
| `Connection failed` | `args=["mcp_server.py"]`-এর পাথ ঠিক আছে কিনা, `python` PATH-এ আছে কিনা চেক করো |
| Agent টুল কল করছে না | ফাংশনের ডকস্ট্রিং স্পষ্ট কিনা দেখো — Agent এটাই পড়ে বোঝে |
| স্ক্রিপ্ট hang করছে | ম্যানুয়াল Adapter ব্যবহার করলে `.stop()` কল করেছ কিনা দেখো |

### দুই উপায়ের তুলনা

| | `mcps=[...]` DSL | `MCPServerAdapter` |
| --- | --- | --- |
| কোড | কম — সরাসরি Agent-এ | বেশি — `with` বা try/finally লাগে |
| সংযোগের জীবনচক্র | CrewAI নিজে সামলায় | তুমি নিজে সামলাও |
| নিয়ন্ত্রণ | কম, কিন্তু সাধারণ কাজে যথেষ্ট | বেশি — একাধিক Agent সংযোগ শেয়ার, `connect_timeout` |
| কখন | সাধারণ, দ্রুত সেটআপ | বড়, জটিল প্রজেক্ট |

### পরের ধাপ

- [Built In Tools](/docs/built-in-tools) — রেডিমেড টুলের ভাণ্ডারে ফিরে যেতে চাইলে
- [Tools](/docs/core-concepts/tools) — নিজের টুল বানানো শিখতে
- [Agent Capabilities](/docs/core-concepts/agent-capabilities) — পাঁচটা সক্ষমতার তালিকা
