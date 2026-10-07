#!/usr/bin/env python3
"""Both hooks on their own page, before either goes in the plan.

    python preview.py            # writes out/hooks-preview.html

Same card chrome as the presenter (tokens, 16:9 card, accent bar, eyebrow,
title, bottom rule), so what is approved here is what lands in the plan.
"""
import pathlib

import hook as H
import why as WY

HERE = pathlib.Path(__file__).parent
OUT = HERE / "out" / "hooks-preview.html"

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
document.querySelectorAll('.pv').forEach(function(pv){
  var stage = pv.querySelector('.stage');
  var N = +stage.dataset.anim;
  var labels = (stage.dataset.animLabels || '').split('|');
  var readout = pv.querySelector('.readout');
  var prev = pv.querySelector('[data-p]'), next = pv.querySelector('[data-n]');
  var chips = [].slice.call(pv.querySelectorAll('.beats li'));
  var at = 1;
  function go(k){
    at = Math.max(1, Math.min(N, k));
    for (var i = 1; i <= N; i++) stage.classList.toggle('an-' + i, i === at);
    readout.textContent = at + ' / ' + N + '   ' + (labels[at-1] || '');
    prev.disabled = at === 1; next.disabled = at === N;
    chips.forEach(function(c, i){ c.setAttribute('aria-current', String(i + 1 === at)); });
  }
  prev.addEventListener('click', function(){ go(at - 1); });
  next.addEventListener('click', function(){ go(at + 1); });
  pv.querySelector('[data-r]').addEventListener('click', function(){ go(1); });
  chips.forEach(function(c, i){ c.addEventListener('click', function(){ go(i + 1); }); });
  go(1);
});
"""


def card(mod, cls, sid, eyebrow, title, tag, note):
    labels = mod.LABELS.split("|")
    chips = "".join(f'<li role="button" tabindex="0" aria-current="false">{i}. {t}</li>'
                    for i, t in enumerate(labels, 1))
    return f"""<section class="pv">
  <div class="masthead"><h1>{title}</h1><span class="tag">{tag}</span></div>
  <div class="cardwrap">
    <div class="slide-head"><span class="slide-title">{title}</span></div>
    <div class="card">
      <div class="stage {cls} an-1" id="{sid}" data-anim="{mod.STEPS}" data-anim-labels="{mod.LABELS}">
        <div class="sl-head"><span class="sl-bar" aria-hidden="true"></span>
          <div><p class="sl-eyebrow">{eyebrow}</p><h3 class="sl-title">{title}</h3></div></div>
        {mod.body()}
        <div class="stage-rule" aria-hidden="true"></div>
      </div>
    </div>
  </div>
  <div class="bar"><button type="button" data-p>Back</button><button type="button" data-n>Next</button>
    <button type="button" class="ghost" data-r>Replay</button><span class="readout">1 / {mod.STEPS}</span></div>
  <ul class="beats">{chips}</ul>
  <div class="note">{note}</div>
</section>"""


NOTE1 = """<h2>How the instructor runs it</h2>
<p><b>Press 1.</b> Rs 40 for lunch on PhonePe. Say it is a new payment app a junior
wrote, not PhonePe's own build. The app gives you three tries at the UPI PIN.</p>
<p><b>Presses 2 and 3.</b> Try 1 is wrong. Try 2 is right, and the money goes.</p>
<p><b>Press 4 is the turn.</b> The screen asks for the PIN again. Ask what is wrong
with this app, and what it should do. Take three or four answers.</p>
<p><b>Press 5.</b> The phone fades and the same app is drawn as a shape. Try 3 is never
asked, and a green arrow leaves the loop the moment the PIN is right.
Nothing names it yet. The title card comes next.</p>"""

NOTE2 = """<h2>How the instructor runs it</h2>
<p><b>Opens the second half, after the quiz.</b> The room already knows break.</p>
<p><b>Press 1.</b> Instagram Reels. Reel 1 plays to the end.</p>
<p><b>Press 2.</b> Reel 2 starts, a cooking video. At 0:03 you do not like it. Ask: what do you do?
The room says swipe.</p>
<p><b>Press 3.</b> The swipe. The rest of reel 2 never plays, and reel 3 starts from 0:00.</p>
<p><b>Press 4.</b> Did the feed stop? No. Ask what would stop it: closing the app. That is
break, the word they already know.</p>
<p><b>Press 5.</b> The shape. The swipe arrow goes back to the top of the loop, not out of it.
The next card names it.</p>"""


def document():
    return ("<title>Loop Control Hooks</title>"
            f"<style>{PAGE_CSS}{H.css()}{WY.css()}"
            ".pv{margin:0 0 56px}</style><div class=\"page\">"
            + card(H, "hkstage", "stage-hook", "Programming Foundations",
                   "The PIN that keeps asking", "Session 17 &middot; hook 1, opens the session", NOTE1)
            + card(WY, "wystage", "stage-why", "Before the next word",
                   "A reel you swipe away", "Session 17 &middot; hook 2, after the quiz", NOTE2)
            + f"</div><script>{JS}</script>")


if __name__ == "__main__":
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(document(), encoding="utf-8")
    print(f"{OUT}  {OUT.stat().st_size / 1024:.0f} KB")
