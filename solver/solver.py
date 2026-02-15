from functools import cached_property
from typing import Tuple

from app.models import Color, PathResult
from solver.trie import Trie


class BoardSolver:
    def __init__(self, grid: list[list[str]], size: int):
        self.grid = grid
        self.size = size
        self.trie = Trie.get_instance()
        self.seen_words = set()
        self.valid_paths = []
        self._solve_board()

    @cached_property
    def rendered_results(self) -> list[PathResult]:
        results = []
        for key, value in self.hot_zones.items():
            print(key, value)
            color = Color.RED
            print(list(key))
            result = PathResult(
                tiles=list(key), darkness=value, color=color, label=str(value)
            )
            results.append(result)
        results.sort(key=lambda r: -r.darkness)
        print(results)
        return results

    @cached_property
    def hot_zones(self) -> list[Tuple[int, int]]:
        hot_zone_dict: dict[Tuple[Tuple[int, int], ...], int] = {}
        for path in self.valid_paths:
            print(path)
            for start in range(len(path)):
                for end in range(start, len(path)):
                    sub_path = path[start : end + 1]
                    reverse_path = sub_path[::-1]
                    if sub_path not in hot_zone_dict:
                        hot_zone_dict[sub_path] = 0
                        hot_zone_dict[reverse_path] = 0
                    hot_zone_dict[sub_path] += 1
                    if sub_path != reverse_path:
                        hot_zone_dict[reverse_path] += 1
        return hot_zone_dict

    def _solve_board(self):
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
        """
        1. For each tile do a BFS to find all possible words.
        2. For each word 
        """
        has_seen = []
        for _ in range(self.size):  # cols
            has_seen.append([False] * self.size)  # rows
        for y in range(self.size):
            for x in range(self.size):
                self._bfs((x, y), [(x, y)], self.grid[x][y], has_seen)
        return []

    def _bfs(
        self,
        node: Tuple[int, int],
        path: list[Tuple[int, int]],
        strpath: str,
        has_seen: list[list[bool]],
    ) -> None:
        starts_with_prefix, is_word = self.trie.search_and_start_with(strpath)
        if not starts_with_prefix:
            return
        if is_word and strpath not in self.seen_words and len(strpath) > 2:
            final_path = tuple(path)
            self.valid_paths.append((final_path))
            self.seen_words.add(strpath)

        edges = self._get_edges(node)
        has_seen[node[0]][node[1]] = True
        for edge in edges:
            if not has_seen[edge[0]][edge[1]]:
                path.append(edge)
                self._bfs(edge, path, strpath + self.grid[edge[0]][edge[1]], has_seen)
                path.pop()
        has_seen[node[0]][node[1]] = False

    def _get_edges(self, coord: Tuple[int, int]):
        x = coord[0]
        y = coord[1]
        edges = []
        if x < self.size - 1:
            edges.append((x + 1, y))
            if y < self.size - 1:
                edges.append((x + 1, y + 1))
            if y > 0:
                edges.append((x + 1, y - 1))

        if y < self.size - 1:
            edges.append((x, y + 1))
        if x > 0:
            edges.append((x - 1, y))
            if y > 0:
                edges.append((x - 1, y - 1))
            if y < self.size - 1:
                edges.append((x - 1, y + 1))
        if y > 0:
            edges.append((x, y - 1))
        return edges
