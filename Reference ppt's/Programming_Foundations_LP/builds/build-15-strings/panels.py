"""The data every answer in this plan is derived from.

Nothing here states an answer as a string a human typed. `check_answers.py`
imports this module, recomputes every printed value by running the real thing,
and greps the guide for each one.
"""

# =============================================================== the recap card
# Session 14 was the for loop and range. Session 12 used `bug`, session 14 used
# `match`, so this one is `sort`: the room does not meet the same shape two
# sessions running.
#
# It is not decoration. Today every slice carries a stop index that is never
# reached, so the last thing the room should touch before the hook is the same
# rule on range.
RECAP_TITLE = 'What range(2, 6) hands you'
RECAP_ASK = ('Say where each number goes before we drop it. In the sequence, '
             'or not in it.')
RECAP_BINS = ('In the sequence', 'Not in it')
RECAP_RANGE = (2, 6)
RECAP_NUMS = [2, 1, 5, 6, 4]


def recap_seq(rng=RECAP_RANGE):
    """The sequence itself, produced by running range, never typed."""
    return list(range(*rng))


def recap_chips():
    """Each chip's bin is decided by asking the sequence, not by hand."""
    seq = recap_seq()
    lo, hi = RECAP_RANGE
    why = {
        2: f'The start is included, so the sequence begins at {lo}.',
        1: f'The sequence starts at {lo}. Nothing before it comes out.',
        5: f'{hi - 1} is the last number it gives.',
        6: f'The stop value is never reached. It stops before {hi}.',
        4: 'It sits between the start and the stop, so it comes out.',
    }
    return [(f'`{n}`', 'left' if n in seq else 'right', why[n])
            for n in RECAP_NUMS]


# ==================================================================== the hook
# People stretch text out in chat: S O R R Y, H A P P Y. Everyone in the room
# has done it or had it done at them. Then the search box cannot find it,
# because the message is not five characters, it is nine, and four of them are
# spaces. That is the whole session in one screen: a space is a character, and
# the letters you want sit at every second index.
HOOK_MSG = 'S O R R Y'
HOOK_WORD = 'SORRY'
HOOK_RUN = (0, 5)          # a plain slice: a run of characters, side by side
HOOK_JUMP = (0, 9, 2)      # the same start, jumping two at a time


def hook_run_out():
    return HOOK_MSG[HOOK_RUN[0]:HOOK_RUN[1]]


def hook_jump_out():
    return HOOK_MSG[HOOK_JUMP[0]:HOOK_JUMP[1]:HOOK_JUMP[2]]


def hook_letter_positions():
    return [i for i, c in enumerate(HOOK_MSG) if c != ' ']


def hook_search_hits():
    """Why the search finds nothing, by asking rather than asserting."""
    return HOOK_WORD in HOOK_MSG


# ====================================== the two animated slicing panels
# Slide 12 and slide 17 are flat pictures of a finished slice. Redrawn here so
# the characters actually come out of the string one at a time, under the
# deck's own chrome.
PULL_SRC = 'Hi Ravi'
PULL_SLICE = (3, 7)
PULL_EXTRA = (0, 2)

JUMP_SRC = '-R-a-v-i-'
JUMP_SLICE = (1, 8, 2)


def pull_out(a=None, b=None):
    a = PULL_SLICE[0] if a is None else a
    b = PULL_SLICE[1] if b is None else b
    return PULL_SRC[a:b]


def pull_indexes():
    return list(range(*PULL_SLICE))


def jump_out():
    return JUMP_SRC[JUMP_SLICE[0]:JUMP_SLICE[1]:JUMP_SLICE[2]]


def jump_landings():
    return list(range(*JUMP_SLICE))


def jump_untouched():
    return [i for i in range(len(JUMP_SRC)) if i not in jump_landings()]


# =========================================== worksheet task 1, and the machine
# One string for both. The room writes three answers down, then the machine
# runs those same three in front of them before it goes anywhere new.
SLICE_SRC = 'a1b2c3d4'

TASK1_SLICES = [(0, 8, 2), (1, 8, 2), (1, 6, 3)]
MACHINE_EXTRA = [(2, 8, 3), (6, 2, 2)]


def sl(a, b, c, s=SLICE_SRC):
    """Every claimed output in the plan comes out of this one call."""
    return s[a:b:c]


def expr(a, b, c, name='code'):
    """A step of 1 is not written out. Nobody types `[0:4:1]`, and a takeaway
    card that does looks like a thing to memorise rather than a thing to use."""
    return f'{name}[{a}:{b}]' if c == 1 else f'{name}[{a}:{b}:{c}]'


def landings(a, b, c, s=SLICE_SRC):
    """The indexes the slice actually lands on, in order."""
    return list(range(a, b, c)) if c > 0 else []


# The four options for each machine level. The right one is found by running
# the slice, never by marking it here.
# The right option sits in a different place on every level, so a room that has
# spotted a pattern in the letters has spotted nothing.
MACHINE_OPTS = {
    (0, 8, 2): ['a1b2', 'abcd', '1234', 'abc'],
    (1, 8, 2): ['abcd', '1b2c', '1234', '123'],
    (1, 6, 3): ['12c', '1c', '1b2c3', '1c4'],
    (2, 8, 3): ['b2c', 'bc4', 'b34', 'b3'],
    (6, 2, 2): ['d4', 'nothing at all', '4d', 'c3d'],
}

MACHINE_WHY = {
    (0, 8, 2): 'Starts at 0 and jumps two, so it lands on 0, 2, 4, 6.',
    (1, 8, 2): 'Same jump, one place later, so it lands on 1, 3, 5, 7.',
    (1, 6, 3): 'Lands on 1, then 4. The next one would be 7, and 7 is not '
               'under 6, so it stops.',
    (2, 8, 3): 'Lands on 2, then 5. The next would be 8, and the stop is 8, '
               'so it stops.',
    (6, 2, 2): 'The start is already past the stop, so it never lands '
               'anywhere. You get an empty string, and print shows a blank '
               'line.',
}

MACHINE_LEVELS = TASK1_SLICES + MACHINE_EXTRA


def machine_answer(lv):
    """Which option is right, decided by running the slice."""
    out = sl(*lv)
    want = out if out else 'nothing at all'
    opts = MACHINE_OPTS[lv]
    return opts.index(want)


# ============================================================ worksheet task 2
# Type it, then two changes. The second one is framed as the instructor's own
# idea, and it fails in a way nobody expects: no error, and a blank line.
TASK2_SRC = 'code = "a1b2c3d4"\nprint(code[1:8:2])\n'
TASK2_EDIT = (0, 8, 2)
TASK2_BACKWARDS = (1, 8, -2)


def task2_first():
    return sl(1, 8, 2)


def task2_edit_out():
    return sl(*TASK2_EDIT)


def task2_backwards_out():
    a, b, c = TASK2_BACKWARDS
    return SLICE_SRC[a:b:c]


# ================================================ why a string method at all
# The transcript's own scenario, and the reason the second half exists: an app
# asks for a 4 digit PIN and has to know that every character is a digit. The
# long way is a loop with ten comparisons inside it. The short way is one
# method. Nothing here is asserted: `why_long_out` RUNS the long program and
# `check_answers.py` asserts its answer agrees with `isdigit`.
WHY_PIN = '4748'
WHY_BAD = '47a8'
DIGITS = '0123456789'

WHY_LONG_SRC = (
    'pin = "47a8"\n'
    'all_digits = True\n'
    'for ch in pin:\n'
    '    if (ch != "0" and ch != "1" and ch != "2" and\n'
    '        ch != "3" and ch != "4" and ch != "5" and\n'
    '        ch != "6" and ch != "7" and ch != "8" and\n'
    '        ch != "9"):\n'
    '        all_digits = False\n'
    'print(all_digits)\n'
)
WHY_SHORT_SRC = (
    'pin = "47a8"\n'
    'print(pin.isdigit())\n'
)


def why_long_out(pin=WHY_BAD):
    """The long program's answer, produced by running the long program."""
    all_digits = True
    for ch in pin:
        if (ch != "0" and ch != "1" and ch != "2" and
                ch != "3" and ch != "4" and ch != "5" and
                ch != "6" and ch != "7" and ch != "8" and
                ch != "9"):
            all_digits = False
    return all_digits


def why_short_out(pin=WHY_BAD):
    return pin.isdigit()


def why_checks(pin=WHY_BAD):
    """How many comparisons the long way actually makes."""
    return len(pin) * len(DIGITS)


def why_lines():
    """The two programs, in lines. The gap is the whole argument."""
    return (len(WHY_LONG_SRC.rstrip().split('\n')),
            len(WHY_SHORT_SRC.rstrip().split('\n')))


def why_bad_index(pin=WHY_BAD):
    """Which box holds the character that is not a digit."""
    return [i for i, c in enumerate(pin) if not c.isdigit()]


# ============================= the method cards: the line, then what it does
# Every method beat opens on ONE line of code with an empty output box, and the
# room says what it prints before anything runs. The deck's own definition
# slide follows. Code first, then the information: a definition read before the
# example is a definition nobody has a use for yet.
ISDIGIT_SRC = 'pin = "4748"\nprint(pin.isdigit())\n'
ISDIGIT_PIN = '4748'
ISDIGIT_BAD = '984a'
ISDIGIT_SHAPE = 'str_var.isdigit()'
ISDIGIT_LINE = ('Gives <b>True</b> when every single character is a digit. '
                'One character that is not, and it is <b>False</b>.')


def isdigit_marks(pin):
    """One tick or one cross per character, worked out rather than drawn."""
    return [(c, c.isdigit()) for c in pin]


def isdigit_out(pin):
    return pin.isdigit()


STRIP_SRC = 'mobile = "  9876543210  "\nprint(mobile.strip())\n'
STRIP_RAW = '  9876543210  '
STRIP_SHAPE = 'str_var.strip()'
STRIP_LINE = ('Takes the spaces off the <b>front</b> and off the <b>back</b>. '
              'It never touches the middle.')


def strip_out(raw=STRIP_RAW):
    return raw.strip()


def strip_ends(raw=STRIP_RAW):
    left, right, kept, _never = strip_walk(raw, None)
    return left, right, kept


# ============ the other three methods, each on one card with its own output
# Every method in the second half now arrives in the same rhythm: one line of
# code, an empty output box, the room says what it prints, it runs, and the
# shape and the sentence come last. The deck's definition slides are gone.
# Press 3 of the card already carries the deck's own wording, and putting the
# same words on the next card is the repetition this session was rejected for.
REPLACE_SRC = ('line = "teh cat and teh dog"\n'
               'print(line.replace("teh", "the"))\n')
REPLACE_RAW = 'teh cat and teh dog'
REPLACE_OLD = 'teh'
REPLACE_NEW = 'the'
REPLACE_SHAPE = 'str_var.replace(old, new)'
REPLACE_LINE = ('Swaps <b>every</b> one it finds, not only the first. '
                'Nothing else in the line is touched.')


def replace_out(raw=REPLACE_RAW):
    return raw.replace(REPLACE_OLD, REPLACE_NEW)


def replace_words(raw=REPLACE_RAW):
    """One chip per word, and whether replace rewrites that chip."""
    return [(w, w == REPLACE_OLD) for w in raw.split(' ')]


def replace_hits(raw=REPLACE_RAW):
    return raw.count(REPLACE_OLD)


STARTS_SRC = ('url = "https://onthegomodel.com"\n'
              'print(url.startswith("https://"))\n')
STARTS_RAW = 'https://onthegomodel.com'
STARTS_PRE = 'https://'
STARTS_SHAPE = 'str_var.startswith(text)'
STARTS_LINE = ('Answers one question: does the string <b>begin</b> with that '
               'text? You get <b>True</b> or <b>False</b>, never a string.')
STARTS_OTHER = 'http://onthegomodel.com'
TK_URL = 'https://nxtwave.in'


def starts_out(raw=STARTS_RAW, pre=STARTS_PRE):
    return raw.startswith(pre)


def starts_other():
    return STARTS_OTHER.startswith(STARTS_PRE)


def starts_window(pre=STARTS_PRE):
    """The boxes startswith actually looks at, and it stops there."""
    return list(range(len(pre)))


UPPER_SRC = ('name = "Ravi"\n'
             'print(name.upper())\n'
             'print(name.lower())\n')
UPPER_RAW = 'Ravi'
UPPER_SHAPE = 'str_var.upper()'
UPPER_LINE = ('Hands back a new string with every letter capital. '
              '<b>lower</b> is the same method the other way round.')


def upper_out(raw=UPPER_RAW):
    return raw.upper()


def lower_out(raw=UPPER_RAW):
    return raw.lower()


def upper_pairs(raw=UPPER_RAW):
    return [(c, c.upper(), c.lower()) for c in raw]


# ================================================== the two takeaway boards
# No map. A map of a slice was a picture of nothing, and the room asked for the
# examples back, so the takeaway IS the examples: one row per press, each with
# the output it actually produces. A student can photograph either card and
# have a reference that works.
TK_SLICE_ROWS = [
    ((0, 4, 1), 'A run. It stops before 4, so box 4 never comes out.'),
    ((0, 8, 2), 'A jump of 2 from the start. It lands on 0, 2, 4, 6.'),
    ((1, 6, 3), 'Lands on 1, then 4. The next would be 7, past the stop.'),
    ((6, 2, 2), 'The start is already past the stop, so nothing comes out.'),
]


def tk_slice():
    """(expression, what it gives, the reason). Every value run, never typed."""
    return [(expr(*lv), sl(*lv), why) for lv, why in TK_SLICE_ROWS]


def tk_slice_rules():
    return [
        ('the stop number is never reached',
         'range did this last session. A slice does it today.'),
        ('your own string never changes',
         f'{SLICE_SRC!r} still holds all {len(SLICE_SRC)} characters after '
         'every line above.'),
    ]


def tk_methods():
    """One row per method, and the line comes back in TWO pieces.

    The takeaway cell used to hold the whole line as one string, and the
    longest of them wrapped inside a token: `"htt` on one line and `ps://"` on
    the next. A broken token on the card a student photographs is worse than a
    smaller font. So the subject and the call are separate, the cell puts one
    under the other, and nothing has to break anywhere.

    The kind is decided by asking the value what it is, not by hand.
    """
    rows = [
        ('isdigit', f'"{ISDIGIT_PIN}"', '.isdigit()', isdigit_out(ISDIGIT_PIN)),
        ('strip', '" 9876543210 "', '.strip()', ' 9876543210 '.strip()),
        ('replace', '"teh cat"', '.replace("teh", "the")',
         'teh cat'.replace('teh', 'the')),
        # a short real address: the teaching card carries the long one
        ('startswith', f'"{TK_URL}"', f'.startswith("{STARTS_PRE}")',
         TK_URL.startswith(STARTS_PRE)),
        ('upper', f'"{UPPER_RAW}"', '.upper()', upper_out()),
    ]
    return [(name, subj, call, val,
             'answers a question' if isinstance(val, bool)
             else 'hands back a string')
            for name, subj, call, val in rows]


def tk_method_split():
    """How many answer a question, and how many hand back a new string."""
    kinds = [r[4] for r in tk_methods()]
    return kinds.count('answers a question'), kinds.count('hands back a string')


# ============================================================= strip, in words
def strip_walk(s, chars=None):
    """Where strip stops, worked out one character at a time.

    Returns (left_eaten, right_eaten, kept, never_reached) as index lists, so
    the walker, the guide and the checker all read from one place.
    """
    target = ' \t\n' if chars is None else chars
    i, j = 0, len(s) - 1
    left, right = [], []
    while i <= j and s[i] in target:
        left.append(i)
        i += 1
    while j >= i and s[j] in target:
        right.append(j)
        j -= 1
    kept = list(range(i, j + 1))
    never = [k for k in kept if s[k] in target]
    return left, right, kept, never


WALK_SRC = '--Ra-vi--'
WALK_SETS = [None, '-', '-i', '-iR']


def walk_out(chars):
    return WALK_SRC.strip() if chars is None else WALK_SRC.strip(chars)


def walk_label(chars):
    return 'strip()' if chars is None else f'strip("{chars}")'


# ============================================================ worksheet task 3
TASK3_SRC = (
    'pin = "  0912  "\n'
    'pin = pin.strip()\n'
    'pin = pin.strip("0")\n'
    'if pin.isdigit():\n'
    '    print(pin[0:4:2])\n'
    'else:\n'
    '    print("no")\n'
)
TASK3_START = '  0912  '
TASK3_SLICE = (0, 4, 2)


def task3_rows():
    """One row per line of the program, in the order the machine runs them.

    (line number, what pin holds afterwards, what was printed). A line that
    never runs is not in this list, which is what makes the blank rows a real
    check.
    """
    rows = []
    pin = TASK3_START
    rows.append((1, pin, ''))
    pin = pin.strip()
    rows.append((2, pin, ''))
    pin = pin.strip('0')
    rows.append((3, pin, ''))
    ok = pin.isdigit()
    rows.append((4, pin, ''))
    if ok:
        a, b, c = TASK3_SLICE
        rows.append((5, pin, pin[a:b:c]))
    else:
        rows.append((7, pin, 'no'))
    return rows


TASK3_LINES = 7


def task3_blank_rows():
    ran = {r[0] for r in task3_rows()}
    return [n for n in range(1, TASK3_LINES + 1) if n not in ran]


def task3_printed():
    return [r[2] for r in task3_rows() if r[2]]


# ============================================================ worksheet task 4
TASK4_GIVEN = (
    'url = "https://onthegomodel.com"\n'
    'is_secure = url.startswith("https://")\n'
    'print(is_secure)\n'
)
TASK4_ANSWER = (
    'email = "rahul123@gmail.com"\n'
    'is_gmail = email.endswith("@gmail.com")\n'
    'print(is_gmail)\n'
)
TASK4_EMAIL = 'rahul123@gmail.com'
TASK4_ENDING = '@gmail.com'


def task4_out(email=TASK4_EMAIL, ending=TASK4_ENDING):
    return email.endswith(ending)


def task4_other():
    return 'rahul123@yahoo.com'.endswith(TASK4_ENDING)


# ==================================================== the deck's own claims
# Every output the kept slides print, run rather than copied off the picture.
DECK_CLAIMS = {
    'slide 12': ('"Hi Ravi"[3:7]', 'Hi Ravi'[3:7]),
    'slide 17': ('"-R-a-v-i-"[1:8:2]', '-R-a-v-i-'[1:8:2]),
    'slide 30': ('" 9876543210 " == "9876543210"',
                 ' 9876543210 ' == '9876543210'),
    'slide 35': ('"M.Ravi.".strip(".")', 'M.Ravi.'.strip('.')),
    'slide 36': ('", .. ,, ravi ,, .. .".strip(" ,.")',
                 ', .. ,, ravi ,, .. .'.strip(' ,.')),
}


# ================================================================= the exit MCQ
EXIT_SRC = (
    'pin = input()\n'
    'pin = pin.strip("-0")\n'
    'if pin.isdigit():\n'
    '    if len(pin) == 4:\n'
    '        print("Valid")\n'
)
EXIT_CODE = (
    '<span class="no">1</span>pin = <i>input</i>()\n'
    '<span class="no">2</span>pin = pin.<i>strip</i>(<em>"-0"</em>)\n'
    '<span class="no">3</span><b>if</b> pin.<i>isdigit</i>():\n'
    '<span class="no">4</span>    <b>if</b> <i>len</i>(pin) == <i>4</i>:\n'
    '<span class="no">5</span>        <b>print</b>(<em>"Valid"</em>)'
)
EXIT_STRIP = '-0'
EXIT_INPUTS = ['0-4748-0', '-4-748-', '00474800', '-47480-']


def exit_run(raw):
    """What the program prints for one typed input, by running it."""
    pin = raw.strip(EXIT_STRIP)
    if pin.isdigit() and len(pin) == 4:
        return ['Valid']
    return []


def exit_after_strip(raw):
    return raw.strip(EXIT_STRIP)


EXIT_RIGHT = [i for i, raw in enumerate(EXIT_INPUTS) if not exit_run(raw)]


def exit_why(raw):
    """One line per option, every number in it computed."""
    left = exit_after_strip(raw)
    if exit_run(raw):
        return (f'Both ends come off down to {left!r}, which is all digits and '
                f'{len(left)} long, so it prints Valid.')
    return (f'Both ends come off down to {left!r}. The dash in the middle was '
            f'never reached, so isdigit is False and line 4 is never even '
            f'asked. Nothing is printed.')
