# Annotated output lab

**DECISION OPEN. A human picks.** Nothing here is approved. Five candidates are
built and rendered; this file says what each is best at and what each is worst
at, and records two departures a person has to rule on.

**Not a session.** A lab inside the kit whose only job is to choose how an
annotated terminal panel should be drawn.

```bash
npx vite --port 5232 --strictPort
npx tsc -b --noEmit
npm run build:html            # -> dist-single/annotated-output-lab.html
export CHROME_PATH=/opt/google/chrome/chrome
node shots.mjs                # every gallery slide, 2600ms settle, + each panel's top edge
node center-check.mjs         # centring on BOTH axes, figure and panel, per slide
node qa.mjs && node video-safe.mjs && node align-check.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`.

---

## The design question

**A terminal panel whose output has parts worth naming has no way to name
them.**

`slide-kit/slide-template/src/ui/Terminal.tsx` exposes only
`TerminalLine = { text, kind?: 'cmd' | 'out' | 'ok' | 'err' }`. Four colours, and
no way to mark, number, bracket or annotate a specific line or a run of lines.

Two consequences, both measured in Deployment session 6.

**1. Slide 30 `c3-layers-travel` is a broken instruction.** Its lead reads *"Read
the panel again and count the lines between the first and the last"* and **there
is no panel on the slide** — three bullets sit alone in the middle of an
otherwise empty frame. The room is told to read something that is not on screen.
The concept is real and good: in a `docker push` output, `Pushed` appears once
PER LAYER, so an image is layers rather than one file. It simply has no
representation.

**2. `PEDAGOGY_GUIDELINES.md` section 5 requires this and there is no
component.** "Anti-magic: open the box once per abstraction" records that the
corpus does it 25 times: *"Use `01/02/03` numbered callouts rather than bullets
when the callouts map to lines of code, so the eye can pair them."* With nothing
in the kit, every deck that needs it either skips it or hand-rolls markup.

---

## The fixture, and why it is this one

Session 6 slide 29 `c3-push`, verbatim, seven lines, quoted from a real
`docker push`:

```
docker push ravi123/nxttrendz-backend:v1
The push refers to repository [docker.io/ravi123/nxttrendz-backend]
5f70bf18a086: Pushed
a3ed95caeb02: Pushed
92a4b8a3e10c: Pushed
b7f7d2967507: Mounted from library/python
v1: digest: sha256:9b7e3a... size: 1573
```

The claim annotating it is slide 30's, verbatim. **Nothing was added to the
output.** Where a candidate needed more lines than the session has to look good,
that is recorded below as a finding against the candidate, not fixed by inventing
output.

### The `Mounted from` trap

All four middle lines are layers and the room counts four. But
`b7f7d2967507: Mounted from library/python` means that layer was **not
uploaded** — Docker found it already on the registry and reused it. A figure that
brackets it in with the three `Pushed` lines is asserting something false, and a
badge reading `4 layers pushed` would be false too.

So the contract gives a run's lines a `role`, and `exception` is the one that
matters. Every derived count in this lab is
`lines.filter(l => l.role !== 'exception').length`, so a candidate can only get
this wrong by ignoring the field.

---

## Anti-drift: the annotations and the lines are one structure

`SyntaxBreakdown` records the failure this contract is designed against: its
first draft took a `command` string AND a `parts` array, and the two disagreed
within one session — the slide explained a flag the specimen no longer carried.

The obvious contract here is `lines: TerminalLine[]` plus
`annotations: [{ lineIndex, text }]`. That is the same failure and worse, because
inserting one line of real output silently moves every annotation below it and
nothing errors.

**So there are no indexes in the public shape** (`src/ui/annotatedOutput.ts`):

- a line carries its own `note`, and the presence of `note` is what makes the
  line annotated — there is no separate list of which lines to mark;
- a **run** of lines is a NESTED node that OWNS the lines it spans;
- a run's count is derived from its members and can never be passed in.

An annotation cannot point at the wrong line because it does not point at all. It
is on the line.

---

## The two directions, and the reviewer's ruling

**Annotate IN PLACE, with a box around the lines that belong together.** The
reviewer's words: *"it better highlight as box included the required content
instead of doing from the end."*

Two reasons it is right, and they are worth keeping because they are reasons and
not preferences:

1. **The claim is about a GROUP.** "Count the lines between the first and the
   last" is a sentence about a set of lines, and a box is the only form that
   states a group without the reader doing any pairing work. A numbered legend
   and a leader line both ask the eye to leave the output, read a label, and
   carry it back.
2. **It solves the `Mounted from` trap structurally rather than verbally.** A box
   around the three `Pushed` lines VISIBLY EXCLUDES the `Mounted from` line. A
   legend can only assert the distinction in prose and hope the room maps it back
   to the right line.

`GutterMarks` and `CalloutLines` annotate "from the end" in exactly the sense
being ruled against. **They were ruled against on that ground, not on how they
look.** They stay in the gallery because a lab that shows only the winner cannot
explain the choice, and because each has a case where it is still the better
figure (below).

### More than one box means more than one colour

Reviewer: *"use different colors if multiple highlight in a single."* Two boxes of
one hue on adjacent lines read as one box with a seam.

**The colours are non-verdict, and that is a content rule rather than a palette
preference.** This deck's palette is semantic and the room has been trained on it
all session: `success` green means "works", `warning` amber means "careful",
`danger` red means "fails" (`StatusList` is where that is fixed). `Mounted from`
is none of the three — that layer was not uploaded because the registry already
held it, which is the layer system **paying off**. Amber would tell the room to
worry about the best thing on the slide, which is a content-honesty bug (content
rule 8). The first pass of this lab used amber for it and was wrong.

So `Enclosure` takes a **named tone**, never a colour: `primary` (brand blue) and
`secondary` (teal), mapped in `BOX_TONE` in `src/ui/annotatedSurface.ts`, where
the reservation is written down so the next author cannot casually break it.

**Colour is never the only distinction.** `label` is a required prop on
`Enclosure`, and the second box is dashed rather than solid. Verified: the
`TwoEnclosures` screenshot was converted to greyscale
(`5-two-enclosures-greyscale.png`) and the two groups are still plainly separate,
by stroke and by their own labels. This is `StatusList`'s discipline — a verdict
there carries an icon AND a word — held to on a figure.

---

## The five candidates

All five take the identical `AnnotatedOutputProps` from
`src/ui/annotatedOutput.ts`, so swapping one for another is a rename. The gallery
renders one fixture five times and the only variable is the drawing.

| Candidate | The bet | Worst at |
|---|---|---|
| **`BracedRun`** | One box around the run, the run's label on the box's own edge. The claim is about a group, so the drawing makes a group claim | Saying the NUMBER. It groups the lines and names the group and then still asks the room to count them, which is exactly what slide 30's lead asks for. It also says nothing about the line it excludes: the box says "not this one" and never says why. And a NON-CONTIGUOUS group, which it cannot draw and the contract cannot express |
| **`CountBadge`** | The same box with the DERIVED COUNT on its edge instead of a phrase. The room is being walked towards a number, so hand them the number | Saying WHY the fourth line is out. It sits immediately below the box with nothing on it, so a learner who notices the gap must be told out loud, and one who does not reads four layers under a pill that says three. It also carries no vocabulary: nothing says the word "layer" comes from the Dockerfile |
| **`TwoEnclosures`** | Two boxes, two non-verdict colours: "these three travelled, this one did not", as two enclosures rather than one plus a sentence | WEIGHT. It is two claims on one panel, and content rules are one idea per slide. Session 6 splits these two claims across `c3-layers-travel` and `c3-mounted-from` ON PURPOSE, so this is the right figure for a recap and the wrong one for that pair. It is also the tightest: two boxes on adjacent lines leave 2px between them and a third box would have nowhere to go |
| `GutterMarks` *(ruled against)* | PEDAGOGY section 5 drawn literally: `01/02/03` in a gutter, the same numbers in a legend, numbers rather than colour so the pairing survives a projector and greyscale | A RUN. The gutter is line-oriented, so the three `Pushed` lines each take a number and the legend then collapses them back into one entry reading `01-03` — the figure undoing its own work. It is also the candidate that pushes the panel furthest off centre for its own furniture (52px, measured). Its best case is the opposite of this fixture: several lines that each say something DIFFERENT |
| `CalloutLines` *(ruled against)* | The oldest figure in the book. The only candidate where the annotation TOUCHES its line, so no pairing has to be learned | DENSITY, and it is visible at only three callouts. Output lines are 23px apart and a legible caption is 44px tall, so captions must be packed with a minimum gap and the leaders kink; the run's leader travels most of the panel height before reaching its line and the eye stops being able to follow it. It also costs the panel 340px of width and shoves it 340px off centre. And a run, which it can only attach to one representative member, saying "these three" in words where a box says it in geometry |

### The verdict this lab would offer

**`CountBadge` best serves the actual claim.** Slide 30's lead asks the room to
count the lines between the first and the last, and `CountBadge` is the only
candidate that both marks which lines to count and states what the count comes
to, entirely inside the panel, with `Mounted from` excluded by the box's edge
rather than by a sentence. `BracedRun` is the same figure that stops one step
short: it names the group and still leaves the counting to the room.

**`TwoEnclosures` is the one to reach for on a recap slide**, where both halves of
the story are being restated at once and the one-idea-per-slide rule is not being
broken by saying two things.

This is a recommendation, not a decision. A human picks.

---

## Full width, half width

Every candidate was built and measured at **full slide width**, which is what the
session slide needs.

- `BracedRun`, `CountBadge`, `TwoEnclosures` — **survive half width beside a
  points column.** The box adds no external width at all: it is drawn inside the
  panel's own `px-4` body padding, so the composite figure is exactly the panel.
  The one thing to check at half width is the label, which sits on the box's right
  edge over what is empty ground at full width; the fixture's output lines are
  ~20 characters, so at half width (~560px) the label still clears the text, but a
  longer line would collide and the label has no collision handling.
- `GutterMarks` — **does not survive half width.** The legend is a grid of one
  card per entry, three cards across at full width. At half width each card is
  ~180px and the labels wrap to three or four lines, or the type would have to go
  below `body-sm`, which is not allowed (below).
- `CalloutLines` — **does not survive half width.** It needs a 340px caption lane
  of its own, which is most of a half-width column before the panel gets any.

---

## Three standards this lab holds, and how they were verified


### Vertical centring, and what it says about `ContentSlide`

The reviewer's direction, which reversed an earlier one: *"in all labs the
content is top aligned i want content to be center aligned."*

**Centring needs no mechanism at all, and that is the finding.**
`ContentSlide`'s body well is `flex min-h-0 flex-1 flex-col justify-center` and
it wraps a child in a `RevealGroup` and a `Reveal`, both content-height blocks.
So a figure handed to it is content-height, becomes the centred flex item, and
lands with equal gaps above and below without being asked to.

The corollary is the half worth knowing: **`ContentSlide` can centre a figure and
cannot top-align one.** An earlier pass of this lab wanted a fixed top datum,
`h-full` did nothing (a percentage height resolves against those two
content-height wrappers), and a `minHeight: 439` assertion faked it. That fake is
deleted. Related and separate: **a figure cannot see the well's height from
inside it**, which is why the video-reserve threshold below is a measured
constant rather than a computation. If a third lab has now found the same thing,
`ContentSlide`'s well is the actual problem and it should be fixed there rather
than worked around per figure.

**Measured, every content slide, composite figure inside the well:**

| slide | composite height | top gap | bottom gap | vertical skew | panel top on stage |
|---|---|---|---|---|---|
| incumbent | 239 | 99.9 | 99.9 | **0.0** | 324.9 |
| `BracedRun` | 280 | 79.5 | 79.5 | **0.0** | 304.5 |
| `CountBadge` | 280 | 79.5 | 79.5 | **0.0** | 304.5 |
| `TwoEnclosures` | 280 | 79.5 | 79.5 | **0.0** | 304.5 |
| `GutterMarks` | 377 | 31.1 | 31.1 | **0.0** | 256.1 |
| `CalloutLines` | 280 | 79.5 | 79.5 | **0.0** | 304.5 |
| smallest annotation set (`GutterMarks`) | 377 | 31.1 | 31.1 | **0.0** | 256.1 |
| PowerShell chrome (`CountBadge`) | 279 | 80.0 | 80.0 | **0.0** | 305.0 |

The well is at y=217 and 439px tall on all nine, so every figure is exactly
centred and every panel top is well clear of the instructor-video floor at y=220.

#### The video reserve under centring

Centring frees a tall figure UPWARD, and the well opens at y=217, which is
already 3px inside the reserve. So `FIGURE_VIDEO_GUARD` (8px) is applied as
**equal padding top and bottom**: equal padding leaves the centring exact and
still guarantees the panel starts that far below the figure's own top edge.

The real threshold is arithmetic, and it is in the contract as
`FIGURE_MAX_CENTRED_H`: centred top is `217 + (439 - H) / 2`, so a composite
taller than **425px** would centre into the reserve. The tallest candidate here is
`GutterMarks` at 377px. **Nothing needs clamping**, and `node video-safe.mjs`
prints CLEAN. A future candidate that exceeds 425px must be shortened rather than
clamped, because a clamped figure is no longer centred and centred is what was
asked for.

#### Two behaviours re-checked under centring

**A wrapping lead now moves the figure by HALF the line it adds, downward.**
Measured: with `BracedRun`'s lead forced to two lines, the well moved down 33px
and shrank 33px, and the panel went from 304.5 to **321.0** — plus 16.5, exactly
half, with the vertical skew still 0.0. Under the deleted top datum the same
change moved it the same 16.5px but for the wrong reason (an asserted minHeight
overflowing a shorter well).

**So the advice about one-line leads changes.** It is no longer a correctness
rule: the movement is half-size and it is *away* from the video reserve, so a
wrapping lead is safe. Leads stay one line in this gallery for a weaker reason —
so that five candidates can be compared without their panels sitting at five
different heights for a reason that has nothing to do with the drawing.

**Dropping a legend entry does NOT move the panel.** Slide 8 is the same
`GutterMarks` with the smallest annotation set the contract allows, and its
composite is 377px, identical to slide 6. The legend is a single grid row whose
height is set by its tallest card, so losing one of three entries costs no
height. Slide 8 is therefore weaker evidence than it was designed to be: to move
a centred figure the apparatus has to change its HEIGHT, not its content. The
enclosure candidates cannot be moved this way at all, because a box drawn inside
the panel adds neither width nor height.

### Horizontal centring, measured rather than eyeballed

`node center-check.mjs` reports both axes: the left and right gap of the
outermost figure wrapper AND of the panel inside it. Over 24px of skew is off
centre.

```
incumbent        figure L76/R76  skew 0.0    panel L76/R76  skew 0.0
BracedRun        figure L76/R76  skew 0.0    panel L76/R76  skew 0.0
CountBadge       figure L76/R76  skew 0.0    panel L76/R76  skew 0.0
TwoEnclosures    figure L76/R76  skew 0.0    panel L76/R76  skew 0.0
GutterMarks      figure L46/R46  skew 0.0    panel L98/R46  skew 52.0
CalloutLines     figure L0/R0    skew 0.0    panel L0/R340  skew 340.0
PowerShell       figure L76/R76  skew 0.0    panel L76/R76  skew 0.0
```

**Every composite figure is dead centre on both axes.** But the two
ruled-against candidates shove the PANEL — the thing the room is actually
reading — off centre by their own furniture: 52px for the gutter, 340px for the
caption lane. **The enclosure candidates keep both centred, because a box drawn
inside the panel adds no external width**, and the switch to vertical centring
did not change that: the enclosure adds no height either, so it is the only
direction whose composite bounding box is exactly the panel's on both axes. That
is a real advantage of the direction and not a side effect, and it is measurable,
which is why the check is committed rather than described.

### Nothing meaningful below the kit's smallest body token

`body-sm` is 16px and it is the floor for every label, legend entry, caption and
badge in every candidate. The legend explains the panel, so it can never be
harder to read than the 14px monospace it explains.

This cost `CalloutLines` real height — its caption cards are 44px and 70px to
hold 16px type over two lines, which is most of what forces the leaders to kink.
That cost is recorded as a finding against the candidate rather than paid for by
shrinking the type.

---

## The departure from PEDAGOGY section 5, for a human to settle

`PEDAGOGY_GUIDELINES.md` section 5 currently prescribes `01/02/03` numbered
callouts for exactly this job and records the corpus doing it 25 times. **The
enclosure direction departs from that guideline**, and `GutterMarks` — the
candidate that implements the guideline literally — is the one ruled against.

The reasoning for the departure is the group-versus-individual-lines argument
above: numbered callouts pair a label to ONE line, and the claim on the slide that
fails today is about a run of lines. Where each callout genuinely names a
different line, section 5 is still right and `GutterMarks` is still the figure.

**`PEDAGOGY_GUIDELINES.md` was not edited.** That file is owned elsewhere and a
rule change needs the user's confirmation. This section exists so a human can
decide whether the guideline should be amended to distinguish the two cases.

---

## Two other things found while building the lab

**`Terminal` cannot be annotated from outside, and did not have to be changed.**
The candidates render the kit's `Terminal` unmodified — both chromes, all four
line kinds — and lay their apparatus out around it. That works because of one
observation: `Terminal`'s body is `px-4 py-3.5` with `lineHeight: 1.65` in BOTH
chromes, and only its HEADER differs between them. So a line's distance from the
panel's TOP depends on the chrome and its distance from the BOTTOM does not.
**Every box and badge in this lab is positioned from the panel's bottom edge**,
which needs two constants and no measurement, and is correct in both chromes.
Slide 9 is the proof: the same `CountBadge`, drawn on a standalone PowerShell
window, with the box still on the three `Pushed` lines. Without that trick a
winner would have to fork the panel or the kit would have to expose its line
geometry.

**A pill on a one-line box bursts out of it.** A solid label pill is 34px tall and
one output line is 23px, so `TwoEnclosures`' first render put a dashed pill
through a dashed box border in both directions and the result read as a rendering
fault. `EnclosureLabel`'s `quiet` fill is the fix: the same 16px, the same accent,
bare bold text with no chrome of its own to overflow. It is also the right
register for a group being excluded. Related, and already recorded in
`comparison-lab`: a label that sits ON a rule must be OPAQUE, which is why the
`primary` pill is a solid lit surface rather than a tint.

---

## Harness results

```
npx tsc -b --noEmit     clean
node video-safe.mjs     CLEAN: nothing is placed in the reserved video area
node align-check.mjs    0 of 10 slides need attention
node center-check.mjs   CENTRED, both axes, clear of the video reserve
                        (three slides carry a PANEL-off-centre finding by design)
node qa.mjs             2 slides flagged, both the documented baseline:
                        slide 1 (BrandSlide, mark on stage + decorative blobs)
                        slide 10 (Thank you, mark on stage)
```

`align-check.mjs` flags a token wrapped across two lines, which is what a long
repository name does in a narrow panel. **Nothing was flagged**, including
`CalloutLines`' 812px panel, because the fixture's longest line is the 67-character
`The push refers to repository [...]` at 14px monospace. A narrower panel or a
longer repository name would flag, and the fix is a wider panel or a shorter
fixture, never type below 13px.

Screenshots, all at 1280x720 with a 2600ms settle, live at
`/home/nxtwave/.claude/jobs/170bacfd/tmp/annotated/`.
