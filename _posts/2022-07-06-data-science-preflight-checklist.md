---
layout: post
title: "Data science preflight checklist."
description: List of checks to pass before starting a new data science project.
tags: data-science machine-learning software-engineering
---

In aviation, a preflight checklist is a list of tasks that should be performed by pilots and aircrew before takeoff. Its purpose is to improve flight safety by ensuring that no important tasks are forgotten. The same procedure can be applied before starting a data science project. In this post, I’ll go through all the checks that I ran before starting a new project. Also, I assume that you already know how to train and evaluate a model - there are already a lot of resources explaining the typical `data->EDA->clean->train->evaluate->repeat` loop - so I’m going to focus on all the other parts that you need to succeed. Of course, you don’t need to implement each check yourself and you can delegate the responsibility to other team members, but to succeed you should be able to answer the question “who is going to take care of this part?”. You don’t need to do everything, but just surround yourself with people that know how to do it.

> This post covers a list of safety checks to do before starting a new data science project. **Here I’m not saying that you need to implement each check by yourself, but only that you should know who is going to take the responsibility for each step**.
{: .prompt-info}

# Why is important to run a preflight checklist?

- *Anticipating problems before they happen helps solving them*: it’s not the same to face a problem you know it’s there than to face a problem you didn’t know in the middle of the project. If you knew about the problem beforehand you can plan accordingly and solve it, if the problem was unknown you’re going to have a tough time dealing with the pressure of the project and the lack of resources to solve the problem.
- *You can discover technical limitations that affect your model*. For example, if by technical requirements the model needs to predict in under 1ms you'll need to choose carefully which model you do develop.
- *Forget about the "Data Scientist develops and Data Engineers deploys" mentality*: I've heard that a lot of times, and in my experience, it doesn't work. For a project to be successful, you'll need to work closely with the team responsible for deploying the model.

And without further delay, let me present my personal checklist.

# Prediction frequency

One of the first things you want to know is if your model is going to be used in real-time or in batch. The requirements and technologies you'll need in each case can be completely different, so it's an important question to answer before starting to code. 

## Real time

- **Inference time**: the user can't wait for 10 seconds for your model to return a prediction, so you'll need to check which is the maximum latency allowed for your model. This technical requirement is going to constrain the family of models you can use.
- **Features**: it can be tricky to get the features your model needs in real-time. When adding new features to the model think about how are you going to access them at inference time.

## Batch

- **Frequency**:  do the predictions need to be generated every day? Or every year? In the first case, you'll need to work on a pipeline that produces the predictions every day - probably overnight. In the second case, you can survive without a pipeline and just execute the predictions when you need them. However, is not always that easy. For example, what if you need to provide predictions every week? Or every month? In these cases, you'll need to decide if it's worth it or not to build an automatic pipeline depending on the use case.


# Model execution

- **Where**: where's the model going to be deployed? Here I list some possibilities, though this list is not extensive and the items in the list are not mutually exclusive. The important point is to know how your model is going to be executed to get predictions after training.
    - *Microservice*: the model can be wrapped in a docker and deployed as a microservice.
    - *Embedded in a service*: the model can be embedded in another service that uses it internally. For example, an email provider can load internally a spam detector model.
    - *Airflow pipeline*: if the model is going to be run in batch you can have the model stored somewhere, and when the Airflow pipeline is executed the model is loaded and the predictions are generated.
    - *Script*: (or Jupyter Notebook in Python). While this may seem a bad choice from an infrastructure point of view maybe it's enough depending on the use case. For example, if you're predicting the next year's sales for your company, and the model is only executed once a year, then having a script or a notebook to generate the predictions could be an acceptable option.


# Data

- **Where**: to get predictions from the model it's vital to have access to the features. While this seems obvious you would be surprised how many times I've seen models that are not useful because the data wasn't accessible. Let me illustrate that with an example: imagine you have a model that predicts the sales of surgical masks, and one of the features of the model is `number of COVID infections during last 7 days`. You had access to this feature while training the model, but at inference time you encounter a problem: the number of COVID infections in a day is published 14 days after that day due to possible corrections in the data. In this situation, your model is no longer useful, since you'll have to wait 14 days to have the data to generate the predictions. 

- **How**: a possible issue is that you generate features for training using one code - Python, R, etc. -, but once the model is deployed, the features are generated using another language - Scala, Java, Rust, etc. This can be an issue, as having different codes for computing the same thing can introduce a lot of bugs [^1].

- **How 2.0**: before adding a new feature to the model you have to make sure that this feature can be accessed at prediction time. Maybe the data you're using is stored in a table in the data warehouse that is not accessible from the server where the model is running. While theoretically, this has an easy solution - just give access to the warehouse to the server - it can be surprisingly difficult to do so, due to security issues, infrastructure problems, or the team responsible for giving access having too much work and leaving you waiting until they have time.

# Integration

- **Who**: who is going to use the model and how? It can be an *internal* or *external* service. If the model is for internal use one can expect more agility when doing changes. However, if it's for external use - for example, a client company using your model to classify cats and dogs - it's critical to have a defined contract on how the input data is going to be, and how the predictions are going to be exposed. In my experience, a lot of headaches came from misalignment on what to expect from the model, so try to clarify that from the beginning.

# After rollout

## Model retraining
- **Do you need it?**: while it seems cool to have a pipeline to retrain your model on a periodic basis sometimes it's not needed. If you're classifying types of nails, and the number of classes is not expected to change, then probably you don't need a retraining pipeline. However, if you're working on a time-series forecast problem and you need to provide predictions every day, you will definitely need a retrain pipeline.

- **CI/CD**: if you finally decide to retrain periodically your model you'll need to think also about continuous integration and continuous deployment. In particular, how are you going to replace the current model with the new model withoout causing an outage in the service? What if the new model starts giving trash predictions? Or worse, what if the new model starts failing and not giving predictions? 


## Model monitoring
Once the model is deployed, you'll want to know how good your predictions are, so you'll need to monitor multiple metrics for your model.
- **How**: to know that your model is predicting you'll need to store each prediction the model does. So every time your model is executed you'll have to store the input and the output data for further analysis. 
- **Where**: once the input and output data are stored you'll need a place to visualize your metrics. Also, you would like to be able to share the model performance with other people. The usual solution is to set a dashboard using Tableau, PowerBI, or any other dashboarding tool. 


## Feature monitoring
- **Feature shift**: one of the biggest problems models have is data shifting. If at prediction time the distribution of features is different than at training, then the performance of the model is going to be affected. To avoid this problem it's important to monitor the values of the features after the model rollout. Also, in some situations you'll have to deal with an adversarial world, that's going to try to fool your model, like in the case of fraud detection. So in these cases, it's important to monitor the features and set alarms if the distribution of the features varies too much.


# Conclusions

Thanks for sticking with me so far. I covered the basic checks I follow before starting a new project, but I'm sure this list is biased, so let me know your checks in the comments.

To finish, let me say that I don't think a Data Scientist should be able to do all the things in this list. I think of this list more as a team effort to 

---

[^1]: I've experienced this problem and it can be a pain in the ass. The solution we made at the end was to have a common library to compute the features, and it was used to generate the features for training and it was used at inference time as well.