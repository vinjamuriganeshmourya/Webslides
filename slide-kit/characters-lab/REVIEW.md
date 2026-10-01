# Characters lab: how it is reviewed

The build was held to `CONTRACTS.md`. The review is held to this file. It runs
in rounds until the characters pass the bar at the bottom, and every round
leaves a commit on `lab/characters`.

Three kinds of check, cheapest first:

1. **Tests** (`npm test`, vitest): numbers that must hold. No eyes needed.
2. **Evidence** (`npm run shoot`): rendered frames, so a critic sees motion
   rather than reading about it.
3. **Critique**: agents with one lens each look at the evidence, propose
   fixes with file and line, and every finding is attacked by skeptics
   before anyone edits a file.

---

## 1. Tests: `tests/*.test.ts`

Run with `npx vitest run`. They import the real modules through the `@/` alias.

| Test | What must hold | Why |
|---|---|---|
| determinism | `poseAt(tl, t)` twice gives identical poses; `idlePose` same seed same pose, different seed different pose; no `Math.random` or `Date.now` anywhere under `src/rig` or `src/actions` (grep) | the recorder depends on it |
| ranges | over 240 samples of every action and expression: blends in [0,1], signed blends in [-1,1], shoulder in [-25,190], elbow in [-5,160], wrist in [-70,70], headTurn/Nod in [-1,1], headTilt in [-30,30], bodyY in [-80,10] | a value outside its range draws a broken body |
| continuity | at 60 fps no channel moves more than its per-frame cap: angles 7 deg, hand curls 0.15, mouth 0.2, head turn 0.12, bodyY 6 px; blink is exempt up to 0.5 | a pop is the first thing an eye catches |
| rest | every one-shot starts within tolerance of the rest pose at t=0 and is back within tolerance at duration + blendOut | a gesture must not jump in or out |
| timing | blink from idle: 70..120 ms down, 150..220 ms up; breath period 3.8..4.6 s; wave elbow 2..3 Hz (zero crossings about its mean); shake headTurn 2.5..3.5 Hz; nod headNod 2..3 Hz; smileBuild reaches 90 % between 0.35 and 0.65 s | real human timing, from the contract |
| overlap | for wave, point, raiseHand, presentRight: the time of peak shoulder speed precedes peak elbow speed precedes peak wrist speed | a joint never moves alone |
| anticipation | for wave, point, clap, fistPump, jumpJoy: in the first 200 ms the driving channel moves opposite to its main direction | the wind-up |
| asymmetry | every expression except neutral has browL != browR or mouthX != 0 or browInnerL != browInnerR | symmetric faces read as masks |
| talk | "mom" gives three M-dominant visemes; no viseme shorter than 50 ms; `sayDuration` of a 30-word line at 150 wpm is 11..14 s; a trailing "?" lifts browL/R at the end; mouthOpen never exceeds 1 | lip sync rules |
| mirror | `mirror(wave)` moves channels ending in R to L and flips headTilt; `both` touches both arms | runtime side option |
| config | `buildSkin` succeeds for every hair style x every top x every bottom x every jaw (sampled 60 combos plus both presets) and `renderToStaticMarkup(<Character>)` contains the groups `data-part="head"`, `"arm-L"`, `"arm-R"`, `"mouth"`; two actors on one page share no `id` | configurable means every combination draws |
| no em dash | no U+2014 under `src/` or in `*.md` of this lab | repo rule |

Also, not asserted but printed as a report (`npm run audit`): per action, the
first-200 ms anticipation sign, the peak-speed order, the longest hold, the
number of keys per channel, so a reviewer can see timing numbers without
reading keys.

## 2. Evidence: `review/`

`node shoot.mjs` writes everything below; `--only` limits it.

| File | Frames | What it shows |
|---|---|---|
| `sheets/<skin>-gesture-<name>.png` | 12 over the clip | the motion of one gesture |
| `sheets/<skin>-expression-<name>.png` | 12 over 2.4 s from neutral | the face arriving at an expression |
| `sheets/<skin>-talk.png` | 16 over the line | lip sync |
| `sheets/<skin>-idle.png` | 16 over 8 s, no gesture | life at rest |
| `hero/<skin>.png` | 1, 1080 tall | draw quality, lighting, hair, cloth |
| `hero/<skin>-small.png` | 1, 120 tall | legibility on a slide |
| `grids/expressions-<skin>.png` | one hold frame per expression, labelled | comparative read of the face |
| `grids/hands.png` | every HAND_POSE on both hands | hand readability |
| `grids/configs.png` | 12 configs: all hair styles, every top and bottom, three tones, glasses, beard | configurability, no broken combination |
| `grids/velocity-<name>.png` | a strip chart per channel | where the speed is, so pops and dead holds are visible |
| `reel/<skin>-intro.mp4` + `reel/<skin>-intro-sheet.png` | 1 frame per second of the reel | the deliverable itself |

Each sheet carries the time under every frame and the action's keys count.
Frames are 300 px wide in the tile so a 12-frame sheet is 3600 px, which an
agent can read in one look.

## 3. Critique: lenses

Each lens is one agent with one job, looking at a named subset of the
evidence. It returns findings, not prose:

```
{ id, lens, title, severity 1..5, evidence: "sheets/riya-gesture-wave.png frame 4",
  real: "what a real person does here", fix: { file, where, change }, confidence 0..1 }
```

| Lens | Looks at | Judges |
|---|---|---|
| L1 draw | hero, small, grids/configs | proportions, volume, lighting from one lamp, hair that reads as hair, cloth that reads as cloth, hands that read as hands at 120 px, nothing floating, nothing clip-art |
| L2 face | grids/expressions, expression sheets | Duchenne smile, brow and lid logic per emotion, asymmetry, the arrival over time (corners first, eyes 100 ms later), nothing that reads as a mask |
| L3 head and body | head and body gesture sheets, velocity strips | the twelve principles: anticipation, overlap, arcs, slow in and out, secondary motion, a hold that lives; real frequencies |
| L4 hands | hand gesture sheets, grids/hands | the hand shape reads, the arm bends like an arm (elbow driven wave, shoulder quiet), hand lags forearm, poses at the hold are what a person would do |
| L5 talk | talk sheets, the viseme dump | shapes match sounds, coarticulation, jaw never snaps, head emphasis on stress, blink at the pause |
| L6 idle | idle sheets | breath visible but small, blink timing, saccades with the head following, weight shift, nothing metronomic |
| L7 both | every sheet pair arjun vs riya | the same action reads the same on both; the female rig is not the male rig shrunk; config variety never breaks a pose |
| L8 code and API | `src/`, `README.md` | small readable modules, the Actor API a deck author can use in one line, determinism, no duplication between actions, nothing hard-coded that the config should own |
| L9 timing audit | `src/actions/*.ts` keys, the audit report | every duration against the real-timing table in CONTRACTS.md |
| L10 reel | reel sheets, the mp4 size and duration | the deliverable plays, frame count matches fps x duration, no blank first frame |

Every lens also gives a score 1..10 for "a photograph of a person mid-motion
could look like this", with the three things that most hold the score down.

## 4. Verify before fix

Every finding meets two skeptics in parallel, with different questions:

- **Visible?** "Open the evidence named. Is the defect actually there, in that
  frame, or is it taste?" Default to not visible if unsure.
- **Right fix?** "Read the file at the proposed place. Would the change do what
  the finding says, stay inside CONTRACTS.md, and break nothing else that
  shares the channel?" Default to wrong if unsure.

A finding survives on two yeses. Severity 5 survives on one yes plus a note,
because a severity 5 is the kind of thing that makes a reel unusable.
Duplicates (same file, same channel, same symptom) merge before verification.

## 5. Fix, then re-run everything

Survivors are grouped by file. One fixer per group, in parallel, each allowed
to touch only its files; a fix that needs a second file is returned as a
follow-up, not done. Then the integrator runs `npx tsc`, `npx vitest run`,
`node shoot.mjs`, and the round is committed as `review(characters): round N`
with the survivors listed in the body.

## 6. The bar

A round ends the loop when all of these hold, else the next round starts
from fresh evidence (max 6 rounds, then stop and report what is left):

- tests green
- no open finding with severity >= 3
- a blind panel of three judges, each shown the hero stills, the expression
  grid, the idle sheet and six gesture sheets per skin, scores both
  characters on draw, face, motion, hands, talk, idle: mean >= 8.5 and
  no category under 7.5
- the one human stand-in check: I open the hero stills, the expression grid
  and three gesture sheets myself and would put them in a reel

## What a round costs

About 10 lens agents, 2 skeptics per finding (typically 20 to 40 findings),
3 to 6 fixers, 1 integrator, 3 judges. Rounds run back to back with no human
in the loop; a usage-limit pause is resumed by the scheduled wake-up.
