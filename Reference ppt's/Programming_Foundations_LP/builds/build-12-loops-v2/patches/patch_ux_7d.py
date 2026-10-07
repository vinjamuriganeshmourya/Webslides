# -*- coding: utf-8 -*-
"""Pass 7d: the hook's three machines, drawn properly, and the card filled.

The first cut of the three drawings was too small and sat above a third of a
screen of white, because nothing in the "where else" half of the hook was told
to grow. Each drawing is redrawn at the size the card can actually give it, the
two boxes still to come show their machine as a faint outline rather than an
empty rectangle, and the row stretches to the bottom of the stage.
"""
import io, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = 'build.py'
s = io.open(p, encoding='utf-8').read()
i = s.index('# the cash tray: one note, and then the next, and then the next')
j = s.index("hook = pcard(")
ART = '''# the cash tray: one note, and then the next, and then the next
ATM_ART = (
 '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="An ATM pushing out one note at a time until it reaches the amount asked for">'
 '<rect class="exbody" x="24" y="4" width="172" height="96" rx="12"/>'
 '<rect class="exscreen" x="40" y="14" width="140" height="40" rx="6"/>'
 '<text class="exscr" x="110" y="42" text-anchor="middle">2000</text>'
 '<circle class="exkey" cx="62" cy="74" r="7"/><circle class="exkey" cx="86" cy="74" r="7"/>'
 '<circle class="exkey" cx="110" cy="74" r="7"/><circle class="exkey" cx="134" cy="74" r="7"/>'
 '<rect class="exslot" x="52" y="92" width="116" height="10" rx="5"/>'
 '<rect class="exnote n1" x="62" y="96" width="96" height="28" rx="4"/>'
 '<rect class="exnote n2" x="62" y="96" width="96" height="28" rx="4"/>'
 '<rect class="exnote n3" x="62" y="96" width="96" height="28" rx="4"/>'
 '</svg>')

# the list of parents: one message, then the next, then the next, down the list
SMS_ART = (
 '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="One message sent to one parent, then the next, then the next, down a list">'
 '<rect class="exbody" x="10" y="6" width="96" height="128" rx="12"/>'
 + ''.join(f'<rect class="exrow" x="22" y="{24 + i * 34}" width="60" height="24" rx="6"/>'
           f'<circle class="extick t{i + 1}" cx="90" cy="{36 + i * 34}" r="8"/>'
           for i in range(3))
 + '<rect class="extower" x="162" y="24" width="12" height="96" rx="5"/>'
 '<path class="exwave" d="M146 52 C136 62 136 82 146 92"/>'
 '<path class="exwave" d="M134 42 C120 58 120 86 134 102"/>'
 '<g class="exmsg"><rect x="110" y="26" width="36" height="20" rx="7"/></g>'
 '</svg>')

# one floor, then the check, then one more floor
LIFT_ART = (
 '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="A lift climbing one floor at a time and checking after each one whether it has'
 ' arrived">'
 '<rect class="exshaft" x="70" y="6" width="76" height="128" rx="6"/>'
 + ''.join(f'<line class="exfloor" x1="70" y1="{32 + i * 30}" x2="146" y2="{32 + i * 30}"/>'
           f'<text class="exfl" x="60" y="{26 + i * 30}" text-anchor="end">{4 - i}</text>'
           f'<circle class="exlamp l{i + 1}" cx="168" cy="{20 + i * 30}" r="7"/>'
           for i in range(4))
 + '<g class="excar"><rect x="78" y="98" width="60" height="28" rx="4"/></g>'
 '</svg>')

'''
s = s[:i] + ART + s[j:]
io.open(p, 'w', encoding='utf-8').write(s)
print('the three machines redrawn')
