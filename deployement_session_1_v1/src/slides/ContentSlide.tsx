import { SlideBase } from '@/ui/SlideBase'
import { SlideHeader } from '@/ui/SlideHeader'
import { BulletList } from '@/ui/content'
import { Step } from '@/motion/Stepper'
import type { ContentSlideProps } from './types'

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
  return (
    <SlideBase variant="light" lesson={lesson}>
      {/* Header pinned top-left at a fixed position; content centers in the remaining space. */}
      <div className="flex h-full flex-col">
        <SlideHeader kicker={kicker} title={title} lead={lead} tone={tone} />

        <div className="flex min-h-0 flex-1 flex-col justify-center">
          {points && children ? (
            <div className="grid grid-cols-2 items-center gap-10">
              <BulletList items={points} tone={tone} />
              <Step dir="up">{children}</Step>
            </div>
          ) : (
            <>
              {points && <BulletList items={points} tone={tone} />}
              {children && <Step dir="up">{children}</Step>}
            </>
          )}
        </div>
      </div>
    </SlideBase>
  )
}
