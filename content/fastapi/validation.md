---
title: Pydantic Validation
description: Field আর field_validator দিয়ে দাম, নাম আর স্টকের নিয়ম বাঁধা (Pydantic v2)।
icon: ShieldCheck
---

## গল্প

রফিক চান — দাম কখনো শূন্যের কম না হয়, নাম যেন অন্তত তিন অক্ষরের হয়, আর স্টক ঋণাত্মক না হয়। এই নিয়মগুলো কোডের ভেতরে `if` দিয়ে লেখা যায়, কিন্তু Pydantic Model-এ ঘোষণা করলে FastAPI নিজেই সব endpoint-এ নিয়মটা প্রয়োগ করে।

## কোড

```python
from pydantic import BaseModel, Field, field_validator

class Product(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    price: float = Field(gt=0, description="দাম অবশ্যই ০-এর বেশি হতে হবে")
    stock: int = Field(ge=0, default=0)

    @field_validator("name")
    @classmethod
    def name_must_be_capitalized(cls, value):
        if value.islower():
            raise ValueError("নামের প্রথম অক্ষর বড় হাতের হওয়া উচিত")
        return value
```

- `Field(min_length=3)` — কমপক্ষে ৩ অক্ষর
- `Field(gt=0)` — শূন্যের বেশি (greater than)
- `Field(ge=0)` — শূন্য বা তার বেশি (greater or equal)

## বাস্তবে কী ঘটে

```text
price = -100  → 422 Error: "Input should be greater than 0"
name = "ab"   → 422 Error: "String should have at least 3 characters"
stock = -5    → 422 Error: "Input should be greater than or equal to 0"
name = "overcoat" → 422 Error: "নামের প্রথম অক্ষর বড় হাতের হওয়া উচিত"
```

```json
{
  "detail": [
    {
      "type": "greater_than",
      "loc": ["body", "price"],
      "msg": "Input should be greater than 0",
      "input": -100,
      "ctx": { "gt": 0 }
    }
  ]
}
```

## টিপস

- Pydantic ডকুমেন্টেশনে পুরোনো `@validator` দেখতে পেলে বুঝবে সেটা **v1** — FastAPI-র নতুন ভার্সনে **v2** ব্যবহার হয়, তাই `@field_validator` লিখতে হবে। উপরে `@classmethod` না দিলে v2-তে এরর আসে।
- `Field`-এর `description` আর `title` `/docs`-এ ফিল্ডের পাশে দেখায় — ক্লায়েন্ট ডেভেলপারের জন্য দারুণ উপকারী।
- ক্রস-ফিল্ড নিয়ম (যেমন "ডিসকাউন্ট দামের চেয়ে কম হতে হবে") লিখতে `@model_validator(mode="after")` লাগে।
- ডেটাবেস থেকে আসা ভ্যালুও একই Model দিয়ে যাচাই করতে পারো — ভ্যালিডেশন শুধু ইনপুটের জন্য নয়।

এখন বড় প্রজেক্টে কোড গোছানোর পালা — [Router](/fastapi/routers)।
