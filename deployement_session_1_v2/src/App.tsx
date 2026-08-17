import { Deck } from './deck/Deck'
import { deploymentSession1Deck, deploymentSession1Meta } from './decks/deploymentSession1Deck'

/**
 * App shell for `deployement_session_1_v2`.
 *
 * Deployment · Session 1 ("Introduction to Docker") on the **Evolve**
 * layouts that ship with the template — a single-theme rebuild of v1, which
 * layered a second "New Theme 2027" kit on top. The mapping and the reasoning
 * live in `Web Slides/workflow/plans/deployement_session_1_v2.md`.
 *
 * `sampleDeck` is kept in ./decks as the layout reference: it exercises every
 * slide type in the kit and is the right thing to open when a layout looks
 * wrong.
 */
export function App() {
  return (
    <div className="h-screen w-screen">
      <Deck slides={deploymentSession1Deck} meta={deploymentSession1Meta} transition="slide" />
    </div>
  )
}
