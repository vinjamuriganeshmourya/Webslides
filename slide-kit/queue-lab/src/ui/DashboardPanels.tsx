import { colors } from '@/design/tokens'
import { litBadge, litCard } from '@/ui/annotatedSurface'
import { iconByName } from '@/ui/icons'
import { FcArrowDefs, FcEdgeDraw, FcNodeIn, useBeats } from '@/ui/figures/motion'
import type { ExecutorSlot, QueueFigureProps, QueuedRun, FinishedRun } from './queueFigure'

/**
 * DASHBOARD PANELS. The two boxes Jenkins already draws, redrawn in the deck's
 * own language.
 *
 * In the gallery this figure sits on a slide titled `How Jenkins works`, and
 * the slide BEFORE it defines the word `job` on its own. That order is not
 * decoration: this drawing names four things at once, and a room that has not
 * been told what a job is reads the top card as the first step of a pipeline
 * rather than as the saved instructions nothing ever moves.
 *
 * THE ARGUMENT, AND NO OTHER CANDIDATE IN THIS LAB HAS IT
 *
 * Jenkins puts a `Build Queue` panel and a `Build Executor Status` panel with a
 * `0/2` count at the bottom left of its own dashboard, and `queueFigure.ts` says
 * so: "the room has the real thing on screen in front of them". Every other
 * candidate teaches a shape the developer will never see again. This one teaches
 * the shape they are looking at. A developer who reads this figure can turn to
 * their own screen and find the same two boxes, in the same order, with the same
 * words on them, and the count in the header will be the same count.
 *
 * That is why the panels keep Jenkins' TITLES verbatim and nothing else. No
 * window chrome, no address bar, no imitation of Jenkins' fonts or greys: this
 * is the deck's diagram OF those panels, not a redrawn screenshot, and a fake
 * browser window would be the screenshot rule broken by hand. Surfaces come from
 * the house lit-card recipe and every colour from `@/design/tokens`.
 *
 * WHAT THE DRAWING ASSERTS
 *
 *   - the JOB is one card, above both panels, and it never enters either of
 *     them. It is the definition; the panels only ever hold runs
 *   - the TRIGGER is a plain chip next to the job, and the arrow out of it lands
 *     on the queue panel, so arrival is a movement rather than a caption
 *   - the QUEUE panel is an ordered list, position 1 at the top, because the
 *     contract says front of the line first and a queue drawn unordered is a
 *     content error
 *   - the EXECUTOR panel is a fixed list of SLOTS. A free slot is an empty
 *     dashed frame carrying the word `free`, never a dimmed copy of a busy one
 *   - the COUNT is derived. `busy/total` is counted off the `executors` array on
 *     every render, so it cannot disagree with the slots drawn under it
 *
 * WHAT IT IS WORST AT
 *
 * It does not draw the HANDOFF. The moment a slot frees and the front of the
 * line moves into it is the mechanism of the whole concept, and here it lives in
 * one sentence in the queue panel's footer instead of in the geometry. Two
 * side-by-side lists cannot show a run crossing from one to the other, which a
 * lane or a track figure can. It also has a hard capacity of its own: the row
 * arithmetic below fits TWO rows per panel, which is what Jenkins ships with and
 * what this course uses. A third queued run or a third executor pushes the stage
 * to 420px and it stops fitting the well.
 *
 * GEOMETRY, AND THE HEIGHT ARITHMETIC
 *
 * A fixed 1080-wide stage. Two columns, 500 + 40 + 540 = 1080.
 *
 *   panel interior   PAD 14 + HEADER_H 26 + HEADER_GAP 12
 *                    + rows 126 (2 x ROW_H 58 + ROW_GAP 10)
 *                    + FOOT_GAP 10 + FOOT_H 44 + PAD 14   = 246
 *   stage            JOB_H 72 + ARROW_GAP 34 + PANEL_H 246 = 352
 *   with a caption   352 + CAPTION_H 34                    = 386
 *
 * 386 against a 439px well leaves the caption its line and stays under the 400px
 * ceiling this lab works to. Both panels are drawn the same height on purpose:
 * unequal boxes would read as one panel mattering more than the other.
 */

const W = 1080
const COL_GAP = 40
const QUEUE_W = 500
const EXEC_W = W - QUEUE_W - COL_GAP

const JOB_H = 72
const TRIGGER_X = 320
const ARROW_X = TRIGGER_X + 28
const ARROW_GAP = 34
const PANEL_TOP = JOB_H + ARROW_GAP

const PAD = 14
const HEADER_H = 26
const HEADER_GAP = 12
const ROW_H = 58
const ROW_GAP = 10
const FOOT_GAP = 10
const FOOT_H = 44
const CAPTION_H = 34

const ROWS_TOP = PAD + HEADER_H + HEADER_GAP
const rowTop = (i: number) => ROWS_TOP + i * (ROW_H + ROW_GAP)

const ARROW = 'dash-arrow'

/**
 * Both panels are sized by whichever list is longer, so the pair stays level
 * without either one being told its height by hand.
 */
function panelHeight(rows: number) {
  const body = Math.max(rows, 1) * ROW_H + (Math.max(rows, 1) - 1) * ROW_GAP
  return PAD + HEADER_H + HEADER_GAP + body + FOOT_GAP + FOOT_H + PAD
}

const panelSurface = {
  background: colors.white,
  border: `1px solid ${colors.line}`,
  boxShadow: `0 6px 18px -14px ${colors.brand}59`,
}

function PanelTitle({ children }: { children: string }) {
  return (
    <div
      className="font-heading font-bold"
      style={{ fontSize: 17, lineHeight: 1.2, color: colors.ink }}
    >
      {children}
    </div>
  )
}

/** The header's right-hand pill. Its text is always computed by the caller. */
function CountPill({ children }: { children: string }) {
  return (
    <div
      className="rounded-pill px-3 font-heading font-bold tabular-nums"
      style={{ ...litBadge(colors.brand), fontSize: 15, lineHeight: '24px' }}
    >
      {children}
    </div>
  )
}

function QueueRow({ run, position }: { run: QueuedRun; position: number }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3"
      style={{ ...litCard(colors.brand), height: ROW_H }}
    >
      {/* POSITION IS DRAWN, because the order is the claim. */}
      <div
        className="flex shrink-0 items-center justify-center rounded-full font-heading font-bold tabular-nums"
        style={{
          width: 26,
          height: 26,
          fontSize: 14,
          background: colors.surface2,
          color: colors.brandDark,
        }}
      >
        {position}
      </div>
      <div
        className="font-heading font-bold tabular-nums"
        style={{ fontSize: 18, lineHeight: 1.2, color: colors.ink }}
      >
        {run.label}
      </div>
      {run.note && (
        <div style={{ fontSize: 16, lineHeight: 1.25, color: colors.body }}>{run.note}</div>
      )}
    </div>
  )
}

/**
 * One slot. Busy and free are two different OBJECTS here, not one object at two
 * opacities: `isolation-lab` recorded that opacity reads as "present but
 * unimportant", and only an empty frame reads as "nothing here".
 */
function ExecutorRow({ slot }: { slot: ExecutorSlot }) {
  const busy = slot.running
  return (
    <div className="flex items-center gap-3" style={{ height: ROW_H }}>
      <div
        className="shrink-0 font-heading font-bold"
        style={{ width: 104, fontSize: 15, lineHeight: 1.2, color: colors.body }}
      >
        {slot.label}
      </div>
      {busy ? (
        <div
          className="flex flex-1 items-center gap-3 rounded-xl px-3"
          style={{ ...litCard(colors.brand), height: ROW_H }}
        >
          <div
            className="font-heading font-bold tabular-nums"
            style={{ fontSize: 18, lineHeight: 1.2, color: colors.ink }}
          >
            {busy.label}
          </div>
          {busy.note && (
            <div style={{ fontSize: 16, lineHeight: 1.25, color: colors.body }}>{busy.note}</div>
          )}
        </div>
      ) : (
        <div
          className="flex flex-1 items-center rounded-xl px-3"
          style={{
            height: ROW_H,
            background: colors.white,
            border: `2px dashed ${colors.muted}`,
          }}
        >
          <div style={{ fontSize: 17, lineHeight: 1.25, color: colors.muted }}>free</div>
        </div>
      )}
    </div>
  )
}

/** A finished run on its way out of the panel, carrying its verdict. */
function DoneRow({ runs }: { runs: FinishedRun[] }) {
  const Arrow = iconByName.arrow
  return (
    <div className="flex items-center gap-3" style={{ height: FOOT_H }}>
      <div
        className="shrink-0 font-heading font-bold"
        style={{ width: 104, fontSize: 15, lineHeight: 1.2, color: colors.body }}
      >
        leaves the slot
      </div>
      <Arrow width={18} height={18} style={{ color: colors.muted }} />
      {runs.map((r) => {
        const paint = r.verdict === 'success' ? colors.success : colors.danger
        return (
          <div key={r.label} className="flex items-center gap-2">
            <div
              className="rounded-pill px-3 font-heading font-bold tabular-nums"
              style={{
                fontSize: 15,
                lineHeight: '24px',
                color: colors.white,
                background: paint,
              }}
            >
              {r.label} {r.verdict === 'success' ? 'passed' : 'failed'}
            </div>
            {r.note && (
              <span style={{ fontSize: 15, lineHeight: 1.25, color: colors.body }}>{r.note}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function DashboardPanels({
  job,
  trigger,
  queue,
  executors,
  done,
  caption,
  className = '',
}: QueueFigureProps) {
  const shown = useBeats(4)

  /*
    DERIVED, NEVER PASSED. `busy/total` is counted off the array that draws the
    slots, so the header cannot claim `1/2` above two busy rows. The contract's
    note on `ExecutorSlot` is explicit that the capacity is the array's length
    and is never inferred from anything else.
  */
  const total = executors.length
  const busy = executors.filter((e) => e.running !== undefined).length

  const PANEL_H = panelHeight(Math.max(queue.length, executors.length))
  const H = PANEL_TOP + PANEL_H

  const last = queue[queue.length - 1]
  const arrivalLabel = last ? `${last.label} joins the back of the line` : 'straight into a slot'

  const JobIcon = job.icon ? iconByName[job.icon] : undefined

  return (
    <figure className={`mx-auto ${className}`} style={{ width: W }}>
      <div className="relative" style={{ width: W, height: H }}>
        {/* THE CONNECTOR IS THE ONLY SVG, and it carries no text: every label in
            this figure is its own element, per content rule 17. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
        >
          <FcArrowDefs id={ARROW} colors={{ line: colors.brandDark }} />
          <FcEdgeDraw
            d={`M ${ARROW_X} ${JOB_H - 14} L ${ARROW_X} ${PANEL_TOP - 4}`}
            at={2}
            shown={shown[2]}
            stroke={colors.brandDark}
            markerEnd={`url(#${ARROW}-line)`}
          />
        </svg>

        {/* BEAT 0, THE JOB. On screen when the slide arrives, because it is the
            one thing here that needs no explanation: it is the job they saved. */}
        <FcNodeIn
          at={0}
          shown={shown[0]}
          className="absolute"
          style={{ left: 0, top: 0, width: 300, height: JOB_H }}
        >
          <div
            className="flex h-full items-center gap-3 rounded-xl px-4"
            style={litCard(colors.brandDeep)}
          >
            {JobIcon && <JobIcon width={22} height={22} style={{ color: colors.brandDeep }} />}
            <div>
              <div
                className="font-heading font-bold"
                style={{ fontSize: 18, lineHeight: 1.2, color: colors.ink }}
              >
                {job.label}
              </div>
              {job.caption && (
                <div style={{ fontSize: 15, lineHeight: 1.25, color: colors.body }}>
                  {job.caption}
                </div>
              )}
            </div>
          </div>
        </FcNodeIn>

        {/* BEAT 1, THE TRIGGER. A plain chip and not a lit badge: it is an
            action someone takes, not an object the panels hold. */}
        <FcNodeIn
          at={1}
          shown={shown[1]}
          className="absolute"
          style={{ left: TRIGGER_X, top: 18, height: 36 }}
        >
          <div
            className="flex h-full items-center rounded-pill px-4"
            style={{
              background: colors.white,
              border: `1px solid ${colors.line}`,
              fontSize: 16,
              color: colors.ink,
            }}
          >
            {trigger}
          </div>
        </FcNodeIn>

        {/* BEAT 2, THE BUILD QUEUE PANEL, and the arrow that lands on it. */}
        <FcNodeIn
          at={2}
          shown={shown[2]}
          className="absolute"
          style={{ left: 0, top: PANEL_TOP, width: QUEUE_W, height: PANEL_H }}
        >
          <div className="relative h-full rounded-xl2" style={panelSurface}>
            <div
              className="absolute flex items-center"
              style={{ left: PAD, right: PAD, top: PAD, height: HEADER_H }}
            >
              <PanelTitle>Build Queue</PanelTitle>
            </div>
            {queue.map((run, i) => (
              <div
                key={run.id}
                className="absolute"
                style={{ left: PAD, right: PAD, top: rowTop(i) }}
              >
                <QueueRow run={run} position={i + 1} />
              </div>
            ))}
            <div
              className="absolute flex items-center gap-3"
              style={{
                left: PAD,
                right: PAD,
                top: PANEL_H - PAD - FOOT_H,
                height: FOOT_H,
                borderTop: `1px solid ${colors.line}`,
              }}
            >
              <CountPill>{`${queue.length} waiting`}</CountPill>
              <span style={{ fontSize: 15, lineHeight: 1.25, color: colors.body }}>
                position 1 goes next, as soon as a slot frees
              </span>
            </div>
          </div>
        </FcNodeIn>

        {/* THE ARRIVAL LABEL. Derived from the queue, so it cannot name a run
            that is not drawn, and it sits beside the arrow rather than on it. */}
        <FcNodeIn
          at={2}
          shown={shown[2]}
          className="absolute"
          style={{ left: ARROW_X + 12, top: JOB_H - 4 }}
        >
          <span style={{ fontSize: 15, lineHeight: 1.25, color: colors.brandDark }}>
            {arrivalLabel}
          </span>
        </FcNodeIn>

        {/* BEAT 3, THE BUILD EXECUTOR STATUS PANEL, with the derived count. */}
        <FcNodeIn
          at={3}
          shown={shown[3]}
          className="absolute"
          style={{ left: QUEUE_W + COL_GAP, top: PANEL_TOP, width: EXEC_W, height: PANEL_H }}
        >
          <div className="relative h-full rounded-xl2" style={panelSurface}>
            <div
              className="absolute flex items-center justify-between"
              style={{ left: PAD, right: PAD, top: PAD, height: HEADER_H }}
            >
              <PanelTitle>Build Executor Status</PanelTitle>
              <CountPill>{`${busy}/${total} busy`}</CountPill>
            </div>
            {executors.map((slot, i) => (
              <div
                key={slot.id}
                className="absolute"
                style={{ left: PAD, right: PAD, top: rowTop(i) }}
              >
                <ExecutorRow slot={slot} />
              </div>
            ))}
            <div
              className="absolute"
              style={{
                left: PAD,
                right: PAD,
                top: PANEL_H - PAD - FOOT_H,
                borderTop: `1px solid ${colors.line}`,
              }}
            >
              {done && done.length > 0 && <DoneRow runs={done} />}
            </div>
          </div>
        </FcNodeIn>
      </div>

      {caption && (
        <figcaption
          className="text-center font-semibold"
          style={{ height: CAPTION_H, paddingTop: 10, fontSize: 16, color: colors.ink }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
