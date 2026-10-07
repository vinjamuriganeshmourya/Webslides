"""Slide 14, redrawn: control statements change the order the lines run in.

Four small programs side by side, one per press. Each gets a rail on its right
that draws the order its lines really run in: straight down for plain code, a
hop over the else for if-elif-else, a loop back for while and for, and for
break a green jump straight out of the loop. The order is read off
`panels.trace`, so the rail cannot disagree with Python.
"""
import html
import re

import panels as P

W, H = 1200, 470
COL_W, COL_GAP, X0 = 282, 22, 3
CODE_Y, LH = 142, 42            # first code baseline, line height
NUM_X, CODE_X, RAIL_X = 20, 38, 232
CHIP_Y = 372
STEPS = 4
LABELS = "plain code|if-elif-else|while, for|break, continue"

KW = ("for", "in", "if", "elif", "else", "while", "break", "continue", "pass")
BLUE, ORANGE, GREEN = "#006DAF", "#E8890C", "#2E9E5B"


def _hl(line):
    """A line of code as coloured tspans: keywords, strings, numbers."""
    out = []
    for tok in re.findall(r'"[^"]*"|\w+|\s+|.', line):
        t = html.escape(tok).replace(" ", " ")
        if tok.startswith('"'):
            out.append(f'<tspan fill="#2E8B57">{t}</tspan>')
        elif tok in KW:
            out.append(f'<tspan fill="#C7364A" font-weight="700">{t}</tspan>')
        elif tok.isdigit():
            out.append(f'<tspan fill="#1C7CD6">{t}</tspan>')
        else:
            out.append(t)
    return "".join(out)


def _y(n):
    return CODE_Y + (n - 1) * LH - 6        # the middle of line n


def _segs(order, x, lines):
    """One path per kind of move, drawn once even when the loop makes it three
    times; the chips underneath carry the full order. Forward skips bulge left
    of the rail, loop-backs right, and the jump out of a break furthest right,
    in green."""
    segs, seen = [], set()
    for a, b in zip(order, order[1:]):
        if (a, b) in seen:
            continue
        seen.add((a, b))
        ya, yb = _y(a), _y(b)
        if b == a + 1:
            segs.append(("down", f"M{x},{ya} V{yb}"))
        elif b > a and lines[a - 1].strip() == "break":
            segs.append(("brk", f"M{x},{ya} C{x + 46},{ya} {x + 46},{yb} {x},{yb}"))
        elif b > a:
            segs.append(("jump", f"M{x},{ya} C{x - 30},{ya} {x - 30},{yb} {x},{yb}"))
        else:
            segs.append(("back", f"M{x},{ya} C{x + 30},{ya} {x + 30},{yb} {x},{yb}"))
    return segs


def _col(i, key, cap, src):
    x0 = X0 + i * (COL_W + COL_GAP)
    lines = src.split("\n")
    order = P.intro_order(src)
    ran = set(order)
    today = i == 3
    body = [f'<rect class="ic-card{" ic-today" if today else ""}" x="{x0}" y="18" '
            f'width="{COL_W}" height="{H - 30}" rx="16"/>',
            f'<text class="ic-key" x="{x0 + COL_W / 2}" y="62" text-anchor="middle">'
            f'{html.escape(key)}</text>',
            f'<text class="ic-cap" x="{x0 + COL_W / 2}" y="92" text-anchor="middle">'
            f'{html.escape(cap)}</text>']
    if today:
        body.append(f'<rect x="{x0 + COL_W - 86}" y="-2" width="80" height="30" rx="15" '
                    f'fill="{ORANGE}"/><text x="{x0 + COL_W - 46}" y="19" '
                    'text-anchor="middle" class="ic-tag">today</text>')
    for n, ln in enumerate(lines, 1):
        cls = "ic-ln" + ("" if n in ran else " ic-skip")
        body.append(f'<text class="ic-num" x="{x0 + NUM_X}" y="{CODE_Y + (n - 1) * LH}" '
                    f'text-anchor="middle">{n}</text>'
                    f'<text class="{cls}" x="{x0 + CODE_X}" y="{CODE_Y + (n - 1) * LH}">'
                    f'{_hl(ln)}</text>')
    rx = x0 + RAIL_X
    for n in sorted(ran):
        body.append(f'<circle class="ic-dot" cx="{rx}" cy="{_y(n)}" r="5"/>')
    segs = _segs(order, rx, lines)
    last = len(segs) - 1
    colour = {"down": ("down", BLUE), "jump": ("down", BLUE),
              "back": ("back", ORANGE), "brk": ("jump", GREEN)}
    for k, (kind, d) in enumerate(segs):
        mk_id, col = colour[kind]
        mk = f' marker-end="url(#ic-ar-{mk_id})"' if k == last or kind != "down" else ""
        body.append(f'<path class="ic-seg" d="{d}" pathLength="1" stroke="{col}" '
                    f'style="--k:{k}"{mk}/>')
    # the run order, as chips
    cw, gap = 30, 6
    total = len(order) * cw + (len(order) - 1) * gap
    cx = x0 + (COL_W - total) / 2
    body.append(f'<text class="ic-runs" x="{x0 + COL_W / 2}" y="{CHIP_Y - 14}" '
                'text-anchor="middle">lines run in this order</text>')
    for k, n in enumerate(order):
        body.append(f'<rect class="ic-chip" x="{cx + k * (cw + gap)}" y="{CHIP_Y}" '
                    f'width="{cw}" height="34" rx="8"/>'
                    f'<text class="ic-chipt" x="{cx + k * (cw + gap) + cw / 2}" '
                    f'y="{CHIP_Y + 23}" text-anchor="middle">{n}</text>')
    ghost = (f'<rect class="ic-ghost" x="{x0}" y="18" width="{COL_W}" '
             f'height="{H - 30}" rx="16"/>')
    return ghost + f'<g class="ic-c ic-c{i + 1}">' + "".join(body) + '</g>'


def _marker(kind, col):
    return (f'<marker id="ic-ar-{kind}" viewBox="0 0 10 10" refX="8" refY="5" '
            'markerUnits="userSpaceOnUse" markerWidth="15" markerHeight="15" orient="auto">'
            f'<path d="M0,0 L10,5 L0,10 Z" fill="{col}"/></marker>')


def body():
    defs = ("<defs>" + _marker("down", BLUE) + _marker("back", ORANGE)
            + _marker("jump", GREEN) + "</defs>")
    cols = "".join(_col(i, k, c, s) for i, (k, c, s) in enumerate(P.INTRO))
    return ('<div class="icwrap">'
            '<p class="ic-big">Control statements change <b>the order</b> '
            'your lines run in.</p>'
            '<p class="ic-key-row"><span class="k-down">next line</span>'
            '<span class="k-back">back to the top</span>'
            '<span class="k-brk">break: jump out</span></p>'
            f'<svg class="fig icfig" viewBox="-6 -8 {W + 12} {H + 12}" '
            'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four small '
            'programs. A rail beside each shows the order its lines run in.">'
            + defs + cols + '</svg></div>')


def css(fr):
    """`fr` is cards.fr: a selector from step k to step n."""
    show = "".join(f"{fr('icstage', i, STEPS, f'.ic-c{i}')}{{opacity:1}}"
                   f"{fr('icstage', i, STEPS, f'.ic-c{i} .ic-seg')}{{stroke-dashoffset:0}}"
                   for i in range(1, STEPS + 1))
    return r"""
/* ======================= slide 14, redrawn: the order lines run in ======= */
.icwrap{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px}
.ic-big{margin:0;font:600 26px/1.3 var(--sans);color:#434343}
.ic-big b{color:#006DAF}
.ic-key-row{display:flex;gap:22px;margin:0;font:600 16px var(--sans);color:#5A6A75}
.ic-key-row span::before{content:'';display:inline-block;width:26px;height:4px;
  border-radius:2px;margin-right:8px;vertical-align:middle;background:#006DAF}
.ic-key-row .k-back::before{background:#E8890C}
.ic-key-row .k-brk::before{background:#2E9E5B}
body.present .ic-key-row{font-size:clamp(12px,1.25vw,20px)}
.icfig{flex:1;min-height:0;width:100%;height:100%}
.ic-ghost{fill:none;stroke:#D8E5EE;stroke-width:2.5;stroke-dasharray:9 7}
.ic-c{opacity:0;transition:opacity .35s}
.ic-card{fill:#FFFFFF;stroke:#D5E3EE;stroke-width:2}
.ic-card.ic-today{fill:#FFF8EE;stroke:#E8890C;stroke-width:3}
.ic-key{font:700 25px var(--mono);fill:#C7364A}
.ic-cap{font:600 16px var(--sans);fill:#5A6A75}
.ic-tag{font:700 15px var(--sans);fill:#FFFFFF}
.ic-num{font:500 15px var(--mono);fill:#A7B0BA}
.ic-ln{font:500 16px var(--mono);fill:#1B2530}
.ic-skip{opacity:.3;text-decoration:none}
.ic-seg{fill:none;stroke-width:4;stroke-linecap:round;stroke-dasharray:1;
  stroke-dashoffset:1;transition:stroke-dashoffset .22s linear;
  transition-delay:calc(var(--k) * .2s)}
.ic-dot{fill:#FFFFFF;stroke:#006DAF;stroke-width:2.5}
.ic-runs{font:600 14px var(--sans);fill:#7A8794}
.ic-chip{fill:#EAF6FC;stroke:#9CCBE6;stroke-width:1.5}
.ic-chipt{font:700 17px var(--mono);fill:#006DAF}
.ic-today ~ .ic-chip{fill:#FFF0DB;stroke:#F2B36A}
""" + show + r"""
body.present .ic-big{font-size:clamp(18px,2.1vw,36px)}
@media (prefers-reduced-motion:reduce){.ic-seg,.ic-c{transition:none}}
"""
