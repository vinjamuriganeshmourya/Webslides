"""The second hook: the Swiggy cart with one item gone.

The room has just learnt break. Now a real screen needs something break
cannot do. Four items in a Swiggy cart, and the Coke is out of stock. The app
adds up the bill one item at a time. If it leaves the loop at the Coke (break),
the Gulab Jamun and the Raita are never counted and the bill is wrong. What it
has to do is skip that one item and carry on with the next.

The totals are not typed. `panels.bill("break")` and `panels.bill("continue")`
run the same bill loop for real with each word in it, and the tiles show
exactly the items `panels.bill_counted` says were added.

The one motion: on the last press the skip arrow draws itself from the
out-of-stock line back UP to the top of the loop, 900ms. Hook 1's arrow left
the loop downwards; this one goes back to the top. That contrast is the
session's one idea, and nothing on the card names it.
"""
import html

import panels as P

STEPS = 5
LABELS = "the cart|one item is gone|leave at the Coke?|skip it, carry on|the shape"

VB_W, VB_H = 1600, 740
SWG = "#FC8019"
SWG_DK = "#DB6A0F"
INKD = "#3D4152"
OK = "#1F9D62"
BAD = "#D6453D"
AMBER = "#C77700"
ORANGE = "#F29A1F"
INK = "#434343"


def esc(s):
    return html.escape(s, quote=True)


def fr(k, sel):
    return ",".join(f".wystage.an-{j} {sel}" for j in range(k, STEPS + 1))


def at(k, sel):
    return f".wystage.an-{k} {sel}"


def _t(x, y, s, size=14, weight=400, fill="#1B1F1D", anchor="start", cls=""):
    c = f' class="{cls}"' if cls else ""
    return (f'<text{c} x="{x}" y="{y}" font-size="{size}" font-weight="{weight}"'
            f' fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>')


def rs(n):
    return f"₹{n}"


BREAK_TOTAL = P.bill("break")
SKIP_TOTAL = P.bill("continue")
BREAK_ADDED = P.bill_counted("break")
SKIP_ADDED = P.bill_counted("continue")

# ------------------------------------------------------------------ the phone
K = 1.25
PX, PY, PH = 48, 8, 724
SW, SH = 368, (PH - 24) / K
PW = SW * K + 24


def _status():
    col = "#1B1F1D"
    return (_t(26, 22, "1:05", 14, 600, col)
            + f'<g fill="{col}" transform="translate({SW - 92},11)">'
              '<rect x="0" y="8" width="3" height="4" rx="1"/>'
              '<rect x="5" y="5" width="3" height="7" rx="1"/>'
              '<rect x="10" y="2" width="3" height="10" rx="1"/>'
              '<rect x="15" y="0" width="3" height="12" rx="1"/>'
              '<path d="M30 11a9 9 0 0 1 14 0l-7 1.2z"/>'
              f'<rect x="52" y="1" width="22" height="11" rx="3" fill="none" '
              f'stroke="{col}" stroke-width="1.4"/>'
              '<rect x="54" y="3" width="15" height="7" rx="1.5"/></g>')


def _mark(x, y, veg):
    """India's food mark: green square and dot for veg, brown square and
    triangle for non-veg. Every menu in the country carries one."""
    col = "#0F8A3C" if veg else "#8B3A0E"
    inner = (f'<circle cx="{x + 7}" cy="{y + 7}" r="3.6" fill="{col}"/>' if veg else
             f'<path d="M{x + 7} {y + 3}l4.4 7.6h-8.8z" fill="{col}"/>')
    return (f'<rect x="{x}" y="{y}" width="14" height="14" rx="2" fill="#fff" '
            f'stroke="{col}" stroke-width="1.6"/>' + inner)


ROW0, ROWH = 128, 64


def _items():
    out = (f'<rect x="12" y="{ROW0 - 16}" width="{SW - 24}" height="{ROWH * 4 + 20}" '
           'rx="16" fill="#fff" filter="url(#wyshadow)"/>')
    for i, (name, price, ok) in enumerate(P.CART):
        y = ROW0 + i * ROWH
        veg = name != "Chicken Biryani"
        g = f'<g class="wyitem wyitem{i + 1}{" wyout" if not ok else ""}">'
        g += _mark(28, y + 8, veg)
        g += _t(52, y + 20, name, 15, 700, INKD if ok else "#A0A4AE")
        if ok:
            g += _t(52, y + 42, rs(price), 13.5, 600, "#5E6272")
            g += (f'<rect x="{SW - 124}" y="{y + 4}" width="84" height="32" rx="8" '
                  f'fill="#fff" stroke="#D4D5D9"/>'
                  + _t(SW - 110, y + 26, "−", 17, 700, OK, "middle")
                  + _t(SW - 82, y + 26, "1", 15, 700, OK, "middle")
                  + _t(SW - 54, y + 26, "+", 17, 700, OK, "middle"))
        else:
            g += (f'<rect x="52" y="{y + 30}" width="92" height="20" rx="5" fill="#FDECEC"/>'
                  + _t(98, y + 45, "Out of stock", 11.5, 800, BAD, "middle")
                  + _t(SW - 30, y + 26, rs(price), 13.5, 600, "#A0A4AE", "end"))
        if i < 3:
            g += (f'<line x1="28" x2="{SW - 28}" y1="{y + ROWH - 6}" y2="{y + ROWH - 6}" '
                  'stroke="#EEEFF2" stroke-dasharray="3 3"/>')
        out += g + '</g>'
    return out


def _billcard():
    y = ROW0 + ROWH * 4 + 22
    return (f'<rect x="12" y="{y}" width="{SW - 24}" height="112" rx="16" fill="#fff" '
            'filter="url(#wyshadow)"/>'
            + _t(28, y + 30, "Bill Details", 15, 800, INKD)
            + _t(28, y + 64, "Item Total", 14, 500, "#5E6272")
            + _t(SW - 28, y + 64, "adding up…", 14, 600, "#A0A4AE", "end", "wybt wybt0")
            + _t(SW - 28, y + 64, rs(BREAK_TOTAL), 17, 800, BAD, "end", "wybt wybt1")
            + _t(SW - 28, y + 64, rs(SKIP_TOTAL), 17, 800, OK, "end", "wybt wybt2")
            + _t(28, y + 92, "Taxes and delivery are added after this.", 11.5, 500,
                 "#A0A4AE"))


def phone():
    body = (f'<rect x="0" y="0" width="{SW}" height="{SH}" fill="#F1F1F6"/>'
            f'<rect x="0" y="0" width="{SW}" height="100" fill="#fff"/>'
            + _status()
            + '<path d="M22 64h18M22 64l8 -8M22 64l8 8" stroke="#1B1F1D" '
              'stroke-width="2.4" fill="none" stroke-linecap="round"/>'
            + _t(56, 60, "Paradise Biryani", 17, 800, INKD)
            + _t(56, 80, "Secunderabad · 35 mins", 12.5, 500, "#7E808C")
            + _items() + _billcard()
            + f'<rect x="0" y="{SH - 70}" width="{SW}" height="70" fill="#fff"/>'
            + f'<rect x="16" y="{SH - 60}" width="{SW - 32}" height="50" rx="12" fill="{OK}"/>'
            + _t(SW / 2, SH - 29, "Proceed to Pay", 17, 800, "#fff", "middle"))
    return (f'<g class="wyphone">'
            f'<rect x="{PX}" y="{PY}" width="{PW}" height="{PH}" rx="46" fill="#101412"/>'
            f'<g transform="translate({PX + 12},{PY + 12}) scale({K})">'
            f'<clipPath id="wyscreen"><rect x="0" y="0" width="{SW}" height="{SH}" rx="28"/>'
            '</clipPath>'
            f'<g clip-path="url(#wyscreen)">{body}</g></g></g>')


# ------------------------------------------------------------------ the rail
RX, RY, RDY = 600, 46, 48
RAIL = [
    "Your Swiggy cart. The app adds up the bill, one item at a time.",
    "The Coke is out of stock. What should the loop do with it?",
    f"Leave the loop at the Coke? The bill is {rs(BREAK_TOTAL)}. Wrong.",
    f"Skip the Coke, then carry on. The bill is {rs(SKIP_TOTAL)}.",
    "Skip the rest of this pass. Go back to the top for the next item.",
]


def rail():
    out = ""
    for i, s in enumerate(RAIL, 1):
        y = RY + (i - 1) * RDY
        w = 40 + len(s) * 11
        out += (f'<g class="wyr wyr{i}">'
                f'<rect class="wyr-ghost" x="{RX + 44}" y="{y - 20}" '
                f'width="{min(w, 950):.0f}" height="28" rx="8"/>'
                f'<circle class="wyr-dot" cx="{RX + 14}" cy="{y - 6}" r="15"/>'
                + _t(RX + 14, y - 1, str(i), 14, 800, "#fff", "middle")
                + _t(RX + 44, y, s, 23, 500, INK, cls="wyr-t")
                + '</g>')
    return out


# ------------------------------------------------------------------ the four items
TY, TW, TH, TGAP, TX0 = 270, 214, 120, 16, 640
NAMES = {"Chicken Biryani": "Biryani", "Coke": "Coke",
         "Gulab Jamun": "Gulab Jamun", "Raita": "Raita"}

# what each tile shows on each press
def _state(i, k):
    name, price, ok = P.CART[i]
    if k == 1:
        return "wait"
    if k == 2:
        return "added" if i == 0 else ("out" if not ok else "wait")
    if k == 3:
        if not ok:
            return "brk"
        return "added" if name in BREAK_ADDED else "never"
    if not ok:
        return "skip"
    return "added" if name in SKIP_ADDED else "wait"


def tiles():
    out = '<g class="wytiles">'
    for i, (name, price, ok) in enumerate(P.CART):
        x = TX0 + i * (TW + TGAP)
        n = i + 1
        out += (f'<g class="wyt wyt{n}">'
                f'<rect class="wyt-box" x="{x}" y="{TY}" width="{TW}" height="{TH}" rx="18"/>'
                + _t(x + 18, TY + 34, NAMES[name], 21, 800, INKD)
                + _t(x + 18, TY + 60, rs(price), 20, 600, "#6B7A86"))
        for st, text, col in (("wait", "not yet", "#A7B0BA"),
                              ("added", f"+{rs(price)} added", OK),
                              ("out", "out of stock", AMBER),
                              ("brk", "leave here?", BAD),
                              ("never", "never counted", "#9AA7B1"),
                              ("skip", "skipped", "#6B7A86")):
            out += (f'<g class="wys wys-{st}">'
                    + _t(x + 18, TY + 100, text, 22, 700, col) + '</g>')
        out += '</g>'
    # the running bill
    bx = TX0 + 4 * (TW + TGAP) - TGAP - 300
    out += (f'<g class="wybill">'
            f'<rect x="{bx}" y="{TY + TH + 14}" width="300" height="58" rx="14" '
            'fill="#fff" stroke="#D8E2EA" stroke-width="2"/>'
            + _t(bx + 20, TY + TH + 52, "Bill", 22, 700, "#6B7A86")
            + _t(bx + 280, TY + TH + 54, rs(BREAK_TOTAL), 32, 800, BAD, "end", "wyb wyb1")
            + _t(bx + 280, TY + TH + 54, rs(SKIP_TOTAL), 32, 800, OK, "end", "wyb wyb2")
            + '</g>')
    return out + '</g>'


# ------------------------------------------------------------------ the shape
def shape():
    x0, y0 = 690, 520
    code = 'font-family="var(--mono)"'
    H = 42

    def hdr(x, y, kw, rest, col):
        return (f'<text x="{x}" y="{y}" font-size="25" {code}>'
                f'<tspan fill="{col}" font-weight="700">{esc(kw)}</tspan>'
                f'<tspan fill="#1F4E79" font-weight="600">{esc(rest)}</tspan></text>')

    def blk(x, y, w, s, fill="#CDE7FA", stroke="#A9D3F2", ink="#4A5A66"):
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{H}" rx="4" '
                f'fill="{fill}" stroke="{stroke}"/>'
                f'<text x="{x + 16}" y="{y + 28}" font-size="19" {code} '
                f'fill="{ink}">{esc(s)}</text>')

    ib = y0 + 44
    b_skip, b_add, b_out = ib + 12, ib + 12 + H + 10, ib + 12 + 2 * H + 30
    return (f'<g class="wyshape">'
            f'<rect x="{x0 + 34}" y="{y0 + 12}" width="36" height="{b_add + H - y0 - 10}" '
            'fill="#EEF1F3"/>'
            + hdr(x0 + 40, y0, "every item", " in the cart:", "#D6453D")
            + hdr(x0 + 80, ib, "if", " it is out of stock:", "#D6453D")
            + blk(x0 + 116, b_skip, 440, "skip it, go to the next item",
                  "#FFF3E0", "#E8B45F", "#8A5200")
            + blk(x0 + 76, b_add, 480, "add its price to the bill")
            + blk(x0 + 34, b_out, 522, "show the bill")
            # the skip: out of the middle of the pass, straight back to the top
            + f'<path class="wyskip" d="M{x0 + 556} {b_skip + H / 2}H{x0 + 640}'
              f'V{y0 - 9}H{x0 + 520}" fill="none" stroke="{ORANGE}" stroke-width="4" '
              'marker-end="url(#wyarr)" pathLength="100"/>'
            + f'<circle cx="{x0 + 556}" cy="{b_skip + H / 2}" r="6" fill="{ORANGE}"/>'
            + _t(x0 + 654, y0 + 60, "back to the top", 21, 800, AMBER, cls="wyskip-t")
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



def _rows():
    rows, bill = [(1, 1, f"The bill starts at {rs(0)}", "#6B7A86")], 0
    name, price, _ok = P.CART[0]
    rows.append((2, 4, f"{name}  +{rs(price)}   bill {rs(price)}", OK))
    rows.append((2, 4, "Coke is out of stock", AMBER))
    rows.append((3, 3, "Leave the loop here. Jamun and Raita are never read.", BAD))
    bill = price
    rows.append((4, 4, "Skip the Coke, go on to the next item", "#6B7A86"))
    for name, price, ok in P.CART[2:]:
        bill += price
        rows.append((4, 4, f"{name}  +{rs(price)}   bill {rs(bill)}", OK))
    assert bill == SKIP_TOTAL
    return rows


def log():
    return _log("wy", "Adding up the bill", _rows())


def defs():
    return ('<defs>'
            '<filter id="wyshadow" x="-10%" y="-10%" width="120%" height="130%">'
            '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#282C3F" '
            'flood-opacity=".10"/></filter>'
            '<marker id="wyarr" viewBox="0 0 10 10" refX="7" refY="5" '
            'markerWidth="6" markerHeight="6" orient="auto">'
            f'<path d="M0 0L10 5L0 10z" fill="{ORANGE}"/></marker>'
            '</defs>')


def body():
    svg = (f'<svg class="fig wyfig" viewBox="0 0 {VB_W} {VB_H}" '
           'xmlns="http://www.w3.org/2000/svg" role="img" '
           'aria-label="A Swiggy cart with four items. The Coke is out of stock. '
           f'Leaving at the Coke gives a bill of {BREAK_TOTAL} rupees; skipping it '
           f'and carrying on gives {SKIP_TOTAL}.">'
           + defs() + phone() + rail() + tiles() + log() + shape() + '</svg>')
    return f'<div class="wywrap">{svg}</div>'


BOX = {"wait": ("#FBFCFD", "#D8E2EA", True), "added": ("#EFFAF3", "#9FD8B8", False),
       "out": ("#FFF6E8", "#E8B45F", False), "brk": ("#FDF1F1", "#E8A9A5", False),
       "never": ("#FFFFFF", "#C5CFD7", True), "skip": ("#F4F6F8", "#C5CFD7", False)}


def css():
    r = [
        ".wywrap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}",
        ".wyfig{width:100%;height:100%;display:block;font-family:var(--sans)}",
        ".wyfig *{transform-box:view-box}",
        ".wyphone{transition:opacity 320ms var(--ease-out)}",
        ".wyr-ghost{fill:none;stroke:#C5CFD7;stroke-width:1.6;stroke-dasharray:6 5;"
        "transition:opacity 200ms var(--ease-out)}",
        ".wyr-dot{fill:#C5CFD7;transition:fill 200ms var(--ease-out)}",
        ".wyr-t{opacity:0;transition:opacity 260ms var(--ease-out)}",
        ".wyt-box{fill:#FBFCFD;stroke:#D8E2EA;stroke-width:2.5;"
        "transition:fill 240ms var(--ease-out),stroke 240ms var(--ease-out)}",
        ".wys,.wyb,.wybt{opacity:0;transition:opacity 240ms var(--ease-out)}",
        ".wybill{opacity:0;transition:opacity 240ms var(--ease-out)}",
        ".wyitem2 rect,.wyitem2 text{transition:opacity 240ms var(--ease-out)}",
        ".wyshape{opacity:0;transition:opacity 320ms var(--ease-out)}",
        ".wyskip{stroke-dasharray:100;stroke-dashoffset:100;"
        "transition:stroke-dashoffset 900ms var(--ease-in-out) 300ms}",
        ".wyskip-t{opacity:0;transition:opacity 260ms var(--ease-out) 1100ms}",
    ]
    for k in range(1, STEPS + 1):
        r.append(at(k, f".wylg-{k}") + "{opacity:1}")
        for i in range(len(P.CART)):
            st = _state(i, k)
            fill, stroke, dash = BOX[st]
            r.append(at(k, f".wyt{i + 1} .wys-{st}") + "{opacity:1}")
            r.append(at(k, f".wyt{i + 1} .wyt-box") + f"{{fill:{fill};stroke:{stroke}"
                     + (";stroke-dasharray:8 7" if dash else "") + "}")
        r.append(fr(k, f".wyr{k} .wyr-t") + "{opacity:1}")
        r.append(fr(k, f".wyr{k} .wyr-ghost") + "{opacity:0}")
        r.append(fr(k, f".wyr{k} .wyr-dot") + "{fill:#9AA7B1}")
        r.append(at(k, f".wyr{k} .wyr-dot") + "{fill:#006DAF}")
        r.append(at(k, f".wyr{k} .wyr-t") + "{fill:#006DAF;font-weight:700}")
    r += [
        fr(1, ".wybt0") + "{opacity:1}",
        fr(3, ".wybt0") + "{opacity:0}",
        at(3, ".wybt1") + "{opacity:1}",
        fr(4, ".wybt2") + "{opacity:1}",
        fr(3, ".wybill") + "{opacity:1}",
        at(3, ".wyb1") + "{opacity:1}",
        fr(4, ".wyb2") + "{opacity:1}",
        at(3, ".wyr3 .wyr-t") + "{fill:#D6453D}",
        at(3, ".wyr3 .wyr-dot") + "{fill:#D6453D}",
        at(5, ".wyphone") + "{opacity:.3}",
        ".wytiles{transition:opacity 280ms var(--ease-out)}",
        at(5, ".wyshape") + "{opacity:1}",
        ".wylg{opacity:0;transition:opacity 260ms var(--ease-out)}",
        ".wylog{transition:opacity 260ms var(--ease-out)}",
        at(5, ".wylog") + "{opacity:0}",
        at(5, ".wyskip") + "{stroke-dashoffset:0}",
        at(5, ".wyskip-t") + "{opacity:1}",
        "@media (prefers-reduced-motion:reduce){.wyfig *{transition:none !important}}",
        "@media print{.wyshape,.wyskip-t,.wyr-t{opacity:1}.wyskip{stroke-dashoffset:0}}",
    ]
    return "\n".join(r)
