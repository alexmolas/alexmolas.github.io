---
layout: post
title: "Field theory for recurrent mobility"
description: A review of my first -and for the moment the only- paper published in a top journal.
tags: physics mobility data-analysis
---

Three years ago I published my first paper -and for the moment the only one- in a top tier journal: [Nature](https://www.nature.com/articles/s41467-019-11841-2). The paper is based on my master's [thesis](https://ifisc.uib-csic.es/en/publications/field-theory-for-recurrent-mobility/), which I pursued in the [IFISC](https://ifisc.uib-csic.es/en/) research center during the 2016-2017 academic year. 

This project was the first time that I did big scale data analysis, so I keep a special place in my heart for it, and to celebrate the aniversary of the publication of the paper I've decided to write a summary of the project.

# General Idea

The general idea behind the project was to analyze how people commute to their workplace and back [^1]. Our main hypothesis was that people choose where to work following a law similar to the gravitational law. To do the analysis we used data from Twitter, to characterize the home and workplace locations.

# Introduction

First of all, let me introduce some notation. We call $T_{ij}$ to the daily flow of commuters from cell $i$, home, to $j$, work, where we divided the city into cells of $1 \times 1 \; km^2$. This matrix contains only information about the fluxes between the origin and the destination, this is why it's usually called the origin-destination (OD) matrix.

Using this matrix one can define a vector centered in $i$, $\vec{T}_{ij} = T_{ij} \hat{u}_{ij}$ where $\hat{u}_{ij}$ is the unit vector from $i$ to $j$. Now, we can take all the vectors with origin at $i$ and sum them and obtain a vector $\vec{T}_i = \sum_j T_{ij} \hat{u}_{ij}$ in every cell $i$.

Vectors $ \vec{T_i} $ define a field in the space. Notice that if the mobility is balanced in opposite directions the vector can vanish. These points where the vector vanishes are known as [Lagrange points](https://en.wikipedia.org/wiki/Lagrange_point). In the image below we show how the vector field $\vec{T}_i$ is built and also the resulting fields for London and Paris.

Following the classical field theories, we can now define

$$
\vec{W}_i = \frac{\vec{T_i}}{m_i} = \sum_{j \neq i} \frac{T_{ij}}{m_i} \hat{u}_{ij}
$$

where the mass $m_i$ corresponds to the cell population. The population is defined as $m_i = \sum_j T_{ij}$.

![figure-1](/docs/field-theory-recurrent-mobility/figure-1.png){: width="1000" height="250"}

# Data

In the analysis, we used two sources of data: Twitter and the census. In this section, I describe both sources and the data cleaning procedures.

## Twitter

We used geolocated Twitter data in big cities and conurbations to extract information on commuters mobility. Even if the number of users is smaller than the local population, it has been shown that this data is valid to study aggregated urban mobility at scales larger than $1 km^2$ with a global coverage.

Our database was composed of tweets with coordinates in the area of Manchester–Liverpool, London, Los Angeles, Paris, Rio de Janeiro and Tokyo from March 2015 to October 2017.

Tweets on Saturdays and Sundays, people moving faster than 200 km/h, users tweeting more than once per second, people tweeting <10 times in the whole time window, and for less than one month were filtered out.

We consider the interval from 8 AM to 8 PM in local time as working hours, tweets in this interval are supposedly posted from the work place. Similarly, the rest of tweets are assumed to be posted from home. We assign to every user a home and a work cell as the most common cells during the corresponding hours. With this information, we can assume a daily trip from home to work for every user and another one back. Aggregating trips we can generate an OD matrix for the whole city, where each element $T_{ij}$ contains the number of people commuting from cell $i$ to $j$.

## Census

In addition to the Twitter data, the same study is repeated with census data from France and the United Kingdom. This data is publicly available on governmental websites (FR, https://www.insee.fr and UK, https://www.ons.gov.uk/census/2011census)

# Models

## Gravity model

Let's describe now our first model: the gravity model. In this framework, the flow between two cells $i$ and $j$ is proportional to the product of their populations, and it's inversely proportional to the travel cost between the two cells $f(d_{ij})$, where $d_{ij}$ is the distance between the cells. Therefore, the flow from $i$ to $j$ is given by 

$$
T^g_{ij} \propto \frac{m_i m_j}{f(d_{ij})}
$$

According to [[1]](#1), the best travel cost is the exponential one, ie: $ f(d_{ij}) = \exp (d_{ij} /d_0) $. Therefore, we have

$$
\vec{T}^g(i) = \kappa m_i \sum_j m_j \exp \left\{ - \frac{d_{ij}}{d_0} \right\} \hat{u}_{ij}
$$

### Maxwell Laws

The vector field $\vec{W}$ in the case of the gravity model is

$$
\vec{W}^g = \kappa m_i \exp \left\{ - \frac{d_{ij}}{d_0} \right\} \hat{u}_{ij}
$$

This can be seen as an analogy with the electric fields, where the force between particles is given by $\vec{F} = q\vec{E}$. One can try to find laws similar to the Maxwell laws, for example, the Gauss law states $\Phi^E = \oint_A \vec{E} d\vec{S} = 4\pi Q$. In the case of the gravity model it can be shown that

$$
\Phi^g = 2 \pi \kappa m_i R e^{-R/d_0}
$$

On the other hand, a version of Maxwell-Faraday law $ \nabla \times \vec{E} = \partial_t \vec{B} $ can be also derived for the gravity model

$$
\nabla \times \vec{W}^g = \vec{0}
$$

Since the curl of the vector field vanished we can write the vector field as the divergence of a scalar potential $\phi^g$, in particular, the potential created in $\vec{x}$ by a population $m_i$ in $\vec{x}_i$ is

$$
\phi_{\vec{x}_i}^g(\vec{x}) = - \kappa m_i d_0 \exp\left\{ -\frac{|| \vec{x} - \vec{x}_i ||}{d_0} \right\}
$$

And the potential created by a city -ie: a collection of cells with populations- is then

$$
\phi_{\text{city}}^g(\vec{x}) = \sum_{i \in \text{city}} \phi_{\vec{x}_i}^g(\vec{x})
$$

## Radiation model

Now, let's explore the radiation model. This framework is inspired in particles that radiate and absorb particles, and its vector field is 

![figure-2](/docs/field-theory-recurrent-mobility/figure-2.png){: width="800" height="250"}

The vector field given by this theory is

$$
\vec{T}^r(i) = \kappa m_i \sum_j \frac{m_i m_j}{(m_i + s_{ij}) (m_i + m_j + s_{ij})} \hat{u}_{ij}
$$


where $s_{ij}$ is the total population inside a circle of radius $R = d_{ij}$ excluding the population in $i$ and $j$. The analytical derivation of this formula can be found in [[2]](#2)

# Results

## Does the empirical field fulfill Gauss Law?

We've shown that the gravity model fulfils the Gauss law, and in this section, we will study if the empirical field defined by the OD matrix fulfills also this law. We want to check

$$
\Phi_W^S = \oint d \ell \; \vec{n} \; \vec{W} \stackrel{?}{=} \int dS \; \nabla \vec{W} = \Phi_W^V
$$

where $\vec{n}$ is the unit vector normal to the perimeter in each point, $d\ell$ the infinitesimal of length, and $dS$ is the infinitesimal of area. What we want to check is if the integral of the field over the perimeter is the same as the integral of the divergence of the field in the area.

The numerical estimations of the flux as a function of the radius using both integrals are shown in the following figure. To compute the fluxes we used two perimeters shapes: circles and squares. The results imply that the empirical field does indeed fulfil Gauss’s theorem

![figure-3](/docs/field-theory-recurrent-mobility/figure-3.png){: width="800" height="250"}

## Is the field irrotational?

Similarly to the last section, we computed the curl of the empirical field. Then we computed the modulus of the curl $ \| \nabla \vec{W} \| $ and plotted it. To evaluate whether the modulus is small or not we defined a null model by randomly changing the angles of the vectors of the empirical field. With this and other techniques it was shown that the empirical vector field $ \vec{W} $ is irrotational.

![figure-4](/docs/field-theory-recurrent-mobility/figure-4.png){: width="800" height="250"}


## Models

In this section, we will compare the results of both models.

The model parameters (for the gravity $k$ and $d_0$ ) have been adjusted to best reproduce the curve of the flux as a function of distance from the city centre in terms of $R^2$ .

We considered a set of circles centred at the centre of London with a radius $R$ from 0 to 40 km. The flux of $ \vec{W} $ across the circles with different $R$ is computed for both models and compared with the empirical value. The results are plotted in the next figure.

![figure-5](/docs/field-theory-recurrent-mobility/figure-5.png){: width="800" height="250"}

Furthermore, we also measured the difference between the empirical angles $\Theta_{e}$ and the model angles $\Theta_m$. 

![figure-6](/docs/field-theory-recurrent-mobility/figure-6.png){: width="800" height="250"}

From these analyses, we can conclude that the gravity model is better at predicting the fluxes between cells for commuting trips.

## Potentials

Since we have empirically found that the field can be considered irrotational we can compute also the empirical potential for the field. We can also compare the empirical potential with the potential derived from the gravity model. 

![figure-7](/docs/field-theory-recurrent-mobility/figure-7.png){: width="800" height="250"}

One nice feature of the potential is that it has a clear minimum in the centre of the city. This can be used to determine effective city centres in big cities or in conurbations. This method can be used to draw geographic limits between cities.

![figure-8](/docs/field-theory-recurrent-mobility/figure-8.png){: width="800" height="250"}

# Conclusions

To finalize, let me summarise the main takeaways we introduced in the paper:

1. Vector field framework to characterize human mobility flows.
2. We discovered that, when considering recurrent home-work mobility, the field representing the flows satisfies Gauss' theorem and also it's irrotational.
3. Since the field is irrotational it's possible to compute a scalar potential.
4. The gravity model with a decaying exponential travel cost can reproduce the empirical measurements. The potential generated by the gravity model is compatible with the empirical one.
5. This potential is a fundamental tool to tackle hard problems such as the definition of centres in cities, polycentricity and borders in conurbations systems. For example, borders could be defined as the locations where the potential falls below a fixed percentage from the highest peak of the city, separating the basins of attraction of the different centres.
6. We showed that field theory can be used to tackle mobility problems. This approach allows applying all the mathematical advances developed during the last centuries in the area of field theory to this problem.

# Conclusions 2.0

While writing this post I noticed several things which I think are worth it to share.

1. My writing style 5 years ago was bad. While re-reading my thesis I was embarrassed about how I presented some ideas.
2. Simple is better. When I wrote the thesis I tried to make everything look complex and complicated. I wanted everyone that read my thesis to feel like something big was happening. A lot of mathematical notation. Mathematical derivations that weren't needed. Good looking but unneeded plots. Now I realize that less is better, and that "keep it simple stupid" is a piece of good advice.
3. Although there are many things that could be improved, I still feel very proud of the work I did. I hope I can publish a paper again at some point.

---

# References

<a id="1">[1]</a> 
M. Lenormand, A. Bassolas, and J. J. Ramasco, “Systematic comparison of trip distri-
bution laws and models”, Journal of Transport Geography, vol. 51, pp. 158 –169, 2016.

<a id="2">[2]</a> 
F. Simini, M. C. Gonzalez, A. Maritan, and A.-L. Barabasi, “A universal model for
mobility and migration patterns”, Nature, vol. 484, pp. 96–100, 2012

---

[^1]: Unfortunately, with the advent of WFH policies, the results of the paper might not apply anymore. 

