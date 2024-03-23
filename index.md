---
layout: default
title: Alex Molas
description: Hello, world, I'm Alex, and this is my blog, where I talk about math, machine learning, and other things like cooking. 
---

{% assign totalPosts = site.posts | size %}
{% assign totalWords = 0 %}

{% for post in site.posts %}
  {% assign postWords = post.content | number_of_words %}
  {% assign totalWords = totalWords | plus: postWords %}
{% endfor %}

<h1>Hello, I'm Alex</h1>

Hi, welcome to my website! I use this tiny part of the internet to share my thoughts about machine learning, maths, cooking, philosophy, and other random things. I write for several reasons that I've explained [here](http://alexmolas.com/2023/07/15/nobody-cares-about-your-blog.html). Since 2020 I've wrote {{ totalPosts }} posts and {{ totalWords }} words. 

I try to keep the site style quite minimal because I want to focus on the content and not on the container. Some people have told me it's too minimal, but I don't care. If you like it you can find the source code [in my repo](https://github.com/alexmolas/alexmolas.github.io/). Feel free to use it as you prefer.


If you want to hire me here you have my [CV](http://alexmolas.com/cv).


---

<h2>Latest posts</h2>

{% assign postCount = 0 %}
{% for post in site.posts %}
{% if postCount < 5 %}
  <li>
    <span class="post-date">{{ post.date | date: "%b %d %Y" }}</span> · <a href="{{ post.url }}">{{ post.title }}</a>
  </li>
  {% assign postCount = postCount | plus: 1 %}
{% endif %}
{% endfor %}

---

<h2>Favourite posts</h2>

{% for post in site.posts %}
{% if post.favourite %}
  <li>
    <span class="post-date">{{ post.date | date: "%b %d %Y" }}</span> · <a href="{{ post.url }}">{{ post.title }}</a>
  </li>
{% endif %}
{% endfor %}

