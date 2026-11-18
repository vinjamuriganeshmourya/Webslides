# `char/` — a rigged 2D character with soft 3D shading

One front-facing character as an inline SVG, plus a small runtime that poses it:
joint limits, inverse kinematics for hands and feet, spring physics, breathing,
blinking, balance and ground contact. No black outlines and no third-party code at run time.

| File | What it is |
|---|---|
| `character.svg` | the art: 111 rig groups, 395 shapes, 123 KB, every colour a CSS variable |
| `rig.json` | 100 joints with limits, couplings, 4 IK chains, 27 springs, presets |
| `rig.js` | the runtime (24 KB, no dependencies). `new CharRig.Rig(svg, rigJson)` |
| `preview.html` | a slider for every joint, presets, animations, IK handles, switches |
| `char.bundle.js` | generated copy of the SVG and the rig data, so the preview also opens from disk |
| `src/` | the generator: `node src/build.mjs` writes `character.svg`, `rig.json`, `char.bundle.js` and this README |
| `tests/acceptance.mjs` | the eight acceptance checks |

## Run the preview

```bash
cd slide-kit/assets/char
python3 -m http.server 8791 --bind 127.0.0.1     # then open http://127.0.0.1:8791/preview.html
```

Opening `preview.html` by double-click also works. Most browsers refuse to let a page read
`character.svg` and `rig.json` from disk; when that happens the page uses `char.bundle.js`,
which holds the same two files. Nothing is fetched from the network in either case.

After changing anything under `src/`, run `node src/build.mjs` (Node 20.11 or newer).
To run the checks: `node tests/acceptance.mjs` with the folder served as above.

## Using the rig

```html
<script src="rig.js"></script>
<script>
  // svg = the inline <svg id="character"> element, data = rig.json
  const rig = new CharRig.Rig(svg, data);
  rig.set('elbow-r', 90);              // clamped to the limit, returns what was stored
  rig.hand('fist', ['r']);             // fist | open | relaxed
  rig.setIK('hand-l', true); rig.moveIK('hand-l', 700, 300);   // canvas units
  rig.play('wave');                    // wave | walk, rig.stop() ends it
  rig.physics = true; rig.breathing = true;
  rig.start();                         // or call rig.step(seconds) from your own loop
</script>
```

- The canvas is `viewBox="0 0 1086 1448"`, the same framing as the reference image. Every pivot is in those units, in the rest pose.
- **R** is the character's right, which is the left of the screen.
- A joint value is anatomical and means the same on both sides: `shoulder-r: -90` and `shoulder-l: -90` both raise the arm sideways. The `k` on each target in `rig.json` turns it into a screen rotation (positive is clockwise).
- Recolour by overriding the CSS variables on `#character` (54 of them, listed at the top of `character.svg`).
- Without `rig.js` the file is still a normal rigged SVG: each group has `data-pivot` and `transform-origin`, so CSS, the Web Animations API or Framer Motion can rotate it. Limits, IK and physics exist only in `rig.js`.

## What the runtime does each frame

1. **Animation** (wave, walk in place) and **sliders** give each joint a base value.
2. **IK** chains with a target solve their two bones (analytic two-bone solve, then a short search inside the limits when a limit blocks the exact answer). A target that cannot be reached is pulled back to where the limb stopped.
3. **Procedural layers**, when Physics is on: breathing, blink with small eye movements, and the lean from balance.
4. **Limits**: every joint is clamped to `min` and `max` here, whatever asked for the value.
5. **Couplings**: the clavicle lifts as the arm rises past 30 degrees (scapula shift, 0.22 of the extra angle); the elbow folds in or out according to arm rotation; the head turn moves the face features.
6. **Ground and balance**: the centre of mass is compared with the feet carrying weight, the pelvis shifts over them, and legs standing on the ground are re-solved so the feet stay exactly where they were and stay level.
7. **Springs**: each sprung bone is a mass on the end of the bone, pulled towards where a rigid bone would be. Heavier parts lag longer.

Physics switch off: steps 3, 6 and 7 stop and the figure is static. The Breathing switch only matters while Physics is on.

### Legs, with Physics on

A leg whose hip and knee sliders are at their defaults is **standing**: it is solved to keep its foot planted, so moving the pelvis, spine or arms bends the knees instead of sliding the feet. Move a hip or knee slider and that leg becomes **free** and follows the sliders. With every leg free, the whole figure is raised or lowered so the lowest sole rests on the ground.

## Joints and limits

Limits live in `rig.json` and are enforced by `rig.js`. Units are degrees unless the unit column says otherwise.

### Head

| Joint | Label | Min | Max | Default | Unit | Moves (bone.channel x k) |
|---|---|---|---|---|---|---|
| `neck-1` | Neck lower tilt | -15 | 15 | 0 | deg | neck-1.r x 1 |
| `neck-2` | Neck upper tilt | -15 | 15 | 0 | deg | neck-2.r x 1 |
| `head` | Head tilt | -20 | 20 | 0 | deg | head.r x 1 |
| `head-yaw` | Head turn (yaw) | -70 | 70 | 0 | deg | head turn (see below) |
| `jaw` | Jaw open | 0 | 25 | 0 | deg | jaw.y x 0.5 |
| `eyelid-upper-r` | Upper eyelid R | 0 | 100 | 0 | % | eyelid-upper-r.y x 0.34, lash-upper-r.y x 0.34 |
| `eyelid-lower-r` | Lower eyelid R | 0 | 100 | 0 | % | eyelid-lower-r.y x -0.1 |
| `gaze-x-r` | Iris R left / right | -6 | 6 | 0 | px | iris-r.x x 1 |
| `gaze-y-r` | Iris R up / down | -4 | 4 | 0 | px | iris-r.y x 1 |
| `pupil-r` | Pupil R size | -30 | 35 | 0 | % | pupil-r.sx x 0.01, pupil-r.sy x 0.01 |
| `brow-r` | Brow R raise | -6 | 8 | 0 | px | brow-r.y x -1 |
| `brow-inner-r` | Brow R inner | -25 | 25 | 0 | deg | brow-inner-r.r x -1 |
| `brow-outer-r` | Brow R outer | -20 | 20 | 0 | deg | brow-outer-r.r x 1 |
| `cheek-r` | Cheek R raise | 0 | 6 | 0 | px | cheek-r.y x -1 |
| `lip-corner-r` | Lip corner R | -25 | 25 | 0 | deg | lip-corner-r.r x 1 |
| `ear-r` | Ear R | -10 | 10 | 0 | deg | ear-r.r x 1 |
| `eyelid-upper-l` | Upper eyelid L | 0 | 100 | 0 | % | eyelid-upper-l.y x 0.34, lash-upper-l.y x 0.34 |
| `eyelid-lower-l` | Lower eyelid L | 0 | 100 | 0 | % | eyelid-lower-l.y x -0.1 |
| `gaze-x-l` | Iris L left / right | -6 | 6 | 0 | px | iris-l.x x 1 |
| `gaze-y-l` | Iris L up / down | -4 | 4 | 0 | px | iris-l.y x 1 |
| `pupil-l` | Pupil L size | -30 | 35 | 0 | % | pupil-l.sx x 0.01, pupil-l.sy x 0.01 |
| `brow-l` | Brow L raise | -6 | 8 | 0 | px | brow-l.y x -1 |
| `brow-inner-l` | Brow L inner | -25 | 25 | 0 | deg | brow-inner-l.r x 1 |
| `brow-outer-l` | Brow L outer | -20 | 20 | 0 | deg | brow-outer-l.r x -1 |
| `cheek-l` | Cheek L raise | 0 | 6 | 0 | px | cheek-l.y x -1 |
| `lip-corner-l` | Lip corner L | -25 | 25 | 0 | deg | lip-corner-l.r x -1 |
| `ear-l` | Ear L | -10 | 10 | 0 | deg | ear-l.r x -1 |
| `hair-top` | Hair top tuft | -35 | 35 | 0 | deg | hair-top.r x 1 |
| `hair-front-1` | Hair front 1 | -12 | 12 | 0 | deg | hair-front-1.r x 1 |
| `hair-front-2` | Hair front 2 | -12 | 12 | 0 | deg | hair-front-2.r x 1 |
| `hair-front-3` | Hair front 3 | -12 | 12 | 0 | deg | hair-front-3.r x 1 |
| `hair-front-4` | Hair front 4 | -12 | 12 | 0 | deg | hair-front-4.r x 1 |
| `hair-front-5` | Hair front 5 | -12 | 12 | 0 | deg | hair-front-5.r x 1 |
| `hair-side-r` | Hair side R | -15 | 15 | 0 | deg | hair-side-r.r x 1 |
| `hair-back-r` | Hair back R | -15 | 15 | 0 | deg | hair-back-r.r x 1 |
| `hair-side-l` | Hair side L | -15 | 15 | 0 | deg | hair-side-l.r x 1 |
| `hair-back-l` | Hair back L | -15 | 15 | 0 | deg | hair-back-l.r x 1 |

### Torso

| Joint | Label | Min | Max | Default | Unit | Moves (bone.channel x k) |
|---|---|---|---|---|---|---|
| `pelvis` | Pelvis tilt | -20 | 20 | 0 | deg | pelvis.r x 1 |
| `spine-1` | Spine lower | -15 | 15 | 0 | deg | spine-1.r x 1 |
| `spine-2` | Spine middle | -12 | 12 | 0 | deg | spine-2.r x 1 |
| `spine-3` | Spine upper (chest) | -10 | 10 | 0 | deg | spine-3.r x 1 |
| `clavicle-r` | Clavicle R (shrug) | -10 | 30 | 0 | deg | clavicle-r.r x 1 |
| `clavicle-l` | Clavicle L (shrug) | -10 | 30 | 0 | deg | clavicle-l.r x -1 |
| `hood` | Hood | -8 | 8 | 0 | deg | hood.r x 1, hood-back.r x 1 |
| `drawstring-r-1` | Drawstring R 1 | -60 | 60 | 0 | deg | drawstring-r-1.r x 1 |
| `drawstring-r-2` | Drawstring R 2 | -60 | 60 | 0 | deg | drawstring-r-2.r x 1 |
| `drawstring-r-3` | Drawstring R 3 | -60 | 60 | 0 | deg | drawstring-r-3.r x 1 |
| `drawstring-l-1` | Drawstring L 1 | -60 | 60 | 0 | deg | drawstring-l-1.r x 1 |
| `drawstring-l-2` | Drawstring L 2 | -60 | 60 | 0 | deg | drawstring-l-2.r x 1 |
| `drawstring-l-3` | Drawstring L 3 | -60 | 60 | 0 | deg | drawstring-l-3.r x 1 |
| `hem` | Hem | -6 | 6 | 0 | deg | hem.r x 1 |
| `pocket` | Pocket | -5 | 5 | 0 | deg | pocket.r x 1 |

### Arms

| Joint | Label | Min | Max | Default | Unit | Moves (bone.channel x k) |
|---|---|---|---|---|---|---|
| `shoulder-r` | Shoulder R | -180 | 60 | 0 | deg | upper-arm-r.r x -1 |
| `arm-rotation-r` | Arm rotation R (in to out) | 0 | 180 | 0 | deg | fold side of the elbow |
| `elbow-r` | Elbow R | 0 | 145 | 6 | deg | forearm, through arm rotation |
| `wrist-r` | Wrist R | -70 | 80 | 0 | deg | hand-r.r x -1 |
| `cuff-r` | Sleeve cuff R | -10 | 10 | 0 | deg | cuff-r.r x 1 |
| `shoulder-l` | Shoulder L | -180 | 60 | 0 | deg | upper-arm-l.r x 1 |
| `arm-rotation-l` | Arm rotation L (in to out) | 0 | 180 | 0 | deg | fold side of the elbow |
| `elbow-l` | Elbow L | 0 | 145 | 6 | deg | forearm, through arm rotation |
| `wrist-l` | Wrist L | -70 | 80 | 0 | deg | hand-l.r x 1 |
| `cuff-l` | Sleeve cuff L | -10 | 10 | 0 | deg | cuff-l.r x 1 |

### Hands and fingers

| Joint | Label | Min | Max | Default | Unit | Moves (bone.channel x k) |
|---|---|---|---|---|---|---|
| `finger-index-prox-r` | R index proximal | 0 | 90 | 14 | deg | finger-index-prox-r.r x -1 |
| `finger-index-mid-r` | R index middle | 0 | 100 | 26 | deg | finger-index-mid-r.r x -1 |
| `finger-index-dist-r` | R index distal | 0 | 80 | 14 | deg | finger-index-dist-r.r x -1 |
| `finger-middle-prox-r` | R middle proximal | 0 | 90 | 20 | deg | finger-middle-prox-r.r x -1 |
| `finger-middle-mid-r` | R middle middle | 0 | 100 | 32 | deg | finger-middle-mid-r.r x -1 |
| `finger-middle-dist-r` | R middle distal | 0 | 80 | 16 | deg | finger-middle-dist-r.r x -1 |
| `finger-ring-prox-r` | R ring proximal | 0 | 90 | 26 | deg | finger-ring-prox-r.r x -1 |
| `finger-ring-mid-r` | R ring middle | 0 | 100 | 38 | deg | finger-ring-mid-r.r x -1 |
| `finger-ring-dist-r` | R ring distal | 0 | 80 | 18 | deg | finger-ring-dist-r.r x -1 |
| `finger-pinky-prox-r` | R pinky proximal | 0 | 90 | 32 | deg | finger-pinky-prox-r.r x -1 |
| `finger-pinky-mid-r` | R pinky middle | 0 | 100 | 44 | deg | finger-pinky-mid-r.r x -1 |
| `finger-pinky-dist-r` | R pinky distal | 0 | 80 | 20 | deg | finger-pinky-dist-r.r x -1 |
| `thumb-meta-r` | R thumb base | -15 | 45 | 6 | deg | thumb-meta-r.r x 1 |
| `thumb-prox-r` | R thumb proximal | 0 | 60 | 12 | deg | thumb-prox-r.r x 1 |
| `thumb-dist-r` | R thumb distal | -10 | 80 | 14 | deg | thumb-dist-r.r x 1 |
| `finger-index-prox-l` | L index proximal | 0 | 90 | 14 | deg | finger-index-prox-l.r x 1 |
| `finger-index-mid-l` | L index middle | 0 | 100 | 26 | deg | finger-index-mid-l.r x 1 |
| `finger-index-dist-l` | L index distal | 0 | 80 | 14 | deg | finger-index-dist-l.r x 1 |
| `finger-middle-prox-l` | L middle proximal | 0 | 90 | 20 | deg | finger-middle-prox-l.r x 1 |
| `finger-middle-mid-l` | L middle middle | 0 | 100 | 32 | deg | finger-middle-mid-l.r x 1 |
| `finger-middle-dist-l` | L middle distal | 0 | 80 | 16 | deg | finger-middle-dist-l.r x 1 |
| `finger-ring-prox-l` | L ring proximal | 0 | 90 | 26 | deg | finger-ring-prox-l.r x 1 |
| `finger-ring-mid-l` | L ring middle | 0 | 100 | 38 | deg | finger-ring-mid-l.r x 1 |
| `finger-ring-dist-l` | L ring distal | 0 | 80 | 18 | deg | finger-ring-dist-l.r x 1 |
| `finger-pinky-prox-l` | L pinky proximal | 0 | 90 | 32 | deg | finger-pinky-prox-l.r x 1 |
| `finger-pinky-mid-l` | L pinky middle | 0 | 100 | 44 | deg | finger-pinky-mid-l.r x 1 |
| `finger-pinky-dist-l` | L pinky distal | 0 | 80 | 20 | deg | finger-pinky-dist-l.r x 1 |
| `thumb-meta-l` | L thumb base | -15 | 45 | 6 | deg | thumb-meta-l.r x -1 |
| `thumb-prox-l` | L thumb proximal | 0 | 60 | 12 | deg | thumb-prox-l.r x -1 |
| `thumb-dist-l` | L thumb distal | -10 | 80 | 14 | deg | thumb-dist-l.r x -1 |

### Legs

| Joint | Label | Min | Max | Default | Unit | Moves (bone.channel x k) |
|---|---|---|---|---|---|---|
| `hip-r` | Hip R | -120 | 30 | 0 | deg | thigh-r.r x -1 |
| `knee-r` | Knee R | 0 | 140 | 0 | deg | shin-r.r x -1 |
| `ankle-r` | Ankle R | -40 | 50 | 0 | deg | foot-r.r x -1 |
| `toes-r` | Toes R | -10 | 40 | 0 | deg | toes-r.r x -1 |
| `hip-l` | Hip L | -120 | 30 | 0 | deg | thigh-l.r x 1 |
| `knee-l` | Knee L | 0 | 140 | 0 | deg | shin-l.r x 1 |
| `ankle-l` | Ankle L | -40 | 50 | 0 | deg | foot-l.r x 1 |
| `toes-l` | Toes L | -10 | 40 | 0 | deg | toes-l.r x 1 |

Notes on the limits:

- **`head-yaw`** runs the full -70 to 70, but the picture turns by 0.6 of that (about 42 degrees). It is a parallax effect on a front drawing: eyes, brows, nose, mouth, cheeks and fringe slide and narrow, the near ear widens, the far ear hides. There is no profile to turn to.
- **`elbow`** is a hinge, 0 to 145. `arm-rotation` (0 = folds towards the body, 180 = folds outward and up) picks the side it folds to, as turning the upper arm does on a real shoulder. At 90 the forearm would point at the viewer; the rig has no foreshortening, so the forearm stays straight there.
- **`knee`** folds towards the body's centre line only, 0 to 140.
- Eyelids are percentages of closure, gaze and brow raise are canvas units.

## Bones (rig groups), parents and pivots

Every `<g>` with `data-pivot` in `character.svg`. The hierarchy follows the skeleton: rotating a parent carries its children.

| Bone id | Parent | Pivot (x, y) | Driven by |
|---|---|---|---|
| `root` | (top) | 531, 1394 | ground contact, balance |
| `pelvis` | `root` | 531, 712 | `pelvis` |
| `thigh-r` | `pelvis` | 479, 745 | `hip-r` |
| `shin-r` | `thigh-r` | 456.4, 1014.1 | `knee-r` |
| `foot-r` | `shin-r` | 432.9, 1294.1 | `ankle-r` |
| `toes-r` | `foot-r` | 402.9, 1344 | `toes-r` |
| `thigh-l` | `pelvis` | 583, 745 | `hip-l` |
| `shin-l` | `thigh-l` | 605.6, 1014.1 | `knee-l` |
| `foot-l` | `shin-l` | 629.1, 1294.1 | `ankle-l` |
| `toes-l` | `foot-l` | 659.1, 1344 | `toes-l` |
| `spine-1` | `pelvis` | 531, 668 | `spine-1` |
| `pocket` | `spine-1` | 531, 576 | `pocket`, spring |
| `hem` | `spine-1` | 531, 652 | `hem`, spring |
| `spine-2` | `spine-1` | 531, 548 | `spine-2`, spring |
| `spine-3` | `spine-2` | 531, 452 | `spine-3`, spring |
| `hood-back` | `spine-3` | 531, 320 | `hood` |
| `neck-1` | `spine-3` | 531, 320 | `neck-1` |
| `neck-2` | `neck-1` | 531, 292 | `neck-2`, spring |
| `head` | `neck-2` | 531, 262 | `head`, spring |
| `hair-back-r` | `head` | 466, 224 | `hair-back-r`, spring |
| `hair-back-l` | `head` | 596, 224 | `hair-back-l`, spring |
| `mouth-inner` | `head` | 531, 246 | head turn |
| `jaw` | `head` | 531, 236 | `jaw` |
| `hair-shadow-1` | `head` | 480, 78 | head turn |
| `hair-shadow-5` | `head` | 588, 76 | head turn |
| `hair-shadow-2` | `head` | 516, 72 | head turn |
| `hair-shadow-4` | `head` | 558, 68 | head turn |
| `hair-shadow-3` | `head` | 544, 64 | head turn |
| `hair-wrap-r` | `head` | 444, 180 | head turn |
| `hair-wrap-l` | `head` | 618, 180 | head turn |
| `cheek-r` | `head` | 478, 232 | `cheek-r`, head turn |
| `cheek-l` | `head` | 584, 232 | `cheek-l`, head turn |
| `nose` | `head` | 531, 227 | head turn |
| `mouth` | `head` | 531, 246 | head turn |
| `lip-corner-r` | `mouth` | 515, 246.4 | `lip-corner-r` |
| `lip-corner-l` | `mouth` | 547, 246.4 | `lip-corner-l` |
| `eye-r` | `head` | 487, 196 | head turn |
| `iris-r` | `eye-r` | 493.7, 195.8 | `gaze-x-r`, `gaze-y-r` |
| `pupil-r` | `iris-r` | 493.7, 195.8 | `pupil-r` |
| `eyelid-upper-r` | `eye-r` | 487, 179 | `eyelid-upper-r` |
| `eyelid-lower-r` | `eye-r` | 487, 212 | `eyelid-lower-r` |
| `lash-upper-r` | `eye-r` | 487, 179 | `eyelid-upper-r` |
| `eye-l` | `head` | 575, 196 | head turn |
| `iris-l` | `eye-l` | 568.3, 195.8 | `gaze-x-l`, `gaze-y-l` |
| `pupil-l` | `iris-l` | 568.3, 195.8 | `pupil-l` |
| `eyelid-upper-l` | `eye-l` | 575, 179 | `eyelid-upper-l` |
| `eyelid-lower-l` | `eye-l` | 575, 212 | `eyelid-lower-l` |
| `lash-upper-l` | `eye-l` | 575, 179 | `eyelid-upper-l` |
| `brow-r` | `head` | 487, 162 | `brow-r`, head turn |
| `brow-outer-r` | `brow-r` | 487.5, 160.8 | `brow-outer-r` |
| `brow-inner-r` | `brow-r` | 487.5, 160.8 | `brow-inner-r` |
| `brow-l` | `head` | 575, 162 | `brow-l`, head turn |
| `brow-outer-l` | `brow-l` | 574.5, 160.8 | `brow-outer-l` |
| `brow-inner-l` | `brow-l` | 574.5, 160.8 | `brow-inner-l` |
| `ear-r` | `head` | 464, 214 | `ear-r`, head turn |
| `ear-l` | `head` | 598, 214 | `ear-l`, head turn |
| `hair-front-1` | `head` | 480, 78 | `hair-front-1`, head turn, spring |
| `hair-front-5` | `head` | 588, 76 | `hair-front-5`, head turn, spring |
| `hair-front-2` | `head` | 516, 72 | `hair-front-2`, head turn, spring |
| `hair-front-4` | `head` | 558, 68 | `hair-front-4`, head turn, spring |
| `hair-front-3` | `head` | 544, 64 | `hair-front-3`, head turn, spring |
| `hair-side-r` | `head` | 446, 140 | `hair-side-r`, head turn, spring |
| `hair-side-l` | `head` | 616, 140 | `hair-side-l`, head turn, spring |
| `hair-top` | `head` | 533, 61 | `hair-top`, head turn, spring |
| `hood` | `spine-3` | 531, 320 | `hood`, spring |
| `drawstring-r-1` | `spine-3` | 509, 354 | `drawstring-r-1`, spring |
| `drawstring-r-2` | `drawstring-r-1` | 509, 378 | `drawstring-r-2`, spring |
| `drawstring-r-3` | `drawstring-r-2` | 509, 402 | `drawstring-r-3`, spring |
| `drawstring-l-1` | `spine-3` | 553, 354 | `drawstring-l-1`, spring |
| `drawstring-l-2` | `drawstring-l-1` | 553, 378 | `drawstring-l-2`, spring |
| `drawstring-l-3` | `drawstring-l-2` | 553, 402 | `drawstring-l-3`, spring |
| `clavicle-r` | `spine-3` | 497, 342 | `clavicle-r` |
| `upper-arm-r` | `clavicle-r` | 442, 362 | `shoulder-r` |
| `forearm-r` | `upper-arm-r` | 398.4, 528.4 | `elbow-r x arm-rotation-r` |
| `hand-r` | `forearm-r` | 356.2, 688.9 | `wrist-r`, spring |
| `finger-pinky-prox-r` | `hand-r` | 325, 731.4 | `finger-pinky-prox-r` |
| `finger-pinky-mid-r` | `finger-pinky-prox-r` | 318.5, 747.1 | `finger-pinky-mid-r` |
| `finger-pinky-dist-r` | `finger-pinky-mid-r` | 313.8, 758.2 | `finger-pinky-dist-r` |
| `finger-ring-prox-r` | `hand-r` | 337, 738.7 | `finger-ring-prox-r` |
| `finger-ring-mid-r` | `finger-ring-prox-r` | 330.3, 759.6 | `finger-ring-mid-r` |
| `finger-ring-dist-r` | `finger-ring-mid-r` | 325.7, 773.9 | `finger-ring-dist-r` |
| `finger-middle-prox-r` | `hand-r` | 349.3, 744 | `finger-middle-prox-r` |
| `finger-middle-mid-r` | `finger-middle-prox-r` | 343.2, 767.2 | `finger-middle-mid-r` |
| `finger-middle-dist-r` | `finger-middle-mid-r` | 339.2, 782.7 | `finger-middle-dist-r` |
| `finger-index-prox-r` | `hand-r` | 362.6, 746.4 | `finger-index-prox-r` |
| `finger-index-mid-r` | `finger-index-prox-r` | 358.6, 768.1 | `finger-index-mid-r` |
| `finger-index-dist-r` | `finger-index-mid-r` | 355.8, 782.8 | `finger-index-dist-r` |
| `thumb-meta-r` | `hand-r` | 371.9, 696.2 | `thumb-meta-r` |
| `thumb-prox-r` | `thumb-meta-r` | 370.9, 730.1 | `thumb-prox-r` |
| `thumb-dist-r` | `thumb-prox-r` | 370.3, 752.1 | `thumb-dist-r` |
| `cuff-r` | `forearm-r` | 366.4, 650.2 | `cuff-r`, spring |
| `clavicle-l` | `spine-3` | 565, 342 | `clavicle-l` |
| `upper-arm-l` | `clavicle-l` | 620, 362 | `shoulder-l` |
| `forearm-l` | `upper-arm-l` | 663.6, 528.4 | `elbow-l x arm-rotation-l` |
| `hand-l` | `forearm-l` | 705.8, 688.9 | `wrist-l`, spring |
| `finger-pinky-prox-l` | `hand-l` | 737, 731.4 | `finger-pinky-prox-l` |
| `finger-pinky-mid-l` | `finger-pinky-prox-l` | 743.5, 747.1 | `finger-pinky-mid-l` |
| `finger-pinky-dist-l` | `finger-pinky-mid-l` | 748.2, 758.2 | `finger-pinky-dist-l` |
| `finger-ring-prox-l` | `hand-l` | 725, 738.7 | `finger-ring-prox-l` |
| `finger-ring-mid-l` | `finger-ring-prox-l` | 731.7, 759.6 | `finger-ring-mid-l` |
| `finger-ring-dist-l` | `finger-ring-mid-l` | 736.3, 773.9 | `finger-ring-dist-l` |
| `finger-middle-prox-l` | `hand-l` | 712.7, 744 | `finger-middle-prox-l` |
| `finger-middle-mid-l` | `finger-middle-prox-l` | 718.8, 767.2 | `finger-middle-mid-l` |
| `finger-middle-dist-l` | `finger-middle-mid-l` | 722.8, 782.7 | `finger-middle-dist-l` |
| `finger-index-prox-l` | `hand-l` | 699.4, 746.4 | `finger-index-prox-l` |
| `finger-index-mid-l` | `finger-index-prox-l` | 703.4, 768.1 | `finger-index-mid-l` |
| `finger-index-dist-l` | `finger-index-mid-l` | 706.2, 782.8 | `finger-index-dist-l` |
| `thumb-meta-l` | `hand-l` | 690.1, 696.2 | `thumb-meta-l` |
| `thumb-prox-l` | `thumb-meta-l` | 691.1, 730.1 | `thumb-prox-l` |
| `thumb-dist-l` | `thumb-prox-l` | 691.7, 752.1 | `thumb-dist-l` |
| `cuff-l` | `forearm-l` | 695.6, 650.2 | `cuff-l`, spring |

Ids changed from the first version of this folder: `waist`, `chest` are now `spine-1`, `spine-2`, `spine-3`; `shoulder-*` is `clavicle-*`; `finger-<name>-1/2/3-*` is `finger-<name>-prox/mid/dist-*`; `thumb-1/2-*` is `thumb-meta/prox/dist-*`; `eyebrow-*` is `brow-*` with `brow-inner-*` and `brow-outer-*`; `eyelid-*` is `eyelid-upper-*` and `eyelid-lower-*`; `pupil-*` now sits inside `iris-*`.

## Physics values

Per part, in `rig.json` under `physics.springs`. Stiffness pulls the part back, damping stops the swing, mass sets how long it lags, limit is the most it may swing either way (degrees), gravity pulls it to hang straight down.

| Bone | Joint | Stiffness | Damping | Mass | Limit | Gravity |
|---|---|---|---|---|---|---|
| `hair-top` | `hair-top` | 150 | 5 | 0.6 | 28 | 0 |
| `hair-front-1` | `hair-front-1` | 230 | 9 | 1 | 9 | 0 |
| `hair-front-2` | `hair-front-2` | 240 | 9 | 1 | 9 | 0 |
| `hair-front-3` | `hair-front-3` | 220 | 8 | 1.1 | 10 | 0 |
| `hair-front-4` | `hair-front-4` | 240 | 9 | 1 | 9 | 0 |
| `hair-front-5` | `hair-front-5` | 230 | 9 | 1 | 9 | 0 |
| `hair-side-r` | `hair-side-r` | 200 | 8 | 0.8 | 12 | 0 |
| `hair-side-l` | `hair-side-l` | 200 | 8 | 0.8 | 12 | 0 |
| `hair-back-r` | `hair-back-r` | 180 | 7 | 0.7 | 14 | 0 |
| `hair-back-l` | `hair-back-l` | 180 | 7 | 0.7 | 14 | 0 |
| `hood` | `hood` | 170 | 10 | 2 | 6 | 0 |
| `hem` | `hem` | 180 | 11 | 2 | 5 | 0 |
| `pocket` | `pocket` | 200 | 11 | 1.5 | 4 | 0 |
| `cuff-r` | `cuff-r` | 210 | 9 | 1.2 | 9 | 0 |
| `cuff-l` | `cuff-l` | 210 | 9 | 1.2 | 9 | 0 |
| `spine-2` | `spine-2` | 300 | 24 | 7 | 2.5 | 0 |
| `spine-3` | `spine-3` | 280 | 22 | 6 | 3 | 0 |
| `neck-2` | `neck-2` | 260 | 20 | 3 | 3.5 | 0 |
| `head` | `head` | 230 | 17 | 4.5 | 4.5 | 0 |
| `hand-r` | `wrist-r` | 160 | 10 | 1 | 12 | 0 |
| `hand-l` | `wrist-l` | 160 | 10 | 1 | 12 | 0 |
| `drawstring-r-1` | `drawstring-r-1` | 70 | 4.5 | 0.5 | 55 | 900 |
| `drawstring-r-2` | `drawstring-r-2` | 55 | 4.5 | 0.5 | 55 | 900 |
| `drawstring-r-3` | `drawstring-r-3` | 45 | 4.5 | 0.5 | 55 | 900 |
| `drawstring-l-1` | `drawstring-l-1` | 70 | 4.5 | 0.5 | 55 | 900 |
| `drawstring-l-2` | `drawstring-l-2` | 55 | 4.5 | 0.5 | 55 | 900 |
| `drawstring-l-3` | `drawstring-l-3` | 45 | 4.5 | 0.5 | 55 | 900 |

Also in `physics`: `breathing` (period 3.8 s, chest lift 2.4 units), `blink`, `saccade`, `balance` (gain 0.55, at most 46 units of pelvis shift) and `ground`.

## How the look is built

- **No outlines.** No shape has a dark stroke. Edges come from fill and gradient only; where two parts of one colour meet, the edge is a darker tone of the same hue. The only strokes are thin details in palette colours: seams, stitches, ribs, laces, the lip line and the eyelid lines.
- **Light from the upper right**, as in the reference: left flank and inner sides in shade, a warm rim on right-facing edges.
- **Each limb segment** is filled across its width by one profile (lighter down the middle), and the **ball at each joint** uses the same profile radially. The ball sits under both segments and only shows in the wedge that opens when the joint bends, so a bend has no gap and no seam at any angle.
- **Soft shading** (under the chin, inside the hood, under the hem, folds, blush, highlights) is ellipses and strips whose gradient fades to nothing. There are no SVG filters, which is what keeps the preview at 60 frames per second.
- **Garment edges** are real overlaps: hand under cuff, shoe under trouser hem, neck under hood, hoodie hem over jeans.

## Libraries

**None at run time.** `rig.js` is the only script and has no dependencies; there is no `vendor/` folder because nothing is vendored.

| Used for | Library | Version | Licence |
|---|---|---|---|
| running `tests/acceptance.mjs` only | Playwright (the copy already installed in `deck-engine/`) | 1.62.1 | Apache-2.0 |

Looked at and not used (versions and licences as on the npm registry, 2026-11-12):

| Candidate | Version | Licence | Why not |
|---|---|---|---|
| GSAP | 3.15.1 | GSAP standard "no charge" licence | not MIT, Apache or BSD, so ruled out by the brief |
| Spine runtimes (spine-pixi-v8) | 4.3.13 | Spine Runtimes Licence | needs a Spine editor licence; not permissive |
| PixiJS | 8.23.0 | MIT | 256 KB gzip; mesh deformation needs bitmap parts, and the only bitmap is the reference, which may not be copied |
| DragonBones (dragonbones.js) | 5.7.4 | MIT | last published 2022; same bitmap problem |
| Rive runtime | 2.50.0 | MIT | needs a file authored in the Rive editor |
| three.js | 0.187.0 | MIT | real 3D would mean modelling the character, not refining this one |
| Matter.js | 0.20.0 | MIT | rigid bodies and collisions, last release June 2024; hair and cloth here are spring bones, about 40 lines |
| Rapier 2D | 0.21.0 | Apache-2.0 | same, and 12 MB unpacked with its WebAssembly |
| anime.js, Motion | 4.5.0, 14.12.0 | MIT | only tweening; the two animations are short functions in `rig.js` |

## Known limits

1. **It is a drawing, not a render.** Shading is baked for the rest pose and travels with each part: a raised arm keeps the light it had hanging down, and limbs do not cast shadows on each other.
2. **Everything moves in the plane of the screen.** Fingers curl sideways towards the body, a knee lifts to the side, nothing reaches towards the viewer. Walk in place is therefore a side knee lift.
3. **Head turn is a parallax effect** up to about 42 visual degrees; see the note under the limits.
4. **Springs do not collide.** Hair can swing over the face and a drawstring can pass through an arm.
5. **The arms always draw in front of the torso and the legs behind the hoodie.** An arm cannot pass behind the body.
6. **Standing legs override their sliders' effect on the foot.** With Physics on, the ankle slider does nothing on a standing leg, because the foot is kept level.
7. **IK on an arm chooses the fold side itself**, so `arm-rotation` jumps between 0 and 180 while dragging.
8. **Frame rate was measured headless** (60 fps, 0.05 ms of script per frame). The page has about 395 gradient-filled shapes and no filters; a slow integrated GPU at a very large window size has not been tried.

## Differences from the reference image

Built on the reference's own frame and palette, so position, proportion and colour are close; the picture is not identical. Seen side by side:

1. Vector gradients against a 3D render: no fabric texture on the fleece, denim or canvas, no light bleeding through the ears, simpler contact shadows.
2. The stance is symmetric (each leg 4.8 degrees out). The reference stands with its weight on one leg (0.6 and 9.1 degrees).
3. Lashes and pupils are deep navy, not the near-black of the reference, because nothing in the file may be black.
4. Hair is five fringe clumps, two side locks, two back clumps and the top tuft. The reference has more and finer locks, a softer gloss and a few loose strands.
5. The shoulders read rounder than the reference's set-in sleeves, and the hood lies flatter.
6. The hand shows the back of the hand with fingers side by side; the reference hand is a three-quarter view with foreshortened fingers.
7. Nose, mouth and ears are simpler shapes; the shoes have four lace rows, not five.
8. Proportion: 5.78 heads tall against the reference's 5.82.
