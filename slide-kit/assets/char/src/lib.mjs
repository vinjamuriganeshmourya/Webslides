// Geometry and SVG helpers for the character generator.
// Design space = the reference frame: 1086 x 1448, figure centred on x = 531, ground at y = 1394.
export const W = 1086, H = 1448, CX = 531, GROUND = 1394;

export const n = v => String(Math.round(v * 10) / 10);
export const pt = p => n(p[0]) + ' ' + n(p[1]);
export const ident = p => p;
export const mirror = ([x, y]) => [2 * CX - x, y];
export const rot = (deg, [cx, cy]) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  return ([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};
export const scale = (k, [cx, cy]) => ([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k];
export const move = (dx, dy) => ([x, y]) => [x + dx, y + dy];
export const comp = (...fs) => p => fs.reduceRight((q, f) => f(q), p);
// rotation (degrees, clockwise on screen) and handedness of an affine point transform
export const frame = t => {
  const o = t([0, 0]), y = t([0, 1]), x = t([1, 0]);
  const ang = Math.atan2(-(y[0] - o[0]), y[1] - o[1]) * 180 / Math.PI;
  const det = (x[0] - o[0]) * (y[1] - o[1]) - (x[1] - o[1]) * (y[0] - o[0]);
  return { ang, flip: det < 0, k: Math.hypot(y[0] - o[0], y[1] - o[1]) };
};

// transform every coordinate pair of an absolute M/L/C/Q/Z path
export function tp(d, t) {
  return d.replace(/([MLCQ])\s*([^MLCQZ]*)/g, (m, c, a) => {
    const v = a.trim().split(/[\s,]+/).map(Number), o = [];
    for (let i = 0; i < v.length; i += 2) o.push(pt(t([v[i], v[i + 1]])));
    return c + o.join(' ');
  }).replace(/\s+/g, ' ').replace(/ Z/g, 'Z').trim();
}
export const chain = ps => { let d = 'M' + pt(ps[0]); for (let i = 1; i < ps.length; i += 3) d += 'C' + pt(ps[i]) + ' ' + pt(ps[i + 1]) + ' ' + pt(ps[i + 2]); return d; };
export const tail = ps => { let d = 'L' + pt(ps[0]); for (let i = 1; i < ps.length; i += 3) d += 'C' + pt(ps[i]) + ' ' + pt(ps[i + 1]) + ' ' + pt(ps[i + 2]); return d; };

/* ---------- palette: sampled from the reference render ---------- */
export const PALETTE = {
  'skin-hi': '#FEE1BE', 'skin-light': '#FDD6B0', skin: '#FCC49D', 'skin-mid': '#F3B896', 'skin-shade': '#E7A380', 'skin-deep': '#C97656',
  blush: '#F29583', lip: '#D27F68', mouth: '#8E3A44', tongue: '#E27F7A', 'ear-inner': '#C3684B', nail: '#FDE3D3',
  'hair-hi': '#7C86B8', 'hair-light': '#56669F', hair: '#404878', 'hair-shade': '#2D335A', 'hair-deep': '#202441', brow: '#262947',
  lash: '#1E2148', pupil: '#171B3F', 'iris-deep': '#204E81', iris: '#2E6BA6', 'iris-mid': '#3F8FCB', 'iris-light': '#8BD5E6',
  'eye-white': '#FFFFFF', 'eye-shade': '#D3CAC6',
  'hoodie-hi': '#FDCE67', 'hoodie-light': '#FEAD35', hoodie: '#F99F2D', 'hoodie-shade': '#E8912B', 'hoodie-deep': '#D27217', 'hoodie-ao': '#AE4E05', 'hood-inner': '#7F2C00',
  tee: '#FBF1E8', 'tee-shade': '#F0D9C8',
  'steel-hi': '#E6E9F0', steel: '#B9BECB', 'steel-shade': '#7C8399',
  'jeans-rim': '#506190', 'jeans-light': '#364467', jeans: '#2C3957', 'jeans-deep': '#20283F', 'jeans-ao': '#192236',
  'shoe-light': '#EA5A44', shoe: '#D73D2E', 'shoe-shade': '#B5332B', 'shoe-deep': '#7E2622',
  rubber: '#FDF8F2', 'rubber-shade': '#E7DED4', 'rubber-deep': '#CEC0BA', stripe: '#5B6687', lace: '#FAF7F3', 'lace-shade': '#D8CFCA',
  ground: '#D9D5DE',
};

/* ---------- defs registry ---------- */
export class Defs {
  constructor() { this.items = new Map(); this.seq = 0; }
  add(id, xml) { if (!this.items.has(id)) this.items.set(id, xml); return id; }
  stops(list) { return list.map(([o, c, a = 1]) => `<stop offset="${n(o * 100) / 100}" class="s-${c}"${a < 1 ? ` stop-opacity="${n(a * 100) / 100}"` : ''}/>`).join(''); }
  // user-space linear / radial gradients; `tpl` is the id of a stops template
  lin(id, p1, p2, stopsOrTpl) {
    const body = typeof stopsOrTpl === 'string' ? ` href="#${stopsOrTpl}"/>` : `>${this.stops(stopsOrTpl)}</linearGradient>`;
    return this.add(id, `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(p1[0])}" y1="${n(p1[1])}" x2="${n(p2[0])}" y2="${n(p2[1])}"${body}`);
  }
  rad(id, c, r, stopsOrTpl, f) {
    const body = typeof stopsOrTpl === 'string' ? ` href="#${stopsOrTpl}"/>` : `>${this.stops(stopsOrTpl)}</radialGradient>`;
    const fo = f ? ` fx="${n(f[0])}" fy="${n(f[1])}"` : '';
    return this.add(id, `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}"${fo}${body}`);
  }
  tpl(id, kind, stops) { return this.add(id, `<${kind}Gradient id="${id}">${this.stops(stops)}</${kind}Gradient>`); }
  // soft blob: bounding-box radial that fades to nothing at the rim
  soft(color, a = 0.5, mid = 0.55) {
    const id = `soft-${color}-${Math.round(a * 100)}`;
    return this.add(id, `<radialGradient id="${id}">${this.stops([[0, color, a], [mid, color, a * 0.5], [1, color, 0]])}</radialGradient>`);
  }
  // bounding-box linear fade, used by vertical / horizontal shadow bands
  fade(color, a, dir = 'v', b = 0) {
    const id = `fade-${color}-${Math.round(a * 100)}-${Math.round(b * 100)}-${dir}`;
    const v = dir === 'v' ? 'x1="0" y1="0" x2="0" y2="1"' : dir === 'u' ? 'x1="0" y1="1" x2="0" y2="0"' : dir === 'h' ? 'x1="0" y1="0" x2="1" y2="0"' : 'x1="1" y1="0" x2="0" y2="0"';
    return this.add(id, `<linearGradient id="${id}" ${v}>${this.stops([[0, color, a], [1, color, b]])}</linearGradient>`);
  }
  clip(id, inner) { return this.add(id, `<clipPath id="${id}">${inner}</clipPath>`); }
  xml() { return [...this.items.values()]; }
}

/* ---------- element helpers ---------- */
// fill spec: '#id' = gradient, anything else = palette colour class
const fillAttr = f => f == null ? '' : f[0] === '#' ? ` fill="url(${f})"` : ` class="f-${f}"`;
const extra = o => o ? Object.entries(o).map(([k, v]) => ` ${k}="${v}"`).join('') : '';
export const P = (d, fill, t = ident, o) => `<path${fillAttr(fill)}${extra(o)} d="${tp(d, t)}"/>`;
export const raw = (d, fill, o) => `<path${fillAttr(fill)}${extra(o)} d="${d}"/>`;
export const C = (c, r, fill, t = ident, o) => { const q = t(c); return `<circle${fillAttr(fill)}${extra(o)} cx="${n(q[0])}" cy="${n(q[1])}" r="${n(r)}"/>`; };
// ellipse with baked rotation; survives mirrored / rotated transforms
export const E = (c, rx, ry, deg, fill, t = ident, o) => {
  const q = t(c), f = frame(t), a = (f.flip ? -deg : deg) + f.ang;
  const tr = Math.abs(a) > 0.05 ? ` transform="rotate(${n(a)} ${pt(q)})"` : '';
  return `<ellipse${fillAttr(fill)}${extra(o)} cx="${n(q[0])}" cy="${n(q[1])}" rx="${n(rx * f.k)}" ry="${n(ry * f.k)}"${tr}/>`;
};
// thin line in a palette colour (never an outline: only seams, stitches, laces, lip and lid lines)
export const LN = (d, color, w, t = ident, o) => `<path class="ln k-${color}" stroke-width="${w}"${extra(o)} d="${tp(d, t)}"/>`;

/* ---------- rig groups ---------- */
export const bones = [];
export function G(id, pivot, kids, t = ident, o) {
  const p = t(pivot);
  bones.push({ id, pivot: [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10] });
  return [
    `<g id="${id}" data-pivot="${pt(p)}" style="transform-origin:${n(p[0])}px ${n(p[1])}px"${extra(o)}>`,
    ...kids.flat(Infinity).filter(Boolean).map(l => '  ' + l),
    `</g>`,
  ];
}
// plain (non-rig) group
export const g = (attrs, kids) => [`<g${extra(attrs)}>`, ...kids.flat(Infinity).filter(Boolean).map(l => '  ' + l), `</g>`];
