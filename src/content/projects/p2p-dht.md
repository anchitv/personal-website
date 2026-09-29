---
title: "Peer-to-Peer Network"
description: "A small peer-to-peer network in Python that shares files using a distributed hash table."
date: 2020-05-10
status: archived
repo: "https://github.com/anchitv/P2P-Network"
tags: ["python", "networking", "university", "sockets", "udp", "tcp", "distributed-systems"]
draft: false
---

A university project where peers form a ring and share files without a central server.

## What it does

- Supports five actions:
  - Store data
  - Fetch data
  - Join the network
  - Leave cleanly
  - Recover when a peer drops out suddenly
- Peers check on their neighbours over UDP to see who is still online.
- Sends data over TCP so nothing gets lost.
- Spreads data across peers with a circular distributed hash table.

## Built with

- Python
- UDP and TCP sockets
- Threads
