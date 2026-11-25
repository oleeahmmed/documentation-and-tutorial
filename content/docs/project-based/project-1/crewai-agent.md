---
title: পর্ব ৩ — CrewAI এজেন্ট ও Django সেতু
description: দুই CrewAI এজেন্ট, কুরিয়ার টুল, WhatsApp টুল আর Django-র সাথে নিরাপদ সেতু — নতুন অর্ডার নিজেই SAFE বা HIGH_RISK হয়ে যাবে।
icon: Bot
---

> **পরিকল্পনা:** পর্ব ১-এ অর্ডার এলো, পর্ব ২-এ ড্যাশবোর্ডে দেখা গেল — কিন্তু সব অর্ডার `Pending AI Check`। আজ তানভীরের দুই AI কর্মী নিয়োগ করব: **Fraud Analyst** ফোনের কুরিয়ার হিস্ট্রি আর ঠিকানা দেখবে, **Verification Agent** ঝুঁকিপূর্ণ হলে কাস্টমারকে ভদ্র Bengali WhatsApp পাঠাবে। শেষে Django-র webhook-এর সাথে সেতু বানাব, যাতে অর্ডার আসার সাথে সাথেই এজেন্ট চলে আর ড্যাশবোর্ডে ফলাফল বসে যায়।

## এই পর্বে যা বানাবো

| ধাপ | কাজ |
| --- | --- |
| ১ | `ai_agents/` ফোল্ডার, আলাদা venv, CrewAI ইনস্টল |
| ২ | `.env` — OpenRouter key আর মডেলের নাম |
| ৩ | `llm_config.py` — সবার একটাই মস্তিষ্ক (LLM) |
| ৪ | `tools.py` — কুরিয়ার চেক আর WhatsApp যন্ত্র |
| ৫ | `agents.py` — দুই কর্মী |
| ৬ | `tasks.py` — দুই কাজের স্লিপ আর Pydantic রিপোর্ট |
| ৭ | `crew.py` — দল একসাথে নামানো |
| ৮ | `test_run.py` — প্রথম ডেমো, `HIGH_RISK` আর `SAFE` দুটোই দেখা |
| ৯ | `run_order.py` — stdin/stdout দিয়ে কথা বলার দরজা |
| ১০ | Django সেতু — নতুন অর্ডার এলেই এজেন্ট, `analyze` endpoint |
| ১১ | webhook → এজেন্ট → ড্যাশবোর্ড — পুরো ফ্লো টেস্ট |

> **কে কোথায় থাকে:** এজেন্টরা Django-র ভেতরে নয় — আলাদা `ai_agents/` ফোল্ডারে, নিজের venv নিয়ে। কারণ CrewAI-র অনেক প্যাকেজ Django-র পাইথনের সাথে সংঘর্ষ করতে পারে। Django শুধু একটা **সাব-প্রসেস** চালিয়ে ফলাফল নেবে। এই আলাদা ঘরই আমাদের "সেতু"।

## ধাপ ১: এজেন্টদের ঘর

প্রজেক্ট রুটে (`fraud_shield_pro/`-এর পাশে) নতুন ফোল্ডার:

```bash
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

তারপর যন্ত্রপাতি:

```bash
pip install --upgrade pip
pip install crewai crewai-tools python-dotenv pydantic
pip freeze > requirements.txt
```

`ai_agents/.gitignore` (চাবি আর venv কখনো git-এ যাবে না):

```text
.env
venv/
__pycache__/
```

## ধাপ ২: চাবি — `.env`

```text
OPENROUTER_API_KEY="sk-or-v1-তোমার_নিজের_KEY"
OPENROUTER_MODEL_NAME="openrouter/nvidia/nemotron-3-ultra-550b-a55b:free"
```

> **নিজের key বসাও।** OpenRouter-এ ফ্রি অ্যাকাউন্ট খুলে key বানাতে পারো। key কখনো কোডে, git-এ বা চ্যাটে দিও না। ফ্রি মডেল বন্ধ হয়ে গেলে OpenRouter-এর মডেল লিস্ট থেকে tool চালাতে পারে এমন আরেকটা মডেলের slug বসাও — কোড ছুঁতে হবে না।

## ধাপ ৩: মস্তিষ্ক — `llm_config.py`

সব এজেন্ট একটাই LLM ব্যবহার করবে। তাই এক জায়গায় বানাই:

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

`load_dotenv()` ছাড়া `OPENROUTER_API_KEY` ফাঁকা থাকবে। `base_url`-এ `/api/v1` বাদ দিলে OpenRouter 404 দেয়।

> **আসল সমস্যা যা আমরা পেয়েছি:** Windows-এর কোনো কোনো টার্মিনালে `NO_PROXY`-তে `[::1]` থাকে, আর httpx সেটাকে ভুল পোর্ট ভেবে `InvalidURL: Invalid port: ':1]'` ছোড়ে। উপরের লুপটা শুধু ওই অংশটা বাদ দেয় — বাকি proxy সেটিং অক্ষত থাকে।

## ধাপ ৪: হাত — `tools.py`

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

| যন্ত্র | এখন যা করে | বাস্তবে যা হবে |
| --- | --- | --- |
| কুরিয়ার চেক | `01700` দিয়ে শুরু হলে নকল রিটার্ন-হিস্ট্রি, নাহলে ভালো হিস্ট্রি | Steadfast/Pathao/RedX-এর merchant API থেকে আসল পার্সেল-হিস্ট্রি |
| WhatsApp | টার্মিনালে মেসেজ প্রিন্ট | WhatsApp Cloud API + অ্যাপ্রুভড টেমপ্লেট |

আসল API বসালে **শুধু এই ফাইলের ভেতরটা** বদলাবে — এজেন্ট, টাস্ক কিছুই না।

## ধাপ ৫: দুই কর্মী — `agents.py`

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

- **Fraud Analyst** — হাতে একটাই যন্ত্র, কুরিয়ার চেকার। ফোন + ঠিকানা দেখে রায় দেবে।
- **Verification Agent** — হাতে WhatsApp যন্ত্র। `SAFE` হলে চুপ, `HIGH_RISK` হলে ভদ্র মেসেজ।

> এজেন্ট আর টাস্ক ফাইলের একদম উপরে লেখা — কোনো ফাংশনের ভেতরে নয়। তাই Django থেকেও এদের ঠিক এই রূপে পাওয়া যাবে।

## ধাপ ৬: কাজের স্লিপ — `tasks.py`

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

তিনটা মূল কথা:

| জিনিস | কেন |
| --- | --- |
| `{order_id}`, `{phone}` | ফাঁকা জায়গা — `kickoff(inputs=...)`-এ আসল অর্ডার বসবে |
| `context=[analyze_order_task]` | দ্বিতীয় কাজ প্রথম কাজের রিপোর্ট পড়ে সিদ্ধান্ত নেবে |
| `output_pydantic=FraudAnalysisResult` | এলোমেলো গল্প নয় — ঠিক চারটা ফিল্ডের JSON |

## ধাপ ৭: দল — `crew.py`

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


def execute_fraud_check(order_data: dict) -> dict:
    result = fraud_detection_crew.kickoff(inputs=order_data)
    return result.pydantic.model_dump()
```

`Process.sequential` — আগে ডিটেকটিভের কাজ, তার রিপোর্ট হাতে নিয়েই কল-সেন্টার এজেন্ট। `model_dump()` রিপোর্টটাকে সাধারণ dict বানায়, যাতে Django/React সহজে পড়ে। **এই একটাই ফাংশন বাইরের দরজা।**

## ধাপ ৮: প্রথম ডেমো — `test_run.py`

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

চালাও (`ai_agents/`-এর ভেতর থেকেই):

```bash
python test_run.py
```

প্রথম রানে যা দেখেছিলাম (মডেলের শব্দ কিছুটা বদলাতে পারে, চারটা ফিল্ড নিশ্চিত):

```text
[WHATSAPP GATEWAY] Sending to 01700998877:
প্রিয় Tariqul Islam, আপনার অর্ডার #1099 কনফার্ম করতে ১২০ টাকা অগ্রিম ডেলিভারি চার্জ bKash করুন...

=== FINAL CLEAN OUTPUT ===
{'risk_status': 'HIGH_RISK', 'courier_success_rate': '20%',
 'ai_analysis_note': 'কুরিয়ার সফলতা হার মাত্র ২০% এবং ডেলিভারি ঠিকানা অসম্পূর্ণ। উভয় কারণেই হাই রিস্ক।',
 'whatsapp_sent': True}
```

দ্বিতীয় টেস্ট — ফোন `01712345678` (ভালো কাস্টমার):

```text
{'risk_status': 'SAFE', 'courier_success_rate': '93.3%',
 'ai_analysis_note': 'কুরিয়ার সফলতার হার ৯৩.৩% এবং ঠিকানা ডেলিভারির জন্য পর্যাপ্ত।',
 'whatsapp_sent': False}
```

দুই ফলাফলই প্রমাণ — যন্ত্র ঠিকমতো চাপছে, ঝুঁকি বুঝে WhatsApp যাচ্ছে/যাচ্ছে না, আর রিপোর্ট চারটা ফিল্ডেই আসছে।

## ধাপ ৯: দরজা — `run_order.py`

Django থেকে কমান্ডলাইনে একটা অর্ডার পাঠাতে হবে, ফলাফল ফাইলে ফেরত নিতে হবে। এজন্যই:

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

ব্যবহার:

```bash
echo '{"order_id":"1","customer_name":"Test","phone":"01700998877","address":"Uttara, Dhaka","total_amount":"1000"}' \
  | python run_order.py result.json
```

- stdin — Django থেকে JSON অর্ডার
- `sys.argv[1]` — ফলাফল লেখার ফাইল
- error হলে `exit 1` — Django বুঝবে এজেন্ট চলেনি

## ধাপ ১০: Django সেতু

### `backend/orders/agent.py` (নতুন ফাইল)

Django-র পাইথন এজেন্টের venv চেনে না, তাই সাব-প্রসেসে ওই venv-এর পাইথন চালায়:

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
| `AGENT_DIR` | `backend/orders/` থেকে দুই ধাপ উপরে উঠে `ai_agents/` |
| `_agent_python()` | Windows-এ `venv/Scripts/python.exe`, Linux/Mac-এ `venv/bin/python` |
| `subprocess.run(...)` | এজেন্ট আলাদা প্রসেসে — Django-র প্যাকেজের সাথে সংঘর্ষ নেই |
| `timeout=600` | ফ্রি মডেল মাঝে মাঝে ধীর; ১০ মিনিট পর ছেড়ে দেয় |
| `threading.Thread(daemon=True)` | webhook সাথে সাথে রেসপন্স পায়, এজেন্ট পেছনে চলে |
| exception হলে note | ড্যাশবোর্ডে "এজেন্ট চলেনি: ..." দেখে বোঝা যায় কী হলো |

### `backend/orders/views.py` — webhook আর analyze

আগের `print`-এর জায়গায় `start_agent` বসবে, আর নতুন একটা `analyze` endpoint:

```python
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .agent import start_agent
from .models import Order, Website
from .serializers import OrderSerializer, WebsiteSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def woocommerce_webhook(request, token):
    website = get_object_or_404(Website, webhook_token=token)
    data = request.data

    # WooCommerce ping টেস্টে webhook_id পাঠায়, অর্ডারের বডি থাকে না
    if 'id' not in data:
        return Response({"message": "Webhook ping received successfully!"}, status=status.HTTP_200_OK)

    try:
        wc_order_id = str(data.get('id'))
        billing = data.get('billing', {})
        customer_name = f"{billing.get('first_name', '')} {billing.get('last_name', '')}".strip()
        phone = billing.get('phone', 'N/A')
        address = f"{billing.get('address_1', '')}, {billing.get('city', '')}".strip(', ')
        total_amount = data.get('total', 0)

        order, created = Order.objects.update_or_create(
            website=website,
            wc_order_id=wc_order_id,
            defaults={
                'customer_name': customer_name,
                'phone': phone,
                'address': address,
                'total_amount': total_amount,
            },
        )

        if created:
            start_agent(order.id)

        return Response(
            {"status": "success", "order_id": wc_order_id, "website": website.name, "created": created},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def order_list(request):
    orders = Order.objects.filter(website__owner=request.user).select_related('website')
    website_id = request.query_params.get('website')
    if website_id:
        orders = orders.filter(website_id=website_id)
    serializer = OrderSerializer(orders.order_by('-created_at'), many=True)
    return Response(serializer.data)


@api_view(['POST'])
def analyze_order(request, pk):
    order = get_object_or_404(Order, pk=pk, website__owner=request.user)
    start_agent(order.id)
    return Response({"status": "queued", "order_id": order.id})


@api_view(['GET', 'POST'])
def website_list(request):
    if request.method == 'GET':
        websites = request.user.websites.order_by('created_at')
        return Response(WebsiteSerializer(websites, many=True).data)

    serializer = WebsiteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(owner=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def website_detail(request, pk):
    website = get_object_or_404(Website, pk=pk, owner=request.user)
    website.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
```

`backend/orders/urls.py`-তে একটা লাইন যোগ করো:

```python
from django.urls import path

from . import views

urlpatterns = [
    path('orders/webhook/woocommerce/<uuid:token>/', views.woocommerce_webhook, name='wc-webhook'),
    path('orders/list/', views.order_list, name='order-list'),
    path('orders/<int:pk>/analyze/', views.analyze_order, name='order-analyze'),
    path('websites/', views.website_list, name='website-list'),
    path('websites/<int:pk>/', views.website_detail, name='website-detail'),
]
```

> `analyze_order` নিজে চেক করে অর্ডারটা `request.user`-এর কি না। তাই অন্যের অর্ডারে চাপ দিলে `404` — টেন্যান্ট আলাদা থাকল।

## ধাপ ১১: পুরো ফ্লো — webhook থেকে ড্যাশবোর্ড

দুই সার্ভার চালু রাখো, তারপর নতুন অর্ডার পাঠাও:

```bash
curl -X POST http://127.0.0.1:8000/api/orders/webhook/woocommerce/<তোমার_token>/ \
  -H "Content-Type: application/json" \
  -d '{"id":9100,"total":"1550.00","billing":{"first_name":"Karim","last_name":"Hossain","phone":"01700112233","address_1":"House 7, Road 3, Uttara","city":"Dhaka"}}'
```

রেসপন্স সাথে সাথে আসবে (`created: true`), আর Django টার্মিনালে এজেন্ট চলতে শুরু করবে। ৩০–৯০ সেকেন্ড পর:

```bash
curl http://127.0.0.1:8000/api/orders/list/ -H "Authorization: Token <token>"
```

এই অর্ডারের `risk_status` এখন `HIGH_RISK`, `courier_success_rate: "20%"`, `whatsapp_sent: true`।

ড্যাশবোর্ডে `Refresh` দিলে:

| আগে | পরে |
| --- | --- |
| Pending AI Check (হলুদ) | High Risk (লাল) বা Safe (সবুজ) |
| Summary-তে Pending সংখ্যা বেশি | High Risk কার্ড বাড়ে |

`AI চেক চালাও` বাটনও এখন কাজ করবে — `POST /api/orders/<id>/analyze/` আবার এজেন্ট চালায় (৫ সেকেন্ড পর টেবিল নিজে রিফ্রেশ হয়)।

> **ডেভেলপমেন্ট টিপ:** `runserver`-এ কোড বদলালে সার্ভার রিস্টার্ট হয় আর চলমান daemon থ্রেড মরে যায় — তখন অর্ডারটা `PENDING`-ই থাকে। সমস্যা নেই, `AI চেক চালাও` চেপে আবার চালাও।

## একাধিক ব্যবসায়ী হলে কী হয়

- প্রতিটা অর্ডার তার `Website`-এর সাথে সেভ হয়, আর `UniqueConstraint(website, wc_order_id)` — তাই দুই স্টোরে একই `#1099` চলবে
- webhook URL-এর token দেখে বোঝা যায় কোন স্টোর, তাই কোনো ইউজার অন্যের স্টোরের নামে অর্ডার পাঠাতে পারবে না
- এজেন্টকে শুধু ওই একটা অর্ডারের ডেটা দেওয়া হয় — সে ডেটাবেসে হাত দেয় না, অন্যের ডেটা দেখেও না
- ফলাফল সেই অর্ডারের সারিতেই লেখা হয়; ড্যাশবোর্ড নিজের অর্ডারই দেখে
- এজেন্টের জব একটাই — "এই অর্ডারটা ঝুঁকিপূর্ণ কি না"। স্টোরভিত্তিক আলাদা মডেল/প্রম্পট দরকার হলে ভবিষ্যতে `Website`-এ কনফিগ ফিল্ড যোগ করা যায়

## বাস্তবে বসাতে শুধু যা বদলাবে

| এখন (ডেমো) | বাস্তবে |
| --- | --- |
| `01700` দিয়ে নকল রিটার্ন-হিস্ট্রি | Steadfast/Pathao/RedX merchant API |
| `[WHATSAPP GATEWAY]` প্রিন্ট | WhatsApp Cloud API + অ্যাপ্রুভড টেমপ্লেট |
| Django থ্রেড + subprocess | Celery + Redis queue (বড় ভলিউমে) |
| SQLite | PostgreSQL |
| `analyze` বাটন | অটো রিট্রাই + dead-letter queue |

এজেন্ট, টাস্ক, দল — কিছুই বদলাবে না। শুধু `tools.py` আর queue-এর জায়গা।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `ModuleNotFoundError: crewai` | `ai_agents/`-এর venv activate করেছ? `pip install crewai` |
| `No module named 'crew'` | `ai_agents/`-এর ভেতর থেকে চালাও (`cwd` ভুল) |
| `401` / auth এরর | `.env`-এ `OPENROUTER_API_KEY` ঠিক আছে? চ্যাটে শেয়ার করো না |
| `404 model not found` | `.env`-এর মডেল slug exact; ফ্রি মডেল বন্ধ হলে নতুন ফ্রি + tool-সাপোর্টেড মডেল |
| `429 rate limit` | ফ্রি মডেলের লিমিট — কিছুক্ষণ পরে `AI চেক চালাও` |
| `InvalidURL: Invalid port: ':1]'` | `llm_config.py`-এর NO_PROXY ফিক্স আছে তো? |
| `UnicodeEncodeError: 'charmap'` | `run_order.py` / `test_run.py`-এর UTF-8 ফিক্স |
| অর্ডার `PENDING`-ই থাকে | Django টার্মিনালে error দেখো; `ai_analysis_note`-এ "এজেন্ট চলেনি: ..." আছে কি না |
| `agent failed` / exit 1 | `ai_agents/venv` ঠিক জায়গায়? `run_order.py` stdin পাচ্ছে? |
| ওয়েবপেজে স্ট্যাটাস বদলায় না | ৩০–৯০ সেকেন্ড লাগে; Refresh চাপো। ফ্রি মডেল ধীর |
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

এখন সিস্টেমটা পুরো ছবি দেখায়: WooCommerce থেকে অর্ডার → Django সেভ → CrewAI দুই এজেন্ট → রিস্ক স্ট্যাটাস আর WhatsApp → React ড্যাশবোর্ড। পরের ধাপে চাইলে আসল Steadfast/Pathao API, WhatsApp Cloud API, Celery আর PostgreSQL বসিয়ে প্রোডাকশনে নেওয়া যায়।

➡️ আগের পর্ব: [পর্ব ২ — React ড্যাশবোর্ড](/docs/project-based/project-1/react-dashboard)
➡️ সিস্টেমের পুরো ছবি: [System Design](/docs/project-based/project-1/solution)
➡️ শুরু থেকে: [Project 1 — Overview](/docs/project-based/project-1/overview)
