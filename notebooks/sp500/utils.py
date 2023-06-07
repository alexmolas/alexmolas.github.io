import bisect
import datetime
from collections.abc import MutableMapping
from typing import Iterator


class ClosestIndexDict(MutableMapping):
    def __init__(self) -> None:
        self._dict = dict()
        self._keys = sorted(list(self._dict.keys()))

    def __getitem__(self, k: datetime.datetime) -> float:
        ind = bisect.bisect_left(self._keys, k)
        if ind >= len(self):
            raise KeyError(f"{k} is outside the range")
        return self._dict[self._keys[ind]]

    def __setitem__(self, k: datetime.datetime, v: float) -> None:
        self._dict[k] = v
        bisect.insort(self._keys, k)

    def __delitem__(self, k: datetime.datetime) -> None:
        del self._dict[k]
        self._keys.remove(k)

    def __len__(self) -> int:
        return len(self._dict)

    def __iter__(self) -> Iterator:
        yield from self._dict.keys()
