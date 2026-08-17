import { Deck } from './deck/Deck'
import { deploymentSession1Deck, deploymentSession1Meta } from './decks/deploymentSession1Deck'

/**
 * App shell for `deployement_session_1_v1`.
 *
 * Showing the Deployment · Session 1 deck ("From Localhost to Anywhere"),
 * built on the "New Theme 2027" layouts from the NxtWave PPT Template Figma.
 *
 * The template's own reference decks are still in ./decks — `nw2027Deck` is the
 * frame-by-frame diff against the Figma file and is the right thing to open
 * when a layout looks wrong; `session1Deck` / `sampleDeck` are Evolve-theme.
 */
export function App() {
  return (
    <div className="h-screen w-screen">
      <Deck slides={deploymentSession1Deck} meta={deploymentSession1Meta} transition="slide" />
    </div>
  )
}
