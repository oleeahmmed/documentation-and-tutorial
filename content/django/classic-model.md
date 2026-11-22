---
title: Classic Model
description: যোগাযোগ ফর্মের বার্তা রাখার জন্য ContactMessage Model আর migration।
icon: Database
---

## গল্প

স্কুলের ওয়েবসাইটে একটা নোটিশ-বোর্ড থাকবে, যেখানে ভিজিটররা একটা ফর্ম পূরণ করে বার্তা পাঠাতে পারবে। সেই বার্তাগুলো ডেটাবেসে রাখতে হবে — নাম, ইমেইল, বার্তা, কখন পাঠানো হলো।

## `website/models.py`

```python
from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.created_at.date()}"
```

| ফিল্ড | কাজ |
| --- | --- |
| `CharField(max_length=100)` | ভিজিটরের নাম (সর্বোচ্চ ১০০ অক্ষর) |
| `EmailField()` | ইমেইল — ফরম্যাট ভুল হলে ফর্মে এরর দেবে |
| `TextField()` | লম্বা বার্তা |
| `DateTimeField(auto_now_add=True)` | বার্তা আসার সময় নিজে থেকে বসে |

`__str__`-এ নামের সাথে তারিখ দেখানো হয়েছে — Admin প্যানেলে প্রতিটা বার্তা চেনা সহজ হবে।

## Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

আউটপুট:

```text
Migrations for 'website':
  website/migrations/0001_initial.py
    + Create model ContactMessage
```

**প্রতিবার Model বদলালে `makemigrations` আর `migrate` আবার চালাতে হবে** — নাহলে কোডে ফিল্ড থাকবে, ডেটাবেসে টেবিল থাকবে না।

➡️ পরের পর্ব: [Classic Forms](/django/classic-forms) — ভিজিটরের ইনপুট ভ্যালিডেট করার ফর্ম বানাই।
