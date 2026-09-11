"""Deck Studio: one local server for the whole repo, with headless Claude Code behind it.

    uv run python -m server.main          # from studio/, serves ui/dist when built

The UI is a Vite app in `ui/`; in development run `npm run dev` there and it
proxies `/api` and `/ws` here.
"""
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from . import config
from . import agent as agents
from .api import agent, jobs, review, sessions


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await agents.stop_all()


app = FastAPI(title="Deck Studio", lifespan=lifespan)
for r in (sessions.router, review.router, jobs.router):
    app.include_router(r, prefix="/api")
app.include_router(agent.router)


@app.get("/api/health")
def health() -> dict:
    return {"repo": str(config.REPO_ROOT), "claude": config.CLAUDE_BIN}


if config.UI_DIST.is_dir():
    app.mount("/", StaticFiles(directory=config.UI_DIST, html=True), name="ui")


def run() -> None:
    uvicorn.run("server.main:app", host=config.HOST, port=config.PORT)


if __name__ == "__main__":
    run()
