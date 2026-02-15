from enum import Enum
from pydantic import BaseModel


class Color(str, Enum):
    RED = "RED"
    ORANGE = "ORANGE"
    YELLOW = "YELLOW"
    GREEN = "GREEN"
    CYAN = "CYAN"
    BLUE = "BLUE"
    PURPLE = "PURPLE"
    PINK = "PINK"


class SolveRequest(BaseModel):
    grid: list[list[str]]  # NxN grid of single uppercase characters
    size: int              # 4 or 5


class PathResult(BaseModel):
    tiles: list[list[int]]  # list of [row, col] pairs forming the path
    brightness: int         # 1-100, controls line color lightness
    color: Color            # line color
    label: str              # display label (typically the word found)


class SolveResponse(BaseModel):
    paths: list[PathResult]
