import { Deck } from './deck/Deck'
import { deck, meta } from './decks/activeDeck'

/**
 * App shell. The deck it renders comes from `src/decks/activeDeck.ts`, the one
 * module that names a deck, so swapping decks is a one-line change there.
 */
export function App() {
  return <Deck slides={deck} meta={meta} />
}
