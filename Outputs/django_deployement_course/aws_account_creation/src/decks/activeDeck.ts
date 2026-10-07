/**
 * THE ONE SESSION-OWNED SEAM.
 *
 * Everything else under `src/` is kit: `sync-kit.mjs` overwrites it from the
 * template and your edits there will be lost. This file is the exception.
 *
 * To point this module at a different deck, edit THIS FILE ONLY. One line.
 */
export { awsAccountDeck as deck, awsAccountMeta as meta } from './awsAccountDeck'
