---
layout: post
title: "Counting License Plates"
description: ""
tags: game maths
---

Since last October, I've been engaging in a simple game all by myself, with just one rule - I have to spot all the license plates from 0000 to 9999 in sequential order. Let me set the stage: where I live, license plates follow this format: `XXXX - AAA`, where `XXXX` represents 4 numbers, and `AAA` are three letters.

At the beginning, things got off to a slow start. I was only able to spot the `0000` license plate, and it was a bit frustrating. I realised I needed to up my numbers game. You see, for each license plate I encountered, I had a probability of $p=\frac{1}{10000}$ of spotting the correct one. My ultimate goal was to observe all 10,000 license plates before my time on this Earth is up - which I predict to be in around 50 years.

Now, figuring out the probability of spotting exactly $k=10000$ license plates out of a total of $n$ observations can be calculated using the binomial distribution equation:

$$
B(k; n, p) = \binom{n}{k} p^k(1-p)^{n-k}
$$

To succeed, I wanted an overall success probability of 80%. So, I had to solve $B\left(10000; n, \frac{1}{10000}\right) = 0.8$, which resulted in $n=100840592$. That means I would need to see approximately $10^6$ license plates during my life to have a decent chance of winning this game. In other words, I'd have to spot around 5000 license plates every single day for the next 50 years. Now, even though I love playing games and winning, that seems like a truly uphill task.

So, I decided to take it easy and change the game a bit. Instead of aiming to spot all the license plates from `0000` to `9999`, I opted to look for plates between `*000` and `*999`, where `*` can be any number. This relaxation allowed me to progress up to `*052`.

Since starting in October, I've had 52 successful spottings. By using some math magic, I estimated that I've probably seen around $52/(1/1000) = 52000$ cars, which amounts to roughly 190 cars every day. With these numbers in mind, my probability of success in the next 50 years is quite high, approximately 1, thanks to $B(1000; 190 \times 365 \times 50, 0.001)$. It also means I have a solid 90% chance of winning within the next 15 years, and that's good enough for me.

So, there you have it! Using some basic statistics saved me from wasting years of my life pursuing an impossible game to win.

That wraps up today's post. Next time, I'll delve into another fun game involving license plates. Stay tuned!