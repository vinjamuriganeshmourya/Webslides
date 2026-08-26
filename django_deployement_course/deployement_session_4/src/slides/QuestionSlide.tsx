import { SlideBase } from '@/ui/SlideBase'
import { Kicker } from '@/ui/primitives'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import type { QuestionSlideProps } from './types'

/**
 * QUESTION — the pause beat. One question, centred, and nothing else.
 *
 * WHY THIS IS ITS OWN TYPE
 *
 * A question posed to the room was previously written as a `ContentSlide` with
 * a `lead` and no points. That inherits the content layout: the header sits
 * top-left at its usual size and the body well below it is simply empty, so the
 * slide reads as a content slide someone forgot to finish. The question is also
 * set at lead size, which is smaller than the title above it, so the one thing
 * the room is meant to think about is not the largest thing on screen.
 *
 * This type inverts that. There is no header block and no body well: the
 * question IS the slide, set at hero scale and optically centred. The emptiness
 * is deliberate and looks deliberate.
 *
 * WHAT IT MUST NOT CARRY
 *
 * No bullets, no figure, no callout, no answer. A question slide exists so the
 * room answers out loud before the next slide responds, and anything else on it
 * is something to read instead of think. If a slide needs supporting content,
 * it is a `ContentSlide` whose lead happens to end in a question mark, and that
 * is a different slide.
 *
 * One question per slide. A compound question ("what happens, and why?") gets
 * split, for the same reason a slide carries one idea.
 */
export function QuestionSlide({
  kicker = 'A question first',
  question,
  qualifier,
  tone = 'brand',
  lesson,
}: QuestionSlideProps) {
  return (
    <SlideBase variant="light" lesson={lesson}>
      {/*
        Centred in the WHOLE canvas, not in a well below a header. The video
        rectangle (x 913..1280, y 0..220) is respected by the max-width: the
        block is capped at 880px and centred, so it spans x 200..1080 and its
        top never rises above the vertical centre of the slide.
      */}
      <div className="flex h-full flex-col items-center justify-center px-16 text-center">
        <RevealGroup stagger={0.14}>
          <Reveal dir="up">
            <Kicker tone={tone}>{kicker}</Kicker>
          </Reveal>
          <Reveal dir="up">
            <p
              className="mx-auto mt-6 max-w-[880px] font-heading text-[44px] font-extrabold leading-[1.14]"
              style={{ color: colors.ink }}
            >
              {question}
            </p>
          </Reveal>
          {qualifier && (
            <Reveal dir="up">
              <p
                className="mx-auto mt-6 max-w-[720px] text-body-lg font-medium"
                style={{ color: colors.body }}
              >
                {qualifier}
              </p>
            </Reveal>
          )}
        </RevealGroup>
      </div>
    </SlideBase>
  )
}
