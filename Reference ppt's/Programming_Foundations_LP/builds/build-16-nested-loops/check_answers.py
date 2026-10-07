#!/usr/bin/env python3
"""Recompute every answer by running the program it came from.

Checks three things:
  1. every walk the projector shows prints exactly what Python prints;
  2. every answer the guide needs is in the guide;
  3. the worksheet, which students receive, carries none of them.
"""
import html
import pathlib
import re

import panels as P

HERE = pathlib.Path(__file__).parent
PLAN = (HERE / ".." / ".." / "Plans" / "Programming Foundations" / "16 - Nested Loops").resolve()
guide = html.unescape((PLAN / "16_nested_loops_instructor_guide.html").read_text(encoding="utf-8"))
sheet = html.unescape((PLAN / "16_nested_loops_student_handout.html").read_text(encoding="utf-8"))
view = (PLAN / "16_nested_loops_student_view.html").read_text(encoding="utf-8")

n = 0


def ok(cond, what):
    global n
    assert cond, what
    n += 1


# 1. every walk agrees with a real run
for key, ev in P.expl_variants().items():
    a, s = map(int, key.split(","))
    ok(P.trace_out(ev) == P.lines_out(P.expl_src(a, s)), f"explainer {key}")
import flow as FL
for key, ev in FL.variants().items():
    a, s = map(int, key.split(","))
    ok(FL.printed(ev) == P.lines_out(P.expl_src(a, s)), f"flow {key}")
    ok(sum(1 for e in ev if e.get("set", [None])[0] == "b") == a * len(range(7, s)), f"flow {key} b count")
ok(P.trace_out(P.task1_events()) == P.task1_out(), "task 1 walk")
for lv in P.MACHINE:
    ok(P.machine_rows_count(lv) == P.machine_answer(lv), f"machine {lv['id']} dots")
    ok(len(set(lv["opts"])) == 4 and P.machine_answer(lv) in lv["opts"], lv["id"])
    ok(set(lv["why"]) == set(lv["opts"]) - {P.machine_answer(lv)}, f"{lv['id']} whys")
ok(P.tri_out() == P.why_want(P.TRI_N), "triangle matches the question")
ok(P.tri_out(P.TRI_SRC, 4) == P.why_want(4), "triangle for 4")
ok(P.tri_out(P.MISTAKE_A) == P.why_want(P.TRI_N)[:-1], "mistake A drops a row")
ok(P.tri_out(P.MISTAKE_B)[0].strip() == "0", "mistake B starts at 0")
ok(P.why_try_out() != P.why_want(P.WHY_N), "the one-loop trick is wrong")
ok(P.why_long_out() == P.why_want(P.WHY_N), "the long way passes 3")
ok(P.why_long_out() != P.why_want(P.WHY_N2), "the long way fails 4")
ok(P.exit_right() == P.EXIT_OPTS.index(3), "exit answer")
ok(sorted(P.exit_lines(v) for v in P.EXIT_OPTS) == [6, 12, 36, 72], "exit counts")
for v in P.EXIT_OPTS:
    ok(str(P.exit_lines(v)) in P.EXIT_WHY[v], f"exit why {v} names its count")
for lv in P.POLL:
    ok(P.poll_rows_count(lv) == P.poll_answer(lv), f"poll {lv['id']} dots")
    ok(len(set(lv["opts"])) == 4 and P.poll_answer(lv) in lv["opts"], lv["id"])
    ok(set(lv["why"]) == set(lv["opts"]) - {P.poll_answer(lv)}, f"{lv['id']} whys")
ok(P.poll_answer(P.POLL[2]) == 2, "the while without a reset prints 2")
ok("\n".join(l for l, _ in P.live_lines()) == P.TRI_SRC, "the live code is the solution")

# 2. the guide carries the answers
for line in P.task1_out():
    ok(line in guide, f"guide: task 1 row {line}")
for lv in P.MACHINE:
    ok(f"<b>{P.machine_answer(lv)}</b>" in guide, f"guide: machine {lv['id']}")
ok(" / ".join(s.strip() for s in P.tri_out()) in guide, "guide: triangle output")
ok(" / ".join(s.strip() for s in P.tri_out(P.MISTAKE_A)) in guide, "guide: mistake A")
ok(" / ".join(s.strip() for s in P.tri_out(P.MISTAKE_B)) in guide, "guide: mistake B")
ok("overs = 3 (answer)" in re.sub(r"<[^>]+>", " ", guide).replace("  ", " ")
   or "(answer)" in guide, "guide: exit answer")
ok(f"{P.why_big_numbers():,}" in guide, "guide: 5050")
for lv in P.POLL:
    ok(f"<b>{P.poll_answer(lv)}</b>" in guide, f"guide: poll {lv['id']}")

# 3. the worksheet does not
for bad in ["2 1", "3 2", "1 1 1", "0 1 2", "(answer)"]:
    ok(bad not in sheet, f"worksheet leaks {bad!r}")
ok("instructor_guide" not in view and "student_handout" not in view,
   "student view links to nothing")
ok("instructor_guide" not in sheet, "worksheet links to nothing")

print(f"check_answers: {n} checks passed")
