"""The method card: one line of code, then what it does.

**Every method in the second half arrives on exactly one card.** That is the
whole shape, and it is the shape the old plan did not have: it showed a method
card, then the deck's definition slide saying the same thing in the same words,
then the next method. The room had read the sentence before it was said and
heard it after. The definition slides are gone. Press 3 of the card carries the
deck's own wording, and that is the only place it appears.

    press 1   the code, and an empty output box. What does this print?
    press 2   it runs, and the mechanism runs with it
    press 3   the shape, and one line of what it does
    press 4   (isdigit and upper only) the second case on the same card

The mechanism is what makes each card different, and it is always the thing the
method actually does:

    isdigit      every character is ticked or crossed in turn
    strip        the spaces at the two ends drop away
    replace      the two wrong words flip, and nothing else moves
    startswith   the front of the string is framed, and it stops there
    upper        every letter turns into its capital, in place

All of it is `opacity` and `transform` on small elements, staggered 70ms.
"""
import html

import codecard as CODE
import panels as P


def _row(text, marks=None, off=None, cls=""):
    """One box per character. `marks` is a list of (character, True/False) per
    character, `off` a set of indexes that fall away when the method runs."""
    out = ""
    for i, ch in enumerate(text):
        space = ch == ' '
        k = f' ch{" sp" if space else ""}'
        if marks is not None:
            k += ' yes' if marks[i][1] else ' no'
        if off and i in off:
            k += ' off'
        tag = ''
        if marks is not None:
            tag = ('<i>&#10003;</i>' if marks[i][1]
                   else '<i>&#10007;</i>')
        glyph = '&middot;' if space else html.escape(ch)
        out += (f'<span class="{k.strip()}" '
                f'style="transition-delay:{min(i, 13) * 70}ms">{glyph}'
                f'{tag}</span>')
    return f'<div class="mthrow {cls}">{out}</div>'


def _fliprow(triples, cls=""):
    """One box per character, each holding all three readings of it: what was
    typed, what upper gives, and what lower gives. The glyph swaps in place, so
    the room watches the same characters change rather than a second row
    appearing underneath and a third one after that."""
    out = ""
    for i, (was, up, lo) in enumerate(triples):
        out += (f'<span class="ch flip" '
                f'style="transition-delay:{min(i, 13) * 70}ms">'
                f'<span class="g0">{html.escape(was)}</span>'
                f'<span class="g1">{html.escape(up)}</span>'
                f'<span class="g2">{html.escape(lo)}</span></span>')
    return f'<div class="mthrow flips {cls}">{out}</div>'


def _wordrow(words, new):
    """One chip per word. Only the chips replace touches carry a second
    reading, and only those move: the point of the card is that the rest of the
    line is not looked at."""
    out = ""
    for i, (w, hit) in enumerate(words):
        if hit:
            out += (f'<span class="wd hit" '
                    f'style="transition-delay:{i * 70}ms">'
                    f'<span class="was">{html.escape(w)}</span>'
                    f'<span class="now">{html.escape(new)}</span></span>')
        else:
            out += f'<span class="wd">{html.escape(w)}</span>'
    return f'<div class="mthwords">{out}</div>'


def _frontrow(raw, pre):
    """The front of the string, framed, and the text it is being compared
    with under it. startswith looks at those characters and stops."""
    n = len(pre)
    head, tail = raw[:n], raw[n:]
    return (
        '<div class="stw">'
        f'<div class="stwline"><span class="stwhead">{html.escape(head)}'
        f'</span><span class="stwtail">{html.escape(tail)}</span></div>'
        f'<div class="stwcmp"><span class="stwlb">it compares</span>'
        f'<span class="stwpre">&quot;{html.escape(pre)}&quot;</span>'
        '<span class="stwv">same</span></div>'
        '</div>')


def _code(src, tab, hi=()):
    return CODE.card(src, tab, hi=hi)


def _term(k, value=None):
    body = '' if value is None else html.escape(str(value))
    return f'<pre class="term mto{k}">{body}</pre>'


def _def(shape, line):
    return (f'<div class="mthdef"><span class="shape">{shape}</span>'
            f'<p>{line}</p></div>')


def _ask(text):
    return f'<p class="mthask">{text}</p>'


def _caps(items):
    """One line per press, under the card. Without it the bottom third of the
    card is white while the instructor is still talking."""
    return "".join(f'<p class="cap mc{k}"><b>{a}</b> {b}</p>'
                   for k, (a, b) in enumerate(items, 1))


def _wrap(inner):
    """The stage already puts its header at the top and its rule at the
    bottom, so centring the STAGE only moves those. The body needs its own
    box to grow into."""
    return f'<div class="mthbody">{inner}</div>'


def _top(left, right):
    return f'<div class="mthtop"><div>{left}</div><div>{right}</div></div>'


# ================================================================== isdigit
ISDIGIT_STEPS = 4
ISDIGIT_LABELS = ("the line|what it printed|what it does|"
                  "the one that makes it False")


def isdigit_body():
    good, bad = P.ISDIGIT_PIN, P.ISDIGIT_BAD
    src_good = P.ISDIGIT_SRC
    src_bad = src_good.replace(f'"{good}"', f'"{bad}"')
    return _wrap(
        _top('<div class="mstep ms1 ms2 ms3">'
             + _code(src_good, 'check_pin.py', hi=(2,)) + '</div>'
             '<div class="mstep ms4">'
             + _code(src_bad, 'check_pin.py', hi=(2,)) + '</div>',
             _term(1) + _term(2, P.isdigit_out(good))
             + _term(3, P.isdigit_out(good)) + _term(4, P.isdigit_out(bad)))
        + f'<div class="mstep ms1 ms2 ms3">'
        f'{_row(good, P.isdigit_marks(good))}</div>'
        f'<div class="mstep ms4">{_row(bad, P.isdigit_marks(bad))}</div>'
        + _ask('It is the one from the phone. What does line 2 print?')
        + _def(P.ISDIGIT_SHAPE, P.ISDIGIT_LINE)
        + _caps([
            ('Do not explain it yet.',
             'Take two answers, then press.'),
            ('It looked at every single one.',
             f'Four characters, four digits, so it is '
             f'{P.isdigit_out(good)}.'),
            ('Now the name for it.',
             'Say it back in your own words before you move.'),
            ('One character, and the answer changes.',
             f'{bad[-1]!r} is not a digit, so the whole thing is '
             f'{P.isdigit_out(bad)}.'),
        ]))


# ==================================================================== strip
STRIP_STEPS = 3
STRIP_LABELS = "the line|what it printed|what it does"


def strip_body():
    raw = P.STRIP_RAW
    left, right, _kept = P.strip_ends(raw)
    off = set(left) | set(right)
    return _wrap(
        _top(_code(P.STRIP_SRC, 'contact.py', hi=(2,)),
             _term(1) + _term(2, P.strip_out(raw))
             + _term(3, P.strip_out(raw)))
        + _row(raw, off=off)
        + _ask('Fourteen characters go in. How many come out?')
        + _def(P.STRIP_SHAPE, P.STRIP_LINE)
        + _caps([
            ('Take a number from the room.',
             'Then press, and count them together.'),
            (f'{len(raw)} in, {len(P.strip_out(raw))} out.',
             'All four spaces were at the two ends.'),
            ('It did not change mobile.',
             'It handed back a new string, and print showed you that one.'),
        ]))


# ================================================================== replace
REPLACE_STEPS = 3
REPLACE_LABELS = "the line|what it printed|what it does"


def replace_body():
    words = P.replace_words()
    hits = P.replace_hits()
    return _wrap(
        _top(_code(P.REPLACE_SRC, 'notes.py', hi=(2,)),
             _term(1) + _term(2, P.replace_out())
             + _term(3, P.replace_out()))
        + _wordrow(words, P.REPLACE_NEW)
        + _ask(f'The word <b>{P.REPLACE_OLD}</b> is in there twice. Does it '
               'fix one of them, or both?')
        + _def(P.REPLACE_SHAPE, P.REPLACE_LINE)
        + _caps([
            ('Ask for a show of hands: one, or both.',
             'Do not say which. Then press.'),
            (f'Both of them. {hits} changed, three words untouched.',
             'It goes all the way to the end of the line.'),
            ('Two things in the brackets now.',
             'The one to look for first, the one to put there second.'),
        ]))


# =============================================================== startswith
STARTS_STEPS = 3
STARTS_LABELS = "the line|what it printed|what it does"


def starts_body():
    pre = P.STARTS_PRE
    return _wrap(
        _top(_code(P.STARTS_SRC, 'link.py', hi=(2,)),
             _term(1) + _term(2, P.starts_out())
             + _term(3, P.starts_out()))
        + _frontrow(P.STARTS_RAW, pre)
        + _ask('Look at what it prints, not at the address. Is it a string, '
               'or is it a yes or no?')
        + _def(P.STARTS_SHAPE, P.STARTS_LINE)
        + _caps([
            ('This is the padlock in your browser bar.',
             'Ask what it prints before you press.'),
            (f'It read the first {len(pre)} characters and stopped.',
             f'They match, so it is {P.starts_out()}.'),
            ('This one answers a question.',
             f'With {P.STARTS_OTHER} it would be {P.starts_other()}.'),
        ]))


# ==================================================================== upper
UPPER_STEPS = 4
UPPER_LABELS = "the line|what upper printed|what it does|and lower"


def upper_body():
    triples = P.upper_pairs()
    return _wrap(
        _top(_code(P.UPPER_SRC, 'name.py', hi=(2,)),
             _term(1) + _term(2, P.upper_out())
             + _term(3, P.upper_out()) + _term(4, P.lower_out()))
        + _fliprow(triples)
        + _ask('Every letter, in place. What does line 2 print?')
        + _def(P.UPPER_SHAPE, P.UPPER_LINE)
        + _caps([
            ('The easiest one today.',
             'Take it fast and keep moving.'),
            (f'{P.UPPER_RAW} went in, {P.upper_out()} came out.',
             'name still holds the one you typed.'),
            ('One job, two directions.',
             'Ask what line 3 will print before you press.'),
            (f'Line 3 prints {P.lower_out()}.',
             'Same method, the other way round.'),
        ]))


def css():
    """One rule set per press, generated so a step cannot disagree with the
    picture of it. `an-N` is exclusive, so every cumulative reveal names each
    step it survives into."""
    n = max(ISDIGIT_STEPS, STRIP_STEPS, REPLACE_STEPS, STARTS_STEPS,
            UPPER_STEPS)
    out = ['/* --- the method cards: the line, then what it does --- */',
           '.mth .mstep{display:none}',
           '.mth .term{display:none}',
           '.mth .mthask{display:none}',
           '.mth .mthdef{display:none}',
           '.mth .cap{display:none}',
           '.mth.an-1 .mthask{display:block}']
    for k in range(1, n + 1):
        out.append(f'.mth.an-{k} .mstep.ms{k}{{display:block}}')
        out.append(f'.mth.an-{k} .mto{k}{{display:block}}')
        out.append(f'.mth.an-{k} .cap.mc{k}{{display:block}}')
        if k >= 3:
            out.append(f'.mth.an-{k} .mthdef{{display:block}}')
        if k >= 2:
            out.append(f'.mth.an-{k} .mthrow .ch{{'
                       'transition-duration:260ms}')
    # the mechanism only starts once the line has run
    for k in range(2, n + 1):
        out.append(f'.mth.an-{k} .mthrow .ch.yes'
                   '{border-color:#1F9D62;background:#E9F6ED}')
        out.append(f'.mth.an-{k} .mthrow .ch.no'
                   '{border-color:#C7454E;background:#FBF1F1}')
        out.append(f'.mth.an-{k} .mthrow .ch i{{opacity:1}}')
        out.append(f'.mth.an-{k} .mthrow .ch.off'
                   '{opacity:0;transform:translateY(18px) scale(.8)}')
        # replace: the two wrong words flip and nothing else moves
        out.append(f'.mth.an-{k} .wd.hit .was{{opacity:0;transform:'
                   'translateY(-10px)}')
        out.append(f'.mth.an-{k} .wd.hit .now{{opacity:1;transform:none}}')
        out.append(f'.mth.an-{k} .wd.hit'
                   '{border-color:#1F9D62;background:#E9F6ED}')
        # upper: the glyph swaps in place, and the box lights while it does
        out.append(f'.mth.an-{k} .ch.flip{{'
                   'border-color:#1F9D62;background:#E9F6ED}')
        # startswith: the front is framed, and the verdict arrives with it
        out.append(f'.mth.an-{k} .stwhead'
                   '{border-color:#1F9D62;background:#E9F6ED;color:#12633F}')
        out.append(f'.mth.an-{k} .stwcmp{{opacity:1}}')
    # the flip row shows exactly one glyph at a time: what was typed on press
    # 1, what upper gives on 2 and 3, and what lower gives on 4
    out.append('.mth .ch.flip .g0{opacity:1}')
    for k in (2, 3):
        out.append(f'.mth.an-{k} .ch.flip .g0{{opacity:0}}')
        out.append(f'.mth.an-{k} .ch.flip .g1{{opacity:1}}')
    out.append(f'.mth.an-{UPPER_STEPS} .ch.flip .g0{{opacity:0}}')
    out.append(f'.mth.an-{UPPER_STEPS} .ch.flip .g2{{opacity:1}}')
    return "\n".join(out)
