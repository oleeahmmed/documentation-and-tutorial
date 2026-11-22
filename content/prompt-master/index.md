---
title: Prompt Master
description: প্রজেক্ট ডিপ্লয় আর সমস্যা নির্ণয়ের জন্য তৈরি মাস্টার প্রম্পট।
icon: WandSparkles
---

এখানে সেইসব প্রম্পট রাখা হবে, যেগুলো কপি করে AI-কে দিলেই একটা বড় কাজ শুরু থেকে শেষ পর্যন্ত হয়ে যায়। শুরু হচ্ছে deploy দিয়ে — একটা স্ক্রিপ্টেই ডিপ্লয়, আর সমস্যা হলে একই স্ক্রিপ্টের `--diagnose` দিয়ে কারণ খোঁজা।

## টপিক

| টপিক | কী আছে |
| --- | --- |
| [Deploy Master Prompt](/prompt-master/deploy-master-prompt) | DEPLOY + DIAGNOSE — একটাই `deploy.py` বানানোর সম্পূর্ণ প্রম্পট, প্রজেক্ট বিশ্লেষণের ১৮ ধাপ, কোড কাঠামো আর বাস্তব আউটপুট |
| [Deploy Master Prompt (Domain/IP)](/prompt-master/deploy-master-prompt-domain) | একই প্রম্পট, তবে `.env`-এর `DOMAIN` থেকে Nginx-এর `server_name` — ডোমেইন হলে SSL/Certbot, IP হলে SSL ছাড়া |

## কীভাবে ব্যবহার করবে

1. [Deploy Master Prompt](/prompt-master/deploy-master-prompt) পেজ খুলে মাস্টার প্রম্পট ব্লকটা কপি করো
2. AI-কে (যেমন Claude) তোমার প্রজেক্ট ফোল্ডার দিয়ে প্রম্পটটা দাও
3. পাওয়া সারাংশ টেবিল থেকে `deploy.py`-র `CONFIG` পূরণ করো
4. `python3 deploy.py` দিয়ে ডিপ্লয়, আর সমস্যা হলে `python3 deploy.py --diagnose` চালাও

> এই প্রম্পট যেকোনো ভাষার প্রজেক্টে কাজ করবে — শুধু DEPLOY আর DIAGNOSE, দুটোই একই স্ক্রিপ্টে।
