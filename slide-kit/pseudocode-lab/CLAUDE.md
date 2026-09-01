# Pseudocode explanation lab

**AWAITING A DECISION.** Candidate designs for explaining an algorithm written as
pseudocode. The user picks what is worth keeping and those get promoted into
`slide-kit/slide-template`; the rest stay here as the record of what lost.

**Not a session.** The fourth lab inside the kit, after `flow-lab`,
`flowchart-lab` and `features-lab`, built to the same rules.

```bash
npx vite --port 5224 --strictPort
npx tsc -b --noEmit
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs && node video-safe.mjs && node align-check.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`.

---

## Why this lab is separate from `projectcode-lab`

They look like one problem and are two. **Pseudocode explanation is about ONE
algorithm**: what does this logic do, and what happens when it runs.
**Project-code explanation is about MANY FILES**: where does this live, what calls
it, what must be true elsewhere for this line to make sense.

A trace table answers the first and is useless for the second. A file map answers
the second and is useless for the first. One winner cannot serve both.

## What is wrong with putting pseudocode through `CodeBlock`

`CodeBlock` is a FILE view, and two of its features actively mislead:

1. **A filename says "create this file".** Pseudocode is never a file. It is what
   you write BEFORE there is one.
2. **A language chip names a language.** The entire point of pseudocode is that it
   is none of them.

And the thing pseudocode most needs, it cannot do at all: there is nowhere to say
what a line MEANS, and nowhere to show what happens when the algorithm runs.

## The trace table is not a decoration

The established device for explaining an algorithm is the **trace table**, also
called a dry run: one column per variable, one row per executed step, filled in as
the algorithm proceeds, often tracking the line number and the output too. It is
standard in school and college computing because it turns "what does this do" into
something a room can watch happen.

That is why `trace` is a first-class field on the contract rather than something a
variant invents.

## The variants

| Variant | The argument | Worst at |
|---|---|---|
| `TraceTable` | the canonical dry run, one row per click, with the pseudocode line lighting at the same instant | runs out of columns and says so rather than shrinking; eight clicks makes it the slowest here to present |
| `LineAnnotated` | the per-line note, which is what `CodeBlock` structurally cannot hold | cannot show a VALUE, so "line 4 is true only once in three" stays a claim in prose |
| `PseudoToReal` | the bridge, with each real line positioned at the y of the pseudocode line it implements | draws a one-to-one map only, and the right column is mostly air when the code is shorter |

## The fixture's trace is real, and that matters

Every row was worked through by hand against `[3, 9, 4]`. **A fabricated trace
table is the exact failure this lab designs against:** the figure would look right
and teach something false, and no harness in this repo could tell.

The algorithm is "largest number in a list" because it is the smallest one that
still has a variable that changes, a loop, a branch that is sometimes taken and
sometimes not, two levels of indentation, and an honest edge case. And because
nobody has to be taught it, so no attention goes on the example instead of the
layout.

## A figure that explains an absence has to explain the RIGHT absence

`PseudoToReal`'s first pass printed "the indentation already closed the block"
against every unmapped line. That is exactly right for `END IF` and `END FOR`, and
simply untrue for line 1, `INPUT numbers`: nothing closed a block there. `INPUT`
has no counterpart because it names what the algorithm is GIVEN, which in Python is
a parameter, not a statement.

So the reason is derived from what the line IS. Getting this wrong is worse than
leaving it blank, because the figure states a false rule about the language while
looking authoritative.

The alignment itself is authored rather than inferred for the same reason: a
variant pairing by index would put `print(largest)` against `END IF`.

## Rules inherited from the sibling labs

- Every label is a DOM element, never an SVG `<text>`. Content rule 17.
- Padding is a floor, not a declaration: a box shows `(box height - content
  height) / 2`, so a declared 12px becomes 0 or negative once content outgrows it.
- Every part is a click-gated build step. `Ctrl+arrow` steps and plain arrows
  change slide, unless `S` has swapped the pair. Beat 0 is free and carries the
  pseudocode block, because the room must see the algorithm before anything is
  claimed about it.
- No literal durations except the hover popover, which is the UI tier.
- The hover popover is never in the DOM unless open.
- `indent` is DRAWN at 18px a level, never spaces inside `text`.

## Verification

All three harnesses, three slides: video-safe CLEAN, qa ALL CLEAN, align-check
0 of 3.
