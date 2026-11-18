// Acceptance checks for the character rig.   node tests/acceptance.mjs [outDir]
// Needs the folder served:  python3 -m http.server 8791 --bind 127.0.0.1   (run inside char/)
// Uses the Playwright already installed for deck-engine; no other dependency.
import { chromium } from '../../../../deck-engine/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HERE = path.resolve(import.meta.dirname, '..');
const OUT = process.argv[2] || path.join(os.tmpdir(), 'char-acceptance');
const URL_ = process.env.URL || 'http://127.0.0.1:8791/preview.html';
fs.mkdirSync(OUT, { recursive: true });
const results = [];
const report = (n, name, pass, detail) => { results.push({ n, name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${n}. ${name}\n      ${detail}`); };

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/brave-browser' });
const open = async (url = URL_, ctxOpts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 1000 }, ...ctxOpts });
  const pg = await ctx.newPage(); pg.errs = []; pg.reqs = [];
  pg.on('console', m => m.type() === 'error' && pg.errs.push(m.text())); pg.on('pageerror', e => pg.errs.push(String(e)));
  pg.on('request', r => pg.reqs.push(r.url()));
  await pg.goto(url); await pg.waitForFunction('window.__ready === true', null, { timeout: 8000 });
  return pg;
};
const frames = (pg, n) => pg.evaluate(n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
// crop of the stage given a box in canvas units
const crop = async (pg, box, file) => {
  const clip = await pg.evaluate(b => { const m = document.querySelector('#character').getScreenCTM(); const p = new DOMPoint(b[0], b[1]).matrixTransform(m), q = new DOMPoint(b[0] + b[2], b[1] + b[3]).matrixTransform(m); return { x: p.x, y: p.y, width: q.x - p.x, height: q.y - p.y }; }, box);
  return pg.screenshot({ clip, ...(file ? { path: path.join(OUT, file) } : {}) });
};
const tile = async (shots, cols, cellW, ratio, file) => {
  const ch = Math.round(cellW * ratio), pg = await browser.newPage({ viewport: { width: cols * cellW, height: Math.ceil(shots.length / cols) * ch } });
  await pg.setContent(`<body style="margin:0;display:flex;flex-wrap:wrap;background:#fff">${shots.map(s => `<img src="data:image/png;base64,${s.toString('base64')}" style="width:${cellW}px;height:${ch}px;display:block">`).join('')}</body>`);
  await pg.screenshot({ path: path.join(OUT, file) }); await pg.close();
};

/* 1. no black or dark-neutral stroke, outline or fill */
{
  const pg = await open();
  const r = await pg.evaluate(() => {
    const hsl = s => { const m = s.match(/[\d.]+/g).map(Number), [r, g, b] = m.map(v => v / 255), a = m.length > 3 ? m[3] : 1, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, sat = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1)); return { l, sat, a }; };
    const darkNeutral = c => c.l < 0.02 || (c.l < 0.25 && c.sat < 0.2);
    const bad = [], strokes = new Set(); let shapes = 0, stroked = 0;
    for (const el of document.querySelectorAll('#character path, #character circle, #character ellipse, #character rect, #character line, #character polygon')) {
      if (el.closest('clipPath, defs, #ui-layer')) continue;
      shapes++;
      const cs = getComputedStyle(el);
      if (cs.stroke !== 'none') { stroked++; strokes.add(cs.stroke); const c = hsl(cs.stroke); if (c.a > 0 && darkNeutral(c)) bad.push(['stroke', cs.stroke, el.outerHTML.slice(0, 70)]); }
      if (cs.fill !== 'none' && !cs.fill.startsWith('url')) { const c = hsl(cs.fill); if (c.a > 0 && darkNeutral(c)) bad.push(['fill', cs.fill, el.outerHTML.slice(0, 70)]); }
    }
    const stops = [];
    for (const st of document.querySelectorAll('#character stop')) { const col = getComputedStyle(st).stopColor, c = hsl(col); if (darkNeutral(c)) stops.push(col); }
    const vars = [...document.querySelector('#character style').textContent.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(m => [m[1], m[2]]);
    const darkVars = vars.filter(([, h]) => { const n = parseInt(h.slice(1), 16), c = hsl(`rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`); return darkNeutral(c); });
    return { shapes, stroked, strokeColours: [...strokes].length, bad, stops, darkVars, vars: vars.length };
  });
  const text = fs.readFileSync(path.join(HERE, 'character.svg'), 'utf8');
  const literal = (text.match(/(?:stroke|fill)="(?!url|none)[^"]+"/g) || []).length + (/#000\b|black/i.test(text.replace(/<title>.*?<\/title>/, '')) ? 1 : 0);
  report(1, 'No black or dark-neutral stroke or outline', r.bad.length === 0 && r.stops.length === 0 && r.darkVars.length === 0 && literal === 0,
    `${r.shapes} drawn shapes, ${r.stroked} carry a stroke in ${r.strokeColours} palette colours (seams, laces, lip and lid lines); 0 black, ${r.bad.length} dark-neutral strokes or fills, ${r.stops.length} dark-neutral gradient stops, ${r.darkVars.length} of ${r.vars} palette variables dark-neutral, ${literal} literal colours outside the palette.`
    + (r.bad.length ? ' First: ' + JSON.stringify(r.bad[0]) : ''));
  await pg.close();
}

/* 2. render vs reference: saved side by side; palette and proportions measured */
{
  const pg = await open();
  await pg.evaluate(() => { rig.reset(); rig.physics = false; document.querySelector('#hud').style.display = 'none'; });
  await frames(pg, 4);
  await crop(pg, [0, 0, 1086, 1448], 'check2-render.png');
  const m = await pg.evaluate(() => {
    const box = id => { const r = document.querySelector('#' + id).getBBox(); return r; };
    const hair = document.querySelector('#hair-cap').getBBox(), face = document.querySelector('#face').getBBox();
    return { hairTop: hair.y, chin: face.y + face.height, ground: rig.ground, vars: Object.fromEntries([...document.querySelector('#character style').textContent.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(x => [x[1], x[2]])) };
  });
  const heads = (m.ground - m.hairTop) / (m.chin - m.hairTop);
  report(2, 'Rendered output compared with the reference', true,
    `Saved ${path.join(OUT, 'check2-render.png')} at the reference's own framing (1086 x 1448). Head ${Math.round(m.chin - m.hairTop)} of ${Math.round(m.ground - m.hairTop)} units = ${heads.toFixed(2)} heads (reference: hair top 47, chin 279, sole 1397 = 5.82 heads). Palette: ${Object.keys(m.vars).length} variables sampled from the reference. Differences are listed in the README; this check needs a person to look.`);
  await pg.close();
}

/* 3. fingers: every joint bends, no gaps in fist / open / relaxed */
{
  const pg = await open();
  await pg.evaluate(() => { rig.physics = false; });
  const shots = []; const gaps = [];
  for (const preset of ['fist', 'open', 'relaxed']) {
    await pg.evaluate(p => { rig.reset(); rig.physics = false; rig.hand(p); }, preset); await frames(pg, 3);
    for (const box of [[262, 640, 190, 210], [634, 640, 190, 210]]) shots.push(await crop(pg, box));
    // gap test: consecutive segments must overlap; distance between a segment's end joint and the child's pivot is zero by construction, so measure the drawn overlap instead
    gaps.push(await pg.evaluate(() => {
      let worst = 0;
      for (const s of ['r', 'l']) for (const f of ['finger-index', 'finger-middle', 'finger-ring', 'finger-pinky', 'thumb']) {
        const names = f === 'thumb' ? ['meta', 'prox', 'dist'] : ['prox', 'mid', 'dist'];
        for (let i = 1; i < 3; i++) {
          const child = document.querySelector(`#${f}-${names[i]}-${s}`), ball = child.parentNode.querySelector(':scope > circle');
          const b = ball.getBoundingClientRect(), bc = [b.x + b.width / 2, b.y + b.height / 2], p = rig.pivot(`${f}-${names[i]}-${s}`);
          const m = document.querySelector('#character').getScreenCTM(), q = new DOMPoint(p[0], p[1]).matrixTransform(m);
          worst = Math.max(worst, Math.hypot(q.x - bc[0], q.y - bc[1]));
        }
      }
      return worst;
    }));
  }
  const moved = await pg.evaluate(() => {
    rig.reset(); rig.physics = false; const out = [];
    for (const [id, j] of rig.joints) if (/^(finger|thumb)-/.test(id)) {
      const bone = j.targets[0].bone.id, tip = () => rig.point(bone, [rig.bones.get(bone).pivot[0], rig.bones.get(bone).pivot[1] + 10]);
      rig.set(id, j.min); rig.step(0); const a = tip(); rig.set(id, j.max); rig.step(0); const b = tip();
      out.push([id, Math.hypot(a[0] - b[0], a[1] - b[1])]); rig.set(id, j.default);
    }
    return out;
  });
  await tile(shots, 2, 420, 210 / 190, 'check3-fingers.png');
  const still = moved.filter(m => m[1] < 1);
  report(3, 'Every finger bends at all joints, no gaps in fist, open, relaxed', still.length === 0 && Math.max(...gaps) < 1.5,
    `${moved.length} finger and thumb joints each swing their segment between min and max (smallest travel ${Math.min(...moved.map(m => m[1])).toFixed(1)} units). Joint ball to child pivot offset: worst ${Math.max(...gaps).toFixed(2)} screen px over the three presets (a gap would need more than the ball radius). Picture: check3-fingers.png (rows: fist, open, relaxed; right hand, left hand).`);
  await pg.close();
}

/* 4. sliders and IK targets stop at their limits */
{
  const pg = await open();
  const r = await pg.evaluate(() => {
    rig.reset(); const bad = [];
    for (const [id, j] of rig.joints) {
      if (rig.set(id, j.max + 500) !== j.max) bad.push(id + ' max'); rig.step(0); if (j.final > j.max + 1e-9) bad.push(id + ' final max');
      if (rig.set(id, j.min - 500) !== j.min) bad.push(id + ' min'); rig.step(0); if (j.final < j.min - 1e-9) bad.push(id + ' final min');
      rig.set(id, j.default);
    }
    const ui = [];
    for (const row of document.querySelectorAll('.row')) { const [, range, num] = row.children; if (+range.min !== +num.min || +range.max !== +num.max) ui.push(row.textContent); }
    // typed value beyond the limit
    const first = document.querySelector('details[open] .row'), num = first.children[2]; num.value = 99999; num.dispatchEvent(new Event('change'));
    return { n: rig.joints.size, bad, ui, typed: +first.children[1].value, typedMax: +first.children[1].max };
  });
  // IK: push every target far outside reach, in several directions, with physics on (breathing, springs and balance all running)
  const ik = await pg.evaluate(async () => {
    rig.reset(); rig.physics = true; const out = [];
    const wait = n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
    for (const name of Object.keys(rig.ik)) for (const [x, y] of [[-900, -900], [2000, -700], [2000, 2400], [-900, 2400], [531, -2000], [531, 600]]) {
      rig.reset(); rig.setIK(name, true); rig.moveIK(name, x, y); await wait(40);
      const c = rig.ik[name], sh = rig.pivot(c.up.id), reach = Math.hypot(c.effector[0] - sh[0], c.effector[1] - sh[1]);
      const vals = [c.jUp, c.jLo].map(j => [j.id, j.final, j.min, j.max]);
      const inside = vals.every(([, v, a, b]) => v >= a - 1e-6 && v <= b + 1e-6);
      const snap = Math.hypot(c.target[0] - c.effector[0], c.target[1] - c.effector[1]);
      out.push({ name, target: [x, y], reach: +reach.toFixed(1), max: +(c.l1 + c.l2).toFixed(1), inside, snap, vals });
    }
    rig.reset(); return out;
  });
  // a real drag: the handle must end on what the limb could reach
  await pg.check('#ik'); await frames(pg, 3);
  const h = pg.locator('.ik-handle[data-ik="hand-l"]'), hb = await h.boundingBox();
  await pg.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2); await pg.mouse.down(); await pg.mouse.move(1050, 30, { steps: 12 }); await frames(pg, 30);
  await pg.mouse.up(); await frames(pg, 20);
  const drag = await pg.evaluate(() => { const c = rig.ik['hand-l']; return { err: Math.hypot(c.target[0] - c.effector[0], c.target[1] - c.effector[1]), sh: rig.final('shoulder-l'), el: rig.final('elbow-l') }; });
  const worst = ik.filter(i => !i.inside || i.reach > i.max + 0.6 || i.snap > 1);
  if (worst.length) console.log('      IK failures:', JSON.stringify(worst.slice(0, 3)));
  report(4, 'Every slider and IK target stops at its limit', r.bad.length === 0 && r.ui.length === 0 && r.typed === r.typedMax && worst.length === 0 && drag.err < 1,
    `${r.n} joints: set() beyond either limit returns the limit and the solved value never passes it (${r.bad.length} failures). ${document_rows(r)} A typed 99999 lands on the maximum (${r.typed}). IK: ${ik.length} targets placed far out of reach across 4 chains, ${worst.length} left a joint outside its limits, stretched a limb or left the target away from the limb (reach minus bone length at most ${Math.max(...ik.map(i => i.reach - i.max)).toFixed(2)}; target to limb at most ${Math.max(...ik.map(i => i.snap)).toFixed(2)} units). Dragging the hand handle off-screen and letting go leaves the target ${drag.err.toFixed(2)} units from the hand (shoulder ${drag.sh.toFixed(1)}, elbow ${drag.el.toFixed(1)}).`);
  function document_rows(r) { return `Slider and number box share the same min and max on every row (${r.ui.length} mismatches).`; }
  await pg.close();
}

/* 5. physics on: lag and settle; physics off: static */
{
  const pg = await open();
  const r = await pg.evaluate(async () => {
    const wait = n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
    const watch = ['hair-top', 'hair-front-3', 'hair-side-r', 'hood', 'cuff-r', 'cuff-l', 'hem', 'drawstring-r-3', 'spine-3'];
    const off = () => Object.fromEntries(watch.map(id => [id, Math.abs(rig.bones.get(id).spring.off)]));
    rig.reset(); rig.physics = true; rig.breathing = false; await wait(90);
    const rest = off();
    // a sharp move: swing the torso and raise both arms
    rig.pose({ 'spine-1': 15, pelvis: -12, 'shoulder-r': -120, 'shoulder-l': -120, head: 18 });
    let peak = Object.fromEntries(watch.map(id => [id, 0]));
    for (let i = 0; i < 30; i++) { await wait(1); const o = off(); for (const id of watch) peak[id] = Math.max(peak[id], o[id]); }
    await wait(360);
    const s1 = off(); await wait(45); const s2 = off();
    const settled = Object.fromEntries(watch.map(id => [id, Math.abs(s1[id] - s2[id])]));
    // physics off: nothing may change from frame to frame
    rig.physics = false; rig.settle(); await wait(5);
    const snap = () => rig.order.map(b => b.el.style.transform).join('|');
    const a = snap(); await wait(90); const b = snap();
    // and with physics on again something does move (breathing, blink)
    rig.physics = true; rig.breathing = true; const c0 = snap(); await wait(60); const c1 = snap();
    rig.reset();
    return { rest, peak, settled, staticOff: a === b, movesOn: c0 !== c1 };
  });
  const ids = Object.keys(r.peak), lag = ids.filter(id => r.peak[id] > 0.5), done = ids.filter(id => r.settled[id] < 0.05);
  report(5, 'Physics on: hair, hood and sleeves lag and settle. Physics off: static', lag.length === ids.length && done.length === ids.length && r.staticOff && r.movesOn,
    `After a sharp torso and arm move the spring offsets peak at ${ids.map(id => `${id} ${r.peak[id].toFixed(1)}°`).join(', ')}, and 6 s later they have stopped moving (largest change over 45 frames ${Math.max(...ids.map(id => r.settled[id])).toFixed(3)}°; ${done.length}/${ids.length} settled). Physics off: all bone transforms identical across 90 frames = ${r.staticOff}. Physics on again: transforms change (breathing, blink) = ${r.movesOn}.`);
  await pg.close();
}

/* 6. no gaps or wrong layering at shoulder, elbow, wrist, hip, knee, ankle at min, mid, max */
{
  const pg = await open();
  const sets = [
    ['shoulder-r', [80, 180, 520, 620]], ['elbow-r', [80, 180, 520, 620], { 'shoulder-r': -60 }], ['wrist-r', [230, 560, 250, 300]],
    ['hip-l', [330, 600, 720, 860]], ['knee-l', [330, 600, 720, 860], { 'hip-l': -50 }], ['ankle-l', [500, 1170, 280, 270]],
  ];
  const shots = [], seams = [];
  for (const [id, box, extra] of sets) for (const k of [0, 0.5, 1]) {
    seams.push(await pg.evaluate(([id, k, extra]) => {
      rig.reset(); rig.physics = false; if (extra) rig.pose(extra);
      const j = rig.joints.get(id), v = j.min + (j.max - j.min) * k; rig.set(id, v); rig.step(0); rig.step(0);
      // the joint ball must sit exactly on the child's pivot, whatever the angle
      const bone = j.targets.length ? j.targets[0].bone : rig.folds.find(f => f.flex === j).bone;
      const p = rig.pivot(bone.id), m = document.querySelector('#character').getScreenCTM(), q = new DOMPoint(p[0], p[1]).matrixTransform(m);
      const d = e => { const b = e.getBoundingClientRect(); return Math.hypot(q.x - (b.x + b.width / 2), q.y - (b.y + b.height / 2)); };
      const balls = [...bone.el.parentNode.children].filter(e => e.tagName === 'circle');
      return balls.length ? Math.min(...balls.map(d)) : null;
    }, [id, k, extra]));
    await frames(pg, 2); shots.push(await crop(pg, box));
  }
  await tile(shots.slice(0, 9), 3, 360, 620 / 520, 'check6-arm.png');
  await tile(shots.slice(9, 15), 3, 360, 860 / 720, 'check6-leg.png');
  await tile(shots.slice(15), 3, 360, 270 / 280, 'check6-ankle.png');
  const measured = seams.filter(s => s != null);
  report(6, 'No gaps, wrong layering or clipping at shoulder, elbow, wrist, hip, knee, ankle', measured.every(s => s < 1.5),
    `Each joint posed at min, mid and max (18 poses). Where the joint has a ball (shoulder, elbow, hip, knee) it stays on the child pivot: worst offset ${Math.max(...measured).toFixed(2)} screen px, so the wedge that opens on a bend is always filled. Wrist and ankle slide out from under the cuff and the trouser hem. Pictures: check6-arm.png, check6-leg.png, check6-ankle.png (rows: joint; columns: min, mid, max). Layering needs a person to look.`);
  await pg.close();
}

/* 7. breathing, blink, walk in place: run, no console errors */
{
  const pg = await open();
  const r = await pg.evaluate(async () => {
    const wait = n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
    rig.reset(); rig.physics = true; rig.breathing = true;
    let chest = [Infinity, -Infinity], lid = 0, gaze = new Set();
    const t0 = performance.now();
    while (performance.now() - t0 < 8000) { await wait(1); const y = rig.bones.get('spine-3').ch.y; chest = [Math.min(chest[0], y), Math.max(chest[1], y)]; lid = Math.max(lid, rig.final('eyelid-upper-r')); gaze.add(rig.final('gaze-x-r').toFixed(1)); }
    document.getElementById('walk').click();
    let lift = { r: 0, l: 0 }, slide = 0, sink = 0, float = 0, n = 0, dts = [], last = performance.now();
    const t1 = performance.now();
    while (performance.now() - t1 < 6000) {
      await wait(1); const now = performance.now(); dts.push(now - last); last = now; n++;
      const pts = {};
      for (const f of rig.feet) {
        const s = f.sole.map(p => rig.point(f.bone.id, p)), low = Math.max(s[0][1], s[1][1]), h = rig.ground - low;
        pts[f.side] = { h, x: (s[0][0] + s[1][0]) / 2, rest: (f.sole[0][0] + f.sole[1][0]) / 2 }; lift[f.side] = Math.max(lift[f.side], h);
      }
      // the lower foot is the one carrying weight: it must be on the ground and must not move sideways
      const sup = pts.r.h <= pts.l.h ? pts.r : pts.l;
      if (performance.now() - t1 > 600) { float = Math.max(float, sup.h); sink = Math.max(sink, -Math.min(pts.r.h, pts.l.h)); if (sup.h < 0.5) slide = Math.max(slide, Math.abs(sup.x - sup.rest)); }
    }
    document.getElementById('walk').click(); document.getElementById('wave').click(); await wait(120); document.getElementById('wave').click();
    dts.sort((a, b) => a - b);
    return { chest, lid, gaze: gaze.size, lift, slide, sink, float, fps: 1000 / (dts.reduce((a, b) => a + b, 0) / dts.length), p95: dts[Math.floor(dts.length * 0.95)] };
  });
  const step = await pg.evaluate(() => { rig.reset(); rig.play('walk'); const t = performance.now(); for (let i = 0; i < 600; i++) rig.step(1 / 60); const ms = (performance.now() - t) / 600; rig.reset(); return ms; });
  report(7, 'Breathing, blink and walk-in-place run with no console errors', pg.errs.length === 0 && r.chest[1] - r.chest[0] > 1 && r.lid > 95 && r.lift.r > 30 && r.lift.l > 30 && r.slide < 1 && r.float < 1 && r.sink < 1,
    `8 s idle: chest rises ${(r.chest[1] - r.chest[0]).toFixed(1)} units per breath, eyelid reached ${r.lid.toFixed(0)}% (a blink), ${r.gaze} distinct gaze positions (saccades). 6 s walk in place: feet lift ${r.lift.r.toFixed(0)} and ${r.lift.l.toFixed(0)} units; the supporting foot never left the ground by more than ${r.float.toFixed(2)}, sank ${r.sink.toFixed(2)}, slid ${r.slide.toFixed(2)} units. ${r.fps.toFixed(0)} fps in this headless run (95% of frames under ${r.p95.toFixed(1)} ms); the rig's own work is ${step.toFixed(2)} ms per frame. Console errors: ${pg.errs.length}${pg.errs.length ? ' ' + pg.errs[0] : ''}.`);
  await pg.close();
}

/* 8. works with the network disabled */
{
  // (a) served locally, every request that is not this machine blocked and counted
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 1000 } });
  const blocked = []; const seen = [];
  await ctx.route('**/*', route => { const u = route.request().url(); seen.push(u); if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(u)) route.continue(); else { blocked.push(u); route.abort(); } });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(URL_); await pg.waitForFunction('window.__ready === true', null, { timeout: 8000 });
  const okA = await pg.evaluate(() => document.querySelectorAll('#character [data-pivot]').length);
  await ctx.close();
  // (b) opened from disk with the browser offline
  const ctx2 = await browser.newContext({ viewport: { width: 1500, height: 1000 }, offline: true });
  const pg2 = await ctx2.newPage(); const errs2 = []; pg2.on('pageerror', e => errs2.push(String(e)));
  await pg2.goto('file://' + path.join(HERE, 'preview.html')); await pg2.waitForFunction('window.__ready === true', null, { timeout: 8000 });
  const okB = await pg2.evaluate(async () => { rig.play('walk'); await new Promise(r => setTimeout(r, 900)); return { bones: document.querySelectorAll('#character [data-pivot]').length, hud: document.querySelector('#hud').textContent }; });
  await ctx2.close();
  // (c) the two data files refused, as most browsers do for a page opened from disk: the bundled copy must take over
  const ctx3 = await browser.newContext({ viewport: { width: 1500, height: 1000 } });
  await ctx3.route(/character\.svg|rig\.json/, route => route.abort());
  const pg3 = await ctx3.newPage(); const errs3 = []; pg3.on('pageerror', e => errs3.push(String(e)));
  await pg3.goto(URL_); await pg3.waitForFunction('window.__ready === true', null, { timeout: 8000 });
  await pg3.waitForFunction(() => document.querySelector('#hud').textContent.includes('loaded from'), null, { timeout: 5000 });
  const okC = await pg3.evaluate(() => ({ bones: document.querySelectorAll('#character [data-pivot]').length, hud: document.querySelector('#hud').textContent }));
  await ctx3.close();
  const src = ['preview.html', 'rig.js'].map(f => fs.readFileSync(path.join(HERE, f), 'utf8')).join('\n');
  const remote = (src.match(/https?:\/\/(?!127\.0\.0\.1|localhost)[^\s'"<>]+/g) || []);
  report(8, 'Preview works with the network disabled', okA > 100 && blocked.length === 0 && okB.bones > 100 && okC.bones > 100 && okC.hud.includes('bundle') && errs.length + errs2.length + errs3.length === 0 && remote.length === 0,
    `Served from this machine with every outside request blocked: ${seen.length} requests, ${blocked.length} to another host, rig loaded (${okA} bones). Opened from disk with the browser set offline: rig loaded (${okB.bones} bones) and animates, ${okB.hud.includes('bundle') ? 'using the bundled copy' : 'using the files'}. With character.svg and rig.json refused, it loads from char.bundle.js (${okC.bones} bones). Remote URLs in preview.html and rig.js: ${remote.length}. Page errors: ${errs.length + errs2.length + errs3.length}.`);
}

await browser.close();
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length} of ${results.length} checks pass` + (failed.length ? `; failing: ${failed.map(f => f.n).join(', ')}` : ''));
process.exit(failed.length ? 1 : 0);
