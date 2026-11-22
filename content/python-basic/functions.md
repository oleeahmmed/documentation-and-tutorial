---
title: Functions
description: একবার লিখে বারবার ব্যবহার — ছাড়ের হিসাবের ফাংশন, ডিফল্ট ভ্যালু সহ।
icon: Braces
---

## গল্প

করিম ভাই বারবার একই হিসাব করতে করতে ক্লান্ত — ছাড়ের হিসাব প্রতিবার হাতে করতে হয়। তিনি চান একবার একটা "নিয়ম" লিখে রাখতে, যেটা বারবার ব্যবহার করা যাবে।

## কোড

```python
def calculate_discount(price, discount_percent):
    """একটা দামের উপর ছাড়ের পরিমাণ হিসাব করে।"""
    discount_amount = price * (discount_percent / 100)
    final_price = price - discount_amount
    return final_price

result1 = calculate_discount(2000, 10)
result2 = calculate_discount(1500, 20)

print("ছাড়ের পর দাম:", result1)
print("ছাড়ের পর দাম:", result2)

# ডিফল্ট ভ্যালু সহ ফাংশন
def greet_customer(name, greeting="স্বাগতম"):
    print(f"{greeting}, {name}!")

greet_customer("রহিম")
greet_customer("করিম", "ধন্যবাদ")
```

## বাস্তব আউটপুট

```text
ছাড়ের পর দাম: 1800.0
ছাড়ের পর দাম: 1200.0
স্বাগতম, রহিম!
ধন্যবাদ, করিম!
```

## অংশগুলো

| অংশ | কাজ |
| --- | --- |
| `def calculate_discount(...):` | ফাংশনের নাম আর ইনপুট (প্যারামিটার) |
| `"""..."""` | ডকস্ট্রিং — ফাংশনটা কী করে, তার ছোট বর্ণনা |
| `return final_price` | ফাংশনের ফলাফল ফেরত দেয় |
| `greeting="স্বাগতম"` | ডিফল্ট ভ্যালু — না দিলে এটাই ব্যবহার হয় |

> `return` না থাকলে ফাংশন কিছু ফেরত দেয় না, শুধু ভেতরের `print()` চলে। এজেন্ট বানানোর সময় ধাপে ধাপে এমন ফাংশনই টুল হিসেবে ব্যবহার হবে।
