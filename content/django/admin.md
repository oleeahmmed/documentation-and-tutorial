---
title: Admin Panel
description: Django-র বিল্ট-ইন ড্যাশবোর্ড — কোড না লিখেই পণ্য যোগ, এডিট, ডিলিট।
icon: Package
---

## গল্প

করিম ভাই চান কোড না লিখেই, একটা সুন্দর ড্যাশবোর্ড থেকে পণ্য যোগ/বাদ/এডিট করতে — ঠিক যেমন একটা অফিসের ব্যাক-অফিস প্যানেল। Django-তে এটা একদম রেডি অবস্থায় দেওয়া আছে।

## Superuser (অ্যাডমিন) বানানো

```bash
python manage.py createsuperuser
# username, email, password দাও
```

পাসওয়ার্ড টাইপ করার সময় স্ক্রিনে কিছু দেখাবে না — এটা স্বাভাবিক, নিরাপত্তার জন্য।

## Model-কে Admin-এ রেজিস্টার করা

`products/admin.py`:

```python
from django.contrib import admin
from .models import Product

admin.site.register(Product)
```

এখন `http://127.0.0.1:8000/admin` গিয়ে লগইন করো — Product যোগ/এডিট/ডিলিট করার একটা সুন্দর প্যানেল পাবে।

> রেজিস্টার না করলে Admin-এ কিছুই দেখা যাবে না। Django কে বলতে হয় — "এই Model-টা আমার প্যানেলে দেখাও।"

## Admin প্যানেল কাস্টমাইজ করা

```python
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock", "created_at")   # তালিকায় কোন কলাম দেখাবে
    list_filter = ("created_at",)                               # ডান পাশে ফিল্টার
    search_fields = ("name",)                                   # সার্চ বক্স
    ordering = ("-created_at",)                                 # নতুন পণ্য আগে
```

`admin.site.register(...)`-এর বদলে `@admin.register` ডেকোরেটর দিয়ে এই কাস্টম সেটিংসগুলো দেওয়া যায়।

### বাস্তবে কী ঘটে

```text
Admin প্যানেলে এখন:
- "উলের ওভারকোট", "চাদর" ইত্যাদি নাম দেখাবে একটা টেবিলে
- দাম, স্টক, তৈরির তারিখ কলাম হিসেবে দেখাবে
- উপরে সার্চ বক্স থাকবে, নাম দিয়ে খোঁজা যাবে
- ডান পাশে তারিখ অনুযায়ী ফিল্টার করার অপশন থাকবে
```

➡️ পরের পর্ব: [Views ও URLs](/django/views-urls) — এখন বাইরের কেউ অনুরোধ পাঠালে তার উত্তর দেওয়ার ব্যবস্থা বানাবো।
