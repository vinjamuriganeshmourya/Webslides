# -*- coding: utf-8 -*-
"""Part 3: the instructor guide, one entry per card, renumbered for the spine."""
import io

p = 'build.py'
s = io.open(p, encoding='utf-8').read()

start = s.index('# ======================================================================= GUIDE')
end = s.index("guide = ('<div id=\"guide-view\">")

NEW = r'''# ======================================================================= GUIDE
NCARDS = 32

def g(card, whenstr, head, flow, do, watch, handout=False):
    fl = ''.join(f'<li>{x}</li>' for x in flow)
    dl = ''.join(f'<li>{x}</li>' for x in do)
    hd = ' data-handout' if handout else ''
    return (f'<article class="gcard" data-card="{card}"{hd}>'
            f'<div class="gthumb">@@T{card}@@</div><div class="gbody">'
            f'<p class="gwhen">{whenstr}</p><h4>{head}</h4>'
            f'<div class="gflow"><b>How it goes</b><ol>{fl}</ol></div>'
            f'<ul class="gdo">{dl}</ul>'
            f'<p class="gwatch"><b>Watch for</b> {watch}</p>'
            '</div></article>')

def W(kind, mins, n, extra=''):
    return (f'{kind} &middot; {mins} min &middot; card {n} of {NCARDS}'
            + (f' &middot; {extra}' if extra else ''))

G = []
G.append('<h3 class="ghd">Checkpoint 1 &mdash; they can say what one press repeating a job '
         'looks like</h3>')
G.append(g(1, W('Opening', 1, 1), 'Welcome, while they settle', [
  'This is up as they walk in and find seats. Say nothing over it.',
  'When the room is quiet, one line: &ldquo;good morning &mdash; laptops shut, please. I will '
  'tell you when to open them.&rdquo;'],
  ['Ten seconds. Move on as soon as the talking stops.',
   'Do not name the topic here. They guess it later, and the card after the hook tells them.'],
  'Nothing. This card is the room settling.'))
G.append(g(2, W('Recap', 1, 2), 'The word Recap, and nothing else', [
  'One press, one word. Say what it is about: &ldquo;last session was nested conditional '
  'statements. Quick check on that before we start anything new.&rdquo;',
  'Do not list what was covered. Reading a list is not remembering.'],
  ['Five seconds. The next card is the actual retrieval.'],
  'Nothing yet.'))
G.append(g(3, W('Recap', 3, 3), 'Find the line that lies', [
  'Read the program out, line by line, with the line numbers. Marks is 30.',
  'Say what it was meant to do: &ldquo;Pass should only print when marks is 35 or more. Marks is '
  '30. So this should print nothing at all.&rdquo;',
  'Then the task, and then silence: &ldquo;it prints Pass. One line is to blame. Write its number '
  'down.&rdquo; Twenty seconds. Do not talk over it.',
  'Take the vote by show of hands, one number at a time: &ldquo;hands for 2 &hellip; for 3 &hellip; '
  'for 5.&rdquo; Count every option out loud.',
  'Press Show me. Press 1 puts the wrong output up; press 2 lights line 5 and says why; press 3 '
  'shows what it should have printed.',
  'Close on the idea today needs: &ldquo;the indent decides which block a line belongs to. Line 5 '
  'is at the left edge, so it is outside both ifs.&rdquo;'],
  ['The panel drives itself: Show me steps it, Replay puts it back. Arrow keys work inside it too.',
   'Hands down before you press. A recap they watch teaches nothing.',
   'Do not reteach nesting. Three presses, three minutes, move.'],
  'A room that votes for line 3 has the nesting right but not the indent. Say the rule once and '
  'carry on; it comes back all session.'))
G.append(g(4, W('Hook', 6, 4), 'Forty copies, and where else they have seen it', [
  'Start from something all of them have done: &ldquo;the xerox shop outside the gate. You hand '
  'over one form and say forty copies.&rdquo;',
  'Say what they already know, so nobody has to correct you: &ldquo;he does not press the button '
  'forty times. He types 40, presses START once, and goes back to his phone.&rdquo;',
  'Now the question that is actually interesting: &ldquo;but the machine only knows how to make '
  '<em>one</em> copy. So what is happening <em>inside</em> it, forty times over?&rdquo; Take two '
  'or three answers. Take the wrong ones too. Correct nobody.',
  '<b>Press 1 and 2.</b> The column of forty jobs, then the note: &ldquo;one job, forty times '
  'over. That is all the machine is doing.&rdquo;',
  '<b>Press 3.</b> The machine goes and the question changes: where else have you seen this? Then '
  '<em>stop talking</em>. Nudge instead: &ldquo;anything on this campus with a button on it.&rdquo;',
  'Take three or four. Make each one say <em>both</em> halves: the machine, and the one job it '
  'repeats. &ldquo;ATM&rdquo; is half an answer; &ldquo;the ATM counts one note, again and again, '
  'until it reaches the amount&rdquo; is the answer.',
  '<b>Presses 4, 5, 6.</b> One of ours per press, only after theirs. Tie each to whichever student '
  'answer it matches.',
  '<b>Press 7.</b> Back to the machine, and the column collapses onto one line. Say nothing at all '
  'while it moves. Then: &ldquo;one instruction, written once. Forty copies still come out.&rdquo;',
  'Point at the code and say plainly what it is, without naming it: &ldquo;this is what is running '
  'behind the scenes in that machine. What it is called, and how to write one &mdash; that is '
  'today.&rdquo;'],
  ['Seven presses. Arrow keys step it in presenter view; Replay puts it back to press 1.',
   'No timer on this card. A clock turns a call for examples into a task with a right answer.',
   'Do not claim the operator presses the button forty times. They know he does not, and the hook '
   'dies the moment one of them says so.',
   'Never go round naming people. Keep their answers on the board; they come back at the takeaways.'],
  'If somebody says &ldquo;loop&rdquo; before you do, take it and use their word all session.'))
G.append(g(5, W('Title', 1, 5), 'Now name it', [
  'Press through. The card says one word, and it is the word half the room has already said.',
  'One line: &ldquo;yesterday we decided <em>whether</em> a line runs. Today we decide <em>how '
  'many times</em> it runs.&rdquo;'],
  ['Ten seconds. Do not start the agenda on this card.'],
  'Nothing. This card exists so the room hears the name after they have guessed it.'))
G.append(g(6, W('Agenda', 1, 6), 'Four stops, and the worksheet', [
  'One press per stop. Read the stop, then the line under it, then move.',
  'Stop 4 is the promise worth saying out loud: &ldquo;by the end you will have written one of '
  'these yourself.&rdquo;',
  'Then get the worksheet open on every laptop.'],
  ['Send the worksheet link now and have them download it and open it. This is the only hand-out '
   'moment in the session, and every task today is in that one file.',
   'Ten seconds per stop. Do not narrate more than the line that is there.'],
  'Nothing. This card exists so the room knows where it is going.', handout=True))

G.append('<h3 class="ghd">Checkpoint 2 &mdash; they can point at the block that repeats</h3>')
G.append(g(7, W('Concept', 3, 7), 'Every line runs once, so far', [
  'Ask it as a question, do not read the slide: &ldquo;so far, when Python reaches a line, how '
  'many times does it run that line?&rdquo; Wait. Take &ldquo;once&rdquo; from the room.',
  'Point at the picture: top to bottom, each block once. &ldquo;That is every program you have '
  'written so far.&rdquo;'],
  ['Forty seconds. It exists to make the next task feel unreasonable.'],
  'Somebody will say &ldquo;write it ten times&rdquo;. Good &mdash; that is exactly what the '
  'worksheet is about to ask them to do.'))
G.append(g(8, W('Concept', 3, 8), 'The question the session answers', [
  'Read the question off the slide once, slowly: can we control the flow so a block runs more '
  'than once?',
  'Do not answer it. Say instead: &ldquo;before I answer that, I want you to feel why we need '
  'it.&rdquo;',
  'Hand straight over to the worksheet.'],
  ['Twenty seconds. It is a hinge, not a concept.'],
  'A student who answers it correctly here is welcome &mdash; take the word, then still run the '
  'worksheet task. Feeling the pain is the point, not hearing the answer.'))
G.append(g(9, W('Worksheet 1', 3, 9, 'worksheet task 1'), 'Ten numbers, the long way', [
  'Worksheet open, playground shut. Task 1 has the three-number program already in it.',
  'Read the change once: &ldquo;same question, but now it asks for the next <em>ten</em>.&rdquo;',
  'Say the two things they write: the lines they would add, and then the two numbers in the '
  'little table.',
  'Press play on the timer. Two and a half minutes.',
  'Walk the rows while they work and keep talking to them &mdash; &ldquo;are you guys done?&rdquo; '
  '&middot; &ldquo;come on, let us see who finishes first&rdquo; &middot; &ldquo;one minute left, '
  'just the line count now&rdquo;.',
  'Hands off keyboards. Ask for the line count by show of hands: &ldquo;fewer than fifteen? '
  '&hellip; more than twenty?&rdquo; Then: &ldquo;and for a hundred numbers?&rdquo;'],
  ['Press play on the timer. It does not start by itself.',
   'Do not show a solution. The next cards are the answer.',
   'Tasks 2 and 3 are further down the same file. Tell them to leave those alone for now.'],
  'Twenty-one lines is right: one input line plus ten pairs. Anyone who wrote a loop already has '
  'been reading ahead &mdash; ask them to hold it for two cards.'))
G.append(g(10, W('Concept', 4, 10), 'A loop runs a block several times', [
  'Open from their own sheets: &ldquo;twenty-one lines, and you all wrote the same two of them '
  'ten times.&rdquo;',
  'Now name it, pointing at the orange arrow: &ldquo;a loop lets us execute one block of code '
  'several times.&rdquo;',
  'Check them with a question, do not tell: &ldquo;how many <em>different</em> lines are in that '
  'blue block? One block, how many runs?&rdquo;'],
  ['Do not name while or for yet. The next card does that, and it lands better as an answer.',
   'Sixty seconds.'],
  'If the room is quiet at the check question, narrow it: &ldquo;point at the block that '
  'repeats.&rdquo;'))
G.append(g(11, W('Concept', 4, 11), 'Python has two ways to loop', [
  'Ask first: &ldquo;so how do we write one in Python?&rdquo; Then put the card up.',
  'Read it plainly: two ways &mdash; the <em>while</em> loop and the <em>for</em> loop.',
  'Say which is which and when: &ldquo;today is while, start to finish. The for loop comes in a '
  'later session. Both do the same job; they are written differently.&rdquo;'],
  ['Twenty seconds. Its only job is that nobody leaves thinking while is the only loop there is.',
   'Do not promise the for loop for tomorrow &mdash; say &ldquo;a later session&rdquo; unless you '
   'know the timetable.'],
  'Students who have seen for loops elsewhere will want to use one all session. Tell them plainly '
  'that today is about the three lines you have to write yourself.'))
G.append(g(12, W('Concept', 4, 12), 'The while shape', [
  'Straight on: &ldquo;this is the first one, and it is called while.&rdquo;',
  'Read the shape off the picture in order &mdash; the word while, the condition, the colon, and '
  'then the indented block underneath it.',
  'Connect it to yesterday out loud: &ldquo;same colon, same indent as an if. The difference is '
  'one word.&rdquo;',
  'Then the difference that matters: &ldquo;an if asks its condition once. This one asks it '
  '<em>again</em>, every time round.&rdquo;'],
  ['Point at the indent with your hand. That is the same rule they learned yesterday.',
   'Sixty seconds. The build that follows is where it gets assembled.'],
  'A student saying &ldquo;so it is an if that repeats&rdquo; has it. Use their sentence.'))

G.append('<h3 class="ghd">Checkpoint 3 &mdash; they can name the three parts on any loop</h3>')
G.append(g(13, W('Concept', 8, 13), 'The example, and what it asks for', [
  'Read the question off the card: print the next three consecutive numbers of the input.',
  'Point at both example boxes. Input 1 gives 2, 3, 4. Input 10 gives 11, 12, 13.',
  'Tie it to their own sheet: &ldquo;this is the question you just did by hand, and you already '
  'know what the long way costs.&rdquo;'],
  ['Thirty seconds. It is the question the next three cards answer.'],
  'Nothing. This is the problem statement, not a concept.'))
G.append(g(14, W('Concept', 8, 14), 'The block that repeats', [
  'Point at the grey band: &ldquo;these two lines, three times over. That is your sheet, printed '
  'neatly.&rdquo;',
  'Read the sentence beside it out loud, and then make it the question: &ldquo;so what we want is '
  'to make <em>this block</em> run three times, instead of writing it three times. How?&rdquo;',
  'Do not answer. Go to the build.'],
  ['Thirty seconds. This card names the block; do not also name the three parts here. That is the '
   'next card\'s job.'],
  'A student who says &ldquo;put it in a loop&rdquo; is right and early. Ask them what the loop '
  'needs to know, and build it from their answer.'))
G.append(g(15, W('The build', 8, 15), 'Build it, name it, count it &mdash; seven presses', [
  '<b>Press 1.</b> The skeleton is up: the input line, the two lines from their own sheet that '
  'repeat, and a while line with a <em>gap</em> where the condition should be. Say what is '
  'missing: &ldquo;three lines to go, and you are going to give me one of them.&rdquo;',
  '<b>Press 2 &mdash; initialization.</b> Ask before you press: &ldquo;if I want this to happen '
  'exactly three times, what do I need first?&rdquo; Take &ldquo;a count&rdquo; from the room, '
  'then press.',
  'Read the card: it runs <em>once</em>. Push it: &ldquo;even if the loop goes round a hundred '
  'times?&rdquo; Still once. Write the word on the board.',
  '<b>Press 3 &mdash; updation.</b> Ask first: &ldquo;the counter is sitting at zero. Who is going '
  'to change it?&rdquo; Press. The question that matters is <em>where</em>: &ldquo;is that line '
  'inside the loop or outside? How can you tell?&rdquo; Wait for the indent. Write the word.',
  '<b>Press 4 &mdash; the question.</b> A red dashed box, and nothing else. Read it out and then '
  '<em>stop talking</em>. Ten seconds of silence.',
  'Then take answers from three different parts of the room before you say whether any is right. '
  'Push on what they give you: &ldquo;counter equals three? When would that be True? Walk it with '
  'me.&rdquo;',
  '<b>Press 5 &mdash; termination condition.</b> The answer lands in the gap. Check it against '
  'their answers, not against the screen. Now the count, and ask before you read it: &ldquo;the '
  'body runs three times. How many times does <em>line 3</em> run?&rdquo; Most of the room will '
  'say three.',
  'Let them be wrong, then count it together on the board: 0 &lt; 3 yes, 1 &lt; 3 yes, 2 &lt; 3 '
  'yes, 3 &lt; 3 <em>no</em>. Four. &ldquo;Three yeses and one no. The no is how it stops.&rdquo; '
  'Write the words on the board.',
  '<b>Press 6 &mdash; block of code.</b> Three times, only while the answer is True. Thirty '
  'seconds; they can see it.',
  '<b>Press 7 &mdash; run it.</b> Input 5 gives 6, 7, 8, End. Close on it: &ldquo;four parts. '
  'Three of them you write yourself, and the fourth is the work you actually wanted done.&rdquo;'],
  ['Seven presses, and this one card replaces what used to be five slides. Do not rush it &mdash; '
   'it is the centre of the session.',
   'Presses 4 and 5 are the whole thing. If you are running late, shorten presses 6 and 7, never '
   'the silence on press 4 or the count on press 5.',
   'Write initialization, termination condition and updation on the board as they arrive, and '
   'leave all three there for the rest of the session.'],
  'A student who says &ldquo;four&rdquo; before you count it has understood the back edge already. '
  'Ask them to say why, and let the room hear it from them rather than from you.'))
G.append(g(16, W('Concept', 8, 16), 'The shape, with the names on it', [
  'Straight on from the build: &ldquo;strip the example away and this is what is left. This is '
  'every while loop you will ever write.&rdquo;',
  'Read it top to bottom against the words already on your board: initialization outside, '
  'termination condition on the while line, block of code indented, updation last and still '
  'indented.',
  'One check: &ldquo;which of those four is <em>outside</em> the loop?&rdquo; Wait for it.'],
  ['This is the diagram they will redraw in an exam, and it is the one the takeaways map rebuilds '
   'at the end. Leave it up while you give the worksheet task.',
   'Sixty seconds. It is a summary, not a new idea.'],
  'Anyone pointing at updation as outside has confused the indent. Fix it here, not later.'))
G.append(g(17, W('Worksheet 2', 4, 17, 'worksheet task 2'), 'Name the three parts', [
  'Worksheet task 2. One program, and they have not seen this one.',
  'Read the task off the panel: a line number for each of initialization, termination condition '
  'and updation. Say the words in full every time.',
  'Do the first one together, out loud, so nobody is guessing at the task.',
  'Press play. Two and a half minutes. Walk the rows &mdash; &ldquo;any doubts about the task? Ask '
  'now&rdquo; &middot; &ldquo;one minute, and the question underneath&rdquo;.',
  'Hands off keyboards <em>first</em>. Then say the check, not before: <em>every loop you will '
  'ever write has exactly one of each. If you have typed the same line number twice, look '
  'again.</em>',
  'Take the three answers by show of hands, one at a time. Then the number.'],
  ['Press play on the timer.',
   'Say the self-check only after they have stopped typing. On the worksheet it would be a hint, '
   'not a check.'],
  'The answers are line 2, line 3 and line 6, and line 4 runs five times. The condition uses '
  '&lt;= rather than &lt;, which is the bit worth twenty seconds: &ldquo;counter starts at 1 and '
  'the test is less-than-or-equal. Count the yeses.&rdquo;'))
G.append(g(18, W('Explainer', 3, 18), 'Ask it again &mdash; follow the dot', [
  'Open from the lines they just named: &ldquo;you found the three lines. Now watch what Python '
  'does with them.&rdquo;',
  'The slider is set to 2. Before you touch anything: &ldquo;write down what this prints. All of '
  'it.&rdquo; Ten seconds, at the bottom of the worksheet.',
  'Press Play, then narrate the dot as it moves &mdash; one step per sentence, asking rather than '
  'telling: &ldquo;first it sets a to 5, and counter to 0. Now it reaches the diamond. Is 0 less '
  'than 2? Yes, so we go inside &hellip;&rdquo;',
  'Then, with your hand on the back edge: &ldquo;look where it goes next. It runs back up '
  '<em>that line</em>, to the same question. Is 1 less than 2? Yes again.&rdquo;',
  'On the pass that fails, slow right down: &ldquo;counter is 2. Is 2 less than 2? No. So we do '
  'not go in. We come out at the bottom and print End.&rdquo;',
  'Tie it back to the build: &ldquo;count the times the dot touched that diamond. Three yeses and '
  'a no &mdash; four. Same number as before.&rdquo;',
  'Now drag the slider to <b>0</b> and ask before playing: &ldquo;what prints now?&rdquo; Take the '
  'vote. Most of the room says 6. Play it: the whole body greys out and stays grey.'],
  ['One step is the button to use while you narrate &mdash; it stops on the line they argued about.',
   'Press Reset before you leave the card, or the next class sees a finished run.',
   'Three minutes. If you are behind, run it once at 2 and once at 0 and skip the narration in '
   'between.'],
  'The 0 prediction is the one that splits the room. Let them be wrong out loud before you play '
  'it.'))
G.append(g(19, W('Quiz', 6, 19), 'Classroom quiz, on the portal', [
  'Card up, and announce it: &ldquo;open the learning portal on your laptop. Today\'s classroom '
  'quiz is live.&rdquo;',
  'Say the two things they need: how long they have, and that it is individual. Five minutes, '
  'own laptop, no talking.',
  'Do not read any question out, and do not put one on the board. The portal has them.',
  'Walk the room while they attempt it. Look at screens, not at the clock.',
  'When the portal closes it, take the two questions most of the room got wrong and say the '
  'correct reasoning for each in one sentence. Nothing longer.',
  'Use it to decide the second half: if the three parts have not landed, take the square pattern '
  'down to five minutes and spend the time on the reveals.'],
  ['No timer on this card. The portal runs its own clock, and a second one is noise.',
   'A student who finishes early goes back to worksheet task 2 and checks their line numbers.',
   'Five to six minutes total, including the two sentences at the end.'],
  'The quiz is the checkpoint for the whole first half. A weak result here is not a reason to '
  'reteach from the start; it is a reason to slow the reveals down.'))

G.append('<h3 class="ghd">Checkpoint 4 &mdash; they can say why a loop never stops</h3>')
G.append(g(20, W('Hands-on', 6, 20), 'Type it, then break it', [
  'Laptops open. &ldquo;Type this exactly. Do not copy mine &mdash; type it.&rdquo; The first line '
  'asks for a, so run it with a = 5, then a = 1, then a = 100. Three minutes.',
  'Walk the rows. Most errors will be the indent or the colon. Say so out loud once so nobody '
  'feels singled out.',
  'Step to panel 2 and frame it as your own mistake: &ldquo;I think I have left a line out by '
  'accident &mdash; delete counter equals counter plus one and run it again with a = 5.&rdquo; Do '
  'not warn them.',
  'Let them react. Somebody will shout. Only then: &ldquo;what is it waiting for? Counter is still '
  'zero, so the answer to the question never changes.&rdquo;',
  'Show them the stop button once, then step to panel 3: put the line back, and move it above '
  'print(a).',
  'Take the difference from the room: &ldquo;same three numbers? No &mdash; what changed?&rdquo;'],
  ['Panels 1, 2, 3 step with Next. Each has its own timer; press play on each.',
   'Know where the stop button is in your playground before the session.',
   'They meet the fourth common mistake here by doing it. The card that names it comes after the '
   'worksheet hunt, not before.'],
  'Moving the update above print(a) prints 6, 7, 8 still &mdash; counter is not printed. The '
  'lesson is that <em>order inside the body</em> matters for what prints, not for how many passes.'))
G.append(g(21, W('Worksheet 3', 4, 21, 'worksheet task 3'), 'Find the mistake', [
  'Open from what they just did: &ldquo;you broke updation on purpose. Here are three programs '
  'somebody broke by accident.&rdquo;',
  'Worksheet task 3. Say the shape of it once: three programs, one thing wrong in each, and each '
  'is wrong in a <em>different</em> part.',
  'Say the three things they type: which line is wrong &mdash; or, if something is simply '
  '<em>missing</em>, what is missing and where it should go &mdash; then which part it is, then '
  'what happens when you run it. Read the inputs off the sheet: 5, then 10, then 1.',
  'Press play. Three minutes. Worksheet tab only &mdash; say why: running them answers the '
  'question for free.',
  'Walk the rows. &ldquo;Which part is that? Say the word&rdquo; &middot; &ldquo;programme 3 is '
  'the sneaky one &mdash; count the yeses&rdquo;.',
  'Hands off keyboards. Do not take the answers here &mdash; the next four cards are the answers, '
  'one at a time.'],
  ['Press play on the timer.',
   'Programme 1 is the one where no line is wrong. That is deliberate, and it is why the task '
   'also asks what is missing.',
   'Worksheet tab only. If somebody runs programme 2 they freeze a tab, and you lose the reveal.',
   'Answers, for you only: programme 1 has no initialization; programme 2 stores the answer of '
   'the condition in a box; programme 3 starts the counter at 1 and runs twice, not three times.'],
  'Programme 3 is the one most of them will mark correct. That is the finding, and it is worth '
  'saying out loud when the reveal comes.'))
G.append(g(22, W('Reveal 1 of 4', 4, 22), 'Missing initialization', [
  'Programme 1 first. Ask for hands before you show anything: &ldquo;who typed that a line is '
  'missing?&rdquo;',
  'Then reveal, and read the error text out exactly: name counter is not defined.',
  'Ask them to name the part: &ldquo;which of the three is missing?&rdquo; Take the word from the '
  'room, not from you.',
  'Say the rule they can use in an exam: &ldquo;if you ever see that error under a while loop, '
  'look <em>above</em> the loop, not inside it.&rdquo;',
  'One extra beat worth twenty seconds: &ldquo;notice it did not loop forever. It did not loop at '
  'all &mdash; it stopped before the first pass.&rdquo;'],
  ['Sixty seconds. It is the easy one of the four.'],
  'Students often read NameError as a typo. Say plainly it is not spelling &mdash; the line that '
  'creates the variable is simply not there.'))
G.append(g(23, W('Reveal 2 of 4', 4, 23), 'A condition stored in a box', [
  'Programme 2. Hands first: &ldquo;who said line 3? Who said line 4?&rdquo; Both are defensible '
  '&mdash; say so.',
  'Read line 3 aloud very slowly: condition equals, bracket, counter less than three, bracket.',
  'Ask the one question and then stop talking: &ldquo;what gets stored in condition &mdash; the '
  'question, or the answer?&rdquo;',
  'Now the card: the answer, True, stored once. Line 4 asks the box, not the counter. The last '
  'line keeps changing counter, and nothing ever looks at counter again.',
  'Name it: <em>infinite loop</em>. Then connect it back: &ldquo;same ending as when you deleted '
  'the update line. Different cause.&rdquo;'],
  ['Seventy seconds. This is the hard one of the four.',
   'Call the variable &ldquo;the box called condition&rdquo; every time, or the sentence becomes '
   'unparseable.'],
  'Two different causes, one symptom. If a student conflates them, ask: &ldquo;which line was '
  'wrong in each?&rdquo;'))
G.append(g(24, W('Reveal 3 of 4', 4, 24), 'Off by one', [
  'Programme 3, and ask the honest question: &ldquo;how many of you marked this one '
  'correct?&rdquo; Count the hands. It will be most of the room.',
  'Point at the output: input is 1, three numbers were wanted, two came out.',
  'Walk the counter out loud with them: starts at 1, so 1 yes, 2 yes, 3 no. Two passes.',
  'Give them both repairs: start at 0 and keep less than 3, or start at 1 and use less than 4. '
  'Ask which they prefer and why.'],
  ['This is the mistake that will cost them marks in an exam. Say that out loud.',
   'Seventy seconds, and the count of hands at the start is the point of it.'],
  'Anyone who says &ldquo;just change it to 4&rdquo; is right and should be asked to say why it '
  'works &mdash; that is the understanding you want.'))
G.append(g(25, W('Reveal 4 of 4', 4, 25), 'Not updating the counter', [
  'This one they already met, on their own laptops. Ask first: &ldquo;which of you made this '
  'happen twenty minutes ago?&rdquo;',
  'Point at the missing line, then at the words on the right: the counter never changes, so the '
  'answer to the question never changes.',
  'Close the whole set: &ldquo;initialization, termination condition, updation. You have now '
  'broken all three and seen what each one costs &mdash; an error before it starts, the wrong '
  'number of passes, and a loop that never stops.&rdquo;'],
  ['Fifty seconds. It is a naming card, not a new idea &mdash; they did the discovery already.',
   'If you are short of time, this is the one reveal you can say in a sentence without putting '
   'the card up.'],
  'A room that says &ldquo;that is the same as programme 2&rdquo; is close but not right. Ask '
  'which line is wrong in each; the answers are different lines.'))

G.append('<h3 class="ghd">Hard floor &mdash; the exit runs whatever else is dropped</h3>')
G.append(g(26, W('Concept', 8, 26), 'The square pattern', [
  'Read the question off the card: stars in N rows and N columns.',
  'Point at the output and say the thing that costs marks: there is a space after every star.',
  'Give them the shortcut they already own: &ldquo;which string operation gives you a star and a '
  'space, n times?&rdquo; Take string repetition from the room.',
  'Ask, and hold the answer: &ldquo;which part repeats &mdash; the row, or the star?&rdquo; They '
  'decide it at the keyboard.'],
  ['Do not code this on screen. They write it.',
   'Say the space rule twice. It is the single most common reason a correct program fails a test '
   'case here. If nobody recalls string repetition, write "* " * 3 on the board and let them '
   'read it.'],
  'A room that says &ldquo;both&rdquo; is ahead of the syllabus &mdash; tell them they are right, '
  'and that the inner one has a shortcut today.'))
G.append(g(27, W('Hands-on', 8, 27), 'Write it in the playground', [
  'Laptops open, playground open, blank file. Only the input line is on screen; everything after '
  'it is theirs.',
  'Before anybody types, take one answer out loud: &ldquo;n is 3. How many times does the print '
  'line have to run?&rdquo; Three. That is their termination condition, and now they know it.',
  'Press play. Four and a half minutes. Walk the rows continuously &mdash; &ldquo;are you guys '
  'done?&rdquo; &middot; &ldquo;show me your three parts&rdquo; &middot; &ldquo;run it with '
  '5&rdquo;.',
  'For anyone stuck, ask the three words, do not give code: &ldquo;where is your '
  'initialization?&rdquo;',
  'Last ninety seconds: everybody runs it with 3, then 5, then 1.'],
  ['Press play on the timer.',
   'Nothing goes on the worksheet for this one &mdash; they type it. The prediction happens out '
   'loud before the laptops open.',
   'Do not put a solution on screen while they work.'],
  'The common bug is counter less than 3 hard-coded instead of counter less than n &mdash; it '
  'passes their first test and fails the second. Let them find it with input 5.'))
G.append(g(28, W('Concept', 8, 28), 'The solution', [
  'Up on screen only after the timer has run out.',
  'Read it against their three words: initialization, termination condition using n, the block, '
  'updation.',
  'Point at the line that does the work: print of star-space times n, inside a loop that runs n '
  'times. &ldquo;The star repeats across with the string. The row repeats down with the '
  'loop.&rdquo;',
  'Ask for hands: &ldquo;who got the same three parts, even if your variable names are '
  'different?&rdquo;'],
  ['Do not retype it. Compare it to what is already on their screens.',
   'A student who stored the row in a variable first is also correct &mdash; say so out loud.'],
  'Anyone whose program works for 4 but not 5 hard-coded the number. Name the symptom, not the '
  'student.'))
G.append(g(29, W('Exit', 4, 29), 'One question, and it is hard', [
  'Frame it as a real thing: &ldquo;a name-board app prints one letter per line. Somebody types a '
  'single letter.&rdquo;',
  'Read the code once, by line number. Then stop talking and press play on the timer. Two and a '
  'half minutes, silent.',
  'Vote by hands, option by option. Count every option out loud.',
  'Reveal. Walk it: length is 1, so the question is 0 less than 0, which is False the first time. '
  'The body never runs.',
  'Name each wrong option: 1 is &ldquo;a loop must run at least once&rdquo;, 3 is &ldquo;I saw an '
  'index and expected an index error&rdquo;, 4 is &ldquo;I saw a while and expected '
  'forever&rdquo;.',
  'Tie it to the recap: &ldquo;first thing this morning you saw a program that should print '
  'nothing. Same idea, harder question.&rdquo;'],
  ['Press play on the timer. It does not start by itself.',
   'This runs even if everything else is cut. It is the hard floor.'],
  'A big vote for option 1 is the finding worth carrying into the next session: they still believe '
  'a loop body always runs once.'))
G.append(g(30, W('Takeaways', 3, 30), 'The map, one press at a time', [
  'Do not read it out. Ask for it. Press 1 gives them the word loops; then ask &ldquo;and how '
  'many kinds did we see?&rdquo; before press 2.',
  'Press 2: while and for. One line only &mdash; &ldquo;today was this one. The other one comes '
  'in a later session.&rdquo;',
  'Presses 3 to 6 rebuild the block diagram, one band at a time. Ask for each word before you '
  'press: &ldquo;what goes above the loop? What goes on the while line? What goes at the bottom '
  'of the body?&rdquo;',
  'Press 6 also draws the arrow back up. Point at it: &ldquo;and that is the bit that surprised '
  'you &mdash; it asks again.&rdquo;',
  'Press 7 is three different endings, not one. Take them one at a time: &ldquo;leave out the '
  'initialization &mdash; what did programme 1 do?&rdquo; It stopped with an error. &ldquo;Get the '
  'condition wrong?&rdquo; Wrong count, or none. &ldquo;Leave out the updation?&rdquo; Never '
  'stops.'],
  ['Seven presses. Arrow keys work in presenter view.',
   'Do not let the last box be read as one sentence. The three parts fail in three different ways, '
   'and that distinction is the whole card.'],
  'They should be able to produce all three words unprompted. If they cannot, that is what opens '
  'the next session.'))
G.append(g(31, W('Closing', 1, 31), 'Feedback', [
  'Put it up while they are still packing, and say where the form is: &ldquo;the feedback link is '
  'under today&rsquo;s session. Thirty seconds, and it is anonymous.&rdquo;',
  'Ask for one specific thing rather than a rating: &ldquo;tell me the one minute of today that '
  'was too fast.&rdquo;'],
  ['Twenty seconds. Do not read the form out.',
   'Say it before they stand up, not after.'],
  'Nothing to watch. If nobody fills it in, ask two students at the door instead.'))
G.append(g(32, W('Closing', 1, 32), 'Thank you', [
  'Last card, and one sentence: &ldquo;in a later session, the for loop &mdash; the same parts, '
  'written in one line.&rdquo;',
  'Then let them go.'],
  ['Ten seconds. Do not start a new idea on this card.'],
  'Nothing. Watch the door instead.'))

'''

s = s[:start] + NEW + s[end:]
io.open(p, 'w', encoding='utf-8').write(s)
print('part 3 applied')
