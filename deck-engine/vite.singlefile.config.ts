import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error plain ESM helper, no types
import { deckPlugin } from './deck-plugin.mjs'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

/**
 * The browser-tab title, from `deck.config.json`.
 *
 * `index.html` is a KIT file, so it cannot carry a session's name: whatever it
 * said would be overwritten in every other session by the next `sync-kit`. It
 * used to say "NIAT · Web Slides", which meant the tab of a finished deck, and
 * the tab of the self-contained HTML people are handed, named the template
 * instead of the session.
 *
 * So the title is a placeholder that this plugin fills from the one file a
 * session owns. Session name now lives in exactly one place per session.
 */
function deckTitle() {
  const { title } = JSON.parse(
    readFileSync(fileURLToPath(new URL('./deck.config.json', import.meta.url)), 'utf8'),
  )
  return {
    name: 'deck-title',
    transformIndexHtml: (html: string) => html.replace(/%DECK_TITLE%/g, title),
  }
}


/**
 * THE SECOND PASS OF `scripts/prune-icons.mjs`: the library icons this deck's script never names are left out.
 *
 * `net/fx.tsx` fills its name-to-image map with an eager glob over `./icons/*.png`, which the bundler turns into
 * one import per file, FROM fx.tsx. `DECK_DROP_ICONS` is the list the first pass worked out; for each name on it,
 * that import, and only that import, is answered with an empty module, so the map still has the key and the
 * 2 MB of pictures nobody asks for are not in the file.
 *
 * Scoped to the importer on purpose. An image a session ships that happens to be the same file as a library icon,
 * and an engine figure that imports an icon directly (`net/overview-school.tsx`), are other imports of other
 * modules and resolve as they always did. The first version of the pruning matched by content in the built file
 * and blanked a session's picture with the icon it was a copy of; this cannot.
 */
function dropIcons() {
  const drop = new Set((process.env.DECK_DROP_ICONS ?? '').split(',').filter(Boolean))
  const DROPPED = '\0deck-dropped-icon:'
  return {
    name: 'deck-drop-icons',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      if (!drop.size || !importer || !/\/src\/decks\/figures\/net\/fx\.tsx$/.test(importer.split('?')[0])) return null
      const m = /^\.\/icons\/([\w-]+)\.png(?:\?.*)?$/.exec(source)
      return m && drop.has(m[1]) ? DROPPED + m[1] : null
    },
    load(id: string) {
      return id.startsWith(DROPPED) ? 'export default ""' : null
    },
  }
}

// Standalone build: inlines all JS/CSS into one index.html so the deck
// opens directly from the filesystem (file://) without a dev server.
export default defineConfig({
  plugins: [dropIcons(), deckPlugin(), react(), viteSingleFile(), deckTitle()],
  /*
    THE SCRIPT IS WRITTEN IN ASCII (low-end pass, 2026-11-13).

    A deck's script is 8 MB, most of it the images as base64. A browser keeps a script's text for as long as the
    page is open, one byte a character if every character fits in one byte and two if any single one does not.
    Seven characters in the whole of it did not (a curly apostrophe, an ellipsis, a tick and a cross from the slide
    copy), so all 8 MB were held twice over and read by the slower two-byte scanner. `charset: 'ascii'` writes those
    seven as `\u2019`-style escapes: the strings the deck runs with are the same strings, and the page they come
    from is half the size in memory.
  */
  esbuild: { charset: 'ascii' },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-single',
    /*
      CSS MINIFICATION IS OFF, AND THAT IS A BUG FIX, NOT A PREFERENCE.

      esbuild's CSS minifier rewrites

        @media (hover: hover) and (pointer: fine) { ... }

      as

        @media(hover:hover)and(pointer:fine) { ... }

      dropping the space before `and`, which is not valid CSS. It warns about its
      own output -- `Expected "{" but found "and("` -- and then ships it. A
      browser cannot parse the query, so it discards the whole block, and
      `src/index.css` has two of them: the flowchart node hover lift and the
      bare-node shadow handoff simply do not work in the deliverable.

      This is the S8 class of bug all over again: it works in `npm run dev`, it
      works in `npm run build`, and it is broken in the one build that ships,
      silently. It was found by reading a build warning that had been scrolling
      past for several sessions.

      The trade is nothing. A deck is 3 to 4 MB of inlined woff2 and base64
      images; the CSS is a few tens of KB and unminified costs single-digit KB
      after gzip, on a file that is opened from the filesystem anyway. Correctness
      at that price is not a decision.

      JS minification is untouched -- this only turns off the CSS pass.
    */
    cssMinify: false,
  },
})
