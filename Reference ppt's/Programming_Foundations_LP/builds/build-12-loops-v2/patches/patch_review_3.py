# -*- coding: utf-8 -*-
"""Review pass 3: wording, the takeaway map's promise, the sidebar legend.

- "Programme" is the wrong word for code, and the plan used both spellings in
  one file. Normalised to "Program" everywhere.
- The map said "for loop: next time" while the guide twice says to say "a later
  session". The map now says what the guide says.
- The template's sidebar legend called the worksheet beats "paper", which is the
  word this programme tells parents is not used, and mapped three of its five
  swatches to the wrong class. Its foot advertised "g guide" and "h worksheet"
  outside presenter view, and neither key has a handler: dead text that reads
  like a route into the answer key.
- The hundred-number answer is asked out loud and was nowhere in the guide.
"""
import io, os, re

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ------------------------------------------------------------- Programme -> Program
p = 'build.py'
s = io.open(p, encoding='utf-8').read()
n = len(re.findall(r'[Pp]rogramme', s))
s = s.replace('Programme', 'Program').replace('programme', 'program')
# "this programme" in the guide's prose is the course, not a program
s = s.replace('the word this program tells parents', 'the word this programme tells parents')
io.open(p, 'w', encoding='utf-8').write(s)
print('Programme -> Program: %d' % n)

s = io.open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, 1)


# ------------------------------------------------- the map keeps the guide's promise
sub('<text x="720" y="135" text-anchor="middle">for loop: next time</text></g>',
    '<text x="720" y="135" text-anchor="middle">for loop: a later session</text></g>')
sub("'aria-label=\"Concept map: loops, the two kinds of loop in Python, the block diagram of a while loop built one part at a time, and what leaving out each part costs\">'",
    "'aria-label=\"Concept map: loops, the two kinds of loop in Python, the block diagram of a while loop built one part at a time, and what leaving out each part costs\">'") \
    if False else None

# ------------------------------------------------------- the hundred-number answer
sub("""  'Twenty-one lines is right: one input line plus ten pairs. Anyone who wrote a loop already has '
  'been reading ahead, ask them to hold it for two cards.'))""",
    """  'Twenty-one lines is right: one input line plus ten pairs, and two hundred and one for a '
  'hundred numbers. Both are worth saying out loud. Anyone who wrote a loop already has been '
  'reading ahead, ask them to hold it for two cards.'))""")

io.open(p, 'w', encoding='utf-8').write(s)

# --------------------------------------------------------------- the template
p = 'plan-template.html'
t = io.open(p, encoding='utf-8').read()
old = """<span><i style="background:var(--hook)"></i>hook</span>
<span><i style="background:var(--exit)"></i>hands-on</span>
<span><i style="background:var(--activity)"></i>paper</span>
<span><i style="background:var(--quiz)"></i>break</span>
<span><i style="background:var(--rule)"></i>deck</span></p>"""
new = """<span><i style="background:var(--hook)"></i>hook</span>
<span><i style="background:var(--activity)"></i>worksheet</span>
<span><i style="background:var(--exit)"></i>hands-on</span>
<span><i style="background:var(--quiz)"></i>quiz</span>
<span><i style="background:var(--dk-red)"></i>exit</span>
<span><i style="background:var(--rule)"></i>deck</span></p>"""
assert old in t
t = t.replace(old, new, 1)

old = """<p class="sp-foot">In presenter view: <b>f</b> full screen &middot; <b>a</b> all slides &middot; <b>g</b> guides
&middot; <b>r</b> replay. Outside it: <b>p</b> present &middot; <b>g</b> guide &middot; <b>h</b> worksheet</p>"""
new = """<p class="sp-foot">In presenter view: <b>f</b> full screen &middot; <b>a</b> all slides &middot; <b>g</b> guides
&middot; <b>r</b> replay. Outside it: <b>p</b> present</p>"""
assert old in t
t = t.replace(old, new, 1)

old = ".sp-item.k-quiz{border-left-color:var(--quiz)}"
new = (".sp-item.k-quiz{border-left-color:var(--quiz)}\n"
       ".sp-item.k-exit{border-left-color:var(--dk-red)}")
assert old in t and ".sp-item.k-exit{" not in t
t = t.replace(old, new, 1)

io.open(p, 'w', encoding='utf-8').write(t)
print('sidebar legend, exit swatch and foot corrected')
