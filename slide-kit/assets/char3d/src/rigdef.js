// Rig data: every joint with its limits, the couplings, IK chains and physics values. Becomes rig.json.
//
// A joint turns one bone about one of its local axes (x = hinge, y = along the bone, z = the third).
// The value is anatomical and means the same on both sides; `k` maps it to the local rotation and
// `bind` is the value the mesh was built at (arms are bound 50 degrees out from the body).
import { SIDES, ARM_BIND, LEG_BIND, landmarks } from './skeleton.js';

export function rigData() {
  const joints = [];
  const J = (id, group, label, bone, axis, k, min, max, o = {}) => joints.push({ id, group, label, bone, axis, k, min, max, default: o.def ?? 0, bind: o.bind ?? 0, unit: 'deg' });
  const F = (id, label, min, max, unit, def = 0) => joints.push({ id, group: 'Head', label, face: true, min, max, default: def, bind: 0, unit });
  const xyz = (bone, group, label, lim, names = ['bend', 'turn', 'side']) => {
    J(`${bone}-${names[0]}`, group, `${label} ${names[0]}`, bone, 'x', 1, lim[0][0], lim[0][1]);
    J(`${bone}-${names[1]}`, group, `${label} ${names[1]}`, bone, 'y', 1, lim[1][0], lim[1][1]);
    J(`${bone}-${names[2]}`, group, `${label} ${names[2]}`, bone, 'z', -1, lim[2][0], lim[2][1]);
  };
  const sway = (bone, group, label, lim) => { J(`${bone}-x`, group, `${label} swing`, bone, 'x', 1, -lim, lim); J(`${bone}-z`, group, `${label} sway`, bone, 'z', 1, -lim, lim); };

  /* ----- head ----- */
  xyz('neck-1', 'Head', 'Neck lower', [[-12, 12], [-20, 20], [-10, 10]], ['nod', 'turn', 'tilt']);
  xyz('neck-2', 'Head', 'Neck upper', [[-12, 12], [-20, 20], [-10, 10]], ['nod', 'turn', 'tilt']);
  xyz('head', 'Head', 'Head', [[-25, 25], [-30, 30], [-15, 15]], ['nod', 'turn', 'tilt']);
  J('jaw', 'Head', 'Jaw open', 'jaw', 'x', 1, 0, 22);
  for (const [s, sg] of SIDES) {
    const S = s.toUpperCase();
    F(`eyelid-upper-${s}`, `Upper eyelid ${S}`, 0, 100, '%');
    F(`eyelid-lower-${s}`, `Lower eyelid ${S}`, 0, 100, '%');
    F(`gaze-x-${s}`, `Iris ${S} left / right`, -6, 6, 'px');
    F(`gaze-y-${s}`, `Iris ${S} up / down`, -4, 4, 'px');
    F(`pupil-${s}`, `Pupil ${S} size`, -30, 35, '%');
    F(`brow-${s}`, `Brow ${S} raise`, -6, 8, 'px');
    F(`brow-inner-${s}`, `Brow ${S} inner`, -25, 25, 'deg');
    F(`brow-outer-${s}`, `Brow ${S} outer`, -20, 20, 'deg');
    F(`cheek-${s}`, `Cheek ${S} raise`, 0, 6, 'px');
    F(`lip-corner-${s}`, `Lip corner ${S}`, -25, 25, 'deg');
    J(`ear-${s}`, 'Head', `Ear ${S}`, `ear-${s}`, 'x', sg, -10, 10);
  }
  sway('hair-top', 'Head', 'Hair top tuft', 35);
  for (let i = 1; i <= 5; i++) sway(`hair-front-${i}`, 'Head', `Hair front ${i}`, 14);
  for (const [s] of SIDES) sway(`hair-side-${s}`, 'Head', `Hair side ${s.toUpperCase()}`, 15);
  sway('hair-back', 'Head', 'Hair back', 12);

  /* ----- torso ----- */
  xyz('pelvis', 'Torso', 'Pelvis', [[-20, 20], [-30, 30], [-15, 15]]);
  xyz('spine-1', 'Torso', 'Spine lower', [[-15, 25], [-12, 12], [-12, 12]]);
  xyz('spine-2', 'Torso', 'Spine middle', [[-12, 20], [-12, 12], [-10, 10]]);
  xyz('spine-3', 'Torso', 'Spine upper (chest)', [[-10, 15], [-12, 12], [-8, 8]]);
  for (const [s, sg] of SIDES) {
    J(`clavicle-lift-${s}`, 'Torso', `Clavicle ${s.toUpperCase()} lift (shrug)`, `clavicle-${s}`, 'z', sg, -10, 30);
    J(`clavicle-forward-${s}`, 'Torso', `Clavicle ${s.toUpperCase()} forward`, `clavicle-${s}`, 'x', 1, -15, 20);
  }
  sway('hood', 'Torso', 'Hood', 10);
  sway('hem', 'Torso', 'Hem', 6);
  for (const [s] of SIDES) for (let i = 1; i <= 3; i++) sway(`drawstring-${s}-${i}`, 'Torso', `Drawstring ${s.toUpperCase()} ${i}`, 60);

  /* ----- arms ----- */
  for (const [s, sg] of SIDES) {
    const S = s.toUpperCase();
    J(`shoulder-raise-${s}`, 'Arms', `Shoulder ${S} raise sideways`, `upper-arm-${s}`, 'z', sg, 10, 180, { bind: ARM_BIND, def: 14.7 });      // below 10 the sleeve would pass into the torso
    J(`shoulder-forward-${s}`, 'Arms', `Shoulder ${S} raise forward`, `upper-arm-${s}`, 'x', 1, -60, 180);
    J(`shoulder-twist-${s}`, 'Arms', `Shoulder ${S} twist (in to out)`, `upper-arm-${s}`, 'y', -sg, -90, 90);
    J(`elbow-${s}`, 'Arms', `Elbow ${S}`, `forearm-${s}`, 'x', 1, 0, 145, { def: 10 });
    J(`forearm-twist-${s}`, 'Arms', `Forearm ${S} twist`, `forearm-${s}`, 'y', -sg, -80, 80, { def: -35 });        // at rest the back of the hand faces forward, as a relaxed arm hangs
    J(`wrist-${s}`, 'Arms', `Wrist ${S} bend`, `hand-${s}`, 'x', 1, -70, 80);
    J(`wrist-side-${s}`, 'Arms', `Wrist ${S} side`, `hand-${s}`, 'z', sg, -25, 30);
    sway(`cuff-${s}`, 'Arms', `Sleeve cuff ${S}`, 10);
  }

  /* ----- hands ----- */
  const relaxed = { index: [24, 34, 16], middle: [30, 40, 20], ring: [36, 44, 22], pinky: [42, 48, 24] };
  for (const [s, sg] of SIDES) {
    const S = s.toUpperCase();
    for (const f of ['index', 'middle', 'ring', 'pinky']) {
      ['prox', 'mid', 'dist'].forEach((seg, i) => J(`finger-${f}-${seg}-${s}`, 'Hands and fingers', `${S} ${f} ${['proximal', 'middle', 'distal'][i]}`, `finger-${f}-${seg}-${s}`, 'x', 1, 0, [90, 100, 80][i], { def: relaxed[f][i] }));
      J(`finger-${f}-spread-${s}`, 'Hands and fingers', `${S} ${f} spread`, `finger-${f}-prox-${s}`, 'z', sg, -15, 15);
    }
    J(`thumb-meta-${s}`, 'Hands and fingers', `${S} thumb base bend`, `thumb-meta-${s}`, 'x', 1, -15, 45, { def: 6 });
    J(`thumb-spread-${s}`, 'Hands and fingers', `${S} thumb base spread`, `thumb-meta-${s}`, 'z', 1, -20, 40, { def: 0 });
    J(`thumb-prox-${s}`, 'Hands and fingers', `${S} thumb proximal`, `thumb-prox-${s}`, 'x', 1, 0, 60, { def: 14 });
    J(`thumb-dist-${s}`, 'Hands and fingers', `${S} thumb distal`, `thumb-dist-${s}`, 'x', 1, -10, 80, { def: 12 });
  }

  /* ----- legs ----- */
  for (const [s, sg] of SIDES) {
    const S = s.toUpperCase();
    J(`hip-forward-${s}`, 'Legs', `Hip ${S} raise forward`, `thigh-${s}`, 'x', -1, -30, 120);
    J(`hip-side-${s}`, 'Legs', `Hip ${S} raise sideways`, `thigh-${s}`, 'z', -sg, -15, 50, { bind: LEG_BIND, def: LEG_BIND });
    J(`hip-twist-${s}`, 'Legs', `Hip ${S} twist (in to out)`, `thigh-${s}`, 'y', -sg, -40, 45);
    J(`knee-${s}`, 'Legs', `Knee ${S}`, `shin-${s}`, 'x', 1, 0, 140);
    J(`ankle-${s}`, 'Legs', `Ankle ${S} (toes up / down)`, `foot-${s}`, 'x', 1, -40, 50);
    J(`ankle-roll-${s}`, 'Legs', `Ankle ${S} roll`, `foot-${s}`, 'y', -sg, -20, 20);
    J(`ankle-turn-${s}`, 'Legs', `Ankle ${S} turn`, `foot-${s}`, 'z', -sg, -15, 15);
    J(`toes-${s}`, 'Legs', `Toes ${S}`, `toes-${s}`, 'x', -1, -10, 40);
  }

  /* ----- couplings and IK ----- */
  const scapula = SIDES.map(([s]) => ({ clavicle: `clavicle-${s}`, lift: `clavicle-lift-${s}`, upperArm: `upper-arm-${s}`, start: 30, ratio: 0.22, max: 28 }));
  const ik = {};
  for (const [s, sg] of SIDES) {
    ik[`hand-${s}`] = { label: `Hand ${s.toUpperCase()}`, upper: `upper-arm-${s}`, lower: `forearm-${s}`, end: `hand-${s}`, pole: [sg * 0.35, -1, -0.7], poleBone: 'spine-3',
      joints: { z: `shoulder-raise-${s}`, x: `shoulder-forward-${s}`, y: `shoulder-twist-${s}`, hinge: `elbow-${s}` } };
    ik[`foot-${s}`] = { label: `Foot ${s.toUpperCase()}`, upper: `thigh-${s}`, lower: `shin-${s}`, end: `foot-${s}`, pole: [sg * 0.12, 0, 1], poleBone: 'pelvis', foot: true,
      joints: { z: `hip-side-${s}`, x: `hip-forward-${s}`, y: `hip-twist-${s}`, hinge: `knee-${s}`, level: [`ankle-${s}`, `ankle-roll-${s}`, `ankle-turn-${s}`] } };
  }

  /* ----- physics: a mass on the end of each sprung bone ----- */
  const spring = (stiffness, damping, mass, limit, length, gravity = 0) => ({ stiffness, damping, mass, limit, length, gravity });
  const springs = {
    'hair-top': spring(150, 5, 0.6, 26, 7),
    'hair-front-1': spring(230, 9, 1, 9, 13), 'hair-front-2': spring(240, 9, 1, 9, 13), 'hair-front-3': spring(220, 8, 1.1, 10, 14), 'hair-front-4': spring(240, 9, 1, 9, 13), 'hair-front-5': spring(230, 9, 1, 9, 13),
    'hair-side-r': spring(200, 8, 0.8, 11, 9), 'hair-side-l': spring(200, 8, 0.8, 11, 9), 'hair-back': spring(190, 9, 1.5, 8, 10),
    hood: spring(170, 10, 2, 7, 8), hem: spring(180, 11, 2, 5, 6),
    'cuff-r': spring(210, 9, 1.2, 8, 5), 'cuff-l': spring(210, 9, 1.2, 8, 5),
    'spine-2': spring(300, 24, 7, 2.5, 12), 'spine-3': spring(280, 22, 6, 3, 15), 'neck-2': spring(260, 20, 3, 3.5, 5), head: spring(230, 17, 4.5, 4.5, 14),
    'hand-r': spring(170, 11, 1, 12, 9), 'hand-l': spring(170, 11, 1, 12, 9),
  };
  for (const [s] of SIDES) for (let i = 1; i <= 3; i++) springs[`drawstring-${s}-${i}`] = spring([80, 60, 50][i - 1], 4.5, 0.5, 55, 3.1, 900);

  const masses = [
    { bone: 'head', at: [0, 150, 0], mass: 5 }, { bone: 'spine-3', at: [0, 122, 0], mass: 10 }, { bone: 'spine-2', at: [0, 109, 0], mass: 7 }, { bone: 'spine-1', at: [0, 96, 0], mass: 6 }, { bone: 'pelvis', at: [0, 83, 0], mass: 8 },
    ...SIDES.flatMap(([s, sg]) => {
      const L = landmarks(sg), mid = (a, b) => a.map((v, i) => (v + b[i]) / 2);
      return [{ bone: `upper-arm-${s}`, at: mid(L.Sh, L.El), mass: 2 }, { bone: `forearm-${s}`, at: L.Wr, mass: 1.8 }, { bone: `thigh-${s}`, at: mid(L.Hip, L.Knee), mass: 6 }, { bone: `shin-${s}`, at: mid(L.Knee, L.Ankle), mass: 4 }];
    }),
  ];
  const feet = Object.fromEntries(SIDES.map(([s, sg]) => {
    const L = landmarks(sg), p = a => [L.Ankle[0] + L.ff[0] * a, 0, L.Ankle[2] + L.ff[2] * a];
    return [s, { foot: `foot-${s}`, toes: `toes-${s}`, heel: p(-7.6), ball: p(10.6), tip: p(17), chain: `foot-${s}`, joints: [`hip-forward-${s}`, `hip-side-${s}`, `hip-twist-${s}`, `knee-${s}`] }];
  }));

  const hand = v => Object.fromEntries(['index', 'middle', 'ring', 'pinky'].flatMap(f => ['prox', 'mid', 'dist'].map((seg, i) => [`finger-${f}-${seg}`, v[f][i]]).concat([[`finger-${f}-spread`, v.spread?.[f] ?? 0]]))
    .concat([['thumb-meta', v.thumb[0]], ['thumb-spread', v.thumb[1]], ['thumb-prox', v.thumb[2]], ['thumb-dist', v.thumb[3]]]));
  const presets = {
    open: hand({ index: [0, 0, 0], middle: [0, 0, 0], ring: [0, 0, 0], pinky: [0, 0, 0], thumb: [-6, 10, 0, 0], spread: { index: 6, ring: -4, pinky: -9 } }),
    relaxed: hand({ ...relaxed, thumb: [6, 0, 14, 12] }),
    fist: hand({ index: [82, 96, 60], middle: [86, 98, 62], ring: [88, 100, 64], pinky: [90, 100, 66], thumb: [38, 18, 40, 55] }),
  };

  return {
    meta: {
      name: 'char3d', version: 4, units: 'centimetres, y up, the character faces +z', height: 165,
      note: 'Angles in degrees. Each joint turns one bone about a local axis (x hinge, y along the bone, z the third); local rotation = k * (value - bind). Limits are enforced by the runtime.',
    },
    joints, scapula, ik,
    physics: {
      springs,
      breathing: { period: 3.8, chestLift: 0.32, chestForward: 0.22, shoulder: 1.2 },
      blink: { every: [2.4, 5.5], close: 0.07, hold: 0.05, open: 0.13 },
      saccade: { every: [0.7, 2.6], x: 2.2, y: 1.2, time: 0.05 },
      balance: { gain: 0.55, max: 5.5, stiffness: 60, damping: 14 },
    },
    masses, feet, presets,
  };
}
