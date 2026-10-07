#!/usr/bin/env python3
"""Build the hook on its own, as a standalone page, before it goes in the plan.

    python preview.py            # writes out/hook-preview.html

A panel rebuilt inside the full plan costs a full rebuild per attempt, and the
first shape is rarely the accepted one, so the hook gets previewed alone and
approved alone. The card chrome here is the plan's own: same tokens, same
16:9 card, same accent bar, eyebrow, title and bottom rule, so what is
approved here is what lands in the presenter.
"""
import pathlib

import hook as H

HERE = pathlib.Path(__file__).parent
OUT = HERE / "out" / "hook-preview.html"

HOOK_CSS = (HERE / "_css_hookonly.txt").read_text(encoding="utf-8") \
    .replace("__SHIFT__", f"{H.SHIFT:g}")

PAGE_CSS = """
:root{
  --sans:"Segoe UI",system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,"Cascadia Mono","Segoe UI Mono",Menlo,Consolas,monospace;
  --dk-blue:#006DAF; --dk-cyan:#3FB5E5; --dk-text:#434343;
  --ease-out:cubic-bezier(0.23,1,0.32,1);
  --ease-in-out:cubic-bezier(0.77,0,0.175,1);
  --ground:#EDF1F4; --ink:#16212B; --muted:#5C6B78; --rule:#D5DEE5;
  --panel:#FFFFFF; --btn:#16212B; --btn-ink:#FFFFFF;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --ground:#10171D; --ink:#E7EDF2; --muted:#93A3AF; --rule:#25323C;
    --panel:#17212A; --btn:#E7EDF2; --btn-ink:#10171D;
  }
}
:root[data-theme="dark"]{
  --ground:#10171D; --ink:#E7EDF2; --muted:#93A3AF; --rule:#25323C;
  --panel:#17212A; --btn:#E7EDF2; --btn-ink:#10171D;
}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);
  font:16px/1.55 var(--sans)}
.page{max-width:1180px;margin:0 auto;padding:0 16px;padding-block:28px 56px}
.masthead{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 14px;
  margin:0 0 6px}
.masthead h1{margin:0;font:700 26px/1.2 var(--sans);letter-spacing:-.01em;
  text-wrap:balance}
.masthead .tag{flex:none;padding:3px 10px;border-radius:999px;
  border:1px solid var(--rule);font:600 12px var(--sans);color:var(--muted)}
.lede{margin:0 0 22px;max-width:62ch;color:var(--muted);font-size:15px}

/* the card is the deck's card: white, 16:9, whatever the page theme is */
.cardwrap{background:#FFFFFF;border-radius:16px;overflow:hidden;
  box-shadow:0 1px 2px rgba(16,42,67,.08),0 18px 44px rgba(16,42,67,.14);
  border:1px solid rgba(16,42,67,.10)}
.slide-head{display:flex;align-items:center;padding:9px 16px;
  border-bottom:1px solid #E7EDF1;background:#FBFCFD}
.slide-head .slide-title{font:600 13px var(--sans);color:#5C6B78;
  letter-spacing:.01em}
.slide-head .slide-title i{font-style:normal;color:#9AA7B1}
.card{position:relative;aspect-ratio:16/9;background:#FFFFFF}
.stage{position:absolute;top:0;right:0;bottom:0;left:0;
  display:flex;flex-direction:column;padding:22px 28px 26px}
.sl-head{display:flex;flex:none;margin:0 0 6px}
.sl-head>*{margin-right:14px}
.sl-head>*:last-child{margin-right:0}
.sl-bar{flex:none;width:7px;border-radius:4px;
  background:linear-gradient(180deg,var(--dk-cyan),var(--dk-blue))}
.sl-eyebrow{margin:0;font:400 14px var(--sans);color:#7A8794}
.sl-title{margin:1px 0 0;font:400 30px/1.15 var(--sans);color:var(--dk-blue);
  letter-spacing:-.01em}
.stage-rule{flex:none;height:4px;margin-top:10px;border-radius:2px;
  background:linear-gradient(90deg,var(--dk-cyan),var(--dk-blue))}

.bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;
  margin:18px 0 0}
.bar button{flex:none;padding:9px 17px;border:0;border-radius:10px;
  background:var(--btn);color:var(--btn-ink);font:650 14px var(--sans);
  cursor:pointer;transition:transform 160ms var(--ease-out),opacity 160ms}
.bar button.ghost{background:transparent;color:var(--ink);
  border:1px solid var(--rule)}
.bar button:active{transform:scale(.97)}
.bar button:disabled{opacity:.35;cursor:default}
.bar button:focus-visible{outline:3px solid var(--dk-cyan);outline-offset:2px}
.readout{margin-left:auto;font:600 13px var(--mono);color:var(--muted);
  font-variant-numeric:tabular-nums}
.beats{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0 0;padding:0;
  list-style:none}
.beats li{padding:5px 11px;border-radius:999px;border:1px solid var(--rule);
  font:600 12px var(--sans);color:var(--muted);cursor:pointer;
  transition:background-color 160ms var(--ease-out),color 160ms var(--ease-out)}
.beats li[aria-current="true"]{background:var(--dk-blue);color:#fff;
  border-color:var(--dk-blue)}
.note{margin:26px 0 0;padding:16px 18px;border-radius:12px;
  background:var(--panel);border:1px solid var(--rule);max-width:70ch}
.note h2{margin:0 0 8px;font:700 15px var(--sans)}
.note p{margin:0 0 8px;font-size:14.5px;color:var(--muted)}
.note p:last-child{margin-bottom:0}
.note b{color:var(--ink)}
@media (max-width:620px){
  .masthead h1{font-size:21px}
  .stage{padding:14px 16px 16px}
  .sl-title{font-size:20px}
  .sl-eyebrow{font-size:11px}
  .readout{margin-left:0;width:100%}
}
@media (prefers-reduced-motion:reduce){
  .bar button,.beats li{transition:none}
}
"""

JS = """
(function(){
  var stage = document.getElementById('stage-hook');
  var N = +stage.dataset.anim;
  var labels = (stage.dataset.animLabels || '').split('|');
  var readout = document.getElementById('readout');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var chips = [].slice.call(document.querySelectorAll('.beats li'));
  var at = 1;
  function go(k){
    at = Math.max(1, Math.min(N, k));
    for (var i = 1; i <= N; i++) stage.classList.toggle('an-' + i, i === at);
    readout.textContent = at + ' / ' + N + '   ' + (labels[at-1] || '');
    prev.disabled = at === 1;
    next.disabled = at === N;
    chips.forEach(function(c, i){
      c.setAttribute('aria-current', String(i + 1 === at)); });
  }
  prev.addEventListener('click', function(){ go(at - 1); });
  next.addEventListener('click', function(){ go(at + 1); });
  document.getElementById('replay').addEventListener('click', function(){
    go(1); });
  chips.forEach(function(c, i){
    c.addEventListener('click', function(){ go(i + 1); }); });
  document.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight' || e.key === ' ') { go(at + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(at - 1); e.preventDefault(); }
  });
  go(1);
})();
"""


def document():
    labels = H.LABELS.split("|")
    chips = "".join(
        f'<li role="button" tabindex="0" aria-current="false">'
        f'{i}. {t}</li>' for i, t in enumerate(labels, 1))
    return f"""<title>Anjali's Missing Sorry</title>
<style>{PAGE_CSS}{HOOK_CSS}</style>
<div class="page">
  <div class="masthead">
    <h1>Anjali's Missing Sorry</h1>
    <span class="tag">Session 15 &middot; the hook</span>
  </div>
  <p class="lede">The opening card of String Methods, on its own. Six presses.
  Use the buttons, the beat chips, or the arrow keys.</p>

  <div class="cardwrap">
    <div class="slide-head">
      <span class="slide-title">Hook <i>&middot; the sorry that was never
      found</i></span>
    </div>
    <div class="card">
      <div class="stage hkstage an-1" id="stage-hook"
           data-anim="{H.STEPS}" data-anim-labels="{H.LABELS}">
        <div class="sl-head"><span class="sl-bar" aria-hidden="true"></span>
          <div><p class="sl-eyebrow">Before we start</p>
          <h3 class="sl-title">So who is lying?</h3></div>
        </div>
        {H.body()}
        <div class="stage-rule" aria-hidden="true"></div>
      </div>
    </div>
  </div>

  <div class="bar">
    <button type="button" id="prev">Back</button>
    <button type="button" id="next">Next</button>
    <button type="button" class="ghost" id="replay">Replay</button>
    <span class="readout" id="readout">1 / {H.STEPS}</span>
  </div>
  <ul class="beats">{chips}</ul>

  <div class="note">
    <h2>What the room is doing</h2>
    <p><b>Press 1 to 3 is a story, not a demonstration.</b> Two weeks together,
    Sanjay forgot, and Anjali says he never even apologised. He says he did, on
    Tuesday. She searches the chat and the phone takes her side. Then you
    scroll back and it is right there. One of them has to be wrong, and the
    room gets to say which before anything is explained.</p>
    <p><b>Nobody is lying.</b> He typed a space after every letter, the way
    people do when they mean it, so the message is nine characters and four of
    them are spaces. Search compares characters, and <i>sorry</i> is not inside
    <i>S O R R Y</i>.</p>
    <p><b>Press 6 is the only motion on the card.</b> Five marks sitting side
    by side stretch out to every second box. Nothing is named: slice, step and
    method all arrive on later cards. Note that nothing in the chat itself
    contains the word, because her own messages would have turned up in her own
    search.</p>
  </div>
</div>
<script>{JS}</script>
"""


if __name__ == "__main__":
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(document(), encoding="utf-8")
    print(f"{OUT}  {OUT.stat().st_size / 1024:.0f} KB")
