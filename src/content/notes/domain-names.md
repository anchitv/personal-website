---
title: "Domain names"
date: 2026-10-30
description: "What a domain name is, what it costs and what it gives a home server."
topic: dns-email
aliases: ["Domain name", "Registrar", "Subdomain", "HTTPS certificate", "Let's Encrypt"]
links:
  - title: "What is a domain name?"
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name
    about: "How domain names are built, what renting one means and what a registrar does."
  - title: "Domain name renewals and expiration"
    url: https://www.icann.org/resources/pages/domain-name-renewal-expiration-faqs-2018-12-07-en
    about: "Renewal reminders, grace periods and what happens if your domain lapses."
  - title: "What is an SSL certificate?"
    url: https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/
    about: "What a certificate proves, what's inside one and why browsers insist on it."
tags: ["dns", "networking"]
draft: false
---

A **domain name** is a name you rent from a company called a registrar, like `example.com`. It costs about 10 to 20 dollars a year and any registrar works.

Once you have one, you control its [DNS](/notes/dns/): you decide what each name points to. You can make as many **subdomains** as you like, such as `photos.example.com` or `files.example.com`.

For a home server, a domain gives you two things:

- **Names instead of numbers.** `photos.example.com` instead of `192.168.1.10:2283`.
- **HTTPS.** Browsers warn about sites without a valid HTTPS certificate and some apps refuse to connect at all. With a domain, you can get free certificates from [Let's Encrypt](https://letsencrypt.org).

A web server like [Caddy](https://caddyserver.com/) gets certificates for you and renews them by itself.

[Setting up your own domain](/blog/homelab/custom-domain/) goes from picking a name to moving its DNS to [Cloudflare](https://developers.cloudflare.com/dns/).
