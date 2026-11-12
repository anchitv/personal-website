---
title: "Understanding models on Hugging Face"
date: 2026-11-08
description: "What each part of an open model's name means, from its size to how it was trained, with an example of each."
topic: ai
aliases: ["Hugging Face", "Mixture-of-Experts", "MoE", "Instruct model", "QAT", "MLX"]
links:
  - title: "Mixture of Experts Explained"
    url: https://huggingface.co/blog/moe
    about: "How Mixture-of-Experts models work and why every expert still needs memory."
  - title: "Uncensor any LLM with abliteration"
    url: https://huggingface.co/blog/mlabonne/abliteration
    about: "How abliterated models are made and what they lose."
tags: ["ai", "homelab"]
draft: false
---

[Hugging Face](https://huggingface.co/docs/hub/index) is where most open models are published. Each model shows up there many times: once from the lab that made it, then in smaller, [quantised](/notes/quantisation/) copies that others make for different hardware. Names you'll often see:

- **unsloth:** [GGUF](/notes/quantisation/) files of most new models, including its own `UD` mixes.
- **bartowski:** GGUF files of most new models, at every level.
- **ggml-org:** The team behind [llama.cpp](https://github.com/ggml-org/llama.cpp), with GGUF files of popular models.
- **mlx-community:** Versions for Macs, in Apple's [MLX](https://ml-explore.github.io/mlx/build/html/index.html) format.

Anyone can upload a model, so check who made a copy before you download it.

## Reading a model's name

A model's name is made of parts, like `Qwen3-Coder-30B-A3B-Instruct`. Few names have every part. When a name doesn't say something, the model's page does.

The most common parts at a glance, with a model that uses each:

<table aria-labelledby="reading-a-models-name">
<thead>
<tr><th scope="col">Type</th><th scope="col">Part</th><th scope="col">What it is</th><th scope="col">Example</th></tr>
</thead>
<tbody>
<tr><th scope="rowgroup"><a class="link-jump link-notes" href="#the-family-and-version">The family and <span class="link-end">version</span></a></th><td><code>Qwen3</code></td><td>Qwen models, version 3</td><td><code>Qwen3-Coder-30B-A3B-Instruct</code></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="2"><a class="link-jump link-notes" href="#the-speciality">The <span class="link-end">speciality</span></a></th><td><code>Coder</code></td><td>Made for writing code</td><td><code>Qwen3-Coder-30B-A3B-Instruct</code></td></tr>
<tr><td><code>VL</code> or <code>Vision</code></td><td>Reads images as well as text</td><td><code>Qwen3-VL-8B-Instruct</code>, <code>Llama-3.2-11B-Vision-Instruct</code></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="2"><a class="link-jump link-notes" href="#the-size">The <span class="link-end">size</span></a></th><td><code>30B</code></td><td>30 billion weights in total</td><td><code>Qwen3-Coder-30B-A3B-Instruct</code></td></tr>
<tr><td><code>E4B</code></td><td>E is for effective: every word goes through the same core of about 4 billion weights.</td><td><code>gemma-4-E4B-it</code></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup"><a class="link-jump link-notes" href="#the-active-size">The active <span class="link-end">size</span></a></th><td><code>A3B</code></td><td>A is for active: each word picks its own subset of about 3 billion weights from the whole large model.</td><td><code>Qwen3-Coder-30B-A3B-Instruct</code></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="3"><a class="link-jump link-notes" href="#the-training-stage">The training <span class="link-end">stage</span></a></th><td><code>Instruct</code>, <code>it</code> or <code>Chat</code></td><td>Trained to chat and follow instructions</td><td><code>Qwen3-Coder-30B-A3B-Instruct</code>, <code>gemma-4-12B-it</code></td></tr>
<tr><td><code>Base</code> or <code>pt</code></td><td>Not for chat: it only continues text</td><td><code>Qwen3.5-9B-Base</code>, <code>gemma-3-4b-pt</code></td></tr>
<tr><td><code>Thinking</code> or <code>Reasoning</code></td><td>Thinks before it answers</td><td><code>Qwen3-30B-A3B-Thinking-2507</code>, <code>Phi-4-reasoning</code></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup"><a class="link-jump link-notes" href="#the-release-date">The release <span class="link-end">date</span></a></th><td><code>2507</code></td><td>Released July 2025: 25 is the year, 07 the month</td><td><code>Qwen3-30B-A3B-Instruct-2507</code></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="2"><a class="link-jump link-notes" href="#the-training-method">The training <span class="link-end">method</span></a></th><td><code>Distill</code></td><td>A small model taught by a bigger one</td><td><code>DeepSeek-R1-Distill-Qwen-7B</code></td></tr>
<tr><td><code>qat</code></td><td>Quantisation-aware training: it loses less quality when shrunk</td><td><code>gemma-4-12B-it-qat-q4_0-gguf</code></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup" rowspan="3"><a class="link-jump link-notes" href="#the-file-format">The file <span class="link-end">format</span></a></th><td><code>GGUF</code></td><td>Files for running at home</td><td><code>Qwen3.5-9B-GGUF</code></td></tr>
<tr><td><code>MLX</code></td><td>Files for Macs</td><td><code>Qwen3.5-9B-MLX-4bit</code></td></tr>
<tr><td><code>4bit</code> or <code>8bit</code></td><td>Shrunk to 4 or 8 bits per weight</td><td><code>Qwen3.5-9B-4bit</code></td></tr>
</tbody>
<tbody>
<tr><th scope="rowgroup"><a class="link-jump link-notes" href="#community-versions">Community <span class="link-end">versions</span></a></th><td><code>abliterated</code></td><td>Edited to stop refusing requests</td><td><code>Huihui-Qwen3.8-27B-abliterated</code></td></tr>
</tbody>
</table>

### The family and version

A name starts with the family, a lab's line of models, and its version.

- **`Qwen3`:** Qwen, version 3
  - Alibaba's family. Newer versions like Qwen3.5 are usually better.
  - Example: [Qwen3-Coder-30B-A3B-Instruct](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct).
- **`gemma-4`:** Gemma, version 4
  - Google's open family, in small letters with a dash before the version.
  - Example: [gemma-4-12B-it](https://huggingface.co/google/gemma-4-12B-it).
- **`Llama-3.1`:** Llama, version 3.1
  - Meta's family. The number after the dot is a smaller update to 3.
  - Example: [Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct).
- **`Ministral-3`:** Ministral, version 3
  - Mistral's family of small models.
  - Example: [Ministral-3-8B-Instruct-2512](https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512).
- **`DeepSeek-R1`:** DeepSeek's first reasoning model
  - DeepSeek's main models use V, like [DeepSeek-V3](https://huggingface.co/deepseek-ai/DeepSeek-V3).
  - Example: [DeepSeek-R1-0528](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528).
- **`gpt-oss`:** OpenAI's open models
  - No version number: the size comes straight after the name.
  - Example: [gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b).
- **`v0.3`:** A version at the end
  - Some names put the version last, after a v, like v0.1 to v0.3.
  - Example: [Mistral-7B-Instruct-v0.3](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3).

### The speciality

Some models are made for one kind of work. The name says which.

- **`Coder`:** A coding model
  - Extra training on code and on using tools.
  - So it works well in a coding agent.
  - Example: [Qwen3-Coder-30B-A3B-Instruct](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct).
- **`VL` or `Vision`:** Sees images
  - Short for vision-language: it reads images as well as text.
  - GGUF copies keep the image part in a second [`mmproj` file](/notes/quantisation/#other-files).
  - New models like Qwen3.5 and Gemma 4 see images without `VL`.
  - Examples: [Qwen3-VL-8B-Instruct](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct), [Llama-3.2-11B-Vision-Instruct](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct).
- **`Omni`:** Hears and sees
  - It understands audio and images as well as text.
  - Some can talk back too.
  - Example: [Qwen2.5-Omni-7B](https://huggingface.co/Qwen/Qwen2.5-Omni-7B).
- **`Embedding`:** A search model
  - It can't chat. It turns text into a list of numbers.
  - Programs use those to find text with a similar meaning.
  - Example: [Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B).

### The size

The size counts a model's weights, which model pages call parameters.

- **`30B`**
  - B is for billion: 30 billion weights.
  - More weights usually make a smarter model, but a bigger file.
  - At about [4 bits](/notes/quantisation/#levels) each, this file is about 19 GB.
  - Example: [Qwen3-Coder-30B-A3B-Instruct](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct).
- **`270m`**
  - M is for million: 270 million weights.
  - That's tiny, made for simple jobs like sorting text.
  - Example: [gemma-3-270m-it](https://huggingface.co/google/gemma-3-270m-it).
- **`E4B`**
  - E is for effective. About 4B of its weights work on each word.
  - The name doesn't give the total. The [model's card](https://huggingface.co/google/gemma-4-E4B-it#dense-models) does.
  - It lists 8B in total and 4.5B effective. The rest are lookup tables.
  - The files of a GGUF copy show its size, about 5 GB at 4 bits.
  - It's about as fast as a 4B model.
  - Example: [gemma-4-E4B-it](https://huggingface.co/google/gemma-4-E4B-it).
- **`mini` or `Air`**
  - Some names use a word, like mini, Small, Nano or Air.
  - It only compares models in one family.
  - GLM-4.5-Air sounds small, but it's still 106B.
  - Examples: [Phi-4-mini-instruct](https://huggingface.co/microsoft/Phi-4-mini-instruct), [GLM-4.5-Air](https://huggingface.co/zai-org/GLM-4.5-Air).

### The active size

A **Mixture-of-Experts** (MoE) splits most of its weights into small blocks called experts. For each word, a router picks a few of them. The rest sit idle, so it runs faster than its size suggests.

- **`A3B`:** The active size
  - A is for active. About 3B of its 30B weights work on each word.
  - The name doesn't give exact sizes or experts. The [model's card](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct#model-overview) does.
  - It lists 30.5B in total, 3.3B active and 8 of 128 experts per word.
  - The next word may pick other experts, so all of it must fit in memory.
  - The files of a GGUF copy show its size, about 19 GB at 4 bits.
  - It's about as fast as a 3B model, but usually smarter.
  - Example: [Qwen3-Coder-30B-A3B-Instruct](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct).
- **`17B-16E`:** Active size and experts
  - Llama 4 counts this way. 16E means 16 experts.
  - 17B is the active size, one expert plus the parts every word shares.
  - The [model's card](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct#model-information) gives the size, which is 109B for Llama 4 Scout.
  - The files of a GGUF copy show its size, about 65 GB at 4 bits.
  - Example: [Llama-4-Scout-17B-16E-Instruct](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct).
- **`8x7B`:** Experts times their size
  - An older way to write 8 experts of about 7B each.
  - The name doesn't give exact sizes. Mistral's [release post](https://mistral.ai/news/mixtral-of-experts/#:~:text=46.7B%20total%20parameters) does.
  - It says 46.7B in total, not 56B, since the experts share some weights.
  - Each word uses 2 of the 8 experts, 12.9B active.
  - The files of a GGUF copy show its size, about 26 GB at 4 bits.
  - Example: [Mixtral-8x7B-Instruct-v0.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1).

Not every Mixture-of-Experts says so, like gpt-oss and DeepSeek-R1.

### The training stage

Every model first learns from text. Most are then trained to chat.

- **`Instruct`:** An instruct model
  - Trained to chat and do what you ask.
  - This is the kind to download.
  - Example: [Qwen3-Coder-30B-A3B-Instruct](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct).
- **`it` or `Chat`:** The same
  - Other labs' names for an instruct model.
  - `it` is short for instruction-tuned.
  - Examples: [gemma-4-12B-it](https://huggingface.co/google/gemma-4-12B-it), [deepseek-llm-7b-chat](https://huggingface.co/deepseek-ai/deepseek-llm-7b-chat).
- **`Base` or `pt`:** A base model
  - It can't chat. Give it a sentence and it carries on writing.
  - It's for training further.
  - Google writes `pt`, for pre-trained.
  - Examples: [Qwen3.5-9B-Base](https://huggingface.co/Qwen/Qwen3.5-9B-Base), [gemma-3-4b-pt](https://huggingface.co/google/gemma-3-4b-pt).
- **`Thinking` or `Reasoning`:** A reasoning model
  - It works through a problem step by step before it answers.
  - That's slower, but better at hard tasks.
  - Examples: [Qwen3-30B-A3B-Thinking-2507](https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507), [Phi-4-reasoning](https://huggingface.co/microsoft/Phi-4-reasoning).

Most new models can turn thinking on or off, so their names don't say.

### The context length

The context is how much text a model can read at once, counted in tokens.

- **`128k`:** Thousands
  - k is for thousand, so 128 thousand tokens, the pieces text is split into.
  - It holds your messages, its answers and files, about a novel's worth.
  - Example: [Phi-3-mini-128k-instruct](https://huggingface.co/microsoft/Phi-3-mini-128k-instruct).
- **`1M`:** Millions
  - M is for million, so about a million tokens.
  - That needs a lot of memory, so at home you'll rarely use it all.
  - Example: [Qwen2.5-7B-Instruct-1M](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-1M).

Most names don't give the context length.

### The release date

Some names end with four digits, the date the model came out.

- **`2507`:** Year then month
  - 25 is 2025 and 07 is July, so July 2025.
  - Qwen and Mistral write dates this way.
  - Example: [Qwen3-30B-A3B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-30B-A3B-Instruct-2507).
- **`0528`:** Month then day
  - 05 is May and 28 is the day, so 28 May.
  - DeepSeek writes dates this way.
  - Example: [DeepSeek-R1-0528](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528).

### The release stage

Some names mark an early release.

- **`Preview` or `Exp`:** An early version
  - The lab is still testing it, so it may change or be replaced soon.
  - `Exp` is short for experimental.
  - Examples: [QwQ-32B-Preview](https://huggingface.co/Qwen/QwQ-32B-Preview), [DeepSeek-V3.2-Exp](https://huggingface.co/deepseek-ai/DeepSeek-V3.2-Exp).

### The training method

Some names say how a model was trained.

- **`Distill`:** A distilled model
  - A small model that learned by copying a bigger model's answers.
  - [DeepSeek-R1-Distill-Qwen-7B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B) is Qwen 7B taught by R1.
  - It's still a 7B model, not R1.
- **`qat`:** Quantisation-aware training
  - It's trained to be shrunk ([quantised](/notes/quantisation/)), so it loses less quality.
  - The rest of the name gives the bits, like `q4_0` for 4 bits.
  - Example: [gemma-4-12B-it-qat-q4_0-gguf](https://huggingface.co/google/gemma-4-12B-it-qat-q4_0-gguf).

### The file format

Copies made for running a model often end with their file format.

- **`GGUF`:** For running at home
  - For [llama.cpp](https://github.com/ggml-org/llama.cpp), [Ollama](https://github.com/ollama/ollama), [LM Studio](https://lmstudio.ai/docs/app) and more.
  - It comes with a file for each [level](/notes/quantisation/#levels).
  - Example: [Qwen3.5-9B-GGUF](https://huggingface.co/unsloth/Qwen3.5-9B-GGUF).
- **`MLX`:** For Macs
  - Shrunk copies in Apple's [MLX](https://ml-explore.github.io/mlx/build/html/index.html) format.
  - Mostly from mlx-community, whose names often leave out `MLX`.
  - Example: [Qwen3.5-9B-MLX-4bit](https://huggingface.co/mlx-community/Qwen3.5-9B-MLX-4bit).
- **`4bit` or `8bit`:** The bits per weight
  - The copy is shrunk ([quantised](/notes/quantisation/#levels)) to 4 or 8 bits for each weight.
  - Fewer bits make a smaller file, but slightly worse answers.
  - `bnb-4bit` is different. It's a 4-bit copy for training, not running, like the model [Qwen3-8B-bnb-4bit](https://huggingface.co/unsloth/Qwen3-8B-bnb-4bit).
  - Example: [Qwen3.5-9B-4bit](https://huggingface.co/mlx-community/Qwen3.5-9B-4bit).
- **`FP8`:** For server programs
  - 8-bit files for [vLLM](https://docs.vllm.ai/en/latest/) and others that serve many people at once.
  - `AWQ` and `GPTQ` are 4-bit formats for the same programs.
  - Example: [Qwen3-30B-A3B-FP8](https://huggingface.co/Qwen/Qwen3-30B-A3B-FP8).

### Community versions

Anyone can change a model and upload it. Such copies are often worse.

- **`abliterated`:** Refusals removed
  - Someone edited its weights so it stops refusing requests.
  - Example: [Huihui-Qwen3.8-27B-abliterated](https://huggingface.co/huihui-ai/Huihui-Qwen3.8-27B-abliterated).
- **`uncensored` or `heretic`:** The same idea
  - Also changed to stop refusing, but by other methods.
  - Examples: [Qwen3.8-27B-Uncensored](https://huggingface.co/JonathanColetti/Qwen3.8-27B-Uncensored), [gpt-oss-20b-heretic](https://huggingface.co/p-e-w/gpt-oss-20b-heretic).
- **`merge`:** A community blend
  - Several models' weights combined into one.
  - The hope is to get the best of each.
  - Example: [Yi-34B-200K-DARE-merge-v7](https://huggingface.co/brucethemoose/Yi-34B-200K-DARE-merge-v7).

The original model's licence still applies to every copy.
