# -*- coding: utf-8 -*-
"""Pass 7: the nine things the user asked for after seeing the plan run.

1. the four spine pictures fill the screen in presenter view   (template CSS)
2. the title card's logo and name are centred in the white panel (skill asset)
3. the agenda says what happens in plainer words
4. sequence of instructions becomes an animation, not a flat picture
5. the walker's "the dot is Python" prompt comes off the projector
6. type it then break it is one step fewer
7. while and for stand out on the takeaway map
8. no card opens on white space: every text card gets a drawing
9. the hook's three examples are drawn and animated, not three paragraphs
"""
import io, os, re

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = 'build.py'
s = io.open(p, encoding='utf-8').read()


def sub(old, new, n=1):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    assert s.count(old) >= n, 'anchor not unique enough: %r' % old[:50]
    s = s.replace(old, new, n)


# =====================================================================
# 0. a broken heading: the checkpoint sentence was rewritten and the tail
#    of the old one was left dangling on the end of it.
# =====================================================================
sub("""G.append('<h3 class="ghd">Checkpoint 1: they can name one machine that repeats one job after a single press. If not, take the examples in the hook down to two and move on.'
         'looks like</h3>')""",
    """G.append('<h3 class="ghd">Checkpoint 1: they can name one machine that repeats one job '
         'after a single press. If not, take the examples in the hook down to two and '
         'move on.</h3>')""")

# =====================================================================
# 3. the agenda, in plainer words
# =====================================================================
sub("""'data-anim-labels="the long way|the while loop|where it breaks|your own loop">'""",
    """'data-anim-labels="writing it ten times|the while loop|when it goes wrong|your own loop">'""")

sub(""" ' aria-label="Four stops in this session: writing it out the long way, the while loop and its'
 ' three parts, where a loop goes wrong, and writing one yourself">'""",
    """ ' aria-label="Four stops in this session: writing the same lines ten times, building a while'
 ' loop and naming its three parts, seeing what goes wrong, and writing one yourself">'""")

sub(""" + agstop(1, 140, 'The long way', 'you write it out,', 'and count the lines')
 + agstop(2, 380, 'The while loop', 'we build one,', 'line by line')
 + agstop(3, 620, 'Where it breaks', 'you break one', 'on purpose')
 + agstop(4, 860, 'Your own loop', 'stars on the screen,', 'your own program')""",
    """ + agstop(1, 140, 'Ten times over', 'you write the same', 'two lines, ten times')
 + agstop(2, 380, 'The while loop', 'we build one,', 'line by line')
 + agstop(3, 620, 'When it goes wrong', 'you break a loop', 'on purpose, and fix it')
 + agstop(4, 860, 'Your own loop', 'you write one that', 'prints a box of stars')""")

# =====================================================================
# 5. the walker's prompt is something the instructor says, not something
#    the room reads. The card keeps the drawing and the key.
# =====================================================================
sub("""  + '<p class="stage-q">The dot is Python. Set the number. Say what you think it prints to the '
    'person next to you, <b>then</b> I press play.</p>'
""", '')

sub("""  + '<p class="stage-note">Blue = Python ran it. '
    '<em class="dead">Faded</em> = never reached, and it stays faded.</p>'""",
    """  + '<p class="stage-note">Blue means Python ran that line. '
    '<em class="dead">Faded</em> means it was never reached, and it stays faded.</p>'""")

# the sentence has to live somewhere, so it moves into the guide
sub("""G.append(g(18, W('Explainer', 3, 18), 'Ask it again: follow the dot', [
""",
    """G.append(g(18, W('Explainer', 3, 18), 'Ask it again: follow the dot', [
  '<b>Say this, do not look for it on the card.</b> &ldquo;The red dot is Python. I am going to '
  'set the number, and before I press play I want you to tell the person next to you what this '
  'prints.&rdquo; The card carries the drawing only; this sentence is yours.',
""")

# =====================================================================
# 6. type it, then break it: two cards of prose after the code became one
# =====================================================================
sub("""  + '<div class="stage-step" data-label="2 &middot; delete one line">'
    '<p class="stage-q">I think I have left a line out of that program by mistake. '
    '<b>Delete the line</b> <code>counter = counter + 1</code> <b>and run it again with a = 5.</b></p>'
    '<p class="stage-note">The stop button is beside Run. You are going to need it.</p>'
    '<span class="tmr" data-secs="120"></span></div>'
  + '<div class="stage-step" data-label="3 &middot; put it back">'
    '<p class="stage-q">Put the line back. Now move it <b>above</b> <code>print(a)</code> '
    'and run with <b>a = 5</b> again. What changed, and what did not?</p>'
    '<span class="tmr" data-secs="120"></span></div>'
  + ctl() + RULE + '</div>', activity=19)""",
    """  + '<div class="stage-step" data-label="2 &middot; break it, then put it back">'
    '<p class="stage-q">Two changes to the same program, in this order.</p>'
    + BRK_ART
    + '<span class="tmr" data-secs="240"></span></div>'
  + ctl() + RULE + '</div>', activity=19)""")

# =====================================================================
# 7. while and for are the two kinds. They have to look like it.
# =====================================================================
sub("""<text x="280" y="135" text-anchor="middle">while loop: today</text>""",
    """<text x="280" y="135" text-anchor="middle"><tspan class="kind">while</tspan>"""
    """<tspan class="when"> loop &middot; today</tspan></text>""")
sub("""<text x="720" y="135" text-anchor="middle">for loop: a later session</text>""",
    """<text x="720" y="135" text-anchor="middle"><tspan class="kind">for</tspan>"""
    """<tspan class="when"> loop &middot; a later session</tspan></text>""")
# the two boxes grow a little so the bigger type still fits
sub("""<rect class="tkghost" x="170" y="104" width="220" height="50" rx="10"/>
<rect class="tkghost" x="610" y="104" width="220" height="50" rx="10"/>""",
    """<rect class="tkghost" x="152" y="100" width="256" height="58" rx="12"/>
<rect class="tkghost" x="592" y="100" width="256" height="58" rx="12"/>""")
sub("""<rect x="170" y="104" width="220" height="50" rx="10"/>
<text x="280" y="135\"""",
    """<rect x="152" y="100" width="256" height="58" rx="12"/>
<text x="280" y="137\"""")
sub("""<rect x="610" y="104" width="220" height="50" rx="10"/>
<text x="720" y="135\"""",
    """<rect x="592" y="100" width="256" height="58" rx="12"/>
<text x="720" y="137\"""")
sub("""<g class="tkslab"><path d="M280 154 V180"/>""",
    """<g class="tkslab"><path d="M280 158 V180"/>""")

io.open(p, 'w', encoding='utf-8').write(s)
print('pass 7a applied to build.py')
