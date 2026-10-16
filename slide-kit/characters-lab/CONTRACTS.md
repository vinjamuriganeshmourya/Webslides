# Characters lab: contracts

Two characters, **Arjun** (male) and **Riya** (female), on one shared rig, with a
library of actions that read as real human motion. Used two ways:

1. **On a slide**: `<Actor skin="riya" expression="happy" gesture="wave" say="Hi there" />`
   inside a React deck. Runs on its own clock.
2. **In a reel**: `node record.mjs --skin arjun --script script.json --out out/arjun.mp4`
   renders frame by frame at a fixed timestep, so output is deterministic.

Everything below is a contract. Modules are built in parallel against it; do not
change a signature without changing this file.

## Files

```
src/rig/channels.ts     DONE  the numeric channels every layer writes to
src/rig/track.ts        DONE  Key, Tracks, Action, easing, sampleAction, retime, mirror, both
src/skins/types.ts      DONE  Skin, Palette
src/rig/Hand.tsx              procedural hand from finger curls (A)
src/rig/Character.tsx         SVG renderer: Pose + Skin -> picture (B)
src/skins/hair.tsx            hair style catalogue (C1)
src/skins/config.ts           CharacterConfig, PRESETS, buildSkin, tone/hair palettes (C2)
src/skins/outfits.tsx         tops, bottoms, accessories (C2)
src/skins/index.ts            (C2)  re-exports config + types
src/rig/compose.ts            layers -> Pose at time t (D)
src/rig/idle.ts               autonomic layer: breath, blink, saccade, sway (D)
src/rig/useCharacter.ts       runtime clock + playback state (D)
src/rig/Actor.tsx             declarative wrapper for decks (D)
src/actions/face.ts           expressions and face one-shots (E)
src/actions/head.ts           nod, shake, tilt, turns (E)
src/actions/hands.ts          wave, point, thumbs up, clap, shrug, ... (E)
src/actions/body.ts           bounce, lean, bow, celebrate ... (E)
src/actions/index.ts          (E) export const ACTIONS: Record<string, Action>, EXPRESSIONS
src/actions/talk.ts           text -> viseme Action, with head/brow emphasis (F)
src/App.tsx, src/main.tsx, src/index.css   playground (G)
shoot.mjs                     contact sheets per action, for review (G)
record.mjs                    frame-exact video export (G)
```

## Art direction: the Library look (2026-10-15, supersedes everything below where they differ)

The user handed over a second, larger set of references: seventy-one PNGs in
`reference/library/`, copied from the Library folder, every one a soft 3D
render of a person in one house style. The characters must look like them.
Open the folder before drawing anything. What is in them, read off the
pixels, is the spec below; `shading: 'clay'` in `CharacterConfig` is the
look, and every preset uses it. The flat Storyset look of the first two
references (`reference/arjun.png`, `reference/riya.png`) stays available as
`shading: 'flat'` and `art: 'line'`, described in the next section, but no
preset uses it any more.

**Rendering.** No outline anywhere. Every form turns by its own shading: a
soft band along the edge away from the lamp, a lighter band toward it, a
few px wide, never a hard crescent. The lamp is upper left and in front.
Skin is matte; hair is glossy, with one broad highlight band where a clump
faces the lamp. Shadows deepen a colour in its own hue (peach skin shades to
orange `#E68A57`, blue cloth to a deeper blue), never to grey. Soft contact
shadows where one form sits on another: hair on the forehead, an arm on the
chest. The figure is cut out on white with no ground shadow (the rig keeps
its contact shadow for the slide; that is a deck decision, not a Library
one). In the rig this is `ClayDefs` in `src/rig/lighting.tsx`: one
alpha-rim filter per scale of form (head, body, limb, hair), multiply for
the shade and screen for the light, so a flat palette fill underneath
stays the palette colour.

**Face.** Wide and rounded with full cheeks and a small rounded chin; a tall
forehead under the hair. Eyes are the biggest single feature: upright ovals
about a fifth of the face width (Wondering man: 21 px on a 110 px face),
with white showing at the sides, a warm brown iris `#5A3420` filling about
three quarters, a black pupil, one large catchlight upper left and a small
one lower right (the same side on both eyes), a heavy dark upper lid
`#24181A` that runs a little past the outer corner, and a faint lower lid
crease in the skin shade. Every woman has two lash flicks at the outer
corner; no man does. Brows are thick, dark, soft-edged wedges: thin at the
inner end, thickest two thirds out, a short tail; a man's are straighter
and heavier, a woman's more arched. They sit close above the eye, a gap of
about 8 px on that face. The nose is a small rounded button with no line:
a bump in the skin colour with a soft shadow below and beside it. Shut,
the mouth is a short warm brown-rose smile line (the skin shade darkened,
never red). Open, it is a wide D with a row of upper teeth, a deep wine
interior `#8E2B2E` and a coral tongue; no drawn lower lip. Cheeks carry a
soft orange-pink glow, low and wide, with no edge. Ears are small and
rounded, their top third usually under the hair.

**Proportions.** Five to six heads tall in the full-length images (Man
Explaining, Woman Pointing-1), with a big head, a short neck, rounded
sloping shoulders, thick tubular arms with no elbow line, big hands with
rounded fingers and no outlines, straight tubular legs. The half-length
crops, which are most of the folder, stop at the waist or mid-thigh.

**Colour.** Skin is one warm peach family, three steps: `#FBC499` (man
wondering expression), `#F9AE7C` (Wondering man, the most common),
`#F4A077` (Bearded Man Presenting). The Library has no darker tone, so the
presets use none; the rig's five named tones remain for a config that asks.
Hair: black `#2A2324`, navy-black `#262B43`, dark brown `#532921`,
brown-black `#483032`, and one light brown. Clothes are flat saturated
blocks: the teacher's lavender-white shirt `#D5D8EB`, cobalt `#0055E8`, sky
`#95C2FB`, periwinkle `#5856DC`, yellow `#FCC82B`, orange `#FC963C`, red
`#D8352F`, sage `#829983`; trousers navy `#2C3C81` or charcoal `#3E3D45`;
a black belt `#2A2A30` with a grey buckle; white sneakers, dark flats.

**Hair.** Sculpted, not painted: a few big smooth clumps, each a rounded
ridge with a groove between it and the next, all swept one way, glossy on
the ridges. Men: the pompadour (swept up from the left temple and back over
to a rounded peak, as tall above the brows as the face is below them, ears
showing, short sideburn: the white-shirt teacher, drawn fourteen times), a
side part swept across in a wave, short brushed up and back, big curls.
Women: long waves falling past the shoulders, a top-knot bun with a
scrunchie, a chin-length bob, a lob with a side part. `src/skins/hair.tsx`
has a clay drawing for quiff, bun, curly, short and sidePart; the other
styles fall back to the flat drawing under the clay filter.

**Clothing.** Collared shirts tucked in with a belt, crew-neck sweaters and
tees, blazers over tees, blouses with a white collar, jeans, trousers, an
A-line skirt, sneakers, flats. Suits with ties appear only on the
businessman images; the teacher never wears a tie.

**Poses and framing.** Frontal or three-quarter, the head often turned a
little toward the thing being pointed at. Pointing, presenting with an open
palm, hand on chin, finger raised with an idea, waving, hands up, holding a
laptop, tablet, book or pointer, typing at a desk, sitting cross-legged
with a laptop. The rig covers the gestures; props are figure work for a
deck, not part of a character.

**What the rig does not match, on purpose or because it cannot.** The
references are raytraced renders; the rig approximates the turn of a form
with one blurred-alpha rim per group, so a highlight never bends round a
clump the way a render's does. The rig draws a frontal head with a 2.5D
turn; the Library's true three-quarter view, with the far eye narrowed and
the nose bridge in profile, is not reachable. Hands are the rig's own
(section below) with the clay turn added; the Library's chunkier fingers
with a pad at each tip are not redrawn. The ground shadow stays.

**The presets.** Seven, in `src/skins/config.ts`, every colour read off a
named Library image: Arjun (the teacher), Riya (the teacher with the bun,
after Female Teacher Icon), and five new ones, Kabir, Meera, Dev, Ananya,
Rohan, each a different mix of a Library hair, outfit and colour, none a
copy of a single image.

## The earlier flat look (kept as shading 'flat' and art 'line')

The user handed over two reference images; the characters must look like
them. `reference/arjun.png` and `reference/riya.png` (480 x 463 each). Open
them with the Read tool before drawing anything. They are flat vector
illustrations, the Storyset/Freepik corporate style, not the lit 3D look of
the earlier draft. What is in them, read off the pixels:

**Arjun** (`art: 'soft'`): no outlines anywhere; flat fills with soft shadow
shapes a shade darker; one gentle vertical gradient on the shirt. Peach skin
`#F8C9A8`, shade `#E9A98A`, two round rosy cheeks `#F0A08A` low on the
face. Face a rounded square with a soft jaw; a small ear with one inner
curve. Hair solid near-black `#151515` with a `#2E2E2E` sheen: a big quiff
that sweeps from the forehead up and back, ending in two or three soft
points at the top back, short over the ear with a sideburn in front of it;
the hairline on the forehead is a shallow curve. Eyes: two small dark brown
`#3A2A1E` vertical ovals (about 7 x 10 in head space) with a tiny white
catchlight; thin dark brow arcs above, friendly, not angled. Nose: a short
bent stroke, not a filled shape. Mouth: a wide open laugh, a D on its side
with a straight top edge, white upper teeth across the top, a warm red
`#C9484B` interior, a pinker lower lip. The shirt is white `#FFFFFF` at the
collar grading to `#DCE9F8` at the hem and sleeves, long sleeves with cuffs,
a pointed collar; a long navy tie `#1E2B4F` with a knot and a darker
`#162140` stripe down one edge; a brown belt `#8B5A2B` with a `#C9A24A`
buckle; navy trousers `#1B2238`; dark shoes `#2A2F45`. Hands are big and
chunky: rounded fingers, no outlines, a slightly darker line only where two
fingers meet.

**Riya** (`art: 'line'`): flat fills with thin dark outlines `#1A1F3D`
(1.3 px in the 400-wide viewBox) on the hands and their finger lines, on the
collar and on the skirt pockets; nothing else is outlined. Salmon skin
`#F5A68E`, shade `#E08E75`, a faint pink cheek `#F08A7A`. Face an oval with
a slightly pointed chin, a small ear with one inner line. Hair navy-black
`#1A1F3D`: a high bun on top (towards the back) held by a periwinkle band
`#5B6EE1`, the rest falling behind the shoulders to the waist in one smooth
wave (hairBack), a few strands framing the face in front of the ear. Eyes:
tiny dark almond dots with a short lash line, thin arched brows. Nose: a
small hooked line. Mouth: a small smile line that opens into a small dark
shape when she talks (mouthStyle 'line'). Blouse periwinkle `#5B6EE1`, shade
`#4A5BCF`, short sleeves with a straight hem, a white `#FFFFFF` pointed
collar outlined in the line colour. Skirt navy `#171A3B`, A-line from the
waist to below the knee, with two curved pocket stitch lines in a lighter
`#8A8FB8`. Calves salmon below the skirt, simple dark flats.

Both: no feSpecularLighting, no cast-shadow filters, no rim light (that is
`shading: 'flat'`, the default; `'lit'` keeps the old filters as an option).
Proportions are about five heads with the hair: see the geometry below,
which is the new rig geometry. Everything still animates through the same
channels, so the open mouth, the cheeks, the brows, the big hands and the
hair are all drawn as parts that move.

Both presets carry `art`, `shading`, `eyes`, `mouthStyle`, `browWeight`,
`outline` and `belt` on `Skin` (see `src/skins/types.ts`), set by
`buildSkin` from `CharacterConfig`, which gains `art`, `shading` and
`face.eyes`, `face.mouth`, `accessories.belt`, and the top style
`'shirtTie'`.

The match test: `review/match/<skin>.png` is the reference beside the hero
render at the same height; three judges score likeness 1..10 and the restyle
loops until both score at least 8.

## Hands: finger position and movement (the user's standing directive)

The user's words: "mind the finger position and movement". Hands are the
first thing a viewer reads after the face, and a wrong finger is louder
than a wrong elbow. This section binds every hand pose and every gesture.

**Position.** At every hold a hand is in a NAMED shape from `HAND_POSES`,
never an interpolation residue. The shapes, as a real hand makes them:

| shape | what the fingers do |
|---|---|
| relaxed (hanging) | all four curl gently, pinky most, index least; the thumb rests against the index side, pointing down-forward; the palm faces the thigh |
| open / presenting | fingers together or barely spread (not fanned), straight with a hint of curve at the last joint; the thumb out at about 40 degrees; the palm faces up or toward the audience |
| fist / thumbsUp | fingers fully curled with the pinky tightest, knuckles form a ridge; thumb across the fingers (fist) or straight up (thumbsUp); the fist is a compact block, never wider than the palm |
| point | index straight, middle, ring and pinky curled, the thumb resting on the middle finger, never sticking out |
| one, two, three | counted fingers straight and together (two and three slightly spread), the rest curled, the thumb holding them down; the palm faces the audience |
| ok | index and thumb tips touching to make a ring, the other three straight and slightly fanned |
| stop | the open hand, fingers together, palm square to the audience |
| cup / hands on hips | fingers curled to about half, the thumb behind (hips) or beside (cup) |

Finger lengths: middle longest, index and ring close, pinky two thirds of
the middle; a thumb that reaches the index's middle knuckle. The palm is
about as wide as it is tall. Fingers never pass through each other or
through the palm, and the thumb never pokes out of a fist.

**Movement.** A hand does not snap. The fingers of a closing hand curl in
sequence, pinky first, index last, about 15 ms apart (`handKeys` does this);
an opening hand releases index first. Curling takes 120 to 200 ms; a
pointing finger extends in about 150 ms with a small overshoot. The hand
turns on the wrist as the arm moves, so the palm faces where the gesture
needs it at the hold (the audience for a wave or a stop, up for a present,
the thigh at rest) and turns back on the return; `palm` changes over the
same span as the arm, never in one frame. The thumb moves with its own
timing, slightly after the fingers. A hand that is only holding still still
lives: 1 to 2 percent of curl drift over a second, never frozen. Between two
named shapes in one gesture (one, two, three) only the fingers that change
move; the others hold.

**Evidence and checks.** `review/hands/<skin>-<gesture>.png` is a close-up
sheet of the moving hand (the shooter crops to the `data-part="hand-R"` or
`hand-L` box, 12 frames). `tests/hands.test.ts` holds: every gesture's hand
at its hold matches a named shape; no finger channel moves more than 0.1 per
frame at 60 fps; curl order pinky first; palm never changes more than 0.08
per frame. A hand critic (REVIEW.md lens L4h) reads only these sheets.

## Motion: never mechanical (the user's standing directive)

The user's words: "the motion animation is too mechanical". Mechanical means
joints that start and stop on their own keyframe with the same ease,
oscillations that are perfect sines, holds that freeze, nothing lagging or
settling, hair and cloth that never move, and every play identical. The fix
is a LIFE LAYER in `src/rig/life.ts`, applied by `poseAt` after the layers
are composed, so every action gets it without being rewritten:

1. **Mass.** Every channel passes through a critically damped spring tuned
   per class (fingers light and quick, head medium, body heavy), stepped at
   a fixed 240 Hz from t=0 so it stays a pure function of time. A keyframe
   that stops dead now settles; a fast move carries past and comes back.
2. **Lag.** Distal channels are sampled a little behind their parent: elbow
   30 ms after shoulder, wrist 60, fingers 90, pupils 40 ms after head turn.
3. **Drift.** Seeded, smooth 1/f-style noise on every channel with
   class-specific amplitude (head 0.6 deg, arms 0.8 deg, fingers 0.02, brows
   0.03, body 1 px), so a hold breathes and no two seconds match.
4. **Secondary motion.** `hairSway`, `clothSway` and `braidSway` channels
   (add to channels.ts) are derived from the lagged, spring-filtered velocity
   of head turn and body X and the renderer rotates hairBack, the bun, the
   braid, the dupatta and a long skirt by a few degrees from them.
5. **Balance.** Lifting an arm shifts the body a few px the other way,
   drops the opposite shoulder (twist) and tilts the head toward the hand;
   a jump bends both knees first. Derived from the arm and body channels.
6. **Variation.** `play()` scales a gesture's amplitude and timing by a
   seeded 4 to 8 percent each time it is played, and the oscillating
   gestures (wave, shake, nod, clap, rubHands, headBob) decay in amplitude,
   drift in frequency and have a quicker out-stroke than return.

All of it is configurable through `LifeOptions` (`mass`, `lag`, `drift`,
`secondary`, `balance`, `variation`, each 0..1, default 1) on `useCharacter`
and `Actor`, and off entirely with `life: 0` for debugging a keyframe.
`tests/life.test.ts` holds: still deterministic; no pops introduced; a held
pose moves at least 0.3 px over a second; two plays differ; a stopped arm
overshoots by 1 to 4 percent and settles within 300 ms.

## Rig geometry (viewBox 0 0 400 600)

NEW NUMBERS for the art direction above (the old ones are kept further
down for history and are superseded): ground y=580. Hips (200, 360). Belt
or waist y=345 (Arjun) / 335 (Riya). Shoulders y=205, pivots at
x = 200 +- (skin.shoulderHalf - 6); shoulderHalf Arjun 76, Riya 58. Neck
base (200, 196), neck width 30 / 24. Head centre (200, 120); head-local
skull rx 50, ry 56, so the crown is y=-56 (hair rises to about -84 for the
quiff and the bun) and the chin y=56. Face features head-local: eyes at
(+-20, -2), brows y=-18 from x=+-8 to +-32, nose (4, 12) a short stroke,
mouth centre (0, 30), ears at (+-50, 2). Upper arm 95, forearm 85, hand 30
wide. Legs: thighs from the hips to knees at y=470, calves to ankles at
y=560, shoes to 580. Arjun's torso tapers from shoulderHalf at the top to
half-width 56 at the belt; Riya's to 40 at the waist, then the skirt flares
to half-width 62 at y=500.

OLD numbers, superseded:

Front view, standing, ground at y=580. Hips at (200, 400). Shoulders at y=262,
pivots at x = 200 ± skin.shoulderHalf (about 66). Neck base (200, 252). Head
centre (200, 170); head-local space has its origin there, skull rx≈60 ry≈66,
chin at y≈66. Face features in head-local: eyes at (±24, -4) rx 11 ry 12; brows
y≈-24 from x=±11 to ±37; nose at (0, 14); mouth centre (0, 38); ears at (±60, 2).
Upper arm 92 px, forearm 84 px, hand from wrist (palm 26 px, fingers to ~20 px).

Screen-left arm/hand is channel suffix `L`; the renderer mirrors the right side
with `scale(-1,1)`, so one drawing serves both. In the arm's local frame +y runs
down the hanging arm and +x is toward the body; the thumb sits on +x.

Arm angles: `shoulder` 0 hangs down, positive lifts away from the body (both
sides). `elbow` is a picture-plane fold: positive folds the forearm toward
the body side of the upper arm, which is the hand coming to the chest from a
hanging arm; with the upper arm raised sideways that same side points DOWN,
so a wave (forearm up beside the head) is a NEGATIVE elbow, about -140.
`wrist` follows the same rule. Renderer applies `rotate(shoulder)` at the
pivot, `rotate(-elbow)` at the elbow, `rotate(-wrist)` at the wrist, all in
the already-mirrored frame. Elbow range -150..165, wrist -90..90.

Head: `headTurn` -1..1 yaw. Renderer does 2.5D: features translate `turn*16`,
nose `turn*20`, hairFront `turn*10`, skull outline `turn*4` with `scaleX(1-|turn|*0.05)`,
hairBack `turn*-3`, near ear hides. `headNod` pitches: features `nod*9` down,
head group `nod*5`, face `scaleY(1-|nod|*0.04)`. `headTilt` is a plain rotate
about the neck base.

Smile physiology is derived IN THE RENDERER, not by every action: a smile > 0
raises the cheek apples (`smile*3` up), tightens the lower lids (adds
`max(0,smile)*0.3` to squint), shows a nasolabial crease past 0.45, and shows
upper teeth when `mouthOpen > 0.12 && smile > 0.2` unless `teeth` says
otherwise. That is what makes a smile read as felt rather than drawn.

## Hand (A)

```ts
export type HandPose = { f1: number; f2: number; f3: number; f4: number; thumb: number; spread: number; palm: number }
export function Hand({ pose, palette }: { pose: HandPose; palette: Palette }): JSX.Element
```
Local frame: wrist at (0,0), fingers extend to +y, thumb on +x. `f1..f4` curl
0 straight .. 1 fully curled (index to pinky), two-segment fingers, curl rotates
proximal ~55° and distal ~70° further, in-plane. `palm` 0..1 blends from side-on
(curl rotates in plane) toward facing the viewer (curl foreshortens: length
×(1-0.6·curl)). `thumb` 0 out .. 1 tucked across the palm. `spread` 0..1 fans
fingers up to ±14°. Every value continuous so poses blend. Skin gradient fill,
a faint darker stroke to separate fingers. Known poses (for E):

| pose | f1 f2 f3 f4 | thumb | spread | palm |
|---|---|---|---|---|
| relaxed | .25 .3 .35 .4 | .2 | .3 | .3 |
| open | 0 0 0 0 | 0 | .6 | 1 |
| fist | 1 1 1 1 | .9 | 0 | .4 |
| point | 0 1 1 1 | .6 | 0 | .2 |
| thumbsUp | 1 1 1 1 | 0 | 0 | .2 |
| one/two/three | 0 1 1 1 / 0 0 1 1 / 0 0 0 1 | .8 | .5 | 1 |
| ok | .7 .1 0 0 | .7 | .4 | .9 |

## Character (B)

```ts
export function Character({ pose, skin, width = 400, className }: { pose: Pose; skin: Skin; width?: number; className?: string }): JSX.Element
```
Draw order: ground shadow, legs, torso+top, neck, head (hairBack, skull, ears,
face, hairFront, faceExtras), neckExtras, arms (upper, fore, Hand). Arms are in
front of everything so a hand can reach the chin. Breathing: chest `scale(1+b*0.015)`
about the hips and shoulders rise `b*2`. `lean` rotates the torso and everything
above it about the hips. `bow` 0..1 drops shoulders 0..26 px with `scaleY` and
adds `nod` 0..0.6 to the head. `bodyY/bodyX/bodyScale` move the whole figure
about the ground point (200, 580); the ground shadow shrinks and lightens as the
figure rises. Lighting: one lamp, upper left, as in
`python/14_for_loop/src/decks/figures/lighting.tsx`: gradients on every large
form, a cast shadow from hairFront onto the forehead and from arms onto the
torso, a chin shadow on the neck. Unique ids via `useId` (two actors share a
page). No outlines on big forms; thin same-hue strokes only where two skin forms
meet (fingers, ear). Everything must hold up at 120 px tall on a slide and at
1080 px tall in a reel.

Eyes: white, iris (`palette.iris`), pupil, one catchlight upper-left. Pupils
translate `lookX*5, lookY*4`. Upper lid closes from the top by `blink` (a
skin-coloured shape clipped to the eye, with a lash line); lower lid rises by
`squint*0.55`. Brows: raise by `brow*7` px; `browInner` rotates about the outer
end so the inner end lifts (sad) or drops (angry) up to 14°. Mouth is one path
built from `mouthOpen`, `mouthWide`, `smile`, `pucker`, `mouthX`: half-width
`14 + wide*12`, corners at `y = -smile*7`, lower lip drops `open*22`, interior
dark, teeth and tongue as above, lips in `palette.lip` 2.5 px. A closed mouth
is a line that bows with `smile`. `cheeks` adds blush.

## Character config and skins (C1, C2)

A character is a config. `Skin` (the renderer's input) is BUILT from it, never
hand-written. Arjun and Riya are presets.

```ts
// src/skins/config.ts  (C2 owns this file; C1 imports the types from it)
export type SkinTone = 'fair' | 'wheatish' | 'medium' | 'dusky' | 'deep' | `#${string}`
export type HairColor = 'black' | 'darkBrown' | 'brown' | 'auburn' | 'grey' | `#${string}`
export type HairStyle =
  | 'short' | 'sidePart' | 'quiff' | 'curly' | 'buzz'            // read as male by default
  | 'braid' | 'ponytail' | 'bob' | 'long' | 'bun' | 'wavy'        // read as female by default
export type TopStyle = 'shirt' | 'tshirt' | 'kurta' | 'hoodie' | 'blouse' | 'polo'
export type BottomStyle = 'trousers' | 'jeans' | 'skirt' | 'salwar' | 'shorts'
export type CharacterConfig = {
  name: string
  gender: 'male' | 'female'            // base proportions: shoulder width, neck, jaw default
  skinTone: SkinTone
  hair: { style: HairStyle; color: HairColor }
  face: { jaw: 'round' | 'oval' | 'square'; brows: 'thin' | 'medium' | 'thick'; lip?: `#${string}`; blush?: number }
  outfit: { top: TopStyle; topColor: `#${string}`; bottom: BottomStyle; bottomColor: `#${string}`; shoeColor?: `#${string}` }
  accessories: { glasses?: 'none' | 'round' | 'rect'; earrings?: boolean; bindi?: boolean; beard?: 'none' | 'stubble' | 'short'; watch?: boolean; flower?: boolean; necklace?: boolean }
  build: { height: number; shoulders: number }   // multipliers, 0.9..1.1
}
export const PRESETS: Record<'arjun' | 'riya', CharacterConfig>
export function buildSkin(config: CharacterConfig): Skin
export function resolveTone(t: SkinTone): { skin: string; skinShade: string; skinLight: string; blush: string; lip: string }
export function resolveHair(c: HairColor): { hair: string; hairShade: string; hairLight: string }
```

`Skin` gains `headScale: { x: number; y: number }` and `buildScale: number`
(C2 adds them to `src/skins/types.ts`; B reads them). `sleeve` follows the top:
shirt/hoodie/polo long, tshirt/kurta/blouse short.

```ts
// src/skins/hair.tsx  (C1)
export function hairBack(style: HairStyle, p: Palette): ReactNode | null
export function hairFront(style: HairStyle, p: Palette): ReactNode | null
```
Head-local. Every style is several path clusters with a sheen stroke and a
shade, never one blob; braid/ponytail hang into body space (below y=66, over
one shoulder) and still read inside the head group. The fringe casts a shadow
on the forehead (the renderer wraps hairFront in a `CastShadow` filter, so
just draw the shapes).

```ts
// src/skins/outfits.tsx  (C2)
export function top(style: TopStyle, p: Palette): ReactNode
export function legs(style: BottomStyle, p: Palette): ReactNode
export function faceExtras(cfg: CharacterConfig, p: Palette): ReactNode | null   // glasses, bindi, beard, earrings, flower
export function neckExtras(cfg: CharacterConfig, p: Palette): ReactNode | null   // collar, necklace, dupatta
```
Body space. A collar shows above the neckline; a kurta has the V and the
placket as in `python/14_for_loop/src/decks/figures/Riya.tsx`; a hoodie has a
hood behind the neck and a pocket; jeans have a seam; a skirt flares. Tones:
Indian skin tones for the five named `SkinTone`s, Riya's from that file for
`wheatish`.

Presets: **Arjun**: male, medium, `sidePart` black, square jaw, medium brows,
stubble, shirt `#3B82F6` + chinos `#D6C4A8`, watch. **Riya**: female,
wheatish, `braid` darkBrown, oval jaw, kurta in Riya's blue `#3FB5E5` +
salwar `#F4F7FA`, flower, earrings, bindi.

## Compose, idle, runtime, Actor (D)

```ts
// compose.ts
export type Clip = { action: Action; start: number; stopAt?: number }
export type Timeline = { seed: number; expression?: Clip; prevExpression?: Clip; gesture?: Clip; prevGesture?: Clip; talk?: Clip }
export function poseAt(tl: Timeline, t: number): Pose
```
Order, bottom to top: default → idle (seeded, see idle.ts) → expression (loops,
holds; crossfades from prevExpression over 0.35 s) → gesture (one-shot or loop;
blendIn/blendOut from the Action, default .18/.25; `stopAt` starts the blend-out
early) → talk (mouth channels replace, head/brow channels ADD). Channels in
`ADDITIVE` add; others lerp by the layer weight. A gesture past its end with
no loop contributes weight 0.

```ts
// idle.ts
export function idlePose(t: number, seed: number): Partial<Pose>
```
Deterministic from (t, seed). Breath 4.2 s cycle, in faster than out. Blink
every 2.8–5.5 s, close 90 ms, open 180 ms, 1 in 7 a double blink; both eyes,
right eye 15 ms behind. Saccade every 1.5–4 s: lookX/Y jump (`out`, 60 ms) to a
small random target, dwell, return toward 0; the head follows 20% of large
saccades 120 ms later. Sway: sum of two slow sines on bodyX (±2 px), headTilt
(±1.2°), a weight shift (`stance`) every 9–14 s. Micro brow life: ±0.04 drift.

```ts
// useCharacter.ts
export type PlayOptions = { speed?: number; amplitude?: number; side?: 'L' | 'R'; repeat?: number; loop?: boolean }
export type IdleOptions = { breath?: boolean; blink?: boolean; saccades?: boolean; sway?: boolean; liveliness?: number }  // liveliness 0..1 scales every idle amplitude, default 1
export type Controls = {
  pose: Pose
  time: number
  play: (gesture: string | Action, opts?: PlayOptions) => void   // replaces the current gesture, with crossfade
  stop: () => void                                                // blend the gesture out
  setExpression: (name: string, intensity?: number) => void       // intensity scales the expression, default 1
  say: (text: string, opts?: { wpm?: number; emphasis?: boolean }) => void
  seek: (t: number) => void                                       // manual clock
  setClock: (mode: 'auto' | 'manual') => void
  setIdle: (opts: IdleOptions) => void
  current: { gesture?: string; expression: string; talking: boolean }
}
export function useCharacter(opts: { id?: string; seed?: number; clock?: 'auto' | 'manual'; idle?: IdleOptions }): Controls
```
`speed` retimes the clip (`retime(action, 1/speed)`), `amplitude` scales it
(`scaleAction` in track.ts, deviations from the default pose × amplitude),
`side` mirrors a one-handed gesture (`mirror`), `repeat` plays it n times,
`loop` overrides the action's own loop. `auto` uses requestAnimationFrame
with its own start; `manual` only moves on `seek`. Expose the controls on
`window.__actors[id]` when `opts.id` is set so shoot/record can drive it. The
hook looks gestures up in `ACTIONS` and expressions in `EXPRESSIONS` from
`src/actions`, and builds talk clips with `talkAction` from `src/actions/talk.ts`.
`Timeline` carries `idle: IdleOptions` and `poseAt` honours it.

```tsx
// Actor.tsx
export type ActorProps = {
  character: 'arjun' | 'riya' | CharacterConfig
  expression?: string; intensity?: number
  gesture?: string; gestureOptions?: PlayOptions
  say?: string
  idle?: IdleOptions
  width?: number; seed?: number; className?: string
  /** manual clock: the pose at this time, for decks that drive their own timeline */
  time?: number
}
export function Actor(props: ActorProps): JSX.Element
```
Changing `gesture` plays it; changing `say` speaks it; `gestureOptions.loop`
re-plays the gesture each time it ends. A string `character` resolves through
`PRESETS`; a config is passed to `buildSkin` (memoised).

## Actions (E)

```ts
export const ACTIONS: Record<string, Action>
export const EXPRESSIONS: Record<string, Action>   // loop: true, group: 'face', duration 1
export const HAND_POSES: Record<string, HandPose>
export function handKeys(side: 'L' | 'R', pose: HandPose, t: number, ease?: Ease): Tracks  // helper
```
Expressions (at least): neutral, happy, grin, laugh, sad, worried, surprised,
shocked, thinking, confused, angry, skeptical, bored, proud, shy, excited,
listening. Each sets brow, lid, mouth, cheek, look channels, and most include a
small asymmetry (one brow 0.05–0.1 higher, mouth slightly off-centre) because
symmetric faces read as masks.

Face one-shots: blink, doubleBlink, wink, eyeRoll, lookLeft/Right/Up/Down,
browRaise, browFlash (the 1/6 s greeting flash), smileBuild (0.5 s build),
smirk, lipBite, gasp, sigh, yawn, laughBurst.

Head: nod (a yes: 2 nods, 2.6 Hz, small, down-biased, with slight lean), nodSlow
(one deep nod), shake (a no: 3 cycles ±10 at 3 Hz), tilt, tiltCurious (tilt +
brow raise + eyes), turnLeft/Right (eyes lead by 80 ms, head follows, body twist
follows later), lookUpThink, chinUp, headBob (to music, loop).

Hands/arms: wave (elbow-driven, forearm up, 3 oscillations ±25° at wrist/elbow,
2.5 Hz, shoulder nearly still, hand lags 60 ms), waveBig (whole arm), point,
pointUp, pointAtScreen (toward viewer, foreshortened: elbow bends, palm 0.9),
presentLeft/Right (open palm sweeps to a slide), thumbsUp, thumbsDown, clap
(4 claps, hands meet in front), handsOnHips, armsCrossed, shrug (shoulders up,
palms out, brows up, 0.9 s, with hold), facepalm, chinThink (hand to chin,
loop with tiny taps), countOne/Two/Three (hand up, fingers flip 1→2→3),
fistPump, raiseHand, okSign, stopHand, comeHere, scratchHead, rubHands,
fingerWag, handsSpread (explaining), namaste.

Body: bounce, jumpJoy, leanIn, leanBack, bow (greeting), sway (loop), dance
(loop), celebrate (jump + fist pump + grin), stretch, stepLeft/Right,
turnAround? (skip), sitDown? (skip).

Every gesture: anticipation (a small move opposite first), overlapping action
(upper arm leads, forearm 40–80 ms later, hand 40–60 ms after that), ease
`overshoot` into the hold, slow-out on the return, and arcs (never a straight
rotate from A to B on one joint). Hold poses breathe (a 0.3 px drift) rather
than freeze. Durations are real: a wave is 1.6–2.2 s, a nod 0.8–1.1 s, a shrug
1.2 s, a clap 1.4 s.

## Talk (F)

```ts
export function talkAction(text: string, opts?: { wpm?: number; emphasis?: boolean }): Action
export function visemesFor(text: string): Viseme[]  // { shape: 'rest'|'A'|'E'|'I'|'O'|'U'|'M'|'F'|'L'|'W'|'TH'|'S', dur: number, stress: boolean }
```
About 150 wpm default: ~ 0.07 s per phoneme, 0.12–0.2 s pauses at commas and
word ends, 0.35 s at full stops. Coarticulation: each viseme eases over its
neighbours (keys 30 % before the boundary). Mouth channels per shape (open,
wide, pucker, teeth, tongue): A .75/.55/0, E .45/.9/0, I .3/1/0, O .7/.15/.6,
U .35/.1/.9, M/B/P 0/.3/.2, F/V .15/.7/0 (teeth on lip), L .5/.5/0 tongue .6,
W .25/0/.8, TH .3/.6/0 tongue .4, S .15/.8/0 teeth 1. Stressed syllables (first
in content words, longer vowels) add +0.15 open and a head micro-nod (1.5° at
`out`), a question mark lifts brows +0.4 and head at the end, an exclamation
adds a brow flash and +0.2 open. Blinks tend to land at phrase boundaries: emit
`blinkL/R` keys at the pauses. Jaw never snaps: nothing faster than 50 ms.

## Playground, shoot, record (G)

`App.tsx`: both actors side by side on a plain light background, each with
their own `useCharacter`. Controls: expression grid with an intensity slider,
gesture grid grouped (face, head, hands, body) with speed, amplitude and side
controls, a text box + Say, a pause/scrub bar in manual mode, idle toggles
(breath, blink, saccades, sway, liveliness), and a "both" toggle so a click
drives both actors. A **Character** panel per actor edits the full
`CharacterConfig` live (gender, skin tone, hair style and colour, jaw, brows,
top/bottom style and colour, every accessory, build sliders) with a
"Copy config JSON" button, and preset buttons for Arjun and Riya. Reads
`?skin=&gesture=&expression=&say=&seed=&t=&config=<urlencoded JSON>` from the
URL to set up a single actor for the harnesses, and when `t` is given starts
in manual clock seeked to `t`.

`shoot.mjs`: Playwright (chromium from the shared node_modules), for every
gesture and every expression and one talk line, for both skins: load the
playground with `?skin=…&gesture=…&t=0`, then step `window.__actors.main.seek(t)`
over the clip's duration at 12 evenly spaced times, screenshot the actor
element at 2x, and tile the frames into one contact sheet PNG
`review/sheets/<skin>-<kind>-<name>.png` with the time under each frame, via
a `<canvas>` in the page. Also writes `review/sheets/index.html` listing them.

`record.mjs --skin --script --fps 30 --size 1080x1920 --out`: script JSON is
`[{ at: 0, expression: 'happy' }, { at: 0.2, gesture: 'wave' }, { at: 0.4, say: 'Hi' }]`.
Steps time at 1/fps, applies the script events, screenshots to PNG frames, then
encodes with the ffmpeg under `~/.cache/ms-playwright/ffmpeg-*` (h264 mp4;
fall back to writing the frame folder and printing the ffmpeg command if the
build cannot encode). The page is `?reel=1`, 1080x1920, actor centred and 1100
px tall.

## Realism, the bar every critic will hold this to

Time is real: a blink is 90 ms down, 180 ms up. A head shake is 3 Hz. A wave is
2.5 Hz at the elbow. A smile builds over 400–600 ms and the eyes join it.
Breathing is 14/min. Nothing moves in a straight line, nothing starts or stops
at full speed, nothing is perfectly symmetric, and a joint never moves alone:
the eye leads the head leads the shoulders. A held pose still lives. A gesture
has a wind-up before and a settle after. The mouth is a shape, not a hole. The
face changes with the gesture: a point narrows the eyes, a shrug lifts the
brows, a wave smiles. If a frame could not be a photograph of a person
mid-motion, it is wrong.
