#!/usr/bin/env python3
"""Build session 17, Loop Control Statements.

    python build.py

Writes the student view and the handout to out/ and copies both into Plans/.
The instructor guide is built separately from its content file, because the
approved guide is phase blocks with a sidebar, not a card list:

    python ~/.claude/skills/prog-lesson-plan/scripts/ig_build.py \
        ../../tools/guides/pf17_loop_control_statements.py
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
SESSION = "17 - Loop Control Statements"
TITLE = "Loop Control Statements"
SHIP = (HERE / ".." / ".." / "Plans" / "Programming Foundations" / SESSION).resolve()
FILES = file_names(SESSION)

ONE_IDEA = (
    "<b>break</b> leaves the loop now, and the code after the loop runs. "
    "<b>continue</b> skips the rest of this pass and goes back to the top for "
    "the next one. <b>pass</b> does nothing: it only fills a block that cannot "
    "be empty. break and continue work only inside a loop."
)

# The top bar is gone from the student view (session 16's rule). Its buttons
# stay in the page, hidden, because the keyboard drives them.
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
    ("b01", "quiz", "🐛", "Welcome, then the recap: the row that counts the wrong way", 6,
     [C.card_welcome, C.card_recap_title, C.card_recap]),
    ("b04", "hook", "📱", "Hook: the PIN that keeps asking", 4, [C.card_hook]),
    ("b05", "concept", "🎯", "Today's topic, and the plan", 2,
     [C.card_title, C.card_agenda]),
    ("b07", "concept", "🚪", "Control statements, then break &middot; Slides 14 to 17", 4,
     [C.card_intro, C.card_s15, C.card_s16, C.card_s17]),
    ("b08", "hook", "👁", "Follow the break", 3, [C.card_explainer]),
    ("b09", "concept", "⏹", "Break as the very first line &middot; Slides 31, 32", 2,
     [C.card_first_line]),
    ("b09b", "concept", "⛔", "Break works only inside a loop &middot; Slides 33, 34", 2,
     [C.card_outside]),
    ("b10", "concept", "🧱", "Break inside a nested loop &middot; Slide 35", 2,
     [C.card_s35]),
    ("b11", "activity", "✍", "Worksheet task 1: trace it, then check it", 8,
     [C.card_task1]),
    ("b13", "hands", "⌨", "Worksheet task 2: type it, then take the break out", 7,
     [C.card_task2]),
    ("b14", "quiz", "📝", "Classroom quiz on the portal", 6, [C.card_quiz]),
    ("b15", "hook", "🎞", "Hook: a reel you swipe away", 4, [C.card_why]),
    ("b16", "concept", "⏭", "Continue: skip the rest of this pass &middot; Slides 57 to 59", 3,
     [C.card_s57, C.card_s58, C.card_s59]),
    ("b17", "activity", "🎛", "The break or continue machine", 5, [C.card_machine]),
    ("b18", "concept", "🕳", "Pass: a block that does nothing &middot; Slides 75 to 78", 3,
     [C.card_s75, C.card_s76, C.card_s77, C.card_s78]),
    ("b19", "hands", "🔀", "Worksheet task 3: pass, continue or break &middot; Slide 84", 5,
     [C.card_s84, C.card_task3]),
    ("b20", "exit", "🚪", "Exit: one question", 3, [C.card_exit]),
    ("b21", "buffer", "📌", "Key takeaways", 4, [C.card_takeaways]),
    ("b22", "buffer", "💬", "Feedback and thank you", 2,
     [C.card_feedback, C.card_thankyou]),
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
    """Beats stay one per spine card (plan_shape needs them apart); blocks
    group the spine cards, so the check is that the minutes agree once the
    grouped beats are summed."""
    beats = json.loads((HERE / "work" / "beats.json").read_text(encoding="utf-8"))["beats"]
    per_card = []
    for bid, _k, _i, _h, mins, cards in BLOCKS:
        per_card.append((len(cards), mins))
    i = 0
    for n, mins in per_card:
        chunk = beats[i:i + n] if n > 1 and all("spine" in b or b.get("slides") for b in beats[i:i + n]) else None
        if n > 1 and sum(b["mins"] for b in beats[i:i + n]) == mins and len({b.get("spine") for b in beats[i:i + n]} - {None}) >= 2:
            i += n
        else:
            assert beats[i]["mins"] == mins, (beats[i]["name"], beats[i]["mins"], mins)
            i += 1
    assert i == len(beats), (i, len(beats))
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
        print(f"  {f:52s} {(OUT / f).stat().st_size / 1024:7.0f} KB")
    print(f"shipped to {SHIP}")


if __name__ == "__main__":
    main()
