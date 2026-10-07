# -*- coding: utf-8 -*-
"""Instructor guide content for session 16, Nested Loops.

Every answer below is computed by importing the build's panels.py, which runs
each program for real. Nothing in an answer table is typed by hand.
"""
import html
import pathlib
import sys

BUILD = pathlib.Path(__file__).resolve().parents[2] / "builds" / "build-16-nested-loops"
sys.path.insert(0, str(BUILD))
import panels as P  # noqa: E402


def _esc(s):
    return html.escape(str(s))


def _task1_table():
    rows = ""
    for n, line in enumerate(P.task1_out(), 1):
        i, j = line.split()
        rows += f"<tr><td>{n}</td><td>{i}</td><td>{j}</td><td><code>{_esc(line)}</code></td></tr>"
    return ("<table><tr><th>Row</th><th>i</th><th>j</th><th>Line 3 prints</th></tr>"
            + rows + "</table>")


def _machine_table():
    rows = ""
    for lv in P.MACHINE:
        right = P.machine_right(lv)
        rows += (f"<tr><td>{lv['tag']}</td><td>{'ABCD'[right]}, "
                 f"<b>{P.machine_answer(lv)}</b></td><td>"
                 + " ".join(f"{v}: {_esc(w)}" for v, w in lv["why"].items())
                 + "</td></tr>")
    return ("<table><tr><th>Level</th><th>Answer</th><th>What each wrong option "
            "was thinking</th></tr>" + rows + "</table>")


def _lines(src, n=P.TRI_N):
    return " / ".join(s.strip() for s in P.tri_out(src, n))


def _exit_table():
    right = P.exit_right()
    rows = "".join(
        f"<tr><td>{'ABCD'[i]}{' (answer)' if i == right else ''}</td>"
        f"<td><code>overs = {v}</code></td><td>{P.exit_lines(v)} lines. "
        f"{_esc(P.EXIT_WHY[v])}</td></tr>"
        for i, v in enumerate(P.EXIT_OPTS))
    return ("<table><tr><th>Option</th><th>Input</th><th>What happens</th></tr>"
            + rows + "</table>")


N_ALL, N_OUTER, N_INNER = P.expl_counts()

META = {
    "title": "Nested Loops",
    "duration": "75 minutes",
    "subtitle": "Session 16 &middot; Nested Loops &middot; 75 min",
    "out": r"C:\Lesson Plans New\Plans\Programming Foundations\16 - Nested Loops\16_nested_loops_instructor_guide.html",
}

ITEMS = [
{"kind": "concept", "title": "How to run this session", "html": f"""
<p>This guide gives you the shape of each beat and the few lines worth saying close to as written. The rest is yours. If you have a better everyday example than cricket for the hook, use it, as long as one count really does restart inside another. The session has one idea: the inner loop runs all the way through on every pass of the outer loop. Every card after the hook is that idea from a different side.</p>
<div class="box">
<h3>Five habits that carry the whole session</h3>
<ul>
<li><b>Ask before you tell.</b> Every card has a question that reaches it. Ask it, take two or three answers, then press.</li>
<li><b>Write first, run second.</b> Say it at every task. A number typed before the run is a prediction. The same number typed after is a copy.</li>
<li><b>Count every option.</b> On every vote, read A and count hands, then B, C and D, before anything is shown. Then explain every option, not only the right one.</li>
<li><b>Nudge while they work.</b> Walk the rows and keep talking: are you done? One minute to go. Let us see who finishes first.</li>
<li><b>Call a group, never a name.</b> Back three rows, what did you get? Rotate which part of the room you ask.</li>
</ul>
</div>
<p class="small">The student view has no buttons on screen. Right arrow or the clicker steps every card, F goes full screen, A shows all the cards, End shows the whole card at once.</p>
<p class="small">The worksheet is digital and holds two tasks. It opens at task 1 and stays open for the rest of the session. Laptops stay shut until then. Answers stay in that browser tab only.</p>
<p class="small">Four safe points are marked through the guide. Each one tells you whether to move on or go back. If one fails, the beat after it will not land, so fix it there.</p>
"""},

{"kind": "quiz", "title": "Welcome and recap", "nav": "Welcome and recap", "band": "0 to 6", "html": """
<p>Let the room settle and say laptops shut once. It holds until task 1. Then the Recap card, and one line: last session we worked with strings, let us see what stayed.</p>
<p>The recap card has three tiles. Read the first one out loud. Everyone says their answer at the same moment, then you turn it over. Rough idea only, no counting of hands. Read the why line on the back every time, because that line is the recap, not the flip.</p>
<p class="small">Tile 2 is the one to slow down on. Most rooms say True for <code>"98.5".isdigit()</code>. The dot is not a digit, so it is False.</p>
<div class="say"><b>Hand off with this:</b> "Keep that in mind. Today we go back to loops, and we put one loop inside another."</div>
"""},

{"kind": "hook", "title": "Hook, the Cricbuzz ball counter", "nav": "Hook, the ball counter", "band": "6 to 11", "html": """
<p class="hookline">Laptops shut. Nobody types here.</p>
<p>Start from what they have. Most of the room has had this screen open during a match. India are batting, and every ball gets a number: 4.1, 4.2, 4.3, 4.4. Read the numbers out loud with them.</p>
<p>Press 2 brings 4.5 and 4.6, and an empty row waits at the top of the feed. Ask what comes next. Take three answers. Someone may say 4.7 as a joke; take it and ask why that is wrong.</p>
<div class="say"><b>Ask, then press:</b> "Why does it say 5.1 and not 4.7?" The answer you want is that an over has only six balls, so the over number goes up and the ball number starts again at 1.</div>
<p>Point at the counter as it turns: the over wheel moves first, then the ball wheel rolls round to 1. That order is the order the code will run in later, so say it out loud: the over changes, then the balls start again.</p>
<p>Then the count. How many balls in a full T20 innings? Let them work it out before you press. Twenty overs, six in each, 120. On the last press the phone fades and the same match is drawn as blocks. Read it in this order: every over, and inside it every ball. Do not name it. The next card does that.</p>
<div class="safe"><b>Safe point 1, why 1 and not 7.</b> Ask the room why the ball number went back to 1. You want: a new over started, so the ball count starts again. If you hear "because it is the rule", ask how many balls were counted in over 5 and how many in over 6.</div>
<p class="small">If a student asks about wides and no balls: those do not get a new ball number. Every ball on this screen is a fair one.</p>
"""},

{"kind": "concept", "title": "Name it, then the plan", "nav": "Name it, the plan", "band": "11 to 13", "html": """
<p>The room has just seen it, so ask what it might be called. Take two guesses, then show the title card. A loop inside a loop is a nested loop. Ten seconds.</p>
<p>The plan comes one stop per press: a loop inside a loop, how it runs, the number triangle they will solve, and common mistakes. Read each stop and the short line above it, nothing more.</p>
<p class="cpnote"><span>Checkpoint 1</span> you should be at 13 minutes here</p>
"""},
{"cp": "Checkpoint 1 &middot; 13 min"},

{"kind": "concept", "title": "The shape, then watch it run", "nav": "The shape", "band": "13 to 17", "html": """
<p>One card, drawn the way the deck draws it. On press 1, ask which blocks repeat. Point at the orange arrow: it goes back to the top loop. Point at the blue arrow: it goes back to the inner loop only.</p>
<p>Press 2 names the outer loop and puts the orange box round everything it repeats: Blocks 1, 2 and 3. Press 3 names the inner loop and puts the blue box round Block 2 only. Block 4 is outside both and runs once.</p>
<p>From press 4 it runs with two items in A and two in B, one block per press. Before press 4, ask how many times Block 2 will run. Then go one press at a time: the token moves to the next block, the caption says why, and one chip fills in the log. Read each caption out loud. When an arrow flashes, point at it: that is the loop going back up. The last press shows the count, Block 2 ran 4 times.</p>
<div class="say"><b>Tie it to the hook:</b> "Block 1 is a new bowler coming on. Block 2 is one ball. Block 3 is the end of the over. Block 4 is the innings ending."</div>
<p class="small">Say outer loop and inner loop every time. Never "the first loop" and "the second loop", because that sounds like two loops one after the other.</p>
"""},

{"kind": "hook", "title": "Follow both loops", "nav": "Follow both loops", "band": "17 to 21", "html": f"""
<p>Read the program on the left of the card once, top to bottom. Then point at the chart: the orange region is the outer loop, the blue region inside it is the inner loop, and the yellow dot is Python.</p>
<p>Before any press, ask how many lines it will print. Take numbers from three parts of the room and say them back. Common answers are 5 and 6. The real answer is {N_ALL}.</p>
<p>Press One step or the right arrow. Each press moves the dot along one arrow, and the caption at the top says what just happened. Read the caption out loud. Three things to point at as they happen:</p>
<ol>
<li>The orange arrow on the left. The dot only goes back up it after the inner loop says False. That is the outer loop moving on.</li>
<li>The chips for <code>b</code>. Each value it takes is crossed out. When <code>a</code> moves on, all of <code>b</code>'s chips come back and <code>b</code> starts again at 7. Under the chips, <code>b</code> reads 7, 8, 7, 8, 7, 8. That row of struck values is the restart.</li>
<li>The pass counters on the chart: outer "pass 2 of 3", inner "pass 1 of 2". The inner counter starts again on every outer pass.</li>
</ol>
<p>On the last press a box shows the count: {N_OUTER} outer lines, {N_INNER} inner lines, and End once. Three passes times two is six.</p>
<p>Then let the room change the sliders. Ask for a new line count before every run. Put <code>n</code> on 0 once: only End prints, and the three boxes inside the loop stay grey. A loop over nothing does nothing.</p>
<div class="safe"><b>Safe point 2, three times two.</b> Ask: "If the inner range were range(7, 10), how many inner lines?" You want 9. If you hear 3 or 5, set stop to 10 on the slider and walk it with End.</div>
<p class="cpnote"><span>Checkpoint 2</span> you should be at 21 minutes here</p>
"""},
{"cp": "Checkpoint 2 &middot; 21 min"},

{"kind": "activity", "title": "Worksheet task 1, trace it then check it", "nav": "Task 1, trace it", "band": "21 to 28", "html": f"""
<p class="tag">Worksheet task 1</p>
<p>Now say it once: open the worksheet file on your laptop and stay on it. Playground stays shut for this task. Read the three columns out loud so nobody guesses at the task: i, j, and what line 3 prints.</p>
<p>What is new here is that the inner range uses <code>i</code>. Say only that much. Start the five minute timer and walk the rows. Do not answer questions about the output; ask what <code>i</code> is on that row instead.</p>
<div class="act"><b>While they work:</b> "Are you done? One minute to go. One row each time line 3 runs, no more." Keyboards off when the timer ends, then wait for it.</div>
<p>Walk the answer one press at a time with One step. The code stays on the left and the strip for <code>j</code> changes length every pass: range(1), then range(2), then range(3). Stop on the press where <code>j</code> goes back to 0 and ask who had that.</p>
<p><b>Say the check only now:</b> exactly {len(P.task1_out())} rows are filled, and {P.TASK1_ROWS - len(P.task1_out())} stay empty. Anyone who filled all {P.TASK1_ROWS} traced what they expected, not what runs.</p>
{_task1_table()}
"""},

{"kind": "activity", "title": "The loop counter machine", "nav": "The machine", "band": "28 to 33", "html": f"""
<p>Four levels, two presses each. On the first press the program and four numbers are up. Count hands for A, B, C and D and say each count out loud. Then press, and the dots fall, a row for each pass of the outer loop.</p>
<p>Read the why lines for the wrong options. Level 3 is the first one where the inner loop does nothing on a pass: range(3, 3) is empty. Level 4 is about indentation: <code>print("done")</code> sits under the outer loop, not the inner one.</p>
{_machine_table()}
<div class="safe"><b>Safe point 3, which loop owns the line.</b> Ask: "Move <code>print("done")</code> one indent right. How many times now?" You want 6. If the room is split, point at the two edges on level 4 and ask which loop each one lines up with.</div>
<p class="cpnote"><span>Checkpoint 3</span> you should be at 33 minutes here</p>
"""},
{"cp": "Checkpoint 3 &middot; 33 min"},

{"kind": "quiz", "title": "Classroom quiz on the portal", "nav": "Classroom quiz", "band": "33 to 39", "html": """
<p>Laptops on the portal. The questions are there, not on the card. Say the rule once: own answer, no talking, no switching tabs. Watch the live spread rather than teaching from it.</p>
<p>Note the two weakest questions and come back to them at the takeaways. If more than half miss a counting question, open the walkthrough card again and walk one slider setting before the second half.</p>
"""},

{"kind": "concept", "title": "The question, then the input and output", "nav": "The question", "band": "39 to 42", "html": """
<p>Three deck slides: the question, the input format, the output format. Read the question slowly. Then ask how many rows for an input of 5, and what the last row is. Point at the note: there is a space after every number, even the last one.</p>
"""},

{"kind": "hands", "title": "Your turn, solve it in the playground", "nav": "Your turn", "band": "42 to 48", "html": """
<p>Playground open. Five minutes on the timer, and every student tries it on their own before anything is shown. Say the one hint on the card once: if you are stuck, write the rows for 3 by hand first and look at what repeats.</p>
<div class="act"><b>While they work:</b> walk the rows and look at what people try. Note two different attempts to name on the next card, without saying whose. "Are you done? One minute to go. Did you run it with 4?"</div>
<p class="small">Expect three kinds of attempt: a string repeated with a star, one print line per row, and a loop with a second loop that nearly works. All three are on the next card.</p>
"""},

{"kind": "hook", "title": "Why a loop inside a loop? The approaches", "nav": "The approaches", "band": "48 to 52", "html": f"""
<p class="hookline">Keyboards off. Eyes on the screen.</p>
<p>This card is the approaches the room just tried, on the practice page they use. Say that out loud: some of you did this.</p>
<p>Press 2 is last session's trick, a string repeated. It runs, and it prints <code>{_esc(' / '.join(s.strip() for s in P.why_try_out()))}</code> instead of <code>{_esc(' / '.join(s.strip() for s in P.why_want(3)))}</code>. Ask why. Repeating repeats the same thing, and each row here is a count.</p>
<p>Press 3 is one print line per row. It passes for 3 and fails for 4. Press 4 is the cost for an input of {P.WHY_BIG}: {P.why_big_lines()} print lines and {P.why_big_numbers():,} numbers typed by hand.</p>
<div class="say"><b>Then press 5:</b> "Every row is its own count, 1 up to the row number. So one loop for the rows, and inside it, a loop that builds one row."</div>
<p class="cpnote"><span>Checkpoint 4</span> you should be at 52 minutes here</p>
"""},
{"cp": "Checkpoint 4 &middot; 52 min"},

{"kind": "concept", "title": "The code, written line by line", "nav": "The code, line by line", "band": "52 to 57", "html": f"""
<p>This is you writing the solution in front of them. One press per line, and each line has one sentence under it. Before each press, ask what the next line should be. Take one answer, then press.</p>
<p>Two moments to slow down on. Line 3, <code>row_out = ""</code>: ask why it sits inside the outer loop. Because every row starts empty. Line 6, <code>print(row_out)</code>: ask why it is not under the inner loop. Because we print the row once it is built.</p>
<p>The last press prints it for 3: <code>{_esc(_lines(P.TRI_SRC))}</code>. If you prefer, type it in the playground at the same time; the card is there so the back rows can read it.</p>
"""},

{"kind": "activity", "title": "Worksheet task 2, two mistakes", "nav": "Task 2, two mistakes", "band": "57 to 63", "html": f"""
<p class="tag">Worksheet task 2</p>
<p>Worksheet open. Two programs, each the solution with one line changed. Both get the input 3. They type what each prints first, then run both. Four minutes.</p>
<p>Press 2 shows program A. It prints <code>{_esc(_lines(P.MISTAKE_A))}</code>, and a dashed row appears where the third row should be. <code>range(1, num)</code> stops before num. Press 3 shows program B. It prints <code>{_esc(_lines(P.MISTAKE_B))}</code>: <code>range(row_num)</code> starts at 0. Press 4 shows both fixes.</p>
<p>Then deck slide 36, which is program A in the deck's own words. One sentence on it and move on.</p>
<div class="safe"><b>Safe point 4, start and stop.</b> Ask: "What does <code>range(1, 4)</code> give?" You want 1, 2, 3. If anyone says 1 to 4, write the four numbers on the board and cross out the 4.</div>
"""},

{"kind": "activity", "title": "Any loop inside any loop, a poll", "nav": "Any loop, a poll", "band": "63 to 67", "html": f"""
<p>One sentence first: a for loop can sit inside a while loop, a while inside a for, and a while inside a while. The shape does not change. Then three programs, two presses each. Count hands for every option before you press.</p>
{''.join(f"<p><b>{_esc(lv['tag'].capitalize())}:</b> <b>{P.poll_answer(lv)}</b> stars.</p>" for lv in P.POLL)}
<p>The third one is the finding. It prints <b>{P.poll_answer(P.POLL[2])}</b>, not 6, because <code>j = 0</code> is outside the outer loop. After the first pass <code>j</code> stays 2, so the inner while never runs again.</p>
<div class="say"><b>Say it plainly:</b> "A for loop starts again by itself. A while loop starts again only if you reset its counter."</div>
<p class="cpnote floor"><span>Hard floor</span> 67 minutes. The exit question runs whatever else is unfinished</p>
"""},
{"cp": "Hard floor &middot; 67 min", "floor": 1},

{"kind": "exit", "title": "Exit question, which input prints 12 lines", "nav": "Exit question", "band": "67 to 71", "html": f"""
<p>Read the story line and the program out loud. Everyone answers. Start the timer. Read option A and count hands, then B, C and D, and count every option before anything is shown.</p>
<p>Then press and go through every option, not only the right one. It needs two steps together: range stops before its stop number, and the inner loop runs six times for each over.</p>
{_exit_table()}
<p class="small">The spread on this one is what you open the next session with.</p>
"""},

{"kind": "concept", "title": "Takeaways and close", "nav": "Takeaways and close", "band": "71 to 75", "html": """
<p>Six cards, one press each. Each card is a real example from today with what it gives. Read the coloured heading, then the code, then the green result, then the sentence. If the quiz showed a weak question, reopen it here against the row it belongs to.</p>
<p>Then feedback, one minute and anonymous. On the last card, thank them and name one thing the room did well today.</p>
"""},

{"kind": "concept", "title": "If you are running late", "nav": "If you are running late", "html": """
<p>Cut in this order. Each can go without breaking what comes after it.</p>
<ol>
<li><b>The machine</b> drops to levels 1 and 4.</li>
<li><b>The poll</b> drops to the third program only. It is the one with the finding.</li>
<li><b>The question slides</b> drop to the first one.</li>
<li><b>The takeaways</b> drop to three cards: the restart, the count, the triangle.</li>
</ol>
<p>Never cut the walkthrough, worksheet task 1 with its walk, the five minute attempt with the code after it, or the exit question. Those are the session.</p>
<div class="box">
<h3>If they ask</h3>
<ul>
<li><b>Can a loop go three deep?</b> Yes. The same rule holds at every level, and the counts multiply.</li>
<li><b>Can the inner and outer loop use the same variable name?</b> They can, but the inner one overwrites it. Use different names.</li>
<li><b>Does the inner loop remember where it stopped?</b> A for loop does not: every pass of the outer loop starts it again. A while loop keeps whatever its counter holds, which is why you reset it.</li>
<li><b>Is a nested loop slow?</b> It does outer times inner steps, so for large numbers it can be. That comes up again in a later course.</li>
</ul>
</div>
"""},
]
