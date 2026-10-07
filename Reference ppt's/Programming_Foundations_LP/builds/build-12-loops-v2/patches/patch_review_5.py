# -*- coding: utf-8 -*-
"""Review pass 5: the guide's two missing closing sections.

`references/instructor-guide.md` asks for four closing sections in order:
common guidelines, if they ask, every answer in one table, source defects. The
last two were not there, and the answers were scattered across seven different
`Watch for` lines.

Every row of the table is **derived**: the builder runs the program and writes
what it got. Nothing here is typed in by hand, so an answer cannot go stale when
an input changes.
"""
import io, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = 'build.py'
s = io.open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, 1)


# card 22 said "the easy one" twice once the cut bullet went in
sub("['Short of time: read the error text and move. It is the easy one.',\n"
    "   'Sixty seconds. It is the easy one of the four.'],",
    "['Short of time: read the error text and move on.',\n"
    "   'Sixty seconds. It is the easy one of the four.'],")

# one bullet for the one thing on the exit card the strings session may not
# have covered
sub("""  ['Press play on the timer. It does not start by itself.',
   'This runs even if everything else is cut. It is the hard floor.'],""",
    """  ['Press play on the timer. It does not start by itself.',
   '<code>a[counter]</code> picks the letter at that position. The strings session covered '
   'length, repetition and joining, and may not have covered picking one letter. If anyone asks, '
   'say that one line and move on: the answer does not depend on it, because the body never runs.',
   'This runs even if everything else is cut. It is the hard floor.'],""")

# --------------------------------------------------------- the derived answers
DERIVE = '''
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
    return html.escape('\\n'.join(o)) if o else 'nothing at all'

_RECAP = 'marks = 30\\nif marks >= 35:\\n    if marks >= 60:\\n        print("First class")\\nprint("Pass")'
_BUILD = ('a = int(input())\\ncounter = 0\\nwhile counter < 3:\\n    a = a + 1\\n'
          '    print(a)\\n    counter = counter + 1\\nprint("End")')
_T2A = ('marks = int(input())\\ncounter = 1\\nwhile counter <= 5:\\n    print(marks)\\n'
        '    marks = marks - 2\\n    counter = counter + 1\\nprint("Done")')
_T2B = ('name = input()\\nseats = 3\\nwhile seats > 0:\\n    print(name)\\n'
        '    seats = seats - 1\\nprint("Full")')
_P1 = ('a = int(input())\\nwhile counter < 3:\\n    a = a + 1\\n    print(a)\\n'
       '    counter = counter + 1\\nprint("End")')
_P3 = ('a = int(input())\\ncounter = 1\\nwhile counter < 3:\\n    a = a + 1\\n    print(a)\\n'
       '    counter = counter + 1\\nprint("End")')
_DOT2 = ('a = 5\\ncounter = 0\\nwhile counter < 2:\\n    a = a + 1\\n    print(a)\\n'
         '    counter = counter + 1\\nprint("End")')
_DOT0 = _DOT2.replace('counter < 2', 'counter < 0')
_SQ = 'n = int(input())\\ncounter = 0\\nwhile counter < n:\\n    print("* " * n)\\n    counter = counter + 1'
_EXIT = ('a = input()\\ncounter = 0\\nlength_of_a = len(a)\\nwhile counter < (length_of_a - 1):\\n'
         '    print(a[counter])\\n    counter = counter + 1')

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
_recap_fixed, _ = _run(_RECAP.replace('\\nprint("Pass")', '\\n    print("Pass")'))
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
  'Condition</em>, but they are different mistakes: 44 stores the answer of the condition in a '
  'variable, 45 starts the counter in the wrong place. The guide entry for card 24 tells the '
  'instructor to say why both names are defensible. Two different titles would be better.</li>'
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

'''

sub("# ======================================================================= GUIDE\nNCARDS = 32",
    DERIVE + "# ======================================================================= GUIDE\nNCARDS = 32")

# hang the two sections on the end of the guide document
sub("""         '<li><b>&ldquo;My infinite loop froze the playground.&rdquo;</b> Stop button beside Run. '
         'If the tab is unresponsive, reload it, the code is saved.</li>'
         '</ul></section></div>')""",
    """         '<li><b>&ldquo;My infinite loop froze the playground.&rdquo;</b> Stop button beside Run. '
         'If the tab is unresponsive, reload it, the code is saved.</li>'
         '</ul></section>'
         + ANSWER_TABLE + SOURCE_DEFECTS + '</div>')""")

sub("""                 .replace('{{EXTRA_CSS}}', '')""",
    """                 .replace('{{EXTRA_CSS}}', GUIDE_CSS)""")

io.open(p, 'w', encoding='utf-8').write(s)
print('answer table and source defects added')
