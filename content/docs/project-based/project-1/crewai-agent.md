---
title: পর্ব ৩ — CrewAI এজেন্ট ও Django সেতু
description: ছোট ছোট ১৩টা ধাপে দুই CrewAI এজেন্ট — venv ও .env থেকে শুরু, তারপর LLM, agent, task, tool, crew, run, শেষে Django সেতু।
icon: Bot
---

> **পরিকল্পনা:** পর্ব ১-এ অর্ডার এলো, পর্ব ২-এ ড্যাশবোর্ডে দেখা গেল — কিন্তু সব `Pending AI Check`। আজ দুই AI কর্মী নিয়োগ করব। কাজটা একবারে নয় — **ছোট ছোট ১৩টা ধাপ**, প্রতিটার শেষে একটা ছোট কমান্ড চালিয়ে নিজেই যাচাই করবে। কোনো ধাপে আটকে গেলে সেখানেই থামো, সমস্যা মিটিয়ে তারপর পরের ধাপে যাও।

## ধাপগুলো এক নজরে

```text
১. ঘর + venv          ২. .env চাবি        ৩. খালি ফাইল
৪. LLM                ৫. এজেন্ট            ৬. কাজের স্লিপ
৭. যন্ত্র (tool)       ৮. যন্ত্র এজেন্টের হাতে
৯. দল (crew)          ১০. দল চালানোর method + test_run
১১. run_order দরজা    ১২. Django সেতু      ১৩. পুরো ফ্লো টেস্ট
```

| ধাপ | কী বানাবে | ফাইল |
| --- | --- | --- |
| ১ | এজেন্টদের আলাদা ঘর ও venv | `ai_agents/venv/` |
| ২ | OpenRouter key | `ai_agents/.env` |
| ৩ | দরকারি খালি ফাইল | `llm_config.py` ইত্যাদি |
| ৪ | মস্তিষ্ক (LLM) | `llm_config.py` |
| ৫ | দুই কর্মী | `agents.py` |
| ৬ | দুই কাজের স্লিপ | `tasks.py` |
| ৭ | কুরিয়ার আর WhatsApp যন্ত্র | `tools.py` |
| ৮ | যন্ত্র এজেন্টের হাতে | `agents.py` (আপডেট) |
| ৯ | দল | `crew.py` |
| ১০ | দল চালানোর method + প্রথম টেস্ট | `crew.py`, `test_run.py` |
| ১১ | Django থেকে ডাকার দরজা | `run_order.py` |
| ১২ | Django সেতু | `orders/agent.py`, `views.py`, `urls.py` |
| ১৩ | webhook → এজেন্ট → ড্যাশবোর্ড | — |

> **মনে রাখো:** এজেন্টরা Django-র ভেতরে নয় — আলাদা `ai_agents/` ফোল্ডারে, নিজের venv নিয়ে। Django শুধু একটা সাব-প্রসেস চালিয়ে ফলাফল নেবে। এতেই দুই পাইথনের সংঘর্ষ এড়ানো যায়।

---

## ধাপ ১: ঘর আর venv

প্রজেক্টের `backend` আর `frontend`-এর পাশে নতুন ফোল্ডার:

```bash
cd fraud_shield_pro
mkdir ai_agents
cd ai_agents
python -m venv venv
```

venv চালু করো:

```bash
# Windows — Git Bash
source venv/Scripts/activate

# Windows — PowerShell
.\venv\Scripts\Activate.ps1

# Mac / Linux
source venv/bin/activate
```

তারপর:

```bash
pip install --upgrade pip
pip install crewai crewai-tools python-dotenv pydantic
pip freeze > requirements.txt
```

প্রম্পটের শুরুতে `(venv)` দেখলেই বুঝবে ঘর চালু হয়েছে। **এরপরের সব কমান্ড এই ফোল্ডার থেকেই** — নাহলে `No module named 'crew'` আসবে।

**✅ যাচাই:**

```bash
python -c "import crewai; print('crewai ok')"
```

---

## ধাপ ২: `.env` — চাবি

`ai_agents/`-এ `.env` ফাইল বানাও:

```text
OPENROUTER_API_KEY="sk-or-v1-তোমার_নিজের_KEY"
OPENROUTER_MODEL_NAME="openrouter/nvidia/nemotron-3-ultra-550b-a55b:free"
```

আর `.gitignore`:

```text
.env
venv/
__pycache__/
```

> key কখনো কোডে, git-এ বা চ্যাটে দিও না। ফ্রি মডেল বন্ধ হলে OpenRouter থেকে tool চালাতে পারে এমন আরেকটা মডেলের slug বসাও — শুধু এই ফাইলে।

---

## ধাপ ৩: প্রয়োজনীয় খালি ফাইল

এক ফাইলে সব ঢুকালে পরে খুঁজে পাবে না। তাই আলাদা আলাদা:

```bash
touch llm_config.py tools.py agents.py tasks.py crew.py run_order.py test_run.py
```

| ফাইল | গল্পে | কাজ |
| --- | --- | --- |
| `llm_config.py` | মস্তিষ্ক | একটাই LLM, সবাই ব্যবহার করে |
| `agents.py` | কর্মী | কে, কী লক্ষ্য |
| `tasks.py` | কাজের স্লিপ | কী করতে হবে + রিপোর্টের ফরম্যাট |
| `tools.py` | যন্ত্র | কুরিয়ার চেক, WhatsApp |
| `crew.py` | দল | সবাইকে একসাথে নামানো |
| `run_order.py` | দরজা | Django থেকে JSON নিয়ে ফলাফল ফেরত |
| `test_run.py` | প্রথম ডেমো | নকল অর্ডার দিয়ে টেস্ট |

---

## ধাপ ৪: মস্তিষ্ক — `llm_config.py`

সবার একটাই LLM। তাই আগে এটা, তারপর বাকিরা:

```python
import os

from dotenv import load_dotenv
from crewai import LLM

load_dotenv()

# কিছু টার্মিনাল NO_PROXY-তে [::1] বসায় — এতে httpx ক্র্যাশ করে
for key in ("NO_PROXY", "no_proxy"):
    value = os.environ.get(key)
    if value and "[::1]" in value:
        os.environ[key] = ",".join(part for part in value.split(",") if part.strip() != "[::1]")

openrouter_llm = LLM(
    model=os.getenv(
        "OPENROUTER_MODEL_NAME",
        "openrouter/nvidia/nemotron-3-ultra-550b-a55b:free",
    ),
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)
```

`load_dotenv()` `.env` পড়ে key মেমরিতে ঢোকায়। `base_url`-এ `/api/v1` বাদ দিলে OpenRouter 404 দেয়।

**✅ যাচাই:**

```bash
python -c "from llm_config import openrouter_llm; print(openrouter_llm.model)"
```

আউটপুট: `nvidia/nemotron-3-ultra-550b-a55b:free`

> `InvalidURL: Invalid port: ':1]'` এলে উপরের NO_PROXY লুপটা কাজ করছে কি না দেখো।

---

## ধাপ ৫: প্রথম কর্মী — `agents.py` (এখন খালি হাতে)

এজেন্ট মানে চাকরির বিজ্ঞাপন — **পদবী, লক্ষ্য, পটভূমি**। এখন কোনো যন্ত্র দিচ্ছি না, শুধু কর্মীটাকে চিনি:

```python
from crewai import Agent

from llm_config import openrouter_llm

fraud_analyst_agent = Agent(
    role="E-commerce Fraud & Courier Risk Analyst",
    goal=(
        "Analyze customer phone number and delivery address to detect fake "
        "or high-return orders in Bangladesh."
    ),
    backstory=(
        "You are a senior fraud analyst for Bangladeshi e-commerce stores. "
        "You always check courier return history first using your tool and "
        "inspect if the delivery address is complete."
    ),
    llm=openrouter_llm,
    verbose=True,
)

verification_agent = Agent(
    role="Customer Verification & WhatsApp Specialist",
    goal=(
        "Send a polite Bengali WhatsApp message asking for 120 BDT advance "
        "delivery charge ONLY if the order is HIGH_RISK."
    ),
    backstory=(
        "You represent 'Tanvir Clothing'. If an order is SAFE, you do nothing. "
        "If an order is HIGH_RISK, you write a polite message in Bengali asking "
        "for 120 BDT bKash advance delivery charge and send it using the "
        "WhatsApp tool."
    ),
    llm=openrouter_llm,
    verbose=True,
)
```

**✅ যাচাই:**

```bash
python -c "from agents import fraud_analyst_agent, verification_agent; print(fraud_analyst_agent.role); print(verification_agent.role)"
```

দুই পদবী প্রিন্ট হবে। এখনো কোনো কাজ হয়নি — কর্মী শুধু তৈরি।

---

## ধাপ ৬: কাজের স্লিপ — `tasks.py`

কর্মীকে কাজ দিতে হবে। স্লিপে থাকে **কী করতে হবে** আর **রিপোর্ট কেমন হবে** (Pydantic দিয়ে চারটা ফিল্ড):

```python
from crewai import Task
from pydantic import BaseModel, Field

from agents import fraud_analyst_agent, verification_agent


class FraudAnalysisResult(BaseModel):
    risk_status: str = Field(..., description="Must be either 'SAFE' or 'HIGH_RISK'")
    courier_success_rate: str = Field(..., description="Percentage string like '93.3%' or '20%'")
    ai_analysis_note: str = Field(..., description="Short Bengali summary of why this order is safe or risky")
    whatsapp_sent: bool = Field(..., description="True if WhatsApp message was sent, otherwise False")


analyze_order_task = Task(
    description=(
        "Analyze this new WooCommerce order:\n"
        "Order ID: #{order_id}\n"
        "Customer Name: {customer_name}\n"
        "Phone: {phone}\n"
        "Address: {address}\n"
        "Total Amount: {total_amount} BDT\n\n"
        "Use 'Check Courier Fraud History' tool on the phone number. "
        "Mark as 'HIGH_RISK' if success rate is below 50% OR address is "
        "incomplete; otherwise 'SAFE'."
    ),
    expected_output="Detailed risk assessment report with courier success rate and risk_status.",
    agent=fraud_analyst_agent,
)

verify_and_report_task = Task(
    description=(
        "Based on the Fraud Analyst's report for Order #{order_id} "
        "(Customer: {customer_name}, Phone: {phone}):\n"
        "- If risk_status is 'HIGH_RISK': Use 'Send WhatsApp Verification Message' "
        "tool to send a polite Bengali message asking for 120 BDT bKash advance "
        "delivery charge.\n"
        "- If risk_status is 'SAFE': Do NOT send any WhatsApp message.\n"
        "Return the exact structured JSON output."
    ),
    expected_output="Structured JSON matching FraudAnalysisResult schema.",
    agent=verification_agent,
    context=[analyze_order_task],
    output_pydantic=FraudAnalysisResult,
)
```

| জিনিস | কেন |
| --- | --- |
| `{order_id}`, `{phone}` | ফাঁকা জায়গা — পরে আসল অর্ডার বসবে |
| `context=[analyze_order_task]` | দ্বিতীয় কাজ প্রথম কাজের রিপোর্ট পড়ে সিদ্ধান্ত নেবে |
| `output_pydantic=...` | এলোমেলো গল্প নয় — ঠিক চারটা ফিল্ডের JSON |

> স্লিপে `'Check Courier Fraud History'` আর `'Send WhatsApp Verification Message'` নাম দুটো লিখে রেখেছি — এই নামের যন্ত্রগুলো **পরের ধাপে** বানাব। আগে স্লিপ, পরে যন্ত্র।

**✅ যাচাই:**

```bash
python -c "from tasks import FraudAnalysisResult; print(list(FraudAnalysisResult.model_fields))"
```

আউটপুট: `['risk_status', 'courier_success_rate', 'ai_analysis_note', 'whatsapp_sent']`

---

## ধাপ ৭: যন্ত্র — `tools.py`

এখন যন্ত্র বানাই। `@tool` লাগালেই সাধারণ ফাংশন এজেন্টের ব্যবহারযোগ্য যন্ত্র হয়ে যায়:

```python
from crewai.tools import tool


@tool("Check Courier Fraud History")
def check_courier_history(phone: str) -> str:
    """
    Checks a Bangladeshi customer's previous parcel delivery and return ratio
    across Steadfast and Pathao using their phone number.
    """
    clean_phone = phone.strip().replace("+88", "")

    if clean_phone.startswith("01700"):
        return (
            f"Phone: {clean_phone} | Total Parcels: 10 | Delivered: 2 | Returned: 8 | "
            f"Success Rate: 20% | Status: HIGH_RISK"
        )
    else:
        return (
            f"Phone: {clean_phone} | Total Parcels: 15 | Delivered: 14 | Returned: 1 | "
            f"Success Rate: 93.3% | Status: SAFE"
        )


@tool("Send WhatsApp Verification Message")
def send_whatsapp_message(phone: str, message: str) -> str:
    """
    Sends an automated WhatsApp message to the customer asking for 120 BDT
    advance delivery charge confirmation when the order is HIGH_RISK.
    """
    print(f"\n[WHATSAPP GATEWAY] Sending to {phone}:\n{message}\n")
    return f"WhatsApp message sent to {phone}"
```

| যন্ত্র | এখন | বাস্তবে |
| --- | --- | --- |
| কুরিয়ার চেক | `01700` দিয়ে শুরু হলে নকল রিটার্ন-হিস্ট্রি | Steadfast/Pathao/RedX merchant API |
| WhatsApp | টার্মিনালে প্রিন্ট | WhatsApp Cloud API টেমপ্লেট |

আসল API বসালে শুধু **এই ফাইলের ভেতরটা** বদলাবে।

**✅ যাচাই (API কল ছাড়াই):**

```bash
python -c "from tools import check_courier_history; print(check_courier_history.run(phone='01700998877'))"
```

আউটপুট: `... Returned: 8 | Success Rate: 20% | Status: HIGH_RISK`

---

## ধাপ ৮: যন্ত্র এজেন্টের হাতে

এখন `agents.py`-এ যন্ত্র জুড়বে — উপরে `tools` import, আর দুই এজেন্টের ভেতরে `tools=[...]`:

```python
from crewai import Agent

from llm_config import openrouter_llm
from tools import check_courier_history, send_whatsapp_message
```

প্রথম এজেন্টের ভেতরে (শেষে):

```python
    tools=[check_courier_history],
    llm=openrouter_llm,
    verbose=True,
)
```

দ্বিতীয় এজেন্টের ভেতরে:

```python
    tools=[send_whatsapp_message],
    llm=openrouter_llm,
    verbose=True,
)
```

পূর্ণ `agents.py` এখন এমন:

```python
from crewai import Agent

from llm_config import openrouter_llm
from tools import check_courier_history, send_whatsapp_message

fraud_analyst_agent = Agent(
    role="E-commerce Fraud & Courier Risk Analyst",
    goal=(
        "Analyze customer phone number and delivery address to detect fake "
        "or high-return orders in Bangladesh."
    ),
    backstory=(
        "You are a senior fraud analyst for Bangladeshi e-commerce stores. "
        "You always check courier return history first using your tool and "
        "inspect if the delivery address is complete."
    ),
    tools=[check_courier_history],
    llm=openrouter_llm,
    verbose=True,
)

verification_agent = Agent(
    role="Customer Verification & WhatsApp Specialist",
    goal=(
        "Send a polite Bengali WhatsApp message asking for 120 BDT advance "
        "delivery charge ONLY if the order is HIGH_RISK."
    ),
    backstory=(
        "You represent 'Tanvir Clothing'. If an order is SAFE, you do nothing. "
        "If an order is HIGH_RISK, you write a polite message in Bengali asking "
        "for 120 BDT bKash advance delivery charge and send it using the "
        "WhatsApp tool."
    ),
    tools=[send_whatsapp_message],
    llm=openrouter_llm,
    verbose=True,
)
```

কোন এজেন্ট কোন যন্ত্র পাবে — ঠিক এটাই `tools=[...]` ঠিক করে। প্রথম জন কুরিয়ার দেখতে পারবে, WhatsApp পারবে না; দ্বিতীয় জন উল্টো।

> **টাস্কেও যন্ত্র দেওয়া যায়:** `Task(..., tools=[check_courier_history])` লিখলে ওই কাজটা নিজেও যন্ত্র চালাতে পারে। আমাদের প্রজেক্টে দরকার নেই — এজেন্টের হাতেই যন্ত্র আছে। দুটো জায়গায় একসাথে দিও না, গুলিয়ে যাবে।

**✅ যাচাই:**

```bash
python -c "from agents import fraud_analyst_agent, verification_agent; print([t.name for t in fraud_analyst_agent.tools]); print([t.name for t in verification_agent.tools])"
```

আউটপুট: `['Check Courier Fraud History']` আর `['Send WhatsApp Verification Message']`

---

## ধাপ ৯: দল — `crew.py`

কর্মী তৈরি, কাজের স্লিপ তৈরি, যন্ত্র হাতে — এখন দল গঠন:

```python
from crewai import Crew, Process

from agents import fraud_analyst_agent, verification_agent
from tasks import analyze_order_task, verify_and_report_task

fraud_detection_crew = Crew(
    agents=[fraud_analyst_agent, verification_agent],
    tasks=[analyze_order_task, verify_and_report_task],
    process=Process.sequential,
    verbose=True,
)
```

`Process.sequential` — আগে প্রথম কাজ, শেষ হলে দ্বিতীয় কাজ। এখানে এজেন্ট আর টাস্কের ক্রম একই রাখতে হয়।

**✅ যাচাই:**

```bash
python -c "from crew import fraud_detection_crew; print(len(fraud_detection_crew.agents), 'agents,', len(fraud_detection_crew.tasks), 'tasks')"
```

আউটপুট: `2 agents, 2 tasks`

---

## ধাপ ১০: দল চালানোর method + প্রথম টেস্ট

### `crew.py`-তে method যোগ করো

```python
def execute_fraud_check(order_data: dict) -> dict:
    result = fraud_detection_crew.kickoff(inputs=order_data)
    return result.pydantic.model_dump()
```

- `kickoff(inputs=...)` — স্লিপের `{order_id}`, `{phone}` ফাঁকা জায়গায় আসল অর্ডার বসায়
- `result.pydantic` — চার ফিল্ডের রিপোর্ট
- `model_dump()` — সেটাকে সাধারণ dict বানায়, Django সহজে পড়বে

### `test_run.py` — নকল অর্ডার দিয়ে টেস্ট

```python
import sys

if (sys.stdout.encoding or "").lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

from crew import execute_fraud_check

if __name__ == "__main__":
    test_order = {
        "order_id": "1099",
        "customer_name": "Tariqul Islam",
        "phone": "01700998877",
        "address": "Uttara, Dhaka",
        "total_amount": "2200",
    }

    report = execute_fraud_check(test_order)
    print("\n=== FINAL CLEAN OUTPUT ===\n", report)
```

চালাও:

```bash
python test_run.py
```

ফ্রি মডেলে ১–৩ মিনিট লাগতে পারে। যা দেখবে (মডেলের শব্দ কিছুটা বদলাতে পারে, চারটা ফিল্ড নিশ্চিত):

```text
[WHATSAPP GATEWAY] Sending to 01700998877:
প্রিয় Tariqul Islam, আপনার অর্ডার #1099 কনফার্ম করতে ১২০ টাকা অগ্রিম ডেলিভারি চার্জ bKash করুন...

=== FINAL CLEAN OUTPUT ===
{'risk_status': 'HIGH_RISK', 'courier_success_rate': '20%',
 'ai_analysis_note': 'কুরিয়ার সফলতা হার মাত্র ২০% এবং ডেলিভারি ঠিকানা অসম্পূর্ণ। উভয় কারণেই হাই রিস্ক।',
 'whatsapp_sent': True}
```

**দ্বিতীয় টেস্ট (ভালো কাস্টমার):** `phone` বদলে `01712345678` দাও — `SAFE`, `93.3%`, `whatsapp_sent: False` আসবে। এতে প্রমাণ হবে দুই পথই কাজ করে।

---

## ধাপ ১১: Django থেকে ডাকার দরজা — `run_order.py`

Django আলাদা প্রসেস, তাই কমান্ডলাইনে JSON পাঠিয়ে ফলাফল ফাইলে ফেরত নিতে হবে:

```python
import json
import sys
import traceback

if (sys.stdout.encoding or "").lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
if (sys.stderr.encoding or "").lower() != "utf-8":
    sys.stderr.reconfigure(encoding="utf-8")

from crew import execute_fraud_check

if __name__ == "__main__":
    payload = json.loads(sys.stdin.buffer.read().decode("utf-8"))
    try:
        report = execute_fraud_check(payload)
    except Exception:
        traceback.print_exc()
        sys.exit(1)

    with open(sys.argv[1], "w", encoding="utf-8") as output:
        json.dump(report, output, ensure_ascii=False)
```

| জিনিস | কাজ |
| --- | --- |
| stdin | Django থেকে আসল অর্ডার JSON |
| `sys.argv[1]` | ফলাফল লেখার ফাইল |
| `exit 1` | error হলে Django বুঝবে এজেন্ট চলেনি |

**✅ যাচাই (ঐচ্ছিক, ২–৩ মিনিট):**

```bash
echo '{"order_id":"1","customer_name":"Test","phone":"01700998877","address":"Uttara, Dhaka","total_amount":"1000"}' \
  | python run_order.py result.json

cat result.json
```

`result.json`-এ চার ফিল্ডের JSON থাকবে।

---

## ধাপ ১২: Django সেতু

### ১) `backend/orders/agent.py` (নতুন ফাইল)

```python
import json
import os
import subprocess
import tempfile
import threading
from pathlib import Path

AGENT_DIR = Path(__file__).resolve().parents[2] / 'ai_agents'


def _agent_python():
    if os.name == 'nt':
        return AGENT_DIR / 'venv' / 'Scripts' / 'python.exe'
    return AGENT_DIR / 'venv' / 'bin' / 'python'


def _analyze(order_id):
    from .models import Order

    order = Order.objects.get(pk=order_id)
    payload = {
        'order_id': order.wc_order_id,
        'customer_name': order.customer_name,
        'phone': order.phone,
        'address': order.address,
        'total_amount': str(order.total_amount),
    }

    try:
        with tempfile.TemporaryDirectory() as tmp:
            result_file = Path(tmp) / 'result.json'
            proc = subprocess.run(
                [str(_agent_python()), str(AGENT_DIR / 'run_order.py'), str(result_file)],
                input=json.dumps(payload, ensure_ascii=False),
                text=True,
                encoding='utf-8',
                errors='replace',
                capture_output=True,
                timeout=600,
                cwd=str(AGENT_DIR),
            )
            if proc.returncode != 0:
                raise RuntimeError(proc.stderr.strip()[-500:] or 'agent failed')
            result = json.loads(result_file.read_text(encoding='utf-8'))
    except Exception as exc:
        order.ai_analysis_note = f'এজেন্ট চলেনি: {exc}'
        order.save(update_fields=['ai_analysis_note'])
        return

    risk_status = result.get('risk_status')
    order.risk_status = risk_status if risk_status in ('SAFE', 'HIGH_RISK') else 'PENDING'
    order.courier_success_rate = result.get('courier_success_rate')
    order.ai_analysis_note = result.get('ai_analysis_note')
    order.whatsapp_sent = bool(result.get('whatsapp_sent'))
    order.save(update_fields=[
        'risk_status',
        'courier_success_rate',
        'ai_analysis_note',
        'whatsapp_sent',
    ])


def start_agent(order_id):
    threading.Thread(target=_analyze, args=(order_id,), daemon=True).start()
```

| লাইন | কেন |
| --- | --- |
| `AGENT_DIR` | `backend/orders/` থেকে দুই ধাপ উপরে `ai_agents/` |
| `_agent_python()` | Windows-এ `venv/Scripts/python.exe`, Linux/Mac-এ `venv/bin/python` |
| `subprocess.run` | এজেন্ট আলাদা প্রসেসে — Django-র প্যাকেজের সাথে সংঘর্ষ নেই |
| `timeout=600` | ধীর ফ্রি মডেলেও আটকে না থাকে |
| `threading.Thread` | webhook সাথে সাথে রেসপন্স পায়, এজেন্ট পেছনে চলে |
| exception → note | ড্যাশবোর্ডে "এজেন্ট চলেনি: ..." দেখে বোঝা যায় |

### ২) `backend/orders/views.py` — তিনটা ছোট বদল

উপরে import:

```python
from .agent import start_agent
```

webhook-এ `print(...)` লাইনটার জায়গায়:

```python
        if created:
            start_agent(order.id)
```

নতুন view (নিচে যেকোনো জায়গায়):

```python
@api_view(['POST'])
def analyze_order(request, pk):
    order = get_object_or_404(Order, pk=pk, website__owner=request.user)
    start_agent(order.id)
    return Response({"status": "queued", "order_id": order.id})
```

### ৩) `backend/orders/urls.py` — একটা লাইন

```python
    path('orders/<int:pk>/analyze/', views.analyze_order, name='order-analyze'),
```

`analyze_order` নিজে চেক করে অর্ডারটা `request.user`-এর কি না — অন্যের অর্ডারে চাপ দিলে `404`।

**✅ যাচাই:** Django চালু করে কোনো নিজের অর্ডারের `analyze` endpoint-এ চাপ দাও:

```bash
curl -X POST http://127.0.0.1:8000/api/orders/1/analyze/ -H "Authorization: Token <token>"
```

```json
{"status":"queued","order_id":1}
```

---

## ধাপ ১৩: পুরো ফ্লো — webhook থেকে ড্যাশবোর্ড

দুই সার্ভার চালু, তারপর নতুন অর্ডার:

```bash
curl -X POST http://127.0.0.1:8000/api/orders/webhook/woocommerce/<তোমার_token>/ \
  -H "Content-Type: application/json" \
  -d '{"id":9100,"total":"1550.00","billing":{"first_name":"Karim","last_name":"Hossain","phone":"01700112233","address_1":"House 7, Road 3, Uttara","city":"Dhaka"}}'
```

রেসপন্স সাথে সাথে: `{"status":"success", ..., "created":true}`। এরপর পেছনে এজেন্ট চলবে — ৩০–৯০ সেকেন্ড।

কয়েক সেকেন্ড পর ড্যাশবোর্ডে `Refresh` দাও (অথবা `curl` দিয়ে লিস্ট দেখো):

| আগে | পরে |
| --- | --- |
| Pending AI Check (হলুদ) | High Risk (লাল) বা Safe (সবুজ) |
| Summary-তে Pending বেশি | High Risk কার্ড বাড়ে |

`AI চেক চালাও` বাটনও এখন কাজ করবে — `POST /api/orders/<id>/analyze/` আবার এজেন্ট চালায়, ৫ সেকেন্ড পর টেবিল নিজে রিফ্রেশ হয়।

> **ডেভেলপমেন্ট টিপ:** `runserver`-এ কোড বদলালে সার্ভার রিস্টার্ট হয় আর চলমান থ্রেড মরে যায় — অর্ডার `PENDING`-ই থাকবে। সমাধান: `AI চেক চালাও` চেপে আবার চালাও।

---

## একাধিক ব্যবসায়ী হলে

- অর্ডার তার `Website`-এর সাথে সেভ হয়; `UniqueConstraint(website, wc_order_id)` — দুই স্টোরে একই `#1099` চলবে
- webhook URL-এর token বলেই বোঝা যায় কোন স্টোর — অন্যের নামে অর্ডার পাঠানো যায় না
- এজেন্ট শুধু ওই একটা অর্ডারের ডেটা পায় — ডেটাবেসে হাত দেয় না, অন্যের ডেটা দেখে না
- ফলাফল ওই অর্ডারের সারিতেই লেখা হয়; ড্যাশবোর্ড নিজের অর্ডারই দেখে

## বাস্তবে বসাতে শুধু যা বদলাবে

| এখন (ডেমো) | বাস্তবে |
| --- | --- |
| `01700` দিয়ে নকল রিটার্ন-হিস্ট্রি | Steadfast/Pathao/RedX merchant API |
| `[WHATSAPP GATEWAY]` প্রিন্ট | WhatsApp Cloud API টেমপ্লেট |
| Django থ্রেড + subprocess | Celery + Redis queue |
| SQLite | PostgreSQL |

এজেন্ট, টাস্ক, দল — কিছুই বদলাবে না।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: crewai` | `ai_agents/`-এর venv activate করেছ? |
| `No module named 'crew'` | `ai_agents/`-এর ভেতর থেকে চালাও — `cd` ভুল |
| `401` / auth এরর | `.env`-এ `OPENROUTER_API_KEY` ঠিক আছে? |
| `404 model not found` | `.env`-এর মডেল slug exact; ফ্রি মডেল বন্ধ হলে নতুন ফ্রি + tool-সাপোর্টেড মডেল |
| `429 rate limit` | ফ্রি মডেলের লিমিট — কিছুক্ষণ পরে আবার |
| `InvalidURL: Invalid port: ':1]'` | `llm_config.py`-এর NO_PROXY লুপ আছে তো? |
| `UnicodeEncodeError: 'charmap'` | `run_order.py` / `test_run.py`-এর UTF-8 ফিক্স |
| অর্ডার `PENDING`-ই থাকে | Django টার্মিনালে error; `ai_analysis_note`-এ "এজেন্ট চলেনি: ..." দেখো |
| `agent failed` / exit 1 | `ai_agents/venv` ঠিক জায়গায়? `run_order.py` stdin পাচ্ছে? |
| ওয়েবপেজে স্ট্যাটাস বদলায় না | ৩০–৯০ সেকেন্ড লাগে; Refresh চাপো |
| `analyze`-এ 404 | অর্ডারটা তোমার স্টোরের? নিজের অর্ডারেই চাপ দাও |

## চেকলিস্ট

- [ ] `python test_run.py` — `HIGH_RISK` + WhatsApp প্রিন্ট + চারটা ফিল্ড
- [ ] `01712345678` দিয়ে `SAFE` + WhatsApp নেই
- [ ] `.env` আর `venv/` git-এ যাচ্ছে না
- [ ] webhook দিলে অর্ডার তৈরি হয় আর পেছনে এজেন্ট চলে
- [ ] কয়েক সেকেন্ড পর ড্যাশবোর্ডে `Safe` / `High Risk`
- [ ] `AI চেক চালাও` বাটন আবার এজেন্ট ডাকে
- [ ] দ্বিতীয় ইউজার শুধু নিজের স্টোর আর অর্ডার দেখে

## শেষ

WooCommerce থেকে অর্ডার → Django সেভ → CrewAI দুই এজেন্ট → রিস্ক স্ট্যাটাস ও WhatsApp → React ড্যাশবোর্ড। পরের ধাপে আসল Steadfast/Pathao API, WhatsApp Cloud API, Celery আর PostgreSQL বসিয়ে প্রোডাকশনে নেওয়া যায়।

➡️ আগের পর্ব: [পর্ব ২ — React ড্যাশবোর্ড](/docs/project-based/project-1/react-dashboard)
➡️ সিস্টেমের পুরো ছবি: [System Design](/docs/project-based/project-1/solution)
➡️ শুরু থেকে: [Project 1 — Overview](/docs/project-based/project-1/overview)
