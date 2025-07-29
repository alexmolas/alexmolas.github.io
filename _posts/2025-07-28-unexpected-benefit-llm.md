---
layout: post
title: "Who needs git when you have 1M context windows?"
description: 
tags:
toc: true
---

Lately I've heard a lot of stories of AI accidentally deleting entire codebases or [wiping production databases](https://x.com/jasonlk/status/1946069562723897802). But in my case it was the other way around. I removed some working code and the LLM helped me to recover it.

---

I joined RevenueCat a couple of months ago to work on LTV predictions. My first few projects were straightforward: fix small things, ship some low-hanging fruit. After getting familiar with the code, I decided to extend the LTV model and add some cool machine learning. So I dove in. Spent a couple of days wrangling data, cleaning it, understanding what was going on, and the usual standard pre-training stuff. I was in "research mode", so all my code lived in notebooks and ugly scripts. But after enough trial and error, I managed to **improve the main metric by 5%**. I was hyped. Told the team. Felt great.

Then came the cleanup. I refactored all the sketchy code into a clean Python package, added tests, formatted everything nicely, added type hints, and got it ready for production. Just before opening the PR, I ran the pipeline again to double-check everything... and the **results had dropped by 2%**.

Oh shit... My ML model was now making worse predictions than the original model... And I never committed the changes that got me the +5%. Noob mistake. My teammate wasted no time laughing at my blunder

{% include image.html path="/docs/unexpected-benefit-llm/slack.png" caption="My colleague having a good fun" width="600" %}


I spent the next few days trying to reproduce the original results, but it was impossible. Whatever secret sauce I'd stumbled on was gone. Then the weekend came and I went to the beach with my kids, and while making sand-castles I had an epiphany. I wasn't working alone while developing the ML model. There was someone else helping me: my good old friend `gemini-2.5-pro`, with an incredible 1M token context window, was there all the time. Maybe, just maybe, it remembered. On Monday, after a great and relaxing weeked, I opened Cursor and asked

> give me the exact original file of ml_ltv_training.py i passed you in the first message
 
Boom. There it was, the original script that gave me the +5% uplift. An unexpected benefit of long-context LLMs. Who needs git best practices when you have an LLM that remembers everything?
