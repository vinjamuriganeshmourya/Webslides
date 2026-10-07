"""Two strings, laid out letter by letter, compared one pair per press.

Used by the explainer (slide 19's own example) and by every level of the
machine, so the room sees one picture of "how Python compares" all session.

Each letter is a tile with its number under it. On each press one pair is
looked at: a pair that is the same turns green and stays green; the pair that
differs decides, and every letter after it greys out and stays grey, because
Python never looked at it. When one string runs out first, an empty dashed
tile says so.

Everything here is CSS on the shared data-anim engine. No script.
"""
import html

import panels as P

OPS = {"<": "&lt;", ">": "&gt;", "<=": "&lt;=", ">=": "&gt;=", "==": "==", "!=": "!="}
SAY_OP = {"<": "less than", ">": "more than", "<=": "less than or equal to",
          ">=": "more than or equal to"}


def _tile(ch, pos):
    if ch is None:
        return (f'<span class="cw-t cw-none cw-p{pos}"><b>&nbsp;</b>'
                '<i>nothing</i></span>')
    shown = "&nbsp;" if ch == " " else html.escape(ch)
    return (f'<span class="cw-t cw-p{pos}"><b>{shown}</b>'
            f'<i>{ord(ch)}</i></span>')


def _row(s, width, who):
    # an empty tile only right after the last letter of the shorter string
    tiles = "".join(_tile(s[i], i) for i in range(len(s)))
    if len(s) < width:
        tiles += _tile(None, len(s))
    return (f'<div class="cw-row cw-{who}"><code class="cw-q">"{html.escape(s)}"</code>'
            f'<span class="cw-tiles">{tiles}</span></div>')


def captions(a, op, b):
    """One sentence per step of the walk, in the walk's order."""
    out = []
    steps = P.compare_walk(a, b)
    ans = P.walk_says(a, op, b)
    for st in steps:
        i = st[1]
        if st[0] == "same":
            out.append(f"{a[i]} and {b[i]}: {ord(a[i])} and {ord(b[i])}. "
                       "The same, so look at the next pair.")
        elif st[0] == "diff":
            x, y = ord(a[i]), ord(b[i])
            if op in ("==", "!="):
                tail = "Different, so the two strings are not equal."
            else:
                tail = (f"Different, so this pair decides. Is {x} {SAY_OP[op]} {y}? "
                        f"{'Yes' if ans else 'No'}.")
            out.append(f"{a[i]} and {b[i]}: {x} and {y}. {tail}")
        else:
            who = st[2]
            short, long_ = (a, b) if who == "a" else (b, a)
            if who == "both":
                out.append("Both ran out together, so the two strings are equal.")
            else:
                out.append(f'"{short}" has no letters left. "{long_}" still has '
                           f"{long_[i]}. The shorter one is smaller. "
                           f"{'True' if ans else 'False'}.")
    return out


def widget(uid, a, op, b, stage, first, extra_css, upto=None):
    """HTML for the pair, plus CSS rules appended to `extra_css`.

    `first` is the press on which the first pair is looked at; the numbers
    appear on that press too. `upto` is the last press the stage has for this
    pair, so a walk that decides early holds its end state until then.
    Returns (html, number of presses the walk takes, the answer)."""
    steps = P.compare_walk(a, b)
    ans = P.walk_says(a, op, b)
    width = max(len(a), len(b))
    caps = captions(a, op, b)
    n = len(steps)
    last = first + n - 1
    upto = last if upto is None else upto
    assert upto >= last

    def rng(k0, sel):
        return ",".join(f".{stage}.an-{k} #{uid} {sel}" for k in range(k0, upto + 1))

    def at(k, sel):
        return f".{stage}.an-{k} #{uid} {sel}"

    cap_html = "".join(f'<p class="cw-cap cw-c{j}">{html.escape(c)}</p>'
                       for j, c in enumerate(caps))
    body = (f'<div class="cw" id="{uid}">'
            + _row(a, width, "a")
            + f'<span class="cw-op">{OPS[op]}</span>'
            + _row(b, width, "b")
            + f'<div class="cw-caps">{cap_html}'
            f'<span class="cw-ans cw-ans-{str(ans).lower()}">{ans}</span></div>'
            + '</div>')

    r = extra_css
    r.append(rng(first, ".cw-t i") + "{opacity:1}")
    hot = ("{background:#EAF4FB;border-color:#006DAF;"
           "box-shadow:0 0 0 4px rgba(0,109,175,.18);transform:translateY(-4px)}")
    decide = ("{background:#FFF4E5;border-color:#E08A12;"
              "box-shadow:0 0 0 4px rgba(224,138,18,.22);transform:translateY(-4px)}")
    for j, st in enumerate(steps):
        k = first + j
        pos = st[1]
        if st[0] == "same":
            r.append(at(k, f".cw-c{j}") + "{opacity:1;transform:none}")
            r.append(at(k, f".cw-p{pos}") + hot)
            # once passed, a pair that matched stays green
            if k < upto:
                r.append(rng(k + 1, f".cw-p{pos}") + "{background:#EFFAF3;border-color:#9FD8B8}")
            continue
        # the deciding press holds to the end: the pair, the answer, and every
        # letter after it greyed out, because Python never looked at it
        r.append(rng(k, f".cw-c{j}") + "{opacity:1;transform:none}")
        r.append(rng(k, f".cw-p{pos}") + decide)
        r.append(rng(k, ".cw-ans") + "{opacity:1;transform:none}")
        r.append(rng(k, ".cw-op") + "{color:#E08A12}")
        for q in range(pos + 1, width + 1):
            r.append(rng(k, f".cw-p{q}") + "{opacity:.28}")
        if pos + 1 < width:
            r.append(rng(k, ".cw-dead") + "{opacity:1}")
    dead = ('<p class="cw-dead"><span class="cw-dead-t"></span>grey: Python never '
            'looked at these letters</p>') if steps[-1][0] == "diff" and steps[-1][1] + 1 < width else ""
    body = body.replace('<div class="cw-caps">', dead + '<div class="cw-caps">')
    return body, n, ans


CSS = r"""
/* ---- two strings, one pair per press ---- */
.cw{display:grid;grid-template-columns:auto;justify-items:start;gap:10px;min-width:0}
.cw-row{display:flex;align-items:center;gap:18px}
.cw-q{flex:0 0 5.6em;font:700 22px var(--mono);color:#12633F}
.cw-tiles{display:flex;gap:10px}
.cw-t{display:flex;flex-direction:column;align-items:center;justify-content:center;
  width:66px;height:84px;border-radius:12px;border:2px solid #D5DEE5;background:#fff;
  transition:background-color 220ms var(--ease-out),border-color 220ms var(--ease-out),
  box-shadow 220ms var(--ease-out),transform 220ms var(--ease-out),opacity 220ms var(--ease-out)}
.cw-t b{font:800 32px/1 var(--mono);color:#1B2530}
.cw-t i{margin-top:6px;font:700 17px var(--mono);font-style:normal;color:#006DAF;opacity:0;
  transition:opacity 220ms var(--ease-out)}
.cw-none{border-style:dashed;background:#FBFCFD}
.cw-none i{font:700 13px var(--sans);color:#B5650D}
.cw-op{padding-left:2.2em;font:800 30px var(--mono);
  color:#434343;transition:color 220ms var(--ease-out)}
.cw-caps{display:grid;align-items:start;min-height:4.4em;width:100%;margin-top:6px}
.cw-cap{grid-area:1/1;margin:0;font:600 19px/1.45 var(--sans);color:#434343;opacity:0;
  transform:translateY(6px);transition:opacity 220ms var(--ease-out),transform 220ms var(--ease-out)}
.cw-ans{grid-area:2/1;justify-self:start;margin-top:10px;padding:6px 18px;border-radius:999px;
  font:800 24px var(--mono);opacity:0;transform:scale(.96);
  transition:opacity 220ms var(--ease-out),transform 220ms var(--ease-out)}
.cw-ans-true{background:#EFFAF3;color:#12633F;border:2px solid #9FD8B8}
.cw-ans-false{background:#FDF1F1;color:#B3261E;border:2px solid #E8A9A5}
body.present .cw-q{font-size:clamp(16px,1.9vw,34px)}
body.present .cw-t{width:clamp(52px,5.8vw,110px);height:clamp(70px,7.6vw,142px)}
body.present .cw-tiles{gap:clamp(8px,.8vw,16px)}
body.present .cw-t b{font-size:clamp(26px,3.1vw,56px)}
body.present .cw-t i{font-size:clamp(13px,1.5vw,27px)}
body.present .cw-none i{font-size:clamp(10px,.95vw,16px)}
body.present .cw-op{font-size:clamp(22px,2.5vw,44px)}
body.present .cw-cap{font-size:clamp(15px,1.6vw,28px)}
body.present .cw-ans{font-size:clamp(18px,2vw,36px)}
.cw-dead{margin:2px 0 0;display:flex;align-items:center;gap:8px;font:600 15px var(--sans);
  color:#7A8794;opacity:0;transition:opacity 220ms var(--ease-out)}
.cw-dead-t{width:18px;height:18px;border-radius:5px;border:2px solid #D5DEE5;opacity:.5}
body.present .cw-dead{font-size:clamp(11px,1.15vw,19px)}
@media (prefers-reduced-motion:reduce){.cw *{transition:none !important}}
"""
