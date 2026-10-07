#!/usr/bin/env python3
import base64, html, os
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

def slide(n,src,title,time,items=()):
    # `time` is kept for the record but never rendered — per-card clocks are
    # what make an instructor watch the wall instead of the room
    return ('<div class="slide"><div class="slide-head">'
            f'<span class="slide-no">Slide {n}</span>'
            f'<span class="slide-title">{title}</span></div>'
            f'{img(n,title)}{brief(items)}</div>')

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

def pcard(lbl,mins,inner,sheet=None,animated=None):
    """animated='hook' on the hook panel, animated='explainer' on the walker panel.
    Exactly one of each per session; verify_plan.py and plan_shape.py both check it."""
    ref=f'<span class="slide-src">worksheet {sheet}</span>' if sheet else ''
    an=f' data-animated="{animated}"' if animated else ''
    return (f'<div class="pcard{" anim" if animated else ""}" data-label="{lbl}"{an}>'
            f'<div class="slide-head">'
            f'<span class="slide-title">{lbl}</span>{ref}</div>{inner}</div>')

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
# WORKSHEET — embedded, prints to A4. One page per task that needs one.
# No answers. No session timings. Trace tables get one pre-numbered row
# per line of the program.
# =====================================================================
def shead(p,sub,total=3):
    return ('<div class="sh-band"><span class="t">TITLE</span>'
            f'<span class="s">{sub}</span><span class="p">page {p} of {total}</span></div>')
def sfoot(p,total=3):
    return ('<div class="sh-foot"><span>Not collected &mdash; keep this sheet</span>'
            f'<b>page {p} of {total}</b></div>')
def task(n,head,body):
    return (f'<div class="task"><div class="task-hd"><span class="badge">{n}</span>'
            f'<span class="h">{head}</span></div>{body}</div>')

handout = f'''<div id="handout-view">
<h1 class="g-h1">Student worksheet</h1>
<div class="h-actions">
<button type="button" id="print-handout">Print / save as PDF</button>
<span>Prints these sheets only, at A4. Set your printer to single-sided.</span>
</div>
<div class="sheet">{shead(1,'COURSE &middot; Session N')}
<div class="sh-name"><span>Name</span><span>Roll no.</span></div>
{task(1,'...','...')}
{sfoot(1)}</div>
</div>'''

# =====================================================================
# ASSEMBLE — durations, not clock positions. Group under checkpoints.
# Each checkpoint is something a STUDENT can do. Durations must total 75.
# =====================================================================
CHECKPOINTS = [
 ('Checkpoint 1 &middot; 20 min', [('opening','k-concept',1,'Opening'),
                                   ('poll','k-quiz',3,'Warm-Up Poll')]),
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
tpl=open('/path/to/plan-template.html').read()
doc=(tpl.replace('{{SESSION_TITLE}}','TITLE')
        .replace('{{EXTRA_CSS}}',EXTRA_CSS)
        .replace('{{EXTRA_JS}}',EXTRA_JS)
        .replace('{{ONE_IDEA}}','...')
        .replace('{{NAV}}',nav)
        .replace('{{BLOCKS}}',blocks)
        .replace('{{GUIDE}}',guide)
        .replace('{{HANDOUT}}',handout))
assert '{{' not in doc, 'unfilled placeholder'
open('/mnt/user-data/outputs/SESSION-plan.html','w').write(doc)
print('written', round(len(doc)/1024/1024,2),'MB')
