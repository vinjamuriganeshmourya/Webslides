"""The two key takeaway cards.

The first version of these was a map, and the map was rejected for the right
reason: a box reading `stop` joined by a line to a box reading `start` is a
picture of vocabulary. It tells a student who already understands slicing
nothing they did not know, and a student who does not understand it cannot get
in. There were no examples on it at all, on a card whose whole job is to be the
thing they look at tomorrow.

So the takeaway **is** the examples. Two boards:

    the slice board     one string, the four slices of it the room has spent
                        the session on, each with the output it actually gives
                        and the one sentence that explains that output
    the method board    one cell per method, with its real line, what that line
                        prints, and which of the two kinds of thing it handed
                        back

Both are laid out as HTML rather than SVG, which is not a detail. The map's
labels had to be measured against their rectangles and a browser check had to
fail the build when one ran over. Text in a box that grows cannot overflow, so
that whole class of defect is gone.

Both arrive one row per press, and both end on the rule that the row above
cannot say on its own: the stop number is never reached, and your own string is
never changed by any of it.
"""
import html

import panels as P

# one colour per concept, reused on both boards so a student who learnt the
# colour on the slice board reads it on the method board without being told
CHIP = {
    'a run': '#006DAF',
    'a jump': '#C77700',
    'nothing': '#8E44AD',
    'isdigit': '#C7454E',
    'strip': '#1F9D62',
    'replace': '#C77700',
    'startswith': '#8E44AD',
    'upper': '#0B5FA5',
}


def _idxbar(s):
    """The string, one box per character, with the index under each. Every
    number in the reasons below points at a box on this row."""
    boxes = "".join(
        f'<span class="tbx"><b>{html.escape(c)}</b><i>{i}</i></span>'
        for i, c in enumerate(s))
    return f'<div class="tstr"><span class="tnm">code</span>{boxes}</div>'


def _kind(lv):
    """What kind of slice a row is, so the chip is decided by the numbers
    rather than typed in beside them."""
    a, b, st = lv
    if a >= b:
        return 'nothing'
    return 'a run' if st == 1 else 'a jump'


# ===================================================== board 1: the slices
SLICE_STEPS = 5
SLICE_LABELS = "a run|a jump|it stops early|nothing at all|the two rules"


def slice_board():
    rows = ""
    for k, ((lv, _why), (ex, got, why)) in enumerate(
            zip(P.TK_SLICE_ROWS, P.tk_slice()), 1):
        kind = _kind(lv)
        out = (f'<span class="tout">{html.escape(got)}</span>' if got
               else '<span class="tout tnone">nothing at all</span>')
        rows += (
            f'<div class="trow tr{k}"><div class="tin">'
            f'<span class="tchip" style="background:{CHIP[kind]}">{kind}'
            '</span>'
            f'<code class="tex">{html.escape(ex)}</code>'
            f'<span class="tarr" aria-hidden="true">&#8594;</span>'
            f'{out}'
            f'<span class="twhy">{html.escape(why)}</span>'
            '</div></div>')
    # the two rules keep a slot of their own too, dashed until the last press,
    # so the bottom third of the card is not white for four presses
    rules = "".join(
        f'<div class="trule"><div class="tin"><b>{html.escape(a)}</b>'
        f'<span>{html.escape(b)}</span></div></div>'
        for a, b in P.tk_slice_rules())
    return ('<div class="tkboard">'
            + _idxbar(P.SLICE_SRC)
            + f'<div class="trows">{rows}</div>'
            + f'<div class="trules">{rules}</div>'
            '</div>')


# ==================================================== board 2: the methods
METHOD_STEPS = 6
METHOD_LABELS = ("isdigit|strip|replace|startswith|upper|"
                 "the two kinds, and the rule")


def method_board():
    cells = ""
    for k, (name, subj, call, val, kind) in enumerate(P.tk_methods(), 1):
        shown = str(val) if isinstance(val, bool) else val
        cells += (
            f'<div class="tcell tc{k}"><div class="tin">'
            f'<span class="tchip" style="background:{CHIP[name]}">{name}'
            '</span>'
            f'<code class="tex"><span class="tsub">{html.escape(subj)}</span>'
            f'<span class="tcall">{html.escape(call)}</span></code>'
            f'<div class="tgot"><span class="tarr" aria-hidden="true">'
            f'&#8594;</span><span class="tout">{html.escape(shown)}</span>'
            '</div>'
            f'<span class="tkind">{kind}</span>'
            '</div></div>')
    asks, gives = P.tk_method_split()
    cells += (
        f'<div class="tcell tc{METHOD_STEPS} tsum"><div class="tin">'
        f'<div class="tsl"><b>{asks}</b> of them answer a question, so you get '
        '<em>True</em> or <em>False</em>.</div>'
        f'<div class="tsl"><b>{gives}</b> of them hand back a new string.</div>'
        '<div class="tsl tlast">Not one of them changes the string you '
        'started with.</div>'
        '</div></div>')
    return f'<div class="tkboard"><div class="tcells">{cells}</div></div>'


def css():
    """One rule set per press, generated from the boards so a row can never be
    revealed on a press that does not exist.

    The row is its own slot. It is drawn as a dashed shell from press 1 and
    what goes in it arrives on its press, so the card is never one row and a
    lot of white while the instructor is still talking, and nothing has to be
    drawn twice to hold the space open.
    """
    out = ['/* --- the two takeaway boards: the examples, one per press --- */']
    for k in range(1, SLICE_STEPS):
        sel = ",".join(f'.tk.an-{s} .tr{k}' for s in range(k, SLICE_STEPS + 1))
        out.append(sel + '{border-style:solid;border-color:#E2E9EF;'
                         'background:#FFFFFF}')
        inner = ",".join(f'.tk.an-{s} .tr{k} .tin'
                         for s in range(k, SLICE_STEPS + 1))
        out.append(inner + '{opacity:1;transform:none}')
    # the rules keep the coloured left bar they are read off, so the left
    # border is named after the ring rather than with it
    out.append(f'.tk.an-{SLICE_STEPS} .trule{{background:#FDF2E6;'
               'border-style:solid;border-color:#E8D4AE;'
               'border-left-color:#E8A13A}')
    out.append(f'.tk.an-{SLICE_STEPS} .trule:last-child{{background:#EAF6FC;'
               'border-color:#BFDDF1;border-left-color:var(--dk-blue)}')
    out.append(f'.tk.an-{SLICE_STEPS} .trule .tin{{opacity:1;'
               'transform:none}')
    for k in range(1, METHOD_STEPS + 1):
        sel = ",".join(f'.tk.an-{s} .tc{k}'
                       for s in range(k, METHOD_STEPS + 1))
        out.append(sel + '{border-style:solid;border-color:#E2E9EF;'
                         'background:#FFFFFF}')
        inner = ",".join(f'.tk.an-{s} .tc{k} .tin'
                         for s in range(k, METHOD_STEPS + 1))
        out.append(inner + '{opacity:1;transform:none}')
    # the summary cell keeps its own blue, so it cannot be overwritten by the
    # white every other cell turns
    out.append(f'.tk.an-{METHOD_STEPS} .tsum{{background:#EAF6FC;'
               'border-color:#BFDDF1}')
    return "\n".join(out)
