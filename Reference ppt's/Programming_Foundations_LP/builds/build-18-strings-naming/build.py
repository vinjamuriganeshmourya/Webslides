#!/usr/bin/env python3
"""Build session 18, Comparing Strings & Naming Variables.

    python build.py

Writes the student view and the handout to out/ and copies both into Plans/.
The instructor guide is built separately from its content file, because the
approved guide is phase blocks with a sidebar, not a card list:

    python ~/.claude/skills/prog-lesson-plan/scripts/ig_build.py \
        ../../tools/guides/pf18_comparing_strings_naming_variables.py
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
import why as WY             # noqa: E402
import worksheet as WS       # noqa: E402
from base_styles import BASE_CSS  # noqa: E402

OUT = HERE / "out"
SESSION = "18 - Comparing Strings & Naming Variables"
TITLE = "Comparing Strings & Naming Variables"
SHIP = (HERE / ".." / ".." / "Plans" / "Programming Foundations" / SESSION).resolve()
FILES = file_names(SESSION)

ONE_IDEA = (
    "Every character is stored as a number (<b>ord</b> gives it, <b>chr</b> goes "
    "back), so Python compares strings by those numbers, one pair of letters at a "
    "time, and the first different pair decides. A variable name uses only "
    "letters, digits and _, never starts with a digit, is never a keyword, and in "
    "Python is written in snake_case."
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
    ("b01", "quiz", "🔁", "Welcome, then the recap: one program, three words", 6,
     [C.card_welcome, C.card_recap_title, C.card_recap]),
    ("b04", "hook", "🔒", "Hook: the password that says wrong", 4, [C.card_hook]),
    ("b05", "concept", "🎯", "Today's topic, and the plan", 2,
     [C.card_title, C.card_agenda]),
    ("b07", "concept", "🔢", "Every character is a number: ord and chr &middot; Slides 8 to 12", 4,
     [C.card_s8, C.card_ord, C.card_chr]),
    ("b08", "concept", "🔤", "The ranges, and a loop that prints letters &middot; Slides 13, 14", 3,
     [C.card_s13, C.card_s14]),
    ("b09", "hands", "⌨", "Worksheet task 1: predict the letters, then run", 6,
     [C.card_task1]),
    ("b10", "concept", "⚖", "Python compares letter by letter &middot; Slide 19", 2,
     [C.card_s19]),
    ("b11", "hook", "👉", "Follow the pointer", 4, [C.card_explainer]),
    ("b12", "activity", "🎛", "Worksheet task 2: the comparison machine", 8,
     [C.card_machine]),
    ("b13", "quiz", "📝", "Classroom quiz on the portal", 6, [C.card_quiz]),
    ("b14", "hook", "📸", "Hook: the username Instagram refuses &middot; Slide 25", 4,
     [C.card_why, C.card_s25]),
    ("b15", "concept", "📏", "Four rules for a variable name &middot; Slides 27 to 35", 6,
     [C.card_rules, C.card_s35]),
    ("b16", "activity", "🗂", "Worksheet task 3: does Python accept this name?", 4,
     [C.card_classify]),
    ("b17", "concept", "🐍", "Case styles: Python uses snake case &middot; Slides 44 to 47", 2,
     [C.card_cases]),
    ("b18", "activity", "🏷", "Pick the best name &middot; Slides 48, 49", 2, [C.card_best]),
    ("b19", "hands", "🛠", "Worksheet task 4: fix the names, then run", 4, [C.card_task4]),
    ("b20", "exit", "🚪", "Exit: one question", 3, [C.card_exit]),
    ("b21", "buffer", "📌", "Key takeaways", 3, [C.card_takeaways]),
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
    # the cards are built first: their builders fill the CSS they need
    blocks = "".join(block(bid, k, ic, h, m, "".join(f() for f in cs))
                     for bid, k, ic, h, m, cs in BLOCKS)
    css = BASE_CSS + H.css() + WY.css() + C.css() + NO_BAR_CSS
    doc = (SKILL / "assets" / "plan-template.html").read_text(encoding="utf-8")
    doc = doc.replace("{{SESSION_TITLE}}", TITLE)
    doc = sub(doc, "{{EXTRA_CSS}}",
              css + SPINE_CSS.replace("position:absolute;inset:0;",
                                      "position:absolute;top:0;right:0;bottom:0;left:0;"),
              "extra css")
    doc = sub(doc, "{{EXTRA_JS}}", C.JS + SPINE_JS, "extra js")
    doc = sub(doc, "{{ONE_IDEA}}", ONE_IDEA, "one idea")
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
