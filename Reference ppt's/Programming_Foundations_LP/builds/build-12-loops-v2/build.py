#!/usr/bin/env python3
"""Session 12 — Loops (while). Generates the plan. Never hand-edit the output."""
import base64, html, os, pathlib, sys, re

HERE = os.path.dirname(os.path.abspath(__file__))

# The fixed spine - welcome, the two recap cards, the title card, the classroom
# quiz, feedback, thank you - is the same in every plan in every subject, so it
# comes from the skill rather than being redrawn here.
SKILL = pathlib.Path(os.path.expanduser('~/.claude/skills/prog-lesson-plan'))
sys.path.insert(0, str(SKILL / 'assets'))
from standard_slides import Spine, SPINE_CSS, SPINE_JS, file_names

SESSION = '12 - Loops'          # the session, spelled once
SESSION_NAME = 'Loops'          # what the title card says, and nothing before it
S = Spine(str(SKILL / 'assets' / 'standard-slides'))

def R(p): return open(os.path.join(HERE, p), encoding='utf-8').read()
def B64(p): return base64.b64encode(open(os.path.join(HERE, p), 'rb').read()).decode()

# ---------------------------------------------------------------- primitives
def img(n, title):
    return ('<div class="slide-img"><img alt="'
            + html.escape(f'Slide {n}: {title}')
            + f'" src="data:image/webp;base64,{B64("media/sl%d.webp" % n)}"></div>')

def slide(n, title):
    return ('<div class="slide"><div class="slide-head">'
            f'<span class="slide-no">Slide {n}</span>'
            f'<span class="slide-title">{title}</span></div>'
            f'{img(n, title)}</div>')

def block(bid, icon, h2, inner, cls=''):
    return (f'<section class="block {cls}" id="{bid}">'
            f'<div class="block-head"><span class="block-icon" aria-hidden="true">{icon}</span>'
            f'<h2>{h2}</h2></div>{inner}</section>')

def slhead(eyebrow, title):
    return ('<div class="sl-head"><span class="sl-bar" aria-hidden="true"></span><div>'
            f'<p class="sl-eyebrow">{eyebrow}</p><h3 class="sl-title">{title}</h3></div></div>')

RULE = '<div class="stage-rule" aria-hidden="true"></div>'

def ctl():
    return ('<div class="stage-ctl"><button type="button" data-stage-prev>Back</button>'
            '<button type="button" data-stage-next>Next</button>'
            '<span class="ctl-count"></span></div>')

def animctl():
    return ('<div class="stage-ctl"><button type="button" data-anim-next>Next</button>'
            '<button type="button" class="ghost" data-anim-replay>Replay</button>'
            '<span class="ctl-count" data-anim-count></span></div>')

def pcard(lbl, inner, sheet=None, animated=None, activity=None):
    ref = f'<span class="slide-src">worksheet {sheet}</span>' if sheet else ''
    an = f' data-animated="{animated}"' if animated else ''
    ac = f' data-activity="{activity}"' if activity else ''
    return (f'<div class="pcard" data-label="{lbl}"{an}{ac}>'
            f'<div class="slide-head"><span class="slide-title">{lbl}</span>{ref}</div>{inner}</div>')

def opts(items):
    out = []
    for k, v, r in items:
        cls = ' class="right"' if r else ''
        out.append(f'<li data-k="{k}"{cls}>{v}</li>')
    return '<ul class="vopts">' + ''.join(out) + '</ul>'

def pollstep(label, q, code, items, ans, on=False, secs=25, auto=True, trace=''):
    a = ' data-auto' if auto else ''
    return (f'<div class="stage-step{" on" if on else ""}" data-label="{label}">'
            '<div class="pollcols"><div>'
            f'<p class="stage-q">{q}</p>'
            f'<pre class="slabcode">{code}</pre>{opts(items)}'
            '</div><div>'
            f'<p class="ans">{ans}{trace}</p>'
            '<div class="stage-ctl"><button type="button" data-reveal="Reveal answer">Reveal answer</button>'
            f'<span class="tmr"{a} data-secs="{secs}"></span></div>'
            '</div></div></div>')

def mtrace(lines, key=''):
    body = ''.join(f'<span class="wline {c}">{t}</span>' for c, t in lines)
    k = f'<span class="mtrace-key">{key}</span>' if key else ''
    return f'<span class="mtrace" aria-hidden="true">{body}</span>{k}'

# ======================================================================= PANELS

# --- 1. The spine: welcome, and the two recap cards --------------------------
# None of these is designed here. The pictures and the two title cards come from
# standard_slides, so every plan in every subject opens the same way.
welcome = pcard('Welcome', S.welcome())

recap_title = pcard('Recap', S.recap_title())

# Session 11 was Nested Conditional Statements. The bug format fits it exactly:
# a nested if whose last line sits at the left edge, so it runs whatever the
# marks are. It also plants the idea the exit question turns on - a program that
# prints nothing is not a broken program.
recap = pcard('Recap',
  S.recap('bug',
    title='Recap of nested conditions',
    eyebrow='Recap',
    ask='This should print nothing. It prints Pass. Decide the guilty line number, and hold '
        'that many fingers up when I ask.',
    lines=['marks = 30',
           'if marks >= 35:',
           '    if marks >= 60:',
           '        print("First class")',
           'print("Pass")'],
    wrong='Pass',
    right='nothing at all',
    culprit=5,
    why='Line 5 starts at the left edge, so it is outside both ifs. It runs every time.'),
  activity=1)

# --- 2. Hook, and where else the room has seen it ----------------------------
# Seven presses on one card. Two of them are the machine; presses 3 to 6 are the
# room's own examples, taken out loud before any of ours appears; press 7 is the
# collapse, so the construct is still the last thing this card draws.
# Nothing here prints the session's name - the title card does that, next.
def ex(name, line, art):
    """One of the room's own examples, drawn.

    Three paragraphs in three boxes is what this replaces. The hook is the one
    minute of the session where the room decides whether to look up, so each
    example is a small machine that actually does its one job over and over
    while the instructor is talking about it. The animation only runs on the
    press that reveals the box, so three loops are never turning at once.
    """
    return (f'<div class="ex"><div class="exart">{art}</div>'
            f'<b>{name}</b><span>{line}</span></div>')

# the cash tray: one note, and then the next, and then the next
ATM_ART = (
 '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="An ATM pushing out one note at a time until it reaches the amount asked for">'
 '<rect class="exbody" x="24" y="4" width="172" height="96" rx="12"/>'
 '<rect class="exscreen" x="40" y="14" width="140" height="40" rx="6"/>'
 '<text class="exscr" x="110" y="42" text-anchor="middle">2000</text>'
 '<circle class="exkey" cx="62" cy="74" r="7"/><circle class="exkey" cx="86" cy="74" r="7"/>'
 '<circle class="exkey" cx="110" cy="74" r="7"/><circle class="exkey" cx="134" cy="74" r="7"/>'
 '<rect class="exslot" x="52" y="86" width="116" height="10" rx="5"/>'
 '<rect class="exnote n1" x="62" y="90" width="96" height="28" rx="4"/>'
 '<rect class="exnote n2" x="62" y="90" width="96" height="28" rx="4"/>'
 '<rect class="exnote n3" x="62" y="90" width="96" height="28" rx="4"/>'
 '</svg>')

# the list of parents: one message, then the next, then the next, down the list
SMS_ART = (
 '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="One message sent to one parent, then the next, then the next, down a list">'
 '<rect class="exbody" x="10" y="6" width="96" height="128" rx="12"/>'
 + ''.join(f'<rect class="exrow" x="22" y="{24 + i * 34}" width="60" height="24" rx="6"/>'
           f'<circle class="extick t{i + 1}" cx="90" cy="{36 + i * 34}" r="8"/>'
           for i in range(3))
 + '<rect class="extower" x="162" y="24" width="12" height="96" rx="5"/>'
 '<path class="exwave" d="M146 52 C136 62 136 82 146 92"/>'
 '<path class="exwave" d="M134 42 C120 58 120 86 134 102"/>'
 '<g class="exmsg"><rect x="110" y="26" width="36" height="20" rx="7"/></g>'
 '</svg>')

# one floor, then the check, then one more floor
LIFT_ART = (
 '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="A lift climbing one floor at a time and checking after each one whether it has'
 ' arrived">'
 '<rect class="exshaft" x="70" y="6" width="76" height="128" rx="6"/>'
 + ''.join(f'<line class="exfloor" x1="70" y1="{32 + i * 30}" x2="146" y2="{32 + i * 30}"/>'
           f'<text class="exfl" x="60" y="{26 + i * 30}" text-anchor="end">{4 - i}</text>'
           f'<circle class="exlamp l{i + 1}" cx="168" cy="{20 + i * 30}" r="7"/>'
           for i in range(4))
 + '<g class="excar"><rect x="78" y="98" width="60" height="28" rx="4"/></g>'
 '</svg>')

hook = pcard('Hook: forty copies, and where else',
  '<div class="stage" id="stage-hook-turn" data-anim="8" '
  'data-anim-labels="the shop|inside the machine|one job, forty times'
  '|where else have you seen this?|the ATM|the attendance SMS|the lift'
  '|one line, forty copies">'
  + slhead('Programming Foundations &middot; Session 12', 'Forty Copies')
  + '<div class="hkfig">'
  + '<p class="stage-q">He types <b>40</b>, presses START <b>once</b>, and walks away. But the '
    'machine only knows how to make <b>one</b> copy. <b>So what is going on inside it, forty '
    'times over?</b></p>'
  + R('parts/hook_svg.txt')
  + '</div>'
  + '<div class="hkyt">'
  + '<p class="stage-q">One press, and a machine repeats the same small job until it has done it '
    'enough times. <b>Where else have you seen that?</b> Say the machine, and say the one job it '
    'repeats.</p>'
  + '<div class="exg2">'
  + ex('The ATM', 'pushes out <em>one note</em>, again, and again, until it reaches the '
       'amount you asked for.', ATM_ART)
  + ex('The attendance SMS', 'sends the same message to <em>one parent</em>, then the next, '
       'until it has gone down the whole list.', SMS_ART)
  + ex('The lift', 'climbs <em>one floor</em>, checks whether it has arrived, climbs one more, '
       'until it is at your floor.', LIFT_ART)
  + '</div></div>'
  + animctl()
  + RULE + '</div>', animated='hook', activity=12)

# --- 3. The title card, then the agenda --------------------------------------
title_card = pcard('Today', S.title_card(SESSION_NAME))

# Four stops on a line, one per press. A flat list of four bullets is the thing
# this replaces: the room needs to see that the session goes somewhere.
def agicon(x, body):
    """The little drawing above a stop.

    Four numbered circles on a rail told the room how many stops there were and
    nothing about what happened at any of them, and the figure used less than
    half the height it was given. Each stop now opens with a picture of the
    thing it is: a stack of repeated lines, a loop, a loop that broke, a square
    of stars.
    """
    return f'<g class="agi" transform="translate({x - 40},18)">{body}</g>'


AGI = (
  # 1. the same two lines, written out again and again
  ''.join(f'<rect class="agbar" x="4" y="{4 + k * 14}" width="{72 if k % 2 else 52}"'
          f' height="8" rx="4" opacity="{1 - k * 0.14:.2f}"/>' for k in range(5)),
  # 2. one loop, going round
  '<path class="agarc" d="M64 38 A24 24 0 1 1 40 14"/>'
  '<path class="agarc" d="M30 8 l10 6 l-10 8"/>',
  # 3. the same loop, broken
  '<path class="agarc" d="M64 38 A24 24 0 0 1 22 52"/>'
  '<path class="agarc" d="M40 14 A24 24 0 0 1 60 24"/>'
  '<path class="agbreak" d="M14 18 L34 38"/><path class="agbreak" d="M34 18 L14 38"/>',
  # 4. a square of stars
  ''.join(f'<circle class="agdot" cx="{22 + c * 18}" cy="{14 + r * 18}" r="5"/>'
          for r in range(3) for c in range(3)),
)


def agstop(i, x, title, l1, l2):
    return (f'<g>{agicon(x, AGI[i - 1])}'
            f'<text class="t" x="{x}" y="132" text-anchor="middle">{title}</text>'
            f'<circle class="dot" cx="{x}" cy="212" r="34"/>'
            f'<text class="n" x="{x}" y="223" text-anchor="middle">{i}</text>'
            f'<text class="d" x="{x}" y="296" text-anchor="middle">{l1}</text>'
            f'<text class="d" x="{x}" y="326" text-anchor="middle">{l2}</text></g>')

AG_X = (140, 380, 620, 860)

# the empty rail and four hollow stops, up from press 1. A step rail that opens
# as one dot on a blank canvas tells the room nothing about how far the session
# goes, and half the card is white.
AG_GHOST = ('<path class="railghost" d="M140 212 H860"/>'
            + ''.join(f'<circle class="dotghost" cx="{x}" cy="212" r="34"/>' for x in AG_X)
            + ''.join(f'<text class="nghost" x="{x}" y="223" text-anchor="middle">{i}</text>'
                      for i, x in enumerate(AG_X, 1)))

AGENDA = (
 '<svg class="fig agroute" viewBox="0 0 1000 350" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="Four stops in this session: writing the same lines ten times, building a while'
 ' loop and naming its three parts, seeing what goes wrong, and writing one yourself">'
 + AG_GHOST
 + agstop(1, 140, 'Ten times over', 'you write the same', 'two lines, ten times')
 + agstop(2, 380, 'The while loop', 'we build one,', 'line by line')
 + agstop(3, 620, 'When it breaks', 'you break a loop', 'on purpose, and fix it')
 + agstop(4, 860, 'Your own loop', 'you write one that', 'prints a box of stars')
 + '</svg>')

agenda = pcard('Agenda',
  '<div class="stage" id="stage-agenda" data-anim="4" '
  'data-anim-labels="ten times over|the while loop|when it breaks|your own loop">'
  + slhead('Loops', 'Where We Are Going')
  + AGENDA
  + animctl()
  + RULE + '</div>')

SEQ_LINES = (
  ('1', 'a = <tspan class="fn">int</tspan>(<tspan class="fn">input</tspan>())'),
  ('2', 'a = a + <tspan class="num">1</tspan>'),
  ('3', '<tspan class="fn">print</tspan>(a)'),
  ('4', 'a = a + <tspan class="num">1</tspan>'),
  ('5', '<tspan class="fn">print</tspan>(a)'),
)
SEQ_Y = (108, 152, 196, 240, 284)

SEQ = (
 '<svg class="fig seqfig" viewBox="0 0 1000 448" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="Python walking down a five line program one line at a time. The box called a'
 ' takes 5, then 6, then 7, the console fills one line at a time, and every line of the program'
 ' runs exactly once">'

 # ---- the skeleton, up from press 1, so nothing here is ever blank -------
 '<text class="sqhd" x="10" y="48">the program, top to bottom</text>'
 '<text class="sqhd" x="506" y="48">the box called a</text>'
 '<text class="sqhd" x="730" y="48">what it prints</text>'
 '<rect class="sqpanel" x="10" y="72" width="470" height="252" rx="12"/>'
 '<rect class="sqpanel" x="506" y="72" width="200" height="252" rx="12"/>'
 '<rect class="sqdark" x="730" y="72" width="260" height="252" rx="12"/>'
 '<rect class="sqslot m1" x="536" y="104" width="140" height="56" rx="10"/>'
 '<rect class="sqslot m2" x="536" y="176" width="140" height="56" rx="10"/>'
 '<rect class="sqslot m3" x="536" y="248" width="140" height="56" rx="10"/>'
 '<rect class="sqslotd d1" x="752" y="100" width="216" height="40" rx="8"/>'
 '<rect class="sqslotd d2" x="752" y="152" width="216" height="40" rx="8"/>'
 # the empty verdict bands, so the bottom third of the card is not white for
 # five presses out of six
 '<rect class="sqghost" x="10" y="344" width="980" height="42" rx="10"/>'
 '<rect class="sqghost" x="10" y="396" width="980" height="46" rx="10"/>'
 # the marker sits UNDER the program: painted after it, its highlight band
 # covers the very line it is pointing at
 '<g class="sqptr"><rect class="sqband" x="16" y="79" width="458" height="38" rx="8"/>'
 '<path class="sqcaret" d="M26 89 l13 9 l-13 9 z"/></g>'
 + ''.join(
   f'<text class="ln" x="56" y="{y}" text-anchor="end">{n}</text>'
   f'<text class="prog" x="70" y="{y}">{code}</text>'
   for (n, code), y in zip(SEQ_LINES, SEQ_Y))

 # ---- one press per line -------------------------------------------------
 + '<g class="sq1"><text class="val" x="606" y="144" text-anchor="middle">5</text></g>'
 '<g class="sq2"><line class="strike" x1="574" y1="134" x2="638" y2="134"/>'
 '<text class="val" x="606" y="216" text-anchor="middle">6</text></g>'
 '<g class="sq3"><text class="outln" x="766" y="128">6</text></g>'
 '<g class="sq4"><line class="strike" x1="574" y1="206" x2="638" y2="206"/>'
 '<text class="val" x="606" y="288" text-anchor="middle">7</text></g>'
 '<g class="sq5"><text class="outln" x="766" y="180">7</text></g>'

 # ---- the verdict, and the question the session answers ------------------
 '<g class="sq6">'
 '<rect class="sqsay" x="10" y="344" width="980" height="42" rx="10"/>'
 '<text class="saytx" x="500" y="372" text-anchor="middle">'
 'Five lines. Python ran every one of them once, in order, and stopped.</text>'
 '<rect class="sqask" x="10" y="396" width="980" height="46" rx="10"/>'
 '<text class="asktx" x="500" y="426" text-anchor="middle">'
 'So can we make one block of code run more than once?</text>'
 '</g></svg>')

seq_card = pcard('Sequence of instructions',
  '<div class="stage" id="stage-seq" data-anim="6" '
  'data-anim-labels="line 1|line 2|line 3|line 4|line 5|every line ran once">'
  + slhead('Introduction', 'Sequence of Instructions')
  + SEQ
  + animctl()
  + RULE + '</div>')

# ---------------------------------------------------------------- drawings
# Four cards used to be a question, a code slab and a lot of white. Each one
# now shows the thing it is asking about. They are all plain SVG in the deck's
# palette, they all sit in a two column row beside the words rather than under
# them, and none of them carries text that the words already carry.

# task 1: three pairs of lines, and the seven more the question now needs
WS1_ART = (
 '<svg class="fig artfig" viewBox="0 0 320 316" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="A short program of seven lines beside the same program stretched to twenty one">'
 '<text class="alab" x="10" y="20">asks for 3</text>'
 '<text class="alab" x="186" y="20">asks for 10</text>'
 '<rect class="aslab" x="10" y="32" width="128" height="106" rx="8"/>'
 '<rect class="aslab" x="186" y="32" width="128" height="250" rx="8"/>'
 + ''.join(f'<rect class="aline" x="24" y="{44 + i * 13}" width="{92 if i % 2 else 66}"'
           f' height="6" rx="3"/>' for i in range(7))
 + ''.join(f'<rect class="aline" x="200" y="{44 + i * 11}" width="{92 if i % 2 else 66}"'
           f' height="5" rx="2.5"/>' for i in range(21))
 + '<text class="anum" x="74" y="160">7 lines</text>'
 '<text class="anum" x="250" y="302">21 lines</text>'
 '<path class="aarrow" d="M148 84 H176"/>'
 '<path class="aarrow" d="M170 78 l8 6 l-8 6"/>'
 '</svg>')

# task 3: three programs, each with one thing wrong in it
HUNT_ART = (
 '<svg class="fig artfig" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="Three short programs side by side, each with one line marked as the broken one">'
 + ''.join(
   f'<g><rect class="aslab" x="10" y="{8 + b * 80}" width="280" height="64" rx="8"/>'
   f'<text class="alab" x="24" y="{28 + b * 80}">Program {b + 1}</text>'
   + ''.join(f'<rect class="aline" x="24" y="{36 + b * 80 + i * 11}"'
             f' width="{150 if i else 110}" height="5" rx="2.5"/>' for i in range(3))
   + (f'<rect class="amiss" x="20" y="{32 + b * 80 + 22}" width="160" height="9" rx="4"/>'
      if b == 0 else
      f'<rect class="abad" x="20" y="{32 + b * 80 + (0, 0, 1)[b] * 11}" width="160" height="9" rx="4"/>')
   + f'<text class="abug" x="264" y="{30 + b * 80}">?</text></g>'
   for b in range(3))
 + '</svg>')

# the square pattern: what 3 has to come out as
SQ_ART = (
 '<svg class="fig artfig" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="The output for three: three rows of three stars, with a space after every star">'
 '<rect class="adark" x="10" y="10" width="280" height="150" rx="10"/>'
 + ''.join(f'<text class="astar" x="{56 + c * 62}" y="{60 + r * 42}">*</text>'
           for r in range(3) for c in range(3))
 + '<text class="alab" x="10" y="192">3 rows, 3 stars in each row</text>'
 '<text class="alab" x="10" y="216">one space after every star</text>'
 '<text class="alab" x="10" y="240">and 5 has to work too</text>'
 '</svg>')

# type it, then break it: the two changes, drawn
BRK_ART = (
 '<div class="brk2">'
 '<div class="brk-step"><span class="brk-n">1</span>'
 '<p><b>Delete the line</b> <code>counter = counter + 1</code>, then run it again with '
 '<b>a = 5</b>. The stop button sits beside Run. You are going to need it.</p>'
 '<svg viewBox="0 0 260 150" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="The last line of the loop body crossed out, and a console that never stops">'
 '<rect class="aslab" x="6" y="8" width="130" height="134" rx="8"/>'
 '<rect class="aline" x="18" y="30" width="100" height="8" rx="4"/>'
 '<rect class="aline" x="18" y="56" width="78" height="8" rx="4"/>'
 '<rect class="aline" x="28" y="82" width="90" height="8" rx="4"/>'
 '<rect class="agone" x="28" y="110" width="90" height="8" rx="4"/>'
 '<line class="acut" x1="20" y1="114" x2="126" y2="114"/>'
 '<rect class="adark" x="150" y="8" width="104" height="134" rx="8"/>'
 + ''.join(f'<rect class="aout" x="164" y="{26 + i * 20}" width="44" height="8" rx="4"/>'
           for i in range(5))
 + '<text class="aforever" x="164" y="134">forever</text>'
 '</svg></div>'
 '<div class="brk-step"><span class="brk-n">2</span>'
 '<p><b>Put the line back.</b> Now move it <b>above</b> <code>print(a)</code> and run with '
 '<b>a = 5</b> again. What changed, and what did not?</p>'
 '<svg viewBox="0 0 260 150" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="The last two lines of the loop body swapping places">'
 '<rect class="aslab" x="6" y="8" width="248" height="134" rx="8"/>'
 '<rect class="aline" x="18" y="32" width="150" height="8" rx="4"/>'
 '<rect class="aswapa" x="28" y="64" width="124" height="14" rx="7"/>'
 '<rect class="aswapb" x="28" y="100" width="152" height="14" rx="7"/>'
 '<path class="aarrow" d="M196 71 C226 71 226 107 196 107"/>'
 '<path class="aarrow" d="M203 100 l-7 7 l7 7"/>'
 '<path class="aarrow" d="M196 107 C166 107 166 71 196 71"/>'
 '<path class="aarrow" d="M189 78 l7 -7 l-7 -7"/>'
 '</svg></div></div>')

# --- 4. Worksheet: ten numbers, the long way ---------------------------------
ws1_card = pcard('Worksheet: ten numbers, the long way',
  '<div class="stage" id="stage-ws1">'
  + slhead('Loops', 'The Same Question, Ten Times Over')
  + '<div class="stage-step on" data-label="the task">'
    '<p class="stage-q">Worksheet task 1. The program that prints the next <b>three</b> consecutive '
    'numbers is already printed for you. The question has changed, it now asks for the next '
    '<b>ten</b>.</p>'
    '<div class="twocol"><div class="tc-a">'
    '<pre class="slabcode">a <b>=</b> <i>int</i>(<i>input</i>())\n'
    'a <b>=</b> a <b>+</b> <i>1</i>\n'
    '<i>print</i>(a)\n'
    'a <b>=</b> a <b>+</b> <i>1</i>\n'
    '<i>print</i>(a)\n'
    'a <b>=</b> a <b>+</b> <i>1</i>\n'
    '<i>print</i>(a)</pre>'
    '<p class="stage-note">Type only the lines you would add, in the box. Then fill the little '
    'table: how many lines your finished program is, and how many it would be for a hundred. '
    'Worksheet only, the playground stays shut.</p>'
    '</div><div class="tc-b">' + WS1_ART + '</div></div>'
    '<span class="tmr" data-secs="150"></span>'
    '</div>' + RULE + '</div>',
  sheet='task 1', activity=9)

# --- 5. Build it, name it, count it -----------------------------------------
# Seven presses. The program is assembled a line at a time (initialization, then
# updation, then the room decides the condition), and every part that lands gets
# its name AND the number of times it runs. The four-versus-three count on the
# condition is the whole point of the card.
def acard(cls, y, term, desc, cnt):
    return (f'<g class="card {cls}">'
            f'<rect x="430" y="{y}" width="550" height="92" rx="10"/>'
            f'<rect class="bar" x="431" y="{y + 1}" width="7" height="90"/>'
            f'<text class="term" x="458" y="{y + 32}">{term}</text>'
            f'<text class="desc" x="458" y="{y + 58}">{desc}</text>'
            f'<text class="cnt" x="458" y="{y + 82}">{cnt}</text></g>')

def aring(cls, y, h, tie):
    # the colour rules are descendant selectors (.partmap .a1 .ring), so the ring and
    # its connector have to sit inside a group that carries the class, not carry
    # it themselves
    return (f'<g class="{cls}">'
            f'<rect class="ring" x="14" y="{y}" width="350" height="{h}" rx="7"/>'
            f'<path class="tie" d="{tie}"/></g>')

ANAT = (
 '<svg class="fig partmap" viewBox="0 0 1000 480" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="A while-loop program assembled one line at a time. Each part that arrives is'
 ' ringed, named and counted: initialization once, the termination condition four times, the'
 ' block of code three times, the updation three times">'

 # ---- press 1: the skeleton, with a gap where the condition will go
 '<g>'
 '<text class="hd" x="14" y="24">the same question, at three, built one line at a time</text>'
 '<text class="ln" x="20" y="70">1</text>'
 '<text class="prog" x="52" y="70">a = <tspan class="fn">int</tspan>'
 '(<tspan class="fn">input</tspan>())</text>'
 '<text class="ln" x="20" y="104">2</text>'
 '<text class="ln" x="20" y="138">3</text>'
 '<text class="prog" x="52" y="138"><tspan class="kw">while</tspan></text>'
 '<rect class="blank" x="118" y="118" width="134" height="26" rx="5"/>'
 '<text class="prog" x="256" y="138">:</text>'
 '<text class="ln" x="20" y="172">4</text>'
 '<text class="prog" x="98" y="172">a = a + <tspan class="num">1</tspan></text>'
 '<text class="ln" x="20" y="206">5</text>'
 '<text class="prog" x="98" y="206"><tspan class="fn">print</tspan>(a)</text>'
 '<text class="ln" x="20" y="240">6</text>'
 '<text class="ln" x="20" y="274">7</text>'
 '<text class="prog" x="52" y="274"><tspan class="fn">print</tspan>'
 '(<tspan class="st">"End"</tspan>)</text>'
 '</g>'

 # ---- press 2: initialization
 '<g>'
 '<text class="prog" x="52" y="104">counter = <tspan class="num">0</tspan></text>'
 + aring('a1', 82, 30, 'M364 97 L430 76')
 + acard('a1', 30, 'Initialization',
         'the line before the loop that sets the counter',
         'runs once, and only once')
 + '</g>'

 # ---- press 3: updation
 '<g>'
 '<text class="prog" x="98" y="240">counter = counter + <tspan class="num">1</tspan></text>'
 + aring('a4', 218, 30, 'M364 233 L430 412')
 + acard('a4', 366, 'Updation',
         'the last line of the body, it changes the counter',
         'runs 3 times, if it is missing, the loop never stops')
 + '</g>'

 # ---- press 4: the question, in the slot the answer will fill
 '<g class="qbox">'
 '<rect x="435" y="147" width="540" height="82" rx="9"/>'
 '<text x="458" y="180">So what should the condition be?</text>'
 '<text x="458" y="212" style="font:16px var(--sans)">We want the block to run exactly 3 times.</text>'
 '</g>'

 # ---- press 5: the condition lands on top of the gap
 '<g>'
 '<rect class="cover" x="115" y="117" width="140" height="28"/>'
 '<text class="prog" x="122" y="138">counter &lt; <tspan class="num">3</tspan></text>'
 + aring('a2', 116, 30, 'M364 131 L430 188')
 + acard('a2', 142, 'Termination condition',
         'the question on the while line, asked again before every pass',
         'asked 4 times here, three yeses, then one no')
 + '</g>'

 # ---- press 6: the block that does the work
 '<g>' + aring('a3', 150, 64, 'M364 182 L430 300')
 + acard('a3', 254, 'Block of code',
         'the indented lines that do the actual work',
         'runs 3 times, only while the answer is True')
 + '</g>'

 # ---- press 7: run it
 '<g><text class="out" x="14" y="330">input 5 &nbsp;&#8594;&nbsp; 6, 7, 8, End</text>'
 '<text class="out" x="14" y="358">four parts. Three of them you write yourself.</text></g>'
 '</svg>')

anatomy = pcard('Build it, name it, count it',
  '<div class="stage" id="stage-anat" data-anim="7" '
  'data-anim-labels="the skeleton|initialization|updation|what should the condition be?'
  '|termination condition|block of code|run it">'
  + slhead('While Loop', 'The Four Parts, and How Often Each One Runs')
  + ANAT
  + animctl()
  + RULE + '</div>')

# --- 6. Tap to classify: which part is this line? ---------------------------
# Activity library template 23. Six lines from two programs, three bins. The
# room fills worksheet task 2 first, so every student has committed in private;
# then the instructor takes a show of hands per line and taps it in. A wrong bin
# bounces and says why in one sentence, which is the two minutes worth having.
# The second program counts DOWN, so "initialization always sets zero" and
# "updation always adds one" both bounce.
def clcase(src, code, bin_, why, oops):
    return (f'<div class="cl-case" data-bin="{bin_}" data-why="{why}" data-oops="{oops}">'
            f'<span class="cl-src">{src}</span><code>{code}</code></div>')

CASES = (
  clcase('Program A, line 2', 'counter = 1', 'i',
         'It sits above the while line, and it runs once.',
         'Look at where it sits. It is above the loop, so it is not the question and not the change.')
+ clcase('Program A, line 3', 'while counter &lt;= 5:', 't',
         'The question on the while line, asked again before every pass.',
         'The word while is on this line. That makes it the termination condition.')
+ clcase('Program A, line 6', 'counter = counter + 1', 'u',
         'Last line of the body, and it changes what the question looks at.',
         'It is inside the body and it changes the counter. That is the updation.')
+ clcase('Program B, line 2', 'seats = 3', 'i',
         'A counter does not have to start at 0. This one starts at 3.',
         'It is above the loop and it sets the counter, even though it starts at 3, not 0.')
+ clcase('Program B, line 3', 'while seats &gt; 0:', 't',
         'The question can count down as well as up.',
         'The word while is on this line, so this is the question being asked.')
+ clcase('Program B, line 5', 'seats = seats - 1', 'u',
         'Updation means change, not add. This one takes one away.',
         'It is inside the body and it changes seats. Taking one away is still updation.'))

BINS = ''.join(
    f'<button type="button" class="cl-bin" data-bin="{k}">'
    f'<b>{label}</b><span class="cl-drop"></span></button>'
    for k, label in (('i', 'Initialization'), ('t', 'Termination condition'),
                     ('u', 'Updation')))

ws2_card = pcard('Worksheet task 2: which part is this line?',
  '<div class="stage cl" id="stage-classify" data-classify>'
  + slhead('While Loop', 'Which Part Is This Line?')
  + '<p class="stage-q">Worksheet task 2 first. Two programs, six lines, one letter each. '
    'When everyone has typed all six, we put them in the bins together.</p>'
  + '<div class="cl-wrap"><div class="cl-cases">' + CASES + '</div>'
  + '<div class="cl-bins">' + BINS + '</div></div>'
  + '<p class="cl-say" aria-live="polite"></p>'
  + '<div class="stage-ctl"><button type="button" class="ghost" data-cl-reset>Replay</button>'
    '<span class="ctl-count" data-cl-count></span>'
    '<span class="tmr" data-secs="150"></span></div>'
  + RULE + '</div>',
  sheet='task 2', activity=23)

# --- 7. The walker -----------------------------------------------------------
walk = pcard('Ask it again: the condition between passes',
  '<div class="stage" id="stage-walk">'
  + slhead('While Loop', 'Ask It Again')
  + R('parts/walker.html')
  + '<p class="stage-note">Blue means Python ran that line. '
    '<em class="dead">Faded</em> means it was never reached, and it stays faded.</p>'
  + RULE + '</div>', animated='explainer')

# --- 8. Type it, then break it ----------------------------------------------
brk = pcard('Hands-on: type it, then break it',
  '<div class="stage" id="stage-break">'
  + slhead('While Loop', 'Type It, Then Break It')
  + '<div class="stage-step on" data-label="1 &middot; type it">'
    '<p class="stage-q">Type this into the playground exactly as it is. The first line asks for '
    '<code>a</code>. <b>Give it a = 5</b> and run. Then run it again with <b>a = 1</b>, and again '
    'with <b>a = 100</b>.</p>'
    '<pre class="slabcode">a <b>=</b> <i>int</i>(<i>input</i>())\n'
    'counter <b>=</b> <i>0</i>\n'
    '<b>while</b> counter <b>&lt;</b> <i>3</i>:\n'
    '    a <b>=</b> a <b>+</b> <i>1</i>\n'
    '    <i>print</i>(a)\n'
    '    counter <b>=</b> counter <b>+</b> <i>1</i>\n'
    '<i>print</i>(<em>"End"</em>)</pre>'
    '<span class="tmr" data-secs="180"></span></div>'
  + '<div class="stage-step" data-label="2 &middot; break it, then put it back">'
    '<p class="stage-q">Two changes to the same program, in this order.</p>'
    + BRK_ART
    + '<span class="tmr" data-secs="240"></span></div>'
  + ctl() + RULE + '</div>', activity=19)

# --- 9. Worksheet: find the mistake ------------------------------------------
hunt = pcard('Worksheet: find the mistake',
  '<div class="stage" id="stage-hunt">'
  + slhead('Common Mistakes and Errors', 'Find the Mistake')
  + '<div class="stage-step on" data-label="the hunt">'
    '<p class="stage-q">Worksheet task 3. <b>Three</b> programs, and every one of them is '
    'broken. Say which line, which part, and what happens. Worksheet tab only: do not run '
    'them.</p>'
    '<div class="twocol"><div class="tc-a">'
    '<ul class="vopts">'
    '<li data-k="1"><b>Which line is wrong</b>, or, if the problem is that something is '
    '<b>not there</b>, what is missing and where it should go.</li>'
    '<li data-k="2">In the table, write <b>which part</b> it is, initialization, '
    'termination condition, or updation.</li>'
    '<li data-k="3">Then write <b>what happens when you run it</b>, in your own words. An error '
    'message, a wrong number of lines, or no stop at all.</li>'
    '</ul>'
    '<p class="stage-note">Three minutes. Then we go through these three and the one you broke '
    'yourselves, four in all. Program 1 has input 5. Program 2 has input 10. Program 3 has '
    'input 1.</p>'
    '</div><div class="tc-b">' + HUNT_ART + '</div></div>'
    '<span class="tmr" data-secs="180"></span>'
    '</div>' + RULE + '</div>',
  sheet='task 3', activity=3)

# --- 10. Write it in the playground -----------------------------------------
write = pcard('Hands-on: write it in the playground',
  '<div class="stage" id="stage-write">'
  + slhead('Question &middot; Square Pattern', 'Your Turn')
  + '<div class="stage-step on" data-label="the task">'
    '<p class="stage-q">Open the code playground and <b>type the whole program yourself</b>. Only '
    'the first line is given here. The stars must come out in N rows and N columns, with a space '
    'after every star.</p>'
    '<div class="twocol"><div class="tc-a">'
    '<pre class="slabcode">n <b>=</b> <i>int</i>(<i>input</i>())</pre>'
    '<p class="stage-note">Before you type: say to yourself how many times the print line has to '
    'run when n is 3. Then write all three parts, and run it with <b>3</b>, then <b>5</b>, then '
    '<b>1</b>.</p>'
    '</div><div class="tc-b">' + SQ_ART + '</div></div>'
    '<span class="tmr" data-secs="270"></span></div>'
  + RULE + '</div>', activity=11)

# --- 10b. The classroom quiz -------------------------------------------------
# The quiz itself runs on the learning portal, on their own laptops. The card is
# the picture and nothing else: no questions, no reveal, no timer.
quiz = pcard('Classroom quiz', S.quiz(), activity=10)

feedback = pcard('Feedback', S.feedback())
thankyou = pcard('Thank you', S.thankyou())

# --- 11. Takeaways concept map -----------------------------------------------
# Seven presses: loops, then its two kinds, then the while block diagram built
# one band at a time in the deck's own colours, then what breaking each one costs.
# The last box is per-part on purpose: a missing initialization does not make the
# loop run forever, it stops the program with a NameError before the loop starts.
TK = '''<svg class="fig tkmap" viewBox="0 0 1000 510" xmlns="http://www.w3.org/2000/svg" role="img"
 aria-label="Concept map: loops, the two kinds of loop in Python, the block diagram of a while loop built one part at a time, and what leaving out each part costs">
<rect class="tkghost" x="152" y="100" width="256" height="58" rx="12"/>
<rect class="tkghost" x="592" y="100" width="256" height="58" rx="12"/>
<rect class="tkghost" x="150" y="180" width="490" height="46" rx="8"/>
<rect class="tkghost" x="150" y="238" width="490" height="28" rx="6"/>
<rect class="tkghost" x="150" y="272" width="490" height="46" rx="8"/>
<rect class="tkghost" x="150" y="324" width="490" height="46" rx="8"/>
<rect class="tkghost" x="150" y="392" width="700" height="106" rx="10"/>
<g class="tkroot"><rect x="420" y="8" width="160" height="50" rx="12"/>
<text x="500" y="41" text-anchor="middle">Loops</text></g>

<g class="tkbox"><path d="M500 58 V82 H280 V104 M500 82 H720 V104"/>
<rect x="152" y="100" width="256" height="58" rx="12"/>
<text x="280" y="137" text-anchor="middle"><tspan class="kind">while</tspan><tspan class="when"> loop &middot; today</tspan></text>
<rect x="592" y="100" width="256" height="58" rx="12"/>
<text x="720" y="137" text-anchor="middle"><tspan class="kind">for</tspan><tspan class="when"> loop &middot; a later session</tspan></text></g>

<g class="tkslab"><path d="M280 158 V180"/>
<rect x="150" y="180" width="490" height="46" rx="8" fill="#F59A23"/>
<text x="395" y="211" text-anchor="middle">Initialization</text></g>

<g class="tkcode"><text x="150" y="258">while <tspan class="cnd">termination_condition</tspan><tspan class="col">:</tspan></text></g>

<g class="tkslab"><rect x="150" y="272" width="58" height="46" rx="6" fill="#EDEDED"/>
<rect x="214" y="272" width="426" height="46" rx="8" fill="#4EB3EA"/>
<text x="427" y="303" text-anchor="middle">Block of Code</text></g>

<g class="tkslab"><rect x="150" y="324" width="58" height="46" rx="6" fill="#EDEDED"/>
<rect x="214" y="324" width="426" height="46" rx="8" fill="#6AAB4C"/>
<text x="427" y="355" text-anchor="middle">Updation</text>
<path class="tkarrow" d="M179 370 V390 H104 V246 H130"/>
<path class="tkarrow" d="M122 239 l9 7 l-9 7"/></g>

<g class="tkbox"><rect x="150" y="392" width="700" height="106" rx="10"/>
<text x="500" y="422" text-anchor="middle">Miss the initialization and it stops with an error before the loop starts.</text>
<text x="500" y="450" text-anchor="middle">Get the condition wrong and it runs too many times, too few, or none at all.</text>
<text x="500" y="478" text-anchor="middle">Miss the updation and it never stops.</text></g>
</svg>'''

takeaways = pcard('Key takeaways',
  '<div class="stage" id="stage-tk" data-anim="7" '
  'data-anim-labels="loops|two kinds|initialization|the condition|the block|updation|miss one">'
  + slhead('Loops', 'Key Takeaways')
  + TK
  + animctl()
  + RULE + '</div>')

# --- 12. Exit ----------------------------------------------------------------
exitp = pcard('Exit: one question',
  '<div class="stage" id="stage-exit">'
  + slhead('While Loop', 'Before You Go')
  + pollstep('exit', 'A name-board app prints one letter of a name per line. Somebody types '
      'a single letter: <b>R</b>. What appears on the screen?',
      '<span class="ln">1  </span>a <b>=</b> <i>input</i>()\n'
      '<span class="ln">2  </span>counter <b>=</b> <i>0</i>\n'
      '<span class="ln">3  </span>length_of_a <b>=</b> <i>len</i>(a)\n'
      '<span class="ln">4  </span><b>while</b> counter <b>&lt;</b> (length_of_a <b>-</b> <i>1</i>):\n'
      '<span class="ln">5  </span>    <i>print</i>(a[counter])\n'
      '<span class="ln">6  </span>    counter <b>=</b> counter <b>+</b> <i>1</i>',
      [('1', 'R', False),
       ('2', 'nothing at all', True),
       ('3', 'IndexError: string index out of range', False),
       ('4', 'R, over and over, forever', False)],
      '<b>2: nothing at all.</b> len("R") is 1, so line 4 asks 0 &lt; 0, which is False the '
      'very first time. The body never runs once.',
      on=True, secs=150, auto=False,
      trace=mtrace([('ran', 'counter = 0'),
                    ('ran', 'length_of_a = 1'),
                    ('ran', '<b>while</b> 0 &lt; (1 - 1):   False'),
                    ('dead', '    print(a[counter])'),
                    ('dead', '    counter = counter + 1')],
                   'Nothing on screen, and nothing wrong with the machine.'))
  + RULE + '</div>', activity=1)

# ======================================================================= BLOCKS
# 21 blocks, 32 cards. The spine holds the ends of the session in place; what
# sits between them is this session's own.
blocks = ''.join([
 block('open', '&#128075;', 'Welcome', welcome),
 block('recaptitle', '&#128221;', 'Recap', recap_title),
 block('recap', '&#128221;', 'Recap: the line that lies', recap, 'block-quiz'),
 block('hook', '&#129693;', 'Hook: forty copies, and where else', hook, 'block-hook'),
 block('title', '&#127991;', 'Today', title_card),
 block('agenda', '&#128203;', 'Agenda: where we are going', agenda),
 block('once', '&#128196;', 'One line, one run &middot; Slide 9 redrawn, and slide 10',
       seq_card + slide(10, 'Question')),
 block('ws1', '&#128187;', 'Worksheet: the next ten numbers', ws1_card, 'block-activity'),
 block('loops', '&#128260;', 'What a loop is, and the while shape &middot; Slides 11&ndash;13',
       slide(11, 'Loops') + slide(12, 'Loops') + slide(13, 'While Loop')),
 block('anat', '&#129518;', 'Build it, name it, count it &middot; Slides 14, 16 and 24',
       slide(14, 'Example') + slide(16, 'Code') + anatomy + slide(24, 'While Loop'), 'block-hook'),
 block('ws2', '&#128187;', 'Tap to classify: which part is this line?', ws2_card, 'block-activity'),
 block('walk', '&#128161;', 'The condition is asked again: follow the dot', walk, 'block-hook'),
 block('quiz', '&#128221;', 'Classroom quiz: on the portal', quiz, 'block-quiz'),
 block('break', '&#128187;', 'Hands-on: type it, then break it', brk, 'block-hands'),
 block('hunt', '&#128187;', 'Worksheet: find the mistake', hunt, 'block-activity'),
 block('reveals', '&#9888;', 'The four common mistakes &middot; Slides 42, 44, 45 and 46',
       slide(42, 'Missing Initialization') + slide(44, 'Incorrect Termination Condition')
       + slide(45, 'Incorrect Termination Condition') + slide(46, 'Not Updating Counter Variable')),
 block('square', '&#11088;', 'Square pattern: write it yourself &middot; Slides 47 and 50',
       slide(47, 'Square Pattern') + write + slide(50, 'While Loop'), 'block-hands'),
 block('exit', '&#127937;', 'Exit: one question', exitp, 'block-exit'),
 block('takeaways', '&#128506;', 'Key takeaways: the map', takeaways),
 block('feedback', '&#128172;', 'Feedback', feedback),
 block('thanks', '&#128075;', 'Thank you', thankyou),
])

# ========================================================================= NAV
CHECKPOINTS = [
 ('Checkpoint 1 &middot; 13 min &middot; they can say what one press repeating a job looks like', [
   ('open', 'k-concept', 1, 'Welcome'),
   ('recaptitle', 'k-concept', 1, 'Recap'),
   ('recap', 'k-quiz', 3, 'Recap: the line that lies'),
   ('hook', 'k-hook', 6, 'Hook: forty copies'),
   ('title', 'k-concept', 1, 'Today'),
   ('agenda', 'k-concept', 1, 'Agenda')]),
 ('Checkpoint 2 &middot; 10 min &middot; they can point at the block that repeats', [
   ('once', 'k-concept', 3, 'One line, one run'),
   ('ws1', 'k-activity', 3, 'Worksheet: ten numbers'),
   ('loops', 'k-concept', 4, 'A loop, and the while shape')]),
 ('Checkpoint 3 &middot; 21 min &middot; they can name the three parts on any loop', [
   ('anat', 'k-hook', 8, 'Build it, name it, count it'),
   ('ws2', 'k-activity', 4, 'Which part is this line?'),
   ('walk', 'k-hook', 3, 'Ask it again: the dot'),
   ('quiz', 'k-quiz', 6, 'Classroom quiz')]),
 ('Checkpoint 4 &middot; 14 min &middot; they can say why a loop never stops', [
   ('break', 'k-hands', 6, 'Type it, then break it'),
   ('hunt', 'k-activity', 4, 'Worksheet: find the mistake'),
   ('reveals', 'k-concept', 4, 'The four common mistakes')]),
 ('Hard floor &middot; 17 min &middot; the exit runs whatever else is dropped', [
   ('square', 'k-hands', 8, 'Square pattern, written by them'),
   ('exit', 'k-exit', 4, 'Exit: one question'),
   ('takeaways', 'k-concept', 3, 'Key takeaways'),
   ('feedback', 'k-concept', 1, 'Feedback'),
   ('thanks', 'k-concept', 1, 'Thank you')]),
]
assert sum(d for _, its in CHECKPOINTS for _, _, d, _ in its) == 75, 'durations must total 75'

nav = ''
for cp, its in CHECKPOINTS:
    nav += f'<p class="sp-cp"><span>{cp}</span></p>'
    for i, k, m, l in its:
        nav += (f'<button type="button" class="sp-item {k}" data-target="{i}" data-mins="{m}">'
                f'<span class="sp-label">{l}</span></button>')


# ============================================================ DERIVED ANSWERS
# The guide's answer table. Every row is produced by running the program, not by
# typing what it ought to print: an answer key written by hand is wrong about
# once per session, and it is wrong in the one place nobody can check it live.
def _run(src, inp=()):
    out, it = [], iter(inp)
    g = {'input': lambda *a: next(it),
         'print': lambda *a: out.append(' '.join(str(x) for x in a))}
    try:
        exec(src, g)
    except Exception as e:
        return out, '%s: %s' % (type(e).__name__, e)
    return out, None

def _lines(o):
    return html.escape('\n'.join(o)) if o else 'nothing at all'

_RECAP = 'marks = 30\nif marks >= 35:\n    if marks >= 60:\n        print("First class")\nprint("Pass")'
_BUILD = ('a = int(input())\ncounter = 0\nwhile counter < 3:\n    a = a + 1\n'
          '    print(a)\n    counter = counter + 1\nprint("End")')
_T2A = ('marks = int(input())\ncounter = 1\nwhile counter <= 5:\n    print(marks)\n'
        '    marks = marks - 2\n    counter = counter + 1\nprint("Done")')
_T2B = ('name = input()\nseats = 3\nwhile seats > 0:\n    print(name)\n'
        '    seats = seats - 1\nprint("Full")')
_P1 = ('a = int(input())\nwhile counter < 3:\n    a = a + 1\n    print(a)\n'
       '    counter = counter + 1\nprint("End")')
_P3 = ('a = int(input())\ncounter = 1\nwhile counter < 3:\n    a = a + 1\n    print(a)\n'
       '    counter = counter + 1\nprint("End")')
_DOT2 = ('a = 5\ncounter = 0\nwhile counter < 2:\n    a = a + 1\n    print(a)\n'
         '    counter = counter + 1\nprint("End")')
_DOT0 = _DOT2.replace('counter < 2', 'counter < 0')
_SQ = 'n = int(input())\ncounter = 0\nwhile counter < n:\n    print("* " * n)\n    counter = counter + 1'
_EXIT = ('a = input()\ncounter = 0\nlength_of_a = len(a)\nwhile counter < (length_of_a - 1):\n'
         '    print(a[counter])\n    counter = counter + 1')

def _asked(start, bound):
    n = 0
    c = start
    while True:
        n += 1
        if not c < bound:
            return n
        c += 1

_t2a_out, _ = _run(_T2A, ['10'])
_t2b_out, _ = _run(_T2B, ['Asha'])
_p1_out, _p1_err = _run(_P1, ['5'])
_p3_out, _ = _run(_P3, ['1'])
_build_out, _ = _run(_BUILD, ['5'])
_recap_out, _ = _run(_RECAP)
_recap_fixed, _ = _run(_RECAP.replace('\nprint("Pass")', '\n    print("Pass")'))
_dot2, _ = _run(_DOT2)
_dot0, _ = _run(_DOT0)
_sq3, _ = _run(_SQ, ['3'])
_exit1, _ = _run(_EXIT, ['R'])
_exit4, _ = _run(_EXIT, ['Ravi'])

ANSWER_ROWS = [
 ('recap, card 3', 'Which line is to blame?',
  'Line 5. It prints <code>%s</code>; indented it prints %s.'
  % (_lines(_recap_out), _lines(_recap_fixed))),
 ('worksheet task 1', 'How long is the program?',
  'Ten numbers: <b>%d</b> lines, one input line plus ten pairs. A hundred numbers: <b>%d</b>.'
  % (1 + 2 * 10, 1 + 2 * 100)),
 ('build card, card 15', 'How many times is the condition asked?',
  'Asked <b>%d</b> times, three yeses then one no. The body runs <b>3</b>. Input 5 prints '
  '<code>%s</code>.' % (_asked(0, 3), ', '.join(_build_out))),
 ('worksheet task 2', 'Which part is each line?',
  'Program A: line 2 <b>I</b>, line 3 <b>T</b>, line 6 <b>U</b>. '
  'Program B: line 2 <b>I</b>, line 3 <b>T</b>, line 5 <b>U</b>.'),
 ('worksheet task 2, the count', 'How many times does line 4 of Program A run?',
  '<b>%d</b>. Program A prints <code>%s</code>. Program B prints <code>%s</code>.'
  % (len(_t2a_out) - 1, ', '.join(_t2a_out), ', '.join(_t2b_out))),
 ('the dot, card 18', 'What does it print?',
  'At 2: <code>%s</code>. At 0: <code>%s</code>, and the body greys out and stays grey.'
  % (', '.join(_dot2), ', '.join(_dot0))),
 ('worksheet task 3, program 1', 'What is wrong, and what happens?',
  'No initialization. <code>%s</code>. It does not loop at all; it stops before the first pass.'
  % html.escape(_p1_err or '')),
 ('worksheet task 3, program 2', 'What is wrong, and what happens?',
  'Line 3 stores the <em>answer</em> of the condition, <code>True</code>, in a box. Line 4 asks '
  'the box, so it never stops. Nothing is printed to the screen that ends.'),
 ('worksheet task 3, program 3', 'What is wrong, and what happens?',
  'The counter starts at 1, so the loop runs twice, not three times. Input 1 prints '
  '<code>%s</code>. Two repairs are equally right: start at 0 and keep <code>&lt; 3</code>, or '
  'start at 1 and use <code>&lt; 4</code>.' % ', '.join(_p3_out)),
 ('the break-it beat, card 20', 'What happens with the update deleted?',
  'It never stops. Counter stays at 0, so the answer to the question never changes. Moving the '
  'update above <code>print(a)</code> still prints the same three numbers: order inside the body '
  'changes what prints, not how many passes.'),
 ('square pattern, card 27', 'What does the program print?',
  'For n = 3, three rows of <code>%s</code>. The common bug is <code>counter &lt; 3</code> '
  'hard-coded instead of <code>counter &lt; n</code>: it passes 3 and fails 5.'
  % html.escape(_sq3[0] if _sq3 else '')),
 ('the exit, card 29', 'What appears on the screen?',
  'For a single letter: <b>%s</b>. len is 1, so line 4 asks 0 &lt; 0, which is False the first '
  'time. For a four letter name it prints <code>%s</code>, the first three letters.'
  % (_lines(_exit1), ', '.join(_exit4))),
]

ANSWER_TABLE = (
  '<section class="g-sec"><h3>Every answer, in one place</h3>'
  '<p><b>This file is the only copy of these, and it is never projected.</b> Every row below was '
  'produced by running the program during the build, not typed in.</p>'
  '<table class="gans"><tr><th>Where</th><th>Question</th><th>Answer</th></tr>'
  + ''.join('<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % r for r in ANSWER_ROWS)
  + '</table></section>')

SOURCE_DEFECTS = (
  '<section class="g-sec"><h3>Source defects</h3>'
  '<p>Found in <code>12 - Loops.pptx</code> while this plan was built. The plan works around each '
  'one; the deck still needs fixing by whoever owns it.</p><ul class="brief">'
  '<li><b>Slide 51, Key Takeaways.</b> Its eyebrow reads <em>Working with File System</em>, not '
  '<em>Loops</em>. This plan cuts that slide in favour of the concept map, so the defect does not '
  'reach the room. The deck owner should correct the eyebrow.</li>'
  '<li><b>Slides 44 and 45 share one title.</b> Both are headed <em>Incorrect Termination '
  'Condition</em>, but 44 stores the answer of the condition in a variable and 45 starts the '
  'counter in the wrong place. Two different titles would be better.</li>'
  '<li><b>The exit question uses <code>a[counter]</code>.</b> The strings session covers length, '
  'repetition and joining; picking one letter by position is not in the transcript. The answer '
  'does not depend on it, and card 29 carries the sentence to say if anyone asks, but the deck '
  'owner should confirm indexing was taught before this session.</li>'
  '<li><b>Slides 19 to 23 build the program over five slides</b> and 25 to 41 walk its execution '
  'over seventeen. Both runs are replaced here, by one stepped card and one animated explainer, '
  'because a flat image cannot be predicted against.</li>'
  '</ul></section>')

GUIDE_CSS = """
.gans{width:100%;border-collapse:collapse;margin:0 0 4px;font-size:14px}
.gans th,.gans td{border:1px solid var(--rule);padding:8px 10px;text-align:left;
  vertical-align:top}
.gans th{background:var(--rule2);font-weight:680}
.gans td:first-child{white-space:nowrap;color:var(--muted);font-weight:600}
.gans code{font-family:var(--mono);font-size:13px;background:var(--rule2);
  padding:1px 4px;border-radius:4px;white-space:pre-wrap}
"""

# ======================================================================= GUIDE
NCARDS = 32

def g(card, whenstr, head, flow, do, watch, handout=False):
    fl = ''.join(f'<li>{x}</li>' for x in flow)
    dl = ''.join(f'<li>{x}</li>' for x in do)
    hd = ' data-handout' if handout else ''
    return (f'<article class="gcard" data-card="{card}"{hd}>'
            f'<div class="gthumb">@@T{card}@@</div><div class="gbody">'
            f'<p class="gwhen">{whenstr}</p><h4>{head}</h4>'
            f'<div class="gflow"><b>How it goes</b><ol>{fl}</ol></div>'
            f'<ul class="gdo">{dl}</ul>'
            f'<p class="gwatch"><b>Watch for</b> {watch}</p>'
            '</div></article>')

def W(kind, mins, n, extra='', blk=None):
    """The line above a guide entry's heading.

    `mins` is what THIS card costs, not what its block costs. Four cards in a
    row each claiming the block's eight minutes is how an instructor loses the
    thread at minute 40, so a card inside a multi-card block also names the
    block total, once."""
    t = f'{mins} sec' if isinstance(mins, str) else f'{mins} min'
    return (f'{kind} &middot; {t} &middot; card {n} of {NCARDS}'
            + (f' &middot; in an {blk} min block' if blk else '')
            + (f' &middot; {extra}' if extra else ''))

G = []
G.append('<h3 class="ghd">Checkpoint 1: they can name one machine that repeats one job '
         'after a single press. If not, take the examples in the hook down to two and '
         'move on.</h3>')
G.append(g(1, W('Opening', 1, 1), 'Welcome, while they settle', [
  'This is up as they walk in and find seats. Say nothing over it.',
  'When the room is quiet, one line: &ldquo;good morning, laptops shut, please. I will '
  'tell you when to open them.&rdquo;'],
  ['Ten seconds. Move on as soon as the talking stops.',
   'Do not name the topic here. They guess it later, and the card after the hook tells them.'],
  'Nothing. This card is the room settling.'))
G.append(g(2, W('Recap', 1, 2), 'The word Recap, and nothing else', [
  'One press, one word. Say what it is about: &ldquo;last session was nested conditional '
  'statements. Quick check on that before we start anything new.&rdquo;',
  'Do not list what was covered. Reading a list is not remembering.'],
  ['Five seconds. The next card is the actual retrieval.'],
  'Nothing yet.'))
G.append(g(3, W('Recap', 3, 3), 'Find the line that lies', [
  'Read the program out, line by line, with the line numbers. Marks is 30.',
  'Say what it was meant to do: &ldquo;Pass should only print when marks is 35 or more. Marks is '
  '30. So this should print nothing at all.&rdquo;',
  'Then the task, and then silence: &ldquo;it prints Pass. One line is to blame. Decide which '
  'one.&rdquo; Twenty seconds. Do not talk over it. Laptops are still shut and the worksheet is '
  'not out yet, so this one is fingers, not writing.',
  'Take the vote: &ldquo;hold up that many fingers, all together, on three.&rdquo; Then count the '
  'room out loud, number by number.',
  'Press Show me. Press 1 puts the wrong output up; press 2 lights line 5 and says why; press 3 '
  'shows what it should have printed.',
  'Close on the idea today needs: &ldquo;the indent decides which block a line belongs to. Line 5 '
  'is at the left edge, so it is outside both ifs.&rdquo;'],
  ['Short of time: press straight to 3 and read the green line. The vote is what costs the minute.',
   'The panel drives itself: Show me steps it, Replay puts it back. Arrow keys work inside it too.',
   'Hands down before you press. A recap they watch teaches nothing.',
   'Do not reteach nesting. Three presses, three minutes, move.'],
  'A room that votes for line 3 has the nesting right but not the indent. Say the rule once and '
  'carry on; it comes back all session.'))
G.append(g(4, W('Hook', 6, 4), 'Forty copies, and where else they have seen it', [
  '<b>Press 1</b> is up: the shop, and nothing inside the machine yet. Start from something all '
  'of them have done: &ldquo;the xerox shop outside the gate. You hand over one form and say '
  'forty copies.&rdquo;',
  'Say what they already know, so nobody has to correct you: &ldquo;he does not press the button '
  'forty times. He types 40, presses START once, and goes back to his phone.&rdquo;',
  'Now the question that is actually interesting: &ldquo;but the machine only knows how to make '
  '<em>one</em> copy. So what is happening <em>inside</em> it, forty times over?&rdquo; Take two '
  'or three answers. Take the wrong ones too. Correct nobody.',
'<b>Press 2.</b> Only now does the column of forty jobs appear inside the machine. Let them '
  'look at it: &ldquo;forty of them. One for every copy.&rdquo;',
  '<b>Press 3.</b> The note: &ldquo;one job, forty times over. That is all the machine is '
  'doing.&rdquo; Ask before you move on: &ldquo;and if he had typed four hundred?&rdquo; Wait for '
  'the groan.',
  '<b>Press 4.</b> The machine goes and the question changes: where else have you seen this? Then '
  '<em>stop talking</em>. Nudge instead: &ldquo;anything on this campus with a button on it.&rdquo;',
  'Take three or four. Make each one say <em>both</em> halves: the machine, and the one job it '
  'repeats. &ldquo;ATM&rdquo; is half an answer; &ldquo;the ATM counts one note, again and again, '
  'until it reaches the amount&rdquo; is the answer.',
  '<b>Presses 5, 6, 7.</b> One of ours per press, only after theirs. The three empty boxes are '
  'up from press 4, so the room can see how many are coming. Tie each to whichever student answer '
  'it matches.',
  '<b>Press 8.</b> Back to the machine, and the column collapses onto one line. Say nothing at all '
  'while it moves. Then: &ldquo;one instruction, written once. Forty copies still come out.&rdquo;',
  'Point at the code and say plainly what it is, without naming it: &ldquo;this is what is running '
  'behind the scenes in that machine. What it is called, and how to write one, that is '
  'today.&rdquo;'],
  ['Short of time: take two student examples, not four, and show only the ATM before press 8.',
   'Eight presses. Arrow keys step it in presenter view; Replay puts it back to press 1.',
   'Press 1 is the shop and the question, and nothing inside the machine. Do not press on until '
   'you have taken two or three answers: press 2 is the answer to what you just asked.',
   'No timer on this card. A clock turns a call for examples into a task with a right answer.',
   'Do not claim the operator presses the button forty times. They know he does not, and the hook '
   'dies the moment one of them says so.',
   'Never go round naming people. Keep their answers on the board; they come back at the takeaways.'],
  'If somebody says &ldquo;loop&rdquo; before you do, take it and use their word all session.'))
G.append(g(5, W('Title', 1, 5), 'Now name it', [
  'Press through. The card says one word, and it is the word half the room has already said.',
  'One line: &ldquo;yesterday we decided <em>whether</em> a line runs. Today we decide <em>how '
  'many times</em> it runs.&rdquo;'],
  ['Ten seconds. Do not start the agenda on this card.'],
  'Nothing. This card exists so the room hears the name after they have guessed it.'))
G.append(g(6, W('Agenda', 1, 6), 'Four stops, and the worksheet', [
  'One press per stop. Read the stop, then the line under it, then move.',
  'Stop 4 is the promise worth saying out loud: &ldquo;by the end you will have written one of '
  'these yourself.&rdquo;',
  'Then get the worksheet open on every laptop.'],
  ['Send the worksheet link now and have them download it and open it. This is the only hand-out '
   'moment in the session, and every task today is in that one file.',
   'Ten seconds per stop. Do not narrate more than the line that is there.'],
  'Nothing. This card exists so the room knows where it is going.', handout=True))

G.append('<h3 class="ghd">Checkpoint 2: they can point at the block that repeats. If not, take the line count in task 1 as a show of hands instead of a discussion.</h3>')
G.append(g(7, W('Concept', '50', 7, blk=3), 'Every line runs once, and you can watch it', [
  'Ask it before you press anything: &ldquo;so far, when Python reaches a line, how many times '
  'does it run that line?&rdquo; Wait. Take &ldquo;once&rdquo; from the room.',
  '<b>Presses 1 to 5.</b> One press per line. Say the line number and what it did, nothing more: '
  '&ldquo;line 1, a is 5. Line 2, a is 6, and the old 5 is struck out. Line 3 prints it.&rdquo;',
  'On press 4 point at the box: &ldquo;a is 7 now. Same two lines as before, written out '
  'again.&rdquo; That is the sentence the worksheet task is about to charge them for.',
  '<b>Press 6.</b> The verdict, then the question under it. Read the question once, slowly, and '
  '<em>do not answer it</em>: &ldquo;before I answer that, I want you to feel why we need it.&rdquo;'],
  ['Short of time: press straight to 6 and read the two bands. The walk is what costs the minute.',
   'Six presses. Arrow keys step it; Replay puts it back to line 1.',
   'Fifty seconds. It exists to make the next task feel unreasonable.',
   'Do not say the word loop on this card. They have not been given it yet.'],
  'Somebody will say &ldquo;write it ten times&rdquo;. Good, that is exactly what the '
  'worksheet is about to ask them to do.'))
G.append(g(8, W('Concept', '20', 8, blk=3), 'The question, left hanging', [
  'The deck asks it again, in its own words. Do not read it twice. Leave it up while you say the '
  'handover line and nothing else.',
  'Do not answer it. Say instead: &ldquo;before I answer that, I want you to feel why we need '
  'it.&rdquo;',
  'Hand straight over to the worksheet.'],
  ['Short of time: this is the one card in the block that can go. Card 7 already asked it.',
   'Twenty seconds. It is a hinge, not a concept.'],
  'A student who answers it correctly here is welcome, take the word, then still run the '
  'worksheet task. Feeling the pain is the point, not hearing the answer.'))
G.append(g(9, W('Worksheet 1', 3, 9, 'worksheet task 1'), 'Ten numbers, the long way', [
  'Worksheet open, playground shut. Task 1 has the three-number program already in it.',
  'Read the change once: &ldquo;same question, but now it asks for the next <em>ten</em>.&rdquo;',
  'Say the two things they write: the lines they would add, and then the two numbers in the '
  'little table.',
  'Press play on the timer. Two and a half minutes.',
  'Walk the rows while they work and keep talking to them, &ldquo;are you guys done?&rdquo; '
  '&middot; &ldquo;come on, let us see who finishes first&rdquo; &middot; &ldquo;one minute left, '
  'just the line count now&rdquo;.',
  'Hands off keyboards. Ask for the line count by show of hands: &ldquo;fewer than fifteen? '
  '&hellip; more than twenty?&rdquo; Then: &ldquo;and for a hundred numbers?&rdquo;'],
  ['Short of time: two minutes on the timer, and take the line count only, not the hundred.',
   'Press play on the timer. It does not start by itself.',
   'Do not show a solution. The next cards are the answer.',
   'Tasks 2 and 3 are further down the same file. Tell them to leave those alone for now.'],
  'Twenty-one lines is right: one input line plus ten pairs, and two hundred and one for a '
  'hundred numbers. Both are worth saying out loud. Anyone who wrote a loop already has been '
  'reading ahead, ask them to hold it for two cards.'))
G.append(g(10, W('Concept', '60', 10, blk=4), 'A loop runs a block several times', [
  'Open from their own sheets: &ldquo;twenty-one lines, and you all wrote the same two of them '
  'ten times.&rdquo;',
  'Now name it, pointing at the orange arrow: &ldquo;a loop lets us execute one block of code '
  'several times.&rdquo;',
  'Check them with a question, do not tell: &ldquo;how many <em>different</em> lines are in that '
  'blue block? One block, how many runs?&rdquo;'],
  ['Do not name while or for yet. The next card does that, and it lands better as an answer.',
   'Sixty seconds.'],
  'If the room is quiet at the check question, narrow it: &ldquo;point at the block that '
  'repeats.&rdquo;'))
G.append(g(11, W('Concept', '20', 11, blk=4), 'Python has two ways to loop', [
  'Ask first: &ldquo;so how do we write one in Python?&rdquo; Then put the card up.',
  'Read it plainly: two ways, the <em>while</em> loop and the <em>for</em> loop.',
  'Say which is which and when: &ldquo;today is while, start to finish. The for loop comes in a '
  'later session. Both do the same job; they are written differently.&rdquo;'],
  ['Twenty seconds. Its only job is that nobody leaves thinking while is the only loop there is.',
   'Do not promise the for loop for tomorrow, say &ldquo;a later session&rdquo; unless you '
   'know the timetable.'],
  'Students who have seen for loops elsewhere will want to use one all session. Tell them plainly '
  'that today is about the three lines you have to write yourself.'))
G.append(g(12, W('Concept', '60', 12, blk=4), 'The while shape', [
  'Straight on: &ldquo;this is the first one, and it is called while.&rdquo;',
  'Read the shape off the picture in order, the word while, the condition, the colon, and '
  'then the indented block underneath it.',
  'Connect it to yesterday out loud: &ldquo;same colon, same indent as an if. The difference is '
  'one word.&rdquo;',
  'Then the difference that matters: &ldquo;an if asks its condition once. This one asks it '
  '<em>again</em>, every time round.&rdquo;'],
  ['Point at the indent with your hand. That is the same rule they learned yesterday.',
   'Sixty seconds. The build that follows is where it gets assembled.'],
  'A student saying &ldquo;so it is an if that repeats&rdquo; has it. Use their sentence.'))

G.append('<h3 class="ghd">Checkpoint 3: they can name the three parts on any loop. If not, run the dot a second time at 2 and drop the square pattern to three minutes.</h3>')
G.append(g(13, W('Concept', '30', 13, blk=8), 'The example, and what it asks for', [
  'Read the question off the card: print the next three consecutive numbers of the input.',
  'Point at both example boxes. Input 1 gives 2, 3, 4. Input 10 gives 11, 12, 13.',
  'Tie it to their own sheet: &ldquo;this is the question you just did by hand, and you already '
  'know what the long way costs.&rdquo;'],
  ['Short of time: read the input and output boxes and move. The build card restates the task.',
   'Thirty seconds. It is the question the next three cards answer.'],
  'Nothing. This is the problem statement, not a concept.'))
G.append(g(14, W('Concept', '30', 14, blk=8), 'The block that repeats', [
  'Point at the grey band: &ldquo;these two lines, three times over. That is your sheet, printed '
  'neatly.&rdquo;',
  'Read the sentence beside it out loud, and then make it the question: &ldquo;so what we want is '
  'to make <em>this block</em> run three times, instead of writing it three times. How?&rdquo;',
  'Do not answer. Go to the build.'],
  ['Short of time: point at the grey band, ask the question, and go.',
   'Thirty seconds. This card names the block; do not also name the three parts here. That is the '
   'next card\'s job.'],
  'A student who says &ldquo;put it in a loop&rdquo; is right and early. Ask them what the loop '
  'needs to know, and build it from their answer.'))
G.append(g(15, W('The build', 6, 15, blk=8), 'Build it, name it, count it: seven presses', [
  '<b>Press 1.</b> The skeleton is up: the input line, the two lines from their own sheet that '
  'repeat, and a while line with a <em>gap</em> where the condition should be. Say what is '
  'missing: &ldquo;three lines to go, and you are going to give me one of them.&rdquo;',
  '<b>Press 2: initialization.</b> Ask before you press: &ldquo;if I want this to happen '
  'exactly three times, what do I need first?&rdquo; Take &ldquo;a count&rdquo; from the room, '
  'then press.',
  'Read the card: it runs <em>once</em>. Push it: &ldquo;even if the loop goes round a hundred '
  'times?&rdquo; Still once. Write the word on the board.',
  '<b>Press 3: updation.</b> Ask first: &ldquo;the counter is sitting at zero. Who is going '
  'to change it?&rdquo; Press. The question that matters is <em>where</em>: &ldquo;is that line '
  'inside the loop or outside? How can you tell?&rdquo; Wait for the indent. Write the word.',
  '<b>Press 4: the question.</b> A red dashed box, and nothing else. Read it out and then '
  '<em>stop talking</em>. Ten seconds of silence.',
  'Then take answers from three different parts of the room before you say whether any is right. '
  'Push on what they give you: &ldquo;counter equals three? When would that be True? Walk it with '
  'me.&rdquo;',
  '<b>Press 5: termination condition.</b> The answer lands in the gap. Check it against '
  'their answers, not against the screen. Now the count, and ask before you read it: &ldquo;the '
  'body runs three times. How many times does <em>line 3</em> run?&rdquo; Most of the room will '
  'say three.',
  'Let them be wrong, then count it together on the board: 0 &lt; 3 yes, 1 &lt; 3 yes, 2 &lt; 3 '
  'yes, 3 &lt; 3 <em>no</em>. Four. &ldquo;Three yeses and one no. The no is how it stops.&rdquo; '
  'Write the words on the board.',
  '<b>Press 6: block of code.</b> Three times, only while the answer is True. Thirty '
  'seconds; they can see it.',
  '<b>Press 7: run it.</b> Input 5 gives 6, 7, 8, End. Close on it: &ldquo;four parts. '
  'Three of them you write yourself, and the fourth is the work you actually wanted done.&rdquo;'],
  ['Short of time: shorten presses 6 and 7. Never the silence on press 4 or the count on press 5.',
   'Seven presses, and this one card replaces what used to be five slides. Do not rush it, '
   'it is the centre of the session.',
   'Presses 4 and 5 are the whole thing. If you are running late, shorten presses 6 and 7, never '
   'the silence on press 4 or the count on press 5.',
   'Write initialization, termination condition and updation on the board as they arrive, and '
   'leave all three there for the rest of the session.'],
  'A student who says &ldquo;four&rdquo; before you count it has understood the back edge already. '
  'Ask them to say why, and let the room hear it from them rather than from you.'))
G.append(g(16, W('Concept', '60', 16, blk=8), 'The shape, with the names on it', [
  'Straight on from the build: &ldquo;strip the example away and this is what is left. This is '
  'every while loop you will ever write.&rdquo;',
  'Read it top to bottom against the words already on your board: initialization outside, '
  'termination condition on the while line, block of code indented, updation last and still '
  'indented.',
  'One check: &ldquo;which of those four is <em>outside</em> the loop?&rdquo; Wait for it.'],
  ['This is the diagram they will redraw in an exam, and it is the one the takeaways map rebuilds '
   'at the end. Leave it up while you give the worksheet task.',
   'Sixty seconds. It is a summary, not a new idea.'],
  'Anyone pointing at updation as outside has confused the indent. Fix it here, not later.'))
G.append(g(17, W('Worksheet 2', 4, 17, 'worksheet task 2'), 'Which part is this line?', [
  'Worksheet task 2. Two programs, and they have not seen either of them.',
  'Say the task once: &ldquo;six lines. Against each one type I, T or U. I for initialization, '
  'T for termination condition, U for updation.&rdquo; Say the words in full, not the letters '
  'only.',
  'Do Program A line 2 together, out loud, so nobody is guessing at the task.',
  'Press play. Two and a half minutes. Walk the rows, and keep talking to them: &ldquo;any '
  'doubts about the task? Ask now&rdquo;, &ldquo;one minute, and the question underneath&rdquo;.',
  'Hands off keyboards <em>first</em>. Then say the check, not before: <em>every loop has '
  'exactly one of each. If you have typed the same letter three times, look again.</em>',
  'Now the panel. Take the first line, count hands for I, for T, for U, and tap the bin the room '
  'voted for. If it snaps home, read the green line. If it bounces, read the red line and take '
  'the vote again.',
  'Program B is where it gets interesting. Both of its wrong bins are real beliefs: that '
  'initialization always sets zero, and that updation always adds one. Let those bounce.',
  'Last thing, and do not skip it: hands for the count on line 4 of Program A. Take 5, and take '
  '6. Then walk it out loud: counter is 1 yes, 2 yes, 3 yes, 4 yes, 5 yes, 6 no. Five passes, six '
  'questions. &ldquo;Same shape as the four you counted on the build card.&rdquo;'],
  ['Short of time: tap the first four lines and say the last two rather than taking a vote on them.',
   'Press play on the timer before they start typing.',
   'Tap the bin the room voted for, not the right one. A bin that bounces is the whole point of '
   'the panel.',
   'Replay clears the bins if you want to run a line again.',
   'Say the self-check only after they have stopped typing. On the worksheet it would be a hint, '
   'not a check.'],
  'Program B line 2 and line 5 are the two that bounce most. If they both snap home first '
  'time, the three parts have landed and you can take a minute off the reveals later. The '
  'six answers are I, T, U for Program A lines 2, 3 and 6, and I, T, U for Program B lines '
  '2, 3 and 5. Line 4 of Program A runs five times: counter starts at 1 and the test is '
  'less than or equal to 5, so count the yeses.'))
G.append(g(18, W('Explainer', 3, 18), 'Ask it again: follow the dot', [
  '<b>Say this, do not look for it on the card.</b> &ldquo;The red dot is Python. I am going to '
  'set the number, and before I press play I want you to tell the person next to you what this '
  'prints.&rdquo; The card carries the drawing only; this sentence is yours.',
  'Open from the lines they just named: &ldquo;you found the three lines. Now watch what Python '
  'does with them.&rdquo;',
  'The slider is set to 2. Before you touch anything: &ldquo;tell the person next to you what '
  'this prints. All of it.&rdquo; Ten seconds, out loud, then quiet.',
  'Press Play, then narrate the dot as it moves, one step per sentence, asking rather than '
  'telling: &ldquo;first it sets a to 5, and counter to 0. Now it reaches the diamond. Is 0 less '
  'than 2? Yes, so we go inside &hellip;&rdquo;',
  'Then, with your hand on the back edge: &ldquo;look where it goes next. It runs back up '
  '<em>that line</em>, to the same question. Is 1 less than 2? Yes again.&rdquo;',
  'On the pass that fails, slow right down: &ldquo;counter is 2. Is 2 less than 2? No. So we do '
  'not go in. We come out at the bottom and print End.&rdquo;',
  'Tie it back to the build: &ldquo;count the times the dot touched that diamond. Three yeses and '
  'a no, four. Same number as before.&rdquo;',
  'Now drag the slider to <b>0</b> and ask before playing: &ldquo;what prints now?&rdquo; Take the '
  'vote. Most of the room says 6. Play it: the whole body greys out and stays grey.'],
  ['Short of time: run it once at 2 and once at 0, and skip the narration in between.',
   'One step is the button to use while you narrate, it stops on the line they argued about.',
   'Press Reset before you leave the card, or the next class sees a finished run.',
   'Three minutes. If you are behind, run it once at 2 and once at 0 and skip the narration in '
   'between.'],
  'The 0 prediction is the one that splits the room. Let them be wrong out loud before you play '
  'it.'))
G.append(g(19, W('Quiz', 6, 19), 'Classroom quiz, on the portal', [
  'Card up, and announce it: &ldquo;open the learning portal on your laptop. Today\'s classroom '
  'quiz is live.&rdquo;',
  'Say the two things they need: how long they have, and that it is individual. Five minutes, '
  'own laptop, no talking.',
  'Do not read any question out, and do not put one on the board. The portal has them.',
  'Walk the room while they attempt it. Look at screens, not at the clock.',
  'When the portal closes it, take the two questions most of the room got wrong and say the '
  'correct reasoning for each in one sentence. Nothing longer.',
  'Use it to decide the second half: if the three parts have not landed, take the square pattern '
  'down to five minutes and spend the time on the reveals.'],
  ['No timer on this card. The portal runs its own clock, and a second one is noise.',
   'A student who finishes early goes back to worksheet task 2 and checks their line numbers.',
   'Five to six minutes total, including the two sentences at the end.'],
  'The quiz is the checkpoint for the whole first half. A weak result here is not a reason to '
  'reteach from the start; it is a reason to slow the reveals down.'))

G.append('<h3 class="ghd">Checkpoint 4: they can say why a loop never stops. If not, say reveal 4 in one sentence rather than putting the card up.</h3>')
G.append(g(20, W('Hands-on', 6, 20), 'Type it, then break it', [
  'Laptops open. &ldquo;Type this exactly. Do not copy mine, type it.&rdquo; The first line '
  'asks for a, so run it with a = 5, then a = 1, then a = 100. Three minutes.',
  'Walk the rows. Most errors will be the indent or the colon. Say so out loud once so nobody '
  'feels singled out.',
  'Step to the second panel and frame change 1 as your own mistake: &ldquo;I think I have left a '
  'line out by accident, delete counter equals counter plus one and run it again with a = '
  '5.&rdquo; Do not warn them, and cover change 2 with your hand if you have to.',
  'Let them react. Somebody will shout. Only then: &ldquo;what is it waiting for? Counter is still '
  'zero, so the answer to the question never changes.&rdquo;',
  'Show them the stop button once. Then, on the same card, the second change: put the line back, '
  'and move it above print(a).',
  'Take the difference from the room: &ldquo;same three numbers? No, what changed?&rdquo;'],
  ['Short of time: take change 1 only. It is the one the four common mistakes card comes back to.',
   'Two panels, not three: change 1 and change 2 are on one card, with one timer for both. '
   'Read change 1 out, wait, then point at change 2. Do not let them do both at once.',
   'Know where the stop button is in your playground before the session.',
   'They meet the fourth common mistake here by doing it. The card that names it comes after the '
   'worksheet hunt, not before.'],
  'Moving the update above print(a) prints 6, 7, 8 still, counter is not printed. The '
  'lesson is that <em>order inside the body</em> matters for what prints, not for how many passes.'))
G.append(g(21, W('Worksheet 3', 4, 21, 'worksheet task 3'), 'Find the mistake', [
  'Open from what they just did: &ldquo;you broke updation on purpose. Here are three programs '
  'somebody broke by accident.&rdquo;',
  'Worksheet task 3. Say the shape of it once: three programs, one thing wrong in each.',
  'Say the three things they type: which line is wrong, or, if something is simply '
  '<em>missing</em>, what is missing and where it should go. Then which part it is, then '
  'what happens when you run it. Read the inputs off the sheet: 5, then 10, then 1.',
  'Press play. Three minutes. Worksheet tab only, say why: running them answers the '
  'question for free.',
  'Walk the rows. &ldquo;Which part is that? Say the word&rdquo; &middot; &ldquo;program 3 is '
  'the sneaky one, count the yeses&rdquo;.',
  'Hands off keyboards. Do not take the answers here, the next four cards are the answers, '
  'one at a time.'],
  ['Short of time: two minutes on the timer, and say program 3 is the one to look at twice.',
   'Press play on the timer.',
   'Program 1 is the one where no line is wrong. That is deliberate, and it is why the task '
   'also asks what is missing.',
   '<b>Two of the three are the initialization</b>: program 1 has none at all, and program 3 has '
   'one with the wrong value in it. Do not claim they are three different parts, because they are '
   'not. Say it at the reveal instead: the same part can be missing or simply wrong.',
   'Worksheet tab only. If somebody runs program 2 they freeze a tab, and you lose the reveal.',
   'Answers, for you only: program 1 has no initialization; program 2 stores the answer of '
   'the condition in a box; program 3 starts the counter at 1 and runs twice, not three times.'],
  'Program 3 is the one most of them will mark correct. That is the finding, and it is worth '
  'saying out loud when the reveal comes.'))
G.append(g(22, W('Reveal 1 of 4', '60', 22, blk=4), 'Missing initialization', [
  'Program 1 first. Ask for hands before you show anything: &ldquo;who typed that a line is '
  'missing?&rdquo;',
  'Then reveal, and read the error text out exactly: name counter is not defined.',
  'Ask them to name the part: &ldquo;which of the three is missing?&rdquo; Take the word from the '
  'room, not from you.',
  'Say the rule they can use in an exam: &ldquo;if you ever see that error under a while loop, '
  'look <em>above</em> the loop, not inside it.&rdquo;',
  'One extra beat worth twenty seconds: &ldquo;notice it did not loop forever. It did not loop at '
  'all, it stopped before the first pass.&rdquo;'],
  ['Short of time: read the error text and move on.',
   'Sixty seconds. It is the easy one of the four.'],
  'Students often read NameError as a typo. Say plainly it is not spelling, the line that '
  'creates the variable is simply not there.'))
G.append(g(23, W('Reveal 2 of 4', '70', 23, blk=4), 'A condition stored in a box', [
  'Program 2. Hands first: &ldquo;who said line 3? Who said line 4?&rdquo; Both are '
  'defensible, so say so.',
  'Read line 3 aloud very slowly: condition equals, bracket, counter less than three, bracket.',
  'Ask the one question and then stop talking: &ldquo;what gets stored in condition, the '
  'question, or the answer?&rdquo;',
  'Now the card: the answer, True, stored once. Line 4 asks the box, not the counter. The last '
  'line keeps changing counter, and nothing ever looks at counter again.',
  'Name it: <em>infinite loop</em>. Then connect it back: &ldquo;same ending as when you deleted '
  'the update line. Different cause.&rdquo;'],
  ['Seventy seconds. This is the hard one of the four.',
   'Call the variable &ldquo;the box called condition&rdquo; every time, or the sentence becomes '
   'unparseable.'],
  'Two different causes, one symptom. If a student conflates them, ask: &ldquo;which line was '
  'wrong in each?&rdquo;'))
G.append(g(24, W('Reveal 3 of 4', '70', 24, blk=4), 'Off by one', [
  'Program 3, and ask the honest question: &ldquo;how many of you marked this one '
  'correct?&rdquo; Count the hands. It will be most of the room.',
  'Point at the output: input is 1, three numbers were wanted, two came out.',
  'Walk the counter out loud with them: starts at 1, so 1 yes, 2 yes, 3 no. Two passes.',
  'Give them both repairs: start at 0 and keep less than 3, or start at 1 and use less than 4. '
  'Ask which they prefer and why.'],
  ['Short of time: take the count of hands and give one repair, not both.',
   'This is the mistake that will cost them marks in an exam. Say that out loud.',
   'The deck heads this card <em>Incorrect Termination Condition</em> and the reveal before it '
   'as well. Say why both names are defensible: the counter starts in the wrong place, so you can '
   'repair it at the start or at the test, and there is nothing to choose between them.',
   'Seventy seconds, and the count of hands at the start is the point of it.'],
  'Anyone who says &ldquo;just change it to 4&rdquo; is right and should be asked to say why it '
  'works, that is the understanding you want.'))
G.append(g(25, W('Reveal 4 of 4', '50', 25, blk=4), 'Not updating the counter', [
  'This one they already met, on their own laptops. Ask first: &ldquo;which of you made this '
  'happen twenty minutes ago?&rdquo;',
  'Point at the missing line, then at the words on the right: the counter never changes, so the '
  'answer to the question never changes.',
  'Close the whole set: &ldquo;initialization, termination condition, updation. You have now '
  'broken all three and seen what each one costs, an error before it starts, the wrong '
  'number of passes, and a loop that never stops.&rdquo;'],
  ['Short of time: say it in a sentence without putting the card up. They already met it.',
   'Fifty seconds. It is a naming card, not a new idea, they did the discovery already.',
   'If you are short of time, this is the one reveal you can say in a sentence without putting '
   'the card up.'],
  'A room that says &ldquo;that is the same as program 2&rdquo; is close but not right. Ask '
  'which line is wrong in each; the answers are different lines.'))

G.append('<h3 class="ghd">Hard floor: the exit runs whatever else is dropped. It is the only beat that is never cut.</h3>')
G.append(g(26, W('Concept', '90', 26, blk=8), 'The square pattern', [
  'Read the question off the card: stars in N rows and N columns.',
  'Point at the output and say the thing that costs marks: there is a space after every star.',
  'Give them the shortcut they already own: &ldquo;which string operation gives you a star and a '
  'space, n times?&rdquo; Take string repetition from the room.',
  'Ask, and hold the answer: &ldquo;which part repeats, the row, or the star?&rdquo; They '
  'decide it at the keyboard.'],
  ['Short of time: say the space rule and hand over. Do not take the row-or-star question.',
   'Do not code this on screen. They write it.',
   'Say the space rule twice. It is the single most common reason a correct program fails a test '
   'case here. If nobody recalls string repetition, write "* " * 3 on the board and let them '
   'read it.'],
  'A room that says &ldquo;both&rdquo; is ahead of the syllabus, tell them they are right, '
  'and that the inner one has a shortcut today.'))
G.append(g(27, W('Hands-on', 5, 27, blk=8), 'Write it in the playground', [
  'Laptops open, playground open, blank file. Only the input line is on screen; everything after '
  'it is theirs.',
  'Before anybody types, take one answer out loud: &ldquo;n is 3. How many times does the print '
  'line have to run?&rdquo; Three. That is their termination condition, and now they know it.',
  'Press play. Four and a half minutes. Walk the rows continuously, &ldquo;are you guys '
  'done?&rdquo; &middot; &ldquo;show me your three parts&rdquo; &middot; &ldquo;run it with '
  '5&rdquo;.',
  'For anyone stuck, ask the three words, do not give code: &ldquo;where is your '
  'initialization?&rdquo;',
  'Last ninety seconds: everybody runs it with 3, then 5, then 1.'],
  ['Short of time: three minutes on the timer, and run it with 3 only.',
   'Press play on the timer.',
   'Nothing goes on the worksheet for this one, they type it. The prediction happens out '
   'loud before the laptops open.',
   'Do not put a solution on screen while they work.'],
  'The common bug is counter less than 3 hard-coded instead of counter less than n, it '
  'passes their first test and fails the second. Let them find it with input 5.'))
G.append(g(28, W('Concept', '60', 28, blk=8), 'The solution', [
  'Up on screen only after the timer has run out.',
  'Read it against their three words: initialization, termination condition using n, the block, '
  'updation.',
  'Point at the line that does the work: print of star-space times n, inside a loop that runs n '
  'times. &ldquo;The star repeats across with the string. The row repeats down with the '
  'loop.&rdquo;',
  'Ask for hands: &ldquo;who got the same three parts, even if your variable names are '
  'different?&rdquo;'],
  ['Short of time: ask for hands on the three parts and skip the line-by-line read.',
   'Do not retype it. Compare it to what is already on their screens.',
   'A student who stored the row in a variable first is also correct, say so out loud.'],
  'Anyone whose program works for 4 but not 5 hard-coded the number. Name the symptom, not the '
  'student.'))
G.append(g(29, W('Exit', 4, 29), 'One question, and it is hard', [
  'Frame it as a real thing: &ldquo;a name-board app prints one letter per line. Somebody types a '
  'single letter.&rdquo;',
  'Read the code once, by line number. Then stop talking and press play on the timer. Two and a '
  'half minutes, silent.',
  'Vote by hands, option by option. Count every option out loud.',
  'Reveal. Walk it: length is 1, so the question is 0 less than 0, which is False the first time. '
  'The body never runs.',
  'Name each wrong option: 1 is &ldquo;a loop must run at least once&rdquo;, 3 is &ldquo;I saw an '
  'index and expected an index error&rdquo;, 4 is &ldquo;I saw a while and expected '
  'forever&rdquo;.',
  'Tie it to the recap: &ldquo;first thing this morning you saw a program that should print '
  'nothing. Same idea, harder question.&rdquo;'],
  ['Press play on the timer. It does not start by itself.',
   '<code>a[counter]</code> picks the letter at that position. If anyone asks, say that and '
   'move on: the answer does not depend on it, because the body never runs.',
   'This runs even if everything else is cut. It is the hard floor.'],
  'A big vote for option 1 is the finding worth carrying into the next session: they still believe '
  'a loop body always runs once.'))
G.append(g(30, W('Takeaways', 3, 30), 'The map, one press at a time', [
  'Do not read it out. Ask for it. Press 1 gives them the word loops; then ask &ldquo;and how '
  'many kinds did we see?&rdquo; before press 2.',
  'Press 2: while and for. One line only, &ldquo;today was this one. The other one comes '
  'in a later session.&rdquo;',
  'Presses 3 to 6 rebuild the block diagram, one band at a time. Ask for each word before you '
  'press: &ldquo;what goes above the loop? What goes on the while line? What goes at the bottom '
  'of the body?&rdquo;',
  'Press 6 also draws the arrow back up. Point at it: &ldquo;and that is the bit that surprised '
  'you, it asks again.&rdquo;',
  'Press 7 is three different endings, not one. Take them one at a time: &ldquo;leave out the '
  'initialization, what did program 1 do?&rdquo; It stopped with an error. &ldquo;Get the '
  'condition wrong?&rdquo; Wrong count, or none. &ldquo;Leave out the updation?&rdquo; Never '
  'stops.'],
  ['Short of time: presses 1, 2 and 7. The block diagram is on slide 24 already.',
   'Seven presses. Arrow keys work in presenter view.',
   'Do not let the last box be read as one sentence. The three parts fail in three different ways, '
   'and that distinction is the whole card.'],
  'They should be able to produce all three words unprompted. If they cannot, that is what opens '
  'the next session.'))
G.append(g(31, W('Closing', 1, 31), 'Feedback', [
  'Put it up while they are still packing, and say where the form is: &ldquo;the feedback link is '
  'under today&rsquo;s session. Thirty seconds, and it is anonymous.&rdquo;',
  'Ask for one specific thing rather than a rating: &ldquo;tell me the one minute of today that '
  'was too fast.&rdquo;'],
  ['Twenty seconds. Do not read the form out.',
   'Say it before they stand up, not after.'],
  'Nothing to watch. If nobody fills it in, ask two students at the door instead.'))
G.append(g(32, W('Closing', 1, 32), 'Thank you', [
  'Last card, and one sentence: &ldquo;in a later session, the for loop, the same parts, '
  'written in one line.&rdquo;',
  'Then let them go.'],
  ['Ten seconds. Do not start a new idea on this card.'],
  'Nothing. Watch the door instead.'))

guide = ('<div id="guide-view"><h1 class="g-h1">Instructor guide</h1>'
         '<p class="g-meta">One entry per slide, in the order you will present them. '
         'Screen only, it is not designed to print.</p>'
         + ''.join(G)
         + '<h3 class="ghd">Common guidelines</h3>'
         '<section class="g-sec"><h3>Things true of every slide</h3>'
         '<h4>Never start a slide cold</h4>'
         '<p>Every slide opens from something the room already has, the worksheet on their '
         'screen, the program they just ran, the answer somebody just gave. If a slide feels '
         'abrupt, the fix is one sentence at the end of the <em>previous</em> slide, not a longer '
         'explanation on this one.</p>'
         '<h4>Walk it in steps, and check as you go</h4>'
         '<p>Do not deliver a finished explanation. Say one step, then ask the next as a question '
         '&ldquo;so counter is 3 now. Is 3 less than 3? No, right? Good.&rdquo; If the room '
         'does not answer, you have found the gap for free. Offer doubts out loud, often; it costs '
         'four seconds.</p>'
         '<h4>How every poll runs</h4>'
         '<p>Let them read and think first. Then count the hands <em>option by option</em>, out '
         'loud, including the options nobody picked. Say once, at the start of the session, that a '
         'closed fist means &ldquo;not sure&rdquo; and that it is a real answer you want to see. '
         'Reveal. Then explain <em>every</em> option, not just the right one, the wrong ones '
         'are where the misconceptions live.</p>'
         '<h4>Picking students</h4>'
         '<p>Call a row or a side of the room, never a name. Rotate which group you call. Never '
         'name a student who got something wrong, and never say whose screen you are looking at.</p>'
         '<h4>When nobody answers</h4>'
         '<p>Count ten seconds in your head. Then narrow the question rather than answering it: '
         '&ldquo;point at the line that repeats&rdquo; is answerable when &ldquo;what do you '
         'notice?&rdquo; is not.</p>'
         '<h4>Why they commit before they run</h4>'
         '<p>It was never really about where they write it down, it is that a student has to commit '
         'to an answer '
         'before the machine hands them one. The worksheet is where they commit; the playground is '
         'where they find out. A student who predicts and then runs it discovers they were wrong; '
         'a student who runs it first discovers nothing, because the machine answered before they '
         'had a position. So: worksheet tab only on a worksheet beat, and the playground shut. The '
         'one beat that has no worksheet task is the square pattern, and there the prediction is '
         'taken out loud before any playground opens.</p>'
         '<h4>Say the three words in full, every time</h4>'
         '<p><em>Initialization</em>, <em>termination condition</em>, <em>updation</em>. Not '
         '&ldquo;the first bit&rdquo;, not &ldquo;the check&rdquo;, not &ldquo;the plus one&rdquo;. '
         'They are named once, properly, on the build card. Everything after that, the '
         'sheet, the mistake hunt and the map, assumes the room has the words. Write all three '
         'on the board as they arrive and leave them there.</p>'
         '<h4>The counts are the understanding</h4>'
         '<p>For the program on the build card, initialization runs once, the condition is asked '
         '<em>four</em> times, and the block and the updation run three times each. The four is '
         'the number that tells you whether a student has understood the back edge. Ask for it '
         'more than once: on press 5 of the build, again on the dot, again if it comes up on the '
         'sheet.</p>'
         '<h4>Two words that mean different things today</h4>'
         '<p>Say <em>&ldquo;the termination condition&rdquo;</em> for the test on the while line, '
         'and <em>&ldquo;the counter&rdquo;</em> for the variable. Never say &ldquo;the '
         'value&rdquo; for either. In program 2 of the mistake hunt there is also a <em>variable '
         'named</em> condition, call that one &ldquo;the box called condition&rdquo; every '
         'time, or the sentence becomes unparseable.</p>'
         '<h4>Reading the room</h4>'
         '<p>Still typing after the timer means the task was too long, take the next '
         'one down by a minute. A room on the worksheet tab and nothing else is the beat working. '
         'Nobody '
         'looking up during a hands-on means they are stuck, not busy; walk and look. A student '
         'rerunning the same code unchanged has not read the error. Laughter on the break-it beat '
         'is the beat landing.</p>'
         '<h4>If you are short of time</h4>'
         '<p>Take the mistake hunt down from three minutes of writing to two and go straight to '
         'the reveals. Say reveal 4 in a sentence instead of putting the card up. Shorten the '
         'square-pattern beat from four and a half minutes to three before you touch anything '
         'else. Never drop the exit question, the build card, the classify panel or the dot, and '
         'never drop the classroom quiz: it is the portal record for the session.</p>'
         '</section>'
         '<section class="g-sec"><h3>If they ask</h3><ul class="brief">'
         '<li><b>&ldquo;Can I use a for loop instead?&rdquo;</b> Not today. The for loop has its '
         'own session; today the point is the three lines you have to write yourself.</li>'
         '<li><b>&ldquo;Which is better, while or for?&rdquo;</b> Neither. You pick by what you '
         'are counting, and you will be able to choose once you have both.</li>'
         '<li><b>&ldquo;Does the counter have to be called counter?&rdquo;</b> No. Call it i, or '
         'count, or anything. The name has no meaning to Python.</li>'
         '<li><b>&ldquo;Can the counter go down instead of up?&rdquo;</b> Yes, start at 3 '
         'and use counter &gt; 0 with counter = counter - 1. Same three parts.</li>'
         '<li><b>&ldquo;What if the condition is never False?&rdquo;</b> The program runs until you '
         'stop it. That is the infinite loop, and it is not an error message, nothing is '
         'wrong as far as Python is concerned.</li>'
         '<li><b>&ldquo;Why is print("End") not indented?&rdquo;</b> Same rule as yesterday: the '
         'indent says which block a line belongs to. Outdented means it is outside the loop, so it '
         'runs once, after.</li>'
         '<li><b>&ldquo;My infinite loop froze the playground.&rdquo;</b> Stop button beside Run. '
         'If the tab is unresponsive, reload it, the code is saved.</li>'
         '</ul></section>'
         + ANSWER_TABLE + SOURCE_DEFECTS + '</div>')

# ==================================================================== WORKSHEET
# One self-contained HTML document the students download and type into. No
# pages, no printer. Circling with a pen becomes typing the line number: the
# commitment is identical, and it survives being emailed to whoever was absent.
FILES = file_names(SESSION)      # 12_loops_student_view.html and its two siblings
WS_FILENAME = FILES['student_handout']

WS_CSS = R('parts/ws.css')
WS_JS = R('parts/ws.js')

def wtask(n, head, instr, body=''):
    return (f'<section class="task"><div class="task-hd"><span class="badge">{n}</span>'
            f'<span class="h">{head}</span></div>'
            f'<p class="task-instr">{instr}</p>{body}</section>')

def wcode(text):
    return f'<pre>{text}</pre>'

def work(label, rows=4):
    return (f'<label class="fld"><span>{label}</span>'
            f'<textarea rows="{rows}" spellcheck="false"></textarea></label>')

def line(label):
    return (f'<label class="fld"><span>{label}</span>'
            '<input type="text" autocomplete="off" spellcheck="false"></label>')

def grid(cols, rows):
    h = ''.join(f'<th>{c}</th>' for c in cols)
    body = ''
    for r in rows:
        body += '<tr>' + ''.join(
            '<td><input type="text" autocomplete="off"></td>' if c is None
            else f'<td>{c}</td>' for c in r) + '</tr>'
    return f'<table class="grid"><tr>{h}</tr>{body}</table>'

T1 = wtask(1, 'Ten numbers, the long way',
  'This program prints the next <b>three</b> consecutive numbers of the input. The question has '
  'changed: it now asks for the next <b>ten</b>. Type the lines you would add in the box, then '
  'fill in the two counts. Playground closed for this one.',
  wcode('a = int(input())\n'
        'a = a + 1\n'
        'print(a)\n'
        'a = a + 1\n'
        'print(a)\n'
        'a = a + 1\n'
        'print(a)')
  + work('The lines you would add: write as many as it takes', rows=7)
  + grid(['How long is the program?', 'lines'],
         [['My program for TEN numbers is', None],
          ['and for ONE HUNDRED numbers it would be', None]]))

T2 = wtask(2, 'Which part is this line?',
  'Two programs you have not seen. For each line below type one letter: <b>I</b> for '
  'initialization, <b>T</b> for termination condition, <b>U</b> for updation.',
  wcode('Program A\n'
        '1   marks = int(input())\n'
        '2   counter = 1\n'
        '3   while counter &lt;= 5:\n'
        '4       print(marks)\n'
        '5       marks = marks - 2\n'
        '6       counter = counter + 1\n'
        '7   print("Done")')
  + wcode('Program B\n'
          '1   name = input()\n'
          '2   seats = 3\n'
          '3   while seats &gt; 0:\n'
          '4       print(name)\n'
          '5       seats = seats - 1\n'
          '6   print("Full")')
  + grid(['Line', 'I, T or U'],
         [['A, line 2 &nbsp; counter = 1', None],
          ['A, line 3 &nbsp; while counter &lt;= 5:', None],
          ['A, line 6 &nbsp; counter = counter + 1', None],
          ['B, line 2 &nbsp; seats = 3', None],
          ['B, line 3 &nbsp; while seats &gt; 0:', None],
          ['B, line 5 &nbsp; seats = seats - 1', None]])
  + line('How many times does line 4 of Program A run?'))

M1 = ('1   a = int(input())\n'
      '2   while counter &lt; 3:\n'
      '3       a = a + 1\n'
      '4       print(a)\n'
      '5       counter = counter + 1\n'
      '6   print("End")')
M2 = ('1   a = int(input())\n'
      '2   counter = 0\n'
      '3   condition = (counter &lt; 3)\n'
      '4   while condition:\n'
      '5       a = a + 1\n'
      '6       print(a)\n'
      '7       counter = counter + 1')
M3 = ('1   a = int(input())\n'
      '2   counter = 1\n'
      '3   while counter &lt; 3:\n'
      '4       a = a + 1\n'
      '5       print(a)\n'
      '6       counter = counter + 1\n'
      '7   print("End")')

T3 = wtask(3, 'Find the mistake',
  'All three are meant to print the next <b>three</b> consecutive numbers of the input. Every one '
  'of them is broken. For each, say which line is wrong, or, if something is simply <b>not '
  'there</b>, say what is missing and where it should go. <b>Do not run them.</b>',
  '<p class="task-instr"><b>Program 1</b> &nbsp;&middot;&nbsp; input is 5</p>' + wcode(M1)
  + '<p class="task-instr"><b>Program 2</b> &nbsp;&middot;&nbsp; input is 10</p>' + wcode(M2)
  + '<p class="task-instr"><b>Program 3</b> &nbsp;&middot;&nbsp; input is 1</p>' + wcode(M3)
  + grid(['', 'Which line is wrong, or what is missing?', 'Which part?',
          'What happens when you run it?'],
         [['Program 1', None, None, None],
          ['Program 2', None, None, None],
          ['Program 3', None, None, None]]))

WS_BODY = T1 + T2 + T3

WORKSHEET = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
             '<meta name="viewport" content="width=device-width,initial-scale=1">'
             '<title>Loops worksheet</title>'
             f'<style>{WS_CSS}</style></head><body>'
             '<div class="ws">'
             '<div class="ws-band"><h1>Loops</h1>'
             '<p>Programming Foundations &middot; Session 12</p></div>'
             '<div class="ws-who">'
             '<label>Name<input type="text" autocomplete="off"></label>'
             '<label>Roll no.<input type="text" autocomplete="off"></label>'
             '</div>'
             f'{WS_BODY}'
             '<p class="ws-foot">Nothing here is collected. Keep the file.</p>'
             '</div><div class="ws-save">saved</div>'
             f'<script>{WS_JS}</script></body></html>')

# a literal closing script tag in the payload would end the host element early
WS_EMBED = WORKSHEET.replace('</script>', '<\\/script>')

handout = ('<div id="handout-view">'
           '<h1 class="g-h1">Student worksheet</h1>'
           '<div class="h-actions">'
           '<button type="button" id="download-worksheet">Download the worksheet</button>'
           '<span>Saves one HTML file. Students open it and type into it.</span>'
           '</div>'
           '<iframe id="ws-frame" title="Student worksheet preview"></iframe>'
           '<p class="ws-note">This preview is the downloaded file byte for byte. '
           'Typing into it here changes nothing that ships.</p>'
           f'<script type="text/plain" id="ws-src" data-filename="{WS_FILENAME}">'
           f'{WS_EMBED}</script></div>')

# ===================================================================== ASSEMBLE
EXTRA_CSS = R('parts/extra.css')
EXTRA_JS = R('parts/extra.js')

ONE_IDEA = ('A while loop has three controlling lines in three different places, the '
            '<em>initialization</em> before it sets the counter, the <em>termination condition</em> '
            'on the loop line is asked again before every pass, and the <em>updation</em> inside '
            'the body changes what that condition looks at. Miss the first and the program stops '
            'with an error; get the second wrong and it runs the wrong number of times, or none at '
            'all; miss the third and it never stops.')

# ===================================================================== ASSEMBLE
# Three files, none of which links to the others. The worksheet goes to the
# students; the guide does not; a stray href between them is how a class finds
# the answers.
#
# The order below is not arbitrary. The guide's thumbnails are photographs of
# the presenter, so the presenter is written first and the pictures are taken
# from THAT file, in this same run. The guide entries were built further up,
# before any of it existed, so each one left a @@Tn@@ token where its picture
# goes; the tokens are filled in below.
import subprocess

OUTDIR = (pathlib.Path(sys.argv[sys.argv.index('-o') + 1]) if '-o' in sys.argv
          else pathlib.Path(HERE).parent.parent / 'Plans' / 'Programming Foundations' / SESSION)
OUTDIR.mkdir(parents=True, exist_ok=True)
PRESENTER = FILES['student_view']
GUIDE = FILES['instructor_guide']
WORKSHEET_FILE = FILES['student_handout']

# ---- 1. the presenter -----------------------------------------------------
tpl = R('plan-template.html')

# Every repair this builder used to apply at build time is now fixed in the
# skill's own assets/plan-template.html (see assets/repair_template_v3_2.py).
# These asserts are the receipt: if a template regresses the build stops here,
# rather than shipping a plan whose confetti never fires.
assert tpl.count('</style>') == 1, 'the stray </style> splice is back'
assert tpl.count('id="env-warn"') == 1, 'the duplicate sidebar is back'
assert 'var calm' in tpl, 'the reduced-motion flag is missing again'
assert '#confetti{position:fixed' in tpl, 'the #confetti rule is missing again'
assert 'hkGo' not in tpl, "session 11's hook controller is back"
assert 'willShow' in tpl, 'the reveal handler reads the pre-press state again'
assert '.partmap' in tpl and '.exgrid' in tpl and '.titlecard' in tpl, \
    'the shared staged-card CSS is missing from the template'
assert '{{GUIDE}}' not in tpl and '{{HANDOUT}}' not in tpl, \
    'this template still expects the guide and the worksheet inside it'

presenter = (tpl.replace('{{SESSION_TITLE}}', 'Loops, Session 12')
                .replace('{{EXTRA_CSS}}', EXTRA_CSS + SPINE_CSS.replace(
                    'position:absolute;inset:0;',
                    'position:absolute;top:0;right:0;bottom:0;left:0;'))
                .replace('{{EXTRA_JS}}', EXTRA_JS + SPINE_JS)
                .replace('{{ONE_IDEA}}', ONE_IDEA)
                .replace('{{NAV}}', nav)
                .replace('{{BLOCKS}}', blocks))
assert '{{' not in presenter, 'unfilled placeholder in the presenter'
assert presenter.count('<div class="slide"') + presenter.count('<div class="pcard"') == NCARDS, \
    'card count is not %d' % NCARDS
p_path = OUTDIR / PRESENTER
p_path.write_text(presenter, encoding='utf-8')

# ---- 2. the pictures, from the presenter this run just wrote --------------
THUMBS = pathlib.Path(HERE) / 'work' / 'thumbs'
if '--no-thumbs' not in sys.argv:
    subprocess.run([sys.executable, str(SKILL / 'scripts' / 'render_thumbs.py'),
                    str(p_path), str(THUMBS)], check=True)
SHOTS = sorted(THUMBS.glob('card*.webp'))
assert len(SHOTS) == NCARDS, '%d thumbnails for %d cards' % (len(SHOTS), NCARDS)

# ---- 3. the guide, with the tokens filled in ------------------------------
gtpl = (SKILL / 'assets' / 'guide-template.html').read_text(encoding='utf-8')
guide_doc = (gtpl.replace('{{SESSION_TITLE}}', 'Loops, Session 12')
                 .replace('{{EXTRA_CSS}}', GUIDE_CSS)
                 .replace('{{GUIDE}}', guide))
for i, shot in enumerate(SHOTS, 1):
    b64 = base64.b64encode(shot.read_bytes()).decode()
    # no loading="lazy": the bytes are already in this file, so deferring them
    # buys nothing and leaves the guide blank as an instructor scrolls it
    img = '<img alt="" src="data:image/webp;base64,%s">' % b64
    token = '@@T%d@@' % i
    assert token in guide_doc, 'no guide entry for card %d' % i
    guide_doc = guide_doc.replace(token, img)
assert '@@T' not in guide_doc, 'a guide entry never got its picture'
assert '{{' not in guide_doc, 'unfilled placeholder in the guide'
(OUTDIR / GUIDE).write_text(guide_doc, encoding='utf-8')

# ---- 4. the worksheet -----------------------------------------------------
(OUTDIR / WORKSHEET_FILE).write_text(WORKSHEET, encoding='utf-8')

for f in (PRESENTER, GUIDE, WORKSHEET_FILE):
    print('%-28s %8.0f KB' % (f, (OUTDIR / f).stat().st_size / 1024))
