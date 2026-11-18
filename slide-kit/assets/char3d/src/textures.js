// PBR texture sets, generated when the page loads: nothing is downloaded and nothing is copied
// from a picture. Each surface gets three tileable maps made from one height field:
//   albedo     colour variation of the cloth (multiplies the part's own colour)
//   normal     the relief of the threads
//   orm        r = ambient occlusion (how deep in the weave), g = roughness, b = slow variation
// The height field is the cloth itself: knit loops for the fleece, twill ridges for the denim,
// over-and-under threads for the canvas, pores for the skin.
import * as THREE from '../vendor/three/three.module.js';

/* ---------- tileable noise ---------- */
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const tables = new Map();
function table(n, seed) { const k = n + ':' + seed; if (!tables.has(k)) { const r = rng(seed * 7919 + n), a = new Float32Array(n * n); for (let i = 0; i < a.length; i++) a[i] = r(); tables.set(k, a); } return tables.get(k); }
// value noise that repeats every `n` cells in u and `m` cells in v (u, v in 0..1)
function noise(u, v, n, m, seed) {
  const t = table(Math.max(n, m), seed), N = Math.max(n, m), x = u * n, y = v * m, x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), i0 = ((x0 % n) + n) % n, i1 = (i0 + 1) % n, j0 = ((y0 % m) + m) % m, j1 = (j0 + 1) % m;
  const a = t[j0 * N + i0], b = t[j0 * N + i1], c = t[j1 * N + i0], d = t[j1 * N + i1];
  return a + (b - a) * sx + (c - a + (a - b + d - c) * sx) * sy;
}
const fbm = (u, v, n, m, oct, seed) => { let s = 0, a = 0.5, tot = 0; for (let o = 0; o < oct; o++) { s += a * noise(u, v, n << o, m << o, seed + o); tot += a; a *= 0.5; } return s / tot; };
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const fract = x => x - Math.floor(x);

/* ---------- height fields: h(u, v) in 0..1, and what the surface looks like at that height ---------- */
const SETS = {
  // jersey knit: columns of V-shaped loops, brushed soft
  fleece: {
    size: 512, cm: 3.2, relief: 2.4,
    height(u, v) {
      const s = fract(u * 32) - 0.5, a = Math.abs(s) * 2, r = v * 40;
      const prof = a < 0.5 ? 0.62 + 0.38 * Math.pow(Math.sin(Math.PI * a), 0.6) : Math.pow(Math.sin(Math.PI * a), 0.8);
      const loops = prof * (0.6 + 0.4 * (0.5 + 0.5 * Math.cos(2 * Math.PI * (r - 0.5 * a))));
      return 0.7 * loops + 0.3 * fbm(u, v, 96, 96, 3, 11);
    },
    look(u, v, h) { const m = fbm(u, v, 5, 5, 3, 23); return { a: (0.86 + 0.14 * h) * (0.955 + 0.09 * m), r: 0.9 - 0.14 * h + 0.06 * m, slow: m }; },
  },
  // denim: steep twill ridges of indigo warp, the pale weft showing between them, slubs down the length
  denim: {
    size: 512, cm: 2.4, relief: 2.6,
    height(u, v) {
      const p = fract(40 * u + 24 * v), ridge = Math.pow(Math.sin(Math.PI * p), 1.4), thread = 0.5 + 0.5 * Math.cos(2 * Math.PI * 68 * u);
      const slub = fbm(u, v, 72, 3, 2, 31);
      return Math.min(1, ridge * (0.72 + 0.28 * thread) * (0.82 + 0.36 * slub));
    },
    look(u, v, h) {
      const p = fract(40 * u + 24 * v), speck = sstep(0.68, 0.9, 1 - Math.pow(Math.sin(Math.PI * p), 1.4)) * (0.5 + 0.5 * Math.cos(2 * Math.PI * (68 * u + 13 * Math.floor(40 * u + 24 * v))));
      const slub = fbm(u, v, 72, 3, 2, 31), m = fbm(u, v, 4, 4, 3, 41);
      return { a: (0.74 + 0.1 * h + 0.3 * speck) * (0.9 + 0.2 * slub) * (0.95 + 0.1 * m), r: 0.95 - 0.1 * h, slow: m, tint: [1 + 0.1 * speck, 1 + 0.12 * speck, 1 + 0.16 * speck] };
    },
  },
  // canvas: plain weave, each thread over one and under one
  canvas: {
    size: 256, cm: 1.6, relief: 2.8,
    height(u, v) {
      const n = 20, su = fract(u * n) - 0.5, sv = fract(v * n) - 0.5, iu = Math.floor(u * n), iv = Math.floor(v * n);
      const pu = Math.sqrt(Math.max(0, 1 - 4 * su * su)), pv = Math.sqrt(Math.max(0, 1 - 4 * sv * sv));
      const warp = pu * (0.5 + 0.5 * Math.cos(Math.PI * (v * n + iu))), weft = pv * (0.5 + 0.5 * Math.cos(Math.PI * (u * n + iv + 1)));
      return 0.85 * Math.max(warp, weft) + 0.15 * fbm(u, v, 64, 64, 2, 51);
    },
    look(u, v, h) { const m = fbm(u, v, 6, 6, 3, 53); return { a: (0.8 + 0.2 * h) * (0.96 + 0.08 * m), r: 0.94 - 0.1 * h, slow: m }; },
  },
  // skin: fine pores, almost smooth
  skin: {
    size: 256, cm: 2.2, relief: 0.5,
    height(u, v) { return 0.5 * fbm(u, v, 40, 40, 3, 61) + 0.5 * fbm(u, v, 9, 9, 2, 67); },
    look(u, v, h) { const m = fbm(u, v, 4, 4, 2, 71); return { a: 0.965 + 0.035 * h, r: 0.86 + 0.12 * (1 - h), slow: m }; },
  },
  // nylon shell of a puffer jacket: a fine ripstop grid on a smooth, slightly crinkled surface
  nylon: {
    size: 256, cm: 1.4, relief: 0.6,
    height(u, v) {
      const g = n => Math.pow(Math.abs(Math.cos(Math.PI * n)), 40), grid = Math.max(g(u * 8), g(v * 8));
      return 0.45 + 0.12 * grid + 0.3 * fbm(u, v, 6, 6, 3, 91);
    },
    look(u, v, h) { const m = fbm(u, v, 3, 3, 3, 93); return { a: 0.97 + 0.04 * h, r: 0.75 + 0.15 * (1 - h), slow: m }; },
  },
  // cotton twill (cargo trousers): fine diagonal ribs, an even colour, a little slub
  twill: {
    size: 512, cm: 2.0, relief: 2.0,
    height(u, v) {
      const p = fract(48 * u + 32 * v), ridge = Math.pow(Math.sin(Math.PI * p), 1.2), thread = 0.5 + 0.5 * Math.cos(2 * Math.PI * 80 * u);
      return Math.min(1, ridge * (0.8 + 0.2 * thread) * (0.88 + 0.24 * fbm(u, v, 64, 4, 2, 101)));
    },
    look(u, v, h) { const m = fbm(u, v, 4, 4, 3, 103); return { a: (0.86 + 0.14 * h) * (0.95 + 0.1 * m), r: 0.94 - 0.08 * h, slow: m }; },
  },
  // melton wool (the varsity jacket's body): felted, no visible weave, a soft fuzz
  wool: {
    size: 256, cm: 2.4, relief: 0.9,
    height(u, v) { return 0.55 * fbm(u, v, 48, 48, 3, 111) + 0.45 * fbm(u, v, 12, 12, 2, 113); },
    look(u, v, h) { const m = fbm(u, v, 4, 4, 3, 117); return { a: (0.9 + 0.1 * h) * (0.96 + 0.08 * m), r: 0.95, slow: m }; },
  },
  // rubber, metal, hair: a smooth surface with a little life in it
  smooth: {
    size: 128, cm: 3, relief: 0.3,
    height(u, v) { return fbm(u, v, 12, 12, 3, 81); },
    look(u, v, h) { const m = fbm(u, v, 3, 3, 2, 83); return { a: 0.97 + 0.03 * h, r: 0.9 + 0.1 * h, slow: m }; },
  },
};

function build(name) {
  const S = SETS[name], N = S.size, H = new Float32Array(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) H[j * N + i] = S.height((i + 0.5) / N, (j + 0.5) / N);
  // occlusion: a point lower than its surroundings sits in shade
  const R = Math.max(2, Math.round(N / 96)), B = new Float32Array(N * N), tmp = new Float32Array(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let s = 0; for (let k = -R; k <= R; k++) s += H[j * N + ((i + k + N) % N)]; tmp[j * N + i] = s / (2 * R + 1); }
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let s = 0; for (let k = -R; k <= R; k++) s += tmp[((j + k + N) % N) * N + i]; B[j * N + i] = s / (2 * R + 1); }
  const alb = new Uint8Array(N * N * 4), nor = new Uint8Array(N * N * 4), orm = new Uint8Array(N * N * 4), b8 = v => Math.max(0, Math.min(255, Math.round(v * 255)));
  const enc = v => (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, h = H[k], u = (i + 0.5) / N, v = (j + 0.5) / N, L = S.look(u, v, h), t = L.tint || [1, 1, 1];
    const dx = (H[j * N + (i + 1) % N] - H[j * N + (i + N - 1) % N]) * 0.5 * S.relief, dy = (H[((j + 1) % N) * N + i] - H[((j + N - 1) % N) * N + i]) * 0.5 * S.relief, l = Math.hypot(dx, dy, 1);
    nor[k * 4] = b8(0.5 - 0.5 * dx / l); nor[k * 4 + 1] = b8(0.5 - 0.5 * dy / l); nor[k * 4 + 2] = b8(0.5 + 0.5 / l); nor[k * 4 + 3] = 255;
    alb[k * 4] = b8(enc(Math.min(1, L.a * t[0]))); alb[k * 4 + 1] = b8(enc(Math.min(1, L.a * t[1]))); alb[k * 4 + 2] = b8(enc(Math.min(1, L.a * t[2]))); alb[k * 4 + 3] = 255;
    orm[k * 4] = b8(Math.max(0, Math.min(1, 0.82 + (h - B[k]) * 1.5))); orm[k * 4 + 1] = b8(L.r); orm[k * 4 + 2] = b8(L.slow); orm[k * 4 + 3] = b8(h);
  }
  const tex = (data, srgb) => { const t = new THREE.DataTexture(data, N, N, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 8; t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.needsUpdate = true; return t; };
  return { name, albedo: tex(alb, true), normal: tex(nor, false), orm: tex(orm, false), cm: S.cm, size: N };
}

const cache = new Map();
export const textureSet = name => { if (!cache.has(name)) cache.set(name, build(name)); return cache.get(name); };
export const TEXTURE_SETS = Object.fromEntries(Object.entries(SETS).map(([k, s]) => [k, { size: s.size, cm: s.cm }]));

// a small studio to reflect in the metal tips: bright above, warm at the horizon, dim below, one soft window
export function studioEnvironment(renderer) {
  const W = 64, Hh = 32, d = new Float32Array(W * Hh * 4);
  for (let j = 0; j < Hh; j++) for (let i = 0; i < W; i++) {
    const el = (0.5 - (j + 0.5) / Hh) * Math.PI, az = (i + 0.5) / W * Math.PI * 2, up = Math.sin(el);
    let v = up > 0 ? 0.3 + 0.9 * up * up : 0.3 + 0.2 * up;
    const win = Math.exp(-(Math.pow((az - 1.1) / 0.45, 2) + Math.pow((el - 0.55) / 0.4, 2))) + 0.6 * Math.exp(-(Math.pow((az - 4.4) / 0.6, 2) + Math.pow((el - 0.3) / 0.5, 2))); v += 5 * win;
    const k = (j * W + i) * 4; d[k] = v * 1.0; d[k + 1] = v * 0.98; d[k + 2] = v * (up > 0 ? 1.02 : 0.94); d[k + 3] = 1;
  }
  const t = new THREE.DataTexture(d, W, Hh, THREE.RGBAFormat, THREE.FloatType); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.LinearSRGBColorSpace; t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true;
  const pm = new THREE.PMREMGenerator(renderer), env = pm.fromEquirectangular(t).texture; pm.dispose(); t.dispose();
  return env;
}
