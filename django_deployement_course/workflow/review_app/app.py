"""
NIAT Slide Workflow — content prep & slide-wise review, with Claude Code connected.

Flow (mirrors workflow/SLIDE_WORKFLOW.md):
  1. Prepare  — draft a slide-wise plan JSON from a TR doc (Claude Code drafts it)
  2. Review   — walk the plan slide by slide, approve / request changes, leave feedback
  3. Respond  — send a slide + its feedback to Claude Code (headless CLI) and get a
                proposed revision back; apply it to the plan (with backup) if accepted
  4. Summary  — sign-off readiness at a glance, export feedback

Run:  streamlit run app.py
"""
from __future__ import annotations

import io
import json
import shutil
import subprocess
import zipfile
from datetime import datetime
from pathlib import Path

import streamlit as st

# ---------------------------------------------------------------- paths
APP_DIR = Path(__file__).resolve().parent
WORKFLOW_DIR = APP_DIR.parent
PLANS_DIR = WORKFLOW_DIR / "plans"
REVIEWS_DIR = WORKFLOW_DIR / "reviews"
WORKFLOW_DOC = WORKFLOW_DIR / "SLIDE_WORKFLOW.md"
TEMPLATE_DIR = WORKFLOW_DIR.parent / "template"  # the web-slides deck project

REVIEWS_DIR.mkdir(exist_ok=True)

STATUS_OPTIONS = ["pending", "approved", "needs-changes"]
STATUS_BADGE = {"pending": "⏳ pending", "approved": "✅ approved", "needs-changes": "🔁 needs changes"}


# ---------------------------------------------------------------- helpers
def now() -> str:
    return datetime.now().isoformat(timespec="seconds")


def list_plans() -> list[Path]:
    return sorted(PLANS_DIR.glob("*.plan.json"))


def load_json(path: Path) -> dict:
    return json.loads(path.read_text())


def reviews_path(plan_path: Path) -> Path:
    return REVIEWS_DIR / (plan_path.stem.replace(".plan", "") + ".reviews.json")


def load_reviews(plan_path: Path) -> dict:
    p = reviews_path(plan_path)
    if p.exists():
        return load_json(p)
    return {"plan": str(plan_path), "updatedAt": None, "slides": {}}


def save_reviews(plan_path: Path, data: dict) -> None:
    data["updatedAt"] = now()
    reviews_path(plan_path).write_text(json.dumps(data, indent=2, ensure_ascii=False))


def slide_review(reviews: dict, slide_id: str) -> dict:
    return reviews["slides"].setdefault(
        slide_id, {"status": "pending", "feedback": [], "claudeResponses": []}
    )


def claude_available() -> bool:
    return shutil.which("claude") is not None


# Access levels for app-triggered Claude runs.
ACCESS_LEVELS = {
    "Respond only (no tools)": "none",
    "Read the repo (Read/Grep/Glob)": "read",
    "Full agent — skills, scripts, terminal": "full",
}
REPO_ROOT = WORKFLOW_DIR.parent  # the course root — project settings, skills, deck code


def run_claude(
    prompt: str,
    timeout: int = 300,
    access: str = "none",
    resume_id: str | None = None,
) -> tuple[bool, str, str | None]:
    """Run Claude Code headless and return (ok, response_text, session_id).

    access:
      none — pure text response; the prompt forbids tool use
      read — repo read access (Read/Grep/Glob), cwd = repo root
      full — everything: skills, scripts, terminal (permission checks bypassed)
    """
    cmd = ["claude", "-p", prompt, "--output-format", "json"]
    cwd = WORKFLOW_DIR
    if access == "read":
        cmd += ["--allowedTools", "Read", "Grep", "Glob"]
        cwd = REPO_ROOT
    elif access == "full":
        cmd += ["--dangerously-skip-permissions"]
        cwd = REPO_ROOT
    if resume_id:
        cmd += ["--resume", resume_id]
    try:
        proc = subprocess.run(
            cmd, capture_output=True, text=True, timeout=timeout, cwd=str(cwd)
        )
    except FileNotFoundError:
        return False, "claude CLI not found on PATH.", None
    except subprocess.TimeoutExpired:
        return False, f"Claude Code timed out after {timeout}s.", None
    if proc.returncode != 0:
        return False, (proc.stderr or proc.stdout or "claude exited non-zero").strip(), None
    try:
        payload = json.loads(proc.stdout)
        return True, str(payload.get("result", "")).strip(), payload.get("session_id")
    except json.JSONDecodeError:
        return True, proc.stdout.strip(), None


def extract_json_block(text: str) -> dict | None:
    """Pull the first ```json fenced block (or bare object) out of a response."""
    if "```json" in text:
        try:
            block = text.split("```json", 1)[1].split("```", 1)[0]
            return json.loads(block)
        except (json.JSONDecodeError, IndexError):
            return None
    # bare-object fallback
    start, end = text.find("{"), text.rfind("}")
    if start != -1 and end > start:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            return None
    return None


BASE_RULES = """Rules you must follow (from the team's slide workflow):
- Stay 100% faithful to the TR doc: no concepts, facts, or analogies beyond it.
- Visuals must depict the slide's concept; reuse only same-type fixtures.
- Professional tone: no emojis, no "Concept N" labels, no "mission" wording.
- Concise text: short bullets that carry the meaning; one idea per slide.
- Screenshots must be real, verified captures — never mockups."""

ACCESS_RULES = {
    "none": "- Do not use any tools; answer only from the context given in this prompt.",
    "read": (
        "- You may READ files in this repo (TR doc under 'Integration project/docs', deck code under "
        "'Web Slides/django_deployement_course/template', workflow under 'Web Slides/django_deployement_course/workflow') to ground your answer. Do not modify anything."
    ),
    "full": (
        "- You have full access: read/edit files, run terminal commands and scripts, and use your skills.\n"
        "- The deck lives in 'Web Slides/django_deployement_course/template' (npm run build to verify), plans in 'Web Slides/django_deployement_course/workflow/plans'.\n"
        "- Verify anything you change (typecheck/build) and end your reply with a clear summary of every file "
        "you touched and every command you ran."
    ),
}


def guardrails(access: str) -> str:
    return f"{BASE_RULES}\n{ACCESS_RULES.get(access, ACCESS_RULES['none'])}"


def build_deck_zip() -> tuple[bool, bytes | str]:
    """Build the deck (npm run build) and zip the HTML bundle from dist/."""
    if not (TEMPLATE_DIR / "package.json").is_file():
        return False, f"Deck project not found at {TEMPLATE_DIR}"
    try:
        proc = subprocess.run(
            ["npm", "run", "build"],
            cwd=str(TEMPLATE_DIR),
            capture_output=True,
            text=True,
            timeout=300,
        )
    except subprocess.TimeoutExpired:
        return False, "npm run build timed out after 300s."
    if proc.returncode != 0:
        return False, (proc.stderr or proc.stdout)[-1500:]

    dist = TEMPLATE_DIR / "dist"
    if not (dist / "index.html").is_file():
        return False, "Build finished but dist/index.html is missing."

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in dist.rglob("*"):
            if f.is_file():
                zf.write(f, f.relative_to(dist))
        zf.writestr(
            "README.txt",
            "NIAT session deck (HTML)\n"
            "========================\n"
            "Unzip, then serve the folder and open it in a browser:\n\n"
            "    python3 -m http.server 8080\n"
            "    ->  http://localhost:8080\n\n"
            "(Serving is required — asset paths are root-relative, so opening\n"
            "index.html directly from the file system won't load them.)\n",
        )
    return True, buf.getvalue()


def revision_prompt(
    session: dict, slide: dict, feedback_items: list[dict], tr_excerpt: str, access: str
) -> str:
    fb = "\n".join(f"- {f['text']}" for f in feedback_items) or "- (no written feedback; status set to needs-changes)"
    if access == "full":
        task = """Task: address the feedback end to end — you may directly update the plan JSON
(Web Slides/django_deployement_course/workflow/plans), the deck source (Web Slides/django_deployement_course/template/src), and any assets, then
verify with a build. Reply with:
1. What you changed and why (short).
2. The revised slide JSON in a ```json fenced block (same schema, same "n" and "id").
3. Files touched + commands run."""
    else:
        task = """Task: revise the slide spec to address the feedback while obeying every rule above.
Reply with:
1. A 2-4 line rationale of what you changed and why.
2. The complete revised slide JSON in a ```json fenced block (same schema, same "n" and "id")."""
    return f"""You are the slide-content assistant for NIAT session decks.

{guardrails(access)}

Session: {session.get('name')} · Course: {session.get('course')}
TR doc excerpt (source of truth):
---
{tr_excerpt}
---

Current slide spec (JSON):
```json
{json.dumps(slide, indent=2, ensure_ascii=False)}
```

Reviewer feedback on this slide:
{fb}

{task}
"""


def draft_plan_prompt(
    session_name: str, course: str, tr_doc_text: str, workflow_text: str, access: str = "none"
) -> str:
    return f"""You are the slide-planning assistant for NIAT session decks.

{guardrails(access)}

The team's workflow (follow its fixed frame — brand slide, welcome, Today's Agenda with at
most 4 concepts, per-concept dividers with topic-specific visuals, key takeaways echoing the
agenda in a different UI, then practice, feedback, thank-you):
---
{workflow_text}
---

TR doc (source of truth, use nothing beyond it):
---
{tr_doc_text}
---

Task: draft the slide-wise content plan for session "{session_name}" (course: {course}).
Reply with ONLY a ```json fenced block containing the full plan, using this schema:
{{"schemaVersion":"slide-plan/v1","workflow":{{"status":"AWAITING_SIGN_OFF","rev":1,"planNote":"...","generationBlockedUntilSignOff":true}},"session":{{"name":"...","course":"...","footerOnEverySlide":"...","trDoc":"...","nextUp":"..."}},"concepts":[...],"assets":[...],"slides":[{{"n":1,"id":"...","phase":"...","component":"...","title":"...","content":["..."],"visual":{{"asset":"...","why":"..."}},"transition":"...","sourceRef":"..."}}],"buildList":["..."]}}
"""


# ---------------------------------------------------------------- UI
st.set_page_config(page_title="NIAT Slide Workflow", page_icon="🗂️", layout="wide")

st.sidebar.title("NIAT Slide Workflow")
if claude_available():
    st.sidebar.success("Claude Code connected (`claude -p`)")
else:
    st.sidebar.error("Claude Code CLI not found — install/claude login first")

access_label = st.sidebar.selectbox("Claude access level", list(ACCESS_LEVELS.keys()), index=0)
ACCESS = ACCESS_LEVELS[access_label]
if ACCESS == "full":
    st.sidebar.warning(
        "Full agent: permission checks are bypassed — Claude can edit files, run "
        "terminal commands/scripts, and use skills without asking. Every run ends "
        "with a report of files touched and commands run."
    )
elif ACCESS == "read":
    st.sidebar.caption("Claude can read the repo (TR docs, deck code, workflow) — no writes.")
else:
    st.sidebar.caption("Claude answers from the prompt only — fast and side-effect-free.")

continue_session = st.sidebar.checkbox(
    "Continue previous Claude session",
    value=False,
    help="Reuses the last session for this plan so successive feedback rounds share context.",
)

plans = list_plans()
if not plans:
    st.sidebar.warning("No plan JSONs in workflow/plans yet — use the Prepare tab.")
plan_path = st.sidebar.selectbox(
    "Plan", plans, format_func=lambda p: p.stem.replace(".plan", "")
) if plans else None

plan = load_json(plan_path) if plan_path else None
reviews = load_reviews(plan_path) if plan_path else None

if plan:
    wf, sess = plan.get("workflow", {}), plan.get("session", {})
    st.sidebar.markdown(
        f"**{sess.get('name', '?')}**\n\n"
        f"{sess.get('course', '')}\n\n"
        f"Plan rev **{wf.get('rev', '?')}** · status **{wf.get('status', '?')}**"
    )
    n_slides = len(plan.get("slides", []))
    approved = sum(
        1 for s in plan.get("slides", [])
        if reviews["slides"].get(s["id"], {}).get("status") == "approved"
    )
    st.sidebar.progress(approved / n_slides if n_slides else 0.0, f"{approved}/{n_slides} slides approved")

tab_review, tab_prepare, tab_summary = st.tabs(["Review slides", "Prepare content", "Summary & export"])

# ---------------------------------------------------------------- Review tab
with tab_review:
    if not plan:
        st.info("Select or prepare a plan first.")
    else:
        slides = plan["slides"]
        ids = [f"{s['n']:02d} · {s['id']} — {s['title']}" for s in slides]
        if "slide_idx" not in st.session_state:
            st.session_state.slide_idx = 0

        nav1, nav2, nav3 = st.columns([1, 6, 1])
        with nav1:
            if st.button("◀ Prev", use_container_width=True, disabled=st.session_state.slide_idx == 0):
                st.session_state.slide_idx -= 1
                st.rerun()
        with nav3:
            if st.button("Next ▶", use_container_width=True, disabled=st.session_state.slide_idx >= len(slides) - 1):
                st.session_state.slide_idx += 1
                st.rerun()
        with nav2:
            picked = st.selectbox("Slide", ids, index=st.session_state.slide_idx, label_visibility="collapsed")
            st.session_state.slide_idx = ids.index(picked)

        slide = slides[st.session_state.slide_idx]
        rev = slide_review(reviews, slide["id"])

        left, right = st.columns([3, 2], gap="large")

        with left:
            st.subheader(f"{slide['n']:02d} · {slide['title']}")
            st.caption(f"phase **{slide.get('phase', '-')}** · component `{slide.get('component', '-')}` "
                       f"· transition `{slide.get('transition', 'slide')}` · source **{slide.get('sourceRef', '-')}**")
            st.markdown("**Content**")
            for line in slide.get("content", []):
                st.markdown(f"- {line}")
            v = slide.get("visual", {})
            st.markdown(f"**Visual** — `{v.get('asset', '-')}`")
            st.caption(f"why it fits: {v.get('why', '-')}")
            if slide.get("checkpoint"):
                st.caption(f"checkpoint: {slide['checkpoint']}")
            with st.expander("Raw slide JSON"):
                st.code(json.dumps(slide, indent=2, ensure_ascii=False), language="json")

        with right:
            st.markdown(f"**Review** — {STATUS_BADGE[rev['status']]}")
            status = st.radio(
                "Status", STATUS_OPTIONS, index=STATUS_OPTIONS.index(rev["status"]),
                horizontal=True, label_visibility="collapsed",
            )
            fb_text = st.text_area("Feedback for this slide", placeholder="What should change, and why?")
            c1, c2 = st.columns(2)
            with c1:
                if st.button("Save review", type="primary", use_container_width=True):
                    rev["status"] = status
                    if fb_text.strip():
                        rev["feedback"].append({"text": fb_text.strip(), "at": now()})
                    save_reviews(plan_path, reviews)
                    st.success("Saved.")
                    st.rerun()
            with c2:
                ask = st.button(
                    "Ask Claude to respond",
                    use_container_width=True,
                    disabled=not claude_available(),
                    help="Sends this slide + its feedback to Claude Code and returns a proposed revision.",
                )

            if rev["feedback"]:
                st.markdown("**Feedback history**")
                for f in reversed(rev["feedback"][-5:]):
                    st.caption(f"{f['at']} — {f['text']}")

            if ask:
                pending = rev["feedback"] + (
                    [{"text": fb_text.strip(), "at": now()}] if fb_text.strip() else []
                )
                tr_doc = Path(plan["session"].get("trDoc", "").split(" (")[0])
                candidates = [tr_doc, Path.home() / "django" / "Integration project" / "docs" / "session-1.md"]
                tr_excerpt = next(
                    (p.read_text()[:9000] for p in candidates if p.is_file()),
                    "(TR doc not found — judge only against the slide spec and rules)",
                )
                resume_id = reviews.get("claudeSessionId") if continue_session else None
                spin = "Claude Code is working (full agent — may edit & run commands)…" if ACCESS == "full" \
                    else "Claude Code is drafting a revision…"
                with st.spinner(spin):
                    ok, out, sid = run_claude(
                        revision_prompt(plan["session"], slide, pending, tr_excerpt, ACCESS),
                        timeout=900 if ACCESS == "full" else 300,
                        access=ACCESS,
                        resume_id=resume_id,
                    )
                if sid:
                    reviews["claudeSessionId"] = sid
                rev["claudeResponses"].append({"at": now(), "ok": ok, "access": ACCESS, "response": out})
                save_reviews(plan_path, reviews)
                st.rerun()

            if rev["claudeResponses"]:
                last = rev["claudeResponses"][-1]
                st.markdown(
                    f"**Claude's latest response** · {last['at']}"
                    + (f" · access `{last['access']}`" if last.get("access") else "")
                )
                if not last["ok"]:
                    st.error(last["response"])
                else:
                    st.markdown(last["response"])
                    revised = extract_json_block(last["response"])
                    if revised and revised.get("id") == slide["id"]:
                        if st.button("Apply this revision to the plan", type="secondary"):
                            backup = plan_path.with_suffix(f".bak-{datetime.now():%H%M%S}.json")
                            shutil.copy(plan_path, backup)
                            for i, s in enumerate(plan["slides"]):
                                if s["id"] == slide["id"]:
                                    plan["slides"][i] = revised
                            plan["workflow"]["planNote"] = (
                                f"Slide '{slide['id']}' revised via review app on {now()}. "
                                + plan["workflow"].get("planNote", "")
                            )
                            plan_path.write_text(json.dumps(plan, indent=2, ensure_ascii=False))
                            st.success(f"Applied. Backup: {backup.name}")
                            st.rerun()

# ---------------------------------------------------------------- Prepare tab
with tab_prepare:
    st.subheader("Draft a slide-wise plan from a TR doc")
    st.caption("Claude Code drafts the plan following SLIDE_WORKFLOW.md; it lands in workflow/plans as AWAITING_SIGN_OFF.")
    tr_path_str = st.text_input(
        "TR doc path",
        value=str(Path.home() / "django" / "Integration project" / "docs" / "session-1.md"),
    )
    pc1, pc2 = st.columns(2)
    with pc1:
        session_name = st.text_input("Session name", value="Client–Server & CORS")
    with pc2:
        course = st.text_input("Course", value="React + Django Integration")
    out_name = st.text_input("Output plan filename", value="draft-session.plan.json")

    if st.button("Draft plan with Claude Code", type="primary", disabled=not claude_available()):
        tr_p = Path(tr_path_str)
        if not tr_p.is_file():
            st.error(f"TR doc not found: {tr_p}")
        else:
            wf_text = WORKFLOW_DOC.read_text()[:6000] if WORKFLOW_DOC.is_file() else "(workflow doc missing)"
            with st.spinner("Claude Code is drafting the plan (this can take a few minutes)…"):
                ok, out, _sid = run_claude(
                    draft_plan_prompt(session_name, course, tr_p.read_text()[:14000], wf_text, ACCESS),
                    timeout=900,
                    access=ACCESS,
                )
            if not ok:
                st.error(out)
            else:
                drafted = extract_json_block(out)
                if not drafted or "slides" not in drafted:
                    st.error("Claude replied, but no valid plan JSON was found — raw response below.")
                    st.markdown(out)
                else:
                    dest = PLANS_DIR / out_name
                    dest.write_text(json.dumps(drafted, indent=2, ensure_ascii=False))
                    st.success(f"Draft plan written: {dest} — open it in the Review tab, then sign off.")

# ---------------------------------------------------------------- Summary tab
with tab_summary:
    if not plan:
        st.info("Select a plan first.")
    else:
        st.subheader("Sign-off readiness")
        rows = []
        for s in plan["slides"]:
            r = reviews["slides"].get(s["id"], {})
            rows.append(
                {
                    "n": s["n"],
                    "id": s["id"],
                    "title": s["title"],
                    "status": r.get("status", "pending"),
                    "feedback": len(r.get("feedback", [])),
                    "claude replies": len(r.get("claudeResponses", [])),
                }
            )
        st.dataframe(rows, use_container_width=True, hide_index=True)

        blockers = [r for r in rows if r["status"] != "approved"]
        if blockers:
            st.warning(f"{len(blockers)} slide(s) not yet approved — plan is not sign-off ready.")
        else:
            st.success("All slides approved — the plan is ready for sign-off (mark it SIGNED_OFF).")

        st.download_button(
            "Export feedback JSON",
            data=json.dumps(reviews, indent=2, ensure_ascii=False),
            file_name=reviews_path(plan_path).name,
            mime="application/json",
        )

        # ---- Deliver: the deck as an HTML bundle (unlocked once every slide is approved)
        st.divider()
        st.subheader("Deliver — download the deck as HTML")
        if blockers:
            st.info(
                f"Locked until every slide is approved ({len(blockers)} remaining). "
                "Finish the slide-wise review to unlock the HTML download."
            )
        else:
            if st.button("Build deck & prepare HTML download", type="primary"):
                with st.spinner("Building the deck (npm run build) and zipping the HTML bundle…"):
                    ok, payload = build_deck_zip()
                if ok:
                    st.session_state["deck_zip"] = payload
                    st.session_state["deck_zip_at"] = now()
                else:
                    st.error(payload)
            if st.session_state.get("deck_zip"):
                st.caption(f"Bundle built at {st.session_state['deck_zip_at']} — includes index.html, assets, and a README.")
                st.download_button(
                    "Download deck (HTML bundle, .zip)",
                    data=st.session_state["deck_zip"],
                    file_name=f"{plan_path.stem.replace('.plan', '')}-deck-html.zip",
                    mime="application/zip",
                )
