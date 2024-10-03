---
layout: default
title: Rohan Kumar
description: Hello, world, I'm Rohan, and this is my website, where you can find my information, as well as read some poorly written blog posts, if I don't get lazy.
---

{% assign totalPosts = site.posts | size %}
{% assign totalWords = 0 %}

{% for post in site.posts %}
  {% assign postWords = post.content | number_of_words %}
  {% assign totalWords = totalWords | plus: postWords %}
{% endfor %}

<h1>Hello, I'm Rohan</h1>
Hello, world, I'm Rohan, and this is my website, where you can find my information, as well as read some poorly written blog posts, if I don't get lazy.

You can find my resume [here](resume.pdf).

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



