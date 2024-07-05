---
layout: post
title: "Something happens to everyone." 
description: 
tags:
toc: false
---

<!-- When my daughter was born something was off. She was premature, and during the last weeks of pregnancy she wasn't growing at all, so the doctors had to induce labour. Then, as weeks and months passed, we realized she wasn't developing as expected, and at some point a doctor also pointed out that her head was too small. We decided to do some genetic tests, and we discovered that she had a very rare genetic disorder - a *microdeletion of the 13q33.34 region*. From the [available literature](https://pubmed.ncbi.nlm.nih.gov/31321490/) it seems that only 60 patients with this disorder have been studied, so it's indeed a rare condition. I'm not going to bore you with all the details and all the process my wife and I have had to go through, but let me say that now we have accepted it and we are getting used to the situation. But when we got the news, we asked ourselves "why did this happen to her?". Answering this question is difficult, and in our case the answer has its roots in our faith, but this post is not about my daughter specific condition or our trust in God, but to argue with some numbers that things like this happen to everyone. 

I studied physics, and I work as a data scientist, so after overcoming the grief I began to face the situation in an analytical way. One of the conclusions I reached is that we are not special. Nothing has happened to us that doesn't happen to anyone else. By doing numbers you can show that bad things happen to others too. This exercise helped me accept our situation and also develop empathy for others. -->


# The question

"Why did this happen to me?" is the question we all have when something bad happens in our life. Since we're the protagonists of our life it makes sense to wonder why something awful had to happen to us. Of course we know that bad things happen all the time, but when something bad happens to us we feel like it's worth than what happens to others (I guess this is human nature). 

# The answer

## Some thoughts

There are multiple ways to answer this question: philosophy, religion, psychology, personal experience, or math. In this post I want to approach this from a mathematical perspective. By looking at the numbers, I hope to get a different perspective and maybe gain some empathy.

Before going deep into the math let me outline my reasoning. First, there are a lot of things that can go wrong in life: illness, death, mental health problems, wars, natural disasters, etc. Since the list is long it makes sense that at least one of these things can happen to us. Then, on the other hand, the source of suffering is not always bad things happening to you, but it can be things happening to the ones you love. With these two factors combined it's clear that at some point in your life you or someone you love will undergo through a tragic situation.

## The math

Now we have a sketch of our solution, we only need to make some assumptions and put some numbers to get the concrete answer to the question. Let's start with the assumptions

- **Number of loved ones**. Let's assume that your circle of loved ones is composed by your family and your closest friends. Being Let's assume a "standard" family: 2 parents + 1 sibling + 1 partner + 1 child + 2 parents-in-law= 7 family members. And according to [some research](https://www.npr.org/2023/10/25/1208572681/friends-friendship-meet-up-research-pew-health-benefits) the average number of friends is around 4. This means that the number of loved ones in your life is around 11. 
- **Problems**: here there's a non-exhaustive list of "bad things" that can happen to you. I just gathered a couple of misfortunes as an example. Of course the list is longer than this one, but it'll work as an example.
  - *Cancer*: the risk of having cancer is around 42%, and the risk of dying by cancer is around 18%. [Source](https://www.cancer.org/cancer/risk-prevention/understanding-cancer-risk/lifetime-probability-of-developing-or-dying-from-cancer.html).
  - *Depression*: depression risk is between 20% and 30%. Let's assume it's 25%. [Source](https://ourworldindata.org/depression-lifetime-risk#:~:text=It's%20estimated%20that%20one%2Din,by%20the%20age%20of%2065.&text=Depression%20is%20one%20of%20the%20most%20common%20health%20conditions%20globally,depression%20in%20the%20past%20year.).
  - *Genetic issue*: Approximately 1 in 21 people are affected by a genetic disorder classified as "rare". [Source](https://en.wikipedia.org/wiki/Genetic_disorder). [^1].
  - *Young death*: the probability of dying before 30 is around 2% in US. [Source](https://ourworldindata.org/grapher/probability-of-dying-by-age?tab=table). 


**Disclaimer**: the numbers reported here are global probabilities, which means that they vary from country to country. For instance, disgracefully, the probability of dying young in Japan is lower than in Somalia.

With these assumptions the probability of at least one of these things happening to you is

$$
p_{\textrm{at least one bad thing}} = 1 - \prod_{b} (1 - p_{b})
$$

where $p_b$ is the probability of $b$ happening to you. Putting everything together

$$
p_{\textrm{at least one bad thing}} = 1 - (1 - 0.42) (1 - 0.25) (1 - 0.05) (1 - 0.02) = 0.60
$$

This means that the probability of at least one of these things happening to you is 60%, which is a lot.

But remember, bad things can also happen to the people we care about. We calculated earlier that the chance of something bad happening to any one person is 60%. Now, let's consider your circle of 11 loved ones. What are the odds that at least one of them will experience something bad? We can calculate this as follows:

$$
p_{\textrm{bad thing loved one}} = 1 - (1 - 0.60)^{11} \approx 0.9999
$$

Wow, that's a lot... around 99.99% probability of something bad happening to the people you love the most.

Even if we just focus on the probability of dying from cancer we get

$$
p_{\textrm{loved one dies from cancer}} = 1 - (1-0.18)^{11} = 0.89
$$

so the chances that a loved oned dies from cancer are very high.

And if we just consider the probability of getting a rare genetic disorder we get a 41% probability. And the probability of a loved one dying before 30 is 20%.

# Empathy

This math exercise may seem cold and detached, but it has helped me to gain perspective and empathy. Realizing that nearly everyone will face significant challenges in life makes it easier to understand and connect with others' struggles. It reminds us that suffering is a universal human experience, not a personal failing or unique misfortune. This understanding can foster compassion, both for ourselves and for those around us who may be silently battling their own difficulties. Sometimes we feel that other people lives are better than ours, and that we are facing unique challenges. But math show that's not true. Everybody is fighting their fight. Something happens to everyone.

---

[^1]: This might seem surprising, as 1 in 21 doesn't sound rare. However, there are over 6000 known genetic disorders. So while having any genetic disorder is relatively common, having a specific one is still rare. It's like rolling a 10000-sided die - getting a number between 0 and 6000 is likely, but getting 2546 is rare.
