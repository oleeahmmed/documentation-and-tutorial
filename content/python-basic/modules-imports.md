---
title: Modules ও Imports
description: কোড আলাদা ফাইলে গুছিয়ে রাখা — নিজের মডিউল আর বিল্ট-ইন মডিউল।
icon: Package
---

## গল্প

করিম ভাই চান তার হিসাবের ফাংশনগুলো একটা আলাদা ফাইলে রাখতে, যাতে অন্য ফাইল থেকেও ব্যবহার করতে পারেন।

## ফাইল স্ট্রাকচার

```text
project/
├── shop_utils.py
└── main.py
```

## `shop_utils.py`

```python
def calculate_total(price, quantity):
    return price * quantity

SHOP_NAME = "রূপসী ফ্যাশন"
```

## `main.py`

```python
from shop_utils import calculate_total, SHOP_NAME

print(SHOP_NAME)
print(calculate_total(1500, 3))
```

## বাস্তব আউটপুট

```text
রূপসী ফ্যাশন
4500
```

## Python-এর নিজস্ব মডিউল

পাইথনের নিজস্ব বিল্ট-ইন মডিউলও এভাবেই ব্যবহার হয়:

```python
import math
print(math.sqrt(16))   # 4.0

from datetime import datetime
print(datetime.now())  # বর্তমান তারিখ-সময়
```

## দুটো ধরনের import

| ধরন | উদাহরণ | কখন |
| --- | --- | --- |
| পুরো মডিউল | `import math` → `math.sqrt(16)` | অনেক ফাংশন দরকার হলে |
| নির্দিষ্ট অংশ | `from datetime import datetime` | শুধু কিছু নাম দরকার হলে |

> ফাইলের নামটাই মডিউলের নাম — `shop_utils.py` মানে `import shop_utils`। একই ফোল্ডারে থাকলে `from shop_utils import ...` সরাসরি কাজ করবে।
