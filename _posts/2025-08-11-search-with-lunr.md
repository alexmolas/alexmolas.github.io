---
layout: post
title: "Adding search to my static blog." 
description: How I added fast, client‑side search to this site with Lunr.js and a build-time index.
tags: javascript jekyll
toc: false
---

I finally added search to this blog [^1].

This is cool because it keeps searches private and offline once the page loads. No third‑party boxes, no tracking, just a tiny index and a small script. So I can keep hosting my blog on Github Pages and have a search service for free.

Credit where due: I was inspired by [Vicki's post on client‑side search with Lunr](https://vickiboykis.com/2025/08/08/enabling-hugo-static-site-search-with-lunr.js/). She did it on Hugo; I adapted the approach to Jekyll. In Jekyll, generating the data files that Lunr needs is trivial with Liquid and can be done at build time, which made this especially easy.

Press Cmd+K (or Ctrl+K on Windows/Linux) anywhere, or click the <a href="#" onclick="openSearchModal(); return false;" title="Search posts (Cmd+K)">search</a> link in the navbar. It’s fast, works offline once loaded, and doesn’t send your queries to any server.

## What I built
- **Client-side search**: powered by Lunr.js (BM25 ranking, stemming, stop-words).
- **Index at build time**: Jekyll emits a compact document list that Lunr indexes in the browser.
- **Simple UI**: a modal with keyboard navigation, result count, and highlighted snippets.

This gives quick results, sensible ranking, and zero backend complexity.

## How it works

The goal is to keep everything static. Jekyll builds the data; the browser builds the index and handles queries. No services, no endpoints.

### Build-time index (Jekyll → JSON-like docs → Lunr)

At build time, Jekyll + Liquid loops over `site.posts` and emits a tiny JavaScript array of post metadata and plain text. That array ships with the page as `window.documents`. On page load, Lunr reads those docs and builds the index entirely in your browser. No endpoints, no JSON file required (though you can also output `/search.json` if you prefer).

Here you can see an example of the documents that Jekyll generates at build time.

<details>
<summary>Documents emitted at build time</summary>

{% highlight html %}
window.documents = [
  {% for post in site.posts limit:5 %}
    {
      "id": "{{ forloop.index0 }}",
      "title": {{ post.title | jsonify }},
      "url": "{{ post.url | relative_url }}",
      "date": "{{ post.date | date: '%B %d, %Y' }}",
      "excerpt": {{ post.excerpt | strip_html | truncatewords: 30 | jsonify }},
      "content": {{ post.content | strip_html | jsonify }},
      "tags": {{ post.tags | join: " " | jsonify }}
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
];
{% endhighlight %}

</details>

Now, using the information in `window.documents` we can build the index using Lunr. The next snippet show how to do it.

```html
<script src="https://unpkg.com/lunr/lunr.js"></script>
<script>
// Build the Lunr index in the browser
window.searchIndex = lunr(function () {
  this.ref('id');
  this.field('title', { boost: 10 });
  this.field('tags', { boost: 5 });
  this.field('excerpt', { boost: 3 });
  this.field('content');

  window.documents.forEach(function (doc) {
    this.add(doc);
  }, this);
});
</script>
```

What’s happening here:
- `this.ref('id')` sets the unique identifier for each document. Lunr returns this ref on search so we can map back to `window.documents`.
- `this.field(...)` declares which fields to index and their relative importance via boosts (title > tags > excerpt > content).
- `window.documents.forEach(... this.add(doc) ...)` feeds each post into the index. Passing `this` preserves the Lunr builder as the function context.

The result is an in‑memory index built once on page load. We query it with `window.searchIndex.search(query)` and then hydrate results from `window.documents`.

This keeps the site fully static: Jekyll renders the list, the browser builds the index. Compared to Hugo, this felt simpler for me: Liquid makes it easy to shape the data inline without extra templates or generators, and I don’t need a separate JSON step unless I want one. It also fits my hosting: GitHub Pages serves static files only, so I can’t add a server-side search service even if I wanted to.

### Searching and serving results
When the user types, I run a Lunr query and map the top results back to my `documents` list. Then I render a small card with title, date, and a contextual snippet with the matched terms highlighted.

```javascript
function performSearch(query) {
  if (!query.trim()) return [];
  const matches = window.searchIndex.search(query);
  return matches.slice(0, 10).map(m => {
    const doc = window.documents[parseInt(m.ref)];
    return { ...doc, score: m.score };
  });
}
```

### Keyboard shortcut and modal
Small touches make it feel native: a quick modal, Cmd+K/Ctrl+K to open, arrows to navigate, Enter to jump.

```javascript
// Open with Cmd+K / Ctrl+K
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSearchModal();
  }
});

function openSearchModal() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchInput');
  modal.style.display = 'block';
  input.focus();
}
```

The UI also supports ESC to close, arrows to navigate, and Enter to open the selected result.

## Why Lunr
I didn’t want a service. Lunr is a tiny dependency that gives me real information‑retrieval behavior without infrastructure.
- **Ranking that works**: BM25 beats my past ad‑hoc scoring.
- **Zero deps at runtime**: no backend, no external service.
- **Small & portable**: a single script and a tiny doc list.

## Try it
- Tap Cmd+K / Ctrl+K, or click the **search** link above.
- Type anything you remember from a post: a tag, a phrase, a topic.

If something feels off (results, snippet, ranking), tell me—I’ll tweak the fields/boosts or snippets.

## Next steps

I'd like to add semantic search on client side too. We can compute embeddings at build time using a small embedding model (MiniLM/SentenceTransformers). Then embed the query at runtime and rank posts by cosine similarity.

---

[^1]: Yes, I admit it, I vibe coded it.