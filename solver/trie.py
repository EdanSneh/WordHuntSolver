from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class TrieNode:
    children: dict[str, TrieNode] = field(default_factory=dict)
    parent: TrieNode | None = None
    end_of_word: bool = False


class Trie:
    _instance: Trie | None = None

    @staticmethod
    def get_instance() -> Trie:
        if Trie._instance is None:
            filename = "solver/words.txt"
            Trie._instance = Trie()
            with open(filename, "r") as f:
                for line in f:
                    word = line.strip()
                    Trie._instance.insert(word)
        return Trie._instance

    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for letter in word:
            if letter not in node.children:
                node.children[letter] = TrieNode(parent=node)
            node = node.children[letter]
        node.end_of_word = True

    def search(self, word: str) -> bool:
        node = self.root
        for letter in word:
            if letter not in node.children:
                return False
            node = node.children[letter]
        return node.end_of_word

    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for letter in prefix:
            if letter not in node.children:
                return False
            node = node.children[letter]
        return True

    def search_and_start_with(self, word: str) -> Tuple[bool, bool]:
        node = self.root
        for letter in word:
            if letter not in node.children:
                return False, False
            node = node.children[letter]
        return (
            True,
            node.end_of_word,
        )
