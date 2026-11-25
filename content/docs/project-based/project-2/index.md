---
title: Project 2 — ShopBondhu AI
description: ১২ ফেজে বাংলাদেশি অনলাইন শপের AI কাস্টমার সাপোর্ট — Django, DRF, CrewAI, PostgreSQL + pgvector, React।
icon: ShoppingBag
---

**গল্প:** ShopBondhu AI একটি AI কাস্টমার সাপোর্ট সিস্টেম। অনলাইন শপের Messenger বা WhatsApp-এ কাস্টমার যা জিজ্ঞেস করে, এজেন্ট তার উত্তর দেয়; দরকার হলে অর্ডার, পেমেন্ট ও কুরিয়ার দেখে; আর যা নিজে ঠিক করতে পারে না, সেটা সাপোর্ট টিকিট করে মানুষের কাছে পাঠায়। শুরু হবে একটি ডেমো শপ দিয়ে, শেষে একই সিস্টেমে একাধিক ব্যবসা চলবে — multi-tenant SaaS।

## টেকনোলজি

| স্তর | টেকনোলজি |
| --- | --- |
| Backend | Python, Django, Django REST Framework |
| AI | CrewAI (Agents, Tasks, Crews, Flows) |
| Database | PostgreSQL + pgvector |
| Frontend | React |

## ১২ ফেজ এক নজরে

| ফেজ | লক্ষ্য | মূল কনসেপ্ট |
| --- | --- | --- |
| [ফেজ ১](/docs/project-based/project-2/phase-1) | Django + PostgreSQL ভিত্তি, মডেল ও ডেমো ডেটা | Business Data ও Database |
| [ফেজ ২](/docs/project-based/project-2/phase-2) | এক এজেন্টে বাংলা/ইংরেজি উত্তর, Intent শনাক্ত | Agents, Tasks, Crews, LLM |
| [ফেজ ৩](/docs/project-based/project-2/phase-3) | FAQ ও নীতি থেকে প্রকৃত উত্তর (RAG) | Knowledge, RAG, Tools |
| [ফেজ ৪](/docs/project-based/project-2/phase-4) | ERP থেকে অর্ডার/পেমেন্ট/কুরিয়ার তথ্য | Tools, Reasoning, Context |
| [ফেজ ৫](/docs/project-based/project-2/phase-5) | পাঁচ এজেন্টের টিম, sequential/hierarchical | Collaboration, Processes, Planning |
| [ফেজ ৬](/docs/project-based/project-2/phase-6) | টিকিট, অনুমোদন, মানুষের হস্তান্তর | Human Input, Guardrails |
| [ফেজ ৭](/docs/project-based/project-2/phase-7) | পুরো প্রক্রিয়া Flow-তে — state, memory, streaming | Flows, State, Memory, Streaming |
| [ফেজ ৮](/docs/project-based/project-2/phase-8) | Messenger চ্যানেল | External Tools, API Integration |
| [ফেজ ৯](/docs/project-based/project-2/phase-9) | WhatsApp চ্যানেল | External Tools, API Integration |
| [ফেজ ১০](/docs/project-based/project-2/phase-10) | React ড্যাশবোর্ড ও human takeover | Agent Monitoring, Human-in-the-loop |
| [ফেজ ১১](/docs/project-based/project-2/phase-11) | টেস্ট, evaluation, গার্ডরেল | Testing, Training, Evaluation |
| [ফেজ ১২](/docs/project-based/project-2/phase-12) | Multi-tenant SaaS ও deployment | Production Architecture |

## এগোনোর নিয়ম

1. প্রতিটি ফেজে ছোট ছোট Step থাকবে।
2. একটি Step শেষ হলে `DONE` বলবে — তখনই পরের Step।
3. ফেজ শেষে চেকলিস্ট মিলিয়ে পরের ফেজে যাবে।

➡️ শুরু: [ফেজ ১ — Project Foundation & Business Setup](/docs/project-based/project-2/phase-1)

আগের প্রজেক্ট দেখতে চাইলে: [Project 1 — Fraud Detection](/docs/project-based/project-1/overview)।
