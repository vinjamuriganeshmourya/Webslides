# -*- coding: utf-8 -*-
"""Instructor guide content for session 18, Comparing Strings & Naming Variables.

Every answer below is computed by importing the build's panels.py, which runs
each program for real. Nothing in an answer table is typed by hand.
"""
import html
import pathlib
import sys

BUILD = pathlib.Path(__file__).resolve().parents[2] / "builds" / "build-18-strings-naming"
sys.path.insert(0, str(BUILD))
import panels as P  # noqa: E402


def _esc(s):
    return html.escape(str(s))


def _c(s):
    return f"<code>{_esc(s)}</code>"


def _recap_table():
    rows = "".join(f"<tr><td>{_c(w)}</td><td>{_c(P.recap_out(w))}</td>"
                   f"<td>{_esc(P.RECAP_WHY[w])}</td></tr>" for w in P.RECAP_WORDS)
    return ("<table><tr><th>Line 3</th><th>It prints</th><th>Why</th></tr>"
            + rows + "</table>")


def _task1_table():
    rows = "".join(f"<tr><td>{k}</td><td>{_c(src.splitlines()[-1].strip())}</td>"
                   f"<td>{_c(' '.join(P.t1_out(k - 1)))}</td></tr>"
                   for k, (_key, src) in enumerate(P.T1, 1))
    return ("<table><tr><th>Program</th><th>Last line</th><th>It prints</th></tr>"
            + rows + "</table>")


def _machine_table():
    rows = ""
    for k, lv in enumerate(P.MACHINE, 1):
        st = P.compare_walk(lv["a"], lv["b"])
        rows += (f"<tr><td>{k}. {_esc(lv['tag'])}</td>"
                 f"<td>{_c(P.cmp_src(lv['a'], lv['op'], lv['b']))}</td>"
                 f"<td><b>{P.machine_answer(lv)}</b> ({len(st)} "
                 f"{'press' if len(st) == 1 else 'presses'})</td>"
                 f"<td>{_esc(lv['trap'])}</td></tr>")
    return ("<table><tr><th>Level</th><th>Line</th><th>Answer</th><th>What the room will say</th></tr>"
            + rows + "</table>")


def _expl_table():
    a, op, _b = P.EXPL
    rows = ""
    for w in P.EXPL_WORDS:
        st = P.compare_walk(a, w)
        rows += (f"<tr><td>{_c(w)}</td><td><b>{P.walk_says(a, op, w)}</b></td>"
                 f"<td>{len(st)}</td></tr>")
    return ("<table><tr><th>Second word</th><th>BAD &gt;= it</th><th>Pairs looked at</th></tr>"
            + rows + "</table>")


def _classify_table():
    rows = "".join(f"<tr><td>{_c(n)}</td><td>{'accepts' if ok else '<b>refuses</b>'}</td>"
                   f"<td>{_esc(w)}</td></tr>" for n, ok, w in P.classify_rows())
    return ("<table><tr><th>Name</th><th>Python</th><th>Why</th></tr>" + rows + "</table>")


def _exit_table():
    right = P.exit_right()
    rows = "".join(
        f"<tr><td>{'ABCD'[i]}{' (answer)' if i == right else ''}</td><td>{_c(v)}</td>"
        f"<td>prints {_esc(' '.join(P.exit_out(v)) or 'nothing')}. {_esc(P.EXIT_WHY[v])}</td></tr>"
        for i, v in enumerate(P.EXIT_OPTS))
    return ("<table><tr><th>Option</th><th>Name</th><th>What happens</th></tr>"
            + rows + "</table>")


PAIRS = P.hook_pairs()
S_SAVED, S_TYPED = PAIRS[0][2], PAIRS[0][3]
U = [ord(c) for c in "Az1*"]      # the four characters on the Unicode card
T4_ERR = P.t4_error()
T4_BAD = ", ".join(map(str, P.t4_bad_lines()))
T4_OUT = " ".join(P.t4_fixed_out())

META = {
    "title": "Comparing Strings &amp; Naming Variables",
    "duration": "75 minutes",
    "subtitle": "Session 18 &middot; Comparing Strings &amp; Naming Variables &middot; 75 min",
    "out": r"C:\Lesson Plans New\Plans\Programming Foundations\18 - Comparing Strings & Naming Variables\18_comparing_strings_naming_variables_instructor_guide.html",
}

ITEMS = [
{"kind": "concept", "title": "How to run this session", "html": """
<p>This guide gives you the shape of each beat and the few lines worth saying close to as written. The rest is yours. The session has two halves joined by the classroom quiz. The first half has one idea: <b>every character is stored as a number, and Python compares strings by those numbers, one pair of letters at a time</b>. The first pair that is different decides. The second half is <b>four rules for a variable name, and snake_case</b>.</p>
<div class="box">
<h3>Five habits that carry the whole session</h3>
<ul>
<li><b>Ask before you tell.</b> Every card has a question that reaches it. Ask it, take two or three answers, then press.</li>
<li><b>Write first, run second.</b> Say it at every task. A guess typed before the run is a prediction. The same thing typed after is a copy.</li>
<li><b>Read the room out loud.</b> On every vote, go option by option and say roughly what you see. No exact counting.</li>
<li><b>Nudge while they work.</b> Walk the rows and keep talking: are you done? One minute to go.</li>
<li><b>Call a group, never a name.</b> Back three rows, what did you get? Rotate which part of the room you ask.</li>
</ul>
</div>
<p class="small">The student view has no buttons on screen. Right arrow or the clicker steps every card, F goes full screen, A shows all the cards, End shows the whole card at once. On the Follow the pointer card, drag the slider with the mouse; the arrow keys still step the card.</p>
<p class="small">The worksheet is digital and holds four tasks. It opens at task 1 and stays open for the rest of the session. Laptops stay shut until then. Answers stay in that browser tab only.</p>
<p class="small">Every concept card is a short story between <b>Anu</b>, a student, and her <b>computer</b>. Anu asks in plain words; the computer answers in numbers. Read Anu's bubble in her voice as a question to the room, pause, then press for the computer's reply. The computer frowns when it refuses a name.</p>
<p class="small">Four safe points are marked through the guide. Each one tells you whether to move on or go back.</p>
"""},

{"kind": "quiz", "title": "Welcome and recap", "nav": "Welcome and recap", "band": "0 to 6", "html": f"""
<p>Say laptops shut once; it holds until task 1. Then the Recap card: last session we had three words that change a loop from inside it.</p>
<p>The recap card is one program from last session. Line 3 is blank, and it fills one word at a time. Seven presses.</p>
<ul>
<li><b>Press 1.</b> The program, line 3 empty, three dashed boxes. Read it out loud once.</li>
<li><b>Press 2.</b> Line 3 becomes break. Ask: "What does it print?" Everyone says it out loud at once. Take two answers.</li>
<li><b>Press 3.</b> The output drops into the first box, with one line on why.</li>
<li><b>Presses 4 and 5.</b> The same with continue.</li>
<li><b>Presses 6 and 7.</b> The same with pass. All three outputs stay side by side at the end.</li>
</ul>
{_recap_table()}
<p class="small">The mix-up to listen for is continue and pass. If someone says pass skips 2, point at the third box: pass does nothing, so 2 still prints.</p>
<div class="say"><b>Hand off with this:</b> "So far every loop we wrote worked with numbers. Today, letters."</div>
"""},

{"kind": "hook", "title": "Hook, the password that says wrong", "nav": "Hook, the password", "band": "6 to 10", "html": f"""
<p class="hookline">Laptops shut. Nobody types here.</p>
<p><b>What this card is for.</b> Everyone has typed a right password and been told it is wrong, because Caps Lock was on. The room already knows capital and small letters are different to a computer. This card asks why, and its last press shows the answer: every letter is stored as a number. Do not say Unicode, ord or comparing strings on this card. The names come later.</p>
<p><b>Set it up before press 1.</b> Say: "Sunny's laptop password is {P.HOOK_SAVED}. Sunny types it every morning without looking."</p>
<p><b>Press 1, the sign-in screen.</b> Nine dots. The small green light on Caps Lock is there; do not mention it. <b>Press 2</b> is the real Windows message: "The password is incorrect. Try again."</p>
<div class="say"><b>Ask on press 2:</b> "Sunny pressed the right keys in the right order. Why is it wrong?" Take three or four answers before you press on.</div>
<p><b>Answers to expect on press 2, and what to do with each.</b></p>
<ul>
<li>"Caps Lock is on." Yes. Ask the next question straight away: so what? The letters are the same letters.</li>
<li>"Passwords are case sensitive." Yes. Ask what that means to the laptop: why would S and s be different things?</li>
<li>"The laptop sees capitals as different." Keep this one, it is the answer. Ask: different how?</li>
</ul>
<p><b>Press 3, show the password.</b> Tapping the eye shows {_c(P.HOOK_TYPED)}, and Windows says Caps Lock is on. The two passwords drop into rows below: saved and typed.</p>
<p><b>Press 4, side by side.</b> Ask: "Which letters are different?" Let the room call it out. The five letters are marked not equal. The @ and the digits stay the same, because Caps Lock does not change them.</p>
<p><b>Press 5, the numbers.</b> Under every tile, the number the computer stores, and point 5 on the right grows bigger while the other four fade. Read point 5 out loud slowly: every letter is stored as a number. Then point at the first pair: saved s is {S_SAVED}, typed S is {S_TYPED}. The @ is 64 in both rows.</p>
<div class="safe"><b>Safe point 1, same letter?</b> Ask: "To the laptop, are s and S the same?" You want no, they are two different numbers. If you hear "yes, it is the same letter", point at {S_SAVED} and {S_TYPED} and ask which number is bigger.</div>
"""},

{"kind": "concept", "title": "Name it, then the plan", "nav": "Name it, the plan", "band": "10 to 12", "html": """
<p>Ask: "If a computer checks two words letter by letter like this, what would you call that?" Take two guesses, then show the title card. The agenda comes one stop per press. Ten seconds a stop.</p>
<p class="cpnote"><span>Checkpoint 1</span> you should be at 12 minutes here</p>
"""},
{"cp": "Checkpoint 1 &middot; 12 min"},

{"kind": "concept", "title": "Every character is a number, ord and chr", "nav": "ord and chr", "band": "12 to 16", "html": """
<p><b>Unicode, five presses.</b> Anu presses A; the computer keeps it as {a}. Then small z is {z}, and on press 4, 1 is {one} and * is {star}. Pause on 1: the character 1 is {one}, not 1. Say it twice. Press 5 names it: this number is the character's Unicode value.</p>
<p><b>ord, five presses.</b> Press 1, Anu asks for the number of A. Press 2, the code and the ord box. Press 3, A goes in and 65 comes out, in the box and in Output. <b>Press 4 is a guess:</b> ord of small a. Everyone says a number before press 5 shows 97.</p>
<p><b>chr, four presses.</b> The same machine, the other way. Press 2: 75 goes in, K comes out. <b>Press 3 is a guess:</b> {c2}. Press 4: small d, and the line under it.</p>
<div class="say"><b>Say it once:</b> "ord goes from the letter to the number. chr goes from the number back to the letter."</div>
""".format(a=_c(U[0]), z=_c(U[1]), one=_c(U[2]), star=_c(U[3]), c2=_c('chr(100)'))},

{"kind": "concept", "title": "The ranges, and a loop that prints letters", "nav": "The ranges", "band": "16 to 19", "html": """
<p><b>The ranges, four presses,</b> one row each: digits 48 to 57, capitals 65 to 90, small letters 97 to 122. On press 4, everything else: @, the rupee sign {rs}, Telugu {te} and Tamil {ta}. Ask one question after press 3: "Which is bigger, capital Z or small a?" Z is 90, small a is 97. Every small letter is bigger than every capital. The machine turns on this later.</p>
<p><b>The loop, five presses.</b> Press 1, Anu asks for A to Z. Presses 2 to 4: 65, 66, 67 go through chr and A, B, C land in Output, and each old value is struck through in the variable box. Press 5 jumps to 90, Z. Say: the 91 is there because range stops one before.</p>
""".format(rs=_c(ord("₹")), te=_c(ord("అ")), ta=_c(ord("அ")))},

{"kind": "hands", "title": "Worksheet task 1, predict the letters then run", "nav": "Task 1, predict", "band": "19 to 25", "html": f"""
<p class="tag">Worksheet task 1</p>
<p>Now say it once: open the worksheet file on your laptop and keep it open for the rest of the session. Playground open beside it. Three tiny programs. For each one, type a guess first, then type the program, run it, and type what it really printed. Five minute timer.</p>
<div class="act"><b>While they work:</b> "Did you type your guess before you ran it? Program 3 is the one to think about."</div>
<p>Then reveal one program per press.</p>
{_task1_table()}
<p>Program 3 is the finding: a small letter is always 32 more than its capital, so subtracting 32 turns g into G. Ask who guessed G before they ran it.</p>
<p class="cpnote"><span>Checkpoint 2</span> you should be at 25 minutes here</p>
"""},
{"cp": "Checkpoint 2 &middot; 25 min"},

{"kind": "concept", "title": "Python compares letter by letter", "nav": "Letter by letter", "band": "25 to 27", "html": """
<p>Three presses. Press 1: Anu asks if BAD is bigger than or equal to BAT. Press 2: the numbers appear under every letter. Press 3: the first pair is circled and the arrow runs left to right. Do not answer the question. The next card does.</p>
"""},

{"kind": "hook", "title": "Follow the pointer", "nav": "Follow the pointer", "band": "27 to 31", "html": f"""
<p>The first word is slide 19's own example, {_c('"BAD" >= "BAT"')}. Before any press, ask: True or False? Everyone says it out loud at once.</p>
<p>Step it with One step or the right arrow. Press 2 shows the numbers and looks at the first pair: B and B, 66 and 66, the same, move on. Press 3: A and A, the same. Press 4: D and T, 68 and 84, different, so this pair decides. Is 68 more than or equal to 84? No. False.</p>
<div class="say"><b>Say it on the last press:</b> "Python stops at the first pair that is different. That one pair decides."</div>
<p>Now drag the slider to CAT. Ask first, then step. B and C are different on the very first pair, so it decides there. A, D, A and T turn grey and stay grey: Python never looked at them. That grey is the finding. Then BA: two pairs match, then BA has nothing left, and the shorter one is smaller. Only if there is time, BAC and bad.</p>
{_expl_table()}
<div class="safe"><b>Safe point 2, what decides.</b> Ask: "For BAD and CAT, which letters did Python look at?" You want only B and C. If you hear "all of them", set the slider back to CAT and step again, and point at the grey tiles.</div>
"""},

{"kind": "activity", "title": "Worksheet task 2, the comparison machine", "nav": "Task 2, the machine", "band": "31 to 39", "html": f"""
<p class="tag">Worksheet task 2</p>
<p>Say: task 2 on your worksheet. Six lines. Tap True or False for each, all six, before I show the first level. No running them. Give ninety seconds.</p>
<p>Then level by level. On the first press the line is up and nothing is compared. Read it, then ask for hands: True, then False. Press: the numbers appear and one pair is looked at per press, the same as Follow the pointer. On the deciding press the right option stays lit and one line says what most people guessed.</p>
{_machine_table()}
<p>Slow down on level 2 and level 4. Level 2: "Zebra" is less than "apple" because every capital is smaller than every small letter. It is not the alphabet. Level 4: "98" and "123" are in quotes, so they are strings. Python compares 9 with 1 and never looks further.</p>
<div class="safe"><b>Safe point 3, level 6.</b> Before its first press, ask: "Nothing is different. Can a comparison still be True?" After it, you want: yes, when one string runs out, the shorter one is smaller. If the room is lost, go back to Follow the pointer and set the slider to BA.</div>
<p class="cpnote"><span>Checkpoint 3</span> you should be at 39 minutes here</p>
"""},
{"cp": "Checkpoint 3 &middot; 39 min"},

{"kind": "quiz", "title": "Classroom quiz on the portal", "nav": "Classroom quiz", "band": "39 to 45", "html": """
<p>Laptops on the portal. The questions are there, not on the card. Say the rule once: own answer, no talking, no switching tabs. Watch the live spread rather than teaching from it.</p>
<p>Note the two weakest questions and come back to them at the takeaways. If more than half miss a string comparison question, open the machine at level 2 before the second half.</p>
"""},

{"kind": "hook", "title": "Hook, the username Instagram refuses", "nav": "Hook, the username", "band": "45 to 49", "html": """
<p class="hookline">Laptops shut. Eyes on the screen.</p>
<p><b>What this card is for.</b> Everyone has picked an Instagram username, and many have been refused. They already know a name can have rules. This card shows that Python has rules for variable names too, and that Python's rules are stricter. Do not say naming variables. The next slide says it.</p>
<p><b>Press 1.</b> The Instagram sign-up screen, "Create a username". ravi kumar is refused: "Usernames can only use letters, numbers, underscores and periods." Ask: "Why?" You want: the space.</p>
<p><b>Press 2.</b> ravi@kumar is refused too. Ask: "So what is allowed?" Let the room list it from the message: letters, numbers, underscores and periods.</p>
<p><b>Press 3.</b> ravi_kumar works: the green tick, Next turns blue.</p>
<p><b>Press 4.</b> The phone fades back and two Python lines come in, each run for real. {sp} is refused, {ok} is fine.</p>
<div class="say"><b>Ask on press 5:</b> "Instagram lets you start a username with a number. Does Python?" Take hands. Then press: {bad} is refused.</div>
<p class="small">If someone says "Python allows the same things", ask about the period: Instagram allows it, Python does not. It comes back in task 3.</p>
<p>Then slide 25, one line on the whole screen: Naming Variables. Say it and let it sit for a second.</p>
""".format(sp=_c("ravi kumar = 18"), ok=_c("ravi_kumar = 18"), bad=_c("1ravi = 18"))},

{"kind": "concept", "title": "Four rules for a variable name", "nav": "Four rules", "band": "49 to 55", "html": """
<p>One card, eight presses, two per rule. On the first press the rule appears and Anu shows her box names with no stamps. <b>Ask: "Which of these does the computer refuse?"</b> Take hands. The next press stamps each name, and the computer says why it refused one.</p>
<ul>
<li><b>Rule 1.</b> Only letters, digits and underscore. All four names pass.</li>
<li><b>Rule 2.</b> No spaces, commas or special characters. read, write &amp; learn is refused. Tie it back to ravi kumar from the hook.</li>
<li><b>Rule 3.</b> Begin with a letter or underscore. 1_player is refused. This is 1ravi.</li>
<li><b>Rule 4.</b> Not a keyword. while is refused. Point at _if: it passes, because _if is not if.</li>
</ul>
<p><b>Keywords, three presses.</b> Press 1: all 35 keywords, locked. Press 2: the ones the room already knows light up. Press 3: help("keywords"), to type in the playground when they need the list. Point at True, False and None: the only keywords with a capital.</p>
"""},

{"kind": "activity", "title": "Worksheet task 3, does Python accept this name", "nav": "Task 3, accept or refuse", "band": "55 to 59", "html": f"""
<p class="tag">Worksheet task 3</p>
<p>Say: task 3. Eight names. Tap Accepts or Refuses for every one before we check. One minute.</p>
<p>Then one name per press. Before each press, ask for hands: accepts, then refuses. The name leaves the top row and lands in its bin with the reason.</p>
{_classify_table()}
<div class="safe"><b>Safe point 4, While.</b> Before its press, ask for hands. Many will say refuses, because while is a keyword. You want: accepts, because keywords are small and While has a capital W. If most of the room got it wrong, say: Python is exact about capitals, the same as the password this morning.</div>
<p class="small">total.bill is the Instagram trap: the period that Instagram allows and Python refuses.</p>
<p class="cpnote"><span>Checkpoint 4</span> you should be at 59 minutes here</p>
"""},
{"cp": "Checkpoint 4 &middot; 59 min"},

{"kind": "concept", "title": "Case styles, Python uses snake case", "nav": "Case styles", "band": "59 to 61", "html": """
<p>Four presses. Press 1: Anu wants to call her box Total Bill, and the computer refuses the space. Ask: "How would you write it as one word?" Then one style per press: camel case totalBill, Pascal case TotalBill, snake case total_bill. On press 4 the other two fade: in Python we use snake case.</p>
"""},

{"kind": "activity", "title": "Pick the best name", "nav": "Best name", "band": "61 to 63", "html": f"""
<p>Three presses. Press 1: Anu wants to store the sum of even numbers. Four options. Hands for each. Press 2: all four are allowed. Say it: the rules are not the question here. Ask one group that picked {_c(P.BEST)} why. You want: it says what it holds, and it is snake case. Press 3: the star, and one line on each of the other three.</p>
"""},

{"kind": "hands", "title": "Worksheet task 4, fix the names then run", "nav": "Task 4, fix the names", "band": "63 to 67", "html": f"""
<p class="tag">Worksheet task 4</p>
<p>The program adds two prices. It has bad names. First, without running it, type the line numbers that have a bad name, and what Python will say. Then run it, and fix every name in snake case until it prints. Four minute timer.</p>
<table><tr><th>Press</th><th>What it shows</th></tr>
<tr><td>2, Python says</td><td>{_c(T4_ERR)}</td></tr>
<tr><td>3, the lines with a bad name</td><td>{T4_BAD}</td></tr>
<tr><td>4, after the fix, it prints</td><td>{_c(T4_OUT)}</td></tr></table>
<p>The finding: Python reports only the first bad line. Students who fix line 1 and run again meet line 2, then line 3. Line 4 has no bad name of its own: {_c('total-bill')} there reads as total minus bill, so it breaks only because line 3 did.</p>
<p class="cpnote floor"><span>Hard floor</span> 67 minutes. The exit question runs whatever else is unfinished</p>
"""},
{"cp": "Hard floor &middot; 67 min", "floor": 1},

{"kind": "exit", "title": "Exit question, which name gets no hall", "nav": "Exit question", "band": "67 to 70", "html": f"""
<p>Read the story and the program out loud. Everyone answers. Start the timer. Read option A and ask for hands, then B, C and D, before anything is shown.</p>
<p>Then press and go through every option, not only the right one. It needs both ideas from the first half at once: the first different pair decides, and a string that runs out is the smaller one.</p>
{_exit_table()}
<p class="small">A big vote for B means the room is unsure about equal strings and >=. A big vote for C means they think a longer name starting with N is less than "N". Both are worth opening the next session with.</p>
"""},

{"kind": "concept", "title": "Takeaways and close", "nav": "Takeaways and close", "band": "70 to 75", "html": """
<p>Six example cards, one press each, every one a real line from today with what it gives. Read the heading, the code, the green result, then the sentence. If the quiz showed a weak question, reopen it here against the card it belongs to.</p>
<p>Then feedback, one minute and anonymous. On the last card, thank them and name one thing the room did well today. A later session is a code walkthrough: say that, not a date.</p>
"""},

{"kind": "concept", "title": "If you are running late", "nav": "If you are running late", "html": """
<p>Cut in this order. Each can go without breaking what comes after it.</p>
<ol>
<li><b>The slider on Follow the pointer</b> drops to CAT only.</li>
<li><b>Pick the best name</b>: read the tick and one reason, no vote.</li>
<li><b>The loop card</b>: say A, B, C in one breath and press on to Z.</li>
<li><b>The machine</b> drops to levels 1, 2, 4 and 6.</li>
<li><b>Worksheet task 3</b> drops to five names: in, 1_age, total.bill, While, ravi_kumar2.</li>
<li><b>The takeaways</b> drop to cards 3, 4, 5 and 6.</li>
</ol>
<p>Never cut the password hook, Follow the pointer, the machine's level 2 and level 6, the four rules, or the exit question. Those are the session.</p>
<div class="box">
<h3>If they ask</h3>
<ul>
<li><b>Is Unicode the same as ASCII?</b> For these letters, digits and symbols, the numbers are the same. Unicode also has numbers for every other language and emoji.</li>
<li><b>How do I compare without caring about capitals?</b> Change both to small letters first, with lower(), a string method from session 15.</li>
<li><b>Is sum a bad name because it is a keyword?</b> It is not a keyword, so Python allows it. It is a bad name because it does not say what it holds.</li>
</ul>
</div>
"""},
]
