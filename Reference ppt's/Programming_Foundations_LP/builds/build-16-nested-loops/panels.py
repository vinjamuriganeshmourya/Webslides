"""Every program in session 16, and every answer derived from running it.

Nothing on a card, in the guide or in the worksheet key is typed in by hand.
`check_answers.py` runs each program for real with `exec` and asserts it
agrees with the tracer here, so a walk on the projector can never disagree
with what Python prints.
"""
import contextlib
import io


def run(src, inp=None):
    """Run a program for real and hand back what it printed."""
    buf = io.StringIO()
    it = iter([] if inp is None else [str(inp)])
    g = {"input": lambda *a: next(it)}
    with contextlib.redirect_stdout(buf):
        exec(src, g)
    return buf.getvalue()


def lines_out(src, inp=None):
    return run(src, inp).rstrip("\n").split("\n") if run(src, inp) else []


# ================================================================== the recap
# Session 15: extended slicing, isdigit, upper. `rapid`, because 12 used
# bug, 14 used match and 15 used sort.
RECAP_TITLE = "Recap of string methods"
RECAP_ASK = "Say your answer first. Then we turn the card over."
RECAP_SRC = [
    ('"-R-a-v-i-"[1:8:2]', "Start at 1, jump by 2, stop before 8."),
    ('"98.5".isdigit()', "The dot is not a digit, so the answer is False."),
    ('"ravi".upper()', "upper gives back a new string in capital letters."),
]


def recap_items():
    out = []
    for expr, why in RECAP_SRC:
        val = eval(expr)
        shown = repr(val) if isinstance(val, str) else str(val)
        out.append((f"What does `{expr}` give?", f"`{shown}`", why))
    return out


# ================================================================== the tracer
# A nested for loop, walked one line at a time the way Python runs it. Each
# event is one line running: which line, what it set, what it printed, and a
# short caption in plain words. The range strips ride on the events too, so a
# strip can change shape when the inner range depends on the outer variable.
def trace(p):
    ev = []
    ov, oseq_label, oseq, oline = p["outer"]
    iv, iseq_label, iseq, iline = p["inner"]
    if not list(oseq):
        ev.append({"l": oline, "seq": {ov: [[], -1, oseq_label]},
                   "say": f"{oseq_label} is empty, so the loop body never runs."})
    for oi, x in enumerate(oseq):
        ev.append({"l": oline, "set": [ov, x],
                   "seq": {ov: [list(oseq), oi, oseq_label]},
                   "c": "outer",
                   "say": p["say_outer"](x)})
        for line, fn in p.get("pre", []):
            ev.append({"l": line, "o": fn(x), "say": "It prints."})
        inner = list(iseq(x))
        if not inner:
            ev.append({"l": iline,
                       "seq": {iv: [[], -1, iseq_label(x)]},
                       "say": p["say_empty"](x)})
        for ii, y in enumerate(inner):
            ev.append({"l": iline, "set": [iv, y],
                       "seq": {iv: [inner, ii, iseq_label(x)]},
                       "say": p["say_inner"](x, y, ii)})
            for line, fn in p["body"]:
                ev.append({"l": line, "o": fn(x, y), "c": "inner",
                           "say": "It prints."})
    for line, out in p.get("after", []):
        ev.append({"l": line, "o": out, "say": p.get("say_after", "")})
    return ev


def trace_out(events):
    return [e["o"] for e in events if "o" in e]


# ============================================== the explainer: deck slide 12
EXPL_SRC = '''for a in range(3):
    print("outer : " + str(a))
    for b in range(7, 9):
        print("  inner : " + str(b))
print("End")'''

EXPL = {
    "outer": ("a", "range(3)", range(3), 1),
    "inner": ("b", lambda a: "range(7, 9)", lambda a: range(7, 9), 3),
    "pre": [(2, lambda a: "outer : " + str(a))],
    "body": [(4, lambda a, b: "  inner : " + str(b))],
    "after": [(5, "End")],
    "say_outer": lambda a: f"The outer loop takes {a}.",
    "say_inner": lambda a, b, k: (
        "The inner loop starts again from 7." if k == 0 and a > 0 else
        f"The inner loop takes {b}."),
    "say_empty": lambda a: "",
    "say_after": "Both loops are done, so End prints once.",
}


def expl_events():
    return trace(EXPL)


# The room changes two numbers on the explainer: how many outer passes, and
# where the inner range stops. Every choice is traced here and checked against
# a real run in check_answers.py, so the card never walks a program it made up.
EXPL_NS = range(0, 5)
EXPL_STOPS = range(7, 11)
EXPL_DEFAULT = (3, 9)


def expl_src(n, stop):
    return EXPL_SRC.replace("range(3)", f"range({n})").replace(
        "range(7, 9)", f"range(7, {stop})")


def expl_prog(n, stop):
    p = dict(EXPL)
    p["outer"] = ("a", f"range({n})", range(n), 1)
    p["inner"] = ("b", lambda a: f"range(7, {stop})", lambda a: range(7, stop), 3)
    p["say_empty"] = lambda a: f"range(7, {stop}) is empty, so line 4 never runs."
    p["say_after"] = ("Both loops are done, so End prints once." if n else
                      "range(0) is empty. The loop body never runs, only End.")
    return p


def expl_variants():
    return {f"{n},{s}": trace(expl_prog(n, s)) for n in EXPL_NS for s in EXPL_STOPS}


def expl_counts():
    out = lines_out(EXPL_SRC)
    return (len(out), sum(1 for s in out if s.startswith("outer")),
            sum(1 for s in out if "inner" in s))


# ======================================== worksheet task 1: the inner range uses i
TASK1_SRC = '''for i in range(1, 4):
    for j in range(i):
        print(i, j)'''

TASK1 = {
    "outer": ("i", "range(1, 4)", range(1, 4), 1),
    "inner": ("j", lambda i: f"range({i})", lambda i: range(i), 2),
    "body": [(3, lambda i, j: f"{i} {j}")],
    "say_outer": lambda i: f"i is {i}, so the inner range is range({i}).",
    "say_inner": lambda i, j, k: (f"j starts again at 0." if k == 0 and i > 1
                                  else f"j takes {j}."),
    "say_empty": lambda i: "",
}
TASK1_ROWS = 8          # rows in the worksheet table; the check is how many fill


def task1_events():
    return trace(TASK1)


def task1_out():
    return lines_out(TASK1_SRC)


# ============================================ the loop counter machine, four levels
# Each level: the program, the question, four options as concrete numbers,
# and why each wrong option was tempting. The answer is computed.
MACHINE = [
    {"id": "m1", "tag": "Level 1", "q": "How many lines does it print?",
     "src": 'for i in range(3):\n    for j in range(4):\n        print(i, j)',
     "count": lambda out: len(out),
     "rows": lambda: [(f"i = {i}", "i" * 4) for i in range(3)],
     "opts": [7, 12, 3, 4],
     "why": {7: "7 adds 3 and 4. The inner loop runs 4 times on every pass, so it is 3 times 4.",
             3: "3 is only the outer loop.",
             4: "4 is only one pass of the inner loop."}},
    {"id": "m2", "tag": "Level 2", "q": "How many lines does it print?",
     "src": 'for i in range(2):\n    print("row")\n    for j in range(3):\n        print("*")',
     "count": lambda out: len(out),
     "rows": lambda: [(f"i = {i}", "o" + "i" * 3) for i in range(2)],
     "opts": [6, 5, 8, 2],
     "why": {6: "6 counts the stars and forgets the two row lines.",
             5: "5 adds 2 and 3.",
             2: "2 is only the row lines."}},
    {"id": "m3", "tag": "Level 3", "q": "How many lines does it print?",
     "src": 'for i in range(4):\n    for j in range(i, 3):\n        print(j)',
     "count": lambda out: len(out),
     "rows": lambda: [(f"i = {i}", "i" * len(range(i, 3))) for i in range(4)],
     "opts": [12, 9, 6, 4],
     "why": {12: "12 is 4 times 3, but the inner range gets shorter every pass.",
             9: "9 forgets that range(3, 3) is empty.",
             4: "4 is only the outer loop."}},
    {"id": "m4", "tag": "Level 4", "q": "How many times does done print?",
     "src": 'for i in range(3):\n    for j in range(2):\n        print("*")\n    print("done")',
     "count": lambda out: out.count("done"),
     "rows": lambda: [(f"i = {i}", "ii" + "d") for i in range(3)],
     "opts": [1, 6, 3, 2],
     "why": {1: "1 would be right if done sat at the left edge, after both loops.",
             6: "6 would be right if done sat under the inner loop.",
             2: "2 is the inner loop's count."}},
]


def machine_answer(lv):
    return lv["count"](lines_out(lv["src"]))


def machine_rows_count(lv):
    """What the dot grid on the card shows, counted the way the question asks."""
    want = "d" if lv["id"] == "m4" else None
    return sum(len(r) if want is None else r.count(want) for _, r in lv["rows"]())


def machine_right(lv):
    return lv["opts"].index(machine_answer(lv))


# ===================================================== the second hook: why a loop inside
WHY_TRY = '''n = int(input())
for i in range(1, n + 1):
    print("1 " * i)'''
WHY_LONG = '''print("1 ")
print("1 2 ")
print("1 2 3 ")'''
WHY_N = 3
WHY_N2 = 4
WHY_BIG = 100


def why_want(n):
    return [" ".join(str(k) for k in range(1, r + 1)) + " " for r in range(1, n + 1)]


def why_try_out():
    return run(WHY_TRY, WHY_N).rstrip("\n").split("\n")


def why_long_out():
    return run(WHY_LONG).rstrip("\n").split("\n")


def why_big_lines():
    """The long way for an input of 100: one print line per row."""
    return WHY_BIG


def why_big_numbers():
    """And every number in every row typed by hand."""
    return sum(len(range(1, r + 1)) for r in range(1, WHY_BIG + 1))


# =========================================================== the number triangle
TRI_SRC = '''num = int(input())
for row_num in range(1, num + 1):
    row_out = ""
    for seq_num in range(1, row_num + 1):
        row_out = row_out + str(seq_num) + " "
    print(row_out)'''
TRI_BLANK = TRI_SRC.replace("range(1, row_num + 1)", "range(____, ____)")
TRI_START, TRI_STOP = "1", "row_num + 1"
MISTAKE_A = TRI_SRC.replace("range(1, num + 1)", "range(1, num)")
MISTAKE_B = TRI_SRC.replace("range(1, row_num + 1)", "range(row_num)")
TRI_N = 3


def tri_out(src=TRI_SRC, n=TRI_N):
    return run(src, n).rstrip("\n").split("\n")


# ===================================================================== the exit
EXIT_SRC = '''overs = int(input())
for over in range(1, overs):
    for ball in range(1, 7):
        print(str(over) + "." + str(ball))'''
EXIT_TARGET = 12
EXIT_OPTS = [2, 3, 7, 13]
EXIT_WHY = {
    2: "range(1, 2) gives only 1, so one over: 6 lines.",
    3: "range(1, 3) gives 1 and 2, two overs of 6 balls: 12 lines.",
    7: "7 counts balls, not overs. range(1, 7) is six overs: 36 lines.",
    13: "13 treats every line as an over. That is 12 overs: 72 lines.",
}


def exit_lines(v):
    return len(lines_out(EXIT_SRC, v))


def exit_right():
    hits = [i for i, v in enumerate(EXIT_OPTS) if exit_lines(v) == EXIT_TARGET]
    assert len(hits) == 1, hits
    return hits[0]


# =============================================================== the takeaways
TK = [
    ("the inner loop restarts",
     'for a in range(3):\n    for b in range(7, 9):',
     lambda: (f"inner prints {len(range(7, 9))} lines on each of "
              f"{expl_counts()[1]} passes: {expl_counts()[2]} in all"),
     "The inner loop runs all the way through on every pass of the outer loop."),
    ("count it",
     'for over in range(20):\n    for ball in range(1, 7):',
     lambda: f"{len(range(20)) * len(range(1, 7))} balls",
     "Lines inside both loops run outer count times inner count."),
    ("inner uses outer",
     'for i in range(1, 4):\n    for j in range(i):',
     lambda: f"{len(task1_out())} lines: 1, then 2, then 3",
     "The inner range can use the outer variable, so each pass can be a different length."),
    ("indentation",
     'for i in range(3):\n    for j in range(2): ...\n    print("done")',
     lambda: f'done prints {machine_answer(MACHINE[3])} times',
     "Indentation decides which loop a line belongs to."),
    ("while needs a reset",
     'while i < 3:\n    while j < 2:   # no j = 0 here',
     lambda: f"{poll_answer(POLL[2])} stars, not 6",
     "A for loop starts again by itself. A while loop starts again only if you reset its counter."),
    ("the triangle",
     'for row_num in range(1, num + 1):\n    for seq_num in range(1, row_num + 1):',
     lambda: " / ".join(s.strip() for s in tri_out()),
     "One loop for the rows, and a loop inside it to build each row."),
]


def tk_rows():
    return [(chip, code, got(), why) for chip, code, got, why in TK]


# ============================================ the instructor writes it, line by line
# One press per line of TRI_SRC, in the order a person types it, with the one
# sentence the instructor says as each line goes in.
LIVE_SAY = [
    "Read N, the number of rows.",
    "The outer loop: one pass for each row, from 1 up to N.",
    "Start each row empty. This line runs again on every row.",
    "The inner loop: count from 1 up to this row's number.",
    "Add the number and a space to the row.",
    "Print the row once it is built. It sits under the outer loop only.",
]


def live_lines():
    lines = TRI_SRC.split("\n")
    assert len(lines) == len(LIVE_SAY)
    return list(zip(lines, LIVE_SAY))


# ============================================ any loop inside any loop: a poll
# Three programs, each the deck's slide 37, 38 or 39 made real. The third is a
# while inside a while that forgets to set j back to 0, so the inner loop runs
# only on the first pass. A for loop starts again by itself; a while loop only
# starts again if you reset its counter.
POLL = [
    {"id": "p1", "tag": "while inside for", "q": "How many stars?",
     "src": 'for i in range(3):\n    j = 0\n    while j < 2:\n        print("*")\n        j = j + 1',
     "count": lambda out: len(out),
     "rows": lambda: [(f"i = {i}", "ii") for i in range(3)],
     "opts": [6, 3, 2, 5],
     "why": {3: "3 is only the outer loop.",
             2: "2 is only one pass of the while loop.",
             5: "5 adds 3 and 2. The while loop runs twice on every pass: 3 times 2."}},
    {"id": "p2", "tag": "for inside while", "q": "How many stars?",
     "src": 'i = 0\nwhile i < 2:\n    for j in range(3):\n        print("*")\n    i = i + 1',
     "count": lambda out: len(out),
     "rows": lambda: [(f"i = {i}", "iii") for i in range(2)],
     "opts": [5, 6, 3, 2],
     "why": {5: "5 adds 2 and 3.",
             3: "3 is only one pass of the for loop.",
             2: "2 is only the while loop."}},
    {"id": "p3", "tag": "while inside while", "q": "How many stars?",
     "src": 'i = 0\nj = 0\nwhile i < 3:\n    while j < 2:\n        print("*")\n        j = j + 1\n    i = i + 1',
     "count": lambda out: len(out),
     "rows": lambda: [("i = 0", "ii"), ("i = 1", ""), ("i = 2", "")],
     "opts": [6, 2, 3, 0],
     "why": {6: "6 would be right if j = 0 sat inside the outer loop. Here j stays 2.",
             3: "3 is only the outer loop.",
             0: "0 forgets that j starts at 0, so the first pass does run."}},
]


def poll_title(lv):
    """'while inside for' -> 'A while loop inside a for loop'."""
    inner, outer = lv["tag"].split(" inside ")
    return f"A {inner} loop inside a {outer} loop"


def poll_answer(lv):
    return lv["count"](lines_out(lv["src"]))


def poll_rows_count(lv):
    return sum(len(r) for _, r in lv["rows"]())


def poll_right(lv):
    return lv["opts"].index(poll_answer(lv))
