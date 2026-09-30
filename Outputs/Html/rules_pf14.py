"""PF 14 For Loop: the new-design view brought in line with the Web-Slides rules.

Reads  14_for_loop_student_view_new_design.html
Writes the same file name into Web-Slides/Outputs/Html, beside this script.
The source is never touched.

It changes the look only. Every stage keeps its markup ids, classes and step
logic; the edits are an override stylesheet laid over the two existing ones,
plus a handful of DOM edits that no stylesheet can make (a lead moved out of
the header, a file tab renamed, a bare code slab given its editor chrome).

    python3 Outputs/Html/rules_pf14.py [path/to/14_for_loop_student_view_new_design.html]

Rules applied (Web-Slides .claude/skills/slide-content-rules):
  26  a code box names its language, never a file
  19  kicker and title pinned at x 64, y 48 on every slide
  22  zones: header y 0..148, body from y 221, video box x 913+ / y <220 empty
  23  no tick before the kicker; a 24px edge bar and a 6px rail, both 80px
  24  Poppins for headings, Inter for the rest, JetBrains Mono for code
  25  a heading never wraps and is never shrunk (the stage auto-zoom is off)
Code, pseudocode and output boxes use the kit's CodeBlock / pseudocode /
CodeOutput themes, and a code box names its language, never a file.
"""
import base64, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
# the reference build this pass is laid over (PF lesson-plan project)
DEFAULT = ('/home/nxtwave/Downloads/Programming_Foundations_LP/Plans/14 - For Loop/'
           '14_for_loop_student_view_new_design.html')
SRC = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else DEFAULT)
DST = os.path.join(HERE, os.path.basename(SRC))
assert SRC != DST
LANG = 'Python'

# Poppins, from the same @fontsource build the Web-Slides kit ships
POPPINS = os.environ.get('POPPINS_DIR', '/home/nxtwave/Desktop/webslides/Web-Slides/'
                         'Rules_beta/typography/node_modules/@fontsource/poppins/files')


def font_faces():
    out = []
    for w in (500, 600, 700, 800):
        p = os.path.join(POPPINS, f'poppins-latin-{w}-normal.woff2')
        b = base64.b64encode(open(p, 'rb').read()).decode()
        out.append("@font-face{font-family:'Poppins';font-style:normal;font-weight:%d;font-display:swap;"
                   "src:url(data:font/woff2;base64,%s) format('woff2')}" % (w, b))
    return ''.join(out)


doc = open(SRC, encoding='utf-8').read()
n0 = len(doc)


def sub(pat, rep, s, count=0, flags=0, expect=None):
    new, n = re.subn(pat, rep, s, count=count, flags=flags)
    if expect is not None:
        assert n == expect, (pat, n, expect)
    return new


# ---------------------------------------------------------------- 1. typefaces
# Sora goes, with its embedded face; every 'Sora' reference becomes Poppins.
doc = sub(r"@font-face\{font-family:'Sora';[^}]*\}", '', doc, expect=1)
doc = doc.replace("'Sora'", "'Poppins'")

# ---------------------------------------------------------------- 2. drawn slides
# The lead leaves the header (rule 22) and becomes the first block of the body.
def rezone(m):
    hd, lead, body = m.group(1), m.group(2) or '', m.group(3)
    return f'{hd}</div><div class="bd zb">{lead}<div class="bdrow">{body}</div></div>'


doc = sub(r'(<div class="hd">.*?</h2>)(<p class="sub">.*?</p>)?</div><div class="bd">(.*?)</div>'
          r'(?=<span class="ndt-logo|<div class="art")', rezone, doc, flags=re.S)

# A code box names its language, never a file (user, 2026-09-29).
doc = sub(r'<span class="tab">[^<]*\.py</span>', f'<span class="tab">{LANG}</span>', doc)
doc = sub(r'(<div class="ed-tab"><i></i><i></i><i></i><span>)[^<]*\.py(</span>)', rf'\g<1>{LANG}\2', doc)

# The one pseudocode shape gets a header like the code box beside it.
doc = sub(r'<div class="ndt-syn"([^>]*)><div class="h">',
          r'<div class="ndt-syn"\1><div class="psbar"><span class="d"></span><span class="d"></span>'
          r'<span class="d"></span><span class="tab">Pseudocode</span></div><div class="h">', doc)

# Agenda: one left edge for the four items, not a hand-set curve.
doc = sub(r'<li style="margin-left:\d+px">', '<li>', doc, expect=4)

# Feedback: the heading was forced onto two lines with a <br>. Shortened (rule 25).
doc = sub(r'<h2>We’d love your<br>feedback</h2>', '<h2>Share your feedback</h2>', doc, expect=1)

# ---------------------------------------------------------------- 3. stage code
# Bare code slabs get the same editor chrome as the rest.
def wrap_bare(m):
    return (f'<div class="ed"><div class="ed-tab"><i></i><i></i><i></i><span>{LANG}</span></div>'
            f'{m.group(0)}</div>')


doc = sub(r'(?<!</div>)<pre class="cx"[^>]*>.*?</pre>', wrap_bare, doc, flags=re.S)
# numbers and callables share <i> and <b> in the stage markup; split them so the
# kit palette can tell a number from a function
doc = sub(r'<i>(\d+)</i>', r'<i class="n">\1</i>', doc)
doc = sub(r'<b>(print|len|int|input|range)</b>', r'<b class="f">\1</b>', doc)

# Slabs typed as plain text get the same highlighting as the rest.
KW = r'for|in|if|elif|else|while|def|return|and|or|not|True|False|None'
FN = r'print|len|int|input|range|str'


def colour(text):
    tok = re.compile(r'("[^"]*"|&quot;.*?&quot;)|\b(\d+)\b|\b(' + KW + r')\b|\b(' + FN + r')\b(?=\()')
    def one(m):
        if m.group(1): return f'<em>{m.group(1)}</em>'
        if m.group(2): return f'<i class="n">{m.group(2)}</i>'
        if m.group(3): return f'<b>{m.group(3)}</b>'
        return f'<b class="f">{m.group(4)}</b>'
    return tok.sub(one, text)


def plain_slab(m):
    pre = m.group(0)
    if re.search(r'<(b|i|em)\b', pre):
        return pre
    return re.sub(r'(<span class="no">\d+</span>)([^<]*)', lambda q: q.group(1) + colour(q.group(2)), pre)


doc = sub(r'<pre class="cx"[^>]*>.*?</pre>', plain_slab, doc, flags=re.S)

# The stage line highlights were picked for a white slab. Re-picked for night-2.
NOW_OLD = 'background:#CFE9F8;box-shadow:inset 3px 0 0 var(--dk-blue)'
NOW_NEW = 'background:rgba(11,95,255,.34);box-shadow:inset 3px 0 0 #7FA6FF'
assert NOW_OLD in doc
doc = doc.replace(NOW_OLD, NOW_NEW)


def ran(m):
    sel, body = m.group(1), m.group(2)
    if re.search(r'\.ln|rwl|rkl|xal|xl\d', sel):
        body = body.replace('#EAF6FC', 'rgba(255,255,255,.07)')
    return sel + '{' + body + '}'


doc = sub(r'([^{}]+)\{([^{}]*#EAF6FC[^{}]*)\}', ran, doc)

# ---------------------------------------------------------------- 4. no auto-shrink
# fitStage zoomed a panel's body down to 74% to make it fit, which is where the
# 10 to 14px text came from. Layout now fits instead; the loop tries 100% only.
OLD_Z = 'for(var z=1;z>=0.74;z-=0.03)'
assert OLD_Z in doc
doc = doc.replace(OLD_Z, 'for(var z=1;z>=1;z-=0.03)')

# ---------------------------------------------------------------- 5. one code box, everywhere
# User, 2026-09-29: code boxes on consecutive slides must not change size or
# position, or the box visibly jumps as the deck advances. Every code box is
# therefore the same box: x 64, y 221, 560 wide, 20px type on 36px rows. A run
# of consecutive code slides shares one height (ROWS), so a shorter file sits in
# the same box with room to spare, the way the kit's CodeBlock `minHeight` does
# for a build sequence. A file longer than its run's height grows downward only.
FS, LH = 20, 36
ROWS = {8: 6, 9: 6, 10: 6,
        12: 4, 13: 4, 14: 4, 15: 6, 16: 4, 17: 4, 18: 4,
        23: 2, 27: 6, 29: 3, 30: 3, 33: 5, 34: 5, 35: 5}


def resize_code(m):
    """Re-set one drawn code card on the shared type scale. The loop arrow and
    the row labels were placed in px for the card's old row height, so they are
    moved onto the new rows too."""
    card = m.group(0)
    fs0, lh0 = map(float, re.search(r'--fs:([\d.]+)px;--lh:([\d.]+)px', card).groups())
    card = card.replace(f'--fs:{fs0:g}px;--lh:{lh0:g}px', f'--fs:{FS}px;--lh:{LH}px', 1)

    def loop(q):
        top, h = float(q.group(1)), float(q.group(2))
        a = (top - 14 - lh0 / 2) / lh0 + 1
        return f'class="loop" style="top:{14 + (a - 1) * LH + LH / 2:g}px;height:{h / lh0 * LH:g}px"'

    def lab(q):
        r = (float(q.group(1)) - 14) / lh0 + 1
        return f'class="lab" style="top:{14 + (r - 1) * LH:g}px;height:{LH}px"'

    card = re.sub(r'class="loop" style="top:([\d.]+)px;height:([\d.]+)px"', loop, card)
    card = re.sub(r'class="lab" style="top:([\d.]+)px;height:([\d.]+)px"', lab, card)
    return card


doc = sub(r'<div class="ndt-code" style="--fs:[^"]*">.*?</div></div>(?:<div class="labs">.*?</div>)?</div>',
          resize_code, doc, flags=re.S)
# a drawn slide that shows code puts its lead in Space-3, so the box starts at 221
doc = sub(r'<div class="bd zb">(?=(?:(?!<span class="ndt-logo).)*?class="ndt-code")', '<div class="bd zb zc">',
          doc, flags=re.S)

# each card carries its run's box height
cards = list(re.finditer(r'<div class="(?:slide|pcard)"', doc))
assert len(cards) == 38, len(cards)
for i in sorted(ROWS, reverse=True):
    at = cards[i - 1].end()
    doc = doc[:at] + f' style="--rows:{ROWS[i]}"' + doc[at:]

# slide 34: the question leaves the code column, so the box lands where the others do
doc = sub(r'(<div class="p2">)(<div style="justify-content:safe center">)(<p class="stage-q">.*?</p>)'
          r'(?=<div class="ed">)', r'\3\1\2', doc, count=1, flags=re.S, expect=1)
doc = doc.replace('<div class="stage ex" id="stage-exit"', '<div class="stage ex cs-q" id="stage-exit"', 1)

# slide 14: the controls move under the code, so the right column
# (the letters, ch, the output) has the full height and nothing is pushed into it
WCTL = re.search(r'<div class="wctl"><button type="button" id="x-play">.*?</div>(?=<p class="cap" id="x-cap">)',
                 doc, re.S)
assert WCTL
doc = doc[:WCTL.start()] + doc[WCTL.end():]
doc = sub(r'(never reached, and it stays grey</p>)(</div><div><div class="strrow")',
          lambda m: m.group(1) + WCTL.group(0) + m.group(2), doc, count=1, expect=1)
doc = doc.replace('<div class="stage xstage" id="stage-walk"', '<div class="stage xstage x14" id="stage-walk"', 1)

# a stage whose left column is a code box
doc = sub(r'<div class="stage (xstage|rvstage|ty|rkstage|t3|ex|xastage)\b', r'<div class="stage cs \1', doc)

# ---------------------------------------------------------------- 5. overrides
K = lambda v: f'calc(var(--ndt-k)*{v}px)'
NIGHT2 = '#0C1A3A'

CSS = f"""
/* ================= rules pass: Web-Slides slide-content-rules 19, 22-25 ================= */
body{{font-family:'Inter',ui-sans-serif,system-ui,sans-serif}}

/* ---- header (19, 23): kicker at y 48, no tick, two short bars ---- */
.ndt .kick i,.ndt-dark .k i{{display:none}}
.ndt .kick,.ndt-dark .k{{gap:0}}
body.present .sl-eyebrow::before{{display:none;content:none}}
.ndt .hd{{height:100px;flex:none}}
.ndt .kick{{display:flex;width:max-content;margin:0 0 12px;line-height:18px}}
.ndt .hd h2{{font-family:'Poppins',var(--sans);white-space:nowrap}}
.ndt .rail{{left:-64px;top:4px;width:24px;height:80px;border-radius:0 2px 2px 0}}
.ndt .rail::after{{content:'';position:absolute;left:32px;top:0;width:6px;height:80px;border-radius:999px;background:inherit}}
body.present .stage{{padding:{K(48)} {K(64)} {K(64)} {K(64)} !important}}
body.present .sl-head{{height:{K(100)};margin:0 0 {K(73)} !important;flex:none}}
body.present .sl-eyebrow{{display:flex;width:max-content;margin:0 0 {K(12)};line-height:{K(18)}}}
body.present .sl-title{{font-family:'Poppins',var(--sans);white-space:nowrap}}
body.present .sl-bar{{left:{K(-64)};top:{K(4)};bottom:auto;height:{K(80)};width:{K(24)};border-radius:0 2px 2px 0}}
body.present .sl-bar::after{{content:'';position:absolute;left:{K(32)};top:0;width:{K(6)};height:{K(80)};border-radius:999px;background:inherit}}

/* ---- body zone (22): from y 221, centred on 434, may run to 709 ---- */
.ndt-light .bd.zb{{position:absolute;left:64px;right:64px;top:221px;bottom:73px;padding:0;
 display:flex;flex-direction:column;justify-content:safe center;align-items:stretch;gap:26px}}
.ndt-light .zb>.sub{{margin:0;max-width:1000px;font-size:22px;line-height:1.5;color:var(--nw-body);flex:none}}
.ndt-light .zb>.bdrow{{display:flex;align-items:center;justify-content:center;gap:40px;flex:none;min-height:0}}
.ndt-recap .bd.zb{{justify-content:safe center;padding:0}}
.ndt-recap .zb>.bdrow{{justify-content:flex-start}}
/* A panel's body starts at y 221 and grows DOWN; its buttons sit at the foot.
   Centring it made the whole body slide upward every time a step added a line
   (slide 3's explanations, slide 14's output), which read as a glitch. */
body.present .stage>.stage-ctl{{position:absolute !important;left:0;right:0;top:{K(648)};margin:0 !important;padding:0 !important;z-index:3}}
/* the body may run down to y 636, clear of the buttons */
body.present .stage:has(>.stage-ctl){{padding-bottom:{K(84)} !important}}

/* heavy panels. 31 rises into Space-3 (y 162, x <= 880: its question and n row are
   short); 35 lays its three variables in one row instead of a column */
body.present .mrstage>.sl-head{{margin-bottom:{K(14)} !important}}
body.present .mrstage .mr2{{flex:none}}
body.present .mrstage .mr2>div{{display:grid;grid-template-columns:auto 1fr;column-gap:{K(14)};align-items:start;align-content:start}}
body.present .mrstage .mr2>div>p{{grid-column:1/-1}}
body.present .mrstage .mr2>div>p.mrab{{grid-column:1;grid-row:1;justify-self:start;margin:0 0 {K(8)}}}
body.present .mrstage .mr2>div>p.mrh{{grid-column:1;grid-row:1;align-self:center;margin:0 0 {K(8)} {K(56)}}}
body.present .mrstage .mrrow{{font-size:{K(18)} !important;margin-bottom:{K(4)}}}
.mrrow{{color:#0B1A2B}}
.mrrow.ghost{{color:#C7454E}}
body.present .mrstage .stage-q{{margin-bottom:{K(6)} !important;max-width:{K(816)};align-self:flex-start}}
body.present .mrstage .rdtop{{width:max-content;max-width:{K(816)};align-self:flex-start}}
body.present .mrstage .cap{{margin-top:{K(8)}}}
body.present .mrstage .wctl{{margin-top:{K(8)}}}
body.present .mrstage .mr2 .ed{{grid-column:1;grid-row:2}}
body.present .mrstage .mrout{{min-height:0;height:100%;grid-column:2;grid-row:2}}
body.present .mrstage .rdtop{{margin-bottom:{K(6)} !important}}
.xa>div:last-child{{flex-direction:row !important;flex-wrap:wrap;align-content:center;align-items:center;column-gap:{K(18)}}}
.xa>div:last-child>*{{flex:0 0 100%}}
.xa>div:last-child>.varbox{{flex:0 0 auto}}
/* agenda: items on one edge, clear of the video box */
.ndt-agenda ol{{align-self:flex-start;margin-top:173px;gap:30px}}

/* dark frames: the header stays pinned too */
.ndt-dark .fb{{top:48px;bottom:auto;justify-content:flex-start}}
.ndt-dark .fb .k{{margin-bottom:12px;line-height:18px}}
.ndt-dark .fb h2{{white-space:nowrap}}
.ndt-dark .fb .s{{margin-top:{221 - 48 - 18 - 12 - 53}px}}
.ndt-dark .qart{{top:221px;transform:scale(.92);transform-origin:50% 0}}
.ndt-dark .fbart{{top:221px}}

/* ---- code box: the kit's CodeBlock (night-2, traffic lights, language only) ---- */
.ndt-code{{background:{NIGHT2};border:0;box-shadow:0 1px 2px rgba(11,26,43,.08),0 16px 36px rgba(1,70,199,.18)}}
.ndt-code .bar,.ndt-syn .psbar{{display:flex;align-items:center;gap:8px;height:46px;padding:0 16px;background:transparent;
 border-bottom:1px solid rgba(255,255,255,.1);border-radius:18px 18px 0 0}}
.ndt-code .d,.ndt-syn .psbar .d{{width:12px;height:12px;border-radius:50%}}
.ndt-code .d:nth-child(1),.ndt-syn .psbar .d:nth-child(1){{background:#FF5F57}}
.ndt-code .d:nth-child(2),.ndt-syn .psbar .d:nth-child(2){{background:#FEBC2E}}
.ndt-code .d:nth-child(3),.ndt-syn .psbar .d:nth-child(3){{background:#28C840}}
.ndt-code .tab,.ndt-syn .psbar .tab{{margin-left:8px;align-self:center;padding:0;background:none;border:0;box-shadow:none;border-radius:0;
 font:500 16px/1 var(--mono);color:rgba(255,255,255,.6)}}
.ndt-code .row{{color:rgba(255,255,255,.9)}}
.ndt-code .no{{color:rgba(255,255,255,.28)}}
.ndt-code .k{{color:#7FA6FF;font-weight:600}}
.ndt-code .b{{color:#4C80FF}}
.ndt-code .s{{color:#7FE3D8}}
.ndt-code .n{{color:#FFB055}}
.ndt-code .o{{color:rgba(255,255,255,.9)}}
.ndt-code .row.mk{{background:rgba(11,95,255,.26);box-shadow:inset 3px 0 0 #7FA6FF}}
.ndt-code .row.wn{{background:rgba(255,176,85,.2);box-shadow:inset 3px 0 0 #FFB055}}
.ndt-code .row.er{{background:rgba(239,68,68,.22);box-shadow:inset 3px 0 0 #EF4444}}

/* stage slabs: the same box */
.ed{{background:{NIGHT2} !important;border:0 !important;border-radius:16px !important;overflow:hidden;
 box-shadow:0 1px 2px rgba(11,26,43,.08),0 14px 32px rgba(1,70,199,.16) !important}}
.ed-tab{{background:transparent !important;border-bottom:1px solid rgba(255,255,255,.1) !important;
 font-family:var(--mono) !important;font-weight:500 !important;color:rgba(255,255,255,.6) !important}}
body.present .ed-tab{{font-size:{K(16)} !important;padding:{K(12)} {K(16)} !important}}
.ed-tab i{{width:{K(12)};height:{K(12)};margin-right:{K(8)}}}
.ed-tab i:nth-child(1){{background:#FF5F57}}
.ed-tab i:nth-child(2){{background:#FEBC2E}}
.ed-tab i:nth-child(3){{background:#28C840}}
.ed .cx,.stage .cx{{background:{NIGHT2} !important;color:rgba(255,255,255,.9) !important;border-radius:0 !important;border:0 !important;box-shadow:none !important}}
.stage .cx .no{{color:rgba(255,255,255,.28) !important}}
body.present .stage .cx b{{color:#7FA6FF !important;font-weight:600}}
body.present .stage .cx b.f,body.present .stage .cx i{{color:#4C80FF !important;font-weight:400}}
body.present .stage .cx i.n{{color:#FFB055 !important}}
body.present .stage .cx em{{color:#7FE3D8 !important}}
.stage .cx .ln.dead{{opacity:.3}}
body.present .stage .cx{{font-size:max({K(17)},clamp(12.5px,1.45vw,23px))}}

/* ---- pseudocode: the kit's dark pseudocode panel ---- */
.ndt-syn{{width:auto !important;background:{NIGHT2};border-radius:18px;padding:0 32px 26px 64px;
 box-shadow:0 1px 2px rgba(11,26,43,.08),0 16px 36px rgba(1,70,199,.18)}}
.ndt-syn .psbar{{margin:0 -32px 22px -64px}}
.ndt-syn .h{{color:#D8E3F5}}
.ndt-syn .h .k{{color:#C99BE0}}
.ndt-syn .h .v{{color:#9CDCFE}}
.ndt-syn .ind{{background:rgba(255,255,255,.05)}}
.ndt-syn .box{{background:rgba(255,255,255,.04);border:2px dashed rgba(255,255,255,.3);color:rgba(255,255,255,.72)}}
.ndt-syn .loop{{left:24px;top:86px}}

/* ---- output: the kit's CodeOutput (white card, header strip, dot + label) ---- */
.ndt-io{{padding:54px 24px 18px;border-radius:16px;overflow:hidden;border:1px solid #D8E3F5}}
.ndt-io .chip{{left:0;right:0;top:0;height:38px;border-radius:0;padding:0 16px;gap:8px;background:#F5F8FF;
 border-bottom:1px solid #D8E3F5;color:#4A5B6B !important;font:700 16px/1 'Poppins',var(--sans);letter-spacing:.08em}}
.ndt-io .chip i{{width:8px;height:8px}}
.ndt-io.out .chip i{{background:#16A34A}}
.ndt-io.in .chip i{{background:#2D63FB}}
.ndt-io.big{{padding:58px 28px 22px}}
.ndt-io.big .chip{{left:0;top:0;font-size:16px}}
body.present .stage pre.term,body.present .stage .mrout{{position:relative;border:1px solid #D8E3F5 !important;border-radius:{K(16)} !important;
 padding-top:{K(52)} !important;
 background:linear-gradient(#F5F8FF,#F5F8FF) 0 0/100% {K(38)} no-repeat,linear-gradient(#D8E3F5,#D8E3F5) 0 {K(38)}/100% 1px no-repeat,#fff !important}}
body.present .stage pre.term::after,body.present .stage .mrout::after{{content:'OUTPUT';position:absolute;left:0;top:0;height:{K(38)};
 display:flex;align-items:center;padding-left:{K(32)};font:700 {K(16)}/1 'Poppins',var(--sans);letter-spacing:.08em;color:#4A5B6B;
 background:radial-gradient(circle,#16A34A 0 {K(4)},transparent {K(4.5)}) {K(16)} 50%/{K(10)} {K(10)} no-repeat}}
body.present .stage pre.term:empty::before{{content:none}}

/* ---- readable from the back of the room: no label under 16px ---- */
body.present .seqbar .empty,body.present .varbox .nm,body.present .varbox .vl.none,body.present .wpick .lb,
body.present .wctl .st,body.present .wkey,body.present .rdsteps .lb,body.present .rdcell .tag,
body.present .mrrow.ghost span,body.present .hint,body.present .t1ask .hint,body.present .xa-none,body.present .rs-dl,body.present .rs-name{{font-size:max({K(16)},1.25vw) !important}}
body.present .rk-in,body.present .rs-amt span,body.present .rp-tag,body.present .rp-hk,body.present .rk-b i,
body.present .rs-coin{{font-size:max({K(16)},1.25vw) !important}}
body.present .stage-ctl button,body.present .wctl button,body.present .rcp-ctl button{{font-size:{K(16)} !important}}
.stage code,.stage kbd,.stage samp{{font-family:var(--mono)}}
body.present .cap{{font-size:max({K(18)},clamp(13px,1.45vw,22px))}}

/* ---- no half-pixel: the drawn slides' wrapper sat 1px low, so every drawn
   slide (bars, kicker, title) rendered 0.5px below the panels ---- */
body.present .slide,body.present .pcard{{border-width:0 !important}}
body.present .slide>.ndt-wrap,body.present .pcard>.ndt-wrap{{position:absolute !important;inset:0 !important;
 margin:0 !important;padding:0 !important;border:0 !important;width:auto !important;height:auto !important}}

/* ---- the one code box (section 5 of the script) ---- */
.ndt-light .bd.zb.zc{{top:162px;justify-content:flex-start}}
.ndt-light .zb.zc>.sub{{max-width:816px;height:33px;line-height:33px;white-space:nowrap}}
.ndt-light .zb.zc>.bdrow{{justify-content:flex-start;align-items:flex-start}}
.zc .ndt-code{{order:-1;width:560px !important;min-width:0;flex:none}}
.ndt-code .body{{padding:14px 0;min-height:calc(var(--rows,1) * 36px + 28px)}}
.ndt-code .bar{{box-sizing:border-box}}
body.present .cs .ed{{width:{K(560)};flex:none}}
body.present .cs .p2>div:first-child{{flex:0 0 {K(600)} !important;padding-right:{K(40)} !important;justify-content:flex-start !important}}
body.present .cs .p2>div:last-child{{justify-content:flex-start !important}}
body.present .cs .p2{{flex:none;align-items:flex-start}}
body.present .stage .ed-tab{{box-sizing:border-box;height:{K(46)};padding:0 {K(16)} !important}}
body.present .stage .ed .cx{{font-size:{K(20)} !important;line-height:{K(36)} !important;padding:{K(14)} 0 !important;
 min-height:calc(var(--rows,1) * {K(36)} + {K(28)})}}
body.present .stage .ed .cx .ln{{display:block;height:{K(36)};line-height:{K(36)};margin:0 !important;padding:0 {K(28)} 0 0 !important;border-radius:0}}
body.present .stage .ed .cx .no{{display:inline-block;vertical-align:top;line-height:inherit;width:{K(72)};padding-right:{K(22)};box-sizing:border-box;text-align:right;
 font-size:{K(14.4)}}}
.mr2 .ed .cx{{min-height:0 !important}}
/* 34: the question takes Space-3 like a lead, so the code box starts at 221 */
body.present .cs-q>.sl-head{{margin-bottom:{K(14)} !important}}
body.present .cs-q>.stage-q{{height:{K(33)};margin:0 0 {K(26)} !important;max-width:{K(816)};
 font-size:{K(22)} !important;line-height:{K(33)};white-space:nowrap}}

/* ---- 14: code, word picker, key, controls, caption on the left; the letters,
   ch and the output on the right, each at a fixed height, top-down ---- */
body.present .x14 .p2>div:first-child{{gap:{K(12)}}}
body.present .x14 .p2>div:first-child>*{{margin:0 !important}}
body.present .x14 .p2>div:first-child .wpick{{margin-top:{K(8)} !important}}
body.present .x14>.cap{{margin-top:{K(12)} !important}}
body.present .x14 .p2>div:last-child{{gap:{K(12)}}}
body.present .x14 .p2>div:last-child>*{{margin:0 !important;flex:none !important}}
body.present .x14 .p2>div:last-child{{position:relative}}
/* the word chip and the letters it splits into share one slot: the chip is
   hidden once it splits, so a second row for the letters was dead height */
body.present .x14 .strrow{{height:{K(64)};min-height:0 !important}}
body.present .x14 .seqbar{{position:absolute !important;left:0;right:0;top:0;height:{K(64)};min-height:0 !important;flex-wrap:nowrap;pointer-events:none}}
body.present .x14 .varbox{{min-height:{K(48)};flex-wrap:nowrap}}
body.present .x14 pre.term{{height:{K(236)} !important;min-height:0 !important;font-size:{K(18)} !important;line-height:1.35 !important;
 padding-bottom:{K(8)} !important}}
body.present .x14 .wctl{{margin:0}}
/* a replaced value is greyed, not struck through: the line read as a glitch */
.varbox .vl .ov{{text-decoration:none !important;opacity:.55}}

/* ---- 5: the three example boxes share one text size, and it fits ---- */
body.present .hkex-lbl{{font-size:{K(15)} !important;line-height:1.4}}
body.present .hkex-lbl b{{font-size:{K(17)};margin-bottom:{K(2)}}}
body.present .hkex-yours{{font-size:{K(15)} !important}}
.hkm{{max-height:60% !important}}
body.present .hkex-box{{display:flex;flex-direction:column;justify-content:space-between}}

/* ---- arrowheads: filled triangles, centred on their shaft ---- */
.ndt-code .lab{{gap:20px}}
.ndt-code .lab i::after{{content:'';position:absolute;right:-9px;top:50%;width:11px;height:12px;border:0;
 transform:translateY(-50%);background:#2D63FB;clip-path:polygon(0 0,100% 50%,0 100%)}}
.ndt-code .loop::after,.ndt-syn .loop::after{{content:'';position:absolute;right:-10px;top:-6px;width:11px;height:12px;border:0;
 background:#FF7A29;clip-path:polygon(0 0,100% 50%,0 100%)}}
"""

doc = doc.replace('</head>', f'<style id="ndt-rules">{font_faces()}{CSS}</style>\n</head>', 1)
open(DST, 'w', encoding='utf-8').write(doc)
print(DST, f'{n0 // 1024} KB -> {len(doc) // 1024} KB')
