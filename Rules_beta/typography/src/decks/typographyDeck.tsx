import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'

/*
  THE FONTS UNDER TEST, installed locally from @fontsource, latin subset only.
  Vite bundles the woff2 files and the single-file build inlines them, so the
  deck needs no network for these four.
*/
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/poppins/latin-800.css'
import '@fontsource/work-sans/latin-400.css'
import '@fontsource/work-sans/latin-500.css'
import '@fontsource/work-sans/latin-600.css'
import '@fontsource/work-sans/latin-700.css'
import '@fontsource/libre-franklin/latin-400.css'
import '@fontsource/libre-franklin/latin-600.css'
import '@fontsource/libre-franklin/latin-700.css'
import '@fontsource/libre-franklin/latin-800.css'

/**
 * TYPOGRAPHY TEST. Throwaway, NOT a rule.
 *
 * Two identical content slides, each rendered in a different font set, so the
 * sets can be compared side by side. The kit's fonts (Sora headings, Inter body)
 * are untouched: each set is scoped to its own slide by a wrapper class, and the
 * overrides live in this session-owned file so `sync-kit` cannot erase them.
 *
 *   Set 1: kicker Inter,     heading Poppins,        content Inter
 *   Set 2: kicker Work Sans, heading Libre Franklin, content Work Sans
 *
 * Code (`font-mono`) keeps JetBrains Mono in both.
 */
const FONT_SETS_CSS = `
.ts-set-1, .ts-set-1 .font-body { font-family: 'Inter', system-ui, sans-serif; }
.ts-set-1 .text-kicker { font-family: 'Inter', system-ui, sans-serif; }
.ts-set-1 .font-heading { font-family: 'Poppins', system-ui, sans-serif; }

.ts-set-2, .ts-set-2 .font-body { font-family: 'Work Sans', system-ui, sans-serif; }
.ts-set-2 .text-kicker { font-family: 'Work Sans', system-ui, sans-serif; }
.ts-set-2 .font-heading { font-family: 'Libre Franklin', system-ui, sans-serif; }
`

/** `display: contents` so the wrapper adds no box and the slide layout is unchanged. */
function FontSet({ set, children }: { set: 1 | 2; children: ReactNode }) {
  return (
    <div className={`ts-set-${set}`} style={{ display: 'contents' }}>
      <style>{FONT_SETS_CSS}</style>
      {children}
    </div>
  )
}

export const typographyMeta: DeckMeta = {
  title: 'Typography Test',
  course: 'Rules Beta',
  lesson: 'Typography Test',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Typography Test'

/** The same copy on both slides, so only the fonts differ. */
function sampleSlide() {
  return (
    <ContentSlide
      kicker="Classes and Objects"
      title="What an Object Holds"
      lead="Every object carries its own data and the actions that use it"
      lesson={SESSION}
      points={[
        { text: 'State is the data an object stores', sub: 'A car object keeps its colour, speed and fuel level', icon: 'check' },
        { text: 'Behaviour is what an object can do', sub: 'The same car can start, accelerate and brake', icon: 'arrow' },
        { text: 'A constructor sets the starting state', sub: 'It runs once, the moment the object is created', icon: 'target' },
      ]}
    />
  )
}

export const typographyDeck: SlideDef[] = [
  {
    id: 'typo-set-1',
    section: 'Font Set 1',
    label: 'Set 1 · Inter / Poppins / Inter',
    element: <FontSet set={1}>{sampleSlide()}</FontSet>,
    notes: 'Font set 1. Kicker Inter, heading Poppins, content Inter.',
  },
  {
    id: 'typo-set-2',
    section: 'Font Set 2',
    label: 'Set 2 · Work Sans / Libre Franklin / Work Sans',
    element: <FontSet set={2}>{sampleSlide()}</FontSet>,
    notes: 'Font set 2. Kicker Work Sans, heading Libre Franklin, content Work Sans.',
  },
]
