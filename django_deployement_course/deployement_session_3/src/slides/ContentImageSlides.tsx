import { motion } from 'framer-motion'
import { SlideBase } from '@/ui/SlideBase'
import { SlideHeader } from '@/ui/SlideHeader'
import { SlideLead } from '@/ui/SlideLead'
import { BulletList } from '@/ui/content'
import { Media } from './Media'
import type { ContentImageSlideProps } from './types'
import { SLIDE_FAMILY } from '@/motion/continuity'

type Position = 'left' | 'right' | 'top' | 'bottom'

/** Framed media block with entrance animation. */
function MediaFrame({
  media,
  caption,
  className = '',
}: Pick<ContentImageSlideProps, 'media' | 'caption'> & { className?: string }) {
  const isIllustration = 'illustration' in media
  return (
    <motion.figure
      className={`relative flex flex-col ${className}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`relative flex-1 overflow-hidden rounded-card ${
          isIllustration
            ? 'grid place-items-center bg-brand-soft p-6'
            : 'bg-white shadow-card ring-1 ring-line'
        }`}
      >
        <span className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-2xl bg-accent-500/15" />
        <Media
          media={media}
          className={isIllustration ? 'h-full max-h-full w-auto' : 'h-full w-full'}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-body-sm text-body">{caption}</figcaption>
      )}
    </motion.figure>
  )
}

function ContentWithImage({
  position,
  kicker,
  title,
  lead,
  points,
  tone = 'brand',
  media,
  caption,
  children,
  lesson,
}: ContentImageSlideProps & { position: Position }) {
  const text = (
    <div className="flex h-full flex-col">
      <SlideHeader kicker={kicker} title={title} tone={tone} />
      {/*
        The point sits in the text half, above the bullets and level with the
        media rather than beside it. The heading itself lives in this half on
        every one of the four positions, so hoisting the lead out to span the
        whole slide would part it from the title it is the sentence for. Here it
        opens the text column's well, which is the same reading order as on a
        text-only slide.
      */}
      {lead && <SlideLead tone={tone}>{lead}</SlideLead>}
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        {points && <BulletList items={points} tone={tone} />}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )

  const horizontal = position === 'left' || position === 'right'

  if (horizontal) {
    const media_first = position === 'left'
    return (
      <SlideBase variant="light" lesson={lesson}>
        <div className="grid h-full grid-cols-2 items-center gap-12">
          {media_first ? (
            <>
              <MediaFrame media={media} caption={caption} className="h-[72%]" />
              {text}
            </>
          ) : (
            <>
              {text}
              <MediaFrame media={media} caption={caption} className="h-[72%]" />
            </>
          )}
        </div>
      </SlideBase>
    )
  }

  // vertical: top / bottom
  const media_first = position === 'top'
  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="flex h-full flex-col gap-6">
        {media_first ? (
          <>
            <MediaFrame media={media} caption={caption} className="h-[46%]" />
            {text}
          </>
        ) : (
          <>
            {text}
            <MediaFrame media={media} caption={caption} className="h-[46%]" />
          </>
        )}
      </div>
    </SlideBase>
  )
}

export const ContentLeftImageSlide = (p: ContentImageSlideProps) => (
  <ContentWithImage position="left" {...p} />
)
export const ContentRightImageSlide = (p: ContentImageSlideProps) => (
  <ContentWithImage position="right" {...p} />
)
export const ContentTopImageSlide = (p: ContentImageSlideProps) => (
  <ContentWithImage position="top" {...p} />
)
export const ContentBottomImageSlide = (p: ContentImageSlideProps) => (
  <ContentWithImage position="bottom" {...p} />
)

/*
  Part of the light content family: these layouts can flow into one another
  inside a concept, so `SlideHeader` holds an unchanged kicker still instead of
  replaying its entrance. See `src/motion/continuity.ts`.
*/
ContentLeftImageSlide.family = SLIDE_FAMILY.content
ContentRightImageSlide.family = SLIDE_FAMILY.content
ContentTopImageSlide.family = SLIDE_FAMILY.content
ContentBottomImageSlide.family = SLIDE_FAMILY.content
