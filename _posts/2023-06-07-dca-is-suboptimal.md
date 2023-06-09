---
layout: post
title: "Debunking the Myth of Dollar Cost Averaging"
description: "Investing your money wisely is crucial for financial success. In this post, I delve into the popular strategy of dollar cost averaging (DCA) and compare it to the lump sum (LS) approach. By analyzing S&P 500 data from the past 40 years, I show that DCA is generally suboptimal, with LS outperforming it in 82% of cases, resulting in a 23% higher return on average. I also explore fine-tuning DCA by examining the impact of investment frequency and duration. Ultimately, the data suggests that investing all your money at once is a more favorable strategy. So, don't wait – start investing as soon as possible."
tags: stats finance
---

# Introduction

I never received financial education from my family, the only thing they taught me was the age-old adage of spending less than what one earns, but it never went further than that. After moving out of my parents' home and starting a new life with my beloved wife we started learning about personal finances and how to maximise our hard-earned money. This involved reading books, watching videos, and speaking with experts, but perhaps most significantly, speaking with friends facing similar circumstances, eager to uncover their strategies. In one of these conversations, I was explaining to one friend that every month we were investing some money in S&P 500 and that so far it was going well. He then told me something like “Yes that’s a good idea since you’re reducing the volatility and avoiding the probability of putting all your money at a high point”. He then suggested that were he blessed with a $10,000 fortune, he would gradually deploy it, in modest increments, over time. At the time it seemed like a sensible idea, an approach worth being considered. However, over time, I began to suspect that maybe it wasn’t as right as I thought at first. In this post, I’ll analyse S&P 500 data from the last 40 years and show that dollar cost averaging is usually suboptimal and that investing all the money at once is better.

As usual, all the data and code are available in my [GH repo](https://github.com/alexmolas/alexmolas.github.io/tree/master/notebooks/sp500).

# tldr

- Over the last 40 years dollar cost averaging performed worst than a lump sum strategy 82% of the time.
- While dollar cost averaging succeeds in reducing volatility, the lump sum strategy typically outperforms it by 23%.
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

![DCA-vs-LS](/docs/dca-is-suboptimal/dca-vs-ls.svg){: width="500" height="500"}

It's clear that LS overperforms DCA in the majority of days, but by how much? I computed the percentual difference between LS and DCA and plotted it in the next image. For 82% of the starting days, the LS approach was better than the DCA. In particular, on average, LS made 23% more than DCA.

![DCA-vs-LS-2](/docs/dca-is-suboptimal/dca-vs-ls-2.svg){: width="500" height="500"}

However, it's fair to point out that DCA succeeds in reducing the variance (risk) of the investments. In the next plot we see the distributions of returns of both DCA and LS. But, this reduction of the risk comes at a price, and the expected returns are diminished a lot (remember that in 82% of cases LS got better results than DCA.)

![distributions](/docs/dca-is-suboptimal/distributions.svg){: width="500" height="500"}

## Fine-tuning DCA: is it worth it?

In the last section, we saw that monthly DCA wasn't better than LS for investment periods of 5 years. However, the reader might have noticed that DCA depends on two parameters

* Investment frequency: how many investments do I want to do over the investment period? It's not the same to invest every month than to invest every week.
* Horizon: how long do I want to maintain the investments? It's not the same to invest over 1 year than over 10 years.

In the next two sections, I'll explore if DCA can be improved by tuning these two parameters.

### Frequency

Now let's delve into the influence of investment frequency on the performance of DCA. Investment frequency refers to how often you make investments within the designated investment period. It can vary from monthly investments to weekly or even daily investments.

To analyse the effect of this parameter, I have simulated DCA over a period of 5 years with different investment frequencies and compared them to the LS strategy. In the plot below you can see the percentage improvement of LS over DCA for different frequencies

![period-vs-difference](/docs/dca-is-suboptimal/period-vs-difference.svg){: width="500" height="500"}

The difference increases monotonically with the number of investments, which indicates that the fewer investment splits one makes the better, ie: if it's possible invest everything as soon as possible.

### Horizon

Finally, let's explore the impact of the investment horizon on the efficacy of DCA. The investment horizon represents the duration over which you maintain your investments. It could be as short as one year or as long as ten years, for instance.

In the next image, I plot the difference between a monthly DCA and LS for different investment lengths. Notice that the difference increases linearly with the investment duration.

![length-vs-difference](/docs/dca-is-suboptimal/length-vs-difference.svg){: width="500" height="500"}

This means that the performance of DCA in comparison to LS gets worse as more time passes, indicating again that LS is the best strategy to follow.

# Conclusions

In this post, I've shown that DCA is rarely a good investment strategy. This is because when one decides to follow DCA is implicitly expecting that the market to fall in the recent future. However, our experience - at least as far S&P 500 is concerned  - tells us that this is not what happens. 

The main conclusion of this post is then **invest all you have as soon as you can**, which is very similar to the well-known adage the best day to start investing was yesterday.

# Appendix

As pointed out by Marcel in [Linkedin](https://www.linkedin.com/feed/update/urn:li:activity:7072948689777958912?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7072948689777958912%2C7072961217580933120%29) these results are derived for the S&P 500 index which has been mostly up since its beginning, and it's legit to ask if these results apply to other indices such as Ibex35 or Nikkei. Here I add the plots for these two indices and their numbers

## Ibex 35

Ibex 35 is a market capitalization weighted index comprising the 35 most liquid Spanish stocks. The results are plotted in the next figure

![length-vs-difference](/docs/dca-is-suboptimal/dca-vs-ls-2-ibex-35.svg){: width="500" height="500"}

Here LS was better than DCA on 53% of the cases, and it yield 12% more returns. The results point to LS as the winning strategy, however the difference is not as sharp as before.


## Nikkei

Nikkei is an index that measures the performance of 225 large, publicly owned companies in Japan. The results are plotted in the next figure

![length-vs-difference](/docs/dca-is-suboptimal/dca-vs-ls-2-nikkei.svg){: width="500" height="500"}

Here LS was better than DCA on 69% of the cases, and it yield 16% more returns.

## Dax

Dax is a stock market index consisting of the 40 major German blue chip companies. The results are plotted in the next figure

![length-vs-difference](/docs/dca-is-suboptimal/dca-vs-ls-2-dax.svg){: width="500" height="500"}

Here LS was better than DCA on 77% of the cases, and it yield 21% more returns.