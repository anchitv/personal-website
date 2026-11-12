---
title: "Setting up Podman"
date: 2026-09-28
description: "Install Podman on Debian or Arch, see why every service gets a compose file and how that carries over to Docker."
tags: ["homelab", "linux"]
draft: false
---

[[Part:choosing-how-to-run]] explained why this series runs its services with [Podman](https://docs.podman.io/en/latest/). This post installs it, then explains the compose files every service uses and how they carry over to [Docker](https://docs.docker.com/get-started/docker-overview/).

## Install Podman

Install [Podman](https://docs.podman.io/en/latest/) and `podman-compose`, which is what lets `podman compose` read compose files.

On [Debian](https://www.debian.org/intro/about), use Debian 13 or newer. Debian 12's Podman is too old for the `podman compose` command this series uses.

```sh
sudo apt update
sudo apt install podman podman-compose
```

On [Arch](https://wiki.archlinux.org/title/Arch_Linux):

```sh
sudo pacman -Syu podman podman-compose
```

`-Syu` updates the rest of the system first, which Arch expects before you install anything.

### Check that it works

The rest is the same on both systems. Run a test container:

```sh
podman run --rm docker.io/library/hello-world
```

You should see a message that starts with "Hello from [Docker](https://docs.docker.com/get-started/docker-overview/)!". That's just the image's text; [Podman](https://docs.podman.io/en/latest/) is running it. This series always writes image names in full, like `docker.io/library/hello-world`, because [Podman wants to know](/notes/rootless-podman/#coming-from-docker) which registry an image comes from.

If it fails with "no subuid ranges found", your user has no block of user numbers for [rootless containers](/notes/rootless-podman/#who-owns-the-files). Add one and tell Podman about it, then run the test again:

```sh
sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 $USER
podman system migrate
```

## Compose files

You can start a container with one long command. This one runs `whoami`, a small web server that replies with details about each request:

```sh
podman run -d --name whoami --restart always -p 8080:80 docker.io/traefik/whoami:latest
```

That works, but you have to remember it and type it again whenever you change something. A [compose file](/notes/compose-basics/) writes the same thing down once, in a text file called `compose.yaml`:

```yaml title="compose.yaml"
services:
  whoami:
    image: docker.io/traefik/whoami:latest
    container_name: whoami
    restart: always
    ports:
      - "8080:80"
```

`podman compose up -d`, run in the file's folder, starts everything in it. Every service in this series has a compose file, because:

- **The file is the setup.** Change a line and run the command again. Starting the service on a new computer is the same command.
- **Related containers stay together.** A service that needs a database lists both in one file and they start and stop together.
- **Apps publish them.** Most self-hosted apps give a compose file in their docs, so you can start from theirs.
- **They're easy to keep in [git](https://git-scm.com/).** You get a history of every change.

[Compose file basics](/notes/compose-basics/) explains each line and the commands you'll use most.

## Moving to or from Docker

Nothing here locks you in. [Podman](https://docs.podman.io/en/latest/) and [Docker](https://docs.docker.com/get-started/docker-overview/) run the same images, and compose files follow one standard, the [Compose Specification](https://compose-spec.io/), so the files in this series also run with `docker compose up -d`. A few things differ when you move a service across:

- **Podman-only settings.** Settings like `userns_mode: keep-id` only work on Podman. Remove them for Docker.
- **File ownership.** Rootless Podman shifts the [user numbers](/notes/rootless-podman/#who-owns-the-files) of files that containers write. Docker doesn't. After moving a service's data folder, you may need to `chown` it.
- **Ports below 1024.** Docker running as root can use them directly. Rootless Podman needs the extra setup described in the posts that use them.
- **Docker's socket.** Some tools, like dashboards and update checkers, talk to Docker through `/var/run/docker.sock`. Podman offers the same thing on a socket of its own, at `/run/user/<your user ID>/podman/podman.sock`, once you turn it on:
  ```sh
  systemctl --user enable --now podman.socket
  ```

Coming from Docker, with scripts that call `docker`? The `podman-docker` package adds a `docker` command that runs Podman.

On [Debian](https://www.debian.org/intro/about):

```sh
sudo apt install podman-docker
```

On [Arch](https://wiki.archlinux.org/title/Arch_Linux):

```sh
sudo pacman -S podman-docker
```

Two more ways out, if you outgrow compose: [`podman kube generate`](https://docs.podman.io/en/stable/markdown/podman-kube-generate.1.html) turns running containers into files for [Kubernetes](https://kubernetes.io/docs/concepts/overview/), and [Quadlet](https://docs.podman.io/en/stable/markdown/podman-systemd.unit.5.html) runs containers as [systemd](https://wiki.archlinux.org/title/Systemd) services, without compose.

## Recap

You now have:

- [Podman](https://docs.podman.io/en/latest/) installed, on [Debian](https://www.debian.org/intro/about) or [Arch](https://wiki.archlinux.org/title/Arch_Linux).
- An idea of what compose files are and why every service in this series has one.
- A way to move to or from [Docker](https://docs.docker.com/get-started/docker-overview/) if you ever want to.
