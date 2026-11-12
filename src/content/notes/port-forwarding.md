---
title: "Port forwarding"
date: 2026-10-12
description: "How to let the internet reach a server at home, the risk that comes with it and the alternative."
topic: networking
aliases: ["Port forwarding"]
links:
  - title: "Port forwarding"
    url: https://en.wikipedia.org/wiki/Port_forwarding
    about: "How a router passes incoming connections to one device and what people use it for."
  - title: "How Tailscale works"
    url: https://tailscale.com/blog/how-tailscale-works
    about: "How the private-network approach connects your devices without opening any ports."
tags: ["networking"]
draft: false
---

Your router blocks connections that start on the internet. That's good: it's why nobody can reach your laptop directly. It also means you can't reach a server at home when you're away.

There are two ways around that:

- **Port forwarding**
  - You tell the router to send anything that arrives on, say, port 443 to `192.168.1.10`.
  - Now anyone on the internet can reach that [port](/notes/ports/) on your server.
- **A private network for your own devices**
  - Your phone and laptop join a private network with your server, from anywhere.
  - Nobody else can reach your services.
  - [Tailscale](https://tailscale.com/kb/1151/what-is-tailscale) and [Headscale](https://headscale.net/stable/) work this way.

Port forwarding is the riskier one. "Anyone" includes bots that scan the whole internet for weak spots all day, every day.

If you forward ports, forward as few as you can and only to services that sit behind a login. A homelab can get by with two:

- **`443`:** For a reverse proxy
  - A reverse proxy like [Caddy](https://caddyserver.com/docs/) is the front door to every web service.
- **One UDP port:** For Headscale, which runs the private network

Port forwarding needs a public address of your own, so it doesn't work behind [CGNAT](/notes/cgnat/).
