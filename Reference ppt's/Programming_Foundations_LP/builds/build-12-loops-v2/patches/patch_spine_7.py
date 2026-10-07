# -*- coding: utf-8 -*-
"""Part 7: the bespoke panel. Worksheet task 2's prompt card becomes a
tap-to-classify panel (activity library template 23): six real lines, three
bins, the room commits on the sheet first and a wrong bin bounces out loud."""
import io

s = io.open('build.py', encoding='utf-8').read()


def sub(old, new, n=1):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, n)


start = s.index('# --- 6. Worksheet: name the three parts')
end = s.index('# --- 7. The walker')
sub(s[start:end], '''# --- 6. Tap to classify: which part is this line? ---------------------------
# Activity library template 23. Six lines from two programs, three bins. The
# room fills worksheet task 2 first, so every student has committed in private;
# then the instructor takes a show of hands per line and taps it in. A wrong bin
# bounces and says why in one sentence, which is the two minutes worth having.
# The second program counts DOWN, so "initialization always sets zero" and
# "updation always adds one" both bounce.
def clcase(src, code, bin_, why, oops):
    return (f'<div class="cl-case" data-bin="{bin_}" data-why="{why}" data-oops="{oops}">'
            f'<span class="cl-src">{src}</span><code>{code}</code></div>')

CASES = (
  clcase('Program A, line 2', 'counter = 1', 'i',
         'It sits above the while line, and it runs once.',
         'Look at where it sits. It is above the loop, so it is not the question and not the change.')
+ clcase('Program A, line 3', 'while counter &lt;= 5:', 't',
         'The question on the while line, asked again before every pass.',
         'The word while is on this line. That makes it the termination condition.')
+ clcase('Program A, line 6', 'counter = counter + 1', 'u',
         'Last line of the body, and it changes what the question looks at.',
         'It is inside the body and it changes the counter. That is the updation.')
+ clcase('Program B, line 2', 'seats = 3', 'i',
         'A counter does not have to start at 0. This one starts at 3.',
         'It is above the loop and it sets the counter, even though it starts at 3, not 0.')
+ clcase('Program B, line 3', 'while seats &gt; 0:', 't',
         'The question can count down as well as up.',
         'The word while is on this line, so this is the question being asked.')
+ clcase('Program B, line 5', 'seats = seats - 1', 'u',
         'Updation means change, not add. This one takes one away.',
         'It is inside the body and it changes seats. Taking one away is still updation.'))

BINS = ''.join(
    f'<button type="button" class="cl-bin" data-bin="{k}">'
    f'<b>{label}</b><span class="cl-drop"></span></button>'
    for k, label in (('i', 'Initialization'), ('t', 'Termination condition'),
                     ('u', 'Updation')))

paper2 = pcard('Worksheet task 2: which part is this line?',
  '<div class="stage cl" id="stage-classify" data-classify>'
  + slhead('While Loop', 'Which Part Is This Line?')
  + '<p class="stage-q">Worksheet task 2 first. Two programs, six lines, one letter each. '
    'When everyone has typed all six, we put them in the bins together.</p>'
  + '<div class="cl-wrap"><div class="cl-cases">' + CASES + '</div>'
  + '<div class="cl-bins">' + BINS + '</div></div>'
  + '<p class="cl-say" aria-live="polite"></p>'
  + '<div class="stage-ctl"><button type="button" class="ghost" data-cl-reset>Replay</button>'
    '<span class="ctl-count" data-cl-count></span>'
    '<span class="tmr" data-secs="150"></span></div>'
  + RULE + '</div>',
  sheet='task 2', activity=23)

''')

sub("('ws2', 'k-activity', 4, 'Worksheet: name them')",
    "('ws2', 'k-activity', 4, 'Which part is this line?')")
sub("block('ws2', '&#128187;', 'Worksheet: name the three parts', paper2, 'block-activity'),",
    "block('ws2', '&#128187;', 'Tap to classify: which part is this line?', paper2, "
    "'block-activity'),")

# ------------------------------------------------------------ the guide entry
start = s.index("G.append(g(17, W('Worksheet 2', 4, 17, 'worksheet task 2')")
end = s.index("G.append(g(18, W('Explainer', 3, 18)")
sub(s[start:end], '''G.append(g(17, W('Worksheet 2', 4, 17, 'worksheet task 2'), 'Which part is this line?', [
  'Worksheet task 2. Two programs, and they have not seen either of them.',
  'Say the task once: &ldquo;six lines. Against each one type I, T or U. I for initialization, '
  'T for termination condition, U for updation.&rdquo; Say the words in full, not the letters '
  'only.',
  'Do Program A line 2 together, out loud, so nobody is guessing at the task.',
  'Press play. Two and a half minutes. Walk the rows, and keep talking to them: &ldquo;any '
  'doubts about the task? Ask now&rdquo;, &ldquo;one minute, and the question underneath&rdquo;.',
  'Hands off keyboards <em>first</em>. Then say the check, not before: <em>every loop has '
  'exactly one of each. If you have typed the same letter three times, look again.</em>',
  'Now the panel. Take the first line, count hands for I, for T, for U, and tap the bin the room '
  'voted for. If it snaps home, read the green line. If it bounces, read the red line and take '
  'the vote again.',
  'Program B is where it gets interesting. Both of its wrong bins are real beliefs: that '
  'initialization always sets zero, and that updation always adds one. Let those bounce.'],
  ['Press play on the timer before they start typing.',
   'Tap the bin the room voted for, not the right one. A bin that bounces is the whole point of '
   'the panel.',
   'Replay clears the bins if you want to run a line again.',
   'Say the self-check only after they have stopped typing. On the worksheet it would be a hint, '
   'not a check.'],
  'Program B line 2 and line 5 are the two that bounce most. If they both snap home first time, '
  'the three parts have landed and you can take a minute off the reveals later.'))
''')

io.open('build.py', 'w', encoding='utf-8').write(s)
print('part 7 applied to build.py')

# ----------------------------------------------------------------- worksheet
s = io.open('build.py', encoding='utf-8').read()
start = s.index("T2 = wtask(2,")
end = s.index("M1 = (")
old = s[start:end]
new = '''T2 = wtask(2, 'Which part is this line?',
  'Two programs you have not seen. For each line below type one letter: <b>I</b> for '
  'initialization, <b>T</b> for termination condition, <b>U</b> for updation.',
  wcode('Program A\\n'
        '1   marks = int(input())\\n'
        '2   counter = 1\\n'
        '3   while counter &lt;= 5:\\n'
        '4       print(marks)\\n'
        '5       marks = marks - 2\\n'
        '6       counter = counter + 1\\n'
        '7   print("Done")')
  + wcode('Program B\\n'
          '1   name = input()\\n'
          '2   seats = 3\\n'
          '3   while seats &gt; 0:\\n'
          '4       print(name)\\n'
          '5       seats = seats - 1\\n'
          '6   print("Full")')
  + grid(['Line', 'I, T or U'],
         [['A, line 2 &nbsp; counter = 1', None],
          ['A, line 3 &nbsp; while counter &lt;= 5:', None],
          ['A, line 6 &nbsp; counter = counter + 1', None],
          ['B, line 2 &nbsp; seats = 3', None],
          ['B, line 3 &nbsp; while seats &gt; 0:', None],
          ['B, line 5 &nbsp; seats = seats - 1', None]])
  + line('How many times does line 4 of Program A run?'))

'''
s = s[:start] + new + s[end:]
io.open('build.py', 'w', encoding='utf-8').write(s)
print('part 7 applied to the worksheet')
