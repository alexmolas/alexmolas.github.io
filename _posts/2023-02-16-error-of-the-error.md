---
layout: post
title: "The error of the error."
description: "."
tags: maths stats 
---

# tldr

In this post, I go down the rabbit hole of computing the uncertainty of the uncertainty. This is because measuring the uncertainty of a measure is a statistical process it makes sense to ask about its uncertainty. Therefore, I've computed the uncertainty of the uncertainty, which allowed me to write something like

$$
\mu = \hat\mu \pm u_\hat\mu \pm u_{u_{\hat\mu}} \pm ...
$$

where $u_{x}$ is the uncertainty of measure $x$. 

# Motivation

Back, in my physics student days, I used to spend a lot of hours every week in a lab. It wasn't my favourite subject, I was young and I thought that theoretical physics was the only cool field of science, but I've matured since then [^1]. It was common during these days to do experiments to measure some quantity. The standard approach was to repeat the measure a bunch of times and then compute the mean and its standard error. Mathematically, the idea behind this approach is based on the assumption that each measurement is like sampling from an underlying distribution of the measured value. The assumption is that measuring is an imperfect process, and therefore when measuring some quantity, an error is introduced. So for a measure with a "true" value of $\mu$, each experiment is like sampling from a distribution $\mathcal{N}(\mu, \sigma)$, where $\sigma$ was a fixed unknown value characterizing the error we made in each measure. Then, each experiment could be represented as a random variable $X_i \sim \mathcal{N}(\mu, \sigma)$.  After a bunch of measures, we can compute the statistics

$$
\begin{align}
\hat{\mu} &= \frac{1}{M} \sum_i^M X_i \\
\hat{\sigma}^2 &= \frac{1}{M-1} \sum_i^M \left(X_i - \hat{\mu}\right)^2
\end{align}
$$

where we call $\hat\mu$ the sample mean and $\hat \sigma$ the sample variance since they have been computed using a sample from the distribution. These statistics are unbiased $E[\hat{\mu}] = \mu$ and $E[\hat\sigma^2] = \sigma^2$, ie: they're a good approximation of the real parameters. That's cool, we have a way to compute the values of our distribution. But how good are these approximations? 

The case of the sample mean is well known. We can estimate its variance using the [central limit theorem](https://en.wikipedia.org/wiki/Central_limit_theorem) (CLT), which states that the sum of random variables from a generic distribution is normally distributed with a variance equal to the variance of the generic distribution. In our case, since to compute the mean we introduce a factor $1/M$, this means

$$
\sigma^2_{\hat\mu} = \frac{1}{M} \sigma^2
$$

Which leads to $\mu = \hat\mu \pm \frac{\sigma}{\sqrt{M}}$, but here we don't know the value of $\sigma$. The intuitive option is to replace it with the sample variance $\sigma \approx \hat\sigma$, leading to the classic result

$$
\mu = \hat\mu \pm \frac{\hat \sigma}{\sqrt{M}}
$$

Usually, my experiment report ended here. This was the standard procedure during those days, and to be honest I didn't challenge it too much. I just repeated these steps, got a good grade and moved to learn some <s>useless</s> cool theoretical topics. But, as I said before, I've matured a little bit (but not too much, otherwise I wouldn't be here writing this post), and the other day I started wondering which is the error of the estimated error. Let me explain myself. It makes sense to ask ourselves about the associated uncertainty of $\hat\mu$, as we did above. Then, it also makes sense to ask about the error of $\hat\sigma$. And since $\hat\sigma$ is the error of $\hat\mu$, we would be asking about the error of the error. Here I'm going to develop some maths to answer these questions.

# Error of the error?

Let's start with the definition of $\hat\sigma^2$

$$
\hat\sigma^2 = \frac{1}{M-1} \sum_i^M\left(X_i - \hat{\mu}\right)^2
$$

If we divide both sides by the actual variance $\sigma^2$ of the distribution we obtain

$$
\frac{\hat\sigma^2}{\sigma^2} = \frac{1}{M-1}\sum_i^M \left(\frac{X_i - \hat\mu}{\sigma}\right)^2 = \frac{1}{M-1}\sum_i^M Z_i^2
$$

where $Z_i = (X_i - \hat\mu)/\sigma$ . Since $X_i$ comes from a normal distribution then $Z_i \sim \mathcal{N}(0, 1)$ [^2]. And the sum of the squares of normal random variables follows, by definition, a [chi-squared distribution](https://en.wikipedia.org/wiki/Chi-squared_distribution). Therefore $(M-1)\frac{\hat\sigma^2}{\sigma^2} \sim \chi^2(M)$, or which is equivalent

$$
\sqrt{M-1}\frac{\hat\sigma}{\sigma} \sim \chi(M)
$$

Using the same assumption as before we can take the limit of large $M$, which for random variables from a chi distribution is $\lim_{\mu \to\infty} \langle \chi(M) \rangle = \sqrt{M}$ and $\lim_{M \to \infty}\langle \chi(M)^2\rangle - \langle \chi(M) \rangle^2  = 1/2$ [^3].  Also, since the chi-squared distribution comes from summing random variables we can apply the CLT again, and using the asymptotic mean and variance we get $\sqrt{M-1}\frac{\hat\sigma}{\sigma} \sim \mathcal{N}(\sqrt{M}, 1/\sqrt{2})$, which can be simplified as

$$
\hat\sigma \sim \mathcal{N}\left(\sigma, \frac{\sigma}{\sqrt{2M}}\right)
$$

This means that as we get more measurements of our quantity of interest our estimation of the variance decreases as $\propto \frac{1}{\sqrt{M}}$ (similarly as $\hat \mu$). Then, this allows us to write $\hat\sigma \approx \sigma$ if $M$ is big enough, where "big enough" depends on the value of $\sigma$. This dependence makes sense since the bigger is $\sigma$ the more measurements we need to get an accurate value of $\hat\sigma$. Finally, using the same terminology as before we can write down

$$
\sigma = \hat\sigma \pm \frac{\hat\sigma}{\sqrt{2M}}
$$

So we can conclude that, under some reasonable conditions, the error of our error is $\frac{\hat\sigma}{M\sqrt{2}}$.

# Non-normality

The reader may have noticed that the results reported above are not generic. In our approach, we've assumed that the underlying distribution is a normal distribution, which makes sense for the experimental measure but might not hold in a different scenario. For example, imagine you're measuring the [lifetime of cars](https://www.amolas.dev/blog/buy-used-cars/), and you don't know which distribution they follow. You would like to report the average lifetime and the standard deviation of the distribution. To do so you measure the lifetime of $M$ cars and compute the mean and the standard deviation of this sample. Then, you can report that the mean of the distribution is $\mu = \hat\mu \pm \hat\sigma / \sqrt{M}$ (by applying CLT), but what about the standard deviation? 

Let's start by defining a generic pdf $F(x)$ with mean $\mu_F$ and variance $\sigma^2_F$. From this distribution we sample values $X = \{X_1, X_2, ..., X_M\}$, and we compute the sample variance from $X$ as

$$
\hat\sigma^2 = \frac{1}{M-1} \sum_i^N (X_i - \hat\mu)^2
$$

Now, this new random variable $\hat\sigma^2$ follows an unknown distribution $\Sigma$, ie $\sigma \sim \Sigma$. What can we say of $\Sigma$? Again, since $\hat\sigma^2$ comes from summing random variables we can use the CLT, so we know that $\Sigma$ is a normal distribution, ie $\Sigma = \mathcal{N}(\mu_{\hat\sigma^2}, \sigma_{\hat\sigma^2})$. Let's see what can we say about the parameters of this distribution.

On one hand, since $\hat\sigma^2$ is an unbiased estimator we know $\mu_{\hat\sigma^2} = \hat \sigma^2 = \sigma_F^2$.  But what about the variance of the sample variance? [Here](http://www.asasrms.org/Proceedings/y2008/Files/300992.pdf) you can find how to derive the generic formula, which is

$$
\sigma^2_{\hat\sigma^2} = \frac{1}{M} \left(\mu_{4,F} - \frac{M-3}{M-1} \sigma_F^4\right)
$$

where $\mu_{4, F} = E[(X-\mu_F)^4]$ is the fourth central moment of the distribution $F$. 

Therefore, we can write $\sigma^2 = \hat\sigma^2 \pm \sigma_{\hat\sigma^2}$, which is

$$
\sigma^2= \hat\sigma^2 \pm \sqrt{\frac{1}{M} \left(\mu_4 - \frac{M-3}{M-1}\sigma^4\right)}
$$

Cool! We have the formula to get the error of the sample variance $\hat\sigma^2$, but what we want is the standard deviation $\hat\sigma$ (remember that what we want to estimate is the error of the error). We can obtain it using [propagation of uncertainty](https://en.wikipedia.org/wiki/Propagation_of_uncertainty), which basically says that the error of a function $g(x_1, x_2, ..., x_z)$ is

$$
u_g^2 = \sum_i \left(\frac{\partial g}{\partial x_i}\right)^2 u_{x_i}
$$

where $u_{x_i}$ is the error of the variable $x_i$. In our case we have $\sigma = g(\sigma^2)$ with $g(x)=\sqrt{x}$. Therefore

$$
\sigma_{\hat\sigma} = \frac{1}{2\hat\sigma} \sqrt{\frac{1}{M} \left(\mu_4 - \frac{M-3}{M-1}\sigma_F^4\right)}
$$

Nice[^4], we have a formula for the error of the error. But wait for one second! There are some values in the formula that we don't know, ie: $\mu_{4, F}$ and $\sigma_F$. We can make the same approximation as before and set $\mu_{4,F} \approx \hat\mu_{4}$ and $\sigma_F \approx \hat\sigma$ and write down

$$
\sigma = \hat\sigma \pm \frac{1}{2\hat\sigma}\sqrt{\frac{1}{M}\left(\hat\mu_4 - \frac{M-3}{M-1}\hat\sigma^4\right)}
$$

Finally, combining the error of the standard deviation with the expression of the mean value, we get

$$
\mu = \hat\mu \pm \frac{\hat\sigma}{\sqrt{M}} \pm \frac{1}{2M\hat\sigma}\sqrt{\hat\mu_4 - \frac{M-3}{M-1}\hat\sigma^4}
$$

# Error of the error of the error ...

In the last section, we found a closed formula for the error of the error. But to do that we made some approximations. And here is where things can get a little bit crazy, because since we made some approximations one may ask how this approximations impact on the accuracy of our value of the error of the error. This is, one may ask about the error of the error of the error. But to answer this question one would need to make some approximations, and will enter in an infinite loop where at each step we'll need to make approximations and continue our burden in aeternum like the poor Sisyphus. But I want to stay sane, so I'll just write


$$
\mu = \hat\mu \pm \frac{\hat\sigma}{\sqrt{M}} \pm \frac{1}{2M\hat\sigma}\sqrt{\hat\mu_4 - \frac{M-3}{M-1}\hat\sigma^4} \pm \mathcal{O}(\mu_4)
$$


Which I don't know if it makes sense, but it's late and I want to sleep.





---

[^1]: Fortunately, I've grown up and I've learnt to appreciate the subtle art of experimental science, which has happened basically because now I work as a data scientist in a real company and I've learnt that dealing with real world data is not easy and let alone boring.  

[^2]: This is a standard process in ML and it's called standardization. The motivations is to transform all the normal features variables to follow a normal distribution with zero mean and unit variance, avoiding in this way scale differences between variables, which can led to problems in a bunch of cases.

[^3]: Exercise left to the reader ;)

[^4]: One can easily check that dimensional analysis is correct. If $[\sigma] = T$, then $[\sigma_{\hat\sigma}] = \frac{1}{T} \sqrt{T^4 - T^4} = \frac{T^2}{T} = T$ as expected. For a more interesting application of dimensional analysis I recommend you this [post](https://gregorygundersen.com/blog/2023/02/11/dimensional-analysis/). 