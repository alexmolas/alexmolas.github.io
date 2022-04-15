---
layout: post
title: "Training tensorflow model with big tabular datasets."
description: How to train a tensorflow/keras model when your training dataset doesn't fit in memory?
tags: tensorflow parquet machine-learning
header-img: "/docs/continuous-blackjack/udist-t-vs-p.svg"
---

---

- [Problem Statement](#problem-statement)
- [Using *tf.data.Dataset*](#using-tfdatadataset)
- [Training the model](#training-the-model)

---


# Problem Statement
During the last months, I’ve been working on building a model using `keras`. Up to last week, I was using only a few features and I had no problems training the model in my machine, but last week the number of features grew up to a few dozens, so the dataset size multiplied by ~10. With this change a new problem arose: the dataset wasn’t fitting in memory (it wasn’t even fitting in an EC2 machine with 32GB of RAM).

While this is a typical problem when you're working with images, and it has standard [solutions](https://www.tensorflow.org/api_docs/python/tf/keras/preprocessing/image/ImageDataGenerator), I couldn't find a similar solution for tabular datasets. In this post, we'll see how I solved this problem using TensorFlow datasets.

To give some context my model and features had the following specific details:
1. *Named inputs*: the model receive a dictionary of inputs like `dict[name, feature]`.
2. *Nested features*: some of the features are nested, in particular some of the features are arrays.

Without loss of generality let's assume that the dataset looks like

$$
\begin{array}{c|c|c}
        \text{id}  & \text{feature 1} & \text{feature 2} \\ \hline
        1  & 42 & [1, 0, 5, 32] \\
        ...  & ... & ... \\ 
        N  & 10 & [1, 3, 1, 2] \\
\end{array}
$$

Where $N$ is big enough such that the full dataset doesn't fit in memory.

# Using *tf.data.Dataset*

Fortunately, TensorFlow developers have thought about this problem, and have implemented the [dataset](https://www.tensorflow.org/api_docs/python/tf/data/Dataset) API, and according to their documentation:

> Iteration happens in a streaming fashion, so the full dataset does not need to fit into memory.

So, the good news, we have a way to iterate over our dataset without having to fit it all in memory. To get a TensorFlow dataset we only need a generator that yields batches of features and targets. On the other hand, we can take advantage of the fact that our dataset can be stored in `parquet` format, and it can be partitioned. Hence, the only things we need now are: (1) a generator that iterates over the partitions of our dataset, and (2) a dataset with partitions that fit in memory. Let's assume that (2) is already done.

The following generator iterates over the partitions of a dataset then read one at each time and yields the features and targets.

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=generator.py"></script>

where `get_file_partitions` is a method that returns all the partitions of the dataset, `dataframe_to_dict` is a method that transforms the batch dataframe to a dictionary ready to be fed to a keras model, and `split_dataframe` is

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=split_dataframe.py"></script>


To instantiate a TensorFlow dataset using a generator we need to specify its output signature, which is how we tell our dataset the types it's going to output. In our case, the output signature and the instantiated dataset are:

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=output_signature.py"></script>

# Training the model

The next step is to train our model. However, as you may have noticed, in the way we've initialized the TensorFlow dataset we never specified the length of our dataset. Therefore, if we want to train the model using the concept of epochs we first need to compute how many batch steps conform to a full epoch. Fortunately, we can get the number of rows our dataset has without having to read it all, just using `pyarrow.parquet` library as

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=number_of_rows.py"></script>

So the total number of steps per epoch is $\lceil \textrm{n_rows} / \textrm{batch size} \rceil$. Also, one nice thing about TensorFlow datasets is that we can use multiprocessing while training the model, and the only thing we need to enable multiprocessing is to specify the number of workers we want to use and set the multiprocessing argument to `True`. So finally, we can train our model like

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=train.py"></script>
