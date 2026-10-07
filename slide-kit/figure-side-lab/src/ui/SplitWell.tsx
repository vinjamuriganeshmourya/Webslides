import { BulletList } from '@/ui/content'
import { FigureSideShell, FigurePane } from './FigureSideShell'
import type { FigureSideProps } from './figureSide'

/**
 * CANDIDATE 1 — SPLIT WELL. Half the well is prose, half is the figure, and
 * both start on the shared top datum.
 *
 * THE BET. The session 6 defect is not that the split is wrong, it is that there
 * IS no split: `ContentSlide` stacks the figure UNDER the points and hands it the
 * leftover height, so the figure floats wherever the copy above it stopped. Give
 * the figure a column of its own, lock both columns to a common top edge, and
 * neither the figure nor the prose can be positioned by the other's length.
 *
 * `items-start` ON THE ROW, NOT `items-center`. The first version of this file
 * centred each column, which is what `ContentSlide` does, and it reproduced the
 * defect on a different axis: with this fixture the terminal's top edge sat 75px
 * below the first bullet, and the two only looked related at all because the
 * columns happen to be a similar height here. Centring two independent columns
 * means the shorter one's position is a function of the taller one's content.
 * Stress-tested on slides 9 and 10 of this gallery, at one point and at five:
 * the figure's top edge and the first bullet's are IDENTICAL on both, delta 0.
 * The block itself does move between those two slides, and should — it is
 * centred in the well and a five-point block is taller. Those are two separate
 * properties and only the first one is about the columns.
 *
 * It is the most conservative candidate on purpose. `ContentSlide`'s two-column
 * branch already does something close (`grid-cols-[1.4fr_1fr]`) but only when
 * both `points` AND `children` are passed, and it gives the figure a third of the
 * width, which is where the 468px-figure-in-a-full-width-block defect comes from.
 * Here the figure gets an honest half and the width cap is the shared token.
 *
 * WORST AT: a WIDE figure. Half the well is 546px after the gutter, and session
 * 6's `docker push` refusal is 96 characters, which needs about 900px at
 * fontSize 14.
 *
 * WHAT THAT ACTUALLY LOOKS LIKE, measured on slide 8 of this gallery rather than
 * assumed: the kit's `Terminal` carries `whitespace-pre-wrap break-words`, so it
 * does NOT shear the line. It WRAPS it, and `break-words` breaks mid-token, so
 * `docker.io/library/nxttrendz-backend]` renders as `nxttrendz-` on one line and
 * `backend]` on the next. That is worse than a clip for the thing a terminal is
 * on a slide to do: a learner reading a broken image name off the projector
 * retypes a broken image name. `align-check.mjs` reports it as WRAPPED, which is
 * the finding that harness has for exactly this, and one line of the refusal
 * becoming two also pushes the panel 46px taller than the slide budgeted for.
 *
 * ALSO WORST AT: A SHORT SLIDE. The block is centred, so a one-point slide sits
 * with 146px of empty well above it and 139px below — measured on slide 9 — and
 * the content floats away from the lead that introduces it. This is the cost of
 * centring rather than top-anchoring, and it is a real cost: the sentence and the
 * thing it introduces are further apart than they were. Centring is what was
 * asked for; on a genuinely thin slide the honest edit is a bigger figure rather
 * than a different layout.
 *
 * ALSO WORST AT: NO points, where it draws an empty left half. That is the
 * second measured defect from the session 6 sweep, reproduced faithfully, and
 * slide 8 shows it: this candidate needs prose to have a left column at all.
 */
export function SplitWell({
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
        `items-start` IS THE WHOLE POINT OF THIS LINE. The two columns are locked
        to a common top edge, so neither is positioned by the other's length. The
        row carries no height of its own and no vertical offset: the shell centres
        it in the well and clamps it off the video reserve. `items-center` here
        would centre each column independently, which is the defect.
      */}
      <div className="grid grid-cols-2 items-start gap-10">
        <div className="min-w-0">
          {points && <BulletList items={points} tone={tone} immediate />}
        </div>
        <FigurePane caption={caption}>{figure}</FigurePane>
      </div>
    </FigureSideShell>
  )
}
