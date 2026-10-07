import { createContext, useContext } from 'react'
import type { ArrowMode } from './useKeyboardNav'

export interface DeckContextValue {
  index: number
  total: number
  direction: number
  goTo: (i: number) => void
  next: () => void
  prev: () => void
  isFirst: boolean
  isLast: boolean
  /** How the deck is moving: Auto Play, slide-wise or step-wise. */
  mode: ArrowMode
  /** Play this slide again from the top of its build (in Auto Play, it plays itself again). */
  replay: () => void
}

export const DeckContext = createContext<DeckContextValue | null>(null)

export function useDeck(): DeckContextValue {
  const ctx = useContext(DeckContext)
  if (!ctx) throw new Error('useDeck must be used within <Deck>')
  return ctx
}
