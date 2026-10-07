"""PF 18 Comparing Strings & Naming Variables, redrawn in the New Design Template look.

Reads the current student view and writes <name>_new_design.html next to it.
Card indices are the presenter's order (document order of .slide / .pcard).
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ndt import *

SRC = (r'C:\Lesson Plans New\Plans\Programming Foundations\18 - Comparing Strings & Naming Variables'
       r'\18_comparing_strings_naming_variables_student_view.html')
DST = SRC.replace('_student_view.html', '_student_view_new_design.html')

K = 'Comparing Strings &amp; Naming Variables'
S = {}
S[0] = welcome()
S[1] = recap('Where We Left Off', [
    ('break leaves the loop now', 'The lines after it in the loop do not run'),
    ('continue skips the rest of this pass', 'The loop goes on with its next pass'),
    ('pass does nothing', 'It holds the place of a block you have not written yet'),
])
S[4] = session_title('Comparing Strings & Naming Variables')
S[5] = agenda([('Comparing Strings', 'Every letter is a number'),
               ('Naming Variables', 'The rules, and the style')])
S[15] = quiz()
S[17] = divider(2, K, 'Naming Variables')
S[26] = feedback()
S[27] = thanks()

doc = open(SRC, encoding='utf-8').read()
n = len(re.findall(r'<div class="(?:slide|pcard)"[^>]*>', doc))
assert n == 28, n
out = skin(doc, {i: frame(s) for i, s in S.items()})
out = out.replace('<title>Comparing Strings & Naming Variables: lesson plan</title>',
                  '<title>Comparing Strings &amp; Naming Variables</title>')
open(DST, 'w', encoding='utf-8').write(out)
print(DST, len(out) // 1024, 'KB')
