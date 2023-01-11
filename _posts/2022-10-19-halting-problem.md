---
layout: post
title: "Computability Theory (i): the Halting Problem."
description:
tags: math computability-theory
---

During these last few days I’ve been reading a little bit about computability theory, and I feel like a kid with a new toy, so I’m going to write some posts about this topic. I don’t pretend to explain anything new, and probably what I’m going to write has been written before, but I’ll write these posts for two reasons: (1) as future notes for myself, and (2) to help me clarify and organize the ideas.

This post has been inspired by this [course](https://tigyog.app/d/C:tWWwvJDWlo/r/busy-beavers) and this [post](https://www.scottaaronson.com/writings/bignumbers.html). So if your time is limited, I recommend you spend it going through the above links instead of my blog post.

## The halting problem

To start let me define the Halting problem. 

> Given an arbitrary program, determine if it will finish running or continue to run forever.
{: .prompt-info}

If the program eventually finishes running we say that the program halts.

For the original paper by Alan Turing please go [here](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf).

## Is there a solution to the halting problem?

We're going to show that a program that determines if another program will halt can't exist using a proof by contradiction. I'm going to use `python` syntax to help me with the proof, but this can be generalized to any computer language.

Let's start with the assumption that you can write a program `halts`

```python
def halts(program: str, args) -> bool:
	...
```

such that given an input `program` and some `args` returns `True` if `program(args)` halts and `False` if the program continues to run forever.

For example, if

```python
program = """
def foo(arg):
    print(arg)
"""
arg = "Hello, world"
```

Then `halts(program, arg)` would return `True`, since the program halts after printing `Hello, world`. However, if we define

```python
program = """
def bar(arg):
    while True:
        pass
"""
arg = None
```

Then `halts(program, arg)` would return `False`, since the program will be stuck forever in the while loop.


Now, let's make things a little bit more complicated and define the function `g` as 

```python
def g(program: str):
	if halts(program: str, program: str):
		while True: # loop forever
			pass
```

this is, if `program(program)` halts then `g` will loop forever, and if `program(program)` doesn't halt, then `g` will halt. So basically, `g` has the opposite behaviour of `program(program)`.

Let's go a little bit meta now. What happens if we get the string representation of the program `g` and pass it to `g`? This is, we want to know the behaviour of the following piece of code

```python
g_str = """
def g(program: str):
	if halts(program: str, program: str):
		while True: # loop forever
			pass
"""
g(g_str)
```

To know what happens we first need to know the output of `halts(g_str, g_str)`. We know that `halts` only returns `True` or `False`. Let's assume first that it returns `True`. Then, `g(g_str)` will loop forever. But then `halts` would be wrong! 

Since `halts(g_str, g_str)` can't return `True`, let's assume then that it returns `False`. Then it means that `g(g_str)` will not halt, but according to the definition of `g` it will halt. So `halts` is again wrong.

WOW!! What does that mean? This means that the method `g` can't be constructed, and since `g` has been constructed only under the assumption that `halts` exists, it means that `halts` can't exist! The method `halts` has at least one bug. This means that the original problem is unsolvable since for any implementation of `halts` you build we can build a program `g` that breaks your implementation. Therefore

>The halting problem is unsolvable!
{: .prompt-info}

## Conclusion

Probably, this proof is not rigorous enough from a mathematical point of view, but it has helped me a lot to understand the basics of the halting problem and its solution. Over the years I heard about the halting problem a lot of times in a lot of different contexts, but I never had an intuition about it and why it's important. For me, it was just a weird problem that only mathematicians care about. However, after going over the problem and getting some intuition I think I start to understand its implications. In the following posts, I'll show some "practical" applications of this proof, aka uncomputable numbers.
