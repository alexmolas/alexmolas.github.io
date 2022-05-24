---
layout: post
title: "Training TensorFlow models with big tabular datasets (iii): preparing a warmup for TensorFlow models."
description: How to create a warmup file for your tensorflow model using TFRecordWriter and tensorflow_serving.apis.
tags: tensorflow optimization machine-learning
---

In my last two posts, ([here]({% post_url 2022-04-15-tensorflow-with-big-tabular-datasets %}) and [here]({% post_url 2022-04-25-tensorflow-prefetch %})), I showed how to speed up the training phase of TensorFlow models. In this post, I'll show how to speed up the inference phase of TensorFlow models using warmup files.

# Why I needed a warmup file

In my case, this was useful because after a change in the model architecture the Jenkins pipelines that deployed the model started to fail. The problem was that the model was taking a lot to make the first predictions, and therefore the Jenkins pipelines were failing due to a time-out during the execution of the integration tests.

# Warmup file documentation

After some research, I discovered this is a common problem, and it's caused when your model has components that are lazily initialized, so the first time you call the model these components are initialized, and the inference time can be several orders of magnitude higher than that of a single inference request. Fortunately, TensorFlow let you [define a warmup file](https://www.tensorflow.org/tfx/serving/saved_model_warmup) with examples that are executed when the model is loaded. So by just defining this file inside the model, you can solve this problem.
 
The problem I found is that the information on how to generate such a file is quite small. The only documentation about the warmup generation in TensorFlow official documentation is

```python
import tensorflow as tf
from tensorflow_serving.apis import classification_pb2
from tensorflow_serving.apis import inference_pb2
from tensorflow_serving.apis import model_pb2
from tensorflow_serving.apis import predict_pb2
from tensorflow_serving.apis import prediction_log_pb2
from tensorflow_serving.apis import regression_pb2

def main():
    with tf.io.TFRecordWriter("tf_serving_warmup_requests") as writer:
        # replace <request> with one of:
        # predict_pb2.PredictRequest(..)
        # classification_pb2.ClassificationRequest(..)
        # regression_pb2.RegressionRequest(..)
        # inference_pb2.MultiInferenceRequest(..)
        log = prediction_log_pb2.PredictionLog(
            predict_log=prediction_log_pb2.PredictLog(request=<request>))
        writer.write(log.SerializeToString())

if __name__ == "__main__":
    main()
```
{: file='documentation.py'}

But here they're missing the most important part: how to define a `request`?

# How to define a warmup file

Let's assume that the data you want to use to warmup the model is in a `pd.DataFrame`, and you want to generate a warmup example for every row in the dataframe. To define a `request = predict_pb2.PredictRequest` you need to define two fields:

1. `model_spec` is an instance of `model_pb2.ModelSpec`. This object is used to store model specifications, but for my particular case it was enough to just specify the parameter `name`. Therefore, `model_spec=model_pb2.ModelSpec(name=<model_name>)`.

2. `inputs` is a `dict[str, TensorProto]`. This is the critical part, where the warmup examples are defined. The examples are passed via a dictionary where the keys are the feature names and the values are `TensorProto` with the values of the features. You may ask now what the hell a `TensorProto` is?  A `TensorProto` is a protocol buffer representing a tensor. And a protocol buffer (also known as protobuf) is a mechanism developed by Google for serializing structured data. You can think about `protobufs` like `jsons` with types. [Here](https://developers.google.com/protocol-buffers/docs/pythontutorial) you have a tutorial on protobufs with python. TensorFlow allows you to define `protobufs` from `tensors` via [`tf.make_tensor_proto`](https://www.tensorflow.org/api_docs/python/tf/make_tensor_proto). But to use this function one first need to define `tensors` with the desired values inside, and to do this I'm using the custom function `placeholders_to_tensor` (probably you'll needs to develop a custom `placeholders_to_tensor` depending on your data).

Wrapping up everything we get the following snippet

                                                                                                                                            
```python
from typing import Dict, Sequence
import os

import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.core.framework.tensor_pb2 import TensorProto
from tensorflow_serving.apis import model_pb2
from tensorflow_serving.apis import predict_pb2
from tensorflow_serving.apis import prediction_log_pb2

def placeholders_to_tensor(placeholders: Sequence[tf.Tensor], row: pd.Series) -> Dict[str, tf.Tensor]:
    tensors = {}
    for p in placeholders:
        if isinstance(row[p.name], np.ndarray):
            tensors[p.name] = tf.constant([row[p.name]], dtype=p.dtype)
        else:
            tensors[p.name] = tf.constant([[row[p.name]]], dtype=p.dtype)
    return tensors

def dict_to_proto(tensors_dict: Dict[str, tf.Tensor]) -> Dict[str, TensorProto]:
    return {k: tf.make_tensor_proto(v) for k, v in tensors_dict.items()}

def generate_warmup_file(model_path: str, data: pd.DataFrame):
    model = tf.keras.Model.load_model(model_path)
    warmup_path = os.path.join(model_path, "assets.extra/tf_serving_warmup_requests")
    with tf.io.TFRecordWriter(warmup_path) as writer:
        for i, row in data.iterrows():
            tensors = placeholders_to_tensor(placeholders=model.inputs, row=row)
            inputs = dict_to_proto(tensors)
            request = predict_pb2.PredictRequest(
                model_spec=model_pb2.ModelSpec(name=model.name), inputs=inputs
            )
            log = prediction_log_pb2.PredictionLog(
                predict_log=prediction_log_pb2.PredictLog(request=request)
            )
            writer.write(log.SerializeToString())
```
{: file='main.py'}

where `model_path` is the path of the model, and `data` is a dataframe with the examples used for warmup

This script will generate a warmup file under `<model_path>/assets.extra/tf_serving_warmup_requests`, and the next time you load the model using TensorFlow Serving you'll see how the warmup examples are executed and get the following logs

```
2022-05-16 20:45:09.124812: I tensorflow_serving/servables/tensorflow/saved_model_warmup_util.cc:71] Starting to read warmup data for model at <...> with model-warmup-options 
2022-05-16 20:45:09.735314: I tensorflow_serving/servables/tensorflow/saved_model_warmup_util.cc:122] Finished reading warmup data for model at <...>. Number of warmup records read: 1000. Elapsed time (microseconds): 615674.
```

# Conclusions

In this post, I showed how to generate warmup files using TensorFlow and TensorFlow Serving. The official documentation wasn't helping me, so I hope this post can help anyone who is in the same situation as me.
