---
title: Models
description: ডেটাবেস টেবিলের নকশা — Python ক্লাস লিখলেই Django টেবিল বানিয়ে দেয়।
icon: Database
---

## গল্প

রফিক চান একটা "পণ্য"-এর তথ্য ডেটাবেসে রাখতে — নাম, দাম, স্টক। Model হলো সেই পণ্যের **নকশা** — ঠিক Python Basic-এর ক্লাসের মতোই, কিন্তু Django নিজেই এটাকে ডেটাবেস টেবিলে রূপান্তর করে দেয়।

## কোড — `products/models.py`

```python
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

### ফিল্ডগুলো কী কাজ করে

| ফিল্ড | ডেটাবেসে কী হয় | গল্পে |
| --- | --- | --- |
| `CharField(max_length=200)` | ছোট লেখা (সর্বোচ্চ ২০০ অক্ষর) | পণ্যের নাম |
| `DecimalField` | দশমিক সংখ্যা, টাকার হিসাবে নিরাপদ | দাম (`1800.00`) |
| `IntegerField` | পূর্ণসংখ্যা | স্টকে কত পিস আছে |
| `TextField` | বড় লেখা | বিস্তারিত বিবরণ |
| `DateTimeField(auto_now_add=True)` | যোগ হওয়ার সময় নিজে থেকে বসে | তৈরির তারিখ |

শেষের `__str__` মেথডটা না লিখলে Admin প্যানেলে পণ্য দেখাবে "Product object (1)" — লিখলে সুন্দরভাবে আসল নাম দেখাবে।

## Migration — Model থেকে আসল ডেটাবেস টেবিল বানানো

Model শুধু কোডে লেখা নকশা। ডেটাবেসে আসল টেবিল বানাতে দুটো কমান্ড:

```bash
python manage.py makemigrations   # "কী বদলেছে" তার নির্দেশনা বানায়
python manage.py migrate          # আসল ডেটাবেসে প্রয়োগ করে
```

আউটপুট এরকম:

```text
Migrations for 'products':
  products/migrations/0001_initial.py
    + Create model Product

Operations to perform:
  Apply all migrations: admin, auth, contenttypes, products, sessions
Running migrations:
  Applying products.0001_initial... OK
```

**প্রতিবার Model বদলালে, এই দুইটা কমান্ড আবার চালাতে হবে।** নতুন ফিল্ড যোগ করলে, নাম বদলালে — সব ক্ষেত্রেই।

> ভুলে গেলে কী হয়? কোডে ফিল্ড আছে, ডেটাবেসে নেই — সাইট এরর দেবে। তাই নিয়ম মনে রাখো: **Model বদল = `makemigrations` + `migrate`**।

➡️ পরের পর্ব: [Admin Panel](/django/admin) — এখন কোড ছাড়াই পণ্য দেখাশোনার সুন্দর ড্যাশবোর্ড বানাবো।
