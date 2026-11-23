---
title: Testing
description: TestClient আর pytest দিয়ে endpoint-গুলো স্বয়ংক্রিয়ভাবে যাচাই করা।
icon: FlaskConical
---

## গল্প

প্রতিবার কোড বদলানোর পর ব্রাউজারে-/docs-এ গিয়ে হাতে টেস্ট করা কষ্টকর, আর ভুলে যাওয়ার ভয়ও থাকে। করিম ভাই বললেন — "একবার লিখে রাখো, পরে নিজেই নিজেকে পরীক্ষা করবে।" সেটাই pytest।

## কোড (`test_main.py`)

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "রূপসী ফ্যাশনের API-তে স্বাগতম"}

def test_create_product():
    response = client.post(
        "/products",
        json={"name": "টেস্ট পণ্য", "price": 100},
    )
    assert response.status_code == 201
    assert response.json()["name"] == "টেস্ট পণ্য"
```

`TestClient` আসলে অ্যাপটা মেমরির ভেতরেই চালায় — আলাদা সার্ভার চালু করতে হয় না, পোর্টও লাগে না।

## চালাও

```bash
pip install pytest
pytest
```

```text
==================== test session starts ====================
collected 2 items

test_main.py ..                                       [100%]

===================== 2 passed in 0.42s =====================
```

## আরও কিছু দরকারি টেস্ট

```python
def test_product_not_found():
    response = client.get("/products/9999")
    assert response.status_code == 404

def test_invalid_price():
    response = client.post("/products", json={"name": "ভুল পণ্য", "price": -5})
    assert response.status_code == 422
```

## টিপস

- ডেটাবেস-নির্ভর টেস্ট আসল `rupashi.db`-তে লিখে ফেলতে পারে। ভালো অভ্যাস: টেস্টের জন্য আলাদা ডেটাবেস (যেমন `test.db`) ব্যবহার করা, আর প্রতি টেস্টের পরে পরিষ্কার করা।
- endpoint-এ `status_code=201` সেট করা না থাকলে `assert response.status_code == 200` লিখতে হবে — টেস্ট আর কোড দুটোর স্টেটাস কোড মিলিয়ে নাও।
- protected endpoint টেস্ট করতে আগে `/token` থেকে টোকেন নিয়ে হেডারে দাও:

```python
def test_protected():
    token = client.post("/token", data={"username": "korim", "password": "mypassword"}).json()["access_token"]
    response = client.post(
        "/products",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "টেস্ট চাদর", "price": 500},
    )
    assert response.status_code == 201
```

- ফাইলের নাম `test_*.py` রাখলেই pytest নিজে খুঁজে নেয়।

সবকিছু একসাথে জোড়া লাগানোর সময় — [সম্পূর্ণ প্রজেক্ট](/fastapi/full-project)।
