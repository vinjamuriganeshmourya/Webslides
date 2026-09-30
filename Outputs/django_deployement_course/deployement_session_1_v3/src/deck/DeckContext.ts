import { createContext, useContext } from 'react'

export interface DeckContextValue {
  index: number
  total: number
  direction: number
  goTo: (i: number) => void
  next: () => void
  prev: () => void
  isFirst: boolean
  isLast: boolean
}

export const DeckContext = createContext<DeckContextValue | null>(null)

export function useDeck(): DeckContextValue {
  const ctx = useContext(DeckContext)
  if (!ctx) throw new Error('useDeck must be used within <Deck>')
  return ctx
}
