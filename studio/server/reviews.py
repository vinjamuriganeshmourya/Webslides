"""The review file, in the grammar the review app already writes.

    <course>/workflow/reviews/<session>.review.md

Both apps read this file and rewrite it whole, so the grammar here mirrors
`review-app/lib/reviewFile.mjs` line for line: slides keyed by id (never by
number), comments carrying a short id in an HTML comment, notes as indented
prose a person can reword by hand. Change one, change the other.
"""
from __future__ import annotations

import re
import secrets
from datetime import date, datetime
from pathlib import Path

STATUS_OF_MARK = {" ": "open", "x": "done", "~": "wont-fix"}
MARK_OF_STATUS = {v: k for k, v in STATUS_OF_MARK.items()}
VERDICTS = ("pending", "approved", "changes-requested")

SLIDE_RE = re.compile(r"^## Slide (\d+)(?: · (.+?))?\s*$")
ORPHAN_RE = re.compile(r"^### (.+?)\s*$")
VERDICT_RE = re.compile(r"^Verdict: (.+?)\s*$")
COMMENT_RE = re.compile(
    r"^- \[([ x~])\] \*\*(.+?)\*\*(?: · `([^`]+)`)?(?: · @(\d+),(\d+))?"
    r"(?:\s*<!--c:([a-z0-9]+)(?:@([\d-]+))?-->)?\s*$"
)
BODY_RE = re.compile(r"^ {6}(.*)$")
QUOTE_RE = re.compile(r'^> "(.*)"$')


def new_id() -> str:
    return secrets.token_hex(3)


def _slide(model: dict, sid: str, n: int | None = None) -> dict:
    return model["slides"].setdefault(sid, {"id": sid, "n": n, "verdict": "pending", "comments": []})


# ── parse ───────────────────────────────────────────────────────────────

def parse(text: str) -> dict:
    model: dict = {"slides": {}}
    slide = comment = None
    for raw in text.split("\n"):
        if m := SLIDE_RE.match(raw):
            slide = _slide(model, m.group(2) or f"#{m.group(1)}", int(m.group(1)))
            slide["n"] = int(m.group(1))
            comment = None
        elif m := ORPHAN_RE.match(raw):
            slide, comment = _slide(model, m.group(1)), None
        elif slide is None:
            continue
        elif m := VERDICT_RE.match(raw):
            verdict = re.sub(r"\s+", "-", m.group(1).strip())
            if verdict in VERDICTS:
                slide["verdict"] = verdict
            comment = None
        elif m := COMMENT_RE.match(raw):
            mark, component, loc, x, y, cid, created = m.groups()
            comment = {
                "id": cid or new_id(),
                "status": STATUS_OF_MARK[mark],
                "component": component,
                "loc": loc,
                "at": {"x": int(x), "y": int(y)} if x else None,
                "created": created or str(date.today()),
                "note": "",
                "quote": None,
            }
            slide["comments"].append(comment)
        elif (m := BODY_RE.match(raw)) and comment:
            line = m.group(1).strip()
            if q := QUOTE_RE.match(line):
                comment["quote"] = q.group(1)
            elif line:
                comment["note"] = f"{comment['note']}\n{line}".strip()
        elif not raw.strip():
            comment = None
    return model


# ── serialize ───────────────────────────────────────────────────────────

def _comment_lines(c: dict) -> list[str]:
    bits = [f"- [{MARK_OF_STATUS.get(c['status'], ' ')}] **{c['component']}**"]
    if c.get("loc"):
        bits.append(f"`{c['loc']}`")
    if c.get("at"):
        bits.append(f"@{round(c['at']['x'])},{round(c['at']['y'])}")
    lines = [f"{' · '.join(bits)} <!--c:{c['id']}@{c['created']}-->"]
    lines += [f"      {l.strip()}" for l in str(c.get("note") or "").split("\n") if l.strip()]
    if c.get("quote"):
        lines.append(f'      > "{str(c["quote"]).replace(chr(34), chr(39))}"')
    return lines


def count_open(model: dict) -> int:
    return sum(c["status"] == "open" for s in model["slides"].values() for c in s["comments"])


def _summary(model: dict, order: list[dict], total: int) -> str:
    ids = {e["id"] for e in order}
    in_deck = [s for s in model["slides"].values() if s["id"] in ids]
    approved = sum(s["verdict"] == "approved" for s in in_deck)
    changes = sum(s["verdict"] == "changes-requested" for s in in_deck)
    n = count_open(model)
    head = f"**{n} open comment{'' if n == 1 else 's'}.**" if n else "**No open comments.**"
    return f"{head} {approved} slide{'' if approved == 1 else 's'} approved, {changes} with changes requested, out of {total}."


def serialize(model: dict, meta: dict) -> str:
    """`meta` is the live deck: title, session, deck, total, and `order`, the slide
    ids as the running deck reports them. Numbers are taken from it, which is
    what keeps the file true after the deck is re-cut."""
    order = meta.get("order") or []
    total = meta.get("total") or len(order)
    out = [
        f"# Review · {meta['title']}", "",
        f"- session: `{meta['session']}`", f"- deck: `{meta['deck']}`",
        f"- slides: {total}", f"- updated: {datetime.now():%Y-%m-%d %H:%M}", "",
        "Written by the deck studio (`studio/`) and the review app (`review-app/`);",
        "either rewrites it whole. Reword a note freely; leave the `<!--c:id-->`",
        "markers alone, they are how the apps find the comment you clicked.", "",
        "Status: `[ ]` open · `[x]` done · `[~]` wont fix", "",
        _summary(model, order, total),
    ]
    seen: set[str] = set()
    for i, entry in enumerate(order):
        seen.add(entry["id"])
        slide = model["slides"].get(entry["id"])
        if not slide or (not slide["comments"] and slide["verdict"] == "pending"):
            continue
        out += ["", f"## Slide {entry.get('n') or slide.get('n') or i + 1} · {entry['id']}"]
        if entry.get("label"):
            out.append(f"<!-- {entry['label']} -->")
        out.append("")
        if slide["verdict"] != "pending":
            out += [f"Verdict: {slide['verdict'].replace('-', ' ')}", ""]
        for c in slide["comments"]:
            out += _comment_lines(c)

    orphans = [s for s in model["slides"].values()
               if s["id"] not in seen and (s["comments"] or s["verdict"] != "pending")]
    if orphans:
        out += ["", "## Not in the deck any more", "",
                "These slide ids carry comments but are no longer in the deck. Kept",
                "because a comment is often why the slide went."]
        for s in orphans:
            out += ["", f"### {s['id']}", ""]
            for c in s["comments"]:
                out += _comment_lines(c)
    return "\n".join(out) + "\n"


# ── disk ────────────────────────────────────────────────────────────────

def load(path: Path) -> dict:
    return parse(path.read_text()) if path.is_file() else {"slides": {}}


def save(path: Path, model: dict, meta: dict) -> None:
    if not meta.get("order"):  # no live deck to ask: keep the numbers we already have
        known = [s for s in model["slides"].values() if s["n"]]
        meta["order"] = [{"id": s["id"], "n": s["n"]} for s in sorted(known, key=lambda s: s["n"])]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(serialize(model, meta))


def summary(path: Path) -> dict:
    model = load(path)
    comments = [c for s in model["slides"].values() for c in s["comments"]]
    return {
        "open": sum(c["status"] == "open" for c in comments),
        "done": sum(c["status"] != "open" for c in comments),
        "total": len(comments),
        "approved": sum(s["verdict"] == "approved" for s in model["slides"].values()),
        "changes": sum(s["verdict"] == "changes-requested" for s in model["slides"].values()),
    }


# ── edits ───────────────────────────────────────────────────────────────

def add_comment(model: dict, sid: str, n: int | None, component: str, note: str) -> dict:
    comment = {"id": new_id(), "status": "open", "component": component or "slide", "loc": None,
               "at": None, "created": str(date.today()), "note": note.strip(), "quote": None}
    _slide(model, sid, n)["comments"].append(comment)
    return comment


def find_comment(model: dict, cid: str) -> tuple[dict, dict] | None:
    for slide in model["slides"].values():
        for c in slide["comments"]:
            if c["id"] == cid:
                return slide, c
    return None


def set_verdict(model: dict, sid: str, n: int | None, verdict: str) -> None:
    if verdict not in VERDICTS:
        raise ValueError(f"verdict must be one of {VERDICTS}")
    _slide(model, sid, n)["verdict"] = verdict
