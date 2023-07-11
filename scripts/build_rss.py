from typing import List
from urllib.parse import urlparse
import feedparser
import datetime
from dateutil.parser import parse

from tqdm import tqdm


def get_base_url(feed_url: str) -> str:
    parsed_url = urlparse(feed_url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}"


def strip_protocol(url: str) -> str:
    if url.startswith("https://"):
        return url.lstrip("https://")
    elif url.startswith("http://"):
        return url.lstrip("http://")
    return url


def read_websites(filename: str) -> List[str]:
    with open(filename, "r") as file:
        return file.read().splitlines()


def write_html_with_updates(entries: List[feedparser.FeedParserDict]) -> None:
    today = datetime.datetime.today()
    three_months_ago = today - datetime.timedelta(days=30)

    links = []
    for entry in tqdm(entries):
        url = entry.links[0]['href']
        title = entry.title
        try:
            d = entry.get("published") or entry.get("updated")
            published_date = parse(d, ignoretz=True, fuzzy=True)
        except Exception:
            print("Skipping: ", url)
            continue
        if published_date >= three_months_ago:
            links.append((url, title, published_date))

    sorted_links = sorted(links, key=lambda x: x[2], reverse=True)

    html = """---
layout: page
# All the Tags of posts.
---
    <html>
    <head>
    <title>RSS Feed Updates</title>
    <style>
    .special-list ul {
            list-style-type: none;
            padding: 0;
            font-family: monospace;
        }
    li {
        margin-bottom: 10px;
    }
    a:visited {
    color: pink;
    background-color: transparent;
    text-decoration: none;
    }

    </style>
    </head>
    <body>
    <h1>New Posts</h1>
    <hr>
    </br>
    When I'm not with my family or writing I'm probably browsing one of this blogs.
    If your time is limited I recommend you to skip my blog and read one of these ones instead.
    </br>
    </br>
    This is a list of all the posts published by my favourite <a href="https://github.com/alexmolas/alexmolas.github.io/blob/master/scripts/websites.txt">blogs</a> during the last
    30 days.
    </br></br>
    <hr>
    </br>
    <div class="special-list">
    <ul>
    """

    for link, title, date in sorted_links:
        base_url = get_base_url(link)
        web_name = strip_protocol(base_url)
        html += f"<li>{date.date()} - <a href='{link}'>{title}</a></li>\n"

    html += """
    </ul>
    </div>
    </body>
    </html>
    """

    with open("_layouts/what-to-read.html", "w") as file:
        file.write(html)

    print("HTML file with updated links generated.")


def main():

    # Read websites from websites.txt
    websites = read_websites("scripts/websites.txt")

    # Check for updates
    entries = []
    for website in tqdm(websites):
        feed = feedparser.parse(website)
        entries += feed.entries
    write_html_with_updates(entries)


if __name__ == "__main__":
    main()
