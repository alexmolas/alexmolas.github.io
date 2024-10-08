---
layout: post
title: "In defense of Leetcode Interviews" 
description: 
tags:
toc: false
---

For the last weeks at Wallapop, we have been interviewing candidates for a Data Scientist position. Our current interview process is quite standard, but there are some things we would like to change about the process. We were talking about it during lunch, and I saw my opportunity to propose one of my hot takes: "We should start doing Leetcode interviews" [^1]. And, as expected, no one agreed with me. Their main arguments against my proposal were

- You're testing **useless skills**.
- If you need these skills you can **learn them on the fly**.
- The **problems are too artificial** and do not look like real problems.
- You're **evaluating the wrong skills**. I know people with more than 15 years of experience that wouldn't pass a test like this.


To be honest, I wasn't able to answer all their arguments, and for some moments I felt they might be right. Let me clarify that I have had this opinion from a long time ago, but it wasn't based on strong arguments but rather on feelings and intuitions. However, I usually trust my intuition quite a lot, and before giving it up I decided to find some strong arguments in favor of Leetcode (LC) interviews, and here they are.

- I agree that you won't regularly use LC skills in your work work. But, the day you need them it'll really make a difference. People that never done LC problems probably don't even know how to implement some data structures. So when they face a difficult problem they will probably just use a brute force approach. And if you hire these people you'll end up with a $\mathcal{O}(N)$ solution where a $\mathcal{O}(\log N)$ exists. These interviews can **identify candidates with strong problem-solving skills** and logical reasoning abilities, which are useful in any tech role across all roles in the tech industry.
- I agree that you won't regularly use LC skills in your work work. But, the day you need them it'll really make a difference. People that never done LC problems probably don't even know how to implement some data structures. So when they face a difficult problem they will probably just use a brute force approach. And if you hire these people you'll end up with a $\mathcal{O}(N)$ solution where a $\mathcal{O}(\log N)$ exists. These interviews can **identify candidates with strong problem-solving skills** and logical reasoning abilities, which are useful in any tech role.
- One of the arguments against LC questions is "*you can learn these skills when needed*". This argument suggests that new skills can be acquired on the job as necessary. Ok, agree. Now you just need to **show me you can learn new skills**. Usually, you know beforehand you'll have to solve LC problems during an interview. If you haven't managed to learn how to solve them in a couple of weeks, then why should I believe that you can learn new skills while working? The interview process itself is an opportunity to show your ability to learn and apply new skills on time.
- Also, the argument "*you can learn these skills when needed*" can be applied to any other skill. Why don't people say the same about Python or Machine Learning? Maybe LC skills are not so easy to learn.
- I also like these questions because you can **ask them to any kind of software developer**, from frontend to DevOps. Since **you're not asking about specific frameworks** or languages you can use these questions in all your tech interviews. This also means that you don't need a data scientist to interview another data scientist candidate since any other person in the tech department can make the interview. And this will make your hiring process much faster.
- In my experience -which is obviously biased- **great engineers are usually good at these kinds of problems**. I've even seen good managers be good at them (I remember one guy who managed to solve a medium LC problem that later moved from data scientist to data manager. He was a better manager than a developer, but still he managed to pass the technical interview).
- **People don't like LC interviews because they are bad at them**, so they look for excuses to rant against these styles of interviews. I admit that I used to think like that. But, if you spend a couple of weeks seriously practicing these skills you'll notice that you can solve easy and medium LC problems quite fast ([example](https://www.reddit.com/r/cscareerquestions/comments/iyv0qd/in_defense_of_leetcode/)).
- Finally, **I don't believe this is the only way to evaluate a candidate**. But it works great as a first filter. Later on the process you can talk with the candidate about their past work and stuff like that.

I'm aware that for the last few years no one has liked LC interviews, and I understand that **this type of interview is not always optimal**. Of course, you don't want to make a PM to pass this interview. Also, LC problems might not fit your company or team culture or the role you're looking for. Also, some people get nervous in these interviews.

However I do not agree that **LC interviews are always useless**, and for the 90% of tech interviews, I believe they make a lot of sense. I'm also aware that this way of thinking is very biased by my experience. So please, feel free to send me your arguments against them and change my mind about it :)


---

[^1]: For those who don't know, Leetcode interviews are technical interviews where the candidate has to solve [Leetcode problems](https://leetcode.com/problemset/) under time constraints. For example, the candidate needs to solve an easy and medium Leetcode problem in less than 30 minutes.
