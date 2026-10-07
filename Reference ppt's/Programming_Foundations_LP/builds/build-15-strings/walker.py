"""Two walkers.

`reveal_body()` is worksheet task 3: the prompt and the answer on one card.
Press 1 is the task, the program on the left and the instructions and the timer
on the right. Every press after that replaces the instructions with the answer,
one operation at a time, on the same card, so the program the room traced never
leaves the screen. What strip takes off VANISHES. CSS only, driven by the
template's `data-anim` controller.

`explainer_body()` is the animated explainer. It walks `strip` one character at
a time from each end. The characters it eats vanish; the character that stopped
it is marked; and any character in the middle that IS in the set but was never
reached goes `never` and STAYS that way after the run ends. That persistence is
the finding, and it is the whole reason the exit question works.

The steps are computed from the chosen set of characters, never hard-coded, so
a second walk with a different set is not a lie.
"""
import html

import panels as P

# ======================================================= worksheet task 3
SRC3 = P.TASK3_START                       # '  0912  '
_L1, _R1, KEPT1, _ = P.strip_walk(SRC3, None)
GONE_2 = sorted(_L1 + _R1)                 # what line 2 takes off
_S2 = SRC3.strip()
_L2, _R2, KEPT2, _ = P.strip_walk(_S2, '0')
GONE_3 = sorted(GONE_2 + [KEPT1[i] for i in _L2 + _R2])
KEPT_3 = [KEPT1[i] for i in KEPT2]         # the boxes still standing
_A, _B, _C = P.TASK3_SLICE
MARK_5 = [KEPT_3[i] for i in range(_A, _B, _C) if i < len(KEPT_3)]

T3_PROG = [
    ('pin = <em>"  0912  "</em>', 'pin = "  0912  "'),
    ('pin = pin.<i>strip</i>()', 'pin = pin.strip()'),
    ('pin = pin.<i>strip</i>(<em>"0"</em>)', 'pin = pin.strip("0")'),
    ('<b>if</b> pin.<i>isdigit</i>():', 'if pin.isdigit():'),
    ('    <b>print</b>(pin[<i>0</i>:<i>4</i>:<i>2</i>])', '    print(pin[0:4:2])'),
    ('<b>else</b>:', 'else:'),
    ('    <b>print</b>(<em>"no"</em>)', '    print("no")'),
]

_ROWS = P.task3_rows()
_PIN = {n: v for n, v, _o in _ROWS}
_PRINTED = P.task3_printed()

#  (now, ran, dead, gone, mark, pin, out, bold, caption)
T3_STEPS = [
    (None, [], [], [], [], None, [],
     'Worksheet task 3',
     'Fill the table yourself first. Nothing here moves until hands are off '
     'keyboards.'),
    (1, [], [], [], [], _PIN[1], [],
     'Line 1',
     'pin holds eight characters. The grey dots are the two spaces at each '
     'end.'),
    (2, [1], [], GONE_2, [], _PIN[2], [],
     'Line 2',
     'strip with nothing in the brackets takes spaces off each end. On the '
     'left it stops at 0, on the right it stops at 2.'),
    (3, [1, 2], [], GONE_3, [], _PIN[3], [],
     'Line 3',
     'strip("0") takes the 0 off the left. On the right it meets 2, which is '
     'not a 0, so it stops there and looks no further.'),
    (4, [1, 2, 3], [], GONE_3, [], _PIN[4], [],
     'Line 4',
     'Everything left is a digit, so isdigit gives True and line 5 runs.'),
    (5, [1, 2, 3, 4], [], GONE_3, MARK_5, _PIN[5], list(_PRINTED),
     'Line 5',
     'The slice starts at 0 and jumps two, so it lands on the first and the '
     'third of what is left.'),
    (None, [1, 2, 3, 4, 5], [6, 7], GONE_3, MARK_5, _PIN[5], list(_PRINTED),
     'Lines 6 and 7',
     'Neither of them ever ran. The else belongs to a question that was '
     'already answered yes, so it is skipped and it stays skipped.'),
]

REVEAL_STEPS = len(T3_STEPS)
REVEAL_LABELS = "|".join(b.lower() for (*_r, b, _c) in T3_STEPS)


def _dots(s):
    """A space you can see. The guide names the grey dot once."""
    return html.escape(s).replace(' ', '<span class="sp">&middot;</span>')


def _t3_code():
    out = []
    for i, (markup, _plain) in enumerate(T3_PROG, 1):
        out.append(f'<span class="ln twl{i}"><span class="no">{i}</span>'
                   f'{markup}</span>')
    return '<pre class="cx">' + "".join(out) + '</pre>'


def _t3_boxes():
    cells = ""
    for i, ch in enumerate(SRC3):
        cls = 'bx twb' + str(i) + (' spc' if ch == ' ' else '')
        cells += f'<span class="{cls}">{_dots(ch)}</span>'
    return f'<div class="seqbar twsq">{cells}</div>'


def _chips(vals):
    if not vals:
        return '<span class="vl none">not set yet</span>'
    bits = []
    for i, v in enumerate(vals):
        if i:
            bits.append('<span class="ar">-&gt;</span>')
        cls = 'cv' if i == len(vals) - 1 else 'ov'
        bits.append(f'<span class="{cls}">{_dots(v)}</span>')
    return '<span class="vl">' + "".join(bits) + '</span>'


def _pin_history():
    """Every value pin has held, in order, one list per press. A value joins
    the list only when it actually changes, so the room reads the change
    instead of a box that quietly swaps its contents."""
    out, seen = [], []
    for row in T3_STEPS:
        v = row[5]
        if v is not None and (not seen or seen[-1] != v):
            seen = seen + [v]
        out.append(list(seen))
    return out


T3_ASK = (
    '<div class="t3ask">'
    '<p class="lede">Open <b>worksheet task 3</b>. Fill every row of the table '
    'by hand before you run anything.</p>'
    '<ul class="steplist">'
    '<li>One row per line of the program, in the order the machine runs them.</li>'
    '<li>Write what <b>pin</b> holds after that line.</li>'
    '<li>Write what that line printed, if it printed anything.</li>'
    '<li>Leave a row empty if that line never runs.</li>'
    '</ul>'
    '<span class="tmr" data-secs="240"></span>'
    '<p class="hint"><b>Do not run it yet.</b> The playground is where you '
    'check, not where you start.</p>'
    '</div>'
)


def reveal_css():
    """One rule set per press, generated, so a step can never disagree with
    the picture of it.

    The hide rules are one class deep and the show rules are three, because
    `.tw .varbox .vl` beats `.an-4 .twv4` and the value box would otherwise
    never appear. Nothing errors and nothing warns when that is wrong.
    """
    css = ['/* --- worksheet task 3: the task, then one operation per press --- */',
           '.tw .vl{display:none}',
           '.tw .term{display:none}',
           '.tw .cap{display:none}',
           '.tw .t3chk{display:none}',
           '.tw .t3ask{display:none}',
           '.tw.an-1 .t3ask{display:flex}']
    for k, (now, ran, dead, gone, mark, _pin, _out, _b, _c) in enumerate(T3_STEPS, 1):
        a = f'.an-{k}'
        if k > 1:
            css.append(f'.tw{a} .t3chk{{display:flex}}')
        if now:
            css.append(f'{a} .twl{now}'
                       '{background:#CFE9F8;box-shadow:inset 3px 0 0 var(--dk-blue)}')
        if ran:
            css.append(",".join(f'{a} .twl{i}' for i in ran) + '{background:#EAF6FC}')
        if dead:
            css.append(",".join(f'{a} .twl{i}' for i in dead) + '{opacity:.26}')
        if gone:
            css.append(",".join(f'{a} .twb{i}' for i in gone)
                       + '{opacity:0;transform:scale(.72)}')
        if mark:
            css.append(",".join(f'{a} .twb{i}' for i in mark)
                       + '{border-color:var(--dk-blue);background:#DCF0FB;'
                         'box-shadow:0 0 0 4px rgba(0,109,175,.14)}')
        css.append(f'.tw{a} .varbox .twv{k}{{display:flex}}')
        css.append(f'.tw{a} .twt{k}{{display:block}}')
        css.append(f'.tw{a} .twc{k}{{display:block}}')
    return "\n".join(css)


def reveal_body():
    vals = "".join(
        _chips(h).replace('class="vl', f'class="vl twv{k}', 1)
        for k, h in enumerate(_pin_history(), 1))
    terms = "".join(
        f'<pre class="term twt{k}">{chr(10).join(row[6])}</pre>'
        for k, row in enumerate(T3_STEPS, 1))
    caps = "".join(
        f'<p class="cap twc{k}"><b>{row[7]}</b> {row[8]}</p>'
        for k, row in enumerate(T3_STEPS, 1))
    return (
        '<div class="p2 tw">'
        f'<div>{_t3_code()}</div>'
        '<div>'
        f'{T3_ASK}'
        '<div class="t3chk">'
        f'{_t3_boxes()}'
        f'<div class="varbox"><span class="nm">pin</span>{vals}</div>'
        f'{terms}'
        '</div>'
        '</div>'
        '</div>'
        f'{caps}')


# ============================================================== the explainer
EX_SRC = P.WALK_SRC
EX_SETS = P.WALK_SETS
EX_DEFAULT = '-i'        # unrehearsed: no slide and no task has shown this one


def explainer_body():
    picks = ""
    for s in EX_SETS:
        lbl = P.walk_label(s)
        picks += (f'<button type="button" data-w="{"" if s is None else s}" '
                  f'data-none="{"1" if s is None else ""}" '
                  f'aria-pressed="false">{html.escape(lbl)}</button>')
    return (
        '<div class="p2 sw" id="sw">'
        '<div>'
        '<pre class="cx" id="s-code">'
        '<span class="ln" data-l="1"><span class="no">1</span>name = '
        f'<em>&quot;{html.escape(EX_SRC)}&quot;</em></span>'
        '<span class="ln" data-l="2"><span class="no">2</span>name = '
        'name.<i>strip</i>(<em id="s-arg"></em>)</span>'
        '<span class="ln" data-l="3"><span class="no">3</span>'
        '<b>print</b>(name)</span>'
        '</pre>'
        f'<div class="wpick"><span class="lb">line 2</span>{picks}</div>'
        '<p class="wkey">'
        '<span class="sw-k ran"></span>already run'
        '<span class="sw-k now"></span>running now'
        '<span class="sw-k dead"></span>in the set, never reached, and it stays '
        'that way'
        '</p>'
        '</div>'
        '<div>'
        '<div class="seqbar strip" id="s-seq"></div>'
        '<div class="varbox"><span class="nm">name</span>'
        '<span class="vl none" id="s-name">not set yet</span></div>'
        '<pre class="term" id="s-out"></pre>'
        '</div>'
        '</div>'
        '<div class="wctl">'
        '<button type="button" id="s-play">Play</button>'
        '<button type="button" id="s-step">One step</button>'
        '<button type="button" class="ghost" id="s-reset">Reset</button>'
        '<span class="st" id="s-st"></span>'
        '</div>'
        '<p class="cap" id="s-cap"><b>Write down what line 3 prints.</b> '
        'Then we walk it one character at a time.</p>')


EXPLAINER_JS = r"""
  /* --------------------------------------------------------- the explainer
     strip, one character at a time, from each end inwards.

     Three states and the third is the point. A character that is in the set
     and sits in the MIDDLE is never reached, goes `never`, and stays that way
     after the run has finished. A still picture can claim that; only the walk
     shows it, because the room watches the left end stop before it gets
     there.

     The plan is computed from the chosen set every time, so a second walk
     with a different set is not a lie. */
  (function(){
    var root=document.getElementById('sw'); if(!root) return;
    var SRC=__SRC__;
    var codeEl=document.getElementById('s-code'), seqEl=document.getElementById('s-seq'),
        argEl=document.getElementById('s-arg'), nameEl=document.getElementById('s-name'),
        outEl=document.getElementById('s-out'), capEl=document.getElementById('s-cap'),
        stEl=document.getElementById('s-st'),
        bPlay=document.getElementById('s-play'), bStep=document.getElementById('s-step'),
        bReset=document.getElementById('s-reset');
    var picks=[].slice.call(root.querySelectorAll('[data-w]'));
    var set='__DEFAULT__', none=false, plan=[], at=0, timer=null;
    var calmS = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function inSet(c){ return (none ? ' \t\n' : set).indexOf(c) >= 0; }

    function q(c){ return '&quot;' + c + '&quot;'; }

    function build(){
      var n=SRC.length, p=[{line:1,
        cap:'<b>Line 1.</b> name holds these ' + n + ' characters.'}];
      var i=0, j=n-1;
      while(i<=j && inSet(SRC[i])){
        p.push({line:2, side:'L', idx:i, eat:true,
          cap:'<b>Left end.</b> ' + q(SRC[i]) + ' is in the set, so it comes off.'});
        i++;
      }
      if(i<=j){
        p.push({line:2, side:'L', idx:i, stop:true,
          cap:'<b>Left end stops.</b> ' + q(SRC[i]) + ' is not in the set, so strip '
            + 'stops here and never looks further in.'});
      }
      while(j>=i && inSet(SRC[j])){
        p.push({line:2, side:'R', idx:j, eat:true,
          cap:'<b>Right end.</b> ' + q(SRC[j]) + ' is in the set, so it comes off.'});
        j--;
      }
      if(j>=i){
        p.push({line:2, side:'R', idx:j, stop:true,
          cap:'<b>Right end stops.</b> ' + q(SRC[j]) + ' is not in the set, so strip '
            + 'stops here too.'});
      }
      var never=[];
      for(var k=i;k<=j;k++) if(inSet(SRC[k])) never.push(k);
      if(never.length){
        p.push({line:2, never:never,
          cap:'<b>The middle.</b> There is a ' + q(SRC[never[0]]) + ' at index '
            + never[0] + ', and it IS in the set. strip never reached it, so it '
            + 'stays.'});
      }
      p.push({line:3, out:SRC.slice(i, j+1), lo:i, hi:j,
        cap:'<b>Line 3.</b> Line 2 stored the new string back into name. Without '
          + 'that equals sign nothing would have changed.'});
      return p;
    }

    function chips(vals){
      if(!vals.length) return '<span class="vl none">not set yet</span>';
      var h='<span class="vl">';
      for(var i=0;i<vals.length;i++){
        if(i) h+='<span class="ar">-&gt;</span>';
        h+='<span class="'+(i===vals.length-1?'cv':'ov')+'">'+vals[i]+'</span>';
      }
      return h+'</span>';
    }

    function paint(){
      var gone={}, stops={}, never={}, cur=null, now=0, ran={}, hist=[SRC], out=[];
      for(var k=0;k<at;k++){
        var s=plan[k];
        ran[s.line]=1; now=s.line;
        if(s.eat){ gone[s.idx]=1; cur=s.idx; }
        if(s.stop){ stops[s.idx]=1; cur=s.idx; }
        if(s.never) s.never.forEach(function(x){ never[x]=1; });
        if(s.out!==undefined){ hist.push(s.out); out.push(s.out); cur=null; }
      }
      seqEl.innerHTML = [].map.call(SRC, function(c,i){
        var cls='bx';
        if(gone[i]) cls+=' gone';
        if(stops[i]) cls+=' stop';
        if(never[i]) cls+=' never';
        if(i===cur) cls+=' at';
        return '<span class="'+cls+'">'+c
          + (never[i] ? '<i>never</i>' : '')
          + (stops[i] ? '<i class="ok">stop</i>' : '') + '</span>';
      }).join('');
      /* only the program's own lines, never the key underneath it */
      [].forEach.call(codeEl.querySelectorAll('.ln'), function(el){
        var l=+el.dataset.l;
        el.className='ln' + (l===now ? ' now' : (ran[l] ? ' ran' : ''));
      });
      nameEl.outerHTML = chips(hist.length>1 ? hist : [SRC])
        .replace('class="vl', 'id="s-name" class="vl');
      nameEl=document.getElementById('s-name');
      outEl.textContent = out.join('\n');
      capEl.innerHTML = at ? plan[at-1].cap
        : '<b>Write down what line 3 prints.</b> Then we walk it one character '
          + 'at a time.';
      stEl.textContent = at + ' / ' + plan.length + ' steps';
      bStep.disabled = at>=plan.length;
      bPlay.disabled = at>=plan.length;
    }

    function reset(keep){
      if(timer){ clearInterval(timer); timer=null; }
      plan=build(); at=0;
      argEl.innerHTML = none ? '' : '&quot;'+set+'&quot;';
      paint();
      if(!keep) stEl.textContent = '0 / ' + plan.length + ' steps';
    }

    function step(){ if(at<plan.length){ at++; paint(); } if(at>=plan.length && timer){
      clearInterval(timer); timer=null; } }

    bStep.addEventListener('click', step);
    bReset.addEventListener('click', function(){ reset(); });
    bPlay.addEventListener('click', function(){
      if(timer){ clearInterval(timer); timer=null; return; }
      if(at>=plan.length) at=0;
      timer=setInterval(step, calmS ? 120 : 1100);
    });
    picks.forEach(function(b){
      b.addEventListener('click', function(){
        picks.forEach(function(x){ x.setAttribute('aria-pressed','false'); });
        b.setAttribute('aria-pressed','true');
        none = b.dataset.none === '1';
        set = b.dataset.w;
        reset();
      });
    });
    /* a panel with its own controls owns the arrow keys */
    root.parentNode.addEventListener('keydown', function(e){
      if(e.target.closest && e.target.closest('.wctl,.wpick')) e.stopPropagation();
    }, true);

    picks.forEach(function(b){
      if(b.dataset.w === '__DEFAULT__' && b.dataset.none !== '1')
        b.setAttribute('aria-pressed','true');
    });
    reset();
  })();
"""


def explainer_js():
    return (EXPLAINER_JS
            .replace('__SRC__', repr(EX_SRC).replace("'", '"'))
            .replace('__DEFAULT__', EX_DEFAULT))
