# -*- coding: utf-8 -*-
META = {
    "title": "String Methods",
    "duration": "75 minutes",
    "subtitle": "Session 15 &middot; String Methods &middot; 75 min",
    "out": r"C:\Lesson Plans New\Plans\Programming Foundations\15 - String Methods\15_string_methods_instructor_guide.html",
}

ITEMS = [
{"kind": "concept", "title": "How to run this session", "html": """
<p>This guide gives you the shape of each beat and the few lines that are worth saying close to as written. Everything else is yours. The session is in two halves with the quiz as the join. Everything before it is slicing, everything after it is methods, and one rule runs through both: a slice stops before its last number, and strip works from the ends inwards.</p>
<div class="box">
<h3>Five habits that carry the whole session</h3>
<ul>
<li><b>Ask before you tell.</b> Every card puts a line on screen with an empty output box. Ask what it prints, take two answers, and only then run it.</li>
<li><b>Write first, run second.</b> Every task today is written down before anything is typed. A prediction after the run is not a prediction.</li>
<li><b>Count every option.</b> On every vote, count hands for A, then B, then C, then D before anything is revealed, then explain every option, not only the right one.</li>
<li><b>Nudge while they work.</b> Walk the rows and keep talking: are you done with row two? One minute left. Do not skip a row.</li>
<li><b>Take the word from the room.</b> If a student names the method before you do, use their words for the rest of the session.</li>
</ul>
</div>
<p class="small">The worksheet is digital and holds all four tasks. It opens at task 1 and stays beside the playground for the rest of the session. Laptops are shut until then.</p>
<p class="small">Four safe points are marked through the guide. Each one is a short check that tells you whether to move on or to go back. If a safe point fails, the beat after it will not land, so fix it there.</p>
"""},

{"kind": "quiz", "title": "Opening and recap", "nav": "Opening and recap", "band": "0 to 5", "html": """
<p>Let the room settle. One line on today: we already know how to take a piece out of a string, today we get much better at it and Python does most of the work. Say laptops shut once and it holds until task 1.</p>
<p>The recap is a sorting card on last session's range. Five numbers along the top, two bins under them. Read the five out loud, then take them one at a time: does this one come out, yes or no? Count the hands for yes, count them for no, then drop it.</p>
<p>The two to slow down on are the last number in and the number that is written but never reached. Read the reason out loud on both, then say the whole sequence once: the start is in, the stop is not.</p>
<div class="say"><b>Hand off with this:</b> "Hold on to that. Everything we do today stops one place early, in exactly the same way."</div>
<p class="small">The hands on the stop value are the read you want. If a third of the room says yes, slow down, because the same mistake costs them the exit question.</p>
"""},

{"kind": "hook", "title": "Hook, the message the search cannot find", "nav": "Hook, the search", "band": "5 to 9", "html": """
<p class="hookline">Laptops shut. Nobody types here.</p>
<p>Start from something every one of them has done: somebody in your group types with a space between every letter. Show the chat and ask what the message says. The room reads it in about a second.</p>
<p>Then open the search bar with that same word typed in it, and the chat says no messages found. Wait. Let them see that the letters are right there on the screen.</p>
<div class="say"><b>Ask, then take two or three answers without correcting anyone:</b> "The letters are right there. So why can it not find it?"</div>
<p>The boxes on the right are the answer: nine boxes, not five, and four of them are spaces. A space is a character like any other. Ask which boxes the letters are in and wait for the even numbers.</p>
<p>Then show the run of five boxes side by side, which is the only shape they have ever asked for, and it drags the spaces along. Ask what would have to change, take two answers, and only then stretch the marks out so they land on every second box and the word appears.</p>
<div class="safe"><b>Safe point 1, a space is a character.</b> Ask why the search failed. You want because the spaces are characters in the middle of the word, not because the phone is slow or the spelling is wrong. If you hear anything else, step the boxes again before you go on.</div>
<p class="small">Do not use the words slice or step here. The room names the topic on the next card.</p>
"""},

{"kind": "concept", "title": "Name it, then the plan", "nav": "Name it, the plan", "band": "9 to 11", "html": """
<p>Now the card names it: string methods. Tie it back, the jump they just saw has a name and so does every other job we will do to a string today.</p>
<p>Then the plan, one stop per press with one sentence each. Slicing, taking a part of a string. Methods, jobs Python already knows. Where it stops, a slice stops before its last number, which is the same rule as the recap. Say plainly that the third one is the one that costs marks.</p>
<p class="cpnote"><span>Checkpoint 1</span> you should be at 11 minutes here</p>
"""},
{"cp": "Checkpoint 1 &middot; 11 min"},

{"kind": "concept", "title": "From one character to four", "nav": "One character to four", "band": "11 to 14", "html": """
<p>Open from the hook: we counted boxes a minute ago, same boxes here, and now we ask for what is in them. Read the index numbers out loud with the room and do not go on until they have.</p>
<p>Ask what a single index gives before you show it, then ask for one more of the same shape without pressing anything. Then the real question, which is this card: I want that name out of the string, how do I do it? Take answers. Somebody will offer four numbers, somebody will guess the colon.</p>
<p>Frame the four boxes, ask the room for their numbers, and only then write the slice under the string. Read it left to right, then say the rule out loud: the second number is written down and never touched. Same rule as the recap.</p>
<p>Last press copies the characters out. Say what the picture is doing: copied, not moved. The original string still holds everything it held before.</p>
"""},

{"kind": "concept", "title": "The one it cannot cut, and the step", "nav": "The step", "band": "14 to 20", "html": """
<p>Show the string where the letters are not next to each other and say it is the same problem as the hook, with hyphens instead of spaces. Ask whether they can get the name out with what they have. Somebody will try a plain slice, so take it and say what it would give: every character in between, hyphens and all.</p>
<p>Then name the three numbers, once, here, and nowhere else: start, end and step. Give the step one sentence, how far it jumps each time, and work the sums out loud with the room.</p>
<p>The walk card is not a reveal, it is a walk. The line is on screen from the start and the room says the sum before every press. Add the step to the last landing, not to the stop. On the last landing say the stop out loud, the next jump would go past it, so it ends there. The last press dashes every box it never landed on: it never looked at the hyphens at all.</p>
<p class="small">The mistake to listen for is adding the step to the stop. If you hear it, go back one press and do the sum again.</p>
"""},

{"kind": "hands", "title": "Worksheet task 1, then the slice machine", "nav": "Task 1, slice machine", "band": "20 to 25", "html": """
<p class="tag">Worksheet task 1</p>
<p>This is the first time the laptops open today. Worksheet tab open, playground shut. Read the three slices off the machine out loud and give them ninety seconds to write all three answers down before anything runs.</p>
<p>Then run the machine one level at a time. Count hands for each option, tap the one the room chose, and run it. The run stays locked until something is picked, and that lock is the activity. Read the verdict out loud every time, including on a level the room got right, and say what each wrong option would have meant.</p>
<div class="act"><b>The level to stop on:</b> the one where the start is after the stop. Ask what comes out before you run it and let the silence sit for three seconds. Nothing comes out at all.</div>
<div class="safe"><b>Safe point 2, empty is not an error.</b> Ask what Python did on that level. You want an empty string and a blank line, not an error. If the room expects an error, that belief comes back in the exit question, so fix it here.</div>
"""},

{"kind": "hands", "title": "Worksheet task 2, type it and change the step", "nav": "Task 2, change the step", "band": "25 to 29", "html": """
<p class="tag">Worksheet task 2</p>
<p>Worksheet tab and the playground only. Three steps, and you start the timer.</p>
<ol>
<li>Type the two lines and run them. Ninety seconds.</li>
<li>Frame it as a want, not a test: I want the letters, not the digits. One number changes. They write what it will print first, then run.</li>
<li>Frame it as your own idea: I thought a negative step would read it backwards. Try it and tell me what happens. Do not warn them.</li>
</ol>
<p>Let them react to step 3 before you say anything. No error, nothing printed, a blank line. Then the line that makes it stick: Python did exactly what you asked, starting there and going backwards it never reaches the stop, so it lands nowhere.</p>
<p class="cpnote"><span>Checkpoint 2</span> you should be at 29 minutes here</p>
"""},
{"cp": "Checkpoint 2 &middot; 29 min"},

{"kind": "quiz", "title": "Classroom quiz on the portal", "nav": "Classroom quiz", "band": "29 to 34", "html": """
<p>Open the portal, five minutes, own answer. Walk the room while they work and do not answer questions about the quiz itself. Anyone who finishes early goes back to task 2 and tries a different step on the same string.</p>
<p>Say one line about the weakest question and move on. Do not teach from the spread here. The read you want is the slicing question, because nothing after this card has been taught yet. If slicing looked weak, cut the replace beat later, never the strip work.</p>
"""},

{"kind": "concept", "title": "Why a string method at all", "nav": "Why a method at all", "band": "34 to 39", "html": """
<p>This card is the reason the second half exists, so do not hurry it. Every card after this one is cheap because this one was not.</p>
<p>Open it as something they have all done: you set a PIN on your phone, four digits, and before the app saves it, it has to be sure of two things. The length is easy, so ask how they would check that every character is a digit. Take answers and write nothing down.</p>
<p>Then show the refusal, one letter among the digits, red box, under a second. Ask what it actually did. Somebody will say check each one, which is exactly right, and then show the long way.</p>
<div class="act"><b>Read the long line out loud and stop halfway.</b> The room will laugh, and that laugh is the card working. Then show the count, forty comparisons for four characters and nine lines of program, and ask whether every app on their phone wrote this.</div>
<p>Only then the two line version, and only then the name: a string method is a job Python already knows how to do on a string. You write the string, a dot, and the name of the job. There are five of them today, and that was the first.</p>
"""},

{"kind": "concept", "title": "isdigit, the first method", "nav": "isdigit", "band": "39 to 42", "html": """
<p>Open straight off the card before it. The line is on screen with an empty output box. Ask what it prints, wait, and take two answers before you run it. Somebody will say a number, somebody will say True.</p>
<p>Run it, and every character is ticked in turn. Say it looked at every single one, not most of them. Then the shape and the sentence, and have somebody in the room say it back in their own words. This is the only place the definition appears in the session.</p>
<p>Last, the same line with a letter in the string, and ask what it prints before you show it.</p>
<p class="small">Listen for a student saying it checks if it is a number. Ask about a space, or a minus sign. Neither is a digit.</p>
<p class="cpnote"><span>Checkpoint 3</span> you should be at 42 minutes here</p>
"""},
{"cp": "Checkpoint 3 &middot; 42 min"},

{"kind": "hook", "title": "strip, and where it stops", "nav": "strip", "band": "42 to 51", "html": """
<p>Start from something they have all hit: you paste your phone number into a form and it says it does not match. Read both lines slowly, one with spaces at the ends and one without, then ask whether the two are the same. Count hands for same, then for not the same. Most rooms say same, and that wrong answer is the whole card.</p>
<p>Then the output, False, and one sentence tying it to the hook: a space is a character, so twelve characters is not ten characters.</p>
<p>Now the method. Ask how many characters come out before you press, take a number from the room, then run it and count together. Then say the thing that matters: it did not change the original string, it handed back a new one.</p>
<div class="say"><b>Say this, and say it this way:</b> "It works in from each end." Never "it removes spaces." The next beat turns on that difference.</div>
<p>Then the explainer, one step at a time, never play. Stop on both green stop marks and say it out loud both times: it stopped, it is not going to look any further in. Then the character in the middle goes dashed and says never. That mark is the finding of the second half.</p>
<p>Close the run of cards with the two short ones: the full stop in the middle that stays, and the brackets that hold a set of characters rather than a word. Ask whether that is one thing to remove or three, and whether the order inside the brackets matters. It does not.</p>
<div class="safe"><b>Safe point 3, the ends, always the ends.</b> Ask what would happen to a space in the middle of the string. You want it stays, because strip never reaches it. A room that says strip removes every space will get the exit question wrong.</div>
"""},

{"kind": "hands", "title": "Worksheet task 3, trace it before you run it", "nav": "Task 3, trace it", "band": "51 to 55", "html": """
<p class="tag">Worksheet task 3</p>
<p>Open from the walk: you just watched it stop twice, now do one yourself. Worksheet tab open, playground shut. Read the program aloud once, line by line, without saying what any line does. Say the rule for the table: one row per line, and fill a row only if that line actually runs.</p>
<p>Four minutes on the timer, and walk the rows.</p>
<div class="act"><b>Check in while they work:</b> "Line 2 first, what comes off? Do not skip a row. One minute left." Hands off keyboards, wait for it, and only then say the check: exactly two of your seven rows should be empty.</div>
<p>Then walk the answer one operation per press, about five seconds each, and slow down on the line where the right end meets a character that is not in the set and stops. A student who filled all seven rows traced what they thought the program meant, not what it did.</p>
<p class="cpnote"><span>Checkpoint 4</span> you should be at 55 minutes here</p>
"""},
{"cp": "Checkpoint 4 &middot; 55 min"},

{"kind": "concept", "title": "replace, one of them or both", "nav": "replace", "band": "55 to 58", "html": """
<p>One line of setup and move: the same typo, forty times, in something you have already written, and nobody is fixing that by hand. Take one answer to what they would want to say to Python, then show the method.</p>
<p>The whole card is one question. The word appears twice in the sentence, so does it fix one of them or both? Take a show of hands on each and do not say which is right, then run it. Both of them, and it goes all the way to the end of the line.</p>
<p>Point at the words that did not move, which is the half of the claim nobody states, and say every one of them rather than all of them. Then the shape, with two things in the brackets now, the one to look for and the one to put there.</p>
<p class="small">If a student thinks the original line changed, ask what printing it on the next line would show. It would show the original.</p>
"""},

{"kind": "hands", "title": "startswith, and you write endswith", "nav": "startswith, endswith", "band": "58 to 63", "html": """
<p class="tag">Worksheet task 4</p>
<p>Open from something on their screen right now: look at the browser, there is a padlock or there is a warning, and something checked that address. Put the line up with an empty output box and ask them to look at what it prints, not at the address. Is it a string, or is it a yes and no?</p>
<p>Run it: the front of the address lights up and it prints True. It read the first few characters and stopped, it never looked at the rest. Then make the pair out loud, because the exit question needs it: strip and replace hand you a string, isdigit and this one answer a question.</p>
<p>Then task 4, which is theirs. The card behind checked the front, this one checks the back. An email id is a Gmail id when it ends with the right thing. Ninety seconds, they write the three lines, type them and run them.</p>
<div class="act"><b>While they work:</b> do not answer is this right, say run it. Then ask which one word they changed before you show the answer.</div>
<div class="safe"><b>Safe point 4, two kinds of method.</b> Ask the room which of today's methods answer a question and which hand back a new string. If the sorting is shaky, say the pair again against the five lines before the exit.</div>
"""},

{"kind": "concept", "title": "upper and lower", "nav": "upper and lower", "band": "63 to 66", "html": """
<p>The easiest beat today, take it fast. Line on screen, ask what it prints, then run it: every letter turns into its capital and the original string still holds what it held. Then ask what the mirror line prints before you press, and take the name from the room.</p>
<p>That is all five methods. One question left, and then we are done.</p>
<p class="cpnote floor"><span>Hard floor</span> 66 minutes. The exit question runs whatever else is unfinished</p>
"""},
{"cp": "Hard floor &middot; 66 min", "floor": 1},

{"kind": "exit", "title": "Exit question, which one prints nothing", "nav": "Exit question", "band": "66 to 70", "html": """
<p>Read the program out loud by line number and do not explain it. Say the question exactly as written: for which one of these does the screen show nothing at all? Two and a half minutes on the timer, in silence.</p>
<p>Count the hands for A, then B, then C, then D, every option out loud, before anything is revealed. Then reveal and explain every option, not only the right one. The three that print all strip down to the same digits. The answer is the one where a character in the middle was never reached.</p>
<div class="say"><b>Close with the sentence of the day:</b> "strip works on the ends. Always the ends."</div>
<p class="small">A big vote for the last option means the room thinks strip takes one character off each end and stops. That is the misconception to open the next session with.</p>
"""},

{"kind": "concept", "title": "Takeaways and close", "nav": "Takeaways and close", "band": "70 to 75", "html": """
<p>Two takeaway cards, and they are the ones students photograph, so say that out loud and give them five seconds at the end of each.</p>
<p>The first is one string with four slices under it, all four of them lines the room has already run today. Ask why the third one stopped rather than reading it, and take the answer from the room. The last press is the two rules that are the whole first half: the stop number is never reached, and your own string never changes.</p>
<p>The second is the five methods, one line each with the output it really gives. Do not explain any of them again, they have each had a card. The last press is the split that no single cell says: two of them answer a question, three hand back a new string, and not one of them changes the string you started with.</p>
<p>Then feedback, one minute, and the thank you card with one line about practising the slicing questions on the portal.</p>
"""},

{"kind": "concept", "title": "If you are running late", "nav": "If you are running late", "html": """
<p>Cut in this order. Each of these can go without breaking what comes after it.</p>
<ol>
<li><b>The slice machine</b> drops to three levels, keeping the one where nothing comes out.</li>
<li><b>Worksheet task 2</b> drops its middle step. Typing it once and the negative step are the parts they cannot skip.</li>
<li><b>The explainer</b> runs one set of characters instead of three, and keeps the one it opens on.</li>
<li><b>The method takeaways</b> drop to the last press, the split between the two kinds.</li>
</ol>
<p>Never cut the PIN card, the two short strip cards, or the exit question. The PIN card is the reason the second half exists, the strip rule is what the exit turns on, and the exit is the hard floor.</p>
<div class="box">
<h3>If they ask</h3>
<ul>
<li><b>Does strip remove every space?</b> No. It works in from each end and stops at the first character that is not in the set.</li>
<li><b>Is what is in the brackets a word?</b> No, it is a set of characters, and the order inside does not matter.</li>
<li><b>Does a method change my string?</b> No. Every one of them hands back something new.</li>
<li><b>Is a slice that lands nowhere an error?</b> No. It is an empty string, and printing it shows a blank line.</li>
</ul>
</div>
"""},
]
