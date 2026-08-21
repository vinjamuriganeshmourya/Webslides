/**
 * NxtWave PPT Template — "New Theme 2027" slide layouts.
 *
 * Ported from the Figma file `NxtWave-PPT-Template`, page "Final" (256:760),
 * section "V2_Content PPT - New Theme 2027". Tokens live in
 * `@/design/nw2027`; shared chrome lives in `@/ui/nw2027/Frame`.
 *
 * Two backdrop families:
 *   hero  — full-bleed blue gradient (openers, dividers, activities, closers)
 *   light — near-white field with the kicker/title/progress chrome (content)
 */
export {
  // hero family
  HeroWordmarkSlide,
  HeroIllustrationSlide,
  WelcomeSlide2027,
  ThankYouSlide2027,
  ClosingSlide2027,
  SectionBreakerSlide2027,
  PracticeSlide2027,
  QuizSlide2027,
  FeedbackSlide2027,
  // light family
  TopicTitleSlide2027,
} from './HeroSlides'

export {
  ContentSlide2027,
  TableSlide2027,
  TerminalSlide2027,
  type NwTerminalLine,
  CardsSlide2027,
  BulletsSlide2027,
  HierarchySlide2027,
  NW_CONTENT_TOP,
  type NwContentChrome,
  type NwColumn,
  type NwHierarchyLeaf,
} from './ContentSlides'

export { AgendaSlide2027, type AgendaItem } from './AgendaSlide'

export { QuizQuestionSlide2027, type NwQuizOption } from './QuizQuestionSlide'

export { MgSlide2027, mgStageBox } from './MgSlide'

export {
  Slide2027,
  SlideHeading,
  GlassPanel,
  Card,
  Tag,
  ProgressBar,
  InstructorTile,
  FooterMark,
  type NwVariant,
} from '@/ui/nw2027/Frame'
