---
title: "CGNAT"
date: 2026-11-01
description: "Why port forwarding fails behind CGNAT, how to tell if you're behind it and what to do."
topic: networking
aliases: ["CGNAT", "Carrier-grade NAT", "Shared public address"]
links:
  - title: "Carrier-grade NAT"
    url: https://en.wikipedia.org/wiki/Carrier-grade_NAT
    about: "Why providers share addresses, the 100.64 range and why it breaks port forwarding."
  - title: "How NAT traversal works"
    url: https://tailscale.com/blog/how-nat-traversal-works
    about: "How Tailscale connects devices through NAT and CGNAT, for when you want the detail."
  - title: "One IP address, many users: detecting CGNAT to reduce collateral effects"
    url: https://blog.cloudflare.com/detecting-cgn-to-reduce-collateral-damage/
    about: "Why sharing a public address can get you blocked for someone else's behaviour."
tags: ["networking"]
draft: false
---

Some internet providers put many customers behind one shared public address. This is called **CGNAT**, [carrier-grade NAT](https://en.wikipedia.org/wiki/Carrier-grade_NAT). [Port forwarding](/notes/port-forwarding/) can't work behind it, because the public address isn't only yours.

To check, find the address the internet sees, then trace the path to it:

1. **Find your public address.** Open [ifconfig.me](https://ifconfig.me) in a browser, with any VPN turned off.
2. **Trace the path to it.** Run this, with your address in place of `<address>`:
   - **Windows:** `tracert -d -h 5 <address>`
   - **macOS:** `traceroute -n -m 5 <address>`
   - **Linux:** `tracepath -n -m 5 <address>`. On [Debian](https://www.debian.org/intro/about), install it first with `sudo apt install iputils-tracepath`.

Each line starts with the number of a stop on the way. Look for your public address:

- **At stop 1.** Your router has it, so you're not behind CGNAT.
- **At stop 2, after a `192.168.` address.** It's on a second box in your home, usually your provider's. You're not behind CGNAT, but forward ports on that box too.
- **Later or not at all.** It's at your provider, so you're probably behind CGNAT. You certainly are if a stop shows an address between `100.64.0.0` and `100.127.255.255`.

If stop 1 only shows `*`, your router doesn't answer traces. Check its status page instead, usually at `192.168.1.1` or `192.168.0.1`. If its `WAN` or `Internet` address matches your public address, you're not behind CGNAT.

Many providers will give you a public address if you ask, sometimes for a small fee. If yours won't, [Tailscale](https://tailscale.com/kb/1151/what-is-tailscale)'s hosted service still works behind CGNAT. Anything you only use at home works fine either way.
