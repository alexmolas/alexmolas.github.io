---
layout: post
title: "Different Types of Means" 
description: Understand the different types of means and when to use them.
tags: math
---

Some months ago, someone posted some interviewing tips in r/datascience (the original post has been deleted, but you can read it [here](https://www.reddit.com/r/datascience/comments/w9jl5m/comment/ihvhbpz/?utm_source=share&utm_medium=web2x&context=3)). The post quickly became a meme, mainly due to misogynistic comments and tips that were far from useful. One of the proposed questions was about the difference between the arithmetic and the harmonic mean. I know both formulas, so I thought I would pass this user's interview. However, after some reflection, I realized that I don't really understand the concepts in depth. When could it be useful to use the harmonic mean instead of the arithmetic one? And how do they relate to the geometric mean? Apparently, this is common knowledge, but for some reason, I never came across this information during my studies. So, I'm writing this post for my future self and to better understand the concepts.

# Summarizing Random Variables

Arithmetic, harmonic, and geometric means are methods to summarize a set of random variables. While you can apply any of these methods to any series of numbers, it doesn't always make sense to do so since each one has its own meaning and area of application.

For example, if I want to summarize how much I earn each month, I can compute the arithmetic mean of the monthly salaries and call it $x$. Then, I can say, 'I've earned $x$ dollars a month during one year.' This makes sense since I can substitute the actual salary of each month with $x$, and the total amount of perceived salary would still be the same, i.e., $x \times 12$.

However, if I'm investing in the stock market, I can't use the arithmetic mean to summarize the monthly returns since I would overestimate the total returns at the end of the year. Instead, I should use the harmonic mean.

In the following sections, I'll present these means and explain in which cases we should use each one.

# Arithmetic Mean

* **When**: When the changing values are aggregated linearly, for example, to compute the average salary during a year.

* **How**: 

$$
\bar{x}_a = \frac{1}{n}\left( \sum_{i=1}^n x_i \right)
$$

* **Example**: Following the example from the last section about salaries, we can compute the average salary as $\frac{1}{7}(5 + 5 + 10 + 5 + 10) = 5$.

# Harmonic Mean

* **When**: When the changing value is in the denominator, for example, to compute the average changing rate of some variable.

* **How**:  

$$
\bar{x}_h = n \left( \sum_{i=1}^n \frac{1}{x_i} \right)
$$

* **Example**: Speed is defined as the changing rate of distance with respect to time. Therefore, if I travel from $A$ to $B$ at a speed of 100 km/h and back from $B$ to $A$ at a speed of 50 km/h, the distance traveled in both cases is the same (i.e., $\overline{AB}$) but the time spent is different. Then, to compute the average speed, we should use the harmonic mean as $\frac{2}{\frac{1}{100} + \frac{1}{50}} = 67$ km/h, which is different from the arithmetic mean $\frac{100 + 50}{2} = 75$ km/h.

# Geometric Mean

* **When**: When the changing values are multiplied between them, for example, in exponential growth or compound interests.

* **How**: 

$$
\bar{x}_g = \left( \prod_{i=1}^n x_i \right)^{1/n}
$$

* **Example**: If I'm investing my money and the annual returns are $[5\%, 0\%, 5\%, 10\%, 0\%, 5\%, 10\%]$, then the arithmetic mean is 5%. But if I substitute all the values with 5%, I would overestimate the total returns since $1.05 \times 1 \times 1.05 \times 1.1 \times 1 \times 1.05 \times 1.1 < 1.05^7$. The correct value is given by the geometric mean as $\sqrt[7]{1.05 \times 1.05 \times 1.1 \times 1.05 \times 1.1} = 1.04932$.

# Conclusions

To be honest, there are not a lot of conclusions to add here, but I'm used to writing this section at the end of every post, so here we are. The objective of this post was to help me understand and clarify these concepts, so I could just keep it to myself, but maybe it can be helpful to someone else in the future (or maybe to the future Alex), so I'll publish it anyway.
