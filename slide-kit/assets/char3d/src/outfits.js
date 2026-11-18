// The other characters' clothes (cast.js). The first character's are in body.js, untouched.
//
//   sporty    an open colour-block puffer jacket (navy shoulders and sleeves, a cream band across chest
//             and arms, orange lower front, orange hood lining and zip facing) over a cream hoodie;
//             olive cargo joggers with ribbed ankle cuffs; white court sneakers with orange soles
//   varsity   an open maroon varsity jacket with cream sleeves, striped rib cuffs and hem, snaps, welt
//             pockets and a "B" patch, over a cream hoodie whose hood lies over the jacket; baggy blue
//             cargo jeans; maroon and white high-tops
// Both wear a watch on the left wrist.
//
// Sizes are measured on each picture (see cast.js for the conversion). Every garment is one continuous
// skinned surface built the same way as the first character's: blended shapes, meshed, weights from
// the shapes. Colour blocks are painted per vertex by each garment's surface function (o.col).
import { V, sphere, cone, ellipsoid, rbox, ring, loft, curve, polygon2, patch, bounded, chain } from './sdf.js';
import { SIDES, landmarks, limbNodes, STRING_Y } from './skeleton.js';
import { BODY, hand, plainSurface } from './body.js';
import { castHead, castLocks, castHair, castHairSurface } from './hair2.js';
import { cast, castName } from './cast.js';

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], IDENT = [X, Y, Z];
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const FAR = 99, TAU = Math.PI * 2;
const shift = (knots, dy, dv = 0) => knots.map(([y, v]) => [y + dy, v + dv]);
const ARM = 41.3;                                        // shoulder to wrist, as the first character's sleeve

/* ================= per-character measurements ================= */
const FIT = {
  sporty: {
    // jacket body: half width, front and back depth against height (hem band 81.6-85.4, chest to 133)
    jacket: {
      y0: 81.6, y1: 133.0, z0: 0.2, n: 2.7, puff: 0.42, hemTop: 85.4,
      a: [[81.6, 12.9], [82.6, 13.4], [85.4, 13.6], [86.2, 14.7], [90, 15.1], [100, 15.2], [110, 15.0], [116, 14.2], [121, 13.0], [124.5, 12.0], [127.4, 11.1], [129.8, 9.6], [131.6, 7.0], [132.6, 4.0], [133.0, 0.5]],
      f: [[81.6, 8.4], [85.4, 9.2], [86.2, 10.0], [92, 10.4], [104, 10.3], [112, 10.0], [118, 9.4], [122, 8.5], [126, 7.5], [129.5, 6.2], [131.6, 4.4], [133.0, 2.0]],
      b: [[81.6, 8.4], [85.4, 9.0], [86.2, 9.8], [95, 9.9], [108, 10.0], [116, 9.6], [122, 8.7], [125, 8.1], [129.5, 6.8], [131.6, 4.8], [133.0, 2.2]],
      // the quilting: channel lines (the colour blocks change on two of them)
      lines: [85.4, 90.6, 95.6, 100.4, 108.0, 115.7, 121.0, 126.0],
      gap: 5.5,                                          // half width of the open front
      sleeve: { sh: 4.0, el: 4.4, fa: 4.35, gather: [4.5, 2.8, 4.5], cuff: [3.25, 3.05], cuffLen: 5.2, rings: [6.5, 11.5, 16.5, 21.3, 27.0, 32.0] },
    },
    hood: {                                              // the jacket's hood: a thick funnel round the neck, lined in orange, and the hood on the back
      a: [[126.5, 11.8], [129, 12.4], [131.5, 13.2], [134, 13.8], [136.5, 14.0], [137.8, 13.6]],
      f: [[126.5, 8.4], [130, 9.2], [134, 9.6], [137.8, 9.4]],
      b: [[126.5, 11.0], [131, 11.6], [134, 11.4], [137.8, 10.8]],
      v: [[126.0, 5.4], [128, 6.6], [130, 8.6], [132, 10.8], [134.5, 12.6], [138, 13.6]],
      z0: -0.6, n: 2.2, top: 136.4, thick: 2.0, y0: 126.6, back: [[0, 129.8, -10.8], [11.8, 8.6, 4.4]],
    },
    hoodie: { y0: 87.2, hemTop: 91.4, collar: 'first', strings: { x: 3.4, ys: [128.4, 125.0, 122.6], tip: [122.6, 120.0], color: 'cord', tipColor: 'copper', r: 0.36 } },
    pants: {
      material: 'twill', color: 'olive', deep: 'olive-deep',
      pelvis: { y0: 77.5, y1: 89.5, a: [[77.5, 12.4], [79.5, 12.9], [83, 12.8], [86.6, 12.3], [89.5, 11.7]], f: [[77.5, 6.4], [80, 7.2], [83, 7.7], [86, 7.8], [89.5, 7.4]], b: [[77.5, 6.8], [80, 7.6], [83, 8.0], [86, 8.0], [89.5, 7.6]] },
      leg: [[0, 7.1], [12, 6.8], [24, 6.4], [37, 6.0], [48, 5.5], [54, 5.4], [57.5, 5.2], [59.6, 4.4]],
      cuff: [59.4, 63.6, 3.75],                        // ribbed ankle cuff: from, to, radius
      folds: [[50.5, 5.35, 0.42], [55.0, 5.25, 0.4], [58.2, 4.95, 0.34]],
      pocket: { t: 17.0, half: 8.4, around: 3.0, flap: 2.6 },
    },
    shoes: { high: false, sole: 'shoe-sole', mid: 'shoe-white', upper: 'shoe-white', trim: 'shoe-orange', line: 'shoe-navy', lace: 'lace' },
    ankles: true,
  },
  varsity: {
    jacket: {
      y0: 85.2, y1: 132.6, z0: 0.2, n: 2.8, puff: 0, hemTop: 88.85,
      a: [[85.2, 13.3], [86.0, 13.8], [88.85, 14.0], [89.6, 14.6], [95, 14.9], [105, 15.0], [115, 14.4], [121, 13.1], [124.5, 12.1], [127.4, 11.1], [129.8, 9.6], [131.4, 7.0], [132.3, 4.0], [132.6, 0.5]],
      f: [[85.2, 8.6], [88.85, 9.3], [89.6, 9.7], [100, 9.8], [112, 9.5], [118, 9.0], [122, 8.2], [126, 7.2], [129.5, 5.9], [131.4, 4.2], [132.6, 2.0]],
      b: [[85.2, 8.6], [88.85, 9.1], [89.6, 9.5], [100, 9.7], [112, 9.6], [118, 9.2], [122, 8.5], [125, 7.9], [129.5, 6.6], [131.4, 4.6], [132.6, 2.2]],
      lines: [], gap: 3.6,
      sleeve: { sh: 4.0, el: 4.4, fa: 4.3, gather: [4.4, 2.7, 4.4], cuff: [3.3, 3.1], cuffLen: 5.6, rings: [] },
      snaps: { x: 4.7, ys: [110.2, 101.7, 93.1, 88.0, 86.0] },
      welts: [[-10.4, 104.6], [-12.9, 94.4]],           // slanted welt pocket, top and bottom of its opening (right side; mirrored)
      patch: { x0: 8.4, y0: 114.5, w: 5.5, h: 8.6 },
    },
    hoodie: {
      y0: 84.6, hemTop: 89.0, collar: 'big',
      strings: { x: 4.3, ys: [129.6, 123.5, 117.6, 112.6], tip: [112.6, 110.6], color: 'cord', tipColor: 'steel', r: 0.34 },
      big: {                                             // the hood worn over the jacket: wider and higher than the first character's collar
        a: [[126.5, 14.8], [129, 14.2], [131, 13.2], [133, 11.6], [135, 9.6], [137, 8.2], [138.8, 7.4]],
        f: [[126.5, 9.0], [129, 9.7], [131, 9.4], [133, 8.4], [135, 7.2], [137, 6.6], [138.8, 6.3]],
        b: [[126.5, 12.2], [130, 11.2], [133, 9.8], [138.8, 8.6]],
        v: [[127.6, 0], [128.6, 1.0], [130.0, 2.6], [131.6, 3.9], [133.6, 5.0], [135.6, 5.8], [139, 6.4]],
        z0: -0.6, n: 2.2, top: 138.4, thick: 2.5, y0: 126.6, back: [[0, 130.8, -11.8], [13.0, 9.4, 5.0]],
      },
    },
    pants: {
      material: 'denim', color: 'jeans', deep: 'jeans-deep',
      pelvis: { y0: 77.5, y1: 89.5, a: [[77.5, 12.8], [79.5, 13.4], [83, 13.3], [86.6, 12.8], [89.5, 12.2]], f: [[77.5, 6.8], [80, 7.6], [83, 8.0], [86, 8.0], [89.5, 7.6]], b: [[77.5, 7.2], [80, 8.0], [83, 8.4], [86, 8.3], [89.5, 7.8]] },
      leg: [[0, 7.7], [12, 7.6], [24, 7.4], [37, 7.3], [50, 7.3], [60, 7.5], [66, 7.8], [70.6, 7.9]],
      hem: 70.2,
      folds: [[60.5, 7.4, 0.36], [65.2, 7.7, 0.34]],
      pocket: { t: 20.2, half: 9.4, around: 3.2, flap: 2.8 },
    },
    shoes: { high: true, sole: 'shoe-maroon', mid: 'shoe-sole', upper: 'shoe-white', trim: 'shoe-maroon', line: 'shoe-maroon', lace: 'lace' },
    ankles: false,
  },
};
const fit = () => FIT[cast().outfit || castName()];

/* ================= helpers ================= */
// a loft with its profile drawn from three knot lists
function profile(J) {
  const a = curve(J.a), f = curve(J.f), b = curve(J.b);
  return { a, f, b, prof: (y, o) => { o[0] = a(y); o[1] = f(y); o[2] = b(y); o[3] = J.z0 ?? 0.2; o[4] = J.n ?? 2.5; } };
}
// the front surface of a lofted body at (x, y)
const frontZ = (P, J, x, y) => (J.z0 ?? 0.2) + P.f(y) * Math.pow(Math.max(0, 1 - Math.pow(Math.min(1, Math.abs(x) / P.a(y)), J.n ?? 2.5)), 1 / (J.n ?? 2.5));
// puffer channels: 0 on a stitched line, 1 in the middle of a channel
function channels(lines) {
  return y => { if (!lines.length || y < lines[0] || y > 130) return 0; let i = 0; while (i < lines.length - 1 && y > lines[i + 1]) i++; const a = lines[i], b = lines[i + 1] ?? 130, s = Math.sin(Math.PI * Math.max(0, Math.min(1, (y - a) / (b - a)))); return s * s * (2 - s); };
}
// a funnel of thick cloth round the neck, open in a V at the front (the first character's collar, sized)
function funnel(C) {
  const a = curve(C.a), f = curve(C.f), b = curve(C.b), v = curve(C.v), NL = BODY.NECKLINE;
  const lo = loft([0, 0, 0], IDENT, C.y0 - 0.6, C.top + 2.5, (y, o) => { o[0] = a(y); o[1] = f(y); o[2] = b(y); o[3] = C.z0; o[4] = C.n; }, {});
  const edge = (x, y, z) => Math.max(y - (C.top - 0.35 * sstep(0, -6, z)), z > C.z0 ? (v(y) - Math.abs(x)) * 0.82 : -9);
  const sd = (x, y, z) => { const e = edge(x, y, z), d = Math.abs(lo.sd(x, y, z) + 1.7 * (1 - sstep(C.y0 - 0.3, C.y0 + 2.1, y - NL * Math.abs(x)))); return (e > 0 ? Math.hypot(e, d) : d) - C.thick / 2; };
  return { sd, edge, lo, lo3: [-a(C.y0) - 2, C.y0 - 1, -b(C.y0) - 2], hi3: [a(C.y0) + 2, C.top + 1.2, f(C.y0) + 2] };
}
const hoodBone = (x, y, z, add) => { const h = 0.85 * sstep(-1, -6, z); add('hood', h); add('spine-3', 1 - h); };
// position along an arm (from the shoulder) and distance from its axis
function armAt(x, y, z) {
  const s = x < 0 ? -1 : 1, L = landmarks(s), { d, Sh } = L;
  const rx = x - Sh[0], ry = y - Sh[1], rz = z - Sh[2], t = rx * d[0] + ry * d[1] + rz * d[2];
  return { s, L, t, rr: Math.hypot(rx - d[0] * t, ry - d[1] * t, rz - d[2] * t), ph: Math.atan2(rx * L.N[0] + ry * L.N[1] + rz * L.N[2], rz) };
}
const ribPhase = (x, z) => Math.atan2(z, x);

/* ================= the jacket ================= */
function jacketParts(lin, F) {
  const J = F.jacket, P = profile(J), puff = channels(J.lines), p = [], name = castName();
  const base = lin(name === 'sporty' ? 'navy' : 'maroon');
  const o = (bone, k, sigma, extra) => ({ bone, k, sigma, color: base, ...extra });
  const spine = chain([0, 0, 0], Y, [[J.y0 + 1.2, 'hem'], [J.y0 + 5, 'spine-1'], [99.5, 'spine-1'], [107.5, 'spine-2'], [111.5, 'spine-2'], [119.5, 'spine-3']]);
  const prof = (y, q) => { P.prof(y, q); const b = J.puff * puff(y); q[0] += b; q[1] += b; q[2] += b * 0.8; };
  const torso = loft([0, 0, 0], IDENT, J.y0, J.y1, prof, o(spine, 0, 2.6));
  p.push(torso);
  for (const [n, s] of SIDES) {
    const L = landmarks(s), { d, Sh, El, Wr } = L, along = t => V.add(Wr, V.mul(d, t)), arm = chain(Sh, d, limbNodes(n).arm), S = J.sleeve;
    p.push(cone([s * 5.4, 126.6, -0.4], Sh, 3.3, 3.6, o(`clavicle-${n}`, 1.6, 1.8)));
    p.push(sphere(Sh, S.sh, o(arm, 1.2, 1.7)));
    p.push(cone(Sh, El, S.sh + 0.1, S.el, o(arm, 1.6, 1.5)));
    p.push(cone(El, along(-7.5), S.el, S.fa, o(arm, 0, 1.4)));
    p.push(ellipsoid(along(-S.cuffLen - 1.4), S.gather, [L.N, d, Z], o(arm, 1.6, 1.3)));                  // the sleeve gathers over the cuff
    p.push(cone(along(-S.cuffLen - 0.1), along(-0.25), S.cuff[0], S.cuff[1], o(`cuff-${n}`, 0.35, 0.8)));
    p.push(rbox(along(5.75), [6, 6, 6], 0, [d, Z, V.cross(d, Z)], { op: 'sub', k: 0.4 }));
    for (let i = 0; i < S.rings.length - 1; i++) {                                                     // the quilting: a soft pad between each two seams round the sleeve
      const t = (S.rings[i] + S.rings[i + 1]) / 2, h = (S.rings[i + 1] - S.rings[i]) / 2, r = t < 21 ? S.sh + 0.1 + (S.el - S.sh - 0.1) * t / 21 : S.el + (S.fa - S.el) * (t - 21) / 13;
      p.push(ring(V.add(Sh, V.mul(d, t)), [L.N, d, Z], r - 0.55, r - 0.55, 0.9, h / 0.9 * 0.82, o(arm, 1.4, 1.4)));
    }
    for (const [t, depth, lean] of [[19.4, 0.9, 0.7], [22.6, 0.8, -0.6]]) {
      const q = V.add(Sh, V.mul(d, t)), a = V.at(q, Z, S.el + 0.6, L.N, 2.6, d, lean), b = V.at(q, Z, S.el + 0.6, L.N, -2.6, d, -lean);
      p.push(cone(a, b, depth, depth, { op: 'sub', k: 2.6 }));
    }
  }
  p.push(cone([0, 124, 0.3], [0, 141, 0.7], 5.1, 5.1, { op: 'sub', k: 0.8 }));                          // room for the neck and the hoodie's collar
  // the open front: everything in front of the hoodie, between the two front edges
  const zc = y => frontZ(BODY_T, BODY.T, 0, Math.min(131, Math.max(BODY.T.y0, y))) - 3.2;
  p.push({ op: 'sub', k: 0.7, lo: [-J.gap - 2, J.y0 - 3, 0], hi: [J.gap + 2, 140, 20], sd: (x, y, z) => { const ux = Math.abs(x) - J.gap, uz = zc(y) - z; return Math.hypot(Math.max(ux, 0), Math.max(uz, 0)) + Math.min(Math.max(ux, uz), 0) - 0.5; } });
  if (F.hood) {
    const H = funnel(F.hood), th = F.hood.thick / 2;
    p.push({ op: 'sub', k: 0.6, lo: H.lo3, hi: H.hi3, sd: (x, y, z) => Math.max(H.lo.sd(x, y, z) + th + 0.15, F.hood.y0 + 0.4 - y) });
    p.push({ op: 'add', k: 0.8, sigma: 1.6, csig: 0.3, color: base, sd: H.sd, lo: H.lo3, hi: H.hi3, bone: hoodBone });
    p.push(ellipsoid(F.hood.back[0], F.hood.back[1], undefined, o('hood', 2.0, 1.8)));
  }
  if (J.patch) {                                                                                         // the "B": a raised chenille patch on the left chest
    const B = J.patch, sdB = letterB(B);
    p.push(bounded(patch(torso, 0.32, sdB, IDENT, [0, 0, 0], 0.12, { bone: 'spine-3', k: 0.25, sigma: 2, color: lin('cream'), csig: 0.12 }), [B.x0 - 1, B.y0 - 1, 2], [B.x0 + B.w + 1, B.y0 + B.h + 1, 14]));
  }
  if (name === 'sporty') {                                                                               // a small mountain badge on the left chest
    p.push(bounded(patch(torso, 0.2, BADGE, IDENT, [0, 0, 0], 0.08, { bone: 'spine-3', k: 0.15, sigma: 2, color: lin('orange'), csig: 0.08 }), [6.5, 117, 2], [12.5, 122, 14]));
  }
  return { prims: p, torso, P, puff };
}
let BODY_T = null;                                       // the first character's torso profile: the hoodie under every jacket keeps that shape

// the collegiate "B": stem and two bowls, square counters (centimetres on the chest, read from the front)
function letterB(B) {
  const k = [B.w / 5.5, B.h / 8.6], P = pts => pts.map(([x, y]) => [B.x0 + x * k[0], B.y0 + y * k[1]]);
  const outer = polygon2(P([[0, 0], [3.9, 0], [4.9, 0.45], [5.5, 1.4], [5.5, 3.1], [5.0, 3.9], [4.45, 4.3], [4.95, 4.75], [5.3, 5.6], [5.3, 7.15], [4.75, 8.1], [3.7, 8.6], [0, 8.6]]));
  const c1 = polygon2(P([[1.75, 5.2], [3.15, 5.2], [3.5, 5.6], [3.5, 6.75], [3.15, 7.1], [1.75, 7.1]])), c2 = polygon2(P([[1.75, 1.5], [3.35, 1.5], [3.75, 1.95], [3.75, 3.05], [3.35, 3.5], [1.75, 3.5]]));
  return (x, y) => Math.max(outer(x, y), -c1(x, y), -c2(x, y));
}

// colour blocks: `col` gives the colour at a point, `edges` the signed distances to the lines where it changes.
// The nearest edge and the colour across it go to the vertex, so the shader draws the edge crisp (FAB_BLOCKS).
const linHex = k => { const h = cast().palette[k], n = parseInt(h.slice(1), 16), c = v => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return [c((n >> 16) / 255), c(((n >> 8) & 255) / 255), c((n & 255) / 255)]; };
function paint(o, x, y, z, nx, ny, nz, col, edges) {
  const c = col(x, y, z, nx, ny, nz);
  let best = FAR, e = null;
  for (const f of edges) { const d = f(x, y, z); if (Math.abs(d) < Math.abs(best)) { best = d; e = f; } }
  o.col = c;
  if (!e) return;
  if (Math.abs(best) > 1.2) { o.col2 = c; o.blk = best < 0 ? -9 : 9; return; }       // far from the edge, but on its own side of it
  const h = 0.04, g = [(e(x + h, y, z) - e(x - h, y, z)) / (2 * h), (e(x, y + h, z) - e(x, y - h, z)) / (2 * h), (e(x, y, z + h) - e(x, y, z - h)) / (2 * h)], gl = Math.hypot(...g);
  if (gl < 1e-3) return;
  const k = (best + Math.sign(best || 1) * 0.08) / gl / gl, c2 = col(x - g[0] * k, y - g[1] * k, z - g[2] * k, nx, ny, nz);
  if (c2 === c) { o.col2 = c; o.blk = best < 0 ? -9 : 9; return; }
  if (best >= 0) { o.col = c; o.col2 = c2; } else { o.col = c2; o.col2 = c; }
  o.blk = best / gl;
}

function jacketSurface(F, built) {
  const J = F.jacket, sporty = castName() === 'sporty', S = J.sleeve;
  const H = F.hood ? funnel(F.hood) : null, sdB = J.patch ? letterB(J.patch) : null, badge = sporty ? BADGE : null;
  const C = sporty ? { navy: linHex('navy'), cream: linHex('cream'), orange: linHex('orange'), rib: linHex('rib'), zip: linHex('navy-deep') } : { maroon: linHex('maroon'), cream: linHex('cream'), deep: linHex('maroon-deep') };
  const CUFF0 = ARM - S.cuffLen, STRIPES = [0.22, 0.36, 0.5, 0.64], striped = (u, a, b) => { const t = (u - a) / (b - a); return (t > 0.22 && t < 0.36) || (t > 0.5 && t < 0.64); };
  const hb = F.hood && F.hood.back;
  const where = (x, y, z) => {
    const A = armAt(x, y, z), sleeve = A.t > 2.8 && A.rr < 8.5 && y < 127.5;
    const onBack = hb && Math.hypot(x / hb[1][0], (y - hb[0][1]) / hb[1][1], (z - hb[0][2]) / hb[1][2]) < 1.25;
    const hood = !sleeve && H && y > 125.4 && (Math.abs(H.sd(x, y, z)) < 0.6 || onBack);
    return { A, sleeve, hood };
  };
  const col = (x, y, z, nx, ny, nz) => {
    const { A, sleeve, hood } = where(x, y, z), ax = Math.abs(x);
    if (sleeve) {
      if (A.t > CUFF0) return sporty ? C.rib : striped(A.t, CUFF0, ARM) ? C.cream : C.maroon;
      return sporty ? (A.t > 11.5 && A.t < 21.3 ? C.cream : C.navy) : C.cream;
    }
    if (hood) return x * nx + (z + 0.5) * nz < -0.05 ? C.orange : C.navy;              // the lining faces the neck
    const hem = y < J.hemTop;
    if (sporty) {
      if (z > 1 && ax < J.gap + 0.42) return C.zip;
      if (hem) return C.rib;
      if (z > 1 && ax < J.gap + 1.5) return C.orange;
      if (badge && z > 2 && badge(x, y) < 0) return C.orange;
      return y > 115.7 ? C.navy : y > 100.4 ? C.cream : z > -2.5 ? C.orange : C.navy;
    }
    if (hem) return striped(y, J.y0, J.hemTop) ? C.cream : C.maroon;
    if (z > 2 && weltDist(J, x, y) < 0.62) return C.cream;
    if (sdB && z > 2) { const d = sdB(x, y); if (d < 0) return d < -0.32 && d > -0.62 ? C.deep : C.cream; }
    return C.maroon;
  };
  // the edges: each returns its signed distance, or FAR where it does not apply
  const arm = (f) => (x, y, z) => { const A = armAt(x, y, z); return A.rr < 8.5 && y < 127.5 ? f(A.t) : FAR; };
  const body = (f) => (x, y, z) => { const A = armAt(x, y, z); return A.t > 2.8 && A.rr < 8.5 && y < 127.5 ? FAR : f(x, y, z); };
  const edges = [arm(t => t - CUFF0), body((x, y) => y - J.hemTop)];
  if (sporty) edges.push(arm(t => t - 11.5), arm(t => t - 21.3), body((x, y) => y - 115.7), body((x, y) => y - 100.4), body((x, y, z) => z > 1 ? Math.abs(x) - (J.gap + 0.42) : FAR), body((x, y, z) => z > 1 && y > J.hemTop ? Math.abs(x) - (J.gap + 1.5) : FAR), body((x, y, z) => z > 2 ? badge(x, y) : FAR));
  else {
    edges.push(arm(t => t - 2.8));
    for (const f of STRIPES) { edges.push(arm(t => t - (CUFF0 + f * S.cuffLen))); edges.push(body((x, y) => y - (J.y0 + f * (J.hemTop - J.y0)))); }
    edges.push(body((x, y, z) => z > 2 ? weltDist(J, x, y) - 0.62 : FAR));
    edges.push(body((x, y, z) => z > 2 ? sdB(x, y) : FAR), body((x, y, z) => z > 2 ? sdB(x, y) + 0.32 : FAR), body((x, y, z) => z > 2 ? sdB(x, y) + 0.62 : FAR));
  }
  return (x, y, z, nx, ny, nz, o) => {
    const { A, sleeve, hood } = where(x, y, z), ax = Math.abs(x);
    o.axis[0] = 0; o.axis[1] = 1; o.axis[2] = 0;
    let seam = FAR, kind = 0, sewn = 1, mask = 0, ph = 0, cnt = 60;
    const take = (v, k = 0, st = 1) => { if (Math.abs(v) < Math.abs(seam)) { seam = v; kind = k; sewn = st; } };
    if (sleeve) {
      if (A.t > CUFF0 - 0.3) { mask = sstep(CUFF0 - 0.25, CUFF0 + 0.15, A.t); ph = A.ph; cnt = 44; take(CUFF0 - A.t, 0, 0); }
      else if (sporty) for (const t of S.rings) take(A.t - t, 0, 0);
      else take(A.t - 2.8, 0, 1);
    } else if (hood) {
      const e = H.edge(x, y, z); if (e < 0 && e > -2.5) take(-e - 1.0, 1);
      if (x * nx + (z + 0.5) * nz < 0) o.open = 0.35;                                                   // the lining: open to the front light, keep a third of its shade
    } else {
      const hem = y < J.hemTop;
      if (hem) { mask = sstep(J.hemTop + 0.2, J.hemTop - 0.2, y); ph = ribPhase(x, z); cnt = 150; take(y - J.hemTop, 0, 0); }
      if (sporty) {
        for (const l of J.lines) if (!hem && y > l - 3) take(y - l, 0, 0);
        if (z > 2) { const t = (101.6 - y) / 9.2; if (t > 0 && t < 1) take((ax - (12.0 + 0.9 * t)) * 0.9, 4); }       // zip pockets
      } else {
        if (J.welts && z > 2) { const d = weltDist(J, x, y); take(d - 0.62, 3); }
        if (sdB && z > 2) { const d = sdB(x, y); if (d < 0.25) take(d, 3); }
        if (y > 108 && ax > 9) take(ax - 15.2, 0, 1);
      }
      if (z > 1 && ax < J.gap + 1.6 && y > J.y0) take(ax - (J.gap + (sporty ? 1.5 : 1.25)), 1);
    }
    o.rib[0] = Math.cos(ph); o.rib[1] = Math.sin(ph); o.rib[2] = cnt; o.rib[3] = mask;
    o.seam = seam; o.kind = kind; o.sewn = sewn;
    paint(o, x, y, z, nx, ny, nz, col, edges);
  };
}
// distance to the slanted opening of a welt pocket (either side)
function weltDist(J, x, y) {
  const [a, b] = J.welts, ax = -Math.abs(x), dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy, t = Math.max(0, Math.min(1, ((ax - a[0]) * dx + (y - a[1]) * dy) / l2));
  return Math.hypot(ax - a[0] - dx * t, y - a[1] - dy * t);
}
const TRI1 = polygon2([[7.4, 118.4], [10.6, 118.4], [9.0, 120.9]]), TRI2 = polygon2([[9.2, 118.4], [11.6, 118.4], [10.4, 120.2]]);
const BADGE = (x, y) => Math.min(TRI1(x, y), TRI2(x, y));            // two peaks

/* ================= the hoodie under the jacket ================= */
function hoodieParts(lin, F) {
  const Hd = F.hoodie, T = BODY.T, c = lin('hoodie'), p = [];
  // the first character's torso, stretched down to this hoodie's hem
  const k = (T.y1 - Hd.y0) / (T.y1 - T.y0), mapY = y => T.y1 - (T.y1 - y) / k;
  const prof = (y, o) => { const m = mapY(y); o[0] = T.a(m) - 0.15; o[1] = T.f(m) - 0.15; o[2] = T.b(m) - 0.15; o[3] = T.z0; o[4] = T.n; };
  const spine = chain([0, 0, 0], Y, [[Hd.y0 + 1.4, 'hem'], [Hd.y0 + 5.2, 'spine-1'], [99.5, 'spine-1'], [107.5, 'spine-2'], [111.5, 'spine-2'], [119.5, 'spine-3']]);
  p.push(loft([0, 0, 0], IDENT, Hd.y0, T.y1, prof, { bone: spine, k: 0, sigma: 2.6, color: c }));
  p.push(cone([0, 124, 0.3], [0, 141, 0.7], 3.72, 3.72, { op: 'sub', k: 0.8 }));
  const H = Hd.collar === 'big' ? funnel(Hd.big) : funnel(FIRST_COLLAR);
  p.push({ op: 'add', k: 0.7, sigma: 1.6, csig: 0.3, color: c, sd: H.sd, lo: H.lo3, hi: H.hi3, bone: hoodBone });
  if (Hd.collar === 'big') p.push(ellipsoid(Hd.big.back[0], Hd.big.back[1], undefined, { bone: 'hood', k: 2.0, sigma: 1.8, color: c }));
  return { prims: p, H, mapY };
}
// the first character's collar, as a funnel (the same numbers as body.js)
const FIRST_COLLAR = {
  a: [[126.5, 12.0], [129, 11.25], [130.6, 10.4], [132.1, 9.3], [133.5, 7.55], [135.0, 5.85], [135.9, 4.9]],
  f: [[126.0, 6.3], [128, 6.85], [129.5, 7.0], [131, 6.8], [133, 5.8], [135, 4.9], [135.9, 4.6]],
  b: [[126.5, 9.0], [130, 8.0], [133, 6.9], [135.9, 5.8]],
  v: [[127.6, 0], [128.4, 0.85], [130, 2.4], [131.5, 3.7], [133.5, 4.75], [135.5, 5.35], [136.5, 5.6]],
  z0: -0.6, n: 2.15, top: 135.5, thick: 1.55, y0: 126.6,
};
function hoodieSurface(F, H) {
  const Hd = F.hoodie;
  return (x, y, z, nx, ny, nz, o) => {
    o.axis[0] = 0; o.axis[1] = 1; o.axis[2] = 0;
    let seam = FAR, kind = 0, sewn = 1, mask = 0, ph = 0, cnt = 120;
    const take = (v, k = 0, st = 1) => { if (Math.abs(v) < Math.abs(seam)) { seam = v; kind = k; sewn = st; } };
    if (y < Hd.hemTop + 3 && Math.abs(x) < 14) { mask = sstep(Hd.hemTop + 0.2, Hd.hemTop - 0.2, y); ph = ribPhase(x, z); take(y - Hd.hemTop, 0, 0); }
    if (y > 127.4) { const e = H.edge(x, y, z); if (e < 0 && e > -2.5) take(-e - 1.0, 1); }
    o.rib[0] = Math.cos(ph); o.rib[1] = Math.sin(ph); o.rib[2] = cnt; o.rib[3] = mask;
    o.seam = seam; o.kind = kind; o.sewn = sewn;
  };
}

/* ================= drawstrings ================= */
function stringParts(lin, F, jacket) {
  const S = F.hoodie.strings, c = lin(S.color), tc = lin(S.tipColor), p = [], q = [], J = F.jacket;
  const zAt = (x, y) => { const h = frontZ(BODY_T, BODY.T, x, Math.min(131, y)); return Math.abs(x) > J.gap - 0.3 ? Math.max(h, frontZ(jacket.P, J, x, y) + jacket.puff(y) * J.puff) + 0.35 : h + 0.3; };
  for (const [n, s] of SIDES) {
    const x = s * S.x, ys = S.ys;
    p.push(cone([x - s * 0.5, ys[0] + 1.9, zAt(x, ys[0]) - 1.3], [x, ys[0], zAt(x, ys[0])], S.r, S.r, { bone: 'spine-3', k: 0.1, sigma: 0.4, color: c, csig: 0.1 }));
    const pts = ys[ys.length - 1] === S.tip[0] ? ys : [...ys, S.tip[0]];
    for (let i = 0; i < pts.length - 1; i++) p.push(cone([x, pts[i], zAt(x, pts[i])], [x, pts[i + 1], zAt(x, pts[i + 1])], S.r, S.r * 0.98, { bone: `drawstring-${n}-${Math.min(3, i + 1)}`, k: 0.1, sigma: 0.5, color: c, csig: 0.1 }));
    const [y0, y1] = S.tip, z = zAt(x, y0);
    q.push(cone([x, y0 - 0.1, z], [x, y1 + 0.1, z], S.r + 0.05, S.r + 0.05, { bone: 'drawstring-' + n + '-3', k: 0.05, sigma: 0.5, color: tc }));
  }
  return { strings: p, tips: q };
}

/* ================= trousers ================= */
function pantsParts(lin, F) {
  const Pn = F.pants, c = lin(Pn.color), p = [], PP = profile({ ...Pn.pelvis, z0: 0, n: 2.5 });
  const o = (bone, k, sigma, extra) => ({ bone, k, sigma, color: c, ...extra });
  p.push(loft([0, 0, 0], IDENT, Pn.pelvis.y0, Pn.pelvis.y1, PP.prof, o('pelvis', 0, 2.4)));
  const LEG = Pn.leg, pockets = [];
  for (const [n, s] of SIDES) {
    const { Hip, ld } = landmarks(s), leg = chain(Hip, ld, limbNodes(n).leg), at = t => V.add(Hip, V.mul(ld, t));
    p.push(sphere(Hip, LEG[0][1] - 0.1, o(leg, 2.0, 2)));
    for (let i = 0; i < LEG.length - 1; i++) p.push(cone(at(LEG[i][0]), at(LEG[i + 1][0]), LEG[i][1], LEG[i + 1][1], o(leg, i ? 0 : 2.2, 1.7)));
    for (const [t, r, tube] of Pn.folds) p.push(ring(at(t), [X, ld, Z], r, r, tube, 1.8, o(`shin-${n}`, 1.4, 1.6)));        // soft folds where the leg gathers
    if (Pn.cuff) {
      const [a, b, r] = Pn.cuff;
      p.push(cone(at(a), at(b), r, r * 0.98, o(`shin-${n}`, 0.6, 1.2)));
      p.push(rbox(at(b + 8), [8, 8, 8], 0, [ld, Z, V.cross(ld, Z)], { op: 'sub', k: 0.3 }));
    } else p.push(rbox(at(Pn.hem + 8), [8, 8, 8], 0, [ld, Z, V.cross(ld, Z)], { op: 'sub', k: 0.35 }));
    // a cargo pocket on the outer thigh: a bellows box with a flap
    const K = Pn.pocket, out0 = V.mul(V.norm(V.cross(ld, Z)), -s), out = V.norm(V.add(V.mul(out0, Math.cos(0.3)), V.mul(Z, Math.sin(0.3)))), side = V.norm(V.cross(out, ld));
    const r = curve(LEG)(K.t), ctr = V.add(at(K.t), V.mul(out, r - 0.25)), ax = [out, ld, side];
    p.push(rbox(ctr, [0.6, K.half - 0.6, K.around - 0.6], 0.6, ax, o(leg, 0.35, 1.5)));
    const fl = V.add(at(K.t - K.half + K.flap / 2 + 0.1), V.mul(out, r + 0.45));
    p.push(rbox(fl, [0.45, K.flap / 2 - 0.35, K.around - 0.35], 0.35, ax, o(leg, 0.2, 1.5)));
    pockets.push({ s, ctr, ax, K, fl, r, at, out });
  }
  return { prims: p, pockets };
}
function pantsSurface(F, pockets) {
  const Pn = F.pants;
  return (x, y, z, nx, ny, nz, o) => {
    const s = x < 0 ? -1 : 1, { Hip, ld } = landmarks(s);
    o.axis[0] = 0; o.axis[1] = 1; o.axis[2] = 0;
    let seam = FAR, kind = 0, mask = 0, ph = 0, cnt = 56;
    const take = (v, k = 0) => { if (Math.abs(v) < Math.abs(seam)) { seam = v; kind = k; } };
    const rx = x - Hip[0], ry = y - Hip[1], t = rx * ld[0] + ry * ld[1];
    if (y < 77.5) {
      const a = 24 * Math.PI / 180, u = [-s * Math.cos(a), 0, Math.sin(a)], nrm = V.norm(V.cross(ld, u)), px = rx - ld[0] * t, py = ry - ld[1] * t;
      take(px * nrm[0] + py * nrm[1] + z * nrm[2]);
      if (Pn.cuff) { const [a0] = Pn.cuff; if (t > a0 - 0.3) { mask = sstep(a0 - 0.2, a0 + 0.2, t); ph = Math.atan2(z, px); take(t - a0, 0); } }
      else take(t - (Pn.hem - 1.0), 1);
      // the cargo pocket and its flap
      const P = pockets.find(q => q.s === s), d = V.sub([x, y, z], P.ctr), along = V.dot(d, P.ax[1]), around = V.dot(d, P.ax[2]), outD = V.dot(d, P.ax[0]);
      if (outD > -0.6) {
        const box = Math.max(Math.abs(along) - P.K.half, Math.abs(around) - P.K.around);
        if (box < 0.8) take(box + 0.35, 1);
        const fa = along - (-P.K.half + P.K.flap);                                                       // the flap's lower edge
        if (Math.abs(around) < P.K.around && fa > -0.6 && fa < 0.6) take(fa, 3);
      }
    } else {
      if (z > 3 && x > -0.6 && x < 3 && y > 80.5) take(y > 82.3 ? x - 1.35 : Math.hypot(Math.max(x, 0), y - 82.3) - 1.35, 1);
      if (y < 81.2 || z < 0) take(x);
    }
    o.rib[0] = Math.cos(ph); o.rib[1] = Math.sin(ph); o.rib[2] = cnt; o.rib[3] = mask;
    o.seam = seam; o.kind = kind; o.sewn = 1;
  };
}

/* ================= sneakers ================= */
const SOLE = 3.0, OUTSOLE = 1.05, LONG = 1.06;
function shoeParts(lin, F) {
  const Sx = F.shoes, { SH, capEdge } = BODY, p = [];
  const top = Sx.high ? curve([[-8.4, 5.0], [-7.9, 11.6], [-6.4, 13.2], [-4.0, 13.0], [-1.6, 12.6], [0.4, 11.8], [2.2, 10.6], [4.0, 9.6], [6.0, 8.4], [8.5, 6.9], [10.5, 5.9], [13, 4.95], [15.5, 3.95], [17.2, 3.1], [18.0, 2.5]]) : SH.top;
  const width = v => SH.a(v / LONG) + 0.6;                                                                     // a court shoe is a little fuller than the canvas one
  const topL = v => top(v / LONG) + 0.3;
  const upperY = (u, v) => SOLE - 0.3 + (topL(v) - SOLE + 0.3) * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u) / Math.max(0.3, width(v) - 0.32), 2.5)), 1 / 2.5);
  const white = lin(Sx.upper), sole = lin(Sx.mid), lace = lin(Sx.lace);
  for (const [n, s] of SIDES) {
    const { Ankle, ff, fl } = landmarks(s), O = [Ankle[0], 0, Ankle[2]], ax = [fl, ff, Y];
    const at = (u, v, y) => [O[0] + fl[0] * u + ff[0] * v, y, O[2] + fl[2] * u + ff[2] * v];
    const bend = chain(O, ff, [[8.6, `foot-${n}`], [11.6, `toes-${n}`]]);
    const o = (k, color, extra) => ({ bone: bend, k, sigma: 0.9, csig: 0.1, color, ...extra });
    p.push(loft(O, ax, -8.7 * LONG, 18.5 * LONG, (v, q) => { q[0] = width(v) + 0.1; q[1] = q[2] = SOLE / 2; q[3] = SOLE / 2; q[4] = 5; }, o(0, sole)));
    const upper = loft(O, ax, -8.5 * LONG, 18.1 * LONG, (v, q) => { q[0] = Math.max(0.3, width(v) - 0.32); q[1] = topL(v) - SOLE + 0.3; q[2] = 1.2; q[3] = SOLE - 0.3; q[4] = 2.5; }, o(0.55, white));
    p.push(upper);
    p.push(ellipsoid(at(0, 3.4, upperY(0, 3.4) + 0.1), [2.1, 4.4, 0.55], [fl, ff, Y], o(0.3, white, { csig: 0.1 })));          // tongue
    p.push(ellipsoid(at(0, Sx.high ? 0.6 : 1.6, upperY(0, Sx.high ? 0.6 : 1.6) + 0.7), [1.7, 1.0, 0.7], [fl, ff, Y], o(0.4, white, { csig: 0.1 })));   // the padded top of the tongue
    // laces: rows that cross from eyelet to eyelet
    const rows = [1.6, 2.9, 4.2, 5.5, 6.8, 8.1].map((v, i) => { const hl = 2.25 - i * 0.1; return { v, l: at(-hl, v, upperY(-hl, v) + 0.18), r: at(hl, v, upperY(hl, v) + 0.18), m: at(0, v, upperY(0, v) + 0.36) }; });
    rows.forEach((q, i) => {
      for (const e of [q.l, q.r]) p.push(cone(e, q.m, 0.29, 0.29, o(0.08, lace, { csig: 0.07 })));
      if (i < rows.length - 1) { const n2 = rows[i + 1], mid = V.lerp(q.m, n2.m, 0.5); for (const [a2, b2] of [[q.l, n2.r], [q.r, n2.l]]) { p.push(cone(a2, mid, 0.22, 0.22, o(0.06, lace, { csig: 0.06 }))); p.push(cone(mid, b2, 0.22, 0.22, o(0.06, lace, { csig: 0.06 }))); } }
    });
  }
  return { prims: p, top };
}
function shoeSurface(F, lin) {
  const Sx = F.shoes, C = { sole: lin(Sx.sole), mid: lin(Sx.mid), upper: lin(Sx.upper), trim: lin(Sx.trim), line: lin(Sx.line) };
  const local = (x, z) => { const s = x < 0 ? -1 : 1, { Ankle, ff, fl } = landmarks(s), dx = x - Ankle[0], dz = z - Ankle[2]; return { u: (dx * fl[0] + dz * fl[2]) * s, v: dx * ff[0] + dz * ff[2], fl }; };
  const band = (v, y) => (y - SOLE) - 1.6 - (v + 3.2) * 0.08;                                             // the slanted side stripe's centre line
  const isSide = (x, z, nx, nz) => { const { fl } = local(x, z); return Math.abs(nx * fl[0] + nz * fl[2]) > 0.45; };
  const col = (x, y, z, nx, ny, nz) => {
    if (y < OUTSOLE) return C.sole;
    if (y < SOLE) return C.mid;
    const { u, v } = local(x, z), side = isSide(x, z, nx, nz);
    if (Sx.high) {
      const heel = v < -3.4 + 0.5 * (y - SOLE), collar = y > 9.6 + 0.12 * v, toe = v > 13.6 - 0.35 * (y - SOLE), eyestay = !side && v > -1 && v < 9.5 && Math.abs(u) > 1.6;
      return heel || collar || toe || eyestay ? C.trim : C.upper;
    }
    const heel = v < -4.6 + 0.25 * (y - SOLE) && y < 8.2;
    if (side && v > -2.6 && v < 12.0 && Math.abs(band(v, y)) < 0.6) return C.line;
    if (side && v > -5 && v < 12.8 && y < 7.8 - 0.2 * v && y > SOLE) return C.trim;
    return heel ? C.trim : C.upper;
  };
  const L = f => (x, y, z) => { const { u, v } = local(x, z); return f(u, v, y); };
  const edges = [(x, y) => y - OUTSOLE, (x, y) => y - SOLE];
  if (Sx.high) edges.push(L((u, v, y) => y < SOLE ? FAR : v - (-3.4 + 0.5 * (y - SOLE))), L((u, v, y) => y < SOLE ? FAR : y - (9.6 + 0.12 * v)), L((u, v, y) => y < SOLE ? FAR : v - (13.6 - 0.35 * (y - SOLE))), L((u, v, y) => y < SOLE || v < -1 || v > 9.5 ? FAR : Math.abs(u) - 1.6));
  else edges.push(L((u, v, y) => y < SOLE || y > 8.2 ? FAR : v - (-4.6 + 0.25 * (y - SOLE))), L((u, v, y) => y < SOLE ? FAR : Math.max(y - (7.8 - 0.2 * v), v - 12.8)), L((u, v, y) => y < SOLE || v < -2.6 || v > 12.0 ? FAR : Math.abs(band(v, y)) - 0.6));
  return (x, y, z, nx, ny, nz, o) => {
    o.axis[0] = 0; o.axis[1] = 1; o.axis[2] = 0; o.rib[0] = 1; o.rib[1] = 0; o.rib[2] = 1; o.rib[3] = 0;
    let seam = FAR, kind = 0;
    const take = (q, k = 0) => { if (Math.abs(q) < Math.abs(seam)) { seam = q; kind = k; } };
    if (y < SOLE + 0.4) take(y - SOLE, 1);
    else { const { v } = local(x, z); take(v - (Sx.high ? -3.4 + 0.5 * (y - SOLE) : -4.6 + 0.25 * (y - SOLE)), 1); }
    o.seam = seam; o.kind = kind; o.sewn = 1;
    paint(o, x, y, z, nx, ny, nz, col, edges);
  };
}

/* ================= small things: watch, snaps, ankles ================= */
function watchParts(lin) {
  const L = landmarks(1), { d: F, N, T: Th, Wr } = L, at = (u, v, w) => V.at(Wr, F, u, Th, v, N, w), p = [];
  p.push(ring(at(1.05, 0, 0.05), [Th, F, N], 2.3, 1.82, 0.3, 2.5, { bone: 'forearm-l', k: 0.2, sigma: 1, color: lin('strap'), csig: 0.2 }));
  p.push(rbox(at(1.05, 0, -2.0), [1.5, 1.25, 0.32], 0.32, [F, Th, N], { bone: 'forearm-l', k: 0.35, sigma: 1, color: lin('watch-face'), csig: 0.15 }));
  return p;
}
function snapParts(lin, F, jacket) {
  const p = [], J = F.jacket, steel = lin(J.snaps ? 'snap' : 'steel');
  if (J.snaps) for (const s of [-1, 1]) for (const y of J.snaps.ys) { const x = s * J.snaps.x, z = frontZ(jacket.P, J, x, y); p.push(ellipsoid([x, y, z + 0.08], [0.55, 0.55, 0.26], undefined, { bone: y < J.hemTop ? 'hem' : y < 99 ? 'spine-1' : 'spine-2', k: 0, sigma: 1, color: steel })); }
  if (castName() === 'sporty') {                                                                         // the zip's pull, hanging at the hem
    const x = -(J.gap + 0.2), y = J.y0 + 1.2, z = frontZ(jacket.P, J, x, J.y0 + 2) + 0.15;
    p.push(rbox([x, y, z], [0.32, 1.1, 0.12], 0.12, undefined, { bone: 'hem', k: 0, sigma: 1, color: steel }));
  }
  for (const P of F.pockets || []) { const b = V.add(P.fl, V.mul(P.out, 0.85)); p.push(ellipsoid(b, [0.32, 0.32, 0.32], undefined, { bone: `thigh-${P.s < 0 ? 'r' : 'l'}`, k: 0, sigma: 1, color: steel })); }
  return p;
}
function ankleParts(lin) {
  const p = [], c = lin('skin');
  for (const [n, s] of SIDES) { const { Hip, ld } = landmarks(s), at = t => V.add(Hip, V.mul(ld, t)); p.push(cone(at(61), at(73), 2.9, 2.55, { bone: `shin-${n}`, k: 0, sigma: 2, color: c })); }
  return p;
}

/* ================= all the parts ================= */
export function castParts(lin) {
  const F = fit();
  BODY_T = profile({ ...BODY.T, a: knotsOf(BODY.T.a), f: knotsOf(BODY.T.f), b: knotsOf(BODY.T.b) });
  const L = castLocks(), jacket = jacketParts(lin, F), hoodie = hoodieParts(lin, F), strings = stringParts(lin, F, jacket), pants = pantsParts(lin, F), shoes = shoeParts(lin, F);
  F.pockets = pants.pockets;
  const parts = {
    jacket: { prims: jacket.prims, cell: 0.42, ao: { strength: 1.2, reach: 1.6 }, surface: jacketSurface(F, jacket), material: castName() === 'sporty' ? 'puffer' : 'wool' },
    hoodie: { prims: hoodie.prims, cell: 0.5, ao: { strength: 0.7, reach: 1.4 }, surface: hoodieSurface(F, hoodie.H), material: 'knit' },
    pants: { prims: pants.prims, cell: 0.6, ao: { strength: 1, reach: 1.3 }, surface: pantsSurface(F, pants.pockets), material: F.pants.material },
    shoes: { prims: shoes.prims, cell: 0.26, ao: { strength: 0.9, reach: 0.9 }, surface: shoeSurface(F, lin), material: 'sneaker' },
    head: { prims: castHead(), cell: 0.36, symmetric: true, shadeSmooth: 6, ao: { strength: 0.45, reach: 0.6 }, surface: plainSurface, material: 'face' },
    hair: { prims: castHair(lin, L), cell: 0.36, refine: 2, shadeSmooth: 8, ao: { strength: 1.35, reach: 1.2 }, surface: castHairSurface(L), material: 'hair' },
    strings: { prims: strings.strings, cell: 0.14, ao: { strength: 0.6, reach: 0.6 }, surface: plainSurface, material: 'cord' },
    aglets: { prims: strings.tips, cell: 0.09, ao: { strength: 0.3, reach: 0.4 }, surface: plainSurface, material: 'steel' },
    snaps: { prims: snapParts(lin, F, jacket), cell: 0.1, ao: { strength: 0.3, reach: 0.4 }, surface: plainSurface, material: 'steel' },
    watch: { prims: watchParts(lin), cell: 0.12, ao: { strength: 0.5, reach: 0.4 }, surface: plainSurface, material: 'strap' },
  };
  if (F.ankles) parts.ankles = { prims: ankleParts(lin), cell: 0.3, ao: { strength: 0.8, reach: 0.8 }, surface: plainSurface, material: 'skin' };
  for (const [n, s] of SIDES) {
    const Lm = landmarks(s);
    parts[`hand-${n}`] = { prims: hand(lin, n, s), cell: 0.17, frame: [Lm.d, Lm.T, Lm.N], ao: { strength: 0.9, reach: 0.5 }, surface: plainSurface, material: 'skin' };
  }
  const P = parts, solid = k => P[k].prims.filter(q => q.op !== 'sub');
  P.jacket.occluders = [...solid('jacket'), ...solid('head'), ...solid('hair'), ...solid('hoodie')];
  P.hoodie.occluders = [...solid('hoodie'), ...solid('head')];                       // lit through the open jacket: the jacket's shade would grey it
  P.pants.occluders = [...solid('pants'), ...solid('jacket'), ...solid('shoes')];
  P.shoes.occluders = [...solid('shoes'), ...solid('pants')];
  P.head.occluders = [...solid('head'), ...solid('hair'), ...solid('hoodie'), ...solid('jacket')];
  P.hair.occluders = [...solid('hair'), ...solid('head')];
  P.strings.occluders = [...solid('strings'), ...solid('hoodie'), ...solid('jacket')];
  P.aglets.occluders = [...solid('aglets'), ...solid('hoodie')];
  P.snaps.occluders = [...solid('snaps'), ...solid('jacket')];
  P.watch.occluders = [...solid('watch'), ...solid('hand-l'), ...solid('jacket')];
  if (P.ankles) P.ankles.occluders = [...solid('ankles'), ...solid('pants'), ...solid('shoes')];
  for (const [n] of SIDES) P[`hand-${n}`].occluders = [...solid(`hand-${n}`), ...solid('jacket'), ...solid('watch')];
  return parts;
}
// body.js keeps its torso as curve functions; the knots are needed again here
function knotsOf(fn) { const out = []; for (let y = BODY.T.y0; y <= BODY.T.y1 + 1e-6; y += 0.5) out.push([y, fn(y)]); return out; }
