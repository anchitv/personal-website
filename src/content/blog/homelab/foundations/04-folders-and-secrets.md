---
title: "Folders and secrets"
date: 2026-10-31
description: "The folder layout every service in this series uses and how to keep passwords out of compose files and git."
tags: ["homelab", "linux"]
draft: false
---

[[Part:running-containers]] installed [Podman](https://docs.podman.io/en/latest/). Before the first real service, here's where everything goes: the folder layout every service in this series uses and how services get their passwords without writing them into compose files.

## Lay out the folder

Every service in this series lives in one folder, `~/homelab`, laid out the same way:

```text
homelab/
├── whoami/                         one folder per service
│   └── compose.yaml
├── example/
│   ├── compose.yaml
│   └── data/                       config and data sit next to it
├── secrets/                        passwords and keys, never shared
│   └── example/
│       └── db_password
└── .gitignore
```

Why this layout:

- **It's in your home folder.** Rootless [Podman](https://docs.podman.io/en/latest/) runs as you, so your own folder is the natural home for it and you can edit every file without `sudo`.
- **One folder per service.** Each holds the service's compose file, so it can be started, stopped and updated on its own. In the next part, the folder's name also becomes the service's name in the commands that start it at boot.
- **Data lives next to the compose file.** Folders like `example/data/` are mounted into the containers, so everything a service keeps is in its folder. Backing up a service or moving it to a new computer means copying one folder.
- **Secrets get their own folder,** outside the services' folders. One line in `.gitignore` keeps them all out of [git](https://git-scm.com/) and one folder's permissions lock them all away. More on that next.

## Keep secrets in files

Services need passwords: for their databases, for signing logins, for talking to each other. Don't put them in compose files, which get copied, shared and pushed to GitHub. Environment variables aren't much better: `podman inspect` shows them and apps sometimes print them in their logs when something goes wrong.

Instead, every secret in this series is a file under `secrets/` that compose hands to the container. Say a service called `example` needs a database password. Make a random one:

```sh
mkdir -p ~/homelab/secrets/example
chmod 700 ~/homelab/secrets ~/homelab/secrets/example
openssl rand -base64 36 | tr -d '\n' > ~/homelab/secrets/example/db_password
```

[Container secrets as files](/notes/container-secrets/) explains each line, how the service's compose file hands the secret over and which permissions the file needs. Each post in this series says what its service needs and how it reads its secrets.

### Never commit secrets

Keeping your homelab folder in [git](https://git-scm.com/) is a good idea: you get a history of every change. Keep secrets and app data out of it with a [`.gitignore` file](/notes/container-secrets/#keep-secrets-out-of-git).

That's how [my homelab repo](https://github.com/anchitv/homelab) works. Every compose file and config is there, but none of the secrets.

## Recap

You now have:

- A folder layout that keeps each service and everything it stores in one place.
- A safe way to hand passwords to services and keep them out of [git](https://git-scm.com/).
