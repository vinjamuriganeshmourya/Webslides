// Rig data: joints and limits, couplings, IK chains, physics. Becomes rig.json.
// Joint values are anatomical and identical for both sides; `k` on a target carries the
// screen sign (positive = clockwise) so the left and right limbs mirror each other.
import { CX, GROUND, mirror } from './lib.mjs';

export function rigData(boneList) {
  const piv = Object.fromEntries(boneList.map(b => [b.id, b.pivot]));
  const joints = [];
  const J = (id, group, label, min, max, targets, o = {}) => joints.push({ id, group, label, unit: o.unit ?? 'deg', min, max, default: o.def ?? 0, targets });
  const rotJ = (id, group, label, min, max, k = 1, o) => J(id, group, label, min, max, [{ bone: o?.bone ?? id, ch: 'r', k }], o);
  const sides = [['r', 'R', -1], ['l', 'L', 1]];   // suffix, label, screen sign of an anatomical "+"

  /* ----- head ----- */
  rotJ('neck-1', 'Head', 'Neck lower tilt', -15, 15);
  rotJ('neck-2', 'Head', 'Neck upper tilt', -15, 15);
  rotJ('head', 'Head', 'Head tilt', -20, 20);
  J('head-yaw', 'Head', 'Head turn (yaw)', -70, 70, []);
  J('jaw', 'Head', 'Jaw open', 0, 25, [{ bone: 'jaw', ch: 'y', k: 0.5 }]);
  for (const [s, S, sg] of sides) {
    J(`eyelid-upper-${s}`, 'Head', `Upper eyelid ${S}`, 0, 100, [{ bone: `eyelid-upper-${s}`, ch: 'y', k: 0.34 }, { bone: `lash-upper-${s}`, ch: 'y', k: 0.34 }], { unit: '%' });
    J(`eyelid-lower-${s}`, 'Head', `Lower eyelid ${S}`, 0, 100, [{ bone: `eyelid-lower-${s}`, ch: 'y', k: -0.1 }], { unit: '%' });
    J(`gaze-x-${s}`, 'Head', `Iris ${S} left / right`, -6, 6, [{ bone: `iris-${s}`, ch: 'x', k: 1 }], { unit: 'px' });
    J(`gaze-y-${s}`, 'Head', `Iris ${S} up / down`, -4, 4, [{ bone: `iris-${s}`, ch: 'y', k: 1 }], { unit: 'px' });
    J(`pupil-${s}`, 'Head', `Pupil ${S} size`, -30, 35, [{ bone: `pupil-${s}`, ch: 'sx', k: 0.01 }, { bone: `pupil-${s}`, ch: 'sy', k: 0.01 }], { unit: '%' });
    J(`brow-${s}`, 'Head', `Brow ${S} raise`, -6, 8, [{ bone: `brow-${s}`, ch: 'y', k: -1 }], { unit: 'px' });
    rotJ(`brow-inner-${s}`, 'Head', `Brow ${S} inner`, -25, 25, sg);
    rotJ(`brow-outer-${s}`, 'Head', `Brow ${S} outer`, -20, 20, -sg);
    J(`cheek-${s}`, 'Head', `Cheek ${S} raise`, 0, 6, [{ bone: `cheek-${s}`, ch: 'y', k: -1 }], { unit: 'px' });
    rotJ(`lip-corner-${s}`, 'Head', `Lip corner ${S}`, -25, 25, -sg);
    rotJ(`ear-${s}`, 'Head', `Ear ${S}`, -10, 10, -sg);
  }
  rotJ('hair-top', 'Head', 'Hair top tuft', -35, 35);
  for (let i = 1; i <= 5; i++) rotJ(`hair-front-${i}`, 'Head', `Hair front ${i}`, -12, 12);
  for (const [s, S] of sides) { rotJ(`hair-side-${s}`, 'Head', `Hair side ${S}`, -15, 15); rotJ(`hair-back-${s}`, 'Head', `Hair back ${S}`, -15, 15); }

  /* ----- torso ----- */
  rotJ('pelvis', 'Torso', 'Pelvis tilt', -20, 20);
  rotJ('spine-1', 'Torso', 'Spine lower', -15, 15);
  rotJ('spine-2', 'Torso', 'Spine middle', -12, 12);
  rotJ('spine-3', 'Torso', 'Spine upper (chest)', -10, 10);
  for (const [s, S, sg] of sides) rotJ(`clavicle-${s}`, 'Torso', `Clavicle ${S} (shrug)`, -10, 30, -sg);
  J('hood', 'Torso', 'Hood', -8, 8, [{ bone: 'hood', ch: 'r', k: 1 }, { bone: 'hood-back', ch: 'r', k: 1 }]);
  for (const [s, S] of sides) for (let i = 1; i <= 3; i++) rotJ(`drawstring-${s}-${i}`, 'Torso', `Drawstring ${S} ${i}`, -60, 60);
  rotJ('hem', 'Torso', 'Hem', -6, 6);
  rotJ('pocket', 'Torso', 'Pocket', -5, 5);

  /* ----- arms ----- */
  for (const [s, S, sg] of sides) {
    rotJ(`shoulder-${s}`, 'Arms', `Shoulder ${S}`, -180, 60, sg, { bone: `upper-arm-${s}` });
    J(`arm-rotation-${s}`, 'Arms', `Arm rotation ${S} (in to out)`, 0, 180, []);
    J(`elbow-${s}`, 'Arms', `Elbow ${S}`, 0, 145, [], { def: 6 });
    rotJ(`wrist-${s}`, 'Arms', `Wrist ${S}`, -70, 80, sg, { bone: `hand-${s}` });
    rotJ(`cuff-${s}`, 'Arms', `Sleeve cuff ${S}`, -10, 10);
  }

  /* ----- hands ----- */
  const relaxed = { index: [14, 26, 14], middle: [20, 32, 16], ring: [26, 38, 18], pinky: [32, 44, 20] };
  for (const [s, S, sg] of sides) {
    for (const f of ['index', 'middle', 'ring', 'pinky']) {
      ['prox', 'mid', 'dist'].forEach((seg, i) => rotJ(`finger-${f}-${seg}-${s}`, 'Hands and fingers', `${S} ${f} ${['proximal', 'middle', 'distal'][i]}`, 0, [90, 100, 80][i], sg, { def: relaxed[f][i] }));
    }
    rotJ(`thumb-meta-${s}`, 'Hands and fingers', `${S} thumb base`, -15, 45, -sg, { def: 6 });
    rotJ(`thumb-prox-${s}`, 'Hands and fingers', `${S} thumb proximal`, 0, 60, -sg, { def: 12 });
    rotJ(`thumb-dist-${s}`, 'Hands and fingers', `${S} thumb distal`, -10, 80, -sg, { def: 14 });
  }

  /* ----- legs ----- */
  for (const [s, S, sg] of sides) {
    rotJ(`hip-${s}`, 'Legs', `Hip ${S}`, -120, 30, sg, { bone: `thigh-${s}` });
    rotJ(`knee-${s}`, 'Legs', `Knee ${S}`, 0, 140, sg, { bone: `shin-${s}` });
    rotJ(`ankle-${s}`, 'Legs', `Ankle ${S}`, -40, 50, sg, { bone: `foot-${s}` });
    rotJ(`toes-${s}`, 'Legs', `Toes ${S}`, -10, 40, sg);
  }

  /* ----- couplings ----- */
  const folds = sides.map(([s, , sg]) => ({ bone: `forearm-${s}`, flex: `elbow-${s}`, twist: `arm-rotation-${s}`, k: sg }));
  const scapula = sides.map(([s, , sg]) => ({ shoulder: `shoulder-${s}`, clavicle: `clavicle-${s}`, upperArm: `upper-arm-${s}`, start: 30, ratio: 0.22, max: 28, k: -sg }));
  const yaw = {
    joint: 'head-yaw', gain: 0.6, earHide: 14,
    // x = rest offset from the centre line, z = depth in front of the turning axis
    features: [
      ...sides.flatMap(([s, , sg]) => [
        { bone: `eye-${s}`, x: sg * 44, z: 34 }, { bone: `brow-${s}`, x: sg * 44, z: 36 }, { bone: `cheek-${s}`, x: sg * 53, z: 28 },
        { bone: `ear-${s}`, x: sg * 80, z: -10, ear: true }, { bone: `hair-side-${s}`, x: sg * 80, z: 10 }, { bone: `hair-wrap-${s}`, x: sg * 78, wrap: 20 },
      ]),
      { bone: 'nose', x: 0, z: 52 }, { bone: 'mouth', x: 0, z: 40 }, { bone: 'mouth-inner', x: 0, z: 40 },
      { bone: 'hair-front-1', x: -62, z: 50 }, { bone: 'hair-front-2', x: -34, z: 54 }, { bone: 'hair-front-3', x: -4, z: 56 },
      { bone: 'hair-front-4', x: 38, z: 54 }, { bone: 'hair-front-5', x: 76, z: 46 }, { bone: 'hair-top', x: 4, z: 14 },
      { bone: 'hair-shadow-1', x: -62, z: 50 }, { bone: 'hair-shadow-2', x: -34, z: 54 }, { bone: 'hair-shadow-3', x: -4, z: 56 },
      { bone: 'hair-shadow-4', x: 38, z: 54 }, { bone: 'hair-shadow-5', x: 76, z: 46 },
    ],
  };

  /* ----- IK chains ----- */
  const ik = {};
  for (const [s] of sides) {
    ik[`hand-${s}`] = { label: `Hand ${s.toUpperCase()}`, upper: `upper-arm-${s}`, lower: `forearm-${s}`, end: `hand-${s}`, joints: { upper: `shoulder-${s}`, lower: `elbow-${s}`, twist: `arm-rotation-${s}` } };
    ik[`foot-${s}`] = { label: `Foot ${s.toUpperCase()}`, upper: `thigh-${s}`, lower: `shin-${s}`, end: `foot-${s}`, joints: { upper: `hip-${s}`, lower: `knee-${s}`, level: `ankle-${s}` } };
  }

  /* ----- physics ----- */
  // stiffness (1/s^2 per unit mass), damping (1/s), mass (relative), limit (degrees either way),
  // length and dir give the point that swings: a mass on the end of the bone
  const spring = (joint, stiffness, damping, mass, limit, length, dir = [0, 1], gravity = 0) => ({ joint, stiffness, damping, mass, limit, length, dir, gravity });
  const springs = {
    'hair-top': spring('hair-top', 150, 5, 0.6, 28, 46, [0.5, -0.87]),
    'hair-front-1': spring('hair-front-1', 230, 9, 1, 9, 96), 'hair-front-2': spring('hair-front-2', 240, 9, 1, 9, 92),
    'hair-front-3': spring('hair-front-3', 220, 8, 1.1, 10, 104), 'hair-front-4': spring('hair-front-4', 240, 9, 1, 9, 96),
    'hair-front-5': spring('hair-front-5', 230, 9, 1, 9, 100),
    'hair-side-r': spring('hair-side-r', 200, 8, 0.8, 12, 62), 'hair-side-l': spring('hair-side-l', 200, 8, 0.8, 12, 62),
    'hair-back-r': spring('hair-back-r', 180, 7, 0.7, 14, 34), 'hair-back-l': spring('hair-back-l', 180, 7, 0.7, 14, 34),
    hood: spring('hood', 170, 10, 2, 6, 36),
    hem: spring('hem', 180, 11, 2, 5, 30), pocket: spring('pocket', 200, 11, 1.5, 4, 70),
    'cuff-r': spring('cuff-r', 210, 9, 1.2, 9, 46), 'cuff-l': spring('cuff-l', 210, 9, 1.2, 9, 46),
    'spine-2': spring('spine-2', 300, 24, 7, 2.5, 96, [0, -1]), 'spine-3': spring('spine-3', 280, 22, 6, 3, 120, [0, -1]),
    'neck-2': spring('neck-2', 260, 20, 3, 3.5, 30, [0, -1]), head: spring('head', 230, 17, 4.5, 4.5, 110, [0, -1]),
    'hand-r': spring('wrist-r', 160, 10, 1, 12, 78), 'hand-l': spring('wrist-l', 160, 10, 1, 12, 78),
  };
  for (const [s] of sides) for (let i = 1; i <= 3; i++) springs[`drawstring-${s}-${i}`] = spring(`drawstring-${s}-${i}`, [70, 55, 45][i - 1], 4.5, 0.5, 55, 24, [0, 1], 900);

  const mid = (a, b) => [(piv[a][0] + piv[b][0]) / 2, (piv[a][1] + piv[b][1]) / 2];
  const masses = [
    { bone: 'head', at: [CX, 170], mass: 5 }, { bone: 'spine-3', at: [CX, 400], mass: 10 }, { bone: 'spine-2', at: [CX, 505], mass: 7 },
    { bone: 'spine-1', at: [CX, 610], mass: 6 }, { bone: 'pelvis', at: [CX, 722], mass: 8 },
    ...sides.flatMap(([s]) => [
      { bone: `upper-arm-${s}`, at: mid(`upper-arm-${s}`, `forearm-${s}`), mass: 2 }, { bone: `forearm-${s}`, at: piv[`hand-${s}`], mass: 1.8 },
      { bone: `thigh-${s}`, at: mid(`thigh-${s}`, `shin-${s}`), mass: 6 }, { bone: `shin-${s}`, at: mid(`shin-${s}`, `foot-${s}`), mass: 4 },
    ]),
  ];
  const feet = Object.fromEntries(sides.map(([s]) => {
    const a = piv[`foot-${s}`], out = s === 'r' ? -1 : 1;
    return [s, { bone: `foot-${s}`, ankle: a, sole: [[a[0] + out * 81, GROUND], [a[0] - out * 37, GROUND]], shadow: `ground-shadow-${s}`, hip: `hip-${s}`, knee: `knee-${s}`, chain: `foot-${s}` }];
  }));

  const hand = v => Object.fromEntries(['index', 'middle', 'ring', 'pinky'].flatMap(f => ['prox', 'mid', 'dist'].map((seg, i) => [`finger-${f}-${seg}`, v[f][i]])).concat([['thumb-meta', v.thumb[0]], ['thumb-prox', v.thumb[1]], ['thumb-dist', v.thumb[2]]]));
  const presets = {
    open: hand({ index: [0, 0, 0], middle: [0, 0, 0], ring: [0, 0, 0], pinky: [0, 0, 0], thumb: [-8, 0, 0] }),
    relaxed: hand({ ...relaxed, thumb: [6, 12, 14] }),
    fist: hand({ index: [84, 98, 62], middle: [88, 100, 66], ring: [90, 100, 68], pinky: [90, 100, 70], thumb: [38, 46, 52] }),
  };

  return {
    meta: {
      name: 'char', version: 2, canvas: [1086, 1448], ground: GROUND,
      note: 'Angles in degrees. A joint value is anatomical and the same on both sides; each target k maps it to a screen rotation (positive = clockwise). Limits are enforced by rig.js.',
    },
    bones: boneList,
    joints, folds, scapula, yaw, ik,
    physics: {
      springs,
      breathing: { period: 3.8, chestLift: 2.4, shoulder: 1.2, head: 0.5 },
      blink: { every: [2.4, 5.5], close: 0.07, hold: 0.05, open: 0.13 },
      saccade: { every: [0.7, 2.6], x: 2.2, y: 1.2, time: 0.05 },
      balance: { gain: 0.55, max: 46, lean: 0.035, stiffness: 60, damping: 14 },
      ground: { plantTolerance: 2.5 },
    },
    masses, feet, presets,
  };
}
