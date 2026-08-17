import { SlideBase } from '@/ui/SlideBase'
import { SlideHeader } from '@/ui/SlideHeader'
import { BulletList } from '@/ui/content'
import { Callout } from '@/ui/Callout'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import type { ContentNoteSlideProps } from './types'

/**
 * CONTENT WITH A NOTE — header (+optional bullets) up top, with an emphasized
 * Callout anchored to the lower area as the key takeaway.
 */
export function ContentNoteSlide({
  kicker,
  title,
  lead,
  points,
  tone = 'brand',
  note,
  children,
  lesson,
}: ContentNoteSlideProps) {
  return (
    <SlideBase variant="light" lesson={lesson}>
      <RevealGroup className="flex h-full flex-col" stagger={0.1}>
        <Reveal dir="up">
          <SlideHeader kicker={kicker} title={title} lead={lead} tone={tone} />
        </Reveal>

        {points && (
          <Reveal dir="up">
            <BulletList items={points} tone={tone} className="mt-6" />
          </Reveal>
        )}

        {children && (
          <Reveal dir="up">
            <div className="mt-6">{children}</div>
          </Reveal>
        )}

        <Reveal dir="up" className={`mt-auto ${points ? 'pt-8' : 'pt-6'}`}>
          <Callout
            kind={note.kind}
            title={note.title}
            className="max-w-none text-body-lg shadow-card ring-1 ring-black/[0.04]"
          >
            {note.body}
          </Callout>
        </Reveal>
      </RevealGroup>
    </SlideBase>
  )
}
