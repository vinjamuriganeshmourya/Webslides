// Body art: legs, pelvis, torso, hoodie details, arms, hands.
// Everything is drawn in "local straight" coordinates for the character's RIGHT side
// (screen left) and baked into the rest pose with a point transform; the left side is the mirror.
import { CX, GROUND, n, pt, ident, mirror, rot, move, comp, chain, tail, P, raw, C, E, LN, G, g } from './lib.mjs';

/* ---------- shared shading templates ---------- */
// Profile = colour against distance from the limb axis (0 = centre, 1 = edge). The linear
// template shades a segment across its width and the radial one shades the ball at a joint,
// so a segment and its joint always meet in the same colour.
export function materials(D) {
  const prof = {
    hoodie: [[0, 'hoodie-light'], [0.6, 'hoodie'], [1, 'hoodie']],
    jeans: [[0, 'jeans'], [0.6, 'jeans'], [0.93, 'jeans-light'], [1, 'jeans-light']],
    skin: [[0, 'skin-light'], [0.55, 'skin'], [1, 'skin-mid']],
  };
  for (const [m, p] of Object.entries(prof)) {
    D.tpl(`cyl-${m}`, 'linear', [...p.slice().reverse().map(([r, c]) => [0.5 - r / 2, c]), ...p.slice(1).map(([r, c]) => [0.5 + r / 2, c])]);
    D.tpl(`sph-${m}`, 'radial', p);
  }
  // torso: light from screen right, so the left flank falls into shade
  D.lin('lg-torso', [435, 500], [627, 500], [[0, 'hoodie-deep'], [0.08, 'hoodie-shade'], [0.26, 'hoodie'], [0.62, 'hoodie-light'], [0.93, 'hoodie-light'], [1, 'hoodie-hi']]);
}

/* ---------- building blocks ---------- */
// tapered strip hugging one edge of a part: ambient occlusion on inner sides, rim light on outer ones
export function sliver(D, key, t, edge, inward, w0, w1, color, a, w2 = w0) {
  const last = edge.length - 1;
  const off = edge.map(([x, y], i) => [x + inward * (i === 0 ? w0 : i === last ? w2 : w1), y]);
  const m = edge.length >> 1, mid = [(edge[m - 1][0] + edge[m][0]) / 2, (edge[m - 1][1] + edge[m][1]) / 2];
  const gid = D.lin(`lg-${key}`, t(mid), t([mid[0] + inward * w1, mid[1]]), [[0, color, a], [1, color, 0]]);
  return raw(chain(edge.map(t)) + tail(off.map(t).reverse()) + 'Z', '#' + gid);
}
// sphere at a joint; sits UNDER both bodies and only shows in the wedge that opens on a bend
export const ball = (D, key, t, c, r, mat, rref) => C(c, r, '#' + D.rad(`rg-${key}`, t(c), rref, `sph-${mat}`), t);
// one limb segment between two joints, flat at both ends
export function seg(D, id, t, flip, o) {
  const ext = ps => ps.map((p, i) => i === ps.length - 1 ? [p[0], p[1] + (o.ext ?? 1.5)] : p);
  const d = chain(ext(o.L).map(t)) + tail(ext(o.R).map(t).reverse()) + 'Z';
  const mid = [(o.top[0] + o.bot[0]) / 2, (o.top[1] + o.bot[1]) / 2];
  const gid = D.lin(`lg-${id}`, t([mid[0] - o.rref, mid[1]]), t([mid[0] + o.rref, mid[1]]), `cyl-${o.mat}`);
  D.clip(`c-${id}`, `<use href="#b-${id}"/>`);
  const over = [];
  if (o.ao) over.push(sliver(D, `${id}-ao`, t, o.R, -1, o.ao.w0, o.ao.w1, o.ao.c, o.ao.a, o.ao.w2 ?? o.ao.w0));
  const rim = o.rim && (flip ? o.rim.lit : o.rim.dim);
  if (rim) over.push(sliver(D, `${id}-rim`, t, o.L, 1, rim.w0 ?? rim.w, rim.w, rim.c, rim.a));
  if (o.over) over.push(o.over);
  return [raw(d, '#' + gid, { id: `b-${id}` }), ...g({ 'clip-path': `url(#c-${id})` }, over)];
}
// a filled shape plus shading that is clipped to it
export function lit(D, id, d, fill, t, over) {
  D.clip(`c-${id}`, `<use href="#b-${id}"/>`);
  return [P(d, fill, t, { id: `b-${id}` }), ...g({ 'clip-path': `url(#c-${id})` }, over)];
}

/* ---------- leg ---------- */
export function leg(D, side) {
  const flip = side === 'l', M = flip ? mirror : ident;
  const Hp = [479, 745], K = [479, 1015], A = [479, 1296], LEAN = 4.8;
  const tL = comp(M, rot(LEAN, Hp));
  const Aw = rot(LEAN, Hp)(A);
  const tS = comp(M, move(Aw[0] - A[0], GROUND - 1396));     // shoe stays level on the ground
  const soft = (c, a) => '#' + D.soft(c, a);
  const u = (x, y) => [479 + x, 1296 + y];
  const q = pts => pts.map(([x, y]) => pt(u(x, y))).join(' ');

  /* shoe, drawn around the ankle: u = across (negative = outward), v = down */
  const upper = `M${q([[-28, 4]])}L${q([[24, 4]])}C${q([[30, 20], [34, 42], [35, 60]])}L${q([[36, 80]])}L${q([[-80, 80]])}L${q([[-80, 70]])}C${q([[-80, 58], [-76, 48], [-68, 40]])}C${q([[-56, 28], [-42, 16], [-28, 4]])}Z`;
  const sole = `M${q([[-81.5, 75]])}C${q([[-60, 82], [-20, 84.5], [7, 82]])}C${q([[18, 81], [28, 76], [36.5, 69]])}L${q([[37, 90]])}C${q([[37, 96], [32, 100], [26, 100]])}L${q([[-62, 100]])}C${q([[-75.5, 100], [-81.5, 95], [-81.5, 85]])}Z`;
  const cap = `M${q([[-81.5, 77]])}C${q([[-81.5, 62], [-73, 51], [-58, 46.5]])}C${q([[-40, 41.5], [-18, 44], [-6, 53]])}C${q([[2, 59], [6, 70], [7, 83]])}C${q([[-20, 85.5], [-60, 83.5], [-81.5, 77]])}Z`;
  const eyeL = [[-32, 12], [-38, 21], [-44, 30], [-50, 39]], eyeR = [[5, 12], [6, 22], [7, 32], [7, 42]];
  const laces = [];
  for (let i = 0; i < 4; i++) {
    laces.push(`M${q([eyeL[i]])}L${q([eyeR[i]])}`);
    if (i < 3) laces.push(`M${q([eyeL[i]])}L${q([eyeR[i + 1]])}`, `M${q([eyeR[i]])}L${q([eyeL[i + 1]])}`);
  }
  const toes = G(`toes-${side}`, u(-30, 50), [
    ...lit(D, `toecap-${side}`, cap, '#' + D.rad(`rg-toecap-${side}`, tS(u(-30, 56)), 56, [[0, 'rubber'], [0.62, 'rubber'], [1, 'rubber-shade']]), tS, [
      E(u(-72, 72), 12, 10, 20, soft('rubber-deep', 0.55), tS),
      E(u(2, 72), 9, 14, 0, soft('rubber-deep', 0.6), tS),
      E(u(-36, 50), 26, 5, -3, soft('eye-white', 0.95), tS),
    ]),
  ], tS);
  const foot = G(`foot-${side}`, A, [
    ...lit(D, `shoe-${side}`, upper, '#' + D.lin(`lg-shoe-${side}`, tS(u(-76, 40)), tS(u(36, 40)), flip
      ? [[0, 'shoe-shade'], [0.3, 'shoe'], [0.75, 'shoe-light'], [1, 'shoe']]
      : [[0, 'shoe'], [0.3, 'shoe-light'], [0.62, 'shoe'], [1, 'shoe-shade']]), tS, [
      P(`M${q([[-34, 2]])}L${q([[28, 2]])}L${q([[32, 22]])}L${q([[-46, 22]])}Z`, '#' + D.fade('shoe-deep', 0.8, 'v'), tS),
      E(u(27, 52), 12, 32, 0, soft('shoe-deep', 0.6), tS),
      P(`M${q([[-30, 9]])}L${q([[3, 9]])}L${q([[5, 46]])}L${q([[-52, 46]])}Z`, '#' + D.fade('shoe-light', 0.55, 'v', 0.2), tS),
      LN(`M${q([[15, 8]])}C${q([[21, 30], [23, 52], [21, 74]])}`, 'shoe-deep', 1.4, tS, { opacity: 0.5 }),
      E(u(-62, 50), 16, 6, -38, soft('shoe-deep', 0.35), tS),
    ]),
    LN(laces.join(''), 'lace-shade', 3.9, tS, { transform: 'translate(0 1.1)' }),
    LN(laces.join(''), 'lace', 2.9, tS),
    [...eyeL, ...eyeR].map(e => C(u(...e), 2, 'steel', tS)),
    ...lit(D, `sole-${side}`, sole, '#' + D.lin(`lg-sole-${side}`, tS(u(0, 74)), tS(u(0, 100)), [[0, 'rubber'], [0.55, 'rubber-shade'], [1, 'rubber-deep']]), tS, [
      E(u(31, 86), 10, 20, 0, soft('rubber-deep', 0.65), tS),
    ]),
    LN(`M${q([[-79.5, 81]])}C${q([[-60, 87.5], [-20, 90], [7, 87.5]])}C${q([[17, 86.5], [27, 82], [35.5, 75.5]])}`, 'stripe', 2.1, tS, { opacity: 0.85 }),
    toes,
  ], tL);

  const shin = G(`shin-${side}`, K, [
    foot,
    ...seg(D, `shin-${side}`, tL, flip, {
      L: [[438, 1015], [438, 1110], [440, 1205], [440, 1306]], R: [[520, 1015], [520, 1110], [518, 1205], [518, 1306]],
      top: K, bot: A, rref: 43, mat: 'jeans',
      ao: { w0: 14, w1: 30, c: 'jeans-deep', a: 0.8 },
      rim: { lit: { w: 12, c: 'jeans-rim', a: 0.9 }, dim: { w: 8, c: 'jeans-rim', a: 0.3 } },
      over: [
        E([470, 1040], 26, 6, 8, soft('jeans-deep', 0.4), tL),
        E([484, 1262], 32, 6, -4, soft('jeans-deep', 0.5), tL), E([476, 1273], 26, 3.5, -2, soft('jeans-rim', 0.3), tL),
        E([480, 1284], 30, 5, 4, soft('jeans-deep', 0.5), tL),
        P('M438 1298L520 1298L520 1307L438 1307Z', '#' + D.fade('jeans-ao', 0.6, 'u'), tL),
        LN('M441 1297L517 1297', 'jeans-rim', 1.2, tL, { opacity: 0.55 }),
        LN('M444.5 1020C444.5 1110 446.5 1205 446.5 1294', 'jeans-rim', 1.1, tL, { opacity: 0.3 }),
      ],
    }),
  ], tL);

  return G(`thigh-${side}`, Hp, [
    ball(D, `knee-${side}`, tL, K, 41, 'jeans', 43),
    ...seg(D, `thigh-${side}`, tL, flip, {
      L: [[431, 745], [430, 835], [435, 925], [438, 1015]], R: [[527, 745], [526, 835], [522, 925], [520, 1015]],
      top: Hp, bot: K, rref: 43, mat: 'jeans',
      ao: { w0: 16, w1: 34, c: 'jeans-deep', a: 0.8 },
      rim: { lit: { w: 12, c: 'jeans-rim', a: 0.9 }, dim: { w: 8, c: 'jeans-rim', a: 0.3 } },
      over: [
        E([508, 778], 22, 5, -28, soft('jeans-deep', 0.4), tL), E([500, 802], 24, 5, -22, soft('jeans-deep', 0.35), tL),
        E([468, 992], 28, 6, -6, soft('jeans-deep', 0.35), tL), E([474, 980], 24, 4, -4, soft('jeans-rim', 0.22), tL),
        LN('M437.5 750C436.5 835 441.5 925 444.5 1012', 'jeans-rim', 1.1, tL, { opacity: 0.3 }),
      ],
    }),
    shin,
  ], tL);
}

/* ---------- hand ---------- */
function digit(D, name, side, tH, pivot, lens, rs, ang, flex) {
  const t = comp(tH, rot(ang, pivot));
  const [x, y0] = pivot, ys = [y0];
  lens.forEach((l, i) => ys.push(ys[i] + l));
  const names = lens.length === 3 && name !== 'thumb' ? ['prox', 'mid', 'dist'] : ['meta', 'prox', 'dist'];
  let child = null;
  for (let i = lens.length - 1; i >= 0; i--) {
    const last = i === lens.length - 1, r = rs[i], y = ys[i], yb = ys[i + 1], id = `${name}-${names[i]}-${side}`;
    const gid = '#' + D.lin(`lg-${id}`, t([x - r, y]), t([x + r, y]), 'cyl-skin');
    const kids = [];
    if (!last) kids.push(ball(D, `${id}-j`, t, [x, yb], rs[i + 1], 'skin', rs[i + 1]));
    if (last) {
      const e = yb - r, c = e + r * 1.33;
      kids.push(P(`M${x - r} ${y}L${x + r} ${y}L${x + r} ${e}C${x + r} ${c} ${x - r} ${c} ${x - r} ${e}Z`, gid, t));
      const nw = r * (name === 'thumb' ? 0.52 : 0.6), n0 = yb - r * (name === 'thumb' ? 1.75 : 1.6), n1 = yb - r * 0.5;
      kids.push(P(`M${x - nw} ${n0 + 2}Q${x - nw} ${n0} ${x} ${n0}Q${x + nw} ${n0} ${x + nw} ${n0 + 2}L${x + nw} ${n1 - 2.4}Q${x + nw} ${n1} ${x} ${n1}Q${x - nw} ${n1} ${x - nw} ${n1 - 2.4}Z`,
        '#' + D.lin(`lg-${id}-nail`, t([x, n0]), t([x, n1]), [[0, 'skin-mid'], [0.35, 'nail'], [1, 'nail']]), t, { class: 'nail', opacity: 0.9 }));
    } else {
      kids.push(P(`M${x - r} ${y}L${x + r} ${y}L${x + rs[i + 1]} ${yb}L${x - rs[i + 1]} ${yb}Z`, gid, t));
      // soft crease on the side the joint closes towards
      kids.push(E([x + flex * rs[i + 1] * 0.55, yb], rs[i + 1] * 0.5, 1.6, 0, '#' + D.soft('skin-shade', 0.55), t));
    }
    if (child) kids.push(child);
    child = G(id, [x, y], kids, t);
  }
  return child;
}

export function hand(D, side, tH) {
  const flip = side === 'l', soft = (c, a) => '#' + D.soft(c, a);
  // knuckle pivot, segment lengths, radii, rest fan angle
  const fingers = [
    ['pinky', [422.6, 749], [17, 12, 11], [5.9, 5.5, 5.2], 8],
    ['ring', [436, 753], [22, 15, 13], [6.8, 6.4, 6], 3],
    ['middle', [449.3, 755], [24, 16, 14], [6.9, 6.5, 6.1], 0],
    ['index', [462.8, 754], [22, 15, 13], [6.8, 6.4, 6], -4],
  ];
  const palm = 'M423 700C417 716 413 734 415.5 749L429.4 749L429.4 753L442.6 753L442.6 755L456 755L456 754L469.5 754C472 738 468 718 461 700Z';
  return [
    fingers.map(f => ball(D, `knuckle-${f[0]}-${side}`, comp(tH, rot(f[4], f[1])), f[1], f[3][0], 'skin', f[3][0])),
    ...lit(D, `palm-${side}`, palm, '#' + D.rad(`rg-palm-${side}`, tH([446, 724]), 46, [[0, 'skin-light'], [0.55, 'skin'], [1, 'skin-mid']]), tH, [
      P('M414 698L472 698L472 714L414 714Z', '#' + D.fade('skin-deep', 0.5, 'v'), tH),
      sliver(D, `palm-${side}-edge`, tH, [[423, 700], [417, 716], [413, 734], [415.5, 749]], 1, 6, 12, flip ? 'skin-hi' : 'skin-shade', flip ? 0.7 : 0.6),
      sliver(D, `palm-${side}-in`, tH, [[461, 700], [468, 718], [472, 738], [469.5, 754]], -1, 5, 11, 'skin-shade', 0.45),
    ]),
    fingers.map(f => digit(D, `finger-${f[0]}`, side, tH, f[1], f[2], f[3], f[4], 1)),
    g({ class: 'knuckles' }, fingers.map(f => E(comp(rot(f[4], f[1]))([f[1][0], f[1][1] - 2.5]), f[3][0] * 0.95, f[3][0] * 0.8, 0, soft('skin-hi', 0.75), tH))),
    digit(D, 'thumb', side, tH, [459, 703], [34, 22, 19], [10.5, 9.6, 8.9], -13, -1),
  ];
}

/* ---------- arm ---------- */
export function arm(D, side) {
  const flip = side === 'l', M = flip ? mirror : ident;
  const S = [442, 362], El = [442, 534], Wr = [442, 700], HANG = 14.7;
  const tA = comp(M, rot(HANG, S));
  const soft = (c, a) => '#' + D.soft(c, a);
  const rim = { lit: { w: 10, c: 'hoodie-hi', a: 0.95 }, dim: { w: 8, c: 'hoodie-light', a: 0.45 } };

  const ribs = [417, 423, 429, 435, 441, 447, 453, 459, 465].map(x => `M${x} 664L${x + (x - 442) * -0.1} 701`).join('');
  const cuff = G(`cuff-${side}`, [442, 660], [
    ...lit(D, `cuff-${side}`, 'M411 660C411 655 473 655 473 660L468 702C468 709 416 709 416 702Z',
      '#' + D.lin(`lg-cuff-${side}`, tA([411, 680]), tA([473, 680]), 'cyl-hoodie'), tA, [
        P('M408 652L476 652L476 666L408 666Z', '#' + D.fade('hoodie-ao', 0.36, 'v'), tA),
        P('M410 692L474 692L474 710L410 710Z', '#' + D.fade('hoodie-deep', 0.6, 'u'), tA),
        LN(ribs, 'hoodie-deep', 1.5, tA, { opacity: 0.4 }),
      ]),
  ], tA);

  const forearm = G(`forearm-${side}`, El, [
    G(`hand-${side}`, Wr, hand(D, side, tA), tA),
    ...seg(D, `forearm-${side}`, tA, flip, {
      L: [[409, 534], [409, 578], [409, 622], [411, 662]], R: [[475, 534], [476, 578], [476, 622], [473, 662]],
      top: El, bot: [442, 662], rref: 35, mat: 'hoodie',
      ao: { w0: 18, w1: 18, w2: 14, c: 'hoodie-ao', a: 0.28 }, rim,
      over: [
        E([446, 645], 32, 5, -6, soft('hoodie-deep', 0.42), tA), E([442, 635], 26, 3.5, 0, soft('hoodie-hi', 0.32), tA),
        E([438, 625], 28, 4.5, 6, soft('hoodie-deep', 0.3), tA),
        E([454, 556], 14, 4, 20, soft('hoodie-deep', 0.25), tA),
      ],
    }),
    cuff,
  ], tA);

  const upper = G(`upper-arm-${side}`, S, [
    ball(D, `elbow-${side}`, tA, El, 33, 'hoodie', 35),
    ...seg(D, `upper-arm-${side}`, tA, flip, {
      L: [[407, 362], [406, 420], [408, 478], [409, 534]], R: [[477, 362], [477, 420], [476, 478], [475, 534]],
      top: S, bot: El, rref: 35, mat: 'hoodie',
      ao: { w0: 0, w1: 18, w2: 18, c: 'hoodie-ao', a: 0.28 }, rim,
      over: [E([452, 512], 16, 4, 14, soft('hoodie-deep', 0.25), tA)],
    }),
    forearm,
  ], tA);

  return G(`clavicle-${side}`, [497, 342], [
    ball(D, `shoulder-${side}`, M, S, 35, 'hoodie', 35),
    upper,
  ], M);
}

/* ---------- pelvis and torso ---------- */
export function pelvisShapes(D) {
  const soft = (c, a) => '#' + D.soft(c, a);
  return [
    ball(D, 'hip-r', ident, [479, 745], 48, 'jeans', 43), ball(D, 'hip-l', mirror, [479, 745], 48, 'jeans', 43),
    ...lit(D, 'pelvis', 'M437 656L625 656C628 690 630 720 631 746L562 746C560 763 548 775 531 775C514 775 502 763 500 746L431 746C432 720 434 690 437 656Z',
      '#' + D.lin('lg-pelvis', [431, 700], [631, 700], [[0, 'jeans-light'], [0.12, 'jeans'], [0.7, 'jeans'], [0.92, 'jeans-light'], [1, 'jeans-rim']]), ident, [
        P('M425 680L637 680L637 722L425 722Z', '#' + D.fade('jeans-ao', 0.9, 'v'), ident),
        E([531, 760], 20, 16, 0, soft('jeans-deep', 0.7), ident),
        LN('M531 686C532 705 533 722 531 734C529 742 524 746 517 747', 'jeans-rim', 1.3, ident, { opacity: 0.45 }),
        LN('M446 690C451 703 462 710 477 711', 'jeans-rim', 1.3, ident, { opacity: 0.4 }),
        LN('M616 690C611 703 600 710 585 711', 'jeans-rim', 1.3, ident, { opacity: 0.45 }),
      ]),
  ];
}

export function torso(D, parts) {
  const soft = (c, a) => '#' + D.soft(c, a);
  const T = '#lg-torso';
  const ribs = Array.from({ length: 27 }, (_, i) => 441 + i * 7).map(x => `M${x} 655L${x} 681`).join('');

  const hem = G('hem', [531, 652], [
    ...lit(D, 'hem', 'M435.5 642C433.5 656 433.5 672 438 680Q440 684 446 684L616 684Q622 684 624 680C628.5 672 628.5 656 626.5 642Z', T, ident, [
      P('M430 649L632 649L632 659L430 659Z', '#' + D.fade('hoodie-deep', 0.5, 'v'), ident),
      P('M430 668L632 668L632 686L430 686Z', '#' + D.fade('hoodie-deep', 0.65, 'u'), ident),
      LN(ribs, 'hoodie-deep', 1.5, ident, { opacity: 0.38 }),
      E([590, 664], 40, 8, 0, soft('hoodie-hi', 0.3), ident),
    ]),
  ]);

  const pocket = G('pocket', [531, 576], [
    ...lit(D, 'pocket', 'M484 576L578 576Q584 576 587 582L606 640Q608 648 604 651L458 651Q454 648 456 640L475 582Q478 576 484 576Z', T, ident, [
      E([540, 610], 62, 34, 0, soft('hoodie-hi', 0.22), ident),
      P('M450 636L612 636L612 652L450 652Z', '#' + D.fade('hoodie-deep', 0.4, 'u'), ident),
      P('M479.5 579C472 598 464 620 458.5 643C464.5 624 471.5 603 480.8 582Z', 'hoodie-ao', ident, { opacity: 0.6 }),
      P('M582.5 579C590 598 598 620 603.5 643C597.5 624 590.5 603 581.2 582Z', 'hoodie-ao', ident, { opacity: 0.5 }),
      E([473, 612], 6, 30, 17, soft('hoodie-ao', 0.26), ident), E([589, 612], 6, 30, -17, soft('hoodie-ao', 0.22), ident),
      LN('M486 577.5L576 577.5', 'hoodie-deep', 2.2, ident, { opacity: 0.5 }),
      LN('M488 582.5L574 582.5', 'hoodie-shade', 1.2, ident, { opacity: 0.8, 'stroke-dasharray': '4 3' }),
    ]),
  ]);

  const string = side => {
    const x = side === 'r' ? 509 : 553, ys = [354, 378, 402, 426];
    const fill = '#' + D.lin(`lg-string-${side}`, [x - 2.9, 0], [x + 2.9, 0], [[0, 'hoodie-deep'], [0.45, 'hoodie-light'], [1, 'hoodie-shade']]);
    let child = null;
    for (let i = 2; i >= 0; i--) {
      const kids = [P(`M${x - 2.8} ${ys[i]}L${x + 2.8} ${ys[i]}L${x + 2.8} ${ys[i + 1]}L${x - 2.8} ${ys[i + 1]}Z`, fill)];
      if (i < 2) kids.unshift(C([x, ys[i + 1]], 2.8, fill));
      if (i === 2) kids.push(P(`M${x - 3.3} 425Q${x - 3.3} 423 ${x} 423Q${x + 3.3} 423 ${x + 3.3} 425L${x + 3.3} 438.5Q${x + 3.3} 441 ${x} 441Q${x - 3.3} 441 ${x - 3.3} 438.5Z`,
        '#' + D.lin(`lg-aglet-${side}`, [x - 3.3, 0], [x + 3.3, 0], [[0, 'steel-shade'], [0.35, 'steel-hi'], [0.65, 'steel'], [1, 'steel-shade']])));
      if (child) kids.push(child);
      child = G(`drawstring-${side}-${i + 1}`, [x, ys[i]], kids);
    }
    return [C([x, 353.5], 4, '#' + D.soft('hoodie-ao', 0.9, 0.7)), child];
  };

  const roll = 'M446 326C450 313 460 298 476 291C480 289 484 288.5 487 289C491 296 497 308 504 319C512 331 522 343 531 352L534 359C518 356 502 350 487 343C470 336 456 331 446 326Z';
  const ridge = [[487, 289], [491, 296], [497, 308], [504, 319], [512, 331], [522, 343], [531, 352]];
  const hoodFront = G('hood', [531, 320], [
    ...lit(D, 'hood-roll-r', roll, '#' + D.lin('lg-roll-r', [500, 312], [474, 344], [[0, 'hoodie-light'], [0.35, 'hoodie'], [1, 'hoodie-deep']]), ident, [
      sliver(D, 'roll-r-in', ident, ridge, -1, 2, 5, 'hoodie-hi', 0.55),
      E([462, 322], 22, 7, -32, soft('hoodie-deep', 0.35), ident),
    ]),
    ...lit(D, 'hood-roll-l', roll, '#' + D.lin('lg-roll-l', mirror([500, 312]), mirror([474, 344]), [[0, 'hoodie-hi'], [0.3, 'hoodie-light'], [0.6, 'hoodie'], [1, 'hoodie-deep']]), mirror, [
      sliver(D, 'roll-l-in', mirror, ridge, -1, 3, 8, 'hoodie-hi', 0.9),
    ]),
  ]);

  const spine3 = G('spine-3', [531, 452], [
    G('hood-back', [531, 320], [
      P('M480 292C494 281 514 277 531 277C548 277 568 281 582 292L566 336L496 336Z',
        '#' + D.lin('lg-hood-in', [531, 278], [531, 336], [[0, 'hood-inner'], [0.75, 'hood-inner'], [1, 'hoodie-ao']])),
    ]),
    ...lit(D, 'chest', 'M445 470Q445 478 453 478L609 478Q617 478 617 470L617 430C622 410 634 392 638 372L640 345L622 330L600 322L582 318L480 318L462 322L440 330L422 345L424 372C428 392 440 410 445 430Z', T, ident, [
      E([531, 368], 60, 12, 0, soft('hoodie-ao', 0.5), ident), E([478, 346], 34, 9, 22, soft('hoodie-ao', 0.5), ident), E([584, 346], 34, 9, -22, soft('hoodie-ao', 0.4), ident),
      E([574, 414], 58, 40, -14, soft('hoodie-hi', 0.3), ident),
      E([446, 444], 5, 38, 3, soft('hoodie-ao', 0.3), ident), E([616, 444], 5, 38, -3, soft('hoodie-ao', 0.24), ident),
    ]),
    parts.neck,
    P('M504 322C512 331 520 334 531 334C542 334 550 331 558 322L552 338L531 357L510 338Z',
      '#' + D.lin('lg-tee', [531, 318], [531, 356], [[0, 'tee-shade'], [0.5, 'tee'], [1, 'tee']]), ident, { id: 'tee' }),
    hoodFront,
    string('r'), string('l'),
    parts.armR, parts.armL,
  ]);

  const spine2 = G('spine-2', [531, 548], [
    ...lit(D, 'belly', 'M445 452L617 452C618 485 619 520 620 548L620 566Q620 574 612 574L450 574Q442 574 442 566L442 548C443 520 444 485 445 452Z', T, ident, [
      E([512, 522], 84, 48, 0, soft('hoodie-shade', 0.32), ident),
    ]),
    spine3,
  ]);

  return G('spine-1', [531, 668], [
    ...lit(D, 'waist', 'M442 548L620 548C622 585 625 620 627 648L627 654L435 654L435 648C437 620 440 585 442 548Z', T, ident, [
      E([531, 600], 90, 30, 0, soft('hoodie-hi', 0.16), ident),
    ]),
    pocket,
    hem,
    spine2,
  ]);
}
