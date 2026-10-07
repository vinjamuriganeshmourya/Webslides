# -*- coding: utf-8 -*-
"""Pass 7b: the drawings.

Everything here exists because a card that is half white is a card the room
reads in four seconds and then looks away from. Four panels that were a
paragraph and a timer now carry a drawing of the thing they are asking about,
and the deck's flat "Sequence of Instructions" picture becomes an animation of
Python walking down a program one line at a time.
"""
import io, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = 'build.py'
s = io.open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, 1)


# =====================================================================
# 4. Sequence of instructions, as an animation.
#
# Deck slide 9 is a paragraph beside a grey rectangle standing in for "a
# block of code". It says every line runs once; it never shows one running.
# Five presses walk Python down a five line program, the box called `a`
# takes a new value in front of them with the old one struck out, the black
# console fills a line at a time, and only then does the verdict land. The
# question that was deck slide 10 rides on the last press, so the beat is
# still two ideas and the deck's own second slide stays in the plan.
# =====================================================================
SEQ = '''
SEQ_LINES = (
  ('1', 'a = <tspan class="fn">int</tspan>(<tspan class="fn">input</tspan>())'),
  ('2', 'a = a + <tspan class="num">1</tspan>'),
  ('3', '<tspan class="fn">print</tspan>(a)'),
  ('4', 'a = a + <tspan class="num">1</tspan>'),
  ('5', '<tspan class="fn">print</tspan>(a)'),
)
SEQ_Y = (108, 152, 196, 240, 284)

SEQ = (
 '<svg class="fig seqfig" viewBox="0 0 1000 448" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="Python walking down a five line program one line at a time. The box called a'
 ' takes 5, then 6, then 7, the console fills one line at a time, and every line of the program'
 ' runs exactly once">'

 # ---- the skeleton, up from press 1, so nothing here is ever blank -------
 '<text class="sqhd" x="10" y="48">the program, top to bottom</text>'
 '<text class="sqhd" x="506" y="48">the box called a</text>'
 '<text class="sqhd" x="730" y="48">what it prints</text>'
 '<rect class="sqpanel" x="10" y="72" width="470" height="252" rx="12"/>'
 '<rect class="sqpanel" x="506" y="72" width="200" height="252" rx="12"/>'
 '<rect class="sqdark" x="730" y="72" width="260" height="252" rx="12"/>'
 '<rect class="sqslot" x="536" y="104" width="140" height="56" rx="10"/>'
 '<rect class="sqslot" x="536" y="176" width="140" height="56" rx="10"/>'
 '<rect class="sqslot" x="536" y="248" width="140" height="56" rx="10"/>'
 '<rect class="sqslotd" x="752" y="100" width="216" height="40" rx="8"/>'
 '<rect class="sqslotd" x="752" y="152" width="216" height="40" rx="8"/>'
 + ''.join(
   f'<text class="ln" x="56" y="{y}" text-anchor="end">{n}</text>'
   f'<text class="prog" x="70" y="{y}">{code}</text>'
   for (n, code), y in zip(SEQ_LINES, SEQ_Y))

 # ---- the marker that walks down it -------------------------------------
 '<g class="sqptr"><rect class="sqband" x="16" y="79" width="458" height="38" rx="8"/>'
 '<path class="sqcaret" d="M26 89 l13 9 l-13 9 z"/></g>'

 # ---- one press per line -------------------------------------------------
 '<g class="sq1"><text class="val" x="606" y="144" text-anchor="middle">5</text></g>'
 '<g class="sq2"><line class="strike" x1="574" y1="134" x2="638" y2="134"/>'
 '<text class="val" x="606" y="216" text-anchor="middle">6</text></g>'
 '<g class="sq3"><text class="outln" x="766" y="128">6</text></g>'
 '<g class="sq4"><line class="strike" x1="574" y1="206" x2="638" y2="206"/>'
 '<text class="val" x="606" y="288" text-anchor="middle">7</text></g>'
 '<g class="sq5"><text class="outln" x="766" y="180">7</text></g>'

 # ---- the verdict, and the question the session answers ------------------
 '<g class="sq6">'
 '<rect class="sqsay" x="10" y="344" width="980" height="42" rx="10"/>'
 '<text class="saytx" x="500" y="372" text-anchor="middle">'
 'Five lines. Python ran every one of them once, in order, and stopped.</text>'
 '<rect class="sqask" x="10" y="396" width="980" height="46" rx="10"/>'
 '<text class="asktx" x="500" y="426" text-anchor="middle">'
 'So can we make one block of code run more than once?</text>'
 '</g></svg>')

seq_card = pcard('Sequence of instructions',
  '<div class="stage" id="stage-seq" data-anim="6" '
  'data-anim-labels="line 1|line 2|line 3|line 4|line 5|every line ran once">'
  + slhead('Introduction', 'Sequence of Instructions')
  + SEQ
  + animctl()
  + RULE + '</div>')

'''

sub("# --- 4. Worksheet: ten numbers, the long way ---", SEQ.lstrip('\n')
    + "# --- 4. Worksheet: ten numbers, the long way ---")

sub(""" block('once', '&#128196;', 'One line, one run &middot; Slides 9&ndash;10',
       slide(9, 'Sequence of Instructions') + slide(10, 'Question')),""",
    """ block('once', '&#128196;', 'One line, one run &middot; Slide 9 redrawn, and slide 10',
       seq_card + slide(10, 'Question')),""")


# =====================================================================
# 8. the drawings on the four cards that were a paragraph and a timer
# =====================================================================
ART = '''
# ---------------------------------------------------------------- drawings
# Four cards used to be a question, a code slab and a lot of white. Each one
# now shows the thing it is asking about. They are all plain SVG in the deck's
# palette, they all sit in a two column row beside the words rather than under
# them, and none of them carries text that the words already carry.

# task 1: three pairs of lines, and the seven more the question now needs
WS1_ART = (
 '<svg class="fig artfig" viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="A short program of seven lines beside the same program stretched to twenty one">'
 '<text class="alab" x="10" y="20">asks for 3</text>'
 '<text class="alab" x="186" y="20">asks for 10</text>'
 '<rect class="apaper" x="10" y="32" width="128" height="106" rx="8"/>'
 '<rect class="apaper" x="186" y="32" width="128" height="250" rx="8"/>'
 + ''.join(f'<rect class="aline" x="24" y="{44 + i * 13}" width="{92 if i % 2 else 66}"'
           f' height="6" rx="3"/>' for i in range(7))
 + ''.join(f'<rect class="aline" x="200" y="{44 + i * 11}" width="{92 if i % 2 else 66}"'
           f' height="5" rx="2.5"/>' for i in range(21))
 + '<text class="anum" x="74" y="160">7 lines</text>'
 '<text class="anum" x="250" y="304">21 lines</text>'
 '<path class="aarrow" d="M148 84 H176"/>'
 '<path class="aarrow" d="M170 78 l8 6 l-8 6"/>'
 '</svg>')

# task 3: three programs, each with one thing wrong in it
HUNT_ART = (
 '<svg class="fig artfig" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="Three short programs side by side, each with one line marked as the broken one">'
 + ''.join(
   f'<g><rect class="apaper" x="10" y="{8 + b * 80}" width="280" height="64" rx="8"/>'
   f'<text class="alab" x="24" y="{28 + b * 80}">Program {b + 1}</text>'
   + ''.join(f'<rect class="aline" x="24" y="{36 + b * 80 + i * 11}"'
             f' width="{150 if i else 110}" height="5" rx="2.5"/>' for i in range(3))
   + f'<rect class="abad" x="20" y="{32 + b * 80 + bad[b] * 11}" width="{160}" height="9" rx="4"/>'
   f'<text class="abug" x="264" y="{30 + b * 80}">?</text></g>'
   for b in range(3))
 + '</svg>')

# the square pattern: what 3 has to come out as
SQ_ART = (
 '<svg class="fig artfig" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="The output for three: three rows of three stars, with a space after every star">'
 '<rect class="adark" x="10" y="10" width="280" height="150" rx="10"/>'
 + ''.join(f'<text class="astar" x="{56 + c * 62}" y="{60 + r * 42}">*</text>'
           for r in range(3) for c in range(3))
 + '<text class="alab" x="10" y="192">3 rows, 3 stars in each row</text>'
 '<text class="alab" x="10" y="216">one space after every star</text>'
 '<text class="alab" x="10" y="240">and 5 has to work too</text>'
 '</svg>')

# type it, then break it: the two changes, drawn
BRK_ART = (
 '<div class="brk2">'
 '<div class="brk-step"><span class="brk-n">1</span>'
 '<p><b>Delete the line</b> <code>counter = counter + 1</code>, then run it again with '
 '<b>a = 5</b>. The stop button sits beside Run. You are going to need it.</p>'
 '<svg viewBox="0 0 260 96" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="The last line of the loop body crossed out, and a console that never stops">'
 '<rect class="apaper" x="6" y="6" width="130" height="84" rx="8"/>'
 '<rect class="aline" x="18" y="20" width="96" height="6" rx="3"/>'
 '<rect class="aline" x="18" y="36" width="76" height="6" rx="3"/>'
 '<rect class="aline" x="26" y="52" width="88" height="6" rx="3"/>'
 '<rect class="agone" x="26" y="68" width="88" height="6" rx="3"/>'
 '<line class="acut" x1="18" y1="71" x2="122" y2="71"/>'
 '<rect class="adark" x="150" y="6" width="104" height="84" rx="8"/>'
 + ''.join(f'<rect class="aout" x="162" y="{18 + i * 14}" width="40" height="6" rx="3"/>'
           for i in range(4))
 + '<text class="aforever" x="162" y="82">forever</text>'
 '</svg></div>'
 '<div class="brk-step"><span class="brk-n">2</span>'
 '<p><b>Put the line back.</b> Now move it <b>above</b> <code>print(a)</code> and run with '
 '<b>a = 5</b> again. What changed, and what did not?</p>'
 '<svg viewBox="0 0 260 96" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="The last two lines of the loop body swapping places">'
 '<rect class="apaper" x="6" y="6" width="248" height="84" rx="8"/>'
 '<rect class="aline" x="18" y="20" width="150" height="6" rx="3"/>'
 '<rect class="aswapa" x="26" y="44" width="120" height="10" rx="5"/>'
 '<rect class="aswapb" x="26" y="66" width="150" height="10" rx="5"/>'
 '<path class="aarrow" d="M186 50 C214 50 214 70 186 70"/>'
 '<path class="aarrow" d="M192 64 l-6 6 l6 6"/>'
 '<path class="aarrow" d="M186 70 C158 70 158 50 186 50"/>'
 '</svg></div></div>')

'''
ART = ART.replace("bad[b]", "(2, 0, 1)[b]")
sub("# --- 4. Worksheet: ten numbers, the long way ---",
    ART.lstrip('\n') + "# --- 4. Worksheet: ten numbers, the long way ---")

# ---- task 1 -------------------------------------------------------------
sub("""  + '<div class="stage-step on" data-label="the task">'
    '<p class="stage-q">Worksheet task 1. The program that prints the next <b>three</b> consecutive '
    'numbers is already printed for you. The question has changed, it now asks for the next '
    '<b>ten</b>.</p>'
    '<pre class="slabcode">a <b>=</b> <i>int</i>(<i>input</i>())\\n'""",
    """  + '<div class="stage-step on" data-label="the task">'
    '<p class="stage-q">Worksheet task 1. The program that prints the next <b>three</b> consecutive '
    'numbers is already printed for you. The question has changed, it now asks for the next '
    '<b>ten</b>.</p>'
    '<div class="twocol"><div class="tc-a">'
    '<pre class="slabcode">a <b>=</b> <i>int</i>(<i>input</i>())\\n'""")
sub("""    '<i>print</i>(a)</pre>'
    '<p class="stage-note">Type only the lines you would add, in the box. Then fill the little '
    'table: how many lines your finished program is, and how many it would be for a hundred. '
    'Worksheet only, the playground stays shut.</p>'
    '<span class="tmr" data-secs="150"></span>'
    '</div>' + RULE + '</div>',""",
    """    '<i>print</i>(a)</pre>'
    '<p class="stage-note">Type only the lines you would add, in the box. Then fill the little '
    'table: how many lines your finished program is, and how many it would be for a hundred. '
    'Worksheet only, the playground stays shut.</p>'
    '</div><div class="tc-b">' + WS1_ART + '</div></div>'
    '<span class="tmr" data-secs="150"></span>'
    '</div>' + RULE + '</div>',""")

# ---- task 3 -------------------------------------------------------------
sub("""    '<ul class="vopts">'
    '<li data-k="1"><b>Which line is wrong</b>""",
    """    '<div class="twocol"><div class="tc-a">'
    '<ul class="vopts">'
    '<li data-k="1"><b>Which line is wrong</b>""")
sub("""    '<p class="stage-note">Three minutes. Then we go through these three and the one you broke '
    'yourselves, four in all. Program 1 has input 5. Program 2 has input 10. Program 3 has '
    'input 1.</p>'
    '<span class="tmr" data-secs="180"></span>'""",
    """    '<p class="stage-note">Three minutes. Then we go through these three and the one you broke '
    'yourselves, four in all. Program 1 has input 5. Program 2 has input 10. Program 3 has '
    'input 1.</p>'
    '</div><div class="tc-b">' + HUNT_ART + '</div></div>'
    '<span class="tmr" data-secs="180"></span>'""")

# ---- the square pattern --------------------------------------------------
sub("""  + '<div class="stage-step on" data-label="the task">'
    '<p class="stage-q">Open the code playground and <b>type the whole program yourself</b>. Only '
    'the first line is given here. The stars must come out in N rows and N columns, with a space '
    'after every star.</p>'
    '<pre class="slabcode">n <b>=</b> <i>int</i>(<i>input</i>())</pre>'
    '<p class="stage-note">Before you type: say to yourself how many times the print line has to '
    'run when n is 3. Then write all three parts, and run it with <b>3</b>, then <b>5</b>, then '
    '<b>1</b>.</p>'
    '<span class="tmr" data-secs="270"></span></div>'""",
    """  + '<div class="stage-step on" data-label="the task">'
    '<p class="stage-q">Open the code playground and <b>type the whole program yourself</b>. Only '
    'the first line is given here. The stars must come out in N rows and N columns, with a space '
    'after every star.</p>'
    '<div class="twocol"><div class="tc-a">'
    '<pre class="slabcode">n <b>=</b> <i>int</i>(<i>input</i>())</pre>'
    '<p class="stage-note">Before you type: say to yourself how many times the print line has to '
    'run when n is 3. Then write all three parts, and run it with <b>3</b>, then <b>5</b>, then '
    '<b>1</b>.</p>'
    '</div><div class="tc-b">' + SQ_ART + '</div></div>'
    '<span class="tmr" data-secs="270"></span></div>'""")

# =====================================================================
# 9. the hook's three examples, drawn and moving
# =====================================================================
sub("""def ex(name, line):
    return f'<div class="ex"><b>{name}</b><span>{line}</span></div>'""",
    '''def ex(name, line, art):
    """One of the room's own examples, drawn.

    Three paragraphs in three boxes is what this replaces. The hook is the one
    minute of the session where the room decides whether to look up, so each
    example is a small machine that actually does its one job over and over
    while the instructor is talking about it. The animation only runs on the
    press that reveals the box, so three loops are never turning at once.
    """
    return (f'<div class="ex"><div class="exart">{art}</div>'
            f'<b>{name}</b><span>{line}</span></div>')

# the cash tray: one note, and then the next, and then the next
ATM_ART = (
 '<svg viewBox="0 0 220 132" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="An ATM pushing out one note at a time until it reaches the amount asked for">'
 '<rect class="exbody" x="30" y="6" width="160" height="92" rx="10"/>'
 '<rect class="exscreen" x="46" y="18" width="128" height="40" rx="6"/>'
 '<text class="exscr" x="110" y="44" text-anchor="middle">2000</text>'
 '<rect class="exslot" x="60" y="72" width="100" height="10" rx="5"/>'
 '<g class="exnotes">'
 '<rect class="exnote n1" x="66" y="76" width="88" height="26" rx="4"/>'
 '<rect class="exnote n2" x="66" y="76" width="88" height="26" rx="4"/>'
 '<rect class="exnote n3" x="66" y="76" width="88" height="26" rx="4"/>'
 '</g></svg>')

# the list of parents, one message at a time, down the list
SMS_ART = (
 '<svg viewBox="0 0 220 132" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="One message sent to one parent, then the next, then the next, down a list">'
 '<rect class="exbody" x="12" y="6" width="94" height="120" rx="10"/>'
 + \'\'.join(f\'<rect class="exrow" x="24" y="{20 + i * 30}" width="70" height="20" rx="5"/>\'
             f\'<circle class="extick t{i + 1}" cx="86" cy="{30 + i * 30}" r="7"/>\'
             for i in range(3))
 + '<rect class="extower" x="150" y="18" width="10" height="96" rx="4"/>'
 '<path class="exwave" d="M132 44 C122 56 122 76 132 88"/>'
 '<path class="exwave" d="M122 34 C108 52 108 80 122 98"/>'
 '<g class="exmsg"><rect x="104" y="22" width="34" height="18" rx="6"/></g>'
 '</svg>')

# one floor, check, one floor, check
LIFT_ART = (
 '<svg viewBox="0 0 220 132" xmlns="http://www.w3.org/2000/svg" role="img"'
 ' aria-label="A lift climbing one floor at a time and checking after each one whether it has'
 ' arrived">'
 '<rect class="exshaft" x="74" y="6" width="72" height="120" rx="6"/>'
 + \'\'.join(f\'<line class="exfloor" x1="74" y1="{34 + i * 30}" x2="146" y2="{34 + i * 30}"/>\'
             f\'<text class="exfl" x="60" y="{28 + i * 30}" text-anchor="end">{4 - i}</text>\'
             f\'<circle class="exlamp l{i + 1}" cx="164" cy="{22 + i * 30}" r="6"/>\'
             for i in range(4))
 + '<g class="excar"><rect x="82" y="96" width="56" height="26" rx="4"/></g>'
 '</svg>')''')

sub("""  + ex('The ATM', 'counts out <em>one note</em> again, and again, and again, until '
       'it reaches the amount you asked for.')
  + ex('The attendance SMS', 'sends the same message to <em>one parent</em>, then the next, until '
       'it has gone down the whole list.')
  + ex('The lift', 'climbs <em>one floor</em>, checks whether it has arrived, climbs one more, '
       'until it is at your floor.')""",
    """  + ex('The ATM', 'pushes out <em>one note</em>, again, and again, until it reaches the '
       'amount you asked for.', ATM_ART)
  + ex('The attendance SMS', 'sends the same message to <em>one parent</em>, then the next, '
       'until it has gone down the whole list.', SMS_ART)
  + ex('The lift', 'climbs <em>one floor</em>, checks whether it has arrived, climbs one more, '
       'until it is at your floor.', LIFT_ART)""")

io.open(p, 'w', encoding='utf-8').write(s)
print('pass 7b applied to build.py')
