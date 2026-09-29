"""The New Design Template look for a Programming Foundations student view.

`New Design Template.html` (root of the lesson plans folder) is how every
student view looks since 2026-09-25: Sora / Inter / JetBrains Mono, the
lavender content ground with its two arcs and corner glow, the "- EYEBROW"
kicker, navy spine slides, the NXT WAVE mark bottom right, the 8px footer bar,
the top progress line and the counter + prev / next / full screen pills
bottom left.

This is the skill's own copy of the engine in `tools/ndt/ndt.py`, which
skinned PF 14 to 18 after they were built. Here the look is part of the build:

    from ndt_theme import *            # after sys.path has assets/
    sp = spine_cards(SESSION)          # build-template.py, drawn in this look
    presenter = theme(presenter)       # last step before writing the file

Slides drawn here are authored on the template's own 1280 x 720 canvas and
scaled to the presenter's 16:9 box by --ndt-k, so every size below is the
template's own pixel value. The plan's own panels (.stage) are re-skinned by
CSS with the same --ndt-k and never need to know this module exists.
"""
import base64, html, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
A = lambda n: os.path.join(HERE, 'ndt-media', n)


def _read(n):
    with open(A(n), encoding='utf-8') as f:
        return f.read()


def _svg(n, cls=''):
    s = _read(n)
    s = re.sub(r'^<svg[^>]*?viewBox="([^"]+)"[^>]*>',
               lambda m: f'<svg viewBox="{m.group(1)}" class="{cls}" aria-hidden="true">', s, count=1)
    return s


LOGO = 'data:image/png;base64,' + base64.b64encode(open(A('logo_small.png'), 'rb').read()).decode()


def mascot(kind='wave', uid='a', cls='ndt-mascot'):
    s = _svg({'wave': 'mascot_wave.svg', 'idea': 'mascot_idea.svg', 'recap': 'mascot_recap.svg'}[kind], cls)
    # gradient ids are shared between copies; make each copy unique
    return re.sub(r'_r_[0-9a-z]+_', f'ndt{uid}', s)


def clipboard():
    return _svg('clipboard.svg', 'ndt-clip')


# ---------------------------------------------------------------- code
KW = {'for', 'in', 'while', 'True', 'False', 'if', 'else', 'elif', 'def', 'return', 'and', 'or', 'not', 'break', 'continue'}
BI = {'print', 'input', 'len', 'int', 'range', 'str', 'float'}
TOK = re.compile(r'("[^"]*"|\'[^\']*\')|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|(.)')


def hl(line):
    out = []
    for s, n, w, sp, op in TOK.findall(line):
        if s:
            out.append(f'<i class="s">{html.escape(s)}</i>')
        elif n:
            out.append(f'<i class="n">{n}</i>')
        elif w:
            if w in KW:
                out.append(f'<i class="k">{w}</i>')
            elif w in BI:
                out.append(f'<i class="b">{w}</i>')
            else:
                out.append(w)
        elif sp:
            out.append(sp)
        else:
            out.append(f'<i class="o">{html.escape(op)}</i>' if op in '=<>+-*' else html.escape(op))
    return ''.join(out)


def code(lines, file='main.py', mark=None, warn=None, loop=None, size=22, labels=None, width=None, bad=None):
    """White editor card. mark / warn: sets of 1-based rows to tint blue / amber.
    loop: (from_row, to_row) draws the orange back-arrow in the gutter.
    labels: {row: text} tags pinned to the right of the card, one per row."""
    mark, warn, bad = set(mark or ()), set(warn or ()), set(bad or ())
    lh = round(size * 2)
    rows = []
    for i, ln in enumerate(lines, 1):
        c = 'row' + (' mk' if i in mark else '') + (' wn' if i in warn else '') + (' er' if i in bad else '')
        rows.append(f'<div class="{c}"><span class="no">{i}</span><span class="tx">{hl(ln) or "&nbsp;"}</span></div>')
    lp = ''
    if loop:
        a, b = loop
        top = 14 + (a - 1) * lh + lh / 2
        h = (b - a) * lh
        lp = f'<span class="loop" style="top:{top}px;height:{h}px"></span>'
    lab = ''
    if labels:
        items = ''.join(
            f'<span class="lab" style="top:{14 + (r - 1) * lh}px;height:{lh}px"><i></i>{html.escape(t)}</span>'
            for r, t in labels.items())
        lab = f'<div class="labs">{items}</div>'
    w = f'width:{width}px;' if width else ''
    return (f'<div class="ndt-code" style="--fs:{size}px;--lh:{lh}px;{w}">'
            f'<div class="bar"><span class="d"></span><span class="d"></span><span class="d"></span>'
            f'<span class="tab">{html.escape(file)}</span></div>'
            f'<div class="body">{lp}{"".join(rows)}</div>{lab}</div>')


def io(kind, text, width=None, tall=False, big=False):
    lab = {'in': 'Input', 'out': 'Output', 'exp': 'Expected output'}[kind]
    cls = 'in' if kind == 'in' else 'out'
    w = f' style="width:{width}px"' if width else ''
    body = html.escape(text).replace('\n', '<br>')
    return (f'<div class="ndt-io {cls}{" tall" if tall else ""}{" big" if big else ""}"{w}><span class="chip">'
            f'<i></i>{lab}</span><div class="t">{body}</div></div>')


def syntax(head_html, block='Repeating block of code', width=520):
    return (f'<div class="ndt-syn" style="width:{width}px"><div class="h">{head_html}</div>'
            f'<div class="blk"><span class="ind"></span><span class="box">{html.escape(block)}</span></div>'
            f'<span class="loop"></span></div>')


def callout(title, body, tone='blue', icon='i'):
    ic = {'i': '<path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="9"/>',
          'bulb': '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/>'}[icon]
    return (f'<div class="ndt-call {tone}"><span class="ic"><svg viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ic}</svg></span>'
            f'<div><p class="ct">{title}</p><div class="cb">{body}</div></div></div>')


def bullets(items, icon='check'):
    ic = {'check': '<path d="M5 12.5 10 17 19 7"/>',
          'x': '<path d="M6 6l12 12M18 6 6 18"/>',
          'dot': '<circle cx="12" cy="12" r="3.5" fill="currentColor"/>'}
    out = []
    for it in items:
        main, sub = (it if isinstance(it, tuple) else (it, ''))
        k = icon
        out.append(f'<li><span class="bi {k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
                   f'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">{ic[k]}</svg></span>'
                   f'<span><span class="m">{main}</span>{f"<span class=s>{sub}</span>" if sub else ""}</span></li>')
    return f'<ul class="ndt-bul">{"".join(out)}</ul>'


# ---------------------------------------------------------------- slides
def light(eyebrow, title, sub, body, eyebrow_tone=''):
    s = f'<p class="sub">{sub}</p>' if sub else ''
    return (f'<section class="ndt ndt-light"><span class="arc a1"></span><span class="arc a2"></span>'
            f'<div class="hd"><span class="rail{eyebrow_tone}"></span><span class="kick{eyebrow_tone}"><i></i>{eyebrow}</span>'
            f'<h2>{title}</h2>{s}</div><div class="bd">{body}</div>'
            f'<span class="ndt-logo"></span><span class="ndt-foot"></span></section>')


DOTS = ('<svg class="dots" width="86" height="70" aria-hidden="true">' +
        ''.join(f'<circle cx="{2.6 + 16 * x}" cy="{2.6 + 16 * y}" r="2.6" fill="#fff"/>'
                for y in range(5) for x in range(6)) + '</svg>')


def dark(inner, logo=True, cls=''):
    lg = '<span class="ndt-logo w"></span>' if logo else ''
    return (f'<section class="ndt ndt-dark {cls}"><span class="glow g1"></span><span class="glow g2"></span>'
            f'{DOTS}{inner}{lg}</section>')


def welcome():
    return dark('<div class="wel"><span class="ring r1"></span><span class="ring r2"></span>'
                '<div class="lcard"><span class="lg"></span></div><h1>Welcome</h1><span class="uline"></span></div>',
                logo=False, cls='deep')


def session_title(name):
    return dark(f'<div class="ttl"><p class="k">Welcome to today’s session</p><h1>{html.escape(name)}</h1></div>')


def divider(n, kicker, title, sub=''):
    return dark(f'<div class="div"><span class="ghost">{n:02d}</span><p class="k"><i></i>{kicker}<i></i></p>'
                f'<h2>{title}</h2>{f"<p class=s>{sub}</p>" if sub else ""}</div>')


def agenda(items):
    """items: [(title, one line)], 2 to 6. Every row is drawn from press 1, dimmed;
    agenda_stage() lights one more per press."""
    n = len(items)
    assert 2 <= n <= 6, f'agenda: {n} stops, want 2 to 6'
    xs = [round(60 * math.sin(math.pi * (i + .5) / n)) for i in range(n)]
    gap = {2: 44, 3: 38, 4: 34, 5: 24, 6: 16}[n]
    rows = ''.join(f'<li style="margin-left:{x}px"><span class="n">{i}</span><div><p class="t">{t}</p>'
                   f'<p class="s">{s}</p></div></li>' for i, ((t, s), x) in enumerate(zip(items, xs), 1))
    return (f'<section class="ndt ndt-light ndt-agenda"><span class="arc a1"></span><span class="arc a2"></span>'
            f'<span class="aglow"></span><div class="disc"><span class="halo"></span><div class="in">'
            f'<p class="a">Agenda</p><p class="w">What We Will Cover</p></div></div><ol style="gap:{gap}px">{rows}</ol>'
            f'<span class="ndt-logo"></span><span class="ndt-foot"></span></section>')


def recap(title='Where We<br>Left Off', items=None):
    """The Recap card. With no items it is the heading and the mascot only, which
    is the spine's rule: the retrieval on the next card must not be answered here."""
    solo = '' if items else ' solo'
    bd = f'<div class="bd">{bullets(items)}</div>' if items else ''
    return (f'<section class="ndt ndt-light ndt-recap{solo}"><span class="arc a1"></span><span class="arc a2"></span>'
            f'<div class="hd"><span class="rail g"></span><span class="kick g"><i></i>Recap</span><h2>{title}</h2></div>'
            f'{bd}<div class="art"><span class="gl"></span>'
            f'{mascot("recap", "rc")}{clipboard()}</div>'
            f'<span class="ndt-logo"></span><span class="ndt-foot"></span></section>')


def feedback():
    return dark('<div class="fb"><p class="k"><i></i>Feedback</p><h2>We’d love your<br>feedback</h2></div>'
                f'<div class="fbart">{mascot("wave", "fb")}</div>')


def quiz(title='Classroom Quiz', sub='Time to check what you have learned so far.',
         steps=('Open the quiz on your portal', 'Answer every question on your own',
                'We go through the answers together')):
    st = ''.join(f'<li><span class="n">{i}</span>{html.escape(t)}</li>' for i, t in enumerate(steps, 1))
    opts = ''.join(f'<li class="{"on" if k == "B" else ""}"><span class="l">{k}</span><span class="bar" style="width:{w}px"></span>'
                   f'{"<span class=tk></span>" if k == "B" else ""}</li>'
                   for k, w in zip('ABCD', (150, 190, 120, 170)))
    card = ('<div class="qcard"><div class="qtop"><span class="qpill">Quiz</span>'
            '<span class="qdots"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></span>'
            '<span class="qtime"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">'
            '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>Timer</span></div>'
            '<span class="ql w1"></span><span class="ql w2"></span>'
            f'<ol class="qopts">{opts}</ol><span class="qsub">Submit</span></div>')
    return dark(f'<div class="fb qz"><p class="k"><i></i>Quiz time</p><h2>{title}</h2><p class="s">{sub}</p>'
                f'<ol class="qsteps">{st}</ol></div>'
                f'<div class="qart"><span class="qglow"></span>{card}{mascot("idea", "qz", "qmas")}</div>')


def tiles(text, cls=None, idx=True, name=None, jumps=None, tags=None, w=70):
    """A string drawn as letter tiles with its index under each one.
    cls: {i: 'pick' | 'stop' | 'gone' | 'keep' | 'skip'}; jumps: [(from_i, to_i, label)] arcs above;
    tags: {i: text} small tag under the index."""
    cls, tags = cls or {}, tags or {}
    gap = 6
    cells = []
    for i, ch in enumerate(text):
        vis = '&nbsp;' if ch == ' ' else html.escape(ch)
        sp = ' sp' if ch == ' ' else ''
        t = f'<span class="tg">{html.escape(tags[i])}</span>' if i in tags else ''
        ix = f'<span class="ix">{i}</span>' if idx else ''
        cells.append(f'<span class="tl {cls.get(i, "")}{sp}"><span class="ch">{vis}</span>{ix}{t}</span>')
    arcs = ''
    if jumps:
        W = len(text) * (w + gap)
        paths = []
        for a, b, lab in jumps:
            xa, xb = a * (w + gap) + w / 2, b * (w + gap) + w / 2
            mx = (xa + xb) / 2
            paths.append(f'<path d="M{xa + 6},62 C{xa + 10},14 {xb - 10},14 {xb - 6},58" />'
                         f'<path class="hd" d="M{xb - 13},50 L{xb - 5},62 L{xb + 3},50" />'
                         f'<text x="{mx}" y="16">{html.escape(lab)}</text>')
        arcs = f'<svg class="jmp" width="{W}" height="70" viewBox="0 0 {W} 70">{"".join(paths)}</svg>'
    nm = f'<p class="nm">{html.escape(name)}</p>' if name else ''
    return f'<div class="nd-tiles" style="--tw:{w}px;--tg:{gap}px">{nm}{arcs}<div class="row">{"".join(cells)}</div></div>'


def doc_mock(title, line_html, width=520):
    """A white text document with one live line among grey placeholder lines."""
    return (f'<div class="nd-doc" style="width:{width}px"><div class="dbar"><span class="d"></span><span class="d"></span>'
            f'<span class="d"></span><span class="dt">{html.escape(title)}</span></div><div class="dbody">'
            '<span class="gl w1"></span><span class="gl w2"></span>'
            f'<p class="live">{line_html}</p>'
            '<span class="gl w3"></span><span class="gl w4"></span><span class="gl w2"></span></div></div>')


def chip(text, tone='blue', mono=True):
    return f'<span class="nd-chip {tone}{" mono" if mono else ""}">{text}</span>'


def thanks():
    return dark('<div class="ty"><div class="lw"><span class="bl"></span><span class="ndt-logo w big"></span></div>'
                '<h1>Thank you!</h1></div>', logo=False)


def frame(section):
    return f'<div class="slide-img ndt-wrap"><div class="ndt-frame">{section}</div></div>'


# ---------------------------------------------------------------- css / js
FONTS = _read('fonts.css')

CSS = r"""
:root{--nw-deep:#0146C7;--nw-blue:#2D63FB;--nw-navy:#00254B;--nw-ink:#0B1A2B;--nw-body:#4A5B6B;
 --nw-muted:#8A99A8;--nw-line:#D8E3F5;--nw-soft:#EAF1FF;--nw-green:#16A34A;
 --ndt-k:1;--ndt-logo:url(__LOGO__);
 --sans:'Inter',ui-sans-serif,system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,Consolas,monospace;
 --sh-mono:'JetBrains Mono',ui-monospace,Consolas,monospace;
 --ink:#0B1A2B;--muted:#8A99A8;--accent:#2D63FB;--rule:#D8E3F5;--rule2:#EEF3FF;
 --dk-blue:#0146C7;--dk-cyan:#2D63FB;--dk-text:#4A5B6B;--dk-line:#8A99A8;--dk-card:#F5F8FF}
body{font-family:var(--sans)}
body.present .slide,body.present .pcard{background:#060c1c}
body.present.fs .slide,body.present.fs .pcard{background:#060c1c}

/* ---------- panels built by the plan: the template's content ground ---------- */
body.present .stage{position:relative;overflow:hidden;color:var(--nw-body);
 background:
  radial-gradient(calc(var(--ndt-k)*595px) calc(var(--ndt-k)*545px) at 100% 0%,rgba(45,99,251,.13) 0%,rgba(45,99,251,.08) 38%,rgba(45,99,251,0) 100%),
  linear-gradient(160deg,#EEF3FF,#F5F8FF);
 padding:calc(var(--ndt-k)*48px) calc(var(--ndt-k)*64px) calc(var(--ndt-k)*64px)}
body.present .stage::before{content:'';position:absolute;pointer-events:none;border-radius:50%;
 width:calc(var(--ndt-k)*1052px);height:calc(var(--ndt-k)*1052px);left:calc(var(--ndt-k)*1054px);top:calc(var(--ndt-k)*-545px);
 border:1px solid rgba(45,99,251,.18);box-shadow:calc(var(--ndt-k)*-786px) calc(var(--ndt-k)*532px) 0 -1px transparent}
body.present .stage::after{content:'';position:absolute;left:0;right:0;bottom:0;height:calc(var(--ndt-k)*8px);
 background:linear-gradient(90deg,#00254b,#0146c7 45%,#2d63fb);z-index:3}
body.present .stage > *{position:relative;z-index:1}
body.present .stage .ndt-plogo{position:absolute;right:calc(var(--ndt-k)*32px);bottom:calc(var(--ndt-k)*20px);
 width:calc(var(--ndt-k)*75px);height:calc(var(--ndt-k)*36px);background:var(--ndt-logo) no-repeat center/contain;z-index:2;pointer-events:none}
body.present .stage .ndt-parc{position:absolute;pointer-events:none;border-radius:50%;z-index:0;
 width:calc(var(--ndt-k)*1052px);height:calc(var(--ndt-k)*1052px);left:calc(var(--ndt-k)*268px);top:calc(var(--ndt-k)*-13px);
 border:1px solid rgba(45,99,251,.14);
 -webkit-mask-image:linear-gradient(to left bottom,#000 0%,rgba(0,0,0,.85) 30%,rgba(0,0,0,.32) 58%,transparent 80%);
 mask-image:linear-gradient(to left bottom,#000 0%,rgba(0,0,0,.85) 30%,rgba(0,0,0,.32) 58%,transparent 80%)}
body.present .sl-head{display:block;margin:0 0 calc(var(--ndt-k)*18px);min-height:0}
body.present .sl-bar{position:absolute;left:calc(var(--ndt-k)*-64px);top:calc(var(--ndt-k)*4px);bottom:0;height:auto;min-height:0;
 width:calc(var(--ndt-k)*6px);margin:0;border-radius:999px;background:linear-gradient(#2D63FB,rgba(45,99,251,0))}
body.present .sl-head > div,body.present .sl-head{position:relative}
body.present .sl-eyebrow{display:inline-flex;align-items:center;margin:0 0 calc(var(--ndt-k)*12px);
 font:700 calc(var(--ndt-k)*15px)/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--nw-blue)}
body.present .sl-eyebrow::before{content:'';display:inline-block;width:calc(var(--ndt-k)*24px);height:calc(var(--ndt-k)*3px);
 border-radius:999px;background:currentColor;margin-right:calc(var(--ndt-k)*8px)}
body.present .sl-title{font:800 calc(var(--ndt-k)*34px)/1.12 'Sora',var(--sans);color:var(--nw-ink);letter-spacing:0}
body.present .stage-rule{height:0;background:none;margin-top:auto}
body.present .stage-ctl{display:flex;justify-content:center;gap:calc(var(--ndt-k)*8px);margin-top:calc(var(--ndt-k)*10px)}
body.present .stage-ctl button{font:600 calc(var(--ndt-k)*14px)/1 var(--sans);border-radius:999px;
 padding:calc(var(--ndt-k)*9px) calc(var(--ndt-k)*18px);background:var(--nw-blue);color:#fff;border:0;
 box-shadow:0 6px 16px rgba(45,99,251,.25)}
body.present .stage-ctl button.ghost{background:rgba(255,255,255,.85);color:var(--nw-muted);box-shadow:inset 0 0 0 1px rgba(138,153,168,.25)}
body.present .stage-q{color:var(--nw-body)}
body.present .stage{--code-bg:#FFFFFF;--code-ink:#0B1A2B}
body.present .stage pre.term,body.present .stage .mrout{background:#fff!important;color:#0B1A2B!important;border:1px solid var(--nw-line);border-radius:calc(var(--ndt-k)*16px);
 box-shadow:0 1px 2px rgba(11,26,43,.04),0 10px 26px rgba(1,70,199,.07)}
body.present .stage button:not(.ghost){--ink:#2D63FB}
body.present .stage-ctl button,body.present .stage .stage-ctl2 button{border-radius:999px}
body.present .sl-head{margin-bottom:calc(var(--ndt-k)*26px)}
body.present .cap b,body.present .stage b{color:var(--nw-ink)}

/* ---------- slides drawn on the template's 1280 x 720 canvas ---------- */
body.present .ndt-wrap{background:#060c1c;display:flex;align-items:center;justify-content:center;
 width:100%;max-width:none;min-width:0;flex:1 1 auto;margin:0;padding:0}
.ndt-frame{position:relative;overflow:hidden;width:var(--slide-w);height:min(var(--slide-h),calc(100vw*9/16))}
.ndt{position:absolute;left:0;top:0;width:1280px;height:720px;transform:scale(var(--ndt-k));transform-origin:0 0;
 overflow:hidden;font-family:var(--sans);-webkit-font-smoothing:antialiased;box-sizing:border-box}
.ndt *{box-sizing:border-box}
.ndt p,.ndt h1,.ndt h2,.ndt ul,.ndt ol{margin:0;padding:0}
.ndt-light{background:radial-gradient(595px 545px at 100% 0%,rgba(45,99,251,.13) 0%,rgba(45,99,251,.082) 38%,rgba(45,99,251,.027) 65%,rgba(45,99,251,0) 100%),linear-gradient(160deg,#EEF3FF,#F5F8FF);
 color:var(--nw-ink);padding:48px 64px 64px;display:flex;flex-direction:column}
.ndt .arc{position:absolute;pointer-events:none;border-radius:50%;width:1052px;height:1052px}
.ndt .a1{left:1054px;top:-545px;border:1px solid rgba(45,99,251,.18)}
.ndt .a2{left:268px;top:-13px;border:1px solid rgba(45,99,251,.14);
 -webkit-mask-image:linear-gradient(to left bottom,#000 0%,rgba(0,0,0,.85) 30%,rgba(0,0,0,.32) 58%,transparent 80%);
 mask-image:linear-gradient(to left bottom,#000 0%,rgba(0,0,0,.85) 30%,rgba(0,0,0,.32) 58%,transparent 80%)}
.ndt-logo{position:absolute;right:32px;bottom:20px;width:75px;height:36px;background:var(--ndt-logo) no-repeat center/contain;z-index:4}
.ndt-logo.w{filter:brightness(0) invert(1)}
.ndt-foot{position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#00254b,#0146c7 45%,#2d63fb);z-index:4}
.ndt .hd{position:relative;flex:none;z-index:2}
.ndt .rail{position:absolute;left:-64px;top:4px;height:100%;width:6px;border-radius:999px;background:linear-gradient(#2D63FB,rgba(45,99,251,0))}
.ndt .rail.g{background:linear-gradient(#16A34A,rgba(22,163,74,0))}
.ndt .kick{display:inline-flex;align-items:center;gap:8px;margin-bottom:12px;font:700 15px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:#2D63FB}
.ndt .kick i{display:inline-block;width:24px;height:3px;border-radius:999px;background:currentColor}
.ndt .kick.g{color:#16A34A}
.ndt .hd h2{font:800 34px/1.12 'Sora',var(--sans);color:var(--nw-ink)}
.ndt .hd .sub{margin-top:12px;max-width:768px;font-size:22px;line-height:1.5;color:var(--nw-body)}
.ndt .bd{position:relative;z-index:2;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:40px;padding-bottom:8px}
.ndt .nd-col{display:flex;flex-direction:column;gap:22px}
.ndt .nd-lead{font-size:24px;line-height:1.5;color:var(--nw-body);max-width:430px}
.ndt .nd-lead b{color:var(--nw-ink);font-weight:600}
.ndt .nd-kw{font-family:var(--mono);font-weight:700;color:#C2255C}

/* code card */
.ndt-code{position:relative;background:#fff;border:1px solid var(--nw-line);border-radius:18px;
 box-shadow:0 1px 2px rgba(11,26,43,.04),0 14px 34px rgba(1,70,199,.09);font-family:var(--mono);min-width:420px}
.ndt-code .bar{display:flex;align-items:center;gap:7px;height:42px;padding:0 16px;background:#F5F8FF;border-bottom:1px solid #E3EAF7;border-radius:18px 18px 0 0}
.ndt-code .d{width:10px;height:10px;border-radius:50%;background:#D8E3F5}
.ndt-code .tab{margin-left:12px;font:600 13px/1 var(--mono);color:var(--nw-body);background:#fff;border:1px solid #E3EAF7;border-bottom:0;
 border-radius:8px 8px 0 0;padding:9px 14px 12px;align-self:flex-end;box-shadow:inset 0 2px 0 #2D63FB}
.ndt-code .body{position:relative;padding:14px 0}
.ndt-code .row{display:flex;height:var(--lh);align-items:center;font-size:var(--fs);color:var(--nw-ink);white-space:pre;padding-right:28px}
.ndt-code .row.mk{background:rgba(45,99,251,.1);box-shadow:inset 3px 0 0 #2D63FB}
.ndt-code .row.wn{background:rgba(255,196,106,.32);box-shadow:inset 3px 0 0 #FF7A29}
.ndt-code .no{flex:none;width:72px;padding-right:22px;text-align:right;color:#A9B6C6;font-size:calc(var(--fs)*.72)}
.ndt-code i{font-style:normal}
.ndt-code .k{color:#C2255C;font-weight:700}
.ndt-code .b{color:#0146C7}
.ndt-code .s{color:#0C8E82}
.ndt-code .n{color:#E8590C}
.ndt-code .o{color:#7C3AED}
.ndt-code .loop{position:absolute;left:14px;width:16px;border:2px dashed #FF7A29;border-right:0;border-radius:8px 0 0 8px}
.ndt-code .loop::after{content:'';position:absolute;right:-7px;top:-7px;border:6px solid transparent;border-left:9px solid #FF7A29}
.ndt-code .labs{position:absolute;left:100%;top:42px;width:320px}
.ndt-code .lab{position:absolute;left:0;display:flex;align-items:center;gap:12px;padding-left:18px;font:600 20px/1 var(--sans);color:#0146C7;white-space:nowrap}
.ndt-code .lab i{display:block;width:34px;height:2px;background:#2D63FB;position:relative}
.ndt-code .lab i::after{content:'';position:absolute;right:-2px;top:-5px;border:6px solid transparent;border-left:8px solid #2D63FB}

/* input / output */
.ndt-io{position:relative;background:#fff;border:1px solid var(--nw-line);border-radius:16px;padding:40px 22px 16px;
 box-shadow:0 1px 2px rgba(11,26,43,.04),0 10px 26px rgba(1,70,199,.07);min-width:190px}
.ndt-io .chip{position:absolute;left:14px;top:12px;display:inline-flex;align-items:center;gap:7px;font:700 12px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;padding:5px 10px;border-radius:999px}
.ndt-io .chip i{width:7px;height:7px;border-radius:50%;background:currentColor}
.ndt-io.in .chip{color:#15803D;background:#DCFCE7}
.ndt-io.out .chip{color:#0146C7;background:#DCE7FB}
.ndt-io .t{font:500 24px/1.45 var(--mono);color:var(--nw-ink);white-space:pre}
.ndt-io.big{padding:48px 28px 22px}
.ndt-io.big .chip{font-size:14px;left:18px;top:16px}
.ndt-io.big .t{font-size:32px;line-height:1.4}

/* for-loop shape */
.ndt-syn{position:relative;padding-left:40px}
.ndt-syn .h{font:700 25px/1.4 var(--mono);color:var(--nw-ink);margin-bottom:12px;white-space:nowrap}
.ndt-syn .h .k{color:#C2255C}
.ndt-syn .h .v{color:#0146C7}
.ndt-syn .blk{display:flex;height:84px}
.ndt-syn .ind{width:52px;background:#E8EEF9;border-radius:10px 0 0 10px}
.ndt-syn .box{flex:1;display:grid;place-items:center;background:#DCE7FB;border:2px solid #2D63FB;border-radius:0 12px 12px 0;
 font:500 20px/1 var(--mono);color:#0146C7}
.ndt-syn .loop{position:absolute;left:4px;top:18px;height:110px;width:24px;border:2px dashed #FF7A29;border-right:0;border-radius:10px 0 0 10px}
.ndt-syn .loop::after{content:'';position:absolute;right:-8px;top:-7px;border:6px solid transparent;border-left:9px solid #FF7A29}

/* callout */
.ndt-call{display:flex;gap:18px;align-items:flex-start;border-radius:18px;padding:22px 26px;background:#EAF1FF;
 box-shadow:inset 4px 0 0 #2D63FB,0 10px 24px rgba(1,70,199,.06);max-width:1152px}
.ndt-call.green{background:#E6F7F1;box-shadow:inset 4px 0 0 #0C8E82,0 10px 24px rgba(12,142,130,.06)}
.ndt-call .ic{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:#2D63FB;color:#fff}
.ndt-call.green .ic{background:#0C8E82}
.ndt-call .ic svg{width:22px;height:22px}
.ndt-call .ct{font:700 16px/1.4 'Sora',var(--sans);color:#0B5FFF;margin-bottom:4px}
.ndt-call.green .ct{color:#0C8E82}
.ndt-call .cb{font-size:20px;line-height:1.55;color:#1E3048}

/* bullets */
.ndt-bul{list-style:none;display:flex;flex-direction:column;gap:20px}
.ndt-bul li{display:flex;gap:16px;align-items:flex-start}
.ndt-bul .bi{flex:none;width:32px;height:32px;border-radius:12px;display:grid;place-items:center;background:rgba(45,99,251,.1);color:#2D63FB;margin-top:2px}
.ndt-bul .bi.check{background:rgba(22,163,74,.12);color:#16A34A}
.ndt-bul .bi.x{background:rgba(194,37,92,.1);color:#C2255C}
.ndt-bul .bi svg{width:18px;height:18px}
.ndt-bul .m{display:block;font-size:22px;line-height:1.5;font-weight:500;color:var(--nw-ink)}
.ndt-bul .s{display:block;margin-top:2px;font-size:16px;line-height:1.55;color:var(--nw-body)}

/* range pieces */
.ndt .nd-rbig{font:600 44px/1.2 var(--mono);color:#0146C7}
.ndt .nd-rbig .p{color:#7C3AED}
.ndt .nd-rbig .e{color:#C2255C}
.ndt .nd-note{font-size:22px;line-height:1.5;color:var(--nw-body);text-align:center}
.ndt .nd-note b{color:#C2255C;font-family:var(--mono);font-weight:600}
.ndt .nd-arrow{width:2px;background:#16A34A;position:relative;margin:0 auto}
.ndt .nd-arrow.dn::after,.ndt .nd-arrow.up::after{content:'';position:absolute;left:-7px;border:8px solid transparent}
.ndt .nd-arrow.dn::after{bottom:-12px;border-top:12px solid #16A34A}
.ndt .nd-arrow.up::after{top:-12px;border-bottom:12px solid #16A34A}
.ndt .nd-cells{display:flex;gap:0}
.ndt .nd-cells span{width:76px;height:76px;display:grid;place-items:center;font:600 34px/1 var(--mono);color:#0146C7;background:#fff;
 border:2px solid #C9D8F5;margin-left:-2px;box-shadow:0 8px 18px rgba(1,70,199,.06)}
.ndt .nd-cells span:first-child{border-radius:14px 0 0 14px;margin-left:0}
.ndt .nd-cells span:last-child{border-radius:0 14px 14px 0}
.ndt .nd-harrow{width:90px;height:2px;background:#C2255C;position:relative}
.ndt .nd-harrow::after{content:'';position:absolute;right:-12px;top:-7px;border:8px solid transparent;border-left:12px solid #C2255C}
.ndt .nd-pill{display:inline-flex;align-items:center;gap:10px;padding:12px 18px;border-radius:14px;background:#fff;border:1px solid var(--nw-line);
 font:600 19px/1 var(--sans);color:var(--nw-ink);box-shadow:0 8px 18px rgba(1,70,199,.05)}
.ndt .nd-pill s{color:var(--nw-muted)}
.ndt .nd-pill .nd-xx{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:rgba(194,37,92,.1);color:#C2255C;font-weight:800}

/* navy slides */
.ndt-dark{background:radial-gradient(120% 120% at 18% 0%,#0146c7,#013a86 42%,#00254b);color:#fff}
.ndt-dark .glow{position:absolute;border-radius:50%;pointer-events:none}
.ndt-dark .g1{right:-96px;top:-96px;width:460px;height:460px;background:radial-gradient(circle,rgba(45,99,251,.4) 0%,rgba(45,99,251,0) 68%)}
.ndt-dark .g2{left:-96px;bottom:-128px;width:420px;height:420px;background:radial-gradient(circle,rgba(1,70,199,.4) 0%,rgba(1,70,199,0) 68%)}
.ndt-dark .dots{position:absolute;right:64px;top:50%;opacity:.14}
.ndt-dark h1,.ndt-dark h2{font-family:'Sora',var(--sans);font-weight:800;color:#fff}
.ndt-dark .k{display:inline-flex;align-items:center;gap:8px;font:700 15px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase}
.ndt-dark .k i{display:inline-block;width:24px;height:3px;border-radius:999px;background:currentColor}
.ndt-dark .ttl{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 80px}
.ndt-dark .ttl .k{color:rgba(255,255,255,.7);letter-spacing:.1em;margin-bottom:18px}
.ndt-dark .ttl h1{font-size:64px;line-height:1.1}
.ndt-dark .wel{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ndt-dark.deep{background:radial-gradient(72% 66% at 50% 44%,transparent 58%,rgba(0,37,75,.42) 100%),radial-gradient(120% 120% at 18% 0%,#0146c7,#013a86 42%,#00254b)}
.ndt-dark .wel .ring{position:absolute;border-radius:50%;left:50%;top:41%;transform:translate(-50%,-50%)}
.ndt-dark .wel .r1{width:390px;height:390px;border:2px solid rgba(255,255,255,.15)}
.ndt-dark .wel .r2{width:272px;height:272px;border:1px solid rgba(255,255,255,.12);left:41%;top:36%}
.ndt-dark .lcard{position:relative;width:312px;height:168px;border-radius:32px;background:#fff;display:grid;place-items:center;
 box-shadow:0 30px 60px rgba(0,20,60,.35);margin-bottom:56px}
.ndt-dark .lcard .lg{width:200px;height:96px;background:var(--ndt-logo) no-repeat center/contain}
.ndt-dark .wel h1{font-size:108px;line-height:1.02;letter-spacing:-2.7px}
.ndt-dark .uline{margin-top:26px;width:208px;height:6px;border-radius:999px;background:linear-gradient(90deg,rgba(255,255,255,.9),rgba(255,255,255,.6),rgba(255,255,255,.2))}
.ndt-dark .div{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.ndt-dark .div .ghost{position:absolute;top:50%;left:50%;transform:translate(-50%,-58%);font:800 200px/1 'Sora',var(--sans);color:rgba(255,255,255,.15)}
.ndt-dark .div .k{position:relative;margin-bottom:14px}
.ndt-dark .div h2{position:relative;font-size:44px;line-height:1.2}
.ndt-dark .div .s{position:relative;margin-top:20px;font-size:26px;color:rgba(255,255,255,.75)}
.ndt-dark .fb{position:absolute;left:64px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;max-width:640px}
.ndt-dark .fb .k{margin-bottom:16px;color:#fff}
.ndt-dark .fb h2{font-size:46px;line-height:1.15}
.ndt-dark .fb .s{margin-top:22px;font-size:24px;line-height:1.5;color:rgba(255,255,255,.75)}
.ndt-dark .fbart{position:absolute;right:170px;top:170px;width:330px;height:420px}
.ndt-dark .fbart svg{width:100%;height:100%}
.ndt-dark .ty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ndt-dark .ty .lw{position:relative;display:grid;place-items:center;margin-bottom:40px}
.ndt-dark .ty .bl{position:absolute;width:256px;height:256px;border-radius:50%;background:rgba(255,255,255,.1);filter:blur(48px)}
.ndt-dark .ty .ndt-logo.big{position:relative;right:auto;bottom:auto;width:200px;height:96px}
.ndt-dark .ty h1{font-size:64px;line-height:1.02}

/* agenda */
.ndt-agenda{flex-direction:row;align-items:center}
.ndt-agenda .aglow{position:absolute;right:0;top:0;width:528px;height:480px;background:radial-gradient(60% 60% at 80% 20%,rgba(45,99,251,.2) 0%,transparent 100%)}
.ndt-agenda .disc{position:relative;flex:none;width:336px;height:336px;margin-left:60px;display:grid;place-items:center}
.ndt-agenda .halo{position:absolute;inset:-0px;border-radius:50%;border:1px solid rgba(0,37,75,.12);transform:scale(1.28)}
.ndt-agenda .in{width:336px;height:336px;border-radius:50%;background:#00254B;display:flex;flex-direction:column;align-items:center;justify-content:center;
 text-align:center;box-shadow:0 30px 60px rgba(0,37,75,.25)}
.ndt-agenda .a{font:600 16px/1.6 var(--sans);color:rgba(255,255,255,.7)}
.ndt-agenda .w{font:800 46px/1.1 'Sora',var(--sans);color:#fff;width:200px}
.ndt-agenda ol{list-style:none;position:relative;z-index:2;margin-left:80px;display:flex;flex-direction:column;gap:34px}
.ndt-agenda li{display:flex;gap:18px;align-items:flex-start}
.ndt-agenda .n{flex:none;width:30px;height:30px;border-radius:50%;background:#DCE7FB;color:#00254B;display:grid;place-items:center;font:700 16px/1 'Sora',var(--sans);margin-top:6px}
.ndt-agenda .t{font:700 27px/1.4 'Sora',var(--sans);color:#2D63FB}
.ndt-agenda .s{font-size:16px;line-height:1.55;color:var(--nw-body)}

/* recap */
.ndt-recap .bd{justify-content:flex-start;align-items:flex-start;padding-top:40px}
.ndt-recap .art{position:absolute;right:90px;bottom:100px;width:560px;height:330px}
.ndt-recap .gl{position:absolute;left:180px;top:60px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(22,163,74,.12),transparent 65%)}
.ndt-recap .ndt-mascot{position:absolute;left:0;bottom:-40px;width:260px;height:325px}
.ndt-recap .ndt-clip{position:absolute;right:0;bottom:0;width:240px;height:300px}

/* red line in a code card */
.ndt-code .row.er{background:rgba(224,49,49,.1);box-shadow:inset 3px 0 0 #E03131}

/* letter tiles */
.ndt .nd-tiles{position:relative;display:flex;flex-direction:column;align-items:flex-start}
.ndt .nd-tiles .nm{font:600 22px/1 var(--mono);color:var(--nw-body);margin:0 0 14px 2px}
.ndt .nd-tiles .row{display:flex;gap:var(--tg)}
.ndt .nd-tiles .tl{position:relative;display:flex;flex-direction:column;align-items:center;width:var(--tw)}
.ndt .nd-tiles .ch{width:var(--tw);height:78px;display:grid;place-items:center;font:600 36px/1 var(--mono);color:var(--nw-ink);
 background:#fff;border:2px solid #C9D8F5;border-radius:14px;box-shadow:0 8px 18px rgba(1,70,199,.06)}
.ndt .nd-tiles .sp .ch{background:repeating-linear-gradient(135deg,#fff 0 7px,#F1F5FD 7px 14px)}
.ndt .nd-tiles .ix{margin-top:10px;font:600 20px/1 var(--mono);color:#0146C7}
.ndt .nd-tiles .tg{position:absolute;top:128px;white-space:nowrap;font:700 13px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;padding:6px 9px;border-radius:999px}
.ndt .nd-tiles .pick .ch{background:#DCE7FB;border-color:#2D63FB;color:#0146C7}
.ndt .nd-tiles .pick .tg{background:#DCE7FB;color:#0146C7}
.ndt .nd-tiles .keep .ch{background:#DCFCE7;border-color:#16A34A;color:#15803D}
.ndt .nd-tiles .keep .tg{background:#DCFCE7;color:#15803D}
.ndt .nd-tiles .stop .ch{background:#FFE3E3;border-color:#E03131;border-style:dashed;color:#C92A2A}
.ndt .nd-tiles .stop .ix{color:#C92A2A}
.ndt .nd-tiles .stop .tg{background:#FFE3E3;color:#C92A2A}
.ndt .nd-tiles .gone .ch{background:#F5F8FF;border-style:dashed;color:#A9B6C6}
.ndt .nd-tiles .gone .tg{background:#EEF1F6;color:#6B7B8C}
.ndt .nd-tiles .skip .ch{color:#A9B6C6}
.ndt .nd-tiles .jmp{display:block;margin-bottom:4px;overflow:visible}
.ndt .nd-tiles .jmp path{fill:none;stroke:#7C3AED;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.ndt .nd-tiles .jmp text{font:700 18px/1 var(--mono);fill:#7C3AED;text-anchor:middle}

/* big syntax line */
.ndt .nd-big{font:600 40px/1.2 var(--mono);color:var(--nw-ink);white-space:nowrap}
.ndt .nd-big .a{color:#0146C7}.ndt .nd-big .b{color:#C2255C}.ndt .nd-big .c{color:#7C3AED;font-weight:800}.ndt .nd-big .p{color:#8A99A8}
.ndt .nd-parts{display:flex;gap:18px}
.ndt .nd-part{background:#fff;border:1px solid var(--nw-line);border-radius:16px;padding:16px 20px;box-shadow:0 8px 18px rgba(1,70,199,.05);min-width:220px}
.ndt .nd-part .h{font:700 20px/1.2 var(--mono)}
.ndt .nd-part .t{margin-top:6px;font-size:18px;line-height:1.45;color:var(--nw-body)}

/* chips */
.ndt .nd-chip{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;font:600 20px/1 var(--sans);
 background:#fff;border:1px solid var(--nw-line);color:var(--nw-ink);box-shadow:0 8px 18px rgba(1,70,199,.05)}
.ndt .nd-chip.mono{font-family:var(--mono)}
.ndt .nd-chip.blue{background:#DCE7FB;border-color:#B7CBF5;color:#0146C7}
.ndt .nd-chip.green{background:#DCFCE7;border-color:#A7E3BC;color:#15803D}
.ndt .nd-chip.red{background:#FFE3E3;border-color:#F5B5B5;color:#C92A2A}
.ndt .nd-chip.plain{background:#fff}
.ndt .nd-chip small{font:500 18px/1 var(--sans);color:var(--nw-body);margin-left:6px}

/* document mock */
.ndt .nd-doc{background:#fff;border:1px solid var(--nw-line);border-radius:18px;box-shadow:0 1px 2px rgba(11,26,43,.04),0 14px 34px rgba(1,70,199,.09);overflow:hidden}
.ndt .nd-doc .dbar{display:flex;align-items:center;gap:7px;height:44px;padding:0 16px;background:#F5F8FF;border-bottom:1px solid #E3EAF7}
.ndt .nd-doc .d{width:10px;height:10px;border-radius:50%;background:#D8E3F5}
.ndt .nd-doc .dt{margin-left:10px;font:600 14px/1 var(--sans);color:var(--nw-body)}
.ndt .nd-doc .dbody{padding:26px 30px 30px;display:flex;flex-direction:column;gap:16px}
.ndt .nd-doc .gl{display:block;height:12px;border-radius:999px;background:#E8EEF9}
.ndt .nd-doc .gl.w1{width:92%}.ndt .nd-doc .gl.w2{width:78%}.ndt .nd-doc .gl.w3{width:86%}.ndt .nd-doc .gl.w4{width:60%}
.ndt .nd-doc .live{font:500 28px/1.4 var(--mono);color:var(--nw-ink);padding:6px 0}
.ndt .nd-doc .typo{color:#C92A2A;text-decoration:underline wavy #E03131;text-decoration-thickness:2px;text-underline-offset:6px}

/* quiz */
.ndt-dark .fb.qz{max-width:560px}
.ndt-dark .fb .s{max-width:520px}
.ndt-dark .qsteps{list-style:none;margin-top:34px;display:flex;flex-direction:column;gap:14px}
.ndt-dark .qsteps li{display:flex;align-items:center;gap:16px;font-size:21px;line-height:1.3;color:#fff;
 background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:14px 20px}
.ndt-dark .qsteps .n{flex:none;width:34px;height:34px;border-radius:50%;background:#fff;color:#0146C7;display:grid;place-items:center;font:800 17px/1 'Sora',var(--sans)}
.ndt-dark .qart{position:absolute;right:96px;top:120px;width:470px;height:480px}
.ndt-dark .qglow{position:absolute;left:40px;top:30px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.16),rgba(255,255,255,0) 68%)}
.ndt-dark .qcard{position:absolute;left:30px;top:40px;width:380px;background:#fff;border-radius:24px;padding:24px 26px 26px;
 box-shadow:0 30px 60px rgba(0,20,60,.35);transform:rotate(-3deg);color:var(--nw-ink)}
.ndt-dark .qtop{display:flex;align-items:center;gap:12px;margin-bottom:20px}
.ndt-dark .qpill{font:700 13px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:#0146C7;background:#DCE7FB;padding:7px 12px;border-radius:999px}
.ndt-dark .qdots{display:flex;gap:5px}
.ndt-dark .qdots i{width:18px;height:6px;border-radius:999px;background:#E3EAF7}
.ndt-dark .qdots i.on{background:#2D63FB}
.ndt-dark .qtime{margin-left:auto;display:inline-flex;align-items:center;gap:6px;font:600 14px/1 var(--mono);color:#8A99A8}
.ndt-dark .qtime svg{width:16px;height:16px}
.ndt-dark .ql{display:block;height:14px;border-radius:999px;background:#E3EAF7;margin-bottom:10px}
.ndt-dark .ql.w1{width:94%}.ndt-dark .ql.w2{width:66%;margin-bottom:22px}
.ndt-dark .qopts{list-style:none;display:flex;flex-direction:column;gap:10px}
.ndt-dark .qopts li{position:relative;display:flex;align-items:center;gap:14px;height:52px;padding:0 14px;border-radius:14px;border:1.5px solid #E3EAF7;background:#F8FAFE}
.ndt-dark .qopts li.on{border-color:#2D63FB;background:#EAF1FF;box-shadow:0 0 0 3px rgba(45,99,251,.14)}
.ndt-dark .qopts .l{flex:none;width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font:700 15px/1 'Sora',var(--sans);background:#fff;border:1px solid #D8E3F5;color:#4A5B6B}
.ndt-dark .qopts li.on .l{background:#2D63FB;border-color:#2D63FB;color:#fff}
.ndt-dark .qopts .bar{height:10px;border-radius:999px;background:#E3EAF7}
.ndt-dark .qopts li.on .bar{background:#B7CBF5}
.ndt-dark .qopts .tk{position:absolute;right:14px;width:26px;height:26px;border-radius:50%;background:#16A34A}
.ndt-dark .qopts .tk::after{content:'';position:absolute;left:9px;top:5px;width:6px;height:12px;border:solid #fff;border-width:0 3px 3px 0;transform:rotate(45deg)}
.ndt-dark .qsub{display:block;margin-top:20px;text-align:center;font:700 16px/1 var(--sans);color:#fff;background:#2D63FB;border-radius:999px;padding:14px;box-shadow:0 8px 18px rgba(45,99,251,.3)}
.ndt-dark .qmas{position:absolute;right:-70px;bottom:-40px;width:190px;height:238px}


/* recap card with no points: the heading and the mascot fill it */
.ndt-recap.solo{justify-content:center;padding-bottom:120px}
.ndt-recap.solo .hd h2{font-size:64px;line-height:1.08;max-width:560px}
.ndt-recap.solo .kick{font-size:18px}
.ndt-recap.solo .art{right:70px;bottom:90px;width:600px;height:380px}
.ndt-recap.solo .ndt-mascot{width:290px;height:362px}
.ndt-recap.solo .ndt-clip{width:270px;height:338px}

/* a drawn slide that steps: a .stage the presenter can drive, with no stage chrome */
.stage.ndt-host{padding:0;border:0;border-radius:0;background:none}
body.present .stage.ndt-host{padding:0;background:#060c1c;display:flex;align-items:center;justify-content:center;overflow:hidden}
body.present .stage.ndt-host::before,body.present .stage.ndt-host::after{display:none}
.ndt-host .ndt-agenda li{opacity:.28;transition:opacity .35s cubic-bezier(.23,1,.32,1)}
.ndt-host .ndt-agenda li .n{transition:background .35s,color .35s}
.ndt-host.an-1 .ndt-agenda li:nth-child(-n+1){opacity:1}.ndt-host.an-1 .ndt-agenda li:nth-child(1) .n{background:#2D63FB;color:#fff}
.ndt-host.an-2 .ndt-agenda li:nth-child(-n+2){opacity:1}.ndt-host.an-2 .ndt-agenda li:nth-child(2) .n{background:#2D63FB;color:#fff}
.ndt-host.an-3 .ndt-agenda li:nth-child(-n+3){opacity:1}.ndt-host.an-3 .ndt-agenda li:nth-child(3) .n{background:#2D63FB;color:#fff}
.ndt-host.an-4 .ndt-agenda li:nth-child(-n+4){opacity:1}.ndt-host.an-4 .ndt-agenda li:nth-child(4) .n{background:#2D63FB;color:#fff}
.ndt-host.an-5 .ndt-agenda li:nth-child(-n+5){opacity:1}.ndt-host.an-5 .ndt-agenda li:nth-child(5) .n{background:#2D63FB;color:#fff}
.ndt-host.an-6 .ndt-agenda li:nth-child(-n+6){opacity:1}.ndt-host.an-6 .ndt-agenda li:nth-child(6) .n{background:#2D63FB;color:#fff}

@media (prefers-reduced-motion:reduce){.ndt-host .ndt-agenda li,.ndt-host .ndt-agenda li .n{transition:none}}

/* the recap formats' first colour was the old deck blue */
.rcp-card.on[data-pair="0"]{border-color:#2D63FB;background:#EAF1FF}
.rcp-card.on[data-pair="0"] .rcp-badge{background:#2D63FB}
.rcp-pairwhy.on[data-pair="0"]{border-color:#2D63FB}

/* the template's viewer pills */
.ndt-nav{position:fixed;left:20px;bottom:16px;z-index:60;display:none;align-items:center;gap:8px}
body.present .ndt-nav{display:flex}
body.present.guides-on .ndt-nav{opacity:.4}
.ndt-nav .cnt{margin-right:4px;font:500 14px/1 'JetBrains Mono',monospace;color:#8A99A8;background:rgba(255,255,255,.85);
 border-radius:999px;padding:6px 10px;box-shadow:inset 0 0 0 1px rgba(138,153,168,.2);backdrop-filter:blur(6px)}
.ndt-nav .cnt i{font-style:normal;color:rgba(138,153,168,.6)}
.ndt-nav button{width:40px;height:40px;display:grid;place-items:center;border:0;border-radius:999px;background:rgba(255,255,255,.85);
 color:#8A99A8;box-shadow:inset 0 0 0 1px rgba(138,153,168,.2);cursor:pointer;backdrop-filter:blur(6px);transition:background .15s,color .15s}
.ndt-nav button:hover{background:#fff;color:#4A5B6B}
.ndt-nav button:disabled{opacity:.3;cursor:not-allowed}
.ndt-prog{position:fixed;left:0;right:0;top:0;height:3px;z-index:60;background:rgba(255,255,255,.1);display:none}
body.present .ndt-prog{display:block}
.ndt-prog i{display:block;height:100%;border-radius:0 999px 999px 0;background:linear-gradient(90deg,#0146C7,#2D63FB,#2D63FB);transition:width .3s}
"""

NAV = """<div class="ndt-prog"><i id="ndt-pbar"></i></div>
<div class="ndt-nav"><span class="cnt" id="ndt-cnt">01<i> / 01</i></span>
<button type="button" aria-label="Previous" id="ndt-prev"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
<button type="button" aria-label="Next" id="ndt-next"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
<button type="button" aria-label="Toggle fullscreen" id="ndt-fs"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>"""

JS = r"""<script>
(function(){
  var root=document.documentElement;
  function fit(){
    var w=Math.min(innerWidth, innerHeight*16/9);
    root.style.setProperty('--ndt-k', (w/1280).toFixed(5));
  }
  fit(); addEventListener('resize',fit);
  /* every plan panel gets the template's logo and second arc */
  [].forEach.call(document.querySelectorAll('.stage'),function(s){
    if(s.closest('.ndt')||s.classList.contains('ndt-host')) return;
    var a=document.createElement('span'); a.className='ndt-parc'; s.insertBefore(a,s.firstChild);
    var l=document.createElement('span'); l.className='ndt-plogo'; s.appendChild(l);
  });
  /* the template's type is wider than the plan's; a panel whose body no longer fits
     between its heading and its buttons shrinks its body until it does */
  var SKIP=/(^|\s)(sl-head|stage-ctl|stage-rule|ndt-parc|ndt-plogo)(\s|$)/;
  function extent(el){
    var r=el.getBoundingClientRect(), t=r.top, b=r.bottom;
    [].forEach.call(el.querySelectorAll('*'),function(d){
      if(d.closest('svg') && d.tagName.toLowerCase()!=='svg') return;
      var q=d.getBoundingClientRect(); if(!q.width||!q.height) return;
      if(q.top<t) t=q.top; if(q.bottom>b) b=q.bottom;
    });
    return [t,b];
  }
  /* a box, or one of its in-flow boxes a few levels down, painting into the box below it
     (or the buttons); running past its own edge into empty space is fine */
  function flow(el){ var c=getComputedStyle(el); return c.position!=='absolute'&&c.position!=='fixed'&&c.display!=='none'&&c.display!=='inline'&&el.tagName.toLowerCase()!=='svg'; }
  function spills(el,depth,floor,ceil){
    var r=el.getBoundingClientRect(); if(!r.height) return false;
    if(getComputedStyle(el).overflowY==='visible'){ var e=extent(el); if(e[1]>floor+3||e[0]<ceil-3) return true; }
    if(depth<=1) return false;
    var kids=[].filter.call(el.children,flow), rs=kids.map(function(k){return k.getBoundingClientRect();});
    for(var i=0;i<kids.length;i++){
      var f=floor,c=ceil;
      for(var j=0;j<kids.length;j++){ if(j===i||!rs[j].height) continue;
        var sideBySide=rs[j].left>=rs[i].right-1||rs[j].right<=rs[i].left+1;
        if(sideBySide) continue;
        if(rs[j].top>=rs[i].top+rs[i].height/2) f=Math.min(f,rs[j].top);
        else if(rs[j].bottom<=rs[i].bottom-rs[i].height/2) c=Math.max(c,rs[j].bottom); }
      if(spills(kids[i],depth-1,f,c)) return true;
    }
    return false;
  }
  function fitStage(s){
    var cs=getComputedStyle(s), body=[].filter.call(s.children,function(c){
      return !SKIP.test(c.className||'') && getComputedStyle(c).position!=='absolute';
    });
    if(!body.length) return;
    body.forEach(function(c){ c.style.zoom=''; });
    var sr=s.getBoundingClientRect(); if(!sr.height) return;
    var hd=s.querySelector(':scope > .sl-head'), ct=s.querySelector(':scope > .stage-ctl');
    var top=hd?hd.getBoundingClientRect().bottom:sr.top+parseFloat(cs.paddingTop);
    var bot=ct&&ct.getBoundingClientRect().height?ct.getBoundingClientRect().top:sr.bottom-parseFloat(cs.paddingBottom)*0.5;
    for(var z=1;z>=0.74;z-=0.03){
      if(z<1) body.forEach(function(c){ c.style.zoom=z.toFixed(2); });
      /* a squeezed flex child (min-height:0) paints past its own box into the next one */
      var t=Infinity,b=-Infinity,spill=false,rs=body.map(function(c){return c.getBoundingClientRect();});
      body.forEach(function(c,i){
        var e=extent(c);
        if(e[0]<t) t=e[0]; if(e[1]>b) b=e[1];
        var f=bot,cl=top;
        rs.forEach(function(q,j){ if(j===i||!q.height) return;
          if(q.top>=rs[i].top+rs[i].height/2) f=Math.min(f,q.top); else if(q.bottom<=rs[i].bottom-rs[i].height/2) cl=Math.max(cl,q.bottom); });
        if(spills(c,4,f,cl)) spill=true;
      });
      if(t>=top-2 && b<=bot+2 && !spill){ s.dataset.ndtZoom=z<1?z.toFixed(2):''; return; }
    }
  }
  function fitAll(){
    [].forEach.call(document.querySelectorAll('.stage'),function(s){
      if(s.closest('.ndt')||s.classList.contains('ndt-host')||!s.offsetParent) return;
      var r=s.getBoundingClientRect(); if(r.right<0||r.left>innerWidth) return;
      fitStage(s);
    });
  }
  function later(){ setTimeout(fitAll,60); setTimeout(fitAll,500); }
  addEventListener('resize',later); document.addEventListener('click',later,true); document.addEventListener('keydown',later,true);
  var cnt=document.getElementById('ndt-cnt'), bar=document.getElementById('ndt-pbar'),
      src=document.getElementById('p-count');
  function sync(){
    var m=(src.textContent||'').match(/(\d+)\s*\/\s*(\d+)/); if(!m) return;
    var i=+m[1], n=+m[2], pad=function(x){return (x<10?'0':'')+x;};
    cnt.innerHTML=pad(i)+'<i> / '+pad(n)+'</i>';
    bar.style.width=(i/n*100)+'%';
    document.getElementById('ndt-prev').disabled=(i===1);
    document.getElementById('ndt-next').disabled=(i===n);
  }
  new MutationObserver(function(){ sync(); later(); }).observe(src,{childList:true,characterData:true,subtree:true}); sync(); later();
  document.getElementById('ndt-prev').onclick=function(){ document.getElementById('p-prev').click(); };
  document.getElementById('ndt-next').onclick=function(){ document.getElementById('p-next').click(); };
  document.getElementById('ndt-fs').onclick=function(){ document.getElementById('p-full').click(); };
})();
</script>"""


# ---------------------------------------------------------------- the build API
def _name(session):
    """'18 - Comparing Strings & Naming Variables' -> the name alone."""
    return re.sub(r'^\s*\d+\s*[-.]\s*', '', str(session)).strip()


def _pic(kind, section):
    """A spine card drawn in this look. data-spine and spine-<kind> are the markers
    standard_slides.spine_html_check and shoot_cards look for; keep both."""
    return (f'<div class="slide-img ndt-wrap spine-pic spine-{kind}" data-spine="{kind}">'
            f'<div class="ndt-frame">{section}</div></div>')


def spine(session):
    """The fixed spine in this look, keyed like build-template's spine_cards().
    Nothing on these is designed per session; only the title card's name changes."""
    return {
        'welcome': _pic('welcome', welcome()),
        'recap_card': _pic('recap', recap()),
        'title': _pic('title', session_title(_name(session))),
        'quiz': _pic('quiz', quiz()),
        'feedback': _pic('feedback', feedback()),
        'thankyou': _pic('thankyou', thanks()),
    }


def agenda_stage(items):
    """The agenda: one stop per press, every row there from press 1."""
    return (f'<div class="stage ndt-host" data-anim="{len(items)}" '
            f'data-anim-labels="{"|".join(html.escape(t) for t, _ in items)}">'
            f'<div class="ndt-frame">{agenda(items)}</div></div>')


def drawn(n, section):
    """A kept deck slide, redrawn on the template canvas instead of shown as the
    deck's picture. data-deck carries the deck's own number for verify_plan."""
    return f'<div class="slide-img ndt-wrap" data-deck="{n}"><div class="ndt-frame">{section}</div></div>'


def theme(doc):
    """Lay the look over a filled plan-template.html. Call it once, last."""
    assert 'id="ndt-skin"' not in doc, 'theme() already applied'
    assert doc.count('</head>') == 1, 'theme(): no single </head>'
    style = '<style id="ndt-skin">' + FONTS + CSS.replace('__LOGO__', LOGO) + '</style>'
    doc = doc.replace('</head>', style + '\n</head>', 1)
    i = doc.rfind('</body>')
    assert i > 0, 'theme(): no </body>'
    return doc[:i] + NAV + JS + doc[i:]
