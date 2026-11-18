// The clothes and the hands as blended 3D shapes. Sizes are measured on the reference picture
// (1 px = 0.1222 cm): chest 21 cm across, sleeves 8.3 cm, cuffs 5.7 cm, hem band 4 cm tall,
// pocket 13 cm wide at the top and 17.8 cm at the bottom, legs 11.7 cm at the top and 9 cm at the ankle.
//
// Every part also describes its surface for the material (see material.js):
//   axis   the direction the cloth's grain runs
//   rib    where ribbing is, which way round it runs and how many ribs
//   seam   signed distance in centimetres to the nearest seam or stitch line
import { V, sphere, cone, ellipsoid, rbox, ring, loft, curve, polygon2, patch, bounded, chain } from './sdf.js';
import { SIDES, landmarks, handChains, limbNodes, STRING_X, STRING_Y, STRING_Z } from './skeleton.js';

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], IDENT = [X, Y, Z];
const rad = d => d * Math.PI / 180;
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const FAR = 99;                                  // "no seam near here"

/* ================= hoodie ================= */
// front outline (half width), belly and back depth, all against height
const T = {
  a: curve([[87.2, 11.15], [87.9, 11.55], [90.9, 11.55], [92.6, 11.8], [94.4, 11.75], [96.9, 11.25], [100, 10.85], [104.2, 10.55], [111.5, 10.5], [113.6, 10.85], [116, 11.4], [120, 11.9], [124, 12.0], [127.2, 11.3], [129.6, 8.8], [131.2, 5.2], [131.9, 0.5]]),
  f: curve([[87.2, 7.6], [87.9, 8.05], [91.0, 8.1], [91.7, 7.8], [92.4, 7.85], [97, 7.75], [104, 7.5], [112, 7.35], [120, 7.0], [126, 6.2], [129.5, 4.5], [131.9, 2.0]]),
  b: curve([[87.2, 6.95], [87.9, 7.25], [95, 7.3], [108, 7.5], [118, 7.6], [125, 6.9], [129.5, 5.0], [131.9, 2.2]]),
  z0: 0.2, n: 2.5, y0: 87.2, y1: 131.9,
};
const torsoProf = (y, o) => { o[0] = T.a(y); o[1] = T.f(y); o[2] = T.b(y); o[3] = T.z0; o[4] = T.n; };
// the front surface of the torso at (x, y): lets the pocket, the cords and the seams sit exactly on it
export const torsoZ = (x, y) => T.z0 + T.f(y) * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x) / T.a(y), T.n)), 1 / T.n);
const spine = chain([0, 0, 0], Y, [[88.6, 'hem'], [92.4, 'spine-1'], [99.5, 'spine-1'], [107.5, 'spine-2'], [111.5, 'spine-2'], [119.5, 'spine-3']]);

export const HEM_Y = 91.4, CUFF = 4.3, ARM = 41.3, SEAM_X = 14.15;
export const POCKET = [[-6.5, 101.6], [6.5, 101.6], [8.9, 94.3], [8.9, 91.45], [-8.9, 91.45], [-8.9, 94.3]];
const pocketSd = polygon2(POCKET.map(q => [q[0], q[1] < 92 ? 91.15 : q[1]])), pocketOutline = polygon2(POCKET.map(q => [q[0], q[1] < 92 ? 84 : q[1]]));   // the outline without its bottom edge: that one is the hem seam
/* The collar is the hood's opening: a funnel of thick cloth standing round the neck, widening down
 * onto the shoulders, cut open in a V at the front. It is modelled as a sheet (the surface of a
 * lofted shape) with a rounded edge, so the rim reads as rolled cloth. */
const K = {
  a: curve([[126.5, 12.0], [129, 11.25], [130.6, 10.4], [132.1, 9.3], [133.5, 7.55], [135.0, 5.85], [135.9, 4.9]]),       // half width of the sheet
  f: curve([[126.0, 6.3], [128, 6.85], [129.5, 7.0], [131, 6.8], [133, 5.8], [135, 4.9], [135.9, 4.6]]),              // how far it stands in front of the neck
  b: curve([[126.5, 9.0], [130, 8.0], [133, 6.9], [135.9, 5.8]]),
  v: curve([[127.6, 0], [128.4, 0.85], [130, 2.4], [131.5, 3.7], [133.5, 4.75], [135.5, 5.35], [136.5, 5.6]]),         // half width of the V opening
  z0: -0.6, n: 2.15, top: 135.5, thick: 1.55,
};
const NECKLINE = 0.27;                              // the neckline seam climbs this much per centimetre from the centre
const collarLoft = loft([0, 0, 0], IDENT, 126.0, 138, (y, o) => { o[0] = K.a(y); o[1] = K.f(y); o[2] = K.b(y); o[3] = K.z0; o[4] = K.n; }, {});
// how far past the cloth's edge a point is (negative: that far inside the edge)
export const collarEdge = (x, y, z) => Math.max(y - (K.top - 0.35 * sstep(0, -6, z)), z > K.z0 ? (K.v(y) - Math.abs(x)) * 0.82 : -9);
// below the neckline the sheet dives under the body's surface, so the two meet in one clean crease
const collarSd = (x, y, z) => { const e = collarEdge(x, y, z), d = Math.abs(collarLoft.sd(x, y, z) + 1.7 * (1 - sstep(126.3, 128.7, y - NECKLINE * Math.abs(x)))); return (e > 0 ? Math.hypot(e, d) : d) - K.thick / 2; };

export function hoodie(lin) {
  const c = lin('hoodie'), p = [];
  const o = (bone, k, sigma, extra) => ({ bone, k, sigma, color: c, ...extra });
  const torso = loft([0, 0, 0], IDENT, T.y0, T.y1, torsoProf, o(spine, 0, 2.6));
  p.push(torso);
  for (const [n, s] of SIDES) {
    const L = landmarks(s), { d, Sh, El, Wr } = L, along = t => V.add(Wr, V.mul(d, t)), arm = chain(Sh, d, limbNodes(n).arm);
    p.push(cone([s * 5.2, 126.2, -0.4], Sh, 3.2, 3.5, o(`clavicle-${n}`, 1.6, 1.8)));                  // the slope from neck to shoulder
    p.push(sphere(Sh, 3.6, o(arm, 1.2, 1.7)));
    p.push(cone(Sh, El, 3.78, 4.08, o(arm, 1.6, 1.5)));
    p.push(cone(El, along(-7), 4.08, 3.85, o(arm, 0, 1.4)));
    p.push(ellipsoid(along(-5.6), [3.98, 2.6, 3.98], [L.N, d, Z], o(arm, 1.6, 1.3)));                  // the sleeve gathers and hangs over the cuff
    p.push(cone(along(-CUFF - 0.1), along(-0.25), 3.02, 2.84, o(`cuff-${n}`, 0.35, 0.8)));
    p.push(rbox(along(5.75), [6, 6, 6], 0, [d, Z, V.cross(d, Z)], { op: 'sub', k: 0.4 }));              // flat end of the cuff
    // soft creases where the sleeve bends
    for (const [t, depth, lean] of [[19.4, 0.9, 0.7], [22.6, 0.8, -0.6]]) {
      const q = V.add(Sh, V.mul(d, t)), a = V.at(q, Z, 4.75, L.N, 2.4, d, lean), b = V.at(q, Z, 4.75, L.N, -2.4, d, -lean);
      p.push(cone(a, b, depth, depth, { op: 'sub', k: 2.6 }));
    }
  }
  p.push(cone([0, 124, 0.3], [0, 141, 0.7], 3.72, 3.72, { op: 'sub', k: 0.8 }));                        // room for the neck
  p.push({ op: 'add', k: 0.7, sigma: 1.6, csig: 0.3, color: c, sd: collarSd, lo: [-13, 125.6, -10.5], hi: [13, 137, 9.5],
    bone: (x, y, z, add) => { const h = 0.85 * sstep(-1, -6, z); add('hood', h); add('spine-3', 1 - h); } });
  p.push(ellipsoid([0, 128.4, -7.6], [9.6, 6.8, 3.4], undefined, o('hood', 2.0, 1.8)));                 // the hood itself, lying on the back
  // pocket: a patch of even thickness on the curved front, with its two slanted openings
  p.push(bounded(patch(torso, 0.36, pocketSd, IDENT, [0, 0, 0], 0.1, o('spine-1', 0.7, 2)), [-10.5, 90.4, 2], [10.5, 103, 9.9]));
  // the T-shirt inside the collar
  p.push(ellipsoid([0, 129.6, 3.6], [3.9, 2.7, 1.9], undefined, { bone: 'spine-3', k: 0.4, sigma: 1.6, color: lin('tee'), csig: 0.09 }));
  return p;
}

// perimeter position round the hem band, so the ribs are evenly spaced on its rounded-box section
const hemRing = (() => {
  const N = 720, a = T.a(89.5), c = (T.f(89.5) + T.b(89.5)) / 2, n = T.n, s = new Float64Array(N + 1), pt = i => { const t = i / N * Math.PI * 2, cs = Math.cos(t), sn = Math.sin(t); return [a * Math.sign(cs) * Math.pow(Math.abs(cs), 2 / n), c * Math.sign(sn) * Math.pow(Math.abs(sn), 2 / n)]; };
  for (let i = 1; i <= N; i++) { const p0 = pt(i - 1), p1 = pt(i); s[i] = s[i - 1] + Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); }
  return { count: Math.round(s[N] / 0.56), phase: (x, z) => { const cz = (z >= T.z0 ? T.f(89.5) : T.b(89.5)); let t = Math.atan2(Math.sign(z - T.z0) * Math.pow(Math.abs(z - T.z0) / cz, n / 2), Math.sign(x) * Math.pow(Math.abs(x) / a, n / 2)); if (t < 0) t += Math.PI * 2; const f = t / (Math.PI * 2) * N, i = Math.min(N - 1, Math.floor(f)); return (s[i] + (s[i + 1] - s[i]) * (f - i)) / s[N] * Math.PI * 2; } };
})();
const CUFF_RIBS = 42;

// surface description for one hoodie vertex
export function hoodieSurface(x, y, z, nx, ny, nz, o) {
  const s = x < 0 ? -1 : 1, L = landmarks(s), { d, Sh, Wr } = L;
  const rx = x - Sh[0], ry = y - Sh[1], rz = z - Sh[2], t = rx * d[0] + ry * d[1] + rz * d[2], rr = Math.hypot(rx - d[0] * t, ry - d[1] * t, rz - d[2] * t);
  o.axis[0] = 0; o.axis[1] = 1; o.axis[2] = 0;                                   // one grain direction: a change of direction would smear the weave along the armhole
  // seams: [signed distance, kind (0 joined seam, 1 topstitching), stitched?]
  let seam = FAR, kind = 0, sewn = 1;
  const take = (v, k = 0, st = 1) => { if (Math.abs(v) < Math.abs(seam)) { seam = v; kind = k; sewn = st; } };
  if (y > 108 && Math.abs(x) > 9) take(Math.abs(x) - SEAM_X, 0, 0);                // armhole
  if (z > 3 && y > 126.2 && y < 131.5 && Math.abs(x) < 11.5 && collarEdge(x, y, z) < -0.3) take((y - 127.5 - NECKLINE * Math.abs(x)) * 0.96, 0, 0);   // neckline: where the hood is sewn to the body
  if (Math.abs(x) < 13 && y < 96) take(y - HEM_Y, 0, 0);                           // hem band: a fold, no stitching
  if (rr < 6.5 && t > 30) take((ARM - CUFF) - t, 0, 0);                            // cuff
  if (z > 2 && y < 103 && y > HEM_Y + 0.15 && Math.abs(x) < 10) { const ps = pocketOutline(x, y); take(ps, y < 100.9 && y > 94.3 && Math.abs(x) > 6.2 + (101.6 - y) * 0.2 ? 4 : 3); }   // pocket: sewn-on patch, with its two openings
  if (y > 128.2 && collarLoft.sd(x, y, z) > 0.1) { const e = collarEdge(x, y, z); if (e < 0 && e > -2.5) take(-e - 1.0, 1); }    // the hood's edge, stitched a finger's width in
  if (z > 4 && y < 127.9 && y > 125.2 && Math.abs(x) < 2.6) take((x - (127.75 - y) * 0.62) * 0.85, 0, 0);                         // where one side of the collar laps over the other
  // ribbing
  let mask = 0, ph = 0, cnt = 60;
  if (rr < 6.5 && t > 33) { mask = sstep(ARM - CUFF - 0.25, ARM - CUFF + 0.15, t); ph = Math.atan2(rx * L.N[0] + ry * L.N[1] + rz * L.N[2], rz); cnt = CUFF_RIBS; }
  else if (Math.abs(x) < 13 && y < 95) { mask = sstep(HEM_Y + 0.2, HEM_Y - 0.2, y); ph = hemRing.phase(x, z); cnt = hemRing.count; }
  o.rib[0] = Math.cos(ph); o.rib[1] = Math.sin(ph); o.rib[2] = cnt; o.rib[3] = mask;
  o.seam = seam; o.kind = kind; o.sewn = sewn;
}

/* ================= drawstrings and their metal tips ================= */
export function strings(lin) {
  const c = lin('hoodie-shade'), p = [];
  for (const [n, s] of SIDES) {
    const x = s * STRING_X, zAt = y => torsoZ(x, y) + 0.3, y = [STRING_Y, STRING_Y - 3.7, STRING_Y - 7.4, STRING_Y - 10.4];
    p.push(cone([x - s * 0.5, STRING_Y + 1.9, zAt(STRING_Y) - 1.3], [x, STRING_Y, zAt(STRING_Y)], 0.37, 0.37, { bone: 'spine-3', k: 0.1, sigma: 0.4, color: c, csig: 0.1 }));   // out from under the collar
    for (let i = 0; i < 3; i++) p.push(cone([x, y[i], zAt(y[i])], [x, y[i + 1], zAt(y[i + 1])], 0.37, 0.36, { bone: `drawstring-${n}-${i + 1}`, k: 0.1, sigma: 0.5, color: c, csig: 0.1 }));
  }
  return p;
}
export function aglets(lin) {
  const c = lin('steel'), p = [];
  for (const [n, s] of SIDES) {
    const x = s * STRING_X, y0 = STRING_Y - 10.2, y1 = STRING_Y - 12.1, z = torsoZ(x, y0) + 0.3;
    p.push(rbox([x, (y0 + y1) / 2, z], [0.3, (y0 - y1) / 2 - 0.1, 0.3], 0.12, undefined, { bone: `drawstring-${n}-3`, k: 0, sigma: 0.5, color: c }));
    p.push(cone([x, y0 - 0.1, z], [x, y1 + 0.1, z], 0.4, 0.4, { bone: `drawstring-${n}-3`, k: 0.05, sigma: 0.5, color: c }));
  }
  return p;
}

/* ================= jeans ================= */
const J = {
  a: curve([[78.7, 11.2], [80.2, 11.5], [83, 11.3], [86.6, 10.9], [89, 10.4], [90.8, 9.5]]),
  f: curve([[78.7, 5.5], [80.5, 6.3], [83, 6.9], [86, 7.0], [89, 6.7], [90.8, 6.2]]),
  b: curve([[78.7, 5.6], [80.5, 6.6], [83, 7.2], [86, 7.3], [89, 6.9], [90.8, 6.4]]),
};
const pelvisProf = (y, o) => { o[0] = J.a(y); o[1] = J.f(y); o[2] = J.b(y); o[3] = 0; o[4] = 2.5; };
// leg radius against distance from the hip
const LEG_R = [[0, 5.85], [14, 5.62], [24, 5.08], [33, 4.9], [45, 4.78], [58, 4.52], [66, 4.5], [71.6, 4.66]];
export const HEM_T = 71.3;

export function jeans(lin) {
  const c = lin('jeans'), p = [];
  const o = (bone, k, sigma) => ({ bone, k, sigma, color: c });
  p.push(loft([0, 0, 0], IDENT, 78.7, 90.8, pelvisProf, o('pelvis', 0, 2.4)));
  for (const [n, s] of SIDES) {
    const { Hip, ld } = landmarks(s), leg = chain(Hip, ld, limbNodes(n).leg), at = t => V.add(Hip, V.mul(ld, t));
    p.push(sphere(Hip, 5.7, o(leg, 2.0, 2)));
    for (let i = 0; i < LEG_R.length - 1; i++) p.push(cone(at(LEG_R[i][0]), at(LEG_R[i + 1][0]), LEG_R[i][1], LEG_R[i + 1][1], o(leg, i ? 0 : 2.2, 1.7)));
    p.push(ring(at(67.0), [X, ld, Z], 4.28, 4.28, 0.3, 2.0, o(`shin-${n}`, 1.6, 1.6)));                 // the leg is a little long: one soft fold above the hem
    p.push(rbox(at(HEM_T + 8), [8, 8, 8], 0, [ld, Z, V.cross(ld, Z)], { op: 'sub', k: 0.35 }));        // flat hem
  }
  return p;
}
const flySd = (x, y) => (y > 82.3 ? x - 1.35 : Math.hypot(Math.max(x, 0), y - 82.3) - 1.35);
const backPocket = polygon2([[3.2, 85.5], [8.6, 85.5], [8.6, 80.6], [5.9, 79.0], [3.2, 80.6]]);
export function jeansSurface(x, y, z, nx, ny, nz, o) {
  const s = x < 0 ? -1 : 1, { Hip, ld } = landmarks(s);
  o.axis[0] = 0; o.axis[1] = 1; o.axis[2] = 0;
  let seam = FAR, kind = 0;
  const take = (v, k = 0) => { if (Math.abs(v) < Math.abs(seam)) { seam = v; kind = k; } };
  const rx = x - Hip[0], ry = y - Hip[1], t = rx * ld[0] + ry * ld[1];
  if (y < 77.5) {                                                                // down each leg: inseam towards the front, outseam towards the back
    const a = rad(24), u = [-s * Math.cos(a), 0, Math.sin(a)], nrm = V.norm(V.cross(ld, u)), px = rx - ld[0] * t, py = ry - ld[1] * t;
    take(px * nrm[0] + py * nrm[1] + z * nrm[2]);
    take(t - (HEM_T - 1.0), 1);                                                  // hem stitch
  } else {
    if (z > 3 && x > -0.6 && x < 3 && y > 80.5) take(flySd(x, y), 1);            // fly
    if (y < 81.2 || z < 0) take(x);                                              // centre seam, front below the fly and all the way up the back
    if (z > 1 && Math.abs(x) > 6.2) take((Math.hypot((Math.abs(x) - 12.4) / 5.0, (y - 88.6) / 4.6) - 1) * 4.6, 1);   // front pockets
    if (z < -2 && y < 86.5) take(backPocket(Math.abs(x), y), 1);                 // back pockets
    if (z < -1 && y > 84) take(y - (86.6 + 0.12 * Math.abs(x)), 1);              // back yoke
  }
  o.rib[0] = 1; o.rib[1] = 0; o.rib[2] = 1; o.rib[3] = 0;
  o.seam = seam; o.kind = kind; o.sewn = 1;
}

/* ================= shoes: canvas upper, rubber toe cap and sole, laces ================= */
// Lofted along the foot (v runs from heel to toe, in centimetres from the ankle): the sole is a
// flat-sided slab, the upper a rounded shell on it, highest at the tongue.
export const SHOE = { stripe: 1.95, sole: 2.5 };
const SH = {
  a: curve([[-8.5, 0.6], [-8.0, 2.5], [-6.5, 4.1], [-2, 4.8], [5, 5.4], [10.5, 5.65], [14.5, 5.3], [16.8, 4.1], [17.9, 2.3], [18.3, 0.5]]),
  top: curve([[-8.4, 5.0], [-7.6, 8.6], [-6, 9.0], [-3.5, 7.9], [-1.5, 7.6], [0.5, 9.3], [1.8, 10.1], [3.5, 9.6], [6, 8.4], [8.5, 6.9], [10.5, 5.9], [13, 4.95], [15.5, 3.95], [17.2, 3.1], [18.0, 2.5]]),
};
const capEdge = polygon2([[-5.8, 11.2], [-4.6, 10.0], [-3, 9.15], [-1.5, 8.75], [0, 8.6], [1.5, 8.75], [3, 9.15], [4.6, 10.0], [5.8, 11.2], [5.8, 19], [-5.8, 19]]);
// height of the upper's surface above the ground at (u across, v along)
const upperY = (u, v) => 2.0 + (SH.top(v) - 2.0) * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u) / Math.max(0.3, SH.a(v) - 0.32), 2.5)), 1 / 2.5);
export function shoes(lin) {
  const red = lin('shoe'), white = lin('rubber'), lace = lin('lace'), steel = lin('steel'), p = [];
  for (const [n, s] of SIDES) {
    const { Ankle, ff, fl } = landmarks(s), O = [Ankle[0], 0, Ankle[2]], ax = [fl, ff, Y];
    const at = (u, v, y) => [O[0] + fl[0] * u + ff[0] * v, y, O[2] + fl[2] * u + ff[2] * v];
    const bend = chain(O, ff, [[8.6, `foot-${n}`], [11.6, `toes-${n}`]]);
    const o = (k, color, extra) => ({ bone: bend, k, sigma: 0.9, csig: 0.1, color, ...extra });
    p.push(loft(O, ax, -8.5, 18.3, (v, q) => { q[0] = SH.a(v); q[1] = q[2] = SHOE.sole / 2; q[3] = SHOE.sole / 2; q[4] = 5; }, o(0, white)));
    const upper = loft(O, ax, -8.4, 18.0, (v, q) => { q[0] = Math.max(0.3, SH.a(v) - 0.32); q[1] = SH.top(v) - 2.0; q[2] = 1.2; q[3] = 2.0; q[4] = 2.5; }, o(0.55, red));
    p.push(upper);
    p.push(bounded(patch(upper, 0.24, capEdge, ax, O, 0.1, o(0.12, white, { csig: 0.07 })), at(0, 0, 0).map((q, i) => q - (i === 1 ? 0 : 20)), at(0, 0, 9).map((q, i) => q + (i === 1 ? 0 : 20))));   // rubber toe cap
    p.push(ellipsoid(at(0, 3.6, upperY(0, 3.6) + 0.05), [2.0, 4.2, 0.5], [fl, ff, Y], o(0.3, red.map(q => q * 1.12), { csig: 0.1 })));    // tongue
    p.push(ellipsoid(at(0, -8.0, 4.2), [2.4, 0.5, 2.4], [fl, ff, Y], o(0.2, white, { csig: 0.08 })));                                  // heel patch
    // laces: six rows that cross from eyelet to eyelet
    const rows = [1.5, 2.8, 4.1, 5.4, 6.7, 8.0].map((v, i) => { const hl = 2.2 - i * 0.1; return { v, l: at(-hl, v, upperY(-hl, v) + 0.16), r: at(hl, v, upperY(hl, v) + 0.16), m: at(0, v, upperY(0, v) + 0.34) }; });
    rows.forEach((q, i) => {
      for (const e of [q.l, q.r]) { p.push(cone(e, q.m, 0.27, 0.27, o(0.08, lace, { csig: 0.07 }))); p.push(sphere(e, 0.33, o(0.05, steel, { csig: 0.06 }))); }
      if (i < rows.length - 1) { const n2 = rows[i + 1], mid = V.lerp(q.m, n2.m, 0.5); for (const [a2, b2] of [[q.l, n2.r], [q.r, n2.l]]) { p.push(cone(a2, mid, 0.2, 0.2, o(0.06, lace, { csig: 0.06 }))); p.push(cone(mid, b2, 0.2, 0.2, o(0.06, lace, { csig: 0.06 }))); } }
    });
  }
  return p;
}
export function shoeSurface(x, y, z, nx, ny, nz, o) {
  o.axis[0] = 0; o.axis[1] = 1; o.axis[2] = 0;
  o.rib[0] = 1; o.rib[1] = 0; o.rib[2] = 1; o.rib[3] = 0;
  // the dark line that runs round the rubber sole
  let seam = FAR, kind = 0;
  if (y < 3.2) { seam = y - SHOE.stripe; kind = 2; }
  o.seam = seam; o.kind = kind; o.sewn = 1;
}

/* ================= hands ================= */
export function hand(lin, n, s) {
  const L = landmarks(s), { d: F, N, T: Th, Wr } = L, c = lin('skin'), nail = lin('nail'), p = [], ax = [F, Th, N];
  const at = (u, v, w) => V.at(Wr, F, u, Th, v, N, w);
  const o = (bone, k, sigma, extra) => ({ bone, k, sigma, color: c, ...extra });
  p.push(cone(at(-7, 0, 0), at(-1.0, 0, 0), 2.3, 2.15, o(`forearm-${n}`, 0, 1)));                      // the forearm inside the cuff
  p.push(ellipsoid(at(-0.2, 0, 0.05), [2.6, 2.12, 1.62], ax, o(`forearm-${n}`, 0.8, 0.9)));            // wrist
  p.push(ellipsoid(at(1.2, 0, 0.05), [2.3, 2.3, 1.55], ax, o(`hand-${n}`, 0.9, 0.9)));
  p.push(ellipsoid(at(4.1, 0.05, 0.05), [3.5, 2.92, 1.32], ax, o(`hand-${n}`, 1.1, 0.9)));             // palm: widest at the knuckles
  p.push(ellipsoid(at(5.9, 0.0, -0.1), [1.9, 2.95, 1.2], ax, o(`hand-${n}`, 0.9, 0.9)));
  p.push(ellipsoid(at(3.0, -2.2, 0.45), [2.7, 1.05, 1.15], ax, o(`hand-${n}`, 0.7, 0.9)));             // heel of the hand, little-finger side
  p.push(ellipsoid(at(2.8, 2.05, 0.75), [2.5, 1.45, 1.3], ax, o(`thumb-meta-${n}`, 0.7, 0.7, { weight: 0.7 })));   // ball of the thumb
  const ch = handChains(L);
  for (const [f, k] of Object.entries(ch)) {
    const { pts, dir, n: pn, radii: r, lens } = k, isThumb = f === 'thumb', seg = isThumb ? ['meta', 'prox', 'dist'] : ['prox', 'mid', 'dist'];
    const id = i => (isThumb ? `thumb-${seg[i]}-${n}` : `finger-${f}-${seg[i]}-${n}`), fo = (i, kk = 0.14) => o(id(i), kk, 0.3, { csig: 0.1 });
    const tip = V.add(pts[3], V.mul(dir, -r[3]));
    p.push(cone(pts[0], pts[1], r[0], r[1], fo(0, isThumb ? 0.55 : 0.4)));
    p.push(cone(pts[1], pts[2], r[1], r[2], fo(1)));
    p.push(cone(pts[2], tip, r[2], r[3], fo(2)));
    p.push(sphere(V.add(tip, V.mul(pn, 0.1)), r[3] * 1.04, fo(2, 0.2)));                               // a soft pad at the tip
    if (!isThumb) p.push(sphere(V.add(pts[0], V.mul(pn, -0.22)), r[0] * 1.04, o(`hand-${n}`, 0.4, 0.35, { weight: 0.8 })));   // knuckle
    // nail, on the back of the last segment
    const xa = V.norm(V.cross(dir, pn));
    p.push(ellipsoid(V.add(V.add(pts[2], V.mul(dir, lens[2] * 0.56)), V.mul(pn, -r[3] * 0.86)), [lens[2] * 0.3, r[3] * 0.7, 0.13], [dir, xa, pn], { bone: id(2), k: 0.05, sigma: 0.3, color: nail, csig: 0.07 }));
  }
  return p;
}
export function plainSurface(x, y, z, nx, ny, nz, o) {
  o.axis[0] = 0; o.axis[1] = 1; o.axis[2] = 0; o.rib[0] = 1; o.rib[1] = 0; o.rib[2] = 1; o.rib[3] = 0; o.seam = FAR; o.kind = 0; o.sewn = 1;
}

// shape tables the other characters' clothes are drawn from (outfits.js); nothing here is changed by them
export const BODY = { T, K, J, SH, capEdge, upperY, NECKLINE, LEG_R };
