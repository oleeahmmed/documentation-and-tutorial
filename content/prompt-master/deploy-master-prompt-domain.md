---
title: Deploy Master Prompt (Domain/IP)
description: env-এর DOMAIN থেকে Nginx কনফিগ — ডোমেইন হলে SSL, IP হলে SSL ছাড়া।
icon: Terminal
---

একটামাত্র স্ক্রিপ্ট (`deploy.py`), যেটা চালালেই হয় প্রজেক্ট ডিপ্লয় হয়ে যাবে, নাহলে কোনো সমস্যা থাকলে সেটা নিজে খুঁজে বের করে দেখাবে/ঠিক করবে — এইটাই পুরো প্রম্পটের মূল উদ্দেশ্য।

এই সংস্করণে বাড়তি নিয়ম আছে — ডিপ্লয়ের সময় `.env` ফাইলের `DOMAIN` পড়ে **যে ডোমেইন পাবে, ঠিক সেই ডোমেইনেই** Nginx কনফিগ বানাবে। `DOMAIN`-এ ডোমেইন থাকলে SSL (Certbot) চালু হবে, আর সার্ভারের IP থাকলে SSL একদমই চালাবে না — শুধু HTTP-তে চলবে।

## দুই মোড এক নজরে

| মোড | কমান্ড | কাজ |
| --- | --- | --- |
| **DEPLOY** | `python3 deploy.py` | সার্ভার প্রস্তুত, কোড আনা, ডিপেন্ডেন্সি, সার্ভিস, Nginx, SSL — সব একসাথে |
| **DIAGNOSE** | `python3 deploy.py --diagnose` | অ্যাপ, ডেটাবেস, Redis, WebSocket, Worker, Nginx, SSL, ডিস্ক/মেমরি একে একে পরীক্ষা |

## ডোমেইন ও SSL নিয়ম

| `.env`-এ `DOMAIN` | Nginx | SSL |
| --- | --- | --- |
| `app.example.com` | `server_name app.example.com;` | Certbot + HTTPS redirect |
| `203.0.113.10` (IP) | শুধু `listen 80`, `server_name _;` | নেই — Certbot/Mixed Content/redirect কিছুই নয় |
| খালি বা নেই | ডিপ্লয় থামবে, স্পষ্ট এরর | প্রযোজ্য নয় |

> DNS-এর A/AAAA রেকর্ড সার্ভারের IP-তে না পৌঁছালে ডোমেইন মোডেও Certbot চালাবে না — শুধু রিপোর্ট করবে। IP মোডে SSL চেক DIAGNOSE-এ "প্রযোজ্য নয়" দেখাবে।

## মাস্টার প্রম্পট

নিচের পুরো ব্লকটা কপি করে Claude-কে দাও। প্রম্পটে স্পষ্ট বলা আছে — প্রতিটা তথ্য আসল ফাইল পড়ে দিতে হবে, অনুমান নয়।

```text
=== মূল উদ্দেশ্য (এটাই সবচেয়ে গুরুত্বপূর্ণ, পুরো বিশ্লেষণ এই লক্ষ্য মাথায় রেখেই করবে) ===

আমি একটামাত্র Python স্ক্রিপ্ট (deploy.py) বানাবো, যেটার দুটো কাজ থাকবে:

১) DEPLOY মোড: আমি যদি প্রথমবার বা নতুন করে কোড পুশ করার পর এই স্ক্রিপ্ট 
   চালাই, তাহলে এটা শূন্য থেকে শুরু করে প্রজেক্টটাকে সম্পূর্ণভাবে লাইভ 
   করে দেবে — সার্ভার প্রস্তুত করা, কোড আনা, ডিপেন্ডেন্সি বসানো, সার্ভিস 
   চালু করা, সব কিছু একাই করবে। আমি শুধু 'python3 deploy.py' চালাবো, 
   আর কিছু করতে হবে না।

২) DIAGNOSE মোড: সাইট যদি হঠাৎ ডাউন হয়ে যায়, বা কোনো ফিচার কাজ না করে, 
   তাহলে আমি এই একই স্ক্রিপ্ট '--diagnose' ফ্ল্যাগ দিয়ে চালালে, এটা 
   প্রতিটা উপাদান (অ্যাপ প্রসেস, ডেটাবেস, Redis, WebSocket, Worker, 
   Nginx, SSL, ডিস্ক/মেমোরি) একে একে পরীক্ষা করে বলে দেবে ঠিক কোথায় 
   সমস্যা, আর যেখানে সম্ভব (যেমন কোনো সার্ভিস বন্ধ হয়ে গেছে), নিজে থেকেই 
   ঠিক করে দেবে। যেখানে স্বয়ংক্রিয়ভাবে ঠিক করা নিরাপদ না (যেমন কোড-লেভেল 
   বাগ), সেখানে স্পষ্ট করে বলবে ঠিক কোন লগ-লাইনে সমস্যা, আমাকে কী করতে 
   হবে।

৩) ডোমেইন ও SSL: ডিপ্লয়ের সময় .env (বা .env.example) থেকে DOMAIN পড়বে। 
   DOMAIN-এ সত্যিকারের ডোমেইন থাকলে Nginx-এ সেই server_name বসিয়ে 
   Certbot দিয়ে SSL চালু করবে, আর 80→443 redirect দেবে। DOMAIN-এ 
   সার্ভারের IP থাকলে Nginx শুধু পোর্ট 80-এ চলবে, server_name _ হবে, 
   আর SSL/Certbot/Certificate চেক একদমই চালাবে না। DOMAIN খালি বা 
   পাওয়া না গেলে ডিপ্লয় থামিয়ে স্পষ্ট বলবে "DOMAIN=example.com অথবা 
   DOMAIN=<server-ip> দাও" — নিজে থেকে কোনো ডোমেইন অনুমান করবে না।

এই লক্ষ্য মাথায় রেখে, স্ক্রিপ্ট লেখার আগে আমার প্রজেক্ট ফোল্ডার(গুলো) 
বিশ্লেষণ করে নিচের তথ্য দাও — যাতে deploy.py-তে DEPLOY আর DIAGNOSE দুটো 
মোডের জন্যই সঠিক তথ্য বসানো যায়। প্রতিটা তথ্য আসল ফাইল পড়ে দেবে, অনুমান 
করে না — অনিশ্চিত হলে স্পষ্ট করে বলবে "ফাইলে উল্লেখ নেই, ম্যানুয়ালি নিশ্চিত 
হও"।

=== ধাপ ১: প্রজেক্ট শনাক্তকরণ ===
- ভাষা/ফ্রেমওয়ার্ক কী, কোন ফাইল দেখে বুঝলে
- backend/frontend/fullstack, static নাকি চলমান প্রসেস
- Dockerfile বা docker-compose.yml থাকলে পুরোটা বিশ্লেষণ করো — এতে প্রায় 
  সব সার্ভিসের তথ্য একসাথে স্পষ্ট পাওয়া যায়

=== ধাপ ২: রানটাইম ও ভার্সন ===
- ভাষার ভার্সন (কোন ফাইলে উল্লেখ আছে)
- সিস্টেম-লেভেল প্যাকেজ/এক্সটেনশন

=== ধাপ ৩: ডিপেন্ডেন্সি ===
- প্যাকেজ-ম্যানেজার, ইনস্টল কমান্ড
- ইনফ্রাস্ট্রাকচার-প্রভাবক লাইব্রেরি (নিচের ধাপগুলোর সূত্র ধরে খুঁজে বের করবে)

=== ধাপ ৪: বিল্ড প্রসেস ===
- বিল্ড কমান্ড, আউটপুট ফোল্ডার

=== ধাপ ৫: মূল অ্যাপ্লিকেশন সার্ভিস ===
- চালানোর পদ্ধতি (app-server/process-manager/FPM), স্টার্ট-কমান্ড, পোর্ট
- stdout/stderr-এ লগ লেখে নাকি নির্দিষ্ট ফাইলে — DIAGNOSE মোডে এখান 
  থেকেই এরর পড়তে হবে

=== ধাপ ৬: Redis / Caching / Session Store ===
- redis/ioredis/predis/django-redis-এর মতো প্যাকেজ আছে কিনা
- ব্যবহারের ধরন: caching, session, queue broker, pub/sub
- কানেকশন env variable-এর নাম
- DIAGNOSE মোডে Redis যাচাইয়ের কমান্ড কী হবে (যেমন redis-cli ping)

=== ধাপ ৭: WebSocket / Real-time ===
- socket.io, ws, Django Channels, Laravel Reverb, Pusher ইত্যাদি আছে কিনা
- একই প্রসেসে চলে নাকি আলাদা পোর্ট/সার্ভারে
- পাথ/পোর্ট কী
- DIAGNOSE মোডে WebSocket সংযোগ পরীক্ষা করার উপায় (যেমন curl দিয়ে 
  Upgrade header সহ রিকোয়েস্ট পাঠানো সম্ভব কিনা বলো)

=== ধাপ ৮: Background Jobs / Queue Workers ===
- Celery, BullMQ, Laravel Queue, Sidekiq ইত্যাদি আছে কিনা
- worker চালানোর কমান্ড (মূল অ্যাপ থেকে আলাদা প্রসেস হিসেবে ধরে নেবে)
- scheduler/beat প্রসেস লাগে কিনা
- DIAGNOSE মোডে worker সঠিকভাবে job প্রসেস করছে কিনা কীভাবে বোঝা যাবে 
  (যেমন queue length চেক করার কমান্ড)

=== ধাপ ৯: Cron / Scheduled Tasks ===
- কোনো সময়-নির্ধারিত কাজ আছে কিনা, exact কমান্ড ও সময়

=== ধাপ ১০: ওয়েব সার্ভার কনফিগারেশন ===
- reverse proxy/FastCGI টাইপ
- static ফাইলের পাথ
- WebSocket upgrade header লাগবে কিনা
- client_max_body_size বাড়ানো লাগবে কিনা (আপলোড-লিমিট কোডে থাকলে বলো)
- server_name কোথা থেকে আসবে — .env-এর DOMAIN ভেরিয়েবল (ধাপ ১১ দেখো)

=== ধাপ ১১: ডোমেইন ও SSL/HTTPS (শর্তসাপেক্ষ) ===
- .env / .env.example-এ DOMAIN ভেরিয়েবল আছে কিনা, ডিফল্ট মান কী
- deploy.py ডিপ্লয়ের সময় DOMAIN-এর মান যাচাই করবে:
  * ফাঁকা/অনুপস্থিত → ডিপ্লয় থামাও, "DOMAIN=example.com অথবা 
    DOMAIN=<server-ip> দাও" বলে মানুষকে জানাও
  * IP ঠিকানা (যেমন 203.0.113.10) → HTTP-only মোড; Nginx শুধু listen 80,
    server_name _; Certbot/SSL/HTTPS redirect কিছুই নয়
  * বৈধ ডোমেইন (যেমন app.example.com) → HTTPS মোড; Nginx-এ server_name 
    ওই ডোমেইন, Certbot দিয়ে সার্টিফিকেট, 80→443 redirect
- ডোমেইন হলে Certbot চালানোর আগে ডোমেইনের DNS A/AAAA রেকর্ড সার্ভারের 
  IP-তে পৌঁছায় কিনা যাচাই করো (যেমন dig +short DOMAIN); না পৌঁছালে 
  সার্টিফিকেট আনবে না, শুধু রিপোর্ট করবে
- SSL নিষ্ক্রিয় থাকলে DIAGNOSE-এ SSL চেক "প্রযোজ্য নয়" দেখাবে

=== ধাপ ১২: এনভায়রনমেন্ট ভেরিয়েবল ===
- সব .env.example-এর ভেরিয়েবল, কোনটা কোন সার্ভিসের তা চিহ্নিত করে
- DOMAIN কীভাবে পড়া হবে (os.environ বা python-dotenv) আর .env.example-এ 
  তার উদাহরণ (ডোমেইন ও IP — দুটো ফরম্যাটই দেখাও)

=== ধাপ ১৩: ডেটাবেস ও মাইগ্রেশন ===
- টাইপ, মাইগ্রেশন কমান্ড
- DIAGNOSE মোডে ডেটাবেস কানেকশন টেস্ট করার কমান্ড কী হবে

=== ধাপ ১৪: ফাইল স্টোরেজ ===
- লোকাল আপলোড-ফোল্ডার (ডিপ্লয়মেন্টে মুছে না যাওয়া উচিত) নাকি ক্লাউড স্টোরেজ

=== ধাপ ১৫: লগিং ===
- প্রতিটা সার্ভিসের (app, worker, nginx, redis) লগ কোথায় পাওয়া যাবে — 
  এটা DIAGNOSE মোডের সবচেয়ে গুরুত্বপূর্ণ তথ্য, কারণ সমস্যা খোঁজার সময় 
  এখান থেকেই এরর পড়তে হবে

=== ধাপ ১৬: পারমিশন ও নিরাপত্তা ===
- বিশেষ write-permission লাগে এমন ফোল্ডার
- Redis/DB যেন শুধু localhost-bound থাকে তা নিশ্চিত করার কথা বলো

=== ধাপ ১৭: হেলথ-চেক ===
- /health বা /status এন্ডপয়েন্ট আছে কিনা — DEPLOY মোডের শেষে আর DIAGNOSE 
  মোডের শুরুতে এটাই প্রথম পরীক্ষা হবে
- ডোমেইন মোডে https://DOMAIN/health, আর IP মোডে http://<server-ip>/health 
  দিয়ে চেক করো

=== ধাপ ১৮: সাধারণ ব্যর্থতার কারণ (DIAGNOSE মোডের মূল ভিত্তি) ===
এই প্রজেক্টের স্ট্যাক অনুযায়ী, বাস্তবে সবচেয়ে বেশি যে কারণে এই ধরনের অ্যাপ 
ডাউন হয় বা কাজ করে না, তার একটা তালিকা দাও — প্রতিটার জন্য:
- উপসর্গ (যেমন "502 Bad Gateway" বা "WebSocket connection failed")
- সম্ভাব্য কারণ
- যাচাই করার সঠিক কমান্ড
- যেখানে নিরাপদে স্বয়ংক্রিয় সমাধান সম্ভব (যেমন সার্ভিস বন্ধ থাকলে restart 
  করা), সেই কমান্ড
- যেখানে স্বয়ংক্রিয় সমাধান ঝুঁকিপূর্ণ (যেমন কোড এরর, ডেটা করাপশন), সেখানে 
  শুধু "এই লগ-লাইন/এরর মেসেজ দেখলে এই কারণে হতে পারে, মানুষকে জানাও" লিখে 
  দাও — কখনো অনুমানভিত্তিক "ফিক্স" কোড বানাবে না যেখানে ডেটা হারানোর 
  ঝুঁকি আছে
- SSL-সংক্রান্ত উপসর্গ (certificate expired, NET::ERR_CERT_..., redirect 
  loop) শুধু ডোমেইন মোডে প্রযোজ্য — IP মোডে এগুলো বাদ দাও

নিয়ম:
- একাধিক ফোল্ডার থাকলে প্রতিটার জন্য আলাদা করে সম্পূর্ণ কাঠামোয় উত্তর দাও
- সবশেষে তিনটা জিনিস দাও:

  ১) "সিস্টেম-লেভেল সার্ভিস তালিকা" — ঠিক কোন কোন systemd সার্ভিস/প্যাকেজ 
     লাগবে (app, redis-server, worker, beat, nginx ইত্যাদি), এবং তাদের 
     নির্ভরতার ক্রম (কোনটা কোনটার পরে চালু হতে হবে)

  ২) একটা সারাংশ টেবিল, কলাম: project_name, language_runtime, 
     install_command, build_command, start_command, port, service_type, 
     log_location, needs_redis, redis_purpose, redis_check_command, 
     needs_websocket, websocket_port, needs_worker, worker_command, 
     worker_check_command, needs_cron, cron_schedule, 
     web_server_config_type, required_env_vars, domain_env_var, 
     deploy_mode (domain/ip), ssl_enabled, database, 
     db_check_command, file_storage_path, ssl_needed, 
     health_check_endpoint

  ৩) একটা "DIAGNOSE চেকলিস্ট" — ক্রম অনুযায়ী কোন কোন জিনিস একটার পর একটা 
     চেক করা উচিত যখন সাইট ডাউন থাকে (যেমন: ১. app প্রসেস চলছে কিনা, 
     ২. পোর্ট শোনা যাচ্ছে কিনা, ৩. ডেটাবেস কানেকশন, ৪. Redis কানেকশন, 
     ৫. ডিস্ক/মেমোরি পূর্ণ কিনা, ৬. Nginx কনফিগ ভ্যালিড কিনা, ৭. SSL 
     সার্টিফিকেট মেয়াদ আছে কিনা — শেষেরটা শুধু ডোমেইন মোডে; সাথে DOMAIN 
     সেট আছে কিনা ও DNS সার্ভারের IP-তে মিলছে কিনা) — এই ক্রমটাই পরে 
     deploy.py-র diagnose() ফাংশনের কাঠামো হবে
```

## এই প্রম্পটে নতুন কী যোগ হলো এবং কেন

| সংযোজন | কারণ |
| --- | --- |
| শুরুতেই "মূল উদ্দেশ্য" স্পষ্ট করে বলা | Claude প্রতিটা প্রশ্নের উত্তর এই দুই-মোড লক্ষ্য মাথায় রেখে দেবে, শুধু তথ্য জড়ো করবে না |
| প্রতিটা সার্ভিসের সাথে "...check command" চাওয়া | শুধু কী আছে তা না, **কীভাবে যাচাই করব** তাও লাগবে DIAGNOSE মোডের জন্য |
| ধাপ ১৫ (লগিং) | সমস্যা খুঁজতে হলে প্রথমেই লাগে লগের সঠিক অবস্থান |
| ধাপ ১৮ (সাধারণ ব্যর্থতার কারণ) | এটাই DIAGNOSE ফাংশনের "জ্ঞানভাণ্ডার" — Claude নিজে থেকেই common failure pattern বলে দেবে |
| "নিরাপদ অটো-ফিক্স" বনাম "শুধু রিপোর্ট করা" স্পষ্ট আলাদা করা | যাতে স্ক্রিপ্ট কখনো ডেটা-ক্ষতিকর কিছু নিজে থেকে না করে ফেলে |
| DIAGNOSE চেকলিস্ট আলাদা করে চাওয়া | এটাই সরাসরি কোডের `diagnose()` ফাংশনের কাঠামো হয়ে যাবে |
| `.env`-এর DOMAIN থেকে server_name | Nginx ঠিক যে ডোমেইনে সার্ভ করবে সেটাই ব্যবহার করবে — হাতে লেখা ডোমেইন নয় |
| ডোমেইন হলে SSL, IP হলে বন্ধ | IP-তে অকারণে Certbot চালিয়ে ব্যর্থ হওয়া বন্ধ |
| DOMAIN খালি হলে ডিপ্লয় থামানো | ভুল বা ফাঁকা ডোমেইনে ডিপ্লয় হয়ে সাইট না খোলার ঝুঁকি নেই |
| DNS যাচাইয়ের পর Certbot | ভুল DNS-এ বারবার failed challenge এড়ানো যায় |

## deploy.py-এর দুই-মোড কাঠামো

প্রম্পটের উত্তর থেকে পাওয়া সারাংশ টেবিল দিয়ে `CONFIG` পূরণ করো। বাকি `check_*` ফাংশনগুলো একই প্যাটার্নে `ok / message / auto_fixed` রিটার্ন করবে।

ডোমেইন আর SSL সবসময় `.env`-এর `DOMAIN` থেকে আসবে — কোডে কোনো ডোমেইন হার্ডকোড হবে না। `DOMAIN` যদি আসল ডোমেইন হয় (`app.example.com`), Nginx-এ সেই `server_name` বসবে আর Certbot দিয়ে SSL হবে। যদি সেটা IP হয় (`203.0.113.10`), Nginx শুধু পোর্ট ৮০-তে চলবে, SSL-এর কোনো ধাপই চলবে না।

```python
#!/usr/bin/env python3
import ipaddress
import os
import sys

CONFIG = {
    # ... Claude-এর দেওয়া সারাংশ টেবিল থেকে পূরণ হবে
    "domain_env_var": "DOMAIN",          # .env থেকে পড়া হবে
    "nginx_site_name": "myapp",
    "app_port": 4000,
    "systemd_service_name": "myapp",
}


def read_domain():
    """`.env`-এর DOMAIN পড়ে (ডোমেইন বা IP)। খালি থাকলে ডিপ্লয় থামিয়ে দেয়।"""
    domain = os.environ.get(CONFIG["domain_env_var"], "").strip()
    if not domain:
        sys.exit(
            f"❌ .env-এ {CONFIG['domain_env_var']} খালি। "
            f"{CONFIG['domain_env_var']}=example.com অথবা "
            f"{CONFIG['domain_env_var']}=<server-ip> দাও।"
        )
    return domain


def is_ip(value):
    """মানটা IP হলে True, ডোমেইন হলে False।"""
    try:
        ipaddress.ip_address(value)
        return True
    except ValueError:
        return False


def deploy():
    """প্রজেক্ট সম্পূর্ণভাবে লাইভ করে।"""
    domain = read_domain()
    domain_mode = not is_ip(domain)

    check_server_resources()
    check_and_install_dependencies()
    setup_project_folder()
    install_project_dependencies()
    run_build_if_needed()
    setup_redis()
    run_database_migrations()
    setup_app_service()
    setup_worker_service()
    setup_cron_jobs()
    generate_nginx_config(domain)
    if domain_mode:
        setup_ssl(domain)          # শুধু আসল ডোমেইনে
    else:
        print(f"ℹ️  {domain} একটা IP — SSL/Certbot বাদ দেওয়া হলো।")
    health_check(domain, use_https=domain_mode)
    print("\n🎉 ডিপ্লয়মেন্ট সম্পন্ন!")


def diagnose():
    """ধাপে ধাপে সমস্যা খুঁজে বের করে, যেখানে সম্ভব নিজেই ঠিক করে।"""
    print("🔍 সমস্যা নির্ণয় শুরু হচ্ছে...\n")

    checks = [
        ("অ্যাপ প্রসেস চলছে কিনা", check_app_process),
        ("পোর্ট শোনা যাচ্ছে কিনা", check_port_listening),
        ("ডেটাবেস কানেকশন", check_database_connection),
        ("Redis কানেকশন", check_redis_connection),
        ("Worker প্রসেস", check_worker_process),
        ("ডিস্ক/মেমোরি", check_disk_memory),
        ("DOMAIN সেট আছে কিনা ও DNS সার্ভারের IP-তে মিলছে কিনা", check_domain_dns),
        ("Nginx কনফিগ", check_nginx_config),
        ("SSL সার্টিফিকেট মেয়াদ (শুধু ডোমেইন মোডে)", check_ssl_expiry),
    ]

    problems_found = []
    for name, check_fn in checks:
        print(f"➡️  চেক করা হচ্ছে: {name}")
        ok, message, auto_fixed = check_fn()
        if ok:
            print(f"   ✅ ঠিক আছে — {message}")
        else:
            print(f"   ❌ সমস্যা পাওয়া গেছে — {message}")
            if auto_fixed:
                print(f"   🔧 স্বয়ংক্রিয়ভাবে ঠিক করা হয়েছে।")
            else:
                problems_found.append((name, message))

    print("\n" + "=" * 50)
    if not problems_found:
        print("✅ সবকিছু ঠিক আছে, কোনো সমস্যা পাওয়া যায়নি।")
    else:
        print(f"⚠️  {len(problems_found)}টা সমস্যা মানুষের মনোযোগ দরকার:")
        for name, msg in problems_found:
            print(f"   - {name}: {msg}")


def check_app_process():
    import subprocess
    status = subprocess.run(
        f"systemctl is-active {CONFIG['systemd_service_name']}",
        shell=True, capture_output=True, text=True
    ).stdout.strip()

    if status == "active":
        return True, "অ্যাপ সার্ভিস চলছে", False

    # নিরাপদ অটো-ফিক্স: বন্ধ থাকলে স্টার্ট করা
    subprocess.run(f"sudo systemctl start {CONFIG['systemd_service_name']}", shell=True)
    import time; time.sleep(2)
    new_status = subprocess.run(
        f"systemctl is-active {CONFIG['systemd_service_name']}",
        shell=True, capture_output=True, text=True
    ).stdout.strip()

    if new_status == "active":
        return False, "সার্ভিস বন্ধ ছিল, চালু করা হয়েছে", True
    else:
        # নিজে থেকে ঠিক না হলে, শেষ লগ দেখিয়ে মানুষকে জানানো
        logs = subprocess.run(
            f"sudo journalctl -u {CONFIG['systemd_service_name']} -n 20 --no-pager",
            shell=True, capture_output=True, text=True
        ).stdout
        return False, f"সার্ভিস চালু করা যায়নি। শেষ লগ:\n{logs}", False


def check_redis_connection():
    if not CONFIG.get("needs_redis"):
        return True, "Redis প্রযোজ্য নয়", False
    import subprocess
    result = subprocess.run("redis-cli ping", shell=True, capture_output=True, text=True)
    if "PONG" in result.stdout:
        return True, "Redis সাড়া দিচ্ছে", False

    subprocess.run("sudo systemctl start redis-server", shell=True)
    import time; time.sleep(1)
    retry = subprocess.run("redis-cli ping", shell=True, capture_output=True, text=True)
    if "PONG" in retry.stdout:
        return False, "Redis বন্ধ ছিল, চালু করা হয়েছে", True
    return False, "Redis চালু করা যায়নি, ম্যানুয়ালি চেক করো", False


def check_disk_memory():
    import subprocess
    disk = subprocess.run("df -h / | tail -1 | awk '{print $5}'",
                           shell=True, capture_output=True, text=True).stdout.strip()
    usage_percent = int(disk.replace("%", ""))

    if usage_percent > 90:
        return False, f"ডিস্ক {usage_percent}% ভরা গেছে! জায়গা খালি করো।", False
    return True, f"ডিস্ক ব্যবহার {usage_percent}%, স্বাভাবিক", False


def generate_nginx_config(domain):
    """DOMAIN ডোমেইন হলে server_name সহ কনফিগ, IP হলে শুধু পোর্ট ৮০।"""
    if is_ip(domain):
        server_name = "_"
        listen = "    listen 80;"
    else:
        server_name = domain
        listen = "    listen 80;\n    listen [::]:80;"

    config = f"""
server {{
{listen}
    server_name {server_name};

    location / {{
        proxy_pass http://127.0.0.1:{CONFIG['app_port']};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }}
}}
"""
    path = f"/etc/nginx/sites-available/{CONFIG['nginx_site_name']}"
    open(path, "w").write(config.strip())
    import subprocess
    subprocess.run(f"sudo ln -sf {path} /etc/nginx/sites-enabled/", shell=True)
    subprocess.run("sudo nginx -t && sudo systemctl reload nginx", shell=True)


def setup_ssl(domain):
    """শুধু আসল ডোমেইনে — আগে DNS সার্ভারের IP-তে মিলছে কিনা দেখে, তারপর Certbot।"""
    import subprocess
    resolved = subprocess.run(f"dig +short {domain} | tail -1",
                               shell=True, capture_output=True, text=True).stdout.strip()
    server_ip = subprocess.run("curl -s ifconfig.me",
                                shell=True, capture_output=True, text=True).stdout.strip()

    if resolved != server_ip:
        print(f"⚠️  DNS মিলছে না: {domain} → {resolved or 'কিছুই না'}, সার্ভার = {server_ip}")
        print("   DNS A record ঠিক করার আগে SSL বাদ দেওয়া হলো, ম্যানুয়ালি চেক করো।")
        return

    subprocess.run(
        f"sudo certbot --nginx -d {domain} --non-interactive --agree-tos "
        f"-m admin@{domain} --redirect",
        shell=True,
    )


def check_domain_dns():
    """DOMAIN সেট আছে কিনা; ডোমেইন হলে DNS সার্ভারের IP-তে মিলছে কিনা।"""
    domain = os.environ.get(CONFIG["domain_env_var"], "").strip()
    if not domain:
        return False, f".env-এ {CONFIG['domain_env_var']} নেই — ডিপ্লয় সঠিক জায়গায় হবে না", False

    if is_ip(domain):
        return True, f"DOMAIN = {domain} (IP মোড) — SSL প্রযোজ্য নয়", False

    import subprocess
    resolved = subprocess.run(f"dig +short {domain} | tail -1",
                               shell=True, capture_output=True, text=True).stdout.strip()
    server_ip = subprocess.run("curl -s ifconfig.me",
                                shell=True, capture_output=True, text=True).stdout.strip()
    if resolved != server_ip:
        return False, f"DNS মিলছে না — {domain} → {resolved or 'কিছুই না'}, সার্ভার = {server_ip}", False
    return True, f"DNS ঠিক আছে — {domain} → {server_ip}", False


def check_ssl_expiry():
    """IP মোডে SSL নেই, তাই এটা স্বাভাবিকভাবে 'প্রযোজ্য নয়'।"""
    domain = os.environ.get(CONFIG["domain_env_var"], "").strip()
    if is_ip(domain):
        return True, "SSL প্রযোজ্য নয় (IP মোড)", False

    import subprocess
    result = subprocess.run(
        f"echo | openssl s_client -servername {domain} -connect {domain}:443 2>/dev/null "
        "| openssl x509 -noout -enddate",
        shell=True, capture_output=True, text=True,
    ).stdout.strip()
    if not result:
        return False, "সার্টিফিকেট পাওয়া যায়নি — Nginx/SSL কনফিগ চেক করো", False
    return True, f"সার্টিফিকেট মেয়াদ: {result.replace('notAfter=', '')}", False


# ... বাকি check_* ফাংশনগুলো একই প্যাটার্নে — ok/message/auto_fixed রিটার্ন করবে


if __name__ == "__main__":
    if "--diagnose" in sys.argv:
        diagnose()
    else:
        deploy()
```

## চালানোর নিয়ম

আগে `.env`-এ `DOMAIN` দাও — সার্ভারে এই ফাইলটা থাকবে, গিটে কমিট হবে না:

```bash
# ডোমেইনে ডিপ্লয় (SSL সহ)
DOMAIN=app.example.com

# অথবা শুধু IP-তে ডিপ্লয় (SSL ছাড়া)
DOMAIN=203.0.113.10
```

তারপর:

```bash
# প্রথমবার বা নতুন কোডের পর
python3 deploy.py

# সাইট কাজ না করলে
python3 deploy.py --diagnose
```

`DOMAIN` খালি থাকলে বা `.env`-এ না থাকলে স্ক্রিপ্ট ডিপ্লয় শুরুই করবে না — কারণ ভুল ডোমেইনে ডিপ্লয় হলে সাইট খুলবে না, অথচ সার্ভার চলছে বলে মনে হবে।

## বাস্তবে `--diagnose` চালালে যা দেখবে

```text
🔍 সমস্যা নির্ণয় শুরু হচ্ছে...

➡️  চেক করা হচ্ছে: অ্যাপ প্রসেস চলছে কিনা
   ❌ সমস্যা পাওয়া গেছে — সার্ভিস বন্ধ ছিল, চালু করা হয়েছে
   🔧 স্বয়ংক্রিয়ভাবে ঠিক করা হয়েছে।

➡️  চেক করা হচ্ছে: পোর্ট শোনা যাচ্ছে কিনা
   ✅ ঠিক আছে — পোর্ট 4000 সচল

➡️  চেক করা হচ্ছে: ডেটাবেস কানেকশন
   ✅ ঠিক আছে — সংযোগ সফল

➡️  চেক করা হচ্ছে: Redis কানেকশন
   ✅ ঠিক আছে — Redis সাড়া দিচ্ছে

➡️  চেক করা হচ্ছে: Worker প্রসেস
   ❌ সমস্যা পাওয়া গেছে — worker ক্র্যাশ হয়েছে, এরর: "Cannot connect to queue"

➡️  চেক করা হচ্ছে: ডিস্ক/মেমোরি
   ✅ ঠিক আছে — ডিস্ক ব্যবহার 45%

➡️  চেক করা হচ্ছে: DOMAIN সেট আছে কিনা ও DNS সার্ভারের IP-তে মিলছে কিনা
   ✅ ঠিক আছে — DNS ঠিক আছে — app.example.com → 203.0.113.10

➡️  চেক করা হচ্ছে: Nginx কনফিগ
   ✅ ঠিক আছে — nginx -t পাস করেছে

➡️  চেক করা হচ্ছে: SSL সার্টিফিকেট মেয়াদ (শুধু ডোমেইন মোডে)
   ✅ ঠিক আছে — সার্টিফিকেট মেয়াদ: Dec 20 12:00:00 2026 GMT

==================================================
⚠️  1টা সমস্যা মানুষের মনোযোগ দরকার:
   - Worker প্রসেস: worker ক্র্যাশ হয়েছে, এরর: "Cannot connect to queue"
```

IP মোডে (`DOMAIN=203.0.113.10`) শেষ দুটো লাইন বদলে যায় — SSL লাইনটা হয় `✅ ঠিক আছে — SSL প্রযোজ্য নয় (IP মোড)`, আর DNS লাইনটা হয় `✅ ঠিক আছে — DOMAIN = 203.0.113.10 (IP মোড) — SSL প্রযোজ্য নয়`।

এখানে **অ্যাপ সার্ভিস** নিজে থেকেই ঠিক হয়ে গেছে (নিরাপদ অটো-ফিক্স), কিন্তু **Worker-এর সমস্যা** কোড-সম্পর্কিত মনে হওয়ায় স্ক্রিপ্ট নিজে কিছু না করে শুধু রিপোর্ট করেছে — এটাই প্রম্পটে চাওয়া "নিরাপদ অটো-ফিক্স বনাম শুধু রিপোর্ট" নীতির বাস্তব প্রয়োগ।

## সারসংক্ষেপ

```text
মূল উদ্দেশ্য প্রম্পটের একদম শুরুতে স্পষ্ট করে বলা হলো: 
DEPLOY মোড + DIAGNOSE মোড — একটাই স্ক্রিপ্টে
    ↓
.env-এর DOMAIN পড়া হলো — ডোমেইন নাকি IP
    ↓
ডোমেইন হলে Nginx server_name + Certbot SSL, 
IP হলে শুধু পোর্ট ৮০, SSL একেবারে বন্ধ
    ↓
প্রতিটা ধাপে শুধু "কী আছে" না, "কীভাবে যাচাই করব" তাও চাওয়া হলো
    ↓
লগের অবস্থান ও সাধারণ ব্যর্থতার কারণ আলাদা ধাপে বিস্তারিত চাওয়া হলো
    ↓
Claude-এর আউটপুট থেকে deploy.py-তে deploy() ও diagnose() — 
দুটো আলাদা ফাংশন-সেট তৈরি হলো
    ↓
python3 deploy.py           → সম্পূর্ণ ডিপ্লয় (ডোমেইন/IP বুঝে)
python3 deploy.py --diagnose → সমস্যা খুঁজে বের করা ও নিরাপদ অংশ স্বয়ংক্রিয় ঠিক করা
```

এই প্রম্পটটাই আসল লক্ষ্য পূরণ করে — **একটা কমান্ড দিয়ে deploy, আরেকটা ফ্ল্যাগ দিয়ে problem-diagnosis**, আর ডোমেইন নাকি IP সেই অনুযায়ী Nginx ও SSL নিজে ঠিক করে নেবে।
