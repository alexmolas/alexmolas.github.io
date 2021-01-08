---
title: How I built this site
published: true
---

In this post, I will explain how I built this site and how I wrote this post - so you could say this is a little bit meta. Of course, there are a lot of other resources that will teach you how to build a site like this one, and probably they are much better than this, but I am writing this post to learn how to write a full post - with images, code, and maybe some $\LaTeX$ too :) 

---
**Table of contents:** 
- [First steps:](#first-steps)
  - [GitHub pages:](#github-pages)
  - [Jekyll:](#jekyll)
- [How to write a post:](#how-to-write-a-post)
  - [How to add images:](#how-to-add-images)
  - [How to add equations:](#how-to-add-equations)

---

# First steps:

## GitHub pages:

One of the first thing that you have to thought when you want to start your own blog is where are you going to host it. Usually, this costs you some money, but fortunately for me GitHub allows you create your own page very easily through GitHub Pages. From GitHub Pages documentation:

> GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website. 

So you only need to put all the needed files in your GitHub repo and they will be rendered into a static website. To publish your site the repo should be named `<username>.github.io`. After pushing the code to the repo, GitHub will use Jekyll to build the site (more on that in the following section). I recommend following this [tutorial](https://github.com/github/personal-website) to build your first site.

Unfortunately, GitHub Pages does not support dynamics sites, this means that does not support server side languages such as PHP or Python.

## Jekyll:

As we said before, GitHub Pages use Jekyll to build the site, but what is Jekyll?

Jekyll is a `Ruby` `gem` - [whatever it means](https://guides.rubygems.org/what-is-a-gem/) - and, according to Jekyll documentation:

> Jekyll is a static site generator. It takes text written in your favorite markup language and uses layouts to create a static website.

So, in summary, using the `gem` Jekyll one can turn markup languages (such as markdown) to static websites. 

Since GitHub uses Jekyll to build the sites, it makes sense to install it locally to develop without the need of pushing to GitHub continuously - this would be a bad idea since GitHub Pages has some [limits](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/about-github-pages#usage-limits) regarding that. To install Jekyll is as easy as following this [instructions](https://jekyllrb.com/docs/#instructions). Also, in the tutorial referenced above there are instructions on how to run Jekyll locally.

# How to write a post:

Finally, after working all this out, one may want to start writing some posts! However, sometimes it could be difficult to make your code do what you want to do. Here I leave you some tips that have been very useful to me to write my first post.

## How to add images:

Fortunately, it is possible to add HTML in markdown files, so we can use it to include images in our posts.

The first step is to add our image in a public folder, this is a folder which name does not start with an underscore. On the other hand, a private folder has a name that starts with an underscore. Ie: `public_folder` and `_private_folder`, following the same philosophy of almost all programming languages.

In my case, to keep everything as ordered as posible, I will create `docs` folder in my root, and for each post I will create a subfolder like `post-name`. So, finally I would have something like this:
```
+-- docs
|   +-- post-1
|       +-- image-1
|       +-- image-2
|       +-- ...
|   +-- post-2
|       +-- image-1
|       +-- image-2
|       +-- ...
|   +-- ...
```

Once you have your images in the public folders you can add them using plain HTML, using something like:
```html
<div style="text-align:center">
    <img src="/docs/post-name/image-name" width=500px class="center">
</div>
```

And the result will look like this:

<div style="text-align:center">
    <img src="/docs/how-did-i-start/image.png" width=500px class="center">
</div>
<br/>

## How to add equations:

Finally I will show how to add equations to the posts. I'm sure that this won't be interesting to many, however it's important to me to be able to add equations in an easy way. And of course, the most [beautiful](https://www.reddit.com/r/LaTeX/comments/7msm7q/why_is_latex_so_beautiful/) way to write equations is using $\LaTeX$.

It could seem dificult to do that, or at least it seemed to me, however, you only need to add this little snippet in you header:

```html
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    tex2jax: {
      skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
      inlineMath: [['$','$']]
    }
  });
</script>
<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script> 
```

And just like that you can start writing this nice equations in your posts:

$h_\theta(x) = \Large\frac{1}{1 + \mathcal{e}^{\left(-\theta^T x\right)}}$

