---
layout: post
title: "Training TensorFlow models with big tabular datasets (ii)"
description: Speeding up TensorFlow training.
tags: tensorflow optimization machine-learning
---

In my last [post]({% post_url 2022-04-15-tensorflow-with-big-tabular-datasets %}) I talked about how I used TensorFlow datasets to speed up the training phase. Today I've discovered another game changer: the [`prefetch`](https://www.tensorflow.org/api_docs/python/tf/data/Dataset#prefetch) method.

Whith this method, your dataset is going to prefetch (aka prepare before needed) some batches while the current element is being processed. Therefore, we improve latency and throughput at the cost of consuming more memory. Also, according to TensorFlow documentation:

> Most dataset input pipelines should end with a call to prefetch 

To call the `prefetch` method you need to specify the `buffer_size`, this is the maximum number of elements that will be buffered when prefetching. If you want to set this value dinamycally to the "optimal" one [^1] you can just use `tf.data.experimental.AUTOTUNE`.


Finally, just by adding the line

```python
dataset = dataset.prefetch(buffer_size=tf.data.experimental.AUTOTUNE)
```

I've reduced by 2 the training time of my model.

---

[^1]: I didn't find any TensorFlow documentation regarding how the optimal value is computed. I'll research this and write a post about it in the future.