---
title: "Quantisation"
date: 2026-11-08
description: "How a model's files trade size for quality, what names like Q4_K_M mean and how big a file will be."
topic: ai
aliases: ["Quantisation", "GGUF", "K-quant", "I-quant", "mmproj"]
links:
  - title: "GGUF"
    url: https://huggingface.co/docs/hub/gguf
    about: "What a GGUF file holds, with a table of every quantisation type."
  - title: "llama.cpp: perplexity and KL divergence"
    url: https://github.com/ggml-org/llama.cpp/blob/master/tools/perplexity/README.md
    about: "How far each quantisation level moves a model's answers, measured on Llama 3 8B."
tags: ["ai", "homelab"]
draft: false
---

A model is billions of numbers, called weights. Most labs publish each one in 16 bits. **Quantisation** stores them in fewer bits, like saving a photo at a lower quality. The file gets much smaller and the model a little worse.

**[GGUF](https://huggingface.co/docs/hub/gguf)** is the file format of [llama.cpp](https://github.com/ggml-org/llama.cpp) and the programs built on it, like [Ollama](https://github.com/ollama/ollama) and [LM Studio](https://lmstudio.ai/docs/app). On [Hugging Face](https://huggingface.co/docs/hub/index), a model's GGUF copy has a file for each level. The end of its name gives the level, like `UD-Q4_K_XL`.

[Understanding models on Hugging Face](/notes/hugging-face-models/) explains the rest of the name. [Choosing an open model](/notes/choosing-models/) helps you pick a file for your computer.

## Levels

The fewer bits a level uses, the smaller the file and the worse the model's answers.

<table class="compare" aria-labelledby="levels">
<thead>
<tr><th scope="col">Level</th><th scope="col">Size</th><th scope="col">Quality</th></tr>
</thead>
<tbody>
<tr><th scope="row"><code>BF16</code> <span class="compare-links">16 bits</span></th><td data-label="Size"><span class="rating rating-bad">Large</span></td><td data-label="Quality"><span class="rating rating-good">High</span></td></tr>
<tr><th scope="row"><code>Q8_0</code> <span class="compare-links">8.5 bits</span></th><td data-label="Size"><span class="rating rating-bad">Large</span></td><td data-label="Quality"><span class="rating rating-good">High</span></td></tr>
<tr><th scope="row"><code>Q6_K</code> <span class="compare-links">6.6 bits</span></th><td data-label="Size"><span class="rating rating-mid">Medium</span></td><td data-label="Quality"><span class="rating rating-good">High</span></td></tr>
<tr><th scope="row"><code>Q5_K_M</code> <span class="compare-links">5.7 bits</span></th><td data-label="Size"><span class="rating rating-mid">Medium</span></td><td data-label="Quality"><span class="rating rating-good">High</span></td></tr>
<tr><th scope="row"><code>Q4_K_M</code> <span class="compare-links">4.9 bits</span></th><td data-label="Size"><span class="rating rating-good">Small</span></td><td data-label="Quality"><span class="rating rating-mid">Medium</span></td></tr>
<tr><th scope="row"><code>IQ4_XS</code> <span class="compare-links">4.4 bits</span></th><td data-label="Size"><span class="rating rating-good">Small</span></td><td data-label="Quality"><span class="rating rating-mid">Medium</span></td></tr>
<tr><th scope="row"><code>Q3_K_M</code> <span class="compare-links">4.0 bits</span></th><td data-label="Size"><span class="rating rating-good">Small</span></td><td data-label="Quality"><span class="rating rating-bad">Low</span></td></tr>
<tr><th scope="row"><code>Q2_K</code> <span class="compare-links">3.2 bits</span></th><td data-label="Size"><span class="rating rating-good">Small</span></td><td data-label="Quality"><span class="rating rating-bad">Low</span></td></tr>
</tbody>
</table>

Each figure is an average for the whole file. In `Q4_K_M`, most weights get [4.5 bits](https://huggingface.co/docs/hub/gguf#quantization-types) and the parts that matter most get [6.6 bits](https://huggingface.co/docs/hub/gguf#quantization-types). They're worked out from the file sizes of [Llama 3 8B](https://github.com/ggml-org/llama.cpp/blob/master/tools/perplexity/README.md#llama-3-8b-scoreboard), so other models differ a little.

### Working out a file's size

Multiply the model's billions of weights by the bits, then divide by 8, the bits in a byte. That's the size in GB. Qwen3-Coder-30B-A3B has 30.5B weights, so at `Q4_K_M` it's about 30.5 × 4.9 ÷ 8, or 19 GB.

## What the letters mean

In `Q4_K_M`, the 4 is roughly the bits per weight. The letters say which kind it is.

- **`K` with `_S`, `_M` or `_L`:** K-quants, the usual kind
  - The parts of a model that matter most keep extra bits.
  - The last letter says how much extra: small, medium or large.
  - Example: [Qwen3.5-9B-Q4_K_M.gguf](https://huggingface.co/unsloth/Qwen3.5-9B-GGUF/blob/main/Qwen3.5-9B-Q4_K_M.gguf).
- **`IQ`:** I-quants, a newer kind
  - At the same size, they keep more quality than K-quants.
  - The gap is biggest under 4 bits, so pick one there.
  - Example: [Qwen_Qwen3.5-9B-IQ3_M.gguf](https://huggingface.co/bartowski/Qwen_Qwen3.5-9B-GGUF/blob/main/Qwen_Qwen3.5-9B-IQ3_M.gguf).
- **`Q8_0` and `Q4_0`:** The older, simpler kind
  - Almost every part of the model gets the same bits.
  - `Q8_0` is still the usual 8-bit file.
  - Google trains its [QAT](/notes/hugging-face-models/#the-training-method) models to be shrunk to 4 bits, so they come as `Q4_0`.
  - Examples: [Qwen3.5-9B-Q8_0.gguf](https://huggingface.co/unsloth/Qwen3.5-9B-GGUF/blob/main/Qwen3.5-9B-Q8_0.gguf), [gemma-4-12b-it-qat-q4_0.gguf](https://huggingface.co/google/gemma-4-12B-it-qat-q4_0-gguf/blob/main/gemma-4-12b-it-qat-q4_0.gguf).
- **`UD` and `_XL`:** Unsloth's own mixes
  - UD stands for Unsloth Dynamic.
  - K-quants give extra bits to the same parts in every model.
  - Unsloth tests each model to choose its own parts.
  - `UD-Q4_K_XL` is a little bigger than `Q4_K_M` and a little better.
  - Example: [Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf](https://huggingface.co/unsloth/Qwen3.6-35B-A3B-GGUF/blob/main/Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf).
- **`MXFP4`:** A 4-bit format some models are trained in
  - OpenAI's gpt-oss is one.
  - Get the `MXFP4` file, since lower levels barely make it smaller.
  - Example: [gpt-oss-20b-MXFP4.gguf](https://huggingface.co/ggml-org/gpt-oss-20b-GGUF/blob/main/gpt-oss-20b-MXFP4.gguf).
- **`BF16` and `F16`:** The full 16 bits
  - It's the model as the lab published it.
  - It's about twice the size of `Q8_0`, for almost no gain in quality.
  - Example: [Qwen3.5-9B-BF16.gguf](https://huggingface.co/unsloth/Qwen3.5-9B-GGUF/blob/main/Qwen3.5-9B-BF16.gguf).

## Other files

- **`mmproj`:** The part that sees images
  - It's the multimodal projector, a second file next to the model.
  - You need it only to send the model images. Some models also take audio through it.
  - When `llama-server` downloads a model with `-hf`, it gets this file too.
  - Example: [mmproj-F16.gguf](https://huggingface.co/unsloth/Qwen3.5-9B-GGUF/blob/main/mmproj-F16.gguf) from Qwen3.5 9B.
- **`-00001-of-00003`:** A big model in parts
  - Download every part into the same folder.
  - Then give [llama.cpp](https://github.com/ggml-org/llama.cpp) the first part. It finds the rest.
  - Example: [Qwen3.8-27B-BF16-00001-of-00002.gguf](https://huggingface.co/unsloth/Qwen3.8-27B-GGUF/blob/main/BF16/Qwen3.8-27B-BF16-00001-of-00002.gguf).
