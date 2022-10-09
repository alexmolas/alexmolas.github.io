---
layout: post
title: "Counterintuitive statistics (i): a fair coin game."
description: A counterintuitive experiment with fair coins.
tags: stats probability math game
image: /docs/coin-paradox/wealth-vs-mpc.svg
---

I love paradoxes and counterintuitive gedankenexperiments (thought experiments). In this post I will present a paradox consisting of a game with coins and bets.

Imagine the following game:

The initial stake begins at 2 dollars and is doubled every time heads appear. The first time tails appear, the game ends and the player wins whatever is in the pot. Mathematically, the player wins $$ 2^{k+1} $$ dollars, where $$k$$ is the number of consecutive head tosses. 

The question is then, how much money would you pay to play this game?

The logical decision would be to compute the expected prize of the process and just pay a little bit less to enter the game. Let's do the numbers!

$$
\langle \text{prize} \rangle = \sum_{i=0}^{\infty} p_i \times \textrm{prize}_i = \sum_{i=1}^{\infty} \frac{1}{2^i} 2^i = \sum_{i=0}^{\infty} 1 = \infty
$$

WOW! The expected prize is $$\infty$$, which means that a rational player would be willing to pay an infinite quantity of money to play the game.

# Classical solutions

It turns out this paradox is a well-documented thing, and it's called the [St. Petersburg Paradox](https://en.wikipedia.org/wiki/St._Petersburg_paradox). In this section, we'll explore some solutions that people much more intelligent than me have encountered to the paradox.

## Utility theory

One of the solutions to the paradox comes from David Bernoulli (from the amazing [Bernoulli family](https://en.wikipedia.org/wiki/Bernoulli_family)). The solution is based on the fact that the gain of the game has a different utility depending on the total wealth of the player. In Bernoulli's words

> The determination of the value of an item must not be based on the price, but rather on the utility it yields. There is no doubt that a gain of one thousand ducats is more significant to the pauper than to a rich man though both gain the same amount.
  
The solution that Bernoulli presented was based on the logarithmic utility function, which is $$U(W) = \log W$$, where $$W$$ is the total wealth of the player. This means that a gain of weatlth $$k$$ implies a gain of utility of $$\Delta U = \log (W + k) - \log(W)$$. Therefore, the expected gain in utility is given by

$$
\Delta E(U) = \sum_{i=1}^\infty \frac{1}{2^i} \left[ \log(W + 2^i - c) - \log(W) \right]
$$

where $$c$$ is the cost of playing the game. A player must be willing to pay any $$c$$ that returns a positive value of $$\Delta E(U)$$.

To compute the maximum $$c$$ that a player would be willing to pay we can use the following python snippet

```python
import numpy as np

COSTS = np.linspace(0, 50, 500) # search the maximum cost to pay in this range
MAX_THROWS = 50 # sum only the first MAX_THROWS elements

def max_profitable_cost(w):
    expected_payoff = np.array([sum(1/2**i * (np.log(w + 2**i - cost) - np.log(w)) 
                                    for i in range(1, MAX_THROWS)) 
                                for cost in COSTS])
    return COSTS[len(expected_payoff[expected_payoff > 0])]
```


![wealth-vs-mpc](/docs/coin-paradox/wealth-vs-mpc.svg){: width="300" height="300" .left}


For a millionaire the maximum profitable cost to pay is `max_profitable_cost(10**6) = 20.92`, and for Jeff Bezos (175 billion USD) `max_profitable_cost(Jeff Bezos) ~ 38.5`.
 
In the left plot, we show the relationship between the wealth of the player and the maximum profitable cost. It's interesting to note that the maximum profitable cost grows logarithmically with respect to the wealth of the player, which is extremely slow.

<br>

## Finite resources

The classical approach to the paradox assumes an infinite amount of money by the casino. Another solution to the problem is based on the fact that no infinite supply of money exists. 

Suppose that the maximum amount of money that the casino can pay is $$M$$. Then, the maximum number of rounds that a casino can pay is given by $$2^{k+1} = M$$, which is $$k^* = \textrm{floor} \left[ \log_{2} M \right] $$. Therefore, the expected value is

$$
\langle \textrm{prize} \rangle = \sum_{i=1}^{k^*} \frac{1}{2^i} 2^i = k^*
$$

This means that if you were playing against Elon Musk (265 billion USD), your expected winnings would be approximately 38 dollars. So, even if you convince Elon Musk to play this game you would get on average less than 50 dollars.