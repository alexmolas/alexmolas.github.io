---
layout: post
title: "Data Science and Software Engineering (I)"
description:
tags: data-science software-engineering
---


I still remember when I started working as an intern data scientist and I had to open my first pull request. I was very happy with my work, so I just committed all my changes together, opened a pull request, assigned it to my supervisor, and started waiting for the compliments to arrive - *spoiler: the compliments never arrived*.

Just to put things in context let me explain that I’m a physicist and I learned to code by myself. Also, up to that moment, I always worked alone, so I never had to share my code with no one besides me.

Going back to my first PR, I remember my supervisor coming directly to my desktop and having the following conversation

> – WTF is this? - said my supervisor while pointing at a method with more than 200 lines of code.
>
>– I’m training a machine learning model. - I, with a smirk on my face, answered proudly.
>
>– Yeah, but it looks that you’re also reading some datasets here and there. - asked him without smiling at all.
>
>– Yeah, of course, I’m reading the data, splitting it in train and test, preprocessing it, and then training a model - at this point, the smirk of pride in my face already had disappeared.
>
>– These are not good practices.
>
>– These are not what?
>
>– OMG, it shows that you are a physicist…



After that, he patiently spent the following months explaining to me some basic software engineering best practices, how to use git properly, and how to work in collaborative software projects. In the beginning, I didn’t understand why all those things were important, after all, I was a data scientist doing some cool machine learning models and not a software developer, so all these things didn’t apply to me. But, after some years of experience as a data scientist, now I have a different opinion, and now I’m convinced that these things matter a lot, even if you are a data scientist.

# Why best practices matter

It's widely known why best practices matter in pure software engineering projects, however, it's not that clear why these practices matter when doing data science. Here I will try to explain why best software practices are crucial when developing a data science project.

## For speed

When starting a new data science project, we are all excited to quickly reach final results. However, this mentality makes you slower in the long term. One of my co-workers told me some years ago: "data scientists with physics background do great work during the first steps of a project. They have great ideas and usually obtain good results in a few days. However, after this first burst of creativity and results, they get stuck, because the code they have written is now unmanageable, and any tiny change requires a lot of work.". If you want to avoid that, following best practices and writing good code is going to help you to experiment better and faster. 

Let me put an example to illustrate my point: imagine that you have a model that predicts the number of sales of your company. However, someone asks you to split the number of predicted sales into national and international sales. If your code was not well designed, you are going to spend a lot of hours changing a huge amount of code to make it work under these new requirements. However, if before developing your project you had spent some time designing the architecture of the project, now you would be able to try all the different variations of your experiment very fast and without fears of bugs.


<div style="float: right;">
    <img src="/docs/software-and-data/good-vs-bad.svg" width=300px class="center">
</div>
<br/>

On the other hand, I've met a lot of data scientists that believe that data engineers are going to do all this work for them, and from my experience, this never works like that. Data engineers are not data scientists' minions, and they have their priorities and motivations, and usually, these motivations are not to clean your dirty code and make it scalable.

Also, you are going to share your projects with your colleagues, who will need to read and understand your code. Data science and machine learning are difficult on their own, so let's try to not make them more difficult by writing bad software and making things obscure.

## For science

As its name indicates, data scientists follow the scientific method, and by definition, the scientific method tests the hypotheses with experiments. Therefore, as a data scientist, you should pay special attention to how you test your hypotheses. This implies several things, such as using the correct mathematical framework, using the correct data, and having a well-designed setup. Here I want to focus on the latter.

Imagine a biologist experimenting in a cluttered lab, without properly labeling the different samples they are using, or without following the tool's instructions. Imagine an astrophysicist trying to discover new exoplanets without following a strategy, just by pointing the telescope into random locations. Imagine the physicists at CERN fixing the LHC using duct tape. It's clear that in all these cases, the outcome of the experiments is going to be probably useless. And while serendipity is a huge driver of science, it's always followed by a meticulous scientific process. However, I've seen a lot of data experts making claims based on experiments with really badly designed scientific setups.

Curiously, all data scientists are aware that selecting the correct statistical tests or selecting the correct model is of capital importance for their produced work, but when it comes to their project architecture they don't care at all. It is as if doctors were going to perform the most advanced and difficult operation in history, and after years of preparation and study they carry out the operation in a room with an old bed and with unsharpened scalpels.

There's, again, this spread idea that data scientists should focus only on writing notebooks and scripts to prove hypotheses as fast as possible, and if the results they found are interesting then someone else is going to refactor and clean all their code. My point here is that's almost impossible to prove hypotheses without the proper experimental setup, so if you want to be a good data scientist you should take care of your experimental setups. 

Let me finish with one of my favorites quotes about machine learning and software development

>Write code like the software developer you can be, and not like the machine learning expert you're not.

In my next post I'll write about some bad practices that I have seen, or that I have done myself, during my years as a data scientist.
