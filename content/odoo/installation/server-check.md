---
title: সার্ভার চেক
description: RAM, ডিস্ক, CPU আর Ubuntu ভার্সন যাচাই — দরকার হলে swap ফাইল।
icon: Server
---

## ধাপ ১: সার্ভার রিসোর্স চেক করা

Odoo ইনস্টল শুরু করার আগে দেখে নাও সার্ভারে যথেষ্ট জায়গা আর মেমরি আছে কিনা।

```bash
# RAM চেক
free -h

# ডিস্ক স্পেস চেক
df -h

# CPU কোর চেক
nproc

# Ubuntu ভার্সন চেক
lsb_release -a
```

## ন্যূনতম রিকোয়ারমেন্ট

| রিসোর্স | ন্যূনতম (ডেভেলপমেন্ট/টেস্ট) | প্রোডাকশন রেকমেন্ড |
| --- | --- | --- |
| RAM | 2 GB | 4 GB+ |
| ডিস্ক | 10 GB ফাঁকা | 20 GB+ |
| CPU | 1 কোর | 2 কোর+ |
| Ubuntu | 22.04 LTS বা তার উপরে | 22.04/24.04 LTS |

## RAM কম থাকলে swap বানাও

swap হলো ডিস্কের একটা অংশ, যেটা RAM ভরে গেলে সাময়িক মেমরি হিসেবে কাজ করে। 2 GB সার্ভারে Odoo চালাতে এটা প্রায় বাধ্যতামূলক:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h   # এবার swap দেখাবে
```

লাইনটা একটা একটা করে কী হচ্ছে:

| কমান্ড | কাজ |
| --- | --- |
| `fallocate -l 2G /swapfile` | ২ জিবি সাইজের ফাইল বানায় |
| `chmod 600` | শুধু owner পড়তে/লিখতে পারবে (নিরাপত্তা) |
| `mkswap` | ফাইলটাকে swap অঞ্চল হিসেবে প্রস্তুত করে |
| `swapon` | এখনই swap চালু করে |
| `fstab`-এ লাইন যোগ | সার্ভার রিবুট হলেও swap নিজে থেকে চালু হবে |

`free -h`-এর আউটপুটে `Swap:` লাইনে 2.0Gi দেখা গেলে ঠিক আছে।

➡️ পরের ধাপ: [সিস্টেম সেটআপ](/odoo/installation/system-setup) — দরকারি সফটওয়্যারগুলো ইনস্টল করি।
