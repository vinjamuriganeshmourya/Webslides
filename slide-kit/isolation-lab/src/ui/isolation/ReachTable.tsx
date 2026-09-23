import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { lit, ghost } from './isolationChrome'
import { HALF_WIDTH, type IsolationFigureProps } from './isolationFigure'

/**
 * CANDIDATE 2 — REACH TABLE. The restrained, typographic answer.
 *
 * THE BET
 *
 * The argument is a fact about a SET of machines, and the honest drawing of a set
 * is a list of it with one row marked. So there is no boundary, no connector and
 * no fan: four rows, one occupied slot, three empty ones, and the negation
 * printed exactly ONCE as a column heading.
 *
 * THE SLOT COLUMN IS THE WHOLE FIGURE. A filled slot beside the holder and an
 * empty slot beside each of the others is the claim, made in the smallest mark on
 * the slide, and it survives greyscale and a bad projector because it is a
 * PRESENCE difference and not a colour difference. `SyntaxBreakdown`'s numbered
 * badge is the same reasoning.
 *
 * THE HEADING SITS BELOW THE HOLDER, WHICH IS NOT A DETAIL. The first render put
 * `Machine | cannot` across the top, and the holder's own row then read as "This
 * machine · cannot · nxttrendz-backend:latest": the figure stated the opposite of
 * the one true fact on it. A column heading governs what is under it, so the
 * holder band comes first and the heading introduces the three it applies to.
 *
 * THE COUNT IS DERIVED AND NEVER TYPED. "1 of 4 machines" comes from
 * `recipients.length + 1`, so a fifth recipient cannot leave a stale number on a
 * signed-off slide. This is the only candidate that STATES the arithmetic the
 * slide's last line makes.
 *
 * WHY IT MIGHT WIN. It is the shortest at about 274px, the most legible at half
 * width, and the only one that prints the negation once. It is also the only one
 * that scales: six recipients is six rows at 52px, where every other candidate
 * here runs out of the well at four.
 *
 * WORST AT
 *
 * IT DRAWS NO CAUSE. Nothing on this figure says WHY the three slots are empty.
 * The word "local" has no picture here, so the figure is evidence for a sentence
 * rather than an argument of its own, which is exactly the charge
 * `PEDAGOGY_GUIDELINES` section 3 lays against a figure that only arranges.
 *
 * Second, it looks like `DataTable`, and it is not one: a table's rows are
 * independent facts, and here three of the four rows are the SAME fact. A room
 * that has read three tables in this deck will read this as a fourth and scan it
 * for differences between the rows, of which there are none worth having.
 *
 * Third, the empty slot is a 24px mark. At the back of a room it is the first
 * thing to go, and when it goes the figure says nothing at all: the rows still
 * read as a list of four machines.
 */

/** Row height at the 16px type floor. */
const ROW_H = 52
const SLOT = 24
/* Measured at 1280x720: the holder band, the heading strip, the panel's two
   borders, and the derived count line under it. */
const HOLDER_H = 60
const HEAD_H = 30
const BORDERS = 4
const COUNT_H = 35

/** See `sealedBoundaryHeight` for why a figure states its height as arithmetic. */
export const reachTableHeight = (n: number) =>
  HOLDER_H + HEAD_H + n * ROW_H + BORDERS + COUNT_H

export function ReachTable({
  artefact,
  holder,
  recipients,
  negation = 'cannot',
  width = HALF_WIDTH,
  className = '',
}: IsolationFigureProps) {
  const total = recipients.length + 1
  const cols = `${SLOT}px minmax(0,1fr) minmax(0,1.15fr)`

  return (
    <div className={`mx-auto ${className}`} style={{ width }}>
      <RevealGroup className="flex flex-col" stagger={0.1}>
        <Reveal dir="up">
          <div className="overflow-hidden rounded-card border-2" style={lit(colors.line)}>
            {/* THE ONE OCCUPIED SLOT, AND IT COMES BEFORE THE HEADING. */}
            <div
              className="grid items-center gap-x-3 px-3.5"
              style={{
                height: ROW_H + 8,
                gridTemplateColumns: cols,
                background: [
                  'radial-gradient(120% 200% at 6% 0%, #FFFFFF 0%, #FFFFFF00 60%)',
                  `linear-gradient(135deg, ${colors.surface} 0%, ${colors.surface2} 100%)`,
                ].join(', '),
                boxShadow: `inset 4px 0 0 0 ${colors.brand}, inset 0 1px 0 0 #FFFFFF`,
              }}
            >
              <span
                aria-hidden
                className="grid place-items-center rounded-[7px]"
                style={{
                  width: SLOT,
                  height: SLOT,
                  /* `#4C7AFD` is `brand` lifted about 12%, the one literal
                     STYLE_GUIDE section 9 accepts: the palette only ramps
                     darker, so a solid surface has to start above its base
                     colour or the ramp does not travel far enough to see. */
                  background: `linear-gradient(135deg, #4C7AFD 0%, ${colors.brand} 50%, ${colors.brandDark} 100%)`,
                  boxShadow: `0 2px 6px -2px ${colors.brandDeep}80, inset 0 1px 0 0 #FFFFFF59`,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6 9 17l-5-5"
                    stroke={colors.white}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className="truncate text-body-sm font-bold leading-tight"
                style={{ color: colors.ink }}
              >
                {holder.label}
              </span>
              <span className="min-w-0 leading-tight">
                <span
                  className="block truncate font-mono text-body-sm font-semibold leading-[1.25]"
                  style={{ color: colors.brandDark }}
                >
                  {artefact.ref ?? artefact.label}
                </span>
                {holder.note && (
                  <span
                    className="mt-[1px] block truncate text-body-sm leading-[1.25]"
                    style={{ color: colors.body }}
                  >
                    {holder.note}
                  </span>
                )}
              </span>
            </div>

            {/* THE HEADING CARRIES THE NEGATION, ONCE, for the rows under it.
                Every row below is then a verb phrase and no row repeats the
                word, which is the one thing this candidate can do that the other
                three cannot. `kicker` type, so it reads as a heading and not as
                content: it is the only text on the figure that is not a fact. */}
            <div
              className="grid items-center gap-x-3 px-3.5 py-[6px]"
              style={{
                gridTemplateColumns: cols,
                borderTop: `2px solid ${colors.line}`,
                borderBottom: `1px solid ${colors.line}`,
                background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.surface} 100%)`,
              }}
            >
              <span aria-hidden />
              <span
                className="text-body-sm font-bold uppercase leading-none tracking-[0.09em]"
                style={{ color: colors.muted }}
              >
                Machine
              </span>
              <span
                className="text-body-sm font-bold uppercase leading-none tracking-[0.09em]"
                style={{ color: colors.danger }}
              >
                {negation}
              </span>
            </div>

            {/* THE EMPTY ONES. */}
            {recipients.map((r, i) => (
              <div
                key={r.id}
                className="grid items-center gap-x-3 px-3.5"
                style={{
                  minHeight: ROW_H,
                  gridTemplateColumns: cols,
                  boxShadow:
                    i === recipients.length - 1 ? undefined : `inset 0 -1px 0 0 ${colors.line}`,
                }}
              >
                <span
                  aria-hidden
                  className="rounded-[7px] border-2"
                  style={{ width: SLOT, height: SLOT, ...ghost() }}
                />
                <span
                  className="text-body-sm font-semibold leading-[1.25]"
                  style={{ color: colors.ink }}
                >
                  {r.label}
                </span>
                <span className="min-w-0 leading-tight">
                  <span
                    className="block text-body-sm font-semibold leading-[1.25]"
                    style={{ color: colors.danger }}
                  >
                    {r.cannot}
                  </span>
                  {r.note && (
                    <span
                      className="mt-[1px] block text-body-sm leading-[1.25]"
                      style={{ color: colors.body }}
                    >
                      {r.note}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* DERIVED, NEVER TYPED. */}
        <Reveal dir="up">
          <p className="mt-2.5 text-body-sm font-semibold" style={{ color: colors.body }}>
            <span style={{ color: colors.brandDark }}>1</span> of {total} machines has{' '}
            {artefact.label.toLowerCase()}
          </p>
        </Reveal>
      </RevealGroup>
    </div>
  )
}
