import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

const cfg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./deck.config.json', import.meta.url)), 'utf8'),
) as { title: string }

function deckTitle() {
  return {
    name: 'deck-title',
    transformIndexHtml: (html: string) => html.replace(/%DECK_TITLE%/g, cfg.title),
  }
}

/**
 * Standalone build: inlines all JS/CSS into one index.html so the deck opens
 * directly from the filesystem (file://) without a dev server. The two
 * post-build scripts then fold the logo and the fonts in as data URIs.
 *
 * CSS minification is off for the same reason it is off in the kit: esbuild's
 * CSS minifier emits `@media(hover:hover)and(pointer:fine)`, which browsers
 * discard. There is no such query here today; the setting is kept so one
 * added later does not break silently in the one build that ships.
 */
export default defineConfig({
  plugins: [react(), viteSingleFile(), deckTitle()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-single',
    cssMinify: false,
  },
})
