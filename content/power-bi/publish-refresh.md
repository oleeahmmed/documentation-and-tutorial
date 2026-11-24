---
title: পর্ব ১১ — Publish ও Scheduled Refresh
description: ড্যাশবোর্ড Power BI Service-এ পাবলিশ, করিম ভাইয়ের সাথে শেয়ার, আর প্রতি মাসে অটো আপডেট।
icon: CloudUpload
---

## গল্প

এতক্ষণ সব কাজ হয়েছে করিম ভাইয়ের ল্যাপটপের ভেতরে। কিন্তু তিনি চান সকালে মোবাইলে খুলে দেখবেন, আর প্রতি মাসে নতুন Excel দিলে রিপোর্ট নিজে থেকেই আপডেট হবে। সেজন্য রিপোর্টটা **Power BI Service**-এ তুলতে হবে — এটাই **Publish**।

## ১১.১ — Publish করা

1. Power BI Desktop-এ **Home** ট্যাব → **Publish**
2. Microsoft অ্যাকাউন্ট দিয়ে সাইন-ইন করো (না থাকলে ফ্রি অ্যাকাউন্ট বানাও)
3. Workspace বেছে নাও — তালিকায় `Rupashi Fashion Analytics` না থাকলে **Create a workspace** থেকে বানাও
4. অপেক্ষা করো — **Success!** মেসেজে রিপোর্টের লিংক আসবে
5. লিংকে ক্লিক করলে ব্রাউজারে Service-এ রিপোর্ট খুলবে

Publish করলে দুইটা জিনিস যায়:

| জিনিস | কী |
| --- | --- |
| **Dataset** | ডেটা মডেল, Relationship, মেজার — ম্যানেজ হয় Settings থেকে |
| **Report** | ভিজ্যুয়াল, পেজ, বুকমার্ক — করিম ভাই যা দেখবেন |

## ১১.২ — শেয়ার করা

1. Service-এ রিপোর্ট খোলো
2. উপরে **Share** বাটনে ক্লিক করো
3. করিম ভাইয়ের ইমেইল দাও, পাঠাও

তিনি ব্রাউজারে (`app.powerbi.com`) অথবা **Power BI Mobile** অ্যাপে লাইভ রিপোর্ট দেখতে পারবেন — Desktop লাগবে না।

> **লাইসেন্স নোট:** অন্য কাউকে শেয়ার করা, Scheduled Refresh আর Row-Level Security-এর জন্য সাধারণত **Power BI Pro** লাগে (৩০ দিনের ট্রায়াল আছে)। শুধু নিজে দেখলে ফ্রি অ্যাকাউন্টেও চলে।

## ১১.৩ — Scheduled Refresh (স্বয়ংক্রিয় আপডেট)

করিম ভাই প্রতি মাসে নতুন Excel দেবেন। রিপোর্ট নিজে থেকেই আপডেট হবে কীভাবে?

### ধাপ ১: ফাইলটা ক্লাউডে রাখো

Desktop-এ ডেটা আসছে `sales_data.xlsx` থেকে। ফাইলটা যদি শুধু করিম ভাইয়ের ল্যাপটপে থাকে, Power BI Service সেটা পড়তে পারে না — তখন **gateway** নামাতে হয়। সহজ পথ:

`sales_data.xlsx` ফাইলটা **OneDrive বা SharePoint**-এ রাখো, Desktop-এ সেখান থেকেই Get Data করো। তাহলে Service সরাসরি ফাইলটা পড়তে পারবে, gateway লাগবে না।

### ধাপ ২: রিফ্রেশ চালু করা

1. Workspace-এ `rupashi_dashboard` ডেটাসেটের পাশে **...** → **Settings**
2. **Data source credentials** → **Edit credentials** → Microsoft অ্যাকাউন্ট দিয়ে সাইন-ইন
3. **Scheduled refresh** সেকশনে:
   - **Keep your data up to date:** On
   - **Frequency:** Daily
   - **Time zone:** (Bangladesh UTC+6) — সময়গুলো নিজের টাইমজোনে সেট করো
   - রিফ্রেশের সময় বেছে নাও
4. **Send refresh failure notification to me:** ✔ (ফেল করলে ইমেইল পাবে)
5. **Apply**

এখন থেকে ফাইল আপডেট হলেই নির্ধারিত সময়ে ডেটাসেট নিজে রিফ্রেশ হবে — হাতে "Refresh" চাপতে হবে না।

### ধাপ ৩: নিজে একবার টেস্ট

Settings → **Refresh now** → **Refresh history** দেখো। **Completed** লেখা মানেই সব ঠিক।

## বাস্তবে কী ঘটে

- Desktop-এ রিপোর্ট বদলে আবার **Publish** করলে Service-এর পুরোনো রিপোর্ট **ওভাররাইট** হয় — নতুন রিপোর্ট আলাদা করে তৈরি হয় না
- Service-এ সরাসরি ভিজ্যুয়াল এডিট করা যায়, কিন্তু মূল উৎস `.pbix` ফাইল — Desktop-এ বদলে পাবলিশ করাই নিরাপদ
- Scheduled Refresh শুধু **ডেটা** আনে; মেজার/ভিজ্যুয়ালের পরিবর্তন আসে নতুন Publish-এ
- রিফ্রেশ ফেল করলে পুরোনো ডেটাই থেকে যায় — রিপোর্ট ফাঁকা হয় না
- ফ্রি অ্যাকাউন্টে Scheduled Refresh পাওয়া যায় না; Pro/PPU দরকার

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| Publish বাটন ধূসর | সাইন-ইন করা নেই, বা ফাইল সেভ করা হয়নি |
| শেয়ার লিংক খুলছে না | প্রাপকের Pro লাইসেন্স আছে কিনা, বা Organization-only লিংক কিনা দেখো |
| Refresh fail: credentials | Settings → Data source credentials → Edit credentials |
| Refresh fail: gateway | ফাইল OneDrive/SharePoint-এ সরাও, অথবা Personal Gateway ইনস্টল করো |
| Desktop-এর পরিবর্তন দেখা যাচ্ছে না | আবার Publish করো, তারপর ব্রাউজার রিফ্রেশ |
| নতুন সারি আসছে না | Excel ফাইলটা ঠিক জায়গায় আপডেট হয়েছে কিনা, Refresh history-তে সময় দেখো |

পরের ধাপে [Row-Level Security](/power-bi/row-level-security) — কে কী দেখবে তা নিয়ন্ত্রণ।
