"""Every program, comparison and answer in session 18, run for real.

Nothing printed on a card, in the guide or in the checker is typed by hand:
each is read off a function here that runs the Python it describes.
"""
import contextlib
import io
import keyword


def run(src, inputs=()):
    """Run `src` with `inputs` fed to input(). Returns (printed lines, error)."""
    feed = iter(inputs)
    buf = io.StringIO()
    err = None
    env = {"input": lambda *a: next(feed)}
    try:
        code = compile(src, "<card>", "exec")
    except SyntaxError as e:
        return [], f"line {e.lineno}: SyntaxError: {e.msg}"
    with contextlib.redirect_stdout(buf):
        try:
            exec(code, env)
        except Exception as e:  # noqa: BLE001
            err = f"{type(e).__name__}: {e}"
    return buf.getvalue().splitlines(), err


# ============================================================ recap (match)
RECAP_TITLE = "One program, three words"
RECAP_SRC = (
    "for i in range(5):\n"
    "    if i == 2:\n"
    "        ____\n"
    "    print(i)")
RECAP_WORDS = ("break", "continue", "pass")
RECAP_ASK = "Line 3 is one of three words. Which word prints which output?"


def recap_src(word):
    return RECAP_SRC.replace("____", word)


def recap_out(word):
    out, err = run(recap_src(word))
    assert err is None
    return " ".join(out)


RECAP_WHY = {
    "break": "break leaves the loop at 2. Nothing after it prints.",
    "continue": "continue skips print(i) only for 2. The loop goes on.",
    "pass": "pass does nothing, so 2 prints like every other number.",
}


def recap_pairs():
    return [(f"Line 3 is `{w}`", f"`{recap_out(w)}`", RECAP_WHY[w]) for w in RECAP_WORDS]


# ============================================================ the hook
HOOK_SAVED = "sunny@123"
HOOK_TYPED = HOOK_SAVED.upper()          # Caps Lock on: every letter comes out capital


def hook_pairs():
    """(saved char, typed char, saved number, typed number, same?)"""
    return [(a, b, ord(a), ord(b), a == b) for a, b in zip(HOOK_SAVED, HOOK_TYPED)]


# ============================================================ slides 8 to 14
S10 = 'unicode_value = ord("A")\nprint(unicode_value)'
S14 = "for unicode_value in range(65, 91):\n    print(chr(unicode_value))"

# ============================================================ worksheet task 1
T1 = [
    ("loop", "for code in range(97, 102):\n    print(chr(code))"),
    ("gap", 'print(ord("a") - ord("A"))'),
    ("cap", 'print(chr(ord("g") - 32))'),
]


def t1_out(i):
    out, err = run(T1[i][1])
    assert err is None
    return out


# ============================================================ compare, letter by letter
def compare_walk(a, b):
    """The pairs Python looks at, in order, and where it stops.

    Returns a list of steps. Each step is one of
      ("same", i)            a[i] == b[i], move on
      ("diff", i)            a[i] != b[i], this pair decides
      ("out", i, who)        one string has no letter at i; who ran out ("a", "b" or "both")
    The last step is always the deciding one.
    """
    steps = []
    i = 0
    while True:
        if i >= len(a) or i >= len(b):
            who = "both" if len(a) == len(b) else ("a" if len(a) < len(b) else "b")
            steps.append(("out", i, who))
            return steps
        if a[i] == b[i]:
            steps.append(("same", i))
            i += 1
            continue
        steps.append(("diff", i))
        return steps


def op_result(a, op, b):
    return {"<": a < b, ">": a > b, "<=": a <= b, ">=": a >= b, "==": a == b,
            "!=": a != b}[op]


def walk_says(a, op, b):
    """What the walk decides, in its own terms, checked against Python."""
    st = compare_walk(a, b)
    last = st[-1]
    if last[0] == "diff":
        i = last[1]
        x, y = ord(a[i]), ord(b[i])
        decided = {"<": x < y, ">": x > y, "<=": x <= y, ">=": x >= y,
                   "==": False, "!=": True}[op]
    else:
        who = last[2]
        # the one that ran out first is the smaller; both out means equal
        la, lb = (0, 1) if who == "a" else (1, 0) if who == "b" else (0, 0)
        decided = {"<": la < lb, ">": la > lb, "<=": la <= lb, ">=": la >= lb,
                   "==": la == lb, "!=": la != lb}[op]
    assert decided == op_result(a, op, b), (a, op, b)
    return decided


# the explainer: slide 19's own example, and a slider for the second word
EXPL = ("BAD", ">=", "BAT")
EXPL_WORDS = ["BAT", "CAT", "BAC", "BA", "bad"]

# the machine: one misconception per level
MACHINE = [
    {"a": "a", "op": ">", "b": "A", "tag": "small or capital",
     "trap": "Most say False: A comes first in the alphabet, so it must be bigger."},
    {"a": "Zebra", "op": "<", "b": "apple", "tag": "not the alphabet",
     "trap": "Z is the last letter, so most say False."},
    {"a": "BAT", "op": ">", "b": "BALL", "tag": "longer is not bigger",
     "trap": "BALL has more letters, so most say False."},
    {"a": "98", "op": "<=", "b": "123", "tag": "numbers in quotes",
     "trap": "98 is less than 123, so most say True."},
    {"a": "ravi", "op": "==", "b": "Ravi", "tag": "same name?",
     "trap": "It is the same name, so most say True."},
    {"a": "98", "op": "<", "b": "984", "tag": "one runs out",
     "trap": "Nothing is different, so most say False."},
]


def machine_answer(lv):
    return walk_says(lv["a"], lv["op"], lv["b"])


def cmp_src(a, op, b):
    return f'print("{a}" {op} "{b}")'


# ============================================================ tap to classify
CLASSIFY = [
    ("User_name", None),
    ("in", 4),
    ("(yes no)?", 2),
    ("1_age", 3),
    ("_player_age", None),
    ("total.bill", 2),
    ("While", None),
    ("ravi_kumar2", None),
]
REFUSE_SAYS = {
    "in": "Rule 4: in is a keyword. Python keeps it for itself.",
    "(yes no)?": "Rule 2: a space, brackets and ? are not allowed.",
    "1_age": "Rule 3: it begins with a digit.",
    "total.bill": "Rule 2: a dot is a special character. Instagram allows it, Python does not.",
}
ACCEPT_SAYS = {
    "User_name": "Letters and an underscore. It begins with a letter.",
    "_player_age": "It may begin with an underscore.",
    "While": "Capital W. Python keywords are small, so While is not one.",
    "ravi_kumar2": "Digits are fine after the first letter.",
}


def accepts(name):
    """Does Python accept it as a variable name? Asked of Python itself."""
    ok = name.isidentifier() and not keyword.iskeyword(name)
    _, err = run(f"{name} = 1")
    assert ok == (err is None), name
    return ok


def classify_rows():
    rows = []
    for name, rule in CLASSIFY:
        ok = accepts(name)
        assert ok == (rule is None), name
        why = ACCEPT_SAYS[name] if ok else REFUSE_SAYS[name]
        rows.append((name, ok, why))
    return rows


# ============================================================ worksheet task 4
T4_SRC = (
    "1st_price = 40\n"
    "second price = 60\n"
    "total-bill = 1st_price + second price\n"
    "print(total-bill)")
T4_FIXED = (
    "first_price = 40\n"
    "second_price = 60\n"
    "total_bill = first_price + second_price\n"
    "print(total_bill)")


def t4_error():
    out, err = run(T4_SRC)
    assert out == [] and err
    return err


def t4_error_line():
    return int(t4_error().split(":")[0].split()[1])


def t4_fixed_out():
    out, err = run(T4_FIXED)
    assert err is None
    return out


def t4_bad_lines():
    """Each line alone: which ones Python refuses."""
    bad = []
    for n, ln in enumerate(T4_SRC.split("\n"), 1):
        _, err = run(ln.replace("print(total-bill)", "total-bill"))
        if err and "SyntaxError" in err:
            bad.append(n)
    return bad


# ============================================================ case styles, best name
BEST_OPTS = ["sum", "sumofevenums", "sum_of_even_numbers", "sumofevennumbers"]
BEST = "sum_of_even_numbers"

# ============================================================ exit
EXIT_SRC = (
    "name = input()\n"
    'if name >= "A" and name < "N":\n'
    '    print("Hall 1")\n'
    'elif name >= "N" and name <= "Z":\n'
    '    print("Hall 2")')
EXIT_OPTS = ["Arun", "N", "Nandu", "Zoya"]
EXIT_WHY = {
    "Arun": 'A is 65 and N is 78. "Arun" is less than "N", so it prints Hall 1.',
    "N": '"N" >= "N" is True, so it prints Hall 2. Equal counts for >=.',
    "Nandu": '"Nandu" starts with N, then has more letters, so it is bigger than '
             '"N" and smaller than "Z". Hall 2.',
    "Zoya": 'Z = Z, then "Z" runs out. The shorter one is smaller, so "Zoya" > "Z". '
            "Both conditions are False. Nothing prints.",
}


def exit_out(name):
    out, err = run(EXIT_SRC, [name])
    assert err is None
    return out


def exit_right():
    silent = [i for i, n in enumerate(EXIT_OPTS) if exit_out(n) == []]
    assert len(silent) == 1, silent
    return silent[0]


# ============================================================ takeaways
def tk_rows():
    """(heading, code, what it gives, why). Every 'gives' is run."""
    rows = [
        ("A letter is a number", 'print(ord("A"))', None,
         "ord() gives the number. Capitals run 65 to 90."),
        ("A number is a letter", "print(chr(97))", None,
         "chr() goes the other way. Small letters run 97 to 122."),
        ("Small beats capital", 'print("a" > "A")', None,
         "97 is more than 65. It is not the alphabet."),
        ("First different letter", 'print("BAT" > "BALL")', None,
         "B = B, A = A, then T (84) beats L (76). Length does not count."),
        ("One runs out", 'print("98" < "984")', None,
         "9 = 9, 8 = 8, then \"98\" has nothing left. Shorter is smaller."),
        ("A good name", "total_bill = 90", None,
         "Letters, digits and _ only. No digit first. No keyword. snake_case."),
    ]
    out = []
    for h, code, _g, why in rows:
        got, err = run(code)
        if got:
            g = got[0]
        else:
            assert err is None
            g = "Python accepts it"
        out.append((h, code, g, why))
    return out


# ============================================================ self-check
if __name__ == "__main__":
    for w in RECAP_WORDS:
        print(w, "->", recap_out(w))
    print("hook", hook_pairs())
    for i in range(3):
        print("t1", i, t1_out(i))
    print("expl", EXPL, compare_walk(EXPL[0], EXPL[2]), walk_says(*EXPL))
    for lv in MACHINE:
        print("mc", lv["a"], lv["op"], lv["b"], compare_walk(lv["a"], lv["b"]), machine_answer(lv))
    for r in classify_rows():
        print("cl", r)
    print("t4", t4_error(), t4_error_line(), t4_bad_lines(), t4_fixed_out())
    print("exit", [(n, exit_out(n)) for n in EXIT_OPTS], exit_right())
    for r in tk_rows():
        print("tk", r)
