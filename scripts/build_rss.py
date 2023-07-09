from typing import List
import feedparser
import configparser
from urllib.parse import urlparse
import datetime
from dateutil.parser import parse


def get_base_url(feed_url: str) -> str:
    parsed_url = urlparse(feed_url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}"


def read_websites(filename: str) -> List[str]:
    with open(filename, "r") as file:
        return file.read().splitlines()


def write_html_with_updates(entries: List[feedparser.FeedParserDict]) -> None:
    today = datetime.datetime.today()
    three_months_ago = today - datetime.timedelta(days=3*30)

    links = []
    for entry in entries:
        url = entry.links[0]['href']
        title = entry.title
        published_date = parse(entry.published, ignoretz=True)
        if published_date >= three_months_ago:
            links.append((url, title, published_date))

    sorted_links = sorted(links, key=lambda x: x[2], reverse=True)

    html = """
    <html>
    <head>
    <title>RSS Feed Updates</title>
    <style>
    body {
        font-family: monospace;
    }
    h1 {
        text-align: center;
    }
    ul {
        list-style-type: none;
        padding: 0;
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
    <ul>
    """

    for link, title, date in sorted_links:
        html += f"<li>{date.date()} - <a href='{link}'>{title}</a></li>\n"

    html += """
    </ul>
    </body>
    </html>
    """

    with open("updated_links.html", "w") as file:
        file.write(html)

    print("HTML file with updated links generated.")


def main():
    # Load configuration from config.ini
    config = configparser.ConfigParser()
    config.read("config.ini")

    # Read websites from websites.txt
    websites = read_websites("scripts/websites.txt")

    # Check for updates
    entries = []
    for website in websites:
        feed = feedparser.parse(website)
        entries += feed.entries
    write_html_with_updates(entries)


if __name__ == "__main__":
    main()
