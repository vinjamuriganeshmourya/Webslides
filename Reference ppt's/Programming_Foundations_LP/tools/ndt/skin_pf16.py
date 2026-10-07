"""PF 16 Nested Loops, redrawn in the New Design Template look.

Reads the current student view and writes <name>_new_design.html next to it.
Card indices are the presenter's order (document order of .slide / .pcard).
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ndt import *

SRC = r'C:\Lesson Plans New\Plans\Programming Foundations\16 - Nested Loops\16_nested_loops_student_view.html'
DST = SRC.replace('_student_view.html', '_student_view_new_design.html')

TRI = lambda n: '\n'.join(' '.join(str(k) for k in range(1, r + 1)) + ' ' for r in range(1, n + 1))
WRONG = ['num = int(input())', 'for row_num in range(1, num):', '    row_out = ""',
         '    for seq_num in range(1, row_num + 1):', '        row_out = row_out + str(seq_num) + " "',
         '    print(row_out)']

S = {}
S[0] = welcome()
S[1] = recap('Where We Left Off', [
    ('Slicing takes a part of a string', 'message[start:end:step] stops before end'),
    ('String methods do ready made jobs', 'isdigit, strip, replace, startswith and upper'),
    ('strip only touches the two ends', 'The characters in the middle stay'),
])
S[4] = session_title('Nested Loops')
S[5] = agenda([('A Loop Inside a Loop', 'What a nested loop is'),
               ('How It Runs', 'Follow both loops'),
               ('The Number Triangle', 'A question you solve'),
               ('Common Mistakes', 'Where a range goes wrong')])
S[10] = quiz()
S[11] = light('Question', 'Triangular Pattern with Numbers',
              'Write a program to print a triangle of numbers in N rows. The number N is the input.',
              '<div class="nd-col" style="flex-direction:row;gap:28px;align-items:flex-start">' +
              io('in', '4', width=260, big=True) + io('out', TRI(4), width=340, big=True) + '</div>')
S[12] = light('Question', 'Input Format',
              'The first line has a positive integer.',
              '<div class="nd-col" style="flex-direction:row;gap:28px;align-items:flex-start">' +
              io('in', '3', width=260, big=True) + io('out', TRI(3), width=340, big=True) + '</div>')
S[13] = light('Question', 'Output Format',
              'Print a triangle of numbers. There is a space after every number.',
              '<div class="nd-col" style="flex-direction:row;gap:28px;align-items:flex-start">' +
              io('in', '5', width=200, big=True) + io('out', TRI(5), width=330, big=True) + '</div>' +
              callout('Note', 'Every number is followed by a space, <b>even the last one</b> in a row.', 'blue', 'i'))
S[18] = light('Possible Mistakes', 'Wrong Iteration',
              'The input is 3, but only two rows come out.',
              code(WRONG, 'triangle.py', size=21, bad={2}) +
              '<div class="nd-col">' + io('in', '3', width=220, big=True) + io('out', TRI(2), width=220, big=True) + '</div>')
S[22] = feedback()
S[23] = thanks()

doc = open(SRC, encoding='utf-8').read()
n = len(re.findall(r'<div class="(?:slide|pcard)"[^>]*>', doc))
assert n == 24, n
out = skin(doc, {i: frame(s) for i, s in S.items()})
out = out.replace('<title>Nested Loops: lesson plan</title>', '<title>Nested Loops</title>')
# the takeaway grid: the template's type is wider and taller, so six cards need smaller sizes
out = out.replace('</head>', '<style id="ndt-pf16">'
                  'body.present .tkg .tg-h{font-size:calc(var(--ndt-k)*17px)}'
                  'body.present .tkg .tg-code{font-size:calc(var(--ndt-k)*14.5px);flex:none;overflow:visible}'
                  'body.present .tkg .tg6 .tg-code{font-size:calc(var(--ndt-k)*12.5px)}'
                  'body.present .tkg .tg-out{font-size:calc(var(--ndt-k)*18px)}'
                  'body.present .tkg .tg-why{font-size:calc(var(--ndt-k)*14.5px)}'
                  '</style>\n</head>', 1)
open(DST, 'w', encoding='utf-8').write(out)
print(DST, len(out) // 1024, 'KB')
