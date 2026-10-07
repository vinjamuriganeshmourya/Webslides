"""The second hook: why a loop inside a loop at all?

The second half opens on the reason the construct exists, not on its name.
The screen is the coding practice page the room uses every week, with the
number triangle on it.

    press 1   the question: print this pattern for any N
    press 2   last session's trick, "1 " * i. It runs, and the rows are wrong
    press 3   the long way: one print per row. Passes for 3, fails for 4
    press 4   what the long way costs for N = 100, as numbers
    press 5   the short way, in words: a loop for the rows, and inside it a
              loop that builds one row. The test cases wait for them.

Every output on the screen is produced by running the program in panels.py.
The code for the real answer is not on this card: worksheet task 2 is where
the room writes the inner range, so press 5 is the shape in plain words.
"""
import html

import codecard as CODE
import panels as P

STEPS = 5
LABELS = "the question|the one loop trick|the long way|what it costs|the shape"

RAIL = [
    "The question: print this pattern for any N.",
    "Last session's trick repeats a string. The rows come out wrong.",
    "Write every row by hand. It passes for 3 and fails for 4.",
    f"For N = {P.WHY_BIG}: {P.why_big_lines()} print lines and "
    f"{P.why_big_numbers():,} numbers to type.",
    "Each row is its own count, from 1 up to the row number.",
]


def esc(s):
    return html.escape(s)


def _out(lines):
    return esc("\n".join(s.rstrip() for s in lines))


def _tc(n, state, note):
    icon = {"ok": "&#10003;", "bad": "&#10007;", "wait": "?"}[state]
    return (f'<div class="wy-tc {state}"><span class="wy-ic">{icon}</span>'
            f'<b>Test case {n}</b><span>{esc(note)}</span></div>')


def _result(k, got, want, tcs):
    return (f'<div class="wy-res wy-r{k}">'
            '<div class="wy-cmp">'
            f'<div><span class="wy-lab">Your output</span><pre>{_out(got)}</pre></div>'
            f'<div><span class="wy-lab">Expected</span><pre>{_out(want)}</pre></div>'
            '</div><div class="wy-tcs">' + "".join(tcs) + '</div></div>')


def _shape():
    return ('<div class="wy-shape">'
            '<div class="wy-o"><span class="kw">loop</span> over the rows, 1 to N:'
            '<div class="wy-i"><span class="kw">loop</span> over one row, '
            '1 up to the row number:'
            '<div class="wy-b">add the number to the row</div></div>'
            '<div class="wy-b">print the row</div></div></div>')


def body():
    want3 = P.why_want(P.WHY_N)
    want4 = P.why_want(P.WHY_N2)
    try_out = P.why_try_out()
    long_out = P.why_long_out()
    sample = "\n".join(s.rstrip() for s in P.why_want(4))

    question = (
        '<div class="wy-q">'
        '<p class="wy-qt">Triangular Pattern with Numbers</p>'
        '<p>Read a number N. Print a triangle of numbers in N rows. '
        'There is a space after every number.</p>'
        '<span class="wy-lab">Sample input</span><pre>4</pre>'
        f'<span class="wy-lab">Sample output</span><pre>{esc(sample)}</pre>'
        '</div>')

    eds = (
        '<div class="wy-ed wy-e1"><div class="edcard"><div class="edtab">'
        '<span class="eddot"></span>main.py</div><pre class="cx">'
        '<span class="ln"><span class="no">1</span>'
        '<span class="wy-cmt"># write your code here</span></span></pre></div></div>'
        f'<div class="wy-ed wy-e2">{CODE.card(P.WHY_TRY, "main.py")}</div>'
        f'<div class="wy-ed wy-e3">{CODE.card(P.WHY_LONG, "main.py")}</div>'
        '<div class="wy-ed wy-e4">'
        + CODE.card(P.WHY_LONG + '\n...\nprint("1 2 3 4 5 ... 100 ")', "main.py")
        + '</div>'
        f'<div class="wy-ed wy-e5">{_shape()}</div>')

    res = (
        _result(2, try_out, want3,
                [_tc(1, "bad", "input 3"), _tc(2, "wait", "input 4")])
        + _result(3, long_out, want3,
                  [_tc(1, "ok", "input 3"),
                   _tc(2, "bad", f"input 4: row {P.WHY_N2} is missing")])
        + '<div class="wy-res wy-r4 wy-tiles">'
        f'<div class="wy-tile"><b>{P.why_big_lines()}</b><span>print lines</span></div>'
        f'<div class="wy-tile"><b>{P.why_big_numbers():,}</b><span>numbers typed</span></div>'
        '</div>'
        '<div class="wy-res wy-r5"><div class="wy-tcs">'
        + _tc(1, "wait", "input 3") + _tc(2, "wait", "input 4")
        + '</div></div>')
    assert want4[-1].strip() not in [s.strip() for s in long_out]

    rail = "".join(
        f'<li class="wy-l wy-l{i}"><span class="wy-n">{i}</span>'
        f'<span class="wy-t">{esc(t)}</span></li>'
        for i, t in enumerate(RAIL, 1))

    return ('<div class="wy">'
            '<div class="wy-app">'
            '<div class="wy-bar"><span class="wy-logo">Coding Practice</span>'
            '<span class="wy-crumb">Loops &middot; Question 4</span>'
            '<span class="wy-run">&#9654; Run</span>'
            '<span class="wy-sub">Submit</span></div>'
            f'<div class="wy-body">{question}'
            f'<div class="wy-code"><div class="wy-eds">{eds}</div>{res}</div>'
            '</div></div>'
            f'<ol class="wy-rail">{rail}</ol>'
            '</div>')


def _at(k, sel):
    return f".wystage.an-{k} {sel}"


def _fr(k, sel):
    return ",".join(f".wystage.an-{j} {sel}" for j in range(k, STEPS + 1))


def css():
    r = [r"""
/* ============ the second hook: why a loop inside a loop ============ */
.wy{display:flex;flex:1;min-height:0;gap:22px;align-items:stretch}
.wy-app{flex:0 0 66%;min-width:0;display:flex;flex-direction:column;
  border:1px solid #D5DEE5;border-radius:14px;overflow:hidden;background:#F3F6F9;
  box-shadow:0 2px 10px rgba(16,42,67,.08)}
.wy-bar{flex:none;display:flex;align-items:center;gap:14px;padding:9px 14px;
  background:#FFFFFF;border-bottom:1px solid #DDE5EC}
.wy-logo{font:800 15px var(--sans);color:#006DAF}
.wy-crumb{font:600 13px var(--sans);color:#7A8794}
.wy-run{margin-left:auto;padding:5px 14px;border-radius:8px;background:#E7F1FA;
  color:#006DAF;font:700 13px var(--sans)}
.wy-sub{padding:5px 14px;border-radius:8px;background:#1F9D62;color:#fff;
  font:700 13px var(--sans)}
.wy-body{flex:1;min-height:0;display:flex;gap:12px;padding:12px}
.wy-q{flex:0 0 36%;min-width:0;background:#fff;border:1px solid #DDE5EC;
  border-radius:10px;padding:12px 14px;overflow:hidden}
.wy-q p{margin:0 0 10px;font:14px/1.45 var(--sans);color:#434343}
.wy-q .wy-qt{font:700 16px/1.3 var(--sans);color:#16212B}
.wy-lab{display:block;margin:0 0 4px;font:700 11.5px var(--sans);color:#7A8794;
  letter-spacing:.04em;text-transform:uppercase}
.wy pre{margin:0 0 10px;padding:8px 10px;border-radius:8px;background:#F6F8FA;
  border:1px solid #E1E7ED;font:14px/1.5 var(--mono);color:#1B2530;white-space:pre}
.wy-code{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}
.wy-eds{flex:1;min-height:0;display:grid}
.wy-ed{grid-area:1/1;min-width:0;opacity:0;transform:translateY(8px);
  transition:opacity 260ms var(--ease-out),transform 260ms var(--ease-out)}
.wy-ed .edcard{margin:0}
.wy-cmt{color:#9AA1B0}
.wy-res{display:none}
.wy-cmp{display:flex;gap:10px}
.wy-cmp>div{flex:1;min-width:0}
.wy-tcs{display:flex;gap:8px;flex-wrap:wrap}
.wy-tc{flex:1 1 40%;display:flex;align-items:center;gap:8px;padding:7px 10px;
  border-radius:9px;background:#fff;border:1.5px solid #DDE5EC;font:13px var(--sans);color:#5C6B78}
.wy-tc b{color:#16212B}
.wy-ic{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;
  font:800 13px var(--sans);color:#fff;background:#9AA7B1}
.wy-tc.ok{border-color:#9FD8B8;background:#EFFAF3}.wy-tc.ok .wy-ic{background:#1F9D62}
.wy-tc.bad{border-color:#F0B3AE;background:#FDF1F0}.wy-tc.bad .wy-ic{background:#D6453D}
.wy-tc.wait{border-style:dashed}
.wy-tiles{gap:12px}
.wy-tile{flex:1;padding:12px 14px;border-radius:12px;background:#fff;border:2px solid #F0B3AE}
.wy-tile b{display:block;font:800 34px/1 var(--mono);color:#D6453D}
.wy-tile span{font:600 14px var(--sans);color:#5C6B78}
.wy-shape{padding:14px 16px;border-radius:12px;background:#fff;border:1px solid #DDE5EC;
  font:600 17px/1.5 var(--mono);color:#1F4E79}
.wy-shape .kw{color:#D6453D;font-weight:800}
.wy-o{padding:10px 12px;border:3px dashed #F29A1F;border-radius:10px}
.wy-i{margin:10px 0 10px 26px;padding:10px 12px;border:3px dashed #2F7FE0;border-radius:10px}
.wy-b{margin:8px 0 0 26px;padding:7px 12px;border-radius:6px;background:#CDE7FA;
  color:#4A5A66;font-weight:500}
.wy-rail{flex:1;min-width:0;margin:0;padding:0;list-style:none;display:flex;
  flex-direction:column;justify-content:safe center;gap:12px}
.wy-l{display:flex;align-items:flex-start;gap:12px;padding:10px 12px;border-radius:11px;
  border:2px dashed #E1E7ED;transition:background-color 220ms var(--ease-out),border-color 220ms var(--ease-out)}
.wy-n{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;
  background:#C5CFD7;color:#fff;font:800 14px var(--sans);
  transition:background-color 220ms var(--ease-out)}
.wy-t{font:500 16px/1.4 var(--sans);color:#434343;opacity:0;
  transition:opacity 260ms var(--ease-out)}
body.present .wy{gap:clamp(14px,1.6vw,30px)}
body.present .wy-q p{font-size:clamp(12px,1.2vw,19px)}
body.present .wy-q .wy-qt{font-size:clamp(14px,1.45vw,23px)}
body.present .wy pre{font-size:clamp(12px,1.25vw,20px)}
body.present .wy-ed .cx{font-size:clamp(12px,1.3vw,21px)}
body.present .wy-shape{font-size:clamp(14px,1.45vw,24px)}
body.present .wy-t{font-size:clamp(13px,1.35vw,22px)}
body.present .wy-tc{font-size:clamp(11px,1.1vw,17px)}
body.present .wy-tile b{font-size:clamp(24px,2.6vw,44px)}
body.present .wy-tile span{font-size:clamp(12px,1.2vw,19px)}
body.present .wy-bar{font-size:clamp(12px,1.1vw,17px)}
@media (prefers-reduced-motion:reduce){.wy *{transition:none !important}}
"""]
    for k in range(1, STEPS + 1):
        r.append(_at(k, f".wy-e{k}") + "{opacity:1;transform:none}")
        r.append(_fr(k, f".wy-l{k}") + "{border-style:solid;border-color:#E2E9EF;background:#FFFFFF}")
        r.append(_fr(k, f".wy-l{k} .wy-t") + "{opacity:1}")
        r.append(_fr(k, f".wy-l{k} .wy-n") + "{background:#9AA7B1}")
        r.append(_at(k, f".wy-l{k}") + "{border-color:#BFDDF1;background:#EAF6FC}")
        r.append(_at(k, f".wy-l{k} .wy-n") + "{background:#006DAF}")
        r.append(_at(k, f".wy-l{k} .wy-t") + "{color:#006DAF;font-weight:700}")
    for k in (2, 3, 4, 5):
        r.append(_at(k, f".wy-r{k}") + "{display:flex;flex-direction:column;gap:10px}")
    r.append(_at(4, ".wy-r4") + "{display:flex;flex-direction:row}")
    return "\n".join(r)
