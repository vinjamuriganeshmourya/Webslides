/**
 * THE ONE SESSION-OWNED SEAM.
 *
 * Everything else under `src/` is kit: `sync-kit.mjs` overwrites it from the
 * template and your edits there will be lost. This file is the exception, and it
 * exists so that the two files which need to know a deck's NAME do not have to.
 *
 * `src/App.tsx` (the player) and `src/export/slideModule.tsx` (the NewGen host
 * export) both used to import the session deck by its own exported identifiers:
 *
 *     import { dockerFileCreationDeck, dockerFileCreationMeta } from '@/decks/dockerFileCreationDeck'
 *
 * which made two otherwise-identical kit files different in every session, for
 * no reason other than the name of a variable. They now both import `{ deck, meta }`
 * from here, and a session re-exports its own deck under those two names.
 *
 * So: to point a session at a different deck, edit THIS FILE ONLY. Two lines.
 */
export { nestedLoopsDeck as deck, nestedLoopsMeta as meta } from './nestedLoopsDeck'
