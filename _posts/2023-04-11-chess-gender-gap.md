---
layout: post
title: "Gender Gap in Chess: Is it Just a Statistical Artifact?"
description: "Does it exist a gender gap in chess? Why is it that the best players are men? Is there any fundamental difference between how men and women play this game?"
tags: math stats chess data-analysis
---

Imagine a race in which 10,000 men and women participate. Before starting the race a random colour is assigned to each participant  regardless of shape, gender, race, or whatever. There are 9,000 red runners and 1,000 blue runners. If we had to bet, any of us would bet on a red runner, not because we know they are better runners, but because  we know they are more likely to win. A similar situation occurs with the gender gap in chess. In this blog, I will show that the domination of men in chess is nothing more than a matter of participation.

While other factors like cultural and societal biases may be at play, the numbers don’t lie. My hope is that by shedding light and data on this issue, we can start a conversation about how to promote greater gender diversity and inclusivity in the world of chess.

# TL;DR

Using data from FIDE and using the methods defined in this [paper](https://cognition.aau.at/download/Publikationen/Bilalic/Bilalic_etal_2009.pdf) I:

- extend the analysis of the paper to all the available countries. You can find all the code and results [here](https://github.com/alexmolas/alexmolas.github.io/blob/master/notebooks/chess-gender-gap). 
- show that gender gap in chess can be explained almost always as a statistical artifact. In more than $90\%$ of the countries, the difference between the top male and the top female players can be explained by chance.
- show that in the paper there are some math approximations that can be improved. I suggest using another approach that gives more accurate results.
- show that making normal approximations when you want to compare extreme events is not a good idea. A lot of things are normal around the middle, but not in the tails.

# Introduction

The usual readers of the blog know that I love analysing games from a statistical/math point of view ([this](https://www.alexmolas.com/blog/counterintuitive-coin-game/) and [this](https://www.alexmolas.com/blog/continuous-blackjack-i/)). I like also playing chess ([this](https://www.alexmolas.com/blog/chess-960-initial-position/) and [this](https://www.alexmolas.com/blog/mate-with-only-pawns/)), so today's post is going to be focused on analysing some chess data. 

The other day I was watching the World Chess Cup (WCC) and I started wondering why no woman has ever played in a WCC. The highest rating ever achieved by a woman is 2735 by Judit Polgár. Achieving such an ELO is at the hand of very few, however, the highest ELO ever achieved by a man is 2853, around 100 points more, and this difference is not negligible. In other words, Judit Polgár at her peak would be ranked 17th in today's global ranking. And currently, the highest-rated woman, Hou Yifan, is ranked 55th. 

All of this made me start thinking about these differences, and how can they be explained. I'm not a big fan of theories that rely on "intrinsic" differences between men and women to explain this kind of situation. I believe that these differences usually have their roots in sociology and not in biology. 

After some googling, I found a lot of explanations about this gap (sociological, biological, theological, etc.), but one of them seemed really interesting. It basically said that there's no real gap between genders in chess, it's just a statistical artifact. The idea is that the gap between top players can be completely explained just by the imbalance between women and men playing chess. There are two sources supporting this theory ([Bilalic et al.](https://cognition.aau.at/download/Publikationen/Bilalic/Bilalic_etal_2009.pdf) and [Chessbase](https://en.chessbase.com/post/what-gender-gap-in-chess)), but both of them only study data of one country (Germany and India respectively), so I wondered if their findings apply to other countries or if it was just an isolated case. The Chessbase post follows basically the same ideas as in the paper by Bilalic et al.

In this blog post, I'll review the paper by Bilalic et al. and apply their methods to more countries. I'll also propose other approaches that I believe are better suited for this kind of data. All the code and results can be reproduced using this [notebook](https://github.com/alexmolas/alexmolas.github.io/blob/master/notebooks/chess-gender-gap/gender-gap.ipynb).

# Methods

## Data

Data was downloaded from [FIDE website](https://ratings.fide.com/download_lists.phtml). I removed underage players (born after 2005) and inactive players. After cleaning the data I ended up with $114580$ players ($94\%$ male and $6\%$ female), with an average ELO=$1712 \pm 321$.

## Maths

In this section, we will dive into the mathematical approach used to analyze the gender gap in chess. The analysis relies on statistical methods that involve fitting a normal distribution to the global rating distribution and computing the expected highest ranking for male and female players. The methodology is based on the idea that the more players in a group, the higher the chance of having a top-performing player. By comparing the expected and actual differences between the top male and female players, the analysis can determine if the gender gap is due to participation imbalance or other factors. The expected ranking is computed using a formula that takes into account the number of players and the distribution of their ratings. This methodology is grounded in statistical theory and provides a rigorous way to analyse the gender gap in chess.

The basic idea behind the paper approach can be summarised with the following example

>Let’s say I have two groups, A and B. Group A has 10 people, and group B has 2. Each of the 12 people gets randomly assigned a number between 1 and 100 (with replacement). Then I use the highest number in Group A as the score for Group A and the highest number in Group B as the score for Group B. On average, Group A will score 91.4 and Group B 67.2. The only difference between Groups A and B is the number of people. The larger group has more shots at a high score, so will on average get a higher score. The fair way to compare these unequally sized groups is by comparing their means (averages), not their top values. Of course, in this example, that would be 50 for both groups – no difference!

This is similar to saying that the more lottery tickets you buy the more probable is that you get the prize. 

Concretely, the implementation goes as this

1. Compute the total number of male and female players, $n_{m}$ and $n_{f}$.
2. Fit the global rating distribution to a normal distribution and obtain $\mu$ and $\sigma$.
3. Compute the expected $k$ highest value after extracting $n_{m}$ and $n_{f}$ samples from $\mathcal{N}(\mu, \sigma)$, this is $\hat{E}(k, n_{m})$ and $\hat{E}(k, n_{f})$ respectively. Define $\Delta \hat{E}(k) = \hat{E}(k, n_{m}) - \hat{E}(k, n_{f})$ as the expected difference between the $k$-th male and female top players
4. Compute the actual difference between the $k$-th male and female players $\Delta E(k)$.
5. Compare $\Delta E(k)$ and $\Delta \hat{E}(k)$. If the difference between ratings is caused by the participation imbalance one would expect these values to be similar.

To compute the expected ranking they use the following formula

$$
E_{\text{Bilalic}}(k, n) \approx (\mu + c_1 \sigma) + c_2 \sigma \frac{n!}{(n-k)!n^k} (\log n - H(k-1))
$$

where $c_1 = 1.25$, $c_2 = 0.287$, and $H(k)$ is the $k$-th harmonic number. The formula relies on some assumptions such as normality and big numbers, and its derivation can be found in the original paper.

### Criticism

I have some criticism against the methodology explained in the last section, and it's basically based on (1) the formula for $E(k, n)$ doesn't give good results and  (2) the normal approximation is not a good model.

Let's start with the $E(k, n)$ formula. At first, I was surprised that the author of the paper had to derive a formula for the $k$ value after $n$ draws from a normal distribution since my intuition told me that this should be a more or less known result. After some googling I discovered this [answer](https://stats.stackexchange.com/a/9007/350686) from StackOverflow, which proposed the formula

$$
E_{\text{Blom}}(k, n) \approx \mu + \Phi^{-1} \left( \frac{k - \alpha}{n-2\alpha+1}\right)\sigma
$$

where $\alpha = 0.375$ and $\Phi^{-1}(x)$ is the inverse cumulative distribution function (also known as the quantile function) of the standard normal distribution.

It's clear that the two formulas are very different, so the natural question is to wonder if they agree and which one gives better results. To do so I've done a simple experiment: given a normal distribution $\mathcal{N}(\mu, \sigma)$ take $n$ draws from $\mathcal{N}$ and compute the average value of the top $k$ rating. Then compute the Blom and the Bilalic values and plot them with the simulated value. I've used $n=10000$, $\mu=1800$ and $\sigma=300$ since these are the typical values we are dealing with. The results are in the following plot

<figure>
    <img src="/docs/chess-gender-gap/bilalic-vs-blom.png" alt="german-distribution" width="300" class="center" />
  <figcaption class="center">Simulated $k$ top value after $n$ draws from a normal distribution and the corresponding Blom and Bilalic values.</figcaption>
</figure>

It's clear that the Blom formula gives better results for larger values of $k$. Therefore, I have decided to use $E_{\text{Blom}}$ to compute the expected values instead of $E_{\text{Bilalic}}$.

On the other hand, we have the assumption of normality. If you check the original paper it doesn't seem like a bad decision. In the figure below we see the ELO distribution for German players, and it seems that the normal fit is good enough.

<figure>
    <img src="/docs/chess-gender-gap/german-distribution.png" alt="indian-distribution" width="300" class="center" />
  <figcaption class="center">The distribution of the German chess rating with the best-fit normal curve superimposed. $n = 120399$, $\mu = 1461$, $\sigma=342$, $16 : 1$ men to women ratio. Figure from Bilalic et al.</figcaption>
</figure>

However, for our use case is not a good idea to use a normal distribution. There's a saying that reads _[many things are normal around the middle but not in the tails](https://twitter.com/ProbFact/status/1640809801671233544)_, and in our use case we're particularly interested in what happens in the tails because we want to compare the ratings of the best male and female players. Therefore, assuming that the data is normally distributed is not a good idea. On the other hand, if we look at the rating distribution of other countries it's obvious that it doesn't follow a Gaussian. In the next plot, we can see the distribution for India

<figure>
    <img src="/docs/chess-gender-gap/india-distribution.png" alt="german-distribution" width="300" class="center" />
  <figcaption class="center">The distribution of the Indian chess rating</figcaption>
</figure>

Following these two arguments, I've decided to drop the normal assumption. Instead, I'll use bootstrapping when needed, ie: to compute the expected $k$ rating after drawing $n$ values I'll draw $n$ values with repetition from the actual data and compute the average rating of the $k$ rating. This can be done with the following method


```python
def expected_elo_bootstrapping(n: int, 
                               k: int, 
                               ratings: Sequence[float], 
                               n_experiments: int = 100) -> Tuple[float, float]:
    sample = np.random.choice(ratings, size=(n_experiments, n))
    sorted_sample = np.sort(sample)
    k_mean = np.mean(x[:, -k])
    k_std = np.std(x[:, -k])
    return k_mean, k_std
```


# Results

## Difference between the best players

Now let's study the difference between the best male and female players for each country.  To do so I computed the actual difference between the best players of each country and the expected difference due to gender imbalance (using bootstrapping). Notice that the expected difference is computed without using the gender data, to compute it we only need to know how many players are in each group.

The results for each country are plotted below. The blue dot is the simulated difference between the top male and female (with an error bar of 2 standard deviations, ie 95%), and the black dot is the actual difference between the top players. If the actual difference is inside the error bar it means that there's more than a $5\%$ probability that the difference can be explained by chance.

<div style='text-align:center'>
<embed type="text/html" src="/docs/chess-gender-gap/countries.html" width="550" height="1100">
</div>

In around $92\%$ of the countries, the difference can be explained by participation rates, which means that the gap gender can be explained by chance. I find it interesting that even in Norway -the country of the current best chess player- the gender gap is explainable by participation imbalance.


## Difference between all top players

In the last section we experimented with the best players, but it can be generalised to the top $k$ players in each country. Due to the number of countries I'll just share some of the cases that I've found more interesting.

The x-axis of the plots is the rank of the players, the white square is the difference between the players with that rank, and the black square is the expected difference computed via bootstrapping.

The case of India it's particularly interesting since the expected difference is much higher than the actual difference, which means that Indian women are playing much better than expected, which I believe it's completely amazing.

<figure>
    <img src="/docs/chess-gender-gap/rank-vs-difference-IND.png" alt="ind-rank-vs-difference" width="600" class="center" />
  <figcaption class="center">Expected difference and actual difference for each rank $k$ in India</figcaption>
</figure>

In the case of Israel, all the differences can be clearly explained just by population imbalance. This is the country where it's more clear that the difference it's just a fabrication.

<figure>
    <img src="/docs/chess-gender-gap/rank-vs-difference-ISR.png" alt="isr-rank-vs-difference" width="600" class="center" />
  <figcaption class="center">Expected difference and actual difference for each rank $k$ in Israel</figcaption>
</figure>

Then we have cases like Spain, where the difference can't be explained only by participation rates. In this kind of case, one would need to study with more depth the sociological situation of these countries to understand why women are not developing their chess skills as expected.

<figure>
    <img src="/docs/chess-gender-gap/rank-vs-difference-ESP.png" alt="esp-rank-vs-difference" width="600" class="center" />
  <figcaption class="center">Expected difference and actual difference for each rank $k$ in Spain</figcaption>
</figure>

If you're interested in other countries you can use the code [here](https://github.com/alexmolas/alexmolas.github.io/blob/master/notebooks/chess-gender-gap) to generate the corresponding plots. 

# Conclusions

In conclusion, the gender gap in chess can be explained almost entirely as a statistical artifact due to the difference in the number of players between genders. By analyzing the data from more than 100 countries, we found that in more than 90% of them, the difference between the top male and female players can be explained by chance. This is contrary to popular beliefs, which attribute the gap to intrinsic differences between men and women. Our analysis is based on a rigorous mathematical approach, which involves using bootstrapping for computing the expected highest ranking for male and female players. We also highlighted a few issues with previous studies that attempted to address this topic, and we proposed an alternative approach that provides more accurate results.