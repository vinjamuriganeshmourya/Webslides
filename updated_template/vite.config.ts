import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

const cfg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./deck.config.json', import.meta.url)), 'utf8'),
) as { title: string; devPort?: number }

/** The browser-tab title, from `deck.config.json`, so index.html names nothing. */
function deckTitle() {
  return {
    name: 'deck-title',
    transformIndexHtml: (html: string) => html.replace(/%DECK_TITLE%/g, cfg.title),
  }
}

export default defineConfig({
  plugins: [react(), deckTitle()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: cfg.devPort ?? 5173,
    strictPort: true,
  },
})
