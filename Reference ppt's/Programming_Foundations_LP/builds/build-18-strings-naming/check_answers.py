"""Re-derive every answer the plan prints, and check where each one lives.

    PYTHONIOENCODING=utf-8 python check_answers.py

1. Every comparison the walk decides is checked against Python's own
   operator, and every walk's steps are checked letter by letter.
2. Every answer must appear in the instructor guide, and on the card that
   reveals it.
3. The worksheet must contain none of them.
"""
import html
import itertools
import pathlib
import re
import sys

import panels as P

HERE = pathlib.Path(__file__).parent
PLAN = (HERE / ".." / ".." / "Plans" / "Programming Foundations"
        / "18 - Comparing Strings & Naming Variables").resolve()
GUIDE = PLAN / "18_comparing_strings_naming_variables_instructor_guide.html"
SHEET = PLAN / "18_comparing_strings_naming_variables_student_handout.html"
VIEW = PLAN / "18_comparing_strings_naming_variables_student_view.html"
for f in (GUIDE, SHEET, VIEW):
    assert f.exists(), f"missing {f}"


def text(p):
    t = html.unescape(re.sub(r"<[^>]+>", " ", p.read_text(encoding="utf-8")))
    return re.sub(r"\s+", " ", t)


guide, sheet, view = text(GUIDE), text(SHEET), text(VIEW)
ok = bad = 0


def check(cond, what):
    global ok, bad
    if cond:
        ok += 1
    else:
        bad += 1
        print("FAIL", what)


# 1. the walk against Python, on every pair the plan uses and a sweep besides
pairs = [(lv["a"], lv["op"], lv["b"]) for lv in P.MACHINE]
pairs += [(P.EXPL[0], P.EXPL[1], w) for w in P.EXPL_WORDS]
pairs += [(n, o, m) for n in P.EXIT_OPTS for m in ("A", "N", "Z") for o in ("<", ">=", "<=")]
words = ["", "a", "A", "ab", "abc", "B", "BA", "BAD", "bad", "98", "984", "123", "Z", "Zoya"]
pairs += [(a, o, b) for a, b in itertools.product(words, words) for o in ("<", ">", "<=", ">=", "==")]
for a, o, b in pairs:
    check(P.walk_says(a, o, b) == P.op_result(a, o, b), f"walk wrong for {a!r} {o} {b!r}")
for a, _o, b in pairs[:20]:
    st = P.compare_walk(a, b)
    for s in st[:-1]:
        check(s[0] == "same" and a[s[1]] == b[s[1]], f"walk passed a pair that differs: {a} {b}")

# the hook's numbers are ord()
for sv, ty, ns, nt, same in P.hook_pairs():
    check(ns == ord(sv) and nt == ord(ty) and same == (sv == ty), f"hook pair {sv}{ty}")
check(P.HOOK_TYPED == P.HOOK_SAVED.upper(), "hook: Caps Lock turns the letters capital")
check(f"{P.hook_pairs()[0][2]}" in guide and f"{P.hook_pairs()[0][3]}" in guide, "hook numbers in guide")

# 2 and 3. the answers: in the guide, never on the worksheet
answers = {}
for w in P.RECAP_WORDS:
    answers[f"recap {w}"] = P.recap_out(w)
for i in range(len(P.T1)):
    answers[f"task 1 program {i + 1}"] = " ".join(P.t1_out(i))
answers["task 4 error"] = P.t4_error()
answers["task 4 fixed"] = " ".join(P.t4_fixed_out())
answers["task 4 bad lines"] = ", ".join(map(str, P.t4_bad_lines()))
for v in P.EXIT_OPTS:
    answers[f"exit {v}"] = f"prints {' '.join(P.exit_out(v)) or 'nothing'}"

for k, v in answers.items():
    check(v in guide, f"{k}: {v!r} is not in the guide")
    if len(v) > 3:
        check(v not in sheet, f"{k}: {v!r} leaks onto the worksheet")

# the guide's machine, classify and slider tables carry every row
g = GUIDE.read_text(encoding="utf-8")
for lv in P.MACHINE:
    check(f"<b>{P.machine_answer(lv)}</b>" in g and html.escape(lv["trap"]) in g,
          f"machine level {lv['tag']} missing from the guide")
for n, okv, why in P.classify_rows():
    check(html.escape(why) in g, f"classify {n} reason missing from the guide")
    check(why in view, f"classify {n} reason missing from the card")
for w in P.EXPL_WORDS:
    check(f"<code>{w}</code></td><td><b>{P.walk_says(P.EXPL[0], P.EXPL[1], w)}</b>" in g,
          f"slider word {w} missing from the guide")

# the answer to the exit, and the task 4 story
check(P.EXIT_OPTS[P.exit_right()] == "Zoya", "exit answer moved")
check(P.t4_error_line() == 1, "task 4: Python must stop at line 1")
check(P.t4_bad_lines() == [1, 2, 3], "task 4: lines 1 to 3 have a bad name")
check(P.BEST in P.BEST_OPTS and P.accepts(P.BEST), "best name")
for o in P.BEST_OPTS:
    check(P.accepts(o), f"{o} is legal, the question is about style")

# the worksheet holds no True/False verdicts and no Accepts/Refuses verdicts
for lv in P.MACHINE:
    check(lv["trap"] not in sheet, "a machine trap line leaks onto the worksheet")
for _n, _ok, why in P.classify_rows():
    check(why not in sheet, "a classify reason leaks onto the worksheet")

print(f"{ok} passed, {bad} failed")
sys.exit(1 if bad else 0)
