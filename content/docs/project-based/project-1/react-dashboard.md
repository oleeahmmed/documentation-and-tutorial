---
title: পর্ব ২ — React ড্যাশবোর্ড (Shadcn UI)
description: React + Vite + Tailwind + Shadcn UI দিয়ে মাল্টি-স্টোর Fraud Shield — লগইন, ওয়েবসাইট যোগ, webhook URL কপি আর স্টোরভিত্তিক অর্ডার।
icon: LayoutDashboard
---

> **পরিকল্পনা:** পর্ব ১-এ WordPress থেকে অর্ডার এসে Django-তে সেভ হচ্ছিল। কিন্তু এখন একাধিক ব্যবসায়ী একই সিস্টেম ব্যবহার করবে — প্রত্যেকে লগইন করবে, নিজের একাধিক স্টোর জুড়বে, আর শুধু নিজের অর্ডার দেখবে। আজ আমরা সেই পুরো ড্যাশবোর্ড বানাব: লগইন পেজ, ওয়েবসাইট যোগ করার পেজ, webhook URL কপি আর স্টোরভিত্তিক অর্ডার টেবিল। পরের পর্বে (৩) এই ড্যাশবোর্ডের স্ট্যাটাসগুলো সত্যিকারের `SAFE` / `HIGH_RISK` হয়ে যাবে — CrewAI এজেন্ট যোগ হবে।

## এই পর্বে যা বানাবো

| ধাপ | কাজ |
| --- | --- |
| ১ | `frontend` ফোল্ডারে React + Vite + Tailwind + Shadcn UI সেটআপ |
| ২ | `src/lib/api.js` — এক জায়গার axios instance, token হেডার আর session |
| ৩ | লগইন পেজ — Django token নিয়ে localStorage-এ রাখা |
| ৪ | `App.jsx` — session, view আর সিলেক্টেড স্টোরের হিসাব |
| ৫ | সাইডবার + ইউজার মেনু — স্টোরভিত্তিক লিংক |
| ৬ | টপ হেডার — স্টোর dropdown, breadcrumb, theme |
| ৭ | `dashboard.jsx` — summary কার্ড, সার্চ, পেজিনেশন, স্ট্যাটাস ব্যাজ |
| ৮ | `websites-page.jsx` — নতুন স্টোর যোগ, webhook URL কপি, ডিলিট |
| ৯ | দুই সার্ভার একসাথে চালিয়ে দুই ইউজার দিয়ে টেস্ট |

শুরু করার আগে নিশ্চিত হও — পর্ব ১-এর Django সার্ভার চালু আছে, আর `http://127.0.0.1:8000/api/orders/list/` খুললে (token ছাড়া) `401` আসছে। `401` মানেই auth ঠিক আছে।

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

`src/main.jsx`-এ `import "./index.css";` আছে কি না দেখে নাও।

## Shadcn UI ইনিশিয়ালাইজ

```bash
npx shadcn@latest init
```

প্রশ্ন এলে **Slate** বেস কালার সিলেক্ট করো (CSS variables-এর জন্য Yes)। তারপর এই সিরিজে ব্যবহৃত সব কম্পোনেন্ট একসাথে যোগ করো:

```bash
npx shadcn@latest add button card input label badge table dropdown-menu sidebar tooltip breadcrumb avatar
```

`sidebar` কম্পোনেন্ট নিজে দরকারি কয়েকটা (sheet, skeleton, separator, input, button) নিয়ে আসে। এগুলো `src/components/ui/`-তে তৈরি হবে — আমরা সরাসরি ব্যবহার করব, নিজে ডিজাইন লিখতে হবে না।

## ধাপ ২: `src/lib/api.js`

প্রতিটা পেজে `axios` আলাদা করে বানালে token হেডার বারবার লিখতে হবে, ভুল হওয়ার ভয়ও থাকে। তাই এক জায়গায় instance, তারপর localStorage-এ session:

```js
import axios from "axios";

export const API_BASE = "http://127.0.0.1:8000";

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fs_token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export function loadSession() {
  const token = localStorage.getItem("fs_token");
  const user = localStorage.getItem("fs_user");
  if (!token || !user) return null;
  try {
    return { token, user: JSON.parse(user) };
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem("fs_token", session.token);
  localStorage.setItem("fs_user", JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem("fs_token");
  localStorage.removeItem("fs_user");
}
```

তিনটা জিনিস খেয়াল করো:

| লাইন | কেন |
| --- | --- |
| `API_BASE` | webhook URL দেখানোর সময়ও এটা দরকার — তাই আলাদা export |
| `interceptor` | প্রতিটা request-এ `Authorization: Token ...` নিজে বসিয়ে দেয় |
| `loadSession()` | ব্রাউজার রিফ্রেশ করলেও লগইন থাকে — token localStorage-এ |

> token-এর আগে শব্দটা `Token`, `Bearer` নয়। Django-র `TokenAuthentication` ঠিক এই ফরম্যাট চায়।

## ধাপ ৩: লগইন পেজ

`src/components/login-page.jsx` (নতুন ফাইল)। সফল হলে `onLogin`-এ Django-র রেসপন্স (token + user) পাঠায়:

```jsx
import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/login/", { username, password });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "সার্ভারের সাথে যোগাযোগ করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="size-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">FraudShield Pro</h1>
          <p className="text-sm text-muted-foreground">
            একাধিক WooCommerce স্টোর — এক ড্যাশবোর্ডে
          </p>
        </div>

        <Card>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="username">ইউজারনেম</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="tanvir"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "লগইন হচ্ছে…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          শুধুমাত্র অনুমোদিত ব্যবহারকারীর জন্য
        </p>
      </div>
    </div>
  );
}
```

> এখানে `api`-তেই base URL আছে, তাই শুধু `/api/auth/login/` লিখলেই হয়।

## ধাপ ৪: `src/App.jsx`

পুরো অ্যাপের হিসাব এই এক ফাইলে — session, কোন পেজ (`dashboard` বা `websites`), ইউজারের সাইটের লিস্ট আর সিলেক্টেড স্টোর:

```jsx
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Dashboard } from "@/components/dashboard";
import { LoginPage } from "@/components/login-page";
import { SiteHeader } from "@/components/site-header";
import { WebsitesPage } from "@/components/websites-page";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api, clearSession, loadSession, saveSession } from "@/lib/api";

export default function App() {
  const [session, setSession] = useState(loadSession);
  const [view, setView] = useState("dashboard");
  const [websites, setWebsites] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const handleLogin = (data) => {
    saveSession(data);
    setSession(data);
    setView("dashboard");
    setSelectedId("");
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout/");
    } catch {
      // token আগেই invalid থাকতে পারে — নিচের local cleanup-ই আসল
    }
    clearSession();
    setSession(null);
    setWebsites([]);
    setSelectedId("");
  };

  const loadWebsites = async () => {
    try {
      const res = await api.get("/api/websites/");
      setWebsites(res.data);
      return res.data;
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        console.error("Failed to fetch websites:", error);
      }
      return [];
    }
  };

  useEffect(() => {
    if (session) {
      loadWebsites();
    }
  }, [session]);

  if (!session) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const activeWebsite =
    websites.find((website) => String(website.id) === String(selectedId)) || null;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar
        user={session.user}
        onLogout={handleLogout}
        view={view}
        onViewChange={setView}
        store={activeWebsite}
      />
      <SidebarInset className="min-w-0">
        <SiteHeader
          user={session.user}
          onLogout={handleLogout}
          view={view}
          store={activeWebsite}
        />
        {view === "websites" ? (
          <WebsitesPage
            websites={websites}
            onChanged={loadWebsites}
            onCreated={(website) => {
              setSelectedId(String(website.id));
              setView("dashboard");
            }}
          />
        ) : (
          <Dashboard
            websites={websites}
            selectedId={selectedId}
            onSelect={setSelectedId}
            store={activeWebsite}
            onLogout={handleLogout}
            onGoWebsites={() => setView("websites")}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
```

এখানে লগইন না থাকলে শুধু লগইন পেজ, আর লগইন থাকলে সাইডবার + হেডার + পেজ। নতুন স্টোর যোগ করলে `onCreated` সেই স্টোরটাই সিলেক্ট করে ড্যাশবোর্ডে ফেরত পাঠায়।

## ধাপ ৫: সাইডবার আর ইউজার মেনু

### `src/components/app-sidebar.jsx`

```jsx
import {
  ExternalLink,
  Globe,
  LayoutDashboard,
  Settings2,
  Shield,
  ShoppingBag,
  Store,
} from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ user, onLogout, view, onViewChange, store, ...props }) {
  const wpBase = store?.url || "http://localhost/wordpress";
  const openDashboard = () => onViewChange("dashboard");

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#overview" onClick={openDashboard}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">FraudShield Pro</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {store?.name || "Merchant console"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "dashboard"}
                  tooltip="Overview"
                >
                  <a href="#overview" onClick={openDashboard}>
                    <LayoutDashboard />
                    <span>Overview</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Orders">
                  <a href="#orders" onClick={openDashboard}>
                    <ShoppingBag />
                    <span>Orders</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Stores</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={view === "websites"}
                  tooltip="Websites"
                  onClick={() => onViewChange("websites")}
                >
                  <Globe />
                  <span>Websites</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Storefront">
                  <a href={wpBase} target="_blank" rel="noreferrer">
                    <Store />
                    <span>Storefront</span>
                    <ExternalLink className="ml-auto size-3.5 group-data-[collapsible=icon]:hidden" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Admin panel">
                  <a
                    href={`${wpBase}/wp-admin/edit.php?post_type=shop_order`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Settings2 />
                    <span>Admin panel</span>
                    <ExternalLink className="ml-auto size-3.5 group-data-[collapsible=icon]:hidden" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} onLogout={onLogout} store={store} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
```

`store` না থাকলে `http://localhost/wordpress` ধরে নেয় — অর্থাৎ ডেমো WordPress। সিলেক্টেড স্টোরের `url` থাকলে Storefront আর Admin panel সেই স্টোরেই যায়।

### `src/components/user-menu.jsx`

`initialsOf` এখানে ছোট একটা helper — নাম থেকে `TC`-এর মতো avatar-অক্ষর বানায়। `nav-user.jsx`-ও এটা ব্যবহার করে:

```jsx
import { ExternalLink, LogOut, Settings2, Store, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const wpBase = "http://localhost/wordpress";

export function initialsOf(name) {
  return (name || "Tanvir Clothing")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({ user, onLogout }) {
  const name = user?.name || "Tanvir Clothing";
  const email = user?.email || "admin@fraudshield.test";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-8">
            <AvatarFallback>{initialsOf(name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">{initialsOf(name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a href={`${wpBase}/wp-admin/profile.php`} target="_blank" rel="noreferrer">
              <UserRound />
              Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={wpBase} target="_blank" rel="noreferrer">
              <Store />
              Storefront
              <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`${wpBase}/wp-admin/edit.php?post_type=shop_order`} target="_blank" rel="noreferrer">
              <Settings2 />
              WooCommerce Admin
              <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### `src/components/nav-user.jsx`

সাইডবারের নিচের অংশ — নাম, email আর লগআউট:

```jsx
import { ChevronsUpDown, ExternalLink, FlaskConical, LogOut, Settings2, Store, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { initialsOf } from "@/components/user-menu";

export function NavUser({ user, onLogout, store }) {
  const wpBase = store?.url || "http://localhost/wordpress";
  const name = user?.name || "Merchant";
  const email = user?.email || "—";
  const initials = initialsOf(name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs text-muted-foreground">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href={`${wpBase}/wp-admin/profile.php`} target="_blank" rel="noreferrer">
                  <UserRound />
                  Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={wpBase} target="_blank" rel="noreferrer">
                  <Store />
                  Storefront
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`${wpBase}/wp-admin/edit.php?post_type=shop_order`} target="_blank" rel="noreferrer">
                  <Settings2 />
                  WooCommerce Admin
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href={`${wpBase}/?add-to-cart=11`} target="_blank" rel="noreferrer">
                  <FlaskConical />
                  Place a test order
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={onLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
```

## ধাপ ৬: টপ হেডার

`src/components/site-header.jsx` — স্টোর dropdown, breadcrumb, notification, theme আর ইউজার মেনু:

```jsx
import { useEffect, useState } from "react";
import { Bell, ChevronsUpDown, ExternalLink, Moon, Settings2, Store, Sun } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";

export function SiteHeader({ user, onLogout, view = "dashboard", store }) {
  const [dark, setDark] = useState(() => localStorage.getItem("fs_theme") === "dark");
  const wpBase = store?.url || "http://localhost/wordpress";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("fs_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2 font-semibold">
            <span className="size-2.5 rounded-full bg-orange-500" />
            <span className="hidden sm:inline">{store?.name || "সব স্টোর"}</span>
            <ChevronsUpDown className="size-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>WooCommerce স্টোর</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href={wpBase} target="_blank" rel="noreferrer">
              <Store />
              Storefront
              <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`${wpBase}/wp-admin/edit.php?post_type=shop_order`} target="_blank" rel="noreferrer">
              <Settings2 />
              WooCommerce Admin
              <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Breadcrumb className="hidden lg:block">
        <BreadcrumbList>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#overview">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{view === "websites" ? "Websites" : "Overview"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setDark((value) => !value)}
        >
          {dark ? <Sun /> : <Moon />}
        </Button>
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}
```

## ধাপ ৭: ড্যাশবোর্ড

`src/components/dashboard.jsx` (নতুন ফাইল) — summary কার্ড, সার্চ, পেজিনেশন, স্ট্যাটাস ব্যাজ আর অ্যাকশন মেনু:

```jsx
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  MoreHorizontal,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/api";

const PAGE_SIZE = 8;
const today = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function StatusBadge({ status }) {
  if (status === "SAFE") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-emerald-600/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
      >
        Safe
      </Badge>
    );
  }
  if (status === "HIGH_RISK") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-red-600/30 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
      >
        High Risk
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="rounded-full border-amber-600/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
    >
      Pending AI Check
    </Badge>
  );
}

export function Dashboard({ websites, selectedId, onSelect, store, onLogout, onGoWebsites }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/orders/list/", {
        params: selectedId ? { website: selectedId } : {},
      });
      setOrders(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        onLogout();
        return;
      }
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedId]);

  const rerunAgent = async (id) => {
    await api.post(`/api/orders/${id}/analyze/`);
    setTimeout(fetchOrders, 5000);
  };

  const pendingCount = orders.filter((o) => o.risk_status === "PENDING").length;
  const highRiskCount = orders.filter((o) => o.risk_status === "HIGH_RISK").length;
  const scopeHint = store ? store.name : "সব স্টোর";

  const stats = [
    {
      label: "মোট অর্ডার",
      value: orders.length,
      hint: `${scopeHint}-এর WooCommerce অর্ডার`,
      tooltip: "নির্বাচিত স্টোরের সব অর্ডার একসাথে গণনা করা হয়েছে।",
      valueClass: "text-foreground",
    },
    {
      label: "Pending AI Check",
      value: pendingCount,
      hint: "এজেন্ট চেকের অপেক্ষায়",
      tooltip: "এখনো CrewAI এজেন্টের রিস্ক স্কোর হয়নি।",
      valueClass: "text-amber-600",
    },
    {
      label: "High Risk / Fraud",
      value: highRiskCount,
      hint: "ঝুঁকি হিসেবে ফ্ল্যাগ করা",
      tooltip: "এজেন্ট HIGH_RISK বললে অর্ডার এখানে যোগ হবে।",
      valueClass: "text-red-600",
    },
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? orders.filter((order) =>
        [order.wc_order_id, order.customer_name, order.phone, order.address, order.website_name].some(
          (value) => String(value ?? "").toLowerCase().includes(q),
        ),
      )
    : orders;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedOrders = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-6 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            {store ? store.name : "Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground">
            WooCommerce অর্ডার ও কুরিয়ার ফ্রড মনিটরিং
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedId}
            onChange={(event) => {
              onSelect(event.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border bg-background px-3 text-sm"
            aria-label="স্টোর বাছাই"
          >
            <option value="">সব স্টোর</option>
            {websites.map((website) => (
              <option key={website.id} value={website.id}>
                {website.name}
              </option>
            ))}
          </select>
          <Button variant="outline" className="gap-2 rounded-full">
            <CalendarDays className="size-4" />
            {today}
          </Button>
          <Button onClick={fetchOrders} disabled={loading} className="gap-2">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {websites.length === 0 && (
        <Card className="border-dashed">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-base">এখনো কোনো ওয়েবসাইট যোগ করা হয়নি</CardTitle>
              <CardDescription>
                Django-তে আপনার WooCommerce স্টোরের webhook token যোগ করলেই অর্ডার এখানে আসতে শুরু করবে।
              </CardDescription>
            </div>
            <Button onClick={onGoWebsites} className="gap-2">
              ওয়েবসাইট যোগ করো
            </Button>
          </CardHeader>
        </Card>
      )}

      <div id="overview" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {stats.map(({ label, value, hint, tooltip, valueClass }) => (
          <Card key={label} className="gap-2 py-5">
            <CardHeader className="gap-1">
              <CardTitle className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                {label}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              </CardTitle>
              <div className={`text-3xl font-semibold tracking-tight ${valueClass}`}>
                {value}
              </div>
              <CardDescription className="text-xs">{hint}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card id="orders" className="gap-0 overflow-hidden py-0">
        <CardHeader className="gap-1 px-6 py-5">
          <CardTitle>সাম্প্রতিক WooCommerce অর্ডারসমূহ</CardTitle>
          <CardDescription>
            {store ? `${store.name}-এর নতুন অর্ডার সবার আগে` : "সব স্টোরের নতুন অর্ডার সবার আগে"}
          </CardDescription>
        </CardHeader>

        <div className="flex flex-wrap items-center justify-between gap-2 px-6 pb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="অর্ডার ফিল্টার করুন…"
              className="pl-8"
            />
          </div>
          <Badge variant="outline">{filtered.length} অর্ডার</Badge>
        </div>

        <div className="border-t">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">Order ID</TableHead>
                <TableHead className="px-6">স্টোর</TableHead>
                <TableHead className="px-6">কাস্টমারের নাম</TableHead>
                <TableHead className="hidden px-6 lg:table-cell">ফোন নম্বর</TableHead>
                <TableHead className="hidden px-6 xl:table-cell">ঠিকানা</TableHead>
                <TableHead className="px-6 text-right">মোট টাকা</TableHead>
                <TableHead className="px-6">স্ট্যাটাস</TableHead>
                <TableHead className="px-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                      <Search className="size-8" />
                      <p className="text-sm">
                        {q ? "এই ফিল্টারে কোনো অর্ডার মেলেনি।" : "এখনো কোনো অর্ডার পাওয়া যায়নি।"}
                      </p>
                      <p className="text-xs">
                        {q
                          ? "অন্য নাম, ফোন বা Order ID দিয়ে খুঁজে দেখো।"
                          : "WordPress থেকে একটি অর্ডার প্লেস করে Refresh দিন।"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pagedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-6 py-3.5 font-medium">
                      #{order.wc_order_id}
                    </TableCell>
                    <TableCell className="px-6 py-3.5">{order.website_name}</TableCell>
                    <TableCell className="px-6 py-3.5">{order.customer_name}</TableCell>
                    <TableCell className="hidden px-6 py-3.5 lg:table-cell">
                      {order.phone}
                    </TableCell>
                    <TableCell className="hidden max-w-[240px] truncate px-6 py-3.5 xl:table-cell">
                      {order.address}
                    </TableCell>
                    <TableCell className="px-6 py-3.5 text-right tabular-nums">
                      ৳ {order.total_amount}
                    </TableCell>
                    <TableCell className="px-6 py-3.5">
                      <StatusBadge status={order.risk_status} />
                    </TableCell>
                    <TableCell className="px-6 py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {order.risk_status === "PENDING" && (
                            <DropdownMenuItem onClick={() => rerunAgent(order.id)}>
                              <Sparkles />
                              AI চেক চালাও
                            </DropdownMenuItem>
                          )}
                          {store?.url && (
                            <DropdownMenuItem asChild>
                              <a
                                href={`${store.url}/wp-admin/post.php?post=${order.wc_order_id}&action=edit`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink />
                                WooCommerce-এ দেখুন
                              </a>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t px-6 py-3">
          <p className="text-xs text-muted-foreground">
            {rangeStart} - {rangeEnd} of {filtered.length} orders
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

> `AI চেক চালাও` বাটনটা `/api/orders/<id>/analyze/` ডাকে — এই endpoint পর্ব ৩-এ যোগ হবে। তার আগে বাটনে চাপলে 404 আসবে, সেটাই স্বাভাবিক।

## ধাপ ৮: ওয়েবসাইট পেজ

`src/components/websites-page.jsx` (নতুন ফাইল) — এখানেই ইউজার নতুন স্টোর যোগ করে, webhook URL কপি করে WordPress-এ বসায়:

```jsx
import { useState } from "react";
import { Check, Copy, Globe, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, API_BASE } from "@/lib/api";

export function WebsitesPage({ websites, onChanged, onCreated }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleAdd = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await api.post("/api/websites/", { name, url });
      setName("");
      setUrl("");
      await onChanged();
      onCreated?.(res.data);
    } catch (err) {
      setError(err.response?.data?.name?.[0] || "ওয়েবসাইট যোগ করা যায়নি।");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (website) => {
    if (!window.confirm(`"${website.name}" এবং এর সব অর্ডার মুছে যাবে। নিশ্চিত?`)) return;
    await api.delete(`/api/websites/${website.id}/`);
    await onChanged();
  };

  const handleCopy = async (website) => {
    await navigator.clipboard.writeText(`${API_BASE}${website.webhook_path}`);
    setCopiedId(website.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-6 md:p-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">ওয়েবসাইটসমূহ</h1>
        <p className="text-sm text-muted-foreground">
          প্রতিটি WooCommerce স্টোরের আলাদা webhook — অর্ডার নিজের ইউজারের কাছে যাবে।
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>নতুন ওয়েবসাইট যোগ করো</CardTitle>
            <CardDescription>
              নাম আর স্টোরের ঠিকানা দিলেই একটা আলাদা webhook URL তৈরি হবে।
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={handleAdd}>
              <div className="grid gap-1.5">
                <Label htmlFor="site-name">ওয়েবসাইটের নাম</Label>
                <Input
                  id="site-name"
                  placeholder="Tanvir Clothing"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="site-url">স্টোরের ঠিকানা (ঐচ্ছিক)</Label>
                <Input
                  id="site-url"
                  type="url"
                  placeholder="https://tanvirclothing.com"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-fit gap-2" disabled={saving}>
                <Plus />
                {saving ? "যোগ হচ্ছে…" : "ওয়েবসাইট যোগ করো"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WooCommerce-এ যেভাবে বসাবে</CardTitle>
            <CardDescription>প্রতিটা স্টোরে আলাদা webhook — একবারই সেট করতে হবে।</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>WooCommerce → Settings → Advanced → Webhooks</li>
              <li>Add webhook → Topic: Order created</li>
              <li>ডান পাশের Copy চেপে URL টা Delivery URL-এ বসাও</li>
              <li>Save — এরপর থেকে ওই স্টোরের অর্ডার এখানে আসবে</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {websites.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
              <Globe className="size-8" />
              <p className="text-sm">এখনো কোনো ওয়েবসাইট নেই। উপরের ফর্ম থেকে প্রথমটা যোগ করো।</p>
            </CardContent>
          </Card>
        ) : (
          websites.map((website) => {
            const webhookUrl = `${API_BASE}${website.webhook_path}`;
            return (
              <Card key={website.id}>
                <CardHeader className="flex-row flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Globe className="size-4 text-muted-foreground" />
                      {website.name}
                    </CardTitle>
                    <CardDescription>
                      {website.url || "স্টোরের ঠিকানা দেওয়া নেই"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive"
                    onClick={() => handleDelete(website)}
                    aria-label="Delete website"
                  >
                    <Trash2 />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label>Webhook URL</Label>
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-3 py-2 text-xs">
                      {webhookUrl}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleCopy(website)}
                    >
                      {copiedId === website.id ? <Check /> : <Copy />}
                      {copiedId === website.id ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    লোকাল Django-তে WordPress পৌঁছাতে না পারলে ngrok দিয়ে এই URL-কে পাবলিক করো।
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
```

`webhook_path` Django থেকেই আসে — তাই ফ্রন্টএন্ডে token জোড়া লাগানোর হিসাব করতে হয় না। `API_BASE` শুধু `http://127.0.0.1:8000` জুড়ে দেয়।

## ধাপ ৯: দুই সার্ভার একসাথে চালাও

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

এখন `http://localhost:5173` খুললে লগইন পেজ আসবে। পর্ব ১-এ বানানো ইউজার দিয়ে লগইন করো।

### যা যা টেস্ট করবে

| টেস্ট | কী দেখবে |
| --- | --- |
| লগইন | ড্যাশবোর্ডে তানভীরের অর্ডার — শুধু তার |
| Websites পেজে নতুন স্টোর যোগ | কার্ডে নতুন webhook URL, ড্যাশবোর্ডে সেই স্টোর সিলেক্ট |
| Copy বাটন | `http://127.0.0.1:8000/api/orders/webhook/woocommerce/<token>/` কপি |
| স্টোর dropdown | "সব স্টোর" বা একটা নির্দিষ্ট স্টোরের অর্ডার |
| second user (`rahim`) লগইন | তানভীরের কোনো অর্ডার নেই — শুধু নিজের সাইট আর অর্ডার |
| Refresh | নতুন WooCommerce অর্ডার লিস্টে যুক্ত |
| স্ট্যাটাস | এখন সব `Pending AI Check` — পর্ব ৩-এ `SAFE` / `High Risk` হবে |

## বাস্তবে কী ঘটে

- `api.js`-এর interceptor প্রতিটা request-এ token বসায়, তাই কোনো পেজে হাতে হেডার লিখতে হয় না
- `App.jsx` একবার `/api/websites/` আনে, সেই লিস্ট দিয়েই স্টোর dropdown তৈরি হয়
- `order_list` API নিজেই `website__owner=request.user` দিয়ে ফিল্টার করে — ফ্রন্টএন্ডে ফিল্টার শুধু সুবিধার জন্য, নিরাপত্তা backend-এ
- স্টোর বাছাই করলে `?website=<id>` যায়; "সব স্টোর" হলে কোনো param যায় না
- `websites-page`-এ ডিলিট করলে সেই সাইটের সব অর্ডারও মুছে যায় (`on_delete=CASCADE`)
- `AI চেক চালাও` বাটন পর্ব ৩-এর `analyze` endpoint-এর জন্য আগেই বসানো

## সমস্যা হলে

| সমস্যা | সমাধান |
| --- | --- |
| লগইনে "সার্ভারের সাথে যোগাযোগ করা যায়নি" | Django চালু? `http://127.0.0.1:8000/api/websites/` খুলে `401` আসছে কি না দেখো |
| `401` লগইনের পরে বারবার | token localStorage-এ আছে? `Token` শব্দটা হেডারে আছে কি না দেখো |
| CORS error | পর্ব ১-এর `settings.py`-তে `CORS_ALLOW_ALL_ORIGINS = True` আর `CorsMiddleware` |
| `@/components/ui/...` পাওয়া যাচ্ছে না | `vite.config.js`-এ alias আর `jsconfig.json` ঠিক আছে? |
| Tailwind ক্লাস কাজ করছে না | `src/index.css`-এ `@import "tailwindcss";` আর `vite.config.js`-এ `tailwindcss()` |
| `npx tailwindcss init -p` এরর | Tailwind v4-তে এই কমান্ড নেই — এই পেজের ধাপ ১ দেখো |
| Shadcn init-এ আটকে যাচ্ছে | বেস কালার **Slate** সিলেক্ট করো; আগে Tailwind আর alias কনফিগ শেষ করো |
| স্টোর dropdown খালি | Websites পেজে স্টোর যোগ করেছ? `GET /api/websites/` রেসপন্স দেখো |
| webhook URL কপি হচ্ছে না | ব্রাউজার clipboard permission; HTTPS বা localhost-এ ঠিকঠাক কাজ করে |
| অর্ডার DB-তে আছে কিন্তু UI-তে নেই | ওই অর্ডারের `website` আছে? পুরোনো অর্ডার কোনো সাইটের নয় — নতুন করে পাঠাও |

## পরের পর্ব

ড্যাশবোর্ড চললে পরের ধাপে **CrewAI এজেন্ট** যোগ করব — `ai_agents/` ফোল্ডারে দুই এজেন্ট, কুরিয়ার টুল, WhatsApp টুল, আর Django-র সাথে সেতু। তখন `Pending AI Check` গুলো নিজে থেকেই `Safe` বা `High Risk` হয়ে যাবে।

➡️ আগের পর্ব: [পর্ব ১ — Django Backend ও Webhook](/docs/project-based/project-1/backend-webhook)
➡️ পরের পর্ব: [পর্ব ৩ — CrewAI এজেন্ট ও Django সেতু](/docs/project-based/project-1/crewai-agent)
➡️ সিস্টেমের পুরো ছবি: [System Design](/docs/project-based/project-1/solution)
