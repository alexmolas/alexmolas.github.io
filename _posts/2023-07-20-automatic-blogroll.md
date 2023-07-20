---
layout: post
title: "Automate your static blogroll."
description: "In this post I explain how I built my automatic blogroll using Github Action and Github Pages."
tags: 
---


During the [recent refactor of my blog]({% post_url 2023-07-13-ugly-blog %}) I implemented an idea that I had been thinking about for a long time: an [automatic blogroll](https://www.alexmolas.com/blogroll). It actually started as an idea of building a custom RSS aggregator for me, but at some point I decided to make it public and visible in my blog.

Here's why I like my implementation

1. It's free! everything runs on GitHub (Pages + Actions) so it's completely free for me.
2. The blogroll gets updated every 6 hours. I could make it every 15 minutes, but I don't see the need of that.
3. Everything is static. No need of databases, API, docker, kubernetes, and all the hell of modern websites. Everything is stored in HTML files that are updated every 6 hours.

In case you're wondering, here's how I did it. The code can be found [here](https://github.com/alexmolas/alexmolas.github.io/blob/master/_tools/build_rss.py) and [here](https://github.com/alexmolas/alexmolas.github.io/blob/master/.github/workflows/rss.yml).

## Python Script

First of all I wrote a script that received a list of websites and then it retrieved the latests post for each site. The idea is basically


```python
# build_blogroll.py
def main(): 
    # Read websites from websites.txt
    websites = read_websites("_tools/websites.txt")
    # Check for updates
    entries = []
    for website in tqdm(websites):
        feed = feedparser.parse(website)
        entries += feed.entries
    write_html_with_updates(entries)
```

where `write_html_with_updates` creates the file `_layouts/blogroll.html` with links to the latests post of each site. To avoid having an infinite list I'm filtering out posts older than 30 days.

## GitHub Pages + Jekyll

On the other hand, my blog is built using the standard combination of Jekyll + GitHub Pages. This means that to publish changes to my blog I only need to commit them to my `main` branch and then GitHub will publish them to `alexmolas.github.io` (which I've redirected to `alexmolas.com`).

This makes the writing experience very light, you only need to focus on writing your texts and GitHub takes care of everything else. Also, during the refactor of my blog I cut a lot of extra features, which makes the process of publishing even lighter. 

So if I run `build_blogroll.py` and then commit `_layouts/blogroll.html` to `main` I'll have the updated version of the blogroll. Now all that remains is to automate the process.

## GitHub Actions

GitHub Actions allow you to run custom code using GitHub infrastructure without you having to think about servers and so on. This means that I can run the script and then commit the changes using GitHub Actions. In particular, I only need to add this file `.github/workflows/rss.yml`

```yml
name: Blogroll Builder
on:
  schedule:
    - cron: "0 */6 * * *"
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: "3.10"
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Execute Blogroll Builder
        run: python _tools/build_rss.py
      - name: Commit and push changes
        env:
          GITHUB_TOKEN: ...
        run: |
          git config --local user.email "user@email.com"
          git config --local user.name "GitHub Action"
          git add _layouts/blogroll.html
          git diff --quiet && git diff --staged --quiet || git commit -m "Update blogroll"
          git push
```

and then GitHub will run `_tools/build_rss.py` and commit the updated `_layouts/blogroll.html` every 6 hours, and automagically the changes will be published in my blogroll.

## Final thoughts

This is a first version of the code, and I know it doesn't follow best practices and code standards, but it does the work. My idea is to use this as a base to build an open source RSS aggregator that can be run using GitHub Actions and that's completely free. If you feel this is something interesting to you feel free to contact me and we can work together on the project :) 
