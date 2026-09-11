"""Run a session's own scripts (build, harnesses) and stream their output.

Each deck is a standalone Vite app with its own node_modules, so a job runs
with the session directory as cwd and the session's own tooling. The studio
adds nothing to the command line; these are the commands CLAUDE.md lists.
"""
from __future__ import annotations

import asyncio
import os
from asyncio.subprocess import PIPE, STDOUT
from pathlib import Path
from typing import AsyncIterator

from . import config

JOBS: dict[str, list[str]] = {
    "install": ["npm", "install"],
    "typecheck": ["npm", "run", "typecheck"],
    "build": ["npm", "run", "build:html"],
    "video-safe": ["node", "video-safe.mjs"],
    "qa": ["node", "qa.mjs"],
    "preview": ["node", "preview.mjs"],
}


async def run(name: str, cwd: Path) -> AsyncIterator[str]:
    """Yield output lines as they arrive. The last line is always `exit <code>`."""
    env = {**os.environ, "CHROME_PATH": config.CHROME_PATH}
    proc = await asyncio.create_subprocess_exec(*JOBS[name], cwd=cwd, env=env, stdout=PIPE, stderr=STDOUT)
    assert proc.stdout is not None
    async for raw in proc.stdout:
        yield raw.decode(errors="replace").rstrip("\n")
    yield f"exit {await proc.wait()}"
