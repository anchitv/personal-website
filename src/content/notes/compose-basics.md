---
title: "Compose file basics"
date: 2026-10-31
description: "What each line of a compose file means and the commands you'll use most."
topic: servers
aliases: ["Compose file", "compose.yaml", "Docker Compose", "podman compose", "Image", "Bind mount", "Volumes"]
links:
  - title: "Compose file reference: services"
    url: https://docs.docker.com/reference/compose-file/services/
    about: "Every setting a service can have, with examples."
  - title: "docker compose"
    url: https://docs.docker.com/reference/cli/docker/compose/
    about: "Every compose command and its options. With Podman, swap docker for podman."
  - title: "podman-compose"
    url: https://docs.podman.io/en/stable/markdown/podman-compose.1.html
    about: "How podman compose hands your file to a compose provider."
tags: ["homelab", "linux"]
draft: false
---

A compose file describes one or more [containers](/notes/containers/) in a text file called `compose.yaml`: which image to run, which ports to open and which folders to keep. Here's the one from [Setting up Podman](/blog/homelab/running-containers/):

```yaml title="compose.yaml"
services:
  whoami:
    image: docker.io/traefik/whoami:latest
    container_name: whoami
    restart: always
    ports:
      - "8080:80"
```

Line by line:

- **`services:`** starts the list of containers. Each one is a service.
- **`whoami:`** is this service's name inside the file.
- **`image:`** is what to run, in three parts:
  - **`docker.io`** is where it comes from.
  - **`traefik/whoami`** is its name.
  - **`latest`** is the version, called a tag. It means whatever is newest, while a number like `v1.10` pins one version.
- **`container_name:`** is the name to use in commands like `podman logs whoami`.
- **`restart: always`** brings the container back if it crashes and after a reboot. See [keeping containers running](/notes/rootless-podman/#keeping-containers-running).
- **`ports:`** sends the server's port 8080 to port 80 in the container. See [ports](/notes/ports/).

Indentation matters: two spaces per level, never tabs.

## Lines you'll meet next

```yaml
volumes:
  - ./data:/app/data
  - ./config.yaml:/app/config.yaml:ro
environment:
  TZ: Etc/UTC
```

- **`volumes:`** puts folders or files from the server inside the container, called bind mounts. They keep a service's data when the container is removed.
  - **The left side** is the path on the server. `./` means the folder `compose.yaml` is in.
  - **The right side** is the path inside the container.
  - **`:ro`** at the end makes it read-only.
  - **`:Z`** at the end is for systems that use SELinux, like Fedora.
- **`environment:`** sets the service's settings. Each image's docs list which it reads. Passwords don't go here: see [secrets as files](/notes/container-secrets/).

## Commands

Run these in the folder that holds `compose.yaml`. With [Docker Compose](https://docs.docker.com/compose/), write `docker` in place of `podman`:

```sh
podman compose up -d      # create and start everything, in the background
podman compose ps         # what's running
podman compose logs -f    # follow what the containers print; Ctrl+C stops
podman compose down       # stop and remove the containers; volumes stay
podman compose pull       # download newer images
```

After editing the file or after `pull`, run `podman compose up -d` again to recreate the containers with the change.
