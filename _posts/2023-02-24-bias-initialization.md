---
layout: post
title: "How to initialize your bias."
description: "Learn how initializing the correct bias in your neural network can speed up training process through analytical derivation and experiments."
tags: math stats deep-learning machine-learninbg
---

# tldr

Initializing correctly the bias of the last layer of your network can speed up the training process. In this post, I show first how to derive analytically the best values for the biases, and then I run an experiment to show the impact of using the correct bias. 

In particular, the best biases are

- Classification problem with $M$ classes with frequencies $F_i$, such that $\sum_j^M F_j = 1$, using softmax activation and categorical cross entropy loss: 

$$
b = \begin{pmatrix}
\log F_1 \\
\log F_2 \\
... \\
\log F_M
\end{pmatrix}
$$
- Regression problem using $L^2$ penalization and linear activation

$$
b = \text{mean}(y)
$$

- Regression problem using $L^1$ penalization and linear activation

$$
b = \text{median}(y)
$$



# Motivation

These last weeks at work I've tuned a neural network that is used to predict arrival times. Basically, the network receives a representation of Stuart's platform state (where are the drivers, where are the packages, etc.) and outputs the estimated time of arrival of some drivers. We decided to use a deep learning approach to avoid doing boring and unmaintainable feature engineering, but the problem then was to choose the model architecture. If we were solving an image classification problem it would have been trivial to design the architecture, in fact, we wouldn't need to design anything, just take ResNet50 and fine-tune it. However, our problem is not standard in the deep learning world, so we couldn't rely on pre-trained models or copy the architecture of previously successful models. We ended up defining an architecture based on convolutions, self-attention, and some dense layers here and there. The results were pretty good -it beat the previous model by +30%- and the model was deployed and everyone was happy. 

However, not everything is always that easy, and at some point, we noticed that our model was overfitting. This wasn't surprising since the model architecture and training process was never tuned. We just took our initial idea, run some experiments, changed some hyper-params by hand and called it a day. But now that the model is deployed and the stakeholders are happy we are working on tuning the model and making it more competitive. To do so I started with the great post by the great Karpathy [here](http://karpathy.github.io/2019/04/25/recipe/). It's not the first time I read it, but this time one of the points called specially my attention.

> **verify loss @ init**. Verify that your loss starts at the correct loss value. E.g. if you initialize your final layer correctly you should measure `-log(1/n_classes)` on a softmax at initialization. The same default values can be derived for L2 regression, Huber losses, etc.

What does Karpathy mean by verifying that your loss starts at the correct value? How can we achieve the `-log(1/n_classes)` loss on a softmax? Which are the respective initializations for L2 regressions, Hubber, etc? In this post, I'll show how to initialize the network to fulfil these requirements and their implications.

# Problem statement

We want to solve the problem of

> Which is the best initialization scheme for our network layers?

This is a broad question and has been addressed in a lot of works, such as Glorot and He (add references). In these works, the authors initialize the weights of the layers by sampling from a distribution with some optimized parameters. For instance, Glorot proposes to sample from $\mathcal{N}\left(0, 2/(n_i+n_o)\right)$  and He proposes to sample from $\mathcal{N}(0, 2/n_i)$. The common thing between these approaches is that the mean of the distribution is $0$. However, these works focus on the initialization of the weights of all the matrices of our network, while Karpathy talks only about the initialization of the last layer. Then, instead of solving the general question about how to initialize all the layers of the network, I will address the simplified problem of

> Which is the best initialization scheme for the last layer of our network?


# Solution

In this section, I will answer the above question for several deep learning architectures.

## Classification

Let's start with a classification problem. We can define a neural network of depth $N$ as a set of weight matrices $\{W_1, W_2, ..., W_N\}$, a set of biases $\{b_1, b_2, ..., b_N\}$, a set of non-linear activations $\{f_1, f_2, ..., f_{N-1}\}$ and a final activation layer $f_N = \text{softmax}$. Where $W_i \in \mathbb{R}^{d_{i} \times d_{i+1}}$ , $b_i \in \mathbb{R}^{d_{i+1}}$  and $f_i: \mathbb{R}^{d_{i+1}} \to \mathbb{R}^{d_{i+1}}$ . Then the output of the network is defined by the recurrence


$$
\begin{align}
s_i &= W_i x_{i} + b_i\\
x_{i+1} &= f_i(s_i) \\
\end{align}
$$


where $x_0$ is the input of our network. Now, we are interested in the input to the last layer, ie the $\text{softmax}$ layer. As we saw before, the usual initialization uses a normal distribution with mean zero, therefore, if our input of the network is standardized (ie: it has mean zero) we can expect the input to the last layer to have an average $W_N x_N = 0$. Therefore, the output of the last layer has the form

$$
o = \text{softmax}(b_N)
$$


Cool, we have our first result, let's see now how can we use this to optimize the initial values of $b_N$. The standard approach to classification problems is to use the cross-entropy loss


$$
\mathcal{L} = - \sum_i^M y_i \log \hat y_i
$$

where $M$ is the number of classes of our problem. Therefore, if we want to minimize the expected loss at initialization our best guess is to set $b_N$ such that the network output follows the same distribution of our data. This is if our training dataset has $M$ classes that appear with frequency $F_i$ such that $\sum_j^M F_j = 1$ we would like $\hat{y}_i = F_i$, ie the prediction for the $i$ class has the same probability as in the training dataset. With such an output the expected loss is then

$$
\begin{align}
\mathbb{E}[\mathcal{L}] &= -\sum_i^M \mathbb{E} [y_i \log \hat y_i] \\
&= -\sum_i^M \mathbb{E}[y_i] \log \mathbb{E}[\hat y_i] \\
&= -\sum_i^M \mathbb{E}[y_i] \log \mathbb{E}[\hat y_i] \\
&= -\sum_i^M F_i \log F_i
\end{align}
$$

where we have used that at initialization $y_i$ and $\hat y_i$ are independent, so we can write $\mathbb{E}[y_i \log \hat y_i] = \mathbb{E} [y_i] \log \mathbb{E} [\hat y_i]$. Notice that if the problem is balanced then we have $F_i = 1/M$ and the expected loss at initialization is $\mathcal{L}=-\log 1/M$ as Karpathy says. 

Nice, now we know which value to expect for the loss for a correctly initialized last layer, but now we need to know how to set $b_N$ such that the output has the same distribution as the training dataset. To do so we can use the definition of $\text{softmax}$

$$
\text{softmax}_i(x) = \frac{\exp x_i}{\sum_j \exp x_j}
$$

Now, using that the last layer is $\text{softmax}(b_N)$ we can write our constraint as

$$
F_i = \frac{\exp b_i}{\sum_j \exp b_j}
$$

which has the solution

$$
b_i = k\log F_i
$$


Therefore, setting $k=1$, the optimal initialization bias for our last layer has the form

$$
b_N = \begin{pmatrix}
\log F_1 \\
\log F_2 \\
... \\
\log F_M
\end{pmatrix}
$$

## Regression

In the last section, I've shown how to derive the optimal biases at initialization for a classification problem. In this section, I'll show how to do the same for a regression problem. The main differences between these approaches are (1) the loss we are using, (2) the last layer activation, and (3) the dimension of the output. In regression, the output is usually 1-dim, ie: we're just predicting one value, so $b_N \in \mathbb{R}$, and the last layer activation is just the identity. The more frequent these problems are

$$
\mathcal{L}_{\text{MSE}} = (y_i - \hat y_i)^2
$$

and 

$$
\mathcal{L}_{\text{MAE}} = |y_i - \hat y_i|
$$


Using the same rationale as before, we want to minimize these losses at initialization. It's known that without any further information, the value that minimizes MSE is $\textrm{mean}(y)$ and the value that minimizes MAE is $\textrm{median}(y)$. Therefore, since the output of the last layer is just $o = b_N$ (we're using the identity activation) we have that the values that minimize loss at initialization are


$$
b^{\text{MSE}}_N = \text{mean}(y)
$$

and


$$
b^{\text{MAE}}_N = \text{median}(y)
$$


The expected loss at initialization for the MSE is then the variance since

$$
\mathbb{E}[\mathcal{L}_\textrm{MSE}] = \mathbb{E}[(y - \text{mean}(y))^2]= \text{Var}[y]
$$

and for the MAE

$$
\mathbb{E}[\mathcal{L}_\textrm{MAE}] = \mathbb{E}[|y - \text{median}(y)|] = \frac{1}{n} \sum_i^n |y_i - \text{median}(y)|
$$

which I don't know if it has a specific name.


In the original post, Karpathy says that you can also find the optimal values for the Hubber loss, however, unlike with MAE and MSE there's no closed form for the value that minimizes the Hubber loss ([explaination here](https://stats.stackexchange.com/a/298336/350686)). However, we could obtain the value that minimizes the Hubber loss for our dataset numerically and then use it as the bias of our layer.

# Results

In the previous sections, I explained how to determine the best initial bias through mathematical analysis. However, in the real world, things are not always precise, and data can show that our assumptions were incorrect. In this section, I will conduct some experiments to see the impact of initializing biases correctly.

To conduct these experiments, I will use the CIFAR-10 dataset. I have made the problem unbalanced by sampling each class. Then, I created two CNN networks: one with the optimal bias strategy defined above and another with the standard initialization. You can find the code used to generate the models and datasets in this [notebook](https://github.com/alexmolas/alexmolas.github.io/blob/master/docs/optimal-biases/Optimal%20biases.ipynb).

The results are summarized in the following plot. We can see that the network with the optimized initial bias learns faster than the one with the normal network. This effect disappears if we train the network for a sufficient number of epochs. However, training large models is often costly. Therefore, if we can save time and money by setting the correct bias, it is worthwhile.

![loss](/docs/optimal-biases/opt-vs-normal-loss.svg){: width="300" height="300"}


