---
layout: post
title: "Jev can't be calibrated" 
description: "Jev is a useful zero-shot classifier, but its probabilities can't be calibrated for your data. Calibration depends on your data distribution, which Jev never sees, so treat its outputs as scores and recalibrate them on your own labeled examples."
tags:
toc: false
---


Unless you've been living under a rock, you've probably heard about Jev. [Simon Willison's post](https://simonwillison.net/2026/Sep/21/jev/) is a good overview, and this [one](https://www.nobodywho.ai/posts/jev-in-25-lines/) shows how to implement it in a few lines of Python. I haven't been able to try Jev yet, so this is based on its documentation, third-party experiments, and first principles. 

## Useful without training data

You can throw it at any classification problem without collecting training data first and get reasonable results. Many people on Twitter said, "This is just a fine-tuned BERT", but fine-tuning a BERT requires data. If you don't have data, Jev is a great alternative. Also, Jev is a **universal classifier**, whereas a fine-tuned BERT is only useful for the task it has been trained for. However, this comes with a cost, and being useful without data is exactly why its probabilities can't be calibrated for you


## Uncalibrated probabilities

TypeSafe says Jev was trained using [RLCD](https://docs.typesafe.ai/introduction/machine-learning-primer#rlcd-and-calibrated-decisions) (reinforcement learning for **calibrated** decisions), and that the probabilities it produces are calibrated. I don't think that's true. A model can be calibrated on TypeSafe's data and still be miscalibrated on yours.

A model is calibrated when for any predicted probability $p$ the true probability of the positive class given that prediction is $p$. This is $P(Y = 1 \mid \hat{p} = p) = p$, where $\hat{p}$ is the probability predicted by the model. Intuitively it means if you group all the instances where your model predicts X% then approximately X% of those actual cases turn out to be true (eg: if you take the emails where Jev said `spam_probability=0.7` you should expect about 70% of them to actually be spam). 

The important point is that calibration is not just a property of the model, but also of your data distribution. The same model can be calibrated on one dataset but not on another. Different companies can define spam the same way but have different data distributions. However, for the same input and prompt, Jev will provide the same probabilities to both companies, regardless of their different underlying data distributions. Therefore, the model may be calibrated for one company but not for the other. Even if RLCD successfully trains Jev to be calibrated on its training/evaluation distribution, its probabilities may not remain calibrated on your production distribution. 

There is some evidence the failure is worse than just a distribution shift. While writing this post I found these [tweets](https://x.com/shreyshahi/status/2102211285605830744), where Jev says a fair coin lands heads with probability 0.92. That is worse than the drift explained above. The true probability is in the prompt, and the model still does not report it. This [recent experiment](https://www.distillabs.ai/blog/jev-or-a-fine-tuned-small-model-we-built-a-pipeline-with-both-to-see-the-real-difference/) also finds that `Noul` is much better calibrated than `Choice` on the same problem. If Jev's probabilities have different semantics depending on which primitive I use, what exactly do "calibrated probabilities" mean?

If you want calibrated probabilities you'll still need to recalibrate Jev's probabilities on your own data. The good news is that is [cheap](https://scikit-learn.org/stable/modules/calibration.html). A few hundred labeled examples from your actual data can be enough to fit a Platt scaling on top of Jev's scores.

My take is to treat Jev's outputs as good scores (they rank examples well) rather than good probabilities. If your system depends on the actual number, like thresholds, expected costs or combining it with other models, measure calibration on your data before trusting it.
