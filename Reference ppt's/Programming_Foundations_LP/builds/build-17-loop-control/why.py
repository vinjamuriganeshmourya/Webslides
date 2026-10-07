"""The second hook: a reel you swipe away.

The room has just learnt break. Now a screen they use every day does the other
thing. Instagram Reels: reel 1 plays to the end. Reel 2 starts, and at 0:03
you do not like it, so you swipe up. The rest of reel 2 never plays, and reel
3 starts from 0:00. The feed does not stop. Closing the app would stop it, and
that is break; the swipe skips the rest of one reel and carries on, and that
is the word the next card names.

The seconds are not typed. `panels.reels_played()` runs the feed loop for real
with continue in it, and the watch bars are drawn from what it returns.

The one motion: the phone's three reels sit on one vertical strip, and one
transform slides it up a reel on the swipe (520ms). On the last press the skip
arrow draws itself from the swipe line back UP to the top of the loop, 900ms.
Hook 1's arrow left the loop; this one goes back to the top. Nothing on the
card names either word.
"""
import html

import panels as P

STEPS = 5
LABELS = "reel 1|reel 2, at 0:03|swipe up|the feed carries on|the shape"

VB_W, VB_H = 1600, 740
OK = "#1F9D62"
BAD = "#D6453D"
AMBER = "#C77700"
ORANGE = "#F29A1F"
INK = "#434343"

PLAYED = P.reels_played()
assert PLAYED[1] == P.SWIPE_AT and PLAYED[0] == P.REELS[0][2]


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


def mmss(s):
    return f"0:{s:02d}"


# ------------------------------------------------------------------ the phone
K = 1.25
PX, PY, PH = 48, 8, 724
SW, SH = 368, (PH - 24) / K
PW = SW * K + 24
NAV = 56


def _scene_cricket(y):
    return (f'<rect x="0" y="{y}" width="{SW}" height="{SH}" fill="url(#rlg1)"/>'
            f'<rect x="{SW / 2 - 34}" y="{y + 190}" width="68" height="250" rx="6" fill="#D9C28A"/>'
            + "".join(f'<rect x="{SW / 2 - 16 + i * 14}" y="{y + 196}" width="5" height="46" '
                      'rx="2" fill="#fff"/>' for i in range(3))
            + f'<circle cx="{SW / 2 + 70}" cy="{y + 330}" r="11" fill="#C62828"/>'
            + f'<rect x="{SW / 2 - 110}" y="{y + 96}" width="220" height="50" rx="12" '
              'fill="rgba(0,0,0,.55)"/>'
            + _t(SW / 2, y + 128, "6 needed off 1 ball", 17, 800, "#fff", "middle"))


def _scene_kitchen(y):
    noodles = "".join(
        f'<path d="M{110 + i * 14} {y + 268}q10 -16 20 0t20 0t20 0" fill="none" '
        'stroke="#F7C948" stroke-width="5" stroke-linecap="round"/>' for i in range(6))
    return (f'<rect x="0" y="{y}" width="{SW}" height="{SH}" fill="url(#rlg2)"/>'
            f'<ellipse cx="{SW / 2}" cy="{y + 290}" rx="118" ry="44" fill="#2B2B2B"/>'
            f'<rect x="{SW / 2 + 108}" y="{y + 280}" width="96" height="16" rx="8" fill="#2B2B2B"/>'
            + noodles
            + f'<path d="M{SW / 2 - 60} {y + 360}q20 -40 40 0q20 -50 40 0q20 -40 40 0" '
              'fill="#FF8A00" opacity=".9"/>'
            + f'<rect x="{SW / 2 - 124}" y="{y + 110}" width="248" height="54" rx="12" '
              'fill="#fff"/>'
            + _t(SW / 2, y + 145, "5 MINUTE MAGGI HACK", 19, 900, "#C1440E", "middle"))


def _scene_pets(y):
    cx, cy = SW / 2 - 40, y + 270
    return (f'<rect x="0" y="{y}" width="{SW}" height="{SH}" fill="url(#rlg3)"/>'
            f'<path d="M{cx - 58} {cy - 40}l18 -58l30 42zM{cx + 58} {cy - 40}l-18 -58l-30 42z" '
            'fill="#F2A65A"/>'
            f'<circle cx="{cx}" cy="{cy}" r="70" fill="#F2A65A"/>'
            f'<circle cx="{cx - 24}" cy="{cy - 10}" r="9" fill="#2B2B2B"/>'
            f'<circle cx="{cx + 24}" cy="{cy - 10}" r="9" fill="#2B2B2B"/>'
            f'<path d="M{cx - 8} {cy + 18}l8 8l8 -8" fill="none" stroke="#2B2B2B" stroke-width="3"/>'
            f'<rect x="{cx - 20}" y="{cy + 96}" width="130" height="34" rx="17" '
            f'transform="rotate(-8 {cx + 45} {cy + 113})" fill="#3E9E4B"/>')


SCENES = [_scene_cricket, _scene_kitchen, _scene_pets]


def _icons(y):
    x = SW - 34
    heart = (f'<path d="M{x} {y + 18}c-4 -8 -18 -8 -18 3c0 9 18 18 18 18s18 -9 18 -18'
             f'c0 -11 -14 -11 -18 -3z" fill="none" stroke="#fff" stroke-width="2.6"/>')
    bubble = (f'<path d="M{x - 15} {y + 92}a16 15 0 1 1 7 12l-9 3z" fill="none" '
              'stroke="#fff" stroke-width="2.6"/>')
    plane = (f'<path d="M{x - 16} {y + 150}l34 -14l-12 32l-6 -12z" fill="none" '
             'stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>')
    return (heart + _t(x, y + 56, "12.4K", 12, 700, "#fff", "middle")
            + bubble + _t(x, y + 124, "231", 12, 700, "#fff", "middle")
            + plane
            + "".join(f'<circle cx="{x}" cy="{y + 196 + i * 7}" r="2.4" fill="#fff"/>'
                      for i in range(3)))


def _reel(i):
    handle, title, secs, _liked = P.REELS[i]
    y = i * SH
    base = SH - NAV - 18
    fx = 62 + len(handle) * 8.2
    return (f'<g class="rlreel rlreel{i + 1}">'
            + SCENES[i](y)
            + f'<rect x="0" y="{y + base - 120}" width="{SW}" height="140" fill="url(#rlfade)"/>'
            + _icons(y + 250)
            + f'<circle cx="30" cy="{y + base - 76}" r="15" fill="#fff" opacity=".9"/>'
            + _t(30, y + base - 71, handle[0].upper(), 14, 800, "#333", "middle")
            + _t(54, y + base - 71, handle, 14.5, 700, "#fff")
            + f'<rect x="{fx}" y="{y + base - 88}" width="58" height="24" '
              'rx="7" fill="none" stroke="#fff" stroke-width="1.4"/>'
            + _t(fx + 29, y + base - 71, "Follow", 12.5, 700, "#fff", "middle")
            + _t(18, y + base - 42, title, 14, 500, "#fff")
            + _t(18, y + base - 18, "♫ original audio", 12.5, 500, "#EDEDED")
            + '</g>')


def _nav():
    y = SH - NAV
    out = f'<rect x="0" y="{y}" width="{SW}" height="{NAV}" fill="#000"/>'
    xs = [36 + i * ((SW - 72) / 4) for i in range(5)]
    out += (f'<path d="M{xs[0] - 11} {y + 30}l11 -10l11 10v11h-22z" fill="none" '
            'stroke="#fff" stroke-width="2.2"/>'
            f'<circle cx="{xs[1] - 2}" cy="{y + 27}" r="8" fill="none" stroke="#fff" stroke-width="2.2"/>'
            f'<path d="M{xs[1] + 4} {y + 33}l6 6" stroke="#fff" stroke-width="2.2"/>'
            f'<rect x="{xs[2] - 12}" y="{y + 16}" width="24" height="24" rx="7" fill="none" '
            'stroke="#fff" stroke-width="2.4"/>'
            f'<path d="M{xs[2] - 3} {y + 23}v10l8 -5z" fill="#fff"/>'
            f'<rect x="{xs[3] - 11}" y="{y + 18}" width="22" height="20" rx="4" fill="none" '
            'stroke="#fff" stroke-width="2.2"/>'
            f'<circle cx="{xs[4]}" cy="{y + 28}" r="11" fill="#9A7BD1"/>')
    return out


def _bars():
    """Instagram's thin progress bar along the bottom, filled to how far the
    reel on screen has played on this press."""
    y = SH - NAV - 4
    out = f'<rect x="0" y="{y}" width="{SW}" height="3" fill="rgba(255,255,255,.3)"/>'
    for i in range(3):
        out += (f'<rect class="rlpb rlpb{i + 1}" x="0" y="{y}" width="{SW}" height="3" '
                'fill="#fff"/>')
    return out


def phone():
    strip = "".join(_reel(i) for i in range(3))
    return (f'<g class="wyphone">'
            f'<rect x="{PX}" y="{PY}" width="{PW}" height="{PH}" rx="46" fill="#101412"/>'
            f'<g transform="translate({PX + 12},{PY + 12}) scale({K})">'
            f'<clipPath id="rlscreen"><rect x="0" y="0" width="{SW}" height="{SH}" rx="28"/>'
            '</clipPath>'
            '<g clip-path="url(#rlscreen)">'
            f'<rect x="0" y="0" width="{SW}" height="{SH}" fill="#000"/>'
            f'<g class="rlstrip">{strip}</g>'
            + _t(26, 22, "9:41", 14, 600, "#fff")
            + _t(20, 60, "Reels", 22, 800, "#fff")
            + f'<rect x="{SW - 44}" y="42" width="24" height="20" rx="5" fill="none" '
              'stroke="#fff" stroke-width="2.2"/>'
              f'<circle cx="{SW - 32}" cy="52" r="5" fill="none" stroke="#fff" stroke-width="2.2"/>'
            + _bars() + _nav()
            + f'<g class="rlswipe"><circle cx="{SW / 2}" cy="{SH - 170}" r="22" '
              'fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="2"/>'
              f'<path d="M{SW / 2} {SH - 206}v-60m-12 12l12 -12l12 12" stroke="#fff" '
              'stroke-width="3" fill="none" stroke-linecap="round"/></g>'
            + '</g></g></g>')


# ------------------------------------------------------------------ the rail
RX, RY, RDY = 600, 46, 48
RAIL = [
    "Instagram Reels. Reel 1 plays all the way to the end.",
    f"Reel 2 starts. At {mmss(P.SWIPE_AT)} you do not like it.",
    "You swipe up. The rest of reel 2 never plays. Reel 3 starts.",
    "Did the feed stop? No. Only reel 2 was cut short.",
    "Skip the rest of this one. Go back to the top for the next.",
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


# ------------------------------------------------------------------ the three reels
TY, TW, TH, TGAP, TX0 = 270, 296, 150, 20, 640
TRK_Y, TRK_H = TY + 84, 16


def _tstate(i, k):
    """What reel tile i shows on press k: wait, play, cut or done."""
    if i == 0:
        return "done"
    if i == 1:
        return "wait" if k < 2 else ("play" if k == 2 else "cut")
    return "wait" if k < 3 else ("play" if k == 3 else "done")


def tiles():
    out = '<g class="wytiles">'
    for i, (handle, title, secs, _liked) in enumerate(P.REELS):
        x = TX0 + i * (TW + TGAP)
        tw = TW - 36
        cut = PLAYED[i] / secs
        col = AMBER if i == 1 else OK
        playw = tw * .25 if i == 2 else tw * cut
        out += (f'<g class="wyt wyt{i + 1}">'
                f'<rect class="wyt-box" x="{x}" y="{TY}" width="{TW}" height="{TH}" rx="18"/>'
                + _t(x + 18, TY + 30, f"Reel {i + 1}  ·  {mmss(secs)}", 17, 700, "#8B98A5")
                + _t(x + 18, TY + 60, title, 20, 800, "#2B3138")
                + f'<rect x="{x + 18}" y="{TRK_Y}" width="{tw}" height="{TRK_H}" rx="8" '
                  'fill="#EEF2F6"/>'
                + f'<rect class="wyf wyf-play" x="{x + 18}" y="{TRK_Y}" width="{playw:.1f}" '
                  f'height="{TRK_H}" rx="8" fill="{col}"/>'
                + f'<rect class="wyf wyf-done" x="{x + 18}" y="{TRK_Y}" width="{tw * cut:.1f}" '
                  f'height="{TRK_H}" rx="8" fill="{col}"/>'
                + (f'<rect class="wyf wyf-never" x="{x + 18 + tw * cut:.1f}" y="{TRK_Y - 2}" '
                   f'width="{tw * (1 - cut):.1f}" height="{TRK_H + 4}" rx="8" fill="#fff" '
                   f'stroke="{BAD}" stroke-width="2" stroke-dasharray="6 5"/>' if i == 1 else ""))
        for st, text, c2 in (("wait", "not yet", "#A7B0BA"),
                             ("play", f"playing, {mmss(P.SWIPE_AT)}" if i == 1 else "playing from 0:00", "#6B7A86"),
                             ("cut", "rest of it never played", BAD),
                             ("done", "watched to the end", OK)):
            out += (f'<g class="wys wys-{st}">'
                    + _t(x + 18, TY + 132, text, 20, 700, c2) + '</g>')
        out += '</g>'
    return out + '</g>'


# ------------------------------------------------------------------ the log
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
    got = []
    for i, (a, b, _t2, _c) in enumerate(rows):
        taken = {got[j] for j, (a2, b2, _x, _y) in enumerate(rows[:i])
                 if not (b2 < a or a2 > b)}
        n = 0
        while n in taken:
            n += 1
        got.append(n)
    return got


LOG = [(1, 4, "Reel 1: watched to the end", OK),
       (2, 4, f"Reel 2: swiped away at {mmss(P.SWIPE_AT)}", AMBER),
       (3, 4, "Reel 3: starts from 0:00", "#6B7A86"),
       (4, 4, "The app is still open. The feed carries on.", OK),
       (4, 4, "Closing the app would stop the whole feed.", "#8B98A5")]


def log():
    return _log("wy", "What happened", LOG)


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
            + hdr(x0 + 40, y0, "every reel", " in the feed:", "#D6453D")
            + hdr(x0 + 80, ib, "if", " you do not like it:", "#D6453D")
            + blk(x0 + 116, b_skip, 440, "swipe up, go to the next reel",
                  "#FFF3E0", "#E8B45F", "#8A5200")
            + blk(x0 + 76, b_add, 480, "watch the rest of it")
            + blk(x0 + 34, b_out, 522, "close the app")
            + f'<path class="wyskip" d="M{x0 + 556} {b_skip + H / 2}H{x0 + 640}'
              f'V{y0 - 9}H{x0 + 470}" fill="none" stroke="{ORANGE}" stroke-width="4" '
              'marker-end="url(#wyarr)" pathLength="100"/>'
            + f'<circle cx="{x0 + 556}" cy="{b_skip + H / 2}" r="6" fill="{ORANGE}"/>'
            + _t(x0 + 654, y0 + 60, "back to the top", 21, 800, AMBER, cls="wyskip-t")
            + '</g>')


def defs():
    return ('<defs>'
            '<linearGradient id="rlg1" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#1E5E2F"/><stop offset="1" stop-color="#3E9E4B"/>'
            '</linearGradient>'
            '<linearGradient id="rlg2" x1="0" y1="0" x2="1" y2="1">'
            '<stop offset="0" stop-color="#F6B26B"/><stop offset="1" stop-color="#C1440E"/>'
            '</linearGradient>'
            '<linearGradient id="rlg3" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#9CC9F5"/><stop offset="1" stop-color="#4F86C6"/>'
            '</linearGradient>'
            '<linearGradient id="rlfade" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#000" stop-opacity="0"/>'
            '<stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient>'
            '<marker id="wyarr" viewBox="0 0 10 10" refX="7" refY="5" '
            'markerWidth="6" markerHeight="6" orient="auto">'
            f'<path d="M0 0L10 5L0 10z" fill="{ORANGE}"/></marker>'
            '</defs>')


def body():
    svg = (f'<svg class="fig wyfig" viewBox="0 0 {VB_W} {VB_H}" '
           'xmlns="http://www.w3.org/2000/svg" role="img" '
           'aria-label="Instagram Reels. Reel 1 plays to the end. Reel 2 is swiped '
           'away after 3 seconds and the rest of it never plays. Reel 3 starts from '
           'the beginning and the feed carries on.">'
           + defs() + phone() + rail() + tiles() + log() + shape() + '</svg>')
    return f'<div class="wywrap">{svg}</div>'


BOX = {"wait": ("#FBFCFD", "#D8E2EA", True), "play": ("#F7FBFD", "#A9D3F2", False),
       "cut": ("#FDF6F5", "#E8A9A5", False), "done": ("#EFFAF3", "#9FD8B8", False)}
REEL_AT = {1: 0, 2: 1, 3: 2, 4: 2, 5: 2}
BAR = {1: [1, 0, 0], 2: [1, PLAYED[1] / P.REELS[1][2], 0],
       3: [1, PLAYED[1] / P.REELS[1][2], .25], 4: [1, 1, 1], 5: [1, 1, 1]}


def css():
    r = [
        ".wywrap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}",
        ".wyfig{width:100%;height:100%;display:block;font-family:var(--sans)}",
        ".wyfig *{transform-box:view-box}",
        ".wyphone{transition:opacity 320ms var(--ease-out)}",
        ".rlstrip{transition:transform 520ms var(--ease-in-out)}",
        ".wyfig .rlpb{opacity:0;transform-box:fill-box;transform-origin:0 50%;"
        "transition:transform 400ms var(--ease-out)}",
        ".rlswipe{opacity:0;transition:opacity 200ms var(--ease-out),"
        "transform 520ms var(--ease-in-out)}",
        at(2, ".rlswipe") + "{opacity:1}",
        at(3, ".rlswipe") + "{opacity:0;transform:translateY(-120px)}",
        ".wyr-ghost{fill:none;stroke:#C5CFD7;stroke-width:1.6;stroke-dasharray:6 5;"
        "transition:opacity 200ms var(--ease-out)}",
        ".wyr-dot{fill:#C5CFD7;transition:fill 200ms var(--ease-out)}",
        ".wyr-t{opacity:0;transition:opacity 260ms var(--ease-out)}",
        ".wyt-box{fill:#FBFCFD;stroke:#D8E2EA;stroke-width:2.5;"
        "transition:fill 240ms var(--ease-out),stroke 240ms var(--ease-out)}",
        ".wys,.wyf{opacity:0;transition:opacity 240ms var(--ease-out)}",
        ".wylg{opacity:0;transition:opacity 260ms var(--ease-out)}",
        ".wylog{transition:opacity 260ms var(--ease-out)}",
        ".wyshape{opacity:0;transition:opacity 320ms var(--ease-out)}",
        ".wyskip{stroke-dasharray:100;stroke-dashoffset:100;"
        "transition:stroke-dashoffset 900ms var(--ease-in-out) 300ms}",
        ".wyskip-t{opacity:0;transition:opacity 260ms var(--ease-out) 1100ms}",
    ]
    for k in range(1, STEPS + 1):
        r.append(at(k, ".rlstrip") + f"{{transform:translateY({-REEL_AT[k] * SH:.1f}px)}}")
        on = REEL_AT[k] + 1
        r.append(at(k, f".rlpb{on}") + f"{{opacity:1;transform:scaleX({BAR[k][on - 1]:.3f})}}")
        r.append(at(k, f".wylg-{k}") + "{opacity:1}")
        for i in range(3):
            st = _tstate(i, k)
            fill, stroke, dash = BOX[st]
            n = i + 1
            r.append(at(k, f".wyt{n} .wys-{st}") + "{opacity:1}")
            r.append(at(k, f".wyt{n} .wyt-box") + f"{{fill:{fill};stroke:{stroke}"
                     + (";stroke-dasharray:8 7" if dash else "") + "}")
            if st == "play":
                r.append(at(k, f".wyt{n} .wyf-play") + "{opacity:1}")
            if st in ("done", "cut"):
                r.append(at(k, f".wyt{n} .wyf-done") + "{opacity:1}")
            if st == "cut":
                r.append(at(k, f".wyt{n} .wyf-never") + "{opacity:1}")
        r.append(fr(k, f".wyr{k} .wyr-t") + "{opacity:1}")
        r.append(fr(k, f".wyr{k} .wyr-ghost") + "{opacity:0}")
        r.append(fr(k, f".wyr{k} .wyr-dot") + "{fill:#9AA7B1}")
        r.append(at(k, f".wyr{k} .wyr-dot") + "{fill:#006DAF}")
        r.append(at(k, f".wyr{k} .wyr-t") + "{fill:#006DAF;font-weight:700}")
    r += [
        at(5, ".wyphone") + "{opacity:.3}",
        at(5, ".wylog") + "{opacity:0}",
        at(5, ".wyshape") + "{opacity:1}",
        at(5, ".wyskip") + "{stroke-dashoffset:0}",
        at(5, ".wyskip-t") + "{opacity:1}",
        "@media (prefers-reduced-motion:reduce){.wyfig *{transition:none !important}}",
        "@media print{.wyshape,.wyskip-t,.wyr-t{opacity:1}.wyskip{stroke-dashoffset:0}}",
    ]
    return "\n".join(r)
