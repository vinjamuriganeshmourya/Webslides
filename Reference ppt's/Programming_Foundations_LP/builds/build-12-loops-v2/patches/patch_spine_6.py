# -*- coding: utf-8 -*-
"""Part 6: take every em-dash out. A label separator becomes a colon; a dash in
prose becomes a comma or a full stop. Nothing the room or the instructor reads
may carry one, the tab title included."""
import io, re

# ---- titles and labels: the dash is a separator, so it becomes a colon -----
COLON = [
 'Hook &mdash; forty copies, and where else',
 'Worksheet &mdash; ten numbers, the long way',
 'Worksheet &mdash; name the three parts',
 'Ask it again &mdash; the condition between passes',
 'Hands-on &mdash; type it, then break it',
 'Worksheet &mdash; find the mistake',
 'Hands-on &mdash; write it in the playground',
 'Exit &mdash; one question',
 'Recap &mdash; the line that lies',
 'Agenda &mdash; where we are going',
 'Worksheet &mdash; the next ten numbers',
 'The condition is asked again &mdash; follow the dot',
 'Classroom quiz &mdash; on the portal',
 'Square pattern &mdash; write it yourself',
 'Key takeaways &mdash; the map',
 'Hook &mdash; forty copies',
 'Worksheet &mdash; ten numbers',
 'Worksheet &mdash; name them',
 'Ask it again &mdash; the dot',
 'Checkpoint 1 &mdash; they can say what one press repeating a job ',
 'Checkpoint 2 &mdash; they can point at the block that repeats',
 'Checkpoint 3 &mdash; they can name the three parts on any loop',
 'Checkpoint 4 &mdash; they can say why a loop never stops',
 'Hard floor &mdash; the exit runs whatever else is dropped',
 'Build it, name it, count it &mdash; seven presses',
 'Ask it again &mdash; follow the dot',
 'Initialization &mdash; line number',
 'Termination condition &mdash; line number',
 'Updation &mdash; line number',
 'The lines you would add &mdash; write as many as it takes',
 'Press 2 &mdash; initialization.',
 'Press 3 &mdash; updation.',
 'Press 4 &mdash; the question.',
 'Press 5 &mdash; termination condition.',
 'Press 6 &mdash; block of code.',
 'Press 7 &mdash; run it.',
 '2 &mdash; nothing at all.',
 'while loop &mdash; today',
 'for loop &mdash; next time',
]

# ---- prose the comma rule would leave clumsy ------------------------------
EXPLICIT = [
 ("'Loops &mdash; Session 12'", "'Loops, Session 12'"),
 ('<title>Loops &mdash; worksheet</title>', '<title>Loops worksheet</title>'),
 ("'counts out <em>one note</em> &mdash; again, and again, and again &mdash; until '",
  "'counts out <em>one note</em> again, and again, and again, until '"),
 ("'&mdash; until it is at your floor.'", "'until it is at your floor.'"),
 ("'climbs <em>one floor</em>, checks whether it has arrived, climbs one more '",
  "'climbs <em>one floor</em>, checks whether it has arrived, climbs one more, '"),
 ("""'<p class="stage-q">Worksheet task 3. <b>Three</b> programs, and every one of them is broken '
    '&mdash; each in a different one of the three parts. Worksheet only: do not run them.</p>'""",
  """'<p class="stage-q">Worksheet task 3. <b>Three</b> programs. Every one is broken, and each '
    'one is broken in a different part. Worksheet tab only: do not run them.</p>'"""),
 ("'Programme 2. Hands first: &ldquo;who said line 3? Who said line 4?&rdquo; Both are defensible '\n  '&mdash; say so.',",
  "'Programme 2. Hands first: &ldquo;who said line 3? Who said line 4?&rdquo; Both are '\n  'defensible, so say so.',"),
 ("'Do not deliver a finished explanation. Say one step, then ask the next as a question '\n         '&mdash; &ldquo;so counter is 3 now.",
  "'Do not deliver a finished explanation. Say one step, then ask the next as a question. '\n         '&ldquo;So counter is 3 now."),
 ("'They are named once, properly, on the build card, and everything after that &mdash; the '\n         'sheet, the mistake hunt, the map &mdash; assumes the room has the words.",
  "'They are named once, properly, on the build card. Everything after that, the '\n         'sheet, the mistake hunt and the map, assumes the room has the words."),
 ("'Say the three things they type: which line is wrong &mdash; or, if something is simply '\n  '<em>missing</em>, what is missing and where it should go &mdash; then which part it is, then '",
  "'Say the three things they type: which line is wrong, or, if something is simply '\n  '<em>missing</em>, what is missing and where it should go. Then which part it is, then '"),
 ("'<li data-k=\"1\"><b>Which line is wrong</b> &mdash; or, if the problem is that something is '",
  "'<li data-k=\"1\"><b>Which line is wrong</b>, or, if the problem is that something is '"),
 ("'is wrong &mdash; or, if something is simply <b>not there</b>, say what is missing and where it '",
  "'is wrong, or, if something is simply <b>not there</b>, say what is missing and where it '"),
]


def clean(path):
    s = io.open(path, encoding='utf-8').read()
    for t in COLON:
        s = s.replace(t, t.replace('&mdash; ', '').replace('&mdash;', '')
                       .replace('  ', ' ')) if False else s
    # colon form, done properly: "A &mdash; B" -> "A: B"
    for t in COLON:
        s = s.replace(t, re.sub(r'\s*&mdash;\s*', ': ', t, count=1))
    for old, new in EXPLICIT:
        s = s.replace(old, new)
    # everything left is a dash in prose: it becomes a comma
    s = s.replace(' &mdash; ', ', ')
    s = s.replace('&mdash; ', '')
    s = s.replace(' &mdash;', ',')
    s = s.replace('&mdash;', '')
    # tidy the artefacts a mechanical pass leaves behind
    s = s.replace(', ,', ',').replace(',,', ',').replace(', .', '.')
    return s


for path in ('build.py',):
    s = clean(path)
    assert '&mdash;' not in s, 'an em-dash survived in %s' % path
    io.open(path, 'w', encoding='utf-8').write(s)

# the template ships one literal em-dash in <title>; the builder now strips it
t = io.open('plan-template.html', encoding='utf-8').read()
t = t.replace('<title>{{SESSION_TITLE}} — lesson plan</title>',
              '<title>{{SESSION_TITLE}} lesson plan</title>')
io.open('plan-template.html', 'w', encoding='utf-8').write(t)

print('part 6 applied')
