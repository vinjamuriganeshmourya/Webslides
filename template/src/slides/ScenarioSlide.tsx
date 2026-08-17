import { SlideBase, SlideHeader, ScenarioCard } from '@/ui'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import type { ScenarioSlideProps } from './types'

/**
 * SCENARIO EXPLANATION — a compact header over a ScenarioCard that walks
 * through a situation and its narrative beats (e.g. Situation → Action → Result).
 */
export function ScenarioSlide({
  kicker = 'Scenario',
  title,
  situation,
  persona,
  beats,
  lesson,
}: ScenarioSlideProps) {
  return (
    <SlideBase variant="light" lesson={lesson}>
      <RevealGroup className="flex h-full flex-col" stagger={0.08}>
        <Reveal dir="up">
          <SlideHeader kicker={kicker} title={title} />
        </Reveal>
        <Reveal dir="up" delay={0.05} className="flex-1">
          <ScenarioCard
            situation={situation}
            persona={persona}
            beats={beats}
            className="mt-5"
          />
        </Reveal>
      </RevealGroup>
    </SlideBase>
  )
}
