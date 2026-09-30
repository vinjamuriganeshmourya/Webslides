/**
 * THE ONE SESSION-OWNED SEAM.
 *
 * `src/App.tsx` (the player) and `src/export/slideModule.tsx` (the NewGen host
 * export) both import `{ deck, meta }` from here, so pointing a session at a
 * different deck is this file and nothing else.
 */
export { dockerHubDeck as deck, dockerHubMeta as meta } from './dockerHubDeck'
