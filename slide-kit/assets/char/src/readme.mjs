// README.md is generated, so its tables cannot drift from rig.json.
export function readme(rig, stats) {
  const n = v => String(Math.round(v * 10) / 10);
  const jointsOf = {};
  for (const j of rig.joints) for (const t of j.targets) (jointsOf[t.bone] ??= []).push(j.id);
  for (const f of rig.folds) (jointsOf[f.bone] ??= []).push(`${f.flex} x ${f.twist}`);
  const yaw = new Set(rig.yaw.features.map(f => f.bone));
  const springs = rig.physics.springs;
  const boneRows = rig.bones.map(b => {
    const by = [...new Set(jointsOf[b.id] || [])].map(j => '`' + j + '`');
    if (yaw.has(b.id)) by.push('head turn');
    if (springs[b.id]) by.push('spring');
    if (b.id === 'root') by.push('ground contact, balance');
    return `| \`${b.id}\` | ${b.parent ? '`' + b.parent + '`' : '(top)'} | ${n(b.pivot[0])}, ${n(b.pivot[1])} | ${by.join(', ') || 'no joint: follows its parent'} |`;
  });
  const jointRows = rig.joints.map(j => {
    const moves = j.targets.length ? j.targets.map(t => `${t.bone}.${t.ch} x ${t.k}`).join(', ')
      : j.id === 'head-yaw' ? 'head turn (see below)' : j.id.startsWith('elbow') ? 'forearm, through arm rotation' : 'fold side of the elbow';
    return `| \`${j.id}\` | ${j.label} | ${j.min} | ${j.max} | ${j.default} | ${j.unit} | ${moves} |`;
  });
  const groups = ['Head', 'Torso', 'Arms', 'Hands and fingers', 'Legs'];
  const springRows = Object.entries(springs).map(([id, s]) => `| \`${id}\` | \`${s.joint}\` | ${s.stiffness} | ${s.damping} | ${s.mass} | ${s.limit} | ${s.gravity || 0} |`);

  return `# \`char/\` — a rigged 2D character with soft 3D shading

One front-facing character as an inline SVG, plus a small runtime that poses it:
joint limits, inverse kinematics for hands and feet, spring physics, breathing,
blinking, balance and ground contact. No black outlines and no third-party code at run time.

| File | What it is |
|---|---|
| \`character.svg\` | the art: ${stats.bones} rig groups, ${stats.shapes} shapes, ${stats.kb} KB, every colour a CSS variable |
| \`rig.json\` | ${stats.joints} joints with limits, couplings, 4 IK chains, ${stats.springs} springs, presets |
| \`rig.js\` | the runtime (${stats.rigKb} KB, no dependencies). \`new CharRig.Rig(svg, rigJson)\` |
| \`preview.html\` | a slider for every joint, presets, animations, IK handles, switches |
| \`char.bundle.js\` | generated copy of the SVG and the rig data, so the preview also opens from disk |
| \`src/\` | the generator: \`node src/build.mjs\` writes \`character.svg\`, \`rig.json\`, \`char.bundle.js\` and this README |
| \`tests/acceptance.mjs\` | the eight acceptance checks |

## Run the preview

\`\`\`bash
cd slide-kit/assets/char
python3 -m http.server 8791 --bind 127.0.0.1     # then open http://127.0.0.1:8791/preview.html
\`\`\`

Opening \`preview.html\` by double-click also works. Most browsers refuse to let a page read
\`character.svg\` and \`rig.json\` from disk; when that happens the page uses \`char.bundle.js\`,
which holds the same two files. Nothing is fetched from the network in either case.

After changing anything under \`src/\`, run \`node src/build.mjs\` (Node 20.11 or newer).
To run the checks: \`node tests/acceptance.mjs\` with the folder served as above.

## Using the rig

\`\`\`html
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
\`\`\`

- The canvas is \`viewBox="0 0 1086 1448"\`, the same framing as the reference image. Every pivot is in those units, in the rest pose.
- **R** is the character's right, which is the left of the screen.
- A joint value is anatomical and means the same on both sides: \`shoulder-r: -90\` and \`shoulder-l: -90\` both raise the arm sideways. The \`k\` on each target in \`rig.json\` turns it into a screen rotation (positive is clockwise).
- Recolour by overriding the CSS variables on \`#character\` (${stats.vars} of them, listed at the top of \`character.svg\`).
- Without \`rig.js\` the file is still a normal rigged SVG: each group has \`data-pivot\` and \`transform-origin\`, so CSS, the Web Animations API or Framer Motion can rotate it. Limits, IK and physics exist only in \`rig.js\`.

## What the runtime does each frame

1. **Animation** (wave, walk in place) and **sliders** give each joint a base value.
2. **IK** chains with a target solve their two bones (analytic two-bone solve, then a short search inside the limits when a limit blocks the exact answer). A target that cannot be reached is pulled back to where the limb stopped.
3. **Procedural layers**, when Physics is on: breathing, blink with small eye movements, and the lean from balance.
4. **Limits**: every joint is clamped to \`min\` and \`max\` here, whatever asked for the value.
5. **Couplings**: the clavicle lifts as the arm rises past ${rig.scapula[0].start} degrees (scapula shift, ${rig.scapula[0].ratio} of the extra angle); the elbow folds in or out according to arm rotation; the head turn moves the face features.
6. **Ground and balance**: the centre of mass is compared with the feet carrying weight, the pelvis shifts over them, and legs standing on the ground are re-solved so the feet stay exactly where they were and stay level.
7. **Springs**: each sprung bone is a mass on the end of the bone, pulled towards where a rigid bone would be. Heavier parts lag longer.

Physics switch off: steps 3, 6 and 7 stop and the figure is static. The Breathing switch only matters while Physics is on.

### Legs, with Physics on

A leg whose hip and knee sliders are at their defaults is **standing**: it is solved to keep its foot planted, so moving the pelvis, spine or arms bends the knees instead of sliding the feet. Move a hip or knee slider and that leg becomes **free** and follows the sliders. With every leg free, the whole figure is raised or lowered so the lowest sole rests on the ground.

## Joints and limits

Limits live in \`rig.json\` and are enforced by \`rig.js\`. Units are degrees unless the unit column says otherwise.

${groups.map(g => `### ${g}\n\n| Joint | Label | Min | Max | Default | Unit | Moves (bone.channel x k) |\n|---|---|---|---|---|---|---|\n${jointRows.filter((r, i) => rig.joints[i].group === g).join('\n')}`).join('\n\n')}

Notes on the limits:

- **\`head-yaw\`** runs the full -70 to 70, but the picture turns by ${rig.yaw.gain} of that (about 42 degrees). It is a parallax effect on a front drawing: eyes, brows, nose, mouth, cheeks and fringe slide and narrow, the near ear widens, the far ear hides. There is no profile to turn to.
- **\`elbow\`** is a hinge, 0 to 145. \`arm-rotation\` (0 = folds towards the body, 180 = folds outward and up) picks the side it folds to, as turning the upper arm does on a real shoulder. At 90 the forearm would point at the viewer; the rig has no foreshortening, so the forearm stays straight there.
- **\`knee\`** folds towards the body's centre line only, 0 to 140.
- Eyelids are percentages of closure, gaze and brow raise are canvas units.

## Bones (rig groups), parents and pivots

Every \`<g>\` with \`data-pivot\` in \`character.svg\`. The hierarchy follows the skeleton: rotating a parent carries its children.

| Bone id | Parent | Pivot (x, y) | Driven by |
|---|---|---|---|
${boneRows.join('\n')}

Ids changed from the first version of this folder: \`waist\`, \`chest\` are now \`spine-1\`, \`spine-2\`, \`spine-3\`; \`shoulder-*\` is \`clavicle-*\`; \`finger-<name>-1/2/3-*\` is \`finger-<name>-prox/mid/dist-*\`; \`thumb-1/2-*\` is \`thumb-meta/prox/dist-*\`; \`eyebrow-*\` is \`brow-*\` with \`brow-inner-*\` and \`brow-outer-*\`; \`eyelid-*\` is \`eyelid-upper-*\` and \`eyelid-lower-*\`; \`pupil-*\` now sits inside \`iris-*\`.

## Physics values

Per part, in \`rig.json\` under \`physics.springs\`. Stiffness pulls the part back, damping stops the swing, mass sets how long it lags, limit is the most it may swing either way (degrees), gravity pulls it to hang straight down.

| Bone | Joint | Stiffness | Damping | Mass | Limit | Gravity |
|---|---|---|---|---|---|---|
${springRows.join('\n')}

Also in \`physics\`: \`breathing\` (period ${rig.physics.breathing.period} s, chest lift ${rig.physics.breathing.chestLift} units), \`blink\`, \`saccade\`, \`balance\` (gain ${rig.physics.balance.gain}, at most ${rig.physics.balance.max} units of pelvis shift) and \`ground\`.

## How the look is built

- **No outlines.** No shape has a dark stroke. Edges come from fill and gradient only; where two parts of one colour meet, the edge is a darker tone of the same hue. The only strokes are thin details in palette colours: seams, stitches, ribs, laces, the lip line and the eyelid lines.
- **Light from the upper right**, as in the reference: left flank and inner sides in shade, a warm rim on right-facing edges.
- **Each limb segment** is filled across its width by one profile (lighter down the middle), and the **ball at each joint** uses the same profile radially. The ball sits under both segments and only shows in the wedge that opens when the joint bends, so a bend has no gap and no seam at any angle.
- **Soft shading** (under the chin, inside the hood, under the hem, folds, blush, highlights) is ellipses and strips whose gradient fades to nothing. There are no SVG filters, which is what keeps the preview at 60 frames per second.
- **Garment edges** are real overlaps: hand under cuff, shoe under trouser hem, neck under hood, hoodie hem over jeans.

## Libraries

**None at run time.** \`rig.js\` is the only script and has no dependencies; there is no \`vendor/\` folder because nothing is vendored.

| Used for | Library | Version | Licence |
|---|---|---|---|
| running \`tests/acceptance.mjs\` only | Playwright (the copy already installed in \`deck-engine/\`) | 1.62.1 | Apache-2.0 |

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
| anime.js, Motion | 4.5.0, 14.12.0 | MIT | only tweening; the two animations are short functions in \`rig.js\` |

## Known limits

1. **It is a drawing, not a render.** Shading is baked for the rest pose and travels with each part: a raised arm keeps the light it had hanging down, and limbs do not cast shadows on each other.
2. **Everything moves in the plane of the screen.** Fingers curl sideways towards the body, a knee lifts to the side, nothing reaches towards the viewer. Walk in place is therefore a side knee lift.
3. **Head turn is a parallax effect** up to about 42 visual degrees; see the note under the limits.
4. **Springs do not collide.** Hair can swing over the face and a drawstring can pass through an arm.
5. **The arms always draw in front of the torso and the legs behind the hoodie.** An arm cannot pass behind the body.
6. **Standing legs override their sliders' effect on the foot.** With Physics on, the ankle slider does nothing on a standing leg, because the foot is kept level.
7. **IK on an arm chooses the fold side itself**, so \`arm-rotation\` jumps between 0 and 180 while dragging.
8. **Frame rate was measured headless** (60 fps, 0.05 ms of script per frame). The page has about ${stats.shapes} gradient-filled shapes and no filters; a slow integrated GPU at a very large window size has not been tried.

## Differences from the reference image

Built on the reference's own frame and palette, so position, proportion and colour are close; the picture is not identical. Seen side by side:

1. Vector gradients against a 3D render: no fabric texture on the fleece, denim or canvas, no light bleeding through the ears, simpler contact shadows.
2. The stance is symmetric (each leg 4.8 degrees out). The reference stands with its weight on one leg (0.6 and 9.1 degrees).
3. Lashes and pupils are deep navy, not the near-black of the reference, because nothing in the file may be black.
4. Hair is five fringe clumps, two side locks, two back clumps and the top tuft. The reference has more and finer locks, a softer gloss and a few loose strands.
5. The shoulders read rounder than the reference's set-in sleeves, and the hood lies flatter.
6. The hand shows the back of the hand with fingers side by side; the reference hand is a three-quarter view with foreshortened fingers.
7. Nose, mouth and ears are simpler shapes; the shoes have four lace rows, not five.
8. Proportion: ${stats.heads} heads tall against the reference's 5.82.
`;
}
