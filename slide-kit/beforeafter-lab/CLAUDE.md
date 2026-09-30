# Before and after lab

Two ways of showing one thing changing into another, behind one prop contract, so
the user can pick what is worth keeping and the winner gets promoted into the
kit. Nothing in here is a session. The deck renders variants and nothing else.

Second of six comparison labs. **Read `comparison-lab/CLAUDE.md` first.** This
lab is shaped against that one, and the differences are the reason it is separate
rather than two more variants over there.

## Why this is not `comparison-lab` with different labels

An A-vs-B figure has two SUBJECTS. This one has one subject at two TIMES, and
three things follow that a comparison contract cannot express:

1. **It is directional.** `docker run` does not become `docker compose up`, so a
   comparison must never draw an arrow between its two sides. Deploying by hand
   does become deploying from a pipeline, so this one must. `FcEdgeDraw` was
   deleted from `comparison-lab`'s motion module with a note saying this lab
   would need it back, and it is back. **That primitive is the line between the
   two labs.** If you want an arrow in a comparison, the figure belongs here.
2. **The two sides are not equals.** Symmetry is honest in a comparison, where
   neither option is the answer. Here the after state is where the room is being
   taken, and identical treatment says "two states, pick one", which is a
   comparison.
3. **A row can carry a delta.** Forty minutes against six has a third fact in it
   that neither cell states, and it is usually the most persuasive thing on the
   slide.

## The rule this lab most exists to enforce: before is muted, not red

Every template house paints this figure green and red. Linia's colour-coded
variant is explicit: *"Red (release) vs. Green (adopt)"*.

In a lecture that is usually a lie, and an expensive one. **The before state is
generally not wrong.** It is earlier, or simpler, or what you do before you know
about the better tool, and half the time it is exactly what the previous slide
taught. Painting it red says the last lesson was a mistake.

So `muted` is the default, and the only way to get `risk` on a before state is to
pass `beforeWasBroken`. The flag is separate from the tone deliberately: the
paint is a claim, and a claim gets made once, on purpose, at the call site where a
reviewer can see it rather than buried in a tone string.

**The rule is not that the before state is never bad.** Slide 3 is the case where
`risk` is earned: storing passwords in plain text was wrong at the time and is
wrong now, and painting it neutral grey would be polite about something that
should not be treated politely.

Note what stays unchanged even there. The after panel is brand blue and not green,
the arrow is the same arrow, and **the only green anywhere in the lab is the delta
chip**, which is arithmetic rather than a verdict.

## The variants

| Variant | The argument | Worst at |
|---|---|---|
| `StateArrow` | the direction is DRAWN, not implied. An arrow draws itself from the before panel to the after panel on its own click, and the tone steps from a flat tinted ground to a raised white card, so the weight carries the direction even in a photograph with the arrow cropped out. The state note is the largest text in each panel, because this variant carries the change as a whole and "a deploy is an event someone schedules" against "a deploy is a consequence of merging" is the entire lesson and appears in none of the rows | three dimensions is the ceiling, since rows stack inside a 528px panel; and it has nowhere to put a per-dimension delta, because the two values sit in different boxes and the number belongs between them |
| `DeltaRows` | the change is kept next to the thing that changed: one row per dimension, each with its own before, its own arrow, its own after and the number between them. Put five dimensions in two panels and every before is 500px from its own after with four unrelated facts in between, and the reader does the pairing. The only figure in either lab with somewhere to put the delta | it shows no overall shape, so five individually small changes read as five small changes even when the point is that the whole thing is now a different kind of system. That sentence is the state `note`, and this variant has nowhere to put it |

Slides 1 and 2 render the **identical fixture** through both, which is what makes
them a comparison rather than two demos. Slide 4 is the content `DeltaRows` exists
for and `StateArrow` refuses by name.

## The delta is the one place these labs break their own all-or-none rule

Every sibling refuses a set where some items carry an optional field and others do
not, because the hole reads as an abandoned edit. A delta is different: **most
dimensions genuinely have no number.** Demanding one for "Who can do it" is how a
deck ends up with `x1.4` beside a claim about people.

So a partial delta column is allowed and must not look broken, which is why
`deployFixture` has one delta in three rows and `migrationFixture` has three in
five. Only an empty delta string is refused, because that is the abandoned edit.

## The checks worth knowing

**A row that says the same thing on both sides** is the single most likely mistake
in this figure and the reason the resolver exists. It draws two cells and an arrow
between them, and the room reads "this changed too" because the entire frame says
change. Nothing about the output disagrees. It comes from copying a cell across
while editing, so the check compares trimmed lowercase strings rather than exact
duplicates.

**A delta must contain a digit.** The first version of this check refused a
trailing full stop or more than three words, and `much faster now` walked straight
through both: three words, no punctuation, fifteen characters. It rendered as a
neat green pill that looked exactly like a measurement, which is worse than no
chip at all, because a pill in the delta column is read as a number whatever it
says. Requiring a digit is the honest test.

**An icon name that is not in the kit's set.** Found by looking at the screenshot:
this lab's own fixture asked for `unlock`, the house set has `lock` and `unlink`
and no `unlock`, and the panel simply drew no glyph. The head still laid out
correctly, the text was real, the box was the right size, and all three harnesses
passed it. A missing glyph on one of two panels reads as an abandoned edit.

## The 4px top border on the before panel is alignment, not decoration

The after panel carries a 4px accent edge. Without a matching border the before
panel's box was 3px shorter at the top, and the two phase heads sat 3px apart on
a figure whose whole job is putting two states side by side. Visible in the
render, invisible to all three harnesses, which measure boxes and have no opinion
about two boxes that should agree.

It is set in `colors.line` rather than transparent, so the before panel reads as
closed on all four sides instead of open at the top.

## Rules inherited from the sibling labs

- **Every piece of text is real DOM.** An `<svg>` is one rectangle to all three
  harnesses. The arrow is `aria-hidden` and carries no text; its direction is
  already stated by the two labels either side of it. Content rule 17.
- **Every `FcNodeIn` is passed `absolute` or `relative`.** `.fc-node-slot`'s
  `z-index` is ignored on a static element. `pseudocode-lab` shipped without it.
- **Stacked slots pass `style={{ height: 'auto' }}`.** `FcNodeIn` hard-codes
  `h-full` for `StateArrow`'s stretching grid, and `comparison-lab` recorded what
  that costs in a stack: the first slot absorbs the leftover space and everything
  below it moves. It has to be inline, since `h-auto` in `className` has the same
  specificity and which wins depends on Tailwind's emit order.
- **Click-gated beats, count derived from props and never from state.** Beat 0 is
  free and carries the before state, which is the right thing to give away: the
  room already lives there. The hook is claimed BEFORE the `ProblemPanel` early
  return.
- **Before, then the arrow, then after**, one click each. Landing both states
  together and then drawing the arrow shows the destination before the room has
  understood what is being left; landing after first is simply backwards. The
  arrow's beat is where the instructor says "and then we did this".
- **Timings come from `figureTiming.ts`.** Entrances 520ms on a 130ms stagger,
  draws 600ms.
- **No hover.** A deck is projected into a room where nobody has a pointer.
- **A figure that refuses beats a figure that renders something unreadable.**
  Slide 5 renders the refusal rather than describing it, because a refusal nobody
  has seen is a refusal nobody trusts.

## Verification

```bash
npx tsc --noEmit -p tsconfig.app.json
npx vite --port 5230 --strictPort          # the harnesses need it already running
export CHROME_PATH=/usr/bin/brave-browser  # /opt/google/chrome/chrome is not on this machine
node video-safe.mjs    # CLEAN
node qa.mjs            # ALL CLEAN
node align-check.mjs   # 0 of 5 slides need attention
```

Current state: **video-safe CLEAN, qa ALL CLEAN, align-check 0 of 5.**

Three things to know before reading that output:

- **`qa.mjs` prints the literal string `ALL 44 CLEAN`** whatever the deck's slide
  count is. It is hardcoded in the kit's own harness, line 96, and every lab
  reports it. It means zero issues, not forty-four slides.
- **`tsc --noEmit -p tsconfig.app.json` is NOT clean.** It reports two errors in
  `src/export/slideModule.tsx`, which imports the generated `./deckCss` and
  `./revealSteps`. Both are gitignored and neither is in the repo. Every lab here
  reports the identical two. **Two errors is the baseline; anything else is
  yours.**
- **The single-file build works without the `tsc -b` step**, which is what
  `npm run build:html` fails on:

  ```bash
  npx vite build -c vite.singlefile.config.ts \
    && node scripts/inline-assets.mjs && node scripts/inline-fonts.mjs
  ```

  Then `node preview.mjs && node scripts/build-preview-page.mjs`, which read
  `dist-single/` and so need that build to have run first.

## Nothing here is promoted

Two variants, neither in the kit. Hard rule 14 wants the user's approval before a
layout moves into `src/ui/`, and a lab is where that decision gets made, not where
it gets assumed. The procedure is section 6 of
`.claude/skills/generate-slides/SKILL.md`.
