"""The two slicing slides, redrawn so the characters actually move.

Slide 12 and slide 17 are flat pictures of a finished slice: the answer is
already on them, and the only thing left to do is read it. Here the characters
come out of the string one press at a time.

**The pull-out card starts at indexing, not at slicing.** That is how the
instructor teaches it in the room: for this string, if I write message[0], what
do I get? H. Now I want Ravi out of it. How do I do that? So press 2 is one
number in the brackets and one character out of it, and the slice is the answer
to a question the room has already been asked. A card that opens on
`message[3:7]` has answered it before anybody wondered.

**The expression is the biggest thing on the card, and it sits at the top**,
one line under the string it belongs to. It used to be 30px at the very bottom
edge, which was the smallest any text on the card was: the one line the session
is teaching was the one line nobody could read from the back row.

Three things a picture cannot show, and all three are drawn:

  * a slice **copies**. The characters stay in the row and a copy travels into
    the result, because `message` still holds `"Hi Ravi"` afterwards;
  * the end index is a box that **exists and is never reached**. It fades in
    with the expression, greyed, and labelled;
  * the boxes a step never lands on stay untouched, and on the last press they
    go dashed and **stay** that way.

Both ride the template's `data-anim` controller. Transform and opacity only;
one transition per travelling character, staggered 60ms, inside the 30 to 80ms
band.
"""
import html

import panels as P

CELL = 96
CW = 86
SRC_Y = 48           # the string, as the room would type it
EXPR_Y = 122         # the expression, directly under it, and the biggest text
BOX_Y = 156
BOX_H = 96
CH_DY = 68           # baseline inside the box
IDX_Y = 284
STOP_Y = 318         # the never reached label, under the ghost box
PILL_Y = 340
PILL_H = 76
CAP_Y = 466          # two caption lines, both inside the viewBox
VB_W, VB_H = 1000, 512


def _c0(n):
    """Centre the row of n boxes in the viewBox."""
    return (VB_W - n * CELL) / 2 + CELL / 2


SLOT = 27            # the advance of one 40px mono character, plus a hair


def _pill(n_letters):
    """The result box, and where each character lands inside it. The slots are
    tight enough that four characters read as a word rather than as four
    characters that happen to be near each other."""
    w = 44 + n_letters * SLOT
    x = (VB_W - w) / 2 + 60
    return x, w


def _slot(px, k):
    return px + 22 + k * SLOT + SLOT / 2


def _boxes(src, c0, ghost_at=None, cls_for=None):
    out = ""
    n = len(src) + (1 if ghost_at is not None else 0)
    for i in range(n):
        ghost = ghost_at is not None and i == ghost_at
        raw = " " if ghost else src[i]
        ch = "&#183;" if raw == " " and not ghost else html.escape(raw)
        cx = c0 + i * CELL
        extra = " slghost" if ghost else (" slsp" if raw == " " else "")
        if cls_for and not ghost:
            extra += cls_for(i)
        out += (
            f'<g class="slcell{extra}" data-i="{i}">'
            f'<rect class="slbox" x="{cx - CW / 2:.0f}" y="{BOX_Y}" '
            f'width="{CW}" height="{BOX_H}" rx="12"/>'
            f'<text class="slch" x="{cx:.0f}" y="{BOX_Y + CH_DY}" '
            f'text-anchor="middle">{ch}</text>'
            f'<text class="slix" x="{cx:.0f}" y="{IDX_Y}" '
            f'text-anchor="middle">{i}</text>'
            '</g>')
    return out


def _lift(ch, src_cx, tgt_cx, step, k):
    """One character copied out of its box into the result. The original stays
    where it is: a slice does not empty the string it came from."""
    dx = tgt_cx - src_cx
    dy = (PILL_Y + 52) - (BOX_Y + CH_DY)
    return (f'<text class="sllift lift{step} lk{k}" x="{src_cx:.0f}" '
            f'y="{BOX_Y + CH_DY}" text-anchor="middle" '
            f'style="--dx:{dx:.0f}px;--dy:{dy:.0f}px">{html.escape(ch)}</text>')


def _caps(items):
    out = ""
    for i, (a, b) in enumerate(items, 1):
        out += (f'<g class="slcap slcap{i}">'
                f'<text x="60" y="{CAP_Y}">{a}</text>'
                + (f'<text x="60" y="{CAP_Y + 30}">{b}</text>' if b else '')
                + '</g>')
    return out


def _expr(cls, text, x=60):
    """The expression, at the top and set large. One group per version of it,
    shown and hidden by press, so the card never carries two at once."""
    return (f'<text class="slexpr {cls}" x="{x}" y="{EXPR_Y}">'
            f'{html.escape(text)}</text>')


# ======================================================= slide 12, redrawn
# Five presses. The first two are indexing, because that is the question the
# slice is the answer to.
PULL_STEPS = 5
PULL_LABELS = ("the string|one number, one character|the four I want|"
               "start at 3, stop before 7|the four that come out")

PULL_CAPS = [
    ('Seven characters, seven boxes. The numbering starts at 0.',
     'Read the numbers out loud with me.'),
    ('One number in the brackets gives one character back.',
     'So message[1] would give me the i.'),
    ('Now I want the name. It sits in four boxes side by side.',
     'Say their four numbers, then tell me what I should write.'),
    ('Start at 3, and stop before 7.',
     'Box 7 is drawn there, and it is never reached.'),
    ('Those four are copied out. message still holds all seven.',
     'Nothing was taken away from it.'),
]


def pull_body():
    src = P.PULL_SRC
    a, b = P.PULL_SLICE
    n = len(src) + 1                      # one ghost box for the end index
    c0 = _c0(n)
    keep = list(range(a, b))
    px, pw = _pill(len(keep))
    first = src[0]

    def cls_for(i):
        return (" slin" if i in keep else "") + (" slzero" if i == 0 else "")

    win_x = c0 + a * CELL - CELL / 2 + 4
    win_w = (b - a) * CELL - 8
    lifts = "".join(
        _lift(src[i], c0 + i * CELL, _slot(px, k), 5, k)
        for k, i in enumerate(keep))
    svg = (
        f'<svg class="fig slfig pullfig" viewBox="0 0 {VB_W} {VB_H}" '
        'xmlns="http://www.w3.org/2000/svg" role="img" '
        f'aria-label="The string {src} in numbered boxes. First one number '
        'gives one character, then four of them are copied out together">'
        f'<text class="slsrc" x="60" y="{SRC_Y}">message = '
        f'<tspan class="slstr">&quot;{html.escape(src)}&quot;</tspan></text>'
        # press 2: indexing. One number in, one character out.
        + _expr('slex1', 'message[0]')
        + f'<g class="slex1 slgotg"><text class="slarrow" x="330" '
          f'y="{EXPR_Y}">&#8594;</text>'
          f'<text class="slgot" x="378" y="{EXPR_Y}">&quot;'
          f'{html.escape(first)}&quot;</text></g>'
        # presses 4 and 5: the slice, in the same place and the same size
        + _expr('slex2', f'message[{a}:{b}]')
        + _boxes(src, c0, ghost_at=len(src), cls_for=cls_for)
        + f'<rect class="slwin" x="{win_x:.0f}" y="{BOX_Y - 12}" '
          f'width="{win_w:.0f}" height="{BOX_H + 24}" rx="16"/>'
        + f'<text class="slstop" x="{c0 + len(src) * CELL:.0f}" y="{STOP_Y}"'
          ' text-anchor="middle">never reached</text>'
        + f'<rect class="slout-gh" x="{px:.0f}" y="{PILL_Y}" '
          f'width="{pw:.0f}" height="{PILL_H}" rx="16"/>'
        + f'<rect class="slout" x="{px:.0f}" y="{PILL_Y}" '
          f'width="{pw:.0f}" height="{PILL_H}" rx="16"/>'
        + f'<text class="slyou" x="{px - 30:.0f}" y="{PILL_Y + 48}" '
          'text-anchor="end">you get</text>'
        + lifts
        + _caps(PULL_CAPS)
        + '</svg>')
    return f'<div class="slwrap">{svg}</div>'


# ======================================================= slide 17, redrawn
JUMP_STEPS = 6
JUMP_LABELS = ("the string|start at 1|add 2|add 2 again|add 2, and stop|"
               "what it never looked at")


def jump_caps():
    a, b, st = P.JUMP_SLICE
    land = P.jump_landings()
    out = [('Same string, and the letters are not side by side.',
            'The line is up there. We are going to walk it together.')]
    out.append((f'The start is {land[0]}. That letter comes out.', ''))
    for k in range(1, len(land)):
        prev, now = land[k - 1], land[k]
        last = k == len(land) - 1
        out.append((f'{prev} plus the step {st} is {now}.',
                    f'The next one would be {now + st}, and we stop before '
                    f'{b}.' if last else ''))
    out.append(('It never looked at the hyphens at all.', ''))
    return out


JUMP_CAPS = jump_caps()


def jump_body():
    src = P.JUMP_SRC
    a, b, st = P.JUMP_SLICE
    land = P.jump_landings()
    n = len(src)
    c0 = _c0(n)
    px, pw = _pill(len(land))

    def cls_for(i):
        return " slin" if i in land else " slskip"

    # one element, parked on the start index. css() gives it one translate
    # per press, so the marker hops rather than being redrawn.
    marker = (f'<g class="slmark">'
              f'<path d="M{c0 + a * CELL - 14:.0f},{IDX_Y + 34} '
              f'h28 l-14,-22 z"/></g>')
    lifts = "".join(
        _lift(src[i], c0 + i * CELL, _slot(px, k), k + 2, k)
        for k, i in enumerate(land))
    svg = (
        f'<svg class="fig slfig jumpfig" viewBox="0 0 {VB_W} {VB_H}" '
        'xmlns="http://www.w3.org/2000/svg" role="img" '
        f'aria-label="The string {src} in numbered boxes, with a marker '
        'hopping two boxes at a time">'
        f'<text class="slsrc" x="60" y="{SRC_Y}">secret_message = '
        f'<tspan class="slstr">&quot;{html.escape(src)}&quot;</tspan></text>'
        # the line being traced, directly under the string and set large. It is
        # the question on this card, so it is up from press 1.
        + _expr('slex0', f'secret_message[{a}:{b}:{st}]')
        + _boxes(src, c0, cls_for=cls_for)
        + marker
        + f'<rect class="slout-gh" x="{px:.0f}" y="{PILL_Y}" '
          f'width="{pw:.0f}" height="{PILL_H}" rx="16"/>'
        + f'<rect class="slout" x="{px:.0f}" y="{PILL_Y}" '
          f'width="{pw:.0f}" height="{PILL_H}" rx="16"/>'
        + f'<text class="slyou" x="{px - 30:.0f}" y="{PILL_Y + 48}" '
          'text-anchor="end">you get</text>'
        + lifts
        + _caps(JUMP_CAPS)
        + '</svg>')
    return f'<div class="slwrap">{svg}</div>'


def css():
    """The per-step rules, generated so a step can never disagree with the
    picture of it."""
    out = ['/* --- the two redrawn slicing slides, one rule set per press --- */',
           '.slsrc{font:600 26px var(--mono);fill:var(--dk-text)}',
           '.slstr{fill:#22863A}',
           '.slyou{font:600 22px var(--sans);fill:#6B7784}',
           '.sllift{font:700 40px var(--mono);fill:var(--dk-blue);opacity:0}',
           # panel A lifts four at once, so they land in order. Panel B lifts
           # one per press and must not inherit the delay.
           '.slfig:not(.jumpfig) .lk1{transition-delay:60ms}',
           '.slfig:not(.jumpfig) .lk2{transition-delay:120ms}',
           '.slfig:not(.jumpfig) .lk3{transition-delay:180ms}',
           '.slout{opacity:0;transition:opacity 300ms var(--ease-out)}']
    # ---- panel A: indexing first, then the slice it is the answer to ----
    out += [
        # press 2 is one number in and one character out
        '.an-2 .slex1{opacity:1}',
        '.an-2 .pullfig .slzero .slbox{fill:#E9F6ED;stroke:#1F9D62;'
        'stroke-width:3}',
        '.an-2 .pullfig .slzero .slch{fill:#12633F}',
        # press 3 is the window, with no line written yet: the room writes it
        '.an-3 .slwin,.an-4 .slwin,.an-5 .slwin{opacity:1}',
        # press 4 writes the line, and the box it never reaches arrives with it
        '.an-4 .slex2,.an-5 .slex2{opacity:1}',
        '.an-4 .pullfig .slghost,.an-5 .pullfig .slghost{opacity:1}',
        '.an-4 .slstop,.an-5 .slstop{opacity:1}',
        # press 5 copies them out
        '.an-5 .slin .slbox{fill:#DCF0FB;stroke:var(--dk-blue);stroke-width:3}',
        '.an-5 .slin .slch{fill:var(--dk-blue)}',
        '.an-5 .lift5{opacity:1;transform:translate(var(--dx),var(--dy))}',
        '.an-5 .pullfig .slout{opacity:1}',
    ]
    # ---- panel B: the line from press 1, then one landing per press ----
    out.append('.jumpfig .slex0{opacity:1}')
    land = P.jump_landings()
    for k in range(len(land)):
        step = k + 2
        later = ",".join(f'.an-{s} .lift{step}'
                         for s in range(step, JUMP_STEPS + 1))
        out.append(later + '{opacity:1;transform:translate(var(--dx),var(--dy))}')
        sel = ",".join(f'.an-{s} .jumpfig .slcell[data-i="{land[k]}"] .slbox'
                       for s in range(step, JUMP_STEPS + 1))
        out.append(sel + '{fill:#DCF0FB;stroke:var(--dk-blue);stroke-width:3}')
        sel2 = ",".join(f'.an-{s} .jumpfig .slcell[data-i="{land[k]}"] .slch'
                        for s in range(step, JUMP_STEPS + 1))
        out.append(sel2 + '{fill:var(--dk-blue)}')
    out.append(",".join(f'.an-{s} .jumpfig .slmark'
                        for s in range(2, JUMP_STEPS + 1)) + '{opacity:1}')
    # the marker hops: one translate per press, the last one held
    a0 = P.JUMP_SLICE[0]
    for k, at in enumerate(land):
        steps = [k + 2] + ([JUMP_STEPS] if k == len(land) - 1 else [])
        for st in dict.fromkeys(steps):
            out.append(f'.an-{st} .jumpfig .slmark'
                       f'{{transform:translateX({(at - a0) * CELL}px)}}')
    out.append(",".join(f'.an-{s} .jumpfig .slout'
                        for s in range(2, JUMP_STEPS + 1)) + '{opacity:1}')
    out.append(f'.an-{JUMP_STEPS} .jumpfig .slskip .slbox'
               '{stroke-dasharray:7 6;stroke:#C7454E;opacity:.4}')
    out.append(f'.an-{JUMP_STEPS} .jumpfig .slskip .slch{{opacity:.35}}')
    # the captions, one per press, on both panels
    for k in range(1, max(PULL_STEPS, JUMP_STEPS) + 1):
        out.append(f'.an-{k} .slcap{k}{{opacity:1}}')
    return "\n".join(out)
