"""The student handout: one file they open, type into, click in and keep.

It is digital, so a pen instruction becomes a typed or a tapped one. It is still
a commitment device, so nothing on it marks itself and no answer appears
anywhere. Every field and every toggle is saved as they work, and every storage
call is guarded: sessionStorage throws in a private window and the sheet has to
keep working. sessionStorage, not localStorage: these laptops are shared,
and a sheet that outlives the tab hands the next student the last one's answers.
"""
import html

import panels as P

WS_CSS = """
:root{
  --ink:#101318; --mid:#39404B; --soft:#6B7280; --rule:#D8DDE4; --fill:#F4F6F8;
  --accent:#006DAF; --accent-soft:#E7F1FA; --cyan:#3FB5E5;
  --sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --ease-out:cubic-bezier(0.23,1,0.32,1);
}
*{box-sizing:border-box}
body{margin:0;background:#EEF1F4;color:var(--ink);font:16px/1.6 var(--sans)}
.ws{max-width:900px;margin:0 auto;padding:0 22px 110px;background:#fff;
  min-height:100vh;box-shadow:0 0 0 1px var(--rule)}
.ws-band{background:var(--accent);color:#fff;margin:0 -22px 24px;padding:22px 26px}
.ws-band h1{margin:0;font-size:23px;letter-spacing:-.01em}
.ws-band p{margin:5px 0 0;font-size:13.5px;opacity:.85}
.ws-who{display:flex;flex-wrap:wrap;margin:0 0 26px}
.ws-who label{flex:1 1 220px;margin-right:16px;font-size:13px;color:var(--soft)}
.ws-who input{display:block;width:100%;margin-top:4px;padding:9px 11px;
  border:1px solid var(--rule);border-radius:8px;font:15px var(--sans)}
.task{border-left:3px solid var(--accent);padding:0 0 0 18px;margin:0 0 38px}
.task-hd{display:flex;align-items:baseline;margin:0 0 9px}
.badge{flex:none;width:26px;height:26px;border-radius:50%;background:var(--accent);
  color:#fff;font:700 14px/26px var(--sans);text-align:center;margin-right:11px}
.task-hd .h{font:700 19px var(--sans);letter-spacing:-.01em}
.task-instr{margin:0 0 14px;font-size:15.5px;color:var(--mid)}
.task-instr b{color:var(--ink)}
pre{margin:0 0 16px;padding:14px 16px;background:var(--fill);border:1px solid var(--rule);
  border-radius:9px;font:14px/1.8 var(--mono);white-space:pre;overflow-x:auto}
pre .no{display:inline-block;width:1.8em;color:#9AA1B0}
.fld{display:block;margin:0 0 15px}
.fld span{display:block;font-size:13px;font-weight:650;color:var(--soft);margin-bottom:5px}
.fld input,.fld textarea{width:100%;padding:11px 13px;border:1px solid var(--rule);
  border-radius:8px;font:15px/1.6 var(--mono);background:#fff;color:var(--ink);resize:vertical}
.fld input:focus,.fld textarea:focus{outline:2px solid var(--accent);outline-offset:1px}
.fld.ans input{font-weight:650;background:#FFFDF3;border-color:#E3D2A0}
table.grid{width:100%;border-collapse:collapse;margin:0 0 16px}
table.grid th,table.grid td{border:1px solid var(--rule);padding:8px 10px;
  font-size:14px;text-align:left;vertical-align:middle}
table.grid th{background:var(--fill);font-weight:650;font-size:13px}
table.grid td.c{font:14px var(--mono);white-space:pre;background:var(--fill);
  text-align:center;width:72px}
table.grid input{width:100%;border:0;padding:5px 3px;font:15px var(--mono);background:transparent}
table.grid input:focus{outline:2px solid var(--accent)}

/* tapped answers. They record a decision; nothing here ever marks it. */
.taps{display:flex;flex-wrap:wrap;margin:0 0 15px}
.taps>span.lb{flex:none;margin-right:12px;align-self:center;font-size:13px;
  font-weight:650;color:var(--soft)}
.tap{flex:none;margin:0 9px 8px 0;padding:9px 18px;border-radius:999px;
  border:2px solid var(--rule);background:#fff;color:var(--mid);
  font:650 15px var(--sans);cursor:pointer;
  transition:transform 140ms var(--ease-out),background-color 160ms var(--ease-out),
             border-color 160ms var(--ease-out),color 160ms var(--ease-out)}
.tap:active{transform:scale(.96)}
.tap[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}
.binrow{display:flex;align-items:center;margin:0 0 9px}
.binrow .q{flex:1;min-width:0;padding:9px 13px;border-radius:9px;background:var(--fill);
  font:15px var(--mono);margin-right:12px}
.binrow .tap{width:42px;padding:9px 0;text-align:center}
.steps{list-style:none;margin:0 0 15px;padding:0}
.steps li{display:flex;align-items:flex-start;margin:0 0 9px}
.steps .tick{flex:none;width:28px;height:28px;margin-right:12px;border-radius:8px;
  border:2px solid var(--rule);background:#fff;color:transparent;cursor:pointer;
  font:700 16px/24px var(--sans);text-align:center;
  transition:transform 140ms var(--ease-out),background-color 160ms var(--ease-out)}
.steps .tick:active{transform:scale(.94)}
.steps .tick[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}
.steps .tx{flex:1;min-width:0;font-size:15.5px;color:var(--mid);padding-top:2px}
.steps .tx b{color:var(--ink)}
.note{margin:0 0 15px;padding:12px 15px;background:var(--accent-soft);border-radius:9px;
  font-size:15px;color:var(--mid)}
.note b{color:var(--ink)}
.ws-foot{margin:34px 0 0;padding-top:16px;border-top:1px solid var(--rule);
  font-size:13px;color:var(--soft)}
.ws-save{position:fixed;right:16px;bottom:16px;padding:8px 14px;border-radius:999px;
  background:var(--ink);color:#fff;font-size:12px;opacity:0;transition:opacity 220ms}
.ws-save.on{opacity:.85}
@media (prefers-reduced-motion:reduce){ .tap,.steps .tick{transition:none} }
@media (max-width:600px){ .ws{padding:0 15px 90px} .ws-band{margin:0 -15px 18px} }
"""

WS_JS = """
(function(){
  var KEY='ws:loop-control';
  function fields(){ return [].slice.call(
    document.querySelectorAll('input[type=text],textarea')); }
  function taps(){ return [].slice.call(document.querySelectorAll('[data-tap]')); }
  var tag=document.querySelector('.ws-save'), t=null;
  function flash(){ if(!tag) return; tag.classList.add('on');
    clearTimeout(t); t=setTimeout(function(){ tag.classList.remove('on'); },1100); }
  function save(){
    try{
      var v={}, p={};
      fields().forEach(function(f,i){ if(f.value) v[i]=f.value; });
      taps().forEach(function(b){ if(b.getAttribute('aria-pressed')==='true')
        p[b.dataset.tap]=1; });
      sessionStorage.setItem(KEY, JSON.stringify({v:v,p:p}));
      flash();
    }catch(e){}
  }
  try{
    var saved=JSON.parse(sessionStorage.getItem(KEY)||'{}');
    if(saved.v) fields().forEach(function(f,i){ if(saved.v[i]!=null) f.value=saved.v[i]; });
    if(saved.p) taps().forEach(function(b){
      if(saved.p[b.dataset.tap]) b.setAttribute('aria-pressed','true'); });
  }catch(e){}
  document.addEventListener('input', save);
  document.addEventListener('click', function(e){
    var b=e.target.closest('[data-tap]'); if(!b) return;
    var grp=b.dataset.group;
    if(grp){ [].forEach.call(document.querySelectorAll('[data-group="'+grp+'"]'),
      function(x){ x.setAttribute('aria-pressed', x===b ? 'true':'false'); }); }
    else { b.setAttribute('aria-pressed',
      b.getAttribute('aria-pressed')==='true' ? 'false':'true'); }
    save();
  });
})();
"""


def _num(src):
    return "\n".join(f'<span class="no">{i}</span>{html.escape(l)}'
                     for i, l in enumerate(src.rstrip("\n").split("\n"), 1))


def _task(n, head, instr, body):
    return (f'<section class="task"><div class="task-hd">'
            f'<span class="badge">{n}</span>'
            f'<span class="h">{head}</span></div>'
            f'<p class="task-instr">{instr}</p>{body}</section>')


def _fld(label):
    return (f'<label class="fld"><span>{label}</span>'
            '<input type="text" autocomplete="off" spellcheck="false"></label>')


def _area(label, rows=3):
    return (f'<label class="fld"><span>{label}</span>'
            f'<textarea rows="{rows}" spellcheck="false"></textarea></label>')


def _ticks(items, key):
    lis = "".join(
        f'<li><button type="button" class="tick" data-tap="{key}{i}" '
        f'aria-pressed="false">&#10003;</button><span class="tx">{t}</span></li>'
        for i, t in enumerate(items, 1))
    return f'<ul class="steps">{lis}</ul>'


# ------------------------------------------------------------------- task one
def task1():
    rows = "".join(
        f'<tr><td class="c">{n}</td>'
        '<td><input type="text" autocomplete="off"></td>'
        '<td><input type="text" autocomplete="off"></td>'
        '<td><input type="text" autocomplete="off"></td>'
        '<td><input type="text" autocomplete="off"></td></tr>'
        for n in range(1, P.TASK1_ROWS + 1))
    table = ('<table class="grid"><tr><th>Row</th><th>a</th><th>b</th>'
             '<th>Does line 5 run? (yes or no)</th>'
             '<th>What line 6 prints</th></tr>' + rows + '</table>')
    # No count of the rows that fill. The instructor says it after keyboards are off.
    return _task(
        1, "Trace it before you run it",
        'Read the program. <b>Do not type it anywhere.</b> Fill one row each '
        f'time line {P.TASK1_IF_LINE} runs: the value of <b>a</b>, the value of '
        '<b>b</b>, whether the <b>break</b> on line 5 runs, and what line 6 prints. '
        'Leave a row empty if you do not need it.',
        f'<pre>{_num(P.TASK1_SRC)}</pre>'
        + table
        + _area("Everything the program prints, in order, one line each", 5))


# ------------------------------------------------------------------- task two
def task2():
    cut = " and ".join(str(n) for n in P.FIRST_CUT)
    return _task(
        2, "First word in capitals: type it, then take the break out",
        'This program prints the first word of a sentence in capitals. '
        'Type it into the playground. <b>Every time, type what you '
        'think it prints before you press run.</b> Tick each step as you finish it.',
        f'<pre>{_num(P.FIRST_SRC)}</pre>'
        + _ticks([f'<b>Step 1.</b> Type it. The input is <code>{P.FIRST_IN}</code>',
                  f'<b>Step 2.</b> Delete lines {cut}, the if and the break. '
                  'Same input. Predict, then run.',
                  f'<b>Step 3.</b> Put lines {cut} back. Now the input is '
                  f'<code>{P.FIRST_IN2}</code>, one word with no space. Predict, then run.'],
                 "t2s")
        + _fld("Step 1: what it prints")
        + _fld(f"Step 2: what you think it prints without lines {cut}")
        + _fld("Step 2: what it really printed")
        + _fld(f"Step 3: what you think it prints for {P.FIRST_IN2}")
        + _fld("Step 3: what it really printed"))


# ----------------------------------------------------------------- task three
def task3():
    return _task(
        3, "pass, continue or break: predict, then run",
        f'Type this program into the playground. The input is <b>{P.T3_IN}</b>. '
        'Line 4 changes each time. <b>Type what it prints first, then run it.</b>',
        f'<pre>{_num(P.T3_SRC)}</pre>'
        + "".join(
            _fld(f"Line 4 is <code>{w}</code>: what you think it prints")
            + _fld(f"Line 4 is <code>{w}</code>: what it really printed")
            for w in P.T3_WORDS)
        + _fld("Which one surprised you, and why?"))


def document():
    body = task1() + task2() + task3()
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>Loop Control Statements: student worksheet</title>'
        f'<style>{WS_CSS}</style></head><body>'
        '<div class="ws">'
        '<div class="ws-band"><h1>Loop Control Statements</h1>'
        '<p>Programming Foundations &middot; Session 17</p></div>'
        '<div class="ws-who">'
        '<label>Name<input type="text" autocomplete="off"></label>'
        '<label>Roll no.<input type="text" autocomplete="off"></label>'
        '</div>'
        f'{body}'
        '<p class="ws-foot">Your answers stay in this tab only. Close the tab '
        'and they are gone.</p>'
        '</div><div class="ws-save">saved</div>'
        f'<script>{WS_JS}</script></body></html>')
