#!/usr/bin/env python3
import base64, html, os, sys

# The spine: welcome, the Recap card, the recap activity, the title card, the
# classroom quiz, feedback and thank you are the same in every plan in every
# subject, so they come from one module instead of being redrawn per session.
# references/standard-slides.md is the contract.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from standard_slides import Spine, SPINE_CSS, SPINE_JS, file_names
# The look: New Design Template.html. The spine cards are drawn in it, kept deck
# slides are redrawn on its 1280 x 720 canvas, and theme() lays its fonts,
# ground, logo, footer bar and viewer pills over the whole file as the last step.
# Its helpers (light, dark, divider, code as nd_code, io, callout, bullets, tiles, chip,
# doc_mock, syntax) are what a redrawn slide is built from.
from ndt_theme import (theme, spine as nd_spine, agenda_stage, drawn, light, dark,
                       divider, code as nd_code, io, callout, bullets, tiles,
                       chip, doc_mock, syntax)

SPINE_MEDIA = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           'standard-slides')
S = Spine(SPINE_MEDIA)
SH='/home/claude/shots3'
HOOK_SVG=open('/home/claude/hook_svg.txt').read()
EXIT_SVG=open('/home/claude/exit_svg.txt').read()

def img(n,title):
    b64=base64.b64encode(open(f'{SH}/sl{n}.webp','rb').read()).decode()
    return (f'<div class="slide-img"><img alt="{html.escape(f"Slide {n}: {title}")}" '
            f'src="data:image/webp;base64,{b64}"></div>')

# Every instructor note is one line. A line starting with ! is the one thing on
# that card that goes wrong if it is skipped.
def brief(items):
    if not items: return ''
    out=[]
    for t in items:
        cls=' class="hot"' if t.startswith('!') else ''
        out.append(f'<li{cls}>{t.lstrip("!")}</li>')
    return '<ul class="brief">'+''.join(out)+'</ul>'

def slide(n,src,title,time,items=(),section=None):
    # `time` is kept for the record but never rendered — per-card clocks are
    # what make an instructor watch the wall instead of the room.
    # section: the slide redrawn in the new design, light(...) or divider(...).
    # Every kept deck slide is redrawn; the deck's picture is the fallback for
    # a slide that is a photograph or an illustration, not text or code.
    body = drawn(n, section) if section else img(n,title)
    return ('<div class="slide"><div class="slide-head">'
            f'<span class="slide-no">Slide {n}</span>'
            f'<span class="slide-title">{title}</span></div>'
            f'{body}{brief(items)}</div>')

def block(bid,icon,h2,mins,inner,cls=''):
    return (f'<section class="block {cls}" id="{bid}">'
            f'<div class="block-head"><span class="block-icon" aria-hidden="true">{icon}</span>'
            f'<h2>{h2}</h2></div>{inner}</section>')

def run(items):  # instructor card on a panel — five lines, no more
    return ('<details class="prep"><summary>Instructor — how to run this</summary>'
            f'<div class="prep-body">{brief(items)}</div></details>')

def key(tbl):
    return ('<details class="prep"><summary>Answer key</summary>'
            f'<div class="prep-body">{tbl}</div></details>')

def slhead(eyebrow,title):
    return ('<div class="sl-head"><span class="sl-bar" aria-hidden="true"></span><div>'
            f'<p class="sl-eyebrow">{eyebrow}</p><h3 class="sl-title">{title}</h3></div></div>')
RULE='<div class="stage-rule" aria-hidden="true"></div>'

def ctl():
    return ('<div class="stage-ctl"><button type="button" data-stage-prev>Back</button>'
            '<button type="button" data-stage-next>Next</button>'
            '<span class="ctl-count"></span></div>')

def pcard(lbl,mins,inner,sheet=None,animated=None,activity=None):
    """animated='hook' on the hook panel, animated='explainer' on the walker panel.
    Exactly one of each per session; verify_plan.py and plan_shape.py both check it.
    activity=N is the template number from references/activity-library.md, required
    on every quiz / activity / hands / exit panel.

    The class attribute is exactly "pcard" and nothing else. Both linters count
    cards with class="pcard" including the closing quote, so appending a second
    class here makes every panel invisible to them — the card count comes out
    short and "the guide covers every slide" fails on a guide that is correct."""
    ref=f'<span class="slide-src">worksheet {sheet}</span>' if sheet else ''
    an=f' data-animated="{animated}"' if animated else ''
    ac=f' data-activity="{activity}"' if activity else ''
    return (f'<div class="pcard" data-label="{lbl}"{an}{ac}>'
            f'<div class="slide-head">'
            f'<span class="slide-title">{lbl}</span>{ref}</div>{inner}</div>')

def animctl():
    """Controls for a data-anim card. Arrow keys step it too."""
    return ('<div class="stage-ctl"><button type="button" data-anim-next>Next</button>'
            '<button type="button" class="ghost" data-anim-replay>Replay</button>'
            '<span class="ctl-count" data-anim-count></span></div>')

# --------------------------------------------------- the three staged patterns
# All three ride the template's data-anim controller: put data-anim="N" and
# data-anim-labels="a|b|c" on the .stage, and animctl() under the figure.

def spine_cards(session_name):
    """The six cards that open a plan and the three that close it.

    Nothing here is designed per session and nothing here is redrawn. The order
    is fixed: welcome, the Recap card, the recap activity, the hook, the title
    card, the agenda ... the classroom quiz in the middle ... the takeaway map,
    feedback, thank you.

        sp = spine_cards('11 - Nested Conditional Statements')
        sp['welcome'], sp['recap_card'], sp['title'], sp['quiz'],
        sp['feedback'], sp['thankyou']

    The recap activity is built separately, because its content changes:

        pcard('Recap', '4 min', S.recap('bug', title=..., lines=[...],
              wrong=..., right=..., culprit=3, why=...), activity=1)

    Nothing before the title card may print the session's name: not the hook,
    not a card eyebrow, not a worksheet heading. The room guesses it first.
    """
    nd = nd_spine(session_name)       # drawn in the new design, not the old pictures
    return {
        'welcome': pcard('Welcome', '1 min', nd['welcome']),
        'recap_card': pcard('Recap', '1 min', nd['recap_card']),
        'title': pcard('Today', '1 min', nd['title']),
        'quiz': pcard('Classroom quiz on the portal', '6 min', nd['quiz'],
                      activity=15),
        'feedback': pcard('Feedback', '3 min', nd['feedback']),
        'thankyou': pcard('Thank you', '1 min', nd['thankyou']),
    }


def agenda_card(items):
    """The agenda in the new design: the navy "What We Will Cover" disc and a
    numbered list, 2 to 6 stops of (title, one line). Every row is there from
    press 1, dimmed; each press lights the next, and the arrow key steps it."""
    return pcard('The plan', '1 min', agenda_stage(items))


def exgrid(items):
    """Call for examples: the room answers FIRST, then one worked example per
    press. items is [(name, one line)] — three is the right number. No timer on
    this card; the instructor nudges and waits. Stage carries data-anim="N+1",
    because press 1 is the question alone."""
    cards=''.join(f'<div class="ex"><b>{n}</b><span>{line}</span></div>' for n,line in items)
    return f'<div class="exgrid">{cards}</div>'

def pm_ring(accent,y,h,tie,x=14,w=350):
    """One highlight ring on the program, plus the dashed tie to its card.
    accent is a1..a4. The accent goes on a wrapping <g>, never on the ring —
    the colour rules are descendant selectors and an element is not its own
    ancestor. Get this wrong and the ring is simply invisible."""
    return (f'<g class="{accent}">'
            f'<rect class="ring" x="{x}" y="{y}" width="{w}" height="{h}" rx="7"/>'
            f'<path class="tie" d="{tie}"/></g>')

def pm_card(accent,y,term,desc,cnt,x=430,w=550,h=92):
    """One named part. `cnt` is not optional garnish — it is the half students
    are never told. For `counter = 0; while counter < 3` the condition is asked
    FOUR times and the body runs three; ask the room for that number before you
    show it, and let them be wrong."""
    return (f'<g class="card {accent}">'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10"/>'
            f'<rect class="bar" x="{x+1}" y="{y+1}" width="7" height="{h-2}"/>'
            f'<text class="term" x="{x+28}" y="{y+32}">{term}</text>'
            f'<text class="desc" x="{x+28}" y="{y+58}">{desc}</text>'
            f'<text class="cnt" x="{x+28}" y="{y+82}">{cnt}</text></g>')

def qstep(lbl,q,code,opts,on=False,note='',ans=''):
    o=''.join(f'<li data-k="{k}">{v}</li>' for k,v in opts)
    c=f'<pre class="slabcode">{code}</pre>' if code else ''
    nt=f'<p class="stage-note">{note}</p>' if note else ''
    a=(f'<p class="ans">{ans}</p>'
       '<div class="stage-ctl"><button type="button" data-reveal="Reveal answer">'
       'Reveal answer</button></div>') if ans else ''
    return (f'<div class="stage-step{" on" if on else ""}" data-label="{lbl}">'
            f'<p class="stage-q">{q}</p>{c}<ul class="vopts">{o}</ul>{a}{nt}</div>')

# =====================================================================
# CONTENT — everything below is session-specific. Replace it.
#
# Panels:  <name>_stage = ('<div class="stage" id="stage-<id>">'
#                          + slhead('Eyebrow','Title')
#                          + '<div class="stage-step on" data-label="...">' ... '</div>'
#                          + ctl() + RULE + '</div>')
#          <name> = pcard('Label','N min', <name>_stage + run([...]) + key(...),
#                         sheet='p.1 &middot; task 1')
#
# Deck slides:  slide(n, orig, 'Title', 'N min', ['note', '!critical note', ...])
#
# Notes:  at most FIVE strings, each one line. Prefix the one that matters with '!'.
#         Put answers in key(), cut guidance as one 'Short of time: ...' line.
# =====================================================================

HOOK_SVG = open('/path/to/hook_svg.txt').read()   # one group, one transform, blur-masked crossfade

# ... panels and runs here ...

# =====================================================================
# GUIDE — three sections, under 400 words. No answers table, no checkpoint
# table, no "while you are teaching". Those live on the beats.
# =====================================================================
guide = '''<div id="guide-view">
<h1 class="g-h1">Instructor guide</h1>
<section class="g-sec"><h3>1 &middot; The one idea</h3>
<p>...</p><p class="g-meta" style="margin:0">Say it at slide N. Ask for it back at slide M.</p></section>
<section class="g-sec"><h3>2 &middot; Before you walk in</h3><ul class="brief">
<li>...</li><li class="hot">Never cut: ...</li></ul></section>
<section class="g-sec"><h3>3 &middot; If they ask</h3><ul class="brief"><li><b>Q?</b> A.</li></ul></section>
</div>'''

# =====================================================================
# WORKSHEET — one downloadable, fillable HTML document. No pages, no printer.
# No answers. No session timings. Trace tables get one pre-numbered row
# per line of the program.
# =====================================================================
# WORKSHEET - a SEPARATE, self-contained HTML document the students download
# and type into. Nothing is printed and there is no page count, so the old
# three-page cap is gone; keep it scannable instead, one task per screenful.
#
# What has NOT changed is the order of commitment. "Paper before keyboard" was
# never about paper - it is that a student must commit to an answer before the
# machine gives them one. On an HTML worksheet that means the prediction field
# is filled in, and the instructor says "pens down" before anybody runs it.
# A task that is typed into the playground first and recorded afterwards is a
# transcript, not a prediction.
#
# Rules that still hold: no answers on it, no session timings on it, and no
# self-check - the fields capture, they never mark. A field that tells a
# student they are right removes the discovery the beat exists for.
#
# It is its own file, <session>_student_handout.html, and it links to nothing. The
# students get that one file; the instructor guide is a different file and they
# never receive it.
# =====================================================================

# The worksheet's own stylesheet. It is a separate document and inherits
# NOTHING from the plan - every token it uses must be defined here.
WS_CSS = """
:root{
  --ink:#101318; --mid:#39404B; --soft:#6B7280; --rule:#D8DDE4; --fill:#F4F6F8;
  --accent:#0B5FA5; --accent-soft:#E7F1FA;
  --sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
*{box-sizing:border-box}
body{margin:0;background:#EEF1F4;color:var(--ink);font:16px/1.6 var(--sans)}
.ws{max-width:880px;margin:0 auto;padding:0 20px 90px;background:#fff;
  min-height:100vh;box-shadow:0 0 0 1px var(--rule)}
.ws-band{background:var(--ink);color:#fff;margin:0 -20px 22px;padding:20px 24px}
.ws-band h1{margin:0;font-size:22px;letter-spacing:-.01em}
.ws-band p{margin:4px 0 0;font-size:13px;opacity:.75}
.ws-who{display:flex;flex-wrap:wrap;margin:0 0 24px}
.ws-who label{flex:1 1 220px;margin-right:16px;font-size:13px;color:var(--soft)}
.ws-who input{display:block;width:100%;margin-top:4px;padding:8px 10px;
  border:1px solid var(--rule);border-radius:7px;font:15px var(--sans)}
.task{border-left:3px solid var(--accent);padding:0 0 0 16px;margin:0 0 34px}
.task-hd{display:flex;align-items:baseline;margin:0 0 8px}
.badge{flex:none;width:24px;height:24px;border-radius:50%;background:var(--accent);
  color:#fff;font:700 13px/24px var(--sans);text-align:center;margin-right:10px}
.task-hd .h{font:700 18px var(--sans);letter-spacing:-.01em}
.task-instr{margin:0 0 12px;font-size:15px;color:var(--mid)}
.task-instr b{color:var(--ink)}
.given{background:var(--accent-soft);border-radius:8px;padding:12px 14px;margin:0 0 14px;
  font-size:15px}
pre{margin:0 0 14px;padding:12px 14px;background:var(--fill);border:1px solid var(--rule);
  border-radius:8px;font:14px/1.7 var(--mono);white-space:pre;overflow-x:auto}
.fld{display:block;margin:0 0 14px}
.fld span{display:block;font-size:13px;font-weight:650;color:var(--soft);margin-bottom:5px}
.fld input,.fld textarea{width:100%;padding:10px 12px;border:1px solid var(--rule);
  border-radius:8px;font:15px/1.6 var(--mono);background:#fff;color:var(--ink);resize:vertical}
.fld input:focus,.fld textarea:focus{outline:2px solid var(--accent);outline-offset:1px}
.fld.ans input{font-weight:650;background:#FFFDF3;border-color:#E3D2A0}
table.grid{width:100%;border-collapse:collapse;margin:0 0 14px}
table.grid th,table.grid td{border:1px solid var(--rule);padding:7px 9px;
  font-size:14px;text-align:left;vertical-align:top}
table.grid th{background:var(--fill);font-weight:650;font-size:13px}
table.grid td.c{font:14px var(--mono);white-space:pre;background:var(--fill)}
table.grid input{width:100%;border:0;padding:3px 2px;font:14px var(--mono);background:transparent}
table.grid input:focus{outline:2px solid var(--accent)}
.ws-foot{margin:34px 0 0;padding-top:14px;border-top:1px solid var(--rule);
  font-size:13px;color:var(--soft)}
.ws-save{position:fixed;right:16px;bottom:16px;padding:7px 13px;border-radius:999px;
  background:var(--ink);color:#fff;font-size:12px;opacity:0;transition:opacity 220ms}
.ws-save.on{opacity:.85}
@media (max-width:600px){ .ws{padding:0 14px 80px} .ws-band{margin:0 -14px 18px} }
"""

# The only script in the worksheet keeps what a student typed across an
# accidental refresh. That is capture, not checking. Every storage call is
# guarded: a private window or blocked site data makes sessionStorage throw, and
# the worksheet must still work without it.
WS_JS = """
(function(){
  var KEY='ws:'+(document.title||'worksheet');
  function fields(){ return [].slice.call(document.querySelectorAll('input[type=text],textarea')); }
  var tag=document.querySelector('.ws-save'), t=null;
  function flash(){ if(!tag) return; tag.classList.add('on');
    clearTimeout(t); t=setTimeout(function(){ tag.classList.remove('on'); },1100); }
  try{
    var saved=JSON.parse(sessionStorage.getItem(KEY)||'{}');
    fields().forEach(function(f,i){ if(saved[i]!=null) f.value=saved[i]; });
  }catch(e){}
  document.addEventListener('input',function(){
    try{
      var v={}; fields().forEach(function(f,i){ if(f.value) v[i]=f.value; });
      sessionStorage.setItem(KEY,JSON.stringify(v)); flash();
    }catch(e){}
  });
})();
"""


def wtask(n, head, instr, body=''):
    """One worksheet task. `instr` states the action, the place and the expected
    result - "type the three lines you would add, in the box below"."""
    return (f'<section class="task"><div class="task-hd"><span class="badge">{n}</span>'
            f'<span class="h">{head}</span></div>'
            f'<p class="task-instr">{instr}</p>{body}</section>')


def code(text):
    """A program the student reads. Escape &lt; yourself; this is verbatim."""
    return f'<pre>{text}</pre>'


def work(label='Your answer', rows=4):
    return (f'<label class="fld"><span>{label}</span>'
            f'<textarea rows="{rows}" spellcheck="false"></textarea></label>')


def answer(label='Answer'):
    return (f'<label class="fld ans"><span>{label}</span>'
            '<input type="text" autocomplete="off" spellcheck="false"></label>')


def line(label):
    """One short field, for a beat where a single value IS the commitment."""
    return (f'<label class="fld"><span>{label}</span>'
            '<input type="text" autocomplete="off" spellcheck="false"></label>')


def grid(cols, rows):
    """A table with a field in chosen cells. `rows` is a list of lists; a string
    cell is printed, None becomes an input."""
    h = ''.join(f'<th>{c}</th>' for c in cols)
    body = ''
    for r in rows:
        body += '<tr>' + ''.join(
            '<td><input type="text" autocomplete="off"></td>' if c is None
            else f'<td>{c}</td>' for c in r) + '</tr>'
    return f'<table class="grid"><tr>{h}</tr>{body}</table>'


def ws_doc(title, subtitle, body):
    """The worksheet, as a complete document. It is its own file now, so there is
    no embedding, no iframe and no download button to keep in step with it."""
    doc = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
           '<meta name="viewport" content="width=device-width,initial-scale=1">'
           f'<title>{title} &mdash; worksheet</title>'
           f'<style>{WS_CSS}</style></head><body>'
           '<div class="ws">'
           f'<div class="ws-band"><h1>{title}</h1><p>{subtitle}</p></div>'
           '<div class="ws-who">'
           '<label>Name<input type="text" autocomplete="off"></label>'
           '<label>Roll no.<input type="text" autocomplete="off"></label>'
           '</div>'
           f'{body}'
           '<p class="ws-foot">Nothing here is collected. Keep the file.</p>'
           '</div><div class="ws-save">saved</div>'
           f'<script>{WS_JS}</script></body></html>')
    return doc


worksheet_body = wtask(1, '...', 'Say the action, the place and the expected result.',
                       code('...') + work())
WORKSHEET_DOC = ws_doc('TITLE', 'COURSE &middot; Session N', worksheet_body)

# =====================================================================
# ASSEMBLE — durations, not clock positions. Group under checkpoints.
# Each checkpoint is something a STUDENT can do. Durations must total 75.
# =====================================================================
CHECKPOINTS = [
 ('Checkpoint 1 &middot; 20 min', [('opening','k-concept',1,'Opening'),
                                   ('recap','k-quiz',4,'Recap')]),
 # ... k-hook | k-hands | k-activity | k-quiz | k-concept | k-buffer
]
def navitem(i,k,m,l):
    if i=='cp': return f'<p class="sp-cp"><span>{m}</span></p>'
    return (f'<button type="button" class="sp-item {k}" data-target="{i}">'
            f'<span class="sp-label">{l}</span></button>')
NAV=[]
for cp,items in CHECKPOINTS:
    NAV.append(('cp',None,cp,None))
    NAV += [(i,k,None,l) for i,k,_,l in items]
assert sum(d for _,items in CHECKPOINTS for _,_,d,_ in items)==75, 'durations must total 75'
nav=''.join(navitem(*e) for e in NAV)

blocks=''.join([
 # block(id, icon, 'Heading &middot; Slide N', 'N min', content, 'block-hands')
])

EXTRA_CSS=''   # walker CSS (assets/execution-walker-reference.txt §1) and per-session overrides
EXTRA_JS=''    # walker step engine (§3); runs inside the template's main IIFE

# =====================================================================
# THREE FILES, and none of them knows the others exist.
#
#   <slug>_student_view.html         slides + presenter view + sidebar nav
#   <session>_instructor_guide.html   one entry per card, with a picture of it
#   <session>_student_handout.html    what the students download and type into
#
# <session> is the session folder's name, "NN - Session name", exactly. The user's
# convention since 2026-09-17; the old -presenter/-guide/-worksheet names are gone.
#
# They are handed out separately -- the worksheet goes to students, the guide
# does not -- so nothing links to anything. A stray link from a student's file
# into the instructor guide is the whole reason for that rule.
#
# ORDER MATTERS. The guide's thumbnails are photographs of the presenter file,
# taken by scripts/render_thumbs.py, so the presenter must be written first and
# the thumbnails rendered from THAT file, inside this same run. Rendering them
# from a presenter built earlier is how a guide ends up describing a card that
# no longer exists.
# =====================================================================
import base64, pathlib, subprocess, sys

def sub(doc, old, new, what):
    """Every replacement into a template asserts it matched EXACTLY once.

    A replacement that silently stops matching ships a plan that still tells the
    instructor to find a printer, or a title that still carries the template's
    em-dash, and it looks finished. One of these caught an em-dash that was a
    literal character in one place and an entity in another."""
    n = doc.count(old)
    assert n == 1, f'{what}: matched {n} times, expected 1'
    return doc.replace(old, new)


OUT = pathlib.Path('/mnt/user-data/outputs')
SESSION = 'NN - Session name'               # e.g. '12 - Loops'; the session folder's name
_NAMES = file_names(SESSION)                # 12_loops_student_view.html, and the two siblings
PRESENTER = _NAMES['student_view']
GUIDE = _NAMES['instructor_guide']
WORKSHEET = _NAMES['student_handout']
SKILL = pathlib.Path('/path/to/skills/prog-lesson-plan')

# ---- 1. the presenter --------------------------------------------------
tpl = (SKILL / 'assets/plan-template.html').read_text(encoding='utf-8')
# Both templates' titles are already em-dash free. Keep them that way: the tab
# title is read too, and verify_plan.py fails on one anywhere in any of the three
# files. Use sub() above for every replacement you add, so a stale one is loud.
presenter = (tpl.replace('{{SESSION_TITLE}}', 'TITLE')
                .replace('{{EXTRA_CSS}}', EXTRA_CSS)
                .replace('{{EXTRA_JS}}', EXTRA_JS)
                .replace('{{ONE_IDEA}}', '...')
                .replace('{{NAV}}', nav)
                .replace('{{BLOCKS}}', blocks))
assert '{{' not in presenter, 'unfilled placeholder in the presenter'
presenter = theme(presenter)    # the new design, always last: fonts, ground, logo, pills
p_path = OUT / PRESENTER
p_path.write_text(presenter, encoding='utf-8')

# ---- 2. the thumbnails, from the file just written ---------------------
thumbs = OUT / 'thumbs'
subprocess.run([sys.executable, str(SKILL / 'scripts/render_thumbs.py'),
                str(p_path), str(thumbs)], check=True)
shots = sorted(thumbs.glob('card*.webp'))
n_cards = presenter.count('<div class="slide"') + presenter.count('<div class="pcard"')
assert len(shots) == n_cards, f'{len(shots)} thumbnails for {n_cards} cards'


def thumb(n):
    """The picture that goes beside guide entry n, inlined so the guide is one
    file. Call it from g() rather than emitting an empty <div class="gthumb">."""
    b64 = base64.b64encode(shots[n - 1].read_bytes()).decode()
    return (f'<div class="gthumb"><img alt="" loading="lazy" '
            f'src="data:image/webp;base64,{b64}"></div>')


# ---- 3. the guide ------------------------------------------------------
gtpl = (SKILL / 'assets/guide-template.html').read_text(encoding='utf-8')
guide_doc = (gtpl.replace('{{SESSION_TITLE}}', 'TITLE')
                 .replace('{{EXTRA_CSS}}', '')
                 .replace('{{GUIDE}}', guide))
assert '{{' not in guide_doc, 'unfilled placeholder in the guide'
(OUT / GUIDE).write_text(guide_doc, encoding='utf-8')

# ---- 4. the worksheet --------------------------------------------------
(OUT / WORKSHEET).write_text(WORKSHEET_DOC, encoding='utf-8')

for f in (PRESENTER, GUIDE, WORKSHEET):
    print(f'{f:60s} {(OUT / f).stat().st_size / 1024:8.0f} KB')
