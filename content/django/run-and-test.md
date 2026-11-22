---
title: চালিয়ে টেস্ট
description: superuser বানানো, Swagger-এ Try it out, JWT + multipart curl দিয়ে ছাত্র যোগ।
icon: Terminal
---

## সব একসাথে চালু

```bash
python manage.py createsuperuser
python manage.py runserver
```

## Swagger/Redoc ডকুমেন্টেশন

| URL | কী দেখাবে |
| --- | --- |
| `http://127.0.0.1:8000/api/docs/swagger/` | ইন্টারেক্টিভ Swagger UI — সরাসরি API টেস্ট করা যাবে |
| `http://127.0.0.1:8000/api/docs/redoc/` | সুন্দর, পড়ার-উপযোগী Redoc ডকুমেন্টেশন |

Swagger UI-তে `/api/students/` এন্ডপয়েন্টে ক্লিক করে **"Try it out"** বাটন দিয়ে সরাসরি ব্রাউজার থেকেই POST/GET রিকোয়েস্ট পাঠিয়ে টেস্ট করা যায় — Postman ছাড়াই।

## JWT দিয়ে লগইন ও নতুন ছাত্র যোগ

### ধাপ ১ — লগইন

```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -d "username=admin&password=yourpassword"
```

```json
{"refresh": "eyJ...", "access": "eyJ..."}
```

### ধাপ ২ — টোকেন দিয়ে নতুন ছাত্র যোগ

ছবি আছে বলে এখানে সাধারণ JSON না, `multipart/form-data` লাগবে:

```bash
curl -X POST http://127.0.0.1:8000/api/students/ \
  -H "Authorization: Bearer eyJ..." \
  -F "name=রহিম উদ্দিন" \
  -F "roll_number=101" \
  -F "student_class=9" \
  -F "email=rahim@example.com" \
  -F "photo=@/path/to/photo.jpg" \
  -F "bio=<p>একজন মেধাবী ছাত্র।</p>"
```

## বাস্তবে কী ঘটে — পুরো চেইন একসাথে

```text
১. Student তৈরি হলো, ছবি Pillow দিয়ে প্রসেস হয়ে media/student_photos/-এ সেভ হলো
২. post_save Signal ট্রিগার হলো
৩. SMTP দিয়ে rahim@example.com-এ স্বাগতম-ইমেইল পাঠানো হলো
৪. API রেসপন্স ফিরে এলো:
```

```json
{
    "id": 1,
    "name": "রহিম উদ্দিন",
    "roll_number": "101",
    "student_class": "9",
    "email": "rahim@example.com",
    "photo": "/media/student_photos/photo.jpg",
    "bio": "<p>একজন মেধাবী ছাত্র।</p>",
    "enrolled_at": "2026-11-23T10:30:00Z"
}
```

### একবারে পুরো সিস্টেম যাচাই

1. Admin-এ গিয়ে ছাত্রের তালিকায় গোল ছবিটা দেখা যাচ্ছে কিনা
2. `http://127.0.0.1:8000/media/student_photos/photo.jpg` খুলছে কিনা
3. নতুন ছাত্রের ইমেইলে স্বাগতম-বার্তা পৌঁছেছে কিনা (ইনবক্স/স্প্যাম দেখো)
4. টোকেন ছাড়া `POST /api/students/` চেষ্টা করলে `401` আসছে কিনা
5. Swagger-এ authorize করে টোকেন দিয়ে একই কাজ হচ্ছে কিনা

➡️ পরের পর্ব: [সারসংক্ষেপ](/django/summary) — ফোল্ডার কাঠামো আর পুরো ম্যাপ এক নজরে।
