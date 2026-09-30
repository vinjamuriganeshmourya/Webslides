import { FcEdgeDraw, FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveChange, type ChangeFigureProps } from './changeFigure'
import {
  Cell,
  Dimension,
  PhaseHead,
  ProblemPanel,
  SetCaption,
  StateNote,
  afterSurface,
  beforeSurface,
  toneOf,
} from './changeChrome'
import { colors } from '@/design/tokens'

/**
 * STATE ARROW — two panels with an arrow drawn between them, the before state
 * flat and the after state raised.
 *
 * THE ARGUMENT: THE DIRECTION IS DRAWN, NOT IMPLIED
 *
 * Left-to-right ordering alone does not say "this became that". It says "these
 * two things, in this order", which is also what a comparison says, and a room
 * that has just seen a comparison slide will read the next one the same way.
 *
 * Two things here make the direction explicit, and neither is decoration:
 *
 *   **The arrow**, which draws itself from the before panel toward the after
 *   panel over 600ms on its own click. It is the one element `comparison-lab`
 *   is forbidden to have, and the reason the two are separate labs.
 *
 *   **The tone step.** The before panel is flat: a tinted ground, no shadow, no
 *   accent. The after panel is white with an accent edge and a soft shadow, so
 *   it sits above the surface the before panel is part of. Weight carries the
 *   direction even in a photograph of the slide with the arrow cropped out.
 *
 * WHY THE PANELS ARE THE SAME WIDTH BUT NOT THE SAME WEIGHT
 *
 * Linia's survey notes that *"most layouts use equal column space"*, and equal
 * TREATMENT is what makes those slides read as "two states, pick one", which is
 * a comparison and not a change. Equal WIDTH is right, because both states have
 * the same amount to say and shrinking the before panel would make the change
 * look bigger than it is. Equal weight is wrong.
 *
 * WHY THE STATE NOTE IS THE BIGGEST THING IN THE PANEL
 *
 * This variant carries the change AS A WHOLE, which means the sentence that says
 * what kind of thing each state was is the content and the rows are supporting
 * evidence. "A deploy is an event someone schedules" against "a deploy is a
 * consequence of merging" is the entire lesson, and it appears in none of the
 * rows. So the note sits directly under the label in the tone, and the rows are
 * set small underneath it.
 *
 * WHAT IT IS WORST AT
 *
 * **Three dimensions, and that is the ceiling.** Each panel is 528px and the
 * rows inside it are stacked, so a fourth dimension pushes the panels past the
 * content well. A change with five named dimensions has nowhere to go here and
 * belongs on `DeltaRows`.
 *
 * Second, **it shows no per-dimension delta.** The two panels are read as
 * wholes, so "40 minutes" and "6 minutes" sit in different panels with no place
 * between them to put the 34. That number is often the most persuasive thing on
 * the slide, and this arrangement structurally cannot hold it.
 */
export function StateArrow({
  before,
  after,
  during,
  rows = [],
  beforeWasBroken,
  caption,
  width = 1152,
  className = '',
}: ChangeFigureProps) {
  const g = resolveChange({ before, after, during, rows, beforeWasBroken })

  /*
    BEFORE, THEN THE ARROW, THEN AFTER, then the caption. Four beats, and beat 0
    is free. See the choreography note in `motion.tsx`: the room already lives in
    the before state, so opening on it costs nothing.
  */
  const ARROW = 1
  const AFTER = 2
  const CAPTION = 3
  const shown = useBeats(CAPTION + 1)

  const ARROW_ZONE = 96
  const panel = Math.round((width - ARROW_ZONE) / 2)

  const problems = [...g.problems]
  /*
    THREE ROWS. Each panel is 528px wide with 48px of padding, and a row inside
    it is a 17px dimension label plus a cell, about 62px stacked. The panel also
    carries a head, a note and its own padding, which is about 150px before any
    rows. Four rows puts the panel at roughly 400px against a content well of
    about 417 once the head and caption are counted, and the caption goes behind
    the deck controls. `DeltaRows` holds five because its rows are horizontal.
  */
  if (g.rows.length > 3) {
    problems.push(
      `${g.rows.length} dimensions stacked inside a ${panel}px panel; this arrangement holds three, and five wants DeltaRows`,
    )
  }
  /*
    A MIDDLE PHASE CANNOT BE DRAWN HERE.

    Two panels and one arrow is the shape; a third panel makes the arrow two
    arrows and each panel 320px, which is not enough for a note and a row. The
    three-phase change is a real thing and this is not the figure for it, so the
    refusal names that rather than pretending.
  */
  if (during) {
    problems.push(
      'a middle state needs three panels and two arrows, which leaves 320px each; this variant draws two states',
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const broken = Boolean(beforeWasBroken && before.tone === 'risk')
  const beforePaint = toneOf(before.tone, 'muted')
  const afterPaint = toneOf(after.tone, 'brand')

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <div
        className="grid items-stretch"
        style={{ gridTemplateColumns: `${panel}px ${ARROW_ZONE}px ${panel}px` }}
      >
        {/* THE BEFORE PANEL. `pt-4` on the figure's first row is the
            instructor-video clearance every full-width figure in these labs
            needs: the reserved rectangle is x913..1280, y0..220. */}
        <FcNodeIn at={0} shown={shown[0]} className="relative">
          <div className="flex h-full flex-col p-6" style={beforeSurface(broken)}>
            <PhaseHead
              label={before.label}
              gloss={before.gloss}
              icon={before.icon}
              paint={beforePaint}
              dim
            />
            {before.note && (
              <span className="mt-3 block">
                <StateNote paint={colors.body}>{before.note}</StateNote>
              </span>
            )}
            {g.rows.length > 0 && (
              <div className="mt-auto space-y-3 pt-5">
                {g.rows.map((r) => (
                  <div key={r.id}>
                    <Dimension>{r.dimension}</Dimension>
                    <span className="mt-0.5 block">
                      <Cell state="before" size="sm">
                        {r.before}
                      </Cell>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FcNodeIn>

        {/* THE ARROW. Centred in its own column so neither panel has to know it
            is there, and vertically centred against both. */}
        <div className="grid place-items-center">
          <FcEdgeDraw
            at={ARROW}
            shown={shown[ARROW]}
            width={ARROW_ZONE - 24}
            paint={afterPaint}
          />
        </div>

        <FcNodeIn at={AFTER} shown={shown[AFTER]} className="relative">
          <div className="flex h-full flex-col p-6" style={afterSurface(afterPaint)}>
            <PhaseHead
              label={after.label}
              gloss={after.gloss}
              icon={after.icon}
              paint={afterPaint}
            />
            {after.note && (
              <span className="mt-3 block">
                <StateNote paint={afterPaint}>{after.note}</StateNote>
              </span>
            )}
            {g.rows.length > 0 && (
              <div className="mt-auto space-y-3 pt-5">
                {g.rows.map((r) => (
                  <div key={r.id}>
                    <Dimension>{r.dimension}</Dimension>
                    <span className="mt-0.5 block">
                      <Cell state="after" size="sm">
                        {r.after}
                      </Cell>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FcNodeIn>
      </div>

      {caption && (
        <FcEdgeLabel at={CAPTION} shown={shown[CAPTION]} className="block">
          <SetCaption width={width}>{caption}</SetCaption>
        </FcEdgeLabel>
      )}
    </figure>
  )
}
