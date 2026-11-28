---
title: "ধাপ ১২ — একটা টেস্ট ইভেন্ট (main.py)"
description: নুসরাত জাহানের শিপমেন্ট আপডেট দিয়ে পুরো টিম একবার চালাও।
icon: Send
---

## লক্ষ্য

`main.py`-এর `run()`-এ একটা নমুনা অর্ডার-ইভেন্ট বসিয়ে Crew চালু করা।

## ফাইল খোলো

`src/order_notify_agent/main.py`-তে `run()` ফাংশন খুঁজে নিয়ে ভেতরের অংশ এভাবে বদলাও:

```python
def run():
    sample_event = """
Event: Order Shipped
Customer: Nusrat Jahan
Order ID: BLZ-10234
Courier: Pathao Courier
Tracking Link: https://track.pathao.com/BLZ-10234
"""
    inputs = {'order_event': sample_event}
    try:
        OrderNotifyAgent().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
```

## কী হচ্ছে এখানে

| অংশ | কাজ |
| --- | --- |
| `sample_event` | একটা শিপমেন্ট আপডেট — কাস্টমার, অর্ডার নম্বর, কুরিয়ার, লিংক |
| `inputs` | `{order_event}` placeholder-এ এই টেক্সট বসছে |
| `OrderNotifyAgent().crew()` | `crew.py`-র ক্লাস আর মেথড |
| `.kickoff(inputs=...)` | টিমকে কাজ শুরু করার নির্দেশ |

> **নমুনাটা ইচ্ছে করেই শিপমেন্ট** — নওশিন `tracking_update` ধরবে, রাহাত ট্র্যাকিং টেমপ্লেট নেবে (কুরিয়ার নাম + লিংক), পিয়া পাঠাবে। এতে তিনজনের ফ্লো এক রানে যাচাই হয়ে যায়।

> **বাকি তিনটা ইভেন্টও টেস্ট করো:** `sample_event`-এ শুধু প্রথম লাইন বদলে `Event: Order Confirmed`, `Event: Payment Received`, বা `Event: Abandoned Cart` দিয়ে আবার চালাও — নওশিন ঠিকই `event_type` বের করবে, আর রাহাত সেই অনুযায়ী সঠিক টেমপ্লেট বেছে নেবে (ধাপ ৭-এর টেবিল দেখো)।

> **একসাথে কয়েকটা ইভেন্ট:** `sample_event`-এর জায়গায় একটা লিস্ট বানিয়ে লুপে `kickoff()` ডাকতে পারো — প্রতিটা ইমেইল আলাদা এন্ট্রি হিসেবে `sent_notifications.json`-এ জমবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `KeyError` | inputs-এর key আর `tasks.yaml`-এর `{order_event}` হুবহু মিলাও |
| `NameError: OrderNotifyAgent` | `from .crew import OrderNotifyAgent` import আছে কিনা দেখো |
| নওশিন event_type ধরছে না | ইভেন্টে "Order Shipped" / "Order Confirmed" / "Payment" শব্দটা স্পষ্ট রাখো |
| সব টেমপ্লেট একই | ধাপ ৮-এর ফাইলে ভুল ইভেন্টের জন্য নিষেধ আরও স্পষ্ট লেখো |

## চেকলিস্ট

- [ ] `sample_event` বসানো
- [ ] `inputs = {'order_event': ...}`
- [ ] `OrderNotifyAgent().crew().kickoff(...)`

➡️ পরের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-9/step-13)
