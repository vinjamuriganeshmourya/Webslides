/**
 * THE ONE SESSION-OWNED SEAM. Point this at the deck that is live; the player
 * and the export module both import `{ deck, meta }` from here.
 */
export { gridDeck as deck, gridMeta as meta } from './gridDeck'
