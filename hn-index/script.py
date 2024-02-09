import argparse
from collections import defaultdict
import aiohttp
import asyncio
from tqdm import tqdm
from pprint import pprint

async def fetch_user_data(session, url):
    async with session.get(url) as response:
        return await response.json()


async def fetch_item_data(session, url, scores, progress_bar):
    async with session.get(url) as response:
        item = await response.json()
        if (
            (not item.get("deleted"))
            and (not item.get("dead"))
            and (t := item.get("type"))
            and (s := item.get("score"))
        ):
            scores[t].append(int(s))
        progress_bar.update(1)


async def get_user_scores(username):
    user_url = (
        f"https://hacker-news.firebaseio.com/v0/user/{username}.json?print=pretty"
    )

    async with aiohttp.ClientSession() as session:
        user = await fetch_user_data(session, user_url)

        item_urls = [
            f"https://hacker-news.firebaseio.com/v0/item/{sub}.json"
            for sub in user["submitted"]
        ]

        scores = defaultdict(list)
        with tqdm(total=len(item_urls), desc=f"Fetching {username}'s scores") as pbar:
            tasks = [fetch_item_data(session, url, scores, pbar) for url in item_urls]
            await asyncio.gather(*tasks)

    return scores


def h_index(scores):
    return sum(x >= i + 1 for i, x in enumerate(sorted(list(scores), reverse=True)))


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--user")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    username = args.user
    scores_result = asyncio.run(get_user_scores(username))
    for t, s in scores_result.items():
        print(t, h_index(s))
