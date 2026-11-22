---
title: Classes ও Objects
description: বাস্তব জিনিসকে কোডে রূপ দেওয়া — Employee ক্লাস, অবজেক্ট আর মেথড।
icon: Boxes
---

## গল্প

করিম ভাই চান প্রতিটা কর্মীর (রফিক, সুমন, নাদিয়া) তথ্য একসাথে গুছিয়ে রাখতে — নাম, পদবী, বেতন — আর প্রতিজনের একটা "পরিচয় দেখানোর" ক্ষমতা থাকুক। এটাই Class আর Object-এর কাজ।

## কোড

```python
class Employee:
    def __init__(self, name, role, salary):
        self.name = name
        self.role = role
        self.salary = salary

    def introduce(self):
        print(f"আমার নাম {self.name}, আমি একজন {self.role}।")

    def give_raise(self, amount):
        self.salary += amount
        print(f"{self.name}-এর নতুন বেতন: {self.salary} টাকা")

# Object বানানো
rafiq = Employee("রফিক", "বাজার গবেষক", 20000)
suman = Employee("সুমন", "ফ্যাশন ডিজাইনার", 25000)

rafiq.introduce()
suman.introduce()
rafiq.give_raise(2000)
```

## বাস্তব আউটপুট

```text
আমার নাম রফিক, আমি একজন বাজার গবেষক।
আমার নাম সুমন, আমি একজন ফ্যাশন ডিজাইনার।
রফিক-এর নতুন বেতন: 22000 টাকা
```

## অংশগুলো

| অংশ | কাজ |
| --- | --- |
| `class Employee:` | টেমপ্লেট / নকশা |
| `__init__(...)` | নতুন Object বানানোর সময় প্রথমে চলে |
| `self` | এই Object-টা নিজেকে বোঝায় |
| `rafiq = Employee(...)` | নকশা থেকে আসল Object |

**ব্যাখ্যা:** `Employee` হলো একটা **টেমপ্লেট/নকশা** (Class), আর `rafiq`, `suman` হলো সেই নকশা থেকে বানানো **আসল জিনিস** (Object) — ঠিক যেমন একটা বাড়ির ডিজাইন আর তা দিয়ে বানানো আসল বাড়ি।

> CrewAI-এর `Agent(...)`, `Task(...)`, `Crew(...)` — সবই ঠিক এই ক্লাস আর অবজেক্টের নিয়মেই কাজ করে। তাই এই অধ্যায়টা ভালো করে বুঝে নিলে CrewAI অনেক সহজ লাগবে।
