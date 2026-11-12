---
title: "Container secrets as files"
date: 2026-10-31
description: "Keep passwords out of compose files: put each one in its own file and let compose hand it to the container."
topic: servers
aliases: ["Secrets", "chmod", "openssl rand", "/run/secrets", ".gitignore"]
links:
  - title: "Manage secrets securely in Docker Compose"
    url: https://docs.docker.com/compose/how-tos/use-secrets/
    about: "How compose turns a file into a secret at /run/secrets, with a worked example."
  - title: "postgres - Official Image"
    url: https://hub.docker.com/_/postgres
    about: "The image's own docs, whose Docker Secrets section covers POSTGRES_PASSWORD_FILE."
  - title: "Ignoring files"
    url: https://docs.github.com/en/get-started/git-basics/ignoring-files
    about: "How to set up a .gitignore and stop tracking a file you've already committed."
tags: ["homelab", "linux"]
draft: false
---

Services need passwords: for their databases, for signing logins, for talking to each other.

It's tempting to paste them straight into the [compose file](/notes/compose-basics/). Don't. Compose files get copied, shared and pushed to GitHub and passwords in them leak.

Instead, put every secret in its own file under a `secrets/` folder and let compose hand it to the container.

## Make a secret

Say a database needs a password. From the folder that holds your services' folders, make a random one:

```sh
mkdir -p secrets/example
chmod 700 secrets secrets/example
openssl rand -base64 36 | tr -d '\n' > secrets/example/db_password
chmod 444 secrets/example/db_password
```

Line by line:

- **`mkdir -p secrets/example`:** A folder for this service's secrets
  - `-p` also makes `secrets/` if it isn't there yet.
  - It doesn't complain if either folder exists already.
- **`chmod 700 secrets secrets/example`:** Only you can open the two folders
  - The 7 gives you, the owner, read, write and enter.
  - The two 0s give your group and everyone else nothing.
- **`openssl rand -base64 36 | tr -d '\n' > secrets/example/db_password`:** Makes the password and saves it
  - `openssl rand -base64 36` prints 36 random bytes as 48 characters: letters, digits, `+` and `/`.
  - `| tr -d '\n'` drops the line break at the end. Some apps would treat it as part of the password.
  - `>` writes the result to the file instead of the screen.
- **`chmod 444 secrets/example/db_password`:** Read-only for everyone
  - That includes you, so nothing changes it by accident.

Why is the file `444`, readable by everyone? [PostgreSQL](https://www.postgresql.org/about/) runs as its own user inside the container, which is a different user on the server, so a file only you can read is off limits to it.

The `700` folder still keeps other users on the server out. For images that run as root inside the container, `400` (only you) is enough.

## Hand it to the container

In the service's compose file, `example/compose.yaml`:

```yaml title="example/compose.yaml"
services:
  db:
    image: docker.io/library/postgres:16-alpine
    container_name: example-db
    restart: always
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - ./postgres:/var/lib/postgresql/data

secrets:
  db_password:
    file: ../secrets/example/db_password
```

From the bottom up:

- **The `secrets` block:** Names the file
  - Its path starts with `../` because `secrets/` sits beside the service's folder, not inside it.
- **The service:** Lists the secrets it gets
  - Each one shows up inside the container as a file at `/run/secrets/<name>`.
- **The app:** Reads them from there
  - Many images support this through settings that end in `_FILE`, like `POSTGRES_PASSWORD_FILE` above.

Check each image's docs for how it reads secrets.

## Keep secrets out of git

Keeping your compose files in [git](https://git-scm.com/) is a good idea: you get a history of every change. Keep secrets and app data out of it with a `.gitignore` file:

```text title=".gitignore"
# Passwords and keys
secrets/*/

# App data
example/postgres/
```
