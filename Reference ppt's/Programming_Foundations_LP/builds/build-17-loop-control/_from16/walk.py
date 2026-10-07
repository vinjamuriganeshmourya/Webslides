"""The walk: one line of a nested loop per press.

Two cards use it, and both run only their own program:

  * the explainer, "Follow both loops", on deck slide 12's code;
  * worksheet task 1's reveal, on the task's own program, after the room has
    filled in its table.

What moves is the thing the session is about: the inner range strip. Each box
the loop takes leaves, and when the outer loop moves on, every box of the inner
strip comes back and the inner loop starts again from its first value. The
variable boxes keep their history struck through, so `b` reads 7 8 7 8 7 8
across the run and the restart is on screen, not in the instructor's voice.

The events come from `panels.trace`, which `check_answers.py` checks against a
real `exec` of the same program. The card is a normal `data-anim` stage, so the
presenter's arrow keys, End and the remembered step all work unchanged; this
module only replaces the stage's `animGo` with a renderer.
"""
import html
import json

import codecard as CODE


def walk(wid, src, tab, events, vars_, strips, ask, pre=1, tiles=(),
         intro="", variants=None, knobs=(), slots=()):
    """`strips` is [(var, label)] in the order drawn. `tiles` is
    [(counter key, label)]. `intro`, when given, is what the right column shows
    on the first `pre` presses (the task, before the walk starts)."""
    cfg = {"ev": events, "vars": vars_, "pre": pre, "ask": ask,
           "strips": [v for v, _ in strips], "tiles": [k for k, _ in tiles],
           "variants": variants or {}, "knobs": [k[0] for k in knobs]}
    code = CODE.card(src, tab)
    for old, new in slots:           # a number in the code the room can change
        assert code.count(old) == 1, old
        code = code.replace(old, new)
    knob_html = "".join(
        f'<label class="wk-knob">{html.escape(lab)} <b data-kv="{key}">{val}</b>'
        f'<input type="range" data-w="{key}" min="{lo}" max="{hi}" value="{val}" '
        f'aria-label="{html.escape(lab)}"></label>'
        for key, lab, lo, hi, val in knobs)
    varboxes = "".join(
        f'<div class="varbox" data-v="{v}"><span class="nm">{v}</span>'
        '<span class="vl none">not set yet</span></div>' for v in vars_)
    strip_html = "".join(
        f'<div class="wk-strip" data-v="{v}"><span class="wk-lab">'
        f'<b>{v}</b> in {html.escape(lab)}</span>'
        '<div class="seqbar"></div></div>' for v, lab in strips)
    tile_html = "".join(
        f'<div class="wk-tile" data-k="{k}"><b>0</b><span>{html.escape(lab)}'
        '</span></div>' for k, lab in tiles)
    live = (f'<div class="wk-live">{strip_html}'
            + (f'<div class="wk-tiles">{tile_html}</div>' if tiles else '')
            + '<pre class="term"></pre></div>')
    intro_html = f'<div class="wk-intro">{intro}</div>' if intro else ''
    return (f'<div class="wk{" has-intro" if intro else ""}" id="{wid}" '
            f'data-walk="{html.escape(json.dumps(cfg), quote=True)}">'
            f'<div class="wk-l">{code}'
            + (f'<div class="wk-knobs">{knob_html}</div>' if knobs else '')
            + ('<p class="wk-key"><span class="ln ran">ran</span>'
               '<span class="ln now">running now</span>'
               '<span class="ln dead">never ran</span></p>' if knobs else '')
            + f'<div class="wk-vars">{varboxes}</div></div>'
            f'<div class="wk-r">{intro_html}{live}'
            '<p class="cap wk-cap"></p></div></div>')


def steps(events, pre=1):
    return pre + len(events)


CSS = r"""
/* ============================== the walk ============================== */
.wk{display:flex;flex:1;min-height:0;gap:26px;align-items:stretch}
.wk-l{flex:0 0 47%;min-width:0;display:flex;flex-direction:column;
  justify-content:safe center}
.wk-r{flex:1;min-width:0;display:flex;flex-direction:column;
  justify-content:safe center}
.wk .edcard{margin-bottom:16px}
.wk-vars .varbox .nm{min-width:1.4em;font:700 20px var(--mono);color:var(--dk-blue)}
.wk-strip{display:flex;align-items:center;flex-wrap:wrap;margin:0 0 6px}
.wk-lab{flex:none;min-width:9.5em;margin-right:12px;font:600 16px var(--mono);
  color:#6B7A86}
.wk-lab b{color:var(--dk-blue)}
.wk-strip[data-v="b"] .seqbar .bx,.wk-strip[data-v="j"] .seqbar .bx{
  border-color:#9B7FD8;background:#F4F0FC}
.wk-strip[data-v="b"] .seqbar .bx.at,.wk-strip[data-v="j"] .seqbar .bx.at{
  border-color:#6A48C0;background:#E6DDF8;box-shadow:0 0 0 4px rgba(106,72,192,.15)}
.wk-strip .seqbar{margin:0}
.wk-strip .seqbar .wait{font:600 15px var(--sans);color:#9AA1B0}
.wk-strip .seqbar .empty{opacity:1}
.wk-tiles{display:flex;gap:12px;margin:8px 0 12px}
.wk-tile{flex:1;padding:8px 12px;border-radius:12px;border:2px solid #D5E3EE;
  background:#F7FBFD;display:flex;align-items:baseline;gap:10px}
.wk-tile b{font:800 30px/1 var(--mono);color:var(--dk-blue);
  font-variant-numeric:tabular-nums}
.wk-tile span{font:600 15px var(--sans);color:#6B7A86}
.wk-tile[data-k="inner"] b{color:#6A48C0}
.wk .term{flex:1 1 auto;min-height:120px;background:#F6F8FA;color:#1B2530;
  border:1px solid #DDE5EC}
.wk .term:empty::before{content:'output';color:#A7B0BA}
.wk .cap{margin-top:12px}
.wk .cap:empty{display:none}
.wk-knobs{display:flex;gap:18px;margin:0 0 12px;flex-wrap:wrap}
.wk-knob{flex:1 1 40%;display:flex;align-items:center;gap:10px;padding:8px 12px;
  border-radius:10px;background:#F7FBFD;border:1px solid #D5E3EE;
  font:600 15px var(--sans);color:#5C6B78}
.wk-knob b{font:800 20px var(--mono);color:var(--dk-blue);min-width:1.2em}
.wk-knob input{flex:1;min-width:80px;accent-color:#006DAF}
.wk-slot{color:#C77700;font-weight:700}
.wk-key{display:flex;gap:10px;margin:0 0 12px;font:600 14px var(--sans);color:#5C6B78}
.wk-key .ln{padding:3px 10px;border-radius:6px;border:1px solid #DDE5EC}
.wk-key .ln.ran{background:#EAF6FC}
.wk-key .ln.now{background:#CFE9F8;box-shadow:inset 3px 0 0 var(--dk-blue)}
.wk-key .ln.dead{opacity:.35}
body.present .wk-key{font-size:clamp(11px,1.1vw,17px)}
body.present .wk-knob{font-size:clamp(12px,1.2vw,19px)}
body.present .wk-knob b{font-size:clamp(16px,1.6vw,26px)}
.wk.has-intro .wk-live{display:none}
.wk.has-intro.walking .wk-live{display:flex;flex-direction:column;flex:1;min-height:0}
.wk.has-intro.walking .wk-intro{display:none}
.wk-live{display:flex;flex-direction:column;flex:1;min-height:0}
body.present .wk{gap:clamp(18px,2vw,38px)}
body.present .wk .cx{font-size:clamp(13px,1.6vw,27px)}
body.present .wk-lab{font-size:clamp(13px,1.35vw,22px)}
body.present .wk-vars .varbox .nm{font-size:clamp(16px,1.7vw,28px)}
body.present .wk-tile b{font-size:clamp(22px,2.4vw,40px)}
body.present .wk-tile span{font-size:clamp(12px,1.3vw,20px)}
body.present .wk .term{min-height:clamp(96px,16vh,230px);font-size:clamp(13px,1.45vw,23px)}
@media (prefers-reduced-motion:reduce){.wk *{transition:none !important}}
"""

JS = r"""
  /* ---- the walk: one line of a nested loop per press ---- */
  document.querySelectorAll('.wk[data-walk]').forEach(function(wk){
    var cfg = JSON.parse(wk.dataset.walk), ev = cfg.ev, pre = cfg.pre;
    var stage = wk.closest('.stage');
    var lines = [].slice.call(wk.querySelectorAll('.cx .ln'));
    var term = wk.querySelector('.term'), cap = wk.querySelector('.wk-cap');
    var max = pre + ev.length;
    stage.dataset.anim = max;
    var next = stage.querySelector('[data-anim-next]'),
        count = stage.querySelector('[data-anim-count]');
    function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
    function render(k){
      wk.classList.toggle('walking', k > 0);
      lines.forEach(function(l){ l.classList.remove('ran','now','dead'); });
      for (var i = 0; i < k; i++){ var L = lines[ev[i].l - 1]; if (L) L.classList.add('ran'); }
      if (k > 0 && lines[ev[k-1].l - 1]) lines[ev[k-1].l - 1].classList.add('now');
      cfg.vars.forEach(function(v){
        var vals = [];
        for (var i = 0; i < k; i++) if (ev[i].set && ev[i].set[0] === v) vals.push(ev[i].set[1]);
        var box = wk.querySelector('.varbox[data-v="'+v+'"] .vl');
        if (!box) return;
        if (!vals.length){ box.className = 'vl none'; box.textContent = 'not set yet'; return; }
        box.className = 'vl';
        box.innerHTML = vals.map(function(x, j){
          return '<span class="' + (j === vals.length - 1 ? 'cv' : 'ov') + '">' + esc(x) + '</span>';
        }).join('');
      });
      cfg.strips.forEach(function(v){
        var s = null;
        for (var i = k - 1; i >= 0; i--) if (ev[i].seq && ev[i].seq[v]){ s = ev[i].seq[v]; break; }
        var bar = wk.querySelector('.wk-strip[data-v="'+v+'"] .seqbar');
        var lab = wk.querySelector('.wk-strip[data-v="'+v+'"] .wk-lab');
        if (!bar) return;
        if (s && lab) lab.innerHTML = '<b>' + v + '</b> in ' + esc(s[2]);
        if (!s){ bar.innerHTML = '<span class="wait">not reached yet</span>'; return; }
        if (!s[0].length){ bar.innerHTML = '<span class="empty">empty, nothing to take</span>'; return; }
        bar.innerHTML = s[0].map(function(x, j){
          return '<span class="bx' + (j < s[1] ? ' gone' : j === s[1] ? ' at' : '') + '">' + esc(x) + '</span>';
        }).join('');
      });
      cfg.tiles.forEach(function(t){
        var n = 0; for (var i = 0; i < k; i++) if (ev[i].c === t) n++;
        var b = wk.querySelector('.wk-tile[data-k="'+t+'"] b'); if (b) b.textContent = n;
      });
      var out = [];
      for (var i = 0; i < k; i++) if ('o' in ev[i]) out.push(ev[i].o);
      term.textContent = out.join('\n');
      cap.innerHTML = k === 0 ? cfg.ask : esc(ev[k-1].say || '');
      /* at the end, a line the program never reached greys out and stays grey */
      if (k === ev.length && ev.length){
        var hit = {}; ev.forEach(function(e){ hit[e.l] = 1; });
        lines.forEach(function(l, i){ if (!hit[i + 1]) l.classList.add('dead'); });
      }
    }
    stage.animGo = function(n){
      var at = Math.min(max, Math.max(1, n));
      stage.dataset.animAt = at;
      if (next) next.disabled = (at === max);
      if (count) count.textContent = at + ' / ' + max;
      render(Math.max(0, at - pre));
    };
    wk.querySelectorAll('input[data-w]').forEach(function(inp){
      inp.addEventListener('input', function(){
        var key = cfg.knobs.map(function(k){
          return wk.querySelector('input[data-w="'+k+'"]').value; }).join(',');
        wk.querySelectorAll('[data-kv="'+inp.dataset.w+'"],[data-slot="'+inp.dataset.w+'"]')
          .forEach(function(el){ el.textContent = inp.value; });
        if (!cfg.variants[key]) return;
        ev = cfg.variants[key]; max = pre + ev.length; stage.dataset.anim = max;
        stage.animGo(1);
      });
    });
    stage.animGo(1);
  });
"""
