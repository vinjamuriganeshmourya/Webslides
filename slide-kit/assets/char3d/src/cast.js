// The cast: three characters on one skeleton and one rig.
//
//   mustard   the mustard-hoodie boy, the first character (approved). Built entirely by the original code:
//             nothing in this file changes him; every path below branches on castName() !== 'mustard'.
//   sporty    the boy in the colour-block puffer jacket and olive cargo joggers
//             (reference: char3d/Sporty 3D Boy Character Render.png)
//   varsity   the boy in the maroon varsity jacket and blue cargo jeans
//             (reference: char3d/Stylized Boy with Side-Swept Hair.png)
//
// Each reference is a style guide only: sizes, positions and colours are measured on it, nothing is
// traced or copied. Both new references are framed like the first one (1 px = 0.1222 cm). Picture
// rows and columns convert to the model's centimetres as
//   sporty    y = 170.8 - 0.1222 * row          x = (col - 535) * 0.1222
//   varsity   y = 172.55 - 0.1222 * row         x = (col - 536) * 0.1222      (his soles are 14 px lower)
// The varsity boy's neck and face are longer than the others': his chin is 2.7 cm higher, so the
// head and everything on it sits 2.7 cm higher on the same skeleton (headDY).
//
// This file is data only (no imports), so every other module can read it.

let NAME = 'mustard';
export const castName = () => NAME;
export const cast = () => CAST[NAME];
export function setCast(name) {
  if (!CAST[name]) throw new Error(`unknown character "${name}": ${Object.keys(CAST).join(', ')}`);
  NAME = name;
}

/* the first character: only what the picker shows. Everything else of his lives in the original modules. */
const mustard = { label: 'Mustard hoodie', headDY: 0 };

/* ================= sporty: puffer jacket, olive cargo joggers ================= */
const sporty = {
  label: 'Puffer jacket',
  headDY: 0,
  // sampled from the reference, lit surfaces; its darkest colours (the jacket's navy, the rib, the watch) are given a
  // little colour, because no black and no dark grey is a rule of this character set (10th / 50th / 90th percentile by luminance where three are given)
  palette: {
    'skin-hi': '#FED4AB', skin: '#FDC69C', 'skin-shade': '#EDA27C', 'skin-deep': '#C9704C', blush: '#F98A72', lip: '#D06752', 'lip-soft': '#F49E82', mouth: '#8A3438', tongue: '#E27F7A', nail: '#FDDCCB',
    'hair-light': '#6E4B45', hair: '#2E1B18', brow: '#24110C', lash: '#22100C', pupil: '#1A0A05',
    'iris-ring': '#3A1A08', 'iris-deep': '#5A2A0C', iris: '#8C4416', 'iris-mid': '#C26A24', 'iris-light': '#EE9A44', 'eye-white': '#FBF8F5', 'eye-shade': '#C9C2C6',
    navy: '#1E2050', 'navy-deep': '#151740', cream: '#F2E2D1', 'cream-deep': '#D9C2AE', orange: '#FF8C2C', 'orange-deep': '#D75C10', rib: '#252A64',
    hoodie: '#FFF7EE', 'hoodie-deep': '#DCC9B8', cord: '#EADFD0', copper: '#C27A4E',
    olive: '#69572F', 'olive-deep': '#4A3E21', 'olive-light': '#86743F',
    'shoe-white': '#FBF3EE', 'shoe-orange': '#F7802A', 'shoe-navy': '#4A424C', 'shoe-sole': '#F77A22', lace: '#F6EFE8', steel: '#8A92A6',
    strap: '#2B3352', 'watch-face': '#1E2440',            // the watch: near black in the picture, a deep navy here (no black or dark grey: the first character's rule)
  },
  // the face drawing: centimetres, the character's left eye (x > 0); mirrored for the right
  face: {
    uv: { x0: -10.25, y0: 134.4, size: 20.5 }, eyeUv: { x0: -9.5, y0: 143.0, w: 19, h: 9.5 },
    // an almond opening, 4.3 x 3.3 cm, centred 4.95 cm out at 147.4; a heavy upper lash line, a small wing
    top: [[2.7, 147.35], [3.2, 148.3], [3.95, 148.85], [4.9, 149.05], [5.85, 148.95], [6.6, 148.5], [7.05, 147.95], [7.25, 147.45]],
    bot: [[2.55, 147.05], [2.75, 146.45], [3.35, 145.95], [4.2, 145.7], [5.25, 145.72], [6.2, 146.0], [6.85, 146.55], [7.25, 147.15]],
    lash: [[2.6, 147.85], [3.15, 148.95], [3.95, 149.6], [4.9, 149.85], [5.9, 149.74], [6.75, 149.25], [7.5, 148.55], [8.05, 147.9]],
    wing: [0.36, -0.34],
    iris: { x: 4.9, y: 147.35, rx: 1.74, ry: 1.82, r: 1.7 },
    // straight thick brows with a soft arch: square inner end, tapered outer end
    browTop: [[2.2, 151.6], [3.2, 152.2], [4.6, 152.45], [6.0, 152.35], [7.4, 151.9], [8.75, 150.9], [9.2, 150.3]],
    browBot: [[8.65, 150.15], [7.3, 150.7], [6.0, 151.05], [4.6, 151.1], [3.3, 150.9], [2.3, 150.4]],
    browHinge: [5.2, 151.7],
    blush: [5.5, 143.6, 2.4, 1.35, 0.5],
    nose: { y: 143.15, w: 1.6, tip: [0.15, 143.9], nostril: 0.85 },
    // a closed smile: corners 3.2 cm out at 140.85, the line dips to 140.1
    mouth: { w: 3.2, y: 140.85, dip: 140.1, lower: 139.6, open: 1 },
    crease: 1.0, lowerLash: 0.55,
  },
  // the skull: front outline (half width) against height, measured on the picture; the side profile
  // is the first character's, slid to these landmarks (chin, eyes, crown)
  head: {
    chin: 136.95, eye: 147.4, crown: 162.3,
    a: [[136.95, 0.3], [137.25, 2.0], [137.81, 3.5], [138.54, 5.25], [139.27, 6.2], [140.0, 6.8], [140.74, 7.3], [141.47, 7.7], [142.2, 7.95], [143.4, 8.4], [144.8, 8.75], [146.6, 8.95], [149.5, 9.1], [152.5, 9.05], [155.5, 8.65], [158.4, 7.55], [160.4, 5.9], [161.8, 3.5], [162.3, 0.4]],
    nose: { at: [0, 143.35, 9.75], r: [1.05, 0.95, 1.3] },
    ear: { ctr: [10.3, 145.4, -1.2], r: [2.05, 3.45, 0.66], tilt: 13 },
    low: 0.25,
  },
  hair: 'sporty',
  outfit: 'sporty',
  shade: {
    face: { lit: [0.96, 0.84, 0.77], shade: [0.7, 0.47, 0.4] },
    hair: { lit: [1.08, 1.05, 1.02], shade: [0.6, 0.55, 0.52], band: [6.4, 2.2, 0.4] },
  },
};

/* ================= varsity: varsity jacket, baggy blue cargo jeans ================= */
const varsity = {
  label: 'Varsity jacket',
  headDY: 2.7,
  palette: {
    'skin-hi': '#FFC7A6', skin: '#F7B793', 'skin-shade': '#E3977A', 'skin-deep': '#C0664A', blush: '#F28C80', lip: '#D06A5C', 'lip-soft': '#F2A08E', mouth: '#86343C', tongue: '#E07E7A', nail: '#F9D4C4',
    'hair-light': '#6E4B45', hair: '#2F1C19', brow: '#26100D', lash: '#200C0A', pupil: '#180804',
    'iris-ring': '#341406', 'iris-deep': '#52240A', iris: '#86400F', 'iris-mid': '#B8621F', 'iris-light': '#E0913E', 'eye-white': '#FBF8F5', 'eye-shade': '#C9C2C6',
    maroon: '#72001B', 'maroon-deep': '#4A0518', cream: '#FBE9DE', 'cream-deep': '#DCC3B5', snap: '#B8BCC8',
    hoodie: '#FFF8F0', 'hoodie-deep': '#DCC8BA', cord: '#F6ECE2', steel: '#A3A9B6',
    jeans: '#21386C', 'jeans-deep': '#172A52', 'jeans-light': '#3A5896',
    'shoe-white': '#FCF1F2', 'shoe-maroon': '#A81C47', 'shoe-sole': '#FBF4F2', lace: '#FBF3F2',
    strap: '#2B3352', 'watch-face': '#1E2440',            // the watch: near black in the picture, a deep navy here (no black or dark grey: the first character's rule)
  },
  face: {
    uv: { x0: -10.5, y0: 137.0, size: 21.5 }, eyeUv: { x0: -9.5, y0: 146.8, w: 19, h: 9.5 },
    // a rounder opening, 4.6 x 3.4 cm, 4.65 cm out at 151.3; brows very thick and nearly straight
    top: [[2.45, 151.45], [2.95, 152.35], [3.7, 152.85], [4.65, 153.05], [5.6, 152.95], [6.4, 152.55], [6.95, 151.95], [7.1, 151.45]],
    bot: [[2.3, 151.1], [2.5, 150.45], [3.05, 149.95], [3.9, 149.65], [5.0, 149.62], [6.0, 149.9], [6.7, 150.5], [7.1, 151.15]],
    lash: [[2.35, 151.75], [2.9, 152.75], [3.7, 153.3], [4.65, 153.52], [5.65, 153.42], [6.55, 152.95], [7.25, 152.3], [7.6, 151.75]],
    wing: [0.36, -0.3],
    iris: { x: 4.6, y: 151.3, rx: 1.62, ry: 1.7, r: 1.62 },
    browTop: [[2.1, 155.5], [3.2, 155.9], [4.7, 156.0], [6.2, 155.85], [7.4, 155.4], [8.2, 154.75], [8.45, 154.3]],
    browBot: [[8.0, 154.25], [7.0, 154.35], [5.8, 154.4], [4.5, 154.3], [3.2, 154.1], [2.15, 153.95]],
    browHinge: [5.0, 155.1],
    blush: [5.4, 147.0, 2.5, 1.4, 0.55],
    nose: { y: 146.55, w: 1.75, tip: [0.15, 147.35], nostril: 0.95, bridge: true },
    // a gentle closed smile, 3.4 cm out each side at 144.25, dipping to 143.75; a fuller lower lip
    mouth: { w: 3.4, y: 144.25, dip: 143.75, lower: 143.1, open: 0.9 },
    crease: 1.0, lowerLash: 0.45,
  },
  head: {
    chin: 139.3, eye: 151.3, crown: 166.4,
    a: [[139.3, 0.3], [139.56, 2.3], [140.29, 4.15], [141.02, 4.75], [141.76, 5.45], [142.49, 6.2], [143.22, 6.8], [143.96, 7.15], [144.7, 7.45], [145.4, 7.7], [146.2, 7.95], [147.6, 8.25], [149.1, 8.4], [150.6, 8.5], [153.0, 8.5], [156.5, 8.3], [159.6, 7.5], [162.6, 6.0], [165.2, 3.6], [166.4, 0.4]],
    nose: { at: [0, 146.75, 10.0], r: [0.85, 1.05, 1.2] },
    ear: { ctr: [10.2, 149.2, -1.2], r: [2.0, 3.55, 0.66], tilt: 12 },
    low: 0.25,
  },
  hair: 'varsity',
  outfit: 'varsity',
  shade: {
    face: { lit: [0.95, 0.82, 0.76], shade: [0.69, 0.45, 0.4] },
    hair: { lit: [1.08, 1.05, 1.02], shade: [0.6, 0.55, 0.52], band: [6.4, 2.2, 0.4] },
  },
};

export const CAST = { mustard, sporty, varsity };
