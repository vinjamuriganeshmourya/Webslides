#!/usr/bin/env node
/*
 * pristine-check: the page the Download and save-into-file buttons write is the page that was built.
 *
 *   node pristine-check.mjs <path/to/deck.html>
 *
 * `src/deck/pristine.ts` no longer serialises the whole document when the deck opens (10 MB of string on every
 * load, for a button most sessions never press); it notes the page's nodes and makes the string when it is asked
 * for. This check is what makes that safe: it parses the built file afresh, in a document that runs nothing, and
 * compares that with `window.__DECK_HTML__` read from the RUNNING deck after it has mounted, moved between slides
 * and appended its own styles, character for character. Prints PRISTINE OK, or the first place the two differ
 * and exits 1.
 */
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const { chromium } = createRequire(resolve(here, 'package.json'))('playwright-core')

const file = process.argv[2]
if (!file || !existsSync(file)) {
  console.error('usage: node pristine-check.mjs <deck.html>')
  process.exit(2)
}
const text = readFileSync(file, 'utf8')
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/brave-browser' })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: 'load' })
await page.waitForFunction(() => window.__DECK__ && window.__DECK__.total > 0, null, { timeout: 60000 })
/* let the deck do what it does to its own document: a few slides, their styles and portals */
for (const n of [3, 6, 2]) {
  await page.evaluate((x) => (location.hash = `#/${x}`), n)
  await page.waitForTimeout(400)
}
const r = await page.evaluate((source) => {
  const want = '<!doctype html>\n' + new DOMParser().parseFromString(source, 'text/html').documentElement.outerHTML
  const got = window.__DECK_HTML__
  if (typeof got !== 'string') return { ok: false, why: '__DECK_HTML__ is not a string' }
  if (got === want) return { ok: true, length: got.length }
  let i = 0
  while (i < got.length && i < want.length && got[i] === want[i]) i++
  return { ok: false, why: `differs at character ${i} of ${want.length} (got ${got.length})`, want: want.slice(Math.max(0, i - 60), i + 80), got: got.slice(Math.max(0, i - 60), i + 80) }
}, text)
await browser.close()
if (r.ok) {
  console.log(`PRISTINE OK  (${(r.length / 1048576).toFixed(2)} MB, identical to the built file)`)
} else {
  console.log(`PRISTINE FAIL: ${r.why}`)
  if (r.want) console.log(`  built : ${JSON.stringify(r.want)}\n  kept  : ${JSON.stringify(r.got)}`)
  process.exit(1)
}
