---
title: Artifacts
description: Structured outputs agents can create and share.
icon: Boxes
---

> এই পেজটা [Files](/docs/core-concepts/files) পেজের ধারাবাহিকতা — ফাইল পড়া হয়ে গেছে, এবার কাজের ফলাফল ফাইল আকারে সেভ করার পালা।

## ধাপ ১৯ (চলমান): Artifacts

### বাস্তব গল্প (রূপসী ফ্যাশন)

নাদিয়ার লেখা পোস্টগুলো করিম ভাই শুধু স্ক্রিনে দেখে সন্তুষ্ট না — তিনি চান পোস্টগুলো একটা **ফাইলে স্থায়ীভাবে সেভ** হয়ে যাক, যাতে পরে প্রিন্ট করতে পারেন বা অন্য কাউকে পাঠাতে পারেন। আর যদি পরে পোস্টের ভাষা বদলাতে হয়, তাহলে যেন আগের ভার্সনটাও খুঁজে পাওয়া যায়।

### CrewAI-তে এই একই জিনিস

এই “কাজের ফলাফল একটা নামকরা, ভার্সন-সহ ফাইল আকারে সেভ করে রাখা”-কে CrewAI-তে বলা হয় **Artifact**। এটা opt-in — না চাইলে কিছু সেভ হয় না।

### কোড — Task-এর ফলাফল Artifact আকারে সেভ

```python
from crewai import Artifact, Task

marketing_task = Task(
    description="ডিজাইনারের দেওয়া আইডিয়া ব্যবহার করে মার্কেটিং পোস্ট লেখো।",
    expected_output="৩টা ডিজাইনের জন্য আলাদা আলাদা মার্কেটিং পোস্ট।",
    agent=marketer,
    context=[design_task],
    artifact=Artifact(
        identifier="eid-fashion-posts",   # ফাইলের নামের আইডি
        title="ঈদ ফ্যাশন ২০২৭ পোস্ট",
        kind="markdown"                    # কোন ফরম্যাটে সেভ হবে
    )
)
```

এখানে কোনো Tool কল হচ্ছে না, বাড়তি token-ও লাগছে না — Task শেষ হলেই CrewAI নিজে থেকে আউটপুটটা artifact হিসেবে সেভ করে দেয়।

চাইলে আরও সহজে শুধু `artifact=True` দিলে CrewAI নিজেই নাম আর ধরন ঠিক করে নেয়।

### পুরোনো সহজ পথ — `output_file`

শুধু একটা সাধারণ ফাইলে লেখা দরকার হলে আগের মতোই `output_file` ব্যবহার করা যায়:

```python
marketing_task = Task(
    description="ডিজাইনারের দেওয়া আইডিয়া ব্যবহার করে মার্কেটিং পোস্ট লেখো।",
    expected_output="৩টা ডিজাইনের জন্য আলাদা আলাদা মার্কেটিং পোস্ট।",
    agent=marketer,
    context=[design_task],
    markdown=True,                        # 👈 markdown ফরম্যাটে লেখা হবে
    output_file="eid_fashion_posts.md"    # 👈 এই ফাইলে সেভ হবে
)
```

`output_file` = সহজ, একটা ফাইল; `Artifact` = নামকরা, ভার্সন-সহ, রান-ভিত্তিক ফোল্ডারে সাজানো।

### বাস্তবে কী ঘটে

Crew রান শেষে নাদিয়ার পোস্টগুলো এমন ফাইলে সেভ হয়ে যায়:

```text
./artifacts/<run-id>/eid-fashion-posts/v1.md
```

আর কোড থেকে সেটার ঠিকানা পাওয়া যায়:

```python
output = marketing_task.execute_sync()
print(output.artifact.url)
```

একই রানে আবার একই `identifier` দিয়ে সেভ করলে নতুন ফাইল নয়, **v2** তৈরি হয় — তাই মানে আগের ভার্সনও হারায় না।

আর `output_file` দিলে প্রজেক্ট ফোল্ডারেই ফাইলটা আসে:

```markdown
# ঈদ ফ্যাশন কালেকশন ২০২৭ — মার্কেটিং পোস্ট

## পোস্ট ১
🎉 ঈদের রঙিন আনন্দে রূপসী ফ্যাশনের নতুন কালেকশন নিয়ে হাজির হলাম...

## পোস্ট ২
🧵 ঐতিহ্য আর আধুনিকতার মেলবন্ধন — দেশি তাঁতের পাঞ্জাবি...
```

এটাই “artifact” — কাজের একটা স্থায়ী, ধরে রাখার মতো ফলাফল, যেটা তুমি পরে ব্যবহার করতে পারবে।

**কোন kind-এ সেভ হবে:** `markdown`, `html`, `json`, `csv`, `text` — সরাসরি লেখা থেকে হয়। আর `image`, `pdf`, `file` — এগুলোর জন্য `file_path` দিতে হয় (যেমন সুমনের ছবি বা PDF)। সেই ফাইলটা প্রজেক্ট ফোল্ডারের ভেতরে থাকতে হবে।

### ছোট্ট নোট

Artifact সেভ হলেই একটা `ArtifactCreatedEvent` তৈরি হয় — یعنی [Event Listeners](/docs/core-concepts/event-listeners) দিয়ে চাইলে প্রতিবার নতুন artifact সেভ হলে নিজে থেকে নোটিফিকেশনও নেওয়া যায়।

### পরের ধাপ

- [CLI](/docs/core-concepts/cli) — পুরো প্রজেক্ট গোছানো কাঠামোয় সাজানো
- [Files](/docs/core-concepts/files) — আগের ধাপে ফিরে যেতে চাইলে
