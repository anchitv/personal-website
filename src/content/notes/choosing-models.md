---
title: "Choosing an open model"
date: 2026-11-08
description: "Which open model to run for chat, coding or images by how much memory your GPU has, and the formats each kind of hardware runs best."
topic: ai
aliases: ["Unified memory", "NPU", "EXL3", "NVFP4", "VRAM"]
links:
  - title: "Artificial Analysis: open models"
    url: https://artificialanalysis.ai/models/open-source
    about: "Open models compared on independent tests of intelligence, speed and price."
tags: ["ai", "homelab"]
draft: false
---

Which open model to run depends on the job and how much memory your GPU has.

[Understanding models on Hugging Face](/notes/hugging-face-models/) explains the parts of a model's name. [Quantisation](/notes/quantisation/) explains its files.

## How to choose

1. **Pick the job**
   - Chat, coding or vision: each is a column in [Current picks](#current-picks).
2. **Find your VRAM**
   - VRAM is the graphics card's own memory. The GPU reads it quickly, so the model should fit in it.
   - RAM is the computer's main memory, which is used by the processor. It's several times slower than VRAM.
   - On a Mac or a shared-memory box, the processor and GPU share one memory. The GPU's share counts as its VRAM. See [Macs](#macs).
3. **Leave a few GB free**
   - The [context](/notes/hugging-face-models/#the-context-length) needs memory too. A coding agent needs the most.
   - If the model doesn't fit, part of it runs from RAM and slows down.
4. **Pick the biggest model that fits**
   - 4 bits on a bigger model usually beats 8 on a smaller one.
   - Below `Q3_K_M`, quality falls fast.
5. **Short of VRAM? Try a [Mixture-of-Experts](/notes/hugging-face-models/#the-active-size) model**
   - Each word uses only a few experts, so [llama.cpp](https://github.com/ggml-org/llama.cpp) can move the ones VRAM can't hold into RAM and still reply quickly.
   - Your VRAM and free RAM together must hold the whole file.
   - It needs a graphics card. A Mac or a shared-memory box has no separate RAM.

## Current picks

These are the best open models in November 2026. Each runner-up is the best from another lab.

<table class="stripes" aria-labelledby="current-picks">
<thead>
<tr><th scope="col">Memory</th><th scope="col">Pick</th><th scope="col">Chat</th><th scope="col">Coding</th><th scope="col">Vision</th></tr>
</thead>
<tbody>
<tr><th scope="rowgroup" rowspan="2">8 GB</th><th scope="row">Winner</th><td><a href="https://huggingface.co/Qwen/Qwen3.5-9B" class="link-external">Qwen3.5 <span class="link-end">9B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/IFM/K2-Horizon-7B" class="link-external">K2 Horizon <span class="link-end">7B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/Qwen/Qwen3.5-9B" class="link-external">Qwen3.5 <span class="link-end">9B</span><span class="visually-hidden"> (external site)</span></a></td></tr>
<tr><th scope="row">Runner-up</th><td><a href="https://huggingface.co/IFM/K2-Horizon-7B" class="link-external">K2 Horizon <span class="link-end">7B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/Qwen/Qwen3.5-9B" class="link-external">Qwen3.5 <span class="link-end">9B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512" class="link-external">Ministral 3 <span class="link-end">8B</span><span class="visually-hidden"> (external site)</span></a></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="2">12 GB</th><th scope="row">Winner</th><td><a href="https://huggingface.co/google/gemma-4-12B-it" class="link-external">Gemma 4 12B <span class="link-end">QAT</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/IFM/K2-Horizon-7B" class="link-external">K2 Horizon <span class="link-end">7B</span><span class="visually-hidden"> (external site)</span></a> at <code>Q6_K</code></td><td><a href="https://huggingface.co/google/gemma-4-12B-it" class="link-external">Gemma 4 12B <span class="link-end">QAT</span><span class="visually-hidden"> (external site)</span></a></td></tr>
<tr><th scope="row">Runner-up</th><td><a href="https://huggingface.co/IFM/K2-Horizon-7B" class="link-external">K2 Horizon <span class="link-end">7B</span><span class="visually-hidden"> (external site)</span></a> at <code>Q8_0</code></td><td><a href="https://huggingface.co/Qwen/Qwen3.5-9B" class="link-external">Qwen3.5 <span class="link-end">9B</span><span class="visually-hidden"> (external site)</span></a> at <code>Q6_K</code></td><td><a href="https://huggingface.co/mistralai/Ministral-3-14B-Instruct-2512" class="link-external">Ministral 3 <span class="link-end">14B</span><span class="visually-hidden"> (external site)</span></a></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="2">16 GB</th><th scope="row">Winner</th><td><a href="https://huggingface.co/google/gemma-4-26B-A4B-it" class="link-external">Gemma 4 <span class="nowrap">26B-A4B</span> <span class="link-end">QAT</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/IFM/K2-Horizon-MoVA-36B-A4B" class="link-external">K2 Horizon MoVA <span class="link-end">36B-A4B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/google/gemma-4-26B-A4B-it" class="link-external">Gemma 4 <span class="nowrap">26B-A4B</span> <span class="link-end">QAT</span><span class="visually-hidden"> (external site)</span></a></td></tr>
<tr><th scope="row">Runner-up</th><td><a href="https://huggingface.co/IFM/K2-Horizon-MoVA-36B-A4B" class="link-external">K2 Horizon MoVA <span class="link-end">36B-A4B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B" class="link-external">Qwen3.6 <span class="link-end">35B-A3B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16" class="link-external">Nemotron 3 Nano <span class="link-end">Omni</span><span class="visually-hidden"> (external site)</span></a></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="2">24 to 32 GB</th><th scope="row">Winner</th><td><a href="https://huggingface.co/google/gemma-4-31B-it" class="link-external">Gemma 4 31B <span class="link-end">QAT</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/Qwen/Qwen3.8-27B" class="link-external">Qwen3.8 <span class="link-end">27B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/google/gemma-4-31B-it" class="link-external">Gemma 4 31B <span class="link-end">QAT</span><span class="visually-hidden"> (external site)</span></a></td></tr>
<tr><th scope="row">Runner-up</th><td><a href="https://huggingface.co/meta-models/Muse-Glimmer-30B" class="link-external">Muse Glimmer <span class="link-end">30B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/Nanbeige/Nanbeige4.3-33B" class="link-external">Nanbeige4.3 <span class="link-end">33B</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/meta-models/Muse-Glimmer-30B" class="link-external">Muse Glimmer <span class="link-end">30B</span><span class="visually-hidden"> (external site)</span></a></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="2">64 GB</th><th scope="row">Winner</th><td><a href="https://huggingface.co/google/gemma-4-31B-it" class="link-external">Gemma 4 <span class="link-end">31B</span><span class="visually-hidden"> (external site)</span></a> at <code>Q8_0</code></td><td><a href="https://huggingface.co/Qwen/Qwen3.8-27B" class="link-external">Qwen3.8 <span class="link-end">27B</span><span class="visually-hidden"> (external site)</span></a> at <code>Q8_0</code></td><td><a href="https://huggingface.co/google/gemma-4-31B-it" class="link-external">Gemma 4 <span class="link-end">31B</span><span class="visually-hidden"> (external site)</span></a> at <code>Q8_0</code></td></tr>
<tr><th scope="row">Runner-up</th><td><a href="https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-BF16" class="link-external">Nemotron 3.5 <span class="link-end">Bolt</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/Nanbeige/Nanbeige4.3-33B" class="link-external">Nanbeige4.3 <span class="link-end">33B</span><span class="visually-hidden"> (external site)</span></a> at <code>Q8_0</code></td><td><a href="https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-BF16" class="link-external">Nemotron 3.5 <span class="link-end">Bolt</span><span class="visually-hidden"> (external site)</span></a></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="2">128 GB</th><th scope="row">Winner</th><td><a href="https://huggingface.co/Qwen/Qwen3.8-Flash-Next" class="link-external">Qwen3.8 <span class="link-end">Flash-Next</span><span class="visually-hidden"> (external site)</span></a> at <code>UD-IQ4_XS</code></td><td><a href="https://huggingface.co/Qwen/Qwen3.8-Flash-Next" class="link-external">Qwen3.8 <span class="link-end">Flash-Next</span><span class="visually-hidden"> (external site)</span></a> at <code>UD-IQ4_XS</code></td><td><a href="https://huggingface.co/Qwen/Qwen3.8-Flash-Next" class="link-external">Qwen3.8 <span class="link-end">Flash-Next</span><span class="visually-hidden"> (external site)</span></a> at <code>UD-IQ4_XS</code></td></tr>
<tr><th scope="row">Runner-up</th><td><a href="https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16" class="link-external">Nemotron 3.5 Super <span class="link-end">VL</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/poolside/Laguna-S-2.1" class="link-external">Laguna S <span class="link-end">2.1</span><span class="visually-hidden"> (external site)</span></a></td><td><a href="https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16" class="link-external">Nemotron 3.5 Super <span class="link-end">VL</span><span class="visually-hidden"> (external site)</span></a></td></tr>
</tbody>
</table>

- **Macs and shared-memory boxes.** Go by the GPU's share of memory: see [Macs](#macs) and [Shared-memory boxes](#shared-memory-boxes).
- **At 16 GB VRAM.** Gemma fits in VRAM with a short context. For a long context, a few of its experts stay in RAM. The others are 22 GB files, so some of their experts stay in RAM. That needs the 16 GB of VRAM plus about 9 GB of free RAM.
- **Images.** K2 Horizon, Nanbeige and Laguna read text only. To read documents, charts or screenshots, use the Qwen model in the same row.

## Finding more models for your machine

[llmfit](https://github.com/AlexsJones/llmfit) ranks hundreds of open models by how well they'd run on your machine, each at the best [level](/notes/quantisation/#levels) that fits. Its speeds are estimates. Run it with [Podman](https://docs.podman.io/en/latest/), so there's nothing to install:

```sh
podman run --rm -it ghcr.io/alexsjones/llmfit --tui
```

If it gets your GPU's memory wrong, add your card's size, like `--memory=16G`.

## By device

Every device below runs GGUF files through [llama.cpp](https://github.com/ggml-org/llama.cpp) or a program built on it. Some also have a format of their own that runs faster or uses less power.

### NVIDIA cards

For one person, `GGUF` works as on every device. `EXL3` gets more quality from the same VRAM. To serve many people at once, use [vLLM](https://docs.vllm.ai/en/latest/) or [SGLang](https://docs.sglang.io/) with `FP8` or `NVFP4`.

- **`EXL3`:** More quality than GGUF from the same VRAM
  - At 4 bits, it beats a 5-bit GGUF in [ExLlamaV3's own tests](https://github.com/turboderp-org/exllamav3#readme).
  - Runs on [ExLlamaV3](https://github.com/turboderp-org/exllamav3), with [TabbyAPI](https://github.com/theroyallab/tabbyAPI/wiki) as its server.
  - Example: [turboderp/Qwen3.8-27B-exl3](https://huggingface.co/turboderp/Qwen3.8-27B-exl3), 17 GB at 4 bits.
- **`FP8`:** Near full quality, for serving many people
  - It's 8 bits, so twice the size of a 4-bit file.
  - Runs on vLLM or SGLang. Best on RTX 40 cards and newer.
  - Example: [Qwen/Qwen3.8-27B-FP8](https://huggingface.co/Qwen/Qwen3.8-27B-FP8), 31 GB.
- **`NVFP4`:** Smaller than FP8, for RTX 50 cards
  - Its quality is a little lower, for a considerably smaller file.
  - NVFP4 support is still settling.
  - `nvidia/` and Red Hat's `RedHatAI/` publish it.
  - Example: [nvidia/Qwen3.8-27B-NVFP4](https://huggingface.co/nvidia/Qwen3.8-27B-NVFP4), 22 GB.

### AMD Radeon cards

- **`GGUF`:** The best choice
  - [llama.cpp](https://github.com/ggml-org/llama.cpp) runs it through [Vulkan](https://wiki.archlinux.org/title/Vulkan) or [ROCm](https://rocm.docs.amd.com/en/latest/about/what-is-rocm.html).
  - [Debian](https://www.debian.org/intro/about) 13's ROCm is too old for RX 9000 cards.
  - Example: [unsloth/Qwen3.8-27B-GGUF](https://huggingface.co/unsloth/Qwen3.8-27B-GGUF).
- **`EXL3`:** Runs too
  - [TabbyAPI](https://github.com/theroyallab/tabbyAPI/wiki) has a ROCm build that runs it.
- **`FP8`:** For serving many people
  - [vLLM](https://docs.vllm.ai/en/latest/) runs FP8 and GGUF on RX 7900 and RX 9000 cards.
  - FP8 on RX 9000 still needs community patches.
- **`amd/`:** AMD's own models
  - They mostly target its data-centre cards, so skip them.

### Ryzen AI laptops

On Linux, [Lemonade](https://lemonade-server.ai/docs/) runs models on the NPU through [FastFlowLM](https://fastflowlm.com/docs/). The NPU needs a Ryzen AI 300, 400 or Max 300 and Linux 7.0 or newer. Older Ryzen NPUs don't work.

- **`-NPU2`:** Models for the NPU
  - The NPU is a small, low-power AI chip with a format of its own.
  - It saves battery. The laptop's own graphics, running GGUF, are usually quicker.
  - Example: [FastFlowLM/Qwen3.5-9B-NPU2](https://huggingface.co/FastFlowLM/Qwen3.5-9B-NPU2).

### Intel Arc and Core Ultra

- **`-int4-ov`:** [OpenVINO](https://docs.openvino.ai/2026/index.html), for the graphics
  - It's Intel's own format.
  - Runs on OpenVINO's model server or its GenAI library.
  - Example: [OpenVINO/Qwen3-8B-int4-ov](https://huggingface.co/OpenVINO/Qwen3-8B-int4-ov).
- **`-int4-cw-ov`:** OpenVINO, for Core Ultra's NPU
  - The NPU works only on [Ubuntu](https://ubuntu.com/server).
  - Example: [OpenVINO/Qwen3-8B-int4-cw-ov](https://huggingface.co/OpenVINO/Qwen3-8B-int4-cw-ov).
- **`GGUF`:** Runs too
  - [llama.cpp](https://github.com/ggml-org/llama.cpp) runs it through SYCL or [Vulkan](https://wiki.archlinux.org/title/Vulkan).
- **IPEX-LLM:** Archived
  - Older guides use it.
  - Intel archived it in January 2026.

### Macs

A Mac's GPU shares its unified memory and may use about two-thirds to three-quarters of it. On a 32 GB Mac, that's about 21 to 24 GB for models. There's no separate RAM to keep experts in, so the whole file must fit in the GPU's share.

To raise the limit until you restart, run:

```sh
sudo sysctl iogpu.wired_limit_mb=<MB>
```

- **`MLX`:** Apple's own format
  - [MLX](https://ml-explore.github.io/mlx/build/html/index.html) is Apple's framework, built for its chips.
  - Runs on [LM Studio](https://lmstudio.ai/docs/app) or [mlx-lm](https://github.com/ml-explore/mlx-lm).
  - Example: [mlx-community/Qwen3.8-27B-4bit](https://huggingface.co/mlx-community/Qwen3.8-27B-4bit).
- **`GGUF`:** Works too
  - Through [llama.cpp](https://github.com/ggml-org/llama.cpp) or [Ollama](https://github.com/ollama/ollama).

### Snapdragon X laptops

- **On Windows**
  - The NPU runs Qualcomm's own builds through [GenieX](https://geniex.aihub.qualcomm.com/en/get-started/what-is-geniex).
  - Models made for [Foundry Local](https://learn.microsoft.com/en-us/azure/foundry-local/what-is-foundry-local) use the NPU too.
- **On Linux**
  - The NPU doesn't work yet, so run GGUF on the processor instead.
  - The newer X2 laptops have a developer preview. The first X Elite has none.

### Shared-memory boxes

AMD's Ryzen AI Max and NVIDIA's DGX Spark share up to 128 GB between processor and GPU. That memory is slower than a graphics card's VRAM, so large [Mixture-of-Experts](/notes/hugging-face-models/#the-active-size) models suit them best.

- **Ryzen AI Max**
  - On Linux the GPU gets half the memory by default.
  - To raise its share, leave the VRAM setting in the BIOS at its smallest and use AMD's `amd-ttm` tool.
  - AMD's own example gives the GPU 100 GB of 128 GB.
  - It needs Linux 6.18.4 or newer to share that much.
- **DGX Spark**
  - [NVFP4](#nvidia-cards) models, served with [vLLM](https://docs.vllm.ai/en/latest/).
  - GGUF works too.
- **No experts in RAM**
  - As on a Mac, the whole file must fit in the GPU's share.

### CPU only

- **`GGUF`:** Runs on any processor
  - [llama.cpp](https://github.com/ggml-org/llama.cpp) runs it on any x86 or ARM processor, a Raspberry Pi included.
  - `Q4_0` and `Q4_K_M` both get a speed-up on recent processors.
- **Small or sparse models**
  - RAM is several times slower than VRAM, so stick to small models, like [Qwen3.5 4B](https://huggingface.co/Qwen/Qwen3.5-4B).
  - Sparse models also work, like [Qwen3.6 35B-A3B](https://huggingface.co/Qwen/Qwen3.6-35B-A3B). They're [Mixture-of-Experts](/notes/hugging-face-models/#the-active-size) models with few active weights.
