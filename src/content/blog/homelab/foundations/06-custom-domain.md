---
title: "Setting up your own domain"
date: 2026-11-01
description: "Buy a domain and move its DNS to Cloudflare, ready to point at your services."
tags: ["dns", "networking", "web", "homelab"]
draft: false
---

[[Part:starting-at-boot]] keeps your services running. Next, they need a name. A [domain](/notes/domain-names/) is an address you own. Your website, your email and your home server can all live under it. If you change your website host or email provider, the address stays yours. This post buys one and moves its DNS to Cloudflare. Pointing it at your services comes in a later part.

It uses [Cloudflare](https://developers.cloudflare.com/dns/) for [DNS](/notes/dns/), because it's free, fast and has a clear dashboard. `example.com` stands in for your domain throughout.

## Pick a name

- **Short and easy to spell, with no hyphens.** You'll say it out loud and type it on your phone.
- **A common ending.** The ending is called the TLD: `.com`, `.net`, `.dev` and so on. `.com` is the one people guess.

## Pick a registrar

A **registrar** sells you the domain and keeps it in your name, a year at a time. Look for:

- **Fair renewal prices.** Many charge far more to renew than for the first year. [TLD-List](https://tld-list.com) compares registrars for each ending.
- **Free WHOIS privacy.** It keeps your name and address out of the domain's public records.

### Lock it down

Once you've bought the domain:

- **Turn on auto-renew.** If the domain expires, your website and email stop working and someone else can buy the name.
- **Turn on two-factor login.** Whoever gets into this account controls your website and your email.
- **Keep the registrar lock on.** It stops the domain being moved to another registrar without you.
- **Log in with an email address that isn't on this domain.** If the domain lapses, you'd be locked out of your own password reset.

## Move DNS to Cloudflare

Your registrar runs DNS for your domain to start with. Moving it to [Cloudflare](https://developers.cloudflare.com/dns/) takes about ten minutes of work and up to a day of waiting. Follow Cloudflare's [full setup guide](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) and pick the **Free** plan when it asks.

## The records you'll use

DNS is a list of **records**: A and AAAA point a name at an address, CNAME at another name, MX says where email goes and TXT holds text. [DNS record types](/notes/dns-records/) explains each one. The name `@` means the bare domain. The TTL can stay on **Auto**.

### Proxied or DNS only

A, AAAA and CNAME records in [Cloudflare](https://developers.cloudflare.com/dns/) have a switch with an orange or grey cloud. **Proxied** (orange) sends visitors through Cloudflare, which hides your server's address but only carries web traffic. **DNS only** (grey) sends them straight to your server. [Proxied or DNS only](/notes/cloudflare-proxy/) covers the limits and when to use each.

## Recap

You now have:

- A domain in your name, with auto-renew, two-factor login and the registrar lock on.
- DNS on [Cloudflare](https://developers.cloudflare.com/dns/).
