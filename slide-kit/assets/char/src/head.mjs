// Head art: neck, face, eyes, brows, nose, mouth, jaw, ears, hair.
import { CX, n, pt, ident, mirror, move, comp, chain, tail, tp, P, raw, C, E, LN, G, g } from './lib.mjs';
import { lit, sliver } from './body.mjs';

/* ---------- face outline, clockwise from the crown ---------- */
const FACE_PTS = [
  [531, 70], [575, 70], [604, 105], [604, 160], [604, 186], [602, 208], [597, 228],
  [591, 246], [578, 258], [566, 267], [558, 274], [546, 280], [531, 280],
  [516, 280], [504, 274], [496, 267], [484, 258], [471, 246], [465, 228],
  [460, 208], [458, 186], [458, 160], [458, 105], [487, 70], [531, 70],
];
const FACE = chain(FACE_PTS) + 'Z';
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
// split a cubic at t, returning [left, right] as 4-point arrays
function split(c, t) {
  const ab = lerp(c[0], c[1], t), bc = lerp(c[1], c[2], t), cd = lerp(c[2], c[3], t);
  const abc = lerp(ab, bc, t), bcd = lerp(bc, cd, t), m = lerp(abc, bcd, t);
  return [[c[0], ab, abc, m], [m, bcd, cd, c[3]]];
}
// The part of the face below the mouth line: it slides down when the jaw opens. Its sides sit
// inside the face by the full jaw travel, so the open jaw never pokes out past the cheeks.
const JAW_Y = 243, JAW_TRAVEL = 13, CHIN_Y = 280;
function jawPath() {
  const samples = [];                                   // right half of the outline from the cheek to the chin
  for (const c of [FACE_PTS.slice(6, 10), FACE_PTS.slice(9, 13)]) for (let i = 0; i <= 40; i++) samples.push(split(c, i / 40)[0][3]);
  const xAt = y => { for (let i = 1; i < samples.length; i++) if (samples[i][1] >= y) { const a = samples[i - 1], b = samples[i], k = (y - a[1]) / ((b[1] - a[1]) || 1); return a[0] + (b[0] - a[0]) * k; } return CX; };
  const right = [];
  for (let y = JAW_Y; y < CHIN_Y; y += 1.5) right.push([xAt(Math.min(CHIN_Y - 0.01, y + JAW_TRAVEL * (CHIN_Y - y) / (CHIN_Y - JAW_Y))), y]);
  right.push([CX, CHIN_Y]);
  const pts = [...right, ...right.slice(0, -1).reverse().map(mirror)];
  return 'M' + pts.map(pt).join('L') + 'Z';
}

/* ---------- eye ---------- */
function eye(D, side) {
  const flip = side === 'l', t = flip ? mirror : ident;
  const c = t([493.7, 195.8]);
  const open = 'M465 198.5C465.5 185.5 474.5 179 487 179C499.5 179 508.5 185.5 509.5 196.5C510 205 501.5 212 488 212C475 212 465.5 206.5 465 198.5Z';
  D.clip(`eye-${side}-clip`, `<path d="${tp(open, t)}"/>`);
  const iris = G(`iris-${side}`, [493.7, 195.8], [
    C(c, 14.8, '#' + D.rad(`rg-iris-${side}`, [c[0], c[1] + 5.5], 17.5, [[0, 'iris-light'], [0.36, 'iris-mid'], [0.7, 'iris'], [0.93, 'iris-deep'], [1, 'pupil']])),
    C(c, 14.8, '#' + D.lin(`lg-iris-${side}-top`, [c[0], c[1] - 14.8], [c[0], c[1] + 2], [[0, 'pupil', 0.7], [1, 'pupil', 0]])),
    G(`pupil-${side}`, [493.7, 195.8], [`<ellipse class="f-pupil" cx="${n(c[0])}" cy="${n(c[1] - 0.2)}" rx="6.7" ry="8.6"/>`], t),
    C([c[0] - 7.4, c[1] - 6.6], 3.1, 'eye-white'), C([c[0] + 7.2, c[1] - 6.4], 2.9, 'eye-white'),
    C([c[0] + 4.6, c[1] + 8.8], 1.3, 'eye-white', ident, { opacity: 0.6 }),
  ], t);
  return G(`eye-${side}`, [487, 196], [
    ...g({ 'clip-path': `url(#eye-${side}-clip)` }, [
      P(open, '#' + D.lin(`lg-white-${side}`, t([487, 179]), t([487, 212]), [[0, 'eye-shade'], [0.42, 'eye-white'], [1, 'eye-white']]), t),
      E([467.5, 198], 5, 11, 0, '#' + D.soft('eye-shade', 0.75), t),
      iris,
      E([487, 180], 27, 6.5, 0, '#' + D.soft('lash', 0.4), t),
      G(`eyelid-upper-${side}`, [487, 179], [
        P('M457 200C459 186 473 177 487 177C501 177 512 186 515 199L517 142L455 142Z',
          '#' + D.lin(`lg-lid-${side}`, t([487, 150]), t([487, 181]), [[0, 'skin'], [1, 'skin-mid']]), t),
      ], t),
      G(`eyelid-lower-${side}`, [487, 212], [
        P('M459 200.5C465.5 209.5 476 213.5 488 213.5C500 213.5 508.5 208.5 514 199.5L517 234L457 234Z', 'skin', t),
      ], t),
    ]),
    LN('M469.5 208.6C476.5 213.8 498.5 214.2 505.5 208.4', 'skin-deep', 1.4, t, { opacity: 0.5 }),
    LN('M468 206.8L465.4 209.4M471 209.4L469.4 212.4', 'lash', 1.3, t, { opacity: 0.85 }),
    G(`lash-upper-${side}`, [487, 179], [
      LN('M467 178C473.5 171 480.5 168.6 487.5 168.6C495.5 168.6 503 171.6 507.5 177.5', 'skin-deep', 1.5, t, { opacity: 0.5 }),
      P('M460.2 203.4C461.8 189 472.5 174.4 487 174.4C501.5 174.4 511.2 183.5 512.8 198C508.6 187.6 499.5 180.8 487 180.8C475.5 180.8 467.6 186.6 465.6 198C464.8 200.6 462.9 202.7 460.2 203.4Z', 'lash', t),
    ], t),
  ], t);
}

function brow(D, side) {
  const t = side === 'l' ? mirror : ident;
  const fill = '#' + D.lin(`lg-brow-${side}`, t([487, 155]), t([487, 169]), [[0, 'hair-shade'], [0.5, 'brow'], [1, 'brow']]);
  return G(`brow-${side}`, [487, 162], [
    G(`brow-outer-${side}`, [487.5, 160.8], [P('M462.4 171.2C468 161.4 478 156.2 489 155.8L489 165.4C479.5 165.4 470 167.4 462.4 171.2Z', fill, t)], t),
    G(`brow-inner-${side}`, [487.5, 160.8], [P('M486 155.8C496.5 155.2 506 158.2 511.2 162.4C512.2 165.4 510.8 167.5 508.4 166.9C502 165.3 494 165 486 165.4Z', fill, t)], t),
  ], t);
}

function ear(D, side) {
  const flip = side === 'l', t = flip ? mirror : ident;
  return G(`ear-${side}`, [464, 214], [
    P('M467 186C453 174 433 182 432 204C431 224 440 243 455 246C462 247 467 241 468 232Z',
      '#' + D.rad(`rg-ear-${side}`, t([458, 208]), 32, flip ? [[0, 'skin-light'], [0.6, 'skin'], [1, 'skin-mid']] : [[0, 'skin'], [0.5, 'skin-mid'], [1, 'skin-shade']]), t),
    E([448.5, 212], 7, 17, -6, '#' + D.soft('ear-inner', flip ? 0.75 : 1), t),
    E([452, 224], 5, 9, 14, '#' + D.soft('ear-inner', flip ? 0.4 : 0.6), t),
    E([441, 198], 3.6, 9, -22, '#' + D.soft('skin-hi', flip ? 0.75 : 0.3), t),
  ], t);
}

/* ---------- hair ---------- */
// fringe clumps: [id, path, gradient from, gradient to]
const CLUMPS = [
  ['hair-front-1', 'M476 72C452 90 436 122 436 152C436 162 440 172 448 181C454 177 460 170 464 162C468 154 472 150 478 146C484 118 500 92 522 72Z', [436, 130], [488, 130], [480, 78]],
  ['hair-front-5', 'M566 68C594 84 610 110 610 140C608 150 604 158 602 163C608 171 614 177 620 181C630 158 628 118 602 82Z', [596, 130], [630, 130], [588, 76]],
  ['hair-front-2', 'M506 66C482 86 468 118 472 146C474 156 480 164 487 171C494 164 500 152 506 138C516 114 528 88 540 66Z', [470, 120], [520, 120], [516, 72]],
  ['hair-front-4', 'M544 62C560 84 564 112 554 136C558 148 564 160 572 170C582 160 590 148 594 138C600 112 592 86 570 66Z', [552, 120], [598, 120], [558, 68]],
  ['hair-front-3', 'M540 60C510 82 498 116 504 140C508 154 516 166 524 176C534 166 546 150 554 134C562 108 560 82 552 60Z', [500, 118], [560, 118], [544, 64]],
];
const STRANDS = {
  'hair-front-1': 'M500 84C478 104 462 134 458 166M486 98C470 116 458 140 452 160',
  'hair-front-2': 'M524 80C506 100 494 128 492 156M512 96C500 114 492 134 486 152',
  'hair-front-3': 'M544 74C530 98 522 130 524 160M536 96C526 116 520 140 518 156M548 92C542 112 538 134 536 150',
  'hair-front-4': 'M558 78C570 100 574 126 570 154M568 92C578 110 582 130 580 146',
  'hair-front-5': 'M584 84C604 104 614 132 614 162M596 98C612 118 620 144 620 168',
};
const HAIR_STOPS = [[0, 'hair-shade'], [0.38, 'hair'], [0.85, 'hair'], [1, 'hair-shade']];

export function head(D) {
  const soft = (c, a) => '#' + D.soft(c, a);
  D.clip('face-clip', `<path d="${FACE}"/>`);
  const skin = '#' + D.rad('rg-face', [548, 182], 128, [[0, 'skin-light'], [0.42, 'skin'], [0.8, 'skin-mid'], [1, 'skin-shade']]);
  const hairFill = '#' + D.rad('rg-hair', [566, 96], 165, [[0, 'hair'], [0.45, 'hair'], [0.82, 'hair-shade'], [1, 'hair-deep']]);
  const JAW = jawPath();

  const spikes = 'M450 218L454 250L462 236L467 263L476 242L482 222Z';
  const side = 'M437 138C431 156 432 172 438 184C444 192 449 198 453 206C456 195 458 181 458 166C458 152 456 142 452 134Z';
  const band = { 'hair-front-3': [[531, 122], 20, 32, 12, 0.4], 'hair-front-2': [[497, 118], 15, 32, 16, 0.4], 'hair-front-4': [[574, 116], 14, 32, -10, 0.35], 'hair-front-1': [[458, 126], 13, 30, 22, 0.3], 'hair-front-5': [[612, 126], 10, 28, -18, 0.4] };
  const clump = ([id, d, a, b, pivot]) => G(id, pivot, [
    P(d, 'hair-deep', move(-2, 3), { opacity: 0.38 }),
    ...lit(D, id, d, '#' + D.lin(`lg-${id}`, a, b, HAIR_STOPS), ident, [
      E(band[id][0], band[id][1], band[id][2], band[id][3], soft('hair-light', band[id][4])),
      id === 'hair-front-3' ? P('M506 112C516 98 532 88 554 82C538 94 524 106 514 124Z', '#' + D.lin('lg-hi-3', [554, 84], [508, 122], [[0, 'hair-hi', 0.05], [0.45, 'hair-hi', 0.5], [1, 'hair-hi', 0.05]])) : null,
      id === 'hair-front-2' ? P('M476 124C484 106 498 92 518 82C506 96 496 112 488 132Z', '#' + D.lin('lg-hi-2', [518, 82], [480, 130], [[0, 'hair-hi', 0.05], [0.5, 'hair-hi', 0.45], [1, 'hair-hi', 0.03]])) : null,
      id === 'hair-front-4' ? P('M572 92C582 100 588 112 590 126C585 115 579 106 569 99Z', 'hair-hi', ident, { opacity: 0.32 }) : null,
      LN(STRANDS[id], 'hair-light', 1.3, ident, { opacity: 0.45 }),
    ]),
  ]);

  const mouth = G('mouth', [531, 246], [
    LN('M515 246.4Q531 251.6 547 246.4', 'lip', 2.6),
    G('lip-corner-r', [515, 246.4], [LN('M515 246.4Q510.6 245 506.4 242.6', 'lip', 2.6), E([505, 242.2], 3, 2.4, 0, soft('skin-deep', 0.6))]),
    G('lip-corner-l', [515, 246.4], [LN('M515 246.4Q510.6 245 506.4 242.6', 'lip', 2.6, mirror), E([505, 242.2], 3, 2.4, 0, soft('skin-deep', 0.6), mirror)], mirror),
  ]);

  const headGroup = G('head', [531, 262], [
    '<!-- back hair -->',
    P('M531 46C500 46 470 60 452 82C436 102 426 126 426 150C426 164 428 176 434 186L450 202L472 238L590 238L612 202L628 186C634 176 636 164 636 150C636 126 626 102 610 82C592 60 562 46 531 46Z', hairFill),
    G('hair-back-r', [466, 224], [P(spikes, '#' + D.lin('lg-spikes-r', [466, 218], [466, 262], [[0, 'hair-shade'], [1, 'hair-deep']]))]),
    G('hair-back-l', [466, 224], [P(spikes, '#' + D.lin('lg-spikes-l', [596, 218], [596, 262], [[0, 'hair'], [1, 'hair-shade']]), mirror)], mirror),
    '<!-- face -->',
    P(FACE, skin, ident, { id: 'face' }),
    G('mouth-inner', [531, 246], [
      P('M508 244.6Q531 251.2 554 244.6C551 256 542 263.5 531 263.5C520 263.5 511 256 508 244.6Z', 'mouth'),
      P('M513.5 246.4Q531 251.2 548.5 246.4L547.4 250.8Q531 255.2 514.6 250.8Z', 'eye-white'),
      E([531, 260.5], 9.5, 4, 0, soft('tongue', 0.95)),
    ]),
    G('jaw', [531, 236], lit(D, 'jaw', JAW, skin, ident, [
      E([531, 281], 42, 10, 0, soft('skin-shade', 0.7)),
      E([531, 255.4], 13, 3.4, 0, soft('skin-hi', 0.8)),
      E([531, 262.5], 16, 3.2, 0, soft('skin-shade', 0.6)),
      E([531, 270], 14, 6, 0, soft('skin-hi', 0.45)),
    ])),
    ...g({ 'clip-path': 'url(#face-clip)' }, [
      E([464, 214], 18, 58, 0, soft('skin-shade', 0.6)),
      E([601, 196], 8, 44, 0, soft('skin-shade', 0.4)),
      E([540, 204], 30, 34, 0, soft('skin-hi', 0.5)),
      E([531, 262], 60, 22, 0, soft('blush', 0.18)),
      CLUMPS.map(([id, d, , , pivot]) => G(id.replace('front', 'shadow'), pivot, [P(d, 'skin-deep', move(-1, 8), { opacity: 0.2 }), P(d, 'skin-deep', move(0, 4), { opacity: 0.2 })])),
      G('hair-wrap-r', [444, 180], [P('M444 300L250 300L250 40L504 40C484 96 464 146 458 184C456 222 452 262 444 300Z', hairFill)]),
      G('hair-wrap-l', [444, 180], [P('M444 300L250 300L250 40L504 40C484 96 464 146 458 184C456 222 452 262 444 300Z', hairFill, mirror)], mirror),
    ]),
    ...g({ 'clip-path': 'url(#face-clip)', id: 'features' }, [
      G('cheek-r', [478, 232], [E([478, 232], 25, 16, 0, soft('blush', 0.8))]),
      G('cheek-l', [478, 232], [E([478, 232], 25, 16, 0, soft('blush', 0.7), mirror)], mirror),
      G('nose', [531, 227], [
        E([531, 228], 13, 9, 0, soft('blush', 0.4)),
        E([523.5, 224], 5, 10, 14, soft('skin-shade', 0.45)),
        E([531, 234], 9.5, 3.8, 0, soft('skin-deep', 0.8)),
        E([531.5, 221.5], 6.8, 6.4, 0, soft('skin-hi', 1)),
        E([525, 232.4], 3, 2, -12, soft('skin-deep', 1)), E([537.2, 232.4], 3, 2, 12, soft('skin-deep', 0.9)),
      ]),
      mouth,
      eye(D, 'r'), eye(D, 'l'),
      brow(D, 'r'), brow(D, 'l'),
    ]),
    ear(D, 'r'), ear(D, 'l'),
    '<!-- hair over the face -->',
    P('M438 170C431 100 474 48 531 47C590 48 631 100 624 170C620 152 608 136 592 126C574 112 552 108 531 108C510 108 488 112 470 126C454 136 442 152 438 170Z', hairFill, ident, { id: 'hair-cap' }),
    CLUMPS.map(clump),
    G('hair-side-r', [446, 140], [P(side, 'hair-deep', move(2, 3), { opacity: 0.5 }), P(side, '#' + D.lin('lg-side-r', [430, 170], [460, 170], HAIR_STOPS))]),
    G('hair-side-l', [446, 140], [P(side, 'hair-deep', comp(mirror, move(2, 3)), { opacity: 0.4 }), P(side, '#' + D.lin('lg-side-l', [602, 170], [632, 170], [[0, 'hair-shade'], [0.5, 'hair'], [1, 'hair-light']]), mirror)], mirror),
    G('hair-top', [533, 61], [
      P('M516 65C511 40 530 22 566 15C549 28 544 46 549 65Z', '#' + D.lin('lg-ahoge', [516, 40], [556, 40], [[0, 'hair-shade'], [0.5, 'hair'], [1, 'hair-light']])),
      P('M536 46C539 36 546 28 555 22C549 30 546 39 545 50Z', 'hair-hi', ident, { opacity: 0.25 }),
    ]),
  ]);

  const neckFill = '#' + D.lin('lg-neck', [505, 290], [557, 290], [[0, 'skin-deep'], [0.28, 'skin-shade'], [0.62, 'skin-mid'], [1, 'skin-shade']]);
  const neck2 = G('neck-2', [531, 292], [
    ...lit(D, 'neck-2', 'M505 252L557 252L557 300Q557 305 552 305L510 305Q505 305 505 300Z', neckFill, ident, [
      P('M500 262L562 262L562 306L500 306Z', '#' + D.lin('lg-neck-ao', [531, 266], [531, 336], [[0, 'skin-deep', 0.9], [0.45, 'skin-deep', 0.35], [1, 'skin-deep', 0.05]])),
    ]),
    headGroup,
  ]);
  return G('neck-1', [531, 320], [
    ...lit(D, 'neck-1', 'M505 290L557 290C557.5 304 559 314 564 322L564 336L498 336L498 322C503 314 504.5 304 505 290Z', neckFill, ident, [
      P('M488 288L574 288L574 338L488 338Z', '#' + D.lin('lg-neck-ao', [531, 266], [531, 336], [[0, 'skin-deep', 0.9], [0.45, 'skin-deep', 0.35], [1, 'skin-deep', 0.05]])),
    ]),
    neck2,
  ]);
}
