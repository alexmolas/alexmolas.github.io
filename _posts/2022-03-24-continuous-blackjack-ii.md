---
layout: post
title: "Continuous Blackjack (ii): deriving basic equations from two other perspectives."
description: Deriving same equations with different methods
tags: probability math optimization
---

---

**Table of contents:**
- [Maximizing winning probability](#maximizing-winning-probability)
- [Maximizing expected payoff](#maximizing-expected-payoff)
---

In the last [post]({% post_url 2022-03-11-continuous-blackjack-i %}), we derived some basic equations of the continuous blackjack game. In this post, we will show other ways - maybe more intuitive - to derive the same results.


# Maximizing winning probability


The first method to get the optimal threshold is the most direct one: given the probability of winning $p(\alpha)$ find its maximum. This is a problem that any high schooler is used to solving, so we believe that this approach can be more intuitive than the previous one. Now the problem comes to determine $p(\alpha)$. Let's define it first using words, and after we will translate it to maths.

$$
p(\alpha) = p_1(\alpha) \times p_2(\alpha)
$$

where 

1. $p_1(\alpha)$ is the probability of 1st player landing $(\alpha, 1)$.
2. $p_2(\alpha)$ is the probability of 2nd player going bust while trying to reach $s$, given that 1st player has a score $s$, summing over all the possible $s$.

The value of $p_1(\alpha)$ is simply $F(0; \alpha, 1)$ - as we have derived in our first [post]({% post_url 2022-03-11-continuous-blackjack-i %}). And $p_2(\alpha)$ is

$$
p_2(\alpha) = \int_{\alpha}^{1} \frac{1}{1 - \alpha} (1 - F(0; s, 1)) ds
$$ 

where $\frac{1}{1 - \alpha}$ is the probability of 1st player landing in $s$. And  $(1 - F(0; s, 1)$ is the probability of the 2nd player going bust given that the 1st player is in $s$. For $n+1$ players we just need to compute the probability of all the $n$ players going bust, which is $(1 - F(0; s, 1))^n$ 

Finally, we get

$$
p_n(\alpha) = F(0; \alpha, 1) \int_\alpha^1 \frac{1}{1-\alpha} [1 - F(0; s, 1)]^n ds
$$

And now $\alpha^*$ is given by

$$
\frac{d p_n(\alpha)}{d \alpha} \bigg|_{\alpha=\alpha^*} = 0
$$

## Solving the equation

Let's now derive the optimal threshold by differentiating and equaling to zero. First of all, using $F(0; \alpha, 1) = (1 - \alpha)e^\alpha$ we can simplify $p_n$ to

$$
p_n = e^\alpha \int_\alpha^1 (1 - F(0; s, 1))^n ds
$$

Now using [Leibniz integral rule](https://en.wikipedia.org/wiki/Leibniz_integral_rule) we have

$$
\frac{d p_n(\alpha)}{d \alpha} = e^\alpha \left(\int_\alpha^1 (1-F(0;\alpha,1))^nds - (1-F(0;\alpha,1))^n\right)
$$ 

Hence, the optimal value is given by

$$
(1-F(0;\alpha,1))^n = \int_\alpha^1 (1-F(0;\alpha,1))^n ds
$$

which is the same equation we derived in our last post.

# Maximizing expected payoff

Another way to derive the equation for the best strategy is to maximize the expected payoff. In general, the expected value of a random variable $X$ with a pdf $f(x)$ is $\left< x\right> = \int_{-\infty}^{\infty} xf(x) dx$. In our case $x = (1 - F(0; x, 1))$ is the probability of the other player going bust. On the other hand, density $f$ can be obtained using

 $$F(0; x, y) := P(S(x) \leq y) = \int_0^y f(S(x))dx$$

 where $S(x)$ is the sum obtained for a threshold $x$. Therefore, 
 
 $$f(S(x)) =\frac{\partial F(0; x, y)}{\partial y}$$
 
 and finally, our expected outcome is

$$
\left< p_{win}(\alpha) \right> = \int_\alpha^1 (1 - F(0; s, 1)) \frac{\partial F(0; \alpha, y)}{\partial y} ds
$$

In the particular case of $P=U[0, 1]$ we know that $F(0; x, y) = (y - x)e^x$. Thence, the expected outcome is

$$
\left< p_{win}(\alpha) \right> = e^\alpha\int_\alpha^1 (1 - F(0; s, 1)) ds
$$

which is the same equation as the one derived in the last section.

# Conclusions

In this post, we have derived two new ways to determine the optimal threshold for the continuous blackjack game. This may seem like a waste of effort since similar equations were derived in the last post. However, we believe that knowing how to derivate the same result through different methods is always a good investment of time. If you don't agree with this last assertion we recommend you to read [this blog post](https://nabeelqu.co/understanding).

If you have some other way to derive the same results feel free to add them in the comments!