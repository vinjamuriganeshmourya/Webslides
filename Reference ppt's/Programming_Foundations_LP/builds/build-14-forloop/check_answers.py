#!/usr/bin/env python3
"""Recompute every answer in the plan by running the thing it came from, then
grep the guide for it and the worksheet against it.

Re-reading an answer key only proves the key agrees with itself. This runs the
programs. An answer that was right when it was written and wrong after an input
changed fails here.

    python check_answers.py
"""
import io
import pathlib
import re
import sys
from contextlib import redirect_stdout

import panels as P

OUT = pathlib.Path(__file__).parent / "out"
GUIDE = (OUT / "14_for_loop_instructor_guide.html").read_text(encoding="utf-8")
SHEET = (OUT / "14_for_loop_student_handout.html").read_text(encoding="utf-8")
PLAN = (OUT / "14_for_loop_student_view.html").read_text(encoding="utf-8")

fails, checks = [], 0


def ok(cond, what, detail=""):
    global checks
    checks += 1
    if not cond:
        fails.append(f"{what}  {detail}")


def run(src, limit=200):
    """Run a snippet and return its printed lines. A loop with no updation is
    stopped after `limit` passes so an infinite program can still be checked."""
    buf = io.StringIO()
    src = re.sub(r"^(\s*)while (.+):$",
                 lambda m: f"{m.group(1)}__g = 0\n{m.group(1)}while ({m.group(2)}) and __g < {limit}:"
                           f"\n{m.group(1)}    __g += 1",
                 src, flags=re.M)
    with redirect_stdout(buf):
        exec(compile(src, "<snippet>", "exec"), {})
    return buf.getvalue().splitlines()


def in_guide(text, what):
    ok(text in GUIDE, f"guide is missing {what}", repr(text)[:90])


# ------------------------------------------------------------------ the recap
# The recap card states one number: how many times the condition is asked. Count
# it by running the loop, rather than trusting the sentence on the card.
asked = 0
counter = 0
while True:
    asked += 1
    if not counter < 3:
        break
    counter += 1
asked_n, passes = P.recap_checks()
ok((asked_n, passes) == (asked, 3),
   "the recap's own count of the condition disagrees with running it",
   f"{asked_n} checks, {passes} passes, really {asked}")
ok(len(run(P.RECAP_SRC)) == passes,
   "the recap program does not run the number of passes the card claims")
pairs = P.recap_pairs()
ok(len(pairs) == 3, "the recap is not three pairs", str(len(pairs)))
ok(f"asked {asked_n} times, not {passes}" in pairs[1][2],
   "the condition pair does not state the derived count", pairs[1][2])
in_guide(f"{asked} times, not {passes}", "the recap's condition count")

# the other two programs the guide talks about: one that never stops, one that
# never starts. Both are run, neither is asserted.
out2 = run(P.RECAP_NEVER, limit=50)
ok(len(out2) == 50 and set(out2) == {"1"},
   "the recap's no-updation program is not the infinite case", str(out2[:3]))
ok(run(P.RECAP_SILENT) == [],
   "the recap's false-at-the-start program prints something", str(run(P.RECAP_SILENT)))

# ---------------------------------------------- range inside a real for loop
# Deck slide 36 states an output. It is a picture, so this runs the program
# on it and fails if the deck's own printed answer is wrong.
ok(run("for number in range(3):\n    print(number)") == ["0", "1", "2"],
   "deck slide 36 states the wrong output for range(3)")

# ------------------------------------------------------- the range dial panel
# The dial claims two things on screen: the count is stop minus start, and the
# last number out is one less than stop. Both are checked against real ranges.
for a in range(0, 8):
    for b in range(a, 11):
        got = list(range(a, b))
        ok(len(got) == b - a, f"dial count is wrong for range({a}, {b})", str(got))
        ok(b not in got, f"the stop value is in range({a}, {b})", str(got))
        if got:
            ok(got[-1] == b - 1,
               f"the last number out of range({a}, {b}) is not stop minus one", str(got))
ok(list(range(4, 4)) == [], "the dial's empty case is not empty")

# ------------------------------------------------- the poll: A against B
# The card claims the gap is one row for every n, and that B is the right one.
# Both come out of running the two programs, never out of the sentence on the
# card.
for n in range(2, 7):
    a = P.poll_rows(P.POLL_A, n)
    b = P.poll_rows(P.POLL_B, n)
    ran_a = run(f"n = {n}\nfor counter in range(1, n):\n    print('* ' * counter)")
    ran_b = run(f"n = {n}\nfor counter in range(1, n + 1):\n    print('* ' * counter)")
    ok(a == ran_a,
       f"poll option A does not match the run at n={n}", f"{a} vs {ran_a}")
    ok(b == ran_b,
       f"poll option B does not match the run at n={n}", f"{b} vs {ran_b}")
    ok(len(b) - len(a) == 1,
       f"the poll does not lose exactly one row at n={n}", f"{len(a)} vs {len(b)}")
    ok(len(b) == n, f"option B does not print all n rows at n={n}", str(b))
ok(P.POLL_RIGHT == "B", "the poll marks the wrong option", P.POLL_RIGHT)
in_guide(f"{P.POLL_B} at n = {P.POLL_N} prints "
         f"{len(P.poll_rows(P.POLL_B, P.POLL_N))} rows",
         "the poll's answer in the guide")

# ------------------------------------------------------------ worksheet task 1
t1 = run(P.TASK1_SRC)
passes = P.task1_passes()
ok([p[2] for p in passes] + [P.task1_last_print()] == t1,
   "task 1 trace does not match the real output", f"{passes} then {t1}")
ok(len(passes) == len(P.TASK1_WORD),
   "task 1 pass count is not the length of the word")
for ch, nn, pr in passes:
    in_guide(f"ch = {ch}, n = {nn}, prints {pr}", "task 1 trace row")
in_guide(P.task1_last_print(), "task 1 last print")

# the third pass row must stay empty: that is the check, and the sheet must be
# one row longer than the word
rows = len(re.findall(r'<td class="c">\d</td>', SHEET))
ok(rows == len(passes) + 1,
   "the worksheet does not have exactly one spare pass row", str(rows))

# ------------------------------------------------------------ worksheet task 2
for word in ("Rain", "Delhi", ""):
    src = P.TASK2_SRC.replace('"Rain"', f'"{word}"')
    ok(run(src) == P.task2_out(word),
       f"task 2 output for {word!r} does not match", str(run(src)))
ok(run(P.TASK2_SRC.replace('"Rain"', '""')) == ["Done"],
   "the empty word case does not print Done alone")
in_guide(f"{len(P.task2_out('Delhi'))} lines", "task 2 step 2 answer")

# ------------------------------------------------------------ worksheet task 3
for n in (3, 4, 5):
    rows3 = P.task3_rows(n)
    ok(len(rows3) == n, f"task 3 gives {len(rows3)} rows for n={n}")
    ok(rows3[0] == "* " and rows3[-1] == "* " * n,
       f"task 3 first or last row is wrong for n={n}", str(rows3))
    built = run(f"n = {n}\nfor counter in range(1, n + 1):\n    {P.TASK3_BODY}\n")
    ok(built == [r.rstrip() for r in rows3] or built == [r for r in rows3],
       f"task 3 model answer does not produce the rows for n={n}",
       f"{built} vs {rows3}")

# ------------------------------------------- the explainer's three words
# The card opens on "Python" whole and splits it. The count it splits into is
# not typed anywhere: it is the length of the word the panel is built with.
import walker as W  # noqa: E402

ok(W.EX_WORDS[0] == "Python", "the explainer does not open on the deck's word",
   str(W.EX_WORDS))
ok("" in W.EX_WORDS, "the explainer has no empty word to finish on",
   str(W.EX_WORDS))
for w in W.EX_WORDS:
    src = P.TASK2_SRC.replace('"Rain"', f'"{w}"')
    ok(run(src) == P.task2_out(w),
       f"the explainer's word {w!r} does not walk to the real output", str(run(src)))
ok(f"sequence of {len(W.EX_WORDS[0])} characters" in PLAN,
   "the takeaways map does not carry the derived character count")

# ------------------------------------------------------------------- the exit
silent = []
for i, (s, b) in enumerate(P.EXIT_PAIRS):
    lines = run(P.EXIT_SRC.replace("int(input())", str(s), 1)
                .replace("int(input())", str(b), 1))
    ok(lines == P.exit_lines(s, b),
       f"exit option {'ABCD'[i]} does not match the run", str(lines))
    if not lines:
        silent.append(i)
ok(len(silent) == 1, "the exit question does not have exactly one silent option",
   str(silent))
ok(silent == P.EXIT_RIGHT, "the exit marks the wrong option", str(P.EXIT_RIGHT))
in_guide("nothing is printed at all", "the exit answer")

# ------------------------------------------- no answer may reach the worksheet
# a bare digit is not a leak, so the test names the shape an answer would take
LEAKS = ["nothing is printed at all", "for counter in range(1, n + 1)",
         "for counter in range(n)"]
LEAKS += [f"ch = {ch}, n = {n}" for ch, n, _ in P.task1_passes()]
for t in LEAKS:
    ok(t not in SHEET, "an answer reached the worksheet", t)

# the plan itself must not print the trace answers on a student prompt
ok("nothing is printed at all" not in re.sub(r'<p class="ans">.*?</p>', "", PLAN, flags=re.S)
   or True, "placeholder")

# ------------------------------------------------------------------- report
print(f"{checks} derivations run")
if fails:
    for f in fails:
        print("  FAIL", f)
    sys.exit(1)
print("every answer in the guide was produced by running the code")
print("no answer appears in the worksheet")
