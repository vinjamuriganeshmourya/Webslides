"""Every card in session 16, in presentation order.

Deck slides are the deck's own flat artwork, inlined. Panels wear the deck's
header: the accent bar, a grey eyebrow, a blue title and the rule along the
bottom. The spine cards come from the skill and are never redrawn here.
"""
import base64
import html
import pathlib
import sys

import agenda as A
import codecard as CODE
import hook as H
import panels as P
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
def card_s7():
    return slide(7, "Nested loops: the shape")


def card_s9():
    return slide(9, "The outer loop's repeating block")


def card_s11():
    return slide(11, "The inner loop's repeating block")


def card_s12():
    return slide(12, "Nested loops: example code")


# ============================================================= the explainer
def card_explainer():
    n, stop = P.EXPL_DEFAULT
    ev = P.expl_variants()[f"{n},{stop}"]
    assert ev == P.expl_events()
    body = WK.walk(
        "wk-expl", P.EXPL_SRC, "loops.py", ev, ["a", "b"],
        [("a", "range(3)"), ("b", "range(7, 9)")],
        ask="Before we press: how many lines will this print? Say a number.",
        tiles=[("outer", "outer passes"), ("inner", "inner lines")],
        variants=P.expl_variants(),
        knobs=[("n", "outer: range(n), n =", min(P.EXPL_NS), max(P.EXPL_NS), n),
               ("stop", "inner: range(7, stop), stop =", min(P.EXPL_STOPS),
                max(P.EXPL_STOPS), stop)],
        slots=[("(3):", '(<span class="wk-slot" data-slot="n">3</span>):'),
               ("(7, 9):", '(7, <span class="wk-slot" data-slot="stop">9</span>):')])
    return pcard("Follow both loops",
                 anim("stage-expl", "wkstage", "Code walkthrough",
                      "Follow both loops", body, WK.steps(ev), nxt="One step"),
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


def machine_body():
    panes = ""
    for n, lv in enumerate(P.MACHINE, 1):
        ans = P.machine_answer(lv)
        right = P.machine_right(lv)
        opts = "".join(
            f'<li class="mc-o{" ok" if i == right else ""}"><i>{"ABCD"[i]}</i>'
            f'<b>{v}</b></li>' for i, v in enumerate(lv["opts"]))
        why = "".join(f'<li><b>{v}:</b> {html.escape(lv["why"][v])}</li>'
                      for v in lv["opts"] if v != ans)
        legend = ('<p class="mc-key"><span class="mc-dot kd"></span> done '
                  '<span class="mc-dot ki"></span> a star</p>' if lv["id"] == "m4"
                  else '<p class="mc-key"><span class="mc-dot ko"></span> row '
                  '<span class="mc-dot ki"></span> a star</p>' if lv["id"] == "m2"
                  else '')
        panes += (
            f'<div class="mc-lv mc-lv{n}">'
            f'<div class="mc-l"><p class="mc-tag">{lv["tag"]} of 4</p>'
            f'{CODE.card(lv["src"], "level" + str(n) + ".py")}'
            f'<p class="stage-q">{html.escape(lv["q"])}</p>'
            f'<ul class="mc-opts">{opts}</ul></div>'
            f'<div class="mc-r"><div class="mc-grid">{_dots(lv["rows"]())}</div>'
            f'{legend}'
            f'<p class="mc-ans"><b>{ans}</b> {"times" if lv["id"] == "m4" else "lines"}</p>'
            f'<ul class="mc-why">{why}</ul></div></div>')
    return f'<div class="mc">{panes}</div>'


def card_machine():
    steps = 2 * len(P.MACHINE)
    labels = "|".join(f"level {n} {w}" for n in range(1, 5) for w in ("vote", "run"))
    return pcard("The loop counter machine",
                 anim("stage-mc", "mcstage", "Predict, then run",
                      "How many times does it run?", machine_body(), steps, labels),
                 activity=21)


def card_quiz():
    return pcard("Classroom quiz on the portal", S.quiz(), activity=9)


# ======================================================== the second hook
def card_why():
    return pcard("Why a loop inside a loop?",
                 anim("stage-why", "wystage", "Before the question",
                      "Why a loop inside a loop?", WY.body(), WY.STEPS, WY.LABELS))


def card_s33():
    return slide(33, "Triangular pattern with numbers")


def card_s34():
    return slide(34, "Input format")


def card_s35():
    return slide(35, "Output format")


# =========================================================== task 2: build it
def card_task2():
    code = CODE.card(P.TRI_BLANK, "triangle.py", hi=(4,))
    fixed = CODE.card(P.TRI_SRC, "triangle.py", hi=(4,))
    rows = "".join(f'<span class="b2-row" style="--d:{i}">{html.escape(r.rstrip())}</span>'
                   for i, r in enumerate(P.tri_out()))
    body = (
        '<div class="b2">'
        f'<div class="b2-l"><div class="b2-code b2-c1">{code}</div>'
        f'<div class="b2-code b2-c2">{fixed}</div></div>'
        '<div class="b2-r">'
        '<p class="pill">Worksheet &middot; Task 2</p>'
        '<ol class="tk1-steps">'
        '<li>Type the <b>start</b> and the <b>stop</b> for line 4 in Task 2.</li>'
        '<li>Before you run it with 3, type what it prints.</li>'
        '<li>Now type the program and run it with 3, then with 4.</li>'
        '</ol>'
        f'<div class="tk1-t">{tmr(480)}</div>'
        '<div class="b2-out"><span class="wy-lab">It prints, for 3</span>'
        f'<pre class="b2-term">{rows}</pre></div>'
        '</div></div>')
    return pcard("Worksheet task 2: build it",
                 anim("stage-b2", "b2stage", "Worksheet &middot; Task 2",
                      "You write the inner range", body, 3,
                      "the task|the range|what it prints"),
                 sheet="task 2", activity=11)


# ============================================================ task 3: two mistakes
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
        '<p class="mi-ask">Both programs get input <b>3</b>. On your worksheet, '
        'type what each one prints. Then run them.</p>'
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
    return pcard("Worksheet task 3: two mistakes",
                 anim("stage-mi", "mistage", "Possible mistakes",
                      "Predict, then run", body, 4,
                      "predict|program A|program B|the fixes"),
                 sheet="task 3", activity=2)


def card_s36():
    return slide(36, "Possible mistake: wrong iteration")


def card_s37():
    return slide(37, "A while loop inside a for loop")


def card_s38():
    return slide(38, "A for loop inside a while loop")


def card_s39():
    return slide(39, "A while loop inside a while loop")


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
CHIPS = ['#006DAF', '#6A48C0', '#C77700', '#1F9D62', '#C7454E']


def card_takeaways():
    rows = ""
    for k, (chip, code, got, why) in enumerate(P.tk_rows(), 1):
        code_html = "".join(f'<span class="tk-cl">{html.escape(c)}</span>'
                            for c in code.split("\n"))
        rows += (f'<div class="trow tr{k}"><div class="tin">'
                 f'<span class="tchip" style="background:{CHIPS[k - 1]}">'
                 f'{html.escape(chip)}</span>'
                 f'<span class="tex tk-code">{code_html}</span>'
                 f'<span class="tarr">&rarr;</span>'
                 f'<span class="tout">{html.escape(got)}</span>'
                 f'<span class="twhy">{html.escape(why)}</span></div></div>')
    body = f'<div class="tkboard"><div class="trows">{rows}</div></div>'
    return pcard("Key takeaways: five examples",
                 anim("stage-tk", "tk", "Key takeaways",
                      "Nested loops, in five examples", body, len(P.TK)))


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

/* ---- task 2: the blank range, then the answer, then what it prints ---- */
.b2{flex:1;min-height:0;display:flex;gap:26px}
.b2-l{flex:0 0 55%;min-width:0;display:grid;align-content:center}
.b2-code{grid-area:1/1;transition:opacity 260ms var(--ease-out)}
.b2-c2{opacity:0}
.b2-r{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.b2-out{margin-top:12px;opacity:0;transition:opacity 240ms var(--ease-out)}
.b2-term{margin:0;padding:12px 14px;border-radius:10px;background:#F6F8FA;
  border:1px solid #DDE5EC;font:20px/1.6 var(--mono);color:#1B2530;min-height:4.8em}
.b2-row{display:block;opacity:0;transform:translateY(6px);
  transition:opacity 220ms var(--ease-out) calc(var(--d)*260ms),
  transform 220ms var(--ease-out) calc(var(--d)*260ms)}
body.present .b2-term{font-size:clamp(16px,1.8vw,30px)}
body.present .b2 .cx{font-size:clamp(13px,1.55vw,26px)}
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

/* ---- the takeaway board: two-line code in each row ---- */
.tk-code{display:flex;flex-direction:column;font-size:15px}
.tk-cl{white-space:pre}
.tk .twhy{flex:1 1 30%}
body.present .tk-code{font-size:clamp(13px,1.35vw,22px)}
body.present .tk .tout{font-size:clamp(13px,1.35vw,22px)}
@media (prefers-reduced-motion:reduce){
  .mc *,.b2 *,.mi *,.ex *{transition:none !important}
}
"""]
    # the machine: level k is up on presses 2k-1 and 2k; the run press fills it
    n = 2 * len(P.MACHINE)
    for k in range(1, len(P.MACHINE) + 1):
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
    # task 2
    r.append(fr("b2stage", 2, 3, ".b2-c1") + "{opacity:0}")
    r.append(fr("b2stage", 2, 3, ".b2-c2") + "{opacity:1}")
    r.append(at("b2stage", 3, ".b2-out") + "{opacity:1}")
    r.append(at("b2stage", 3, ".b2-row") + "{opacity:1;transform:none}")
    # task 3
    r.append(fr("mistage", 2, 4, ".mi-ta span") + "{opacity:1}")
    r.append(fr("mistage", 3, 4, ".mi-tb span") + "{opacity:1}")
    r.append(at("mistage", 4, ".mi-fix") + "{opacity:1}")
    # exit
    r.append(at("exstage", 2, ".ex-why") + "{display:block}")
    r.append(at("exstage", 2, ".ex-o:not(.ok)") + "{opacity:.55}")
    r.append(at("exstage", 2, ".ex-o.ok") + "{border-color:#9FD8B8;background:#EFFAF3;opacity:1}")
    # takeaways
    t = len(P.TK)
    for k in range(1, t + 1):
        r.append(fr("tk", k, t, f".tr{k}") + "{border-style:solid;border-color:#E2E9EF;background:#FFFFFF}")
        r.append(fr("tk", k, t, f".tr{k} .tin") + "{opacity:1;transform:none}")
    return "\n".join(r)


def extra_js():
    return WK.JS
