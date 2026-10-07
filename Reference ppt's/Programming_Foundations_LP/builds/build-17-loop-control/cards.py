"""Every card in session 17, in presentation order.

Deck slides are the deck's own flat artwork, inlined. Panels wear the deck's
header: the accent bar, a grey eyebrow, a blue title and the rule along the
bottom. The spine cards come from the skill and are never redrawn here.

Every output on every card is read off `panels`, which runs the programs for
real. Nothing printed on a card is typed by hand.
"""
import base64
import html
import pathlib
import sys

import agenda as A
import codecard as CODE
import hook as H
import intro as IC
import panels as P
import walk as WK
import why as WY

MEDIA = pathlib.Path(__file__).parent / "media"
SKILL = pathlib.Path.home() / ".claude" / "skills" / "prog-lesson-plan"
sys.path.insert(0, str(SKILL / "assets"))
from standard_slides import Spine  # noqa: E402

S = Spine(str(SKILL / "assets" / "standard-slides"))
SESSION_NAME = "Loop Control Statements"


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


def animctl(nxt="Next"):
    return ('<div class="stage-ctl"><button type="button" data-anim-next>'
            f'{nxt}</button><button type="button" class="ghost" data-anim-replay>'
            'Replay</button><span class="ctl-count" data-anim-count></span>'
            '</div>')


def anim(sid, cls, eyebrow, title, body, steps, labels="", nxt="Next"):
    return (f'<div class="stage {cls}" id="{sid}" data-anim="{steps}" '
            f'data-anim-labels="{labels}">{slhead(eyebrow, title)}{body}'
            f'{animctl(nxt)}{RULE}</div>')


def tmr(secs):
    return f'<span class="tmr" data-secs="{secs}"></span>'


def fr(cls, k, n, sel):
    """`sel` on stage class `cls` from step k to step n. an-N is exclusive."""
    return ",".join(f".{cls}.an-{j} {sel}" for j in range(k, n + 1))


def at(cls, k, sel):
    return f".{cls}.an-{k} {sel}"


def term(lines, cls=""):
    rows = "".join(f'<span class="tr" style="--d:{i}">{html.escape(s) or "&nbsp;"}</span>'
                   for i, s in enumerate(lines))
    return f'<pre class="rterm {cls}">{rows}</pre>'


# =================================================================== opening
def card_welcome():
    return pcard("Welcome", S.welcome())


def card_recap_title():
    return pcard("Recap", S.recap_title())


def card_recap():
    """`bug`: 14 used match, 15 sort, 16 rapid. Session 16's own daily
    challenge, with its range already fixed so one line is to blame."""
    return pcard("Recap: the row that counts the wrong way",
                 S.recap("bug", title=P.RECAP_TITLE, eyebrow="Recap",
                         ask=P.RECAP_ASK,
                         lines=P.RECAP_SRC.split("\n"),
                         wrong=P.recap_show(P.recap_wrong()),
                         right=P.recap_show(P.recap_right()),
                         culprit=P.RECAP_CULPRIT, why=P.RECAP_WHY),
                 activity=1)


def card_hook():
    return pcard("Hook: the PIN that keeps asking",
                 anim("stage-hook", "hkstage", "Programming Foundations",
                      "The PIN that keeps asking", H.body(), H.STEPS, H.LABELS),
                 animated="hook")


def card_title():
    """Nothing before this card prints the session's name."""
    return pcard("Today", S.title_card(SESSION_NAME))


def card_agenda():
    return pcard("The plan",
                 anim("stage-agenda", "agstage", "Agenda for today's session",
                      SESSION_NAME, A.body(), A.STEPS, A.LABELS))


# ==================================================================== break
def card_intro():
    """Slide 14, redrawn and stepped: one small program per press."""
    return pcard("Control statements",
                 anim("stage-ic", "icstage", "Loops", "Control Statements",
                      IC.body(), IC.STEPS, IC.LABELS),
                 animated="concept")


def card_s15():
    return slide(15, "Break")


def card_s16():
    return slide(16, "Break: leave a loop early")


def card_s17():
    return slide(17, "Break, when a condition is true")


def card_explainer():
    r = P.expl()
    body = WK.walk(
        "wk-expl", P.EXPL_SRC, "break.py", r["events"], ["i"],
        [("i", "range(10)")],
        ask="Before we press: what will this print? Say it out loud.",
        variants=P.expl_variants(),
        knobs=[("n", "break when i ==", min(P.EXPL_STOPS), max(P.EXPL_STOPS),
                P.EXPL_DEFAULT)],
        slots=[("== 2:", '== <span class="wk-slot" data-slot="n">2</span>:')])
    assert P.expl_variants()[str(P.EXPL_DEFAULT)] == r["events"]
    return pcard("Follow the break",
                 anim("stage-expl", "wkstage", "Code walkthrough",
                      "Follow the break", body, WK.steps(r["events"]),
                      nxt="One step"),
                 animated="explainer")


def card_first_line():
    """Slides 31 and 32, walked: break is the first line of the body."""
    r = P.trace(P.S31_SRC)
    ev = [dict(e) for e in r["events"]]
    for e in ev:
        if e["l"] == 3:
            e["say"] = ("break is the first line of the body. The loop ends here, "
                        "before print(i) can run.")
        if e["l"] == 6:
            e["say"] = "It prints End. Lines 4 and 5 never ran, and i stays 0."
    body = WK.walk("wk-first", P.S31_SRC, "first_line.py", ev, ["i"], [],
                   ask="break is the first line inside the loop. What will this print?")
    return pcard("Break as the very first line",
                 anim("stage-first", "wkstage", "Code walkthrough",
                      "Break as the very first line", body, WK.steps(ev),
                      nxt="One step"),
                 animated="concept")


def card_outside():
    """Slides 33, 34 and 74, redrawn: break and continue outside a loop."""
    b, c = P.out_break_error(), P.out_cont_error()
    body = (
        '<div class="b2 os">'
        '<div class="b2-l os-l">'
        f'<div class="os-a">{CODE.card(P.OUT_BREAK_SRC, "outside.py")}</div>'
        f'<div class="os-b">{CODE.card(P.OUT_CONT_SRC, "outside2.py")}</div></div>'
        '<div class="b2-r os-r">'
        '<p class="stage-q os-q">Line 3 is <code>break</code>. What will this print?</p>'
        f'<div class="os-o os-o1"><span class="t2-lab">outside.py prints</span>'
        f'<code class="os-v">{html.escape(b)}</code></div>'
        f'<div class="os-o os-o2"><span class="t2-lab">outside2.py prints</span>'
        f'<code class="os-v">{html.escape(c)}</code></div>'
        '<p class="cap os-c os-c2">Line 3 starts at the left edge. '
        'So <b>break</b> is not inside the loop.</p>'
        '<p class="cap os-c os-c3">Python checks the whole file before line 1 runs. '
        'It finds the mistake and runs nothing. Not even 0.</p>'
        '<p class="cap os-c os-c4"><b>continue</b> is the same. '
        '<b>break and continue work only inside a loop.</b></p>'
        '</div></div>')
    return pcard("Break works only inside a loop",
                 anim("stage-os", "osstage", "Loop Control Statements",
                      "Break outside a loop", body, 4,
                      "predict|inside or outside|the error|continue too"),
                 animated="concept")


def card_s35():
    return slide(35, "Break in a nested loop")




# ========================================================== worksheet task 1
def card_task1():
    r = P.task1()
    rows = "".join(f'<span class="gh-row"><i>{n}</i><b></b><b></b><b></b><b></b></span>'
                   for n in range(1, P.TASK1_ROWS + 1))
    intro = (
        '<div class="tk1">'
        '<p class="pill">Worksheet &middot; Task 1</p>'
        '<ol class="tk1-steps">'
        '<li>Open <b>Task 1</b> on your worksheet.</li>'
        f'<li>Fill one row <b>each time line {P.TASK1_IF_LINE} runs</b>: a, b, '
        'does the break run, and what line 6 prints.</li>'
        '<li>Then type everything it prints, in order.</li>'
        '<li>Do not run it. Keyboards off when the timer ends.</li>'
        '</ol>'
        f'<div class="gh-table"><span class="gh-row gh-h"><i>row</i><b>a</b><b>b</b>'
        f'<b>break?</b><b>prints</b></span>{rows}</div>'
        f'<div class="tk1-t">{tmr(300)}</div></div>')
    body = WK.walk(
        "wk-task1", P.TASK1_SRC, "task1.py", r["events"], ["a", "b"],
        [("a", "range(2)"), ("b", "range(4)")],
        ask="", intro=intro)
    return pcard("Worksheet task 1: trace it, then check it",
                 anim("stage-task1", "wkstage", "Worksheet &middot; Task 1",
                      "Trace it: break inside the inner loop", body,
                      WK.steps(r["events"]), nxt="One step"),
                 sheet="task 1", activity=18)


# ========================================================== first word, task 2
def card_task2():
    full = CODE.card(P.FIRST_SRC, "first_word.py", hi=(5,))
    cut = CODE.card(P.FIRST_SRC, "first_word.py", dead=P.FIRST_CUT)
    body = (
        '<div class="b2">'
        f'<div class="b2-l"><div class="b2-code t2-c1">{full}</div>'
        f'<div class="b2-code t2-c2">{cut}</div></div>'
        '<div class="b2-r">'
        '<div class="t2-ask">'
        '<p class="pill">Worksheet &middot; Task 2</p>'
        '<div class="t2-prob"><p>Print the <b>first word</b> of a sentence '
        'in capitals.</p>'
        f'<p class="t2-io"><code>{html.escape(P.FIRST_IN)}</code><span>&rarr;</span>'
        f'<code>{html.escape(P.first_out())}</code></p></div>'
        '<ol class="tk1-steps">'
        f'<li>Type it. Input: <code>{html.escape(P.FIRST_IN)}</code></li>'
        f'<li>Delete lines {P.FIRST_CUT[0]} and {P.FIRST_CUT[1]}, the if and the '
        'break. Predict, then run.</li>'
        f'<li>Put them back. Input: <code>{P.FIRST_IN2}</code>. Predict, then run.</li>'
        '</ol>'
        '<p class="t2-rule"><b>Type your answer first.</b> Then run.</p>'
        f'<div class="tk1-t">{tmr(360)}</div></div>'
        '<div class="t2-out">'
        + "".join(
            f'<div class="t2-o t2-o{k}"><span class="t2-lab">{lab}</span>'
            f'<code class="t2-v">{html.escape(val)}</code></div>'
            for k, (lab, val) in enumerate([
                ("Step 1, as it is", P.first_out()),
                ("Step 2, no if and no break", P.first_cut_out()),
                (f"Step 3, input {P.FIRST_IN2}", P.first_out(P.FIRST_IN2))], 1))
        + '<p class="cap t2-why">Without the break, the loop does not stop at the '
          'space, so every letter joins first_word.</p>'
        '</div></div></div>')
    return pcard("Worksheet task 2: type it, then take the break out",
                 anim("stage-t2", "t2stage", "Worksheet &middot; Task 2",
                      "First word in uppercase", body, 4,
                      "the task|step 1|step 2, no break|step 3, one word"),
                 sheet="task 2", activity=19)


def card_quiz():
    return pcard("Classroom quiz on the portal", S.quiz(), activity=10)


# ======================================================== the second hook
def card_why():
    return pcard("Hook: a reel you swipe away",
                 anim("stage-why", "wystage", "Before the next word",
                      "A reel you swipe away", WY.body(), WY.STEPS, WY.LABELS),
                 animated="why")


def card_s57():
    return slide(57, "Continue")


def card_s58():
    return slide(58, "Continue: skip the rest of this pass")


def card_s59():
    return slide(59, "Continue, when a condition is true")


# =========================================================== the machine
def machine_body():
    panes = ""
    for n, lv in enumerate(P.MACHINE, 1):
        r = P.machine_run(lv)
        right = P.machine_right(lv)
        hit = {e["l"] for e in r["events"]}
        nlines = len(lv["src"].split("\n"))
        dead = () if r["error"] else tuple(i for i in range(1, nlines + 1) if i not in hit)
        opts = "".join(
            f'<li class="mc-o{" ok" if i == right else ""}"><i>{"ABCD"[i]}</i>'
            f'<b>{html.escape(v)}</b></li>' for i, v in enumerate(lv["opts"]))
        why = "".join(f'<li><b>{html.escape(v)}:</b> {html.escape(lv["why"][v])}</li>'
                      for v in lv["opts"] if v in lv["why"])
        if r["error"]:
            out = term([r["error"]], "mc-err")
        elif r["forever"]:
            out = term(r["out"][:1] + ["... still running. It never stops."], "mc-ever")
        else:
            out = term(r["out"])
        panes += (
            f'<div class="mc-lv mc-lv{n}{" mc-bad" if r["error"] else ""}">'
            f'<div class="mc-l"><p class="mc-tag">Level {n} of {len(P.MACHINE)} '
            f'&middot; {html.escape(lv["tag"])}</p>'
            f'<div class="mc-code">{CODE.card(lv["src"], f"level{n}.py")}</div>'
            f'<div class="mc-dead">{CODE.card(lv["src"], f"level{n}.py", dead=dead)}</div>'
            '</div>'
            '<div class="mc-r"><p class="stage-q">What does it print?</p>'
            f'<ul class="mc-opts">{opts}</ul>'
            f'<div class="mc-run">{out}<ul class="mc-why">{why}</ul></div></div></div>')
    return f'<div class="mc">{panes}</div>'


def card_machine():
    steps = 2 * len(P.MACHINE)
    labels = "|".join(f"level {n} {w}" for n in range(1, len(P.MACHINE) + 1)
                      for w in ("vote", "run"))
    return pcard("The break or continue machine",
                 anim("stage-mc", "mcstage", "Predict, then run",
                      "Break or continue: what prints?", machine_body(), steps, labels),
                 activity=21)


# ==================================================================== pass
def card_s75():
    return slide(75, "Pass")


def card_s76():
    return slide(76, "Pass: a block that does nothing")


def card_s77():
    return slide(77, "Pass: code with empty blocks")


def card_s78():
    return slide(78, "Pass: you cannot leave a block empty")


def card_s84():
    return slide(84, "Pass inside a loop")


def card_task3():
    cards = "".join(
        f'<div class="b2-code t3-c t3-c{k}">'
        f'{CODE.card(P.t3_src(w), "task3.py", hi=(4,))}</div>'
        for k, w in enumerate(P.T3_WORDS, 1))
    outs = "".join(
        f'<div class="t3-o t3-o{k}"><code class="t3-w">{w}</code>'
        f'<span class="t3-v">{html.escape(P.shown(P.t3_out(w)))}</span></div>'
        for k, w in enumerate(P.T3_WORDS, 1))
    body = (
        '<div class="b2">'
        f'<div class="b2-l"><div class="b2-code t3-c0">'
        f'{CODE.card(P.T3_SRC, "task3.py", hi=(4,))}</div>{cards}</div>'
        '<div class="b2-r">'
        '<p class="pill">Worksheet &middot; Task 3</p>'
        '<ol class="tk1-steps">'
        f'<li>Type it. The input is <b>{P.T3_IN}</b>.</li>'
        '<li>Line 4 is <code>pass</code>. Predict, then run.</li>'
        '<li>Change it to <code>continue</code>. Predict, then run.</li>'
        '<li>Change it to <code>break</code>. Predict, then run.</li>'
        '</ol>'
        f'<div class="tk1-t">{tmr(300)}</div>'
        f'<div class="t3-outs">{outs}</div>'
        '</div></div>')
    return pcard("Worksheet task 3: pass, continue or break",
                 anim("stage-t3", "t3stage", "Worksheet &middot; Task 3",
                      "One line, three words", body, 4,
                      "the task|pass|continue|break"),
                 sheet="task 3", activity=2)


# ================================================================= the exit
def card_exit():
    right = P.exit_right()
    opts = "".join(
        f'<li data-k="{"ABCD"[i]}" class="ex-o{" ok" if i == right else ""}">'
        f'<code>marks = {html.escape(repr(v))}</code><span class="ex-why">'
        f'{html.escape(P.EXIT_WHY[tuple(v)])}</span></li>'
        for i, v in enumerate(P.EXIT_OPTS))
    body = (
        '<div class="ex">'
        '<div class="ex-l"><p class="ex-story">A results app reads marks until it '
        'meets a minus number. It shows only the pass marks.</p>'
        f'{CODE.card(P.EXIT_SRC, "results.py")}'
        '<p class="stage-q">Which list makes it show <b>nothing at all</b>?</p>'
        f'<div class="tk1-t">{tmr(150)}</div></div>'
        f'<div class="ex-r"><ul class="vopts">{opts}</ul></div></div>')
    return pcard("Exit: one question",
                 anim("stage-exit", "exstage", "Exit question",
                      "Which list shows nothing?", body, 2, "vote|answer"),
                 activity=10)


# ============================================================ the takeaways
CHIPS = ['#6B7A86', '#C77700', '#D6453D', '#6A48C0', '#006DAF']


def card_takeaways():
    rows = ""
    tk = P.tk_rows()
    for k, (chip, code, got, why) in enumerate(tk, 1):
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
                      "break, continue and pass, in five examples", body, len(tk)))


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
.tk1-steps code,.t2-rule code{font:700 .95em var(--mono);color:var(--dk-blue)}
.tk1-t{margin:6px 0 0}
body.present .tk1-steps{font-size:clamp(14px,1.5vw,24px)}
body.present .pill{font-size:clamp(12px,1.2vw,19px)}

/* a terminal that fills one line at a time on its press */
.rterm{margin:0;padding:12px 14px;border-radius:10px;background:#F6F8FA;
  border:1px solid #DDE5EC;font:19px/1.55 var(--mono);color:#1B2530;min-height:3.4em;
  white-space:pre-wrap}
.rterm .tr{display:block;opacity:0;transform:translateY(6px);
  transition:opacity 200ms var(--ease-out) calc(var(--d)*170ms),
  transform 200ms var(--ease-out) calc(var(--d)*170ms)}
.rterm.mc-err{border-color:#E8A9A5;background:#FDF1F1;color:#B3261E}
.rterm.mc-ever .tr:last-child{color:#C77700;font-family:var(--sans);font-weight:700}
body.present .rterm{font-size:clamp(14px,1.55vw,26px)}

/* the task 1 table, drawn empty while the room fills its own */
.gh-table{display:flex;flex-direction:column;gap:6px;margin:0 0 10px}
.gh-row{display:flex;gap:6px}
.gh-row i,.gh-row b{flex:1;height:28px;border-radius:6px;border:2px dashed #E1E8EE;
  background:#FBFCFD;font:700 14px/24px var(--sans);font-style:normal;color:#8B98A5;
  text-align:center}
.gh-row i{flex:0 0 3em}
.gh-h i,.gh-h b{border:0;background:none}
body.present .gh-row i,body.present .gh-row b{height:clamp(22px,3.2vh,40px);
  font-size:clamp(11px,1.15vw,18px);line-height:clamp(18px,2.8vh,36px)}

/* ---- the machine: one level at a time, vote then run ---- */
.mc{flex:1;min-height:0;display:grid}
.mc-lv{grid-area:1/1;min-width:0;display:flex;gap:26px;opacity:0;visibility:hidden;
  transition:opacity 240ms var(--ease-out)}
.mc-l{flex:0 0 48%;min-width:0;display:grid;align-content:center}
.mc-tag{grid-area:1/1;align-self:start;margin:0 0 8px;font:700 14px var(--sans);
  color:#7A8794;letter-spacing:.04em;text-transform:uppercase}
.mc-code,.mc-dead{grid-area:2/1;transition:opacity 260ms var(--ease-out)}
.mc-dead{opacity:0}
.mc-r{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.mc-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:4px 0 12px;padding:0;
  list-style:none}
.mc-o{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;
  border:2px solid #D5DEE5;background:#fff;transition:opacity 240ms var(--ease-out),
  background-color 240ms var(--ease-out),border-color 240ms var(--ease-out)}
.mc-o i{font:800 15px var(--sans);font-style:normal;color:#7A8794}
.mc-o b{font:800 19px var(--mono);color:var(--dk-blue)}
.mc-run{opacity:1}
.mc-run .rterm:not(.mc-err)::before{content:'output';color:#A7B0BA;font-size:.8em}
.mc-why{margin:10px 0 0;padding-left:1.1em;font:15px/1.45 var(--sans);color:var(--dk-text);
  opacity:0;transition:opacity 240ms var(--ease-out) 500ms}
.mc-why li{margin:0 0 4px}
.mc-why b{font-family:var(--mono)}
@keyframes mcshake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
body.present .mc-o b{font-size:clamp(14px,1.45vw,24px)}
body.present .mc-why{font-size:clamp(12px,1.2vw,19px)}
body.present .mc-tag{font-size:clamp(11px,1.1vw,17px)}
body.present .mc .cx{font-size:clamp(13px,1.45vw,24px)}

/* ---- tasks 2 and 3: the code on the left, the answers arrive on the right ---- */
.b2{flex:1;min-height:0;display:flex;gap:26px}
.b2-l{flex:0 0 55%;min-width:0;display:grid;align-content:center}
.b2-code{grid-area:1/1;transition:opacity 260ms var(--ease-out)}
.b2-r{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.t2-c2{opacity:0}
.t2-rule{margin:0 0 8px;font:600 16px var(--sans);color:#B5650D}
.t2-out{display:none;flex-direction:column;gap:10px}
.t2-o{padding:10px 14px;border-radius:12px;border:2px dashed #E1E8EE;background:#FBFCFD;
  transition:background-color 260ms var(--ease-out),border-color 260ms var(--ease-out)}
.t2-lab{display:block;font:700 14px var(--sans);color:#7A8794}
.t2-v{display:block;margin-top:4px;font:700 19px var(--mono);color:#12633F;opacity:0;
  transition:opacity 240ms var(--ease-out)}
.t2-why{opacity:0;transition:opacity 240ms var(--ease-out)}
body.present .t2-v{font-size:clamp(14px,1.45vw,24px)}
body.present .t2-lab{font-size:clamp(11px,1.1vw,17px)}
body.present .t2-rule{font-size:clamp(13px,1.35vw,21px)}
body.present .b2 .cx{font-size:clamp(12px,1.35vw,23px)}
.t3-c{opacity:0}
.t3-outs{display:flex;flex-direction:column;gap:10px;margin-top:10px}
.t3-o{display:flex;align-items:center;gap:14px;padding:10px 14px;border-radius:12px;
  border:2px dashed #E1E8EE;background:#FBFCFD;
  transition:background-color 260ms var(--ease-out),border-color 260ms var(--ease-out)}
.t3-w{flex:0 0 6.5em;font:700 18px var(--mono);color:var(--dk-red)}
.t3-v{font:700 22px var(--mono);color:#12633F;opacity:0;transition:opacity 240ms var(--ease-out)}
body.present .t3-w{font-size:clamp(13px,1.35vw,22px)}
body.present .t3-v{font-size:clamp(15px,1.6vw,27px)}

/* ---- the exit ---- */
.ex{flex:1;min-height:0;display:flex;gap:26px}
.ex-l{flex:0 0 50%;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.ex-story{margin:0 0 10px;font:17px/1.4 var(--sans);color:var(--dk-text)}
.ex-r{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.ex .vopts{margin:0;display:flex;flex-direction:column;gap:12px}
.ex .vopts li.ex-o{margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;
  padding:12px 16px 12px 52px;position:relative;
  border-radius:12px;border:2px solid #D5DEE5;background:#fff;
  transition:opacity 240ms var(--ease-out),background-color 240ms var(--ease-out),
  border-color 240ms var(--ease-out)}
.ex-o code{font:800 22px var(--mono);color:var(--dk-blue)}
.ex .vopts li.ex-o::before{left:18px;top:15px}
.ex-why{flex:1 1 100%;font:15px/1.4 var(--sans);color:var(--dk-text);display:none}
body.present .ex-story{font-size:clamp(14px,1.5vw,24px)}
body.present .ex-o code{font-size:clamp(16px,1.8vw,30px)}
body.present .ex-why{font-size:clamp(12px,1.2vw,19px)}
body.present .ex .cx{font-size:clamp(13px,1.45vw,24px)}

/* ---- the takeaway board: two-line code in each row ---- */
.tk-code{display:flex;flex-direction:column;align-items:flex-start;font-size:15px}
.tk-cl{white-space:pre}
.tk .twhy{flex:1 1 30%}
.tk .tout{white-space:normal;max-width:18em}
body.present .tk-code{font-size:clamp(12px,1.3vw,21px)}
body.present .tk .tout{font-size:clamp(12px,1.3vw,21px)}

/* ---- break outside a loop ---- */
.os-l{display:flex;flex-direction:column;justify-content:center;gap:16px}
.os-b{opacity:.18;transition:opacity 260ms var(--ease-out)}
.os .ln{transition:background 240ms}
.os-q{margin:0 0 14px}
.os-q code{font:700 .95em var(--mono);color:#C7364A}
.os-o{margin:0 0 12px;padding:10px 14px;border-radius:12px;border:2px dashed #E1E8EE;
  background:#FBFCFD}
.os-v{display:block;margin-top:4px;font:700 19px var(--mono);color:#B3261E;opacity:0;
  transition:opacity 240ms var(--ease-out)}
.os-c{display:none;margin-top:6px}
body.present .os-v{font-size:clamp(14px,1.45vw,24px)}
/* ---- task 2: the problem, stated on the card ---- */
.t2-prob{margin:0 0 14px;padding:12px 16px;border-radius:12px;background:#F2F8FC;
  border:1px solid #D5E3EE;font:600 18px/1.4 var(--sans);color:#434343}
.t2-prob p{margin:0}
.t2-io{display:flex;align-items:center;gap:12px;margin-top:8px !important}
.t2-io code{font:700 18px var(--mono);color:#12633F;background:#fff;padding:4px 10px;
  border-radius:8px;border:1px solid #D5E3EE}
body.present .t2-prob,body.present .t2-io code{font-size:clamp(13px,1.35vw,22px)}
/* ---- the bug recap: a white editor card, not a black slab ---- */
.rcp-bug .rcp-code{justify-content:center;background:#fff;border:2px solid #DDE5EC}
.rcp-bug .rcp-line code{color:#1B2530}
.rcp-bug .rcp-o b{white-space:pre-wrap}
@media (prefers-reduced-motion:reduce){
  .mc *,.b2 *,.ex *,.rterm .tr{transition:none !important;animation:none !important}
}
"""]
    n = len(P.MACHINE)
    for k in range(1, n + 1):
        vote, run = 2 * k - 1, 2 * k
        sel = f".mc-lv{k}"
        r.append(f"{at('mcstage', vote, sel)},{at('mcstage', run, sel)}"
                 "{opacity:1;visibility:visible}")
        for part in (".mc-run", ".mc-why"):
            r.append(at("mcstage", run, f"{sel} {part}") + "{opacity:1}")
        r.append(at("mcstage", run, f"{sel} .rterm::before") + "{content:none}")
        r.append(at("mcstage", run, f"{sel} .rterm .tr") + "{opacity:1;transform:none}")
        r.append(at("mcstage", run, f"{sel} .mc-code") + "{opacity:0}")
        r.append(at("mcstage", run, f"{sel} .mc-dead") + "{opacity:1}")
        r.append(at("mcstage", run, f"{sel}.mc-bad .mc-dead")
                 + "{animation:mcshake 420ms var(--ease-out) 1}")
        r.append(at("mcstage", run, f"{sel}.mc-bad .mc-dead .edcard")
                 + "{border-color:#E8A9A5;box-shadow:0 0 0 3px rgba(214,69,61,.15)}")
        r.append(at("mcstage", run, f"{sel} .mc-o:not(.ok)") + "{opacity:.35}")
        r.append(at("mcstage", run, f"{sel} .mc-o.ok")
                 + "{border-color:#9FD8B8;background:#EFFAF3}")
    # the outside card
    r.append(fr("osstage", 2, 4, ".os-a .ln:nth-child(-n+2)")
             + "{background:#EAF6FC;box-shadow:inset 4px 0 0 #3FB5E5}")
    r.append(fr("osstage", 2, 4, ".os-a .ln:nth-child(3)")
             + "{background:#FBE3E3;box-shadow:inset 4px 0 0 #C7454E}")
    r.append(fr("osstage", 2, 4, ".os-a .ln:nth-child(3)::after")
             + "{content:'   outside the loop';color:#C7454E;font:700 .8em var(--sans)}")
    r.append(fr("osstage", 2, 4, ".os-a .ln:nth-child(2)::after")
             + "{content:'   inside the loop';color:#2A86BF;font:700 .8em var(--sans)}")
    for k in (2, 3, 4):
        r.append(at("osstage", k, f".os-c{k}") + "{display:block}")
    r.append(fr("osstage", 3, 4, ".os-o1")
             + "{border-style:solid;border-color:#E8A9A5;background:#FDF1F0}")
    r.append(fr("osstage", 3, 4, ".os-o1 .os-v") + "{opacity:1}")
    r.append(at("osstage", 3, ".os-a .edcard") + "{animation:mcshake 420ms var(--ease-out) 1}")
    r.append(at("osstage", 4, ".os-b") + "{opacity:1}")
    r.append(at("osstage", 4, ".os-b .ln:nth-child(3)")
             + "{background:#FBE3E3;box-shadow:inset 4px 0 0 #C7454E}")
    r.append(at("osstage", 4, ".os-o2")
             + "{border-style:solid;border-color:#E8A9A5;background:#FDF1F0}")
    r.append(at("osstage", 4, ".os-o2 .os-v") + "{opacity:1}")
    # task 2
    r.append(fr("t2stage", 2, 4, ".t2-ask") + "{display:none}")
    r.append(fr("t2stage", 2, 4, ".t2-out") + "{display:flex}")
    for k in (1, 2, 3):
        r.append(fr("t2stage", k + 1, 4, f".t2-o{k} .t2-v") + "{opacity:1}")
        r.append(fr("t2stage", k + 1, 4, f".t2-o{k}")
                 + "{border-style:solid;border-color:#9FD8B8;background:#EFFAF3}")
    r.append(at("t2stage", 3, ".t2-c1") + "{opacity:0}")
    r.append(at("t2stage", 3, ".t2-c2") + "{opacity:1}")
    r.append(fr("t2stage", 3, 4, ".t2-why") + "{opacity:1}")
    # task 3: the code card shows the word that line 4 holds on each press
    for k in (1, 2, 3):
        r.append(at("t3stage", k + 1, ".t3-c0") + "{opacity:0}")
        r.append(at("t3stage", k + 1, f".t3-c{k}") + "{opacity:1}")
        r.append(fr("t3stage", k + 1, 4, f".t3-o{k} .t3-v") + "{opacity:1}")
        r.append(fr("t3stage", k + 1, 4, f".t3-o{k}")
                 + "{border-style:solid;border-color:#9FD8B8;background:#EFFAF3}")
    # exit
    r.append(at("exstage", 2, ".ex-why") + "{display:block}")
    r.append(at("exstage", 2, ".ex-o:not(.ok)") + "{opacity:.55}")
    r.append(at("exstage", 2, ".ex-o.ok") + "{border-color:#9FD8B8;background:#EFFAF3;opacity:1}")
    # takeaways
    t = len(P.tk_rows())
    for k in range(1, t + 1):
        r.append(fr("tk", k, t, f".tr{k}") + "{border-style:solid;border-color:#E2E9EF;background:#FFFFFF}")
        r.append(fr("tk", k, t, f".tr{k} .tin") + "{opacity:1;transform:none}")
    return "\n".join(r) + IC.css(fr)


def extra_js():
    return WK.JS
