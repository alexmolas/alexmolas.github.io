---
layout: post
title: "TIL: constant folding in python."
description: How does python optimize constant expressions.
tags: python til
---

I'm working on a blog post about which option is faster `x*x` or `x**2`, and while writing it I discovered some interesting things about how python is implemented at a low level. So for today's post I won't be able to answer which option is faster, but I'll explain you how python optimizes your code.

# First experiment: literals vs symbols

To start let's go back to the original question: *what is faster: `x*x` or `x**2`?* Before getting too rigorous I wanted to run some experiments to get some intuition about the problem, and surprisingly here's where I found the first weird results. My first experiment was to check if data types had a big impact in this experiment, so I created this first snippet

```python
import time
EXPERIMENTS = 1_000_000
ti = time.time()
for i in range(EXPERIMENTS):
    2**2
tf = time.time()
print(f"int**int took {tf-ti:.5f} seconds")
ti = time.time()
for i in range(EXPERIMENTS):
    2.**2.
tf = time.time()
print(f"float**float took {tf-ti:.5f} seconds")
```

And after running it I got

```console
> int**int took 0.03004 seconds
> float**float took 0.03070 seconds
```

So apparently data types do not have a huge impact. However, the code didn't look nice to me, so I decided to refactor it a little bit 

```python
import time
EXPERIMENTS = 1_000_000
def power_time(base, exponent):
    ti = time.time()
    for i in range(EXPERIMENTS):
        base**exponent
    tf = time.time()
    return tf-ti
print(f"int**int took {power_time(2, 2):.5f} seconds")
print(f"float**float took {power_time(2., 2.):.5f} seconds")
```

Same logic as before but less lines of code. However, after running it I got

```console
> int**int took 0.20140 seconds
> float**float took 0.05051 seconds
```

It makes sense that in the case of `float**float` it takes a little bit more, since python needs to pass the arguments to the method and this takes time. But what the hell is happening in the case of `int**int`?

After asking about it in [several](https://www.reddit.com/r/Python/comments/x99itp/running_something_in_a_method_takes_much_more/) [places](https://stackoverflow.com/questions/73654323), I discovered that the problem comes from using literals in the first case and using symbols in the second case. By refactoring the first case to

```diff
import time
EXPERIMENTS = 1_000_000
+ BASE = 2
+ EXPONENT = 2
ti = time.time()
for i in range(EXPERIMENTS):
-    2**2
+    BASE**EXPONENT
tf = time.time()
print(f"int**int took {tf-ti:.5f} seconds")

+ BASE = 2.
+ EXPONENT = 2.
ti = time.time()
for i in range(EXPERIMENTS):
-    2.**2.
+    BASE**EXPONENT
tf = time.time()
print(f"float**float took {tf-ti:.5f} seconds")
```

I got the same results in two cases. The problem didn't come from data types or methods, but rather from literals and symbols. In the case of using literals, it was much more faster because a technique named [constant folding](https://en.wikipedia.org/wiki/Constant_folding) was used by the interpreter.

# Constant Folding

This post does not intend to be a deep dive about constant folding, so if you're here to learn the internals of constant folding I recommend you this [post](https://arpitbhayani.me/blogs/constant-folding-python). Here I will just share the intuitions I developed while reading about constant folding.

Basically, constant folding consists in the interpreter replacing constant expressions with their value. For example, the expression `A = 10*10` is replaced by the parser by `A = 100`.

You can check that by using the `dis` module. This module allows you to check the python bytecode of your code. Basically, it allows you to check the "compiled" version of your code. If we run this example

```python
import dis
dis.dis("A=123*10")
```

we'll get

```console
  1           0 LOAD_CONST               0 (1230)
              2 STORE_NAME               0 (A)
              4 LOAD_CONST               1 (None)
              6 RETURN_VALUE
```

where the first line indicated that a constant value `1230` has been loaded without having to evaluate `123*10`. This means that the interpreter has replaced `123*10` by `1230` before compiling the code. If instead be run the code

```python
import dis
dis.dis("A=123;B=10;A*B")
```

we'll get

```console
  1           0 LOAD_CONST               0 (10)
              2 STORE_NAME               0 (A)
              4 LOAD_CONST               0 (10)
              6 STORE_NAME               1 (B)
              8 LOAD_NAME                0 (A)
             10 LOAD_NAME                1 (B)
             12 BINARY_MULTIPLY
             14 POP_TOP
             16 LOAD_CONST               1 (None)
             18 RETURN_VALUE
```

where we can see that the operation is not pre-computed, and it'll be executed by the instruction `12 BINARY_MULTIPLY`.

Another interesting point is that the constants are not always folded. For example

```
import dis
dis.dis("2**64")
dis.dis("2**65")
```

returns

```console
  1           0 LOAD_CONST               0 (4294967296)
              2 RETURN_VALUE
  1           0 LOAD_CONST               0 (2)
              2 LOAD_CONST               1 (65)
              4 BINARY_POWER
              6 RETURN_VALUE
```

As we can see, in the first case the constant is folded, but in the second one it's not. One may ask now which are the rules that python uses to decide which constants are folded and which not, and the answer is surprising: there are not rules, it's an implementation detail! This means that constant folding implementation can change between python versions and you shouldn't rely on it. 
