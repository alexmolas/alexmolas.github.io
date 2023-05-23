---
layout: post
title: "A randomized voting strategy"
description: "Are you sick of having to choose which political party to vote for when none of them represents your beliefs 100%? In this post, I am going to explain a practice that will end your headaches when voting."
tags: stats miscellaneous opinion
---

I think it's safe to say that nobody agrees completely with any political party. Our reality today is enough complex to make it impossible to have a party that represents your beliefs in absolutely all cases. We might agree on economic points but differ on sociological issues, or we may not even agree with all the economic positions taken by our chosen party.

However, when voting you're asked a binary question "Do you want to trust this party?". This makes the voting process a burden since you need to disregard a lot of your views and put all your voting power in just one party. I know a lot of people that have decided to stop voting because of that. They don't trust any party, and therefore they do not want to be complicit in making them come to power. 

Also, this voting process gives results that are not representative of what people really think. Consider a scenario where a country has four parties and all its citizens share the same beliefs. Let's say people agree with political party $A$ in $28\%$ of their positions, and with the rest of the parties an $18\%$. Since they must to answer a binary question they would all vote for party A. Thus, the distribution of political representatives would be $A: 100\%$,  $B: 0\%$,  $C: 0\%$,  $D: 0\%$. This creates the illusion that party $A$ represents faithfully the beliefs of all the people in a country, but this is not true, and this is a problem. So, how can this be solved?

Here, I propose a voting process that can help with that problem. 

1. Give a score to all the parties that are presented to the elections.
2. Normalise that score, ie: the sum of the score should sum up to $1$. This score can be interpreted as a probability.
3. Using the normalised score as a probability choose a party at random.
4. Go and vote for the selected party.

If everyone followed this approach the results in the elections would be more faithful to what people really think. In the above example, the results would be $A: 28\%$,  $B: 18\%$,  $C: 18\%$, and $D: 18\%$, which represent exactly the beliefs of the people in that country. 

I know that the process I described above can be a little bit cumbersome ([who the hell knows how to randomly sample with weights from a set of elements???](https://stackoverflow.com/questions/13047806/weighted-random-sample-in-python)). The process can be simplified as

1. Go to the voting station.
2. For each political party, take ballots based on how much you like that party (the more you agree with the party the more ballots you take).
3. Shuffle the ballots and select one of them. Here you can decide if you want to see which party you have selected. 
4. Vote for the selected party.

With this methodology, you accomplish at least two significant outcomes. First, the election results align faithfully with people's beliefs, ensuring a more accurate representation. Second, it relieves the burden of having to select just one party for voters who opt not to view their selected ballot, allowing them to remain unaware of their choice.

PS. I haven't designed this method on my own. To be honest I know at least two persons that more or less use this method of voting. One of them chooses at random between a far-right and a far-left party, which is an extreme version of this process.