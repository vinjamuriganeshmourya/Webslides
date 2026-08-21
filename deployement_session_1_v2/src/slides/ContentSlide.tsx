import { SlideBase } from '@/ui/SlideBase'
import { SlideHeader } from '@/ui/SlideHeader'
import { BulletList } from '@/ui/content'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import type { ContentSlideProps } from './types'
import { SLIDE_FAMILY } from '@/motion/continuity'

/**
 * CONTENT — a clean, single-focus text slide (no media). Standard header,
 * then bullet points and/or free-form children. When both are supplied they
 * sit side by side; otherwise a single centered column.
 */
export function ContentSlide({
  kicker,
  title,
  lead,
  points,
  tone = 'brand',
  children,
  lesson,
}: ContentSlideProps) {

  /*
    VIDEO-BOX GUARD FOR THE SIDE VISUAL.

    A lead-less header now stops at y=168 instead of y=216 (see
    `HEADER_MIN_H_NO_LEAD`), which is the point: the bullets move up into the space
    a missing lead was reserving. A wide figure cannot follow them, because the top
    right of the canvas (x 913..1280, y 0..220) is held for the instructor video and
    every side visual in this deck is wide enough to reach into it.

    So the recovered 48px goes to the text column only, and the visual keeps the
    old floor. Drop this and `node video-safe.mjs` fails on every lead-less slide
    that carries a figure.
  */
  const visualGuard = lead ? '' : 'pt-[52px]'
  return (
    <SlideBase variant="light" lesson={lesson}>
      {/* Header pinned top-left at a fixed position; body content centers in the well BELOW it, not on the slide. */}
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} lead={lead} tone={tone} />

        {/*
          Text and its supporting visual animate IN PARALLEL, both on slide
          entry. Previously the bullets were click-gated `Step`s and the visual
          was wrapped in a further `Step`, so the visual could not appear until
          every bullet had been clicked through: the pair read as two sequential
          halves instead of one idea. Now the list staggers itself in
          (`immediate`) and the visual reveals alongside it.
        */}
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          {points && children ? (
            /*
              The text column gets more of the width than the visual. At an even
              split a long bullet wraps to two lines while its neighbours stay on
              one, and the wrapped bullet reads as though it were set larger even
              though every bullet is the same 22px. Giving the prose the extra
              room keeps the bullets visually equal without shortening the copy.
            */
            <div className="grid grid-cols-[1.4fr_1fr] items-center gap-10">
              <BulletList items={points} tone={tone} immediate />
              <RevealGroup className={visualGuard}>
                <Reveal dir="up">{children}</Reveal>
              </RevealGroup>
            </div>
          ) : (
            <>
              {points && <BulletList items={points} tone={tone} immediate />}
              {children && (
                <RevealGroup className={visualGuard}>
                  <Reveal dir="up">{children}</Reveal>
                </RevealGroup>
              )}
            </>
          )}
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
ContentSlide.family = SLIDE_FAMILY.content
