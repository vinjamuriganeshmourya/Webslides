// Implicit modelling: shapes described by distance, blended smoothly, then turned into a mesh.
// The whole character is built this way, so every garment is ONE continuous surface:
// a sleeve does not meet the torso at a seam, it grows out of it.
//
// A shape ("prim") carries what the mesh needs later: the bone it follows, its colour and how
// softly it blends. Skin weights and vertex colours come from which shapes a vertex belongs to.

const BIG = 1e3;
export const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(a[0], a[1], a[2]),
  norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
  // a + u*x + v*y + w*z, for points given in a local frame
  at: (o, x, u, y, v, z, w) => [o[0] + x[0] * u + y[0] * v + z[0] * w, o[1] + x[1] * u + y[1] * v + z[1] * w, o[2] + x[2] * u + y[2] * v + z[2] * w],
};
const IDENT = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
// k = blend radius with what is already there, sigma = how far its bone weight reaches,
// csig = how far its colour reaches, op 'sub' carves instead of adding
const prim = (p, o) => ({ op: 'add', k: 1, sigma: 1.2, csig: 0.3, bone: null, color: null, ...o, ...p });

export function sphere(c, r, o) {
  return prim({ sd: (x, y, z) => Math.hypot(x - c[0], y - c[1], z - c[2]) - r, lo: [c[0] - r, c[1] - r, c[2] - r], hi: [c[0] + r, c[1] + r, c[2] + r] }, o);
}
// capsule with a different radius at each end
export function cone(a, b, r1, r2 = r1, o) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2], l2 = bx * bx + by * by + bz * bz, rr = r1 - r2, a2 = l2 - rr * rr, il2 = 1 / l2, R = Math.max(r1, r2);
  return prim({
    sd: (x, y, z) => {
      const px = x - a[0], py = y - a[1], pz = z - a[2], yy = px * bx + py * by + pz * bz, zz = yy - l2;
      const qx = px * l2 - bx * yy, qy = py * l2 - by * yy, qz = pz * l2 - bz * yy, x2 = qx * qx + qy * qy + qz * qz;
      const y2 = yy * yy * l2, z2 = zz * zz * l2, k = Math.sign(rr) * rr * rr * x2;
      if (Math.sign(zz) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
      if (Math.sign(yy) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
      return (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - r1;
    },
    lo: [Math.min(a[0], b[0]) - R, Math.min(a[1], b[1]) - R, Math.min(a[2], b[2]) - R],
    hi: [Math.max(a[0], b[0]) + R, Math.max(a[1], b[1]) + R, Math.max(a[2], b[2]) + R],
  }, o);
}
// a tapered capsule squashed along `out` (flat < 1): a lock of hair, pointed and lying flat
export function blade(a, b, r1, r2, out, flat, o) {
  const c = cone(a, b, r1, r2, o), sd = c.sd, k = 1 / flat - 1;
  c.sd = (x, y, z) => { const h = ((x - a[0]) * out[0] + (y - a[1]) * out[1] + (z - a[2]) * out[2]) * k; return sd(x + out[0] * h, y + out[1] * h, z + out[2] * h) * flat; };
  return c;
}
export function ellipsoid(c, r, axes = IDENT, o) {
  const [ax, ay, az] = axes, R = Math.max(r[0], r[1], r[2]), mn = Math.min(r[0], r[1], r[2]);
  return prim({
    sd: (x, y, z) => {
      const px = x - c[0], py = y - c[1], pz = z - c[2];
      const u = (px * ax[0] + py * ax[1] + pz * ax[2]) / r[0], v = (px * ay[0] + py * ay[1] + pz * ay[2]) / r[1], w = (px * az[0] + py * az[1] + pz * az[2]) / r[2];
      const k0 = Math.hypot(u, v, w);
      if (k0 < 1e-6) return -mn;
      return k0 * (k0 - 1) / Math.hypot(u / r[0], v / r[1], w / r[2]);
    },
    lo: [c[0] - R, c[1] - R, c[2] - R], hi: [c[0] + R, c[1] + R, c[2] + R],
  }, o);
}
// box with rounded edges; `half` is the half size before rounding by `rad`
export function rbox(c, half, rad, axes = IDENT, o) {
  const [ax, ay, az] = axes, R = Math.hypot(half[0], half[1], half[2]) + rad;
  return prim({
    sd: (x, y, z) => {
      const px = x - c[0], py = y - c[1], pz = z - c[2];
      const u = Math.abs(px * ax[0] + py * ax[1] + pz * ax[2]) - half[0], v = Math.abs(px * ay[0] + py * ay[1] + pz * ay[2]) - half[1], w = Math.abs(px * az[0] + py * az[1] + pz * az[2]) - half[2];
      return Math.hypot(Math.max(u, 0), Math.max(v, 0), Math.max(w, 0)) + Math.min(Math.max(u, v, w), 0) - rad;
    },
    lo: [c[0] - R, c[1] - R, c[2] - R], hi: [c[0] + R, c[1] + R, c[2] + R],
  }, o);
}
// elliptical ring lying in the local x-z plane; tall > 1 stretches the tube along local y (a band)
export function ring(c, axes, rx, rz, tube, tall = 1, o) {
  const [ax, ay, az] = axes, R = Math.max(rx, rz) + tube * Math.max(1, tall);
  return prim({
    sd: (x, y, z) => {
      const px = x - c[0], py = y - c[1], pz = z - c[2];
      const u = px * ax[0] + py * ax[1] + pz * ax[2], v = (px * ay[0] + py * ay[1] + pz * ay[2]) / tall, w = px * az[0] + py * az[1] + pz * az[2];
      const l = Math.hypot(u, w) || 1e-6, cu = u / l, cw = w / l, re = rx * rz / Math.hypot(rz * cu, rx * cw);
      return Math.hypot(l - re, v) - tube;
    },
    lo: [c[0] - R, c[1] - R, c[2] - R], hi: [c[0] + R, c[1] + R, c[2] + R],
  }, o);
}

// A solid lofted along local y: at every height the cross-section is a superellipse
//   |x / a|^n + |(z - z0) / c|^n = 1        (c = cf in front of z0, cb behind it)
// prof(y, out) fills out = [a, cf, cb, z0, n]. The front outline is a(y) and the side profile is
// z0 + cf / z0 - cb, so a head or a torso is drawn the way a character sheet shows it: front and side.
// Ends are flat where the profile stops with a > 0 and rounded where it runs to zero.
export function loft(c, axes, y0, y1, prof, o) {
  const [ax, ay, az] = axes, P = new Float64Array(5), h = 0.06;
  let cz = 1, a = 1, dz = 0, n = 2;
  const rho = (u, v, w) => {
    prof(v < y0 ? y0 : v > y1 ? y1 : v, P);
    a = P[0] > 2e-3 ? P[0] : 2e-3; dz = w - P[3]; cz = dz >= 0 ? P[1] : P[2]; if (cz < 2e-3) cz = 2e-3; n = P[4];
    return Math.pow(Math.pow(Math.abs(u) / a, n) + Math.pow(Math.abs(dz) / cz, n), 1 / n);
  };
  const sd = (x, y, z) => {
    const px = x - c[0], py = y - c[1], pz = z - c[2];
    const u = px * ax[0] + py * ax[1] + pz * ax[2], v = px * ay[0] + py * ay[1] + pz * ay[2], w = px * az[0] + py * az[1] + pz * az[2];
    const vc = v < y0 ? y0 : v > y1 ? y1 : v;
    const dv = (rho(u, vc + h, w) - rho(u, vc - h, w)) / (2 * h), r = rho(u, vc, w);
    const k = r > 1e-6 ? Math.pow(r, 1 - n) : 0, du = k * Math.pow(Math.abs(u), n - 1) / Math.pow(a, n), dw = k * Math.pow(Math.abs(dz), n - 1) / Math.pow(cz, n);
    const d = (r - 1) / Math.max(Math.hypot(du, dv, dw), 1 / (4 * Math.max(a, cz))), e = Math.max(y0 - v, v - y1);
    return e > 0 ? Math.hypot(Math.max(d, 0), e) : Math.max(d, e);
  };
  // bounds, from the profile
  let A = 0, lo = 1e9, hi = -1e9;
  for (let i = 0; i <= 40; i++) { prof(y0 + (y1 - y0) * i / 40, P); A = Math.max(A, P[0]); hi = Math.max(hi, P[3] + P[1]); lo = Math.min(lo, P[3] - P[2]); }
  const bl = [1e9, 1e9, 1e9], bh = [-1e9, -1e9, -1e9];
  for (let i = 0; i < 8; i++) {
    const u = i & 1 ? A : -A, v = i & 2 ? y1 : y0, w = i & 4 ? hi : lo;
    for (let k = 0; k < 3; k++) { const q = c[k] + ax[k] * u + ay[k] * v + az[k] * w; bl[k] = Math.min(bl[k], q); bh[k] = Math.max(bh[k], q); }
  }
  return prim({ sd, lo: bl, hi: bh }, o);
}
// smooth curve through [y, value] knots (monotone where the knots are): profiles for loft()
export function curve(knots) {
  const n = knots.length, X = knots.map(k => k[0]), Y = knots.map(k => k[1]), m = new Array(n).fill(0);
  const d = []; for (let i = 0; i < n - 1; i++) d.push((Y[i + 1] - Y[i]) / (X[i + 1] - X[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : 2 * d[i - 1] * d[i] / (d[i - 1] + d[i]);
  return x => {
    if (x <= X[0]) return Y[0]; if (x >= X[n - 1]) return Y[n - 1];
    let i = 0; while (x > X[i + 1]) i++;
    const hh = X[i + 1] - X[i], t = (x - X[i]) / hh, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * Y[i] + (t3 - 2 * t2 + t) * hh * m[i] + (-2 * t3 + 3 * t2) * Y[i + 1] + (t3 - t2) * hh * m[i + 1];
  };
}
// distance to a closed 2D outline, negative inside (points as [x, y] pairs)
export function polygon2(pts) {
  const N = pts.length;
  return (x, y) => {
    let d = 1e18, s = 1;
    for (let i = 0, j = N - 1; i < N; j = i, i++) {
      const ex = pts[j][0] - pts[i][0], ey = pts[j][1] - pts[i][1], wx = x - pts[i][0], wy = y - pts[i][1];
      const t = Math.max(0, Math.min(1, (wx * ex + wy * ey) / (ex * ex + ey * ey))), bx = wx - ex * t, by = wy - ey * t;
      d = Math.min(d, bx * bx + by * by);
      const c1 = y >= pts[i][1], c2 = y < pts[j][1], c3 = ex * wy > ey * wx;
      if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) s = -s;
    }
    return s * Math.sqrt(d);
  };
}
// a patch of even thickness lying on another shape: the base grown by `thick`, kept inside an outline
// drawn in the plane of two axes (a pocket on a curved front)
export function patch(base, thick, outline, axes, origin, round, o) {
  const [ax, ay, az] = axes;
  return prim({
    sd: (x, y, z) => {
      const px = x - origin[0], py = y - origin[1], pz = z - origin[2];
      const u = px * ax[0] + py * ax[1] + pz * ax[2], v = px * ay[0] + py * ay[1] + pz * ay[2], w = px * az[0] + py * az[1] + pz * az[2];
      return Math.max(base.sd(x, y, z) - thick, outline(u, v) - round, -w) ;
    },
    lo: base.lo.map(v => v - thick - 0.5), hi: base.hi.map(v => v + thick + 0.5),
  }, o);
}
// tighten the bounds of a shape (the mesher only evaluates a shape inside its bounds)
export const bounded = (q, lo, hi) => { q.lo = q.lo.map((v, i) => Math.max(v, lo[i])); q.hi = q.hi.map((v, i) => Math.min(v, hi[i])); return q; };

// bone weights that change along a limb: nodes are [distance along the limb, bone]. Between two nodes
// the weight slides from one bone to the next, so a bend or a twist is spread along the limb.
export function chain(origin, dir, nodes) {
  return (x, y, z, add) => {
    const t = (x - origin[0]) * dir[0] + (y - origin[1]) * dir[1] + (z - origin[2]) * dir[2], n = nodes.length;
    if (t <= nodes[0][0]) return add(nodes[0][1], 1);
    if (t >= nodes[n - 1][0]) return add(nodes[n - 1][1], 1);
    let i = 0; while (t > nodes[i + 1][0]) i++;
    const f = (t - nodes[i][0]) / (nodes[i + 1][0] - nodes[i][0]);
    add(nodes[i][1], 1 - f); add(nodes[i + 1][1], f);
  };
}

const smin = (a, b, k) => { if (k <= 0) return Math.min(a, b); const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
const smax = (a, b, k) => -smin(-a, -b, k);

// the blended field at one point
export function fieldAt(prims, x, y, z) {
  let d = BIG;
  for (let i = 0; i < prims.length; i++) {
    const q = prims[i], m = q.k + 0.01;
    if (x < q.lo[0] - m || x > q.hi[0] + m || y < q.lo[1] - m || y > q.hi[1] + m || z < q.lo[2] - m || z > q.hi[2] + m) continue;
    const di = q.sd(x, y, z);
    d = q.op === 'sub' ? smax(d, -di, q.k) : smin(d, di, q.k);
  }
  return d;
}
// ambient occlusion at one sample point: how deep inside the nearest OTHER shape it is, 0 to 1.
// `own` gives the shapes the vertex itself lies on a weight below 1 (0 when it is right on them).
function shadeAt(prims, x, y, z, reach, own) {
  let o = 0;
  for (let i = 0; i < prims.length; i++) {
    const q = prims[i];
    if (q.op === 'sub' || x < q.lo[0] - reach || x > q.hi[0] + reach || y < q.lo[1] - reach || y > q.hi[1] + reach || z < q.lo[2] - reach || z > q.hi[2] + reach) continue;
    const w = own.get(q); if (w === 0) continue;
    const v = (reach - q.sd(x, y, z)) / reach * (w === undefined ? 1 : w); if (v > o) o = v;
  }
  return o > 1 ? 1 : o;
}

const EDGES = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];

/* Build a mesh from shapes.
 *   cell      grid spacing (smaller = finer)
 *   frame     optional [ex, ey, ez]: the grid is aligned to these axes (a hand is meshed along the hand)
 *   bones     name -> index, for skin weights
 *   occluders shapes that shade this mesh (ambient occlusion); defaults to its own
 *   ao        { strength, reach } : how much solid sits in front of each vertex; returned as `occlusion` (1 = open)
 *   symmetric   grid mirrored about x = 0;   shadeSmooth   smoothing passes over the occlusion (default 2);   refine   surface steps per vertex (default 3)
 */
export function buildMesh(prims, opt) {
  const cell = opt.cell, [ex, ey, ez] = opt.frame || IDENT, pad = 2;
  const f = p => [p[0] * ex[0] + p[1] * ex[1] + p[2] * ex[2], p[0] * ey[0] + p[1] * ey[1] + p[2] * ey[2], p[0] * ez[0] + p[1] * ez[1] + p[2] * ez[2]];
  // bounds of each shape in grid coordinates
  const box = q => {
    const lo = [BIG, BIG, BIG], hi = [-BIG, -BIG, -BIG];
    for (let c = 0; c < 8; c++) { const p = f([c & 1 ? q.hi[0] : q.lo[0], c & 2 ? q.hi[1] : q.lo[1], c & 4 ? q.hi[2] : q.lo[2]]); for (let a = 0; a < 3; a++) { lo[a] = Math.min(lo[a], p[a]); hi[a] = Math.max(hi[a], p[a]); } }
    return [lo, hi];
  };
  const boxes = prims.map(box), lo = [BIG, BIG, BIG], hi = [-BIG, -BIG, -BIG];
  prims.forEach((q, i) => { if (q.op === 'sub') return; for (let a = 0; a < 3; a++) { lo[a] = Math.min(lo[a], boxes[i][0][a] - q.k * 0.3); hi[a] = Math.max(hi[a], boxes[i][1][a] + q.k * 0.3); } });
  const o = lo.map(v => v - pad * cell);
  if (opt.symmetric) o[0] = -(Math.ceil(-o[0] / cell - 0.5) + 0.5) * cell;          // grid points mirror about x = 0: a face comes out the same on both sides
  const n = [0, 1, 2].map(a => Math.ceil((hi[a] - o[a]) / cell) + pad + 1), [nx, ny, nz] = n;
  const F = new Float32Array(nx * ny * nz).fill(BIG);

  // fill the grid, one shape at a time, only where the shape can matter
  prims.forEach((q, qi) => {
    const m = q.k + cell, r = [0, 1, 2].map(a => [Math.max(0, Math.floor((boxes[qi][0][a] - m - o[a]) / cell)), Math.min(n[a] - 1, Math.ceil((boxes[qi][1][a] + m - o[a]) / cell))]);
    const sub = q.op === 'sub', k = q.k, sd = q.sd;
    for (let kk = r[2][0]; kk <= r[2][1]; kk++) {
      const fz = o[2] + kk * cell;
      for (let j = r[1][0]; j <= r[1][1]; j++) {
        const fy = o[1] + j * cell, bx = ey[0] * fy + ez[0] * fz, by = ey[1] * fy + ez[1] * fz, bz = ey[2] * fy + ez[2] * fz;
        let id = r[0][0] + nx * (j + ny * kk);
        for (let i = r[0][0]; i <= r[0][1]; i++, id++) {
          const fx = o[0] + i * cell, di = sd(bx + ex[0] * fx, by + ex[1] * fx, bz + ex[2] * fx);
          F[id] = sub ? smax(F[id], -di, k) : smin(F[id], di, k);
        }
      }
    }
  });

  /* surface nets: one vertex in every cell the surface crosses, quads across every crossed edge */
  const cellId = new Int32Array(nx * ny * nz).fill(-1), gv = [], g = new Float32Array(8);
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const b = i + nx * (j + ny * k);
    g[0] = F[b]; g[1] = F[b + 1]; g[2] = F[b + nx]; g[3] = F[b + nx + 1]; g[4] = F[b + nx * ny]; g[5] = F[b + nx * ny + 1]; g[6] = F[b + nx * ny + nx]; g[7] = F[b + nx * ny + nx + 1];
    let mask = 0; for (let c = 0; c < 8; c++) if (g[c] < 0) mask |= 1 << c;
    if (mask === 0 || mask === 255) continue;
    let sx = 0, sy = 0, sz = 0, cnt = 0;
    for (const [a, c] of EDGES) {
      if (((mask >> a) & 1) === ((mask >> c) & 1)) continue;
      const t = g[a] / (g[a] - g[c]);
      sx += (a & 1) + t * ((c & 1) - (a & 1)); sy += ((a >> 1) & 1) + t * (((c >> 1) & 1) - ((a >> 1) & 1)); sz += ((a >> 2) & 1) + t * (((c >> 2) & 1) - ((a >> 2) & 1)); cnt++;
    }
    cellId[b] = gv.length / 3; gv.push(i + sx / cnt, j + sy / cnt, k + sz / cnt);
  }
  const tris = [];
  const quad = (a, b, c, d) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; tris.push(a, b, c, a, c, d); };
  const C = (i, j, k) => cellId[i + nx * (j + ny * k)];
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const b = i + nx * (j + ny * k), s = F[b] < 0;
    if ((F[b + 1] < 0) !== s) quad(C(i, j - 1, k - 1), C(i, j, k - 1), C(i, j, k), C(i, j - 1, k));
    if ((F[b + nx] < 0) !== s) quad(C(i - 1, j, k - 1), C(i, j, k - 1), C(i, j, k), C(i - 1, j, k));
    if ((F[b + nx * ny] < 0) !== s) quad(C(i - 1, j - 1, k), C(i, j - 1, k), C(i, j, k), C(i - 1, j, k));
  }

  /* vertices: move onto the true surface, take the normal from the field, then weights, colour, shading */
  const nv = gv.length / 3, pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), col = new Float32Array(nv * 3);
  const sk = new Uint16Array(nv * 4), sw = new Float32Array(nv * 4), occl = new Float32Array(nv);
  const h = cell * 0.5, occ = opt.occluders || prims, ao = { strength: 0.9, reach: 1, ...(opt.ao || {}) };
  const fallback = opt.color || [1, 1, 1];
  const near = [], own = new Map(), IT = opt.refine ?? 3;          // steps that pull a vertex onto the surface (the last one only reads the normal)
  for (let vI = 0; vI < nv; vI++) {
    const fx = o[0] + gv[vI * 3] * cell, fy = o[1] + gv[vI * 3 + 1] * cell, fz = o[2] + gv[vI * 3 + 2] * cell;
    let x = ex[0] * fx + ey[0] * fy + ez[0] * fz, y = ex[1] * fx + ey[1] * fy + ez[1] * fz, z = ex[2] * fx + ey[2] * fy + ez[2] * fz;
    // the few shapes that can matter here
    near.length = 0;
    for (const q of prims) { const m = q.k + Math.max(q.sigma * 4, cell * 2); if (x > q.lo[0] - m && x < q.hi[0] + m && y > q.lo[1] - m && y < q.hi[1] + m && z > q.lo[2] - m && z < q.hi[2] + m) near.push(q); }
    let gx = 0, gy = 0, gz = 1;
    for (let it = 0; it < IT; it++) {
      const d = fieldAt(near, x, y, z);
      gx = fieldAt(near, x + h, y, z) - fieldAt(near, x - h, y, z); gy = fieldAt(near, x, y + h, z) - fieldAt(near, x, y - h, z); gz = fieldAt(near, x, y, z + h) - fieldAt(near, x, y, z - h);
      const gl = Math.hypot(gx, gy, gz) || 1; gx /= gl; gy /= gl; gz /= gl;
      if (it < IT - 1) { const s = Math.max(-cell, Math.min(cell, d)); x -= gx * s; y -= gy * s; z -= gz * s; }
    }
    pos[vI * 3] = x; pos[vI * 3 + 1] = y; pos[vI * 3 + 2] = z; nor[vI * 3] = gx; nor[vI * 3 + 1] = gy; nor[vI * 3 + 2] = gz;

    // which shapes does this vertex belong to: gives bone weights and colour
    const w = new Map(); let cr = 0, cg = 0, cb = 0, cw = 0;
    for (const q of near) {
      if (q.op === 'sub') continue;
      const d = Math.max(0, q.sd(x, y, z));
      if (q.bone != null && d < q.sigma * 5) {
        const a = Math.exp(-d / q.sigma) * (q.weight ?? 1);
        if (typeof q.bone === 'function') q.bone(x, y, z, (name, share) => { if (share > 1e-4) w.set(name, (w.get(name) || 0) + a * share); });
        else w.set(q.bone, (w.get(q.bone) || 0) + a);
      }
      if (q.color && d < q.csig * 6) { const a = Math.exp(-d / q.csig); cr += q.color[0] * a; cg += q.color[1] * a; cb += q.color[2] * a; cw += a; }
    }
    const top = [...w.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4), tot = top.reduce((s, e) => s + e[1], 0) || 1;
    for (let i = 0; i < 4; i++) { sk[vI * 4 + i] = top[i] ? opt.bones[top[i][0]] : 0; sw[vI * 4 + i] = top[i] ? top[i][1] / tot : 0; }
      for (const t of top) if (opt.bones[t[0]] === undefined) throw new Error('unknown bone ' + t[0]);
    if (cw > 0) { cr /= cw; cg /= cw; cb /= cw; } else { cr = fallback[0]; cg = fallback[1]; cb = fallback[2]; }

    // ambient occlusion: how much of the OTHER shapes sits in front of the surface. The shape a vertex
    // lies on is left out: a convex shape cannot shade itself, and a lofted shape's distance is only
    // exact at its surface, so counting it would paint false shade.
    // The weight rises smoothly with the vertex's distance from the shape, so shade has no hard edge.
    own.clear();
    for (const q of near) { if (q.op === 'sub') continue; const d = q.sd(x, y, z); if (d < 0.9) { const t = Math.max(0, (d - 0.12) / 0.78); own.set(q, t * t * (3 - 2 * t)); } }
    let o2 = 0;
    for (const [hh, wt] of [[0.5, 0.36], [1.2, 0.3], [2.4, 0.22], [4.2, 0.12]]) {
      const s = hh * ao.reach;
      o2 += wt * shadeAt(occ, x + gx * s, y + gy * s, z + gz * s, s, own);
    }
    occl[vI] = 1 - Math.min(1, o2 * ao.strength);
    col[vI * 3] = cr; col[vI * 3 + 1] = cg; col[vI * 3 + 2] = cb;
  }
  // smooth the occlusion over the surface (two passes with each vertex's neighbours): shade has no grain
  { const sum = new Float32Array(nv), cnt = new Uint16Array(nv);
    for (let pass = 0; pass < (opt.shadeSmooth ?? 2); pass++) {
      sum.fill(0); cnt.fill(0);
      for (let t = 0; t < tris.length; t += 3) for (let e = 0; e < 3; e++) { const a = tris[t + e], b = tris[t + (e + 1) % 3]; sum[a] += occl[b]; cnt[a]++; sum[b] += occl[a]; cnt[b]++; }
      for (let i = 0; i < nv; i++) if (cnt[i]) occl[i] = 0.4 * occl[i] + 0.6 * sum[i] / cnt[i];
    } }
  // triangles wound to face outwards
  const idx = new Uint32Array(tris.length);
  for (let t = 0; t < tris.length; t += 3) {
    const a = tris[t], b = tris[t + 1], c = tris[t + 2];
    const ux = pos[b * 3] - pos[a * 3], uy = pos[b * 3 + 1] - pos[a * 3 + 1], uz = pos[b * 3 + 2] - pos[a * 3 + 2], vx = pos[c * 3] - pos[a * 3], vy = pos[c * 3 + 1] - pos[a * 3 + 1], vz = pos[c * 3 + 2] - pos[a * 3 + 2];
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx;
    const out = fx * (nor[a * 3] + nor[b * 3] + nor[c * 3]) + fy * (nor[a * 3 + 1] + nor[b * 3 + 1] + nor[c * 3 + 1]) + fz * (nor[a * 3 + 2] + nor[b * 3 + 2] + nor[c * 3 + 2]);
    idx[t] = a; idx[t + 1] = out < 0 ? c : b; idx[t + 2] = out < 0 ? b : c;
  }
  return { positions: pos, normals: nor, colors: col, occlusion: occl, skinIndices: sk, skinWeights: sw, indices: idx, grid: n };
}

// edges that belong to one triangle only: zero means the surface is closed, so it cannot open a gap when posed
export function openEdges(indices) {
  const m = new Map();
  for (let t = 0; t < indices.length; t += 3) for (let e = 0; e < 3; e++) {
    const a = indices[t + e], b = indices[t + (e + 1) % 3], k = a < b ? a * 4294967296 + b : b * 4294967296 + a;
    m.set(k, (m.get(k) || 0) + 1);
  }
  let open = 0; for (const c of m.values()) if (c === 1) open++;
  return open;
}
