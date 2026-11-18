// Post-build step for the single-file bundle: rewrites every "/assets/..."
// and "/shots/..." reference in dist-single/index.html to a base64 data URI
// read from public/, so the page needs no sibling files at all.
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const htmlPath = join(root, 'dist-single', 'index.html')
let html = readFileSync(htmlPath, 'utf8')

const MIME = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
  ico: 'image/x-icon', mp4: 'video/mp4',
}

// The optional leading "." matters: Vite emits the favicon as "./assets/…" while
// the bundled JS carries root-absolute "/assets/…". Matching only the latter left
// a stray "." glued to the front of the data URI. Longest-first so the "./" form
// is consumed before its own "/" suffix would be.
const refs = [...new Set(html.match(/\.?\/(?:assets|shots)\/[\w./-]+\.\w+/g) ?? [])].sort(
  (a, b) => b.length - a.length,
)
/*
  AN IMAGE THE SCRIPT NAMES MORE THAN ONCE IS EMBEDDED ONCE (low-end pass, 2026-11-13).

  Every reference used to be swapped for the whole data URI where it stood, so the footer mark, which three slide
  frames each name, went into the script three times: 835 KB of a 9 MB deck that the browser read, kept and
  scanned for nothing. Where the script holds the path as a whole string of its own (`src:"/assets/x.png"`), each
  of those is replaced by one constant declared at the top of the module, and the data URI is written there once.
  A path that is part of a longer string, or that stands where only a literal may (an object key, which is the
  one followed by a colon), is left to the plain swap below, exactly as before. The values the deck runs with are
  the same strings.
*/
const MODULE_OPEN = /<script type="module"[^>]*>/
let hoisted = 0
const declarations = []
const dataUriOf = (ref) => {
  const file = join(root, 'public', ref.replace(/^\.?\//, ''))
  if (!existsSync(file)) return null
  const ext = ref.split('.').pop().toLowerCase()
  return `data:${MIME[ext] ?? 'application/octet-stream'};base64,${readFileSync(file).toString('base64')}`
}
const open = MODULE_OPEN.exec(html)
if (open) {
  /* only inside the module's own text: the same path in the head or in a stylesheet is not JavaScript */
  const from = open.index + open[0].length
  const to = html.indexOf('</script>', from)
  let code = html.slice(from, to)
  for (const ref of refs) {
    if (ref.startsWith('.')) continue
    const literal = JSON.stringify(ref)
    /* a whole literal in a value position: not an object key or a method name (those are followed by `:` or `(`) */
    const whole = new RegExp(literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![:(])', 'g')
    const uses = code.match(whole)?.length ?? 0
    if (uses < 2) continue
    const dataUri = dataUriOf(ref)
    if (!dataUri) continue
    let name = `__deckAsset${declarations.length}`
    while (html.includes(name)) name += '_'
    code = code.replace(whole, name)
    declarations.push(`const ${name}=${JSON.stringify(dataUri)};`)
    hoisted += uses
  }
  if (declarations.length) html = html.slice(0, from) + declarations.join('') + code + html.slice(to)
}

let inlined = 0, missing = []
for (const ref of refs) {
  const dataUri = dataUriOf(ref)
  if (!dataUri) { missing.push(ref); continue }
  html = html.split(ref).join(dataUri)
  inlined++
}

writeFileSync(htmlPath, html)

// Everything is now a data URI, so the copies Vite made of public/ are dead
// weight. Remove them and the build output is unambiguously ONE shippable file.
if (!missing.length) {
  for (const dir of ['assets', 'shots']) {
    rmSync(join(root, 'dist-single', dir), { recursive: true, force: true })
  }
}

console.log(`Inlined ${inlined}/${refs.length} assets${declarations.length ? ` (${declarations.length} shared by ${hoisted} uses)` : ''}. Output: ${(html.length / 1024 / 1024).toFixed(2)} MB`)
if (missing.length) console.log('Missing files:', missing.join(', '))
