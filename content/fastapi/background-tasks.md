---
title: Background Tasks
description: রিকোয়েস্টের উত্তর আগে, সময়সাপেক্ষ কাজ (ইমেইল, নোটিফিকেশন) পরে — ব্যাকগ্রাউন্ডে।
icon: Clock
---

## গল্প

নতুন পণ্য যোগ হওয়ার পর করিম ভাইকে ইমেইল যাবে। কিন্তু ইমেইল সার্ভার ধীর হলে কাস্টমারকে ২-৩ সেকেন্ড অপেক্ষা করানো ঠিক না। সমাধান — response আগে পাঠিয়ে দাও, ইমেইলটা পরে ব্যাকগ্রাউন্ডে যাবে।

## কোড

```python
from fastapi import BackgroundTasks

def send_notification(email: str, message: str):
    # বাস্তবে এখানে SMTP বা ইমেইল সার্ভিসের কল থাকবে
    print(f"📧 {email}-কে পাঠানো হচ্ছে: {message}")

@app.post("/products")
def create_product(product: Product, background_tasks: BackgroundTasks):
    background_tasks.add_task(
        send_notification,
        "admin@rupashi.com",
        f"নতুন পণ্য: {product.name}",
    )
    return {"message": "পণ্য তৈরি হয়েছে, নোটিফিকেশন পাঠানো হচ্ছে"}
```

`BackgroundTasks` প্যারামিটারটা দিলেই FastAPI নিজে থেকে পরিচয় করিয়ে দেয় — আলাদা ইনস্টল বা কনফিগ লাগে না।

## বাস্তবে কী ঘটে

- API সাথে সাথে উত্তর দেয়: `{"message": "পণ্য তৈরি হয়েছে..."}`
- তার **পরে** `send_notification` চলে; টার্মিনালে দেখবে: `📧 admin@rupashi.com-কে পাঠানো হচ্ছে: নতুন পণ্য: চাদর`
- `send_notification`-এ এরর হলেও কাস্টমারের পাওয়া response নষ্ট হবে না (তবে লগে দেখবে)

## ডেটাবেসের সাথে

আসল প্রজেক্টে সাধারণত এমন হয়: DB-তে সেভ → `commit()` → তারপর background task-এ ইমেইল/হোয়াটসঅ্যাপ। task-এর ভেতরে অন্য session ব্যবহার করাই নিরাপদ, কারণ রিকোয়েস্ট শেষ হলে `get_db`-র session বন্ধ হয়ে যায়।

```python
@app.post("/products")
def create_product(product: Product, db: DBSession, background_tasks: BackgroundTasks):
    db_product = ProductModel(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    background_tasks.add_task(send_notification, "admin@rupashi.com", f"নতুন পণ্য: {db_product.name}")
    return db_product
```

## টিপস

- Background task শেষ হওয়ার আগেই রেসপন্স চলে যায় — তাই এখানে ফেরত পাওয়া ফলাফল কাস্টমারকে দেখানো যায় না।
- এগুলো **একই প্রসেসে** চলে। রিপোর্ট জেনারেশন, হাজারো ইমেইলের মতো ভারী কাজের জন্য Celery/RQ-র মতো আলাদা queue ব্যবহার করো।
- কাজের ফলাফল সম্পর্কে কিছু জানা দরকার হলে (সফল হলো কি না) ডেটাবেসে একটা status কলাম রাখাই সহজ পথ।

এবার ছবি আপলোড — [File Upload](/fastapi/file-upload)।
