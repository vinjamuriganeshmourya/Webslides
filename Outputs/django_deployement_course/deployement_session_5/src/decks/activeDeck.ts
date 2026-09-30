/**
 * THE ONE SESSION-OWNED SEAM.
 *
 * Everything else under `src/` is kit: `sync-kit.mjs` overwrites it from the
 * template and edits there will be lost. This file is the exception, and it is
 * the only place a session's deck is named. `src/App.tsx` and
 * `src/export/slideModule.tsx` both import `{ deck, meta }` from here.
 */
export { makefileDeck as deck, makefileMeta as meta } from './makefileDeck'
