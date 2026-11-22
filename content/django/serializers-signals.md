---
title: Serializer ও Signal
description: Model ↔ JSON রূপান্তর, আর নতুন ছাত্র ভর্তি হলে স্বয়ংক্রিয় SMTP ইমেইল।
icon: Repeat
---

## Serializer — `students/serializers.py`

```python
from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'roll_number', 'student_class', 'email', 'photo', 'bio', 'enrolled_at']
        read_only_fields = ['enrolled_at']
```

Serializer দুই দিকেই কাজ করে — API-তে ছাত্রের ডেটা পাঠানোর সময় Model → JSON, আর নতুন ছাত্র যোগ করার সময় JSON → Model। সাথে ভ্যালিডেশনও (যেমন unique রোল নম্বর) নিজে থেকে করে।

`read_only_fields`-এ `enrolled_at` রাখা হয়েছে — কেউ API থেকে ভর্তির তারিখ বদলাতে পারবে না, সেটা নিজে থেকে বসবে।

## SMTP — নতুন ছাত্র ভর্তি হলে স্বয়ংক্রিয় ইমেইল

### গল্প

নতুন ছাত্র ভর্তি হলে, তাকে স্বাগতম-ইমেইল পাঠানো হবে। প্রতিবার View-তে হাতে ইমেইল পাঠানোর কোড লেখার বদলে Django **Signal** ব্যবহার করা হয় — Model সেভ হলেই ইমেইল যাবে, কোডের যেখান থেকেই সেভ হোক (Admin, API, shell — সবখানে)।

### `students/signals.py`

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Student

@receiver(post_save, sender=Student)
def send_welcome_email(sender, instance, created, **kwargs):
    if created:   # শুধু নতুন তৈরি হলে, আপডেট হলে না
        send_mail(
            subject='স্কুলে স্বাগতম!',
            message=f'প্রিয় {instance.name}, আপনাকে আমাদের স্কুলে স্বাগতম। আপনার রোল নম্বর: {instance.roll_number}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=True,   # ইমেইল ব্যর্থ হলেও API রেসপন্স যেন আটকে না যায়
        )
```

### Signal চালু করা — `students/apps.py`

```python
from django.apps import AppConfig

class StudentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'students'

    def ready(self):
        import students.signals   # 👈 Signal ফাইল ইম্পোর্ট করে অ্যাক্টিভ করা
```

`apps.py`-তে ইম্পোর্ট না করলে Signal ফাইলটা কেউ পড়েই না — ইমেইল যাবে না, অথচ কোনো এররও দেখাবে না। এই ভুলটা খুব কমন।

| অংশ | কাজ |
| --- | --- |
| `post_save` | Model সেভ হওয়ার পরে সিগন্যাল পাঠায় |
| `created` | নতুন তৈরি হলে `True`, আপডেট হলে `False` |
| `fail_silently=True` | SMTP সার্ভার ডাউন থাকলেও ছাত্র যোগ করা আটকাবে না |
| `ready()`-এ import | App চালু হওয়ার সময় Signal রেজিস্টার করে |

> প্রোডাকশনে ইমেইল ব্যর্থতা ট্র্যাক করতে চাইলে `fail_silently=False` করে try/except দিয়ে লগ করো — নাহলে ইমেইল যাচ্ছে না, কেউ টের পাবে না।

➡️ পরের পর্ব: [API Views ও URLs](/django/api-views-urls) — ViewSet, Router আর সব URL একসাথে জোড়া লাগাই।
