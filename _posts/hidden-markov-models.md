---
layout: post
title: "Hidden Markov Models 1: Introduction"
description: Learning the basics about Hidden Markov models and its applications.
tags: dynamic-programming python hidden-markov-model 
---

I heard about Hidden Markov Models (HMM) about one year ago, however, until the beginning of this year I haven't had time to study them. To be honest, I was worried that this topic was too difficult, I guess that the word 'hidden' scared me a little bit. This same fear attacked me with other topics, such as neural networks and gradient boosting (I will try to write some post about these topics in the future). However, after some days reading and learning about HMM I realized that it's a very intuitive model and that can be easily understood with some basic understanding of statistics and maths.


---
**Table of contents:**
- [Markov Chains](#markov-chains)
- [Hidden Markov Models](#hidden-markov-models)
  - [Likelihood](#likelihood)
    - [Forward Algorithm](#forward-algorithm)
  - [Learning](#learning)
  - [Decoding](#decoding)
    - [Viterbi Algorithm](#viterbi-algorithm)
---

# Markov Chains

First of all, let us define what is a Markov Chain (MC), one of the fundamental pieces of HMM. A MC is a statistical model that describes a sequence of events in which the probability of observing an event depends only on the previous observed event. This can be expressed in a mathematical way as

$$P(X_{n+1}=x | X_1=x_1, X_2=x_2, ..., X_n=x_{n+1}) = P(X_{n+1}=x|X_1=x)$$

where $X_i$ are random variables.

This is a strong assumption, as it's saying that to predict to future state we only need information about the current one.


# Hidden Markov Models

How to characterize a HMM? 
Transition probabilities: $p(i,j)$ and emission probabilities $e_i(\vec{x})$. What does this means?

- Transition probabilities $p(i, j; \theta_t)$, the probability

## Likelihood

### Forward Algorithm

## Learning

## Decoding

### Viterbi Algorithm