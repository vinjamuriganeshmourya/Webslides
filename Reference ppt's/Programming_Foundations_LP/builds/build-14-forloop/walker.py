"""Two walkers.

`reveal_body()` is worksheet task 1: the prompt and the answer on one card.
Press 1 is the task itself, the program on the left and the instructions and the
timer on the right. Every press after that replaces the instructions with the
answer, one operation at a time, on the same card, so the code the room traced
never leaves the screen. What the loop takes out of the sequence VANISHES.
CSS only, driven by the template's data-anim controller.

`explainer_body()` is the animated explainer. It opens on the string whole,
`"Python"`, and splits it into its six characters on a press: that split is the
one idea the rest of the session rests on. Then the room chooses a word, commits
to an answer, and only then is Play pressed. With the empty word the body is
never reached and stays `dead` after the run ends: that persistence is the
finding.
"""

# --------------------------------------------------------------- task 1 program
PROG = [
    ('word = <em>"Hi"</em>', 'word = "Hi"'),
    ('n = <i>0</i>', 'n = 0'),
    ('<b>for</b> ch <b>in</b> word:', 'for ch in word:'),
    ('    n = n + <i>1</i>', '    n = n + 1'),
    ('    <b>print</b>(ch)', '    print(ch)'),
    ('<b>print</b>(n)', 'print(n)'),
]

WORD = "Hi"

# one entry per press: which line is running, which have run, which are dead,
# how many boxes are gone, where the cursor sits, ch, n, the output so far,
# and the one line the press proves.
#   (now, ran, dead, gone, at, ch, n, out, cap_bold, cap)
#
# Press 1 is the task, not a step of the answer. It is in this table so the
# count on the card, the caption and the label rail can never disagree.
STEPS = [
    (0, [], [], 0, None, None, None, [],
     "Worksheet task 1",
     "Fill the table by hand first. Nothing here moves until pens are down."),
    (1, [], [], 0, None, None, None, [],
     "Line 1",
     "word now holds the two characters H and i."),
    (2, [1], [], 0, None, None, "0", [],
     "Line 2",
     "n starts at 0."),
    (3, [1, 2], [], 1, 1, "H", "0", [],
     "Line 3, first pass",
     "The loop takes the first item out of the sequence. ch is H."),
    (4, [1, 2, 3], [], 1, 1, "H", "1", [],
     "Line 4",
     "n goes from 0 to 1."),
    (5, [1, 2, 3, 4], [], 1, 1, "H", "1", ["H"],
     "Line 5",
     "It prints whatever ch is holding right now."),
    (3, [1, 2, 4, 5], [], 2, None, "i", "1", ["H"],
     "Line 3, second pass",
     "Back to the loop. It takes the next item. ch is i."),
    (4, [1, 2, 3, 5], [], 2, None, "i", "2", ["H"],
     "Line 4",
     "n goes from 1 to 2."),
    (5, [1, 2, 3, 4], [], 2, None, "i", "2", ["H", "i"],
     "Line 5",
     "It prints i."),
    (3, [1, 2, 4, 5], [], 2, None, "i", "2", ["H", "i"],
     "Line 3, third try",
     "The loop asks for the next item. There is none left, so the loop ends."),
    (6, [1, 2, 3, 4, 5], [], 2, None, "i", "2", ["H", "i", "2"],
     "Line 6",
     "It prints n, which is 2. Two characters, two passes."),
]


def _code(prefix):
    """The program, one span per line, each line addressable by class."""
    out = []
    for i, (html, _) in enumerate(PROG, 1):
        out.append(f'<span class="ln {prefix}l{i}"><span class="no">{i}</span>{html}</span>')
    return '<pre class="cx">' + "".join(out) + "</pre>"


def _seq(prefix, word):
    boxes = "".join(
        f'<span class="bx {prefix}b{i}">{c}</span>' for i, c in enumerate(word)
    )
    return (f'<div class="seqbar {prefix}sq">{boxes}'
            f'<span class="empty">nothing left</span></div>')


def reveal_css():
    """One rule set per press. Generated, so a step can never disagree with the
    picture of it."""
    # The hide rules are deliberately ONE class deep and the show rules are
    # three, because `.rw .varbox .vl` (three classes) beats `.an-4 .rwv4` (two)
    # and the value box simply never appears. Nothing errors and nothing warns.
    css = ['/* --- worksheet task 1: the task, then one operation per press --- */',
           '.rw .vl{display:none}',
           '.rw .term{display:none}',
           '.rw .cap{display:none}',
           # press 1 is the task; the answer side only arrives on press 2
           '.rw .t1chk{display:none}',
           '.rw .t1ask{display:none}',
           # display:flex on its own lays a column of blocks out in a row, and
           # the whole right hand side arrives sideways
           '.rw .t1ask,.rw .t1chk{flex:1;min-height:0;flex-direction:column;'
           'justify-content:safe center}',
           '.rw.an-1 .t1ask{display:flex}']
    for k, (now, ran, dead, gone, at, ch, n, out, _b, _c) in enumerate(STEPS, 1):
        a = f'.an-{k}'
        if k > 1:
            css.append(f'.rw{a} .t1chk{{display:flex}}')
        if now:
            css.append(f'{a} .rwl{now}{{background:#CFE9F8;box-shadow:inset 3px 0 0 var(--dk-blue)}}')
        if ran:
            css.append(",".join(f'{a} .rwl{i}' for i in ran) + '{background:#EAF6FC}')
        if dead:
            css.append(",".join(f'{a} .rwl{i}' for i in dead) + '{opacity:.26}')
        if gone:
            css.append(",".join(f'{a} .rwb{i}' for i in range(gone))
                       + '{opacity:0;transform:scale(.72)}')
        if at is not None:
            css.append(f'{a} .rwb{at}{{border-color:var(--dk-blue);background:#DCF0FB;'
                       'box-shadow:0 0 0 4px rgba(0,109,175,.14)}')
        if gone >= len(WORD):
            css.append(f'{a} .rwsq .empty{{opacity:1}}')
        css.append(f'.rw{a} .varbox .rwv{k}{{display:flex}}')
        css.append(f'.rw{a} .rwt{k}{{display:block}}')
        css.append(f'.rw{a} .rwc{k}{{display:block}}')
    return "\n".join(css)


def _history(field):
    """The running list of values a variable has held, in order, one entry per
    press. A value only joins the list when it actually changes, so the room can
    read 0 struck through, then 1, then 2 and see the change rather than a box
    that quietly swaps its contents."""
    out, seen = [], []
    for row in STEPS:
        v = row[field]
        if v is not None and (not seen or seen[-1] != v):
            seen = seen + [v]
        out.append(list(seen))
    return out


def _chips(vals):
    if not vals:
        return '<span class="vl none">not set yet</span>'
    bits = []
    for i, v in enumerate(vals):
        if i:
            bits.append('<span class="ar">-&gt;</span>')
        bits.append(f'<span class="{"cv" if i == len(vals) - 1 else "ov"}">{v}</span>')
    return '<span class="vl">' + "".join(bits) + "</span>"


TASK1_ASK = (
    '<div class="t1ask">'
    '<p class="lede">Open <b>worksheet task 1</b>. Fill the pass table by hand '
    'before you run anything.</p>'
    '<ul class="gdo">'
    '<li>Write what <b>ch</b> holds on each pass.</li>'
    '<li>Write what <b>n</b> is after line 4.</li>'
    '<li>Write what line 5 prints.</li>'
    '<li>Then answer the two questions under the table.</li>'
    '</ul>'
    '<span class="tmr" data-secs="300"></span>'
    '<p class="hint"><b>Do not run it yet.</b> The playground is where you '
    'check, not where you start.</p>'
    '</div>'
)


def reveal_body():
    CH, N = 5, 6          # index of ch and n inside a STEPS row
    vals = "".join(
        _chips(h).replace('class="vl', f'class="vl rwv{k}', 1)
        for k, h in enumerate(_history(CH), 1)
    )
    nvals = "".join(
        _chips(h).replace('class="vl', f'class="vl rwv{k}', 1)
        for k, h in enumerate(_history(N), 1)
    )
    terms = "".join(
        f'<pre class="term rwt{k}">{chr(10).join(out)}</pre>'
        for k, (_n, _r, _d, _g, _a, _c, _nn, out, _b, _cc) in enumerate(STEPS, 1)
    )
    caps = "".join(
        f'<p class="cap rwc{k}"><b>{b}</b> {c}</p>'
        for k, (_n, _r, _d, _g, _a, _ch, _nn, _o, b, c) in enumerate(STEPS, 1)
    )
    return (
        '<div class="p2 rw">'
        f'<div>{_code("rw")}</div>'
        '<div>'
        f'{TASK1_ASK}'
        '<div class="t1chk">'
        f'{_seq("rw", WORD)}'
        f'<div class="varbox"><span class="nm">ch</span>{vals}</div>'
        f'<div class="varbox"><span class="nm">n</span>{nvals}</div>'
        f'{terms}'
        '</div>'
        '</div>'
        '</div>'
        f'{caps}'
    )


REVEAL_STEPS = len(STEPS)
REVEAL_LABELS = "|".join(b.lower() for (_n, _r, _d, _g, _a, _c, _nn, _o, b, _cc) in STEPS)


# ------------------------------------------------------------------ explainer
EX_PROG = [
    ('word = <em>"____"</em>', 'word = "..."'),
    ('<b>for</b> ch <b>in</b> word:', 'for ch in word:'),
    ('    <b>print</b>(ch)', '    print(ch)'),
    ('<b>print</b>(<em>"Done"</em>)', 'print("Done")'),
]

# "Python" is the deck's own word, and it is the one the split is worth doing
# on: six characters is enough to be a sequence and few enough to count at a
# glance. "Go" and the empty string are the two the room predicts wrong.
EX_WORDS = ["Python", "Go", ""]


def explainer_body():
    lines = "".join(
        f'<span class="ln xl{i}" data-l="{i}"><span class="no">{i}</span>{h}</span>'
        for i, (h, _) in enumerate(EX_PROG, 1)
    )
    picks = "".join(
        f'<button type="button" data-w="{w}" aria-pressed="false">'
        f'{w if w else "nothing"}</button>' for w in EX_WORDS
    )
    return (
        '<div class="p2 xw" id="xw">'
        '<div>'
        f'<pre class="cx" id="x-code">{lines}</pre>'
        f'<div class="wpick"><span class="lb">word</span>{picks}</div>'
        '<p class="wkey">'
        '<span class="sw ran"></span>already run'
        '<span class="sw now"></span>running now'
        '<span class="sw dead"></span>never reached, and it stays grey'
        '</p>'
        '</div>'
        '<div>'
        # the string, whole, before anything has been done to it
        '<div class="strrow" id="x-strrow">'
        '<span class="strchip" id="x-str">&quot;Python&quot;</span>'
        '<button type="button" id="x-split">Split it</button>'
        '</div>'
        '<div class="seqbar" id="x-seq"></div>'
        '<div class="varbox"><span class="nm">ch</span>'
        '<span class="vl none" id="x-ch">not set yet</span></div>'
        '<pre class="term" id="x-out"></pre>'
        '</div>'
        '</div>'
        '<div class="wctl">'
        '<button type="button" id="x-play">Play</button>'
        '<button type="button" id="x-step">One step</button>'
        '<button type="button" class="ghost" id="x-reset">Reset</button>'
        '<span class="st" id="x-st"></span>'
        '</div>'
        '<p class="cap" id="x-cap"><b>One string, or six characters?</b> '
        'Say which, then press <b>Split it</b>.</p>'
    )


EXPLAINER_JS = r"""
  /* -------------------------------------------------- the animated explainer
     Two moves on one card. First the string is split: "Python" is one thing on
     screen until a press turns it into the six characters the loop will walk,
     and that is the idea the whole session rests on. Then the room picks a
     word, writes what it thinks will print, and only then is Play pressed.
     Steps are computed from the word, never hard-coded, so a second walk with
     a different word is not a lie. With the empty word the body is never
     reached and line 3 stays `dead` after the run ends: that persistence is
     the finding. */
  (function(){
    var root=document.getElementById('xw'); if(!root) return;
    var codeEl=document.getElementById('x-code'), seqEl=document.getElementById('x-seq'),
        chEl=document.getElementById('x-ch'), outEl=document.getElementById('x-out'),
        capEl=document.getElementById('x-cap'), stEl=document.getElementById('x-st'),
        strRow=document.getElementById('x-strrow'), strEl=document.getElementById('x-str'),
        bSplit=document.getElementById('x-split'),
        bPlay=document.getElementById('x-play'), bStep=document.getElementById('x-step'),
        bReset=document.getElementById('x-reset');
    var picks=[].slice.call(root.querySelectorAll('[data-w]'));
    var word='Python', plan=[], at=0, timer=null, split=false;
    var calmX = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function build(w){
      /* one entry per thing the language actually does, in order */
      var p=[{line:1, cap:'<b>Line 1.</b> word now holds this sequence.'}];
      for(var i=0;i<w.length;i++){
        p.push({line:2, take:i, ch:w[i],
          cap:'<b>Line 2.</b> The loop takes the next item. ch is ' + w[i] + '.'});
        p.push({line:3, print:w[i],
          cap:'<b>Line 3.</b> It prints whatever ch is holding right now.'});
      }
      p.push({line:2, drained:true,
        cap: w.length
          ? '<b>Line 2.</b> Nothing left in the sequence, so the loop ends.'
          : '<b>Line 2.</b> The sequence is empty, so line 3 never runs at all.'});
      p.push({line:4, print:'Done', done:true,
        cap:'<b>Line 4.</b> This is outside the loop, so it runs once.'});
      return p;
    }

    function paintSeq(){
      var taken={}, cur=-1, drained=false;
      for(var k=0;k<at;k++){ var s=plan[k];
        if(s.take!==undefined){ taken[s.take]=1; cur=s.take; }
        if(s.drained) { drained=true; cur=-1; } }
      seqEl.innerHTML = [].map.call(word, function(c,i){
        return '<span class="bx' + (taken[i]?' gone':'') + (i===cur?' at':'') + '"'
             + ' style="transition-delay:' + (split?0:i*70) + 'ms">'+c+'</span>';
      }).join('') + '<span class="empty">nothing left</span>';
      seqEl.classList.toggle('drained', drained || word.length===0);
      seqEl.classList.toggle('split', split);
    }

    function chips(vals){
      /* every value ch has held, the replaced ones struck through. A box that
         swaps its contents hides the one thing this panel is for. */
      if(!vals.length) return '<span class="vl none">not set yet</span>';
      var h='<span class="vl">';
      for(var i=0;i<vals.length;i++){
        if(i) h+='<span class="ar">-&gt;</span>';
        h+='<span class="'+(i===vals.length-1?'cv':'ov')+'">'+vals[i]+'</span>';
      }
      return h+'</span>';
    }

    function doSplit(){
      if(split) return;
      split=true;
      strRow.classList.add('gone');
      paintSeq();
      capEl.innerHTML = word.length
        ? '<b>Six characters, not one word.</b> That is the sequence the loop '
          + 'walks. Write down how many lines it prints, then press Play.'
        : '<b>Nothing came out.</b> An empty string has no characters in it at all.';
      if(!word.length) capEl.innerHTML =
        '<b>Nothing came out.</b> An empty string has no characters in it at all.';
      stEl.textContent = '0 / ' + plan.length + ' steps';
    }

    function paint(){
      var ran={}, now=0, dead={}, hist=[], out=[];
      for(var k=0;k<at;k++){ var s=plan[k];
        ran[s.line]=1; now=s.line;
        if(s.ch!==undefined && hist[hist.length-1]!==s.ch) hist.push(s.ch);
        if(s.print!==undefined) out.push(s.print); }
      var ch = hist.length ? hist[hist.length-1] : null;
      /* a line the run never reached, once the run is over, stays marked */
      if(at>=plan.length){ for(var i=1;i<=4;i++) if(!ran[i]) dead[i]=1; }
      [].forEach.call(codeEl.querySelectorAll('.ln'), function(el){
        var l=+el.dataset.l;
        el.classList.toggle('ran', !!ran[l] && l!==now);
        el.classList.toggle('now', l===now && at>0);
        el.classList.toggle('dead', !!dead[l]);
      });
      paintSeq();
      chEl.outerHTML = chips(hist).replace('class="vl', 'id="x-ch" class="vl');
      chEl = document.getElementById('x-ch');
      if(ch!==null && !calmX){ chEl.classList.add('pop');
        setTimeout(function(){ if(chEl) chEl.classList.remove('pop'); }, 190); }
      outEl.textContent = out.join('\n');
      if(at>0) capEl.innerHTML = plan[at-1].cap;
      stEl.textContent = at + ' / ' + plan.length + ' steps';
      bStep.disabled = at>=plan.length;
      bPlay.disabled = at>=plan.length;
    }

    function reset(w){
      if(timer){ clearInterval(timer); timer=null; bPlay.textContent='Play'; }
      var changed = (w!==undefined && w!==word);
      if(w!==undefined) word=w;
      plan=build(word); at=0;
      /* a new word goes back to the whole string: the room sees it split every
         time, not only the first */
      if(w!==undefined || !split){ split=false; strRow.classList.remove('gone'); }
      strEl.textContent = '"' + word + '"';
      /* line 1 has to show the word the room actually picked, or the program on
         the left disagrees with the sequence on the right */
      var l1=codeEl.querySelector('[data-l="1"]');
      l1.innerHTML='<span class="no">1</span>word = <em>"'+word+'"</em>';
      picks.forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.w===word ? 'true':'false'); });
      paint();
      if(!split) capEl.innerHTML = word.length
        ? '<b>One string, or ' + word.length + ' characters?</b> Say which, then '
          + 'press <b>Split it</b>.'
        : '<b>Nothing between the quote marks.</b> How many characters is that? '
          + 'Say it, then press <b>Split it</b>.';
      if(changed) return;
    }
    function one(){ doSplit(); if(at<plan.length){ at++; paint(); } }
    function play(){
      doSplit();
      if(timer){ clearInterval(timer); timer=null; bPlay.textContent='Play'; return; }
      bPlay.textContent='Pause';
      timer=setInterval(function(){
        if(at>=plan.length){ clearInterval(timer); timer=null; bPlay.textContent='Play'; return; }
        one();
      }, calmX ? 120 : 950);
    }

    picks.forEach(function(b){ b.addEventListener('click', function(){ reset(b.dataset.w); }); });
    bSplit.addEventListener('click', doSplit);
    bStep.addEventListener('click', one);
    bPlay.addEventListener('click', play);
    bReset.addEventListener('click', function(){ reset(word); });
    /* the panel owns its own controls, so a key pressed on one of them must not
       also walk the deck behind it */
    root.parentNode.addEventListener('keydown', function(e){
      if(e.target.closest && e.target.closest('.wctl,.wpick,.strrow')) e.stopPropagation();
    }, true);
    reset('Python');
  })();
"""
