// Post-build step for the single-file bundle: replaces the Google Fonts <link>
// in dist-single/index.html with a <style> block whose @font-face rules carry
// base64 woff2 payloads, so the deck renders in Poppins / Inter / JetBrains Mono
// with no network at all.
//
// Run AFTER inline-assets.mjs. Requires network access at build time only.
// If the fetch fails the CDN <link> is left in place and the build still
// succeeds — the deck then needs a connection for correct typography.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const cfg = JSON.parse(readFileSync(join(root, 'deck.config.json'), 'utf8'))
const htmlPath = join(root, 'dist-single', 'index.html')
let html = readFileSync(htmlPath, 'utf8')

// Pull the exact family spec out of the built HTML so this script never drifts
// from index.html. One source of truth: the <link> itself.
const linkRe = /<link\s+[^>]*href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"[^>]*\/?>/
const m = html.match(linkRe)
if (!m) {
  console.log('inline-fonts: no Google Fonts <link> found, nothing to do.')
  process.exit(0)
}

// Chrome UA so Google serves woff2 (an unknown UA gets legacy ttf, ~4x larger).
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Google's endpoints intermittently drop a connection mid-build; three tries
// with a short backoff turns a failed build into a slower one.
async function get(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r
    } catch (err) {
      if (i >= tries) throw new Error(`${url.slice(0, 60)}… → ${err.message}`)
      await new Promise((ok) => setTimeout(ok, 400 * i))
    }
  }
}

/*
  THE FONT SHEET IS THE ENGINE'S OWN COPY, NOT WHATEVER GOOGLE ANSWERS TODAY (2026-11-13, low-end pass).

  This step used to fetch the stylesheet and its woff2 files from Google on every build and swap each
  `https://fonts.gstatic.com/....woff2` for a data URI. On 2026-11-13 one build in about twenty got a different
  answer: the same 41 faces, but DM Sans 500 / 600 and all of Fira Code pointing at `fonts.gstatic.com/l/font?kit=...`,
  which does not end in `.woff2`. Those 25 faces were left remote and the build said it had succeeded. A deck built
  at that moment shows its body text in a fallback font on any PC without a connection, which is most classrooms,
  and nothing checked for it.

  So the sheet with its fonts embedded is kept in `fonts/`, named by a hash of the Google URL in `index.html`, and
  every build inserts that file. It is the sheet every deck of the course already ships (the same 945,804
  characters in each of them), so a rebuilt deck is typeset exactly as before, builds no longer need a network, and
  two builds of one deck are the same file. Only when `index.html` asks for a family the engine has no copy of is
  Google asked, once: every remote URL in the answer is embedded whatever it looks like, the result is refused if
  anything remote is left in it, and it is written to `fonts/` for every build after.
*/
const withoutComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '')
const remoteLeft = (css) => (withoutComments(css).match(/url\(\s*["']?https?:/g) ?? []).length

async function fetchSheet(cssUrl) {
  let css = await (await get(cssUrl)).text()
  const urls = [...new Set([...css.matchAll(/url\(\s*["']?(https?:\/\/[^)"']+)["']?\s*\)/g)].map((x) => x[1]))]
  const fetched = await Promise.all(
    urls.map(async (u) => {
      const r = await get(u)
      const type = (r.headers.get('content-type') || 'font/woff2').split(';')[0]
      return [u, `data:${type};base64,${Buffer.from(await r.arrayBuffer()).toString('base64')}`]
    }),
  )
  for (const [u, dataUri] of fetched) css = css.split(u).join(dataUri)
  if (!/@font-face/.test(css)) throw new Error('the answer holds no @font-face rule')
  if (remoteLeft(css)) throw new Error(`${remoteLeft(css)} font file(s) could not be embedded`)
  return css
}

async function main() {
  const cssUrl = m[1].replace(/&amp;/g, '&')
  const cacheFile = join(root, 'fonts', `google-${createHash('sha1').update(cssUrl).digest('hex').slice(0, 12)}.css`)
  let css
  let from
  if (existsSync(cacheFile)) {
    css = readFileSync(cacheFile, 'utf8')
    from = `the engine's own copy, fonts/${cacheFile.split('/').pop()}`
  } else {
    css = await fetchSheet(cssUrl)
    mkdirSync(join(root, 'fonts'), { recursive: true })
    writeFileSync(cacheFile, css)
    from = `fetched from Google and kept as fonts/${cacheFile.split('/').pop()}`
  }
  if (remoteLeft(css)) throw new Error(`the font sheet still names ${remoteLeft(css)} remote file(s)`)

  // Drop the <link> plus the two preconnect hints it no longer needs.
  html = html
    .replace(linkRe, () => `<style>\n${css}\n</style>`)
    .replace(/<link\s+rel="preconnect"[^>]*fonts\.(googleapis|gstatic)\.com"[^>]*\/?>\s*/g, '')

  writeFileSync(htmlPath, html)
  const files = (css.match(/url\(\s*["']?data:/g) ?? []).length
  console.log(`inline-fonts: embedded ${files} font files in ${(css.match(/@font-face/g) ?? []).length} faces (${from}). Output: ${(html.length / 1024 / 1024).toFixed(2)} MB`)
  finish(html)
}

// A double-clickable copy with a name that says what it is. index.html is kept
// so the folder also works as-is on a static host.
function finish(out) {
  /* The double-clickable name comes from deck.config.json, so this script is kit
     and every session's build:html still emits a file named after that deck. */
  const rel = `dist-single/${cfg.htmlName}.html`
  writeFileSync(join(root, rel), out)
  console.log(`\n  Deck ready:  ${rel}  (${(out.length / 1024 / 1024).toFixed(2)} MB, self-contained)\n`)
}

main().catch((err) => {
  console.warn(`inline-fonts: FONTS NOT EMBEDDED (${err.message}). THIS DECK NEEDS A NETWORK FOR ITS FONTS: do not hand it on, build again.`)
  finish(readFileSync(htmlPath, 'utf8'))
})
