import argparse
import aiohttp
import asyncio
from tqdm import tqdm
import numpy as np


async def fetch_user_data(session, url):
    async with session.get(url) as response:
        return await response.json()


async def fetch_item_data(session, url, scores, progress_bar):
    async with session.get(url) as response:
        item = await response.json()
        if (
            (not item.get("deleted"))
            and (not item.get("dead"))
            and (item.get("type") == "story")
            and (s := item.get("score"))
        ):
            scores.append(int(s))
        progress_bar.update(1)


async def get_user_scores(username):
    user_url = (
        f"https://hacker-news.firebaseio.com/v0/user/{username}.json?print=pretty"
    )
    connector = aiohttp.TCPConnector(limit=1000)
    async with aiohttp.ClientSession(connector=connector) as session:
        user = await fetch_user_data(session, user_url)

        item_urls = [
            f"https://hacker-news.firebaseio.com/v0/item/{sub}.json"
            for sub in user["submitted"]
        ]

        scores = []
        with tqdm(total=len(item_urls), desc=f"Fetching {username}'s scores") as pbar:
            tasks = [fetch_item_data(session, url, scores, pbar) for url in item_urls]
            await asyncio.gather(*tasks)

    return user["karma"], scores


def h_index(scores):
    return sum(x >= i + 1 for i, x in enumerate(sorted(list(scores), reverse=True)))


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--user", default=None)
    parser.add_argument("--users-path", default=None)
    return parser.parse_args()


def main():
    """
    You can run this script in two modes
    (1) For a single user you can execute this scripts as
            > python script.py --user USERNAME
        and it'll print in the command line
            USERNAME KARMA HN-INDEX

    (2) You can also run the script for a list of users. To do so run
            > python script.py --users-path USERS
        where USERS is a file with a username per line.
        The result of this script is a csv file with columns
            username,number of submissions,h index,karma
        Notice that firebase can kill your connection if you make too many requests.
        If your users file is too big you might need to resume the process manually from time to time.
        The csv is generated one line at a time, so you'll only need to resume the process with unprocessed users.
    """
    args = parse_args()
    if username := args.user:
        karma, scores_result = asyncio.run(get_user_scores(username))
        print(username, karma, h_index(scores_result))
    if users_path := args.users_path:
        output_path = f"{users_path.split('.')[0]}-output.csv"

        with open(users_path) as f:
            for username in f.readlines():
                username = username.strip("\n")
                karma, scores_result = asyncio.run(get_user_scores(username))
                with open(output_path, "a+") as f:
                    f.write(
                        f"{username},{len(scores_result)},{h_index(scores_result)},{karma}\n"
                    )


if __name__ == "__main__":
    main()
