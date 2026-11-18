// README.md is generated, so its tables cannot drift from the rig data and the skeleton.
export function readme(rig, specs, stats) {
  const n = v => String(Math.round(v * 10) / 10);
  const groups = ['Head', 'Torso', 'Arms', 'Hands and fingers', 'Legs'];
  const jointRow = j => `| \`${j.id}\` | ${j.label} | ${j.min} | ${j.max} | ${j.default} | ${j.unit} | ${j.face ? 'face drawing' : `${j.bone}, axis ${j.axis}${j.bind ? `, built at ${j.bind}` : ''}`} |`;
  const byBone = {};
  for (const j of rig.joints) if (j.bone) (byBone[j.bone] ??= []).push(j.id);
  const helperNote = n => (/-h[123]$/.test(n) ? `helper: takes ${n.slice(-1) * 25} % of the bend of the bone beside it` : /-t\d$/.test(n) ? `twist bone: takes ${Math.round(+n.slice(-1) / (n.startsWith('thigh') ? 3 : 4) * 100)} % of the limb's twist` : null);
  const boneRows = specs.map(s => {
    const by = (byBone[s.name] || []).map(j => '`' + j + '`');
    if (rig.physics.springs[s.name]) by.push('spring');
    if (helperNote(s.name)) by.push(helperNote(s.name));
    if (s.name === 'root') by.push('ground contact, balance');
    return `| \`${s.name}\` | ${s.parent ? '`' + s.parent + '`' : '(top)'} | ${s.pos.map(n).join(', ')} | ${by.join(', ') || 'follows its parent'} |`;
  });
  const springRows = Object.entries(rig.physics.springs).map(([id, s]) => `| \`${id}\` | ${s.stiffness} | ${s.damping} | ${s.mass} | ${s.limit} | ${s.length} | ${s.gravity} |`);

  return `# \`char3d/\` — the character as a true 3D model

The mustard-hoodie character as a real 3D model you can turn, pose and animate in the browser.
Every garment is one continuous skinned surface, so shoulders, elbows, knees and fingers bend
without a seam. Shapes, sizes and colours are measured on the reference picture
(\`assets/illustrations/Mustard Hoodie Boy in 3D Style.png\`, 1 px = 0.1222 cm); nothing is traced
or copied from it. The 2D version in \`../char/\` is untouched.

| File | What it is |
|---|---|
| \`preview.html\` | the viewer: orbit with the mouse, a slider for every joint, presets, animations, IK handles |
| \`char3d.bundle.js\` | everything the viewer needs in one script (${stats.bundleKb} KB): three.js, the model code and the rig. Generated |
| \`rig.json\` | ${rig.joints.length} joints with limits, couplings, 4 IK chains, ${Object.keys(rig.physics.springs).length} springs, hand presets. Generated |
| \`src/\` | the sources. \`node src/build.mjs\` writes the three files above and this README |
| \`vendor/three/\` | three.js ${stats.three}, MIT, vendored |
| \`tests/acceptance.mjs\` | the eight acceptance checks |
| \`tests/compare.mjs\` | renders the model at the reference's framing, writes side-by-side pictures (full body, face, wave at its peak) and measures limb thickness through the wave |

## Run the preview

\`\`\`bash
cd slide-kit/assets/char3d
python3 -m http.server 8792 --bind 127.0.0.1     # then open http://127.0.0.1:8792/preview.html
\`\`\`

Double-clicking \`preview.html\` works too: the page is one classic script, and when the browser
will not read \`rig.json\` from disk it uses the copy inside the bundle. Nothing comes from the network.

- **Drag** to orbit, **scroll** to zoom, **right-drag** to pan. The buttons at the bottom left jump to front, three-quarter, side, back, face and hand.
- After changing anything under \`src/\`, run \`node src/build.mjs\` (Node 20.11 or newer; it uses the esbuild already installed in \`deck-engine/\`).
- To run the checks: \`node tests/acceptance.mjs\` with the folder served as above.
- To compare with the reference: \`node tests/compare.mjs out/\` writes \`compare-full.png\`, \`compare-face.png\`, \`compare-wave.png\` and \`thickness.json\`.

## The three characters

One bundle holds three characters on the same skeleton and the same \`rig.json\`. Pick one with the
**Character** menu at the top of the panel, with \`?c=\` in the address (\`preview.html?c=sporty\`), or by
setting \`window.CHAR3D_CAST\` before the script loads. Each is built when the page opens (about 10 to 12 s).

| \`c=\` | Character | Reference (a style guide only: sizes and colours measured, nothing traced) |
|---|---|---|
| \`mustard\` | the mustard-hoodie boy, the first character | \`assets/illustrations/Mustard Hoodie Boy in 3D Style.png\` |
| \`sporty\` | colour-block puffer jacket over a cream hoodie, olive cargo joggers, white court sneakers, watch | \`Sporty 3D Boy Character Render.png\` (this folder) |
| \`varsity\` | maroon varsity jacket with a "B" patch, the cream hoodie's hood over it, baggy blue cargo jeans, maroon high-tops, watch | \`Stylized Boy with Side-Swept Hair.png\` (this folder) |

**What they share:** the skeleton, every joint and limit, the IK chains and the physics (\`rig.json\` is one
file), the hands, the light, and the way every surface is made (blended shapes, one closed skinned mesh per
material, generated PBR sets, tinted baked shade, cartoon face and hair).

**What each has of his own:** a head shape (the front outline measured row by row on his picture; the side
profile is the first character's, slid to his chin, eyes and crown), a face drawing (eyes, brows, nose, mouth,
blush, brown irises), a hairstyle (sculpted clumps on a dome of his own size), skin, hair and eye colours, and
the clothes. The varsity boy's neck and face are longer: his head sits 2.7 cm higher on the same skeleton.

| Sources | What is in them |
|---|---|
| \`src/cast.js\` | the list: palettes, face measurements, head outlines, shade tones |
| \`src/hair2.js\` | the new heads and both hairstyles |
| \`src/face2.js\` | the new face drawings |
| \`src/outfits.js\` | both outfits, the watch, the snaps |

The new clothes add two things the first character never needed. **Colour blocks** (the puffer's navy, cream
and orange panels, the varsity stripes and patch, the shoe panels) are drawn per pixel from each vertex's
distance to the edge between two colours, so an edge is crisp and straight whatever the mesh size. **Dark cloth
keeps its hue** in deep shade (a floor of its own colour on the bounce light), so the navy and the maroon never
turn grey: no black and no dark grey anywhere, as for the first character. Both are added to a shader only when
the material asks for them.

**The first character is unchanged.** Every code path above branches on the character; his mesh data
(positions, normals, colours, shade, weights, seams of all nine meshes), his bones, \`rig.json\` and his shader
source are identical to the approved version, checked by fingerprint.

To compare a new character with his picture: \`CAST=sporty node tests/compare.mjs out/\`. To run the checks on
him: \`URL='http://127.0.0.1:8792/preview.html?c=sporty' node tests/acceptance.mjs\`. All eight pass for each.

## How the model is made

There is no modelling file and no image file. The character is described in code and built when the page loads (about ${stats.buildS} s).

1. **Shapes.** Each part is a set of solids with a distance function (\`src/sdf.js\`, \`src/body.js\`, \`src/headmodel.js\`), joined with a *smooth union*, so a sleeve grows out of the torso instead of meeting it at a seam. ${stats.prims} shapes in all. Besides spheres, tapered capsules, ellipsoids and rounded boxes there are:
   - **lofted solids** for the head, torso, seat and shoes: a front outline and a side profile against height, with a cross-section that can be round or nearly square. The head's outline is the reference's, row by row: 17.4 cm across the cheeks, a small chin, broad and almost flat across the eyes.
   - **the hair**: ${stats.locks} sculpted clumps lying on a rounded dome, the way a cartoon figure's hair is modelled: five across the forehead, a temple and a side clump over each ear, five round the back, and the tuft on the crown. Each runs from the crown through its widest point to a pointed tip; they are thick, full and smooth and overlap like roof tiles. No strands, fibres or hair cards.
   - **the collar**: a funnel of thick cloth round the neck, open in a V, that dives under the body's surface along the neckline.
   - **the pocket and toe caps**: patches of even thickness on the curved surface under them.
2. **Mesh.** The blended field is sampled on a grid and turned into triangles by surface nets. ${stats.meshes} meshes, ${stats.verts.toLocaleString('en')} vertices, ${stats.tris.toLocaleString('en')} triangles, every mesh closed (no open edges), so a bend cannot open a gap.
3. **Skin weights** come from the shapes: a vertex follows the bones of the shapes it belongs to. Along an arm or a leg the weight slides from bone to bone through **helper bones**, so no two neighbouring bones differ by a large angle: three bend helpers at each shoulder, elbow, hip and knee (25, 50, 75 % of the bend) and four twist bones along each upper arm and forearm, three along each thigh. That is what keeps a sleeve the same thickness when the arm is raised and turned (see *Thickness in the wave* below).
4. **Surfaces** (\`src/textures.js\`, \`src/material.js\`). Each material has a PBR texture set generated in code from one height field: **albedo**, **normal**, **roughness** and **ambient occlusion**.
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
6. **Face** (\`src/face.js\`, \`src/eyes.js\`): three layers. The **face drawing** (skin, blush, brows, lash band with its wing, lid crease, lower lashes, nose shade, mouth) is projected onto the head, and the eye openings are *holes* in it. 4 mm behind the skin lies the **eye layer**: the white with the lid's shade on it, the iris (dark at the top, bright at the bottom, a dark rim, fine fibres) and the pupil, with a bowl 5 mm deep under the iris, so the pupil sits a centimetre behind the lids and shifts against them as the view turns. 1 mm behind the skin floats the **glint layer** with the two highlights. A blink is the upper lid's edge moving down to the lower one, lash band and all.
7. **Light**, set to the reference's. A strong key from high on the right front whose shadows are soft and take away only about half the light; a low warm fill from the front left; a rim from behind; a sky light with little coming up from below, so undersides fall away; soft contact shadows under the feet. Shade is warm and saturated (cloth lit by its own bounce), highlights lean yellow-white (a soft sheen on fleece and denim). The face has three tones: lit #F7BC95, brightest #FDCDA9 where the key strikes it, shade #D38C6C; the hair's shade is #20233F. No tone curve: the palette is the reference's own colours.

Units are centimetres. The ground is y = 0, the crown of the head is at ${stats.height} cm (the tuft reaches 169) and the character faces +z; its left is +x.

## Thickness in the wave

\`tests/compare.mjs\` cuts the raised arm into slices in the idle pose and measures the same vertices on every frame of two full swings of the wave (150 frames). Thickness as a share of the idle pose:

| Part | Before this revision | Now |
|---|---|---|
| upper arm, thinnest slice | 0.70 (at the shoulder) | 0.99 |
| forearm, thinnest slice | 0.91 (at the elbow) | 1.00 |
| wrist, palm, fingers, thumb | 0.99 | 0.98 to 1.02 |

The cause was the arm's twist: 82 to 92 degrees of it reached the mesh in one step at the shoulder, and linear skinning shrinks whatever lies between two bones that far apart. The twist is now spread over five bones along the upper arm and the bend over four at each joint. The animation itself (joint values, timing) is unchanged.

## Using the rig

\`\`\`js
// inside the bundle: window.rig is the Rig, window.app holds the three.js scene
rig.set('elbow-r', 90);                       // clamped to the limit, returns what was stored
rig.hand('fist', ['r']);                      // fist | open | relaxed
rig.setIK('hand-l', true); rig.moveIK('hand-l', 40, 150, 30);   // centimetres
rig.play('wave');                             // wave | walk; rig.stop() ends it
rig.once('parkour');                          // parkour | rap: plays once and returns to idle; refused (false) while one plays (src/clips.js)
rig.physics = true; rig.breathing = true;
\`\`\`

- A joint turns one bone about one of its local axes: **x** is the hinge, **y** runs along the bone, **z** is the third. The value is anatomical and the same on both sides.
- **R** is the character's right.
- Each frame: animation and sliders, breathing and blink, **limits**, forward kinematics, ground contact and balance, arm IK, helper bones, springs, then the face drawing.
- **Ground and balance** (Physics on): the centre of mass is compared with the feet carrying weight and the pelvis shifts over them. A leg whose hip and knee sliders are at their defaults is *standing*: it is re-solved so its foot stays planted and flat. Move a hip or knee slider and that leg is free.
- **IK** is a two-bone solve with a pole direction for the elbow or knee, then a short search inside the limits when a limit blocks the exact answer. A target that cannot be reached is pulled back to where the limb stopped.

## Joints and limits

Limits live in \`rig.json\` and are enforced by the runtime. Degrees unless the unit says otherwise.

${groups.map(g => `### ${g}\n\n| Joint | Label | Min | Max | Default | Unit | Turns |\n|---|---|---|---|---|---|---|\n${rig.joints.filter(j => j.group === g).map(jointRow).join('\n')}`).join('\n\n')}

Notes:

- **Head turn** is real now: \`neck-1-turn\` (20) + \`neck-2-turn\` (20) + \`head-turn\` (30) = 70 degrees each way.
- **Shoulder** has three joints: raise sideways (10 to 180), raise forward (-60 to 180) and twist. Below 10 degrees sideways the sleeve would pass into the torso, so the limit stops there.
- **Elbow** 0 to 145, **knee** 0 to 140, **fingers** 0 to 90 / 100 / 80, **wrist** -70 to 80, **ankle** -40 to 50, as asked.
- The clavicle lifts by itself as the arm rises past ${rig.scapula[0].start} degrees (scapula shift).
- **Rest pose of the hands**: the forearm rests turned 35 degrees so the back of the hand faces forward, and the fingers curl a little more, as in the reference. The wave sets these joints itself and is unchanged.

## Bones

${specs.length} bones (${specs.filter(q => /-h[123]$|-t\d$/.test(q.name)).length} of them helpers the runtime drives by itself). Positions are where the bone starts in the build pose (arms 50 degrees out from the body).

| Bone | Parent | Position (x, y, z) cm | Driven by |
|---|---|---|---|
${boneRows.join('\n')}

## Physics values

Each sprung bone is a mass on the end of the bone, pulled back to where a rigid bone would be. In \`rig.json\` under \`physics.springs\`.

| Bone | Stiffness | Damping | Mass | Limit (deg) | Length (cm) | Gravity |
|---|---|---|---|---|---|---|
${springRows.join('\n')}

## Libraries

| Library | Version | Licence | Where |
|---|---|---|---|
| three.js | ${stats.three} | MIT | \`vendor/three/\` (three.module.js, three.core.js, OrbitControls.js, LICENSE), compiled into the bundle |
| esbuild | ${stats.esbuild} | MIT | build only: the copy in \`deck-engine/node_modules\` |
| Playwright | ${stats.playwright} | Apache-2.0 | tests only: the copy in \`deck-engine/node_modules\` |

Physics, IK, the mesher, the texture generators and the rig are this folder's own code. No CDN, no network, no image or model file at run time.

## Known limits

1. **Cloth does not move as cloth.** Folds at the elbows and above the hems are modelled in and stay where they are; nothing wrinkles when a limb bends.
2. **Detail is drawn, not modelled.** Ribbing, seams and stitching are shading on a smooth surface: they hold up at any size on screen but do not change the outline.
3. **The eye openings are cut by the drawing.** Their edge has no thickness; seen from a very flat angle the eye layer ends about 1.5 cm beyond the opening.
4. **Extreme bends still fold.** A fully bent elbow, knee or finger creases on the inside; nothing collides, so a limb can be posed through the body, and hair, hood and cords swing through what is near them.
5. **Contact shade is baked with the arms out.** The inner arm and the side of the torso do not darken more when the arms hang down; the live shadow from the key light does that work.
6. **Built at load.** About ${stats.buildS} s before the first frame; ${Math.round(stats.verts / 1000)}k vertices. Phones were not tried.
7. **IK near a limit** can swing the elbow or knee to the other side, because the search only looks at where the hand or foot ends up.

## Differences from the reference image

Measured with \`tests/compare.mjs\` at the reference's framing and viewpoint.

1. **Stance.** The reference stands with its weight on one leg (its left leg is 9 degrees out, its right one upright). The model's rest pose is symmetric, 4.8 degrees each, so that walking, balance and foot planting stay as they were.
2. **Hair.** Same dome, crown, tuft and fringe tips, in ${stats.locks} sculpted clumps. The reference's clumps sweep more to one side and cover more of the forehead and temples, and its highlight is two crisp patches where the model has one soft band.
3. **Light and colour.** Measured tone by tone against the reference (\`dark / middle / light\` of each material): hoodie, jeans, face, hands, hair and shoes agree within about 5 % in the middle tones. What remains: the reference's hoodie highlights (shoulder tops, belly) are a little yellower and its deepest shade a little redder; its jeans have a brighter blue edge on the lit side and darker shins; its sleeves are slightly darker than its chest, where the model's are equal; the hands keep the earlier skin material.
4. **Cloth.** The reference's hoodie has more and softer folds at the elbows and armpits; its denim shows a little more wear along the seams.
5. **Shoes.** Six crossing laces and one line round the sole against the reference's five rows and two lines; the toe caps are a little rounder.
6. **Collar.** The two sides of the hood meet in a V with a lap seam; in the reference one side visibly lies over the other.
7. **Near-black.** Lashes and pupils are deep navy (#1A1D42, #151A31) where the reference is almost black, because nothing may be black.
8. Proportion: ${stats.heads} heads tall (crown ${stats.height} cm to chin, tuft not counted); the reference measures 6.0 the same way.
`;
}
