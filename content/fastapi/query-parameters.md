---
title: Query Parameters
description: তালিকা ফিল্টার, পেজিনেশন আর ডিফল্ট ভ্যালু — ?category=winter&limit=5।
icon: Filter
---

## গল্প

নাদিয়া পণ্যের তালিকায় শুধু শীতের পোশাক দেখতে চান, আর একবারে পাঁচটার বেশি নয়। FastAPI-তে এ ধরনের "বাড়তি শর্ত" URL-এ প্রশ্নচিহ্নের পরে পাঠানো হয় — এগুলোই query parameter।

```text
/products?category=winter&limit=5
```

## কোড

```python
@app.get("/products")
def list_products(category: str | None = None, limit: int = 10):
    if category:
        return {"category": category, "limit": limit}
    return {"message": "সব পণ্য", "limit": limit}
```

এখানে কোনো `{}` নেই, তাই FastAPI নিজেই বুঝে নেয় `category` আর `limit` query parameter:

- `category: str | None = None` — না পাঠালেও চলবে (অপশনাল)
- `limit: int = 10` — না পাঠালে ডিফল্ট ১০ হবে

## বাস্তবে কী ঘটে

```text
GET /products                         → {"message": "সব পণ্য", "limit": 10}
GET /products?category=winter         → {"category": "winter", "limit": 10}
GET /products?category=winter&limit=5 → {"category": "winter", "limit": 5}
```

আর ভুল টাইপ পাঠালে — যেমন `/products?limit=abc` — আবার সেই চেনা 422:

```json
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": ["query", "limit"],
      "msg": "Input should be a valid integer..."
    }
  ]
}
```

## আসল ব্যবহার — ডেটাবেসে ফিল্টার

পরের দিকে [SQLAlchemy](/fastapi/database) শেখার পর একই প্যারামিটার আসল কোয়েরিতে বসবে:

```python
@app.get("/products")
def list_products(
    db: DBSession,
    category: str | None = None,
    skip: int = 0,
    limit: int = 10,
):
    query = db.query(ProductModel)
    if category:
        query = query.filter(ProductModel.category == category)
    return query.offset(skip).limit(limit).all()
```

`skip` আর `limit` মিলিয়ে পেজিনেশন — ২০টা পণ্যের মধ্যে প্রথম ১০টা দেখতে `?skip=0&limit=10`, পরের ১০টা দেখতে `?skip=10&limit=10`।

## টিপস

- `Query` দিয়ে `limit`-এ সীমা বসানো যায় — `limit: int = Query(default=10, ge=1, le=100)`. এতে `limit=5000` পাঠালে 422 হবে, সার্ভার বাঁচবে।
- `/docs` পেজে query parameter-গুলো ছোট ফর্ম ফিল্ড হয়ে দেখায় — ব্রাউজার থেকেই টেস্ট করা যায়।

এখন ডেটা **পাঠানো** শিখব — [Request Body](/fastapi/request-body)।
