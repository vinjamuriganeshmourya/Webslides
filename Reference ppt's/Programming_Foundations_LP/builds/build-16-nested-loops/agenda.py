"""The agenda: deck slide 6's ribbon, redrawn so it arrives one stop per press.

Four stops, in the order the session runs, each named the way a student would
say it back. Every stop carries one short line above it saying what the words
mean, and nothing else: no code, no example, nothing a student has to decode
before the session has taught it.

    A loop inside a loop      what a nested loop is
    How it runs               we follow both loops one line at a time
    The number triangle       a coding question you will try yourself
    Common mistakes           where each range starts and stops

Transform and opacity only; nothing enters from scale(0).
"""
import html

W = 1000
N = 4
GAP = 6
SEG_X = 12
SEG_W = (W - 2 * SEG_X - (N - 1) * GAP) / N
NOTCH = 26
TOP = 190
BOT = 290
MID = (TOP + BOT) / 2
LBL_Y = 112
DOT_Y = 146
VB_H = 340

STOPS = [
    ("A loop inside a loop", "what a nested loop is"),
    ("How it runs", "follow both loops"),
    ("The number triangle", "a question you solve"),
    ("Common mistakes", "where a range goes wrong"),
]


def _seg(i):
    x = SEG_X + i * (SEG_W + GAP)
    r = x + SEG_W
    d = (f"M{x:.1f},{TOP} H{r - NOTCH:.1f} L{r:.1f},{MID} L{r - NOTCH:.1f},{BOT} "
         f"H{x:.1f} " + ("Z" if i == 0 else f"L{x + NOTCH:.1f},{MID} Z"))
    return d, x, r


def _mid(i, x, r):
    return (x + r) / 2 + (NOTCH / 2 if i else 0) - NOTCH / 4


def _name(cx, name):
    """The stop's name inside its chevron, on one line or two."""
    words = name.split()
    if len(name) <= 14:
        return (f'<text x="{cx:.0f}" y="{MID + 9}" text-anchor="middle" '
                f'class="ag-name">{html.escape(name)}</text>')
    cut = len(words) // 2 + (1 if len(words) % 2 else 0)
    a, b = " ".join(words[:cut]), " ".join(words[cut:])
    return (f'<text x="{cx:.0f}" y="{MID - 6}" text-anchor="middle" class="ag-name">'
            f'{html.escape(a)}</text><text x="{cx:.0f}" y="{MID + 24}" '
            f'text-anchor="middle" class="ag-name">{html.escape(b)}</text>')


def svg():
    gs, ghost = [], ""
    for i, (name, label) in enumerate(STOPS):
        d, x, r = _seg(i)
        cx = _mid(i, x, r)
        ghost += (f'<path d="{d}" fill="none" stroke="#D8E5EE" stroke-width="2.5" '
                  'stroke-dasharray="8 7"/>')
        gs.append(
            f'<g class="ag-s ag-s{i + 1}">'
            f'<text x="{cx:.0f}" y="{LBL_Y}" text-anchor="middle" class="ag-lbl">'
            f'{html.escape(label)}</text>'
            f'<circle cx="{cx:.0f}" cy="{DOT_Y}" r="9" fill="#F2B705"/>'
            f'<path d="M{cx:.0f},{DOT_Y + 9} V{TOP}" stroke="#7D8A95" stroke-width="2"/>'
            f'<path d="{d}" fill="#3FB5E5"/>' + _name(cx, name) + '</g>')
    return (f'<svg class="fig agmap" viewBox="0 0 {W} {VB_H}" '
            'xmlns="http://www.w3.org/2000/svg" role="img" '
            'aria-label="Four stops for today: a loop inside a loop, how it runs, '
            'the number triangle, and common mistakes">' + ghost + "".join(gs) + '</svg>')


STEPS = N
LABELS = "a loop inside a loop|how it runs|the number triangle|common mistakes"


def css():
    rules = [".ag-name{font:700 25px var(--sans);fill:#FFFFFF}",
             ".ag-lbl{font:600 19px var(--sans);fill:#5A6A75}"]
    for k in range(1, N + 1):
        rules.append(",".join(f".agstage.an-{j} .ag-s{k}" for j in range(k, N + 1))
                     + "{opacity:1;transform:none}")
    return "\n".join(rules)


def body():
    return f'<div class="agwrap">{svg()}</div>'
