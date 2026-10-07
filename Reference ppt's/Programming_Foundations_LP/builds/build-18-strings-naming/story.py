"""The story that runs through session 18.

Two characters carry every concept card: Anu, a first-year student with her
college ID on a lanyard, and her computer, a monitor with a face. Anu asks in
plain words; the computer answers in numbers, because numbers are all it
understands. Each deck slide the session teaches from is redrawn as one scene
between them, one move per press. Nothing plays by itself.

Every character, number and output on a scene is read off Python (`ord`,
`chr`, `panels.run`, `keyword.kwlist`, `panels.accepts`); none is typed in.

Plumbing
  Scene(key, steps)   collects the CSS for one stage class, press by press
  anu(), pc()         the two characters; moods swap by opacity only
  bubble()            a speech bubble with its tail on the speaker
  code()              a white editor card drawn in SVG, with an Output strip
Animated elements are <g> wrappers with no transform attribute of their own,
because a CSS transform replaces an SVG transform attribute.
"""
import html
import keyword

import codecard as CODE
import panels as P

VB_W, VB_H = 1600, 700
INK = "#434343"
BLUE = "#006DAF"
SKY = "#3FB5E5"
OK = "#1F9D62"
BAD = "#C7454E"
AMBER = "#C77700"
HAIR = "#2B1B14"
SKIN = "#C98B5E"
SKIN_D = "#B27549"
KURTA = "#F29F3D"


def esc(s):
    return html.escape(str(s), quote=True)


# ----------------------------------------------------------------- the stage
class Scene:
    """One stage class and the rules that step it."""

    def __init__(self, key, steps):
        self.key, self.n, self.css = key, steps, []

    def sel(self, k, s, upto=None):
        top = self.n if upto is None else upto
        return ",".join(f".{self.key}.an-{j} {s}" for j in range(k, top + 1))

    def show(self, k, s, upto=None):
        """Visible from press k (through `upto`, else to the end)."""
        self.css.append(self.sel(k, s, upto) + "{opacity:1;transform:none}")

    def only(self, k, s):
        self.show(k, s, k)

    def rule(self, k, s, body, upto=None):
        self.css.append(self.sel(k, s, upto) + "{" + body + "}")

    def mood(self, k, who, m, upto=None):
        """who is 'anu' or 'pc'; m is 'o' (surprised) or 'no' (refuses)."""
        self.rule(k, f".{who} .m-smile", "opacity:0", upto if upto else k)
        self.rule(k, f".{who} .m-{m}", "opacity:1", upto if upto else k)


def figure(body, label):
    return (f'<div class="sywrap"><svg class="syfig" viewBox="0 0 {VB_W} {VB_H}" '
            f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{esc(label)}">'
            f'{body}</svg></div>')


def rich(s, accent=BLUE):
    """**bold** turns blue and heavy; `code` turns mono. Nothing else."""
    s = str(s)
    out, bold, mono, buf = "", False, False, ""

    def flush():
        nonlocal buf, out
        if not buf:
            return
        attrs = ""
        if bold:
            attrs += f' font-weight="800" fill="{accent}"'
        if mono:
            attrs += ' class="sy-mono"'
        out += f"<tspan{attrs}>{esc(buf)}</tspan>" if attrs else esc(buf)
        buf = ""
    i = 0
    while i < len(s):
        if s.startswith("**", i):
            flush(); bold = not bold; i += 2; continue
        if s[i] == "`":
            flush(); mono = not mono; i += 1; continue
        buf += s[i]; i += 1
    flush()
    return out


def T(x, y, s, size=26, weight=500, fill=INK, anchor="start", cls="", mono=False):
    c = " ".join(filter(None, [cls, "sy-mono" if mono else ""]))
    c = f' class="{c}"' if c else ""
    return (f'<text{c} x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}">{rich(s)}</text>')


def g(cls, inner):
    return f'<g class="{cls}">{inner}</g>'


# ------------------------------------------------------------------ the cast
def anu(x, y, s=1.0):
    """Anu, 220 x 300 at scale 1, head at the top. Moods: smile, o."""
    return (
        f'<g class="anu" transform="translate({x},{y}) scale({s})">'
        f'<ellipse cx="110" cy="84" rx="66" ry="72" fill="{HAIR}"/>'
        f'<circle cx="170" cy="56" r="25" fill="{HAIR}"/>'
        f'<path d="M22 300C22 206 58 172 110 168C162 172 198 206 198 300Z" fill="{KURTA}"/>'
        f'<rect x="96" y="128" width="28" height="46" rx="10" fill="{SKIN_D}"/>'
        f'<path d="M92 170L110 198L128 170Z" fill="#FFE3C2"/>'
        f'<ellipse cx="59" cy="102" rx="9" ry="13" fill="{SKIN_D}"/>'
        f'<ellipse cx="161" cy="102" rx="9" ry="13" fill="{SKIN_D}"/>'
        f'<ellipse cx="110" cy="98" rx="51" ry="57" fill="{SKIN}"/>'
        f'<path d="M58 98C54 46 84 30 112 30C142 30 168 48 162 98C150 66 132 58 110 58'
        f'C90 58 70 68 58 98Z" fill="{HAIR}"/>'
        f'<path d="M83 88q9 -6 18 0M119 88q9 -6 18 0" stroke="{HAIR}" stroke-width="3.5" '
        'fill="none" stroke-linecap="round"/>'
        f'<circle cx="92" cy="102" r="5.5" fill="{HAIR}"/><circle cx="128" cy="102" r="5.5" fill="{HAIR}"/>'
        '<circle cx="80" cy="120" r="8" fill="#E07A5F" opacity=".25"/>'
        '<circle cx="140" cy="120" r="8" fill="#E07A5F" opacity=".25"/>'
        '<path class="m-smile" d="M96 124Q110 137 124 124" stroke="#7A3E22" stroke-width="3.5" '
        'fill="none" stroke-linecap="round"/>'
        '<ellipse class="m-o" cx="110" cy="128" rx="7" ry="9" fill="#7A3E22"/>'
        f'<path d="M84 172L110 240L136 172" stroke="{BLUE}" stroke-width="5" fill="none"/>'
        '<rect x="80" y="236" width="60" height="58" rx="7" fill="#fff" stroke="#D5DEE5" stroke-width="2"/>'
        f'<rect x="80" y="236" width="60" height="14" rx="4" fill="{BLUE}"/>'
        + T(110, 280, "Anu", 18, 800, "#1B2530", "middle")
        + '</g>')


def pc(x, y, s=1.0):
    """The computer, 300 x 272 at scale 1. Moods: smile, o, no."""
    return (
        f'<g class="pc" transform="translate({x},{y}) scale({s})">'
        '<path d="M126 212L174 212L186 258L114 258Z" fill="#A9B6C2"/>'
        '<rect x="84" y="254" width="132" height="18" rx="9" fill="#8A98A6"/>'
        '<rect x="0" y="0" width="300" height="216" rx="24" fill="#24313F"/>'
        '<rect x="16" y="16" width="268" height="166" rx="12" fill="#EAF4FB"/>'
        '<circle cx="150" cy="8" r="3" fill="#5C6B7A"/>'
        + T(150, 206, "Computer", 16, 700, "#9FB0C0", "middle")
        + f'<rect x="104" y="56" width="20" height="34" rx="10" fill="{BLUE}"/>'
        f'<rect x="176" y="56" width="20" height="34" rx="10" fill="{BLUE}"/>'
        f'<circle cx="86" cy="118" r="11" fill="{SKY}" opacity=".3"/>'
        f'<circle cx="214" cy="118" r="11" fill="{SKY}" opacity=".3"/>'
        f'<path class="m-smile" d="M116 118Q150 146 184 118" stroke="{BLUE}" stroke-width="7" '
        'fill="none" stroke-linecap="round"/>'
        f'<ellipse class="m-o" cx="150" cy="128" rx="14" ry="12" fill="{BLUE}"/>'
        f'<g class="m-no"><path d="M120 134L180 134" stroke="{BAD}" stroke-width="7" '
        'stroke-linecap="round"/>'
        f'<path d="M98 44L128 54M202 44L172 54" stroke="{BAD}" stroke-width="6" '
        'stroke-linecap="round"/></g>'
        '</g>')


def bubble(cls, x, y, lines, who, tail, w=None, size=26):
    """A speech bubble. `who` is 'anu' (warm) or 'pc' (blue); `tail` is the
    point it aims at, outside the bubble."""
    if w is None:
        longest = max(len(ln.replace("**", "").replace("`", "")) for ln in lines)
        w = int(longest * size * 0.53 + 52)
    lh = size * 1.36
    h = int(len(lines) * lh + 36)
    fill, stroke = (("#FFF7EE", "#F0A04B") if who == "anu" else ("#EFF7FD", SKY))
    tx, ty = tail
    if ty > y + h:                       # tail below
        bx = min(max(tx, x + 44), x + w - 44)
        pts, e1, e2 = (bx - 18, y + h - 2), (bx + 18, y + h - 2), (tx, ty)
    elif ty < y:                         # tail above
        bx = min(max(tx, x + 44), x + w - 44)
        pts, e1, e2 = (bx - 18, y + 2), (bx + 18, y + 2), (tx, ty)
    elif tx < x:                         # tail left
        by = min(max(ty, y + 30), y + h - 30)
        pts, e1, e2 = (x + 2, by - 16), (x + 2, by + 16), (tx, ty)
    else:                                # tail right
        by = min(max(ty, y + 30), y + h - 30)
        pts, e1, e2 = (x + w - 2, by - 16), (x + w - 2, by + 16), (tx, ty)
    body = "".join(T(x + 26, y + 18 + size + i * lh, ln, size, 600, "#1B2530")
                   for i, ln in enumerate(lines))
    return (f'<g class="sb {cls}">'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="20" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="2.5"/>'
            f'<path d="M{pts[0]} {pts[1]}L{e2[0]} {e2[1]}L{e1[0]} {e1[1]}Z" fill="{fill}"/>'
            f'<path d="M{pts[0]} {pts[1]}L{e2[0]} {e2[1]}L{e1[0]} {e1[1]}" fill="none" '
            f'stroke="{stroke}" stroke-width="2.5" stroke-linejoin="round"/>'
            f'{body}</g>')


# --------------------------------------------------------------- the pieces
def tile(cls, x, y, w, h, s, kind="ch", size=None):
    """A letter tile (kind 'ch') or a number tile (kind 'n')."""
    if kind == "n":
        fill, stroke, col = "#EAF4FB", SKY, BLUE
    else:
        fill, stroke, col = "#fff", "#C9D6E0", "#1B2530"
    size = size or int(min(h * .46, w * .9 / max(1, len(str(s))) / .6))
    return (f'<g class="{cls}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="2.5"/>'
            + T(x + w / 2, y + h / 2 + size * .36, s, size, 800, col, "middle", mono=True)
            + '</g>')


def slot(x, y, w, h, rx=14):
    return (f'<rect class="syslot" x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/>')


def arrow(cls, x1, y1, x2, y2, col=SKY, wd=5):
    """A straight arrow with its head drawn in (no marker ids)."""
    import math
    a = math.atan2(y2 - y1, x2 - x1)
    hx, hy = x2 - 18 * math.cos(a), y2 - 18 * math.sin(a)
    l = (hx + 11 * math.sin(a), hy - 11 * math.cos(a))
    r = (hx - 11 * math.sin(a), hy + 11 * math.cos(a))
    return (f'<g class="{cls}"><path d="M{x1:.0f} {y1:.0f}L{hx:.0f} {hy:.0f}" stroke="{col}" '
            f'stroke-width="{wd}" stroke-linecap="round"/>'
            f'<path d="M{x2:.0f} {y2:.0f}L{l[0]:.0f} {l[1]:.0f}L{r[0]:.0f} {r[1]:.0f}Z" '
            f'fill="{col}"/></g>')


def machine(cls, x, y, w, h, word):
    """The function as a box the computer works: ord( ) or chr( )."""
    return (f'<g class="{cls}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" '
            f'fill="{BLUE}"/>'
            f'<rect x="{x + 10}" y="{y + 10}" width="{w - 20}" height="{h - 20}" rx="12" '
            f'fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-dasharray="6 6"/>'
            + T(x + w / 2, y + h / 2 + 15, f"{word}( )", 42, 800, "#fff", "middle", mono=True)
            + '</g>')


def banner(cls, x, y, w, line, sub=None, size=30):
    h = 90 if sub is None else 124
    out = (slot(x, y, w, h, 18) + f'<g class="{cls}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" '
           f'fill="{BLUE}"/>'
           + T(x + w / 2, y + 56, line, size, 800, "#fff", "middle"))
    if sub:
        out += T(x + w / 2, y + 98, sub, 23, 500, "#DCEFFB", "middle")
    return out + "</g>"


def _paint_svg(line):
    return (CODE.paint(line)
            .replace("<b>", f'<tspan fill="{BAD}">').replace("</b>", "</tspan>")
            .replace("<i>", f'<tspan fill="{BLUE}">').replace("</i>", "</tspan>")
            .replace("<em>", '<tspan fill="#22863A">').replace("</em>", "</tspan>"))


def code(cls, x, y, w, src, tab, size=28, out=None, out_cls="", hi=()):
    """A white editor card: file tab, line numbers, coloured code. With `out`,
    an Output strip below whose value sits in `out_cls` (hidden until its press).
    Returns (svg, height)."""
    lines = src.split("\n")
    lh = size * 1.55
    th = 42
    bh = int(len(lines) * lh + 26)
    oh = 0 if out is None else int(max(1, len(out)) * lh + 58)
    H = th + bh + oh
    s = (f'<g class="{cls}">'
         f'<rect x="{x}" y="{y}" width="{w}" height="{H}" rx="14" fill="#fff" '
         'stroke="#DDE5EC" stroke-width="2"/>'
         f'<path d="M{x + 1} {y + th}V{y + 14}Q{x + 1} {y + 1} {x + 14} {y + 1}H{x + w - 14}'
         f'Q{x + w - 1} {y + 1} {x + w - 1} {y + 14}V{y + th}Z" fill="#F4F7FA"/>'
         f'<path d="M{x} {y + th}H{x + w}" stroke="#E2E9EF" stroke-width="2"/>'
         f'<circle cx="{x + 24}" cy="{y + th / 2}" r="6" fill="{SKY}"/>'
         + T(x + 40, y + th / 2 + 7, tab, 19, 600, "#6B7784"))
    for i, ln in enumerate(lines, 1):
        ly = y + th + 13 + i * lh - lh * .3
        if i in hi:
            s += (f'<rect x="{x + 2}" y="{ly - size * 1.02:.0f}" width="{w - 4}" '
                  f'height="{lh:.0f}" fill="#FFF6E2"/>'
                  f'<rect x="{x + 2}" y="{ly - size * 1.02:.0f}" width="4" height="{lh:.0f}" '
                  'fill="#E8A13A"/>')
        s += (f'<text x="{x + 34}" y="{ly:.0f}" font-size="{size * .62:.0f}" font-weight="700" '
              f'fill="#9AA1B0" text-anchor="middle" class="sy-mono">{i}</text>'
              f'<text x="{x + 60}" y="{ly:.0f}" font-size="{size}" fill="{INK}" '
              f'class="sy-mono" xml:space="preserve">{_paint_svg(ln)}</text>')
    if out is not None:
        oy = y + th + bh
        s += (f'<path d="M{x} {oy}H{x + w}" stroke="#E2E9EF" stroke-width="2"/>'
              f'<rect x="{x + 18}" y="{oy + 14}" width="86" height="28" rx="6" fill="{BAD}"/>'
              + T(x + 61, oy + 34, "Output", 17, 700, "#fff", "middle")
              + f'<g class="{out_cls}">'
              + "".join(T(x + 60, oy + 50 + (j + 1) * lh - lh * .25, v, size, 700, "#12633F",
                          mono=True) for j, v in enumerate(out))
              + '</g>')
    return s + "</g>", H


# ----------------------------------------------------------------- positions
# side layout: the two stand at the sides and the middle is theirs
ANU_SIDE = (40, 392)
PC_SIDE = (1272, 420)
ANU_HEAD_SIDE = (150, 392)
PC_HEAD_SIDE = (1420, 420)
# bottom layout: smaller, in the corners, the top is the content
ANU_LOW = (54, 462, .8)
PC_LOW = (1318, 482, .8)
ANU_TAIL_LOW = (230, 540)
PC_TAIL_LOW = (1310, 560)


def cast_side():
    return anu(*ANU_SIDE) + pc(*PC_SIDE)


def cast_low():
    return anu(*ANU_LOW) + pc(*PC_LOW)


def say_anu_low(cls, lines, w=None):
    return bubble(cls, 270, 482, lines, "anu", ANU_TAIL_LOW, w)


def say_pc_low(cls, lines, w=None):
    ww = w or int(max(len(ln.replace("**", "").replace("`", "")) for ln in lines) * 26 * .53 + 52)
    return bubble(cls, 1286 - ww, 500, lines, "pc", PC_TAIL_LOW, ww)


def _bh(lines, size=26):
    return int(len(lines) * size * 1.36 + 36)


def say_anu_side(cls, lines, y=None, w=None):
    y = ANU_HEAD_SIDE[1] - 34 - _bh(lines) if y is None else y
    return bubble(cls, 30, y, lines, "anu", ANU_HEAD_SIDE, w)


def say_pc_side(cls, lines, y=None, w=None):
    ww = w or int(max(len(ln.replace("**", "").replace("`", "")) for ln in lines) * 26 * .53 + 52)
    y = PC_HEAD_SIDE[1] - 34 - _bh(lines) if y is None else y
    return bubble(cls, 1576 - ww, y, lines, "pc", PC_HEAD_SIDE, ww)


# ======================================================== 1. Unicode (slide 8)
U1_CHARS = ["A", "z", "1", "*"]


def unicode_scene():
    sc = Scene("su1", 5)
    xs = [470 + i * 180 for i in range(4)]
    b = cast_side()
    b += T(470, 72, "What you see", 24, 700, "#6B7A86")
    b += T(470, 330, "What the computer stores", 24, 700, "#6B7A86")
    for i, ch in enumerate(U1_CHARS):
        x = xs[i]
        b += slot(x, 88, 130, 130) + slot(x, 348, 130, 130)
        b += tile(f"sx u1c{i}", x, 88, 130, 130, ch, size=64)
        b += arrow(f"sx u1a{i}", x + 65, 226, x + 65, 300)
        b += tile(f"sx u1n{i}", x, 348, 130, 130, ord(ch), "n", size=50)
    b += say_anu_side("u1b1", ["I press **A** on", "my keyboard."])
    b += say_pc_side("u1p2", ["I keep it as **65**.", "I only understand", "numbers."])
    b += say_anu_side("u1b3", ["And small **z**?"])
    b += say_pc_side("u1p3", [f"z is **{ord('z')}**. A different", "number from Z."])
    b += say_anu_side("u1b4", ["What about **1**", "and * ?"])
    b += say_pc_side("u1p4", [f"1 is **{ord('1')}**. * is **{ord('*')}**.", "A digit is a",
                              "character too."])
    b += say_pc_side("u1p5", ["Every character", "has its own number."])
    b += banner("sx u1ban", 330, 540, 910, "This number is the character's Unicode value.",
                "What you see: A.   What the computer stores: 65.")
    sc.only(1, ".u1b1")
    sc.show(1, ".u1c0")
    sc.show(2, ".u1a0"); sc.show(2, ".u1n0"); sc.only(2, ".u1p2"); sc.mood(2, "anu", "o")
    for i in (1,):
        sc.show(3, f".u1c{i}"); sc.show(3, f".u1a{i}"); sc.show(3, f".u1n{i}")
    sc.only(3, ".u1b3"); sc.only(3, ".u1p3")
    for i in (2, 3):
        sc.show(4, f".u1c{i}"); sc.show(4, f".u1a{i}"); sc.show(4, f".u1n{i}")
    sc.only(4, ".u1b4"); sc.only(4, ".u1p4"); sc.mood(4, "anu", "o")
    sc.show(5, ".u1ban"); sc.only(5, ".u1p5")
    # a new pair lands with a little stagger, number after letter
    for i in range(4):
        sc.css.append(f".syfig .u1a{i}{{transition-delay:120ms}}.syfig .u1n{i}{{transition-delay:240ms}}")
    return (figure(b, "Anu presses keys. The computer stores each character as a number: "
                   + ", ".join(f"{c} is {ord(c)}" for c in U1_CHARS) + "."),
            sc, "A|65|z|1 and *|Unicode value")


# ===================================================== 2. ord (slides 9, 10)
def ord_scene():
    sc = Scene("su2", 5)
    b = cast_side()
    c1, h1 = code("sx o2k1", 350, 20, 620, P.S10, "unicode.py", out=[str(ord("A"))],
                  out_cls="sx o2o1")
    c2, _ = code("sx o2k2", 350, 20, 620, P.S10.replace('"A"', '"a"'), "unicode.py",
                 out=[str(ord("a"))], out_cls="sx o2o2")
    b += c1 + c2
    ry = 20 + h1 + 44
    b += slot(400, ry, 130, 130) + slot(1000, ry, 130, 130)
    b += tile("sx o2in1", 400, ry, 130, 130, "A", size=64)
    b += tile("sx o2in2", 400, ry, 130, 130, "a", size=64)
    b += arrow("sx o2ar", 545, ry + 65, 615, ry + 65)
    b += machine("sx o2m", 630, ry, 260, 130, "ord")
    b += arrow("sx o2ar2", 905, ry + 65, 985, ry + 65)
    b += tile("sx o2r1", 1000, ry, 130, 130, ord("A"), "n", size=50)
    b += tile("sx o2q", 1000, ry, 130, 130, "?", "n", size=60)
    b += tile("sx o2r2", 1000, ry, 130, 130, ord("a"), "n", size=50)
    b += say_anu_side("o2b1", ["What number do", "you keep for **A**?"])
    b += say_pc_side("o2p2", ["Ask me with **ord**.", "Put the character", "inside."])
    b += say_pc_side("o2p3", [f"**{ord('A')}**. That is my", "number for A."])
    b += say_anu_side("o2b4", ["So what is", '`ord("a")`?', "Guess first!"])
    b += say_pc_side("o2p5", [f"**{ord('a')}**. Small a has", "its own number."])
    b += banner("sx o2ban", 330, 560, 910, "ord(character) gives its Unicode value.")
    sc.show(1, ".o2in1", 2); sc.only(1, ".o2b1")
    sc.show(2, ".o2k1", 3); sc.show(2, ".o2m"); sc.show(2, ".o2ar"); sc.only(2, ".o2p2")
    sc.show(3, ".o2ar2"); sc.show(3, ".o2ban")
    sc.only(3, ".o2r1"); sc.show(3, ".o2o1", 3); sc.only(3, ".o2p3")
    sc.rule(3, ".o2in1", "opacity:0;transform:translateX(250px) scale(.6)", 3)
    sc.show(4, ".o2k2"); sc.show(4, ".o2in2"); sc.only(4, ".o2q"); sc.only(4, ".o2b4")
    sc.mood(4, "anu", "o")
    sc.show(5, ".o2r2"); sc.show(5, ".o2o2"); sc.only(5, ".o2p5")
    sc.css.append(".syfig .o2r1,.syfig .o2r2{transition-delay:260ms}")
    return (figure(b, f'Anu asks the computer for the number of A. ord("A") gives {ord("A")}, '
                   f'and ord("a") gives {ord("a")}.'),
            sc, "the question|ord|65|guess ord of a|97")


# ===================================================== 3. chr (slides 11, 12)
CHR_NUMS = (75, 100)


def chr_scene():
    sc = Scene("su3", 4)
    b = cast_side()
    k = []
    for i, n in enumerate(CHR_NUMS, 1):
        src = f"char = chr({n})\nprint(char)"
        out, err = P.run(src)
        assert err is None and out == [chr(n)]
        c, h = code(f"sx c3k{i}", 330 + (i - 1) * 470, 20, 440, src, f"char{i}.py", out=out,
                    out_cls=f"sx c3o{i}")
        b += c
        k.append(h)
    ry = 20 + max(k) + 40
    b += slot(400, ry, 130, 130) + slot(1000, ry, 130, 130)
    b += tile("sx c3in1", 400, ry, 130, 130, CHR_NUMS[0], "n", size=50)
    b += tile("sx c3in2", 400, ry, 130, 130, CHR_NUMS[1], "n", size=46)
    b += arrow("sx c3ar", 545, ry + 65, 615, ry + 65)
    b += machine("sx c3m", 630, ry, 260, 130, "chr")
    b += arrow("sx c3ar2", 905, ry + 65, 985, ry + 65)
    b += tile("sx c3r1", 1000, ry, 130, 130, chr(CHR_NUMS[0]), size=64)
    b += tile("sx c3q", 1000, ry, 130, 130, "?", size=60)
    b += tile("sx c3r2", 1000, ry, 130, 130, chr(CHR_NUMS[1]), size=64)
    b += say_anu_side("c3b1", ["Now the other way.", "I give you a **number**."])
    b += say_pc_side("c3p2", [f"**{CHR_NUMS[0]}** is **{chr(CHR_NUMS[0])}**. Use **chr**",
                              "for number to", "character."])
    b += say_anu_side("c3b3", [f"And `chr({CHR_NUMS[1]})`?", "Guess first!"])
    b += say_pc_side("c3p4", [f"**{CHR_NUMS[1]}** is small **{chr(CHR_NUMS[1])}**."])
    b += banner("sx c3ban", 330, 560, 910, "ord: character to number.   chr: number to character.")
    sc.show(1, ".c3in1", 1); sc.show(1, ".c3k1"); sc.show(1, ".c3m"); sc.show(1, ".c3ar")
    sc.only(1, ".c3b1")
    sc.show(2, ".c3ar2"); sc.only(2, ".c3r1"); sc.show(2, ".c3o1"); sc.only(2, ".c3p2")
    sc.rule(2, ".c3in1", "opacity:0;transform:translateX(250px) scale(.6)", 2)
    sc.show(3, ".c3k2"); sc.show(3, ".c3in2"); sc.only(3, ".c3q"); sc.only(3, ".c3b3")
    sc.mood(3, "anu", "o")
    sc.show(4, ".c3r2"); sc.show(4, ".c3o2"); sc.only(4, ".c3p4"); sc.show(4, ".c3ban")
    sc.css.append(".syfig .c3r1,.syfig .c3r2{transition-delay:260ms}")
    return (figure(b, "Anu gives the computer a number and gets a character back: "
                   + ", ".join(f"chr({n}) is {chr(n)}" for n in CHR_NUMS) + "."),
            sc, "number in|75 is K|guess chr of 100|100 is d")


# ================================================= 4. Unicode ranges (slide 13)
RANGES = [("0123456789", "digits"), ("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "capital letters"),
          ("abcdefghijklmnopqrstuvwxyz", "small letters")]
REST = ["@", "₹", "అ", "அ"]


def ranges_scene():
    sc = Scene("su4", 4)
    b = cast_low()
    for r, (chars, name) in enumerate(RANGES):
        y = 24 + r * 106
        lo, hi = ord(chars[0]), ord(chars[-1])
        b += (f'<rect class="syslot" x="40" y="{y}" width="1520" height="94" rx="16"/>')
        inner = (f'<rect x="40" y="{y}" width="1520" height="94" rx="16" fill="#F5FAFD" '
                 f'stroke="#CFE3F1" stroke-width="2"/>'
                 + T(64, y + 46, f"{lo} to {hi}", 34, 800, BAD)
                 + T(64, y + 78, name, 21, 600, "#6B7A86"))
        for i, ch in enumerate(chars):
            x = 300 + i * 48.5
            inner += (f'<g class="rgt" style="transition-delay:{i * 18}ms">'
                      f'<rect x="{x:.0f}" y="{y + 12}" width="42" height="48" rx="8" '
                      'fill="#fff" stroke="#C9D6E0" stroke-width="2"/>'
                      + T(x + 21, y + 46, ch, 26, 800, "#1B2530", "middle", mono=True)
                      + T(x + 21, y + 82, ord(ch), 15, 700, BLUE, "middle", mono=True)
                      + '</g>')
        b += g(f"sx rg{r + 1}", inner)
    y = 24 + 3 * 106
    inner = (f'<rect x="40" y="{y}" width="1520" height="94" rx="16" fill="#FFF8EF" '
             f'stroke="#F3D3A8" stroke-width="2"/>'
             + T(64, y + 46, "Everything else", 30, 800, AMBER)
             + T(64, y + 78, "signs, and other languages", 21, 600, "#6B7A86"))
    for i, ch in enumerate(REST):
        x = 420 + i * 280
        inner += (f'<g class="rgt" style="transition-delay:{i * 60}ms">'
                  f'<rect x="{x}" y="{y + 12}" width="240" height="70" rx="10" fill="#fff" '
                  'stroke="#E8C79B" stroke-width="2"/>'
                  + f'<text x="{x + 60}" y="{y + 60}" font-size="40" font-weight="700" '
                    f'fill="#1B2530" text-anchor="middle" class="sy-ind">{esc(ch)}</text>'
                  + T(x + 160, y + 58, ord(ch), 30, 800, BLUE, "middle", mono=True)
                  + '</g>')
    b += f'<rect class="syslot" x="40" y="{y}" width="1520" height="94" rx="16"/>'
    b += g("sx rg4", inner)
    b += say_anu_low("r4b1", ["Where do the digits live?"])
    b += say_pc_low("r4p1", ["At **48 to 57**. Even", "0 is not stored as 0."])
    b += say_pc_low("r4p2", ["Capitals sit at", "**65 to 90**."])
    b += say_pc_low("r4p3", ["Small letters sit at", "**97 to 122**."])
    b += say_anu_low("r4b4", ["Even ₹, and Telugu", "and Tamil letters?"])
    b += say_pc_low("r4p4", ["Yes. Every character,", "in every language."])
    for r in range(1, 5):
        sc.show(r, f".rg{r}")
    sc.only(1, ".r4b1"); sc.only(1, ".r4p1")
    sc.only(2, ".r4p2"); sc.only(3, ".r4p3")
    sc.only(4, ".r4b4"); sc.only(4, ".r4p4"); sc.mood(4, "anu", "o")
    sc.css.append(".rgt{opacity:0;transition:opacity 220ms var(--ease-out)}")
    for r in range(1, 5):
        sc.rule(r, f".rg{r} .rgt", "opacity:1")
    return (figure(b, "The computer's number ranges: digits 48 to 57, capital letters 65 to "
                   "90, small letters 97 to 122, and every other character in every "
                   "language has a number too."),
            sc, "digits|capitals|small letters|everything else")


# ============================================ 5. a loop prints A to Z (slide 14)
def loop_scene():
    sc = Scene("su5", 5)
    out, err = P.run(P.S14)
    assert err is None and out[0] == "A" and out[-1] == "Z" and len(out) == 26
    shown = [0, 1, 2, 25]                # 65, 66, 67, then 90
    # Anu low on the left; the computer stands up on the right, beside its output
    b = anu(*ANU_LOW) + pc(1250, 150)
    c, h = code("sy-code", 40, 20, 760, P.S14, "letters.py", size=28)
    b += c
    # the variable box: the value now, the ones before struck through
    vy = 20 + h + 22
    b += (f'<rect x="40" y="{vy}" width="760" height="112" rx="16" fill="#fff" '
          'stroke="#C9D6E0" stroke-width="2"/>'
          + T(62, vy + 32, "unicode_value", 22, 700, "#6B7A86", mono=True))
    for j, i in enumerate(shown):
        x = 70 + j * 170
        b += g(f"sx l5v{j}", T(x + 50, vy + 88, 65 + i, 44, 800, BLUE, "middle", mono=True)
               + f'<path class="l5s l5s{j}" d="M{x + 6} {vy + 74}H{x + 94}" stroke="{BAD}" '
               'stroke-width="4"/>')
        if j == 2:
            b += g("sx l5dots", T(x + 135, vy + 86, "...", 40, 800, "#9AA7B1", "middle"))
    # what chr makes of the value, one pair per press
    my = vy + 134
    b += slot(300, my, 120, 110) + slot(680, my, 120, 110)
    b += arrow("sx l5ar", 430, my + 55, 470, my + 55)
    b += machine("sx l5m", 480, my, 180, 110, "chr")
    for j, i in enumerate(shown):
        b += tile(f"sx l5in{j}", 300, my, 120, 110, 65 + i, "n", size=44)
        b += tile(f"sx l5ch{j}", 680, my, 120, 110, out[i], size=58)
    # the output card: every letter printed so far stays
    b += (f'<rect x="850" y="20" width="360" height="440" rx="16" fill="#fff" '
          'stroke="#DDE5EC" stroke-width="2"/>'
          f'<rect x="870" y="36" width="86" height="28" rx="6" fill="{BAD}"/>'
          + T(913, 56, "Output", 17, 700, "#fff", "middle"))
    for j, i in enumerate(shown):
        yy = 124 + j * 78 + (46 if j == 3 else 0)
        b += g(f"sx l5o{j}", T(900, yy, out[i], 46, 800, "#12633F", mono=True))
    b += g("sx l5odots", T(900, 124 + 3 * 78 - 8, "...", 40, 800, "#9AA7B1"))
    b += say_anu_low("l5b1", ["Can you print", "A to Z for me?"])
    def says(cls, lines):
        w = int(max(len(ln.replace("**", "")) for ln in lines) * 26 * .53 + 52)
        return bubble(cls, 1560 - w, 470, lines, "pc", (1400, 436), w)
    b += says("l5p1", ["Easy. I walk from **65** to **90**.", "chr turns each into a letter."])
    b += says("l5p2", [f"**65** is **{out[0]}**. Print it."])
    b += says("l5p3", [f"**66** is **{out[1]}**. Print it."])
    b += says("l5p4", [f"**67** is **{out[2]}**. Print it."])
    b += says("l5p5", [f"... all the way to **90**: **{out[25]}**.", "range stops before 91."])
    sc.only(1, ".l5b1"); sc.only(1, ".l5p1")
    sc.show(1, ".l5m"); sc.show(1, ".l5ar")
    for j in range(4):
        sc.show(j + 2, f".l5v{j}"); sc.show(j + 2, f".l5o{j}")
        sc.only(j + 2, f".l5in{j}"); sc.only(j + 2, f".l5ch{j}")
        sc.rule(j + 3, f".l5s{j}", "opacity:1")
        sc.only(j + 2, f".l5p{j + 2}")
    sc.show(5, ".l5dots"); sc.show(5, ".l5odots")
    sc.css.append(".l5s{opacity:0;transition:opacity 200ms var(--ease-out)}"
                  ".syfig .l5ch0,.syfig .l5ch1,.syfig .l5ch2,.syfig .l5ch3{transition-delay:200ms}")
    return (figure(b, "The loop walks unicode_value from 65 to 90 and prints chr of each: "
                   f"{out[0]}, {out[1]}, {out[2]}, and so on up to {out[25]}."),
            sc, "the ask|65 is A|66 is B|67 is C|90 is Z")


# ========================================= 6. character by character (slide 19)
def compare_scene():
    a, op, bb = P.EXPL
    sc = Scene("su6", 3)
    b = cast_side()
    c, h = code("sy-code", 520, 20, 560, P.cmp_src(a, op, bb), "compare.py", size=30)
    b += c
    xs = [560 + i * 170 for i in range(3)]
    for row, word, y in (("a", a, 210), ("b", bb, 380)):
        for i, ch in enumerate(word):
            x = xs[i]
            b += (f'<g class="c6t"><rect x="{x}" y="{y}" width="140" height="140" rx="16" '
                  'fill="#fff" stroke="#C9D6E0" stroke-width="2.5"/>'
                  + T(x + 70, y + 72, ch, 62, 800, "#1B2530", "middle", mono=True)
                  + g("sx c6n", T(x + 70, y + 120, ord(ch), 30, 800, BLUE, "middle", mono=True))
                  + '</g>')
    b += T(520, 380 - 12, op, 40, 800, BAD, "end", mono=True)
    b += g("sx c6pair", f'<rect x="{xs[0] - 12}" y="198" width="164" height="334" rx="22" '
           f'fill="none" stroke="{BLUE}" stroke-width="5" stroke-dasharray="12 8"/>'
           + T(xs[0] + 70, 574, "pair 1", 26, 800, BLUE, "middle"))
    b += arrow("sx c6go", xs[0] + 170, 560, xs[2] + 140, 560, BLUE, 5)
    b += say_anu_side("c6b1", ["Is BAD bigger than", "or equal to BAT?", "How does it check?"])
    b += say_pc_side("c6p2", ["I do not see words.", "I see **numbers**."])
    b += say_pc_side("c6p3", ["I start at the **left**.", "One pair at a time."])
    b += banner("sx c6ban", 330, 604, 910, "Python compares strings character by character.",
                size=28)
    sc.only(1, ".c6b1")
    sc.show(2, ".c6n"); sc.only(2, ".c6p2"); sc.mood(2, "anu", "o")
    sc.show(3, ".c6pair"); sc.show(3, ".c6go"); sc.show(3, ".c6ban"); sc.only(3, ".c6p3")
    return (figure(b, f"The computer turns {a} and {bb} into numbers and compares them one "
                   "pair of letters at a time, from the left."),
            sc, "the question|numbers|one pair at a time")


# ================================================ 7. the four rules (27 to 34)
RULES = [
    ("Use only letters, digits and _", "A to Z, a to z, 0 to 9, and the underscore _"),
    ("No spaces, commas or special characters", "like  ~ ! @ # $ % ^ . ?"),
    ("Begin with a letter or _", "never with a digit"),
    ("Do not use a keyword", "like while. Python keeps those for itself."),
]
RULE_NAMES = [
    ["age", "input_1", "high_score", "_counter2"],
    ["left", "start_playing", "read, write & learn"],
    ["left", "_player1", "Height_in_feet", "1_player"],
    ["move", "_player1", "_if", "while"],
]
RULE_ASK = [
    ["I want names for my", "boxes. Can I use these?"],
    ["What about spaces", "and commas?"],
    ["Can a name begin", "with a digit?"],
    ["Can I call my", "box **while**?"],
]
RULE_SAYS = [
    ["Yes. Letters, digits", "and _ are all fine."],
    ["No spaces, no commas,", "no **&**. I refuse the last."],
    ["**1_player** begins with", "a digit. I refuse it."],
    ["**while** is my own word.", "It is a keyword."],
]


def rules_scene():
    sc = Scene("su7", 8)
    b = cast_low()
    for r, (h1, h2) in enumerate(RULES, 1):
        y = 20 + (r - 1) * 110
        b += f'<rect class="syslot" x="40" y="{y}" width="680" height="96" rx="16"/>'
        b += g(f"sx r7r{r}",
               f'<rect class="r7box" x="40" y="{y}" width="680" height="96" rx="16" '
               'fill="#fff" stroke="#C9D6E0" stroke-width="2.5"/>'
               f'<circle cx="84" cy="{y + 48}" r="24" fill="{BLUE}"/>'
               + T(84, y + 57, str(r), 26, 800, "#fff", "middle")
               + T(124, y + 42, h1, 26, 800, "#1B2530")
               + T(124, y + 76, h2, 21, 500, "#5A6A75"))
    for r, names in enumerate(RULE_NAMES, 1):
        grp = ""
        for i, nm in enumerate(names):
            ok = _legal(nm)
            col, row = i % 2, i // 2
            x, y = 770 + col * 400, 30 + row * 200
            fs = 30 if len(nm) <= 14 else 22
            grp += (f'<g class="r7tag"><rect x="{x}" y="{y}" width="370" height="150" rx="18" '
                    'fill="#FFF8EF" stroke="#E8C79B" stroke-width="2.5"/>'
                    f'<path d="M{x + 30} {y + 62}h310v62h-310z" fill="#fff" stroke="#E8C79B" '
                    'stroke-width="2"/>'
                    + T(x + 30, y + 42, "box name", 18, 700, "#B5650D")
                    + T(x + 185, y + 104, nm, fs, 800, "#1B2530", "middle", mono=True)
                    + g("r7stamp " + ("r7ok" if ok else "r7no"),
                        f'<circle cx="{x + 336}" cy="{y + 34}" r="26" '
                        f'fill="{OK if ok else BAD}"/>'
                        + (f'<path d="M{x + 324} {y + 35}l9 9l16 -18" stroke="#fff" '
                           'stroke-width="5" fill="none" stroke-linecap="round" '
                           'stroke-linejoin="round"/>' if ok else
                           f'<path d="M{x + 325} {y + 23}l22 22M{x + 347} {y + 23}l-22 22" '
                           'stroke="#fff" stroke-width="5" stroke-linecap="round"/>'))
                    + '</g>')
        b += g(f"sx r7g{r}", grp)
        b += say_anu_low(f"r7b{r}", RULE_ASK[r - 1])
        b += say_pc_low(f"r7p{r}", RULE_SAYS[r - 1])
    for r in range(1, 5):
        k = 2 * r - 1
        sc.show(k, f".r7r{r}")
        sc.rule(k, f".r7r{r} .r7box", f"stroke:{BLUE};stroke-width:4", k + 1)
        sc.show(k, f".r7g{r}", k + 1)
        sc.rule(k + 1, f".r7g{r} .r7stamp", "opacity:1;transform:none", k + 1)
        sc.only(k, f".r7b{r}")
        sc.only(k + 1, f".r7p{r}")
        if r > 1:
            sc.mood(k + 1, "pc", "no")
    sc.css.append(".r7stamp{opacity:0;transform:scale(1.6);transform-origin:center;"
                  "transition:opacity 200ms var(--ease-out),transform 320ms var(--ease-out)}")
    sc.css.append(".r7box{transition:stroke 200ms var(--ease-out)}")
    return (figure(b, "Four rules for a variable name, each tried on Anu's box names: "
                   + "; ".join(", ".join(f"{n} {'yes' if _legal(n) else 'no'}" for n in ns)
                               for ns in RULE_NAMES) + "."),
            sc, "rule 1|rule 1 names|rule 2|rule 2 names|rule 3|rule 3 names|rule 4|rule 4 names")


def _legal(nm):
    """Python itself decides. A name with a space or a comma cannot even be
    tried as `name = 1`, so it is refused without running."""
    if not nm.isidentifier():
        return False
    return P.accepts(nm)


# ===================================================== 8. keywords (slide 35)
KNOWN = {"if", "elif", "else", "for", "while", "in", "break", "continue", "pass",
         "True", "False", "and", "or", "not"}


def keywords_scene():
    sc = Scene("su8", 3)
    kws = list(keyword.kwlist)
    assert len(kws) == 35
    b = cast_low()
    cols = 9
    for i, kw in enumerate(kws):
        c, r = i % cols, i // cols
        x, y = 44 + c * 169, 24 + r * 80
        known = " k8known" if kw in KNOWN else ""
        b += (f'<g class="sx k8t{known}" style="transition-delay:{i * 12}ms">'
              f'<rect class="k8box" x="{x}" y="{y}" width="156" height="66" rx="12" '
              'fill="#F4F7FA" stroke="#C9D6E0" stroke-width="2"/>'
              f'<path d="M{x + 16} {y + 30}h16v14h-16z" fill="#9AA7B1"/>'
              f'<path d="M{x + 19} {y + 30}v-5a5 5 0 0 1 10 0v5" stroke="#9AA7B1" '
              'stroke-width="2.5" fill="none"/>'
              + T(x + 92, y + 42, kw, 22, 700, "#1B2530", "middle", mono=True)
              + '</g>')
    c, _h = code("sx k8code", 520, 360, 460, 'help("keywords")', "playground", size=28)
    b += c
    b += say_pc_low("k8p1", [f"These **{len(kws)}** words are", "mine. Python keeps them."])
    b += say_anu_low("k8b2", ["I know some! **if**, **for**,", "**while**, **in**, **break**..."])
    b += say_pc_low("k8p2", ["So none of them can", "be a variable name."])
    b += say_pc_low("k8p3", ["Type this in the", "playground to see them."])
    sc.show(1, ".k8t"); sc.only(1, ".k8p1")
    sc.rule(2, ".k8known .k8box", f"fill:#EAF4FB;stroke:{BLUE};stroke-width:3")
    sc.only(2, ".k8b2"); sc.only(2, ".k8p2"); sc.mood(2, "anu", "o")
    sc.show(3, ".k8code"); sc.only(3, ".k8p3")
    sc.css.append(".k8box{transition:fill 220ms var(--ease-out),stroke 220ms var(--ease-out)}")
    return (figure(b, f"Python's {len(kws)} keywords, each locked. The ones the room already "
                   "knows light up. help(\"keywords\") lists them."),
            sc, "the locked words|ones you know|help")


# ================================================ 9. case styles (44 to 47)
CASES = [("Camel case", "totalBill", "a capital for each new word, like a hump"),
         ("Pascal case", "TotalBill", "every word begins with a capital"),
         ("Snake case", "total_bill", "small letters, joined by _")]


def _case_name(nm):
    out = ""
    for ch in nm:
        if ch.isupper():
            out += f'<tspan fill="{BLUE}">{esc(ch)}</tspan>'
        elif ch == "_":
            out += f'<tspan fill="{OK}">_</tspan>'
        else:
            out += esc(ch)
    return out


def cases_scene():
    sc = Scene("su9", 4)
    b = cast_low()
    # the name Anu wants, refused because of the space
    assert not "Total Bill".isidentifier()
    b += (f'<g class="c9ask"><rect x="440" y="18" width="720" height="84" rx="16" fill="#FFF8EF" '
          'stroke="#E8C79B" stroke-width="2.5"/>'
          + T(470, 72, "Variable:", 28, 600, "#6B7A86")
          + T(610, 74, "Total Bill", 38, 800, "#1B2530", mono=True)
          + f'<circle cx="1110" cy="60" r="26" fill="{BAD}"/>'
          f'<path d="M1099 49l22 22M1121 49l-22 22" stroke="#fff" stroke-width="5" '
          'stroke-linecap="round"/></g>')
    for i, (style, nm, how) in enumerate(CASES, 1):
        assert _legal(nm)
        y = 124 + (i - 1) * 110
        b += f'<rect class="syslot" x="40" y="{y}" width="1520" height="96" rx="16"/>'
        doodle = ""
        if i == 1:      # the camel's humps over the capital
            doodle = (f'<path d="M774 {y + 22}q18 -22 36 0" stroke="{AMBER}" '
                      'stroke-width="4" fill="none" stroke-linecap="round"/>')
        if i == 3:      # a snake lying under the name
            doodle = (f'<path d="M640 {y + 84}q25 -12 50 0t50 0t50 0t50 0t50 0" stroke="{OK}" '
                      'stroke-width="6" fill="none" stroke-linecap="round"/>'
                      f'<circle cx="896" cy="{y + 82}" r="9" fill="{OK}"/>'
                      f'<circle cx="899" cy="{y + 79}" r="2" fill="#fff"/>')
        b += g(f"sx c9r c9r{i}",
               f'<rect class="c9box" x="40" y="{y}" width="1520" height="96" rx="16" fill="#fff" '
               'stroke="#C9D6E0" stroke-width="2.5"/>'
               + T(70, y + 60, style, 30, 800, "#1B2530")
               + f'<text x="640" y="{y + 66}" font-size="50" font-weight="800" fill="#1B2530" '
                 f'class="sy-mono">{_case_name(nm)}</text>'
               + doodle
               + T(1530, y + 60, how, 23, 500, "#5A6A75", "end"))
    b += say_anu_low("c9b1", ["My box holds the total", "bill. How do I write it?"])
    b += say_pc_low("c9p1", ["Not with a space.", "I refuse **Total Bill**."])
    b += say_pc_low("c9p2", ["Camel case: small first,", "then a capital hump."])
    b += say_pc_low("c9p3", ["Pascal case: every", "word gets a capital."])
    b += say_pc_low("c9p4", ["In Python, we use", "**snake case**: total_bill"])
    sc.only(1, ".c9b1"); sc.only(1, ".c9p1"); sc.mood(1, "pc", "no")
    sc.show(2, ".c9r1"); sc.only(2, ".c9p2")
    sc.show(3, ".c9r2"); sc.only(3, ".c9p3")
    sc.show(4, ".c9r3"); sc.only(4, ".c9p4")
    sc.rule(4, ".c9r1,.su9.an-4 .c9r2", "opacity:.45")
    sc.rule(4, ".c9r3 .c9box", f"stroke:{OK};stroke-width:4;fill:#F2FAF5")
    sc.css.append(".c9box{transition:stroke 220ms var(--ease-out),fill 220ms var(--ease-out)}")
    return (figure(b, "Total Bill has a space, so the computer refuses it. Three ways to write "
                   "it as one word: totalBill, TotalBill, total_bill. Python uses snake case, "
                   "total_bill."),
            sc, "Total Bill|camel case|Pascal case|snake case")


# ================================================= 10. the best name (48, 49)
BEST_WHY = {
    "sum": "Sum of what? It does not say.",
    "sumofevenums": "Hard to read. What is evenums?",
    "sum_of_even_numbers": "Clear, and in snake case.",
    "sumofevennumbers": "The words run together.",
}


def best_scene():
    sc = Scene("su10", 3)
    b = cast_low()
    assert set(BEST_WHY) == set(P.BEST_OPTS)
    b += T(60, 58, "Anu wants to store the **sum of even numbers**. Which name is best?", 32, 600,
           "#1B2530")
    for i, nm in enumerate(P.BEST_OPTS):
        assert _legal(nm)
        y = 88 + i * 92
        best = nm == P.BEST
        b += (f'<g class="b10o{" b10best" if best else ""}">'
              f'<rect class="b10box" x="60" y="{y}" width="1480" height="78" rx="16" fill="#fff" '
              'stroke="#C9D6E0" stroke-width="2.5"/>'
              f'<circle cx="104" cy="{y + 39}" r="22" fill="#EAF4FB"/>'
              + T(104, y + 48, "ABCD"[i], 24, 800, BLUE, "middle")
              + T(146, y + 52, nm, 36, 800, "#1B2530", mono=True)
              + g("sx b10legal", T(900, y + 50, "allowed", 22, 700, OK))
              + g("sx b10why", T(1510, y + 50, BEST_WHY[nm], 24, 600,
                                 OK if best else "#6B7A86", "end"))
              + (g("sx b10star", f'<path d="M1010 {y + 16}l8 16l18 3l-13 12l3 18l-16 -9l-16 9'
                                  f'l3 -18l-13 -12l18 -3z" fill="{AMBER}"/>') if best else "")
              + '</g>')
    b += say_anu_low("b10b1", ["Which one should I", "use? Vote first."])
    b += say_pc_low("b10p2", ["All four follow my", "rules. I accept them all."])
    b += say_pc_low("b10p3", ["But only one tells you", "**what is inside**."])
    sc.only(1, ".b10b1")
    sc.show(2, ".b10legal"); sc.only(2, ".b10p2")
    sc.show(3, ".b10why"); sc.show(3, ".b10star"); sc.only(3, ".b10p3")
    sc.rule(3, ".b10o:not(.b10best)", "opacity:.5")
    sc.rule(3, ".b10best .b10box", f"stroke:{OK};stroke-width:4;fill:#F2FAF5")
    sc.css.append(".b10o{transition:opacity 240ms var(--ease-out)}"
                  ".b10box{transition:stroke 220ms var(--ease-out),fill 220ms var(--ease-out)}")
    return (figure(b, "Four names for the sum of even numbers. All four are allowed; "
                   f"{P.BEST} is the one that says what is inside."),
            sc, "vote|all allowed|the best name")


# ======================================================================= CSS
CSS = r"""
/* ---- the story: Anu and her computer ---- */
.sywrap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.syfig{width:100%;height:100%;display:block;font-family:var(--sans)}
.syfig *{transform-box:fill-box}
.syfig .sy-mono{font-family:var(--mono)}
.syfig .sy-ind{font-family:"Nirmala UI","Noto Sans Telugu","Noto Sans Tamil",var(--sans)}
.syslot{fill:#FBFCFD;stroke:#DCE4EA;stroke-width:2;stroke-dasharray:8 7}
.syfig .sx{opacity:0;transform:translateY(14px);transform-origin:center;
  transition:opacity 260ms var(--ease-out),transform 380ms var(--ease-out)}
.syfig .sb{opacity:0;transform:scale(.92);transform-origin:center bottom;
  transition:opacity 220ms var(--ease-out),transform 300ms var(--ease-out)}
.syfig .m-o,.syfig .m-no{opacity:0}
.syfig .m-smile,.syfig .m-o,.syfig .m-no{transition:opacity 160ms var(--ease-out)}
@media (prefers-reduced-motion:reduce){.syfig *{transition:none !important}}
@media print{.syfig .sx,.syfig .sb{opacity:1;transform:none}}
"""
