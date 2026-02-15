from app.models import PathResult


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
