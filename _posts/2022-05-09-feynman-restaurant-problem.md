---
layout: post
title: "Feynman's Restaurant Problem."
description: Introduction and solution of the Feynman's Restaurant Problem.
tags: stats optimization probability math
image: /docs/restaurant-problem/exploration-vs-profit.svg
---

You're on holidays, and you're going to spend the following days on a new city. In the city there are several restaurants, but you have no idea how good is each restaurant - it's 1960 and the internet doesn't exists yet. You would like to enjoy the most the local cuisine, but a priori you don't know which restaurants are you going to enjoy and which not. Also, the number of restaurants is bigger than the number of days you're going to stay in the city, so you can't try all the restaurants and find the best one. However, since you love math  you decide to find the best strategy to optimize your experience in this new city. This is known as the Feynman's Restaurant Problem.

The content of this post is heavily inspired by [this solution](https://www.feynmanlectures.caltech.edu/info/solutions/restaurant_problem_sol_1.html). I have tried to explain some details which were obscure to me, and I also added some plots and code to give more intuition about the problem. [Here](https://www.feynmanlectures.caltech.edu/info/other/Feynmans_Restaurant_Problem_Revealed.html) you can read more about the history of the problem.

![feynman-solution](/docs/restaurant-problem/feynman-solution.png){: width="400" height="400"}
_Screenshot of the [solution](https://www.feynmanlectures.caltech.edu/info/other/Feynmans_Restaurant_Problem_Original_Notes.pdf) by Feynman_


# Mathematical formulation

Let's try to formalize the problem using maths. First of all, let's define $D$ as the number of days you're going to spend in the city and $N$ as the number of restaurants. Let's assume that you can rank all the restaurants with respect to your taste, and let's call $r_i$ the ranking of restaurant $i$. Let's assume also that you can go to the same restaurant every day without getting tired of it, which means that if you know the best restaurant in the city you are going to go there always.  

Notice, that since $D < N$ you can't try all the restaurants in the city, so you'll never know if you have visited the best restaurant. 

> Notice that you will never know the actual rating $r_i$. You only know if a restaurant is the best up to that moment or not. You can rank the restaurant that you have tried up to a given moment, but this "partial" ranking maybe it's not the same as the "absolute" ranking. For example, if you have only tried 4 out of 10 restaurants you could have the rank `[3, 2, 1, 4, ?, ?, ?, ?, ?, ?]`, but the real rank could be `[5, 4, 3, 6, 1, 2, 7, 8, 9]`.  
{: .prompt-info }

The function you want to optimize is

$$
\langle \mathcal{F} \rangle = \sum_{i=1}^D r_i
$$

where $r_i$ is the restaurant rating you visited on day $i$.

# Solution

## Analytical

Every day you stay in the city you have two options: (1) try a new restaurant, or (2) go to the best restaurant you visited until that moment. We can think about this problem as an _exploration-exploitation_ problem, this is, you explore the city for the first $M$ days, and after that, you always go to the best place up to that moment for the following $D - M$ nights. 

Therefore, we can split the function to optimize as

$$
\langle \mathcal{F} \rangle = 
\left \langle \sum_{i=1}^M r_i \right \rangle 
+ 
\left \langle \sum_{k=M+1}^{D - M} b_{M, N} \right \rangle
$$

where $b_{M, N}$ is the ranking of the best restaurant you have tried during the first $M$ days.

The only free parameter in our equation is $M$, so you want to find the value of $M$ where the expected profit is maximized. This is
 
$$
M^* = 
\textrm{argmax}_M \langle \mathcal{F} \rangle 
\implies 
\left. \frac{\partial \langle \mathcal{F} \rangle}{\partial M} \right\rvert_{M=M^*} = 0
$$

Let's start with the first term, ie $\langle \sum_{i=1}^M r_i \rangle$. Since this is a linear function we can use $\langle \sum_{i=1}^M r_i \rangle = \sum_{i=1}^M \langle r_i \rangle$, and since $\langle r_i \rangle = (N+1)/2$ we get  $\langle \sum_{i=1}^M r_i \rangle = M(N+1)/2$.

The second term is $\langle \sum_{k=M+1}^{D - M} b_{M, N} \rangle$. Applying linearity again we get $ \sum_{k=M+1}^{D - M} \langle b_{M, N} \rangle$. Now we need to compute $\langle b_{M, N} \rangle$, which is the expected maximum value obtained after $M$ draws from the range $(1, N)$. 

On one hand, we know that if you only try a restaurant the expected ranking is

$$
\langle b_{1, N} \rangle = \frac{N+1}{2} 
$$

and on the other hand, if you try all the restaurants, the expected maximum ranking is of course

$$
\langle b_{N, N} \rangle = N
$$

We can also compute $\langle b_{2, N} \rangle$. In this case, there only exist 1 pair of restaurants where 2 is the maximum, ie you choose the restaurants $(1, 2)$. There only exist 2 pairs of restaurants where 3 is maximum, ie $(1, 3)$ and $(2, 3)$. There only exist 3 pairs of restaurants where 4 is maximum, ie $(1, 4)$, $(2, 4)$, and $(3, 4)$. And so on. All together there are $N(N-1)/2$ possible pairs. Therefore

$$
\langle b_{2, N} \rangle = \frac{\sum_{m=2}^N (m-1)m }{N(N-1)/2} = \frac{(N^3- N)/3}{N(N-1)/2} = \frac{2}{3} (N+1)
$$

Now consider $\langle b_{N-1, N} \rangle$. This is, you try all the restaurants in the city except one. In this case, you'll visit the best restaurant in $N-1$ cases, and in only one case you'll skip the best restaurant. Therefore, the expected value is

$$
\langle b_{N-1, N} \rangle = \frac{(N-1) \times N + 1 \times (N-1)}{N} = \frac{N-1}{N}(N+1)
$$

From all these results, one can see the pattern and guess that

$$
\langle b_{M, N} \rangle = \frac{M}{M+1}(N+1)
$$

Putting it all together we finally have

$$
\langle \mathcal{F} \rangle = M \frac{N+1}{2} + (D-M) \frac{M}{M+1}(N+1)
$$

So derivating with respect to $M$ and equaling to zero we obtain

$$
(M^2 + 2M - (2D+1))\frac{(N+1)}{2(M+1)^2}  =  0
$$

which has the positive solution

$$
M^* = \sqrt{2(D+1)} - 1
$$

>Notice that the result doesn't depend on $N$. This means that you don't care about how many different restaurants are in the city, which sounds -at least for me- a little bit counterintuitive.
{: .prompt-info }

>Notice also that if you want to try all the restaurants in the city without decreasing the expected profit you'll need to stay in the city $D \geq (N+1)^2/2 - 1$ days. So if the city has 10 restaurants you'll need to stay in the city for at least 60 days:  exploring the city for the first 10 days, and during the following 50 days going to the best restaurant [^1].
{: .prompt-info }


## Numerical

In the last section, we derived an analytical solution to our problem. Let's now run some simulations to derive more intuition about this problem. In particular it seems surprising that the solution doesn't depend on $N$. So let's see if the simulations support this claim.

With the following snippet, one can simulate the expected profit $\langle \mathcal{F} \rangle$ for a set of parameters

```python
import numpy as np

def expected_profit(n_days: int, n_restaurants: int, n_experiments=10000):
    """
    Computes the average profit at each 
    possible m \in range(1, n_days) over n_experiments.

    :param n_days: number of times one can visit the restaurant.
    :param n_restaurants: number of restaurants in the city.
    :param n_experiments: number of experiments to perform.
    """

    results = {}

    for m in range(1, n_days + 1):
        results[m] = []
        for i in range(n_experiments):
            ranks = x = list(range(n_restaurants))
            np.random.shuffle(ranks)
            profit = sum(ranks[:m]) + (n_days - m) * max(ranks[:m])
            results[m].append(profit)
    results = {k: np.mean(v) for k, v in results.items()}
    return results
```

Using this snippet we have generated the following plot, using $N=(100, 110, 120)$ and $D=10$. Notice how the maximum of the three curves coincides, which gives support to the counterintuitive analytical results.
  
![exploration-vs-profit](/docs/restaurant-problem/exploration-vs-profit.svg){: width="400" height="400"}


# Conclusions

In this post, we have explored Feynman's Restaurant Problem. First, we have derived an analytical solution for the optimal exploration strategy, and then we have checked the analytical results with some simulations. Although these results make sense from a mathematical point of view, no one in their right mind would follow the optimal strategy. This is probably caused by the unrealistic assumptions we made, ie: you can't go to the same restaurant every day of your life without getting tired of it. One possible solution is to change the rating of a restaurant $r_i$ to be dependent on the number of times you've visited it, ie $r_i(n)$. However, this is outside the scope of this post and we're not going to do it, but maybe it can serve as inspiration for another post. 

---

[^1]: Please, don't use these results to plan your next vacations.