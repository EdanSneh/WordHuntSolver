from dataclasses import dataclass, field
from enum import Enum

from pydantic import BaseModel


class Color(str, Enum):
    YELLOW = "YELLOW"
    ORANGE = "ORANGE"
    GREEN = "GREEN"
    CYAN = "CYAN"
    BLUE = "BLUE"
    PURPLE = "PURPLE"
    PINK = "PINK"


@dataclass
class HotZone:
    label: str
    total_count: int = 0
    reverse_count: int = 0
    word_ids: set = field(default_factory=set)


class SolveRequest(BaseModel):
    grid: list[list[str]]  # NxN grid of single uppercase characters
    size: int  # 4 or 5


class WordResult(BaseModel):
    id: int
    tiles: list[list[int]]  # list of [row, col] pairs forming the word
    label: str  # the word string


class PathResult(BaseModel):
    id: int
    tiles: list[list[int]]  # list of [row, col] pairs forming the path
    total_count: int  # 1-100, controls line color darkness (higher = darker)
    reverse_count: int  # number of times the path reverses direction
    color: Color  # line color
    label: str  # display label (typically the word found)
    word_ids: list[int]  # IDs of associated WordResults


class SolveResponse(BaseModel):
    paths: list[PathResult]
    words: list[WordResult]
