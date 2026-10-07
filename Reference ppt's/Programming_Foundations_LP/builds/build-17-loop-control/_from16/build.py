#!/usr/bin/env python3
"""Build session 16, Nested Loops.

    python build.py

Writes the student view and the handout to out/ and copies both into
Plans/. The instructor guide is built separately from its content file,
because the approved guide is phase blocks with a sidebar, not a card list:

    python ~/.claude/skills/prog-lesson-plan/scripts/ig_build.py \
        ../../tools/guides/pf16_nested_loops.py
"""
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
SKILL = pathlib.Path.home() / ".claude" / "skills" / "prog-lesson-plan"
sys.path.insert(0, str(SKILL / "assets"))
from standard_slides import SPINE_CSS, SPINE_JS, file_names  # noqa: E402

import cards as C            # noqa: E402
import hook as H             # noqa: E402
import walk as WK            # noqa: E402
import why as WY             # noqa: E402
import worksheet as WS       # noqa: E402
from base_styles import BASE_CSS  # noqa: E402

OUT = HERE / "out"
SESSION = "16 - Nested Loops"
TITLE = "Nested Loops"
SHIP = (HERE / ".." / ".." / "Plans" / "Programming Foundations" / SESSION).resolve()
FILES = file_names(SESSION)

ONE_IDEA = (
    "The inner loop runs all the way through, from its first value to its "
    "last, on <b>every</b> pass of the outer loop. So a line inside both loops "
    "runs outer count times inner count, and the inner range can use the outer "
    "variable to make each pass a different length."
)

# The top bar is gone from the student view. Its buttons stay in the page,
# hidden, because the keyboard drives them: F clicks Full screen, A opens the
# grid, End reveals the card. Everything the bar reserved (48px of height, the
# card inset, the grid and the camera-safe overlay) is handed back.
NO_BAR_CSS = """
/* ---- student view: no top bar; F still goes full screen ---- */
body.present{--slide-h:100vh}
body.present .pbar{display:none}
body.present .slide,body.present .pcard{inset:0;top:0;right:0;bottom:0;left:0}
body.present .p-safe{top:0}
body.present .p-grid{inset:0;top:0;right:0;bottom:0;left:0}
"""

# id, kind, icon, heading, minutes, cards. One block per beat in work/beats.json.
BLOCKS = [
    ("b01", "concept", "📖", "Welcome", 1, [C.card_welcome]),
    ("b02", "concept", "🔁", "Recap", 1, [C.card_recap_title]),
    ("b03", "quiz", "🗳", "Recap: three string methods", 4, [C.card_recap]),
    ("b04", "hook", "🏏", "Hook: the Cricbuzz ball counter", 5, [C.card_hook]),
    ("b05", "concept", "🎯", "Today's topic", 1, [C.card_title]),
    ("b06", "concept", "🗺", "The plan", 1, [C.card_agenda]),
    ("b07", "concept", "🧱", "A loop inside a loop &middot; Slides 7, 9, 11", 4,
     [C.card_s7, C.card_s9, C.card_s11]),
    ("b08", "hook", "👁", "Follow both loops &middot; Slide 12", 4,
     [C.card_s12, C.card_explainer]),
    ("b09", "activity", "✍", "Worksheet task 1: trace it, then check it", 8,
     [C.card_task1]),
    ("b10", "activity", "🎛", "The loop counter machine", 5, [C.card_machine]),
    ("b11", "quiz", "📝", "Classroom quiz on the portal", 6, [C.card_quiz]),
    ("b12", "hook", "💻", "Why a loop inside a loop?", 5, [C.card_why]),
    ("b13", "concept", "🔺", "The question: a number triangle &middot; Slides 33, 34, 35", 3,
     [C.card_s33, C.card_s34, C.card_s35]),
    ("b14", "hands", "⌨", "Worksheet task 2: build it", 10, [C.card_task2]),
    ("b15", "activity", "🐛", "Worksheet task 3: two mistakes &middot; Slide 36", 5,
     [C.card_task3, C.card_s36]),
    ("b16", "concept", "🔀", "Any loop inside any loop &middot; Slides 37, 38, 39", 2,
     [C.card_s37, C.card_s38, C.card_s39]),
    ("b17", "exit", "🚪", "Exit: one question", 4, [C.card_exit]),
    ("b18", "buffer", "📌", "Key takeaways", 3, [C.card_takeaways]),
    ("b19", "buffer", "💬", "Feedback", 2, [C.card_feedback]),
    ("b20", "buffer", "👋", "Thank you", 1, [C.card_thankyou]),
]


def sub(doc, old, new, what):
    n = doc.count(old)
    assert n == 1, f"{what}: matched {n} times, expected 1"
    return doc.replace(old, new)


def block(bid, kind, icon, heading, mins, inner):
    return (f'<section class="block block-{kind}" id="{bid}" data-mins="{mins}">'
            f'<div class="block-head"><span class="block-icon" aria-hidden="true">'
            f'{icon}</span><h2>{heading}</h2></div>{inner}</section>')


def check_against_beats():
    beats = json.loads((HERE / "work" / "beats.json").read_text(encoding="utf-8"))["beats"]
    assert len(beats) == len(BLOCKS), f"{len(beats)} beats, {len(BLOCKS)} blocks"
    for b, blk in zip(beats, BLOCKS):
        assert b["mins"] == blk[4], (b["name"], b["mins"], blk[3], blk[4])
    assert sum(b[4] for b in BLOCKS) == 75


def main():
    check_against_beats()
    OUT.mkdir(exist_ok=True)
    css = (BASE_CSS + H.css() + WK.CSS + WY.css() + C.css() + NO_BAR_CSS
           + '\n.stage-poll[data-at="0"] .sl-head{display:none}\n')
    doc = (SKILL / "assets" / "plan-template.html").read_text(encoding="utf-8")
    doc = doc.replace("{{SESSION_TITLE}}", TITLE)
    doc = sub(doc, "{{EXTRA_CSS}}",
              css + SPINE_CSS.replace("position:absolute;inset:0;",
                                      "position:absolute;top:0;right:0;bottom:0;left:0;"),
              "extra css")
    doc = sub(doc, "{{EXTRA_JS}}", C.extra_js() + SPINE_JS, "extra js")
    doc = sub(doc, "{{ONE_IDEA}}", ONE_IDEA, "one idea")
    blocks = "".join(block(bid, k, ic, h, m, "".join(f() for f in cs))
                     for bid, k, ic, h, m, cs in BLOCKS)
    doc = sub(doc, "{{BLOCKS}}", blocks, "blocks")
    assert "{{" not in doc, "unfilled placeholder"

    n_cards = doc.count('<div class="slide">') + doc.count('<div class="pcard"')
    (OUT / FILES["student_view"]).write_text(doc, encoding="utf-8")
    (OUT / FILES["student_handout"]).write_text(WS.document(), encoding="utf-8")
    print(f"student view: {n_cards} cards, {len(BLOCKS)} blocks")

    SHIP.mkdir(parents=True, exist_ok=True)
    for key in ("student_view", "student_handout"):
        f = FILES[key]
        (SHIP / f).write_bytes((OUT / f).read_bytes())
        print(f"  {f:48s} {(OUT / f).stat().st_size / 1024:7.0f} KB")
    print(f"shipped to {SHIP}")


if __name__ == "__main__":
    main()
