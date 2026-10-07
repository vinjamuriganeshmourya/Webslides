# -*- coding: utf-8 -*-
"""Review pass 6: ghost slots, so no card is half empty on its first press.

The agenda is a step rail and the takeaway map is a diagram; both opened as one
mark on a large blank canvas. Each now draws its own empty skeleton from press
one and fills it, which is the rule the memory names for step rails.

The skeletons are plain SVG elements rather than groups, so the staged `<g>`
children keep their numbering. That means the step gating has to count `<g>`
siblings only: `nth-of-type`, not `nth-child`.
"""
import io, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def patch(path, pairs):
    s = io.open(path, encoding='utf-8').read()
    for old, new in pairs:
        assert old in s, '%s: anchor not found %r' % (path, old[:60])
        s = s.replace(old, new, 1)
    io.open(path, 'w', encoding='utf-8').write(s)


# ---------------------------------------------------------------- the agenda
s = io.open('build.py', encoding='utf-8').read()
start = s.index("def agstop(i, x, prev, title, l1, l2):")
end = s.index("agenda = pcard('Agenda',")
new = '''def agstop(i, x, title, l1, l2):
    return (f'<g><circle class="dot" cx="{x}" cy="250" r="34"/>'
            f'<text class="n" x="{x}" y="261" text-anchor="middle">{i}</text>'
            f'<text class="t" x="{x}" y="170" text-anchor="middle">{title}</text>'
            f'<text class="d" x="{x}" y="336" text-anchor="middle">{l1}</text>'
            f'<text class="d" x="{x}" y="366" text-anchor="middle">{l2}</text></g>')

AG_X = (140, 380, 620, 860)

# the empty rail and four hollow stops, up from press 1. A step rail that opens
# as one dot on a blank canvas tells the room nothing about how far the session
# goes, and half the card is white.
AG_GHOST = ('<path class="railghost" d="M140 250 H860"/>'
            + ''.join(f'<circle class="dotghost" cx="{x}" cy="250" r="34"/>' for x in AG_X)
            + ''.join(f'<text class="nghost" x="{x}" y="261" text-anchor="middle">{i}</text>'
                      for i, x in enumerate(AG_X, 1)))

AGENDA = (
 '<svg class="fig agroute" viewBox="0 0 1000 440" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="Four stops in this session: writing it out the long way, the while loop and its'
 ' three parts, where a loop goes wrong, and writing one yourself">'
 + AG_GHOST
 + agstop(1, 140, 'The long way', 'you write it out,', 'and count the lines')
 + agstop(2, 380, 'The while loop', 'we build one,', 'line by line')
 + agstop(3, 620, 'Where it breaks', 'you break one', 'on purpose')
 + agstop(4, 860, 'Your own loop', 'stars on the screen,', 'your own program')
 + '</svg>')

'''
s = s[:start] + new + s[end:]

# ------------------------------------------------------- the takeaways map
old = ('<svg class="fig tkmap" viewBox="0 0 1000 510" xmlns="http://www.w3.org/2000/svg" '
       'role="img"')
assert old in s
GHOST = ('''<rect class="tkghost" x="170" y="104" width="220" height="50" rx="10"/>
<rect class="tkghost" x="610" y="104" width="220" height="50" rx="10"/>
<rect class="tkghost" x="150" y="180" width="490" height="46" rx="8"/>
<rect class="tkghost" x="150" y="238" width="490" height="28" rx="6"/>
<rect class="tkghost" x="150" y="272" width="490" height="46" rx="8"/>
<rect class="tkghost" x="150" y="324" width="490" height="46" rx="8"/>
<rect class="tkghost" x="150" y="392" width="700" height="106" rx="10"/>
''')
i = s.index('<g class="tkroot">')
s = s[:i] + GHOST + s[i:]
io.open('build.py', 'w', encoding='utf-8').write(s)

# --------------------------------------------- the step gating counts groups
patch('plan-template.html', [(
 """.an-1 .tkmap > g:nth-child(-n+1),.an-2 .tkmap > g:nth-child(-n+2),
.an-3 .tkmap > g:nth-child(-n+3),.an-4 .tkmap > g:nth-child(-n+4),
.an-5 .tkmap > g:nth-child(-n+5),.an-6 .tkmap > g:nth-child(-n+6),
.an-7 .tkmap > g:nth-child(-n+7){opacity:1;transform:none}""",
 """/* the ghost outlines are plain <rect> siblings, so the steps count groups only */
.an-1 .tkmap > g:nth-of-type(-n+1),.an-2 .tkmap > g:nth-of-type(-n+2),
.an-3 .tkmap > g:nth-of-type(-n+3),.an-4 .tkmap > g:nth-of-type(-n+4),
.an-5 .tkmap > g:nth-of-type(-n+5),.an-6 .tkmap > g:nth-of-type(-n+6),
.an-7 .tkmap > g:nth-of-type(-n+7){opacity:1;transform:none}
.tkmap .tkghost{fill:none;stroke:#DCE3EA;stroke-width:2;stroke-dasharray:7 7}""")])

# ------------------------------------------------------------------- the CSS
patch('parts/extra.css', [(
 """.an-1 .agroute > g:nth-child(-n+1),.an-2 .agroute > g:nth-child(-n+2),
.an-3 .agroute > g:nth-child(-n+3),.an-4 .agroute > g:nth-child(-n+4){
  opacity:1;transform:none}
.agroute .rail{stroke:#CFE3EF;stroke-width:7;fill:none;stroke-linecap:round}""",
 """.an-1 .agroute > g:nth-of-type(-n+1),.an-2 .agroute > g:nth-of-type(-n+2),
.an-3 .agroute > g:nth-of-type(-n+3),.an-4 .agroute > g:nth-of-type(-n+4){
  opacity:1;transform:none}
/* the empty rail and the four hollow stops, up from press 1 */
.agroute .railghost{stroke:#E4EBF0;stroke-width:7;fill:none;stroke-linecap:round}
.agroute .dotghost{fill:#FFFFFF;stroke:#D8E3EC;stroke-width:2;stroke-dasharray:6 6}
.agroute .nghost{font:700 28px var(--sans);fill:#CBD5DF}""")])

print('ghost slots added to the agenda and the takeaway map')
