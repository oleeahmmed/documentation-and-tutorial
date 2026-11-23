---
title: Request Body — Pydantic Model
description: Pydantic Model দিয়ে নতুন পণ্যের ডেটা নেওয়া, ভ্যালিডেট করা আর JSON-এ ফেরত দেওয়া।
icon: Send
---

## গল্প

এবার উল্টো দিক — কাস্টমার নতুন পণ্যের তথ্য **পাঠাবে**। Django-তে এর জন্য Serializer লাগত, FastAPI-তে শুধু একটা Pydantic Model দিয়েই ডেটা-কাঠামো আর ভ্যালিডেশন দুটোই হয়ে যায়।

## কোড

```python
from pydantic import BaseModel

class Product(BaseModel):
    name: str
    price: float
    stock: int = 0              # ডিফল্ট ভ্যালু, অপশনাল ফিল্ড
    description: str | None = None

@app.post("/products")
def create_product(product: Product):
    return {"message": "পণ্য তৈরি হয়েছে", "data": product}
```

ফাংশনের প্যারামিটারে **Pydantic Model** বসালেই FastAPI বোঝে — এটা request body, JSON আকারে আসবে।

## সঠিক ডেটা পাঠালে

```bash
curl -X POST http://127.0.0.1:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "উলের ওভারকোট", "price": 1800, "stock": 450}'
```

```json
{
  "message": "পণ্য তৈরি হয়েছে",
  "data": {
    "name": "উলের ওভারকোট",
    "price": 1800.0,
    "stock": 450,
    "description": null
  }
}
```

`stock` না পাঠালেও ডিফল্ট `0` বসে যেত, আর `description` বাদ পড়লে `null` হয়ে যেত।

## ভুল ডেটা পাঠালে

`price` ছাড়া পাঠালে:

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "price"],
      "msg": "Field required"
    }
  ]
}
```

ব্রাউজারের `/docs` পেজে "Try it out" চেপে ফর্মে ভুল-ভাল ডেটা দিয়ে দেখো — প্রতিটা এররের জায়গা (`loc`) পর্যন্ত দেখায়।

## টিপস

- বাংলা লেখা JSON-এ পাঠাতে `curl`-এ `-H "Content-Type: application/json"` ভুলো না।
- `product` অবজেক্টটা সরাসরি `return` করলেও FastAPI ঠিকঠাক JSON বানায় — Pydantic Model-এর `model_dump()` দরকার হয় না।
- শুধু একটা ভ্যালু পাঠাতে চাইলে `Body(embed=True)` ব্যবহার করা যায়; কিন্তু বেশিরভাগ ক্ষেত্রে ছোট একটা Model বানানোই পরিষ্কার।

এখন দেখব — আউটপুটে কোন ফিল্ড যাবে আর কোনটা গোপন থাকবে, [Response Model](/fastapi/response-model)।
