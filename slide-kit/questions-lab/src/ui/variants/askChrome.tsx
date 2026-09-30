import type { CSSProperties, ReactNode } from 'react'
import { colors } from '@/design/tokens'
import type { AskSubject, AskTone } from './askFigure'

/**
 * ONE TONE RAMP, ONE STEM, ONE QUALIFIER, ONE SUBJECT PANEL, FOR EVERY VARIANT
 * IN THIS LAB.
 *
 * The lesson the sibling labs paid for twice: five figures that differ in
 * GEOMETRY must not also differ in what size a question is set at, which grey a
 * qualifier is, or how much air is inside a panel, or the comparison measures the
 * drift instead of the design. By the second variant the padding has always
 * already moved.
 *
 * It matters more here than anywhere else in the family, because these four
 * variants have almost no content between them. A definition card has a term, a
 * gloss, a definition and an example to arrange; a question frame has one
 * sentence. When the content is one sentence, EVERY difference the room sees is a
 * difference in treatment, so an accidental one is not a detail, it is the whole
 * result.
 *
 * THE TONE RAMP
 *
 * Three stops, argued in `askFigure.ts`: `open` is brand blue, `check` is the
 * deep blue the sibling labs give their lead, `pivot` is accent orange with a
 * budget of one per deck.
 *
 * WHAT THE TONE IS ALLOWED TO PAINT, AND WHAT IT IS NOT
 *
 * The kicker, the rule, the mark and the ordinal. Never the question itself.
 *
 * That is the same call `definitions-lab` made about its terms and it was right
 * for the same reason, one step further. A question set in brand blue reads as a
 * LINK, which is the one thing on a slide that blue unambiguously means, and a
 * question set in orange reads as a warning. Both are claims about the answer,
 * made by the paint, before the room has thought about it. The stem is ink on
 * light and white on dark, everywhere in this lab, and the tone lives in the
 * furniture around it.
 *
 * NO HOVER, ANYWHERE, following `definitions-lab`. A deck is projected into a
 * room where nobody has a pointer, so a frame carries everything it has to say on
 * its face. There is nothing in this lab that could hide behind a hover anyway:
 * the only thing a question frame withholds is the answer, and the answer is the
 * next slide.
 */

export const TONE_PAINT: Record<AskTone, string> = {
  open: colors.brand,
  check: colors.brandDark,
  pivot: colors.accent,
}

export const paintOf = (tone: AskTone | undefined) => TONE_PAINT[tone ?? 'open']

/**
 * THE PAINT, ADJUSTED FOR A DARK GROUND.
 *
 * `SpotlightAsk` is the only variant on navy and it cannot use the ramp above.
 * `check` is #0146C7, which against #00254B is a 1.5:1 contrast ratio: on a
 * projector in a lit room it is invisible, and the kicker simply vanishes.
 *
 * The fix is NOT a second ramp with its own hues, which is how a deck ends up
 * with eight blues. Each stop keeps its identity and moves to the lightest
 * member of its own family that the palette already contains, so `check` is
 * still recognisably the deep-blue tone, one step up.
 */
export const TONE_PAINT_DARK: Record<AskTone, string> = {
  open: '#7FA5FF',
  check: '#B9CCFF',
  pivot: colors.accent,
}

export const paintOnDark = (tone: AskTone | undefined) => TONE_PAINT_DARK[tone ?? 'open']

/**
 * THE QUESTION, SET AS A QUESTION.
 *
 * `size` is the variant's decision and the only thing it may change. The face,
 * the weight, the leading, the tracking and the colour are fixed here.
 *
 * THE SIZES ARE NOT A FREE SCALE, THEY ARE FOUR MEASURED STOPS.
 *
 * MEASURED, and the word is meant: every number below came off a render of the
 * fixture through `measure.mjs`, reading the `Range` rects line by line. The
 * first pass of this file guessed them from the kit's type scale and was wrong on
 * all four frames, by one line each on two of them and two lines on a third.
 *
 * Sora bold sets English mixed case at almost exactly **0.53em average advance**
 * at every size in this range, which is the one constant worth writing down: a
 * measure of M pixels holds about `M / (0.53 * size)` characters a line, and the
 * fixture's 114 characters have to land in three lines, or four where the frame
 * has bought something with the extra one.
 *
 *   `sm`  32px, beside a subject panel at a 500px measure. FOUR lines, and the
 *         only stop that cannot reach three: at 500px three lines would need 28px,
 *         which is smaller than the deck's own body text.
 *   `md`  36px, at the 736px a frame keeps when a mark takes the right third.
 *         Three lines.
 *   `lg`  40px, at the full 840px measure. Three lines.
 *   `xl`  48px, at 800px, for a frame that gives the question the canvas and
 *         nothing else. FOUR lines, bought deliberately: this is the stop that
 *         exists to be the largest type in the deck, and 40px there would be three
 *         lines of type no bigger than the frame next door.
 *
 * 44px IS NOT ON THIS SCALE ANY MORE, AND ITS ABSENCE IS THE MEASUREMENT.
 *
 * It was `lg` in the first pass, on the reasonable-sounding grounds that 44 is
 * `slide-title-lg`, which is what the kit's own `QuestionSlide` sets a question
 * at. On the render it put the fixture in four lines with the fourth reading
 * `changes?` and nothing else: a 211px widow under three full 820px lines, which
 * is the ugliest thing this lab produced. 40px is three full lines. The kit's
 * number was right for the kit's 728px card and does not survive being moved to a
 * different measure, which is the whole reason a size is derived rather than
 * inherited.
 *
 * Nothing here goes above 48. `hero` is 64px and belongs to the welcome and
 * thank-you frames, which carry two or three words.
 *
 * `lineHeight: 1.18` rather than the kit's usual 1.3. At 40px a 1.3 leading puts
 * 12px of air between lines, and three lines of one sentence then read as three
 * separate statements stacked up. Tight leading is what keeps a long question
 * reading as one block the eye takes in whole, which is the entire job of a
 * question frame.
 */
export function Stem({
  children,
  size = 'md',
  invert = false,
}: {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * WHITE, FOR A QUESTION SET ON A DARK GROUND. The one exception to "the stem
   * is always ink", and it is not a loosening of it: there is no choice of hue
   * being made, the ground is navy and white is the only legible ink on it.
   */
  invert?: boolean
}) {
  const px = { sm: 32, md: 36, lg: 40, xl: 48 }[size]
  return (
    <p
      className="font-heading font-bold"
      style={{
        color: invert ? colors.white : colors.ink,
        fontSize: px,
        lineHeight: 1.18,
        letterSpacing: '-0.015em',
      }}
    >
      {children}
    </p>
  )
}

/**
 * THE QUALIFIER: the constraint, under a short rule.
 *
 * The rule is not decoration and it is not a divider. It is the thing that stops
 * the room reading the qualifier as part of the question. Without it, "assume the
 * container is already running" sits directly under a sentence ending in a
 * question mark, at a smaller size, and reads as the second half of the ask,
 * which is precisely the compound question hard rule 16 exists to prevent.
 *
 * So the rule is short (80px), painted in the tone, and always present when the
 * qualifier is. A variant may not render the qualifier without it.
 */
export function Qualifier({
  children,
  paint,
  invert = false,
  className = '',
}: {
  children: ReactNode
  paint: string
  invert?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <div className="h-[3px] w-20 rounded-pill" style={{ backgroundColor: paint }} />
      <p
        className="mt-4 text-body-lg font-medium"
        style={{ color: invert ? 'rgba(255,255,255,0.78)' : colors.body }}
      >
        {children}
      </p>
    </div>
  )
}

/**
 * THE KICKER, WITH THE ORDINAL FOLDED INTO IT.
 *
 * Two separate marks was the first pass: a `Kicker` on the left and a small
 * "02 / 06" chip on the right. On a frame whose whole argument is that there is
 * one thing on it, two pieces of chrome at two different x positions is two
 * things, and the eye visits both before it reaches the question.
 *
 * One line, one datum, with a middle dot between the parts. `·` is the separator
 * hard rule 1 explicitly allows, and the ordinal is set in the same uppercase
 * kicker treatment rather than as a badge, so it is chrome the room can skip
 * rather than a number it has to account for.
 */
export function AskKicker({
  children,
  ordinal,
  paint,
  className = '',
}: {
  children?: ReactNode
  ordinal?: { n: number; of?: number }
  paint: string
  className?: string
}) {
  const label = ordinal
    ? `Question ${String(ordinal.n).padStart(2, '0')}${ordinal.of ? ` of ${ordinal.of}` : ''}`
    : undefined
  if (!children && !label) return null
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-kicker uppercase ${className}`}
      style={{ color: paint }}
    >
      <span className="inline-block h-[3px] w-6 rounded-pill" style={{ background: paint }} />
      {children}
      {children && label && <span style={{ opacity: 0.5 }}>·</span>}
      {label}
    </span>
  )
}

/**
 * THE MARK: one question mark, drawn as ground.
 *
 * Shared so the three variants that use it cannot drift into three different
 * opacities, which is exactly what happened between `QuestionSlide` and
 * `QuizTimeSlide` in the kit today. Set in the heading face, so it is the same
 * glyph the copy ends with rather than a second design of question mark.
 *
 * `opacity` is the caller's, because what counts as ground depends on what it
 * sits on: 0.10 over the light frame's pale blue and 0.16 over navy measure the
 * same on a projector. Everything else about it is fixed here.
 *
 * `aria-hidden` and `pointer-events-none` together are what keep the three
 * harnesses quiet: `video-safe.mjs` skips a decorative layer only when it can see
 * `pointer-events-none` on a real DOM class string, which is why this is a div
 * with a glyph in it and not an `<svg>`.
 */
export function AskMark({
  size,
  paint,
  opacity,
  className = '',
  style,
}: {
  size: number
  paint: string
  opacity: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none font-heading font-extrabold leading-none ${className}`}
      style={{ fontSize: size, color: paint, opacity, ...style }}
    >
      ?
    </div>
  )
}

/**
 * THE SUBJECT PANEL: the thing the question is about.
 *
 * Only `AskWithSubject` renders one. It lives here rather than in that file so
 * that a variant which later decides it wants one gets the same panel, and so
 * that the three kinds stay visibly different from each other.
 *
 * THE THREE KINDS ARE THREE CLAIMS ABOUT WHERE THE LINES CAME FROM
 *
 * This is hard content rule 3's principle applied at the level of a panel, and it
 * is the whole reason `kind` is a required field rather than a style prop:
 *
 *   `terminal` draws a dark panel with a prompt path in its bar. It claims these
 *              lines were typed into a shell in that folder and that it printed
 *              that. The label is mandatory, checked by the resolver.
 *   `code`     draws a light panel with a filename bar. It claims this is what is
 *              in that file.
 *   `literal`  draws a tinted well with no bar at all. It claims nothing: these
 *              lines were written for this slide.
 *
 * The default when an author is unsure is `literal`, always, because it is the
 * only one of the three that cannot be wrong.
 *
 * NOT the kit's `CodeBlock` or `Terminal`. Both are built for a full content well
 * and carry traffic lights, a tab strip and line numbers, which at the 420px this
 * panel gets is more chrome than content. This is the same call
 * `definitions-lab` made about `ExampleBlock` and for the same reason: the
 * furniture would be making a claim the content does not support.
 *
 * EVERY LINE IS ITS OWN ELEMENT, which is not a detail. `align-check.mjs` infers
 * a wrapped token by comparing an element's height against its line height, so
 * one `<pre>` holding six newlines is reported as one line that wrapped six
 * times. `definitions-lab` and `points-lab` both hit this from opposite
 * directions.
 */
export function SubjectPanel({
  subject,
  width,
  className = '',
}: {
  subject: AskSubject
  width?: number
  className?: string
}) {
  const dark = subject.kind === 'terminal'
  const bar = subject.kind !== 'literal' && subject.label

  return (
    <div
      className={`overflow-hidden rounded-card ${className}`}
      style={{
        width,
        background: dark ? colors.night2 : subject.kind === 'code' ? colors.white : colors.surface2,
        border: dark ? `1px solid ${colors.night3}` : `1px solid ${colors.line}`,
        boxShadow: `0 10px 26px -18px ${colors.nwNavy}59`,
      }}
    >
      {bar && (
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            background: dark ? colors.night3 : colors.surface,
            borderBottom: dark ? 'none' : `1px solid ${colors.line}`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: dark ? colors.teal : colors.muted }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: 11.5,
              letterSpacing: '0.02em',
              color: dark ? 'rgba(255,255,255,0.68)' : colors.muted,
            }}
          >
            {subject.label}
          </span>
        </div>
      )}
      <div
        /*
          1.55, not the kit's 1.65. Six lines at 1.65 is 139px and this panel has
          to stand beside a three-line question without being taller than it.
        */
        className="overflow-x-auto px-4 py-3.5 font-mono"
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: dark ? 'rgba(255,255,255,0.92)' : colors.nwBlack,
        }}
      >
        {subject.lines.map((line, i) => (
          <span key={i} className="block whitespace-pre">
            {line === '' ? ' ' : line}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Input this lab cannot draw, said out loud rather than drawn badly.
 *
 * Straight from the sibling labs, and it is the whole reason the resolver exists.
 * It renders on the LIGHT ground whatever the variant's own ground is: a refusal
 * is a message to whoever is building the deck, not a slide, and a red panel
 * reversed out of navy reads as part of the design.
 */
export function ProblemPanel({ problems }: { problems: string[] }) {
  return (
    <div className="flex h-full items-center">
      <div
        className="max-w-[840px] rounded-card bg-white p-6"
        style={{ border: `2px solid ${colors.danger}` }}
      >
        <p
          className="mb-2.5 font-heading text-body-sm font-bold uppercase tracking-wide"
          style={{ color: colors.danger }}
        >
          this cannot be asked on a question frame
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          {problems.map((p) => (
            <li key={p} className="text-body-sm" style={{ color: colors.ink }}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
