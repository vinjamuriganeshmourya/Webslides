import type { ReactNode } from 'react'
import { SlideBase } from '@/ui/SlideBase'
import { SlideHeader } from '@/ui/SlideHeader'
import { SlideLead } from '@/ui/SlideLead'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { FIGURE_MAX, figureClamp, type FigureSideProps } from './figureSide'

/**
 * THE PART THAT IS THE SAME IN ALL FOUR CANDIDATES, FACTORED OUT ON PURPOSE.
 *
 * The lab's claim is that the only variable between the four gallery slides is
 * the ARRANGEMENT of the well. If each candidate rendered its own `SlideBase`,
 * `SlideHeader` and `SlideLead`, that claim would be a promise rather than a
 * fact, and the first candidate to drift on its header would invalidate the
 * comparison without anyone noticing.
 *
 * THE HEADER IS OUTSIDE THE COLUMN LAYOUT, AND THAT IS WHY IT IS HERE.
 *
 * The concept (`kicker`) and its sub-concept (`title`) sit at the slide's own
 * top-left datum on EVERY content slide, whatever the figure is doing. They are
 * the room's answer to "where am I in this session", and an answer that moves
 * between slides is not an answer. `align-check.mjs` measures every body block
 * against the header's left edge as its datum, and `ContentImageSlides.tsx`
 * records what happened when the header did live inside the text column: it
 * started at x=664 on the left-media layout, six hundred pixels right of the
 * previous slide's, and the top-media layout put the concept name halfway down
 * the slide, after the picture.
 *
 * The lead is here for the same reason, drawn full width under the heading
 * rather than inside a column: it is the sentence for that heading, and dropped
 * into a 42%-wide points column it would start hundreds of pixels away from the
 * title it belongs to. `SlideLead` owns its own width cap (`max-w-3xl`) which
 * keeps the line clear of the instructor-video rectangle.
 *
 * Not a slide type in its own right and not offered as one: it has no opinion
 * about the well, which is the only interesting decision on these slides.
 */
export function FigureSideShell({
  kicker,
  title,
  lead,
  tone = 'brand',
  lesson,
  children,
}: Pick<FigureSideProps, 'kicker' | 'title' | 'lead' | 'tone' | 'lesson'> & {
  children: ReactNode
}) {
  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} tone={tone} />
        {lead && <SlideLead tone={tone}>{lead}</SlideLead>}
        {/*
          THE WELL, AND THE ONE VERTICAL DECISION IN THE LAB, MADE ONCE HERE.

          `justify-center` centres the block — the prose and the figure together,
          as one object. `figureClamp` is the padding that keeps that object out
          of the instructor-video reserve: it shrinks the box the block is
          centred within, so the block's top edge cannot be above y=224 however
          tall it gets. See `figureSide.ts` for the arithmetic.

          IT CENTRES THE BLOCK AND NEVER THE COLUMNS. Each candidate keeps
          `items-start` on its own row so the figure and the prose stay locked to
          a common top edge; centring is this container's job and the columns'
          relationship is theirs. `items-center` on a row would centre each column
          independently, which is `ContentSlide`'s defect and the reason the lab
          exists.
        */}
        <div className={`flex min-h-0 flex-1 flex-col ${figureClamp(lead)}`}>
          {/*
            `my-auto`, NOT `justify-center` ON THE PARENT, AND THIS IS THE CLAMP.

            Both centre a block that fits. They differ in the one case that
            matters: when the block is TALLER than the box it may be centred
            within, `justify-content: center` distributes the negative free space
            symmetrically and lets the block spill past the START edge, ignoring
            the padding that is supposed to be holding the line. Measured: with
            `justify-center`, `FigureLede` at five points put its block top at
            y=222, two pixels INSIDE the instructor-video reserve, on a container
            whose padding said y=224. A clamp that fails precisely when the block
            is tall is no clamp at all, and tall is exactly when it is needed.

            Auto margins resolve to ZERO when free space is negative. So the block
            centres while it fits and pins to the padding edge, y=224, the moment
            it does not — overflowing downward only. That is the required
            behaviour with no branch and no measurement.
          */}
          <div className="my-auto">{children}</div>
        </div>
      </div>
    </SlideBase>
  )
}

/**
 * THE FIGURE'S COLUMN, shared by all four candidates.
 *
 * It owns three things no call site should be deciding per slide:
 *
 *   1. THE WIDTH CAP — `FIGURE_MAX`, the one width token. `capped={false}` is
 *      for the bleed candidate, which is defined by not having one.
 *   2. THE ENTRANCE — a `RevealGroup` plus one `Reveal dir="up"`, which is what
 *      `ContentSlide` gives its `children`, so a figure animates in alongside the
 *      points rather than after them. `BulletList` gets `immediate` for the same
 *      reason: text and its supporting visual reveal together, never
 *      text-then-picture.
 *   3. THE CAPTION — under the figure, centred on the figure rather than on the
 *      slide, so it reads as belonging to the drawing.
 *
 * The video guard is deliberately NOT applied here. It belongs to whichever side
 * of the well the candidate puts the figure on, and one of the four (a figure at
 * the BOTTOM of the well, in `CaptionRail`) does not need it at all. A guard
 * hidden inside this component would be a `pt-[52px]` that nobody could see and
 * nobody could reason about.
 */
export function FigurePane({
  children,
  caption,
  capped = true,
  className = '',
}: {
  children: ReactNode
  caption?: ReactNode
  capped?: boolean
  className?: string
}) {
  /*
    THE TWO `data-figure-*` HOOKS ARE FOR MEASUREMENT, NOT FOR STYLING.

    "Is the figure centred in its own region" is a question with a number for an
    answer, and the number is `figure.left - region.left` against
    `region.right - figure.right`. Reading that off a screenshot by eye is how a
    9px skew ships. These two attributes make it a one-line `evaluate` in any
    harness, on any candidate, at any figure width — see the measurement table in
    this lab's CLAUDE.md, which was produced with them.

    `region` is whatever the candidate handed the figure: a grid column, a flex
    cell, or the whole well. `pane` is the capped figure itself.
  */
  return (
    /*
      The measurement hook is on a PLAIN wrapper outside `RevealGroup`, not on it:
      `RevealGroup` takes a fixed prop list and passes nothing through, and it is a
      kit file, so widening it here would be a divergent kit change. A wrapper
      ABOVE the group is safe — the rule it must not break is a wrapper BETWEEN the
      group and its `Reveal` children, which kills variant propagation.
    */
    <div data-figure-region className={`min-w-0 ${className}`}>
      <RevealGroup>
        <Reveal dir="up">
          <div data-figure-pane className={`w-full ${capped ? `${FIGURE_MAX} mx-auto` : ''}`}>
            {children}
            {caption && (
              <p
                className="mt-3 text-center text-body-sm leading-snug"
                style={{ color: colors.body }}
              >
                {caption}
              </p>
            )}
          </div>
        </Reveal>
      </RevealGroup>
    </div>
  )
}
