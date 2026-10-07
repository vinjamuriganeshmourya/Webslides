#!/usr/bin/env python3
"""Builder for the session 12 (Loops) plan. Change this, regenerate; never hand-edit the HTML."""
import base64, html, os, re
from pathlib import Path

ROOT = Path(r"C:\Lesson Plans New")
SKILL = Path(r"C:\Users\Nxtwave\.claude\skills\lesson-plan\assets")
SH = ROOT / "work" / "slides"
FIXED = ROOT / "work" / "fixed"
OUT = ROOT / "Plans" / "Programming Foundations" / "12-loops-plan.html"
HOOK_SVG = (ROOT / "work" / "hook_svg.txt").read_text(encoding="utf8")

TITLE = "Loops"
COURSE = "CCBP 4.0 &middot; Session 12"

# ---------------------------------------------------------------- helpers
def img(src, n, title):
    p = FIXED / f"sl{src}.webp" if (FIXED / f"sl{src}.webp").exists() else SH / f"sl{src}.webp"
    b64 = base64.b64encode(p.read_bytes()).decode()
    return (f'<div class="slide-img"><img alt="{html.escape(f"Slide {n}: {title}")}" '
            f'src="data:image/webp;base64,{b64}"></div>')

def brief(items):
    if not items: return ''
    out = []
    for t in items:
        cls = ' class="hot"' if t.startswith('!') else ''
        out.append(f'<li{cls}>{t.lstrip("!")}</li>')
    return '<ul class="brief">' + ''.join(out) + '</ul>'

def slide(n, src, title, items=()):
    return ('<div class="slide"><div class="slide-head">'
            f'<span class="slide-no">Slide {n}</span>'
            f'<span class="slide-title">{title}</span></div>'
            f'{img(src, n, title)}{brief(items)}</div>')

def block(bid, icon, h2, inner, cls=''):
    return (f'<section class="block {cls}" id="{bid}">'
            f'<div class="block-head"><span class="block-icon" aria-hidden="true">{icon}</span>'
            f'<h2>{h2}</h2></div>{inner}</section>')

def run(items):
    assert len(items) <= 5, f"note block has {len(items)} lines"
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

def pcard(lbl, inner, sheet=None):
    ref = f'<span class="slide-src">worksheet {sheet}</span>' if sheet else ''
    return (f'<div class="pcard" data-label="{lbl}"><div class="slide-head">'
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

def stage(sid, eyebrow, title, steps):
    return f'<div class="stage" id="stage-{sid}">' + slhead(eyebrow, title) + ''.join(steps) + ctl() + RULE + '</div>'

def cp(n, text):
    return f'<p class="note"><b>Checkpoint {n}.</b> {text}</p>'

# ---------------------------------------------------------------- programs
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
EXIT_NUM = ('1  a = <i>input</i>()\n'
            '2  counter = 0\n'
            '3  length_of_a = <i>len</i>(a)\n'
            '4  <b>while</b> counter &lt; (length_of_a - 1):\n'
            '5      <i>print</i>(a[counter])\n'
            '6      counter = counter + 1')

# ---------------------------------------------------------------- blocks
opening = block('opening', '&#128206;', 'Opening &mdash; Deck Slides 1&ndash;2',
    slide(1, 1, 'Welcome', [
        'Attendance while it is up &mdash; and notice what you do per student. You will need it in four minutes.',
        'Say nothing about the topic yet.']) +
    slide(2, 2, 'Title &mdash; Loops', [
        'Read the title and go straight to the poll. Retrieval before anything new.']))

poll_stage = stage('poll', 'Recap &middot; Last Session', 'Quick Check', [
    qstep('Q1', 'What does this print?',
          'marks = 85\n<b>if</b> marks &gt;= 91:\n    <i>print</i>(<em>"A"</em>)\n<b>elif</b> marks &gt;= 81:\n    <i>print</i>(<em>"B"</em>)\n<b>elif</b> marks &gt;= 71:\n    <i>print</i>(<em>"C"</em>)',
          [(1, 'B'), (2, 'B then C'), (3, 'A'), (4, 'nothing')],
          '<b>1 &mdash; B.</b> An elif is asked only after the one above said no. Once B matches, C is never asked.', on=True),
    qstep('Q2', 'And this one?',
          'a = 5\n<b>if</b> a &gt; 3:\n    <i>print</i>(<em>"X"</em>)\n<b>if</b> a &gt; 1:\n    <i>print</i>(<em>"Y"</em>)',
          [(1, 'X'), (2, 'Y'), (3, 'X then Y'), (4, 'nothing')],
          '<b>3 &mdash; X then Y.</b> Two separate ifs, both at column zero, both always asked. Make line 4 an elif and Y disappears.'),
    qstep('Q3', 'And this?',
          'marks = 55\n<b>if</b> marks &gt;= 61:\n    <i>print</i>(<em>"D"</em>)\n<b>else</b>:\n    <i>print</i>(<em>"F"</em>)\n<b>elif</b> marks &gt;= 51:\n    <i>print</i>(<em>"E"</em>)',
          [(1, 'F'), (2, 'E'), (3, 'a SyntaxError, nothing prints'), (4, 'F then E')],
          '<b>3 &mdash; SyntaxError, and nothing prints at all.</b> A rung after the else breaks the shape, so Python never starts the file. You built this one yourselves last session.'),
])
poll = block('poll', '&#9889;', 'Warm-Up Poll &mdash; retrieval on session 11',
    pcard('Warm-Up Poll &mdash; three from last session', poll_stage + run([
        'Signal, announced once: fingers for the option, closed fist for unsure, everyone on "three".',
        '25 seconds a question. Read, vote, press Reveal answer, next.',
        'No discussion &mdash; this beat buys pace, not depth.',
        'Never name a student.',
        '!Q2 is the one that matters: "asked again" is the whole of today. A loop is a condition that gets asked again.'])),
    'block-quiz')

hook_stage = ('<div class="stage hk-1" id="stage-hook">' + slhead('Loops', 'Behind the Scenes: Attendance') + HOOK_SVG +
    '<div class="stage-ctl"><button type="button" id="hk-next">When do they stop?</button>'
    '<button type="button" class="ghost" id="hk-replay">Replay</button><span class="ctl-count" id="hk-count"></span></div>' + RULE + '</div>')
hook = block('hook', '&#129693;', 'Hook &mdash; Behind the scenes: attendance',
    pcard('Hook &mdash; Behind the scenes: attendance', hook_stage + run([
        'Ask it straight: sixty of you, every morning. What exactly does the instructor do &mdash; per student? Take three answers, correct nobody.',
        'Press once. The same two lines per roll number, sixty rows. Then ask the room: how do they know when to stop?',
        '!Press again and stop talking. Sixty rows fold into one block. Read the four captions aloud, nothing more. <b>r</b> replays it.',
        'Say it once: one block, one counter, one question asked before every student. That is the whole session.',
        'Attendance starts at 1 and stops after 60. Today\'s code starts at 0 and stops before 3. Both run the right number of times &mdash; that gap is a vote later.'])),
    'block-hook')

agenda = block('agenda', '&#128203;', 'Agenda &mdash; Slide 3',
    slide(3, 8, 'Agenda', [
        'Three stops: what a loop is, the while loop, the mistakes. They have felt the problem; now the plan.',
        'Say: today is one way to write the fold you just saw. The other way, for, is next session.']))

disc_stage = stage('disc', 'Introduction to Loops', 'Your Turn', [
    step('write it', 'Print the next 3 numbers after the input. Write it with what you know. <b>Three minutes. Paper first, then type it and run it with 5.</b>',
         note='You already have everything you need. Expected: 6, 7, 8 &mdash; one per line.', on=True),
    step('now ten', 'Now the next <b>10</b> numbers.', note='Same program. How many lines is it now?'),
    step('now N', 'Now the next <b>N</b> numbers &mdash; where N is a second input. <b>Go.</b>',
         ans='You cannot. Not with what you have. Every copy of the two lines is fixed when you write the program, and N is not known until it runs. You need a way to say: <b>do these two lines again, N times.</b>'),
])
discover = block('discover', '&#9889;', 'Discover it first &mdash; Slide 4 and your turn',
    slide(4, 14, 'Example &mdash; the next 3 consecutive numbers', [
        'Read the problem, nothing else. Do not say the word while; do not point at the eyebrow.',
        '!Everything they need is already known: int(input()), a = a + 1, print. Say so, then go to the panel.']) +
    pcard('Discover it first &mdash; your turn', disc_stage + run([
        'Three minutes quiet, walk the rows. Nearly everyone writes the two lines three times &mdash; that is correct; say so.',
        'Then ten. Let them copy-paste and groan; take the line count from the room, not from you.',
        '!Then N. Give it a full 30 seconds of silence before the reveal &mdash; the stuck feeling is the lesson.',
        'Short of time: skip the ten, go straight from 3 to N.',
        'Do not show the loop yet. The next slide is their own code with the repeat marked.']) +
    key('<p class="note"><b>3:</b> a = a + 1 and print(a), three times &mdash; 5 gives 6 7 8. <b>10:</b> twenty lines. <b>N:</b> impossible without a loop; the count is not known when the program is written.</p>')) +
    cp(1, 'Every student has written the two lines three times and can say why "N numbers" cannot be done that way. If not: put slide 5 up, say it for them once, and move on &mdash; do not re-run the discovery.'),
    'block-activity')

repeat = block('repeat', '&#128216;', 'The block that repeats &mdash; Slide 5',
    slide(5, 16, 'Code &mdash; the block that repeats', [
        'This is what you all wrote. The grey bands are the same two lines, three times.',
        '!Connect it: attendance was the same two lines sixty times. Same problem, same fix.']))

shape = block('shape', '&#128216;', 'The while shape &mdash; Slide 6',
    slide(6, 17, 'While Loop &mdash; the shape', [
        'Left: the shape. while, a condition, a colon, and an indented block that repeats &mdash; four spaces, like if.',
        'Right: their program with the repeating block moved inside. The condition box is empty on purpose.',
        'The dashed arrow is the fold from the hook: after the last line, back to the question.',
        '!Do not fill the condition yet. Two slides build it up, then the room votes on it.']))

init = block('init', '&#128216;', 'Initialization &mdash; Slide 7',
    slide(7, 19, 'Initialization', [
        'Something has to count. counter = 0 before the loop: the block has run zero times so far.',
        'Name it: initialization. In the register it was roll = 1.',
        'print("End") is outside the indent &mdash; it runs once, after the loop is over.']))

vote_stage = stage('vote', 'While Loop', 'What Should the Condition Be?', [
    qstep('vote', 'The block must run <b>exactly three times</b>. counter starts at 0 and goes up by one at the end of each pass. Which condition?',
          PROG_BLANK,
          [(1, 'counter &lt; 3'), (2, 'counter &lt;= 3'), (3, 'counter == 3'), (4, 'counter &lt; 4')],
          '<b>1 &mdash; counter &lt; 3.</b> Asked at 0, 1, 2 &mdash; yes three times &mdash; and no at 3. Options 2 and 4 both run four times. Option 3 never runs at all: 0 == 3 is False the first time it is asked.', on=True),
])
vote = block('vote', '&#9889;', 'Vote &mdash; what should the condition be? &middot; Slide 8',
    slide(8, 21, 'What should the condition be?', [
        'counter = counter + 1 is now the last line of the block: after each pass, count it. Name it: updation.',
        '!Read the question on the slide and go to the vote. Do not answer it.']) +
    pcard('Vote &mdash; what should the condition be?', vote_stage + run([
        'Fingers, fist for unsure, on three. Then 45 seconds arguing with a neighbour, then vote again.',
        '!Vote, argue, vote, reveal. The argument is the intervention; the reveal is only the receipt.',
        'Expect 2 and 4 to get votes: three feels like the number to stop at. That is the off-by-one they meet again at slide 17.',
        'Option 3 is worth one sentence: 0 == 3 is False the first time, so the block runs zero times.',
        'Never name a student. Ask who changed their vote, and why &mdash; hands, not names.'])),
    'block-quiz')

three = block('three', '&#128216;', 'Three parts, labelled &mdash; Slide 9',
    slide(9, 23, 'Initialization, termination condition, updation', [
        'All three labelled. Point at each and say its job in five words.',
        '!Ask the room: which of the three did attendance have? All three &mdash; roll = 1, roll &lt;= 60, roll = roll + 1.']))

ann_stage = stage('ann', 'Worksheet page 1 &middot; Task 1', 'Mark the Parts', [
    step('mark it', 'Worksheet task 1. On the printed program write <b>I</b> beside the initialization, <b>C</b> beside the condition, <b>U</b> beside the updation. Then draw one bracket down the left of every line that repeats.',
         PROG, note='Ninety seconds. Pens. Nobody collects it.', on=True),
])
generic = block('generic', '&#9889;', 'The shape of every while loop &mdash; Slide 10 &middot; Worksheet p.1 task 1',
    slide(10, 24, 'The shape of every while loop', [
        'The shape of every while loop you will ever write: initialization above, condition on the while line, updation inside &mdash; last.',
        '!The updation lives inside the block. If it drifts to column zero it runs once, after the loop, and the loop never ends.']) +
    pcard('Paper &mdash; mark the parts', ann_stage + run([
        'Ninety seconds, silent. Walk the rows and look for a bracket that swallows print("End").',
        '!The self-check is on the sheet: the bracket holds exactly three lines and U is inside it. Say it once.',
        'Short of time: skip this beat; the trace table covers the same ground.']) +
    key('<p class="note"><b>I</b> line 2 &middot; <b>C</b> line 3 &middot; <b>U</b> line 6 &middot; bracket on lines 4&ndash;6. print("End") is outside everything.</p>'),
    sheet='p.1 &middot; task 1'),
    'block-activity')

h1_stage = stage('h1', 'While Loop', 'Type It, Run It', [
    step('type it', 'Type the program from slide 9 exactly. Run it with <b>5</b>.', PROG,
         note='Expected: 6, 7, 8, End &mdash; one per line.', on=True),
    step('two more', 'Now <b>1</b>, then <b>10</b>. Check against the examples on slide 4 before you look at your neighbour\'s screen.',
         note='Seven lines with fifty-five people is three minutes. That is fine.'),
])
hands1 = block('hands1', '&#128187;', 'Hands-on 1 &mdash; Type it and run it',
    pcard('Hands-on 1 &mdash; Type it and run it', h1_stage + run([
        'Seven lines is three minutes for this room. Do not fill the silence.',
        '!Watch for one thing: counter = counter + 1 at column zero. That program never ends &mdash; and it is the bug they meet again in ten minutes.',
        'A playground that hangs: stop button, then check the indent of the last line inside the loop.',
        'Short of time: run 5 only.',
        'Do not explain the trace yet. They have a working program; the next beat is watching it run in slow motion.']) +
    key('<table class="g-data"><tr><th>Input</th><th>Prints</th></tr><tr><td>5</td><td>6 7 8 End</td></tr><tr><td>1</td><td>2 3 4 End</td></tr><tr><td>10</td><td>11 12 13 End</td></tr></table>'
        '<p class="note">Updation at column zero: 6 7 8 9 10 &hellip; forever &mdash; counter stays 0 inside the loop.</p>')) +
    cp(2, 'Every student\'s program prints 6, 7, 8, End for 5, and they can point at the three parts. If not: do not give them silent trace time &mdash; trace passes 2 and 3 aloud with them on the sheet, then go straight to the bugs.'),
    'block-hands')

trace_start = block('tracestart', '&#128216;', 'Trace &mdash; pass one &middot; Slides 11&ndash;12',
    slide(11, 27, 'Trace &mdash; the first ask: True', [
        'Input 5 is in a; counter is 0. The while line is asked: is 0 &lt; 3? True &mdash; the block runs.',
        '!Say "asked", not "checked". The question is asked again on every pass; that word is the whole idea.',
        'Worksheet page 2, task 2: the first six rows are already printed. This is them.']) +
    slide(12, 30, 'Trace &mdash; end of pass one', [
        'End of pass one: a is 6, 6 has printed, counter has become 1.',
        '!Stop here. Do not click on. Passes two and three are the room\'s job, on paper.']))

tt_stage = stage('tt', 'Worksheet page 2 &middot; Task 2', 'Trace Passes Two and Three', [
    step('the program', 'Pass one is filled in for you. Continue the trace: <b>one row for every line that runs</b>, in the order it runs, until the program ends.',
         PROG_NUM, note='Write the value a name has after the line. In the last column, only what the line prints.', on=True),
    step('count', 'Before you look up: how many times does <b>line 3</b> appear in your whole table?',
         note='Then swap sheets with a neighbour and count theirs.'),
])
tracetab = block('tracetab', '&#9889;', 'Activity &mdash; Trace Table &middot; Worksheet p.2 task 2',
    pcard('Activity &mdash; Trace Table', tt_stage + run([
        'They finish alone, four minutes. Say nothing; walk the rows.',
        '!Take the count by hands: line 3 three times, or four? Four is right &mdash; three True, one False. The False row is the one most people miss.',
        'Then swap sheets and count the neighbour\'s. Ninety seconds.',
        'Short of time: skip the swap; take the count and go to slide 13.',
        'Do not reveal rows one at a time here &mdash; slides 13 and 14 are the reveal.']) +
    key('<table class="g-data"><tr><th>Line</th><th>a</th><th>counter</th><th>counter &lt; 3?</th><th>Printed</th></tr>'
        '<tr><td>1</td><td>5</td><td></td><td></td><td></td></tr><tr><td>2</td><td></td><td>0</td><td></td><td></td></tr>'
        '<tr><td>3</td><td></td><td></td><td>True</td><td></td></tr><tr><td>4</td><td>6</td><td></td><td></td><td></td></tr>'
        '<tr><td>5</td><td></td><td></td><td></td><td>6</td></tr><tr><td>6</td><td></td><td>1</td><td></td><td></td></tr>'
        '<tr><td>3</td><td></td><td></td><td>True</td><td></td></tr><tr><td>4</td><td>7</td><td></td><td></td><td></td></tr>'
        '<tr><td>5</td><td></td><td></td><td></td><td>7</td></tr><tr><td>6</td><td></td><td>2</td><td></td><td></td></tr>'
        '<tr><td>3</td><td></td><td></td><td>True</td><td></td></tr><tr><td>4</td><td>8</td><td></td><td></td><td></td></tr>'
        '<tr><td>5</td><td></td><td></td><td></td><td>8</td></tr><tr><td>6</td><td></td><td>3</td><td></td><td></td></tr>'
        '<tr><td>3</td><td></td><td></td><td>False</td><td></td></tr><tr><td>7</td><td></td><td></td><td></td><td>End</td></tr></table>'
        '<p class="note">Sixteen rows. Line 3 appears four times &mdash; three True, one False.</p>'),
    sheet='p.2 &middot; task 2'),
    'block-activity')

trace_end = block('traceend', '&#128216;', 'Trace &mdash; the no &middot; Slides 13&ndash;14',
    slide(13, 39, 'Trace &mdash; the ask that says False', [
        'counter is 3. Is 3 &lt; 3? False. The block is skipped &mdash; not stopped halfway, never entered.',
        '!Fourth time the question was asked, first no. A loop that runs three times asks four times.']) +
    slide(14, 40, 'Trace &mdash; End', [
        'The line after the loop runs once. End.',
        'Ask back: how many rows in your table? Sixteen. How many say End? One.']) +
    cp(3, 'Every trace has line 3 four times &mdash; three True, one False &mdash; and ends with End. If not: keep bugs 1 and 3, drop bug 2 (slide 17).'))

b1_stage = stage('b1', 'Common Mistakes and Errors', 'Type the Tidy Version', [
    step('type it', 'Change your program to match the slide: add the condition line, and make the while line <code>while condition:</code>. Run it with <b>10</b>.',
         'counter = 0\ncondition = (counter &lt; 3)\n<b>while</b> condition:',
         note='Know where your stop button is before you press run.', on=True),
])
bug1 = block('bug1', '&#128187;', 'Bug 1 &mdash; the frozen question &middot; Slides 15&ndash;16',
    slide(15, 43, 'Incorrect Termination Condition &mdash; what will the output be?', [
        'Say: I tidied it &mdash; the condition is in a variable now, cleaner. Then read the question on the slide.',
        '!Vote before anyone types: 1 prints 11 12 13 &middot; 2 prints forever &middot; 3 an error &middot; 4 prints nothing. Fingers.',
        'Take no answers. Go to the panel.']) +
    pcard('Hands-on 2 &mdash; the tidy version', b1_stage + run([
        '!Before they press run: point at the stop button. Every student. Then run.',
        'It prints 11, 12, 13, 14 &hellip; and never stops. Let the room react for ten seconds.',
        'Ask: when was counter &lt; 3 asked? Once &mdash; on line 3, before the loop. The while line only reads a saved answer.',
        'Stop it. Restore while counter &lt; 3 and confirm three lines print again.',
        'Short of time: run this one on your screen, not theirs.']) +
    key('<p class="note">Infinite: 11 12 13 14 &hellip; condition was computed once and is True forever. Fix: the comparison goes back on the while line.</p>')) +
    slide(16, 44, 'Infinite Loop &mdash; the frozen question', [
        'The pink line is the bug: it asked the question once and kept the answer.',
        '!The while line must hold the question, not a saved answer. A question gets asked again; an answer does not.']),
    'block-hands')

b2_stage = stage('b2', 'Common Mistakes and Errors', 'Start at One', [
    step('predict', 'Working program back. Say: humans count from 1 &mdash; change <code>counter = 0</code> to <code>counter = 1</code>. <b>Predict on fingers: how many numbers print?</b>',
         note='One, two, three or four. Everyone on three.', on=True),
    step('run it', 'Run it with <b>1</b>.', note='Slide 4 says input 1 should give 2, 3, 4.'),
])
bug2 = block('bug2', '&#128187;', 'Bug 2 &mdash; start at one &middot; Slide 17',
    pcard('Hands-on 3 &mdash; humans count from 1', b2_stage + run([
        'Vote first: one, two, three or four numbers. Fingers.',
        'Run. Two numbers. No error, nothing red &mdash; and wrong.',
        '!Say it: it ran, it printed, and it is wrong. Silent bugs are the ones that get shipped.',
        'Two fixes: back to 0, or &lt; 4. Which pair matches the hook? roll = 1 with &lt;= 60. Either pair works; a mixed pair does not.',
        'Short of time: skip this bug; the vote at slide 8 already covered it.']) +
    key('<p class="note">Input 1 &rarr; 2 3 End. Two passes (counter 1, 2); the third ask fails at 3. Fixes: counter = 0, or while counter &lt; 4.</p>')) +
    slide(17, 45, 'Incorrect Termination Condition &mdash; counter = 1', [
        'Initialization and condition are a pair. Change one, change the other.',
        '!Off by one is the most common loop bug they will ever write. Name it now.']),
    'block-hands')

b3_stage = stage('b3', 'Common Mistakes and Errors', 'Save a Line', [
    step('predict', 'Restore <code>counter = 0</code>. Now say: the last line looks like clutter &mdash; delete <code>counter = counter + 1</code>. <b>Predict: what prints?</b>',
         note='Three numbers, forever, or an error.', on=True),
    step('run it', 'Run it with <b>5</b>. Stop button ready.', note='Watch the first three lines before you judge it.'),
])
bug3 = block('bug3', '&#128187;', 'Bug 3 &mdash; no movement &middot; Slide 18',
    pcard('Hands-on 4 &mdash; save a line', b3_stage + run([
        'Vote: three numbers, forever, or an error. Fingers.',
        '!It prints 6, 7, 8 &mdash; and then 9, 10, 11, forever. For one second it looks correct. That is the trap.',
        'Stop it. Ask: what is counter after pass one? Still 0. 0 &lt; 3 is True every single time.',
        'Restore the line. Then the sentence: no updation, the question gets the same answer forever.',
        'Short of time: describe it instead of running it; the slide shows the code.']) +
    key('<p class="note">6 7 8 9 10 11 &hellip; infinite; counter never changes. Delete the initialization instead and you get <code>NameError: name \'counter\' is not defined</code> &mdash; the only one of these that tells you what is wrong.</p>')) +
    slide(18, 46, 'Not Updating Counter Variable', [
        'Three parts, three ways to break: frozen question, wrong start, no movement. Two loop forever; one runs short and says nothing.',
        '!Ask back: which of the three would attendance be? Never moving on to the next roll number.']) +
    cp(4, 'Every student can say which edit looped forever and which ran short with no error. If not: put the first three lines of the square program on the board and let them write only the while body.'),
    'block-hands')

sqprob = block('sqprob', '&#128216;', 'Square Pattern &mdash; the problem &middot; Slides 19&ndash;20',
    slide(19, 47, 'Square Pattern', [
        'Read the spec. Do not solve it. Ask: what is the block that repeats? One row of stars.',
        '!Say nothing about how to make one row &mdash; they know string repetition. If nobody offers it, ask what "* " * 4 gives.']) +
    slide(20, 49, 'Output Format &mdash; a space after every star', [
        'Space after every star &mdash; inside the quotes. The checker is strict about it.',
        'N is 5 here. Their test inputs are 4, then 5, then 1.']))

au_stage = stage('au', 'Worksheet page 3 &middot; Task 3', 'Write It Yourself', [
    step('on paper', 'Worksheet task 3. Write the whole program <b>on paper first</b> &mdash; five lines. Three minutes.',
         'Input: one integer n.      Output: n rows, n stars each, a space after every star.\n\n'
         '4   ->   * * * *         3   ->   * * *\n'
         '         * * * *                  * * *\n'
         '         * * * *                  * * *\n'
         '         * * * *',
         note='Initialization, condition, one row, updation. Which order?', on=True),
    step('type it', 'Type what you wrote. Run with <b>4</b>, then <b>5</b>, then <b>1</b>. Count the rows; count the stars in a row.',
         note='If the rows stay at 4 when you type 5, a number is sitting where n should be.'),
])
author = block('author', '&#128187;', 'Hands-on 5 &mdash; Write it yourself &middot; Worksheet p.3 task 3',
    pcard('Hands-on 5 &mdash; Write it yourself', au_stage + run([
        'Paper first, three minutes, quiet. Then type. Nine minutes in all; do not rush the paper.',
        '!Two bugs to look for as you walk: "*" * n with no space, and &lt;= n giving one extra row. Do not fix them &mdash; ask what 4 and 5 gave.',
        'A finished student tests 1 and 0. Zero rows for 0 is correct, and it surprises them.',
        'Short of time: put the first three lines on the board; they write the two inside the loop.',
        'Do not put slide 21 up until most screens show a square.']) +
    key('<pre class="slabcode">n = <i>int</i>(<i>input</i>())\ncounter = 0\n<b>while</b> counter &lt; n:\n    <i>print</i>(<em>"* "</em> * n)\n    counter = counter + 1</pre>'
        '<table class="g-data"><tr><th>Input</th><th>Prints</th></tr><tr><td>4</td><td>four rows of <code>* * * * </code></td></tr><tr><td>5</td><td>five rows of five</td></tr><tr><td>1</td><td><code>* </code></td></tr><tr><td>0</td><td>nothing, no error</td></tr></table>'
        '<p class="note"><code>"*" * n</code> prints <code>****</code> with no spaces. <code>counter &lt;= n</code> prints n + 1 rows.</p>'),
    sheet='p.3 &middot; task 3'),
    'block-hands')

sqsol = block('sqsol', '&#128216;', 'Square Pattern &mdash; the solution &middot; Slide 21',
    slide(21, 50, 'Square Pattern &mdash; solution', [
        'Compare, do not read. Same three parts as slide 10; the block is one print.',
        '"* " * n is the row; the loop is the column. Two different repeats &mdash; one is a string, one is a loop.',
        '!counter &lt; n, not 3: the number of rows comes from the input. That is what the hand-copied version could never do.']) +
    cp(5, 'The square prints n rows for both 4 and 5 on most screens. If not: the exit still runs in full &mdash; drop the three questions at slide 22 and read the bullets instead.'))

recap = block('recap', '&#128216;', 'Recap &mdash; Key Takeaways &middot; Slide 22',
    slide(22, 51, 'Key Takeaways', [
        'Do not read the bullets. Three questions, hands, ten seconds each.',
        'For a loop that runs three times, how many times is the while line asked?',
        'Which missing part gives an error instead of an infinite loop?',
        'In the attendance register, which line was the updation?',
        '!Answers: four &middot; initialization, a NameError &middot; roll = roll + 1.']))

ex_stage = stage('exit', 'Worksheet page 4 &middot; Task 4', 'Does It Do What It Claims?', [
    step('trace', 'Worksheet task 4. The input is <code>Python</code>. Fill the table: <b>one row per time the while line is asked.</b> Then write your verdict &mdash; does it print the whole word?',
         EXIT_NUM, note='Three minutes. Pens.', on=True),
    step('fix', 'Change <b>one thing</b> so that it does. Write the new line 4 on your sheet, then type it and run it.',
         note='Ninety seconds. Run it with Python, then with a word of your own.'),
])
exit_ = block('exit', '&#127919;', 'Exit Activity &mdash; Does it do what it claims? &middot; Slide 23 &middot; Worksheet p.4 task 4',
    slide(23, 53, 'Daily Challenge &mdash; Identify the Mistake', [
        'Read the claim: each letter on its own line. Ask nothing. Go to the panel.',
        '!Hard floor: whatever is unfinished elsewhere, stop it and start this.']) +
    pcard('Exit Activity &mdash; Does it do what it claims?', ex_stage + run([
        'Three minutes tracing, silent. The self-check is on the sheet: exactly one False, nothing below it.',
        '!Take the verdict by hands: whole word, or not? Then the missing letter: n.',
        'Two fixes are right: drop the - 1, or make it &lt;=. Take both from the room; do not prefer one.',
        'Ninety seconds to type and confirm. That is the last thing they do today.',
        'Never name a student. Ask for a hand from someone with six filled rows and someone with seven.']) +
    key('<p class="note">Prints <b>P y t h o</b> &mdash; five letters, n missing. length_of_a is 6, so the question is counter &lt; 5: asked for 0, 1, 2, 3, 4, 5 &mdash; True five times, False at 5. Six rows filled. Fix: <code>while counter &lt; length_of_a:</code> or <code>while counter &lt;= length_of_a - 1:</code>.</p>'),
    sheet='p.4 &middot; task 4'),
    'block-exit')

close = block('close', '&#9201;', 'Close &mdash; Slides 24&ndash;25 &middot; Buffer',
    slide(24, 54, 'Next Session &mdash; For Loop', [
        'Next session: the for loop &mdash; the other way to write the same three parts, in one line.',
        'Take-home: they fixed the daily challenge already. Tell them to run the fixed version once at home with their own name.']) +
    slide(25, 56, 'Thank You') +
    '<p class="note">Anything left after slide 25 is buffer. If the room is on time the session ends here. <b>Do not start new content.</b></p>',
    'block-buffer')

blocks = ''.join([opening, poll, hook, agenda, discover, repeat, shape, init, vote, three, generic, hands1,
                  trace_start, tracetab, trace_end, bug1, bug2, bug3, sqprob, author, sqsol, recap, exit_, close])

# ---------------------------------------------------------------- guide
guide = '''<div id="guide-view">
<h1 class="g-h1">Instructor guide</h1>

<section class="g-sec">
<h3>1 &middot; The one idea</h3>
<p>A while loop is <b>a question asked again</b>. <code>while counter &lt; 3:</code> is asked four times for a loop that
runs three: three yeses, one no. Three lines make it work &mdash; a start (<code>counter = 0</code>), the question, and a
move (<code>counter = counter + 1</code>) inside the block, last. Freeze the question or forget the move and it never
stops. Start at the wrong number and it silently runs short.</p>
<p class="g-meta" style="margin:0">Say it at slide 6. Ask for it back at slide 22.</p>
</section>

<section class="g-sec">
<h3>2 &middot; Before you walk in</h3>
<ul class="brief">
<li>Print the worksheet &mdash; four pages, single-sided, one each. The <b>Student worksheet</b> button prints the sheets only.</li>
<li>Open the code playground, font sized for the back row, line numbers on.</li>
<li class="hot">Find the stop button and press it once on an infinite loop of your own. Two beats today run one on every laptop in the room.</li>
<li>Presenter view, then <b>f</b> for full screen. <b>a</b> all slides &middot; <b>g</b> guides &middot; <b>r</b> replay &middot; <b>Esc</b> out. If full screen refuses, you are in a preview pane &mdash; open the file in its own browser tab.</li>
<li class="hot">Never cut: the hook &middot; the N-numbers discovery &middot; the vote at slide 8 &middot; the line-3 count &middot; bug 3 &middot; the exit.</li>
</ul>
</section>

<section class="g-sec">
<h3>3 &middot; If they ask</h3>
<ul class="brief">
<li><b>Why start at 0 and not 1?</b> Either works if the condition matches: 0 with <code>&lt; 3</code>, or 1 with <code>&lt;= 3</code>. Programmers start at 0 because positions in a string start at 0 &mdash; <code>a[0]</code> is the first letter. Today's exit uses exactly that.</li>
<li><b>What if the square's input is 0?</b> The question is asked once, gets no, the block never runs. Zero rows &mdash; correct, and no error.</li>
<li><b>Can I write <code>counter += 1</code>?</b> Yes, same thing. Use the long form this week so all three parts stay visible.</li>
<li><b>Does it really print forever?</b> Until you stop it or the playground runs out of room for the output. The stop button ends the program; nothing is damaged.</li>
<li><b>Is while the same as if?</b> An if asks once. A while asks, runs the block, and asks again. Same shape of question, different number of asks.</li>
</ul>
</section>
</div>'''

# ---------------------------------------------------------------- worksheet
def shead(p, total=4):
    return (f'<div class="sh-band"><span class="t">{TITLE}</span>'
            f'<span class="s">{COURSE}</span><span class="p">page {p} of {total}</span></div>')
def sfoot(p, total=4):
    return ('<div class="sh-foot"><span>Not collected &mdash; keep this sheet</span>'
            f'<b>page {p} of {total}</b></div>')
def task(n, head, body):
    return (f'<div class="task"><div class="task-hd"><span class="badge">{n}</span>'
            f'<span class="h">{head}</span></div>{body}</div>')

def code_rows(lines):
    return ''.join(f'<tr><td class="ln">{i}</td><td style="height:6mm"></td><td class="c">{html.escape(l)}</td></tr>' for i, l in enumerate(lines, 1))

t1 = task(1, 'Mark the parts',
    '<p class="task-instr">In the left column write <b>I</b> beside the initialization, <b>C</b> beside the condition, '
    '<b>U</b> beside the updation. Then draw one bracket down the left of every line that repeats.</p>'
    '<table class="w tr"><tr><th style="width:9%">Line</th><th style="width:12%">Mark</th><th>Program</th></tr>' +
    code_rows(['a = int(input())', 'counter = 0', 'while counter < 3:', '    a = a + 1', '    print(a)',
               '    counter = counter + 1', 'print("End")']) +
    '</table><div class="selfck"><b>Check your own</b><p>One I, one C, one U. Your bracket holds exactly three lines, and your U is '
    'inside it. print("End") is outside every mark &mdash; if it is inside your bracket, End would print three times.</p></div>')

def tr(line, a='', c='', q='', p='', pre=False):
    cell = lambda v: f'<td style="height:6mm;color:var(--pr-soft)">{v}</td>' if pre else '<td style="height:6mm"></td>'
    ln = f'<td class="ln">{line}</td>' if line else '<td class="ln"></td>'
    return '<tr>' + ln + cell(a) + cell(c) + cell(q) + cell(p) + '</tr>'

pre_rows = (tr(1, a='5', pre=True) + tr(2, c='0', pre=True) + tr(3, q='True', pre=True) +
            tr(4, a='6', pre=True) + tr(5, p='6', pre=True) + tr(6, c='1', pre=True))
blank_rows = ''.join(tr('') for _ in range(10))
t2 = task(2, 'Trace table &mdash; passes two and three',
    '<p class="task-instr">The program is the one in task 1. Pass one is printed in grey. Continue it: <b>one row for every line that runs</b>, in the order it runs, until the program ends.</p>'
    '<p class="tracelab">Input: <b>5</b> &mdash; write a value only when that line changes it</p>'
    '<table class="w tr"><tr><th style="width:10%">Line</th><th style="width:16%">a</th><th style="width:16%">counter</th>'
    '<th style="width:24%">counter &lt; 3 ?</th><th>Printed</th></tr>' + pre_rows + blank_rows + '</table>'
    '<div class="selfck"><b>Check your own</b><p>Line 3 appears exactly four times in your whole table: three True, one False. '
    'Your last row is line 7. If line 3 appears only three times, you never asked the question that stops the loop.</p></div>')

t3 = task(3, 'Square pattern &mdash; write it yourself',
    '<p class="task-instr">Read an integer <b>n</b>. Print stars in n rows and n columns, with a space after every star. '
    'Write the whole program here <b>before</b> you type it. Five lines.</p>'
    '<div class="cue"><b>You already know:</b> "* " * 4 gives <span style="font-family:var(--sh-mono)">* * * * </span> &mdash; the space is inside the quotes.</div>'
    '<table class="w"><tr><th style="width:10%">Line</th><th>Your program</th></tr>' +
    ''.join(f'<tr><td class="c">{i}</td><td style="height:9mm"></td></tr>' for i in range(1, 7)) +
    '</table><div class="selfck"><b>Check your own, then type it</b><p>Run it with 4, then 5, then 1. Rows equal the input? Stars in each row equal the input? '
    'If the rows stay at 4 when you type 5, a number is sitting where n should be. If the stars touch, the space is missing.</p></div>')

exit_rows = ''.join(f'<tr><td class="ln">{i}</td><td style="height:7mm"></td><td></td></tr>' for i in range(0, 7))
t4 = task(4, 'Does it do what it claims?',
    '<div class="cue">This program is meant to print <b>each letter of the input on its own line</b>. Trace it for the input '
    '<span style="font-family:var(--sh-mono)">Python</span> and decide whether it does.</div>'
    '<pre>1  a = input()\n2  counter = 0\n3  length_of_a = len(a)\n4  while counter &lt; (length_of_a - 1):\n5      print(a[counter])\n6      counter = counter + 1</pre>'
    '<p class="tracelab">length_of_a = ______ &nbsp;&nbsp; so line 4 asks: counter &lt; ______ &nbsp;&nbsp;&mdash; one row each time it is asked</p>'
    '<table class="w tr"><tr><th style="width:18%">counter</th><th style="width:34%">line 4 &mdash; True or False?</th><th>Printed</th></tr>' + exit_rows + '</table>'
    '<p class="task-instr">Verdict &mdash; does it print the whole word? &nbsp; <b>yes</b> &nbsp;/&nbsp; <b>no</b> &nbsp;&nbsp;&nbsp;&nbsp; '
    'Change one thing so that it does. New line 4:</p>'
    '<div class="oneline"><i style="height:10mm"></i></div>'
    '<div class="selfck"><b>Check your own</b><p>Exactly one row says False, and every row under it is empty. Count the letters you printed against the word.</p></div>')

handout = f'''<div id="handout-view">
<h1 class="g-h1">Student worksheet</h1>
<div class="h-actions">
<button type="button" id="print-handout">Print / save as PDF</button>
<span>Prints these four sheets only, at A4. Set your printer to single-sided.</span>
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
<div class="sheet">{shead(4)}
{t4}
{sfoot(4)}</div>
</div>'''

# ---------------------------------------------------------------- nav
CHECKPOINTS = [
 ('Checkpoint 1 &middot; 14 min', [('opening','k-concept',1,'Opening'),
                                   ('poll','k-quiz',3,'Warm-Up Poll'),
                                   ('hook','k-hook',4,'Hook &middot; attendance'),
                                   ('agenda','k-concept',1,'Agenda'),
                                   ('discover','k-activity',5,'Discover &middot; N numbers')]),
 ('Checkpoint 2 &middot; 30 min', [('repeat','k-concept',1,'The block that repeats'),
                                   ('shape','k-concept',2,'The while shape'),
                                   ('init','k-concept',1,'Initialization'),
                                   ('vote','k-quiz',3,'Vote &middot; the condition'),
                                   ('three','k-concept',1,'Three parts, labelled'),
                                   ('generic','k-activity',3,'Paper &middot; mark the parts'),
                                   ('hands1','k-hands',5,'Hands-on 1 &middot; type and run')]),
 ('Checkpoint 3 &middot; 41 min', [('tracestart','k-concept',2,'Trace &middot; pass one'),
                                   ('tracetab','k-activity',7,'Activity &middot; trace table'),
                                   ('traceend','k-concept',2,'Trace &middot; the no')]),
 ('Checkpoint 4 &middot; 51 min', [('bug1','k-hands',4,'Bug 1 &middot; frozen question'),
                                   ('bug2','k-hands',3,'Bug 2 &middot; start at one'),
                                   ('bug3','k-hands',3,'Bug 3 &middot; no movement')]),
 ('Checkpoint 5 &middot; 64 min', [('sqprob','k-concept',2,'Square &middot; the problem'),
                                   ('author','k-hands',9,'Hands-on 5 &middot; write it yourself'),
                                   ('sqsol','k-concept',2,'Square &middot; the solution')]),
 ('Hard floor &middot; 66 min',   [('recap','k-concept',2,'Recap'),
                                   ('exit','k-exit',6,'Exit &middot; does it do what it claims?'),
                                   ('close','k-buffer',3,'Close')]),
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

# nav order must equal block order
nav_ids = [i for _, items in CHECKPOINTS for i, _, _, _ in items]
blk_ids = re.findall(r'<section class="block[^"]*" id="([^"]+)"', blocks)
assert nav_ids == blk_ids, f'nav/block mismatch:\n{nav_ids}\n{blk_ids}'

# ---------------------------------------------------------------- assemble
tpl = (SKILL / 'plan-template.html').read_text(encoding='utf8')

def swap(s, a, b, count=1):
    assert s.count(a) == count, f'expected {count} of {a[:60]!r}, found {s.count(a)}'
    return s.replace(a, b)

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
            'freeze the question or forget the move and it never stops, start at the wrong number and it silently runs short.')

doc = (tpl.replace('{{SESSION_TITLE}}', TITLE)
          .replace('{{ONE_IDEA}}', ONE_IDEA)
          .replace('{{NAV}}', nav)
          .replace('{{BLOCKS}}', blocks)
          .replace('{{GUIDE}}', guide)
          .replace('{{HANDOUT}}', handout))
assert '{{' not in doc, 'unfilled placeholder'
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(doc, encoding='utf8')
print('written', OUT, round(len(doc)/1024/1024, 2), 'MB')
