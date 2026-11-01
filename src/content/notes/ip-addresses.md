---
title: "IP addresses"
date: 2026-10-31
description: "What an IP address is, private versus public, how to find yours and how to keep a server's fixed."
topic: networking
aliases: ["IP address", "IPv4", "Private address", "Public address", "ipconfig", "DHCP", "DHCP reservation", "Static IP address"]
links:
  - title: "What is my IP address?"
    url: https://www.cloudflare.com/learning/dns/glossary/what-is-my-ip-address/
    about: "What an IP address does, IPv4 versus IPv6 and why your address can change."
  - title: "ip"
    url: https://wizardzines.com/comics/ip/
    about: "A one-page comic on Linux's ip command, showing where your address appears."
  - title: "Private network"
    url: https://en.wikipedia.org/wiki/Private_network
    about: "The three private address ranges and how a router lets them share one public address."
  - title: "About DHCP"
    url: https://ubuntu.com/server/docs/explanation/networking/about-dhcp/
    about: "What DHCP hands out, how leases expire and how a server pins an address to a device."
tags: ["networking"]
draft: false
---

Every device on a network has an IP address: four numbers like `192.168.1.20`. It works like a street address. It tells other devices where to send data.

## Private and public

- **Private addresses** only work inside your home. They start with `192.168.`, `10.` or `172.16.` to `172.31.`. Your laptop, phone and server each get one.
- **A public address** is what the internet sees. Your router has one and every device in your house shares it when talking to the internet. To see yours, open [ifconfig.me](https://ifconfig.me).

## Find a device's private address

- **Linux:** run `ip -4 addr` and look for the `inet` line under your network card, which has a name like `enp1s0` or `eth0`.
- **macOS:** System Settings → Wi-Fi (or Network) → Details.
- **Windows:** run `ipconfig` and look for "IPv4 Address".

## Keep a server's address fixed

The router hands out private addresses automatically, using something called [DHCP](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol). A device can get a different one next time it connects. That's fine for a phone. It is not fine for a server that everything else points at.

The fix is a **DHCP reservation**: you tell the router to always give one device the same address. It's the easiest way to give a server a static IP address.

Every router has this setting. To use it:

1. **Note the router's address.** Run `ip route`. It's the address after `default via`, often `192.168.1.1`.
2. **Open the router's settings.** Type the router's address into a browser and log in. The password is often on a sticker on the router.
3. **Reserve the address.** Look under LAN, DHCP or Address reservation. Pick the server from the list of connected devices and reserve the address you found in [Find a device's private address](#find-a-devices-private-address).
