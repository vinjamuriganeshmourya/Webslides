import type { CSSProperties, ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import type { DefinitionTone } from './definitionFigure'

/**
 * ONE TONE RAMP, ONE TERM CHIP, ONE GLYPH WELL, ONE EXAMPLE BLOCK, FOR EVERY
 * VARIANT IN THIS LAB.
 *
 * The sibling labs each grew three private copies of their card chrome, and by
 * the second variant the padding had already drifted. Five figures that differ
 * in GEOMETRY must not also differ in how much air is inside a box, which grey
 * a definition is set in, or how an example is framed, or the comparison
 * measures the drift instead of the design.
 *
 * THE TONE RAMP, AND WHY IT HAS THREE STOPS AND NOT THE POINTS LAB'S FOUR
 *
 * `points-lab` has `neutral`, `good`, `risk` and `lead`, because a point is a
 * CLAIM and a claim can be good news or a trap. A term is not a claim. It is a
 * word, and a word is neither good news nor dangerous, so `good` and `risk`
 * would be paint with nothing behind it, which is how a deck ends up with five
 * blues that mean nothing.
 *
 * What does vary, and is worth paint:
 *
 *   `new`       the term this frame exists to introduce. Deepest brand blue, the
 *               same stop `points-lab` gives its lead, because it is the same
 *               claim: this one carries the slide.
 *   `contrast`  a term that exists to be told APART from the one beside it,
 *               which is a whole genre of slide in this course (image against
 *               container, memoization against caching). Teal, the style guide's
 *               secondary, so the pair reads as two things rather than as two
 *               weights of one thing.
 *   `neutral`   an ordinary term. Brand blue.
 *
 * NO HOVER, ANYWHERE, AND THAT IS A DELIBERATE DEPARTURE FROM THE SIBLINGS
 *
 * Every sibling lab ships a `HoverAside`: a card lifts on `:hover` and opens a
 * 300px popover carrying the point's `detail`. This lab has none, and no
 * `detail` field on its contract to put in one.
 *
 * The reason is the standing instruction on this project, and it is right: a
 * deck is projected into a room where nobody has a pointer. Content reachable
 * only by hovering is content the people the slide was made for never see, and
 * the one person who does have a pointer is the presenter, who already knows
 * what the card says. So a definition card carries everything it has to say on
 * its face, and the material that used to hide behind a hover belongs either in
 * the card, at `exampleNote` size, or in the slide's speaker notes.
 *
 * The knock-on is that this lab needs none of the machinery the hover required:
 * no `.fc-node--hoverable`, no `:has()` slot raise, no "never in the DOM unless
 * open" rule, and no 0.18s UI-tier exception to the timing scale. Every duration
 * in here comes from `figureTiming.ts`.
 */

export const TONE_PAINT: Record<DefinitionTone, string> = {
  neutral: colors.brand,
  new: colors.brandDark,
  contrast: colors.teal,
}

export const toneOf = (tone: DefinitionTone | undefined) => TONE_PAINT[tone ?? 'neutral']

/**
 * THE CARD SURFACE, DECLARED ONCE.
 *
 * Solid white on one hairline border, one accent edge, one soft neutral shadow.
 *
 * The sibling labs' cards carry four layers of paint each: a diagonal tone wash,
 * a radial corner highlight, a tone-tinted drop shadow and an inset hairline
 * ring. Every layer was argued for and the argument was the wrong one, which is
 * a thing that only becomes visible on a projector: it is trying to make a small
 * box look like a raised physical surface, and a slide is not a surface anyone
 * can pick things up off. At the sizes a definition card runs to, 300 to 560px
 * wide, the same treatment reads as a glossy panel from a decade ago.
 *
 * So: modern, minimal, one accent. The accent is on the LEFT edge, which is
 * where `Callout` and `RuleStack` both put theirs, so a slide carrying a
 * definition card and a callout reads as one system.
 */
export function cardSurface(paint: string, accent: 'left' | 'top' | 'none' = 'left'): CSSProperties {
  return {
    background: colors.white,
    border: `1px solid ${colors.line}`,
    ...(accent === 'left' ? { borderLeft: `4px solid ${paint}` } : null),
    ...(accent === 'top' ? { borderTop: `4px solid ${paint}` } : null),
    boxShadow: `0 10px 26px -18px ${colors.nwNavy}59`,
  }
}

/**
 * THE TERM, SET AS A TERM.
 *
 * `size` is the variant's decision and the only thing it may change about how a
 * term looks: the face, the weight and the colour are fixed here, because a term
 * that is Sora bold `ink` on one variant and Inter semibold brand blue on the
 * next is two different components wearing one name.
 *
 * `ink` and not the tone's paint. This was the other way round for a first pass,
 * and a row of three cards came out as three coloured headings with grey prose
 * under them: the colour said "these three words are the important part of the
 * slide", which is true, and then said nothing about WHICH, because all three
 * had it. The tone lives on the accent edge and on the gloss, where it
 * distinguishes rather than decorates.
 */
export function Term({
  children,
  size = 'md',
}: {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const px = { sm: 18, md: 22, lg: 28, xl: 40 }[size]
  return (
    <span
      className="block font-heading font-bold"
      style={{ color: colors.ink, fontSize: px, lineHeight: 1.16, letterSpacing: '-0.01em' }}
    >
      {children}
    </span>
  )
}

/**
 * THE GLOSS: the five-word version, beside the term.
 *
 * Lowercase, in the tone. Not a chip and not uppercase: a `TermChip` in the
 * points lab is a mono token the learner will TYPE, and a gloss is the opposite,
 * an aside in the instructor's own voice. Setting it as a chip made the room
 * read it as the real name of the thing.
 */
export function Gloss({ children, paint }: { children: ReactNode; paint: string }) {
  return (
    <span className="block text-body-sm font-semibold" style={{ color: paint }}>
      {children}
    </span>
  )
}

/** The definition itself. One size for the whole lab, so nothing competes. */
export function Definition({
  children,
  size = 'md',
}: {
  children: ReactNode
  size?: 'sm' | 'md'
}) {
  const px = size === 'sm' ? 15 : 16.5
  return (
    <span
      className="block"
      style={{ color: colors.body, fontSize: px, lineHeight: 1.55 }}
    >
      {children}
    </span>
  )
}

/**
 * THE GLYPH WELL.
 *
 * A solid tint at the tone's own hue, no ramp and no ring. The icon is what
 * should read, not its tile.
 *
 * Hard rule 8 applies to a glyph as much as to a diagram: it has to depict THIS
 * term, not the topic the term belongs to. A `settings` cog on "Race Condition"
 * is decoration, and the honest move when nothing fits is `GlyphAnchor`'s own
 * fallback, which is to draw the term's initial instead of a glyph that lies.
 */
export function GlyphWell({
  icon,
  paint,
  size = 44,
  fallback,
}: {
  icon?: string
  paint: string
  size?: number
  /** Shown when the term has no honest glyph: its own initial. */
  fallback?: string
}) {
  const Icon = icon ? iconByName[icon as keyof typeof iconByName] : undefined
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl2"
      style={{ width: size, height: size, background: `${paint}14`, color: paint }}
    >
      {Icon ? (
        <Icon width={Math.round(size * 0.46)} height={Math.round(size * 0.46)} />
      ) : (
        <span className="font-heading font-bold" style={{ fontSize: Math.round(size * 0.42) }}>
          {(fallback ?? '?').slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  )
}

/**
 * THE EXAMPLE BLOCK.
 *
 * An inset zone rather than another card: the example belongs to the definition
 * above it, and a second bordered box beside a bordered card reads as two
 * things. So it is a tinted well with no border, indented from the card's own
 * padding, in the mono face at 13.5px.
 *
 * NOT the kit's `CodeBlock`. That component draws a file: traffic lights, a
 * filename bar and line numbers, all of which claim this snippet came from
 * somewhere on disk. These examples are two lines of illustration, and hard rule
 * 3's cousin applies: a panel that says "file" when the content is not a file is
 * a small lie that the room will believe.
 *
 * Whitespace is preserved and the block does not wrap: an example that needs to
 * wrap is too long, and `resolveDefinitions` says so at four lines. It scrolls
 * inside its own box rather than shearing, so a snippet that overruns is visibly
 * wrong in review instead of quietly clipped.
 *
 * EACH LINE IS ITS OWN ELEMENT, AND THAT IS NOT A DETAIL
 *
 * The first version was one `<pre>` holding the newlines. It renders identically
 * and `align-check.mjs` reported both multi-line examples as WRAPPED: the harness
 * infers a wrapped token by comparing an element's height against its
 * line-height, and one element three lines tall is indistinguishable from one
 * line that wrapped three times. `points-lab` hit the same check from the other
 * direction and had to put every term chip's text in its own `leading-none` span.
 *
 * Splitting on the newline makes every line a leaf that is exactly one line tall,
 * so the harness measures what is actually there. It is also the better markup by
 * content rule 17's standard, which wants every piece of text to be real DOM a
 * sweep can see, and it survives the single-file export without depending on
 * `white-space` surviving minification.
 */
export function ExampleBlock({
  example,
  note,
  paint,
  className = '',
}: {
  example: string
  note?: string
  paint: string
  className?: string
}) {
  return (
    <div className={className}>
      <div
        className="overflow-x-auto rounded-xl px-3.5 py-2"
        style={{ background: colors.surface2 }}
      >
        <div
          /*
            1.5, NOT 1.65, AND THE NUMBER WAS MEASURED RATHER THAN CHOSEN.

            A snippet is read as a block, not as prose: the lines belong together
            and generous leading pulls them apart into three separate statements.
            It also costs real height where there is none to spare. At 1.65 a
            three-line example is 67px and `WorkedExample`'s three rows came to
            475px against a 440px content well, which `ContentSlide` centres, so
            the figure overflowed at both ends and printed over the slide's own
            lead. At 1.5 the same example is 61px.
          */
          className="font-mono"
          style={{ color: colors.nwBlack, fontSize: 13.5, lineHeight: 1.5 }}
        >
          {example.split('\n').map((line, i) => (
            <span key={i} className="block whitespace-pre">
              {line}
            </span>
          ))}
        </div>
      </div>
      {note && (
        <p className="mt-1.5 text-xs" style={{ color: paint }}>
          {note}
        </p>
      )}
    </div>
  )
}

/** The line under the set. One treatment, so a variant never invents its own. */
export function SetCaption({ children, width }: { children: ReactNode; width?: number }) {
  return (
    <p
      className="mt-3.5 text-center text-body-sm"
      style={{ color: colors.body, width, marginLeft: 'auto', marginRight: 'auto' }}
    >
      {children}
    </p>
  )
}

/**
 * Input this lab cannot draw, said out loud rather than drawn badly.
 *
 * Straight from the sibling labs, and it is the whole reason the resolver exists:
 * a figure that refuses is worth more than a figure that renders an unreadable
 * card and lets it ship.
 */
export function ProblemPanel({ problems, width }: { problems: string[]; width?: number }) {
  return (
    <figure className="mx-auto" style={{ width }}>
      <div className="rounded-card p-5" style={{ border: `2px solid ${colors.danger}` }}>
        <p
          className="mb-2 font-heading text-body-sm font-bold uppercase tracking-wide"
          style={{ color: colors.danger }}
        >
          this set cannot be drawn as definition cards
        </p>
        <ul className="list-disc space-y-1 pl-5">
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
