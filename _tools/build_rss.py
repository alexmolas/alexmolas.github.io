from typing import List
from urllib.parse import urlparse
import feedparser
import datetime
from dateutil.parser import parse

from tqdm import tqdm
from bs4 import BeautifulSoup


def remove_html_tags(text: str) -> str:
    soup = BeautifulSoup(text, "html.parser")
    cleaned_text = soup.get_text()
    return cleaned_text


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
        if not hasattr(entry, "links"):
            continue
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
layout: default
# All the Tags of posts.
---
    <h1>Blogroll</h1>
    When I'm not with my family or writing I'm probably browsing one of this blogs.
    If your time is limited I recommend you to skip my blog and read one of these ones instead.
    </br>
    </br>
    This is a list of all the posts published by my favourite <a href="https://github.com/alexmolas/alexmolas.github.io/blob/master/scripts/websites.txt">blogs</a> during the last
    30 days.
    </br>
    </br>
    <div class="special-list">
    <ul>
    """

    for link, title, date in sorted_links:
        title = remove_html_tags(title)
        html += f"""
            <li>
            <span class="post-date">{date.date()}</span> -
            <a href='{link}'>{title}</a></li>\n
        """

    html += """
    </ul>
    </div>
    """

    with open("_layouts/blogroll.html", "w") as file:
        file.write(html)

    print("HTML file with updated links generated.")


def main():

    # Read websites from websites.txt
    websites = read_websites("_tools/websites.txt")
    print(websites)
    # Check for updates
    entries = []
    for website in tqdm(websites):
        feed = feedparser.parse(website)
        entries += feed.entries
    write_html_with_updates(entries)


if __name__ == "__main__":
    main()
