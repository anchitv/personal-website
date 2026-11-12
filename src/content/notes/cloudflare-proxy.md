---
title: "Cloudflare: proxied or DNS only"
date: 2026-11-01
description: "What Cloudflare's orange cloud does, what it can't carry and how to use it with a home server."
topic: dns-email
aliases: ["Cloudflare's proxy", "Orange cloud", "Grey cloud", "Full (strict)", "Error 413"]
links:
  - title: "What is a reverse proxy?"
    url: https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/
    about: "How a server in front of yours hides its address and stops attacks before they land."
  - title: "ERR_TOO_MANY_REDIRECTS"
    url: https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/
    about: "A diagram of the Flexible-mode redirect loop and the two ways out of it."
  - title: "Restoring original visitor IPs"
    url: https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/
    about: "Why proxied visitors show up with Cloudflare's addresses and a Caddy fix."
tags: ["dns", "web"]
draft: false
---

A, AAAA and CNAME [records](/notes/dns-records/) in [Cloudflare](https://developers.cloudflare.com/dns/) have a switch with an orange or grey cloud.

- **Proxied (orange)**
  - Visitors connect to Cloudflare and Cloudflare connects to your server.
  - Your server's real IP address stays hidden.
  - Cloudflare blocks a lot of junk traffic before it reaches you.
- **DNS only (grey)**
  - The record returns your real address.
  - Visitors connect to your server directly.

MX and TXT records are always DNS only. Cloudflare's [proxy status page](https://developers.cloudflare.com/dns/proxy-status/) has the details.

## Limits

- **Only web traffic works**
  - Proxying supports a [fixed list of ports](https://developers.cloudflare.com/fundamentals/reference/network-ports/), including 80 and 443.
  - Anything that isn't a website, like SSH or a VPN, needs DNS only.
  - [Headscale](https://headscale.net/stable/ref/integration/reverse-proxy/), for example, doesn't work behind [Cloudflare](https://developers.cloudflare.com/dns/)'s proxy at all.
- **Uploads are capped at 100 MB**
  - That's per request on the free plan ([error 413](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-413/)).
  - A photo or file service that takes large videos can hit this.
  - Keep those records DNS only or upload from home.
- **DKIM records must be DNS only**
  - Cloudflare proxies new CNAME records by default.
  - A proxied DKIM record doesn't work.

## With a home server

For a home server, proxying earns its keep: your home address stays hidden behind [Cloudflare](https://developers.cloudflare.com/dns/)'s. Mind the limits above.

When a record is proxied and your server has its own HTTPS certificate, set **SSL/TLS** to [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/), so Cloudflare checks it.

Flexible mode sends traffic to your server unencrypted. With a server that redirects to HTTPS, like [Caddy](https://caddyserver.com/docs/), it causes endless redirect loops.

## Which one is on

`dig +short photos.example.com` on a DNS-only record returns your real address. A proxied one returns [Cloudflare](https://developers.cloudflare.com/dns/)'s addresses instead.
