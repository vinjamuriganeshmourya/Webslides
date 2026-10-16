# Characters lab

Seven characters on one shared rig, **Arjun**, **Riya**, **Kabir**,
**Meera**, **Dev**, **Ananya** and **Rohan**, drawn in the soft 3D look of
the seventy-one reference images in `reference/library/` (the Library),
with a library of actions that read as real human motion. Everything that moves is a number in
a channel (`src/rig/channels.ts`); actions write keyframes into channels,
the composer stacks the layers, and one SVG renderer draws the result for
whichever skin is on. `CONTRACTS.md` is the spec every module is built to.

## Two uses

**On a slide.** An actor is a React component that runs on its own clock:

```tsx
<Actor character="riya" expression="happy" gesture="wave" say="Hi there" />
```

Change `gesture` and it plays; change `say` and the mouth speaks it. Pass
`time` to drive it from a deck's own timeline instead.

**In a reel.** `record.mjs` steps the clock one frame at a time and encodes
the frames, so the same script gives the same video every run.

## A character is a config

A skin is never hand-drawn. It is built from a `CharacterConfig`
(`src/skins/config.ts`): gender for the base proportions, skin tone, hair
style and colour, jaw and brows, top and bottom with their colours, every
accessory (glasses, earrings, bindi, beard, watch, flower, necklace) and two
build multipliers. `PRESETS` holds the seven; `shading: 'clay'` is the
Library look, and CONTRACTS.md ("Art direction") is the style spec every
one of them is drawn to.
The playground's Character panel edits all of it live and copies the JSON,
and `?config=<urlencoded JSON>` loads one into the harness.

## Actions

The list is generated at runtime from `src/actions`, so the playground, the
contact sheets and this README never disagree: `ACTIONS` holds every
gesture, `EXPRESSIONS` every face, and each action carries its group.

| group | what lives there |
|---|---|
| face | expressions (neutral, happy, grin, laugh, sad, worried, surprised, shocked, thinking, confused, angry, skeptical, bored, proud, shy, excited, listening) and one-shots (blink, wink, eyeRoll, browFlash, smileBuild, smirk, gasp, sigh, yawn, laughBurst, ...) |
| head | nod, nodSlow, shake, tilt, tiltCurious, turnLeft, turnRight, lookUpThink, chinUp, headBob |
| hands | wave, waveBig, point, pointUp, pointAtScreen, presentLeft, presentRight, thumbsUp, thumbsDown, clap, handsOnHips, armsCrossed, shrug, facepalm, chinThink, countOne, countTwo, countThree, fistPump, raiseHand, okSign, stopHand, comeHere, scratchHead, rubHands, fingerWag, handsSpread, namaste |
| body | bounce, jumpJoy, leanIn, leanBack, bow, sway, dance, celebrate, stretch, stepLeft, stepRight |
| talk | built on the fly from text by `talkAction` (visemes, stress nods, question lift) |

Every gesture takes `speed`, `amplitude`, `side` (mirror a one-handed move),
`repeat` and `loop` through `PlayOptions`.

## Running it

```bash
npm install
npm run dev            # the playground on http://127.0.0.1:5190
npm run typecheck
```

The playground shows both actors with every control: expression grid and
intensity, gesture grid by group with speed, amplitude and side, a Say box,
scrub bar, idle toggles, a Character panel each. URL parameters set up a
single actor for the harnesses:
`?skin=riya&gesture=wave&t=0` (also `expression=`, `say=`, `seed=`,
`config=`), and `t` starts the clock in manual mode at that time.

### Contact sheets

```bash
node shoot.mjs                   # both skins, every gesture, expression, one talk line
node shoot.mjs --skin kabir      # one skin
node shoot.mjs --only wave       # clips whose name contains the text
```

Starts Vite itself (5190, or the next free port). For each clip it steps
`seek(t)` at 12 even times across the clip (a one-shot gesture includes its
blend-out, an expression gets 2.4 s), screenshots the actor at 2x and tiles
the frames with the time under each into
`review/sheets/<skin>-<kind>-<name>.png`. `review/sheets/index.html` lists
whatever sheets are on disk, with a filter box.

### Reels

```bash
node record.mjs --skin riya --script review/scripts/intro.json --out out/riya.mp4
node record.mjs --skin arjun --script review/scripts/intro.json --out out/arjun.mp4 --fps 30 --size 1080x1920 --bg
```

The script is a JSON array of events:

```json
[
  { "at": 0.4, "expression": "happy" },
  { "at": 0.6, "gesture": "wave", "gestureOptions": { "side": "R" } },
  { "at": 1.0, "say": "Hi there. Shall we start?" }
]
```

`at` is seconds; an event may carry `expression` (plus `intensity`),
`gesture` (plus `gestureOptions`) or `say`. The reel runs until
`--duration`, or three seconds after the last event. `--seed` fixes the idle
layer. `--bg` sets the backdrop colour; with no value it is the deck's navy.

Encoding uses `ffmpeg-static` when it is installed (h264 mp4, crf 18). The
ffmpeg that Playwright ships decodes only MJPEG and encodes only VP8, so
without `ffmpeg-static` the frames are JPEG and the output becomes `.webm`.
With neither, the frame folder is kept and the ffmpeg command is printed.

## The realism bar

Time is real: a blink is 90 ms down and 180 ms up, a head shake is 3 Hz, a
wave is 2.5 Hz at the elbow, a smile builds over half a second and the eyes
join it, breathing is 14 a minute. Nothing moves in a straight line, nothing
starts or stops at full speed, nothing is perfectly symmetric, and a joint
never moves alone: the eye leads the head leads the shoulders. A held pose
still lives. A gesture winds up before and settles after. The face changes
with the gesture. If a frame could not be a photograph of a person
mid-motion, it is wrong, and the contact sheets exist to catch exactly that.
