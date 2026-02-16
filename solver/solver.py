from audioop import reverse
from functools import cached_property
from typing import Tuple

from app.models import Color, HotZone, PathResult, WordResult
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
    def rendered_words(self) -> list[WordResult]:
        results = []
        for word, path in self.valid_paths:
            results.append(WordResult(id=0, tiles=[list(c) for c in path], label=word))
        results.sort(key=lambda w: (-len(w.label), w.label))
        for i, w in enumerate(results):
            w.id = i
        return results

    @cached_property
    def hot_zones(self):
        # Build word path -> word id lookup from rendered_words
        word_id_by_path: dict[Tuple[Tuple[int, int], ...], int] = {}
        for w in self.rendered_words:
            key = tuple(tuple(t) for t in w.tiles)
            word_id_by_path[key] = w.id

        hot_zone_dict: dict[Tuple[Tuple[int, int], ...], HotZone] = {}
        for word_str, path in self.valid_paths:
            word_id = word_id_by_path.get(path)
            for start in range(len(path)):
                for end in range(start, len(path)):
                    sub_path = path[start : end + 1]

                    # check if reverse exists
                    reverse_path = sub_path[::-1]
                    if reverse_path in hot_zone_dict:
                        sub_path = reverse_path
                        hot_zone_dict[sub_path].reverse_count += 1

                    if sub_path not in hot_zone_dict:
                        hot_zone_dict[sub_path] = HotZone(
                            label=word_str[start : end + 1]
                        )
                        if reverse_path == sub_path:
                            hot_zone_dict[sub_path].reverse_count += 1
                    hot_zone_dict[sub_path].total_count += 1
                    hot_zone_dict[sub_path].word_ids.add(word_id)
        return hot_zone_dict

    @cached_property
    def rendered_results(self) -> list[PathResult]:
        hot_zone_dict = self.hot_zones
        results = []
        colors = [color for color in Color]
        for key, zone in hot_zone_dict.items():
            path_size = len(key) - 1
            color = colors[path_size % len(colors)]
            result = PathResult(
                id=0,
                tiles=list(key),
                total_count=zone.total_count,
                reverse_count=zone.reverse_count,
                color=color,
                label=zone.label,
                word_ids=sorted(zone.word_ids),
            )
            results.append(result)
        results.sort(key=lambda r: -r.total_count)
        for i, r in enumerate(results):
            r.id = i
        return results

    def _solve_board(self):
        has_seen = []
        for _ in range(self.size):
            has_seen.append([False] * self.size)
        for y in range(self.size):
            for x in range(self.size):
                self._dfs((x, y), [(x, y)], self.grid[x][y], has_seen)

    def _dfs(
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
            self.valid_paths.append((strpath, final_path))
            self.seen_words.add(strpath)

        edges = self._get_edges(node)
        has_seen[node[0]][node[1]] = True
        for edge in edges:
            if not has_seen[edge[0]][edge[1]]:
                path.append(edge)
                self._dfs(edge, path, strpath + self.grid[edge[0]][edge[1]], has_seen)
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
