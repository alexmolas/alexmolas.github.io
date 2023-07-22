---
layout: post
title: "The Sweet Spot for Buying Used Cars."
description: "In this post, I show how can we leverage the extra information we get from knowing that a car has survived a certain amount of time. I formalize the idea mathematically and then build a framework to optimize the total costs."
tags: maths data-analysis optimization
---

# tldr

When considering buying a used car, you're not just acquiring a mode of transportation, but also valuable insight into the car's longevity. By knowing the car has stood the test of time for a certain number of years, you can make an informed decision on its durability. Additionally, it's a well-known fact that the price of a car decreases as it ages. By combining these two pieces of information, you can craft a strategy to minimize your overall spending on cars throughout your lifetime. In this post, we'll reveal the sweet spot for purchasing used cars - around $14$ years old.

The notebook I used to generate the results in this post can be found [here](https://github.com/alexmolas/alexmolas.github.io/blob/master/notebooks/used-cars/used-cars-simulation.ipynb).


# Introduction

The other day I was talking with a friend and she said me something along the lines

> I have the impression that used cars break less than new cars.

At that moment, I thought "survivorship bias strikes again! when you buy a used car you're buying a car that has survived at least $X$ years, which increases its expected lifetime". Of course, I didn't say any of this out loud, because I don't want to lose the few friends that still talk to me. But the seed of the idea was already implanted in my brain, so I finished the conversation as fast as I could and I ran home to formalize this idea and use it to design an optimal strategy about how to buy cars [^1].

# Solution

## Assumptions

To avoid an explosion of complexity I do some assumptions, that while still maintaining the core of the problem minimize the complexity of the problem. In particular, I assume that

- All cars have the same properties
  - Lifetime distribution is given by a Weibull. More about that later.
  - The price of a new car is \$ $20000$.
  - The lowest price an old car can have is \$ $1000$.
- You will need a car from the time you turn 20 until you are 80.
- Once you buy a car you will use it until it breaks. 


## Maths
Let's start by defining the distribution of cars' lifetimes. According to this [paper](https://www.iioa.org/conferences/27th/papers/files/3757_20190426071_IIOAfullpaper_SK_SK_SK_IU_YN.pdf), the expected lifetime of a car is given by a Weibull distribution



$$
f(x; \lambda, k) = 
\begin{cases}
  {\frac {k}{\lambda }}\left({\frac {x}{\lambda }}\right)^{k-1}e^{-(x/\lambda )^{k}},&x\geq 0,\\
  0,&x<0
\end{cases}
$$

with parameters around $\lambda = 12$ and $k = 2$. The distribution looks like


<figure>
  <img src="/docs/used-car/weibull.svg" alt="fig. 1" width="500" class="center" />
</figure>

The above distribution works for a car when we don't have further information, but how does this distribution change if we already know that a car has $T$ years? If we observe a car that's $T$ years old the new distribution is

$$
f(x | X>T) =  \frac{g(x)}{1 - F(T)}
$$

where $g(x) = f(x)$ for $x>T$ and $0$ everywhere else, and $F(x)$ is the cumulative distribution. So to update the distribution after having observed a car that's $T$ years old we just have to truncate the distribution and normalize it. 

With this updated distribution we can compute the new expected lifetime. This is, which is the expected lifetime of a car after having observed it has lived for $T$ years

$$
\langle x \rangle_T = \int_T^\infty x f(x | X>T) dx 
$$

The following plot show $\langle x \rangle_T$ as a function of $T$. The dashed line is the identity, and it shows how $\langle x \rangle_T$ approaches asymptotically to it.

<figure>
  <img src="/docs/used-car/expected-lifetime.svg" alt="fig. 2" width="500" class="center" />
</figure>

With this information we can compute the expected remaining lifetime of the car, aka its utility, as


$$
U(T) = \langle x \rangle_T - T
$$

This means that if we buy a car that's $10$ years old, and we know its expected lifetime is $15$, then we could use the car for $5$ years, so the utility of the car is $5$ years.

On the other hand, we also know that the price of a car decreases with time. According to [Schibsted](https://schibsted.com/blog/price-car-data/)  (one of the biggest marketplaces in the world, with a ton of cars data), the price of a car can be modelled as $c(t) = c_0 \exp \left(-\alpha t\right)$. However, this model has a problem because $\lim_{t \to \infty} c(t) = 0$ , so if we wait long enough, the price of a car is going to drop to $0$, and it doesn't make sense since no one is giving cars for free. Also, there's an associated cost of changing cars such as paperwork and lost time. I'll introduce a minimum price $c_\infty$  as

$$
c(t) = c_0 \exp(-\alpha t) + c_\infty
$$

And finally, I can write down the total cost of cars for the rest of my life as

$$
\text{total cost}(t) = \frac{N}{U(t)} c(t)
$$


where $\frac{N}{U(t)}$ is the total number of cars I'll have to buy, and $c(t)$ is the cost associated with the purchase of each car. Now, since I want to spend as little as possible on cars, I'm interested in solving the equation

$$
t^* = \text{argmin}_{t} \; \text{total cost}(t)
$$

In other words, I'm interested in finding the age of the cars I have to buy to minimize the total cost of cars. In the following plot you can see $\text{total cost(t)}$ for the values of $\lambda=12$, $k=2$, $N=60$, $\alpha = \frac{\log_2(2)}{2}$ , $c_0 = 20000$, and $c_\infty=1000$. 



<figure>
  <img src="/docs/used-car/age-vs-cost.svg" alt="fig. 3" width="500" class="center" />
</figure>



The optimal value for this set of parameters is

$$
t^* = 13.81
$$

So the best option is to buy cars that are $13.81$ years old. Notice also that buying new cars, $T=0$, is always the worse option.

Also, notice that the value of $c_\infty$ acts as a regularizer, otherwise the optimal solution would be to buy cars with high $T$ (aka old cars) such that $c(T) \approx 0$ . Then $U(T) \approx 0$ , so the cars would be useful for a small amount of time, but since buying old cars doesn't have an associated cost there's no problem. So basically we could spend all our live changing cars every day without any associated cost, and of course, this is not how the world works.

# Conclusions

In this post I've shown how can we leverage the extra information we get from knowing that a car has survived a certain amount of time. In other words, when buying a used car you're also buying information about the durability of the car.

Of course, the results in this post come from a simplified model, and the parameters I've chosen maybe are not the most real ones. However, I think it represents reality accurately enough and the overall idea still holds. So my recommendation is to stop buying new cars and start buying used cars!


---
[^1]: Now you understand why I don't have a lot of friends that still want to talk with me.