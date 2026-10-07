import type { ReactNode } from 'react'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { useContinuity } from '@/motion/continuity'
import { Kicker } from './primitives'
import { accentByTone, type Tone } from '@/design/tokens'

/**
 * The standard content-slide header: an accent rail + kicker + title. The HEADING,
 * and nothing else. Self-animates its parts on slide entry, EXCEPT the parts that
 * were already on screen a moment ago.
 *
 * THE LEAD IS NOT HERE ANY MORE. The sentence that says what a slide is for now
 * renders as the first thing in the content well, through `src/ui/SlideLead.tsx`.
 * It is content, not chrome: the kicker and title name the slide, the lead makes
 * its argument, and reading as a subtitle of the heading is what kept it out of
 * the body it belongs to. Slides still take a `lead` prop and continuity still
 * compares it; only where it is drawn has changed.
 *
 * So this component no longer ACCEPTS a lead. That is deliberate rather than
 * tidy-minded: a `lead` prop still declared here but ignored would be passed by
 * the next slide type somebody writes, and would vanish with no error. Removing
 * it makes every stale call site a TypeScript error instead.
 *
 * CONTINUITY
 * A concept spans several slides and every one of them repeats the concept's name
 * in its kicker, so replaying the entrance meant the same kicker flew in again on
 * every slide of the concept while only the body had changed. `useContinuity`
 * reports which parts are unchanged from the previous slide, and those render
 * through `Still` instead of `Reveal`: same markup, same position, no animation.
 * See `src/motion/continuity.ts` for how that is decided.
 */

/**
 * The header's floor, now that every header is a kicker and a title.
 *
 * A kicker and a one-line title measure about 68px. The old 168px floor existed to
 * reserve room for a lead, and a header without one left a gap between the title
 * and the first line of body copy that read as a hole in the slide. The two floors
 * this file used to carry, 168px with a lead and 120px without, collapse to one
 * now that no header has a lead in it. 120px puts the content well's top edge at
 * y=168, given SlideBase's 48px top padding, and hands the rest back to the
 * content. A two-line title simply grows past it.
 *
 * THE VIDEO RESERVATION IS NOT ENFORCED BY THIS NUMBER. The top-right 367x220 of
 * the canvas is kept clear for an instructor video composited in later, and at a
 * 168px well top the first row of content is above that floor. Two things hold the
 * line instead: `SlideLead`'s `max-w-3xl`, and the lead-less guard in each layout,
 * which keeps a side visual at y>=220 whatever the header does. Change this number
 * and run `node video-safe.mjs`.
 */
const HEADER_MIN_H = 'min-h-[120px]'

/**
 * A `Reveal` that does not move: a plain div, so `RevealGroup`'s variants have
 * nothing to propagate into and the part simply exists at its final position.
 *
 * It takes and ignores `dir` and `delay` so it is a drop-in swap for `Reveal` at
 * the call site, which keeps the branching to one ternary per part rather than
 * two copies of every element.
 */
function Still({
  children,
  className,
}: {
  children: ReactNode
  dir?: string
  delay?: number
  className?: string
}) {
  return <div className={className}>{children}</div>
}
export function SlideHeader({
  kicker,
  title,
  tone = 'brand',
  onDark = false,
  align = 'left',
  className = '',
}: {
  kicker?: string
  title: ReactNode
  tone?: Tone
  onDark?: boolean
  align?: 'left' | 'center'
  className?: string
}) {
  const color = accentByTone[tone]
  const centered = align === 'center'
  const carry = useContinuity()
  const KickerPart = carry.kicker ? Still : Reveal
  const TitlePart = carry.title ? Still : Reveal
  return (
    <RevealGroup
      className={`relative shrink-0 ${HEADER_MIN_H} ${
        centered ? 'text-center' : ''
      } ${className}`}
      stagger={0.08}
    >
      {!centered && (
        <span
          className="absolute -left-16 top-1 h-full w-[6px] rounded-pill"
          style={{ background: `linear-gradient(${color}, ${color}00)` }}
        />
      )}
      {kicker && (
        <KickerPart dir="right" className={centered ? 'mb-3 inline-block' : 'mb-3 block'}>
          <Kicker tone={tone} onDark={onDark}>
            {kicker}
          </Kicker>
        </KickerPart>
      )}
      <TitlePart dir="up">
        <h2
          className={`font-heading font-extrabold leading-tight ${
            centered ? 'text-slide-title-lg' : 'text-slide-title'
          } ${onDark ? 'text-white' : 'text-ink'}`}
        >
          {title}
        </h2>
      </TitlePart>
    </RevealGroup>
  )
}
