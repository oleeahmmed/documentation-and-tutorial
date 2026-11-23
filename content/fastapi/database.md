---
title: Database — SQLAlchemy
description: SQLite আর SQLAlchemy দিয়ে পণ্য আসল ডেটাবেসে সেভ ও পড়া — Django ORM-এর বিকল্প।
icon: Database
---

## গল্প

এখন পর্যন্ত `fake_db` একটা Python dict — সার্ভার বন্ধ করলেই সব হারিয়ে যাবে। করিম ভাইয়ের দোকানে পণ্যের তালিকা তো থেকে যেতে হবে। তাই SQLite (ছোট প্রজেক্টে দুর্দান্ত) আর SQLAlchemy (Django ORM-এর বিকল্প) দিয়ে আসল ডেটাবেস যুক্ত করব। PostgreSQL-এ যেতে চাইলে শুধু `DATABASE_URL` বদলাবে — বাকি কোড প্রায় একই।

## ইনস্টলেশন

```bash
pip install sqlalchemy
```

## কোড (`database.py`)

```python
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./products.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite + FastAPI threading-এর জন্য
)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class ProductModel(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

`Base.metadata.create_all` প্রথমবার চালানোর সময় `products` টেবিল বানায়। টেবিল আগে থেকে থাকলে কিছুই করে না — তাই প্রতিবার চালালেও নিরাপদ।

## `main.py`-তে ব্যবহার

```python
from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session

from database import ProductModel, get_db

DBSession = Annotated[Session, Depends(get_db)]

@app.post("/products")
def create_product(product: Product, db: DBSession):
    db_product = ProductModel(name=product.name, price=product.price, stock=product.stock)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)   # DB-র দেওয়া id ফেরত আনে
    return db_product

@app.get("/products")
def list_products(db: DBSession):
    return db.query(ProductModel).all()
```

## বাস্তবে কী ঘটে

```bash
curl -X POST http://127.0.0.1:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "মাফলার", "price": 350}'
```

```json
{"id": 1, "name": "মাফলার", "price": 350.0, "stock": 0}
```

```bash
curl http://127.0.0.1:8000/products
```

```json
[{"id": 1, "name": "মাফলার", "price": 350.0, "stock": 0}]
```

সার্ভার বন্ধ করে আবার চালু করেও `/products` হিট করো — ডেটা ঠিকই থাকবে, কারণ এখন সেটা ফাইলে (`products.db` — SQLite) সেভ হয়েছে।

## আউটপুটটা সুন্দর করতে

উপরে `db_product` SQLAlchemy অবজেক্ট সরাসরি ফেরত দেওয়া হয়েছে — FastAPI কোন ফিল্ড নেবে তা জানে না, তাই `_sa_instance_state`-এর মতো ভেতরের জিনিসও ঢুকে যেতে পারে। সমাধান: `response_model` আর `from_attributes`:

```python
class ProductOut(BaseModel):
    id: int
    name: str
    price: float
    stock: int

    model_config = {"from_attributes": True}

@app.post("/products", response_model=ProductOut)
def create_product(product: Product, db: DBSession):
    ...
```

এখন ঠিক `id`, `name`, `price`, `stock`—এই চারটা ফিল্ডই যাবে।

## টিপস

- ডেটাবেসের কাঠামো (নতুন কলাম, টেবিল) পরে বদলাতে হলে `create_all` যথেষ্ট নয় — তখন **Alembic** দিয়ে migration করতে হয়। ছোট প্রজেক্টে ফাইল মুছে আবার বানালেই চলে, কিন্তু প্রোডাকশনে Alembic শিখে নিও।
- `db.commit()` না করলে কিছুই সেভ হয় না — এটা নতুনদের সবচেয়ে সাধারণ ভুল।
- প্রতিটা রিকোয়েস্টে `get_db` নতুন session দেয় আর শেষে বন্ধ করে — কোনো session গ্লোবালি শেয়ার করো না।

পরের ধাপ — ইউজারকে অপেক্ষা না করিয়ে কাজ করার [Background Tasks](/fastapi/background-tasks)।
