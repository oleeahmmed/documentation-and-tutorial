---
title: Authentication — OAuth2 + JWT
description: পাসওয়ার্ড হ্যাশ, টোকেন তৈরি আর protected endpoint — Swagger Authorize বাটনসহ।
icon: KeyRound
---

## গল্প

এখন থেকে পণ্য যোগ করা যাবে শুধু লগইন করা ইউজারের পক্ষ থেকে। করিম ভাই ভাবছেন — "পাসওয়ার্ড কোথায় রাখব?" ঠিক উত্তর: কোথাও প্লেইন টেক্সটে নয়। রাখব **হ্যাশ**, আর লগইনের পর ক্লায়েন্টকে দেব একটা **টোকেন** — প্রতিবার পাসওয়ার্ড পাঠানোর দরকার নেই।

## ইনস্টলেশন

```bash
pip install "python-jose[cryptography]" "passlib[bcrypt]"
```

`fastapi[standard]` আগেই ইনস্টল করা থাকলে form-data (`python-multipart`) নিয়ে ভাবতে হবে না — সেটা এর ভেতরেই আছে।

## কোড (`auth.py`)

```python
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = "your-secret-key"   # প্রোডাকশনে অবশ্যই environment variable থেকে নাও
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

fake_users_db = {
    "korim": {
        "username": "korim",
        "hashed_password": pwd_context.hash("mypassword"),
    }
}

def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=30)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username not in fake_users_db:
            raise HTTPException(status_code=401, detail="অবৈধ টোকেন")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="অবৈধ টোকেন")
```

`datetime.utcnow()` পুরোনো Python-এ দেখা যায়, কিন্তু 3.12+ থেকে deprecated — তাই `datetime.now(timezone.utc)` ব্যবহার করাই ভালো।

## `main.py`-তে ব্যবহার

```python
from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from auth import (
    create_access_token,
    fake_users_db,
    get_current_user,
    pwd_context,
)

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="ভুল ইউজারনেম/পাসওয়ার্ড")

    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}

CurrentUser = Annotated[str, Depends(get_current_user)]

@app.post("/products")
def create_product(product: Product, current_user: CurrentUser):
    return {"created_by": current_user, "product": product}
```

## বাস্তবে কী ঘটে

লগইন করে টোকেন নাও:

```bash
curl -X POST http://127.0.0.1:8000/token \
  -d "username=korim&password=mypassword"
```

```json
{"access_token": "eyJhbGciOi...", "token_type": "bearer"}
```

টোকেন দিয়ে protected endpoint:

```bash
curl -X POST http://127.0.0.1:8000/products \
  -H "Authorization: Bearer eyJhbGciOi..." \
  -H "Content-Type: application/json" \
  -d '{"name": "চাদর", "price": 900}'
```

টোকেন ছাড়া বা ভুল টোকেন দিলে:

```json
{"detail": "Not authenticated"}
```

Swagger UI-তে (`/docs`) ডান দিকে **Authorize** বাটন দেখবে — সেখানে টোকেন বসিয়ে সরাসরি ব্রাউজার থেকে টেস্ট করা যায়।

## টিপস

- `SECRET_KEY` কখনো কোডে কমিট করো না — `.env` বা সার্ভারের environment variable-এ রাখো।
- `tokenUrl="token"`-এর সাথে বাস্তব রুট মিলতে হবে। login রুটের prefix থাকলে (যেমন `/auth/token`) সেটাই লেখো — নইলে Swagger-এর Authorize কাজ করবে না।
- টোকেনের ভেতরে `sub` (subject) ছাড়াও `role` রাখতে পারো — পরে রোল-ভিত্তিক অনুমতি দিতে সুবিধা হবে।

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `AttributeError: module 'bcrypt' has no attribute '__about__'` | passlib পুরোনো bcrypt-এর সাথে কাজ করে — `pip install "bcrypt==4.0.1"` |
| `401 Not authenticated` | `Authorization: Bearer <token>` হেডারটা ঠিকভাবে পাঠানো হয়েছে কিনা দেখো |
| Swagger-এ Authorize বাটন নেই | protected কোনো endpoint থাকলেই বাটনটা আসে |
| `python-multipart` এরর | `pip install python-multipart` (অথবা `fastapi[standard]` ইনস্টল করো) |

পরের ধাপে অ্যাপ চালু/বন্ধের সময়ের কাজ — [Lifespan](/fastapi/lifespan)।
