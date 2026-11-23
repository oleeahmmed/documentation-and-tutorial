---
title: File Upload
description: পণ্যের ছবি আপলোড — UploadFile আর multipart form-data।
icon: Upload
---

## গল্প

ওয়েবসাইটে প্রতিটা পণ্যের সাথে ছবি থাকবে। ছবি আসবে ফাইল হিসেবে — JSON নয়, **multipart/form-data**-তে। FastAPI-তে এটার জন্য `UploadFile` আছে।

## কোড

```python
from fastapi import File, UploadFile
import shutil
import os

os.makedirs("uploads", exist_ok=True)   # ফোল্ডার না থাকলে বানিয়ে নাও

@app.post("/products/{product_id}/upload-photo")
def upload_photo(product_id: int, file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "product_id": product_id}
```

- `file: UploadFile = File(...)` — `...` মানে ফাইলটা বাধ্যতামূলক
- `"wb"` — বাইনারি মোডে লিখতে হবে, নইলে ছবি নষ্ট হবে

## বাস্তবে কী ঘটে

```bash
curl -X POST http://127.0.0.1:8000/products/1/upload-photo \
  -F "file=@/path/to/photo.jpg"
```

```json
{"filename": "photo.jpg", "product_id": 1}
```

প্রজেক্ট ফোল্ডারে `uploads/photo.jpg` তৈরি হয়ে যাবে। Swagger UI-তে (`/docs`) ফাইল সিলেক্ট করার বাটনও পাওয়া যাবে।

## টিপস

- প্রোডাকশনে `file.filename` সরাসরি বিশ্বাস করো না — নাম বদলে ইউনিক নাম দাও (যেমন `{product_id}-{uuid4()}.jpg`), নইলে একই নামের ফাইল একটার ওপর আরেকটা লিখে যাবে।
- ছবির ধরন ও সাইজ যাচাই করো:

```python
ALLOWED = {"image/jpeg", "image/png", "image/webp"}

if file.content_type not in ALLOWED:
    raise HTTPException(status_code=400, detail="শুধু JPG/PNG/WEBP চলবে")
```

- বড় আপলোডে `UploadFile` ডিস্কে সাময়িকভাবে রাখে — RAM ভরে যায় না। `await file.read()` দিয়ে পুরোটা একসাথে পড়া এড়িয়ে চলো।
- বাস্তব সাইটে ছবি সাধারণত S3/Cloudinary-তে যায় — ফাইলের স্ট্রিমটা সরাসরি সেখানে পাঠানো যায়, সার্ভারের ডিস্কে রাখার দরকার নেই।

এবার প্রশ্ন — FastAPI আসলে এত দ্রুত কেন? [Async](/fastapi/async)।
