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
  lesson,
}: ProceduralStepsSlideProps) {
  const dense = steps.length > 4

  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="flex h-full flex-col justify-center">
        <Reveal dir="up">
          <SlideHeader kicker={kicker} title={title} tone={tone} />
        </Reveal>
        {/*
          The point opens the well, between the heading and the first numbered
          step. It stays outside `StepList` so it is not drawn against the rail
          the list runs down its steps, which would read as an unnumbered step.
        */}
        {lead && <SlideLead tone={tone}>{lead}</SlideLead>}
        <StepList
          steps={steps}
          tone={tone}
          className={`mt-6 max-w-4xl ${dense ? '[&_ol]:space-y-3 [&_p]:text-body-sm' : ''}`}
        />
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
