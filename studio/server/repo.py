"""What sessions exist and how far each has got through the pipeline.

A course is a directory. A session is a folder under `<course>/session_plans/`
(the plan) and, once generated, a sibling `<course>/<session>/` (the deck).
Nothing is listed by hand; both halves are found by looking, the same way
`review-app/lib/discover.mjs` does it.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

from . import agent, config, gates, plans, reviews

SAFE_NAME = re.compile(r"^[A-Za-z0-9_.-]+$")


@dataclass(frozen=True)
class Session:
    course: str
    name: str

    @property
    def course_dir(self) -> Path:
        return config.REPO_ROOT / self.course

    @property
    def plan_dir(self) -> Path:
        return self.course_dir / "session_plans" / self.name

    @property
    def plan_file(self) -> Path:
        return self.plan_dir / "plan.md"

    @property
    def tr_file(self) -> Path:
        return self.plan_dir / "tr.md"

    @property
    def meta_file(self) -> Path:
        return self.plan_dir / "studio.json"

    @property
    def deck_dir(self) -> Path:
        return self.course_dir / self.name

    @property
    def review_file(self) -> Path:
        return self.course_dir / "workflow" / "reviews" / f"{self.name}.review.md"

    def deck_config(self) -> dict | None:
        try:
            return json.loads((self.deck_dir / "deck.config.json").read_text())
        except (OSError, ValueError):
            return None

    def html_file(self) -> Path | None:
        cfg = self.deck_config() or {}
        return self.deck_dir / "dist-single" / f"{cfg['htmlName']}.html" if cfg.get("htmlName") else None

    def meta(self) -> dict:
        try:
            return json.loads(self.meta_file.read_text())
        except (OSError, ValueError):
            return {}

    def save_meta(self, **fields) -> None:
        self.plan_dir.mkdir(parents=True, exist_ok=True)
        self.meta_file.write_text(json.dumps({**self.meta(), **fields}, indent=2) + "\n")

    def claude_session_id(self) -> str | None:
        """The Claude Code conversation pinned to this session, kept in studio.json.
        Every terminal for this session resumes it, so a change request weeks later
        lands in the conversation that already knows the deck."""
        return self.meta().get("claude", {}).get("current")

    def pin_claude_session(self, sid: str) -> None:
        """Record the id Claude Code reported for this conversation."""
        claude = self.meta().get("claude", {"current": None, "history": []})
        self.save_meta(claude={**claude, "current": sid})

    def rotate_claude_session(self) -> None:
        """Move on to a fresh conversation; the old id stays on record in `history`."""
        claude = self.meta().get("claude", {"current": None, "history": []})
        history = claude["history"] + ([claude["current"]] if claude["current"] else [])
        self.save_meta(claude={"current": None, "history": history})


def _course_dirs() -> list[Path]:
    return sorted(
        d for d in config.REPO_ROOT.iterdir()
        if d.is_dir() and d.name not in config.SKIP_DIRS and not d.name.startswith(".")
    )


def list_sessions() -> list[Session]:
    out: list[Session] = []
    for course_dir in _course_dirs():
        names: set[str] = set()
        plans_dir = course_dir / "session_plans"
        if plans_dir.is_dir():
            names |= {p.name for p in plans_dir.iterdir() if p.is_dir()}
        names |= {d.name for d in course_dir.iterdir() if (d / "deck.config.json").is_file()}
        out += [Session(course_dir.name, n) for n in sorted(names)]
    return out


def find(course: str, name: str) -> Session | None:
    """Both names arrive from the network; anything that is not a plain name is refused."""
    if not (SAFE_NAME.match(course) and SAFE_NAME.match(name)):
        return None
    s = Session(course, name)
    return s if (s.plan_dir.is_dir() or s.deck_dir.is_dir()) else None


def create(course: str, name: str) -> Session:
    """A new session is a plan folder. A new course is the three folders CLAUDE.md names."""
    if not (SAFE_NAME.match(course) and SAFE_NAME.match(name)):
        raise ValueError("names may only contain letters, digits, . _ -")
    s = Session(course, name)
    for d in (s.plan_dir, s.course_dir / "workflow" / "reviews", s.course_dir / "workflow" / "captures"):
        d.mkdir(parents=True, exist_ok=True)
    return s


def _newest_mtime(root: Path) -> float:
    return max((p.stat().st_mtime for p in root.rglob("*") if p.is_file()), default=0.0)


def _mtime(path: Path | None) -> float | None:
    return path.stat().st_mtime if path and path.is_file() else None


def state(s: Session) -> dict:
    """Everything the UI needs to draw one session, derived from the files alone."""
    cfg = s.deck_config()
    plan_text = plans.read(s.plan_file)
    status = plans.status(plan_text)
    html = s.html_file()
    built = html is not None and html.is_file()
    st = {
        "course": s.course,
        "name": s.name,
        "title": (cfg or {}).get("title") or s.name,
        "tr": s.tr_file.is_file(),
        "plan": "missing" if plan_text is None else ("signed" if status["signed"] else "draft"),
        "statusLine": status["line"],
        "notes": s.meta().get("notes"),
        "deck": cfg is not None,
        "slideCount": (cfg or {}).get("slideCount"),
        "built": built,
        "buildStale": built and _newest_mtime(s.deck_dir / "src") > html.stat().st_mtime,
        "review": reviews.summary(s.review_file),
        "deckSigned": status["deck_signed"],
        "claudeSessionId": s.claude_session_id(),
        "claudeResumes": bool(s.claude_session_id()) and agent.transcript(s.claude_session_id()).is_file(),
        # mtimes, so the UI can reload a file the moment Claude Code rewrites it
        "planMtime": _mtime(s.plan_file),
        "reviewMtime": _mtime(s.review_file),
        "htmlMtime": _mtime(html),
    }
    st["allowed"] = gates.allowed(st)
    return st
