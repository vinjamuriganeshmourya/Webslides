#!/usr/bin/env python3
"""panels.machine - the predict-then-run machine.

Levels of a small machine the room predicts the result of before it runs. The
room commits to an option, the machine runs, and a wrong prediction is
contradicted by the machine rather than by the instructor. One per plan.

    from plan_panels.machine import panel, sim, CSS as MACHINE_CSS

    panel('stage-machine', 'Predict, then run', 'What comes out?',
          levels, intro='Pick before we press Run.')

A level is a dict, and every key is required:

    {"id": 3, "tag": "pop", "title": "Pop one out",
     "start": [7, 2], "ops": ["pop()"],
     "q": "7 then 2 went in. We pop once. What comes out?",
     "options": ["2", "7", "7 and 2"],
     "answer": 0,                       # the INDEX into options, not the value
     "explain": "Pop takes the top, and the top is the newest: 2. ..."}

`answer` is an index. Leave out `id`, `tag` or `title` and the panel's own
header renders the word `undefined` on the projector; that is not something the
HTML checks catch, so render the panel and look at it.

The options are concrete values, never prose: "8", "3", "Underflow", never "the
last one". The wrong options are the mistakes the room actually makes, so each
one is worth a sentence in `explain`: in the level above, "7 and 2" is the
student who thinks one pop empties the stack.

`sim()` runs a level, so the build never writes an answer by hand; the answers
live in the guide and are re-derived by `check_answers.py`.

`LEVELS`, `CAP_LEVELS` and `PUZZLE_TARGETS` in the Stacks build are that
session's content, not part of this component. Write your own.
"""
import html
import json


def sim(start, ops, cap=None):
    """Run a level. Returns (final stack, list of outputs, list of events)."""
    st = list(start)
    out, ev = [], []
    for o in ops:
        name = o.split("(")[0]
        arg = o[o.index("(") + 1:o.index(")")]
        if name == "push":
            if cap is not None and len(st) >= cap:
                ev.append("overflow")
                continue
            st.append(int(arg))
            ev.append("push")
        elif name == "pop":
            if not st:
                ev.append("underflow")
                continue
            out.append(st.pop())
            ev.append("pop")
        elif name == "top":
            ev.append("top")
    return st, out, ev


# ----------------------------------------------------------------------------
# markup
# ----------------------------------------------------------------------------

def panel(stage_id, eyebrow, title, levels, intro):
    data = html.escape(json.dumps(levels), quote=True)
    return (
        f'<div class="stage sm" id="{stage_id}" data-sm="{data}">'
        '<div class="sl-head"><span class="sl-bar" aria-hidden="true"></span><div>'
        f'<p class="sl-eyebrow">{eyebrow}</p><h3 class="sl-title">{title}</h3></div></div>'
        f'<p class="sm-tag"><span data-sm-tag></span></p>'
        f'<p class="stage-q" data-sm-story>{intro}</p>'
        '<div class="sm-row">'
        '<div class="sm-tray sm-in"><div class="sm-token" data-sm-in aria-hidden="true"></div><div class="sm-lab">in</div></div>'
        '<div class="sm-machine"><div class="sm-op" data-sm-op>&nbsp;</div>'
        '<div class="sm-stackwrap"><div class="sw-stack sm-stack" data-sm-stack></div></div>'
        '<div class="sm-cap" data-sm-cap></div></div>'
        '<div class="sm-tray sm-out"><div class="sm-outrow" data-sm-out></div><div class="sm-lab">out</div></div>'
        '</div>'
        '<div class="sm-opts" data-sm-opts role="group" aria-label="your answer"></div>'
        '<div class="sm-verdict" data-sm-verdict hidden><b data-sm-vhead></b><span data-sm-vtext></span></div>'
        '<div class="stage-ctl"><button type="button" data-sm="run" disabled>Run the machine</button>'
        '<button type="button" data-sm="next" hidden>Next level</button>'
        '<button type="button" class="ghost" data-sm="again" hidden>Run it again</button>'
        '<button type="button" class="ghost" data-sm="restart">Restart</button>'
        '<span class="ctl-count" data-sm-count></span></div>'
        '<div class="stage-rule" aria-hidden="true"></div></div>')


def puzzle_step():
    """Step 2 of the impossible-order panel: the room drives the machine."""
    targets = "".join(f'<button type="button" data-pz-target="{t}">{t}</button>' for t in PUZZLE_TARGETS)
    return (
        '<p class="stage-q">Pick an order. Then drive the machine: <b>push next</b> puts in the next of 1, 2, 3; <b>pop</b> takes the top. '
        'Can you make the pops come out in that order?</p>'
        '<div class="pz">'
        f'<div class="pz-targets" role="group" aria-label="target order">{targets}</div>'
        '<div class="sm-row pz-row">'
        '<div class="sm-tray sm-in"><div class="sm-token" data-pz-next></div><div class="sm-lab">next in</div></div>'
        '<div class="sm-machine"><div class="sm-op" data-pz-msg>&nbsp;</div><div class="sm-stackwrap"><div class="sw-stack sm-stack" data-pz-stack></div></div></div>'
        '<div class="sm-tray sm-out"><div class="sm-outrow" data-pz-out></div><div class="sm-lab">came out</div></div>'
        '</div>'
        '<div class="stage-ctl here"><button type="button" data-pz="push">push next</button>'
        '<button type="button" data-pz="pop">pop</button>'
        '<button type="button" class="ghost" data-pz="reset">Start over</button>'
        '<span class="ctl-count" data-pz-count></span></div>'
        '</div>')


# ----------------------------------------------------------------------------
# CSS
# ----------------------------------------------------------------------------


CSS = '''
/* ---- the stack machine ---- */
.sm-tag{margin:0 0 6px;font:600 12.5px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--dk-blue)}
.sm-row{display:flex;align-items:flex-end;justify-content:center;gap:28px;margin:6px 0 10px;flex:none}
.sm-tray{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:8px;min-width:120px;min-height:120px}
.sm-lab{font:600 11.5px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:#7C8A99}
.sm-token{min-width:56px;height:48px;padding:0 14px;border-radius:8px;background:#F0A230;color:#fff;font:700 20px var(--sans);
 display:grid;place-items:center;opacity:0;transform:translateX(-14px) scale(.97);
 transition:transform 260ms var(--ease-out),opacity 220ms var(--ease-out)}
.sm-token.show{opacity:1;transform:none}
.sm-token.go{opacity:0;transform:translateX(40px) scale(.9);transition-duration:220ms}
.sm-token.bounce{transform:translateX(26px);opacity:1;transition-timing-function:var(--ease-in-out)}
.sm-token.bounce.back{transform:translateX(-14px);opacity:.35}
.sm-machine{display:flex;flex-direction:column;align-items:center;gap:6px}
.sm-op{font:600 15px var(--mono);color:var(--dk-text);min-height:1.4em;padding:2px 10px;border-radius:6px;
 transition:background-color 200ms var(--ease-out),color 200ms var(--ease-out)}
.sm-op.on{background:#DCEEF9;color:var(--dk-blue)}
.sm-op.bad{background:#FDE8E6;color:var(--dk-red)}
.sm-stackwrap{position:relative;display:flex;align-items:flex-end;height:246px}
/* the walker's .sw-stack rules (flex:1, min-height 240) must not win here */
.sm-stackwrap .sm-stack{width:150px;height:100%;min-height:0;max-height:none;flex:none}
.sm-stackwrap{height:246px}
.sm-stackwrap .sm-stack.capped{height:calc(var(--cap) * 58px + 14px);align-self:flex-end}
.sm-stack .sw-box.peek{transform:scale(1.04);outline:3px solid var(--dk-cyan);outline-offset:2px}
.sm-stack.shake{animation:smshake 360ms var(--ease-out)}
@keyframes smshake{0%,100%{transform:none}25%{transform:translateX(-5px)}55%{transform:translateX(5px)}80%{transform:translateX(-3px)}}
.sm-cap{font:12.5px var(--sans);color:#7C8A99;min-height:1.4em}
.sm-outrow{display:flex;gap:6px;align-items:center;min-height:48px}
.sm-outv{min-width:44px;height:44px;padding:0 12px;border-radius:8px;background:#1B222B;color:#E8EDF3;font:700 18px var(--mono);
 display:grid;place-items:center;opacity:0;transform:translateX(-14px) scale(.95);
 transition:transform 220ms var(--ease-out),opacity 200ms var(--ease-out)}
.sm-outv.show{opacity:1;transform:none}
.sm-outv.copy{background:#E6F2F9;color:var(--dk-blue);border:1.5px dashed var(--dk-blue)}
.sm-outv.none{background:none;color:var(--dk-red);border:1.5px dashed var(--dk-red);font-size:13px;font-family:var(--sans);font-weight:600;padding:0 10px}
.sm-opts{display:flex;gap:10px;flex-wrap:wrap;margin:4px 0 10px}
.sm-opts button{font:600 16px var(--mono);padding:10px 16px;border-radius:10px;border:2px solid #C7D3DD;background:#fff;color:var(--dk-text);
 cursor:pointer;transition:transform 140ms var(--ease-out),border-color 140ms var(--ease-out),background-color 140ms var(--ease-out)}
.sm-opts button:active{transform:scale(.97)}
.sm-opts button[aria-pressed="true"]{border-color:var(--dk-blue);background:#E6F2F9;color:var(--dk-blue)}
.sm-opts button.right{border-color:#1A7F4B;background:#E6F6EC;color:#1A7F4B}
.sm-opts button.wrong{border-color:var(--dk-red);background:#FDE8E6;color:var(--dk-red)}
.sm-opts button:disabled{cursor:default}
.sm-verdict{margin:0 0 10px;padding:12px 16px;border-radius:10px;background:#E6F6EC;border-left:4px solid #1A7F4B;
 font:15px/1.5 var(--sans);color:var(--dk-text);opacity:1;transition:opacity 200ms var(--ease-out)}
.sm-verdict[hidden]{display:none}
.sm-verdict.no{background:#FDF2F0;border-left-color:var(--dk-red)}
.sm-verdict b{display:block;margin:0 0 3px;font-weight:700}
.sm-verdict.no b{color:var(--dk-red)}
.sm-verdict:not(.no) b{color:#1A7F4B}
body.present .sm-tag{font-size:clamp(12px,1.3vw,18px)}
body.present .sm-token{height:clamp(44px,6vh,62px);font-size:clamp(18px,2.1vw,28px)}
body.present .sm-outv{height:clamp(40px,5.5vh,56px);font-size:clamp(16px,1.8vw,24px)}
body.present .sm-op{font-size:clamp(14px,1.55vw,22px)}
body.present .sm-opts button{font-size:clamp(13px,1.4vw,20px);padding:clamp(7px,1vh,12px) clamp(12px,1.4vw,22px)}
body.present .sm-verdict{font-size:clamp(13px,1.4vw,20px)}
body.present .sm-cap,body.present .sm-lab{font-size:clamp(11px,1.1vw,16px)}
body.present .sm-stackwrap{height:clamp(200px,30vh,270px)}
/* once the verdict is up, the picture gives it room: the stack shrinks to its boxes */
body.present .stage.sm:has(.sm-verdict:not([hidden])) .sm-stackwrap{height:196px}
body.present .stage.sm:has(.sm-verdict:not([hidden])) .sm-opts{margin-bottom:6px}
body.present .stage.sm:has(.sm-verdict:not([hidden])) .sm-verdict{padding:9px 14px;margin-bottom:6px}
body.present .stage.sm:has(.sm-verdict:not([hidden])) .sm-verdict b{display:inline;margin-right:6px}
body.present .stage.sm:has(.sm-verdict:not([hidden])) .sm-row{margin:0 0 6px}
body.present .stage.sm:has(.sm-verdict:not([hidden])) .stage-q{margin-bottom:6px}
.sm-stackwrap{transition:height 220ms var(--ease-out)}
body.present .sm-stackwrap .sm-stack{width:clamp(130px,14vw,200px)}
/* ---- the impossible-order puzzle ---- */
.pz-targets{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 8px}
.pz-targets button{font:600 15px var(--mono);padding:7px 12px;border-radius:8px;border:2px solid #C7D3DD;background:#fff;color:var(--dk-text);cursor:pointer;
 transition:transform 140ms var(--ease-out),border-color 140ms var(--ease-out),background-color 140ms var(--ease-out)}
.pz-targets button:active{transform:scale(.97)}
.pz-targets button[aria-pressed="true"]{border-color:var(--dk-blue);background:#E6F2F9;color:var(--dk-blue)}
.pz-targets button.done{border-color:#1A7F4B;background:#E6F6EC;color:#1A7F4B}
.pz-targets button.stuck{border-color:var(--dk-red);background:#FDE8E6;color:var(--dk-red)}
.pz-row{margin-top:2px}
.pz .stage-ctl.here button:disabled{opacity:.38}
body.present .pz-targets button{font-size:clamp(13px,1.5vw,21px)}
@media (prefers-reduced-motion:reduce){
  .sm-token,.sm-outv,.sm-opts button,.pz-targets button,.sm-verdict{transition:none}
  .sm-stack.shake{animation:none}
}
@media print{.sm-verdict{display:block !important}}
'''

# ----------------------------------------------------------------------------
# JS - one engine for both machine panels, plus the puzzle
# ----------------------------------------------------------------------------

JS = r'''
  /* ================= the stack machine =================
     Commit, then run. plan() executes the level's ops over its start state;
     the animation is driven off that, so a level file can never lie about
     what the machine does. */
  document.querySelectorAll('.stage.sm').forEach(function(ST){
    var LV=JSON.parse(ST.dataset.sm), at=0, picked=-1, running=false, timers=[];
    var STEP_H=58;
    var q=function(s){ return ST.querySelector(s); };
    var tagEl=q('[data-sm-tag]'), storyEl=q('[data-sm-story]'), inEl=q('[data-sm-in]'), opEl=q('[data-sm-op]'),
        stackEl=q('[data-sm-stack]'), capEl=q('[data-sm-cap]'), outEl=q('[data-sm-out]'), optsEl=q('[data-sm-opts]'),
        verdEl=q('[data-sm-verdict]'), vHead=q('[data-sm-vhead]'), vText=q('[data-sm-vtext]'),
        runBtn=q('[data-sm=run]'), nextBtn=q('[data-sm=next]'), againBtn=q('[data-sm=again]'),
        restartBtn=q('[data-sm=restart]'), countEl=q('[data-sm-count]');
    var boxes=[], live=[];

    function clearTimers(){ timers.forEach(clearTimeout); timers=[]; }
    function later(fn, ms){ timers.push(setTimeout(fn, ms)); }

    function drawStart(L){
      stackEl.innerHTML=''; boxes=[]; live=[];
      /* a fixed-size machine is a closed box: exactly `cap` slots and a lid */
      stackEl.classList.toggle('capped', !!L.cap);
      if(L.cap){
        stackEl.style.setProperty('--cap', L.cap); stackEl.dataset.cap='room for '+L.cap;
        for(var k=0;k<L.cap;k++){ var sl=document.createElement('div'); sl.className='sw-slot'; sl.style.bottom=(k*STEP_H+8)+'px'; stackEl.appendChild(sl); }
      }
      L.start.forEach(function(v,i){
        var b=document.createElement('div'); b.className='sw-box live'; b.textContent=v;
        b.style.bottom=(i*STEP_H+8)+'px'; stackEl.appendChild(b); boxes.push(b); live.push(b);
      });
      capEl.textContent = L.cap ? ('room for '+L.cap+' · '+L.start.length+' inside') : (L.start.length+' inside');
    }
    function load(i){
      clearTimers(); running=false; picked=-1; at=i;
      var L=LV[at];
      tagEl.textContent='Level '+L.id+' of '+LV.length+' · '+L.tag;
      storyEl.textContent=L.q;
      opEl.textContent=L.ops.join('  ·  '); opEl.className='sm-op';
      inEl.className='sm-token'; inEl.textContent='';
      outEl.innerHTML='';
      verdEl.hidden=true; verdEl.className='sm-verdict';
      optsEl.innerHTML='';
      L.options.forEach(function(o,k){
        var b=document.createElement('button'); b.type='button'; b.textContent=o; b.setAttribute('aria-pressed','false');
        b.addEventListener('click', function(){
          if(running || verdEl.hidden===false) return;
          picked=k;
          optsEl.querySelectorAll('button').forEach(function(x,j){ x.setAttribute('aria-pressed', j===k?'true':'false'); });
          runBtn.disabled=false;
        });
        optsEl.appendChild(b);
      });
      runBtn.disabled=true; runBtn.hidden=false; nextBtn.hidden=true; againBtn.hidden=true;
      countEl.textContent=(at+1)+' / '+LV.length;
      drawStart(L);
    }

    function stackVals(){ return live.map(function(b){ return +b.textContent; }); }

    function doPush(v, L, done){
      inEl.textContent=v; inEl.className='sm-token show';
      later(function(){
        var n=live.length;
        if(L.cap && n>=L.cap){
          /* full: the token travels to the wall and comes back */
          inEl.className='sm-token show bounce';
          opEl.className='sm-op bad'; opEl.textContent='push('+v+')  →  overflow: nothing changes';
          later(function(){ inEl.className='sm-token show bounce back'; }, 300);
          later(done, 900);
          return;
        }
        inEl.className='sm-token go';
        var b=document.createElement('div'); b.className='sw-box'; b.textContent=v;
        b.style.bottom=(n*STEP_H+8)+'px'; stackEl.appendChild(b); boxes.push(b); live.push(b);
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ b.classList.add('live'); }); });
        capEl.textContent = L.cap ? ('room for '+L.cap+' · '+(n+1)+' inside') : ((n+1)+' inside');
        later(done, 700);
      }, 500);
    }
    function doPop(L, done){
      if(!live.length){
        stackEl.classList.remove('shake'); void stackEl.offsetWidth; stackEl.classList.add('shake');
        opEl.className='sm-op bad'; opEl.textContent='pop()  →  underflow: nothing to remove';
        var n=document.createElement('div'); n.className='sm-outv none'; n.textContent='nothing'; outEl.appendChild(n);
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ n.classList.add('show'); }); });
        later(done, 900);
        return;
      }
      var top=live.pop();
      top.classList.remove('live'); top.classList.add('gone');
      var c=document.createElement('div'); c.className='sm-outv'; c.textContent=top.textContent; outEl.appendChild(c);
      later(function(){ c.classList.add('show'); }, 120);
      capEl.textContent = L.cap ? ('room for '+L.cap+' · '+live.length+' inside') : (live.length+' inside');
      later(done, 800);
    }
    function doTop(L, done){
      if(!live.length){ doPop(L, done); return; }
      var top=live[live.length-1]; top.classList.add('peek');
      var c=document.createElement('div'); c.className='sm-outv copy'; c.textContent=top.textContent; outEl.appendChild(c);
      later(function(){ c.classList.add('show'); }, 120);
      later(function(){ top.classList.remove('peek'); done(); }, 900);
    }

    function run(){
      if(picked<0 || running) return;
      running=true; runBtn.disabled=true;
      optsEl.querySelectorAll('button').forEach(function(b){ b.disabled=true; });
      var L=LV[at], i=0;
      function step(){
        if(i>=L.ops.length){ later(finish, 300); return; }
        var o=L.ops[i++], m=/(\w+)\((\d*)\)/.exec(o);
        opEl.className='sm-op on'; opEl.textContent=o;
        if(m[1]==='push') doPush(+m[2], L, step);
        else if(m[1]==='pop') doPop(L, step);
        else doTop(L, step);
      }
      step();
    }
    function finish(){
      var L=LV[at], ok=(picked===L.answer);
      optsEl.querySelectorAll('button').forEach(function(b,k){
        if(k===L.answer) b.classList.add('right');
        else if(k===picked) b.classList.add('wrong');
      });
      verdEl.className='sm-verdict'+(ok?'':' no'); verdEl.hidden=false;
      vHead.textContent = ok ? 'Right.' : ('The machine says '+L.options[L.answer]+'.');
      vText.textContent = L.explain;
      runBtn.hidden=true; againBtn.hidden=false; nextBtn.hidden=(at>=LV.length-1);
      running=false;
      if(ok && typeof CONF==='function') CONF();
    }
    runBtn.addEventListener('click', run);
    againBtn.addEventListener('click', function(){ var p=picked; load(at); picked=p; optsEl.querySelectorAll('button')[p].setAttribute('aria-pressed','true'); runBtn.disabled=false; });
    nextBtn.addEventListener('click', function(){ if(at<LV.length-1) load(at+1); });
    restartBtn.addEventListener('click', function(){ load(0); });
    ST.smLoad=load; ST.smRun=run; ST.smNext=function(){ if(!nextBtn.hidden) load(at+1); };
    /* The arrow key plays the level (keyWidgets() in the DSA template): the
       right answer is picked, then the machine runs, then the next level. A
       pick the instructor clicked for the room is kept and run as it is.
       Back undoes the run, then the pick, then goes to the level before. */
    function pick(k){ optsEl.querySelectorAll('button')[k].click(); }
    ST.setAttribute('data-keystep','');
    ST.keyStep=function(d){
      if(d>0){
        if(running) return true;
        if(!verdEl.hidden){ if(nextBtn.hidden) return false; load(at+1); return true; }
        if(picked<0){ pick(LV[at].answer); return true; }
        run(); return true;
      }
      if(running || !verdEl.hidden){ var p=picked; load(at); if(p>=0) pick(p); return true; }
      if(picked>=0){ load(at); return true; }
      if(at>0){ load(at-1); return true; }
      return false;
    };
    ST.keyEnd=function(){};
    ST.keyReset=function(){ load(0); };
    load(0);
  });

  /* ================= the impossible-order puzzle ================= */
  (function(){
    var P=document.querySelector('.pz'); if(!P) return;
    var STEP_H=58, target=null, st=[], nxt=1, out=[];
    var nextEl=P.querySelector('[data-pz-next]'), stackEl=P.querySelector('[data-pz-stack]'), outEl=P.querySelector('[data-pz-out]'),
        msgEl=P.querySelector('[data-pz-msg]'), pushBtn=P.querySelector('[data-pz=push]'), popBtn=P.querySelector('[data-pz=pop]'),
        resetBtn=P.querySelector('[data-pz=reset]'), countEl=P.querySelector('[data-pz-count]');
    var boxes=[], els=[];
    function render(){
      nextEl.textContent = nxt<=3 ? nxt : '·'; nextEl.className='sm-token show';
      pushBtn.disabled = !target || nxt>3; popBtn.disabled = !target || !st.length;
      countEl.textContent = target ? ('target '+target+' · out so far: '+(out.join(', ')||'none yet')) : 'pick a target order';
      if(!target) return;
      var want=target.split(', ').map(Number), k=out.length;
      var okSoFar = out.every(function(v,i){ return v===want[i]; });
      var tb=P.querySelectorAll('[data-pz-target]');
      if(!okSoFar){ msgEl.className='sm-op bad'; msgEl.textContent='that is not the order. Start over'; return; }
      if(k===3){ msgEl.className='sm-op on'; msgEl.textContent='possible: you made it'; tb.forEach(function(b){ if(b.dataset.pzTarget===target) b.classList.add('done'); }); if(typeof CONF==='function') CONF(); return; }
      var need=want[k];
      if(st.indexOf(need)>=0 && st[st.length-1]!==need){
        var above=st[st.length-1];
        msgEl.className='sm-op bad'; msgEl.textContent='stuck: '+need+' is under '+above+'. Impossible';
        tb.forEach(function(b){ if(b.dataset.pzTarget===target) b.classList.add('stuck'); });
        pushBtn.disabled=true; popBtn.disabled=true; return;
      }
      msgEl.className='sm-op'; msgEl.textContent='need '+need+' next';
    }
    function reset(){
      st=[]; nxt=1; out=[]; boxes=[]; els=[]; stackEl.innerHTML=''; outEl.innerHTML='';
      msgEl.className='sm-op'; msgEl.textContent=' '; render();
    }
    P.querySelectorAll('[data-pz-target]').forEach(function(b){
      b.addEventListener('click', function(){
        target=b.dataset.pzTarget;
        P.querySelectorAll('[data-pz-target]').forEach(function(x){ x.setAttribute('aria-pressed', x===b?'true':'false'); });
        reset();
      });
    });
    pushBtn.addEventListener('click', function(){
      if(nxt>3) return;
      var v=nxt++; st.push(v);
      var bx=document.createElement('div'); bx.className='sw-box'; bx.textContent=v; bx.style.bottom=((st.length-1)*STEP_H+8)+'px';
      stackEl.appendChild(bx); boxes.push(bx); els.push(bx);
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ bx.classList.add('live'); }); });
      render();
    });
    popBtn.addEventListener('click', function(){
      if(!st.length) return;
      var v=st.pop(); out.push(v);
      var top=els.pop();
      top.classList.remove('live'); top.classList.add('gone');
      var c=document.createElement('div'); c.className='sm-outv'; c.textContent=v; outEl.appendChild(c);
      setTimeout(function(){ c.classList.add('show'); }, 100);
      render();
    });
    resetBtn.addEventListener('click', reset);
    /* The arrow key plays the guide's script (keyWidgets() in the DSA
       template): the impossible order first, until the machine says which
       value is stuck, then an order that works, to the end. One move per
       press. Back replays the script to one move earlier. */
    var SCRIPT=['3, 1, 2','push','push','push','pop',
                '2, 3, 1','push','push','pop','push','pop','pop'], ks=0;
    function move(m){
      if(m==='push') pushBtn.click();
      else if(m==='pop') popBtn.click();
      else P.querySelector('[data-pz-target="'+m+'"]').click();
    }
    function clearAll(){
      target=null; reset();
      P.querySelectorAll('[data-pz-target]').forEach(function(x){
        x.setAttribute('aria-pressed','false'); x.classList.remove('done','stuck'); });
    }
    P.setAttribute('data-keystep','');
    P.keyStep=function(d){
      if(d>0){ if(ks>=SCRIPT.length) return false; move(SCRIPT[ks++]); return true; }
      if(ks<=0) return false;
      ks--; clearAll(); for(var j=0;j<ks;j++) move(SCRIPT[j]);
      return true;
    };
    P.keyReset=function(){ ks=0; clearAll(); };
    reset();
  })();
'''
