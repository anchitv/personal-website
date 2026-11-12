---
title: "Starting services at boot"
date: 2026-10-07
description: "Bring every service back after a reboot with one systemd file and start, stop or add a service with one command."
tags: ["homelab", "linux"]
draft: false
---

[[Part:running-containers]] installed [Podman](https://docs.podman.io/en/latest/), but containers you start by hand don't last. Rootless ones stop when you log out and a reboot stops them all, with nothing to start them again. This post fixes that with [systemd](https://wiki.archlinux.org/title/Systemd), the program that starts everything else on a Linux server. One file covers every service, so adding a service takes a single command.

## The unit file

[systemd](https://wiki.archlinux.org/title/Systemd) starts services from small text files called **units**. Create one:

```sh
sudo nano /etc/systemd/system/self-hosted@.service
```

Paste this in:

```ini title="/etc/systemd/system/self-hosted@.service"
[Unit]
Description=%I (Podman Compose)
After=network-online.target
Wants=network-online.target

[Service]
User=<your-username>
EnvironmentFile=-/home/<your-username>/homelab/%i/.env
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/<your-username>/homelab/%i

ExecStartPre=/usr/bin/podman compose down
ExecStart=/usr/bin/podman compose up -d
ExecStop=/usr/bin/podman compose down

TimeoutStartSec=120

[Install]
WantedBy=multi-user.target
```

**Replace `<your-username>`**, brackets included, with the name you log in with. Run `whoami` if you're not sure. It appears three times and the service won't start until all three are replaced. The commands also use [Podman](https://docs.podman.io/en/latest/)'s full path: `command -v podman` shows where yours is.

## What each part does

- **The `@` in the name** makes it a template. `self-hosted@whoami.service` is this same file with `whoami` filled in wherever `%i` appears, so `WorkingDirectory` becomes the `whoami` folder. A service's folder name is its name in every command below. `%I` is the same name, used in the description.
- **`After=` and `Wants=network-online.target`** wait for the network before starting.
- **`User=`** runs [Podman](https://docs.podman.io/en/latest/) as you, so the containers stay [rootless](/notes/rootless-podman/), just like when you start them by hand.
- **`EnvironmentFile=`** loads values that compose files can use, like `${DOMAIN}`, from the service's own `.env` file or from one shared file: see [below](#where-the-env-file-goes).
- **`Type=oneshot`** with **`RemainAfterExit=yes`**: `podman compose up -d` starts the containers and exits. `RemainAfterExit` tells [systemd](https://wiki.archlinux.org/title/Systemd) the service is still up after that. Without it, systemd would think the service had finished and run `ExecStop` straight away, taking the containers down again.
- **`ExecStartPre`** clears out anything left from an unclean shutdown, so every start is fresh. **`ExecStart`** brings the service up and **`ExecStop`** takes it down.
- **`TimeoutStartSec=120`** gives up if starting takes more than two minutes. The first start downloads images, which can take longer: run `podman compose pull` in the folder first or raise the limit.
- **`WantedBy=multi-user.target`** is what makes `enable` start the service at boot.

## Where the .env file goes

The line can point at one of two places:

- **A `.env` in each service's folder.** Put it at `homelab/whoami/.env` and so on, and keep the line as it is:
  ```ini title="/etc/systemd/system/self-hosted@.service"
  EnvironmentFile=-/home/<your-username>/homelab/%i/.env
  ```
  `%i` picks the folder of the service being started, so each service gets only its own values. This suits services that need different values. The `-` in front of the path means a missing file is fine: most services won't have one.
- **One `.env` for every service.** Put it at `homelab/.env` and change the line to:
  ```ini title="/etc/systemd/system/self-hosted@.service"
  EnvironmentFile=-/home/<your-username>/homelab/.env
  ```
  Every service gets the same values. This suits values they all use, like your domain or time zone, which then live in one place.

Keep passwords out of `.env` files: they belong in [secret files](/notes/container-secrets/).

## Load it

The unit relies on [linger](/notes/rootless-podman/#keeping-containers-running). Rootless [Podman](https://docs.podman.io/en/latest/) keeps its runtime files in `/run/user/<your user ID>`, a folder that otherwise only exists while you're logged in, and at boot nobody is. Linger keeps it there and keeps your containers running after you log out. Turn it on:

```sh
sudo loginctl enable-linger $USER
```

Then tell [systemd](https://wiki.archlinux.org/title/Systemd) about the new file:

```sh
sudo systemctl daemon-reload
```

## Try it

To try it, you need a service. Use the `whoami` compose file from [[part:running-containers]]. Make a folder for it and the file inside:

```sh
mkdir -p ~/homelab/whoami && cd ~/homelab/whoami
nano compose.yaml
```

Paste this in:

```yaml title="compose.yaml"
services:
  whoami:
    image: docker.io/traefik/whoami:latest
    container_name: whoami
    restart: always
    ports:
      - "8080:80"
```

Save with Ctrl+O and Enter, then leave [nano](https://wiki.archlinux.org/title/Nano) with Ctrl+X. Then start it through the unit, now and at every boot:

```sh
sudo systemctl enable --now self-hosted@whoami
```

Open `http://localhost:8080` to check that it's up. Then reboot:

```sh
reboot
```

Log back in and load the page again. `whoami` is back without you starting it.

## Everyday commands

```sh
sudo systemctl status self-hosted@whoami    # is it up?
sudo systemctl restart self-hosted@whoami   # down, then up again
sudo systemctl stop self-hosted@whoami      # take it down until the next boot
sudo systemctl disable self-hosted@whoami   # stop starting it at boot
sudo journalctl -u self-hosted@whoami       # what compose printed
systemctl list-units 'self-hosted@*'        # every service and its state
```

After editing a compose file, `restart` applies the change. `journalctl` only shows what compose printed while starting and stopping. For a container's own output, use `podman logs` as usual.

Any other service works the same way: make its folder, put its compose file in it and enable `self-hosted@<folder name>`. No new unit file and no reload.

`whoami` was only a test, so turn it off and stop it in one go:

```sh
sudo systemctl disable --now self-hosted@whoami
```

## Recap

You now have:

- One [systemd](https://wiki.archlinux.org/title/Systemd) file that starts every service at boot.
- One command to start, stop or restart a service or turn it on at boot.
- A way to add a service with no new setup.
