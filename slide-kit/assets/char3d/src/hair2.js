// The other characters' heads and hair (cast.js). The first character's are in headmodel.js and are
// not touched by anything here.
//
// Head: the same lofted skull as the first character's. The front outline is each character's own,
// measured on his picture row by row; the side profile and the cross-section are the first character's,
// slid along the height so that chin, eyes and crown land on this character's.
// Hair: the same sculpted clumps (makeLock in headmodel.js) lying on a dome of this character's size.
import { V, cone, ellipsoid, rbox, loft, curve } from './sdf.js';
import { SIDES } from './skeleton.js';
import { SKULL, makeLock, dome, hairSurface } from './headmodel.js';
import { cast, castName } from './cast.js';

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], IDENT = [X, Y, Z];
const rad = d => d * Math.PI / 180;
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// piecewise-linear map through landmark pairs [[from, to], ...] (ascending)
const through = pairs => y => {
  if (y <= pairs[0][0]) return pairs[0][1] + (y - pairs[0][0]);
  for (let i = 0; i < pairs.length - 1; i++) if (y <= pairs[i + 1][0]) { const [a, b] = pairs[i], [c, d] = pairs[i + 1]; return b + (y - a) / (c - a) * (d - b); }
  const [a, b] = pairs[pairs.length - 1]; return b + (y - a);
};

/* ================= head ================= */
// The chin is nearer the camera than the middle of the head, so in the picture it sits higher than it is:
// knots below the mouth move down, most at the chin (0.7 cm), as the first character's do.
function lowered(knots, mouth, k = 0.7) { return knots.map(([y, v]) => [y - k * Math.max(0, Math.min(1, (mouth - y) / 5)), v]); }

function skullCurves() {
  const h = cast().head, f = cast().face, mouth = f.mouth.y + 0.8;
  const lo = h.low ?? 0.7, a = curve(lowered(h.a, mouth, lo)), chin = h.chin - lo;
  // this character's height -> the first character's: chin, mouth, eyes, crown
  const toFirst = through([[chin, 135.9], [f.mouth.y, 140.75], [h.eye, 146.6], [h.crown, 161.5]]);
  const M = SKULL.H(), MF = SKULL.FACE(), wk = h.depth ?? 1;
  return {
    chin, crown: h.crown, a,
    zf: y => MF.zf(toFirst(y)) * wk, zb: y => M.zb(toFirst(y)) * wk, z0: y => M.z0(toFirst(y)) * wk, n: y => MF.n(toFirst(y)),
  };
}

export function castHead() {
  const C = cast(), h = C.head, f = C.face, S = skullCurves(), dc = h.chin - 136.6, dy = C.headDY || 0, p = [], c = [1, 1, 1];
  const o = (bone, k, sigma, extra) => ({ bone, k, sigma, color: c, ...extra });
  const prof = (y, out) => { const z0 = S.z0(y); out[0] = S.a(y); out[1] = S.zf(y) - z0; out[2] = z0 - S.zb(y); out[3] = z0; out[4] = S.n(y); };
  // the lower front of the face follows the jaw bone
  const skull = (x, y, z, add) => { const j = sstep(141.9 + dc, 139.3 + dc, y) * sstep(1.0, 4.5, z) * 0.92; add('jaw', j); add('head', 1 - j); };
  p.push(loft([0, 0, 0], IDENT, S.chin, S.crown, prof, o(skull, 0, 2)));
  // the underside of the jaw: one clean plane, rising from the chin back to the neck
  const up = V.norm([0, 1, 0.43]), fw = V.cross(X, up);
  p.push(rbox(V.sub([0, 136.0 + dc, 8.3], V.mul(up, 10)), [14, 10, 16], 0, [X, up, fw], { op: 'sub', k: 1.1 }));
  const shade = { color: [0.76, 0.58, 0.53], csig: 0.5 };                                         // the neck sits in the jaw's shade
  p.push(cone([0, 126.5, -0.6], [0, 133 + dy * 0.5, -0.2], 3.2, 3.15, o('neck-1', 1.4, 1.6, shade)));
  p.push(cone([0, 133 + dy * 0.5, -0.2], [0, 140.2 + dc, 0.8], 3.15, 3.25, o('neck-2', 1.4, 1.6, shade)));
  // the nose: modelled where the drawing puts its shade, standing a little out of the face
  const ny = f.nose.y - 0.2;
  p.push(ellipsoid([0, ny, S.zf(ny) + 0.24], h.nose.r, undefined, o('head', 1.0, 2)));
  for (const [n, s] of SIDES) {
    const a = rad(h.ear.turn ?? 28), b = rad(h.ear.tilt), w = [s * Math.cos(a), 0, -Math.sin(a)], t = [s * Math.sin(a), 0, Math.cos(a)];
    const eu = V.norm(V.add(V.mul(Y, Math.cos(b)), V.mul(w, Math.sin(b)))), w2 = V.cross(eu, t), ctr = [s * h.ear.ctr[0], h.ear.ctr[1], h.ear.ctr[2]];
    p.push(ellipsoid(ctr, h.ear.r, [w2, eu, t], o(`ear-${n}`, 0.6, 0.8, { color: [0.97, 0.86, 0.82], csig: 0.35 })));
    p.push(ellipsoid(V.at(ctr, w2, 0.3, eu, 0.15, t, 0.62), [h.ear.r[0] * 0.45, h.ear.r[1] * 0.5, 0.3], [w2, eu, t], { op: 'sub', k: 0.4 }));
  }
  return p;
}

/* ================= hair ================= */
// picture (column, row) -> model x, y for this character; z is chosen (the pictures are front views)
const PIC = {
  sporty: (c, r) => [(c - 535) * 0.1222, 170.8 - 0.1222 * r],
  varsity: (c, r) => [(c - 536) * 0.1222, 172.55 - 0.1222 * r],
};

const STYLES = {
  /* Messy wavy hair, dark brown. Measured outline: 29 cm across at its widest (151 to 157), rounding to
   * 21 cm at 163.5 and a narrow top at 167. A heavy fringe sweeps from the left of the crown over the
   * forehead to the right brow in pointed locks, leaving one window of forehead open left of centre;
   * curls flick out at both sides; locks come down in front of the ears to 146, thin ones below them. */
  sporty: {
    dome: dome([0, 154.4, -2.2], [13.4, 12.2, 13.4], 2.4),
    crown: [0.4, 166.2, -3.0],
    face: { at: [0.6, 140.6, 11.0], half: [7.4, 8.8, 5.8], r: 2.4 },
    line: { at: [0, 148.6, 2.6] },
    holes: [[[4.0, 154.6, 10.8], [2.5, 3.0, 3.2]]],                        // the window of forehead
    capIn: 1.7,
    locks(lock) {
      const cl = { pillow: 2.6, th: 1.85 };
      // the fringe
      lock([-6.5, 160.5, 10.6], [-10.4, 151.4, 8.6], 3.0, 'hair-front-1', { ...cl, hook: [-9.6, 155.4, 10.4], tilt: 0.3, root: [-1.0, 165.2, 5.0] });
      lock([-3.0, 160.8, 11.8], [-6.6, 151.6, 11.2], 3.2, 'hair-front-2', { ...cl, hook: [-5.6, 155.6, 12.4], tilt: -0.3, root: [1.0, 166.0, 4.0] });
      lock([0.4, 160.6, 12.2], [-2.0, 151.8, 11.8], 2.8, 'hair-front-3', { ...cl, hook: [-1.4, 155.4, 12.6], tilt: 0.3, root: [3.0, 166.0, 3.0] });
      lock([2.6, 159.8, 12.0], [1.0, 151.4, 11.4], 0.8, 'hair-front-4', { th: 0.7, pillow: 2.4, hook: [1.8, 155.0, 12.2], tilt: 0.1, root: [5.0, 165.0, 4.0] });   // a thin strand
      lock([7.6, 163.4, 10.0], [12.4, 159.4, 8.4], 3.0, 'hair-front-5', { ...cl, hook: [10.8, 161.2, 9.8], tilt: -0.3, root: [2.0, 166.2, 3.0] });             // swept up off the left forehead
      // the top: waves rising from the front and rolling back over the crown
      lock([-3.0, 167.6, 5.0], [-6.4, 165.4, -6.0], 3.6, 'hair-top', { ...cl, hook: [-5.2, 167.8, -1.4], tilt: 0.3, root: [-1.0, 164.0, 9.6] });
      lock([4.2, 167.8, 4.4], [7.8, 165.2, -6.4], 3.6, 'head', { ...cl, hook: [6.4, 167.8, -1.8], tilt: -0.3, root: [3.6, 164.2, 9.4] });
      lock([0.6, 168.0, 0.4], [-1.6, 165.2, -10.4], 3.4, 'hair-top', { ...cl, hook: [-0.6, 167.6, -5.8], tilt: 0.25, root: [0.8, 166.0, 7.0] });
      lock([-8.6, 165.8, 3.6], [-12.6, 163.6, -4.8], 3.2, 'head', { ...cl, hook: [-11.6, 165.6, -0.8], tilt: -0.25, root: [-5.6, 163.2, 8.6] });
      lock([9.4, 165.6, 2.8], [13.0, 163.2, -5.2], 3.2, 'head', { ...cl, hook: [12.0, 165.2, -1.4], tilt: 0.25, root: [6.8, 163.6, 8.0] });
      for (const [n, s] of SIDES) {
        // the sides: curls flicking out at the widest part
        lock([s * 12.4, 159.4, 3.6], [s * 15.4, 153.4, 2.6], 3.0, `hair-side-${n}`, { ...cl, hook: [s * 14.4, 155.0, 4.0], tilt: s * 0.25, root: [s * 6.0, 165.0, 0] });
        lock([s * 12.8, 158.4, -2.8], [s * 15.0, 151.6, -3.6], 3.2, `hair-side-${n}`, { ...cl, hook: [s * 14.2, 153.4, -2.2], tilt: -s * 0.2, root: [s * 5.0, 164.6, -5.0] });
        lock([s * 11.6, 156.8, -8.4], [s * 13.6, 149.8, -8.8], 3.2, 'hair-back', { ...cl, hook: [s * 13.0, 151.6, -7.6], tilt: s * 0.2, root: [s * 4.0, 163.6, -9.0] });
        // down in front of the ear, and thin locks below it
        lock([s * 11.0, 155.5, 5.8], [s * 9.8, 146.2, 6.6], 2.0, `hair-side-${n}`, { ...cl, th: 1.1, hook: [s * 10.8, 149.6, 7.0], tilt: s * 0.2, root: [s * 7.0, 163.0, 5.0] });
        lock([s * 10.6, 151.0, -2.6], [s * 9.6, 141.2, -1.6], 1.2, `hair-side-${n}`, { th: 0.85, pillow: 2.4, hook: [s * 10.4, 145.0, -1.8], tilt: 0, root: [s * 10.0, 157.6, -3.0] });
        // the back
        lock([s * 7.8, 156.0, -12.6], [s * 9.4, 144.6, -11.0], 3.4, 'hair-back', { ...cl, hook: [s * 9.6, 148.0, -12.2], tilt: -s * 0.15, root: [s * 3.0, 163.0, -10.0] });
      }
      lock([0, 155.4, -15.0], [0.4, 143.4, -13.0], 3.6, 'hair-back', { ...cl, hook: [0.4, 146.8, -14.4], tilt: 0.12, root: [0, 163.0, -11.0] });
    },
  },
  /* A side-swept quiff, dark brown. Measured outline: 28 cm across at 158, 22 cm at 165, the top at
   * 170.7. The forehead is open from 159.4 down to the brows, right of centre; the quiff rises over it
   * and turns over to the right, one lock curling down onto the forehead; the sides are short, with a
   * sideburn in front of each ear down to 148. */
  varsity: {
    dome: dome([-0.6, 158.4, -1.8], [13.2, 12.0, 13.2], 2.4),
    crown: [0.4, 169.6, -3.0],
    face: { at: [0.8, 148.6, 11.4], half: [7.2, 8.6, 5.8], r: 2.2 },
    line: { at: [0, 152.6, 2.6] },
    holes: [],
    capIn: 2.2,
    locks(lock) {
      const cl = { pillow: 2.6, th: 2.0 };
      // the quiff: from the hairline up, rolling back over the top and turning to the right
      // (the roots lie inside the scalp at the hairline, so no blunt end shows)
      lock([-1.4, 166.0, 9.8], [-5.8, 169.4, -2.4], 4.4, 'hair-front-3', { ...cl, hook: [-3.2, 170.8, 3.6], tilt: 0.3, root: [-1.6, 158.8, 7.6] });
      lock([3.0, 166.2, 9.6], [-1.4, 170.0, -3.2], 4.2, 'hair-front-2', { ...cl, hook: [0.8, 171.0, 3.2], tilt: -0.3, root: [2.6, 159.2, 7.4] });
      lock([7.4, 165.4, 8.4], [3.4, 169.4, -3.8], 3.6, 'hair-front-4', { ...cl, hook: [5.6, 169.8, 2.8], tilt: 0.3, root: [6.4, 158.8, 6.8] });
      lock([-7.4, 165.4, 8.6], [-13.4, 164.6, 1.0], 3.6, 'head', { ...cl, hook: [-11.0, 167.4, 4.4], tilt: -0.3, root: [-5.2, 158.6, 6.8] });
      lock([-3.6, 162.4, 12.0], [-3.2, 155.2, 10.8], 1.6, 'hair-front-1', { th: 1.15, pillow: 2.4, hook: [-4.8, 158.6, 11.6], tilt: 0.25, root: [-1.0, 166.0, 11.4] });   // the curl on the forehead
      lock([11.2, 163.6, 6.4], [10.6, 168.4, 0.4], 3.0, 'hair-front-5', { ...cl, hook: [11.8, 166.8, 3.6], tilt: -0.25, root: [8.6, 158.4, 5.4] });
      // the top and the crown, back to the nape
      lock([-5.6, 170.0, -5.0], [-10.0, 162.0, -11.0], 3.6, 'hair-top', { ...cl, hook: [-8.6, 166.6, -9.4], tilt: 0.3, root: [0, 170.4, 2.0] });
      lock([5.8, 169.8, -5.0], [10.0, 162.0, -11.0], 3.6, 'head', { ...cl, hook: [8.6, 166.6, -9.4], tilt: -0.3, root: [0, 170.4, 2.0] });
      for (const [n, s] of SIDES) {
        lock([s * 12.8, 161.4, 0], [s * 14.0, 154.6, -0.6], 3.2, `hair-side-${n}`, { ...cl, hook: [s * 14.2, 157.0, 0.6], tilt: s * 0.2, root: [s * 5.0, 167.0, -3.0] });
        lock([s * 12.2, 159.6, -6.8], [s * 13.2, 152.8, -7.4], 3.2, 'hair-back', { ...cl, hook: [s * 13.4, 155.0, -6.4], tilt: -s * 0.2, root: [s * 4.0, 166.0, -9.0] });
        lock([s * 11.0, 158.0, 5.0], [s * 9.2, 148.4, 5.2], 1.6, `hair-side-${n}`, { ...cl, th: 0.9, hook: [s * 10.4, 152.0, 5.4], tilt: s * 0.2, root: [s * 8.0, 164.0, 4.0] });   // the sideburn
        lock([s * 7.6, 158.4, -12.4], [s * 8.6, 149.6, -11.0], 3.4, 'hair-back', { ...cl, hook: [s * 9.0, 152.0, -12.0], tilt: -s * 0.15, root: [s * 3.0, 166.0, -10.0] });
      }
      lock([0, 158.4, -14.6], [0.3, 148.6, -12.8], 3.6, 'hair-back', { ...cl, hook: [0.3, 151.6, -14.2], tilt: 0.12, root: [0, 166.0, -11.0] });
    },
  },
};
export const hairStyle = () => STYLES[cast().hair || castName()];
export { PIC };

export function castLocks() {
  const st = hairStyle(), L = [];
  const lock = (mid, tip, w, bone, o = {}) => L.push(makeLock({ root: o.root || st.crown, mid, tip, w, bone, id: L.length, shade: 1, dome: st.dome, ...o }));
  st.locks(lock);
  return L;
}

export function castHair(lin, L) {
  const st = hairStyle(), D = st.dome, base = lin('hair'), p = [];
  const o = (bone, k, sigma, color = base) => ({ bone, k, sigma, color, csig: 0.45 });
  // the cap under the locks, opened over the face and round the ears and the neck
  const [HC, HR, HN] = [D.C, D.R, D.N];
  const ci = st.capIn ?? 0.8, sup = (y, out) => { const f = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(y - HC[1]) / (HR[1] - ci + 0.2), HN)), 1 / HN); out[0] = (HR[0] - ci) * f; out[1] = out[2] = (HR[2] - ci) * f; out[3] = HC[2]; out[4] = HN; };
  p.push(loft([HC[0], 0, 0], IDENT, HC[1] - HR[1] + ci - 0.18, HC[1] + HR[1] - ci + 0.18, sup, o('head', 0, 2)));      // the cap under the locks, `capIn` inside their surface
  p.push(rbox(st.face.at, st.face.half, st.face.r, undefined, { op: 'sub', k: 0.9 }));                       // the face
  const ny = V.norm([0, 1, -0.52]), nz = V.norm([0, 0.52, 1]);
  p.push(rbox(V.sub(st.line.at, V.mul(ny, 12)), [16, 12, 22], 0, [X, ny, nz], { op: 'sub', k: 1.0 }));      // below the hairline: higher at the temples, lower at the nape
  const dy = cast().headDY || 0;
  p.push(cone([0, 126 + dy, 0], [0, 141.5 + dy, -0.4], 5.2, 5.7, { op: 'sub', k: 1.0 }));
  for (const [c, r] of st.holes || []) p.push(ellipsoid(c, r, undefined, { op: 'sub', k: 0.8 }));
  for (const l of L) p.push({ op: 'add', k: 0.45, sigma: 1.3, csig: 0.45, bone: l.bone === 'head' ? 'head' : l.weights, color: base.map(v => Math.min(1, v * l.shade)), sd: l.sd, lo: l.lo, hi: l.hi });
  return p;
}
export const castHairSurface = L => hairSurface(L, hairStyle().crown);
