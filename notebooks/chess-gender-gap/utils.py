from math import log
from typing import List, Optional, Sequence, Tuple

import numpy as np
import pandas as pd
from scipy.special import ndtri
from scipy.stats import norm
from tqdm import tqdm


def compute_actual_and_expected_difference(
    data: pd.DataFrame, countries: List[str], n_experiments: int = 100
) -> pd.DataFrame:
    results = {"country": [], "mean diff": [], "std diff": [], "actual diff": []}

    for country in tqdm(countries):
        senior = data[(data["country"] == country)].copy()
        actual_diff = max(senior[senior["sex"] == "M"]["rating"]) - max(
            senior[senior["sex"] == "F"]["rating"]
        )
        n_men = len(senior[senior["sex"] == "M"])
        elos = senior["rating"].values
        diff = []
        for i in range(n_experiments):
            np.random.shuffle(elos)
            men_elos = elos[:n_men]
            women_elos = elos[n_men:]
            diff.append(max(men_elos) - max(women_elos))
        diff = np.array(diff)
        results["country"].append(country)
        results["mean diff"].append(np.mean(diff))
        results["std diff"].append(np.std(diff))
        results["actual diff"].append(actual_diff)
    results = pd.DataFrame(results)
    return results


def H(k):
    return sum([j ** (-1) for j in range(1, k + 1)])


def f(n, k):
    r = 1
    for _ in range(k):
        r *= n
        n -= 1
    return r


def expected_elo_bilalic(n, k, mu, sigma, c1=1.25, c2=0.287):
    return (mu + c1 * sigma) + c2 * sigma * (f(n, k) / n**k * (log(n) - H(k - 1)))


def expected_elo_blom(n, k, mu, sigma, alpha=0.375):
    return mu + ndtri(((n - k + 1) - alpha) / (n - 2 * alpha + 1)) * sigma


def expected_elo_from_gaussian(
    n, k, mu, sigma, n_experiments=100
) -> Tuple[float, float]:
    x = np.sort(norm(mu, sigma).rvs(size=(n_experiments, n)))
    return np.mean(x[:, -k]), np.std(x[:, -k])


def expected_elo_bootstrapping(n, k, ratings, n_experiments=100):
    ratings = ratings.copy()
    x = np.sort(np.random.choice(ratings, size=(n_experiments, n)))
    return np.mean(x[:, -k]), np.std(x[:, -k])


def bilalic_vs_blom(
    n: int,
    mu: float,
    sigma: float,
    ks: Sequence[int],
):
    blom = []
    bilalic = []
    numeric = []
    numeric_std = []
    for k in tqdm(ks):
        blom.append(expected_elo_blom(n, k, mu, sigma))
        bilalic.append(expected_elo_bilalic(n, k, mu, sigma))
        mean, std = expected_elo_from_gaussian(n, k, mu, sigma)
        numeric.append(mean)
        numeric_std.append(std)

    return {
        "blom": np.array(blom),
        "bilalic": np.array(bilalic),
        "numeric": np.array(numeric),
        "numeric std": np.array(numeric_std),
    }


def compute_actual_and_expected_differences_top_players(
    data: pd.DataFrame,
    country: Optional[str] = None,
    n: int = 100,
    n_experiments: int = 100,
) -> dict:
    if country:
        df_country = data[(data["country"] == country)].copy()
    else:
        df_country = data.copy()
    ratings = df_country["rating"].values.copy()
    elos_male = df_country[df_country["sex"] == "M"]["rating"].values
    elos_female = df_country[df_country["sex"] == "F"]["rating"].values
    n_male = len(elos_male)
    n_female = len(elos_female)
    n = min([n_male, n_female, n])

    # Calculate the real differences
    top_elos_male = sorted(elos_male, reverse=True)[:n]
    top_elos_female = sorted(elos_female, reverse=True)[:n]
    real_diffs = np.array([top_elos_male[i] - top_elos_female[i] for i in range(n)])

    # Bootstrap difference
    n_male = len(elos_male)
    n_female = len(elos_female)
    bootstrap_male = [
        expected_elo_bootstrapping(
            n=n_male, k=i, ratings=ratings, n_experiments=n_experiments
        )
        for i in range(1, n + 1)
    ]
    bootstrap_female = [
        expected_elo_bootstrapping(
            n=n_female, k=i, ratings=ratings, n_experiments=n_experiments
        )
        for i in range(1, n + 1)
    ]

    bootstrap_expected_difference = np.array(
        [bootstrap_male[i][0] - bootstrap_female[i][0] for i in range(n)]
    )
    bootstrap_expected_std = np.array(
        [
            np.sqrt(bootstrap_male[i][1] ** 2 + bootstrap_female[i][1] ** 2)
            for i in range(n)
        ]
    )
    # Normal assumption difference
    mu = df_country["rating"].mean()
    sigma = df_country["rating"].std()
    print(mu, sigma)
    simulated_male = [
        expected_elo_blom(n=n_male, k=i, mu=mu, sigma=sigma) for i in range(1, n + 1)
    ]
    simulated_female = [
        expected_elo_blom(n=n_female, k=i, mu=mu, sigma=sigma) for i in range(1, n + 1)
    ]
    normal_expected_difference = [
        simulated_male[i] - simulated_female[i] for i in range(n)
    ]

    return {
        "real_diffs": real_diffs,
        "normal_expected_difference": normal_expected_difference,
        "bootstrap_expected_difference": bootstrap_expected_difference,
        "bootstrap_expected_std": bootstrap_expected_std,
    }
