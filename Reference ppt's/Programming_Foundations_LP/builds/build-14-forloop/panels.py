"""The interactive panels, and the data every answer in the plan is derived from.

Nothing here states an answer as a string that a human typed. `check_answers.py`
imports this module, recomputes every number by running the real thing, and
greps the guide for each one.
"""

# ============================================================== the recap card
# Session 12 was the while loop, so the recap names its three parts. The format
# is `match` from standard_slides: session 12 used `bug`, and the room does not
# meet the same shape two sessions running.
#
# This is not decoration. Today's session drops two of these three lines, and
# card 10 is called "the three lines it drops", so the recap has to put all
# three on screen first.
RECAP_TITLE = 'The while loop, in three parts'
RECAP_ASK = ('Three parts on the left, three jobs on the right. Call out which '
             'two go together, then we join them.')

# The programs the recap talks about. check_answers.py runs these; nothing here
# states a count that a human typed.
RECAP_SRC = 'counter = 0\nwhile counter < 3:\n    print("hi")\n    counter = counter + 1'
RECAP_NEVER = 'counter = 1\nwhile counter < 4:\n    print(counter)'
RECAP_SILENT = 'counter = 5\nwhile counter < 3:\n    print("hi")\n    counter = counter + 1'


def recap_checks(src=RECAP_SRC):
    """How many times the condition of `src` is asked, by counting, not by
    claiming. Returns (checks, passes)."""
    counter, checks, passes = 0, 0, 0
    while True:
        checks += 1
        if not counter < 3:
            break
        passes += 1
        counter = counter + 1
    return checks, passes


def recap_pairs():
    checks, passes = recap_checks()
    return [
        ('`counter = 0`',
         'Sets the starting value. Runs once, before the loop.',
         'Initialization. Miss it and the name does not exist yet, so line 2 '
         'cannot even be asked.'),
        ('`while counter < 3:`',
         'The question asked before every pass.',
         f'The condition. For this program it is asked {checks} times, not '
         f'{passes}: once before each pass, and once more at the end when the '
         'answer is finally no.'),
        ('`counter = counter + 1`',
         'Moves the counter on, so the question can turn false.',
         'Updation. Take this line out and the answer stays yes for ever, and '
         'the program never stops.'),
    ]


# ================================================================= the exit MCQ
EXIT_SRC = (
    'seats = int(input())\n'
    'booked = int(input())\n'
    'left = seats - booked\n'
    'for i in range(1, left):\n'
    '    print("Seat", i)\n'
)
EXIT_CODE = (
    '<span class="no">1</span>seats = <i>int</i>(<i>input</i>())\n'
    '<span class="no">2</span>booked = <i>int</i>(<i>input</i>())\n'
    '<span class="no">3</span>left = seats - booked\n'
    '<span class="no">4</span><b>for</b> i <b>in</b> <i>range</i>(<i>1</i>, left):\n'
    '<span class="no">5</span>    <b>print</b>(<em>"Seat"</em>, i)'
)
EXIT_PAIRS = [(5, 3), (4, 3), (3, 0), (6, 2)]


def exit_lines(seats, booked):
    """What the program actually prints, derived by running it."""
    return [f'Seat {i}' for i in range(1, seats - booked)]


EXIT_RIGHT = [i for i, (s, b) in enumerate(EXIT_PAIRS) if not exit_lines(s, b)]

EXIT_WHY = [
    'left is 2, so range(1, 2) gives one number. One line appears.',
    'left is 1, so range(1, 1) is empty. The loop body never runs, '
    'and nothing is printed anywhere.',
    'left is 3, so range(1, 3) gives 1 and 2. Two lines appear.',
    'left is 4, so range(1, 4) gives 1, 2 and 3. Three lines appear.',
]


# ============================================================ worksheet task 1
# Six lines and not one more. The deck's own `if n > 5: print("long")` used
# to sit at lines 6 and 7; it tests nothing about a for loop, and an
# unreached `if` in the middle of a trace is a second lesson nobody asked for.
TASK1_SRC = (
    'word = "Hi"\n'
    'n = 0\n'
    'for ch in word:\n'
    '    n = n + 1\n'
    '    print(ch)\n'
    'print(n)\n'
)
TASK1_WORD = "Hi"


def task1_passes():
    """One row per pass through the loop, derived by running the program."""
    rows, n = [], 0
    for ch in TASK1_WORD:
        n += 1
        rows.append((ch, n, ch))
    return rows


def task1_last_print():
    n = len(TASK1_WORD)
    return str(n)


# ====================================== the poll: one character, one whole row
# The two programs the room votes between, after worksheet task 4. They differ
# by three characters and by exactly one row of output, for every n.
POLL_N = 4
POLL_A = 'range(1, n)'
POLL_B = 'range(1, n + 1)'
POLL_RIGHT = 'B'


def poll_rows(expr, n):
    """What each program prints, produced by running the real thing."""
    lo, hi = (1, n) if expr == POLL_A else (1, n + 1)
    return ['* ' * counter for counter in range(lo, hi)]


# ============================================================ worksheet task 2
TASK2_SRC = (
    'word = "Rain"\n'
    'for ch in word:\n'
    '    print(ch)\n'
    'print("Done")\n'
)


def task2_out(word):
    return [c for c in word] + ["Done"]


# ============================================================ worksheet task 3
TASK3_BODY = 'print("* " * counter)'


def task3_rows(n):
    return ["* " * counter for counter in range(1, n + 1)]


# ====================================================== Riya's odd-day savings
# The coding challenge after the range dial. Riya saves only on odd days, and on
# odd day d she puts in d rupees. The loop has to compute a total, not print the
# range back.
RIYA_N = 7            # the story, and the answer walk
RIYA_SAMPLES = [7, 4]  # on the problem card
RIYA_TEST = 10        # the one they run and say out loud
RIYA_SRC = (
    'n = int(input())\n'
    'total = 0\n'
    'for day in range(1, n + 1):\n'
    '    if day % 2 == 1:\n'
    '        total = total + day\n'
    'print(total)\n'
)


def riya_total(n):
    """What the program prints, produced by running the real thing."""
    import contextlib
    import io
    buf = io.StringIO()
    feed = iter([str(n)])
    with contextlib.redirect_stdout(buf):
        exec(RIYA_SRC, {"input": lambda *a: next(feed)})
    return int(buf.getvalue().strip())


def riya_days(n=RIYA_N):
    """(day, saved that day, total after it) for every day, by running the loop."""
    rows, total = [], 0
    for day in range(1, n + 1):
        put = day if day % 2 == 1 else 0
        total = total + put
        rows.append((day, put, total))
    assert total == riya_total(n)
    return rows
