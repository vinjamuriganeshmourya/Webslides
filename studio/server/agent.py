"""Headless Claude Code behind the UI.

One `Agent` per deck session wraps a `ClaudeSDKClient`, which runs the user's own
`claude` binary in its JSON mode, on the user's own login. Everything the model
says and does is relayed to every attached browser as small JSON events, and the
model's permission requests and clarifying questions become cards the person
answers in the browser. Nothing here calls the Anthropic API directly.
"""
from __future__ import annotations

import asyncio
import os
import re
import uuid
from pathlib import Path
from typing import Any, Callable

from claude_agent_sdk import ClaudeAgentOptions, ClaudeSDKClient
from claude_agent_sdk.types import (
    AssistantMessage, PermissionResultAllow, PermissionResultDeny, ResultMessage, StreamEvent,
    SystemMessage, TextBlock, ToolPermissionContext, ToolResultBlock, ToolUseBlock, UserMessage,
)

from . import config

# Tools that only read. Auto-approved, so the person is asked about writes and
# commands rather than about every file the model looks at.
READ_ONLY_TOOLS = ["Read", "Glob", "Grep", "WebFetch", "WebSearch", "Skill", "TodoWrite", "Task"]
HISTORY = 500       # events replayed to a browser that (re)attaches
RESULT_CHARS = 4000  # tool output shown per call

Event = dict[str, Any]


def transcript(session_id: str) -> Path:
    """Where Claude Code keeps a conversation: `<config>/projects/<encoded cwd>/<id>.jsonl`,
    the cwd encoded by replacing every non-alphanumeric character with `-`."""
    config_dir = Path(os.environ.get("CLAUDE_CONFIG_DIR") or Path.home() / ".claude")
    encoded = re.sub(r"[^A-Za-z0-9]", "-", str(config.REPO_ROOT))
    return config_dir / "projects" / encoded / f"{session_id}.jsonl"


def _text(content: Any) -> str:
    if isinstance(content, str):
        return content
    return "\n".join(part.get("text", "") for part in content or [] if isinstance(part, dict))


class Agent:
    def __init__(self, session_id: str | None, on_session_id: Callable[[str], None]):
        self.session_id = session_id
        self.on_session_id = on_session_id  # persists a newly minted id
        self.client: ClaudeSDKClient | None = None
        self.status = "idle"  # idle | working | waiting | stopped
        self.history: list[Event] = []
        self.listeners: set[asyncio.Queue[Event]] = set()
        self.pending: dict[str, asyncio.Future[dict]] = {}
        self.always: set[str] = set()  # tools approved for the rest of this conversation

    # ── fan-out to browsers ─────────────────────────────────────────────

    def attach(self) -> asyncio.Queue[Event]:
        q: asyncio.Queue[Event] = asyncio.Queue()
        self.listeners.add(q)
        return q

    def detach(self, q: asyncio.Queue[Event]) -> None:
        self.listeners.discard(q)

    def emit(self, event: Event) -> None:
        if event["type"] not in ("delta", "status"):
            self.history.append(event)
            del self.history[:-HISTORY]
        for q in self.listeners:
            q.put_nowait(event)

    def replay(self) -> list[Event]:
        """History for a browser that just attached: settled events, plus only the asks still open."""
        return [e for e in self.history if e["type"] != "ask" or e["id"] in self.pending]

    def set_status(self, status: str) -> None:
        self.status = status
        self.emit({"type": "status", "status": status})

    # ── lifecycle ───────────────────────────────────────────────────────

    async def start(self) -> None:
        resume = self.session_id if self.session_id and transcript(self.session_id).is_file() else None
        options = ClaudeAgentOptions(
            cwd=str(config.REPO_ROOT),
            cli_path=config.CLAUDE_BIN,
            resume=resume,
            setting_sources=["user", "project", "local"],  # CLAUDE.md, skills, and the user's own permission rules
            system_prompt={"type": "preset", "preset": "claude_code"},
            permission_mode="default",
            allowed_tools=READ_ONLY_TOOLS,
            can_use_tool=self._can_use_tool,
            include_partial_messages=True,
            stderr=lambda line: self.emit({"type": "log", "text": line}),
        )
        self.client = ClaudeSDKClient(options)
        await self.client.connect()
        asyncio.create_task(self._relay(self.client))
        self.set_status("idle")

    async def _relay(self, client: ClaudeSDKClient) -> None:
        try:
            async for message in client.receive_messages():
                for event in self._events(message):
                    self.emit(event)
        except Exception as e:  # the CLI died or the stream broke; the next prompt restarts it
            self.emit({"type": "error", "message": str(e)})
        finally:
            if self.client is client:
                self.client = None
                self.set_status("stopped")

    async def stop(self) -> None:
        client, self.client = self.client, None
        if client:
            await client.disconnect()
        for fut in self.pending.values():
            if not fut.done():
                fut.set_result({"allow": False, "message": "The conversation was closed"})

    # ── what the browser can do ─────────────────────────────────────────

    async def prompt(self, text: str) -> None:
        if self.client is None:
            await self.start()
        assert self.client is not None
        self.emit({"type": "user", "text": text})
        self.set_status("working")
        await self.client.query(text)

    def answer(self, ask_id: str, payload: dict) -> None:
        fut = self.pending.get(ask_id)
        if fut and not fut.done():
            fut.set_result(payload)

    async def interrupt(self) -> None:
        if self.client:
            await self.client.interrupt()

    # ── SDK messages → events ───────────────────────────────────────────

    def _events(self, msg: Any) -> list[Event]:
        if isinstance(msg, SystemMessage):
            if msg.subtype != "init":
                return []
            sid = msg.data.get("session_id")
            if sid and sid != self.session_id:
                self.session_id = sid
                self.on_session_id(sid)
            return [{"type": "init", "session_id": sid, "model": msg.data.get("model")}]

        if isinstance(msg, StreamEvent):
            ev = msg.event
            delta = ev.get("delta") or {}
            if ev.get("type") == "content_block_delta" and delta.get("type") == "text_delta":
                return [{"type": "delta", "text": delta["text"], "parent": msg.parent_tool_use_id}]
            return []

        if isinstance(msg, AssistantMessage):
            self.status = "working"
            out: list[Event] = []
            for block in msg.content:
                if isinstance(block, TextBlock) and block.text.strip():
                    out.append({"type": "text", "text": block.text, "parent": msg.parent_tool_use_id})
                elif isinstance(block, ToolUseBlock):
                    out.append({"type": "tool_use", "id": block.id, "name": block.name, "input": block.input,
                                "parent": msg.parent_tool_use_id})
            return out

        if isinstance(msg, UserMessage) and isinstance(msg.content, list):
            return [{"type": "tool_result", "tool_use_id": b.tool_use_id, "content": _text(b.content)[:RESULT_CHARS],
                     "is_error": bool(b.is_error), "parent": msg.parent_tool_use_id}
                    for b in msg.content if isinstance(b, ToolResultBlock)]

        if isinstance(msg, ResultMessage):
            self.status = "idle"
            return [{"type": "result", "subtype": msg.subtype, "turns": msg.num_turns, "duration_ms": msg.duration_ms,
                     "cost": msg.total_cost_usd, "is_error": msg.is_error},
                    {"type": "status", "status": "idle"}]
        return []

    # ── permission prompts and clarifying questions ─────────────────────

    async def _can_use_tool(self, tool_name: str, input_data: dict, context: ToolPermissionContext):
        if tool_name in self.always:
            return PermissionResultAllow(updated_input=input_data)
        ask_id = uuid.uuid4().hex[:8]
        self.pending[ask_id] = asyncio.get_running_loop().create_future()
        self.set_status("waiting")
        self.emit({"type": "ask", "id": ask_id, "tool": tool_name, "input": input_data,
                   "kind": "question" if tool_name == "AskUserQuestion" else "permission",
                   "description": context.description})
        try:
            answer = await self.pending[ask_id]
        finally:
            self.pending.pop(ask_id, None)
            self.emit({"type": "answered", "id": ask_id})
            self.set_status("working")

        if tool_name == "AskUserQuestion":
            return PermissionResultAllow(updated_input={"questions": input_data.get("questions", []),
                                                        "answers": answer.get("answers", {})})
        if answer.get("allow"):
            if answer.get("always"):
                self.always.add(tool_name)
            return PermissionResultAllow(updated_input=input_data)
        return PermissionResultDeny(message=answer.get("message") or "Denied in the studio")


_agents: dict[str, Agent] = {}


async def get(key: str, session_id: str | None, on_session_id: Callable[[str], None]) -> Agent:
    """The agent for one deck session, started on first use."""
    a = _agents.get(key)
    if a is None:
        a = _agents[key] = Agent(session_id, on_session_id)
        await a.start()
    return a


async def reset(key: str) -> None:
    """Forget the running conversation; the next attach starts a fresh one."""
    a = _agents.pop(key, None)
    if a:
        await a.stop()


async def stop_all() -> None:
    """On server shutdown: end every claude process rather than orphan it."""
    for key in list(_agents):
        await reset(key)
