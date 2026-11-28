---
title: "ধাপ ১৪ — রান করো!"
description: crewai install + crewai run — রিনা, ফাহিম, সুমাইয়া একে একে কাজ করছে, ledger.csv ভরে যাচ্ছে।
icon: Play
---

## লক্ষ্য

পুরো ইনভয়েস টিম একবার চালিয়ে আউটপুট আর `ledger.csv` দেখা।

## কমান্ড

```bash
crewai install
crewai run
```

টার্মিনালে দেখবে:

1. **রিনা** ইনভয়েস টেক্সট থেকে vendor/date/amount/invoice_number বের করছে
2. **ফাহিম** রিনার ডেটা দেখে, চার্ট-অফ-অ্যাকাউন্টস মিলিয়ে ক্যাটাগরি ঠিক করছে
3. **সুমাইয়া** দুজনের কাজ দেখে `save_to_ledger` কল করছে, `ledger.csv`-এ এন্ট্রি যোগ হচ্ছে

রান শেষে ফোল্ডারে `ledger.csv` খুলে দেখলে একটা নতুন সারি পাবে — vendor, date, amount, category সব একসাথে।

```text
recorded_at,vendor_name,invoice_date,total_amount,category,invoice_number
2026-11-28T10:12:34,Amazon Web Services (AWS),2026-11-15,BDT 18,500,Cloud & Hosting,INV-2026-0881
```

## তুমি এখন কী বানালে?

**রিনা, ফাহিম, সুমাইয়া** — ৩ জনের একটা ভার্চুয়াল অ্যাকাউন্টস টিম, যার:

- **পার্মানেন্ট নির্দেশনা** (`agents.yaml`, `tasks.yaml`)
- **নলেজ বেস** (`knowledge/chart_of_accounts.txt`) — কোম্পানির খাতের নিয়ম
- **স্কিল/টুল** (`save_to_ledger`) — CSV লেজারে এন্ট্রি লেখে
- **স্কিল রেজিস্টার** (`skills.md`)
- **মেমোরি** (`memory=True`)

**একটা বাস্তব কথা:** এখানে ইনভয়েসের **টেক্সট** ইনপুট দিয়েছি (সহজে বোঝার জন্য)। আসল PDF অ্যাটাচমেন্ট থেকে টেক্সট বের করতে হলে `crewai-tools`-এর PDF-reading টুল বা `pdfplumber`/`PyMuPDF` লাইব্রেরি দিয়ে PDF-কে টেক্সটে রূপান্তর করে তারপর `{invoice_text}`-এ বসাতে হবে। আর সরাসরি Google Sheets/QuickBooks/Xero-তে সেভ করতে চাইলে `save_to_ledger` টুলের ভেতরে CSV লেখার বদলে তাদের API কল বসালেই হবে (Google Sheets-এর ক্ষেত্রে `gspread` লাইব্রেরি বা Google-এর কানেক্টর ব্যবহার করা যায়)।

একাধিক ইনভয়েসের জন্য চালাতে চাইলে `main.py`-তে একটা লিস্ট থেকে লুপ করে প্রতিটা টেক্সটের জন্য `kickoff()` কল করলেই হবে — `ledger.csv`-এ সারি জমতে থাকবে।

## চালানোর আগে চেক

| জিনিস | ঠিক আছে কিনা |
| --- | --- |
| `agents.yaml` | ৩ Agent |
| `tasks.yaml` | extract → classify → record |
| `knowledge/chart_of_accounts.txt` | খাতের তালিকা + ৫০,০০০ নিয়ম |
| `tools/custom_tool.py` | `SaveToLedgerTool` |
| `crew.py` | ফাহিমের knowledge, সুমাইয়ার tool |
| `main.py` | `invoice_text` input |
| `.env` | `OPENAI_API_KEY` |

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| `uv` নেই | `pip install uv`, তারপর আবার `crewai install` |
| knowledge embedding এরর | OpenAI key দাও; বা `memory=False` করে টেস্ট |
| `ledger.csv` তৈরি হয়নি | সুমাইয়ার টুল কল হয়নি — `record_task`-এর description আরও স্পষ্ট করো |
| ক্যাটাগরি সব `UNCATEGORIZED` | ধাপ ৮-এ ইনভয়েসের ভেন্ডর/বিবরণের সাথে মিলে এমন খাত যোগ করো |
| একই এন্ট্রি বারবার | `ledger.csv` নিজে append করে — ডুপ্লিকেট আসলে ফাইল পরিষ্কার করে আবার চালাও |

## চেকলিস্ট

- [ ] `crewai install` সফল
- [ ] `crewai run` শেষে এক্সট্রাকশন + ক্যাটাগরি কনফার্মেশন
- [ ] `ledger.csv`-এ নতুন সারি
- [ ] `skills.md` হালনাগাদ

⬅️ আগের ধাপ: [ধাপ ১৩ — API key](/docs/project-based/project-5/step-13)

➡️ প্রজেক্ট ওভারভিউ: [Blastify Invoice Crew — ১৪ ধাপ](/docs/project-based/project-5)
