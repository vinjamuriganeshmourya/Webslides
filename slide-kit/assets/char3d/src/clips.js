// One-shot clips: a move played once from the idle pose and back to it (rig.once(name)).
//
// A clip never writes a pose. It writes OFFSETS from whatever the character is doing at rest:
//   joint(id, deg)       added to the joint's value (the joint's limits still clamp the result)
//   foot(side, x, y, z)  where a foot is placed, in cm from where it stands at rest (the leg follows by IK)
//   root(x, y, z)        where the hips are, in cm from where they are at rest
// Every offset starts at 0 and ends at 0 with zero speed, so going in and coming out cannot jump,
// whatever pose the sliders hold. The feet are placed by the leg IK on the floor (y = 0 is the floor
// under them), the soles kept flat by the ankles, and the balance and the spring bones (hair, hood,
// drawstrings) run as usual on top, so momentum shows in the hair and the cords.
//
// Units: cm, s, degrees. The character faces +z; his right is -x.

const G = 981;                                        // gravity, cm/s²
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const ss = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };                 // smoothstep
const sss = x => { x = clamp(x, 0, 1); return x * x * x * (x * (6 * x - 15) + 10); };  // smootherstep: zero speed and acceleration at both ends

/* Keyframes [t, value, slope?]: cubic Hermite between keys. A key without a slope gets the
   Catmull-Rom slope of its neighbours, the first and last keys get 0; a slope is given where the
   physics fixes it (the speed at take-off, at touch-down). Before the first key and after the last
   the value holds. */
function track(keys) {
  const n = keys.length, m = keys.map((k, i) => (k[2] != null ? k[2] : i === 0 || i === n - 1 ? 0 : (keys[i + 1][1] - keys[i - 1][1]) / (keys[i + 1][0] - keys[i - 1][0])));
  return t => {
    if (t <= keys[0][0]) return keys[0][1];
    if (t >= keys[n - 1][0]) return keys[n - 1][1];
    let i = 0; while (t > keys[i + 1][0]) i++;
    const [t0, p0] = keys[i], [t1, p1] = keys[i + 1], h = t1 - t0, s = (t - t0) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * h * m[i + 1];
  };
}
const keys = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, track(v)]));

/* ================= Parkour: a precision jump, then back to the spot =================
 * A standing precision jump forward, the first move of parkour, as a body really does it:
 *   0.00-0.55  wind-up: hips sink 16 cm, the torso folds over the knees, the arms swing back
 *   0.55-0.78  drive: the legs extend and the arms swing through, the hips leave at 235 cm/s up
 *              and 125 cm/s forward
 *   0.78-1.26  flight, 0.48 s: a true parabola (g = 981 cm/s²), 28 cm up at the top, 60 cm forward;
 *              the knees draw up and the feet reach ahead for the landing
 *   1.26-2.10  landing: toes and heels down together, the hips keep travelling and sink 16 cm as the
 *              legs absorb, arms forward for balance, then up to standing
 *   2.10-4.10  four short steps backwards to the starting spot, arms swinging against the legs
 *   4.10-4.60  settle into the idle pose
 */
const PK = (() => {
  const t0 = 0.78, T = 0.48, t1 = t0 + T, v0 = G * T / 2, vx = 125, zL = 12, D = vx * T;   // take-off, flight time, launch speed, forward speed, hips ahead at take-off
  const zLand = zL + D;                                                                   // 72: the hips at touch-down
  const feetLand = zLand + 4;                                                             // the feet land a little ahead of the hips
  // the feet leave and meet the floor with the hips Y0 below standing: a straight leg reaching 12 cm
  // behind (or 4 cm ahead) still touches, so nothing is pulled down at the moment of take-off
  const Y0 = -1.6;
  const rootY = t => (t < t0 ? preY(t) : t < t1 ? Y0 + v0 * (t - t0) - G * (t - t0) ** 2 / 2 : postY(t));
  const preY = track([[0, 0], [0.12, -1], [0.55, -16], [t0, Y0, v0]]);
  const postY = track([[t1, Y0, -v0], [1.5, -16], [2.1, 0], [4.1, 0]]);
  const preZ = track([[0, 0], [0.55, -3], [t0, zL, vx]]);
  const landZ = track([[t1, zLand, vx], [1.5, zLand + 1], [2.1, zLand]]);          // the hips settle just behind the feet: the balance carries them over, within what the ankles allow
  // the steps back: [start, end, foot, from, to]
  const STEPS = [[2.2, 2.75, 'r', feetLand, 52], [2.6, 3.15, 'l', feetLand, 28], [3.0, 3.55, 'r', 52, 0], [3.4, 3.95, 'l', 28, 0]];
  const footZ = (side, t) => {
    if (t < t0) return 0;
    if (t < t1) return feetLand * sss((t - t0) / T);
    let z = feetLand;
    for (const [a, b, s, from, to] of STEPS) if (s === side && t > a) z = from + (to - from) * sss((t - a) / (b - a));
    return z;
  };
  const stepLift = (side, t) => { let y = 0; for (const [a, b, s] of STEPS) if (s === side && t > a && t < b) y = 5.5 * Math.sin(Math.PI * (t - a) / (b - a)); return y; };
  const rootZ = t => {
    if (t < t0) return preZ(t);
    if (t < t1) return zL + vx * (t - t0);
    if (t < 2.1) return landZ(t);
    // walking back the hips ride between the feet, the landing's extra lean easing out
    const mid = (footZ('r', t) + footZ('l', t)) / 2;
    return mid + (zLand - feetLand) * (1 - sss((t - 2.1) / 0.6));
  };
  const tuck = t => (t > t0 && t < t1 ? 15 * Math.pow(Math.sin(Math.PI * (t - t0) / T), 1.3) : 0);
  // a small bob as each step back takes the weight
  const bob = t => { let y = 0; for (const [a, b] of STEPS) if (t > a && t < b) y -= 1.4 * Math.sin(Math.PI * (t - a) / (b - a)); return y * 0.5; };
  const J = keys({
    'spine-1-bend': [[0, 0], [0.55, 16], [t0, 4], [1.0, 9], [t1, 8], [1.5, 20], [2.1, 2], [2.5, 0], [4.6, 0]],
    'spine-2-bend': [[0, 0], [0.55, 11], [t0, 2], [1.0, 6], [t1, 5], [1.5, 13], [2.1, 1], [2.5, 0], [4.6, 0]],
    'spine-3-bend': [[0, 0], [0.55, 6], [t0, -2], [1.0, 3], [t1, 3], [1.5, 7], [2.1, 0], [4.6, 0]],
    'head-nod': [[0, 0], [0.4, 6], [0.55, 3], [t0, -4], [1.0, 2], [t1, 7], [1.5, 4], [2.1, 0], [4.6, 0]],
    // the arms: back on the wind-up, through and up on the drive, forward through the landing
    'shoulder-forward-r': [[0, 0], [0.55, -48], [t0, 85], [1.0, 105], [t1, 82], [1.5, 62], [2.1, 8], [2.4, 0], [4.6, 0]],
    'shoulder-forward-l': [[0, 0], [0.57, -46], [t0 + 0.02, 82], [1.02, 102], [t1 + 0.02, 80], [1.52, 60], [2.12, 7], [2.42, 0], [4.6, 0]],
    'shoulder-raise-r': [[0, 0], [0.55, -2], [1.0, 10], [1.5, 8], [2.1, 0], [4.6, 0]],
    'shoulder-raise-l': [[0, 0], [0.55, -2], [1.0, 10], [1.5, 8], [2.1, 0], [4.6, 0]],
    'elbow-r': [[0, 0], [0.55, 12], [t0, 6], [1.0, 24], [t1, 18], [1.5, 30], [2.1, 4], [4.6, 0]],
    'elbow-l': [[0, 0], [0.57, 12], [t0 + 0.02, 6], [1.02, 24], [t1 + 0.02, 18], [1.52, 30], [2.12, 4], [4.6, 0]],
    'wrist-r': [[0, 0], [0.55, 10], [t0, -8], [1.5, -6], [2.1, 0], [4.6, 0]],
    'wrist-l': [[0, 0], [0.55, 10], [t0, -8], [1.5, -6], [2.1, 0], [4.6, 0]],
    'lip-corner-r': [[0, 0], [0.55, -4], [1.6, -2], [2.3, 8], [3.2, 6], [4.6, 0]],
    'lip-corner-l': [[0, 0], [0.55, -4], [1.6, -2], [2.3, 8], [3.2, 6], [4.6, 0]],
    'brow-inner-r': [[0, 0], [0.55, -6], [1.6, -3], [2.4, 0], [4.6, 0]],
    'brow-inner-l': [[0, 0], [0.55, -6], [1.6, -3], [2.4, 0], [4.6, 0]],
  });
  return {
    duration: 4.6,
    at(t, P) {
      for (const [id, f] of Object.entries(J)) P.joint(id, f(t));
      // the arms swing against the legs on the steps back
      if (t > 2.15 && t < 4.1) { const sw = Math.sin(Math.PI * (t - 2.2) / 0.4) * Math.sin(Math.PI * clamp((t - 2.15) / 1.95, 0, 1)); P.joint('shoulder-forward-r', 10 * sw); P.joint('shoulder-forward-l', -10 * sw); }
      // the hands close a little in flight and open for the landing
      const grip = 14 * Math.sin(Math.PI * clamp((t - 0.5) / 1.2, 0, 1));
      for (const s of ['r', 'l']) for (const f of ['index', 'middle', 'ring', 'pinky']) { P.joint(`finger-${f}-prox-${s}`, grip); P.joint(`finger-${f}-mid-${s}`, grip * 1.2); }
      P.root(0, rootY(t) + bob(t), rootZ(t));
      for (const s of ['r', 'l']) {
        const fy = t > t0 && t < t1 ? Math.max(0, rootY(t) - Y0 + tuck(t)) : stepLift(s, t);
        P.foot(s, 0, fy, footZ(s, t));
      }
    },
  };
})();

/* ================= Rap Dance: a hip-hop bounce with hand chops =================
 * Eight beats at 92 BPM (0.652 s a beat), in place:
 *   - the knees bounce on every beat (the hips dip 7 cm and come back up), the head nods with them,
 *     a beat behind the hips the chest pops forward
 *   - the weight rocks from foot to foot every two beats; the free foot taps out to the side and
 *     back (a step-touch), so the weight is always over the foot that stands
 *   - beats 1-4 the right hand leads, up in front of the chest, chopping down on the beat; beats 5-8
 *     the left hand takes over; the other arm hangs bent and rides the bounce
 *   - the torso turns and leans into each step, the head turns a little with it
 * It fades in over the first 0.7 s and out over the last 0.8 s.
 */
const RAP = (() => {
  const BEAT = 60 / 92, N = 8, start = 0.45, end = start + N * BEAT, duration = end + 0.75;
  const env = t => sss(t / 0.7) * sss((duration - t) / 0.8);
  const lead = t => sss(((t - start) / BEAT - 3.6) / 0.8);                 // 0 = the right hand leads, 1 = the left
  return {
    duration,
    at(t, P) {
      const E = env(t), b = (t - start) / BEAT;                            // b: beats since the groove began
      const on = x => Math.pow(0.5 + 0.5 * Math.cos(2 * Math.PI * x), 2);  // 1 on the beat, falling quickly away
      const bounce = on(b), late = on(b - 0.18), sway = Math.sin(Math.PI * b), turn = Math.sin(Math.PI * b - 0.6);
      const L = lead(t), R = 1 - L;
      // the body
      P.root(6 * sway * E, -7 * bounce * E, 0);
      P.joint('spine-1-bend', (3 + 3 * bounce) * E); P.joint('spine-3-bend', 5 * late * E);
      P.joint('spine-2-side', 4 * sway * E); P.joint('spine-1-side', 2 * sway * E); P.joint('pelvis-side', -3 * sway * E);
      P.joint('spine-2-turn', 9 * turn * E); P.joint('spine-3-turn', 6 * turn * E); P.joint('pelvis-turn', -5 * turn * E);
      P.joint('head-nod', (11 * late - 3) * E); P.joint('head-turn', 7 * Math.sin(Math.PI * b / 2) * E); P.joint('head-tilt', -3 * sway * E);
      // the step-touch: the foot away from the weight taps out and back, two beats a side
      const half = ((b % 2) + 2) % 2, tap = Math.sin(Math.PI * half / 2) ** 2;       // 0 -> 1 -> 0 over two beats
      const side = Math.floor(b / 2) % 2 === 0 ? 'r' : 'l', sg = side === 'r' ? -1 : 1;
      for (const s of ['r', 'l']) {
        const k = s === side && b > 0 && b < N ? 1 : 0, lift = 3.5 * Math.sin(Math.PI * half) ** 2;
        P.foot(s, sg * 15 * tap * k * E, lift * k * E, 3 * tap * k * E);
      }
      // the arms: the lead hand up in front of the chest, chopping on the beat; the other hangs bent
      const chop = on(b + 0.05);
      const arm = (s, w) => {
        // lead: the upper arm out and forward, the forearm across in front of the chest, the hand chopping down on the beat
        P.joint(`shoulder-forward-${s}`, (w * (40 + 6 * chop) + (1 - w) * 12) * E);
        P.joint(`shoulder-raise-${s}`, (w * (26 - 4 * chop) + (1 - w) * 3) * E);
        P.joint(`elbow-${s}`, (w * (68 - 22 * chop) + (1 - w) * (44 + 10 * bounce)) * E);
        P.joint(`wrist-${s}`, (w * (-22 * chop + 8) + (1 - w) * 4) * E);
        P.joint(`forearm-twist-${s}`, (w * 20) * E);
        const curl = w * 0.4 + (1 - w) * 0.8;                          // a loose fist on the hanging hand, a flatter hand chopping
        for (const f of ['middle', 'ring', 'pinky']) { P.joint(`finger-${f}-prox-${s}`, 55 * curl * E); P.joint(`finger-${f}-mid-${s}`, 65 * curl * E); P.joint(`finger-${f}-dist-${s}`, 30 * curl * E); }
        P.joint(`finger-index-prox-${s}`, 20 * (1 - w) * E); P.joint(`finger-index-mid-${s}`, 25 * (1 - w) * E);
        P.joint(`thumb-prox-${s}`, 15 * E); P.joint(`thumb-dist-${s}`, 10 * E);
      };
      arm('r', R); arm('l', L);
      // the face: a little attitude
      P.joint('lip-corner-r', 9 * E); P.joint('lip-corner-l', 4 * E); P.joint('brow-r', 2 * E);
    },
  };
})();

export const CLIPS = { parkour: PK, rap: RAP };
