from typing import Optional, Sequence
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

import plotly.express as px
import plotly.io as pio


def plot_histograms(data: pd.DataFrame, country: Optional[str] = None):
    if country:
        senior = data[(data["country"] == country)].copy()
    else:
        senior = data.copy()
    male = senior[(senior["sex"] == "M")].sort_values("rating")["rating"]
    female = senior[(senior["sex"] == "F")].sort_values("rating")["rating"]
    print(f"male {np.mean(male):.2f} +- {np.std(male):.2f}")
    print(f"female {np.mean(female):.2f} +- {np.std(female):.2f}")
    print(f"best diff: {max(male) - max(female)}")
    bins = np.linspace(800, 2800, 37)
    plt.hist(
        male,
        alpha=0.5,
        cumulative=False,
        density=True,
        histtype="barstacked",
        bins=bins,
    )
    plt.hist(
        female,
        alpha=0.5,
        cumulative=False,
        density=True,
        histtype="barstacked",
        bins=bins,
    )
    plt.show()


def plot_expected_vs_actual_per_country(
    data: pd.DataFrame, save_to: Optional[str] = None, sigmas: int = 1
):
    results = data.sort_values("mean diff").copy()
    results["std diff"] = results["std diff"] * sigmas
    bar_fig = px.scatter(results, x="mean diff", y="country", error_x="std diff")
    scatter_fig = px.scatter(results, x="actual diff", y="country")
    scatter_fig.update_traces(marker_color="black")
    combined_fig = bar_fig.add_traces(scatter_fig.data)
    combined_fig.update_layout(
        autosize=False,
        width=500,
        height=1000,
        xaxis={"range": [-100, 900]},
        yaxis={"range": [-1, len(results)]},
    )
    if save_to:
        pio.write_html(combined_fig, file=save_to)
    combined_fig.show()


def plot_bilalic_vs_blom(ks: Sequence[int], comparison: dict):
    plt.plot(
        ks, comparison["bilalic"], "o", markersize=3, label="Bilalic approximation"
    )
    plt.plot(ks, comparison["blom"], "s", markersize=3, label="Blom approximation")
    plt.plot(ks, comparison["numeric"], "r", label="Numeric experiments")
    plt.fill_between(
        ks,
        comparison["numeric"] - comparison["numeric std"],
        comparison["numeric"] + comparison["numeric std"],
        color="r",
        alpha=0.1,
        label="Standard deviation",
    )
    plt.xlabel("k")
    plt.ylabel("ELO")
    plt.legend()


def plot_actual_vs_expected_top_countries(
    data: dict, plot_normal_approx: bool = False, sigmas: int = 1, country: Optional[str] = None
):
    real_diffs = data["real_diffs"]
    bootstrap_expected_difference = data["bootstrap_expected_difference"]
    bootstrap_expected_std = data["bootstrap_expected_std"]
    n = len(real_diffs)
    print(sum(real_diffs - bootstrap_expected_difference))
    plt.plot(
        range(1, n + 1),
        real_diffs,
        "-s",
        markersize=3,
        linewidth=1,
        color="black",
        markerfacecolor="white",
        label="Real Differences",
    )
    plt.plot(
        range(1, n + 1),
        bootstrap_expected_difference,
        "-s",
        markersize=3,
        linewidth=1,
        color="black",
        label="Expected Differences (boostrapping)",
    )
    plt.fill_between(
        range(1, n + 1),
        bootstrap_expected_difference - sigmas * bootstrap_expected_std,
        bootstrap_expected_difference + sigmas * bootstrap_expected_std,
        color="black",
        alpha=0.3,
        label=f"Expected Differences ($\pm {sigmas} \sigma$)",
    )
    if plot_normal_approx:
        normal_expected_difference = data["normal_expected_difference"]
        plt.plot(
            range(n),
            normal_expected_difference,
            "-v",
            markersize=3,
            linewidth=1,
            color="black",
            label="Expected Differences (normal assumption)",
        )
    if country:
        title = f"Differences between Actual and Expected ELO Ratings of the Best {n} Female and Male Chess Players in {country}"
    else:
        title = f"Differences between Actual and Expected ELO Ratings of the Best {n} Female and Male Chess Players"
    plt.xlabel("Player Rank")
    plt.ylabel("ELO Rating Difference")
    plt.title(
        title
    )
    plt.legend(loc="best")
