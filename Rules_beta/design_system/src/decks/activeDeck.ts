/**
 * THE ONE SESSION-OWNED SEAM.
 *
 * `sync-kit.mjs` overwrites every other file under `src/`, and never this one.
 * Point it at `sampleDeck` when a layout looks wrong, at `baseDeck` when the
 * theme looks wrong, and back here when you are done.
 */
export { designSystemDeck as deck, designSystemMeta as meta } from './designSystemDeck'
