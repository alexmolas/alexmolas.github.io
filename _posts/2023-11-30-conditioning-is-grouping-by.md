---
layout: post
title: "Conditioning is grouping by" 
description: This insightful exploration draws parallels between mathematical formulations and practical implementations, showcasing how understanding conditioning as grouping can elevate your statistical insights. Discover the parallels between conditional expectations like $\mathbb{E}(y | X=x)$ and popular grouping techniques found in data analysis tools like pandas. Uncover the hidden synergy that exists between statistical conditioning and groupby operations, demystifying complex mathematical concepts with real-world applications. Whether you're a seasoned data scientist or a curious learner, this journey into the interconnected world of conditioning and grouping promises newfound clarity. Elevate your statistical understanding with practical examples, bridging the gap between theory and application. Embark on this enlightening exploration today and revolutionize your approach to statistical modeling. Uncover the simplicity behind complex conditional expressions through the power of grouping, transforming your data analysis skills along the way.
tags:
---

# what's $y\|X?$

Last year I read more papers than the rest of my life [^1]. While doing so I've developed an intuition about conditional expressions which I think might be of interest to other people. tldr: the intuition is conditional expressions can be interpreted as `groupby` operations.

A usual object in machine learning literature (and stats literature in general) are conditional expressions, ie $y\|X$, which reads as the "$y$ being conditioned to $X$". For example, one can write the conditional expected value as $\mathbb{E}(y\|X=x) = \int y P(y\|x) dy$ where $P(y\|X)$ is the distribution of $y$ conditioned on $X$.

For example, in one of the first derivations in "[Elements of Statistical Learning](https://hastie.su.domains/Papers/ESLII.pdf)" (p. 18) the authors show that to $y$ from features $X$ the function that minimizes the expected squared error is

$$
f(x) = \mathbb{E}(y | X=x)
$$

The first time I read that I felt very weird since I understood all the maths behind this formula but I couldn't get any intuitive interpretation about it. What did it mean that a function of $x$ is defined as a conditional expectation on $x$? How do you compute this function? What does it look like? Why I'm learning this shit if [xgboost is all you need](https://twitter.com/tunguz/status/1509197350576672769)?

# some intuition

After thinking about it for some time (I'm a slow learner, so I usually need some days or weeks to fully understand a concept) I realized that the formula was only saying "the best prediction for a given $x$ is just to take all the other examples with the same $x$ and average their $y$". After learning how to read the equation I felt a little bit better since I got some intuition about it, but it wasn't the end. After some more weeks of ruminating about it (sometimes I'm very slow) I realized that the interpretation of $\mathbb{E}(y \| X=x)$ was familiar. Wasn't this interpretation following the same logic behind the infamous `.groupby` in pandas? If for a given dataframe `df` I wanted to compute the average value of a column `y` for each group in column  `X` I would do `df.groupby(X)[y].mean()`. Isn't it quite the same as $\mathbb{E}(y \| X=x)$?

# $\mathbb{E}(y \| X=x) \sim$   `df.groupby(X)[y].mean()`


The idea behind conditional expressions is the same idea behind `groupby` operations, which are present in multiple languages and packages ([itertools](https://docs.python.org/3/library/itertools.html?highlight=groupby#itertools.groupby), [pandas](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html), [scala](https://www.scala-lang.org/api/2.12.4/scala/collection/parallel/ParIterableLike$GroupBy.html), [rust](https://docs.rs/itertools/latest/itertools/structs/struct.GroupBy.html), [SQL](https://learn.microsoft.com/es-es/sql/t-sql/queries/select-group-by-transact-sql?view=sql-server-ver16), etc.). Here we'll use pandas' implementation of `groupby`. Let's build a dataframe that consists of groups and values, and then compute the conditional expected value for each group

```python
import pandas as pd
df = pd.DataFrame({
       "group": [1, 1, 1, 2, 2, 3, 3, 3],
       "value": [5, 2, 5, 1, 1, 9, 8, 7]
})
df.groupby("group")["value"].mean()
```

which returns us

```r
|   group |   value |
|--------:|--------:|
|       1 |       4 |
|       2 |       1 |
|       3 |       8 |
```

And this is basically the same as $\mathbb{E}(y \| X=x)$ where $y = \text{value}$ and $X = \text{group}$. Here we have computed the conditional expected value, but you can also use `groupby` to compute the distribution using `quantile`

```python
df.groupby("group").quantile([0.1, 0.5, 0.99])
```

and you'll get

```r
|           |   value |
|:----------|--------:|
| (1, 0.1)  |    2.6  |
| (1, 0.5)  |    5    |
| (1, 0.99) |    5    |
|:----------|--------:|
| (2, 0.1)  |    1    |
| (2, 0.5)  |    1    |
| (2, 0.99) |    1    |
|:----------|--------:|
| (3, 0.1)  |    7.2  |
| (3, 0.5)  |    8    |
| (3, 0.99) |    8.98 |
```

which is a numerical approximation of $P(y\|X)$, ie: the distribution of $y$ for each group in $X$. For a large enough dataframe and enough quantiles, you can get a good approximation of the conditional distribution of each group.
# what about continuous variables?

Those readers used to working with conditional probabilities will have noticed that there are some flaws in my reasoning. The main one is that with probabilities we can condition on continuous values, ie: $P(\text{salary} \| \text{height})$, while if we groupby by a continuous column we will get groups of only one element. However, we can overcome this limitation by imagining an infinite dataframe that contains the full distribution in the grouping column. This is, a dataframe with a column named `height` that contains all the possible heights and another column named `salary` that for each height contains the distribution of salaries. The cardinality of this dataframe is $\mathbb{R}^2$ and it's impossible to build it, but we can imagine it and apply the same intuition as in the previous section.

# conclusions

In this post, I presented my intuition about conditioning in statistics. I'm sure any mathematician reading this will be horrified and could point out dozens of errors in my reasoning. [Too bad I don't care](https://www.alexmolas.com/2023/07/15/nobody-cares-about-your-blog.html). But if you can improve my intuition feel free to write and enlighten me.

---


[^1]:  When I finished my Physics master I thought I would never read a paper again, and it made me a little bit sad. But last year my incredible wife bought me a tablet with a stylus and since then I've been devouring papers. Being able to read a paper and take handwritten notes directly without having to print it has been a game changer for me.