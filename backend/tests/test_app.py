from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_solve_response_structure():
    grid = [
        ["A", "B", "C", "D"],
        ["E", "F", "G", "H"],
        ["I", "J", "K", "L"],
        ["M", "N", "O", "P"],
    ]
    r = client.post("/solve", json={"grid": grid, "size": 4})
    assert r.status_code == 200
    data = r.json()
    assert "paths" in data
    assert "words" in data
    assert isinstance(data["paths"], list)
    assert isinstance(data["words"], list)
    # Verify PathResult structure
    if data["paths"]:
        p = data["paths"][0]
        assert "id" in p
        assert "tiles" in p
        assert "word_ids" in p
        assert isinstance(p["word_ids"], list)
    # Verify WordResult structure
    if data["words"]:
        w = data["words"][0]
        assert "id" in w
        assert "tiles" in w
        assert "label" in w


def test_index_html_served():
    r = client.get("/index.html")
    assert r.status_code == 200
    assert "Word Hunt Solver" in r.text
