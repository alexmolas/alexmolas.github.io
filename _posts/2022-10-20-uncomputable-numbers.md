---
layout: post
title: "Computability Theory (ii): uncomputable numbers."
description:
tags: math computability-theory
---

During my current incursion in computability theory I learnt about uncomputable numbers, this is, numbers that can't be computed with arbitrary precision. This means that even given all the computational power in the universe you could not compute these numbers. Even if God himself came from Heaven, he could not compute these numbers. Uncomputable numbers are numbers that can't be computed because of maths limitations. Just the idea that maths has some inherent limits amazed me. In my [last post]({% post_url 2022-10-19-halting-problem %}), I talked about the halting problem, which is a limitation of maths, but the halting problem is a little bit abstract in my opinion. In this post, instead, I'll show that there are numbers for which we can know an approximate value but can't be known with arbitrary precision.

## Busy Beaver Numbers

Let's start by defining the [Busy Beaver](https://en.wikipedia.org/wiki/Busy_beaver) $n$-game. Its rules are the following

- You write a function using $n$ symbols.
- The winner is the method that
    - prints more characters,
    - and eventually halts (methods that print an infinite number of times do not win)

Let's define the [Busy Beaver](https://en.wikipedia.org/wiki/Busy_beaver) Number $\Sigma(n)$ as the number of prints that the absolute winner of the Busy Beaver $n$-game does. This is, $\Sigma(n)$ is the maximum number of prints you can do with a program with $n$ characters that eventually halts.

These numbers were first defined by Tibor Radó in the paper [On Non-Computable Functions](https://www.gwern.net/docs/cs/computable/1962-rado.pdf). For a more precise and mathematical definition of the game please read the original article. 

## Relation with halting problem

What I find fascinating about these numbers, is that they can't be computed for all $n$. We can prove that by contradiction by assuming that we have a method `busy_beaver_number()` that returns the value of $\Sigma(n)$ for any $n$. If that was true we could then define the following `halts` method

```python
def busy_beaver_number(n: int) -> int:
	...
	
def halts(program) -> bool:
	n_steps = 0
	bb = busy_beaver_number(len(program))
	while n_steps < bb:
		run_step(program)
		n_steps += 1
	if has_halted(program):
		return True
	return False
```

This is, given a program of length $n$ run the program for `busy_beaver_number(n)` steps. If after these steps the program hasn't halted it means it'll never halt (by the definition of the $\Sigma(n)$). Since we know that the halting problem can't be solved we must conclude that our initial assumption is wrong, and therefore busy beaver numbers can't be computed for any $n$.

However, we can compute $\Sigma(n)$ for some $n$. Currently (2022) the known busy beaver numbers are

- $\Sigma(1) = 1$
- $\Sigma(2) = 6$
- $\Sigma(3) = 21$
- $\Sigma(4) = 107$
- $\Sigma(5) >47,176,870$
- $\Sigma(6) >8,690,333,381,690,951$

We can say that $\Sigma(n)$ grows too fast to be computable.

> Computable numbers are real numbers that can be computed within any desired precision by a finite, terminating algorithm.
{: .prompt-info}


## Small uncomputable numbers

In the last section, I showed that $\Sigma(n)$ grows incredibly fast, and then it can't be computed. However, in this section, I want to show you that not all uncomputable numbers are enormous. Let's define $\Omega$ constant as

$$
\Omega = \sum_{i=1}^{\infty} 2^{-\Sigma(i)}
$$

Since $\Sigma(n)$ grows faster than any other standard function we know that the sum converges to some value. However, since we don't know $\Sigma(n)$ we can't know the exact value of $\Omega$. But, what's interesting is that, even if we can't know the exact value, we can compute its first digits

$$
\Omega = 2^{-1} + 2^{-6} + 2^{-21} + 2^{-107} + ... = 0.515625476837158...
$$

So we have a number for which we can compute some of its digits but we can't know with arbitrary precision. That's amazing!

Let me emphasize some things about the above result by comparing $\Omega$ and $\pi$. For both cases we can give upper and lower bounds, ie: $\pi \in (3.14, 3.15)$ and $\Omega \in (0.51, 0.52)$. In the case of $\pi$, we don't know all of its digits, however, we can compute it with arbitrary precision. For example, using the [Chudnovsky formula](https://en.wikipedia.org/wiki/Chudnovsky_algorithm) 

$$\frac{1}{\pi} =\frac{\sqrt {10005}}{4270934400} \sum_{k=0}^{\infty }\frac{(6k)!(13591409+545140134k)}{(3k)!\,k!^{3}(-640320)^{3k}}$$

Currently, the number of known digits of $\pi$ is [100 trillion](https://cloud.google.com/blog/products/compute/calculating-100-trillion-digits-of-pi-on-google-cloud). On the other hand, we can't compute $\Omega$ with an arbitrary level of precision. We know it exists, and we know more or less its value, but we will never have an algorithm that can calculate it as precisely as we want.

Maybe this is a known fact by most mathematicians, but for me (a simple physicist) this has been a revelation that has changed my perception about maths (and physics as well). Hope you have enjoyed this post as much as I have enjoyed this discovery.
