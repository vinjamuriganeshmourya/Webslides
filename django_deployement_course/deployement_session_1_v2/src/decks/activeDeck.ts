/**
 * THE ONE SESSION-OWNED SEAM. See `slide-template/KIT.md`.
 *
 * `src/App.tsx` and `src/export/slideModule.tsx` are kit files, identical in
 * every session, and they reach the live deck through this module rather than by
 * importing it under its own name. To point this session at a different deck,
 * edit this file and nothing else.
 */
export { deploymentSession1Deck as deck, deploymentSession1Meta as meta } from './deploymentSession1Deck'
