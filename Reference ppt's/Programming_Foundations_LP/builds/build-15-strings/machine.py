"""The slice machine: predict, then run. Activity template 21.

Five levels on one string. The first three are the three slices the room has
just written down on the worksheet, so the machine is the reveal for task 1
before it goes anywhere new. Levels four and five are fresh, and the last one
lands nowhere at all.

Three things make it an activity rather than a demonstration:

  * the options are concrete output values, never English. "1c" is an option;
    "it stops early" is not, because a paraphrase does the first step for them;
  * **Run is disabled until an option is picked.** That gate is the activity;
  * the verdict names every option, not only the right one.

Every answer is derived by running the slice. `machine.py` states no answer,
and `check_answers.py` recomputes each one and greps the guide for it.
"""
import html
import json

import panels as P

SRC = P.SLICE_SRC
CELL = 78
X0 = 60


def levels():
    """Everything the panel needs, computed. Nothing here is typed by hand."""
    out = []
    for lv in P.MACHINE_LEVELS:
        a, b, c = lv
        out.append({
            'a': a, 'b': b, 'c': c,
            'expr': P.expr(a, b, c),
            'opts': P.MACHINE_OPTS[lv],
            'right': P.machine_answer(lv),
            'land': P.landings(a, b, c),
            'out': P.sl(a, b, c),
            'why': P.MACHINE_WHY[lv],
        })
    return out


def body():
    cells = ""
    for i, ch in enumerate(SRC):
        x = X0 + i * CELL
        cells += (f'<g class="mcell" data-i="{i}">'
                  f'<rect x="{x}" y="34" width="{CELL - 8}" height="78" rx="11"/>'
                  f'<text class="mch" x="{x + (CELL - 8) / 2:.0f}" y="88" '
                  f'text-anchor="middle">{html.escape(ch)}</text>'
                  f'<text class="mix" x="{x + (CELL - 8) / 2:.0f}" y="140" '
                  f'text-anchor="middle">{i}</text></g>')
    w = X0 * 2 + len(SRC) * CELL - 8
    rail = (f'<svg class="fig mrail" id="m-rail" viewBox="0 0 {w} 168" '
            'xmlns="http://www.w3.org/2000/svg" role="img" '
            f'aria-label="The string {SRC}, one box per character, numbered">'
            f'{cells}</svg>')
    opts = "".join(
        f'<button type="button" class="mopt" data-k="{k}">'
        f'<span class="ml">{"ABCD"[k]}</span><span class="mv"></span></button>'
        for k in range(4))
    return (
        '<div class="mach" id="mach">'
        '<div class="mtop">'
        f'<span class="mvar">code = <em>&quot;{html.escape(SRC)}&quot;</em></span>'
        '<span class="mlv" id="m-lv"></span>'
        '</div>'
        f'{rail}'
        '<p class="mask" id="m-ask"></p>'
        f'<div class="mopts" id="m-opts">{opts}</div>'
        '<div class="wctl">'
        '<button type="button" id="m-run" disabled>Run it</button>'
        '<button type="button" class="ghost" id="m-next" disabled>Next level</button>'
        '<span class="st" id="m-st">Pick one first. Run stays locked until you do.</span>'
        '</div>'
        '<p class="cap" id="m-cap"><b>Levels one to three are the three you '
        'just wrote down.</b> Hands up for your answer, then we run it.</p>'
        '</div>')


MACHINE_JS = r"""
  /* ------------------------------------------------- the slice machine
     Predict, then run. Run is locked until an option is picked; that gate is
     the whole activity. The landings arrive one at a time at reading pace,
     and the verdict names every option, not only the right one. */
  (function(){
    var root=document.getElementById('mach'); if(!root) return;
    var LV=__LEVELS__, SRC=__SRC__;
    var rail=document.getElementById('m-rail'), askEl=document.getElementById('m-ask'),
        lvEl=document.getElementById('m-lv'), capEl=document.getElementById('m-cap'),
        stEl=document.getElementById('m-st'),
        bRun=document.getElementById('m-run'), bNext=document.getElementById('m-next');
    var opts=[].slice.call(root.querySelectorAll('.mopt'));
    var cells=[].slice.call(rail.querySelectorAll('.mcell'));
    var at=0, pick=-1, ran=false, timers=[];
    var calmM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clear(){ timers.forEach(clearTimeout); timers=[]; }

    function draw(){
      clear();
      var L=LV[at];
      lvEl.textContent='level '+(at+1)+' of '+LV.length;
      askEl.innerHTML='What does <b>'+L.expr+'</b> give you?';
      cells.forEach(function(c){ c.setAttribute('class','mcell'); });
      opts.forEach(function(b,k){
        b.querySelector('.mv').textContent=L.opts[k];
        b.setAttribute('class','mopt');
        b.disabled=false;
      });
      pick=-1; ran=false;
      bRun.disabled=true; bNext.disabled=true;
      stEl.textContent='Pick one first. Run stays locked until you do.';
      capEl.innerHTML=(at===0)
        ? '<b>Levels one to three are the three you just wrote down.</b> '
          + 'Hands up for your answer, then we run it.'
        : '<b>Say your answer out loud before the press.</b> A guess you kept '
          + 'to yourself is not a prediction.';
    }

    function choose(k){
      if(ran) return;
      pick=k;
      opts.forEach(function(b,i){
        b.setAttribute('class','mopt'+(i===k?' picked':''));
      });
      bRun.disabled=false;
      stEl.textContent='Locked in. Now run it.';
    }

    function run(){
      if(ran || pick<0) return;
      ran=true; bRun.disabled=true;
      opts.forEach(function(b){ b.disabled=true; });
      var L=LV[at], gap = calmM ? 0 : 520;
      L.land.forEach(function(idx,n){
        timers.push(setTimeout(function(){
          cells[idx].setAttribute('class','mcell hit');
        }, gap*n));
      });
      timers.push(setTimeout(function(){
        opts.forEach(function(b,i){
          b.setAttribute('class','mopt'+(i===L.right?' right':' wrong')
            +(i===pick?' picked':''));
        });
        capEl.innerHTML='<b>'+(L.out ? '&quot;'+L.out+'&quot;' : 'nothing at all')
          +'.</b> '+L.why;
        stEl.textContent = (at+1<LV.length) ? 'Next level when you are ready.'
                                            : 'That is the last one.';
        bNext.disabled = (at+1>=LV.length);
      }, gap*Math.max(L.land.length,1)+320));
    }

    opts.forEach(function(b,k){ b.addEventListener('click', function(){ choose(k); }); });
    bRun.addEventListener('click', run);
    bNext.addEventListener('click', function(){
      if(at+1<LV.length){ at++; draw(); }
    });
    root.addEventListener('keydown', function(e){
      if(e.target.closest && e.target.closest('.wctl,.mopts')) e.stopPropagation();
    }, true);
    draw();
  })();
"""


def machine_js():
    return (MACHINE_JS
            .replace('__LEVELS__', json.dumps(levels()))
            .replace('__SRC__', json.dumps(SRC)))
