"""The hook: the laptop password that says wrong.

Everyone in the room has done this. You type your laptop password, the one
you know by heart, press Enter, and Windows says "The password is incorrect.
Try again." Caps Lock was on. Same keys, same order, and it is still wrong.

Facts this card leans on:
  * Windows 11 says exactly "The password is incorrect. Try again." with an
    OK button, and passwords are case sensitive;
  * Caps Lock turns letters into capitals and leaves digits and @ alone, so
    "sunny@123" comes out as "SUNNY@123";
  * a computer stores every character as a number, and a capital and a small
    letter are two different numbers (S is 83, s is 115). That is true of
    every computer. The card does not claim how Windows checks a password,
    only what the two strings are made of.

The one motion: the letters drop out of the password box into two rows of
tiles, and on the last press every tile turns over to show its number.
Nothing on this card says Unicode, ord or comparing strings.
"""
import html

import panels as P

STEPS = 5
LABELS = "your password|incorrect|show the password|side by side|the numbers"

VB_W, VB_H = 1600, 740
INK = "#434343"
OK = "#1F9D62"
BAD = "#D6453D"
AMBER = "#C77700"
WIN = "#0067C0"          # Windows 11 accent blue


def esc(s):
    return html.escape(s, quote=True)


def fr(k, sel):
    return ",".join(f".hkstage.an-{j} {sel}" for j in range(k, STEPS + 1))


def at(k, sel):
    return f".hkstage.an-{k} {sel}"


def _t(x, y, s, size=14, weight=400, fill="#1B1F1D", anchor="start", cls="", fam=""):
    c = f' class="{cls}"' if cls else ""
    f = f' font-family="{fam}"' if fam else ""
    return (f'<text{c} x="{x}" y="{y}" font-size="{size}" font-weight="{weight}"'
            f' fill="{fill}" text-anchor="{anchor}"{f}>{esc(s)}</text>')


# ------------------------------------------------------------------ the laptop
LX, LY, LW, LH = 40, 30, 560, 360        # the screen
BZ = 14                                   # bezel


def laptop():
    x, y = LX + BZ, LY + BZ
    w, h = LW - 2 * BZ, LH - 2 * BZ
    cx = x + w / 2
    saved_dots = len(P.HOOK_SAVED)
    out = (
        '<g class="hklap">'
        # lid and bezel
        f'<rect x="{LX}" y="{LY}" width="{LW}" height="{LH}" rx="16" fill="#1C1F24"/>'
        # the Windows 11 lock screen: a soft blue wallpaper
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="url(#hkwall)"/>'
        # avatar and name
        f'<circle cx="{cx}" cy="{y + 78}" r="40" fill="#E9EEF5"/>'
        f'<circle cx="{cx}" cy="{y + 68}" r="14" fill="#9AA9BC"/>'
        f'<path d="M{cx - 24} {y + 104}a24 20 0 0 1 48 0z" fill="#9AA9BC"/>'
        + _t(cx, y + 150, "Sunny", 22, 600, "#fff", "middle")
        # the password box
        + f'<rect x="{cx - 130}" y="{y + 168}" width="260" height="40" rx="5" '
          'fill="#fff" fill-opacity=".92" stroke="#fff"/>'
        + f'<g class="hkdots">'
        + "".join(f'<circle cx="{cx - 112 + i * 15}" cy="{y + 188}" r="4.2" fill="#1B1F1D"/>'
                  for i in range(saved_dots))
        + '</g>'
        + _t(cx - 118, y + 195, P.HOOK_TYPED, 18, 600, "#1B1F1D", cls="hkplain",
             fam="var(--mono)")
        # the eye, and the arrow button
        + f'<g class="hkeye" transform="translate({cx + 80},{y + 188})">'
          '<path d="M-10 0q10 -9 20 0q-10 9 -20 0z" fill="none" stroke="#434343" stroke-width="1.8"/>'
          '<circle r="3" fill="#434343"/></g>'
        + f'<rect x="{cx + 98}" y="{y + 172}" width="28" height="32" rx="4" fill="{WIN}"/>'
        + f'<path d="M{cx + 105} {y + 188}h13M{cx + 113} {y + 182}l6 6l-6 6" stroke="#fff" '
          'stroke-width="2" fill="none" stroke-linecap="round"/>'
        # Caps Lock is on (Windows says so under the box)
        + _t(cx, y + 232, "Caps Lock is on", 14, 600, "#fff", "middle", cls="hkcapsmsg")
        # the error card
        + f'<g class="hkerr"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" '
          'fill="#0B2A4A" fill-opacity=".55"/>'
        + _t(cx, y + 168, "The password is incorrect. Try again.", 19, 600, "#fff", "middle")
        + f'<rect x="{cx - 60}" y="{y + 196}" width="120" height="38" rx="5" '
          'fill="#fff" fill-opacity=".18" stroke="#fff" stroke-opacity=".6"/>'
        + _t(cx, y + 221, "OK", 16, 600, "#fff", "middle")
        + '</g>'
        # the clock, bottom right, as Windows puts it
        + _t(x + w - 14, y + h - 14, "8:52 AM", 13, 600, "#fff", "end")
        # the base and the keyboard strip
        + f'<path d="M{LX - 30} {LY + LH}h{LW + 60}l-24 30h{-(LW + 12)}z" fill="#C9CFD6"/>'
        + keyboard()
        + '</g>')
    return out


def keyboard():
    """Three rows of keys under the screen, with Caps Lock lit."""
    y0 = LY + LH + 52
    out = f'<rect x="{LX}" y="{y0 - 12}" width="{LW}" height="170" rx="14" fill="#E3E7EC"/>'
    rows = [("Tab", "QWERTYUIOP"), ("Caps", "ASDFGHJKL"), ("Shift", "ZXCVBNM")]
    kw, kh, g = 40, 38, 6
    for r, (lead, keys) in enumerate(rows):
        y = y0 + r * (kh + g)
        lw = 70 + r * 8
        cls = ' class="hkcaps"' if lead == "Caps" else ""
        out += (f'<g{cls}><rect x="{LX + 14}" y="{y}" width="{lw}" height="{kh}" rx="6" '
                'fill="#fff" stroke="#C5CCD4"/>'
                + _t(LX + 24, y + 25, lead, 14, 700, "#434343")
                + (f'<circle class="hkled" cx="{LX + lw}" cy="{y + 10}" r="4.5" fill="{OK}"/>'
                   if lead == "Caps" else "")
                + '</g>')
        for i, ch in enumerate(keys):
            kx = LX + 14 + lw + g + i * (kw + g)
            out += (f'<rect x="{kx}" y="{y}" width="{kw}" height="{kh}" rx="6" fill="#fff" '
                    'stroke="#C5CCD4"/>'
                    + _t(kx + kw / 2, y + 25, ch, 15, 600, "#434343", "middle"))
    return out


# ------------------------------------------------------------------ the rail
RX, RY, RDY = 680, 56, 50
RAIL = [
    "You type your laptop password. You know it by heart.",
    "Enter. “The password is incorrect.” Why?",
    "Tap the eye. Caps Lock was on.",
    "Put them side by side. Which letters are different?",
    "Every letter is stored as a number. S and s are different.",
]


def rail():
    out = ""
    for i, s in enumerate(RAIL, 1):
        y = RY + (i - 1) * RDY
        w = 40 + len(s) * 11.6
        hl = (f'<rect class="hkr-hl" x="{RX - 12}" y="{y - 32}" width="{w + 34:.0f}" '
              'height="48" rx="12"/>' if i == STEPS else "")
        out += (f'<g class="hkr hkr{i}">{hl}'
                f'<rect class="hkr-ghost" x="{RX + 44}" y="{y - 21}" '
                f'width="{w:.0f}" height="30" rx="8"/>'
                f'<circle class="hkr-dot" cx="{RX + 14}" cy="{y - 7}" r="15"/>'
                + _t(RX + 14, y - 2, str(i), 14, 800, "#fff", "middle", "hkr-n")
                + _t(RX + 44, y, s, 24, 500, INK, cls="hkr-t")
                + '</g>')
    return out


# ------------------------------------------------------------------ the tiles
TX0, TY_S, TY_T, TW, TH, TG = 790, 356, 530, 76, 110, 12


def tiles():
    out = ('<g class="hktiles">'
           + _t(TX0 - 20, TY_S + 64, "saved", 20, 700, "#6B7A86", "end")
           + _t(TX0 - 20, TY_T + 64, "typed", 20, 700, "#6B7A86", "end"))
    # dashed slots from press 1, so the space never looks empty
    for k, (a, b, na, nb, same) in enumerate(P.hook_pairs()):
        x = TX0 + k * (TW + TG)
        for row, ch, num, y in (("s", a, na, TY_S), ("t", b, nb, TY_T)):
            out += (f'<rect class="hkslot" x="{x}" y="{y}" width="{TW}" height="{TH}" rx="12"/>'
                    f'<g class="hkt hkt-{row} hkt{k} {"hksame" if same else "hkdiff"}">'
                    f'<rect class="hkt-box" x="{x}" y="{y}" width="{TW}" height="{TH}" rx="12"/>'
                    + _t(x + TW / 2, y + 52, ch, 40, 800, "#1B2530", "middle",
                         fam="var(--mono)")
                    + _t(x + TW / 2, y + 90, str(num), 22, 700, "#006DAF", "middle",
                         cls="hkt-n", fam="var(--mono)")
                    + '</g>')
        # the verdict between the rows
        mark = "=" if same else "≠"
        out += _t(x + TW / 2, (TY_S + TH + TY_T) / 2 + 12, mark, 34, 800,
                  OK if same else BAD, "middle", cls=f"hkm hkm{k}")
    return out + '</g>'


def defs():
    return (
        '<defs>'
        '<linearGradient id="hkwall" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0" stop-color="#2F6FB5"/><stop offset=".55" stop-color="#4E9BD6"/>'
        '<stop offset="1" stop-color="#A9D4F0"/></linearGradient>'
        '</defs>')


def body():
    svg = (f'<svg class="fig hkfig" viewBox="0 0 {VB_W} {VB_H}" '
           'xmlns="http://www.w3.org/2000/svg" role="img" '
           'aria-label="A laptop sign-in screen. The password is typed with Caps '
           'Lock on and Windows says it is incorrect. The saved and the typed '
           'password are laid out letter by letter, and each letter shows the '
           'number the computer stores for it.">'
           + defs() + laptop() + rail() + tiles() + '</svg>')
    return f'<div class="hkwrap">{svg}</div>'


def css():
    n = len(P.HOOK_SAVED)
    r = [
        ".hkwrap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}",
        ".hkfig{width:100%;height:100%;display:block;font-family:var(--sans)}",
        ".hkfig *{transform-box:fill-box}",
        ".hkr-ghost{fill:none;stroke:#C5CFD7;stroke-width:1.6;stroke-dasharray:6 5;"
        "transition:opacity 200ms var(--ease-out)}",
        ".hkr-dot{fill:#C5CFD7;transition:fill 200ms var(--ease-out)}",
        ".hkr-t{opacity:0;transition:opacity 260ms var(--ease-out)}",
        ".hkerr,.hkplain,.hkcapsmsg{opacity:0;transition:opacity 240ms var(--ease-out)}",
        ".hkdots{transition:opacity 200ms var(--ease-out)}",
        ".hkled{opacity:1}",
        ".hkslot{fill:#FBFCFD;stroke:#DCE4EA;stroke-width:2;stroke-dasharray:7 6}",
        ".hkt{opacity:0;transform:translateY(-14px);"
        "transition:opacity 260ms var(--ease-out),transform 360ms var(--ease-out)}",
        ".hkt-box{fill:#fff;stroke:#D5DEE5;stroke-width:2;"
        "transition:fill 220ms var(--ease-out),stroke 220ms var(--ease-out)}",
        ".hkt-n{opacity:0;transition:opacity 260ms var(--ease-out)}",
        ".hkm{opacity:0;transition:opacity 220ms var(--ease-out)}",
    ]
    for k in range(1, STEPS + 1):
        r.append(fr(k, f".hkr{k} .hkr-t") + "{opacity:1}")
        r.append(fr(k, f".hkr{k} .hkr-ghost") + "{opacity:0}")
        r.append(fr(k, f".hkr{k} .hkr-dot") + "{fill:#9AA7B1}")
        r.append(at(k, f".hkr{k} .hkr-dot") + "{fill:#006DAF}")
        r.append(at(k, f".hkr{k} .hkr-t") + "{fill:#006DAF;font-weight:700}")
    r += [
        at(2, ".hkerr") + "{opacity:1}",
        fr(3, ".hkdots") + "{opacity:0}",
        fr(3, ".hkplain") + "{opacity:1}",
        fr(3, ".hkcapsmsg") + "{opacity:1}",
        fr(3, ".hkcaps rect") + "{stroke:#1F9D62;stroke-width:3}",
    ]
    # press 3: the letters drop in, one after another (a stagger, not a timer)
    for i in range(n):
        d = f"{i * 45}ms"
        r.append(fr(3, f".hkt{i}") + f"{{opacity:1;transform:none;transition-delay:{d},{d}}}")
    r += [
        fr(4, ".hkm") + "{opacity:1}",
        fr(4, ".hkdiff .hkt-box") + "{fill:#FDF1F1;stroke:#E8A9A5}",
        fr(4, ".hksame .hkt-box") + "{fill:#EFFAF3;stroke:#9FD8B8}",
        at(5, ".hkt-n") + "{opacity:1}",
        # press 5: the point to remember comes forward, the other four step back
        ".hkr5{transform-origin:left center;transition:transform 420ms var(--ease-out)}",
        ".hkr-hl{fill:#EAF4FB;stroke:#9CCBEA;stroke-width:2;opacity:0;"
        "transition:opacity 260ms var(--ease-out)}",
        ".hkr1,.hkr2,.hkr3,.hkr4{transition:opacity 260ms var(--ease-out)}",
        at(5, ".hkr5") + "{transform:translate(-14px,8px) scale(1.25)}",
        at(5, ".hkr-hl") + "{opacity:1}",
        ",".join(at(5, f".hkr{j}") for j in range(1, 5)) + "{opacity:.4}",
        "@media (prefers-reduced-motion:reduce){.hkfig *{transition:none !important}}",
        "@media print{.hkr-t,.hkt,.hkt-n,.hkm{opacity:1;transform:none}}",
    ]
    return "\n".join(r)
