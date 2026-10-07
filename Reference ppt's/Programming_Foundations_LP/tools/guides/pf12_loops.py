# -*- coding: utf-8 -*-
META = {
    "title": "Loops",
    "duration": "75 minutes",
    "subtitle": "Session 12 &middot; Loops &middot; 75 min",
    "out": r"C:\Lesson Plans New\Plans\Programming Foundations\12 - Loops\12_loops_instructor_guide.html",
}

ITEMS = [
{"kind": "concept", "title": "How to run this session", "html": """
<p>This guide gives you the shape of each beat and the few lines that are worth saying close to as written. Everything else is yours. If you have a better machine than the xerox shop, use yours. The centre of this session is the build card where the room gives you the three parts of a while loop, so protect that time above everything else.</p>
<div class="box">
<h3>Five habits that carry the whole session</h3>
<ul>
<li><b>Ask before you tell.</b> Every new idea today has a question that reaches it. Ask that question first, take two or three answers, then say the thing.</li>
<li><b>Read the room out loud.</b> On every vote, go option by option and say roughly what you see. Silence is not agreement.</li>
<li><b>Keep asking.</b> Aim for a question every two minutes, even small ones. Which part is that line? How many times does it run? What changes next?</li>
<li><b>Nudge while they work.</b> Walk the rows during every task and keep talking: are you done? One minute to go. Let us see who finishes first. Show me your three parts.</li>
<li><b>Offer doubts often.</b> Any doubts here takes four seconds and saves ten minutes later.</li>
</ul>
</div>
<p>Three words go on the board today and stay there: <b>initialization</b>, <b>termination condition</b>, <b>updation</b>. Write each one as the room gives it to you, and point at them for the rest of the session.</p>
<p class="small">The worksheet is digital. Students open it on their own laptops at the agenda card, type into it, and it is submitted at the end. All three tasks are in that one file, so nothing is given out later.</p>
<p class="small">Four safe points are marked through the guide. Each one is a short check that tells you whether to move on or to go back. If a safe point fails, the beat after it will not land, so fix it there.</p>
"""},

{"kind": "quiz", "title": "Opening and recap", "nav": "Opening and recap", "band": "0 to 5", "html": """
<p>Welcome card while they settle. Laptops shut, and say so: you will tell them when to open them. Do not name the topic, they guess it after the hook.</p>
<p>Then the recap of session 11, nested conditions. One card says the word Recap, then the real retrieval: a program that should print nothing and prints Pass. Read it out by line number, say what it was meant to do, then give the task and stop talking. One line is to blame, decide which one.</p>
<p>Take the vote on fingers, all together on three, then go number by number and say roughly what you see. Do not count exactly. Then step the reveal: the wrong output, the guilty line, what it should have printed.</p>
<div class="say"><b>Close on the idea today needs:</b> "The indent decides which block a line belongs to. Line 5 is at the left edge, so it is outside both ifs."</div>
<p>Do not reteach nesting here. Three presses, three minutes, move.</p>
"""},

{"kind": "hook", "title": "Hook, forty copies at the xerox shop", "nav": "Hook, forty copies", "band": "5 to 11", "html": """
<p class="hookline">Laptops shut. Nobody types here.</p>
<p>Start from something all of them have done: the xerox shop outside the gate, one form handed over, forty copies asked for. Say what they already know so nobody has to correct you. He does not press the button forty times. He types 40, presses start once, and goes back to his phone.</p>
<div class="say"><b>Then the question that is actually interesting:</b> "But the machine only knows how to make one copy. So what is happening inside it, forty times over?" Take two or three answers, wrong ones included. Correct nobody.</div>
<p>Now step the picture. The column of forty jobs appears inside the machine. Let them look at it. One job, forty times over. Then ask what four hundred would have looked like, and wait for the groan.</p>
<p>Next the question changes: where else have you seen this? Nudge with anything on this campus that has a button on it, then take three or four answers. Make each one say both halves. ATM is half an answer. The ATM counts one note, again and again, until it reaches the amount, is the answer. Show one of ours only after theirs, and tie each to whichever student said something close.</p>
<p>Last press collapses the column onto one line. Say nothing while it moves, then: one instruction, written once, and forty copies still come out. Point at it and say plainly what it is without naming it. What it is called, and how to write one, is today.</p>
<div class="safe"><b>Safe point 1, does the idea exist yet.</b> Ask the room for one machine that repeats one job after a single press, and make them say both halves, the machine and the job. If you only get machine names, take the examples down to two and say the job for each yourself before you move on.</div>
<p class="cpnote"><span>Checkpoint 1</span> you should be at 11 minutes here</p>
"""},
{"cp": "Checkpoint 1 &middot; 11 min"},

{"kind": "concept", "title": "Name it, then the agenda", "nav": "Name it, agenda", "band": "11 to 13", "html": """
<p>The title card says one word, and it is the word half the room has already said. One line ties it to yesterday: yesterday we decided whether a line runs, today we decide how many times it runs.</p>
<p>Then the agenda, one press per stop, and the promise worth saying out loud: by the end you will have written one of these yourself. Send the worksheet link now and get it open on every laptop. Every task today is in that one file.</p>
"""},

{"kind": "concept", "title": "Every line runs once, and you can watch it", "nav": "Every line runs once", "band": "13 to 16", "html": """
<p>Ask it before you press anything: so far, when Python reaches a line, how many times does it run that line? Wait for once.</p>
<p>Then walk the little program one press per line, saying the line number and what it did, nothing more. On the repeat, point at the box and say the sentence the next task will charge them for: same two lines as before, written out again.</p>
<p>The last press puts up the question. Read it once, slowly, and do not answer it.</p>
<div class="say"><b>Hand over with this:</b> "Before I answer that, I want you to feel why we need it."</div>
"""},

{"kind": "hands", "title": "Worksheet task 1, ten numbers the long way", "nav": "Task 1, the long way", "band": "16 to 19", "html": """
<p class="tag">Worksheet task 1</p>
<p>Worksheet open, playground shut. Task 1 already has the three number program in it. Read the change once: same question, but now it asks for the next ten. They type the lines they would add, then the two numbers in the small table.</p>
<p>Press play on the timer, it does not start by itself. Two and a half minutes.</p>
<div class="act"><b>While they work:</b> walk the rows and keep talking. "Are you guys done? Come on, let us see who finishes first. One minute left, just the line count now."</div>
<p>Hands off keyboards, then take the line count by show of hands: fewer than fifteen, more than twenty. Then ask what a hundred numbers would cost. Twenty one lines is right, and two hundred and one for a hundred. Both are worth saying out loud. Do not show a solution, the next cards are the answer.</p>
"""},

{"kind": "concept", "title": "A loop, and the two kinds", "nav": "A loop, two kinds", "band": "19 to 23", "html": """
<p>Open from their own sheets: twenty one lines, and you all wrote the same two of them ten times. Now name it, pointing at the block that repeats. A loop lets us run one block of code several times.</p>
<p>Check with a question rather than a statement: how many different lines are in that block, and how many runs? If the room goes quiet, narrow it to point at the block that repeats.</p>
<p>Then ask how we write one in Python, and only then put up the two kinds. Today is while, start to finish. The for loop comes in a later session. Both do the same job, they are written differently.</p>
<p>Finish on the while shape. Read it in order: the word while, the condition, the colon, the indented block. Connect it to yesterday, same colon and same indent as an if, and then give the difference that matters: an if asks its condition once, this one asks it again every time round.</p>
<p class="cpnote"><span>Checkpoint 2</span> you should be at 23 minutes here</p>
"""},
{"cp": "Checkpoint 2 &middot; 23 min"},

{"kind": "concept", "title": "Build it, name it, count it", "nav": "Build the while loop", "band": "23 to 31", "html": """
<p>This is the centre of the session. Seven presses, and the room supplies most of it. The skeleton goes up first: the input line, the two lines from their own sheet, and a while line with a gap where the condition should be.</p>
<ul>
<li><b>Initialization.</b> Ask before you press: if I want this to happen exactly three times, what do I need first? Take a count from the room, then press. Push it: does that line run once even if the loop goes round a hundred times? Yes. Write the word on the board.</li>
<li><b>Updation.</b> Ask first: the counter is sitting at zero, who is going to change it? Then ask the question that matters, is that line inside the loop or outside, and how can you tell. Wait for the indent. Write the word.</li>
<li><b>The question.</b> A red dashed box and nothing else. Read it out, then stop talking for ten seconds. Take answers from three different parts of the room before you say whether any of them is right.</li>
<li><b>Termination condition.</b> The answer lands in the gap. Check it against their answers, not against the screen. Then ask how many times the question gets asked. Most of the room says three.</li>
</ul>
<div class="say"><b>Let them be wrong, then count it together on the board:</b> 0 less than 3 yes, 1 less than 3 yes, 2 less than 3 yes, 3 less than 3 no. Four. "Three yeses and one no. The no is how it stops."</div>
<p>Last two presses run the block three times and then run the whole thing. Input 5 gives 6, 7, 8, End. Close on it: four parts, three of them you write yourself, and the fourth is the work you actually wanted done.</p>
<p>Then strip the example away and show the shape with the names on it. This is the diagram they will redraw in an exam.</p>
<div class="safe"><b>Safe point 2, which one is outside.</b> Ask: of the four parts, which one sits outside the loop? You want initialization. Anyone pointing at updation has confused the indent, and it has to be fixed here, not later.</div>
<p class="cpnote"><span>Checkpoint 3</span> you should be at 31 minutes here</p>
"""},
{"cp": "Checkpoint 3 &middot; 31 min"},

{"kind": "hands", "title": "Worksheet task 2, which part is this line", "nav": "Task 2, name the part", "band": "31 to 35", "html": """
<p class="tag">Worksheet task 2</p>
<p>Two programs they have not seen. Six lines, and against each one they type I, T or U. Say the words in full, not the letters only. Do the first line of program A together so nobody is guessing at the task, then press play. Two and a half minutes.</p>
<div class="act"><b>Nudge, then check:</b> "Any doubts about the task? Ask now. One minute, and the question underneath." Hands off keyboards first, and only then give the check: every loop has exactly one of each, so if you have typed the same letter three times, look again.</div>
<p>Take the reveal line by line. Ask for hands on I, T and U, then drop the line into the bin the room voted for, not into the right one. A bin that bounces is the point of the panel. Program B is where it gets interesting: both of its wrong answers are real beliefs, that initialization always sets zero and that updation always adds one.</p>
<p>The answers, for you: I, T, U on lines 2, 3 and 6 of program A, and I, T, U on lines 2, 3 and 5 of program B. Line 4 of program A runs five times, because the counter starts at 1 and the test is less than or equal to 5.</p>
"""},

{"kind": "hook", "title": "Follow the dot", "nav": "Follow the dot", "band": "35 to 38", "html": """
<p>Open from the lines they just named: you found the three lines, now watch what Python does with them. The dot is Python.</p>
<div class="say"><b>Say this, it is not on the card:</b> "I am going to set the number, and before I press play I want you to tell the person next to you what this prints. All of it."</div>
<p>Ten seconds of talking, then quiet, then play. Narrate one step per sentence and ask rather than tell: is 0 less than 2? Yes, so we go inside. Put your hand on the back edge when it jumps: look where it goes next, back up to the same question.</p>
<p>On the pass that fails, slow right down. Counter is 2, is 2 less than 2, no, so we come out at the bottom and print End. Then tie it to the build: count the times the dot touched that diamond. Three yeses and a no, four, the same number as before.</p>
<div class="safe"><b>Safe point 3, the count.</b> Drag the number to 0 and ask what prints before you play it. Most of the room will say 6. Let them be wrong out loud, then play it and watch the body stay grey. If the room cannot say why nothing ran, run it once more at 2 before the quiz.</div>
"""},

{"kind": "quiz", "title": "Classroom quiz on the portal", "nav": "Classroom quiz", "band": "38 to 44", "html": """
<p>Announce it plainly: open the learning portal, today's classroom quiz is live. Say the two things they need, how long they have and that it is individual. Do not read any question out and do not put one on the board.</p>
<p>Walk the room while they attempt it, and look at screens rather than at the clock. When it closes, take the two questions most of the room got wrong and give the correct reasoning for each in one sentence. Nothing longer.</p>
<p>Use the result to steer the second half. If the three parts have not landed, take the square pattern down to five minutes and spend the time on the reveals instead.</p>
"""},

{"kind": "hands", "title": "Type it, then break it", "nav": "Type it, break it", "band": "44 to 50", "html": """
<p>Laptops open. Type this exactly, do not copy mine. Run it with 5, then 1, then 100. Three minutes. Walk the rows. Most errors will be the indent or the colon, so say that out loud once and nobody feels singled out.</p>
<p>Then break it, and frame it as your own mistake: I think I have left a line out by accident, delete the updation line and run it again with 5. Do not warn them. Let them react, somebody will shout, and only then ask what it is waiting for. The counter is still zero, so the answer to the question never changes. Show them the stop button once.</p>
<p>Second change on the same card: put the line back, then move it above the print. Take the difference from the room. Same three numbers, so what changed? Order inside the body changes what prints, not how many passes.</p>
"""},

{"kind": "hands", "title": "Worksheet task 3, find the mistake", "nav": "Task 3, find the mistake", "band": "50 to 54", "html": """
<p class="tag">Worksheet task 3</p>
<p>Open from what they just did: you broke updation on purpose, here are three programs somebody broke by accident. Three programs, one thing wrong in each. They type which line is wrong, or what is missing and where it should go, then which part it is, then what happens when you run it.</p>
<p>Press play. Three minutes, worksheet tab only, and say why: running them answers the question for free, and program 2 will freeze a tab.</p>
<div class="act"><b>While they work:</b> "Which part is that? Say the word. Program 3 is the sneaky one, count the yeses."</div>
<p>Hands off keyboards at the end, and do not take answers here. The next four reveals are the answers, one at a time. For you: program 1 has no initialization, program 2 stores the answer of the condition in a box, and program 3 starts the counter at 1 so it runs twice instead of three times.</p>
"""},

{"kind": "activity", "title": "The four reveals", "nav": "The four reveals", "band": "54 to 58", "html": """
<p>One reveal per mistake, and hands before every one of them.</p>
<table>
<tr><th>Reveal</th><th>How to take it</th></tr>
<tr><td>Missing initialization</td><td>Ask who typed that a line is missing, then read the error text out exactly. Give them the rule they can use in an exam: if you see that error under a while loop, look above the loop, not inside it. Worth twenty seconds: it did not loop forever, it did not loop at all.</td></tr>
<tr><td>A condition stored in a box</td><td>The hard one. Read the line very slowly, then ask one question and stop talking: what gets stored, the question or the answer? Then name it, infinite loop, and connect it back to the deleted update line. Same ending, different cause.</td></tr>
<tr><td>Off by one</td><td>Ask the honest question first: how many of you marked this one correct? It will be most of the room. Walk the counter out loud, 1 yes, 2 yes, 3 no, two passes. Give both repairs and ask which they prefer. This is the one that costs marks in an exam, say so.</td></tr>
<tr><td>No updation</td><td>They already met it on their own laptops, so ask who made this happen twenty minutes ago. Close the set: you have now broken all three parts and seen what each costs, an error before it starts, the wrong number of passes, and a loop that never stops.</td></tr>
</table>
<div class="safe"><b>Safe point 4, three failures, not one.</b> Ask which line was wrong in the stored condition program and which line was wrong in the no updation program. If the room says they are the same mistake, walk both lines again before you move on.</div>
<p class="cpnote"><span>Checkpoint 4</span> you should be at 58 minutes here</p>
"""},
{"cp": "Checkpoint 4 &middot; 58 min"},

{"kind": "hands", "title": "The square pattern, they write it", "nav": "Square pattern", "band": "58 to 66", "html": """
<p>Read the question off the card, stars in N rows and N columns, and point at the output to say the thing that costs marks: there is a space after every star. Say that twice.</p>
<p>Give them the shortcut they already own by asking for it: which string operation gives you a star and a space, n times? Then ask which part repeats, the row or the star, and hold the answer. They decide it at the keyboard. Do not code this on screen.</p>
<p>Before anybody types, take one answer out loud: n is 3, how many times does the print line have to run? Three. That is their termination condition and now they know it. Press play, four and a half minutes.</p>
<div class="act"><b>Walk the rows continuously:</b> "Are you guys done? Show me your three parts. Run it with 5." For anyone stuck, ask the three words instead of giving code: where is your initialization? In the last ninety seconds everybody runs it with 3, then 5, then 1.</div>
<p>The solution goes up only after the timer has run out. Read it against their three words, then ask for hands: who got the same three parts, even with different names? The common bug is a hard coded 3 instead of n, which passes the first test and fails the second.</p>
<p class="cpnote floor"><span>Hard floor</span> 66 minutes. The exit runs whatever else is dropped</p>
"""},
{"cp": "Hard floor &middot; 66 min", "floor": 1},

{"kind": "exit", "title": "Exit question", "nav": "Exit question", "band": "66 to 70", "html": """
<p>Frame it as a real thing: a name board app prints one letter per line, and somebody types a single letter. Read the code once by line number, then stop talking and press play. Two and a half minutes, silent.</p>
<p>Vote by hands, option by option, and say roughly what you see for each. Then reveal and walk it: the length is 1, so the question is 0 less than 0, which is False the first time, and the body never runs.</p>
<p>Name each wrong option out loud, because each one is a belief: a loop must run at least once, I saw an index and expected an index error, I saw a while and expected forever. Then tie it to the morning: the first thing today was a program that should print nothing, this is the same idea with a harder question.</p>
<p class="small">A big vote for the first option is the finding worth carrying into the next session. They still believe a loop body always runs once.</p>
"""},

{"kind": "concept", "title": "Takeaways and close", "nav": "Takeaways and close", "band": "70 to 75", "html": """
<p>Do not read the map out, ask for it. The word loops, then how many kinds, then the block diagram one band at a time: what goes above the loop, what goes on the while line, what goes at the bottom of the body. Point at the arrow back up and say that is the bit that surprised you, it asks again.</p>
<p>The last press is three different endings, not one. Take them one at a time. Leave out the initialization and it stops with an error. Get the condition wrong and you get the wrong count. Leave out the updation and it never stops.</p>
<p>Then the feedback card while they pack, and ask for one specific thing rather than a rating: tell me the one minute of today that was too fast. Last card, one sentence about the for loop in a later session, and let them go.</p>
"""},

{"kind": "concept", "title": "If you are running late", "nav": "If you are running late", "html": """
<p>Cut in this order. Each of these can go without breaking what comes after it.</p>
<ol>
<li><b>The square pattern</b> can drop to five minutes with one run at 3 only.</li>
<li><b>The fourth reveal</b> can be said in one sentence without putting the card up. They already broke that one themselves.</li>
<li><b>Follow the dot</b> can run once at 2 and once at 0 with no narration in between.</li>
<li><b>Worksheet task 3</b> can go to two minutes with a word from you that program 3 is the one to look at twice.</li>
</ol>
<p>Do not cut the build card or the exit question. The build is where the three parts come from the room instead of from you, and the exit is the hard floor, the one beat that runs whatever else is dropped.</p>
"""},
]
