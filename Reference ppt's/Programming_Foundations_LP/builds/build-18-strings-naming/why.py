"""The second hook: the username Instagram refuses.

Everyone in the room has picked an Instagram username. Type a space in it and
Instagram says "Usernames can only use letters, numbers, underscores and
periods." They already know a name can have rules. Python has rules for the
names you give variables, and they are close to Instagram's, but not the same.

Facts this card leans on:
  * Instagram usernames allow letters, numbers, underscores and periods, and
    that sentence is the error Instagram shows for anything else;
  * Instagram accepts a username that begins with a digit; Python refuses a
    variable name that does;
  * every Python line on the card is run by panels.run(), so the error shown
    is the error Python gives.

The one motion: the phone's three screens sit on one strip and one transform
slides it a screen per press. The last two presses bring in the code.
Nothing on the card says "naming variables": the divider slide after it does.
"""
import html

import panels as P

STEPS = 5
LABELS = "ravi kumar|ravi@kumar|ravi_kumar|Python checks too|Python is stricter"

VB_W, VB_H = 1600, 740
IG = "#0095F6"            # Instagram's button blue
BAD = "#ED4956"           # Instagram's error red
OK = "#1F9D62"
INK = "#434343"

TRIES = ["ravi kumar", "ravi@kumar", "ravi_kumar"]
ERR = "Usernames can only use letters, numbers, underscores and periods."

PY_LINES = [("ravi kumar = 18", 4), ("ravi_kumar = 18", 4),
            ("1ravi = 18", 5)]


def esc(s):
    return html.escape(s, quote=True)


def fr(k, sel):
    return ",".join(f".wystage.an-{j} {sel}" for j in range(k, STEPS + 1))


def at(k, sel):
    return f".wystage.an-{k} {sel}"


def _t(x, y, s, size=14, weight=400, fill="#1B1F1D", anchor="start", cls="", fam=""):
    c = f' class="{cls}"' if cls else ""
    f = f' font-family="{fam}"' if fam else ""
    return (f'<text{c} x="{x}" y="{y}" font-size="{size}" font-weight="{weight}"'
            f' fill="{fill}" text-anchor="{anchor}"{f}>{esc(s)}</text>')


K = 1.25
PX, PY, PH = 48, 8, 724
SW, SH = 368, (PH - 24) / K
PW = SW * K + 24


def _status(x):
    return (_t(x + 26, 22, "9:41", 14, 600)
            + f'<g fill="#1B1F1D" transform="translate({x + SW - 92},11)">'
              '<rect x="0" y="8" width="3" height="4" rx="1"/>'
              '<rect x="5" y="5" width="3" height="7" rx="1"/>'
              '<rect x="10" y="2" width="3" height="10" rx="1"/>'
              '<rect x="15" y="0" width="3" height="12" rx="1"/>'
              '<rect x="52" y="1" width="22" height="11" rx="3" fill="none" '
              'stroke="#1B1F1D" stroke-width="1.4"/>'
              '<rect x="54" y="3" width="15" height="7" rx="1.5"/></g>')


def screen(x, typed, ok):
    out = (f'<rect x="{x}" y="0" width="{SW}" height="{SH}" fill="#fff"/>'
           + _status(x)
           + f'<path d="M{x + 22} 62h18M{x + 22} 62l8 -8M{x + 22} 62l8 8" '
             'stroke="#1B1F1D" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           + _t(x + 22, 124, "Create a username", 26, 800)
           + _t(x + 22, 156, "Add a username or use our suggestion.", 14, 400, "#5B6470")
           + _t(x + 22, 176, "You can change this at any time.", 14, 400, "#5B6470")
           + f'<rect x="{x + 18}" y="200" width="{SW - 36}" height="60" rx="12" fill="#fff" '
             f'stroke="{BAD if not ok else "#C9CFD6"}" stroke-width="1.6"/>'
           + _t(x + 34, 222, "Username", 12, 500, "#737B86")
           + _t(x + 34, 247, typed, 18, 500, "#1B1F1D"))
    if ok:
        out += (f'<circle cx="{x + SW - 44}" cy="230" r="12" fill="{OK}"/>'
                f'<path d="M{x + SW - 50} 230l4 4l8 -8" stroke="#fff" stroke-width="2.6" '
                'fill="none" stroke-linecap="round"/>')
    else:
        out += (f'<circle cx="{x + SW - 44}" cy="230" r="12" fill="none" stroke="{BAD}" '
                'stroke-width="2"/>'
                + _t(x + SW - 44, 236, "!", 16, 800, BAD, "middle")
                + _t(x + 22, 286, "Usernames can only use letters,", 13.5, 500, BAD)
                + _t(x + 22, 305, "numbers, underscores and periods.", 13.5, 500, BAD))
    out += (f'<rect x="{x + 18}" y="{330 if not ok else 290}" width="{SW - 36}" height="46" '
            f'rx="23" fill="{IG}" fill-opacity="{1 if ok else .4}"/>'
            + _t(x + SW / 2, (330 if not ok else 290) + 29, "Next", 16, 700, "#fff", "middle"))
    # keyboard hint along the bottom
    out += (f'<rect x="{x}" y="{SH - 230}" width="{SW}" height="230" fill="#D1D5DB"/>')
    for r, row in enumerate(["qwertyuiop", "asdfghjkl", "zxcvbnm"]):
        kw = (SW - 20) / 10
        off = x + 10 + (10 - len(row)) * kw / 2
        for i, ch in enumerate(row):
            out += (f'<rect x="{off + i * kw + 2}" y="{SH - 218 + r * 52}" width="{kw - 4}" '
                    'height="44" rx="6" fill="#fff"/>'
                    + _t(off + i * kw + kw / 2, SH - 188 + r * 52, ch, 18, 400, "#1B1F1D",
                         "middle"))
    out += (f'<rect x="{x + 70}" y="{SH - 62}" width="{SW - 140}" height="44" rx="6" fill="#fff"/>'
            + _t(x + SW / 2, SH - 34, "space", 15, 500, "#1B1F1D", "middle"))
    return out


def phone():
    strip = "".join(screen(i * SW, t, i == 2) for i, t in enumerate(TRIES))
    return (f'<g class="wyphone">'
            f'<rect x="{PX}" y="{PY}" width="{PW}" height="{PH}" rx="46" fill="#101412"/>'
            f'<g transform="translate({PX + 12},{PY + 12}) scale({K})">'
            f'<clipPath id="wyscreen"><rect x="0" y="0" width="{SW}" height="{SH}" rx="28"/>'
            '</clipPath><g clip-path="url(#wyscreen)">'
            f'<g class="wyslide">{strip}</g></g></g></g>')


RX, RY, RDY = 600, 56, 50
RAIL = [
    "You sign up for Instagram. You type ravi kumar.",
    "You try ravi@kumar. Still refused. What is allowed?",
    "ravi_kumar works. Instagram has rules for names.",
    "Python has rules for the names you give variables.",
    "Instagram takes 1ravi. Python does not. Python is stricter.",
]


def rail():
    out = ""
    for i, s in enumerate(RAIL, 1):
        y = RY + (i - 1) * RDY
        w = 40 + len(s) * 11.6
        out += (f'<g class="wyr wyr{i}">'
                f'<rect class="wyr-ghost" x="{RX + 44}" y="{y - 21}" width="{w:.0f}" '
                'height="30" rx="8"/>'
                f'<circle class="wyr-dot" cx="{RX + 14}" cy="{y - 7}" r="15"/>'
                + _t(RX + 14, y - 2, str(i), 14, 800, "#fff", "middle")
                + _t(RX + 44, y, s, 24, 500, INK, cls="wyr-t")
                + '</g>')
    return out


CX, CY, CW, CDY = 640, 360, 900, 108


def code():
    """A white editor card per line, each with what Python said, run for real."""
    out = '<g class="wycode">'
    out += (f'<rect class="wy-slot" x="{CX}" y="{CY - 20}" width="{CW}" '
            f'height="{CDY * 3 + 10}" rx="16"/>')
    for i, (src, press) in enumerate(PY_LINES):
        y = CY + i * CDY
        _, err = P.run(src)
        said = "Python accepts it" if err is None else err.split(": ", 1)[1]
        col = OK if err is None else "#B3261E"
        out += (f'<g class="wyl wyl{i} wyp{press}">'
                f'<rect x="{CX}" y="{y}" width="{CW}" height="{CDY - 18}" rx="14" fill="#fff" '
                f'stroke="{"#9FD8B8" if err is None else "#E8A9A5"}" stroke-width="2"/>'
                f'<rect x="{CX}" y="{y}" width="120" height="26" rx="10" fill="#EEF3F7"/>'
                + _t(CX + 14, y + 18, "names.py", 13, 700, "#5B6470")
                + _t(CX + 26, y + 64, src, 28, 700, "#1B2530", fam="var(--mono)")
                + _t(CX + CW - 24, y + 64, said, 22, 700, col, "end")
                + '</g>')
    return out + '</g>'


def body():
    svg = (f'<svg class="fig wyfig" viewBox="0 0 {VB_W} {VB_H}" '
           'xmlns="http://www.w3.org/2000/svg" role="img" '
           'aria-label="The Instagram create a username screen refuses ravi kumar and '
           'ravi@kumar and accepts ravi_kumar. Then three Python lines use the same '
           'names as variable names, and Python accepts only ravi_kumar.">'
           + phone() + rail() + code() + '</svg>')
    return f'<div class="hkwrap">{svg}</div>'


SCREEN_AT = {1: 0, 2: 1, 3: 2, 4: 2, 5: 2}


def css():
    r = [
        ".wyfig{width:100%;height:100%;display:block;font-family:var(--sans)}",
        ".wyslide{transition:transform 520ms var(--ease-in-out)}",
        ".wyphone{transition:opacity 320ms var(--ease-out)}",
        ".wyr-ghost{fill:none;stroke:#C5CFD7;stroke-width:1.6;stroke-dasharray:6 5;"
        "transition:opacity 200ms var(--ease-out)}",
        ".wyr-dot{fill:#C5CFD7;transition:fill 200ms var(--ease-out)}",
        ".wyr-t{opacity:0;transition:opacity 260ms var(--ease-out)}",
        ".wy-slot{fill:#FBFCFD;stroke:#DCE4EA;stroke-width:2;stroke-dasharray:8 7}",
        ".wyl{opacity:0;transform:translateY(8px);transform-box:fill-box;"
        "transition:opacity 260ms var(--ease-out),transform 260ms var(--ease-out)}",
    ]
    for k in range(1, STEPS + 1):
        r.append(at(k, ".wyslide") + f"{{transform:translateX({-SCREEN_AT[k] * SW}px)}}")
        r.append(fr(k, f".wyr{k} .wyr-t") + "{opacity:1}")
        r.append(fr(k, f".wyr{k} .wyr-ghost") + "{opacity:0}")
        r.append(fr(k, f".wyr{k} .wyr-dot") + "{fill:#9AA7B1}")
        r.append(at(k, f".wyr{k} .wyr-dot") + "{fill:#006DAF}")
        r.append(at(k, f".wyr{k} .wyr-t") + "{fill:#006DAF;font-weight:700}")
    r += [
        fr(4, ".wyp4") + "{opacity:1;transform:none}",
        fr(5, ".wyp5") + "{opacity:1;transform:none}",
        at(5, ".wyphone") + "{opacity:.35}",
        "@media (prefers-reduced-motion:reduce){.wyfig *{transition:none !important}}",
        "@media print{.wyr-t,.wyl{opacity:1;transform:none}}",
    ]
    return "\n".join(r)
