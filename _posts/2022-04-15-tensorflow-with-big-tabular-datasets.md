---
layout: post
title: "Training TensorFlow models with big tabular datasets (i)."
description: How to train a tensorflow model when your training dataset doesn't fit in memory?
tags: tensorflow parquet machine-learning
header-img: "/docs/tensorflow-and-huge-data/dataset-in-memory.svg"
---



# Problem Statement
During the last months, I’ve been working on building a model using `Keras`. Up to last week, I was using only a few features and I had no problems training the model in my machine, but last week the number of features grew up to a few dozens, so the dataset size multiplied by ~10. With this change a new problem arose: the dataset wasn’t fitting in memory (it wasn’t even fitting in an EC2 machine with 32GB of RAM).

While this is a typical problem when you're working with images, and it has standard [solutions](https://www.tensorflow.org/api_docs/python/tf/keras/preprocessing/image/ImageDataGenerator), I couldn't find a similar solution for tabular datasets. In this post, we'll see how I solved this problem using TensorFlow datasets.

To give some context my model and features had the following details:

1. *Named inputs*: the model receives a dictionary of inputs like `dict[name, feature]`.
2. *Nested features*: some of the features are nested, in particular some of the features are arrays.

Without loss of generality, let's assume that the dataset looks like

$$
\begin{array}{c|c|c|c}
        \text{id}  & \text{feature 1} & \text{feature 2} & \text{target} \\ \hline
        1  & 42 & [1, 0, 5, 32] & 1.1 \\
        ...  & ... & ... & ... \\
        N  & 10 & [1, 3, 1, 2] & 2.3 \\
\end{array}
$$

where $N$ is big enough such that the full dataset doesn't fit in memory.

# Using *tf.data.Dataset*

Fortunately, TensorFlow developers have thought about this problem, and have implemented the [dataset](https://www.tensorflow.org/api_docs/python/tf/data/Dataset) API, and according to their documentation:

> Iteration happens in a streaming fashion, so the full dataset does not need to fit into memory.

So, the good news, we have a way to iterate over our dataset without having to fit it all in memory. To get a TensorFlow dataset we only need a generator that yields batches of features and targets. On the other hand, we can take advantage of the fact that our dataset can be stored in `parquet` format, and it can be partitioned. Hence, the only things we need now are: (1) a generator that iterates over the partitions of our dataset, and (2) a dataset with partitions that fit in memory. Let's assume that (2) is already done.

The following generator iterates over the partitions of a dataset then read one at each time and yields the features and targets.

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=generator.py"></script>

where `get_file_partitions` is a method that returns all the partitions of the dataset, `dataframe_to_dict` is a method that transforms the batch dataframe to a dictionary ready to be fed to a keras model, and `split_dataframe` is

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=split_dataframe.py"></script>


The idea behind `generator.py` is to iterate over the partitions of the dataset, having only one partition in memory at any moment. From the partition in memory we extract and yield batches of data, and once all the dataset has been batched we jump to the next partition. In the following image there's depicted a full epoch of data being iterated.

<div style="text-align:center">
    <img src="/docs/tensorflow-and-huge-data/dataset-in-memory.svg" width=500px class="center">
    <img src="/docs/tensorflow-and-huge-data/dataset-in-memory-2.svg" width=500px class="center">
    <img src="/docs/tensorflow-and-huge-data/dataset-in-memory-N.svg" width=500px class="center">
    <figcaption>Fig. 1 - How to generate batches of data from a dataset that doesn't fit in memory.</figcaption>
</div>
<br/>

To instantiate a TensorFlow dataset using a generator we need to specify its output signature, which is how we tell our dataset the data types of our batches. In our case, the output signature and the instantiated dataset are:

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=output_signature.py"></script>

Notice, that in we could pass our generator directly to the training process, however this wouldn't be thread-safe. In fact, if you try to do `model.fit(generator())` you would get the following warning:

> WARNING:tensorflow:multiprocessing can interact badly with TensorFlow, causing nondeterministic deadlocks. For high performance data pipelines `tf.data` is recommended.


# Training the model

The next step is to train our model. However, as you may have noticed, in the way we've initialized the TensorFlow dataset we never specified the length of our dataset. Therefore, if we want to train the model using the concept of epochs we first need to compute how many batch steps conform to a full epoch. Fortunately, we can get the number of rows our dataset has without having to read it all, just using `pyarrow.parquet` library as

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=number_of_rows.py"></script>

So the total number of steps per epoch is $\lceil \textrm{n_rows} / \textrm{batch size} \rceil$. Also, one nice thing about TensorFlow datasets is that we can use multiprocessing while training the model, and the only thing we need to enable multiprocessing is to specify the number of workers we want to use and set the multiprocessing argument to `True`. So finally, we can train our model like

<script src="https://gist.github.com/AlexMolas/7330531ef1acd5bb4d69a4b0dd3d5a5f.js?file=train.py"></script>

## Better performance

One thing I haven't mentioned yet is that by using TensorFlow datasets and multiprocessing you get better speed performance, as it's explained [here](https://www.tensorflow.org/guide/data_performance). In my particular case I got a reduction of ~5 in training time.

# Results & Conclusions

In this post, we have seen how to train models with tabular datasets that don’t fit in memory using the TensorFlow dataset API. Also, TensorFlow datasets allowed us to use multiprocessing in a thread-safe manner, and this has accelerated the training process by ~5.
