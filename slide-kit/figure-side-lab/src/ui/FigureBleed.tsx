import { BulletList } from '@/ui/content'
import { FigureSideShell, FigurePane } from './FigureSideShell'
import type { FigureSideProps } from './figureSide'

/**
 * CANDIDATE 3 — FIGURE BLEED. A narrow prose column on the left, and the figure
 * runs off the right edge of the stage.
 *
 * THE BET. Every other candidate leaves a gutter: the well stops at x=1216
 * because `SlideBase` pads the content region by 64px, so a figure capped inside
 * a right-hand column ends 64px short of the stage and the last thing the room
 * sees on that side is empty ground. On a slide whose figure is the point, that
 * 64px is the most valuable strip on the canvas and it is being spent on
 * symmetry with a left margin the figure does not share.
 *
 * So the figure gives up the right margin (`-mr-16`) and gives up its width cap.
 * The figure is then the widest thing on any slide in the deck and unmistakably
 * the subject, and the prose column narrows to 34% and stays left-aligned on the
 * header's datum, which is where `align-check.mjs` measures from.
 *
 * The bleed also does something the other three cannot: it makes the figure's
 * width a function of the well rather than of a cap, so a wide `Terminal` gets
 * 826px here against 546px in `SplitWell`, without a per-slide number.
 *
 * WORST AT: A FIGURE THAT CANNOT GIVE UP ITS RIGHT RADIUS. A bleed reads as a
 * bleed only when the surface is cut by the stage edge. The kit's `Terminal`
 * carries `rounded-card` on its own outermost div and takes no prop to drop it,
 * so it bleeds to the edge with both right corners still rounded and reads as a
 * panel shoved off the slide rather than as one continuing past it. Same for
 * `CodeBlock` and `DataTable`. Adopting this candidate means a `bleed` prop on
 * five figures, which is the real cost of the 64px it recovers — and it is a kit
 * change to signed-off components, not a layout change.
 *
 * ALSO WORST AT: A CAPTION. The caption centres on the figure, and a figure that
 * runs off the stage has its centre 32px right of the slide's, so the caption
 * sits visibly off-axis from everything above it. And the drop shadow on the
 * bled edge is clipped by `overflow-hidden` on `SlideBase`, so the surface loses
 * its lighting exactly where it is largest (STYLE_GUIDE section 9).
 *
 * ALSO WORST AT: more than three bullets. 34% of the well is 371px, so a bullet
 * of more than about eight words wraps to three lines and the column reads as a
 * paragraph rather than as a list.
 */
export function FigureBleed({
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
        `items-start`: the prose and the bled figure share a top edge and hold it
        as either grows. The shell centres the pair in the well. An earlier
        version centred each column independently, which put the terminal's top
        edge 75px below the first bullet and made the figure's position a
        function of the copy — the defect this lab exists to remove.
      */}
      <div className="grid grid-cols-[34fr_66fr] items-start gap-8">
        <div className="min-w-0">
          {points && <BulletList items={points} tone={tone} immediate />}
        </div>
        {/*
          60px, NOT 64. `SlideBase` pads the content region by `px-16`, so
          `-mr-16` cancels it exactly and the figure lands flush with x=1280.
          That is what a bleed means, and `qa.mjs` fails it: the harness measures
          overflow against `sr.right - 4`, a deliberate 4px inset margin, so
          ANYTHING flush with the stage edge reports `overRight: 4`. Confirmed on
          this candidate, which reported exactly that, alongside `SlideBase`'s own
          `inset-0` decor layer reporting the same 4.

          A candidate that cannot pass the mandatory sweep is not a candidate, so
          the bleed stops at x=1276. Four pixels at this size is invisible and the
          figure still reads as running off the stage. Do not restore 64 without
          changing `qa.mjs`, which is a kit file and therefore a PR.

          `capped={false}` is the other half of the bet — the one place in this lab
          where the shared width token is deliberately not applied, because the
          column is the cap.
        */}
        <FigurePane caption={caption} capped={false} className="-mr-[60px]">
          {figure}
        </FigurePane>
      </div>
    </FigureSideShell>
  )
}
