import { Step } from '@/motion/Stepper'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { SHAPE_CLIP, VERDICT, type VerdictFigureProps } from './contract'

/**
 * VARIANT 4 — STAMP CARDS. The verdict is a SHAPE, and the shape is the point.
 *
 * Each row is a white card carrying a stamp: a circle for correct, a cut-corner
 * octagon for wrong, a triangle for careful, a square for a note. The glyph sits
 * inside the shape and the word sits under the claim.
 *
 * WHY SHAPE RATHER THAN MORE COLOUR. Roughly one man in twelve cannot separate
 * the red row from the green one, and a washed-out projector or a printed
 * greyscale handout does the same thing to everybody. Colour, a glyph and a word
 * are three cues, but two of them are small and one of them fails for a large
 * minority of any room. A silhouette is none of those things: an octagon is a
 * stop sign at fifteen metres, in any colour, to anyone.
 *
 * This is the variant that takes the accessibility floor in `contract.tsx`
 * seriously rather than merely satisfying it.
 *
 * BEST AT: a slide where one row is a genuine hazard and the room must not miss
 * it. The octagon does work no amount of red can do, and it is the only variant
 * here that survives a black and white printout with the meaning intact.
 *
 * WORST AT: subtlety and density. Four stamps is four strong silhouettes
 * competing, so a set with no real hazard in it looks alarmed about nothing.
 * At roughly 92px a row it is also the most expensive variant here, and four
 * rows is its ceiling.
 */
export function StampCards({ items, immediate = false, className = '' }: VerdictFigureProps) {
  const Row = immediate ? Reveal : Step
  const Wrapper = immediate ? RevealGroup : 'div'
  return (
    <Wrapper
      {...(immediate ? ({ stagger: 0.08 } as const) : {})}
      className={`space-y-3 ${className}`}
    >
      {items.map((item, i) => {
        const v = VERDICT[item.verdict]
        const Icon = iconByName[v.icon]
        const clip = SHAPE_CLIP[v.shape]
        return (
          <Row
            key={i}
            dir="up"
            className="flex items-center gap-5 rounded-card bg-white px-5 py-4 shadow-card-soft ring-1 ring-line"
          >
            {/* The stamp. The silhouette carries the verdict; the glyph confirms it. */}
            <span
              className={`grid h-12 w-12 shrink-0 place-items-center text-white ${v.solid} ${
                v.shape === 'circle' ? 'rounded-full' : v.shape === 'square' ? 'rounded-lg' : ''
              }`}
              style={clip ? { clipPath: clip } : undefined}
            >
              {/* The triangle's glyph rides low, because its usable area is the
                  bottom two thirds of the silhouette. */}
              <Icon width={20} height={20} className={v.shape === 'triangle' ? 'mt-2' : undefined} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-body-lg font-medium text-ink">{item.claim}</span>
              {item.reason && (
                <span className="mt-0.5 block text-body-sm" style={{ color: colors.body }}>
                  {item.reason}
                </span>
              )}
            </span>
            <span
              className={`shrink-0 rounded-pill px-3 py-1 text-[13px] font-bold uppercase tracking-wide text-white ${v.solid}`}
            >
              {item.label ?? v.word}
            </span>
          </Row>
        )
      })}
    </Wrapper>
  )
}
