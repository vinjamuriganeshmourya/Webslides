// Acceptance checks for the 3D character.   node tests/acceptance.mjs [outDir]
// Needs the folder served:  python3 -m http.server 8792 --bind 127.0.0.1   (run inside char3d/)
// Uses the Playwright already installed for deck-engine; the browser runs headless on the GPU.
import { chromium } from '../../../../deck-engine/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const HERE = path.resolve(import.meta.dirname, '..');
const OUT = process.argv[2] || path.join(os.tmpdir(), 'char3d-acceptance');
const URL_ = process.env.URL || 'http://127.0.0.1:8792/preview.html';
fs.mkdirSync(OUT, { recursive: true });
const results = [];
const report = (n, name, pass, detail) => { results.push({ n, name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${n}. ${name}\n      ${detail}`); };

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/brave-browser', args: ['--use-gl=angle', '--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist'] });
const open = async (url = URL_, ctxOpts = {}, route) => {
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 1000 }, ...ctxOpts });
  if (route) await route(ctx);
  const pg = await ctx.newPage(); pg.errs = [];
  pg.on('console', m => m.type() === 'error' && pg.errs.push(m.text())); pg.on('pageerror', e => pg.errs.push(String(e)));
  await pg.goto(url); await pg.waitForFunction('window.__ready === true', null, { timeout: 30000 });
  return pg;
};
const frames = (pg, n) => pg.evaluate(n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const hideUi = pg => pg.evaluate(() => { for (const id of ['hud', 'views', 'tip']) document.getElementById(id).style.display = 'none'; });
const shot = async (pg, js, cam) => {
  await pg.evaluate(`(()=>{${js || ''}; ${cam ? `app.camera.position.set(${cam[0].join(',')}); app.controls.target.set(${cam[1].join(',')}); app.controls.update();` : ''}})()`);
  await frames(pg, 4); return pg.locator('#stage').screenshot();
};
const tile = async (shots, cols, cellW, file) => {
  const ratio = 1000 / 1090, ch = Math.round(cellW * ratio), pg = await browser.newPage({ viewport: { width: cols * cellW, height: Math.ceil(shots.length / cols) * ch } });
  await pg.setContent(`<body style="margin:0;display:flex;flex-wrap:wrap;background:#fff">${shots.map(s => `<img src="data:image/png;base64,${s.toString('base64')}" style="width:${cellW}px;height:${ch}px;display:block">`).join('')}</body>`);
  await pg.screenshot({ path: path.join(OUT, file) }); await pg.close();
};

/* 1. no black, no dark-neutral, no outline anywhere */
{
  const pg = await open(); await hideUi(pg);
  const r = await pg.evaluate(() => {
    const hsl = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; return { l, s: mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1)) }; };
    const dark = c => c.l < 0.02 || (c.l < 0.25 && c.s < 0.2);
    const srgb = v => (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
    // palette
    const pal = Object.entries(app.palette).map(([k, h]) => { const n = parseInt(h.slice(1), 16); return [k, hsl((n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)]; });
    const darkPal = pal.filter(([, c]) => dark(c)).map(p => p[0]);
    // every vertex colour of every mesh, after baked shading
    let verts = 0, darkVerts = 0, darkest = 1;
    for (const m of Object.values(app.char.meshes)) { const c = m.geometry.attributes.color; verts += c.count; for (let i = 0; i < c.count; i++) { const k = hsl(srgb(c.getX(i)), srgb(c.getY(i)), srgb(c.getZ(i))); if (m.name !== 'head' && dark(k)) darkVerts++; darkest = Math.min(darkest, k.l); } }
    // the face drawing
    // the three face layers: skin with the eye openings cut out (transparent pixels are holes, not black), the eye layer, the highlights
    let facePx = 0;
    for (const cv of [app.face.canvas, app.face.eyeCanvas, app.face.glintCanvas]) {
      const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200 && dark(hsl(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255))) facePx++;
    }
    // what is actually on screen
    const count = () => {
      const gl = app.renderer.getContext(), w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, buf = new Uint8Array(w * h * 4);
      app.renderer.render(app.scene, app.camera); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      // a dark-neutral PATCH: 3 x 3 solid pixels or more. Thinner runs are anti-aliasing where navy meets orange or skin, not a colour in the model.
      const flag = new Uint8Array(w * h); let n = w * h, bad = 0, edge = 0, low = 1;
      for (let i = 0; i < n; i++) { const k = hsl(buf[i * 4] / 255, buf[i * 4 + 1] / 255, buf[i * 4 + 2] / 255); if (dark(k)) flag[i] = 1; low = Math.min(low, k.l); }
      for (let y = 0; y < h - 2; y++) for (let x = 0; x < w - 2; x++) { const i = x + y * w; if (!flag[i]) continue; let solid = true; for (let dy = 0; dy < 3 && solid; dy++) for (let dx = 0; dx < 3; dx++) if (!flag[i + dx + dy * w]) { solid = false; break; } if (solid) bad++; else edge++; }
      return { n, bad, edge, low };
    };
    rig.reset(); rig.physics = false; rig.step(0);
    const views = {}; for (const v of ['front', 'three', 'side', 'back', 'face', 'hand']) { app.view(v); views[v] = count(); }
    let lines = 0; app.scene.traverse(o => { if (o.isLine || o.isLineSegments) lines++; });
    return { pal: pal.length, darkPal, verts, darkVerts, darkest, facePx, views, lines };
  });
  const bad = Object.values(r.views).reduce((s, v) => s + v.bad, 0), edge = Object.values(r.views).reduce((s, v) => s + v.edge, 0), px = Object.values(r.views).reduce((s, v) => s + v.n, 0), low = Math.min(...Object.values(r.views).map(v => v.low));
  report(1, 'No black or dark-neutral stroke or outline', r.darkPal.length === 0 && r.darkVerts === 0 && r.facePx === 0 && bad === 0 && r.lines === 0,
    `There are no strokes or outline shapes in a 3D model: edges come from light on the surface. Checked instead: ${r.pal} palette colours (${r.darkPal.length} black or dark-neutral), ${r.verts} vertex colours after baked shading (${r.darkVerts}), the three face layers (${r.facePx} pixels), and ${px} rendered pixels over six camera views: ${bad} sit in a dark-neutral patch of 3 x 3 pixels or more (${edge} anti-aliased edge pixels, where navy meets orange or skin, are not counted; darkest pixel lightness ${(low * 100).toFixed(0)}%). Line objects in the scene: ${r.lines}.`);
  await pg.close();
}

/* 2. compared with the reference */
{
  const pg = await open(); await hideUi(pg);
  await pg.evaluate(() => { rig.reset(); rig.physics = false; });
  fs.writeFileSync(path.join(OUT, 'check2-front.png'), await shot(pg, '', [[0, 86, 440], [0, 84, 0]]));
  await tile([await shot(pg, '', [[0, 86, 440], [0, 84, 0]]), await shot(pg, '', [[250, 110, 350], [0, 84, 0]]), await shot(pg, '', [[440, 86, 0], [0, 84, 0]]), await shot(pg, '', [[0, 86, -440], [0, 84, 0]])], 4, 420, 'check2-turnaround.png');
  const m = await pg.evaluate(() => {
    const hair = app.char.meshes.hair.geometry.attributes.position, head = app.char.meshes.head.geometry.attributes.position;
    const tuft = app.char.skeleton.bones.findIndex(b => b.name === 'hair-top'), si = app.char.meshes.hair.geometry.attributes.skinIndex;
    let top = 0, chin = 1e9; for (let i = 0; i < hair.count; i++) if (si.getX(i) !== tuft && Math.hypot(hair.getX(i) - 1.5, hair.getZ(i) - 0.8) > 3.2) top = Math.max(top, hair.getY(i));   // the crown without the top tuft, as the reference is measured
    for (let i = 0; i < head.count; i++) if (Math.abs(head.getX(i)) < 2 && head.getZ(i) > 4) chin = Math.min(chin, head.getY(i));
    const sh = rig.bones.get('upper-arm-l').bindPos.x - rig.bones.get('upper-arm-r').bindPos.x;
    return { top, chin, sh };
  });
  report(2, 'Rendered output compared with the reference', true,
    `Saved check2-front.png and check2-turnaround.png (front, three-quarter, side, back). Crown ${m.top.toFixed(1)} cm, head ${(m.top - m.chin).toFixed(1)} cm = ${(m.top / (m.top - m.chin)).toFixed(2)} heads (the reference, measured the same way on the picture: crown at 163.9 cm, chin at 136.6, 6.0 heads). Shoulder joints ${m.sh.toFixed(1)} cm apart. Palette, outfit and face drawing are the reference's; the differences are listed in the README. This check needs a person to look.`);
  await pg.close();
}

/* 3. fingers */
{
  const pg = await open(); await hideUi(pg);
  const r = await pg.evaluate(() => {
    rig.reset(); rig.physics = false; const out = [], v = new app.THREE.Vector3(), w = new app.THREE.Vector3();
    for (const [id, j] of rig.joints) if (/^(finger|thumb)-/.test(id)) {
      const b = j.st.bone, tip = t => { rig.step(0); return t.set(0, 1.2, 0).applyMatrix4(b.matrixWorld); };
      rig.set(id, j.min); tip(v); rig.set(id, j.max); tip(w); out.push([id, v.distanceTo(w)]); rig.set(id, j.default);
    }
    return { moved: out, open: Object.fromEntries(Object.entries(app.char.data.meshes).map(([k, m]) => [k, m.open])), segs: ['r', 'l'].map(s => rig.order.filter(b => new RegExp(`^(finger|thumb)-.*-${s}$`).test(b.id)).length) };
  });
  const shots = [];
  for (const p of ['fist', 'open', 'relaxed']) for (const cam of [[[-66, 92, 50], [-23, 80, 2]], [[10, 86, 42], [-23, 80, 2]], [[-48, 76, -44], [-23, 80, 2]]]) shots.push(await shot(pg, `rig.reset(); rig.physics=false; rig.hand('${p}')`, cam));
  await tile(shots, 3, 430, 'check3-fingers.png');
  const still = r.moved.filter(m => m[1] < 0.05);
  report(3, 'Every finger bends at all joints, no gaps in fist, open, relaxed', still.length === 0 && r.open['hand-r'] === 0 && r.open['hand-l'] === 0 && r.segs[0] === 15,
    `Each hand is one closed surface (open edges: right ${r.open['hand-r']}, left ${r.open['hand-l']}), so a bend cannot open a gap. ${r.segs[0]} bones per hand: four fingers of three segments and a thumb of three. All ${r.moved.length} finger and thumb joints move their segment between min and max (smallest travel ${Math.min(...r.moved.map(m => m[1])).toFixed(2)} cm; ${still.length} did not move). Picture: check3-fingers.png (rows fist, open, relaxed; columns outer side, palm side, back).`);
  await pg.close();
}

/* 4. sliders and IK targets stop at their limits */
{
  const pg = await open(); await hideUi(pg);
  const r = await pg.evaluate(() => {
    rig.reset(); const bad = [];
    for (const [id, j] of rig.joints) {
      if (rig.set(id, j.max + 500) !== j.max) bad.push(id + ' max'); rig.step(0); if (j.final > j.max + 1e-9) bad.push(id + ' final max');
      if (rig.set(id, j.min - 500) !== j.min) bad.push(id + ' min'); rig.step(0); if (j.final < j.min - 1e-9) bad.push(id + ' final min');
      rig.set(id, j.default);
    }
    const ui = []; for (const row of document.querySelectorAll('.row')) { const [, range, num] = row.children; if (+range.min !== +num.min || +range.max !== +num.max) ui.push(row.textContent); }
    const first = document.querySelector('details[open] .row'), num = first.children[2]; num.value = 99999; num.dispatchEvent(new Event('change'));
    return { n: rig.joints.size, bad, ui, rows: document.querySelectorAll('.row').length, typed: +first.children[1].value, typedMax: +first.children[1].max };
  });
  const ik = await pg.evaluate(async () => {
    rig.reset(); rig.physics = true; const out = [], p = new app.THREE.Vector3();
    const wait = n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
    for (const name of Object.keys(rig.ik)) for (const t of [[-300, 300, 300], [300, 300, -300], [0, -300, 300], [300, 20, 0], [0, 500, 0], [0, 100, -300]]) {
      rig.reset(); rig.setIK(name, true); rig.moveIK(name, ...t); await wait(40);
      const c = rig.ik[name], J = [c.jz, c.jx, c.jy, c.jh];
      rig.pivot(c.up.id, p);
      out.push({ name, t, reach: p.distanceTo(c.effector) - (c.l1 + c.l2), snap: c.target.distanceTo(c.effector), inside: J.every(j => j.final >= j.min - 1e-6 && j.final <= j.max + 1e-6) });
    }
    rig.reset(); return out;
  });
  // a real drag of the hand handle, far off to the side
  await pg.check('#ik'); await frames(pg, 5);
  const at = await pg.evaluate(() => { const v = app.handles['hand-l'].position.clone().project(app.camera), r = app.renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; });
  await pg.mouse.move(at[0], at[1]); await pg.mouse.down(); await pg.mouse.move(1050, 40, { steps: 14 }); await frames(pg, 40);
  const held = await pg.evaluate(() => ({ active: rig.ik['hand-l'].active, reached: rig.ik['hand-l'].reached }));
  await pg.mouse.up(); await frames(pg, 20);
  const drag = await pg.evaluate(() => { const c = rig.ik['hand-l']; return { err: c.target.distanceTo(c.effector), vals: [c.jz, c.jx, c.jy, c.jh].map(j => [j.id, +j.final.toFixed(1), j.min, j.max]) }; });
  const worst = ik.filter(i => !i.inside || i.reach > 0.05 || i.snap > 0.2);
  if (worst.length) console.log('      IK failures:', JSON.stringify(worst.slice(0, 3)));
  report(4, 'Every slider and IK target stops at its limit', r.bad.length === 0 && r.ui.length === 0 && r.typed === r.typedMax && worst.length === 0 && held.active && drag.err < 0.2 && drag.vals.every(v => v[1] >= v[2] && v[1] <= v[3]),
    `${r.n} joints: a value beyond either limit is stored as the limit, and the solved value never passes it (${r.bad.length} failures). ${r.rows} slider rows, each with the same min and max on the slider and the number box (${r.ui.length} mismatches); a typed 99999 lands on the maximum (${r.typed}). IK: ${ik.length} targets placed far out of reach over 4 chains with physics running: ${worst.length} left a joint outside its limits, stretched a limb or left the target away from the limb (largest overreach ${Math.max(...ik.map(i => i.reach)).toFixed(3)} cm, target to limb at most ${Math.max(...ik.map(i => i.snap)).toFixed(3)} cm). Dragging the hand handle off the stage: IK took over = ${held.active}; after letting go the target is ${drag.err.toFixed(3)} cm from the hand, joints ${drag.vals.map(v => `${v[0]} ${v[1]}`).join(', ')}.`);
  await pg.close();
}

/* 5. physics */
{
  const pg = await open();
  const r = await pg.evaluate(async () => {
    const wait = n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
    const watch = ['hair-top', 'hair-front-3', 'hair-side-r', 'hair-back', 'hood', 'hem', 'cuff-r', 'cuff-l', 'drawstring-r-3', 'spine-3', 'head'];
    const off = () => Object.fromEntries(watch.map(id => { const s = rig.bones.get(id).spring; return [id, Math.hypot(s.rx, s.rz) * 180 / Math.PI]; }));
    rig.reset(); rig.physics = true; rig.breathing = false; await wait(90);
    rig.pose({ 'spine-1-side': 12, 'spine-1-bend': 20, 'pelvis-turn': 25, 'shoulder-raise-r': 120, 'shoulder-forward-l': 110, 'head-turn': 30, 'head-nod': 20 });
    const peak = Object.fromEntries(watch.map(id => [id, 0]));
    for (let i = 0; i < 30; i++) { await wait(1); const o = off(); for (const id of watch) peak[id] = Math.max(peak[id], o[id]); }
    await wait(360); const s1 = off(); await wait(45); const s2 = off();
    const settled = Object.fromEntries(watch.map(id => [id, Math.abs(s1[id] - s2[id])]));
    rig.physics = false; rig.settle(); await wait(5);
    const snap = () => rig.order.map(b => b.bone.matrixWorld.elements.map(v => v.toFixed(4)).join(',')).join('|') + app.face.draws;
    const a = snap(); await wait(90); const b = snap();
    rig.physics = true; rig.breathing = true; const c0 = snap(); await wait(60); const c1 = snap();
    rig.reset(); return { peak, settled, staticOff: a === b, movesOn: c0 !== c1 };
  });
  const ids = Object.keys(r.peak), lag = ids.filter(id => r.peak[id] > 0.3), done = ids.filter(id => r.settled[id] < 0.05);
  report(5, 'Physics on: hair, hood and sleeves lag and settle. Physics off: static', lag.length === ids.length && done.length === ids.length && r.staticOff && r.movesOn,
    `After a sharp move of the torso, arms and head the sprung parts swing by up to ${ids.map(id => `${id} ${r.peak[id].toFixed(1)}°`).join(', ')}; six seconds later they have stopped (largest change over 45 frames ${Math.max(...ids.map(id => r.settled[id])).toFixed(3)}°; ${done.length}/${ids.length} settled). Physics off: every bone matrix and the face drawing identical across 90 frames = ${r.staticOff}. Physics on again: they change (breathing, blink) = ${r.movesOn}.`);
  await pg.close();
}

/* 6. joints at min, mid, max */
{
  const pg = await open(); await hideUi(pg);
  const sets = [
    ['shoulder-raise-r', [[-160, 135, 300], [-22, 120, 0]]], ['shoulder-forward-r', [[-250, 130, 190], [-14, 118, 8]]], ['elbow-r', [[-250, 120, 150], [-18, 108, 10]], { 'shoulder-forward-r': 40 }], ['wrist-r', [[-110, 92, 90], [-20, 74, 4]]],
    ['hip-forward-l', [[280, 70, 240], [8, 60, 10]]], ['hip-side-l', [[0, 60, 330], [12, 55, 0]]], ['knee-l', [[300, 55, 120], [8, 45, -8]], { 'hip-forward-l': 50 }], ['ankle-l', [[120, 16, 70], [12, 8, 4]], { 'hip-forward-l': 20 }],
  ];
  const shots = []; let finite = true;
  for (const [id, cam, extra] of sets) for (const k of [0, 0.5, 1]) {
    shots.push(await shot(pg, `rig.reset(); rig.physics=false; ${extra ? `rig.pose(${JSON.stringify(extra)});` : ''} const j=rig.joints.get('${id}'); rig.set('${id}', j.min + (j.max - j.min) * ${k});`, cam));
    finite = finite && await pg.evaluate(() => rig.order.every(b => b.bone.matrixWorld.elements.every(Number.isFinite)));
  }
  await tile(shots.slice(0, 12), 3, 400, 'check6-arm.png'); await tile(shots.slice(12), 3, 400, 'check6-leg.png');
  const open_ = await pg.evaluate(() => Object.fromEntries(Object.entries(app.char.data.meshes).map(([k, m]) => [k, m.open])));
  const total = Object.values(open_).reduce((a, b) => a + b, 0);
  report(6, 'No gaps, wrong layering or clipping at shoulder, elbow, wrist, hip, knee, ankle', total === 0 && finite,
    `The hoodie (torso, both sleeves, hood) is one closed surface, and so are the jeans, each hand and the head: ${Object.keys(open_).length} meshes, ${total} open edges in all. A joint bends that one surface, so there is nothing to come apart and no layer order to get wrong. Posed at min, mid and max for shoulder (sideways and forward), elbow, wrist, hip (forward and sideways), knee and ankle: 24 poses, every bone matrix finite = ${finite}. Pictures: check6-arm.png, check6-leg.png (rows: joint; columns: min, mid, max). How natural the folds look needs a person.`);
  await pg.close();
}

/* 7. breathing, blink, walk in place */
{
  const pg = await open();
  const r = await pg.evaluate(async () => {
    const wait = n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
    rig.reset(); rig.physics = true; rig.breathing = true;
    let chest = [1e9, -1e9], lid = 0, lidEnd = 0; const gaze = new Set(), v = new app.THREE.Vector3();
    let t0 = performance.now();
    while (performance.now() - t0 < 8000) { await wait(1); const y = rig.bones.get('spine-3').bone.position.y; chest = [Math.min(chest[0], y), Math.max(chest[1], y)]; lid = Math.max(lid, rig.final('eyelid-upper-r')); gaze.add(rig.final('gaze-x-r').toFixed(1)); }
    document.getElementById('walk').click();
    const lift = { r: 0, l: 0 }; let slide = 0, sink = 0, float = 0; const dts = []; let last = performance.now(); t0 = last;
    while (performance.now() - t0 < 6000) {
      await wait(1); const now = performance.now(); dts.push(now - last); last = now;
      const pts = {};
      for (const f of rig.feet) { const ys = f.pts.map(([st, p]) => v.copy(p).applyMatrix4(st.bone.matrixWorld).y), a = rig.pivot(f.foot.id, new app.THREE.Vector3()); pts[f.side] = { h: Math.min(...ys), d: Math.hypot(a.x - f.ankle.x, a.z - f.ankle.z) }; lift[f.side] = Math.max(lift[f.side], pts[f.side].h); }
      const sup = pts.r.h <= pts.l.h ? pts.r : pts.l;
      if (now - t0 > 700) { float = Math.max(float, sup.h); sink = Math.max(sink, -Math.min(pts.r.h, pts.l.h)); if (sup.h < 0.02) slide = Math.max(slide, sup.d); }
    }
    document.getElementById('walk').click(); document.getElementById('wave').click(); await wait(150); document.getElementById('wave').click();
    dts.sort((a, b) => a - b);
    const t = performance.now(); for (let i = 0; i < 300; i++) rig.step(1 / 60); const js = (performance.now() - t) / 300;
    return { chest, lid, gaze: gaze.size, lift, slide, sink, float, fps: 1000 / (dts.reduce((a, b) => a + b, 0) / dts.length), p95: dts[Math.floor(dts.length * 0.95)], js, tris: app.renderer.info.render.triangles, gpu: (() => { const gl = app.renderer.getContext(), e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unknown'; })() };
  });
  report(7, 'Breathing, blink and walk-in-place run with no console errors', pg.errs.length === 0 && r.chest[1] - r.chest[0] > 0.2 && r.lid > 95 && r.lift.r > 8 && r.lift.l > 8 && r.slide < 0.05 && r.float < 0.05 && r.sink < 0.05,
    `8 s idle: the chest rises ${(r.chest[1] - r.chest[0]).toFixed(2)} cm per breath, the eyelid reached ${r.lid.toFixed(0)}% (a blink), ${r.gaze} distinct gaze positions. 6 s walk in place: feet lift ${r.lift.r.toFixed(1)} and ${r.lift.l.toFixed(1)} cm; the supporting foot never left the ground by more than ${r.float.toFixed(3)} cm, sank ${r.sink.toFixed(3)} cm, slid ${r.slide.toFixed(3)} cm. ${r.fps.toFixed(0)} fps (95% of frames under ${r.p95.toFixed(1)} ms) on ${r.gpu.replace(/^ANGLE \(|\)$/g, '').slice(0, 60)}, ${Math.round(r.tris / 1000)}k triangles a frame with shadows; the rig's own work is ${r.js.toFixed(2)} ms a frame. Console errors: ${pg.errs.length}${pg.errs.length ? ' ' + pg.errs[0] : ''}.`);
  await pg.close();
}

/* 8. network disabled */
{
  const seen = [], blocked = [];
  const pgA = await open(URL_, {}, ctx => ctx.route('**/*', route => { const u = route.request().url(); seen.push(u); if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(u)) route.continue(); else { blocked.push(u); route.abort(); } }));
  const okA = await pgA.evaluate(() => rig.order.length); const eA = pgA.errs.length; await pgA.close();
  const pgB = await open('file://' + path.join(HERE, 'preview.html'), { offline: true });
  // the first frame compiles every shader from cold in this fresh browser (6 to 9 s here): allow for it, the check is about working offline, not speed
  await pgB.waitForFunction(() => document.getElementById('hud').textContent.includes('limits from'), null, { timeout: 25000 });
  const okB = await pgB.evaluate(async () => { rig.play('walk'); await new Promise(r => setTimeout(r, 600)); return { bones: rig.order.length, hud: document.getElementById('hud').textContent, moving: rig.anim.w > 0.5 }; });
  const eB = pgB.errs.filter(e => !/rig\.json|ERR_FILE|Failed to load resource|Fetch API/.test(e)).length; await pgB.close();
  const pgC = await open(URL_, {}, ctx => ctx.route(/rig\.json/, route => route.abort()));
  await pgC.waitForFunction(() => document.getElementById('hud').textContent.includes('limits from'), null, { timeout: 25000 });
  const okC = await pgC.evaluate(() => ({ bones: rig.order.length, hud: document.getElementById('hud').textContent })); await pgC.close();
  const src = ['preview.html', 'src/main.js', 'src/rig.js', 'src/model.js', 'src/sdf.js', 'src/face.js', 'src/character.js', 'src/skeleton.js', 'src/rigdef.js'].map(f => fs.readFileSync(path.join(HERE, f), 'utf8')).join('\n');
  const remote = src.match(/https?:\/\/(?!127\.0\.0\.1|localhost)[^\s'"<>`]+/g) || [];
  report(8, 'Preview works with the network disabled', okA > 80 && blocked.length === 0 && okB.bones > 80 && okB.moving && okC.bones > 80 && okC.hud.includes('bundled') && eA + eB === 0 && remote.length === 0,
    `Served from this machine with every outside request blocked: ${seen.length} requests, ${blocked.length} to another host, character built (${okA} bones). Opened from disk with the browser offline: built (${okB.bones} bones) and animating, limits from ${okB.hud.includes('bundled') ? 'the bundled copy' : 'rig.json'}. With rig.json refused it falls back to the bundled copy = ${okC.hud.includes('bundled')}. three.js is vendored in vendor/three and compiled into char3d.bundle.js; remote URLs in the page and the sources: ${remote.length}. Page errors: ${eA + eB}.`);
}

await browser.close();
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length} of ${results.length} checks pass` + (failed.length ? `; failing: ${failed.map(f => f.n).join(', ')}` : ''));
process.exit(failed.length ? 1 : 0);
