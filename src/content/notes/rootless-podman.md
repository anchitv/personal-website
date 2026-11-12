---
title: "Rootless Podman"
date: 2026-09-24
description: "Why Podman runs containers as your own user, what changes if you know Docker, how to keep containers running when you're not logged in and who owns the files they write."
topic: servers
aliases: ["Podman", "Rootless containers", "Docker", "podman-compose", "Linger", "Restart policy", "restart: always", "unless-stopped", "User namespace", "keep-id", "userns_mode", "podman unshare", "/etc/subuid"]
links:
  - title: "Shortcomings of Rootless Podman"
    url: https://github.com/podman-container-tools/podman/blob/main/rootless.md
    about: "What rootless containers can't do and how to open ports below 1024."
  - title: "Container image short names in Podman"
    url: https://www.redhat.com/en/blog/container-image-short-names
    about: "Why Podman wants the full image name and the risk of pulling from the wrong registry."
  - title: "podman-compose"
    url: https://docs.podman.io/en/stable/markdown/podman-compose.1.html
    about: "How podman compose hands your compose file to docker-compose or podman-compose."
  - title: "podman-run: restart policy"
    url: https://docs.podman.io/en/stable/markdown/podman-run.1.html#restart-policy
    about: "Each restart policy explained, plus the podman-restart.service that acts on them at boot."
  - title: "systemd/User"
    url: https://wiki.archlinux.org/title/Systemd/User#Automatic_start-up_of_systemd_user_instances
    about: "What lingering does and how it lets your user's services start at boot without a login."
  - title: "podman-run: --userns"
    url: https://docs.podman.io/en/stable/markdown/podman-run.1.html#userns-mode
    about: "Every user namespace mode, including keep-id and its options."
  - title: "podman-unshare"
    url: https://docs.podman.io/en/stable/markdown/podman-unshare.1.html
    about: "Run a command with the same user IDs a container sees."
tags: ["homelab", "linux"]
draft: false
---

[Docker](https://docs.docker.com/get-started/docker-overview/) is the best-known tool for running [containers](/notes/containers/). **[Podman](https://docs.podman.io/en/latest/)** runs the same images and reads the same compose files, with one big difference: it runs **rootless**.

Docker normally runs as root, the all-powerful admin user. Rootless Podman runs containers as your normal user. Even if someone broke out of a container, they would only have your user's rights, not the whole machine's.

## Coming from Docker

Everything carries over: `docker` becomes `podman`, and compose files work almost unchanged. A few differences show up in practice:

- **Full image names**
  - [Podman](https://docs.podman.io/en/latest/) wants to know which registry an image comes from.
  - Write `docker.io/library/postgres`, not `postgres`.
- **Compose needs a helper**
  - On [Debian](https://www.debian.org/intro/about) and [Ubuntu](https://ubuntu.com/server), the `podman-compose` package is what lets `podman compose` read compose files.
- **Containers stop when you log out**
  - They belong to your user.
  - They need [a little setup](#keeping-containers-running) to keep running and to come back after a reboot.
- **No ports below 1024**
  - Rootless containers can't use them by default.
  - A service that needs 53, 80 or 443 takes extra setup.

## Keeping containers running

Rootless containers belong to your user. By default, Linux stops your user's programs when you log out and doesn't start them at boot. Two commands fix that:

```sh
sudo loginctl enable-linger $USER
systemctl --user enable podman-restart.service
```

The first, called **linger**, keeps your containers running when you're not logged in. The second starts them again after a reboot.

### Which restart policy to use

There is a catch. Check your [Podman](https://docs.podman.io/en/latest/) version:

```sh
podman --version
```

From Podman 5.8, the restart service brings back containers set to `restart: always` or `restart: unless-stopped`. Older versions only bring back `always`.

[Debian](https://www.debian.org/intro/about) 13 ships Podman 5.4. So on anything older than 5.8, use `restart: always` in every compose file.

## Who owns the files

Every user on Linux is really a number and files belong to numbers. Rootless [Podman](https://docs.podman.io/en/latest/) gives each container its own set of numbers, called a user namespace, mapped onto yours:

- **Root inside the container**
  - It's you outside it.
- **Every other user inside**
  - It maps onto a block of numbers set aside for you, listed in `/etc/subuid`.

Check your block:

```sh
grep $USER /etc/subuid
```

A line like `you:100000:65536` means container users 1, 2, 3 and up become 100000, 100001, 100002 and up outside the container.

### When it bites

Many images run their app as a user of their own, say 10001. Outside the container, that's user 110000. So:

- **It can't write to folders you made**
  - They belong to you, which inside the container is root, not 10001.
- **Files it writes look strange from outside**
  - `ls -l` shows them owned by `110000`.

### Give a folder to the container's user

`podman unshare` runs a command with the same numbers a container sees. So this gives `models/` to the container's user 10001:

```sh
podman unshare chown 10001:10001 models
```

Plain `sudo chown 10001` would be wrong: outside the container, 10001 is someone else.

### Or keep your own number: keep-id

`userns_mode: keep-id` in a compose file maps your user to the same number inside the container.

If the image's user has your number, usually 1000 (`id -u` shows yours), then you and that user are the same on both sides. Files it creates in a shared folder are simply yours.

This suits containers that work on your own files, like a container for coding agents.
