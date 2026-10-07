#!/usr/bin/env python3
"""Builder for the session 12 (Loops) plan, v3 shape. Change this, regenerate; never hand-edit the HTML."""
import base64, html, re
from pathlib import Path

ROOT = Path(r"C:\Lesson Plans New")
SKILL = Path(r"C:\Users\Nxtwave\.claude\skills\lesson-plan\assets")
SCRATCH = Path(r"C:\Users\Nxtwave\AppData\Local\Temp\claude\C--Lesson-Plans-New\119caa67-cf0b-4591-9131-49d951381e46\scratchpad")
SH = SCRATCH / "w12" / "slides"
OUT = ROOT / "Plans" / "Programming Foundations" / "12-loops-plan.html"
HOOK_SVG = (ROOT / "Done" / "build-12-loops" / "hook_svg.txt").read_text(encoding="utf8")

TITLE = "Loops"
COURSE = "CCBP 4.0 &middot; Session 12"

# plan slide number -> original deck slide
SRC = {1: 1, 2: 2, 3: 8, 4: 11, 5: 13, 6: 14, 7: 17, 8: 21, 9: 23, 10: 27, 11: 39, 12: 45, 13: 46, 14: 47, 15: 50, 16: 51}

# ---------------------------------------------------------------- helpers
def img(n, title):
    b64 = base64.b64encode((SH / f"sl{SRC[n]}.webp").read_bytes()).decode()
    return (f'<div class="slide-img"><img alt="{html.escape(f"Slide {n}: {title}")}" '
            f'src="data:image/webp;base64,{b64}"></div>')

def brief(items):
    if not items: return ''
    assert len(items) <= 5, f"note block has {len(items)} lines"
    out = []
    for t in items:
        cls = ' class="hot"' if t.startswith('!') else ''
        out.append(f'<li{cls}>{t.lstrip("!")}</li>')
    return '<ul class="brief">' + ''.join(out) + '</ul>'

def slide(n, title, items=()):
    return ('<div class="slide"><div class="slide-head">'
            f'<span class="slide-no">Slide {n}</span>'
            f'<span class="slide-title">{title}</span></div>'
            f'{img(n, title)}{brief(items)}</div>')

def block(bid, icon, h2, inner, cls=''):
    return (f'<section class="block {cls}" id="{bid}">'
            f'<div class="block-head"><span class="block-icon" aria-hidden="true">{icon}</span>'
            f'<h2>{h2}</h2></div>{inner}</section>')

def run(items):
    return ('<details class="prep"><summary>Instructor &mdash; how to run this</summary>'
            f'<div class="prep-body">{brief(items)}</div></details>')

def key(tbl):
    return ('<details class="prep"><summary>Answer key</summary>'
            f'<div class="prep-body">{tbl}</div></details>')

def slhead(eyebrow, title):
    return ('<div class="sl-head"><span class="sl-bar" aria-hidden="true"></span><div>'
            f'<p class="sl-eyebrow">{eyebrow}</p><h3 class="sl-title">{title}</h3></div></div>')
RULE = '<div class="stage-rule" aria-hidden="true"></div>'

def ctl():
    return ('<div class="stage-ctl"><button type="button" data-stage-prev>Back</button>'
            '<button type="button" data-stage-next>Next</button>'
            '<span class="ctl-count"></span></div>')

def pcard(lbl, inner, sheet=None, animated=None, activity=None):
    ref = f'<span class="slide-src">worksheet {sheet}</span>' if sheet else ''
    an = f' data-animated="{animated}"' if animated else ''
    ac = f' data-activity="{activity}"' if activity else ''
    return (f'<div class="pcard" data-label="{lbl}"{an}{ac}><div class="slide-head">'
            f'<span class="slide-title">{lbl}</span>{ref}</div>{inner}</div>')

def step(lbl, q, code='', note='', ans='', on=False, extra=''):
    c = f'<pre class="slabcode">{code}</pre>' if code else ''
    nt = f'<p class="stage-note">{note}</p>' if note else ''
    a = (f'<p class="ans">{ans}</p>'
         '<div class="stage-ctl"><button type="button" data-reveal="Reveal">Reveal</button></div>') if ans else ''
    return (f'<div class="stage-step{" on" if on else ""}" data-label="{lbl}">'
            f'<p class="stage-q">{q}</p>{c}{extra}{a}{nt}</div>')

def qstep(lbl, q, code, opts, ans, on=False, note=''):
    o = ''.join(f'<li data-k="{k}">{v}</li>' for k, v in opts)
    c = f'<pre class="slabcode">{code}</pre>' if code else ''
    nt = f'<p class="stage-note">{note}</p>' if note else ''
    return (f'<div class="stage-step{" on" if on else ""}" data-label="{lbl}">'
            f'<p class="stage-q">{q}</p>{c}<ul class="vopts">{o}</ul>'
            f'<p class="ans">{ans}</p>'
            '<div class="stage-ctl"><button type="button" data-reveal="Reveal answer">Reveal answer</button></div>'
            f'{nt}</div>')

def stage(sid, eyebrow, title, steps, controls=True):
    return (f'<div class="stage" id="stage-{sid}">' + slhead(eyebrow, title) + ''.join(steps)
            + (ctl() if controls else '') + RULE + '</div>')

def cp(n, text):
    return f'<p class="note"><b>Checkpoint {n}.</b> {text}</p>'

# ---------------------------------------------------------------- programs (all outputs verified by running, see check_code.py)
PROG = ('a = <i>int</i>(<i>input</i>())\n'
        'counter = 0\n'
        '<b>while</b> counter &lt; 3:\n'
        '    a = a + 1\n'
        '    <i>print</i>(a)\n'
        '    counter = counter + 1\n'
        '<i>print</i>(<em>"End"</em>)')
PROG_NUM = ('1  a = <i>int</i>(<i>input</i>())\n'
            '2  counter = 0\n'
            '3  <b>while</b> counter &lt; 3:\n'
            '4      a = a + 1\n'
            '5      <i>print</i>(a)\n'
            '6      counter = counter + 1\n'
            '7  <i>print</i>(<em>"End"</em>)')
PROG_BLANK = ('a = <i>int</i>(<i>input</i>())\n'
              'counter = 0\n'
              '<b>while</b> ____________:\n'
              '    a = a + 1\n'
              '    <i>print</i>(a)\n'
              '    counter = counter + 1\n'
              '<i>print</i>(<em>"End"</em>)')

# ================================================================ BEATS
# 1 Opening ------------------------------------------------------------
opening = block('opening', '&#128206;', 'Opening &mdash; Slides 1&ndash;2',
    slide(1, 'Welcome', [
        'Take attendance while this is up. Notice what you do for each student &mdash; you will use it in five minutes.',
        '!Hand out the worksheet now, one set each, face down. The discovery writes on its blank side.',
        'Say nothing about the topic.']) +
    slide(2, 'Title &mdash; Loops', [
        'Read the title, go straight to the poll.']))

# 2 Warm-Up Poll -------------------------------------------------------
poll_stage = stage('poll', 'Recap &middot; Last Session', 'Quick Check', [
    qstep('Q1', 'What does this print? Fingers 1&ndash;4, fist if unsure, all together on three.',
          'marks = 85\n<b>if</b> marks &gt;= 91:\n    <i>print</i>(<em>"A"</em>)\n<b>elif</b> marks &gt;= 81:\n    <i>print</i>(<em>"B"</em>)\n<b>elif</b> marks &gt;= 71:\n    <i>print</i>(<em>"C"</em>)',
          [(1, 'B'), (2, 'B then C'), (3, 'A'), (4, 'nothing')],
          '<b>1 &mdash; B.</b> An elif is asked only after the one above said no. Once B matches, C is never asked.', on=True),
    qstep('Q2', 'And this one? Fingers on three.',
          'a = 5\n<b>if</b> a &gt; 3:\n    <i>print</i>(<em>"X"</em>)\n<b>if</b> a &gt; 1:\n    <i>print</i>(<em>"Y"</em>)',
          [(1, 'X'), (2, 'Y'), (3, 'X then Y'), (4, 'nothing')],
          '<b>3 &mdash; X then Y.</b> Two separate ifs, both at column zero, both always asked. Make line 4 an elif and Y disappears.'),
    qstep('Q3', 'And this? Fingers on three.',
          'marks = 55\n<b>if</b> marks &gt;= 61:\n    <i>print</i>(<em>"D"</em>)\n<b>else</b>:\n    <i>print</i>(<em>"F"</em>)\n<b>elif</b> marks &gt;= 51:\n    <i>print</i>(<em>"E"</em>)',
          [(1, 'F'), (2, 'E'), (3, 'a SyntaxError, nothing prints'), (4, 'F then E')],
          '<b>3 &mdash; SyntaxError, and nothing prints at all.</b> A rung after the else breaks the shape, so Python never starts the file. You built this one yourselves last session.'),
])
poll = block('poll', '&#9889;', 'Warm-Up Poll &mdash; three from session 11',
    pcard('Warm-Up Poll &mdash; three from last session', poll_stage + run([
        'Signal, announced once: fingers for the option, closed fist for unsure, everyone on "three".',
        '25 seconds a question. Read, vote, Reveal answer, next. No discussion.',
        'Never name a student.',
        '!Q2 is the one that matters: "asked again" is the whole of today. A loop is a condition that gets asked again.']),
        activity=1),
    'block-quiz')

# 3 Hook ---------------------------------------------------------------
hook_stage = ('<div class="stage hk-1" id="stage-hook">' + slhead('Loops', 'Behind the Scenes: Attendance') + HOOK_SVG +
    '<div class="stage-ctl"><button type="button" id="hk-next">When do they stop?</button>'
    '<button type="button" class="ghost" id="hk-replay">Replay</button><span class="ctl-count" id="hk-count"></span></div>' + RULE + '</div>')
hook = block('hook', '&#129693;', 'Hook &mdash; behind the scenes: attendance',
    pcard('Hook &mdash; Behind the scenes: attendance', hook_stage + run([
        'Ask it straight: sixty of you, every morning. What exactly does the instructor do &mdash; per student? Take three answers, correct nobody.',
        'Press once. The same two lines per roll number, sixty rows. Ask the room: how does the instructor know when to stop?',
        '!Press again and stop talking. Sixty rows fold into one block. Read the four captions aloud, nothing more. <b>r</b> replays it.',
        'Say it once: one block, one counter, one question asked before every student. That is the whole session.',
        'Attendance starts at 1 and stops after 60. Today\'s code starts at 0 and stops before 3. That gap is a vote later.']),
        animated='hook'),
    'block-hook')

# 4 Agenda -------------------------------------------------------------
agenda = block('agenda', '&#128203;', 'Agenda &mdash; Slide 3',
    slide(3, 'Agenda', [
        'Three stops on the slide: loops, the while loop, then the code walkthrough &mdash; that is where the mistakes live. They have felt the problem; now the plan.',
        'Say: today is one way to write the fold you just saw. The other way, for, is next session.']))

# 5 Discover -----------------------------------------------------------
disc_stage = stage('disc', 'Introduction to Loops', 'Your Turn', [
    step('write it', 'On the blank side of your worksheet write a program that reads one whole number and prints the <b>next 3 numbers</b> after it, one per line. '
         'Use only <code>int(input())</code>, <code>a = a + 1</code> and <code>print(a)</code>. Then type it in the playground and run it with input <b>5</b>. '
         'Your screen must show 6, 7, 8 on three lines. <b>Three minutes.</b>',
         note='Paper first, then keyboard. Nobody needs anything new for this.', on=True),
    step('now ten', 'Change your program so it prints the <b>next 10 numbers</b>. Run it with 5: the screen must show 6 to 15. '
         'Then count the lines in your program, write the number in the margin of your sheet, and hold the sheet up.',
         note='Copy-paste is allowed. Expect twenty-one.'),
    step('now N', 'Now the program must read a <b>second</b> number N and print the next N numbers. Do not type. '
         'On paper, write the first line you would change and how. <b>Sixty seconds.</b>',
         ans='You cannot. Every copy of the two lines is fixed when the program is written, and N is not known until it runs. '
             'You need a way to say: <b>do these two lines again, N times.</b>'),
])
discover = block('discover', '&#9889;', 'Discover it first &mdash; the next N numbers',
    pcard('Discover it first &mdash; your turn', disc_stage + run([
        'Three minutes quiet, walk the rows. Nearly everyone writes a = a + 1 and print(a) three times &mdash; correct; say so.',
        'Then ten. Let them copy-paste and groan. Read the line count off the raised sheets, not from you.',
        '!Then N. Thirty seconds of silence before Reveal &mdash; the stuck feeling is the lesson.',
        'Short of time: skip the ten, go from 3 to N.',
        'Do not say the word while yet. The next three slides name it.']) +
    key('<p class="note"><b>3:</b> a = a + 1 and print(a), three times &mdash; 5 gives 6 7 8. <b>10:</b> twenty-one lines. <b>N:</b> impossible without a loop; the count is not known when the program is written.</p>'),
        activity=9) +
    cp(1, 'Every student has typed the two lines three times and can say why "N numbers" cannot be done that way. If not: say it for them once at slide 4 and move on &mdash; do not re-run the discovery.'),
    'block-activity')

# 6 Loops have a shape ---------------------------------------------------
shape = block('shape', '&#128216;', 'Loops have a shape &mdash; Slides 4&ndash;6',
    slide(4, 'Loops &mdash; a block that runs again', [
        'Name it. A loop runs one block several times; the orange arrow is the fold from the hook.',
        'One line for the two slides that were cut: so far every block ran once, top to bottom; Python has two loop spellings, while today, for next session.']) +
    slide(5, 'While Loop &mdash; the shape', [
        '!Read it as a sentence: while the condition is True, run the block. Then the one idea: a question asked again.',
        'Same shape as if: keyword, condition, colon, indented block. The only new thing is the arrow back.',
        'Do not fill in a condition yet.']) +
    slide(6, 'Example &mdash; the next 3 numbers', [
        'This is the program they just wrote the long way. Input 5, output 6 7 8.',
        '!Ask: which two lines repeat? Point, do not read.']))

# 7 Their program inside a while ----------------------------------------
inwhile = block('inwhile', '&#128216;', 'Their program inside a while &mdash; Slides 7&ndash;8',
    slide(7, 'While Loop &mdash; the repeating block moved inside', [
        'Left: the shape. Right: their two lines, once, inside the block. The condition box is empty on purpose.',
        'The dashed arrow is the fold from the hook: after the last line, back to the question.']) +
    slide(8, 'What should the condition be?', [
        'Two new lines: counter = 0 before the loop, counter = counter + 1 as the last line of the block. Point at both.',
        '!Read the question on the slide and go straight to the vote. Do not answer it.']))

# 8 Vote -----------------------------------------------------------------
vote_stage = stage('vote', 'While Loop', 'What Should the Condition Be?', [
    qstep('vote', 'The block must run <b>exactly three times</b>. counter starts at 0 and goes up by one at the end of every pass. '
          'Which condition goes on line 3? Fingers 1&ndash;4 on three, fist if unsure.',
          PROG_BLANK,
          [(1, 'counter &lt; 3'), (2, 'counter &lt;= 3'), (3, 'counter == 3'), (4, 'counter &lt; 4')],
          '<b>1 &mdash; counter &lt; 3.</b> Asked at 0, 1, 2 &mdash; yes three times &mdash; and no at 3. Options 2 and 4 both run four times. '
          'Option 3 never runs at all: 0 == 3 is False the first time it is asked.', on=True,
          note='Predict now; you type this program at task 2 and see it run.'),
])
vote = block('vote', '&#9889;', 'Vote &mdash; what should the condition be?',
    pcard('Vote &mdash; what should the condition be?', vote_stage + run([
        'Fingers, fist for unsure, on three. Then 45 seconds arguing with a neighbour, then vote again.',
        '!Vote, argue, vote, reveal. The argument is the intervention; the reveal is only the receipt.',
        'Expect 2 and 4 to get votes: three feels like the number to stop at. That is the off-by-one they meet again at task 2 and the break-it beat.',
        'Option 3 is worth one sentence: 0 == 3 is False the first time, so the block runs zero times.',
        'Never name a student. Ask who changed their vote, and why &mdash; hands, not names.']),
        activity=2),
    'block-quiz')

# 9 Three parts, named ---------------------------------------------------
three = block('three', '&#128216;', 'Three parts, named &mdash; Slide 9',
    slide(9, 'Initialization, termination condition, updation', [
        'Three names for the three lines they voted on. Start, question, move &mdash; use the plain words too.',
        '!Say: the block is everything indented. The updation is inside it, last. Then the paper task.']))

# 10 Paper: mark the parts ----------------------------------------------
paper_stage = stage('paper', 'Worksheet page 1 &middot; Task 1', 'Mark the Three Parts', [
    step('mark', 'Worksheet <b>page 1, task 1</b>. The program is printed with a Mark column. '
         'Write <b>I</b> in the Mark column beside the initialization line, <b>C</b> beside the condition line, <b>U</b> beside the updation line. '
         'Then, inside the Program column, draw <b>one bracket</b> to the left of the code, down every line that repeats. <b>Ninety seconds. Pens.</b>',
         PROG_NUM, note='Three letters, one bracket. Nothing else on the page.', on=True),
])
paper = block('paper', '&#9997;', 'Paper &mdash; mark the three parts',
    pcard('Paper &mdash; mark the three parts', paper_stage + run([
        'Ninety seconds, silent. Walk the rows and look; correct nobody.',
        '!Pens down first, then say the check: one I on line 2, one C on line 3, one U on line 6; the bracket holds lines 4 to 6 and nothing else.',
        'Ask by hands: whose bracket included line 7? Say why End would then print three times.',
        'Short of time: do the letters only, skip the bracket.']) +
    key('<p class="note">I &mdash; line 2 &middot; C &mdash; line 3 &middot; U &mdash; line 6 &middot; bracket &mdash; lines 4, 5, 6. Line 7 is outside every mark.</p>'),
        sheet='p.1 &middot; task 1', activity=17) +
    cp(2, 'Every student can point to the start, the question and the move in the program on their sheet. If not: mark it on the projector once and move on; the trace will repeat it.'),
    'block-activity')

# 11 The program, first pass --------------------------------------------
prog = block('prog', '&#128216;', 'The program, first pass &mdash; Slide 10',
    slide(10, 'While Loop &mdash; the first ask', [
        'Input 5. Rows 1 and 2 are already printed on their sheet. Say row 3 aloud, exactly as they will write it: line 3, 0 &lt; 3, True.',
        '!Then stop. The room fills the rest on paper. Do not walk the other passes.']))

# 12 Trace it, then type it ---------------------------------------------
trace_stage = stage('trace', 'Worksheet page 2 &middot; Task 2', 'Does It Do What It Claims?', [
    step('trace', 'Worksheet <b>page 2, task 2</b>. The program claims to print <b>the next three numbers after the input</b>. Input is <b>5</b>. '
         'Rows 1 and 2 are filled in. Continue: <b>one row for every line that runs, in the order it runs</b>, until line 7 has run. '
         'In each row write the line number, then a value only in the column that line changes, and in Printed anything that appears on screen. <b>Five minutes.</b>',
         PROG_NUM, note='Leftover blank rows are fine. Stop when line 7 has run.', on=True),
    step('verdict', 'Fingers: does it print exactly three numbers? <b>1</b> yes &nbsp; <b>2</b> no &nbsp; fist unsure. '
         'Then: how many rows did you use? Hold up the number.',
         note='Take the spread. Do not say the count yet.'),
    step('type it', 'Type the program <b>exactly as printed</b>, all seven lines. Run it with <b>5</b>. Compare the screen with your Printed column, row by row. '
         'Then, before you run it with <b>1</b>, write in the margin what it will print. Run it. Compare.',
         note='If the screen and the sheet differ, the sheet is wrong &mdash; find the row.'),
])
trace_rows = [(1, '5', '', '', ''), (2, '', '0', '', ''), (3, '', '', 'True', ''), (4, '6', '', '', ''), (5, '', '', '', '6'), (6, '', '1', '', ''),
              (3, '', '', 'True', ''), (4, '7', '', '', ''), (5, '', '', '', '7'), (6, '', '2', '', ''),
              (3, '', '', 'True', ''), (4, '8', '', '', ''), (5, '', '', '', '8'), (6, '', '3', '', ''),
              (3, '', '', 'False', ''), (7, '', '', '', 'End')]
trace_key = ('<table class="g-data"><tr><th>Row</th><th>Line</th><th>a</th><th>counter</th><th>counter &lt; 3 ?</th><th>Printed</th></tr>' +
             ''.join(f'<tr><td>{i}</td><td>{l}</td><td>{a}</td><td>{c}</td><td>{q}</td><td>{p}</td></tr>' for i, (l, a, c, q, p) in enumerate(trace_rows, 1)) +
             '</table><p class="note">Sixteen rows. Line 3 appears four times: True, True, True, False. Input 1 prints 2 3 4 End.</p>')
trace = block('trace', '&#9997;', 'Trace it on paper, then type it',
    pcard('Trace it, then type it', trace_stage + run([
        'Five minutes, silent. Walk the rows; look for tables that stop after the third print with no False row.',
        '!Pens down first, then say the check: sixteen rows; line 3 appears four times &mdash; three True, one False; the last row is line 7.',
        'Take the verdict by fingers: yes. Then the row count by hands. Fourteen means the False ask and End were skipped.',
        'Then type and run with 5, then 1. The screen settles any argument about the Printed column.',
        'Short of time: skip the run with 1.']) + key(trace_key),
        sheet='p.2 &middot; task 2', activity=20),
    'block-activity')

# 13 The fourth ask says False ------------------------------------------
fourth = block('fourth', '&#128216;', 'The fourth ask says False &mdash; Slide 11',
    slide(11, 'While Loop &mdash; the ask that says False', [
        'counter is 3. Is 3 &lt; 3? False. The block is skipped &mdash; not stopped halfway, never entered. Then End.',
        '!A loop that runs three times asks four times. Say it, then ask the room to say it back.']))

# 14 Follow the counter (animated explainer) ----------------------------
WALK_LINES = [
    ('wl1', 'a = <i>5</i>'),
    ('wl2', 'counter = <i>0</i>'),
    ('wl3', '<b>while</b> counter &lt; <i id="wlim">5</i>:'),
    ('wl4', '    a = a + <i>1</i>'),
    ('wl5', '    <i>print</i>(a)'),
    ('wl6', '    counter = counter + <i>1</i>'),
    ('wl7', '<i>print</i>(<em>"End"</em>)'),
]
walker_code = ''.join(f'<span class="wline" id="{i}">{t}</span>' for i, t in WALK_LINES)
walker_svg = '''<svg class="wchart" viewBox="0 0 560 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flowchart of the while loop: two set-up boxes, the counter question as a diamond, three body boxes on the right, an arrow from the last body box back up to the question, and End below the question">
<g class="wnode" data-node="a"><rect x="110" y="10" width="200" height="44" rx="10"/><text x="210" y="38" text-anchor="middle">a = 5</text></g>
<path class="wedge" data-edge="ain" d="M210 54 L210 74"/>
<g class="wnode" data-node="c"><rect x="110" y="74" width="200" height="44" rx="10"/><text x="210" y="102" text-anchor="middle">counter = 0</text></g>
<path class="wedge" data-edge="cin" d="M210 118 L210 140"/>
<g class="wnode wdia" data-node="d"><polygon points="210,140 320,180 210,220 100,180"/><text x="210" y="185" text-anchor="middle" id="wdtext">counter &lt; 5 ?</text></g>
<text class="wlbl" x="66" y="150" text-anchor="middle" id="wasks">asked 0&times;</text>
<path class="wedge" data-edge="t" d="M320 180 L340 180 L340 142 L360 142"/>
<text class="wlbl" x="336" y="170">True</text>
<g class="wnode" data-node="b1"><rect x="360" y="120" width="180" height="44" rx="10"/><text x="450" y="148" text-anchor="middle">a = a + 1</text></g>
<path class="wedge" data-edge="b12" d="M450 164 L450 196"/>
<g class="wnode" data-node="b2"><rect x="360" y="196" width="180" height="44" rx="10"/><text x="450" y="224" text-anchor="middle">print(a)</text></g>
<path class="wedge" data-edge="b23" d="M450 240 L450 272"/>
<g class="wnode" data-node="b3"><rect x="360" y="272" width="180" height="44" rx="10"/><text x="450" y="300" text-anchor="middle">counter = counter + 1</text></g>
<path class="wedge" data-edge="back" d="M450 316 L450 350 L60 350 L60 180 L100 180"/>
<text class="wlbl" x="255" y="342">back to the question</text>
<path class="wedge" data-edge="f" d="M210 220 L210 400"/>
<text class="wlbl" x="222" y="300">False</text>
<g class="wnode" data-node="e"><rect x="110" y="400" width="200" height="44" rx="10"/><text x="210" y="428" text-anchor="middle">print("End")</text></g>
<g class="wdot" aria-hidden="true"><circle r="8"/></g>
</svg>'''
walker = ('<div class="walker" id="walker"><div class="wcode"><pre>' + walker_code + '</pre>'
          '<div class="wslide"><label>the 3 is: 5</label><input type="range" min="0" max="5" value="5" step="1" aria-label="loop limit"></div>'
          '<div class="wctl"><button type="button" data-w="play">Play</button><button type="button" class="ghost" data-w="step">One step</button>'
          '<button type="button" class="ghost" data-w="reset">Reset</button></div><div class="wout" aria-live="polite"></div></div>'
          '<div class="wviz">' + walker_svg + '</div></div>')
walk_stage = ('<div class="stage" id="stage-walk">' + slhead('While Loop', 'Follow the Counter') +
    '<div class="stage-step on" data-label="walk"><p class="stage-q">The dot is Python. The slider sets the 3 &mdash; it starts at 5. '
    '<b>Before Play: write in your sheet margin how many times the question will be asked for 5.</b> Then watch the diamond.</p>'
    + walker + '<p class="stage-note">Grey lines are dead: the dot never reached them. Move the slider to 0 to see the whole block go dead.</p></div>' + RULE + '</div>')
walk = block('walk', '&#127916;', 'Follow the counter &mdash; the question, asked again',
    pcard('Follow the counter', walk_stage + run([
        'Slider starts at 5. Ask: how many times will the diamond be visited? Fingers, then Play. Six &mdash; the "asked" counter settles it.',
        '!Slider to 0. Ask: what prints? Fingers. Play. One ask, no, End &mdash; and the whole block stays grey. That grey is the finding.',
        'Slider to 3. One step, one step. Stop on the diamond each time and ask for True or False before you press again.',
        'a is fixed at 5 so the room can predict; the input line is the only difference from their program. Reset or <b>r</b> restarts it.',
        'Short of time: 5 and 0 only.']),
        animated='explainer') +
    cp(3, 'Every student can trace the program for input 5 and say that the while line is asked four times for three runs. If not: skip the second break-it step and keep the first.'),
    'block-hook')

# 15 Break it yourself --------------------------------------------------
break_stage = stage('break', 'Common Mistakes and Errors', 'Break It Yourself', [
    step('save a line', 'Your typed program from task 2 is on screen and works. I want to save a line: <b>delete line 6</b>, <code>counter = counter + 1</code>. Do not run yet. '
         'Fingers: <b>1</b> prints 6 7 8 End &nbsp; <b>2</b> prints numbers and never stops &nbsp; <b>3</b> an error. '
         'Now find the <b>Stop</b> button on your playground. Then run it with <b>5</b>.',
         PROG, note='Stop button first, then run. Watch the first three lines before you judge it.', on=True),
    step('count from one', 'Stop it. Put line 6 back. Humans count from 1, so change line 2 to <code>counter = 1</code>. Do not run yet. '
         'Fingers: how many numbers print &mdash; <b>1, 2, 3 or 4</b>? Then run it with input <b>1</b>.',
         note='Expected before the change: 2 3 4 End.'),
])
breakit = block('breakit', '&#128187;', 'Break it yourself &mdash; two edits, two symptoms',
    pcard('Break it yourself', break_stage + run([
        '!Before anyone runs the first edit: every student points at the Stop button. Then run.',
        'It prints 6, 7, 8 &mdash; then 9, 10, 11, forever. For one second it looks correct. Ask: what is counter after pass one? Still 0.',
        'Second edit: vote first. Run. Two numbers, no error, nothing red &mdash; and wrong. Say it: silent bugs are the ones that get shipped.',
        'Two fixes for the second: back to 0, or &lt; 4. Which pair matches the hook? roll = 1 with &lt;= 60. Either pair works; a mixed pair does not.',
        'Short of time: run the first edit on your screen, not theirs; keep the second on theirs.']) +
    key('<p class="note"><b>Edit 1</b> (no line 6), input 5: 6 7 8 9 10 11 &hellip; never stops; counter is 0 at every ask. '
        '<b>Edit 2</b> (counter = 1), input 1: 2 3 End &mdash; two passes, the third ask fails at 3. Fixes: counter = 0, or while counter &lt; 4.</p>'),
        activity=19),
    'block-hands')

# 16 The two mistakes, named --------------------------------------------
mistakes = block('mistakes', '&#128216;', 'The two mistakes, named &mdash; Slides 12&ndash;13',
    slide(12, 'Incorrect Termination Condition &mdash; counter = 1', [
        'The pink line is the pair that broke: start and question must agree. Change one, change the other.',
        '!Off by one is the most common loop bug they will ever write. Name it now.']) +
    slide(13, 'Not Updating Counter Variable', [
        'No updation: the question gets the same answer forever. This is the edit they just made.',
        'One line for the third mistake that was cut: freezing the condition in a variable does the same thing &mdash; the while line must hold the question, not a saved answer.',
        '!Ask back: which of the two would attendance be? Never moving on to the next roll number.']) +
    cp(4, 'Every student can say which edit looped forever and which ran short with no error. If not: put lines 1 and 2 of the square program on the board and let them write only the three loop lines.'))

# 17 Square: the problem -------------------------------------------------
sqprob = block('sqprob', '&#128216;', 'Square &mdash; the problem &mdash; Slide 14',
    slide(14, 'Square Pattern', [
        'Read the spec. Do not solve it. Ask: what is the block that repeats? One row of stars.',
        'The cut slide said it: a space after every star, inside the quotes. The checker is strict about it.',
        '!Say nothing about how to make one row. If nobody offers it, ask what "* " * 4 gives.']))

# 18 Write it yourself (worked-example fade) ------------------------------
SQ_FADE = ('1  n = <i>int</i>(<i>input</i>())\n'
           '2  counter = 0\n'
           '3  ____________________\n'
           '4      ____________________\n'
           '5      ____________________')
write_stage = stage('write', 'Worksheet page 3 &middot; Task 3', 'Write It Yourself', [
    step('on paper', 'Worksheet <b>page 3, task 3</b>. Lines 1 and 2 are given. Write <b>lines 3, 4 and 5</b> on the sheet: '
         'the while line with its condition, the print line for one row of stars, the update line. '
         'Input <b>4</b> must give four rows of <code>* * * * </code>. <b>Three minutes. Pens.</b>',
         SQ_FADE, note='Condition, one row, update. Which value must the condition compare against?', on=True),
    step('type it', 'Type all five lines. Run with <b>4</b>, then <b>5</b>, then <b>1</b>. Count the rows on screen against the input, then the stars in one row against the input.',
         note='If the rows stay at 4 when you type 5, a number is sitting where n should be. If the stars touch, the space is missing.'),
])
write = block('write', '&#128187;', 'Write it yourself &mdash; the square',
    pcard('Write it yourself', write_stage + run([
        'Paper first, three minutes, quiet. Then type. Nine minutes in all; do not rush the paper.',
        '!Two bugs to look for as you walk: "*" * n with no space, and &lt;= n giving one extra row. Do not fix them &mdash; ask what 4 and 5 gave.',
        'A finished student tests 0. Zero rows for 0 is correct, and it surprises them.',
        'Short of time: give line 3 on the board; they write 4 and 5.',
        'Do not put slide 15 up until most screens show a square.']) +
    key('<pre class="slabcode">n = <i>int</i>(<i>input</i>())\ncounter = 0\n<b>while</b> counter &lt; n:\n    <i>print</i>(<em>"* "</em> * n)\n    counter = counter + 1</pre>'
        '<table class="g-data"><tr><th>Input</th><th>Prints</th></tr><tr><td>4</td><td>four rows of <code>* * * * </code></td></tr>'
        '<tr><td>5</td><td>five rows of five</td></tr><tr><td>1</td><td><code>* </code></td></tr><tr><td>0</td><td>nothing</td></tr></table>'
        '<p class="note"><code>"*" * n</code> prints <code>****</code> with no spaces. <code>counter &lt;= n</code> prints n + 1 rows.</p>'),
        sheet='p.3 &middot; task 3', activity=11),
    'block-hands')

# 19 Solution and takeaways ----------------------------------------------
solution = block('solution', '&#128216;', 'Solution and takeaways &mdash; Slides 15&ndash;16',
    slide(15, 'Square Pattern &mdash; solution', [
        'Compare, do not read. Same three parts as slide 9; the block is one print.',
        '"* " * n is the row; the loop is the column. Two different repeats &mdash; one is a string, one is a loop.',
        '!counter &lt; n, not 3: the number of rows comes from the input. That is what the hand-copied version could never do.']) +
    slide(16, 'Key Takeaways', [
        'Do not read the bullets. Ask for the one idea back: a while loop is a question asked again. Hands, ten seconds.',
        'Homework, one line: the deck\'s daily challenge, a while loop over a string, is in the practice set &mdash; trace it before you run it.',
        'Next session: the for loop &mdash; the same three parts, written in one line.']) +
    cp(5, 'The square prints n rows for both 4 and 5 on most screens. If not: the exit poll still runs in full &mdash; cut the takeaways to one sentence.'))

# 20 Exit poll -------------------------------------------------------------
exit_stage = stage('exit', 'Loops', 'Exit Poll &mdash; Three Questions', [
    qstep('E1', 'How many times is line 3 asked before this program ends? Fingers 1&ndash;4 on three, fist if unsure.',
          PROG_NUM,
          [(1, 'three'), (2, 'four'), (3, 'two'), (4, 'it never ends')],
          '<b>2 &mdash; four.</b> Asked at counter 0, 1, 2 &mdash; True &mdash; and at 3 &mdash; False. Three runs, four asks.', on=True),
    qstep('E2', 'Line 3 becomes <code>while counter &lt; 2:</code>. Input is 7. What prints?',
          '1  a = <i>int</i>(<i>input</i>())\n2  counter = 0\n3  <b>while</b> counter &lt; 2:\n4      a = a + 1\n5      <i>print</i>(a)\n6      counter = counter + 1\n7  <i>print</i>(<em>"End"</em>)',
          [(1, '8 9 End'), (2, '8 9 10 End'), (3, '8 End'), (4, 'numbers forever')],
          '<b>1 &mdash; 8 9 End.</b> Asked at 0 and 1 &mdash; yes twice &mdash; and no at 2. Two runs, three asks, then the line after the loop.'),
    qstep('E3', 'Line 3 becomes <code>while counter &lt; 0:</code>. Input is 5. What prints?',
          '1  a = <i>int</i>(<i>input</i>())\n2  counter = 0\n3  <b>while</b> counter &lt; 0:\n4      a = a + 1\n5      <i>print</i>(a)\n6      counter = counter + 1\n7  <i>print</i>(<em>"End"</em>)',
          [(1, 'nothing at all'), (2, 'End'), (3, '6 End'), (4, 'numbers forever')],
          '<b>2 &mdash; End.</b> 0 &lt; 0 is False the first time it is asked, so the block never runs. The line after the loop still runs once.'),
])
exit_ = block('exit', '&#127919;', 'Exit poll &mdash; three questions on today',
    pcard('Exit poll &mdash; three questions', exit_stage + run([
        '!Hard floor: whatever is unfinished elsewhere, stop it and start this. All three questions, in order.',
        'Same signal as the warm-up: fingers on three, fist if unsure. 40 seconds a question, then Reveal answer.',
        'Count roughly how many fists and wrong fingers on E2 &mdash; that is what next session\'s warm-up opens with.',
        'Never name a student.',
        'Close on E3: the line after the loop runs once, whatever the loop did. Then end.']),
        activity=1),
    'block-exit')

blocks = ''.join([opening, poll, hook, agenda, discover, shape, inwhile, vote, three, paper, prog, trace, fourth, walk,
                  breakit, mistakes, sqprob, write, solution, exit_])

# ---------------------------------------------------------------- guide
guide = '''<div id="guide-view">
<h1 class="g-h1">Instructor guide</h1>

<section class="g-sec">
<h3>1 &middot; The one idea</h3>
<p>A while loop is <b>a question asked again</b>. <code>while counter &lt; 3:</code> is asked four times for a loop that
runs three: three yeses, one no. Three lines make it work &mdash; a start (<code>counter = 0</code>), the question, and a
move (<code>counter = counter + 1</code>) inside the block, last. Forget the move and it never stops. Start at the wrong
number and it silently runs short.</p>
<p class="g-meta" style="margin:0">Say it at slide 5. Show it at Follow the counter. Ask for it back at slide 16.</p>
</section>

<section class="g-sec">
<h3>2 &middot; Before you walk in</h3>
<ul class="brief">
<li>Print the worksheet &mdash; three pages, single-sided, one set each. The <b>Student worksheet</b> button prints the sheets only.</li>
<li>Open the code playground, font sized for the back row, line numbers on.</li>
<li class="hot">Find the stop button and press it once on an infinite loop of your own. Break it yourself runs one on every laptop in the room.</li>
<li>Presenter view, then <b>f</b> for full screen. <b>a</b> all slides &middot; <b>g</b> guides &middot; <b>r</b> replay &middot; <b>Esc</b> out. If full screen refuses, you are in a preview pane &mdash; open the file in its own browser tab.</li>
<li class="hot">Never cut: the hook &middot; the N-numbers discovery &middot; the vote &middot; the trace and its row count &middot; Follow the counter at 0 &middot; the exit poll.</li>
</ul>
</section>

<section class="g-sec">
<h3>3 &middot; If they ask</h3>
<ul class="brief">
<li><b>Why not just write print three times?</b> Because three was known when we wrote it. N is not. The loop is how a program repeats a number of times it learns while running.</li>
<li><b>Why is the update inside the block?</b> It has to happen every pass, after the work. Outside, it happens once &mdash; and the question gets the same answer forever.</li>
<li><b>Why start at 0 and not 1?</b> Either works if the question agrees. 0 with &lt; 3 and 1 with &lt;= 3 both run three times. Python programmers start at 0 because indexes do.</li>
<li><b>Is an infinite loop an error?</b> No. Python is doing exactly what it was told. That is why the stop button matters more than the error message.</li>
<li><b>Can the block change the condition without a counter?</b> Yes &mdash; any line that changes what the question looks at is the move. Counter is the simplest case.</li>
</ul>
</section>
</div>'''

# ---------------------------------------------------------------- worksheet (3 pages, no answers, no self-checks, no timings)
def shead(p, total=3):
    return (f'<div class="sh-band"><span class="t">{TITLE}</span>'
            f'<span class="s">{COURSE}</span><span class="p">page {p} of {total}</span></div>')
def sfoot(p, total=3):
    return ('<div class="sh-foot"><span>Not collected &mdash; keep this sheet</span>'
            f'<b>page {p} of {total}</b></div>')
def task(n, head, body):
    return (f'<div class="task"><div class="task-hd"><span class="badge">{n}</span>'
            f'<span class="h">{head}</span></div>{body}</div>')
def code_rows(lines):
    return ''.join(f'<tr><td class="ln">{i}</td><td style="height:7mm"></td><td class="c">{html.escape(l)}</td></tr>' for i, l in enumerate(lines, 1))

PLAIN = ['a = int(input())', 'counter = 0', 'while counter < 3:', '    a = a + 1', '    print(a)', '    counter = counter + 1', 'print("End")']

t1 = task(1, 'Mark the three parts',
    '<p class="task-instr">In the <b>Mark</b> column write <b>I</b> beside the initialization line, <b>C</b> beside the condition line and '
    '<b>U</b> beside the updation line &mdash; one letter each. Then, inside the Program column, draw <b>one bracket</b> to the left of the code, down every line that repeats.</p>'
    '<table class="w tr"><tr><th style="width:9%">Line</th><th style="width:12%">Mark</th><th>Program</th></tr>' + code_rows(PLAIN) + '</table>')

def tr(line, a='', c='', q='', p='', pre=False):
    cell = lambda v: f'<td style="height:6mm;color:var(--pr-soft)">{v}</td>' if pre else '<td style="height:6mm"></td>'
    ln = f'<td class="ln">{line}</td>' if line != '' else '<td class="ln" style="height:6mm"></td>'
    return '<tr>' + ln + cell(a) + cell(c) + cell(q) + cell(p) + '</tr>'
def trn(i, line, a='', c='', q='', p='', pre=False):
    return tr(line, a, c, q, p, pre).replace('<tr>', f'<tr><td class="ln">{i}</td>', 1)

pre_rows = trn(1, 1, a='5', pre=True) + trn(2, 2, c='0', pre=True)
blank_rows = ''.join(trn(i, '') for i in range(3, 19))
t2 = task(2, 'Does it do what it claims?',
    '<div class="cue">This program claims to print <b>the next three numbers after the input</b>. The input is <b>5</b>. Does it?</div>'
    '<pre>' + '\n'.join(f'{i}  {html.escape(l)}' for i, l in enumerate(PLAIN, 1)) + '</pre>'
    '<p class="task-instr">Rows 1 and 2 are filled in. Continue: <b>one row for every line that runs, in the order it runs</b>, until line 7 has run. '
    'In each row write the line number, a value only in the column that line changes, and in <b>Printed</b> whatever appears on screen. '
    'Leftover blank rows are fine.</p>'
    '<table class="w tr"><tr><th style="width:8%">Row</th><th style="width:9%">Line</th><th style="width:15%">a</th><th style="width:16%">counter</th>'
    '<th style="width:22%">counter &lt; 3 ?</th><th>Printed</th></tr>' + pre_rows + blank_rows + '</table>'
    '<p class="task-instr">Verdict &mdash; does it print exactly three numbers? &nbsp; <b>yes</b> &nbsp;/&nbsp; <b>no</b></p>')

t3 = task(3, 'Square pattern &mdash; write it yourself',
    '<div class="cue">Read a whole number <b>n</b>. Print stars in <b>n rows and n columns</b>, with a space after every star. '
    'Input 4 gives four rows of <span style="font-family:var(--sh-mono)">* * * * </span></div>'
    '<p class="task-instr">Lines 1 and 2 are given. Write <b>lines 3, 4 and 5</b>: the while line with its condition, the print line for one row, the update line. '
    'Write them here <b>before</b> you type them.</p>'
    '<table class="w"><tr><th style="width:10%">Line</th><th>Program</th></tr>'
    '<tr><td class="c">1</td><td class="c" style="height:9mm">n = int(input())</td></tr>'
    '<tr><td class="c">2</td><td class="c" style="height:9mm">counter = 0</td></tr>' +
    ''.join(f'<tr><td class="c">{i}</td><td style="height:11mm"></td></tr>' for i in range(3, 6)) +
    '</table>'
    '<p class="task-instr">Then type all five lines and run with <b>4</b>, then <b>5</b>, then <b>1</b>. Write what each one printed:</p>'
    '<table class="w"><tr><th style="width:15%">Input</th><th>Rows on screen</th><th>Stars in one row</th></tr>' +
    ''.join(f'<tr><td class="c">{v}</td><td style="height:8mm"></td><td></td></tr>' for v in (4, 5, 1)) + '</table>')

handout = f'''<div id="handout-view">
<h1 class="g-h1">Student worksheet</h1>
<div class="h-actions">
<button type="button" id="print-handout">Print / save as PDF</button>
<span>Prints these three sheets only, at A4. Set your printer to single-sided.</span>
</div>
<div class="sheet">{shead(1)}
<div class="sh-name"><span>Name</span><span>Roll no.</span></div>
{t1}
{sfoot(1)}</div>
<div class="sheet">{shead(2)}
{t2}
{sfoot(2)}</div>
<div class="sheet">{shead(3)}
{t3}
{sfoot(3)}</div>
</div>'''

# ---------------------------------------------------------------- nav
CHECKPOINTS = [
 ('Checkpoint 1 &middot; 16 min', [('opening','k-concept',2,'Opening'),
                                   ('poll','k-quiz',3,'Warm-Up Poll'),
                                   ('hook','k-hook',5,'Hook &middot; attendance'),
                                   ('agenda','k-concept',1,'Agenda'),
                                   ('discover','k-activity',5,'Discover &middot; N numbers')]),
 ('Checkpoint 2 &middot; 31 min', [('shape','k-concept',4,'Loops have a shape'),
                                   ('inwhile','k-concept',2,'Their program inside a while'),
                                   ('vote','k-quiz',4,'Vote &middot; the condition'),
                                   ('three','k-concept',1,'Three parts, named'),
                                   ('paper','k-activity',4,'Paper &middot; mark the parts')]),
 ('Checkpoint 3 &middot; 47 min', [('prog','k-concept',1,'The program, first pass'),
                                   ('trace','k-activity',9,'Trace it, then type it'),
                                   ('fourth','k-concept',2,'The fourth ask says False'),
                                   ('walk','k-hook',4,'Follow the counter')]),
 ('Checkpoint 4 &middot; 56 min', [('breakit','k-hands',7,'Break it yourself'),
                                   ('mistakes','k-concept',2,'The two mistakes, named')]),
 ('Checkpoint 5 &middot; 69 min', [('sqprob','k-concept',1,'Square &middot; the problem'),
                                   ('write','k-hands',9,'Write it yourself'),
                                   ('solution','k-concept',3,'Solution and takeaways')]),
 ('Hard floor &middot; exit at 69 min', [('exit','k-exit',6,'Exit poll')]),
]
def navitem(i, k, m, l, mins=None):
    if i == 'cp': return f'<p class="sp-cp"><span>{m}</span></p>'
    return (f'<button type="button" class="sp-item {k}" data-target="{i}" data-mins="{mins}">'
            f'<span class="sp-label">{l}</span></button>')
NAV = []
for cpl, items in CHECKPOINTS:
    NAV.append(navitem('cp', None, cpl, None))
    NAV += [navitem(i, k, None, l, d) for i, k, d, l in items]
total = sum(d for _, items in CHECKPOINTS for _, _, d, _ in items)
assert total == 75, f'durations total {total}, must be 75'
nav = ''.join(NAV)
nav_ids = [i for _, items in CHECKPOINTS for i, _, _, _ in items]
blk_ids = re.findall(r'<section class="block[^"]*" id="([^"]+)"', blocks)
assert nav_ids == blk_ids, f'nav/block mismatch:\n{nav_ids}\n{blk_ids}'

# ---------------------------------------------------------------- template swaps
tpl = (SKILL / 'plan-template.html').read_text(encoding='utf8')

def swap(s, a, b, count=1):
    assert s.count(a) == count, f'expected {count} of {a[:60]!r}, found {s.count(a)}'
    return s.replace(a, b)

WALKER_CSS = r'''
/* ============ execution walker: Follow the Counter ============
   One moving dot. Steps computed from the slider. Whatever the dot never
   reaches greys out and stays grey. Deck palette so it reads as a slide. */
.walker{display:flex;flex:1;min-height:0;margin:0}
.wcode{flex:0 0 44%;min-width:0;display:flex;flex-direction:column;padding-right:20px}
.wviz{flex:1;min-width:0;display:flex;flex-direction:column}
.wcode pre{margin:0;padding:12px 14px;background:var(--dk-card);border-radius:8px;
 font:13.5px/1.62 var(--mono);color:var(--dk-text);white-space:pre;overflow-x:auto}
.wline{display:block;padding:0 6px;margin:0 -6px;border-radius:4px;
 transition:background-color 200ms var(--ease-out),opacity 320ms var(--ease-out)}
.wline b{color:var(--dk-red);font-weight:400}
.wline i{color:var(--dk-blue);font-style:normal}
.wline em{color:#22863A;font-style:normal}
.wline.ran{background:#DCEEF9}
.wline.now{background:#B9DCF2}
.wline.dead{opacity:.26}
.wctl{display:flex;align-items:center;margin:12px 0 0;flex-wrap:wrap}
.wctl button{background:var(--dk-blue);color:#fff;border:0;border-radius:8px;padding:8px 15px;
 font:inherit;font-size:13.5px;font-weight:650;cursor:pointer;margin-right:8px;
 transition:transform var(--dur-fast) var(--ease-out)}
.wctl button.ghost{background:none;color:var(--dk-blue);border:1px solid #BFD9EA}
.wctl button:active{transform:scale(.97)}
.wslide{display:flex;align-items:center;margin:12px 0 0}
.wslide label{flex:0 0 auto;margin-right:10px;font:600 13.5px var(--sans);color:var(--dk-text);
 font-variant-numeric:tabular-nums}
.wslide input{flex:1;min-width:0;accent-color:var(--dk-blue)}
.wout{flex:none;margin:12px 0 0;padding:9px 13px;min-height:2.6em;background:#000;border-radius:4px;
 font:14px/1.5 var(--mono);color:#fff;white-space:pre-wrap}
.wout:empty::before{content:'Press Play. Whatever the program prints appears here.';color:#7C7C7C}
.wchart{display:block;width:100%;height:auto;flex:1;min-height:0;margin:0}
.wchart .wnode rect,.wchart .wnode polygon{fill:#fff;stroke:#C3D4DF;stroke-width:2;
 transition:stroke 220ms var(--ease-out),fill 220ms var(--ease-out),opacity 320ms var(--ease-out)}
.wchart .wnode text{font:600 14px var(--sans);fill:var(--dk-text);
 transition:fill 220ms var(--ease-out),opacity 320ms var(--ease-out)}
.wchart .wedge{stroke:#C3D4DF;stroke-width:2;fill:none;
 transition:stroke 220ms var(--ease-out),opacity 320ms var(--ease-out)}
.wchart .wlbl{font:600 12px var(--sans);fill:var(--dk-line)}
.wchart #wasks{font:700 13px var(--sans);fill:var(--dk-red)}
.wchart .visited rect,.wchart .visited polygon{stroke:var(--dk-blue);fill:#EAF6FC}
.wchart .visited text{fill:var(--dk-blue)}
.wchart .wedge.visited{stroke:var(--dk-blue)}
.wchart .no rect,.wchart .no polygon{stroke:var(--dk-red)}
.wchart .dead,.wchart .wedge.dead{opacity:.2}
.wdot circle{fill:var(--dk-red)}
.wdot{transform:translate(210px,32px);transition:transform 420ms var(--ease-out)}
body.present .wcode pre{font-size:clamp(12px,1.2vw,19px)}
body.present .wcode{padding-right:clamp(14px,2vw,34px)}
body.present .wout{font-size:clamp(13px,1.35vw,21px)}
body.present .wctl button,body.present .wslide label{font-size:clamp(12px,1.25vw,18px)}
body.present .wchart .wnode text{font:600 clamp(11px,1.05vw,16px) var(--sans)}
body.present .wchart #wasks{font:700 clamp(12px,1.15vw,17px) var(--sans)}
@media (prefers-reduced-motion:reduce){
  .wdot,.wline,.wchart *{transition:none !important}
}
@media print{ .wdot,.wline,.wchart *{transition:none !important} }
'''

WALKER_JS = r'''
  /* ================= execution walker: Follow the Counter =================
     Steps are computed from the slider (the loop limit), so the room can change
     it and walk again. The condition node is re-entered on every pass — that
     re-entry is the lesson. Lines never executed grey out at the end and stay grey. */
  (function(){
    var W=document.getElementById('walker');
    if(!W) return;
    var POS={a:[210,32],c:[210,96],d:[210,180],b1:[450,142],b2:[450,218],b3:[450,294],e:[210,422]};
    var dot=W.querySelector('.wdot'), out=W.querySelector('.wout'),
        slider=W.querySelector('input[type=range]'), label=W.querySelector('.wslide label'),
        playBtn=W.querySelector('[data-w=play]'), stepBtn=W.querySelector('[data-w=step]'),
        resetBtn=W.querySelector('[data-w=reset]'), asks=W.querySelector('#wasks');
    var steps=[], at=0, timer=null;

    function plan(lim){
      var s=[{node:'a',line:1},{node:'c',line:2,edge:'ain'}];
      var a=5, counter=0, n=0, first=true;
      while(true){
        n++;
        var hit=counter<lim;
        s.push({node:'d',line:3,test:hit,edge:first?'cin':'back',ask:n});
        first=false;
        if(!hit) break;
        a=a+1;
        s.push({node:'b1',line:4,edge:'t'});
        s.push({node:'b2',line:5,edge:'b12',print:String(a)});
        counter=counter+1;
        s.push({node:'b3',line:6,edge:'b23'});
      }
      s.push({node:'e',line:7,edge:'f',print:'End'});
      return s;
    }
    function clear(){
      W.querySelectorAll('.wline').forEach(function(l){ l.className='wline'; });
      W.querySelectorAll('[data-node],[data-edge]').forEach(function(n){ n.classList.remove('visited','dead','no'); });
      dot.style.transform='translate(210px,32px)';
      out.textContent='';
      if(asks) asks.textContent='asked 0\u00D7';
    }
    function render(){
      var s=steps[at-1]; if(!s) return;
      W.querySelectorAll('.wline.now').forEach(function(l){ l.classList.remove('now'); });
      var line=W.querySelector('#wl'+s.line); if(line) line.classList.add('ran','now');
      var node=W.querySelector('[data-node="'+s.node+'"]');
      if(node){ node.classList.add('visited'); node.classList.toggle('no', s.test===false); }
      if(s.edge){ var e=W.querySelector('[data-edge="'+s.edge+'"]'); if(e) e.classList.add('visited'); }
      var p=POS[s.node]; dot.style.transform='translate('+p[0]+'px,'+p[1]+'px)';
      if(s.ask&&asks) asks.textContent='asked '+s.ask+'\u00D7';
      if(s.print) out.textContent+=(out.textContent?'\n':'')+s.print;
      if(at===steps.length) finish();
    }
    function finish(){
      W.querySelectorAll('.wline').forEach(function(l){ if(!l.classList.contains('ran')) l.classList.add('dead'); });
      W.querySelectorAll('[data-node],[data-edge]').forEach(function(n){ if(!n.classList.contains('visited')) n.classList.add('dead'); });
      W.querySelectorAll('.wline.now').forEach(function(l){ l.classList.remove('now'); });
    }
    function step(){ if(at>=steps.length) return false; at++; render(); return at<steps.length; }
    function stop(){ if(timer){ clearInterval(timer); timer=null; } playBtn.textContent='Play'; }
    function play(){
      if(timer){ stop(); return; }
      if(at>=steps.length) reset();
      playBtn.textContent='Pause';
      timer=setInterval(function(){ if(!step()) stop(); }, 720);
    }
    function reset(){ stop(); at=0; steps=plan(+slider.value); clear(); }
    slider.addEventListener('input', function(){
      var v=slider.value;
      label.textContent='the 3 is: '+v;
      var lim=W.querySelector('#wlim'); if(lim) lim.textContent=v;
      var dt=W.querySelector('#wdtext'); if(dt) dt.textContent='counter < '+v+' ?';
      reset();
    });
    playBtn.addEventListener('click', play);
    stepBtn.addEventListener('click', function(){ stop(); if(at>=steps.length) reset(); step(); });
    resetBtn.addEventListener('click', reset);
    reset();
    window.replayWalker=reset;
  })();

'''

tpl = swap(tpl, '.stage-ctl{display:flex;gap:9px;align-items:center;flex-wrap:wrap}',
                '.stage-ctl{display:flex;gap:9px;align-items:center;flex-wrap:wrap}' + WALKER_CSS)
tpl = swap(tpl, '  /* ================= the hook: hk-1..hk-3 on the stage ================= */',
                WALKER_JS + '  /* ================= the hook: hk-1..hk-3 on the stage ================= */')
tpl = swap(tpl, 'if(s===hk) hkGo(1); else show(s,0);',
                "if(s===hk) hkGo(1); else if(s.id==='stage-walk'&&window.replayWalker) window.replayWalker(); else show(s,0);", count=2)

# poll / vote / exit panels: tighter type in presenter view so seven-line code + four options + answer fit the 16:9 box
POLL_CSS = ('body.present .stage-ctl{flex:none;margin-top:12px}\n'
            'body.present #stage-poll pre.slabcode,body.present #stage-vote pre.slabcode,body.present #stage-exit pre.slabcode{font-size:clamp(13px,1.12vw,20px);line-height:1.4;padding:clamp(8px,1.2vh,16px) clamp(14px,1.6vw,26px)}\n'
            'body.present #stage-poll .stage-q,body.present #stage-vote .stage-q,body.present #stage-exit .stage-q{font-size:clamp(15px,1.5vw,24px);margin-bottom:6px}\n'
            'body.present #stage-poll .vopts,body.present #stage-vote .vopts,body.present #stage-exit .vopts{font-size:clamp(14px,1.35vw,21px)}\n'
            'body.present #stage-poll .vopts li,body.present #stage-vote .vopts li,body.present #stage-exit .vopts li{margin-bottom:2px}\n'
            'body.present #stage-poll .ans,body.present #stage-vote .ans,body.present #stage-exit .ans{font-size:clamp(13px,1.15vw,19px);padding:6px 12px;margin-top:6px}\n'
            'body.present #stage-poll .stage-ctl,body.present #stage-vote .stage-ctl,body.present #stage-exit .stage-ctl{margin-top:8px}\n'
            'body.present #stage-walk .stage-q{font-size:clamp(14px,1.35vw,21px);margin-bottom:8px}\n'
            'body.present #stage-walk .stage-note{font-size:clamp(12px,1.1vw,16px)}')
tpl = swap(tpl, 'body.present .stage-ctl{flex:none;margin-top:12px}', POLL_CSS)

# the hook is a different drawing: the fold is a vertical collapse onto the first row
tpl = swap(tpl, 'transform:translate(160px,117.5px) scale(.5)', 'transform:translate(0,72px) scale(1,.1)', count=2)
tpl = swap(tpl, "{btn:'Two checks, in order', note:'1 / 3 \\u00B7 ask the room'}",
                "{btn:'When do they stop?',    note:'1 / 3 \\u00B7 ask the room'}")
tpl = swap(tpl, "{btn:'Write it down',        note:'2 / 3 \\u00B7 PIN first, then balance'}",
                "{btn:'Fold it',              note:'2 / 3 \\u00B7 sixty rows, then stop'}")
tpl = swap(tpl, "{btn:'Done',                 note:'3 / 3 \\u00B7 one inside the other'}",
                "{btn:'Done',                 note:'3 / 3 \\u00B7 one block, one counter'}")

ONE_IDEA = ('A while loop is <em>a question asked again</em>. <code>while counter &lt; 3:</code> is asked four times '
            'for a loop that runs three &mdash; three yeses, one no. A start, a question and a move make it work; '
            'forget the move and it never stops, start at the wrong number and it silently runs short.')

doc = (tpl.replace('{{SESSION_TITLE}}', TITLE)
          .replace('{{ONE_IDEA}}', ONE_IDEA)
          .replace('{{NAV}}', nav)
          .replace('{{BLOCKS}}', blocks)
          .replace('{{GUIDE}}', guide)
          .replace('{{HANDOUT}}', handout)
          .replace('{{EXTRA_CSS}}', '').replace('{{EXTRA_JS}}', ''))
assert '{{' not in doc, 'unfilled placeholder'
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(doc, encoding='utf8')
print('written', OUT, round(len(doc)/1024/1024, 2), 'MB')
