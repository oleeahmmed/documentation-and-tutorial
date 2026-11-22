---
title: Templates
description: base/home/contact HTML — Django টেমপ্লেট ইনহেরিট্যান্স আর ট্যাগ।
icon: Braces
---

## ফোল্ডার বানাও

```text
templates/
└── website/
    ├── base.html
    ├── home.html
    └── contact.html
```

`website/` সাবফোল্ডারে রাখা হয়েছে যাতে ভবিষ্যতে অন্য App-এর টেমপ্লেটের সাথে নাম মিলে না যায়।

## `templates/website/base.html` — বেস টেমপ্লেট

```html
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>{% block title %}আদর্শ উচ্চ বিদ্যালয়{% endblock %}</title>
</head>
<body>
    <nav>
        <a href="{% url 'home' %}">হোম</a> |
        <a href="{% url 'contact' %}">যোগাযোগ</a>
    </nav>

    {% if messages %}
        {% for message in messages %}
            <p style="color: green;">{{ message }}</p>
        {% endfor %}
    {% endif %}

    {% block content %}{% endblock %}
</body>
</html>
```

সব পেজ এই ফাইল থেকে `extends` করবে — নেভিগেশন, মেসেজ দেখানোর অংশ এক জায়গায় থাকবে, প্রতিটা পেজে বারবার লিখতে হবে না।

## `templates/website/home.html`

```html
{% extends 'website/base.html' %}
{% block title %}হোম{% endblock %}

{% block content %}
<h1>স্বাগতম, {{ school_name }}!</h1>
<p>আমাদের প্রতিষ্ঠানে আপনাকে স্বাগতম।</p>
{% endblock %}
```

## `templates/website/contact.html`

```html
{% extends 'website/base.html' %}
{% block title %}যোগাযোগ{% endblock %}

{% block content %}
<h2>যোগাযোগ করুন</h2>
<form method="POST">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">পাঠাও</button>
</form>
{% endblock %}
```

## কোড ব্যাখ্যা

| টেমপ্লেট ট্যাগ | কাজ |
| --- | --- |
| `{% extends %}` | বেস টেমপ্লেট থেকে উত্তরাধিকার নেওয়া |
| `{% block %}` | যেখানে চাইল্ড-টেমপ্লেট নিজের কন্টেন্ট বসাবে |
| `{% url 'name' %}` | URL হার্ডকোড না করে name দিয়ে রেফার করা |
| `{% csrf_token %}` | POST ফর্মে বাধ্যতামূলক, নিরাপত্তার জন্য |
| `{{ variable }}` | View থেকে পাঠানো ডেটা দেখানো |
| `{{ form.as_p }}` | ফর্মের প্রতিটা ফিল্ড `<p>`-তে সাজিয়ে দেখানো |

`{% csrf_token %}` বাদ দিলে ফর্ম সাবমিট করলে Django `403 Forbidden` দেবে — এটা অন্যের সাইট থেকে তোমার সাইটে ভুয়া ফর্ম সাবমিট আটকায়।

## বাস্তবে কী ঘটে

```bash
python manage.py runserver
```

`http://127.0.0.1:8000/contact/` গিয়ে ফর্ম পূরণ করে সাবমিট করলে:

1. ডেটা `ContactMessage` Model-এ সেভ হবে
2. পেজ আবার `/contact/`-এ ফিরে আসবে
3. উপরে সবুজ রঙে দেখাবে: **"আপনার বার্তা পাঠানো হয়েছে!"**

➡️ পরের পর্ব: [API সেটআপ](/django/api-setup) — এবার একই প্রজেক্টে DRF Student API যোগ করি।
