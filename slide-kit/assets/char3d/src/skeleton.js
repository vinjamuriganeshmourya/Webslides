// The skeleton in its bind pose. Units are centimetres, the ground is y = 0, the character
// faces +z and its left side is +x. Arms are bound 50 degrees out from the body (an "A" pose):
// that keeps each sleeve clear of the torso while the mesh is built and its weights are worked out.
//
// Every bone has a frame: local Y runs along the bone, local X is the hinge axis and local Z
// completes it (X = Y x hint, Z = X x Y). Joint angles are rotations about those local axes.
import { V } from './sdf.js';
import { cast } from './cast.js';

export const ARM_BIND = 50, LEG_BIND = 4.8;
const STEPS = [1, 2, 3], TWISTS = 4;
export const STRING_X = 2.6, STRING_Y = 127.2, STRING_Z = 8.0;          // where the drawstrings leave the collar
const rad = d => d * Math.PI / 180;
export const SIDES = [['r', -1], ['l', 1]];

// landmarks for one side (s = -1 right, +1 left)
export function landmarks(s) {
  const d = [s * Math.sin(rad(ARM_BIND)), -Math.cos(rad(ARM_BIND)), 0];           // arm direction
  const N = [-s * Math.cos(rad(ARM_BIND)), -Math.sin(rad(ARM_BIND)), 0];          // palm normal: faces the body
  const T = [0, 0, 1];                                                            // thumb side: forward
  const Sh = [s * 12.2, 124.8, -0.5], El = V.add(Sh, V.mul(d, 21)), Wr = V.add(El, V.mul(d, 20.3));
  const ld = [s * Math.sin(rad(LEG_BIND)), -Math.cos(rad(LEG_BIND)), 0];
  const Hip = [s * 6.35, 79.7, 0], Knee = V.add(Hip, V.mul(ld, 33)), Ankle = V.add(Knee, V.mul(ld, 34.3));
  const toeOut = rad(8), ff = [s * Math.sin(toeOut), 0, Math.cos(toeOut)], fl = [Math.cos(toeOut), 0, -s * Math.sin(toeOut)];   // foot forward, foot sideways
  const Ball = [Ankle[0] + ff[0] * 10.6, 2.4, Ankle[2] + ff[2] * 10.6], Toe = [Ankle[0] + ff[0] * 17, 2.2, Ankle[2] + ff[2] * 17];
  return { s, d, N, T, Sh, El, Wr, ld, Hip, Knee, Ankle, ff, fl, Ball, Toe };
}

// fingers: knuckle position on the hand (u along the hand, v towards the thumb), three lengths, four radii, splay
export const FINGERS = [
  ['index', [7.05, 2.13], [2.75, 1.75, 1.5], [0.71, 0.68, 0.65, 0.61], 5],
  ['middle', [7.35, 0.71], [3.0, 1.95, 1.6], [0.73, 0.70, 0.67, 0.62], 1],
  ['ring', [7.05, -0.71], [2.8, 1.8, 1.5], [0.70, 0.67, 0.64, 0.59], -4],
  ['pinky', [6.4, -2.1], [2.2, 1.45, 1.25], [0.63, 0.60, 0.57, 0.53], -10],
];
export const THUMB = { base: [1.7, 2.35, 0.6], lens: [3.1, 2.7, 2.25], radii: [1.02, 0.95, 0.9, 0.82] };

// world points of one hand's finger chains: { name: { pts:[p0..p3], dir, x (flex axis), n (palm side) } }
export function handChains(L) {
  const { d: F, N, T, Wr } = L, out = {};
  for (const [name, [u, v], lens, radii, splay] of FINGERS) {
    const a = rad(splay), dir = V.norm(V.add(V.mul(F, Math.cos(a)), V.mul(T, Math.sin(a))));
    const p0 = V.at(Wr, F, u, T, v, N, -0.05), pts = [p0];
    lens.forEach((l, i) => pts.push(V.add(pts[i], V.mul(dir, l))));
    out[name] = { pts, dir, n: N, radii, lens };
  }
  // the thumb leaves the heel of the hand, forward and a little towards the palm; its pad faces the fingers
  const dir = V.norm(V.at([0, 0, 0], F, Math.cos(rad(30)), T, Math.sin(rad(30)) * Math.cos(rad(30)), N, Math.sin(rad(30)) * Math.sin(rad(30))));
  let n = V.norm(V.add(V.mul(N, 0.62), V.mul(T, -0.78)));
  n = V.norm(V.sub(n, V.mul(dir, V.dot(n, dir))));
  const p0 = V.at(Wr, F, THUMB.base[0], T, THUMB.base[1], N, THUMB.base[2]), pts = [p0];
  THUMB.lens.forEach((l, i) => pts.push(V.add(pts[i], V.mul(dir, l))));
  out.thumb = { pts, dir, n, radii: THUMB.radii, lens: THUMB.lens };
  return out;
}

// The crown: every lock of hair grows from here.
export const CROWN = [1.5, 163.0, 0.6];
// hair locks over the forehead: where each one is widest, and its tip (measured on the reference)
// (0.6 to 0.9 cm lower than they measure in the picture: they are nearer the camera than the crown is)
export const FRINGE = [
  [[-8.6, 153.8, 6.2], [-8.6, 150.0, 6.6]],
  [[-3.9, 154.0, 10.6], [-5.0, 148.95, 10.15]],
  [[1.1, 154.1, 11.3], [-0.3, 148.55, 10.55]],
  [[5.5, 153.7, 10.5], [5.6, 149.15, 10.0]],
  [[8.7, 153.4, 6.6], [8.7, 150.5, 6.7]],
];

export function boneSpecs() {
  const up = [0, 1, 0], fw = [0, 0, 1], dn = [0, -1, 0];
  const B = [];
  const b = (name, parent, pos, dir, hint) => B.push({ name, parent, pos, dir: V.norm(dir), hint });
  // a character with a longer neck carries the head higher: every bone from the head up moves by headDY
  const hd = cast().headDY || 0, H = p => (hd ? [p[0], p[1] + hd, p[2]] : p);
  b('root', null, [0, 0, 0], up, fw);
  b('pelvis', 'root', [0, 84, 0], up, fw);
  b('spine-1', 'pelvis', [0, 89, 0], up, fw);
  b('spine-2', 'spine-1', [0, 103.5, 0], up, fw);
  b('spine-3', 'spine-2', [0, 115.5, 0], up, fw);
  b('hem', 'spine-1', [0, 91, 0], dn, fw);
  b('neck-1', 'spine-3', [0, 130.5, -0.6], up, fw);
  b('neck-2', 'neck-1', hd ? [0, 134.5 + hd * 0.5, -0.3] : [0, 134.5, -0.3], up, fw);
  b('head', 'neck-2', H([0, 138.6, 0.2]), up, fw);
  b('jaw', 'head', H([0, 143.5, -0.5]), [0, -0.75, 0.66], dn);
  b('hair-top', 'head', H([0.3, 163.0, 0.4]), [0.42, 0.9, 0.1], fw);
  FRINGE.forEach(([m, t], i) => b(`hair-front-${i + 1}`, 'head', H(V.lerp(CROWN, m, 0.55)), V.sub(t, V.lerp(CROWN, m, 0.55)), [1, 0, 0]));
  b('hair-back', 'head', H([0, 147, -8.4]), dn, [1, 0, 0]);
  b('hood', 'spine-3', [0, 131, -4.5], [0, -0.85, -0.5], [1, 0, 0]);
  for (const [n, s] of SIDES) {
    const L = landmarks(s);
    b(`ear-${n}`, 'head', H([s * 9.2, 145.2, -0.6]), [s, 0, 0], up);
    b(`hair-side-${n}`, 'head', H([s * 11.2, 155, 1.5]), dn, fw);
    for (let i = 0; i < 3; i++) b(`drawstring-${n}-${i + 1}`, i ? `drawstring-${n}-${i}` : 'spine-3', [s * STRING_X, STRING_Y - i * 3.7, STRING_Z], dn, fw);
    b(`clavicle-${n}`, 'spine-3', [s * 2.2, 126.6, 0.6], V.sub(L.Sh, [s * 2.2, 126.6, 0.6]), fw);
    for (const i of STEPS) b(`shoulder-${n}-h${i}`, `clavicle-${n}`, L.Sh, L.d, fw);      // helpers: a quarter, a half, three quarters of the arm's swing
    b(`upper-arm-${n}`, `clavicle-${n}`, L.Sh, L.d, fw);
    for (let i = 0; i < TWISTS; i++) b(`upper-arm-${n}-t${i}`, `upper-arm-${n}`, L.Sh, L.d, fw);   // twist bones: the sleeve turns a little more at each one
    for (const i of STEPS) b(`elbow-${n}-h${i}`, `upper-arm-${n}`, L.El, L.d, fw);
    b(`forearm-${n}`, `upper-arm-${n}`, L.El, L.d, fw);
    for (let i = 0; i < TWISTS; i++) b(`forearm-${n}-t${i}`, `forearm-${n}`, L.El, L.d, fw);
    b(`cuff-${n}`, `forearm-${n}`, V.add(L.Wr, V.mul(L.d, -4.2)), L.d, fw);
    b(`hand-${n}`, `forearm-${n}`, L.Wr, L.d, L.N);
    const ch = handChains(L);
    for (const f of ['index', 'middle', 'ring', 'pinky']) ['prox', 'mid', 'dist'].forEach((seg, i) => b(`finger-${f}-${seg}-${n}`, i ? `finger-${f}-${['prox', 'mid'][i - 1]}-${n}` : `hand-${n}`, ch[f].pts[i], ch[f].dir, ch[f].n));
    ['meta', 'prox', 'dist'].forEach((seg, i) => b(`thumb-${seg}-${n}`, i ? `thumb-${['meta', 'prox'][i - 1]}-${n}` : `hand-${n}`, ch.thumb.pts[i], ch.thumb.dir, ch.thumb.n));
    for (const i of STEPS) b(`hip-${n}-h${i}`, 'pelvis', L.Hip, L.ld, [0, 0, -1]);
    b(`thigh-${n}`, 'pelvis', L.Hip, L.ld, [0, 0, -1]);
    for (let i = 0; i < 3; i++) b(`thigh-${n}-t${i}`, `thigh-${n}`, L.Hip, L.ld, [0, 0, -1]);
    for (const i of STEPS) b(`knee-${n}-h${i}`, `thigh-${n}`, L.Knee, L.ld, [0, 0, -1]);
    b(`shin-${n}`, `thigh-${n}`, L.Knee, L.ld, [0, 0, -1]);
    b(`foot-${n}`, `shin-${n}`, L.Ankle, V.sub(L.Ball, L.Ankle), dn);
    b(`toes-${n}`, `foot-${n}`, L.Ball, V.sub(L.Toe, L.Ball), dn);
  }
  // frames
  for (const s of B) { s.x = V.norm(V.cross(s.dir, s.hint)); s.z = V.cross(s.x, s.dir); }
  return B;
}

/* Helper bones. Linear skinning thins a surface wherever two neighbouring bones differ by a large
 * angle, so no two neighbours may differ by much:
 *   swing helpers  shoulder-*-h1..3, elbow-*, hip-*, knee-*: 25, 50 and 75 % of the limb's bend (its twist left out)
 *   twist bones    upper-arm-*-t0..3, forearm-*-t0..3, thigh-*-t0..2: 0, 25, 50, 75 % of the limb's twist
 * The limb's own bone carries all of both. A sleeve therefore bends over a curve and twists like cloth. */
export const HELPERS = SIDES.flatMap(([n]) => [
  ...[[`shoulder-${n}`, `upper-arm-${n}`], [`elbow-${n}`, `forearm-${n}`], [`hip-${n}`, `thigh-${n}`], [`knee-${n}`, `shin-${n}`]].flatMap(([h, of]) => STEPS.map(i => ({ bone: `${h}-h${i}`, of, swing: i / 4 }))),
  ...[[`upper-arm-${n}`, TWISTS], [`forearm-${n}`, TWISTS], [`thigh-${n}`, 3]].flatMap(([of, k]) => Array.from({ length: k }, (_, i) => ({ bone: `${of}-t${i}`, of, twist: i / k }))),
]);

// where each bone's weight sits along a limb, in centimetres from the shoulder or the hip: [distance, bone]
export function limbNodes(n) {
  const arm = [[-3.2, `clavicle-${n}`], [-1.6, `shoulder-${n}-h1`], [0, `shoulder-${n}-h2`], [1.6, `shoulder-${n}-h3`],
    [3.4, `upper-arm-${n}-t0`], [7, `upper-arm-${n}-t1`], [10.5, `upper-arm-${n}-t2`], [14, `upper-arm-${n}-t3`], [17.4, `upper-arm-${n}`],
    [19.4, `elbow-${n}-h1`], [21, `elbow-${n}-h2`], [22.6, `elbow-${n}-h3`],
    [24.6, `forearm-${n}-t0`], [28.2, `forearm-${n}-t1`], [31.8, `forearm-${n}-t2`], [35.4, `forearm-${n}-t3`], [38.8, `forearm-${n}`]];
  const leg = [[-3, 'pelvis'], [-1.5, `hip-${n}-h1`], [0, `hip-${n}-h2`], [1.5, `hip-${n}-h3`],
    [3.5, `thigh-${n}-t0`], [12, `thigh-${n}-t1`], [21, `thigh-${n}-t2`], [29.4, `thigh-${n}`],
    [31.4, `knee-${n}-h1`], [33, `knee-${n}-h2`], [34.6, `knee-${n}-h3`], [36.8, `shin-${n}`]];
  return { arm, leg };
}
