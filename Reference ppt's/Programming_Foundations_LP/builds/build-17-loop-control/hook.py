"""The hook: the UPI PIN that keeps asking.

Lunch at the canteen, Rs 40 on PhonePe. The UPI PIN screen gives you three
tries. Try 1 is wrong. Try 2 is right and the money goes. Then the screen asks
for the PIN again. Everyone in the room has paid this way, and everyone knows
a real app stops asking the moment the PIN is right. That is the whole hook:
the room says "it should stop", and the last press draws the shape that does.

Facts this card leans on, checked against how UPI behaves:
  * a UPI PIN is 4 or 6 digits, set by the bank; this one is 4;
  * a wrong PIN gets another try, and three wrong in a row locks UPI for the
    day, so "3 tries" is a real number, not one made up for the loop;
  * no real app asks again after a success. The card says so out loud: the
    guide frames it as a new app a junior wrote, which is the background story
    that makes the odd screen honest instead of a claim about PhonePe.

The one motion: the phone's four screens sit on one strip, and one transform
slides it a screen per press (pay, wrong PIN, paid, asked again). On the last
press the exit arrow draws itself out of the loop, 900ms. Nothing on this
card says break, continue or loop control.
"""
import html

STEPS = 5
LABELS = ("Rs 40 for lunch|try 1: wrong PIN|try 2: paid|then it asks again|"
          "the shape behind it")

VB_W, VB_H = 1600, 740

# PhonePe's own purple. A near miss reads as a fake app.
PP = "#5F259F"
PP_DK = "#4A1A7E"
PP_BG = "#F3F1F7"
OK = "#1F9D62"
BAD = "#D6453D"
AMBER = "#C77700"
ORANGE = "#F29A1F"
BLUE = "#2F7FE0"
INK = "#434343"

AMOUNT = 40
SHOP = "Ravi Canteen"
UPI_ID = "ravicanteen@ybl"
BANK = "State Bank of India"
TRIES = 3


def esc(s):
    return html.escape(s, quote=True)


def fr(k, sel):
    return ",".join(f".hkstage.an-{j} {sel}" for j in range(k, STEPS + 1))


def at(k, sel):
    return f".hkstage.an-{k} {sel}"


def _t(x, y, s, size=14, weight=400, fill="#1B1F1D", anchor="start", cls=""):
    c = f' class="{cls}"' if cls else ""
    return (f'<text{c} x="{x}" y="{y}" font-size="{size}" font-weight="{weight}"'
            f' fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>')


# ------------------------------------------------------------------ the phone
K = 1.25
PX, PY, PH = 48, 8, 724
SW, SH = 368, (PH - 24) / K
PW = SW * K + 24


def _status(x, dark=False):
    col = "#1B1F1D" if dark else "#fff"
    return (_t(x + 26, 22, "12:48", 14, 600, col)
            + f'<g fill="{col}" transform="translate({x + SW - 92},11)">'
              '<rect x="0" y="8" width="3" height="4" rx="1"/>'
              '<rect x="5" y="5" width="3" height="7" rx="1"/>'
              '<rect x="10" y="2" width="3" height="10" rx="1"/>'
              '<rect x="15" y="0" width="3" height="12" rx="1"/>'
              '<path d="M30 11a9 9 0 0 1 14 0l-7 1.2z"/>'
              f'<rect x="52" y="1" width="22" height="11" rx="3" fill="none" '
              f'stroke="{col}" stroke-width="1.4"/>'
              '<rect x="54" y="3" width="15" height="7" rx="1.5"/>'
              '<rect x="75" y="4" width="2" height="5" rx="1"/></g>')


def _avatar(cx, cy, r=22, fill="#FCE3C7", ink="#9A5B12", letter="R"):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"/>'
            + _t(cx, cy + r * .36, letter, r * 1.0, 700, ink, "middle"))


def screen_pay(x):
    """PhonePe's pay screen: who you are paying, the amount, the bank, PAY."""
    out = (f'<rect x="{x}" y="0" width="{SW}" height="{SH}" fill="{PP_BG}"/>'
           f'<rect x="{x}" y="0" width="{SW}" height="118" fill="{PP}"/>'
           + _status(x)
           + f'<path d="M{x + 22} 62h18M{x + 22} 62l8 -8M{x + 22} 62l8 8" '
             'stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           + _avatar(x + 76, 70, 22)
           + _t(x + 108, 66, SHOP, 17, 700, "#fff")
           + _t(x + 108, 86, UPI_ID, 12.5, 500, "#D9C8F0")
           # the amount card
           + f'<rect x="{x + 16}" y="140" width="{SW - 32}" height="206" rx="16" '
             'fill="#fff" filter="url(#hkshadow)"/>'
           + _t(x + SW / 2, 186, "Paying", 14, 600, "#7A7390", "middle")
           + _t(x + SW / 2, 256, f"₹{AMOUNT}", 58, 800, "#1B1F1D", "middle")
           + f'<rect x="{x + SW / 2 - 70}" y="286" width="140" height="34" rx="17" '
             f'fill="#F1ECF8"/>'
           + _t(x + SW / 2, 308, "Lunch", 14, 600, PP, "middle")
           # the bank row
           + f'<rect x="{x + 16}" y="366" width="{SW - 32}" height="66" rx="14" fill="#fff"/>'
           + f'<rect x="{x + 32}" y="384" width="30" height="30" rx="7" fill="#1D5FB4"/>'
           + _t(x + 47, 405, "SBI", 10, 800, "#fff", "middle")
           + _t(x + 74, 396, BANK, 14, 700)
           + _t(x + 74, 415, "Savings •• 4821", 12, 500, "#7A7390")
           # PAY
           + f'<rect x="{x + 16}" y="{SH - 92}" width="{SW - 32}" height="56" rx="12" '
             f'fill="{PP}"/>'
           + _t(x + SW / 2, SH - 57, f"PAY ₹{AMOUNT}", 18, 800, "#fff", "middle")
           + f'<circle class="hktap" cx="{x + SW / 2}" cy="{SH - 64}" r="26" '
             'fill="#fff" opacity="0"/>')
    return out


KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"]


def screen_pin(x, n, state):
    """The UPI PIN pad. `state` is 'wrong' (four dots, a red banner) or
    'again' (empty slots, try 3 of 3). Drawn in the bank's white screen, the
    one every UPI app hands over to for the PIN."""
    out = (f'<rect x="{x}" y="0" width="{SW}" height="{SH}" fill="#fff"/>'
           + _status(x, dark=True)
           + f'<rect x="{x}" y="36" width="{SW}" height="72" fill="#F6F7F9"/>'
           + _t(x + 20, 64, BANK, 14.5, 700)
           + _t(x + 20, 86, f"To: {SHOP}", 12.5, 500, "#6B7280")
           + _t(x + SW - 20, 72, f"₹ {AMOUNT}.00", 18, 800, "#1B1F1D", "end"))
    pill_fill = "#FDECEC" if state == "wrong" else "#FFF3E0"
    pill_ink = BAD if state == "wrong" else AMBER
    out += (f'<rect x="{x + SW / 2 - 62}" y="124" width="124" height="28" rx="14" '
            f'fill="{pill_fill}"/>'
            + _t(x + SW / 2, 143, f"Try {n} of {TRIES}", 13.5, 800, pill_ink, "middle"))
    out += _t(x + SW / 2, 186, "ENTER 4-DIGIT UPI PIN", 13, 800, "#4B5563", "middle")
    for i in range(4):
        cx = x + SW / 2 - 84 + i * 56
        out += (f'<line x1="{cx - 18}" x2="{cx + 18}" y1="232" y2="232" '
                'stroke="#1B1F1D" stroke-width="2.4"/>')
        if state == "wrong":
            out += f'<circle cx="{cx}" cy="216" r="8" fill="#1B1F1D"/>'
    if state == "wrong":
        out += (f'<rect x="{x + 18}" y="252" width="{SW - 36}" height="40" rx="10" '
                f'fill="#FDECEC"/>'
                + _t(x + SW / 2, 277, "Incorrect UPI PIN. 2 attempts left.",
                     13.5, 700, BAD, "middle"))
    else:
        out += (f'<rect class="hkcaret" x="{x + SW / 2 - 86}" y="202" width="3" '
                'height="26" fill="#1B1F1D"/>')
    ky0 = SH - 262
    out += f'<rect x="{x}" y="{ky0 - 12}" width="{SW}" height="274" fill="#F1F3F4"/>'
    for i, k in enumerate(KEYS):
        c, r = i % 3, i // 3
        kx = x + 12 + c * ((SW - 24) / 3)
        ky = ky0 + r * 62
        out += (f'<rect x="{kx + 4}" y="{ky}" width="{(SW - 24) / 3 - 8}" height="54" '
                'rx="10" fill="#fff"/>'
                + _t(kx + (SW - 24) / 6, ky + 36, k, 24 if k.isdigit() else 22,
                     600, PP if k == "✓" else "#1B1F1D", "middle"))
    return out


def screen_paid(x):
    out = (f'<rect x="{x}" y="0" width="{SW}" height="{SH}" fill="#fff"/>'
           + _status(x, dark=True)
           + f'<circle cx="{x + SW / 2}" cy="170" r="54" fill="{OK}"/>'
           + f'<path d="M{x + SW / 2 - 24} 170l16 16l32 -34" stroke="#fff" '
             'stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
           + _t(x + SW / 2, 268, "Payment Successful", 20, 800, "#1B1F1D", "middle")
           + _t(x + SW / 2, 334, f"₹{AMOUNT}", 46, 800, "#1B1F1D", "middle")
           + _t(x + SW / 2, 364, f"Paid to {SHOP}", 14.5, 600, "#4B5563", "middle")
           + f'<rect x="{x + 16}" y="394" width="{SW - 32}" height="96" rx="14" '
             'fill="#F6F7F9"/>'
           + _t(x + 32, 424, "Debited from", 12, 600, "#6B7280")
           + _t(x + 32, 446, f"{BANK} •• 4821", 14, 700)
           + _t(x + 32, 474, "UTR 4271 9930 6418", 12, 500, "#6B7280")
           + f'<rect x="{x + 16}" y="{SH - 92}" width="{SW - 32}" height="56" rx="12" '
             f'fill="{PP}"/>'
           + _t(x + SW / 2, SH - 57, "Done", 18, 800, "#fff", "middle"))
    return out


def phone():
    strip = (screen_pay(0) + screen_pin(SW, 1, "wrong") + screen_paid(2 * SW)
             + screen_pin(3 * SW, 3, "again"))
    return (f'<g class="hkphone">'
            f'<rect x="{PX}" y="{PY}" width="{PW}" height="{PH}" rx="46" fill="#101412"/>'
            f'<g transform="translate({PX + 12},{PY + 12}) scale({K})">'
            f'<clipPath id="hkscreen"><rect x="0" y="0" width="{SW}" height="{SH}" rx="28"/>'
            '</clipPath>'
            '<g clip-path="url(#hkscreen)">'
            f'<g class="hkslide">{strip}</g>'
            '</g></g></g>')


# ------------------------------------------------------------------ the rail
RX, RY, RDY = 600, 46, 48
RAIL = [
    "Rs 40 for lunch. The app gives you 3 tries at your PIN.",
    "Try 1: a wrong PIN. It asks again.",
    "Try 2: the right PIN. The money is paid.",
    "Then it asks for the PIN again. Why?",
    "It should stop asking the moment the PIN is right.",
]


def rail():
    out = ""
    for i, s in enumerate(RAIL, 1):
        y = RY + (i - 1) * RDY
        w = 40 + len(s) * 11.2
        out += (f'<g class="hkr hkr{i}">'
                f'<rect class="hkr-ghost" x="{RX + 44}" y="{y - 20}" '
                f'width="{w:.0f}" height="28" rx="8"/>'
                f'<circle class="hkr-dot" cx="{RX + 14}" cy="{y - 6}" r="15"/>'
                + _t(RX + 14, y - 1, str(i), 14, 800, "#fff", "middle", "hkr-n")
                + _t(RX + 44, y, s.replace("Rs ", "₹"), 24, 500, INK, cls="hkr-t")
                + '</g>')
    return out


# ------------------------------------------------------------------ the three tries
TY, TW, TH, TGAP, TX0 = 300, 250, 132, 26, 640


def tries():
    out = '<g class="hktries">'
    for i in range(TRIES):
        x = TX0 + i * (TW + TGAP)
        n = i + 1
        out += (f'<g class="hktry hktry{n}">'
                f'<rect class="hktry-box" x="{x}" y="{TY}" width="{TW}" height="{TH}" rx="18"/>'
                + _t(x + 22, TY + 38, f"Try {n}", 22, 800, "#6B7A86", cls="hktry-h")
                # the three things a try can turn into, one of them showing
                + f'<g class="hks hks-bad"><circle cx="{x + TW - 44}" cy="{TY + 34}" r="18" fill="{BAD}"/>'
                  f'<path d="M{x + TW - 51} {TY + 27}l14 14M{x + TW - 37} {TY + 27}l-14 14" '
                  'stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>'
                + _t(x + 22, TY + 96, "wrong PIN", 26, 700, BAD) + '</g>'
                + f'<g class="hks hks-ok"><circle cx="{x + TW - 44}" cy="{TY + 34}" r="18" fill="{OK}"/>'
                  f'<path d="M{x + TW - 53} {TY + 34}l7 7l13 -14" stroke="#fff" '
                  'stroke-width="3.4" fill="none" stroke-linecap="round"/>'
                + _t(x + 22, TY + 96, "right PIN, paid", 26, 700, OK) + '</g>'
                + f'<g class="hks hks-ask">'
                + _t(x + TW - 44, TY + 46, "?", 34, 800, AMBER, "middle")
                + _t(x + 22, TY + 96, "asked again", 26, 700, AMBER) + '</g>'
                + f'<g class="hks hks-never">'
                + _t(x + 22, TY + 96, "never asked", 26, 700, "#9AA7B1") + '</g>'
                + f'<g class="hks hks-wait">'
                + _t(x + 22, TY + 96, "not yet", 24, 600, "#A7B0BA") + '</g>'
                + '</g>')
    return out + '</g>'


# ------------------------------------------------------------------ the shape
def shape():
    x0, y0 = 690, 504
    code = 'font-family="var(--mono)"'
    H = 44

    def hdr(x, y, kw, rest, col):
        return (f'<text x="{x}" y="{y}" font-size="26" {code}>'
                f'<tspan fill="{col}" font-weight="700">{esc(kw)}</tspan>'
                f'<tspan fill="#1F4E79" font-weight="600">{esc(rest)}</tspan></text>')

    def blk(x, y, w, s, fill="#CDE7FA", stroke="#A9D3F2", ink="#4A5A66"):
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{H}" rx="4" '
                f'fill="{fill}" stroke="{stroke}"/>'
                f'<text x="{x + 16}" y="{y + 29}" font-size="20" {code} '
                f'fill="{ink}">{esc(s)}</text>')

    ib = y0 + 92
    b1, b2, b3 = y0 + 14, ib + 14, ib + 14 + H + 26
    return (f'<g class="hkshape">'
            f'<rect x="{x0 + 34}" y="{y0 + 12}" width="36" height="{ib + 14 + H - y0 - 10}" '
            'fill="#EEF1F3"/>'
            + hdr(x0 + 40, y0, "every try", ", up to 3:", "#D6453D")
            + blk(x0 + 76, b1, 470, "ask for the UPI PIN")
            + hdr(x0 + 80, ib - 6, "if", " the PIN is right:", "#D6453D")
            + blk(x0 + 116, b2, 430, "pay, then leave straight away",
                  "#E3F5EA", "#9FD8B8", "#1B6B45")
            + blk(x0 + 34, b3, 512, "show the receipt")
            # the return arrow: back to the top for the next try
            + f'<path class="hkarr-out" d="M{x0 + 64} {b1 + H / 2 + 36}H{x0 + 14}'
              f'V{y0 - 9}H{x0 + 26}" fill="none" stroke="{ORANGE}" stroke-width="3" '
              'stroke-dasharray="8 6" marker-end="url(#hkarrO)"/>'
            # the exit: out of the middle of the block, past the end, to the receipt
            + f'<path class="hkexit" d="M{x0 + 546} {b2 + H / 2}H{x0 + 610}'
              f'V{b3 + H / 2}H{x0 + 556}" fill="none" stroke="{OK}" stroke-width="4" '
              'marker-end="url(#hkarrG)" pathLength="100"/>'
            + f'<circle cx="{x0 + 546}" cy="{b2 + H / 2}" r="6" fill="{OK}"/>'
            + _t(x0 + 624, b2 + H / 2 + 40, "leave now", 22, 800, OK, cls="hkexit-t")
            + '</g>')


# ------------------------------------------------------------------ the app log
# A timeline, one line per thing the app did, filling the lower right while the
# story runs. It fades on the last press and the shape takes its place.
LX, LY, LDY = 660, 506, 44


def _log(prefix, head, rows):
    """rows: (first press, last press, text, colour)."""
    slots = _slots(rows)
    out = (f'<g class="{prefix}log">'
           + _t(LX - 20, LY - 26, head, 17, 700, "#8B98A5")
           + f'<line x1="{LX}" x2="{LX}" y1="{LY - 10}" y2="{LY + LDY * (max(slots)) + 6}" '
             'stroke="#E1E6EA" stroke-width="2"/>')
    for (a, b, text, col), n in zip(rows, slots):
        y = LY + n * LDY
        cls = f"{prefix}lg " + " ".join(f"{prefix}lg-{k}" for k in range(a, b + 1))
        out += (f'<g class="{cls}"><circle cx="{LX}" cy="{y - 7}" r="7" fill="{col}"/>'
                + _t(LX + 24, y, text, 21, 600, col) + '</g>')
    return out + '</g>'


def _slots(rows):
    """Rows that are up at the same time stack; a row that replaces another
    takes the first line free across all the presses it is up for."""
    got = []
    for i, (a, b, _t2, _c) in enumerate(rows):
        taken = {got[j] for j, (a2, b2, _x, _y) in enumerate(rows[:i])
                 if not (b2 < a or a2 > b)}
        n = 0
        while n in taken:
            n += 1
        got.append(n)
    return got



LOG = [(1, 4, "Asked for the UPI PIN, try 1", "#6B7A86"),
       (2, 4, "Wrong PIN. Asked again, try 2", BAD),
       (3, 4, f"Right PIN. ₹{AMOUNT} paid to {SHOP}", OK),
       (4, 4, "Asked for the UPI PIN, try 3", AMBER)]


def log():
    return _log("hk", "App log, 12:48", LOG)


def defs():
    return (
        '<defs>'
        '<filter id="hkshadow" x="-10%" y="-10%" width="120%" height="130%">'
        '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#2A1450" '
        'flood-opacity=".10"/></filter>'
        '<marker id="hkarrO" viewBox="0 0 10 10" refX="7" refY="5" '
        'markerWidth="7" markerHeight="7" orient="auto">'
        f'<path d="M0 0L10 5L0 10z" fill="{ORANGE}"/></marker>'
        '<marker id="hkarrG" viewBox="0 0 10 10" refX="7" refY="5" '
        'markerWidth="6" markerHeight="6" orient="auto">'
        f'<path d="M0 0L10 5L0 10z" fill="{OK}"/></marker>'
        '</defs>')


def body():
    svg = (f'<svg class="fig hkfig" viewBox="0 0 {VB_W} {VB_H}" '
           'xmlns="http://www.w3.org/2000/svg" role="img" '
           'aria-label="A PhonePe payment of 40 rupees. The first UPI PIN is '
           'wrong, the second is right and the money is paid, and then the '
           'screen asks for the PIN a third time.">'
           + defs() + phone() + rail() + tries() + log() + shape()
           + '</svg>')
    return f'<div class="hkwrap">{svg}</div>'


# ------------------------------------------------------------------ the CSS
# what each try box shows on each press
TRY_STATE = {
    1: {1: "wait", 2: "bad", 3: "bad", 4: "bad", 5: "bad"},
    2: {1: "wait", 2: "wait", 3: "ok", 4: "ok", 5: "ok"},
    3: {1: "wait", 2: "wait", 3: "wait", 4: "ask", 5: "never"},
}
SCREEN_AT = {1: 0, 2: 1, 3: 2, 4: 3, 5: 3}


def css():
    r = [
        ".hkwrap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}",
        ".hkfig{width:100%;height:100%;display:block;font-family:var(--sans)}",
        ".hkfig *{transform-box:view-box}",
        ".hkslide{transition:transform 520ms var(--ease-in-out)}",
        ".hkphone{transition:opacity 320ms var(--ease-out)}",
        ".hkr-ghost{fill:none;stroke:#C5CFD7;stroke-width:1.6;stroke-dasharray:6 5;"
        "transition:opacity 200ms var(--ease-out)}",
        ".hkr-dot{fill:#C5CFD7;transition:fill 200ms var(--ease-out)}",
        ".hkr-t{opacity:0;transition:opacity 260ms var(--ease-out)}",
        ".hktry-box{fill:#FBFCFD;stroke:#D8E2EA;stroke-width:2.5;"
        "transition:fill 240ms var(--ease-out),stroke 240ms var(--ease-out)}",
        ".hks{opacity:0;transition:opacity 240ms var(--ease-out)}",
        ".hkshape{opacity:0;transition:opacity 320ms var(--ease-out)}",
        ".hkexit{stroke-dasharray:100;stroke-dashoffset:100;"
        "transition:stroke-dashoffset 900ms var(--ease-in-out) 300ms}",
        ".hkexit-t{opacity:0;transition:opacity 260ms var(--ease-out) 1100ms}",
        ".hkcaret{animation:hkblink 1.1s steps(1,end) infinite}",
        "@keyframes hkblink{50%{opacity:0}}",
        ".hktap{transition:opacity 200ms var(--ease-out)}",
    ]
    for k in range(1, STEPS + 1):
        r.append(at(k, f".hklg-{k}") + "{opacity:1}")
        r.append(at(k, ".hkslide") + f"{{transform:translateX({-SCREEN_AT[k] * SW}px)}}")
        for n, states in TRY_STATE.items():
            st = states[k]
            r.append(at(k, f".hktry{n} .hks-{st}") + "{opacity:1}")
            box = {"bad": ("#FDF1F1", "#E8A9A5"), "ok": ("#EFFAF3", "#9FD8B8"),
                   "ask": ("#FFF6E8", "#E8B45F"), "never": ("#FFFFFF", "#C5CFD7"),
                   "wait": ("#FBFCFD", "#D8E2EA")}[st]
            r.append(at(k, f".hktry{n} .hktry-box") + f"{{fill:{box[0]};stroke:{box[1]}}}")
            if st in ("never", "wait"):
                r.append(at(k, f".hktry{n} .hktry-box") + "{stroke-dasharray:8 7}")
        r.append(fr(k, f".hkr{k} .hkr-t") + "{opacity:1}")
        r.append(fr(k, f".hkr{k} .hkr-ghost") + "{opacity:0}")
        r.append(fr(k, f".hkr{k} .hkr-dot") + "{fill:#9AA7B1}")
        r.append(at(k, f".hkr{k} .hkr-dot") + "{fill:#006DAF}")
        r.append(at(k, f".hkr{k} .hkr-t") + "{fill:#006DAF;font-weight:700}")
    r += [
        at(4, ".hkr4 .hkr-t") + "{fill:#C77700}",
        at(4, ".hkr4 .hkr-dot") + "{fill:#C77700}",
        at(5, ".hkphone") + "{opacity:.3}",
        at(5, ".hkshape") + "{opacity:1}",
        ".hklg{opacity:0;transition:opacity 260ms var(--ease-out)}",
        ".hklog{transition:opacity 260ms var(--ease-out)}",
        at(5, ".hklog") + "{opacity:0}",
        at(5, ".hkexit") + "{stroke-dashoffset:0}",
        at(5, ".hkexit-t") + "{opacity:1}",
        "@media (prefers-reduced-motion:reduce){.hkfig *{transition:none !important;"
        "animation:none !important}}",
        "@media print{.hkshape,.hkexit-t,.hkr-t{opacity:1}.hkexit{stroke-dashoffset:0}}",
    ]
    return "\n".join(r)
