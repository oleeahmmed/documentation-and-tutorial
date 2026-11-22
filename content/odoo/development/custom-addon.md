---
title: custom_addons ফোল্ডার
description: Odoo Apps Store বা GitHub থেকে আনা মডিউল সার্ভারে রেখে ইনস্টল করা।
icon: Package
---

**গল্প:** রূপসী ফ্যাশনের bKash পেমেন্ট মডিউল Odoo-র ডিফল্ট অ্যাপে নেই — GitHub থেকে ZIP নামানো হয়েছে। এটা **custom addons** পদ্ধতিতে বসাতে হবে: ফাইল সার্ভারে রেখে, রিস্টার্ট করে, তারপর Apps মেনু থেকে ইনস্টল।

## ধাপগুলো

1. ডাউনলোড করা মডিউলের **ZIP** ফাইলটা আনজিপ করো
2. আনজিপ করা ফোল্ডারটা Odoo সার্ভারের **custom_addons** ফোল্ডারের ভেতরে রাখো
   - সঠিক পাথ জানতে `odoo.conf`-এর **addons_path** লাইনটা দেখো
3. Odoo সার্ভার **রিস্টার্ট** করো
4. Odoo-তে লগইন করে **Settings → General Settings**-এ যাও, নিচে স্ক্রল করে **Activate the developer mode** অন করো
5. **Apps** মেনু → উপরের মেনুবার থেকে **Update Apps List** → পপ-আপে **Update**
6. সার্চ বারে মডিউলের নাম লিখে **Activate / Install** চাপো

## addons_path চেক

`odoo.conf`-এ এমন একটা লাইন থাকবে:

```ini
addons_path = /home/odoo/my-odoo/odoo/addons,/home/odoo/my-odoo/custom_addons
```

দুই পথ কমা দিয়ে আলাদা — দ্বিতীয়টাই তোমার কাস্টম ফোল্ডার। পুরো কনফিগ আগে দেখে নাও: [ডাটাবেস ও কনফিগ](/odoo/installation/config-database)।

## রিস্টার্ট

```bash
sudo systemctl restart odoo
```

> আমাদের এই গাইডে সার্ভিসের নাম `my-odoo` — তাহলে:
>
> ```bash
> sudo systemctl restart my-odoo
> ```

## ফোল্ডার স্ট্রাকচার ঠিক আছে তো?

```text
custom_addons/
└── module_technical_name/
    ├── __manifest__.py     ← এই ফাইলটা সরাসরি এখানে থাকতে হবে
    ├── models/
    └── views/
```

ZIP থেকে বের করার পর অনেক সময় ভেতরে আরেকটা ফোল্ডার থাকে (`module/module/__manifest__.py`) — তখন এক লেভেল বাইরের ফোল্ডারটা `custom_addons`-এ রাখো।

## টিপস

| ভুল | ঠিক |
| --- | --- |
| `custom_addons`-এ রাখা হলো কিন্তু addons_path-এ নেই | `odoo.conf`-এ পাথ যোগ করো |
| রিস্টার্ট না করা | ফাইল রাখার পর অবশ্যই রিস্টার্ট |
| Update Apps List না করা | Developer Mode অন করে Update দাও |
| ফোল্ডার nested | `__manifest__.py` সরাসরি মডিউল ফোল্ডারে থাকুক |

➡️ পরের পদ্ধতি: [কমান্ড লাইন (CLI)](/odoo/development/cli-install)
