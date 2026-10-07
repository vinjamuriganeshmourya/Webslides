"""PF 15 String Methods, redrawn in the New Design Template look.

Reads the current student view and writes <name>_new_design.html next to it.
Card indices are the presenter's order (document order of .slide / .pcard).
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ndt import *

SRC = r'C:\Lesson Plans New\Plans\Programming Foundations\15 - String Methods\15_string_methods_student_view.html'
DST = SRC.replace('_student_view.html', '_student_view_new_design.html')

S = {}
S[0] = welcome()
S[1] = recap('Where We Left Off', [
    ('A for loop walks through a sequence', 'One item at a time, with no counter to update'),
    ('range(n) gives 0, 1, 2 and so on', 'It stops before n'),
    ('range(start, end) starts where you choose', 'It still stops before end'),
])
S[4] = session_title('String Methods')
S[5] = agenda([('String Slicing', 'Take a part of a string'),
               ('String Methods', 'Jobs Python already knows'),
               ('Where It Stops', 'A slice stops before its last number')])
S[7] = light('String Slicing', 'Accessing Parts of a String',
             'Can we take out the name "Ravi" from this string?',
             '<div class="nd-col" style="align-items:center;gap:34px">' +
             tiles('-R-a-v-i-', name='secret_message', cls={1: 'pick', 3: 'pick', 5: 'pick', 7: 'pick'}, w=90) +
             '<p class="nd-lead" style="max-width:none;text-align:center">The dashes should go. '
             'Only <b>R</b>, <b>a</b>, <b>v</b> and <b>i</b> should stay.</p></div>')
S[8] = light('Strings', 'Extended Slicing',
             'A third number, the step, says how far each jump goes.',
             '<div class="nd-col" style="align-items:center;gap:26px">'
             '<p class="nd-big">variable<span class="p">[</span><span class="a">start_index</span><span class="p">:</span>'
             '<span class="b">end_index</span><span class="p">:</span><span class="c">step</span><span class="p">]</span></p>'
             '<div style="display:flex;align-items:flex-end;gap:34px">' +
             tiles('012345678', idx=False, w=62,
                   cls={0: 'skip', 1: 'pick', 2: 'skip', 3: 'pick', 4: 'skip', 5: 'pick', 6: 'skip', 7: 'pick', 8: 'stop'},
                   jumps=[(1, 3, '+2'), (3, 5, '+2'), (5, 7, '+2')]) +
             '<span class="nd-chip plain mono" style="font-size:30px;padding:16px 22px;margin-bottom:6px">'
             '[<span style="color:#0146C7">1</span>:<span style="color:#C2255C">8</span>:'
             '<span style="color:#7C3AED">2</span>]</span></div>'
             '<div class="nd-parts">'
             '<div class="nd-part"><p class="h" style="color:#0146C7">start_index</p><p class="t">Where the slice begins</p></div>'
             '<div class="nd-part"><p class="h" style="color:#C2255C">end_index</p><p class="t">It stops before this one</p></div>'
             '<div class="nd-part"><p class="h" style="color:#7C3AED">step</p><p class="t">How far each jump goes</p></div>'
             '</div></div>')
S[12] = quiz()
S[15] = light('String Methods', 'Strip',
              'Both strings hold the same mobile number. Python still says False.',
              code(['mobile_1 = " 9876543210 "', 'mobile_2 = "9876543210"',
                    'is_same = (mobile_1 == mobile_2)', 'print(is_same)'], 'mobile.py', size=24) +
              io('out', 'False', width=240))
S[18] = light('String Methods', 'Strip',
              'strip(".") removes dots at the two ends only.',
              '<div class="nd-col">' +
              code(['name = "M.Ravi."', 'name = name.strip(".")', 'print(name)'], 'strip.py', size=24) +
              io('out', 'M.Ravi') + '</div>' +
              tiles('M.Ravi.', cls={1: 'keep', 6: 'gone'}, tags={1: 'stays', 6: 'removed'}, w=72))
S[19] = light('String Methods', 'Strip',
              'Give strip a few characters. It removes any of them from the two ends.',
              code(['name = ", ..  ,, ravi ,, .. ."', 'name = name.strip(" ,.")', 'print(name)'],
                   'strip.py', size=24, mark={2}) +
              '<div class="nd-col" style="gap:16px;align-items:flex-start">'
              '<p class="nd-lead"><span class="nd-kw" style="color:#0146C7">" ,."</span> is three characters:</p>'
              '<span class="nd-chip blue mono">" "<small>a space</small></span>'
              '<span class="nd-chip blue mono">","<small>a comma</small></span>'
              '<span class="nd-chip blue mono">"."<small>a full stop</small></span>'
              '<p class="nd-lead" style="font-size:20px">Any order, as many as there are.</p></div>')
S[21] = light('Scenario', 'String Methods',
              'There is a spelling mistake in a document. We have to replace "teh" with the correct spelling.',
              doc_mock('notes.txt', '"<span class="typo">teh</span> cat and <span class="typo">teh</span> dog"', width=560) +
              '<div class="nd-col" style="align-items:center;gap:18px">'
              '<span class="nd-chip red mono" style="font-size:26px">teh</span>'
              '<span class="nd-arrow dn" style="height:44px"></span>'
              '<span class="nd-chip green mono" style="font-size:26px">the</span></div>')
S[29] = feedback()
S[30] = thanks()

doc = open(SRC, encoding='utf-8').read()
n = len(re.findall(r'<div class="(?:slide|pcard)"[^>]*>', doc))
assert n == 31, n
out = skin(doc, {i: frame(s) for i, s in S.items()})
out = out.replace('<title>String Methods: lesson plan</title>', '<title>String Methods</title>')
open(DST, 'w', encoding='utf-8').write(out)
print(DST, len(out) // 1024, 'KB')
