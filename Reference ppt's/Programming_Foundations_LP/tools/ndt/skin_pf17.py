"""PF 17 Loop Control Statements, redrawn in the New Design Template look.

Reads the current student view and writes <name>_new_design.html next to it.
Card indices are the presenter's order (document order of .slide / .pcard).
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ndt import *

SRC = r'C:\Lesson Plans New\Plans\Programming Foundations\17 - Loop Control Statements\17_loop_control_statements_student_view.html'
DST = SRC.replace('_student_view.html', '_student_view_new_design.html')

K = 'Loop Control Statements'
AGE = ['age = int(input())', 'output = ""', 'if age >= 20:', 'elif age > 12:', 'else:', 'print(output)']

S = {}
S[0] = welcome()
S[1] = recap('Where We Left Off', [
    ('A nested loop is a loop inside a loop', 'The inner loop runs fully for every outer pass'),
    ('The outer loop moves first', 'Then the inner loop starts again from the top'),
    ('The end of a range decides the rows', 'A wrong end value gives a missing row'),
])
S[4] = session_title(K)
S[5] = agenda([('Break', 'Leave the loop now'),
               ('Continue', 'Skip the rest of this pass'),
               ('Pass', 'A block that does nothing')])
S[7] = divider(1, K, 'Break')
S[8] = light(K, 'Break',
             '<b>break</b> makes the program leave a loop early.',
             code(['while condition_a:', '    statement_1', '    break', '    statement_2', 'statement_after_loop'],
                  'break.py', size=24, mark={3}, warn={5}, loop=(1, 2),
                  labels={3: 'leave the loop now', 4: 'never runs', 5: 'runs next'}))
S[9] = light(K, 'Break',
             'Most of the time, <b>break</b> sits inside an <b>if</b>. It runs when the condition is True.',
             code(['for item in sequence:', '    statement_1', '    if condition_b:', '        break',
                   '    statement_2', 'statement_after_loop'],
                  'break.py', size=24, mark={4}, warn={6}, loop=(1, 5),
                  labels={3: 'is it True?', 4: 'yes: leave the loop', 6: 'runs next'}))
S[13] = light(K, 'Break in Nested Loop',
              '<b>break</b> in the inner loop stops only the inner loop. The outer loop goes on.',
              code(['for item_a in sequence_a:', '    for item_b in sequence_b:', '        if condition:',
                    '            break', '        statement_1', '    statement_2'],
                   'nested.py', size=24, mark={4}, warn={6}, loop=(1, 6),
                   labels={2: 'inner loop', 4: 'leave the inner loop', 6: 'outer loop goes on'}))
S[16] = quiz()
S[18] = divider(2, K, 'Continue')
S[19] = light(K, 'Continue',
              '<b>continue</b> skips the rest of this pass. The loop starts its next pass.',
              code(['while condition_a:', '    statement_1', '    continue', '    statement_2', 'statement_after_loop'],
                   'continue.py', size=24, mark={3}, loop=(1, 3),
                   labels={3: 'back to the top', 4: 'skipped this pass'}))
S[20] = light(K, 'Continue',
              'Most of the time, <b>continue</b> sits inside an <b>if</b>. It runs when the condition is True.',
              code(['for item in sequence:', '    statement_1', '    if condition:', '        continue',
                    '    statement_2', 'statement_after_loop'],
                   'continue.py', size=24, mark={4}, loop=(1, 4),
                   labels={3: 'is it True?', 4: 'yes: next pass', 5: 'skipped this pass'}))
S[22] = divider(3, K, 'Pass')
S[23] = light('Empty Blocks', 'Pass',
              '<b>pass</b> holds the place of a block. When it runs, nothing happens.',
              code(['if condition_a:', '    block_1', 'elif condition_b:', '    pass', 'else:', '    block_3'],
                   'pass.py', size=24, mark={4}) +
              callout('When do we use it?', 'When we want to test our code before the whole code is written.',
                      'blue', 'bulb'))
S[24] = light('If-Elif-Else', 'Pass',
              'We are writing code to print the growth stage of a person from their age. '
              'We want to test the code written so far.',
              code(AGE, 'growth.py', size=24))
S[25] = light('If-Elif-Else', 'Pass',
              'The if, elif and else blocks are empty. Python stops with an error.',
              code(AGE, 'growth.py', size=24, bad={3, 4, 5}) +
              '<div class="nd-col">' +
              io('out', 'IndentationError:\nexpected an indented block', width=380) +
              callout('Remember', 'You cannot leave a block empty.', 'green', 'i') + '</div>')
S[26] = light(K, 'Pass',
              '<b>pass</b> does nothing, so 3 is still printed.',
              code(['n = int(input())', 'for i in range(n):', '    if i == 3:', '        pass', '    print(i)'],
                   'pass_loop.py', size=24, mark={4}, loop=(2, 5)) +
              '<div class="nd-col" style="flex-direction:row;gap:24px;align-items:flex-start">' +
              io('in', '5', width=160, big=True) + io('out', '0\n1\n2\n3\n4', width=160, big=True) + '</div>')
S[30] = feedback()
S[31] = thanks()

doc = open(SRC, encoding='utf-8').read()
n = len(re.findall(r'<div class="(?:slide|pcard)"[^>]*>', doc))
assert n == 32, n
out = skin(doc, {i: frame(s) for i, s in S.items()})
out = out.replace('<title>Loop Control Statements: lesson plan</title>', '<title>Loop Control Statements</title>')
open(DST, 'w', encoding='utf-8').write(out)
print(DST, len(out) // 1024, 'KB')
