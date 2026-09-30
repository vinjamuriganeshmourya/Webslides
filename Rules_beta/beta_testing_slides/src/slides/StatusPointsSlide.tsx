import { SlideBase } from '@/ui/SlideBase'
import { SlideHeader } from '@/ui/SlideHeader'
import { StatusList } from '@/ui/StatusList'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { SLIDE_FAMILY } from '@/motion/continuity'
import type { StatusPointsSlideProps } from './types'

/**
 * STATUS POINTS — a list where every row carries a verdict.
 *
 * The slide for "these three work, this one does not", for a do/don't pair, and
 * for the set of states a command can leave you in. The verdict is the content:
 * if every row would come out `success`, this is a `ContentSlide` and the colour
 * is decoration (hard rule 8's spirit, applied to colour rather than to
 * illustration).
 *
 * ROWS ARE BUILD STEPS BY DEFAULT, EXCEPT WHEN THERE IS A FIGURE
 *
 * Walking the room through "this one fails, and here is why" one verdict at a
 * time is the whole reason to use this layout, so `stepped` defaults on. But
 * hard rule 6 says text and its supporting visual arrive together, so the moment
 * the slide carries `children` the rows switch to a staggered entrance and
 * `stepped` is ignored. That is enforced here rather than left to the author,
 * because the failure is silent: the figure simply never appears until the last
 * row has been clicked, and it looks like two slides stuck together.
 *
 * THE HEIGHT BUDGET
 *
 * Each row is about 84px with a `detail` line, 66px without. The well runs
 * y=220..656 with a lead-less header. Four rows with details, or five without.
 * A sixth is a second slide.
 */
export function StatusPointsSlide({
  kicker,
  title,
  lead,
  items,
  tone = 'brand',
  children,
  stepped = true,
  lesson,
}: StatusPointsSlideProps) {
  /* Same lead-less guard as `ContentSlide`: a header with no lead stops at
     y=168, and a wide figure following it reaches into the instructor-video
     rectangle at x 913..1280, y 0..220. The recovered space goes to the text. */
  const visualGuard = lead ? '' : 'pt-[52px]'
  const immediate = Boolean(children) || !stepped
  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} lead={lead} tone={tone} />
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          {children ? (
            /* The list takes the wider column, matching `ContentSlide`: a
               wrapped row in a narrow column reads as though it were set larger
               than its neighbours even though every row is the same size. */
            <div className="grid grid-cols-[1.4fr_1fr] items-center gap-10">
              <StatusList items={items} immediate />
              <RevealGroup className={visualGuard}>
                <Reveal dir="up">{children}</Reveal>
              </RevealGroup>
            </div>
          ) : (
            <StatusList items={items} immediate={immediate} />
          )}
        </div>
      </div>
    </SlideBase>
  )
}

StatusPointsSlide.family = SLIDE_FAMILY.content
