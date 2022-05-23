---
layout: post
title: "Boolean algebra, sets and filters"
description: How to use boolean algebra to speed up filters.
tags: data optimization python
---

One of the most covered topics about pandas optimization is how to apply functions over columns. One option is to use `apply`, but is not a good idea ([maybe](https://python.plainenglish.io/pandas-how-you-can-speed-up-50x-using-vectorized-operations-d6e829317f30/) [this](https://stackoverflow.com/questions/27575854/vectorizing-a-function-in-pandas) [is](https://medium.com/analytics-vidhya/understanding-vectorization-in-numpy-and-pandas-188b6ebc5398) [one](https://towardsdatascience.com/efficient-pandas-apply-vs-vectorized-operations-91ca17669e84) [of](https://medium.com/productive-data-science/why-you-should-forget-for-loop-for-data-science-code-and-embrace-vectorization-696632622d5f) [the](https://morioh.com/p/7ba40acefa19) [topics](https://medium.com/analytics-vidhya/understanding-vectorization-in-numpy-and-pandas-188b6ebc5398) [with](https://datascience.blog.wzb.eu/2018/02/02/vectorization-and-parallelization-in-python-with-numpy-and-pandas/) [more](https://www.architecture-performance.fr/ap_blog/applying-a-row-wise-function-to-a-pandas-dataframe/) [posts ever](https://ogeek.cn/qa/?qa=383643/)). It's known that the optiomal solution is to use vectorization, however there are some functions that can't be vectorized easily. What to do in these cases?

In this post, I'll present a trick to vectorize operations that involve using sets and lists. In particular, I will show how using boolean algebra enables vectorization and it can speed up our computations.



# Introduction

Imagine you want to study if exists a correlation in a couple between the OS that one partner uses and the OS that the other partner uses. Imagine also that you have access to a dataset that looks like this 

$$
\begin{array}{c|c|c}
        \text{Couple id} & \text{Partner A} & \text{Partner B} \\ \hline
        1 & [\text{Linux}, \text{Windows}]  & [\text{Linux}, \text{MacOS}] \\
        2 & [\text{Linux}, \text{Linux}]  & [\text{Windows}] \\
        ...  & ... \\ 
        N & [\text{MacOS}]  & [\text{Linux}, \text{Windows}] \\
\end{array}
$$

One of the interesting things we can ask is how many couples share at least one OS - in our case couples 1 and 2. But, how would you do that? While there are some straightforward brute force approaches, they're not efficient when $N$ gets big. So, how to do this kind of operations efficiently? Fortunately, we can approach this problem using binary code and speed up the queries by factors of ten!


# Problem Statement

Given two list of lists, $L = (l_1, l_2, ..., l_n)$ and $M = (m_1, m_2, ..., m_n)$, where all the elements of $l_i$ and $m_i$ are generated from the same vocabulary of words $v$; and a predicate of the form $P(l_i, m_i)$, the question is to find an efficient way to obtain the indices of $L$ that fulfill the predicate $P$.

For example, if 

1. $L = ((1, 2), (2, 3, 4), (3))$
2. $M = ((1), (1, 2), (1, 2, 3))$
3. $P(l_i, m_i) = m_i \in l_i$
4. Then, the resulting index is 1, since $(1) \in (1, 2)$.

another example, if 

1. $L = ((1, 2), (2, 3, 4), (3))$
2. $M = ((1), (1, 2), (1, 2, 3))$
3. $P(l_i, m_i) = m_i \cap l_i \neq \emptyset$
4. Then, the resulting indices are 1, 2, and 3.


# Solutions

Eventhough there are multiple options to work with datasets in python ([polars](https://www.pola.rs/), [dask](https://dask.org/), [vaex](https://vaex.io/), etc.) let's assume that we're using [pandas](https://pandas.pydata.org/). Let's also assume that our dataset has `df.columns = ['id', 'elements']`, where `elements` is the column with lists.

Let's explore two different solutions to the problem of filtering a dataframe using lists. The first one it's going to be a brute force one (using `map`), and the other one it's going to apply some boolean algebra concepts to speed up the process.

## Brute force solution

The most inmediate solution is just to iterate over all the rows of the dataframe and check if the intersection is the empty set or not.

<script src="https://gist.github.com/AlexMolas/f3c106dfa5523c677dcd9e6e035a1f36.js?file=brute_force.py"></script>

However, this is not efficient, since we know that vectorization is key and using `apply` is not a good idea ([maybe](https://python.plainenglish.io/pandas-how-you-can-speed-up-50x-using-vectorized-operations-d6e829317f30/) [this](https://stackoverflow.com/questions/27575854/vectorizing-a-function-in-pandas) [is](https://medium.com/analytics-vidhya/understanding-vectorization-in-numpy-and-pandas-188b6ebc5398) [one](https://towardsdatascience.com/efficient-pandas-apply-vs-vectorized-operations-91ca17669e84) [of](https://medium.com/productive-data-science/why-you-should-forget-for-loop-for-data-science-code-and-embrace-vectorization-696632622d5f) [the](https://morioh.com/p/7ba40acefa19) [topics](https://medium.com/analytics-vidhya/understanding-vectorization-in-numpy-and-pandas-188b6ebc5398) [with](https://datascience.blog.wzb.eu/2018/02/02/vectorization-and-parallelization-in-python-with-numpy-and-pandas/) [more](https://www.architecture-performance.fr/ap_blog/applying-a-row-wise-function-to-a-pandas-dataframe/) [ever](https://ogeek.cn/qa/?qa=383643/)). So the natural next step would be to vectorize this function. But how can we do it? It doesn't seem that we can write a vectorizable method for checking if a list is in another list.



## Binary solution

To solve this problem let's dust off the university books about boolean algebra and see how can we give those concepts some real world application.

Given a set $L = ( l_1, l_2, ..., l_n ) $, where $l_i$ is composed of elements from a vocabulary $v$ of size $\|v\|$, then each list $l_i$ can be expressed as a binary number where in position $j$ there's a $1$ if word $v[j] \in l_i$ and $0$ otherwise.

Let's work out through an example to make this more clear:

1. Given the set $L = ((a, b), (b), (c, d), (a, b, d))$
2. The vocabulary is then $v = [a, b, c, d]$. 
3. Therefore each element from $L$ can be expressed as

$$\begin{eqnarray} 
l_1 = (a, b) &\implies& 1100_2 = 12_{10} \\
l_2 = (b) &\implies& 0100_2 = 4_{10} \\
l_3 = (c, d) &\implies& 0011_2 = 3_{10} \\
l_4 = (a, b, c) &\implies& 1101_2 = 13_{10} \\
\end{eqnarray}$$

In python we could do this with the following snippet

<script src="https://gist.github.com/AlexMolas/f3c106dfa5523c677dcd9e6e035a1f36.js?file=list_to_int.py"></script>

So with this approach we can transform our lists to integers, and we know that doing vectorized operations in pandas with columns that are integers is easy-peasy, amazing! 

In the following class we have implemented two methods to convert a list to a integer, and an integer to a list.

<script src="https://gist.github.com/AlexMolas/f3c106dfa5523c677dcd9e6e035a1f36.js?file=conversions.py"></script>

But wait! How can we get the intersection between two lists it's binary representation? It's as easy as multiplying it's values, or in terms of boolean algebra, by using the `&` operator. Here you have two predicates using this new approach: 

<script src="https://gist.github.com/AlexMolas/f3c106dfa5523c677dcd9e6e035a1f36.js?file=operations.py"></script>

Any other predicate could be implemented using boolean algebra [^1].

# Results 

To compare both approaches I've generated a syntetic dataset with $N = 10^6$, $\|v\| = 100$ and sequence maximum length of 20. 

---

[^1]: Left as an exercise for the reader ;)