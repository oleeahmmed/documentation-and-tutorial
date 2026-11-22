---
title: ফায়ারওয়াল ও systemd
description: 8069 পোর্ট খোলা আর systemd সার্ভিস দিয়ে Odoo স্থায়ীভাবে চালু রাখা।
icon: Shield
---

## ধাপ ১০: ফায়ারওয়াল

সার্ভার হলে বাইরে থেকে ৮০৬৯ পোর্টে ঢোকার অনুমতি দিতে হবে:

```bash
sudo ufw allow 8069/tcp
sudo ufw status
```

> **আগে SSH খোলা রাখো:** UFW চালু করার আগে অবশ্যই `sudo ufw allow OpenSSH` দাও, নাহলে সার্ভার থেকে নিজের SSH কানেকশনই বন্ধ হয়ে যেতে পারে। ইতিমধ্যে UFW চালু থাকলে এই লাইনটা বাদ দাও।

## ধাপ ১১: Background-এ চালানো — systemd সার্ভিস

টার্মিনাল বন্ধ করলে Odoo বন্ধ হয়ে যাবে। তাই systemd সার্ভিস বানানো হয় — সার্ভার বুট হলেই Odoo নিজে থেকে চালু হবে, ক্র্যাশ করলে আবার চালু হবে।

```bash
sudo nano /etc/systemd/system/my-odoo.service
```

```ini
[Unit]
Description=My Odoo Instance
After=network.target postgresql.service

[Service]
Type=simple
User=your_linux_username
WorkingDirectory=/home/your_linux_username/my-odoo
ExecStart=/home/your_linux_username/my-odoo/venv/bin/python3 /home/your_linux_username/my-odoo/odoo/odoo-bin -c /home/your_linux_username/my-odoo/odoo.conf
Restart=always

[Install]
WantedBy=multi-user.target
```

### কোন লাইন কী বলে

| অংশ | মানে |
| --- | --- |
| `After=network.target postgresql.service` | নেটওয়ার্ক আর PostgreSQL চালু হওয়ার পরে Odoo শুরু হবে |
| `User` | Odoo যে ইউজারের অধীনে চলবে — তোমার ইউজারনেম |
| `WorkingDirectory` | কোন ফোল্ডার থেকে চালু হবে |
| `ExecStart` | venv-এর Python দিয়ে `odoo-bin` চালানো হচ্ছে |
| `Restart=always` | ক্র্যাশ/বন্ধ হলে systemd আবার চালু করবে |
| `WantedBy=multi-user.target` | সার্ভার বুট হলে চালু হবে |

এবার চালু করো:

```bash
sudo systemctl daemon-reload
sudo systemctl enable my-odoo
sudo systemctl start my-odoo

# চেক করো
sudo systemctl status my-odoo
sudo journalctl -u my-odoo -f    # লাইভ লগ দেখো
```

`status`-এ `active (running)` দেখলে Odoo ব্যাকগ্রাউন্ডে চলছে। `journalctl -f` চালিয়ে রাখলে ঠিক টার্মিনালে চালানোর মতোই লগ দেখতে পাবে — বন্ধ করতে `Ctrl+C`।

### পরেরবার কোড আপডেট করলে

```bash
cd ~/my-odoo/odoo
git pull
cd ~/my-odoo
source venv/bin/activate
pip install -r odoo/requirements.txt   # নতুন ডিপেন্ডেন্সি এলে
sudo systemctl restart my-odoo
```

➡️ পরের অংশ: [Basic Configuration — Database](/odoo/configuration/database) — Odoo চালু হয়েছে, এবার ভেতরের সেটিংসগুলো ঠিক করি।
