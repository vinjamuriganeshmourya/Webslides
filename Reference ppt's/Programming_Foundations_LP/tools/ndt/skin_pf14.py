"""PF 14 For Loop, redrawn in the New Design Template look.

Reads the current student view and writes <name>_new_design.html next to it.
Card indices are the presenter's order (document order of .slide / .pcard).
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ndt import *

SRC = r'C:\Lesson Plans New\Plans\Programming Foundations\14 - For Loop\14_for_loop_student_view.html'
DST = SRC.replace('_student_view.html', '_student_view_new_design.html')

K = lambda w: f'<span class="k">{w}</span>'
V = lambda w: f'<span class="v">{w}</span>'

WHILE_BUG = ['a = input()', 'counter = 0', 'length_of_a = len(a)',
             'while counter < (length_of_a - 1):', '    print(a[counter])', '    counter = counter + 1']
WHILE_FIX = ['a = input()', 'counter = 0', 'length_of_a = len(a)',
             'while counter < length_of_a:', '    print(a[counter])', '    counter = counter + 1']
FOR_WORD = ['word = "Python"', 'for each_char in word:', '    print(each_char)']
PY_COL = 'P\ny\nt\nh\no\nn'
STARS = '*\n* *\n* * *\n* * * *'

S = {}
S[0] = welcome()
S[1] = recap('Where We Left Off', [
    ('A while loop repeats a block of code', 'As long as its condition is True'),
    ('It needs three lines to work', 'A start value, a condition, and an update'),
    ('Miss the update and it never stops', 'The condition stays True for ever'),
])
S[5] = session_title('For Loop')
S[6] = agenda([('For Loop', 'Walk through a sequence, one item at a time'),
               ('Range', 'Make a sequence of numbers'),
               ('The Star Pattern', 'Write it yourself'),
               ('The One Mistake', 'The one everybody makes')])
S[7] = light('Daily Challenge', 'Identify the Mistake',
             'The input is Python. Every letter should print on its own line.',
             code(WHILE_BUG, 'mistake.py', size=21, loop=(4, 6)) +
             '<div class="nd-col">' + io('in', 'Python') + io('exp', PY_COL) + '</div>')
S[8] = light('Daily Challenge', 'Identify the Mistake',
             'One character, and the last letter comes back.',
             code(WHILE_FIX, 'mistake.py', size=21, warn={4}, loop=(4, 6)) +
             '<div class="nd-col">' + io('in', 'Python') + io('out', PY_COL) + '</div>')
S[9] = light('While Loop', 'Can We Simplify This?',
             'Three lines in this loop only keep count. None of them prints anything.',
             '<div style="margin-right:300px">' +
             code(['a = "Python"', 'length_of_a = len(a)', 'counter = 0', 'while counter < length_of_a:',
                   '    print(a[counter])', '    counter = counter + 1'], 'while_loop.py', size=22,
                  mark={3, 4, 6}, loop=(4, 6),
                  labels={3: 'Initialization', 4: 'Termination condition', 6: 'Updation'}) + '</div>')
S[10] = light('Loops', 'For Loop',
              'A new loop that walks through a sequence by itself.',
              '<div class="nd-col" style="max-width:470px">'
              '<p class="nd-lead"><span class="nd-kw">for</span> goes through each item of a sequence, one at a time</p>' +
              bullets([('A string is a sequence', 'A sequence of characters'),
                       ('Numbers can be a sequence too', 'And many more kinds')], icon='dot') +
              '</div>' + syntax(f'{K("for")} each_item {K("in")} {V("sequence")}:', width=500))
S[11] = light('Iterate Over Characters', 'For Loop',
              'The sequence here is a word. The loop takes its characters one by one.',
              syntax(f'{K("for")} each_item {K("in")} {V("sequence")}:', width=440) +
              code(FOR_WORD, 'for_loop.py', size=24, loop=(2, 3)))
S[12] = light('Iterate Over Characters', 'For Loop',
              'The same job as the while loop, in two lines.',
              code(FOR_WORD, 'for_loop.py', size=24, loop=(2, 3)) +
              '<div class="nd-col"><p class="nd-lead"><b>Not needed any more:</b></p>'
              '<span class="nd-pill"><span class="nd-xx">\u00d7</span>Initialization</span>'
              '<span class="nd-pill"><span class="nd-xx">\u00d7</span>Termination condition</span>'
              '<span class="nd-pill"><span class="nd-xx">\u00d7</span>Updation</span></div>')
S[19] = light('For Loop', 'Iterate Over Numbers',
              'A for loop needs a sequence. What if we want numbers, like 0, 1, 2, 3?',
              '<p class="nd-lead" style="max-width:320px">How do we make a <b>sequence of numbers</b>?</p>' +
              syntax(f'{K("for")} each_number {K("in")} {V("sequence_of_numbers")}:', width=640))
S[20] = light('Iterate Over Numbers', 'Range',
              'range gives us a sequence of whole numbers.',
              '<div class="nd-col" style="align-items:center;gap:18px">'
              '<p class="nd-rbig">range<span class="p">(</span><span class="e">n</span><span class="p">)</span></p>'
              '<span class="nd-arrow dn" style="height:56px"></span>'
              '<p class="nd-note">Stops before <b>n</b><br>(<b>n</b> is not included)</p></div>' +
              callout('What it gives', 'A sequence of integers, starting from <b>0</b>', 'green', 'bulb'))
S[21] = light('Range', 'Sequence of Integers',
              'range(5) gives five numbers. The count starts at 0.',
              '<p class="nd-rbig">range<span class="p">(</span><span class="n" style="color:#E8590C">5</span><span class="p">)</span></p>'
              '<span class="nd-harrow"></span>'
              '<div class="nd-cells"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div>')
S[22] = light('Iterate Over Numbers', 'Range',
              'The loop runs once for each number that range gives.',
              code(['for number in range(3):', '    print(number)'], 'range_loop.py', size=26, loop=(1, 2)) +
              io('out', '0\n1\n2', width=220))
S[27] = light('Example', 'Right Angle Triangular Pattern',
              'Write a program to print a right angle triangle pattern. The number N is the input.',
              '<div class="nd-col" style="flex-direction:row;gap:28px;align-items:flex-start">' +
              io('in', '4', width=240) + io('out', STARS, width=260) + '</div>')
S[29] = light('For Loop', 'Solution',
              'counter goes 0, 1, 2, 3. Each line prints counter + 1 stars.',
              code(['n = int(input())', 'for counter in range(n):', '    print("* " * (counter + 1))'],
                   'pattern.py', size=23, loop=(2, 3)) +
              '<div class="nd-col">' + io('in', '4') + io('out', STARS) + '</div>')
S[31] = light('Iterate Over Numbers', 'Range',
              'range can also start at a number you choose.',
              '<div class="nd-col" style="align-items:center;gap:16px">'
              '<p class="nd-note">Makes a sequence of numbers<br>starting from <b>start</b></p>'
              '<span class="nd-arrow up" style="height:52px"></span>'
              '<p class="nd-rbig">range<span class="p">(</span>start, <span class="e">end</span><span class="p">)</span></p>'
              '<span class="nd-arrow dn" style="height:52px"></span>'
              '<p class="nd-note">Stops before <b>end</b><br>(<b>end</b> is not included)</p></div>')
S[32] = light('Iterate Over Numbers', 'For Loop',
              'Simpler with range(1, n + 1). counter is already the number of stars.',
              code(['n = int(input())', 'for counter in range(1, n + 1):', '    print("* " * counter)'],
                   'pattern.py', size=23, loop=(2, 3), mark={2}) +
              '<div class="nd-col">' + io('in', '4') + io('out', STARS) + '</div>')
S[18] = quiz()
S[36] = feedback()
S[37] = thanks()

doc = open(SRC, encoding='utf-8').read()
n = len(re.findall(r'<div class="(?:slide|pcard)"[^>]*>', doc))
assert n == 38, n
out = skin(doc, {i: frame(s) for i, s in S.items()})
out = out.replace('<title>For Loop: lesson plan</title>', '<title>For Loop</title>')
open(DST, 'w', encoding='utf-8').write(out)
print(DST, len(out) // 1024, 'KB')
