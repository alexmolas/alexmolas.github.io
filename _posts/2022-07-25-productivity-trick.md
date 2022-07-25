---
layout: post
title: "Your laptop is an implementation detail"
description: Treating your laptop as an implementation detail can help your productivity.
tags: opinion miscellaneous
---

One of the first software design patterns I learned was to 

>code against interfaces, not implementations. 

This tells us to forget about implementation details when designing a program and focus only on functionalities. What's great about this concept is that if two objects follow the same interface then you can interchange them and the program will still work - aka [Liskov's substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle). 

I've only heard about this principle in computer science contexts, however, I think that it can be used in our day-to-day life, and in particular it can be used to improve your productivity. When talking about computers you don't care about their color, screen size, keyboard layout, etc., you only care about their computing power. You only need the computer to use "its brain" to perform operations. You could change the keyboard of your laptop and the results you would get after running a program would be the same. Therefore, one can think about all the peripherals of the computer as implementation details. Why is this important? Because it means that you can abstract away the components of the computer, this is, we can update the idea of "a computer **is** a CPU + screen + keyboard + mouse + etc." to the idea of "a computer **has** a CPU + screen + keyboard + mouse + etc.".

![blobs](/docs/productivity-trick/oop-computer.png){: width="400" height="400"}
_On the left, the idea of a computer made on implementations, on the right, the same computer but based on interfaces._

At this point you may say, so what? Let me explain how this simple idea has improved my productivity a lot. Currently, I'm on a 9-to-6 job, which means that I spend 8 hours a day using my work computer - a Macbook Pro with a USA keyboard - to write software. But in my free time, I'm working on some side projects, such as this blog, using my personal computer - an ASUS with a Spanish keyboard. If you have ever changed your laptop you'll know how difficult is to get used to the new layout. All the muscle memory you have developed during years specifically targeted to your laptop is now useless, and you spend the following weeks missing keys and working slowly. Imagine now that you alternate between laptops with different layouts every day. It's a nightmare. However, by applying the principle that we explored before, we can solve the problem. How? By using the same keyboard, mouse, and screen for all your computers and laptops, because in the end, they're only implementation details. So this is what I did. Some weeks ago I purchased a mechanical keyboard and a Bluetooth mouse. And while it's true that it took me a while but I get used to them, and now my productivity has improved a lot. During my working hours, I use my work laptop with the external keyboard, mouse and screen. And the same happens when I'm working on my side projects using my personal laptop. It seems a stupid idea, and maybe you're already doing it, but for me it has been a total change in productivity and comfort. Now I don't care which computer I'm using, I only need to connect my cool keyboard and mouse and start working!
