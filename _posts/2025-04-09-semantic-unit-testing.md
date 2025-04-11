---
layout: post
title: "Semantic Unit Testing" 
description: 
tags:
toc: true
---

I quit my job at Wallapop a couple of weeks ago, and I'll start a new job at RevenueCat in some weeks, so I've had time to work on some side projects. One of these projects is [suite](https://github.com/alexmolas/suite), a python library for semantic unit testing. In this post, I'll explain what is semantic unit testing, how I have implemented it, and how you can use it.

# What's semantic unit testing?

Semantic unit testing is a testing approach that evaluates whether a function's implementation aligns with its documented behavior. The code is analyzed using LLMs to assess if the implementation matches the expected behavior described in the docstring. It's basically having an AI review your code and documentation together to spot discrepancies or bugs, without running the code.

This is, instead of writing classic unit tests with pairs of `(input, output)`, the testing responsibility is passed to an LLM. The hypothesis is that a powerful model, with good enough context, should be able to detect bugs without having to run the code. The idea is that an LLM can analyze the code and its documentation much like a human developer would -carefully reading and thinking hard about it- but much more quickly.


I wrote a package for doing semantic testing called [suite](https://github.com/alexmolas/suite) (Semantic UnIt TEsting). You can install it using `uv` as [^1]


```bash
uv pip install suite
```

Here's an example of how to perform a basic semantic test with `suite` 


```python
from suite import suite

tester = suite(model_name="openai/o3-mini")

def multiply(x: int, y: int) -> int:
    """Multiplies x by y

    Args:
        x (int): value
        y (int): value
    Returns:
        int: value
    """
    return x + y

result = tester(multiply)
print(result)

# {'reasoning': "The function's docstring states that it should multiply x by y. 
#   However, the implementation returns x + y, which is addition instead of multiplication. 
#   Therefore, the implementation does not correctly fulfill what is described in the docstring.",
# 'passed': False}
```

Basically, we have want to test the `multiply` function. To do so we create a `tester` instance that will use `o3-mini` as a judge. Then, we pass the method `multiply` to the `tester`, which internally will build a prompt containing all the information about it. Finally, the LLM will decide if the method is correctly implemented or contains a bug.

# How does it work?

I've had this project on my todo list for a long time and I never had enough time and motivation to start it, however, some weeks ago [Vincent](https://koaning.io/) released [smartfunc](https://github.com/koaning/smartfunc) (a library to turn docstrings into LLM-functions), and motivated me to start the project -and to be honest I borrowed some design choices from Vincent code. I also used [llm](https://llm.datasette.io/en/stable/index.html) library by [Simon Willison](https://simonwillison.net/) to access different LLM providers easily.

The `suite` library does the following.

1. Receives a callable `func` as input.
2. Reads `func` implementation and docstring (using `inspect` library).
3. Analyzes the implementation of `func` to identify and extract any functions or methods that it calls internally.
4. Recursively applies steps 1, 2 and 3 to `func` inner methods (up to some `max_depth`).
5. Builds a `FunctionInfo` object with all the information about `func` we need.
6. Uses `FunctionInfo` to write a prompt which is passed to an LLM.
7. The LLM returns a structured output like `{"reasoning": str, "passed" bool}`

Let's see now how all of these works with a concrete example. Imagine we have a method that we use to deal a deck of cards among some players. To do so we have a method called `deal_cards` which implementation is below.

<details>
<summary>Dealing cards code</summary>

{% highlight python %}
import random

def shuffle_cards(cards: list[str]) -> list[str]:
    """
    Returns a shuffled copy of the given list of cards.

    Parameters:
        cards (list[str]): A list of card identifiers (e.g., "Ace of Spades").

    Returns:
        list[str]: A new list containing the same cards in randomized order.
    """
    shuffled = cards.copy()
    random.shuffle(shuffled)
    return shuffled

def split_cards(cards: list[str], number_of_players: int) -> list[list[str]]:
    """
    Splits a list of cards evenly among a given number of players in a round-robin fashion.

    Parameters:
        cards (list[str]): The full list of cards to distribute.
        number_of_players (int): The number of players to split the cards between.

    Returns:
        list[list[str]]: A list where each sublist represents a player's hand of cards.
        Cards are distributed one at a time to each player in turn.
    """
    return [cards[i::number_of_players] for i in range(number_of_players)]

def deal_cards(cards: list[str], number_of_players: int) -> list[list[str]]:
    """
    Shuffles a deck of cards and deals them evenly among a given number of players.

    This function combines shuffling and splitting the deck to simulate a card deal.

    Parameters:
        cards (list[str]): The full list of cards to shuffle and distribute.
        number_of_players (int): The number of players to deal cards to.

    Returns:
        list[list[str]]: A list of player hands after shuffling and dealing.
    """
    shuffled = shuffle_cards(cards)
    return split_cards(shuffled, number_of_players)
{% endhighlight %}

</details>

We want to test the method `deal_cards`, so the first thing we need is to retrieve all the information about this method. This includes its docstring, source code, dependencies, etc. To do so we can use the `FunctionInfo` class, which is a pydantic model that looks like this

```python
class FunctionInfo(BaseModel):
    """Information about a function extracted for semantic testing."""
    name: str
    docstring: str | None
    source: str | None
    source_file: str | None
    dependencies: list["FunctionInfo"] = []
    
    @classmethod
    def from_func(
        cls,
        func: Callable,
        max_depth: int = 2):
        ...
```

This class has information about the callable name, docstring, source code, etc. It also contains information about the method dependencies, which are a list of `FunctionInfo`, one for each method that the callable uses internally. This piece of information is key to building a good context for the LLM since it allows us to get information about the code outside the method we want to test. It also has a classmethod that allows you to build this object directly from a callable. The `max_depth` parameter controls how deep you want to inspect the dependencies (ie: dependencies, dependencies of dependencies, etc.)

Then, we can run `FunctionInfo.from_func(deal_cards)` and we'll have an object with all the information we need about `deal_cards`. 

Now, we need a method that receives an instance of `FunctionInfo` and returns a prompt that can be sent to an LLM

```python
def format_prompt(
    func_info: FunctionInfo,
    prompt_template: str = DEFAULT_PROMPT_TEMPLATE,
    dependencies_template: str = DEFAULT_DEPENDENCY_TEMPLATE,
) -> str:
    ...
```

Finally, for the `deal_cards` method, the resulting prompt is


<details>
<summary>Final prompt</summary>

{% highlight markdown %}

You are evaluating whether a function implementation correctly matches its docstring.

Function name: deal_cards
Docstring: Shuffles a deck of cards and deals them evenly among a given number of players.

This function combines shuffling and splitting the deck to simulate a card deal.

Parameters:
 cards (list[str]): The full list of cards to shuffle and distribute.
 number_of_players (int): The number of players to deal cards to.

Returns:
 list[list[str]]: A list of player hands after shuffling and dealing.
Implementation: def deal_cards(cards: list[str], number_of_players: int) -> list[list[str]]:
 """
 Shuffles a deck of cards and deals them evenly among a given number of players.

 This function combines shuffling and splitting the deck to simulate a card deal.

 Parameters:
 cards (list[str]): The full list of cards to shuffle and distribute.
 number_of_players (int): The number of players to deal cards to.

 Returns:
 list[list[str]]: A list of player hands after shuffling and dealing.
 """
 shuffled = shuffle_cards(cards)
 return split_cards(shuffled, number_of_players)

Dependencies: 
Dependency 1: shuffle_cards
Docstring: Returns a shuffled copy of the given list of cards.

Parameters:
 cards (list[str]): A list of card identifiers (e.g., "Ace of Spades").

Returns:
 list[str]: A new list containing the same cards in randomized order.
Implementation: def shuffle_cards(cards: list[str]) -> list[str]:
 """
 Returns a shuffled copy of the given list of cards.

 Parameters:
 cards (list[str]): A list of card identifiers (e.g., "Ace of Spades").

 Returns:
 list[str]: A new list containing the same cards in randomized order.
 """
 shuffled = cards.copy()
 random.shuffle(shuffled)
 return shuffled



Dependency 1.1: method
Docstring: Shuffle list x in place, and return None.
Implementation:     def shuffle(self, x):
 """Shuffle list x in place, and return None."""

 randbelow = self._randbelow
 for i in reversed(range(1, len(x))):
 # pick an element in x[:i+1] with which to exchange x[i]
 j = randbelow(i + 1)
 x[i], x[j] = x[j], x[i]



Dependency 2: split_cards
Docstring: Splits a list of cards evenly among a given number of players in a round-robin fashion.

Parameters:
 cards (list[str]): The full list of cards to distribute.
 number_of_players (int): The number of players to split the cards between.

Returns:
 list[list[str]]: A list where each sublist represents a player's hand of cards.
 Cards are distributed one at a time to each player in turn.
Implementation: def split_cards(cards: list[str], number_of_players: int) -> list[list[str]]:
 """
 Splits a list of cards evenly among a given number of players in a round-robin fashion.

 Parameters:
 cards (list[str]): The full list of cards to distribute.
 number_of_players (int): The number of players to split the cards between.

 Returns:
 list[list[str]]: A list where each sublist represents a player's hand of cards.
 Cards are distributed one at a time to each player in turn.
 """
 return [cards[i::number_of_players] for i in range(number_of_players)]



Does the implementation correctly fulfill what is described in the docstring?
Read the implementation carefully. Reason step by step and take your time.

{% endhighlight %}

</details>

The prompt includes information about the dependencies we implemented (`shuffle_cards` and `split_cards`) and also about external methods (`random.shuffle`).

Then, this prompt is sent to an LLM which returns an object of type `SuiteOutput`


```python
class SuiteOutput(BaseModel):
    reasoning: str
    passed: bool

    def __bool__(self):
        return self.passed
```

In my experience, models that support thinking and structured outputs yield better results. `o3-mini` works very well and it's not crazy expensive.

# Reasons to not use `suite`

Now that you know how `suite` works let's get serious: you shouldn't substitute your tests with this tool.

I know it's weird to write this section in my post. I'm the author of the package and I should be publicizing it instead of explaining why is a bad idea to use it. But let's be honest, we all know that LLMs are not the solution to every problem we have -and we already have enough AI influencers out there-, so I'll try to be upfront and explain why I don't think you should replace your unit tests with this approach.

## Use boring technology

[Boring technology works](https://mcfunley.com/choose-boring-technology) so instead of using the new and shiny library you should be using the old and tested approaches that have been there for decades. I know it's cool to play with LLMs and CV-driven-development forces you to try new technologies to make you more employable. But we're here to make good software, and sometimes you don't need the new toy in the market to do so.

## It can be expensive

While developing `suite` I did some tests with the pandas library. In particular, I tested the `pd.json_normalize` method. With `max_depth=0` (ie: the smallest amount of information) I got a prompt of 112k tokens (the first Harry Potter book has [100k tokens](https://x.com/rasbt/status/1656724322164015105)). And here I was just testing one method. Imagine if I tested all the pandas codebase!

## Don't trust LLMs

I guess at this point I don't need to tell you this but here we go: you can't trust LLMs outputs. They are useful tools, but as with any tool you need to be careful of how you use it. LLMs tend to halluciante, and this make them dangerous tools. So I wouldn't trust an LLM to tell me if my implementation of a method is correct or not. 

Looking at the pace at which LLMs get better maybe this point will be obsolete in the following years -or even months. But for the time being I wouldn't trust an LLM to decide if some code is safe enough to be deployed.


# Reasons to use `suite`

At this point, you might be wondering, "Why the hell do we need this?" or perhaps shouting, "Stop putting LLMs everywhere!" at your screen. Fair enough. Let me walk you through why this tool is worth considering and why it could be a valuable addition to your testing toolbox.

## Comprehensive Coverage

Traditional unit testing focuses on specific inputs and outputs, often covering only a small part of your code. With `suite`, the game changes. Instead of just testing specific cases, it evaluates the semantic correctness of your functions by cross-referencing their implementation against the documentation. For example, imagine you've implemented a factorial function, something like this:

```python
def factorial(n: int) -> int:
    """Calculates the factorial of a non-negative integer n."""
    if n == 0:
        return 1
    return n * factorial(n - 1)
```

you write the tests, and everything passes

```python
assert factorial(0) == 1  # Factorial of 0
assert factorial(1) == 1  # Factorial of 1
assert factorial(5) == 120  # Factorial of 5
```

But here's the catch: you're missing some edge cases. What about negative inputs? What happens if someone passes a non-integer? Or very large numbers?

The problem is that traditional tests can only cover a narrow slice of your function’s behavior. Writing unit tests is **hard** and **boring**, and when combined, these two elements often lead to disaster. Just because a high percentage of tests pass doesn't mean your code is bug-free. With `suite`, you can sidestep the pain of writing every single test case manually. Instead, the LLM reviews your function's behavior holistically, saving time and ensuring a broader set of scenarios are taken into account.


## Catch bugs early

In a typical testing workflow, you write some basic tests to check the core functionality. When a bug inevitably shows up—usually after deployment—you go back and add more tests to cover it. This process is reactive, time-consuming, and frankly, a bit tedious.

With semantic unit testing, the LLM handles this in just one iteration. It checks the function's behavior against its documentation right from the start, catching discrepancies upfront without waiting for them to surface in production. This approach ensures that you catch issues early, saving time and preventing bugs from ever making it to production.

## Improve your testing suite

Even if you use semantic unit testing, you're likely still relying on traditional unit tests (after all, if it isn't broken, don’t fix it). However, by incorporating semantic unit testing into your workflow, you can enhance your existing test suite. Semantic unit testing can point you out uncovered corner cases that you might want to add to your unit tests.


## You can run it locally

Thanks to the [llm](https://llm.datasette.io/en/stable/) package you can use local models to run your semantic tests. Using [llm-ollama](https://github.com/taketwo/llm-ollama) plugin you can use any model in ollama to run your tests without having to share your precious code with the evil AI companies.

## Async is fast

`suite` allows you to run the tests asynchronously, and since the main bottleneck is IO (all the computations happen in a GPU in the cloud) it means that you can run your tests very fast. This is a huge advantage in comparison to standard tests, which need to be run sequentially.

# Conclusions

Building `suite` has been a fun ride. It’s one of those projects that sat on my todo list for months (okay, maybe years) until the right mix of free time, curiosity, and external inspiration finally pushed it forward. I'm happy to say it’s now a real package on PyPI - and yes, I checked off one more item from my [100 list](https://www.alexmolas.com/100-list): `26. ✗ Publish a Python package (in pip) → ✅ Done.`

Is semantic unit testing the future of testing? Probably not. At least not yet. LLMs are powerful, but they're unpredictable and far from perfect. That said, they open up a fascinating new space in developer tooling - one where we offload some of the tedium to machines and focus more on building than babysitting our code.

I’m not here to sell you the idea that you should throw away your trusty test suite and blindly trust an LLM. Please don’t do that. But I do think there’s value in exploring tools like `suite` to complement what you already have. Use it as a sidekick, not as a replacement.

If you give it a try, I’d love to hear your feedback. And if you find bugs - well, just don’t tell the LLM.

---

[^1]:Special thanks to @stevepeak for [transfering me](https://github.com/pypi/support/issues/6071) the `suite` project on PyPi.