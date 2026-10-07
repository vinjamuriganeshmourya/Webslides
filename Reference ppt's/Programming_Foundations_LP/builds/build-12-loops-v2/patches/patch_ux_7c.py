# -*- coding: utf-8 -*-
"""Pass 7c: the guide follows the cards.

Card 7 is no longer a picture of a block of code, it is an animation with six
presses, so its entry is now a press by press script. Card 20 lost a panel, so
its entry loses the panel it no longer has.
"""
import io, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = 'build.py'
s = io.open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, 1)


# ---- card 7: the animated sequence ----------------------------------------
sub("""G.append(g(7, W('Concept', '40', 7, blk=3), 'Every line runs once, so far', [
  'Ask it as a question, do not read the slide: &ldquo;so far, when Python reaches a line, how '
  'many times does it run that line?&rdquo; Wait. Take &ldquo;once&rdquo; from the room.',
  'Point at the picture: top to bottom, each block once. &ldquo;That is every program you have '
  'written so far.&rdquo;'],
  ['Short of time: ask the question, take &ldquo;once&rdquo;, and move. Do not read the picture.',
   'Forty seconds. It exists to make the next task feel unreasonable.'],
  'Somebody will say &ldquo;write it ten times&rdquo;. Good, that is exactly what the '
  'worksheet is about to ask them to do.'))""",
    """G.append(g(7, W('Concept', '50', 7, blk=3), 'Every line runs once, and you can watch it', [
  'Ask it before you press anything: &ldquo;so far, when Python reaches a line, how many times '
  'does it run that line?&rdquo; Wait. Take &ldquo;once&rdquo; from the room.',
  '<b>Presses 1 to 5.</b> One press per line. Say the line number and what it did, nothing more: '
  '&ldquo;line 1, a is 5. Line 2, a is 6, and the old 5 is struck out. Line 3 prints it.&rdquo;',
  'On press 4 point at the box: &ldquo;a is 7 now. Same two lines as before, written out '
  'again.&rdquo; That is the sentence the worksheet task is about to charge them for.',
  '<b>Press 6.</b> The verdict, then the question under it. Read the question once, slowly, and '
  '<em>do not answer it</em>: &ldquo;before I answer that, I want you to feel why we need it.&rdquo;'],
  ['Short of time: press straight to 6 and read the two bands. The walk is what costs the minute.',
   'Six presses. Arrow keys step it; Replay puts it back to line 1.',
   'Fifty seconds. It exists to make the next task feel unreasonable.',
   'Do not say the word loop on this card. They have not been given it yet.'],
  'Somebody will say &ldquo;write it ten times&rdquo;. Good, that is exactly what the '
  'worksheet is about to ask them to do.'))""")

# card 8 keeps deck slide 10, but the question is now also on card 7, so the
# entry says what card 8 adds rather than repeating it
sub("""G.append(g(8, W('Concept', '20', 8, blk=3), 'The question the session answers', [
  'Read the question off the slide once, slowly: can we control the flow so a block runs more '
  'than once?',
  'Do not answer it. Say instead: &ldquo;before I answer that, I want you to feel why we need '
  'it.&rdquo;',
  'Hand straight over to the worksheet.'],
  ['Twenty seconds. It is a hinge, not a concept.'],""",
    """G.append(g(8, W('Concept', '20', 8, blk=3), 'The question, left hanging', [
  'The deck asks it again, in its own words. Do not read it twice. Leave it up while you say the '
  'handover line and nothing else.',
  'Do not answer it. Say instead: &ldquo;before I answer that, I want you to feel why we need '
  'it.&rdquo;',
  'Hand straight over to the worksheet.'],
  ['Short of time: this is the one card in the block that can go. Card 7 already asked it.',
   'Twenty seconds. It is a hinge, not a concept.'],""")

# ---- card 20: two panels, not three ---------------------------------------
sub("""  'Show them the stop button once, then step to panel 3: put the line back, and move it above '
  'print(a).',
  'Take the difference from the room: &ldquo;same three numbers? No, what changed?&rdquo;'],
  ['Short of time: drop panel 3. Panels 1 and 2 carry the beat.',
   'Panels 1, 2, 3 step with Next. Each has its own timer; press play on each.',""",
    """  'Show them the stop button once. Then, on the same card, the second change: put the line back, '
  'and move it above print(a).',
  'Take the difference from the room: &ldquo;same three numbers? No, what changed?&rdquo;'],
  ['Short of time: take change 1 only. It is the one the four common mistakes card comes back to.',
   'Two panels, not three: change 1 and change 2 are on one card, with one timer for both. '
   'Read change 1 out, wait, then point at change 2. Do not let them do both at once.',""")

sub("""  'Step to panel 2 and frame it as your own mistake: &ldquo;I think I have left a line out by '
  'accident, delete counter equals counter plus one and run it again with a = 5.&rdquo; Do '
  'not warn them.',""",
    """  'Step to the second panel and frame change 1 as your own mistake: &ldquo;I think I have left a '
  'line out by accident, delete counter equals counter plus one and run it again with a = '
  '5.&rdquo; Do not warn them, and cover change 2 with your hand if you have to.',""")

io.open(p, 'w', encoding='utf-8').write(s)
print('pass 7c applied')
