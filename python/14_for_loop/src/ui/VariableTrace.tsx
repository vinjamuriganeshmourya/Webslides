import { Fragment, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useClaimedSteps } from '@/motion/Stepper'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { CodeBlock } from './CodeBlock'
import { T, E, c4 } from './figureTiming'

/**
 * A program run one line at a time, with its variables drawn as boxes.
 *
 * THE ARGUMENT
 *
 * "Python executes the code line-by-line" is a claim about TIME, and a static
 * code panel cannot make it. This figure lights one line, shows the variable
 * box that line changed, and appends what it printed, one click per line. The
 * source PPTX of Python session 4 drew the same thing as 27 consecutive slides;
 * here each program is one slide and its lines are the build steps.
 *
 * THE BOX IS THE COURSE'S OWN ANALOGY
 *
 * Session 3 taught "variables are like containers for storing values" with a
 * glass that changes from water to juice. The box here has a lid with the name
 * on it and the value inside, and the value swaps in place when a line
 * reassigns it, which is the glass changing colour.
 *
 * STEP MODEL
 *
 * Step 0 is the code alone, nothing lit, no boxes, no output. Click `k` shows
 * `steps[k-1]`: its `line` lit, its `boxes` as the whole state after that line,
 * and its `output` as everything printed so far. `?all` and an instant jump
 * land on the last step. `useClaimedSteps` claims exactly `steps.length` build
 * steps, so the deck's step counter matches the program's line count.
 *
 * DOM, never SVG (content rule 17). Colours from tokens, timing from the scale.
 */

export interface TraceStep {
  /** 1-based line that just ran. */
  line: number
  /** The whole variable state after this line. A box missing here is not yet created. */
  boxes: { name: string; value: string }[]
  /** Everything printed so far, one entry per line. */
  output: string[]
}

function VariableBox({ name, value }: { name: string; value: string }) {
  const instant = useInstant()
  return (
    <motion.div
      layout
      className="w-[128px] overflow-hidden rounded-card border border-line bg-white text-center shadow-card-soft"
      initial={instant ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: T.enter, ease: c4(E.out) }}
    >
      <div className="border-b border-line bg-surface px-3 py-1.5">
        <span className="font-mono text-body-sm font-bold leading-none text-body">{name}</span>
      </div>
      <div className="relative grid h-[64px] place-items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="font-mono text-[30px] font-semibold leading-none"
            style={{ color: colors.brandDark }}
            initial={instant ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: T.label, ease: c4(E.out) }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/**
 * ONE SLOT, AND EVERY VALUE IT HAS HELD, in order.
 *
 * ADDITIVE AND OPT-IN (`slots`). The default rendering above shows the CURRENT
 * value only, and that is right for a program whose lines each touch a fresh
 * name. It is wrong for a loop: the whole claim of `n = n + 1` inside a `for` is
 * that one slot is written again and again, and a box that simply swaps 1 for 2
 * shows a different number, not a revisited slot. The reference draws the chain,
 * superseded values struck through, and that chain is the proof.
 *
 * A slot with no value yet reads `not set yet` rather than being absent, so the
 * room can see which names the program is about to fill.
 */
function ValueChain({ name, history }: { name: string; history: string[] }) {
  const instant = useInstant()
  return (
    <div className="flex items-center gap-2">
      <span className="w-[42px] shrink-0 text-right font-mono text-body-sm font-bold" style={{ color: colors.body }}>
        {name}
      </span>
      {history.length === 0 ? (
        <span
          className="rounded-card border border-dashed px-3 py-2 font-mono text-[13px] leading-none"
          style={{ borderColor: colors.line, color: colors.muted }}
        >
          not set yet
        </span>
      ) : (
        history.map((v, i) => {
          const current = i === history.length - 1
          return (
            <Fragment key={`${v}-${i}`}>
              {i > 0 && (
                <span className="font-mono text-[18px] leading-none" style={{ color: colors.muted }}>
                  &rarr;
                </span>
              )}
              <motion.span
                className="rounded-card border px-3 py-2 font-mono text-[20px] font-semibold leading-none"
                style={{
                  borderColor: current ? colors.brand : colors.line,
                  background: current ? `${colors.brand}14` : colors.white,
                  color: current ? colors.brandDark : colors.muted,
                  textDecoration: current ? 'none' : 'line-through',
                }}
                initial={instant ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: T.label, ease: c4(E.out) }}
              >
                {v}
              </motion.span>
            </Fragment>
          )
        })
      )}
    </div>
  )
}

export function VariableTrace({
  code,
  steps,
  location = 'Code Playground · main.py',
  className = '',
  step,
  aside,
  slots,
}: {
  code: string
  steps: TraceStep[]
  location?: string
  className?: string
  /**
   * ADDITIVE, OPT-IN. How many steps have been reached, supplied from outside.
   * A figure that wraps this trace behind beats of its own (a task card first,
   * then the run) owns the whole slide's step budget, and two claims on one
   * slide would double-count it. When this is passed the trace claims nothing.
   */
  step?: number
  /**
   * ADDITIVE, OPT-IN. Shown INSTEAD of the variables and output columns, in the
   * space they occupy. The reference's trace cards open on the worksheet task
   * before anything runs, and the code panel must not move when the task is
   * replaced by the run: same grid, same column, different right-hand side.
   */
  aside?: ReactNode
  /**
   * ADDITIVE, OPT-IN. Draw these names as VALUE CHAINS instead of single-value
   * boxes, in this order, seeded with `not set yet`. See `ValueChain`.
   */
  slots?: string[]
}) {
  const controlled = step !== undefined
  const shown = useClaimedSteps(controlled ? 0 : steps.length)
  const reached = controlled ? Math.max(0, Math.min(steps.length, step)) : shown.filter(Boolean).length
  const current = reached > 0 ? steps[reached - 1] : undefined

  /* Every value a slot has held up to `reached`, consecutive duplicates
     collapsed: a pass that leaves `total` alone must not add a second 4. */
  const chain = (name: string) => {
    const out: string[] = []
    for (const s of steps.slice(0, reached)) {
      const v = s.boxes.find((b) => b.name === name)?.value
      if (v !== undefined && v !== out[out.length - 1]) out.push(v)
    }
    return out
  }

  /* ONLY THE CODE PANEL IS CENTRED, and only in its own column.
     Centring the whole row moved the variable boxes and the output panel too,
     which was not what was asked and left the row looking like three floating
     blocks. The other two columns keep their top alignment; the panel is
     centred in the space its column was given AND fills it, because a panel
     that shrinks to its longest line reads as compressed when the column around
     it is half empty. */
  /* THE CODE PANEL MAY NOT MOVE WHILE THE PROGRAM RUNS. With the default
     `auto` middle column, the panel's width is whatever is left over after the
     variables column has sized itself to its content, so a chain that grows a
     link (or a task card handing over to the run) slid the code sideways under
     the room's eye. In `slots` mode both columns are pinned. */
  const cols = slots ? 'grid-cols-[480px_minmax(300px,auto)_1fr]' : 'grid-cols-[1.25fr_auto_1fr]'
  return (
    <div className={`grid ${cols} items-start gap-8 ${className}`}>
      <div className="flex w-full justify-center self-center">
        <CodeBlock
          className="w-full"
          code={code}
          filename={location}
          highlight={current ? [current.line] : []}
        />
      </div>

      {aside ? (
        <div className="col-span-2 self-center">{aside}</div>
      ) : (
        <>
      <div className="flex min-h-[120px] min-w-[128px] flex-col gap-4 pt-1">
        <span className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">Variables</span>
        {slots
          ? slots.map((name) => <ValueChain key={name} name={name} history={chain(name)} />)
          : current?.boxes.map((b) => <VariableBox key={b.name} name={b.name} value={b.value} />)}
      </div>

      {/* The output panel is centred in its column too, for the same reason as
          the code panel: it is the other thing the room reads, and left at the
          top of a tall cell it floated above a half-empty column. The variable
          boxes keep their top alignment, because they are a stack that grows
          downward and has to start from a fixed line. */}
      <div className="w-full self-center overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
        <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: colors.success }} />
          <span className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">Output</span>
        </div>
        {/* Padding on the wrapper, one line per element: `align-check.mjs`
            reads a padded or multi-line `<pre>` as one wrapped token. */}
        <div className="min-h-[64px] px-4 py-3 font-mono text-[17px] leading-relaxed text-ink">
          {(current?.output ?? []).map((line, i) => (
            <div key={i} className="whitespace-pre">{line}</div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  )
}
