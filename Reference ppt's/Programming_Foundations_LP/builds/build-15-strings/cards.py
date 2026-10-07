"""Every card in the session, in presentation order.

Deck slides are the deck's own artwork, inlined. Panels wear the same header
the deck wears: the cyan to blue accent bar, a grey eyebrow, a blue title, the
blue rule along the bottom. A panel and a slide look the same from the back
row.

Three slides are redrawn rather than inlined, because a flat picture of a
finished slice can only be read and these have to be watched: slide 12 and
slide 17 become `slicing.py`, and each method's example line becomes a
`method.py` card that runs *before* the deck's definition slide.
"""
import base64
import html
import pathlib
import sys

import agenda as A
import machine as MA
import takeaways as TK
import method as ME
import panels as P
import slicing as SL
import walker as W
import hook as H
import why as WY
import codecard as CODE

MEDIA = pathlib.Path(__file__).parent / "media"
SKILL = pathlib.Path.home() / ".claude" / "skills" / "prog-lesson-plan"
sys.path.insert(0, str(SKILL / "assets"))
from standard_slides import Spine  # noqa: E402

# The spine cards are not designed here. Every plan in every subject opens and
# closes with these, drawn by the skill, so a redraw is a defect.
S = Spine(str(SKILL / "assets" / "standard-slides"))

SESSION_NAME = "String Methods"


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
            f'<div class="slide-head"><span class="slide-title">'
            f'{html.escape(lbl)}</span>{ref}</div>{inner}</div>')


def slhead(eyebrow, title):
    return ('<div class="sl-head"><span class="sl-bar" aria-hidden="true">'
            f'</span><div><p class="sl-eyebrow">{eyebrow}</p>'
            f'<h3 class="sl-title">{title}</h3></div></div>')


RULE = '<div class="stage-rule" aria-hidden="true"></div>'


def animctl():
    return ('<div class="stage-ctl"><button type="button" data-anim-next>Next'
            '</button><button type="button" class="ghost" data-anim-replay>'
            'Replay</button><span class="ctl-count" data-anim-count></span>'
            '</div>')


def stage(sid, cls, eyebrow, title, body, tail="", extra=""):
    return (f'<div class="stage {cls}" id="{sid}"{extra}>'
            f'{slhead(eyebrow, title)}{body}{tail}{RULE}</div>')


def anim(sid, cls, eyebrow, title, body, steps, labels):
    """A stage on the template's shared data-anim controller. There is one
    step engine in this plan and this is how every card reaches it."""
    return stage(sid, cls, eyebrow, title, body, animctl(),
                 extra=f' data-anim="{steps}" data-anim-labels="{labels}"')


def vopts(options, right):
    ks = "ABCD"
    return '<ul class="vopts">' + "".join(
        f'<li data-k="{ks[i]}"{" class=\"right\"" if i == right else ""}>'
        f'{o}</li>' for i, o in enumerate(options)) + "</ul>"


def revealbtn():
    return ('<div class="stage-ctl"><button type="button" '
            'data-reveal="Reveal answer">Reveal answer</button></div>')


def idxbar(s, cls=""):
    """One box per character, with its index under it. The room needs the
    index in front of them on every card that asks for a slice."""
    boxes = "".join(
        f'<span class="bx"><b>{html.escape(c)}</b><i>{i}</i></span>'
        for i, c in enumerate(s))
    return f'<div class="seqbar ixb {cls}">{boxes}</div>'


# =============================================================== 1. the opening
def card_welcome():
    return pcard("Welcome", S.welcome())


# ================================================================ 2. the recap
def card_recap_title():
    return pcard("Recap", S.recap_title())


def card_recap():
    """`sort`, because session 12 used `bug` and session 14 used `match`.

    It is the exclusive stop value, one more time, on range. Every slice today
    carries the same rule, so this is the last thing the room should touch
    before the hook.
    """
    return pcard(
        "Recap: what range(2, 6) hands you",
        S.recap("sort",
                title=P.RECAP_TITLE,
                eyebrow="Recap",
                ask=P.RECAP_ASK,
                bins=P.RECAP_BINS,
                chips=P.recap_chips()),
        activity=1)


# ================================================================== 3. the hook
def card_hook():
    """Four presses. Everyone in the room has typed a message like this, and
    everyone has had a search box fail them. Nothing here is named."""
    return pcard(
        "Hook: the message the search cannot find",
        anim("stage-hook", "hkstage", "Before we start",
             "Why can it not find it?", H.body(), H.STEPS, H.LABELS),
        animated="hook")


# ============================================================ 4. topic and plan
def card_title():
    """Nothing before this card prints the words String Methods."""
    return pcard("Today", S.title_card(SESSION_NAME))


def card_agenda():
    return pcard(
        "The plan",
        anim("stage-agenda", "agstage", "Agenda for today's session",
             SESSION_NAME, A.body(), A.STEPS, A.LABELS))


# ================================== 5. slicing, redrawn so it actually moves
def card_pull():
    """Slide 12, redrawn, and it opens on indexing rather than on a slice.
    message[0] gives one character; then the room is asked for four, and the
    slice is the answer to that question rather than the opening claim."""
    return pcard(
        "From one character to four",
        anim("stage-pull", "slstage", "Obtain part of a string",
             "One number, then two", SL.pull_body(), SL.PULL_STEPS,
             SL.PULL_LABELS))


def card_slice_stuck():
    return slide(13, "The one it cannot cut")


def card_step_syntax():
    return slide(15, "start, end and step")


def card_jump():
    """Slide 17, redrawn. One marker hops the step, one landing per press, and
    the boxes it never lands on go dashed at the end and stay that way."""
    return pcard(
        "The jump, one landing at a time",
        anim("stage-jump", "slstage", "Strings",
             "A slice with a step", SL.jump_body(), SL.JUMP_STEPS,
             SL.JUMP_LABELS))


# ======================================================= 6. the slice machine
def card_machine():
    """Press 1 is worksheet task 1: the room writes three answers down. The
    machine then runs those same three before it goes anywhere new."""
    return pcard(
        "Worksheet task 1, then the slice machine",
        stage("stage-mach", "mstage", "Predict, then run",
              "The slice machine", MA.body()),
        sheet="task 1", activity=21)


def card_typeit():
    body = (
        '<div class="p2"><div>'
        + CODE.card(P.TASK2_SRC, 'slices.py', hi=(2,)) +
        f'{idxbar(P.SLICE_SRC)}'
        '<p class="hint">Worksheet tab and the playground only. Nothing else '
        'open.</p>'
        '</div><div>'
        '<p class="lede">Type it, run it, then make <b>two changes</b>. Write '
        'what you expect <b>before</b> each run.</p>'
        '<ul class="steplist">'
        '<li><b>1.</b> Type it as it is and run it.</li>'
        '<li><b>2.</b> I want the letters instead of the digits. '
        '<b>Change one number</b> on line 2. Write what it will print, '
        'then run.</li>'
        '<li><b>3.</b> Now try <code>code[1:8:-2]</code>. Write what you think '
        'happens, then run.</li>'
        '</ul>'
        '<span class="tmr" data-secs="240"></span>'
        '</div></div>'
        '<p class="cap warn"><b>Write first, run second.</b> A prediction you '
        'make after the run is not a prediction.</p>')
    return pcard(
        "Type it, then change the step",
        stage("stage-type", "ty", "Worksheet task 2",
              "Type it, then change the step", body),
        sheet="task 2", activity=19)


# ======================================================= 7. the classroom quiz
def card_quiz():
    """Everything before this card is slicing. Everything after it is string
    methods. The questions live on the learning portal."""
    return pcard("Classroom quiz", S.quiz(), activity=9)


# ============================================ 8. the methods, in one rhythm
def card_why():
    """The room has to want a method before it meets one. This is the PIN
    screen from the transcript: the long way with ten comparisons in it, and
    then the two lines that replace it. Nothing after this card has to argue
    for itself."""
    return pcard(
        "Why a string method at all?",
        anim("stage-why", "wy", "String methods",
             "How does an app know a PIN is all digits?",
             WY.body(), WY.STEPS, WY.LABELS),
        animated="why")


def card_isdigit():
    return pcard(
        "isdigit: what does this line print?",
        anim("stage-isdigit", "mth", "String methods", "isdigit",
             ME.isdigit_body(), ME.ISDIGIT_STEPS, ME.ISDIGIT_LABELS))


def card_notequal():
    return slide(30, "Two numbers that are not equal")


def card_strip():
    return pcard(
        "strip: what does this line print?",
        anim("stage-strip", "mth", "String methods", "strip",
             ME.strip_body(), ME.STRIP_STEPS, ME.STRIP_LABELS))


def card_explainer():
    return pcard(
        "Follow the strip",
        stage("stage-walk", "xstage", "One character at a time",
              "Where does strip stop?", W.explainer_body()),
        animated="explainer")


def card_innerdot():
    return slide(35, "The dot in the middle stays")


def card_set():
    return slide(36, "A set of characters, not a word")


def card_task3():
    """One card, two jobs. Press 1 is the task; every press after it walks the
    answer in the same place, so the program never leaves the screen."""
    return pcard(
        "Worksheet task 3: trace it, then check it",
        anim("stage-t3", "rvstage tw", "Worksheet task 3",
             "Trace it before you run it", W.reveal_body(),
             W.REVEAL_STEPS, W.REVEAL_LABELS),
        sheet="task 3", activity=18)


def card_replace_scene():
    return slide(38, "The same mistake in a long document")


def card_replace():
    return pcard(
        "replace: one of them, or both?",
        anim("stage-replace", "mth", "String methods", "replace",
             ME.replace_body(), ME.REPLACE_STEPS, ME.REPLACE_LABELS))


def card_startswith():
    return pcard(
        "startswith: what does this line print?",
        anim("stage-starts", "mth", "String methods", "startswith",
             ME.starts_body(), ME.STARTS_STEPS, ME.STARTS_LABELS))


def card_endswith():
    """Two presses. Press 1 is the ask, with the three lines drawn as empty
    slots so the card is never half blank while the room works. Press 2 fills
    them, and only after the room has said it."""
    ghost = "".join('<span class="ewline"></span>' for _ in range(3))
    body = (
        '<div class="p2">'
        '<div>'
        + CODE.card(P.TASK4_GIVEN, 'link.py', hi=(2,)) +
        '<p class="hint">That one is the card we have just done. It checks '
        'the <b>front</b> of the string.</p>'
        '</div>'
        '<div>'
        '<div class="ewstep ew1">'
        '<p class="lede">An email id is a Gmail id when it <b>ends</b> with '
        f'<code>{P.TASK4_ENDING}</code>.</p>'
        '<p class="lede"><b>Worksheet task 4.</b> Write the three lines that '
        'check it, then type them in and run them.</p>'
        f'<div class="ewgh"><span class="lb">your three lines</span>{ghost}'
        '</div>'
        '<span class="tmr" data-secs="120"></span>'
        '</div>'
        '<div class="ewstep ew2">'
        + CODE.card(P.TASK4_ANSWER, 'email.py', hi=(2,)) +
        '<p class="lede">One word changed. Both of them answer a question, so '
        'both hand back <b>True</b> or <b>False</b>.</p>'
        f'<p class="lede">With <code>{P.TASK4_EMAIL}</code> it prints '
        f'<b>{P.task4_out()}</b>. With a yahoo address it prints '
        f'<b>{P.task4_other()}</b>.</p>'
        '</div>'
        '</div>'
        '</div>')
    return pcard(
        "Your turn: check the other end",
        anim("stage-ends", "ew", "Worksheet task 4", "You write this one",
             body, 2, "your turn|the three lines"),
        sheet="task 4", activity=9)


def card_upper():
    return pcard(
        "upper, and lower is its mirror",
        anim("stage-upper", "mth", "String methods", "upper and lower",
             ME.upper_body(), ME.UPPER_STEPS, ME.UPPER_LABELS))


# ================================================================= 9. the exit
def card_exit():
    opts = [f'The user types <b>{html.escape(v)}</b>' for v in P.EXIT_INPUTS]
    right = P.EXIT_RIGHT[0]
    ans = 'Option ' + "ABCD"[right] + '. ' + P.exit_why(P.EXIT_INPUTS[right])
    body = (
        '<div class="stage-step on" data-label="one question">'
        '<div class="pollcols"><div>'
        '<p class="stage-q">An app asks for a 4 digit PIN. For which one of '
        'these does the screen show <b>nothing at all</b>?</p>'
        f'<pre class="slabcode">{P.EXIT_CODE}</pre>'
        f'{vopts(opts, right)}'
        '</div><div>'
        f'<p class="ans">{html.escape(ans)}</p>'
        f'{revealbtn()}'
        '<span class="tmr" data-secs="150"></span>'
        '</div></div></div>')
    return pcard(
        "Exit: one question",
        stage("stage-exit", "ex", "Exit question",
              "Which one prints nothing?", body),
        activity=1)


# ================================================= 10. the two takeaway boards
def card_tk_slice():
    """One string, and the four slices of it the room has spent the session
    on, each with the output it actually gives. The map that used to be here
    carried no examples at all, on the one card a student photographs."""
    return pcard(
        "Key takeaways: one string, four slices",
        anim("stage-tk1", "tk", "Key takeaways", "Slicing, in four lines",
             TK.slice_board(), TK.SLICE_STEPS, TK.SLICE_LABELS))


def card_tk_method():
    return pcard(
        "Key takeaways: five methods, five lines",
        anim("stage-tk2", "tk", "Key takeaways",
             "The five methods, and what each one hands back",
             TK.method_board(), TK.METHOD_STEPS, TK.METHOD_LABELS))


# ============================================================ 11. the closing
def card_feedback():
    return pcard("Feedback", S.feedback())


def card_thankyou():
    return pcard("Thank you", S.thankyou())


# ================================================================= the JS blob
def extra_js():
    return W.explainer_js() + MA.machine_js()
