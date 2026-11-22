---
title: API Views ও URLs
description: ViewSet, Router, JWT, Swagger/Redoc — সব URL একসাথে।
icon: Network
---

## ViewSet — `students/views.py`

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]   # যে কেউ দেখতে পারবে, শুধু লগইন করলে যোগ/এডিট
```

এই একটা ক্লাস দিয়েই GET/POST/PUT/DELETE সব কাজ হয়ে যায়। `IsAuthenticatedOrReadOnly` মানে:

| অনুরোধ | লগইন ছাড়া | লগইন করলে |
| --- | --- | --- |
| `GET /api/students/` (তালিকা/দেখা) | ✅ অনুমতি আছে | ✅ |
| `POST /api/students/` (নতুন যোগ) | ❌ 401 Unauthorized | ✅ |
| `PUT` / `DELETE` (এডিট/ডিলিট) | ❌ 401 Unauthorized | ✅ |

## `students/urls.py`

```python
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet

router = DefaultRouter()
router.register('students', StudentViewSet)
urlpatterns = router.urls
```

Router নিজেই পাঁচটা URL বানিয়ে দেয় — `/api/students/`, `/api/students/1/` ইত্যাদি।

## `school_system/urls.py` — চূড়ান্ত সম্পূর্ণ ভার্সন

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('website.urls')),             # Classic website
    path('ckeditor/', include('ckeditor_uploader.urls')),

    # ---- API ----
    path('api/', include('students.urls')),

    # ---- JWT Authentication ----
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ---- API Documentation (Swagger + Redoc) ----
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### এখন কোন ঠিকানায় কী

| URL | কী |
| --- | --- |
| `/` | Classic ওয়েবসাইটের হোম |
| `/contact/` | যোগাযোগ ফর্ম |
| `/admin/` | Admin প্যানেল |
| `/api/students/` | Student API (CRUD) |
| `/api/token/` | লগইন করে টোকেন নেওয়া |
| `/api/token/refresh/` | টোকেন রিফ্রেশ |
| `/api/docs/swagger/` | ইন্টারেক্টিভ Swagger UI |
| `/api/docs/redoc/` | পড়ার-উপযোগী Redoc ডকুমেন্টেশন |
| `/ckeditor/` | রিচ এডিটরের ছবি আপলোড |
| `/media/...` | আপলোড করা ছবি (শুধু DEBUG মোডে) |

> `static(...)` লাইনটা শুধু ডেভেলপমেন্টে (`DEBUG=True`) কাজ করে — Django নিজে আপলোড করা ফাইল সার্ভ করে। প্রোডাকশনে এটা Nginx বা ক্লাউড স্টোরেজের কাজ।

➡️ পরের পর্ব: [চালিয়ে টেস্ট](/django/run-and-test) — সব একসাথে চালু করে Swagger আর JWT দিয়ে টেস্ট করি।
