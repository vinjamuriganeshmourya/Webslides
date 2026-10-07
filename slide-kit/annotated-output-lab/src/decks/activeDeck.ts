/**
 * THE ONE SESSION-OWNED SEAM.
 *
 * Everything else under `src/` is kit: `sync-kit.mjs` overwrites it from the
 * template. This file is the exception, and it exists so the two kit files that
 * need a deck's NAME (`src/App.tsx` and `src/export/slideModule.tsx`) do not
 * have to know it: both import `{ deck, meta }` from here.
 *
 * This lab renders its own gallery of annotated-output candidates rather than
 * the kit's sample deck, because the four candidates are the whole point of the
 * directory.
 */
export { annotatedOutputLabDeck as deck, annotatedOutputLabMeta as meta } from './annotatedOutputLabDeck'
