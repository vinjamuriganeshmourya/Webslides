"""Follow the dot: the walkthrough card, drawn as a flowchart.

The program is the deck's slide 12 program (panels.EXPL_SRC). The outer loop is
an orange region and the inner loop a blue region inside it. A yellow dot is
Python: one press moves it along one arrow. The caption says what just happened,
the code line lights up, a and b fill their value chips (b's chips come back when
the outer loop starts a new pass), and the output card fills one line at a time.

Every event is built here, in Python, for every slider setting, and
check_answers.py compares each variant's printed lines with a real run.
Nothing plays by itself; the dot's move is a short slide on the press.
"""
import html
import json

import panels as P

NODES = ("start", "d1", "p1", "d2", "p2", "end")
LINE = {"start": 0, "d1": 1, "p1": 2, "d2": 3, "p2": 4, "end": 5}


def events(n, stop):
    A, B = list(range(n)), list(range(7, stop))
    inner = f"range(7, {stop})"
    ev = [{"node": "start", "cap": "The dot is Python. Press <b>One step</b> to move it."}]
    frm = "e_s_d1"
    for i, a in enumerate(A):
        ev.append({"node": "d1", "edge": frm, "set": ["a", a], "tf": "t1",
                   "cap": (f'The <b class="o">outer loop</b> starts. <b class="o">a = {a}</b>. '
                           'A value is left, so True: go down.') if i == 0 else
                          (f'Back up the <b class="o">orange arrow</b>. <b class="o">a</b> '
                           f'takes the next value: <b class="o">{a}</b>.')})
        ev.append({"node": "p1", "edge": "e_d1_p1", "out": ["o", f"outer : {a}"],
                   "cap": f'Print the outer line: <b class="o">outer : {a}</b>.'})
        f2 = "e_p1_d2"
        for j, b in enumerate(B):
            ev.append({"node": "d2", "edge": f2, "set": ["b", b], "tf": "t2",
                       "cap": (f'The <b class="b">inner loop</b> starts'
                               f'{" again, from the beginning" if i else ""}. '
                               f'<b class="b">b = {b}</b>. True: go down.') if j == 0 else
                              (f'Back up the <b class="b">blue arrow</b>. <b class="b">b</b> '
                               f'takes the next value: <b class="b">{b}</b>.')})
            ev.append({"node": "p2", "edge": "e_d2_p2", "out": ["b", f"  inner : {b}"],
                       "cap": f'Print the inner line: <b class="b">inner : {b}</b>.'})
            f2 = "e_p2_d2"
        ev.append({"node": "d2", "edge": f2, "tf": "f2", "endB": 1,
                   "cap": (f'No value left in <b class="b">{inner}</b>. False: the inner '
                           f'loop is done for <b class="o">a = {a}</b>.') if B else
                          (f'<b class="b">{inner}</b> is empty. False: the inner loop '
                           'does not run at all.')})
        frm = "e_d2_d1"
    ev.append({"node": "d1", "edge": frm, "tf": "f1", "endA": 1,
               "cap": (f'Back at the outer loop. No value left in <b class="o">range({n})</b>. '
                       'False: leave both loops.') if A else
                      '<b class="o">range(0)</b> is empty. False: skip both loops.'})
    ev.append({"node": "end", "edge": "e_d1_end", "out": ["e", "End"],
               "cap": 'Print <b class="g">End</b>. It runs once, after both loops.'})
    ev.append({"node": "end", "final": 1,
               "cap": (f'Done. The inner print ran <b class="o">{n}</b> &times; '
                       f'<b class="b">{len(B)}</b> = <b class="g">{n * len(B)}</b> times.')})
    return ev


def variants():
    return {f"{n},{s}": events(n, s) for n in P.EXPL_NS for s in P.EXPL_STOPS}


def printed(ev):
    return [e["out"][1] for e in ev if "out" in e]


DEFAULT = P.EXPL_DEFAULT
STEPS = len(events(*DEFAULT))


def _svg():
    return '''<svg class="fl-svg" viewBox="60 8 700 772" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flowchart of a for loop inside a for loop, with a dot showing where Python is">
<defs>
<linearGradient id="flgo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8EC"/><stop offset="1" stop-color="#FFE3BC"/></linearGradient>
<linearGradient id="flgb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3F8FF"/><stop offset="1" stop-color="#D3E5FF"/></linearGradient>
<filter id="flglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<marker id="flah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9AAAB8"/></marker>
<marker id="flao" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#F29A1F"/></marker>
<marker id="flab" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2F7FE0"/></marker>
</defs>
<rect class="fl-rego" x="86" y="96" width="522" height="560" rx="26"/>
<rect class="fl-regb" x="156" y="326" width="434" height="296" rx="22"/>
<text class="fl-regt o" x="106" y="642">OUTER LOOP</text><text class="fl-regp o" data-fl="po" x="226" y="642"></text>
<text class="fl-regt b" x="176" y="608">INNER LOOP</text><text class="fl-regp b" data-fl="pb" x="292" y="608"></text>
<path class="fl-edge" data-e="e_s_d1" d="M330 62 V96" marker-end="url(#flah)"/>
<path class="fl-edge" data-e="e_d1_p1" d="M330 204 V242" marker-end="url(#flah)"/>
<path class="fl-edge" data-e="e_p1_d2" d="M330 298 V336" marker-end="url(#flah)"/>
<path class="fl-edge" data-e="e_d2_p2" d="M330 444 V482" marker-end="url(#flah)"/>
<path class="fl-edge lb" data-e="e_p2_d2" d="M330 538 V576 H560 V390 H484" marker-end="url(#flab)"/>
<path class="fl-edge lo" data-e="e_d2_d1" d="M176 390 H112 V150 H176" marker-end="url(#flao)"/>
<path class="fl-edge" data-e="e_d1_end" d="M484 150 H716 V722 H448" marker-end="url(#flah)"/>
<text class="fl-elab t" data-tf="t1" x="340" y="228">True</text>
<text class="fl-elab f" data-tf="f1" x="500" y="140">False</text>
<text class="fl-elab t" data-tf="t2" x="340" y="468">True</text>
<text class="fl-elab f" data-tf="f2" x="124" y="380">False</text>
<g class="fl-node fl-pill" data-n="start"><rect class="sh" x="262" y="18" width="136" height="44" rx="22"/><text x="330" y="46" text-anchor="middle" class="fl-sans">Start</text></g>
<g class="fl-node fl-d1" data-n="d1"><path class="sh" d="M330 96 L484 150 L330 204 L176 150 Z"/><text x="330" y="146" text-anchor="middle" data-fl="d1t">a in range(3)</text><text class="sub" x="330" y="168" text-anchor="middle">a value left?</text></g>
<g class="fl-node fl-p fl-p1" data-n="p1"><rect class="sh" x="164" y="242" width="332" height="56" rx="12"/><rect class="acc" x="164" y="242" width="7" height="56" rx="3"/><text x="334" y="276" text-anchor="middle">print("outer : " + str(a))</text></g>
<g class="fl-node fl-d2" data-n="d2"><path class="sh" d="M330 336 L484 390 L330 444 L176 390 Z"/><text x="330" y="386" text-anchor="middle" data-fl="d2t">b in range(7, 9)</text><text class="sub" x="330" y="408" text-anchor="middle">b value left?</text></g>
<g class="fl-node fl-p fl-p2" data-n="p2"><rect class="sh" x="164" y="482" width="332" height="56" rx="12"/><rect class="acc" x="164" y="482" width="7" height="56" rx="3"/><text x="334" y="516" text-anchor="middle">print("  inner : " + str(b))</text></g>
<g class="fl-node fl-p fl-end" data-n="end"><rect class="sh" x="212" y="696" width="236" height="52" rx="12"/><rect class="acc" x="212" y="696" width="7" height="52" rx="3"/><text x="334" y="728" text-anchor="middle">print("End")</text></g>
<circle class="fl-trail" data-fl="tr1" r="7" cx="330" cy="62"/>
<circle class="fl-trail" data-fl="tr2" r="5" cx="330" cy="62"/>
<circle class="fl-halo" data-fl="halo" r="12" cx="330" cy="62"/>
<circle class="fl-dot" data-fl="dot" r="12" cx="330" cy="62"/>
</svg>'''


def body():
    n, stop = DEFAULT
    cfg = html.escape(json.dumps(variants(), separators=(",", ":")), quote=True)
    return f'''<div class="fl" data-flow="{cfg}" data-n="{n}" data-stop="{stop}">
<div class="fl-l">
  <div class="fl-ed">
    <div class="fl-tab"><i></i>loops.py</div>
    <div class="fl-code" data-fl="code"></div>
    <div class="fl-knobs">
      <label class="fl-knob o">outer: range(n), n = <input type="range" data-w="n" min="{min(P.EXPL_NS)}" max="{max(P.EXPL_NS)}" value="{n}"><b data-fl="knv">{n}</b></label>
      <label class="fl-knob b">inner: range(7, stop), stop = <input type="range" data-w="stop" min="{min(P.EXPL_STOPS)}" max="{max(P.EXPL_STOPS)}" value="{stop}"><b data-fl="ksv">{stop}</b></label>
    </div>
  </div>
  <div class="fl-vars">
    <div class="fl-var o" data-v="a"><div class="fl-vtop"><span class="fl-vn">a</span><span class="fl-vv" data-fl="va">&nbsp;</span></div><div class="fl-chips" data-fl="ca"></div><div class="fl-hist" data-fl="ha"></div></div>
    <div class="fl-var b" data-v="b"><div class="fl-vtop"><span class="fl-vn">b</span><span class="fl-vv" data-fl="vb">&nbsp;</span></div><div class="fl-chips" data-fl="cb"></div><div class="fl-hist" data-fl="hb"></div></div>
  </div>
  <div class="fl-out">
    <div class="fl-outh"><span>Output &middot; <span data-fl="olines">0 lines</span></span><span class="fl-tally"><span class="fl-tp o">outer <b data-fl="to">0</b></span><span class="fl-tp b">inner <b data-fl="ti">0</b></span></span></div>
    <div class="fl-outb term" data-fl="out"></div>
  </div>
</div>
<div class="fl-r">
  <div class="fl-cap"><span class="fl-capn" data-fl="capn">0</span><span class="fl-capt" data-fl="capt"></span></div>
  <div class="fl-chart">{_svg()}<div class="fl-done" data-fl="done"></div><p class="fl-deadnote">Grey boxes: the dot never reached them.</p></div>
</div>
</div>'''


CSS = r"""
/* ---- follow the dot: the nested loop as a flowchart ---- */
.fl{--o:#F29A1F;--o-deep:#C77700;--o-soft:#FFF4E4;--b:#2F7FE0;--b-deep:#1F5FB8;--b-soft:#EEF5FF;
  --g:#1F9D62;--dot:#F2B705;--fl-line:#DFE7EE;--fl-muted:#667787;--fl-faint:#A5B3BF;
  flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,36%) minmax(0,1fr);gap:18px}
.fl-l{min-height:0;display:flex;flex-direction:column;gap:12px}
.fl-r{min-height:0;display:flex;flex-direction:column;gap:10px}
.fl-ed,.fl-out{background:#fff;border:1px solid var(--fl-line);border-radius:16px;overflow:hidden;
  box-shadow:0 1px 2px rgba(20,50,80,.04),0 6px 18px rgba(20,50,80,.05)}
.fl-tab{display:flex;align-items:center;gap:8px;padding:7px 14px;border-bottom:1px solid var(--fl-line);
  background:#F7FAFC;font:600 14px var(--sans);color:var(--fl-muted)}
.fl-tab i{width:10px;height:10px;border-radius:50%;background:#3FB5E5}
.fl-code{padding:6px 0;font:500 15px/1.7 var(--mono);overflow-x:auto}
.fl-ln{display:flex;white-space:pre;padding-right:12px;transition:background-color .25s var(--ease-out)}
.fl-ln em{flex:none;width:38px;padding-right:12px;text-align:right;font-style:normal;color:var(--fl-faint)}
.fl-ln.now{background:#FFF6DC;box-shadow:inset 4px 0 0 var(--dot)}
.fl-ln.now em{color:var(--o-deep);font-weight:700}
.fl-ln.dead{color:#B7C2CB}.fl-ln.dead span *{color:inherit !important}
.fl-code i{font-style:normal}
.fl-code .kw{color:var(--dk-red);font-weight:700}.fl-code .fn{color:var(--dk-blue)}.fl-code .st{color:#22863A}
.fl-sl{display:inline-block;padding:0 3px;border-radius:5px;font-weight:800}
.fl-sl.o{background:var(--o-soft);color:var(--o-deep)}.fl-sl.b{background:var(--b-soft);color:var(--b-deep)}
.fl-knobs{display:grid;gap:6px;padding:8px 14px 10px;border-top:1px solid var(--fl-line)}
.fl-knob{display:grid;grid-template-columns:auto 1fr 2ch;align-items:center;gap:10px;
  font:600 13px var(--sans);color:var(--fl-muted)}
.fl-knob b{font:800 15px var(--mono);color:var(--dk-text);text-align:right}
.fl-knob input{width:100%}
.fl-knob.o input{accent-color:var(--o)}.fl-knob.b input{accent-color:var(--b)}
.fl-vars{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fl-var{padding:9px 12px;border-radius:14px;border:1.5px solid var(--fl-line);background:#fff;min-width:0}
.fl-var.o{border-color:#F7CF95;background:linear-gradient(180deg,#FFFBF4,#fff)}
.fl-var.b{border-color:#B9D4FA;background:linear-gradient(180deg,#F6FAFF,#fff)}
.fl-vtop{display:flex;align-items:baseline;justify-content:space-between}
.fl-vn{font:800 15px var(--mono)}
.fl-var.o .fl-vn{color:var(--o-deep)}.fl-var.b .fl-vn{color:var(--b-deep)}
.fl-vv{font:800 30px/1 var(--mono);color:var(--dk-text)}
.fl-vv.pop{animation:flpop .45s var(--ease-out)}
@keyframes flpop{40%{transform:scale(1.25)}}
.fl-chips{display:flex;flex-wrap:wrap;gap:5px;margin:7px 0 4px}
.fl-chip{min-width:28px;padding:2px 6px;border-radius:8px;text-align:center;font:700 14px var(--mono);
  border:1.5px solid var(--fl-line);color:var(--fl-muted);background:#fff;transition:all .25s var(--ease-out)}
.fl-var.o .fl-chip.now{background:var(--o);border-color:var(--o);color:#fff;transform:translateY(-2px)}
.fl-var.b .fl-chip.now{background:var(--b);border-color:var(--b);color:#fff;transform:translateY(-2px)}
.fl-chip.used{opacity:.4;text-decoration:line-through}
.fl-chip.empty{border-style:dashed;color:var(--fl-faint)}
.fl-hist{min-height:20px;font:600 14px var(--mono);color:var(--fl-faint)}
.fl-hist s{margin-right:6px}
.fl-out{flex:1;min-height:0;display:flex;flex-direction:column}
.fl-outh{display:flex;justify-content:space-between;align-items:center;padding:7px 14px;
  border-bottom:1px solid var(--fl-line);font:600 14px var(--sans);color:var(--fl-muted)}
.fl-tally{display:flex;gap:6px}
.fl-tp{padding:2px 9px;border-radius:999px;font:600 13px var(--sans)}
.fl-tp b{font:800 15px var(--mono)}
.fl-tp.o{background:var(--o-soft);color:var(--o-deep)}.fl-tp.b{background:var(--b-soft);color:var(--b-deep)}
.fl .fl-outb{flex:1;min-height:0;overflow:auto;margin:0;padding:6px 14px 8px;background:#fff;border:0;
  font:600 14px/1.45 var(--mono);color:var(--dk-text);white-space:pre}
.fl-outb .l{display:block;border-radius:6px;padding:0 6px;margin:0 -6px}
.fl-outb .l.o{color:var(--o-deep)}.fl-outb .l.b{color:var(--b-deep)}.fl-outb .l.e{color:var(--g)}
.fl-outb .l.fresh{animation:flfresh 1.2s var(--ease-out)}
@keyframes flfresh{0%{background:#FFE9A8}100%{background:transparent}}
.fl-outb .ph{color:var(--fl-faint);font-weight:500}
.fl-cap{display:flex;align-items:center;gap:12px;min-height:56px;padding:9px 14px;border-radius:14px;
  background:linear-gradient(90deg,#F2F8FC,#FAFCFE);border:1px solid var(--fl-line)}
.fl-capn{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;
  background:var(--dot);color:#503C00;font:800 14px var(--mono);box-shadow:0 0 0 5px rgba(242,183,5,.18)}
.fl-capt{font:600 18px/1.35 var(--sans);color:var(--dk-text)}
.fl-capt b.o{color:var(--o-deep)}.fl-capt b.b{color:var(--b-deep)}.fl-capt b.g{color:var(--g)}
.fl-chart{position:relative;flex:1;min-height:0;border-radius:14px;
  background-image:radial-gradient(#E3EAF0 1.2px,transparent 1.2px);background-size:22px 22px}
.fl-svg{display:block;width:100%;height:100%}
.fl-rego{fill:rgba(242,154,31,.06);stroke:var(--o);stroke-width:2;stroke-dasharray:10 8}
.fl-regb{fill:rgba(47,127,224,.07);stroke:var(--b);stroke-width:2;stroke-dasharray:10 8}
.fl-regt{font:800 15px var(--sans);letter-spacing:.08em}
.fl-regp{font:600 15px var(--sans)}
.fl-regt.o,.fl-regp.o{fill:var(--o-deep)}.fl-regt.b,.fl-regp.b{fill:var(--b-deep)}
.fl-edge{fill:none;stroke:#C6D1DB;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;
  transition:stroke .3s var(--ease-out),stroke-width .3s var(--ease-out)}
.fl-edge.lo{stroke:var(--o);stroke-dasharray:9 8}.fl-edge.lb{stroke:var(--b);stroke-dasharray:9 8}
.fl-edge.hot{stroke:var(--dot);stroke-width:5;stroke-dasharray:none;filter:url(#flglow)}
.fl-elab{font:700 14px var(--sans);fill:var(--fl-muted)}
.fl-elab.t.on{fill:var(--g)}.fl-elab.f.on{fill:var(--dk-red)}
.fl-node .sh{transition:stroke-width .3s var(--ease-out),opacity .3s}
.fl-node text{font:700 17px var(--mono);fill:var(--dk-text)}
.fl-node text.fl-sans{font-family:var(--sans)}
.fl-node .sub{font:600 12.5px var(--sans);fill:var(--fl-muted)}
.fl-pill .sh{fill:#fff;stroke:#B8C6D2;stroke-width:2}
.fl-d1 .sh{fill:url(#flgo);stroke:var(--o);stroke-width:2.5}
.fl-d2 .sh{fill:url(#flgb);stroke:var(--b);stroke-width:2.5}
.fl-p .sh{fill:#fff;stroke:#CBD6E0;stroke-width:2}
.fl-p .acc{fill:var(--fl-line)}
.fl-p1 .acc{fill:var(--o)}.fl-p2 .acc{fill:var(--b)}.fl-end .acc{fill:var(--g)}
.fl-node.on .sh{stroke:var(--dot);stroke-width:4.5;filter:url(#flglow)}
.fl-node.flash .sh{animation:flflash .6s var(--ease-out)}
@keyframes flflash{50%{stroke-width:7}}
.fl-node.dead{opacity:.35}
.fl-node.dead .sh{stroke-dasharray:6 5}
.fl-dot{fill:var(--dot);stroke:#fff;stroke-width:3.5}
.fl-halo{fill:none;stroke:var(--dot);stroke-width:3;opacity:0}
.fl-halo.go{animation:flhalo .8s var(--ease-out)}
@keyframes flhalo{0%{opacity:.8;r:12}100%{opacity:0;r:34}}
.fl-trail{fill:var(--dot);opacity:.35}
.fl-done{position:absolute;right:12px;bottom:12px;max-width:210px;padding:10px 14px;border-radius:14px;
  background:#fff;border:2px solid var(--g);box-shadow:0 10px 30px rgba(20,80,50,.15);
  font:700 15px/1.45 var(--sans);color:var(--dk-text);opacity:0;transform:translateY(8px);
  pointer-events:none;transition:opacity .4s var(--ease-out),transform .4s var(--ease-out)}
.fl-done.on{opacity:1;transform:none}
.fl-deadnote{position:absolute;left:12px;bottom:12px;margin:0;padding:6px 12px;border-radius:10px;
  background:#F1F4F7;border:1px dashed #B7C2CB;font:600 14px var(--sans);color:var(--fl-muted);display:none}
.fl.has-dead .fl-deadnote{display:block}
.fl-done span{display:block}.fl-done span+span{margin-top:4px}
.fl-done em{font-style:normal;font-family:var(--mono);color:var(--g)}
body.present .fl-code{font-size:clamp(13px,1.15vw,20px)}
body.present .fl-capt{font-size:clamp(15px,1.4vw,24px)}
body.present .fl-vv{font-size:clamp(24px,2.2vw,38px)}
body.present .fl-chip,body.present .fl-hist,body.present .fl .fl-outb{font-size:clamp(12px,1vw,17px)}
body.present .fl-knob{font-size:clamp(11px,.9vw,15px)}
body.present .fl-done{font-size:clamp(13px,1.05vw,18px);max-width:clamp(190px,13vw,250px)}
@media (prefers-reduced-motion:reduce){.fl *{animation:none !important;transition:none !important}}
"""


JS = r"""
  /* ---- follow the dot: one arrow per press ---- */
  document.querySelectorAll('.fl[data-flow]').forEach(function(w){
    var V = JSON.parse(w.dataset.flow), stage = w.closest('.stage');
    var n = +w.dataset.n, stop = +w.dataset.stop, ev = V[n + ',' + stop], prev = 0, anim = null;
    var LINE = {start:0, d1:1, p1:2, d2:3, p2:4, end:5};
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function q(k){ return w.querySelector('[data-fl="' + k + '"]'); }
    function rng(a, b){ var r = []; for (var i = a; i < b; i++) r.push(i); return r; }
    function code(){
      var src = [
        '<b class="kw">for</b> a <b class="kw">in</b> <i class="fn">range</i>(<b class="fl-sl o">' + n + '</b>):',
        '    <i class="fn">print</i>(<i class="st">"outer : "</i> + <i class="fn">str</i>(a))',
        '    <b class="kw">for</b> b <b class="kw">in</b> <i class="fn">range</i>(7, <b class="fl-sl b">' + stop + '</b>):',
        '        <i class="fn">print</i>(<i class="st">"  inner : "</i> + <i class="fn">str</i>(b))',
        '<i class="fn">print</i>(<i class="st">"End"</i>)'];
      q('code').innerHTML = src.map(function(s, i){
        return '<div class="fl-ln" data-l="' + (i + 1) + '"><em>' + (i + 1) + '</em><span>' + s + '</span></div>'; }).join('');
      q('d1t').textContent = 'a in range(' + n + ')';
      q('d2t').textContent = 'b in range(7, ' + stop + ')';
    }
    function place(x, y){ ['dot','halo','tr1','tr2'].forEach(function(k){ q(k).setAttribute('cx', x); q(k).setAttribute('cy', y); }); }
    function edge(id){ return w.querySelector('[data-e="' + id + '"]'); }
    function travel(id, done){
      if (anim) cancelAnimationFrame(anim.id);
      var p = edge(id), L = p.getTotalLength(), a = p.getPointAtLength(0), z = p.getPointAtLength(L);
      var cx = +q('dot').getAttribute('cx'), cy = +q('dot').getAttribute('cy');
      var l1 = Math.hypot(a.x - cx, a.y - cy), T = l1 + L, dur = Math.min(1000, 360 + T * 0.9), t0 = performance.now();
      function at(d){ if (d <= l1){ var t = l1 ? d / l1 : 1; return [cx + (a.x - cx) * t, cy + (a.y - cy) * t]; }
        var r = p.getPointAtLength(d - l1); return [r.x, r.y]; }
      function ease(t){ return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
      anim = {id:0};
      (function f(now){
        var t = Math.min(1, (now - t0) / dur), d = ease(t) * T;
        var P = at(d), P1 = at(Math.max(0, d - 18)), P2 = at(Math.max(0, d - 34));
        q('dot').setAttribute('cx', P[0]); q('dot').setAttribute('cy', P[1]);
        q('tr1').setAttribute('cx', P1[0]); q('tr1').setAttribute('cy', P1[1]);
        q('tr2').setAttribute('cx', P2[0]); q('tr2').setAttribute('cy', P2[1]);
        if (t < 1) anim.id = requestAnimationFrame(f); else { anim = null; place(z.x, z.y); done(); }
      })(t0);
    }
    function kick(el, cls){ el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); }
    function chips(el, vals, used, now, done){
      if (!vals.length){ el.innerHTML = '<span class="fl-chip empty">empty</span>'; return; }
      el.innerHTML = vals.map(function(v){
        var c = 'fl-chip';
        if (done || (used.indexOf(v) >= 0 && v !== now)) c += ' used'; else if (v === now) c += ' now';
        return '<span class="' + c + '">' + v + '</span>'; }).join('');
    }
    function render(to, animate){
      var e = ev[to], B = rng(7, stop);
      var s = {a:[], b:[], bp:[], out:[], o:0, i:0, endA:0, endB:0, pass:0, seen:{}};
      for (var i = 0; i <= to; i++){
        var x = ev[i]; s.seen[x.node] = 1;
        if (x.set && x.set[0] === 'a'){ s.a.push(x.set[1]); s.pass++; s.bp = []; s.endB = 0; }
        if (x.set && x.set[0] === 'b'){ s.b.push(x.set[1]); s.bp.push(x.set[1]); }
        if (x.endB) s.endB = 1; if (x.endA) s.endA = 1;
        if (x.out){ s.out.push(x.out); if (x.out[0] === 'o') s.o++; if (x.out[0] === 'b') s.i++; }
      }
      var fin = to === ev.length - 1;
      w.querySelectorAll('.fl-ln').forEach(function(l){
        l.classList.toggle('now', +l.dataset.l === LINE[e.node]);
        l.classList.toggle('dead', fin && [0,'d1','p1','d2','p2','end'][+l.dataset.l] && !s.seen[[0,'d1','p1','d2','p2','end'][+l.dataset.l]]); });
      w.querySelectorAll('.fl-node').forEach(function(g){
        g.classList.toggle('on', g.dataset.n === e.node);
        g.classList.toggle('dead', fin && !s.seen[g.dataset.n]); });
      w.classList.toggle('has-dead', !!w.querySelector('.fl-node.dead'));
      w.querySelectorAll('.fl-edge').forEach(function(p){ p.classList.toggle('hot', p.dataset.e === e.edge); });
      w.querySelectorAll('.fl-elab').forEach(function(t){ t.classList.toggle('on', t.dataset.tf === e.tf); });
      var a = s.a.length ? s.a[s.a.length - 1] : null, b = s.b.length ? s.b[s.b.length - 1] : null;
      q('va').textContent = a === null ? ' ' : a; q('vb').textContent = b === null ? ' ' : b;
      chips(q('ca'), rng(0, n), s.a, a, s.endA);
      chips(q('cb'), B, s.bp, s.bp.length ? s.bp[s.bp.length - 1] : null, s.endB || s.endA);
      q('ha').innerHTML = s.a.slice(0, -1).map(function(v){ return '<s>' + v + '</s>'; }).join('');
      q('hb').innerHTML = s.b.slice(0, -1).map(function(v){ return '<s>' + v + '</s>'; }).join('');
      var o = q('out');
      o.innerHTML = s.out.length ? s.out.map(function(x, i){
        return '<span class="l ' + x[0] + (animate && e.out && i === s.out.length - 1 ? ' fresh' : '') + '">' + x[1] + '</span>'; }).join('')
        : '<span class="ph">Nothing printed yet.</span>';
      o.scrollTop = o.scrollHeight;
      q('olines').textContent = s.out.length + (s.out.length === 1 ? ' line' : ' lines');
      q('to').textContent = s.o; q('ti').textContent = s.i;
      q('po').textContent = s.pass ? '· pass ' + s.pass + ' of ' + n : '';
      q('pb').textContent = s.bp.length ? '· pass ' + s.bp.length + ' of ' + B.length : '';
      q('capn').textContent = to; q('capt').innerHTML = e.cap;
      q('done').innerHTML = '<span>inner print: <em>' + n + ' × ' + B.length + ' = ' + (n * B.length) + '</em> times</span>'
        + '<span>outer print: <em>' + n + '</em> times</span><span>End: <em>1</em> time</span>';
      q('done').classList.toggle('on', !!e.final);
      var last = null; for (var j = to; j >= 0 && !last; j--) if (ev[j].edge) last = ev[j].edge;
      var tgt = [330, 62];
      if (last){ var pe = edge(last), r = pe.getPointAtLength(pe.getTotalLength()); tgt = [r.x, r.y]; }
      function arrive(){ kick(q('halo'), 'go'); kick(w.querySelector('.fl-node[data-n="' + e.node + '"]'), 'flash');
        if (e.set) kick(q(e.set[0] === 'a' ? 'va' : 'vb'), 'pop'); }
      if (animate && e.edge && !reduce) travel(e.edge, arrive);
      else { if (anim){ cancelAnimationFrame(anim.id); anim = null; } place(tgt[0], tgt[1]); if (animate) arrive(); }
    }
    code();
    ownSteps(stage, function(){ return ev.length; }, function(at){
      render(at - 1, at === prev + 1); prev = at; });
    w.querySelectorAll('input[data-w]').forEach(function(inp){
      inp.addEventListener('input', function(){
        if (inp.dataset.w === 'n') { n = +inp.value; q('knv').textContent = n; }
        else { stop = +inp.value; q('ksv').textContent = stop; }
        ev = V[n + ',' + stop]; code(); prev = 0; stage.animGo(1);
      });
      inp.addEventListener('keydown', function(e){ e.stopPropagation(); });
    });
  });
"""
