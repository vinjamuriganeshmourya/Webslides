// The other characters' face drawings (cast.js). The same three layers as the first character's
// (face.js): the drawing with the eye openings cut out, the eye layer behind it, the glint layer.
// Every position is the character's own, measured on his picture, in the model's centimetres; the
// drawing is laid on the head FACE_DY lower, as the first character's is.
import { PALETTE } from './model.js';
import { cast } from './cast.js';

const FS = 1024, EW = 1024, EH = 512, PX = 0.1222, TAU = Math.PI * 2, RAD = Math.PI / 180;
const rgba = (name, a = 1) => { const n = parseInt((PALETTE[name] || name).slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
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

export function drawCastFace(face, v, jaw) {
  const F = cast().face, U = F.uv, E = F.eyeUv, I = F.iris, TOP = F.top, BOT = F.bot, LASH = F.lash;
  const c = face.ctx, s = FS / U.size, soft = face.soft.bind(face);
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.fillStyle = PALETTE.skin; c.fillRect(0, 0, FS, FS);
  c.setTransform(s, 0, 0, -s, -U.x0 * s, (U.y0 + U.size) * s);
  c.lineCap = 'round'; c.lineJoin = 'round';
  const side = (sg, fn) => { c.save(); c.scale(sg, 1); fn(sg < 0 ? 'r' : 'l', sg); c.restore(); };
  const lids = n => {
    const up = v[`eyelid-upper-${n}`] / 100, low = v[`eyelid-lower-${n}`] / 100 * 0.24;
    return { E: TOP.map((p, i) => lerp2(p, BOT[i], Math.min(1, up))), B: BOT.map((p, i) => lerp2(p, TOP[i], low)), open: up + low < 0.985, up };
  };

  // blush, the only colour laid on the skin
  const [bx, by, brx, bry, ba] = F.blush;
  for (const sg of [-1, 1]) side(sg, n => soft(c, bx, by + v[`cheek-${n}`] * PX, brx, bry, 0, 'blush', ba));

  // nose: its shade, the nostrils, the light on the tip; a long nose also shades its sides
  const N = F.nose;
  if (N.bridge) for (const sg of [-1, 1]) soft(c, sg * 0.95, N.y + 2.4, 0.42, 2.4, sg * 4, 'skin-shade', 0.32);
  soft(c, 0, N.y, N.w * 0.85, 0.52, 0, 'skin-deep', 0.42);
  soft(c, -N.nostril, N.y + 0.1, 0.32, 0.21, -12, 'skin-deep', 0.75); soft(c, N.nostril, N.y + 0.1, 0.32, 0.21, 12, 'skin-deep', 0.7);
  soft(c, N.tip[0], N.tip[1], 0.6, 0.45, 0, 'skin-hi', 0.7);

  // mouth: a closed smile line; an opening grows under it with the jaw
  const M = F.mouth, w = M.w, y = M.y, sc = (y - M.dip) / 0.41, cTop = y - 0.82 * sc, cBot = y - 1.45 * sc, d = jaw * 0.067 * M.open;
  if (d > 0.05) {
    c.save(); c.beginPath(); c.moveTo(-w * 1.1, y + 0.06); c.quadraticCurveTo(0, cTop - 0.1, w * 1.1, y + 0.06); c.quadraticCurveTo(0, cTop - 0.1 - 2.1 * d, -w * 1.1, y + 0.06); c.closePath(); c.clip();
    c.fillStyle = PALETTE.mouth; c.fillRect(-w * 1.6, y - 6, w * 3.2, 7);
    c.fillStyle = PALETTE['eye-white']; c.beginPath(); c.moveTo(-w, y + 0.06); c.quadraticCurveTo(0, cTop - 0.02, w, y + 0.06); c.lineTo(w * 0.94, y - 0.52); c.quadraticCurveTo(0, cTop - 0.5, -w * 0.94, y - 0.52); c.closePath(); c.fill();
    soft(c, 0, cTop - 0.25 - d * 0.95, w * 0.5, 0.52, 0, 'tongue', 1);
    c.restore();
    c.strokeStyle = rgba('lip', 0.7); c.lineWidth = 0.22; c.beginPath(); c.moveTo(-w * 1.02, y); c.quadraticCurveTo(0, cTop - 0.12 - 2.0 * d, w * 1.02, y); c.stroke();
  }
  soft(c, 0, M.lower - d + 0.15, w * 0.55, 0.42, 0, 'lip-soft', 0.55); soft(c, 0, M.lower - d + 0.1, w * 0.33, 0.2, 0, 'skin-hi', 0.75); soft(c, 0, M.lower - d - 0.5, w * 0.62, 0.36, 0, 'skin-shade', 0.6);
  c.save(); c.shadowColor = rgba('lip', 0.5); c.shadowBlur = 0.05 * s;
  c.fillStyle = PALETTE.lip; c.beginPath(); c.moveTo(-w, y); c.quadraticCurveTo(0, cTop, w, y); c.quadraticCurveTo(0, cBot, -w, y); c.closePath(); c.fill(); c.restore();
  for (const sg of [-1, 1]) side(sg, n => {
    c.translate(w, y); c.rotate(-v[`lip-corner-${n}`] * RAD); c.translate(-w, -y);
    c.strokeStyle = PALETTE.lip; c.lineWidth = 0.15; c.beginPath(); c.moveTo(w, y); c.quadraticCurveTo(w + 0.26, y + 0.1, w + 0.44, y + 0.28); c.stroke();
    soft(c, w + 0.6, y + 0.26, 0.3, 0.26, 0, 'skin-deep', 0.45);
  });

  // eyes: lid shade, the opening cut out, crease, lower line, lower lashes, lash band with its wing
  const L = {}, topY = Math.max(...TOP.map(p => p[1])), cx0 = (TOP[0][0] + TOP[7][0]) / 2;
  for (const sg of [-1, 1]) side(sg, n => {
    const q = L[n] = lids(n), Ee = q.E, B = q.B, O = Ee.map((p, i) => [p[0] + (LASH[i][0] - TOP[i][0]), p[1] + (LASH[i][1] - TOP[i][1]) * (1 - 0.3 * q.up)]);
    c.save(); c.beginPath(); loop(c, [...TOP, ...BOT.slice().reverse()]); c.clip();
    c.fillStyle = rgba('skin-shade', 0.3); c.fillRect(1.5, topY - 5, 7.5, 6); c.restore();
    soft(c, cx0, topY + 0.75, 2.75, 0.7, -4, 'skin-shade', 0.3);
    if (q.open) { c.save(); c.globalCompositeOperation = 'destination-out'; c.fillStyle = '#000'; c.beginPath(); loop(c, [...Ee, ...B.slice().reverse()]); c.fill(); c.restore(); }
    // the crease above the lid
    c.strokeStyle = rgba('skin-deep', 0.5); c.lineWidth = 0.09; c.beginPath();
    through(c, LASH.slice(1, 7).map((p, i) => [p[0] + 0.05, p[1] + F.crease * (0.42 + 0.12 * Math.sin(Math.PI * i / 5)) - q.up * 1.4]), true); c.stroke();
    c.strokeStyle = rgba('skin-deep', 0.62); c.lineWidth = 0.085; c.beginPath(); through(c, B.slice(2).map(p => [p[0], p[1] - 0.05]), true); c.stroke();
    c.strokeStyle = rgba('lash', 0.7); c.lineWidth = 0.06;
    for (const k of [5, 6]) { const a = B[k], b = BOT[k]; c.beginPath(); c.moveTo(a[0], a[1] - 0.04); c.lineTo(a[0] + 0.18, a[1] - 0.04 - F.lowerLash * 0.45 + (a[1] - b[1]) * 0); c.stroke(); }
    c.fillStyle = PALETTE.lash; c.beginPath(); through(c, O, true); through(c, Ee.slice().reverse(), false); c.closePath(); c.fill();
    const wp = Ee[7]; c.beginPath(); c.moveTo(wp[0] - 0.05, wp[1] - 0.1); c.lineTo(wp[0] + F.wing[0], wp[1] + F.wing[1] + 0.2); c.lineTo(wp[0] - 0.1, wp[1] - 0.4); c.closePath(); c.fill();
  });

  // brows: an outer and an inner half, hinged in the middle
  const BT = F.browTop, BB = F.browBot, BH = F.browHinge;
  for (const sg of [-1, 1]) side(sg, n => {
    c.fillStyle = PALETTE.brow; c.translate(0, v[`brow-${n}`] * PX);
    const half = (ang, x0, x1) => { c.save(); c.translate(...BH); c.rotate(ang * RAD); c.translate(-BH[0], -BH[1]); c.beginPath(); c.rect(x0, BH[1] - 4, x1 - x0, 8); c.clip(); c.beginPath(); through(c, BT, true); through(c, BB, false); c.closePath(); c.fill(); c.restore(); };
    half(-v[`brow-outer-${n}`], BH[0] - 0.02, 10.5); half(v[`brow-inner-${n}`], 1, BH[0] + 0.02);
  });

  /* ----- the eye layer: white, iris, pupil ----- */
  const e = face.ectx, ex = EW / E.w, ey = EH / E.h;
  e.setTransform(1, 0, 0, 1, 0, 0); e.fillStyle = PALETTE['eye-white']; e.fillRect(0, 0, EW, EH);
  e.setTransform(ex, 0, 0, -ey, -E.x0 * ex, (E.y0 + E.h) * ey);
  const g = face.gctx; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, EW / 2, EH / 2); g.setTransform(ex / 2, 0, 0, -ey / 2, -E.x0 * ex / 2, (E.y0 + E.h) * ey / 2);
  const oy = I.y - 146.5;                                 // the first character's eye-layer layout, moved to this character's eyes
  for (const [n, sg] of [['r', -1], ['l', 1]]) {
    const q = L[n], top = q.E[3][1], cx = sg * I.x + v[`gaze-x-${n}`] * PX, cy = I.y - v[`gaze-y-${n}`] * PX, R = I.ry, ps = 1 + v[`pupil-${n}`] / 100;
    face.iris[n][0] = cx; face.iris[n][1] = cy;
    // the lid's shade on the white: warm, so where it meets a brown iris the edge stays brown, never grey
    let gr = e.createLinearGradient(0, top + 0.1, 0, top - 2.6); gr.addColorStop(0, '#9C7A70'); gr.addColorStop(0.32, '#CDB3A8'); gr.addColorStop(0.8, '#EEE8E4'); gr.addColorStop(1, rgba('eye-white', 1));
    e.fillStyle = gr; e.fillRect(sg > 0 ? 1.2 : -9.3, 143.4 + oy, 8.1, 7);
    soft(e, sg * (TOP[7][0] + 0.1), I.y, 1.05, 1.9, 0, '#B49C94', 0.85); soft(e, sg * (TOP[0][0] - 0.1), I.y, 0.6, 1.5, 0, '#C8B4AC', 0.7);
    // iris: dark at the top under the lid, warm and bright at the bottom where light comes through
    e.save(); e.translate(cx, cy); e.scale(I.rx / I.ry, 1); e.translate(-cx, -cy);
    e.beginPath(); e.arc(cx, cy, R, 0, TAU); e.clip();
    gr = e.createLinearGradient(0, cy + R, 0, cy - R); gr.addColorStop(0, rgba('iris-ring', 1)); gr.addColorStop(0.3, PALETTE['iris-deep']); gr.addColorStop(0.55, PALETTE.iris); gr.addColorStop(0.8, PALETTE['iris-mid']); gr.addColorStop(1, PALETTE['iris-light']);
    e.fillStyle = gr; e.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    gr = e.createRadialGradient(cx, cy - 0.95 * R, 0.05, cx, cy - 0.95 * R, 1.2 * R); gr.addColorStop(0, rgba('iris-light', 0.85)); gr.addColorStop(0.55, rgba('iris-mid', 0.4)); gr.addColorStop(1, rgba('iris-mid', 0));
    e.fillStyle = gr; e.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    e.strokeStyle = 'rgba(255,230,200,0.08)'; e.lineWidth = 0.035;
    for (let k = 0; k < 40; k++) { const a = k / 40 * TAU, r0 = R * (0.55 + 0.1 * ((k * 7) % 5) / 5); e.beginPath(); e.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); e.lineTo(cx + Math.cos(a) * R * 0.93, cy + Math.sin(a) * R * 0.93); e.stroke(); }
    gr = e.createRadialGradient(cx, cy, R * 0.72, cx, cy, R); gr.addColorStop(0, rgba('iris-ring', 0)); gr.addColorStop(0.7, rgba('iris-ring', 0.75)); gr.addColorStop(1, rgba('pupil', 0.95));
    e.fillStyle = gr; e.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    gr = e.createLinearGradient(0, top + 0.2, 0, top - 1.5); gr.addColorStop(0, rgba('pupil', 0.8)); gr.addColorStop(1, rgba('pupil', 0));
    e.fillStyle = gr; e.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    e.restore();
    e.save(); e.shadowColor = rgba('iris-ring', 0.9); e.shadowBlur = 0.1 * ex;
    e.fillStyle = PALETTE.pupil; e.beginPath(); e.ellipse(cx, cy - 0.02, 0.8 * ps, 0.86 * ps, 0, 0, TAU); e.fill(); e.restore();
    // two highlights, at the same place in both eyes
    g.fillStyle = '#FFFFFF';
    g.beginPath(); g.arc(cx - 0.62, cy + 0.62, 0.33, 0, TAU); g.fill(); g.beginPath(); g.arc(cx + 0.5, cy + 0.78, 0.2, 0, TAU); g.fill();
  }
}
