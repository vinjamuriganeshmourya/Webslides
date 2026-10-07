"""The instructor guide: one entry per card, in presentation order.

Not a script to read out and not a list of topics. The thread of each card:
what to say, in order, with the questions marked, so that nothing an instructor
says starts out of nowhere. Every answer in here is derived by running the code,
never typed: see check_answers.py.
"""
import panels as P

# ---------------------------------------------------------------- the entries
# (beat, mins, title, flow steps, do list, watch-for). The card number is the
# position in this list, so inserting an entry cannot leave a stale number
# behind pointing at the wrong slide.
ENTRIES = [
    ("Opening", 1, "Welcome",
     ["Let the room settle. Nothing to teach on this card.",
      "Say what today is about in one line: <em>we already know one kind of loop, "
      "today we meet the other one, and it is the shorter one.</em>",
      "Hand off: <em>first, a quick check on last session.</em>"],
     ["Press Next as soon as the room is quiet."],
     "Nobody has a laptop open yet. Say <b>laptops shut</b> once here and it holds "
     "until worksheet task 1."),

    ("Recap", 1, "Recap",
     ["One word, the size of the room, and nothing else on it.",
      "You say which session it was: <em>last session was the while loop. Quick "
      "recap before we start.</em>",
      "Press Next. The retrieval is the card after this one."],
     ["Do not read anything off this card. There is nothing on it to read.",
      "This is the same card in every session, in every subject."],
     "Nothing. Give it five seconds and move."),

    ("Recap", 3, "The while loop, in three parts",
     ["Three parts of a while loop on the left, three jobs on the right, in a "
      "different order. Read the six out loud once.",
      "<b>Ask</b>: <em>which two belong together?</em> Take it as a call-out, "
      "not as hands.",
      "Press <b>Join them</b>. The pair joins and one line says why.",
      "Same for pair 2 and pair 3. Read the why line out each time: it is doing "
      "the teaching, not the join.",
      "The condition pair is the one to slow down on. Say the count out loud: "
      "<em>the question is asked four times, not three, because it is asked once "
      "more at the end when the answer is finally no.</em>",
      "Hand off: <em>hold on to those three. Today, two of them disappear.</em>"],
     ["Three presses. The format is <b>match</b>; session 12 used <b>bug</b>, so "
      "the room does not meet the same shape twice running.",
      "Never name a student. Take call-outs, and let a wrong pair be said out "
      "loud without correcting the person who said it.",
      "This card is not a warm-up. Card 13 is about which of these three lines "
      "the for loop drops, so all three have to be named here."],
     "Most rooms pair the condition with <em>the starting value</em>. That is the "
     "confusion today clears up, so let it be said before you join the right two."),

    ("Hook", 3, "One tap, and it keeps going",
     ["Start from what they have: <em>everyone here has this app open on the way "
      "in.</em> It is Spotify, and the playlist is theirs.",
      "Press 1. The playlist. Say nothing clever: <em>five songs, one list.</em>",
      "Press 2. The green button, one tap, and the first song starts. "
      "<em>One tap. That is all you did.</em>",
      "Press 3. Song one ends and song two starts, then song three. "
      "<b>Ask before you press 4</b>: <em>who told it to play the next song?</em> "
      "Take two answers. Do not correct anyone.",
      "Press 4 and stop. The highlight reaches the last song and the bar reads "
      "<b>Stopped, the list ended</b>. <b>Ask</b>: <em>nowhere on this screen "
      "does it say five. So what told it to stop?</em> Wait. The answer you want "
      "is that the list ran out.",
      "Press 5. A sixth song appears and it plays six. <em>You changed nothing "
      "else. You never typed a number anywhere.</em>",
      "Press 6. The question lands: <em>where else does one tap keep going by "
      "itself until a list runs out?</em> Do not answer it. The next card is "
      "where the answers go."],
     ["Six presses. Arrow keys step it.",
      "Two stops where you ask before pressing: before press 4, and on press 4.",
      "Tell the whole song story before you ask them anything. A question at "
      "press 3 cuts the story in half and the room never sees it end.",
      "No timer on this card. A clock turns a question into a test."],
     "Somebody may say the app knows it has five songs. Good answer, take it, then "
     "ask how it knew after they added the sixth. Nobody told it anything."),

    ("Hook", 3, "Where else does this happen?",
     ["Press 1. The question is at the top and three empty slots are under it, "
      "each with its machine already drawn pale inside. <b>This is their turn.</b> "
      "Take four answers out loud. Say which slot each one would go in. Do not "
      "judge any of them.",
      "Press 2. Our three land and start turning: the attendance register, "
      "Instagram stories, the billing counter. Read the one line under each.",
      "Say the shape once, in their words: <em>a list that ends, and one job per "
      "item in it.</em>",
      "Press 3. Everything goes and the shape behind all four is left on screen: "
      "a list, one job, and an arrow going back for the next item. Read it in "
      "that order: <em>take a list, do one job, once for each item.</em>",
      "Press 4. The red line arrives. Point at it: <em>nowhere does it say "
      "six.</em> Hand off: <em>so what is this thing called in Python?</em>"],
     ["Four presses.",
      "Press 1 is theirs and press 3 is yours. Their examples come out before "
      "ours, or ours become the answer and there is nothing left to think about.",
      "Press 3 is the one that matters. Do not rush it: it is the for loop, "
      "drawn, before anyone has said the words."],
     "If a group gives an example with a fixed count in it, like <em>ten press-ups</em>, "
     "take it and ask what happens when there are eleven. That is the difference "
     "this card is drawing."),

    ("Concept", 1, "Today's topic",
     ["The room has just guessed. Now name it: <em>this is a for loop.</em>",
      "One line on what it does: it walks a sequence, one item at a time.",
      "Hand off: <em>here is the plan for the next hour.</em>"],
     ["Show it, say the name, move on. Ten seconds."],
     "If a student says the word loop before you do, say so out loud. That is the "
     "hook working."),

    ("Concept", 2, "The plan",
     ["The three stops are outlined in dashes from press 1, so the room can see "
      "how far today goes before you say what is in it.",
      "Press 1. <b>For loop</b>, and walking a sequence.",
      "Press 2. <b>range</b>, which makes a sequence out of numbers.",
      "Press 3. <b>The star pattern</b>, which they write themselves.",
      "Press 4. The line the deck leaves off: <em>and the one mistake everybody "
      "makes.</em> Say it plainly. Half the back half of the session is about it.",
      "Hand off: <em>but first, something from last session that went wrong.</em>"],
     ["Four presses. Do not expand any stop: this is a signpost, not a summary.",
      "Say the fourth one as a promise, not a warning."],
     "Nothing to watch here. If the room is restless, take it in two presses "
     "instead of four."),

    ("Concept", 2, "Identify the mistake",
     ["This is last session's code, not today's. Set it up: <em>we wanted this to "
      "print Python, one letter on each line.</em>",
      "Read the expected output on the right, then the actual output. "
      "<b>Ask</b>: <em>what is missing?</em> The last letter.",
      "<b>Ask</b>: <em>where is the mistake?</em> Give it thirty seconds and take "
      "hands. Point at the line they name, do not confirm it yet.",
      "Hand off: <em>let us see which line it was.</em>"],
     ["Do not give the answer on this card. The next card is the answer.",
      "Count the moving parts out loud while they look: <em>a counter, a len, a "
      "condition, an index, and a plus one. Five things to get right.</em>"],
     "Most rooms go for the print line first, because that is where the output "
     "comes from. Let that be said. The mistake is one line above it."),

    ("Concept", 1, "One character, and the last letter comes back",
     ["The highlighted line is the answer: the <code>- 1</code> should not be "
      "there.",
      "Say the size of it: <em>three characters. The job was never wrong. The "
      "bookkeeping was.</em>",
      "Hand off: <em>so how much of this program is actually about printing?</em>"],
     ["One sentence and move. The point is made by how small the fix is."],
     "Somebody will ask why the counter starts at 0. Say it is because positions "
     "start at 0, and that it is exactly the kind of thing the for loop takes away."),

    ("Concept", 1, "Can we simplify this?",
     ["The same program with its three parts labelled: initialization, "
      "termination condition, updation.",
      "Point at each label, then at the one line that does the real work: "
      "<code>print(a[counter])</code>.",
      "Say the count: <em>five lines. One of them prints. Four are bookkeeping, "
      "and the bookkeeping is where the mistake was.</em>",
      "<b>Ask the title out loud</b>: <em>can we simplify this?</em> Take two "
      "answers. Do not correct anyone.",
      "Hand off: <em>Python has a loop that does the bookkeeping for you.</em>"],
     ["Ask the question on the slide. Do not answer it on this card.",
      "This is the why for the whole session. Give it the full two minutes even "
      "if you are behind."],
     "A student may say <em>use a function</em>. Fair answer, take it, and say we "
     "are going smaller than that: we are removing lines, not hiding them."),

    ("Concept", 1, "For Loop: the syntax",
     ["Name the three parts of the line: <code>for</code>, a name you choose, and "
      "a sequence.",
      "Say the two kinds of sequence from the slide: characters of a string, and "
      "numbers. The second half of today is the second kind.",
      "Hand off: <em>here it is on the word we were just failing at.</em>"],
     ["Name the parts and move. Card 12 shows them working."],
     "Watch for students copying <code>each_item</code> as if it were a keyword. "
     "Say once that the name is theirs to choose."),

    ("Concept", 2, "For Loop: over the characters of a word",
     ["Same job as card 10, and now count the lines out loud: <em>two. It was "
      "five.</em>",
      "Point at what is gone: no counter, no len, no index, no plus one.",
      "<b>Ask</b>: <em>where does ch get its value from?</em> Take hands. The "
      "answer you want is that the loop puts it there, once per pass.",
      "Hand off: <em>so what exactly disappeared?</em>"],
     ["Put this beside card 10 in your head and say the two numbers, five and two.",
      "Do not walk the passes here. Card 14 walks them."],
     "The most common wrong answer is that <code>ch</code> is a built-in name. "
     "Say the name is theirs and prove it on card 14 by choosing a different word."),

    ("Concept", 1, "What the for loop drops",
     ["Read the three struck lines: initialization, termination condition, "
      "updation. All three are gone.",
      "Tie it back to the recap: <em>those were the three parts you matched at "
      "the start of the session.</em>",
      "Hand off: <em>let us watch one run.</em>"],
     ["Read the two lines and move. This card is a full stop, not a lesson."],
     "If the room looks unconvinced, go back one card for five seconds. Two lines "
     "against five is the whole argument."),

    ("Explainer", 3, '"Python", one character at a time',
     ["The string is on screen whole, as one thing: <code>\"Python\"</code>.",
      "<b>Ask before you press</b>: <em>is that one thing or six?</em> Take hands "
      "for one, then for six.",
      "Press <b>Split it</b>. The string opens into its six characters, left to "
      "right. Say the word once, slowly: <em>a sequence.</em>",
      "<b>Ask</b>: <em>how many lines will this print?</em> Take a number from "
      "the room before anything runs.",
      "Press <b>One step</b> and walk it. Say what each press proves off the "
      "caption. The box the loop takes <b>vanishes</b>: point at that.",
      "Run it again with <b>Go</b>. Two characters, two passes.",
      "Now the one that matters. Pick <b>nothing</b>, the empty word. "
      "<b>Ask first</b>: <em>what does this print?</em> Take answers. Most rooms "
      "say an error.",
      "Press Play. Line 3 is never reached and it <b>stays grey</b> after the run "
      "ends. Only Done prints. Say it: <em>no error, no output, and the program "
      "carried on.</em>",
      "Hand off: <em>your turn. Same idea, on paper first.</em>"],
     ["The split is the point of the card. Do not press it for them.",
      "Always ask for a number before you press Play. A prediction after the run "
      "is not a prediction.",
      "The empty word is the state that stays on screen. If you keep one word, "
      "keep that one."],
     "<em>An empty string is an error</em> is the belief this card exists to break. "
     "Let it be said out loud before you press Play."),

    ("Activity", 6, "Trace it, then check it",
     ["Press 1 is the task. The program is on the left and the instructions are "
      "on the right. Say <b>worksheet tab open, playground shut</b>.",
      "Read the three columns of the table out loud: what ch holds, what n is "
      "after line 4, and what line 5 prints.",
      "Start the timer. Five minutes. Walk the room; do not answer, just look at "
      "what people have written.",
      "Pens down before anything else happens.",
      "Press 2 and keep going. Each press is one operation and the caption says "
      "what it proves. The code stays on the left the whole way, so they can "
      "check their own row against the one on screen.",
      "Slow down on the press where the loop asks for a third item and there is "
      "none. That is where the program ends, and it is the row most people "
      "wrote something in.",
      "The last press prints n. Say the check out loud now, and only now: "
      "<em>you should have used two rows, not three.</em>",
      "Hand off: <em>now type one yourself.</em>"],
     ["Eleven presses on one card. Press 1 is the task; presses 2 to 11 are the "
      "answer.",
      "<b>Hand the worksheet out here</b>, on this card, and nowhere else.",
      "Do not press past 1 until pens are down. The answer is on the same card as "
      "the question, which is the point and also the risk."],
     "Three rows filled in instead of two. That is the misconception of the whole "
     "session, and it is worth the extra thirty seconds."),

    ("Hands-on", 2, "Task 2, step 1: type it and run it",
     ["Playground open now, and the worksheet beside it. Nothing else.",
      "Step 1: type it exactly and run it. Four letters, four lines, then Done.",
      "Start the timer, a minute and a half. Walk the rows."],
     ["Say <b>write first, run second</b> now, once. The next two cards need it."],
     "Students who type <code>print(word)</code> instead of <code>print(ch)</code> "
     "get the whole word on one line. Good mistake: ask them which one the loop "
     "changes every pass."),

    ("Hands-on", 1, "Task 2, step 2: change the word",
     ["Line 1 is lit on the card: <code>word = \"Delhi\"</code>.",
      "<b>Write the number of lines first</b>, then run.",
      "Take one answer out loud: six. Five letters and Done."],
     ["If most of the room is done, skip the timer and move on."],
     "Anyone who writes five forgot the Done line. Ask them to point at line 4."),

    ("Hands-on", 2, "Task 2, step 3: an empty word",
     ["Line 1 is lit on the card: <code>word = \"\"</code>, two quote marks with "
      "nothing between.",
      "Take a show of hands before anyone runs it: <em>who thinks it errors?</em> "
      "Then let them run it.",
      "It prints only Done. No error.",
      "Hand off: <em>quiz time. Same idea, on the portal.</em>"],
     ["The show of hands is the beat. Do not skip it even if time is short."],
     "A student who writes nothing at all has missed that Done is outside the "
     "loop. Ask them which lines are indented."),

    ("Quiz", 4, "Classroom quiz on the portal",
     ["Laptops on the portal. The questions are there, not on this card.",
      "Say the rule once: <em>own answer, no talking, no tab switching.</em>",
      "Give it four minutes and watch the live spread.",
      "Do not teach from the results now. Note the two weakest questions and "
      "reopen them at the takeaways.",
      "Hand off: <em>so far every sequence we walked was a word. What if you want "
      "numbers?</em>"],
     ["The card is the cue and nothing else: no options, no answers, no timer.",
      "Everyone attempts. A wrong answer here stays private."],
     "If more than half miss the empty-sequence question, walk card 14 again with "
     "the empty word rather than explaining it."),

    ("Concept", 2, "How do we make a sequence of numbers?",
     ["Read the question on the slide out loud and stop there.",
      "<b>Ask</b>: <em>we need a sequence of numbers. Where does one come "
      "from?</em> Take two answers.",
      "Somebody will say <em>type them out</em>. Take it, then ask what they "
      "would do for a thousand.",
      "Hand off: <em>Python has one word for this.</em>"],
     ["Ask the question, take the answers, move. Do not name range yet."],
     "This card exists so range arrives as an answer to something. If you skip it, "
     "range arrives as a fact to memorise."),

    ("Concept", 1, "Range: starts at 0, stops before n",
     ["Name it: <code>range</code> builds a sequence of numbers for you.",
      "Say the two halves of the rule in one breath: <em>it starts at 0, and it "
      "stops before the number you give it.</em>",
      "Hand off: <em>so what does range(5) actually give?</em>"],
     ["One sentence. It is a sequence maker, nothing more."],
     "Nothing yet. The misconception arrives on the next card."),

    ("Concept", 1, "range(5) gives 0 1 2 3 4",
     ["<b>Ask before the room reads it</b>: <em>range(5). How many numbers, and "
      "which ones?</em>",
      "Then show it: five numbers, starting at 0, and 5 is not one of them.",
      "Say the two things that surprise people, separately: <em>it starts at 0</em>, "
      "and <em>the number you wrote is not in the list.</em>",
      "Hand off: <em>now put it in a loop.</em>"],
     ["Ask the count before you show the answer."],
     "Half the room will say 1 2 3 4 5. Let that be said before the slide answers "
     "it."),

    ("Concept", 1, "for number in range(3)",
     ["The same for loop, with range instead of a word.",
      "Read the loop line, then the output: 0, 1, 2.",
      "Point at the shape: <em>nothing changed except the sequence.</em>",
      "Hand off: <em>let us take range apart properly.</em>"],
     ["Read the loop line and the output. Do not add an example."],
     "If someone asks whether they can use range with a word, say no, range makes "
     "numbers, and the loop does not care which it gets."),

    ("Activity", 3, "The range dial",
     ["<code>range(1, 5)</code> is on screen and the number line runs from 0 to 10. "
      "Nothing is marked yet.",
      "<b>Ask</b>: <em>which numbers come out, and how many?</em> Take both "
      "answers out loud before pressing.",
      "Press <b>Show the numbers</b>. They land one at a time, start is tagged, "
      "and stop gets a cross through it on its own tick.",
      "Read the summing line: stop minus start is how many come out.",
      "Change the stop to 8 and ask again. Changing a number hides the answer, so "
      "they predict every time, not only the first.",
      "Now the one worth the minute: set start and stop to the <b>same</b> number. "
      "<b>Ask</b>: <em>what comes out?</em> Then press.",
      "Say the finding: <em>nothing comes out, and a loop over nothing simply "
      "does not run.</em> Tie it to the empty word on card 14.",
      "Hand off: <em>now a real question.</em>"],
     ["Four settings is the most this card can take: the default, one change, the "
      "equal case, and one of theirs.",
      "Ask both questions every time. Which numbers is the easy half; how many is "
      "the half that gets the pattern right later."],
     "<em>range(1, 5) gives five numbers</em> is the answer to expect. The cross on "
     "the stop tick is there so nobody has to take your word for it."),

    ("Story", 1, "Riya's piggy bank",
     ["Six presses, one speech bubble each. Read the bubble, point at the calendar.",
      "Press 1. Riya will save only on odd days. The rule is at the bottom.",
      "Presses 2 to 4. Day 1: a coin of 1 rupee drops in. Day 2: skip, the piggy "
      "is sad. Day 3: 3 rupees, so 4 in the bank.",
      "Press 5. Days 5 and 7 drop in. 16 rupees after 7 days.",
      "Press 6. Riya: what about 30 days, or a year? Hand off: <em>write it for her.</em>"],
     ["Ask before press 5: <em>how much after 7 days?</em> Let them add it in "
      "their heads. That is the work the loop will do."],
     "Nobody types yet. Laptops open on the next card."),

    ("Activity", 5, "Riya's savings",
     ["Read the problem out loud: read n, print the total from day 1 to day n, "
      "both included.",
      "Point at the two samples: 7 gives 16, 4 gives 4.",
      "Start the timer, four minutes. Walk the rows.",
      "At two minutes, if the room is stuck, press once for the hint: "
      "<code>day % 2 == 1</code>.",
      "When time is up, ask for the answer with 10. You want 25.",
      "Hand off: <em>let us check it one day at a time.</em>"],
     ["A total printed inside the loop gives a running list, not one number. "
      "Ask which line should run only once.",
      "Accept any correct loop. <code>range(1, n + 1, 2)</code> is fine if someone "
      "knows it."],
     "Anyone who gets 9 for input 7 used <code>range(1, n)</code>: day 7 is missing. "
     "Ask them which days their loop visits."),

    ("Activity", 1, "Riya's savings, day by day",
     ["Ten presses with n = 7. Lines 1 and 2 first: total starts at 0.",
      "One press per day. Odd days: total changes, the old value stays struck "
      "through, a coin drops into the piggy. Even days: the if is False, line 5 greys.",
      "Press 9: no days left, the loop ends. Press 10: it prints 16.",
      "Hand off: <em>now a harder one. Stars.</em>"],
     ["Say out loud on every even day: the loop still visits it, the if skips it."],
     "If the room is fast, skip to press 9 after day 3."),

    ("Concept", 2, "The pattern question",
     ["Read the question and the sample input and output. Nothing else.",
      "<b>Ask</b>: <em>how many rows for an input of 4?</em> Four. "
      "<em>How many stars on the last row?</em> Four.",
      "Say the shape of the answer without giving it: <em>one row per pass, and "
      "the number of stars changes every pass.</em>",
      "Hand off: <em>worksheet task 3. Write the loop line.</em>"],
     ["Read it, do not solve it. Task 3 is the solving.",
      "Note the space after every star. It is in the question and it is in the "
      "output."],
     "Students who start by counting stars rather than rows get stuck. Ask them "
     "what changes from one row to the next."),

    ("Activity", 4, "Write the loop line",
     ["Worksheet task 3. Only line 1 is given; line 2 and the blank on line 3 are "
      "theirs.",
      "Say the constraint: <em>the two blanks have to agree with each other.</em>",
      "Start the timer. Four minutes. Walk the room.",
      "Pens down. Take two different answers from two different groups, and write "
      "both on the board if you have one.",
      "Say plainly that more than one pair works. Do not rank them.",
      "Hand off: <em>here is one of them.</em>"],
     ["Take the answer from the room, not from the screen.",
      "Both <code>range(1, n + 1)</code> with counter, and <code>range(n)</code> "
      "with counter + 1, are correct. Say so."],
     "A pair that does not agree, like <code>range(n)</code> with the blank left as "
     "counter, gives a blank first row. Ask that group to run it."),

    ("Concept", 2, "Solution",
     ["This is one of the answers the room just wrote. Read the loop line, then "
      "the output.",
      "Point at the plus one and say why it is there: <em>range(n) starts at 0, "
      "and a row of zero stars is not a row.</em>",
      "<b>Ask</b>: <em>we started the count at 1 in our heads. Can we make range "
      "start at 1 instead, and drop the plus one?</em> Take two answers.",
      "Hand off: <em>two people just said two different things. Let us vote.</em>"],
     ["This card is headed Solution, not Range: the room has had range for ten "
      "minutes and the card is the answer to their own question.",
      "Ask the range(1, ...) question here. The next card is the vote on it."],
     "Somebody will say <code>range(1, n)</code> straight away and be confident. "
     "Perfect. Do not correct it. Put it on the vote."),

    ("Activity", 3, "Which one is right?",
     ["Two programs, side by side, A and B. They start at 1 either way. "
      "Read both loop lines out loud.",
      "<b>Ask</b>: <em>which one prints all n rows?</em> Hands up for A. Count "
      "them. Hands up for B. Count them. Say both numbers out loud.",
      "Do not hint. A wrong majority here is worth more than a right one.",
      "Press <b>Run them both</b>. The rows land on each side and the counts "
      "arrive under them.",
      "The dashed empty row appears on the left: <em>the row you wanted.</em> "
      "Point at it and wait.",
      "Say the rule once: <em>range stops before the stop value, so range(1, n) "
      "never reaches n.</em>",
      "Change n and run it again. The gap is one row, every time, for every n.",
      "Hand off: <em>so what do you write instead?</em>"],
     ["Count both hands before you press. The vote is the reason the gap lands.",
      "Two runs at most: n = 4, then one value the room picks."],
     "After the run, ask what n would make the two agree. There is none. That is "
     "worth saying out loud."),

    ("Concept", 1, "range(start, end)",
     ["The deck's own answer to the question they just voted on: range takes a "
      "start as well as a stop.",
      "Read the line and move.",
      "Hand off: <em>and here is the pattern written that way.</em>"],
     ["One press. Do not re-teach the dial."],
     "Nothing new here. If you are behind, this is the card to read in five "
     "seconds."),

    ("Concept", 1, "Simplified with range(1, n+1)",
     ["The same pattern, written the other way, and the plus one has moved from "
      "the print line into range.",
      "Put it beside card 25 and <b>ask</b>: <em>which of these two would you "
      "rather read?</em> Take a show of hands and do not rank them yourself.",
      "Hand off: <em>one question before we finish.</em>"],
     ["Let the room prefer one. Neither is better and saying so is the point."],
     "Students often think one of them must be the official answer. Say plainly "
     "that both are correct and that readability is the only tie-breaker."),

    ("Exit", 3, "Which one prints nothing?",
     ["Read the program out loud, line by line. Everyone answers this one.",
      "Start the timer. When it ends, read option A and count hands. Then B. Then C. "
      "Then D. Every option gets counted <b>before</b> the next card.",
      "Hand off: <em>let us check it one line at a time.</em>"],
     ["This runs whatever else is unfinished. Exit by minute 68.",
      "Count every option. The spread is what you open the next session with.",
      "Nothing about this question is on the worksheet, so it runs even if the "
      "sheet was abandoned."],
     "A pair that prints one line looks like nothing to a student who is skimming. "
     "Make them say how many lines, not whether it printed."),

    ("Exit", 1, "Why it prints nothing",
     ["Four presses, one operation each.",
      "Press 1. Option B: seats is 4, booked is 3.",
      "Press 2. Line 3: left is 1.",
      "Press 3. Line 4: range(1, 1) has no numbers in it.",
      "Press 4. The body never runs. Nothing is printed.",
      "Then say the other three out loud: A gives one line, C gives two, D gives three.",
      "Hand off: <em>one map, and we are done.</em>"],
     ["Do not skip the other three. The wrong answers are what the room remembers."],
     "Students who picked A think range(1, 2) is empty. It has one number: 1."),

    ("Buffer", 1, "Key takeaways",
     ["Seven presses, one row at a time. Each row carries a coloured chip with "
      "the concept's own name on it.",
      "Press 1. <b>for loop</b>: it walks a sequence, one item at a time.",
      "Press 2. <b>string</b>: Python is a sequence of six characters.",
      "Press 3. <b>range</b>: it makes a sequence of numbers.",
      "Press 4. <b>ch</b>: it holds one item and changes every pass.",
      "Press 5. <b>stop</b>: range(1, 5) gives 1 2 3 4, and stops before 5.",
      "Press 6. <b>how many</b>: the sequence decides how many passes happen.",
      "Press 7. <b>empty</b>: an empty sequence means the body never runs.",
      "If the quiz showed a weak question, reopen it here against the row it "
      "belongs to. The chips are there so you can point rather than describe."],
     ["Say the chip word before the sentence, every row. That is how a student "
      "finds it again in their notes.",
      "Three presses if you are short: the for loop, stops before, and the empty "
      "sequence."],
     "Ask the room to say the difference between rows 5 and 7 in their own words. "
     "If they cannot, that is the line to open next session with."),

    ("Buffer", 1, "Feedback",
     ["Feedback link on the portal. Two minutes, anonymous.",
      "Say what you will do with it in one sentence."],
     ["Same card in every session."],
     "Nothing."),

    ("Buffer", 1, "Thank you",
     ["Thank them and name one thing the room did well today."],
     ["Last card. Stop here."],
     "Nothing to watch."),
]

BANDS = {
    1: "Checkpoint 1 &middot; 14 min &middot; they can say why a list ends a loop. "
       "If not, cut the agenda to two presses and go on.",
    8: "Checkpoint 2 &middot; 11 min &middot; they can read a for loop out loud and "
       "say what it dropped. If not, hold on card 10 and count the lines again.",
    15: "Checkpoint 3 &middot; 23 min &middot; they can trace one by hand and say what "
        "range gives. If not, cut the dial to the default and the equal case.",
    25: "Checkpoint 4 &middot; 20 min &middot; they can use a for loop to work out "
        "a total. If not, walk Riya's answer to day 3 only and cut task 3 to three minutes.",
    34: "Hard floor &middot; exit at 68 min &middot; the exit question runs whatever "
        "is unfinished. Takeaways can drop to three presses.",
}


HANDOUT_CARD = 15          # the one card that gives the worksheet out


def entry(n, beat, mins, title, flow, do, watch, thumb, total, sheet=None,
          block_mins=None):
    """`mins` is what THIS card costs, not what its block costs. Four cards in a
    row each claiming the block's five minutes is how an instructor loses the
    thread at minute 40, so a card inside a multi-card block names the block
    total once, beside its own."""
    handout = " data-handout" if n == HANDOUT_CARD else ""
    when = f"{beat} &middot; {mins} min &middot; card {n} of {total}"
    if block_mins and block_mins != mins:
        when += f" &middot; in a {block_mins} min block"
    if sheet:
        when += f" &middot; worksheet {sheet}"
    steps = "".join(f"<li>{s}</li>" for s in flow)
    short = SHORT.get(title)
    dos = ("".join(f"<li>{s}</li>" for s in do)
           + (f'<li class="hot">Short of time: {short}</li>' if short else ""))
    return (f'<article class="gcard" data-card="{n}"{handout}>'
            f'{thumb}'
            '<div class="gbody">'
            f'<p class="gwhen">{when}</p>'
            f'<h4>{title}</h4>'
            f'<div class="gflow"><b>How it goes</b><ol>{steps}</ol></div>'
            f'<ul class="gdo">{dos}</ul>'
            f'<p class="gwatch"><b>Watch for</b> {watch}</p>'
            '</div></article>')


SHEETS = {15: "task 1", 16: "task 2", 17: "task 2", 18: "task 2", 29: "task 3"}

# One line per card saying what to drop when the clock is against you. Keyed by
# the card's title, not its number, so inserting a card cannot shift them onto
# the wrong entries. A card with no line here is one that cannot be shortened.
SHORT = {
    "The while loop, in three parts": "join two pairs, not three. The third one "
        "is the line today drops anyway.",
    "One tap, and it keeps going": "take one answer before press 4 instead of "
        "two. Presses 4 and 6 cannot go.",
    "Where else does this happen?": "take two answers instead of four and go "
        "straight to press 3. Press 3 is the one that cannot go.",
    "The plan": "two presses: the three stops together, then the mistake.",
    "Identify the mistake": "give it twenty seconds, not thirty, and take one "
        "answer.",
    "Can we simplify this?": "ask the question, take one answer, move on.",
    "For Loop: the syntax": "name the three parts and move. Card 12 shows them "
        "working.",
    "What the for loop drops": "read the two struck lines only.",
    "\"Python\", one character at a time": "one word, not three, and make it "
        "<b>nothing</b>. The empty word is the finding.",
    "Trace it, then check it": "give three minutes, not five, and walk the last "
        "four presses only.",
    "Task 2, step 2: change the word": "skip this card. Typing it once "
        "and emptying it are the parts they cannot skip.",
    "Riya's savings": "three minutes on the timer, and give the hint at once.",
    "Riya's savings, day by day": "presses 1 to 4, then jump to 9 and 10.",
    "How do we make a sequence of numbers?": "ask the question and take one "
        "answer.",
    "Range: starts at 0, stops before n": "one sentence: it is a sequence maker.",
    "range(5) gives 0 1 2 3 4": "this is the card in the block that can go. The "
        "dial says the same thing and says it better.",
    "for number in range(3)": "read the loop line and the output, nothing else.",
    "The range dial": "show the default, then jump straight to start and stop "
        "equal. Skip the middle settings.",
    "The pattern question": "read it, do not solve it. Task 3 is the solving.",
    "Write the loop line": "three minutes, and take the answer from the room "
        "rather than walking the rows.",
    "Solution": "one press. The plus one is the whole point of the card.",
    "Which one is right?": "run it once at n = 4 and stop. Do not change n.",
    "range(start, end)": "read the line, move on.",
    "Simplified with range(1, n+1)": "put it beside card 25 and let the room say "
        "which they prefer.",
    "Key takeaways": "three presses: the for loop, stops before, and an empty "
        "sequence.",
}


def common():
    return """
<section class="g-sec"><h3>Common guidelines</h3>

<h4>Never start a card cold</h4>
<p>Every card opens from something the room already has: the app on their phone,
the program still on their screens, the answer somebody just gave. If a card feels
abrupt, the fix is one sentence at the end of the card <em>before</em> it.</p>

<h4>Walk it in steps, and check as you go</h4>
<p>Do not deliver a finished explanation. Say one step, then ask the next as a
question. <em>So what happens when the sequence is empty? Nothing runs, right?
Good.</em> If the room does not answer that, you have found the gap for free.
Offer doubts often. It costs four seconds.</p>

<h4>How every poll runs</h4>
<p>Let them think. Read option A and count hands, then B, then C, then D. Every
option gets counted before anything is revealed. Then reveal, and explain
<b>every</b> option, not only the right one. A wrong option nobody explains is a
misconception that goes home with them.</p>

<h4>Picking students</h4>
<p>Call a group, never a name. <em>Back three rows, what did you get?</em> Rotate
the groups so it is not always the front. Never single anyone out for a wrong
answer.</p>

<h4>When nobody answers</h4>
<p>Count ten seconds in your head. Then narrow the question rather than answering
it. <em>Just tell me, is it more than three or less than three?</em></p>

<h4>Why the worksheet comes before the keyboard</h4>
<p>The playground is where they check, not where they start. A task typed into the
playground first and written down afterwards is a transcript, not a prediction, and
the whole value of the beat is gone. Say <b>write first, run second</b> every time.</p>

<h4>The laptop rule</h4>
<p>Laptops shut except on a worksheet, playground or quiz beat. The entries say
<em>worksheet tab open</em> on the first step of a task card and <em>worksheet
closed</em> on the card after it, so it gets said at every change.</p>

<h4>The cut order, if you are behind</h4>
<ul class="brief">
<li>Card 7, the plan, to two presses. Saves 1 min.</li>
<li>Card 20, range(5), out entirely. The dial says it better. Saves 1 min.</li>
<li>Cards 27 and 28 to one press each. Saves 1 min.</li>
<li>The takeaways map to three presses. Saves 1 min.</li>
<li class="hot">Never cut: worksheet task 1 with its walk, the explainer on card 14,
the vote on card 26, or the exit question. They are the session.</li>
</ul>
</section>
"""


def if_they_ask():
    return """
<section class="g-sec"><h3>If they ask</h3>
<ul class="brief">
<li><b>Is <code>ch</code> a keyword?</b> No. You choose that name. <code>for x in
word</code> works exactly the same.</li>
<li><b>Why does range start at 0?</b> Because positions in Python start at 0. It
matches how you index a string.</li>
<li><b>Can I use a while loop instead?</b> Yes, always. Use a for loop when you
already have a sequence. Use while when you do not.</li>
<li><b>Does <code>range(4, 4)</code> give an error?</b> No. It gives an empty
sequence, and a loop over it simply does not run.</li>
<li><b>What if the word is empty?</b> Same thing. The body never runs, and
anything after the loop still runs normally.</li>
<li><b>Can I change the word inside the loop?</b> Leave this for a later session.
Say it is possible and that it causes trouble, and move on.</li>
<li><b>Is <code>range(1, n+1)</code> better than <code>range(n)</code> with a plus
one?</b> Neither is better. Both are correct. Pick the one you can read.</li>
<li><b>Why is there a space after every star?</b> Because the question asks for it.
<code>"* "</code> has a space inside the quote marks.</li>
<li><b>Can a for loop go over numbers without range?</b> Yes, over a list, which is
a later session. Today range is the one that makes a sequence of numbers.</li>
</ul>
</section>
"""


def source_defects():
    return """
<section class="g-sec"><h3>Where this plan leaves the deck</h3>
<ul class="brief">
<li><b>Slide 12, the agenda, is redrawn.</b> The deck's ribbon lands all at once
and the room reads stop three while you are still on stop one. Card 7 is the same
ribbon, arriving one stop at a time, with a fourth press for the mistake the deck
leaves off.</li>
<li><b>Slides 13 and 14 are out, and card 14 replaces them.</b> A picture of a
string already split is a fact. The split happening on a press, with the room
having said one or six first, is the idea.</li>
<li><b>Slides 19 to 32 are out.</b> Fourteen slides walk one for loop over
<code>"Python"</code>, one character per slide. Card 14 does the same walk, at a
speed you control, on a word the room picks.</li>
<li><b>Slide 40 is re-headed.</b> The deck heads it <em>Iterate Over Numbers /
Range</em>, and by minute 55 a card headed Range reads as a step backwards.</li>
<li><b>How it was re-headed.</b> The two words are lifted out of the deck's own
slides 9 and 46, in the deck's own face, and pasted at slide 40's heading
coordinates. Nothing is typed in a substitute font. See
<code>deck_surgery.py</code>.</li>
<li><b>Slide 46, the possible mistake, is out.</b> Card 26 is that mistake, voted
on and then run, which is the same content with the answer withheld until the room
has committed.</li>
<li><b>Worksheet task 1 lost its <code>if</code>.</b> The deck's version ends with
<code>if n &gt; 5: print("long")</code>. It tests nothing about a for loop, and an
unreached branch in the middle of a first trace is a second lesson nobody asked
for.</li>
</ul>
</section>
"""
