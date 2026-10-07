"""The shared white editor card, and the exit answer walked one operation per
press on a card of its own, so the question card carries only the question.
Every value comes from panels.exit_lines(), which runs the real code.
"""
import panels as P


def _from(scope, p, n, sel):
    """`sel` inside `scope` on press p and every press after it."""
    return ",".join(f"{scope}.an-{k} {sel}" for k in range(p, n + 1))


def _code(prefix, lines, file):
    rows = "".join(
        f'<span class="ln {prefix}l{i}"><span class="no">{i}</span>{h}</span>'
        for i, h in enumerate(lines, 1))
    return (f'<div class="ed"><div class="ed-tab"><i></i><i></i><i></i>'
            f'<span>{file}</span></div><pre class="cx">{rows}</pre></div>')


# =================================================== card 4: the exit answer
EXIT_LINES = [
    'seats = <i>int</i>(<i>input</i>())',
    'booked = <i>int</i>(<i>input</i>())',
    'left = seats - booked',
    '<b>for</b> i <b>in</b> <i>range</i>(<i>1</i>, left):',
    '    <b>print</b>(<em>"Seat"</em>, i)',
]


def exit_code(prefix="xq"):
    return _code(prefix, EXIT_LINES, "seats.py")


def _exit_right():
    k = P.EXIT_RIGHT[0]
    return k, P.EXIT_PAIRS[k]


def exit_body():
    k, (seats, booked) = _exit_right()
    left = seats - booked
    lines = P.exit_lines(seats, booked)
    assert not lines, "the exit answer prints something"
    caps = [
        (f"Option {'ABCD'[k]}.", f"seats is {seats} and booked is {booked}."),
        ("Line 3.", f"left is {seats} minus {booked}, which is {left}."),
        ("Line 4.", f"range(1, {left}) starts at 1 and stops before {left}. "
                    "It has no numbers in it."),
        ("Nothing is printed.", "The loop body never runs, so the screen stays empty."),
    ]
    boxes = (f'<div class="varbox xa1"><span class="nm">seats</span>'
             f'<span class="vl"><span class="cv">{seats}</span></span></div>'
             f'<div class="varbox xa1"><span class="nm">booked</span>'
             f'<span class="vl"><span class="cv">{booked}</span></span></div>'
             f'<div class="varbox xa2"><span class="nm">left</span>'
             f'<span class="vl"><span class="cv">{left}</span></span></div>')
    rng = (f'<div class="xa-rng xa3"><span class="xa-expr">range(1, {left})</span>'
           '<span class="xa-empty">no numbers</span></div>')
    capx = "".join(f'<p class="cap xac{i}"><b>{b}</b> {c}</p>'
                   for i, (b, c) in enumerate(caps, 1))
    return (
        '<div class="p2 xa">'
        f'<div>{exit_code("xa")}</div>'
        f'<div>{boxes}{rng}'
        '<pre class="term xa-term"></pre>'
        '<p class="xa-none">nothing printed</p></div>'
        '</div>'
        f'{capx}'), len(caps)


def exit_css(n):
    css = ['/* --- the exit answer, one operation per press --- */',
           '.xastage .cap{display:none}',
           '.xa .varbox,.xa .xa-rng,.xa .xa-none{opacity:0;transition:opacity 240ms var(--ease-out)}']
    rows = {1: [1, 2], 2: [3], 3: [4], 4: [5]}
    for k in range(1, n + 1):
        css.append(f'.xastage.an-{k} .xac{k}{{display:block}}')
        css.append(",".join(f'.xastage.an-{k} .xal{r}' for r in rows[k])
                   + '{background:#CFE9F8;box-shadow:inset 3px 0 0 var(--dk-blue)}')
    css += [
        _from('.xastage', 1, n, '.xa1') + '{opacity:1}',
        _from('.xastage', 2, n, '.xa2') + '{opacity:1}',
        _from('.xastage', 3, n, '.xa3') + '{opacity:1}',
        _from('.xastage', 3, n, '.xa-empty') + '{opacity:1}',
        _from('.xastage', 4, n, '.xa-none') + '{opacity:1}',
        '.xastage.an-4 .xal5{opacity:.3;background:none;box-shadow:none}',
    ]
    return "\n".join(css)


CSS = r"""
/* ---------- shared: a white editor card with a file tab ---------- */
.ed{background:#fff;border:1px solid #DCE6EE;border-radius:12px;overflow:hidden;
  box-shadow:0 6px 18px rgba(16,40,70,.06)}
.ed .cx{background:#fff;border-radius:0}
.ed-tab{display:flex;align-items:center;padding:8px 12px;background:#F4F7FA;
  border-bottom:1px solid #E3EAF0;font:600 12.5px var(--sans);color:#5B6573}
.ed-tab i{width:9px;height:9px;border-radius:50%;background:#D5DCE3;margin-right:6px}
.ed-tab span{margin-left:8px}
body.present .ed-tab{font-size:clamp(11px,1.05vw,17px);padding:clamp(6px,.9vh,12px) clamp(10px,1vw,16px)}

/* ---------- card 4: the exit answer ---------- */
.xa>div{justify-content:safe center}
.xa-rng{display:flex;align-items:center;gap:14px;margin:4px 0 12px}
.xa-expr{font:700 clamp(16px,1.8vw,28px) var(--mono);color:var(--dk-blue)}
.xa-empty{padding:6px 16px;border:2px dashed #E3A7AC;border-radius:9px;color:#C7454E;
  font:700 clamp(12px,1.2vw,19px) var(--sans);opacity:0;transition:opacity 240ms var(--ease-out)}
.xa .xa-term{flex:none;min-height:clamp(60px,10vh,120px);background:#fff;border:1px solid #DCE6EE}
.xa .xa-term:empty::before{content:''}
.xa-none{margin:8px 0 0;font:700 clamp(13px,1.35vw,21px) var(--sans);color:#C7454E}
@media (prefers-reduced-motion: reduce){
  .xa .varbox,.xa-empty{transition-duration:1ms}
}
"""


def css():
    return chr(10).join([CSS, exit_css(exit_body()[1])])
