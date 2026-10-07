import { RevealGroup, Reveal } from '@/motion/Reveal'
import { accentByTone, colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import type { BulletItem } from '@/ui/content'
import { FigureSideShell, FigurePane } from './FigureSideShell'
import type { FigureSideProps } from './figureSide'

/**
 * CANDIDATE 4 — CAPTION RAIL. The figure takes the full width of the well, and
 * the points become a rail of short captions under it.
 *
 * THE BET. The other three candidates all assume the figure should share the
 * well horizontally, and for a wide figure that assumption is the defect rather
 * than the fix. A `Terminal` showing session 6's `docker push` refusal is one
 * line of 96 monospace characters: it needs about 900px at fontSize 14 and there
 * is no column arrangement that gives it that AND leaves room for prose beside
 * it. So this candidate refuses the side-by-side premise and moves the prose
 * BELOW, where a 1152px-wide row of three short captions fits comfortably.
 *
 * This is the arrangement session 6 was reaching for with all 23 of its
 * `mx-auto max-w-[980px]` wrappers. The difference is that the figure and its
 * rail are ONE block, centred as a unit: the figure is not handed the height left
 * over after the points, so the points do not have to be omitted to stop the
 * figure drifting, which is what those 10 float slides did.
 *
 * WHY THE RAIL IS NOT A ROW OF PANELS. It carries one hairline and no ground.
 * Three tinted boxes under a `Terminal` would be three more surfaces competing
 * with the one surface the slide is about, and STYLE_GUIDE section 9 would then
 * require each of them lit, which is four lit objects on a slide with one idea.
 * A rule and a marker place the captions without making them things.
 *
 * WORST AT: A POINT LONGER THAN ABOUT TWELVE WORDS. The rail is the only
 * candidate where the prose is width-constrained by the NUMBER of points rather
 * than by a column: at three points each cell is 355px, so a full sentence wraps
 * to four lines and the rail stops reading as a caption and becomes a second
 * body. It is a caption rail and the copy has to be written as captions, which
 * means adopting it changes how a deck author writes the slide, not just how it
 * is laid out. That is the largest cost of any candidate here.
 *
 * ALSO WORST AT: A TALL FIGURE. A `LayerStack` or a `BoundaryBridge` takes most
 * of the well's 440px, and the rail then has 90px, so its captions collide with
 * the deck's own control bar at y=664 — which `align-check.mjs` reports as
 * CHROME, and which is unreadable rather than merely tight.
 *
 * ALSO WORST AT: MORE THAN FOUR POINTS. Five cells are 210px each, which is two
 * words per line.
 *
 * TWO COMPETING LEFT EDGES, AND THE ALTERNATIVE ANSWER TO IT.
 *
 * This candidate is the only one in the lab whose figure is centred against the
 * WELL rather than merely against its own column: measured 86px of gap either
 * side, 0px skew, at both fixture widths. That is the property every one of
 * session 6's 24 figure-bearing slides has, and it is what a reviewer means by
 * "centred".
 *
 * The cost is that 86px of gap puts the figure's left edge at x=150 while the
 * kicker, the title and the lead all start at x=64 — the datum `align-check.mjs`
 * measures everything against. The slide then has two left edges, and the figure
 * reads as inset from the copy that introduces it.
 *
 * `CaptionRailDatum`, exported below, is the alternative answer: the same
 * candidate with the width cap released, so the figure spans the well, its left
 * edge lands ON the datum, and it is still 0px skew because the well is
 * symmetrical. Gallery slide 12 renders it beside slide 6 so the two can be
 * compared rather than argued about.
 *
 * IT IS NOT THE DEFAULT, and the reason is the one hard constraint this lab was
 * built under: ONE width token. A figure at 1152px on the full-width candidate
 * and 980px everywhere else is two widths in one deck, which is the defect that
 * produced session 6's five hand-written wrappers. Whoever picks has to decide
 * which of the two rules outranks the other, and that is a decision for a human
 * rather than a default this file quietly chooses.
 *
 * ALSO WORST AT: A SHORT FIGURE, which is the mirror of the tall-figure problem
 * and the more common one. A 154px `Terminal` with two captions is a 236px block
 * in a 439px well, so about 200px of it is empty — 105px above and 98px below,
 * measured on slide 6. Centring splits that band rather than dropping it all at
 * the bottom, which reads better, but it is the same missing content either way
 * and this candidate shows it most plainly because nothing sits beside the figure
 * to occupy the height.
 */
function CaptionRailBase({
  datum = false,
  kicker,
  title,
  lead,
  points,
  figure,
  caption,
  tone = 'brand',
  lesson,
}: FigureSideProps & { datum?: boolean }) {
  const color = accentByTone[tone]
  const items: BulletItem[] = (points ?? []).map((raw) =>
    typeof raw === 'string' ? { text: raw } : raw,
  )
  return (
    <FigureSideShell kicker={kicker} title={title} lead={lead} tone={tone} lesson={lesson}>
      {/*
        THE FIGURE AND ITS RAIL ARE ONE BLOCK, and the shell centres that block
        in the well. The figure is `shrink-0` so the rail can never squeeze it,
        and the rail follows the figure immediately rather than being pushed to
        the bottom of the well: the pair reads as a figure with its captions, not
        as two rows at opposite ends of the slide.
      */}
      <div className="flex flex-col">
        <FigurePane caption={caption} capped={!datum} className="shrink-0">
          {figure}
        </FigurePane>

        {items.length > 0 && (
          <div
            /* One hairline, no ground. See the note above. */
            className="mt-5 border-t pt-4"
            style={{ borderColor: colors.line }}
          >
            <RevealGroup
              className="grid gap-x-8 gap-y-3"
              stagger={0.08}
              style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
            >
              {items.map((item, i) => {
                const Icon = iconByName[item.icon ?? 'check']
                const itemColor = item.tone ? accentByTone[item.tone] : color
                return (
                  <Reveal key={i} dir="up" className="flex items-start gap-2.5">
                    <Icon
                      width={17}
                      height={17}
                      className="mt-[3px] shrink-0"
                      style={{ color: itemColor }}
                    />
                    <span className="text-body-sm font-medium leading-snug text-ink">
                      {item.text}
                    </span>
                  </Reveal>
                )
              })}
            </RevealGroup>
          </div>
        )}
      </div>
    </FigureSideShell>
  )
}

/**
 * The default: the figure capped at the shared width token and centred in the
 * well. 86px of gap either side, 0px skew.
 */
export const CaptionRail = (p: FigureSideProps) => <CaptionRailBase {...p} />

/**
 * THE ALTERNATIVE ANSWER TO THE TWO-LEFT-EDGES PROBLEM, kept as a peer rather
 * than folded in. Identical public contract, identical arrangement; the only
 * difference is that the figure spans the well instead of being capped, so its
 * left edge is the header's datum (x=64) and it is still 0px skew.
 *
 * The trade is stated in the header above: it costs the one-width-token rule.
 */
export const CaptionRailDatum = (p: FigureSideProps) => <CaptionRailBase {...p} datum />
