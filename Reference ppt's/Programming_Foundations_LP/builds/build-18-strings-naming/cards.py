"""Every card in session 18, in presentation order.

Deck slides are the deck's own flat artwork, inlined. A deck slide that the
deck builds over two or three slides (bare, then with examples) is one card
here, and each build is one press. Panels wear the deck's header. The spine
cards come from the skill and are never redrawn.

Every output on every card is read off `panels`, which runs the code for real.
"""
import base64
import html
import pathlib
import sys

import agenda as A
import cmpw as CW
import codecard as CODE
import hook as H
import panels as P
import story as SY
import why as WY

MEDIA = pathlib.Path(__file__).parent / "media"
SKILL = pathlib.Path.home() / ".claude" / "skills" / "prog-lesson-plan"
sys.path.insert(0, str(SKILL / "assets"))
from standard_slides import Spine  # noqa: E402

S = Spine(str(SKILL / "assets" / "standard-slides"))
SESSION_NAME = "Comparing Strings & Naming Variables"

EXTRA = []          # CSS rules the builders below append while they run


# ------------------------------------------------------------------ plumbing
def _b64(n):
    return base64.b64encode((MEDIA / f"sl{n}.webp").read_bytes()).decode()


def slide(n, title):
    alt = html.escape(f"Slide {n}: {title}")
    return ('<div class="slide"><div class="slide-head">'
            f'<span class="slide-no">Slide {n}</span>'
            f'<span class="slide-title">{title}</span></div>'
            f'<div class="slide-img"><img alt="{alt}" '
            f'src="data:image/webp;base64,{_b64(n)}"></div></div>')


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
    return ",".join(f".{cls}.an-{j} {sel}" for j in range(k, n + 1))


def at(cls, k, sel):
    return f".{cls}.an-{k} {sel}"


def term(lines, cls=""):
    rows = "".join(f'<span class="tr">{html.escape(s) or "&nbsp;"}</span>' for s in lines)
    return f'<pre class="rterm {cls}">{rows}</pre>'


def built(sid, nums, title, labels):
    """A deck slide the deck builds over several slides: one card, one build
    per press. Each build is the deck's own picture; the next one lays over it."""
    cls = f"bs-{sid}"
    imgs = "".join(
        f'<img class="bs-i bs-i{k}" alt="{html.escape(f"Slide {n}: {title}")}" '
        f'src="data:image/webp;base64,{_b64(n)}">'
        for k, n in enumerate(nums, 1))
    for k in range(2, len(nums) + 1):
        EXTRA.append(fr(cls, k, len(nums), f".bs-i{k}") + "{opacity:1}")
    return (f'<div class="stage bstage {cls}" id="stage-{sid}" data-anim="{len(nums)}" '
            f'data-anim-labels="{labels}"><div class="bs">{imgs}</div>'
            f'{animctl()}</div>')


def story(lbl, sid, scene, eyebrow, title, animated="concept", activity=None):
    """A deck slide redrawn as one scene between Anu and her computer."""
    body, sc, labels = scene()
    EXTRA.extend(sc.css)
    return pcard(lbl, anim(f"stage-{sid}", sc.key, eyebrow, title, body, sc.n, labels),
                 animated=animated, activity=activity)


# =================================================================== opening
def card_welcome():
    return pcard("Welcome", S.welcome())


def card_recap_title():
    return pcard("Recap", S.recap_title())


def card_recap():
    """Session 17's program, one word at a time. Line 3 becomes break, then
    continue, then pass; each time the room says the output before it shows."""
    words = P.RECAP_WORDS
    src = CODE.card(P.RECAP_SRC, "recap.py", hi=(3,))
    slot = ('<span class="rc-slot"><span class="rc-w rc-w0">____</span>'
            + "".join(f'<span class="rc-w rc-w{k}"><b>{w}</b></span>'
                      for k, w in enumerate(words, 1)) + '</span>')
    assert src.count("____") == 1
    src = src.replace("____", slot)
    cols = ""
    for k, w in enumerate(words, 1):
        out, err = P.run(P.recap_src(w))
        assert err is None and " ".join(out) == P.recap_out(w)
        lines = "".join(f"<span>{html.escape(v)}</span>" for v in out)
        cols += (f'<div class="rc-o rc-o{k}"><span class="rc-n">{k}</span><p class="rc-h">line 3 is <code>{w}</code></p>'
                 '<p class="rc-ask">What does it print?</p>'
                 f'<div class="rc-v">{lines}</div>'
                 f'<p class="rc-why">{html.escape(P.RECAP_WHY[w])}</p></div>')
    body = (f'<div class="rc"><div class="rc-l">{src}'
            '<p class="stage-q rc-q">Line 3 changes three times. Each time, say the '
            'output before the next press.</p></div>'
            f'<div class="rc-r">{cols}</div></div>')
    n = 1 + 2 * len(words)
    for k in range(1, len(words) + 1):
        ask, show = 2 * k, 2 * k + 1
        EXTRA.append(fr("rcstage", ask, show, f".rc-w{k}") + "{opacity:1;transform:none}")
        EXTRA.append(fr("rcstage", ask, n, ".rc-w0") + "{opacity:0}")
        EXTRA.append(fr("rcstage", ask, n, f".rc-o{k}")
                     + "{border-style:solid;border-color:#9CCBEA;background:#fff}")
        EXTRA.append(at("rcstage", ask, f".rc-o{k} .rc-ask") + "{opacity:1}")
        EXTRA.append(fr("rcstage", ask, n, f".rc-o{k} .rc-h") + "{opacity:1}")
        EXTRA.append(fr("rcstage", ask, n, f".rc-o{k} .rc-n") + "{opacity:0}")
        EXTRA.append(fr("rcstage", show, n, f".rc-o{k} .rc-v span") + "{opacity:1;transform:none}")
        EXTRA.append(fr("rcstage", show, n, f".rc-o{k} .rc-why") + "{opacity:1}")
        EXTRA.append(fr("rcstage", show, n, f".rc-o{k}")
                     + "{border-color:#9FD8B8;background:#EFFAF3}")
    EXTRA.append(fr("rcstage", n, n, ".rc-w3") + "{opacity:1;transform:none}")
    labels = "the program|" + "|".join(f"{w}: guess|{w}: output" for w in words)
    st = anim("stage-recap", "rcstage", "Recap", "What does it print?", body, n, labels)
    # a rapid recap in the spine's sense: one question per press, answer on the next
    tag = 'class="stage rcstage" id="stage-recap"'
    assert st.count(tag) == 1
    st = st.replace(tag, tag + ' data-recap="rapid"')
    return pcard("Recap: one program, three words", st, activity=1)


def card_hook():
    return pcard("Hook: the password that says wrong",
                 anim("stage-hook", "hkstage", "Programming Foundations",
                      "The password that says wrong", H.body(), H.STEPS, H.LABELS),
                 animated="hook")


def card_title():
    """Nothing before this card prints the session's name."""
    return pcard("Today", S.title_card(SESSION_NAME))


def card_agenda():
    return pcard("The plan",
                 anim("stage-agenda", "agstage", "Agenda for today's session",
                      SESSION_NAME, A.body(), A.STEPS, A.LABELS))


# ================================================================== unicode
def card_s8():
    return story("Unicode: what you see, what it stores", "uni", SY.unicode_scene,
                 "Python", "Unicode")


def card_ord():
    return story("ord(): the number behind a character", "ord", SY.ord_scene,
                 "Unicode", "Finding Unicode Value")


def card_chr():
    return story("chr(): the character behind a number", "chr", SY.chr_scene,
                 "Unicode", "Character at Unicode")


def card_s13():
    return story("Unicode ranges", "ranges", SY.ranges_scene, "Unicode", "Unicode Ranges")


def card_s14():
    return story("Printing A to Z with a loop", "loop", SY.loop_scene,
                 "Finding Char", "Printing Characters")


# ========================================================== worksheet task 1
def card_task1():
    rows = ""
    for k, (_key, src) in enumerate(P.T1, 1):
        out = " ".join(P.t1_out(k - 1))
        rows += (f'<div class="t1-row t1-r{k}">'
                 f'<span class="t1-n">{k}</span>'
                 f'<div class="t1-c">{CODE.card(src, f"task1_{k}.py")}</div>'
                 f'<div class="t1-o"><span class="t2-lab">prints</span>'
                 f'<code class="t1-v">{html.escape(out)}</code></div></div>')
    body = (
        '<div class="t1">'
        f'<div class="t1-rows">{rows}</div>'
        '<div class="t1-side">'
        '<p class="pill">Worksheet &middot; Task 1</p>'
        '<ol class="tk1-steps">'
        '<li>Open <b>Task 1</b> on your worksheet.</li>'
        '<li>For each program, type <b>what you think it prints</b>.</li>'
        '<li>Then type it in the playground and run it.</li>'
        '<li>Type what it really printed. Do not change your guess.</li>'
        '</ol>'
        f'<div class="tk1-t">{tmr(300)}</div>'
        '<p class="cap t1-why">A small letter is always 32 more than its capital. '
        'So chr(ord("g") - 32) is G.</p>'
        '</div></div>')
    for k in range(1, 4):
        EXTRA.append(fr("t1stage", k + 1, 4, f".t1-r{k} .t1-v") + "{opacity:1}")
        EXTRA.append(fr("t1stage", k + 1, 4, f".t1-r{k} .t1-o")
                     + "{border-style:solid;border-color:#9FD8B8;background:#EFFAF3}")
    EXTRA.append(at("t1stage", 4, ".t1-why") + "{opacity:1}")
    return pcard("Worksheet task 1: predict the letters, then run",
                 anim("stage-t1", "t1stage", "Worksheet &middot; Task 1",
                      "Predict it, then run it", body, 4,
                      "the task|program 1|program 2|program 3"),
                 sheet="task 1", activity=19)


# ================================================================ comparing
def card_s19():
    return story("Compared character by character", "cmp", SY.compare_scene,
                 "Relational Operators", "Comparing Strings")


def card_explainer():
    """Slide 19's own example first. The slider changes the second word; each
    word is predicted out loud before the first press."""
    a, op, _b = P.EXPL
    words = P.EXPL_WORDS
    assert words[0] == P.EXPL[2]
    n = max(len(P.compare_walk(a, w)) for w in words)
    N = n + 1
    codes, walks = "", ""
    for v, w in enumerate(words):
        wd, _k, _ans = CW.widget(f"cw-e{v}", a, op, w, "cxstage", 2, EXTRA, upto=N)
        codes += f'<div class="cx-v cx-v{v}">{CODE.card(P.cmp_src(a, op, w), "compare.py")}</div>'
        walks += f'<div class="cx-v cx-v{v}">{wd}</div>'
        EXTRA.append(f'.cxstage[data-w="{v}"] .cx-v{v}' + "{display:block}")
    knob = (f'<label class="cx-knob"><span>the second word</span>'
            f'<input type="range" min="0" max="{len(words) - 1}" step="1" value="0" '
            'data-w="0" aria-label="the second word">'
            f'<span class="cx-words">{"".join(f"<i>{html.escape(w)}</i>" for w in words)}</span>'
            '</label>')
    body = (
        '<div class="cx2">'
        '<div class="cx2-l">'
        f'{codes}'
        '<p class="stage-q cx2-q">Before we press: True or False? Say it out loud.</p>'
        '<p class="cap cx2-rule">Python starts at the left. It looks at one pair of '
        'letters at a time, and stops at the first pair that is different.</p>'
        f'{knob}</div>'
        f'<div class="cx2-r">{walks}</div></div>')
    EXTRA.append(fr("cxstage", 2, N, ".cx2-q") + "{display:none}")
    EXTRA.append(fr("cxstage", 2, N, ".cx2-rule") + "{opacity:1}")
    labels = "predict|" + "|".join(f"pair {i + 1}" for i in range(n))
    n = N - 1
    st = anim("stage-expl", "cxstage", "Comparing Strings",
              "Follow the pointer: letter by letter", body, n + 1, labels, nxt="One step")
    tag = 'class="stage cxstage" id="stage-expl"'
    assert st.count(tag) == 1
    st = st.replace(tag, tag + ' data-w="0"')
    return pcard("Follow the pointer", st, animated="explainer", activity=22)


# ================================================================ machine
def card_machine():
    panes, labels, s = "", [], 1
    total = sum(1 + len(P.compare_walk(lv["a"], lv["b"])) for lv in P.MACHINE)
    for k, lv in enumerate(P.MACHINE, 1):
        uid = f"cw-mc{k}"
        w, n, ans = CW.widget(uid, lv["a"], lv["op"], lv["b"], "mcstage", s + 1, EXTRA)
        opts = "".join(
            f'<li class="mc-o{" ok" if v == ans else ""}"><b>{v}</b></li>'
            for v in (True, False))
        panes += (
            f'<div class="mc-lv mc-lv{k}">'
            f'<div class="mc-l"><p class="mc-tag">Level {k} of {len(P.MACHINE)}</p>'
            f'{CODE.card(P.cmp_src(lv["a"], lv["op"], lv["b"]), f"level{k}.py")}'
            '<p class="stage-q">True or False? Tap it on your worksheet first.</p>'
            f'<ul class="mc-opts">{opts}</ul>'
            f'<p class="cap mc-trap">{html.escape(lv["trap"])}</p></div>'
            f'<div class="mc-r">{w}</div></div>')
        last = s + n
        sel = f".mc-lv{k}"
        EXTRA.append(fr("mcstage", s, last, sel) + "{opacity:1;visibility:visible}")
        EXTRA.append(at("mcstage", last, f"{sel} .mc-o:not(.ok)") + "{opacity:.35}")
        EXTRA.append(at("mcstage", last, f"{sel} .mc-o.ok")
                     + "{border-color:#9FD8B8;background:#EFFAF3}")
        EXTRA.append(at("mcstage", last, f"{sel} .mc-trap") + "{opacity:1}")
        labels += [f"level {k} vote"] + [f"level {k} pair {i + 1}" for i in range(n)]
        s = last + 1
    assert s - 1 == total
    return pcard("The comparison machine",
                 anim("stage-mc", "mcstage", "Predict, then run",
                      "True or False?", f'<div class="mc">{panes}</div>', total,
                      "|".join(labels)),
                 sheet="task 2", activity=21)


def card_quiz():
    return pcard("Classroom quiz on the portal", S.quiz(), activity=10)


# ======================================================== the second hook
def card_why():
    return pcard("Hook: the username Instagram refuses",
                 anim("stage-why", "wystage", "Before the next part",
                      "The username Instagram refuses", WY.body(), WY.STEPS, WY.LABELS),
                 animated="why")


def card_s25():
    return slide(25, "Naming Variables")


def card_rules():
    return story("Four rules for a variable name", "rules", SY.rules_scene,
                 "Naming Variables", "Rules for Naming Variables")


def card_s35():
    return story("Keywords", "kw", SY.keywords_scene, "Naming Variables", "Keywords")


# ============================================================ tap to classify
def card_classify():
    rows = P.classify_rows()
    tray = "".join(f'<code class="cl-chip cl-k{k}">{html.escape(nm)}</code>'
                   for k, (nm, _ok, _w) in enumerate(rows, 1))
    bins = {True: "", False: ""}
    for k, (nm, ok, why) in enumerate(rows, 1):
        bins[ok] += (f'<div class="cl-slot"><div class="cl-in cl-k{k}">'
                     f'<code>{html.escape(nm)}</code>'
                     f'<span>{html.escape(why)}</span></div></div>')
    body = (
        '<div class="cl">'
        f'<div class="cl-tray">{tray}</div>'
        '<div class="cl-bins">'
        f'<div class="cl-bin cl-yes"><p class="cl-h">Python accepts</p>{bins[True]}</div>'
        f'<div class="cl-bin cl-no"><p class="cl-h">Python refuses</p>{bins[False]}</div>'
        '</div></div>')
    n = len(rows)
    for k in range(1, n + 1):
        EXTRA.append(fr("clstage", k + 1, n + 1, f".cl-tray .cl-k{k}")
                     + "{opacity:0;transform:scale(.9)}")
        EXTRA.append(fr("clstage", k + 1, n + 1, f".cl-in.cl-k{k}") + "{opacity:1;transform:none}")
        EXTRA.append(at("clstage", k + 1, f".cl-in.cl-k{k}")
                     + "{box-shadow:0 0 0 4px rgba(0,109,175,.2)}")
    return pcard("Valid or not, and why",
                 anim("stage-cl", "clstage", "Worksheet &middot; Task 3",
                      "Does Python accept this name?", body, n + 1,
                      "all eight|" + "|".join(nm for nm, _o, _w in rows)),
                 sheet="task 3", activity=23)


# ============================================================ case styles
def card_cases():
    return story("Case styles: Python uses snake case", "case", SY.cases_scene,
                 "Naming Conventions", "Case Styles")


def card_best():
    return story("Pick the best name", "best", SY.best_scene, "Naming Variables", "Question",
                 animated=None, activity=7)


# ========================================================== worksheet task 4
def card_task4():
    bad = P.t4_bad_lines()
    err = P.t4_error()
    broken = CODE.card(P.T4_SRC, "bill.py")
    marked = CODE.card(P.T4_SRC, "bill.py", hi=tuple(bad))
    fixed = CODE.card(P.T4_FIXED, "bill.py")
    body = (
        '<div class="b2">'
        f'<div class="b2-l"><div class="b2-code t4-c1">{broken}</div>'
        f'<div class="b2-code t4-c2">{marked}</div>'
        f'<div class="b2-code t4-c3">{fixed}</div></div>'
        '<div class="b2-r">'
        '<div class="t4-ask">'
        '<p class="pill">Worksheet &middot; Task 4</p>'
        '<ol class="tk1-steps">'
        '<li>Type the <b>line numbers</b> that have a bad name.</li>'
        '<li>Type what Python says when you run it. Guess first.</li>'
        '<li>Fix every name in <b>snake_case</b>. Run it until it prints.</li>'
        '</ol>'
        f'<div class="tk1-t">{tmr(240)}</div></div>'
        '<div class="t4-out">'
        f'<div class="t2-o t4-o1"><span class="t2-lab">Python says</span>'
        f'<code class="t2-v">{html.escape(err)}</code></div>'
        f'<div class="t2-o t4-o2"><span class="t2-lab">Lines with a bad name</span>'
        f'<code class="t2-v">{", ".join(map(str, bad))}</code></div>'
        f'<div class="t2-o t4-o3"><span class="t2-lab">After the fix, it prints</span>'
        f'<code class="t2-v">{html.escape(" ".join(P.t4_fixed_out()))}</code></div>'
        '<p class="cap t4-why">Python stops at the first bad line it finds. '
        'Fix it, run again, and it shows you the next one.</p>'
        '</div></div></div>')
    EXTRA.extend([
        fr("t4stage", 2, 4, ".t4-ask") + "{display:none}",
        fr("t4stage", 2, 4, ".t4-out") + "{display:flex}",
        at("t4stage", 3, ".t4-c1") + "{opacity:0}",
        at("t4stage", 3, ".t4-c2") + "{opacity:1}",
        at("t4stage", 4, ".t4-c1") + "{opacity:0}",
        at("t4stage", 4, ".t4-c3") + "{opacity:1}",
        fr("t4stage", 2, 4, ".t4-why") + "{opacity:1}",
    ])
    for k in (1, 2, 3):
        EXTRA.append(fr("t4stage", k + 1, 4, f".t4-o{k} .t2-v") + "{opacity:1}")
        EXTRA.append(fr("t4stage", k + 1, 4, f".t4-o{k}")
                     + "{border-style:solid;border-color:#9FD8B8;background:#EFFAF3}")
    return pcard("Worksheet task 4: fix the names, then run",
                 anim("stage-t4", "t4stage", "Worksheet &middot; Task 4",
                      "Fix the names", body, 4,
                      "the task|what Python says|the bad lines|fixed"),
                 sheet="task 4", activity=19)


# ================================================================= the exit
def card_exit():
    right = P.exit_right()
    opts = "".join(
        f'<li data-k="{"ABCD"[i]}" class="ex-o{" ok" if i == right else ""}">'
        f'<code>name = {html.escape(repr(v).replace(chr(39), chr(34)))}</code>'
        f'<span class="ex-why">{html.escape(P.EXIT_WHY[v])}</span></li>'
        for i, v in enumerate(P.EXIT_OPTS))
    body = (
        '<div class="ex">'
        '<div class="ex-l"><p class="ex-story">The exam cell sends each student to a '
        'hall by name. One student gets no hall at all.</p>'
        f'{CODE.card(P.EXIT_SRC, "halls.py")}'
        '<p class="stage-q">Which name prints <b>nothing at all</b>?</p>'
        f'<div class="tk1-t">{tmr(150)}</div></div>'
        f'<div class="ex-r"><ul class="vopts">{opts}</ul></div></div>')
    EXTRA.extend([
        at("exstage", 2, ".ex-why") + "{display:block}",
        at("exstage", 2, ".ex-o:not(.ok)") + "{opacity:.55}",
        at("exstage", 2, ".ex-o.ok") + "{border-color:#9FD8B8;background:#EFFAF3;opacity:1}",
    ])
    return pcard("Exit: one question",
                 anim("stage-exit", "exstage", "Exit question",
                      "Which name gets no hall?", body, 2, "vote|answer"),
                 activity=10)


# ============================================================ the takeaways
CHIPS = ['#006DAF', '#2A86BF', '#C77700', '#6A48C0', '#D6453D', '#1F9D62']


def card_takeaways():
    cards = ""
    rows = P.tk_rows()
    for k, (h, code, got, why) in enumerate(rows, 1):
        cards += (f'<div class="tg tg{k}" style="--c:{CHIPS[k - 1]}">'
                  f'<span class="tg-n">{k}</span><div class="tg-in">'
                  f'<p class="tg-h">{html.escape(h)}</p>'
                  f'<div class="tg-code"><span class="tg-l">{CODE.paint(code)}</span></div>'
                  f'<p class="tg-out">{html.escape(got)}</p>'
                  f'<p class="tg-why">{html.escape(why)}</p></div></div>')
    n = len(rows)
    for k in range(1, n + 1):
        EXTRA.append(fr("tkg", k, n, f".tg{k}")
                     + "{border-style:solid;border-color:#E2E9EF;background:#fff;"
                       "box-shadow:0 1px 2px rgba(20,20,40,.05)}")
        EXTRA.append(fr("tkg", k, n, f".tg{k} .tg-in") + "{opacity:1;transform:none}")
        EXTRA.append(fr("tkg", k, n, f".tg{k} .tg-n") + "{opacity:0}")
    return pcard("Key takeaways: six examples",
                 anim("stage-tk", "tkg", "Key takeaways",
                      "Comparing strings and naming variables, in six examples",
                      f'<div class="tgrid">{cards}</div>', n))


def card_feedback():
    return pcard("Feedback", S.feedback())


def card_thankyou():
    return pcard("Thank you", S.thankyou())


# ===================================================================== CSS
BASE = r"""
/* ---- shared bits on these cards ---- */
.pill{display:inline-block;margin:0 0 12px;padding:4px 12px;border-radius:999px;
  background:#FDF2E6;color:#B5650D;font:700 14px var(--sans);letter-spacing:.02em}
.tk1-steps{margin:0 0 14px;padding-left:1.3em;font:17px/1.5 var(--sans);color:var(--dk-text)}
.tk1-steps li{margin:0 0 8px}
.tk1-steps code{font:700 .95em var(--mono);color:var(--dk-blue)}
.tk1-t{margin:6px 0 0}
body.present .tk1-steps{font-size:clamp(14px,1.5vw,24px)}
body.present .pill{font-size:clamp(12px,1.2vw,19px)}
.cap{margin:10px 0 0;font:600 17px/1.45 var(--sans);color:#434343}
body.present .cap{font-size:clamp(13px,1.4vw,23px)}

/* ---- a deck slide built over several slides: one build per press ---- */
.bstage{flex:1;min-height:0;display:flex;flex-direction:column}
.bs{flex:1;min-height:0;display:grid;place-items:center}
.bs-i{grid-area:1/1;display:block;max-width:100%;max-height:100%;border-radius:12px;
  box-shadow:0 1px 2px rgba(20,20,40,.06),0 10px 30px rgba(20,20,40,.08);
  opacity:0;transition:opacity 260ms var(--ease-out)}
.bs-i1{opacity:1}
body.present .bs-i{height:100%;width:auto}

/* ---- the recap: line 3 changes, the room says the output first ---- */
.rc{flex:1;min-height:0;display:flex;gap:30px;align-items:center}
.rc-l{flex:0 0 42%;min-width:0}
.rc-q{margin:14px 0 0}
.rc-slot{display:inline-grid;vertical-align:bottom}
.rc-w{grid-area:1/1;opacity:0;transform:translateY(-8px);
  transition:opacity 220ms var(--ease-out),transform 300ms var(--ease-out)}
.rc-w0{opacity:1;transform:none;color:#9AA1B0}
.rc-r{flex:1;min-width:0;align-self:center;min-height:66%;display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.rc-o{position:relative;min-height:0;display:flex;flex-direction:column;gap:6px;padding:14px 16px;
  border-radius:16px;border:2px dashed #D5DEE5;background:#FAFCFD;
  transition:background-color 240ms var(--ease-out),border-color 240ms var(--ease-out)}
.rc-h{margin:0;font:700 18px var(--sans);color:#5A6A75;opacity:0;
  transition:opacity 200ms var(--ease-out)}
.rc-n{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;
  justify-content:center;font:800 64px var(--sans);color:#DCE4EA;
  transition:opacity 200ms var(--ease-out)}
body.present .rc-n{font-size:clamp(44px,4.4vw,80px)}
.rc-h code{font:800 1.1em var(--mono);color:var(--dk-red)}
.rc-ask{margin:0;font:600 16px var(--sans);color:var(--dk-blue);opacity:0;
  transition:opacity 200ms var(--ease-out)}
.rc-v{flex:1;display:flex;flex-direction:column;justify-content:center;gap:2px}
.rc-v span{font:800 34px/1.2 var(--mono);color:#12633F;opacity:0;transform:translateY(6px);
  transition:opacity 220ms var(--ease-out),transform 300ms var(--ease-out)}
.rc-v span:nth-child(2){transition-delay:60ms}.rc-v span:nth-child(3){transition-delay:120ms}
.rc-v span:nth-child(4){transition-delay:180ms}.rc-v span:nth-child(5){transition-delay:240ms}
.rc-why{margin:0;font:600 16px/1.4 var(--sans);color:#434343;opacity:0;
  transition:opacity 240ms var(--ease-out)}
body.present .rc .cx{font-size:clamp(15px,1.75vw,30px)}
body.present .rc-h{font-size:clamp(13px,1.3vw,22px)}
body.present .rc-ask{font-size:clamp(12px,1.2vw,20px)}
body.present .rc-v span{font-size:clamp(22px,2.6vw,46px)}
body.present .rc-why{font-size:clamp(12px,1.2vw,20px)}

/* ---- task 1: three small programs, the output arrives on its press ---- */
.t1{flex:1;min-height:0;display:flex;gap:26px}
.t1-rows{flex:0 0 60%;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:14px}
.t1-row{display:flex;align-items:center;gap:14px}
.t1-n{flex:none;width:34px;height:34px;border-radius:50%;background:#EAF4FB;color:#006DAF;
  font:800 17px/34px var(--sans);text-align:center}
.t1-c{flex:1;min-width:0}
.t1-o{flex:0 0 9.5em;padding:10px 14px;border-radius:12px;border:2px dashed #E1E8EE;
  background:#FBFCFD;transition:background-color 260ms var(--ease-out),border-color 260ms var(--ease-out)}
.t1-v{display:block;margin-top:4px;font:700 20px var(--mono);color:#12633F;opacity:0;
  transition:opacity 240ms var(--ease-out)}
.t1-side{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.t1-why{opacity:0;transition:opacity 240ms var(--ease-out)}
.t2-lab{display:block;font:700 14px var(--sans);color:#7A8794}
body.present .t1-v{font-size:clamp(14px,1.5vw,25px)}
body.present .t2-lab{font-size:clamp(11px,1.1vw,17px)}
body.present .t1 .cx{font-size:clamp(12px,1.3vw,22px)}

/* ---- the explainer ---- */
.cx2{flex:1;min-height:0;display:flex;gap:30px;align-items:center}
.cx2-l{flex:0 0 34%;min-width:0}
.cx2-r{flex:1;min-width:0}
.cx2-q{margin:14px 0 0}
.cx2-rule{opacity:0;transition:opacity 240ms var(--ease-out)}
.cx-v{display:none}
.cx-knob{display:block;margin-top:18px;padding:12px 14px;border-radius:12px;background:#F2F8FC;
  border:1px solid #D5E3EE}
.cx-knob>span:first-child{display:block;font:700 14px var(--sans);color:#5A6A75}
.cx-knob input{width:100%;margin:8px 0 2px;accent-color:#006DAF}
.cx-words{display:flex;justify-content:space-between}
.cx-words i{font:700 16px var(--mono);font-style:normal;color:#12633F}
body.present .cx-words i{font-size:clamp(12px,1.3vw,22px)}
body.present .cx-knob>span:first-child{font-size:clamp(11px,1.1vw,18px)}
body.present .cx2 .cx{font-size:clamp(14px,1.6vw,27px)}

/* ---- the machine: one level at a time ---- */
.mc{flex:1;min-height:0;display:grid}
.mc-lv{grid-area:1/1;min-width:0;display:flex;gap:30px;align-items:center;opacity:0;
  visibility:hidden;transition:opacity 240ms var(--ease-out)}
.mc-l{flex:0 0 34%;min-width:0}
.mc-r{flex:1;min-width:0}
.mc-tag{margin:0 0 8px;font:700 14px var(--sans);color:#7A8794;letter-spacing:.04em;
  text-transform:uppercase}
.mc-opts{display:flex;gap:12px;margin:10px 0 0;padding:0;list-style:none}
.mc-o{flex:1;padding:10px 14px;border-radius:12px;border:2px solid #D5DEE5;background:#fff;
  text-align:center;transition:opacity 240ms var(--ease-out),background-color 240ms var(--ease-out),
  border-color 240ms var(--ease-out)}
.mc-o b{font:800 22px var(--mono);color:var(--dk-blue)}
.mc-trap{opacity:0;transition:opacity 240ms var(--ease-out)}
body.present .mc-o b{font-size:clamp(15px,1.6vw,27px)}
body.present .mc-tag{font-size:clamp(11px,1.1vw,17px)}
body.present .mc .cx{font-size:clamp(14px,1.55vw,26px)}

/* ---- tap to classify: eight names, two bins ---- */
.cl{flex:1;min-height:0;display:flex;flex-direction:column;gap:16px}
.cl-tray{display:flex;flex-wrap:wrap;gap:10px;min-height:3em}
.cl-chip{padding:8px 16px;border-radius:10px;border:2px solid #C9D6E0;background:#fff;
  font:700 21px var(--mono);color:#1B2530;
  transition:opacity 220ms var(--ease-out),transform 220ms var(--ease-out)}
.cl-bins{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:18px}
.cl-bin{min-height:0;display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:16px}
.cl-yes{background:#F2FAF5;border:2px solid #CDEBD9}
.cl-no{background:#FDF4F3;border:2px solid #F1CFCB}
.cl-h{margin:0 0 2px;font:800 18px var(--sans)}
.cl-yes .cl-h{color:#12633F}.cl-no .cl-h{color:#B3261E}
.cl-slot{flex:1;min-height:0;border:2px dashed rgba(67,67,67,.14);border-radius:12px;display:flex}
.cl-in{flex:1;display:flex;align-items:center;gap:14px;padding:6px 12px;border-radius:10px;
  background:#fff;opacity:0;transform:translateY(-10px);
  transition:opacity 240ms var(--ease-out),transform 280ms var(--ease-out),box-shadow 240ms var(--ease-out)}
.cl-in code{flex:0 0 7.4em;font:700 19px var(--mono);color:#1B2530}
.cl-in span{font:15px/1.35 var(--sans);color:#434343}
body.present .cl-chip{font-size:clamp(14px,1.5vw,25px)}
body.present .cl-h{font-size:clamp(13px,1.35vw,22px)}
body.present .cl-in code{font-size:clamp(13px,1.35vw,22px)}
body.present .cl-in span{font-size:clamp(11px,1.12vw,18px)}

/* ---- task 4: the code on the left, the answers arrive on the right ---- */
.b2{flex:1;min-height:0;display:flex;gap:26px}
.b2-l{flex:0 0 52%;min-width:0;display:grid;align-content:center}
.b2-code{grid-area:1/1;transition:opacity 260ms var(--ease-out)}
.b2-r{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.t4-c2,.t4-c3{opacity:0}
.t4-out{display:none;flex-direction:column;gap:10px}
.t2-o{padding:10px 14px;border-radius:12px;border:2px dashed #E1E8EE;background:#FBFCFD;
  transition:background-color 260ms var(--ease-out),border-color 260ms var(--ease-out)}
.t2-v{display:block;margin-top:4px;font:700 19px var(--mono);color:#12633F;opacity:0;
  transition:opacity 240ms var(--ease-out)}
.t4-why{opacity:0;transition:opacity 240ms var(--ease-out)}
body.present .t2-v{font-size:clamp(13px,1.4vw,23px)}
body.present .b2 .cx{font-size:clamp(13px,1.45vw,24px)}

/* ---- the exit ---- */
.ex{flex:1;min-height:0;display:flex;gap:26px}
.ex-l{flex:0 0 52%;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.ex-story{margin:0 0 10px;font:17px/1.4 var(--sans);color:var(--dk-text)}
.ex-r{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:safe center}
.ex .vopts{margin:0;display:flex;flex-direction:column;gap:12px}
.ex .vopts li.ex-o{margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;
  padding:12px 16px 12px 52px;position:relative;border-radius:12px;border:2px solid #D5DEE5;
  background:#fff;transition:opacity 240ms var(--ease-out),background-color 240ms var(--ease-out),
  border-color 240ms var(--ease-out)}
.ex-o code{font:800 22px var(--mono);color:var(--dk-blue)}
.ex .vopts li.ex-o::before{left:18px;top:15px}
.ex-why{flex:1 1 100%;font:15px/1.4 var(--sans);color:var(--dk-text);display:none}
body.present .ex-story{font-size:clamp(14px,1.5vw,24px)}
body.present .ex-o code{font-size:clamp(15px,1.7vw,28px)}
body.present .ex-why{font-size:clamp(11px,1.12vw,18px)}
body.present .ex .cx{font-size:clamp(12px,1.35vw,23px)}

/* ---- the takeaways: six example cards, one per press ---- */
.tgrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  grid-template-rows:repeat(2,minmax(0,1fr));gap:16px}
.tg{position:relative;min-width:0;min-height:0;border:2px dashed #D5DEE5;border-radius:16px;
  background:#FAFCFD;overflow:hidden;transition:border-color 240ms var(--ease-out),
  background-color 240ms var(--ease-out),box-shadow 240ms var(--ease-out)}
.tg-n{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;
  justify-content:center;font:800 56px var(--sans);color:#DCE4EA;transition:opacity 200ms var(--ease-out)}
.tg-in{height:100%;display:flex;flex-direction:column;gap:12px;padding:0 18px 14px;
  opacity:0;transform:translateY(8px);
  transition:opacity 280ms var(--ease-out),transform 280ms var(--ease-out)}
.tg-h{margin:0 -18px 4px;padding:9px 18px;background:var(--c);color:#fff;
  font:700 18px var(--sans);letter-spacing:.01em}
.tg-code{padding:8px 10px;border:1px solid #E2E9EF;border-radius:10px;background:#fff;
  font:500 16px/1.5 var(--mono);color:#1B2530;overflow-x:auto}
.tg-l{white-space:pre}
.tg-l b{color:var(--dk-red)}.tg-l i{font-style:normal;color:var(--dk-blue)}
.tg-l em{font-style:normal;color:#12633F}
.tg-out{margin:0;font:800 20px/1.3 var(--mono);color:#1F9D62}
.tg-why{margin:0;font:16px/1.4 var(--sans);color:var(--dk-text)}
body.present .tg-h{font-size:clamp(13px,1.35vw,22px)}
body.present .tg-code{font-size:clamp(12px,1.3vw,22px)}
body.present .tg-out{font-size:clamp(15px,1.6vw,27px)}
body.present .tg-why{font-size:clamp(12px,1.3vw,21px)}
body.present .tg-n{font-size:clamp(40px,4vw,72px)}

@media (prefers-reduced-motion:reduce){
  .mc *,.b2 *,.ex *,.tg *,.cl *,.t1 *,.bs *,.rc *{transition:none !important}
}
"""


JS = r"""
(function(){
  /* the explainer's slider picks the second word, and the walk starts again */
  document.querySelectorAll('.cxstage input[type=range]').forEach(function(r){
    var st = r.closest('.stage');
    function set(){ st.setAttribute('data-w', r.value); r.setAttribute('data-w', r.value);
      if(st.animGo) st.animGo(1); }
    r.addEventListener('input', set);
    r.addEventListener('keydown', function(e){ e.stopPropagation(); });
  });
})();
"""


def css():
    """Call after every card has been built: the builders fill EXTRA."""
    return BASE + CW.CSS + SY.CSS + "\n".join(EXTRA)
