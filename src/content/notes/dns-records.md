---
title: "DNS record types"
date: 2026-11-01
description: "A, AAAA, CNAME, MX and TXT records, and what TTL means."
topic: dns-email
aliases: ["DNS record", "A record", "AAAA record", "CNAME", "MX record", "TXT record", "TTL"]
links:
  - title: "DNS records"
    url: https://www.cloudflare.com/learning/dns/dns-records/
    about: "Every common record type in plain words, with an example of what each one holds."
  - title: "DNS \"propagation\" is actually caches expiring"
    url: https://jvns.ca/blog/2021/12/06/dns-doesn-t-propagate/
    about: "What TTL really controls and why a changed record can take a while to show up."
  - title: "A simple DNS lookup tool"
    url: https://dns-lookup.jvns.ca/
    about: "Look up every record type for any domain at once, right in your browser."
tags: ["dns"]
draft: false
---

[DNS](/notes/dns/) for a domain is a list of **records**. Each one has a type, a name and a value. The name `@` means the bare domain, `example.com` itself.

- **`A` record:** Points a name at an IPv4 address
  - Example: `203.0.113.7`.
- **`AAAA` record:** The same, for an IPv6 address
- **`CNAME`:** Points a name at another name
  - Example: `www` → `example.com` means "whatever `example.com` points at".
- **`MX` record:** Which servers receive email for the domain
  - Each one has a priority.
  - Senders try the lowest number first and fall back to the others.
- **`TXT`:** Holds text
  - Services use it to check that you own the domain.
  - Email uses it for anti-spam settings like SPF and DMARC.

Each record also has a **TTL**, how long other servers may remember the answer before asking again. The automatic setting most DNS providers offer is fine.
