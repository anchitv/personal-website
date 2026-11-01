---
title: "What Is a Homelab?"
date: 2026-10-30
description: "What a homelab is, why you might want one and what you need to start."
tags: ["homelab"]
draft: false
---

A homelab is a home‑based computer that runs a variety of services for you like photo backup, file sync, media streaming, ad‑blocking and more. Instead of relying on Google, Apple, Netflix or Dropbox, you host everything on hardware you own.

I self-host over 30 services. This series walks you through setting them up one by one, starting from scratch. No Linux or networking expertise is required. You just need a computer, patience and a willingness to experiment.

## Why run your own

- **Privacy** – Your data stays in your house, not on someone else’s servers.
- **Cost** – After the initial investment, the only ongoing expense is electricity.
- **Learning** – Gain hands‑on experience with Linux, networking, DNS and security, which helps you understand how things work online.
- **Fun** – There’s real joy in building something that works for you.

## Why you might not

A homelab isn’t for everyone. It is only fair to cover the other side.

- **Availability** – You’re the sole IT person; when something breaks, you’re the one who has to fix it, even late at night.
- **Time** – Setting up and maintaining services can take a few evenings and regular upkeep.
- **Reliability** – Without a cloud backup, a hardware failure can mean data loss.
- **Uptime** – Services only run while your computer is on and awake.
- **Electricity** – Continuous operation adds to your energy bill.
- **Convenience** – Commercial services handle most headaches for a fee.

Even if it all feels daunting, I still strongly encourage you to try it at least once.

## What you need

### A computer

The one you already use is the place to start, if it’s from the last ten years or so. If you later want a machine of its own, the usual choices:

- **An old laptop or desktop** – Free if you already own one. Laptops draw little power and their batteries can keep the system alive during brief outages.
- **A mini‑PC** – Compact, quiet devices powered by low‑power CPUs. They cost a few hundred dollars and consume little power, making them ideal for a fresh build.
- **A Raspberry Pi** – Inexpensive and tiny, but it runs an ARM CPU. While many services now support ARM, some do not and it can be sluggish on heavy workloads (e.g., photo processing).
- **Old enterprise servers** – Affordable second‑hand units, but large, noisy and power‑hungry. Fun for a hobbyist, but not ideal for a beginner.

What matters more than the brand:

- **Memory (RAM)** – Start with 8 GB as a minimum requirement; 16 GB or more gives room for heavier workloads like [Immich](https://github.com/immich-app/immich) and [Nextcloud](https://nextcloud.com/files/).
- **Storage** – Use an SSD for the OS and apps; add larger HDDs or SSDs later for photos and media.
- **Wired network** – Wi‑Fi works, but a wired connection is faster and more reliable for a machine that stays on.
- **Graphics card (optional)** – Only required for GPU‑intensive tasks (e.g., AI models).

### Power

Power usage is a key cost factor. A computer left on all the time consumes more energy than you might think.

```text
watts × 24 × 365 ÷ 1000 = kWh per year
```

A mini‑PC drawing ~15 W consumes ~131 kWh/year, costing roughly $40 for an entire year at 30¢/kWh. An old desktop averaging 60 W costs about four times as much. A cheap plug‑in power meter tells you what your machine really uses.

### A domain name (optional, later)

A [domain name](/notes/domain-names/) like `anchitverma.com` costs about $10–$20 a year. Optional, but useful if you want a custom URL.

### Patience

Most of the work involves reading, typing commands, fixing typos and troubleshooting. When something doesn’t work, the logs usually explain why.
