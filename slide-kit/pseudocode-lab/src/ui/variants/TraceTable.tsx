import { useId, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { E, c4 } from '@/ui/figureTiming'
import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import {
  resolvePseudo,
  type PseudoFigureProps,
  type PseudoLine,
  type PseudoLineKind,
  type TraceStep,
} from './pseudoFigure'

/**
 * TRACE TABLE — the pseudocode on the left, the dry run filling in on the right.
 *
 * THE ARGUMENT
 *
 * This is the device the teaching literature actually asks for, and the reason
 * this lab exists. A trace table is a table with one column per variable and one
 * row per executed step, filled in as the algorithm proceeds. It is standard in
 * school and college computing because it turns "what does this do" into
 * something a room can WATCH HAPPEN rather than be told.
 *
 * So the figure is one click per row. The row lands, and the pseudocode line it
 * came from lights up at the same instant, which is the only way the two halves
 * read as one explanation instead of a table parked next to some code. Nothing on
 * this slide is a decoration on top of the pseudocode: the table IS the second
 * half of the sentence the pseudocode starts.
 *
 * THE CONTRAST THAT DOES THE TEACHING
 *
 * A row where a value CHANGES is drawn differently from a row where the branch
 * declined and nothing moved: tinted ground, a full-weight left rule, a filled
 * dot in the delta column, and the moved value in a brand pill. A held row is
 * white, ruled in `line`, marked with a bar rather than a dot, and its values are
 * muted.
 *
 * That contrast is the whole point, and the fixture is built to exercise it: line
 * 4 runs three times against [3, 9, 4] and only the middle one is true. A trace
 * table where every row looks like a change teaches that a loop keeps changing
 * things, which is the opposite of what the branch is for.
 *
 * WHY NOT `CodeBlock`
 *
 * Because there is nowhere in a file view to put a trace, and because a filename
 * plus a language chip on pseudocode says "create this file in this language",
 * which is exactly what the learner must not do yet. See the header of
 * `pseudoFigure.ts`.
 *
 * WHAT IT IS WORST AT
 *
 * **It runs out of columns, and it says so rather than shrinking.** The table's
 * inner width is 484px, of which 170px is the line, delta and output columns, so
 * the variables share 314px. Three variables get 104px each, which comfortably
 * holds the fixture's widest value, "[3, 9, 4]" at 70px. Five variables get 62px
 * each, and that value no longer fits at any padding. The figure pushes a problem
 * instead of drawing a clipped table, but a five-variable algorithm simply is not
 * this figure's job.
 *
 * It also runs out of ROWS at seven. A dry run of a loop over ten items is
 * thirty rows, and the honest answer there is a shorter input, not a smaller
 * font: a trace table nobody at the back can read has stopped being a teaching
 * device. Both limits are checked, not hoped for.
 *
 * Second failure, and the one to watch in review: **it is the slowest figure in
 * the lab to present.** Eight clicks, and every one of them needs a sentence
 * spoken over it. On a slide where the trace is not the point, `LineAnnotated`
 * says the same thing in half the time.
 *
 * GEOMETRY, AND THE PADDING ARITHMETIC
 *
 * A fixed 1100x396 figure on the 1280x720 slide. Two panels of 348px, 560 and
 * 516 wide, with a 24px gap: 560 + 24 + 516 = 1100.
 *
 * PADDING IS A FLOOR, NOT A DECLARATION. What a box shows is `(box height -
 * content height) / 2`, so every number below is the measured result, not the
 * class name:
 *
 *   - Pseudocode panel. Content is a 22px header plus its 12px margin, plus 8
 *     rows of 34: 22 + 12 + 272 = 306. Real vertical padding (348 - 306) / 2 =
 *     **21px**, against a declared floor of 14.
 *   - Trace panel. Content is 22 + 12 header, a 30px column-header row, and 7
 *     rows of 36: 34 + 30 + 252 = 316. Real padding (348 - 316) / 2 = **16px**.
 *   - A code row is 34px around 15px mono on 1.35 leading (20.25px), so **6.8px**
 *     above and below. A trace cell is 36px around 13px mono on 1.35 (17.5px), so
 *     **9.2px**.
 *   - Horizontal. The pseudocode panel's inner width is 560 - 32 = 528, and the
 *     fixture's longest line, "SET largest TO first item of numbers" at 36
 *     characters of 15px mono (9px per character), needs 324 plus a 26px gutter
 *     and a 10px gap: 360. 168px spare, which is what lets a deep `indent` draw
 *     rather than wrap.
 *   - The caption sits at y 360 and is 26px tall, clearing the panels by 12.
 *
 * Every one of those arithmetic checks is also run at render against the actual
 * props, and a failure becomes a listed problem. The sibling lab shipped four
 * cards at 0px of real padding and one at -7px, all of them declaring 12px,
 * because the numbers were only ever in a comment.
 */

/* Stage. */
const W = 1100
const H = 396
const PANEL_H = 348
const PSEUDO_W = 560
const GAP = 24
const TRACE_W = 516

/* Padding floors. A panel is sized so these are honoured, never assumed. */
const PAD_X = 16
const PAD_Y = 14
const HEADER_H = 22
const HEADER_GAP = 12

/* Rows. */
const CODE_ROW_H = 34
const TRACE_ROW_H = 36
const COL_HEAD_H = 30
const INDENT = 18

/* Type metrics, used for the width arithmetic above and re-checked at render. */
const MONO_15 = 9
const MONO_13 = 7.8
const GUTTER = 26
const GUTTER_GAP = 10

/* Trace columns. */
const COL_LINE = 48
const COL_DELTA = 22
const COL_OUT = 100
const CELL_PAD_X = 8

const TRACE_INNER = TRACE_W - PAD_X * 2 /* 484 */
const PSEUDO_INNER = PSEUDO_W - PAD_X * 2 /* 528 */
const CODE_ROOM = PSEUDO_INNER - GUTTER - GUTTER_GAP /* 492 */
const ROW_CAP = Math.floor((PANEL_H - PAD_Y * 2 - HEADER_H - HEADER_GAP - COL_HEAD_H) / TRACE_ROW_H)
const LINE_CAP = Math.floor((PANEL_H - PAD_Y * 2 - HEADER_H - HEADER_GAP) / CODE_ROW_H)

/**
 * What a line DOES, in paint. The contract carries `kind` so a variant never has
 * to parse the pseudocode, and this is the whole use of it: one hue per kind, so
 * the loop and the branch are findable in the block without reading it.
 */
const KIND_PAINT: Record<PseudoLineKind, string> = {
  io: colors.info,
  assign: colors.brand,
  branch: colors.accentDark,
  loop: colors.tealDark,
  call: colors.brandDark,
  return: colors.success,
  plain: colors.muted,
}

const paintOf = (l: PseudoLine | undefined) => KIND_PAINT[l?.kind ?? 'plain']

/** Which variables moved on this step. The only thing the row styling turns on. */
function changedKeys(step: TraceStep, prev: TraceStep | undefined): string[] {
  return Object.keys(step.vars).filter((k) => (prev?.vars[k] ?? '') !== step.vars[k])
}

/**
 * The hover aside, lifted in principle from `flowchart-lab`'s `NodeShell`.
 *
 * Three rules it exists to keep, all three learned the hard way next door:
 *
 *   1. **Never in the DOM unless open.** `qa.mjs`, `video-safe.mjs` and
 *      `align-check.mjs` measure static rectangles, so a panel parked at
 *      `opacity: 0` is measured, and reported as overflowing the frame, every
 *      single run. `AnimatePresence` keeps it out of the tree.
 *   2. **The lift is CSS, the popover is framer.** `.fc-node--hoverable` in
 *      `index.css` owns a 160ms transition, which retargets mid-flight; a
 *      keyframe or a JS tween restarts from zero and makes a quick pointer sweep
 *      across the table look broken.
 *   3. **The slot is what gets raised, not the popover.** `FcNodeIn` animates
 *      `transform`, which creates a stacking context, so a `z-index` in here
 *      cannot escape it. `.fc-node-slot:has(.fc-node--hoverable:hover)` in
 *      `index.css` does the raising, which is why every hoverable thing in this
 *      figure sits inside an `FcNodeIn`.
 *
 * The 180ms is the documented UI-tier exception to this lab's timing scale. A
 * hover is triggered deliberately and repeatedly by the presenter while they wait
 * for an answer, so the figure's explanatory 520ms would feel broken here.
 */
function HoverNote({
  note,
  title,
  paint,
  side,
  className = '',
  style,
  children,
}: {
  note?: ReactNode
  title: string
  paint: string
  side: 'top' | 'bottom'
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const id = useId()
  const has = Boolean(note)

  return (
    <div
      className="relative h-full w-full"
      onPointerEnter={() => has && setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <div
        className={`fc-node h-full w-full ${has ? 'fc-node--hoverable' : ''} ${className}`}
        style={style}
        aria-describedby={open ? id : undefined}
      >
        {children}
      </div>
      <AnimatePresence>
        {open && note && (
          <motion.span
            id={id}
            role="tooltip"
            className="pointer-events-none absolute right-2 z-30 block w-[300px] rounded-card border border-line bg-white px-3.5 py-3 text-left text-[12.5px] leading-snug shadow-float"
            style={{
              color: colors.body,
              [side === 'top' ? 'bottom' : 'top']: 'calc(100% + 8px)',
              transformOrigin: side === 'top' ? 'bottom right' : 'top right',
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.96)' }}
            animate={{ opacity: 1, transform: 'scale(1)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.98)' }}
            transition={{ duration: 0.18, ease: c4(E.out) }}
          >
            <span
              className="mb-1 block font-heading text-[11px] font-bold uppercase tracking-wide"
              style={{ color: paint }}
            >
              {title}
            </span>
            {note}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Input this figure cannot draw, said out loud.
 *
 * `resolvePseudo` reports the meaning problems (a step running a line that does
 * not exist, a variable missing from `vars`) and this figure adds its own
 * GEOMETRY problems, because a table with 62px variable columns is not a smaller
 * table, it is a wrong one. Drawing either of them silently is the failure mode
 * this lab is designed against: the figure would look right and teach something
 * false.
 */
function ProblemPanel({ problems }: { problems: string[] }) {
  return (
    <figure className="relative mx-auto" style={{ width: W, height: H }}>
      <div
        className="h-full w-full rounded-card bg-white px-6 py-5"
        style={{ border: `2px solid ${colors.danger}` }}
      >
        <span
          className="mb-3 block font-heading text-[13px] font-bold uppercase tracking-wide"
          style={{ color: colors.danger }}
        >
          This trace cannot be drawn as authored
        </span>
        <ul className="space-y-1.5">
          {problems.map((p) => (
            <li key={p} className="text-body-sm" style={{ color: colors.ink }}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}

export function TraceTable({
  title,
  lines,
  vars,
  trace,
  caption,
  className = '',
}: PseudoFigureProps) {
  const g = resolvePseudo({ lines, vars, trace })

  /*
    THE GEOMETRY CHECKS, RUN AGAINST THE ACTUAL PROPS.

    Each of these is one of the numbers stated in the doc comment, re-derived from
    the content rather than trusted. The sibling lab's padding was wrong in every
    single variant for exactly as long as the numbers lived only in a comment.
  */
  const colVar = Math.floor((TRACE_INNER - COL_LINE - COL_DELTA - COL_OUT) / Math.max(1, g.vars.length))
  const widestVar = Math.max(
    0,
    ...g.trace.flatMap((s) => Object.values(s.vars).map((v) => v.length)),
  )
  const widestCode = Math.max(
    0,
    ...g.lines.map((l) => l.text.length * MONO_15 + (l.indent ?? 0) * INDENT),
  )

  /*
    BEATS. Beat 0 is free and it is the pseudocode block itself: the room must see
    the algorithm, whole and unclaimed, before a single value is asserted about
    it. Then one click per trace row, so the table fills the way the algorithm
    runs, and one for the caption.

    Derived from props, never from state, so the count registered with the deck's
    Stepper is stable for as long as the slide is up.

    CLAIMED BEFORE THE PROBLEM PANEL CAN RETURN, because `useBeats` is a hook and
    a hook behind an early return is a hook that appears and disappears with the
    props.
  */
  const ROW0 = 1
  const CAPTION = ROW0 + g.trace.length
  const shown = useBeats(CAPTION + 1)

  const problems = [...g.problems]
  if (g.trace.length > ROW_CAP) {
    problems.push(
      `${g.trace.length} trace rows; ${ROW_CAP} is all the panel holds at its ${PAD_Y}px padding floor`,
    )
  }
  if (g.lines.length > LINE_CAP) {
    problems.push(`${g.lines.length} pseudocode lines; the panel holds ${LINE_CAP}`)
  }
  if (g.vars.length && widestVar * MONO_13 + CELL_PAD_X * 2 > colVar) {
    problems.push(
      `${g.vars.length} variables leave ${colVar}px per column, and the widest value needs ${Math.ceil(widestVar * MONO_13 + CELL_PAD_X * 2)}px`,
    )
  }
  if (widestCode > CODE_ROOM) {
    problems.push(
      `the longest pseudocode line needs ${Math.ceil(widestCode)}px and the code column is ${CODE_ROOM}px`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} />

  /* Which line the room is looking at: the one the last landed row ran. */
  const landed = g.trace.filter((_s, i) => shown[ROW0 + i])
  const activeLine = landed.length ? landed[landed.length - 1].line : -1

  return (
    <figure className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      {/* THE PSEUDOCODE. Not a file view: no filename, no language, no traffic
          lights, because pseudocode is the step before there is a file. */}
      <FcNodeIn
        at={0}
        shown={shown[0]}
        className="absolute rounded-card border border-line bg-white shadow-card-soft"
        style={{ left: 0, top: 0, width: PSEUDO_W, height: PANEL_H, padding: `${PAD_Y}px ${PAD_X}px` }}
      >
        <div className="flex items-center justify-between" style={{ height: HEADER_H }}>
          <span className="font-heading text-[15px] font-bold" style={{ color: colors.ink }}>
            {title}
          </span>
          <span
            className="rounded-pill px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide"
            style={{ background: `${colors.brand}14`, color: colors.brand }}
          >
            Pseudocode
          </span>
        </div>

        <div style={{ marginTop: HEADER_GAP }}>
          {g.lines.map((l) => {
            const paint = paintOf(l)
            const on = l.n === activeLine
            return (
              <div
                key={l.n}
                className="flex items-center rounded-lg"
                style={{
                  height: CODE_ROW_H,
                  /* The active line is the only tinted thing in the panel, so
                     the eye finds it without being told where to look. */
                  background: on ? `${paint}14` : undefined,
                  borderLeft: `3px solid ${on ? paint : 'transparent'}`,
                  paddingLeft: 6,
                }}
              >
                <span
                  className="shrink-0 text-right font-mono text-[11px]"
                  style={{ width: GUTTER, color: on ? paint : colors.muted }}
                >
                  {l.n}
                </span>
                <span
                  className="whitespace-pre font-mono text-[15px] leading-[1.35]"
                  style={{
                    marginLeft: GUTTER_GAP,
                    /* INDENT IS DRAWN. Spaces inside `text` would be part of the
                       string, so they could not be measured, could not be
                       re-indented, and would break the width arithmetic above. */
                    paddingLeft: (l.indent ?? 0) * INDENT,
                    color: on ? colors.ink : colors.body,
                    fontWeight: on ? 700 : 500,
                  }}
                >
                  {l.text}
                </span>
              </div>
            )
          })}
        </div>
      </FcNodeIn>

      {/* THE TRACE TABLE. Divs rather than a `<table>`: every column width here
          is load-bearing arithmetic, and a table would renegotiate them from the
          content on the first long value. */}
      <div
        className="absolute rounded-card border border-line bg-white shadow-card-soft"
        style={{
          left: PSEUDO_W + GAP,
          top: 0,
          width: TRACE_W,
          height: PANEL_H,
          padding: `${PAD_Y}px ${PAD_X}px`,
        }}
      >
        <div className="flex items-center justify-between" style={{ height: HEADER_H }}>
          <span className="font-heading text-[15px] font-bold" style={{ color: colors.ink }}>
            Trace table
          </span>
          <span
            className="rounded-pill px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide"
            style={{ background: colors.surface2, color: colors.brandDeep }}
          >
            One row per step
          </span>
        </div>

        {/* COLUMN HEADERS. Real DOM, like every other piece of text in this lab:
            an `<svg>` is one rectangle to all three harnesses, so `<text>` labels
            can overlap and pass every sweep. Content rule 17. */}
        <div
          className="flex items-end"
          style={{ height: COL_HEAD_H, marginTop: HEADER_GAP - 6, borderBottom: `1px solid ${colors.line}` }}
        >
          <span
            className="shrink-0 pb-1.5 text-[10.5px] font-bold uppercase tracking-wide"
            style={{ width: COL_LINE, color: colors.muted }}
          >
            Line
          </span>
          <span aria-hidden className="shrink-0" style={{ width: COL_DELTA }} />
          {g.vars.map((v) => (
            <span
              key={v}
              className="shrink-0 truncate pb-1.5 font-mono text-[11px] font-bold"
              style={{ width: colVar, color: colors.ink, paddingLeft: CELL_PAD_X }}
            >
              {v}
            </span>
          ))}
          <span
            className="shrink-0 pb-1.5 text-[10.5px] font-bold uppercase tracking-wide"
            style={{ width: COL_OUT, color: colors.muted, paddingLeft: CELL_PAD_X }}
          >
            Output
          </span>
        </div>

        {/* THE ROWS, one per click. */}
        <div>
          {g.trace.map((s, i) => {
            const changed = changedKeys(s, i ? g.trace[i - 1] : undefined)
            const moved = changed.length > 0
            const paint = paintOf(g.byLine[s.line])
            return (
              <FcNodeIn
                key={`${s.line}-${i}`}
                at={ROW0 + i}
                shown={shown[ROW0 + i]}
                style={{ height: TRACE_ROW_H }}
              >
                <HoverNote
                  note={s.note}
                  title={`Step ${i + 1}, line ${s.line}`}
                  paint={paint}
                  /* The first rows open downward and the last upward, so the
                     aside never leaves the top of the slide. */
                  side={i < Math.ceil(g.trace.length / 2) ? 'bottom' : 'top'}
                >
                  <div
                    className="flex h-full items-center rounded-lg"
                    style={{
                      /*
                        THE CONTRAST THAT TEACHES. A row where a value moved is
                        tinted and ruled at full weight; a row where the branch
                        declined is white and ruled in `line`. Same table, and the
                        difference between them is the lesson.
                      */
                      background: moved ? `${colors.brand}0f` : undefined,
                      borderLeft: `3px solid ${moved ? colors.brand : colors.line}`,
                    }}
                  >
                    <span
                      className="shrink-0 pl-2 font-mono text-[12.5px] font-bold"
                      style={{ width: COL_LINE - 8, color: paint }}
                    >
                      {s.line}
                    </span>
                    {/* The delta mark: filled for a change, a bar for a hold.
                        Colour alone would carry this on a good projector and
                        nothing on a bad one. */}
                    <span
                      aria-hidden
                      className="flex shrink-0 justify-center"
                      style={{ width: COL_DELTA }}
                    >
                      <span
                        className={moved ? 'h-2 w-2 rounded-full' : 'h-0.5 w-2.5 rounded-full'}
                        style={{ background: moved ? colors.brand : colors.muted }}
                      />
                    </span>
                    {g.vars.map((v) => {
                      const val = s.vars[v] ?? ''
                      const hit = changed.includes(v)
                      return (
                        <span
                          key={v}
                          className="shrink-0"
                          style={{ width: colVar, paddingLeft: CELL_PAD_X }}
                        >
                          {val ? (
                            <span
                              className="whitespace-pre rounded-md font-mono text-[13px] leading-[1.35]"
                              style={
                                hit
                                  ? {
                                      background: `${colors.brand}1f`,
                                      color: colors.brandDark,
                                      fontWeight: 700,
                                      padding: '2px 6px',
                                      marginLeft: -6,
                                    }
                                  : { color: colors.muted }
                              }
                            >
                              {val}
                            </span>
                          ) : (
                            /* Not yet set, and said so rather than left blank: a
                               blank cell reads as a value the figure forgot. */
                            <span className="font-mono text-[13px]" style={{ color: colors.line }}>
                              .
                            </span>
                          )}
                        </span>
                      )
                    })}
                    <span
                      className="shrink-0"
                      style={{ width: COL_OUT, paddingLeft: CELL_PAD_X }}
                    >
                      {s.output && (
                        <span
                          className="rounded-md px-1.5 py-0.5 font-mono text-[13px] font-bold"
                          style={{ background: `${colors.success}18`, color: colors.success }}
                        >
                          {s.output}
                        </span>
                      )}
                    </span>
                  </div>
                </HoverNote>
              </FcNodeIn>
            )
          })}
        </div>
      </div>

      {caption && (
        <FcEdgeLabel
          at={CAPTION}
          shown={shown[CAPTION]}
          className="absolute text-center text-body-sm"
          style={{ left: 0, width: W, top: PANEL_H + 12, color: colors.body }}
        >
          {caption}
        </FcEdgeLabel>
      )}
    </figure>
  )
}
