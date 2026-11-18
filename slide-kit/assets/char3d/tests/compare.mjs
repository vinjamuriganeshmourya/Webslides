// Side-by-side renders against the reference image, and the limb-thickness check for the wave.
//   node tests/compare.mjs [outDir]         (serve the folder first: python3 -m http.server 8792 --bind 127.0.0.1)
// Writes compare-full.png, compare-face.png, compare-wave.png, compare-face-views.png (front, three-quarter),
// compare-hair-views.png (front, side, back) and thickness.json.
import { chromium } from '../../../../deck-engine/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const HERE = path.resolve(import.meta.dirname, '..');
const OUT = process.argv[2] || path.join(os.tmpdir(), 'char3d-compare');
// CAST=sporty|varsity compares another character with his own picture (framed the same way: soles on SOLE, centre on CX)
const CAST = process.env.CAST || 'mustard';
const REFS = { mustard: ['../../../assets/illustrations/Mustard Hoodie Boy in 3D Style.png', 1397, 531], sporty: ['Sporty 3D Boy Character Render.png', 1398, 535], varsity: ['Stylized Boy with Side-Swept Hair.png', 1412, 536] };
const REF = process.env.REF || path.resolve(HERE, REFS[CAST][0]);
const SOLE = +(process.env.SOLE || REFS[CAST][1]), CX = +(process.env.CX || REFS[CAST][2]);
const URL_ = (process.env.URL || 'http://127.0.0.1:8792/preview.html') + (CAST === 'mustard' ? '' : '?c=' + CAST);
fs.mkdirSync(OUT, { recursive: true });
const RW = 1086, RH = 1448;                       // the reference's own size: the model is rendered at exactly this framing

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/brave-browser', args: ['--use-gl=angle', '--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist'] });
const pg = await browser.newPage({ viewport: { width: RW + 410, height: RH } });
const errs = []; pg.on('console', m => m.type() === 'error' && errs.push(m.text())); pg.on('pageerror', e => errs.push(String(e)));
await pg.goto(URL_); await pg.waitForFunction('window.__ready === true', null, { timeout: 30000 });
const frames = n => pg.evaluate(n => new Promise(r => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);

// reference framing: 8.18 px per cm, soles on row 1397, figure centred 12 px left of the image centre
await pg.evaluate(({ RH, SOLE, CX }) => {
  for (const id of ['hud', 'views', 'tip']) document.getElementById(id).style.display = 'none';
  app.paused = true; app.scene.background.set('#ffffff');
  // The reference's viewpoint: from chest height, five metres away (its shoes are seen from above, its chin from just below).
  const pxPerCm = 1350 / 165, cy = (SOLE - RH / 2) / pxPerCm, cx = (543 - CX) / pxPerCm, eye = [cx, 100, 500], dist = Math.hypot(eye[1] - cy, eye[2]);
  app.camera.fov = 2 * Math.atan(RH / pxPerCm / 2 / dist) * 180 / Math.PI; app.camera.updateProjectionMatrix(); app.camera.position.set(...eye); app.controls.target.set(cx, cy, 0); app.controls.update();
  window.pose = name => {
    rig.reset(); rig.physics = true; rig.breathing = false;
    if (name === 'wave') { rig.play('wave'); while (rig.anim.t < 0.15625 + 2 / 1.6 - 1e-6) rig.step(Math.min(1 / 120, 0.15625 + 2 / 1.6 - rig.anim.t)); }   // peak of the second swing, fully blended in
    else for (let i = 0; i < 90; i++) rig.step(1 / 60);
    for (const j of ['eyelid-upper-r', 'eyelid-upper-l']) if (rig.final(j) > 1) { rig.blink.t = -1; rig.blink.v = 0; rig.blink.next = 9; rig.step(0); }
  };
}, { RH, SOLE, CX });
const shoot = async name => { await pg.evaluate(n => window.pose(n), name); await frames(3); return pg.locator('#stage canvas').screenshot(); };
const idle = await shoot('idle'), wave = await shoot('wave');
fs.writeFileSync(path.join(OUT, 'result-idle.png'), idle); fs.writeFileSync(path.join(OUT, 'result-wave.png'), wave);

/* thickness of arm, hand and fingers through the whole wave, against the idle pose.
   Each limb is cut into slices in the idle pose; the same vertices are then measured every frame. */
const thickness = await pg.evaluate(() => {
  const T = app.THREE, bones = app.char.skeleton.bones, bi = n => bones.findIndex(b => b.name === n), v = new T.Vector3(), w = new T.Vector3();
  const weightOf = (mesh, names) => { const si = mesh.geometry.attributes.skinIndex, sw = mesh.geometry.attributes.skinWeight, set = new Set(names.map(bi)), out = new Float32Array(si.count); for (let i = 0; i < si.count; i++) for (let k = 0; k < 4; k++) if (set.has(si.getComponent(i, k))) out[i] += sw.getComponent(i, k); return out; };
  const family = base => bones.filter(b => b.name === base || b.name.startsWith(base + '-t')).map(b => b.name);
  const H = app.char.meshes.jacket || app.char.meshes.hoodie, hand = app.char.meshes['hand-r'];
  const settle = () => { rig.reset(); rig.physics = true; rig.breathing = false; for (let i = 0; i < 60; i++) rig.step(1 / 60); };
  settle();
  // limb slices: vertices that mostly follow the limb, binned by where they sit along it
  const limbs = {};
  for (const [name, mesh, base, a, b, extra] of [['upper arm', H, 'upper-arm-r', 'upper-arm-r', 'forearm-r', []], ['forearm', H, 'forearm-r', 'forearm-r', 'hand-r', ['cuff-r']], ['wrist', hand, 'forearm-r', 'forearm-r', 'hand-r', []]]) {
    const wt = weightOf(mesh, [...family(base), ...extra]), A = rig.pivot(a), B = rig.pivot(b), ax = B.clone().sub(A), L = ax.length(); ax.normalize();
    const N = name === 'wrist' ? 2 : 6, lo = name === 'wrist' ? 0.72 : 0.14, hi = name === 'wrist' ? 0.98 : 0.94, slices = Array.from({ length: N }, () => []);
    for (let i = 0; i < wt.length; i++) { if (wt[i] < 0.55) continue; mesh.getVertexPosition(i, v); const t = w.copy(v).sub(A).dot(ax) / L; if (t < lo || t >= hi) continue; slices[Math.floor((t - lo) / (hi - lo) * N)].push(i); }
    limbs[name] = { mesh, a, b, slices };
  }
  const fingers = ['index', 'middle', 'ring', 'pinky'].flatMap(f => ['prox', 'mid', 'dist'].map(s => `finger-${f}-${s}-r`)).concat(['thumb-prox-r', 'thumb-dist-r']);
  const sets = Object.fromEntries(fingers.map(n => { const wt = weightOf(hand, [n]); return [n, [...wt.keys()].filter(i => wt[i] >= 0.8)]; }));
  const pw = weightOf(hand, ['hand-r']), palm = [...pw.keys()].filter(i => pw[i] >= 0.8);
  const measure = () => {
    const out = {};
    for (const [k, { mesh, a, b, slices }] of Object.entries(limbs)) {            // mean distance from the bone, slice by slice
      const A = rig.pivot(a), ax = rig.pivot(b).sub(A).normalize();
      out[k] = slices.map(idx => { let s = 0; for (const i of idx) { mesh.getVertexPosition(i, v); w.copy(v).sub(A); s += w.addScaledVector(ax, -w.dot(ax)).length(); } return idx.length > 8 ? s / idx.length : null; });
    }
    const local = (idx, bone) => { const inv = bones[bi(bone)].matrixWorld.clone().invert(); return idx.map(i => hand.getVertexPosition(i, new T.Vector3()).applyMatrix4(inv)); };
    const P = local(palm, 'hand-r'), ext = k => Math.max(...P.map(p => p[k])) - Math.min(...P.map(p => p[k]));
    out.palm = [ext('x'), ext('z')];                                               // width and thickness
    for (const n of fingers) { const q = local(sets[n], n); out[n] = [q.length > 8 ? q.reduce((s, p) => s + Math.hypot(p.x, p.z), 0) / q.length : null]; }
    return out;
  };
  const idle = measure(), worst = {}, at = {};
  rig.play('wave'); for (let i = 0; i < 60; i++) rig.step(1 / 120);              // blend fully in
  let frames = 0;
  for (; frames < 150; frames++) {                                               // two full swings, every frame at 120 per second
    rig.step(1 / 120); const m = measure();
    for (const k of Object.keys(m)) m[k].forEach((x, i) => { if (x == null || idle[k][i] == null) return; const r = x / idle[k][i], id = k + (m[k].length > 1 ? ' ' + (i + 1) : ''); if (worst[id] === undefined || r < worst[id]) { worst[id] = r; at[id] = +rig.anim.t.toFixed(3); } });
  }
  rig.reset();
  const group = p => { const e = Object.entries(worst).filter(([k]) => k.startsWith(p)).sort((a, b) => a[1] - b[1]); return { thinnest: e[0][1], where: e[0][0], at: at[e[0][0]], all: Object.fromEntries(e.map(([k, x]) => [k, +x.toFixed(3)])) }; };
  const r2 = a => a.map(x => (x == null ? null : +x.toFixed(2)));
  return { idle: { 'upper arm radius cm, shoulder to elbow': r2(idle['upper arm']), 'forearm radius cm, elbow to cuff': r2(idle.forearm), 'wrist radius cm': r2(idle.wrist), 'palm width, thickness cm': r2(idle.palm), 'finger radius cm': Object.fromEntries(fingers.map(n => [n, r2(idle[n])[0]])) },
    wave: { 'upper arm': group('upper arm'), forearm: group('forearm'), wrist: group('wrist'), palm: group('palm'), fingers: group('finger'), thumb: group('thumb') }, frames };
});
fs.writeFileSync(path.join(OUT, 'thickness.json'), JSON.stringify(thickness, null, 1));
console.log('thickness through the wave, as a share of the idle pose (1.00 = unchanged):');
for (const [k, g] of Object.entries(thickness.wave)) console.log(`  ${k.padEnd(10)} thinnest ${g.thinnest.toFixed(3)}  (${g.where}, t = ${g.at} s)`);

/* side by side with the reference */
const ref = fs.readFileSync(REF).toString('base64'), b64 = b => b.toString('base64');
const compose = async (file, mine, box, scale, label) => {
  const w = Math.round(box[2] * scale), h = Math.round(box[3] * scale), p2 = await browser.newPage({ viewport: { width: w * 2 + 12, height: h + 34 } });
  await p2.setContent(`<body style="margin:0;background:#fff;font:14px system-ui"><canvas id="c" width="${w * 2 + 12}" height="${h + 34}"></canvas></body>`);
  await p2.evaluate(async ({ ref, mine, box, w, h, label }) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
    const [a, b] = await Promise.all([load(ref), load(mine)]), c = document.getElementById('c').getContext('2d');
    c.fillStyle = '#fff'; c.fillRect(0, 0, w * 2 + 12, h + 34); c.imageSmoothingQuality = 'high';
    c.drawImage(a, box[0], box[1], box[2], box[3], 0, 34, w, h); c.drawImage(b, box[0], box[1], box[2], box[3], w + 12, 34, w, h);
    c.fillStyle = '#1f2540'; c.font = '600 15px system-ui'; c.fillText('Reference', 10, 22); c.fillText(label, w + 22, 22);
  }, { ref, mine, box, w, h, label });
  await p2.locator('#c').screenshot({ path: path.join(OUT, file) }); await p2.close();
};
await compose('compare-full.png', b64(idle), [120, 0, 840, RH], 0.62, 'Result: 3D model, idle');
await compose('compare-face.png', b64(idle), [400, 0, 280, 300], 2.6, 'Result: 3D model, face');
await compose('compare-wave.png', b64(wave), [120, 0, 840, RH], 0.62, 'Result: 3D model, wave at its peak');
if (process.env.CROPS) for (const [n, bx, sc] of JSON.parse(process.env.CROPS)) await compose(`compare-${n}.png`, b64(n.startsWith('wave') ? wave : idle), bx, sc, 'Result: ' + n);
/* the face from the front and three-quarter, the hair from front, side and back, each beside the reference (which shows the front only) */
const turn = async (yaw, target, heightCm, w, h) => {
  await pg.setViewportSize({ width: w + 410, height: h });
  await pg.evaluate(({ yaw, target, heightCm }) => {
    window.pose('idle');
    const a = yaw * Math.PI / 180, d = 500;
    app.camera.fov = 2 * Math.atan(heightCm / 2 / d) * 180 / Math.PI; app.camera.updateProjectionMatrix();
    app.camera.position.set(target[0] + Math.sin(a) * d, target[1], target[2] + Math.cos(a) * d); app.controls.target.set(...target); app.controls.update();
  }, { yaw, target, heightCm });
  await frames(4);
  return b64(await pg.locator('#stage canvas').screenshot());
};
const strip = async (file, w, h, refBox, shots) => {
  const n = shots.length + 1, W = n * w + (n - 1) * 12, p2 = await browser.newPage({ viewport: { width: W, height: h + 34 } });
  await p2.setContent(`<body style="margin:0;background:#fff"><canvas id="c" width="${W}" height="${h + 34}"></canvas></body>`);
  await p2.evaluate(async ({ ref, shots, refBox, w, h, W }) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
    const c = document.getElementById('c').getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, W, h + 34); c.imageSmoothingQuality = 'high';
    c.fillStyle = '#1f2540'; c.font = '600 15px system-ui';
    c.drawImage(await load(ref), ...refBox, 0, 34, w, h); c.fillText('Reference (front)', 10, 22);
    for (let i = 0; i < shots.length; i++) { c.drawImage(await load(shots[i][1]), (i + 1) * (w + 12), 34, w, h); c.fillText(shots[i][0], (i + 1) * (w + 12) + 10, 22); }
  }, { ref, shots, refBox, w, h, W });
  await p2.locator('#c').screenshot({ path: path.join(OUT, file) }); await p2.close();
};
// face: a 24.4 cm square round the eyes and mouth. The drawing sits 0.85 cm lower on the head than in the picture (the picture's camera looks up at it).
const faceAt = [0, 145.4, 0], hairAt = [0, 154.6, 0];
await strip('compare-face-views.png', 620, 620, [429, 100, 200, 200], [['Result: front', await turn(0, faceAt, 24.45, 620, 620)], ['Result: three-quarter', await turn(38, faceAt, 24.45, 620, 620)]]);
await strip('compare-hair-views.png', 520, 500, [399, 0, 260, 250], [['Result: front', await turn(0, hairAt, 30.57, 520, 500)], ['Result: side', await turn(90, hairAt, 30.57, 520, 500)], ['Result: back', await turn(180, hairAt, 30.57, 520, 500)]]);
console.log('written to', OUT, '| page errors:', errs.length ? errs.slice(0, 4) : 'none');
await browser.close();
