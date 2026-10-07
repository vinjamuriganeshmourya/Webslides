"""Every card in the session, in presentation order.

Deck slides are the deck's own artwork, inlined. Panels wear the same header the
deck wears: the cyan to blue accent bar, a grey eyebrow, a blue title, the blue
rule along the bottom. A panel and a slide look the same from the back row.
"""
import base64
import html
import pathlib
import sys

import agenda as A
import panels as P
import walker as W
import hook as H
import story as ST
import riya as R

MEDIA = pathlib.Path(__file__).parent / "media"
SKILL = pathlib.Path.home() / ".claude" / "skills" / "prog-lesson-plan"
sys.path.insert(0, str(SKILL / "assets"))
from standard_slides import Spine  # noqa: E402

# The spine cards are not designed here. Every plan in every subject opens and
# closes with these, drawn by the skill, so a redraw is a defect.
S = Spine(str(SKILL / "assets" / "standard-slides"))


# ------------------------------------------------------------------- plumbing
def _b64(name):
    return base64.b64encode((MEDIA / name).read_bytes()).decode()


def slide(n, title):
    """A deck slide, and nothing else. No notes: the guide is the one source."""
    alt = html.escape(f"Slide {n}: {title}")
    return ('<div class="slide"><div class="slide-head">'
            f'<span class="slide-no">Slide {n}</span>'
            f'<span class="slide-title">{title}</span></div>'
            f'<div class="slide-img"><img alt="{alt}" '
            f'src="data:image/webp;base64,{_b64(f"sl{n}.webp")}"></div></div>')


def pcard(lbl, inner, sheet=None, animated=None, activity=None):
    """The class attribute is exactly "pcard": both linters count the closing
    quote, so a second class here makes the panel invisible to them."""
    ref = f'<span class="slide-src">worksheet {sheet}</span>' if sheet else ''
    an = f' data-animated="{animated}"' if animated else ''
    ac = f' data-activity="{activity}"' if activity else ''
    return (f'<div class="pcard" data-label="{html.escape(lbl)}"{an}{ac}>'
            f'<div class="slide-head"><span class="slide-title">{html.escape(lbl)}</span>'
            f'{ref}</div>{inner}</div>')


def slhead(eyebrow, title):
    return ('<div class="sl-head"><span class="sl-bar" aria-hidden="true"></span><div>'
            f'<p class="sl-eyebrow">{eyebrow}</p><h3 class="sl-title">{title}</h3></div></div>')


RULE = '<div class="stage-rule" aria-hidden="true"></div>'


def animctl():
    return ('<div class="stage-ctl"><button type="button" data-anim-next>Next</button>'
            '<button type="button" class="ghost" data-anim-replay>Replay</button>'
            '<span class="ctl-count" data-anim-count></span></div>')


def stage(sid, cls, eyebrow, title, body, tail="", extra=""):
    return (f'<div class="stage {cls}" id="{sid}"{extra}>'
            f'{slhead(eyebrow, title)}{body}{tail}{RULE}</div>')


def vopts(options, right):
    ks = "ABCD"
    return '<ul class="vopts">' + "".join(
        f'<li data-k="{ks[i]}"{" class=\"right\"" if i == right else ""}>{o}</li>'
        for i, o in enumerate(options)) + "</ul>"


def revealbtn():
    return ('<div class="stage-ctl"><button type="button" data-reveal="Reveal answer">'
            'Reveal answer</button></div>')


# =============================================================== 1. the opening
def card_welcome():
    return pcard("Welcome", S.welcome())


# ================================================================ 2. the recap
def card_recap_title():
    """One word the size of the room. The instructor says which session it is;
    the card says nothing else."""
    return pcard("Recap", S.recap_title())


def card_recap():
    """The retrieval itself, in the `match` format. Session 12 used `bug`."""
    return pcard(
        "Recap: the while loop in three parts",
        S.recap("match",
                title=P.RECAP_TITLE,
                eyebrow="Recap",
                ask=P.RECAP_ASK,
                pairs=P.recap_pairs()),
        activity=1)


# ================================================================== 3. the hook
def card_hook():
    """Six presses, all of them the song story told the whole way through. The
    room's own examples are asked for on the last one and answered on the card
    after it, so the story is never cut in half to make room for them."""
    return pcard(
        "Hook: one tap, and it keeps going",
        stage("stage-hook", "hkstage", "Before we start",
              "One tap, and it keeps going",
              H.hook_body(), animctl(),
              extra=f' data-anim="{H.STEPS}" data-anim-labels="{H.LABELS}"'),
        animated="hook")


def card_examples():
    """The room's own turn, and then ours, on a card of their own. Three
    machines squeezed into a third of a column beside a phone are three grey
    smudges; here each one is the size of a hand."""
    return pcard(
        "Where else does this happen?",
        stage("stage-ex", "hkexstage", "Your turn",
              "Where else does this happen?",
              H.examples_body(), animctl(),
              extra=f' data-anim="{H.EX_STEPS}" data-anim-labels="{H.EX_LABELS}"'))


# ============================================================ 4. topic and plan
def card_title():
    """Nothing before this card prints the words For Loop. The room names the
    topic off the hook, and then this card confirms it."""
    return pcard("Today", S.title_card("For Loop"))


def card_agenda():
    """The deck's agenda ribbon, redrawn so it arrives one stop at a time. The
    flat version lands all at once and the room reads stop three while the
    instructor is still on stop one."""
    return pcard(
        "The plan",
        stage("stage-agenda", "agstage", "Agenda for today's session",
              "For Loop", A.body(), animctl(),
              extra=f' data-anim="{A.STEPS}" data-anim-labels="{A.LABELS}"'))


# ============================== 5. why the while loop hurts, from the deck
def card_bug():
    return slide(8, "Identify the mistake")


def card_fix():
    return slide(11, "One character, and the last letter comes back")


def card_simplify():
    return slide(15, "Can we simplify this?")


# ============================================================== 6. the for loop
def card_for_syntax():
    return slide(16, "For Loop: the syntax")


def card_for_python():
    return slide(17, "For Loop: over the characters of a word")


def card_for_drops():
    return slide(18, "No initialization, no condition, no updation")


# ======================================= 7. the explainer: split it, then walk
def card_explainer():
    return pcard(
        '"Python", one character at a time',
        stage("stage-walk", "xstage", "A string is a sequence",
              '"Python", one character at a time',
              W.explainer_body()),
        animated="explainer")


# ================================== 8. worksheet task 1, and its answer walked
def card_task1():
    """One card, two jobs. Press 1 is the task, with the program on the left and
    the instructions and the timer on the right. Every press after that walks
    the answer in the same place, so the code the room traced never leaves the
    screen and the instructor never changes card mid-check."""
    return pcard(
        "Worksheet task 1: trace it, then check it",
        stage("stage-t1", "rvstage rw", "Worksheet task 1",
              "Trace it before you run it",
              W.reveal_body(), animctl(),
              extra=f' data-anim="{W.REVEAL_STEPS}" '
                    f'data-anim-labels="{W.REVEAL_LABELS}"'),
        sheet="task 1", activity=20)


# ================================================== 9. type it, then change it
# One change per card. The old single card carried a lede, three steps, a note
# and a caption at once; the room read step 3 while step 1 was still running.
def _t2code(first=None):
    """Task 2's program as an editor card, with line 1 swapped and lit when a
    step changes it."""
    src = P.TASK2_SRC.rstrip().split("\n")
    if first is not None:
        src[0] = first
    rows = "".join(
        f'<span class="ln{" now" if (i == 1 and first is not None) else ""}">'
        f'<span class="no">{i}</span>{html.escape(l)}</span>'
        for i, l in enumerate(src, 1))
    return ('<div class="ed"><div class="ed-tab"><i></i><i></i><i></i>'
            f'<span>main.py</span></div><pre class="cx">{rows}</pre></div>')


def _t2card(label, title, first, lede, secs, cap, warn=True, activity=None):
    body = (
        '<div class="p2 t2"><div style="justify-content:safe center">'
        f'{_t2code(first)}'
        '</div><div style="justify-content:safe center">'
        f'{lede}'
        f'<span class="tmr" data-secs="{secs}"></span>'
        '</div></div>'
        f'<p class="cap{" warn" if warn else ""}">{cap}</p>')
    sid = "stage-type" + label.split("step ")[1][0]
    # one activity split over three cards, so only the first carries the
    # activity template
    return pcard(label, stage(sid, "ty", "Worksheet task 2", title, body),
                 sheet="task 2", activity=activity)


def card_typeit():
    return _t2card(
        "Task 2, step 1: type it and run it", "Step 1: type it, run it", None,
        '<p class="lede">Type this program into the <b>playground</b>.</p>'
        '<p class="lede">Run it as it is. Then tick <b>step 1</b> on the worksheet.</p>',
        60, '<b>Worksheet tab and the playground only.</b> Nothing else open.',
        warn=False, activity=19)


def card_typeit_delhi():
    return _t2card(
        "Task 2, step 2: change the word", "Step 2: change the word",
        'word = "Delhi"',
        '<p class="lede">Change line 1 to <code>word = "Delhi"</code>.</p>'
        '<p class="lede">On the worksheet, write <b>how many lines</b> it will print. '
        'Then run it.</p>',
        90, '<b>Write first, run second.</b> A guess after the run is not a guess.')


def card_typeit_empty():
    return _t2card(
        "Task 2, step 3: an empty word", "Step 3: an empty word",
        'word = ""',
        '<p class="lede">Change line 1 to <code>word = ""</code>. '
        'Two quote marks, nothing between.</p>'
        '<p class="lede">On the worksheet, write <b>what it will print</b>. '
        'Run it. Then write what it really printed.</p>',
        120, '<b>Write first, run second.</b> Does it give an error? Decide before you run.')


# ======================================================= 10. the classroom quiz
def card_quiz():
    """The questions live on the learning portal, not here. The card is the cue
    and nothing else: no options, no reveal, no timer. What the instructor says
    while the room attempts it is in the guide."""
    return pcard("Classroom quiz", S.quiz(), activity=9)


# =================================================== 11. range, from the deck
def card_seq_numbers():
    return slide(33, "How do we make a sequence of numbers?")


def card_range_def():
    return slide(34, "Range: starts at 0, stops before n")


def card_range_five():
    return slide(35, "range(5) gives 0 1 2 3 4")


def card_range_iter():
    return slide(36, "for number in range(3)")


# =========================================================== 11b. the range dial
RD_MAX = 10


def card_dial():
    cells = "".join(
        f'<div class="rdcell" data-i="{i}"><div class="chip">{i}</div>'
        f'<div class="tag"></div></div>' for i in range(RD_MAX + 1))
    body = (
        '<div class="rd" id="rd">'
        '<div class="rdtop">'
        '<div class="rdexpr"><span class="k">range</span>(<span class="v" id="rd-a">1</span>,'
        ' <span class="v" id="rd-b">5</span>)</div>'
        '<div class="rdsteps">'
        '<span class="lb">start</span>'
        '<button type="button" data-d="a-1" aria-label="lower the start">&minus;</button>'
        '<button type="button" data-d="a1" aria-label="raise the start">+</button>'
        '<span class="lb">stop</span>'
        '<button type="button" data-d="b-1" aria-label="lower the stop">&minus;</button>'
        '<button type="button" data-d="b1" aria-label="raise the stop">+</button>'
        '</div></div>'
        f'<div class="rdline" id="rd-line">{cells}</div>'
        '<p class="rdsum" id="rd-sum"></p>'
        '</div>'
        '<div class="wctl">'
        '<button type="button" id="rd-show">Show the numbers</button>'
        '<span class="st" id="rd-st"></span>'
        '</div>'
        '<p class="cap"><b>Say the two numbers out loud first.</b> '
        'Which numbers come out, and how many? Then press the button.</p>'
    )
    return pcard(
        "The range dial",
        stage("stage-dial", "rdstage", "Predict, then look", "The range dial", body),
        activity=2)


# ====================================================== 12. the pattern and task 3
def card_pattern():
    return slide(37, "Right angle triangular pattern")


def card_task3():
    """Worksheet task 3. Slide 37,
    the card before it, already shows the input and the stars, so this card
    says only what is theirs to write."""
    body = (
        '<div class="p2"><div style="justify-content:safe center">'
        '<div class="ed"><div class="ed-tab"><i></i><i></i><i></i><span>pattern.py</span></div>'
        '<pre class="cx">'
        '<span class="ln"><span class="no">1</span>n = <i>int</i>(<i>input</i>())</span>'
        '<span class="ln now"><span class="no">2</span>'
        '<span style="color:#C7454E">___________________________</span></span>'
        '<span class="ln now"><span class="no">3</span>    '
        '<b>print</b>(<em>"* "</em> * <span style="color:#C7454E">______</span>)</span>'
        '</pre></div>'
        '</div><div style="justify-content:safe center">'
        '<p class="lede">Line 1 is given. <b>Line 2 and the blank on line 3 '
        'are yours.</b></p>'
        f'<p class="lede">For n = 4 it prints 4 rows. The last row is '
        f'<code>{P.task3_rows(4)[-1].strip()}</code></p>'
        '<p class="hint">The two blanks must agree. More than one pair works.</p>'
        '<span class="tmr" data-secs="240"></span>'
        '</div></div>'
        '<p class="cap"><b>Worksheet task 3.</b> Write line 2 in full, with the colon. '
        'Then try it in the playground.</p>'
    )
    return pcard(
        "Worksheet task 3: write the loop line",
        stage("stage-t3", "t3", "Worksheet task 3", "Write the loop line", body),
        sheet="task 3", activity=11)


# ============================================ 13. the solution, and the poll
def card_solution():
    """Slide 40, re-headed. The deck heads it Range; by this point in the
    session that reads as a step backwards, and the card is the answer to the
    question the room has just written. See deck_surgery.py."""
    return slide(40, "Solution")


def card_poll():
    """The vote, and then both programs run side by side. The room commits to A
    or B by hand before anything is pressed, which is the only reason the gap in
    the left column lands as a surprise."""
    def col(letter, cls, expr, side):
        return (f'<div><p class="mrab{cls}">{letter}</p>'
                f'<p class="mrh{cls}">{expr}</p>'
                f'<pre class="cx"><span class="ln">n = <i>int</i>(<i>input</i>())</span>'
                f'<span class="ln"><b>for</b> counter <b>in</b> <i>{expr}</i>:</span>'
                f'<span class="ln">    <b>print</b>(<em>"* "</em> * counter)</span></pre>'
                f'<div class="mrout" data-side="{side}"></div>'
                f'<p class="mrcount{cls}" data-count="{side}"></p></div>')

    body = (
        '<p class="stage-q">Both of these start at 1. Which one prints all '
        '<b>n</b> rows?</p>'
        '<div class="rdtop" style="margin-bottom:10px">'
        '<div class="rdexpr">n = <span class="v" id="mr-n">4</span></div>'
        '<div class="rdsteps">'
        '<button type="button" data-n="-1" aria-label="lower n">&minus;</button>'
        '<button type="button" data-n="1" aria-label="raise n">+</button>'
        '</div></div>'
        '<div class="mr2" id="mr">'
        + col("A", " bad", P.POLL_A, "a")
        + col("B", "", P.POLL_B, "b")
        + '</div>'
        '<div class="wctl">'
        '<button type="button" id="mr-run">Run them both</button>'
        '<span class="st" id="mr-st"></span>'
        '</div>'
        '<p class="cap warn"><b>Hands up for A. Now hands up for B.</b> '
        'Count both before you press Run.</p>'
    )
    return pcard(
        "Which one is right?",
        stage("stage-miss", "mrstage", "Predict, then run",
              "Which one is right?", body),
        activity=21)


# ============================================ 14. the deck finishes the pattern
def card_p_startend():
    return slide(42, "range(start, end)")


def card_p_simplified():
    return slide(45, "Simplified with range(1, n+1)")


# ================================================================= 15. the exit
def card_exit():
    """The question and nothing else. The answer is walked on the next card,
    one operation per press, so this card never carries both."""
    opts = [f'seats = {s}, booked = {b}' for s, b in P.EXIT_PAIRS]
    body = (
        '<div class="p2"><div style="justify-content:safe center">'
        '<p class="stage-q">Read the code. '
        'For which pair does the screen show <b>nothing at all</b>?</p>'
        f'{ST.exit_code()}'
        '</div><div style="justify-content:safe center">'
        f'{vopts(opts, None)}'
        '<span class="tmr" data-secs="150"></span>'
        '</div></div>'
    )
    return pcard(
        "Exit: one question",
        stage("stage-exit", "ex", "Exit question", "Which one prints nothing?", body),
        activity=1)


def card_exit_answer():
    body, n = ST.exit_body()
    return pcard(
        "Exit: the answer",
        stage("stage-exa", "xastage", "Exit question", "Why it prints nothing",
              body, animctl(),
              extra=f' data-anim="{n}" data-anim-labels="the pair|line 3|line 4|nothing"'))


# ============================================ 12b. Riya's odd-day savings
# A coding challenge with a story, not a worksheet task: the loop works out a
# total. See riya.py.
def card_riya_story():
    return pcard(
        "Riya's piggy bank",
        stage("stage-rs", "rsstage", "A story", "Riya's piggy bank",
              R.story_body(), animctl(),
              extra=f' data-anim="{R.STORY_STEPS}" data-anim-labels="{R.STORY_LABELS}"'),
        animated="story")


def card_riya_problem():
    return pcard(
        "Coding challenge: Riya's savings",
        stage("stage-rp", "rpstage", "Coding challenge", "Riya's savings",
              R.problem_body(), animctl(),
              extra=f' data-anim="{R.PROBLEM_STEPS}" data-anim-labels="{R.PROBLEM_LABELS}"'),
        activity=20)


def card_riya_walk():
    return pcard(
        "Riya's savings, day by day",
        stage("stage-rk", "rkstage", "Check it together", "Riya's savings, day by day",
              R.walk_body(), animctl(),
              extra=f' data-anim="{R.WALK_STEPS}" data-anim-labels="{R.WALK_LABELS}"'))


# ====================================================== 16. the takeaways map
# Every row carries a CHIP with the concept's own name on it, in its own colour,
# so a student looking for "range" on this card finds it in one second instead
# of reading five sentences to work out which one is about range.
#   (x, y, w, h, chip, chip colour, the line, connector)
TK_BOXES = [
    (310, 10, 620, 66, "for loop", "#006DAF",
     "walks a sequence, one item at a time", None),
    (20, 116, 580, 66, "string", "#1F9D62",
     '"Python" is a sequence of 6 characters', "M620,76 L310,116"),
    (640, 116, 580, 66, "range", "#8E44AD",
     "range makes a sequence of numbers", "M620,76 L930,116"),
    (20, 208, 580, 66, "ch", "#C77700",
     "holds one item. It changes every pass", "M310,182 L310,208"),
    (640, 208, 580, 66, "stop", "#C7454E",
     "range(1, 5) gives 1 2 3 4, not 5", "M930,182 L930,208"),
    (200, 306, 840, 64, "how many", "#0B5FA5",
     "the sequence decides how many passes happen",
     "M310,274 L500,306 M930,274 L740,306"),
    (200, 394, 840, 64, "empty", "#C7454E",
     "an empty sequence means the body never runs", "M620,370 L620,394"),
]


def card_takeaways():
    gs = ""
    for i, (x, y, w, h, chip, colour, text, path) in enumerate(TK_BOXES, 1):
        p = f'<path class="tkline" d="{path}"/>' if path else ""
        cw = 26 + 11.5 * len(chip)
        cy = y + h / 2
        gs += (
            f'<g class="bx tk{i}">{p}'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12"/>'
            f'<rect class="tkchip" x="{x + 14:.0f}" y="{cy - 17:.0f}" '
            f'width="{cw:.0f}" height="34" rx="9" fill="{colour}"/>'
            f'<text class="tkchiptx" x="{x + 14 + cw / 2:.0f}" y="{cy + 6:.0f}" '
            f'text-anchor="middle">{chip}</text>'
            f'<text class="tktx" x="{x + 14 + cw + 18:.0f}" y="{cy + 7:.0f}">'
            f'{text}</text>'
            '</g>')
    svg = ('<svg class="fig tkmap" viewBox="0 0 1240 470" '
           'xmlns="http://www.w3.org/2000/svg" role="img" '
           'aria-label="A map of what the session covered, one concept per row">'
           + gs + '</svg>')
    return pcard(
        "Key takeaways",
        stage("stage-tk", "tk", "For loop", "What we did today",
              svg, animctl(),
              extra=' data-anim="7" data-anim-labels="the for loop|a string|range|'
                    'ch|stops before|how many passes|an empty sequence"'))


# ============================================================ 17. the closing
def card_feedback():
    return pcard("Feedback", S.feedback())


def card_thankyou():
    return pcard("Thank you", S.thankyou())


# ================================================================= the JS blob
def extra_js():
    return (W.EXPLAINER_JS
            + DIAL_JS.replace("__MAX__", str(RD_MAX))
            + MISSING_JS)


DIAL_JS = r"""
  /* --------------------------------------------------------------- the range dial
     The stop value is drawn at its own tick with a cross through it, every time,
     because "stops before the end" is the half that gets forgotten. Changing
     either number hides the numbers again: the room predicts before every reveal,
     not only the first one. */
  (function(){
    var root=document.getElementById('rd'); if(!root) return;
    var MAX=__MAX__, a=1, b=5, shown=false;
    var elA=document.getElementById('rd-a'), elB=document.getElementById('rd-b'),
        line=document.getElementById('rd-line'), sum=document.getElementById('rd-sum'),
        btn=document.getElementById('rd-show'), st=document.getElementById('rd-st');
    var cells=[].slice.call(line.querySelectorAll('.rdcell'));
    var timers=[];
    var calmD = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clear(){ timers.forEach(clearTimeout); timers=[]; }

    function paint(){
      clear();
      elA.textContent=a; elB.textContent=b;
      cells.forEach(function(c){ c.className='rdcell';
        c.querySelector('.tag').textContent=''; });
      sum.classList.remove('out');
      root.parentNode.querySelectorAll('[data-d]').forEach(function(x){
        var d=x.dataset.d, na=a+(d==='a1'?1:d==='a-1'?-1:0), nb=b+(d==='b1'?1:d==='b-1'?-1:0);
        x.disabled = na<0 || nb>MAX || na>nb;
      });
      btn.disabled=false; btn.textContent='Show the numbers';
      st.textContent = shown ? '' : 'Say which numbers, and how many. Then press.';
    }

    function show(){
      shown=true; btn.disabled=true; st.textContent='';
      var gap = calmD ? 0 : 90, k=0;
      for(var i=a;i<b;i++){
        (function(i,k){ timers.push(setTimeout(function(){
          var c=cells[i]; c.classList.add('in');
          if(i===a) { c.classList.add('first'); c.querySelector('.tag').textContent='start'; }
        }, gap*k)); })(i,k++);
      }
      timers.push(setTimeout(function(){
        if(b<=MAX){ cells[b].classList.add('stop');
          cells[b].querySelector('.tag').textContent='stop'; }
        var n=Math.max(0,b-a);
        sum.innerHTML = n
          ? 'stop minus start is <b>'+b+' &minus; '+a+' = '+n+'</b>, so '+n
            +' number'+(n===1?'':'s')+' come'+(n===1?'s':'')+' out. The last one is <b>'
            +(b-1)+'</b>, never <b>'+b+'</b>.'
          : 'start and stop are the same, so <b>nothing</b> comes out at all.';
        sum.classList.add('out');
      }, gap*k+160));
    }

    root.parentNode.querySelectorAll('[data-d]').forEach(function(x){
      x.addEventListener('click', function(){
        var d=x.dataset.d;
        if(d==='a1') a++; else if(d==='a-1') a--;
        else if(d==='b1') b++; else if(d==='b-1') b--;
        a=Math.max(0,Math.min(a,MAX)); b=Math.max(a,Math.min(b,MAX));
        shown=false; paint();
      });
    });
    btn.addEventListener('click', show);
    root.parentNode.addEventListener('keydown', function(e){
      if(e.target.closest && e.target.closest('.wctl,.rdsteps')) e.stopPropagation();
    }, true);
    paint();
  })();
"""

MISSING_JS = r"""
  /* ------------------------------------------------------ A or B, then both run
     Two programs three characters apart, on the same n. The room votes by hand
     first. The row the left one never prints is then drawn as a dashed empty
     outline: the mistake becomes a hole they can point at instead of a sentence
     they have to believe. */
  (function(){
    var root=document.getElementById('mr'); if(!root) return;
    var n=4, ran=false, timers=[];
    var elN=document.getElementById('mr-n'), btn=document.getElementById('mr-run'),
        st=document.getElementById('mr-st');
    var outs={a:root.querySelector('[data-side="a"]'), b:root.querySelector('[data-side="b"]')};
    var cnts={a:root.querySelector('[data-count="a"]'), b:root.querySelector('[data-count="b"]')};
    var calmR = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function rows(stop){ var r=[]; for(var c=1;c<stop;c++) r.push('* '.repeat(c)); return r; }

    function draw(){
      timers.forEach(clearTimeout); timers=[];
      elN.textContent=n;
      var A=rows(n), B=rows(n+1);
      outs.a.innerHTML = A.map(function(r){ return '<div class="mrrow">'+r+'</div>'; }).join('')
        + '<div class="mrrow ghost">' + '* '.repeat(n)
        + '<span>the row you wanted</span></div>';
      outs.b.innerHTML = B.map(function(r){ return '<div class="mrrow">'+r+'</div>'; }).join('');
      cnts.a.textContent=A.length+' rows'; cnts.b.textContent=B.length+' rows';
      cnts.a.classList.remove('out'); cnts.b.classList.remove('out');
      root.classList.remove('told');
      btn.disabled=false; ran=false;
      st.textContent='Count the hands for A, then for B. Then press.';
      root.parentNode.querySelectorAll('[data-n]').forEach(function(x){
        var v=n+(+x.dataset.n); x.disabled = v<2 || v>6;
      });
    }

    function run(){
      if(ran) return; ran=true; btn.disabled=true; st.textContent='';
      var gap = calmR ? 0 : 300;
      ['a','b'].forEach(function(side){
        var rs=[].slice.call(outs[side].querySelectorAll('.mrrow:not(.ghost)'));
        rs.forEach(function(r,k){ timers.push(setTimeout(function(){
          r.classList.add('out'); }, gap*k)); });
        timers.push(setTimeout(function(){ cnts[side].classList.add('out'); },
          gap*rs.length+120));
      });
      timers.push(setTimeout(function(){
        outs.a.querySelector('.ghost').classList.add('out');
        root.classList.add('told');
        st.textContent='B is the one. A stops before n, so the last row never happens.';
      }, gap*n+420));
    }

    root.parentNode.querySelectorAll('[data-n]').forEach(function(x){
      x.addEventListener('click', function(){
        n=Math.max(2,Math.min(6,n+(+x.dataset.n))); draw(); });
    });
    btn.addEventListener('click', run);
    root.parentNode.addEventListener('keydown', function(e){
      if(e.target.closest && e.target.closest('.wctl,.rdsteps')) e.stopPropagation();
    }, true);
    draw();
  })();
"""
