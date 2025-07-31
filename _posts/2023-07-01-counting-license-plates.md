---
layout: post
title: "A game for the next 15 years: counting license plates"
description: ""
tags: game maths
---

Since last October, I've been playing in a simple game all by myself, with just one rule - I have to spot all the license plates from 0000 to 9999 in sequential order. Where I live, license plates follow this format: `XXXX - AAA`, where `XXXX` represents 4 numbers, and `AAA` are three letters.

At the beginning, things got off to a slow start. I was only able to spot the `0000` license plate, and it was a bit frustrating. I realised I had to use my numbers game to see what was going on. You see, for each license plate I encountered, I had a probability of $p=\frac{1}{10000}$ of spotting the correct one. My ultimate goal was to observe all 10,000 license plates before my time on this Earth is up - which I predict to be in around 50 years.

Now, figuring out the probability of spotting exactly $k=10000$ license plates out of a total of $n$ observations can be calculated using the binomial distribution equation:

$$
B(k; n, p) = \binom{n}{k} p^k(1-p)^{n-k}
$$

To succeed, I estimate that an overall success probability of 80% is enough. So, I had to solve $1 - \int_{0}^{10000} B\left(x; n, \frac{1}{10000}\right) dx = 0.8$, which resulted in $n=100840592$. That means I would need to see approximately $10^8$ license plates during my life to have a decent chance of winning this game. In other words, I'd have to spot around 5000 license plates every single day for the next 50 years. Now, even though I love playing games and winning, that seems like a truly uphill task.

So, I decided to take it easy and change the game a bit. Instead of aiming to spot all the license plates from `0000` to `9999`, I opted to look for plates between `*000` and `*999`, where `*` can be any number. This relaxation allowed me to progress up to `*052` as of today.

Since starting in October, I've had 55 successful spottings. By using some math magic, I estimated that I've probably seen around $55/(1/1000) = 55000$ cars, which amounts to roughly 200 cars every day. With these numbers in mind, my probability of success in the next 15 years is quite high, approximately $1$, thanks to $1 - \int_0^{1000} B(x; 200 \times 365 \times 50, 0.001) \approx 1$ which is good enough for me.

So, there you have it! Using some basic statistics saved me from wasting years of my life pursuing an impossible game to win.

While writing this text I realised that another way to succeed in the original game is to distribute it among $N$ people. I "only" need to convince around $N \sim 5000/190 \sim 25$ people to play this game to have the same winning probabilities as in my current simplified version of the game. What do you say? Do you want to help me?

---

PS. After one year I managed to spot plates from `**00` to `**99`. And after that I stopped playing the game.