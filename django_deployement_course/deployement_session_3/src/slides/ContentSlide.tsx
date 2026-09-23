import { SlideBase } from '@/ui/SlideBase'
import { SlideHeader } from '@/ui/SlideHeader'
import { SlideLead } from '@/ui/SlideLead'
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
  /*
    WHY THAT TEST STILL READS `lead`, NOW THAT THE LEAD IS NOT IN THE HEADER.

    It is measuring the same thing it always was: whether anything sits between the
    top of the content well and the first row of the body. That used to be a lead
    inside a 168px header; it is now a lead inside the well, one line of 22px type
    plus its bottom margin, which is the same 50-odd pixels. Either way a slide with
    a lead starts its body below y=220 and a slide without one does not.
  */
  return (
    <SlideBase variant="light" lesson={lesson}>
      {/* Header pinned top-left at a fixed position; body content centers in the well BELOW it, not on the slide. */}
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} tone={tone} />

        {/*
          Text and its supporting visual animate IN PARALLEL, both on slide
          entry. Previously the bullets were click-gated `Step`s and the visual
          was wrapped in a further `Step`, so the visual could not appear until
          every bullet had been clicked through: the pair read as two sequential
          halves instead of one idea. Now the list staggers itself in
          (`immediate`) and the visual reveals alongside it.
        */}
        {/*
          The point, first in the well and full width of the text area rather than
          inside the left column, so it reads as the lead-in sentence to the whole
          slide and not as a caption on the bullets.

          IT SITS OUTSIDE THE CENTRED BLOCK, DIRECTLY UNDER THE HEADING. Inside it,
          the lead was centred along with the bullets and the figure, so on a slide
          with little body copy it drifted down the canvas and read as the first
          line of the body rather than as the sentence introducing it. Kept here it
          stays pinned under the title, and only the body below it centres in
          whatever height is left.
        */}
        {lead && <SlideLead tone={tone}>{lead}</SlideLead>}

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
