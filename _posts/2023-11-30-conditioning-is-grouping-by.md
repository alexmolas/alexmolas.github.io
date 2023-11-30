---
layout: post
title: "Conditioning is grouping by" 
description: This insightful exploration draws parallels between mathematical formulations and practical implementations, showcasing how understanding conditioning as grouping can elevate your statistical insights. Discover the parallels between conditional expectations like $\mathbb{E}(y | X=x)$ and popular grouping techniques found in data analysis tools like pandas. Uncover the hidden synergy that exists between statistical conditioning and groupby operations, demystifying complex mathematical concepts with real-world applications. Whether you're a seasoned data scientist or a curious learner, this journey into the interconnected world of conditioning and grouping promises newfound clarity. Elevate your statistical understanding with practical examples, bridging the gap between theory and application. Embark on this enlightening exploration today and revolutionize your approach to statistical modeling. Uncover the simplicity behind complex conditional expressions through the power of grouping, transforming your data analysis skills along the way.
tags:
---

# what's $y\|X?$

Last year I managed to read more papers than in my entire life. [^1]. While doing so I developed an intuition about conditional expressions that I think could be of help to more people. tldr: conditional expressions can be interpreted as `groupby` operations.

A usual object in machine learning literature (and stats literature in general) are conditional expressions, ie $y\|X$, which reads as the "$y$ being conditioned to $X$". For example, one can compute the expected value of a random variable $y$ conditioned to another random variable $X$ being exactly $x$, which is written as $\mathbb{E}(y\|X=x)$. Then, to compute it you can use $\mathbb{E}(y\|X=x) = \int y P(y\|x) dy$ where $P(y\|X)$ is the distribution of $y$ conditioned on $X$, ie another conditional object.

As a starting point for this post, I'll use one of the first derivations from "[Elements of Statistical Learning](https://hastie.su.domains/Papers/ESLII.pdf)" (p. 18), where the authors show that the best option to predict a value $y$ from features $X$ is to use the estimator

$$
f(x) = \mathbb{E}(y | X=x)
$$

The first time I read that I felt very weird since I understood all the maths behind this formula but I couldn't get any intuitive interpretation about it. What did it mean that a function of $x$ is defined as a conditional expectation on $x$? How do you compute this function? What does it look like? Why I'm learning this shit if [xgboost is all you need](https://twitter.com/tunguz/status/1509197350576672769)?

# some intuition

After thinking about it for some weeks (I'm a slow learner) I realized that the formula was only saying "the best prediction for a given set of features $x$ is just to take all the other examples with the same features $x$ and average their $y$". In real machine learning you don't usually have multiple examples with the same features, and this is why more complex machine learning algorithms are used. But this is a story for another day, today I want to talk about conditional distributions.

After learning how to read the equation I felt a little bit better since I got some intuition about it, but it wasn't the end. After some more weeks of ruminating about it (sometimes I'm very slow) I realized that the interpretation of $\mathbb{E}(y \| X=x)$ was familiar. Wasn't this interpretation following the same logic as `.groupby` in pandas? If for a given dataframe `df` I wanted to compute the average value of a column `y` for each group in column `X` I would do `df.groupby(X)[y].mean()`. Isn't it quite similar to $\mathbb{E}(y \| X=x)$?

# formalizing intuition

So here it goes the formalized version of my intuition

> $\mathbb{E}(y \| X=x) \sim$   `df.groupby(X)[y].mean()`

This is, the idea behind conditional expressions is the same idea behind `groupby` operations, which are present in multiple languages and packages ([itertools](https://docs.python.org/3/library/itertools.html?highlight=groupby#itertools.groupby), [pandas](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html), [scala](https://www.scala-lang.org/api/2.12.4/scala/collection/parallel/ParIterableLike$GroupBy.html), [rust](https://docs.rs/itertools/latest/itertools/structs/struct.GroupBy.html), [SQL](https://learn.microsoft.com/es-es/sql/t-sql/queries/select-group-by-transact-sql?view=sql-server-ver16), etc.).

I'll present now some examples to make my thoughts a little bit clearer. I'll use pandas' implementation of `groupby` since I think almost everyone is familiar with it. Let's build a dataframe that consists of groups and values, and then compute the conditional expected value for each group

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

And this is basically the same as $\mathbb{E}(y \| X=x)$ where $y = \text{value}$ and $X = \text{group}$. Here we have computed the conditional expected value, but you can also use `groupby` to compute the distribution using `value_counts(normalized=True)`

```python
df.groupby("group").value_counts(normalize=True)
```

and you'll get


```r
|        | proportion   |
|:-------|-------------:|
| (1, 5) | 0.666667     |
| (1, 2) | 0.333333     |
| (2, 1) | 1            |
| (3, 7) | 0.333333     |
| (3, 8) | 0.333333     |
| (3, 9) | 0.333333     |
```

which is a of $P(y\|X)$, ie: the distribution of $y$ for each group in $X$. For example, for group `2` we see that the distribution has all the mass around `1`, and for group `3` the distribution is uniform between `7`, `8`, and `9`.
# what about continuous variables?

Those readers used to working with conditional probabilities will have noticed that there are some flaws in my reasoning. The main one is that with probabilities we can condition on continuous values, ie: $P(\text{salary} \| \text{height})$, while if we groupby by a continuous column we will get groups of only one element. However, we can overcome this limitation by imagining an infinite dataframe that contains the full distribution in the grouping column. This is, a dataframe with a column named `height` that contains all the possible heights and another column named `salary` that for each height contains the distribution of salaries. The cardinality of this dataframe is $\mathbb{R}^2$ and it's impossible to build it, but we can imagine it and apply the same intuition as in the previous section.

# bayes theorem

To talk about conditioned probabilities is to talk about Bayes' theorem. The theorem reads 

$$
P(A|B) = \frac{P(B|A) P(A)}{P(B)}
$$

As a final exercise for this post, I'll show that the presented intuition can be used to reproduce the Bayes theorem. 

To show it we can create a dataframe with two columns: `A` take random integer values between `0` and `10` and `B` takes values between `100` and `1000`. With the following code we create the dataframe and compute $\frac{P(B\|A) P(A)}{P(B)}$ and $P(A\|B)$.


```python
N = 100000
A = np.random.randint(0, 10, N)
B = np.random.randint(100, 1000, N)
df = pd.DataFrame({'A': A, 'B': B})

# compute conditional and absolute probabilities
p_ba = (df
        .groupby('A')[['B']]
        .value_counts(normalize=True)
        .reset_index()
        .rename(columns={"proportion": "P(B|A)"})
        )
p_ab = (df
        .groupby('B')[['A']]
        .value_counts(normalize=True)
        .reset_index()
        .rename(columns={"proportion": "P(A|B)"})
        )
p_a = (df[['A']]
       .value_counts(normalize=True)
       .to_frame()
       .reset_index()
       .rename(columns={"proportion": "P(A)"})
       )
p_b = (df[['B']]
       .value_counts(normalize=True)
       .to_frame().reset_index()
       .rename(columns={"proportion": "P(B)"}))

# compute P(B|A) * P(A) / P(B)
num = p_ba.merge(p_a)
num["P(B|A) P(A)"] = num["P(B|A)"] * num["P(A)"]
tot = num.merge(p_b)
tot["P(B|A) P(A) / P(B)"] = tot["P(B|A) P(A)"] / tot["P(B)"]
full_probs = p_ab.merge(tot)
```


According to Bayes' theorem, we expect the column `P(B|A) P(A) / P(B)` to be equal to `P(A|B)`.  If you run the above code and sample 10 random rows you'll get something similar to


```r
| salary   | height | P(h|s)    | P(s|h) P(h) / P(s)  |
|---------:|-------:|----------:|--------------------:|
| 59693    | 145    | 0.0357143 | 0.0357143           |
| 68419    | 168    | 0.0666667 | 0.0666667           |
| 155131   | 184    | 0.030303  | 0.030303            |
| 69165    | 187    | 0.0487805 | 0.0487805           |
| 49761    | 186    | 0.0344828 | 0.0344828           |
| 196511   | 153    | 0.0238095 | 0.0238095           |
| 113707   | 184    | 0.027027  | 0.027027            |
| 116071   | 203    | 0.025641  | 0.025641            |
| 193425   | 149    | 0.0555556 | 0.0555556           |
| 162955   | 199    | 0.03125   | 0.03125             |
```

Cool! The actual `P(height | salary)` given by the data coincides with the computed values using Bayes theorem. Of course I wasn't expecting the opposite - my plan wasn't to disprove Bayes theorem in a 1000 words post - but it's interesting that you can do all this computations using the intuition I explained here. 

# conclusions

In this post, I presented my intuition about conditioning in statistics. I also showed that Bayes' theorem holds within this intuition. So next time you find a weird $y \| X$ formula don't panic and remember that it just a fancy way of saying "I'm grouping the data".

I'm sure any mathematician reading this will be horrified and could point out dozens of errors in my reasoning. [Too bad I don't care](https://www.alexmolas.com/2023/07/15/nobody-cares-about-your-blog.html). But if you can improve my intuition feel free to write and enlighten me.

---

[^1]:  When I finished my Physics master I thought I would never read a paper again, and it made me a little bit sad. But last year my incredible wife bought me a tablet with a stylus and since then I've been devouring papers. Being able to read a paper and take handwritten notes directly without having to print it has been a game changer for me.