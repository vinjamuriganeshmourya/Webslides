# -*- coding: utf-8 -*-
META = {
    "title": "For Loop",
    "duration": "75 minutes",
    "subtitle": "Session 14 &middot; For Loop &middot; 75 min",
    "out": r"C:\Lesson Plans New\Plans\Programming Foundations\14 - For Loop\14_for_loop_instructor_guide.html",
}

ITEMS = [
{"kind": "concept", "title": "How to run this session", "html": """
<p>This guide gives you the shape of each beat and the few lines that are worth saying close to as written. Everything else is yours. If you have a better app than Spotify for the hook, use yours, as long as the list in it can grow. The session has one spine: a while loop needs three lines of bookkeeping, a for loop needs none, and a sequence that is empty means the body never runs.</p>
<div class="box">
<h3>Five habits that carry the whole session</h3>
<ul>
<li><b>Ask before you tell.</b> Every card today has a question that reaches it. Ask that question first, take two or three answers, then show the card.</li>
<li><b>Write first, run second.</b> Say it at every task. A number written down before the run is a prediction. The same number typed after the run is a transcript.</li>
<li><b>Count every option.</b> On every vote, read option A and count hands, then B, then C, then D, before anything is revealed. Then explain every option, not only the right one.</li>
<li><b>Nudge while they work.</b> Walk the rows during every task and keep talking: are you done? One minute to go. Let us see who finishes first.</li>
<li><b>Call a group, never a name.</b> Back three rows, what did you get? Rotate which part of the room you ask.</li>
</ul>
</div>
<p class="small">The worksheet is digital and holds all three tasks. Riya's savings, the coding challenge, is in the deck only. It opens at task 1 and stays open beside the playground. Laptops stay shut until then.</p>
<p class="small">Four safe points are marked through the guide. Each one is a short check that tells you whether to move on or to go back. If a safe point fails, the beat after it will not land, so fix it there.</p>
"""},

{"kind": "quiz", "title": "Opening and recap", "nav": "Opening and recap", "band": "0 to 5", "html": """
<p>Let the room settle, say laptops shut once, and it holds until task 1. One line on today: we already know one kind of loop, today we meet the other one, and it is the shorter one.</p>
<p>The recap is a matching card. Three parts of a while loop on the left, three jobs on the right, in a different order. Read the six out loud, then ask which two belong together and take it as a call out, not as hands. Join one pair at a time and read the why line each time, because the why line is doing the teaching, not the join.</p>
<p>Slow down on the condition pair and say the count out loud: the question is asked four times, not three, because it is asked once more at the end when the answer is finally no.</p>
<div class="say"><b>Hand off with this:</b> "Hold on to those three. Today, two of them disappear."</div>
<p class="small">Most rooms pair the condition with the starting value. That is the confusion today clears up, so let it be said before you join the right two.</p>
"""},

{"kind": "hook", "title": "Hook, one tap and it keeps going", "nav": "Hook, one tap", "band": "5 to 11", "html": """
<p class="hookline">Laptops shut. Nobody types here.</p>
<p>Start from what they have. Everyone walked in with this app open. A playlist of five songs, one tap on the green button, and the first song starts. That is all you did, one tap.</p>
<p>Let the songs run on. Song one ends, song two starts, then song three. Then ask, before the last step, who told it to play the next song. Take two answers and correct nobody.</p>
<p>Now the step that matters. The highlight reaches the last song and the bar says the list ended.</p>
<div class="say"><b>Ask, then wait:</b> "Nowhere on this screen does it say five. So what told it to stop?" The answer you want is that the list ran out.</div>
<p>Add a sixth song and it plays six. You changed nothing else and you never typed a number anywhere. Then the question lands: where else does one tap keep going by itself until a list runs out? Do not answer it.</p>
<p>The next card is where their answers go. Three empty slots, each with its machine drawn pale inside. Take four answers out loud and say which slot each one belongs in. Only then show ours: the attendance register, Instagram stories, the billing counter. Then strip it all away and leave the shape on screen, and read it in this order: take a list, do one job, once for each item.</p>
<div class="safe"><b>Safe point 1, why it stopped.</b> Ask the room why the music stopped. You want because the list ran out, not because it counted to five. If you hear a count, add the sixth song again and ask who told it about that one.</div>
"""},

{"kind": "concept", "title": "Name it, then the plan", "nav": "Name it, the plan", "band": "11 to 14", "html": """
<p>The room has just guessed, so now name it. This is a for loop, and it walks a sequence one item at a time. Ten seconds.</p>
<p>Then the plan, one stop per press: the for loop, then range which makes a sequence out of numbers, then the star pattern they write themselves. The fourth press is the line the deck leaves off, the one mistake everybody makes. Say it as a promise, not a warning. Half the back of the session is about it.</p>
<p class="cpnote"><span>Checkpoint 1</span> you should be at 14 minutes here</p>
"""},
{"cp": "Checkpoint 1 &middot; 14 min"},

{"kind": "concept", "title": "Last session's code, and the three characters that broke it", "nav": "The mistake in the code", "band": "14 to 18", "html": """
<p>This is last session's code, not today's. Set it up: we wanted this to print Python, one letter on each line. Read the expected output, then the actual output, and ask what is missing. The last letter.</p>
<p>Ask where the mistake is, give it thirty seconds, and take hands. Point at whichever line they name without confirming it. Most rooms go for the print line first, because that is where the output comes from. The mistake is one line above it.</p>
<p>Then the answer: a minus one that should not be there. Say the size of it out loud. Three characters. The job was never wrong, the bookkeeping was.</p>
<p>Now label the same program with the three parts from the recap and count the lines out loud. Five lines, one of them prints, four are bookkeeping, and the bookkeeping is where the mistake was.</p>
<div class="say"><b>Ask the question the whole session answers:</b> "Can we simplify this?" Take two answers. Do not correct anyone, and do not answer it on this card.</div>
"""},

{"kind": "concept", "title": "The for loop, and what it drops", "nav": "What the for loop drops", "band": "18 to 22", "html": """
<p>Name the three parts of the line: the word <code>for</code>, a name you choose, and a sequence. Say the two kinds of sequence, characters of a string and numbers, and that the second half of today is the second kind.</p>
<p>Then the same job as the five line program, written with a for loop, and count the lines out loud: two. It was five. Point at what is gone, no counter, no length, no index, no plus one.</p>
<div class="say"><b>Ask:</b> "Where does that name get its value from?" The answer you want is that the loop puts it there, once per pass. The common wrong answer is that it is a built in name, so say plainly that the name is theirs to choose.</div>
<p>Finish by reading the three struck lines: initialization, termination condition, updation, all three gone. Tie it back to the recap they did at the start.</p>
"""},

{"kind": "hook", "title": "Explainer, one character at a time", "nav": "One character at a time", "band": "22 to 25", "html": """
<p>The word is on screen whole, as one thing. Ask before you press anything: is that one thing or six? Take hands for one, then for six. Then split it, and say the word once, slowly, a sequence.</p>
<p>Ask how many lines this will print and take a number from the room before anything runs. Then step it, and point at the box the loop takes as it vanishes each pass. Run it again on a two letter word: two characters, two passes.</p>
<p>Now the one that matters. Pick the empty word and ask what it prints before you play it. Most rooms say an error. Play it, and the body stays grey while the line after the loop still runs.</p>
<div class="safe"><b>Safe point 2, empty is not an error.</b> Ask one student to say what happened with the empty word. You want no error, nothing printed by the loop, and the program carried on. If the room is unsure, run it once more before the worksheet, because this is the finding the exit question tests.</div>
<p class="cpnote"><span>Checkpoint 2</span> you should be at 25 minutes here</p>
"""},
{"cp": "Checkpoint 2 &middot; 25 min"},

{"kind": "hands", "title": "Worksheet task 1, trace it then check it", "nav": "Task 1, trace it", "band": "25 to 31", "html": """
<p class="tag">Worksheet task 1</p>
<p>Worksheet open, playground shut. Read the three columns out loud so nobody is guessing at the task. Start the timer, five minutes, and walk the room. Do not answer, just look at what people have written.</p>
<div class="act"><b>While they work:</b> "Are you guys done? One minute left. Fill a row only for a pass that actually happens." Hands off keyboards before anything else happens.</div>
<p>Then walk the answer, one operation per press, with the code still on screen so they can check their own rows. Slow down on the press where the loop asks for a third item and there is none. That is where the program ends, and it is the row most people wrote something in.</p>
<p>Say the check only at the end: you should have used two rows, not three. Three filled rows is the misconception of the whole session and it is worth thirty extra seconds.</p>
"""},

{"kind": "hands", "title": "Worksheet task 2, type it and change the sequence", "nav": "Task 2, type it", "band": "31 to 36", "html": """
<p class="tag">Worksheet task 2</p>
<p>Playground open now, worksheet beside it, nothing else. Three steps, one card each, and say write first, run second at every one of them. Each card has its own short timer.</p>
<ol>
<li>Type it exactly and run it. Four letters, four lines, then Done.</li>
<li>Change the word to Delhi. They write the number of lines first, then run. Six: D, e, l, h, i, then Done. Most write five and forget Done.</li>
<li>Change the word to two quote marks with nothing between them. They write what it will print first, then run. Only Done, and no error.</li>
</ol>
<p>Take a show of hands on step 3 before anyone runs it: who thinks it errors? Then let them run it. Anyone who types the whole word instead of the loop name gets it on one line, which is a good mistake. Ask them which one the loop changes every pass.</p>
"""},

{"kind": "quiz", "title": "Classroom quiz on the portal", "nav": "Classroom quiz", "band": "36 to 40", "html": """
<p>Laptops on the portal. The questions are there, not on the card. Say the rule once: own answer, no talking, no tab switching. Four minutes, and watch the live spread rather than teaching from it.</p>
<p>Note the two weakest questions and reopen them at the takeaways. If more than half miss the empty sequence question, run the explainer again with the empty word instead of explaining it.</p>
"""},

{"kind": "concept", "title": "Where numbers come from, and the range dial", "nav": "range, and the dial", "band": "40 to 48", "html": """
<p>Open with the question and stop there: we need a sequence of numbers, where does one come from? Take two answers. Somebody will say type them out, so take it and ask what they would do for a thousand. Only then name range.</p>
<p>Say the rule in one breath: it starts at 0, and it stops before the number you give it. Ask how many numbers <code>range(5)</code> gives, and which ones, before you show anything. Half the room will say 1 2 3 4 5. Let that be said before the slide answers it, then say the two surprises separately: it starts at 0, and the number you wrote is not in the list.</p>
<p>Then the dial, which is the beat that earns the minutes. Ask both questions every time, which numbers come out and how many, before you press. Change the stop and ask again, so they predict every time and not only the first.</p>
<div class="safe"><b>Safe point 3, the equal case.</b> Set start and stop to the same number and ask what comes out before you press. You want nothing, and a loop over nothing does not run. Tie it back to the empty word out loud. If the room cannot connect the two, that is the exit question walking away from you.</div>
<p class="cpnote"><span>Checkpoint 3</span> you should be at 48 minutes here</p>
"""},
{"cp": "Checkpoint 3 &middot; 48 min"},

{"kind": "hands", "title": "Coding challenge, Riya's savings", "nav": "Riya's savings", "band": "48 to 55", "html": """
<p class="tag">Coding challenge, not on the worksheet</p>
<p class="hookline">A story first, then the loop does the adding.</p>
<p>The story card has Riya, her piggy bank, and a calendar of seven days. One speech bubble per press. Riya saves only on odd days, and on day d she puts in d rupees. Day 1 drops a coin of 1 rupee, day 2 is a skip and the piggy looks sad, day 3 drops 3. The rule stays at the bottom of the card the whole time.</p>
<div class="say"><b>Ask before the fifth press:</b> "How much will she have after 7 days?" Let them add it in their heads: 16. Then press, and let Riya ask about 30 days, or a whole year. Nobody wants to add that by hand, and that is why the loop exists.</div>
<p>Then the problem card. Read it out loud: read n, print the total from day 1 to day n, both days included. Point at the two samples, 7 gives 16 and 4 gives 4. Playground open, four minutes on the timer, walk the rows. Press once for the hint only if the room is stuck at two minutes: <code>day % 2 == 1</code> is True only on odd days.</p>
<div class="act"><b>While they work:</b> "Are you done? Run it with 7. Do you get 16? Now run it with 10." When time is up, ask the room for the answer with 10. You want 25.</div>
<p>Then the answer, one day per press with n = 7. On an odd day total changes, the old value stays on screen struck through, and a coin drops into the piggy. On an even day the if is False and line 5 greys out. Say it every even day: the loop still visits the day, the if skips it. Press 9, no days left, the loop ends. Press 10, it prints 16.</p>
<p class="small">Anyone who gets 9 for input 7 wrote <code>range(1, n)</code>, so day 7 is missing. Ask which days their loop visits. A total printed inside the loop gives a list of running totals, not one number, so ask which line should run only once. <code>range(1, n + 1, 2)</code> is correct if a student already knows it.</p>
<p class="cpnote"><span>Checkpoint 4</span> you should be at 55 minutes here</p>
"""},
{"cp": "Checkpoint 4 &middot; 55 min"},

{"kind": "hands", "title": "The pattern question, and worksheet task 3", "nav": "Task 3, the loop line", "band": "55 to 61", "html": """
<p class="tag">Worksheet task 3</p>
<p>Read the question and the sample output, nothing else. Ask how many rows for an input of four, and how many stars on the last row. Say the shape of the answer without giving it: one row per pass, and the number of stars changes every pass. Note the space after every star, it is in the question and in the output.</p>
<p>Then task 3. This time the loop draws something instead of adding. Only the first line is given, the loop line and the blank are theirs. Say the constraint out loud: the two blanks have to agree with each other. Four minutes on the timer, and walk the rows.</p>
<div class="act"><b>Nudge, then collect:</b> "Are you done? What changes from one row to the next?" Hands off keyboards, then take two different answers from two different parts of the room and put both on the board.</div>
<p>Both <code>range(1, n + 1)</code> with the counter, and <code>range(n)</code> with the counter plus one, are correct. Say so plainly and do not rank them. A pair that does not agree gives a blank first row, so ask that group to run it.</p>
"""},

{"kind": "activity", "title": "The vote, and where range stops", "nav": "The vote on range", "band": "61 to 68", "html": """
<p>Show one of the answers the room just wrote and point at the plus one. Ask why it is there: range starts at 0, and a row of zero stars is not a row. Then ask the question that sets up the vote: can we make range start at 1 instead and drop the plus one? Take two answers. Somebody will say <code>range(1, n)</code> straight away and be confident. Do not correct it, put it on the vote.</p>
<p>Two programs side by side, both starting at 1. Read both loop lines out loud, then count hands for A and hands for B and say both numbers. Do not hint. A wrong majority here is worth more than a right one.</p>
<p>Run them both. The rows land on each side, the counts arrive, and the empty dashed row appears on the left. Point at it and wait before you say the rule: range stops before the stop value, so <code>range(1, n)</code> never reaches n. Run it again at another n and show the gap is one row every time.</p>
<div class="safe"><b>Safe point 4, one row, every time.</b> Ask what value of n would make the two agree. There is none, and hearing the room work that out is the check. Then show the two correct versions side by side and ask which they would rather read. Neither is better, and saying so is the point.</div>
<p class="cpnote floor"><span>Hard floor</span> 68 minutes. The exit question runs whatever else is unfinished</p>
"""},
{"cp": "Hard floor &middot; 68 min", "floor": 1},

{"kind": "exit", "title": "Exit question, which one prints nothing", "nav": "Exit question", "band": "68 to 72", "html": """
<p>Read the program out loud, line by line. Everyone answers this one. Start the timer. When it ends, read option A and count hands, then B, then C, then D, and count every option before you move on.</p>
<p>The answer is on the next card, one operation per press: option B, then left is 1, then <code>range(1, 1)</code> has no numbers, then nothing is printed. Then say the other three out loud, not only the right one: A gives one line, C gives two, D gives three.</p>
<p class="small">A pair that prints one line looks like nothing to a student who is skimming. Make them say how many lines, not whether it printed. The spread on this question is what you open the next session with.</p>
"""},

{"kind": "concept", "title": "Takeaways and close", "nav": "Takeaways and close", "band": "72 to 75", "html": """
<p>Seven rows, one press each, and each row carries the word it belongs to. Say the word before the sentence every time, because that is how a student finds it again in their notes: for loop, string, range, the loop name, stop, how many, empty.</p>
<p>If the quiz showed a weak question, reopen it here against the row it belongs to. Then ask the room to say the difference between the stop row and the empty row in their own words. If they cannot, that is the line to open the next session with.</p>
<p>Then feedback, two minutes and anonymous, and say in one sentence what you will do with it. Last card, thank them and name one thing the room did well today.</p>
"""},

{"kind": "concept", "title": "If you are running late", "nav": "If you are running late", "html": """
<p>Cut in this order. Each of these can go without breaking what comes after it.</p>
<ol>
<li><b>The plan</b> drops to two presses.</li>
<li><b>The <code>range(5)</code> card</b> goes out entirely. The dial says the same thing and says it better.</li>
<li><b>The two range versions at the end</b> drop to one press each.</li>
<li><b>Riya's answer walk</b> drops to days 1 to 3, then the last two presses.</li>
<li><b>Task 2, step 2</b>, the Delhi change, can go. Typing it once and emptying it are the parts that cannot.</li>
<li><b>The takeaways</b> drop to three rows: the for loop, stops before, and an empty sequence.</li>
</ol>
<p>Never cut worksheet task 1 with its walk, the explainer with the empty word, Riya's savings, the vote, or the exit question. Those five are the session.</p>
<div class="box">
<h3>If they ask</h3>
<ul>
<li><b>Is the loop name a keyword?</b> No. You choose it.</li>
<li><b>Why does range start at 0?</b> Because positions in Python start at 0, which matches how you index a string.</li>
<li><b>Can I use a while loop instead?</b> Yes, always. Use a for loop when you already have a sequence, and while when you do not.</li>
<li><b>Does a range whose start equals its stop give an error?</b> No, it gives an empty sequence, and a loop over it does not run.</li>
<li><b>Is one of the two correct pattern versions better?</b> No. Pick the one you can read.</li>
</ul>
</div>
"""},
]
