import { Deck } from './deck/Deck'
import { nw2027Deck, nw2027Meta } from './decks/nw2027Deck'

/**
 * App shell. Swap the deck below for another definition (see
 * src/decks/nw2027Deck.tsx, session1Deck.tsx or sampleDeck.tsx for the
 * pattern) to build a new lesson.
 *
 * Currently showing the "New Theme 2027" reference deck. For the previous
 * Evolve-theme lesson, import `session1Deck, session1Meta` from
 * './decks/session1Deck' instead.
 */
export function App() {
  return (
    <div className="h-screen w-screen">
      <Deck slides={nw2027Deck} meta={nw2027Meta} transition="slide" />
    </div>
  )
}
