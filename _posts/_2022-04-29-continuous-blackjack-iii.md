---
layout: post
title: "Continuous Blackjack (iii): exponential distribution."
description: ...
tags: probability math optimization
---


This is the third part of a series about continuous blackjack ([first]({% post_url 2022-03-11-continuous-blackjack-i %}) and [second]({% post_url 2022-03-24-continuous-blackjack-ii %})). In this new post we'll analyze what happens if instead of using a uniform distributino we use an exponential one.

# Recap

Before continuing let's do a brief summary of what we have derived until now.

1. $F(t; a, b)$: is the probability of falling in the range $(a, b)$ given that we're currently in $t$.
    2. In the particular case of $P=U[0,1]$ we have $F(t; a, b) = (b-a) e^{a-t}$.
    3.  The general equation is $F(t; a, b) = \int_a^b P(x-t) dx + \int_t^a P(x-t)F(x; a, b)dx$
4. The equation for the optimal threshold can be obtained by maximizing the winning probability.
    5. In the general case of 1-vs-N+1, this equation the optimal threshold is given by $(1 - F(0;\alpha,1))^{N} = \int_\alpha^1 (1 - F(0;s,1))^{N}ds$

# Exponential distribution

## Deriving $F(t; a, b)$

Until now we have focused in the case where we draw random numbers from a uniform distribution. Let's focus now in the case of $P(x) = \lambda e^{-\lambda x}$.
 In this case $F(t; a, b)$ is given by

$$
F(t; a, b) = \int_a^b \lambda e^{-\lambda(x-t) dx} + \int_t^a \lambda e^{-\lambda (x-t)} F(t; a, b) dx = \lambda e^{\lambda t} \left( \int_a^b e^{-\lambda x} dx + \int_t^a e^{-\lambda x} F(t; a, b) dx \right).
$$

Defining $C = \left( e^{-\lambda a} - e^{-\lambda b} \right) / \lambda$ we get

$$
F(t; a, b) = \lambda e^{\lambda t} \left( C + \int_t^a e^{-\lambda x}F(t; a, b) dx\right)
$$

Now, differentiating with respect to $t$ we get

$$
\frac{\partial F(t; a, b)}{\partial t} =
 \lambda^2 e^{\lambda t} \left( C + \int_t^a e^{-\lambda x}F(t; a, b) dx\right)
 + \lambda e^{\lambda t}\left(0-e^{-\lambda t}F(t; a, b)\right) =
\lambda F(t; a, b) - \lambda F(t; a, b) = 0
$$

Wow!! $F(t; a, b)$ doesn't depend on $t$! Using this and $F(a; a, b) = 1 - e^{- \lambda (b-a)}$ we finally get

$$
F(t; a, b) = 1 - e^{- \lambda (b-a)}
$$


## Deriving winning probability $\langle p_{win}(\alpha) \rangle $

[Here]({% post_url 2022-03-24-continuous-blackjack-ii %}) we derived the general equation for the expected winning probability

$$
\langle p_{win}(\alpha) \rangle = \int_\alpha^1 (1-F(0; s, 1)) \frac{\partial F(0; \alpha, y)}{\partial y} ds
$$

# Results


# Specific case: uniform distribution

## Simulations

We can get $F(t; a, b)$ numerically for any distribution. Fix $t=0$, $b=1$. Then run through multiple $a$ and for each one store the probability of falling in $(a, 1)$. After that, we can solve $\left[1 - F(0; \alpha_n, 1) \right]^n = \int_{\alpha_n}^1 P(x - \alpha_n) \left[ 1 - F(0; x, 1) \right]^n dx$ numerically.

## Analytical results

Assuming a distribution $U[0, 1]$ the equation for the optimal $\alpha$ is

$$
\left[1 - (1-\alpha_n)e^{\alpha_n}\right]^n = \int_{\alpha_n}^1 \left[ 1-(1 - x)e^x \right]^n dx
$$

We can solve the problem for any $N$ using the following snippet:

```python
import numpy as np
from scipy.optimize import fsolve
from scipy.integrate import quad

class Problem:
    def __init__(self, n):
        self.n = n
    def rhs(self, x):
        return quad(lambda t: (1-(1-t)*np.exp(t))**self.n, x, 1)[0]
    def lhs(self, x):
        return (1 - (1 - x) * np.exp(x))**self.n
    def f(self, x):
        return self.rhs(x) - self.lhs(x)
    def solve_problem(self):
        return fsolve(self.f, x0=1)
```

In the following plots, we can see the rhs and lhs of the optimality equation. The solution is the point at which the lines cross. Notice that as we increase $N$ the optimal threshold also increases, which intuitively makes sense because if there are more players playing the game it's more difficult to win them all.


<div style="text-align:center">
    <img src="/docs/continuous-blackjack/plot-n.svg" width=900px class="center">
    <figcaption>Fig.2 - Plot of the curves for a set of $N$.</figcaption>
</div>
<br/>

In the following table we have the optimal values for a couple of $N$, and we have also plotted $\alpha_n$ vs $n$. It's interesting to note how fast the curve arrives to almost 1.

$$
\begin{array}{c|c!c|c}
        n & \text{optimal } \alpha & ~ & n & \text{optimal } \alpha \\ \hline
        1 & 0.570557 & ~ & 6 & 0.834191 \\ \hline
        2 & 0.687916 & ~ & 7 & 0.849900 \\ \hline
        3 & 0.748671 & ~ & 8 & 0.862558 \\ \hline
        4 & 0.787111 & ~ & 9 & 0.873008 \\ \hline
        5 & 0.814059 & ~ & 10 & 0.881806 \\
\end{array}
$$



<div style="text-align:center">
    <img src="/docs/continuous-blackjack/plot-a-vs-n.svg" width=300px class="center">
    <figcaption>Fig.3 - Plot of the best threshold vs the number of players.</figcaption>
</div>
<br/>


# Conclusions

In this first post we have derived the generic equation for the probability of falling in a range $(a, b)$ given that we're currently in $t$, and we have also derived the condition that the optimal thresholds have to fulfill. Then, we have studied the particular case of the uniform distribution and studied it's properties.

In the following posts we will study how all these results change when the distribution $P$ changes. In particular, we will show some experimental results for the $N+1$ players game for several distributions.
