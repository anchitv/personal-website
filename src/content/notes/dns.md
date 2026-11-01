---
title: "DNS"
date: 2026-11-01
description: "How the Domain Name System turns names into IP addresses."
topic: dns-email
aliases: ["DNS", "Domain Name System", "DNS server"]
links:
  - title: "What is DNS?"
    url: https://www.cloudflare.com/learning/dns/what-is-dns/
    about: "How a lookup travels from your device to an answer and which servers it asks."
  - title: "How DNS works"
    url: https://howdns.works/
    about: "A short comic that follows one lookup from your browser to the root servers and back."
  - title: "Mess With DNS"
    url: https://messwithdns.net/
    about: "A free sandbox subdomain where you make real records and watch lookups arrive live."
tags: ["dns", "networking"]
draft: false
---

Nobody wants to remember a string of numbers for every website. **DNS** (the Domain Name System) turns names like `example.com` into [IP addresses](/notes/ip-addresses/). It is the phone book of the internet.

Every time you open a website, your device first asks a DNS server for the address behind the name. Your router tells your devices which DNS server to ask, usually one run by your internet provider.

You can run your own DNS server instead, which blocks ads and trackers for every device in the house.

You can ask DNS yourself. This works on Linux, macOS and Windows:

```sh
nslookup example.com
```

The answer is the IP address behind the name. What each name points to is set by the domain's [DNS records](/notes/dns-records/).
