# -*- coding: utf-8 -*-
"""Bring session 12 onto the fixed spine. Part 1: header, spine cards, hook."""
import io

p = 'build.py'
s = io.open(p, encoding='utf-8').read()


def sub(old, new, n=1):
    global s
    assert s.count(old) >= 1, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, n)


# ---------------------------------------------------------------- 1. header
sub("""import base64, html, os, sys, re

HERE = os.path.dirname(os.path.abspath(__file__))
def R(p): return open(os.path.join(HERE, p), encoding='utf-8').read()""",
    """import base64, html, os, pathlib, sys, re

HERE = os.path.dirname(os.path.abspath(__file__))

# The fixed spine - welcome, the two recap cards, the title card, the classroom
# quiz, feedback, thank you - is the same in every plan in every subject, so it
# comes from the skill rather than being redrawn here.
SKILL = pathlib.Path(os.path.expanduser('~/.claude/skills/prog-lesson-plan'))
sys.path.insert(0, str(SKILL / 'assets'))
from standard_slides import Spine, SPINE_CSS, SPINE_JS, file_names

SESSION = '12 - Loops'          # the session, spelled once
SESSION_NAME = 'Loops'          # what the title card says, and nothing before it
S = Spine(str(SKILL / 'assets' / 'standard-slides'))

def R(p): return open(os.path.join(HERE, p), encoding='utf-8').read()""")

# --------------------------------------------- 2. recap: two spine cards now
start = s.index('# --- 1. Recap: a title card, then three questions')
end = s.index('# --- 2. Hook ---')
sub(s[start:end], '''# --- 1. The spine: welcome, and the two recap cards --------------------------
# None of these is designed here. The pictures and the two title cards come from
# standard_slides, so every plan in every subject opens the same way.
welcome = pcard('Welcome', S.welcome())

recap_title = pcard('Recap', S.recap_title())

# Session 11 was Nested Conditional Statements. The bug format fits it exactly:
# a nested if whose last line sits at the left edge, so it runs whatever the
# marks are. It also plants the idea the exit question turns on - a program that
# prints nothing is not a broken program.
recap = pcard('Recap',
  S.recap('bug',
    title='Recap of nested conditions',
    eyebrow='Recap',
    ask='This should print nothing. It prints Pass. Write down the guilty line number first.',
    lines=['marks = 30',
           'if marks >= 35:',
           '    if marks >= 60:',
           '        print("First class")',
           'print("Pass")'],
    wrong='Pass',
    right='nothing at all',
    culprit=5,
    why='Line 5 starts at the left edge, so it is outside both ifs. It runs every time.'),
  activity=1)

''')

# ------------------------------------------- 3. the hook now carries your turn
start = s.index('# --- 2. Hook ---')
end = s.index('# --- 4. Paper: ten numbers, the long way')
sub(s[start:end], '''# --- 2. Hook, and where else the room has seen it ----------------------------
# Seven presses on one card. Two of them are the machine; presses 3 to 6 are the
# room's own examples, taken out loud before any of ours appears; press 7 is the
# collapse, so the construct is still the last thing this card draws.
# Nothing here prints the session's name - the title card does that, next.
def ex(name, line):
    return f'<div class="ex"><b>{name}</b><span>{line}</span></div>'

hook = pcard('Hook &mdash; forty copies, and where else',
  '<div class="stage" id="stage-hook-turn" data-anim="7" '
  'data-anim-labels="inside the machine|one job, forty times|where else have you seen this?'
  '|the ATM|the attendance SMS|the lift|one line, forty copies">'
  + slhead('Programming Foundations &middot; Session 12', 'Forty Copies')
  + '<div class="hkfig">'
  + '<p class="stage-q">He types <b>40</b>, presses START <b>once</b>, and walks away. But the '
    'machine only knows how to make <b>one</b> copy. <b>So what is going on inside it, forty '
    'times over?</b></p>'
  + R('parts/hook_svg.txt')
  + '</div>'
  + '<div class="hkyt">'
  + '<p class="stage-q">One press, and a machine repeats the same small job until it has done it '
    'enough times. <b>Where else have you seen that?</b> Say the machine, and say the one job it '
    'repeats.</p>'
  + '<div class="exg2">'
  + ex('The ATM', 'counts out <em>one note</em> &mdash; again, and again, and again &mdash; until '
       'it reaches the amount you asked for.')
  + ex('The attendance SMS', 'sends the same message to <em>one parent</em>, then the next, until '
       'it has gone down the whole list.')
  + ex('The lift', 'climbs <em>one floor</em>, checks whether it has arrived, climbs one more '
       '&mdash; until it is at your floor.')
  + '</div></div>'
  + animctl()
  + RULE + '</div>', animated='hook', activity=12)

# --- 3. The title card, then the agenda --------------------------------------
title_card = pcard('Today', S.title_card(SESSION_NAME))

# Four stops on a line, one per press. A flat list of four bullets is the thing
# this replaces: the room needs to see that the session goes somewhere.
def agstop(i, x, prev, title, doing):
    return (f'<g><path class="rail" d="M{prev} 168 H{x}"/>'
            f'<circle class="dot" cx="{x}" cy="168" r="27"/>'
            f'<text class="n" x="{x}" y="177" text-anchor="middle">{i}</text>'
            f'<text class="t" x="{x}" y="112" text-anchor="middle">{title}</text>'
            f'<text class="d" x="{x}" y="228" text-anchor="middle">{doing}</text></g>')

AGENDA = (
 '<svg class="fig agroute" viewBox="0 0 1000 280" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="Four stops in this session: writing it out the long way, the while loop and its'
 ' three parts, where a loop goes wrong, and writing one yourself">'
 + agstop(1, 140, 30, 'The long way', 'you write it out, and count the lines')
 + agstop(2, 380, 140, 'The while loop', 'we build one together, line by line')
 + agstop(3, 620, 380, 'Where it breaks', 'you break one on purpose')
 + agstop(4, 860, 620, 'Your own loop', 'stars on the screen, your program')
 + '</svg>')

agenda = pcard('Agenda',
  '<div class="stage" id="stage-agenda" data-anim="4" '
  'data-anim-labels="the long way|the while loop|where it breaks|your own loop">'
  + slhead('Loops', 'Where We Are Going')
  + AGENDA
  + animctl()
  + RULE + '</div>')

''')

# ------------------------------------------------- 4. the remaining spine cards
sub("# --- 11. Takeaways concept map ---",
    """# --- 10b. The classroom quiz -------------------------------------------------
# The quiz itself runs on the learning portal, on their own laptops. The card is
# the picture and nothing else: no questions, no reveal, no timer.
quiz = pcard('Classroom quiz', S.quiz(), activity=10)

feedback = pcard('Feedback', S.feedback())
thankyou = pcard('Thank you', S.thankyou())

# --- 11. Takeaways concept map ---""")

io.open(p, 'w', encoding='utf-8').write(s)
print('part 1 applied')
