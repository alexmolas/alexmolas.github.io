---
layout: post
title: "Optimizing Jupyter Notebooks for LLMs" 
description:
tags:
---

I've been using LLM-assisted coding for the last couple of months, and it has been a game-changer. After a couple of iterations, my setup consists in 

1. [ContinueDev](https://www.continue.dev/) + [OpenRouter](https://openrouter.ai/). I'm using OpenRouter because I can access all the models I need from a single provider and control my budget from a single entry point. 
2. Use `Sonnet 3.6` for "easy" questions or edits, and `o1-preview` for big refactors.

This setup was working great for me, I only had to add a couple of bucks to OpenRouter every other month. But suddenly my expenses rocketed. The budget that used to last for around two months now was burned in less than a month. So I decided to investigate what was happening. Fortunately, OpenRouter allows you to see how much you spent on each call. The first thing I noticed is that `o1-preview` was much more expensive than I expected, so I stopped using it so frequently. This solved the problem partially, but even with just using Claude 3.6 the bill was still high. Then I noticed that for certain calls the number of tokens was huge.

{% include image.html path="/docs/ipynb-for-llm/costs.png" caption="Almost $1.5 for just three calls" width="700" %}

To put it into perspective, [the first Harry Potter book has ~100,000 tokens](https://x.com/rasbt/status/1656724322164015105). By no means I was passing that much code to the LLM. What was happening then?

Then it dawned on me. Some days before I used the editor while working with some notebooks. Typically, I avoid this because notebooks are my space for "creative" coding, and I prefer to think through problems without AI suggestions. But while preparing some demo notebooks with elaborate plots, I included the full notebook content in the AI's context to get assistance on improving sections. 

The root cause was the structure of Jupyter Notebook (`.ipynb`) files themselves. Unlike regular Python files, notebooks are stored as JSON files that contain much more than just your code and markdown text. Let me break down what makes them so verbose:

1. Code and Outputs: Every cell stores both your input code and its output, including any error messages or execution counts
2. Rich Metadata: Each cell contains metadata about its execution state, timing, and formatting
3. Base64-encoded Images: When you generate plots or display images, they're stored directly in the notebook as base64-encoded strings. For example, a simple matplotlib plot might look like this in your notebook's JSON:

```json
"outputs": [
    {
        "data": {
            "image/png": "iVBORw0KGgoAAAANSUhEUgA... 
            [thousands of characters continue...]"
        }
    }
]
```

This means that a single plot in your notebook adds thousands of tokens to your LLM context. In my case, a notebook that had a few hundred lines of code contained over 250,000 characters, with base64-encoded images accounting for most of that bulk.

The solution was very easy, just 4 of lines of bash. 

```bash
# Convert all Jupyter notebooks in the directory to Python scripts
jupyter nbconvert --to script *.ipynb

# Loop through each Python script
for file in *.py; do
    # Remove lines containing base64-encoded images
    sed -i '' '/data:image\//d' "$file"
done
```

First, we convert all the `*.ipynb` files in the folder to `.py` modules and then we remove the base64 encodings of the images. This was very effective. I reduced the number of characters in one of the notebooks from 255974 to 14746. I **reduced costs by 94%** with this simple trick. As a collateral benefit, the latencies were also reduced. Now, whenever I need to use an AI assistant with a notebook I run this script and add the `.py` file to the LLM context.

Finally, my key takeaways from this short story are

1. Be mindful of what you're feeding into your LLM. Jupyter notebooks are particularly tricky because they contain a lot of hidden content.
2. Keep an eye on your costs. Tools like OpenRouter make it easy to track your spending and identify issues early.
3. Jupyter notebooks are the devil's favorite file format ([mandatory link to Joel's talk](https://www.youtube.com/watch?v=7jiPeIFXb6U)).

I hope this helps someone avoid the same surprise I had. And remember, sometimes the solution is just a couple of lines of bash.
