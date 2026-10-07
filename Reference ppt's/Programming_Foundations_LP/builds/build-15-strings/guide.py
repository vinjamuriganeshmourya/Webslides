"""The instructor guide: one entry per card, in presentation order.

Not a script to read out and not a list of topics. The thread of each card:
what to say, in order, with the questions marked, so nothing an instructor says
starts out of nowhere. Every answer in here is derived by running the code,
never typed: see check_answers.py.
"""
import panels as P

_SEQ = ", ".join(str(n) for n in P.recap_seq())
_T1 = [P.expr(*lv) for lv in P.TASK1_SLICES]
_BLANKS = P.task3_blank_rows()
_LAND = P.jump_landings()
_SKIP = P.jump_untouched()

# ---------------------------------------------------------------- the entries
# (beat, mins, title, flow steps, do list, watch-for). The card number is the
# position in this list, so inserting an entry cannot leave a stale number
# behind pointing at the wrong card.
ENTRIES = [
    ("Opening", 1, "Welcome",
     ["Let the room settle. Nothing to teach on this card.",
      "Say what today is about in one line: <em>we already know how to take a "
      "piece out of a string. Today we get much better at it, and Python does "
      "most of the work.</em>",
      "Hand off: <em>first, a quick check on last session.</em>"],
     ["Press Next as soon as the room is quiet."],
     "Nobody has a laptop open yet. Say <b>laptops shut</b> once here and it "
     "holds until worksheet task 1."),

    ("Recap", 1, "Recap",
     ["One word, the size of the room, and nothing else on it.",
      "You say which session it was: <em>last session was the for loop and "
      "range. One quick check before we start.</em>",
      "Press Next. The retrieval is the card after this one."],
     ["Do not read anything off this card. There is nothing on it to read.",
      "This is the same card in every session, in every subject."],
     "Nothing. Give it five seconds and move."),

    ("Recap", 3, "What range(2, 6) hands you",
     ["Five numbers along the top, two bins under them. Read the five out "
      "loud once.",
      "<b>Ask</b>, one number at a time: <em>does this one come out of "
      "range(2, 6), yes or no?</em> Count the hands for yes, then count the "
      "hands for no, then press <b>Drop it</b>. Every number, every time.",
      "The two to slow down on are <b>5</b> and <b>6</b>. Read the why line "
      "out loud on both.",
      f"Say the whole sequence once at the end: <em>{_SEQ}. Four numbers. The "
      "start is in, the stop is not.</em>",
      "Hand off: <em>hold on to that. Everything we do today stops one place "
      "early, in exactly the same way.</em>"],
     ["Five presses. The format is <b>sort</b>. Session 12 used <b>bug</b> "
      "and session 14 used <b>match</b>, so the room does not meet the same "
      "shape twice running.",
      "Count both options aloud for every chip before you press.",
      "Never name a student. Take a show of hands, not a call-out."],
     "The hands for <b>6</b> are the read you want. If a third of the room "
     "says yes, slow down: that same mistake costs them the exit question."),

    ("Hook", 4, "The message the search cannot find",
     ["Start from something every one of them has done: <em>somebody in your "
      "group types like this.</em> Point at the phone.",
      "Press 1. The chat. <b>Ask</b>: <em>what does that message say?</em> "
      "The room says SORRY in about a second. Take it.",
      "Press 2. The search bar opens with SORRY typed in it and the chat says "
      "<b>No messages found</b>. Wait. Let them see that the letters are "
      "right there on the screen. <b>Ask</b>: <em>why can it not find "
      "it?</em>",
      "Take two or three answers. Do not correct anybody. The boxes on the "
      "right are the answer: <em>nine boxes, not five. Four of them are "
      "spaces, and a space is a character like any other.</em>",
      "<b>Ask</b>: <em>so which boxes are the letters in?</em> Wait for 0, 2, "
      "4, 6, 8.",
      "Press 3. Five marks land on boxes 0 to 4, side by side, and the box on "
      f"the right fills with <b>{P.hook_run_out()}</b>. Say: <em>a run of "
      "characters, one after another. That is the only shape we have ever "
      "asked for, and it drags the spaces along.</em>",
      "<b>Ask before you press 4</b>: <em>so what would I have to "
      "change?</em> Take two answers.",
      "Press 4 and stop talking while it moves. The marks stretch out onto 0, "
      "2, 4, 6 and 8, the letters light up, and the answer becomes "
      f"<b>{P.hook_jump_out()}</b>. Then say the line: <em>same first box. It "
      "just jumps two at a time now.</em>"],
     ["Four presses. Arrow keys step it.",
      "Three stops where you ask before pressing: presses 1, 2 and 4.",
      "Do not use the words slice, step or method here. The room names the "
      "topic on the next card.",
      "No timer on this card. A clock turns a question into a test."],
     "Somebody will say <em>just type it properly</em>. Good answer, take it, "
     "then ask what the search box is supposed to do about the thousand "
     "messages already sent."),

    ("Topic", 1, "Today",
     ["Now the card names it. Read it once: <em>string methods.</em>",
      "Tie it back: <em>the jump you just saw has a name, and so does every "
      "other job we will do to a string today.</em>"],
     ["One press. Nothing before this card says the words String Methods, so "
      "do not say them on the hook either."],
     "If somebody guessed the name during the hook, say so and use their "
     "words. That is the best possible opening to this card."),

    ("Topic", 1, "The plan",
     ["Three stops, one per press, and each one carries a line that says what "
      "the words mean. Read the stop, then read the line under it.",
      "Press 1. <b>String slicing</b>, and under it <em>take a part of a "
      "string</em>. Say: <em>one character we can already do. Today we ask "
      "for several at once.</em>",
      "Press 2. <b>String methods</b>, and under it <em>jobs Python already "
      "knows</em>. Say: <em>things you would otherwise write a loop for. "
      "Python has them ready.</em>",
      "Press 3. <b>Where it stops</b>, and under it <em>a slice stops before "
      "its last number</em>. Say: <em>this is the one that costs marks, and "
      "it is the same rule as the recap.</em>",
      "Hand off: <em>first one, then several, then where it stops.</em>"],
     ["Three presses. Do not read all three stops and then explain them: one "
      "press, one sentence.",
      "The third stop is not decoration. Every wrong answer today comes from "
      "it."],
     "Nothing to watch here. It is thirty seconds. If the room is quiet, ask "
     "which stop they think is the hard one."),

    ("Slicing", 3, "From one character to four",
     ["Open from the hook: <em>we counted boxes a minute ago. Same boxes "
      "here, and now we ask for what is in them.</em>",
      f"Press 1. Seven characters, seven boxes, numbered from 0. Read the "
      "numbers out loud with the room. Do not go on until they have.",
      "Press 2. <b>Ask first</b>: <em>if I write message[0], what do I "
      f"get?</em> Wait for {P.PULL_SRC[0]!r}. Then press. Box 0 lights up and "
      f"the line at the top reads <code>message[0]</code> giving "
      f"<b>{P.PULL_SRC[0]!r}</b>. Say: <em>one number in the brackets, one "
      "character back.</em>",
      "Ask one more of the same shape and do not press: <em>so what would "
      f"message[1] give me?</em> Wait for {P.PULL_SRC[1]!r}.",
      "Now the real question, and this is the card: <em>I want the name "
      f"{P.pull_out()} out of this. How do I do that?</em> Take answers. "
      "Somebody will say four numbers; somebody will guess the colon.",
      "Press 3. A dashed window lands over the four boxes the name sits in. "
      "<b>Ask</b>: <em>say their numbers.</em> Wait for "
      + ", ".join(str(i) for i in P.pull_indexes()) + ".",
      "Press 4. Now the line is written, big, under the string: "
      f"<code>message[{P.PULL_SLICE[0]}:{P.PULL_SLICE[1]}]</code>, and box "
      f"{P.PULL_SLICE[1]} arrives greyed and labelled <b>never reached</b>. "
      "Read it left to right: <em>message, bracket, 3, colon, 7.</em> Then "
      "say: <em>seven is written down, and seven is never touched. Same rule "
      "as the recap.</em>",
      "Press 5. The four characters are copied out into the box on the right. "
      "Say the thing the picture is doing: <em>copied, not moved. Look at the "
      f"row. message still holds all {len(P.PULL_SRC)} characters.</em>",
      "Hand off: <em>so that shape works when the characters sit next to each "
      "other. Watch what happens when they do not.</em>"],
     ["Five presses, and the first two are indexing. Do not skip them: the "
      "slice is the answer to a question, and if nobody asked it the slice is "
      "just a shape to copy.",
      "The room answers before press 2, before press 3 and before press 4.",
      "Say the index numbers out loud with them. Reading them silently is "
      "where half the later mistakes start.",
      "Worksheet and laptops stay shut."],
     "A student may say the answer is <em>Ravi</em> without looking at an "
     "index at all. Ask which box R is in. That is the check."),

    ("Slicing", 2, "The one it cannot cut",
     ["Same shape as the hook, and say so: <em>hyphens this time instead of "
      "spaces, but it is the same problem.</em>",
      "<b>Ask</b>: <em>can we get Ravi out of this with what we just "
      "did?</em> Take answers. Somebody will try 1 to 8. Take it.",
      "Say what 1 to 8 would give: every character from 1 to 7, hyphens and "
      "all.",
      "Hand off: <em>so we need a third number. That is the next card.</em>"],
     ["Do not give the syntax here. The next card is the syntax.",
      "Two minutes. This card asks a question; it does not answer one."],
     "If the room is silent, narrow it: <em>which indexes do we actually "
     "want?</em> The answer 1, 3, 5, 7 gets you straight to the step."),

    ("Slicing", 2, "start, end and step",
     ["Read the shape once, left to right: <em>start index, colon, end index, "
      "colon, step.</em>",
      "Point at the step and give it one sentence: <em>how far it jumps each "
      "time.</em>",
      "Work the boxes on the right out loud with the room: <em>start at 1. "
      "Add 2, that is 3. Add 2, that is 5. Add 2, that is 7.</em> Let them say "
      "the numbers.",
      "Hand off: <em>let us watch that happen one jump at a time.</em>"],
     ["This is the naming card. Say start, end and step here and nowhere "
      "else; every panel uses the same three words and none of them redefines "
      "them."],
     "Watch for a student reading the step as <em>how many characters we "
     "take</em>. It is not. It is how far the jump is."),

    ("Slicing", 2, "A slice with a step",
     [f"The line is at the top of the card from press 1: "
      f"<code>secret_message[{P.JUMP_SLICE[0]}:{P.JUMP_SLICE[1]}:"
      f"{P.JUMP_SLICE[2]}]</code>. Read it out. This card is not a reveal, it "
      "is a walk: they know the line, and we find out together where it "
      "lands.",
      "Press 1. Same nine boxes. Say: <em>the letters are not side by side "
      "this time.</em>",
      f"Press 2. The marker lands on {P.jump_landings()[0]} and that letter "
      "comes out.",
      "<b>Before every press after that, the room says the sum.</b> "
      + " ".join(f"<em>{a} plus {P.JUMP_SLICE[2]} is {b}?</em>"
                 for a, b in zip(P.jump_landings(), P.jump_landings()[1:]))
      + " Press only after they have said it.",
      f"On the last landing, say the stop out loud: <em>the next one would be "
      f"{P.jump_landings()[-1] + P.JUMP_SLICE[2]}, and we stop before "
      f"{P.JUMP_SLICE[1]}.</em>",
      "Press 6. The boxes it never landed on go dashed and stay that way. "
      "Say: <em>it never looked at the hyphens at all.</em>",
      "Hand off: <em>your turn. Three of these, on paper, before anybody "
      "runs anything.</em>"],
     ["Six presses. The sum before the press, every time. If you press first, "
      "the card does the arithmetic and they watch.",
      f"The landings are "
      + ", ".join(str(i) for i in P.jump_landings())
      + f". The ones it never touches are "
      + ", ".join(str(i) for i in P.jump_untouched()) + ".",
      "The deck calls this <b>extended slicing</b>. Say that word once, here, "
      "so they recognise it on the portal."],
     "The mistake is adding the step to the stop instead of to the last "
     "landing. If you hear that, go back one press and do the sum again."),

    ("Worksheet task 1", 5, "Worksheet task 1, then the slice machine",
     ["Say <b>worksheet tab open, playground shut</b>. This is the first time "
      "the laptops open today.",
      "Read the three slices off the machine out loud: "
      f"<em>{_T1[0]}, {_T1[1]}, {_T1[2]}</em>. They write all three down "
      "before anything runs. Give them ninety seconds.",
      "Level 1. Count hands for A, then B, then C, then D. Tap the option the "
      "room chose. <b>Run stays locked until something is picked.</b> Then "
      "press <b>Run it</b> and watch the landings arrive one at a time.",
      "Read the verdict out loud, and say what each wrong option would have "
      "meant. Every option, not only the right one.",
      "Levels 2 and 3 the same way, faster. They already committed on paper.",
      "Level 4 is new. Count hands properly again.",
      "Level 5 is the one to stop on. <b>Ask before you run it</b>: <em>the "
      "start is 6 and the stop is 2. What comes out?</em> Then run it. "
      "Nothing comes out at all.",
      "Close it: <em>a slice that never lands anywhere is not an error. You "
      "get an empty string, and print shows you a blank line.</em>"],
     ["Five levels. Run is disabled until an option is picked; that lock is "
      "the activity.",
      "This card owns its own arrow keys. Use the buttons on it.",
      "<b>Hand the worksheet out here and nowhere else.</b>",
      "Do not skip the verdict on a level the room got right."],
     "Level 5 is where the room goes quiet. Let the silence sit for three "
     "seconds before you run it."),

    ("Worksheet task 2", 4, "Type it, then change the step",
     ["Say <b>worksheet tab and the playground only</b>. Nothing else open.",
      "Step 1. They type the two lines and run them. Ninety seconds, and "
      "start the timer.",
      "Step 2. Frame it as a want, not a test: <em>I want the letters, not "
      "the digits. Change one number.</em> They write what it will print "
      "first, then run.",
      "Step 3. Frame it as your own idea: <em>I thought a negative step would "
      "read it backwards. Try it and tell me what happens.</em> Do not warn "
      "them.",
      "Let them react before you say anything. There is no error and nothing "
      "printed: just a blank line.",
      "Then the line that makes it stick: <em>Python did exactly what you "
      "asked. Starting at 1 and going backwards, it never reaches 8, so it "
      "lands nowhere.</em>",
      "Hand off: <em>worksheet closed. That is slicing. After the quiz we "
      "start on the methods.</em>"],
     ["Four minutes, timer started by you.",
      "Do not tell them the answer to step 2 before they run it. One changed "
      "number is the whole task.",
      "Step 3 is the one that cannot be cut."],
     "Two or three students will get an error on step 1 from a missing quote "
     "mark. Point at the quote, do not fix it for them."),

    ("Classroom quiz", 5, "Classroom quiz on the portal",
     ["The card is the cue and nothing else. Nothing on it to read out.",
      "Say it plainly: <em>open the learning portal and do the classroom "
      "quiz. Five minutes.</em>",
      "Walk the room while they answer. Do not answer questions about the "
      "quiz itself.",
      "Anyone who finishes early goes back to worksheet task 2 and tries a "
      "step of 3 on the same string.",
      "When the portal shows the spread, say one line about the weakest "
      "question and move on. Do not teach from it here."],
     ["Five minutes. No timer on this card: the portal runs its own clock.",
      "This card is the join. Everything before it is slicing; everything "
      "after it is string methods.",
      "If the room struggled on slicing, cut the replace run later, never the "
      "strip work."],
     "The read you want is the slicing question. Nothing after this card has "
     "been taught yet, so a low score anywhere else means nothing."),

    ("Methods", 5, "Why a string method at all?",
     ["This card is the reason the second half exists. Do not name a method "
      "on it until press 5, and do not hurry: every card after this one is "
      "cheap because this one was not.",
      "Open it as a thing they have all done: <em>you set a PIN on your "
      "phone. Four digits. Before the app saves it, it has to be sure of two "
      "things.</em>",
      "Press 1. The PIN screen, four empty boxes, the keypad. <b>Ask</b>: "
      "<em>the length is easy. How would you check that every character is a "
      "digit?</em> Take answers and write nothing down.",
      f"Press 2. Somebody has typed <b>{P.WHY_BAD}</b>. The box holding the "
      f"letter goes red and the app refuses it. <b>Ask</b>: <em>it said no in "
      "under a second. What did it actually do?</em>",
      "Somebody will say <em>check each one</em>. That is exactly right. Say "
      "so, then press, because what it costs is the argument.",
      f"Press 3. The long way. A loop over the characters, and inside it a "
      "check against every digit. <b>Read line 4 out loud and stop "
      f"halfway.</b> The room will laugh, and that laugh is the card working. "
      f"It prints <b>{P.why_long_out()}</b>, which is the right answer.",
      f"Press 4. The count. <b>{P.why_checks()}</b> comparisons for four "
      f"characters, <b>{P.why_lines()[0]}</b> lines of program. <b>Ask</b>: "
      "<em>every app on your phone checks a PIN. Do you think they all wrote "
      "this?</em>",
      f"Press 5. Two lines. Same answer, {P.why_lines()[1]} lines instead of "
      f"{P.why_lines()[0]}. Then name it: <em>a string method. A job Python "
      "already knows how to do on a string. You write the string, a dot, and "
      "the name of the job.</em>",
      "Hand off: <em>there are five of them today. That was the first.</em>"],
     ["Five presses. The two asks, on press 1 and press 4, are the card. "
      "Without them this is a slide that says methods are shorter.",
      "Do not explain the loop line by line. The point is its length, not its "
      "logic, and they wrote loops last session.",
      "Laptops stay shut from the quiz until worksheet task 3."],
     "If nobody says <em>check each one</em>, ask <em>how would you check one "
     "character</em> first, then <em>and the other three?</em> That gets you "
     "there in two questions."),

    ("Methods", 3, "isdigit: what does this line print?",
     ["Open straight off the card before it: <em>that is the one we just "
      "named. Here it is on its own.</em>",
      "Press 1. Two lines of code and an empty output box. <b>Ask</b>: "
      "<em>what does line 2 print?</em> Wait. Do not explain the method.",
      "Take two answers. Somebody will say a number; somebody will say True.",
      "Press 2. Every character is ticked in turn and the box prints "
      f"<b>{P.isdigit_out(P.ISDIGIT_PIN)}</b>. Say: <em>it looked at every "
      "single one.</em>",
      "Press 3. Now the shape and the sentence. Read both, and then have "
      "somebody in the room say it back in their own words.",
      f"Press 4. The same line with <code>{P.ISDIGIT_BAD}</code>. The last "
      "character is crossed and it prints "
      f"<b>{P.isdigit_out(P.ISDIGIT_BAD)}</b>. <b>Ask first</b> what it will "
      "print.",
      "Hand off: <em>so that one answers a question. The next one hands "
      "something back.</em>"],
     ["Four presses. The ask on press 1 is the card; skip it and this is a "
      "slide with an animation on it.",
      "Press 3 is the only place the definition appears in this session. "
      "There is no deck slide behind it saying the same thing, so read it "
      "properly and make somebody repeat it.",
      "Say <b>every character, not most of them</b>."],
     "Watch for a student saying <em>it checks if it is a number</em>. Ask "
     "about a space, or a minus sign. Neither is a digit."),

    ("strip", 1, "Two numbers that are not equal",
     ["Start from something they have all hit: <em>you paste your phone "
      "number into a form and it says it does not match.</em>",
      "Read both lines out loud, slowly: <em>the first one has a space, then "
      "the number, then a space. The second one is just the number.</em>",
      "<b>Ask before you say anything else</b>: <em>are these two the same or "
      "not?</em> Count the hands for same, then for not the same.",
      f"Then point at the output: <b>{P.DECK_CLAIMS['slide 30'][1]}</b>. "
      "<em>Ten digits, ten digits, and Python says no.</em>",
      "Say why in one sentence, and tie it to the hook: <em>a space is a "
      "character. Twelve characters is not ten characters. Same reason the "
      "search could not find SORRY.</em>",
      "Hand off: <em>so something has to take those off.</em>"],
     ["Count both options aloud before the output is named. Most of the room "
      "says <em>same</em>, and that wrong answer is the whole card."],
     "This is the strongest reaction you will get all session. Let it happen "
     "before you explain it."),

    ("strip", 3, "strip: what does this line print?",
     ["Open from the card before it: <em>so the two strings are not equal. "
      "Somebody has to take those spaces off. That somebody is not you.</em>",
      "Press 1. The line, and an empty output box. <b>Ask</b>: <em>fourteen "
      "characters go in. How many come out?</em> Take a number from the room "
      "before you press.",
      f"Press 2. The four spaces at the two ends fall away and the box prints "
      f"<b>{P.strip_out()}</b>. Count them together: <em>{len(P.STRIP_RAW)} "
      f"in, {len(P.strip_out())} out.</em>",
      "Press 3. The shape and the sentence. Then point at the code and say "
      "the thing that matters: <em>it did not change mobile. It handed back a "
      "new string, and print showed you that one.</em>",
      "Hand off: <em>now the question nothing in the deck answers. Where "
      "exactly does it stop?</em>"],
     ["Three presses, and press 3 is the only definition of strip in this "
      "session.",
      "Take a number before pressing. A room that has committed to <em>ten</em"
      "> watches the count; a room that has not, watches an animation.",
      "Do not say <em>it removes spaces</em>. Say <em>it works in from each "
      "end</em>. The next card turns on that difference."],
     "The answer <em>ten</em> is right for the wrong reason if they think it "
     "removed every space. Ask what would happen to a space in the middle."),

    ("The explainer", 3, "Follow the strip",
     ["Say what it is: <em>the same idea, one character at a time, and you "
      "pick what comes off.</em>",
      "It opens on <code>strip(\"-i\")</code>, which no slide has shown. "
      "<b>Ask</b>: <em>write down what line 3 prints.</em> Give them fifteen "
      "seconds. Do not press anything.",
      "Press <b>One step</b>, not Play. Stop on every step and read the "
      "caption.",
      "The two steps that matter are the two green <em>stop</em> marks. Say "
      "it out loud both times: <em>it stopped. It is not going to look any "
      "further in.</em>",
      "Then the step that is the whole session: the dash in the middle goes "
      "dashed and says <b>never</b>. Say: <em>that dash IS in the list. strip "
      "never got to it, so it stays, and it stays for good.</em>",
      "Now change the set. Press <code>strip(\"-\")</code> and walk it again. "
      "<b>Ask first</b> what changes.",
      "If there is time, press <code>strip()</code> with nothing in it. "
      "Nothing comes off at all, because there are no spaces on the ends.",
      "Hand off: <em>right. Now you do one on your own, before anything "
      "runs.</em>"],
     ["Use <b>One step</b>, never Play, in front of a room. Play is for a "
      "student watching it again later.",
      "This card owns its own arrow keys. Use the buttons.",
      "Three minutes. It is a reveal, not a lesson."],
     "The <b>never</b> mark is the finding. If you say nothing else on this "
     "card, say that one."),

    ("strip", 1, "The dot in the middle stays",
     ["Read the code: <em>M dot Ravi dot, and we strip the full stop.</em>",
      "<b>Ask before you look at the output</b>: <em>how many full stops come "
      "off?</em> Take the answer.",
      f"Then the output: <b>{P.DECK_CLAIMS['slide 35'][1]}</b>. <em>The one "
      "at the end came off. The one in the middle is still there.</em>",
      "Say the rule properly, and slowly, because everything after this rests "
      "on it: <em>strip starts at the left end and comes inwards. The moment "
      "it meets a character that is not in the list, it stops and never looks "
      "again. Then it does the same from the right end.</em>",
      "Hand off: <em>and now watch it happen, one character at a time.</em>"],
     ["Two minutes. This is the single most important card in the second "
      "half.",
      "Say <em>ends inwards</em>, never <em>removes the dots</em>. The "
      "wording matters; the room repeats yours."],
     "If anyone says strip removes every dot, go back to this slide and point "
     "at the dot in the middle of the output."),

    ("strip", 1, "A set of characters, not a word",
     ["Read the line: <em>strip, and inside the brackets a space, a comma and "
      "a full stop.</em>",
      "<b>Ask</b>: <em>is that one thing to remove, or three?</em> Take the "
      "answer. It is three separate characters, in any order.",
      f"Say the output and why: <em>{P.DECK_CLAIMS['slide 36'][1]}. It kept "
      "eating from each end while it kept meeting one of those three.</em>",
      "Hand off: <em>two more methods, and then you write one yourself.</em>"],
     ["Two minutes. Call it a <b>list of characters</b> or a <b>set of "
      "characters</b>, never a word.",
      "The exit question turns on this card. Do not cut it."],
     "The mistake to listen for is <em>it removes the text space comma "
     "stop</em>, as one piece. Ask whether the order inside the brackets "
     "matters. It does not."),

    ("Worksheet task 3", 4, "Trace it before you run it",
     ["Open from the walk: <em>you just watched it stop twice. Now do one "
      "yourself.</em> Say <b>worksheet tab open, playground shut</b>.",
      "Press 1 is the task. Read the program aloud once, line by line, "
      "without saying what any line does.",
      "Say the rule for the table: <em>one row per line. Fill a row only if "
      "that line actually runs.</em>",
      "Start the timer. Four minutes. Walk the rows.",
      "Check-in lines, one at a time: <em>Line 2 first. What comes off?</em> "
      "... <em>Do not skip a row.</em> ... <em>One minute left.</em>",
      "<b>Hands off keyboards first, and wait for it.</b> Then say the check "
      f"out loud, and not before: <em>exactly {len(_BLANKS)} of your "
      f"{P.TASK3_LINES} rows should be empty.</em>",
      "Now walk the answer. Press 2 to press 7, one press each, about five "
      "seconds a press. Say nothing while it moves; read the caption after.",
      "The press to slow down on is line 3. Say it again: <em>the right end "
      "met a 2, which is not a 0, so it stopped.</em>"],
     ["Seven presses. Press 1 is the task; presses 2 to 7 are the answer, one "
      "operation each.",
      "Never say the empty row count before hands are off keyboards. Printed "
      "on the sheet it would be a hint; said now it is a check.",
      "Start the timer yourself."],
     f"The rows that should be blank are {' and '.join(str(n) for n in _BLANKS)}"
     ". A student who filled all seven traced what they thought the program "
     "meant, not what it did."),

    ("replace", 1, "The same mistake in a long document",
     ["One line, then move: <em>the same typo, forty times, in something you "
      "have already written. Nobody is fixing that by hand.</em>",
      "<b>Ask</b> and take one answer: <em>what would you want to be able to "
      "say to Python here?</em>",
      "Hand off: <em>that is a method too. Here it is.</em>"],
     ["Do not turn this into a discussion. It is the setup for the next card.",
      "One answer, then press."],
     "Nothing. If it runs past forty seconds, you are teaching the scene "
     "instead of the method."),

    ("replace", 2, "replace: one of them, or both?",
     ["Press 1. The line, and an empty output box. The word is in the "
      f"sentence <b>{P.replace_hits()}</b> times, and the whole card is one "
      "question: <b>Ask</b> <em>does it fix one of them, or both?</em>",
      "Take a show of hands on each. Do not say which is right.",
      f"Press 2. Both of the wrong words flip, and nothing else on the line "
      f"moves. It prints <b>{P.replace_out()}</b>. Say: <em>both of them. It "
      "goes all the way to the end of the line.</em>",
      "Press 3. The shape, and the one new thing about it: <em>two things in "
      "the brackets now. The one to look for first, the one to put there "
      "second.</em>",
      "Hand off: <em>that one hands back a string. The next one answers a "
      "question instead.</em>"],
     ["Three presses. The hands on press 1 are the card.",
      "Say <b>every one of them</b>, not <em>all of them</em>. The room hears "
      "the first and repeats it.",
      "Point at the three words that did not move. That is the half of the "
      "claim nobody states."],
     "A student may think it changes <code>line</code>. Ask what "
     "<code>print(line)</code> on the next line would show. It would show the "
     "original."),

    ("startswith", 3, "startswith: what does this line print?",
     ["Open from something on their screen right now: <em>look at the "
      "browser. There is a padlock, or there is a warning. Something checked "
      "that address.</em>",
      "Press 1. The line, and an empty output box. <b>Ask</b>: <em>look at "
      "what it prints, not at the address. Is it a string, or is it a yes and "
      "no?</em>",
      f"Press 2. The front of the address lights up, the text it is compared "
      f"with appears under it, and the box prints <b>{P.starts_out()}</b>. "
      f"Say: <em>it read the first {len(P.STARTS_PRE)} characters and "
      "stopped. It never looked at the rest.</em>",
      "Press 3. The shape and the sentence. Then make the pair: <em>strip "
      "and replace hand you a string. isdigit and this one answer a "
      "question.</em>",
      f"<b>Ask</b> without pressing: <em>and with "
      f"<code>{P.STARTS_OTHER}</code>?</em> Wait for "
      f"<b>{P.starts_other()}</b>.",
      "Hand off: <em>now you write the other end of that.</em>"],
     ["Three presses. The ask on press 1 sorts the two kinds of method, and "
      "the exit question needs that sorting.",
      "The address on the card is the one in worksheet task 4, so the room "
      "already has it in front of them.",
      "Hand the worksheet answer to nobody. The next card is theirs."],
     "If somebody answers <em>https</em>, they are reading the argument, not "
     "the output. Point at the output box and ask again."),

    ("Worksheet task 4", 2, "You write this one",
     ["The card behind us checked the <b>front</b>. This one checks the "
      "<b>back</b>, and they write it.",
      "Press 1. The ask, with three empty slots drawn where their lines go. "
      f"Read it: <em>an email id is a Gmail id when it ends with "
      f"{P.TASK4_ENDING}. Write the three lines, then type them in and run "
      "them.</em>",
      "Ninety seconds. Laptops open on the worksheet tab and the playground, "
      "nothing else.",
      "Walk the room. Do not answer <em>is this right</em>; say <em>run "
      "it</em>.",
      "<b>Ask before you press</b>: <em>which one word did you change?</em> "
      "Wait for <b>endswith</b>.",
      f"Press 2. The three lines, and the outputs: <b>{P.task4_out()}</b> for "
      f"the gmail address and <b>{P.task4_other()}</b> for a yahoo one.",
      "Hand off: <em>two of the five answer a question. Here is the easiest "
      "one of the lot.</em>"],
     ["Two presses, and ninety seconds between them.",
      "One word changes. If a student has rewritten the whole thing, that is "
      "fine: ask them to read both lines out and see the one difference."],
     "A student may write <code>endswith(\"gmail.com\")</code> without the "
     "at sign. Ask what <code>rahulgmail.com</code> would do. It would pass, "
     "and it is not an email id."),

    ("upper and lower", 2, "upper, and lower is its mirror",
     ["The easiest card today. Take it fast.",
      "Press 1. Three lines, and an empty output box. <b>Ask</b>: <em>what "
      "does line 2 print?</em>",
      f"Press 2. Every letter turns into its capital, in place, and the box "
      f"prints <b>{P.upper_out()}</b>. Say: <em>name still holds "
      f"{P.UPPER_RAW}. This is a new string, like every other one "
      "today.</em>",
      "Press 3. The shape and the sentence. Then <b>ask before pressing</b>: "
      "<em>so what does line 3 print?</em>",
      f"Press 4. <b>{P.lower_out()}</b>. Same method, the other way round.",
      "Hand off: <em>that is all five. One question, and then we are "
      "done.</em>"],
     ["Four presses, and it should take two minutes.",
      "Take <code>lower</code> from the room on press 3. It is free, and it "
      "is the last thing they answer before the exit."],
     "Nothing much. If a student asks about a digit or a space inside the "
     "string, the answer is that neither changes."),

    ("Exit", 4, "Which one prints nothing?",
     ["This runs whatever else is unfinished. It is the hard floor.",
      "Read the program out loud, by line number. Do not explain it.",
      "Say the question exactly as it is written: <em>for which one of these "
      "does the screen show nothing at all?</em>",
      "Start the timer. Two and a half minutes. Silence while they think.",
      "Count the hands for A, then B, then C, then D. Every option, out loud, "
      "before anything is revealed.",
      "Press <b>Reveal answer</b>.",
      "Explain <b>every</b> option, not only the right one. The three that "
      "print Valid all strip down to the same four digits; the answer is the "
      "one where a dash in the middle was never reached.",
      "Close with the sentence of the day: <em>strip works on the ends. "
      "Always the ends.</em>"],
     ["One question, and it is meant to be hard. Do not add an easier one.",
      "Count all four options aloud before revealing.",
      "Never cut this card."],
     "A big vote for option D means the room thinks strip takes one character "
     "off each end and stops. That is the misconception to open with next "
     "session."),

    ("Closing", 2, "Key takeaways: one string, four slices",
     ["This is the card they photograph, so say that out loud and give them "
      "five seconds at the end of it.",
      "One string at the top with its index row, and four lines under it. All "
      "four are lines the room has already written or run today.",
      "Press 1. <b>" + P.tk_slice()[0][0] + "</b> gives <b>"
      + P.tk_slice()[0][1] + "</b>. Read the reason with it.",
      "Press 2. <b>" + P.tk_slice()[1][0] + "</b> gives <b>"
      + P.tk_slice()[1][1] + "</b>. The step, and the four boxes it lands on.",
      "Press 3. <b>" + P.tk_slice()[2][0] + "</b> gives <b>"
      + P.tk_slice()[2][1] + "</b>. <b>Ask</b> why it stopped, and take the "
      "answer from the room rather than reading it.",
      "Press 4. <b>" + P.tk_slice()[3][0] + "</b> gives <b>nothing at "
      "all</b>. This is machine level 5 again.",
      "Press 5. The two rules, and they are the whole session: <em>the stop "
      "number is never reached</em>, and <em>your own string never "
      "changes</em>. Point at the index row and say the second one again.",
      "Hand off: <em>same thing for the methods.</em>"],
     ["Five presses. Press 3 is the only one with an ask on it; the rest are "
      "read.",
      "Every output on this card came out of Python, not off a slide. If a "
      "student says one is wrong, run it in the playground.",
      "There is no map here on purpose. A map of a slice has no examples on "
      "it, and this is the card they keep."],
     "If the room is quiet on press 3, that is the gap the exit question will "
     "find. Spend the extra twenty seconds here rather than there."),

    ("Closing", 2, "Key takeaways: five methods, five lines",
     ["Six cells, one per press. Each one is a real line with the output it "
      "really gives, and the kind of thing it handed back.",
      "Presses 1 to 5, one method each: "
      + ", ".join(f"<b>{r[0]}</b>" for r in P.tk_methods())
      + ". Read the line, then the output, then the kind.",
      "Do not explain any of them again. They have all been on a card of "
      "their own. This is a list to keep.",
      "Press 6. The split, and it is the one thing no single cell says: "
      f"<b>{P.tk_method_split()[0]}</b> of them answer a question, "
      f"<b>{P.tk_method_split()[1]}</b> hand back a new string, and "
      "<b>not one of them changes the string you started with</b>.",
      "Last thing you say about the content: <em>if you remember one thing, "
      "remember that last line.</em>"],
     ["Six presses, and it is two minutes. Reading five cards you have "
      "already taught is how a session finishes late.",
      "If time is short, go straight to press 6. The split is the part that "
      "is not on any other card.",
      "Tell them to photograph this one and the one before it."],
     "A student may ask where endswith is. It is the one they wrote "
     "themselves, and that is a good moment to say so."),

    ("Closing", 1, "Feedback",
     ["Say where the feedback form is and give them the minute.",
      "Nothing to read off this card."],
     ["The same card in every session."],
     "Nothing."),

    ("Closing", 1, "Thank you",
     ["Close it. One line about what is next, without naming a date.",
      "<em>Practice the slicing questions on the portal before the next "
      "session.</em>"],
     ["Do not promise the next topic by name unless you have the timetable."],
     "Nothing."),
]


BANDS = {
    1: "Checkpoint 1 &middot; 11 min &middot; they can say why a search does "
       "not find a stretched word. If not, hold on the hook's press 2.",
    7: "Checkpoint 2 &middot; 17 min &middot; they can say where a step "
       "lands. If not, run machine levels 1, 2 and 5 only.",
    14: "Checkpoint 3 &middot; 14 min &middot; they can say why a method "
        "beats writing the loop. If not, hold on card 14's press 4 and read "
        "the count out again.",
    17: "Checkpoint 4 &middot; 14 min &middot; they can say where strip "
        "stops. If not, do not go on. Cut cards 19 and 20 instead.",
    22: "Checkpoint 5 &middot; 10 min &middot; they can pick the right "
        "method for a job. If not, cut card 25 to the reveal press.",
    27: "Hard floor &middot; exit at 66 min &middot; the exit question runs "
        "whatever is unfinished. The method board can drop to press 6 alone.",
}

HANDOUT_CARD = 11          # the one card that gives the worksheet out

SHEETS = {11: "task 1", 12: "task 2", 21: "task 3", 25: "task 4"}

# One line per card saying what to drop when the clock is against you. Keyed
# by the card's title, not its number, so inserting a card cannot shift a line
# onto the wrong entry. A card with no line here is one that cannot be
# shortened.
SHORT = {
    "What range(2, 6) hands you": "drop three chips, keep 5 and 6. Those two "
        "are the rule.",
    "The message the search cannot find": "take one answer at press 2 instead "
        "of three. Presses 3 and 4 cannot go.",
    "The plan": "three presses, one line each. It is thirty seconds.",
    "From one character to four": "presses 1, 2, 4 and 5. Press 3 can be "
        "spoken: point at the four boxes instead of framing them.",
    "The one it cannot cut": "ask the question, take one answer, move on.",
    "start, end and step": "name the three numbers and move. The next card "
        "shows them working.",
    "A slice with a step": "walk two landings out loud, then jump to press "
        "6. Press 6 cannot go.",
    "Worksheet task 1, then the slice machine": "sixty seconds to write, and "
        "levels 1, 2 and 5. Level 5 is the one that cannot go.",
    "Type it, then change the step": "drop step 2. Typing it once and the "
        "negative step are the parts they cannot skip.",
    "Why a string method at all?": "presses 1, 2 and 5. Press 3 can be shown "
        "without reading it, but do not cut it: the length IS the argument.",
    "isdigit: what does this line print?": "presses 1, 2 and 3. Press 4 can "
        "be spoken.",
    "Two numbers that are not equal": "count hands once, then show the "
        "output.",
    "strip: what does this line print?": "all three. Press 3 is the only "
        "definition of strip in the session, so it cannot go.",
    "The dot in the middle stays": "this one cannot be shortened. It is the "
        "rule the exit turns on.",
    "Follow the strip": "one set, not three. Keep the one it opens on.",
    "Trace it before you run it": "three minutes to trace, and walk presses 4 "
        "to 7 only.",
    "A set of characters, not a word": "read the line and the output. No ask.",
    "The same mistake in a long document": "say it in one line and press on.",
    "replace: one of them, or both?": "presses 1 and 2. The shape can be "
        "spoken over press 2.",
    "startswith: what does this line print?": "presses 1 and 2, and say the "
        "two kinds out loud. The room needs that pair for the exit.",
    "You write this one": "ninety seconds, then press 2.",
    "upper, and lower is its mirror": "one card for both, and take lower from "
        "the room.",
    "Key takeaways: one string, four slices": "presses 1, 2 and 5. Rows 3 "
        "and 4 are the machine's levels and they have seen them run.",
    "Key takeaways: five methods, five lines": "press 6 on its own. The five "
        "cells are five cards they have already had.",
}


def entry(n, beat, mins, title, flow, do, watch, thumb, total, sheet=None,
          block_mins=None):
    """`mins` is what THIS card costs, not what its block costs. Four cards in
    a row each claiming the block's five minutes is how an instructor loses the
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


def common():
    return """
<section class="g-sec"><h3>Common guidelines</h3>

<h4>The shape of the second half</h4>
<p>The second half opens on the reason it exists, not on a method name. Card 14
is the PIN screen: the long way, with ten comparisons inside a loop, and then
the two lines that replace it. Everything after that card is cheap because that
card was not.</p>
<p>Then <b>every method gets exactly one card</b>, and all five run in the same
rhythm. <b>The line first</b>, with an empty output box and the room saying what
it prints. <b>Then it runs</b>, and the mechanism runs with it. <b>Then the
shape and the sentence</b>, on press 3.</p>
<p><b>There is no definition slide after any of them.</b> The deck has one per
method and the earlier version of this plan showed it, so the room read the
sentence before it was said and heard it again afterwards. Press 3 of the card
is now the only place the definition appears, which means you cannot skip
press 3.</p>
<p>Four deck slides are still in the second half and none of them is a
definition: two numbers that are not equal (card 16), the dot strip keeps
(19), a set rather than a word (20), and the typo in a long document (22).
Those are scenes and examples, and they each set up the card after them.</p>

<h4>Never start a card cold</h4>
<p>Every card opens from something the room already has: the message on the
hook, the program still on their screens, the answer somebody just gave. If a
card feels abrupt, the fix is one sentence at the end of the card
<em>before</em> it.</p>

<h4>Walk it in steps, and check as you go</h4>
<p>Do not deliver a finished explanation. Say one step, then ask the next as a
question. <em>So the space is a character too, right? Good.</em> If the room
does not answer that, you have found the gap for free. Offer doubts often. It
costs four seconds.</p>

<h4>Say it the same way every time</h4>
<p>Three phrasings carry this session, and a room repeats the instructor's
words, not the slide's.</p>
<ul class="brief">
<li><b>The stop is never reached.</b> Not <em>it goes up to the stop</em>.
Say it on the recap, on the pull-out card, on the jump, and on machine level
5.</li>
<li><b>strip works from the ends inwards, and it stops.</b> Not <em>strip
removes the dots</em>. A character in the middle is never even looked at.</li>
<li><b>A method hands you a new string.</b> Not <em>it changes the string</em>.
Point at it every time one appears.</li>
</ul>

<h4>How every vote runs</h4>
<p>Let them think. Read option A and count hands, then B, then C, then D. Every
option gets counted before anything is revealed. Then reveal, and explain
<b>every</b> option, not only the right one. A wrong option nobody explains is
a misconception that goes home with them.</p>

<h4>Picking students</h4>
<p>Call a group, never a name. <em>Back three rows, what did you get?</em>
Rotate the groups so it is not always the front. Never single anyone out for a
wrong answer.</p>

<h4>When nobody answers</h4>
<p>Count ten seconds in your head. Then narrow the question rather than
answering it. <em>Just tell me, is it two characters or four?</em></p>

<h4>Why the worksheet comes before the keyboard</h4>
<p>The playground is where they check, not where they start. A task typed into
the playground first and written down afterwards is a transcript, not a
prediction, and the whole value of the beat is gone. Say <b>write first, run
second</b> every time.</p>

<h4>The laptop rule</h4>
<p>Laptops shut except on a worksheet, playground or quiz beat. The entries say
<em>worksheet tab open</em> on the first step of a task card and <em>worksheet
closed</em> on the card after it, so it gets said at every change.</p>

<h4>Why the worksheet repeats itself</h4>
<p>Task 1 asks for three slices. Task 3 asks for one slice again, at the end of
a trace, after strip has changed the string under it. That is deliberate: task
3 is the check that task 1 stuck, and a student who gets task 1 right and task
3 wrong has learnt the shape without the rule.</p>

<h4>The cut order, if you are behind</h4>
<ul class="brief">
<li>Card 6, the plan, to two presses. Saves 1 min.</li>
<li>Card 11, the machine, to levels 1, 2 and 5. Saves 2 min.</li>
<li>Cards 23 and 24, replace, to one read. Saves 2 min.</li>
<li>Card 30, the second map, to three presses. Saves 1 min.</li>
<li class="hot">Never cut: card 19 and the walk on card 20, the trace on card
21, card 22, or the exit question. They are the session.</li>
</ul>
</section>
"""


def if_they_ask():
    return """
<section class="g-sec"><h3>If they ask</h3>
<ul class="brief">
<li><b>Can I leave the start or the stop out?</b> Yes.
<code>code[::2]</code> means from the beginning to the end, every second one.
Show it if it comes up; do not teach it from the front.</li>
<li><b>Does a negative step work at all?</b> Yes, but the start has to be after
the stop. <code>code[7:0:-2]</code> reads backwards. Today's point is only that
a negative step with a start before the stop lands nowhere.</li>
<li><b>Why does an empty result not give an error?</b> Because an empty string
is a perfectly good string. It has no characters in it, and print shows you a
blank line.</li>
<li><b>Does strip remove characters from the middle?</b> Never. It works in
from each end and stops at the first character it does not recognise.</li>
<li><b>Does the order inside strip's brackets matter?</b> No. It is a set of
characters, not a word. <code>strip(".,")</code> and <code>strip(",.")</code>
do the same thing.</li>
<li><b>What does strip with nothing in the brackets remove?</b> Spaces, and the
other invisible characters like a tab. Not dots, not dashes.</li>
<li><b>Does isdigit say yes to a minus sign, or to a space?</b> No to both.
Every single character has to be a digit.</li>
<li><b>Are the method names case sensitive?</b> Yes. <code>Endswith</code> is
an error. All of them are lower case.</li>
<li><b>Do any of these change my string?</b> No, not one of them. They hand
back a new string and your own is untouched, which is why almost every example
has an equals sign in it.</li>
<li><b>Is there a method for one end only?</b> Yes, <code>lstrip</code> and
<code>rstrip</code>. Mention them and move on.</li>
<li><b>Why does the search really fail on the hook?</b> Because the app is
comparing characters, and <code>"SORRY"</code> is not inside
<code>"S O R R Y"</code>. Run it in the playground if somebody pushes.</li>
</ul>
</section>
"""


def source_defects():
    return """
<section class="g-sec"><h3>Where this plan leaves the deck</h3>
<ul class="brief">
<li class="hot"><b>Slide 56 does not belong to this deck.</b> It reads
<em>Step - 1, Checking System Requirements</em>, with a cogwheel picture, and
it sits between the Practice card and the Feedback card. Nothing in this
session is about system requirements. It looks like a slide pasted in from an
installation deck. It is not in the plan, and the deck owner should delete it
from the .pptx.</li>
<li><b>Slides 12 and 17 are redrawn, not inlined.</b> Both are flat pictures of
a slice that has already happened, so the only thing left to do with them is
read the answer.</li>
<li><b>What the redraws add.</b> The characters are copied out one press at a
time, the end index is drawn as a box that exists and is never reached, and on
the jump the boxes it never landed on go dashed and stay that way. None of
that survives a still picture.</li>
<li><b>Every method now opens on its own line of code, before its slide.</b>
The deck introduces each method definition first and the example second. Turned
round, the room predicts an output and is then handed the sentence that
explains it. The deck's own definition slides are all still here, one card
later.</li>
<li><b>The recap slides, 3 to 9, are out.</b> Seven slides restate last
session. The two recap cards do retrieval instead: the room commits to an
answer before anything is shown.</li>
<li><b>Slide 10, the agenda, is redrawn</b> so it arrives one stop at a time
instead of all at once.</li>
<li><b>The output twins are out: slides 27, 32, 34, 37, 40, 43, 46, 49 and
52.</b> Each is the slide before it with the answer added, so the deck shows
the answer before it has asked the question. The method cards ask first.</li>
<li><b>Slides 45 and 51, endswith and lower, are out on purpose.</b> Both are
mirrors of the method just taught. Card 25 has the room write endswith, and
card 26 takes lower from the room.</li>
<li><b>Every definition slide is out: 26, 31, 39, 42 and 48.</b> Each one
states in the deck's words what the method card beside it has just shown, so
the room read the sentence before it was said and heard it again afterwards.
Press 3 of each method card carries that wording, and it is now the only place
it appears.</li>
<li><b>Slides 53 and 54, Key Takeaways, are replaced by two boards of
examples.</b> Two lists of parallel names are not recallable.</li>
<li>Card 28 is one string and four slices of it, with the output each one
gives. Card 29 is one cell per method, with its real line and what that line
prints. Every value on both came out of Python.</li>
<li><b>Nothing in the deck says why a method is worth having.</b> The
transcript opens the second half on the PIN scenario and then the deck goes
straight to a syntax slide. Card 14 is that scenario: the loop with ten
comparisons in it, and then the two lines that replace it.</li>
<li><b>Nothing in the deck ever states where strip stops.</b> The transcript
shows the instructor explaining it well and at length, from the playground, and
that explanation is on no slide. Cards 19, 20 and 21 put it on the screen,
because it is the one idea the session actually rests on.</li>
</ul>
</section>
"""
