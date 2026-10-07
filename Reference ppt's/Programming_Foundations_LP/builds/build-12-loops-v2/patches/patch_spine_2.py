# -*- coding: utf-8 -*-
"""Part 2: the block list, the run sheet, and the paper wording."""
import io

p = 'build.py'
s = io.open(p, encoding='utf-8').read()


def sub(old, new, n=1):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, n)


# ------------------------------------------------------------ the block list
start = s.index('# ======================================================================= BLOCKS')
end = s.index('# ========================================================================= NAV')
sub(s[start:end], """# ======================================================================= BLOCKS
# 21 blocks, 32 cards. The spine holds the ends of the session in place; what
# sits between them is this session's own.
blocks = ''.join([
 block('open', '&#128075;', 'Welcome', welcome),
 block('recaptitle', '&#128221;', 'Recap', recap_title),
 block('recap', '&#128221;', 'Recap &mdash; the line that lies', recap, 'block-quiz'),
 block('hook', '&#129693;', 'Hook &mdash; forty copies, and where else', hook, 'block-hook'),
 block('title', '&#127991;', 'Today', title_card),
 block('agenda', '&#128203;', 'Agenda &mdash; where we are going', agenda),
 block('once', '&#128196;', 'One line, one run &middot; Slides 9&ndash;10',
       slide(9, 'Sequence of Instructions') + slide(10, 'Question')),
 block('ws1', '&#128187;', 'Worksheet &mdash; the next ten numbers', paper1, 'block-activity'),
 block('loops', '&#128260;', 'What a loop is, and the while shape &middot; Slides 11&ndash;13',
       slide(11, 'Loops') + slide(12, 'Loops') + slide(13, 'While Loop')),
 block('anat', '&#129518;', 'Build it, name it, count it &middot; Slides 14, 16 and 24',
       slide(14, 'Example') + slide(16, 'Code') + anatomy + slide(24, 'While Loop'), 'block-hook'),
 block('ws2', '&#128187;', 'Worksheet &mdash; name the three parts', paper2, 'block-activity'),
 block('walk', '&#128161;', 'The condition is asked again &mdash; follow the dot', walk, 'block-hook'),
 block('quiz', '&#128221;', 'Classroom quiz &mdash; on the portal', quiz, 'block-quiz'),
 block('break', '&#128187;', 'Hands-on &mdash; type it, then break it', brk, 'block-hands'),
 block('hunt', '&#128187;', 'Worksheet &mdash; find the mistake', hunt, 'block-activity'),
 block('reveals', '&#9888;', 'The four common mistakes &middot; Slides 42, 44, 45 and 46',
       slide(42, 'Missing Initialization') + slide(44, 'Incorrect Termination Condition')
       + slide(45, 'Incorrect Termination Condition') + slide(46, 'Not Updating Counter Variable')),
 block('square', '&#11088;', 'Square pattern &mdash; write it yourself &middot; Slides 47 and 50',
       slide(47, 'Square Pattern') + write + slide(50, 'While Loop'), 'block-hands'),
 block('exit', '&#127937;', 'Exit &mdash; one question', exitp, 'block-exit'),
 block('takeaways', '&#128506;', 'Key takeaways &mdash; the map', takeaways),
 block('feedback', '&#128172;', 'Feedback', feedback),
 block('thanks', '&#128075;', 'Thank you', thankyou),
])

""")

# --------------------------------------------------------------- the run sheet
start = s.index('CHECKPOINTS = [')
end = s.index("assert sum(d for _, its in CHECKPOINTS for _, _, d, _ in its) == 75")
sub(s[start:end], """CHECKPOINTS = [
 ('Checkpoint 1 &middot; 13 min &middot; they can say what one press repeating a job looks like', [
   ('open', 'k-concept', 1, 'Welcome'),
   ('recaptitle', 'k-concept', 1, 'Recap'),
   ('recap', 'k-quiz', 3, 'Recap &mdash; the line that lies'),
   ('hook', 'k-hook', 6, 'Hook &mdash; forty copies'),
   ('title', 'k-concept', 1, 'Today'),
   ('agenda', 'k-concept', 1, 'Agenda')]),
 ('Checkpoint 2 &middot; 10 min &middot; they can point at the block that repeats', [
   ('once', 'k-concept', 3, 'One line, one run'),
   ('ws1', 'k-activity', 3, 'Worksheet &mdash; ten numbers'),
   ('loops', 'k-concept', 4, 'A loop, and the while shape')]),
 ('Checkpoint 3 &middot; 21 min &middot; they can name the three parts on any loop', [
   ('anat', 'k-hook', 8, 'Build it, name it, count it'),
   ('ws2', 'k-activity', 4, 'Worksheet &mdash; name them'),
   ('walk', 'k-hook', 3, 'Ask it again &mdash; the dot'),
   ('quiz', 'k-quiz', 6, 'Classroom quiz')]),
 ('Checkpoint 4 &middot; 14 min &middot; they can say why a loop never stops', [
   ('break', 'k-hands', 6, 'Type it, then break it'),
   ('hunt', 'k-activity', 4, 'Worksheet &mdash; find the mistake'),
   ('reveals', 'k-concept', 4, 'The four common mistakes')]),
 ('Hard floor &middot; 17 min &middot; the exit runs whatever else is dropped', [
   ('square', 'k-hands', 8, 'Square pattern, written by them'),
   ('exit', 'k-exit', 4, 'Exit &mdash; one question'),
   ('takeaways', 'k-concept', 3, 'Key takeaways'),
   ('feedback', 'k-concept', 1, 'Feedback'),
   ('thanks', 'k-concept', 1, 'Thank you')]),
]
""")

# ------------------------------------------------ paper wording, and the timings
sub("""# --- 4. Paper: ten numbers, the long way -------------------------------------
paper1 = pcard('Paper &mdash; ten numbers, the long way',""",
    """# --- 4. Worksheet: ten numbers, the long way ---------------------------------
paper1 = pcard('Worksheet &mdash; ten numbers, the long way',""")
sub("""# --- 6. Paper: circle the three parts ----------------------------------------""",
    """# --- 6. Worksheet: name the three parts --------------------------------------""")
sub("""# --- 9. Paper: find the mistake ---------------------------------------------
hunt = pcard('Paper &mdash; find the mistake',""",
    """# --- 9. Worksheet: find the mistake ------------------------------------------
hunt = pcard('Worksheet &mdash; find the mistake',""")

# the two eyebrows that named the topic before the title card, and the one that
# read "Your Turn" on a worksheet beat
sub("""  + slhead('Introduction to Loops', 'Your Turn')
  + '<div class="stage-step on" data-label="the task">'
    '<p class="stage-q">Worksheet task 1.""",
    """  + slhead('Loops', 'The Same Question, Ten Times Over')
  + '<div class="stage-step on" data-label="the task">'
    '<p class="stage-q">Worksheet task 1.""")

# the timers that moved with the durations
sub("""'Worksheet only &mdash; the playground stays shut.</p>'
    '<span class="tmr" data-secs="180"></span>'""",
    """'Worksheet only &mdash; the playground stays shut.</p>'
    '<span class="tmr" data-secs="150"></span>'""")
sub("""'<p class="stage-note">Five minutes, then we go through all three together. Programme 1 has '""",
    """'<p class="stage-note">Three minutes, then we go through all four together. Programme 1 has '""")
sub("""    '<span class="tmr" data-secs="300"></span>'
    '</div>' + RULE + '</div>',
  sheet='task 3', activity=3)""",
    """    '<span class="tmr" data-secs="180"></span>'
    '</div>' + RULE + '</div>',
  sheet='task 3', activity=3)""")
sub("""    '<span class="tmr" data-secs="240"></span></div>'
  + '<div class="stage-step" data-label="2 &middot; delete one line">'""",
    """    '<span class="tmr" data-secs="180"></span></div>'
  + '<div class="stage-step" data-label="2 &middot; delete one line">'""")

io.open(p, 'w', encoding='utf-8').write(s)
print('part 2 applied')
