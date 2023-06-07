---
layout: post
title: "Dollar Cost Averaging Is Not Worth It"
description: ""
tags: stats finance
---

# Introduction

I never received financial education from my family, the only thing they taught me was the age-old adage of spending less than what one earns, but it never went further than that. After moving out of my parents' home and starting a new life with my beloved wife we started learning about personal finances and how to maximise our hard-earned money. This involved reading books, watching videos, and speaking with experts, but perhaps most significantly, speaking with friends facing similar circumstances, eager to uncover their strategies. In one of these conversations, I was explaining to one friend that every month we are investing some money in S&P 500 and that so far it was going well. He then told me something like “Yes that’s a good idea since you’re reducing the volatility and avoiding the probability of putting all your money at a high point”. He then suggested that were he blessed with a $10,000 fortune, he would gradually deploy it, in modest increments, over time. At the time it seemed like a sensible idea, an approach worth being considered. However, over time, I began to suspect that maybe it wasn’t as right as I thought at first. In this post, I’ll analyse S&P 500 data from the last 40 years and show that dollar cost averaging is usually suboptimal and that investing all the money at once is better.

# tldr

- Over the last 40 years dollar cost averaging performed worst than a lump sum strategy 82% of the time.
- Lump sum typically outperforms dollar cost averaging by 23%.
- Even tuning the parameters of the dollar cost averaging strategy (frequency and duration) the performance of lump sum is still better.

# Definitions

There is some confusion with the terms I'll discuss in this post, so I'll start by defining them.

- *Lump sum* (LS): This strategy involves investing all the available money right away, without delay
- *Dollar cost averaging* (DCA): With this strategy, you invest the available money in fixed intervals, but in smaller portions each time.
- *Systematic investment* (SI): This strategy involves investing a small amount of money as soon as possible. Essentially, it's like making a lump sum investment every month, as a percentage of your salary.

The difference between DCA and SI is that in DCA you have all the money available since the beginning, but in SI you have to wait until the next month to have access to the quantity to be invested.


# Results

To do this analysis I've used daily data for the SP500 index. In particular, I've used the closing price of the index. The data availability is from `1980-01-01` until `2023-06-01`.

## Monthly DCA vs LS

The first question I try to answer is "When was DCA better than LS over the last 40 years?". To do so, I've computed the performance of an investment over 5 years of (1) a monthly DCA and (2) an LS. I've computed these values for all the starting days from `1980` until `2018`. This is, for each day I assume that I have a fixed amount of money and compute the benefits of DCA and LS over 5 years. The results can be seen in the plot below

![table](/docs/dca-is-suboptimal/dca-vs-ls.svg){: width="500" height="500"}

It's clear that LS overperforms DCA in the majority of days, but by how much? I computed the gains that one obtains by using LS and DCA and plotted them in the next image. For 82% of the starting days, the LS approach was better than the DCA. In particular, on average, LS made 23% more than DCA.

![table](/docs/dca-is-suboptimal/dca-vs-ls-2.svg){: width="500" height="500"}

## Fine-tuning DCA: is it worth it?

In the last section, we saw that monthly DCA wasn't better than LS for investment periods of 5 years. However, the reader might have noticed that DCA depends on two parameters

* Investment frequency: how many investments do I want to do over the investment period? It's not the same to invest every month than to invest every week.
* Horizon: how long do I want to maintain the investments? It's not the same to invest over 1 year than over 10 years.

In the next two sections, I'll explore if DCA can be improved by tuning these two parameters.

### Frequency

Now let's delve into the influence of investment frequency on the performance of DCA. Investment frequency refers to how often you make investments within the designated investment period. It can vary from monthly investments to weekly or even daily investments.

To analyse the effect of this parameter, I have simulated DCA over a period of 5 years with different investment frequencies and compared them to the LS strategy. In the plot below you can see the percentage improvement of LS over DCA for different frequencies

![table](/docs/dca-is-suboptimal/period-vs-difference.svg){: width="500" height="500"}

The difference increases monotonically with the number of investments, which indicates that the fewer investment splits one makes the better, ie: if it's possible invest everything as soon as possible.

### Horizon

Finally, let's explore the impact of the investment horizon on the efficacy of DCA. The investment horizon represents the duration over which you maintain your investments. It could be as short as one year or as long as ten years, for instance.

In the next image, I plot the difference between a monthly DCA and LS for different investment lengths. Notice that the difference increases linearly with the investment duration.

![table](/docs/dca-is-suboptimal/length-vs-difference.svg){: width="500" height="500"}

This means that the performance of DCA in comparison to LS gets worse as more time passes, indicating again that LS is the best strategy to follow.

# Conclusions

In this post, I've shown that DCA is rarely a good investment strategy. This is because when one decides to follow DCA is implicitly expecting that the market to fall in the recent future. However, our experience - at least as far S&P 500 is concerned  - tells us that this is not what happens. 

The main conclusion of this post is then **invest all you have as soon as you can**, which is very similar to the well-known adage the best day to start investing was yesterday.
