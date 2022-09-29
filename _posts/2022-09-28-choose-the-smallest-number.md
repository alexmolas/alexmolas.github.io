---
layout: post
title: "Choose the smallest number not chosen yet."
description: A game where you have to choose the smallest number that nobody has chosen yet. 
tags: game probability math nash-equilibrium
---

If you know me you know I love games where you can apply maths to obtain the best strategy. I've written several posts about this kind of games ([coin game paradox]({% post_url 2022-05-04-counterintuitive-coin-game %}), [Feynman restaurant problem]({% post_url 2022-05-09-feynman-restaurant-problem %}), and [continuous blackjack]({% post_url 2022-03-11-continuous-blackjack-i %})). In today's post, I'll present another game of the same kind: select the smallest unique integer [^1].

## Problem Statement

Imagine a game where each contestant has to pick a positive integer, and the winner is the one who chose the smallest number that nobody else has chosen. Assuming that players do not cooperate, which is the optimal strategy to maximize your winning probability?

## Solution

To simplify the problem, let's start with the simple scenario where you are competing against two other persons. We're not looking for a deterministic solution, like "you have to always choose 2", but rather a probabilistic solution. This is, we want to assign to each integer a probability of being chosen. Let's call $$p_i$$ the probability of choosing the integer $$i$$, and $$P = \{ p_1, p_2, ... \}$$ the set of probabilities. Our strategy is determined by $$P$$. From the definition of the game, it makes sense to find the [Nash equilibrium](https://en.wikipedia.org/wiki/Nash_equilibrium).

To start, assume that the other two players use the equilibrium probabilities $$P$$, and that you choose the integer $$i$$. Let's call $$Q_*$$ the probability of winning when following strategy $$*$$. The probability that you win in this circumstance comes from two components: (1) both players choose the same number $$j$$ and it's smaller than $$i$$, and (2) both players choose a number that's bigger than $$i$$. This is

$$
Q_i = \sum_{n=1}^{i-1} P_n^2 + \left(1 - \sum_{n=1}^i P_n\right)^2
$$

Since we're looking for the Nash equilibrium we've $$Q_i \leq Q_P$$, this is, the best winning strategy you have is to follow the strategy $$P$$. However, on the other hand, the probability of winning if you follow strategy $$P$$ is

$$
Q_P = \sum_{i=1}^\infty p_i Q_i
$$

so $$Q_P \leq \max_i Q_i$$. So we have

$$
\begin{cases}
Q_i \leq Q_P \\
\max_i Q_i \geq Q_P
\end{cases}
$$

which implies that all $$Q_i$$ should be equal. Putting all together, we get that the equilibrium strategy $$P$$ is given by the set of equations

$$ 
\begin{cases}
\sum_{n=1}^\infty P_n = 1 \\
Q_1 = Q_2 = Q_3 = \ldots 
\end{cases}
$$

where $$Q_i = \sum_{n=1}^{j-1} P_n^2 + \left(1 - \sum_{n=1}^j P_n\right)^2$$.

AFAIK, it doesn't exist a closed form for the probabilities $$P$$, but in the next section, I'll show how to get the probabilities using Python.

### Numerical solution

Here's a snippet that allows you to get the optimal probabilities

```python
from scipy.optimize import scipy

N_TRUNCATED = 10 # max number of terms to consider in our sums

def q(p, j):
    """
    Probability of winning given that other 
    players use strategy `p` and you choose integer `j`.
    """
    return sum([x**2 for x in p[0:j-1]]) + (1 - sum(p[0:j]))**2

def equations(p):
    """
    Given a set of probabilities `p` it returns the
    values of the equations to be solved.
    The equations are:
        [
            sum(p) - 1,
            q[i] - q[j]
        ]
    We want to find the values of `p` such that the 
    each equation is equal to 0.
    """
    norm = sum(p) - 1
    eqs = []
    for i in range(1, len(p)):
        # for each integer add the equation `q[i] = q[i+1]`.
        # this way we avoid to add redundant terms. 
        # Instead of `q1=q2, q1=q3, q2=q3`
        # use only `q1=q2, q2=q3`.
        qi = q(p, i)
        qj = q(p, i+1)
        eqs.append(qi - qj)
    return (norm, *eqs)

solution = fsolve(equations, x0=np.ones(N_TRUNCATED)/N_TRUNCATED)
```

Notice that in the analytical solution we're performing infinite sums. Here we're truncating the sums up to the first `N_TRUNCATED` terms. To solve the system of equations we use `scipy`, and we set an initial guess of $$P_0 = \{ \frac{1}{\text{N_TRUNCATED}},, ..., \frac{1}{\text{N_TRUNCATED}} \}$$.

Using above snippet one gets the following probabilities

```
|   1   |   2   |   3   |   4   |   5   |   6   |   7   |   8   |   9   | 10    |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|-------|
| 0.456 | 0.248 | 0.135 | 0.073 | 0.040 | 0.022 | 0.012 | 0.006 | 0.004 | 0.002 |
```

So, the best strategy is to select randomly a number using the above probabilities. With such a strategy, the expected payoff is given by `q(solution, 1)`, and it's $$\approx 0.296$$. This means, that if we follow this strategy we'll win a little bit less than one-third of the time.

## Next steps

In this post, we have presented the smallest unique integer game and how to derive the optimal solution. In particular, we've used the Nash equilibrium to compute with which probability we should choose each integer. However, we've solved a simplified version of the problem, since we've been assuming that we're playing against only two other persons. In the following posts, we'll see how to generalize the arguments made here when playing against $$N$$ other persons.


---

[^1]: This post has been heavily inspired by this [question](https://math.stackexchange.com/questions/80714/game-theory-unsure-how-to-proceed-with-this-question) in SO