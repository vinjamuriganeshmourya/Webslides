import { SlideBase, ZonedFrame, StepList } from '@/ui'
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
    <SlideBase variant="light" lesson={lesson} padded={false}>
      {/* ZONED (content rule 22). This used to centre the HEADER with the steps,
          so the kicker and title sat at a different height from every other
          content slide. The header now stays in its zone and only the steps
          centre. */}
      <ZonedFrame kicker={kicker} title={title} lead={lead} tone={tone}>
        <StepList
          steps={steps}
          tone={tone}
          className={`max-w-4xl ${dense ? '[&_ol]:space-y-3 [&_p]:text-body-sm' : ''}`}
        />
      </ZonedFrame>
    </SlideBase>
  )
}

/*
  Part of the light content family: these layouts can flow into one another
  inside a concept, so `SlideHeader` holds an unchanged kicker still instead of
  replaying its entrance. See `src/motion/continuity.ts`.
*/
ProceduralStepsSlide.family = SLIDE_FAMILY.content
