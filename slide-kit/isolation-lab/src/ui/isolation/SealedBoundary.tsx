import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { lit, ghost, boundary, ZoneTag, IconWell, SeveredMark } from './isolationChrome'
import { HALF_WIDTH, type IsolationFigureProps } from './isolationFigure'

/**
 * CANDIDATE 1 — SEALED BOUNDARY. The artefact is INSIDE something.
 *
 * THE BET
 *
 * "It exists in one place" is a statement about CONTAINMENT, so the figure draws
 * a container. The image sits inside a dashed machine boundary; the three
 * would-be recipients sit outside it; and the single route out of the boundary is
 * drawn and then cut, once, at the boundary's own edge.
 *
 * ONE CUT AND NOT THREE, which is the design decision in this candidate. Three
 * severed connectors say "three attempts failed", which invites the question of
 * whether a fourth might work. One cut at the exit says the boundary is the
 * reason, and the three rows below are then consequences of it rather than three
 * separate misfortunes. It is also what keeps the drawing legible: three curves
 * plus three cut marks in a 44px gutter is a scribble.
 *
 * The route below the cut is drawn DASHED and continues to every row. That is
 * deliberate and it is the honesty of the figure: the dashed line is the delivery
 * that was wanted and never happened, so the rows are attached to an absence
 * rather than to a working link. A figure that simply omitted the line would
 * leave three unexplained cards on a slide.
 *
 * WHY IT MIGHT WIN. It is the only candidate that draws the CAUSE. The other
 * three arrange the consequence: this one puts a wall on the slide, and a wall is
 * a thing a room can point at while the instructor says the word "local".
 *
 * WORST AT
 *
 * REPEATING THE NEGATION. Each row prints the author's negation word, so at three
 * rows the slide carries "cannot" three times in the figure and three more in the
 * points column beside it. `ReachTable` prints it once as a heading and this
 * cannot, because its rows are hung down a gutter rather than gathered under a
 * column.
 *
 * Second, it is the tallest of the four, at about 341px for three recipients. The
 * boundary needs real padding to read as a container rather than as a bordered
 * card, and that padding is about 40px the other candidates spend on content.
 * FOUR RECIPIENTS IS 407px, WHICH LEAVES NOTHING FOR THE CONCLUSION LINE under a lead, so three
 * is its ceiling and the figure cannot say so itself.
 *
 * Third, it says nothing about WHICH machine the boundary belongs to beyond a
 * label. Two holders, or a holder that is itself one of a set, is not drawable
 * here.
 */

/** Row height at the 16px type floor: a 20px label over a 21px verb phrase. */
const ROW_H = 58
const ROW_GAP = 8
const ROW_PITCH = ROW_H + ROW_GAP
/** Space between the boundary's bottom edge and the first row, where the cut sits. */
const CUT_BAND = 28
/** The connector gutter. 44px is the narrowest that still reads as a route. */
const GUTTER = 44
/**
 * The boundary panel's own height, MEASURED at 1280x720 and not added up here.
 *
 * Same reason `FanOut`'s header gives for its padding numbers: the artefact
 * tile's icon well collapses its margin into the stack, so a sum of the declared
 * paddings is wrong by about 9px. Walk the panel's boxed descendants, take the
 * union, and read the height off the browser.
 */
const BOUNDARY_H = 137

/**
 * The figure's height BEFORE it is laid out, derived from the recipient count.
 *
 * The slide needs this to decide whether centring the block would carry the
 * figure into the instructor-video reserve, and that decision has to be made
 * from constants rather than from a measurement: a measure-then-render pass
 * risks the dev server and the single-file build disagreeing, which is the trap
 * `points-lab` records. Three recipients is 355px; each further one adds 66.
 */
export const sealedBoundaryHeight = (n: number) =>
  BOUNDARY_H + CUT_BAND + n * ROW_H + Math.max(0, n - 1) * ROW_GAP

export function SealedBoundary({
  artefact,
  holder,
  recipients,
  negation = 'cannot',
  width = HALF_WIDTH,
  className = '',
}: IsolationFigureProps) {
  const rowsH = recipients.length * ROW_H + Math.max(0, recipients.length - 1) * ROW_GAP
  const gutterH = CUT_BAND + rowsH
  const spineX = GUTTER / 2
  const cutY = 14
  const rowCentre = (i: number) => CUT_BAND + i * ROW_PITCH + ROW_H / 2

  return (
    <div className={`mx-auto ${className}`} style={{ width }}>
      <RevealGroup className="flex flex-col" stagger={0.12}>
        {/* INSIDE. The boundary is the object; the artefact is what it holds. */}
        <Reveal dir="up">
          <div
            className="relative rounded-card border-[2.5px] border-dashed px-3.5 pb-3 pt-6"
            style={boundary(colors.brand)}
          >
            <ZoneTag className="absolute -top-[13px] left-3.5">{holder.label}</ZoneTag>
            <div
              className="flex items-center gap-3 rounded-xl border-2 px-3 py-2.5"
              style={lit(colors.brand)}
            >
              <IconWell icon={artefact.icon} tone={colors.brand} size={34} />
              <span className="min-w-0 leading-tight">
                <span className="block text-[18px] font-bold" style={{ color: colors.ink }}>
                  {artefact.label}
                </span>
                {artefact.ref && (
                  <span
                    className="mt-[2px] block truncate font-mono text-[16px]"
                    style={{ color: colors.brandDark }}
                  >
                    {artefact.ref}
                  </span>
                )}
              </span>
            </div>
            {holder.note && (
              <p className="mt-2 text-body-sm leading-[1.3]" style={{ color: colors.body }}>
                {holder.note}
              </p>
            )}
          </div>
        </Reveal>

        {/* OUTSIDE. The rows hang off a route that was cut at the boundary. */}
        <Reveal dir="up">
          <div className="relative" style={{ paddingLeft: GUTTER, paddingTop: CUT_BAND }}>
            {/* Geometry only. Every label on this figure is a real DOM element,
                per content rule 17: an <svg> is one rectangle to every harness
                in this repo, so two <text> nodes can overlap and pass. */}
            <svg
              aria-hidden
              className="pointer-events-none absolute left-0 top-0"
              width={GUTTER}
              height={gutterH}
              viewBox={`0 0 ${GUTTER} ${gutterH}`}
            >
              {/* The stub that leaves the machine: solid, full weight, and it
                  stops. */}
              <path
                d={`M ${spineX} 0 V ${cutY - 6}`}
                stroke={colors.brand}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              {/* Everything past the cut is the delivery that never happened. */}
              <path
                d={`M ${spineX} ${cutY + 6} V ${rowCentre(recipients.length - 1)}`}
                stroke={colors.line}
                strokeWidth={2}
                strokeDasharray="5 6"
                strokeLinecap="round"
              />
              {recipients.map((r, i) => (
                <path
                  key={r.id}
                  d={`M ${spineX} ${rowCentre(i)} H ${GUTTER}`}
                  stroke={colors.line}
                  strokeWidth={2}
                  strokeDasharray="5 6"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            <SeveredMark
              size={18}
              className="absolute"
              style={{ left: spineX - 14, top: cutY - 14 }}
            />

            <div className="flex flex-col" style={{ gap: ROW_GAP }}>
              {recipients.map((r) => (
                <div
                  key={r.id}
                  /* A GHOST, NOT A DIM CARD. Border and text at full strength,
                     no fill: a labelled hole rather than a faded object. See
                     `ghost()` in isolationChrome.tsx for why opacity is banned
                     in this family. */
                  className="flex items-center gap-3 rounded-xl border-2 px-3.5"
                  style={{ height: ROW_H, ...ghost() }}
                >
                  <span className="min-w-0 leading-tight">
                    <span
                      className="block text-body-sm font-semibold leading-[1.25]"
                      style={{ color: colors.ink }}
                    >
                      {r.label}
                    </span>
                    <span
                      className="mt-[2px] block text-body-sm font-semibold leading-[1.3]"
                      style={{ color: colors.danger }}
                    >
                      {negation} {r.cannot}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </RevealGroup>
    </div>
  )
}
