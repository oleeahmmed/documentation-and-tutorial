---
title: Student Model ও Admin
description: ছবি (Pillow) আর রিচ-টেক্সট (CKEditor) ফিল্ডসহ Model, সাথে Admin প্রিভিউ।
icon: Layers
---

## গল্প

প্রতিটা ছাত্রের একটা প্রোফাইল-ছবি (Pillow দিয়ে প্রসেস) আর একটা বিস্তারিত "সম্পর্কে" বায়ো (bold/italic/লিস্ট সহ, CKEditor দিয়ে) থাকবে। Admin প্যানেলে ছাত্রের তালিকা দেখলে ছোট গোল ছবিটাও যেন দেখা যায়।

## `students/models.py`

```python
from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField

class Student(models.Model):
    CLASS_CHOICES = [
        ('6', 'ষষ্ঠ'), ('7', 'সপ্তম'), ('8', 'অষ্টম'),
        ('9', 'নবম'), ('10', 'দশম'),
    ]

    name = models.CharField(max_length=200)
    roll_number = models.CharField(max_length=20, unique=True)
    student_class = models.CharField(max_length=2, choices=CLASS_CHOICES)
    email = models.EmailField(unique=True)
    photo = models.ImageField(upload_to='student_photos/', blank=True, null=True)   # 👈 Pillow ব্যবহার হবে এখানে
    bio = RichTextUploadingField(blank=True)   # 👈 CKEditor রিচ-টেক্সট ফিল্ড
    enrolled_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.roll_number})"
```

### ফিল্ডগুলোতে খেয়াল করার জিনিস

| ফিল্ড | বিশেষত্ব |
| --- | --- |
| `roll_number` (`unique=True`) | একই রোল নম্বর দুইবার বসানো যাবে না |
| `student_class` + `choices` | শুধু ৬–১০-এর মধ্যে মান নেবে, ভুল মান দিলে ভ্যালিডেশন এরর |
| `email` (`unique=True`) | একই ইমেইলে দুইটা প্রোফাইল হবে না |
| `photo` (`ImageField`) | আপলোড `media/student_photos/`-এ যাবে; কাজ করতে **Pillow লাগবে** |
| `bio` (`RichTextUploadingField`) | Admin-এ রিচ এডিটর দেখাবে, ভেতরে ছবিও আপলোড করা যাবে |

```bash
python manage.py makemigrations
python manage.py migrate
```

> `ImageField` ব্যবহার করলে Pillow ছাড়া Django সরাসরি এরর দেবে — তাই প্রথম দিনই `pip install pillow` করা হয়েছিল।

## Admin — তালিকায় ছবি প্রিভিউ

`students/admin.py`:

```python
from django.contrib import admin
from django.utils.html import format_html
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("name", "roll_number", "student_class", "photo_preview")
    search_fields = ("name", "roll_number")
    list_filter = ("student_class",)

    def photo_preview(self, obj):
        if obj.photo:
            return format_html('<img src="{}" width="40" style="border-radius:50%;" />', obj.photo.url)
        return "ছবি নেই"
    photo_preview.short_description = "ছবি"
```

`photo_preview` একটা কাস্টম কলাম — তালিকায় ৪০px গোল ছবি দেখায়। `format_html` ব্যবহার করা হয় যাতে `obj.photo.url` নিরাপদভাবে HTML-এ বসে।

## CKEditor-এর URL যোগ করা

`school_system/urls.py`-তে:

```python
urlpatterns += [
    path('ckeditor/', include('ckeditor_uploader.urls')),
]
```

এই URL না থাকলে Admin-এ রিচ এডিটরের ভেতরে ছবি আপলোড কাজ করবে না। (পুরো `urls.py` পরের অধ্যায়ে একসাথে দেখবে।)

➡️ পরের পর্ব: [Serializer ও Signal](/django/serializers-signals) — Model-কে JSON বানাই আর ইমেইল অটোমেট করি।
