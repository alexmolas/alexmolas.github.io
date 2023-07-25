---
layout: post
title: "You're the best at something."
description: "In this text I use math to show that you have a rare skill combination, that makes you the best at something."
tags: math
---

---
**Disclaimer**. I wrote this text as a funny mathematical exercise. It's not meant to be a rigorous derivation. It's just some "motivational" text inspired by maths, similar to the motivational equation $1.01^{365} \approx 37$.  
I'm saying that because every time I write a text like that some people take it literally and say things like "This text doesn't make any sense, please go back to school and learn some maths".

Don't worry about the haters, let them be lost in the fog of confusion while we bask in the glory of math humor.

---

In machine learning, when dealing with a lot of features a non-desired phenomenon arises, the feared "curse of dimensionality." One of the effects of this curse is that as the dimension increases the volume of a sphere tends to be concentrated near the boundaries. This can be a problem when doing statistics, but in this text, I'll show how this is a blessing for you since it means that when it comes to skills, you're unique like a snowflake in a blizzard of possibilities.

Let's start with some assumptions
- A person is defined by $N$ different traits. From my experience it's fair to assume that $N$ is very big, let's set $N=500$ for the moment. 
- We can assign to each skill a value between $0$ and $1$, and for the sake of simplicity assume also that the distribution of these values is uniform (probably it's better to assume that's Gaussian or a fat-tailed distribution, but let's keep it simple). 
- Skills values are independent.
- When you're born you get assigned a value at random for each different trait. 
- We say that you are very good at some skill if you have a value bigger than the $99\%$ of the population for that trait. 

With these assumptions, the question we ask is what is the probability of being the best at something?

Since each trait is independent we have a probability of $p=1-0.99=0.01$ of being very good at that dimension. Since we have $N$ dimensions the probability of being very good in at least one of the features is given by

$$
1 - (1 - p)^N = 0.9934
$$

which means that you're probably one of the best in the world on at least one thing with a probability of almost $1$, which is pretty cool.

However, you may be better than the rest at more than one thing. For example, you can be a good mathematician and a good football player (like [Harald Bohr](https://en.wikipedia.org/wiki/Harald_Bohr)). The probability of being better than the other at exactly $M$ things is given by the binomial distribution $B(M;N,p) = \binom{N}{M} p^k(1-p)^{N-M}$  . But we are interested in the probability of being better than the other on $M$ or more traits. We can get this value by summing for all values $>M$ , ie

$$
\sum_{i=M}^\infty B(i;N,p) = 1 - \sum_{i=0}^M B(i;N,p)
$$

where we have used that the sum from $0$ to $\infty$ must sum up to $1$.

If we compute this probability for different values of $M$ we get the following curve

<figure>
  <img src="/docs/best-at-something/distribution.svg" alt="Probability of being better than the other on $M$ or more traits is" width="500" class="center" />
</figure>

In the image, we see there's a decent chance of being the best on at least $2$ or $3$ things out of the $500$ possibilities. Maybe it doesn't sound impressive, but now we'll see that your specific combination of skills is something rare.

The binomial coefficient $\binom{n}{m} = \frac{n!}{m!(n-m)!}$ can be used to compute the number of ways, disregarding order, that $m$ objects can be chosen from among $n$ objects. In our case we can use it to compute the different combinations of being the best at $3$ things out of $500$ possibilities, ie $\binom{500}{3} \sim 10^{7}$ . This means that there are about ten million different combinations of $3$ skills which imply that your specific combination of skills is pretty unique. Only one out of ten million people have the same combination as you, this is, only a couple of hundred people in the world.

The next question to answer is "So what?". What can you do now with this information? I'm afraid that there's not so much you can do with this information. Maybe you're the fastest at multiplying big numbers, the best at cleaning kitchens, and the best at calming horses. What to do with these super specific set of features is up to you, but if you can find something that combines all these features and gives you money you're going to be very rich. The problem is, of course, to find a way to monetize or do something useful with this set of skills.

However, even if you can't get money out of your skills it's cool to know that you're not just another one in the world. You're one of the few members of an exclusive club of "Horse-Calming, Kitchen-Cleaning, Big-Multiplying." Move over, Avengers!

Finally, let me clarify that this text makes a lot of assumptions that do not hold in reality, and I'm aware of that. For example, it's known that skills are not independent between them, eg: if you're good at math you're going to be good at physics too.  Also, I'm assuming that your talents are fixed when you are born and that you can't do anything to improve them, which is of course false. Also, I decided to set the number of skills $N=500$ using my intuition, which has been proven in the past to be not very accurate. If you know of resources about this topic that point to a better $N$ I would be happy to read it and update the post!
