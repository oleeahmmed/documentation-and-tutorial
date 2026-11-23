---
title: পর্ব ২ — React ড্যাশবোর্ড (Shadcn UI)
description: React + Vite + Tailwind + Shadcn UI দিয়ে তানভীরের Fraud Shield ড্যাশবোর্ড — Django API থেকে লাইভ অর্ডার।
icon: LayoutDashboard
---

> **পরিকল্পনা:** পর্ব ১-এ WordPress থেকে অর্ডার এসে Django-তে সেভ হচ্ছিল। কিন্তু তানভীর তো JSON দেখে ব্যবসা চালাতে পারবেন না। আজ আমরা একটা পরিষ্কার ড্যাশবোর্ড বানাব — যেখানে অর্ডার, ঝুঁকির স্ট্যাটাস আর সামারি এক নজরে দেখা যাবে। পরের পর্বে (৩) এই ড্যাশবোর্ডের পাশে CrewAI এজেন্ট যোগ হবে।

## এই পর্বে যা বানাবো

| ধাপ | কাজ |
| --- | --- |
| ১ | `frontend` ফোল্ডারে React + Vite + Tailwind + Shadcn UI সেটআপ |
| ২ | Django API থেকে অর্ডার এনে টেবিলে দেখানো |
| ৩ | Summary কার্ড (মোট, Pending, High Risk) আর স্ট্যাটাস ব্যাজ |
| ৪ | দুই সার্ভার একসাথে চালিয়ে লাইভ টেস্ট |

শুরু করার আগে নিশ্চিত হও — পর্ব ১-এর Django সার্ভার চালু আছে, আর `http://127.0.0.1:8000/api/orders/list/` খুললে অর্ডারের JSON দেখাচ্ছে।

## ধাপ ১: React + Vite সেটআপ

মূল প্রজেক্ট ফোল্ডার (`fraud_shield_pro`)-এর ভেতরে `frontend` ফোল্ডারে ঢুকে:

```bash
cd fraud_shield_pro/frontend
npm create vite@latest . -- --template react
npm install
```

এবার Tailwind (v4) আর Vite প্লাগইন ইনস্টল করো:

```bash
npm install tailwindcss @tailwindcss/vite
npm install lucide-react axios
```

> **Tailwind v4 নোট:** পুরোনো গাইডে `npx tailwindcss init -p` আর `tailwind.config.js` থাকে — Tailwind v4-তে ওই কমান্ড আর নেই। তাই এখানে `@tailwindcss/vite` প্লাগইন ব্যবহার করা হচ্ছে।

### `vite.config.js`

`@/` অ্যালায়াস আর Tailwind প্লাগইন দুটোই দরকার — Shadcn UI-এর কম্পোনেন্ট `@/components/...` পাথে ইমপোর্ট হয়:

```js
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### `jsconfig.json` (প্রজেক্ট রুটে নতুন ফাইল)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### `src/index.css`

ফাইলের সব পুরোনো CSS মুছে শুধু এটা রাখো:

```css
@import "tailwindcss";
```

## Shadcn UI ইনিশিয়ালাইজ

```bash
npx shadcn@latest init
```

প্রশ্ন এলে **Slate** বেস কালার সিলেক্ট করো (CSS variables-এর জন্য Yes)। তারপর দরকারি কম্পোনেন্টগুলো যোগ করো:

```bash
npx shadcn@latest add table badge card button
```

এতে `src/components/ui/`-তে `table`, `badge`, `card`, `button` ফাইলগুলো তৈরি হবে — এগুলো আমরা সরাসরি ব্যবহার করব, নিজে ডিজাইন লিখতে হবে না।

## ধাপ ২: `src/App.jsx`

ডিফল্ট App কোডটা মুছে নিচেরটা বসাও। এটা `http://127.0.0.1:8000/api/orders/list/` থেকে অর্ডার এনে টেবিলে দেখায়:

```jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = "http://127.0.0.1:8000/api/orders/list/";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderStatusBadge = (status) => {
    if (status === "SAFE") {
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-700 gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Safe Order
        </Badge>
      );
    }
    if (status === "HIGH_RISK") {
      return (
        <Badge variant="destructive" className="gap-1">
          <ShieldAlert className="w-3.5 h-3.5" /> High Risk
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="w-3.5 h-3.5" /> Pending AI Check
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              FraudShield Pro — Tanvir Clothing
            </h1>
            <p className="text-sm text-slate-500">
              WooCommerce লাইভ অর্ডার মনিটরিং ড্যাশবোর্ড
            </p>
          </div>
          <Button onClick={fetchOrders} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Orders
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                মোট অর্ডার
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Pending AI Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {orders.filter((o) => o.risk_status === "PENDING").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                High Risk / Fraud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {orders.filter((o) => o.risk_status === "HIGH_RISK").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>সাম্প্রতিক WooCommerce অর্ডারসমূহ</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>কাস্টমারের নাম</TableHead>
                  <TableHead>ফোন নম্বর</TableHead>
                  <TableHead>ঠিকানা</TableHead>
                  <TableHead>মোট টাকা</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      এখনো কোনো অর্ডার পাওয়া যায়নি। WordPress থেকে একটি অর্ডার
                      প্লেস করে Refresh দিন।
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.wc_order_id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">{order.address}</TableCell>
                      <TableCell>৳ {order.total_amount}</TableCell>
                      <TableCell>{renderStatusBadge(order.risk_status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

`API_URL`-এ খেয়াল করো — পুরো ঠিকানা `http://127.0.0.1:8000/api/orders/list/`। শুধু `127.0.0` লিখলে কোনো ডেটা আসবে না।

## ধাপ ৩: দুই সার্ভার একসাথে চালাও

**টার্মিনাল ১ — Django:**

```bash
cd fraud_shield_pro/backend
source venv/bin/activate   # Windows: venv\Scripts\activate
python manage.py runserver
```

**টার্মিনাল ২ — React:**

```bash
cd fraud_shield_pro/frontend
npm run dev
```

এখন ব্রাউজারে `http://localhost:5173` খোলো। WordPress থেকে নতুন অর্ডার এলে সবুজ **Refresh Orders** বাটনে চাপো — টেবিলে অর্ডারটা **Pending AI Check** ব্যাজসহ দেখা যাবে, আর উপরের কার্ডে মোট অর্ডার বাড়বে।

## বাস্তবে কী ঘটে

- Django-র `order_list` API থেকে সব অর্ডার `created_at` অনুসারে নতুন আগে আসে
- `risk_status` এখন `PENDING`, তাই সব অর্ডার হলুদ ব্যাজে — পর্ব ৩-এ এজেন্ট রিস্ক স্কোর দিলে `SAFE` (সবুজ) বা `HIGH_RISK` (লাল) হয়ে যাবে
- Django-তে CORS আগেই `CORS_ALLOW_ALL_ORIGINS = True` করা আছে (পর্ব ১), তাই `5173 → 8000` কল ব্লক হবে না
- WordPress-এ নতুন অর্ডার দিলে ড্যাশবোর্ড নিজে থেকে রিফ্রেশ হয় না — বাটনে চাপতে হবে (পরে চাইলে `setInterval` দিয়ে অটো-রিফ্রেশ করা যায়)

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| টেবিল খালি, কনসোলে Network Error | Django সার্ভার চালু? `http://127.0.0.1:8000/api/orders/list/` ব্রাউজারে খুলে দেখো |
| CORS error | পর্ব ১-এর `settings.py`-তে `CORS_ALLOW_ALL_ORIGINS = True` আর `CorsMiddleware` আছে কি না দেখো |
| `@/components/ui/...` পাওয়া যাচ্ছে না | `vite.config.js`-এ alias আর `jsconfig.json` ঠিক আছে? সেট করার পর `npm run dev` আবার চালাও |
| Tailwind ক্লাস কাজ করছে না | `src/index.css`-এ `@import "tailwindcss";` আছে, আর `vite.config.js`-এ `tailwindcss()` প্লাগইন আছে? |
| `npx tailwindcss init -p` এরর | Tailwind v4-তে এই কমান্ড নেই — এই পেজের ধাপ ১ অনুসরণ করো |
| Shadcn init-এ আটকে যাচ্ছে | বেস কালার **Slate** সিলেক্ট করো; আগে Tailwind আর alias কনফিগ শেষ করো |
| অর্ডার DB-তে আছে কিন্তু API-তে নেই | `orders/urls.py` আর `core/urls.py`-র include ঠিক আছে? সার্ভার রিস্টার্ট করো |

## পরের পর্ব

ড্যাশবোর্ডে অর্ডার দেখা গেলে পরের ধাপে **CrewAI এজেন্ট** যোগ করব — OpenRouter মডেল দিয়ে কুরিয়ার ফ্রড চেক, রিস্ক স্কোর আর অটো WhatsApp মেসেজ।

➡️ আগের পর্ব: [পর্ব ১ — Django Backend ও Webhook](/docs/project-based/project-1/backend-webhook)
➡️ সিস্টেমের পুরো ছবি: [System Design](/docs/project-based/project-1/solution)
