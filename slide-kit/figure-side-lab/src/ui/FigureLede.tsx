import { BulletList } from '@/ui/content'
import { FigureSideShell, FigurePane } from './FigureSideShell'
import type { FigureSideProps } from './figureSide'

/**
 * CANDIDATE 2 — FIGURE LEDE. The figure is the lede: 58% of the well, and
 * OPTICALLY CENTRED IN ITS OWN CELL. The points are 42% and sit at the block's
 * top edge. It is the one candidate here that trades the shared top edge away on
 * purpose, and the trade is the thing being tested.
 *
 * THE BET. Two asymmetries, and they are different asymmetries on purpose.
 *
 * WIDTH: on a slide built around a `Terminal` or a `DataTable`, the figure is
 * what the room is being asked to read and the points are the reason to read it.
 * An even split says the two are peers. 58/42 says which one is the slide. That
 * is also the direction `ContentSlide` gets wrong rather than merely misses: it
 * hands the PROSE 1.4fr and the figure 1fr, which is right when the children are
 * a small decoration and backwards when they are a terminal.
 *
 * ALIGNMENT: the figure centres, the points do not. A figure has one natural
 * vertical position — the middle of its column — because it is one object. A
 * point list does not: it is read top to bottom, and centring it means a
 * two-bullet list starts a third of the way down the slide with nothing above
 * it, which is `ContentSlide`'s float defect relocated into the text. Top-aligned
 * against the well's own top edge, a short list starts where a long list starts,
 * so consecutive slides in a concept do not jump.
 *
 * WORST AT, AND IT IS A DELIBERATE TRADE RATHER THAN AN OVERSIGHT: THE FIGURE
 * IS THE ONE THING IN THIS LAB THAT IS NOT ON THE SHARED TOP EDGE. Optical
 * centring is this candidate's whole distinguishing idea, and the price is that
 * the figure's top edge is a function of the figure's own height: on the login
 * fixture it sits 75px below the first bullet, and it moves as the figure grows
 * or shrinks. Two consequences a picker has to weigh:
 *
 *   - Across consecutive slides of one concept, two figures of different
 *     heights sit at two different y values, which is the between-slides jump
 *     the anchor exists to stop. The points do not jump; the figure does.
 *   - Stress-tested at five points on slide 11 of this gallery: the figure is
 *     centred in a cell whose height is the PROSE's height, so as the prose grows
 *     the figure slides down away from it. Delta measures 15px at two points and
 *     142px at five, and at five the two read as unrelated blocks that happen to
 *     be adjacent.
 *   - It is also the only candidate with no vertical headroom left: at five
 *     points the block is 437px against the clamp's 432px allowance, so it pins
 *     to the y=224 floor and runs 5px past the well's bottom edge. Safe, but it
 *     is the one that will break first.
 *
 * `SplitWell` is the candidate to reach for if that trade is not worth it. This
 * one is worth having in the lab precisely because it is the only one that
 * argues centring is worth a datum.
 *
 * ALSO WORST AT: RUNNING OUT OF HEIGHT A BULLET EARLIER THAN `SplitWell`. The
 * prose column is 42% rather than 50%, so every bullet wraps to one more line,
 * and at five points the last one lands at y=628 — under the deck's own control
 * bar, which `align-check.mjs` reports as CHROME on slide 11 of this gallery.
 * The same five points fit on `SplitWell`. Emphasis on the figure is paid for in
 * the prose column's vertical budget, not only in its width.
 *
 * ALSO WORST AT: the same width ceiling as `SplitWell`, only slightly relieved.
 * 58% of the well is 636px, which is 260px short of what session 6's `docker
 * push` refusal needs, so it wraps a wide `Terminal` mid-token exactly as
 * `SplitWell` does. The 58/42 split buys emphasis, not width.
 */
export function FigureLede({
  kicker,
  title,
  lead,
  points,
  figure,
  caption,
  tone = 'brand',
  lesson,
}: FigureSideProps) {
  return (
    <FigureSideShell kicker={kicker} title={title} lead={lead} tone={tone} lesson={lesson}>
      {/*
        `items-stretch`, WHICH IS THIS CANDIDATE'S DELIBERATE BREAK FROM THE
        SHARED TOP EDGE. Both cells take the row's height, the prose pins to the
        top of its cell, and the figure centres inside its own — so the figure's
        top edge is a function of the row's height, and the row's height is the
        prose. That is the trade the candidate exists to test, and the header says
        what it costs. Every other candidate uses `items-start`.

        The shell still centres the whole row in the well and still clamps it off
        the video reserve, exactly as it does for the others.
      */}
      <div className="grid grid-cols-[42fr_58fr] items-stretch gap-10">
        <div className="min-w-0">
          {points && <BulletList items={points} tone={tone} immediate />}
        </div>
        {/*
          `w-full` ON THE PANE, and it is not decoration.

          The pane is a flex ITEM here, and a flex item is sized by its content
          unless told otherwise, so `w-full max-w-[980px]` inside it resolved
          against the pane's own shrink-to-fit width: the terminal rendered at
          308px in a 636px column, which is the 468px-figure-in-a-full-width-block
          defect that `align-check.mjs` was written to catch, reintroduced by the
          centring wrapper. Caught by looking at the render, not at the code.
        */}
        <div className="flex min-w-0 items-center">
          <FigurePane caption={caption} className="w-full">
            {figure}
          </FigurePane>
        </div>
      </div>
    </FigureSideShell>
  )
}
