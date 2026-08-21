import type { ReactNode } from 'react'
import { GlassPanel, InstructorTile, Slide2027, Tag } from '@/ui/nw2027/Frame'
import { nwColors, nwLayout, nwShadow, nwType } from '@/design/nw2027'

/** Instructor still on the gradient slides — taller than the content-slide tile. */
function HeroInstructor({ src }: { src?: string }) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        right: nwLayout.marginX,
        top: 172,
        width: 460,
        height: 760,
        borderRadius: 44,
        boxShadow: nwShadow.glass,
        background: src ? nwColors.primaryDarkBlue : 'rgba(255,255,255,0.16)',
        border: src ? undefined : '2px solid rgba(255,255,255,0.28)',
      }}
    >
      {src && (
        <img
          src={src}
          alt=""
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  )
}

/**
 * Full-bleed gradient slide carrying the NxtWave mark and a wordmark inside
 * the frosted Glass Container, with an optional second line beneath and an
 * optional instructor still.
 *
 * Figma: "Slide 16:9 - Welcome #1", "- 86" (All The Best),
 * "- 88" (Thank You!), "- 87" (All The Best + instructor),
 * "- 65" (Thank You! + instructor), "- 70" (Thank You! / All the best).
 */
export function HeroWordmarkSlide({
  title,
  subtitle,
  mark = true,
  instructor,
}: {
  title: ReactNode
  /** Second line rendered below the glass panel, without a panel of its own. */
  subtitle?: ReactNode
  mark?: boolean
  instructor?: string
}) {
  // With an instructor still on the right, the wordmark block centres on the
  // remaining space rather than on the slide.
  const wellRight = instructor !== undefined ? 620 : 0

  return (
    <Slide2027 variant="hero" footerMark={false}>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ left: 0, right: wellRight, top: 0, bottom: 0, gap: 54, paddingInline: 60 }}
      >
        {mark && (
          <img
            src="/assets/logo-nxtwave.png"
            alt="NxtWave"
            draggable={false}
            className="select-none"
            style={{ height: 150, width: 'auto', filter: 'brightness(0) invert(1)' }}
          />
        )}
        <GlassPanel
          style={{
            display: 'grid',
            placeItems: 'center',
            paddingInline: 120,
            paddingBlock: 30,
            maxWidth: '100%',
          }}
        >
          <span
            style={{
              ...nwType('heading2xl'),
              color: nwColors.white,
              textShadow: '0 10px 40px rgba(0,20,70,0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </span>
        </GlassPanel>
        {subtitle && (
          <span
            style={{
              ...nwType('headingM'),
              color: nwColors.white,
              textShadow: '0 8px 32px rgba(0,20,70,0.30)',
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
      {instructor !== undefined && <HeroInstructor src={instructor || undefined} />}
    </Slide2027>
  )
}

/**
 * Full-bleed gradient slide with a 3D illustration above a single large white
 * word. The workhorse for section dividers and activity slides.
 *
 * Figma: "Slide 16:9 - 63" (Fundamentals), "- 74" (Practice),
 * "- 64" (Quiz Time), "- 73" (Feedback).
 */
export function HeroIllustrationSlide({
  title,
  illustration,
  instructor,
  subtitle,
}: {
  title: ReactNode
  /** 3D illustration asset. Omitted renders a soft placeholder disc. */
  illustration?: string
  instructor?: string
  subtitle?: ReactNode
}) {
  const wellRight = instructor !== undefined ? 520 : 0

  return (
    <Slide2027 variant="hero" footerMark>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ left: 0, right: wellRight, top: 120, bottom: 120, gap: 56, paddingInline: 80 }}
      >
        {illustration ? (
          <img
            src={illustration}
            alt=""
            draggable={false}
            className="select-none"
            style={{ height: 420, width: 'auto', objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              height: 420,
              width: 420,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
              border: '2px solid rgba(255,255,255,0.26)',
            }}
          />
        )}
        <h2
          style={{
            ...nwType('headingL'),
            color: nwColors.white,
            margin: 0,
            textAlign: 'center',
            textShadow: '0 10px 40px rgba(0,20,70,0.30)',
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              ...nwType('subHeadXl'),
              color: 'rgba(255,255,255,0.88)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {instructor !== undefined && <HeroInstructor src={instructor || undefined} />}
    </Slide2027>
  )
}

/** "Welcome" opener. */
export function WelcomeSlide2027({ title = 'Welcome' }: { title?: ReactNode }) {
  return <HeroWordmarkSlide title={title} />
}

/** "Thank You!" closer, optionally with an "All the best" second line. */
export function ThankYouSlide2027({
  title = 'Thank You!',
  subtitle,
  instructor,
}: {
  title?: ReactNode
  subtitle?: ReactNode
  instructor?: string
}) {
  return <HeroWordmarkSlide title={title} subtitle={subtitle} instructor={instructor} />
}

/** "All The Best" closer. */
export function ClosingSlide2027({
  title = 'All The Best',
  instructor,
}: {
  title?: ReactNode
  instructor?: string
}) {
  return <HeroWordmarkSlide title={title} instructor={instructor} />
}

/** Section divider — illustration + section name on the gradient. */
export function SectionBreakerSlide2027({
  title,
  illustration,
  instructor,
  subtitle,
}: {
  title: ReactNode
  illustration?: string
  instructor?: string
  subtitle?: ReactNode
}) {
  return (
    <HeroIllustrationSlide
      title={title}
      illustration={illustration}
      instructor={instructor}
      subtitle={subtitle}
    />
  )
}

/** "Practice" activity slide. */
export function PracticeSlide2027({
  title = 'Practice',
  illustration,
  instructor,
}: {
  title?: ReactNode
  illustration?: string
  instructor?: string
}) {
  return <HeroIllustrationSlide title={title} illustration={illustration} instructor={instructor} />
}

/** "Quiz Time" activity slide. */
export function QuizSlide2027({
  title = 'Quiz Time',
  illustration,
  instructor,
}: {
  title?: ReactNode
  illustration?: string
  instructor?: string
}) {
  return <HeroIllustrationSlide title={title} illustration={illustration} instructor={instructor} />
}

/** "Feedback" slide. */
export function FeedbackSlide2027({
  title = 'Feedback',
  illustration,
  instructor,
}: {
  title?: ReactNode
  illustration?: string
  instructor?: string
}) {
  return <HeroIllustrationSlide title={title} illustration={illustration} instructor={instructor} />
}

/**
 * The session title slide: brand tag, a two-tone headline (first line in
 * primary dark blue, the rest in brand blue), an optional description, and the
 * instructor still on the right.
 *
 * Figma: "Slide 16:9 - Topic Title with Description" / "...without Description".
 */
export function TopicTitleSlide2027({
  tag = 'Session on',
  titleTop,
  titleBottom,
  description,
  instructor,
}: {
  tag?: ReactNode
  /** First headline line — rendered in primary dark blue. */
  titleTop: ReactNode
  /** Second headline line — rendered in brand blue. Omit for a one-line title. */
  titleBottom?: ReactNode
  description?: ReactNode
  instructor?: string
}) {
  return (
    <Slide2027 variant="light" progress={{ total: 1, current: 1 }}>
      <img
        src="/assets/logo-nxtwave.png"
        alt="NxtWave"
        draggable={false}
        className="absolute select-none"
        style={{ left: nwLayout.marginX, top: 96, height: 132, width: 'auto' }}
      />

      <div className="absolute" style={{ left: nwLayout.marginX, top: 372, width: 1060 }}>
        {tag && <Tag>{tag}</Tag>}
        <h1 style={{ margin: '38px 0 0', ...nwType('headingM') }}>
          <span style={{ display: 'block', color: nwColors.primaryDarkBlue }}>{titleTop}</span>
          {titleBottom && (
            <span style={{ display: 'block', color: nwColors.primaryBlue }}>{titleBottom}</span>
          )}
        </h1>
        {description && (
          <p style={{ ...nwType('bodyM'), color: nwColors.ink, margin: '40px 0 0', maxWidth: 980 }}>
            {description}
          </p>
        )}
      </div>

      {instructor !== undefined && (
        <div
          className="absolute overflow-hidden"
          style={{
            right: nwLayout.marginX,
            top: 214,
            width: 500,
            height: 652,
            borderRadius: 48,
            boxShadow: nwShadow.card,
            background: instructor ? nwColors.primaryDarkBlue : '#DCE5F7',
          }}
        >
          {instructor && (
            <img
              src={instructor}
              alt=""
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
      )}
    </Slide2027>
  )
}

/** Re-exported for layouts that want the tile without the full content chrome. */
export { InstructorTile }
