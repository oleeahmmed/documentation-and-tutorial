---
title: Views ও URLs
description: Function-Based View দিয়ে ফর্ম দেখানো ও সাবমিট ধরা, আর URL-এ যুক্ত করা।
icon: GitBranch
---

## গল্প

কেউ `/contact/` ঠিকানায় গেলে যোগাযোগ ফর্মটা দেখাতে হবে; ফর্ম সাবমিট করলে ভ্যালিডেট করে সেভ করতে হবে, তারপর সফল মেসেজ দেখিয়ে আবার ওই পেজেই ফেরত পাঠাতে হবে। এই পুরো কাজটাই **View** করে, আর কোন ঠিকানায় কোন View চলবে তা ঠিক করে **URL**।

## `website/views.py`

```python
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ContactForm

def home(request):
    return render(request, 'website/home.html', {"school_name": "আদর্শ উচ্চ বিদ্যালয়"})

def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "আপনার বার্তা পাঠানো হয়েছে!")
            return redirect('contact')   # POST-Redirect-GET প্যাটার্ন (রিফ্রেশে ডুপ্লিকেট সাবমিশন আটকায়)
    else:
        form = ContactForm()

    return render(request, 'website/contact.html', {"form": form})
```

### POST-Redirect-GET কেন

ফর্ম সাবমিটের পর সরাসরি HTML রেন্ডার করলে, ইউজার ব্রাউজারে রিফ্রেশ চাপলে একই POST আবার যাবে — একই বার্তা দুইবার সেভ হয়ে যেতে পারে। তাই সেভ করার পর `redirect()` করে GET রিকোয়েস্টে ফিরিয়ে পাঠানো হয়।

## URL কনফিগার

`website/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', views.contact_view, name='contact'),
]
```

`school_system/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('website.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

`path('', include('website.urls'))` — খালি পথ দিয়ে শুরু হওয়া সব অনুরোধ `website` app-এর URL ফাইলে চলে যাবে। ফলে `/` আর `/contact/` দুটোই এখন `website` সামলাবে।

> `static(...)` লাইনটা এখন অকার্যকর, কারণ `MEDIA_URL`/`MEDIA_ROOT` এখনো সেট করা হয়নি। API পর্বে ছবি আপলোড যোগ করলে এটা দরকার হবে — তখন `settings.py`-তে media কনফিগও যোগ হবে।

➡️ পরের পর্ব: [Templates](/django/classic-templates) — এখন আসল HTML পেজগুলো বানাই।
