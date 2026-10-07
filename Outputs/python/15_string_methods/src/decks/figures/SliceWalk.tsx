import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Assign, Boxes, BOX, Narration, YouGet, boxX, type BoxState } from './common'

/**
 * A SLICE, WALKED ONE PRESS AT A TIME.
 *
 * PF 15 slides 7 ("One number, then two") and 10 ("A slice with a step"). The
 * string sits in its boxes the whole time; each beat says which boxes the slice
 * has taken, which it jumped over, where it is looking now (the pointer), and
 * what "you get" holds so far. The two narration lines under the figure are the
 * reference's own, one pair per press.
 *
 * Every beat is DATA, and the data is the slice's real behaviour: a beat that
 * takes a box the real slice does not take would be a lie drawn in blue.
 */
export interface SliceBeat {
  /** The expression drawn big over the boxes, or nothing yet. */
  expr?: ReactNode
  states?: Record<number, BoxState>
  /** A dashed frame round a run of boxes: "four boxes side by side". */
  frame?: [number, number]
  /** Draw the stop index as a box of its own, dashed and empty. */
  stop?: number
  /** The box the slice is looking at, marked with a pointer under it. */
  at?: number
  got: string
  lines: ReactNode[]
}

export function SliceWalk({ name, value, beats }: { name: string; value: string; beats: SliceBeat[] }) {
  const at = useBeats(beats.length)
  const b = beats[at - 1]
  const tween = useTween(420)
  const chars = [...value]
  /* The stop box is the reference's "box 7 is drawn there": a box one past the
     end, dashed and empty, with "never reached" under it in red. */
  const shown = b.stop !== undefined && b.stop >= chars.length ? [...chars, ''] : chars
  const states: Record<number, BoxState> = { ...(b.states ?? {}) }
  if (b.stop !== undefined && b.stop >= chars.length) states[b.stop] = 'never'
  const marks: Record<number, ReactNode> = {}
  if (b.stop !== undefined) marks[b.stop] = <span style={{ color: colors.danger }}>never reached</span>
  const widest = chars.length + 1
  /* The pointer hangs below the index row and takes no layout space, so a
     figure that draws one reserves its height; one that never does keeps it. */
  const pointer = beats.some((x) => x.at !== undefined)

  return (
    <>
      <div className="mx-auto flex flex-col items-start" style={{ width: widest * (BOX.lg.w + BOX.lg.gap) }}>
        {/* THE CODE: the assignment and the expression, one tight group. */}
        <Assign name={name} value={value} size={24} />
        <p
          className="mt-1 h-[44px] font-mono text-[38px] font-semibold leading-none"
          style={{ color: colors.brandDark, transition: tween, opacity: b.expr ? 1 : 0 }}
        >
          {b.expr ?? ' '}
        </p>
        {/* THE STRING, set apart from the code above it. */}
        <div className="relative mt-5" style={{ paddingBottom: pointer ? 30 : 0 }}>
          <Boxes chars={shown} states={states} size="lg" frame={b.frame} marks={marks} />
          {/* the pointer: where the slice is looking on this press. An SVG on
              transform alone, so its edges stay clean in full view and it glides
              between boxes instead of re-laying out. */}
          <svg
            aria-hidden
            viewBox="0 0 28 22"
            width="28"
            height="22"
            className="absolute left-0 block"
            style={{
              top: BOX.lg.h + 30,
              opacity: b.at === undefined ? 0 : 1,
              transform: `translate3d(${boxX(b.at ?? 0, 'lg') - 14}px, 0, 0)`,
              transition: tween === 'none' ? 'none' : `transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)`,
              willChange: 'transform',
            }}
          >
            <path d="M14 0.8 L27.2 21.2 H0.8 Z" fill={colors.brandDark} />
          </svg>
        </div>
        {/* THE RESULT, and the narration that reads it out. Up to three lines:
            content rule 36 puts each sentence on a line of its own. */}
        <div className={`${pointer ? 'mt-3' : 'mt-6'} self-center`}>
          <YouGet value={b.got} size={28} />
        </div>
        <div className="mt-3">
          <Narration lines={b.lines} size={20} />
        </div>
      </div>
      <StepControls at={at} total={beats.length} />
    </>
  )
}
