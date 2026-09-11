"""Build and verification jobs, streamed as server-sent events."""
import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from .. import jobs
from .deps import get_session

router = APIRouter()


@router.get("/sessions/{course}/{name}/jobs/{job}")
async def run_job(course: str, name: str, job: str) -> StreamingResponse:
    s = get_session(course, name)
    if job not in jobs.JOBS:
        raise HTTPException(404, f"no job {job}; known: {', '.join(jobs.JOBS)}")
    if not s.deck_dir.is_dir():
        raise HTTPException(409, "this session has no deck directory yet")

    async def events():
        async for line in jobs.run(job, s.deck_dir):
            yield f"data: {json.dumps(line)}\n\n"

    return StreamingResponse(events(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-store"})
