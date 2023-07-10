from typing import List
import feedparser
import datetime
from dateutil.parser import parse

from tqdm import tqdm


def read_websites(filename: str) -> List[str]:
    with open(filename, "r") as file:
        return file.read().splitlines()


def write_html_with_updates(entries: List[feedparser.FeedParserDict]) -> None:
    today = datetime.datetime.today()
    three_months_ago = today - datetime.timedelta(days=3*30)

    links = []
    for entry in tqdm(entries):
        url = entry.links[0]['href']
        title = entry.title
        try:
            published_date = parse(entry.published, ignoretz=True, fuzzy=True)
        except Exception:
            print("Skipping: ", url)
            continue
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
    <hr>
    </br>
    When I'm not with my family or writing I'm probably browsing one of this blogs. 
    If you're time is limited I recommend you to skip my blog and read one of these
    ones instead. 
    </br>
    </br>
    This is a list of all the posts published by my favourite <a href="https://github.com/alexmolas/alexmolas.github.io/blob/master/scripts/websites.txt">blogs</a> during the last
    90 days.
    </br></br>
    <hr>
    </br>
    <ul>
    """

    for link, title, date in sorted_links:
        html += f"<li>{date.date()} - <a href='{link}'>{title}</a></li>\n"

    html += """
    </ul>
    </body>
    </html>
    """

    with open("what_to_read.html", "w") as file:
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
