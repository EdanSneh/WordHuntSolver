from app.models import SolveRequest, SolveResponse
from fastapi import FastAPI
from solver import BoardSolver


def register_routes(app: FastAPI):

    @app.get("/health")
    def health():
        return {"status": "ok"}

    @app.post("/solve", response_model=SolveResponse)
    def solve(request: SolveRequest):
        board_solver = BoardSolver(request.grid, request.size)
        # paths = BoardSolver.solve_board()
        return SolveResponse(paths=board_solver.rendered_results)
