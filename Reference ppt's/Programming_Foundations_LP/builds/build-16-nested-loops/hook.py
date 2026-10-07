"""The hook: the Cricbuzz ball counter.

India are batting in a T20. Cricbuzz numbers every ball: 4.1, 4.2 ... 4.6.
The room knows what comes after 4.6, and that is the point. The ball part goes
back to 1 and the over part goes up by one: 5.1. Then, how many balls in a
full innings? Twenty overs, six in each, 120.

The last press draws the shape behind it in the deck's own style (orange outer
return arrow, blue inner return arrow, Block 1 to 4), in words, so the next
card (deck slide 7) lands on something the room has already seen. Nothing on
this card says loop, nested, inner or outer.

Cricket facts this card leans on, checked against how a scorer counts:
  * 4.6 means 4 overs done and the 6th ball of the next one. The next fair
    ball is 5.1, and it is bowled by a new bowler from the other end.
  * A single off the last ball puts that batter at the far end, and the ends
    change at the over, so he faces 5.1 again (Rohit, below).
  * Wides and no balls do not get a new number. Every ball here is a fair one,
    and the guide says so if a student raises it.

The one motion that is the argument: the ball wheel of the counter rolls
4 -> 5 -> 6 on press 2. On press 3 the over wheel ticks 4 -> 5 first, and
only then does the ball wheel roll round to 1, 900ms. That is the order a
nested loop runs in: the outer value moves on, then the inner loop starts
again from its first value. Everything else fades.
"""
import html

STEPS = 6
LABELS = ("every ball has a number|4.5, 4.6, then what?|5.1|"
          "how many balls?|120|the shape behind it")

VB_W, VB_H = 1600, 740

# Cricbuzz's own colours. A near miss reads as a fake.
CB_GREEN = "#009270"
CB_DARK = "#00664E"
CB_BG = "#EEF1F0"
FOUR = "#1E7FD8"
ORANGE = "#F29A1F"
BLUE = "#2F7FE0"
INK = "#434343"

# ------------------------------------------------------------------ the story
# (ball, runs, commentary). Runs are what the bubble shows.
BALLS = [
    ("5.1", "0", "Zampa to Rohit, no run.", "Pushed back to the bowler."),
    None,  # the end-of-over band sits here
    ("4.6", "1", "Starc to Rohit, 1 run.", "Tapped to cover, they run."),
    ("4.5", "4", "Starc to Rohit, FOUR!", "Driven through the covers."),
    ("4.4", "1", "Starc to Gill, 1 run.", "Nudged to square leg."),
    ("4.3", "4", "Starc to Gill, FOUR!", "Pulled to the fence."),
    ("4.2", "0", "Starc to Gill, no run.", "Beaten outside off."),
    ("4.1", "1", "Starc to Rohit, 1 run.", "Worked to mid-wicket."),
]
OVER_RUNS = sum(int(b[1]) for b in BALLS[2:])          # 11
SCORE_BEFORE = 35
SCORE_44 = SCORE_BEFORE + sum(int(b[1]) for b in BALLS[4:])   # 41
SCORE_46 = SCORE_BEFORE + OVER_RUNS                          # 46

ROW = 64
BAND = 40
OVERS, PER_OVER = 20, 6
TOTAL = OVERS * PER_OVER


def esc(s):
    return html.escape(s, quote=True)


def fr(k, sel):
    """`sel` from step k to the end. The stepper sets exactly one an-N."""
    return ",".join(f".hkstage.an-{j} {sel}" for j in range(k, STEPS + 1))


def at(k, sel):
    return f".hkstage.an-{k} {sel}"


# ------------------------------------------------------------------ the phone
K = 1.25                       # the screen is drawn at 1.25x so the back row can read it
PX, PY, PH = 48, 8, 724
SW, SH = 368, (PH - 24) / K     # screen size in its own units
PW = SW * K + 24
SX, SY = 0, 0                  # screen content is drawn from its own origin


def _t(x, y, s, size=14, weight=400, fill="#1B1F1D", anchor="start", cls=""):
    c = f' class="{cls}"' if cls else ""
    return (f'<text{c} x="{x}" y="{y}" font-size="{size}" font-weight="{weight}"'
            f' fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>')


def _status():
    y = SY + 22
    return (_t(SX + 26, y, "7:42", 14, 600, "#fff")
            + f'<g fill="#fff" transform="translate({SX + SW - 92},{y - 11})">'
              '<rect x="0" y="8" width="3" height="4" rx="1"/>'
              '<rect x="5" y="5" width="3" height="7" rx="1"/>'
              '<rect x="10" y="2" width="3" height="10" rx="1"/>'
              '<rect x="15" y="0" width="3" height="12" rx="1"/>'
              '<path d="M30 11a9 9 0 0 1 14 0l-7 1.2z" opacity=".95"/>'
              '<rect x="52" y="1" width="22" height="11" rx="3" fill="none" '
              'stroke="#fff" stroke-width="1.4"/>'
              '<rect x="54" y="3" width="15" height="7" rx="1.5"/>'
              '<rect x="75" y="4" width="2" height="5" rx="1"/></g>')


def _header():
    y0 = SY + 34
    tabs = [("Info", 40), ("Live", 118), ("Scorecard", 206), ("Squads", 306)]
    t = "".join(_t(SX + x, y0 + 72, s, 14, 700 if s == "Live" else 500,
                   "#fff" if s == "Live" else "#CFEDE4", "middle")
                for s, x in tabs)
    return (f'<rect x="{SX}" y="{SY}" width="{SW}" height="{y0 - SY + 86}" '
            f'fill="{CB_GREEN}"/>'
            + _status()
            # back arrow
            + f'<path d="M{SX + 24} {y0 + 22}h18M{SX + 24} {y0 + 22}l8 -8'
              f'M{SX + 24} {y0 + 22}l8 8" stroke="#fff" stroke-width="2.4" '
              'fill="none" stroke-linecap="round"/>'
            + _t(SX + 58, y0 + 22, "IND vs AUS", 18, 700, "#fff")
            + _t(SX + 58, y0 + 40, "3rd T20I · Chennai", 12.5, 500, "#CFEDE4")
            # bell
            + f'<path d="M{SX + SW - 36} {y0 + 28}h16l-2.5 -3v-7a5.5 5.5 0 0 0 '
              f'-11 0v7z M{SX + SW - 30.5} {y0 + 31}a2.5 2.5 0 0 0 5 0" '
              'fill="none" stroke="#fff" stroke-width="2"/>'
            + t
            + f'<rect x="{SX + 98}" y="{y0 + 80}" width="40" height="4" rx="2" '
              'fill="#fff"/>')


def _flag(cx, cy):
    return (f'<clipPath id="hkflag"><circle cx="{cx}" cy="{cy}" r="15"/>'
            '</clipPath>'
            f'<g clip-path="url(#hkflag)">'
            f'<rect x="{cx - 15}" y="{cy - 15}" width="30" height="10" fill="#FF9933"/>'
            f'<rect x="{cx - 15}" y="{cy - 5}" width="30" height="10" fill="#fff"/>'
            f'<rect x="{cx - 15}" y="{cy + 5}" width="30" height="10" fill="#138808"/>'
            f'<circle cx="{cx}" cy="{cy}" r="3.2" fill="none" stroke="#000080" '
            'stroke-width="1"/></g>'
            f'<circle cx="{cx}" cy="{cy}" r="15" fill="none" stroke="#D9DEDC"/>')


def _bubble(cx, cy, runs, r=15, cls=""):
    c = f' class="{cls}"' if cls else ""
    if runs == "4":
        fill, ink, lab = FOUR, "#fff", "4"
    elif runs == "0":
        fill, ink, lab = "#E3E7E5", "#6B7470", "0"
    else:
        fill, ink, lab = "#fff", "#1B1F1D", runs
    return (f'<g{c}><circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" '
            f'stroke="{"#C9D0CD" if fill == "#fff" else fill}" stroke-width="1.4"/>'
            + _t(cx, cy + 5, lab, 14, 700, ink, "middle") + '</g>')


def _score():
    x0, y0, w, h = SX + 12, SY + 130, SW - 24, 116
    over = [b[1] for b in BALLS[2:]][::-1]   # 4.1 .. 4.6
    dots = ""
    for i in range(6):
        cx = x0 + 104 + i * 38
        cy = y0 + 92
        dots += (f'<circle cx="{cx}" cy="{cy}" r="14" fill="none" '
                 'stroke="#C9D0CD" stroke-dasharray="3 3"/>')
        step = 1 if i < 4 else 2
        dots += _bubble(cx, cy, over[i], 14, f"hkod hkod-o{step}")
    dots += _bubble(x0 + 104, y0 + 92, "0", 14, "hkod hkod-n")
    return (f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="14" '
            'fill="#fff" filter="url(#hkshadow)"/>'
            + _flag(x0 + 28, y0 + 34)
            + _t(x0 + 52, y0 + 40, "IND", 17, 700)
            + _t(x0 + 100, y0 + 41, f"{SCORE_44}-1", 26, 800, cls="hksc hksc1")
            + _t(x0 + 100, y0 + 41, f"{SCORE_46}-1", 26, 800, cls="hksc hksc2")
            # live pill
            + f'<rect x="{x0 + w - 78}" y="{y0 + 18}" width="64" height="24" '
              'rx="12" fill="#FDECEC"/>'
            + f'<circle class="hklive" cx="{x0 + w - 62}" cy="{y0 + 30}" r="4.5" '
              'fill="#E53935"/>'
            + _t(x0 + w - 36, y0 + 35, "LIVE", 12, 800, "#E53935", "middle")
            + _t(x0 + 16, y0 + 62, "AUS chose to bowl · first innings", 12.5,
                 500, "#6B7470")
            + _t(x0 + 16, y0 + 97, "This over", 12, 600, "#6B7470", cls="hkthis1")
            + dots)


def _row(y, ball, runs, l1, l2, cls):
    x0 = SX + 12
    return (f'<g class="{cls}" transform="translate(0,{y})">'
            + _t(x0 + 14, 30, ball, 15, 800, "#1B1F1D")
            + _bubble(x0 + 74, 26, runs)
            + _t(x0 + 100, 24, l1, 15, 700 if runs == "4" else 600, "#1B1F1D")
            + _t(x0 + 100, 44, l2, 13.5, 400, "#5E6763")
            + '</g>')


def _feed():
    x0, y0, w, h = SX + 12, SY + 256, SW - 24, SH - 58 - 10 - 256
    parts, y = [], 0
    for i, b in enumerate(BALLS):
        if b is None:
            parts.append(
                f'<g class="hkband" transform="translate(0,{y})">'
                f'<rect x="{x0 + 8}" y="6" width="{w - 16}" height="28" rx="8" '
                f'fill="#E3F3EE"/>'
                + _t(x0 + w / 2, 25, f"End of over 5 · {OVER_RUNS} runs · "
                     f"IND {SCORE_46}-1", 12.5, 700, CB_DARK, "middle")
                + '</g>')
            y += BAND
            continue
        cls = "hkrow" + (" hkrow-new" if i == 0 else "")
        parts.append(_row(y, *b, cls))
        y += ROW
    ghost = (f'<g class="hkghost">'
             f'<rect x="{x0 + 8}" y="6" width="{w - 16}" height="{ROW - 12}" rx="10" '
             'fill="#fff" stroke="#9AA7A2" stroke-width="1.6" stroke-dasharray="6 5"/>'
             + _t(x0 + 36, 38, "?.?", 18, 800, "#7A8580")
             + _t(x0 + 100, 38, "next ball", 13.5, 600, "#7A8580")
             + '</g>')
    return (f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="14" '
            'fill="#fff" filter="url(#hkshadow)"/>'
            + _t(x0 + 16, y0 + 26, "Commentary", 14, 700)
            + f'<line x1="{x0 + 74}" x2="{x0 + 74}" y1="{y0 + 44}" y2="{y0 + h - 8}" '
              'stroke="#E1E6E4" stroke-width="2"/>'
            + f'<clipPath id="hkfeedclip"><rect x="{x0}" y="{y0 + 38}" '
              f'width="{w}" height="{h - 42}"/></clipPath>'
            + f'<g clip-path="url(#hkfeedclip)"><g transform="translate(0,{y0 + 40})">'
            + '<g class="hkfeed">' + "".join(parts) + '</g>'
            + ghost + '</g></g>'
            + f'<rect x="{x0 + 4}" y="{y0 + h - 46}" width="{w - 8}" height="44" '
              'fill="url(#hkfade)"/>')


def _bottom():
    y0 = SY + SH - 58
    items = ["Home", "Matches", "Videos", "News", "More"]
    out = (f'<rect x="{SX}" y="{y0}" width="{SW}" height="58" fill="#fff"/>'
           f'<line x1="{SX}" x2="{SX + SW}" y1="{y0}" y2="{y0}" stroke="#E1E6E4"/>')
    for i, s in enumerate(items):
        cx = SX + 38 + i * ((SW - 76) / 4)
        col = CB_GREEN if s == "Matches" else "#8A9490"
        out += (f'<rect x="{cx - 10}" y="{y0 + 10}" width="20" height="16" rx="4" '
                f'fill="none" stroke="{col}" stroke-width="2"/>'
                + _t(cx, y0 + 44, s, 11, 700 if s == "Matches" else 500, col,
                     "middle"))
    return out


def phone():
    return (f'<g class="hkphone">'
            f'<rect x="{PX}" y="{PY}" width="{PW}" height="{PH}" rx="46" '
            'fill="#101412"/>'
            f'<g transform="translate({PX + 12},{PY + 12}) scale({K})">'
            f'<clipPath id="hkscreen"><rect x="{SX}" y="{SY}" width="{SW}" '
            f'height="{SH}" rx="28"/></clipPath>'
            f'<g clip-path="url(#hkscreen)">'
            f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" fill="{CB_BG}"/>'
            + _header() + _score() + _feed() + _bottom()
            + '</g></g></g>')


# ------------------------------------------------------------------ the rail
RX, RY, RDY = 590, 42, 50
RAIL = [
    "India are batting. Every ball gets a number.",
    "4.5, then 4.6. What comes next?",
    "5.1. The ball number starts again at 1.",
    "So how many balls in a full T20 innings?",
    "120. Six balls in each of the 20 overs.",
    "The ball count runs 1 to 6, once for every over.",
]


def rail():
    out = ""
    for i, s in enumerate(RAIL, 1):
        y = RY + (i - 1) * RDY
        w = 40 + len(s) * 11.5
        out += (f'<g class="hkr hkr{i}">'
                f'<rect class="hkr-ghost" x="{RX + 44}" y="{y - 20}" '
                f'width="{w:.0f}" height="28" rx="8"/>'
                f'<circle class="hkr-dot" cx="{RX + 14}" cy="{y - 6}" r="15"/>'
                + _t(RX + 14, y - 1, str(i), 14, 800, "#fff", "middle", "hkr-n")
                + _t(RX + 44, y, s, 25, 500, INK, cls="hkr-t")
                + '</g>')
    return out


# ------------------------------------------------------------------ the counter
OX, OY, OW, OH = 770, 330, 560, 162
DIG = 110                # one digit's height on the wheels
WIN_Y = OY + 26          # wheel window top
LW_X, RW_X = OX + 150, OX + 410     # wheel centres


def _wheel(cx, digits, cls):
    s = "".join(
        f'<text x="{cx}" y="{WIN_Y + 90 + i * DIG}" font-size="98" '
        f'font-weight="700" fill="#fff" text-anchor="middle" '
        f'class="hkdig">{d}</text>' for i, d in enumerate(digits))
    return f'<g class="{cls}">{s}</g>'


def counter():
    return (f'<g class="hkctr">'
            f'<rect x="{OX}" y="{OY}" width="{OW}" height="{OH}" rx="26" '
            f'fill="{CB_DARK}"/>'
            f'<rect x="{OX + 6}" y="{OY + 6}" width="{OW - 12}" height="{OH - 12}" '
            f'rx="21" fill="{CB_GREEN}"/>'
            f'<clipPath id="hkwin"><rect x="{OX + 40}" y="{WIN_Y}" '
            f'width="{OW - 80}" height="{DIG}" rx="14"/></clipPath>'
            f'<rect x="{OX + 40}" y="{WIN_Y}" width="{OW - 80}" height="{DIG}" '
            'rx="14" fill="#00543F"/>'
            f'<g clip-path="url(#hkwin)">'
            + _wheel(LW_X, "45", "hkw hkw-over")
            + _wheel(RW_X, "4561", "hkw hkw-ball")
            + '</g>'
            f'<circle cx="{OX + OW / 2}" cy="{WIN_Y + 84}" r="10" fill="#fff"/>'
            + _t(LW_X, OY + OH + 30, "over", 22, 700, CB_DARK, "middle")
            + _t(RW_X, OY + OH + 30, "ball", 22, 700, CB_DARK, "middle")
            + _t(OX + OW / 2, OY - 14, "the ball number", 16, 600, "#7A8794",
                 "middle")
            + '</g>')


# ------------------------------------------------------------------ the tally
TY = 642


def tally():
    tiles = [(830, "20", "overs"), (1030, "6", "balls in each"),
             (1250, str(TOTAL), "balls")]
    out = '<g class="hktally">'
    for i, (cx, big, small) in enumerate(tiles):
        cls = "hkt hkt-ans" if i == 2 else "hkt"
        out += (f'<g class="{cls}">'
                f'<rect x="{cx - 80}" y="{TY - 50}" width="160" height="104" rx="16" '
                'fill="#fff" stroke="#D5DEE5" stroke-width="2"/>'
                + _t(cx, TY + 10, big, 46, 800, "#006DAF", "middle", "hkt-big")
                + _t(cx, TY + 40, small, 16, 600, "#6B7A86", "middle")
                + '</g>')
    out += (_t(930, TY + 14, "×", 40, 700, "#7A8794", "middle", "hkt-op")
            + _t(1140, TY + 14, "=", 40, 700, "#7A8794", "middle", "hkt-op")
            + f'<g class="hkt-q"><rect x="1170" y="{TY - 50}" width="160" '
              'height="104" rx="16" fill="none" stroke="#9AA7B1" stroke-width="2" '
              'stroke-dasharray="7 6"/>'
            + _t(1250, TY + 16, "?", 50, 800, "#9AA7B1", "middle") + '</g>'
            + '</g>')
    return out


# ------------------------------------------------------------------ the shape
def shape():
    x0, y0 = 730, 372
    code = 'font-family="var(--mono)"'
    H = 46

    def hdr(x, y, kw, rest, col):
        return (f'<text x="{x}" y="{y}" font-size="28" {code}>'
                f'<tspan fill="{col}" font-weight="700">{esc(kw)}</tspan>'
                f'<tspan fill="#1F4E79" font-weight="600">{esc(rest)}</tspan></text>')

    def blk(x, y, w, s):
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{H}" rx="4" '
                'fill="#CDE7FA" stroke="#A9D3F2"/>'
                f'<text x="{x + w / 2}" y="{y + 30}" font-size="20" {code} '
                f'fill="#4A5A66" text-anchor="middle">{esc(s)}</text>')

    ib = y0 + 104          # inner header baseline
    b1, b2, b3, b4 = y0 + 18, ib + 18, ib + 18 + H + 12, ib + 18 + 2 * (H + 12) + 12
    return (f'<g class="hkshape">'
            f'<rect x="{x0 + 34}" y="{y0 + 14}" width="36" height="{b4 - y0 - 18}" '
            'fill="#EEF1F3"/>'
            + hdr(x0 + 40, y0, "every over", ", 20 of them:", "#D6453D")
            + blk(x0 + 76, b1, 500, "a new bowler comes on")
            + hdr(x0 + 80, ib, "every ball", ", 1 to 6:", "#D6453D")
            + blk(x0 + 116, b2, 460, "bowl one ball, show its number")
            + blk(x0 + 76, b3, 500, "end of over, show the runs")
            + blk(x0 + 34, b4, 542, "innings over")
            # inner return arrow (blue): from the ball block back to its line
            + f'<path class="hkarr hkarr-in" d="M{x0 + 104} {b2 + H / 2}H{x0 + 56}'
              f'V{ib - 9}H{x0 + 68}" fill="none" stroke="{BLUE}" stroke-width="3" '
              'stroke-dasharray="8 6" marker-end="url(#hkarrB)"/>'
            + f'<circle cx="{x0 + 106}" cy="{b2 + H / 2}" r="5" fill="{BLUE}"/>'
            # outer return arrow (orange): from the end of the over back to the top
            + f'<path class="hkarr hkarr-out" d="M{x0 + 64} {b3 + H / 2}H{x0 + 14}'
              f'V{y0 - 9}H{x0 + 26}" fill="none" stroke="{ORANGE}" stroke-width="3" '
              'stroke-dasharray="8 6" marker-end="url(#hkarrO)"/>'
            + f'<circle cx="{x0 + 66}" cy="{b3 + H / 2}" r="5" fill="{ORANGE}"/>'
            + _t(x0 + 590, y0 - 4, "20 times", 22, 700, "#C77A10", cls="hkcnt")
            + _t(x0 + 590, ib - 4, "6 times, every over", 22, 700, BLUE, cls="hkcnt")
            + '</g>')


def defs():
    return (
        '<defs>'
        '<filter id="hkshadow" x="-10%" y="-10%" width="120%" height="130%">'
        '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0B2A20" '
        'flood-opacity=".10"/></filter>'
        f'<marker id="hkarrB" viewBox="0 0 10 10" refX="7" refY="5" '
        'markerWidth="7" markerHeight="7" orient="auto">'
        f'<path d="M0 0L10 5L0 10z" fill="{BLUE}"/></marker>'
        f'<marker id="hkarrO" viewBox="0 0 10 10" refX="7" refY="5" '
        'markerWidth="7" markerHeight="7" orient="auto">'
        f'<path d="M0 0L10 5L0 10z" fill="{ORANGE}"/></marker>'
        '<linearGradient id="hkfade" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="#fff" stop-opacity="0"/>'
        '<stop offset=".55" stop-color="#fff" stop-opacity="1"/></linearGradient>'
        '</defs>')


def body():
    svg = (f'<svg class="fig hkfig" viewBox="0 0 {VB_W} {VB_H}" '
           'xmlns="http://www.w3.org/2000/svg" role="img" '
           'aria-label="A Cricbuzz live commentary screen. The ball numbers go '
           '4.4, 4.5, 4.6 and then 5.1, and a counter beside it rolls the same '
           'way.">'
           + defs() + phone() + rail() + counter() + tally() + shape()
           + '</svg>')
    return f'<div class="hkwrap">{svg}</div>'


# ------------------------------------------------------------------ the CSS
def css():
    feed_y = {1: -(ROW * 3 + BAND), 2: ROW - (ROW + BAND), 3: 0}
    for k in range(4, STEPS + 1):
        feed_y[k] = 0
    ball_i = {1: 0, 2: 2}
    for k in range(3, STEPS + 1):
        ball_i[k] = 3
    rules = [
        ".hkwrap{flex:1;min-height:0;display:flex;align-items:center;"
        "justify-content:center}",
        ".hkfig{width:100%;height:100%;display:block;font-family:var(--sans)}",
        ".hkfig *{transform-box:view-box}",
        # fades
        ".hksc,.hkod,.hkrow-new,.hkband,.hkghost,.hkr-t,.hktally,.hkt-ans,"
        ".hkshape,.hkcnt,.hkthis1{transition:opacity 260ms var(--ease-out)}",
        ".hksc2,.hkod-o2,.hkod-n,.hkrow-new,.hkband,.hkghost,.hktally,.hkt-ans,"
        ".hkshape,.hkcnt{opacity:0}",
        # the feed and the wheels
        ".hkfeed{transition:transform 420ms var(--ease-out)}",
        # Press 2 rolls the ball on its own. On press 3 the order is the
        # loop's order: the over moves first, then the ball starts again at 1.
        ".hkw-ball{transition:transform 900ms var(--ease-in-out) 150ms}",
        ".hkw-over{transition:transform 520ms var(--ease-in-out) 150ms}",
        at(3, ".hkw-ball") + "{transition-delay:800ms}",
        # the phone and counter step aside on the last press
        ".hkphone,.hkctr{transition:opacity 320ms var(--ease-out)}",
        # rail
        ".hkr-ghost{fill:none;stroke:#C5CFD7;stroke-width:1.6;"
        "stroke-dasharray:6 5;transition:opacity 200ms var(--ease-out)}",
        ".hkr-dot{fill:#C5CFD7;transition:fill 200ms var(--ease-out)}",
        ".hkr-t{opacity:0}",
        ".hklive{animation:hkpulse 1.6s ease-in-out infinite}",
        "@keyframes hkpulse{50%{opacity:.25}}",
        ".hkarr{stroke-dashoffset:0}",
    ]
    for k in range(1, STEPS + 1):
        rules.append(f"{at(k, '.hkfeed')}{{transform:translateY({feed_y[k]}px)}}")
        rules.append(f"{at(k, '.hkw-ball')}{{transform:translateY({-ball_i[k] * DIG}px)}}")
    rules += [
        fr(3, ".hkw-over") + f"{{transform:translateY({-DIG}px)}}",
        # score and this-over strip
        fr(2, ".hksc1") + "{opacity:0}",
        fr(2, ".hksc2") + "{opacity:1}",
        fr(2, ".hkod-o2") + "{opacity:1}",
        fr(3, ".hkod-o1") + "," + fr(3, ".hkod-o2") + "{opacity:0}",
        fr(3, ".hkod-n") + "{opacity:1}",
        # ghost row only on press 2; the new over from press 3
        at(2, ".hkghost") + "{opacity:1}",
        fr(3, ".hkrow-new") + "," + fr(3, ".hkband") + "{opacity:1}",
        # tally: shells from 4, the answer on 5
        fr(4, ".hktally") + "{opacity:1}",
        fr(5, ".hkt-ans") + "{opacity:1}",
        fr(5, ".hkt-q") + "{opacity:0}",
        ".hkt-q{transition:opacity 200ms var(--ease-out)}",
        # the last press: the shape takes the counter's place
        at(6, ".hkctr") + "," + at(6, ".hktally") + "{opacity:0}",
        at(6, ".hkphone") + "{opacity:.28}",
        at(6, ".hkshape") + "{opacity:1}",
        at(6, ".hkcnt") + "{opacity:1;transition-delay:500ms}",
        at(6, ".hkarr") + "{animation:hkflow 1.2s linear infinite}",
        "@keyframes hkflow{to{stroke-dashoffset:-28}}",
    ]
    for k in range(1, STEPS + 1):
        rules.append(fr(k, f".hkr{k} .hkr-t") + "{opacity:1}")
        rules.append(fr(k, f".hkr{k} .hkr-ghost") + "{opacity:0}")
        rules.append(fr(k, f".hkr{k} .hkr-dot") + "{fill:#9AA7B1}")
        rules.append(at(k, f".hkr{k} .hkr-dot") + "{fill:#006DAF}")
        rules.append(at(k, f".hkr{k} .hkr-t") + "{fill:#006DAF;font-weight:700}")
    rules.append(
        "@media (prefers-reduced-motion:reduce){.hkfig *{transition:none "
        "!important;animation:none !important}}")
    return "\n".join(rules)
