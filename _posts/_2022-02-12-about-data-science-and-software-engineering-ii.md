---
layout: post
title: "Data Science and Software Engineering (II)"
description:
tags: data-science software-engineering
---

---

- [List of bad practices](#list-of-bad-practices)

---

In my last [post]({% post_url 2022-02-07-about-data-science-and-software-engineering-i %}) I talked about why best software engineering practices can help you to develop better data science projects. In this post I'll share some of the bad practices that according to my experience may slow down your progress. Of course, this is based on what I've experimented, and others experience can be completely different.

# List of bad practices

Here, I show a brief list of some of the bad data science practices I have myself done at some point:

1 - **Not using the correct tools**, aka *overusing jupyter notebooks*. A lot can be said about notebooks, but I truly recommend you the [I don't like notebooks](https://conferences.oreilly.com/jupyter/jup-ny/public/schedule/detail/68282.html) talk by Joel Grus. Here I'm not saying that jupyter notebooks are bad by itself, in fact they're very useful to formulate hypotheses about the data. However, once you have a clear hypothesis that you want to test, you should try to move and organize all the code outside the notebook. 

> "Notebooks encourage bad habits" Joel Grus

2 - **Mutable data**, ie: overwriting datasets after preprocessing them. If you overwrite your datasets every for each transformation you do and there's some bug in one transformation, then it will be almost impossible to detect where the bug occurs. Also, if there's some change in the logic of the data processing, you'll need to re-run all the processes from the begining, instead of only running the processes affected by the logic change.

3 - **Missing tests**. The lack of unit test in machine learning and data science projects is sometimes alarming. One can argue that the output of some machine learning processes are random so then it's difficult to write tests about them. I agree that's it's not easy, but this doesn't excuse you of trying it. Actually, there's this concept that has become quite popular in the functional programming world called [property-based testing](https://medium.com/criteo-engineering/introduction-to-property-based-testing-f5236229d237), or PBT. In PBT, instead of testing the specific outputs of your methods you check their properties. For example, ...
  On the other hand, you can always test your data transformations.

, and I agree, but this doesn't excuse you of testing all your data transformations. Also, being forced to write your data transformation processes in such a way that they're testable is going to improve the quality of your code a lot. For example, I find useful  to use [sklearn pipelines](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html) to write my transformations.

4 - **Not planning how the model is going to get deployed**. This was one of the most critical errors I've ever done. I worked a lot in a machine learning project, trying to follow good standards, checking all my hypotheses, generating complex features, reading and implementing state of the art techniques, and pushing the accuracy of the model day by day. After all the work I finished with a custom model with a pretty good performance. The problem came when we realized that the model couldn't be deployed because it was too slow on inference. I've seen different variations of this error happening a few times.

> "If you fail to plan, you are planning to fail" — Benjamin Franklin

5 - **Features in training are different from features in inference**. This is a classic mistake: you train a model using python - because this is the language you use in your data science team - in your lab and research environment, and when it is deployed it is fed with features computed using another language - because this is the language the other team is using -, and after some days you start detecting weird results. So then you start investigating how are they computing the features and why your model is getting crazy. The solution to this problem is avoid code duplication - an [old friend](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) of software best practices - and compute the features using the same code in training and inference. 

6 - **Start a project from zero**. This is a classic one as well: someone calls you to apply machine learning to some old project, and you decide to drop all the old project because it's a mess and it's full of hardcoded rules, and as a good data scientist you hate hardcoded rules and love letting the model do the heavy work. *Spoiler: you're going to be much more slower if you do that*. I'll let the great Joel Spolsky to explain you why this is one of the [worst decisions](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/) you can make. In summary, all the hardcoded rules you see in the old code were implemented for specific reasons, and people using your new code are going to expect your model to obey the same constraints.

> "You are throwing away your market leadership. You are giving a gift of two or three years to your competitors, and believe me, that is a long time in software years." Joel Spolsky
