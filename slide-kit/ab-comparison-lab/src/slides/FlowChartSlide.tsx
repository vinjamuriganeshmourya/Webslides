import { SlideBase, SlideHeader, FlowChart } from '@/ui'
import type { FlowChartSlideProps } from './types'
import { SLIDE_FAMILY } from '@/motion/continuity'

/**
 * FLOW CHART — a header over a centered node → arrow → node sequence.
 * The <FlowChart> owns its own reveal stagger, so nodes animate in on entry.
 */
export function FlowChartSlide({
  kicker,
  title,
  lead,
  nodes,
  direction = 'horizontal',
  lesson,
}: FlowChartSlideProps) {
  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} lead={lead} />
        <div className="mt-8 grid flex-1 place-items-center">
          <FlowChart nodes={nodes} direction={direction} className="w-full" />
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
FlowChartSlide.family = SLIDE_FAMILY.content
