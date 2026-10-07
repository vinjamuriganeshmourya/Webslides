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

    A header stops at y=168 instead of the old y=216 (see `HEADER_MIN_H`), which
    is the point: with no lead under it, the bullets move up into the space a lead
    was reserving. A wide figure cannot follow them, because the top
    right of the canvas (x 913..1280, y 0..220) is held for the instructor video and
    every side visual in this deck is wide enough to reach into it.

    So the recovered 48px goes to the text column only, and the visual keeps the
    old floor. Drop this and `node video-safe.mjs` fails on every lead-less slide
    that carries a figure.
  */
  /*
    THE 3px IS NOT A FUDGE, IT IS THE MEASURED GAP.

    This used to be `lead ? '' : 'pt-[52px]'`, on the belief stated in the comment
    below that "a slide with a lead starts its body below y=220". It does not. The
    well's top with a one-line lead measures **y=217**, three pixels INSIDE the
    instructor-video reserve (x 913..1280, y 0..220), so a full-width figure flush
    to the top of the well sits in the reserve and `video-safe.mjs` fails.

    It went unnoticed because it only fires when a figure is tall enough to reach
    the well's top edge. The well centres its content, so a short figure never
    does. Three separate figure labs hit it the moment a candidate grew: two
    landed at y=217 and one at y=222.

    THAT CASE IS NOW CLOSED, BY AUTO MARGINS. The well no longer says
    `justify-center`; the body block carries `my-auto`. `justify-content: center`
    distributed NEGATIVE free space symmetrically, so an oversized block spilled
    past the start edge and ignored this padding entirely — measured on the
    gallery's oversized fixture, a 703px block in a 439px well put its top at
    **y=85**, a hundred and thirty pixels inside the reserve, on a well whose top
    edge is 217. Auto margins resolve to ZERO when free space is negative, so
    they centre while the block fits and pin it to the well's top edge when it
    does not, overflowing downward only. The same fixture now measures y=217,
    with the guard's padding intact on top of that.

    It is safe to push into a signed-off deck because it cannot move a block that
    FITS: with positive free space `my-auto` and `justify-center` compute the
    same offset, which was verified by measurement on both branches of this
    layout before it was taken. Only the already-broken oversized case changes.
    `slide-kit/figure-side-lab`'s CLAUDE.md records the same finding
    independently (a candidate at y=222 under `justify-center`, y=224 under
    `my-auto`).
  */
  const visualGuard = lead ? 'pt-[3px]' : 'pt-[52px]'
  /*
    WHY THAT TEST STILL READS `lead`, NOW THAT THE LEAD IS NOT IN THE HEADER.

    It is measuring the same thing it always was: whether anything sits between the
    top of the content well and the first row of the body. That used to be a lead
    inside a 168px header; it is now a lead inside the well, one line of 22px type
    plus its bottom margin, which is the same 50-odd pixels. Either way a slide with
    a lead starts its body at y=217 and a slide without one does not. That 217 is
    three pixels above the y=220 reserve floor, which is what the guard above pays.
  */
  return (
    <SlideBase variant="light" lesson={lesson}>
      {/* Header pinned top-left at a fixed position; body content centers in the well BELOW it, not on the slide. */}
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} tone={tone} />

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

        {/*
          Text and its supporting visual animate IN PARALLEL, both on slide
          entry. Previously the bullets were click-gated `Step`s and the visual
          was wrapped in a further `Step`, so the visual could not appear until
          every bullet had been clicked through: the pair read as two sequential
          halves instead of one idea. Now the list staggers itself in
          (`immediate`) and the visual reveals alongside it.
        */}
        {/*
          The well, and ONE block inside it carrying `my-auto`. The block is a
          single flex item on purpose: auto margins share the free space between
          every auto margin in the axis, so two `my-auto` siblings would push
          each other apart instead of centring as one object. Centre the block,
          never the parts of it.
        */}
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          {points && children ? (
            /*
              By default the text column gets more of the width than the visual.
              At an even split a long bullet wraps to two lines while its
              neighbours stay on one, and the wrapped bullet reads as though it
              were set larger even though every bullet is the same 22px. Giving
              the prose the extra room keeps the bullets visually equal without
              shortening the copy.

              That default is wrong for a wide figure, which is what `split`
              exists for: 463px is under the width a `Terminal` needs and it
              breaks an image name mid-token rather than shearing the line.
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
