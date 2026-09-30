import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveDefinitions, type DefinitionFigureProps } from './definitionFigure'
import {
  cardSurface,
  Definition,
  Gloss,
  ProblemPanel,
  SetCaption,
  Term,
  toneOf,
} from './definitionChrome'

/**
 * MEDALLION PLATE — a white plate with a solid circular medallion straddling its
 * top edge, everything on one centred axis, and the definition the only thing
 * that is not centred.
 *
 * THE BOX TREATMENT, WHICH IS THE THING BEING PROPOSED HERE
 *
 * Every card in this lab so far is a closed rectangle: the glyph, the term and
 * the prose are all inside one border, and the border is where the card stops.
 * This one puts its mark ON the border. The medallion's centre sits exactly on
 * the plate's top edge, half of it outside the box, carrying a white ring so the
 * hairline does not cut through it.
 *
 * That buys two things a closed card cannot have:
 *
 *   1. **A silhouette.** From the back of a room, `GlyphAnchor`, `BandSplit` and
 *      `TermLede` are all the same shape: a rectangle. A rectangle with a disc on
 *      its top edge is recognisable before any of its content is, so a deck that
 *      uses this layout for its definitions and plain cards for everything else
 *      has told the room which slides are definitions without saying so.
 *   2. **A reason for the plate to be narrower than the well.** A closed card
 *      that does not fill its container looks like a card that failed to
 *      stretch. A plate with a badge on it looks like an object, and an object is
 *      allowed to sit in space. That is what lets this variant answer one
 *      definition with a 760px plate instead of a 1152px one, which is the only
 *      way a single-column arrangement gets a readable measure at this count.
 *
 * WHAT IT TAKES FROM SLIDE 2
 *
 * The hierarchy and the sizes, unchanged: a glyph first, then the term, then the
 * gloss in the tone, then the definition in body grey. Same `cardSurface` with
 * no accent edge, for slide 2's own reason: the tone is already in the glyph, and
 * two coloured marks on one card is one too many. Same tone ramp and same
 * timings.
 *
 * WHAT IT DOES DIFFERENTLY, AND WHY EACH
 *
 *   **The medallion is a solid disc, not a tinted square.** `GlyphWell` is an
 *   8%-tint rounded square with the icon in the tone, which is right inside a
 *   card, where a saturated block would outweigh the term beside it. On the edge
 *   of the plate the opposite is true: the mark is the silhouette, it has the
 *   slide's own ground behind its top half, and a 14% tint against a tinted
 *   ground is invisible. So it is filled, and the icon reverses to white.
 *
 *   **One centred axis, and the definition breaks it.** The medallion, the term,
 *   the gloss and the rule are centred, and the definition is set left inside a
 *   centred block. Centred prose is unreadable past about two lines, because
 *   every line starts at a different x and the eye has to search for the next
 *   one, and the fixture's longest definition is four. The tone rule is what
 *   makes the switch legible rather than sloppy: it ends the centred header and
 *   starts the block that is not centred.
 *
 *   **There is no example zone, and that is a decision rather than an omission.**
 *   An `ExampleBlock` is a left-aligned mono well. Dropped under a centred header
 *   it re-opens the alignment question the rule just closed, and it is the widest
 *   fixed-width thing in the lab, so the plate would have to grow to 405px of
 *   inner width for content the rest of the layout is not shaped around. The
 *   honest version of this plate is a term, a gloss and a definition, which is
 *   what most definitions actually are. A set whose examples are the point wants
 *   `TabFrame`, which gives them a column.
 *
 * THE COUNTS
 *
 * At **one** the plate is 760px wide, centred, with a 560px definition block:
 * about 62 characters a line at 20px. At **two** it is two 564px plates with a
 * 460px block at 16.5px, about 64 characters a line, and the medallion drops from
 * 88px to 72 so it stays proportional to a plate two thirds the width. Both are
 * the same object at two sizes, which is what the badge silhouette makes
 * possible.
 *
 * WHAT IT IS WORST AT
 *
 * **Two plates cannot end level.** Every other card variant in the lab floors its
 * example with `mt-auto`, so a short definition and a long one still land on one
 * line across the frame. With no example there is nothing to push down, so the
 * short plate simply has more white under its last line. The centred axis hides
 * this better than a left-aligned card would, and it does not remove it: on the
 * pair fixture, 236 characters beside 71, the difference is about 75px.
 *
 * Second, **the medallion overhangs, so this figure is taller than its plate.**
 * Half the disc is outside the box, and the layout reserves that as a margin. It
 * is 44px at one term, which comes out of a 440px well.
 */

/**
 * The disc. Local to this variant on purpose: `GlyphWell` is the lab's one glyph
 * treatment INSIDE a card, and it is a tinted square because that is what is
 * right in there. This is a different object in a different place, and pretending
 * otherwise would mean adding a `shape` and a `filled` prop to the shared well to
 * describe a thing only one variant draws.
 *
 * The icon ratio is `GlyphWell`'s own 0.46, so a bolt is the same size relative to
 * its mark here as it is on slide 2.
 */
function Medallion({ icon, paint, size, fallback }: {
  icon?: string
  paint: string
  size: number
  fallback: string
}) {
  const Icon = icon ? iconByName[icon as keyof typeof iconByName] : undefined
  return (
    <span
      className="grid shrink-0 place-items-center rounded-pill"
      style={{
        width: size,
        height: size,
        background: paint,
        color: colors.white,
        /* The ring, not a border: a border would eat into the disc's own
           diameter, and this has to read as a solid mark sitting on the line
           rather than as a ring with a mark in it. */
        boxShadow: `0 0 0 6px ${colors.white}`,
      }}
    >
      {Icon ? (
        <Icon width={Math.round(size * 0.46)} height={Math.round(size * 0.46)} />
      ) : (
        <span className="font-heading font-bold" style={{ fontSize: Math.round(size * 0.42) }}>
          {fallback.slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  )
}

export function MedallionPlate({
  terms,
  caption,
  width = 1152,
  className = '',
}: DefinitionFigureProps) {
  const g = resolveDefinitions({ terms })
  const n = g.terms.length

  const CAPTION = n
  const shown = useBeats(CAPTION + 1)

  const problems = [...g.problems]
  /*
    ONE OR TWO, AND THE THIRD PLATE IS WHERE THE MEASURE GOES.

    At three, a plate is 368px wide and its definition block is 288: about 40
    characters a line, which sets the fixture's longest definition as six lines
    and turns a centred plate into a column of a newspaper. The medallion would
    also have to drop to about 56px to stay proportional, at which point the
    silhouette this variant exists for is a dot.
  */
  if (n > 2) {
    problems.push(
      `${n} plates across ${width}px is ${Math.round((width - 24 * (n - 1)) / n)}px each; a centred plate needs about 500 for its definition block, so past two this is GlyphAnchor`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const solo = n === 1
  const GAP = 24
  const PLATE = solo ? 760 : (width - GAP * (n - 1)) / n
  const MED = solo ? 88 : 72
  const DEF_MAX = solo ? 560 : 460
  const PAD = solo ? 40 : 32

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <div
        className="grid items-stretch justify-center"
        style={{ gridTemplateColumns: `repeat(${n}, ${PLATE}px)`, gap: GAP }}
      >
        {g.terms.map((t, i) => {
          const paint = toneOf(t.tone)
          return (
            <FcNodeIn
              key={t.id}
              at={i}
              shown={shown[i]}
              className="relative"
              /*
                THE OVERHANG IS RESERVED ON THE WRAPPER, AS PADDING, AND IT HAS TO
                BE PADDING RATHER THAN THE PLATE'S OWN TOP MARGIN.

                It was `marginTop` on the plate for a first pass, and the margin
                collapsed straight through this wrapper: the wrapper has no border
                and no padding of its own, so the plate's 44px pushed the WRAPPER
                down instead of moving the plate inside it, the wrapper's height
                never grew, and the plate hung 44px past the bottom of the figure.
                The visible symptom was the set caption, which is the figure's next
                child: the plate printed straight over it and it was measured
                underneath. Padding on the wrapper cannot collapse, so the box the
                figure reserves is the box the plate actually occupies.
              */
              style={{ paddingTop: MED / 2 }}
            >
              <div
                className="flex h-full flex-col items-center rounded-card text-center"
                style={{
                  ...cardSurface(paint, 'none'),
                  paddingLeft: PAD,
                  paddingRight: PAD,
                  paddingBottom: solo ? 32 : 28,
                }}
              >
                <span className="block" style={{ marginTop: -MED / 2 }}>
                  <Medallion icon={t.icon} paint={paint} size={MED} fallback={t.term} />
                </span>

                <span className="mt-4 block">
                  <Term size={solo ? 'lg' : 'md'}>{t.term}</Term>
                </span>
                {t.gloss && (
                  <span className="mt-1 block">
                    <Gloss paint={paint}>{t.gloss}</Gloss>
                  </span>
                )}

                {/* The axis change, stated. Above it everything is centred;
                    below it nothing is. */}
                <span
                  aria-hidden
                  className="my-5 block rounded-pill"
                  style={{ width: 56, height: 3, background: paint }}
                />

                <span className="block text-left" style={{ maxWidth: DEF_MAX }}>
                  <Definition size={solo ? 'lg' : 'md'}>{t.definition}</Definition>
                </span>
              </div>
            </FcNodeIn>
          )
        })}
      </div>

      {caption && (
        <FcEdgeLabel at={CAPTION} shown={shown[CAPTION]} className="block">
          <SetCaption width={width}>{caption}</SetCaption>
        </FcEdgeLabel>
      )}
    </figure>
  )
}
