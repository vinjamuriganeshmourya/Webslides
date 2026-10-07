#!/usr/bin/env python3
"""Build the three files for session 15, String Methods.

    python build.py
    python build.py --no-shots      reuse out/thumbs/

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
import method as ME          # noqa: E402
import takeaways as TK       # noqa: E402
import why as WY             # noqa: E402
import panels as P           # noqa: E402
import slicing as SL         # noqa: E402
import walker as W           # noqa: E402
import worksheet as WS       # noqa: E402
from styles import EXTRA_CSS  # noqa: E402

OUT = HERE / "out"
SHIP = (HERE / ".." / ".." / "Plans" / "Programming Foundations"
        / "15 - String Methods").resolve()
SESSION = "15 - String Methods"
TITLE = "String Methods"
# Nothing spells a file name by hand. verify_plan.py fails a name with a space
# or a capital in it, and two plans that disagree is how a link goes stale.
FILES = file_names(SESSION)
PRESENTER = FILES["student_view"]
GUIDE = FILES["instructor_guide"]
HANDOUT = FILES["student_handout"]

ONE_IDEA = (
    "A string method never changes your string. It hands you back a new one, "
    "and the only thing you have to get right is <b>where it stops</b>. "
    "<code>[start:end:step]</code> stops before <code>end</code>; "
    "<code>strip</code> works in from each end and stops at the first "
    "character that is not in the set, so anything in the middle is never "
    "even looked at."
)


def sub(doc, old, new, what):
    n = doc.count(old)
    assert n == 1, f"{what}: matched {n} times, expected 1"
    return doc.replace(old, new)


# ===================================================================== blocks
def block(bid, cls, icon, heading, inner):
    return (f'<section class="block {cls}" id="{bid}">'
            f'<div class="block-head">'
            f'<span class="block-icon" aria-hidden="true">{icon}</span>'
            f'<h2>{heading}</h2></div>{inner}</section>')


BLOCKS = [
    # id, kind, icon, heading, minutes, cards
    ("b01", "concept", "📖", "Opening", 1,
     [C.card_welcome]),
    ("b02", "quiz", "🗳", "Recap: what range(2, 6) hands you", 4,
     [C.card_recap_title, C.card_recap]),
    ("b03", "hook", "💬", "Hook: the message the search cannot find",
     4, [C.card_hook]),
    ("b04", "concept", "🗺", "Today's topic, and the plan", 2,
     [C.card_title, C.card_agenda]),
    ("b05", "concept", "✂", "From one character to four", 3,
     [C.card_pull]),
    # 6 minutes, not 5. The quiz has to sit past 38% of the session and the
    # slicing half is everything before it, so a minute taken out of here
    # comes straight off the join.
    ("b06", "concept", "🔢", "The one it cannot cut, and the step "
     "that can &middot; Slides 13, 15", 6,
     [C.card_slice_stuck, C.card_step_syntax, C.card_jump]),
    ("b07", "activity", "🎛", "Worksheet task 1, then the slice "
     "machine", 5, [C.card_machine]),
    ("b08", "hands", "⌨", "Type it, then change the step", 4,
     [C.card_typeit]),
    # everything before this card is slicing; everything after it is methods
    ("b09", "quiz", "📝", "Classroom quiz on the portal", 5,
     [C.card_quiz]),
    # the second half opens on the reason it exists, not on a method name
    ("b10", "hook", "📱", "Why a string method at all?", 5,
     [C.card_why]),
    ("b11", "concept", "🧮", "isdigit: the line, then what it does", 3,
     [C.card_isdigit]),
    ("b12", "concept", "🔎", "Two numbers that are not equal, and "
     "strip &middot; Slide 30", 4,
     [C.card_notequal, C.card_strip]),
    ("b13", "hook", "👁", "Follow the strip", 3,
     [C.card_explainer]),
    ("b14", "concept", "📍", "The dot it keeps, and a set rather than "
     "a word &middot; Slides 35, 36", 2,
     [C.card_innerdot, C.card_set]),
    ("b15", "activity", "📋", "Worksheet task 3: trace it, then "
     "check it", 4, [C.card_task3]),
    ("b16", "concept", "🔁", "replace, every one of them "
     "&middot; Slide 38", 3,
     [C.card_replace_scene, C.card_replace]),
    ("b17", "activity", "✏", "startswith, and you write endswith", 5,
     [C.card_startswith, C.card_endswith]),
    ("b18", "concept", "🔠", "upper, and lower is its mirror", 2,
     [C.card_upper]),
    ("b19", "exit", "🚪", "Exit: one question", 4, [C.card_exit]),
    # 6 minutes. Two boards at two minutes each plus the two closing cards:
    # five would mean reading the method board in under a minute, and the rule
    # that closes the session is on its last press.
    ("b20", "buffer", "🗺", "Key takeaways, then feedback and thank "
     "you", 6, [C.card_tk_slice, C.card_tk_method, C.card_feedback,
                C.card_thankyou]),
]

CHECKPOINTS = {
    "b01": "Checkpoint 1 &middot; 11 min &middot; they can read an index off "
           "a string",
    "b05": "Checkpoint 2 &middot; 17 min &middot; they can say where a step "
           "lands",
    "b09": "Checkpoint 3 &middot; 14 min &middot; they can say why a method "
           "beats the loop",
    "b12": "Checkpoint 4 &middot; 14 min &middot; they can say where strip "
           "stops",
    "b16": "Checkpoint 5 &middot; 10 min &middot; they can pick the right "
           "method for a job",
    "b19": "Hard floor &middot; exit at 66 min &middot; the exit question "
           "always runs",
}

NAV_LABEL = {
    "b01": "Opening",
    "b02": "Recap",
    "b03": "Hook: the message",
    "b04": "Topic, and the plan",
    "b05": "One character, then four",
    "b06": "The step, and where it lands",
    "b07": "Task 1, then the machine",
    "b08": "Type it, then change the step",
    "b09": "Classroom quiz on the portal",
    "b10": "Why a string method at all?",
    "b11": "isdigit",
    "b12": "Not equal, and strip",
    "b13": "Follow the strip",
    "b14": "The dot, and a set",
    "b15": "Task 3: trace and check",
    "b16": "replace",
    "b17": "startswith, and endswith",
    "b18": "upper and lower",
    "b19": "Exit: one question",
    "b20": "Takeaways, feedback, thank you",
}


def build_nav():
    out = []
    for bid, kind, _icon, _h, mins, _cards in BLOCKS:
        if bid in CHECKPOINTS:
            out.append(f'<p class="sp-cp"><span>{CHECKPOINTS[bid]}</span></p>')
        out.append(
            f'<button type="button" class="sp-item k-{kind}" '
            f'data-target="{bid}" data-mins="{mins}">'
            f'<span class="sp-label">{NAV_LABEL[bid]}</span></button>')
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

    seq = P.recap_seq()
    add("recap", "range(2, 6) gives "
        + ", ".join(str(n) for n in seq)
        + f". In the sequence: {', '.join(str(n) for n in P.RECAP_NUMS if n in seq)}"
        + f". Not in it: {', '.join(str(n) for n in P.RECAP_NUMS if n not in seq)}.")

    add("hook, press 2", f"{P.HOOK_MSG!r} is {len(P.HOOK_MSG)} characters, "
        f"not {len(P.HOOK_WORD)}. The letters sit at "
        + ", ".join(str(i) for i in P.hook_letter_positions())
        + f". The search finds nothing because {P.HOOK_WORD!r} is not inside "
        f"it: {P.hook_search_hits()}.")
    add("hook, press 3", f"A run of {P.HOOK_RUN[1] - P.HOOK_RUN[0]} from index "
        f"{P.HOOK_RUN[0]} gives {P.hook_run_out()!r}, spaces and all.")
    add("hook, press 4", "Jumping two at a time from index "
        f"{P.HOOK_JUMP[0]} lands on "
        + ", ".join(str(i) for i in P.hook_letter_positions())
        + f" and gives {P.hook_jump_out()!r}.")

    add("slicing, the pull-out card",
        f"{P.PULL_SRC!r}[{P.PULL_SLICE[0]}:{P.PULL_SLICE[1]}] is "
        f"{P.pull_out()!r}, from boxes "
        + ", ".join(str(i) for i in P.pull_indexes())
        + f". Box {P.PULL_SLICE[1]} is drawn and never reached.")
    add("slicing, the jump card",
        f"{P.JUMP_SRC!r}[{P.JUMP_SLICE[0]}:{P.JUMP_SLICE[1]}:"
        f"{P.JUMP_SLICE[2]}] is {P.jump_out()!r}, landing on "
        + ", ".join(str(i) for i in P.jump_landings())
        + ". It never looks at "
        + ", ".join(str(i) for i in P.jump_untouched()) + ".")

    add("why a method, the long program",
        f"It prints {P.why_long_out()}, which is the same answer as "
        f"{P.WHY_BAD!r}.isdigit() ({P.why_short_out()}). "
        f"{P.why_lines()[0]} lines and {P.why_checks()} comparisons, against "
        f"{P.why_lines()[1]} lines for the method. The character that is not "
        f"a digit is at index {P.why_bad_index()[0]}.")

    add("isdigit card, press 2",
        f"{P.ISDIGIT_PIN!r}.isdigit() is {P.isdigit_out(P.ISDIGIT_PIN)}. "
        "Every character is a digit.")
    add("isdigit card, press 4",
        f"{P.ISDIGIT_BAD!r}.isdigit() is {P.isdigit_out(P.ISDIGIT_BAD)}. "
        f"The last character is {P.ISDIGIT_BAD[-1]!r}.")
    add("strip card, press 2",
        f"{P.STRIP_RAW!r}.strip() is {P.strip_out()!r}. "
        f"{len(P.STRIP_RAW)} characters in, {len(P.strip_out())} out.")
    add("replace card, press 2",
        f"{P.REPLACE_RAW!r}.replace({P.REPLACE_OLD!r}, {P.REPLACE_NEW!r}) is "
        f"{P.replace_out()!r}. Both of them: {P.replace_hits()} changed.")
    add("startswith card, press 2",
        f"{P.STARTS_RAW!r}.startswith({P.STARTS_PRE!r}) is {P.starts_out()}. "
        f"With {P.STARTS_OTHER!r} it is {P.starts_other()}.")
    add("upper card, presses 2 and 4",
        f"{P.UPPER_RAW!r}.upper() is {P.upper_out()!r} and "
        f"{P.UPPER_RAW!r}.lower() is {P.lower_out()!r}. name still holds "
        f"{P.UPPER_RAW!r}.")

    for lv in P.TASK1_SLICES:
        out = P.sl(*lv)
        add(f"task 1, {P.expr(*lv)}",
            (f"{out!r}, landing on "
             + ", ".join(str(i) for i in P.landings(*lv))) if out
            else "nothing at all")
    add("task 1 - the check",
        "Say it only after hands are off keyboards: the index row on the card "
        "is the check. Every landing you wrote must be a number on it.")

    for lv in P.MACHINE_LEVELS:
        out = P.sl(*lv)
        k = P.machine_answer(lv)
        add(f"machine, {P.expr(*lv)}",
            f"Option {'ABCD'[k]}. "
            + (f"{out!r}" if out else "nothing at all")
            + ". " + P.MACHINE_WHY[lv])

    add("task 2, step 1", f"{P.task2_first()!r}")
    add("task 2, step 2", f"Change the start from 1 to 0. "
        f"{P.expr(*P.TASK2_EDIT)} gives {P.task2_edit_out()!r}.")
    add("task 2, step 3", f"{P.expr(*P.TASK2_BACKWARDS)} gives "
        f"{P.task2_backwards_out()!r}. No error, and print shows a blank "
        "line. Going backwards from 1 never reaches 8.")

    for n, pin, out in P.task3_rows():
        add(f"task 3, line {n}",
            f"pin = {pin!r}" + (f", prints {out}" if out else ""))
    add("task 3 - the check",
        "Say it only after hands are off keyboards: exactly "
        f"{len(P.task3_blank_rows())} of the {P.TASK3_LINES} rows should be "
        "empty, and they are lines "
        + " and ".join(str(n) for n in P.task3_blank_rows()) + ".")

    for chars in P.WALK_SETS:
        left, right, kept, never = P.strip_walk(P.WALK_SRC, chars)
        add(f"explainer, {P.walk_label(chars)}",
            f"{P.walk_out(chars)!r}. Off the left: "
            + (", ".join(str(i) for i in left) or "nothing")
            + ". Off the right: "
            + (", ".join(str(i) for i in right) or "nothing")
            + ". Never reached but in the set: "
            + (", ".join(str(i) for i in never) or "nothing") + ".")

    add("task 4", P.TASK4_ANSWER.strip().replace("\n", "<br>")
        + f"<br>It prints {P.task4_out()}. With a yahoo address it prints "
        f"{P.task4_other()}.")

    for key, (src, val) in P.DECK_CLAIMS.items():
        add(key, f"<code>{src}</code> gives {val!r}")

    for ex, got, why in P.tk_slice():
        add(f"takeaway board 1, {ex}",
            (f"{got!r}. " if got else "nothing at all. ") + why)
    for name, subj, call, val, kind in P.tk_methods():
        add(f"takeaway board 2, {name}",
            f"<code>{subj}{call}</code> gives {val!r}. It {kind}.")
    asks, gives = P.tk_method_split()
    add("takeaway board 2, the split",
        f"{asks} of the five answer a question and {gives} hand back a new "
        "string. None of them changes the string it was called on.")

    for i, raw in enumerate(P.EXIT_INPUTS):
        mark = " &lt;- the answer" if not P.exit_run(raw) else ""
        add(f"exit option {'ABCD'[i]}",
            f"{raw!r}. " + P.exit_why(raw) + mark)

    return ("<section class='g-sec'><h3>Every answer, in one place</h3>"
            "<p><b>This file is the only copy of these answers. Never project "
            "it.</b> Every row below was produced by running the code, not "
            "typed in.</p>"
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
           + W.reveal_css() + "\n" + SL.css() + "\n" + ME.css()
           + "\n" + WY.css() + "\n" + TK.css())
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
    presenter = sub(presenter, "{{EXTRA_JS}}", C.extra_js() + SPINE_JS,
                    "extra js")
    presenter = sub(presenter, "{{ONE_IDEA}}", ONE_IDEA, "one idea")
    presenter = sub(presenter, "{{NAV}}", build_nav(), "nav")
    presenter = sub(presenter, "{{BLOCKS}}", build_blocks(), "blocks")
    assert "{{" not in presenter, "unfilled placeholder in the presenter"
    p_path = OUT / PRESENTER
    p_path.write_text(presenter, encoding="utf-8")

    n_cards = (presenter.count('<div class="slide">')
               + presenter.count('<div class="pcard"'))
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
    parts = [f'<h1 class="g-h1">{TITLE}: instructor guide</h1>',
             '<p class="g-meta">Programming Foundations, session 15. '
             f'{n_cards} cards, 75 minutes. Screen only, never projected.</p>']
    assert len(G.ENTRIES) == n_cards, \
        f'{len(G.ENTRIES)} guide entries for {n_cards} cards'
    block_mins = []
    for _bid, _k, _i, _h, mins, cardfns in BLOCKS:
        block_mins += [mins] * len(cardfns)
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
    for f in (PRESENTER, GUIDE, HANDOUT):
        (SHIP / f).write_bytes((OUT / f).read_bytes())
        print(f"{f:44s} {(OUT / f).stat().st_size / 1024:8.0f} KB")
    print(f"shipped to {SHIP}")


if __name__ == "__main__":
    main()
