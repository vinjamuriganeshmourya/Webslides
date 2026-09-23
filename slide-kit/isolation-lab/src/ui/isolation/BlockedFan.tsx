import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { lit, ghost, IconWell, SeveredMark } from './isolationChrome'
import { HALF_WIDTH, type IsolationFigureProps } from './isolationFigure'

/**
 * CANDIDATE 4 — BLOCKED FAN. `FanOut` with the fan broken, and it is in this lab
 * to be TESTED rather than to win.
 *
 * WHY IT EXISTS
 *
 * `FanOut` is the figure an author reaches for on this slide, because the nouns
 * match: one image on the left, three machines on the right. It argues the exact
 * opposite of the slide, and the tempting fix is to keep its geometry and break
 * its connectors. This candidate is that fix, built properly, so the lab can
 * answer the question rather than assert it: does inverting a figure invert what
 * a room reads off it, or does the SHAPE keep saying "one becomes many" whatever
 * is drawn on the lines?
 *
 * That finding is worth as much as a winner. If a broken fan reads honestly, the
 * kit gains a cheap `blocked` mode on a figure it already has. If it does not, the
 * lab has the evidence for why the next author must not try it, which is the
 * question that will otherwise be asked again on the next deck.
 *
 * WHAT IS DRAWN. The source keeps `FanOut`'s three-cubic fan, each curve stops
 * dead at the midpoint of the gap with a cut mark on it, and the far side of each
 * curve is absent rather than dashed: a dashed continuation into a card would
 * still terminate AT the card, which is an arrival.
 *
 * THE ONE THING IT INVERTS THAT `FanOut` CANNOT. `FanOut`'s source is the quiet
 * box: dashed, tinted, no live dot, because the mistake it prevents is reading
 * the source as one of the running things. Here the source is the LOUD box,
 * because on this slide the source is the only thing that exists. That is not a
 * prop `FanOut` has, and it is the clearest statement of why this is a separate
 * figure and not a flag on that one.
 *
 * WORST AT
 *
 * ITS OWN SHAPE. A fan is a picture of distribution. Three connectors leaving one
 * box is what the room has been trained by every other deck to read as "these
 * three got it", and a 28px cut mark is asked to reverse a reading that the whole
 * composition has already made. Every other candidate here begins from a shape
 * that means containment or absence and never has to argue with itself.
 *
 * Second, the cut marks are the busiest thing in the family: three of them in a
 * 104px gap is the most ink for the least claim.
 *
 * Third, it is the only candidate whose meaning depends on a viewer noticing a
 * small mark. The empty slots in `LoneHost` and in `ReachTable` are visible as
 * shape; a cut on a line is visible only as detail, and detail is the first thing
 * a projector loses.
 *
 * Fourth, the source card is the narrowest thing in the family at 176px, and at
 * the 16px type floor `nxttrendz-backend:latest` wraps to two lines inside it. It
 * WRAPS AND NEVER TRUNCATES: the first render cut it to `nxttrendz-backe...`, and
 * a truncated identifier is not a smaller label, it is a wrong one.
 */

/** Copy card at the 16px floor: a 20px label over a two-line verb phrase. */
const COPY_H = 74
const COPY_PITCH = 88
const SOURCE_H = 152
const SOURCE_W = 176
const GAP = 104

/**
 * See `sealedBoundaryHeight` for why a figure states its height as arithmetic.
 * This one is exact rather than measured: the stage height IS `bodyH` below.
 */
export const blockedFanHeight = (n: number) =>
  Math.max(n * COPY_H + Math.max(0, n - 1) * (COPY_PITCH - COPY_H), SOURCE_H)

export function BlockedFan({
  artefact,
  holder,
  recipients,
  negation = 'cannot',
  width = HALF_WIDTH,
  className = '',
}: IsolationFigureProps) {
  const copyX = SOURCE_W + GAP
  const copyW = width - copyX
  const stackH =
    recipients.length * COPY_H + Math.max(0, recipients.length - 1) * (COPY_PITCH - COPY_H)
  const bodyH = Math.max(stackH, SOURCE_H)
  const sourceTop = (bodyH - SOURCE_H) / 2
  const stackTop = (bodyH - stackH) / 2
  const copyCentre = (i: number) => stackTop + i * COPY_PITCH + COPY_H / 2
  /* The cut sits at the midpoint of the gap: far enough off the source that the
     curve has established a direction, far enough off the card that it cannot be
     read as arriving. */
  const cutX = SOURCE_W + GAP / 2
  const sourceCentre = sourceTop + SOURCE_H / 2
  /** Where a curve stops, and where its mark goes. One expression, used twice. */
  const cutY = (i: number) =>
    (sourceCentre + copyCentre(i)) / 2 + (copyCentre(i) - sourceCentre) * 0.12

  return (
    <div className={`mx-auto ${className}`} style={{ width }}>
      <RevealGroup className="relative" stagger={0.12} style={{ width, height: bodyH }}>
        {/* THE BROKEN FAN. Geometry only, one aria-hidden layer, per content
            rule 17: every label on this figure is a real DOM element. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0"
          width={width}
          height={bodyH}
          viewBox={`0 0 ${width} ${bodyH}`}
        >
          {recipients.map((r, i) => {
            /* `FanOut`'s curve, halved: both handles at the horizontal midpoint
               of the FULL span, so the stub leaves the source on exactly the
               heading it would have had, and then stops. */
            const mid = (SOURCE_W + copyX) / 2
            return (
              <path
                key={r.id}
                d={`M ${SOURCE_W} ${sourceCentre} C ${mid} ${sourceCentre}, ${mid} ${(sourceCentre + copyCentre(i)) / 2}, ${cutX} ${cutY(i)}`}
                fill="none"
                stroke={colors.brand}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            )
          })}
        </svg>

        {recipients.map((r, i) => (
          <SeveredMark
            key={`${r.id}-cut`}
            size={18}
            className="absolute"
            style={{ left: cutX - 14, top: cutY(i) - 14 }}
          />
        ))}

        {/* THE SOURCE, AND IT IS THE LOUD BOX. See the header: `FanOut` draws its
            source quiet on purpose, and on this slide the source is the only
            thing that exists. */}
        <Reveal
          dir="up"
          className="absolute"
          style={{ left: 0, top: sourceTop, width: SOURCE_W, height: SOURCE_H }}
        >
          <div
            className="flex h-full w-full flex-col justify-center rounded-card border-2 px-3 py-2.5"
            style={lit(colors.brand)}
          >
            <IconWell icon={artefact.icon} tone={colors.brand} size={30} />
            <span
              className="mt-1.5 block text-body-sm font-bold leading-tight"
              style={{ color: colors.ink }}
            >
              {artefact.label}
            </span>
            {artefact.ref && (
              <span
                /* WRAPS RATHER THAN TRUNCATES. See the header's fourth fault. */
                className="mt-[2px] block break-words font-mono text-body-sm leading-[1.2]"
                style={{ color: colors.brandDark }}
              >
                {artefact.ref}
              </span>
            )}
            <span
              className="mt-[3px] block text-body-sm font-semibold uppercase leading-[1.15] tracking-[0.04em]"
              style={{ color: colors.body }}
            >
              {holder.label}
            </span>
          </div>
        </Reveal>

        {/* THE ONES THAT NEVER GOT IT. Ghost frames, not dimmed copies. */}
        {recipients.map((r, i) => (
          <Reveal
            key={r.id}
            dir="up"
            className="absolute"
            style={{
              left: copyX,
              top: stackTop + i * COPY_PITCH,
              width: copyW,
              height: COPY_H,
            }}
          >
            <div
              className="flex h-full w-full flex-col justify-center rounded-xl border-2 px-3"
              style={ghost()}
            >
              <span
                className="text-body-sm font-semibold leading-[1.25]"
                style={{ color: colors.ink }}
              >
                {r.label}
              </span>
              <span
                className="mt-[2px] block text-body-sm font-semibold leading-[1.25]"
                style={{ color: colors.danger }}
              >
                {negation} {r.cannot}
              </span>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </div>
  )
}
