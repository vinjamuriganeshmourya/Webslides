import { SlideBase, SlideHeader, StepList } from '@/ui'
import { SlideLead } from '@/ui/SlideLead'
import { Reveal } from '@/motion/Reveal'
import type { ProceduralStepsSlideProps } from './types'
import { SLIDE_FAMILY } from '@/motion/continuity'

/**
 * PROCEDURAL STEPS — a numbered how-to on a light stage. The header sets the
 * scene, then <StepList> draws its connecting rail and staggers each step in.
 */
export function ProceduralStepsSlide({
  kicker,
  title,
  lead,
  steps,
  tone = 'brand',
  /**
   * Tighten the step spacing and drop the detail text a size.
   *
   * WHY THIS IS A PROP NOW, AND NOT JUST A STEP COUNT.
   *
   * It was `steps.length > 4` and nothing else, on the theory that a step count
   * predicts height. It does not: what fills the well is the number of LINES,
   * and a four-step list whose details each wrap to two lines is taller than a
   * five-step list of one-liners. Session 7's `hello-jenkins` slide is exactly
   * that shape, and after the lead moved out of the header it ended 4px inside
   * the control bar with no lever available in the deck — the copy was fine, the
   * step count was fine, and the automatic threshold said "not dense".
   *
   * So the count still decides by default, and a deck that knows better can say
   * so. Lowering the threshold to `> 3` instead was the other option and it was
   * worse: it would have re-spaced every four-step slide in every session to fix
   * one slide, which is a whole-repo visual change bought with no argument.
   */
  dense: denseProp,
  lesson,
}: ProceduralStepsSlideProps) {
  const dense = denseProp ?? steps.length > 4

  return (
    <SlideBase variant="light" lesson={lesson}>
      {/*
        THE HEADER IS PINNED, THE STEPS CENTRE BELOW IT (content rule 19).

        This whole column used to be `justify-center`, which centred the HEADER
        as well as the steps: a three-step slide dropped its kicker and title
        into the middle of the frame while a five-step slide kept them near the
        top, so the one thing the room uses to answer "where am I in this
        session" moved from slide to slide. Session 4's review caught it on the
        verify slide: *"format the slide, the title and sidehead should be on
        top"*.

        Same shape as `ContentSlide` now: the header sits at the slide's own
        top-left datum, and only the well below it centres its contents.
      */}
      <div className="flex h-full flex-col">
        <Reveal dir="up">
          <SlideHeader kicker={kicker} title={title} tone={tone} />
        </Reveal>
        {/*
          The point opens the well, between the heading and the first numbered
          step, and OUTSIDE the centred block below for the same reason as on
          `ContentSlide`. It stays outside `StepList` so it is not drawn against
          the rail the list runs down its steps, which would read as an unnumbered
          step.
        */}
        {lead && <SlideLead tone={tone}>{lead}</SlideLead>}
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <StepList
            steps={steps}
            tone={tone}
            className={`max-w-4xl ${dense ? '[&_ol]:space-y-3 [&_p]:text-body-sm' : ''}`}
          />
        </div>
      </div>
    </SlideBase>
  )
}

/*
  Part of the light content family: these layouts can flow into one another
  inside a concept, so `SlideHeader` holds an unchanged kicker still instead of
  replaying its entrance. See `src/motion/continuity.ts`.
*/
ProceduralStepsSlide.family = SLIDE_FAMILY.content
