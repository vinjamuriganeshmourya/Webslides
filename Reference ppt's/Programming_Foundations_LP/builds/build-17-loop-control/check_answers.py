"""Re-derive every answer the plan prints, and check where each one lives.

    PYTHONIOENCODING=utf-8 python check_answers.py

1. Every program the tracer walks is also run for real with exec, and the
   printed lines must agree.
2. Every answer must appear in the instructor guide.
3. The worksheet must contain none of them.
"""
import html
import pathlib
import re
import sys

import panels as P

HERE = pathlib.Path(__file__).parent
PLAN = (HERE / ".." / ".." / "Plans" / "Programming Foundations"
        / "17 - Loop Control Statements").resolve()
GUIDE = PLAN / "17_loop_control_statements_instructor_guide.html"
SHEET = PLAN / "17_loop_control_statements_student_handout.html"
VIEW = PLAN / "17_loop_control_statements_student_view.html"
for f in (GUIDE, SHEET, VIEW):
    assert f.exists(), f"missing {f}"


def text(p):
    t = html.unescape(re.sub(r"<[^>]+>", " ", p.read_text(encoding="utf-8")))
    return re.sub(r"\s+", " ", t)


guide, sheet = text(GUIDE), text(SHEET)
ok = bad = 0


def check(cond, what):
    global ok, bad
    if cond:
        ok += 1
    else:
        bad += 1
        print("FAIL", what)


# 1. the tracer against a real run, for every program it walks
progs = [P.EXPL_SRC, P.TASK1_SRC, P.S31_SRC, P.FIRST_SRC.replace("input()", '"a b"')]
progs += [src for _k, _c, src in P.INTRO] + [P.expl_src(n) for n in P.EXPL_STOPS]
progs += [lv["src"] for lv in P.MACHINE if not P.compile_error(lv["src"])
          and not P.machine_run(lv)["forever"]]
for src in progs:
    tr = [e["o"] for e in P.trace(src)["events"] if "o" in e]
    check(tr == P.lines_out(src), f"trace disagrees with exec: {src[:30]!r}")
for w in P.T3_WORDS:
    tr = [e["o"] for e in P.trace(P.t3_src(w), P.T3_IN)["events"] if "o" in e]
    check(tr == P.t3_out(w), f"trace disagrees for {w}")

# 2 and 3. the answers: in the guide, never on the worksheet
answers = {
    "recap wrong": P.recap_show(P.recap_wrong()),
    "recap right": P.recap_show(P.recap_right()),
    "task 1 output": " / ".join(s.strip() for s in P.task1_out()),
    "task 2 step 1": P.first_out(),
    "task 2 step 2": P.first_cut_out(),
    "task 2 step 3": P.first_out(P.FIRST_IN2),
    "task 2 lone if": P.first_only_break_removed(),
    "age empty": P.age_empty_error(),
    "never taken": ", ".join(str(x) for x in P.expl_never()),
    "break outside": P.out_break_error(),
    "continue outside": P.out_cont_error(),
}
for w in P.T3_WORDS:
    answers[f"task 3 {w}"] = P.shown(P.t3_out(w))
for lv in P.MACHINE:
    answers[f"machine {lv['id']}"] = P.machine_result(lv)
for v in P.EXIT_OPTS:
    answers[f"exit {v}"] = f"prints {P.shown(P.exit_out(v))}"
for n, (a, b, brk, pr) in enumerate(P.task1_if_rows(), 1):
    check(f"<td>{a}</td><td>{b}</td><td>{brk}</td>" in GUIDE.read_text(encoding="utf-8"),
          f"task 1 row {n} missing from the guide")

for k, v in answers.items():
    check(v in guide, f"{k}: {v!r} is not in the guide")
    if k not in ("task 2 step 1",) and len(v) > 3:
        check(v not in sheet, f"{k}: {v!r} leaks onto the worksheet")

# the one right exit option, and the machine answers are unique
check(P.exit_right() == 2, "exit answer moved")
for lv in P.MACHINE:
    P.machine_right(lv)
    ok += 1

# the hook 2 numbers the card prints
check(P.reels_played() == [15, 3, 12], "reels continue")
check(P.reels_played("break") == [15, 3], "reels break")

print(f"{ok} passed, {bad} failed")
sys.exit(1 if bad else 0)
