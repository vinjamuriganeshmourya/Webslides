#!/usr/bin/env python3
"""The fixed spine every lesson plan carries, in every subject.

Programming Foundations, DSA and Aptitude all open and close the same way, and
the six spine cards are byte-identical across subjects. They are not designed
per session and they are not re-drawn: they come from here.

    from standard_slides import Spine
    S = Spine('standard-slides')            # the folder holding the artwork
    S.welcome()                             # card body, full bleed picture
    S.recap_title()                         # the word Recap on white
    S.recap('rapid', ...)                   # one of four recap formats
    S.title_card('Nested Conditional Statements')
    S.quiz()                                # Classroom Quiz Time, picture only
    S.feedback(); S.thankyou()

Every function returns the **inner body of a card** - the markup that goes
inside the subject builder's own `pcard(...)` / `slide(...)` wrapper. Nothing
here knows about card chrome, so the same module works in all three builders.

The order is fixed and `plan_shape.py` checks it:

    welcome -> recap title -> recap activity -> hook -> title card -> agenda
    ... teaching blocks ... classroom quiz (middle) ... teaching blocks ...
    takeaway map -> feedback -> thank you

All six pictures are the user's own slides, from `Fixed Slides/`, prepared by
`make-spine-artwork.py`. Welcome, Recap, Classroom Quiz, Feedback and Thank You
go on screen untouched. The title slide goes on with its name cleared, and
`title_card()` writes the session's name into the same place, in the same face,
at the same size, so the only thing that changes between two sessions' title
slides is the name.

Nothing in here is drawn in SVG to look like a slide. If a spine card needs to
change, the user replaces the PNG in `Fixed Slides/` and this module is re-run.
"""

import base64
import html
import pathlib
import re

__all__ = ['Spine', 'RECAP_FORMATS', 'SPINE_ORDER', 'SPINE_CSS',
           'SPINE_JS', 'slug', 'file_names', 'spine_check', 'SPINE_KEYS',
           'spine_html_check', 'name_check']

# The six pictures, and what each one is for. Do not substitute artwork.
#
# These are the slides themselves, not drawings of them. They come from the
# user's `Fixed Slides/` folder by way of `make-spine-artwork.py`, which crops
# the capture's black edges and writes 1920x1080 webp. Nothing here is redrawn
# in SVG any more: a redrawing is always a near miss, and the near miss is what
# the room sees on the wall.
PICTURES = {
    'welcome': ('welcome.webp', 'Welcome'),
    'recap': ('recap.webp', 'Recap'),
    'quiz': ('quiz.webp', 'Classroom Quiz Time'),
    'feedback': ('feedback.webp', 'Feedback'),
    'thankyou': ('thankyou.webp', 'Thank You'),
}

# The title slide is the same artwork with the name lifted out of it, so one
# picture serves every session. `title_card()` draws the session's own name
# back on. Measured on the 1600x900 viewBox the SVG uses:
TITLE_ART = 'title-blank.webp'
TITLE_PILL_TOP = 310.8       # the white pill, top and bottom
TITLE_PILL_BOTTOM = 593.3
# The name is centred on 1031, where the reference slide's own name is
# centred, and may run 309 either side of it. That stops short of the pill's
# rounded right end and clear of the logo on the left.
TITLE_TEXT_MID = 1031
TITLE_TEXT_HALF = 309
TITLE_SIZE_MAX = 58          # the size the reference slide's own name is set at
TITLE_SIZE_MIN = 34
TITLE_INK = '#212121'        # sampled off the slide
# Arial, because the slide is set in Arial. `var(--sans)` resolves to Segoe UI
# on the machines these decks run on, which is a different face at the same
# size and reads as a different slide.
TITLE_FACE = 'Arial, Helvetica, ui-sans-serif, sans-serif'

# Arial Bold advance widths, thousandths of an em. A flat per-character average
# gets the reference slide's own name wrong by two pixels, which is visible
# when a session's title card sits next to the one the deck shipped, so the
# widths are the real ones.
_ARIAL_BOLD_W = {
    ' ': 278, '!': 333, '"': 474, '#': 556, '$': 556, '%': 889, '&': 722,
    "'": 238, '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333,
    '.': 278, '/': 278, ':': 333, ';': 333, '<': 584, '=': 584, '>': 584,
    '?': 611, '@': 975, '[': 333, ']': 333, '_': 556, '`': 333,
    'A': 722, 'B': 722, 'C': 722, 'D': 722, 'E': 667, 'F': 611, 'G': 778,
    'H': 722, 'I': 278, 'J': 556, 'K': 722, 'L': 611, 'M': 833, 'N': 722,
    'O': 778, 'P': 667, 'Q': 778, 'R': 722, 'S': 667, 'T': 611, 'U': 722,
    'V': 667, 'W': 944, 'X': 667, 'Y': 667, 'Z': 611,
    'a': 556, 'b': 611, 'c': 556, 'd': 611, 'e': 556, 'f': 333, 'g': 611,
    'h': 611, 'i': 278, 'j': 278, 'k': 556, 'l': 278, 'm': 889, 'n': 611,
    'o': 611, 'p': 611, 'q': 611, 'r': 389, 's': 556, 't': 333, 'u': 611,
    'v': 556, 'w': 778, 'x': 556, 'y': 556, 'z': 500,
}
for _d in '0123456789':
    _ARIAL_BOLD_W[_d] = 556


def _title_em(line):
    """How many ems wide this line is, set in Arial Bold."""
    return sum(_ARIAL_BOLD_W.get(ch, 600) for ch in line) / 1000.0

SPINE_ORDER = (
    'welcome', 'recap-title', 'recap', 'hook', 'title-card', 'agenda',
    '...', 'classroom-quiz', '...', 'takeaways', 'feedback', 'thankyou',
)

RECAP_FORMATS = ('rapid', 'sort', 'bug', 'match')


def _b64(path):
    p = pathlib.Path(path)
    if not p.exists():
        raise SystemExit(f'standard_slides: missing artwork {p}')
    return base64.b64encode(p.read_bytes()).decode()


def _esc(s):
    return html.escape(str(s), quote=True)


def _rich(s):
    """Escape, then turn `backticks` into inline code. Student-facing text on
    these cards is plain English; the backticks exist so a variable name or an
    operator can look like one without anybody writing HTML."""
    out = _esc(s)
    return re.sub(r'`([^`]+)`', r'<code>\1</code>', out)


# =========================================================================
# File names. One session name in, the three file names out, so no builder
# spells them by hand and no two plans in the tree disagree.
# =========================================================================

def slug(session):
    """`11 - Nested Conditional Statements` -> `11_nested_conditional_statements`.

    Lower case, words joined by underscores, everything that is not a letter or
    a digit dropped. The session's number keeps its leading zero, so a folder
    sorts the way a timetable does.
    """
    out, prev_us = [], True
    for ch in str(session):
        if ch.isalnum():
            out.append(ch.lower())
            prev_us = False
        elif not prev_us:
            out.append('_')
            prev_us = True
    return ''.join(out).strip('_')


def file_names(session):
    """The three deliverables for one session, in the user's convention.

        11_nested_conditional_statements_student_view.html
        11_nested_conditional_statements_instructor_guide.html
        11_nested_conditional_statements_student_handout.html

    Never presenter.html, guide.html, worksheet.html or session-plan.html, and
    never a name with a space or a capital in it. Set SESSION once in the
    builder and derive all three from here.
    """
    base = slug(session)
    return {
        'student_view': f'{base}_student_view.html',
        'instructor_guide': f'{base}_instructor_guide.html',
        'student_handout': f'{base}_student_handout.html',
    }


# =========================================================================
# The shape checker. plan_shape.py in every subject calls this on the beat
# table, before a builder exists, so a spine that drifted is caught while the
# fix is still one line of JSON.
#
# A beat marks its spine card with a "spine" key:
#
#   {"name": "Welcome", "mins": 1, "kind": "concept", "spine": "welcome"}
#
# The names are: welcome, recap-title, recap, hook, title, agenda, quiz,
# feedback, thankyou.
# =========================================================================

SPINE_KEYS = ('welcome', 'recap-title', 'recap', 'hook', 'title', 'agenda',
              'quiz', 'feedback', 'thankyou')


def spine_check(beats):
    """Check a beat table against the fixed spine.

    Returns a list of (ok, label, detail, warn) tuples, which the caller prints
    in its own format. Nothing is written and nothing is raised.
    """
    out = []

    def ck(ok, label, detail='', warn=False):
        # warn only ever softens a failure; a passing check is never a warning
        out.append((bool(ok), label, detail, bool(warn) and not ok))

    marks = [(i, b.get('spine')) for i, b in enumerate(beats) if b.get('spine')]
    seen = {m for _, m in marks}
    unknown = seen - set(SPINE_KEYS)
    ck(not unknown, 'every spine mark is a real one',
       f'unknown: {sorted(unknown)}' if unknown else '')

    pos = {m: i for i, m in marks}

    ck(pos.get('welcome') == 0, 'the plan opens on the welcome card',
       'card 1 is the fixed welcome picture, one minute')

    has_recap = 'recap' in pos or 'recap-title' in pos
    if has_recap:
        ck('recap-title' in pos and 'recap' in pos,
           'the recap is two cards: the word, then the retrieval',
           'S.recap_title() then S.recap(fmt, ...)')
        if 'recap-title' in pos and 'recap' in pos:
            ck(pos['recap'] == pos['recap-title'] + 1,
               'the retrieval card follows the Recap card immediately',
               'nothing sits between them')
            ck(pos['recap-title'] == 1, 'the Recap card is card 2',
               f"it is card {pos['recap-title'] + 1}")
    else:
        ck(True, 'no recap (first session of the course or module)',
           'omitted whole; never substituted', warn=True)

    for a, b in (('recap', 'hook'), ('hook', 'title'), ('title', 'agenda')):
        if a in pos and b in pos:
            ck(pos[a] < pos[b], f'{a} comes before {b}',
               'welcome, recap, hook, title card, agenda, in that order')

    ck('title' in pos, 'the session title card is in the plan',
       'S.title_card(SESSION_NAME), after the hook')
    ck('agenda' in pos, 'the agenda is in the plan', 'straight after the title card')

    # the quiz sits in the middle, measured in minutes rather than in cards
    mins = [int(b.get('mins', 0) or 0) for b in beats]
    total = sum(mins) or 1
    if 'quiz' in pos:
        before = sum(mins[:pos['quiz']])
        frac = before / total
        ck(0.38 <= frac <= 0.66, 'the classroom quiz sits in the middle',
           f'it starts at minute {before} of {total} '
           f'({frac * 100:.0f}% in; aim for 45% to 60%)')
        ck(int(beats[pos['quiz']].get('mins', 0) or 0) in range(4, 9),
           'the quiz beat is four to eight minutes',
           f"{beats[pos['quiz']].get('mins')} min", warn=True)
    else:
        ck(False, 'the plan has a classroom quiz card',
           'the portal quiz is the mid-session checkpoint')

    if 'feedback' in pos and 'thankyou' in pos:
        ck(pos['feedback'] < pos['thankyou'], 'feedback comes before thank you', '')
        ck(pos['thankyou'] == len(beats) - 1, 'thank you is the last card',
           f"it is card {pos['thankyou'] + 1} of {len(beats)}")
    else:
        ck(False, 'the plan closes on feedback then thank you',
           'both are fixed pictures')

    return out


# =========================================================================
# The output checker. verify_plan.py in every subject calls this on the
# finished student view, so a spine that drifted during the build is caught
# before anybody opens the file in a classroom.
# =========================================================================

_NAME_RE = re.compile(r'^[0-9]{1,3}_[a-z0-9]+(_[a-z0-9]+)*_'
                      r'(student_view|instructor_guide|student_handout)\.html$')


def name_check(basename):
    """Is this one of the three file names, spelled the way they are spelled?

    11_nested_conditional_statements_student_view.html and its two siblings.
    Lower case, underscores, the session number first. Returns (ok, detail).
    """
    ok = bool(_NAME_RE.match(basename))
    return ok, ('' if ok else
                f'{basename} - expected <number>_<session_name>_'
                '<student_view|instructor_guide|student_handout>.html, '
                'lower case, underscores')


def spine_html_check(html_text, basename=''):
    """Check a finished student view against the spine.

    Returns a list of (ok, label, detail, warn) tuples, the same shape as
    spine_check, so a subject's verify_plan.py can print them in its own
    format.
    """
    out = []

    def ck(ok, label, detail='', warn=False):
        out.append((bool(ok), label, detail, bool(warn) and not ok))

    if basename:
        ok, detail = name_check(basename)
        ck(ok, 'the file name follows the convention', detail)

    # ---- slides only: no sidebar, no buttons, no way out ----------------
    # Settled 2026-09-22. Every shipped plan in all three subjects is the
    # slides and presenter view and nothing else: the file lives on the
    # projector, so anything around the slide is furniture the room can see.
    # The earlier rule here asked for one Presenter view button in a sidebar,
    # and every shipped plan failed it.
    ck('<aside class="sidepanel"' not in html_text,
       'no sidebar on the student view',
       'the student view is the slides and presenter view, nothing else')
    buttons = re.findall(r'<button[^>]*class="[^"]*sp-btn[^"]*"[^>]*>(.*?)</button>',
                         html_text, re.S)
    ck(not buttons, 'no sidebar buttons on the student view',
       f'{len(buttons)}: {[re.sub(chr(60) + "[^" + chr(62) + "]*" + chr(62), "", b).strip() for b in buttons]}')
    ck('present(true);' in html_text, 'the student view opens in presenter view',
       'the shell calls present(true) on load, so the projector shows a card and not a web page')
    for bad in ('Instructor guide', 'Student worksheet', 'instructor_guide.html',
                'student_handout.html'):
        ck(bad not in html_text, f'the student view does not offer {bad!r}',
           'no button and no link into the guide or the worksheet')


    # ---- the spine cards are there, in order ----------------------------
    marks = [
        ('welcome', 'data-spine="welcome"'),
        ('recap card', 'spine-recap'),
        ('recap activity', 'data-recap="'),
        ('title card', 'spine-title'),
        ('classroom quiz', 'data-spine="quiz"'),
        ('feedback', 'data-spine="feedback"'),
        ('thank you', 'data-spine="thankyou"'),
    ]
    at = {}
    for label, needle in marks:
        i = html_text.find(needle)
        if i >= 0:
            at[label] = i
    for label in ('welcome', 'title card', 'classroom quiz', 'feedback', 'thank you'):
        ck(label in at, f'the {label} card is in the plan'
           if label in ('welcome', 'feedback') else f'the {label} is in the plan',
           'it comes from standard_slides; do not redraw it')
    if 'recap card' in at or 'recap activity' in at:
        ck('recap card' in at and 'recap activity' in at,
           'the recap is both cards', 'the word Recap, then the retrieval')

    order = [l for l, _ in marks if l in at]
    ck(order == sorted(order, key=lambda l: at[l]),
       'the spine cards appear in the fixed order',
       ' then '.join(sorted(order, key=lambda l: at[l])))

    # ---- the quiz card carries nothing ----------------------------------
    i = html_text.find('data-spine="quiz"')
    if i >= 0:
        j = html_text.find('</div>', html_text.find('</div>', i) + 1)
        card_start = html_text.rfind('<div class="pcard', 0, i)
        card = html_text[card_start:j] if card_start >= 0 else html_text[i:j]
        ck('data-secs' not in card, 'no timer on the classroom quiz card',
           'the portal runs its own clock')
        ck('data-reveal' not in card, 'no reveal on the classroom quiz card',
           'the quiz is attempted on the portal, not on the projector')

    return out


class Spine:
    """The spine cards, bound to the folder that holds the artwork."""

    def __init__(self, media_dir='standard-slides'):
        self.media = pathlib.Path(media_dir)

    # ---------------------------------------------------------------- pictures
    def picture(self, kind):
        """One of the four fixed pictures, full bleed, nothing over it."""
        fname, alt = PICTURES[kind]
        b64 = _b64(self.media / fname)
        return (f'<div class="slide-img spine-pic spine-{kind}" '
                f'data-spine="{kind}">'
                f'<img alt="{_esc(alt)} slide" '
                f'src="data:image/webp;base64,{b64}"></div>')

    def welcome(self):
        """Card 1 of every plan. One minute, nothing on it but the picture."""
        return self.picture('welcome')

    def quiz(self):
        """The classroom quiz card. The quiz itself runs on the learning portal.

        Picture only: no questions, no options, no reveal, and no timer. The
        instructor announces it and the room opens the portal on their laptops.
        What to say, how long they get and what to do when they finish all live
        in that card's guide entry, never on the projector.
        """
        return self.picture('quiz')

    def feedback(self):
        return self.picture('feedback')

    def thankyou(self):
        return self.picture('thankyou')

    # ------------------------------------------------------------- title cards
    def title_card(self, session_name):
        """The session title slide, revealed after the hook.

        The shipped slide with its own name cleared out, and this session's
        name written back into the same white pill, in Arial bold, on the same
        line. Only the name changes between sessions. The room guesses the
        topic before this card appears, so nothing before it may print the
        session's name.

        A long name shrinks to stay inside the pill, and a name too long to
        shrink breaks onto a second line, centred on the same middle.
        """
        b64 = _b64(self.media / TITLE_ART)
        name = str(session_name).strip()
        column = TITLE_TEXT_HALF * 2
        mid_x = TITLE_TEXT_MID
        mid_y = (TITLE_PILL_TOP + TITLE_PILL_BOTTOM) / 2

        def fits(lines):
            """The largest size at which every line stays inside the column."""
            widest = max((_title_em(ln) for ln in lines), default=1) or 1
            return int(column / widest)

        # One line if it can be read at a reasonable size, two if it cannot,
        # three only for a name no session should have.
        lines = [name]
        size = min(TITLE_SIZE_MAX, fits(lines))
        for parts in (2, 3):
            if size >= TITLE_SIZE_MIN:
                break
            lines = _wrap_title(name, width=max(8, len(name) // parts + 2))
            size = min(TITLE_SIZE_MAX, fits(lines))
        size = max(TITLE_SIZE_MIN, size)

        # Arial's cap height is 0.716 em, and the name is all caps and
        # ascenders, so the ink is `cap` tall. Centre that block on the pill.
        cap = size * 0.716
        lead = size * 1.18
        block = cap + lead * (len(lines) - 1)
        first = mid_y - block / 2 + cap          # the first line's baseline
        text = ''.join(
            f'<text x="{mid_x:.0f}" y="{first + i * lead:.0f}" '
            'text-anchor="middle" '
            f'style="font:700 {size}px {TITLE_FACE}" fill="{TITLE_INK}">'
            f'{_esc(line)}</text>' for i, line in enumerate(lines))
        return (
            '<div class="tc-wrap"><svg class="fig titlecard spine-title" '
            'viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" '
            f'role="img" aria-label="Title slide reading {_esc(name)}">'
            '<defs><clipPath id="sptc-clip">'
            '<rect x="0" y="0" width="1600" height="900" rx="16"/></clipPath>'
            '</defs><g clip-path="url(#sptc-clip)">'
            f'<image href="data:image/webp;base64,{b64}" x="0" y="0" '
            'width="1600" height="900" preserveAspectRatio="none"/>'
            f'{text}</g></svg></div>')

    def recap_title(self):
        """The word Recap on white. The shipped slide, nothing over it.

        Identical in every plan, one press, no text under it. The retrieval is
        the card after this one.
        """
        return self.picture('recap')

    # ------------------------------------------------------------------ recaps
    def recap(self, fmt, **kw):
        """One of the four recap formats. Rotate them across a module so the
        room does not meet the same shape two sessions running.

        rapid(title, items)   three question tiles, flipped one per press
        sort(title, bins, chips)  chips flown into the bin they belong in
        bug(title, lines, wrong, right, culprit, why)  find the line that lies
        match(title, pairs)   six tiles, paired one press at a time

        Every one of them is commit-then-reveal: the room writes or says an
        answer before the press that shows it. None of them names a student,
        and none of them scores anybody.
        """
        fn = {'rapid': _recap_rapid, 'sort': _recap_sort,
              'bug': _recap_bug, 'match': _recap_match}.get(fmt)
        if fn is None:
            raise SystemExit(
                f'standard_slides: recap format {fmt!r} does not exist. '
                f'One of {RECAP_FORMATS}.')
        return fn(**kw)


def _wrap_title(name, width=17):
    """Break a session name onto at most three lines, on word boundaries."""
    words, lines, cur = name.split(), [], ''
    for w in words:
        trial = f'{cur} {w}'.strip()
        if len(trial) > width and cur:
            lines.append(cur)
            cur = w
        else:
            cur = trial
    if cur:
        lines.append(cur)
    if len(lines) > 3:
        lines = lines[:2] + [' '.join(lines[2:])]
    return lines


# =========================================================================
# The four recap formats.
#
# Each returns a `.stage.rcp` with its own controls. They do NOT ride the
# shared data-anim controller, because each one has state of its own, so each
# stops arrow keys at its own node the way every other self-driving panel in
# these plans does.
# =========================================================================

def _ctl(label='Next'):
    return ('<div class="stage-ctl rcp-ctl">'
            f'<button type="button" data-rcp-next>{label}</button>'
            '<button type="button" class="ghost" data-rcp-reset>Replay'
            '</button><span class="ctl-count" data-rcp-count></span></div>')


def _head(eyebrow, title, ask):
    return ('<div class="sl-head"><span class="sl-bar" aria-hidden="true">'
            f'</span><div><p class="sl-eyebrow">{_esc(eyebrow)}</p>'
            f'<h3 class="sl-title">{_esc(title)}</h3></div></div>'
            f'<p class="rcp-ask">{_esc(ask)}</p>')


def _recap_rapid(title, items, eyebrow='Recap',
                 ask='Write your answer down first. Then we turn the card over.'):
    """Three tiles, face up with the question, flipped one per press.

    items = [(question, answer, one line of why)] - three of them. The room
    commits on paper (or out loud, as a show of hands) before each flip.
    """
    tiles = ''
    for i, (q, a, why) in enumerate(items, 1):
        tiles += (f'<div class="rcp-tile" data-rcp-step="{i}">'
                  '<div class="rcp-tile-in">'
                  f'<div class="rcp-face rcp-q"><span class="rcp-n">{i}</span>'
                  f'<p>{_rich(q)}</p></div>'
                  f'<div class="rcp-face rcp-a"><b>{_rich(a)}</b>'
                  f'<span>{_rich(why)}</span></div></div></div>')
    return (f'<div class="stage rcp" data-recap="rapid" data-rcp-steps="{len(items)}">'
            + _head(eyebrow, title, ask)
            + f'<div class="rcp-board rcp-rapid">{tiles}</div>'
            + _ctl('Turn it over')
            + '<div class="stage-rule" aria-hidden="true"></div></div>')


def _recap_sort(title, bins, chips, eyebrow='Recap',
                ask='Decide where each one goes. Say it out loud, then we drop it.'):
    """Two bins and a row of chips, one chip flown home per press.

    bins  = (left label, right label)
    chips = [(text, 'left'|'right', one line of why)]
    """
    left, right = bins
    row = ''
    for i, (text, side, why) in enumerate(chips, 1):
        row += (f'<div class="rcp-chip" data-rcp-step="{i}" data-side="{side}">'
                f'<span>{_rich(text)}</span>'
                f'<em class="rcp-why">{_rich(why)}</em></div>')
    return (f'<div class="stage rcp" data-recap="sort" data-rcp-steps="{len(chips)}">'
            + _head(eyebrow, title, ask)
            + '<div class="rcp-board rcp-sort">'
            + f'<div class="rcp-pool">{row}</div>'
            + '<div class="rcp-bins">'
            + f'<div class="rcp-bin" data-bin="left"><b>{_esc(left)}</b>'
              '<div class="rcp-drop"></div></div>'
            + f'<div class="rcp-bin" data-bin="right"><b>{_esc(right)}</b>'
              '<div class="rcp-drop"></div></div>'
            + '</div></div>'
            + _ctl('Drop it')
            + '<div class="stage-rule" aria-hidden="true"></div></div>')


def _recap_bug(title, lines, wrong, right, culprit, why, eyebrow='Recap',
               ask='One line is lying. Write down its number before we look.'):
    """A worked thing that prints the wrong answer, and the room finds the line.

    lines   = the numbered lines, as strings (code, or the steps of a sum)
    wrong   = what it actually gives
    right   = what it should give
    culprit = the 1-based line number that is wrong
    why     = one line saying what that line does wrong
    Presses: 1 the wrong output, 2 the guilty line, 3 the right output.
    """
    body = ''
    for i, ln in enumerate(lines, 1):
        hot = ' data-culprit="1"' if i == culprit else ''
        body += (f'<div class="rcp-line"{hot}><span class="rcp-ln">{i}</span>'
                 f'<code>{_esc(ln)}</code></div>')
    return (f'<div class="stage rcp" data-recap="bug" data-rcp-steps="3">'
            + _head(eyebrow, title, ask)
            + '<div class="rcp-board rcp-bug">'
            + f'<div class="rcp-code">{body}</div>'
            + '<div class="rcp-out">'
            + f'<div class="rcp-o rcp-o-wrong"><span>It prints</span>'
              f'<b>{_esc(wrong)}</b></div>'
            + f'<div class="rcp-o rcp-o-right"><span>It should print</span>'
              f'<b>{_esc(right)}</b></div>'
            + f'<p class="rcp-why-line">{_rich(why)}</p>'
            + '</div></div>'
            + _ctl('Show me')
            + '<div class="stage-rule" aria-hidden="true"></div></div>')


def _recap_match(title, pairs, eyebrow='Recap',
                 ask='Which two belong together? Call it out, then we join them.'):
    """Six tiles, three pairs, joined one press at a time.

    pairs = [(left tile, right tile, one line of why)] - three pairs. The tiles
    are laid out shuffled, so the room has to look at all six.
    """
    order = [0, 2, 1]                      # a fixed shuffle, not a random one
    lefts = ''.join(
        f'<div class="rcp-card" data-pair="{i}" data-rcp-step="{i + 1}">'
        f'<i class="rcp-badge">{i + 1}</i><span>{_rich(p[0])}</span></div>'
        for i, p in enumerate(pairs))
    rights = ''.join(
        f'<div class="rcp-card rcp-r" data-pair="{j}" data-rcp-step="{j + 1}">'
        f'<i class="rcp-badge">{j + 1}</i><span>{_rich(pairs[j][1])}</span></div>'
        for j in order)
    whys = ''.join(
        f'<p class="rcp-pairwhy" data-rcp-step="{i + 1}" data-pair="{i}">{_rich(p[2])}</p>'
        for i, p in enumerate(pairs))
    return (f'<div class="stage rcp" data-recap="match" data-rcp-steps="{len(pairs)}">'
            + _head(eyebrow, title, ask)
            + '<div class="rcp-board rcp-match">'
            + f'<div class="rcp-col">{lefts}</div>'
            + f'<div class="rcp-col">{rights}</div>'
            + f'<div class="rcp-whys">{whys}</div>'
            + '</div>'
            + _ctl('Join them')
            + '<div class="stage-rule" aria-hidden="true"></div></div>')


# =========================================================================
# CSS and JS for the spine. Append both to the template's {{EXTRA_CSS}} and
# {{EXTRA_JS}}; they are inert on a plan that uses none of the recap formats.
# =========================================================================

SPINE_CSS = """
/* ---- the spine: pictures and title cards ------------------------------ */
/* Five of the six spine cards are the shipped slide itself, the recap card
   among them. The title card is the sixth slide with the session's name drawn
   into it, so it is an <svg> and everything else here is an <img>. */
.spine-pic{margin:0}
.spine-pic img{display:block;width:100%;border-radius:12px}
.tc-wrap{width:100%}
.titlecard{display:block;width:100%;height:auto;border-radius:12px;
  box-shadow:0 1px 2px rgba(20,20,40,.06),0 10px 30px rgba(20,20,40,.08)}

/* ---- recap formats, all four ------------------------------------------ */
.rcp{display:flex;flex-direction:column;gap:12px}
.rcp-ask{margin:0;color:var(--muted);font-size:15px}
.rcp-board{flex:1;min-height:0;display:flex;gap:14px}
.rcp-ctl [data-rcp-next][disabled]{opacity:.45;cursor:default}

/* rapid: three tiles that turn over */
.rcp-rapid{gap:16px}
.rcp-tile{flex:1;perspective:1200px;min-height:210px}
.rcp-tile-in{position:relative;width:100%;height:100%;
  transition:transform var(--dur-base) var(--ease-out);transform-style:preserve-3d}
.rcp-tile.on .rcp-tile-in{transform:rotateY(180deg)}
.rcp-face{position:absolute;inset:0;top:0;right:0;bottom:0;left:0;backface-visibility:hidden;
  border-radius:14px;padding:18px;display:flex;flex-direction:column;
  justify-content:center;gap:10px;border:1px solid var(--rule)}
.rcp-q{background:var(--surface)}
.rcp-q p{margin:0;font-size:19px;line-height:1.35;color:var(--ink)}
.rcp-n{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;
  background:var(--dk-cyan);color:#fff;font-size:14px;font-weight:700}
.rcp-a{background:var(--dk-blue);color:#fff;transform:rotateY(180deg);
  border-color:var(--dk-blue)}
.rcp-a b{font-size:26px;line-height:1.2}
.rcp-a span{font-size:15px;opacity:.9;line-height:1.35}

/* sort: chips fly into a bin */
.rcp-sort{flex-direction:column;gap:14px}
.rcp-pool{display:flex;flex-wrap:wrap;gap:10px;min-height:52px}
.rcp-chip{position:relative;padding:10px 14px;border-radius:999px;
  border:1px solid var(--rule);background:var(--surface);font-size:17px;
  transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-fast) linear}
.rcp-chip .rcp-why{display:none}
.rcp-chip.gone{opacity:0;transform:translateY(-8px) scale(.9)}
/* once every chip is home the empty row goes, so the bins fill the card instead of leaving a white band across it */
.rcp-pool:empty,.rcp-done .rcp-pool{display:none}
.rcp-bins{display:flex;gap:14px;flex:1;min-height:0}
.rcp-bin{flex:1;border:2px dashed var(--rule);border-radius:14px;padding:12px;
  display:flex;flex-direction:column;gap:8px;background:var(--surface)}
.rcp-bin b{font-size:17px;color:var(--dk-blue)}
.rcp-drop{display:flex;flex-direction:column;gap:8px}
.rcp-landed{padding:9px 12px;border-radius:10px;background:#EAF6FC;
  border:1px solid #BEE3F3;font-size:16px;
  animation:rcp-land var(--dur-base) var(--ease-out) both}
/* the chip's own value is the answer, so it reads a size up from the reason
   underneath it. Without this both lines are the same weight and the room
   reads the sentence instead of the value. */
.rcp-landed>span{display:block;font-weight:700;color:var(--dk-blue)}
.rcp-landed em{display:block;font-style:normal;color:var(--muted);font-size:14px;
  margin-top:2px}
@keyframes rcp-land{from{opacity:0;transform:translateY(-14px) scale(.96)}
  to{opacity:1;transform:none}}

/* bug: find the line that lies */
.rcp-bug{gap:16px}
.rcp-code{flex:1.4;background:var(--code-bg);border-radius:12px;padding:14px;
  display:flex;flex-direction:column;justify-content:center;gap:2px;min-width:0}
.rcp-line{display:flex;gap:12px;padding:5px 8px;border-radius:7px;
  transition:background var(--dur-base) var(--ease-out)}
.rcp-ln{color:#7C879B;font:600 14px var(--mono);width:18px;text-align:right}
.rcp-line code{color:var(--code-ink);font:400 16px/1.45 var(--mono);
  white-space:pre-wrap}
.rcp.at-2 .rcp-line[data-culprit],.rcp.at-3 .rcp-line[data-culprit]
  {background:rgba(199,69,78,.28)}
.rcp-out{flex:1;display:flex;flex-direction:column;gap:12px;min-width:0}
/* the two boxes share the column's height rather than stacking at the top of
   it and leaving a hole under them */
.rcp-out .rcp-o{flex:1;display:flex;flex-direction:column;justify-content:center;gap:6px}
/* The two output boxes used to be opacity:0 until the first press, which left
   the whole right half of the card white while the instructor read the program
   out. The box, its dashed edge and its label are up from the start: the room
   can see there are two answers coming and what each one is for. Only the
   answer itself arrives on the press. */
.rcp-o{border-radius:12px;padding:14px;border:2px dashed var(--rule);
  background:transparent;
  transition:background var(--dur-base) var(--ease-out),
             border-color var(--dur-base) var(--ease-out)}
.rcp-o span{display:block;font-size:14px;color:var(--muted)}
.rcp-o b{display:block;min-height:1.3em;font:600 24px/1.3 var(--mono);
  white-space:pre-line;opacity:0;transform:translateY(8px);
  transition:opacity var(--dur-base) var(--ease-out),
             transform var(--dur-base) var(--ease-out)}
.rcp-o-wrong{border-color:#E7B4B8}
.rcp-o-wrong b{color:var(--dk-red)}
.rcp-o-right{border-color:#B7DEC0}
.rcp-o-right b{color:#1B7F3B}
.rcp.at-1 .rcp-o-wrong,.rcp.at-2 .rcp-o-wrong,.rcp.at-3 .rcp-o-wrong,
.rcp.at-3 .rcp-o-right{background:var(--surface);border-style:solid}
.rcp.at-1 .rcp-o-wrong b,.rcp.at-2 .rcp-o-wrong b,.rcp.at-3 .rcp-o-wrong b,
.rcp.at-3 .rcp-o-right b{opacity:1;transform:none}
.rcp-why-line{margin:0;font-size:16px;color:var(--ink);opacity:0;
  transition:opacity var(--dur-base) var(--ease-out)}
.rcp.at-2 .rcp-why-line,.rcp.at-3 .rcp-why-line{opacity:1}

/* match: join the pairs */
/* a grid, not a wrapped flex row: with wrap, the free space in a 16:9 card is
   split evenly between the tile line and the why line, and the card projects
   with a band of white through its middle. Here the tiles take the free row
   and the why lines take exactly what they need. */
.rcp-match{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr auto;
  gap:14px 18px;align-content:stretch}
.rcp-col{flex:1;display:flex;flex-direction:column;gap:10px;min-width:0}
.rcp-card{display:flex;gap:12px;align-items:center;border:1px solid var(--rule);
  background:var(--surface);border-radius:12px;padding:14px;font-size:17px;
  line-height:1.3;transition:transform var(--dur-base) var(--ease-out),
             border-color var(--dur-base) var(--ease-out),
             background var(--dur-base) var(--ease-out)}
.rcp-badge{width:26px;height:26px;border-radius:50%;flex:none;display:grid;
  place-items:center;font:700 14px var(--sans);font-style:normal;
  background:var(--rule2,#EEF0F4);color:transparent;
  transition:background var(--dur-base) var(--ease-out),
             color var(--dur-fast) linear}
/* a joined pair takes a colour of its own, so the room sees which two went
   together rather than one undifferentiated wall of blue */
.rcp-card.on{transform:translateX(4px)}
.rcp-card.rcp-r.on{transform:translateX(-4px)}
.rcp-card.on .rcp-badge{color:#fff}
.rcp-card.on[data-pair="0"]{border-color:#006DAF;background:#EAF4FB}
.rcp-card.on[data-pair="0"] .rcp-badge{background:#006DAF}
.rcp-card.on[data-pair="1"]{border-color:#0F766E;background:#E9F5F3}
.rcp-card.on[data-pair="1"] .rcp-badge{background:#0F766E}
.rcp-card.on[data-pair="2"]{border-color:#B4531A;background:#FBF1E8}
.rcp-card.on[data-pair="2"] .rcp-badge{background:#B4531A}
.rcp-card.on[data-pair="3"]{border-color:#7C3AED;background:#F3EDFE}
.rcp-card.on[data-pair="3"] .rcp-badge{background:#7C3AED}
/* the tiles share the column's height. Left to their own size they sit in a
   band at the top of a 16:9 card and the bottom half projects as white. */
.rcp-col .rcp-card{flex:1}
.rcp-whys{grid-column:1 / -1;display:flex;flex-direction:column;gap:6px;
  justify-content:flex-end}
.rcp-pairwhy{margin:0;font-size:15px;color:var(--muted);display:none;
  padding-left:12px;border-left:3px solid var(--rule)}
.rcp-pairwhy.on{display:block}
.rcp-pairwhy.on[data-pair="0"]{border-color:#006DAF}
.rcp-pairwhy.on[data-pair="1"]{border-color:#0F766E}
.rcp-pairwhy.on[data-pair="2"]{border-color:#B4531A}
.rcp-pairwhy.on[data-pair="3"]{border-color:#7C3AED}

/* Presenter view is a projector, three metres away. Without these the recap
   card is the one card in the plan still set at reading size. */
body.present .rcp{gap:clamp(10px,1.6vh,22px)}
body.present .rcp-ask{font-size:clamp(13px,1.35vw,21px)}
body.present .rcp-card{font-size:clamp(15px,1.6vw,26px);
  padding:clamp(12px,1.8vh,26px) clamp(13px,1.4vw,26px);
  gap:clamp(10px,1.1vw,20px)}
body.present .rcp-badge{width:clamp(24px,2.2vw,38px);height:clamp(24px,2.2vw,38px);
  font-size:clamp(13px,1.25vw,20px)}
body.present .rcp-pairwhy{font-size:clamp(13px,1.35vw,21px)}
body.present .rcp-q p{font-size:clamp(16px,1.75vw,29px)}
body.present .rcp-a b{font-size:clamp(17px,1.9vw,31px)}
body.present .rcp-line code{font-size:clamp(14px,1.5vw,24px)}
body.present .rcp-o b{font-size:clamp(17px,1.9vw,31px)}
body.present .rcp-why-line{font-size:clamp(14px,1.5vw,23px)}
body.present .rcp-chip{font-size:clamp(14px,1.5vw,23px)}
body.present .rcp-bin b{font-size:clamp(15px,1.6vw,25px)}
/* a landed chip had no present-mode size at all, so the one card in the plan
   that carries the recap's answers stayed at reading size on a projector */
body.present .rcp-landed{font-size:clamp(16px,1.9vw,30px);
  padding:clamp(8px,1.2vh,16px) clamp(10px,1.2vw,20px)}
body.present .rcp-landed em{font-size:clamp(12px,1.35vw,21px);margin-top:4px}
body.present .rcp-pool{min-height:clamp(52px,7vh,96px)}

/* ------------------------------------------------------------ full bleed
   The four spine pictures and the two title cards live in a `.pcard`, not a
   `.slide`, so every full-bleed rule written for `.slide` misses them and they
   project postage-stamp sized with the page colour all round. These rules used
   to live in `plan-template.html`, which each build COPIES, so a build started
   from the previous build inherited a stale template and the defect came back
   three times. They live here now: this module is imported from the skill at
   build time, so it cannot go stale. Do not move them back. */
body.present .pcard > .slide-img,body.present .pcard > .spine-pic,
body.present .pcard > .tc-wrap{min-width:0;max-width:none;width:100%;height:100%;
  margin:0;display:flex;align-items:center;justify-content:center}
body.present .pcard > .slide-img img,body.present .pcard > .spine-pic img{
  width:100%;height:100%;object-fit:contain;border:0;border-radius:0;
  background:transparent}
body.present .pcard > .tc-wrap > .titlecard{width:100%;height:100%;max-height:100%;
  object-fit:contain;border-radius:0;box-shadow:none}

@media (prefers-reduced-motion:reduce){
  .rcp *{transition-duration:1ms!important;animation-duration:1ms!important}
}
"""

SPINE_JS = """
/* The recap formats. One controller, four shapes. Each panel owns its own
   arrow keys, so it never fights the card stepper it sits inside. */
(function(){
  var panels = document.querySelectorAll('[data-recap]');
  Array.prototype.forEach.call(panels, function(p){
    var kind  = p.getAttribute('data-recap');
    var total = parseInt(p.getAttribute('data-rcp-steps'), 10) || 0;
    var at    = 0;
    var next  = p.querySelector('[data-rcp-next]');
    var reset = p.querySelector('[data-rcp-reset]');
    var count = p.querySelector('[data-rcp-count]');

    function paint(){
      for (var i = 0; i <= total; i++) p.classList.remove('at-' + i);
      p.classList.add('at-' + at);
      if (count) count.textContent = at + ' / ' + total;
      if (next)  next.disabled = at >= total;
      p.classList.toggle('rcp-done', at >= total);
      if (kind === 'rapid' || kind === 'match'){
        var st = p.querySelectorAll('[data-rcp-step]');
        Array.prototype.forEach.call(st, function(el){
          var n = parseInt(el.getAttribute('data-rcp-step'), 10);
          el.classList.toggle('on', n <= at);
        });
      }
    }

    function drop(n){
      var chip = p.querySelector('.rcp-chip[data-rcp-step="' + n + '"]');
      if (!chip) return;
      var side = chip.getAttribute('data-side');
      var bin  = p.querySelector('.rcp-bin[data-bin="' + side + '"] .rcp-drop');
      if (!bin) return;
      chip.classList.add('gone');
      var why = chip.querySelector('.rcp-why');
      var land = document.createElement('div');
      land.className = 'rcp-landed';
      land.setAttribute('data-rcp-step', n);
      land.innerHTML = '<span>' + chip.querySelector('span').textContent + '</span>'
                     + (why ? '<em>' + why.textContent + '</em>' : '');
      bin.appendChild(land);
    }

    function undropAll(){
      Array.prototype.forEach.call(p.querySelectorAll('.rcp-landed'), function(el){
        el.parentNode.removeChild(el);
      });
      Array.prototype.forEach.call(p.querySelectorAll('.rcp-chip'), function(el){
        el.classList.remove('gone');
      });
    }

    function step(){
      if (at >= total) return;
      at++;
      if (kind === 'sort') drop(at);
      paint();
    }

    function back(){
      if (at <= 0) return;
      if (kind === 'sort'){
        var el = p.querySelector('.rcp-landed[data-rcp-step="' + at + '"]');
        if (el) el.parentNode.removeChild(el);
        var chip = p.querySelector('.rcp-chip[data-rcp-step="' + at + '"]');
        if (chip) chip.classList.remove('gone');
      }
      at--;
      paint();
    }

    if (next)  next.addEventListener('click', step);
    if (reset) reset.addEventListener('click', function(){
      at = 0; undropAll(); paint();
    });

    /* The presenter's arrow key drives it too (keyWidgets() in the DSA
       template): one reveal per press, back undoes the last, then the deck
       moves on. SME 2026-09-25: clicking Next on the recap was irritating. */
    p.setAttribute('data-keystep', '');
    p.keyStep = function(d){
      if (d > 0){ if (at >= total) return false; step(); return true; }
      if (at <= 0) return false;
      back(); return true;
    };
    p.keyReset = function(){ at = 0; undropAll(); paint(); };

    p.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight' || e.key === ' '){ step(); e.stopPropagation(); e.preventDefault(); }
      if (e.key === 'ArrowLeft'){ back(); e.stopPropagation(); e.preventDefault(); }
    });
    p.setAttribute('tabindex', '-1');
    paint();
  });
})();
"""
