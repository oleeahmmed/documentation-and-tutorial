---
title: Developer Tools
description: অ্যাপ লিস্ট আপডেট, শিডিউলড কাজ, টেকনিক্যাল মেনু — কাজের সময়ের টুলস।
icon: Wrench
---

**ডিফল্ট টুল** — **Developer Mode** চালু করলে **Settings**-এর নিচে **Developer Tools** অংশ আর **Technical** মেনু দেখা যায়।

**গল্প:** কাজ চলার সময় করিম ভাইয়ের দরকার হলো — নতুন মডিউল আপডেট করা, ইনভয়েসের কোন ফিল্ড কোথা থেকে আসছে দেখা, আর রাত ১১টায় কম স্টকের রিপোর্ট পাঠানো।

## Developer Mode চালু

**Settings** পেজের একদম নিচে **Activate the developer mode**, অথবা URL-এ:

```text
http://your-server-ip:8069/web?debug=1
```

বিস্তারিত: [Developer Mode](/odoo/configuration/developer-mode)

## Developer Tools-এর কাজ

| টুল | কোথায় | গার্মেন্টসে কাজ |
| --- | --- | --- |
| Update Apps List | Apps → Update Apps List | নতুন কাস্টম মডিউল খুঁজে পাওয়া |
| Scheduled Actions | Settings → Technical → Scheduled Actions | রাতের রিপোর্ট/স্টক চেক |
| Server Actions | Settings → Technical → Server Actions | অটোমেশন (যেমন অর্ডার স্ট্যাটাস বদল) |
| Fields / Views | Settings → Technical → Database Structure | ইনভয়েসের ফিল্ড/ভিউ দেখা |
| Access Rights | Settings → Technical → Security | কে কী দেখবে যাচাই |

## শিডিউলড কাজের উদাহরণ

"প্রতিদিন রাত ১১টায় কম স্টকের রিপোর্ট" — একটা Scheduled Action বানিয়ে নির্দিষ্ট সময়ে কোড/অ্যাকশন চালানো যায়। শুরুতে UI-র রিপোর্ট + ম্যানুয়াল চেকই যথেষ্ট, পরে অটোমেট করো।

## টিপস

| কাজ | খেয়াল রাখো |
| --- | --- |
| টেকনিক্যাল বদল | টেস্ট ডাটাবেসে আগে করে দেখো |
| কাজ শেষে | Developer Mode বন্ধ করো (`?debug=0`) |
| আপডেট | কোড আপডেটের পর Apps List আপডেট + Upgrade দরকার হতে পারে |

➡️ পরের টপিক: [Languages](/odoo/configuration/languages)
