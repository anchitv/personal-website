---
title: "Containers"
date: 2026-10-30
description: "What a container is and why self-hosted apps run in them."
topic: servers
aliases: ["Container"]
links:
  - title: "What is a container?"
    url: https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/
    about: "How containers differ from virtual machines, plus a first container to run yourself."
  - title: "What even is a container: namespaces and cgroups"
    url: https://jvns.ca/blog/2016/10/10/what-even-is-a-container/
    about: "Julia Evans on the Linux features that make a container, with commands to try."
  - title: "Getting Started with Podman"
    url: https://podman.io/docs
    about: "Pull an image, run a web server and check its logs with Podman, step by step."
tags: ["homelab", "linux"]
draft: false
---

A container is a box holding one app and everything it needs: the right versions of its libraries, its settings, its web server. Containers share the server's Linux kernel, but each one gets its own files and can't see the others'.

That makes them a good fit for running lots of apps on one server:

- **Apps don't fight.** Two apps that need different versions of the same library each bring their own.
- **Setup is a text file.** You describe a service once in a [compose file](/notes/compose-basics/) and can recreate it anywhere.
- **Removing an app is clean.** Delete its container and folder and it's gone, with nothing scattered across the system.

[Docker](https://docs.docker.com/get-started/docker-overview/) and [Podman](/notes/rootless-podman/) are the usual tools for running them.
