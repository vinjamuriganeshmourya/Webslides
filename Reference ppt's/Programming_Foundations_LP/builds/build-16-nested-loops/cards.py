"""Every card in session 16, in presentation order.

Deck slides are the deck's own flat artwork, inlined. Panels wear the deck's
header: the accent bar, a grey eyebrow, a blue title and the rule along the
bottom. The spine cards come from the skill and are never redrawn here.
"""
import base64
import html
import re
import pathlib
import sys

import agenda as A
import codecard as CODE
import hook as H
import panels as P
import shape as SH
import flow as FL
import walk as WK
import why as WY

MEDIA = pathlib.Path(__file__).parent / "media"
SKILL = pathlib.Path.home() / ".claude" / "skills" / "prog-lesson-plan"
sys.path.insert(0, str(SKILL / "assets"))
from standard_slides import Spine  # noqa: E402

S = Spine(str(SKILL / "assets" / "standard-slides"))
SESSION_NAME = "Nested Loops"


# ------------------------------------------------------------------ plumbing
def _b64(name):
    return base64.b64encode((MEDIA / name).read_bytes()).decode()


def slide(n, title):
    alt = html.escape(f"Slide {n}: {title}")
    return ('<div class="slide"><div class="slide-head">'
            f'<span class="slide-no">Slide {n}</span>'
            f'<span class="slide-title">{title}</span></div>'
            f'<div class="slide-img"><img alt="{alt}" '
            f'src="data:image/webp;base64,{_b64(f"sl{n}.webp")}"></div></div>')


def pcard(lbl, inner, sheet=None, animated=None, activity=None):
    """The class attribute is exactly "pcard"; the linters count the quote."""
    ref = f'<span class="slide-src">worksheet {sheet}</span>' if sheet else ''
    an = f' data-animated="{animated}"' if animated else ''
    ac = f' data-activity="{activity}"' if activity else ''
    return (f'<div class="pcard" data-label="{html.escape(lbl)}"{an}{ac}>'
            f'<div class="slide-head"><span class="slide-title">'
            f'{html.escape(lbl)}</span>{ref}</div>{inner}</div>')


def slhead(eyebrow, title):
    return ('<div class="sl-head"><span class="sl-bar" aria-hidden="true">'
            f'</span><div><p class="sl-eyebrow">{eyebrow}</p>'
            f'<h3 class="sl-title">{title}</h3></div></div>')


RULE = '<div class="stage-rule" aria-hidden="true"></div>'


def animctl():
    return ('<div class="stage-ctl"><button type="button" data-anim-next>Next'
            '</button><button type="button" class="ghost" data-anim-replay>'
            'Replay</button><span class="ctl-count" data-anim-count></span>'
            '</div>')


def anim(sid, cls, eyebrow, title, body, steps, labels="", nxt="Next"):
    ctl = animctl().replace(">Next</button>", f">{nxt}</button>")
    return (f'<div class="stage {cls}" id="{sid}" data-anim="{steps}" '
            f'data-anim-labels="{labels}">{slhead(eyebrow, title)}{body}'
            f'{ctl}{RULE}</div>')


def tmr(secs):
    return f'<span class="tmr" data-secs="{secs}"></span>'


def fr(cls, k, n, sel):
    """`sel` on stage class `cls` from step k to step n. an-N is exclusive."""
    return ",".join(f".{cls}.an-{j} {sel}" for j in range(k, n + 1))


def at(cls, k, sel):
    return f".{cls}.an-{k} {sel}"


# =================================================================== opening
def card_welcome():
    return pcard("Welcome", S.welcome())


def card_recap_title():
    return pcard("Recap", S.recap_title())


def card_recap():
    """`rapid`: 12 used bug, 14 match, 15 sort."""
    return pcard("Recap: three string methods",
                 S.recap("rapid", title=P.RECAP_TITLE, eyebrow="Recap",
                         ask=P.RECAP_ASK, items=P.recap_items()),
                 activity=1)


def card_hook():
    return pcard("Hook: the Cricbuzz ball counter",
                 anim("stage-hook", "hkstage", "Programming Foundations",
                      "Every ball has a number", H.body(), H.STEPS, H.LABELS),
                 animated="hook")


def card_title():
    """Nothing before this card prints the words Nested Loops."""
    return pcard("Today", S.title_card(SESSION_NAME))


def card_agenda():
    return pcard("The plan",
                 anim("stage-agenda", "agstage", "Agenda for today's session",
                      SESSION_NAME, A.body(), A.STEPS, A.LABELS))


# ================================================================ the shape
def card_shape():
    """Deck slides 7, 9 and 11, drawn in the deck's style and then run."""
    return pcard("A loop inside a loop: the shape",
                 anim("stage-shape", "shstage", "Loops", "Nested loops",
                      SH.body(), SH.STEPS, SH.LABELS))


# ============================================================= the explainer
def card_explainer():
    return pcard("Follow both loops",
                 anim("stage-expl", "flstage", "Code walkthrough",
                      "Follow the dot: a loop inside a loop", FL.body(), FL.STEPS,
                      nxt="One step"),
                 animated="explainer")


# ========================================================== worksheet task 1
def card_task1():
    ev = P.task1_events()
    intro = (
        '<div class="tk1">'
        '<p class="pill">Worksheet &middot; Task 1</p>'
        '<ol class="tk1-steps">'
        '<li>Open <b>Task 1</b> on your worksheet.</li>'
        '<li>Fill <b>one row each time line 3 runs</b>: the value of i, '
        'the value of j, and what it prints.</li>'
        '<li>Then type how many times line 3 runs.</li>'
        '<li>Do not run it. Keyboards off when the timer ends.</li>'
        '</ol>'
        f'<div class="tk1-t">{tmr(300)}</div></div>')
    body = WK.walk(
        "wk-task1", P.TASK1_SRC, "task1.py", ev, ["i", "j"],
        [("i", "range(1, 4)"), ("j", "range(i)")],
        ask="", intro=intro)
    return pcard("Worksheet task 1: trace it, then check it",
                 anim("stage-task1", "wkstage", "Worksheet &middot; Task 1",
                      "Trace it: the inner range uses i", body, WK.steps(ev),
                      nxt="One step"),
                 sheet="task 1", activity=18)


# =========================================================== the machine
def _dots(rows):
    out, d = "", 0
    for lab, kinds in rows:
        dots = ""
        for c in kinds:
            dots += f'<span class="mc-dot k{c}" style="--d:{d}"></span>'
            d += 1
        if not kinds:
            dots = '<span class="mc-none">nothing</span>'
        out += f'<div class="mc-row"><span class="mc-rl">{lab}</span>{dots}</div>'
    return out


def levels_body(levels, answer, right, legend=lambda lv: "", unit=lambda lv: "lines",
                tag=lambda n, lv: f"{lv['tag']} of {len(levels)}"):
    panes = ""
    for n, lv in enumerate(levels, 1):
        ans, r = answer(lv), right(lv)
        opts = "".join(
            f'<li class="mc-o{" ok" if i == r else ""}"><i>{"ABCD"[i]}</i>'
            f'<b>{v}</b></li>' for i, v in enumerate(lv["opts"]))
        why = "".join(f'<li><b>{v}:</b> {html.escape(lv["why"][v])}</li>'
                      for v in lv["opts"] if v != ans)
        panes += (
            f'<div class="mc-lv mc-lv{n}">'
            f'<div class="mc-l"><p class="mc-tag">{html.escape(tag(n, lv))}</p>'
            f'{CODE.card(lv["src"], lv["id"] + ".py")}'
            f'<p class="stage-q">{html.escape(lv["q"])}</p>'
            f'<ul class="mc-opts">{opts}</ul></div>'
            f'<div class="mc-r"><div class="mc-grid">{_dots(lv["rows"]())}</div>'
            f'{legend(lv)}'
            f'<p class="mc-ans"><b>{ans}</b> {unit(lv)}</p>'
            f'<ul class="mc-why">{why}</ul></div></div>')
    return f'<div class="mc">{panes}</div>'


def _mc_legend(lv):
    if lv["id"] == "m4":
        return ('<p class="mc-key"><span class="mc-dot kd"></span> done '
                '<span class="mc-dot ki"></span> a star</p>')
    if lv["id"] == "m2":
        return ('<p class="mc-key"><span class="mc-dot ko"></span> row '
                '<span class="mc-dot ki"></span> a star</p>')
    return ""


def card_machine():
    steps = 2 * len(P.MACHINE)
    labels = "|".join(f"level {n} {w}" for n in range(1, len(P.MACHINE) + 1)
                      for w in ("vote", "run"))
    body = levels_body(P.MACHINE, P.machine_answer, P.machine_right, _mc_legend,
                       lambda lv: "times" if lv["id"] == "m4" else "lines",
                       lambda n, lv: f"Level {n} of {len(P.MACHINE)}")
    return pcard("The loop counter machine",
                 anim("stage-mc", "mcstage", "Predict, then run",
                      "How many times does it run?", body, steps, labels),
                 activity=21)


def card_quiz():
    return pcard("Classroom quiz on the portal", S.quiz(), activity=9)


# ======================================================== the second hook
def card_why():
    return pcard("Why a loop inside a loop?",
                 anim("stage-why", "wystage", "The solution",
                      "Why a loop inside a loop?", WY.body(), WY.STEPS, WY.LABELS))


def card_s33():
    return slide(33, "Triangular pattern with numbers")


def card_s34():
    return slide(34, "Input format")


def card_s35():
    return slide(35, "Output format")


# ============================================================ the attempt
def card_attempt():
    sample = "\n".join(s.rstrip() for s in P.why_want(4))
    body = (
        '<div class="at">'
        '<div class="at-l"><p class="at-h">Triangular pattern with numbers</p>'
        '<div class="at-io"><div><span class="wy-lab">Input</span><pre>4</pre></div>'
        f'<div><span class="wy-lab">Output</span><pre>{html.escape(sample)}</pre></div></div>'
        '<p class="at-note">There is a space after every number.</p></div>'
        '<div class="at-r"><p class="pill">Your turn &middot; 5 minutes</p>'
        '<ol class="tk1-steps">'
        '<li>Open the code playground.</li>'
        '<li>Write a program that reads <b>N</b> and prints this triangle.</li>'
        '<li>Run it with <b>3</b>, then with <b>4</b>.</li>'
        '<li>Stuck? Write the rows for 3 by hand first, then look for what repeats.</li>'
        '</ol>'
        f'<div class="tk1-t">{tmr(300)}</div></div></div>')
    return pcard("Your turn: solve the triangle",
                 f'<div class="stage atstage" id="stage-attempt">'
                 f'{slhead("Your turn", "Solve it yourself first")}{body}{RULE}</div>',
                 activity=9)


# ======================================================= the instructor writes it
def card_live():
    code = CODE.card(P.TRI_SRC, "triangle.py")
    for i in range(1, len(P.live_lines()) + 1):
        code = code.replace('<span class="ln"><span class="no">'
                            f'{i}</span>', f'<span class="ln lc lc{i}"><span class="no">{i}</span>', 1)
    says = "".join(f'<p class="cap lv-say lv-s{i}"><b>Line {i}.</b> {html.escape(t)}</p>'
                   for i, (_, t) in enumerate(P.live_lines(), 1))
    rows = "".join(f'<span class="b2-row" style="--d:{i}">{html.escape(r.rstrip())}</span>'
                   for i, r in enumerate(P.tri_out()))
    n = len(P.live_lines())
    body = (
        '<div class="lv">'
        f'<div class="lv-l">{code}</div>'
        '<div class="lv-r"><div class="lv-says">'
        '<p class="cap lv-say lv-s0">Watch the program being written, one line at a time.</p>'
        f'{says}</div>'
        '<div class="lv-out"><span class="wy-lab">It prints, for 3</span>'
        f'<pre class="b2-term">{rows}</pre></div></div></div>')
    return pcard("The code, written line by line",
                 anim("stage-live", "lvstage", "The solution",
                      "Writing it, one line at a time", body, n + 2,
                      "|".join(["start"] + [f"line {i}" for i in range(1, n + 1)] + ["run it"])))


# ============================================================ task 2: two mistakes
def card_task3():
    a = CODE.card(P.MISTAKE_A, "a.py", hi=(2,))
    b = CODE.card(P.MISTAKE_B, "b.py", hi=(4,))
    want = P.tri_out()
    out_a, out_b = P.tri_out(P.MISTAKE_A), P.tri_out(P.MISTAKE_B)

    def term(lines, cls, missing=0):
        body = "".join(f'<span>{html.escape(s.rstrip())}</span>' for s in lines)
        body += "".join('<span class="mi-miss">the row you wanted</span>'
                        for _ in range(missing))
        return f'<pre class="mi-term {cls}">{body}</pre>'

    body = (
        '<div class="mi">'
        '<p class="mi-ask"><b>Worksheet task 2.</b> Both programs get input <b>3</b>. '
        'Type what each one prints first. Then run them.</p>'
        '<div class="mi-cols">'
        f'<div class="mi-col"><p class="mi-h">Program A</p>{a}'
        f'{term(out_a, "mi-ta", len(want) - len(out_a))}'
        '<p class="mi-fix mi-fa">Fix: <code>range(1, num + 1)</code>. '
        'range stops before num.</p></div>'
        f'<div class="mi-col"><p class="mi-h">Program B</p>{b}'
        f'{term(out_b, "mi-tb")}'
        '<p class="mi-fix mi-fb">Fix: <code>range(1, row_num + 1)</code>. '
        'range with one number starts at 0.</p></div>'
        f'</div><div class="mi-t">{tmr(240)}</div></div>')
    return pcard("Worksheet task 2: two mistakes",
                 anim("stage-mi", "mistage", "Possible mistakes",
                      "Predict, then run", body, 4,
                      "predict|program A|program B|the fixes"),
                 sheet="task 2", activity=2)


def card_s36():
    return slide(36, "Possible mistake: wrong iteration")


# ==================================================== any loop inside any loop
def card_poll():
    steps = 2 * len(P.POLL)
    labels = "|".join(f"{lv['tag']} {w}" for lv in P.POLL for w in ("vote", "run"))
    body = levels_body(P.POLL, P.poll_answer, P.poll_right,
                       unit=lambda lv: "stars",
                       tag=lambda n, lv: f"Program {n} of {len(P.POLL)}")
    title = "".join(f'<span class="pt pt{n}">{html.escape(P.poll_title(lv))}</span>'
                    for n, lv in enumerate(P.POLL, 1))
    return pcard("Any loop inside any loop",
                 anim("stage-poll3", "mcstage pollstage", "Any loop inside any loop",
                      title, body, steps, labels),
                 activity=10)


# ================================================================= the exit
def card_exit():
    right = P.exit_right()
    opts = "".join(
        f'<li data-k="{"ABCD"[i]}" class="ex-o{" ok" if i == right else ""}">'
        f'<code>overs = {v}</code><span class="ex-why">'
        f'{html.escape(P.EXIT_WHY[v])}</span></li>'
        for i, v in enumerate(P.EXIT_OPTS))
    body = (
        '<div class="ex">'
        '<div class="ex-l"><p class="ex-story">A highlights app prints one line '
        'for every ball it shows.</p>'
        f'{CODE.card(P.EXIT_SRC, "highlights.py")}'
        f'<p class="stage-q">Which input prints exactly <b>{P.EXIT_TARGET}</b> lines?</p>'
        f'<div class="tk1-t">{tmr(150)}</div></div>'
        f'<div class="ex-r"><ul class="vopts">{opts}</ul></div></div>')
    return pcard("Exit: one question",
                 anim("stage-exit", "exstage", "Exit question",
                      "Which input prints 12 lines?", body, 2, "vote|answer"),
                 activity=1)


# ============================================================ the takeaways
CHIPS = ['#006DAF', '#6A48C0', '#C77700', '#1F9D62', '#8E44AD', '#C7454E']


KW = re.compile(r"\b(for|in|while)\b|\b(range|print)\b|(#.*$)")


def _tk_line(line):
    out, pos = "", 0
    for m in KW.finditer(line):
        out += html.escape(line[pos:m.start()])
        cls = "k" if m.group(1) else ("f" if m.group(2) else "c")
        out += f'<i class="tg-{cls}">{html.escape(m.group(0))}</i>'
        pos = m.end()
    return out + html.escape(line[pos:])


def card_takeaways():
    cards = ""
    for k, (chip, code, got, why) in enumerate(P.tk_rows(), 1):
        lines = "".join(f'<span class="tg-l"><em>{n}</em>{_tk_line(c)}</span>'
                        for n, c in enumerate(code.split("\n"), 1))
        cards += (f'<div class="tg tg{k}" style="--c:{CHIPS[k - 1]}">'
                  f'<span class="tg-n">{k}</span><div class="tg-in">'
                  f'<p class="tg-h">{html.escape(chip)}</p>'
                  f'<div class="tg-code">{lines}</div>'
                  f'<p class="tg-out">{html.escape(got)}</p>'
                  f'<p class="tg-why">{html.escape(why)}</p></div></div>')
    body = f'<div class="tgrid">{cards}</div>'
    return pcard("Key takeaways: six examples",
                 anim("stage-tk", "tkg", "Key takeaways",
                      "Nested loops, in six examples", body, len(P.TK)))


def card_feedback():
    return pcard("Feedback", S.feedback())


def card_thankyou():
    return pcard("Thank you", S.thankyou())


# ===================================================================== CSS
def css():
    r = [r"""
/* ---- shared bits on these cards ---- */
.pill{display:inline-block;margin:0 0 12px;padding:4px 12px;border-radius:999px;
  background:#FDF2E6;color:#B5650D;font:700 14px var(--sans);letter-spacing:.02em}
.tk1-steps{margin:0 0 14px;padding-left:1.3em;font:17px/1.5 var(--sans);color:var(--dk-text)}
.tk1-steps li{margin:0 0 8px}
.tk1-t{margin:6px 0 0}
body.present .tk1-steps{font-size:clamp(14px,1.55vw,25px)}
body.present .pill{font-size:clamp(12px,1.2vw,19px)}

/* ---- the machine: one level at a time, vote then run ---- */
.mc{flex:1;min-height:0;display:grid}
.mc-lv{grid-area:1/1;min-width:0;display:flex;gap:26px;opacity:0;visibility:hidden;
  transition:opacity 240ms var(--ease-out)}
.mc-l{flex:0 0 48%;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.mc-r{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.mc-tag{margin:0 0 8px;font:700 14px var(--sans);color:#7A8794;letter-spacing:.04em;
  text-transform:uppercase}
.mc-opts{display:flex;gap:12px;margin:4px 0 0;padding:0;list-style:none}
.mc-o{flex:1;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;
  border:2px solid #D5DEE5;background:#fff;transition:opacity 240ms var(--ease-out),
  background-color 240ms var(--ease-out),border-color 240ms var(--ease-out)}
.mc-o i{font:800 15px var(--sans);font-style:normal;color:#7A8794}
.mc-o b{font:800 28px var(--mono);color:var(--dk-blue)}
.mc-grid{display:flex;flex-direction:column;gap:10px;margin:0 0 12px}
.mc-row{display:flex;align-items:center;gap:8px;min-height:34px}
.mc-rl{flex:none;width:5.2em;font:700 17px var(--mono);color:#6B7A86}
.mc-dot{flex:none;width:26px;height:26px;border-radius:50%;background:#2F7FE0;
  opacity:0;transform:scale(.6);transition:opacity 200ms var(--ease-out) calc(var(--d,0)*70ms),
  transform 200ms var(--ease-out) calc(var(--d,0)*70ms)}
.mc-dot.ko{background:#F29A1F}.mc-dot.kd{background:#1F9D62}
.mc-none{font:600 16px var(--sans);color:#D6453D;opacity:0;transition:opacity 200ms var(--ease-out)}
.mc-key{display:flex;align-items:center;gap:8px;margin:0 0 10px;font:600 15px var(--sans);
  color:#6B7A86;opacity:0;transition:opacity 200ms var(--ease-out)}
.mc-key .mc-dot{opacity:1;transform:none;width:16px;height:16px}
.mc-ans{margin:0 0 8px;font:600 20px var(--sans);color:var(--dk-text);opacity:0;
  transition:opacity 240ms var(--ease-out)}
.mc-ans b{font:800 34px var(--mono);color:#1F9D62}
.mc-why{margin:0;padding-left:1.1em;font:15px/1.45 var(--sans);color:var(--dk-text);
  opacity:0;transition:opacity 240ms var(--ease-out) 300ms}
.mc-why li{margin:0 0 4px}
body.present .mc-o b{font-size:clamp(20px,2.2vw,38px)}
body.present .mc-rl{font-size:clamp(14px,1.4vw,23px)}
body.present .mc-dot{width:clamp(20px,2vw,34px);height:clamp(20px,2vw,34px)}
body.present .mc-ans{font-size:clamp(16px,1.6vw,26px)}
body.present .mc-ans b{font-size:clamp(26px,2.8vw,46px)}
body.present .mc-why{font-size:clamp(12px,1.25vw,20px)}
body.present .mc-key{font-size:clamp(12px,1.2vw,19px)}

/* ---- the attempt ---- */
.at{flex:1;min-height:0;display:flex;gap:34px;align-items:center}
.at-l{flex:0 0 46%;min-width:0}
.at-r{flex:1;min-width:0}
.at-h{margin:0 0 12px;font:700 24px var(--sans);color:var(--dk-blue)}
.at-io{display:flex;gap:16px}
.at-io>div:first-child{flex:0 0 30%}.at-io>div:last-child{flex:1}
.at pre{margin:0;padding:12px 14px;border-radius:10px;background:#F6F8FA;
  border:1px solid #DDE5EC;font:24px/1.55 var(--mono);color:#1B2530}
.at-note{margin:12px 0 0;font:italic 16px var(--sans);color:#5C6B78}
body.present .at-h{font-size:clamp(18px,2vw,34px)}
body.present .at pre{font-size:clamp(18px,2vw,34px)}
body.present .at-note{font-size:clamp(13px,1.3vw,21px)}

/* ---- the code, written one line per press ---- */
.lv{flex:1;min-height:0;display:flex;gap:28px}
.lv-l{flex:0 0 58%;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.lv-r{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center;gap:14px}
.lv .cx .lc{box-shadow:inset 0 -2px 0 #E6ECF1;color:transparent;
  transition:color 260ms var(--ease-out),background-color 200ms var(--ease-out)}
.lv .cx .lc b,.lv .cx .lc i,.lv .cx .lc em{color:transparent;
  transition:color 260ms var(--ease-out)}
.lv-say{display:none;margin:0}
.lv-out{opacity:0;transition:opacity 240ms var(--ease-out)}
body.present .lv .cx{font-size:clamp(13px,1.6vw,27px)}
.b2-out{margin-top:12px;opacity:0;transition:opacity 240ms var(--ease-out)}
.b2-term{margin:0;padding:12px 14px;border-radius:10px;background:#F6F8FA;
  border:1px solid #DDE5EC;font:20px/1.6 var(--mono);color:#1B2530;min-height:4.8em}
.b2-row{display:block;opacity:0;transform:translateY(6px);
  transition:opacity 220ms var(--ease-out) calc(var(--d)*260ms),
  transform 220ms var(--ease-out) calc(var(--d)*260ms)}
body.present .b2-term{font-size:clamp(16px,1.8vw,30px)}
body.present .mc .cx{font-size:clamp(13px,1.55vw,26px)}
body.present .ex .cx{font-size:clamp(12px,1.4vw,24px)}

/* ---- task 3: two mistakes side by side ---- */
.mi{flex:1;min-height:0;display:flex;flex-direction:column}
.mi-ask{flex:none;margin:0 0 10px;font:17px/1.4 var(--sans);color:var(--dk-text)}
.mi-cols{flex:1;min-height:0;display:flex;gap:22px}
.mi-col{flex:1;min-width:0;display:flex;flex-direction:column}
.mi-h{margin:0 0 6px;font:700 17px var(--sans);color:var(--dk-blue)}
.mi .edcard{margin-bottom:8px}
.mi-term{margin:0;padding:10px 14px;border-radius:10px;background:#F6F8FA;
  border:1px solid #DDE5EC;font:19px/1.55 var(--mono);color:#1B2530;min-height:5.2em}
.mi-term span{display:block;opacity:0;transition:opacity 240ms var(--ease-out)}
.mi-term .mi-miss{border:2px dashed #D6453D;border-radius:6px;padding:0 8px;
  color:#D6453D;font:600 15px/1.8 var(--sans)}
.mi-tb span{color:#1B2530}
.mi-fix{margin:8px 0 0;font:16px/1.4 var(--sans);color:var(--dk-text);opacity:0;
  transition:opacity 240ms var(--ease-out)}
.mi-fix code{font:700 16px var(--mono);color:#1F9D62}
.mi-t{flex:none;margin-top:8px}
body.present .mi-ask{font-size:clamp(14px,1.5vw,24px)}
body.present .mi-h{font-size:clamp(14px,1.45vw,23px)}
body.present .mi-term{font-size:clamp(14px,1.55vw,26px)}
body.present .mi-term .mi-miss{font-size:clamp(12px,1.2vw,19px)}
body.present .mi-fix,body.present .mi-fix code{font-size:clamp(13px,1.35vw,22px)}
body.present .mi .cx{font-size:clamp(12px,1.3vw,22px);line-height:1.7}

/* ---- the exit ---- */
.ex{flex:1;min-height:0;display:flex;gap:26px}
.ex-l{flex:0 0 52%;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.ex-story{margin:0 0 10px;font:17px/1.4 var(--sans);color:var(--dk-text)}
.ex-r{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.ex .vopts{margin:0;display:flex;flex-direction:column;gap:12px}
.ex .vopts li.ex-o{margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;
  padding:12px 16px 12px 52px;position:relative;
  border-radius:12px;border:2px solid #D5DEE5;background:#fff;
  transition:opacity 240ms var(--ease-out),background-color 240ms var(--ease-out),
  border-color 240ms var(--ease-out)}
.ex-o i{font:800 17px var(--sans);font-style:normal;color:#7A8794}
.ex-o code{font:800 24px var(--mono);color:var(--dk-blue)}
.ex .vopts li.ex-o::before{left:18px;top:15px}
.ex-why{flex:1 1 100%;font:15px/1.4 var(--sans);color:var(--dk-text);display:none}
body.present .ex-story{font-size:clamp(14px,1.5vw,24px)}
body.present .ex-o code{font-size:clamp(18px,2vw,34px)}
body.present .ex-why{font-size:clamp(12px,1.25vw,20px)}

/* ---- the takeaways: six example cards, one per press ---- */
.tgrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  grid-template-rows:repeat(2,minmax(0,1fr));gap:16px}
.tg{position:relative;min-width:0;min-height:0;border:2px dashed #D5DEE5;border-radius:16px;
  background:#FAFCFD;overflow:hidden;transition:border-color 240ms var(--ease-out),
  background-color 240ms var(--ease-out),box-shadow 240ms var(--ease-out)}
.tg-n{position:absolute;inset:0;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;
  font:800 56px var(--sans);color:#DCE4EA;transition:opacity 200ms var(--ease-out)}
.tg-in{height:100%;display:flex;flex-direction:column;gap:12px;padding:0 18px 14px;
  opacity:0;transform:translateY(8px);
  transition:opacity 280ms var(--ease-out),transform 280ms var(--ease-out)}
.tg-h{margin:0 -18px 4px;padding:9px 18px;background:var(--c);color:#fff;
  font:700 18px var(--sans);letter-spacing:.01em}
.tg-code{display:flex;flex-direction:column;padding:8px 10px;border:1px solid #E2E9EF;
  border-radius:10px;background:#fff;font:500 15px/1.5 var(--mono);color:#1B2530}
.tg-l{white-space:pre}
.tg-l em{display:inline-block;width:1.4em;font-style:normal;color:#A7B4BE}
.tg-l i{font-style:normal}
.tg-k{color:var(--dk-red);font-weight:700}.tg-f{color:var(--dk-blue)}.tg-c{color:#7A8794}
.tg-out{margin:0;font:800 19px/1.3 var(--mono);color:#1F9D62}
.tg-why{margin:0;font:16px/1.4 var(--sans);color:var(--dk-text)}
body.present .tg-h{font-size:clamp(14px,1.4vw,23px)}
body.present .tg-code{font-size:clamp(13px,1.3vw,22px)}
body.present .tg-out{font-size:clamp(16px,1.7vw,29px)}
body.present .tg-why{font-size:clamp(14px,1.4vw,23px)}
body.present .tg-h{margin-bottom:auto}
.tg-code{overflow-x:auto}
body.present .tg6 .tg-code{font-size:clamp(11px,.96vw,17px)}
body.present .tg-why{margin-bottom:auto}
body.present .tg-n{font-size:clamp(40px,4vw,72px)}
.pollstage .pt{display:none}
@media (prefers-reduced-motion:reduce){
  .mc *,.b2 *,.mi *,.ex *,.tg *{transition:none !important}
}
"""]
    # the machine and the poll: level k is up on presses 2k-1 and 2k
    for k in range(1, max(len(P.MACHINE), len(P.POLL)) + 1):
        vote, run = 2 * k - 1, 2 * k
        r.append(f"{at('mcstage', vote, f'.mc-lv{k}')},{at('mcstage', run, f'.mc-lv{k}')}"
                 "{opacity:1;visibility:visible}")
        sel = f".mc-lv{k}"
        r.append(at("mcstage", run, f"{sel} .mc-dot") + "{opacity:1;transform:none}")
        for part in (".mc-none", ".mc-key", ".mc-ans", ".mc-why"):
            r.append(at("mcstage", run, f"{sel} {part}") + "{opacity:1}")
        r.append(at("mcstage", run, f"{sel} .mc-o:not(.ok)") + "{opacity:.35}")
        r.append(at("mcstage", run, f"{sel} .mc-o.ok")
                 + "{border-color:#9FD8B8;background:#EFFAF3}")
    # the code, one line per press
    nl = len(P.live_lines())
    for i in range(1, nl + 1):
        sel = fr("lvstage", i + 1, nl + 2, f".lc{i}")
        r.append(sel + "{color:#1B2530;box-shadow:none}")
        r.append(",".join(x + " b" for x in sel.split(",")) + "{color:var(--dk-red)}")
        r.append(",".join(x + " i" for x in sel.split(",")) + "{color:var(--dk-blue)}")
        r.append(",".join(x + " em" for x in sel.split(",")) + "{color:#22863A}")
        r.append(at("lvstage", i + 1, f".lc{i}")
                 + "{background:#FFF6E2;box-shadow:inset 3px 0 0 #E8A13A}")
        r.append(at("lvstage", i + 1, f".lv-s{i}") + "{display:block}")
    r.append(at("lvstage", 1, ".lv-s0") + "{display:block}")
    r.append(at("lvstage", nl + 2, ".lv-s" + str(nl)) + "{display:block}")
    r.append(at("lvstage", nl + 2, ".lv-out") + "{opacity:1}")
    r.append(at("lvstage", nl + 2, ".b2-row") + "{opacity:1;transform:none}")
    # task 3
    r.append(fr("mistage", 2, 4, ".mi-ta span") + "{opacity:1}")
    r.append(fr("mistage", 3, 4, ".mi-tb span") + "{opacity:1}")
    r.append(at("mistage", 4, ".mi-fix") + "{opacity:1}")
    # exit
    r.append(at("exstage", 2, ".ex-why") + "{display:block}")
    r.append(at("exstage", 2, ".ex-o:not(.ok)") + "{opacity:.55}")
    r.append(at("exstage", 2, ".ex-o.ok") + "{border-color:#9FD8B8;background:#EFFAF3;opacity:1}")
    # takeaways: card k fills on press k, the newest one lifted
    t = len(P.TK)
    for k in range(1, t + 1):
        r.append(fr("tkg", k, t, f".tg{k}") + "{border-style:solid;border-color:#E2E9EF;background:#FFFFFF}")
        r.append(fr("tkg", k, t, f".tg{k} .tg-in") + "{opacity:1;transform:none}")
        r.append(fr("tkg", k, t, f".tg{k} .tg-n") + "{opacity:0}")
        r.append(at("tkg", k, f".tg{k}") + "{border-color:var(--c);box-shadow:0 6px 18px rgba(0,60,100,.10)}")
    # the poll: one title per program
    for k in range(1, len(P.POLL) + 1):
        r.append(f"{at('pollstage', 2 * k - 1, f'.pt{k}')},{at('pollstage', 2 * k, f'.pt{k}')}"
                 "{display:inline}")
    return "\n".join(r)


def extra_js():
    return WK.JS + SH.JS + FL.JS
