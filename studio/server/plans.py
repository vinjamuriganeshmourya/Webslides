"""plan.md and the STATUS line that gates the pipeline.

The gate is one bold line near the top of the plan, in the form the workflow
fixes (`SLIDE_WORKFLOW.md`, stage 4): `**STATUS: AWAITING SIGN-OFF**` before
approval, `**STATUS: SIGNED OFF <date>**` after. Deck state is appended to the
same line with ` · `, which is what every existing plan already does
(`· GENERATED AND VERIFIED 2026-08-20`). `generate-slides` section 0 reads this
line, so the sign-off button here and the skill's gate agree by construction.
"""
from __future__ import annotations

import re
from datetime import date
from pathlib import Path

STATUS_RE = re.compile(r"\*\*STATUS:\s*(?P<body>.*?)\*\*", re.S)  # the bold can wrap onto a second line
SIGNED_RE = re.compile(r"\b(SIGNED OFF|APPROVED)\b")
UNSIGNED_RE = re.compile(r"NOT SIGNED OFF|AWAITING|DRAFT")
DECK_SIGNED = "DECK SIGNED OFF"


def read(path: Path) -> str | None:
    return path.read_text() if path.is_file() else None


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text if text.endswith("\n") else text + "\n")


def status(text: str | None) -> dict:
    """`signed` is about the plan; `deck_signed` about the deck built from it."""
    m = STATUS_RE.search(text or "")
    body = " ".join(m.group("body").split()) if m else ""
    plan_part = body.split("·")[0]  # deck state lives after the first dot
    signed = bool(SIGNED_RE.search(plan_part)) and not UNSIGNED_RE.search(plan_part)
    return {"line": body or None, "signed": signed, "deck_signed": DECK_SIGNED in body}


def set_status(text: str, body: str) -> str:
    """Replace the STATUS body, or add a STATUS line under the title if there is none."""
    if STATUS_RE.search(text):
        return STATUS_RE.sub(lambda _: f"**STATUS: {body}**", text, count=1)
    lines = text.split("\n")
    at = next((i for i, l in enumerate(lines) if l.startswith("# ")), -1) + 1
    lines[at:at] = ["", f"**STATUS: {body}**"]
    return "\n".join(lines)


def sign_off(path: Path) -> None:
    write(path, set_status(read(path) or "", f"SIGNED OFF {date.today()}"))


def reopen(path: Path) -> None:
    write(path, set_status(read(path) or "", "AWAITING SIGN-OFF"))


def sign_off_deck(path: Path) -> None:
    text = read(path) or ""
    body = status(text)["line"] or f"SIGNED OFF {date.today()}"
    write(path, set_status(text, f"{body} · {DECK_SIGNED} {date.today()}"))
