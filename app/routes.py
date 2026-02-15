from fastapi import FastAPI

from app.models import SolveRequest, SolveResponse
from solver import solve_board


def register_routes(app: FastAPI):

    @app.get("/health")
    def health():
        return {"status": "ok"}

    @app.post("/solve", response_model=SolveResponse)
    def solve(request: SolveRequest):
        paths = solve_board(request.grid, request.size)
        return SolveResponse(paths=paths)
