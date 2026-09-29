---
title: "Wiretap"
description: "A spy-themed party word game for iOS and Android."
date: 2026-08-01
status: active
url: "https://phyxgames.com/wiretap/"
appStore: "https://apps.apple.com/us/app/wiretap-spy-party-word-game/id6761165429"
playStore: "https://play.google.com/store/apps/details?id=com.phyxgames.wiretap"
tags: ["dart", "flutter", "games", "mobile", "ios", "android"]
draft: false
---

A word game for two teams, played on phones in the same room or online. It is inspired by the board game Decrypto.

## How to play

- Each team has four secret words, numbered 1 to 4.
- Each round, one player gets a secret code, like 4-1-3.
- They give one clue for each number. If word 4 is "ocean", the clue might be "waves".
- Their team guesses the code from the clues. The other team tries to guess it too.
- The trick is giving clues your team will get but the other team won't.
- Guess the other team's codes to win. Get your own team's codes wrong and you lose.

## What it does

- **Local play over mDNS.** The host's phone runs a WebSocket server and advertises it over mDNS, so nearby phones find the game on the same Wi-Fi. No internet needed.
- **Online play.** A lightweight cloud relay passes messages between phones. Local and online run the same game code.
- **Reconnects.** A bot fills a dropped player's seat until they rejoin. Online hosts can restart the app and resume the game.
- **Bots.** Bots run offline, using compressed word vectors to give and guess clues. Harder bots use more dimensions and less random noise.
- **Stats and achievements.** 25 achievements sync to Game Center and Google Play Games. Progress works offline and is backed up with cloud save.

## Built with

- Flutter and Dart
- WebSockets and mDNS for local play
- A TypeScript cloud relay for online play
- Python to build the bots' word data
- Game Center and Google Play Games
