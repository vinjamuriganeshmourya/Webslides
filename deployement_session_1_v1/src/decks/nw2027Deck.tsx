import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide2027,
  BulletsSlide2027,
  CardsSlide2027,
  ClosingSlide2027,
  FeedbackSlide2027,
  HierarchySlide2027,
  PracticeSlide2027,
  QuizSlide2027,
  SectionBreakerSlide2027,
  TableSlide2027,
  TerminalSlide2027,
  ThankYouSlide2027,
  TopicTitleSlide2027,
  WelcomeSlide2027,
} from '@/slides/nw2027'

/**
 * Reference deck for the "New Theme 2027" template.
 *
 * It reproduces the slide sequence in the Figma section
 * "V2_Content PPT - New Theme 2027" using the same sample content, so the
 * rendered output can be diffed against the design file frame by frame. Every
 * layout in `@/slides/nw2027` appears at least once.
 */
export const nw2027Meta: DeckMeta = {
  title: 'Battery Technology',
  course: 'NxtWave',
  lesson: 'Battery Technology',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Battery Technology'

const AGENDA = [
  'Fundamentals',
  'Battery Materials',
  'Battery Types',
  'Charging & Safety',
  'Real-World Applications',
  'Future Of Batteries',
]

/** The progress bar has one division per agenda item. */
const progress = (current: number) => ({ total: AGENDA.length, current })

const PowerIcon = (
  <svg width={56} height={56} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3v9"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
    />
    <path
      d="M6.8 6.8a7.5 7.5 0 1 0 10.4 0"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
    />
  </svg>
)

const leafIcon = (d: string) => (
  <svg width={30} height={30} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d={d} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const nw2027Deck: SlideDef[] = [
  {
    id: 'welcome',
    label: 'Welcome',
    element: <WelcomeSlide2027 />,
    notes: 'Hold while learners join.',
  },
  {
    id: 'topic-title',
    label: 'Session title',
    element: (
      <TopicTitleSlide2027
        titleTop="Battery"
        titleBottom="Technology"
        description="Battery technology is the science of converting chemical energy into electrical energy to store and release power on demand."
        instructor=""
      />
    ),
  },
  {
    id: 'agenda',
    label: 'Agenda',
    element: <AgendaSlide2027 kicker={SESSION} items={AGENDA} instructor="" progress={progress(1)} />,
  },

  {
    id: 'section-fundamentals',
    label: 'Section · Fundamentals',
    section: 'Fundamentals',
    element: <SectionBreakerSlide2027 title="Fundamentals" instructor="" />,
  },
  {
    id: 'cell-structure',
    label: 'Basic Cell Structure',
    section: 'Fundamentals',
    element: (
      <HierarchySlide2027
        kicker={SESSION}
        index={1}
        title="Basic Cell Structure"
        instructor=""
        instructorTall
        progress={progress(1)}
        lead={'Energy storage and conversion\ntechnologies that power modern life'}
        root={PowerIcon}
        leaves={[
          { label: 'Primary\nBatteries', icon: leafIcon('M4 9h13v6H4zM20 11v2') },
          { label: 'Secondary\nBatteries', icon: leafIcon('M6 4h12v16H6zM10 9h4') },
          { label: 'Fuel\nCells', icon: leafIcon('M7 4v16M17 4v16M7 9h10M7 15h10') },
        ]}
      />
    ),
  },
  {
    id: 'cell-parts',
    label: 'Core ideas',
    section: 'Fundamentals',
    element: (
      <CardsSlide2027
        kicker={SESSION}
        index={1}
        title="Inside a Cell"
        instructor=""
        progress={progress(1)}
        cards={[
          { title: 'Anode', body: 'Releases electrons during discharge.' },
          { title: 'Cathode', body: 'Accepts electrons and completes the reaction.' },
          { title: 'Electrolyte', body: 'Carries ions between the two electrodes.' },
        ]}
      />
    ),
  },

  {
    id: 'challenges',
    label: 'Terminal',
    section: 'Applications',
    element: (
      <TerminalSlide2027
        kicker={SESSION}
        index={2}
        title="Challenges & Applications"
        instructor=""
        progress={progress(2)}
        lead="Run these commands in the Terminal"
        lines={['python3 -m venv env', 'source env/bin/activate', 'pip3 install -r requirements.txt']}
      />
    ),
  },
  {
    id: 'status-table',
    label: 'Status codes',
    section: 'Applications',
    element: (
      <TableSlide2027
        kicker={SESSION}
        index={3}
        title="What is Server Saying?"
        instructor=""
        progress={progress(3)}
        columns={[{ label: 'Code' }, { label: 'Name' }, { label: 'Meaning', weight: 1.8 }]}
        rows={[
          ['200', 'OK', 'All good, here is your page'],
          ['301/302', 'Redirect', 'Go to this other URL'],
          ['404', 'Not Found', 'This page does not exist'],
          ['500', 'Server Error', 'Something broke on our end'],
        ]}
      />
    ),
  },

  {
    id: 'practice',
    label: 'Practice',
    element: <PracticeSlide2027 instructor="" />,
  },
  {
    id: 'quiz',
    label: 'Quiz Time',
    element: <QuizSlide2027 instructor="" />,
  },

  {
    id: 'takeaways',
    label: 'Key Takeaways',
    element: (
      <BulletsSlide2027
        kicker={SESSION}
        title="Key Takeaways"
        instructor=""
        progress={progress(6)}
        points={[
          'Energy Density – Higher storage in compact size',
          'Fast Charging – Reduced charging time with improved efficiency',
          'Sustainability – Shift toward recyclable and eco-friendly materials',
          'Safety Improvements – Better thermal management and reduced overheating risks',
          'Longer Lifespan – Increased battery cycle durability',
        ]}
      />
    ),
  },
  {
    id: 'feedback',
    label: 'Feedback',
    element: <FeedbackSlide2027 instructor="" />,
  },
  {
    id: 'thank-you',
    label: 'Thank You',
    element: <ThankYouSlide2027 subtitle="All the best" />,
  },
  {
    id: 'closing',
    label: 'All The Best',
    element: <ClosingSlide2027 instructor="" />,
  },
]
