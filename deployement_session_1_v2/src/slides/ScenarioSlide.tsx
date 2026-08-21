import { SlideBase, SlideHeader, ScenarioCard } from '@/ui'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import type { ScenarioSlideProps } from './types'
import { SLIDE_FAMILY } from '@/motion/continuity'

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

/*
  Part of the light content family: these layouts can flow into one another
  inside a concept, so `SlideHeader` holds an unchanged kicker still instead of
  replaying its entrance. See `src/motion/continuity.ts`.
*/
ScenarioSlide.family = SLIDE_FAMILY.content
