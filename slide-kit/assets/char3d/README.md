# `char3d/` — the character as a true 3D model

The mustard-hoodie character as a real 3D model you can turn, pose and animate in the browser.
Every garment is one continuous skinned surface, so shoulders, elbows, knees and fingers bend
without a seam. Shapes, sizes and colours are measured on the reference picture
(`assets/illustrations/Mustard Hoodie Boy in 3D Style.png`, 1 px = 0.1222 cm); nothing is traced
or copied from it. The 2D version in `../char/` is untouched.

| File | What it is |
|---|---|
| `preview.html` | the viewer: orbit with the mouse, a slider for every joint, presets, animations, IK handles |
| `char3d.bundle.js` | everything the viewer needs in one script (896 KB): three.js, the model code and the rig. Generated |
| `rig.json` | 156 joints with limits, couplings, 4 IK chains, 25 springs, hand presets. Generated |
| `src/` | the sources. `node src/build.mjs` writes the three files above and this README |
| `vendor/three/` | three.js 0.187.0, MIT, vendored |
| `tests/acceptance.mjs` | the eight acceptance checks |
| `tests/compare.mjs` | renders the model at the reference's framing, writes side-by-side pictures (full body, face, wave at its peak) and measures limb thickness through the wave |

## Run the preview

```bash
cd slide-kit/assets/char3d
python3 -m http.server 8792 --bind 127.0.0.1     # then open http://127.0.0.1:8792/preview.html
```

Double-clicking `preview.html` works too: the page is one classic script, and when the browser
will not read `rig.json` from disk it uses the copy inside the bundle. Nothing comes from the network.

- **Drag** to orbit, **scroll** to zoom, **right-drag** to pan. The buttons at the bottom left jump to front, three-quarter, side, back, face and hand.
- After changing anything under `src/`, run `node src/build.mjs` (Node 20.11 or newer; it uses the esbuild already installed in `deck-engine/`).
- To run the checks: `node tests/acceptance.mjs` with the folder served as above.
- To compare with the reference: `node tests/compare.mjs out/` writes `compare-full.png`, `compare-face.png`, `compare-wave.png` and `thickness.json`.

## The three characters

One bundle holds three characters on the same skeleton and the same `rig.json`. Pick one with the
**Character** menu at the top of the panel, with `?c=` in the address (`preview.html?c=sporty`), or by
setting `window.CHAR3D_CAST` before the script loads. Each is built when the page opens (about 10 to 12 s).

| `c=` | Character | Reference (a style guide only: sizes and colours measured, nothing traced) |
|---|---|---|
| `mustard` | the mustard-hoodie boy, the first character | `assets/illustrations/Mustard Hoodie Boy in 3D Style.png` |
| `sporty` | colour-block puffer jacket over a cream hoodie, olive cargo joggers, white court sneakers, watch | `Sporty 3D Boy Character Render.png` (this folder) |
| `varsity` | maroon varsity jacket with a "B" patch, the cream hoodie's hood over it, baggy blue cargo jeans, maroon high-tops, watch | `Stylized Boy with Side-Swept Hair.png` (this folder) |

**What they share:** the skeleton, every joint and limit, the IK chains and the physics (`rig.json` is one
file), the hands, the light, and the way every surface is made (blended shapes, one closed skinned mesh per
material, generated PBR sets, tinted baked shade, cartoon face and hair).

**What each has of his own:** a head shape (the front outline measured row by row on his picture; the side
profile is the first character's, slid to his chin, eyes and crown), a face drawing (eyes, brows, nose, mouth,
blush, brown irises), a hairstyle (sculpted clumps on a dome of his own size), skin, hair and eye colours, and
the clothes. The varsity boy's neck and face are longer: his head sits 2.7 cm higher on the same skeleton.

| Sources | What is in them |
|---|---|
| `src/cast.js` | the list: palettes, face measurements, head outlines, shade tones |
| `src/hair2.js` | the new heads and both hairstyles |
| `src/face2.js` | the new face drawings |
| `src/outfits.js` | both outfits, the watch, the snaps |

The new clothes add two things the first character never needed. **Colour blocks** (the puffer's navy, cream
and orange panels, the varsity stripes and patch, the shoe panels) are drawn per pixel from each vertex's
distance to the edge between two colours, so an edge is crisp and straight whatever the mesh size. **Dark cloth
keeps its hue** in deep shade (a floor of its own colour on the bounce light), so the navy and the maroon never
turn grey: no black and no dark grey anywhere, as for the first character. Both are added to a shader only when
the material asks for them.

**The first character is unchanged.** Every code path above branches on the character; his mesh data
(positions, normals, colours, shade, weights, seams of all nine meshes), his bones, `rig.json` and his shader
source are identical to the approved version, checked by fingerprint.

To compare a new character with his picture: `CAST=sporty node tests/compare.mjs out/`. To run the checks on
him: `URL='http://127.0.0.1:8792/preview.html?c=sporty' node tests/acceptance.mjs`. All eight pass for each.

## How the model is made

There is no modelling file and no image file. The character is described in code and built when the page loads (about 9.7 s).

1. **Shapes.** Each part is a set of solids with a distance function (`src/sdf.js`, `src/body.js`, `src/headmodel.js`), joined with a *smooth union*, so a sleeve grows out of the torso instead of meeting it at a seam. 259 shapes in all. Besides spheres, tapered capsules, ellipsoids and rounded boxes there are:
   - **lofted solids** for the head, torso, seat and shoes: a front outline and a side profile against height, with a cross-section that can be round or nearly square. The head's outline is the reference's, row by row: 17.4 cm across the cheeks, a small chin, broad and almost flat across the eyes.
   - **the hair**: 16 sculpted clumps lying on a rounded dome, the way a cartoon figure's hair is modelled: five across the forehead, a temple and a side clump over each ear, five round the back, and the tuft on the crown. Each runs from the crown through its widest point to a pointed tip; they are thick, full and smooth and overlap like roof tiles. No strands, fibres or hair cards.
   - **the collar**: a funnel of thick cloth round the neck, open in a V, that dives under the body's surface along the neckline.
   - **the pocket and toe caps**: patches of even thickness on the curved surface under them.
2. **Mesh.** The blended field is sampled on a grid and turned into triangles by surface nets. 9 meshes, 184,705 vertices, 369,572 triangles, every mesh closed (no open edges), so a bend cannot open a gap.
3. **Skin weights** come from the shapes: a vertex follows the bones of the shapes it belongs to. Along an arm or a leg the weight slides from bone to bone through **helper bones**, so no two neighbouring bones differ by a large angle: three bend helpers at each shoulder, elbow, hip and knee (25, 50, 75 % of the bend) and four twist bones along each upper arm and forearm, three along each thigh. That is what keeps a sleeve the same thickness when the arm is raised and turned (see *Thickness in the wave* below).
4. **Surfaces** (`src/textures.js`, `src/material.js`). Each material has a PBR texture set generated in code from one height field: **albedo**, **normal**, **roughness** and **ambient occlusion**.
   | Surface | Height field | Tile |
   |---|---|---|
   | hoodie, cords | jersey knit: columns of V-shaped loops, brushed | 512 px, 3.2 cm |
   | jeans | twill: steep ridges of indigo warp, pale weft between, slubs down the length | 512 px, 2.4 cm |
   | shoes (canvas) | plain weave, over one and under one | 256 px, 1.6 cm |
   | hands | fine pores | 256 px, 2.2 cm |
   | rubber, metal tips | smooth with a little variation | 128 px, 3 cm |
   The sets are laid on by triplanar projection in the build pose, so the weave stays glued to the cloth when the character moves. What the mesh is too coarse to carry is drawn per pixel from data on the vertices: **ribbing** on cuffs and hem, **seams** with their creases (armholes, neckline, hem, cuffs, inseams), **stitching** (pocket, hood edge, fly, jeans pockets, yoke, hems), the **line round the sole**. Fleece and denim have a soft sheen; the cord tips are metal and reflect a small studio built in code.
5. **Shade.** Each vertex knows how much of the neighbouring shapes sits in front of it (inside the hood, under the arm, between fingers, under the fringe). That darkens the ambient light towards a deeper tone of the same hue, never to grey or black.
   **The face and the hair are cartoon surfaces** and use none of these sets: one even colour in two soft tones, lit and shade (the shade tone is the palette colour times a fixed tint), with no pores, grain, gloss or strand texture. Where light and baked shade fall decides which tone shows; the edge between them is soft. The hair adds one gentle band of lighter colour at a set distance from the crown.
6. **Face** (`src/face.js`, `src/eyes.js`): three layers. The **face drawing** (skin, blush, brows, lash band with its wing, lid crease, lower lashes, nose shade, mouth) is projected onto the head, and the eye openings are *holes* in it. 4 mm behind the skin lies the **eye layer**: the white with the lid's shade on it, the iris (dark at the top, bright at the bottom, a dark rim, fine fibres) and the pupil, with a bowl 5 mm deep under the iris, so the pupil sits a centimetre behind the lids and shifts against them as the view turns. 1 mm behind the skin floats the **glint layer** with the two highlights. A blink is the upper lid's edge moving down to the lower one, lash band and all.
7. **Light**, set to the reference's. A strong key from high on the right front whose shadows are soft and take away only about half the light; a low warm fill from the front left; a rim from behind; a sky light with little coming up from below, so undersides fall away; soft contact shadows under the feet. Shade is warm and saturated (cloth lit by its own bounce), highlights lean yellow-white (a soft sheen on fleece and denim). The face has three tones: lit #F7BC95, brightest #FDCDA9 where the key strikes it, shade #D38C6C; the hair's shade is #20233F. No tone curve: the palette is the reference's own colours.

Units are centimetres. The ground is y = 0, the crown of the head is at 164.6 cm (the tuft reaches 169) and the character faces +z; its left is +x.

## Thickness in the wave

`tests/compare.mjs` cuts the raised arm into slices in the idle pose and measures the same vertices on every frame of two full swings of the wave (150 frames). Thickness as a share of the idle pose:

| Part | Before this revision | Now |
|---|---|---|
| upper arm, thinnest slice | 0.70 (at the shoulder) | 0.99 |
| forearm, thinnest slice | 0.91 (at the elbow) | 1.00 |
| wrist, palm, fingers, thumb | 0.99 | 0.98 to 1.02 |

The cause was the arm's twist: 82 to 92 degrees of it reached the mesh in one step at the shoulder, and linear skinning shrinks whatever lies between two bones that far apart. The twist is now spread over five bones along the upper arm and the bend over four at each joint. The animation itself (joint values, timing) is unchanged.

## Using the rig

```js
// inside the bundle: window.rig is the Rig, window.app holds the three.js scene
rig.set('elbow-r', 90);                       // clamped to the limit, returns what was stored
rig.hand('fist', ['r']);                      // fist | open | relaxed
rig.setIK('hand-l', true); rig.moveIK('hand-l', 40, 150, 30);   // centimetres
rig.play('wave');                             // wave | walk; rig.stop() ends it
rig.once('parkour');                          // parkour | rap: plays once and returns to idle; refused (false) while one plays (src/clips.js)
rig.physics = true; rig.breathing = true;
```

- A joint turns one bone about one of its local axes: **x** is the hinge, **y** runs along the bone, **z** is the third. The value is anatomical and the same on both sides.
- **R** is the character's right.
- Each frame: animation and sliders, breathing and blink, **limits**, forward kinematics, ground contact and balance, arm IK, helper bones, springs, then the face drawing.
- **Ground and balance** (Physics on): the centre of mass is compared with the feet carrying weight and the pelvis shifts over them. A leg whose hip and knee sliders are at their defaults is *standing*: it is re-solved so its foot stays planted and flat. Move a hip or knee slider and that leg is free.
- **IK** is a two-bone solve with a pole direction for the elbow or knee, then a short search inside the limits when a limit blocks the exact answer. A target that cannot be reached is pulled back to where the limb stopped.

## Joints and limits

Limits live in `rig.json` and are enforced by the runtime. Degrees unless the unit says otherwise.

### Head

| Joint | Label | Min | Max | Default | Unit | Turns |
|---|---|---|---|---|---|---|
| `neck-1-nod` | Neck lower nod | -12 | 12 | 0 | deg | neck-1, axis x |
| `neck-1-turn` | Neck lower turn | -20 | 20 | 0 | deg | neck-1, axis y |
| `neck-1-tilt` | Neck lower tilt | -10 | 10 | 0 | deg | neck-1, axis z |
| `neck-2-nod` | Neck upper nod | -12 | 12 | 0 | deg | neck-2, axis x |
| `neck-2-turn` | Neck upper turn | -20 | 20 | 0 | deg | neck-2, axis y |
| `neck-2-tilt` | Neck upper tilt | -10 | 10 | 0 | deg | neck-2, axis z |
| `head-nod` | Head nod | -25 | 25 | 0 | deg | head, axis x |
| `head-turn` | Head turn | -30 | 30 | 0 | deg | head, axis y |
| `head-tilt` | Head tilt | -15 | 15 | 0 | deg | head, axis z |
| `jaw` | Jaw open | 0 | 22 | 0 | deg | jaw, axis x |
| `eyelid-upper-r` | Upper eyelid R | 0 | 100 | 0 | % | face drawing |
| `eyelid-lower-r` | Lower eyelid R | 0 | 100 | 0 | % | face drawing |
| `gaze-x-r` | Iris R left / right | -6 | 6 | 0 | px | face drawing |
| `gaze-y-r` | Iris R up / down | -4 | 4 | 0 | px | face drawing |
| `pupil-r` | Pupil R size | -30 | 35 | 0 | % | face drawing |
| `brow-r` | Brow R raise | -6 | 8 | 0 | px | face drawing |
| `brow-inner-r` | Brow R inner | -25 | 25 | 0 | deg | face drawing |
| `brow-outer-r` | Brow R outer | -20 | 20 | 0 | deg | face drawing |
| `cheek-r` | Cheek R raise | 0 | 6 | 0 | px | face drawing |
| `lip-corner-r` | Lip corner R | -25 | 25 | 0 | deg | face drawing |
| `ear-r` | Ear R | -10 | 10 | 0 | deg | ear-r, axis x |
| `eyelid-upper-l` | Upper eyelid L | 0 | 100 | 0 | % | face drawing |
| `eyelid-lower-l` | Lower eyelid L | 0 | 100 | 0 | % | face drawing |
| `gaze-x-l` | Iris L left / right | -6 | 6 | 0 | px | face drawing |
| `gaze-y-l` | Iris L up / down | -4 | 4 | 0 | px | face drawing |
| `pupil-l` | Pupil L size | -30 | 35 | 0 | % | face drawing |
| `brow-l` | Brow L raise | -6 | 8 | 0 | px | face drawing |
| `brow-inner-l` | Brow L inner | -25 | 25 | 0 | deg | face drawing |
| `brow-outer-l` | Brow L outer | -20 | 20 | 0 | deg | face drawing |
| `cheek-l` | Cheek L raise | 0 | 6 | 0 | px | face drawing |
| `lip-corner-l` | Lip corner L | -25 | 25 | 0 | deg | face drawing |
| `ear-l` | Ear L | -10 | 10 | 0 | deg | ear-l, axis x |
| `hair-top-x` | Hair top tuft swing | -35 | 35 | 0 | deg | hair-top, axis x |
| `hair-top-z` | Hair top tuft sway | -35 | 35 | 0 | deg | hair-top, axis z |
| `hair-front-1-x` | Hair front 1 swing | -14 | 14 | 0 | deg | hair-front-1, axis x |
| `hair-front-1-z` | Hair front 1 sway | -14 | 14 | 0 | deg | hair-front-1, axis z |
| `hair-front-2-x` | Hair front 2 swing | -14 | 14 | 0 | deg | hair-front-2, axis x |
| `hair-front-2-z` | Hair front 2 sway | -14 | 14 | 0 | deg | hair-front-2, axis z |
| `hair-front-3-x` | Hair front 3 swing | -14 | 14 | 0 | deg | hair-front-3, axis x |
| `hair-front-3-z` | Hair front 3 sway | -14 | 14 | 0 | deg | hair-front-3, axis z |
| `hair-front-4-x` | Hair front 4 swing | -14 | 14 | 0 | deg | hair-front-4, axis x |
| `hair-front-4-z` | Hair front 4 sway | -14 | 14 | 0 | deg | hair-front-4, axis z |
| `hair-front-5-x` | Hair front 5 swing | -14 | 14 | 0 | deg | hair-front-5, axis x |
| `hair-front-5-z` | Hair front 5 sway | -14 | 14 | 0 | deg | hair-front-5, axis z |
| `hair-side-r-x` | Hair side R swing | -15 | 15 | 0 | deg | hair-side-r, axis x |
| `hair-side-r-z` | Hair side R sway | -15 | 15 | 0 | deg | hair-side-r, axis z |
| `hair-side-l-x` | Hair side L swing | -15 | 15 | 0 | deg | hair-side-l, axis x |
| `hair-side-l-z` | Hair side L sway | -15 | 15 | 0 | deg | hair-side-l, axis z |
| `hair-back-x` | Hair back swing | -12 | 12 | 0 | deg | hair-back, axis x |
| `hair-back-z` | Hair back sway | -12 | 12 | 0 | deg | hair-back, axis z |

### Torso

| Joint | Label | Min | Max | Default | Unit | Turns |
|---|---|---|---|---|---|---|
| `pelvis-bend` | Pelvis bend | -20 | 20 | 0 | deg | pelvis, axis x |
| `pelvis-turn` | Pelvis turn | -30 | 30 | 0 | deg | pelvis, axis y |
| `pelvis-side` | Pelvis side | -15 | 15 | 0 | deg | pelvis, axis z |
| `spine-1-bend` | Spine lower bend | -15 | 25 | 0 | deg | spine-1, axis x |
| `spine-1-turn` | Spine lower turn | -12 | 12 | 0 | deg | spine-1, axis y |
| `spine-1-side` | Spine lower side | -12 | 12 | 0 | deg | spine-1, axis z |
| `spine-2-bend` | Spine middle bend | -12 | 20 | 0 | deg | spine-2, axis x |
| `spine-2-turn` | Spine middle turn | -12 | 12 | 0 | deg | spine-2, axis y |
| `spine-2-side` | Spine middle side | -10 | 10 | 0 | deg | spine-2, axis z |
| `spine-3-bend` | Spine upper (chest) bend | -10 | 15 | 0 | deg | spine-3, axis x |
| `spine-3-turn` | Spine upper (chest) turn | -12 | 12 | 0 | deg | spine-3, axis y |
| `spine-3-side` | Spine upper (chest) side | -8 | 8 | 0 | deg | spine-3, axis z |
| `clavicle-lift-r` | Clavicle R lift (shrug) | -10 | 30 | 0 | deg | clavicle-r, axis z |
| `clavicle-forward-r` | Clavicle R forward | -15 | 20 | 0 | deg | clavicle-r, axis x |
| `clavicle-lift-l` | Clavicle L lift (shrug) | -10 | 30 | 0 | deg | clavicle-l, axis z |
| `clavicle-forward-l` | Clavicle L forward | -15 | 20 | 0 | deg | clavicle-l, axis x |
| `hood-x` | Hood swing | -10 | 10 | 0 | deg | hood, axis x |
| `hood-z` | Hood sway | -10 | 10 | 0 | deg | hood, axis z |
| `hem-x` | Hem swing | -6 | 6 | 0 | deg | hem, axis x |
| `hem-z` | Hem sway | -6 | 6 | 0 | deg | hem, axis z |
| `drawstring-r-1-x` | Drawstring R 1 swing | -60 | 60 | 0 | deg | drawstring-r-1, axis x |
| `drawstring-r-1-z` | Drawstring R 1 sway | -60 | 60 | 0 | deg | drawstring-r-1, axis z |
| `drawstring-r-2-x` | Drawstring R 2 swing | -60 | 60 | 0 | deg | drawstring-r-2, axis x |
| `drawstring-r-2-z` | Drawstring R 2 sway | -60 | 60 | 0 | deg | drawstring-r-2, axis z |
| `drawstring-r-3-x` | Drawstring R 3 swing | -60 | 60 | 0 | deg | drawstring-r-3, axis x |
| `drawstring-r-3-z` | Drawstring R 3 sway | -60 | 60 | 0 | deg | drawstring-r-3, axis z |
| `drawstring-l-1-x` | Drawstring L 1 swing | -60 | 60 | 0 | deg | drawstring-l-1, axis x |
| `drawstring-l-1-z` | Drawstring L 1 sway | -60 | 60 | 0 | deg | drawstring-l-1, axis z |
| `drawstring-l-2-x` | Drawstring L 2 swing | -60 | 60 | 0 | deg | drawstring-l-2, axis x |
| `drawstring-l-2-z` | Drawstring L 2 sway | -60 | 60 | 0 | deg | drawstring-l-2, axis z |
| `drawstring-l-3-x` | Drawstring L 3 swing | -60 | 60 | 0 | deg | drawstring-l-3, axis x |
| `drawstring-l-3-z` | Drawstring L 3 sway | -60 | 60 | 0 | deg | drawstring-l-3, axis z |

### Arms

| Joint | Label | Min | Max | Default | Unit | Turns |
|---|---|---|---|---|---|---|
| `shoulder-raise-r` | Shoulder R raise sideways | 10 | 180 | 14.7 | deg | upper-arm-r, axis z, built at 50 |
| `shoulder-forward-r` | Shoulder R raise forward | -60 | 180 | 0 | deg | upper-arm-r, axis x |
| `shoulder-twist-r` | Shoulder R twist (in to out) | -90 | 90 | 0 | deg | upper-arm-r, axis y |
| `elbow-r` | Elbow R | 0 | 145 | 10 | deg | forearm-r, axis x |
| `forearm-twist-r` | Forearm R twist | -80 | 80 | -35 | deg | forearm-r, axis y |
| `wrist-r` | Wrist R bend | -70 | 80 | 0 | deg | hand-r, axis x |
| `wrist-side-r` | Wrist R side | -25 | 30 | 0 | deg | hand-r, axis z |
| `cuff-r-x` | Sleeve cuff R swing | -10 | 10 | 0 | deg | cuff-r, axis x |
| `cuff-r-z` | Sleeve cuff R sway | -10 | 10 | 0 | deg | cuff-r, axis z |
| `shoulder-raise-l` | Shoulder L raise sideways | 10 | 180 | 14.7 | deg | upper-arm-l, axis z, built at 50 |
| `shoulder-forward-l` | Shoulder L raise forward | -60 | 180 | 0 | deg | upper-arm-l, axis x |
| `shoulder-twist-l` | Shoulder L twist (in to out) | -90 | 90 | 0 | deg | upper-arm-l, axis y |
| `elbow-l` | Elbow L | 0 | 145 | 10 | deg | forearm-l, axis x |
| `forearm-twist-l` | Forearm L twist | -80 | 80 | -35 | deg | forearm-l, axis y |
| `wrist-l` | Wrist L bend | -70 | 80 | 0 | deg | hand-l, axis x |
| `wrist-side-l` | Wrist L side | -25 | 30 | 0 | deg | hand-l, axis z |
| `cuff-l-x` | Sleeve cuff L swing | -10 | 10 | 0 | deg | cuff-l, axis x |
| `cuff-l-z` | Sleeve cuff L sway | -10 | 10 | 0 | deg | cuff-l, axis z |

### Hands and fingers

| Joint | Label | Min | Max | Default | Unit | Turns |
|---|---|---|---|---|---|---|
| `finger-index-prox-r` | R index proximal | 0 | 90 | 24 | deg | finger-index-prox-r, axis x |
| `finger-index-mid-r` | R index middle | 0 | 100 | 34 | deg | finger-index-mid-r, axis x |
| `finger-index-dist-r` | R index distal | 0 | 80 | 16 | deg | finger-index-dist-r, axis x |
| `finger-index-spread-r` | R index spread | -15 | 15 | 0 | deg | finger-index-prox-r, axis z |
| `finger-middle-prox-r` | R middle proximal | 0 | 90 | 30 | deg | finger-middle-prox-r, axis x |
| `finger-middle-mid-r` | R middle middle | 0 | 100 | 40 | deg | finger-middle-mid-r, axis x |
| `finger-middle-dist-r` | R middle distal | 0 | 80 | 20 | deg | finger-middle-dist-r, axis x |
| `finger-middle-spread-r` | R middle spread | -15 | 15 | 0 | deg | finger-middle-prox-r, axis z |
| `finger-ring-prox-r` | R ring proximal | 0 | 90 | 36 | deg | finger-ring-prox-r, axis x |
| `finger-ring-mid-r` | R ring middle | 0 | 100 | 44 | deg | finger-ring-mid-r, axis x |
| `finger-ring-dist-r` | R ring distal | 0 | 80 | 22 | deg | finger-ring-dist-r, axis x |
| `finger-ring-spread-r` | R ring spread | -15 | 15 | 0 | deg | finger-ring-prox-r, axis z |
| `finger-pinky-prox-r` | R pinky proximal | 0 | 90 | 42 | deg | finger-pinky-prox-r, axis x |
| `finger-pinky-mid-r` | R pinky middle | 0 | 100 | 48 | deg | finger-pinky-mid-r, axis x |
| `finger-pinky-dist-r` | R pinky distal | 0 | 80 | 24 | deg | finger-pinky-dist-r, axis x |
| `finger-pinky-spread-r` | R pinky spread | -15 | 15 | 0 | deg | finger-pinky-prox-r, axis z |
| `thumb-meta-r` | R thumb base bend | -15 | 45 | 6 | deg | thumb-meta-r, axis x |
| `thumb-spread-r` | R thumb base spread | -20 | 40 | 0 | deg | thumb-meta-r, axis z |
| `thumb-prox-r` | R thumb proximal | 0 | 60 | 14 | deg | thumb-prox-r, axis x |
| `thumb-dist-r` | R thumb distal | -10 | 80 | 12 | deg | thumb-dist-r, axis x |
| `finger-index-prox-l` | L index proximal | 0 | 90 | 24 | deg | finger-index-prox-l, axis x |
| `finger-index-mid-l` | L index middle | 0 | 100 | 34 | deg | finger-index-mid-l, axis x |
| `finger-index-dist-l` | L index distal | 0 | 80 | 16 | deg | finger-index-dist-l, axis x |
| `finger-index-spread-l` | L index spread | -15 | 15 | 0 | deg | finger-index-prox-l, axis z |
| `finger-middle-prox-l` | L middle proximal | 0 | 90 | 30 | deg | finger-middle-prox-l, axis x |
| `finger-middle-mid-l` | L middle middle | 0 | 100 | 40 | deg | finger-middle-mid-l, axis x |
| `finger-middle-dist-l` | L middle distal | 0 | 80 | 20 | deg | finger-middle-dist-l, axis x |
| `finger-middle-spread-l` | L middle spread | -15 | 15 | 0 | deg | finger-middle-prox-l, axis z |
| `finger-ring-prox-l` | L ring proximal | 0 | 90 | 36 | deg | finger-ring-prox-l, axis x |
| `finger-ring-mid-l` | L ring middle | 0 | 100 | 44 | deg | finger-ring-mid-l, axis x |
| `finger-ring-dist-l` | L ring distal | 0 | 80 | 22 | deg | finger-ring-dist-l, axis x |
| `finger-ring-spread-l` | L ring spread | -15 | 15 | 0 | deg | finger-ring-prox-l, axis z |
| `finger-pinky-prox-l` | L pinky proximal | 0 | 90 | 42 | deg | finger-pinky-prox-l, axis x |
| `finger-pinky-mid-l` | L pinky middle | 0 | 100 | 48 | deg | finger-pinky-mid-l, axis x |
| `finger-pinky-dist-l` | L pinky distal | 0 | 80 | 24 | deg | finger-pinky-dist-l, axis x |
| `finger-pinky-spread-l` | L pinky spread | -15 | 15 | 0 | deg | finger-pinky-prox-l, axis z |
| `thumb-meta-l` | L thumb base bend | -15 | 45 | 6 | deg | thumb-meta-l, axis x |
| `thumb-spread-l` | L thumb base spread | -20 | 40 | 0 | deg | thumb-meta-l, axis z |
| `thumb-prox-l` | L thumb proximal | 0 | 60 | 14 | deg | thumb-prox-l, axis x |
| `thumb-dist-l` | L thumb distal | -10 | 80 | 12 | deg | thumb-dist-l, axis x |

### Legs

| Joint | Label | Min | Max | Default | Unit | Turns |
|---|---|---|---|---|---|---|
| `hip-forward-r` | Hip R raise forward | -30 | 120 | 0 | deg | thigh-r, axis x |
| `hip-side-r` | Hip R raise sideways | -15 | 50 | 4.8 | deg | thigh-r, axis z, built at 4.8 |
| `hip-twist-r` | Hip R twist (in to out) | -40 | 45 | 0 | deg | thigh-r, axis y |
| `knee-r` | Knee R | 0 | 140 | 0 | deg | shin-r, axis x |
| `ankle-r` | Ankle R (toes up / down) | -40 | 50 | 0 | deg | foot-r, axis x |
| `ankle-roll-r` | Ankle R roll | -20 | 20 | 0 | deg | foot-r, axis y |
| `ankle-turn-r` | Ankle R turn | -15 | 15 | 0 | deg | foot-r, axis z |
| `toes-r` | Toes R | -10 | 40 | 0 | deg | toes-r, axis x |
| `hip-forward-l` | Hip L raise forward | -30 | 120 | 0 | deg | thigh-l, axis x |
| `hip-side-l` | Hip L raise sideways | -15 | 50 | 4.8 | deg | thigh-l, axis z, built at 4.8 |
| `hip-twist-l` | Hip L twist (in to out) | -40 | 45 | 0 | deg | thigh-l, axis y |
| `knee-l` | Knee L | 0 | 140 | 0 | deg | shin-l, axis x |
| `ankle-l` | Ankle L (toes up / down) | -40 | 50 | 0 | deg | foot-l, axis x |
| `ankle-roll-l` | Ankle L roll | -20 | 20 | 0 | deg | foot-l, axis y |
| `ankle-turn-l` | Ankle L turn | -15 | 15 | 0 | deg | foot-l, axis z |
| `toes-l` | Toes L | -10 | 40 | 0 | deg | toes-l, axis x |

Notes:

- **Head turn** is real now: `neck-1-turn` (20) + `neck-2-turn` (20) + `head-turn` (30) = 70 degrees each way.
- **Shoulder** has three joints: raise sideways (10 to 180), raise forward (-60 to 180) and twist. Below 10 degrees sideways the sleeve would pass into the torso, so the limit stops there.
- **Elbow** 0 to 145, **knee** 0 to 140, **fingers** 0 to 90 / 100 / 80, **wrist** -70 to 80, **ankle** -40 to 50, as asked.
- The clavicle lifts by itself as the arm rises past 30 degrees (scapula shift).
- **Rest pose of the hands**: the forearm rests turned 35 degrees so the back of the hand faces forward, and the fingers curl a little more, as in the reference. The wave sets these joints itself and is unchanged.

## Bones

122 bones (46 of them helpers the runtime drives by itself). Positions are where the bone starts in the build pose (arms 50 degrees out from the body).

| Bone | Parent | Position (x, y, z) cm | Driven by |
|---|---|---|---|
| `root` | (top) | 0, 0, 0 | ground contact, balance |
| `pelvis` | `root` | 0, 84, 0 | `pelvis-bend`, `pelvis-turn`, `pelvis-side` |
| `spine-1` | `pelvis` | 0, 89, 0 | `spine-1-bend`, `spine-1-turn`, `spine-1-side` |
| `spine-2` | `spine-1` | 0, 103.5, 0 | `spine-2-bend`, `spine-2-turn`, `spine-2-side`, spring |
| `spine-3` | `spine-2` | 0, 115.5, 0 | `spine-3-bend`, `spine-3-turn`, `spine-3-side`, spring |
| `hem` | `spine-1` | 0, 91, 0 | `hem-x`, `hem-z`, spring |
| `neck-1` | `spine-3` | 0, 130.5, -0.6 | `neck-1-nod`, `neck-1-turn`, `neck-1-tilt` |
| `neck-2` | `neck-1` | 0, 134.5, -0.3 | `neck-2-nod`, `neck-2-turn`, `neck-2-tilt`, spring |
| `head` | `neck-2` | 0, 138.6, 0.2 | `head-nod`, `head-turn`, `head-tilt`, spring |
| `jaw` | `head` | 0, 143.5, -0.5 | `jaw` |
| `hair-top` | `head` | 0.3, 163, 0.4 | `hair-top-x`, `hair-top-z`, spring |
| `hair-front-1` | `head` | -4.1, 157.9, 3.7 | `hair-front-1-x`, `hair-front-1-z`, spring |
| `hair-front-2` | `head` | -1.5, 158.1, 6.1 | `hair-front-2-x`, `hair-front-2-z`, spring |
| `hair-front-3` | `head` | 1.3, 158.1, 6.5 | `hair-front-3-x`, `hair-front-3-z`, spring |
| `hair-front-4` | `head` | 3.7, 157.9, 6 | `hair-front-4-x`, `hair-front-4-z`, spring |
| `hair-front-5` | `head` | 5.5, 157.7, 3.9 | `hair-front-5-x`, `hair-front-5-z`, spring |
| `hair-back` | `head` | 0, 147, -8.4 | `hair-back-x`, `hair-back-z`, spring |
| `hood` | `spine-3` | 0, 131, -4.5 | `hood-x`, `hood-z`, spring |
| `ear-r` | `head` | -9.2, 145.2, -0.6 | `ear-r` |
| `hair-side-r` | `head` | -11.2, 155, 1.5 | `hair-side-r-x`, `hair-side-r-z`, spring |
| `drawstring-r-1` | `spine-3` | -2.6, 127.2, 8 | `drawstring-r-1-x`, `drawstring-r-1-z`, spring |
| `drawstring-r-2` | `drawstring-r-1` | -2.6, 123.5, 8 | `drawstring-r-2-x`, `drawstring-r-2-z`, spring |
| `drawstring-r-3` | `drawstring-r-2` | -2.6, 119.8, 8 | `drawstring-r-3-x`, `drawstring-r-3-z`, spring |
| `clavicle-r` | `spine-3` | -2.2, 126.6, 0.6 | `clavicle-lift-r`, `clavicle-forward-r` |
| `shoulder-r-h1` | `clavicle-r` | -12.2, 124.8, -0.5 | helper: takes 25 % of the bend of the bone beside it |
| `shoulder-r-h2` | `clavicle-r` | -12.2, 124.8, -0.5 | helper: takes 50 % of the bend of the bone beside it |
| `shoulder-r-h3` | `clavicle-r` | -12.2, 124.8, -0.5 | helper: takes 75 % of the bend of the bone beside it |
| `upper-arm-r` | `clavicle-r` | -12.2, 124.8, -0.5 | `shoulder-raise-r`, `shoulder-forward-r`, `shoulder-twist-r` |
| `upper-arm-r-t0` | `upper-arm-r` | -12.2, 124.8, -0.5 | twist bone: takes 0 % of the limb's twist |
| `upper-arm-r-t1` | `upper-arm-r` | -12.2, 124.8, -0.5 | twist bone: takes 25 % of the limb's twist |
| `upper-arm-r-t2` | `upper-arm-r` | -12.2, 124.8, -0.5 | twist bone: takes 50 % of the limb's twist |
| `upper-arm-r-t3` | `upper-arm-r` | -12.2, 124.8, -0.5 | twist bone: takes 75 % of the limb's twist |
| `elbow-r-h1` | `upper-arm-r` | -28.3, 111.3, -0.5 | helper: takes 25 % of the bend of the bone beside it |
| `elbow-r-h2` | `upper-arm-r` | -28.3, 111.3, -0.5 | helper: takes 50 % of the bend of the bone beside it |
| `elbow-r-h3` | `upper-arm-r` | -28.3, 111.3, -0.5 | helper: takes 75 % of the bend of the bone beside it |
| `forearm-r` | `upper-arm-r` | -28.3, 111.3, -0.5 | `elbow-r`, `forearm-twist-r` |
| `forearm-r-t0` | `forearm-r` | -28.3, 111.3, -0.5 | twist bone: takes 0 % of the limb's twist |
| `forearm-r-t1` | `forearm-r` | -28.3, 111.3, -0.5 | twist bone: takes 25 % of the limb's twist |
| `forearm-r-t2` | `forearm-r` | -28.3, 111.3, -0.5 | twist bone: takes 50 % of the limb's twist |
| `forearm-r-t3` | `forearm-r` | -28.3, 111.3, -0.5 | twist bone: takes 75 % of the limb's twist |
| `cuff-r` | `forearm-r` | -40.6, 101, -0.5 | `cuff-r-x`, `cuff-r-z`, spring |
| `hand-r` | `forearm-r` | -43.8, 98.3, -0.5 | `wrist-r`, `wrist-side-r`, spring |
| `finger-index-prox-r` | `hand-r` | -49.3, 93.8, 1.6 | `finger-index-prox-r`, `finger-index-spread-r` |
| `finger-index-mid-r` | `finger-index-prox-r` | -51.4, 92, 1.9 | `finger-index-mid-r` |
| `finger-index-dist-r` | `finger-index-mid-r` | -52.7, 90.9, 2 | `finger-index-dist-r` |
| `finger-middle-prox-r` | `hand-r` | -49.5, 93.6, 0.2 | `finger-middle-prox-r`, `finger-middle-spread-r` |
| `finger-middle-mid-r` | `finger-middle-prox-r` | -51.8, 91.6, 0.3 | `finger-middle-mid-r` |
| `finger-middle-dist-r` | `finger-middle-mid-r` | -53.3, 90.4, 0.3 | `finger-middle-dist-r` |
| `finger-ring-prox-r` | `hand-r` | -49.3, 93.8, -1.2 | `finger-ring-prox-r`, `finger-ring-spread-r` |
| `finger-ring-mid-r` | `finger-ring-prox-r` | -51.4, 92, -1.4 | `finger-ring-mid-r` |
| `finger-ring-dist-r` | `finger-ring-mid-r` | -52.8, 90.8, -1.5 | `finger-ring-dist-r` |
| `finger-pinky-prox-r` | `hand-r` | -48.8, 94.2, -2.6 | `finger-pinky-prox-r`, `finger-pinky-spread-r` |
| `finger-pinky-mid-r` | `finger-pinky-prox-r` | -50.4, 92.8, -3 | `finger-pinky-mid-r` |
| `finger-pinky-dist-r` | `finger-pinky-mid-r` | -51.5, 91.9, -3.2 | `finger-pinky-dist-r` |
| `thumb-meta-r` | `hand-r` | -44.8, 96.7, 1.9 | `thumb-meta-r`, `thumb-spread-r` |
| `thumb-prox-r` | `thumb-meta-r` | -46.3, 94.4, 3.2 | `thumb-prox-r` |
| `thumb-dist-r` | `thumb-prox-r` | -47.7, 92.4, 4.4 | `thumb-dist-r` |
| `hip-r-h1` | `pelvis` | -6.3, 79.7, 0 | helper: takes 25 % of the bend of the bone beside it |
| `hip-r-h2` | `pelvis` | -6.3, 79.7, 0 | helper: takes 50 % of the bend of the bone beside it |
| `hip-r-h3` | `pelvis` | -6.3, 79.7, 0 | helper: takes 75 % of the bend of the bone beside it |
| `thigh-r` | `pelvis` | -6.3, 79.7, 0 | `hip-forward-r`, `hip-side-r`, `hip-twist-r` |
| `thigh-r-t0` | `thigh-r` | -6.3, 79.7, 0 | twist bone: takes 0 % of the limb's twist |
| `thigh-r-t1` | `thigh-r` | -6.3, 79.7, 0 | twist bone: takes 33 % of the limb's twist |
| `thigh-r-t2` | `thigh-r` | -6.3, 79.7, 0 | twist bone: takes 67 % of the limb's twist |
| `knee-r-h1` | `thigh-r` | -9.1, 46.8, 0 | helper: takes 25 % of the bend of the bone beside it |
| `knee-r-h2` | `thigh-r` | -9.1, 46.8, 0 | helper: takes 50 % of the bend of the bone beside it |
| `knee-r-h3` | `thigh-r` | -9.1, 46.8, 0 | helper: takes 75 % of the bend of the bone beside it |
| `shin-r` | `thigh-r` | -9.1, 46.8, 0 | `knee-r` |
| `foot-r` | `shin-r` | -12, 12.6, 0 | `ankle-r`, `ankle-roll-r`, `ankle-turn-r` |
| `toes-r` | `foot-r` | -13.5, 2.4, 10.5 | `toes-r` |
| `ear-l` | `head` | 9.2, 145.2, -0.6 | `ear-l` |
| `hair-side-l` | `head` | 11.2, 155, 1.5 | `hair-side-l-x`, `hair-side-l-z`, spring |
| `drawstring-l-1` | `spine-3` | 2.6, 127.2, 8 | `drawstring-l-1-x`, `drawstring-l-1-z`, spring |
| `drawstring-l-2` | `drawstring-l-1` | 2.6, 123.5, 8 | `drawstring-l-2-x`, `drawstring-l-2-z`, spring |
| `drawstring-l-3` | `drawstring-l-2` | 2.6, 119.8, 8 | `drawstring-l-3-x`, `drawstring-l-3-z`, spring |
| `clavicle-l` | `spine-3` | 2.2, 126.6, 0.6 | `clavicle-lift-l`, `clavicle-forward-l` |
| `shoulder-l-h1` | `clavicle-l` | 12.2, 124.8, -0.5 | helper: takes 25 % of the bend of the bone beside it |
| `shoulder-l-h2` | `clavicle-l` | 12.2, 124.8, -0.5 | helper: takes 50 % of the bend of the bone beside it |
| `shoulder-l-h3` | `clavicle-l` | 12.2, 124.8, -0.5 | helper: takes 75 % of the bend of the bone beside it |
| `upper-arm-l` | `clavicle-l` | 12.2, 124.8, -0.5 | `shoulder-raise-l`, `shoulder-forward-l`, `shoulder-twist-l` |
| `upper-arm-l-t0` | `upper-arm-l` | 12.2, 124.8, -0.5 | twist bone: takes 0 % of the limb's twist |
| `upper-arm-l-t1` | `upper-arm-l` | 12.2, 124.8, -0.5 | twist bone: takes 25 % of the limb's twist |
| `upper-arm-l-t2` | `upper-arm-l` | 12.2, 124.8, -0.5 | twist bone: takes 50 % of the limb's twist |
| `upper-arm-l-t3` | `upper-arm-l` | 12.2, 124.8, -0.5 | twist bone: takes 75 % of the limb's twist |
| `elbow-l-h1` | `upper-arm-l` | 28.3, 111.3, -0.5 | helper: takes 25 % of the bend of the bone beside it |
| `elbow-l-h2` | `upper-arm-l` | 28.3, 111.3, -0.5 | helper: takes 50 % of the bend of the bone beside it |
| `elbow-l-h3` | `upper-arm-l` | 28.3, 111.3, -0.5 | helper: takes 75 % of the bend of the bone beside it |
| `forearm-l` | `upper-arm-l` | 28.3, 111.3, -0.5 | `elbow-l`, `forearm-twist-l` |
| `forearm-l-t0` | `forearm-l` | 28.3, 111.3, -0.5 | twist bone: takes 0 % of the limb's twist |
| `forearm-l-t1` | `forearm-l` | 28.3, 111.3, -0.5 | twist bone: takes 25 % of the limb's twist |
| `forearm-l-t2` | `forearm-l` | 28.3, 111.3, -0.5 | twist bone: takes 50 % of the limb's twist |
| `forearm-l-t3` | `forearm-l` | 28.3, 111.3, -0.5 | twist bone: takes 75 % of the limb's twist |
| `cuff-l` | `forearm-l` | 40.6, 101, -0.5 | `cuff-l-x`, `cuff-l-z`, spring |
| `hand-l` | `forearm-l` | 43.8, 98.3, -0.5 | `wrist-l`, `wrist-side-l`, spring |
| `finger-index-prox-l` | `hand-l` | 49.3, 93.8, 1.6 | `finger-index-prox-l`, `finger-index-spread-l` |
| `finger-index-mid-l` | `finger-index-prox-l` | 51.4, 92, 1.9 | `finger-index-mid-l` |
| `finger-index-dist-l` | `finger-index-mid-l` | 52.7, 90.9, 2 | `finger-index-dist-l` |
| `finger-middle-prox-l` | `hand-l` | 49.5, 93.6, 0.2 | `finger-middle-prox-l`, `finger-middle-spread-l` |
| `finger-middle-mid-l` | `finger-middle-prox-l` | 51.8, 91.6, 0.3 | `finger-middle-mid-l` |
| `finger-middle-dist-l` | `finger-middle-mid-l` | 53.3, 90.4, 0.3 | `finger-middle-dist-l` |
| `finger-ring-prox-l` | `hand-l` | 49.3, 93.8, -1.2 | `finger-ring-prox-l`, `finger-ring-spread-l` |
| `finger-ring-mid-l` | `finger-ring-prox-l` | 51.4, 92, -1.4 | `finger-ring-mid-l` |
| `finger-ring-dist-l` | `finger-ring-mid-l` | 52.8, 90.8, -1.5 | `finger-ring-dist-l` |
| `finger-pinky-prox-l` | `hand-l` | 48.8, 94.2, -2.6 | `finger-pinky-prox-l`, `finger-pinky-spread-l` |
| `finger-pinky-mid-l` | `finger-pinky-prox-l` | 50.4, 92.8, -3 | `finger-pinky-mid-l` |
| `finger-pinky-dist-l` | `finger-pinky-mid-l` | 51.5, 91.9, -3.2 | `finger-pinky-dist-l` |
| `thumb-meta-l` | `hand-l` | 44.8, 96.7, 1.9 | `thumb-meta-l`, `thumb-spread-l` |
| `thumb-prox-l` | `thumb-meta-l` | 46.3, 94.4, 3.2 | `thumb-prox-l` |
| `thumb-dist-l` | `thumb-prox-l` | 47.7, 92.4, 4.4 | `thumb-dist-l` |
| `hip-l-h1` | `pelvis` | 6.4, 79.7, 0 | helper: takes 25 % of the bend of the bone beside it |
| `hip-l-h2` | `pelvis` | 6.4, 79.7, 0 | helper: takes 50 % of the bend of the bone beside it |
| `hip-l-h3` | `pelvis` | 6.4, 79.7, 0 | helper: takes 75 % of the bend of the bone beside it |
| `thigh-l` | `pelvis` | 6.4, 79.7, 0 | `hip-forward-l`, `hip-side-l`, `hip-twist-l` |
| `thigh-l-t0` | `thigh-l` | 6.4, 79.7, 0 | twist bone: takes 0 % of the limb's twist |
| `thigh-l-t1` | `thigh-l` | 6.4, 79.7, 0 | twist bone: takes 33 % of the limb's twist |
| `thigh-l-t2` | `thigh-l` | 6.4, 79.7, 0 | twist bone: takes 67 % of the limb's twist |
| `knee-l-h1` | `thigh-l` | 9.1, 46.8, 0 | helper: takes 25 % of the bend of the bone beside it |
| `knee-l-h2` | `thigh-l` | 9.1, 46.8, 0 | helper: takes 50 % of the bend of the bone beside it |
| `knee-l-h3` | `thigh-l` | 9.1, 46.8, 0 | helper: takes 75 % of the bend of the bone beside it |
| `shin-l` | `thigh-l` | 9.1, 46.8, 0 | `knee-l` |
| `foot-l` | `shin-l` | 12, 12.6, 0 | `ankle-l`, `ankle-roll-l`, `ankle-turn-l` |
| `toes-l` | `foot-l` | 13.5, 2.4, 10.5 | `toes-l` |

## Physics values

Each sprung bone is a mass on the end of the bone, pulled back to where a rigid bone would be. In `rig.json` under `physics.springs`.

| Bone | Stiffness | Damping | Mass | Limit (deg) | Length (cm) | Gravity |
|---|---|---|---|---|---|---|
| `hair-top` | 150 | 5 | 0.6 | 26 | 7 | 0 |
| `hair-front-1` | 230 | 9 | 1 | 9 | 13 | 0 |
| `hair-front-2` | 240 | 9 | 1 | 9 | 13 | 0 |
| `hair-front-3` | 220 | 8 | 1.1 | 10 | 14 | 0 |
| `hair-front-4` | 240 | 9 | 1 | 9 | 13 | 0 |
| `hair-front-5` | 230 | 9 | 1 | 9 | 13 | 0 |
| `hair-side-r` | 200 | 8 | 0.8 | 11 | 9 | 0 |
| `hair-side-l` | 200 | 8 | 0.8 | 11 | 9 | 0 |
| `hair-back` | 190 | 9 | 1.5 | 8 | 10 | 0 |
| `hood` | 170 | 10 | 2 | 7 | 8 | 0 |
| `hem` | 180 | 11 | 2 | 5 | 6 | 0 |
| `cuff-r` | 210 | 9 | 1.2 | 8 | 5 | 0 |
| `cuff-l` | 210 | 9 | 1.2 | 8 | 5 | 0 |
| `spine-2` | 300 | 24 | 7 | 2.5 | 12 | 0 |
| `spine-3` | 280 | 22 | 6 | 3 | 15 | 0 |
| `neck-2` | 260 | 20 | 3 | 3.5 | 5 | 0 |
| `head` | 230 | 17 | 4.5 | 4.5 | 14 | 0 |
| `hand-r` | 170 | 11 | 1 | 12 | 9 | 0 |
| `hand-l` | 170 | 11 | 1 | 12 | 9 | 0 |
| `drawstring-r-1` | 80 | 4.5 | 0.5 | 55 | 3.1 | 900 |
| `drawstring-r-2` | 60 | 4.5 | 0.5 | 55 | 3.1 | 900 |
| `drawstring-r-3` | 50 | 4.5 | 0.5 | 55 | 3.1 | 900 |
| `drawstring-l-1` | 80 | 4.5 | 0.5 | 55 | 3.1 | 900 |
| `drawstring-l-2` | 60 | 4.5 | 0.5 | 55 | 3.1 | 900 |
| `drawstring-l-3` | 50 | 4.5 | 0.5 | 55 | 3.1 | 900 |

## Libraries

| Library | Version | Licence | Where |
|---|---|---|---|
| three.js | 0.187.0 | MIT | `vendor/three/` (three.module.js, three.core.js, OrbitControls.js, LICENSE), compiled into the bundle |
| esbuild | 0.25.12 | MIT | build only: the copy in `deck-engine/node_modules` |
| Playwright | 1.62.1 | Apache-2.0 | tests only: the copy in `deck-engine/node_modules` |

Physics, IK, the mesher, the texture generators and the rig are this folder's own code. No CDN, no network, no image or model file at run time.

## Known limits

1. **Cloth does not move as cloth.** Folds at the elbows and above the hems are modelled in and stay where they are; nothing wrinkles when a limb bends.
2. **Detail is drawn, not modelled.** Ribbing, seams and stitching are shading on a smooth surface: they hold up at any size on screen but do not change the outline.
3. **The eye openings are cut by the drawing.** Their edge has no thickness; seen from a very flat angle the eye layer ends about 1.5 cm beyond the opening.
4. **Extreme bends still fold.** A fully bent elbow, knee or finger creases on the inside; nothing collides, so a limb can be posed through the body, and hair, hood and cords swing through what is near them.
5. **Contact shade is baked with the arms out.** The inner arm and the side of the torso do not darken more when the arms hang down; the live shadow from the key light does that work.
6. **Built at load.** About 9.7 s before the first frame; 185k vertices. Phones were not tried.
7. **IK near a limit** can swing the elbow or knee to the other side, because the search only looks at where the hand or foot ends up.

## Differences from the reference image

Measured with `tests/compare.mjs` at the reference's framing and viewpoint.

1. **Stance.** The reference stands with its weight on one leg (its left leg is 9 degrees out, its right one upright). The model's rest pose is symmetric, 4.8 degrees each, so that walking, balance and foot planting stay as they were.
2. **Hair.** Same dome, crown, tuft and fringe tips, in 16 sculpted clumps. The reference's clumps sweep more to one side and cover more of the forehead and temples, and its highlight is two crisp patches where the model has one soft band.
3. **Light and colour.** Measured tone by tone against the reference (`dark / middle / light` of each material): hoodie, jeans, face, hands, hair and shoes agree within about 5 % in the middle tones. What remains: the reference's hoodie highlights (shoulder tops, belly) are a little yellower and its deepest shade a little redder; its jeans have a brighter blue edge on the lit side and darker shins; its sleeves are slightly darker than its chest, where the model's are equal; the hands keep the earlier skin material.
4. **Cloth.** The reference's hoodie has more and softer folds at the elbows and armpits; its denim shows a little more wear along the seams.
5. **Shoes.** Six crossing laces and one line round the sole against the reference's five rows and two lines; the toe caps are a little rounder.
6. **Collar.** The two sides of the hood meet in a V with a lap seam; in the reference one side visibly lies over the other.
7. **Near-black.** Lashes and pupils are deep navy (#1A1D42, #151A31) where the reference is almost black, because nothing may be black.
8. Proportion: 5.86 heads tall (crown 164.6 cm to chin, tuft not counted); the reference measures 6.0 the same way.
