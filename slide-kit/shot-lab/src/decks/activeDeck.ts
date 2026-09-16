/**
 * THE ONE SESSION-OWNED SEAM. Point this at the deck that is live; the player
 * and the export module both import `{ deck, meta }` from here.
 */
export { labDeck as deck, labMeta as meta } from './labDeck'
