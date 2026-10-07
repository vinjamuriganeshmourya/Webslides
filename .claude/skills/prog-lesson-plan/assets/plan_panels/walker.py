#!/usr/bin/env python3
"""panels.walker - the reveal walker: one operation per press.

The panel that runs a sequence of operations and shows the structure after each
one, forwards and backwards, with the popped values leaving a trail. It is the
component that replaced the deck's sixty-three near-identical frames, and it is
the reason a plan's answer reveals are per-operation animations and never a
table of states.

    from plan_panels.walker import walker, WALKER_CSS, WALKER_JS

    walker('w-task2', [('task 2', ['push(5)', 'push(8)', 'pop()'])],
           cap=None, mode='reveal')

`mode='walk'` is the explainer's voice (size after every push, "removed 4");
`mode='reveal'` is the worksheet's own words (a dash after a push, "returns 8",
Overflow and Underflow). `cap` closes the box and draws the empty slots dashed.

**The contract, which `verify_plan.py` enforces:** a walker runs only the
task's own sequence. No picker, no "the room's own" box, no free-text input.
The `custom=True` argument exists because one early round had one; do not pass
it. A popped box gets `.gone` and leaves; it does not stay as a grey ghost.

**What to change for a structure that is not a stack.** The JS reads the
operation names in `plan()` and nowhere else. A queue build changes `push`/`pop`
to `enqueue`/`dequeue` and which end the box leaves from, keeps every other
line, and gets the same motion, the same stepping and the same guide contract
for free.
"""
import html
import json


CUSTOM_HINT = "push 5, push 2, pop, top, push 9, size"


def walker_code(ops):
    out = ['<span class="swline" id="swl0"><span class="swc"><i>empty stack</i></span><span class="swr"></span></span>']
    for i, o in enumerate(ops, 1):
        out.append(f'<span class="swline" id="swl{i}"><span class="swc">{html.escape(o)}</span>'
                   f'<span class="swr"></span></span>')
    # no newlines between the lines: each .swline is its own flex block, and a
    # text node between them would render as a blank line inside the <pre>
    return "<pre><code>" + "".join(out) + "</code></pre>"


def walker(wid, seqs, cap=None, mode="walk", custom=False, out_label="removed, in order"):
    """One walker instance. `mode` is "walk" (the explainer: size after every
    push, 'removed 4') or "reveal" (the worksheet's own words: a dash after a
    push, 'returns 8', Overflow / Underflow). `cap` closes the box."""
    cfg = json.dumps({"seqs": [{"name": n, "ops": ops, "code": walker_code(ops)} for n, ops in seqs],
                      "cap": cap, "mode": mode})
    pickers = ""
    if custom:
        pickers = ('<select data-w="seq" aria-label="which sequence to walk">'
                   + "".join(f'<option value="{i}">{html.escape(n)}</option>' for i, (n, _) in enumerate(seqs))
                   + '<option value="custom">the room&rsquo;s own</option></select>'
                   f'<input type="text" class="sw-custom" data-w="custom" placeholder="{CUSTOM_HINT}" '
                   'aria-label="the room&rsquo;s own operations, comma separated" hidden>'
                   '<button type="button" class="ghost sw-go" data-rw="go" hidden>Walk it</button>')
    return (f'<div class="swp" data-walk="{html.escape(cfg, quote=True)}">'
            f'<div class="sw" id="{wid}">'
            '<div class="sw-left"><div class="sw-code"></div>'
            f'<div class="sw-out"><span class="sw-outlab">{out_label}</span><span class="sw-outs"></span></div></div>'
            '<div class="sw-right"><div class="sw-stackwrap">'
            '<div class="sw-stack"><div class="sw-top-ptr sw-ptr">top &#8594;</div></div></div>'
            '<p class="sw-toplab sw-top"></p></div>'
            '</div>'
            '<div class="rwctl"><button type="button" data-rw="step">One step</button>'
            '<button type="button" data-rw="play">Play</button>'
            '<button type="button" class="ghost" data-rw="reset">Reset</button>'
            + pickers + '</div></div>')


WALKER_CSS = '''
/* ---- the stack walker ---- */
.sw{display:flex;flex:1;min-height:0;gap:22px;margin:0 0 4px}
.sw-left{flex:0 0 46%;min-width:0;display:flex;flex-direction:column}
.sw-right{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center}
.sw pre{margin:0;padding:12px 14px;background:var(--dk-card);border-radius:8px;
 font:14px/1.75 var(--mono);color:var(--dk-text);white-space:pre;flex:1 1 auto;min-height:0;overflow:auto}
.sw-out{flex:none}
.sw pre i{color:var(--dk-line);font-style:italic}
.swline{display:flex;justify-content:space-between;gap:12px;padding:0 6px;margin:0 -6px;border-radius:4px;
 transition:background-color 200ms var(--ease-out)}
.swline.ran{background:#E4F0F8}
.swline.now{background:#B9DCF2}
.swline .swr{color:#1A7F4B;font-weight:600;opacity:0;transition:opacity 200ms var(--ease-out)}
.swline.ran .swr{opacity:1}
.swline.fail .swr{color:var(--dk-red)}
.sw-out{margin:12px 0 0;padding:8px 12px;background:#0E1116;border-radius:8px;min-height:3.2em;
 display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.sw-outlab{font:12.5px var(--mono);color:#7C8A99;flex:none}
.sw-outv{font:600 16px var(--mono);color:#E8EDF3;background:#1B222B;border-radius:5px;padding:2px 9px;
 opacity:0;transform:scale(.95);transition:opacity 200ms var(--ease-out),transform 200ms var(--ease-out)}
.sw-outv.shown{opacity:1;transform:none}
.sw-stackwrap{position:relative;display:flex;align-items:stretch;flex:1;min-height:240px;max-height:340px}
.sw-stackwrap:has(.capped){align-items:flex-end;min-height:0;padding-top:28px}
.sw-top-ptr{position:absolute;right:calc(100% + 10px);bottom:8px;height:48px;display:flex;align-items:center;
 font:600 15px var(--sans);color:var(--dk-blue);white-space:nowrap;opacity:0;
 transition:transform 220ms var(--ease-out),opacity 200ms var(--ease-out)}
.sw-top-ptr.on{opacity:1}
body.present .sw-top-ptr{font-size:clamp(14px,1.5vw,22px);height:clamp(40px,5.6vh,58px)}
.sw-stack{position:relative;width:150px;flex:1;min-height:240px;max-height:340px;
 border-left:5px solid #F0A230;border-right:5px solid #F0A230;border-bottom:5px solid #F0A230;
 border-radius:0 0 6px 6px;background:#FBFCFD;transition:border-color 200ms var(--ease-out),box-shadow 200ms var(--ease-out)}
/* a fixed-size stack is a closed box: exactly `cap` slots and a lid */
.sw-stack.capped{flex:none;height:calc(var(--cap) * 58px + 14px);min-height:0;border-top:5px solid #F0A230;border-radius:6px}
.sw-stack.capped::before{content:attr(data-cap);position:absolute;left:-40px;right:-40px;top:-26px;text-align:center;
 font:600 12.5px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:#7C8A99}
.sw-slot{position:absolute;left:12px;right:12px;height:48px;border-radius:7px;border:2px dashed #C7CED6}
/* the stack refusing: red walls and a chip saying why, on the step that failed */
.sw-stack.refuse{border-color:var(--dk-red);box-shadow:0 0 0 6px #FDE8E6}
.sw-stack.refuse::after{content:attr(data-fail);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
 background:#FDF2F0;color:var(--dk-red);border:1.5px dashed var(--dk-red);border-radius:6px;padding:4px 9px;
 font:600 12.5px var(--sans);white-space:nowrap;z-index:2}
/* on a closed box the chip sits above the lid, so the boxes inside stay readable */
.sw-stack.capped.refuse::after{top:auto;bottom:calc(100% + 30px);transform:translateX(-50%)}
/* a push lands from just above, slightly small, 220ms; a pop leaves the way it
   came in but faster (180ms) and is gone - no ghost stays behind */
.sw-box{position:absolute;left:12px;right:12px;height:48px;border-radius:7px;background:#B85039;
 color:#fff;font:700 20px var(--sans);display:grid;place-items:center;
 opacity:0;transform:translateY(-16px) scale(.97);transform-origin:50% 100%;
 transition:transform 220ms var(--ease-out),opacity 220ms var(--ease-out),background-color 220ms var(--ease-out)}
.sw-box.live{opacity:1;transform:none}
.sw-box.gone{opacity:0;transform:translateY(-16px);transition-duration:180ms}
/* the removed chip lands 60ms after the box starts to leave: cause, then effect */
.sw-outv.shown{transition-delay:60ms}
.sw-toplab{margin:10px 0 0;font:600 14px var(--sans);color:var(--dk-text);min-height:1.5em;text-align:center}
.sw-toplab b{color:var(--dk-blue)}
.rwctl{display:flex;align-items:center;gap:8px;margin:10px 0 0;flex-wrap:wrap}
.rwctl button{background:var(--dk-blue);color:#fff;border:0;border-radius:8px;padding:8px 15px;
 font:inherit;font-size:13.5px;font-weight:650;cursor:pointer;
 transition:transform 120ms var(--ease-out)}
.rwctl button:active{transform:scale(.97)}
.rwctl button.ghost{background:none;color:var(--dk-blue);border:1px solid #BFD9EA}
.rwctl select{font:inherit;padding:6px 8px;border-radius:6px;border:1px solid #C7CED8}
.rwctl .sw-custom{font:13.5px var(--mono);padding:7px 10px;border-radius:6px;border:1px solid #C7CED8;
 min-width:300px;flex:1 1 300px}
.rwctl .sw-custom:focus-visible{outline:2px solid var(--dk-blue);outline-offset:1px}
body.present .rwctl .sw-custom{font-size:clamp(13px,1.3vw,19px)}
body.present .sw pre{font-size:clamp(13px,1.35vw,20px);line-height:1.5}
body.present .sw-box,body.present .sw-slot{height:clamp(40px,5.6vh,58px);font-size:clamp(17px,2vw,27px)}
body.present .sw-stack{width:clamp(130px,14vw,210px)}
body.present .sw-stackwrap{max-height:340px}
.sw-right{padding-left:64px}
body.present .sw-outv{font-size:clamp(14px,1.5vw,22px)}
body.present .sw-toplab{font-size:clamp(13px,1.4vw,20px)}
body.present .sw-stack.refuse::after{font-size:clamp(12px,1.25vw,18px)}
.swp{display:flex;flex-direction:column;flex:1;min-height:0}
@media (prefers-reduced-motion:reduce){
  .swline,.swline .swr,.sw-outv,.sw-box,.sw-stack{transition:none}
}
@media print{.rwctl{display:none}.sw-box{opacity:1;transform:none}}
'''

WALKER_JS = r'''
  /* ================= the stack walker =================
     One engine, several instances (.swp[data-walk]): the explainer with its
     dropdown and the room's own sequence, and the per-operation reveals on the
     task 2 and task 3 panels. plan() RUNS the operations. Each pushed value
     gets one box element that stays in the DOM for the whole walk, so a step
     forward and a step back retarget one transition instead of restarting. */
  document.querySelectorAll('.swp[data-walk]').forEach(function(P){
    var CFG=JSON.parse(P.dataset.walk), SEQS=CFG.seqs, CAP=CFG.cap||null, REVEAL=(CFG.mode==='reveal');
    var W=P.querySelector('.sw');
    var codeEl=P.querySelector('.sw-code'), stackEl=P.querySelector('.sw-stack'),
        outEl=P.querySelector('.sw-outs'), topEl=P.querySelector('.sw-top'), ptrEl=P.querySelector('.sw-ptr'),
        playBtn=P.querySelector('[data-rw=play]'), stepBtn=P.querySelector('[data-rw=step]'),
        resetBtn=P.querySelector('[data-rw=reset]'), pick=P.querySelector('[data-w=seq]'),
        custom=P.querySelector('[data-w=custom]'), goBtn=P.querySelector('[data-rw=go]');
    var steps=[], at=0, timer=null, boxes=[], outs=[];
    var STEP_H=58;
    if(CAP){
      stackEl.classList.add('capped'); stackEl.style.setProperty('--cap', CAP);
      stackEl.dataset.cap='room for '+CAP;
    }

    function plan(ops){
      var s=[], st=[], id=0;
      s.push({line:0, kind:'decl', res:REVEAL?'':'size 0', stack:[]});
      ops.forEach(function(o,i){
        var m=/(\w+)\((\d*)\)/.exec(o), name=m[1], arg=m[2];
        var step={line:i+1, kind:name};
        if(name==='push'){
          if(CAP && st.length>=CAP){ step.fail='full: nothing goes in'; step.res=REVEAL?'Overflow: nothing changes':'overflow: no room'; }
          else { st.push({v:+arg,id:id++}); step.res=REVEAL?'–':'size '+st.length; }
        }
        else if(name==='pop'){
          var p=st.pop(); step.popped=p;
          if(p) step.res=REVEAL?'returns '+p.v:'removed '+p.v;
          else { step.fail='empty: nothing comes out'; step.res=REVEAL?'Underflow: nothing changes':'underflow: nothing to remove'; }
        }
        else if(name==='top'){ var t=st[st.length-1]; step.res=t?(REVEAL?'returns '+t.v:'top is '+t.v):(REVEAL?'Underflow: nothing changes':'empty'); if(!t) step.fail='empty: no top'; }
        else if(name==='empty'){ step.res=st.length?'false':'true'; }
        else if(name==='size'){ step.res=String(st.length); }
        step.stack=st.map(function(x){return x;});
        s.push(step);
      });
      return s;
    }

    function build(seq){
      codeEl.innerHTML=seq.code;
      stackEl.innerHTML='';
      stackEl.appendChild(ptrEl);   /* the pointer survives the rebuild */
      if(CAP){ for(var k=0;k<CAP;k++){ var sl=document.createElement('div'); sl.className='sw-slot'; sl.style.bottom=(k*STEP_H+8)+'px'; stackEl.appendChild(sl); } }
      outEl.innerHTML='';
      boxes=[]; outs=[];
      steps=plan(seq.ops);
      // one box per pushed value, positioned by the depth it will sit at
      steps.forEach(function(st){
        if(st.kind==='push' && !st.fail){
          var item=st.stack[st.stack.length-1];
          var b=document.createElement('div');
          b.className='sw-box'; b.textContent=item.v;
          b.style.bottom=((st.stack.length-1)*STEP_H+8)+'px';
          stackEl.appendChild(b); boxes[item.id]=b;
        }
        if(st.kind==='pop' && st.popped){
          var o=document.createElement('span');
          o.className='sw-outv'; o.textContent=st.popped.v;
          outEl.appendChild(o); outs.push(o);
        }
      });
      at=0; render();
    }

    function render(){
      var lines=codeEl.querySelectorAll('.swline');
      lines.forEach(function(l,i){
        l.classList.toggle('ran', i<at);
        l.classList.toggle('now', i===at-1);
        l.classList.toggle('fail', i<at && !!(steps[i]&&steps[i].fail));
        var r=l.querySelector('.swr'); if(r) r.textContent=(i<at && steps[i])?steps[i].res:'';
      });
      var live={}, popped=[];
      for(var i=0;i<at;i++){
        var st=steps[i];
        if(st.kind==='push' && !st.fail){ var it=st.stack[st.stack.length-1]; live[it.id]=true; }
        if(st.kind==='pop' && st.popped){ live[st.popped.id]=false; popped.push(st.popped.id); }
      }
      /* a popped value is gone: the box leaves the way it came in and nothing
         stays where it sat (round 6: the grey ghosts confused the room) */
      boxes.forEach(function(b,id){
        if(!b) return;
        var seen=(id in live);
        b.classList.toggle('live', seen && live[id]);
        b.classList.toggle('gone', seen && !live[id]);
      });
      outs.forEach(function(o,i){ o.classList.toggle('shown', i<popped.length); });
      var cur=at>0?steps[at-1].stack:[];
      var failed=at>0 && steps[at-1].fail;
      stackEl.classList.toggle('refuse', !!failed);
      stackEl.dataset.fail=failed||'';
      /* the pointer rides the top box; transform only, so it glides */
      if(ptrEl){ ptrEl.style.transform='translateY('+(-(Math.max(cur.length,1)-1)*STEP_H)+'px)'; ptrEl.classList.toggle('on', cur.length>0); }
      if(REVEAL){
        topEl.innerHTML=cur.length
          ? 'stack, bottom &rarr; top: <b>'+cur.map(function(x){return x.v;}).join(', ')+'</b>'
          : 'the stack is <b>empty</b>';
      }else{
        topEl.innerHTML=cur.length
          ? 'top() is <b>'+cur[cur.length-1].v+'</b> &middot; size() is <b>'+cur.length+'</b>'
          : 'the stack is <b>empty</b> &middot; size() is <b>0</b>';
      }
      stepBtn.disabled=(at>=steps.length);
    }

    function step(){ if(at>=steps.length) return false; at++; render(); return at<steps.length; }
    function back(){ if(at<=0) return; at--; render(); }
    function stop(){ if(timer){ clearInterval(timer); timer=null; } playBtn.textContent='Play'; }
    function play(){
      if(timer){ stop(); return; }
      if(at>=steps.length){ at=0; render(); }
      playBtn.textContent='Pause';
      timer=setInterval(function(){ if(!step()) stop(); }, 900);
    }
    /* the room's own sequence: "push 5, pop, top, push 9, size" - commas or
       newlines between operations, brackets optional. Anything unreadable is
       skipped rather than crashing the walk in front of fifty people. */
    function parseOps(text){
      var ops=[];
      String(text||'').split(/[,\n;]+/).forEach(function(tok){
        var m=/^\s*(push|pop|top|empty|size)\s*\(?\s*(-?\d*)\s*\)?\s*$/i.exec(tok);
        if(!m) return;
        var name=m[1].toLowerCase();
        if(name==='push' && m[2]==='') return;
        ops.push(name+'('+(name==='push'?m[2]:'')+')');
      });
      return ops;
    }
    function codeFor(ops){
      var out=['<span class="swline" id="swl0"><span class="swc"><i>empty stack</i></span><span class="swr"></span></span>'];
      ops.forEach(function(o,i){
        out.push('<span class="swline" id="swl'+(i+1)+'"><span class="swc">'+o+'</span><span class="swr"></span></span>');
      });
      return '<pre><code>'+out.join('')+'</code></pre>';
    }
    function reset(){
      stop();
      if(pick){
        var isCustom=(pick.value==='custom');
        custom.hidden=!isCustom; goBtn.hidden=!isCustom;
        if(isCustom){
          var ops=parseOps(custom.value);
          if(!ops.length) ops=parseOps(custom.placeholder);
          build({name:'custom', ops:ops, code:codeFor(ops)});
          return;
        }
        build(SEQS[+pick.value]);
        return;
      }
      build(SEQS[0]);
    }
    stepBtn.addEventListener('click', function(){ stop(); step(); });
    playBtn.addEventListener('click', play);
    resetBtn.addEventListener('click', reset);
    if(pick){
      pick.addEventListener('change', reset);
      goBtn.addEventListener('click', reset);
      custom.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); reset(); } e.stopPropagation(); });
    }
    W.stepFwd=P.stepFwd=function(){ stop(); return step(); };
    W.stepBack=P.stepBack=function(){ stop(); back(); };
    W.atEnd=P.atEnd=function(){ return at>=steps.length; };
    W.atStart=P.atStart=function(){ return at<=0; };
    W.reset=P.reset=reset;
    reset();
  });
'''
