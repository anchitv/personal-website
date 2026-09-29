---
title: "Nine-Board Tic-Tac-Toe"
description: "A Prolog agent that plays nine-board tic-tac-toe."
date: 2019-05-01
status: archived
repo: "https://github.com/anchitv/9-Board-Tic-Tac-Toe"
tags: ["prolog", "ai", "artificial-intelligence", "games", "university", "minimax", "alpha-beta-pruning"]
draft: false
---

A game-playing agent written with Firzad Ahammed for COMP9414 (Artificial Intelligence) at UNSW. The base code came from the course.

## What it does

- Plays tic-tac-toe on nine small boards laid out in a 3×3 grid.
- Looks up to 5 moves ahead to pick the best move (minimax).
- Skips moves that can't change the result (alpha-beta pruning).
- Scores each board by how close each player is to three in a row.

## Built with

- Prolog
- Minimax search with alpha-beta pruning
