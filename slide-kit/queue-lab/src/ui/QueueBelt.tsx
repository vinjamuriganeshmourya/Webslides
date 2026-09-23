import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { litBadge, litCard } from '@/ui/annotatedSurface'
import { FcArrowDefs, FcEdgeDraw, FcEdgeLabel, FcNodeIn, useBeats } from '@/ui/figures/motion'
import type { QueueFigureProps } from './queueFigure'

/**
 * QUEUE BELT. One left-to-right lane, read as a conveyor: the job at the far
 * left, a bounded waiting lane in the middle, and the executor slots stacked at
 * the right end where the belt runs out.
 *
 * THE ARGUMENT
 *
 * The four words arrive in the order the run actually meets them, along one
 * axis, and each of the four is a DIFFERENT KIND OF OBJECT rather than a fourth
 * box in a row. That is the whole claim:
 *
 *   - the job is a dashed card that never moves and never divides. It is the
 *     definition, and dashed-on-white is this lab's established "not the thing
 *     that flows" mark (`ReachChain`'s `beyond` state uses the same device)
 *   - the trigger is an ARROW carrying its own words, so the arrival is drawn as
 *     an event and not as a stage
 *   - the queue is a WELL with a hairline border and a label, holding small
 *     numbered tickets. It is a container, and its inside edge is what says that
 *     waiting happens in a place
 *   - the executors are FRAMED SLOTS, stacked across the belt's end rather than
 *     laid along it, because they are a fixed resource consuming from one line
 *     and not two more steps of a sequence
 *
 * It is also the shape Jenkins itself puts on screen. The dashboard carries a
 * `Build Queue` panel and a `Build Executor Status` panel with a `0/2` count,
 * and this figure names both panels the same way and prints the same fraction,
 * so a learner who opens Jenkins after the session meets a drawing they have
 * already read. Stacking the slots vertically is what makes the CAPACITY
 * countable at a glance: two frames, one holding a run and one empty, and the
 * empty one is empty rather than dimmed, so "free" is a state you can see rather
 * than a shade you have to interpret.
 *
 * WHAT IT IS WORST AT
 *
 * Time. The belt is a spatial axis that a reader will also read as a clock, and
 * the figure has no way to say that the two waiting tickets are not moving right
 * now. A viewer can leave with the impression that a queue is a slow pipe every
 * run passes through, rather than a line that only moves when a slot frees up,
 * because nothing here draws the DEPENDENCY between the free slot and the front
 * ticket. The `#3 next in line` note is words doing a job the geometry does not
 * do. A candidate that draws the pull from the slot back to the queue front
 * would say that better, at the cost of a connector that crosses the belt.
 *
 * Second: the finished column is the weakest part. It reads as "the belt
 * continues past the executors", which is a lie about where a build result
 * lives, and its arrow leaves the executor PANEL rather than either slot,
 * because runs leave from whichever slot happens to hold them and picking one
 * would claim an order the fixture does not have.
 *
 * GEOMETRY
 *
 * A fixed 1080px-wide stage. Every column sits on one horizontal axis, `AXIS`,
 * which is the centre line of the executor stack, so the three connectors are
 * collinear and the row reads as a single belt.
 *
 *   columns   JOB 0..196, trigger gap to 340, QUEUE 340..616, feed gap to 690,
 *             EXEC 690..906, done gap to 958, DONE 958..1080. The gaps are the
 *             arrows, and each is wide enough to carry a stroke plus its
 *             arrowhead without touching either card.
 *   SLOT_H    100, which is a 20px name row plus a 48px body plus 12px of pad
 *             top and bottom. The body is sized by the busy case (a number
 *             badge beside a two-word note on one line), so the empty frame is
 *             exactly the same box with nothing in it.
 *   tickets   laid out RIGHT TO LEFT inside the well, so `queue[0]`, the front
 *             of the line, sits nearest the executors. The contract says the
 *             array is ordered and the front is first; drawing it the other way
 *             round would claim a different queue discipline.
 *
 * THE HEIGHT ARITHMETIC, because the well is 439px and a caption goes under it
 *
 *   LABEL_H 24 + LABEL_GAP 8 + 2 slots x SLOT_H 100 + 1 x SLOT_GAP 14 = 246
 *   caption, when one is passed: CAP_GAP 16 + CAP_H 22                 =  38
 *                                                                  total 284
 *
 * 284px against a 400px ceiling. The executor stack is the only column that can
 * grow, and it grows by 114px per slot: three executors lands at 360 + 38 = 398,
 * which still fits, and FOUR does not. Four executors is not this course's
 * story anyway, Jenkins ships with two, but a caller who passes four gets a
 * figure that runs into the caption rather than a figure that silently clips, so
 * the number is stated here.
 */

/* Columns. Stated as edges rather than widths, because every one of them is
   read off the two arrows either side of it more often than off its own box. */
const STAGE_W = 1080
const JOB_L = 0
const JOB_W = 196
const QUEUE_L = 340
const QUEUE_W = 276
const EXEC_L = 690
const EXEC_W = 216
const DONE_L = 958
const DONE_W = STAGE_W - DONE_L

const LABEL_H = 24
const LABEL_GAP = 8

const SLOT_H = 100
const SLOT_GAP = 14

const JOB_H = 96
const WELL_PAD = 14
const TICKET_H = 84
const TICKET_GAP = 12
const HINT_H = 16
const WELL_H = WELL_PAD + TICKET_H + 6 + HINT_H + WELL_PAD
const DONE_H = 84
const DONE_GAP = 8

const CAP_GAP = 16
const CAP_H = 22

/** Inset from a card's edge to a connector's end, so no stroke touches a border. */
const STUB = 8

const ARROWS = 'qb'

export function QueueBelt({
  job,
  trigger,
  queue,
  executors,
  done,
  caption,
  className = '',
}: QueueFigureProps) {
  /*
    FOUR BEATS, AND A FIFTH ONLY WHEN THERE IS SOMETHING FINISHED TO SHOW.

    job, then trigger, then queue, then executors: the order a run meets them,
    which is also the order the four words get spoken. `done` is last because it
    is the one part of the figure the session can do without, and `useBeats`
    takes the count from props rather than from state so the number of claimed
    steps is stable for as long as the slide is up.
  */
  const hasDone = Boolean(done && done.length)
  const shown = useBeats(hasDone ? 5 : 4)

  const stackH = executors.length * SLOT_H + Math.max(0, executors.length - 1) * SLOT_GAP
  const STACK_T = LABEL_H + LABEL_GAP
  const AXIS = STACK_T + stackH / 2
  const H = STACK_T + stackH + (caption ? CAP_GAP + CAP_H : 0)

  const wellT = AXIS - WELL_H / 2
  const jobT = AXIS - JOB_H / 2
  const busy = executors.filter((e) => e.running).length

  const doneList = done ?? []
  const doneStackH = doneList.length * DONE_H + Math.max(0, doneList.length - 1) * DONE_GAP
  const doneT = AXIS - doneStackH / 2

  const ticketW =
    queue.length > 0
      ? (QUEUE_W - 2 * WELL_PAD - (queue.length - 1) * TICKET_GAP) / queue.length
      : QUEUE_W - 2 * WELL_PAD

  const JobIcon = iconByName[job.icon ?? 'settings']

  return (
    <figure className={`relative mx-auto ${className}`} style={{ width: STAGE_W, height: H }}>
      {/* THE THREE CONNECTORS. One aria-hidden SVG holds the lines, because a
          line is geometry; every word on this figure is a real element above it,
          per content rule 17. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-0 top-0"
        width={STAGE_W}
        height={H}
        viewBox={`0 0 ${STAGE_W} ${H}`}
      >
        <FcArrowDefs
          id={ARROWS}
          colors={{ trigger: colors.brand, feed: colors.brandDeep, done: colors.body }}
        />
        {/* The trigger. Full weight and the brand hue: it is the event that
            creates a run, and it is the first thing the room is told. */}
        <FcEdgeDraw
          d={`M ${JOB_L + JOB_W + STUB} ${AXIS} L ${QUEUE_L - STUB - 2} ${AXIS}`}
          at={1}
          shown={shown[1]}
          stroke={colors.brand}
          markerEnd={`url(#${ARROWS}-trigger)`}
        />
        {/* The feed. Arrives with the executors, because a run only leaves the
            line when a slot takes it, and drawing it earlier would say the
            queue empties on its own. */}
        <FcEdgeDraw
          d={`M ${QUEUE_L + QUEUE_W + STUB} ${AXIS} L ${EXEC_L - STUB - 2} ${AXIS}`}
          at={3}
          shown={shown[3]}
          stroke={colors.brandDeep}
          markerEnd={`url(#${ARROWS}-feed)`}
        />
        {hasDone && (
          /* Out of the PANEL, not out of a slot. See the header note. */
          <FcEdgeDraw
            d={`M ${EXEC_L + EXEC_W + STUB} ${AXIS} L ${DONE_L - STUB - 2} ${AXIS}`}
            at={4}
            shown={shown[4]}
            stroke={colors.body}
            markerEnd={`url(#${ARROWS}-done)`}
          />
        )}
      </svg>

      {/* THE JOB. Dashed, white, no shadow: the one card on the belt that is not
          cargo. It does not move and it does not divide. */}
      <FcNodeIn
        at={0}
        shown={shown[0]}
        className="absolute"
        style={{ left: JOB_L, top: jobT, width: JOB_W, height: JOB_H }}
      >
        <div
          className="flex h-full flex-col justify-center gap-1 rounded-xl px-4"
          style={{ background: colors.white, border: `2px dashed ${colors.muted}` }}
        >
          <div className="flex items-center gap-2">
            <span className="grid shrink-0 place-items-center" style={{ color: colors.body }}>
              <JobIcon width={18} height={18} />
            </span>
            <span
              className="font-heading font-bold"
              style={{ fontSize: 17, lineHeight: 1.2, color: colors.ink }}
            >
              {job.label}
            </span>
          </div>
          {job.caption && (
            <span style={{ fontSize: 14, lineHeight: 1.3, color: colors.body }}>{job.caption}</span>
          )}
          <span
            className="font-heading font-bold uppercase"
            style={{ fontSize: 12, lineHeight: 1.2, letterSpacing: '0.08em', color: colors.muted }}
          >
            The job
          </span>
        </div>
      </FcNodeIn>

      {/* THE TRIGGER'S WORDS, on their own element, sitting above the arrow. */}
      <FcEdgeLabel
        at={1}
        shown={shown[1]}
        className="absolute flex items-end justify-center"
        style={{
          left: JOB_L + JOB_W,
          top: AXIS - 44,
          width: QUEUE_L - (JOB_L + JOB_W),
          height: 34,
        }}
      >
        <span
          className="rounded-pill px-3 py-1 text-center font-heading font-bold"
          style={{ fontSize: 14, lineHeight: 1.2, ...litBadge(colors.brand) }}
        >
          {trigger}
        </span>
      </FcEdgeLabel>

      {/* THE BUILD QUEUE. A bounded well: a hairline border and a label, so the
          waiting has an inside and an outside. */}
      <FcNodeIn
        at={2}
        shown={shown[2]}
        className="absolute"
        style={{ left: QUEUE_L, top: wellT - LABEL_H - 6, width: QUEUE_W }}
      >
        <PanelLabel name="Build Queue" count={`${queue.length} waiting`} />
        <div
          className="relative rounded-xl2"
          style={{
            height: WELL_H,
            background: colors.surface,
            border: `1px solid ${colors.line}`,
          }}
        >
          {queue.map((run, i) => (
            <div
              key={run.id}
              className="absolute flex flex-col justify-center gap-1 rounded-xl px-3"
              style={{
                /* RIGHT TO LEFT: index 0 is the front of the line and the front
                   of the line is the ticket nearest the executors. */
                left: WELL_PAD + (queue.length - 1 - i) * (ticketW + TICKET_GAP),
                top: WELL_PAD,
                width: ticketW,
                height: TICKET_H,
                ...litCard(colors.brand),
              }}
            >
              <span
                className="font-heading font-bold"
                style={{ fontSize: 18, lineHeight: 1.1, color: colors.ink }}
              >
                {run.label}
              </span>
              {run.note && (
                <span style={{ fontSize: 14, lineHeight: 1.25, color: colors.body }}>
                  {run.note}
                </span>
              )}
            </div>
          ))}
          {queue.length > 1 && (
            /* The one thing the geometry cannot say for itself: which end is the
               front. Right aligned, under the ticket it is about. */
            <div
              className="absolute text-right"
              style={{
                left: WELL_PAD,
                right: WELL_PAD,
                top: WELL_PAD + TICKET_H + 6,
                height: HINT_H,
                fontSize: 13,
                lineHeight: 1.2,
                color: colors.muted,
              }}
            >
              front of the line is on the right
            </div>
          )}
        </div>
      </FcNodeIn>

      {/* THE EXECUTORS. Stacked ACROSS the belt's end, so the capacity is a
          count and not a length. */}
      <div className="absolute" style={{ left: EXEC_L, top: 0, width: EXEC_W }}>
        <FcNodeIn at={3} shown={shown[3]} style={{ height: LABEL_H + LABEL_GAP }}>
          <PanelLabel name="Build Executor Status" count={`${busy}/${executors.length} busy`} />
        </FcNodeIn>
        {executors.map((slot, i) => (
          <FcNodeIn
            key={slot.id}
            at={3}
            shown={shown[3]}
            className="absolute"
            style={{
              left: 0,
              top: STACK_T + i * (SLOT_H + SLOT_GAP),
              width: EXEC_W,
              height: SLOT_H,
            }}
          >
            <div
              className="flex h-full flex-col gap-2 rounded-xl2 px-3 py-3"
              style={{
                background: colors.white,
                border: `1px solid ${colors.line}`,
                boxShadow: `0 3px 10px -6px ${colors.brandDeep}59`,
              }}
            >
              <span
                className="font-heading font-bold uppercase"
                style={{
                  fontSize: 13,
                  lineHeight: 1.2,
                  letterSpacing: '0.06em',
                  color: colors.ink,
                }}
              >
                {slot.label}
              </span>
              {slot.running ? (
                <div
                  className="flex flex-1 items-center gap-2 rounded-xl px-3"
                  style={litCard(colors.brandDeep)}
                >
                  <span
                    className="rounded-pill px-2 py-0.5 font-heading font-bold"
                    style={{ fontSize: 15, lineHeight: 1.2, ...litBadge(colors.brandDeep) }}
                  >
                    {slot.running.label}
                  </span>
                  {slot.running.note && (
                    <span style={{ fontSize: 14, lineHeight: 1.2, color: colors.body }}>
                      {slot.running.note}
                    </span>
                  )}
                </div>
              ) : (
                /*
                  FREE IS AN EMPTY FRAME, AND IT IS THE SAME BOX AS THE BUSY ONE.

                  Not a dimmed copy of a running slot: `isolation-lab` recorded
                  that opacity reads as "present but unimportant", and the count
                  of free slots is the reason the queue is or is not moving. So
                  the frame stays at full strength and its INSIDE is empty, with
                  the one word that names the state.
                */
                <div
                  className="flex flex-1 items-center justify-center rounded-xl"
                  style={{ border: `2px dashed ${colors.line}` }}
                >
                  <span
                    className="font-heading font-bold uppercase"
                    style={{
                      fontSize: 13,
                      lineHeight: 1.2,
                      letterSpacing: '0.08em',
                      color: colors.muted,
                    }}
                  >
                    Free
                  </span>
                </div>
              )}
            </div>
          </FcNodeIn>
        ))}
      </div>

      {/* FINISHED RUNS, past the executors, carrying the verdict. Green and red
          appear here and nowhere else on the figure. */}
      {hasDone && (
        <FcNodeIn
          at={4}
          shown={shown[4]}
          className="absolute"
          style={{ left: DONE_L, top: doneT - LABEL_H - 6, width: DONE_W }}
        >
          <PanelLabel name="Finished" />
          {doneList.map((run, i) => {
            const paint = run.verdict === 'success' ? colors.success : colors.danger
            return (
              <div
                key={run.label}
                className="flex flex-col justify-center gap-1 rounded-xl px-3"
                style={{
                  height: DONE_H,
                  marginTop: i === 0 ? 0 : DONE_GAP,
                  ...litCard(paint),
                }}
              >
                <span
                  className="font-heading font-bold"
                  style={{ fontSize: 18, lineHeight: 1.1, color: colors.ink }}
                >
                  {run.label}
                </span>
                <span
                  className="font-heading font-bold uppercase"
                  style={{ fontSize: 12, lineHeight: 1.2, letterSpacing: '0.08em', color: paint }}
                >
                  {run.verdict === 'success' ? 'Passed' : 'Failed'}
                </span>
                {run.note && (
                  <span style={{ fontSize: 13, lineHeight: 1.2, color: colors.body }}>
                    {run.note}
                  </span>
                )}
              </div>
            )
          })}
        </FcNodeIn>
      )}

      {/*
        THE CAPTION IS RENDERED, because the contract offers one and a string
        that is never in the DOM cannot overflow, wrap or drift, so no harness
        would ever catch it going missing. `ThreeLanes` had to drop it and made
        that a typecheck error instead; this figure has the 38px, so it prints.
      */}
      {caption && (
        <figcaption
          className="absolute text-center"
          style={{
            left: 0,
            right: 0,
            top: STACK_T + stackH + CAP_GAP,
            height: CAP_H,
            fontSize: 16,
            lineHeight: 1.25,
            color: colors.body,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * A panel's name, and its count on the same line.
 *
 * Both panels are labelled the same way on purpose: `Build Queue` and `Build
 * Executor Status` are the two headings Jenkins prints on its own dashboard, and
 * the `1/2 busy` fraction is the same reading as the dashboard's `0/2`.
 */
function PanelLabel({ name, count }: { name: string; count?: string }) {
  return (
    <div
      className="flex items-baseline justify-between"
      style={{ height: LABEL_H, marginBottom: 6 }}
    >
      <span
        className="font-heading font-bold uppercase"
        style={{ fontSize: 14, lineHeight: 1.2, letterSpacing: '0.06em', color: colors.brandDeep }}
      >
        {name}
      </span>
      {count && (
        <span style={{ fontSize: 13, lineHeight: 1.2, color: colors.body }}>{count}</span>
      )}
    </div>
  )
}
