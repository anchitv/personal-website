---
title: "RallyLab"
description: "Open-source tennis match analysis you host yourself: record on your phone, analyse on your own GPU."
date: 2026-08-30
status: idea
tags: ["ai", "android", "dart", "flutter", "ios", "mobile", "python", "pytorch"]
draft: false
---

Record a tennis match on your phone, analyse it on your own computer, and review the stats and your technique in an app. Nothing goes to someone else's cloud, and there's no subscription.

It is early. The server runs from upload to results with a placeholder analysis step, and the app can record, upload and show those results. The computer vision that does the real analysis comes next.

## What it will do

- **Match stats.** From a phone video filmed on a tripod.
- **Technique.** A look at your strokes, not just the score.
- **Line calls.** Advisory only.
- **Court setup by hand.** You mark the court's corners once per session, and the camera stays put.
- **Any GPU.** One Docker Compose setup, with profiles for AMD, NVIDIA and Intel GPUs, or the CPU.
- **Self-hosted.** Anyone can run their own server, with user accounts. Apache-2.0 licensed.

## Built with

- Flutter and Dart, for one app on Android, iOS and the web
- Python and FastAPI for the server
- PyTorch for the analysis, on AMD (ROCm), NVIDIA (CUDA), Intel (XPU) or CPU
- Docker Compose for self-hosting
