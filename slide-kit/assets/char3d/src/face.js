// The face, drawn in centimetres on the head (x across, y up, the same axes as the model).
// Three layers give the eyes real depth:
//   face    skin, blush, brows, lashes, lids, nose shading, mouth; the eye openings are HOLES in it
//   eye     the white and the iris, on a surface 4 mm behind the skin, with a bowl under the iris
//   glint   the two highlights, floating just behind the lids
// All positions and sizes are the reference's, measured: eye openings 5.3 x 3.7 cm, 5.2 cm either
// side of the centre line at 146.9; iris 3.5 cm across, set 0.7 cm towards the nose; brows from
// 2.25 to 8.05 cm; mouth 5.8 cm wide at 140.8. Redrawn only when a face joint changes.
import * as THREE from '../vendor/three/three.module.js';
import { PALETTE } from './model.js';
import { cast, castName } from './cast.js';
import { drawCastFace } from './face2.js';

// The reference is a picture taken from about chest height, five metres away. The face is 9 cm nearer
// the camera than the middle of the head, so in the picture it sits a little higher than it is.
// The drawing keeps the picture's measurements and is laid on the head this much lower:
export const FACE_DY = -0.85;
export const FACE_UV = { x0: -9.75, y0: 134.4, size: 19.5 };
export const EYE_UV = { x0: -9.5, y0: 142.25, w: 19, h: 9.5 };
export const IRIS = { x: 4.48, y: 146.5, rx: 1.56, ry: 1.68, r: 1.62 };          // an upright oval resting on the lower lid; r is the bowl's radius
// where the drawing and the eye layers lie on the head: the first character's above, the others' in cast.js
export function faceFrame() {
  if (castName() === 'mustard') return { FACE_DY, FACE_UV, EYE_UV, IRIS };
  const f = cast().face;
  return { FACE_DY, FACE_UV: f.uv, EYE_UV: f.eyeUv, IRIS: f.iris };
}
const FS = 1024, EW = 1024, EH = 512, PX = 0.1222, TAU = Math.PI * 2, RAD = Math.PI / 180;
const rgba = (name, a = 1) => { const n = parseInt((PALETTE[name] || name).slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// eye opening, one side (x > 0), inner corner to outer corner: upper edge, lower edge, top of the lash band.
// 4.58 cm wide and 3.5 cm tall, as the reference's measures (39 x 28.5 px at 0.1222 cm, less the camera's 1.6 %).
const TOP = [[2.66, 147.13], [3.29, 147.8], [3.96, 148.19], [4.82, 148.34], [5.69, 148.23], [6.37, 147.84], [6.85, 147.33], [7.05, 146.9]];
const BOT = [[2.47, 146.75], [2.54, 146.18], [2.99, 145.32], [3.86, 144.88], [5.02, 144.84], [6.07, 145.18], [6.75, 145.8], [7.05, 146.46]];
const LASH = [[2.53, 147.5], [3.07, 148.15], [3.85, 148.6], [4.82, 148.84], [5.8, 148.71], [6.62, 148.24], [7.23, 147.59], [7.61, 146.99]];
const BROW_TOP = [[2.2, 150.8], [3.2, 151.36], [4.6, 151.56], [5.9, 151.34], [7.0, 150.8], [8.05, 149.95]], BROW_BOT = [[6.9, 150.3], [5.8, 150.66], [4.5, 150.74], [3.2, 150.5], [2.25, 150.0]], BROW_HINGE = [4.6, 151.05];

// a smooth curve through points (Catmull-Rom), appended to the current path
function through(c, pts, move) {
  if (move) c.moveTo(pts[0][0], pts[0][1]); else c.lineTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    c.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
}
function loop(c, pts) {
  const n = pts.length; c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    c.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  c.closePath();
}

export class Face {
  constructor() {
    const mk = (w, h) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; };
    this.canvas = mk(FS, FS); this.ctx = this.canvas.getContext('2d');
    this.eyeCanvas = mk(EW, EH); this.ectx = this.eyeCanvas.getContext('2d');
    this.glintCanvas = mk(EW / 2, EH / 2); this.gctx = this.glintCanvas.getContext('2d');
    const tex = cv => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
    this.texture = tex(this.canvas); this.eyeTexture = tex(this.eyeCanvas); this.glintTexture = tex(this.glintCanvas);
    this.holes = true;                                       // the head is drawn with the eye openings cut out
    const I = faceFrame().IRIS;
    this.iris = { r: [-I.x, I.y], l: [I.x, I.y] };  // where each iris is now: the bowl under it follows
    this.key = ''; this.draws = 0;
  }
  // soft-edged ellipse
  soft(c, cx, cy, rx, ry, rot, color, a) {
    c.save(); c.translate(cx, cy); c.rotate(rot * RAD); c.scale(rx, ry);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, rgba(color, a)); g.addColorStop(0.55, rgba(color, a * 0.5)); g.addColorStop(1, rgba(color, 0));
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.restore();
  }
  update(joints, jaw) {
    const v = {}; let key = (Math.round(jaw * 5) / 5) + '|';
    for (const j of joints) { v[j.id] = j.final; key += (Math.round(j.final * 5) / 5) + ','; }
    if (key === this.key) return;
    this.key = key; this.draw(v, jaw); this.draws++;
    this.texture.needsUpdate = this.eyeTexture.needsUpdate = this.glintTexture.needsUpdate = true;
  }
  // the edges of one eye opening for the current lids: upper edge, lower edge (null when the eye is shut)
  lids(v, n) {
    const up = v[`eyelid-upper-${n}`] / 100, low = v[`eyelid-lower-${n}`] / 100 * 0.24;
    const E = TOP.map((p, i) => lerp2(p, BOT[i], Math.min(1, up))), B = BOT.map((p, i) => lerp2(p, TOP[i], low));
    return { E, B, open: up + low < 0.985, up };
  }
  draw(v, jaw) {
    if (castName() !== 'mustard') return drawCastFace(this, v, jaw);       // the other characters' faces: face2.js
    const c = this.ctx, s = FS / FACE_UV.size;
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.fillStyle = PALETTE.skin; c.fillRect(0, 0, FS, FS);
    c.setTransform(s, 0, 0, -s, -FACE_UV.x0 * s, (FACE_UV.y0 + FACE_UV.size) * s);          // centimetres, y up
    c.lineCap = 'round'; c.lineJoin = 'round';
    const side = (sg, fn) => { c.save(); c.scale(sg, 1); fn(sg < 0 ? 'r' : 'l', sg); c.restore(); };       // the character's right is at x < 0

    // the skin is one even colour: its shade comes from the two-tone shader
    for (const sg of [-1, 1]) side(sg, n => {
      this.soft(c, 5.3, 143.45 + v[`cheek-${n}`] * PX, 2.5, 1.5, 0, 'blush', 0.6);          // a subtle blush, the only colour laid on the skin
    });
    // nose: the shape is modelled; this is its shade, the nostrils and the light on the tip
    this.soft(c, 0, 142.3, 1.25, 0.5, 0, 'skin-deep', 0.42);
    this.soft(c, -0.72, 142.42, 0.3, 0.2, -12, 'skin-deep', 0.75); this.soft(c, 0.72, 142.42, 0.3, 0.2, 12, 'skin-deep', 0.7);
    this.soft(c, 0.12, 143.25, 0.55, 0.42, 0, 'skin-hi', 0.7);

    // mouth: the smile line stays; an opening grows under it with the jaw
    const d = jaw * 0.067;
    if (d > 0.05) {
      c.save(); c.beginPath(); c.moveTo(-2.8, 140.78); c.quadraticCurveTo(0, 139.62, 2.8, 140.78); c.quadraticCurveTo(0, 139.62 - 2.1 * d, -2.8, 140.78); c.closePath(); c.clip();
      c.fillStyle = PALETTE.mouth; c.fillRect(-4, 135, 8, 7);
      c.fillStyle = PALETTE['eye-white']; c.beginPath(); c.moveTo(-2.6, 140.78); c.quadraticCurveTo(0, 139.7, 2.6, 140.78); c.lineTo(2.4, 140.2); c.quadraticCurveTo(0, 139.2, -2.4, 140.2); c.closePath(); c.fill();
      this.soft(c, 0, 139.45 - d * 0.95, 1.25, 0.52, 0, 'tongue', 1);
      c.restore();
      c.strokeStyle = rgba('lip', 0.7); c.lineWidth = 0.22; c.beginPath(); c.moveTo(-2.55, 140.72); c.quadraticCurveTo(0, 139.58 - 2.0 * d, 2.55, 140.72); c.stroke();
    }
    this.soft(c, 0, 139.72 - d, 1.55, 0.42, 0, 'lip-soft', 0.55); this.soft(c, 0, 139.66 - d, 0.9, 0.2, 0, 'skin-hi', 0.75); this.soft(c, 0, 139.1 - d, 1.7, 0.36, 0, 'skin-shade', 0.6);
    c.save(); c.shadowColor = rgba('lip', 0.5); c.shadowBlur = 0.05 * s;
    c.fillStyle = PALETTE.lip; c.beginPath(); c.moveTo(-2.5, 140.72); c.quadraticCurveTo(0, 139.9, 2.5, 140.72); c.quadraticCurveTo(0, 139.14, -2.5, 140.72); c.closePath(); c.fill(); c.restore();
    for (const sg of [-1, 1]) side(sg, n => {
      c.translate(2.5, 140.7); c.rotate(-v[`lip-corner-${n}`] * RAD); c.translate(-2.5, -140.7);
      c.strokeStyle = PALETTE.lip; c.lineWidth = 0.16; c.beginPath(); c.moveTo(2.5, 140.7); c.quadraticCurveTo(2.78, 140.82, 2.98, 141.02); c.stroke();
      this.soft(c, 3.12, 141.0, 0.3, 0.26, 0, 'skin-deep', 0.5);
    });

    // eyes: lid shading, the opening cut out, lash band with its wing, crease, lower line and lashes
    const L = {};
    for (const sg of [-1, 1]) side(sg, n => {
      const q = L[n] = this.lids(v, n), E = q.E, B = q.B, O = E.map((p, i) => [p[0] + (LASH[i][0] - TOP[i][0]), p[1] + (LASH[i][1] - TOP[i][1]) * (1 - 0.3 * q.up)]);
      // the lid itself, a little darker than the cheek, where it has come down over the eye
      c.save(); c.beginPath(); loop(c, [...TOP, ...BOT.slice().reverse()]); c.clip();
      c.fillStyle = rgba('skin-shade', 0.3); c.fillRect(1.5, 144, 7.5, 6); c.restore();
      this.soft(c, 4.81, 149.07, 2.75, 0.7, -4, 'skin-shade', 0.3);
      if (q.open) { c.save(); c.globalCompositeOperation = 'destination-out'; c.fillStyle = '#000'; c.beginPath(); loop(c, [...E, ...B.slice().reverse()]); c.fill(); c.restore(); }
      c.strokeStyle = rgba('skin-deep', 0.5); c.lineWidth = 0.09; c.beginPath(); through(c, [[3.2, 148.54 - q.up * 1.2], [3.96, 148.95 - q.up * 1.5], [4.86, 149.16 - q.up * 1.6], [5.85, 149.02 - q.up * 1.5], [6.66, 148.65 - q.up * 1.2]], true); c.stroke();
      c.strokeStyle = rgba('skin-deep', 0.62); c.lineWidth = 0.085; c.beginPath(); through(c, B.slice(2).map(p => [p[0], p[1] - 0.05]), true); c.stroke();
      c.strokeStyle = rgba('lash', 0.72); c.lineWidth = 0.065;
      for (const [a, b] of [[[6.63, 145.67], [6.9, 145.42]], [[6.16, 145.23], [6.37, 144.97]], [[5.63, 144.97], [5.76, 144.71]]]) { c.beginPath(); c.moveTo(a[0], a[1] + (B[5][1] - BOT[5][1])); c.lineTo(b[0], b[1] + (B[5][1] - BOT[5][1])); c.stroke(); }
      c.fillStyle = PALETTE.lash; c.beginPath(); through(c, O, true); through(c, E.slice().reverse(), false); c.closePath(); c.fill();
      const w = E[7]; c.beginPath(); c.moveTo(w[0] - 0.05, w[1] - 0.12); c.lineTo(w[0] + 0.42, w[1] - 0.52); c.lineTo(w[0] - 0.08, w[1] - 0.5); c.closePath(); c.fill();
    });

    // brows: an outer and an inner half, hinged in the middle
    for (const sg of [-1, 1]) side(sg, n => {
      c.fillStyle = PALETTE.brow; c.translate(0, v[`brow-${n}`] * PX);
      const half = (ang, clipX0, clipX1) => { c.save(); c.translate(...BROW_HINGE); c.rotate(ang * RAD); c.translate(-BROW_HINGE[0], -BROW_HINGE[1]); c.beginPath(); c.rect(clipX0, 148, clipX1 - clipX0, 6); c.clip(); c.beginPath(); through(c, BROW_TOP, true); through(c, BROW_BOT, false); c.closePath(); c.fill(); c.restore(); };
      half(-v[`brow-outer-${n}`], BROW_HINGE[0] - 0.02, 9.5); half(v[`brow-inner-${n}`], 1, BROW_HINGE[0] + 0.02);
    });

    /* ----- the eye layer: white, iris, pupil ----- */
    const e = this.ectx, ex = EW / EYE_UV.w, ey = EH / EYE_UV.h;
    e.setTransform(1, 0, 0, 1, 0, 0); e.fillStyle = PALETTE['eye-white']; e.fillRect(0, 0, EW, EH);
    e.setTransform(ex, 0, 0, -ey, -EYE_UV.x0 * ex, (EYE_UV.y0 + EYE_UV.h) * ey);
    const g = this.gctx; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, EW / 2, EH / 2); g.setTransform(ex / 2, 0, 0, -ey / 2, -EYE_UV.x0 * ex / 2, (EYE_UV.y0 + EYE_UV.h) * ey / 2);
    for (const [n, sg] of [['r', -1], ['l', 1]]) {
      const q = L[n], top = q.E[3][1], cx = sg * IRIS.x + v[`gaze-x-${n}`] * PX, cy = IRIS.y - v[`gaze-y-${n}`] * PX, R = IRIS.ry, ps = 1 + v[`pupil-${n}`] / 100;
      this.iris[n][0] = cx; this.iris[n][1] = cy;
      // the lid's shade on the white, deepest under the lash and in the corners
      let gr = e.createLinearGradient(0, top + 0.1, 0, top - 2.6); gr.addColorStop(0, '#8F8898'); gr.addColorStop(0.32, '#C3BABD'); gr.addColorStop(0.8, '#EEE8E4'); gr.addColorStop(1, rgba('eye-white', 1));
      e.fillStyle = gr; e.fillRect(sg > 0 ? 1.2 : -9.3, 143.4, 8.1, 7);
      this.soft(e, sg * 7.15, 146.5, 1.05, 1.9, 0, '#ADA3A8', 0.85); this.soft(e, sg * 2.55, 146.5, 0.6, 1.5, 0, '#C3BABC', 0.7);          // the corners sit in shade
      // iris: dark at the top where the lid shades it, bright at the bottom where light comes through
      e.save(); e.translate(cx, cy); e.scale(IRIS.rx / IRIS.ry, 1); e.translate(-cx, -cy);          // drawn as a circle, squeezed into the oval
      e.beginPath(); e.arc(cx, cy, R, 0, TAU); e.clip();
      gr = e.createLinearGradient(0, cy + R, 0, cy - R); gr.addColorStop(0, '#1C3A66'); gr.addColorStop(0.3, PALETTE['iris-deep']); gr.addColorStop(0.55, PALETTE.iris); gr.addColorStop(0.78, PALETTE['iris-mid']); gr.addColorStop(1, PALETTE['iris-light']);
      e.fillStyle = gr; e.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      gr = e.createRadialGradient(cx, cy - 0.95 * R, 0.05, cx, cy - 0.95 * R, 1.25 * R); gr.addColorStop(0, 'rgba(170,232,244,0.95)'); gr.addColorStop(0.55, 'rgba(120,205,235,0.5)'); gr.addColorStop(1, 'rgba(90,170,220,0)');
      e.fillStyle = gr; e.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      e.strokeStyle = 'rgba(255,255,255,0.08)'; e.lineWidth = 0.035;                               // fine fibres
      for (let k = 0; k < 40; k++) { const a = k / 40 * TAU, r0 = R * (0.52 + 0.1 * ((k * 7) % 5) / 5); e.beginPath(); e.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); e.lineTo(cx + Math.cos(a) * R * 0.93, cy + Math.sin(a) * R * 0.93); e.stroke(); }
      gr = e.createRadialGradient(cx, cy, R * 0.72, cx, cy, R); gr.addColorStop(0, rgba('iris-ring', 0)); gr.addColorStop(0.7, rgba('iris-ring', 0.75)); gr.addColorStop(1, rgba('pupil', 0.95));
      e.fillStyle = gr; e.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      gr = e.createLinearGradient(0, top + 0.2, 0, top - 1.5); gr.addColorStop(0, rgba('pupil', 0.8)); gr.addColorStop(1, rgba('pupil', 0));
      e.fillStyle = gr; e.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      e.restore();
      e.save(); e.shadowColor = rgba('iris-ring', 0.9); e.shadowBlur = 0.1 * ex;
      e.fillStyle = PALETTE.pupil; e.beginPath(); e.ellipse(cx, cy - 0.02, 0.78 * ps, 0.84 * ps, 0, 0, TAU); e.fill(); e.restore();
      // the two highlights sit at the same place in both eyes: they are reflections of the same light
      g.fillStyle = '#FFFFFF';
      g.beginPath(); g.arc(cx - 0.93, cy + 0.55, 0.27, 0, TAU); g.fill(); g.beginPath(); g.arc(cx + 0.65, cy + 0.57, 0.31, 0, TAU); g.fill();
    }
  }
}
