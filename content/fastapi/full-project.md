---
title: সম্পূর্ণ প্রজেক্ট — সবকিছু একসাথে
description: রূপসী ফ্যাশনের পণ্য API — database, auth, router, CORS আর Swagger সব জোড়া লাগানো।
icon: Package
---

## গল্প

এখন পর্যন্ত যা শিখেছি — আলাদা আলাদা টুকরো। এবার করিম ভাইয়ের জন্য একসাথে জোড়া লাগাব: আসল ডেটাবেস, JWT লগইন, গোছানো router, CORS আর lifespan। নিচের সব ফাইল একসাথে রাখলে প্রজেক্টটা চালু-অবস্থায় কাজ করবে।

## ফোল্ডার স্ট্রাকচার

```text
rupashi_api/
├── main.py
├── auth.py
├── database.py
├── requirements.txt
└── routers/
    ├── __init__.py      ← ফাঁকা ফাইল
    └── products.py
```

## `requirements.txt`

```text
fastapi[standard]
sqlalchemy
python-jose[cryptography]
passlib[bcrypt]
```

```bash
pip install -r requirements.txt
```

## `database.py`

```python
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./rupashi.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
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

## `auth.py`

```python
import os
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

fake_users_db = {
    "korim": {
        "username": "korim",
        "hashed_password": pwd_context.hash("mypassword"),
    }
}

def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="অবৈধ বা মেয়াদোত্তীর্ণ টোকেন",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise credentials_error

    username = payload.get("sub")
    if username not in fake_users_db:
        raise credentials_error
    return username

router = APIRouter(tags=["Auth"])

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ভুল ইউজারনেম বা পাসওয়ার্ড",
        )
    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}
```

## `routers/products.py`

```python
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from auth import get_current_user
from database import ProductModel, get_db

router = APIRouter(
    prefix="/products",
    tags=["Products"],
    dependencies=[Depends(get_current_user)],   # পুরো router সুরক্ষিত
)

DBSession = Annotated[Session, Depends(get_db)]

class ProductIn(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    price: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)

class ProductOut(BaseModel):
    id: int
    name: str
    price: float
    stock: int

    model_config = ConfigDict(from_attributes=True)

@router.get("/", response_model=list[ProductOut])
def list_products(db: DBSession):
    return db.query(ProductModel).all()

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: DBSession):
    product = db.get(ProductModel, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="পণ্য পাওয়া যায়নি",
        )
    return product

@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductIn, db: DBSession):
    db_product = ProductModel(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
```

## `routers/__init__.py`

```python
```

ফাইলটা ফাঁকা থাকলেও থাকতে হবে।

## `main.py`

```python
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router
from routers import products

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 রূপসী ফ্যাশন API চালু হচ্ছে...")
    yield
    print("🛑 API বন্ধ হচ্ছে, পরিষ্কার করা হচ্ছে...")

app = FastAPI(
    title="রূপসী ফ্যাশন API",
    description="পণ্য ব্যবস্থাপনার সম্পূর্ণ API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(products.router)

@app.get("/")
def home():
    return {"message": "স্বাগতম"}
```

## চালাও ও টেস্ট করো

```bash
fastapi dev main.py
```

**১.** `http://127.0.0.1:8000/docs` খোলো — তিনটা গ্রুপ দেখবে: **Auth**, **Products**, আর root।

**২.** `POST /token`-এ Try it out → username `korim`, password `mypassword` → Execute। `access_token` কপি করো।

**৩.** উপরের **Authorize** বাটনে টোকেন বসিয়ে Authorize করো।

**৪.** `POST /products/`-এ নতুন পণ্য দাও:

```json
{"name": "উলের ওভারকোট", "price": 1800, "stock": 450}
```

উত্তর আসবে `201` স্টেটাসে:

```json
{"id": 1, "name": "উলের ওভারকোট", "price": 1800.0, "stock": 450}
```

**৫.** `GET /products/` চালিয়ে দেখো তালিকায় পণ্যটা আছে। সার্ভার বন্ধ করে আবার চালু করেও দেখো — ডেটা `rupashi.db`-তে টিকে আছে।

## টিপস

- টোকেন ছাড়া `GET /products/` হিট করলে `401 Not authenticated` আসবে — এটাই প্রত্যাশিত, router সুরক্ষিত।
- মূল টেস্টে ব্যবহারের আগে `SECRET_KEY` environment variable সেট করো:

```bash
export SECRET_KEY="$(python -c 'import secrets; print(secrets.token_hex(32))')"
```

- ডিপ্লয়ের সময় `fastapi run main.py --host 0.0.0.0 --port 8000` দিয়ে চালাবে; `fastapi dev` শুধু ডেভেলপমেন্টের জন্য।
- Vercel/Netlify-র ডোমেইন CORS-এর `allow_origins`-এ যোগ করতে ভুলো না।

পুরো যাত্রার সারসংক্ষেপ আর Django-তুলনা — [সারসংক্ষেপ](/fastapi/summary)।
