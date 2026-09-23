"""The assistant over a WebSocket: events out, prompts and answers in.

Server to browser: `history` on attach, then `init`, `status`, `user`, `delta`,
`text`, `tool_use`, `tool_result`, `ask`, `answered`, `result`, `error`, `log`.
Browser to server: `prompt` {text}, `answer` {id, allow, always, message, answers},
`interrupt`.
"""
import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from .. import agent, repo

router = APIRouter()


@router.websocket("/ws/agent/{course}/{name}")
async def agent_ws(ws: WebSocket, course: str, name: str) -> None:
    s = repo.find(course, name)
    if s is None:
        return await ws.close(code=4004)
    await ws.accept()
    a = await agent.get(f"{course}/{name}", s.claude_session_id(), s.pin_claude_session)
    queue = a.attach()
    await ws.send_json({"type": "history", "events": a.replay(), "status": a.status, "session_id": a.session_id})

    async def to_browser() -> None:
        while True:
            await ws.send_json(await queue.get())

    async def from_browser() -> None:
        while True:
            msg = await ws.receive_json()
            if msg["type"] == "prompt":
                await a.prompt(str(msg["text"]))
            elif msg["type"] == "answer":
                a.answer(str(msg["id"]), msg)
            elif msg["type"] == "interrupt":
                await a.interrupt()

    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(to_browser())
            tg.create_task(from_browser())
    except* (WebSocketDisconnect, RuntimeError):
        pass  # the browser went away, or a send raced the close
    finally:
        a.detach(queue)
