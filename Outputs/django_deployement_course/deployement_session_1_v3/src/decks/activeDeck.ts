/**
 * THE ONE SESSION-OWNED SEAM.
 *
 * Everything else under `src/` is kit and `sync-kit.mjs` overwrites it. To point
 * this session at a different deck, edit this file only.
 */
export { deploymentSession1V3Deck as deck, deploymentSession1V3Meta as meta } from './deploymentSession1V3Deck'
