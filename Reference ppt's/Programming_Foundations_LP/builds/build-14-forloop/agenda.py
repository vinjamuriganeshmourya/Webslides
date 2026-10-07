"""The agenda, redrawn and stepped.

The deck's own agenda (slide 12) is a chevron ribbon with three stops and three
callouts, and it lands all at once: the room reads the last stop while the
instructor is still saying the first. The same ribbon is drawn here so it comes
one stop at a time, and the fourth press adds the line the deck leaves off, the
one the whole back half of the session is about.

Four presses. Transform and opacity only; nothing enters from scale(0).
"""

W = 1000
SEG_W = 306
SEG_X = 24
NOTCH = 28
TOP = 176
BOT = 262
MID = (TOP + BOT) / 2

STOPS = [
    ("For loop", "walk a sequence", "up",
     "Take any sequence and do one job per item."),
    ("range", "a sequence of numbers", "down",
     "The loop needs a sequence. range builds one out of numbers."),
    ("The star pattern", "write it yourself", "up",
     "A real question, solved on your own keyboard."),
]


def _seg(i, first):
    x = SEG_X + i * (SEG_W + 6)
    r = x + SEG_W
    # drawn clockwise from the top left, so the notch on the right always bites
    # into the segment that follows it
    d = (f"M{x},{TOP} H{r - NOTCH} L{r},{MID} L{r - NOTCH},{BOT} H{x} "
         + ("Z" if first else f"L{x + NOTCH},{MID} Z"))
    return d, x, r


def _callout(i, x, r, label, where):
    """The dot, the stalk and the words. Above the ribbon or below it, the way
    the deck alternates them, so three labels never collide."""
    cx = (x + r) / 2 + (NOTCH / 2 if i else 0)
    if where == "up":
        return (f'<path d="M{cx},{TOP} V{TOP - 52}" stroke="#7D8A95" '
                'stroke-width="2"/>'
                f'<circle cx="{cx}" cy="{TOP - 62}" r="11" fill="#F2B705"/>'
                f'<text x="{cx}" y="{TOP - 84}" text-anchor="middle" '
                'style="font:600 21px var(--sans)" fill="#5A6A75">{lbl}</text>'
                ).replace("{lbl}", label)
    return (f'<path d="M{cx},{BOT} V{BOT + 46}" stroke="#7D8A95" '
            'stroke-width="2"/>'
            f'<circle cx="{cx}" cy="{BOT + 56}" r="11" fill="#F2B705"/>'
            f'<text x="{cx}" y="{BOT + 90}" text-anchor="middle" '
            'style="font:600 21px var(--sans)" fill="#5A6A75">{lbl}</text>'
            ).replace("{lbl}", label)


def svg():
    gs = []
    for i, (name, label, where, _why) in enumerate(STOPS):
        d, x, r = _seg(i, i == 0)
        tx = (x + r) / 2 + (NOTCH / 2 if i else 0)
        gs.append(
            f'<g class="ag-s ag-s{i + 1}">'
            f'<path d="{d}" fill="#3FB5E5" stroke="#3FB5E5" stroke-width="4"/>'
            f'<text x="{tx}" y="{MID + 10}" text-anchor="middle" '
            f'style="font:700 28px var(--sans)" fill="#FFFFFF">{name}</text>'
            + _callout(i, x, r, label, where) +
            '</g>')
    ghost = "".join(
        f'<path d="{_seg(i, i == 0)[0]}" fill="none" stroke="#E6F0F6" '
        'stroke-width="2.5" stroke-dasharray="8 7"/>' for i in range(3))
    last = (
        '<g class="ag-last">'
        f'<rect x="{SEG_X}" y="386" width="{W - 2 * SEG_X}" height="62" rx="14" '
        'fill="#FDF2E6" stroke="#E8A13A" stroke-width="2.5"/>'
        f'<text x="{W / 2}" y="426" text-anchor="middle" '
        'style="font:700 24px var(--sans)" fill="#9A5B12">'
        'and the one mistake everybody makes</text>'
        '</g>')
    return ('<svg class="fig agmap" viewBox="0 72 1000 388" '
            'xmlns="http://www.w3.org/2000/svg" role="img" '
            'aria-label="Three stops for today, and the mistake at the end">'
            + ghost + "".join(gs) + last + '</svg>')


STEPS = 4
LABELS = "for loop|range|the pattern|the mistake"


def body():
    return f'<div class="agwrap">{svg()}</div>'
