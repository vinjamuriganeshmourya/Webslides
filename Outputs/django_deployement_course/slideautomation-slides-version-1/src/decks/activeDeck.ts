/**
 * THE ONE SESSION-OWNED SEAM.
 *
 * Everything else under `src/` is kit and `sync-kit.mjs` overwrites it. To point
 * this session at a different deck, edit this file only.
 */
export { slideAutomationV1Deck as deck, slideAutomationV1Meta as meta } from './slideAutomationV1Deck'
