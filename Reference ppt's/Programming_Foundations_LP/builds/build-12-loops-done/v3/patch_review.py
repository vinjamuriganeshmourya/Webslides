"""Review fixes 1-9 applied to the v3 builder. Each replacement asserts it matched exactly once."""
from pathlib import Path
p = Path(__file__).with_name('build.py')
s = p.read_text(encoding='utf8')

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, f'{s.count(a)} of {a[:70]!r}'
    s = s.replace(a, b)

# 1 worksheet hand-out moment
rep("        'Take attendance while this is up. Notice what you do for each student &mdash; you will use it in five minutes.',\n        'Say nothing about the topic.']) +",
    "        'Take attendance while this is up. Notice what you do for each student &mdash; you will use it in five minutes.',\n"
    "        '!Hand out the worksheet now, one set each, face down. The discovery writes on its blank side.',\n"
    "        'Say nothing about the topic.']) +")

# 2 explainer: predict at 5, not at the value slide 11 just answered; a = 5 explained
rep('<label>the 3 is: 3</label><input type="range" min="0" max="5" value="3" step="1"',
    '<label>the 3 is: 5</label><input type="range" min="0" max="5" value="5" step="1"')
rep("('wl3', '<b>while</b> counter &lt; <i id=\"wlim\">3</i>:'),", "('wl3', '<b>while</b> counter &lt; <i id=\"wlim\">5</i>:'),")
rep('<text x="210" y="185" text-anchor="middle" id="wdtext">counter &lt; 3 ?</text>',
    '<text x="210" y="185" text-anchor="middle" id="wdtext">counter &lt; 5 ?</text>')
rep("'<div class=\"stage-step on\" data-label=\"walk\"><p class=\"stage-q\">The dot is Python. The slider sets the 3. '\n"
    "    '<b>Before Play: write in your sheet margin how many times the question will be asked.</b> Then watch the diamond.</p>'",
    "'<div class=\"stage-step on\" data-label=\"walk\"><p class=\"stage-q\">The dot is Python. The slider sets the 3 &mdash; it starts at 5. '\n"
    "    '<b>Before Play: write in your sheet margin how many times the question will be asked for 5.</b> Then watch the diamond.</p>'")
rep("""        'Slider at 3. Ask: how many times will the diamond be visited? Fingers, then Play. The "asked" counter settles it: four.',
        '!Slider to 0. Ask: what prints? Fingers. Play. One ask, no, End &mdash; and the whole block stays grey. That grey is the finding.',
        'Slider to 5. One step, one step. Stop on the diamond each time and ask the room for True or False before you press again.',
        'Reset restores everything. <b>r</b> also replays it.',
        'Short of time: 3 and 0 only.']),""",
    """        'Slider starts at 5. Ask: how many times will the diamond be visited? Fingers, then Play. Six &mdash; the "asked" counter settles it.',
        '!Slider to 0. Ask: what prints? Fingers. Play. One ask, no, End &mdash; and the whole block stays grey. That grey is the finding.',
        'Slider to 3. One step, one step. Stop on the diamond each time and ask for True or False before you press again.',
        'a is fixed at 5 so the room can predict; the input line is the only difference from their program. Reset or <b>r</b> restarts it.',
        'Short of time: 5 and 0 only.']),""")

# 3 line count: no fingers for 21
rep("'Then count the lines in your program and hold up that many fingers &mdash; two hands if you need them.',\n         note='Copy-paste is allowed. Expect twenty-one lines.'),",
    "'Then count the lines in your program, write the number in the margin of your sheet, and hold the sheet up.',\n         note='Copy-paste is allowed. Expect twenty-one.'),")
rep("'Then ten. Let them copy-paste and groan. Take the line count from the fingers, not from you.',",
    "'Then ten. Let them copy-paste and groan. Read the line count off the raised sheets, not from you.',")

# 4 bracket location, panel and sheet
rep("'Then draw <b>one bracket</b> down the left edge of every line that repeats. <b>Ninety seconds. Pens.</b>',",
    "'Then, inside the Program column, draw <b>one bracket</b> to the left of the code, down every line that repeats. <b>Ninety seconds. Pens.</b>',")
rep("'<b>U</b> beside the updation line &mdash; one letter each. Then draw <b>one bracket</b> down the left edge of every line that repeats.</p>'",
    "'<b>U</b> beside the updation line &mdash; one letter each. Then, inside the Program column, draw <b>one bracket</b> to the left of the code, down every line that repeats.</p>'")

# 5 slide 10 note matches the pre-printed rows
rep("'Input 5. Line 3 is asked: is 0 &lt; 3? True. Say the first two rows of the trace aloud, exactly as they will write them.',",
    "'Input 5. Rows 1 and 2 are already printed on their sheet. Say row 3 aloud, exactly as they will write it: line 3, 0 &lt; 3, True.',")

# 6 exit E2 is a fresh variant, E3 wording follows
rep("""    qstep('E2', 'Line 2 becomes <code>counter = 1</code>. Input is 1. What prints?',
          '1  a = <i>int</i>(<i>input</i>())\\n2  counter = 1\\n3  <b>while</b> counter &lt; 3:\\n4      a = a + 1\\n5      <i>print</i>(a)\\n6      counter = counter + 1\\n7  <i>print</i>(<em>"End"</em>)',
          [(1, '2 3 4 End'), (2, '2 3 End'), (3, 'numbers forever'), (4, 'an error')],
          '<b>2 &mdash; 2 3 End.</b> Two passes: counter 1 and 2. At 3 the question says no. It ran, it printed, and it is wrong &mdash; no error.'),
    qstep('E3', 'Line 3 becomes <code>while counter &lt; 0:</code> and line 2 is back to <code>counter = 0</code>. Input is 5. What prints?',""",
    """    qstep('E2', 'Line 3 becomes <code>while counter &lt; 2:</code>. Input is 7. What prints?',
          '1  a = <i>int</i>(<i>input</i>())\\n2  counter = 0\\n3  <b>while</b> counter &lt; 2:\\n4      a = a + 1\\n5      <i>print</i>(a)\\n6      counter = counter + 1\\n7  <i>print</i>(<em>"End"</em>)',
          [(1, '8 9 End'), (2, '8 9 10 End'), (3, '8 End'), (4, 'numbers forever')],
          '<b>1 &mdash; 8 9 End.</b> Asked at 0 and 1 &mdash; yes twice &mdash; and no at 2. Two runs, three asks, then the line after the loop.'),
    qstep('E3', 'Line 3 becomes <code>while counter &lt; 0:</code>. Input is 5. What prints?',""")

# 7 predict before the second run
rep("'Then run it with <b>1</b>: you should see 2, 3, 4, End.',",
    "'Then, before you run it with <b>1</b>, write in the margin what it will print. Run it. Compare.',")

# 8 agenda note matches the slide
rep("'Three stops: what a loop is, the while loop, the mistakes. They have felt the problem; now the plan.',",
    "'Three stops on the slide: loops, the while loop, then the code walkthrough &mdash; that is where the mistakes live. They have felt the problem; now the plan.',")

# 9 cosmetic: distinct band labels; guide trimmed under 400 words
rep("('Hard floor &middot; 69 min',   [('exit','k-exit',6,'Exit poll')]),",
    "('Hard floor &middot; exit at 69 min', [('exit','k-exit',6,'Exit poll')]),")
rep("<li><b>What does while True do?</b> A question that is always yes. It is a real pattern, with a break inside &mdash; next month, not today.</li>\n", "")

p.write_text(s, encoding='utf8')
print('patched')
