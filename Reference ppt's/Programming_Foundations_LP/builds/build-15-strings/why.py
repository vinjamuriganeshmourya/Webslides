"""The second hook: why a string method exists at all.

After the classroom quiz the old plan went straight to `isdigit`. A method
arriving out of nowhere is a name to memorise; the room has to want it first.
This is the transcript's own scenario, and it is the one the whole second half
hangs off:

    you set a PIN on your phone. Before it saves it, the app has to know that
    every character you typed is a digit. How does it check?

Five presses, and the argument is the length of two programs side by side:

    1   the PIN screen. Four empty boxes and a keypad.
    2   somebody types 47a8 and the app refuses it. How did it know?
    3   the long way: a loop, and inside it a comparison against every digit
    4   the count. Ten checks per character, forty for the PIN, nine lines
    5   the short way. Two lines, and the thing that did it has a name

The phone is drawn once and reacts to the press through `.an-N`, so nothing is
redrawn between beats: the digits arrive in the boxes that were already there
and the banner fades in under them.

**The long program is real Python and it runs.** `panels.why_long_out` is the
same loop, in the same order, and `check_answers.py` asserts its answer agrees
with `isdigit`. A program on a slide that nobody ran is how a plan ends up
teaching a bug.
"""
import html

import codecard as CODE
import panels as P

STEPS = 5
LABELS = ("the PIN screen|the app says no|the long way|"
          "how long it is|the short way")

# ------------------------------------------------------------------ the phone
VB_W, VB_H = 460, 520

DEV_X, DEV_Y, DEV_W, DEV_H = 70, 10, 320, 500
SCR_X, SCR_Y, SCR_W, SCR_H = 82, 22, 296, 476

CARD_X, CARD_W = 98, 264
CARD_Y, CARD_H = 116, 126

PIN_W, PIN_H, PIN_GAP = 46, 54, 14
BANNER_Y, BANNER_H = 252, 36

KEY_R = 22
KEY_COLS = (130, 230, 330)
KEY_ROWS = (312, 356, 400, 444)

INK = "#111B21"
MUTED = "#6B7784"
TINT = "#F2F6F9"
LINE = "#E2E9EF"
RED = "#C7454E"


def _status():
    """The status bar. A mock without one reads as a drawing of a phone."""
    right = SCR_X + SCR_W - 18
    bars = "".join(
        f'<rect x="{right - 74 + i * 5}" y="{SCR_Y + 22 - 3 - i * 2.4:.1f}" '
        f'width="3.2" height="{4 + i * 2.4:.1f}" rx="1.2" fill="{INK}"/>'
        for i in range(4))
    return (
        f'<text x="{SCR_X + 20}" y="{SCR_Y + 24}" '
        f'style="font:700 12px var(--sans)" fill="{INK}">9:41</text>'
        + bars
        # the wifi fan: two arcs and a dot, drawn about one centre. A single
        # arc with a dot under it reads as a squiggle, not as wifi.
        + f'<g fill="none" stroke="{INK}" stroke-width="1.9" '
          'stroke-linecap="round">'
          f'<path d="M{right - 52},{SCR_Y + 16.5} a9.5 9.5 0 0 1 13,0"/>'
          f'<path d="M{right - 48.6},{SCR_Y + 20} a5.2 5.2 0 0 1 6.2,0"/>'
          '</g>'
        + f'<circle cx="{right - 45.5}" cy="{SCR_Y + 23.4}" r="1.7" '
          f'fill="{INK}"/>'
        # the battery
        + f'<rect x="{right - 26}" y="{SCR_Y + 13}" width="22" height="11" '
          f'rx="3" fill="none" stroke="{INK}" stroke-width="1.6" '
          'opacity=".55"/>'
        + f'<rect x="{right - 24}" y="{SCR_Y + 15}" width="14" height="7" '
          f'rx="1.6" fill="{INK}"/>'
        + f'<path d="M{right - 3},{SCR_Y + 16.5} v4" stroke="{INK}" '
          'stroke-width="1.8" opacity=".55"/>')


def _header():
    """The app bar: a back chevron, the screen's name, nothing else."""
    y = SCR_Y + 34
    return (
        f'<rect x="{SCR_X}" y="{y}" width="{SCR_W}" height="44" '
        'fill="#FFFFFF"/>'
        f'<path d="M{SCR_X + 26},{y + 22} l9,-9 M{SCR_X + 26},{y + 22} '
        f'l9,9" fill="none" stroke="{INK}" stroke-width="2.4" '
        'stroke-linecap="round"/>'
        f'<text x="{SCR_X + SCR_W / 2}" y="{y + 27}" text-anchor="middle" '
        f'style="font:700 15px var(--sans)" fill="{INK}">Security</text>'
        f'<path d="M{SCR_X},{y + 44} H{SCR_X + SCR_W}" stroke="{LINE}" '
        'stroke-width="1.4"/>')


def _pinboxes():
    """Four boxes, and the characters that land in them on press 2. The one
    that is not a digit wears the red, because that single box is the reason
    the app has to look at every character rather than at the string."""
    typed = P.WHY_BAD
    bad = set(P.why_bad_index())
    total = len(typed) * PIN_W + (len(typed) - 1) * PIN_GAP
    x0 = CARD_X + (CARD_W - total) / 2
    out = ""
    for i, ch in enumerate(typed):
        x = x0 + i * (PIN_W + PIN_GAP)
        cls = "wypin" + (" wybad" if i in bad else "")
        out += (
            f'<g class="{cls}">'
            f'<rect class="wypb" x="{x:.0f}" y="{CARD_Y + 48}" '
            f'width="{PIN_W}" height="{PIN_H}" rx="11"/>'
            f'<text class="wypc" x="{x + PIN_W / 2:.0f}" '
            f'y="{CARD_Y + 48 + 36}" text-anchor="middle">'
            f'{html.escape(ch)}</text>'
            '</g>')
    return out


def _keypad():
    """A real keypad, because a PIN screen without one is a form. The keys do
    nothing: the room is watching the app decide, not typing."""
    keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '<']
    out = ""
    for k, lbl in enumerate(keys):
        if not lbl:
            continue
        cx = KEY_COLS[k % 3]
        cy = KEY_ROWS[k // 3]
        out += (f'<circle class="wykey" cx="{cx}" cy="{cy}" r="{KEY_R}"/>')
        if lbl == '<':
            out += (f'<path d="M{cx + 7},{cy - 6} l-11,6 l11,6 z" '
                    f'fill="{MUTED}"/>')
        else:
            out += (f'<text class="wykt" x="{cx}" y="{cy + 7}" '
                    f'text-anchor="middle">{lbl}</text>')
    return out


def phone():
    ok = P.WHY_PIN
    return (
        '<g class="wyphone">'
        f'<rect x="{DEV_X}" y="{DEV_Y}" width="{DEV_W}" height="{DEV_H}" '
        'rx="46" fill="#111B21"/>'
        f'<rect x="{DEV_X + 4}" y="{DEV_Y + 4}" width="{DEV_W - 8}" '
        f'height="{DEV_H - 8}" rx="42" fill="#2A343C"/>'
        f'<rect x="{SCR_X}" y="{SCR_Y}" width="{SCR_W}" height="{SCR_H}" '
        f'rx="34" fill="{TINT}"/>'
        + _status()
        + _header()
        # the card the PIN is typed into
        + f'<rect x="{CARD_X}" y="{CARD_Y}" width="{CARD_W}" '
          f'height="{CARD_H}" rx="16" fill="#FFFFFF" stroke="{LINE}" '
          'stroke-width="1.4"/>'
        + f'<text x="{CARD_X + 18}" y="{CARD_Y + 30}" '
          f'style="font:700 14px var(--sans)" fill="{INK}">'
          'Set a 4 digit PIN</text>'
        + _pinboxes()
        # the refusal, on press 2
        + '<g class="wyerr">'
          f'<rect x="{CARD_X}" y="{BANNER_Y}" width="{CARD_W}" '
          f'height="{BANNER_H}" rx="10" fill="#FBF1F1" stroke="{RED}" '
          'stroke-width="1.4"/>'
          f'<circle cx="{CARD_X + 22}" cy="{BANNER_Y + 18}" r="8" '
          f'fill="{RED}"/>'
          f'<text x="{CARD_X + 22}" y="{BANNER_Y + 22.5}" '
          'text-anchor="middle" style="font:700 11px var(--sans)" '
          'fill="#FFFFFF">!</text>'
          f'<text x="{CARD_X + 38}" y="{BANNER_Y + 22}" '
          f'style="font:600 12px var(--sans)" fill="{RED}">'
          'Digits only. Try again.</text>'
          '</g>'
        # the hint that is up from the start, so the room knows the rule
        + '<g class="wyask">'
          f'<text x="{CARD_X + 2}" y="{BANNER_Y + 22}" '
          f'style="font:600 12px var(--sans)" fill="{MUTED}">'
          f'A PIN like {ok} is fine. What about this one?</text>'
          '</g>'
        + _keypad()
        + f'<rect x="{SCR_X + SCR_W / 2 - 46}" y="{SCR_Y + SCR_H - 16}" '
          'width="92" height="5" rx="2.5" fill="#B9C3CB"/>'
        # the notch, over everything
        + f'<rect x="{SCR_X + SCR_W / 2 - 44}" y="{SCR_Y + 6}" width="88" '
          'height="24" rx="12" fill="#0B0F12"/>'
        '</g>')


# ------------------------------------------------------------- the right side
def _code(src, tab, hi=()):
    return CODE.card(src, tab, hi=hi)


def _chips(items):
    return ('<div class="wychips">'
            + "".join(f'<span class="wychip"><b>{a}</b>{b}</span>'
                      for a, b in items)
            + '</div>')


def body():
    long_n, short_n = P.why_lines()
    checks = P.why_checks()
    steps = [
        # 1. the screen, and the two things the app has to be sure of. The
        # checklist is not decoration: the easy one is ticked so the room can
        # see that the hard one is the only thing left, and without it this
        # press is two sentences on an empty half of a card.
        ('<p class="lede">You set a PIN on your phone. Before the app saves '
         'it, it has to be sure of <b>two</b> things.</p>'
         '<div class="wyreq"><div class="wyr done">'
         '<span class="wyrm">&#10003;</span>'
         f'<div><b>Four characters long</b><span>len(pin) == '
         f'{len(P.WHY_PIN)}. One line, and you already know it.</span></div>'
         '</div><div class="wyr todo">'
         '<span class="wyrm">?</span>'
         '<div><b>Every one of them a digit</b>'
         '<span>No character in it may be a letter or a space.</span></div>'
         '</div></div>'
         '<p class="mthask">The length is easy. How would you check the '
         'second one?</p>'),
        # 2. the refusal
        (f'<p class="lede">Somebody types <b>{P.WHY_BAD}</b>. There is a '
         'letter in the middle of it, so the app refuses it.</p>'
         '<p class="mthask">It said no in under a second. What did it '
         'actually do to find out?</p>'
         '<p class="cap">Take two answers. Somebody will say <em>check each '
         'one</em>. That is the right answer, and the next press is what it '
         'costs.</p>'),
        # 3. the long way
        ('<p class="lede">Go through the characters one at a time. For each '
         'one, ask whether it is a digit, and a character is a digit only if '
         'it is one of ten things.</p>'
         + _code(P.WHY_LONG_SRC, 'check_pin.py', hi=(4, 5, 6, 7))
         + f'<p class="cap">It prints <b>{P.why_long_out()}</b>, which is the '
         'right answer. Read line 4 out loud and stop halfway.</p>'),
        # 4. what it costs
        (f'<p class="lede">Ten comparisons for one character. Four '
         f'characters, so <b>{checks}</b> comparisons, and '
         f'<b>{long_n} lines</b> of program.</p>'
         + _chips([(str(len(P.WHY_BAD)), 'characters'),
                   ('10', 'checks each'),
                   (str(checks), 'comparisons'),
                   (str(long_n), 'lines')])
         + '<p class="mthask">Every app on your phone checks a PIN. Do you '
         'think they all wrote this?</p>'),
        # 5. the short way, and the name
        ('<p class="lede">Python already knows this job. Somebody wrote it '
         'once, and it comes with the language.</p>'
         + _code(P.WHY_SHORT_SRC, 'check_pin.py', hi=(2,))
         + f'<p class="lede">Same answer, <b>{short_n} lines</b> instead of '
         f'<b>{long_n}</b>.</p>'
         '<div class="wyname"><span class="shape">a string method</span>'
         '<p>A job Python already knows how to do on a string. You write the '
         'string, a dot, and the name of the job. There are five of them '
         'today.</p></div>'),
    ]
    right = "".join(
        f'<div class="wystep wy{k}">{s}</div>' for k, s in enumerate(steps, 1))
    return ('<div class="p2 wyp2"><div class="wyleft">'
            f'<svg class="fig wyfig" viewBox="0 0 {VB_W} {VB_H}" '
            'xmlns="http://www.w3.org/2000/svg" role="img" '
            'aria-label="A phone asking for a four digit PIN, with a keypad '
            'under it and the app refusing a PIN that has a letter in it">'
            + phone() + '</svg></div>'
            f'<div class="wyright">{right}</div></div>')


def css():
    """One rule set per press. `an-N` is exclusive, so a state that survives
    into later presses names every press it survives into."""
    out = ['/* --- why a string method at all: the phone, per press --- */']
    # the typed characters and the refusal only exist from press 2
    later = ",".join(f'.wy.an-{k} .wypc' for k in range(2, STEPS + 1))
    out.append(later + '{opacity:1}')
    later = ",".join(f'.wy.an-{k} .wybad .wypb' for k in range(2, STEPS + 1))
    out.append(later + f'{{stroke:{RED};stroke-width:2.6;fill:#FBF1F1}}')
    later = ",".join(f'.wy.an-{k} .wybad .wypc' for k in range(2, STEPS + 1))
    out.append(later + f'{{fill:{RED}}}')
    later = ",".join(f'.wy.an-{k} .wyerr' for k in range(2, STEPS + 1))
    out.append(later + '{opacity:1}')
    later = ",".join(f'.wy.an-{k} .wyask' for k in range(2, STEPS + 1))
    out.append(later + '{opacity:0}')
    # the right column, one block per press
    for k in range(1, STEPS + 1):
        out.append(f'.wy.an-{k} .wy{k}{{display:flex}}')
    return "\n".join(out)
