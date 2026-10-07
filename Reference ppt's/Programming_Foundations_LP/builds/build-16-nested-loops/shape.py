"""The shape of a nested loop, drawn the deck's way and then run.

Deck slides 7, 9 and 11 build the Block 1 to 4 picture across three flat
slides. Here it is one card:

    press 1   the shape, the two return arrows
    press 2   the outer loop, and the orange box: everything it repeats
    press 3   the inner loop, and the blue box: only Block 2
    press 4+  it runs, one block per press. Sequence A has 2 items and
              sequence B has 2 items. The token moves to the next block Python
              runs, a caption says why, and the run log fills one chip:
              Block 1, Block 2, Block 2, Block 3, then again, then Block 4.
    last      the count: Block 2 ran 4 times.

The token is the one thing that moves. The run log is the finding: Block 2
appears four times, Block 1 and Block 3 twice, Block 4 once.
"""
import html

import panels as P

STEPS = None  # set below, from order()
LABELS = ""

VB_W, VB_H = 1600, 480
X0 = 120
ROWS = {  # the element, its y, its x, its width
    "h1": (96, X0 + 40, 0),
    "b1": (122, X0 + 90, 420),
    "h2": (222, X0 + 90, 0),
    "b2": (248, X0 + 140, 370),
    "b3": (320, X0 + 90, 420),
    "b4": (392, X0 + 40, 470),
}
BH = 54


def _hdr(key, seq):
    y, x, _ = ROWS[key]
    return (f'<text class="sh-hdr sh-{key}" x="{x}" y="{y}">'
            '<tspan class="kw">for</tspan> item <tspan class="kw">in</tspan> '
            f'sequence {seq}:</text>')


def _blk(key, label):
    y, x, w = ROWS[key]
    return (f'<g class="sh-blk sh-{key}"><rect x="{x}" y="{y}" width="{w}" '
            f'height="{BH}" rx="4"/><text x="{x + w / 2}" y="{y + 35}" '
            f'text-anchor="middle">{label}</text></g>')


def figure():
    b1y, b2y, b3y = ROWS["b1"][0], ROWS["b2"][0], ROWS["b3"][0]
    ox, oy = X0 + 78, b1y - 10
    ow, oh = 450, b3y + BH + 10 - oy
    ix, iy = X0 + 128, b2y - 8
    iw, ih = 398, BH + 16
    log_rows = "".join(
        f'<g class="sh-lrow sh-lr{r}" transform="translate(0,{r * 74})">'
        f'<text class="sh-lpass" x="0" y="30">A item {r + 1}</text>'
        + "".join(f'<g class="sh-chip sh-c{r}-{k}"><rect x="{130 + k * 118}" y="0" '
                  f'width="108" height="46" rx="10"/><text x="{184 + k * 118}" y="30" '
                  f'text-anchor="middle">{lab}</text></g>'
                  for k, lab in enumerate(("Block 1", "Block 2", "Block 2", "Block 3")))
        + '</g>' for r in range(2))
    log_rows += ('<g class="sh-lrow sh-lr2" transform="translate(0,148)">'
                 '<text class="sh-lpass" x="0" y="30">after</text>'
                 '<g class="sh-chip sh-c2-0"><rect x="130" y="0" width="108" height="46" '
                 'rx="10"/><text x="184" y="30" text-anchor="middle">Block 4</text></g></g>')
    return (
        f'<svg class="fig shfig" viewBox="60 50 1510 420" '
        'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A loop inside a '
        'loop: Block 1, the inner loop with Block 2, Block 3, then Block 4 after both">'
        '<defs><marker id="shO" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" '
        'markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#F29A1F"/></marker>'
        '<marker id="shB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" '
        'markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2F7FE0"/></marker>'
        '</defs>'
        f'<rect x="{X0 + 44}" y="{b1y - 6}" width="40" height="{b3y + BH - b1y + 12}" fill="#EEF1F3"/>'
        + _hdr("h1", "A") + _blk("b1", "Block 1") + _hdr("h2", "B")
        + _blk("b2", "Block 2") + _blk("b3", "Block 3") + _blk("b4", "Block 4")
        # the two return arrows, the deck's own dashed style
        + f'<path class="sh-arr sh-arr-o" d="M{X0 + 88} {b3y + BH - 6}H{X0}V{ROWS["h1"][0] - 9}H{X0 + 30}" '
          'marker-end="url(#shO)"/>'
        + f'<circle cx="{X0 + 90}" cy="{b3y + BH - 6}" r="6" fill="#F29A1F"/>'
        + f'<path class="sh-arr sh-arr-i" d="M{X0 + 138} {b2y + BH / 2}H{X0 + 60}V{ROWS["h2"][0] - 9}H{X0 + 70}" '
          'marker-end="url(#shB)"/>'
        + f'<circle cx="{X0 + 140}" cy="{b2y + BH / 2}" r="6" fill="#2F7FE0"/>'
        # press 2: the outer loop and everything it repeats
        + f'<g class="sh-p2"><rect class="sh-box-o" x="{ox}" y="{oy}" width="{ow}" height="{oh}" rx="6"/>'
          f'<text class="sh-lab sh-lab-o" x="{ox + ow + 30}" y="{ROWS["h1"][0] - 6}">Outer loop</text>'
          f'<text class="sh-sub" x="{ox + ow + 30}" y="{ROWS["h1"][0] + 20}">repeats the orange box,</text>'
          f'<text class="sh-sub" x="{ox + ow + 30}" y="{ROWS["h1"][0] + 44}">once for each item in A</text></g>'
        # press 3: the inner loop and only Block 2
        + f'<g class="sh-p3"><rect class="sh-box-i" x="{ix}" y="{iy}" width="{iw}" height="{ih}" rx="6"/>'
          f'<text class="sh-lab sh-lab-i" x="{ox + ow + 30}" y="{ROWS["h2"][0] + 20}">Inner loop</text>'
          f'<text class="sh-sub" x="{ox + ow + 30}" y="{ROWS["h2"][0] + 46}">repeats the blue box,</text>'
          f'<text class="sh-sub" x="{ox + ow + 30}" y="{ROWS["h2"][0] + 70}">once for each item in B</text></g>'
        # press 4: the run
        + '<g class="sh-run" transform="translate(960,70)">'
          '<text class="sh-rt" x="0" y="0">Run it: A has 2 items, B has 2 items</text>'
          f'<g transform="translate(0,28)">{log_rows}</g>'
          '<text class="sh-cap" x="0" y="300"></text>'
          '<g class="sh-tally" transform="translate(0,300)">'
          '<text x="0" y="0">Block 2 ran <tspan class="sh-num">4</tspan> times: 2 times 2.</text></g></g>'
        + f'<circle class="sh-tok" cx="0" cy="0" r="13"/>'
        + '</svg>')


def order():
    """The blocks in the order Python runs them, for A and B of 2 items each,
    one per press. The run log on the card is exactly this list, cut into rows.
    `pulse` is the arrow the run just went back up."""
    seq = []
    for r in range(2):
        seq.append(("b1", f"{r}-0", "o" if r else None,
                    f"Back up the orange arrow. A item {r + 1}: Block 1 runs." if r
                    else "A item 1 starts. Block 1 runs."))
        for k in range(2):
            seq.append(("b2", f"{r}-{k + 1}", "i" if k else None,
                        f"Back up the blue arrow. B item {k + 1}: Block 2 runs." if k
                        else f"The inner loop starts{' again' if r else ''}. "
                             "B item 1: Block 2 runs."))
        seq.append(("b3", f"{r}-3", None, "B has no items left. Block 3 runs."))
    seq.append(("b4", "2-0", "o", "A has no items left. Block 4 runs once."))
    return seq


RUN = len(order())
STEPS = 3 + RUN + 1
LABELS = "|".join(["the shape", "the outer loop", "the inner loop"]
                  + [f"run {n} of {RUN}" for n in range(1, RUN + 1)] + ["the count"])


def body():
    import json
    stops = []
    for key, chip, pulse, cap in order():
        y, x, w = ROWS[key]
        stops.append({"k": key, "chip": chip, "p": pulse, "cap": cap,
                      "x": x - 22, "y": y + BH / 2})
    cfg = html.escape(json.dumps(stops), quote=True)
    return f'<div class="shwrap" data-shape="{cfg}">{figure()}</div>'


def css():
    r = [r"""
/* ---- the shape of a nested loop, then run ---- */
.shwrap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.shfig{width:100%;height:100%;display:block}
.shfig *{transform-box:view-box}
.sh-hdr{font:600 30px var(--mono);fill:#1F4E79}
.sh-arr-i{stroke-width:3}
.sh-hdr .kw{fill:#D6453D;font-weight:700}
.sh-blk rect{fill:#CDE7FA;stroke:#A9D3F2;stroke-width:1.5;
  transition:fill 200ms var(--ease-out),stroke 200ms var(--ease-out)}
.sh-blk text{font:500 22px var(--mono);fill:#4A5A66}
.sh-blk.on rect{fill:#FFE7A8;stroke:#E8A13A;stroke-width:3}
.sh-arr{fill:none;stroke-width:3;stroke-dasharray:9 7}
.sh-arr-o{stroke:#F29A1F}.sh-arr-i{stroke:#2F7FE0}
.sh-box-o{fill:none;stroke:#F29A1F;stroke-width:3;stroke-dasharray:10 7}
.sh-box-i{fill:none;stroke:#2F7FE0;stroke-width:3;stroke-dasharray:10 7}
.sh-lab{font:700 28px var(--sans)}
.sh-lab-o{fill:#C77700}.sh-lab-i{fill:#1F5FB8}
.sh-sub{font:500 21px var(--sans);fill:#5C6B78}
.sh-p2,.sh-p3,.sh-run,.sh-tok{opacity:0;transition:opacity 280ms var(--ease-out)}
.sh-rt{font:700 22px var(--sans);fill:#434343}
.sh-lpass{font:700 18px var(--sans);fill:#7A8794}
.sh-chip rect{fill:#FFFFFF;stroke:#DDE5EC;stroke-width:2;stroke-dasharray:6 5}
.sh-chip text{font:600 17px var(--mono);fill:#4A5A66;opacity:0;
  transition:opacity 200ms var(--ease-out)}
.sh-chip.on rect{fill:#F4F9FD;stroke:#A9D3F2;stroke-dasharray:none}
.sh-chip.on text{opacity:1}
.sh-c0-1.on rect,.sh-c0-2.on rect,.sh-c1-1.on rect,.sh-c1-2.on rect{fill:#E8F0FD;stroke:#2F7FE0}
.sh-cap{font:600 21px var(--sans);fill:#1F4E79;transition:opacity 200ms var(--ease-out)}
.sh-tally text{font:600 22px var(--sans);fill:#434343;opacity:0;transition:opacity 260ms var(--ease-out)}
.sh-tally.on text{opacity:1}
.sh-num{font-weight:800;fill:#1F5FB8}
.sh-tok{fill:#E8A13A;stroke:#FFFFFF;stroke-width:3;
  transition:transform 420ms var(--ease-in-out),opacity 200ms var(--ease-out)}
.sh-arr.pulse{animation:shpulse 700ms var(--ease-out)}
@keyframes shpulse{50%{stroke-width:6}}
@media (prefers-reduced-motion:reduce){.shfig *{transition:none !important;animation:none !important}}
"""]
    r.append(",".join(f".shstage.an-{k} .sh-p2" for k in (2, 3, 4)) + "{opacity:1}")
    r.append(",".join(f".shstage.an-{k} .sh-p3" for k in (3, 4)) + "{opacity:1}")
    r.append(",".join(f".shstage.an-{k} .sh-run,.shstage.an-{k} .sh-tok"
                      for k in range(4, STEPS + 1)) + "{opacity:1}")
    r.append(",".join(f".shstage.an-{k} .sh-p2,.shstage.an-{k} .sh-p3"
                      for k in range(4, STEPS + 1)) + "{opacity:.35}")
    r.append(f".shstage.an-{STEPS} .sh-cap{{opacity:0}}")
    return "\n".join(r)


JS = r"""
  /* ---- the shape card: from press 4, one block per press ---- */
  document.querySelectorAll('.shwrap[data-shape]').forEach(function(w){
    var stops = JSON.parse(w.dataset.shape), stage = w.closest('.stage');
    var tok = w.querySelector('.sh-tok'), cap = w.querySelector('.sh-cap');
    var tally = w.querySelector('.sh-tally'), n = stops.length;
    function pulse(sel){
      var a = w.querySelector(sel); a.classList.remove('pulse'); void a.getBBox(); a.classList.add('pulse'); }
    function show(i){
      w.querySelectorAll('.sh-blk.on,.sh-chip.on').forEach(function(e){ e.classList.remove('on'); });
      tally.classList.remove('on');
      if (i < 0){ cap.textContent = ''; tok.style.transform = 'translate(' + stops[0].x + 'px,' + stops[0].y + 'px)'; return; }
      for (var j = 0; j <= i; j++) w.querySelector('.sh-c' + stops[j].chip).classList.add('on');
      var s = stops[i];
      w.querySelector('.sh-blk.sh-' + s.k).classList.add('on');
      cap.textContent = s.cap;
      if (s.p === 'o') pulse('.sh-arr-o');
      if (s.p === 'i') pulse('.sh-arr-i');
      tok.style.transform = 'translate(' + s.x + 'px,' + s.y + 'px)';
    }
    ownSteps(stage, 3 + n + 1, function(at){
      if (at <= 3) show(-1);
      else if (at <= 3 + n) show(at - 4);
      else { show(n - 1); tally.classList.add('on'); }
    });
  });
"""
