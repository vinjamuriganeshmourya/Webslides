/**
 * THE ONE SESSION-OWNED SEAM. Point the player and the export at this session's
 * deck; every other file under `src/` is kit and is overwritten by sync-kit.mjs.
 */
export { programmingWithPythonDeck as deck, programmingWithPythonMeta as meta } from './programmingWithPythonDeck'
