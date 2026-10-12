import type { DeckMeta, DeckSlide } from '@/deck/Deck'
import {
  AgendaOrbitSlide,
  AgendaSlide,
  AllTheBestSlide,
  ContentSlide,
  NextSessionSlide,
  SectionBreakerSlide,
  SetOperationsFigure,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'

/**
 * THE TEMPLATE DECK — the six chrome slides, numbered the way the review of
 * 2026-10-09 numbered them: 1 All The Best, 2 Agenda, 3 Section Breaker,
 * 4 Welcome, 5 Next Session, 6 Thank You.
 *
 * The copy is the reference renders' own placeholder copy, so the deck can be
 * held against `slidestraining/` frame for frame. A real session replaces the
 * strings and nothing else.
 *
 * 7 (added 2026-10-12): the Python course's orbit-mark agenda on the agenda
 * ground, `AgendaOrbitSlide`, with the 27 Sets deck's own copy. Slide 2 is
 * untouched; this one sits after the six so their numbering holds.
 *
 * 8 (added 2026-10-12): the content header in the new design, `ContentSlide`
 * (kicker, gradient divider, heading; no edge rail), carrying the 28 Set
 * Operations frame's body as its content.
 */
export const meta: DeckMeta = { title: 'Updated Template' }

export const deck: DeckSlide[] = [
  { id: 'all-the-best', element: <AllTheBestSlide /> },
  {
    id: 'agenda',
    element: (
      <AgendaSlide
        kicker="Battery Technology"
        title="Agenda"
        items={[
          { title: 'Fundamentals', body: 'Leveraging the latest innovations to keep you ahead.' },
          { title: 'Battery Types', body: 'Custom-built strategies designed for your unique business needs.' },
          { title: 'Challenges & Applications', body: 'Trusted by 2,000+ companies across 21 industries since 2020.' },
          { title: 'Battery Types', body: 'Custom-built strategies designed for your unique business needs.' },
          { title: 'Challenges & Applications', body: 'Trusted by 2,000+ companies across 21 industries since 2020.' },
        ]}
      />
    ),
  },
  { id: 'section-breaker', element: <SectionBreakerSlide kicker="Welcome to today’s session" title="Functions" /> },
  { id: 'welcome', element: <WelcomeSlide /> },
  { id: 'next-session', element: <NextSessionSlide title="How To Supercharge A Battery" /> },
  { id: 'thank-you', element: <ThankYouSlide /> },
  {
    id: 'agenda-orbit',
    element: (
      <AgendaOrbitSlide
        kicker="Sets"
        title="Agenda"
        items={[
          { title: 'Sets', sub: 'each item once, no order' },
          { title: 'Changing a set', sub: 'add, update, discard, remove' },
          { title: 'Operations on sets', sub: 'len, in, a loop, clear' },
        ]}
      />
    ),
  },
  {
    id: 'content-set-operations',
    element: (
      <ContentSlide kicker="Set Operations" title="Set Operations">
        <SetOperationsFigure />
      </ContentSlide>
    ),
  },
]
