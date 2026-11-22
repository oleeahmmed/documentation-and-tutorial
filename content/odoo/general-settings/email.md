---
title: Email Configuration
description: কোটেশন পাঠানো আর বায়ারের উত্তর নেওয়ার জন্য Outgoing/Incoming Mail Server।
icon: Mail
---

**ডিফল্ট টুল** — মেইল সার্ভার সেটিং সাধারণত **Settings → Technical → Outgoing Mail Servers / Incoming Mail Servers**-এ থাকে (Developer Mode চালু থাকলে দেখা যায়)। কিছু ভার্সনে **Settings**-এর Emails অংশেও শর্টকাট থাকে।

**গল্প:** নাদিয়া বায়ার *Styles & Threads*-কে কোটেশন ইমেইল করবে, বায়ার রিপ্লাই দিলে সেটা Odoo-তেই আসবে। আবার নতুন ইউজার বানালে Odoo ইনভাইট মেইল পাঠাবে।

## Outgoing Mail Server (পাঠানো)

1. **Settings → Technical → Outgoing Mail Servers → New**
2. SMTP তথ্য দাও:

| ফিল্ড | Gmail-এর উদাহরণ |
| --- | --- |
| SMTP Server | `smtp.gmail.com` |
| Port | `587` |
| Connection Encryption | TLS |
| Username | `rupashi@gmail.com` |
| Password | **App Password** (সাধারণ পাসওয়ার্ড নয়) |

3. **Test Connection** চাপো
4. **Save**

Gmail-এ সাধারণ পাসওয়ার্ড কাজ করবে না — Google Account → Security → **App Password** বানাতে হবে।

## Incoming Mail Server (গ্রহণ)

1. **Settings → Technical → Incoming Mail Servers → New**
2. IMAP তথ্য দাও — `imap.gmail.com`, port `993`, SSL, username/password
3. **Test & Confirm** → **Save**

বায়ারের রিপ্লাই Odoo-তে আনতে চাইলে সংশ্লিষ্ট অ্যাপ (Sales/Helpdesk) আর ইমেইল alias-ও সেট করতে হয়।

## আলাদা ঠিকানা (Alias)

চাইলে `sales@rupashi.com`, `accounts@rupashi.com`-এর মতো ঠিকানা বানিয়ে আলাদা কাজে ভাগ করা যায় — **Settings → Technical → Alias Domains**।

## টিপস

| কাজ | খেয়াল রাখো |
| --- | --- |
| পাসওয়ার্ড | App Password কোথাও কমিট করো না — শুধু Odoo-র সেটিংসে থাকবে |
| স্প্যাম | প্রথম কয়েকটা টেস্ট মেইল স্প্যামে যেতে পারে |
| বায়ারের ইমেইল | ইনভয়েস PDF অ্যাটাচমেন্টসহ যায় — রিপোর্টে কোম্পানির তথ্য ঠিক রাখো |

➡️ পরের টপিক: [Document Management](/odoo/general-settings/documents)
