import { SlideBase, SlideHeader, NumberBadge } from '@/ui'
import { Step } from '@/motion/Stepper'
import type { AgendaSlideProps } from './types'

/**
 * AGENDA — the roadmap for today. Light stage, numbered rows in a single
 * column, spilling into two columns once the list grows past five items.
 */
export function AgendaSlide({
  kicker = 'Agenda',
  title = 'What we’ll cover today',
  lead,
  items,
  lesson,
}: AgendaSlideProps) {
  const twoCols = items.length > 5

  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} lead={lead} />

        <ul
          className={`mt-8 flex-1 content-center ${
            twoCols ? 'grid grid-cols-2 gap-x-8 gap-y-4' : 'flex flex-col gap-4'
          }`}
        >
          {items.map((item, i) => (
            <Step as="li" dir="left" key={i} className="flex items-center gap-4">
              <NumberBadge n={i + 1} />
              {/* Uniform card height whether or not a sub-line exists. */}
              <div className="min-h-[5rem] flex-1 rounded-card border border-line bg-white px-5 py-4 shadow-card-soft">
                <p className="font-heading text-lg font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 text-body">{item.sub ?? ' '}</p>
              </div>
            </Step>
          ))}
        </ul>
      </div>
    </SlideBase>
  )
}
