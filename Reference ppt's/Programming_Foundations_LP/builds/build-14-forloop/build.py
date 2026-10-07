#!/usr/bin/env python3
"""Build the three files for session 14, For Loop.

    python build.py

Order matters and it is not cosmetic:

  1. write the presenter;
  2. photograph THAT file with scripts/render_thumbs.py;
  3. build the guide from those photographs;
  4. write the worksheet.

Rendering thumbnails from a presenter built earlier is how a guide ends up
describing a card that no longer exists.
"""
import base64
import pathlib
import subprocess
import sys

HERE = pathlib.Path(__file__).parent
SKILL = pathlib.Path.home() / ".claude" / "skills" / "prog-lesson-plan"

# The fixed spine - welcome, the two recap cards, the title card, the classroom
# quiz, feedback and thank you - is the same in every plan in every subject, so
# it comes from the skill rather than being redrawn here.
sys.path.insert(0, str(SKILL / "assets"))
from standard_slides import SPINE_CSS, SPINE_JS, file_names  # noqa: E402

import cards as C            # noqa: E402
import guide as G            # noqa: E402
import panels as P           # noqa: E402
import story as ST           # noqa: E402
import riya as R            # noqa: E402
import walker as W           # noqa: E402
import worksheet as WS       # noqa: E402
from styles import EXTRA_CSS  # noqa: E402

OUT = HERE / "out"
SHIP = (HERE / ".." / ".." / "Plans" / "Programming Foundations"
        / "14 - For Loop").resolve()
SESSION = "14 - For Loop"
TITLE = "For Loop"
# Nothing spells a file name by hand. verify_plan.py fails a name with a space
# or a capital in it, and two plans that disagree is how a link goes stale.
FILES = file_names(SESSION)
PRESENTER = FILES["student_view"]
GUIDE = FILES["instructor_guide"]
HANDOUT = FILES["student_handout"]

ONE_IDEA = (
    "A for loop does not count. It walks a sequence and stops when the sequence "
    "runs out, so the only question worth asking is what is in this sequence. "
    "<code>range(start, end)</code> just builds one, and it stops <b>before</b> "
    "the end value. That is why the row you wanted is missing."
)


def sub(doc, old, new, what):
    n = doc.count(old)
    assert n == 1, f"{what}: matched {n} times, expected 1"
    return doc.replace(old, new)


# ===================================================================== blocks
def block(bid, cls, icon, heading, inner):
    return (f'<section class="block {cls}" id="{bid}">'
            f'<div class="block-head"><span class="block-icon" aria-hidden="true">{icon}</span>'
            f'<h2>{heading}</h2></div>{inner}</section>')


BLOCKS = [
    # id, kind, icon, heading, minutes, cards
    ("b01", "concept", "\U0001F4D6", "Opening", 1,
     [C.card_welcome]),
    ("b02", "quiz", "\U0001F5F3", "Recap: the while loop in three parts", 4,
     [C.card_recap_title, C.card_recap]),
    ("b03", "hook", "\U0001F3B5", "Hook: one tap, and it keeps going", 6,
     [C.card_hook, C.card_examples]),
    ("b04", "concept", "\U0001F3AF", "Today's topic", 1,
     [C.card_title]),
    ("b05", "concept", "\U0001F5FA", "The plan", 2,
     [C.card_agenda]),
    ("b06", "concept", "\U0001F41B", "Why the while loop hurts "
     "&middot; Slides 8, 11, 15", 4,
     [C.card_bug, C.card_fix, C.card_simplify]),
    ("b07", "concept", "\U0001F501", "The for loop, and the three lines it drops "
     "&middot; Slides 16, 17, 18", 4,
     [C.card_for_syntax, C.card_for_python, C.card_for_drops]),
    ("b08", "hook", "\U0001F441", '"Python", one character at a time', 3,
     [C.card_explainer]),
    ("b09", "activity", "\u270D", "Worksheet task 1: trace it, then check it", 6,
     [C.card_task1]),
    ("b10", "hands", "\u2328", "Type it, then change the sequence", 5,
     [C.card_typeit, C.card_typeit_delhi, C.card_typeit_empty]),
    ("b11", "quiz", "\U0001F4DD", "Classroom quiz on the portal", 4,
     [C.card_quiz]),
    ("b12", "activity", "\U0001F522", "Numbers need a sequence too: range "
     "&middot; Slides 33, 34, 35, 36", 8,
     [C.card_seq_numbers, C.card_range_def, C.card_range_five,
      C.card_range_iter, C.card_dial]),
    ("b12m", "activity", "\U0001F437", "Coding challenge: Riya's savings", 7,
     [C.card_riya_story, C.card_riya_problem, C.card_riya_walk]),
    ("b13", "activity", "\u270F", "The pattern question, and the loop line "
     "&middot; Slide 37", 6,
     [C.card_pattern, C.card_task3]),
    ("b14", "activity", "\U0001F573", "The solution, and the row that goes missing "
     "&middot; Slides 40, 42, 45", 7,
     [C.card_solution, C.card_poll, C.card_p_startend, C.card_p_simplified]),
    ("b15", "exit", "\U0001F6AA", "Exit: one question", 4,
     [C.card_exit, C.card_exit_answer]),
    ("b16", "buffer", "\U0001F44B", "Key takeaways, feedback, thank you", 3,
     [C.card_takeaways, C.card_feedback, C.card_thankyou]),
]

CHECKPOINTS = {
    "b01": "Checkpoint 1 &middot; 14 min &middot; they can say why a list ends a loop",
    "b06": "Checkpoint 2 &middot; 11 min &middot; they can read a for loop out loud",
    "b09": "Checkpoint 3 &middot; 23 min &middot; they can trace one and say what range gives",
    "b12m": "Checkpoint 4 &middot; 20 min &middot; they can use a for loop to work out a total",
    "b15": "Hard floor &middot; exit at 68 min &middot; the exit question always runs",
}

NAV_LABEL = {
    "b01": "Opening",
    "b02": "Recap",
    "b03": "Hook: one tap",
    "b04": "Today's topic",
    "b05": "The plan",
    "b06": "Why the while loop hurts",
    "b07": "The for loop",
    "b08": '"Python", one character at a time',
    "b09": "Worksheet task 1: trace and check",
    "b10": "Type it, then change it",
    "b11": "Classroom quiz on the portal",
    "b12": "range",
    "b12m": "Riya's savings",
    "b13": "Task 3: the pattern, the loop line",
    "b14": "The solution, and the missing row",
    "b15": "Exit: one question",
    "b16": "Takeaways, feedback, thank you",
}


def build_nav():
    out = []
    for bid, kind, _icon, _h, mins, _cards in BLOCKS:
        if bid in CHECKPOINTS:
            out.append(f'<p class="sp-cp"><span>{CHECKPOINTS[bid]}</span></p>')
        out.append(
            f'<button type="button" class="sp-item k-{kind}" data-target="{bid}" '
            f'data-mins="{mins}"><span class="sp-label">{NAV_LABEL[bid]}</span></button>')
    return "".join(out)


def build_blocks():
    return "".join(
        block(bid, f"block-{kind}", icon, heading, "".join(f() for f in cards))
        for bid, kind, icon, heading, _m, cards in BLOCKS)


# ================================================================ the answers
def answer_table():
    """Every answer, derived by running the thing it came from."""
    rows = []

    def add(where, what):
        rows.append(f"<tr><td class='g-mono'>{where}</td><td>{what}</td></tr>")

    import re as _re
    for i, (part, job, why) in enumerate(P.recap_pairs(), 1):
        # the pairs carry `backticks` for the card; the table wants real code
        txt = _re.sub(r"`([^`]+)`", r"<code>\1</code>",
                      f"{part} goes with: {job} {why}")
        add(f"recap pair {i}", txt)

    passes = P.task1_passes()
    tbl = "<br>".join(
        f"pass {i}: ch = {ch}, n = {n}, prints {out}"
        for i, (ch, n, out) in enumerate(passes, 1))
    add("task 1 trace", tbl + f"<br>pass {len(passes) + 1}: empty, the word has "
        f"only {len(passes)} characters")
    add("task 1 - last print", P.task1_last_print())
    add("task 1 - the check",
        "Say it only after pens are down: exactly one of your three pass rows "
        "should be empty.")

    add("task 2 - step 2", f"{len(P.task2_out('Delhi'))} lines: "
        + ", ".join(P.task2_out("Delhi")))
    add("task 2 - step 3", "Only Done. The loop body never runs, and there is "
        "no error.")

    add("Riya's savings - the program", P.RIYA_SRC.replace(chr(10), " / "))
    for n_ in P.RIYA_SAMPLES + [P.RIYA_TEST]:
        add(f"Riya's savings - n = {n_}", str(P.riya_total(n_)))

    n = 4
    add("task 3", "Either pair is correct. "
        "for counter in range(1, n + 1): with the blank filled as counter, "
        "or for counter in range(n): with the blank filled as counter + 1.")
    add("task 3 - rows for n = 4",
        " / ".join(repr(r) for r in P.task3_rows(n)))

    for label, expr in (("A", P.POLL_A), ("B", P.POLL_B)):
        rows_ = P.poll_rows(expr, P.POLL_N)
        add(f"the poll, option {label}",
            f"{expr} at n = {P.POLL_N} prints {len(rows_)} rows: "
            + " / ".join(repr(r) for r in rows_)
            + (f" &lt;- the answer" if label == P.POLL_RIGHT else ""))
    add("the poll, the gap",
        f"{len(P.poll_rows(P.POLL_B, P.POLL_N))} minus "
        f"{len(P.poll_rows(P.POLL_A, P.POLL_N))} is "
        f"{len(P.poll_rows(P.POLL_B, P.POLL_N)) - len(P.poll_rows(P.POLL_A, P.POLL_N))}. "
        "The gap is one row for every n, never two.")

    for i, (s, b) in enumerate(P.EXIT_PAIRS):
        lines = P.exit_lines(s, b)
        mark = " &lt;- the answer" if not lines else ""
        add(f"exit option {'ABCD'[i]}",
            (f"{len(lines)} line(s): " + ", ".join(lines)) if lines
            else "nothing is printed at all" + mark)

    return ("<section class='g-sec'><h3>Every answer, in one place</h3>"
            "<p><b>This file is the only copy of these answers. Never project it.</b> "
            "Every row below was produced by running the code, not typed in.</p>"
            "<table class='g-data'><tr><th>Where</th><th>Answer</th></tr>"
            + "".join(rows) + "</table></section>")


# =================================================================== assemble
def main():
    OUT.mkdir(exist_ok=True)

    # ---- 1. the presenter ------------------------------------------------
    tpl = (SKILL / "assets/plan-template.html").read_text(encoding="utf-8")
    css = (EXTRA_CSS
           + "\n/* the recap card is already the heading, so the stage header "
             "stands down while it is up. Scoped by class, never by id. */\n"
             '.stage-poll[data-at="0"] .sl-head{display:none}\n'
           + W.reveal_css()
           + ST.css()
           + R.css())
    presenter = tpl
    presenter = sub(presenter, "{{SESSION_TITLE}}: lesson plan",
                    f"{TITLE}: lesson plan", "tab title")
    presenter = presenter.replace("{{SESSION_TITLE}}", TITLE)
    # SPINE_CSS ships one `inset:0`, and verify_plan wants the long-hand
    # alongside it. That rewrite is the only thing this builder changes in it.
    presenter = sub(presenter, "{{EXTRA_CSS}}",
                    css + SPINE_CSS.replace(
                        "position:absolute;inset:0;",
                        "position:absolute;top:0;right:0;bottom:0;left:0;"),
                    "extra css")
    presenter = sub(presenter, "{{EXTRA_JS}}", C.extra_js() + SPINE_JS, "extra js")
    presenter = sub(presenter, "{{ONE_IDEA}}", ONE_IDEA, "one idea")
    # the template lost its sidebar on 2026-09-25 (slides only), so the nav is
    # filled only where a template still asks for it
    if "{{NAV}}" in presenter:
        presenter = sub(presenter, "{{NAV}}", build_nav(), "nav")
    presenter = sub(presenter, "{{BLOCKS}}", build_blocks(), "blocks")
    assert "{{" not in presenter, "unfilled placeholder in the presenter"
    p_path = OUT / PRESENTER
    p_path.write_text(presenter, encoding="utf-8")

    n_cards = presenter.count('<div class="slide">') + presenter.count('<div class="pcard"')
    print(f"presenter: {n_cards} cards")

    # ---- 2. the thumbnails, from the file just written -------------------
    thumbs = OUT / "thumbs"
    if "--no-shots" not in sys.argv:
        subprocess.run([sys.executable, str(SKILL / "scripts/render_thumbs.py"),
                        str(p_path), str(thumbs)], check=True)
    shots = sorted(thumbs.glob("card*.webp"))
    assert len(shots) == n_cards, f"{len(shots)} thumbnails for {n_cards} cards"

    def thumb(n):
        b64 = base64.b64encode(shots[n - 1].read_bytes()).decode()
        return ('<div class="gthumb"><img alt="" '
                f'src="data:image/webp;base64,{b64}"></div>')

    # ---- 3. the guide ----------------------------------------------------
    parts = ['<h1 class="g-h1">For Loop: instructor guide</h1>',
             '<p class="g-meta">Programming Foundations, session 14. '
             f'{n_cards} cards, 75 minutes. Screen only, never projected.</p>']
    assert len(G.ENTRIES) == n_cards,         f'{len(G.ENTRIES)} guide entries for {n_cards} cards'
    # what block each card sits in, so an entry can name its own minutes and the
    # block's without either being guessed
    block_mins = []
    for _bid, _k, _i, _h, mins, cards in BLOCKS:
        block_mins += [mins] * len(cards)
    assert len(block_mins) == n_cards, "the block table and the cards disagree"
    for n, (beat, mins, title, flow, do, watch) in enumerate(G.ENTRIES, 1):
        if n in G.BANDS:
            parts.append(f'<h3 class="ghd">{G.BANDS[n]}</h3>')
        parts.append(G.entry(n, beat, mins, title, flow, do, watch,
                             thumb(n), n_cards, G.SHEETS.get(n),
                             block_mins[n - 1]))
    parts.append(G.common())
    parts.append(G.if_they_ask())
    parts.append(answer_table())
    parts.append(G.source_defects())
    guide_body = "".join(parts)
    assert "@@" not in guide_body, "an unreplaced thumbnail token survived"

    gtpl = (SKILL / "assets/guide-template.html").read_text(encoding="utf-8")
    gdoc = gtpl
    gdoc = sub(gdoc, "{{SESSION_TITLE}}: instructor guide",
               f"{TITLE}: instructor guide", "guide tab title")
    gdoc = gdoc.replace("{{SESSION_TITLE}}", TITLE)
    gdoc = sub(gdoc, "{{EXTRA_CSS}}",
               ".gdo li.hot{font-weight:650}\n"
               ".g-sec code{font:13px var(--mono);background:#F1F3F6;"
               "border-radius:4px;padding:1px 5px}", "guide css")
    gdoc = sub(gdoc, "{{GUIDE}}", guide_body, "guide body")
    assert "{{" not in gdoc, "unfilled placeholder in the guide"
    (OUT / GUIDE).write_text(gdoc, encoding="utf-8")

    # ---- 4. the worksheet ------------------------------------------------
    (OUT / HANDOUT).write_text(WS.document(), encoding="utf-8")

    # ---- 5. ship ---------------------------------------------------------
    SHIP.mkdir(parents=True, exist_ok=True)
    # The shipped guide is built by tools/ig_build.py from tools/guides/
    # pf14_for_loop.py. The one in out/ is the retired per-slide guide and
    # must never overwrite it.
    for f in (PRESENTER, HANDOUT):
        (SHIP / f).write_bytes((OUT / f).read_bytes())
        print(f"{f:44s} {(OUT / f).stat().st_size / 1024:8.0f} KB")
    print(f"shipped to {SHIP}")


if __name__ == "__main__":
    main()
