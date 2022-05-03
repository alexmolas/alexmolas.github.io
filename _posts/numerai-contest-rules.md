______________________________________________________________________

## layout: post title: "Numer.ai: contest rules" description: About how the numer.ai contest works and how do you earn NMR. tags: data crypto machine-learning numerai

______________________________________________________________________

## **Table of contents:**

# Introduction

In this post I will explain how the numer.ai tournament works and how you can participate and earn NMR.
In particualr, I will write about the different metric that numer.ai uses to evaluate the predictions, and how these
metrics determine the rewards that you're going to receive.

# Objective

The objective of the numer.ai tournament is to build a model to predict the future target using
live features that correspond to the current stock market. The predictions are combined to form the Meta Model,
which controls the capital of the numer.ai hedge fund. I will explain later what this Meta Model is and how
our predictions will be used in there.

# Submissions

The tournament is organized around the concept of rounds. Every Saturday at 18.00 UTC a new round opens, and new data is
released. To participate in the round, you must submit your predictions by the deadline on Monday 14.30 UTC.

**You must submit predictions every week to participate in the Numerai Tournament!**

You can download the latest data and submit the predictions manually using the website, or you can use numer.ai API.
You can deploy your ML model in the cloud in using numer.ai framework (more about that in the following posts).

# Scoring

## Correlation

Primarily, you're scored on the correlation between your predictions and the targets.
The following snippet shows how the correlation is computed

```python
import numpy as np
import pandas as pd

def compute_correlation(predictions: pd.Series, labels: pd.Series, method: str = "first", pct: bool = True):
    # method='first' breaks ties based on order in array
    ranked_predictions = predictions.rank(pct=pct, method=method)
    correlation = np.corrcoef(labels, ranked_predictions)[0, 1]
    return correlation
```

## Meta-model contribution

Since payouts are based on correlation every player wants to maximize its correlation value. However, numer.ai want to
maximize the meta-model score. Meta-model contribution (`mmc`) is meant to bridge this gap.

How it's computed the `mmc` for a given user U?

1. Select a random 67% of all staking users (with replacement).
1. Calculate the stake weighted predictions of these users.
1. Transform both the stake weighted predictions, and U's model to be uniformly distributed.
1. Neutralize U's model with respect to the uniform stake weighted predictions.
1. Calculate the covariance between U's model and the targets.
   divide this value by 0.0841 (this step is to bring the expected score up to the same magnitude as correlation)
   the resultant value is an MMC score
1. repeat this whole process 20 times and keep the average MMC score.

What does it mean to neutralize? A way to think about it is like we are taking your signal, removing the part
of the signal that can be accounted for by the stake-weighted-metamodel signal, and then scoring what is left over.

```python
import pandas as pd
import numpy as np

def neutralize_series(series: pd.Series, by:pd.Series, proportion=1.0):
  scores = series.values.reshape(-1, 1)
  exposures = by.values.reshape(-1, 1)

  # this line makes series neutral to a constant column so that it's centered and for sure gets corr 0 with exposures
  exposures = np.hstack((exposures, np.array([np.mean(series)] * len(exposures)).reshape(-1, 1)))

  correction = proportion * (exposures.dot(np.linalg.lstsq(exposures, scores)[0]))
  corrected_scores = scores - correction
  neutralized = pd.Series(corrected_scores.ravel(), index=series.index)
  return neutralized
```

For more information about `mmc` read [this](https://forum.numer.ai/t/mmc2-announcement/93).

## Feature neutral correlation

Feature neutral correlation (FNC) is the correlation of a model with the target, after its predictions
have been neutralized to all of Numerai’s features.

```python
import pandas as pd
import numpy as np

def calculate_fnc(sub: pd.Series, targets: pd.Series, features: pd.DataFrame):
    
    # Normalize submission
    sub = (sub.rank(method="first").values - 0.5) / len(sub)

    # Neutralize submission to features
    f = features.values
    sub -= f.dot(np.linalg.pinv(f).dot(sub))
    sub /= sub.std()
    
    sub = pd.Series(np.squeeze(sub)) # Convert np.ndarray to pd.Series

    # FNC: Spearman rank-order correlation of neutralized submission to target
    fnc = np.corrcoef(sub.rank(pct=True, method="first"), targets)[0, 1]

    return fnc

```

# Staking & Payouts

```python
import numpy as np
payout_ = stake_value * payout_factor * (corr * corr_multiplier + mmc * mmc_multiplier)
payout = np.clip(a=payout_, a_min=-0.25, a_max=0.25)
```

The stake_value is the value of your stake on the first Thursday (scoring day) of the round.
The payout_factor is number that scales with the total NMR staked across all models in the tournament.
The higher the total NMR staked above the 300K threshold the lower the payout factor.
Stake is updated with the payouts of 4 weeks ago,
this is $s_n = s\_{n-1} + p\_{n-4}$, where $s$ is the stake, $p$ the payout, and $n$ the week.
