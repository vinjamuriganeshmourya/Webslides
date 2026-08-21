import { SlideBase, SlideHeader, StepList } from '@/ui'
import { Reveal } from '@/motion/Reveal'
import type { ProceduralStepsSlideProps } from './types'

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
          <SlideHeader kicker={kicker} title={title} lead={lead} tone={tone} />
        </Reveal>
        <StepList
          steps={steps}
          tone={tone}
          className={`mt-6 max-w-4xl ${dense ? '[&_ol]:space-y-3 [&_p]:text-body-sm' : ''}`}
        />
      </div>
    </SlideBase>
  )
}
