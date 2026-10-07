#!/usr/bin/env python3
"""
verify_plan.py — lint a finished lesson plan before you show it to anyone.

    python3 verify_plan.py "out/12 - Loops_student_view.html"
    python3 verify_plan.py "out/12 - Loops_student_view.html" --stale "slide 13,minute 20"
    python3 verify_plan.py "out/<slug>_student_view.html" \
        --guide "out/<slug>_instructor_guide.html" \
        --worksheet "out/<slug>_student_handout.html"

    File names follow the user's convention (2026-09-17): "<slug>_<role>.html", roles student_view, instructor_guide, student_handout.

A session is three files now — presenter, guide, worksheet — and none of them
links to the others, so this takes the presenter and finds the siblings by name.
Pass --guide / --worksheet if they are named or placed differently. A missing
sibling is a FAIL, not a skip: a session with no guide is not a session.

Every check here exists because the mistake it catches happened at least once,
and most of them are invisible to reading the code. Run it after every build.

Exit code 1 if any FAIL. WARNs are judgement calls — read them, then decide.
"""
import re, statistics, sys, json, html as _html, pathlib
import pathlib as _pathlib, sys as _sys
# The spine (the fixed cards, their order, the one button, the file name) is the
# same in every subject, so the check for it lives with the cards themselves.
_sys.path.insert(0, str(_pathlib.Path(__file__).resolve().parent.parent / "assets"))
from standard_slides import spine_html_check
from html.parser import HTMLParser

VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param",
        "source","track","wbr","path","rect","circle","line","use","stop","polyline",
        "polygon","ellipse","tspan"}

class Balance(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.stack=[]; self.errors=[]
    def handle_starttag(self, tag, attrs):
        if tag not in VOID: self.stack.append((tag, self.getpos()))
    def handle_startendtag(self, tag, attrs): pass
    def handle_endtag(self, tag):
        if tag in VOID: return
        if self.stack and self.stack[-1][0] == tag: self.stack.pop()
        else:
            names = [t for t,_ in self.stack]
            if tag in names:
                i = names.index(tag)
                self.errors.append(f"</{tag}> at line {self.getpos()[0]} closes over {names[i+1:]}")
                del self.stack[i:]
            else:
                self.errors.append(f"stray </{tag}> at line {self.getpos()[0]}")

results = []
def visible(doc):
    """What a reader could actually read: the markup with <style>, <script> and
    comments taken out. Attributes stay in, because data-label and <title> are read."""
    doc = re.sub(r"<!--.*?-->", "", doc, flags=re.S)
    doc = re.sub(r"<(style|script)\b.*?</\1>", "", doc, flags=re.S | re.I)
    return doc


def no_em_dash(doc, what):
    """Nothing the room or the instructor reads may carry an em-dash, the tab title
    included. The user does not want a plan that reads as machine-written, and the
    template ships one in <title> that has to be replaced in the builder."""
    v = visible(doc)
    hits = [m.start() for m in re.finditer("\u2014|&mdash;", v)]
    ctx = [v[max(0, h - 30):h + 30].replace("\n", " ") for h in hits[:2]]
    check(not hits, f"no em-dashes in the {what}",
          f"{len(hits)} found, e.g. {ctx} - use a colon, a full stop or a comma")


def simple_english(doc, what):
    """"My students understand simple english, not this fancy one." Every sentence the
    room reads in a question or a block heading has to be short. A long sentence is the
    tell for fancy phrasing; this warns so the author rereads it. It cannot judge words."""
    v = visible(doc)
    texts = re.findall(r'class="stage-q"[^>]*>(.*?)</p>', v, flags=re.S)
    texts += re.findall(r"<h2>(.*?)</h2>", v, flags=re.S)
    long_ = []
    for chunk in texts:
        plain = _html.unescape(re.sub(r"<[^>]+>", "", chunk))
        for sent in re.split(r"(?<=[.?!])\s+", plain):
            n = len(sent.split())
            if n > 18:
                long_.append(f"{n} words: {sent.strip()[:70]}")
    check(not long_, f"student-facing sentences in the {what} are short (18 words or fewer)",
          f"{len(long_)} long, e.g. {long_[:2]} - split them, use everyday verbs",
          warn=bool(long_))


def check(ok, label, detail="", warn=False):
    results.append(("WARN" if warn else ("PASS" if ok else "FAIL"), label, detail))


def _ig_problems(g):
    """The guide format rules, borrowed from the builder so there is one copy.
    Returns a list of faults; an empty list means the guide is in shape."""
    import os as _os, sys as _sys
    here = _os.path.dirname(_os.path.abspath(__file__))
    if here not in _sys.path:
        _sys.path.insert(0, here)
    try:
        from ig_build import problems
    except Exception as e:
        return ["ig_build.py is not beside verify_plan.py (%s)" % e]
    return problems(g)


def _guide_shape(g, check, presenter_html=""):
    """The instructor guide, as it has been since 2026-09-22: a written
    document in numbered phase sections with minute bands, a sidebar carrying
    the checkpoint bands, a standing-habits box, four safe points and a cut
    order. No per-card entries, no thumbnails, about six to seven printed
    pages."""
    faults = _ig_problems(g)
    check(not faults, "the guide keeps the phase-block format", "; ".join(faults))

    secs = re.findall(r'<section[^>]* id="s(\d+)"', g)
    check(len(secs) >= 8, "the guide has a section per beat or group of beats",
          "%d sections - a guide under eight is a summary, not a guide" % len(secs))
    safes = len(re.findall(r'class="safe"', g))
    check(safes >= 3, "the guide carries its safe points",
          "%d found, four is the shape" % safes, warn=safes == 3)
    bands = len(re.findall(r'class="cp(?: floor)?"', g))
    check(bands >= 2, "the sidebar carries the checkpoint bands",
          "%d bands - the instructor cannot tell whether they are behind" % bands)
    check("base64" not in g, "no slide pictures in the guide",
          "the guide is a written document; the cards live in the presenter file")
    if presenter_html:
        dupe = 'id="guide-view"' in presenter_html or 'class="gcard"' in presenter_html
        check(not dupe, "the guide is not also inside the presenter file")

def main():
    if len(sys.argv) < 2 or {"-h", "--help"} & set(sys.argv): raise SystemExit(__doc__)
    path = sys.argv[1]
    stale_terms = []
    if "--stale" in sys.argv:
        stale_terms = [t.strip() for t in sys.argv[sys.argv.index("--stale")+1].split(",") if t.strip()]
    s = open(path, encoding="utf8").read()

    # ---- the two siblings ------------------------------------------------
    import os as _os
    def _opt(flag, suffix):
        if flag in sys.argv:
            return sys.argv[sys.argv.index(flag) + 1]
        return re.sub(r"(_student_view|-presenter|-plan)\.html$", "", path) + suffix
    g_path = _opt("--guide", "_instructor_guide.html")
    w_path = _opt("--worksheet", "_student_handout.html")
    # ---- the fixed spine ---------------------------------------------
    import os as _osp
    for _ok, _label, _detail, _warn in spine_html_check(s, _osp.path.basename(str(path))):
        check(_ok, _label, _detail, warn=_warn)
    # No top bar either (2026-09-25): Prev, Next, Reveal all, All slides,
    # Guides and Full screen are furniture on the projector. The bar is hidden
    # and the slide takes the whole height; the buttons stay for the keys.
    if 'id="p-next"' in s:
        check("body.present .pbar{display:none" in s and "calc(100vh - 48px)" not in s,
              "no top bar on the student view",
              "the shell hides .pbar and gives the slide 100vh; rebuild from assets/plan-template.html")

    g = open(g_path, encoding="utf8").read() if _os.path.exists(g_path) else ""
    w = open(w_path, encoding="utf8").read() if _os.path.exists(w_path) else ""
    check(bool(g), "the guide file is there", f"looked for {g_path}")
    check(bool(w), "the worksheet file is there", f"looked for {w_path}")
    # nothing may link to anything: the worksheet goes to students, the guide
    # does not, and one stray href is how a class finds the answers
    for _name, _doc, _other in (("presenter", s, (g_path, w_path)),
                                ("guide", g, (path, w_path)),
                                ("worksheet", w, (path, g_path))):
        if not _doc:
            continue
        hits = [_os.path.basename(o) for o in _other if _os.path.basename(o) in _doc]
        check(not hits, f"the {_name} links to neither sibling", f"references {hits}")

    # ---- structure -------------------------------------------------------
    b = Balance(); b.feed(s)
    check(not b.errors and not b.stack, "HTML tags balance",
          "; ".join(b.errors[:3]) or (f"unclosed: {[t for t,_ in b.stack][:5]}" if b.stack else ""))

    ids_used = set(re.findall(r"getElementById\('([^']+)'\)", s))
    missing = sorted(i for i in ids_used if f'id="{i}"' not in s)
    check(not missing, "every getElementById has markup", f"missing: {missing}")

    # The numbers are the real deck's numbers, so a plan that deliberately drops
    # a slide leaves a gap. Out of order or repeated is a mistake; a gap is a
    # decision, and it gets named in the report.
    nums = re.findall(r'slide-no">Slide (\d+)<', s)
    seen = [int(n) for n in nums]
    check(seen == sorted(set(seen)), "slide numbers in order, none repeated", f"got {nums[:12]}…")
    gaps = [n for n in range(1, (max(seen) if seen else 0) + 1) if n not in seen]
    check(not gaps, "every deck slide appears", f"skipped: {gaps}", warn=bool(gaps))

    # deck artwork only: a slide may also carry brand or illustration assets,
    # and counting those made this fire on plans that were correct
    deck = re.findall(r'<div class="slide-img">.*?</div>', s, re.S)
    imgs = sum(d.count("data:image/webp;base64") + d.count("data:image/png;base64") for d in deck)
    # a kept deck slide is redrawn in the new design (ndt_theme.drawn), which
    # carries the deck's own number instead of an image
    redrawn = re.findall(r'<div class="slide-img ndt-wrap" data-deck="(\d+)">', s)
    check(imgs == len(deck) and imgs + len(redrawn) == len(nums),
          "every slide is an embedded image or a redrawn slide",
          f"{imgs} images in {len(deck)} wrappers, {len(redrawn)} redrawn, {len(nums)} slides")
    check(imgs == 0, "kept deck slides are redrawn in the new design",
          f"{imgs} still shown as the deck's picture, {len(redrawn)} redrawn; "
          "fine only for a photograph or an illustration", warn=imgs > 0)

    # ---- the look: New Design Template.html, laid on by ndt_theme.theme()
    check(s.count('<style id="ndt-skin">') == 1, "the new design theme is applied once",
          "build-template.py calls theme(presenter) as its last step")
    check('class="ndt-nav"' in s, "the new design viewer pills are there",
          "counter, prev, next, full screen, bottom left")
    check(not re.search(r'spine-pic spine-\w+" data-spine="\w+"><img', s)
          and 'class="tc-wrap"' not in s,
          "the spine is drawn in the new design, not the old Fixed Slides pictures",
          "spine cards come from ndt_theme.spine() by way of spine_cards()")

    for _n, _d in (("presenter", s), ("guide", g), ("worksheet", w)):
        if _d:
            check('src="http' not in _d and 'href="http' not in _d,
                  f"the {_n} is self-contained", "one file, opened offline, from a USB stick")
    check("src=\"http" not in s and "href=\"http" not in s,
          "self-contained (no external requests)")

    blocks = re.findall(r'<section class="block[^"]*" id="([^"]+)"', s)
    nav    = re.findall(r'data-target="([^"]+)"', s)
    # Slides-only build: the sidebar is gone, so an empty nav is the norm.
    if nav:
        check(blocks == nav, "sidebar nav matches the blocks",
              f"nav {len(nav)} vs blocks {len(blocks)}")

    # ---- time ------------------------------------------------------------
    # Durations are deliberately not shown to the instructor, so the builder
    # emits them as data-mins on each nav item — invisible, but checkable.
    durs = [int(x) for x in re.findall(r'data-mins="(\d+)"', s)]
    if durs:
        check(sum(durs) == 75, "durations total exactly 75", f"total {sum(durs)}")
        check(len(durs) == len(blocks), "every block has a duration",
              f"{len(durs)} durations, {len(blocks)} blocks")
    else:
        # The durations rode on the sidebar nav items, and the sidebar is gone
        # from the slides-only build, so this is a note, not a failure.
        check(False, "blocks carry data-mins so the 75 total can be checked",
              "no data-mins in this file - the sidebar that carried them is gone",
              warn=True)

    ranges = re.findall(r"\d+\s*[–-]\s*\d+\s*min", s)
    check(not ranges, "no clock positions on cards (durations only)",
          f"found {ranges[:4]}")

    cps = re.findall(r'class="sp-cp"><span>([^<]+)', s)
    # Checkpoint bands lived in the sidebar. In the slides-only build they live
    # in the guide's run sheet instead, so only check them where they appear.
    if cps:
        check(4 <= len(cps) <= 6, f"four to six checkpoint bands", f"found {len(cps)}: {cps}")


    # ---- budget: is this a session, or a list of slides? ---------------
    # Session 12's first build came back with 29 blocks and a median duration of
    # 2 minutes, because each deck slide got a block of its own. Every number
    # below is calibrated so a good plan passes and that one does not.
    if durs:
        med = statistics.median(durs)
        check(med >= 3, "median block is 3 min or more",
              f"median is {med} min — neighbouring deck slides need grouping into one block")
        check(len(blocks) <= 22, "block count is sane", f"{len(blocks)} blocks; aim for 14-20")

    solo = len(re.findall(r"(?:&middot;|&mdash;|·|—)\s*Slide \d+\s*(?:<|&middot;)", s))
    check(solo <= 8, "deck slides are grouped, not one block each",
          f"{solo} block headings name a single slide; group consecutive slides into runs")

    check(len(nums) <= 20, "deck cut hard enough",
          f"{len(nums)} slides kept for 75 minutes; the target is 14-18")

    cards = s.count('class="slide"') + s.count('class="pcard"')
    # raised from 32 on 2026-09-28: the user wants wordy cards split, and set
    # 55 to 60 as the ceiling for a 75 minute session
    check(cards <= 60, "cards in presenter view",
          f"{cards} cards; past about 60 the session cannot breathe")

    # ---- slide ranges must ascend --------------------------------------
    bad = [(a, z) for a, z in re.findall(r"Slides (\d+)\s*(?:&ndash;|–|-)\s*(\d+)", s)
           if int(z) <= int(a)]
    check(not bad, "slide ranges ascend",
          f"descending ranges {bad} — a heading is pairing a new slide number with an original one")

    # ---- the same beat several times over is one beat -------------------
    fam = {}
    for name, n in re.findall(r"(Hands-on|Activity|Bug|Vote|Trace) (\d+)", s):
        fam.setdefault(name, set()).add(int(n))
    # This was a WARN and a build shipped straight past it with Hands-on 1 through 5,
    # three of them the same break-it exercise. A stated rejection reason is a FAIL.
    heavy = {k: sorted(v) for k, v in fam.items() if len(v) > 3}
    check(not heavy, "no beat repeated more than three times",
          f"{heavy} — collapse them into one beat with steps")

    # Same defect, caught by template rather than by label: the pool has 20 templates
    # (references/activity-library.md) and nothing stops one being used five times.
    tmpl = re.findall(r'data-activity="(\d+)"', s)
    if tmpl:
        from collections import Counter
        over = {t: c for t, c in Counter(tmpl).items() if c > 2}
        check(not over, "no activity template used more than twice",
              f"template {over} — vary the mechanic or merge the beats")
    else:
        check(False, "activity panels name their template number",
              "add data-activity=\"<n>\" from references/activity-library.md — do not "
              "invent a template", warn=True)

    # ---- prompts must not state the output before the run ---------------
    prompts = re.findall(r'<p class="stage-(?:q|note)">(.*?)</p>', s, re.S)
    leak = [p for p in prompts if re.search(r'you (?:should|will) see', p, re.I)]
    check(not leak, "no expected output stated on a student prompt before the run",
          f"{len(leak)} prompt(s) say 'you should see' — write: predict, run, compare", warn=bool(leak))

    # ---- checkpoint labels distinct ---------------------------------------
    check(len(cps) == len(set(cps)), "checkpoint band labels are distinct",
          f"{cps} — write 'Hard floor · exit at N min' so it cannot read as a typo")

    # ---- the hand-out moment is named, once ------------------------------
    # The guide owns this now. It has to be said in exactly one place: naming it
    # twice is how a plan ends up handing the sheet out at minute 1 and again at
    # minute 20, which is the contradiction that actually shipped.
    if g and 'class="slide-src">worksheet' in s:
        opens = len(re.findall(r"open the worksheet", g, flags=re.I))
        check(opens <= 1, "the guide names the worksheet-opens moment once",
              f"{opens} sections say open the worksheet - saying it twice reads as a contradiction")

    # ---- worksheet -------------------------------------------------------
    # The worksheet is a separate, fillable HTML document the students download
    # and type into. There is no page count any more; what matters is that the
    # thing that downloads is the thing the panel previewed.
    if w:
        hh = w
        check(hh.lstrip().lower().startswith('<!doctype html'),
              "the worksheet is a whole document",
              "students open this file on its own: it needs its own doctype, head and style")
        check('class="selfck"' not in hh, "no self-check on the worksheet",
              "a student reads it before starting, so it stops being a check and becomes "
              "a hint. The instructor says it, after pens are down")
        fields = hh.count('<input type="text"') + hh.count('<textarea')
        check(fields >= 4, "the worksheet has fields to type into",
              f"{fields} field(s) — a worksheet nobody can fill in is a slide")
        ext = re.findall(r'id="ws-src".*?(?:src|href)="https?://', hh, re.S)
        check(not ext, "the downloaded worksheet makes no external requests",
              "it is opened offline, from a file:// path")
        check('sessionStorage' not in hh or 'catch' in hh,
              "worksheet storage is guarded",
              "sessionStorage throws in a private window; the sheet must still work")

    # ---- the exit activity ----------------------------------------------
    if 'id="stage-exit"' in s:
        e = s[s.index('id="stage-exit"'):]
        e = e[:e.index("stage-rule")] if "stage-rule" in e else e
        ok = 'class="vopts"' in e
        check(ok, "exit activity is a poll",
              "" if ok else "three MCQs with Reveal answer: everyone can answer, it stays "
              "anonymous, and the spread tells you what to open the next session with")

    # ---- the two animations ----------------------------------------------
    # Every plan carries both: a hook that states the problem in one transform, and an
    # animated explainer that shows the session's idea happening. See
    # references/animated-explainer.md — including the three tests it has to pass first.
    if "data-animated=" not in s:
        check(False, "the two animations are marked so they can be checked",
              "no data-animated= anywhere — pass animated='hook' / animated='explainer' to "
              "pcard(). Plans built before this marker existed warn here instead of failing",
              warn=True)
    else:
        for kind, why in (("hook", "one CSS transform on one SVG group — assets/hook-svg-reference.txt"),
                          ("explainer", "the session's idea shown happening, interactive, driven by "
                                        "an input the room chooses — assets/execution-walker-reference.txt")):
            n = s.count(f'data-animated="{kind}"')
            check(n == 1, f"exactly one animated {kind}", f"found {n} — {why}")

    if 'data-animated="explainer"' in s or ("One step" in s and "dead" in s):
        if 'data-animated="explainer"' in s:
            x = s[s.index('data-animated="explainer"'):]
            x = x[:x.index('class="pcard')] if 'class="pcard' in x[40:] else x
        else:
            x = s   # pre-marker plan: check the contract against the whole file
        check("dead" in x, "the explainer has a persistent unreached state",
              "what the dot never touches must grey out and stay grey — that is the finding")
        check(any(w in x for w in ("One step", "one step")),
              "the explainer can be advanced one step at a time",
              "instructors stop on the line the room disagreed about")
        check('type="range"' in x or 'data-w=' in x,
              "the explainer takes an input the room can change",
              "a fixed value makes it a cartoon; they must predict, then watch it settle")
    check("prefers-reduced-motion" in s, "animations respect prefers-reduced-motion",
          "reduced motion and print both jump to the end state")

    # ---- the runtime actually runs ---------------------------------------
    # Both of these shipped broken in assets/plan-template.html and cost a whole
    # debugging round each, because neither shows up as a layout fault: the
    # confetti fired every time and was drawn off-screen, and the guard in front
    # of it threw on an undeclared name. A plan can pass every other check here
    # and still throw on the first reveal of the session.
    if "CONF" in s:
        ok = re.search(r"#confetti\s*\{[^}]*position\s*:\s*fixed", s) is not None
        check(ok, "the confetti canvas is positioned",
              "" if ok else "the script creates #confetti and draws into it, but with no "
              "position:fixed;inset:0;z-index rule the canvas lands at the end of <body> "
              "at its natural size and nothing is ever visible")
    reads_calm = re.search(r"if\s*\(\s*calm\b|\bcalm\s*\|\|", s) is not None
    if reads_calm:
        ok = re.search(r"\b(var|let|const)\s+calm\b", s) is not None
        check(ok, "every runtime flag that is read is declared",
              "" if ok else "`calm` is read by a guard but never declared - every "
              "answer reveal throws \"calm is not defined\" and no confetti ever fires")

    # ---- instructor notes ------------------------------------------------
    # Notes used to sit under each slide. They now live in the guide, so what is
    # worth checking is that no slide quietly grew its own set again.
    head = s
    stray = re.findall(r'<details class="prep">|<ul class="brief">', head)
    check(not stray, "no instructor notes left on the slides",
          f"{len(stray)} note blocks still under slides")

    # ---- guide: the phase-block format ------------------------------------
    if g:
        _guide_shape(g, check, head)

    # ---- worksheet -------------------------------------------------------
    if w:
        h = w
        check(not re.findall(r"minute \d+", h), "no session timings on the worksheet",
              str(re.findall(r"minute \d+", h)[:3]))
        tasks = h.count('class="task"')
        check(tasks >= 1, "the worksheet has tasks", f"{tasks} task(s)")
        for m in re.finditer(r'selfck"><b>[^<]*</b>\s*<p>(.*?)</p>', h, re.S):
            if "<b>" in m.group(1):
                check(False, "no inline <b> inside a self-check",
                      "`.selfck b{display:block}` will break it onto its own line")
                break
        else:
            check(True, "no inline <b> inside a self-check")

    # ---- rendering traps -------------------------------------------------
    check("<u>" not in s, "no <u> in code blocks",
          "<u> carries an underline older engines will not drop — use <em>")
    pre_arrows = [m for m in re.findall(r"<pre[^>]*>(.*?)</pre>", s, re.S) if "&rarr;" in m]
    check(not pre_arrows, "no → inside <pre>",
          "→ is not in the mono face and breaks column alignment — use ->")

    for tok in ("--sans", "--mono"):
        check(f"{tok}:" in s, f"{tok} is defined in :root",
              "a missing token invalidates every font shorthand that uses it")

    insets = len(re.findall(r"inset:", s))
    longhand = len(re.findall(r"inset:[^;]*;\s*top:", s))
    ok = insets == 0 or longhand >= insets
    check(ok, "every inset: has its long-hand alongside",
          "" if ok else f"{insets} inset rules but only {longhand} with long-hand", warn=not ok)

    mins = len(re.findall(r":\s*min\(", s))
    ok = mins == 0 or "@supports (width:min(" in s
    check(ok, "min() sizing has an @supports fallback",
          "" if ok else f"{mins} min() uses and no @supports block", warn=not ok)

    gaps = len(re.findall(r"gap:\s*\d", s))
    ok = gaps == 0 or "margin-right" in s
    check(ok, "flex/grid gap has margin fallbacks",
          "" if ok else f"{gaps} gap rules — gap is dropped by print pipelines", warn=not ok)

    # ---- the settled writing rules ---------------------------------------
    # Both of these were rejections before they were rules, and both are invisible
    # to every other check in this file.
    no_em_dash(s, "presenter")
    simple_english(s, "presenter")
    if g:
        no_em_dash(g, "guide")
    if w:
        no_em_dash(w, "worksheet")
        simple_english(w, "worksheet")

    # ---- at least one bespoke interactive panel ---------------------------
    # A plan whose panels were text cards was rejected as "horrible, very dull",
    # however sound its beat table. Templates 21 to 23 are the panels.
    bespoke = [int(n) for n in re.findall(r'data-activity="(\d+)"', s) if n.isdigit()]
    has_panel = any(21 <= n <= 23 for n in bespoke)
    check(has_panel, "at least one bespoke interactive panel (template 21-23)",
          f"activities used: {sorted(set(bespoke))} - a text card is not a panel",
          warn=not has_panel)

    # ---- the guide still says how a stepped card is driven ----------------
    # Not every press any more: only the ones that carry a mechanism. But a
    # guide that never mentions a press is one an instructor drives blind.
    if g and re.search(r'data-anim="\d+"', s):
        presses = len(re.findall(r"press(?:es)?\b", g, flags=re.I))
        check(presses >= 4, "the guide says how the stepped cards are driven",
              f"{presses} mentions of presses in the guide", warn=presses < 4)

    # ---- stale references ------------------------------------------------
    if stale_terms:
        hits = [t for t in stale_terms if t in s]
        check(not hits, "no stale references", f"found: {hits}")

    # ---- report ----------------------------------------------------------
    w = max(len(l) for _, l, _ in results)
    fails = warns = 0
    print()
    for status, label, detail in results:
        mark = {"PASS": "  ok  ", "FAIL": " FAIL ", "WARN": " warn "}[status]
        print(f"[{mark}] {label.ljust(w)}  {detail if status!='PASS' else ''}".rstrip())
        fails += status == "FAIL"; warns += status == "WARN"
    print(f"\n{len(results)-fails-warns} passed, {warns} warnings, {fails} failed")
    if fails:
        print("\nFix the failures before showing this to anyone.")
    print("Then do the two things this script cannot do:")
    print("  1. run every piece of code in the plan and compare the output")
    print("  2. open presenter view in a real browser and look at it")
    sys.exit(1 if fails else 0)

if __name__ == "__main__":
    main()
