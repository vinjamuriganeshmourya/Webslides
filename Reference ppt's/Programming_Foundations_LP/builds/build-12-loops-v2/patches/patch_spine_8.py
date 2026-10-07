# -*- coding: utf-8 -*-
"""Part 8: CSS and JS for the tap-to-classify panel."""
import io

CSS = """

/* ============ tap to classify: which part is this line? ============
   Activity library template 23. Six concrete lines, three bins, one case live
   at a time. The commitment happened on the worksheet; this is the room's vote
   being tested in public, and a wrong bin has to bounce or the panel is a list. */
.cl-wrap{display:flex;gap:18px;flex:1;min-height:0;margin-top:14px}
.cl-cases{flex:1.15;display:flex;flex-direction:column;gap:8px;min-width:0}
.cl-case{display:flex;flex-direction:column;gap:3px;padding:9px 13px;border-radius:10px;
  border:1px solid var(--rule,#E2E6EC);background:#fff;opacity:.38;
  transition:opacity var(--dur-base) var(--ease-out),
             border-color var(--dur-base) var(--ease-out),
             transform var(--dur-base) var(--ease-out),
             box-shadow var(--dur-base) var(--ease-out)}
.cl-case .cl-src{font:600 13px var(--sans);color:var(--dk-line,#6B7785);letter-spacing:.2px}
.cl-case code{font:400 17px var(--mono);color:var(--dk-text)}
.cl-case.cur{opacity:1;border-color:var(--dk-cyan);
  box-shadow:0 2px 0 0 var(--dk-cyan) inset,0 6px 18px rgba(20,20,40,.07)}
.cl-case.done{opacity:0;transform:translateX(22px) scale(.96);pointer-events:none;height:0;
  padding:0;border:0;margin:0;overflow:hidden}
.cl-case.bounce{animation:clbounce 420ms var(--ease-out)}
@keyframes clbounce{0%,100%{transform:none}
  22%{transform:translateX(-7px)}58%{transform:translateX(7px)}82%{transform:translateX(-3px)}}

.cl-bins{flex:1;display:flex;flex-direction:column;gap:10px;min-width:0}
.cl-bin{flex:1;display:flex;flex-direction:column;gap:6px;align-items:stretch;
  border:2px dashed var(--rule,#E2E6EC);border-radius:12px;background:var(--surface,#FAFBFC);
  padding:10px 12px;text-align:left;font:inherit;cursor:pointer;
  transition:border-color var(--dur-fast) var(--ease-out),
             background var(--dur-fast) var(--ease-out)}
.cl-bin:hover{border-color:var(--dk-cyan)}
.cl-bin b{font:650 16px var(--sans);color:var(--dk-blue)}
.cl-bin.no{border-color:#D0342C;background:#FCF1F1}
.cl-drop{display:flex;flex-direction:column;gap:5px}
.cl-landed{padding:6px 10px;border-radius:8px;background:#EAF6FC;border:1px solid #BEE3F3;
  font:400 15px var(--mono);color:var(--dk-text);
  animation:clland var(--dur-base) var(--ease-out) both}
@keyframes clland{from{opacity:0;transform:translateY(-12px) scale(.96)}to{opacity:1;transform:none}}

.cl-say{margin:12px 0 0;min-height:1.5em;font-size:16px;color:var(--dk-text);
  padding-left:12px;border-left:3px solid transparent}
.cl-say.yes{border-color:#1B7F3B}
.cl-say.no{border-color:#D0342C}
body.present .cl-case code{font-size:clamp(15px,1.25vw,21px)}
body.present .cl-bin b{font-size:clamp(15px,1.15vw,20px)}
body.present .cl-say{font-size:clamp(15px,1.15vw,20px)}

@media (prefers-reduced-motion:reduce){
  .cl-case,.cl-bin,.cl-landed{transition-duration:1ms;animation-duration:1ms}
  .cl-case.bounce{animation:none;border-color:#D0342C}
}
@media print{ .cl-case{opacity:1;height:auto} }
"""

JS = r"""

/* ---------------------------------------------- tap to classify (template 23)
   One case is live at a time. The instructor taps the bin the ROOM voted for,
   not the right one: a bin that bounces is what the beat is for. Click driven
   only, so the arrow keys still belong to the presenter. */
document.querySelectorAll('[data-classify]').forEach(function(panel){
  var cases = Array.prototype.slice.call(panel.querySelectorAll('.cl-case'));
  var bins  = Array.prototype.slice.call(panel.querySelectorAll('.cl-bin'));
  var say   = panel.querySelector('.cl-say');
  var count = panel.querySelector('[data-cl-count]');
  var reset = panel.querySelector('[data-cl-reset]');
  var at = 0;

  function draw(){
    cases.forEach(function(c, i){ c.classList.toggle('cur', i === at); });
    if (count) count.textContent = Math.min(at, cases.length) + ' / ' + cases.length;
  }
  function clear(){
    bins.forEach(function(b){
      b.classList.remove('no');
      var d = b.querySelector('.cl-drop');
      while (d.firstChild) d.removeChild(d.firstChild);
    });
    cases.forEach(function(c){ c.classList.remove('done', 'bounce', 'cur'); });
    if (say){ say.textContent = ''; say.className = 'cl-say'; }
    at = 0; draw();
  }
  function tap(bin, btn){
    if (at >= cases.length) return;
    var c = cases[at];
    if (c.getAttribute('data-bin') === bin){
      var landed = document.createElement('div');
      landed.className = 'cl-landed';
      landed.textContent = c.querySelector('code').textContent;
      btn.querySelector('.cl-drop').appendChild(landed);
      c.classList.add('done');
      if (say){ say.textContent = c.getAttribute('data-why'); say.className = 'cl-say yes'; }
      at++;
      draw();
    } else {
      c.classList.remove('bounce'); void c.offsetWidth; c.classList.add('bounce');
      btn.classList.add('no');
      setTimeout(function(){ btn.classList.remove('no'); }, 700);
      if (say){ say.textContent = c.getAttribute('data-oops'); say.className = 'cl-say no'; }
    }
  }
  bins.forEach(function(b){
    b.addEventListener('click', function(){ tap(b.getAttribute('data-bin'), b); });
  });
  if (reset) reset.addEventListener('click', clear);
  draw();
});
"""

c = io.open('parts/extra.css', encoding='utf-8').read()
assert '.cl-wrap' not in c
io.open('parts/extra.css', 'w', encoding='utf-8').write(c + CSS)

j = io.open('parts/extra.js', encoding='utf-8').read()
assert 'data-classify' not in j
io.open('parts/extra.js', 'w', encoding='utf-8').write(j + JS)
print('part 8 applied')
