#!/usr/bin/env python3
"""Recompute every answer in the plan by running the thing it came from, then
grep the guide for it and the worksheet against it.

Re-reading an answer key only proves the key agrees with itself. This runs the
programs. An answer that was right when it was written and wrong after an
input changed fails here.

    python check_answers.py
"""
import io
import pathlib
import re
import sys
from contextlib import redirect_stdout

import panels as P

OUT = pathlib.Path(__file__).parent / "out"
GUIDE = (OUT / "15_string_methods_instructor_guide.html").read_text(encoding="utf-8")
SHEET = (OUT / "15_string_methods_student_handout.html").read_text(encoding="utf-8")
PLAN = (OUT / "15_string_methods_student_view.html").read_text(encoding="utf-8")

fails, checks = [], 0


def ok(cond, what, detail=""):
    global checks
    checks += 1
    if not cond:
        fails.append(f"{what}  {detail}")


def run(src):
    """Run a snippet and return its printed lines."""
    buf = io.StringIO()
    with redirect_stdout(buf):
        exec(compile(src, "<snippet>", "exec"), {})
    return buf.getvalue().splitlines()


def in_guide(text, what):
    ok(text in GUIDE, f"guide is missing {what}", repr(text)[:100])


# ------------------------------------------------------------------ the recap
seq = list(range(*P.RECAP_RANGE))
for n in P.RECAP_NUMS:
    side = 'left' if n in seq else 'right'
    got = dict((c[0], c[1]) for c in P.recap_chips())[f'`{n}`']
    ok(got == side, f"recap chip {n} is in the wrong bin", f"{got} vs {side}")
in_guide(", ".join(str(n) for n in seq), "the recap sequence")

# -------------------------------------------------------------------- the hook
ok(P.hook_run_out() == P.HOOK_MSG[P.HOOK_RUN[0]:P.HOOK_RUN[1]],
   "the hook's plain run does not match the string")
ok(P.hook_jump_out() == P.HOOK_WORD,
   "the hook's jump does not spell the word", P.hook_jump_out())
ok(P.hook_search_hits() is False,
   "the hook's premise is wrong: the word IS inside the message")
ok(len(P.HOOK_MSG) == 2 * len(P.HOOK_WORD) - 1,
   "the stretched message is not one space between every letter")
in_guide(P.hook_run_out(), "the hook's wrong answer")
in_guide(P.hook_jump_out(), "the hook's right answer")
ok(P.hook_jump_out() not in PLAN.split('id="stage-hook"')[0],
   "the hook's answer appears before the hook")

# ------------------------------------------- the two redrawn slicing panels
got = run(f'message = {P.PULL_SRC!r}\nprint(message[{P.PULL_SLICE[0]}:'
          f'{P.PULL_SLICE[1]}])')
ok(got == [P.pull_out()], "the pull-out panel disagrees with Python", str(got))
ok(P.pull_indexes() == list(range(*P.PULL_SLICE)),
   "the pull-out panel highlights the wrong boxes")
in_guide(P.pull_out(), "the pull-out panel's answer")

a, b, st = P.JUMP_SLICE
got = run(f'secret_message = {P.JUMP_SRC!r}\n'
          f'print(secret_message[{a}:{b}:{st}])')
ok(got == [P.jump_out()], "the jump panel disagrees with Python", str(got))
ok("".join(P.JUMP_SRC[i] for i in P.jump_landings()) == P.jump_out(),
   "the jump panel's landings do not rebuild its answer")
ok(set(P.jump_landings()) & set(P.jump_untouched()) == set(),
   "a box is both landed on and untouched")
ok(len(P.jump_landings()) + len(P.jump_untouched()) == len(P.JUMP_SRC),
   "the jump panel loses a box")
in_guide(P.jump_out(), "the jump panel's answer")

# ------------------------------------------------------- the method cards
for pin in (P.ISDIGIT_PIN, P.ISDIGIT_BAD):
    got = run(f'pin = {pin!r}\nprint(pin.isdigit())')
    ok(got == [str(P.isdigit_out(pin))],
       f"the isdigit card disagrees with Python on {pin!r}", str(got))
    marks = P.isdigit_marks(pin)
    ok(all(m == c.isdigit() for c, m in marks),
       f"a tick or a cross on {pin!r} is wrong")
    ok(all(m for _c, m in marks) == P.isdigit_out(pin),
       f"the marks and the output disagree on {pin!r}")
in_guide(str(P.isdigit_out(P.ISDIGIT_PIN)), "isdigit's True case")
in_guide(P.ISDIGIT_BAD, "isdigit's False input")

got = run(f'mobile = {P.STRIP_RAW!r}\nprint(mobile.strip())')
ok(got == [P.strip_out()], "the strip card disagrees with Python", str(got))
left, right, kept = P.strip_ends()
ok("".join(P.STRIP_RAW[i] for i in kept) == P.strip_out(),
   "the strip card's kept boxes do not rebuild its answer")
ok(len(left) + len(right) == len(P.STRIP_RAW) - len(P.strip_out()),
   "the strip card drops the wrong number of boxes")
in_guide(P.strip_out(), "the strip card's answer")

# ------------------------------------------------- worksheet task 1 and the machine
for lv in P.MACHINE_LEVELS:
    a, b, c = lv
    got = run(f'code = {P.SLICE_SRC!r}\nprint(repr(code[{a}:{b}:{c}]))')[0]
    ok(got == repr(P.sl(*lv)), f"slice {lv} disagrees with Python", got)
    k = P.machine_answer(lv)
    want = P.sl(*lv) or 'nothing at all'
    ok(P.MACHINE_OPTS[lv][k] == want,
       f"machine level {lv} marks the wrong option")
    ok(len(set(P.MACHINE_OPTS[lv])) == 4,
       f"machine level {lv} has a repeated option")
    in_guide(P.expr(*lv), f"machine level {P.expr(*lv)}")
ok(len({P.machine_answer(lv) for lv in P.MACHINE_LEVELS}) > 1,
   "every machine level has its answer in the same place")
ok(P.sl(*P.MACHINE_LEVELS[-1]) == "",
   "the last machine level is supposed to print nothing")

for lv in P.TASK1_SLICES:
    ok(P.expr(*lv) in PLAN, f"{P.expr(*lv)} is not on the task 1 card")
    ok(P.sl(*lv) not in SHEET or not P.sl(*lv),
       f"task 1's answer {P.sl(*lv)!r} is printed on the worksheet")

# ------------------------------------------------------------ worksheet task 2
got = run(P.TASK2_SRC)
ok(got == [P.task2_first()], "task 2 step 1 disagrees with Python", str(got))
got = run(f'code = {P.SLICE_SRC!r}\nprint(code[0:8:2])')
ok(got == [P.task2_edit_out()], "task 2 step 2 disagrees with Python", str(got))
got = run(f'code = {P.SLICE_SRC!r}\nprint(repr(code[1:8:-2]))')
ok(got == ["''"], "task 2 step 3 is supposed to print nothing", str(got))
in_guide(P.task2_edit_out(), "task 2 step 2's answer")

# ------------------------------------------------------------ worksheet task 3
rows = P.task3_rows()
got = run(P.TASK3_SRC)
ok(got == P.task3_printed(), "task 3 disagrees with Python", str(got))
for n, pin, out in rows:
    in_guide(repr(pin), f"task 3 line {n}'s value for pin")
ok(P.task3_blank_rows() == [6, 7], "task 3's blank rows moved",
   str(P.task3_blank_rows()))
in_guide(str(len(P.task3_blank_rows())), "the blank row count")
for _n, pin, out in rows:
    if out:
        ok(out not in SHEET, f"task 3's printed value {out!r} is on the worksheet")

# ----------------------------------------------------------------- the explainer
for chars in P.WALK_SETS:
    src = (f'name = {P.WALK_SRC!r}\n'
           + ('name = name.strip()\n' if chars is None
              else f'name = name.strip({chars!r})\n')
           + 'print(name)')
    got = run(src)
    ok(got == [P.walk_out(chars)],
       f"the walker's {P.walk_label(chars)} disagrees with Python", str(got))
    left, right, kept, never = P.strip_walk(P.WALK_SRC, chars)
    rebuilt = "".join(P.WALK_SRC[i] for i in kept)
    ok(rebuilt == P.walk_out(chars),
       f"strip_walk's kept indexes do not rebuild {P.walk_label(chars)}")
    in_guide(P.walk_out(chars), f"the walker's {P.walk_label(chars)} output")
ok(P.strip_walk(P.WALK_SRC, '-')[3], "the walker has no never-reached character")

# ------------------------------------------------------------ worksheet task 4
got = run(P.TASK4_ANSWER)
ok(got == [str(P.task4_out())], "task 4 disagrees with Python", str(got))
ok('endswith' not in SHEET, "task 4's answer is on the worksheet")
in_guide('endswith', "the endswith answer")

# ------------------------------------------------------- the deck's own claims
for key, (src, val) in P.DECK_CLAIMS.items():
    got = eval(src)
    ok(got == val, f"{key}: the deck claim does not match Python", f"{got!r}")
    in_guide(repr(val) if not isinstance(val, bool) else str(val), key)

# ------------------------------------------------------------------- the exit
for raw in P.EXIT_INPUTS:
    got = run(P.EXIT_SRC.replace('input()', repr(raw)))
    ok(got == P.exit_run(raw), f"exit option {raw!r} disagrees with Python",
       str(got))
    ok(raw in PLAN, f"exit option {raw!r} is not on the card")
ok(len(P.EXIT_RIGHT) == 1, "the exit has more than one right answer",
   str(P.EXIT_RIGHT))
ok(P.EXIT_RIGHT[0] != 0, "the exit's answer is option A")
in_guide(P.exit_after_strip(P.EXIT_INPUTS[P.EXIT_RIGHT[0]]),
         "what the exit's answer strips down to")

# ------------------------------------------------- nothing leaks the other way
for word in ("Valid", "never reached"):
    ok(word not in SHEET, f"{word!r} appears on the worksheet")
ok("instructor_guide" not in SHEET and "instructor_guide" not in PLAN,
   "a student file links to the guide")
ok("student_handout" not in PLAN, "the presenter links to the worksheet")

print(f"{checks - len(fails)} of {checks} answer checks passed")
for f in fails:
    print("  FAIL " + f)
sys.exit(1 if fails else 0)
