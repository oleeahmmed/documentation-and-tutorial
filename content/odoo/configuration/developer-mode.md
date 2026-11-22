---
title: Developer Mode
description: Technical Menu আর ডেভেলপার টুলস চালু/বন্ধ করা — সহজ ধাপে।
icon: Wrench
---

## Developer Mode কী

এটা Odoo-র "ভেতরের চাবি" — চালু করলে এমন অনেক মেনু/অপশন দেখা যায় যেগুলো সাধারণ ইউজারের দরকার হয় না:

- Technical Menu (Settings → Technical)
- Apps → Update Apps List
- Scheduled Actions, Server Actions
- ফিল্ড/ভিউয়ের টেকনিক্যাল নাম

## চালু করার দুটো উপায়

### উপায় ১: URL দিয়ে (সবচেয়ে সহজ)

ব্রাউজারের ঠিকানায় হাত দিয়ে:

```text
http://your-server-ip:8069/web?debug=1
```

### উপায় ২: Settings থেকে

**Settings** পেজের একদম নিচে গিয়ে **Activate the developer mode** লিংকে ক্লিক করো।

## বন্ধ করা

- URL-এ `debug=0` করো:

```text
http://your-server-ip:8069/web?debug=0
```

- অথবা Settings পেজে **Deactivate the developer mode** লিংকে ক্লিক করো

## চালু থাকলে কোথায় যায়

| মেনু | কাজ |
| --- | --- |
| Settings → Technical | সব টেকনিক্যাল সেটিংস |
| Apps → Update Apps List | নতুন মডিউল খুঁজে পাওয়া |
| Technical → Scheduled Actions | সময়-ভিত্তিক কাজ |
| Technical → Server Actions | অটোমেশন |

## টিপস

- Developer Mode শুধু কাজের সময় চালু রাখো — ভুল করে কিছু বদলে ফেলার ঝুঁকি কমবে
- টেকনিক্যাল মেনুতে বদলানোর আগে বুঝে নাও — এখানকার ভুল সেটিংস সাইট ভেঙে দিতে পারে
- নতুন মডিউল ইনস্টল/আপডেটের পর Apps List আপডেট করতে এটা লাগবেই

➡️ শেষ: [সারসংক্ষেপ](/odoo/summary)
