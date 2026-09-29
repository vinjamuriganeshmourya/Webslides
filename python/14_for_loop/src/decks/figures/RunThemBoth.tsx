import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { CodeBlock } from '@/ui'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * VOTE, THEN RUN. TWO CANDIDATES, TWO EMPTY PANES, ONE PRESS.
 *
 * WHY IT EXISTS. The reference builds this frame as a commitment device: `n` is
 * a number the room can move with a stepper, both `range` expressions re-read
 * themselves from it, both output panes stay EMPTY, and nothing resolves until
 * the instructor presses `Run them both` after counting two shows of hands. The
 * rebuild collapsed all of that into a single reveal, so the room read the
 * answer instead of committing to a guess, and a predict-then-run activity with
 * nothing to predict against is just a slide.
 *
 * THE PANES ARE EMPTY ON ARRIVAL, and moving `n` empties them again. A room that
 * can see one answer while it is being asked to guess the other has already been
 * told.
 *
 * THE OUTPUT IS A REAL RUN (course rule R3). `print("* " * counter)` is
 * `'* '.repeat(counter)`, trailing space and all, and the rows are generated
 * from the same `range` bounds the panels show, so the two cannot disagree
 * whatever `n` the room picks.
 *
 * DOM, never SVG (content rule 17). Colours from tokens, timing from the scale.
 */

/**
 * THE STEPPER'S BOUNDS, AND WHY THE PANES NEVER CHANGE SIZE.
 *
 * The star program prints ONE ROW PER PASS, so a pane that sizes itself to its
 * own output grows as `n` grows: at n = 5 it pushed the Run button and the line
 * under it off the bottom of the frame and over the player's own controls. The
 * panes are sized ONCE, from `PANE_H`, and never move whatever the room picks.
 *
 * WHAT CHANGES INSTEAD IS THE LEADING, not the glyph size. `qa.mjs` enforces a
 * 16px type floor on every rendered string and the reason is on the harness: a
 * line of output nobody at the back can read has not been printed. So the rows
 * stay at 16px at every `n` and the space BETWEEN them closes up, which buys the
 * sixth row without taking the output below the floor.
 *
 * AND IF IT STILL WILL NOT FIT, THE PANE SAYS SO. `LEADING` is a ramp with a
 * floor of its own, so a value of `n` whose output is taller than the pane
 * prints what fits and then says plainly that the rest is not on this frame.
 * Silently clipping a program's output is the one thing a card about what a
 * program prints may not do.
 */
const MIN_N = 1
const MAX_N = 6

/** The pane, fixed. Sized so that MAX_N rows fit at the tightest leading. */
const PANE_H = 114
const PANE_PAD = 12

/** Row pitch by `n`. 16px glyphs throughout; only the gap between rows closes. */
const leadingFor = (n: number) => (n <= 4 ? 22 : n === 5 ? 19 : 17)

/** `for counter in range(lo, hi): print("* " * counter)`, exactly as CPython runs it. */
const rows = (lo: number, hi: number) => {
  const out: string[] = []
  for (let counter = lo; counter < hi; counter += 1) out.push('* '.repeat(counter))
  return out
}

export function RunThemBoth({
  filename,
  className = '',
}: {
  /** Content rule 31a: the language, never an invented file name. */
  filename: string
  className?: string
}) {
  const instant = useInstant()
  const [n, setN] = useState(4)
  const [ran, setRan] = useState(false)

  const move = (d: number) => {
    setN((v) => Math.min(MAX_N, Math.max(MIN_N, v + d)))
    setRan(false)
  }

  const a = rows(1, n)
  const b = rows(1, n + 1)

  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-3">
        <span className="font-mono text-[22px] font-bold leading-none" style={{ color: colors.ink }}>
          n =
        </span>
        <span
          className="inline-flex h-[42px] w-[54px] items-center justify-center rounded-card font-mono text-[24px] font-bold leading-none"
          style={{ background: colors.surface2, color: colors.brandDark }}
        >
          {n}
        </span>
        <Stepper label="one less" glyph={'−'} onClick={() => move(-1)} enabled={n > MIN_N} />
        <Stepper label="one more" glyph="+" onClick={() => move(1)} enabled={n < MAX_N} />
      </div>

      <div className="grid grid-cols-2 gap-7">
        <Candidate
          letter="A"
          tone={colors.danger}
          expr={`range(1, ${n})`}
          code={'n = int(input())\nfor counter in range(1, n):\n    print("* " * counter)'}
          filename={filename}
          out={ran ? a : []}
          ran={ran}
          leading={leadingFor(n)}
        />
        <Candidate
          letter="B"
          tone={colors.brand}
          expr={`range(1, ${n} + 1)`}
          code={'n = int(input())\nfor counter in range(1, n + 1):\n    print("* " * counter)'}
          filename={filename}
          out={ran ? b : []}
          ran={ran}
          leading={leadingFor(n)}
        />
      </div>

      {/* THE BUTTON AND THE LINE SHARE ONE ROW. Stacked they cost forty pixels
          this frame has already spent on two code panels and two output panes.
          The bar is the same bar before and after the press: first the
          instructor's own line, which was in `notes:` where the room cannot see
          it and which is what turns two code panels into a vote, then the
          verdict the run produced. */}
      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setRan(true)}
          disabled={ran}
          className="shrink-0 rounded-pill px-5 py-2.5 font-heading text-body font-bold"
          style={{ background: colors.brand, color: colors.white, opacity: ran ? 0.4 : 1 }}
        >
          Run them both
        </button>
        <div
          className="flex min-h-[46px] flex-1 items-center rounded-card border-l-4 bg-surface px-5 py-2"
          style={{ borderColor: ran ? colors.brand : colors.warning }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {ran ? (
              <motion.p
                key="verdict"
                className="text-body leading-snug"
                initial={instant ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: T.enter, ease: c4(E.out) }}
              >
                <span className="font-heading font-bold" style={{ color: colors.ink }}>
                  B is right.{' '}
                </span>
                <span style={{ color: colors.body }}>
                  A printed {a.length} {a.length === 1 ? 'row' : 'rows'} and stopped before {n}, so the last row never printed.
                </span>
              </motion.p>
            ) : (
              <motion.p
                key="vote"
                className="text-body leading-snug"
                initial={instant ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: T.enter, ease: c4(E.out) }}
              >
                <span className="font-heading font-bold" style={{ color: colors.ink }}>
                  Hands up for A. Now hands up for B.{' '}
                </span>
                <span style={{ color: colors.body }}>Count both before you press Run.</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Candidate({
  letter,
  tone,
  expr,
  code,
  filename,
  out,
  ran,
  leading,
}: {
  letter: string
  tone: string
  expr: string
  code: string
  filename: string
  out: string[]
  ran: boolean
  /** Row pitch for the current `n`, so both panes stay in step. */
  leading: number
}) {
  const instant = useInstant()
  /* HOW MANY ROWS THE PANE CAN HOLD AT THIS PITCH. Whatever is over that is not
     drawn small, and it is not clipped in silence: the pane says what happened
     and where the rest of it is. */
  const capacity = Math.floor((PANE_H - PANE_PAD) / leading)
  const shown = out.slice(0, capacity)
  const cut = out.length - shown.length
  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-card font-heading text-body font-bold leading-none"
          style={{ background: `${tone}1F`, color: tone, boxShadow: `inset 0 0 0 1.5px ${tone}55` }}
        >
          {letter}
        </span>
        <span className="font-mono text-body font-bold leading-none" style={{ color: tone }}>
          {expr}
        </span>
      </div>
      <CodeBlock filename={filename} showLineNumbers={false} fontSize={16} code={code} />
      <div className="mt-2 overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
        <div
          className="overflow-hidden px-4 py-2 font-mono text-[16px] text-ink"
          style={{ height: PANE_H, lineHeight: `${leading}px` }}
        >
          {shown.map((line, i) => (
            <motion.div
              key={i}
              className="whitespace-pre"
              initial={instant ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: T.label, ease: c4(E.out), delay: i * T.stagger }}
            >
              {line}
            </motion.div>
          ))}
          {/* A run that printed NOTHING is a result, not a blank pane. At n = 1
              range(1, 1) is empty and A really does print nothing, which is the
              same fact the exit question turns on. */}
          {ran && out.length === 0 && (
            <div className="whitespace-pre" style={{ color: colors.muted }}>
              nothing printed
            </div>
          )}
          {cut > 0 && (
            <div className="leading-snug" style={{ color: colors.danger }}>
              Not enough room to print all of it here. Run it in the playground to see the rest.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Stepper({
  label,
  glyph,
  onClick,
  enabled,
}: {
  label: string
  glyph: string
  onClick: () => void
  enabled: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={!enabled}
      className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-card bg-white font-heading text-[20px] font-bold leading-none"
      style={{
        color: colors.ink,
        boxShadow: `inset 0 0 0 1.5px ${colors.line}`,
        opacity: enabled ? 1 : 0.38,
      }}
    >
      {glyph}
    </button>
  )
}
