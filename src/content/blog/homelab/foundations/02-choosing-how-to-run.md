---
title: "Choosing how to run services"
date: 2026-10-30
description: "The ways to run services on your own computer, their pros and cons, and why this series uses Podman."
tags: ["homelab", "linux"]
draft: false
---

[[Part:what-is-a-homelab]] covered the hardware. Now your computer needs a way to run services and there are several. They differ in how well they keep services apart, how much memory and upkeep they cost and how many apps support them out of the box. This post compares them and explains why this series uses [Podman](https://docs.podman.io/en/latest/).

## The options

### At a glance

<table class="compare" aria-labelledby="at-a-glance">
<thead>
<tr><th scope="col">Option</th><th scope="col">Keeps apps apart</th><th scope="col">Memory and upkeep</th><th scope="col">Apps ready to go</th></tr>
</thead>
<tbody>
<tr><th scope="row"><a class="link-jump" href="#directly-on-the-system"><span class="link-end">Directly on system</span></a> <span class="compare-links"><a class="link-external" href="https://wiki.debian.org/Apt"><span class="link-end">Debian</span><span class="visually-hidden"> (external site)</span></a> · <a class="link-external" href="https://wiki.archlinux.org/title/Pacman"><span class="link-end">Arch</span><span class="visually-hidden"> (external site)</span></a></span></th><td data-label="Keeps apps apart"><span class="rating rating-bad">None</span></td><td data-label="Memory and upkeep"><span class="rating rating-good">Low</span></td><td data-label="Apps ready to go"><span class="rating rating-mid">Some</span></td></tr>
<tr><th scope="row"><a class="link-jump" href="#virtual-machines"><span class="link-end">Virtual machines</span></a> <span class="compare-links"><a class="link-external" href="https://www.proxmox.com/en/products/proxmox-virtual-environment/get-started"><span class="link-end">Proxmox</span><span class="visually-hidden"> (external site)</span></a> · <a class="link-external" href="https://wiki.debian.org/KVM"><span class="link-end">Debian</span><span class="visually-hidden"> (external site)</span></a> · <a class="link-external" href="https://wiki.archlinux.org/title/Libvirt"><span class="link-end">Arch</span><span class="visually-hidden"> (external site)</span></a></span></th><td data-label="Keeps apps apart"><span class="rating rating-good">Strong</span></td><td data-label="Memory and upkeep"><span class="rating rating-bad">High</span></td><td data-label="Apps ready to go"><span class="rating rating-bad">Few</span></td></tr>
<tr><th scope="row"><a class="link-jump" href="#system-containers-lxc-and-incus"><span class="link-end">System containers</span></a> <span class="compare-links"><a class="link-external" href="https://linuxcontainers.org/incus/docs/main/installing/"><span class="link-end">Incus</span><span class="visually-hidden"> (external site)</span></a></span></th><td data-label="Keeps apps apart"><span class="rating rating-good">Strong</span></td><td data-label="Memory and upkeep"><span class="rating rating-mid">Medium</span></td><td data-label="Apps ready to go"><span class="rating rating-bad">Few</span></td></tr>
<tr><th scope="row"><a class="link-jump" href="#docker"><span class="link-end">Docker</span></a> <span class="compare-links"><a class="link-external" href="https://docs.docker.com/engine/install/debian/"><span class="link-end">Debian</span><span class="visually-hidden"> (external site)</span></a> · <a class="link-external" href="https://wiki.archlinux.org/title/Docker"><span class="link-end">Arch</span><span class="visually-hidden"> (external site)</span></a></span></th><td data-label="Keeps apps apart"><span class="rating rating-mid">Fair</span></td><td data-label="Memory and upkeep"><span class="rating rating-good">Low</span></td><td data-label="Apps ready to go"><span class="rating rating-good">Most</span></td></tr>
<tr><th scope="row"><a class="link-jump" href="#podman"><span class="link-end">Podman</span></a> <span class="compare-links"><a class="link-external" href="https://podman.io/docs/installation#debian"><span class="link-end">Debian</span><span class="visually-hidden"> (external site)</span></a> · <a class="link-external" href="https://wiki.archlinux.org/title/Podman"><span class="link-end">Arch</span><span class="visually-hidden"> (external site)</span></a></span></th><td data-label="Keeps apps apart"><span class="rating rating-good">Strong</span></td><td data-label="Memory and upkeep"><span class="rating rating-good">Low</span></td><td data-label="Apps ready to go"><span class="rating rating-good">Most</span></td></tr>
<tr><th scope="row"><a class="link-jump" href="#kubernetes"><span class="link-end">Kubernetes</span></a> <span class="compare-links"><a class="link-external" href="https://docs.k3s.io/quick-start"><span class="link-end">k3s</span><span class="visually-hidden"> (external site)</span></a></span></th><td data-label="Keeps apps apart"><span class="rating rating-mid">Fair</span></td><td data-label="Memory and upkeep"><span class="rating rating-bad">High</span></td><td data-label="Apps ready to go"><span class="rating rating-mid">Some</span></td></tr>
<tr><th scope="row"><a class="link-jump" href="#a-homelab-operating-system"><span class="link-end">Homelab OS</span></a> <span class="compare-links"><a class="link-external" href="https://unraid.net/"><span class="link-end">Unraid</span><span class="visually-hidden"> (external site)</span></a> · <a class="link-external" href="https://www.truenas.com/truenas-community-edition/"><span class="link-end">TrueNAS</span><span class="visually-hidden"> (external site)</span></a> · <a class="link-external" href="https://casaos.zimaspace.com/"><span class="link-end">CasaOS</span><span class="visually-hidden"> (external site)</span></a></span></th><td data-label="Keeps apps apart"><span class="rating rating-mid">Fair</span></td><td data-label="Memory and upkeep"><span class="rating rating-good">Low</span></td><td data-label="Apps ready to go"><span class="rating rating-good">Most</span></td></tr>
</tbody>
</table>

### Directly on the system

Install each app with the system's package manager, `apt` on [Debian](https://www.debian.org/intro/about) or `pacman` on [Arch](https://wiki.archlinux.org/title/Arch_Linux), or from the app's own download.

#### Pros

- **Nothing extra.** No new tool to learn and nothing between the apps and the hardware.

#### Cons

- **Clashes.** Apps share the system's libraries, so two apps that need different versions clash.
- **Hard to remove.** Each app spreads its files across the system, which makes it hard to back up, move or remove.
- **Missing packages.** Many self-hosted apps aren't packaged for your system or only in an old version.

### Virtual machines

A virtual machine (VM) is a whole computer simulated in software, running its own operating system. [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview) is a server operating system built for them, which replaces what's on the server. [KVM](https://wiki.archlinux.org/title/KVM) adds them to the system you have.

#### Pros

- **Strongest separation.** Each VM has its own kernel, so a problem in one stays there.
- **Any system.** A VM can run Windows or [Home Assistant OS](https://www.home-assistant.io/installation/).
- **Snapshots.** Undo a bad update by rolling the VM back.

#### Cons

- **Heavy.** Every VM runs a full operating system, with its own share of memory and disk.
- **More upkeep.** Each VM is one more system to update.
- **Hardware takes work.** Handing a VM a graphics card or a disk takes extra setup.

### System containers: LXC and Incus

A system container shares the computer's kernel, but otherwise acts like a small separate Linux machine. [Incus](https://linuxcontainers.org/incus/docs/main/) manages them and [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview) runs them too.

#### Pros

- **Light.** Much lighter than a VM and starts in seconds.

#### Cons

- **Still a whole system.** Each one is a Linux system to keep updated.
- **Apps by hand.** Apps don't ship as system containers, so inside one you install them as you would directly on the system.

### Docker

[Docker](https://docs.docker.com/get-started/docker-overview/) runs application [containers](/notes/containers/): each one holds a single app and what it needs, nothing more. Almost every self-hosted app publishes a ready-made Docker image and most give a compose file to start it with.

#### Pros

- **Biggest ecosystem.** Almost every app's docs and most guides assume Docker.
- **Light.** Containers share the computer's kernel and start in seconds.

#### Cons

- **Runs as root.** Containers are run by a background service, the Docker daemon, which runs as root, the all-powerful admin user. Anyone who can run `docker` commands can take over the server.
- **Rootless is extra work.** A [rootless mode](https://docs.docker.com/engine/security/rootless/) exists, but it isn't the default and takes extra setup.

### Podman

[Podman](https://docs.podman.io/en/latest/) runs the same images and reads the same compose files as [Docker](https://docs.docker.com/get-started/docker-overview/). It has no background service and runs containers [rootless](/notes/rootless-podman/): as your normal user, not as root.

#### Pros

- **Safer by default.** Someone who broke out of a container would only have your user's rights.
- **Works like Docker.** Commands match Docker's, so guides written for Docker work with small changes.

#### Cons

- **Low ports need setup.** Ports below 1024, like 80 and 443 for websites, need extra setup.
- **Stops when you log out.** Containers stop when you log out, unless you set them up to stay.
- **Compose through a helper.** Compose files go through a separate tool, [podman-compose](https://github.com/containers/podman-compose), which lacks some [Docker Compose](https://docs.docker.com/compose/) features.
- **Fewer guides.** Most are written for Docker.

### Kubernetes

[Kubernetes](https://kubernetes.io/docs/concepts/overview/) runs containers across a group of servers and moves them when one fails. [k3s](https://docs.k3s.io/) is a small version of it that suits a home server.

#### Pros

- **Built for many machines.** Services keep running when a server fails.
- **A work skill.** Worth learning if your job uses it.

#### Cons

- **A lot to learn.** Far more moving parts than one computer needs.
- **Setup by hand.** Most apps document a compose file first, so you often write the Kubernetes setup yourself.

### A homelab operating system

[Unraid](https://docs.unraid.net/unraid-os/getting-started/what-is-unraid/), [TrueNAS](https://www.truenas.com/truenas-community-edition/) and [CasaOS](https://casaos.zimaspace.com/) give you a web page with an app store: pick an app and it installs. Under the hood they run [Docker](https://docs.docker.com/get-started/docker-overview/) containers. Unraid and TrueNAS replace the server's operating system. CasaOS installs on top of [Debian](https://www.debian.org/intro/about).

#### Pros

- **Quickest start.** Little or no typing.
- **Disks and VMs.** Unraid and TrueNAS also manage lots of disks well and can run VMs.

#### Cons

- **Their way.** You do things the way the system wants. When something breaks, it's harder to see why.
- **Cost.** Unraid is paid.

These mix, too: plenty of homelabs run [Proxmox](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview), with containers inside a VM.

## Why Podman

This series runs every service in a container, with [Podman](https://docs.podman.io/en/latest/).

**Containers,** because apps don't fight over libraries, each one is set up from a text file and removing one leaves nothing behind. Almost every app ships an image and containers are light enough to run dozens on one PC. VMs and [Kubernetes](https://kubernetes.io/docs/concepts/overview/) add upkeep that one home server doesn't need.

**Podman,** because it runs the same containers as [Docker](https://docs.docker.com/get-started/docker-overview/) without a daemon running as root. If someone breaks into one service, rootless containers keep them from taking over the server. Podman also works well with [systemd](https://wiki.archlinux.org/title/Systemd), the program that starts everything on a Linux server, which a later part uses to start every service at boot.

If you know Docker already, everything here carries over: `docker` becomes `podman`. The next part installs Podman and shows how its compose files carry over to Docker if you ever switch.

## Recap

You now have:

- A picture of the ways to run services, with their pros and cons.
- The reasons this series runs services in containers, with [Podman](https://docs.podman.io/en/latest/).
