# Word Hunt Solver

A word hunt board visualizer and solver consisting of a single-file HTML frontend and a FastAPI Python backend.

## Project Structure

```
wordhunt/
├── wordhunt.html      # Frontend — single HTML/CSS/JS file, zero dependencies
├── server.py          # Backend — FastAPI app with boilerplate solver
├── requirements.txt   # Python deps: fastapi, uvicorn
└── DESCRIPTION.md     # This file
```

## What It Does

The user enters letters into an NxN grid (4×4 or 5×5) styled like a Word Hunt game board (wood-grain tiles, green background). Clicking "Solve" sends the grid to the backend, which returns word paths. The frontend draws those paths as colored SVG lines on the board and lists them in a side panel.

## Frontend (`wordhunt.html`)

### Board & Letter Input
- CSS grid of wood-styled tiles (CSS gradients, no images)
- Click a tile to select it — shows a flashing orange border (CSS blink animation)
- Type a letter → fills the tile and auto-advances the cursor left-to-right, top-to-bottom
- Backspace clears and retreats. Arrow keys navigate. Escape deselects.
- A hidden `<input>` off-screen captures keystrokes; visual state is on the tile `<div>`s

### Solver Integration
- Sends `POST /solve` to `API_URL` (default `http://localhost:8000`) with:
  ```json
  { "grid": [["O","A","T","R"], ["I","H","P","S"], ...], "size": 4 }
  ```
- Expects response:
  ```json
  {
    "paths": [
      {
        "tiles": [[0,0],[0,1],[1,1]],
        "brightness": 80,
        "color": "RED",
        "label": "OAH"
      }
    ]
  }
  ```
- Renders each path as an SVG `<polyline>` overlay between tile centers
- Shows path labels near the start of each line

### Path List (Right Panel)
- Each path shows: color swatch, label, word (derived from tile coords + grid), brightness
- Click a path to highlight it (thicker line + glow). Click again to unhighlight.

### Color System
Colors are an enum mapped to HSL hues:

| Color  | Hue |
|--------|-----|
| RED    | 0   |
| ORANGE | 30  |
| YELLOW | 55  |
| GREEN  | 120 |
| CYAN   | 180 |
| BLUE   | 220 |
| PURPLE | 275 |
| PINK   | 330 |

Lines render as `hsl(hue, 90%, brightness%)` where brightness is 1–100.

### Configuration
At the top of the `<script>`:
```js
const API_URL = 'http://localhost:8000';
```

## Backend (`server.py`)

### Tech
- **FastAPI** with CORS middleware (allows all origins for local dev)
- **Pydantic** models for request/response validation

### Models
```python
class Color(str, Enum):       # RED, ORANGE, YELLOW, GREEN, CYAN, BLUE, PURPLE, PINK
class SolveRequest(BaseModel): # grid: list[list[str]], size: int
class PathResult(BaseModel):   # tiles: list[list[int]], brightness: int, color: Color, label: str
class SolveResponse(BaseModel): # paths: list[PathResult]
```

### Endpoints
| Method | Path      | Description                              |
|--------|-----------|------------------------------------------|
| GET    | `/health` | Returns `{"status": "ok"}`               |
| POST   | `/solve`  | Accepts `SolveRequest`, returns `SolveResponse` |

### Solver Stub
The `solve_board(grid, size)` function in `server.py` currently returns an empty list. This is where you implement the actual word-finding algorithm (DFS/BFS over the grid with a dictionary).

## Running

```bash
cd wordhunt
pip install -r requirements.txt
uvicorn server:app --reload
```

Then open `wordhunt.html` in a browser (just double-click or `open wordhunt.html`).

## Key Implementation Notes

- The frontend has **no build step** and **no external dependencies** — just open the HTML file
- SVG coordinates are computed dynamically from tile DOM positions via `getBoundingClientRect()`
- The SVG re-renders on window resize
- The backend uses Pydantic validation, so malformed requests get automatic 422 errors
- The `solve_board()` return values directly control what the user sees — each `PathResult` becomes a line on the board
