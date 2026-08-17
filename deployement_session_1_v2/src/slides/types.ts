import type { ReactNode } from 'react'
import type { BulletItem } from '@/ui/content'
import type { Step, FlowNode } from '@/ui/flow'
import type { ScenarioBeat } from '@/ui/ScenarioCard'
import type { IllustrationName } from '@/ui/characters/Illustration'
import type { Tone } from '@/design/tokens'

/** A slide image is either a real asset URL or a built-in illustration. */
export type SlideMedia =
  | { src: string; alt?: string; fit?: 'cover' | 'contain' }
  | { illustration: IllustrationName }

/** Every slide accepts an optional lesson label shown in the footer. */
interface Base {
  lesson?: string
}

export interface BrandSlideProps {
  /** The welcome line under the mark. Brand + welcome only — no session/course text. */
  greeting?: string
  /** Footer session name (rendered without the footer logo — the hero already carries it). */
  lesson?: string
}

export interface WelcomeSlideProps extends Base {
  course?: string
  title: ReactNode
  subtitle?: ReactNode
  presenter?: string
  meta?: string // e.g. date / module
  /**
   * Bare-body hero: only the "Welcome to today's session" kicker + the
   * session name, centered. No body logo (footer carries the single mark),
   * no course chip, presenter, meta, or mascot.
   */
  minimal?: boolean
}

export interface RecapSlideProps extends Base {
  kicker?: string
  title?: ReactNode
  points: (BulletItem | string)[]
}

export interface AgendaSlideProps extends Base {
  kicker?: string
  title?: ReactNode
  lead?: ReactNode
  items: { title: ReactNode; sub?: ReactNode }[]
}

export interface SectionBreakerProps extends Base {
  /** Brand mark shown above the title. Pass the WHITE variant: this stage is brand blue. */
  mark?: string
  markAlt?: string
  index?: number | string
  kicker?: string
  title: ReactNode
  subtitle?: ReactNode
  tone?: Tone
}

export interface SectionBreakerImageProps extends SectionBreakerProps {
  media?: SlideMedia
}

export interface ContentSlideProps extends Base {
  kicker?: string
  title: ReactNode
  lead?: ReactNode
  points?: (BulletItem | string)[]
  tone?: Tone
  children?: ReactNode
}

export interface ContentImageSlideProps extends ContentSlideProps {
  media: SlideMedia
  caption?: ReactNode
}

export interface ContentNoteSlideProps extends ContentSlideProps {
  /** Render the note above the points, for slides where the note is the definition. */
  noteFirst?: boolean
  note: {
    kind?: 'note' | 'tip' | 'info' | 'warning' | 'success'
    title?: ReactNode
    body: ReactNode
    /** Replaces the default glyph inside the callout's icon holder. */
    icon?: ReactNode
  }
}

export interface FlowChartSlideProps extends Base {
  kicker?: string
  title: ReactNode
  lead?: ReactNode
  nodes: FlowNode[]
  direction?: 'horizontal' | 'vertical'
}

export interface OnlyImageSlideProps extends Base {
  media: SlideMedia
  title?: ReactNode
  caption?: ReactNode
}

export interface ProceduralStepsSlideProps extends Base {
  kicker?: string
  title: ReactNode
  lead?: ReactNode
  steps: Step[]
  tone?: Tone
}

export interface ScenarioSlideProps extends Base {
  kicker?: string
  title: ReactNode
  situation: ReactNode
  persona?: string
  beats: ScenarioBeat[]
}

export interface KeyTakeawaysSlideProps extends Base {
  kicker?: string
  title?: ReactNode
  lead?: ReactNode
  points: (BulletItem | string)[]
}

export interface PracticeSlideProps extends Base {
  kicker?: string
  title?: ReactNode
  prompt: ReactNode
  tasks?: (BulletItem | string)[]
}

export interface FeedbackSlideProps extends Base {
  title?: ReactNode
  prompt?: ReactNode
  link?: string
}

export interface QuizSlideProps extends Base {
  kicker?: string
  title?: ReactNode
  question: ReactNode
  options?: { label: ReactNode; correct?: boolean }[]
  hint?: ReactNode
}

/** The quiz announcement frame. Carries no question by design. */
export interface QuizTimeSlideProps extends Base {
  /** Defaults to "Quiz Time!". */
  title?: ReactNode
  subtitle?: ReactNode
}

export interface ThankYouSlideProps extends Base {
  title?: ReactNode
  message?: ReactNode
  nextUp?: ReactNode
}
