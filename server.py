from enum import Enum
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(title="Word Hunt Solver", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


def solve_board(grid: list[list[str]], size: int) -> list[PathResult]:
    """
    Solve the word hunt board and return all valid word paths.

    Args:
        grid: NxN grid of single uppercase characters
        size: grid dimension (4 or 5)

    Returns:
        List of PathResult objects, each representing a found word.

    TODO: Implement your solver here. For each word found:
        - tiles: sequence of [row, col] coordinates tracing the word
        - brightness: 1-100 value for display intensity
        - color: pick from Color enum
        - label: the word string
    """
    # TODO: implement solver
    return []


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/solve", response_model=SolveResponse)
def solve(request: SolveRequest):
    paths = solve_board(request.grid, request.size)
    return SolveResponse(paths=paths)
