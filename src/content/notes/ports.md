---
title: "Ports"
date: 2026-10-31
description: "What a port is, the ones worth knowing and how compose files map them."
topic: networking
aliases: ["Port", "Listen", "Port mapping", "ss"]
links:
  - title: "Port (computer networking)"
    url: https://en.wikipedia.org/wiki/Port_(computer_networking)
    about: "How ports work and which ranges are set aside for what."
  - title: "Service Name and Transport Protocol Port Number Registry"
    url: https://www.iana.org/assignments/service-names-port-numbers
    about: "The official list of which port belongs to which service."
  - title: "ss(8)"
    url: https://man7.org/linux/man-pages/man8/ss.8.html
    about: "Every option of the command that shows what's listening."
tags: ["homelab", "linux"]
draft: false
---

An [IP address](/notes/ip-addresses/) gets data to the right device. A **port** gets it to the right program on that device. It's a number from 0 to 65535.

A program **listens** on a port and anything sent to that port goes to it. Only one program can listen on a port at a time.

A few you'll see all the time:

| Port | Used by |
|------|---------|
| 22 | SSH, logging in to a server |
| 53 | [DNS](/notes/dns/) |
| 80 | HTTP, websites without encryption |
| 443 | HTTPS, websites with encryption |

In a web address, the port comes after a colon: `http://192.168.1.10:8080` is port 8080 on `192.168.1.10`. Leave it out and the browser uses 80 for `http://` and 443 for `https://`.

Ports below 1024 are special: only root can listen on them. That's why [rootless](/notes/rootless-podman/) containers can't use them without extra setup.

## Ports in compose files

```yaml
ports:
  - "8080:80"
```

This line is a port mapping. It links a port on the server to a port in the container:

- **Left, `8080`:** The port on the server, the one you connect to
- **Right, `80`:** The port the program listens on inside the container

So anything that arrives at the server on `8080` goes to port `80` in the container.

Each container has its own set of ports, so two containers can both use port `80`. The server has only one set, so each container needs a different port there, like `8080` and `8081`.

To limit who can connect, put an address in front:

```yaml
ports:
  - "127.0.0.1:8080:80"
```

`127.0.0.1` always means "this computer". Now only the server itself can connect on `8080`. Other devices on your network can't reach it.

## What's listening

```sh
ss -tlnp
```

That lists every program listening for TCP connections, with its port. The options:

- **`-t`:** TCP
- **`-l`:** Only programs that are listening
- **`-n`:** Port numbers instead of names
- **`-p`:** The program

Before giving a new service a port, check that nothing has it:

```sh
ss -tlnp | grep :8080
```

No output means it's free.
