"""Every program in session 17, and every answer derived from running it.

Nothing on a card, in the guide or in the worksheet key is typed in by hand.
`trace()` runs a program for real under `sys.settrace` and records one event
per line Python actually executed: which line, what it changed, what it
printed, and a caption in plain words. The walker, the machine and the answer
key all read those events, so the projector can never disagree with Python.
"""
import contextlib
import io
import sys


# ===================================================================== running
def run(src, inp=None):
    """Run a program for real and hand back what it printed."""
    buf = io.StringIO()
    it = iter([] if inp is None else [str(inp)])
    g = {"input": lambda *a: next(it)}
    with contextlib.redirect_stdout(buf):
        exec(compile(src, "<plan>", "exec"), g)
    return buf.getvalue()


def lines_out(src, inp=None):
    s = run(src, inp)
    return s.rstrip("\n").split("\n") if s else []


def compile_error(src):
    """The error Python raises before line 1 runs, or None."""
    try:
        compile(src, "<plan>", "exec")
    except SyntaxError as e:
        return f"{type(e).__name__}: {e.msg}"
    return None


class _Forever(Exception):
    pass


def _snap(g):
    return {k: v for k, v in g.items()
            if not k.startswith("__") and k != "input"
            and isinstance(v, (int, str, bool, float))}


def _fmt(v):
    return repr(v) if isinstance(v, str) else str(v)


def trace(src, inp=None, cap=80, strips=None):
    """Run `src` line by line. `strips` maps a loop variable to its range
    label and the items that range hands out, so the walker can draw the
    boxes. Returns a dict: events, out (printed lines), error, forever."""
    err = compile_error(src)
    if err:
        return {"events": [], "out": [], "error": err, "forever": False}
    code = compile(src, "<plan>", "exec")
    lines = src.split("\n")
    buf = io.StringIO()
    it = iter([] if inp is None else [str(inp)])
    g = {"input": lambda *a: next(it)}
    raw = []                       # (lineno, locals before, output position)

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<plan>":
            return None
        if event == "line":
            if len(raw) >= cap:
                raise _Forever()
            raw.append((frame.f_lineno, _snap(frame.f_globals), buf.tell()))
        return tracer

    forever = False
    with contextlib.redirect_stdout(buf):
        sys.settrace(tracer)
        try:
            exec(code, g)
        except _Forever:
            forever = True
        finally:
            sys.settrace(None)
    end = (_snap(g), buf.tell())
    text = buf.getvalue()

    events = []
    strips = strips or {}
    seq_state = {}                 # var -> [items, idx, label, flag]
    for n, (ln, before, pos) in enumerate(raw):
        after, pos2 = (raw[n + 1][1], raw[n + 1][2]) if n + 1 < len(raw) else end
        nxt = raw[n + 1][0] if n + 1 < len(raw) else None
        line = lines[ln - 1].strip()
        e = {"l": ln}
        printed = text[pos:pos2]
        if printed:
            e["o"] = printed.rstrip("\n")
        changed = [k for k in after if before.get(k, object()) != after[k]]
        if changed:
            k = changed[0]
            e["set"] = [k, _fmt(after[k])]
        # --- the range strips
        if line.startswith("for "):
            var = line[4:].split(" in ")[0].strip()
            if var in strips:
                label, items = strips[var]
                items = list(items(after) if callable(items) else items)
                if changed and changed[0] == var:
                    idx = items.index(after[var])
                    seq_state[var] = [items, idx, label, ""]
                else:
                    seq_state[var] = [items, len(items), label, "done"]
                e["seq"] = {var: list(seq_state[var])}
        if line == "break":
            for var, st in seq_state.items():
                if st[3] == "" and _inside(lines, ln, var):
                    st[3] = "broke"
                    e["seq"] = {var: list(st)}
        e["say"] = _say(line, e, nxt, ln, lines, after)
        events.append(e)
    out = text.rstrip("\n").split("\n") if text else []
    return {"events": events, "out": out, "error": None, "forever": forever}


def _inside(lines, ln, var):
    """Is line `ln` inside the innermost loop over `var`? (Walk up the
    indentation until a loop header is found.)"""
    ind = len(lines[ln - 1]) - len(lines[ln - 1].lstrip())
    for j in range(ln - 2, -1, -1):
        s = lines[j]
        i2 = len(s) - len(s.lstrip())
        if i2 < ind and (s.strip().startswith("for ") or s.strip().startswith("while ")):
            return s.strip().startswith(f"for {var} ")
    return False


def _say(line, e, nxt, ln, lines, after):
    if line.startswith("for "):
        var = line[4:].split(" in ")[0].strip()
        if "set" in e and e["set"][0] == var:
            return f"{var} takes {e['set'][1]}."
        return "Nothing is left in the range, so the loop ends."
    if line.startswith("while "):
        cond = line[6:].rstrip(":")
        if nxt == ln + 1:
            return f"{cond} is True, so the body runs."
        return f"{cond} is False, so the loop ends."
    if line.startswith("if "):
        cond = line[3:].rstrip(":")
        if nxt == ln + 1:
            return f"{cond} is True."
        return f"{cond} is False, so its block is skipped."
    if line == "break":
        return "break. Leave the loop right now."
    if line == "continue":
        return "continue. Skip the rest of this pass and go back to the top."
    if line == "pass":
        return "pass does nothing. Python just moves on."
    if "o" in e:
        return f"It prints {e['o']}."
    if "set" in e:
        return f"{e['set'][0]} is now {e['set'][1]}."
    return ""


def shown(lines):
    """Printed lines as one short line for a card or an option."""
    return " ".join(lines) if lines else "nothing"


# ================================================================== the recap
# Session 16's own daily challenge (its slide 41, and this deck's slide 8),
# with the range already fixed so exactly one line is to blame.
RECAP_TITLE = "Recap of nested loops"
RECAP_ASK = "One line is wrong. Write down its number before we look."
RECAP_N = 3
RECAP_SRC = '''n = 3
for row_num in range(0, n):
    row_output = ""
    seq_num = row_num
    while seq_num > 0:
        row_output = row_output + str(seq_num)
        seq_num = seq_num - 1
    print(row_output)'''
RECAP_CULPRIT = 4
RECAP_FIX = RECAP_SRC.replace("seq_num = row_num", "seq_num = n - row_num")
RECAP_WHY = ("Line 4 starts each row at `row_num`, so the rows count up: "
             "0, 1, 2. It should start at `n - row_num`.")


def recap_wrong():
    return lines_out(RECAP_SRC)


def recap_right():
    return lines_out(RECAP_FIX)


def recap_show(lines):
    """The recap board prints its output on one line; an empty row is shown
    as a visible gap so the room can see it."""
    return " / ".join(s if s else "(empty)" for s in lines)


# ============================================== the explainer: deck slide 18
EXPL_SRC = '''for i in range(10):
    if i == 2:
        break
    print(i)
print("End")'''
EXPL_STRIPS = {"i": ("range(10)", range(10))}


def expl():
    return trace(EXPL_SRC, strips=EXPL_STRIPS)


def expl_never():
    """The values range(10) had ready that the loop never took."""
    last = [e for e in expl()["events"] if "seq" in e and "i" in e["seq"]][-1]
    items, idx, _lab, flag = last["seq"]["i"]
    assert flag == "broke"
    return items[idx + 1:]


# =========================================== slides 31 and 32: break comes first
S31_SRC = '''i = 0
while i < 10:
    break
    print(i)
    i = i + 1
print("End")'''


# ================================ slides 33 and 34: break outside any loop
OUT_BREAK_SRC = '''for i in range(10):
    print(i)
break
print("End")'''
OUT_CONT_SRC = OUT_BREAK_SRC.replace("break", "continue")


def out_break_error():
    return compile_error(OUT_BREAK_SRC)


def out_cont_error():
    return compile_error(OUT_CONT_SRC)


# ============================ slide 14, redrawn: four ways a program can run
INTRO = [
    ("plain", "one line after another", '''print("A")
print("B")
print("C")'''),
    ("if-elif-else", "picks one block, skips the rest", '''marks = 72
if marks >= 35:
    print("pass")
else:
    print("fail")'''),
    ("while, for", "goes back up and runs again", '''for i in range(2):
    print(i)
print("done")'''),
    ("break, continue", "changes the loop from inside", '''for i in range(5):
    if i == 1:
        break
    print(i)
print("End")'''),
]


def intro_order(src):
    """The line numbers in the order they run, read off the tracer."""
    return [e["l"] for e in trace(src)["events"]]


# ============================== worksheet task 1: break in a nested loop (slide 36)
TASK1_SRC = '''for a in range(2):
    print("outer : " + str(a))
    for b in range(4):
        if b == 1:
            break
        print(" inner : " + str(b))'''
TASK1_STRIPS = {"a": ("range(2)", range(2)), "b": ("range(4)", range(4))}
TASK1_IF_LINE = 4
TASK1_ROWS = 6          # rows on the worksheet; the check is how many get filled


def task1():
    return trace(TASK1_SRC, strips=TASK1_STRIPS)


def task1_if_rows():
    """One row per time line 4 runs: a, b, does it break, what line 6 prints."""
    ev = task1()["events"]
    rows, a, b = [], None, None
    for n, e in enumerate(ev):
        if e.get("set", [None])[0] == "a":
            a = e["set"][1]
        if e.get("set", [None])[0] == "b":
            b = e["set"][1]
        if e["l"] == TASK1_IF_LINE:
            nxt = ev[n + 1] if n + 1 < len(ev) else None
            brk = bool(nxt and nxt["l"] == TASK1_IF_LINE + 1)
            printed = ""
            if not brk and n + 1 < len(ev) and "o" in ev[n + 1]:
                printed = ev[n + 1]["o"].strip()
            rows.append((a, b, "yes" if brk else "no", printed))
    return rows


def task1_out():
    return lines_out(TASK1_SRC)


# ======================================= worksheet task 2: first word in uppercase
FIRST_SRC = '''sentence = input()
first_word = ""
for char in sentence:
    if char == " ":
        break
    first_word = first_word + char
print(first_word.upper())'''
FIRST_CUT = (4, 5)                      # the two lines task 2 deletes
FIRST_IN = "Python is fun"
FIRST_IN2 = "Hello"


def first_cut_src():
    ls = FIRST_SRC.split("\n")
    return "\n".join(l for i, l in enumerate(ls, 1) if i not in FIRST_CUT)


def first_out(inp=FIRST_IN):
    return lines_out(FIRST_SRC, inp)[0]


def first_cut_out(inp=FIRST_IN):
    return lines_out(first_cut_src(), inp)[0]


def first_only_break_removed():
    """What happens if only the break line goes: the if has no block."""
    ls = FIRST_SRC.split("\n")
    return compile_error("\n".join(l for i, l in enumerate(ls, 1) if i != 5))


# ======================================== the break or continue machine, six levels
# Each level: the program, the question, four options as concrete printed
# output, and why each wrong option was tempting. The right option is found
# by running the program, never typed.
ERR = "Error. Nothing prints"
FOREVER = "0, then it never stops"
MACHINE = [
    {"id": "m1", "tag": "break in a while loop",
     "src": 'i = 0\nwhile i < 10:\n    if i == 2:\n        break\n    print(i)\n    i = i + 1\nprint("End")',
     "opts": ["0 1 2 End", "0 1", "0 1 End", "0 1 2 3 4 5 6 7 8 9 End"],
     "why": {"0 1 2 End": "break runs before print(i), so 2 is never printed.",
             "0 1": "break leaves the loop, not the program. End is outside the loop, so it still runs.",
             "0 1 2 3 4 5 6 7 8 9 End": "That is the loop with no break at all."}},
    {"id": "m2", "tag": "break outside a loop",
     "src": 'for i in range(10):\n    print(i)\nbreak\nprint("End")',
     "opts": ["0 1 2 3 4 5 6 7 8 9 End", "0 1 2 3 4 5 6 7 8 9", "0 End", ERR],
     "why": {"0 1 2 3 4 5 6 7 8 9 End": "Line 3 is not inside the loop, so there is no loop for it to leave.",
             "0 1 2 3 4 5 6 7 8 9": "It does not get that far. Python checks the whole file before line 1 runs.",
             "0 End": "break is not inside the loop, so it cannot cut the loop short."}},
    {"id": "m3", "tag": "continue",
     "src": 'for a in range(3):\n    if a == 1:\n        continue\n    print(a)\nprint("End")',
     "opts": ["0 End", "0 2 End", "0 1 2 End", "2 End"],
     "why": {"0 End": "That is what break would do. continue carries on with 2.",
             "0 1 2 End": "continue skips print(a) when a is 1, so 1 is missing.",
             "2 End": "Only a == 1 is skipped. 0 still prints."}},
    {"id": "m4", "tag": "continue comes first",
     "src": 'for a in range(3):\n    continue\n    print(a)\nprint("End")',
     "opts": ["0 1 2 End", "nothing", ERR, "End"],
     "why": {"0 1 2 End": "continue runs first on every pass, so print(a) is never reached.",
             "nothing": "The loop still ends after 3 passes, and then End prints.",
             ERR: "continue is inside the loop, so this is fine. No error."}},
    {"id": "m5", "tag": "continue before the update",
     "src": 'i = 0\nwhile i < 3:\n    if i == 1:\n        continue\n    print(i)\n    i = i + 1',
     "opts": ["0 2", "0 1 2", FOREVER, "0"],
     "why": {"0 2": "continue jumps back before i = i + 1, so i stays 1 for ever.",
             "0 1 2": "When i is 1, print(i) is skipped.",
             "0": "It prints 0 and then does not stop. The condition keeps being True."}},
    {"id": "m6", "tag": "continue in the inner loop",
     "src": 'for a in range(2):\n    for b in range(3):\n        if b == 1:\n            continue\n        print(a, b)',
     "opts": ["0 0 / 1 0", "0 0 / 0 2 / 1 0 / 1 2", "0 0 / 0 2", "0 0 / 0 1 / 0 2 / 1 0 / 1 1 / 1 2"],
     "why": {"0 0 / 1 0": "That is break. continue carries on with b = 2.",
             "0 0 / 0 2": "continue only skips one pass of the inner loop. The outer loop still runs a = 1.",
             "0 0 / 0 1 / 0 2 / 1 0 / 1 1 / 1 2": "That is the loop with no continue."}},
]
MACHINE_CAP = 40                # events before a run that never stops is called


def machine_run(lv):
    return trace(lv["src"], cap=MACHINE_CAP)


def machine_result(lv):
    """What the level really does, in the same words as its options."""
    r = machine_run(lv)
    if r["error"]:
        return ERR
    if r["forever"]:
        return f"{r['out'][0]}, then it never stops" if r["out"] else "never stops"
    sep = " / " if lv["id"] == "m6" else " "
    return sep.join(r["out"])


def machine_right(lv):
    hits = [i for i, o in enumerate(lv["opts"]) if o == machine_result(lv)]
    assert len(hits) == 1, (lv["id"], machine_result(lv), lv["opts"])
    return hits[0]


# =================================== worksheet task 3: pass, continue, break (slide 84)
T3_SRC = '''n = int(input())
for i in range(n):
    if i == 3:
        pass
    print(i)'''
T3_IN = 5
T3_WORDS = ["pass", "continue", "break"]


def t3_src(word):
    return T3_SRC.replace("        pass", "        " + word)


def t3_out(word):
    return lines_out(t3_src(word), T3_IN)


# ======================================================= pass: the empty blocks
AGE_EMPTY = '''age = int(input())
output = ""
if age >= 20:
elif age > 12:
else:
print(output)'''
AGE_PASS = '''age = int(input())
output = ""
if age >= 20:
    pass
elif age > 12:
    pass
else:
    pass
print(output)'''


def age_empty_error():
    return compile_error(AGE_EMPTY)


def age_pass_out():
    return run(AGE_PASS, 15)


# ============================================== the second hook: Instagram Reels
# (handle, what it is, length in seconds, liked?). A reel you do not like is
# swiped away at SWIPE_AT seconds. How much of each reel plays is worked out by
# running the feed loop for real, with continue in it.
REELS = [("cricket.daily", "Last over, 6 needed", 15, True),
         ("hostel.kitchen", "5 minute Maggi hack", 20, False),
         ("funny.pets", "Cat meets cucumber", 12, True)]
SWIPE_AT = 3


def reels_played(word="continue"):
    """Seconds of each reel that actually play."""
    src = ("played = []\n"
           "for handle, title, secs, liked in reels:\n"
           f"    played.append({SWIPE_AT})\n"
           "    if not liked:\n"
           f"        {word}\n"
           "    played[-1] = secs\n")
    g = {"reels": REELS}
    exec(src, g)
    return g["played"]


# ===================================================================== the exit
EXIT_SRC = '''for m in marks:
    if m < 0:
        break
    if m < 35:
        continue
    print(m)'''
EXIT_OPTS = [[50, -1, 20], [20, 30, 40], [20, -1, 50], [35, 10, -1]]
EXIT_WHY = {
    (20, -1, 50): "20 is skipped by continue, then -1 hits break. 50 is never read. Nothing prints.",
    (50, -1, 20): "50 prints first. break stops the loop, but it cannot take back what is already printed.",
    (20, 30, 40): "continue skips 20 and 30 but the loop carries on, so 40 prints.",
    (35, 10, -1): "35 is not less than 35, so it prints. Then 10 is skipped and -1 ends the loop.",
}


def exit_out(marks):
    return lines_out("marks = " + repr(marks) + "\n" + EXIT_SRC)


def exit_right():
    hits = [i for i, v in enumerate(EXIT_OPTS) if not exit_out(v)]
    assert len(hits) == 1, hits
    return hits[0]


# =============================================================== the takeaways
def tk_rows():
    """(chip, code, what it prints, why). Every output is run, not typed."""
    return [
        ("pass", "if i == 3:\n    pass", shown(t3_out("pass")),
         "pass does nothing. It only fills a block that cannot be empty."),
        ("continue", "if i == 3:\n    continue", shown(t3_out("continue")),
         "continue skips the rest of this pass. 3 is never printed."),
        ("break", "if i == 3:\n    break", shown(t3_out("break")),
         "break leaves the loop. 3 and 4 never come."),
        ("break inside", "for b in range(4):\n    if b == 1: break",
         " / ".join(s.strip() for s in task1_out()),
         "break leaves only the loop it sits in. The outer loop carries on."),
        ("outside a loop", "for i in range(10):\n    print(i)\nbreak",
         compile_error(MACHINE[1]["src"]),
         "break and continue work only inside a loop. Nothing runs at all."),
    ]


# The room moves one number on the explainer: the value break waits for.
# 10 means it never breaks, so the loop ends by itself. Every choice is traced
# for real, so the card never walks a program it made up.
EXPL_STOPS = range(0, 11)
EXPL_DEFAULT = 2


def expl_src(n):
    return EXPL_SRC.replace("if i == 2:", f"if i == {n}:")


def expl_variants():
    return {str(n): trace(expl_src(n), strips=EXPL_STRIPS)["events"] for n in EXPL_STOPS}
