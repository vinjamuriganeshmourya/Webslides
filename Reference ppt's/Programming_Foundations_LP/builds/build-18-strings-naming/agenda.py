"""The agenda: deck slide 7's ribbon, redrawn so it arrives one stop per press.

Each stop carries one plain line above it, and nothing else.
"""
import html

W = 1000
SEG_W = 470
SEG_X = 24
GAP = 6
NOTCH = 28
TOP = 196
BOT = 282
MID = (TOP + BOT) / 2

LBL_Y = 108          # the short definition, above the ribbon
DOT_Y = 140
VB_H = 320

# (the stop, the short definition, the example line, what that line gives,
#  the sentence the guide reads out)
STOPS = [
    ("Comparing Strings", "every letter is a number",
     "", "", "Python compares strings by the numbers behind the letters."),
    ("Naming Variables", "the rules, and the style",
     "", "", "Four rules Python checks, and the style Python programmers use."),
]


def _seg(i, first):
    x = SEG_X + i * (SEG_W + GAP)
    r = x + SEG_W
    d = (f"M{x},{TOP} H{r - NOTCH} L{r},{MID} L{r - NOTCH},{BOT} H{x} "
         + ("Z" if first else f"L{x + NOTCH},{MID} Z"))
    return d, x, r


def _mid(i, x, r):
    """The centre of a segment's readable area. Every segment after the first
    has a notch bitten out of its left edge, so its text sits half a notch to
    the right of the geometric middle."""
    return (x + r) / 2 + (NOTCH / 2 if i else 0)


def _callout(cx, label):
    """The short definition, hung over the ribbon on a stem. The longest one is
    35 characters, which at 20px is under 380 units: narrower than a segment,
    so it never wraps and never runs into its neighbour."""
    return (f'<text x="{cx}" y="{LBL_Y}" text-anchor="middle" '
            'style="font:600 20px var(--sans)" fill="#5A6A75">'
            f'{html.escape(label)}</text>'
            f'<circle cx="{cx}" cy="{DOT_Y}" r="10" fill="#F2B705"/>'
            f'<path d="M{cx},{DOT_Y + 10} V{TOP}" stroke="#7D8A95" '
            'stroke-width="2"/>')


def svg():
    gs = []
    for i, (name, label, code, gives, _why) in enumerate(STOPS):
        d, x, r = _seg(i, i == 0)
        tx = _mid(i, x, r)
        gs.append(
            f'<g class="ag-s ag-s{i + 1}">'
            + _callout(tx, label)
            + f'<path d="{d}" fill="#3FB5E5"/>'
            f'<text x="{tx:.0f}" y="{MID + 10}" text-anchor="middle" '
            f'style="font:700 26px var(--sans)" fill="#FFFFFF">{name}</text>'
            + '</g>')
    ghost = "".join(
        f'<path d="{_seg(i, i == 0)[0]}" fill="none" stroke="#D8E5EE" '
        'stroke-width="2.5" stroke-dasharray="8 7"/>' for i in range(len(STOPS)))
    return (f'<svg class="fig agmap" viewBox="0 0 {W} {VB_H}" '
            'xmlns="http://www.w3.org/2000/svg" role="img" '
            'aria-label="Two stops for today: comparing strings, then naming variables">'
            + ghost + "".join(gs) + '</svg>')


STEPS = 2
LABELS = "comparing strings|naming variables"


def body():
    return f'<div class="agwrap">{svg()}</div>'
