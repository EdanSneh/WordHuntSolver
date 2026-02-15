from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_solve_returns_empty():
    grid = [
        ["A", "B", "C", "D"],
        ["E", "F", "G", "H"],
        ["I", "J", "K", "L"],
        ["M", "N", "O", "P"],
    ]
    r = client.post("/solve", json={"grid": grid, "size": 4})
    assert r.status_code == 200
    assert r.json() == {"paths": []}


def test_index_html_served():
    r = client.get("/index.html")
    assert r.status_code == 200
    assert "Word Hunt Solver" in r.text
