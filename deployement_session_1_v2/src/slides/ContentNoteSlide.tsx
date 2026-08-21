import { SlideBase } from '@/ui/SlideBase'
import { SlideHeader } from '@/ui/SlideHeader'
import { BulletList } from '@/ui/content'
import { Callout } from '@/ui/Callout'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import type { ContentNoteSlideProps } from './types'
import { SLIDE_FAMILY } from '@/motion/continuity'

/**
 * CONTENT WITH A NOTE — header (+optional bullets) up top, with an emphasized
 * Callout anchored to the lower area as the key takeaway.
 */
export function ContentNoteSlide({
  kicker,
  title,
  lead,
  points,
  /**
   * Render the note ABOVE the points. Used where the note is the definition being
   * taught and the points are supporting evidence for it, so the thing being
   * defined should be read first.
   */
  noteFirst = false,
  tone = 'brand',
  note,
  children,
  lesson,
}: ContentNoteSlideProps) {
  return (
    <SlideBase variant="light" lesson={lesson}>
      {/*
        `pb-20` biases the centred body group upward. With the paired auto margins
        below, free space splits evenly, which puts the group dead centre and
        slightly low against the header. Reserving padding at the bottom shrinks the
        space being split, so the group lifts by half that padding while staying
        centred within what remains.
      */}
      <RevealGroup className="flex h-full flex-col pb-20" stagger={0.1}>
        <Reveal dir="up">
          <SlideHeader kicker={kicker} title={title} lead={lead} tone={tone} />
        </Reveal>

        {/*
          VERTICAL CENTRING WITHOUT RESTRUCTURING
          The header stays pinned at the top; everything after it is centred in the
          leftover height. That is done with paired auto margins (`mt-auto` on the
          first body block, `mb-auto` on the note) rather than by wrapping these in
          a flex container, because `RevealGroup` is a framer-motion component and
          a plain wrapper div would break variant propagation, killing the entrance
          stagger on every child.

          Previously the note carried `mt-auto` alone, which pinned it to the floor.
          That reads fine with several bullets but on a sparse slide it left the
          bullet stranded at the top and the note at the bottom with a hole between.
        */}
        {/* `noteFirst` swaps the order: the note carries the top auto margin and the
            points carry the bottom one, so the pair stays centred either way. */}
        {noteFirst && (
          <Reveal dir="up" className="mt-auto">
            <Callout
              kind={note.kind}
              title={note.title}
              icon={note.icon}
              className="max-w-none text-body-lg shadow-card ring-1 ring-black/[0.04]"
            >
              {note.body}
            </Callout>
          </Reveal>
        )}

        {points && (
          <Reveal dir="up" className={noteFirst ? 'mb-auto mt-14' : 'mt-auto'}>
            <BulletList items={points} tone={tone} className="mt-6" />
          </Reveal>
        )}

        {children && (
          <Reveal dir="up" className={points || noteFirst ? undefined : 'mt-auto'}>
            <div className="mt-6">{children}</div>
          </Reveal>
        )}

        {!noteFirst && (
          <Reveal dir="up" className={`mb-auto ${points || children ? 'mt-16' : 'mt-10'}`}>
            <Callout
              kind={note.kind}
              title={note.title}
              icon={note.icon}
              className="max-w-none text-body-lg shadow-card ring-1 ring-black/[0.04]"
            >
              {note.body}
            </Callout>
          </Reveal>
        )}
      </RevealGroup>
    </SlideBase>
  )
}

/*
  Part of the light content family: these layouts can flow into one another
  inside a concept, so `SlideHeader` holds an unchanged kicker still instead of
  replaying its entrance. See `src/motion/continuity.ts`.
*/
ContentNoteSlide.family = SLIDE_FAMILY.content
