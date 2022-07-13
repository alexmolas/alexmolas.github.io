---
layout: post
title: "Vectorizing impossible operations: boolean algebra, sets, and filters"
description: How to use boolean algebra to vectorize complex operations and get x2000 speed-up.
tags: data optimization python
---

One of the most covered topics about pandas optimization is how to apply functions over columns. One option is to use `apply` but is not a good idea ([maybe](https://python.plainenglish.io/pandas-how-you-can-speed-up-50x-using-vectorized-operations-d6e829317f30/) [this](https://stackoverflow.com/questions/27575854/vectorizing-a-function-in-pandas) [is](https://medium.com/analytics-vidhya/understanding-vectorization-in-numpy-and-pandas-188b6ebc5398) [one](https://towardsdatascience.com/efficient-pandas-apply-vs-vectorized-operations-91ca17669e84) [of](https://medium.com/productive-data-science/why-you-should-forget-for-loop-for-data-science-code-and-embrace-vectorization-696632622d5f) [the](https://morioh.com/p/7ba40acefa19) [topics](https://medium.com/analytics-vidhya/understanding-vectorization-in-numpy-and-pandas-188b6ebc5398) [with](https://datascience.blog.wzb.eu/2018/02/02/vectorization-and-parallelization-in-python-with-numpy-and-pandas/) [more](https://www.architecture-performance.fr/ap_blog/applying-a-row-wise-function-to-a-pandas-dataframe/) [posts ever](https://ogeek.cn/qa/?qa=383643/)). It's known that the optimal solution is to use vectorization, however, some functions that can't be vectorized easily. What to do in these cases?

In this post, I'll present a trick to vectorize operations that involve checking the intersection between lists and other list operations. In particular, I will show how using boolean algebra enables vectorization and can speed up our computations.


> All the code and data used in this post is available in this [repo](https://github.com/AlexMolas/fast-filters).  
{: .prompt-info }


# Introduction

Imagine you are working on an ice cream start-up, which sells ice-creams of different flavors. There are ice creams of only one flavor, ice creams of two flavors, ice creams of three flavors, and so on. Every time that an ice cream is purchased your company stores information about the order and the rating -from 1 to 10- that the client gave to the ice cream.

The resulting table looks like this

$$
\begin{array}{c|c|c}
        \text{Purchase id} & \text{Ice Cream Combination} & \text{User Rating} \\
        \hline
        1 & [\text{chocolate}, \text{mint}]  & 5  \\
        2 & [\text{chocolate}, \text{strawberry}, \text{mint}]  & 7 \\
        ...  & ... & ... \\ 
        N & [\text{strawberry}, \text{mint}] & 6 \\
\end{array}
$$

Now, your company wants you to answer some questions

* When the flavor `X` is included in the ice cream, which is the average rating?
* When the flavors `X` and `Y` are included in the ice cream, which is the average rating?

For example, using the table above the answers would be

$$
\begin{array}{c | c | | c | c}
        \text{Single} & \text{Average Rating}\\
        \hline
        \text{chocolate}    & 6\\
        \text{mint}         & 6\\
        \text{strawberry}   & 6.5\\
\end{array}
$$

and 

$$
\begin{array}{c | c }
        \text{Pair} & \text{Average Rating} \\
        \hline
        \text{chocolate}, \text{mint}           & 6 \\
        \text{chocolate}, \text{strawberry}     & 7\\
        \text{strawberry}, \text{mint}          & 6.5\\
\end{array}
$$

In general, you want to be able to answer the question 

* When flavors `{X_1, X_2, ..., X_N}` are included in the ice cream, which is the average rating?

The question now is how to run this analysis efficiently. More specifically, how to filter a set of lists based on another list fast. Surprisingly, the answer to this question cames from boolean algebra and binary code. Stay with me and I'll show how to vectorize these queries! 

# Problem Statement

In this section, I'll generalize the above problem using some mathematical notation. 

Given a vocabulary $v$, two list of lists, $L = (l_1, l_2, ..., l_n)$ and $M = (m_1, m_2, ..., m_n)$, where $l_i \in v$ and $m_i \in v$, and a predicate of the form $P(l_i, m_i)$, the question is to find an efficient way to obtain the indices  $\\{ i \| P(l_i, m_i) \\}$.

For example

1. Given the lists $L = ((1, 2), (2, 3, 4), (3))$ and $M = ((1), (1, 2), (1, 2, 3))$.
3. Given the predicate $P(l_i, m_i) = m_i \in l_i$, which checks if a list is contained in another list.
4. Then, the resulting index is $1$, since $(1) \in (1, 2)$.

# Solutions

Even though there are multiple options to work with datasets in python ([polars](https://www.pola.rs/), [dask](https://dask.org/), [vaex](https://vaex.io/), etc.) let's assume that we're using [pandas](https://pandas.pydata.org/). Let's also assume that the dataframe looks like

$$
\begin{array}{c|c|c}
        \text{id} & \text{L} & \text{M} \\
        \hline
        1 & [a, b]  & [a, b]  \\
        2 & [b, d]  & [b] \\
        ...  & ... & ... \\ 
        N & [a, b, c] & [d] \\
\end{array}
$$

and we want to find all the indices where the list $l_i$ is contained in $m_i$. 

We'll explore two different solutions to the problem of filtering a dataframe using lists. The first one it's going to be a brute force one (using `apply`), and the other one it's going to apply some boolean algebra tricks to vectorize the process.

## Brute force solution

The most immediate solution is just to iterate over all the rows of the dataframe and check if the intersection is the empty set or not.

```python
def brute_force_not_null_intersection(df: pd.DataFrame, c1: str, c2: str):
    def f(r):
        e1 = r[c1]
        e2 = r[c2]
        return len(set(e1) & set(e2)) != 0
    return df.apply(f, axis=1)
```

However, this is not efficient, since we know that vectorization is key and using `apply` is not a good idea . So the natural next step would be to vectorize this function. But how can we do it? It doesn't seem trivial how can we write a vectorizable method for checking if a list is in another list.

## Binary trick solution

### Binary representation

Here's where the interesting things start. In this section, we'll study how we can represent our lists as binary numbers and vectorize the operations.

The first step is to translate every list into an integer. To do that we can use the following algorithm:

1. Given sets $L$ and $M$, construct the vocabulary $v$.
2. Express every element in $L$ and $M$ as a binary number, where in position $j$ there's a $1$ if $v[j] \in l_i$ and $0$ otherwise.

For example, the binary representation for $l = (b, d)$ if $v = (a, b, c, d)$ is $1010$.

In python we can do this transformation with the following snippet


```python
def list_to_int(vocabulary: Sequence[str], l: Sequence[str]):
    word_to_exponent = {k: i for i, k in enumerate(vocabulary)}
    return sum(2 ** word_to_exponent[k] for k in l)
```

With this approach we can transform our lists to integers, and we know that doing vectorized operations in pandas with integer columns easy-peasy, amazing! 


### Binary operations

Cool, we know how to represent sets as binary numbers, but how can we use that to check if a list $l$ contains list $m$?  If we dust off the boolean algebra university books we'll see it's as easy as doing `l == (l & m)`. Let's work through an example

* Given `v = (a, b, c, d)`, `l = (a, b, c)` and `m = (a, b)`.
* The binary representation is `l -> 0111` and `m  -> 0011`
* Now we want to check `m == (l & m)`.
* `l & m = 0111 & 0011 = 0011`
* `m == (l & m)` is `0011 == 0011`, which holds. Therefore, we can say that `l` contains `m`.


Here’s the python implementation of this predicate


```python
def vectorized_not_null_intersection(df: pd.DataFrame, c1: str, c2: str) -> pd.Series:
    return (df[c1] & df[c2]) != 0
```

Any other predicate between lists can be implemented using boolean algebra [^1].

The great thing about this trick is that allows us to take advantage of vectorization. In the following section, we'll compare the brute force and the binary trick approaches.

# Results 

To compare both approaches we're going to use a synthetic dataset with $N = 10^6$ examples, a vocabulary size of $\|v\| = 15$, and a sequence maximum length of 5. To generate your own examples you can use this [script](https://github.com/AlexMolas/fast-filters/blob/main/scripts/generate_examples.py).

The results for the brute force algorithm are

```python
%%time

index_brute = brute_force_not_null_intersection(df, 'elements_1', 'elements_2')

>> CPU times: user 10.9 s, sys: 125 ms, total: 11 s
>> Wall time: 11.1 s
```

and using the binary trick

```python
%%time

converter = Converter(vocabulary=vocabulary)
df['elements_1_bin'] = df['elements_1'].map(converter.convert)
df['elements_2_bin'] = df['elements_2'].map(converter.convert)
index_vec = vectorized_not_null_intersection(df, 'elements_1_bin', 'elements_2_bin')

>> CPU times: user 3.54 s, sys: 52.4 ms, total: 3.6 s
>> Wall time: 3.63 s
``` 

This is a speed up of x3, which is amazing. However, most of the time was spent in the `map` operation when constructing the binary representations of the lists, but once these representations are created, the `not_null_intersection` is much more faster!

```python
%%time

index_vec = vectorized_not_null_intersection(df, 'elements_1_bin', 'elements_2_bin')

>> CPU times: user 3.61 ms, sys: 1.6 ms, total: 5.21 ms
>> Wall time: 4.05 ms
```

A speed-up of x2500, OMG! This means that, after an initial overhead of translating lists to integers, we can use vectorized operations to solve our problem and obtain an incredible reduction in computation time. 

# Conclusions

In this post we have seen how to transform lists to binary numbers and then use boolean algebra to vectorize difficult operations. With this approach we've seen a huge boost (x2500) in the performance.

---

[^1]: Left as an exercise for the reader ;)