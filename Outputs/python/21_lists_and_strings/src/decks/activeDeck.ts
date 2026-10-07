/**
 * THE ONE SESSION-OWNED SEAM.
 *
 * Everything else under `src/` is kit: `sync-kit.mjs` overwrites it from the
 * template and your edits there will be lost. This file is the exception: the
 * player and the export host both import `{ deck, meta }` from here, and a
 * session re-exports its own deck under those two names.
 */
export { listsStringsDeck as deck, listsStringsMeta as meta } from './listsStringsDeck'
