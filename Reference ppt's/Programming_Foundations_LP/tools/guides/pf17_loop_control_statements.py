# -*- coding: utf-8 -*-
"""Instructor guide content for session 17, Loop Control Statements.

Every answer below is computed by importing the build's panels.py, which runs
each program for real. Nothing in an answer table is typed by hand.
"""
import html
import pathlib
import sys

BUILD = pathlib.Path(__file__).resolve().parents[2] / "builds" / "build-17-loop-control"
sys.path.insert(0, str(BUILD))
import panels as P  # noqa: E402


def _esc(s):
    return html.escape(str(s))


def _c(s):
    return f"<code>{_esc(s)}</code>"


def _recap():
    return (f"<p class='small'>It prints {_c(P.recap_show(P.recap_wrong()))}. It should print "
            f"{_c(P.recap_show(P.recap_right()))}. The culprit is line {P.RECAP_CULPRIT}.</p>")


def _task1_table():
    rows = "".join(
        f"<tr><td>{n}</td><td>{a}</td><td>{b}</td><td>{brk}</td>"
        f"<td>{_c(pr) if pr else 'nothing'}</td></tr>"
        for n, (a, b, brk, pr) in enumerate(P.task1_if_rows(), 1))
    return ("<table><tr><th>Row</th><th>a</th><th>b</th><th>break runs?</th>"
            "<th>Line 6 prints</th></tr>" + rows + "</table>"
            f"<p class='small'>Everything it prints: {_c(' / '.join(s.strip() for s in P.task1_out()))}</p>")


def _machine_table():
    """The card shows every why line on its run press, so the guide keeps only
    the answer and the one wrong option worth naming out loud."""
    rows = ""
    for n, lv in enumerate(P.MACHINE, 1):
        right = P.machine_right(lv)
        v, w = next(iter(lv["why"].items()))
        rows += (f"<tr><td>{n}. {_esc(lv['tag'])}</td><td>{'ABCD'[right]}, "
                 f"<b>{_esc(P.machine_result(lv))}</b></td><td><b>{_esc(v)}</b>: {_esc(w)}</td></tr>")
    return ("<table><tr><th>Level</th><th>Answer</th><th>The wrong option to name</th></tr>"
            + rows + "</table>")


def _exit_table():
    right = P.exit_right()
    rows = "".join(
        f"<tr><td>{'ABCD'[i]}{' (answer)' if i == right else ''}</td>"
        f"<td>{_c('marks = ' + repr(v))}</td>"
        f"<td>prints {_esc(P.shown(P.exit_out(v)))}. {_esc(P.EXIT_WHY[tuple(v)])}</td></tr>"
        for i, v in enumerate(P.EXIT_OPTS))
    return ("<table><tr><th>Option</th><th>List</th><th>What happens</th></tr>"
            + rows + "</table>")


NEVER = ", ".join(str(x) for x in P.expl_never())
T3 = {w: P.shown(P.t3_out(w)) for w in P.T3_WORDS}
PLAYED = P.reels_played()
PLAYED_BRK = P.reels_played("break")

META = {
    "title": "Loop Control Statements",
    "duration": "75 minutes",
    "subtitle": "Session 17 &middot; Loop Control Statements &middot; 75 min",
    "out": r"C:\Lesson Plans New\Plans\Programming Foundations\17 - Loop Control Statements\17_loop_control_statements_instructor_guide.html",
}

ITEMS = [
{"kind": "concept", "title": "How to run this session", "html": """
<p>This guide gives you the shape of each beat and the few lines worth saying close to as written. The rest is yours. If you have a better everyday example than the ones here, use it, as long as it really behaves like the word it sets up. The session has one idea: <b>break</b> leaves the loop now, <b>continue</b> skips the rest of this pass and goes back to the top, and <b>pass</b> does nothing. Every card is one of those three from a different side.</p>
<div class="box">
<h3>Five habits that carry the whole session</h3>
<ul>
<li><b>Ask before you tell.</b> Every card has a question that reaches it. Ask it, take two or three answers, then press.</li>
<li><b>Write first, run second.</b> Say it at every task. An output typed before the run is a prediction. The same output typed after is a copy.</li>
<li><b>Read the room out loud.</b> On every vote, go option by option and say roughly what you see. No exact counting.</li>
<li><b>Nudge while they work.</b> Walk the rows and keep talking: are you done? One minute to go. Let us see who finishes first.</li>
<li><b>Call a group, never a name.</b> Back three rows, what did you get? Rotate which part of the room you ask.</li>
</ul>
</div>
<p class="small">The student view has no buttons on screen. Right arrow or the clicker steps every card, F goes full screen, A shows all the cards, End shows the whole card at once.</p>
<p class="small">The worksheet is digital and holds three tasks. It opens at task 1 and stays open for the rest of the session. Laptops stay shut until then. Answers stay in that browser tab only.</p>
<p class="small">Four safe points are marked through the guide. Each one tells you whether to move on or go back. If one fails, the beat after it will not land, so fix it there.</p>
<p class="small">Two words to keep apart all session: say <b>leave the loop</b> for break and <b>skip this pass</b> for continue. Never say "break skips" or "continue stops". If a student mixes them, ask which of the two they mean.</p>
"""},

{"kind": "quiz", "title": "Welcome and recap", "nav": "Welcome and recap", "band": "0 to 6", "html": f"""
<p>Let the room settle and say laptops shut once. It holds until task 1. Then the Recap card, and one line: last session we did nested loops, and you took home a program with a mistake in it. Let us find the mistake.</p>
<p>The recap card is that daily challenge. The range is already fixed, so one line is to blame. Read the program out loud once. The timer on the card starts by itself. Everyone writes down one line number before it ends. Then ask which line, and go line by line with hands up: rough idea only, no counting.</p>
<p>First press shows what it prints, second press marks the line, third shows what it should print.</p>
{_recap()}
<p class="small">If someone names line 2, say that was the other half of last session's challenge: {_c('range(0, n + 1)')} made one row too many. It is fixed here.</p>
<div class="say"><b>Hand off with this:</b> "So a loop can be told where to start. Today we tell a loop when to stop early, and when to skip."</div>
"""},

{"kind": "hook", "title": "Hook, the PIN that keeps asking", "nav": "Hook, the PIN", "band": "6 to 10", "html": """
<p class="hookline">Laptops shut. Nobody types here.</p>
<p><b>What this card is for.</b> The room has used a UPI PIN screen many times. They know a real app stops asking the moment the PIN is right. This card shows an app that does not stop, so the room says what it should do before they have the word for it. The word comes three cards later. Do not say break, loop control or stop early anywhere on this card.</p>
<p><b>Set the story up first, before press 1.</b> Say: "A junior developer built a new payment app. It gives you three tries at your UPI PIN. Let us pay for lunch with it." The junior developer matters. It is why the app is allowed to do something odd, and it stops a student saying "PhonePe does not do that". If one says it anyway, agree: "Right. A good app does not. Let us see what this one does."</p>
<p><b>Press 1, the pay screen.</b> Rs 40 to Ravi Canteen. Point at the three empty try boxes on the right: the app gives three tries. Ask one quick question: "Why only three?" Take one answer. Banks lock UPI for the day after three wrong PINs. That is a real rule, so it is a fair number.</p>
<p><b>Presses 2 and 3.</b> Try 1 is a wrong PIN, two attempts left; keep the pace. Try 2 is right, Rs 40 paid. Pause two seconds: the room thinks the story is over.</p>
<p class="small">If asked what happens after three wrong PINs: the app stops and says try again later. That is the loop ending by itself. The green arrow on press 5 is the other way out.</p>
<div class="say"><b>Press 4 is the turn.</b> The screen asks for the PIN again, try 3 of 3. Stop and ask: "The money is already paid. What is wrong with this app? What should it do?" Take three or four answers before you press on.</div>
<p><b>Answers to expect on press 4, and what to do with each.</b></p>
<ul>
<li>"It should stop asking." Yes. Ask when: the moment the PIN is right.</li>
<li>"It should show the receipt." Yes, and ask what should happen to try 3. You want: it is never asked.</li>
<li>"It will take the money again." Say we do not know, and that is exactly why asking again is dangerous.</li>
<li>"It should ask only once." Take it, then ask what happens when the first PIN is wrong. Three tries is right; asking after the right one is the mistake.</li>
</ul>
<p><b>Press 5, the shape behind the screen.</b> The phone fades and the app is drawn the way the deck draws code: every try, up to 3, ask for the PIN, and if the PIN is right, pay. The green arrow draws itself out of the middle of the loop, past the end, straight to "show the receipt". Try 3 now says never asked. Read it top to bottom once, then trace the green arrow with your hand. Say: "The loop still has a try left, and we leave anyway."</p>
<div class="safe"><b>Safe point 1, try 3.</b> Point at the try 3 box and ask: "In the fixed app, does try 3 ever happen?" You want no, the app leaves before it. If you hear "yes, it happens but nothing is typed", press back to 4 and then 5 again, and point at the arrow leaving before try 3 starts.</div>
"""},

{"kind": "concept", "title": "Name it, then the plan", "nav": "Name it, the plan", "band": "10 to 12", "html": """
<p>Ask what a loop that is told what to do next might be called. Take two guesses, then show the title card. Ten seconds.</p>
<p>The plan comes one stop per press: break, continue, pass. Each stop has one short meaning above it. Read it out and move on. Ten seconds a stop.</p>
<p class="cpnote"><span>Checkpoint 1</span> you should be at 12 minutes here</p>
"""},
{"cp": "Checkpoint 1 &middot; 12 min"},

{"kind": "concept", "title": "Control statements, then break", "nav": "Control statements, break", "band": "12 to 16", "html": """
<p>Slide 14 is redrawn as four small programs, one per press. Each one gets a rail that draws the order its lines run in, and the chips under it spell that order out. Press 1: plain code runs straight down. Press 2: the if runs line 3 and skips 4 and 5, which stay grey. Press 3: the for loop goes back up to line 1 again and again. Press 4, marked today: the same loop, but the green arrow jumps straight from break to the last line.</p>
<div class="say"><b>Say it on press 4:</b> "You already know the first three. Today is the fourth: two words that change a loop from inside it."</div>
<p>Then slide 15, one word on the whole screen: Break. Say the word and let it sit for a second before you move on.</p>
<p>Slide 16 is the shape. Trace the green dashed arrow with your hand: from break, out of the loop, past the lines under it. Tie it back to the hook: that is the green arrow from the PIN screen. Slide 17 is how break is nearly always used, inside an if. Ask: "Why is it inside an if? What happens if it is not?" Take answers and leave the question open. The machine later answers it.</p>
"""},

{"kind": "hook", "title": "Follow the break", "nav": "Follow the break", "band": "16 to 19", "html": f"""
<p>Read the program on the walkthrough card once. Before any press, ask what it prints. Take answers from three parts of the room. Expect {_c('0 1 End')}, {_c('0 1 2 End')} and {_c('0 1')}.</p>
<p>Step it with One step or the right arrow, one line per press. Point at the range strip as it goes: each box the loop takes leaves the strip. When <code>i</code> is 2, the if is True and break runs. The box it stopped on turns red, and every box after it goes dashed and says never. Those are {NEVER}. They are never taken, and they stay dashed to the end.</p>
<div class="say"><b>Say it while the dashed boxes are up:</b> "range had these ready. The loop never took them. break left before it asked for the next one."</div>
<p>Last press: End prints. break leaves the loop, not the program. Then move the slider under the code to 10 and ask for a prediction first: break never runs, every box is taken, and the loop ends by itself. Set it to 0 once: only End prints.</p>
<div class="safe"><b>Safe point 2, what break leaves.</b> Ask: "Does End print? Why?" You want yes, because End is outside the loop. If you hear "no, break stops everything", step back to the break line and forward one press: the next line to run is line 5.</div>
"""},

{"kind": "concept", "title": "Break as the very first line", "nav": "Break comes first", "band": "19 to 21", "html": """
<p>Slides 31 and 32 are now one walkthrough. Before any press, ask what it prints, and have everyone say it at the same moment. Then step it: i is 0, the condition is True, and the very next line is break. The loop ends before print(i) gets a turn. End prints, and lines 4 and 5 go grey: they never ran, not even once.</p>
"""},

{"kind": "concept", "title": "Break works only inside a loop", "nav": "Only inside a loop", "band": "21 to 23", "html": f"""
<p>Slides 33 and 34, redrawn and stepped. Press 1: the break on line 3 starts at the left edge. Ask what it prints. Most of the room will say 0 to 9, then End.</p>
<p>Press 2 marks lines 1 and 2 as inside the loop and line 3 as outside it. Press 3 is the answer: {_c(P.out_break_error())}. Nothing prints, not even 0, because Python checks the whole file before line 1 runs. Press 4 shows continue in the same place: {_c(P.out_cont_error())}.</p>
<div class="say"><b>Say it on press 4:</b> "break and continue work only inside a loop. Outside one, Python will not run the file at all."</div>
"""},

{"kind": "concept", "title": "Break inside a nested loop", "nav": "Break, nested", "band": "23 to 25", "html": """
<p>Slide 35 is the shape: a break in the inner loop leaves the inner loop only. The outer loop carries on. The program for task 1 is on the next card. Do not trace it for them. Say: you trace this one yourselves.</p>
<p class="cpnote"><span>Checkpoint 2</span> you should be at 25 minutes here</p>
"""},
{"cp": "Checkpoint 2 &middot; 25 min"},

{"kind": "activity", "title": "Worksheet task 1, trace it then check it", "nav": "Task 1, trace it", "band": "25 to 33", "html": f"""
<p class="tag">Worksheet task 1</p>
<p>Now say it once: open the worksheet file on your laptop and stay on it. Playground stays shut for this task. Read the four columns out loud so nobody guesses at the task: a, b, does the break run, what line 6 prints. One row each time line {P.TASK1_IF_LINE} runs.</p>
<p>Start the five minute timer and walk the rows. Do not answer questions about the output; ask what <code>a</code> and <code>b</code> are on that row instead.</p>
<div class="act"><b>While they work:</b> "Are you done? One minute to go. Did you fill the last box, everything it prints?" Keyboards off when the timer ends, then wait for it.</div>
<p>Walk the answer with One step. Watch the strip for <code>b</code>: after the break its last boxes go dashed. Then the outer loop takes 1, and all four boxes come back. Stop on that press and ask who expected it.</p>
<p><b>Say the check only now:</b> exactly {len(P.task1_if_rows())} rows are filled, and {P.TASK1_ROWS - len(P.task1_if_rows())} stay empty. Anyone whose output ends after the first {_c('inner : 0')} thought break stopped both loops.</p>
{_task1_table()}
"""},

{"kind": "hands", "title": "Worksheet task 2, type it then take the break out", "nav": "Task 2, no break", "band": "33 to 40", "html": f"""
<p class="tag">Worksheet task 2</p>
<p>The card states the problem: print the first word of a sentence in capitals, {_c(P.FIRST_IN)} gives {_c(P.first_out())}. Ask how a person finds the first word. You want: read letter by letter until the first space. Then ask: once you reach the space, do you keep reading? No. That is the break.</p>
<p>Read the program once. first_word starts empty and gets one letter each pass. Line 4 checks for the space, and line 5 leaves the loop there. Playground open, worksheet beside it. Seven short lines, so allow two minutes to type. Say: write what it prints before every run.</p>
<p>Step 2 is framed as your idea, not a test: "I think the if and the break are not needed. Delete lines {P.FIRST_CUT[0]} and {P.FIRST_CUT[1]} and see." Do not warn them. Let them react to the result before you say anything.</p>
<table><tr><th>Step</th><th>It prints</th></tr>
<tr><td>1, as it is</td><td>{_c(P.first_out())}</td></tr>
<tr><td>2, no if and no break</td><td>{_c(P.first_cut_out())}</td></tr>
<tr><td>3, input {P.FIRST_IN2}</td><td>{_c(P.first_out(P.FIRST_IN2))}</td></tr></table>
<p>Step 2: without the break, the loop does not stop at the space, so every letter joins first_word and the whole sentence comes out in capitals. Step 3: there is no space, so break never runs and the loop ends by itself. Both ways out of a loop in one program.</p>
<p class="small">If someone deletes only line 5, the break, Python gives {_c(P.first_only_break_removed())}. An if with nothing under it. Say: keep that error in mind, the last part of today fixes it.</p>
<p class="cpnote"><span>Checkpoint 3</span> you should be at 40 minutes here</p>
"""},
{"cp": "Checkpoint 3 &middot; 40 min"},

{"kind": "quiz", "title": "Classroom quiz on the portal", "nav": "Classroom quiz", "band": "40 to 46", "html": """
<p>Laptops on the portal. The questions are there, not on the card. Say the rule once: own answer, no talking, no switching tabs. Watch the live spread rather than teaching from it.</p>
<p>Note the two weakest questions and come back to them at the takeaways. If more than half miss a break question, open Follow the break again and step it once before the second half.</p>
"""},

{"kind": "hook", "title": "Hook, a reel you swipe away", "nav": "Hook, the reel", "band": "46 to 50", "html": f"""
<p class="hookline">Laptops shut. Eyes on the screen.</p>
<p>The room knows break now. This card shows the other thing a loop needs, from a screen they use every day.</p>
<p><b>Press 1.</b> Instagram Reels. Reel 1 plays to the end. <b>Press 2.</b> Reel 2 starts, a cooking video. At 0:03 you do not like it. Ask: "What do you do?" Everyone says swipe.</p>
<p><b>Press 3.</b> The swipe. The rest of reel 2 is dashed, never played, and reel 3 starts from 0:00. <b>Press 4.</b> Ask: "Did the feed stop?" No. Then ask: "What would stop the whole feed?" You want: closing the app. That is break, the word they already know.</p>
<div class="say"><b>Press 5, the shape:</b> "Skip the rest of this one, and go back to the top for the next." Trace the orange arrow: it goes back up to the loop, not out of it. That is the one difference from the PIN screen.</div>
"""},

{"kind": "concept", "title": "Continue, the shape", "nav": "Continue, the shape", "band": "50 to 53", "html": """
<p>Slide 57 first: one word, Continue. Say it and pause. Then two deck slides. Slide 58: trace the green arrow with your hand, from continue back up to the loop line. Put it next to break's arrow from slide 16 in words: break goes down and out, continue goes back up. Slide 59 is continue inside an if, the way it is nearly always used.</p>
<div class="safe"><b>Safe point 3, one sentence each.</b> Ask for the difference in one sentence, fingers on the table first so nobody copies. You want: break leaves the loop, continue skips to the next pass. If you hear "they both skip", point at the two arrows again: out, and back up.</div>
"""},

{"kind": "activity", "title": "The break or continue machine", "nav": "The machine", "band": "53 to 58", "html": f"""
<p>Six levels, two presses each. On the first press the program and four outputs are up. Go option by option, hands up, and say roughly what you see. Then press: the output fills one line at a time, the lines that never ran fade, and the why lines explain the wrong options.</p>
<p>Level 2 and level 5 are the two to slow down on. Level 2 is break outside a loop, which they saw at minute 21. Nothing prints at all, because Python checks the whole file before line 1 runs. The code card shakes. If the room gets it wrong, that card did not land: say the rule again. Level 5 is continue before the update in a while loop: it prints 0 and then never stops, because <code>i</code> stays 1 for ever. In the playground that is the moment to press stop.</p>
{_machine_table()}
<div class="safe"><b>Safe point 4, continue in a while loop.</b> Ask: "How do you fix level 5?" You want: put <code>i = i + 1</code> above the continue, so it runs on every pass. If nobody gets it, ask which line never runs once <code>i</code> is 1.</div>
<p class="cpnote"><span>Checkpoint 4</span> you should be at 58 minutes here</p>
"""},
{"cp": "Checkpoint 4 &middot; 58 min"},

{"kind": "concept", "title": "Pass, a block that does nothing", "nav": "Pass", "band": "58 to 61", "html": f"""
<p>Slide 75 first: one word, Pass. Then three deck slides. Slide 76: pass does nothing. Python needs a block after every colon, and pass is a block with nothing in it. Slide 77: the conditions are written, the blocks are not. Ask: "Will this run?" Slide 78: no, Python stops before line 1 with {_c(P.age_empty_error())}. Put pass in each empty block and it runs; that is also the fix for the task 2 error.</p>
"""},

{"kind": "hands", "title": "Worksheet task 3, pass, continue or break", "nav": "Task 3, three words", "band": "61 to 66", "html": f"""
<p class="tag">Worksheet task 3</p>
<p>Slide 84 first, the program with pass inside the loop. Do not read its output aloud. Then the task: type it, input {P.T3_IN}, and change line 4 three times. Predict before every run.</p>
<table><tr><th>Line 4</th><th>It prints</th></tr>
{''.join(f"<tr><td>{_c(w)}</td><td>{_c(T3[w])}</td></tr>" for w in P.T3_WORDS)}</table>
<p>Reveal one word per press. The finding is the first row: pass changes nothing, 3 still prints. Most of the room expects pass to skip, like continue.</p>
<p class="cpnote floor"><span>Hard floor</span> 66 minutes. The exit question runs whatever else is unfinished</p>
"""},
{"cp": "Hard floor &middot; 66 min", "floor": 1},

{"kind": "exit", "title": "Exit question, which list shows nothing", "nav": "Exit question", "band": "66 to 69", "html": f"""
<p>Read the story and the program out loud. Everyone answers. Start the timer. Read option A and ask for hands, then B, C and D, before anything is shown. Rough idea only.</p>
<p>Then press and go through every option, not only the right one. It needs both words at once: continue skips a mark, and break ends the loop before the next one is read.</p>
{_exit_table()}
<p class="small">A big vote for B means the room thinks break takes back what was already printed. A big vote for D is the 35 boundary, not today's topic. The spread is what you open the next session with.</p>
"""},

{"kind": "concept", "title": "Takeaways and close", "nav": "Takeaways and close", "band": "69 to 75", "html": """
<p>Five rows, one press each, every one a real line from today with what it prints. Read the coloured chip, the code, the green result, then the sentence. If the quiz showed a weak question, reopen it here against the row it belongs to.</p>
<p>Then feedback, one minute and anonymous. On the last card, thank them and name one thing the room did well today.</p>
"""},

{"kind": "concept", "title": "If you are running late", "nav": "If you are running late", "html": """
<p>Cut in this order. Each can go without breaking what comes after it.</p>
<ol>
<li><b>Break as the very first line</b>, the walkthrough of slides 31 and 32. Ask for the output, say it in one sentence, and skip the steps.</li>
<li><b>The machine</b> drops to levels 1, 2 and 5.</li>
<li><b>Worksheet task 2</b> drops step 3.</li>
<li><b>The takeaways</b> drop to the first three rows.</li>
</ol>
<p>Never cut Follow the break, worksheet task 1 with its walk, the reel hook, or the exit question. Those are the session.</p>
<div class="box">
<h3>If they ask</h3>
<ul>
<li><b>Can I use break in an if that is not in a loop?</b> No. break and continue need a loop around them, however deep the if is.</li>
<li><b>Does break leave every loop?</b> Only the one it sits in. To leave two loops, the outer loop needs its own break.</li>
<li><b>Is continue the same as an if around the rest of the body?</b> It does the same job. continue says it at the top, so the rest of the body stays at one indent.</li>
<li><b>Why write pass at all?</b> To run and test a program before every block is written.</li>
</ul>
</div>
"""},
]
