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
.binrow .tap{width:96px;padding:9px 0;text-align:center}
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
  var KEY='ws:strings-naming';
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
def _taps(items, group_prefix, choices):
    rows = ""
    for i, q in enumerate(items, 1):
        btns = "".join(
            f'<button type="button" class="tap" data-tap="{group_prefix}{i}{c[0]}" '
            f'data-group="{group_prefix}{i}" aria-pressed="false">{c}</button>'
            for c in choices)
        rows += (f'<div class="binrow"><span class="q">{i}. {html.escape(q)}</span>'
                 f'{btns}</div>')
    return rows


def task1():
    body = ""
    for k, (_key, src) in enumerate(P.T1, 1):
        body += (f'<p class="task-instr"><b>Program {k}</b></p>'
                 f'<pre>{_num(src)}</pre>'
                 + _fld(f"Program {k}: what you think it prints")
                 + _fld(f"Program {k}: what it really printed"))
    return _task(
        1, "Predict the letters, then run",
        'For each program: <b>first type what you think it prints.</b> Then type '
        'the program into the playground, run it, and type what it really printed. '
        'Do not change your guess.', body)


# ------------------------------------------------------------------- task two
def task2():
    items = [P.cmp_src(lv["a"], lv["op"], lv["b"]) for lv in P.MACHINE]
    return _task(
        2, "True or False? Decide before the machine runs",
        'Do not run these. For each line, tap <b>True</b> or <b>False</b> for what it '
        'prints. You can change a tap until the machine shows that level.',
        _taps(items, "t2q", ("True", "False"))
        + _fld("Which one surprised you most? Type its number"))


# ----------------------------------------------------------------- task three
def task3():
    names = [nm for nm, _r in P.CLASSIFY]
    return _task(
        3, "Does Python accept this name?",
        'Each line is a variable name. Tap <b>Accepts</b> if Python would let you use '
        'it, or <b>Refuses</b> if it would not. Decide all eight before we check.',
        _taps(names, "t3q", ("Accepts", "Refuses")))


# ------------------------------------------------------------------ task four
def task4():
    return _task(
        4, "Fix the names, then run",
        'This program should add two prices and print the total. It has bad names. '
        '<b>Do not run it yet.</b>',
        f'<pre>{_num(P.T4_SRC)}</pre>'
        + _fld("Type the line numbers that have a bad name")
        + _fld("What you think Python will say when you run it")
        + '<p class="task-instr">Now type it into the playground and run it.</p>'
        + _fld("What Python really said")
        + '<p class="task-instr">Fix every bad name. Use <b>snake_case</b>. Run it '
          'again until it prints. Paste your fixed program here.</p>'
        + _area("Your fixed program", 4)
        + _fld("What your fixed program prints"))


def document():
    body = task1() + task2() + task3() + task4()
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>Comparing Strings and Naming Variables: student worksheet</title>'
        f'<style>{WS_CSS}</style></head><body>'
        '<div class="ws">'
        '<div class="ws-band"><h1>Comparing Strings &amp; Naming Variables</h1>'
        '<p>Programming Foundations &middot; Session 18</p></div>'
        '<div class="ws-who">'
        '<label>Name<input type="text" autocomplete="off"></label>'
        '<label>Roll no.<input type="text" autocomplete="off"></label>'
        '</div>'
        f'{body}'
        '<p class="ws-foot">Your answers stay in this tab only. Close the tab '
        'and they are gone.</p>'
        '</div><div class="ws-save">saved</div>'
        f'<script>{WS_JS}</script></body></html>')
