// The character as blended 3D shapes, one continuous mesh per material.
// Shapes: body.js (clothes, hands) and headmodel.js (head, hair). This file is the palette, the
// list of parts with their material, and the mesher run.
import { buildMesh, openEdges } from './sdf.js';
import { SIDES, landmarks, boneSpecs } from './skeleton.js';
import { hoodie, hoodieSurface, strings, aglets, jeans, jeansSurface, shoes, shoeSurface, hand, plainSurface } from './body.js';
import { head, hair, hairSurface, locks } from './headmodel.js';
import { cast, castName } from './cast.js';
import { castParts } from './outfits.js';

/* ---------- palette: sampled from the reference render (lit surfaces) ---------- */
export const PALETTE = {
  'skin-hi': '#FEDCB8', skin: '#FDCDA9', 'skin-shade': '#EDA683', 'skin-deep': '#CC7A5A', blush: '#F58E84', lip: '#C8594A', 'lip-soft': '#F2A08A', mouth: '#8E3A44', tongue: '#E27F7A', nail: '#FDE0D2',
  'hair-hi': '#8C97CC', 'hair-light': '#5A69A4', hair: '#262C57', 'hair-shade': '#272B4E', brow: '#2A2D50',
  lash: '#1A1D42', pupil: '#151A31', 'iris-ring': '#1B4479', 'iris-deep': '#23508C', iris: '#2D6BB0', 'iris-mid': '#4CA3DA', 'iris-light': '#8DD6E8', 'eye-white': '#FBF8F5', 'eye-shade': '#C9C2C6',
  'hoodie-light': '#FFB23A', hoodie: '#F89C24', 'hoodie-shade': '#E88F2A', 'hoodie-deep': '#C7650F', tee: '#F5E8DA',
  steel: '#8A92A6', 'jeans-light': '#3A4A73', jeans: '#1D2E53', 'jeans-deep': '#1C2440',
  shoe: '#B92F22', 'shoe-deep': '#8A2A22', rubber: '#FBF5EC', 'rubber-shade': '#D5CBC4', lace: '#FAF6F0', stripe: '#39405F',
};
// each character brings its own palette on top of the first character's (cast.js)
const BASE_PALETTE = { ...PALETTE };
export function applyPalette() { for (const k of Object.keys(PALETTE)) delete PALETTE[k]; Object.assign(PALETTE, BASE_PALETTE, cast().palette || {}); }
const lin1 = v => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
export const lin = name => { const h = PALETTE[name], n = parseInt(h.slice(1), 16); return [lin1((n >> 16) / 255), lin1(((n >> 8) & 255) / 255), lin1((n & 255) / 255)]; };
// occluded colour = base multiplied towards the deep tone of the same hue (never towards black)
export const tint = (base, deep, k = 1) => { const a = lin(base), b = lin(deep); return a.map((v, i) => 1 - k * (1 - Math.min(1, b[i] / v))); };

/* ---------- parts: shapes, mesh density, what the surface is made of ---------- */
export function characterParts() {
  if (castName() !== 'mustard') return castParts(lin);              // the other characters: outfits.js
  const L = locks();
  const parts = {
    hoodie: { prims: hoodie(lin), cell: 0.5, ao: { strength: 1.25, reach: 1.6 }, surface: hoodieSurface, material: 'fleece' },
    jeans: { prims: jeans(lin), cell: 0.62, ao: { strength: 1, reach: 1.3 }, surface: jeansSurface, material: 'denim' },
    shoes: { prims: shoes(lin), cell: 0.26, ao: { strength: 0.9, reach: 0.9 }, surface: shoeSurface, material: 'shoe' },
    head: { prims: head(), cell: 0.36, symmetric: true, shadeSmooth: 6, ao: { strength: 0.45, reach: 0.6 }, surface: plainSurface, material: 'face' },
    // hair: big smooth clumps need no finer mesh than this, and one step onto the surface is enough
    hair: { prims: hair(lin, L), cell: 0.36, refine: 2, shadeSmooth: 8, ao: { strength: 1.35, reach: 1.2 }, surface: hairSurface(L), material: 'hair' },
    strings: { prims: strings(lin), cell: 0.14, ao: { strength: 0.6, reach: 0.6 }, surface: plainSurface, material: 'cord' },
    aglets: { prims: aglets(lin), cell: 0.09, ao: { strength: 0.3, reach: 0.4 }, surface: plainSurface, material: 'steel' },
  };
  for (const [n, s] of SIDES) {
    const Lm = landmarks(s);
    parts[`hand-${n}`] = { prims: hand(lin, n, s), cell: 0.17, frame: [Lm.d, Lm.T, Lm.N], ao: { strength: 0.9, reach: 0.5 }, surface: plainSurface, material: 'skin' };
  }
  // what shades what
  const P = parts, solid = k => P[k].prims.filter(q => q.op !== 'sub');
  // The clothes were approved with the baked shade they have. It is still computed against the head and
  // hair of that version, so restyling the head cannot change a single value on the hoodie.
  const was = q => q.filter(r => r.op !== 'sub');
  P.hoodie.occluders = [...solid('hoodie'), ...was(head(true)), ...was(hair(lin, locks(true)))];
  P.jeans.occluders = [...solid('jeans'), ...solid('hoodie'), ...solid('shoes')];
  P.shoes.occluders = [...solid('shoes'), ...solid('jeans')];
  P.head.occluders = [...solid('head'), ...solid('hair'), ...solid('hoodie')];
  P.hair.occluders = [...solid('hair'), ...solid('head')];
  P.strings.occluders = [...solid('strings'), ...solid('hoodie')];
  P.aglets.occluders = [...solid('aglets'), ...solid('hoodie')];
  for (const [n] of SIDES) P[`hand-${n}`].occluders = [...solid(`hand-${n}`), ...solid('hoodie')];
  return parts;
}

// Where two blended shapes meet in a sharp crease the field can have no slope, and the vertex no normal:
// it would shade black. Such a vertex takes the normal of the triangles round it. (Other characters only;
// the first character's meshes are left exactly as they were approved.)
function fixNormals(m) {
  const P = m.positions, N = m.normals, I = m.indices, n = P.length / 3, acc = new Float32Array(n * 3);
  let bad = 0; for (let i = 0; i < n; i++) if (Math.hypot(N[i * 3], N[i * 3 + 1], N[i * 3 + 2]) < 0.5) bad++;
  if (!bad) return;
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3, ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2], vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx;
    for (const k of [a, b, c]) { acc[k] += fx; acc[k + 1] += fy; acc[k + 2] += fz; }
  }
  for (let i = 0; i < n; i++) if (Math.hypot(N[i * 3], N[i * 3 + 1], N[i * 3 + 2]) < 0.5) { const l = Math.hypot(acc[i * 3], acc[i * 3 + 1], acc[i * 3 + 2]) || 1; N[i * 3] = acc[i * 3] / l; N[i * 3 + 1] = acc[i * 3 + 1] / l; N[i * 3 + 2] = acc[i * 3 + 2] / l; }
}

// run the mesher for every part: plain typed arrays, no three.js needed
export function buildCharacterData() {
  applyPalette();
  const specs = boneSpecs(), bones = Object.fromEntries(specs.map((b, i) => [b.name, i])), parts = characterParts(), out = {};
  for (const [name, part] of Object.entries(parts)) {
    const t = Date.now(), m = buildMesh(part.prims, { cell: part.cell, frame: part.frame, bones, occluders: part.occluders, ao: part.ao, symmetric: part.symmetric, shadeSmooth: part.shadeSmooth, refine: part.refine });
    // surface description, vertex by vertex: grain axis, ribbing, seam distance, occlusion (see material.js)
    const n = m.positions.length / 3, axis = new Float32Array(n * 3), rib = new Float32Array(n * 4), fx = new Float32Array(n * 4);
    const o = { axis: [0, 1, 0], rib: [1, 0, 1, 0], seam: 99, kind: 0, sewn: 1, strand: 0, run: 0 }, P = m.positions, N = m.normals;
    let col2 = null, blk = null, own = null;                                       // a second colour and the distance to where it starts (see material.js, FAB_BLOCKS)
    for (let i = 0; i < n; i++) {
      o.strand = 0; o.run = 0; o.sewn = 1; o.col = null; o.col2 = null; o.blk = 9; o.open = null;
      part.surface(P[i * 3], P[i * 3 + 1], P[i * 3 + 2], N[i * 3], N[i * 3 + 1], N[i * 3 + 2], o);
      if (o.col) m.colors.set(o.col, i * 3);                          // a surface may paint its own colour (colour-blocked cloth)
      if (o.col2) { if (!col2) { col2 = new Float32Array(n * 3); blk = new Float32Array(n).fill(9); own = new Uint8Array(n); } col2.set(o.col2, i * 3); blk[i] = o.blk; own[i] = 1; }
      axis.set(o.axis, i * 3);
      if (part.material === 'hair') { rib[i * 4] = o.strand; rib[i * 4 + 1] = o.run; rib[i * 4 + 2] = 0; rib[i * 4 + 3] = 0; } else rib.set(o.rib, i * 4);
      // (o.open: a surface may lighten its own baked shade, a lining lit from the front)
      fx[i * 4] = Math.max(-9, Math.min(9, o.seam)); fx[i * 4 + 1] = o.open == null ? m.occlusion[i] : 1 - (1 - m.occlusion[i]) * o.open; fx[i * 4 + 2] = o.kind; fx[i * 4 + 3] = o.sewn;
    }
    // A vertex with no seam near it carries "far". Give that the sign of its seamed neighbours, or the
    // jump from a negative distance to a positive "far" would draw a false seam between them.
    const I = m.indices;
    for (let pass = 0; pass < 2; pass++) for (let t3 = 0; t3 < I.length; t3 += 3) for (let e = 0; e < 3; e++) {
      const a = I[t3 + e], b = I[t3 + (e + 1) % 3];
      if (fx[a * 4] >= 9 && fx[b * 4] < 0) fx[a * 4] = -9; else if (fx[b * 4] >= 9 && fx[a * 4] < 0) fx[b * 4] = -9;
    }
    if (castName() !== 'mustard') fixNormals(m);
    out[name] = { ...m, axis, rib, fx, material: part.material, ms: Date.now() - t, open: openEdges(m.indices) };
    if (col2) { for (let i = 0; i < n; i++) if (!own[i]) col2.set(m.colors.subarray(i * 3, i * 3 + 3), i * 3); out[name].col2 = col2; out[name].blk = blk; }
  }
  return { specs, meshes: out, parts };
}
