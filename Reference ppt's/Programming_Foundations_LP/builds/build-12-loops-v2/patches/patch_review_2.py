# -*- coding: utf-8 -*-
"""Review pass 2: the three claims and prompts that were not true in the room.

1. "each one is broken in a different part" is false. Programme 1 has no
   initialization and programme 3 initializes to the wrong value, so two of the
   three are the same part; and the deck heads slides 44 and 45 both "Incorrect
   Termination Condition". It was also a self-check sitting on the worksheet,
   which the skill forbids.
2. Two prompts said "write it down" at moments when the room has nothing to
   write on: the recap runs before the worksheet is handed out, and the
   explainer's guide entry names a worksheet field that does not exist.
3. Worksheet task 2 asks how many times line 4 runs and never answers it.
"""
import io, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = 'build.py'
s = io.open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, 1)


# ---- 1. the claim that two of the three are not the same part ---------------
sub("""    '<p class="stage-q">Worksheet task 3. <b>Three</b> programs. Every one is broken, and each '
    'one is broken in a different part. Worksheet tab only: do not run them.</p>'""",
    """    '<p class="stage-q">Worksheet task 3. <b>Three</b> programs, and every one of them is '
    'broken. Say which line, which part, and what happens. Worksheet tab only: do not run '
    'them.</p>'""")

sub("""  'of them is broken, and each one is broken in a <b>different</b> part. For each, say which line '
  'is wrong, or, if something is simply <b>not there</b>, say what is missing and where it '
  'should go. <b>Do not run them.</b>',""",
    """  'of them is broken. For each, say which line is wrong, or, if something is simply <b>not '
  'there</b>, say what is missing and where it should go. <b>Do not run them.</b>',""")

sub("""  'Worksheet task 3. Say the shape of it once: three programs, one thing wrong in each, and each '
  'is wrong in a <em>different</em> part.',""",
    """  'Worksheet task 3. Say the shape of it once: three programs, one thing wrong in each.',""")

sub("""   'Programme 1 is the one where no line is wrong. That is deliberate, and it is why the task '
   'also asks what is missing.',""",
    """   'Program 1 is the one where no line is wrong. That is deliberate, and it is why the task '
   'also asks what is missing.',
   '<b>Two of the three are the initialization</b>: program 1 has none at all, and program 3 has '
   'one with the wrong value in it. Do not claim they are three different parts, because they are '
   'not. Say it at the reveal instead: the same part can be missing or simply wrong.',""")

sub("""    '<p class="stage-note">Three minutes, then we go through all four together. Programme 1 has '
    'input 5. Programme 2 has input 10. Programme 3 has input 1.</p>'""",
    """    '<p class="stage-note">Three minutes. Then we go through these three and the one you broke '
    'yourselves, four in all. Program 1 has input 5. Program 2 has input 10. Program 3 has '
    'input 1.</p>'""")

# the reveal the deck names twice
sub("""  ['This is the mistake that will cost them marks in an exam. Say that out loud.',
   'Seventy seconds, and the count of hands at the start is the point of it.'],""",
    """  ['This is the mistake that will cost them marks in an exam. Say that out loud.',
   'The deck heads this card <em>Incorrect Termination Condition</em> and the reveal before it '
   'as well. Say why both names are defensible: the counter starts in the wrong place, so you can '
   'repair it at the start or at the test, and there is nothing to choose between them.',
   'Seventy seconds, and the count of hands at the start is the point of it.'],""")

# ---- 2. write it down, with nothing to write on -----------------------------
sub("""    ask='This should print nothing. It prints Pass. Write down the guilty line number first.',""",
    """    ask='This should print nothing. It prints Pass. Decide the guilty line number, and hold '
        'that many fingers up when I ask.',""")

sub("""  'Then the task, and then silence: &ldquo;it prints Pass. One line is to blame. Write its number '
  'down.&rdquo; Twenty seconds. Do not talk over it.',
  'Take the vote by show of hands, one number at a time: &ldquo;hands for 2 &hellip; for 3 &hellip; '
  'for 5.&rdquo; Count every option out loud.',""",
    """  'Then the task, and then silence: &ldquo;it prints Pass. One line is to blame. Decide which '
  'one.&rdquo; Twenty seconds. Do not talk over it. Laptops are still shut and the worksheet is '
  'not out yet, so this one is fingers, not writing.',
  'Take the vote: &ldquo;hold up that many fingers, all together, on three.&rdquo; Then count the '
  'room out loud, number by number.',""")

sub("""  + '<p class="stage-q">The dot is Python. Set the number, write down what you think prints, '
    '<b>then</b> press play.</p>'""",
    """  + '<p class="stage-q">The dot is Python. Set the number. Say what you think it prints to the '
    'person next to you, <b>then</b> I press play.</p>'""")

sub("""  'The slider is set to 2. Before you touch anything: &ldquo;write down what this prints. All of '
  'it.&rdquo; Ten seconds, at the bottom of the worksheet.',""",
    """  'The slider is set to 2. Before you touch anything: &ldquo;tell the person next to you what '
  'this prints. All of it.&rdquo; Ten seconds, out loud, then quiet.',""")

# ---- 3. the count on task 2 gets answered -----------------------------------
sub("""  'Program B is where it gets interesting. Both of its wrong bins are real beliefs: that '
  'initialization always sets zero, and that updation always adds one. Let those bounce.'],""",
    """  'Program B is where it gets interesting. Both of its wrong bins are real beliefs: that '
  'initialization always sets zero, and that updation always adds one. Let those bounce.',
  'Last thing, and do not skip it: hands for the count on line 4 of Program A. Take 5, and take '
  '6. Then walk it out loud: counter is 1 yes, 2 yes, 3 yes, 4 yes, 5 yes, 6 no. Five passes, six '
  'questions. &ldquo;Same shape as the four you counted on the build card.&rdquo;'],""")

io.open(p, 'w', encoding='utf-8').write(s)
print('review pass 2 applied')
