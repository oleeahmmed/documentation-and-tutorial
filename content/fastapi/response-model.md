---
title: Response Model
description: response_model দিয়ে ঠিক করা — কোন ফিল্ড কাস্টমার দেখবে, কোনটা সার্ভারেই থাকবে।
icon: EyeOff
---

## গল্প

পণ্যের সাথে একটা `internal_cost` (গোপন ক্রয়মূল্য) থাকে, যা শুধু করিম ভাই জানবেন — কাস্টমার যেন কখনো না দেখে। অথচ পণ্য তৈরি করার সময় এই তথ্যটা ইনপুটে লাগে। সমাধান: ইনপুট আর আউটপুটের জন্য আলাদা Model।

## কোড

```python
class ProductIn(BaseModel):
    name: str
    price: float
    internal_cost: float   # শুধু ইনপুটে থাকবে

class ProductOut(BaseModel):
    name: str
    price: float            # internal_cost এখানে নেই

@app.post("/products", response_model=ProductOut)
def create_product(product: ProductIn):
    return product   # internal_cost থাকলেও, response_model এটা ফিল্টার করে বাদ দেবে
```

- `ProductIn` — কে পাঠাচ্ছে তার জন্য; ভ্যালিডেশন এখানেই
- `ProductOut` — ব্যবহারকারী যা দেখবে; `response_model=` দিয়ে বসিয়ে দিলাম

## বাস্তবে কী ঘটে

ইনপুট:

```bash
curl -X POST http://127.0.0.1:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "উলের ওভারকোট", "price": 1800, "internal_cost": 1200}'
```

আউটপুট:

```json
{"name": "উলের ওভারকোট", "price": 1800.0}
```

`internal_cost` **স্বয়ংক্রিয়ভাবে বাদ পড়ে গেছে** — কারণ `response_model=ProductOut`-এ এই ফিল্ড নেই। এটা ডেটা-সিকিউরিটির জন্য অসাধারণ একটা ফিচার; ভুলে গোপন ফিল্ড ফাঁস হওয়ার ঝুঁকি অনেক কমে।

## টিপস

- `response_model` বসালে `/docs`-এ সঠিক আউটপুট স্ট্রাকচার দেখায়, আর ভুল টাইপের ডেটা ফেরত দিলে FastAPI ধরে ফেলে।
- `response_model=list[ProductOut]` দিয়ে তালিকাও একইভাবে ফিল্টার করা যায়।
- বাস্তবে ডেটাবেস থেকে আসা অবজেক্ট (ORM) সরাসরি ফেরত দিতে হলে Out Model-এ `model_config = {"from_attributes": True}` লাগবে — [ডেটাবেস পেজে](/fastapi/database) দেখানো আছে।

পরের ধাপে ভুল হলে কীভাবে সুন্দর এরর দেখাবে — [Status Code ও Error](/fastapi/status-errors)।
