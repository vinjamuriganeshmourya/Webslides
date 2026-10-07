"""The agenda, redrawn and stepped.

The deck's own agenda (slide 10) is a two stop ribbon that lands all at once,
so the room reads the second stop while the instructor is still on the first.
The same ribbon is drawn here and arrives one stop per press.

Three stops, three presses, and each stop carries two things:

  * above the ribbon, a short line saying what the words mean, in the plainest
    wording there is. `String slicing` is `take a part of a string`, not
    `extended slicing` and not `take every second one`. A phrase like *the part
    people get wrong* has no place on an agenda: it names a feeling, not a
    thing, and a student reading it learns nothing;
  * below the ribbon, one real line of Python from later in the session, with
    what it gives. An agenda that is three headings is three headings. An
    agenda with an example under each one is a thing you can look at.

The example chips are also why this card is not half white. The band that used
to close it said *and your own string never changes*, which is a takeaway and
now lives on the takeaway board, and taking it out left the ribbon floating in
the middle of an empty card.

Transform and opacity only; nothing enters from scale(0).
"""
import html

W = 1000
SEG_W = 306
SEG_X = 24
GAP = 6
NOTCH = 28
TOP = 196
BOT = 282
MID = (TOP + BOT) / 2

LBL_Y = 108          # the short definition, above the ribbon
DOT_Y = 140
CHIP_Y = 344         # the example chip, below it
CHIP_H = 96
VB_H = 500

# (the stop, the short definition, the example line, what that line gives,
#  the sentence the guide reads out)
STOPS = [
    ("String slicing", "take a part of a string",
     'message[3:7]', 'gives "Ravi"',
     "Ask for several characters at once, by their position."),
    ("String methods", "jobs Python already knows",
     'pin.isdigit()', 'gives True',
     "Ready made jobs on a string, so you do not write the loop yourself."),
    ("Where it stops", "a slice stops before its last number",
     'code[1:6:3]', 'stops before 6',
     "A slice stops before its stop index. strip stops at the first "
     "character it does not recognise."),
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


def _chip(i, x, code, gives):
    """One real line from later in the session, under the stop it belongs to."""
    cx = x + 8 + (SEG_W - 16) / 2
    return (f'<rect class="ag-chip" x="{x + 8}" y="{CHIP_Y}" '
            f'width="{SEG_W - 16}" height="{CHIP_H}" rx="14"/>'
            f'<text class="ag-code" x="{cx:.0f}" y="{CHIP_Y + 44}" '
            f'text-anchor="middle">{html.escape(code)}</text>'
            f'<text class="ag-gives" x="{cx:.0f}" y="{CHIP_Y + 76}" '
            f'text-anchor="middle">{html.escape(gives)}</text>')


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
            + _chip(i, x, code, gives)
            + '</g>')
    ghost = "".join(
        f'<path d="{_seg(i, i == 0)[0]}" fill="none" stroke="#D8E5EE" '
        'stroke-width="2.5" stroke-dasharray="8 7"/>' for i in range(3))
    ghost += "".join(
        f'<rect x="{SEG_X + i * (SEG_W + GAP) + 8}" y="{CHIP_Y}" '
        f'width="{SEG_W - 16}" height="{CHIP_H}" rx="14" fill="none" '
        'stroke="#E8EEF3" stroke-width="2" stroke-dasharray="7 6"/>'
        for i in range(3))
    return (f'<svg class="fig agmap" viewBox="0 0 {W} {VB_H}" '
            'xmlns="http://www.w3.org/2000/svg" role="img" '
            'aria-label="Three stops for today: string slicing, string '
            'methods, and where each of them stops, each with one line of '
            'Python under it">'
            + ghost + "".join(gs) + '</svg>')


STEPS = 3
LABELS = "string slicing|string methods|where it stops"


def body():
    return f'<div class="agwrap">{svg()}</div>'
