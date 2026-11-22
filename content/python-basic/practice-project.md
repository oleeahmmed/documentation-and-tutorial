---
title: Practice Project
description: সব ধারণা একসাথে — রূপসী ফ্যাশনের ছোট্ট বিক্রি-ব্যবস্থাপনা প্রোগ্রাম।
icon: Rocket
---

সব ধারণা একসাথে মিলিয়ে, রূপসী ফ্যাশনের একটা ছোট্ট বিক্রি-ব্যবস্থাপনা প্রোগ্রাম:

```python
class Product:
    def __init__(self, name, price, stock):
        self.name = name
        self.price = price
        self.stock = stock

    def sell(self, quantity):
        if quantity > self.stock:
            print(f"দুঃখিত, {self.name}-এর স্টক যথেষ্ট নেই!")
            return 0
        self.stock -= quantity
        total = self.price * quantity
        print(f"{quantity} পিস {self.name} বিক্রি হলো, মোট {total} টাকা।")
        return total

products = [
    Product("উলের ওভারকোট", 1800, 10),
    Product("চাদর", 900, 5)
]

total_sales = 0
for product in products:
    total_sales += product.sell(3)

print(f"\nমোট বিক্রি: {total_sales} টাকা")

with open("daily_report.txt", "w", encoding="utf-8") as f:
    f.write(f"আজকের মোট বিক্রি: {total_sales} টাকা\n")

print("রিপোর্ট ফাইলে সেভ হয়েছে!")
```

## বাস্তব আউটপুট

```text
3 পিস উলের ওভারকোট বিক্রি হলো, মোট 5400 টাকা।
3 পিস চাদর বিক্রি হলো, মোট 2700 টাকা।

মোট বিক্রি: 8100 টাকা
রিপোর্ট ফাইলে সেভ হয়েছে!
```

## কোথায় কী ব্যবহার হলো

| অংশ | কোন অধ্যায়ের ধারণা |
| --- | --- |
| `class Product:` | [Classes ও Objects](/python-basic/classes-objects) |
| `__init__(self, name, price, stock)` | Variables ও Functions |
| `if quantity > self.stock:` | [Conditionals](/python-basic/conditionals) |
| `products = [...]` | [Lists](/python-basic/lists) |
| `for product in products:` | [Loops](/python-basic/loops) |
| `f"{self.name}"` | [Strings](/python-basic/strings) |
| `total_sales += ...` | [Operators](/python-basic/operators) |
| `open(..., encoding="utf-8")` | [File Handling](/python-basic/file-handling) |

> নিজে বদলে দেখো — `quantity` বাড়াও, স্টক কমাও, নতুন পণ্য যোগ করো। কোনো পণ্যের স্টক কম হলে `sell()` নিজেই ভদ্রভাবে জানিয়ে দেবে।
