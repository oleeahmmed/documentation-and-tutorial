---
title: Classic Forms
description: ModelForm দিয়ে ফর্ম — ভিজিটরের ইনপুট ভ্যালিডেট করে সরাসরি Model-এ সেভ।
icon: FileText
---

## গল্প

ভিজিটর নাম, ইমেইল, বার্তা লিখবে — এই ইনপুটগুলো যাচাই করে (ইমেইল ঠিক আছে তো? খালি নেই তো?) Model-এ সেভ করার জন্য Form লাগবে।

## `website/forms.py`

```python
from django import forms
from .models import ContactMessage

class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']
        widgets = {
            'message': forms.Textarea(attrs={'rows': 4, 'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
        }
```

### এখানে কী হচ্ছে

| অংশ | কাজ |
| --- | --- |
| `forms.ModelForm` | Model-এর ফিল্ড দেখে ফর্ম নিজে থেকে বানিয়ে নেয় |
| `model = ContactMessage` | কোন Model-এর জন্য ফর্ম |
| `fields = [...]` | কোন ফিল্ডগুলো ফর্মে দেখাবে (`created_at` বাদ — নিজে থেকে বসে) |
| `widgets` | HTML ইনপুটের চেহারা/অ্যাট্রিবিউট নিয়ন্ত্রণ |
| `forms.Textarea(attrs={'rows': 4})` | বার্তার বক্স ৪ লাইন উঁচু |
| `class: 'form-control'` | Bootstrap স্টাইলিং — পরে CSS ব্যবহার করলে কাজে লাগবে |

`widgets` না দিলেও ফর্ম কাজ করবে — শুধু দেখতে সাধারণ লাগবে। ভ্যালিডেশন কিন্তু Form নিজেই করে: ইমেইল ফরম্যাট ভুল হলে `form.is_valid()` False হবে, ভুলটা ফর্মের পাশে দেখাবে।

➡️ পরের পর্ব: [Views ও URLs](/django/classic-views-urls) — ফর্মটা পেজে দেখাই আর সাবমিট ধরি।
