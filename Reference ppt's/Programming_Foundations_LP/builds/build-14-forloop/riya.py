"""The coding challenge after the range dial: Riya's odd-day savings.

Riya saves only on odd days, and on odd day d she puts in d rupees. The loop
has to work out a total, not print the range back, which is the whole reason
this replaced "Meera's revision plan" (no problem statement) on 2026-09-28.

Three cards:

  story_body()    Riya and her piggy bank, a seven-day calendar, a coin that
                  drops into the slot on every odd day, and one speech bubble per
                  press. The rule sits at the bottom from press 1.
  problem_body()  The problem statement, deck style: what to read, what to print,
                  two samples, a timer, and a hint that arrives on press 2.
  walk_body()     The answer, one day per press, with n = 7. total keeps its
                  history, the day boxes are used up, the piggy fills.

Every number on these cards comes from panels.riya_days() or riya_total(),
which run the real code. Nothing is typed.
"""
import html

import panels as P
from story import _code, _from

N = P.RIYA_N
DAYS = P.riya_days(N)                 # (day, saved that day, total after it)
TOTAL = DAYS[-1][2]
ODD = [d for d, put, _t in DAYS if put]


def rs(v):
    return f"&#8377;{v}"


# ======================================================= the two characters
def riya_svg(cls="rs-riya"):
    return (
        f'<svg class="{cls}" viewBox="0 0 236 300" xmlns="http://www.w3.org/2000/svg" '
        'role="img" aria-label="Riya, a college student">'
        '<ellipse cx="110" cy="290" rx="70" ry="8" fill="#1E3A5F" opacity=".10"/>'
        # ponytail behind the head
        '<path d="M150 70 C188 78 190 132 168 156 C176 124 166 100 146 92 Z" fill="#2E1E1A"/>'
        # body: a kurta top, shoulders, arms
        '<path d="M52 288 C52 214 72 176 110 176 C148 176 168 214 168 288 Z" fill="#3FB5E5"/>'
        '<path d="M92 178 L110 206 L128 178 Z" fill="#E9F7FD"/>'
        '<rect x="30" y="196" width="26" height="74" rx="13" fill="#3FB5E5" '
        'transform="rotate(14 43 196)"/>'
        '<rect x="164" y="190" width="26" height="70" rx="13" fill="#3FB5E5" '
        'transform="rotate(-38 177 190)"/>'
        '<circle cx="42" cy="268" r="13" fill="#E8B48A"/>'
        '<circle cx="206" cy="150" r="13" fill="#E8B48A"/>'
        # neck and head
        '<rect x="98" y="148" width="24" height="32" rx="10" fill="#E0A77C"/>'
        '<circle cx="110" cy="104" r="50" fill="#F0C29B"/>'
        # hair: crown and fringe
        '<path d="M60 104 C56 58 86 42 112 44 C146 44 166 66 160 104 '
        'C150 82 132 70 108 72 C88 74 72 86 60 104 Z" fill="#2E1E1A"/>'
        '<circle cx="152" cy="74" r="9" fill="#F25C8A"/>'
        # face
        '<ellipse cx="92" cy="106" rx="5" ry="6.5" fill="#1E2227"/>'
        '<ellipse cx="128" cy="106" rx="5" ry="6.5" fill="#1E2227"/>'
        '<circle cx="94" cy="104" r="1.6" fill="#fff"/><circle cx="130" cy="104" r="1.6" fill="#fff"/>'
        '<path d="M84 94 Q92 89 100 93" stroke="#2E1E1A" stroke-width="3" fill="none" '
        'stroke-linecap="round" class="rs-brow"/>'
        '<path d="M120 93 Q128 89 136 94" stroke="#2E1E1A" stroke-width="3" fill="none" '
        'stroke-linecap="round" class="rs-brow"/>'
        '<circle cx="80" cy="124" r="7" fill="#F29B9B" opacity=".55"/>'
        '<circle cx="140" cy="124" r="7" fill="#F29B9B" opacity=".55"/>'
        '<path class="rs-smile" d="M96 126 Q110 140 124 126" stroke="#8A3B2E" '
        'stroke-width="3.5" fill="none" stroke-linecap="round"/>'
        '<ellipse class="rs-worry" cx="110" cy="132" rx="7" ry="8" fill="#8A3B2E"/>'
        '</svg>')


def piggy_svg(cls="rs-pig"):
    return (
        f'<svg class="{cls}" viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" '
        'role="img" aria-label="A pink piggy bank with a face">'
        '<ellipse cx="120" cy="190" rx="84" ry="7" fill="#1E3A5F" opacity=".10"/>'
        '<path d="M34 112 C18 108 16 90 28 88" stroke="#E47FA6" stroke-width="5" '
        'fill="none" stroke-linecap="round"/>'
        '<rect x="62" y="150" width="22" height="34" rx="9" fill="#EE93B6"/>'
        '<rect x="150" y="150" width="22" height="34" rx="9" fill="#EE93B6"/>'
        '<ellipse cx="120" cy="116" rx="88" ry="64" fill="#F7A8C4" stroke="#E47FA6" stroke-width="3"/>'
        '<path d="M142 58 L160 30 L172 66 Z" fill="#EE93B6" stroke="#E47FA6" stroke-width="3" '
        'stroke-linejoin="round"/>'
        '<rect x="96" y="52" width="46" height="9" rx="4.5" fill="#B85C82"/>'
        '<ellipse cx="204" cy="120" rx="22" ry="19" fill="#F28DB3" stroke="#E47FA6" stroke-width="3"/>'
        '<ellipse cx="198" cy="120" rx="3.5" ry="5" fill="#B85C82"/>'
        '<ellipse cx="211" cy="120" rx="3.5" ry="5" fill="#B85C82"/>'
        '<ellipse cx="168" cy="98" rx="6" ry="7.5" fill="#1E2227"/>'
        '<circle cx="170" cy="95" r="2" fill="#fff"/>'
        '<circle cx="176" cy="126" r="8" fill="#F27BA5" opacity=".5"/>'
        '<path class="pg-smile" d="M160 140 Q174 152 188 140" stroke="#B85C82" '
        'stroke-width="3.5" fill="none" stroke-linecap="round"/>'
        '<path class="pg-sad" d="M162 148 Q174 138 186 148" stroke="#B85C82" '
        'stroke-width="3.5" fill="none" stroke-linecap="round"/>'
        '</svg>')


def _coin(v, cls):
    return f'<span class="rs-coin {cls}">{rs(v)}</span>'


# =========================================================== card 1: the story
# (speaker, what they say). Numbers come from DAYS.
def _story():
    d1, d2, d3 = DAYS[0], DAYS[1], DAYS[2]
    late = [d for d, put, _t in DAYS[3:] if put]
    return [
        ("r", "I want to save money. But I will save only on <b>odd days</b>."),
        ("r", f"Day {d1[0]} is odd. I put in <b>{rs(d1[1])}</b>."),
        ("p", f"Day {d2[0]} is even. <b>Nothing</b> for me today!"),
        ("r", f"Day {d3[0]} is odd. I put in <b>{rs(d3[1])}</b>."),
        ("p", " ".join(f"Day {d} gives {rs(d)}." for d in late)
         + f" Now I have <b>{rs(TOTAL)}</b>!"),
        ("r", "What about 30 days? Or a whole year? "
              "I can't add all that by hand!"),
    ]


STORY = _story()
STORY_STEPS = len(STORY)
STORY_LABELS = "the plan|day 1|day 2|day 3|up to day 7|your turn"
# the press on which each day is revealed, and the piggy's amount per press
DAY_AT = {1: 2, 2: 3, 3: 4}
DAY_AT.update({d: 5 for d, _p, _t in DAYS[3:]})
AMT = [0] + [max([t for d, _p, t in DAYS if DAY_AT[d] <= k] or [0])
             for k in range(2, STORY_STEPS + 1)]


def story_body():
    days = "".join(
        f'<div class="rs-day rsd{d}"><span class="rs-dl">Day {d}</span>'
        + (_coin(put, "in") if put else '<span class="rs-skip">skip</span>')
        + '</div>' for d, put, _t in DAYS)
    bubbles = "".join(
        f'<p class="rs-bub {who} rsb{k}">{txt}</p>'
        for k, (who, txt) in enumerate(STORY, 1))
    amts = "".join(f'<b class="rsa{k}">{rs(a)}</b>' for k, a in enumerate(AMT, 1))
    drops = "".join(_coin(d, f"drop rsc{d}") for d in ODD)
    return (
        '<div class="rs">'
        f'<div class="rs-cal">{days}</div>'
        '<div class="rs-scene">'
        f'<div class="rs-who">{riya_svg()}<span class="rs-name">Riya</span></div>'
        f'<div class="rs-talk">{bubbles}</div>'
        '<div class="rs-bank">'
        f'<div class="rs-pigbox">{drops}{piggy_svg()}</div>'
        f'<div class="rs-amt"><span>in the piggy bank</span>{amts}</div>'
        '</div>'
        '</div>'
        '</div>'
        '<p class="cap rs-rule"><b>Riya\'s rule:</b> on an odd day <b>d</b>, she saves '
        f'{rs("d")}. On an even day, she saves nothing.</p>'
        '<p class="cap rs-ask"><b>Your turn.</b> Write a program that works out '
        'Riya\'s money for any number of days.</p>')


def story_css():
    n = STORY_STEPS
    css = ['/* --- Riya: the story, one bubble per press --- */',
           '.rs-bub,.rs-amt b,.rs-ask{display:none}']
    for k, (who, _t) in enumerate(STORY, 1):
        css.append(f'.rsstage.an-{k} .rsb{k}{{display:block}}')
        css.append(f'.rsstage.an-{k} .rsa{k}{{display:block}}')
    for d, put, _t in DAYS:
        p = DAY_AT[d]
        css.append(_from('.rsstage', p, n, f'.rsd{d}')
                   + ('{border-style:solid;border-color:#F5B82E;background:#FFF8E6}'
                      if put else '{border-style:solid;border-color:#DCE3EA;background:#F3F5F7}'))
        css.append(_from('.rsstage', p, n, f'.rsd{d} .in') + ','
                   + _from('.rsstage', p, n, f'.rsd{d} .rs-skip')
                   + '{opacity:1;transform:none}')
        if put:
            # the coin drops into the slot on the press that day arrives
            late = [x for x, pp, _ in DAYS if pp and DAY_AT[x] == p]
            delay = late.index(d) * 420
            css.append(f'.rsstage.an-{p} .rsc{d}{{animation:rsdrop 900ms var(--ease-out) '
                       f'{delay}ms both}}')
    css += [
        '.rsstage.an-3 .pg-smile{opacity:0}.rsstage.an-3 .pg-sad{opacity:1}',
        f'.rsstage.an-{n} .rs-smile{{opacity:0}}.rsstage.an-{n} .rs-worry{{opacity:1}}',
        f'.rsstage.an-{n} .rs-rule{{display:none}}.rsstage.an-{n} .rs-ask{{display:block}}',
        f'.rsstage.an-{n} .rs-amt{{box-shadow:0 0 0 3px #3FB5E5}}',
    ]
    return "\n".join(css)


# ========================================================= card 2: the problem
def problem_body():
    io = "".join(
        f'<div class="rp-io"><span class="rp-k">Input</span><code>{n}</code>'
        f'<span class="rp-k">Output</span><code>{P.riya_total(n)}</code></div>'
        for n in P.RIYA_SAMPLES)
    first = P.RIYA_SAMPLES[0]
    return (
        '<div class="p2 rp">'
        '<div>'
        '<div class="rp-card">'
        '<p class="rp-tag">Problem</p>'
        '<p class="rp-h">Riya\'s savings</p>'
        '<p class="rp-t">Read a number <b>n</b>. Print the total money Riya saves '
        'from <b>day 1 to day n</b>, both days included.</p>'
        f'<p class="rp-t">On an odd day <b>d</b>, she saves {rs("d")}. '
        'On an even day, she saves nothing.</p>'
        f'<div class="rp-ios">{io}</div>'
        '</div>'
        '</div>'
        '<div>'
        '<p class="lede">Open the <b>playground</b>. Write Riya\'s program.</p>'
        '<ol class="gdo rp-do">'
        f'<li>Run it with <b>{first}</b>. It must print <b>{P.riya_total(first)}</b>.</li>'
        f'<li>Then run it with <b>{P.RIYA_TEST}</b>. Keep that answer ready.</li>'
        '</ol>'
        '<span class="tmr" data-secs="240"></span>'
        '<div class="rp-hint"><span class="rp-hk">Hint</span>'
        '<span class="rp-hx"><code>day % 2 == 1</code> is True only when '
        '<b>day</b> is odd.</span></div>'
        '</div>'
        '</div>')


PROBLEM_STEPS = 2
PROBLEM_LABELS = "the problem|the hint"


def problem_css():
    return "\n".join([
        '/* --- Riya: the problem card --- */',
        '.rpstage.an-2 .rp-hint{border-style:solid;border-color:#3FB5E5;background:#EAF6FC}',
        '.rpstage.an-2 .rp-hx{opacity:1}',
    ])


# ============================================= card 3: the answer, day by day
RIYA_LINES = [
    'n = <i>int</i>(<i>input</i>())',
    'total = <i>0</i>',
    '<b>for</b> day <b>in</b> <i>range</i>(<i>1</i>, n + <i>1</i>):',
    '    <b>if</b> day % <i>2</i> == <i>1</i>:',
    '        total = total + day',
    '<b>print</b>(total)',
]


def _walk():
    """(line on now, lines already run, dimmed line, day on now or None,
    days used, total so far, printed, bold, caption)"""
    steps = [(2, [1], None, None, 0, 0, "",
              "Lines 1 and 2", f"n is {N}. total starts at 0.")]
    prev = 0
    for i, (d, put, tot) in enumerate(DAYS, 1):
        if put:
            steps.append((5, [3, 4], None, d, i - 1, tot, "",
                          f"Day {d}", f"{d} is odd. total goes from {prev} to {tot}."))
        else:
            steps.append((4, [3], 5, d, i - 1, tot, "",
                          f"Day {d}", f"{d} is even. The if is False, so total stays {tot}."))
        prev = tot
    steps.append((3, [], None, None, N, TOTAL, "",
                  "No days left", f"range stops before {N + 1}. The loop ends."))
    steps.append((6, [1, 2, 3, 4, 5], None, None, N, TOTAL, str(TOTAL),
                  "Line 6", f"It prints {TOTAL}. That is Riya's money after {N} days."))
    return steps


WALK = _walk()
WALK_STEPS = len(WALK)
WALK_LABELS = "|".join(s[7].lower() for s in WALK)


def _history():
    out, seen = [], []
    for s in WALK:
        t = s[5]
        if not seen or seen[-1] != t:
            seen = seen + [t]
        out.append(list(seen))
    return out


def walk_body():
    boxes = "".join(
        f'<span class="rk-b rkb{d}"><b>{d}</b>'
        f'<i>{"+" + str(put) if put else "skip"}</i></span>'
        for d, put, _t in DAYS)
    vals = ""
    for k, h in enumerate(_history(), 1):
        bits = []
        for i, v in enumerate(h):
            if i:
                bits.append('<span class="ar">-&gt;</span>')
            bits.append(f'<span class="{"cv" if i == len(h) - 1 else "ov"}">{v}</span>')
        vals += f'<span class="vl rkv{k}">' + "".join(bits) + '</span>'
    drops = "".join(_coin(d, f"drop rkc{d}") for d in ODD)
    amts = "".join(f'<b class="rka{k}">{rs(s[5])}</b>' for k, s in enumerate(WALK, 1))
    terms = "".join(f'<pre class="term rkt{k}">{html.escape(s[6])}</pre>'
                    for k, s in enumerate(WALK, 1))
    caps = "".join(f'<p class="cap rkc rkcap{k}"><b>{s[7]}</b> {s[8]}</p>'
                   for k, s in enumerate(WALK, 1))
    return (
        '<div class="p2 rk">'
        '<div>'
        f'{_code("rk", RIYA_LINES, "riya.py")}'
        f'<p class="rk-in">input: <code>{N}</code></p>'
        '</div>'
        '<div>'
        f'<div class="rk-row"><span class="nm">day</span>{boxes}</div>'
        '<div class="rk-mid">'
        f'<div class="varbox rk-total"><span class="nm">total</span>{vals}</div>'
        f'<div class="rk-bank"><div class="rs-pigbox">{drops}{piggy_svg("rk-pig")}</div>'
        f'<div class="rk-amt">{amts}</div></div>'
        '</div>'
        f'{terms}'
        '</div>'
        '</div>'
        f'{caps}')


def walk_css():
    css = ['/* --- Riya: the answer, one day per press --- */',
           '.rk .vl,.rk .term,.rkstage .rkc,.rk-amt b{display:none}']
    for k, (now, ran, dim, day, used, _t, _o, _b, _c) in enumerate(WALK, 1):
        a = f'.rkstage.an-{k}'
        css.append(f'{a} .rkl{now}{{background:#CFE9F8;box-shadow:inset 3px 0 0 var(--dk-blue)}}')
        if ran:
            css.append(",".join(f'{a} .rkl{i}' for i in ran) + '{background:#EAF6FC}')
        if dim:
            css.append(f'{a} .rkl{dim}{{opacity:.3}}')
        done = [d for d, _p, _t in DAYS[:used]]
        if done:
            css.append(",".join(f'{a} .rkb{d}' for d in done) + '{opacity:.45}')
            css.append(",".join(f'{a} .rkb{d} i' for d in done) + '{opacity:1}')
        if day:
            css.append(f'{a} .rkb{day}{{border-color:var(--dk-blue);background:#DCF0FB;'
                       'box-shadow:0 0 0 4px rgba(0,109,175,.14)}')
            css.append(f'{a} .rkb{day} i{{opacity:1}}')
            if day in ODD:
                css.append(f'{a} .rkc{day}{{animation:rsdrop 900ms var(--ease-out) both}}')
        css.append(f'{a} .rkv{k}{{display:flex}}')
        css.append(f'{a} .rkt{k}{{display:block}}')
        css.append(f'{a} .rkcap{k}{{display:block}}')
        css.append(f'{a} .rka{k}{{display:block}}')
    return "\n".join(css)


# ======================================================================= CSS
CSS = r"""
/* ---------- the characters ---------- */
.rs-smile,.pg-smile{opacity:1;transition:opacity 200ms var(--ease-out)}
.rs-worry,.pg-sad{opacity:0;transition:opacity 200ms var(--ease-out)}
.rs-coin{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;
  width:clamp(30px,2.9vw,48px);height:clamp(30px,2.9vw,48px);
  background:radial-gradient(circle at 35% 30%,#FFE08A,#F5B82E 70%);border:2px solid #D99A12;
  font:800 clamp(11px,1.05vw,17px) var(--sans);color:#7A4E00}
.rs-coin.drop{position:absolute;left:50%;top:0;margin-left:calc(clamp(30px,2.9vw,48px) / -2);
  opacity:0;z-index:2}
@keyframes rsdrop{0%{opacity:0;transform:translateY(-60%)}15%{opacity:1}
  70%{opacity:1;transform:translateY(95%)}100%{opacity:0;transform:translateY(120%) scale(.6)}}

/* ---------- card 1: the story ---------- */
.rs{display:flex;flex-direction:column;flex:1;min-height:0;gap:clamp(8px,1.6vh,20px)}
.rs-cal{display:flex;gap:clamp(6px,.8vw,12px)}
.rs-day{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;
  padding:clamp(6px,1vh,12px) 4px;border:2px dashed #CBD7E1;border-radius:12px;
  background:rgba(255,255,255,.55)}
.rs-dl{font:700 clamp(11px,1.05vw,16px) var(--sans);color:#5B6573}
.rsstage .rs-day .in,.rsstage .rs-day .rs-skip{opacity:0;transform:scale(.6);
  transition:opacity 260ms var(--ease-out),transform 260ms var(--ease-out)}
.rs-skip{height:clamp(30px,2.9vw,48px);display:flex;align-items:center;
  font:700 clamp(11px,1.05vw,16px) var(--sans);color:#98A2AC;text-decoration:line-through}
.rs-scene{flex:1;min-height:0;display:flex;align-items:stretch;gap:2%}
.rs-who,.rs-bank{flex:none;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-height:0}
.rs-riya{flex:1 1 auto;min-height:0;height:100%;width:auto;max-height:420px}
.rs-name{font:800 clamp(13px,1.3vw,20px) var(--sans);color:#0B5FA5;margin-top:2px}
.rs-talk{flex:1;min-width:0;align-self:center;display:flex;flex-direction:column}
.rs-bub{position:relative;margin:0;max-width:92%;padding:clamp(10px,1.6vh,18px) clamp(14px,1.4vw,22px);
  border-radius:18px;background:#fff;border:2px solid #CFE0EC;
  box-shadow:0 8px 20px rgba(16,40,70,.08);
  font:600 clamp(17px,2vw,32px)/1.35 var(--sans);color:#1E2A36}
.rs-bub b{color:#0B5FA5}
.rs-bub.r{align-self:flex-start;border-color:#9BD3EE}
.rs-bub.p{align-self:flex-end;border-color:#F4B6CD;background:#FFF5F9}
.rs-bub.p b{color:#C2396F}
.rs-bub::after{content:"";position:absolute;bottom:18px;width:18px;height:18px;
  background:inherit;border:inherit;border-top:0;border-right:0}
.rs-bub.r::after{left:-11px;transform:rotate(45deg)}
.rs-bub.p::after{right:-11px;transform:rotate(-135deg)}
.rs-pigbox{position:relative;padding-top:clamp(30px,5vh,56px)}
.rs-bank .rs-pigbox{flex:1 1 auto;min-height:0;display:flex;align-items:flex-end}
.rs-pig{height:auto;width:clamp(170px,19vw,300px);max-height:100%;display:block}
.rs-amt{margin-top:6px;padding:6px 16px;border-radius:12px;background:#fff;border:1px solid #F4B6CD;
  text-align:center}
.rs-amt span{display:block;font:600 clamp(10px,.95vw,14px) var(--sans);color:#8A96A3}
.rs-amt b{font:800 clamp(20px,2.3vw,38px)/1.1 var(--sans);color:#C2396F}
.rs-ask{background:#EAF6FC}

/* ---------- card 2: the problem ---------- */
.rp>div{justify-content:safe center}
.rp-card{background:#fff;border:1px solid #DCE6EE;border-radius:14px;
  padding:clamp(14px,2.2vh,26px) clamp(16px,1.6vw,26px);box-shadow:0 8px 20px rgba(16,40,70,.06)}
.rp-tag{display:inline-block;margin:0 0 6px;padding:3px 10px;border-radius:999px;background:#E7F1FA;
  font:700 clamp(10px,.95vw,14px) var(--sans);color:#006DAF;letter-spacing:.06em;text-transform:uppercase}
.rp-h{margin:0 0 8px;font:800 clamp(18px,2vw,32px) var(--sans);color:#1E2A36}
.rp-t{margin:0 0 8px;font:clamp(14px,1.45vw,23px)/1.45 var(--sans);color:#39404B}
.rp-t b{color:#0B5FA5}
.rp-ios{display:flex;gap:clamp(8px,1vw,16px);margin-top:10px}
.rp-io{flex:1;display:grid;grid-template-columns:auto 1fr;gap:4px 12px;align-items:center;
  padding:10px 14px;border-radius:10px;background:#F4F7FA;border:1px solid #E3EAF0}
.rp-k{font:700 clamp(10px,.95vw,14px) var(--sans);color:#8A96A3;text-transform:uppercase;letter-spacing:.05em}
.rp-io code{font:700 clamp(15px,1.6vw,26px) var(--mono);color:#1E2A36}
.rp-do{font-size:clamp(14px,1.45vw,22px);line-height:1.7;margin:0 0 12px;padding-left:1.3em}
.rp-hint{display:flex;align-items:center;gap:12px;margin-top:14px;padding:10px 14px;
  border:2px dashed #CBD7E1;border-radius:12px}
.rp-hk{flex:none;padding:3px 10px;border-radius:999px;background:#3FB5E5;color:#fff;
  font:700 clamp(11px,1vw,15px) var(--sans)}
.rp-hx{opacity:0;font:clamp(13px,1.35vw,21px)/1.4 var(--sans);color:#1E2A36;
  transition:opacity 260ms var(--ease-out)}

/* ---------- card 3: the answer, day by day ---------- */
.rk>div{justify-content:safe center}
.rk .term{flex:none;min-height:clamp(40px,6vh,70px);background:#fff;color:#1E2A36;border:1px solid #DCE6EE}
.rk .term:empty::before{content:'output'}
.rk-in{margin:10px 0 0;font:600 clamp(12px,1.2vw,18px) var(--sans);color:#5B6573}
.rk-row{display:flex;align-items:center;gap:clamp(4px,.6vw,9px);margin-bottom:12px}
.rk-row .nm{flex:none;margin-right:6px;font:600 clamp(13px,1.4vw,21px) var(--sans);color:var(--dk-line)}
.rk-b{flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;
  width:clamp(42px,4.2vw,68px);height:clamp(54px,5.4vw,86px);border-radius:10px;
  border:2px solid var(--dk-cyan);background:#F3FBFE;
  transition:opacity 220ms var(--ease-out)}
.rk-b b{font:700 clamp(17px,1.9vw,30px) var(--mono);color:#1E2A36}
.rk-b i{font:700 clamp(10px,1vw,15px) var(--sans);font-style:normal;color:#B07A00;opacity:0}
.rk-mid{display:flex;align-items:center;gap:clamp(10px,1.4vw,24px);margin-bottom:10px}
.rk-total{flex:1;min-width:0;margin:0}
.rk-bank{flex:none;display:flex;align-items:center;gap:8px}
.rk-bank .rs-pigbox{padding-top:clamp(18px,3vh,32px)}
.rk-pig{width:clamp(110px,11vw,180px);height:auto;display:block}
.rk-amt b{font:800 clamp(20px,2.3vw,38px) var(--sans);color:#C2396F}
body.present .rk .cx,.rk .cx{font-size:clamp(15px,1.75vw,28px)}
.rk-row,.rk-mid{margin-bottom:clamp(12px,2.4vh,28px)}
@media (prefers-reduced-motion: reduce){
  .rs-coin.drop{animation:none!important}
  .rs-day .in,.rs-skip,.rp-hx,.rk-b,.rs-smile,.rs-worry,.pg-smile,.pg-sad{transition-duration:1ms}
}
"""


def css():
    return "\n".join([CSS, story_css(), problem_css(), walk_css()])
