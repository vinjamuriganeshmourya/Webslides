// The head and the hair. Proportions are the reference's, measured (1 px = 0.1222 cm):
// face 17.4 cm across the cheeks narrowing to a small chin at 136.6, eyes 9 cm apart at 146.9,
// ears reaching 11.7 cm from the centre line, hair 25 cm across and 163.9 at the crown.
import { V, cone, ellipsoid, rbox, loft, curve, fieldAt } from './sdf.js';
import { SIDES, FRINGE, CROWN } from './skeleton.js';
import { castName } from './cast.js';
import { castHead, castLocks, castHair } from './hair2.js';

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], IDENT = [X, Y, Z];
const rad = d => d * Math.PI / 180;
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* ================= head ================= */
// The skull is lofted: `a` is the front outline (half width against height), `zf` and `zb` the side
// profile (front and back), `z0` where it is widest, `n` how square the cross-section is. The face
// is broad and nearly flat across the eyes (n near 4), as an anime head is, and round at chin and crown.
// Below the mouth the knots are moved down, most at the chin (0.7 cm): the chin is 8 cm nearer the
// camera than the middle of the head, so in the picture it sits that much higher than it is.
const low = k => k.map(([y, v]) => [y - 0.7 * Math.max(0, Math.min(1, (141.6 - y) / 5)), v]);
const H = {
  a: curve(low([[136.6, 0.3], [136.9, 1.9], [137.4, 3.1], [138.0, 3.95], [138.7, 5.2], [139.4, 6.0], [140.15, 6.66], [140.9, 7.2], [141.6, 7.65], [143, 8.3], [144.2, 8.72], [146.9, 9.25], [150, 9.45], [153, 9.5], [156, 9.15], [158.5, 8.05], [160.2, 6.3], [161.2, 3.7], [161.5, 0.4]])),
  zf: curve(low([[136.6, 6.6], [136.9, 7.7], [137.5, 8.3], [138.3, 8.65], [139.5, 8.75], [140.5, 9.1], [141.5, 9.3], [143, 9.4], [145, 9.3], [146.9, 9.3], [149, 9.55], [151, 9.85], [154, 9.9], [157.5, 9.0], [160, 6.5], [161.2, 3.1], [161.5, 0.6]])),
  zb: curve(low([[136.6, 5.2], [136.9, 4.0], [137.5, 2.6], [138.3, 0.8], [139.4, -1.4], [140.5, -3.6], [141.6, -5.6], [143, -8.0], [144.5, -9.4], [147, -10.4], [150, -10.9], [154, -10.6], [157.5, -9.0], [160, -5.8], [161.2, -2.4], [161.5, -0.4]])),
  z0: curve(low([[136.6, 5.9], [137.5, 5.2], [138.5, 4.2], [139.4, 3.2], [140.5, 2.0], [141.6, 1.2], [144.2, 0.4], [147, 0], [150, -0.3], [156, -0.4], [161.5, 0.1]])),
  n: curve(low([[136.6, 2.2], [139, 2.3], [142, 2.9], [145, 3.6], [147, 3.9], [150, 3.6], [153, 2.9], [157, 2.3], [161.5, 2.1]])),
};
const headProf = (y, o) => { const z0 = H.z0(y); o[0] = H.a(y); o[1] = H.zf(y) - z0; o[2] = z0 - H.zb(y); o[3] = z0; o[4] = H.n(y); };
// The face as it is shown: the same outline, with a side profile and a cross-section that change slowly
// and evenly from chin to crown, so cheek, jaw and chin are one smooth surface with no swell or hollow.
const FACE = {
  zf: curve(low([[136.6, 6.6], [136.9, 7.7], [137.5, 8.25], [138.5, 8.7], [140.5, 9.1], [143, 9.35], [146.9, 9.5], [150, 9.72], [153, 9.85], [155, 9.78], [157.5, 9.0], [160, 6.5], [161.2, 3.1], [161.5, 0.6]])),
  n: curve(low([[136.6, 2.4], [140, 2.7], [144, 3.2], [147.5, 3.5], [151, 3.3], [155, 2.7], [158.5, 2.3], [161.5, 2.2]])),
};
// the first character's skull curves: the other characters' side profiles are these, slid to their own landmarks (hair2.js)
export const SKULL = { H: () => H, FACE: () => FACE };
const faceProf = (y, o) => { const z0 = H.z0(y); o[0] = H.a(y); o[1] = FACE.zf(y) - z0; o[2] = z0 - H.zb(y); o[3] = z0; o[4] = FACE.n(y); };
// the lower front of the face follows the jaw bone
const skull = (x, y, z, add) => { const j = sstep(141.9, 139.3, y) * sstep(1.0, 4.5, z) * 0.92; add('jaw', j); add('head', 1 - j); };

// `approved` builds the head as it was when the clothes were signed off: only their baked shade uses it.
export function head(approved = false) {
  if (!approved && castName() !== 'mustard') return castHead();            // the other characters' heads: hair2.js
  const c = [1, 1, 1], p = [];                 // white: the face texture carries the skin colour
  const o = (bone, k, sigma, extra) => ({ bone, k, sigma, color: c, ...extra });
  p.push(loft([0, 0, 0], IDENT, 135.9, 161.5, approved ? headProf : faceProf, o(skull, 0, 2)));
  // the underside of the jaw: one clean plane, rising from the chin back to the neck (cut before the neck is added)
  const up = V.norm([0, 1, 0.43]), fw = V.cross(X, up);
  p.push(rbox(V.sub([0, 136.0, 8.3], V.mul(up, 10)), [14, 10, 16], 0, [X, up, fw], { op: 'sub', k: 1.1 }));
  const shade = { color: [0.76, 0.58, 0.53], csig: 0.5 };                                         // the neck sits in the jaw's shade
  p.push(cone([0, 126.5, -0.6], [0, 133, -0.2], 3.2, 3.15, o('neck-1', 1.4, 1.6, shade)));
  p.push(cone([0, 133, -0.2], [0, 140.2, 0.8], 3.15, 3.25, o('neck-2', 1.4, 1.6, shade)));
  p.push(ellipsoid([0, 142.1, 9.6], [0.82, 0.74, 1.08], undefined, o('head', 1.0, 2)));            // a small round nose
  for (const [n, s] of SIDES) {
    if (approved) p.push(ellipsoid([s * 5.0, 141.9, 5.7], [2.6, 2.4, 2.5], undefined, o('head', 2.0, 2)));
    // ears stand out from the head, tilted back
    const a = rad(40), b = rad(13), w = [s * Math.cos(a), 0, -Math.sin(a)], t = [s * Math.sin(a), 0, Math.cos(a)];
    const up = V.norm(V.add(V.mul(Y, Math.cos(b)), V.mul(w, Math.sin(b)))), w2 = V.cross(up, t), ctr = [s * 10.15, 145.25, -1.3];
    p.push(ellipsoid(ctr, [1.9, 2.95, 0.62], [w2, up, t], o(`ear-${n}`, 0.6, 0.8, approved ? {} : { color: [0.97, 0.86, 0.82], csig: 0.35 })));
    p.push(ellipsoid(V.at(ctr, w2, 0.3, up, 0.15, t, 0.62), [1.15, 1.95, 0.5], [w2, up, t], { op: 'sub', k: 0.4 }));
  }
  return p;
}
// the face surface at (x, y), looked at from the front: the eye layers are laid a little behind it
export function frontZ(prims, x, y, zFrom = 16, zTo = 0) {
  let a = zFrom, fa = fieldAt(prims, x, y, a);
  if (fa < 0) return a;
  for (let z = zFrom - 0.25; z >= zTo; z -= 0.25) {
    const f = fieldAt(prims, x, y, z);
    if (f < 0) { let lo = z, hi = a; for (let i = 0; i < 18; i++) { const m = (lo + hi) / 2; if (fieldAt(prims, x, y, m) < 0) lo = m; else hi = m; } return (lo + hi) / 2; }
    a = z; fa = f;
  }
  return zTo;
}

/* ================= hair ================= */
const CROWN_DEFAULT = CROWN;
// The hair's outer surface is a rounded-box dome (a superellipsoid): 24.9 cm across and nearly as
// tall, flatter on top than a ball, which is the reference's silhouette. `rho` is 1 on that surface.
const HC = [0, 152.4, -1.0], HR = [11.5, 10.95, 12.2], HN = 2.5;
let rx = NaN, ry = NaN, rz = NaN, rv = 0;                  // the last point asked for: every lock asks for the same one in turn
const rho = (x, y, z) => {
  if (x === rx && y === ry && z === rz) return rv;
  rx = x; ry = y; rz = z;
  return (rv = Math.pow(Math.pow(Math.abs(x) / HR[0], HN) + Math.pow(Math.abs(y) / HR[1], HN) + Math.pow(Math.abs(z) / HR[2], HN), 1 / HN));
};
const dirOf = p => V.norm(V.sub(p, HC));
// another character's hair lies on its own dome: { C: centre, R: radii, N: squareness }
export function dome(C, R, N) {
  let ax = NaN, ay = NaN, az = NaN, av = 0;
  const r = (x, y, z) => { if (x === ax && y === ay && z === az) return av; ax = x; ay = y; az = z; return (av = Math.pow(Math.pow(Math.abs(x) / R[0], N) + Math.pow(Math.abs(y) / R[1], N) + Math.pow(Math.abs(z) / R[2], N), 1 / N)); };
  return { C, R, N, rho: r, dirOf: p => V.norm(V.sub(p, C)) };
}
const DOME = { C: HC, R: HR, N: HN, rho, dirOf };
const slerp = (a, b, t) => { const d = Math.max(-1, Math.min(1, V.dot(a, b))), w = Math.acos(d); if (w < 1e-4) return a; const s = Math.sin(w); return V.add(V.mul(a, Math.sin((1 - t) * w) / s), V.mul(b, Math.sin(t * w) / s)); };

/* A lock of hair: a leaf-shaped slab that lies on the dome. Its centre line runs from the crown,
 * through the point where the lock is widest, to the tip; across, it is a flat lens (wide and thin);
 * `tilt` lifts one edge so that neighbouring locks overlap like roof tiles. One smooth solid, no joints. */
const SEG = 14;
const leaf = t => (t < 0.5 ? 0.5 + 0.5 * Math.sin(Math.PI * t) : Math.pow(Math.max(0, 1 - (t - 0.5) / 0.5), 0.8));   // width along the lock: half at the root, full in the middle, then straight in to a point
export function makeLock(q) {
  const { C: HC, rho, dirOf } = q.dome || DOME;
  // the centre line: a smooth curve through the crown, the widest point, an optional `hook` point and the tip
  const keys = q.hook ? [[0, q.root], [0.5, q.mid], [0.8, q.hook], [1, q.tip]] : [[0, q.root], [0.5, q.mid], [1, q.tip]];
  const T = keys.map(k => k[0]), D = keys.map(k => dirOf(k[1])), Rk = keys.map(k => rho(...V.sub(k[1], HC)));
  const cx = curve(T.map((t, i) => [t, D[i][0]])), cy = curve(T.map((t, i) => [t, D[i][1]])), cz = curve(T.map((t, i) => [t, D[i][2]])), cr = curve(T.map((t, i) => [t, Rk[i]]));
  const Q = [], R = [], P = [];                     // on the dome, its rho, and in space
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG, u = V.norm([cx(t), cy(t), cz(t)]), rr = cr(t);
    const k = 1 / rho(u[0], u[1], u[2]);
    Q.push([u[0] * k, u[1] * k, u[2] * k]); R.push(rr); P.push([HC[0] + u[0] * k * rr, HC[1] + u[1] * k * rr, HC[2] + u[2] * k * rr]);
  }
  let len = 0; const run = [0]; for (let i = 0; i < SEG; i++) { len += V.len(V.sub(P[i + 1], P[i])); run.push(len); }
  const E = [], L2 = [], S = [];
  for (let i = 0; i < SEG; i++) { const e = V.sub(Q[i + 1], Q[i]); E.push(e); L2.push(V.dot(e, e)); S.push(V.norm(V.cross(e, V.lerp(Q[i], Q[i + 1], 0.5)))); }   // side = along x outward
  // the centre line in stretches of four segments, each inside a sphere: [first, last, centre x y z, radius]
  const CH = [];
  for (let i = 0; i < SEG; i += 4) {
    const j = Math.min(SEG, i + 4), c = [0, 0, 0]; for (let k = i; k <= j; k++) for (let a = 0; a < 3; a++) c[a] += Q[k][a] / (j - i + 1);
    let r = 0; for (let k = i; k <= j; k++) r = Math.max(r, Math.hypot(Q[k][0] - c[0], Q[k][1] - c[1], Q[k][2] - c[2]));
    CH.push([i, j, c[0], c[1], c[2], r]);
  }
  // pillow > 2 gives the lens a fuller, flatter-topped section
  const W = q.w, TH = q.th ?? 0.8, tilt = q.tilt ?? 0, PIL = q.pillow ?? 2, hit = { d: 0, t: 0, lat: 0, i: 0 };
  // nearest point of the centre line to p, measured on the dome
  const at = (x, y, z) => {
    const px = x - HC[0], py = y - HC[1], pz = z - HC[2], rr = rho(px, py, pz) || 1e-6, qx = px / rr, qy = py / rr, qz = pz / rr;
    let best = 1e18, bi = 0, bu = 0, bl = 0, far = 1e18;
    for (let c = 0; c < CH.length; c++) {
      const ch = CH[c];
      if (PIL !== 2) { const dc = Math.hypot(qx - ch[2], qy - ch[3], qz - ch[4]) - ch[5]; if (dc > W + 3.5) { if (dc < far) far = dc; continue; } }   // this stretch is far away: no need to walk it
      for (let i = ch[0]; i < ch[1]; i++) {
        const a = Q[i], e = E[i], wx = qx - a[0], wy = qy - a[1], wz = qz - a[2], u = Math.max(0, Math.min(1, (wx * e[0] + wy * e[1] + wz * e[2]) / L2[i]));
        const dx = wx - e[0] * u, dy = wy - e[1] * u, dz = wz - e[2] * u, d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < best) { best = d2; bi = i; bu = u; bl = dx * S[i][0] + dy * S[i][1] + dz * S[i][2]; }
      }
    }
    if (best === 1e18) { hit.d = far - W; hit.t = 0.5; hit.lat = far; hit.i = 0; return hit; }          // far from the whole clump: how far is all that is needed
    const t = (bi + bu) / SEG, lat = Math.sqrt(best), f = leaf(t), r = Math.max(0.06, W * f), th = TH * (0.3 + 0.7 * Math.sqrt(f));
    const h = (rr - (R[bi] + (R[bi + 1] - R[bi]) * bu)) * Math.hypot(px, py, pz) / rr - tilt * (bl >= 0 ? lat : -lat);
    hit.d = ((PIL === 2 ? Math.hypot(lat / r, h / th) : Math.pow(Math.pow(lat / r, PIL) + Math.pow(Math.abs(h) / th, PIL), 1 / PIL)) - 1) * Math.min(r, th); hit.t = t; hit.lat = bl >= 0 ? lat : -lat; hit.i = bi;
    return hit;
  };
  const m = W + TH + 0.6, lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (const pt of P) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], pt[k] - m); hi[k] = Math.max(hi[k], pt[k] + m); }
  const chord = V.len(V.sub(q.tip, q.root));
  return { ...q, at, sd: (x, y, z) => at(x, y, z).d, lo, hi, P, run, len,
    tangent: i => V.norm(V.sub(P[i + 1], P[i])),
    // the root follows the head, the rest follows the lock's own spring bone
    weights: (x, y, z, add) => { const f = sstep(0.3, 0.7, Math.hypot(x - q.root[0], y - q.root[1], z - q.root[2]) / chord); add('head', 1 - f); add(q.bone, f); } };
}

/* The hair is sixteen sculpted clumps on the dome, the way a cartoon figure's hair is modelled: five
 * across the forehead (their tips where the reference's fringe ends), a temple and a side clump over
 * each ear, and five round the back. Each is thick, full and smooth; they overlap like roof tiles. */
export function locks(approved = false) {
  if (!approved && castName() !== 'mustard') return castLocks();
  const L = [];
  const lock = (mid, tip, w, bone, o = {}) => L.push(makeLock({ root: o.root || CROWN, mid, tip, w, bone, id: L.length, shade: 1, ...o }));
  const ft = [0.3, -0.25, 0.22, -0.2, -0.3], lift = approved ? 1 : 1.8;          // how far one edge of a clump stands above its neighbour
  const fh = [[-9.4, 151.9, 6.0], [-3.7, 151.2, 10.7], [1.4, 151.1, 11.1], [4.9, 151.4, 10.5], [9.4, 152.1, 6.2]];        // each lock runs straight, then hooks to its tip
  if (approved) return approvedLocks(L, lock, ft, fh);
  const fw = [2.4, 2.55, 2.75, 1.9, 1.7], clump = { pillow: 2.6, th: 1.15 };
  FRINGE.forEach(([m, t], i) => lock(m, t, fw[i], `hair-front-${i + 1}`, { ...clump, tilt: ft[i] * lift, hook: fh[i] }));
  for (const [n, s] of SIDES) {
    lock([s * 10.6, 152.6, 5.4], [s * 9.45, 145.3, 5.0], 2.6, `hair-side-${n}`, { ...clump, th: 1.0, tilt: s * 0.2 * lift });      // over the temple, down in front of the ear
    lock([s * 12.0, 152.2, 0.2], [s * 12.0, 147.2, 1.0], 3.4, `hair-side-${n}`, { ...clump, tilt: -s * 0.15 * lift });             // the widest part of the silhouette
    lock([s * 11.4, 151.0, -5.6], [s * 10.9, 144.6, -5.0], 3.3, 'hair-back', { ...clump, tilt: s * 0.18 * lift });                 // behind the ear
    lock([s * 8.6, 149.6, -10.0], [s * 8.5, 140.9, -3.9], 3.6, 'hair-back', { ...clump, tilt: -s * 0.15 * lift });                 // round to the tip that shows under the ear
    lock([s * 4.6, 148.8, -12.6], [s * 5.4, 139.8, -9.3], 3.5, 'hair-back', { ...clump, tilt: s * 0.15 * lift });
  }
  lock([0, 148.8, -13.4], [0, 139.4, -10.8], 3.6, 'hair-back', { ...clump, tilt: 0.12 * lift });
  return L;
}
// the finer locks of the version the clothes were approved with (used only to shade the clothes)
function approvedLocks(L, lock, ft, fh) {
  const fw = [2.45, 2.6, 2.8, 1.9, 1.7], fs = [0.97, 1.05, 1.0, 1.06, 0.97];
  FRINGE.forEach(([m, t], i) => lock(m, t, fw[i], `hair-front-${i + 1}`, { tilt: ft[i], shade: fs[i], th: 0.85, hook: fh[i] }));
  for (const [n, s] of SIDES) {
    lock([s * 10.6, 152.6, 5.4], [s * 9.45, 145.3, 5.0], 2.3, `hair-side-${n}`, { shade: 0.96, tilt: s * 0.2 });        // over the temple, down in front of the ear
    lock([s * 12.1, 152.4, 0.4], [s * 12.0, 147.4, 1.0], 2.7, `hair-side-${n}`, { shade: 1.04, tilt: -s * 0.15 });      // the widest part of the silhouette
    lock([s * 11.7, 151.2, -5.2], [s * 10.9, 144.6, -5.0], 2.8, 'hair-back', { shade: 0.98, tilt: s * 0.18 });          // behind the ear
    lock([s * 9.4, 149.6, -9.6], [s * 8.5, 140.9, -3.9], 3.1, 'hair-back', { tilt: -s * 0.15 });                        // round to the tip that shows under the ear
    lock([s * 5.2, 148.8, -12.6], [s * 5.4, 139.8, -9.3], 3.2, 'hair-back', { shade: 1.03, tilt: s * 0.15 });
    // a shorter upper layer between the long locks
    lock([s * 6.6, 160.2, 4.6], [s * 10.4, 155.6, 6.2], 2.0, 'head', { shade: 1.07, th: 0.6, tilt: s * 0.25 });
    lock([s * 8.2, 159.6, -4.6], [s * 12.2, 153.6, -5.6], 2.3, 'head', { shade: 1.05, th: 0.6, tilt: -s * 0.2 });
  }
  lock([0, 148.8, -13.4], [0, 139.4, -10.8], 3.2, 'hair-back', { tilt: 0.12 });
  lock([0.6, 160.6, -7.4], [-0.8, 154.4, -13.2], 2.7, 'head', { shade: 1.06, th: 0.6, tilt: -0.2 });
  lock([-2.0, 161.2, 5.4], [-3.4, 157.0, 10.2], 1.9, 'head', { shade: 1.08, th: 0.6, tilt: 0.25 });                     // two short ones on top of the fringe
  lock([3.6, 161.0, 5.0], [4.2, 157.2, 9.9], 1.8, 'head', { shade: 1.05, th: 0.6, tilt: -0.25 });
  return L;
}

export function hair(lin, L = locks()) {
  if (castName() !== 'mustard' && !L.approved) return castHair(lin, L);
  const base = lin('hair'), p = [];
  const o = (bone, k, sigma, color = base) => ({ bone, k, sigma, color, csig: 0.45 });
  // the cap under the locks, opened over the face and round the ears and the neck
  const sup = (y, out) => { const f = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(y - HC[1]) / (HR[1] - 0.6), HN)), 1 / HN); out[0] = (HR[0] - 0.8) * f; out[1] = out[2] = (HR[2] - 0.8) * f; out[3] = HC[2]; out[4] = HN; };
  p.push(loft([0, 0, 0], IDENT, HC[1] - HR[1] + 0.62, HC[1] + HR[1] - 0.62, sup, o('head', 0, 2)));
  p.push(rbox([0, 142.4, 10.6], [7.3, 9.8, 5.6], 2.9, undefined, { op: 'sub', k: 0.9 }));                 // the face
  const ny = V.norm([0, 1, -0.52]), nz = V.norm([0, 0.52, 1]);
  p.push(rbox(V.sub([0, 148.4, 2.5], V.mul(ny, 12)), [16, 12, 22], 0, [X, ny, nz], { op: 'sub', k: 1.0 }));   // everything below the hairline: higher at the temples, lower at the nape
  p.push(cone([0, 126, 0], [0, 141.5, -0.4], 5.2, 5.7, { op: 'sub', k: 1.0 }));
  for (const l of L) p.push({ op: 'add', k: l.pillow ? 0.45 : 0.4, sigma: 1.3, csig: 0.45, bone: l.bone === 'head' ? 'head' : l.weights, color: base.map(v => Math.min(1, v * l.shade)), sd: l.sd, lo: l.lo, hi: l.hi });
  // the tuft on the crown: up, then hooked over to one side
  const chunky = L.some(l => l.pillow);
  const T = chunky ? [[0.3, 162.3, 0.4], [0.75, 165.7, 0.9], [2.3, 168.0, 1.2], [4.6, 168.95, 1.35]] : [[0.3, 162.4, 0.4], [0.9, 166.0, 0.9], [2.5, 168.25, 1.2], [4.45, 168.85, 1.35]];
  const tw = chunky ? [2.15, 1.8, 1.2, 0.3] : [1.95, 1.5, 0.95, 0.14];
  for (let i = 0; i < 3; i++) p.push(cone(T[i], T[i + 1], tw[i], tw[i + 1], o('hair-top', i ? 0.25 : 0.9, 1, base.map(v => Math.min(1, v * 1.06)))));
  return p;
}

// strand direction and position across the strands at one hair vertex
export function hairSurface(L, CROWN = CROWN_DEFAULT) {
  return (x, y, z, nx, ny, nz, o) => {
    let best = 1e9, hit = null, t = 0, lat = 0, seg = 0;
    for (const l of L) {
      if (x < l.lo[0] || x > l.hi[0] || y < l.lo[1] || y > l.hi[1] || z < l.lo[2] || z > l.hi[2]) continue;
      const h = l.at(x, y, z);
      if (h.d < best) { best = h.d; hit = l; t = h.t; lat = h.lat; seg = h.i; }
    }
    if (hit && best < 0.5) {
      const tg = hit.tangent(seg);
      o.axis[0] = tg[0]; o.axis[1] = tg[1]; o.axis[2] = tg[2];
      o.strand = lat + hit.id * 7.31; o.run = t * hit.len;
    } else {                                                // the cap and the tuft: strands run away from the crown
      let fx = x - CROWN[0], fy = y - CROWN[1], fz = z - CROWN[2]; const dn = fx * nx + fy * ny + fz * nz; fx -= nx * dn; fy -= ny * dn; fz -= nz * dn;
      const l = Math.hypot(fx, fy, fz) || 1; o.axis[0] = fx / l; o.axis[1] = fy / l; o.axis[2] = fz / l;
      o.strand = Math.atan2(x - CROWN[0], -(z - CROWN[2])) * 9 + 300; o.run = l;
    }
  };
}
